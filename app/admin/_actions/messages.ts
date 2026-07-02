'use server'
import { db } from '@/lib/admin/db'
import { revalidatePath } from 'next/cache'

export async function deleteMessage(fd: FormData) {
  const id = String(fd.get('id') || '')
  if (id) await db.from('contact_messages').delete().eq('id', id)
  revalidatePath('/admin/messages')
}

export async function toggleHandled(fd: FormData) {
  const id = String(fd.get('id') || '')
  const handled = String(fd.get('handled') || '') === 'true'
  if (id) await db.from('contact_messages').update({ handled: !handled }).eq('id', id)
  revalidatePath('/admin/messages')
}
