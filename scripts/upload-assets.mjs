// ============================================================================
// UPLOAD ASSETS  →  Supabase `assets` storage bucket
//
// The site pages (areas, things-to-do, wellness, yoga, homepage hero) request
// images from the `assets` bucket under specific names/extensions (.jpg/.jpeg/
// .png/.webp). The local source files are all .webp. This script reads every
// /public/assets/<name> reference in the code, finds the matching local file by
// base name (extension-insensitive, then alphanumeric-normalized as a fallback),
// and uploads the local bytes under the EXACT referenced key. Browsers render by
// content-type, so a .webp served under a .jpg key works fine.
//
//   $env:SUPABASE_SERVICE_ROLE_KEY = "<service_role key>"
//   node scripts/upload-assets.mjs            # real upload
//   node scripts/upload-assets.mjs --dry-run  # report mapping only
// ============================================================================

import { createClient } from '@supabase/supabase-js'
import { readdir, readFile } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jsxtfodewyvxnplbtfnv.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const APP_DIR = 'C:\\Users\\DELL5280 Touch\\Desktop\\pg\\pattaya-guide'
const SRC_DIR = 'C:\\Users\\DELL5280 Touch\\Desktop\\Pattaya-Tum-Gorseller-Resized'
const BUCKET = 'assets'
const DRY_RUN = process.argv.includes('--dry-run')

const CONTENT_TYPES = {
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.gif': 'image/gif', '.avif': 'image/avif',
}

if (!SERVICE_KEY) {
  console.error('Set $env:SUPABASE_SERVICE_ROLE_KEY first.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

// Recursively read all source files under a dir for scanning code references.
async function walk(dir) {
  const out = []
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue
      out.push(...(await walk(p)))
    } else if (/\.(tsx|ts|css|sql)$/.test(e.name)) {
      out.push(p)
    }
  }
  return out
}

async function run() {
  // 1. Collect unique /public/assets/<name> references from code.
  const codeFiles = await walk(APP_DIR)
  const refs = new Set()
  for (const f of codeFiles) {
    const text = await readFile(f, 'utf8')
    for (const m of text.matchAll(/\/public\/assets\/([^"'\s)]+)/g)) refs.add(m[1])
  }

  // 2. Index local files by exact base name and normalized base name.
  const entries = (await readdir(SRC_DIR, { withFileTypes: true })).filter((e) => e.isFile())
  const byBase = new Map()
  const byNorm = new Map()
  for (const e of entries) {
    const base = basename(e.name, extname(e.name)).toLowerCase()
    byBase.set(base, e.name)
    byNorm.set(norm(base), e.name)
  }

  // 3. Resolve each reference to a local file.
  const plan = []
  const unresolved = []
  for (const ref of refs) {
    const base = basename(ref, extname(ref)).toLowerCase()
    const local = byBase.get(base) || byNorm.get(norm(base))
    if (local) plan.push({ key: ref, local })
    else unresolved.push(ref)
  }

  console.log(`References: ${refs.size} | resolved: ${plan.length} | unresolved: ${unresolved.length}`)
  if (unresolved.length) console.log('UNRESOLVED:', unresolved.join(', '))

  if (DRY_RUN) {
    plan.sort((a, b) => a.key.localeCompare(b.key)).forEach((p) => console.log(`  ${p.key}  <=  ${p.local}`))
    console.log('\nDry run — nothing uploaded.')
    return
  }

  let done = 0, failed = 0
  for (const { key, local } of plan) {
    const body = await readFile(join(SRC_DIR, local))
    const contentType = CONTENT_TYPES[extname(local).toLowerCase()] || 'application/octet-stream'
    const { error } = await supabase.storage.from(BUCKET).upload(key, body, { contentType, upsert: true })
    if (error) { failed++; console.error(`  FAILED ${key}: ${error.message}`) }
    else { done++; console.log(`  uploaded ${key}`) }
  }
  console.log(`\nDone. Uploaded ${done}, failed ${failed}.`)
  if (failed) process.exit(1)
}

run().catch((err) => { console.error('\nFailed:', err.message); process.exit(1) })
