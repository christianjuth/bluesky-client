"use client";

import { useActionState } from "react";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { abbriviateNumber } from "@/lib/format";
import { handleLike } from "./like-button.server";

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
      <input type="hidden" name="cid" value={cid} />
      <input type="hidden" name="uri" value={uri} />
      <button className="flex items-center space-x-1">
        {state.like ? <IoIosHeart /> : <IoIosHeartEmpty />}
        {likeCount && <div>{abbriviateNumber(likeCount)}</div>}
      </button>
    </form>
  );
}
