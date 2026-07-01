// Sync venues with the Google Maps export (Go-To-Pattaya-Tum-Mekanlar-MAPS-API).
// Matches each CSV row to an existing venue by normalised name and updates
// rating, review_count, latitude, longitude (and google_place_id if the column
// exists). Never creates or deletes rows.
//
//   node scripts/sync-google-maps.mjs --dry            (match + print, no writes)
//   node scripts/sync-google-maps.mjs                  (apply updates)
//   node scripts/sync-google-maps.mjs --file=path.csv  (custom CSV path)
import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'

// ---- env ----
const env = Object.fromEntries(
  (await readFile(new URL('../.env.local', import.meta.url), 'utf8'))
    .split(/\r?\n/).filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY = process.argv.includes('--dry')
const fileArg = process.argv.find((a) => a.startsWith('--file='))
const CSV_PATH = fileArg ? fileArg.slice('--file='.length) : new URL('./_maps.csv', import.meta.url)

// ---- tiny CSV parser (handles quoted fields with commas/newlines) ----
function parseCSV(text) {
  const rows = []; let row = [], field = '', q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++ } else q = false }
      else field += c
    } else if (c === '"') q = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c === '\r') { /* skip */ }
    else field += c
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  return rows
}

// ---- name normalisation for matching ----
const norm = (s) => (s || '')
  .toLowerCase()
  .normalize('NFKD').replace(/[̀-ͯ]/g, '')      // strip accents
  .replace(/&/g, ' and ')
  .replace(/\b(pattaya|thailand|chonburi|chon buri|co\.?,? ?ltd\.?|ltd|the)\b/g, ' ')
  .replace(/\([^)]*\)/g, ' ')                              // drop (…)
  .replace(/[^a-z0-9]+/g, ' ')
  .replace(/\s+/g, ' ').trim()

const num = (s) => { const n = parseFloat(String(s).replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : null }
const int = (s) => { const n = parseInt(String(s).replace(/[^0-9]/g, ''), 10); return Number.isFinite(n) ? n : null }

// ---- load CSV ----
const raw = await readFile(CSV_PATH, 'utf8')
const rows = parseCSV(raw)
const header = rows.shift().map((h) => h.trim())
const col = (name) => header.findIndex((h) => h.toLowerCase() === name.toLowerCase())
const iName = col('Mekan'), iRev = col('Yorum Sayisi'), iRate = col('Puan')
const iLat = col('Enlem'), iLng = col('Boylam'), iPid = col('Place ID')

const csv = rows.filter((r) => r[iName]).map((r) => ({
  name: r[iName].trim(),
  key: norm(r[iName]),
  review_count: int(r[iRev]),
  rating: num(r[iRate]),
  latitude: num(r[iLat]),
  longitude: num(r[iLng]),
  place_id: (r[iPid] || '').trim() || null,
}))
console.log(`CSV rows: ${csv.length}`)

// ---- load venues ----
const { data: venues, error } = await db.from('venues').select('id, name, slug, rating, review_count, latitude, longitude').limit(2000)
if (error) { console.error(error); process.exit(1) }
console.log(`Venues in DB: ${venues.length}`)

// detect google_place_id column
let hasPid = false
{
  const probe = await db.from('venues').select('google_place_id').limit(1)
  hasPid = !probe.error
}
console.log(`google_place_id column: ${hasPid ? 'yes' : 'no (rating/reviews/coords only)'}`)

// ---- build lookup (normalised name -> venue). Skip ambiguous duplicate keys. ----
const byKey = new Map(); const dupe = new Set()
for (const v of venues) {
  const k = norm(v.name)
  if (byKey.has(k)) dupe.add(k); else byKey.set(k, v)
}

let matched = 0, updated = 0, unmatched = []
const sample = []
for (const c of csv) {
  const v = byKey.get(c.key)
  if (!v || dupe.has(c.key)) { unmatched.push(c.name); continue }
  matched++
  const patch = {}
  if (c.rating != null && c.rating !== v.rating) patch.rating = c.rating
  if (c.review_count != null && c.review_count !== v.review_count) patch.review_count = c.review_count
  if (c.latitude != null && c.latitude !== v.latitude) patch.latitude = c.latitude
  if (c.longitude != null && c.longitude !== v.longitude) patch.longitude = c.longitude
  if (hasPid && c.place_id) patch.google_place_id = c.place_id
  if (Object.keys(patch).length === 0) continue
  if (sample.length < 12) sample.push(`  ${v.slug}: ${JSON.stringify(patch)}`)
  if (!DRY) {
    const { error: e } = await db.from('venues').update(patch).eq('id', v.id)
    if (e) { console.error(`  FAIL ${v.slug}:`, e.message); continue }
  }
  updated++
}

console.log(`\nMatched venues: ${matched} / ${csv.length} CSV rows`)
console.log(`${DRY ? 'Would update' : 'Updated'}: ${updated}`)
console.log('Sample changes:'); console.log(sample.join('\n'))
console.log(`\nUnmatched CSV rows: ${unmatched.length}`)
console.log(unmatched.slice(0, 40).map((n) => '  · ' + n).join('\n'))
if (DRY) console.log('\n(dry run — no writes. Re-run without --dry to apply.)')
