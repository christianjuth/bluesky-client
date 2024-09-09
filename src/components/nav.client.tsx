"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as routes from "@/lib/routes";
import { logout } from "./nav.server";
import { feedGeneratorsSchema } from "@/lib/schemas";
import z from "zod";
import Image from "next/image";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { Menu } from "@/components/icons";

import {
  HomeOutline,
  HomeFill,
  ArrowUpRightCircleFill,
  ArrowUpRightCircleOutline,
  Feed,
  FeedFill,
  LogOut,
} from "@/components/icons";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const getSidebarLinks = (userId?: string) => [
  {
    href: routes.home,
    text: "Home",
    icon: HomeOutline,
    iconActive: HomeFill,
  },
  {
    href: "/popular",
    text: "Popular",
    icon: ArrowUpRightCircleOutline,
    iconActive: ArrowUpRightCircleFill,
  },
  {
    href: routes.feeds,
    text: "Explore",
    icon: Feed,
    iconActive: FeedFill,
  },
];

const matchPaths = (target: string, current: string) => {
  if (target === routes.home) {
    return current === target;
  }

  return current.indexOf(target) === 0;
};

export function Sidebar({
  userId,
  feedGenerators,
}: {
  userId?: string;
  feedGenerators: z.infer<typeof feedGeneratorsSchema>;
}) {
  const pathname = usePathname();

  const feeds = feedGenerators.feeds.filter((feed) => feed.avatar);

  return (
    <div className="flex flex-col justify-between gap-8 min-h-full">
      <div className="flex flex-col space-y-1">
        {getSidebarLinks(userId).map(
          ({ href, text, icon: Icon, iconActive: IconActive }) => (
            <Button
              key={href}
              asChild
              variant={matchPaths(href, pathname) ? "secondary" : "ghost"}
              className="justify-start px-2.5 -mx-2.5"
              size="sm"
            >
              <Link href={href}>
                {matchPaths(href, pathname) ? (
                  <IconActive className="mr-1.5 text-lg" />
                ) : (
                  <Icon className="mr-1.5 text-lg" />
                )}
                {text}
              </Link>
            </Button>
          ),
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <div className="uppercase text-muted-foreground text-sm">
          Popular Feeds
        </div>
        {feeds.map((feed) => (
          <Button
            key={feed.uri}
            asChild
            size="sm"
            variant="ghost"
            className="mr-2 justify-start px-2.5 -mx-2.5"
          >
            <Link
              className="flex flex-row space-x-1.5"
              href={`/?feed=${feed.uri}`}
            >
              {feed.avatar && (
                <div className="relative w-6 h-6">
                  <Image
                    src={feed.avatar}
                    alt={feed.displayName}
                    className="rounded-full"
                    fill
                  />
                </div>
              )}
              <span>{feed.displayName}</span>
            </Link>
          </Button>
        ))}
      </div>

      <div className="flex flex-col space-y-1">
        <div className="uppercase text-muted-foreground text-sm">Settings</div>
        <ModeToggle />
        {userId && (
          <form action={logout} className="contents">
            <Button
              variant="ghost"
              className="justify-start px-2.5 -mx-2.5"
              size="sm"
            >
              <LogOut className="mr-1.5 text-lg" />
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

export function Drawer({
  userId,
  popularFeedGenerators,
}: {
  userId?: string;
  popularFeedGenerators: z.infer<typeof feedGeneratorsSchema>;
}) {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="overflow-y-auto h-full p-6">
          <Sidebar userId={userId} feedGenerators={popularFeedGenerators} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
