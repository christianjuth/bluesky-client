import { agent, getSession, publicAgent } from "@/lib/atp-client";

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
    filter: "posts_no_replies"
  });

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
