import { localeSitemapXml } from '@/lib/sitemapData'

// English sitemap: every path's /en URL as <loc> + reciprocal hreflang.
export const revalidate = 3600

export async function GET() {
  return new Response(await localeSitemapXml('en'), {
    headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  })
}
