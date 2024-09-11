"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

dayjs.extend(relativeTime);

/**
 * Renders a relative time that updates every second.
 * Does so in a way that won't break hydration.
 * Shows the full date/time time on hover.
 */
export function RelativeTime({ time }: { time: string }) {
  const [relativeTime, setRelativeTime] = useState<string>(
    dayjs(time).format("MMM D, YYYY h:mma"),
  );

  useEffect(() => {
    const updateTime = () => setRelativeTime(dayjs(time).fromNow());

    const interval = setInterval(updateTime, 1000);

    updateTime();

    return () => clearInterval(interval);
  }, [time]);

  return relativeTime ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <time className="text-muted-foreground text-xs">{relativeTime}</time>
        </TooltipTrigger>
        <TooltipContent>
          <p>{dayjs(time).format("MMM D, YYYY h:mma")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : null;
}
