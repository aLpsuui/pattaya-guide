import crypto from 'node:crypto'
import { unstable_cache } from 'next/cache'

// Live GA4 Data API + Search Console API for the admin analytics dashboard.
// Auth is a service-account JWT signed with Node's crypto (no external deps).
// Everything degrades gracefully: when the env isn't configured or a call
// fails, getAnalytics() returns the demo dataset so the page never breaks.
//
// Required env (set in the "gotopattaya" Vercel project, Production):
//   GOOGLE_SA_KEY_B64  - base64 of the service-account JSON key file
//   GA4_PROPERTY_ID    - numeric GA4 property id (NOT the G-XXXX measurement id)
//   GSC_SITE_URL       - Search Console property, e.g. "sc-domain:gotopattaya.com"

// ---- shape shared with the page --------------------------------------------
export type Kpi = { label: string; value: string; delta: number; up: boolean }
export type GscRow = { key: string; clicks: string; impressions: string; ctr: string; position: string }
export type Search = {
  clicks: string; impressions: string; ctr: string; position: string
  queries: GscRow[]
  pages: GscRow[]
}
export type PageStat = { path: string; views: number; pct: number }
export type PageGroup = { type: PageType; label: string; total: number; pages: PageStat[] }
export type AnalyticsData = {
  live: boolean
  kpis: Kpi[]
  visitors: number[]
  topPages: PageStat[]
  topPagesByType: PageGroup[]
  sources: { label: string; pct: number; color: string }[]
  devices: { label: string; pct: number }[]
  search: Search | null
}

// Classify a GA4 pagePath (e.g. "/en/venues/oasis-spa") into a content type so
// the dashboard can split "most viewed" into blogs vs venues vs categories etc.
export type PageType = 'venue' | 'blog' | 'area' | 'category' | 'home' | 'other'
const PAGE_TYPE_LABEL: Record<PageType, string> = {
  venue: 'Mekanlar', blog: 'Bloglar', area: 'Alanlar', category: 'Kategoriler', home: 'Ana sayfa', other: 'Diğer',
}
// First path segments that are standalone pages, not category pillars.
const NON_CATEGORY = new Set(['author', 'search', 'contact', 'plan-my-trip', 'plan', 'about', 'privacy', 'terms', 'sitemap', 'admin', 'api'])
export function pageType(rawPath: string): PageType {
  const path = rawPath.split(/[?#]/)[0].replace(/^\/(en|ru)(?=\/|$)/, '') // strip locale prefix
  const segs = path.split('/').filter(Boolean)
  if (segs.length === 0) return 'home'
  if (segs[0] === 'venues') return 'venue'
  if (segs[0] === 'blog') return 'blog'
  if (segs[0] === 'areas') return 'area'
  if (NON_CATEGORY.has(segs[0])) return 'other'
  return 'category' // pillar (/eat-and-drinks) or subcategory (/eat-and-drinks/coffee)
}

const SOURCE_COLORS = ['#0178b4', '#7a5cff', '#1ba672', '#e8a33d', '#d0517e', '#38a3a5']

// ---- empty fallback (no fake data) -----------------------------------------
// When Google isn't configured or a call fails, we return real-looking zeros
// instead of fabricated numbers, and live=false so the page shows a "not
// connected" state rather than misleading demo data.
export const EMPTY: AnalyticsData = {
  live: false,
  kpis: [
    { label: 'Users', value: '0', delta: 0, up: true },
    { label: 'Sessions', value: '0', delta: 0, up: true },
    { label: 'Pageviews', value: '0', delta: 0, up: true },
    { label: 'Avg. engagement', value: '0m 00s', delta: 0, up: true },
  ],
  visitors: [0],
  topPages: [],
  topPagesByType: [],
  sources: [],
  devices: [],
  search: null,
}

// ---- service-account auth --------------------------------------------------
function loadSA(): { client_email: string; private_key: string } | null {
  const b64 = process.env.GOOGLE_SA_KEY_B64
  if (!b64) return null
  try {
    const j = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
    if (j.client_email && j.private_key) return { client_email: j.client_email, private_key: j.private_key }
  } catch { /* malformed key */ }
  return null
}

const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
].join(' ')

const b64url = (b: Buffer | string) => (typeof b === 'string' ? Buffer.from(b) : b).toString('base64url')

let tokenCache: { token: string; exp: number } | null = null

async function getAccessToken(): Promise<string | null> {
  const sa = loadSA()
  if (!sa) return null
  const now = Math.floor(Date.now() / 1000)
  if (tokenCache && tokenCache.exp > now + 60) return tokenCache.token
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = { iss: sa.client_email, scope: SCOPES, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }
  const input = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claim))}`
  const jwt = `${input}.${b64url(crypto.sign('RSA-SHA256', Buffer.from(input), sa.private_key))}`
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  })
  if (!res.ok) return null
  const data = await res.json()
  if (!data.access_token) return null
  tokenCache = { token: data.access_token, exp: now + (Number(data.expires_in) || 3600) }
  return data.access_token
}

// ---- GA4 Data API ----------------------------------------------------------
async function runReport(propertyId: string, token: string, body: object) {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`GA4 runReport ${res.status}`)
  return res.json()
}

const numFmt = (n: number) => Math.round(n).toLocaleString('en-US')
const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0)
const delta = (cur: number, prev: number) => (prev > 0 ? Math.round(((cur - prev) / prev) * 1000) / 10 : (cur > 0 ? 100 : 0))
function fmtDuration(sec: number): string {
  const s = Math.round(sec)
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`
}

