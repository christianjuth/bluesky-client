"use client";

/**
 * There are sometiems multiple follow buttons on one page.
 * For now we use an event bus to sync instances of the follow button,
 * which we know need to be refreshed after a mutation from another instance
 * of the component.
 */

import { Button } from "@/components/ui/button";
import { useActionState, useEffect } from "react";
import { handleLike } from "./follow-button.server";
import { cn } from "@/lib/utils";
import { useFetch } from "@/lib/hooks";
import { GetResponse as UserGetResponse } from "@/app/api/user/route";

class EventBus {
  listeners: (() => void)[] = [];

  addListener(listener: () => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: () => void) {
    this.listeners.filter((l) => l !== listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
const bus = new EventBus();

export function FollowButton({
  actorDid,
  following: initFollowing,
  className,
  dontNotify = false,
}: {
  actorDid: string;
  following?: string;
  className?: string;
  dontNotify?: boolean;
}) {
  const [state, action] = useActionState(handleLike, {
    actorDid,
    following: initFollowing,
  });

  const isInit = state.following === initFollowing;
  useEffect(() => {
    if (dontNotify || isInit) return;
    bus.notify();
  }, [state.following, dontNotify, isInit]);

  return (
    <form className="contents" action={action}>
      <Button
        className={cn("flex items-center space-x-1", className)}
        size="sm"
        variant="secondary"
      >
        {state.following ? "Following" : "Follow"}
      </Button>
    </form>
  );
}

export function FollowingButtonWithAutoRefresh({
  actorDid,
  following: initFollowing,
  className,
}: {
  actorDid: string;
  following?: string;
  className?: string;
}) {
  const res = useFetch<UserGetResponse>(`/api/user?userId=${actorDid}`, {});

  const refresh = res.refresh;
  useEffect(() => {
    bus.addListener(() => {
      refresh();
    });
    return () => {
      bus.removeListener(refresh);
    };
  }, [refresh]);

  return (
    <FollowButton
      key={res.fetchedAt}
      actorDid={actorDid}
      following={res.data?.user.viewer?.following ?? initFollowing}
      className={className}
      dontNotify
    />
  );
}
