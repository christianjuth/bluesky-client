import {
  getPopularFeedGenerators,
  getSavedFeeds,
  getSession,
} from "@/lib/bsky/agent";
import { FeedCard } from "@/components/feed-card";

export default async function Page() {
  const session = await getSession();

  const [feeds, savedFeeds] = await Promise.all([
    getPopularFeedGenerators({ limit: 100 }),
    session ? getSavedFeeds() : null,
  ]);

  const savedFeedMap = new Map<string, string>();
  if (savedFeeds) {
    for (const feed of savedFeeds.items) {
      savedFeedMap.set(feed.value, feed.id);
    }
  }

  return (
    <div className="max-w-5xl w-full mx-auto px-4 overflow-x-hidden">
      <h1 className="py-4 md:pt-8 text-2xl font-bold">Explore feeds</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {feeds.feeds.map((feed) => (
          <FeedCard
            key={feed.uri}
            feed={feed}
            className="border rounded-xl p-3"
            savedId={savedFeedMap.get(feed.uri)}
          />
        ))}
      </div>
    </div>
  );
}
