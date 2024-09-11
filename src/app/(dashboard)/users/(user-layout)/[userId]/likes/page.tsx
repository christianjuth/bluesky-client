import { getMyLikedPosts, getSession } from "@/lib/bsky/agent";
import { Post } from "@/components/post";
import { VirtualizedPosts } from "@/components/virtualized-posts";
import { postsSchema } from "@/lib/schemas";
import { notFound } from "next/navigation";
import { ResetScroll } from "@/components/reset-scroll";
import { ResetAboveThisPoint } from "@/components/track-scroll";

// The number of items that will be rendered initially
// and live outside of the virtualized list. This allows
// the first n items to be rendered immediately, without JS.
const SPLIT = 10;

export default async function Posts({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cursor =
    typeof searchParams.cursor === "string" ? searchParams.cursor : undefined;

  const session = await getSession();

  const res = await getMyLikedPosts({ limit: 20, cursor });

  if (!res || !session) {
    notFound();
  }

  // The data we get seems to contain some helper functions.
  // Calling postsSchema.parse removes anything we don't need,
  // which prevents react from complaining about passing objects
  // with functions into client components.
  const sanitizedPosts = postsSchema.parse(res.posts);

  const rscPosts = sanitizedPosts.slice(0, SPLIT);
  const restPosts = sanitizedPosts.slice(SPLIT);

  return (
    <>
      <ResetAboveThisPoint id={cursor} />
      {rscPosts.map((post) => (
        <Post key={post.uri} post={post} />
      ))}
      <VirtualizedPosts
        defaultPosts={restPosts.map((p) => ({ post: p }))}
        defaultCursor={res.cursor}
        actor={session.handle}
        mode="likes"
      />
      {cursor && <ResetScroll offsetY={70} />}
    </>
  );
}
