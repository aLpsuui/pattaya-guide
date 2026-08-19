// Haftalık AI SEO analizi. GSC (Search Console) verisini okur, site envanterini
// Supabase'den alır, Claude Sonnet 5 ile önceliklendirilmiş öneriler üretir ve
// public.seo_recommendations tablosuna yazar. Admin /admin/analytics bunu gösterir.
//
// Çalıştırma:  node scripts/seo-analysis.mjs
// Gerekli env (.env.local):  GOOGLE_SA_KEY_B64, GSC_SITE_URL,
//   SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL, ANTHROPIC_API_KEY
//
// Not: GSC anahtarları (GOOGLE_SA_KEY_B64, GSC_SITE_URL) şu an sadece PROD
// Vercel'de. Yerelden çalıştırmak için Vercel > gotopattaya > Settings > Env'den
// bu ikisini .env.local'e kopyala.

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

// ---- .env.local yükle -------------------------------------------------------
function loadEnv() {
  const p = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(p)) return
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    if (!line || /^\s*#/.test(line) || !line.includes('=')) continue
    const i = line.indexOf('=')
    const k = line.slice(0, i).trim()
    let v = line.slice(i + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    if (!(k in process.env)) process.env[k] = v
  }
}
loadEnv()

const die = (m) => { console.error('HATA: ' + m); process.exit(1) }
const SA_B64 = process.env.GOOGLE_SA_KEY_B64
const GSC_SITE = process.env.GSC_SITE_URL
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANTHROPIC = process.env.ANTHROPIC_API_KEY
if (!SA_B64 || !GSC_SITE) die('GOOGLE_SA_KEY_B64 / GSC_SITE_URL eksik (.env.local). Vercel PROD env\'den kopyala.')
if (!SB_URL || !SB_KEY) die('Supabase env eksik.')
if (!ANTHROPIC) die('ANTHROPIC_API_KEY eksik.')

// ---- Google service-account JWT -> access token -----------------------------
const b64url = (b) => (typeof b === 'string' ? Buffer.from(b) : b).toString('base64url')
async function getToken() {
  const j = JSON.parse(Buffer.from(SA_B64, 'base64').toString('utf8'))
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = { iss: j.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }
  const input = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claim))}`
  const jwt = `${input}.${b64url(crypto.sign('RSA-SHA256', Buffer.from(input), j.private_key))}`
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  })
  if (!res.ok) die(`Google token alınamadı (${res.status}). Service account GSC'de Viewer mı?`)
  return (await res.json()).access_token
}

const isoDaysAgo = (d) => new Date(Date.now() - d * 86400000).toISOString().slice(0, 10)

