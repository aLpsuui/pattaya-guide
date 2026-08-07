'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from '@/app/components/LocaleLink'
import Icon from '@/app/components/Icon'
import Star from '@/app/components/Star'

// NOTE: the CDN only has -500 derivatives for ~40% of venue images, so the old
// blind `-500` swap 404'd most category thumbnails. Serve the original until real
// derivatives exist for every image (see lib/img.ts cardImg for the shared no-op
// and the planned Supabase-served optimization).
const cardImg = (u: string | null): string | undefined => u || undefined

// Client directory: receives a compact venue array and renders the filter rail
// + results grid entirely in React. Only the first `limit` filtered cards are
// mounted (incremental "Load more"), so the initial DOM stays light while the
// left-rail filtering / sort stay instant (all data is in memory).

export interface VItem {
  id: string; slug: string | null; name: string
  rating: number | null; review_count: number | null
  venue_type: string | null; loc: string | null; image_url: string | null
  cat: string; area: string; order: number
}
interface Facet { slug: string; label: string; icon?: string; n: number }

interface Props {
  venues: VItem[]
  primaries: Facet[]
  areas: Facet[]
  typeLabel: string
  typeIcon: string
  unit: string
  unitSingular: string
  total: number
  dict?: Record<string, string>
}

const STEP = 18

