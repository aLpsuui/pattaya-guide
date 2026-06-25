// Extract the bespoke `.det-area` editorial area-guide pages into the app:
//   - app/areas/[slug]/area-guide.css   (shared scoped CSS, from the <style> block)
//   - app/areas/[slug]/area-guides.json  ({ slug: { name, html } })
// Images: images/Venues/* -> CDN; other images/* -> Supabase assets (.jpg).
import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SRC = 'C:\\Users\\DELL5280 Touch\\Desktop\\Go To Pattaya - Final\\areas'
const OUT = 'C:\\Users\\DELL5280 Touch\\Desktop\\pg\\pattaya-guide\\app\\areas\\[slug]'
const CDN = 'https://cdn.gotopattaya.com/'
const ASSETS = 'https://cdn.gotopattaya.com/Assets/'

const ROUTE = {
  '01-homepage-v5.html': '/',
  'pillar-areas.html': '/areas',
  'pillar-things-to-do.html': '/things-to-do',
  'pillar-eat-drink.html': '/eat-and-drinks',
  'pillar-eat-drinks.html': '/eat-and-drinks',
  'pillar-wellness-beauty.html': '/wellness-and-beauty',
  'pillar-yoga-fitness.html': '/yoga-and-fitness',
  'pillar-fitness-muay-thai.html': '/yoga-and-fitness',
  'pillar-nightlife.html': '/nightlife',
  'plan-my-trip.html': '/plan-my-trip',
  'blog.html': '/blog',
}

function rewrite(html) {
  let out = html
  // images (always carry the ../ prefix)
  out = out.replace(/\.\.\/images\/Venues\//g, CDN + 'Venues/')
  out = out.replace(/\.\.\/images\/([^"')]+?)\.(webp|png|jpg|jpeg)/g, (_m, name) => `${ASSETS}${name}.webp`)
  // internal links — the ../ prefix is inconsistent in the source, so make it optional
  out = out.replace(/href="(?:\.\.\/)?detail-areas-([a-z-]+)\.html"/g, 'href="/areas/$1"')
  out = out.replace(/href="(?:\.\.\/)?([^"/]+\.html)"/g, (_m, file) => {
    if (ROUTE[file]) return `href="${ROUTE[file]}"`
    const v = file.match(/^([a-z0-9-]+)\.html$/)
    return v ? `href="/venues/${v[1]}"` : `href="/${file.replace(/\.html$/, '')}"`
  })
  return out
}

const files = (await readdir(SRC)).filter((f) => f.startsWith('detail-areas-') && f.endsWith('.html'))
const guides = {}
let css = null
for (const f of files) {
  const slug = f.replace(/^detail-areas-/, '').replace(/\.html$/, '')
  const raw = await readFile(path.join(SRC, f), 'utf8')
  if (css === null) {
    const m = raw.match(/<style>([\s\S]*?)<\/style>/)
    css = m ? m[1].trim() : ''
  }
  const body = raw.match(/<main class="det-area">[\s\S]*?<\/main>/)
  const name = (raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, slug])[1].replace(/<[^>]+>/g, '').trim()
  if (!body) { console.log(`! no <main> in ${f}`); continue }
  // The inline icon sprite sits before <main> — keep it so <use href="#pg-…"> resolves.
  const sprite = (raw.match(/<svg aria-hidden="true" style="position:absolute[\s\S]*?<\/svg>/) || [''])[0]
  guides[slug] = { name, html: sprite + rewrite(body[0]) }
  console.log(`${slug}: ${guides[slug].html.length} chars`)
}

await writeFile(path.join(OUT, 'area-guides.json'), JSON.stringify(guides, null, 0), 'utf8')
await writeFile(path.join(OUT, 'area-guide.css'), `/* Extracted from the bespoke .det-area area-guide pages. Scoped under .det-area. */\n${css}\n`, 'utf8')
console.log(`\nWrote ${Object.keys(guides).length} guides + area-guide.css`)
