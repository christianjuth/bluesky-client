"use server";

import { agent } from "@/lib/bsky/agent";
import { redirect } from "next/navigation";
import * as routes from "@/lib/routes";
import { getSession } from "@/lib/bsky/agent";

export async function handleLike(state: {
  uri: string;
  cid: string;
  like?: string;
}) {
  const session = await getSession();

  if (!session) {
    redirect(routes.auth);
  }

  try {
    if (!state.like) {
      const newLike = await agent.like(state.uri, state.cid);
      return { ...state, like: newLike.uri };
    } else {
      await agent.deleteLike(state.like);
      return { ...state, like: undefined };
    }
  } catch (e) {
    console.error(e);
    return state;
  }
}
