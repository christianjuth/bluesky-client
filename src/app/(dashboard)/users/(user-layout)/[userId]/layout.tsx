import { getSession, publicAgent } from "@/lib/atp-client";
import { UserSidebar } from "@/components/user-sidebar";
import { ProfileNavbar } from "./profile-navbar";
import { TemplateWithSidebar } from "@/components/template-with-sidebar";
import Image from "next/image";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string };
}) {
  const profile = await publicAgent.getProfile({
    actor: params.userId,
  });

  const session = await getSession();

  const isMyself = session?.handle === params.userId;

  const avatar = profile.data.avatar;

  return (
    <TemplateWithSidebar>
      <>
        <div className="max-md:px-4 px-2">
          <div className="flex flex-row space-x-2 pb-4 items-center">
            <div className="h-16 w-16 relative">
              {avatar && (
                <Image
                  src={avatar}
                  alt="Profile image"
                  fill
                  className="rounded-full"
                />
              )}
            </div>

            <div className="flex flex-col">
              <p className="font-bold">{profile.data.handle}</p>
              <p className="text-muted-foreground">u/{profile.data.handle}</p>
            </div>
          </div>
          <ProfileNavbar
            userId={params.userId}
            isMyself={isMyself}
            profile={profile.data}
          />
        </div>
        {children}
      </>
      <UserSidebar profile={profile.data} />
    </TemplateWithSidebar>
  );
}
