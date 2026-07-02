'use server'
import { db, STORAGE_BASE } from '@/lib/admin/db'
import { revalidatePath } from 'next/cache'

type State = { error: string; ok?: string }

export interface MediaItem { bucket: string; name: string; url: string }

// List every file across the media buckets (paginated) — used by the media
// picker so cover images can be chosen from the existing library.
export async function listMedia(): Promise<MediaItem[]> {
  const buckets = ['blog', 'assets', 'venues']
  const out: MediaItem[] = []
  for (const bucket of buckets) {
    const PAGE = 100
    for (let offset = 0; ; offset += PAGE) {
      const { data } = await db.storage.from(bucket).list('', { limit: PAGE, offset, sortBy: { column: 'created_at', order: 'desc' } })
      const rows = data || []
      out.push(...rows.filter((o) => o.id).map((o) => ({ bucket, name: o.name, url: `${STORAGE_BASE}/${bucket}/${o.name}` })))
      if (rows.length < PAGE) break
    }
  }
  return out
}

export async function uploadMedia(_prev: State, fd: FormData): Promise<State> {
  const bucket = String(fd.get('bucket') || 'blog')
  const file = fd.get('file') as File | null
  if (!file || file.size === 0) return { error: 'Pick a file first.' }
  const buf = Buffer.from(await file.arrayBuffer())
  const { error } = await db.storage.from(bucket).upload(file.name, buf, {
    contentType: file.type || 'application/octet-stream', upsert: true,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/media')
  return { error: '', ok: `Uploaded ${file.name} to ${bucket}.` }
}
