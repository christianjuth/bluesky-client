import { agent, publicAgent, getSession } from "@/lib/atp-client";
import { Post } from "@/components/post.server"
import { ProfileNavbar } from './profile-navbar'

export default async function Posts({
  params,
}: {
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId)

  const session = await getSession();
  
  const { data } = await (session ? agent : publicAgent).getAuthorFeed({
    actor: userId,
    limit: 20,
  }) 

  const isMyself = session?.handle === userId;

  return (
    <>
      <ProfileNavbar activeLink="" userId={userId} isMyself={isMyself} />
      <div className="divide-y border-t">
        {data.feed.map(({ post, reply, reason }) => (
          <Post key={post.uri} post={post} reply={reply} reason={reason} />
        ))}
      </div>
    </>
  );
}