async function fetchGA4(propertyId: string, token: string) {
  const [kpi, vis, pages, src, dev] = await Promise.all([
    runReport(propertyId, token, {
      dateRanges: [
        { startDate: '28daysAgo', endDate: 'yesterday' },
        { startDate: '56daysAgo', endDate: '29daysAgo' },
      ],
      metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'averageSessionDuration' }],
    }),
    runReport(propertyId, token, {
      dateRanges: [{ startDate: '27daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }),
    runReport(propertyId, token, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 250,
    }),
    runReport(propertyId, token, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 6,
    }),
    runReport(propertyId, token, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    }),
  ])

  // KPIs: row 0 = current 28d, row 1 = previous 28d
  const cur = (kpi.rows?.[0]?.metricValues ?? []).map((m: { value: string }) => Number(m.value) || 0)
  const prev = (kpi.rows?.[1]?.metricValues ?? []).map((m: { value: string }) => Number(m.value) || 0)
  const kpis: Kpi[] = [
    { label: 'Users', value: numFmt(cur[0] ?? 0), delta: Math.abs(delta(cur[0] ?? 0, prev[0] ?? 0)), up: (cur[0] ?? 0) >= (prev[0] ?? 0) },
    { label: 'Sessions', value: numFmt(cur[1] ?? 0), delta: Math.abs(delta(cur[1] ?? 0, prev[1] ?? 0)), up: (cur[1] ?? 0) >= (prev[1] ?? 0) },
    { label: 'Pageviews', value: numFmt(cur[2] ?? 0), delta: Math.abs(delta(cur[2] ?? 0, prev[2] ?? 0)), up: (cur[2] ?? 0) >= (prev[2] ?? 0) },
    { label: 'Avg. engagement', value: fmtDuration(cur[3] ?? 0), delta: Math.abs(delta(cur[3] ?? 0, prev[3] ?? 0)), up: (cur[3] ?? 0) >= (prev[3] ?? 0) },
  ]

  // Visitors: fill a 28-day array keyed by GA's YYYYMMDD date so zero days show.
  const byDate = new Map<string, number>()
  for (const r of vis.rows ?? []) byDate.set(r.dimensionValues[0].value, Number(r.metricValues[0].value) || 0)
  const visitors: number[] = [...byDate.keys()].sort().map((k) => byDate.get(k) ?? 0)
  const visitorsSeries = visitors.length ? visitors : [0]

  const pageRows = pages.rows ?? []
  const allPages: { path: string; views: number }[] = pageRows.map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
    path: r.dimensionValues[0].value,
    views: Number(r.metricValues[0].value) || 0,
  }))
  // Flat overall top 7 (kept for the compact "Top pages" card).
  const maxViews = Math.max(1, ...allPages.map((p) => p.views))
  const topPages: PageStat[] = allPages.slice(0, 7).map((p) => ({ ...p, pct: pct(p.views, maxViews) }))

  // Split every viewed page by content type; each group keeps its own top 8,
  // bar widths scaled within the group, plus the group's total pageviews.
  const buckets = new Map<PageType, { path: string; views: number }[]>()
  for (const p of allPages) {
    const t = pageType(p.path)
    if (!buckets.has(t)) buckets.set(t, [])
    buckets.get(t)!.push(p)
  }
  const GROUP_ORDER: PageType[] = ['blog', 'venue', 'category', 'area', 'home', 'other']
  const topPagesByType: PageGroup[] = GROUP_ORDER
    .filter((t) => buckets.has(t))
    .map((t) => {
      const rows = buckets.get(t)!.sort((a, b) => b.views - a.views)
      const total = rows.reduce((s, r) => s + r.views, 0)
      const gMax = Math.max(1, ...rows.map((r) => r.views))
      return { type: t, label: PAGE_TYPE_LABEL[t], total, pages: rows.slice(0, 8).map((r) => ({ ...r, pct: pct(r.views, gMax) })) }
    })

  const srcRows = src.rows ?? []
  const srcTotal = srcRows.reduce((a: number, r: { metricValues: { value: string }[] }) => a + (Number(r.metricValues[0].value) || 0), 0)
  const sources = srcRows.map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }, i: number) => ({
    label: r.dimensionValues[0].value,
    pct: pct(Number(r.metricValues[0].value) || 0, srcTotal),
    color: SOURCE_COLORS[i % SOURCE_COLORS.length],
  }))

  const devRows = dev.rows ?? []
  const devTotal = devRows.reduce((a: number, r: { metricValues: { value: string }[] }) => a + (Number(r.metricValues[0].value) || 0), 0)
  const devices = devRows.map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
    label: r.dimensionValues[0].value.replace(/^\w/, (c: string) => c.toUpperCase()),
    pct: pct(Number(r.metricValues[0].value) || 0, devTotal),
  }))

  return { kpis, visitors: visitorsSeries, topPages, topPagesByType, sources, devices }
}

