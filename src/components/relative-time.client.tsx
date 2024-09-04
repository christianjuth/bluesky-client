"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

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
    <time className="text-muted-foreground text-xs">{relativeTime}</time>
  ) : null;
}
