import { TemplateWithSidebar } from "@/components/template-with-sidebar";
import { PillNavbar } from "@/components/pill-navbar";
import * as routes from "@/lib/routes";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { query: string };
}) {
  const links = [
    {
      href: routes.searchPosts(params.query),
      label: "Posts",
    },
    {
      href: routes.searchUsers(params.query),
      label: "Users",
    },
    {
      href: routes.searchHashtags(params.query),
      label: "Hashtags",
    },
  ];

  return (
    <TemplateWithSidebar>
      <div>
        <PillNavbar links={links} />
        {children}
      </div>
    </TemplateWithSidebar>
  );
}
