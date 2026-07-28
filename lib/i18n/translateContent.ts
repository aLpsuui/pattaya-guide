import 'server-only'
import { createHash } from 'node:crypto'
import { db } from '@/lib/admin/db'
import type { Locale } from './config'

// DB içeriğini (blog/venue/kategori) hedef dile çevirir + `content_translations`
// tablosuna cache'ler. İlk /ru render'ında çevrilir; sonrası cache'ten okunur.
// Kaynak (EN) metin değişirse hash uymaz → yeniden çevrilir.
//
// Çeviri modeli: kalite/maliyet dengesi için Sonnet 5. Tek satır — maliyet/kalite
// tercihi değişirse buradan değiştir (örn. 'claude-haiku-4-5' ucuz, 'claude-opus-4-8' en kaliteli).
const MODEL = 'claude-sonnet-5'
const API_URL = 'https://api.anthropic.com/v1/messages'

// 'static' = kod içindeki sabit HTML blokları (ör. areas sayfası) — DB'den gelmez.
// 'venue_types' = venue_type etiketleri (ör. "Water Park"), değerin kendisiyle
// anahtarlanır (tekrar eden tipler bir kez çevrilir, tüm kartlarda paylaşılır).
export type SourceTable = 'blog_posts' | 'venues' | 'categories' | 'static' | 'venue_types'

// Aynı locale için birden çok metni çevirir; tekrar edenleri bir kez çevirip
// haritada döndürür (kartlarda çokça tekrarlanan venue_type/kategori için).
// id, metnin kendisidir (sabit doğal anahtar). Boş/çeviri gerekmeyen → aynen.
export async function translateMany(
  table: SourceTable,
  field: string,
  values: (string | null | undefined)[],
  locale: Locale,
): Promise<Map<string, string>> {
  const unique = [...new Set(values.filter((v): v is string => !!v && !!v.trim()))]
  const entries = await Promise.all(
    unique.map(async (v) => [v, await getTranslated(table, v, field, v, locale)] as const),
  )
  return new Map(entries)
}

function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex')
}

// Anthropic Messages API'yi (raw fetch, projedeki adminAnalytics deseni gibi —
// SDK yok) streaming ile çağırır. HTML fragment ise sadece görünür metni çevirir,
// tüm etiket/attribute/URL'yi aynen korur. Başarısızlıkta null döner (çağıran
// İngilizce'ye düşer).
async function translate(text: string, isHtml: boolean): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  const guidance = isHtml
    ? 'The input is an HTML fragment. Translate ONLY the human-readable text content into Russian. Keep every HTML tag, attribute, class, id, URL, href, src, inline style, and <script> block byte-for-byte unchanged. Do not add, remove, reorder, or reformat any markup.'
    : 'Translate the input into Russian.'
  const system =
    'You are a professional English→Russian translator for a Pattaya (Thailand) travel guide. ' +
    'Produce natural, fluent Russian aimed at travellers. Keep proper nouns, brand names, venue names, and place names in their original Latin form (do not transliterate). ' +
    guidance +
    ' Output ONLY the translation — no preamble, quotes, notes, or explanation.'

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 32000,
        stream: true,
        system,
        messages: [{ role: 'user', content: text }],
      }),
    })
    if (!res.ok || !res.body) return null

    // SSE ayrıştır: content_block_delta / text_delta parçalarını birleştir.
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
          if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
            out += evt.delta.text as string
          }
        } catch {
          /* eksik/malformed SSE satırı — atla */
        }
      }
    }
    return out.trim() || null
  } catch {
    return null
  }
}

// Tek bir alanı çevrilmiş haliyle döndürür. locale === 'en' ya da boş metin →
// aynen döner. Cache'te güncel hash varsa oradan, yoksa çevirip cache'e yazar.
export async function getTranslated(
  table: SourceTable,
  id: string,
  field: string,
  sourceText: string | null | undefined,
  locale: Locale,
): Promise<string> {
  const source = sourceText ?? ''
  if (locale === 'en' || !source.trim()) return source

  const source_hash = sha256(source)

  const { data: cached } = await db
    .from('content_translations')
    .select('value, source_hash')
    .eq('source_table', table)
    .eq('source_id', id)
    .eq('field', field)
    .eq('locale', locale)
    .maybeSingle()
  if (cached && cached.source_hash === source_hash && cached.value) return cached.value

  const translated = await translate(source, /<[a-z][\s\S]*>/i.test(source))
  if (!translated) return source // API hatası → İngilizce'ye düş

  await db.from('content_translations').upsert(
    {
      source_table: table,
      source_id: id,
      field,
      locale,
      source_hash,
      value: translated,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'source_table,source_id,field,locale' },
  )
  return translated
}
