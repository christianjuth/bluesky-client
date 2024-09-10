import { type NextResponse } from "next/server";

type UnwrapNextResponse<T extends NextResponse> =
  T extends NextResponse<infer U> ? U : never;

export type InferNextResponseJSON<
  T extends (...args: any[]) => Promise<NextResponse>,
> = UnwrapNextResponse<Awaited<ReturnType<T>>>;
