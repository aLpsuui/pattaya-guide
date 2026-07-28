import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { SITE_URL } from '@/lib/site'
import { AREAS } from '@/lib/areas'

export const revalidate = 3600 // refresh the sitemap hourly

// The site is prefix-all (/en + /ru). Every sitemap entry lists its canonical
// English URL plus hreflang alternates for both locales, so Google indexes the
// Russian version and understands the two are language variants. Emitting
// hreflang via the sitemap covers the whole site without per-page <link> tags.
function loc(path: string, opts: { lastModified: Date | string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}/en${path}`,
    ...opts,
    alternates: {
      languages: {
        en: `${SITE_URL}/en${path}`,
        ru: `${SITE_URL}/ru${path}`,
        'x-default': `${SITE_URL}/en${path}`,
      },
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static, always-present routes.
  const staticRoutes: MetadataRoute.Sitemap = [
    loc('', { lastModified: now, changeFrequency: 'daily', priority: 1 }),
    loc('/eat-and-drinks', { lastModified: now, changeFrequency: 'weekly', priority: 0.9 }),
    loc('/things-to-do', { lastModified: now, changeFrequency: 'weekly', priority: 0.9 }),
    loc('/yoga-and-fitness', { lastModified: now, changeFrequency: 'weekly', priority: 0.9 }),
    loc('/wellness-and-beauty', { lastModified: now, changeFrequency: 'weekly', priority: 0.9 }),
    loc('/areas', { lastModified: now, changeFrequency: 'weekly', priority: 0.9 }),
    loc('/nightlife', { lastModified: now, changeFrequency: 'weekly', priority: 0.9 }),
    loc('/map', { lastModified: now, changeFrequency: 'weekly', priority: 0.7 }),
    loc('/blog', { lastModified: now, changeFrequency: 'daily', priority: 0.8 }),
    loc('/plan-my-trip', { lastModified: now, changeFrequency: 'monthly', priority: 0.6 }),
    loc('/about', { lastModified: now, changeFrequency: 'monthly', priority: 0.5 }),
    loc('/contact', { lastModified: now, changeFrequency: 'yearly', priority: 0.3 }),
    loc('/privacy', { lastModified: now, changeFrequency: 'yearly', priority: 0.2 }),
    loc('/terms', { lastModified: now, changeFrequency: 'yearly', priority: 0.2 }),
  ]

  // The seven area guide pages.
  const areaRoutes: MetadataRoute.Sitemap = AREAS.map((a) =>
    loc(`/areas/${a.slug}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.7 }),
  )

  // Dynamic: published blog posts.
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('slug, updated_at_post, published_at')
      .eq('is_published', true)
    blogRoutes = (data || []).map((p: { slug: string; updated_at_post: string | null; published_at: string | null }) =>
      loc(`/blog/${p.slug}`, { lastModified: p.updated_at_post || p.published_at || now, changeFrequency: 'weekly', priority: 0.7 }),
    )
  } catch {
    // If the DB is unreachable at build time, still return the static routes.
    blogRoutes = []
  }

  // Dynamic: every active venue detail page - the product's deepest, most
  // valuable long-tail content. Paginated past PostgREST's 1000-row cap.
  let venueRoutes: MetadataRoute.Sitemap = []
  try {
    const all: { slug: string | null; updated_at: string | null }[] = []
    const PAGE = 1000
    for (let from = 0; ; from += PAGE) {
      const { data } = await supabase
        .from('venues')
        .select('slug, updated_at')
        .eq('is_active', true)
        .order('slug', { ascending: true })
        .range(from, from + PAGE - 1)
      const rows = data || []
      all.push(...(rows as typeof all))
      if (rows.length < PAGE) break
    }
    venueRoutes = all
      .filter((v) => v.slug)
      .map((v) =>
        loc(`/venues/${v.slug}`, { lastModified: v.updated_at || now, changeFrequency: 'weekly', priority: 0.6 }),
      )
  } catch {
    venueRoutes = []
  }

  return [...staticRoutes, ...areaRoutes, ...blogRoutes, ...venueRoutes]
}
