'use client'
import { useActionState } from 'react'
import { submitContact, type ContactState } from './actions'

const initial: ContactState = { ok: false }

export default function ContactForm({ dict }: { dict?: Record<string, string> }) {
  const t = (s: string) => dict?.[s] ?? s
  const [state, action, pending] = useActionState(submitContact, initial)

  if (state.ok) {
    return (
      <div className="cform-done" role="status">
        <strong>{t('Thanks - your message is on its way.')}</strong>
        <span>{t('We read every message and aim to reply within a couple of working days.')}</span>
      </div>
    )
  }

  return (
    <form action={action} className="cform" noValidate>
      <div className="cform-row">
        <label className="cfield">
          <span>{t('Your name')}</span>
          <input name="name" type="text" required autoComplete="name" placeholder={t('Jane Traveller')} />
        </label>
        <label className="cfield">
          <span>{t('Email')}</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </label>
      </div>
      <label className="cfield">
        <span>{t('Subject')} <em>{t('(optional)')}</em></span>
        <input name="subject" type="text" placeholder={t('Correction, listing, partnership…')} />
      </label>
      <label className="cfield">
        <span>{t('Message')}</span>
        <textarea name="message" required rows={6} placeholder={t('How can we help?')} />
      </label>
      {/* Honeypot - hidden from real users */}
      <input name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="cform-hp" />

      {state.error && <p className="cform-err" role="alert">{state.error}</p>}

      <button type="submit" className="cform-btn" disabled={pending}>
        {pending ? t('Sending…') : t('Send message')}
      </button>
    </form>
  )
}
