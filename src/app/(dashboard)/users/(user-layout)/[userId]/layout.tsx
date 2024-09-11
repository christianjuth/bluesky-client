import { agent, getSession, publicAgent } from "@/lib/bsky/agent";
import { ActorSidebar } from "@/components/actor-sidebar";
import { TemplateWithSidebar } from "@/components/template-with-sidebar";
import { PillNavbar } from "@/components/pill-navbar";
import * as routes from "@/lib/routes";
import { userIsMyself } from "@/lib/bsky/utils.server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string };
}) {
  const session = await getSession();

  const actor = await (session ? agent : publicAgent).getProfile({
    actor: params.userId,
  });

  const isMyself = await userIsMyself(actor.data.handle);

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
      <ActorSidebar
        isMyself={isMyself}
        actor={actor.data}
        className="max-md:-mx-4 max-md:rounded-none max-md:-mt-4 max-md:border-t-0"
      />
    </TemplateWithSidebar>
  );
}
