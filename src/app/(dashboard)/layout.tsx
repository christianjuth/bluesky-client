import { agent, getPopularFeedGenerators, getSession } from "@/lib/atp-client";
import { BottomTabNavigator, Sidebar, Drawer } from "@/components/nav.client";
import Link from "next/link";
import { SearchBar } from "./search-bar.client";
import * as routes from "@/lib/routes";
import { Logo } from "@/components/icons";
import { ActorAvatar } from "@/components/actor-avatar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  const user = session
    ? await agent.getProfile({
        actor: session.handle,
      })
    : null;

  const popularFeedGenerators = await getPopularFeedGenerators({
    limit: 30,
  });
  popularFeedGenerators.feeds.sort((a, b) => b.likeCount - a.likeCount);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-14 border-b flex flex-row items-center justify-between px-4 fixed top-0 inset-x-0 bg-background/70 z-20 backdrop-blur space-x-3">
        <Drawer
          userId={user?.data?.handle}
          popularFeedGenerators={popularFeedGenerators}
        />

        <Link
          href={routes.home}
          className="md:flex-1 flex flex-row items-center space-x-0.5"
        >
          <span className="font-black text-xl">BLUE</span>
          <Logo className="text-2xl" />
        </Link>

        <SearchBar />

        <div className="md:flex-1 flex items-end justify-end">
          {user?.data && (
            <Link href={routes.user(user.data.handle)}>
              <ActorAvatar actor={user.data} className="h-8 w-8" />
            </Link>
          )}
        </div>
      </div>

      <div className="h-14" />

      <aside className="fixed left-0 bottom-0 w-60 border-r top-14 p-6 max-md:hidden overflow-y-auto">
        <Sidebar
          userId={user?.data?.handle}
          feedGenerators={popularFeedGenerators}
        />
      </aside>

      <main className="w-full mx-auto md:pl-60">{children}</main>

      <BottomTabNavigator />
    </div>
  );
}
