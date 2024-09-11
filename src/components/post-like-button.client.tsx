"use client";

import { useActionState } from "react";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { abbriviateNumber } from "@/lib/format";
import { handleLike } from "./post-like-button.server";

export function LikeButton({
  cid,
  uri,
  like: initLike,
  likeCount,
}: {
  cid: string;
  uri: string;
  like?: string;
  likeCount?: number;
}) {
  const [state, action] = useActionState(handleLike, {
    uri,
    cid,
    like: initLike,
  });

  if (initLike && !state.like && typeof likeCount === "number") {
    likeCount--;
  } else if (!initLike && state.like && typeof likeCount === "number") {
    likeCount++;
  }

  return (
    <form className="contents" action={action}>
      <button className="flex items-center space-x-1">
        {state.like ? <IoIosHeart /> : <IoIosHeartEmpty />}
        {likeCount !== undefined && <div>{abbriviateNumber(likeCount)}</div>}
      </button>
    </form>
  );
}
