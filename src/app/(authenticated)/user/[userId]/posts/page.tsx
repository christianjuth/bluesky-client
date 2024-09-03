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
    limit: 20,
    filter: "posts_no_replies"
  });

  const session = await getSession();
  const isMyself = session?.handle === userId;

  return (
    <>
      <ProfileNavbar activeLink="posts" userId={userId} isMyself={isMyself}/>
      <div className="divide-y border-t">
        {posts.data.feed.map(({ post }) => 
          <Post key={post.uri} post={post} />
        )}
      </div>
    </>
  );
}
