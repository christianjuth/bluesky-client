import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import Link from "next/link";
import * as routes from "@/lib/routes";
import { AutoLinkText } from "./auto-link-text";
import { getInitials } from "@/lib/format";
import { accountSchema } from "@/lib/schemas";
import z from "zod";

export function ActorAvatar({
  actor,
  className,
}: {
  actor: z.infer<typeof accountSchema>;
  className?: string;
}) {
  const avatar = actor.avatar;
  const initials = getInitials(actor.displayName ?? actor.handle);

  return (
    <Avatar className={className}>
      {avatar && <AvatarImage src={avatar} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

function ActorByline({ actor }: { actor: ProfileView }) {
  const initials = getInitials(actor.displayName ?? actor.handle);

  const avatar = actor.avatar;

  return (
    <Link
      className="flex flex-row space-x-2 items-center"
      href={routes.user(actor.handle)}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <p className="font-bold">{actor.displayName ?? actor.handle}</p>
        <p className="text-muted-foreground -mt-0.5">@{actor.handle}</p>
      </div>
    </Link>
  );
}

function ActorDescription({
  actor,
  className,
}: {
  actor: ProfileView;
  className?: string;
}) {
  if (!actor.description) return null;
  return (
    <div className={className}>
      <AutoLinkText>{actor.description}</AutoLinkText>
    </div>
  );
}

export function Actor({ actor }: { actor: ProfileView }) {
  return (
    <div className="py-4 px-4 md:px-2 space-y-1">
      <ActorByline actor={actor} />

      <ActorDescription actor={actor} className="pl-12 text-sm" />
    </div>
  );
}
