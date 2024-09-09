import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { accountSchema } from "@/lib/schemas";
import { getInitials } from "@/lib/format";
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
