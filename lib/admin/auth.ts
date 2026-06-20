// Password gate for /admin. One shared admin password (ADMIN_PASSWORD env).
// A correct password sets an httpOnly cookie whose value is an unguessable
// token derived from the password; the proxy checks for that token.
export const COOKIE_NAME = 'pg_admin'
export const ADMIN_BASE = '/admin'

export async function sessionToken(): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD || 'change-me'
  const data = new TextEncoder().encode(`pg-admin:${secret}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || 'change-me'
  return input.length > 0 && input === expected
}
