'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AREAS } from '@/lib/areas'

// Floating concierge chat (bottom-right). No LLM yet — it answers from the
// site's own data: a small index of categories + venues + areas is loaded on
// first open, then each message is keyword-matched to relevant pages. The
// reply bubbles carry real links into the site. Swap `answer()` for an API
// call later to make it AI-powered; the UI stays the same.

interface Link { label: string; href: string }
interface Msg { from: 'bot' | 'user'; text: string; links?: Link[] }
interface Ven { slug: string; name: string; type: string | null }

const INTENTS: { keys: string[]; text: string; links: Link[] }[] = [
  { keys: ['eat', 'food', 'restaurant', 'cafe', 'café', 'coffee', 'breakfast', 'brunch', 'dinner', 'lunch'],
    text: 'Hungry? Here’s where Pattaya actually eats — filter by type, area and more.',
    links: [{ label: 'Eat & Drinks', href: '/eat-and-drinks' }] },
  { keys: ['bar', 'club', 'night', 'party', 'nightlife', 'drink', 'walking street', 'go go'],
    text: 'For bars, clubs and rooftops, check the Nightlife hub.',
    links: [{ label: 'Nightlife', href: '/nightlife' }] },
  { keys: ['spa', 'massage', 'wellness', 'beauty', 'relax'],
    text: 'Spa, massage and wellness spots are here.',
    links: [{ label: 'Wellness & Beauty', href: '/wellness-and-beauty' }] },
  { keys: ['gym', 'fitness', 'yoga', 'muay', 'boxing', 'training', 'workout'],
    text: 'Gyms, Muay Thai camps and yoga studios — all in one place.',
    links: [{ label: 'Yoga & Fitness', href: '/yoga-and-fitness' }] },
  { keys: ['tour', 'island', 'beach', 'dive', 'snorkel', 'activity', 'thing', 'do', 'adventure', 'temple', 'rent'],
    text: 'Tours, islands, diving and adventures live under Things to Do.',
    links: [{ label: 'Things to Do', href: '/things-to-do' }] },
  { keys: ['plan', 'itinerary', 'trip', 'days', 'schedule'],
    text: 'Want a ready-made plan? Start with Plan my trip.',
    links: [{ label: 'Plan my trip', href: '/plan-my-trip' }] },
  { keys: ['area', 'stay', 'where', 'district', 'neighbourhood', 'neighborhood', 'hotel'],
    text: 'Pick the right area before you book — each guide covers the vibe, streets and who it suits.',
    links: [{ label: 'Areas', href: '/areas' }] },
  { keys: ['blog', 'guide', 'safe', 'weather', 'when', 'tip', 'scam', 'transport', 'bangkok'],
    text: 'Our guides cover safety, weather, getting around and more.',
    links: [{ label: 'Read the guides', href: '/blog' }] },
  { keys: ['map'], text: 'Explore everything on the live map.', links: [{ label: 'Open map', href: '/map' }] },
  { keys: ['contact', 'help', 'email', 'reach', 'support'],
    text: 'Happy to help — drop us a message and a local editor will reply.',
    links: [{ label: 'Contact us', href: '/contact' }] },
]

const QUICK: Link[] = [
  { label: 'Where to eat', href: '/eat-and-drinks' },
  { label: 'Nightlife', href: '/nightlife' },
  { label: 'Things to do', href: '/things-to-do' },
  { label: 'Plan my trip', href: '/plan-my-trip' },
]

const GREETING: Msg = {
  from: 'bot',
  text: 'Hi! 👋 I’m the Go To Pattaya concierge. Ask me about places to eat, nightlife, areas, tours — or tap a shortcut below.',
}

export default function ChatWidget() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [vens, setVens] = useState<Ven[]>([])
  const bodyRef = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)

  // Load the tiny search index on first open.
  useEffect(() => {
    if (!open || loaded.current) return
    loaded.current = true
    ;(async () => {
      const { data } = await supabase.from('venues').select('slug, name, venue_type').eq('is_active', true).limit(2000)
      setVens(((data as unknown as { slug: string; name: string; venue_type: string | null }[]) || [])
        .map((v) => ({ slug: v.slug, name: v.name, type: v.venue_type })))
    })()
  }, [open])

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' }) }, [msgs, open])

  function answer(q: string): Msg {
    const t = q.toLowerCase()
    // direct venue name match
    const venue = vens.find((v) => v.name.toLowerCase().includes(t) && t.length >= 3)
    if (venue) return { from: 'bot', text: `Found it — here’s ${venue.name}.`, links: [{ label: venue.name, href: `/venues/${venue.slug}` }] }
    // area match
    const area = AREAS.find((a) => t.includes(a.name.toLowerCase()) || t.includes(a.slug))
    if (area) return { from: 'bot', text: `${area.name} — here’s the full area guide with where to eat, stay and what to see.`, links: [{ label: `${area.name} guide`, href: `/areas/${area.slug}` }] }
    // intent match
    for (const i of INTENTS) if (i.keys.some((k) => t.includes(k))) return { from: 'bot', text: i.text, links: i.links }
    // fallback
    return {
      from: 'bot',
      text: 'I’m not sure yet, but these usually help. You can also search the whole site from the top bar.',
      links: [{ label: 'Eat & Drinks', href: '/eat-and-drinks' }, { label: 'Things to Do', href: '/things-to-do' }, { label: 'Areas', href: '/areas' }],
    }
  }

  function send(text: string) {
    const q = text.trim()
    if (!q) return
    setInput('')
    setMsgs((m) => [...m, { from: 'user', text: q }])
    setTimeout(() => setMsgs((m) => [...m, answer(q)]), 280)
  }

  const go = (href: string) => { setOpen(false); router.push(href) }

  return (
    <>
      <button className={`cw-launch${open ? ' is-open' : ''}`} aria-label={open ? 'Close chat' : 'Open chat'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" /></svg>
        )}
      </button>

      {open && (
        <div className="cw-panel" role="dialog" aria-label="Go To Pattaya concierge">
          <div className="cw-head">
            <span className="cw-avatar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" /></svg></span>
            <div className="cw-head__t"><b>Go To Pattaya</b><span><i className="cw-dot" />Concierge · usually instant</span></div>
            <button className="cw-min" aria-label="Close chat" onClick={() => setOpen(false)}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14" /></svg></button>
          </div>

          <div className="cw-body" ref={bodyRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`cw-msg cw-msg--${m.from}`}>
                <div className="cw-bubble">{m.text}</div>
                {m.links && (
                  <div className="cw-links">
                    {m.links.map((l) => (
                      <button key={l.href + l.label} className="cw-link" onClick={() => go(l.href)}>{l.label}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="cw-quick">
            {QUICK.map((q) => <button key={q.href + q.label} onClick={() => send(q.label)}>{q.label}</button>)}
          </div>

          <form className="cw-foot" onSubmit={(e) => { e.preventDefault(); send(input) }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about Pattaya…" aria-label="Message" />
            <button type="submit" className="cw-send" aria-label="Send" disabled={!input.trim()}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
