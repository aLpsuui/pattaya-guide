import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Icon from '@/app/components/Icon'
import CategoryDirectory, { VItem } from '@/app/components/CategoryDirectory'
import { SITE_URL } from '@/lib/site'

const ASSETS = 'https://cdn.gotopattaya.com/Assets'

interface Venue {
  id: string; slug: string | null; name: string; rating: number | null; review_count: number | null
  venue_type: string | null; price_range: string | null; address: string | null; neighborhood: string | null; image_url: string | null
}

export interface PrimaryGroup {
  slug: string          // family key used in data-cat + the type button
  label: string
  icon: string          // Icon name
  match: string[]        // lower-case keywords matched against venue_type
}

export interface CatConfig {
  slug: string          // DB category slug
  kicker: string
  h1: string
  em?: string           // emphasised word inside the h1 (rendered with <span>)
  lead: string
  heroImg: string       // asset filename or absolute URL
  heroImg2?: string
  badge?: string
  searchPlaceholder: string
  unit?: string         // "places" | "venues" | "activities"
  typeLabel?: string    // rail "Type" group heading (default "Type")
  typeIcon?: string     // Icon for the rail head + "All" button (default "filter")
  // Optional grouped primary types (e.g. Restaurants / Cafés / Bars). When
  // omitted, the rail is built from the raw venue_type values.
  primaryGroups?: PrimaryGroup[]
}

const img = (s: string) => (s.startsWith('http') ? s : `${ASSETS}/${s}`)
const slugify = (t: string | null) => (t || 'other').toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'other'

