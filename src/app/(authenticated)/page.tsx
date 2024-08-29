import { getSession, agent, getDiscoveryFeed } from "@/lib/atp-client";
import { Post } from "@/components/post.server"

export default async function Pgae() {
  const user = await getSession();

  const timeline = user ? await agent.getTimeline() : undefined;

  const discoveryFeed = !user ? await getDiscoveryFeed() : undefined;

  return (
    <>
      {timeline?.data.feed.map(({ post }) => (
        <Post key={post.uri} post={post} />
      ))}

      {discoveryFeed?.posts.map(post => (
        <Post key={post.uri} post={post} />
      ))}
    </>
  )
}
