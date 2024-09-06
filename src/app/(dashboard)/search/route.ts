import { type NextRequest, NextResponse } from "next/server";

const matchSearchUrl = /\/search\/(.*)\/(hashtags|users)$/;

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  let redirect = `/search/${query}`;

  const referrer = request.headers.get("referer");
  const referrerIsSearchPage = referrer?.match(matchSearchUrl);

  if (referrerIsSearchPage && referrerIsSearchPage[2]) {
    redirect += `/${referrerIsSearchPage[2]}`;
  }

  return NextResponse.redirect(new URL(redirect, request.nextUrl));
}
