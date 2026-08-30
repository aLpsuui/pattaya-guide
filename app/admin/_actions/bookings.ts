'use server'
import { db } from '@/lib/admin/db'
import { revalidatePath } from 'next/cache'

const STATUSES = ['new', 'contacted', 'confirmed', 'cancelled']

export async function deleteBooking(fd: FormData) {
  const id = String(fd.get('id') || '')
  if (id) await db.from('bookings').delete().eq('id', id)
  revalidatePath('/admin/bookings')
}

export async function setBookingStatus(fd: FormData) {
  const id = String(fd.get('id') || '')
  const status = String(fd.get('status') || '')
  if (id && STATUSES.includes(status)) await db.from('bookings').update({ status }).eq('id', id)
  revalidatePath('/admin/bookings')
}
