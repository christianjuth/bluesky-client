"use client";

import { useActionState, useEffect } from "react";
import { handleLike } from "./save-feed.server";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Star, StarFill } from "@/components/icons";
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
  const router = useRouter();

  const [state, action] = useActionState(handleLike, {
    feedUri,
    savedId: initSaveId,
  });

  const isInit = state.savedId === initSaveId;
  useEffect(() => {
    if (isInit) return;
    router.refresh();
  }, [isInit]);

  return (
    <form className="contents" action={action}>
      <Button
        className={cn("flex items-center space-x-1 text-lg", className)}
        size="icon"
        variant="ghost"
      >
        {state.savedId ? <StarFill /> : <Star />}
      </Button>
    </form>
  );
}
