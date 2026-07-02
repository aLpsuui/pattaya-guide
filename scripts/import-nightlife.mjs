// Import 77 Pattaya nightlife venues into the DB from the pre-built
// `_bodies/<slug>.page.html` sources. Photos already live on cdn.gotopattaya.com.
// The existing /venues/[slug] (spa/det-yf) template renders everything.
//   node scripts/import-nightlife.mjs --dry   (parse + print, no writes)
//   node scripts/import-nightlife.mjs         (create category + import)
import { createClient } from '@supabase/supabase-js'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const db = createClient('https://jsxtfodewyvxnplbtfnv.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY)
const DRY = process.argv.includes('--dry')
const DIR = 'C:\\Users\\DELL5280 Touch\\Desktop\\Go To Pattaya - Final\\nightclubs\\_bodies'
const CDN = 'https://cdn.gotopattaya.com/Venues/'

// ---- helpers ----
const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ', '&middot;': '·', '&rsquo;': '’', '&ldquo;': '“', '&rdquo;': '”', '&hellip;': '…' }
const decode = (s) => s.replace(/&[a-z#0-9]+;/gi, (m) => ENT[m] ?? m)
const strip = (s) => decode((s || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
const nn = (s) => { const t = (s || '').trim(); return t === '' ? null : t }
const m1 = (re, s) => { const m = re.exec(s); return m ? m[1] : null }
const all = (re, s) => { const out = []; let m; while ((m = re.exec(s))) out.push(m); return out }

const TYPE = { Nightclubs: 'Nightclub', Bars: 'Bar', 'Go-go bars': 'Go-go bar', Lounges: 'Lounge', 'Night markets': 'Night market' }
const cdnify = (src) => CDN + src.split('/').pop()

function parse(html, slug) {
  // comments
  const title = strip(m1(/<!--TITLE:\s*([\s\S]*?)-->/, html) || '')
  const meta = strip(m1(/<!--META:\s*([\s\S]*?)-->/, html) || '')
  let photos = []
  const pm = m1(/<!--PHOTOS:\s*(\[[\s\S]*?\])\s*-->/, html)
  if (pm) { try { photos = JSON.parse(pm) } catch {} }

  const name = strip(m1(/<h1 id="det-h1">([\s\S]*?)<\/h1>/, html)) || title.split('—')[0].trim()
  const tagline = strip(m1(/<p class="det-nc__tagline">([\s\S]*?)<\/p>/, html))

  // breadcrumb type = last <a> text in the crumb nav
  const crumb = m1(/(<nav class="[^"]*det-nc__crumb[^"]*"[\s\S]*?<\/nav>)/, html) || ''
  const links = all(/<a [^>]*>([\s\S]*?)<\/a>/g, crumb).map((x) => strip(x[1])).filter((t) => t && t !== 'Home' && t !== 'Nightlife')
  const rawType = links.length ? links[links.length - 1] : null
  const venueType = rawType ? (TYPE[rawType] || rawType.replace(/s$/, '')) : 'Nightclub'

  // meta chips
  const metaBlock = m1(/<div class="det-nc__meta">([\s\S]*?)<\/div>\s*<\/div>/, html) || m1(/<div class="det-nc__meta">([\s\S]*?)<\/div>/, html) || ''
  const locRaw = strip(m1(/<span class="det-nc__metaitem">[\s\S]*?pg-pin[\s\S]*?<\/svg>([\s\S]*?)<\/span>/, metaBlock))
  const hours = strip(m1(/pill--success[\s\S]*?pg-clock[\s\S]*?<\/svg>([\s\S]*?)<\/span>/, metaBlock))
  const rate = strip(m1(/<span class="rate">([\s\S]*?)<\/span>/, metaBlock))
  let rating = null, reviewCount = null
  if (rate) {
    const rm = rate.match(/([\d.]+)/); if (rm) rating = parseFloat(rm[1])
    const cm = rate.match(/([\d,]+)\s*review/i); if (cm) reviewCount = parseInt(cm[1].replace(/,/g, ''), 10)
  }
  // neighborhood: segment after the last "·" of the location chip
  const neighborhood = locRaw ? (locRaw.includes('·') ? locRaw.split('·').pop().trim() : locRaw) : null

  // address / nearby
  const address = nn(strip((m1(/<b>Address<\/b>([\s\S]*?)<\/span>/, html) || '').replace(/<br\s*\/?>/gi, ', ')).replace(/\s*,(\s*,)+/g, ',').replace(/\s+,/g, ','))
  const nearby = nn(strip(m1(/<b>Nearby<\/b>([\s\S]*?)<\/span>/, html)))

  // about prose
  const prose = m1(/<div class="det-nc__prose">([\s\S]*?)<\/div>/, html) || ''
  const about = all(/<p>([\s\S]*?)<\/p>/g, prose).map((x) => strip(x[1])).filter(Boolean)

  // maps query + website
  const mapsQ = m1(/maps\.google\.com\/\?q=([^"&]+)/, html)
  const mapsQuery = mapsQ ? decodeURIComponent(mapsQ.replace(/\+/g, ' ')) : null
  const secHref = m1(/<a class="btn btn--secondary"[^>]*href="([^"]+)"/, html)
  let website = null
  if (secHref && !/google\.com\/search/.test(secHref)) website = secHref

  const image_url = photos.length ? cdnify(photos[0].src) : null

  // child rows
  const quickFacts = all(/<div class="det-nc__fact">([\s\S]*?)<\/div>/g, html).map((x, i) => ({
    icon: m1(/#(pg-[\w-]+)/, x[1]) || 'pg-info',
    value: strip(m1(/<b>([\s\S]*?)<\/b>/, x[1])),
    label: strip(m1(/<span>([\s\S]*?)<\/span>/, x[1])),
    sort_order: i,
  })).filter((f) => f.value)

  const facilities = all(/<div class="det-nc__fac-item">([\s\S]*?)<\/div>/g, html).map((x, i) => ({
    icon: m1(/#(pg-[\w-]+)/, x[1]) || 'pg-check',
    label: strip(m1(/<b>([\s\S]*?)<\/b>/, x[1])),
    sort_order: i,
  })).filter((f) => f.label)

  // music/entry table
  const table = m1(/<table class="det-nc__tt">([\s\S]*?)<\/table>/, html) || ''
  const menuItems = []
  let section = null, mi = 0
  for (const tr of all(/<tr([^>]*)>([\s\S]*?)<\/tr>/g, table)) {
    const cls = tr[1], inner = tr[2]
    if (/det-nc__cat/.test(cls)) { section = strip(inner); continue }
    const tds = all(/<td[^>]*>([\s\S]*?)<\/td>/g, inner).map((t) => strip(t[1]))
    if (tds.length < 2 || /^Item$/i.test(tds[0])) continue
    menuItems.push({ section, name: tds[0], detail: tds[1] || null, price: tds[2] || null, is_featured: false, sort_order: mi++ })
  }

  // faqs (questions + answers zipped by order)
  const qs = all(/<button class="q"[^>]*>([\s\S]*?)<svg/g, html).map((x) => strip(x[1]))
  const ans = all(/<div class="a-in">([\s\S]*?)<\/div>/g, html).map((x) => strip(x[1]))
  const faqs = qs.map((q, i) => ({ question: q, answer: ans[i] || '', sort_order: i })).filter((f) => f.question && f.answer)

  // highlights
  const bring = m1(/<ul class="det-nc__bring">([\s\S]*?)<\/ul>/, html) || ''
  const highlights = all(/<li>([\s\S]*?)<\/li>/g, bring).map((x, i) => ({ label: strip(x[1]), sort_order: i })).filter((h) => h.label)

  return {
    venue: {
      slug, name, venue_type: venueType, tagline: nn(tagline), description: nn(meta),
      about: about.length ? about : null, neighborhood: nn(neighborhood), address,
      nearby, hours: nn(hours), website, maps_query: nn(mapsQuery),
      rating, review_count: reviewCount, image_url,
      is_active: true, status: 'published', locally_verified: true,
    },
    photos: photos.map((p, i) => ({ url: cdnify(p.src), alt: strip(p.cap), caption: strip(p.cap), sort_order: i })),
    quickFacts, facilities, menuItems, faqs, highlights,
  }
}

// ---- run ----
const files = (await readdir(DIR)).filter((f) => f.endsWith('.page.html') && !f.startsWith('_'))
const parsed = []
for (const f of files) {
  const slug = f.replace(/\.page\.html$/, '')
  const html = await readFile(path.join(DIR, f), 'utf8')
  parsed.push(parse(html, slug))
}
console.log(`Parsed ${parsed.length} nightlife venues`)
const wp = parsed.filter((p) => p.photos.length).length
console.log(`  ${wp} with photos, ${parsed.length - wp} without`)

if (DRY) {
  const rich = parsed.find((p) => p.venue.slug === 'world-house-pattaya')
  const sparse = parsed.find((p) => p.venue.slug === 'shooters-pattaya') || parsed.find((p) => !p.photos.length)
  console.log('\n=== RICH (world-house) ===')
  console.log(JSON.stringify({ ...rich, photos: rich.photos.length, _counts: { qf: rich.quickFacts.length, fac: rich.facilities.length, menu: rich.menuItems.length, faq: rich.faqs.length, hl: rich.highlights.length } }, null, 2).slice(0, 2600))
  console.log('\n=== SPARSE ===')
  console.log(JSON.stringify({ venue: sparse.venue, _counts: { photos: sparse.photos.length, qf: sparse.quickFacts.length, menu: sparse.menuItems.length, faq: sparse.faqs.length, hl: sparse.highlights.length } }, null, 2))
  process.exit(0)
}

// category
let { data: cat } = await db.from('categories').select('id').eq('slug', 'nightlife').single()
if (!cat) {
  const ins = await db.from('categories').insert({ name_en: 'Nightlife', slug: 'nightlife' }).select('id').single()
  if (ins.error) { console.error('category:', ins.error.message); process.exit(1) }
  cat = ins.data
  console.log('Created Nightlife category', cat.id)
} else console.log('Nightlife category exists', cat.id)

const rows = parsed.map((p) => ({ ...p.venue, category_id: cat.id }))
const { data: up, error: ue } = await db.from('venues').upsert(rows, { onConflict: 'slug' }).select('id,slug')
if (ue) { console.error('venues upsert:', ue.message); process.exit(1) }
console.log(`Upserted ${up.length} venues`)
const idBySlug = Object.fromEntries(up.map((v) => [v.slug, v.id]))
const ids = Object.values(idBySlug)

// rebuild child rows
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
