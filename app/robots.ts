import type { MetadataRoute } from 'next'
import { SITE_URL, INDEXABLE } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Until a production domain is configured (NEXT_PUBLIC_SITE_URL), keep the
  // preview deployment out of the index.
  if (!INDEXABLE) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
