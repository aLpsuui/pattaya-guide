import Link from 'next/link'
import { db } from '@/lib/admin/db'
import Shell from '@/app/admin/_components/Shell'
import { IconPin, IconDoc, IconChevR, IconPlus, IconCheck, IconWarn, IconStar, IconEye, IconEdit } from '@/app/admin/_components/icons'
import { getAnalytics } from '@/lib/adminAnalytics'

export const dynamic = 'force-dynamic'

// Real GA4 daily-users series → traffic chart paths for the 740x240 viewBox.
function trafficPaths(vals: number[]) {
  const x0 = 40, x1 = 712, yTop = 40, yBot = 200
  const max = Math.max(...vals, 1)
  const n = Math.max(vals.length, 2)
  const x = (i: number) => x0 + (i / (n - 1)) * (x1 - x0)
  const y = (v: number) => yBot - (v / max) * (yBot - yTop)
  const line = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const last = vals.length - 1
  return { line, area: `${line} L ${x(last).toFixed(1)} ${yBot} L ${x0} ${yBot} Z`, cx: x(last), cy: y(vals[last] ?? 0) }
}

const CAT_COLORS: Record<string, string> = {
  'eat-and-drinks': '#e8632b', 'things-to-do': '#0178b4', 'nightlife': '#7a5cff',
  'yoga-and-fitness': '#1ba672', 'wellness-and-beauty': '#d6489b',
}
const palette = ['#0178b4', '#7a5cff', '#1ba672', '#e8a33d', '#e0524d', '#0a9bbf']

async function countAll(table: string) {
  const { count } = await db.from(table).select('*', { count: 'exact', head: true })
  return count || 0
}
async function countWhere(table: string, col: string, val: unknown) {
  const { count } = await db.from(table).select('*', { count: 'exact', head: true }).eq(col, val)
  return count || 0
}

