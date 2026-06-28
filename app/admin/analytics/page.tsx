import Shell from '@/app/admin/_components/Shell'
import { IconChevR, IconUp, IconDown } from '@/app/admin/_components/icons'

// NOTE: This page currently renders DEMO data so the dashboard UI can be
// reviewed. Once a Google Analytics 4 service account + Measurement ID are
// configured, swap the sample arrays below for live GA4 Data API + Search
// Console responses (the markup/charts stay the same).

export const metadata = { title: 'Analytics — Pattaya Guide Admin' }

// ---- demo dataset -----------------------------------------------------
const DAYS = 28
const visitors = [
  120, 138, 132, 159, 178, 150, 131, 168, 188, 182, 209, 231, 198, 176,
  221, 242, 233, 261, 286, 248, 224, 272, 301, 296, 324, 352, 309, 341,
]
const pageviewsSeries = visitors.map((v) => Math.round(v * 2.9))

const kpis = [
  { label: 'Users', value: '4,820', delta: 12.4, up: true },
  { label: 'Sessions', value: '6,310', delta: 9.1, up: true },
  { label: 'Pageviews', value: '18,940', delta: 15.2, up: true },
  { label: 'Avg. engagement', value: '2m 14s', delta: 3.8, up: true },
]

const topPages = [
  { path: '/', views: 5120, pct: 100 },
  { path: '/eat-and-drinks', views: 2840, pct: 55 },
  { path: '/things-to-do', views: 2210, pct: 43 },
  { path: '/blog/is-pattaya-safe', views: 1730, pct: 34 },
  { path: '/areas/jomtien', views: 1290, pct: 25 },
  { path: '/nightlife', views: 980, pct: 19 },
  { path: '/yoga-and-fitness', views: 760, pct: 15 },
]

const sources = [
  { label: 'Organic Search', pct: 58, color: '#0178b4' },
  { label: 'Direct', pct: 22, color: '#7a5cff' },
  { label: 'Social', pct: 12, color: '#1ba672' },
  { label: 'Referral', pct: 8, color: '#e8a33d' },
]

const devices = [
  { label: 'Mobile', pct: 64 },
  { label: 'Desktop', pct: 30 },
  { label: 'Tablet', pct: 6 },
]

const search = { clicks: '1,240', impressions: '88,500', ctr: '1.4%', position: '18.3' }

// ---- svg area chart ---------------------------------------------------
function areaPath(vals: number[], w: number, h: number, pad = 4) {
  const max = Math.max(...vals) * 1.1
  const n = vals.length
  const x = (i: number) => (i / (n - 1)) * (w - pad * 2) + pad
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2)
  const line = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const area = `${line} L ${x(n - 1).toFixed(1)} ${h} L ${x(0).toFixed(1)} ${h} Z`
  return { line, area }
}

export default function AnalyticsPage() {
  const W = 760, H = 200
  const main = areaPath(visitors, W, H)
  const days = Array.from({ length: DAYS }, (_, i) => i)
  // cumulative offsets for the donut
  let acc = 0
  const stops = sources.map((s) => { const from = acc; acc += s.pct; return `${s.color} ${from}% ${acc}%` }).join(', ')

  return (
    <Shell active="analytics" crumb={<>Growth <IconChevR /> Analytics</>} title="Analytics">
      <div className="page-head">
        <div className="ph-l"><h2>Site analytics</h2><p>Last 28 days · visitors, pages &amp; sources</p></div>
        <div className="ph-r"><span className="seg"><button className="on">28d</button><button>7d</button><button>90d</button></span></div>
      </div>

      {/* demo banner */}
      <div className="an-banner">
        <div>
          <b>Demo data — Google not connected yet</b>
          <span>Bağlandığında bu kartlar canlı Google Analytics 4 + Search Console verisiyle dolacak. Şu an örnek verilerle gösteriliyor.</span>
        </div>
        <button className="btn btn--primary" disabled>Connect Google</button>
      </div>

      {/* KPI cards */}
      <div className="an-kpis">
        {kpis.map((k) => (
          <div className="an-kpi" key={k.label}>
            <div className="an-kpi__l">{k.label}</div>
            <div className="an-kpi__v">{k.value}</div>
            <div className={`an-delta${k.up ? ' up' : ' down'}`}>{k.up ? <IconUp /> : <IconDown />}{k.delta}%<span>vs prev</span></div>
          </div>
        ))}
      </div>

      {/* main visitors chart */}
      <section className="panel an-chart">
        <div className="panel-head"><div><b>Visitors</b><div className="sub">Daily users · last 28 days</div></div></div>
        <div className="an-chart__body">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="an-svg" role="img" aria-label="Visitors over the last 28 days">
            <defs>
              <linearGradient id="anFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--ocean)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--ocean)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={main.area} fill="url(#anFill)" />
            <path d={main.line} fill="none" stroke="var(--ocean)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <div className="an-xaxis"><span>28 gün önce</span><span>14 gün</span><span>Bugün</span></div>
        </div>
      </section>

      <div className="an-two">
        {/* top pages */}
        <section className="panel">
          <div className="panel-head"><div><b>Top pages</b><div className="sub">By pageviews</div></div></div>
          <div className="an-pages">
            {topPages.map((p) => (
              <div className="an-page" key={p.path}>
                <span className="an-page__path" title={p.path}>{p.path}</span>
                <span className="an-page__bar"><span style={{ width: `${p.pct}%` }} /></span>
                <span className="an-page__n">{p.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>

        {/* traffic sources */}
        <section className="panel">
          <div className="panel-head"><div><b>Traffic sources</b><div className="sub">Sessions by channel</div></div></div>
          <div className="an-src">
            <div className="an-donut" style={{ background: `conic-gradient(${stops})` }}><div className="an-donut__hole"><b>4.8k</b><span>sessions</span></div></div>
            <div className="an-legend">
              {sources.map((s) => (
                <div className="an-leg" key={s.label}>
                  <span className="an-leg__dot" style={{ background: s.color }} />
                  <span className="an-leg__l">{s.label}</span>
                  <span className="an-leg__n">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="an-two">
        {/* devices */}
        <section className="panel">
          <div className="panel-head"><div><b>Devices</b><div className="sub">Share of sessions</div></div></div>
          <div className="an-bars">
            {devices.map((d) => (
              <div className="an-barrow" key={d.label}>
                <span className="an-barrow__l">{d.label}</span>
                <span className="an-barrow__track"><span style={{ width: `${d.pct}%` }} /></span>
                <span className="an-barrow__n">{d.pct}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* search console */}
        <section className="panel">
          <div className="panel-head"><div><b>Search Console</b><div className="sub">Google Search · placeholder</div></div></div>
          <div className="an-sc">
            <div className="an-sc__cell"><b>{search.clicks}</b><span>Clicks</span></div>
            <div className="an-sc__cell"><b>{search.impressions}</b><span>Impressions</span></div>
            <div className="an-sc__cell"><b>{search.ctr}</b><span>CTR</span></div>
            <div className="an-sc__cell"><b>{search.position}</b><span>Avg. position</span></div>
          </div>
          <p className="an-note">Search Console verisi, site gerçek domende (gotopattaya.com) yayına girip indekslendikten sonra anlamlı olur.</p>
        </section>
      </div>

      <p className="an-foot">Tüm rakamlar örnektir. Google Analytics 4 + Search Console bağlandığında otomatik canlı veriyle değişir. ({days.length} günlük görünüm)</p>
    </Shell>
  )
}
