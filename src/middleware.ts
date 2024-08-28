import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessJwt = request.cookies.get('accessJwt')
  const refreshJwt = request.cookies.get('refreshJwt')
  const did = request.cookies.get('did')
  const handle = request.cookies.get('handle')

  if (!accessJwt || !refreshJwt || !did || !handle) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
}
