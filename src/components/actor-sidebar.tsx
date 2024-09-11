import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import Image from "next/image";
import { abbriviateNumber } from "@/lib/format";
import { AutoLinkText } from "./auto-link-text";
import { ActorAvatar } from "./actor";
import { cn } from "@/lib/utils";
import { FollowingButtonWithAutoRefresh } from "./follow-button.client";

export function ActorSidebar({
  actor,
  className,
  isMyself,
}: {
  actor: ProfileViewDetailed;
  className?: string;
  isMyself?: boolean;
}) {
  return (
    <div className={cn("bg-accent/40 border rounded-xl", className)}>
      <div className="relative aspect-[2.2] w-full bg-accent rounded-t-[inherit]">
        {actor.banner && (
          <Image
            unoptimized
            src={actor.banner}
            alt="Profile banner"
            layout="fill"
            objectFit="cover"
            className="rounded-t-[inherit] object-cover"
          />
        )}
        <div className="absolute top-full transform left-4 -translate-y-1/2 h-24 w-24">
          <div className="absolute -inset-x-0.5 -top-0.5 bottom-1/2 bg-accent rounded-t-full" />
          <ActorAvatar
            actor={actor}
            className="absolute inset-0 rounded-full h-full w-full"
          />
        </div>
      </div>

      <div className="px-4 flex flex-row justify-end h-14 items-center">
        {!isMyself && (
          <FollowingButtonWithAutoRefresh
            actorDid={actor.did}
            following={actor.viewer?.following}
          />
        )}
      </div>

      <div className="p-4 pt-0 space-y-3">
        <div>
          <div className="font-bold">{actor.displayName || actor.handle}</div>
          <div className="text-muted-foreground text-sm">@{actor.handle}</div>
        </div>

        {actor.description && (
          <div className="overflow-hidden text-ellipsis text-sm">
            <AutoLinkText>{actor.description}</AutoLinkText>
          </div>
        )}

        <div className="text-sm space-x-3">
          {actor.followersCount !== undefined && (
            <span>
              {abbriviateNumber(actor.followersCount)}
              <span className="text-muted-foreground"> followers</span>
            </span>
          )}

          {actor.followsCount !== undefined && (
            <span>
              {abbriviateNumber(actor.followsCount)}
              <span className="text-muted-foreground"> following</span>
            </span>
          )}

          {actor.postsCount !== undefined && (
            <span>
              {abbriviateNumber(actor.postsCount)}
              <span className="text-muted-foreground"> posts</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
