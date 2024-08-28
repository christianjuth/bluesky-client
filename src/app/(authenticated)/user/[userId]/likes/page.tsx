import { agent, getSession, getMyLikedPosts, userIsMyself } from "@/lib/atp-client";

import { Post } from "@/components/post.server"
import { ProfileNavbar } from '../profile-navbar'

import z from 'zod'

const likesSchema = z.array(z.object({
  value: z.object({
    subject: z.object({
      uri: z.string()
    })
  })
}));

export default async function Posts({
  params,
}: {
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId)

  const posts = getMyLikedPosts();

  


  return (
    <>
      <ProfileNavbar activeLink="likes" userId={userId} isMyself={isMyself}/>
      <div className="divide-y border-t">
        {posts.data.posts.map((post) => (
          <Post key={post.uri} post={post} />
        ))}
      </div>
    </>
  );
}
