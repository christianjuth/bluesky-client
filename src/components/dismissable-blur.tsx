"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * This is used to blur out NSFW content.
 */
export function DismissableBlur({
  className,
  label = "NSFW",
}: {
  className?: string;
  label?: string;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) {
    return null;
  }
  return (
    <button
      className={cn(
        "flex items-center justify-center backdrop-blur-3xl",
        className,
      )}
      onClick={() => setDismissed(true)}
    >
      {label}
    </button>
  );
}
