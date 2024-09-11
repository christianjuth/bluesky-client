"use client";

import { abbriviateNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { feedGeneratorSchema } from "@/lib/schemas";
import z from "zod";
import Link from "next/link";
import { HeartOutline } from "@/components/icons";
import { SaveFeedButton } from "./feed-save.client";

export function FeedCard({
  feed,
  className,
  savedId,
}: {
  feed: z.infer<typeof feedGeneratorSchema>;
  className?: string;
  savedId?: string;
}) {
  return (
    <div className={cn("py-2 flex flex-col text-sm relative", className)}>
      <Link href={`/?feed=${feed.uri}`} className="mb-2">
        <div
          className={cn(
            "grid grid-cols-[min-content_1fr_min-content] space-x-2",
            !feed.avatar && "grid-cols-1",
          )}
        >
          {feed.avatar && (
            <div className="relative aspect-square">
              <Image
                unoptimized
                src={feed.avatar}
                alt={feed.displayName}
                className="rounded-full"
                fill
              />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold">{feed.displayName}</span>
            <span className="text-muted-foreground text-xs">
              By @{feed.creator.handle}
            </span>
          </div>
        </div>
      </Link>
      <SaveFeedButton
        feedUri={feed.uri}
        savedId={savedId}
        className="absolute top-1 right-1"
      />
      <div className="text-muted-foreground text-xs line-clamp-2 mb-2">
        {feed.description}
      </div>
      <div className="text-muted-foreground flex flex-row items-center space-x-1 text-sm">
        <HeartOutline />
        <span>{abbriviateNumber(feed.likeCount)}</span>
      </div>
      <div className="flex-1" />
    </div>
  );
}
