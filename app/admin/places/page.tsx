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

export default async function PlacesPage() {
  const { data } = await db
    .from('venues')
    .select('id,name,slug,neighborhood,rating,review_count,image_url,status,is_active,seo_title,description,focus_keyword,categories(name_en)')
    .order('name', { ascending: true })
    .limit(200)
  const rows = (data || []) as unknown as Row[]
  const catNames = [...new Set(rows.map((r) => r.categories?.name_en).filter(Boolean))].sort() as string[]

  return (
    <Shell active="places" crumb={<>Content <IconChevR /> Places</>} title="Places" search
      actions={<Link className="btn btn--primary btn--sm" href="/admin/places/new"><IconPlus />Add Place</Link>}>
      <div className="page-head">
        <div className="ph-l"><h2>Places</h2><p>{rows.length} venues · manage status &amp; visibility</p></div>
        <div className="ph-r"><Link className="btn btn--primary btn--sm" href="/admin/places/new"><IconPlus />Add Place</Link></div>
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
        <div className="table-foot"><div className="info">Showing <b id="placeCount">{rows.length}</b> of {rows.length} venues</div></div>
      </section>
      <PlacesFilter />
    </Shell>
  )
}
