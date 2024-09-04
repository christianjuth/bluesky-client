import { getMyLikedPosts } from "@/lib/atp-client";
import { Post } from "@/components/post";
import { VirtualizedPosts } from "@/components/virtualized-posts";
import { postsSchema } from "@/lib/schemas";
import { notFound } from "next/navigation";

// The number of items that will be rendered initially
// and live outside of the virtualized list. This allows
// the first n items to be rendered immediately, without JS.
const SPLIT = 10;

export default async function Posts() {
  const posts = await getMyLikedPosts({ limit: 20 });

  if (!posts) {
    notFound();
  }

  // The data we get seems to contain some helper functions.
  // Calling postsSchema.parse removes anything we don't need,
  // which prevents react from complaining about passing objects
  // with functions into client components.
  const sanitizedPosts = postsSchema.parse(posts.data.posts);

  const rscPosts = sanitizedPosts.slice(0, SPLIT);
  const restPosts = sanitizedPosts.slice(SPLIT);

  return (
    <>
      {rscPosts.map((post) => (
        <Post key={post.uri} post={post} />
      ))}
      <VirtualizedPosts defaultPosts={restPosts.map((p) => ({ post: p }))} />
    </>
  );
}
