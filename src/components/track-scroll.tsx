"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useMutableSearchParams } from "@/lib/hooks";

function PrivateTrackScroll({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  const searchParams = useMutableSearchParams();

  const [isVisibile, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisibile && id) {
      searchParams.mutate((sp) => sp.set("cursor", id)).shallowReplace();
    }
  }, [id, isVisibile, searchParams.mutate]);

  useEffect(() => {
    function handleScroll() {
      const div = ref.current;
      if (div) {
        const boundingClient = div.getBoundingClientRect();

        const newIsVisible =
          boundingClient.top < 0 &&
          boundingClient.height + boundingClient.top > 0;

        if (newIsVisible && !isVisibile) {
          setIsVisible(true);
        } else if (!newIsVisible && isVisibile) {
          searchParams.cancelUpdate();
          setIsVisible(false);
        }
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id, searchParams.cancelUpdate, isVisibile]);

  return <div ref={ref}>{children}</div>;
}

export function TrackScroll({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={children}>
      <PrivateTrackScroll id={id}>{children}</PrivateTrackScroll>
    </Suspense>
  );
}

function PrivateResetAboveThisPoint({ id }: { id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const searchParams = useMutableSearchParams();
  const [isVisibile, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisibile) {
      searchParams
        .mutate((sp) => (id ? sp.set("cursor", id) : sp.delete("cursor")))
        .shallowReplace();
    }
  }, [isVisibile, searchParams.mutate, id]);

  useEffect(() => {
    function handleScroll() {
      const div = ref.current;
      if (div) {
        const boundingClient = div.getBoundingClientRect();

        const newIsVisible = boundingClient.top > 0;

        if (newIsVisible && !isVisibile) {
          setIsVisible(true);
        } else if (!newIsVisible && isVisibile) {
          searchParams.cancelUpdate();
          setIsVisible(false);
        }
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisibile]);

  return <div ref={ref} />;
}

export function ResetAboveThisPoint({ id }: { id?: string }) {
  return (
    <Suspense fallback={null}>
      <PrivateResetAboveThisPoint id={id} />
    </Suspense>
  );
}
