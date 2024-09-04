import { getMyLikedPosts } from "@/lib/atp-client";
import { Post } from "@/components/post.server"
import { VirtualizedPosts } from '@/components/virtualized-posts'
import { notFound } from "next/navigation";

// The number of items that will be rendered initially
// and live outside of the virtualized list. This allows
// the first n items to be rendered immediately, without JS. 
const SPLIT = 10

export default async function Posts() {
  const posts = await getMyLikedPosts({ limit: 20 });

  if (!posts) {
    notFound();
  }

  const firstTwenty = posts?.data.posts.slice(0, SPLIT)
  const remaining = posts?.data.posts.slice(SPLIT)

  return (
    <>
      {firstTwenty.map((post) => (
        <Post key={post.uri} post={post} />
      ))}
      <VirtualizedPosts defaultPosts={remaining} />
    </>
  );
}