export default function CategoryDirectory({ venues, primaries, areas, typeLabel, typeIcon, unit, unitSingular, total, dict }: Props) {
  const t = (s: string) => dict?.[s] ?? s
  const [primary, setPrimary] = useState('all')
  const [areaSet, setAreaSet] = useState<Set<string>>(new Set())
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('reviews')
  const [limit, setLimit] = useState(STEP)
  const [railOpen, setRailOpen] = useState(false)
  const [areaCollapsed, setAreaCollapsed] = useState(false)

  // Bridge the server-rendered hero search box into this component.
  useEffect(() => {
    const input = document.getElementById('eatSearch') as HTMLInputElement | null
    if (!input) return
    const scrollToResults = () => document.getElementById('eatDir')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // The hero search box sits far above the directory, so a query filtered the
    // results off-screen at the bottom - it looked like nothing happened. Bring
    // the results into view the moment a search starts (once per query, so we
    // don't fight the user while they refine or read).
    let searchScrolled = false
    const onInput = () => {
      const val = input.value.trim().toLowerCase()
      setQ(val); setLimit(STEP)
      if (val && !searchScrolled) { searchScrolled = true; scrollToResults() }
      else if (!val) searchScrolled = false
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); scrollToResults() } }
    const goBtn = input.closest('.search')?.querySelector('.go') as HTMLElement | null
    const onGo = (e: Event) => { e.preventDefault(); scrollToResults() }
    input.addEventListener('input', onInput)
    input.addEventListener('keydown', onKey)
    goBtn?.addEventListener('click', onGo)
    return () => {
      input.removeEventListener('input', onInput)
      input.removeEventListener('keydown', onKey)
      goBtn?.removeEventListener('click', onGo)
    }
  }, [])

  // Toggle the mobile drawer body class.
  useEffect(() => {
    document.body.classList.toggle('rail-open', railOpen)
    return () => document.body.classList.remove('rail-open')
  }, [railOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setRailOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const matched = useMemo(() => {
    let list = venues
    if (primary !== 'all') list = list.filter((v) => v.cat === primary)
    if (areaSet.size) list = list.filter((v) => areaSet.has(v.area))
    if (q) list = list.filter((v) => `${v.name} ${v.venue_type || ''} ${v.loc || ''}`.toLowerCase().includes(q))
    const sorted = list.slice().sort((a, b) => {
      if (sort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0)
      if (sort === 'reviews') return (b.review_count ?? 0) - (a.review_count ?? 0)
      if (sort === 'az') return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      return a.order - b.order
    })
    return sorted
  }, [venues, primary, areaSet, q, sort])

  const shown = matched.slice(0, limit)
  const activeCount = (primary !== 'all' ? 1 : 0) + areaSet.size

  const toggleArea = (slug: string) => {
    setAreaSet((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug); else next.add(slug)
      return next
    })
    setLimit(STEP)
  }
  const pickPrimary = (slug: string) => { setPrimary(slug); setLimit(STEP) }
  const clearAll = () => {
    setPrimary('all'); setAreaSet(new Set()); setQ(''); setSort('reviews'); setLimit(STEP)
    const input = document.getElementById('eatSearch') as HTMLInputElement | null
    if (input) input.value = ''
  }
  const areaLabel = (slug: string) => areas.find((a) => a.slug === slug)?.label || slug
  const primaryLabel = (slug: string) => primaries.find((p) => p.slug === slug)?.label || slug

  return (
    <div className="eat-dir" id="eatDir" data-primary={primary}>
      <div className={`eat-rail-backdrop${railOpen ? ' on' : ''}`} aria-hidden="true" onClick={() => setRailOpen(false)}></div>

      {/* LEFT FILTER RAIL */}
      <aside className="eat-rail" aria-label={t('Filter the directory')}>
        <div className="eat-rail__inner">
          <div className="eat-rail__head">
            <h2><Icon name={typeIcon} size={20} className="ic" />{t('Filters')}</h2>
            <button type="button" className="eat-rail__clear" onClick={clearAll}>{t('Clear all')}</button>
            <button type="button" className="eat-rail__close" aria-label={t('Close filters')} onClick={() => setRailOpen(false)}><Icon name="close" size={20} /></button>
          </div>

          {/* primary TYPE (single) */}
          <div className="fgroup">
            <p className="fgroup__t" aria-hidden="true">{t(typeLabel)}</p>
            <div className="ftype" role="group" aria-label={`${t(typeLabel)} ${t('(choose one)')}`}>
              <button type="button" aria-pressed={primary === 'all'} onClick={() => pickPrimary('all')}>
                <Icon name={typeIcon} size={16} className="ic" />{t('All')} <span className="n">{total}</span>
              </button>
              {primaries.map((p) => (
                <button key={p.slug} type="button" aria-pressed={primary === p.slug} onClick={() => pickPrimary(p.slug)}>
                  {p.icon && <Icon name={p.icon} size={16} className="ic" />}{p.label} <span className="n">{p.n}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AREA (multi) */}
          {areas.length > 1 && (
            <div className={`fgroup${areaCollapsed ? ' collapsed' : ''}`}>
              <button type="button" className="fgroup__t" aria-expanded={!areaCollapsed} onClick={() => setAreaCollapsed((c) => !c)}>
                {t('Area')} <Icon name="chevron-right" size={16} className="ic x" />
              </button>
              <div className="fgroup__body">
                <div className="fopts">
                  {areas.map((a) => (
                    <label key={a.slug} className="fopt">
                      <input type="checkbox" checked={areaSet.has(a.slug)} onChange={() => toggleArea(a.slug)} />
                      <span className="box"><Icon name="check" size={12} className="ic" /></span>
                      <span className="lbl">{a.label}</span><span className="n">{a.n}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT RESULTS */}
      <div className="eat-results">
        <div className="eat-toolbar">
          <div className="eat-toolbar__left">
            <button type="button" className="eat-filter-toggle" onClick={() => setRailOpen(true)}>
              <Icon name="filter" size={16} />{t('Filters')}{activeCount > 0 && <span className="pill">{activeCount}</span>}
            </button>
            <span className="eat-toolbar__count" aria-live="polite"><b>{matched.length}</b> {t(matched.length === 1 ? unitSingular : unit)}</span>
          </div>
          <div className="eat-sort">
            <label htmlFor="sortSel">{t('Sort')}</label>
            <select id="sortSel" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="reviews">{t('Most reviewed')}</option>
              <option value="rating">{t('Highest rated')}</option>
              <option value="editor">{t('Featured')}</option>
              <option value="az">{t('A–Z')}</option>
            </select>
          </div>
        </div>

        {(activeCount > 0 || q) && (
          <div className="eat-active">
            <span className="lbl">{activeCount + (q ? 1 : 0)} {t(activeCount + (q ? 1 : 0) === 1 ? 'filter' : 'filters')}</span>
            {q && (
              <span className="achip">“{q}”
                <button type="button" aria-label={t('Clear search')} onClick={() => { setQ(''); setLimit(STEP); const el = document.getElementById('eatSearch') as HTMLInputElement | null; if (el) el.value = '' }}><Icon name="close" size={11} /></button>
              </span>
            )}
            {primary !== 'all' && (
              <span className="achip">{primaryLabel(primary)}
                <button type="button" aria-label={`${t('Remove')} ${primaryLabel(primary)}`} onClick={() => pickPrimary('all')}><Icon name="close" size={11} /></button>
              </span>
            )}
            {[...areaSet].map((slug) => (
              <span key={slug} className="achip">{areaLabel(slug)}
                <button type="button" aria-label={`${t('Remove')} ${areaLabel(slug)}`} onClick={() => toggleArea(slug)}><Icon name="close" size={11} /></button>
              </span>
            ))}
          </div>
        )}

        <div className="eat-grid" id="eatGrid">
          {shown.map((v, i) => (
            <Link key={v.id} href={`/venues/${v.slug}`} className="eat-card">
              <div className="eat-card__media">
                {v.image_url
                  ? <img src={cardImg(v.image_url)} alt={v.name} width={900} height={600} loading={i < 6 ? 'eager' : 'lazy'} fetchPriority={i < 6 ? 'high' : undefined} />
                  : <div className="eat-card__ph" aria-hidden="true"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="m4 17 4.5-4.5 3.5 3.5 3.5-3.5L20 16" /></svg></div>}
                <span className="eat-card__tag">{v.venue_type || t('Place')}</span>
              </div>
              <div className="eat-card__body">
                {v.venue_type && <div className="eat-card__cuisine">{v.venue_type}</div>}
                <h3>{v.name}</h3>
                {v.loc && <div className="eat-card__loc"><Icon name="pin" size={16} className="ic" />{v.loc}</div>}
                <div className="eat-card__foot">
                  <span className="eat-card__rate"><Star /> {v.rating?.toFixed(1) ?? '-'} {v.review_count != null && <span className="count">({v.review_count.toLocaleString()})</span>}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {matched.length > shown.length && (
          <div className="load-more-wrap">
            <button type="button" className="load-more" onClick={() => setLimit((l) => l + STEP)}>
              {t('Load more')} ({matched.length - shown.length})
            </button>
          </div>
        )}

        {matched.length === 0 && (
          <p className="eat-empty on" role="status">
            <Icon name="search" size={32} style={{ color: 'var(--text-faint)' }} /><br />
            {t(`No ${unit} match. Try removing a filter.`)}
          </p>
        )}
      </div>
    </div>
  )
}
