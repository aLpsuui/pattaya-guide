'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// Floating AI concierge (bottom-right). Talks to /api/chat, which runs Claude
// grounded in the live venue directory (see app/api/chat/route.ts). The reply
// bubbles carry real links into the site. If the API is unconfigured or errors,
// the route returns a friendly fallback so the widget never dead-ends.

interface Link { label: string; href: string }
interface Msg { from: 'bot' | 'user'; text: string; links?: Link[] }

const QUICK: Link[] = [
  { label: 'Where to eat', href: '#ask' },
  { label: 'Nightlife', href: '#ask' },
  { label: 'Things to do', href: '#ask' },
  { label: 'Plan my trip', href: '/plan-my-trip' },
]

const GREETING_TEXT = "Hi! 👋 I'm the Go To Pattaya concierge. Ask me anything - where to eat, nightlife, spas, tours, which area to stay - and I'll point you to real, verified places."

export default function ChatWidget({ dict }: { dict?: Record<string, string> }) {
  const t = (s: string) => dict?.[s] ?? s
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>(() => [{ from: 'bot', text: t(GREETING_TEXT) }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' }) }, [msgs, open, busy])

  async function send(text: string) {
    const q = text.trim()
    if (!q || busy) return
    setInput('')
    const userMsg: Msg = { from: 'user', text: q }
    const next = [...msgs, userMsg]
    setMsgs(next)
    setBusy(true)
    try {
      const history = next
        .filter((m) => m.text)
        .slice(-12)
        .map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      const data = await res.json()
      setMsgs((m) => [...m, { from: 'bot', text: data.text || t('Let me point you to the right place.'), links: data.links }])
    } catch {
      setMsgs((m) => [...m, { from: 'bot', text: t('Connection hiccup - please try again in a moment.'), links: [{ label: t('Open map'), href: '/map' }] }])
    } finally {
      setBusy(false)
    }
  }

  // Quick chips: real page links navigate; the "#ask" prompts run as questions.
  const quick = (q: Link) => { if (q.href === '#ask') send(q.label); else go(q.href) }
  const go = (href: string) => { setOpen(false); router.push(href) }

  return (
    <>
      <button className={`cw-launch${open ? ' is-open' : ''}`} aria-label={open ? t('Close chat') : t('Open chat')} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" /></svg>
        )}
      </button>

      {open && (
        <div className="cw-panel" role="dialog" aria-label={t('Go To Pattaya concierge')}>
          <div className="cw-head">
            <span className="cw-avatar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" /></svg></span>
            <div className="cw-head__t"><b>Go To Pattaya</b><span><i className="cw-dot" />{t('Concierge · usually instant')}</span></div>
            <button className="cw-min" aria-label={t('Close chat')} onClick={() => setOpen(false)}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14" /></svg></button>
          </div>

          <div className="cw-body" ref={bodyRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`cw-msg cw-msg--${m.from}`}>
                <div className="cw-bubble">{m.text}</div>
                {m.links && m.links.length > 0 && (
                  <div className="cw-links">
                    {m.links.map((l) => (
                      <button key={l.href + l.label} className="cw-link" onClick={() => go(l.href)}>{l.label}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="cw-msg cw-msg--bot">
                <div className="cw-bubble cw-typing" aria-label={t('Typing')}><span></span><span></span><span></span></div>
              </div>
            )}
          </div>

          <div className="cw-quick">
            {QUICK.map((q) => <button key={q.href + q.label} onClick={() => quick(q)}>{t(q.label)}</button>)}
          </div>

          <form className="cw-foot" onSubmit={(e) => { e.preventDefault(); send(input) }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('Ask about Pattaya…')} aria-label={t('Message')} disabled={busy} />
            <button type="submit" className="cw-send" aria-label={t('Send')} disabled={!input.trim() || busy}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
