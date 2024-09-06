"use client";

import { useEffect, useRef } from "react";

function safeDisableScrollRestoration() {
  if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
}

export function ResetScroll({ offsetY }: { offsetY?: number }) {
  const disabledRef = useRef(false);

  if (!disabledRef.current) {
    safeDisableScrollRestoration();
    if (typeof window !== "undefined") {
      window.scrollTo(0, offsetY ?? 0);
    }
    disabledRef.current = true;
  }

  useEffect(() => {
    window.scrollTo(0, offsetY ?? 0);
    return () => {
      // Re-enable scroll restoration when component unmounts
      window.history.scrollRestoration = "auto";
    };
  }, [offsetY]);

  return null;
}
