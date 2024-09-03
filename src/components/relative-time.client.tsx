"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

export function RelativeTime({
  time
}: {
  time: string
}) {
  const [relativeTime, setRelativeTime] = useState<string>(dayjs(time).fromNow());

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(dayjs(time).fromNow());
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <time className="text-muted-foreground text-xs">{relativeTime}</time>
  );
}
