import Shell from '@/app/admin/_components/Shell'
import { IconChevR, IconUp, IconDown } from '@/app/admin/_components/icons'
import { getAnalytics } from '@/lib/adminAnalytics'

// GA4 Data API + Search Console (see lib/adminAnalytics.ts). When Google isn't
// configured or a call fails, getAnalytics() returns the demo dataset so this
// page always renders - the markup below is identical either way.

export const metadata = { title: 'Analytics - Pattaya Guide Admin' }

// ---- svg area chart ---------------------------------------------------
function areaPath(vals: number[], w: number, h: number, pad = 4) {
  const max = Math.max(...vals, 1) * 1.1
  const n = Math.max(vals.length, 2)
  const x = (i: number) => (i / (n - 1)) * (w - pad * 2) + pad
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2)
  const line = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const area = `${line} L ${x(vals.length - 1).toFixed(1)} ${h} L ${x(0).toFixed(1)} ${h} Z`
  return { line, area }
}

export default async function AnalyticsPage() {
  const data = await getAnalytics()
  const { live, kpis, visitors, topPages, sources, devices, search } = data

  const W = 760, H = 200
  const main = areaPath(visitors, W, H)
  const days = Array.from({ length: visitors.length }, (_, i) => i)
  // cumulative offsets for the donut
  let acc = 0
  const stops = sources.map((s) => { const from = acc; acc += s.pct; return `${s.color} ${from}% ${acc}%` }).join(', ')
  const sessionsTotal = kpis.find((k) => k.label === 'Sessions')?.value ?? '-'

  return (
    <Shell active="analytics" crumb={<>Growth <IconChevR /> Analytics</>} title="Analytics">
      <div className="page-head">
        <div className="ph-l"><h2>Site analytics</h2><p>Last 28 days · visitors, pages &amp; sources</p></div>
        <div className="ph-r"><span className="seg"><button className="on">28d</button><button>7d</button><button>90d</button></span></div>
      </div>

      {/* connection banner */}
      {live ? (
        <div className="an-banner an-banner--live">
          <div>
            <b>Live · Google Analytics 4 connected</b>
            <span>Rakamlar son 28 günün gerçek GA4{search ? ' + Search Console' : ''} verisi. Saatlik güncellenir.</span>
          </div>
        </div>
      ) : (
        <div className="an-banner">
          <div>
            <b>Demo data - Google not connected yet</b>
            <span>Bağlandığında bu kartlar canlı Google Analytics 4 + Search Console verisiyle dolacak. Şu an örnek verilerle gösteriliyor.</span>
          </div>
          <button className="btn btn--primary" disabled>Connect Google</button>
        </div>
      )}

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
            {topPages.length === 0 && <p className="an-note">Henüz sayfa görüntüleme verisi yok.</p>}
          </div>
        </section>

        {/* traffic sources */}
        <section className="panel">
          <div className="panel-head"><div><b>Traffic sources</b><div className="sub">Sessions by channel</div></div></div>
          <div className="an-src">
            <div className="an-donut" style={{ background: sources.length ? `conic-gradient(${stops})` : 'var(--border)' }}><div className="an-donut__hole"><b>{sessionsTotal}</b><span>sessions</span></div></div>
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
          <div className="panel-head"><div><b>Search Console</b><div className="sub">Google Search · last 28 days</div></div></div>
          {search ? (
            <div className="an-sc">
              <div className="an-sc__cell"><b>{search.clicks}</b><span>Clicks</span></div>
              <div className="an-sc__cell"><b>{search.impressions}</b><span>Impressions</span></div>
              <div className="an-sc__cell"><b>{search.ctr}</b><span>CTR</span></div>
              <div className="an-sc__cell"><b>{search.position}</b><span>Avg. position</span></div>
            </div>
          ) : (
            <p className="an-note">Search Console bağlı değil. GSC_SITE_URL eklenip service account GSC&apos;de Viewer yapılınca burası dolar.</p>
          )}
        </section>
      </div>

      <p className="an-foot">{live ? `Canlı GA4 verisi · saatlik güncellenir · ${days.length} günlük görünüm` : 'Tüm rakamlar örnektir. Google Analytics 4 + Search Console bağlandığında otomatik canlı veriyle değişir.'}</p>
    </Shell>
  )
}
