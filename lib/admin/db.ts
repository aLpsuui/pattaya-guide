import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client (service role). Used by the /admin panel for all
// reads and writes. Never import from a Client Component — the key stays server-side.
// Fall back to harmless placeholders so importing this module never throws at
// build time when env isn't present yet. At runtime the real env is used.
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'missing-service-role-key'

export const db = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

export const STORAGE_BASE = `${url}/storage/v1/object/public`
