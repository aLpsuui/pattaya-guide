'use server'
import { db } from '@/lib/admin/db'

export interface BookingState {
  ok: boolean
  error?: string
}

interface BookingItem { name: string; qty: number; price: string }

// Store a booking-request lead (service role, server-only). gotopattaya owns the
// lead for commission; the team sees it in /admin/bookings and forwards it to the
// operator. Mirrors submitContact (honeypot + light validation, no external deps).
export async function submitBooking(_prev: BookingState, fd: FormData): Promise<BookingState> {
  // Honeypot: real users never fill this hidden field; bots do.
  if (String(fd.get('company') || '').trim()) return { ok: true }

  const name = String(fd.get('name') || '').trim()
  const contact = String(fd.get('contact') || '').trim()
  const tour = String(fd.get('tour') || '').trim()
  const email = String(fd.get('email') || '').trim()
  const note = String(fd.get('note') || '').trim()
  const date = String(fd.get('preferred_date') || '').trim()

  let items: BookingItem[] = []
  try {
    const parsed = JSON.parse(String(fd.get('items') || '[]'))
    if (Array.isArray(parsed)) items = parsed.filter((i) => i && typeof i.name === 'string' && Number(i.qty) > 0)
  } catch { /* invalid → empty */ }

  if (!name || !contact) return { ok: false, error: 'Please add your name and a contact number.' }
  if (items.length === 0) return { ok: false, error: 'Please choose at least one rider or seat.' }
  if (name.length > 120 || contact.length > 60 || note.length > 1000) return { ok: false, error: 'That looks too long — please shorten it.' }

  const total = Math.round(Number(fd.get('total') || 0)) || null
  const headcount = Math.round(Number(fd.get('headcount') || 0)) || null

  const { error } = await db.from('bookings').insert({
    venue_id: String(fd.get('venue_id') || '') || null,
    venue_slug: String(fd.get('venue_slug') || '') || null,
    venue_name: String(fd.get('venue_name') || '') || null,
    tour: tour || null,
    items,
    preferred_date: date || null,
    headcount,
    total_baht: total,
    customer_name: name,
    customer_contact: contact,
    customer_email: email || null,
    note: note || null,
    locale: String(fd.get('locale') || '') || null,
  })
  if (error) return { ok: false, error: 'Something went wrong — please message the operator on WhatsApp instead.' }
  return { ok: true }
}
