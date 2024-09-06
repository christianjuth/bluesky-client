import { AtpAgent } from "@atproto/api";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import z from "zod";
import * as routes from "@/lib/routes";
import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { cache } from "react";

/**
 * Disable caching for now to prevent Next.js from
 * showing perminatly outdated data. In the future
 * we may want to do a revalidate cache or similar,
 * but that should be handled per request.
 */
export const agent = new AtpAgent({
  service: "https://bsky.social",
  // service: 'https://public.api.bsky.app',
  fetch: (input, init) =>
    fetch(input, {
      ...init,
      cache: "no-store",
    }),
});

export const publicAgent = new AtpAgent({
  service: "https://public.api.bsky.app",
  fetch: (input, init) =>
    fetch(input, {
      ...init,
      cache: "no-store",
    }),
});

const sessionSchema = z.object({
  accessJwt: z.string(),
  refreshJwt: z.string(),
  did: z.string(),
  handle: z.string(),
});

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
export const getSession = cache(async () => {
  try {
    const { accessJwt, refreshJwt, did, handle } = sessionSchema.parse({
      accessJwt: cookies().get("accessJwt")?.value,
      refreshJwt: cookies().get("refreshJwt")?.value,
      did: cookies().get("did")?.value,
      handle: cookies().get("handle")?.value,
    });

    await agent.resumeSession({
      accessJwt,
      refreshJwt,
      did,
      handle,
      active: true,
    });

    return {
      did,
      handle,
    };
  } catch (e) {
    return null;
  }
});

export const requireSession = async () => {
  const session = await getSession();

  if (!session) {
    redirect(routes.auth);
  }

  return session;
};

const likesSchema = z.array(
  z.object({
    value: z.object({
      subject: z.object({
        uri: z.string(),
      }),
    }),
  }),
);

export const getMyLikedPosts = async (params: {
  limit?: number;
  cursor?: string;
}) => {
  const session = await getSession();
  const userId = session?.handle;

  if (!userId) {
    return null;
  }

  const likes = await agent.com.atproto.repo.listRecords({
    ...params,
    repo: userId,
    collection: "app.bsky.feed.like",
  });

  const uris = likesSchema
    .parse(likes.data.records)
    .map(({ value }) => value.subject.uri);

  const posts = await agent.getPosts({
    uris,
  });

  return {
    cursor: likes.data.cursor,
    posts: posts.data.posts,
  };
};

export const userIsMyself = async (userId: string) => {
  const session = await getSession();
  return session?.handle === userId || session?.did === userId;
};

export const randomTimeIntervalStabalizedString = (
  stringRotationSeconds: number,
  maxStringLength: number,
) => {
  const now = new Date();
  const interval = Math.floor(now.getTime() / (stringRotationSeconds * 1000));

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let index = 0;

  let output = "";

  let i = 0;

  for (const number of interval.toString()) {
    index += +number;
    index = index % characters.length;
    output += characters[index];
    i++;
    if (i >= maxStringLength) {
      break;
    }
  }

  return output;
};

export const searchPosts = async (params: { query: string; limit: number }) => {
  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=${params.query}`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data as { posts: PostView[]; cursor: string };
};

export const searchHashtags = async (params: {
  query: string;
  limit: number;
}) => {
  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?tag=${params.query}&q=${params.query}`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data as { posts: PostView[]; cursor: string };
};

const REVALIDATE_DISCOVER_INTERVAL = 60;
export const getDiscoveryFeed = async () => {
  const randomString = randomTimeIntervalStabalizedString(
    REVALIDATE_DISCOVER_INTERVAL,
    3,
  );
  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=${randomString}`,
    {
      next: {
        revalidate: REVALIDATE_DISCOVER_INTERVAL,
      },
    },
  );
  const data = await res.json();
  return data as { posts: PostView[]; cursor: string };
};

export function logout() {
  cookies().delete("accessJwt");
  cookies().delete("refreshJwt");
  cookies().delete("did");
  cookies().delete("handle");
}
