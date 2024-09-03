import { getSession, agent, getDiscoveryFeed } from "@/lib/atp-client";
import { Post } from "@/components/post.server"

export default async function Pgae() {
  const session = await getSession();

  const timeline = session ? await agent.getTimeline() : undefined;

  const discoveryFeed = !session ? await getDiscoveryFeed() : undefined;

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
