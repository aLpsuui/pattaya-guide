import type { MetadataRoute } from 'next'
import { SITE_URL, INDEXABLE } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Until a production domain is configured (NEXT_PUBLIC_SITE_URL), keep the
  // preview deployment out of the index.
  if (!INDEXABLE) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  return {
    // Note: no `host` directive - Yandex deprecated it in 2018 and ignores it.
    // The sitemap URL stays /sitemap.xml (now a <sitemapindex> for en + ru).
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
