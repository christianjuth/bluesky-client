import { getSession, agent, getDiscoveryFeed } from "@/lib/atp-client";
import { VirtualizedPosts } from "@/components/virtualized-posts";
import { Post } from "@/components/post.server";
import { TemplateWithSidebar } from "@/components/template-with-sidebar";

// The number of items that will be rendered initially
// and live outside of the virtualized list. This allows
// the first n items to be rendered immediately, without JS.
const SPLIT = 10;

export default async function Pgae() {
  const session = await getSession();

  const timeline = session ? await agent.getTimeline() : undefined;
  const timelinePosts = timeline?.data.feed.map(({ post }) => post);

  const discoveryFeed = !session ? await getDiscoveryFeed() : undefined;
  const discoveryFeedPosts = discoveryFeed?.posts;

  const rscPosts = (timelinePosts ?? discoveryFeedPosts)?.slice(0, SPLIT);
  const restPosts = (timelinePosts ?? discoveryFeedPosts)?.slice(SPLIT);

  return (
    <>
      <TemplateWithSidebar>
        <>
          {rscPosts?.map((post) => <Post key={post.uri} post={post} />)}
          {restPosts && <VirtualizedPosts defaultPosts={restPosts} />}
        </>
        <div>Sidebar</div>
      </TemplateWithSidebar>
    </>
  );
}
