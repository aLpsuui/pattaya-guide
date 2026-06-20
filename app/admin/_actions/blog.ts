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

export async function saveBlog(_prev: State, fd: FormData): Promise<State> {
  const id = str(fd, 'id')
  const title = str(fd, 'title')
  if (!title) return { error: 'Title is required.' }
  const slug = slugify(str(fd, 'slug') || title)
  const status = str(fd, 'status') || 'draft'
  const isPublished = status === 'published'
  const tags = (str(fd, 'tags') || '').split(',').map((t) => t.trim()).filter(Boolean)

  let heroImage = str(fd, 'hero_image')
  const cover = fd.get('cover') as File | null
  if (cover && cover.size > 0) {
    const ext = (cover.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${slug}-cover-${Date.now()}.${ext}`
    const buf = Buffer.from(await cover.arrayBuffer())
    const { error } = await db.storage.from('blog').upload(path, buf, { contentType: cover.type || 'image/jpeg', upsert: true })
    if (error) return { error: `Cover upload failed: ${error.message}` }
    heroImage = `${STORAGE_BASE}/blog/${path}`
  }

  const row: Record<string, unknown> = {
    title, slug,
    description: str(fd, 'description'),
    page_html: str(fd, 'page_html'),
    category: str(fd, 'category'),
    author: str(fd, 'author'),
    tags: tags.length ? tags : null,
    seo_title: str(fd, 'seo_title'),
    meta_description: str(fd, 'meta_description'),
    focus_keyword: str(fd, 'focus_keyword'),
    noindex: fd.get('index') !== 'on',
    status,
    is_published: isPublished,
  }
  if (heroImage) row.hero_image = heroImage
  if (isPublished) row.published_at = new Date().toISOString()

  const res = id
    ? await db.from('blog_posts').update(row).eq('id', id)
    : await db.from('blog_posts').insert(row)
  if (res.error) return { error: res.error.message }

  revalidatePath('/admin/blog')
  redirect('/admin/blog')
}

export async function deleteBlog(fd: FormData) {
  const id = String(fd.get('id') || '')
  if (id) await db.from('blog_posts').delete().eq('id', id)
  revalidatePath('/admin/blog')
  redirect('/admin/blog')
}
