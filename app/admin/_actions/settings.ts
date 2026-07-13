'use server'
import { db, STORAGE_BASE } from '@/lib/admin/db'
import { revalidatePath } from 'next/cache'

// Save the single site_settings row. An uploaded file (logo_file) wins over a
// pasted URL (logo_url); leaving both empty clears the logo → default mark.
// revalidatePath('/', 'layout') purges the whole tree so the new logo shows
// up everywhere on the next visit.
export async function saveSettings(fd: FormData) {
  let logo_url = String(fd.get('logo_url') || '').trim() || null

  const file = fd.get('logo_file') as File | null
  if (file && file.size > 0) {
    const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png'
    const path = `logo-${Date.now()}.${ext}`
    const buf = Buffer.from(await file.arrayBuffer())
    const { error } = await db.storage.from('assets').upload(path, buf, {
      contentType: file.type || 'image/png', upsert: true,
    })
    if (error) throw new Error(error.message)
    logo_url = `${STORAGE_BASE}/assets/${path}`
  }

  await db.from('site_settings').upsert({
    id: true, logo_url, updated_at: new Date().toISOString(),
  })

  revalidatePath('/admin/settings')
  revalidatePath('/', 'layout')
}
