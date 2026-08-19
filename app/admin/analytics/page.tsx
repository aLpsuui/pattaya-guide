import Shell from '@/app/admin/_components/Shell'
import { IconChevR, IconUp, IconDown } from '@/app/admin/_components/icons'
import AnalyticsTabs from '@/app/admin/_components/AnalyticsTabs'
import { getAnalytics } from '@/lib/adminAnalytics'
import { getLatestSeoReport } from '@/lib/seoReport'

// GA4 Data API + Search Console (see lib/adminAnalytics.ts). When Google isn't
// configured or a call fails, getAnalytics() returns an EMPTY dataset (zeros,
// no fake numbers) with live=false, so the page shows a "not connected" state.

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
  const [data, seoReport] = await Promise.all([getAnalytics(), getLatestSeoReport()])
  const { live, kpis, visitors, topPages, topPagesByType, sources, devices, search } = data
  const seoItems = (seoReport?.items ?? []).slice().sort((a, b) => (a.priority || 9) - (b.priority || 9))
  const fmtDate = (s?: string | null) => (s ? new Date(s).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) : '-')

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
            <b>Canlı GA4 verisi çekilemedi · rakamlar boş</b>
            <span>Google Analytics bağlantısı yok ya da veri gelmedi. Bağlanınca (GA4_PROPERTY_ID + service account erişimi) buradaki rakamlar otomatik dolar. Uydurma/örnek veri gösterilmez.</span>
          </div>
          <a className="btn btn--primary" href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics&apos;i aç →</a>
        </div>
      )}

      <AnalyticsTabs
        ga={
          <>
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

            {/* most viewed, split by content type */}
            {topPagesByType.length > 0 && (
              <section className="panel" style={{ marginBottom: 18 }}>
                <div className="panel-head"><div><b>En çok görüntülenen — türe göre</b><div className="sub">Pageviews · son 28 gün · bloglar / mekanlar / kategoriler ayrı</div></div></div>
                <div className="an-typegrid">
                  {topPagesByType.map((g) => (
                    <div className="an-typecol" key={g.type}>
                      <div className="an-typecol__head"><b>{g.label}</b><span>{g.total.toLocaleString()} görüntülenme</span></div>
                      <div className="an-pages">
                        {g.pages.map((p) => (
                          <div className="an-page" key={p.path}>
                            <span className="an-page__path" title={p.path}>{p.path}</span>
                            <span className="an-page__bar"><span style={{ width: `${p.pct}%` }} /></span>
                            <span className="an-page__n">{p.views.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* devices */}
            <section className="panel" style={{ marginBottom: 18 }}>
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
          </>
        }
        search={
          search ? (
            <>
              {/* summary */}
              <section className="panel" style={{ marginBottom: 18 }}>
                <div className="panel-head">
                  <div><b>Search Console</b><div className="sub">Google Search · last 28 days</div></div>
                  <a className="an-open" href="https://search.google.com/search-console" target="_blank" rel="noopener">Aç →</a>
                </div>
                <div className="an-sc">
                  <div className="an-sc__cell"><b>{search.clicks}</b><span>Clicks</span></div>
                  <div className="an-sc__cell"><b>{search.impressions}</b><span>Impressions</span></div>
                  <div className="an-sc__cell"><b>{search.ctr}</b><span>CTR</span></div>
                  <div className="an-sc__cell"><b>{search.position}</b><span>Avg. position</span></div>
                </div>
              </section>

              <div className="an-two">
                {/* top queries */}
                <section className="panel">
                  <div className="panel-head"><div><b>Top queries</b><div className="sub">By clicks · last 28 days</div></div></div>
                  <div className="an-sctbl-wrap">
                    <table className="an-sctbl">
                      <thead><tr><th>Query</th><th>Clicks</th><th>Impr.</th><th>CTR</th><th>Pos.</th></tr></thead>
                      <tbody>
                        {search.queries.map((r) => (
                          <tr key={r.key}><td title={r.key}>{r.key}</td><td>{r.clicks}</td><td>{r.impressions}</td><td>{r.ctr}</td><td>{r.position}</td></tr>
                        ))}
                        {search.queries.length === 0 && <tr><td colSpan={5} className="an-note">Henüz sorgu verisi yok.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* top pages */}
                <section className="panel">
                  <div className="panel-head"><div><b>Top pages</b><div className="sub">By clicks · last 28 days</div></div></div>
                  <div className="an-sctbl-wrap">
                    <table className="an-sctbl">
                      <thead><tr><th>Page</th><th>Clicks</th><th>Impr.</th><th>CTR</th><th>Pos.</th></tr></thead>
                      <tbody>
                        {search.pages.map((r) => {
                          const path = r.key.replace(/^https?:\/\/[^/]+/, '') || '/'
                          return <tr key={r.key}><td title={r.key}>{path}</td><td>{r.clicks}</td><td>{r.impressions}</td><td>{r.ctr}</td><td>{r.position}</td></tr>
                        })}
                        {search.pages.length === 0 && <tr><td colSpan={5} className="an-note">Henüz sayfa verisi yok.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </>
          ) : (
            <section className="panel">
              <div className="panel-head">
                <div><b>Search Console</b><div className="sub">Google Search</div></div>
                <a className="an-open" href="https://search.google.com/search-console" target="_blank" rel="noopener">Aç →</a>
              </div>
              <p className="an-note">Search Console bağlı değil. GSC_SITE_URL eklenip service account GSC&apos;de Viewer yapılınca burası dolar.</p>
            </section>
          )
        }
        aiseo={
          seoReport ? (
            <>
              <section className="panel" style={{ marginBottom: 18 }}>
                <div className="panel-head">
                  <div>
                    <b>AI SEO analizi</b>
                    <div className="sub">{fmtDate(seoReport.period_start)}–{fmtDate(seoReport.period_end)} · {seoReport.model} · üretildi {fmtDate(seoReport.created_at)}</div>
                  </div>
                </div>
                <div className="an-recsum">
                  <p>{seoReport.summary}</p>
                  <div className="an-recmeta">
                    <span><b>{(seoReport.meta?.total_impressions ?? 0).toLocaleString()}</b> gösterim</span>
                    <span><b>{(seoReport.meta?.total_clicks ?? 0).toLocaleString()}</b> tık</span>
                    <span><b>{seoItems.length}</b> öneri</span>
                  </div>
                </div>
              </section>

              <div className="an-recs">
                {seoItems.map((it, i) => (
                  <div className={`an-rec an-rec--p${it.priority || 3}`} key={i}>
                    <div className="an-rec__top">
                      <span className="an-rec__pri">P{it.priority || 3}</span>
                      <span className={`an-rec__kind ${it.kind === 'gap' ? 'is-gap' : ''}`}>{it.kind === 'gap' ? 'Yeni içerik' : 'İyileştir'}</span>
                      <span className="an-rec__target" title={it.target}>{it.target}</span>
                    </div>
                    {it.page_path
                      ? <a className="an-rec__path" href={it.page_path} target="_blank" rel="noopener">{it.page_path} ↗</a>
                      : <span className="an-rec__path an-rec__path--gap">— yeni sayfa önerisi —</span>}
                    <div className="an-rec__issue">{it.issue}</div>
                    <div className="an-rec__action">{it.action}</div>
                    <div className="an-rec__metrics">
                      <span>{(it.impressions ?? 0).toLocaleString()} gösterim</span>
                      <span>{(it.clicks ?? 0).toLocaleString()} tık</span>
                      <span>CTR {it.ctr ?? 0}%</span>
                      <span>Poz. {it.position ?? '-'}</span>
                    </div>
                  </div>
                ))}
                {seoItems.length === 0 && <p className="an-note">Bu raporda öneri yok.</p>}
              </div>
            </>
          ) : (
            <section className="panel">
              <div className="panel-head"><div><b>AI SEO analizi</b><div className="sub">Haftalık öneri motoru</div></div></div>
              <p className="an-note">Henüz analiz üretilmedi. <code>node scripts/seo-analysis.mjs</code> çalıştırılınca (GSC bağlıyken) en çok aranan keyword&apos;lere göre geliştirilmesi gereken sayfalar burada önceliklendirilmiş olarak listelenir. Not: <code>seo_recommendations</code> tablosu için <code>supabase-seo-recommendations.sql</code> bir kez çalıştırılmalı.</p>
            </section>
          )
        }
      />

      <p className="an-foot">{live ? `Canlı GA4 verisi · saatlik güncellenir · ${days.length} günlük görünüm` : 'Canlı GA4 verisi bekleniyor. Bağlanınca rakamlar otomatik dolar; örnek/uydurma veri gösterilmez.'}</p>
    </Shell>
  )
}
