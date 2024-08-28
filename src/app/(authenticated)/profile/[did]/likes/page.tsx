import { getSession, agent } from "@/lib/atp-client";

import { Post } from "@/components/post.server"
import { ProfileNavbar } from '../ProfileNavbar'

export default async function Posts() {
  const user = await getSession()
  
  const { data } = await agent.getLikes({
    uri: user.did
    // actor: user.did,
    // limit: 10,
  });

  return (
    <>
      <ProfileNavbar activeLink="posts"/>
      {/* <div className="divide-y border-t"> */}
      {/*   {data.feed.map(({ post }) => ( */}
      {/*     <Post key={post.uri} post={post} /> */}
      {/*   ))} */}
      {/* </div> */}
    </>
  );
}
