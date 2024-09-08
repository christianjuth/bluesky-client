import {
  getSession,
  getDiscoveryFeed,
  getFeedGenerator,
  getActorFeeds,
} from "@/lib/atp-client";
import { VirtualizedPosts } from "@/components/virtualized-posts";
import { Post } from "@/components/post";
import { TemplateWithSidebar } from "@/components/template-with-sidebar";
import { FeedCard } from "@/components/feed-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Byline, ProfileDescription } from "@/components/profile";

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
  await getSession();

  const feedUri =
    "feed" in searchParams && typeof searchParams.feed === "string"
      ? searchParams.feed
      : DEFAULT_FEED_URI;

  const feedGenerator = await getFeedGenerator({
    feed: feedUri,
  });

  const actor = feedGenerator.creator.did;

  const popularFeedGenerators = await getActorFeeds({
    actor,
  });

  const discoveryFeed = await getDiscoveryFeed({
    uri: feedUri,
  });
  const posts = discoveryFeed?.feed.map(({ post }) => post);

  // The data we get seems to contain some helper functions.
  // Calling postsSchema.parse removes anything we don't need,
  // which prevents react from complaining about passing objects
  // with functions into client components.
  const rscPosts = posts?.slice(0, SPLIT);
  const restPosts = posts?.slice(SPLIT);

  return (
    <TemplateWithSidebar>
      <>
        <FeedCard feed={feedGenerator} className="border-b" />
        {rscPosts?.map((post) => <Post key={post.uri} post={post} />)}
        {restPosts && (
          <VirtualizedPosts
            defaultPosts={restPosts.map((p) => ({ post: p }))}
          />
        )}
      </>
      <div className="w-80 -mr-20 p-4 border rounded-xl space-y-5 flex flex-col">
        <div className="space-y-2">
          <div className="text-muted-foreground uppercase text-sm">
            Feed creator
          </div>
          <Byline profile={feedGenerator.creator} />
          <ProfileDescription
            profile={feedGenerator.creator}
            className="text-sm"
          />
        </div>

        <div className="flex flex-col items-start space-y-2">
          <div className="text-muted-foreground">
            Other feeds by @{feedGenerator.creator.handle}
          </div>
          {popularFeedGenerators.feeds.map((feed) => (
            <Button key={feed.uri} asChild size="sm" variant="outline">
              <Link href={`?feed=${feed.uri}`}>{feed.displayName}</Link>
            </Button>
          ))}
        </div>
      </div>
    </TemplateWithSidebar>
  );
}
