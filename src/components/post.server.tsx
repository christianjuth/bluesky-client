import 'server-only'

import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { getSession, agent } from "@/lib/atp-client";

import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

export async function Post({
  post,
}: {
  post: PostView,
}) {
  const user = await getSession()

  const likes = await agent.getLikes({
    uri: post.uri,
  })

  const iLikedPost = user ? likes.data.likes.some((like) => like.actor.did === user.did) : false

  let text = "error";

  if ("text" in post.record && typeof post.record.text === "string") {
    text = post.record.text;
  }

  const avatar = post.author.avatar;

  return (
    <div className="py-4 space-y-2">
      {/* Byline */}
      <div className="flex flex-row space-x-2 items-center">
        <div className="h-6 w-6 relative">
          {avatar && <Image src={avatar} alt="Profile image" fill className="rounded-full" />}
        </div>
        <span>{post.author.handle}</span>
      </div>
      <div className="pl-8">
        <p>{text}</p>
        <div className='flex flex-row space-x-2'>
          <button className='flex items-center space-x-1'>
            {iLikedPost ? <IoIosHeart /> : <IoIosHeartEmpty />}
            <div>{post.likeCount}</div>
          </button>
          <Link href={`/post/${post.uri}`}>
            Reply
          </Link>
        </div>
      </div>
    </div>
  );
}
