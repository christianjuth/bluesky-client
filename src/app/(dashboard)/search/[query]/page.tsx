import { searchPosts } from "@/lib/atp-client";
import { VirtualizedPosts } from "@/components/virtualized-posts";
import { Post } from "@/components/post";

// The number of items that will be rendered initially
// and live outside of the virtualized list. This allows
// the first n items to be rendered immediately, without JS.
const SPLIT = 10;

export default async function Page({ params }: { params: { query: string } }) {
  const data = await searchPosts({ query: params.query, limit: 20 });

  // The data we get seems to contain some helper functions.
  // Calling postsSchema.parse removes anything we don't need,
  // which prevents react from complaining about passing objects
  // with functions into client components.
  const rscPosts = data.posts?.slice(0, SPLIT);
  const restPosts = data.posts?.slice(SPLIT);

  return (
    <>
      {rscPosts?.map((post) => <Post key={post.uri} post={post} />)}
      {restPosts && <VirtualizedPosts defaultPosts={restPosts} />}
    </>
  );
}
