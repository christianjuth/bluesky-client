"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { accountSchema } from "@/lib/schemas";
import { useState } from "react";
import z from "zod";
import { useFetch } from "@/lib/hooks";
import { GetResponse as UserGetResponse } from "@/app/api/user/route";
import { abbriviateNumber, getInitials } from "@/lib/format";
import { AutoLinkText } from "./auto-link-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "./follow-button.client";

export function ActorHoverCard({
  actor,
  children,
}: {
  actor: Partial<z.infer<typeof accountSchema>>;
  children: React.ReactNode;
}) {
  const [disabled, setDisabled] = useState(true);

  const { data, reset } = useFetch<UserGetResponse>(
    `/api/user?userId=${actor.handle}`,
    {},
    {
      disabled,
    },
  );

  const displayName =
    data?.user.displayName ??
    ("displayName" in actor ? actor.displayName : undefined);
  const handle =
    data?.user.handle ?? ("handle" in actor ? actor.handle : undefined);
  const displayNameOrHandle = displayName ?? handle;

  const initials = displayNameOrHandle
    ? getInitials(displayNameOrHandle)
    : undefined;

  const avatar =
    data?.user.avatar ?? ("avatar" in actor ? actor.avatar : undefined);

  actor = data?.user ?? actor;

  return (
    <HoverCard
      openDelay={500}
      closeDelay={50}
      onOpenChange={(state) => {
        if (!state) {
          setDisabled(true);
          reset();
        }
      }}
    >
      <HoverCardTrigger onMouseEnter={() => setDisabled(false)} asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="relative">
        {actor.did && (
          <FollowButton
            actorDid={actor.did}
            following={actor.viewer?.following}
            className="absolute top-4 right-4"
          />
        )}

        <div className="space-y-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="font-bold">{actor.displayName}</span>
            <span>@{actor.handle}</span>
          </div>

          <div className="text-sm space-x-3">
            {actor.followersCount !== undefined && (
              <span>
                {abbriviateNumber(actor.followersCount)}
                <span className="text-muted-foreground"> followers</span>
              </span>
            )}

            {actor.postsCount !== undefined && (
              <span>
                {abbriviateNumber(actor.postsCount)}
                <span className="text-muted-foreground"> posts</span>
              </span>
            )}
          </div>

          {actor.description && (
            <p className="overflow-hidden text-ellipsis">
              <AutoLinkText>{actor.description}</AutoLinkText>
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
