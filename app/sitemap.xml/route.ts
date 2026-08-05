import { SITE_URL } from '@/lib/site'

// /sitemap.xml is the <sitemapindex> for the language-split sitemaps. robots.txt
// points crawlers here; it references the per-locale files. Serving the index
// (and the locale files) as plain route handlers avoids Next's metadata sitemap
// convention, which reserves /sitemap.xml and can't emit an index itself.
export const revalidate = 3600

export async function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE_URL}/sitemap-en.xml</loc></sitemap>
  <sitemap><loc>${SITE_URL}/sitemap-ru.xml</loc></sitemap>
</sitemapindex>`
  return new Response(body, {
    headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  })
}
