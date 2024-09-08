import { getPopularFeedGenerators } from "@/lib/atp-client";
import { TemplateWithSidebar } from "@/components/template-with-sidebar";
import { FeedCard } from "@/components/feed-card";

export default async function Page() {
  const feeds = await getPopularFeedGenerators({
    limit: 50,
  });

  return (
    <TemplateWithSidebar>
      <div className="space-y-4">
        <span>Feeds</span>
        {feeds.feeds.map((feed) => (
          <FeedCard key={feed.uri} feed={feed} />
        ))}
      </div>
    </TemplateWithSidebar>
  );
}
