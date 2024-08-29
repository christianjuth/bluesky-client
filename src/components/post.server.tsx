import 'server-only'

import { PostView, ReplyRef } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { ProfileViewBasic } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { getSession, agent } from "@/lib/atp-client";
import * as routes from "@/lib/routes";

import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import dayjs from 'dayjs';

export async function Post({
  post,
  reply,
}: {
  post: PostView,
  reply?: ReplyRef,
}) {
  const user = await getSession()

  let iLikedPost = false

  if (user) {
    const likes = await agent.getLikes({
      uri: post.uri,
    })
    iLikedPost = likes.data.likes.some((like) => like.actor.did === user.did)
  }

  let text = "error";

  if ("text" in post.record && typeof post.record.text === "string") {
    text = post.record.text;
  }

  const avatar = post.author.avatar;

  const parent = reply?.parent ?? {};
  const parentAuthor = 'author' in parent ? parent.author as ProfileViewBasic : null;

  const createdAt = 'createdAt' in post.record && typeof post.record.createdAt === 'string' ? post.record.createdAt : undefined;

  return (
    <div className="py-4 px-2 space-y-2 relative hover:bg-gray-200/20">
      {/* Byline */}
      <div className="flex flex-row space-x-2 items-center text-sm">
        <div className="h-6 w-6 relative">
          {avatar && <Image src={avatar} alt="Profile image" fill className="rounded-full" />}
        </div>
        <Link href={routes.user(post.author.handle)}>{post.author.handle}</Link>
        {createdAt && <span className="text-muted-foreground text-xs">{dayjs(createdAt).format("MMM D")}</span>}
      </div>
      <div className="pl-8 space-y-3">
        {reply && <div className="-mt-3 mb-3 text-sm"><span className="text-muted-foreground">replied to </span>{parentAuthor?.handle}</div>}
        <p>{text}</p>
        <div className='flex flex-row space-x-6 text-sm'>
          <button className='flex items-center space-x-1'>
            {iLikedPost ? <IoIosHeart /> : <IoIosHeartEmpty />}
            <div>{post.likeCount}</div>
          </button>
          <Link href={`/post/${post.cid}`}>
            Reply
          </Link>
        </div>
      </div>
    </div>
  );
}
