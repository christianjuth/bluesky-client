import { agent, getSession } from "@/lib/atp-client";

import { Post } from "@/components/post.server"
import { ProfileNavbar } from '../profile-navbar'

export default async function Posts({
  params
}: {
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId)
  
  const posts = await agent.getAuthorFeed({
    actor: userId,
    limit: 10,
    // filter: 'replies'
  });

  const session = await getSession();
  const isMyself = session?.handle === userId;

  return (
    <>
      <ProfileNavbar activeLink="replies" userId={userId} isMyself={isMyself}/>
      <div className="divide-y border-t">
        {posts.data.feed.map(({ post, reply }) => 
          reply && <Post key={post.uri} post={post} reply={reply} />
        )}
      </div>
    </>
  );
}
