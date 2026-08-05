import { localeSitemapXml } from '@/lib/sitemapData'

// Russian sitemap: every path's /ru URL as <loc> + reciprocal hreflang. Gives
// the Russian pages first-class <loc> entries for Yandex.
export const revalidate = 3600

export async function GET() {
  return new Response(await localeSitemapXml('ru'), {
    headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  })
}
