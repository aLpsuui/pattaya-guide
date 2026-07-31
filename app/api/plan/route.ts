import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

// Go To Pattaya AI trip planner. The user writes, in plain language, what they
// want to do in Pattaya ("3 days, want local food + watch Muay Thai, nothing
// too touristy") and Claude (Sonnet 5) turns it into a day-by-day plan grounded
// in the live venue directory: it MUST call search_venues to find real places,
// then call submit_plan once to return a structured itinerary. Only real,
// verified venues are ever recommended. The API key stays server-side; the
// browser only talks to this same-origin route.
export const runtime = 'nodejs'
// A full plan is several model turns, so give the function headroom beyond the
// default. Each individual model call is separately capped (see CALL_TIMEOUT_MS).
export const maxDuration = 60

const API = 'https://api.anthropic.com/v1/messages'
const CALL_TIMEOUT_MS = 22000
const MODEL = process.env.PLAN_MODEL || 'claude-sonnet-5'
const KEY = process.env.ANTHROPIC_API_KEY || ''

// ---- per-IP rate limit (in-memory, best-effort) ---------------------------
// A plan costs several model turns, so it's pricier than a chat message — keep
// the window tight.
const WINDOW_MS = 15 * 60 * 1000
const MAX_PLANS = 8
const hits = new Map<string, number[]>()
function rateLimited(ip: string): boolean {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  arr.push(now)
  hits.set(ip, arr)
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k)
  return arr.length > MAX_PLANS
}

const SYSTEM = `You are the Go To Pattaya trip planner - a friendly, honest local guide for Pattaya, Thailand. A traveller describes, in their own words, what they want from a trip; you turn it into a concrete day-by-day plan built ONLY from real, verified venues in our directory.

HOW YOU WORK
1. Read the request and infer: how many days (default 2 if unstated), what they want to do, their vibe (relaxed vs packed), budget, and especially whether they want mainstream tourist spots or quieter, local, "non-touristy" places.
2. Call search_venues as many times as you need (once per distinct interest/area) to gather real candidates BEFORE planning. NEVER invent venues, prices, hours or facts - only use places search_venues returns.
3. Respecting "non-touristy": each result carries a reviews count and a verified flag. When the traveller wants local / hidden / non-touristy places, prefer venues with LOWER review counts and locally-verified ones, and avoid the most heavily-reviewed tourist magnets. When they want the classic highlights, prefer the top-rated, well-reviewed ones.
4. Spread choices sensibly across the days and, where possible, group places by area so each day flows geographically.
5. When you have enough real venues, call submit_plan EXACTLY ONCE with the finished itinerary. Reference venues by their exact slug from the search results. Every itinerary item that names a place must use a real slug; use an empty venue_slug only for generic advice items (e.g. "sunset walk on the beach").

STYLE
- Write the summary, day titles, item titles, "why" notes and tips in the SAME language the traveller wrote in (English, Turkish, Русский, 中文, Thai, etc.).
- Be specific and honest - say why each place fits THIS traveller. Keep "why" to one short sentence.
- Only plan Pattaya. If the request is unrelated to a Pattaya trip, return a plan with an empty days array and a summary that politely redirects.`

const SEARCH_TOOL = {
  name: 'search_venues',
  description:
    'Search the Go To Pattaya directory of real, in-person-verified Pattaya venues. Returns matching places with slug, name, type, area, rating, reviews count, price and a verified flag. Call this (repeatedly, once per interest/area) to gather real candidates before planning.',
  input_schema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Free-text keywords: cuisine, dish, activity or venue name (e.g. "seafood", "rooftop bar", "muay thai", "island tour").' },
      category: {
        type: 'string',
        enum: ['eat-and-drinks', 'things-to-do', 'nightlife', 'wellness-and-beauty', 'yoga-and-fitness'],
        description: 'Optional category to narrow the search.',
      },
      area: { type: 'string', description: 'Optional Pattaya area/neighbourhood, e.g. "Jomtien", "Central", "Naklua", "Pratumnak".' },
    },
    required: [],
  },
}

