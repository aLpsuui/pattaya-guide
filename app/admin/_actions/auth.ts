'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { COOKIE_NAME, sessionToken, checkPassword } from '@/lib/admin/auth'

export async function login(_prev: unknown, formData: FormData) {
  const password = String(formData.get('password') || '')
  const next = String(formData.get('next') || '/admin')
  if (!checkPassword(password)) return { error: 'Wrong password.' }
  const jar = await cookies()
  jar.set(COOKIE_NAME, await sessionToken(), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
    path: '/', maxAge: 60 * 60 * 24 * 7,
  })
  redirect(next.startsWith('/admin') ? next : '/admin')
}

export async function logout() {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
  redirect('/admin/login')
}
