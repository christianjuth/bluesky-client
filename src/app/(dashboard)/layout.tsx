import { getSession } from "@/lib/atp-client";
import { BottomTabNavigator, Sidebar } from "@/components/nav.client";
import Link from "next/link";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { Input } from "@/components/ui/input";
import * as routes from "@/lib/routes";

function SearchBar() {
  return (
    <form method="GET" action={routes.search}>
      <Input name="q" className="w-60" placeholder="Search..." />
    </form>
  );
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-14 border-b flex flex-row items-center justify-between px-4 fixed top-0 inset-x-0 bg-background/70 z-20 backdrop-blur">
        <Link href={routes.home} className="flex-1">
          <span className="text-xl font-bold">bluedit</span>
        </Link>

        <SearchBar />

        <div className="flex-1 flex items-end justify-end">
          <ModeToggle />
        </div>
      </div>

      <div className="h-14" />

      <aside className="fixed left-0 bottom-0 w-40 border-r top-14 p-4 max-md:hidden">
        <Sidebar userId={user?.handle} />
      </aside>

      <main className="w-full mx-auto md:pl-44">{children}</main>

      <BottomTabNavigator />
    </div>
  );
}
