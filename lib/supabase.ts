import { createClient } from '@supabase/supabase-js'

// The URL + anon key are public (they ship to the browser anyway). Fall back to
// the production project so a missing build-time env var never crashes the build
// ("supabaseUrl is required"). When env is set (e.g. on Vercel) it takes over.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hjkcmxfmismliskipedz.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqa2NteGZtaXNtbGlza2lwZWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NzA0OTIsImV4cCI6MjA5ODU0NjQ5Mn0.2pz6jlQOhlH7-5lQ7kk_ZbRbFdlOXiKJqyZ6Q6Bdce4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)