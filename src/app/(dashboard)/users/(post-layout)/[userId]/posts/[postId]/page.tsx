import { getSession, agent, publicAgent } from "@/lib/bsky/agent";
import { repliesSchema, postSchema } from "@/lib/schemas";
import { VirtualizedPosts } from "@/components/virtualized-posts";
import { Post } from "@/components/post";
import { TemplateWithSidebar } from "@/components/template-with-sidebar";
import { ActorSidebar } from "@/components/actor-sidebar";
import { ResetAboveThisPoint } from "@/components/track-scroll";

// The number of items that will be rendered initially
// and live outside of the virtualized list. This allows
// the first n items to be rendered immediately, without JS.
const SPLIT = 10;

export default async function Page({
  params,
}: {
  params: { postId: string; userId: string };
}) {
  const session = await getSession();

  const [actor, post] = await Promise.all([
    publicAgent.getProfile({
      actor: params.userId,
    }),
    (session ? agent : publicAgent).getPost({
      repo: params.userId,
      rkey: params.postId,
    }),
  ]);

  const thread = await (session ? agent : publicAgent).getPostThread({
    uri: post.uri,
  });

  const postData = postSchema.parse(thread.data.thread.post);
  const replies = repliesSchema.parse(thread.data.thread.replies);

  const rscReplies = replies.slice(0, SPLIT);
  const restReplies = replies.slice(SPLIT);

  return (
    <TemplateWithSidebar>
      <>
        <ResetAboveThisPoint />
        <Post post={postData} />
        <hr className="h-px bg-border border-none" />
        {rscReplies.map(({ post }) => (
          <Post key={post.uri} post={post} />
        ))}
        <VirtualizedPosts defaultPosts={restReplies} />
      </>
      <ActorSidebar actor={actor.data} />
    </TemplateWithSidebar>
  );
}