const PLAN_TOOL = {
  name: 'submit_plan',
  description: 'Return the finished day-by-day trip plan. Call this exactly once, after gathering real venues with search_venues.',
  input_schema: {
    type: 'object',
    properties: {
      summary: { type: 'string', description: "1-2 sentences addressing the traveller's request, in their language." },
      days: {
        type: 'array',
        description: 'One entry per day of the trip.',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Short day heading, e.g. "Day 1 - Local food & Naklua".' },
            items: {
              type: 'array',
              description: 'Ordered activities for the day.',
              items: {
                type: 'object',
                properties: {
                  time: { type: 'string', description: 'When, e.g. "Morning", "Afternoon", "Evening" or "19:00".' },
                  title: { type: 'string', description: 'What to do, e.g. "Seafood dinner".' },
                  venue_slug: { type: 'string', description: 'Exact slug of a venue from search results, or "" for a generic activity.' },
                  why: { type: 'string', description: 'One short sentence on why this fits the traveller.' },
                },
                required: ['title', 'why'],
              },
            },
          },
          required: ['title', 'items'],
        },
      },
      tips: { type: 'array', description: 'Optional short practical tips.', items: { type: 'string' } },
    },
    required: ['summary', 'days'],
  },
}

// Full venue record kept server-side for rendering cards; a compact view is what
// Claude sees.
interface Ven {
  slug: string; name: string; venue_type: string | null; neighborhood: string | null
  rating: number | null; review_count: number | null; price_range: string | null
  price_from: number | null; price_from_label: string | null; locally_verified: boolean | null
  image_url: string | null
}

const esc = (s: string) => String(s || '').replace(/[%,()]/g, ' ').trim().slice(0, 60)

async function runSearch(input: { query?: string; category?: string; area?: string }, useArea: boolean): Promise<Ven[]> {
  const cols =
    'slug, name, venue_type, neighborhood, rating, review_count, price_range, price_from, price_from_label, locally_verified, image_url' +
    (input.category ? ', categories!inner(slug)' : '')
  let q = supabase.from('venues').select(cols).eq('is_active', true)
  if (input.category) q = q.eq('categories.slug', input.category)
  const kw = esc(input.query || '')
  // Inside .or() PostgREST uses * as the wildcard. Search name/type/area plus the
  // richer tagline+description so cuisine/keywords match even when venue_type is generic.
  if (kw) q = q.or(`name.ilike.*${kw}*,venue_type.ilike.*${kw}*,neighborhood.ilike.*${kw}*,tagline.ilike.*${kw}*,description.ilike.*${kw}*`)
  const area = esc(input.area || '')
  if (useArea && area) q = q.ilike('neighborhood', `%${area}%`)
  const { data } = await q
    .order('rating', { ascending: false, nullsFirst: false })
    .order('review_count', { ascending: false, nullsFirst: false })
    .limit(12)
  return ((data as unknown as Record<string, unknown>[]) || []).map((v) => ({
    slug: v.slug as string,
    name: v.name as string,
    venue_type: (v.venue_type as string) || null,
    neighborhood: (v.neighborhood as string) || null,
    rating: (v.rating as number) ?? null,
    review_count: (v.review_count as number) ?? null,
    price_range: (v.price_range as string) || null,
    price_from: (v.price_from as number) ?? null,
    price_from_label: (v.price_from_label as string) || null,
    locally_verified: (v.locally_verified as boolean) ?? null,
    image_url: (v.image_url as string) || null,
  }))
}

async function searchVenues(input: { query?: string; category?: string; area?: string }): Promise<Ven[]> {
  const withArea = await runSearch(input, true)
  if (!withArea.length && input.area) return runSearch(input, false)
  return withArea
}

// Compact view Claude sees for each venue (keeps token cost + hallucination low).
function forModel(v: Ven) {
  return {
    slug: v.slug,
    name: v.name,
    type: v.venue_type,
    area: v.neighborhood,
    rating: v.rating,
    reviews: v.review_count,
    price: v.price_range,
    verified: !!v.locally_verified,
  }
}

type Block = { type: string; [k: string]: unknown }
type AnthMsg = { role: 'user' | 'assistant'; content: string | Block[] }

