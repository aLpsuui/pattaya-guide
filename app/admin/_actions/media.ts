'use server'
import { db } from '@/lib/admin/db'
import { revalidatePath } from 'next/cache'

type State = { error: string; ok?: string }

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
