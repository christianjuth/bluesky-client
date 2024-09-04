import { getSession, agent, publicAgent } from "@/lib/atp-client";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const searchParams = request.nextUrl.searchParams;

  const session = await getSession();

  const cursor = searchParams.get("cursor") as string;

  const feed = await (session ? agent : publicAgent).getAuthorFeed({
    actor: params.userId,
    limit: 30,
    cursor,
  });

  return NextResponse.json(feed.data);
}
