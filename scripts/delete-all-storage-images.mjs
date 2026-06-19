// ============================================================================
// DELETE ALL STORAGE IMAGES  (Storage API — the SQL approach is blocked)
//
// Recursively lists and deletes every object in the `venues` and `assets`
// buckets. Direct DELETE from storage.objects is forbidden by Supabase, so we
// go through the Storage API, which requires the SERVICE ROLE key (the anon key
// cannot delete).
//
// ⚠️  DESTRUCTIVE & IRREVERSIBLE.
//
// Run:
//   $env:SUPABASE_URL="https://jsxtfodewyvxnplbtfnv.supabase.co"
//   $env:SUPABASE_SERVICE_ROLE_KEY="<your service_role key>"
//   node scripts/delete-all-storage-images.mjs
//
// Get the service_role key: Supabase Dashboard → Settings → API → service_role.
// Pass --dry-run to only list what WOULD be deleted without deleting.
// ============================================================================

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKETS = ['venues', 'assets']
const DRY_RUN = process.argv.includes('--dry-run')

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Recursively collect every file path under `prefix` in a bucket.
async function listAll(bucket, prefix = '') {
  const files = []
  const pageSize = 100
  let offset = 0

  for (;;) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: pageSize, offset, sortBy: { column: 'name', order: 'asc' } })

    if (error) throw new Error(`list ${bucket}/${prefix}: ${error.message}`)
    if (!data || data.length === 0) break

    for (const entry of data) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name
      // Folders come back with id === null; recurse into them.
      if (entry.id === null) {
        files.push(...(await listAll(bucket, path)))
      } else {
        files.push(path)
      }
    }

    if (data.length < pageSize) break
    offset += pageSize
  }

  return files
}

async function run() {
  for (const bucket of BUCKETS) {
    console.log(`\n── ${bucket} ──`)
    const paths = await listAll(bucket)
    console.log(`Found ${paths.length} file(s).`)

    if (paths.length === 0) continue
    if (DRY_RUN) {
      paths.forEach((p) => console.log(`  would delete: ${p}`))
      continue
    }

    // Storage API caps remove() batches; chunk to be safe.
    const chunkSize = 100
    let deleted = 0
    for (let i = 0; i < paths.length; i += chunkSize) {
      const batch = paths.slice(i, i + chunkSize)
      const { error } = await supabase.storage.from(bucket).remove(batch)
      if (error) throw new Error(`remove from ${bucket}: ${error.message}`)
      deleted += batch.length
      console.log(`  deleted ${deleted}/${paths.length}`)
    }
  }

  console.log(DRY_RUN ? '\nDry run complete — nothing deleted.' : '\nDone. All storage images deleted.')
}

run().catch((err) => {
  console.error('\nFailed:', err.message)
  process.exit(1)
})
