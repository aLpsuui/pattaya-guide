import { db } from '@/lib/admin/db'
import Link from 'next/link'
import Shell from '@/app/admin/_components/Shell'
import { IconChevR, IconEdit } from '@/app/admin/_components/icons'

export const dynamic = 'force-dynamic'

// Distinct colours per main category (cycled).
const COLORS = ['#0178b4', '#7a5cff', '#1ba672', '#e8a33d', '#e0524d', '#0a9bbf', '#b4509e', '#5b6cff']

type Cat = { id: string; name_en: string; slug: string }
type Ven = { category_id: string | null; venue_type: string | null }

export default async function CategoriesPage() {
  const [{ data: cats }, { data: vens }] = await Promise.all([
    db.from('categories').select('id,name_en,slug').order('name_en', { ascending: true }),
    db.from('venues').select('category_id,venue_type').eq('is_active', true).limit(2000),
  ])
  const categories = (cats || []) as Cat[]
  const venues = (vens || []) as Ven[]

  const nodes = categories.map((c, i) => {
    const own = venues.filter((v) => v.category_id === c.id)
    const m = new Map<string, number>()
    for (const v of own) {
      const t = (v.venue_type || 'Other').trim() || 'Other'
      m.set(t, (m.get(t) || 0) + 1)
    }
    const subs = [...m.entries()].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n)
    return { ...c, color: COLORS[i % COLORS.length], total: own.length, subs }
  })

  const totalVenues = venues.length
  const totalSubs = nodes.reduce((s, n) => s + n.subs.length, 0)

  return (
    <Shell active="categories" crumb={<>Content <IconChevR /> Categories</>} title="Categories"
      actions={<Link href="/admin/categories/manage" className="btn btn--primary btn--sm"><IconEdit /> Manage categories</Link>}>
      <div className="page-head">
        <div className="ph-l">
          <h2>Category map</h2>
          <p>{nodes.length} main categories · {totalSubs} sub-types · {totalVenues} venues</p>
        </div>
      </div>

      <div className="cat-diagram">
        {/* root node */}
        <div className="cat-root">
          <span className="cat-root__dot" />
          <div className="cat-root__txt">
            <b>Go To Pattaya</b>
            <span>{nodes.length} categories · {totalVenues} venues</span>
          </div>
        </div>
        <div className="cat-trunk" aria-hidden="true" />

        {/* main categories → sub-types */}
        <div className="cat-grid">
          {nodes.map((n) => (
            <div className="cat-table" key={n.id} style={{ '--cc': n.color } as React.CSSProperties}>
              <div className="cat-table__h">
                <span className="cat-table__dot" />
                <span className="cat-table__name">{n.name_en}</span>
                <span className="cat-table__count">{n.total}</span>
              </div>
              <div className="cat-table__b">
                {n.subs.length === 0 ? (
                  <div className="cat-row cat-row--empty">No sub-types yet</div>
                ) : (
                  n.subs.map((s, i) => (
                    <div className="cat-row" key={s.label}>
                      <span className="cat-row__tick" data-last={i === n.subs.length - 1 ? 'true' : undefined} />
                      <span className="cat-row__label" title={s.label}>{s.label}</span>
                      <span className="cat-row__n">{s.n}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}
