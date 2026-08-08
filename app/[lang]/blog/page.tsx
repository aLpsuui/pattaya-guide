import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { unstable_cache } from 'next/cache'
import Link from '@/app/components/LocaleLink'
import { hasLocale } from '@/lib/i18n/config'
import { getTranslated } from '@/lib/i18n/translateContent'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { altLanguages } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  author: string
  category: string
  hero_image: string
  read_time: number
  published_at: string
}

// Re-generate this page from the database at most once every 60s (ISR),
// so newly published blog posts appear without a full rebuild.
export const revalidate = 60

function getInitials(name: string) {
  return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PG'
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function categoryToFilter(category: string): string {
  const map: Record<string, string> = {
    'Eat & Drink': 'eat',
    'Eat & Drinks': 'eat',
    'Things to Do': 'things',
    'Wellness': 'wellness',
    'Wellness & Beauty': 'wellness',
    'Nightlife': 'nightlife',
    'Areas': 'areas',
    'Areas & Neighbourhoods': 'areas',
    'Travel Tips': 'travel',
  }
  return map[category] || 'travel'
}

// Cache the DB result in Next's data cache (revalidate 60s) so this dynamic
// (searchParams-driven) route doesn't hit Supabase on every request — the
// audit measured ~0.8s TTFB from the live query; cached it drops to ~0.2s.
const getBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const cols = 'id, slug, title, description, author, category, hero_image, read_time, published_at'
    // Honour the admin drag order (sort_order); fall back if the column is absent.
    let res = await supabase.from('blog_posts').select(cols).eq('is_published', true)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('published_at', { ascending: false })
    if (res.error) {
      res = await supabase.from('blog_posts').select(cols).eq('is_published', true)
        .order('published_at', { ascending: false })
    }
    return (res.data as BlogPost[]) || []
  },
  ['blog-list'],
  { revalidate: 60, tags: ['blog'] },
)

const listTitle = 'Pattaya Blog - Honest Guides, Tips & Local Stories | Go To Pattaya'
const listDescription = 'In-depth Pattaya guides written by locals: the best restaurants, things to do, wellness, nightlife, districts and practical travel tips.'

// Every ?topic= view needs its own title + description - identical metas
// across the filter URLs register as duplicate title/description issues
// (Semrush flagged 10 duplicate titles / 13 duplicate descriptions here).
const TOPIC_META: Record<string, { title: string; description: string }> = {
  eat: {
    title: 'Pattaya Food & Drink Guides - Blog | Go To Pattaya',
    description: 'Local guides to eating and drinking in Pattaya: the best restaurants, street food, seafood, cafés and rooftop bars - honestly reviewed.',
  },
  things: {
    title: 'Things to Do in Pattaya - Guides & Tips | Go To Pattaya',
    description: 'Blog guides to things to do in Pattaya: island trips, tours, beaches, viewpoints, family activities and hidden gems from local writers.',
  },
  wellness: {
    title: 'Pattaya Wellness & Spa Guides - Blog | Go To Pattaya',
    description: 'Massage, spas, Muay Thai, gyms and wellness retreats in Pattaya - practical local guides with prices and honest picks.',
  },
  nightlife: {
    title: 'Pattaya Nightlife Guides - Blog | Go To Pattaya',
    description: 'Local nightlife guides for Pattaya: Walking Street, rooftop bars, beach clubs, night markets and how to enjoy them safely.',
  },
  areas: {
    title: 'Pattaya Areas & Neighbourhoods - Blog | Go To Pattaya',
    description: 'Which part of Pattaya suits you? Local guides to Jomtien, Central, Naklua, Pratumnak, Wong Amat and beyond.',
  },
  travel: {
    title: 'Pattaya Travel Tips - Blog | Go To Pattaya',
    description: 'Practical Pattaya travel tips from locals: transport, safety, budgets, seasons, SIM cards and first-timer advice.',
  },
}

