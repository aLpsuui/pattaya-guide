'use client'
import { useActionState } from 'react'
import { submitContact, type ContactState } from './actions'

const initial: ContactState = { ok: false }

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial)

  if (state.ok) {
    return (
      <div className="cform-done" role="status">
        <strong>Thanks — your message is on its way.</strong>
        <span>We read every message and aim to reply within a couple of working days.</span>
      </div>
    )
  }

  return (
    <form action={action} className="cform" noValidate>
      <div className="cform-row">
        <label className="cfield">
          <span>Your name</span>
          <input name="name" type="text" required autoComplete="name" placeholder="Jane Traveller" />
        </label>
        <label className="cfield">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </label>
      </div>
      <label className="cfield">
        <span>Subject <em>(optional)</em></span>
        <input name="subject" type="text" placeholder="Correction, listing, partnership…" />
      </label>
      <label className="cfield">
        <span>Message</span>
        <textarea name="message" required rows={6} placeholder="How can we help?" />
      </label>
      {/* Honeypot — hidden from real users */}
      <input name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="cform-hp" />

      {state.error && <p className="cform-err" role="alert">{state.error}</p>}

      <button type="submit" className="cform-btn" disabled={pending}>
        {pending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
