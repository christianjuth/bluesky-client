import { agent, getSession, publicAgent } from "@/lib/atp-client";

import { Post } from "@/components/post.server"
import { VirtualizedPosts } from '@/components/virtualized-posts'

export default async function Posts({
  params
}: {
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId)

  const session = await getSession();
  
  const feed = await (session ? agent : publicAgent).getAuthorFeed({
    actor: userId,
    limit: 100,
  });

  const posts = feed.data.feed
    .filter(p => Boolean(p.reply))
    .map(f => f.post)

  const firstTwenty = posts.slice(0, 10)
  const remaining = posts.slice(10)

  return (
    <>
      {firstTwenty.map((post) => (
        <Post key={post.uri} post={post} />
      ))}
      <VirtualizedPosts defaultPosts={remaining} />
    </>
  );
}
