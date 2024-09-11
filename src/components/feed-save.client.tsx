"use client";

import { useActionState, useEffect } from "react";
import { handleLike } from "./feed-save.server";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PinOutline, PinFill } from "@/components/icons";
import { useRouter } from "next/navigation";

export function SaveFeedButton({
  feedUri,
  savedId: initSaveId,
  className,
}: {
  feedUri: string;
  savedId?: string;
  className?: string;
}) {
  const { refresh: routerRefresh } = useRouter();

  const [state, action] = useActionState(handleLike, {
    feedUri,
    savedId: initSaveId,
  });

  const isInit = state.savedId === initSaveId;
  useEffect(() => {
    if (isInit) return;
    routerRefresh();
  }, [isInit, routerRefresh]);

  return (
    <form className="contents" action={action}>
      <Button
        className={cn("flex items-center space-x-1 text-xl", className)}
        size="icon"
        variant="ghost"
      >
        {state.savedId ? <PinFill /> : <PinOutline />}
      </Button>
    </form>
  );
}
