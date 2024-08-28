import { getSession } from "@/lib/atp-client";
import { Sidebar } from "@/components/sidebar.client"

export default async function Layout({ children }: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-14 border-b flex flex-row items-center px-4 sticky top-0 bg-white/50 z-20 backdrop-blur">
        <span className="text-xl font-bold">bluedit</span>
      </div>

      <aside className="fixed left-0 bottom-0 w-40 border-r top-14 p-4">
        <Sidebar userId={user.handle} />
      </aside>

      <main className="w-full mx-auto pr-4 pl-44 max-w-5xl">
        {children}
      </main>
    </div>
  );
}