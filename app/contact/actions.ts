'use server'
import { db } from '@/lib/admin/db'

export interface ContactState {
  ok: boolean
  error?: string
}

// Store a contact-form submission in Supabase (service role, server-only).
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const subject = String(formData.get('subject') || '').trim()
  const message = String(formData.get('message') || '').trim()
  // Honeypot: real users never fill this hidden field; bots do.
  if (String(formData.get('company') || '').trim()) return { ok: true }

  if (!name || !email || !message) return { ok: false, error: 'Please fill in your name, email and message.' }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: 'Please enter a valid email address.' }
  if (message.length > 5000) return { ok: false, error: 'Message is too long.' }

  const { error } = await db
    .from('contact_messages')
    .insert({ name, email, subject: subject || null, message })
  if (error) return { ok: false, error: 'Something went wrong sending your message — please email us directly instead.' }

  return { ok: true }
}
