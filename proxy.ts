import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_NAME, sessionToken } from '@/lib/admin/auth'

// Only gates /admin — the public site is never touched by this proxy.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin/login')) return NextResponse.next()

  const cookie = req.cookies.get(COOKIE_NAME)?.value
  const expected = await sessionToken()
  if (cookie && cookie === expected) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/admin/login'
  url.searchParams.set('next', pathname)
  return NextResponse.redirect(url)
}

export const config = { matcher: ['/admin', '/admin/:path*'] }
