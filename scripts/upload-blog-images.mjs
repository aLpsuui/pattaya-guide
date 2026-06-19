// ============================================================================
// UPLOAD BLOG IMAGES  →  Supabase `blog` storage bucket (flat)
//
// Uploads every image in the ROOT of Pattaya-Tum-Gorseller-Resized (the venues
// subfolder is skipped) into the `blog` bucket with the same filename. The blog
// page rewrites ../Pattaya-Tum-Gorseller-Resized/<file> → .../public/blog/<file>,
// so a flat upload is exactly what the markup expects.
//
// Requires the SERVICE ROLE key (anon cannot write):
//   $env:SUPABASE_SERVICE_ROLE_KEY = "<service_role key>"
//   node upload-blog-images.mjs            # real upload
//   node upload-blog-images.mjs --dry-run  # list only, no upload
//
// The `blog` bucket must exist and be public. Create it once in the Dashboard
// (Storage → New bucket → name "blog" → Public) if it isn't there yet.
// ============================================================================

import { createClient } from '@supabase/supabase-js'
import { readdir, readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jsxtfodewyvxnplbtfnv.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SRC_DIR = 'C:\\Users\\DELL5280 Touch\\Desktop\\Pattaya-Tum-Gorseller-Resized'
const BUCKET = 'blog'
const DRY_RUN = process.argv.includes('--dry-run')

const CONTENT_TYPES = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
}

if (!SERVICE_KEY) {
  console.error('Set $env:SUPABASE_SERVICE_ROLE_KEY first (Dashboard -> Settings -> API -> service_role).')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function run() {
  // Root-level files only — withFileTypes lets us skip the `venues` subfolder.
  const entries = await readdir(SRC_DIR, { withFileTypes: true })
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => CONTENT_TYPES[extname(name).toLowerCase()]) // images only; skips .DS_Store

  console.log(`Found ${files.length} image(s) in root of ${SRC_DIR} (venues subfolder skipped).`)

  if (DRY_RUN) {
    files.forEach((f) => console.log(`  would upload: ${BUCKET}/${f}`))
    console.log(`\nDry run — nothing uploaded.`)
    return
  }

  let done = 0
  let failed = 0
  for (const name of files) {
    const body = await readFile(join(SRC_DIR, name))
    const contentType = CONTENT_TYPES[extname(name).toLowerCase()]
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(name, body, { contentType, upsert: true })

    if (error) {
      failed++
      console.error(`  FAILED ${name}: ${error.message}`)
    } else {
      done++
      if (done % 25 === 0 || done === files.length) console.log(`  uploaded ${done}/${files.length}`)
    }
  }

  console.log(`\nDone. Uploaded ${done}, failed ${failed}.`)
  if (failed) process.exit(1)
}

run().catch((err) => {
  console.error('\nFailed:', err.message)
  process.exit(1)
})
