import { getSession, publicAgent } from "@/lib/atp-client";
import { UserSidebar } from "@/components/user-sidebar";
import { TemplateWithSidebar } from "@/components/template-with-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PillNavbar } from "@/components/pill-navbar";
import * as routes from "@/lib/routes";
import { getInitials } from "@/lib/format";
import { Button } from "@/components/ui/button";

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

  const initials = getInitials(profile.data.displayName ?? profile.data.handle);

  const links = [
    { href: routes.user(params.userId), label: "Overview" },
    { href: routes.userPosts(params.userId), label: "Posts" },
    { href: routes.userReplies(params.userId), label: "Replies" },
    ...(isMyself
      ? [{ href: routes.userLikes(params.userId), label: "Likes" }]
      : []),
  ];

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
                {profile.data.displayName || profile.data.handle}
              </p>
              <p className="text-muted-foreground">u/{profile.data.handle}</p>
            </div>

            <Button>Follow</Button>
          </div>

          <PillNavbar links={links} />
        </div>
        {children}
      </>
      <UserSidebar profile={profile.data} />
    </TemplateWithSidebar>
  );
}