// ---- Search Console API ----------------------------------------------------
function isoDaysAgo(days: number): string {
  const d = new Date(Date.now() - days * 86400000)
  return d.toISOString().slice(0, 10)
}

type GscApiRow = { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }
const fmtGsc = (r: GscApiRow): GscRow => ({
  key: r.keys?.[0] ?? '',
  clicks: numFmt(r.clicks || 0),
  impressions: numFmt(r.impressions || 0),
  ctr: `${((r.ctr || 0) * 100).toFixed(1)}%`,
  position: (r.position || 0).toFixed(1),
})

async function fetchGSC(token: string): Promise<Search | null> {
  const site = process.env.GSC_SITE_URL
  if (!site) return null
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`
  const range = { startDate: isoDaysAgo(28), endDate: isoDaysAgo(1) }
  const query = async (body: object) => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.ok ? res.json() : null
  }
  const [sum, byQuery, byPage] = await Promise.all([
    query({ ...range, dimensions: [] }),
    query({ ...range, dimensions: ['query'], rowLimit: 10 }),
    query({ ...range, dimensions: ['page'], rowLimit: 10 }),
  ])
  if (!sum) return null
  const row = sum.rows?.[0]
  const summary = row
    ? {
        clicks: numFmt(row.clicks || 0),
        impressions: numFmt(row.impressions || 0),
        ctr: `${((row.ctr || 0) * 100).toFixed(1)}%`,
        position: (row.position || 0).toFixed(1),
      }
    : { clicks: '0', impressions: '0', ctr: '0%', position: '-' }
  return {
    ...summary,
    queries: (byQuery?.rows ?? []).map(fmtGsc),
    pages: (byPage?.rows ?? []).map(fmtGsc),
  }
}

// ---- public entry (cached hourly) ------------------------------------------
async function fetchLive(): Promise<AnalyticsData | null> {
  const token = await getAccessToken()
  if (!token) return null
  const propertyId = process.env.GA4_PROPERTY_ID
  // GA4 and Search Console are fetched independently so one failing (a wrong
  // property id, missing access, an API hiccup) never blanks out the other.
  const ga = propertyId ? await fetchGA4(propertyId, token).catch(() => null) : null
  const search = await fetchGSC(token).catch(() => null)
  if (!ga && !search) return null
  return {
    live: true,
    kpis: ga?.kpis ?? EMPTY.kpis,
    visitors: ga?.visitors ?? EMPTY.visitors,
    topPages: ga?.topPages ?? [],
    topPagesByType: ga?.topPagesByType ?? [],
    sources: ga?.sources ?? [],
    devices: ga?.devices ?? [],
    search: search ?? null,
  }
}

const getCached = unstable_cache(fetchLive, ['admin-analytics-v2'], { revalidate: 3600, tags: ['analytics'] })

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    const live = await getCached()
    return live ?? EMPTY
  } catch {
    return EMPTY
  }
}
