import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import Link from "next/link";
import * as routes from "@/lib/routes";

export function Profile({ profile }: { profile: ProfileView }) {
  const initials = (profile.displayName ?? profile.handle)
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const avatar = profile.avatar;

  return (
    <Link
      className="py-4 px-4 md:px-2 space-y-1"
      href={routes.user(profile.handle)}
    >
      <div className="flex flex-row space-x-2 items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <p className="font-bold">{profile.displayName ?? profile.handle}</p>
          <p className="text-muted-foreground -mt-0.5">u/{profile.handle}</p>
        </div>
      </div>
      <p className="pl-12 text-sm">{profile.description}</p>
    </Link>
  );
}
