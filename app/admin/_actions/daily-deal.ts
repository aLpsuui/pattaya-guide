'use server'
import { db } from '@/lib/admin/db'
import { revalidatePath } from 'next/cache'

// Save the single "venue of the day" row. Writes go through the service-role
// client (bypasses RLS). Revalidate the homepage so the popup picks it up.
export async function saveDailyDeal(fd: FormData) {
  const venue_id = String(fd.get('venue_id') || '') || null
  const label = String(fd.get('label') || '').trim() || null
  const active = fd.get('active') === 'on'
  await db.from('daily_deal').upsert({
    id: true, venue_id, label, active, updated_at: new Date().toISOString(),
  })
  revalidatePath('/admin/daily-deal')
  revalidatePath('/')
}
