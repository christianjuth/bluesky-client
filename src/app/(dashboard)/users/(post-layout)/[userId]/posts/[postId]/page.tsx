import { getSession, agent, publicAgent } from "@/lib/atp-client";
import { repliesSchema, postSchema } from "@/lib/schemas";
import { VirtualizedPosts } from "@/components/virtualized-posts";
import { Post } from "@/components/post.server";
import { TemplateWithSidebar } from "@/components/template-with-sidebar";
import { UserSidebar } from "@/components/user-sidebar";

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

  const [profile, post] = await Promise.all([
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

  const replyPosts = replies.map((r) => r.post);

  const rscReplies = replyPosts.slice(0, SPLIT);
  const restReplies = replyPosts.slice(SPLIT);

  return (
    <TemplateWithSidebar>
      <>
        <Post post={postData} />
        <hr className="h-px bg-border border-none" />
        {rscReplies.map((post) => (
          <Post key={post.uri} post={post} />
        ))}
        <VirtualizedPosts defaultPosts={restReplies} />
      </>
      <UserSidebar profile={profile.data} />
    </TemplateWithSidebar>
  );
}