// Decorative sparkline (no historical series yet - purely visual).
function Spark({ id, color, d }: { id: string; color: string; d: string }) {
  return (
    <svg className="kpi-spark" viewBox="0 0 120 42" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".22" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={`${d} L120 42 L0 42 Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type RecentVenue = {
  id: string; slug: string | null; name: string; rating: number | null; review_count: number | null
  is_active: boolean | null; neighborhood: string | null; image_url: string | null; categories: { name_en: string } | null
}

export default async function Dashboard() {
  const [venues, venuesPub, posts, postsPub, draftVenues, catData, venCatData, recentData] = await Promise.all([
    countAll('venues'),
    countWhere('venues', 'is_active', true),
    countAll('blog_posts'),
    countWhere('blog_posts', 'is_published', true),
    countWhere('venues', 'is_active', false),
    db.from('categories').select('id,name_en,slug'),
    db.from('venues').select('category_id').eq('is_active', true).limit(2000),
    db.from('venues').select('id,slug,name,rating,review_count,is_active,neighborhood,image_url,categories(name_en)').order('updated_at', { ascending: false }).limit(6),
  ])

  const categories = (catData.data || []) as { id: string; name_en: string; slug: string }[]
  const venCat = (venCatData.data || []) as { category_id: string | null }[]
  const recent = (recentData.data || []) as unknown as RecentVenue[]

  // Real traffic from GA4 (getAnalytics). No demo/fake series - when GA isn't
  // connected the chart is flat zeros and the sub-label says so.
  const analytics = await getAnalytics()
  const traffic = trafficPaths(analytics.visitors.length ? analytics.visitors : [0])
  const sessionsVal = analytics.kpis.find((k) => k.label === 'Sessions')?.value ?? '-'
  const pageviewsVal = analytics.kpis.find((k) => k.label === 'Pageviews')?.value ?? '-'

  // real category distribution
  const cats = categories
    .map((c, i) => ({
      name: c.name_en,
      n: venCat.filter((v) => v.category_id === c.id).length,
      color: CAT_COLORS[c.slug] || palette[i % palette.length],
    }))
    .filter((c) => c.n > 0)
    .sort((a, b) => b.n - a.n)
  const maxCat = Math.max(1, ...cats.map((c) => c.n))
  const totalCat = cats.reduce((s, c) => s + c.n, 0) || 1

  const kpis = [
    { ic: 'blue', icon: <IconPin />, val: venues, label: 'Total places', spark: { id: 'sp1', color: '#0178b4', d: 'M0 34 L20 30 L40 32 L60 22 L80 24 L100 14 L120 16' } },
    { ic: 'green', icon: <IconCheck />, val: venuesPub, label: 'Published places', spark: { id: 'sp2', color: '#1ba672', d: 'M0 36 L20 30 L40 33 L60 26 L80 20 L100 22 L120 12' } },
    { ic: 'cyan', icon: <IconDoc />, val: posts, label: 'Blog posts', spark: { id: 'sp3', color: '#0a7e9c', d: 'M0 30 L20 32 L40 24 L60 28 L80 18 L100 20 L120 14' } },
    { ic: 'violet', icon: <IconWarn />, val: draftVenues, label: 'Places in draft', spark: { id: 'sp4', color: '#6c4cc4', d: 'M0 18 L20 16 L40 22 L60 20 L80 28 L100 24 L120 30' } },
  ]

  return (
    <Shell active="dashboard" crumb={<>Overview <IconChevR /> Dashboard</>} title="Dashboard">
      <div className="page-head">
        <div className="ph-l"><h2>Welcome back 👋</h2><p>Content overview across Pattaya Guide · {venues} places · {posts} posts</p></div>
        <div className="ph-r">
          <Link className="btn btn--ghost btn--sm" href="/admin/blog/new"><IconPlus />New post</Link>
          <Link className="btn btn--primary btn--sm" href="/admin/places/new"><IconPlus />Add place</Link>
        </div>
      </div>

      {/* KPI cards */}
      <section className="kpi-grid">
        {kpis.map((k) => (
          <article className="kpi" key={k.label}>
            <div className="kpi-top"><div className={`kpi-ic ${k.ic}`}>{k.icon}</div></div>
            <div className="kpi-val">{k.val.toLocaleString()}</div>
            <div className="kpi-label">{k.label}</div>
            <Spark id={k.spark.id} color={k.spark.color} d={k.spark.d} />
          </article>
        ))}
      </section>

      {/* charts: traffic (demo) + category distribution (real) */}
      <section className="chart-grid">
        <div className="panel">
          <div className="panel-head">
            <div><h3>Traffic Overview</h3><div className="sub">{analytics.live ? 'Daily users · last 28 days · GA4' : 'GA4 bağlantısı bekleniyor · rakamlar boş'}</div></div>
            <div className="ph-actions"><Link className="link-more" href="/admin/analytics">Open analytics<IconChevR /></Link></div>
          </div>
          <div className="panel-body">
            <div className="chart-wrap">
              <svg className="chart-svg" viewBox="0 0 740 240" preserveAspectRatio="none" role="img" aria-label="Traffic over the last 28 days">
                <defs><linearGradient id="dArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0178b4" stopOpacity=".22" /><stop offset="1" stopColor="#0178b4" stopOpacity="0" /></linearGradient></defs>
                <line x1="40" y1="40" x2="712" y2="40" stroke="var(--grid-line)" /><line x1="40" y1="100" x2="712" y2="100" stroke="var(--grid-line)" /><line x1="40" y1="160" x2="712" y2="160" stroke="var(--grid-line)" /><line x1="40" y1="200" x2="712" y2="200" stroke="var(--grid-line)" />
                <path d={traffic.area} fill="url(#dArea)" />
                <path d={traffic.line} fill="none" stroke="#0178b4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={traffic.cx} cy={traffic.cy} r="5" fill="#fff" stroke="#0178b4" strokeWidth="3" />
              </svg>
            </div>
            <div className="chart-legend">
              <span className="lg-item"><span className="sw" style={{ background: '#0178b4' }} />Sessions <b>{sessionsVal}</b></span>
              <span className="lg-item"><span className="sw" style={{ background: '#2fbddc' }} />Page views <b>{pageviewsVal}</b></span>
              <span className="lg-item" style={{ marginLeft: 'auto' }}><span className="sw" style={{ background: analytics.live ? '#1ba672' : '#94a3b8' }} />{analytics.live ? 'Canlı GA4 verisi' : 'Henüz veri yok'}</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div><h3>Places by Category</h3><div className="sub">{venuesPub} published venues</div></div>
            <div className="ph-actions"><Link className="link-more" href="/admin/categories">All<IconChevR /></Link></div>
          </div>
          <div className="panel-body">
            <div className="catbar">
              {cats.map((c) => (
                <div className="catbar-row" key={c.name}>
                  <div className="ct-top">
                    <span className="ct-ic" style={{ background: c.color }}>{c.name.charAt(0)}</span>
                    <span className="ct-name">{c.name}</span>
                    <span className="ct-val">{c.n}<span className="ct-pct">{Math.round((c.n / totalCat) * 100)}%</span></span>
                  </div>
                  <div className="ct-track"><div className="ct-fill" style={{ width: `${(c.n / maxCat) * 100}%`, background: c.color }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* recent places (real) */}
      <section className="panel" style={{ marginBottom: 22 }}>
        <div className="panel-head">
          <div><h3>Recently updated places</h3><div className="sub">Latest venue edits</div></div>
          <div className="ph-actions"><Link className="link-more" href="/admin/places">Open full directory<IconChevR /></Link></div>
        </div>
        <div className="table-scroll">
          <table className="data">
            <thead><tr><th>Venue</th><th className="hide-xs">Category</th><th>Rating</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {recent.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div className="cell-place">
                      <div className="thumb" style={{ background: v.image_url ? `center/cover url(${v.image_url})` : 'linear-gradient(135deg,#2fbddc,#0178b4)' }} />
                      <div className="info"><b>{v.name}</b><span><IconPin />{v.neighborhood || '-'}</span></div>
                    </div>
                  </td>
                  <td className="hide-xs">{v.categories?.name_en ? <span className="pill pill--cat">{v.categories.name_en}</span> : '-'}</td>
                  <td>{v.rating != null ? <span className="rate-cell"><IconStar />{v.rating.toFixed(1)}{v.review_count != null && <small>({v.review_count.toLocaleString()})</small>}</span> : <span className="muted-cell">-</span>}</td>
                  <td>{v.is_active ? <span className="pill pill--pub"><span className="pdot" />Published</span> : <span className="pill pill--draft"><span className="pdot" />Draft</span>}</td>
                  <td>
                    <div className="row-act">
                      {v.slug && <a className="act-btn" href={`/venues/${v.slug}`} target="_blank" rel="noreferrer" aria-label="View"><IconEye /></a>}
                      <Link className="act-btn" href={`/admin/places/${v.id}`} aria-label="Edit"><IconEdit /></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="foot-note">Pattaya Guide Admin · connected to Supabase · {postsPub} posts published.</p>
    </Shell>
  )
}
