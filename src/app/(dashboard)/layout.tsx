import {
  agent,
  getFeedGenerators,
  getPopularFeedGenerators,
  getSession,
  getSavedFeeds,
} from "@/lib/atp-client";
import { BottomTabNavigator, Sidebar, Drawer } from "@/components/nav.client";
import Link from "next/link";
import { SearchBar } from "./search-bar.client";
import * as routes from "@/lib/routes";
import { Logo, BellOutline } from "@/components/icons";
import { ActorAvatar } from "@/components/actor-avatar";
import { Button } from "@/components/ui/button";
import { feedRequiresAuth } from "@/lib/bsky/utils";

function NotificationBell({ count }: { count: number }) {
  return (
    <Link className="relative" href={routes.notifications}>
      <BellOutline className="text-2xl mr-3" />
      {count > 0 && (
        <div className="absolute -top-1 right-1/4 w-3 h-3 bg-red-500 rounded-full" />
      )}
    </Link>
  );
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  const [user, savedFeeds, popularFeedGenerators] = await Promise.all([
    session ? agent.getProfile({ actor: session.handle }) : null,
    session ? getSavedFeeds() : null,
    getPopularFeedGenerators({ limit: 30 }),
  ]);

  const pinnedFeedUris = savedFeeds?.items
    .filter((f) => f.type === "feed")
    .map((f) => f.value);

  const pinnedFeeds =
    pinnedFeedUris && pinnedFeedUris.length > 0
      ? await getFeedGenerators({
          feeds: pinnedFeedUris,
        })
      : undefined;

  const feedGenerators = popularFeedGenerators.feeds
    .filter((f) => {
      if (!session) {
        return !feedRequiresAuth(f);
      }
      return true;
    })
    .sort((a, b) => b.likeCount - a.likeCount);

  const notifications = session
    ? await agent.countUnreadNotifications()
    : undefined;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-14 border-b flex flex-row items-center justify-between px-4 fixed top-0 inset-x-0 bg-background/70 z-20 backdrop-blur">
        <Drawer
          pinnedFeedGenerators={pinnedFeeds?.feeds}
          feedGenerators={feedGenerators}
          userId={user?.data?.handle}
        />

        <Link
          href={routes.home}
          className="md:flex-1 flex flex-row items-center space-x-0.5 mr-3"
        >
          <span className="font-black text-xl">BLUE</span>
          <Logo className="text-2xl" />
        </Link>

        <SearchBar />

        <div className="md:flex-1 flex items-center justify-end ml-3">
          {user?.data ? (
            <>
              {notifications?.data && (
                <NotificationBell count={notifications.data.count} />
              )}
              <Link href={routes.user(user.data.handle)}>
                <ActorAvatar actor={user.data} className="h-8 w-8" />
              </Link>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href={routes.auth}>Login</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="h-14" />

      <aside className="fixed left-0 bottom-0 w-60 border-r top-14 p-6 max-md:hidden overflow-y-auto">
        <Sidebar
          pinnedFeedGenerators={pinnedFeeds?.feeds}
          feedGenerators={feedGenerators}
          userId={user?.data?.handle}
        />
      </aside>

      <main className="w-full mx-auto md:pl-60">{children}</main>

      <BottomTabNavigator />
    </div>
  );
}
