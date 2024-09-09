import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import Image from "next/image";
import dayjs from "dayjs";
import { abbriviateNumber } from "@/lib/format";
import { AutoLinkText } from "./auto-link-text";

export function UserSidebar({ profile }: { profile: ProfileViewDetailed }) {
  return (
    <div className="rounded-xl w-80 bg-accent/40">
      <div className="relative aspect-[2.5] w-full bg-accent rounded-t-xl">
        {profile.banner && (
          <Image
            src={profile.banner}
            alt="Profile banner"
            layout="fill"
            objectFit="cover"
            className="rounded-tr-xl rounded-tl-xl object-cover"
          />
        )}
      </div>

      <div className="p-4 border-x border-b rounded-b-xl space-y-3">
        {profile.description && (
          <p className="overflow-hidden text-ellipsis">
            <AutoLinkText>{profile.description}</AutoLinkText>
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span>
              {profile.followsCount !== undefined
                ? abbriviateNumber(profile.followsCount)
                : "Unknown"}
            </span>
            <span className="text-muted-foreground">Following</span>
          </div>

          <div className="flex flex-col">
            <span>
              {profile.followersCount !== undefined
                ? abbriviateNumber(profile.followersCount)
                : "Unknown"}
            </span>
            <span className="text-muted-foreground">Followers</span>
          </div>

          <div className="flex flex-col">
            <span>{dayjs(profile.createdAt).format("MMM D, YYYY")}</span>
            <span className="text-muted-foreground">Joined</span>
          </div>

          <div className="flex flex-col">
            <span>
              {profile.postsCount !== undefined
                ? abbriviateNumber(profile.postsCount)
                : "Unknown"}
            </span>
            <span className="text-muted-foreground">Posts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
