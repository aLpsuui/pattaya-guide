import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_NAME, sessionToken } from '@/lib/admin/auth'
import { locales, defaultLocale } from '@/lib/i18n/config'

// Single project proxy (Next 16 renamed middleware -> proxy). Two jobs:
//   1) gate /admin behind the session cookie (unchanged behaviour)
//   2) locale-route the public site: prefix-all, so every public path lives
//      under /en or /ru; unprefixed requests redirect to the visitor's locale.
function pickLocale(req: NextRequest): string {
  const cookie = req.cookies.get('locale')?.value
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie
  const accept = (req.headers.get('accept-language') || '').toLowerCase()
  if (/(^|[,;\s])ru\b/.test(accept)) return 'ru'
  return defaultLocale
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // --- 1) Admin auth gate ---
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    // View-only environments (UAT) set ADMIN_DISABLED=true to switch admin off
    // entirely, so nobody can write to the shared DB from there. Prod leaves it
    // unset, so admin works normally.
    if (process.env.ADMIN_DISABLED === 'true') {
      const home = req.nextUrl.clone()
      home.pathname = `/${defaultLocale}`
      home.search = ''
      return NextResponse.redirect(home)
    }
    if (pathname.startsWith('/admin/login')) return NextResponse.next()
    const cookie = req.cookies.get(COOKIE_NAME)?.value
    const expected = await sessionToken()
    if (cookie && cookie === expected) return NextResponse.next()
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // --- 2) Public locale routing ---
  const hasPrefix = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasPrefix) return NextResponse.next()

  const locale = pickLocale(req)
  const url = req.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Everything EXCEPT Next internals, /api, and paths with a file extension
  // (sitemap.xml, robots.txt, images, llms.txt, verification html, favicon…).
  // /admin IS included so the auth gate keeps running.
  matcher: ['/((?!_next|api|.*\\.).*)'],
}
