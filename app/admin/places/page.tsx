import Link from 'next/link'
import { db } from '@/lib/admin/db'
import Shell from '@/app/admin/_components/Shell'
import RowDelete from '@/app/admin/_components/RowDelete'
import { deletePlace } from '@/app/admin/_actions/places'
import { statusPill } from '@/lib/admin/options'
import { venueChecks, scoreOf } from '@/lib/admin/seo'
import { IconChevR, IconPlus, IconPin, IconStar, IconEdit, IconEye, IconSearch } from '@/app/admin/_components/icons'
import PlacesFilter from './PlacesFilter'

export const dynamic = 'force-dynamic'

type Row = {
  id: string; name: string; slug: string; neighborhood: string | null; rating: number | null
  review_count: number | null; image_url: string | null; status: string | null; is_active: boolean | null
  seo_title: string | null; description: string | null; focus_keyword: string | null; categories: { name_en: string } | null
}

const PER_PAGE = 100

// Windowed page list with ellipses (e.g. 1 … 3 4 5 … 12).
function pageList(cur: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const want = new Set([1, 2, total - 1, total, cur - 1, cur, cur + 1])
  const arr = [...want].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out: (number | '…')[] = []
  let prev = 0
  for (const p of arr) { if (p - prev > 1) out.push('…'); out.push(p); prev = p }
  return out
}

function Pager({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null
  const href = (p: number) => `/admin/places?page=${p}`
  const Prev = page > 1
    ? <Link className="pg-btn" href={href(page - 1)} aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg></Link>
    : <button className="pg-btn" disabled aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg></button>
  const Next = page < totalPages
    ? <Link className="pg-btn" href={href(page + 1)} aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg></Link>
    : <button className="pg-btn" disabled aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg></button>
  return (
    <nav className="pager" aria-label="Pagination">
      {Prev}
      {pageList(page, totalPages).map((p, i) => p === '…'
        ? <span key={'e' + i} className="pg-ell">…</span>
        : <Link key={p} className={`pg-btn${p === page ? ' on' : ''}`} href={href(p)}>{p}</Link>)}
      {Next}
    </nav>
  )
}

export default async function PlacesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams
  const cols = 'id,name,slug,neighborhood,rating,review_count,image_url,status,is_active,seo_title,description,focus_keyword,categories(name_en)'
  // First fetch the total to compute pages, then clamp + fetch the page slice.
  const { count } = await db.from('venues').select('id', { count: 'exact', head: true })
  const total = count || 0
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const page = Math.min(Math.max(1, parseInt(sp.page || '1', 10) || 1), totalPages)
  const from = (page - 1) * PER_PAGE
  const { data } = await db.from('venues').select(cols).order('name', { ascending: true }).range(from, from + PER_PAGE - 1)
  const rows = (data || []) as unknown as Row[]
  const { data: catRows } = await db.from('categories').select('name_en').order('name_en', { ascending: true })
  const catNames = (catRows || []).map((c) => (c as { name_en: string }).name_en).filter(Boolean)
  const firstIdx = total === 0 ? 0 : from + 1
  const lastIdx = from + rows.length

  return (
    <Shell active="places" crumb={<>Content <IconChevR /> Places</>} title="Places" search
      actions={<Link className="btn btn--primary btn--sm" href="/admin/places/new"><IconPlus />Add Place</Link>}>
      <div className="page-head">
        <div className="ph-l"><h2>Places</h2><p>{total} venues · page {page} of {totalPages}</p></div>
        <div className="ph-r">
          <Pager page={page} totalPages={totalPages} />
          <Link className="btn btn--primary btn--sm" href="/admin/places/new"><IconPlus />Add Place</Link>
        </div>
      </div>

      <section className="panel">
        <div className="toolbar">
          <div className="search-mini">
            <IconSearch />
            <input id="placeSearch" type="search" placeholder="Search venues…" aria-label="Search venues" />
          </div>
          <select id="placeCat" className="selectish selectish--native" aria-label="Filter by category">
            <option value="all">All categories</option>
            {catNames.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="tb-spacer" />
          <div id="placeChips" style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="chip active" data-status="all">All</button>
            <button type="button" className="chip hide-xs" data-status="published">Published</button>
            <button type="button" className="chip hide-xs" data-status="draft">Draft</button>
          </div>
        </div>

        <div className="table-scroll">
          <table className="data">
            <thead>
              <tr>
                <th>Venue</th><th className="hide-xs">Category</th><th className="hide-xs">Area</th>
                <th>Rating</th><th>Status</th><th className="hide-xs">SEO</th><th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const sc = scoreOf(venueChecks(r))
                const band = sc >= 75 ? 'good' : sc >= 50 ? 'mid' : 'low'
                const st = (r.status || (r.is_active ? 'published' : 'draft')).toLowerCase()
                return (
                  <tr key={r.id} data-name={r.name.toLowerCase()} data-cat={r.categories?.name_en || ''} data-status={r.is_active ? 'published' : 'draft'}>
                    <td>
                      <Link href={`/admin/places/${r.id}`}>
                        <div className="cell-place">
                          <div className="thumb" style={r.image_url ? { backgroundImage: `url(${r.image_url})` } : { background: 'linear-gradient(135deg,#2fbddc,#0178b4)' }} />
                          <div className="info"><b className="list-link">{r.name}</b><span><IconPin />{r.neighborhood || '—'}</span></div>
                        </div>
                      </Link>
                    </td>
                    <td className="hide-xs"><span className="pill pill--cat">{r.categories?.name_en || '—'}</span></td>
                    <td className="hide-xs muted-cell">{r.neighborhood || '—'}</td>
                    <td>{r.rating != null ? <span className="rate-cell"><IconStar />{r.rating.toFixed(1)}<small>({(r.review_count || 0).toLocaleString()})</small></span> : <span className="muted-cell">—</span>}</td>
                    <td><span className={`pill ${statusPill[st] || 'pill--draft'}`}><span className="pdot" />{st.charAt(0).toUpperCase() + st.slice(1)}</span></td>
                    <td className="hide-xs"><span className={`score-badge ${band}`}>{sc}<span className="bar"><i style={{ width: `${sc}%` }} /></span></span></td>
                    <td>
                      <div className="row-act">
                        <a className="act-btn" href={`/venues/${r.slug}`} target="_blank" rel="noreferrer" aria-label="Preview"><IconEye /></a>
                        <Link className="act-btn" href={`/admin/places/${r.id}`} aria-label="Edit"><IconEdit /></Link>
                        <RowDelete action={deletePlace} id={r.id} name={r.name} />
                      </div>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && <tr><td colSpan={7}><div className="empty"><b>No venues yet</b><span>Add your first place to get started.</span></div></td></tr>}
              <tr id="placeEmpty" style={{ display: 'none' }}><td colSpan={7}><div className="empty"><b>No matches</b><span>Try another search, category or status.</span></div></td></tr>
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <div className="info"><b id="placeCount">{rows.length}</b> on this page · {firstIdx}–{lastIdx} of {total} venues</div>
          <div style={{ marginLeft: 'auto' }}><Pager page={page} totalPages={totalPages} /></div>
        </div>
      </section>
      <PlacesFilter />
    </Shell>
  )
}
