import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import Link from "next/link";
import * as routes from "@/lib/routes";
import { AutoLinkText } from "./auto-link-text";
import { getInitials } from "@/lib/format";

export function Byline({ profile }: { profile: ProfileView }) {
  const initials = getInitials(profile.displayName ?? profile.handle);

  const avatar = profile.avatar;

  return (
    <Link
      className="flex flex-row space-x-2 items-center"
      href={routes.user(profile.handle)}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <p className="font-bold">{profile.displayName ?? profile.handle}</p>
        <p className="text-muted-foreground -mt-0.5">@{profile.handle}</p>
      </div>
    </Link>
  );
}

export function ProfileDescription({
  profile,
  className,
}: {
  profile: ProfileView;
  className?: string;
}) {
  if (!profile.description) return null;
  return (
    <div className={className}>
      <AutoLinkText>{profile.description}</AutoLinkText>
    </div>
  );
}

export function Profile({ profile }: { profile: ProfileView }) {
  return (
    <div className="py-4 px-4 md:px-2 space-y-1">
      <Byline profile={profile} />

      <ProfileDescription profile={profile} className="pl-12 text-sm" />
    </div>
  );
}
