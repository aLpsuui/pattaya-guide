'use server'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { COOKIE_NAME, sessionToken, checkPassword } from '@/lib/admin/auth'

// Best-effort per-IP login throttle. Serverless instances are short-lived so
// this isn't bulletproof, but with the artificial delay it makes brute-forcing
// the shared admin password impractical.
const attempts = new Map<string, { n: number; t: number }>()
const WINDOW_MS = 15 * 60_000
const MAX_FAILS = 8

export async function login(_prev: unknown, formData: FormData) {
  const h = await headers()
  const ip = (h.get('x-forwarded-for') || 'local').split(',')[0].trim()
  const now = Date.now()
  const prev = attempts.get(ip)
  const active = prev && now - prev.t < WINDOW_MS ? prev : null
  if (active && active.n >= MAX_FAILS) {
    return { error: 'Too many attempts. Please wait a few minutes and try again.' }
  }

  const password = String(formData.get('password') || '')
  const next = String(formData.get('next') || '/admin')
  if (!checkPassword(password)) {
    const rec = active || { n: 0, t: now }
    rec.n += 1
    rec.t = now
    attempts.set(ip, rec)
    await new Promise((r) => setTimeout(r, 500)) // slow automated guessing
    return { error: 'Wrong password.' }
  }

  attempts.delete(ip)
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
