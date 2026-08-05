import 'server-only'
import { supabase } from '@/lib/supabase'
import { SITE_URL } from '@/lib/site'
import { AREAS } from '@/lib/areas'

// Shared sitemap data for the split, index-based sitemap. /sitemap.xml is a
// <sitemapindex> (app/sitemap.xml/route.ts) pointing at /sitemap-en.xml and
// /sitemap-ru.xml. Each locale file lists ITS locale's URLs as <loc> with
// reciprocal hreflang alternates - so Yandex (which under-discovers pages that
// exist only as hreflang alternates) sees the Russian pages as first-class.
interface Spec { path: string; lastmod: string; changefreq: string; priority: number }

async function paths(): Promise<Spec[]> {
  const now = new Date().toISOString()
  const specs: Spec[] = [
    { path: '', lastmod: now, changefreq: 'daily', priority: 1 },
    { path: '/eat-and-drinks', lastmod: now, changefreq: 'weekly', priority: 0.9 },
    { path: '/things-to-do', lastmod: now, changefreq: 'weekly', priority: 0.9 },
    { path: '/yoga-and-fitness', lastmod: now, changefreq: 'weekly', priority: 0.9 },
    { path: '/wellness-and-beauty', lastmod: now, changefreq: 'weekly', priority: 0.9 },
    { path: '/areas', lastmod: now, changefreq: 'weekly', priority: 0.9 },
    { path: '/nightlife', lastmod: now, changefreq: 'weekly', priority: 0.9 },
    { path: '/map', lastmod: now, changefreq: 'weekly', priority: 0.7 },
    { path: '/blog', lastmod: now, changefreq: 'daily', priority: 0.8 },
    { path: '/plan-my-trip', lastmod: now, changefreq: 'monthly', priority: 0.6 },
    { path: '/about', lastmod: now, changefreq: 'monthly', priority: 0.5 },
    { path: '/contact', lastmod: now, changefreq: 'yearly', priority: 0.3 },
    { path: '/privacy', lastmod: now, changefreq: 'yearly', priority: 0.2 },
    { path: '/terms', lastmod: now, changefreq: 'yearly', priority: 0.2 },
  ]

  for (const a of AREAS) specs.push({ path: `/areas/${a.slug}`, lastmod: now, changefreq: 'monthly', priority: 0.7 })

  try {
    const { data } = await supabase.from('blog_posts').select('slug, updated_at_post, published_at').eq('is_published', true)
    for (const p of (data || []) as { slug: string; updated_at_post: string | null; published_at: string | null }[]) {
      specs.push({ path: `/blog/${p.slug}`, lastmod: (p.updated_at_post || p.published_at || now) as string, changefreq: 'weekly', priority: 0.7 })
    }
  } catch { /* DB unreachable → keep static routes */ }

  try {
    const PAGE = 1000
    for (let from = 0; ; from += PAGE) {
      const { data } = await supabase.from('venues').select('slug, updated_at').eq('is_active', true).order('slug', { ascending: true }).range(from, from + PAGE - 1)
      const rows = (data || []) as { slug: string | null; updated_at: string | null }[]
      for (const v of rows) if (v.slug) specs.push({ path: `/venues/${v.slug}`, lastmod: (v.updated_at || now) as string, changefreq: 'weekly', priority: 0.6 })
      if (rows.length < PAGE) break
    }
  } catch { /* ignore */ }

  return specs
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Full <urlset> XML for one locale, with reciprocal hreflang on every <url>.
export async function localeSitemapXml(locale: 'en' | 'ru'): Promise<string> {
  const specs = await paths()
  const urls = specs.map((s) => {
    const en = `${SITE_URL}/en${s.path}`
    const ru = `${SITE_URL}/ru${s.path}`
    const loc = locale === 'ru' ? ru : en
    return `<url><loc>${esc(loc)}</loc>` +
      `<xhtml:link rel="alternate" hreflang="en" href="${esc(en)}"/>` +
      `<xhtml:link rel="alternate" hreflang="ru" href="${esc(ru)}"/>` +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${esc(en)}"/>` +
      `<lastmod>${s.lastmod}</lastmod><changefreq>${s.changefreq}</changefreq><priority>${s.priority}</priority></url>`
  }).join('')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`
}