// Canonical Pattaya area buckets from a messy neighborhood string.
function areaOf(nb: string | null): { slug: string; label: string } | null {
  if (!nb) return null
  const t = nb.toLowerCase()
  const map: [string, string, string][] = [
    ['central', 'central', 'Central Pattaya'],
    ['naklua', 'naklua', 'Naklua'],
    ['north', 'north', 'North Pattaya'],
    ['jomtien', 'jomtien', 'Jomtien'],
    ['pratumnak', 'pratumnak', 'Pratumnak Hill'],
    ['phra tamnak', 'pratumnak', 'Pratumnak Hill'],
    ['wong amat', 'wongamat', 'Wong Amat'],
    ['walking', 'walkingstreet', 'Walking Street'],
    ['south', 'southpattaya', 'South Pattaya'],
    ['bang lamung', 'banglamung', 'Bang Lamung'],
    ['sattahip', 'sattahip', 'Sattahip'],
    ['chon buri', 'chonburi', 'Chon Buri'],
    ['chonburi', 'chonburi', 'Chon Buri'],
  ]
  for (const [kw, slug, label] of map) if (t.includes(kw)) return { slug, label }
  return { slug: slugify(nb), label: nb.trim() }
}

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
  const unitSingular = unit.endsWith('ies') ? unit.slice(0, -3) + 'y' : unit.replace(/s$/, '')
  const typeLabel = cfg.typeLabel || 'Type'
  const typeIcon = cfg.typeIcon || 'filter'

  // ---- primary TYPE rail (single select) -------------------------------
  const familyOf = (v: Venue): string => {
    if (cfg.primaryGroups) {
      const t = (v.venue_type || '').toLowerCase()
      for (const g of cfg.primaryGroups) if (g.match.some((m) => t.includes(m))) return g.slug
      return 'other'
    }
    return slugify(v.venue_type)
  }

  let primaries: { slug: string; label: string; icon?: string; n: number }[]
  if (cfg.primaryGroups) {
    primaries = cfg.primaryGroups
      .map((g) => ({ slug: g.slug, label: g.label, icon: g.icon, n: venues.filter((v) => familyOf(v) === g.slug).length }))
      .filter((p) => p.n > 0)
  } else {
    const counts = new Map<string, { label: string; n: number }>()
    for (const v of venues) {
      const k = slugify(v.venue_type)
      const e = counts.get(k) || { label: (v.venue_type || 'Other').trim(), n: 0 }
      e.n++; counts.set(k, e)
    }
    primaries = [...counts.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 10)
      .map(([slug, e]) => ({ slug, label: e.label, n: e.n }))
  }

  // ---- AREA facet (multi select) ---------------------------------------
  const areaCounts = new Map<string, { label: string; n: number }>()
  for (const v of venues) {
    const a = areaOf(v.neighborhood)
    if (!a) continue
    const e = areaCounts.get(a.slug) || { label: a.label, n: 0 }
    e.n++; areaCounts.set(a.slug, e)
  }
  const areas = [...areaCounts.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 12)
    .map(([slug, e]) => ({ slug, label: e.label, n: e.n }))

  const rated = venues.filter((v) => typeof v.rating === 'number')
  const avg = rated.length ? (rated.reduce((s, v) => s + (v.rating || 0), 0) / rated.length).toFixed(1) : '—'
  const top = primaries[0]
  const picks = venues.slice(0, 3)

  // Compact payload for the client directory (incremental render keeps the
  // initial DOM light while filtering stays instant).
  const items: VItem[] = venues.map((v, i) => ({
    id: v.id, slug: v.slug, name: v.name, rating: v.rating, review_count: v.review_count,
    venue_type: v.venue_type, loc: v.address || v.neighborhood || null, image_url: v.image_url,
    cat: familyOf(v), area: areaOf(v.neighborhood)?.slug || '', order: i,
  }))

  // ---- structured data: breadcrumb + listing ---------------------------
  const catName = cfg.kicker.split('·')[0].trim() || cfg.h1
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: catName, item: `${SITE_URL}/${cfg.slug}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: `${catName} in Pattaya`,
        numberOfItems: total,
        itemListElement: venues.slice(0, 25).map((v, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/venues/${v.slug}`,
          name: v.name,
        })),
      },
    ],
  }

  const Card = (v: Venue, i: number) => (
    <Link
      key={v.id}
      href={`/venues/${v.slug}`}
      className="eat-card"
      data-cat={familyOf(v)}
      data-area={areaOf(v.neighborhood)?.slug || ''}
      data-name={`${v.name} ${v.venue_type || ''} ${v.neighborhood || ''}`.toLowerCase()}
      data-rating={v.rating ?? 0}
      data-reviews={v.review_count ?? 0}
      data-order={i}
      data-sortname={v.name.toLowerCase()}
    >
      <div className="eat-card__media">
        {v.image_url && <img src={v.image_url} alt={v.name} loading={i < 6 ? 'eager' : 'lazy'} fetchPriority={i < 6 ? 'high' : undefined} />}
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
  )

  return (
    <div className="eat-page">
      <link rel="preload" as="image" href={img(cfg.heroImg)} fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
              {top && <div className="st" role="listitem"><b>{top.n}</b><span>{top.label}</span></div>}
              <div className="st" role="listitem"><b>{avg}★</b><span>Avg. rating</span></div>
              {areas.length > 0 && <div className="st" role="listitem"><b>{areas.length}</b><span>Areas</span></div>}
            </div>
          </div>

          <div className="eat-hero__art" aria-hidden="true">
            <div className="eat-hero__img main" style={{ backgroundImage: `url('${img(cfg.heroImg)}')` }}></div>
            {cfg.heroImg2 && <div className="eat-hero__img sub" style={{ backgroundImage: `url('${img(cfg.heroImg2)}')` }}></div>}
            <div className="eat-hero__badge"><Icon name="local-verified" size={20} className="ic" /><b>{cfg.badge || 'Locally verified · weekly'}</b></div>
          </div>
        </div>
      </section>

      {/* EDITOR'S PICKS */}
      {picks.length === 3 && (
        <section className="sec sec--alt" aria-labelledby="picks-h">
          <div className="container">
            <div className="eat-head">
              <div className="titles">
                <p className="kicker">Editor&apos;s picks</p>
                <h2 id="picks-h">The ones we keep <span>coming back</span> to</h2>
                <p>Top-rated and locally verified — a quick three before you dive into the full list.</p>
              </div>
              <a href="#dir-h" className="eat-viewall">Browse all {total} <Icon name="arrow-right" size={16} /></a>
            </div>
            <div className="eat-grid">{picks.map((v, i) => Card(v, i))}</div>
          </div>
        </section>
      )}

      {/* DIRECTORY — left rail + results */}
      <section className="sec" aria-labelledby="dir-h">
        <div className="container">
          <div className="eat-head">
            <div className="titles">
              <p className="kicker">The full list</p>
              <h2 id="dir-h">Every {unitSingular} <span>worth your time</span></h2>
              <p>Pick a {typeLabel.toLowerCase()}, stack areas, then sort. Search filters by name too.</p>
            </div>
          </div>

          {total === 0 ? (
            <p className="eat-empty on" role="status">
              <Icon name="search" size={32} style={{ color: 'var(--text-faint)' }} /><br />
              No {unit} published yet in this category.
            </p>
          ) : (
            <CategoryDirectory
              venues={items}
              primaries={primaries}
              areas={areas}
              typeLabel={typeLabel}
              typeIcon={typeIcon}
              unit={unit}
              unitSingular={unitSingular}
              total={total}
            />
          )}
        </div>
      </section>

      {/* HOW WE RANK — trust */}
      <section className="sec sec--alt sec--tight" aria-labelledby="rank-h">
        <div className="container">
          <div className="trust-grid">
            <div>
              <p className="kicker">How we rank</p>
              <h2 id="rank-h">No <span>pay-to-play</span>. Ever.</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 18, maxWidth: '52ch' }}>
                Venues can&apos;t buy a higher spot on this page. Our ordering blends real visit notes, fresh review trends and local reporting — then we re-check the list every week.
              </p>
              <ul className="trust-list">
                <li><Icon name="check" size={24} className="ic" /><span><b>We pay our own way.</b> Editors visit anonymously; no freebies influence a ranking.</span></li>
                <li><Icon name="check" size={24} className="ic" /><span><b>Reviews are weighted, not counted.</b> We discount suspicious spikes and reward consistency over time.</span></li>
                <li><Icon name="check" size={24} className="ic" /><span><b>Listings ≠ rankings.</b> A venue paying for a listing never moves up the order.</span></li>
              </ul>
            </div>
            <div className="trust-aside">
              <div className="alert alert--info">
                <Icon name="info" size={24} />
                <div><b>Spotted something off?</b><br />Hours change, places close, owners move on. If a detail here is stale, flag it from any venue page and a local editor will verify it.</div>
              </div>
              <div className="author">
                <span className="ava" aria-hidden="true">PG</span>
                <div className="who">
                  <b>The Go To Pattaya local desk</b>
                  <span className="role"><Icon name="local-verified" size={16} style={{ verticalAlign: '-3px' }} /> Locally verified</span>
                  <p>On-the-ground in Pattaya since 2019 — visiting, checking and double-checking so the list stays honest.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
