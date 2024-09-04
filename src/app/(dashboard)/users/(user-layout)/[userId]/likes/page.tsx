import { getMyLikedPosts } from "@/lib/atp-client";
import { Post } from "@/components/post.server"

export default async function Posts({
  params,
}: {
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId)

  const posts = await getMyLikedPosts({ limit: 20 });

  return (
    <>
      <div className="divide-y border-t">
        {posts?.data.posts.map((post) => (
          <Post key={post.uri} post={post} />
        ))}
      </div>
    </>
  );
}
