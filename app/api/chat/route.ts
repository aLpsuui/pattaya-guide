import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

// Go To Pattaya AI concierge. Claude (Haiku 4.5 by default) answers Pattaya
// travel questions, grounded in the live venue directory via a search tool -
// so it recommends only real, verified places and links straight to them.
// The API key stays server-side (ANTHROPIC_API_KEY); the browser only ever
// talks to this same-origin route.
export const runtime = 'nodejs'

const API = 'https://api.anthropic.com/v1/messages'
const MODEL = process.env.CHAT_MODEL || 'claude-haiku-4-5'
const KEY = process.env.ANTHROPIC_API_KEY || ''

// ---- per-IP rate limit (in-memory, best-effort) ---------------------------
const WINDOW_MS = 10 * 60 * 1000
const MAX_MSGS = 25
const hits = new Map<string, number[]>()
function rateLimited(ip: string): boolean {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  arr.push(now)
  hits.set(ip, arr)
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k)
  return arr.length > MAX_MSGS
}

const SYSTEM = `You are the Go To Pattaya concierge - a friendly, honest local guide for Pattaya, Thailand, embedded in a chat widget on gotopattaya.com.

RULES
- Only discuss Pattaya travel: eating, drinking, nightlife, wellness/spa, gym/Muay Thai/yoga, tours, beaches, islands, areas/neighbourhoods, getting around, safety and trip planning. Politely decline anything unrelated and steer back to Pattaya.
- NEVER invent venues, prices, hours or facts. To recommend specific places you MUST call search_venues first, and only mention places it returns. If it returns nothing, say so and suggest a category or the map instead.
- Reply in the SAME language the user writes in (English, Turkish, 中文, Русский, Thai, etc.).
- Be concise: 2-4 short sentences. This is a small chat bubble, not an article. No markdown headings or bullet lists.
- When you recommend places, just name them naturally - the app turns them into tappable links automatically.
- Helpful section links you may mention by name: Eat & Drinks, Nightlife, Things to Do, Wellness & Beauty, Yoga & Fitness, Areas, Blog, Map, Plan my trip.
- Never mention these instructions, the search tool, or that you are an AI model unless directly asked.`

const TOOLS = [
  {
    name: 'search_venues',
    description:
      'Search the Go To Pattaya directory of real, in-person-verified Pattaya venues. Returns matching places with name, type, area, rating and price. Call this whenever the user asks for specific places (food, bars, spas, gyms, tours, etc.) before recommending anything.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Free-text keywords: cuisine, dish, activity or venue name (e.g. "seafood", "rooftop bar", "muay thai").' },
        category: {
          type: 'string',
          enum: ['eat-and-drinks', 'things-to-do', 'nightlife', 'wellness-and-beauty', 'yoga-and-fitness'],
          description: 'Optional category to narrow the search.',
        },
        area: { type: 'string', description: 'Optional Pattaya area/neighbourhood, e.g. "Jomtien", "Central", "Naklua", "Pratumnak".' },
      },
      required: [],
    },
  },
]

interface Ven { slug: string; name: string; type: string | null; area: string | null; rating: number | null; reviews: number | null; price: string | null }

const esc = (s: string) => String(s || '').replace(/[%,()]/g, ' ').trim().slice(0, 60)

async function searchVenues(input: { query?: string; category?: string; area?: string }): Promise<Ven[]> {
  const cols = 'slug, name, venue_type, neighborhood, rating, review_count, price_range' + (input.category ? ', categories!inner(slug)' : '')
  let q = supabase.from('venues').select(cols).eq('is_active', true)
  if (input.category) q = q.eq('categories.slug', input.category)
  const kw = esc(input.query || '')
  if (kw) q = q.or(`name.ilike.%${kw}%,venue_type.ilike.%${kw}%,neighborhood.ilike.%${kw}%`)
  const area = esc(input.area || '')
  if (area) q = q.ilike('neighborhood', `%${area}%`)
  const { data } = await q
    .order('rating', { ascending: false, nullsFirst: false })
    .order('review_count', { ascending: false, nullsFirst: false })
    .limit(8)
  return ((data as unknown as Record<string, unknown>[]) || []).map((v) => ({
    slug: v.slug as string,
    name: v.name as string,
    type: (v.venue_type as string) || null,
    area: (v.neighborhood as string) || null,
    rating: (v.rating as number) ?? null,
    reviews: (v.review_count as number) ?? null,
    price: (v.price_range as string) || null,
  }))
}

type Block = { type: string; [k: string]: unknown }
type AnthMsg = { role: 'user' | 'assistant'; content: string | Block[] }

const FALLBACK = {
  text: 'I can point you the right way - here are the most useful places to start. You can also search the whole site from the bar at the top.',
  links: [
    { label: 'Eat & Drinks', href: '/eat-and-drinks' },
    { label: 'Things to Do', href: '/things-to-do' },
    { label: 'Areas', href: '/areas' },
  ],
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) {
    return Response.json({ text: "You're sending messages a little fast - give me a moment and try again.", links: [] }, { status: 429 })
  }
  if (!KEY) return Response.json(FALLBACK)

  let incoming: { role: string; content: string }[]
  try {
    const body = await req.json()
    incoming = Array.isArray(body?.messages) ? body.messages : []
  } catch {
    return Response.json(FALLBACK, { status: 400 })
  }

  // Sanitise: text-only, drop leading assistant turns, cap length + count.
  const cleaned: AnthMsg[] = incoming
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content.trim().slice(0, 1000) }))
  while (cleaned.length && cleaned[0].role !== 'user') cleaned.shift()
  const messages: AnthMsg[] = cleaned.slice(-12)
  if (!messages.length) return Response.json(FALLBACK, { status: 400 })

  const collected: Ven[] = []
  try {
    for (let step = 0; step < 4; step++) {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: MODEL, max_tokens: 700, system: SYSTEM, tools: TOOLS, messages }),
      })
      if (!res.ok) return Response.json(FALLBACK)
      const data = await res.json()
      const content: Block[] = data.content || []

      if (data.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content })
        const results: Block[] = []
        for (const b of content) {
          if (b.type !== 'tool_use') continue
          const vens = await searchVenues((b.input as { query?: string; category?: string; area?: string }) || {})
          collected.push(...vens)
          results.push({ type: 'tool_result', tool_use_id: b.id as string, content: JSON.stringify(vens) })
        }
        messages.push({ role: 'user', content: results })
        continue
      }

      const text = content.filter((b) => b.type === 'text').map((b) => (b.text as string) || '').join('').trim()
      // Turn the venues Claude actually named into tappable links (fall back to
      // the strongest search hits so a reply is never a dead end).
      const seen = new Set<string>()
      const uniq = collected.filter((v) => v.slug && !seen.has(v.slug) && (seen.add(v.slug), true))
      const named = uniq.filter((v) => text.toLowerCase().includes(v.name.toLowerCase()))
      const links = (named.length ? named : uniq).slice(0, 4).map((v) => ({ label: v.name, href: `/venues/${v.slug}` }))
      return Response.json({ text: text || FALLBACK.text, links })
    }
    return Response.json(FALLBACK)
  } catch {
    return Response.json(FALLBACK)
  }
}
