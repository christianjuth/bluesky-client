import {
  getSession,
  getFeed,
  getFeedGenerator,
  getActorFeeds,
} from "@/lib/atp-client";
import { VirtualizedPosts } from "@/components/virtualized-posts";
import { Post } from "@/components/post";
import { TemplateWithSidebar } from "@/components/template-with-sidebar";
import { FeedCard } from "@/components/feed-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  postsSchema,
  feedGeneratorSchema,
  feedGeneratorsSchema,
} from "@/lib/schemas";
import z from "zod";
import { feedRequiresAuth } from "@/lib/bsky/utils";

// The number of items that will be rendered initially
// and live outside of the virtualized list. This allows
// the first n items to be rendered immediately, without JS.
const SPLIT = 10;

const DEFAULT_FEED_URI =
  "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();

  const feedUri =
    "feed" in searchParams && typeof searchParams.feed === "string"
      ? searchParams.feed
      : DEFAULT_FEED_URI;

  const feedGenerator = await getFeedGenerator({
    feed: feedUri,
  });

  const actor = feedGenerator.creator.did;

  const feedGenerators = await getActorFeeds({
    actor,
  });
  const sortedFeeds = feedGenerators.feeds
    .filter((f) => {
      if (f.uri === feedUri) {
        return false;
      }
      if (!session) {
        return !feedRequiresAuth(f);
      }
      return true;
    })
    .toSorted((a, b) => b.likeCount - a.likeCount);

  let feed: Awaited<Awaited<ReturnType<typeof getFeed>>>;
  let posts: z.infer<typeof postsSchema>;
  try {
    feed = await getFeed({
      uri: feedUri,
      limit: 10,
    });
    posts = feed?.feed.map(({ post }) => post);
  } catch (e) {
    return (
      <TemplateWithSidebar>
        <div className="p-8 text-center">
          Hmm, some kind of issue occurred when contacting the feed server.
          Please let the feed owner know about this issue.
        </div>
        <Sidebar feedGenerator={feedGenerator} feeds={sortedFeeds} />
      </TemplateWithSidebar>
    );
  }

  // The data we get seems to contain some helper functions.
  // Calling postsSchema.parse removes anything we don't need,
  // which prevents react from complaining about passing objects
  // with functions into client components.
  const rscPosts = posts?.slice(0, SPLIT);
  const restPosts = posts?.slice(SPLIT);

  return (
    <TemplateWithSidebar>
      <>
        {rscPosts?.map((post) => <Post key={post.uri} post={post} />)}
        {restPosts && (
          <VirtualizedPosts
            defaultPosts={restPosts.map((p) => ({ post: p }))}
            defaultCursor={feed.cursor}
            mode="feed"
            feedUri={feedUri}
          />
        )}
      </>
      <Sidebar feedGenerator={feedGenerator} feeds={sortedFeeds} />
    </TemplateWithSidebar>
  );
}

function Sidebar({
  feedGenerator,
  feeds,
}: {
  feedGenerator: z.infer<typeof feedGeneratorSchema>;
  feeds: z.infer<typeof feedGeneratorsSchema>["feeds"];
}) {
  return (
    <div className="w-full p-4 border rounded-xl space-y-5 flex flex-col bg-accent/50">
      <div>
        <FeedCard feed={feedGenerator} className="py-0" />
      </div>

      <div className="flex flex-col items-start">
        <div className="text-muted-foreground text-sm mb-2">
          Other feeds by @{feedGenerator.creator.handle}
        </div>
        <div className="flex flex-row flex-wrap -mb-2">
          {feeds.map((feed) => (
            <Button
              key={feed.uri}
              asChild
              size="sm"
              variant="outline"
              className="mr-2 mb-2 pl-2"
            >
              <Link href={`?feed=${feed.uri}`}>
                {feed.avatar && (
                  <Image
                    src={feed.avatar}
                    alt={feed.displayName}
                    className="rounded-full mr-1.5"
                    width={24}
                    height={24}
                  />
                )}
                {feed.displayName}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
