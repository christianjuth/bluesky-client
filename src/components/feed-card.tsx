import { abbriviateNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { feedGeneratorSchema } from "@/lib/schemas";
import z from "zod";
import { AutoLinkText } from "@/components/auto-link-text";
import Link from "next/link";

export function FeedCard({
  feed,
  className,
}: {
  feed: z.infer<typeof feedGeneratorSchema>;
  className?: string;
}) {
  return (
    <Link
      className={cn("py-2 flex flex-col space-y-1 text-sm", className)}
      href={`/?feed=${feed.uri}`}
    >
      <div
        className={cn(
          "grid grid-cols-[min-content_1fr] space-x-2",
          !feed.avatar && "grid-cols-1",
        )}
      >
        {feed.avatar && (
          <div className="relative aspect-square">
            <Image
              src={feed.avatar}
              alt={feed.displayName}
              className="rounded-lg"
              fill
            />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-bold">{feed.displayName}</span>
          <span className="text-muted-foreground -mt-0.5">
            Feed by @{feed.creator.handle}
          </span>
        </div>
      </div>
      <p>
        <AutoLinkText>{feed.description}</AutoLinkText>
      </p>
      <span className="text-muted-foreground">
        Liked by {abbriviateNumber(feed.likeCount)} users
      </span>
    </Link>
  );
}
