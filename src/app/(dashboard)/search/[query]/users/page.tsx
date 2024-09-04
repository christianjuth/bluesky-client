import { agent } from "@/lib/atp-client";
import { Profile } from "@/components/profile";

// The number of items that will be rendered initially
// and live outside of the virtualized list. This allows
// the first n items to be rendered immediately, without JS.
// const SPLIT = 10;

export default async function Page({ params }: { params: { query: string } }) {
  const actors = await agent.searchActors({
    q: params.query,
    limit: 10,
  });

  return (
    <>
      {actors.data.actors?.map((actor) => (
        <Profile key={actor.handle} profile={actor} />
      ))}
    </>
  );
}
