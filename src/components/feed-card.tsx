import { abbriviateNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { feedGeneratorSchema } from "@/lib/schemas";
import z from "zod";
import { AutoLinkText } from "@/components/auto-link-text";
import Link from "next/link";
import { HeartOutline } from "@/components/icons";

export function FeedCard({
  feed,
  className,
}: {
  feed: z.infer<typeof feedGeneratorSchema>;
  className?: string;
}) {
  return (
    <div className={cn("py-2 flex flex-col text-sm", className)}>
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
          <div>
            <span className="text-muted-foreground flex flex-row items-center space-x-1 text-sm">
              <HeartOutline />
              <span>{abbriviateNumber(feed.likeCount)}</span>
            </span>
          </div>
        </div>
      </Link>
      <div className="text-muted-foreground text-xs line-clamp-2">
        <AutoLinkText>{feed.description}</AutoLinkText>
      </div>
      <div className="flex-1" />
    </div>
  );
}
