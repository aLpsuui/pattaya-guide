'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export type Deal = {
  slug: string
  name: string
  image_url: string | null
  rating: number | null
  review_count: number | null
  venue_type: string | null
  category: string | null
  label: string | null
}

const KEY = 'pg-deal-seen'
const today = () => new Date().toISOString().slice(0, 10)

export default function DailyDealPopup({ deal }: { deal: Deal }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let seen: string | null = null
    try { seen = localStorage.getItem(KEY) } catch {}
    if (seen === today()) return
    const t = setTimeout(() => setOpen(true), 1200)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    setOpen(false)
    try { localStorage.setItem(KEY, today()) } catch {}
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss() }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null
  const meta = deal.venue_type || deal.category

  return (
    <div className="ddp-scrim" role="dialog" aria-modal="true" aria-label="Günün mekanı" onClick={dismiss}>
      <div className="ddp-card" onClick={(e) => e.stopPropagation()}>
        <button className="ddp-close" onClick={dismiss} aria-label="Kapat" type="button">×</button>
        <div className="ddp-media" style={{ backgroundImage: deal.image_url ? `url(${deal.image_url})` : 'var(--grad-brand)' }}>
          {deal.label && <span className="ddp-badge">{deal.label}</span>}
        </div>
        <div className="ddp-body">
          <div className="ddp-kicker">Günün mekanı</div>
          <h3 className="ddp-name">{deal.name}</h3>
          <div className="ddp-meta">
            {meta && <span>{meta}</span>}
            {deal.rating != null && (
              <span className="ddp-rate">★ {deal.rating.toFixed(1)}{deal.review_count != null && ` (${deal.review_count.toLocaleString()})`}</span>
            )}
          </div>
          <Link href={`/venues/${deal.slug}`} className="ddp-cta" onClick={dismiss}>Mekana git</Link>
        </div>
      </div>
    </div>
  )
}
