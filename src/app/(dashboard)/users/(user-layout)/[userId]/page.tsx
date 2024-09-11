import { agent, publicAgent, getSession } from "@/lib/bsky/agent";
import { VirtualizedPosts } from "@/components/virtualized-posts";
import { Post } from "@/components/post";
import { feedViewPostsSchema } from "@/lib/schemas";
import { ResetScroll } from "@/components/reset-scroll";
import { ResetAboveThisPoint } from "@/components/track-scroll";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as routes from "@/lib/routes";

// The number of items that will be rendered initially
// and live outside of the virtualized list. This allows
// the first n items to be rendered immediately, without JS.
const SPLIT = 10;

export default async function Posts({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cursor =
    typeof searchParams.cursor === "string" ? searchParams.cursor : undefined;

  const userId = decodeURIComponent(params.userId);

  const session = await getSession();

  const feed = await (session ? agent : publicAgent).getAuthorFeed({
    actor: userId,
    limit: 30,
    cursor,
  });

  // The data we get seems to contain some helper functions.
  // Calling postsSchema.parse removes anything we don't need,
  // which prevents react from complaining about passing objects
  // with functions into client components.
  const posts = feedViewPostsSchema.parse(feed.data.feed);

  const rscPosts = posts.slice(0, SPLIT);
  const restPosts = posts.slice(SPLIT);

  const nextRscCursor = rscPosts[rscPosts.length - 1]?.post.record.createdAt;

  return (
    <>
      <ResetAboveThisPoint id={cursor} />
      {rscPosts.map(({ post, reason }) => (
        <Post key={post.uri} post={post} reason={reason} />
      ))}
      <noscript>
        <Button asChild>
          <Link href={routes.user(params.userId) + `?cursor=${nextRscCursor}`}>
            Next page
          </Link>
        </Button>
      </noscript>
      <VirtualizedPosts
        defaultPosts={restPosts}
        defaultCursor={feed.data.cursor}
        actor={userId}
        mode="overview"
      />
      {cursor && <ResetScroll offsetY={70} />}
    </>
  );
}
