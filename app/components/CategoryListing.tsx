import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Icon from '@/app/components/Icon'
import EatFilters from '@/app/eat-and-drinks/EatFilters'

const ASSETS = 'https://cdn.gotopattaya.com/Assets'

interface Venue {
  id: string; slug: string | null; name: string; rating: number | null; review_count: number | null
  venue_type: string | null; price_range: string | null; address: string | null; neighborhood: string | null; image_url: string | null
}

export interface CatConfig {
  slug: string          // DB category slug
  kicker: string
  h1: string            // may contain a single <em>…</em> emphasis via {em}
  em?: string           // emphasised word inside the h1 (rendered with <span>)
  lead: string
  heroImg: string       // asset filename or absolute URL
  heroImg2?: string
  badge?: string
  searchPlaceholder: string
  unit?: string         // "places" | "venues" | "activities"
}

const img = (s: string) => (s.startsWith('http') ? s : `${ASSETS}/${s}`)
const typeSlug = (t: string | null) => (t || 'other').toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'other'

export default async function CategoryListing({ cfg }: { cfg: CatConfig }) {
  const { data } = await supabase
    .from('venues')
    .select('id, slug, name, rating, review_count, venue_type, price_range, address, neighborhood, image_url, categories!inner(slug)')
    .eq('is_active', true)
    .eq('categories.slug', cfg.slug)
    .order('rating', { ascending: false, nullsFirst: false })
    .order('review_count', { ascending: false, nullsFirst: false })
  const venues = (data || []) as unknown as Venue[]
  const total = venues.length
  const unit = cfg.unit || 'places'

  // Auto filter chips from the most common venue_types.
  const counts = new Map<string, { label: string; n: number }>()
  for (const v of venues) {
    const key = typeSlug(v.venue_type)
    const label = (v.venue_type || 'Other').trim()
    const e = counts.get(key) || { label, n: 0 }
    e.n++; counts.set(key, e)
  }
  const chips = [...counts.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 7)

  const rated = venues.filter((v) => typeof v.rating === 'number')
  const avg = rated.length ? (rated.reduce((s, v) => s + (v.rating || 0), 0) / rated.length).toFixed(1) : '—'
  const topType = chips[0]?.[1]

  return (
    <div className="eat-page">
      {/* HERO */}
      <section className="eat-hero">
        <div className="container eat-hero__inner">
          <div className="eat-hero__copy">
            <div className="eat-hero__meta">
              <span><b>{total || '—'}</b> {unit}</span><span className="dot" aria-hidden="true"></span>
              <span>Updated <b>weekly</b></span><span className="dot" aria-hidden="true"></span>
              <span>Locally verified</span>
            </div>
            <p className="kicker">{cfg.kicker}</p>
            <h1>{cfg.em ? <>{cfg.h1.split(cfg.em)[0]}<span>{cfg.em}</span>{cfg.h1.split(cfg.em)[1]}</> : cfg.h1}</h1>
            <p className="eat-hero__lead">{cfg.lead}</p>

            <form className="search" role="search">
              <Icon name="search" size={20} style={{ color: 'var(--text-faint)' }} />
              <input type="search" id="eatSearch" placeholder={cfg.searchPlaceholder} aria-label={cfg.searchPlaceholder} autoComplete="off" />
              <button type="submit" className="go" aria-label="Search"><Icon name="arrow-right" size={20} /></button>
            </form>

            <div className="eat-hero__stats" role="list" aria-label="Section overview">
              <div className="st" role="listitem"><b>{total || '—'}</b><span>Verified {unit}</span></div>
              {topType && <div className="st" role="listitem"><b>{topType.n}</b><span>{topType.label}</span></div>}
              <div className="st" role="listitem"><b>{avg}★</b><span>Avg. rating</span></div>
              <div className="st" role="listitem"><b>{chips.length}</b><span>Categories</span></div>
            </div>
          </div>

          <div className="eat-hero__art" aria-hidden="true">
            <div className="eat-hero__img main" style={{ backgroundImage: `url('${img(cfg.heroImg)}')` }}></div>
            {cfg.heroImg2 && <div className="eat-hero__img sub" style={{ backgroundImage: `url('${img(cfg.heroImg2)}')` }}></div>}
            <div className="eat-hero__badge"><Icon name="local-verified" size={20} className="ic" /><b>{cfg.badge || 'Locally verified · weekly'}</b></div>
          </div>
        </div>
      </section>

      {/* FILTER CHIPS */}
      <nav className="eat-subnav" aria-label="Filter by type">
        <div className="container">
          <div className="filterbar" id="catFilter" role="group" aria-label="Type filters">
            <button className="chip" data-filter="all" aria-pressed="true"><Icon name="filter" size={16} /> All</button>
            {chips.map(([key, e]) => (
              <button key={key} className="chip" data-filter={key} aria-pressed="false">{e.label} <span className="count">({e.n})</span></button>
            ))}
          </div>
        </div>
      </nav>

      {/* GRID */}
      <section className="sec" aria-labelledby="all-h">
        <div className="container">
          <div className="eat-head">
            <div className="titles">
              <p className="kicker">The full list</p>
              <h2 id="all-h">Every {unit.replace(/s$/, '')} <span>worth your time</span></h2>
              <p>Filter by type above, or search — the list updates instantly.</p>
            </div>
            <span className="pill pill--navy" id="resultCount" aria-live="polite">{total} {unit}</span>
          </div>

          <div className="eat-grid" id="eatGrid" data-unit={unit}>
            {venues.map((v, i) => (
              <Link key={v.id} href={`/venues/${v.slug}`} className="eat-card" data-cat={typeSlug(v.venue_type)} data-name={`${v.name} ${v.venue_type || ''} ${v.neighborhood || ''}`.toLowerCase()}>
                <div className="eat-card__media">
                  {v.image_url && <img src={v.image_url} alt={v.name} loading={i < 8 ? 'eager' : 'lazy'} fetchPriority={i < 8 ? 'high' : undefined} />}
                  <span className="eat-card__tag">{v.venue_type || 'Place'}</span>
                </div>
                <div className="eat-card__body">
                  {v.venue_type && <div className="eat-card__cuisine">{v.venue_type}</div>}
                  <h3>{v.name}</h3>
                  {(v.address || v.neighborhood) && <div className="eat-card__loc"><Icon name="pin" size={16} className="ic" />{v.address || v.neighborhood}</div>}
                  <div className="eat-card__foot">
                    <span className="eat-card__rate"><span className="star">★</span> {v.rating?.toFixed(1) ?? '—'} {v.review_count != null && <span className="count">({v.review_count.toLocaleString()})</span>}</span>
                    <span className="eat-card__price">{v.price_range || ''}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {total > 18 && (
            <div className="load-more-wrap">
              <button id="loadMore" type="button" className="load-more">Load more</button>
            </div>
          )}

          <p className={`eat-empty${total === 0 ? ' on' : ''}`} id="eatEmpty" role="status">
            <Icon name="search" size={32} style={{ color: 'var(--text-faint)' }} /><br />
            {total === 0 ? `No ${unit} published yet in this category.` : `No ${unit} match. Try another filter.`}
          </p>
        </div>
      </section>

      <EatFilters />
    </div>
  )
}
