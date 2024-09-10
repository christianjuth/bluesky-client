import { getSavedFeeds, getSession } from "@/lib/atp-client";
import { type NextRequest, NextResponse } from "next/server";
import { InferNextResponseJSON } from "@/lib/type-utils";
import z from "zod";

const searchParamsSchema = z.object({
  userId: z.string(),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  return NextResponse.json(await getSavedFeeds());
}

export type GetResponse = InferNextResponseJSON<typeof GET>;

export type QueryParams = z.infer<typeof searchParamsSchema>;
