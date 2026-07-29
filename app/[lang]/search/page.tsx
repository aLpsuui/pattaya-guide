import { supabase } from '@/lib/supabase'
import Link from '@/app/components/LocaleLink'
import Star from '@/app/components/Star'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { hasLocale } from '@/lib/i18n/config'
import { translateMany } from '@/lib/i18n/translateContent'

// Simple site search — powers the WebSite SearchAction (sitelinks searchbox).
// Search-result URLs shouldn't be indexed.
export const metadata = {
  title: 'Search | Go To Pattaya',
  description: 'Search verified places, guides and areas across Pattaya.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/search' },
}
export const revalidate = 0

interface VenueHit {
  slug: string; name: string; venue_type: string | null; neighborhood: string | null
  rating: number | null; categories: { name_en: string } | null
}
interface PostHit { slug: string; title: string; category: string | null }

async function runSearch(q: string) {
  const term = `%${q}%`
  const [{ data: venues }, { data: posts }] = await Promise.all([
    supabase.from('venues')
      .select('slug,name,venue_type,neighborhood,rating,categories(name_en)')
      .eq('is_active', true).ilike('name', term)
      .order('review_count', { ascending: false, nullsFirst: false }).limit(24),
    supabase.from('blog_posts')
      .select('slug,title,category').eq('is_published', true).ilike('title', term).limit(12),
  ])
  return { venues: (venues || []) as unknown as VenueHit[], posts: (posts || []) as unknown as PostHit[] }
}

export default async function SearchPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ q?: string }> }) {
  const [{ lang }, { q = '' }] = await Promise.all([params, searchParams])
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  const query = q.trim().slice(0, 80)
  const { venues, posts } = query ? await runSearch(query) : { venues: [], posts: [] }
  const total = venues.length + posts.length
  // Translate result venue types/categories; names + neighborhoods stay Latin.
  const [typeMap, catMap] = await Promise.all([
    translateMany('venue_types', 'label', venues.map((v) => v.venue_type), locale),
    translateMany('categories', 'name_en', venues.map((v) => v.categories?.name_en), locale),
  ])
  const tt = (s: string | null | undefined) => (s ? (typeMap.get(s) ?? catMap.get(s) ?? s) : s)

  return (
    <main id="main">
      <section className="page-hero">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">{t('Home')}</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span className="cur">{t('Search')}</span>
          </nav>
          <h1>{query ? `${t('Results for')} “${query}”` : t('Search Go To Pattaya')}</h1>
          <p className="lead">
            {query ? `${total} ${t(total === 1 ? 'result across places and guides.' : 'results across places and guides.')}` : t('Find verified places, guides and areas across Pattaya.')}
          </p>
          <form action="/search" role="search" className="search-form">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input type="search" name="q" defaultValue={query} placeholder={t('Search places, guides…')} aria-label={t('Search')} autoFocus />
            <button type="submit">{t('Search')}</button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {query && total === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>{t('No matches for')} “{query}”. {t('Try a different term, or')} <Link href="/eat-and-drinks">{t('browse places')}</Link>.</p>
          )}

          {venues.length > 0 && (
            <>
              <h2 style={{ marginBottom: 'var(--s2)' }}>{t('Places')} <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>({venues.length})</span></h2>
              <ul className="search-list">
                {venues.map((v) => (
                  <li key={v.slug}><Link href={`/venues/${v.slug}`}>
                    <b>{v.name}</b>
                    <span>{[tt(v.categories?.name_en || v.venue_type), v.neighborhood].filter(Boolean).join(' · ')}{v.rating != null && <> · <Star /> {v.rating.toFixed(1)}</>}</span>
                  </Link></li>
                ))}
              </ul>
            </>
          )}

          {posts.length > 0 && (
            <>
              <h2 style={{ margin: 'var(--s5) 0 var(--s2)' }}>{t('Guides')} <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>({posts.length})</span></h2>
              <ul className="search-list">
                {posts.map((p) => (
                  <li key={p.slug}><Link href={`/blog/${p.slug}`}>
                    <b>{p.title}</b>
                    {p.category && <span>{p.category}</span>}
                  </Link></li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
