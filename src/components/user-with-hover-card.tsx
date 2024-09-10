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
import dayjs from "dayjs";
import { AutoLinkText } from "./auto-link-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "./follow-button.client";

export function UserWithHoverCard({
  account,
  children,
}: {
  account: Partial<z.infer<typeof accountSchema>>;
  children: React.ReactNode;
}) {
  const [disabled, setDisabled] = useState(true);

  const { data, reset } = useFetch<UserGetResponse>(
    `/api/user?userId=${account.handle}`,
    {},
    {
      disabled,
    },
  );

  const displayName =
    data?.user.displayName ??
    ("displayName" in account ? account.displayName : undefined);
  const handle =
    data?.user.handle ?? ("handle" in account ? account.handle : undefined);
  const displayNameOrHandle = displayName ?? handle;

  const initials = displayNameOrHandle
    ? getInitials(displayNameOrHandle)
    : undefined;

  const avatar =
    data?.user.avatar ?? ("avatar" in account ? account.avatar : undefined);

  account = data?.user ?? account;

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
        {account.did && (
          <FollowButton
            actorDid={account.did}
            following={account.viewer?.following}
            className="absolute top-4 right-4"
          />
        )}

        <div className="space-y-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="font-bold">{account.displayName}</span>
            <span>@{account.handle}</span>
          </div>

          <div className="text-sm space-x-3">
            {account.followersCount !== undefined && (
              <span>
                {abbriviateNumber(account.followersCount)}
                <span className="text-muted-foreground"> followers</span>
              </span>
            )}

            {account.postsCount !== undefined && (
              <span>
                {abbriviateNumber(account.postsCount)}
                <span className="text-muted-foreground"> posts</span>
              </span>
            )}
          </div>

          {account.description && (
            <p className="overflow-hidden text-ellipsis">
              <AutoLinkText>{account.description}</AutoLinkText>
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
