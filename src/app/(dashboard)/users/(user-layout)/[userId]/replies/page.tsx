import { agent, getSession, publicAgent } from "@/lib/atp-client";
import { Post } from "@/components/post.server";
import { VirtualizedPosts } from "@/components/virtualized-posts";

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

  const posts = feed.data.feed
    .filter((p) => Boolean(p.reply))
    .map((f) => f.post);

  const firstTwenty = posts.slice(0, SPLIT);
  const remaining = posts.slice(SPLIT);

  return (
    <>
      {firstTwenty.map((post) => (
        <Post key={post.uri} post={post} />
      ))}
      <VirtualizedPosts defaultPosts={remaining} />
    </>
  );
}
