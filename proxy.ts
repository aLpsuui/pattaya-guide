import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_NAME, sessionToken } from '@/lib/admin/auth'
import { locales, defaultLocale } from '@/lib/i18n/config'

// Single project proxy (Next 16 renamed middleware -> proxy). Two jobs:
//   1) gate /admin behind the session cookie (unchanged behaviour)
//   2) locale-route the public site: prefix-all, so every public path lives
//      under /en or /ru; unprefixed requests redirect to the visitor's locale.
function pickLocale(req: NextRequest): string {
  // Default everyone to English. Russian is served only when the visitor has
  // explicitly chosen it via the language switcher (which sets the `locale`
  // cookie) - we no longer auto-route Russian-language browsers to /ru, so the
  // site's default entry is always English.
  const cookie = req.cookies.get('locale')?.value
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie
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

  // --- 1b) Merge duplicate venue slugs (301) ---
  // The same business was seeded twice under a bare and a "-pattaya" slug; the
  // duplicate reads as thin/duplicate content. Fold each into the canonical one.
  const VENUE_MERGE: Record<string, string> = {
    'manta-marina-pattaya': 'manta-marina',
    'real-divers-pattaya': 'real-divers',
    'great-grand-sweet-destination-pattaya': 'great-grand-sweet-destination',
  }
  const vm = pathname.match(/^(\/(?:en|ru))?\/venues\/([^/]+)\/?$/)
  if (vm && VENUE_MERGE[vm[2]]) {
    const url = req.nextUrl.clone()
    url.pathname = `${vm[1] || ''}/venues/${VENUE_MERGE[vm[2]]}`
    return NextResponse.redirect(url, 301)
  }

  // --- 2) Public locale routing ---
  const hasPrefix = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasPrefix) return NextResponse.next()

  const locale = pickLocale(req)
  const url = req.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  // 308 Permanent (not 307): the prefix-all structure is fixed, so the root and
  // every prefix-less legacy URL permanently live at their /<locale> path. Yandex
  // treats 307 as temporary and won't use it for mirror/canonical consolidation;
  // 308 lets it fold the old prefix-less URLs into the canonical locale URL.
  return NextResponse.redirect(url, 308)
}

export const config = {
  // Everything EXCEPT Next internals, /api, and paths with a file extension
  // (sitemap.xml, robots.txt, images, llms.txt, verification html, favicon…).
  // /admin IS included so the auth gate keeps running.
  // `opengraph-image` is a root-level metadata route with NO extension, so it
  // would otherwise be caught here and 308-redirected to /en/opengraph-image
  // (which doesn't exist → 404), breaking the branded OG fallback card. Exclude
  // it so it serves directly at /opengraph-image.
  matcher: ['/((?!_next|api|opengraph-image|.*\\.).*)'],
}
