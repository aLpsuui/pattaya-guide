'use client'
import { useActionState, useEffect, useMemo, useState } from 'react'
import { submitBooking, type BookingState } from '@/app/[lang]/venues/[slug]/booking-actions'

export interface BookingOption { name: string; price: string; duration?: string | null }
export interface BookingTour { label: string; options: BookingOption[] }
export interface BookingVenue { id: string; slug: string; name: string; whatsapp?: string | null }

const initial: BookingState = { ok: false }
const priceNum = (s: string) => Number(String(s).replace(/[^\d]/g, '')) || 0
const todayISO = () => new Date().toISOString().slice(0, 10)

export default function BookingWidget({ venue, tours, dict, locale }: { venue: BookingVenue; tours: BookingTour[]; dict?: Record<string, string>; locale?: string }) {
  const t = (s: string) => dict?.[s] ?? s
  const [open, setOpen] = useState(false)
  const [tourIdx, setTourIdx] = useState(0)
  const [qty, setQty] = useState<Record<string, number>>({})
  const [date, setDate] = useState('')
  const [state, action, pending] = useActionState(submitBooking, initial)

  const tour = tours[tourIdx] || tours[0]
  const key = (name: string) => `${tourIdx}::${name}`

  // Selected line items (current tour, qty > 0) + running totals.
  const { items, total, headcount } = useMemo(() => {
    const items = (tour?.options || [])
      .map((o) => ({ name: o.name, qty: qty[key(o.name)] || 0, price: o.price }))
      .filter((i) => i.qty > 0)
    const total = items.reduce((s, i) => s + i.qty * priceNum(i.price), 0)
    const headcount = items.reduce((s, i) => s + i.qty, 0)
    return { items, total, headcount }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour, qty, tourIdx])

  // Lock body scroll + Escape to close while the modal is open.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !state.ok) setOpen(false) }
    addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; removeEventListener('keydown', onKey) }
  }, [open, state.ok])

  const step = (name: string, d: number) =>
    setQty((q) => ({ ...q, [key(name)]: Math.max(0, (q[key(name)] || 0) + d) }))

  // WhatsApp hand-off on success — the operator gets the booking instantly.
  const waUrl = useMemo(() => {
    if (!venue.whatsapp) return null
    const lines = [
      `Hi! I'd like to book ${venue.name} via Go To Pattaya:`,
      tour?.label || '',
      ...items.map((i) => `• ${i.qty}× ${i.name}`),
      date ? `Date: ${date}` : '',
      total ? `Total: ฿${total.toLocaleString()}` : '',
    ].filter(Boolean)
    return `${venue.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
  }, [venue, tour, items, date, total])

  return (
    <>
      <button type="button" className="bk-trigger" onClick={() => setOpen(true)}>
        {t('Book now')}{total > 0 && ` · ฿${total.toLocaleString()}`}
      </button>

      {open && (
        <div className="bk-scrim" role="dialog" aria-modal="true" aria-label={t('Book your ride')} onClick={() => !state.ok && setOpen(false)}>
          <div className="bk-modal" onClick={(e) => e.stopPropagation()}>
            <button className="bk-close" type="button" aria-label={t('Close')} onClick={() => setOpen(false)}>×</button>

            {state.ok ? (
              <div className="bk-done" role="status">
                <div className="bk-done__tick" aria-hidden="true">✓</div>
                <h3>{t('Booking request sent!')}</h3>
                <p>{t('We’ve got your request and will confirm availability shortly. For an instant reply, message the operator on WhatsApp below.')}</p>
                {waUrl && <a className="bk-wa" href={waUrl} target="_blank" rel="noopener">{t('Message operator on WhatsApp')}</a>}
                <button type="button" className="bk-textbtn" onClick={() => setOpen(false)}>{t('Close')}</button>
              </div>
            ) : (
              <form action={action} className="bk-form" noValidate>
                <div className="bk-head">
                  <span className="bk-kicker">{t('Book your ride')}</span>
                  <h3>{venue.name}</h3>
                </div>

                {/* Tour selector */}
                {tours.length > 1 && (
                  <div className="bk-tours" role="group" aria-label={t('Choose a tour')}>
                    {tours.map((tr, i) => (
                      <button type="button" key={tr.label} className={`bk-tourbtn${i === tourIdx ? ' on' : ''}`} aria-pressed={i === tourIdx} onClick={() => setTourIdx(i)}>
                        {tr.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Options with steppers */}
                <div className="bk-options">
                  {(tour?.options || []).map((o) => (
                    <div className="bk-opt" key={o.name}>
                      <div className="bk-opt__info">
                        <span className="bk-opt__name">{o.name}</span>
                        <span className="bk-opt__price">{o.price}{o.duration ? ` · ${o.duration}` : ''}</span>
                      </div>
                      <div className="bk-stepper">
                        <button type="button" onClick={() => step(o.name, -1)} aria-label={`− ${o.name}`} disabled={(qty[key(o.name)] || 0) === 0}>−</button>
                        <span aria-live="polite">{qty[key(o.name)] || 0}</span>
                        <button type="button" onClick={() => step(o.name, 1)} aria-label={`+ ${o.name}`}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Date + total */}
                <div className="bk-row2">
                  <label className="cfield">
                    <span>{t('Preferred date')}</span>
                    <input type="date" name="preferred_date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} />
                  </label>
                  <div className="bk-total">
                    <span>{t('Total')}</span>
                    <b>{total > 0 ? `฿${total.toLocaleString()}` : '—'}</b>
                  </div>
                </div>

                {/* Customer details */}
                <div className="bk-row2">
                  <label className="cfield"><span>{t('Your name')}</span>
                    <input name="name" type="text" required autoComplete="name" placeholder={t('Jane Traveller')} /></label>
                  <label className="cfield"><span>{t('Phone / WhatsApp')}</span>
                    <input name="contact" type="tel" required autoComplete="tel" placeholder="+66…" /></label>
                </div>
                <label className="cfield"><span>{t('Email')} <em>{t('(optional)')}</em></span>
                  <input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
                <label className="cfield"><span>{t('Notes')} <em>{t('(optional)')}</em></span>
                  <textarea name="note" rows={2} placeholder={t('Hotel, pickup, group size…')} /></label>

                {/* Hidden state → server action */}
                <input type="hidden" name="venue_id" value={venue.id} />
                <input type="hidden" name="venue_slug" value={venue.slug} />
                <input type="hidden" name="venue_name" value={venue.name} />
                <input type="hidden" name="tour" value={tour?.label || ''} />
                <input type="hidden" name="items" value={JSON.stringify(items)} />
                <input type="hidden" name="total" value={total} />
                <input type="hidden" name="headcount" value={headcount} />
                <input type="hidden" name="locale" value={locale || ''} />
                <input name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="bk-hp" />

                {state.error && <p className="bk-err" role="alert">{state.error}</p>}

                <button type="submit" className="bk-submit" disabled={pending || items.length === 0}>
                  {pending ? t('Sending…') : items.length === 0 ? t('Choose at least one option') : `${t('Request booking')} · ฿${total.toLocaleString()}`}
                </button>
                <p className="bk-fine">{t('No payment now — we confirm availability first.')}</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
