import type { CSSProperties } from 'react'
import { supabase } from '@/lib/supabase'
import Link from '@/app/components/LocaleLink'
import Icon from '@/app/components/Icon'
import Star from '@/app/components/Star'
import CategoryDirectory, { VItem } from '@/app/components/CategoryDirectory'
import { SITE_URL } from '@/lib/site'
import { hasLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { translateMany } from '@/lib/i18n/translateContent'
import { groupsForCategory, groupKeyForType } from '@/lib/venueGroups'

// A dedicated subcategory view (e.g. /eat-and-drinks/cafes): filters the listing
// to one venueGroups bucket and swaps the hero copy for that subcategory.
export interface SubView { key: string; label: string; h1: string; em?: string; lead: string }

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
  path?: string         // public route when it differs from /<slug> (e.g. thinks-to-do → /things-to-do)
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

// Pill style for the subcategory switcher chips (self-contained, no new CSS).
const chipStyle = (on: boolean): CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999,
  fontSize: 14, fontWeight: 600, textDecoration: 'none', lineHeight: 1,
  border: '1.5px solid ' + (on ? 'transparent' : 'var(--border-color, #dbe3ea)'),
  background: on ? 'var(--brand, #034487)' : 'var(--surface, #fff)',
  color: on ? '#fff' : 'var(--text-muted, #46586b)',
})
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

