'use client'
import { useState } from 'react'
import Icon from '@/app/components/Icon'

const interests = [
  'Eat & Coffee', 'Beaches & Islands', 'Tours & Activities', 'Wellness & Spa',
  'Nightlife', 'Muay Thai & Fitness', 'Temples & Culture', 'Shopping', 'Family-friendly',
]

export default function PlanForm() {
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [sent, setSent] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const next: Record<string, boolean> = {}
    if (!data.get('arrive')) next.arrive = true
    if (!data.get('nights')) next.nights = true
    const email = String(data.get('email') || '')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = true
    setErrors(next)
    if (Object.keys(next).length === 0) {
      setSent(true)
      form.reset()
    }
  }

  return (
    <form className="form-card" aria-label="Trip planner" onSubmit={onSubmit} noValidate>
      <h2 style={{ marginBottom: 'var(--s1)' }}>Tell us about your trip</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 'var(--s4)' }}>Takes about a minute. <span className="req">*</span> required.</p>

      <div className="form-row">
        <div className={`field${errors.arrive ? ' invalid' : ''}`}>
          <label htmlFor="arrive">Arrival date <span className="req">*</span></label>
          <input className="input" type="date" id="arrive" name="arrive" />
          <span className="err">Pick your arrival date</span>
        </div>
        <div className={`field${errors.nights ? ' invalid' : ''}`}>
          <label htmlFor="nights">Nights <span className="req">*</span></label>
          <select className="select" id="nights" name="nights" defaultValue="">
            <option value="">Select…</option>
            <option>2 nights</option><option>3 nights</option>
            <option>5 nights</option><option>7 nights</option><option>10+ nights</option>
          </select>
          <span className="err">How many nights?</span>
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="travellers">Who&apos;s travelling</label>
          <select className="select" id="travellers" name="travellers">
            <option>Solo</option><option>Couple</option><option>Friends</option><option>Family with kids</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="budget">Budget per day</label>
          <select className="select" id="budget" name="budget">
            <option>฿ Budget (under ฿1,500)</option>
            <option>฿฿ Mid (฿1,500–4,000)</option>
            <option>฿฿฿ Premium (฿4,000+)</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>What are you into? <span className="hint" style={{ display: 'inline' }}>— pick any</span></label>
        <div className="opt-grid">
          {interests.map(i => (
            <label key={i} className="opt">
              <input type="checkbox" name="interests" value={i} />
              <span className="box"><Icon name="check" size={16} /></span>
              {i}
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="pace">Pace</label>
        <select className="select" id="pace" name="pace">
          <option>Relaxed — 2–3 things a day</option>
          <option>Balanced — a full but comfortable day</option>
          <option>Packed — see as much as possible</option>
        </select>
      </div>

      <div className={`field${errors.email ? ' invalid' : ''}`}>
        <label htmlFor="email2">Email your itinerary to <span className="req">*</span></label>
        <input className="input" type="email" id="email2" name="email" autoComplete="email" placeholder="you@email.com" />
        <span className="err">Enter a valid email</span>
        <span className="hint">We&apos;ll send the plan and nothing else. Unsubscribe anytime.</span>
      </div>

      <button className="btn btn-primary btn-lg" type="submit" style={{ width: '100%' }}>
        <Icon name="calendar" size={20} /> Build my itinerary
      </button>
      <p className="form-note">By submitting you agree to our privacy policy. We never sell your data.</p>

      {sent && (
        <div className="alert--success" role="status" style={{ marginTop: 'var(--s3)' }}>
          <Icon name="check" size={20} />
          <div><b>Your itinerary is on the way!</b><br />Check your inbox in a few minutes for a day-by-day Pattaya plan.</div>
        </div>
      )}
    </form>
  )
}
