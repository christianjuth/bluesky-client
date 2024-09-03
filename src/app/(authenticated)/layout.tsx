import { getSession } from "@/lib/atp-client";
import { Sidebar } from "@/components/sidebar.client"
import Link from "next/link";
import { ModeToggle } from '@/components/theme-mode-toggle'
import * as routes from "@/lib/routes";

export default async function Layout({ children }: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-14 border-b flex flex-row items-center justify-between px-4 fixed top-0 inset-x-0 bg-background/70 z-20 backdrop-blur">
        <Link href={routes.home}>
          <span className="text-xl font-bold">bluedit</span>
        </Link>

        <ModeToggle />
      </div>

      <div className="h-14" />

      <aside className="fixed left-0 bottom-0 w-40 border-r top-14 p-4">
        <Sidebar userId={user?.handle} />
      </aside>

      <main className="w-full mx-auto pr-4 pl-44 max-w-5xl">
        {children}
      </main>
    </div>
  );
}
