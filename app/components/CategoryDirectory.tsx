'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Icon from '@/app/components/Icon'

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
}

const STEP = 18

export default function CategoryDirectory({ venues, primaries, areas, typeLabel, typeIcon, unit, unitSingular, total }: Props) {
  const [primary, setPrimary] = useState('all')
  const [areaSet, setAreaSet] = useState<Set<string>>(new Set())
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('editor')
  const [limit, setLimit] = useState(STEP)
  const [railOpen, setRailOpen] = useState(false)
  const [areaCollapsed, setAreaCollapsed] = useState(false)

  // Bridge the server-rendered hero search box into this component.
  useEffect(() => {
    const input = document.getElementById('eatSearch') as HTMLInputElement | null
    const form = input?.closest('form') || null
    if (!input) return
    const onInput = () => { setQ(input.value.trim().toLowerCase()); setLimit(STEP) }
    const onSubmit = (e: Event) => {
      e.preventDefault(); setQ(input.value.trim().toLowerCase()); setLimit(STEP)
      document.getElementById('eatDir')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    input.addEventListener('input', onInput)
    if (form) form.addEventListener('submit', onSubmit)
    return () => { input.removeEventListener('input', onInput); if (form) form.removeEventListener('submit', onSubmit) }
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
    setPrimary('all'); setAreaSet(new Set()); setQ(''); setSort('editor'); setLimit(STEP)
    const input = document.getElementById('eatSearch') as HTMLInputElement | null
    if (input) input.value = ''
  }
  const areaLabel = (slug: string) => areas.find((a) => a.slug === slug)?.label || slug
  const primaryLabel = (slug: string) => primaries.find((p) => p.slug === slug)?.label || slug

  return (
    <div className="eat-dir" id="eatDir" data-primary={primary}>
      <div className={`eat-rail-backdrop${railOpen ? ' on' : ''}`} aria-hidden="true" onClick={() => setRailOpen(false)}></div>

      {/* LEFT FILTER RAIL */}
      <aside className="eat-rail" aria-label="Filter the directory">
        <div className="eat-rail__inner">
          <div className="eat-rail__head">
            <h2><Icon name={typeIcon} size={20} className="ic" />Filters</h2>
            <button type="button" className="eat-rail__clear" onClick={clearAll}>Clear all</button>
            <button type="button" className="eat-rail__close" aria-label="Close filters" onClick={() => setRailOpen(false)}><Icon name="close" size={20} /></button>
          </div>

          {/* primary TYPE (single) */}
          <div className="fgroup">
            <p className="fgroup__t" aria-hidden="true">{typeLabel}</p>
            <div className="ftype" role="group" aria-label={`${typeLabel} (choose one)`}>
              <button type="button" aria-pressed={primary === 'all'} onClick={() => pickPrimary('all')}>
                <Icon name={typeIcon} size={16} className="ic" />All <span className="n">{total}</span>
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
                Area <Icon name="chevron-right" size={16} className="ic x" />
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
              <Icon name="filter" size={16} />Filters{activeCount > 0 && <span className="pill">{activeCount}</span>}
            </button>
            <span className="eat-toolbar__count" aria-live="polite"><b>{matched.length}</b> {matched.length === 1 ? unitSingular : unit}</span>
          </div>
          <div className="eat-sort">
            <label htmlFor="sortSel">Sort</label>
            <select id="sortSel" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="editor">Top rated</option>
              <option value="rating">Highest rated</option>
              <option value="reviews">Most reviewed</option>
              <option value="az">A–Z</option>
            </select>
          </div>
        </div>

        {activeCount > 0 && (
          <div className="eat-active">
            <span className="lbl">{activeCount} {activeCount === 1 ? 'filter' : 'filters'}</span>
            {primary !== 'all' && (
              <span className="achip">{primaryLabel(primary)}
                <button type="button" aria-label={`Remove ${primaryLabel(primary)}`} onClick={() => pickPrimary('all')}><Icon name="close" size={11} /></button>
              </span>
            )}
            {[...areaSet].map((slug) => (
              <span key={slug} className="achip">{areaLabel(slug)}
                <button type="button" aria-label={`Remove ${areaLabel(slug)}`} onClick={() => toggleArea(slug)}><Icon name="close" size={11} /></button>
              </span>
            ))}
          </div>
        )}

        <div className="eat-grid" id="eatGrid">
          {shown.map((v, i) => (
            <Link key={v.id} href={`/venues/${v.slug}`} className="eat-card">
              <div className="eat-card__media">
                {v.image_url
                  ? <img src={v.image_url} alt={v.name} width={900} height={600} loading={i < 6 ? 'eager' : 'lazy'} fetchPriority={i < 6 ? 'high' : undefined} />
                  : <div className="eat-card__ph" aria-hidden="true"><span>{v.name.charAt(0).toUpperCase()}</span></div>}
                <span className="eat-card__tag">{v.venue_type || 'Place'}</span>
              </div>
              <div className="eat-card__body">
                {v.venue_type && <div className="eat-card__cuisine">{v.venue_type}</div>}
                <h3>{v.name}</h3>
                {v.loc && <div className="eat-card__loc"><Icon name="pin" size={16} className="ic" />{v.loc}</div>}
                <div className="eat-card__foot">
                  <span className="eat-card__rate"><span className="star">★</span> {v.rating?.toFixed(1) ?? '—'} {v.review_count != null && <span className="count">({v.review_count.toLocaleString()})</span>}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {matched.length > shown.length && (
          <div className="load-more-wrap">
            <button type="button" className="load-more" onClick={() => setLimit((l) => l + STEP)}>
              Load more ({matched.length - shown.length})
            </button>
          </div>
        )}

        {matched.length === 0 && (
          <p className="eat-empty on" role="status">
            <Icon name="search" size={32} style={{ color: 'var(--text-faint)' }} /><br />
            No {unit} match. Try removing a filter.
          </p>
        )}
      </div>
    </div>
  )
}
