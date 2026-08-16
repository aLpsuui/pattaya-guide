import { createHandler } from '@autonoma-ai/server-web'
import { factories } from '@/lib/autonoma/factories'
import { COOKIE_NAME, sessionToken } from '@/lib/admin/auth'

// Autonoma Environment Factory endpoint. Seeds/tears down isolated test data via
// the factories in lib/autonoma/factories.ts (which call the app's real creation
// paths). HMAC signing is the gate — the SDK verifies x-signature against
// AUTONOMA_SHARED_SECRET and rejects unsigned/tampered requests with 401.
//
// Runs on the Node.js runtime: factories use the service-role Supabase client
// and node:crypto.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const handler = createHandler({
  // Single-tenant content site: no organization/workspace root. venue_id is the
  // FK on the most models; it is used only to label the discover schema.
  scopeField: 'venue_id',
  sharedSecret: process.env.AUTONOMA_SHARED_SECRET ?? '',
  signingSecret: process.env.AUTONOMA_SIGNING_SECRET ?? '',
  factories,
  // This app has no per-user login for public content; the only credential is
  // the shared admin password gate (/admin). Return a REAL admin session cookie
  // (the exact value the app sets on a successful login) plus the login password
  // so the test runner can drive the admin content-management flows — never a
  // placeholder token.
  auth: async () => {
    const token = await sessionToken()
    return {
      cookies: [
        { name: COOKIE_NAME, value: token, httpOnly: true, sameSite: 'lax', path: '/' },
      ],
      credentials: { password: process.env.ADMIN_PASSWORD ?? '' },
    }
  },
})

export const POST = handler