interface PlanItem { time: string; title: string; why: string; venue: (Ven & { href: string }) | null }
interface PlanDay { title: string; items: PlanItem[] }
interface PlanOut { summary: string; days: PlanDay[]; tips: string[] }

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) {
    return Response.json({ error: 'rate_limited', message: 'Too many plans in a short time - give it a few minutes and try again.' }, { status: 429 })
  }
  if (!KEY) {
    // No credit / key configured yet: the feature is deployed but the model is
    // unavailable. Tell the client cleanly so it can show a friendly notice.
    return Response.json({ error: 'unavailable', message: 'The AI planner is temporarily unavailable. Please try again later.' }, { status: 503 })
  }

  let prompt = ''
  try {
    const body = await req.json()
    prompt = typeof body?.prompt === 'string' ? body.prompt.trim().slice(0, 1000) : ''
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 })
  }
  if (prompt.length < 3) return Response.json({ error: 'bad_request', message: 'Please describe what you want to do in Pattaya.' }, { status: 400 })

  const messages: AnthMsg[] = [{ role: 'user', content: prompt }]
  const collected = new Map<string, Ven>()

  try {
    for (let step = 0; step < 7; step++) {
      // Bound each model call so a slow/hanging upstream can never wedge the
      // request open — on timeout the abort throws into the catch → 503 fallback.
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), CALL_TIMEOUT_MS)
      let res: Response
      try {
        res = await fetch(API, {
          method: 'POST',
          headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
          body: JSON.stringify({ model: MODEL, max_tokens: 4000, system: SYSTEM, tools: [SEARCH_TOOL, PLAN_TOOL], messages }),
          signal: controller.signal,
        })
      } finally {
        clearTimeout(timer)
      }
      if (!res.ok) {
        const status = res.status === 400 ? 503 : 502
        return Response.json({ error: 'model_error', message: 'The AI planner is temporarily unavailable. Please try again later.' }, { status })
      }
      const data = await res.json()
      const content: Block[] = data.content || []

      if (data.stop_reason === 'tool_use') {
        // Did Claude submit the final plan?
        const planBlock = content.find((b) => b.type === 'tool_use' && b.name === 'submit_plan')
        if (planBlock) return finalize(planBlock.input as RawPlan, collected)

        // Otherwise run every search_venues call and loop back with results.
        messages.push({ role: 'assistant', content })
        const results: Block[] = []
        for (const b of content) {
          if (b.type !== 'tool_use' || b.name !== 'search_venues') continue
          const vens = await searchVenues((b.input as { query?: string; category?: string; area?: string }) || {})
          for (const v of vens) if (v.slug) collected.set(v.slug, v)
          results.push({ type: 'tool_result', tool_use_id: b.id as string, content: JSON.stringify(vens.map(forModel)) })
        }
        // Guard: if Claude used only tools we don't recognise, stop the loop.
        if (!results.length) break
        messages.push({ role: 'user', content: results })
        continue
      }

      // Claude ended without submit_plan (rare) - synthesise a minimal plan from
      // its text so the user still gets a response.
      const text = content.filter((b) => b.type === 'text').map((b) => (b.text as string) || '').join('').trim()
      return Response.json(minimalPlan(text, collected))
    }
    // Loop exhausted without a plan.
    return Response.json(minimalPlan('', collected))
  } catch {
    return Response.json({ error: 'model_error', message: 'The AI planner is temporarily unavailable. Please try again later.' }, { status: 502 })
  }
}

interface RawPlanItem { time?: string; title?: string; venue_slug?: string; why?: string }
interface RawPlanDay { title?: string; items?: RawPlanItem[] }
interface RawPlan { summary?: string; days?: RawPlanDay[]; tips?: string[] }

// Validate the model's plan against the venues we actually fetched: any
// venue_slug not in `collected` is a hallucination and is dropped to a generic
// item, so the plan can never link to a place that doesn't exist.
function finalize(raw: RawPlan, collected: Map<string, Ven>): Response {
  const out: PlanOut = {
    summary: String(raw?.summary || '').slice(0, 600),
    days: (Array.isArray(raw?.days) ? raw!.days! : []).slice(0, 10).map((d) => ({
      title: String(d?.title || '').slice(0, 160),
      items: (Array.isArray(d?.items) ? d.items! : []).slice(0, 12).map((it) => {
        const v = it?.venue_slug ? collected.get(it.venue_slug) : undefined
        return {
          time: String(it?.time || '').slice(0, 40),
          title: String(it?.title || '').slice(0, 160),
          why: String(it?.why || '').slice(0, 400),
          venue: v ? { ...v, href: `/venues/${v.slug}` } : null,
        }
      }),
    })),
    tips: (Array.isArray(raw?.tips) ? raw!.tips! : []).slice(0, 8).map((s) => String(s || '').slice(0, 300)),
  }
  return Response.json(out)
}

// Fallback when the model didn't call submit_plan: show its prose (if any) plus
// the strongest venues it looked at, so the response is never a dead end.
function minimalPlan(text: string, collected: Map<string, Ven>): PlanOut {
  const vens = [...collected.values()].slice(0, 6)
  return {
    summary: text.slice(0, 600) || 'Here are some verified places that match what you asked for.',
    days: vens.length
      ? [{ title: 'Suggested places', items: vens.map((v) => ({ time: '', title: v.name, why: '', venue: { ...v, href: `/venues/${v.slug}` } })) }]
      : [],
    tips: [],
  }
}
