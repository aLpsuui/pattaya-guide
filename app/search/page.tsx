import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const query = q.trim().slice(0, 80)
  const { venues, posts } = query ? await runSearch(query) : { venues: [], posts: [] }
  const total = venues.length + posts.length

  return (
    <main id="main">
      <section className="page-hero">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span className="cur">Search</span>
          </nav>
          <h1>{query ? `Results for “${query}”` : 'Search Go To Pattaya'}</h1>
          <p className="lead">
            {query ? `${total} result${total === 1 ? '' : 's'} across places and guides.` : 'Find verified places, guides and areas across Pattaya.'}
          </p>
          <form action="/search" role="search" className="search-form">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input type="search" name="q" defaultValue={query} placeholder="Search places, guides…" aria-label="Search" autoFocus />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {query && total === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No matches for “{query}”. Try a different term, or <Link href="/eat-and-drinks">browse places</Link>.</p>
          )}

          {venues.length > 0 && (
            <>
              <h2 style={{ marginBottom: 'var(--s2)' }}>Places <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>({venues.length})</span></h2>
              <ul className="search-list">
                {venues.map((v) => (
                  <li key={v.slug}><Link href={`/venues/${v.slug}`}>
                    <b>{v.name}</b>
                    <span>{[v.categories?.name_en || v.venue_type, v.neighborhood].filter(Boolean).join(' · ')}{v.rating != null ? ` · ★ ${v.rating.toFixed(1)}` : ''}</span>
                  </Link></li>
                ))}
              </ul>
            </>
          )}

          {posts.length > 0 && (
            <>
              <h2 style={{ margin: 'var(--s5) 0 var(--s2)' }}>Guides <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>({posts.length})</span></h2>
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
