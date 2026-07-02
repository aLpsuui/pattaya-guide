// ============================================================================
// UPLOAD VENUE IMAGES  →  Supabase `venues` storage bucket
//
// The DB (venues.image_url + venue_photos.url) references venue photos at
//   venues/<slug>/<filename>.jpg
// The local source files are flat and .webp:
//   Pattaya-Tum-Gorseller-Resized/venues/Resized/<filename>.webp
// We upload each local .webp under the EXACT key the DB expects (.jpg path),
// with content-type image/webp — browsers render by content-type, so the .jpg
// key serving webp bytes works. Bucket structure (slug subfolders) is created
// implicitly by the key path.
//
//   $env:SUPABASE_SERVICE_ROLE_KEY = "<service_role key>"
//   node scripts/upload-venue-images.mjs --dry-run   # report mapping only
//   node scripts/upload-venue-images.mjs             # create bucket + upload
// ============================================================================

import { createClient } from '@supabase/supabase-js'
import { readdir, readFile } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'

const SUPABASE_URL = 'https://jsxtfodewyvxnplbtfnv.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SRC = 'C:\\Users\\DELL5280 Touch\\Desktop\\Pattaya-Tum-Gorseller-Resized\\venues\\Resized'
const BUCKET = 'venues'
const PREFIX = '/storage/v1/object/public/venues/'
const DRY_RUN = process.argv.includes('--dry-run')

if (!SERVICE_KEY) { console.error('Set $env:SUPABASE_SERVICE_ROLE_KEY first.'); process.exit(1) }
const s = createClient(SUPABASE_URL, SERVICE_KEY)

// Collect every DB url that points at the venues bucket.
async function collectKeys() {
  const keys = new Set()
  // venue_photos.url (paginated)
  let from = 0
  const page = 1000
  for (;;) {
    const { data, error } = await s.from('venue_photos').select('url').range(from, from + page - 1)
    if (error) throw new Error('venue_photos: ' + error.message)
    if (!data.length) break
    for (const r of data) if (r.url && r.url.includes(PREFIX)) keys.add(r.url.split(PREFIX)[1])
    if (data.length < page) break
    from += page
  }
  // venues.image_url
  const { data: v, error: ve } = await s.from('venues').select('image_url')
  if (ve) throw new Error('venues: ' + ve.message)
  for (const r of v) if (r.image_url && r.image_url.includes(PREFIX)) keys.add(r.image_url.split(PREFIX)[1])
  return [...keys]
}

async function run() {
  const keys = await collectKeys()
  // index local files by base name (extension-insensitive)
  const entries = (await readdir(SRC, { withFileTypes: true })).filter((e) => e.isFile())
  const byBase = new Map()
  for (const e of entries) byBase.set(basename(e.name, extname(e.name)).toLowerCase(), e.name)

  const plan = []
  const missing = []
  for (const key of keys) {
    const base = basename(key, extname(key)).toLowerCase() // slug/filename -> filename base
    const local = byBase.get(base)
    if (local) plan.push({ key, local })
    else missing.push(key)
  }

  const usedBases = new Set(plan.map((p) => basename(p.key, extname(p.key)).toLowerCase()))
  const extra = [...byBase.keys()].filter((b) => !usedBases.has(b))

  console.log(`DB venue keys: ${keys.length} | matched local: ${plan.length} | MISSING local: ${missing.length}`)
  console.log(`local files: ${entries.length} | not referenced by DB: ${extra.length}`)
  if (missing.length) { console.log('\n--- DB keys with NO local file ---'); missing.forEach((k) => console.log('  ' + k)) }

  if (DRY_RUN) { console.log('\nDry run — nothing uploaded.'); return }

  // create bucket (public); ignore "already exists"
  const { error: be } = await s.storage.createBucket(BUCKET, { public: true })
  console.log(be ? `createBucket: ${be.message}` : 'created venues bucket (public)')

  let done = 0, failed = 0
  for (const { key, local } of plan) {
    const body = await readFile(join(SRC, local))
    const { error } = await s.storage.from(BUCKET).upload(key, body, { contentType: 'image/webp', upsert: true })
    if (error) { failed++; console.error(`  FAILED ${key}: ${error.message}`) }
    else { done++; if (done % 25 === 0 || done === plan.length) console.log(`  uploaded ${done}/${plan.length}`) }
  }
  console.log(`\nDone. Uploaded ${done}, failed ${failed}, missing-local ${missing.length}.`)
  if (failed) process.exit(1)
}

run().catch((e) => { console.error('\nFailed:', e.message); process.exit(1) })
