import { agent, publicAgent, getSession } from "@/lib/atp-client";
import { VirtualizedPosts } from '@/components/virtualized-posts'
import { Post } from '@/components/post.server'

export default async function Posts({
  params,
}: {
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId)

  const session = await getSession();
  
  const { data } = await (session ? agent : publicAgent).getAuthorFeed({
    actor: userId,
    limit: 100,
  }) 

  const posts = data.feed.map(f => f.post)

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
