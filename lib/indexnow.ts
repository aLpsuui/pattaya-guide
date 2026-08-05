import 'server-only'
import { SITE_URL, INDEXABLE } from '@/lib/site'

// IndexNow: instantly tell Yandex (and Bing/Seznam/Yep - one shared key) that a
// URL is new, changed or deleted, so it re-crawls in hours instead of waiting
// for the sitemap. Fired from the admin save/delete actions. Best-effort and
// bounded (5s) - it must never block or fail an admin save.
const KEY = 'b534bcf52a289042bf8ae8fcc3b8fa55'
const ENDPOINT = 'https://yandex.com/indexnow'

// Notify IndexNow about locale-agnostic paths (e.g. '/venues/grace-spa'); each
// is expanded to both its /en and /ru URLs. Only runs on the live (indexable)
// production site - UAT/preview never pings.
export async function indexNowNotify(paths: string[]): Promise<void> {
  if (!INDEXABLE) return
  try {
    const host = new URL(SITE_URL).host
    const urlList = [
      ...new Set(
        paths.flatMap((p) => {
          const s = p.startsWith('/') ? p : `/${p}`
          return [`${SITE_URL}/en${s}`, `${SITE_URL}/ru${s}`]
        }),
      ),
    ]
    if (!urlList.length) return

    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 5000)
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE_URL}/${KEY}.txt`, urlList }),
        signal: ctrl.signal,
      })
    } finally {
      clearTimeout(timer)
    }
  } catch {
    /* best-effort; never surface to the admin */
  }
}
