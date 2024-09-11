"use server";

import { agent } from "@/lib/bsky/agent";
import { redirect } from "next/navigation";
import * as routes from "@/lib/routes";
import { getSession } from "@/lib/bsky/agent";

export async function handleLike(state: {
  actorDid: string;
  following?: string;
}) {
  const session = await getSession();

  if (!session) {
    redirect(routes.auth);
  }

  try {
    if (!state.following) {
      const newFollow = await agent.follow(state.actorDid);
      return { ...state, following: newFollow.uri };
    } else {
      await agent.deleteFollow(state.following);
      return { ...state, following: undefined };
    }
  } catch (e) {
    console.error(e);
    return state;
  }
}
