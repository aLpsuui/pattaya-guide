import { supabase } from '@/lib/supabase'
import { unstable_cache } from 'next/cache'

// Name -> slug map used to auto-link venue mentions in blog bodies (audit P0-3).
// Only reasonably specific names (>= 8 chars) are eligible, so a mention like
// "Nitan Coffee" links but a bare common word never false-matches. Sorted
// longest-first so the alternation regex prefers the most specific name.
export interface VenueLink { name: string; slug: string }

export const getVenueLinks = unstable_cache(
  async (): Promise<VenueLink[]> => {
    const { data } = await supabase.from('venues').select('name, slug').eq('is_active', true)
    const rows = (data || []) as { name: string | null; slug: string | null }[]
    return rows
      .filter((r) => r.slug && r.name && r.name.trim().length >= 8)
      .map((r) => ({ name: r.name!.trim(), slug: r.slug! }))
      .sort((a, b) => b.name.length - a.name.length)
  },
  ['venue-links-v1'],
  { revalidate: 3600, tags: ['venue-links'] },
)
