import { getSession, agent } from "@/lib/atp-client";
import { Post } from "@/components/post.server"

export default async function Pgae() {
  const user = await getSession();

  const timeline = await agent.getTimeline({
    algorithm: "discover"
  })

  return (
    <>
      {timeline.data.feed.map(({ post }) => (
        <Post key={post.uri} post={post} />
      ))}
    </>
  )
}
