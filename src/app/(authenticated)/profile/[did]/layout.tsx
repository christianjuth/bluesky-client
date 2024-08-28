import { getSession, agent } from '@/lib/atp-client'
import Image from 'next/image'

export default async function Profile({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession()
  
  const { data } = await agent.getProfile({
    actor: user.did
  })

  const avatar = data.avatar

  return (
    <div className="flex-1 max-w-[80ch]">
      <div className="flex flex-row space-x-2 pb-4">
        <div className="h-12 w-12 relative">
          {avatar && <Image src={avatar} alt="Profile image" fill className="rounded-full" />}
        </div>

        <div className="flex flex-col">
          <p>{data.handle}</p>
          <p>@{data.handle}</p>
        </div>
      </div>

      <div className="flex flex-row">
        <div>
        {children}
        </div>
        <div className="sticky top-0">
          Sidebar
        </div>
      </div>
    </div>
  );
}
