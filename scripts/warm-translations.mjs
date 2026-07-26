// Toplu ön-çeviri: blog_posts (title/description/page_html) → content_translations.
// İlk ziyaretçi/build çeviriyi beklemesin diye cache'i önden doldurur.
//
// Çalıştırma (proje kökünde):  node scripts/warm-translations.mjs
// .env.local'deki SUPABASE_SERVICE_ROLE_KEY + ANTHROPIC_API_KEY kullanılır.
// Idempotent: kaynak hash'i eşleşen alanlar atlanır (yeniden çevrilmez).

import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const MODEL = 'claude-sonnet-5' // lib/i18n/translateContent.ts ile aynı tutulmalı
const LOCALE = 'ru'
const __dirname = dirname(fileURLToPath(import.meta.url))

// .env.local'i basitçe oku (node bunu otomatik yüklemez).
function loadEnv() {
  try {
    const txt = readFileSync(join(__dirname, '..', '.env.local'), 'utf8')
    for (const line of txt.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
    }
  } catch { /* env zaten set edilmiş olabilir */ }
}
loadEnv()

const SUPA_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const API_KEY = process.env.ANTHROPIC_API_KEY
if (!SUPA_URL || !SERVICE_KEY || !API_KEY) {
  console.error('Eksik env: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / ANTHROPIC_API_KEY')
  process.exit(1)
}

const db = createClient(SUPA_URL, SERVICE_KEY, { auth: { persistSession: false } })
const sha256 = (t) => createHash('sha256').update(t).digest('hex')

async function translate(text, isHtml) {
  const guidance = isHtml
    ? 'The input is an HTML fragment. Translate ONLY the human-readable text content into Russian. Keep every HTML tag, attribute, class, id, URL, href, src, inline style, and <script> block byte-for-byte unchanged. Do not add, remove, reorder, or reformat any markup.'
    : 'Translate the input into Russian.'
  const system =
    'You are a professional English→Russian translator for a Pattaya (Thailand) travel guide. ' +
    'Produce natural, fluent Russian aimed at travellers. Keep proper nouns, brand names, venue names, and place names in their original Latin form (do not transliterate). ' +
    guidance +
    ' Output ONLY the translation — no preamble, quotes, notes, or explanation.'

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 32000, stream: true, system, messages: [{ role: 'user', content: text }] }),
  })
  if (!res.ok || !res.body) throw new Error(`API ${res.status}: ${await res.text()}`)

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  let out = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop() || ''
    for (const line of lines) {
      const l = line.trim()
      if (!l.startsWith('data:')) continue
      const payload = l.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      try {
        const evt = JSON.parse(payload)
        if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') out += evt.delta.text
      } catch { /* atla */ }
    }
  }
  return out.trim()
}

async function warmField(table, id, field, source) {
  if (!source || !String(source).trim()) return 'skip'
  const source_hash = sha256(source)
  const { data: cached } = await db
    .from('content_translations')
    .select('source_hash').eq('source_table', table).eq('source_id', id).eq('field', field).eq('locale', LOCALE).maybeSingle()
  if (cached && cached.source_hash === source_hash) return 'cached'

  const value = await translate(source, /<[a-z][\s\S]*>/i.test(source))
  await db.from('content_translations').upsert(
    { source_table: table, source_id: id, field, locale: LOCALE, source_hash, value, updated_at: new Date().toISOString() },
    { onConflict: 'source_table,source_id,field,locale' },
  )
  return 'translated'
}

async function main() {
  const { data: posts, error } = await db
    .from('blog_posts').select('id, slug, title, description, page_html').eq('is_published', true)
  if (error) { console.error(error); process.exit(1) }
  console.log(`${posts.length} yayınlanmış blog bulundu.\n`)

  let i = 0
  for (const p of posts) {
    i++
    const stats = {}
    for (const field of ['title', 'description', 'page_html']) {
      try {
        stats[field] = await warmField('blog_posts', p.id, field, p[field])
      } catch (e) {
        stats[field] = 'ERR: ' + e.message
      }
    }
    console.log(`[${i}/${posts.length}] ${p.slug} → ${JSON.stringify(stats)}`)
  }
  console.log('\nBitti.')
}

main().catch((e) => { console.error(e); process.exit(1) })
