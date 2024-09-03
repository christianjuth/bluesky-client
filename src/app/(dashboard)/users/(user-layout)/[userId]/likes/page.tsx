import { getMyLikedPosts, userIsMyself } from "@/lib/atp-client";
import { Post } from "@/components/post.server"
import { ProfileNavbar } from '../profile-navbar'

export default async function Posts({
  params,
}: {
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId)

  const posts = await getMyLikedPosts({ limit: 20 });

  const isMyself = await userIsMyself(userId);

  return (
    <>
      <ProfileNavbar activeLink="likes" userId={userId} isMyself={isMyself}/>
      <div className="divide-y border-t">
        {posts?.data.posts.map((post) => (
          <Post key={post.uri} post={post} />
        ))}
      </div>
    </>
  );
}
