import {
  getSession,
  agent,
  publicAgent,
  getMyLikedPosts,
  getFeed,
} from "@/lib/bsky/agent";
import { feedSchema } from "@/lib/schemas";
import { type NextRequest, NextResponse } from "next/server";
import { InferNextResponseJSON } from "@/lib/type-utils";
import { type AtpAgent } from "@atproto/api";
import z from "zod";

const searchParamsSchema = z.union([
  z.object({
    cursor: z.string().optional(),
    mode: z.union([
      z.literal("overview"),
      z.literal("posts"),
      z.literal("replies"),
      z.literal("likes"),
    ]),
    userId: z.string(),
    feedUri: z.undefined(),
    limit: z.number().optional(),
  }),
  z.object({
    cursor: z.string().optional(),
    mode: z.literal("feed"),
    userId: z.undefined(),
    feedUri: z.string(),
    limit: z.number().optional(),
  }),
]);

async function getAuthorFeed(
  agent: AtpAgent,
  params: {
    actor: string;
    limit: number;
    cursor?: string;
  },
) {
  const res = await agent.getAuthorFeed(params);
  return feedSchema.parse(res.data);
}

async function getPosts(
  agent: AtpAgent,
  params: {
    actor: string;
    limit: number;
    cursor?: string;
  },
) {
  const res = await agent.getAuthorFeed({
    ...params,
    filter: "posts_no_replies",
  });
  return feedSchema.parse(res.data);
}

async function getReplies(
  agent: AtpAgent,
  params: {
    actor: string;
    limit: number;
    cursor?: string;
  },
) {
  const res = await agent.getAuthorFeed({
    ...params,
    filter: "posts_no_replies",
  });
  const filtered = res.data.feed.filter((p) => Boolean(p.reply));
  return feedSchema.parse({
    cursor: res.data.cursor,
    feed: filtered,
  });
}

async function getLikes(params: {
  actor: string;
  limit: number;
  cursor?: string;
}) {
  const res = await getMyLikedPosts({
    ...params,
  });
  return feedSchema.parse(
    res
      ? {
          cursor: res.cursor,
          feed: res.posts,
        }
      : {
          feed: [],
        },
  );
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const session = await getSession();

  try {
    const {
      cursor,
      mode,
      userId,
      feedUri,
      limit = 20,
    } = searchParamsSchema.parse({
      cursor: searchParams.get("cursor") ?? undefined,
      mode: searchParams.get("mode") ?? undefined,
      feedUri: searchParams.get("feedUri") ?? undefined,
      userId: searchParams.get("userId") ?? undefined,
    });

    const selectedAgent = session ? agent : publicAgent;

    switch (mode) {
      case "likes":
        return NextResponse.json(
          await getLikes({
            actor: userId,
            limit,
            cursor,
          }),
        );
      case "replies":
        return NextResponse.json(
          await getReplies(selectedAgent, {
            actor: userId,
            limit,
            cursor,
          }),
        );
      case "posts":
        return NextResponse.json(
          await getPosts(selectedAgent, {
            actor: userId,
            limit,
            cursor,
          }),
        );
      case "feed":
        return NextResponse.json(
          await getFeed({
            uri: feedUri,
            limit,
            cursor,
          }),
        );
      case "overview":
      default:
        return NextResponse.json(
          await getAuthorFeed(selectedAgent, {
            actor: userId,
            limit,
            cursor,
          }),
        );
    }
  } catch (e) {
    return NextResponse.json({
      errors: e,
    });
  }
}

export type GetResponse = InferNextResponseJSON<typeof GET>;

export type QueryParams = z.infer<typeof searchParamsSchema>;
