'use client'

// Carousel scroll button. Scrolls a horizontal carousel (by element id) left/right.
export default function CarButton({ target, dir, label }: { target: string; dir: -1 | 1; label: string }) {
  return (
    <button
      type="button"
      className={`car-btn ${dir < 0 ? 'car-prev' : 'car-next'}`}
      aria-label={label}
      onClick={() => {
        const el = document.getElementById(target)
        if (el) el.scrollBy({ left: dir * 320, behavior: 'smooth' })
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        {dir < 0 ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  )
}
