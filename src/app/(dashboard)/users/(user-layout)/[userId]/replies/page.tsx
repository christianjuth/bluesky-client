import { agent, getSession, publicAgent } from "@/lib/atp-client";
import { Post } from "@/components/post";
import { VirtualizedPosts } from "@/components/virtualized-posts";
import { feedViewPostsSchema } from "@/lib/schemas";

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
  const posts = feedViewPostsSchema.parse(
    feed.data.feed.filter((p) => Boolean(p.reply)),
  );

  const rscPosts = posts.slice(0, SPLIT);
  const restPosts = posts.slice(SPLIT);

  return (
    <>
      {rscPosts.map(({ post, reason }) => (
        <Post key={post.uri} post={post} reason={reason} />
      ))}
      <VirtualizedPosts defaultPosts={restPosts} />
    </>
  );
}
