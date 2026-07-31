'use client'
import { useState } from 'react'
import Link from 'next/link'

// Client half of the AI trip planner. Posts the user's free-text request to the
// same-origin /api/plan route and renders the structured day-by-day plan it
// returns. All venue links point at real /venues/<slug> pages (the server drops
// any venue the model invented), so a plan can never link somewhere that 404s.

interface Venue {
  slug: string; name: string; venue_type: string | null; neighborhood: string | null
  rating: number | null; review_count: number | null; price_from: number | null
  price_from_label: string | null; locally_verified: boolean | null; image_url: string | null
  href: string
}
interface Item { time: string; title: string; why: string; venue: Venue | null }
interface Day { title: string; items: Item[] }
interface Plan { summary: string; days: Day[]; tips: string[] }

export default function TripPlanner({ lang, dict, examples }: { lang: string; dict?: Record<string, string>; examples: string[] }) {
  const t = (s: string) => dict?.[s] ?? s
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [plan, setPlan] = useState<Plan | null>(null)

  async function run(p: string) {
    const text = p.trim()
    if (text.length < 3 || loading) return
    setLoading(true); setError(''); setPlan(null)
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: text, lang }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data || data.error) {
        setError((data && data.message) || t('The AI planner is temporarily unavailable. Please try again later.'))
        return
      }
      setPlan(data as Plan)
    } catch {
      setError(t('Something went wrong. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tp">
      <form
        className="tp-box"
        onSubmit={(e) => { e.preventDefault(); run(prompt) }}
      >
        <textarea
          className="tp-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); run(prompt) } }}
          placeholder={t('e.g. 3 days in Pattaya, I want to try local food and watch Muay Thai, nothing too touristy…')}
          rows={3}
          maxLength={1000}
          aria-label={t('Describe your Pattaya trip')}
          disabled={loading}
        />
        <div className="tp-actions">
          <span className="tp-hint">{t('Write in any language · ⌘/Ctrl + Enter')}</span>
          <button className="btn btn--primary" type="submit" disabled={loading || prompt.trim().length < 3}>
            {loading ? t('Planning…') : t('Create my plan')}
          </button>
        </div>
      </form>

      {!plan && !loading && (
        <div className="tp-examples">
          <span className="tp-examples-label">{t('Try:')}</span>
          {examples.map((ex) => (
            <button key={ex} type="button" className="tp-chip" onClick={() => { setPrompt(ex); run(ex) }}>{ex}</button>
          ))}
        </div>
      )}

      {loading && (
        <div className="tp-loading" role="status" aria-live="polite">
          <span className="tp-spinner" aria-hidden="true" />
          <span>{t('Building your plan from real Pattaya places…')}</span>
        </div>
      )}

      {error && !loading && (
        <div className="tp-error alert alert--info" role="alert">{error}</div>
      )}

      {plan && !loading && (
        <div className="tp-result">
          {plan.summary && <p className="tp-summary">{plan.summary}</p>}

          {plan.days.length === 0 && (
            <p className="tp-empty">{t('No plan yet — try describing your trip a bit more.')}</p>
          )}

          {plan.days.map((day, di) => (
            <section className="tp-day" key={di}>
              <h2 className="tp-day-title">{day.title}</h2>
              <ol className="tp-items">
                {day.items.map((it, ii) => (
                  <li className="tp-item" key={ii}>
                    <div className="tp-item-main">
                      {it.time && <span className="tp-time">{it.time}</span>}
                      <div className="tp-item-body">
                        <b className="tp-item-title">{it.title}</b>
                        {it.why && <p className="tp-why">{it.why}</p>}
                      </div>
                    </div>
                    {it.venue && (
                      <Link className="tp-venue" href={`/${lang}${it.venue.href}`}>
                        {it.venue.image_url
                          ? // eslint-disable-next-line @next/next/no-img-element
                            <img className="tp-venue-img" src={it.venue.image_url} alt={it.venue.name} loading="lazy" width={96} height={72} />
                          : <span className="tp-venue-img tp-venue-img--ph" aria-hidden="true" />}
                        <span className="tp-venue-body">
                          <b className="tp-venue-name">{it.venue.name}</b>
                          <span className="tp-venue-meta">
                            {[it.venue.venue_type, it.venue.neighborhood].filter(Boolean).join(' · ')}
                          </span>
                          <span className="tp-venue-meta">
                            {it.venue.rating != null && <>★ {it.venue.rating.toFixed(1)}{it.venue.review_count != null && ` (${it.venue.review_count.toLocaleString()})`}</>}
                            {it.venue.price_from != null && <> · {t('from')} ฿{it.venue.price_from.toLocaleString()}</>}
                            {it.venue.locally_verified && <> · ✓ {t('Verified')}</>}
                          </span>
                        </span>
                        <span className="tp-venue-arrow" aria-hidden="true">→</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          ))}

          {plan.tips.length > 0 && (
            <div className="tp-tips">
              <h2 className="tp-tips-title">{t('Good to know')}</h2>
              <ul>{plan.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
            </div>
          )}

          <div className="tp-reset">
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => { setPlan(null); setPrompt('') }}>
              {t('Plan another trip')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
