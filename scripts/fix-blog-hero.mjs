// Repair blog_posts.hero_image: the imported value points at a non-existent
// gotopattaya.com URL. The real featured image is the first <img> in page_html
// (which lives in the `blog` storage bucket). Rewrite hero_image to that.
import { createClient } from '@supabase/supabase-js'

const URL = 'https://jsxtfodewyvxnplbtfnv.supabase.co'
const s = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const BLOG = `${URL}/storage/v1/object/public/blog/`
const DRY = process.argv.includes('--dry-run')

const { data, error } = await s.from('blog_posts').select('id,slug,page_html,hero_image')
if (error) { console.error(error.message); process.exit(1) }

let updated = 0, skipped = 0
for (const p of data) {
  const m = (p.page_html || '').match(/<img[^>]+src="\.\.\/[^/]+\/([^"]+)"/)
  if (!m) { skipped++; console.log('  no img:', p.slug); continue }
  const newUrl = BLOG + m[1]
  if (p.hero_image === newUrl) { skipped++; continue }
  if (DRY) { console.log(`  ${p.slug}  ->  ${m[1]}`); updated++; continue }
  const { error: e } = await s.from('blog_posts').update({ hero_image: newUrl }).eq('id', p.id)
  if (e) console.error('  FAIL', p.slug, e.message); else updated++
}
console.log(`\n${DRY ? 'DRY ' : ''}done. updated ${updated}, skipped ${skipped}, total ${data.length}`)
