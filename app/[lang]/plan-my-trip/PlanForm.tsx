'use client'
import { useState } from 'react'
import Icon from '@/app/components/Icon'
import { submitPlan } from './actions'

const interests = [
  'Eat & Coffee', 'Beaches & Islands', 'Tours & Activities', 'Wellness & Spa',
  'Nightlife', 'Muay Thai & Fitness', 'Temples & Culture', 'Shopping', 'Family-friendly',
]

export default function PlanForm({ dict }: { dict?: Record<string, string> }) {
  const t = (s: string) => dict?.[s] ?? s
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)
  const [serverErr, setServerErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const next: Record<string, boolean> = {}
    if (!data.get('arrive')) next.arrive = true
    if (!data.get('nights')) next.nights = true
    const email = String(data.get('email') || '')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = true
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setServerErr(null)
    setPending(true)
    const res = await submitPlan(data)
    setPending(false)
    if (res.ok) { setSent(true); form.reset() }
    else setServerErr(res.error || t('Something went wrong - please try again.'))
  }

  return (
    <form className="form-card" aria-label="Trip planner" onSubmit={onSubmit} noValidate>
      <h2 style={{ marginBottom: 'var(--s1)' }}>{t('Tell us about your trip')}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 'var(--s4)' }}>{t('Takes about a minute.')} <span className="req">*</span> {t('required.')}</p>

      <div className="form-row">
        <div className={`field${errors.arrive ? ' invalid' : ''}`}>
          <label htmlFor="arrive">{t('Arrival date')} <span className="req">*</span></label>
          <input className="input" type="date" id="arrive" name="arrive" />
          <span className="err">{t('Pick your arrival date')}</span>
        </div>
        <div className={`field${errors.nights ? ' invalid' : ''}`}>
          <label htmlFor="nights">{t('Nights')} <span className="req">*</span></label>
          <select className="select" id="nights" name="nights" defaultValue="">
            <option value="">{t('Select…')}</option>
            <option value="2 nights">{t('2 nights')}</option><option value="3 nights">{t('3 nights')}</option>
            <option value="5 nights">{t('5 nights')}</option><option value="7 nights">{t('7 nights')}</option><option value="10+ nights">{t('10+ nights')}</option>
          </select>
          <span className="err">{t('How many nights?')}</span>
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="travellers">{t("Who's travelling")}</label>
          <select className="select" id="travellers" name="travellers">
            <option value="Solo">{t('Solo')}</option><option value="Couple">{t('Couple')}</option><option value="Friends">{t('Friends')}</option><option value="Family with kids">{t('Family with kids')}</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="budget">{t('Budget per day')}</label>
          <select className="select" id="budget" name="budget">
            <option value="฿ Budget (under ฿1,500)">{t('฿ Budget (under ฿1,500)')}</option>
            <option value="฿฿ Mid (฿1,500–4,000)">{t('฿฿ Mid (฿1,500–4,000)')}</option>
            <option value="฿฿฿ Premium (฿4,000+)">{t('฿฿฿ Premium (฿4,000+)')}</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>{t('What are you into?')} <span className="hint" style={{ display: 'inline' }}>{t('- pick any')}</span></label>
        <div className="opt-grid">
          {interests.map(i => (
            <label key={i} className="opt">
              <input type="checkbox" name="interests" value={i} />
              <span className="box"><Icon name="check" size={16} /></span>
              {t(i)}
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="pace">{t('Pace')}</label>
        <select className="select" id="pace" name="pace">
          <option value="Relaxed - 2–3 things a day">{t('Relaxed - 2–3 things a day')}</option>
          <option value="Balanced - a full but comfortable day">{t('Balanced - a full but comfortable day')}</option>
          <option value="Packed - see as much as possible">{t('Packed - see as much as possible')}</option>
        </select>
      </div>

      <div className={`field${errors.email ? ' invalid' : ''}`}>
        <label htmlFor="email2">{t('Email your itinerary to')} <span className="req">*</span></label>
        <input className="input" type="email" id="email2" name="email" autoComplete="email" placeholder="you@email.com" />
        <span className="err">{t('Enter a valid email')}</span>
        <span className="hint">{t("We'll send the plan and nothing else. Unsubscribe anytime.")}</span>
      </div>

      <button className="btn btn-primary btn-lg" type="submit" style={{ width: '100%' }} disabled={pending}>
        <Icon name="calendar" size={20} /> {pending ? t('Sending…') : t('Build my itinerary')}
      </button>
      {serverErr && <p className="err" style={{ display: 'block', marginTop: 'var(--s2)' }}>{serverErr}</p>}
      <p className="form-note">{t('By submitting you agree to our privacy policy. We never sell your data.')}</p>

      {sent && (
        <div className="alert--success" role="status" style={{ marginTop: 'var(--s3)' }}>
          <Icon name="check" size={20} />
          <div><b>{t('Your itinerary is on the way!')}</b><br />{t('Check your inbox in a few minutes for a day-by-day Pattaya plan.')}</div>
        </div>
      )}
    </form>
  )
}