async function fetchGSC(token) {
  const site = encodeURIComponent(GSC_SITE)
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`
  const range = { startDate: isoDaysAgo(28), endDate: isoDaysAgo(1) }
  const q = async (body) => {
    const r = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...range, ...body }) })
    if (!r.ok) die(`GSC sorgusu başarısız (${r.status}).`)
    return (await r.json()).rows || []
  }
  const [byQuery, byPage] = await Promise.all([
    q({ dimensions: ['query'], rowLimit: 250 }),
    q({ dimensions: ['page'], rowLimit: 250 }),
  ])
  return { byQuery, byPage, range }
}

// ---- site envanteri (keyword -> sayfa eşleme + içerik boşluğu için) ----------
async function fetchInventory() {
  const H = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
  const get = async (q) => { const r = await fetch(`${SB_URL}/rest/v1/${q}`, { headers: H }); return r.ok ? r.json() : [] }
  const [venues, blogs] = await Promise.all([
    get('venues?select=name,slug,neighborhood,categories(slug)&is_active=eq.true&limit=1000'),
    get('blog_posts?select=title,slug&is_published=eq.true&limit=300'),
  ])
  return { venues, blogs }
}

const round = (n, d = 1) => Math.round((n || 0) * 10 ** d) / 10 ** d
const compactRows = (rows, n) => rows
  .slice()
  .sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
  .slice(0, n)
  .map((r) => ({ k: r.keys?.[0] || '', imp: Math.round(r.impressions || 0), clk: Math.round(r.clicks || 0), ctr: round((r.ctr || 0) * 100), pos: round(r.position || 0) }))

async function callClaude(gsc, inv) {
  const queries = compactRows(gsc.byQuery, 60)
  const pages = compactRows(gsc.byPage, 45).map((p) => ({ ...p, k: p.k.replace(/^https?:\/\/[^/]+/, '') || '/' }))
  const venueList = inv.venues.map((v) => `${v.name} | /venues/${v.slug} | ${v.categories?.slug || '-'} | ${v.neighborhood || '-'}`).join('\n')
  const blogList = inv.blogs.map((b) => `${b.title} | /blog/${b.slug}`).join('\n')

  const system = `Sen kıdemli bir teknik SEO analistisin. Site: gotopattaya.com — Pattaya (Tayland) gezi rehberi, İngilizce + Rusça. Görevin: Google Search Console verisini analiz edip HANGİ SAYFANIN NASIL geliştirileceğine dair önceliklendirilmiş, somut, uygulanabilir öneriler üretmek. TÜRKÇE yaz. Sadece geçerli JSON döndür.

Fırsat mantığı:
- Yüksek gösterim + düşük CTR (ör. <%2 ve pozisyon iyi) → başlık/meta açıklaması zayıf, yeniden yaz.
- Pozisyon 8–20 (2. sayfa) + iyi gösterim → 1. sayfaya itmek için içerik derinliği + iç link + hedef keyword güçlendirme.
- Yüksek gösterimli keyword'ün karşılığı olan sayfa YOKSA → kind:"gap", yeni blog/venue öner.
- Zaten iyi olanları (yüksek CTR + pozisyon 1–3) önerme.

Çıktı JSON şeması:
{
  "summary": "<2-4 cümle genel durum, TR>",
  "items": [
    {
      "priority": 1|2|3,              // 1=yüksek etki, 3=düşük
      "kind": "improve"|"gap",        // mevcut sayfa iyileştir | yeni içerik boşluğu
      "page_path": "/en/... veya null (gap ise null olabilir)",
      "page_type": "blog"|"venue"|"category"|"area"|"home"|"other",
      "target": "<ilgili keyword ya da sayfa başlığı>",
      "issue": "<tek cümle sorun teşhisi>",
      "impressions": <sayı>, "clicks": <sayı>, "ctr": <yüzde sayı>, "position": <sayı>,
      "action": "<somut ne yapılmalı, 1-2 cümle, uygulanabilir>"
    }
  ]
}
En fazla 15 madde, en yüksek etkiden başla. Sadece JSON.`

  const user = `SON 28 GÜN — SEARCH CONSOLE

TOP QUERIES (k=keyword, imp=gösterim, clk=tık, ctr=%, pos=ortalama pozisyon):
${JSON.stringify(queries)}

TOP PAGES (k=path):
${JSON.stringify(pages)}

MEVCUT VENUE SAYFALARI (Ad | path | kategori | bölge):
${venueList}

MEVCUT BLOG SAYFALARI (Başlık | path):
${blogList}

Yukarıdaki keyword'leri mevcut sayfalarla eşleştir; iyileştirme ve içerik-boşluğu önerileri üret.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-5', max_tokens: 4000, system, messages: [{ role: 'user', content: user }] }),
  })
  const j = await res.json()
  if (j.error) die(`Claude hatası: ${JSON.stringify(j.error)}`)
  const text = (j.content || []).find((c) => c.type === 'text')?.text || ''
  const a = text.indexOf('{'), b = text.lastIndexOf('}')
  if (a < 0 || b < 0) die('Claude JSON döndürmedi:\n' + text.slice(0, 300))
  let parsed
  try { parsed = JSON.parse(text.slice(a, b + 1)) } catch { die('Claude JSON parse edilemedi:\n' + text.slice(0, 300)) }
  return parsed
}

async function writeReport(parsed, gsc) {
  const totImp = gsc.byQuery.reduce((s, r) => s + (r.impressions || 0), 0)
  const totClk = gsc.byQuery.reduce((s, r) => s + (r.clicks || 0), 0)
  const row = {
    period_start: gsc.range.startDate, period_end: gsc.range.endDate,
    model: 'claude-sonnet-5',
    summary: parsed.summary || '',
    items: Array.isArray(parsed.items) ? parsed.items : [],
    meta: { total_impressions: Math.round(totImp), total_clicks: Math.round(totClk), query_count: gsc.byQuery.length, page_count: gsc.byPage.length },
  }
  const res = await fetch(`${SB_URL}/rest/v1/seo_recommendations`, {
    method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'content-type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(row),
  })
  if (!res.ok) die(`Supabase yazma başarısız (${res.status}): ${await res.text()}`)
  return row
}

// ---- main -------------------------------------------------------------------
console.log('1/4 Google token…')
const token = await getToken()
console.log('2/4 GSC + envanter…')
const [gsc, inv] = await Promise.all([fetchGSC(token), fetchInventory()])
console.log(`   GSC: ${gsc.byQuery.length} query, ${gsc.byPage.length} page · envanter: ${inv.venues.length} venue, ${inv.blogs.length} blog`)
console.log('3/4 Claude Sonnet 5 analiz…')
const parsed = await callClaude(gsc, inv)
console.log(`   ${parsed.items?.length || 0} öneri üretildi`)
console.log('4/4 Supabase yazılıyor…')
await writeReport(parsed, gsc)
console.log('✓ TAMAM. /admin/analytics → AI SEO sekmesinde görünür.')
