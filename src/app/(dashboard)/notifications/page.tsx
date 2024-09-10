import { agent, getSession } from "@/lib/atp-client";
import { TemplateWithSidebar } from "@/components/template-with-sidebar";
import { Notification } from "@atproto/api/dist/client/types/app/bsky/notification/listNotifications";
import { RelativeTime } from "@/components/relative-time.client";
import { ActorAvatar } from "@/components/actor-avatar";
import { UserWithHoverCard } from "@/components/user-with-hover-card";
import Link from "next/link";
import * as routes from "@/lib/routes";

function getCreatedAt(notification: Notification) {
  return "createdAt" in notification.record &&
    typeof notification.record.createdAt === "string"
    ? notification.record.createdAt
    : undefined;
}

function FollowedBy({ notification }: { notification: Notification }) {
  const createdAt = getCreatedAt(notification);
  return (
    <Link
      className="py-2 flex flex-row items-center justify-between"
      href={routes.user(notification.author.handle)}
    >
      <UserWithHoverCard account={notification.author}>
        <div className="flex flex-row items-center space-x-1.5">
          <ActorAvatar actor={notification.author} className="w-8 h-8" />
          <span className="flex-1">
            {notification.author.displayName} followed you
          </span>
        </div>
      </UserWithHoverCard>
      {createdAt && <RelativeTime time={createdAt} />}
    </Link>
  );
}

export default async function Page() {
  await getSession();

  const notifications = await agent.listNotifications();

  return (
    <TemplateWithSidebar>
      <div className="divide-y px-4">
        {notifications.data.notifications.map((notification) => {
          switch (notification.reason) {
            case "follow":
              return (
                <FollowedBy
                  notification={notification}
                  key={notification.uri}
                />
              );
            default:
              return (
                <div key={notification.uri}>
                  This client does not yet implement the {notification.reason}{" "}
                  notification type
                </div>
              );
          }
        })}
      </div>
    </TemplateWithSidebar>
  );
}
