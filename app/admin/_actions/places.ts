'use server'
import { db, STORAGE_BASE } from '@/lib/admin/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/admin/options'

type State = { error: string }

function str(fd: FormData, k: string): string | null {
  const v = fd.get(k)
  return v == null || String(v).trim() === '' ? null : String(v).trim()
}

export async function savePlace(_prev: State, fd: FormData): Promise<State> {
  const id = str(fd, 'id')
  const name = str(fd, 'name')
  if (!name) return { error: 'Venue name is required.' }
  const slug = slugify(str(fd, 'slug') || name)

  const status = str(fd, 'status') || 'draft'
  const visibility = str(fd, 'visibility') || 'Public'
  const isActive = status === 'published' && visibility !== 'Hidden'

  let imageUrl = str(fd, 'image_url')
  const cover = fd.get('cover') as File | null
  if (cover && cover.size > 0) {
    const ext = (cover.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${slug}/${slug}-cover-${Date.now()}.${ext}`
    const buf = Buffer.from(await cover.arrayBuffer())
    const { error } = await db.storage.from('venues').upload(path, buf, { contentType: cover.type || 'image/jpeg', upsert: true })
    if (error) return { error: `Cover upload failed: ${error.message}` }
    imageUrl = `${STORAGE_BASE}/venues/${path}`
  }

  const row: Record<string, unknown> = {
    name, slug,
    category_id: str(fd, 'category_id'),
    neighborhood: str(fd, 'neighborhood'),
    tagline: str(fd, 'tagline'),
    address: str(fd, 'address'),
    price_range: str(fd, 'price_range'),
    seo_title: str(fd, 'seo_title'),
    description: str(fd, 'description'),
    focus_keyword: str(fd, 'focus_keyword'),
    canonical_url: str(fd, 'canonical_url'),
    noindex: fd.get('index') !== 'on',
    status,
    is_active: isActive,
  }
  if (imageUrl) row.image_url = imageUrl

  const res = id
    ? await db.from('venues').update(row).eq('id', id)
    : await db.from('venues').insert(row)
  if (res.error) return { error: res.error.message }

  revalidatePath('/admin/places')
  redirect('/admin/places')
}

export async function deletePlace(fd: FormData) {
  const id = String(fd.get('id') || '')
  if (id) await db.from('venues').delete().eq('id', id)
  revalidatePath('/admin/places')
  redirect('/admin/places')
}

// ---- venue gallery (venue_photos) ----
export async function addVenuePhotos(fd: FormData) {
  const venueId = String(fd.get('venue_id') || '')
  const slug = String(fd.get('slug') || 'venue')
  if (!venueId) return
  const files = (fd.getAll('photos') as File[]).filter((f) => f && f.size > 0)
  if (!files.length) return

  const { count } = await db.from('venue_photos').select('*', { count: 'exact', head: true }).eq('venue_id', venueId)
  let order = count || 0
  const rows: { venue_id: string; url: string; sort_order: number }[] = []
  for (const file of files) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${slug}/${slug}-gallery-${Date.now()}-${order}.${ext}`
    const buf = Buffer.from(await file.arrayBuffer())
    const { error } = await db.storage.from('venues').upload(path, buf, { contentType: file.type || 'image/jpeg', upsert: true })
    if (!error) rows.push({ venue_id: venueId, url: `${STORAGE_BASE}/venues/${path}`, sort_order: order++ })
  }
  if (rows.length) await db.from('venue_photos').insert(rows)
  revalidatePath(`/admin/places/${venueId}`)
}

export async function deleteVenuePhoto(fd: FormData) {
  const id = String(fd.get('id') || '')
  const venueId = String(fd.get('venue_id') || '')
  if (id) await db.from('venue_photos').delete().eq('id', id)
  if (venueId) revalidatePath(`/admin/places/${venueId}`)
}
