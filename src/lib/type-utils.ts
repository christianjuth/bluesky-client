import { type NextResponse } from "next/server";
import { PromiseType } from "utility-types";

type UnwrapNextResponse<T extends NextResponse> =
  T extends NextResponse<infer U> ? U : never;
export type InferNextResponseJSON<
  T extends (...args: any[]) => Promise<NextResponse>,
> = UnwrapNextResponse<PromiseType<ReturnType<T>>>;
