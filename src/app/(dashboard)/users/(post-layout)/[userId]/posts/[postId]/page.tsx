import { Post } from '@/components/post.server'
import { getSession, agent, publicAgent } from '@/lib/atp-client'

export default async function Page({
  params
}: {
  params: { postId: string, userId: string }
}) {
  const session = await getSession()

  const post = await (session ? agent : publicAgent).getPost({
    repo: params.userId,
    rkey: params.postId,
  })

  const thread = await (session ? agent : publicAgent).getPostThread({
    uri: post.uri,
  })

  // TODO: figure out why the types here are unknown
  const postData = thread.data.thread.post as any
  const replies = thread.data.thread.replies as any[]
  
  return (
    <>
      <Post post={postData} />
      <hr className="h-px border-none bg-border" />
      <span>Replies</span>
      {replies.map((t: any) => (
        <Post key={t.post.uri} post={t.post} />
      ))}
    </>
  )
}