export default async function CategoryListing({ cfg, lang, sub }: { cfg: CatConfig; lang: string; sub?: SubView }) {
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  const basePath = cfg.path || `/${cfg.slug}`
  const vgroups = groupsForCategory(cfg.slug)
  const { data } = await supabase
    .from('venues')
    .select('id, slug, name, rating, review_count, venue_type, price_range, address, neighborhood, image_url, categories!inner(slug)')
    .eq('is_active', true)
    .eq('categories.slug', cfg.slug)
    .order('rating', { ascending: false, nullsFirst: false })
    .order('review_count', { ascending: false, nullsFirst: false })
  const allVenues = (data || []) as unknown as Venue[]
  // Lead with photographed venues (stable - keeps the rating order within each
  // group) so the grid + editor's picks look image-rich; photo-less ones fall
  // to the end rather than being hidden.
  allVenues.sort((a, b) => (a.image_url ? 0 : 1) - (b.image_url ? 0 : 1))
  // On a subcategory page, narrow the listing to that one group.
  const venues = sub ? allVenues.filter((v) => groupKeyForType(cfg.slug, v.venue_type) === sub.key) : allVenues
  // Sibling subcategory links (computed over the FULL category, not the filtered set).
  const siblings = sub
    ? vgroups
        .map((g) => ({ key: g.key, label: t(g.label), href: `${basePath}/${g.key}`, n: allVenues.filter((v) => groupKeyForType(cfg.slug, v.venue_type) === g.key).length }))
        .filter((s) => s.n > 0)
    : []
  // Translate venue_type labels (shared/deduped); venue NAMES stay Latin. Used
  // for the card tags/cuisine and the raw-type filter labels below.
  const typeMap = await translateMany('venue_types', 'label', venues.map((v) => v.venue_type), locale)
  const tt = (s: string | null) => (s ? (typeMap.get(s) ?? s) : s)
  const total = venues.length
  const unit = cfg.unit || 'places'
  const unitSingular = unit.endsWith('ies') ? unit.slice(0, -3) + 'y' : unit.replace(/s$/, '')
  const typeLabel = cfg.typeLabel || 'Type'
  const typeIcon = cfg.typeIcon || 'filter'
  // Translated hero/copy strings (English source stays in cfg for SEO/JSON-LD).
  // On a subcategory page the hero swaps to that subcategory's copy.
  const h1 = t(sub ? sub.h1 : cfg.h1)
  const emSrc = sub ? sub.em : cfg.em
  const em = emSrc ? t(emSrc) : undefined
  const lead = t(sub ? sub.lead : cfg.lead)
  const searchPlaceholder = t(cfg.searchPlaceholder)
  const badge = t(cfg.badge || 'Locally verified · weekly')

  // ---- primary TYPE rail (single select) -------------------------------
  // The clean groups come from lib/venueGroups (shared with the nav menu) so a
  // submenu item and its filter button here are always the same bucket. Falls
  // back to a page-local primaryGroups config, then to raw venue_type.
  const familyOf = (v: Venue): string => {
    if (vgroups.length) return groupKeyForType(cfg.slug, v.venue_type) || 'other'
    if (cfg.primaryGroups) {
      const t = (v.venue_type || '').toLowerCase()
      for (const g of cfg.primaryGroups) if (g.match.some((m) => t.includes(m))) return g.slug
      return 'other'
    }
    return slugify(v.venue_type)
  }

  let primaries: { slug: string; label: string; icon?: string; n: number }[]
  if (vgroups.length) {
    primaries = vgroups
      .map((g) => ({ slug: g.key, label: t(g.label), icon: g.icon, n: venues.filter((v) => familyOf(v) === g.key).length }))
      .filter((p) => p.n > 0)
  } else if (cfg.primaryGroups) {
    primaries = cfg.primaryGroups
      .map((g) => ({ slug: g.slug, label: t(g.label), icon: g.icon, n: venues.filter((v) => familyOf(v) === g.slug).length }))
      .filter((p) => p.n > 0)
  } else {
    const counts = new Map<string, { label: string; n: number }>()
    for (const v of venues) {
      const k = slugify(v.venue_type)
      const e = counts.get(k) || { label: (v.venue_type || 'Other').trim(), n: 0 }
      e.n++; counts.set(k, e)
    }
    primaries = [...counts.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 10)
      .map(([slug, e]) => ({ slug, label: tt(e.label) as string, n: e.n }))
  }
  // On a subcategory page the type is fixed - hide the type facet entirely.
  if (sub) primaries = []

  // ---- AREA facet (multi select) ---------------------------------------
  const areaCounts = new Map<string, { label: string; n: number }>()
  for (const v of venues) {
    const a = areaOf(v.neighborhood)
    if (!a) continue
    const e = areaCounts.get(a.slug) || { label: a.label, n: 0 }
    e.n++; areaCounts.set(a.slug, e)
  }
  const areas = [...areaCounts.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 12)
    .map(([slug, e]) => ({ slug, label: t(e.label), n: e.n }))

  const rated = venues.filter((v) => typeof v.rating === 'number')
  const avg = rated.length ? (rated.reduce((s, v) => s + (v.rating || 0), 0) / rated.length).toFixed(1) : '-'
  const top = primaries[0]

  // Compact payload for the client directory (incremental render keeps the
  // initial DOM light while filtering stays instant).
  const items: VItem[] = venues.map((v, i) => ({
    id: v.id, slug: v.slug, name: v.name, rating: v.rating, review_count: v.review_count,
    venue_type: tt(v.venue_type), loc: v.address || v.neighborhood || null, image_url: v.image_url,
    cat: familyOf(v), area: areaOf(v.neighborhood)?.slug || '', order: i,
  }))

  // ---- structured data: breadcrumb + listing ---------------------------
  const catName = cfg.kicker.split('·')[0].trim() || cfg.h1
  const crumbs: object[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${locale}` },
    { '@type': 'ListItem', position: 2, name: catName, item: `${SITE_URL}/${locale}${basePath}` },
  ]
  if (sub) crumbs.push({ '@type': 'ListItem', position: 3, name: sub.label, item: `${SITE_URL}/${locale}${basePath}/${sub.key}` })
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: crumbs },
      {
        '@type': 'ItemList',
        name: `${sub ? sub.label : catName} in Pattaya`,
        numberOfItems: total,
        itemListElement: venues.slice(0, 25).map((v, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/${locale}/venues/${v.slug}`,
          name: v.name,
        })),
      },
    ],
  }

  return (
    <div className="eat-page">
      <link rel="preload" as="image" href={img(cfg.heroImg)} fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* HERO */}
      <section className="eat-hero">
        <div className="container eat-hero__inner">
          <div className="eat-hero__copy">
            <h1>{em ? <>{h1.split(em)[0]}<span>{em}</span>{h1.split(em)[1]}</> : h1}</h1>
            <p className="eat-hero__lead">{lead}</p>

            {sub && siblings.length > 0 && (
              <nav aria-label="Subcategories" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
                <Link href={basePath} style={chipStyle(false)}>{t('All')}</Link>
                {siblings.map((s) => (
                  <Link key={s.key} href={s.href} aria-current={s.key === sub?.key ? 'page' : undefined} style={chipStyle(s.key === sub?.key)}>
                    {s.label} <span style={{ opacity: 0.6, fontWeight: 500 }}>{s.n}</span>
                  </Link>
                ))}
              </nav>
            )}

            <div className="search" role="search">
              <Icon name="search" size={20} style={{ color: 'var(--text-faint)' }} />
              <input type="search" id="eatSearch" placeholder={searchPlaceholder} aria-label={searchPlaceholder} autoComplete="off" />
              <button type="button" className="go" aria-label={t('Search')}><Icon name="arrow-right" size={20} /></button>
            </div>

            <div className="eat-hero__stats" role="list" aria-label="Section overview">
              <div className="st" role="listitem"><b>{total || '-'}</b><span>{t('Verified')} {t(unit)}</span></div>
              {top && <div className="st" role="listitem"><b>{top.n}</b><span>{top.label}</span></div>}
              <div className="st" role="listitem"><b>{avg}<Star /></b><span>{t('Avg. rating')}</span></div>
              {areas.length > 0 && <div className="st" role="listitem"><b>{areas.length}</b><span>{t('Areas')}</span></div>}
            </div>
          </div>

          <div className="eat-hero__art" aria-hidden="true">
            <div className="eat-hero__img main" style={{ backgroundImage: `url('${img(cfg.heroImg)}')` }}></div>
            {cfg.heroImg2 && <div className="eat-hero__img sub" style={{ backgroundImage: `url('${img(cfg.heroImg2)}')` }}></div>}
            <div className="eat-hero__badge"><Icon name="local-verified" size={20} className="ic" /><b>{badge}</b></div>
          </div>
        </div>
      </section>

      {/* DIRECTORY - left rail + results */}
      <section className="sec" aria-labelledby="dir-h">
        <div className="container">
          <div className="eat-head">
            <div className="titles">
              <p className="kicker">{t('The full list')}</p>
              <h2 id="dir-h">{t('Every')} {t(unitSingular)} <span>{t('worth your time')}</span></h2>
              <p>{t('Pick a')} {t(typeLabel).toLowerCase()}, {t('stack areas, then sort. Search filters by name too.')}</p>
            </div>
          </div>

          {total === 0 ? (
            <p className="eat-empty on" role="status">
              <Icon name="search" size={32} style={{ color: 'var(--text-faint)' }} /><br />
              {t(`No ${unit} published yet in this category.`)}
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
              dict={dict}
              hideTypeRail={!!sub}
            />
          )}
        </div>
      </section>

      {/* HOW WE RANK - trust */}
      <section className="sec sec--alt sec--tight" aria-labelledby="rank-h">
        <div className="container">
          <div className="trust-grid">
            <div>
              <p className="kicker">{t('How we rank')}</p>
              <h2 id="rank-h">{t('No')} <span>{t('pay-to-play')}</span>. {t('Ever.')}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 18, maxWidth: '52ch' }}>
                {t("Venues can't buy a higher spot on this page. Our ordering blends real visit notes, fresh review trends and local reporting - then we re-check the list every week.")}
              </p>
              <ul className="trust-list">
                <li><Icon name="check" size={24} className="ic" /><span><b>{t('We pay our own way.')}</b> {t('Editors visit anonymously; no freebies influence a ranking.')}</span></li>
                <li><Icon name="check" size={24} className="ic" /><span><b>{t('Reviews are weighted, not counted.')}</b> {t('We discount suspicious spikes and reward consistency over time.')}</span></li>
                <li><Icon name="check" size={24} className="ic" /><span><b>{t('Listings ≠ rankings.')}</b> {t('A venue paying for a listing never moves up the order.')}</span></li>
              </ul>
            </div>
            <div className="trust-aside">
              <div className="alert alert--info">
                <Icon name="info" size={24} />
                <div><b>{t('Spotted something off?')}</b><br />{t('Hours change, places close, owners move on. If a detail here is stale, flag it from any venue page and a local editor will verify it.')}</div>
              </div>
              <div className="author">
                <span className="ava" aria-hidden="true">PG</span>
                <div className="who">
                  <b>{t('The Go To Pattaya local desk')}</b>
                  <span className="role"><Icon name="local-verified" size={16} style={{ verticalAlign: '-3px' }} /> {t('Locally verified')}</span>
                  <p>{t('On-the-ground in Pattaya since 2019 - visiting, checking and double-checking so the list stays honest.')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL DIRECTORY - every venue as a crawlable server-rendered link, so
          search engines discover all listings (the interactive grid above only
          mounts the first page client-side; without this block ~85% of venue
          pages have zero incoming internal links and go orphan). Collapsed by
          default to keep the visual design unchanged. */}
      {total > 0 && (
        <section className="sec sec--tight" aria-labelledby="idx-h">
          <div className="container">
            <details className="cat-index-wrap">
              <summary id="idx-h" style={{ cursor: 'pointer', fontWeight: 600 }}>
                {t('Browse all')} {total} {t(unit)} {t('in Pattaya (A–Z)')}
              </summary>
              <ul className="cat-index">
                {venues.filter((v) => v.slug).map((v) => (
                  <li key={v.id}><a href={`/${locale}/venues/${v.slug}`}>{v.name}</a></li>
                ))}
              </ul>
            </details>
          </div>
        </section>
      )}
    </div>
  )
}
