import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { SITE_URL } from '@/lib/site'
import { AREAS } from '@/lib/areas'

export const revalidate = 3600 // refresh the sitemap hourly

// The site is prefix-all (/en + /ru). We split the sitemap by language via
// generateSitemaps: /sitemap.xml becomes a <sitemapindex> pointing at
// /sitemap/en.xml and /sitemap/ru.xml. Each language file lists ITS locale's
// URLs as <loc> and carries reciprocal hreflang alternates for both locales -
// so Yandex (which crawls <loc> far more reliably than sitemap hreflang, and
// under-discovered the Russian pages when they only existed as alternates) sees
// the Russian pages as first-class, and Google still gets the hreflang mapping.
export async function generateSitemaps(): Promise<{ id: string }[]> {
  return [{ id: 'en' }, { id: 'ru' }]
}

type ChangeFreq = MetadataRoute.Sitemap[number]['changeFrequency']
interface PathSpec { path: string; lastModified: Date | string; changeFrequency: ChangeFreq; priority: number }

// Every localizable path once (locale-agnostic); the per-locale <loc> + hreflang
// block is built in the default export from these.
async function allPaths(): Promise<PathSpec[]> {
  const now = new Date()

  const paths: PathSpec[] = [
    { path: '', lastModified: now, changeFrequency: 'daily', priority: 1 },
    { path: '/eat-and-drinks', lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { path: '/things-to-do', lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { path: '/yoga-and-fitness', lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { path: '/wellness-and-beauty', lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { path: '/areas', lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { path: '/nightlife', lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { path: '/map', lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { path: '/blog', lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { path: '/plan-my-trip', lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { path: '/about', lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { path: '/contact', lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { path: '/privacy', lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { path: '/terms', lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Area guide pages.
  for (const a of AREAS) paths.push({ path: `/areas/${a.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 })

  // Published blog posts.
  try {
    const { data } = await supabase.from('blog_posts').select('slug, updated_at_post, published_at').eq('is_published', true)
    for (const p of (data || []) as { slug: string; updated_at_post: string | null; published_at: string | null }[]) {
      paths.push({ path: `/blog/${p.slug}`, lastModified: p.updated_at_post || p.published_at || now, changeFrequency: 'weekly', priority: 0.7 })
    }
  } catch { /* DB unreachable at build → keep static routes */ }

  // Every active venue detail page (paginated past PostgREST's 1000-row cap).
  try {
    const PAGE = 1000
    for (let from = 0; ; from += PAGE) {
      const { data } = await supabase.from('venues').select('slug, updated_at').eq('is_active', true).order('slug', { ascending: true }).range(from, from + PAGE - 1)
      const rows = (data || []) as { slug: string | null; updated_at: string | null }[]
      for (const v of rows) if (v.slug) paths.push({ path: `/venues/${v.slug}`, lastModified: v.updated_at || now, changeFrequency: 'weekly', priority: 0.6 })
      if (rows.length < PAGE) break
    }
  } catch { /* ignore */ }

  return paths
}

export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const locale = (await id) === 'ru' ? 'ru' : 'en'
  const paths = await allPaths()
  return paths.map((p) => ({
    url: `${SITE_URL}/${locale}${p.path}`,
    lastModified: p.lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
    alternates: {
      languages: {
        en: `${SITE_URL}/en${p.path}`,
        ru: `${SITE_URL}/ru${p.path}`,
        'x-default': `${SITE_URL}/en${p.path}`,
      },
    },
  }))
}
