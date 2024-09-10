import { getSession, publicAgent } from "@/lib/atp-client";
import { UserSidebar } from "@/components/user-sidebar";
import { TemplateWithSidebar } from "@/components/template-with-sidebar";
import { PillNavbar } from "@/components/pill-navbar";
import * as routes from "@/lib/routes";

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
          <PillNavbar links={links} />
        </div>
        {children}
      </>
      <UserSidebar
        profile={profile.data}
        className="max-md:-mx-4 max-md:rounded-none max-md:-mt-4 max-md:border-t-0"
      />
    </TemplateWithSidebar>
  );
}