const PER_PAGE = 35
const TOPICS = [
  { key: 'all', label: 'All' },
  { key: 'eat', label: 'Eat & Drink' },
  { key: 'things', label: 'Things to Do' },
  { key: 'wellness', label: 'Wellness' },
  { key: 'nightlife', label: 'Nightlife' },
  { key: 'areas', label: 'Areas' },
  { key: 'travel', label: 'Travel Tips' },
]

// Self-canonical for paginated / filtered listings: /blog?page=2 (and
// ?topic=…) must point to itself, not collapse to page 1 - otherwise Google
// treats pages 2-5 as duplicates of page 1 and under-crawls their links.
export async function generateMetadata(
  { params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ page?: string; topic?: string }> },
): Promise<Metadata> {
  const [{ lang }, sp] = await Promise.all([params, searchParams])
  const locale = hasLocale(lang) ? lang : 'en'
  const topic = TOPICS.some((t) => t.key === sp.topic) ? sp.topic! : 'all'
  const all = await getBlogPosts()
  const filtered = topic === 'all' ? all : all.filter((p) => categoryToFilter(p.category) === topic)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const page = Math.min(Math.max(1, parseInt(sp.page || '1', 10) || 1), totalPages)

  const qsp = new URLSearchParams()
  if (topic !== 'all') qsp.set('topic', topic)
  if (page > 1) qsp.set('page', String(page))
  const qs = qsp.toString()
  const canonical = qs ? `/${locale}/blog?${qs}` : `/${locale}/blog`

  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  const base = TOPIC_META[topic] || { title: listTitle, description: listDescription }
  const bt = t(base.title), bd = t(base.description)
  const title = page > 1 ? `${bt} - Page ${page}` : bt
  const description = page > 1 ? `${bd} (Page ${page})` : bd
  return {
    title,
    description,
    alternates: { canonical, languages: altLanguages(qs ? `/blog?${qs}` : '/blog') },
    openGraph: { title, description },
  }
}

