import { getSession } from "@/lib/atp-client";
import { Sidebar } from "@/components/sidebar.client"

export default async function Layout({ children }: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-14 border-b flex flex-row items-center px-4">
        <span className="text-xl font-bold">Bluedit</span>
      </div>

      <aside className="fixed left-0 bottom-0 w-40 border-r top-14 p-4">
        <Sidebar userDid={user.did} />
      </aside>

      <main className="max-w-[80ch] mx-auto px-4">
        {children}
      </main>
    </div>
  );
}
