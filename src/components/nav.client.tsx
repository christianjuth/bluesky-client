"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as routes from "@/lib/routes";
import { logout } from "./nav.server";
import { feedGeneratorsSchema } from "@/lib/schemas";
import z from "zod";

import { HomeOutlined, PersonOutlined } from "@/components/icons";

const getSidebarLinks = (userId?: string) => [
  {
    href: routes.home,
    text: "Home",
    icon: HomeOutlined,
  },
  {
    href: routes.feeds,
    text: "Feeds",
    icon: HomeOutlined,
  },
  ...(userId
    ? [
        {
          href: routes.user(userId),
          text: "Profile",
          icon: PersonOutlined,
        },
      ]
    : [
        {
          href: routes.auth,
          text: "Login",
          icon: PersonOutlined,
        },
      ]),
];

const matchPaths = (target: string, current: string) => {
  if (target === routes.home) {
    return current === target;
  }

  return current.indexOf(target) === 0;
};

export async function Sidebar({
  userId,
  feedGenerators,
}: {
  userId?: string;
  feedGenerators: z.infer<typeof feedGeneratorsSchema>;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between gap-12 min-h-full">
      <div className="flex flex-col space-y-1">
        {getSidebarLinks(userId).map(({ href, text, icon: Icon }) => (
          <Button
            key={href}
            asChild
            variant={matchPaths(href, pathname) ? "default" : "ghost"}
            className="mr-2 justify-start px-4 -mx-4"
          >
            <Link href={href}>
              <Icon className="mr-1.5 text-lg" />
              {text}
            </Link>
          </Button>
        ))}
      </div>

      <div className="flex flex-col space-y-1">
        <div className="uppercase text-muted-foreground text-sm">
          Popular Feeds
        </div>
        {feedGenerators.feeds.map((feed) => (
          <Button
            key={feed.uri}
            asChild
            size="sm"
            variant="ghost"
            className="mr-2 justify-start px-4 -mx-4"
          >
            <Link href={`/?feed=${feed.uri}`}>{feed.displayName}</Link>
          </Button>
        ))}
      </div>

      <div>
        {userId && (
          <form action={logout}>
            <Button variant="ghost" className="justify-start px-4 -mx-4">
              {/* <Icon className="text-lg" /> */}
              Logout
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export function BottomTabNavigator({ userId }: { userId?: string }) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 border-t flex flex-row items-center justify-between px-4 bg-background/70 z-20 backdrop-blur md:hidden">
      {getSidebarLinks(userId).map(({ href, icon: Icon }) => (
        <Button
          key={href}
          asChild
          variant={matchPaths(href, pathname) ? "default" : "ghost"}
        >
          <Link href={href}>
            <Icon className="text-lg" />
          </Link>
        </Button>
      ))}
    </div>
  );
}
