// Import gyms (-> yoga-and-fitness) and adrenaline activities (-> thinks-to-do)
// from the assembled .det-yf detail HTML pages. Photos live on cdn.gotopattaya.com.
//   node scripts/import-fitness-adventure.mjs --dry
//   node scripts/import-fitness-adventure.mjs
import { createClient } from '@supabase/supabase-js'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const db = createClient('https://jsxtfodewyvxnplbtfnv.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY)
const DRY = process.argv.includes('--dry')
const ROOT = 'C:\\Users\\DELL5280 Touch\\Desktop\\Go To Pattaya - Final'
const CDN = 'https://cdn.gotopattaya.com/Venues/'
const TTD = '6653922a-531d-491e-8a37-91b821118741' // Things To Do
const EAT = '7829fe06-7c18-487a-9df7-0c2442043ce5' // Eat & Drinks
const SOURCES = [
  { dir: 'gyms', category_id: '6ca72f37-8334-41a2-8a79-118ae0f85925' },       // Yoga & Fitness
  { dir: 'adrenaline', category_id: TTD },
  { dir: 'tours', category_id: TTD },
  { dir: 'diving-snorkeling', category_id: TTD },
  { dir: 'rentals', category_id: TTD },
  { dir: 'temples-culture', category_id: TTD },
  { dir: 'restaurants', category_id: EAT },
  { dir: 'cafes', category_id: EAT },
]

const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ', '&middot;': '·', '&rsquo;': '’', '&ldquo;': '“', '&rdquo;': '”', '&hellip;': '…', '&deg;': '°' }
const decode = (s) => (s || '').replace(/&[a-z#0-9]+;/gi, (m) => ENT[m] ?? m)
const strip = (s) => decode((s || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
const nn = (s) => { const t = (s || '').trim(); return t === '' ? null : t }
const m1 = (re, s) => { const m = re.exec(s); return m ? m[1] : null }
const all = (re, s) => { const out = []; let m; while ((m = re.exec(s))) out.push(m); return out }
const cdnify = (src) => CDN + src.split('/').pop()

function parse(html, slug, category_id) {
  const name = strip(m1(/<h1 id="det-h1">([\s\S]*?)<\/h1>/, html)) || slug
  const tagline = strip(m1(/<p class="det-yf__tagline">([\s\S]*?)<\/p>/, html))
  const description = nn(decode(m1(/<meta name="description" content="([^"]*)"/, html) || ''))

  // breadcrumb type = last <a> text
  const crumb = m1(/(<nav class="[^"]*det-yf__crumb[^"]*"[\s\S]*?<\/nav>)/, html) || ''
  const links = all(/<a [^>]*>([\s\S]*?)<\/a>/g, crumb).map((x) => strip(x[1])).filter((t) => t && t !== 'Home')
  const venueType = links.length ? links[links.length - 1] : null

  // hero meta
  const metaBlock = m1(/<div class="det-yf__meta">([\s\S]*?)<\/div>\s*<\/div>/, html) || m1(/<div class="det-yf__meta">([\s\S]*?)<\/div>/, html) || ''
  const locRaw = strip(m1(/<span class="det-yf__metaitem">[\s\S]*?pg-pin[\s\S]*?<\/svg>([\s\S]*?)<\/span>/, metaBlock))
  const hours = strip(m1(/pill--success[\s\S]*?pg-clock[\s\S]*?<\/svg>([\s\S]*?)<\/span>/, metaBlock))

  // gallery photos (exclude the "more" carousel) -> CDN
  const gal = m1(/aria-label="Photo gallery"([\s\S]*?)<\/section>/, html) || ''
  const photos = all(/<img[^>]+src="([^"]*\/(?:images\/Venues|Venues)\/[^"]+)"[^>]*alt="([^"]*)"/g, gal)
    .map((x, i) => ({ url: cdnify(x[1]), alt: strip(x[2]), caption: strip(x[2]), sort_order: i }))
  const image_url = photos.length ? photos[0].url : null

  // address / nearby
  const address = nn(strip((m1(/<b>Address<\/b>([\s\S]*?)<\/span>/, html) || '').replace(/<br\s*\/?>/gi, ', ')).replace(/\s*,(\s*,)+/g, ',').replace(/\s+,/g, ','))
  const nearby = nn(strip(m1(/<b>Nearby<\/b>([\s\S]*?)<\/span>/, html)))

  // about
  const prose = m1(/<div class="det-yf__prose">([\s\S]*?)<\/div>/, html) || ''
  const about = all(/<p>([\s\S]*?)<\/p>/g, prose).map((x) => strip(x[1])).filter(Boolean)

  // maps + website
  const mapsQ = m1(/maps\.google\.com\/\?q=([^"&]+)/, html) || m1(/google\.com\/maps\?q=([^"&]+)/, html)
  const maps_query = mapsQ ? decodeURIComponent(mapsQ.replace(/\+/g, ' ')) : null
  const secHref = m1(/<a class="btn btn--secondary"[^>]*href="([^"]+)"/, html)
  const website = secHref && !/google\.com\/search/.test(secHref) ? secHref : null

  // child rows
  const quickFacts = all(/<div class="det-yf__fact">([\s\S]*?)<\/div>/g, html).map((x, i) => ({
    icon: m1(/#(pg-[\w-]+)/, x[1]) || 'pg-info', value: strip(m1(/<b>([\s\S]*?)<\/b>/, x[1])), label: strip(m1(/<span>([\s\S]*?)<\/span>/, x[1])), sort_order: i,
  })).filter((f) => f.value)

  const facilities = all(/<div class="det-yf__fac-item">([\s\S]*?)<\/div>/g, html).map((x, i) => ({
    icon: m1(/#(pg-[\w-]+)/, x[1]) || 'pg-check', label: strip(m1(/<b>([\s\S]*?)<\/b>/, x[1])), sort_order: i,
  })).filter((f) => f.label)

  const table = m1(/<table class="det-yf__tt">([\s\S]*?)<\/table>/, html) || ''
  const menuItems = []
  let section = null, mi = 0
  for (const tr of all(/<tr([^>]*)>([\s\S]*?)<\/tr>/g, table)) {
    if (/det-yf__cat/.test(tr[1])) { section = strip(tr[2]); continue }
    const tds = all(/<td[^>]*>([\s\S]*?)<\/td>/g, tr[2]).map((t) => strip(t[1]))
    if (tds.length < 2 || /^Item$/i.test(tds[0])) continue
    menuItems.push({ section, name: tds[0], detail: tds[1] || null, price: tds[tds.length - 1] || null, is_featured: false, sort_order: mi++ })
  }

  const qs = all(/<button class="q"[^>]*>([\s\S]*?)<svg/g, html).map((x) => strip(x[1]))
  const ans = all(/<div class="a-in">([\s\S]*?)<\/div>/g, html).map((x) => strip(x[1]))
  const faqs = qs.map((q, i) => ({ question: q, answer: ans[i] || '', sort_order: i })).filter((f) => f.question && f.answer)

  const bring = m1(/<ul class="det-yf__bring">([\s\S]*?)<\/ul>/, html) || ''
  const highlights = all(/<li>([\s\S]*?)<\/li>/g, bring).map((x, i) => ({ label: strip(x[1]), sort_order: i })).filter((h) => h.label)

  // rating: from a rate span, else from a pg-star quick fact ("5.0 / 5" + "X reviews")
  let rating = null, reviewCount = null
  const rate = strip(m1(/<span class="rate">([\s\S]*?)<\/span>/, html))
  const starFact = quickFacts.find((f) => f.icon === 'pg-star' && /[\d.]+\s*\/\s*5/.test(f.value || ''))
  const rsrc = rate || (starFact ? `${starFact.value} ${starFact.label}` : '')
  if (rsrc) {
    const rm = rsrc.match(/([\d.]+)/); if (rm) rating = parseFloat(rm[1])
    const cm = rsrc.match(/([\d,]+)\s*review/i); if (cm) reviewCount = parseInt(cm[1].replace(/,/g, ''), 10)
  }
  const neighborhood = locRaw ? (locRaw.includes('·') ? locRaw.split('·').pop().trim() : locRaw) : null

  return {
    venue: {
      slug, name, category_id, venue_type: nn(venueType), tagline: nn(tagline), description,
      about: about.length ? about : null, neighborhood: nn(neighborhood), address, nearby,
      hours: nn(hours), website, maps_query: nn(maps_query), rating, review_count: reviewCount,
      image_url, is_active: true, status: 'published', locally_verified: true,
    },
    photos, quickFacts, facilities, menuItems, faqs, highlights,
  }
}

// ---- run ----
const parsed = []
for (const src of SOURCES) {
  const dir = path.join(ROOT, src.dir)
  const files = (await readdir(dir)).filter((f) => f.endsWith('.html') && !f.startsWith('_') && !f.startsWith('.'))
  for (const f of files) {
    const slug = f.replace(/\.html$/, '')
    const html = await readFile(path.join(dir, f), 'utf8')
    parsed.push({ src: src.dir, ...parse(html, slug, src.category_id) })
  }
  console.log(`${src.dir}: ${files.length} files`)
}
// Dedupe by slug (a venue can appear in two folders, e.g. adrenaline + tours).
const seen = new Set()
const dups = []
const deduped = parsed.filter((p) => {
  if (seen.has(p.venue.slug)) { dups.push(p.venue.slug); return false }
  seen.add(p.venue.slug); return true
})
if (dups.length) console.log(`Dropped ${dups.length} duplicate slugs: ${dups.join(', ')}`)
parsed.length = 0
parsed.push(...deduped)
console.log(`Parsed ${parsed.length} venues · ${parsed.filter((p) => p.photos.length).length} with photos`)

if (DRY) {
  for (const slug of ['battle-conquer-gym', 'atv-buggy-adventures-pattaya']) {
    const p = parsed.find((x) => x.venue.slug === slug)
    if (!p) { console.log(`\n(${slug} not found)`); continue }
    console.log(`\n=== ${slug} (${p.src}) ===`)
    console.log(JSON.stringify({ venue: p.venue, _counts: { photos: p.photos.length, qf: p.quickFacts.length, fac: p.facilities.length, menu: p.menuItems.length, faq: p.faqs.length, hl: p.highlights.length } }, null, 2))
  }
  process.exit(0)
}

const rows = parsed.map((p) => p.venue)
const { data: up, error: ue } = await db.from('venues').upsert(rows, { onConflict: 'slug' }).select('id,slug')
if (ue) { console.error('venues upsert:', ue.message); process.exit(1) }
console.log(`Upserted ${up.length} venues`)
const idBySlug = Object.fromEntries(up.map((v) => [v.slug, v.id]))
const ids = Object.values(idBySlug)

const child = { venue_photos: [], venue_quick_facts: [], venue_facilities: [], venue_menu_items: [], venue_faqs: [], venue_highlights: [] }
for (const p of parsed) {
  const vid = idBySlug[p.venue.slug]; if (!vid) continue
  p.photos.forEach((r) => child.venue_photos.push({ venue_id: vid, ...r }))
  p.quickFacts.forEach((r) => child.venue_quick_facts.push({ venue_id: vid, ...r }))
  p.facilities.forEach((r) => child.venue_facilities.push({ venue_id: vid, ...r }))
  p.menuItems.forEach((r) => child.venue_menu_items.push({ venue_id: vid, ...r }))
  p.faqs.forEach((r) => child.venue_faqs.push({ venue_id: vid, ...r }))
  p.highlights.forEach((r) => child.venue_highlights.push({ venue_id: vid, ...r }))
}
for (const t of Object.keys(child)) await db.from(t).delete().in('venue_id', ids)
async function bulk(t, list) {
  for (let i = 0; i < list.length; i += 400) {
    const { error } = await db.from(t).insert(list.slice(i, i + 400))
    if (error) { console.error(`${t}:`, error.message); process.exit(1) }
  }
}
for (const t of Object.keys(child)) { await bulk(t, child[t]); console.log(`  ${t}: ${child[t].length}`) }
console.log('DONE')
