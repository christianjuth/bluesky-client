import { publicAgent } from '@/lib/atp-client'
import Image from 'next/image'
import dayjs from 'dayjs'

export default async function Profile({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId)
  
  const { data } = await publicAgent.getProfile({
    actor: userId,
  })

  const avatar = data.avatar
  const banner = data.banner

  return (
    <div className="flex flex-row flex-1">

      {/* Main Content */}
      <div className="flex-1 pt-4">
        <div className="flex flex-row space-x-2 pb-4 items-center">
          <div className="h-16 w-16 relative">
            {avatar && <Image src={avatar} alt="Profile image" fill className="rounded-full" />}
          </div>

          <div className="flex flex-col">
            <p className="font-bold">{data.handle}</p>
            <p className="text-muted-foreground">u/{data.handle}</p>
          </div>
        </div>

        <div>
          {children}
        </div>
      </div>

      {/* Sidebar */}
      <div className="sticky top-14 h-min p-4 max-lg:hidden w-80">
        <div className="border rounded-xl ">
          {banner && (
            <div className="relative aspect-[2.5] w-full">
              <Image src={banner} alt="Profile banner" layout="fill" objectFit="cover" className="rounded-tr-xl rounded-tl-xl" />
            </div>
          )}

          {data.description && <p className="p-4">{data.description}</p>}

          {/* Stats */}
          <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-10">
            <div className="flex flex-col">
              <span>{data.followsCount}</span>
              <span className="text-muted-foreground">Following</span>
            </div>

            <div className="flex flex-col">
              <span>{data.followersCount}</span>
              <span className="text-muted-foreground">Followers</span>
            </div>

            <div className="flex flex-col">
              <span>{dayjs(data.createdAt).format('MMM D, YYYY')}</span>
              <span className="text-muted-foreground">Joined</span>
            </div>

            <div className="flex flex-col">
              <span>{data.postsCount}</span>
              <span className="text-muted-foreground">Posts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
