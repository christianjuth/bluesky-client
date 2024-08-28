import { agent, getSession } from "@/lib/atp-client";
import { Post } from "@/components/post.server"
import { ProfileNavbar } from './profile-navbar'

export default async function Posts({
  params,
}: {
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId)
  
  const { data } = await agent.getAuthorFeed({
    actor: userId,
    limit: 10,
  });

  const session = await getSession();
  const isMyself = session?.handle === userId;

  return (
    <>
      <ProfileNavbar activeLink="" userId={userId} isMyself={isMyself} />
      <div className="divide-y border-t">
        {data.feed.map(({ post, reply }) => (
          <Post key={post.uri} post={post} reply={reply} />
        ))}
      </div>
    </>
  );
}
