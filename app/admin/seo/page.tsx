import Link from 'next/link'
import { db } from '@/lib/admin/db'
import Shell from '@/app/admin/_components/Shell'
import { IconChevR, IconCheck, IconWarn, IconCross } from '@/app/admin/_components/icons'

export const dynamic = 'force-dynamic'

type Item = { kind: 'place' | 'post'; id: string; href: string; title: string; hasTitle: boolean; hasMeta: boolean; noindex: boolean }

export default async function SeoPage() {
  const [{ data: v }, { data: p }] = await Promise.all([
    db.from('venues').select('id,name,seo_title,description,noindex').limit(500),
    db.from('blog_posts').select('id,title,seo_title,meta_description,description,noindex').limit(500),
  ])

  const items: Item[] = [
    ...(v || []).map((r): Item => ({ kind: 'place', id: r.id, href: `/admin/places/${r.id}`, title: r.name, hasTitle: !!r.seo_title, hasMeta: !!(r.description && r.description.length >= 80), noindex: !!r.noindex })),
    ...(p || []).map((r): Item => ({ kind: 'post', id: r.id, href: `/admin/blog/${r.id}`, title: r.title, hasTitle: !!(r.seo_title || r.title), hasMeta: !!((r.meta_description || r.description || '').length >= 80), noindex: !!r.noindex })),
  ]

  const total = items.length
  const withTitle = items.filter((i) => i.hasTitle).length
  const withMeta = items.filter((i) => i.hasMeta).length
  const noindexed = items.filter((i) => i.noindex).length
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0)
  const needs = items.filter((i) => !i.hasTitle || !i.hasMeta).slice(0, 100)

  const kpis = [
    { ic: 'blue', val: total, label: 'Indexable pages' },
    { ic: 'green', val: `${pct(withTitle)}%`, label: 'Have SEO title' },
    { ic: 'amber', val: `${pct(withMeta)}%`, label: 'Have meta description' },
    { ic: 'red', val: noindexed, label: 'Set to noindex' },
  ]

  return (
    <Shell active="seo" crumb={<>Growth <IconChevR /> SEO Health</>} title="SEO Health">
      <div className="page-head">
        <div className="ph-l"><h2>SEO Health</h2><p>Meta coverage across {total} pages</p></div>
      </div>

      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="kpi-top"><div className={`kpi-ic ${k.ic}`}><IconCheck /></div></div>
            <div className="kpi-val">{k.val}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="panel-head"><div><h3>Needs attention</h3><div className="sub">Missing SEO title or meta description</div></div></div>
        <div className="table-scroll">
          <table className="data">
            <thead><tr><th>Page</th><th>Type</th><th>SEO title</th><th>Meta</th><th>Index</th></tr></thead>
            <tbody>
              {needs.map((i) => (
                <tr key={i.id}>
                  <td><Link className="list-link" href={i.href}><b>{i.title}</b></Link></td>
                  <td><span className="pill pill--cat">{i.kind === 'place' ? 'Place' : 'Post'}</span></td>
                  <td><Tag ok={i.hasTitle} /></td>
                  <td><Tag ok={i.hasMeta} /></td>
                  <td>{i.noindex ? <span className="tag warn"><IconWarn />noindex</span> : <span className="tag ok"><IconCheck />index</span>}</td>
                </tr>
              ))}
              {needs.length === 0 && <tr><td colSpan={5}><div className="empty"><b>All good</b><span>Every page has a title and meta description.</span></div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </Shell>
  )
}

function Tag({ ok }: { ok: boolean }) {
  return ok ? <span className="tag ok"><IconCheck />Set</span> : <span className="tag bad"><IconCross />Missing</span>
}