export default async function BlogPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ page?: string; topic?: string }> }) {
  const [{ lang }, sp] = await Promise.all([params, searchParams])
  const locale = hasLocale(lang) ? lang : 'en'
  const topic = TOPICS.some((t) => t.key === sp.topic) ? sp.topic! : 'all'
  const all = await getBlogPosts()
  const filtered = topic === 'all' ? all : all.filter((p) => categoryToFilter(p.category) === topic)

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  // Reject out-of-range page numbers with a real 404 instead of silently serving
  // the last page (which created an infinite ?page=N crawl trap - audit finding).
  const rawPage = Math.max(1, parseInt(sp.page || '1', 10) || 1)
  if (rawPage > totalPages) notFound()
  const page = rawPage
  let slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  // Translate the visible cards' DB text for /ru (cached; shares keys with the
  // detail page so it's instant once a post has been translated once).
  if (locale !== 'en') {
    slice = await Promise.all(
      slice.map(async (p) => ({
        ...p,
        title: await getTranslated('blog_posts', p.id, 'title', p.title, locale),
        description: await getTranslated('blog_posts', p.id, 'description', p.description, locale),
      })),
    )
  }
  const showFeatured = page === 1 && slice.length > 0
  const featured = showFeatured ? slice[0] : null
  const rest = showFeatured ? slice.slice(1) : slice

  const topicHref = (t: string) => (t === 'all' ? '/blog' : `/blog?topic=${t}`)
  const pageHref = (p: number) => {
    const params = new URLSearchParams()
    if (topic !== 'all') params.set('topic', topic)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `/blog?${qs}` : '/blog'
  }

  // windowed page numbers (1 … 3 4 5 … 6)
  const pageNums: (number | '…')[] = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const want = new Set([1, 2, totalPages - 1, totalPages, page - 1, page, page + 1])
    const arr = [...want].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
    const out: (number | '…')[] = []
    let prev = 0
    for (const p of arr) { if (p - prev > 1) out.push('…'); out.push(p); prev = p }
    return out
  })()

  // CollectionPage + ItemList so the blog index is a first-class listing entity
  // (the audit flagged the list page as having only Organization/WebSite schema).
  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/${locale}/blog#page`,
    url: `${SITE_URL}/${locale}/blog`,
    name: 'Pattaya Blog',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: slice.map((p, i) => ({
        '@type': 'ListItem',
        position: (page - 1) * PER_PAGE + i + 1,
        url: `${SITE_URL}/${locale}/blog/${p.slug}`,
        name: p.title,
      })),
    },
  }

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
            <span className="cur">Blog</span>
          </nav>
          <div className="kicker" style={{marginTop:'var(--s3)'}}>The blog</div>
          <h1>Honest Pattaya guides &amp; stories</h1>
          <p className="lead">Written and re-checked by editors who live here. No sponsored rankings, no recycled travel-blog fluff - just the real Pattaya, explained.</p>
        </div>
      </section>

      {/* FILTER RAIL */}
      <div className="filter-rail">
        <div className="container">
          <div className="filterbar" role="group" aria-label="Filter by topic">
            {TOPICS.map((t) => (
              <Link key={t.key} href={topicHref(t.key)} className={`chip${topic === t.key ? ' active' : ''}`} aria-pressed={topic === t.key}>{t.label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* POST GRID */}
      <section className="section-sm">
        <div className="container">
          <div className="cards" id="postGrid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))'}}>

            {/* FEATURED - first post */}
            {featured && (
              <article className="post post--feature" data-tags={categoryToFilter(featured.category)}>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="ph"
                  style={{backgroundImage:`url('${featured.hero_image}')`}}
                  aria-label={featured.title}
                >
                  <span className="k badge-live"><span className="dot"></span>Editor's pick</span>
                </Link>
                <div className="pb">
                  <span className="pill pill--blue" style={{alignSelf:'flex-start'}}>{featured.category}</span>
                  <h2><Link href={`/blog/${featured.slug}`}>{featured.title}</Link></h2>
                  <p>{featured.description}</p>
                  <div className="by">
                    <span className="av">{getInitials(featured.author)}</span>
                    <span>{featured.author}</span>
                    <span className="dot"></span>
                    <span>{featured.read_time} min read</span>
                    <span className="dot"></span>
                    <span>Updated {formatDate(featured.published_at)}</span>
                  </div>
                </div>
              </article>
            )}

            {/* REST OF POSTS */}
            {rest.map(post => (
              <article key={post.id} className="post" data-tags={categoryToFilter(post.category)}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="ph"
                  style={{backgroundImage:`url('${post.hero_image}')`}}
                  aria-label={post.title}
                >
                  <span className="k pill pill--blue">{post.category}</span>
                </Link>
                <div className="pb">
                  <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.description}</p>
                  <div className="by">
                    <span className="av">{getInitials(post.author)}</span>
                    <span>{post.author}</span>
                    <span className="dot"></span>
                    <span>{post.read_time} min read</span>
                    <span className="dot"></span>
                    <span>Updated {formatDate(post.published_at)}</span>
                  </div>
                </div>
              </article>
            ))}

          </div>

          {/* EMPTY STATE */}
          {filtered.length === 0 && (
            <div className="empty">
              <div className="eic">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>
              </div>
              <h3>No articles in this topic yet</h3>
              <p>We&apos;re writing more every week. Try another topic or subscribe below.</p>
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <nav className="blog-pager" aria-label="Blog pages">
              {page > 1
                ? <Link className="bp-btn" href={pageHref(page - 1)} aria-label="Previous"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></Link>
                : <span className="bp-btn is-disabled" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></span>}
              {pageNums.map((p, i) => p === '…'
                ? <span key={'e' + i} className="bp-ell">…</span>
                : <Link key={p} className={`bp-btn${p === page ? ' on' : ''}`} href={pageHref(p)}>{p}</Link>)}
              {page < totalPages
                ? <Link className="bp-btn" href={pageHref(page + 1)} aria-label="Next"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></Link>
                : <span className="bp-btn is-disabled" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>}
            </nav>
          )}

        </div>
      </section>
    </main>
  )
}
