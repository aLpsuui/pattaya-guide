'use server'
import { db } from '@/lib/admin/db'

export interface PlanState { ok: boolean; error?: string }

// Store a Plan-my-trip submission in the same inbox the contact form uses, so
// it shows up under Admin → Messages.
export async function submitPlan(fd: FormData): Promise<PlanState> {
  const email = String(fd.get('email') || '').trim()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: 'Please enter a valid email address.' }

  const arrive = String(fd.get('arrive') || '').trim()
  const nights = String(fd.get('nights') || '').trim()
  const travellers = String(fd.get('travellers') || '').trim()
  const budget = String(fd.get('budget') || '').trim()
  const pace = String(fd.get('pace') || '').trim()
  const interests = fd.getAll('interests').map(String).join(', ')

  const message = [
    `Arrival date: ${arrive || '—'}`,
    `Nights: ${nights || '—'}`,
    `Travelling as: ${travellers || '—'}`,
    `Budget/day: ${budget || '—'}`,
    `Pace: ${pace || '—'}`,
    `Interested in: ${interests || '—'}`,
  ].join('\n')

  const { error } = await db.from('contact_messages').insert({
    name: 'Trip planner',
    email,
    subject: 'Plan my trip request',
    message,
  })
  if (error) return { ok: false, error: 'Something went wrong — please try again.' }
  return { ok: true }
}
