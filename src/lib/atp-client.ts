import { AtpAgent } from '@atproto/api'
import { cookies } from 'next/headers'
import z from 'zod'

/**
 * Disable caching for now to prevent Next.js from
 * showing perminatly outdated data. In the future
 * we may want to do a revalidate cache or similar,
 * but that should be handled per request.
 */
export const agent = new AtpAgent({
  service: 'https://bsky.social',
  fetch: (input, init) => fetch(input, {
    ...init,
    cache: "no-store"
  }),
})

const sessionSchema = z.object({
  accessJwt: z.string(),
  refreshJwt: z.string(),
  did: z.string(),
  handle: z.string(),
})

let sessionCache: z.infer<typeof sessionSchema> | null = null

/**
 * This function assumes that it is called within a server component since
 * it extracts the session using next/headers cookies().
 *
 * This will:
 * - Extract the session from the cookies
 * - Resume the session with the agent
 * - Cache the session for future calls
 * - Reutrn user did (decentralized identifier) and handle
 */
export const getSession = async () => {
  if (sessionCache) {
    return {
      did: sessionCache.did,
      handle: sessionCache.handle
    }
  }

  try {
    const {
      accessJwt,
      refreshJwt,
      did,
      handle,
    } = sessionSchema.parse({
      accessJwt: cookies().get('accessJwt')?.value,
      refreshJwt: cookies().get('refreshJwt')?.value,
      did: cookies().get('did')?.value,
      handle: cookies().get('handle')?.value,
    })

    await agent.resumeSession({
      accessJwt,
      refreshJwt,
      did,
      handle,
      active: true,
    })

    sessionCache = {
      accessJwt,
      refreshJwt,
      did,
      handle,
    }

    return {
      did,
      handle,
    }
  } catch (e) {
    console.log(e)
    return null;
  }
}

const likesSchema = z.array(z.object({
  value: z.object({
    subject: z.object({
      uri: z.string()
    })
  })
}));

export const getMyLikedPosts = async () => {
  const session = await getSession();
  const userId = session?.handle;

  if (!userId) {
    return []
  }

  const likes = await agent.com.atproto.repo.listRecords({
    repo: userId,
    collection: "app.bsky.feed.like",
    limit: 10,
  })

  const uris = likesSchema.parse(likes.data.records).map(({ value }) => value.subject.uri);

  const posts = await agent.getPosts({
    uris,
  })

  return posts
}

export const userIsMyself = async (userId: string) => {
  const session = await getSession();
  return session?.handle === userId || session?.did === userId;
}
