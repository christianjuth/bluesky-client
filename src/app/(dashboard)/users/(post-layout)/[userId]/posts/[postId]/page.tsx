import { Post } from '@/components/post.server'
import { getSession, agent, publicAgent } from '@/lib/atp-client'
import { Replies } from './replies.client'
import { repliesSchema, postSchema } from '@/lib/schemas'

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

  const postData = postSchema.parse(thread.data.thread.post)
  const replies = repliesSchema.parse(thread.data.thread.replies)
  
  return (
    <Replies replies={replies}>
      <Post post={postData} />
      <hr className="h-px border-none bg-border" />
    </Replies>
  )
}
