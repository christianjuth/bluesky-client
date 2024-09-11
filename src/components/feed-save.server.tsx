"use server";

import { agent } from "@/lib/bsky/agent";
import { redirect } from "next/navigation";
import * as routes from "@/lib/routes";
import { getSession } from "@/lib/bsky/agent";

export async function handleLike(state: { feedUri: string; savedId?: string }) {
  const session = await getSession();

  if (!session) {
    redirect(routes.auth);
  }

  try {
    if (!state.savedId) {
      const newSavedFeeds = await agent.addSavedFeeds([
        {
          type: "feed",
          value: state.feedUri,
          pinned: true,
        },
      ]);
      const newSaveId = newSavedFeeds.find(
        (f) => f.value === state.feedUri,
      )?.id;
      return { ...state, savedId: newSaveId };
    } else {
      await agent.removeSavedFeeds([state.savedId]);
      return { ...state, savedId: undefined };
    }
  } catch (e) {
    console.error(e);
    return state;
  }
}
