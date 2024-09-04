import { getSession, publicAgent } from "@/lib/atp-client";
import { Sidebar } from './sidebar'
import { ProfileNavbar } from './profile-navbar'

export default async function Layout({ 
  children,
  params
}: { 
  children: React.ReactNode,
  params: { userId: string };
}) {
  const profile = await publicAgent.getProfile({
    actor: params.userId,
  })

  const session = await getSession();

  const isMyself = session?.handle === params.userId;

  return (
    <div className="flex flex-row justify-center space-x-4">
      <div className="flex-1 max-w-[50ch] pt-4">
        <ProfileNavbar activeLink="" userId={params.userId} isMyself={isMyself} profile={profile.data} />
        {children}
      </div>
      <div className="sticky top-14 pt-4 h-min">
        <Sidebar profile={profile.data} />
      </div>
    </div>
  )
}
