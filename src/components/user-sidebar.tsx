import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import Image from "next/image";
import { abbriviateNumber } from "@/lib/format";
import { AutoLinkText } from "./auto-link-text";
import { ActorAvatar } from "./actor-avatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function UserSidebar({
  profile,
  className,
}: {
  profile: ProfileViewDetailed;
  className?: string;
}) {
  return (
    <div className={cn("bg-accent/40 border rounded-xl", className)}>
      <div className="relative aspect-[2.5] w-full bg-accent rounded-t-[inherit]">
        {profile.banner && (
          <Image
            src={profile.banner}
            alt="Profile banner"
            layout="fill"
            objectFit="cover"
            className="rounded-t-[inherit] object-cover"
          />
        )}
        <div className="absolute top-full transform left-4 -translate-y-1/2  h-20 w-20">
          <div className="absolute -inset-x-0.5 -top-0.5 bottom-1/2 bg-accent rounded-t-full" />
          <ActorAvatar
            actor={profile}
            className="absolute inset-0 rounded-full h-full w-full"
          />
        </div>
      </div>

      <div className="px-4 pt-2.5 -mb-0.5 flex flex-row justify-end">
        <Button size="sm" variant="secondary">
          Follow
        </Button>
      </div>

      <div className="p-4 pt-0 space-y-3">
        <div>
          <div className="font-bold text-lg">{profile.displayName}</div>
          <div className="text-muted-foreground text-sm">@{profile.handle}</div>
        </div>

        {profile.description && (
          <div className="overflow-hidden text-ellipsis text-sm">
            <AutoLinkText>{profile.description}</AutoLinkText>
          </div>
        )}

        <div className="text-sm space-x-3">
          {profile.followersCount !== undefined && (
            <span>
              {abbriviateNumber(profile.followersCount)}
              <span className="text-muted-foreground"> followers</span>
            </span>
          )}

          {profile.followsCount !== undefined && (
            <span>
              {abbriviateNumber(profile.followsCount)}
              <span className="text-muted-foreground"> following</span>
            </span>
          )}

          {profile.postsCount !== undefined && (
            <span>
              {abbriviateNumber(profile.postsCount)}
              <span className="text-muted-foreground"> posts</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
