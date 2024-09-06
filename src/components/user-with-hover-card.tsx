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

export function UserWithHoverCard({
  account,
  children,
}: {
  account: z.infer<typeof accountSchema>;
  children: React.ReactNode;
}) {
  const [disabled, setDisabled] = useState(false);

  const { data } = useFetch<UserGetResponse>(
    `/api/user?userId=${account.handle}`,
    {},
    {
      disabled,
    },
  );

  const initials = getInitials(account.displayName ?? account.handle);

  const avatar = account.avatar;

  account = data?.user ?? account;

  return (
    <HoverCard openDelay={disabled ? 2000 : 500} closeDelay={50}>
      <HoverCardTrigger onMouseOver={() => setDisabled(false)} asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="font-bold">{account.displayName}</span>
            <span>@{account.handle}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span>
                {account.followsCount !== undefined
                  ? abbriviateNumber(account.followsCount)
                  : "Unknown"}
              </span>
              <span className="text-muted-foreground">Following</span>
            </div>

            <div className="flex flex-col">
              <span>
                {account.followersCount !== undefined
                  ? abbriviateNumber(account.followersCount)
                  : "Unknown"}
              </span>
              <span className="text-muted-foreground">Followers</span>
            </div>

            <div className="flex flex-col">
              <span>{dayjs(account.createdAt).format("MMM D, YYYY")}</span>
              <span className="text-muted-foreground">Joined</span>
            </div>

            <div className="flex flex-col">
              <span>
                {account.postsCount !== undefined
                  ? abbriviateNumber(account.postsCount)
                  : "Unknown"}
              </span>
              <span className="text-muted-foreground">Posts</span>
            </div>
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
