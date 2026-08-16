// Prefix locale-less internal links in authored HTML with the active locale, and
// normalize the root link ("/" and "/<locale>/") to the canonical "/<locale>",
// so internal links resolve directly instead of 308-redirecting (audit P1-4).
// Leaves already-prefixed (/en, /ru), /api, /admin, protocol-relative (//) and
// external (https://) links untouched. Hashes and query strings are preserved.
export function localizeHtml(html: string, locale: string): string {
  let out = html.replace(/href="(\/[^"#]*)/g, (m, path: string) => {
    if (/^\/(en|ru)(\/|$)/.test(path) || path.startsWith('/api') || path.startsWith('/admin') || path.startsWith('//')) return m
    return path === '/' ? `href="/${locale}` : `href="/${locale}${path}`
  })
  // "/en/" (root with a trailing slash) -> "/en"
  out = out.replace(new RegExp(`href="/${locale}/"`, 'g'), `href="/${locale}"`)
  return out
}
