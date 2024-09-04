"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as routes from "@/lib/routes";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { usePathname } from "next/navigation";

const links = [
  {
    page: "",
    label: "Overview",
    onlyMyself: false,
  },
  {
    page: "posts",
    label: "Posts",
    onlyMyself: false,
  },
  {
    page: "replies",
    label: "Replies",
    onlyMyself: false,
  },
  {
    page: "likes",
    label: "Likes",
    onlyMyself: true,
  },
] as const;

export function ProfileNavbar({
  profile,
  userId,
  isMyself,
}: {
  profile: ProfileViewDetailed;
  userId: string;
  isMyself: boolean;
}) {
  const activeLink = usePathname().split("/")[3] ?? "";

  return (
    <>
      <div className="mb-3 flex flex-row space-x-2">
        {links.map((link) => {
          if (link.onlyMyself && !isMyself) {
            return null;
          }

          return (
            <Button
              key={link.page}
              asChild
              variant={link.page === activeLink ? "default" : "outline"}
            >
              <Link href={routes.userPage(userId, link.page)}>
                {link.label}
              </Link>
            </Button>
          );
        })}
      </div>
    </>
  );
}
