import { agent, publicAgent, getSession } from "@/lib/atp-client";

import { Post } from "@/components/post.server"
import { ProfileNavbar } from '../profile-navbar'

export default async function Posts({
  params
}: {
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId)

  const session = await getSession();
  
  const posts = await (session ? agent : publicAgent).getAuthorFeed({
    actor: userId,
    limit: 20,
    // filter: 'replies'
  });

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
