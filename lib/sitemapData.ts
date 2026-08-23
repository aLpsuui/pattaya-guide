import 'server-only'
import { supabase } from '@/lib/supabase'
import { SITE_URL } from '@/lib/site'
import { AREAS, areaSlugForNeighborhood } from '@/lib/areas'
import { AUTHORS } from '@/lib/authors'
import { CATEGORY_GROUPS } from '@/lib/venueGroups'
import { groupForSubcat } from '@/lib/subcategories'

// Public URL path per DB category slug (matches the route folders).
const CAT_PATH: Record<string, string> = {
  'eat-and-drinks': '/eat-and-drinks',
  'thinks-to-do': '/things-to-do',
  'nightlife': '/nightlife',
  'yoga-and-fitness': '/yoga-and-fitness',
}

// Shared sitemap data for the split, index-based sitemap. /sitemap.xml is a
// <sitemapindex> (app/sitemap.xml/route.ts) pointing at /sitemap-en.xml and
// /sitemap-ru.xml. Each locale file lists ITS locale's URLs as <loc> with
// reciprocal hreflang alternates - so Yandex (which under-discovers pages that
// exist only as hreflang alternates) sees the Russian pages as first-class.
interface Spec { path: string; lastmod: string; changefreq: string; priority: number }

// Pillar public path → DB category slug, for deriving each pillar's lastmod from
// the freshest venue it contains.
const PILLAR_SLUG: Record<string, string> = {
  '/eat-and-drinks': 'eat-and-drinks',
  '/things-to-do': 'thinks-to-do',
  '/yoga-and-fitness': 'yoga-and-fitness',
  '/wellness-and-beauty': 'wellness-and-beauty',
  '/nightlife': 'nightlife',
}
// A stable date for the truly-static legal/util pages, so their lastmod is
// meaningful (their real last edit) rather than a per-build timestamp.
const STABLE = '2026-07-07T00:00:00.000Z'

async function paths(): Promise<Spec[]> {
  const now = new Date().toISOString()
  const toISO = (v: string | null | undefined): string => {
    if (!v) return now
    const d = new Date(v)
    return isNaN(d.getTime()) ? now : d.toISOString()
  }
  const later = (a: string | undefined, b: string): string => (!a || b > a ? b : a) // ISO strings sort lexically

  // Real content dates aggregated as we stream the venues/blogs, so every
  // aggregate page (home, pillar, subcategory, area) carries the freshest date
  // of the content it lists — a meaningful lastmod instead of build time.
  const catMax = new Map<string, string>()    // category slug → newest venue date
  const groupMax = new Map<string, string>()  // "catSlug/groupKey" → newest venue date
  const areaMax = new Map<string, string>()   // area slug → newest venue date
  let allMax = STABLE
  let blogMax = STABLE
  const venueSpecs: Spec[] = []
  const blogSpecs: Spec[] = []

  try {
    const { data } = await supabase.from('blog_posts').select('slug, updated_at_post, published_at').eq('is_published', true)
    for (const p of (data || []) as { slug: string; updated_at_post: string | null; published_at: string | null }[]) {
      const d = toISO(p.updated_at_post || p.published_at)
      blogMax = later(blogMax, d); allMax = later(allMax, d)
      blogSpecs.push({ path: `/blog/${p.slug}`, lastmod: d, changefreq: 'weekly', priority: 0.7 })
    }
  } catch { /* DB unreachable → keep static routes */ }

  try {
    const PAGE = 1000
    for (let from = 0; ; from += PAGE) {
      const { data } = await supabase.from('venues')
        .select('slug, updated_at, created_at, neighborhood, subcategory, categories!inner(slug)')
        .eq('is_active', true).order('slug', { ascending: true }).range(from, from + PAGE - 1)
      const rows = (data || []) as unknown as { slug: string | null; updated_at: string | null; created_at: string | null; neighborhood: string | null; subcategory: string | null; categories: { slug: string } | null }[]
      for (const v of rows) {
        if (!v.slug) continue
        const d = toISO(v.updated_at || v.created_at)
        allMax = later(allMax, d)
        const cat = v.categories?.slug
        if (cat) {
          catMax.set(cat, later(catMax.get(cat), d))
          const g = groupForSubcat(v.subcategory)
          if (g) groupMax.set(`${cat}/${g}`, later(groupMax.get(`${cat}/${g}`), d))
        }
        const area = areaSlugForNeighborhood(v.neighborhood)
        if (area) areaMax.set(area, later(areaMax.get(area), d))
        venueSpecs.push({ path: `/venues/${v.slug}`, lastmod: d, changefreq: 'weekly', priority: 0.6 })
      }
      if (rows.length < PAGE) break
    }
  } catch { /* ignore */ }

  const specs: Spec[] = [
    { path: '', lastmod: allMax, changefreq: 'daily', priority: 1 },
    { path: '/areas', lastmod: allMax, changefreq: 'weekly', priority: 0.9 },
    { path: '/map', lastmod: allMax, changefreq: 'weekly', priority: 0.7 },
    { path: '/blog', lastmod: blogMax, changefreq: 'daily', priority: 0.8 },
    { path: '/plan-my-trip', lastmod: STABLE, changefreq: 'monthly', priority: 0.6 },
    { path: '/about', lastmod: STABLE, changefreq: 'monthly', priority: 0.5 },
    { path: '/contact', lastmod: STABLE, changefreq: 'yearly', priority: 0.3 },
    { path: '/privacy', lastmod: STABLE, changefreq: 'yearly', priority: 0.2 },
    { path: '/terms', lastmod: STABLE, changefreq: 'yearly', priority: 0.2 },
  ]
  // Pillar landing pages: lastmod = freshest venue in that category.
  for (const [path, slug] of Object.entries(PILLAR_SLUG)) {
    specs.push({ path, lastmod: catMax.get(slug) || allMax, changefreq: 'weekly', priority: 0.9 })
  }
  // Area hub pages: lastmod = freshest venue in that area.
  for (const a of AREAS) specs.push({ path: `/areas/${a.slug}`, lastmod: areaMax.get(a.slug) || allMax, changefreq: 'monthly', priority: 0.7 })

  // Subcategory landing pages (e.g. /eat-and-drinks/cafes): freshest venue in that group.
  for (const [slug, path] of Object.entries(CAT_PATH)) {
    for (const g of CATEGORY_GROUPS[slug] || []) {
      specs.push({ path: `${path}/${g.key}`, lastmod: groupMax.get(`${slug}/${g.key}`) || catMax.get(slug) || allMax, changefreq: 'weekly', priority: 0.8 })
    }
  }
  // Author pages: as fresh as the latest post.
  for (const a of AUTHORS) specs.push({ path: `/author/${a.slug}`, lastmod: blogMax, changefreq: 'monthly', priority: 0.4 })

  return [...specs, ...blogSpecs, ...venueSpecs]
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Normalise every lastmod to full ISO 8601 (W3C datetime). Blog published_at is a
// DATE column ('2026-06-10'), venue updated_at a timestamptz - the audit flagged
// the mixed date-only / datetime formats; Google only trusts a consistent format.
function isoLastmod(v: string): string {
  const d = new Date(v)
  return isNaN(d.getTime()) ? v : d.toISOString()
}

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
      `<lastmod>${isoLastmod(s.lastmod)}</lastmod><changefreq>${s.changefreq}</changefreq><priority>${s.priority}</priority></url>`
  }).join('')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`
}
