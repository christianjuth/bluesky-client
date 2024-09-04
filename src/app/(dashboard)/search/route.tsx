import { type NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  return NextResponse.redirect(new URL(`/search/${query}`, request.nextUrl));
}
