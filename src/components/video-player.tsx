"use client";

import ReactHlsPlayer from "react-hls-player";
import { postVideoEmbedView } from "@/lib/schemas";
import z from "zod";
import { useRef } from "react";

export function VideoPlayer({
  video,
}: {
  video: z.infer<typeof postVideoEmbedView>;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const aspectRatio = video.aspectRatio
    ? video.aspectRatio.width / video.aspectRatio.height
    : 16 / 9;
  return (
    <ReactHlsPlayer
      playerRef={ref}
      src={video.playlist}
      autoPlay={false}
      controls
      width="100%"
      style={{
        aspectRatio,
      }}
    />
  );
}
