import { agent, publicAgent, getSession } from "@/lib/atp-client";
import { VirtualizedPosts } from "@/components/virtualized-posts";
import { Post } from "@/components/post";
import { postsSchema } from "@/lib/schemas";

// The number of items that will be rendered initially
// and live outside of the virtualized list. This allows
// the first n items to be rendered immediately, without JS.
const SPLIT = 10;

export default async function Posts({
  params,
}: {
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId);

  const session = await getSession();

  const feed = await (session ? agent : publicAgent).getAuthorFeed({
    actor: userId,
    limit: 100,
  });

  // The data we get seems to contain some helper functions.
  // Calling postsSchema.parse removes anything we don't need,
  // which prevents react from complaining about passing objects
  // with functions into client components.
  const posts = postsSchema.parse(feed.data.feed.map((f) => f.post));

  const rscPosts = posts.slice(0, SPLIT);
  const restPosts = posts.slice(SPLIT);

  return (
    <>
      {rscPosts.map((post) => (
        <Post key={post.uri} post={post} />
      ))}
      <VirtualizedPosts defaultPosts={restPosts} />
    </>
  );
}
