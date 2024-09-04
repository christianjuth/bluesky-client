import { getSession, publicAgent } from "@/lib/atp-client";
import { UserSidebar } from "@/components/user-sidebar";
import { ProfileNavbar } from "./profile-navbar";
import { TemplateWithSidebar } from "@/components/template-with-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const initials = (profile.data.displayName ?? profile.data.handle)
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <TemplateWithSidebar>
      <>
        <div className="max-md:px-4 px-2">
          <div className="flex flex-row space-x-2 pb-4 items-center">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatar} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <p className="font-bold">
                {profile.data.displayName ?? profile.data.handle}
              </p>
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
