import { AtpAgent } from "@atproto/api";
import { cookies } from "next/headers";
import z from "zod";
import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { cache } from "react";
import {
  feedSchema,
  feedGeneratorsSchema,
  feedGeneratorSchema,
  savedFeedsPrefSchema,
} from "../schemas";

/**
 * Disable caching for now to prevent Next.js from
 * showing perminatly outdated data. In the future
 * we may want to do a revalidate cache or similar,
 * but that should be handled per request.
 */
export const agent = new AtpAgent({
  service: "https://bsky.social",
  // service: 'https://public.api.bsky.app',
  fetch: (input, init) => {
    // console.log("fetching", typeof input === 'string' ? input : input.url);
    return fetch(input, {
      ...init,
      cache: "no-store",
    });
  },
});

export const publicAgent = new AtpAgent({
  service: "https://public.api.bsky.app",
  fetch: (input, init) => {
    return fetch(input, {
      ...init,
      cache: "no-store",
    });
  },
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

export const getSavedFeeds = async () => {
  const { data } = await agent.com._client.call(
    "app.bsky.actor.getPreferences",
  );
  const prefs = z.array(z.any()).parse(data.preferences);
  const feedItemPref = prefs.find(
    (pref) => savedFeedsPrefSchema.safeParse(pref).success,
  );
  return feedItemPref ? savedFeedsPrefSchema.parse(feedItemPref) : null;
};

export const getPopularFeedGenerators = async (params: {
  limit?: number;
  cursor?: string;
}) => {
  const queryParams = new URLSearchParams();
  queryParams.append("limit", String(params.limit ?? 20));
  if (params.cursor) {
    queryParams.append("cursor", params.cursor);
  }
  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.unspecced.getPopularFeedGenerators?${queryParams.toString()}`,
    {
      // next: {
      //   revalidate: 60 * 60, // 1 hour
      // },
      cache: "no-store",
    },
  );
  const data = await res.json();
  return feedGeneratorsSchema.parse(data);
};

export const getFeedGenerator = async (params: {
  /**
   * The URI of the feed generator.
   */
  feed: string;
  limit?: number;
  cursor?: string;
}) => {
  const res = await publicAgent.com._client.call(
    "app.bsky.feed.getFeedGenerator",
    {
      feed: params.feed,
    },
  );
  return feedGeneratorSchema.parse(res.data.view);
};

export const getFeedGenerators = async (params: {
  /**
   * The URI of the feed generator.
   */
  feeds: string[];
}) => {
  const res = await agent.com._client.call("app.bsky.feed.getFeedGenerators", {
    feeds: params.feeds,
  });
  return feedGeneratorsSchema.parse(res.data);
};

export const getActorFeeds = async (params: {
  actor: string;
  limit?: number;
  cursor?: string;
}) => {
  const queryParams = new URLSearchParams();
  queryParams.append("actor", params.actor);
  queryParams.append("limit", String(params.limit ?? 20));
  if (params.cursor) {
    queryParams.append("cursor", params.cursor);
  }
  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getActorFeeds?${queryParams.toString()}&rkey=likeCount`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return feedGeneratorsSchema.parse(data);
};

export const getFeed = async ({
  uri,
  limit,
  cursor,
}: {
  uri: string;
  limit?: number;
  cursor?: string;
}) => {
  const session = await getSession();
  const res = await (session ? agent : publicAgent).com._client.call(
    "app.bsky.feed.getFeed",
    {
      feed: uri,
      limit: limit ?? 30,
      cursor,
    },
  );
  return feedSchema.parse(res.data);
};

export function logout() {
  cookies().delete("accessJwt");
  cookies().delete("refreshJwt");
  cookies().delete("did");
  cookies().delete("handle");
}
