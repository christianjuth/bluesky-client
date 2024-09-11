import { agent, getSession, publicAgent } from "@/lib/bsky/agent";
import { accountSchema } from "@/lib/schemas";
import { type NextRequest, NextResponse } from "next/server";
import { InferNextResponseJSON } from "@/lib/type-utils";
import z from "zod";

const searchParamsSchema = z.object({
  userId: z.string(),
});

export async function GET(request: NextRequest) {
  const session = await getSession();

  const searchParams = request.nextUrl.searchParams;

  try {
    const { userId } = searchParamsSchema.parse({
      userId: decodeURIComponent(searchParams.get("userId") ?? ""),
    });

    const user = await (session ? agent : publicAgent).getProfile({
      actor: userId,
    });

    return NextResponse.json({
      user: accountSchema.parse(user.data),
    });
  } catch (e) {
    return NextResponse.json(
      {
        errors: e,
      },
      {
        status: 400,
      },
    );
  }
}

export type GetResponse = InferNextResponseJSON<typeof GET>;

export type QueryParams = z.infer<typeof searchParamsSchema>;
