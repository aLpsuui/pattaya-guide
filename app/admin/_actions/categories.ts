'use server'
import { db } from '@/lib/admin/db'
import { revalidatePath } from 'next/cache'

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function refresh() {
  revalidatePath('/admin/categories')
  revalidatePath('/admin/categories/diagram')
}

export async function createCategory(fd: FormData) {
  const name = String(fd.get('name_en') || '').trim()
  if (!name) return
  const slug = String(fd.get('slug') || '').trim() || slugify(name)
  const icon = String(fd.get('icon') || '').trim()
  await db.from('categories').insert({ name_en: name, slug, icon: icon || null })
  refresh()
}

export async function updateCategory(fd: FormData) {
  const id = String(fd.get('id') || '')
  if (!id) return
  const name = String(fd.get('name_en') || '').trim()
  const slug = String(fd.get('slug') || '').trim() || slugify(name)
  const icon = String(fd.get('icon') || '').trim()
  await db.from('categories').update({ name_en: name, slug, icon: icon || null }).eq('id', id)
  refresh()
}

export async function deleteCategory(fd: FormData) {
  const id = String(fd.get('id') || '')
  if (!id) return
  // Guard: never delete a category that still has venues attached.
  const { count } = await db.from('venues').select('id', { count: 'exact', head: true }).eq('category_id', id)
  if ((count || 0) > 0) return
  await db.from('categories').delete().eq('id', id)
  refresh()
}
