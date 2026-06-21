// Import partner restaurants -> venues (+ venue_photos, venue_highlights).
// Reads the PowerShell-dumped restaurants.json (clean UTF-8). Images already
// live on cdn.gotopattaya.com, so URLs are stored as-is.
import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'

const db = createClient('https://jsxtfodewyvxnplbtfnv.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY)
const CAT = '7829fe06-7c18-487a-9df7-0c2442043ce5' // eat-and-drinks
const SRC = 'C:\\Users\\DELL5280 Touch\\Desktop\\pg\\restaurants.json'

const nn = (v) => (v == null || String(v).trim() === '' ? null : String(v).trim())

function normUrl(v) {
  if (!v) return null
  let t = String(v).trim()
  if (/\s/.test(t) && !/^https?:\/\//.test(t) && !/^\/\//.test(t)) t = t.split(/\s/)[0]
  if (t.startsWith('@')) return null
  if (/^https?:\/\//.test(t)) return t
  if (/^\/\//.test(t)) return 'https:' + t
  if (/^[a-z0-9.\-]+\.[a-z]{2,}(\/|$)/i.test(t)) return 'https://' + t
  return null
}

const AREAS = [
  ['Wong Amat', 'Wong Amat'], ['Wongamat', 'Wong Amat'], ['Na Kluea', 'Naklua'], ['Naklua', 'Naklua'],
  ['Pratamnak', 'Pratumnak Hill'], ['Pratumnak', 'Pratumnak Hill'], ['Phra Tamnak', 'Pratumnak Hill'],
  ['Na Jomtien', 'Na Jomtien'], ['Najomtien', 'Na Jomtien'], ['Na Chom Thian', 'Na Jomtien'], ['Jomtien', 'Jomtien'],
  ['Bang Saray', 'Bang Saray'], ['Bang Sare', 'Bang Saray'], ['Bangsaen', 'Bang Saen'], ['Bang Saen', 'Bang Saen'], ['Saen Suk', 'Bang Saen'],
  ['Si Racha', 'Si Racha'], ['Sri Racha', 'Si Racha'], ['Sriracha', 'Si Racha'], ['Sattahip', 'Sattahip'],
  ['North Pattaya', 'North Pattaya'], ['Central Pattaya', 'Central Pattaya'], ['South Pattaya', 'South Pattaya'],
  ['Bang Lamung', 'Bang Lamung'],
]
function parseArea(loc, notes, city) {
  const s = `${loc || ''} ${notes || ''}`
  for (const [k, v] of AREAS) if (s.includes(k)) return v
  return nn(city)
}

function priceInfo(pr) {
  const out = { tier: null, from: null }
  if (!pr) return out
  const t = String(pr).trim()
  const lead = t.match(/^(฿{1,3})(?!\d)/)
  if (lead) out.tier = lead[1]
  let m = t.match(/฿\s*([\d,]+)/) || t.match(/([\d,]{3,})/)
  if (m) {
    const n = parseInt(m[1].replace(/,/g, ''), 10)
    out.from = n
    if (!out.tier) out.tier = n < 400 ? '฿' : n < 900 ? '฿฿' : '฿฿฿'
  }
  if (!out.tier) {
    if (/budget|affordable|cheap|economical/i.test(t)) out.tier = '฿'
    else if (/upper|premium|fine|luxury|expensive/i.test(t)) out.tier = '฿฿฿'
    else out.tier = '฿฿'
  }
  return out
}

let raw = await readFile(SRC, 'utf8')
if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1)
const rows = JSON.parse(raw)
console.log(`Loaded ${rows.length} restaurants`)

const venues = rows.map((r) => {
  const p = priceInfo(r.price_range)
  const rm = String(r.rating_detail || '').match(/([\d.]+)/)
  const cm = String(r.rating_detail || '').match(/\(([\d,]+)/)
  const about = [r.concept, r.menu_highlights].map((x) => (x ? String(x).trim() : '')).filter(Boolean)
  return {
    slug: String(r.slug).trim(),
    name: String(r.name).trim(),
    category_id: CAT,
    venue_type: nn(r.category),
    tagline: nn(r.summary),
    description: nn(r.summary),
    about: about.length ? about : null,
    neighborhood: parseArea(r.location, r.notes, r.city),
    address: nn(r.location),
    hours: nn(r.hours),
    phone: nn(r.phone),
    website: normUrl(r.website),
    facebook_url: normUrl(r.facebook),
    price_from: p.from,
    price_from_label: 'per person',
    price_range: p.tier,
    rating: rm ? parseFloat(rm[1]) : null,
    review_count: cm ? parseInt(cm[1].replace(/,/g, ''), 10) : null,
    image_url: nn(r.cover_image),
    is_active: true,
    status: 'published',
    locally_verified: false,
  }
})

const { data: up, error: ue } = await db.from('venues').upsert(venues, { onConflict: 'slug' }).select('id,slug')
if (ue) { console.error('venue upsert:', ue.message); process.exit(1) }
console.log(`Upserted ${up.length} venues`)
const idBySlug = Object.fromEntries(up.map((v) => [v.slug, v.id]))

const photos = []
const highs = []
for (const r of rows) {
  const vid = idBySlug[String(r.slug).trim()]
  if (!vid) continue
  let gal = []
  try { gal = JSON.parse(r.gallery) } catch {}
  gal.forEach((u, i) => photos.push({ venue_id: vid, url: u, alt: String(r.name).trim(), sort_order: i }))
  String(r.highlights || '').split(';').map((h) => h.trim()).filter(Boolean)
    .forEach((label, j) => highs.push({ venue_id: vid, label, sort_order: j }))
}

const ids = Object.values(idBySlug)
await db.from('venue_photos').delete().in('venue_id', ids)
await db.from('venue_highlights').delete().in('venue_id', ids)

async function bulk(table, list) {
  for (let i = 0; i < list.length; i += 400) {
    const { error } = await db.from(table).insert(list.slice(i, i + 400))
    if (error) { console.error(`${table}:`, error.message); process.exit(1) }
  }
}
await bulk('venue_photos', photos)
await bulk('venue_highlights', highs)
console.log(`Inserted ${photos.length} photos, ${highs.length} highlights`)
console.log('DONE')
