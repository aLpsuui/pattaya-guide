import { supabase } from '@/lib/supabase'
import { unstable_cache } from 'next/cache'

// Name -> slug map used to auto-link venue mentions in blog bodies (audit P0-3).
export interface VenueLink { name: string; slug: string }

// Strip a trailing location/qualifier so a listicle's short "Oasis Spa" can match
// the DB's "Oasis Spa Pattaya (Jomtien)". Crucially, chains whose core name is
// shared by several branches (e.g. "Let's Relax Spa …", "Health Land …") collapse
// to the SAME core and are dropped below as ambiguous — so a bare "Let's Relax"
// in a post is never linked to an arbitrary (wrong) branch.
function coreName(name: string): string {
  let c = name.replace(/\s*\([^)]*\)\s*$/, '')                                   // "(Jomtien)"
  c = c.replace(/\s*[-–—]\s.*$/, '')                                             // " - Pattaya Beach Front"
  c = c.replace(/\s+(North|South|Central|East|West)?\s*Pattaya(\s+(Nua|Tai|Klang))?$/i, '')
  c = c.replace(/\s+(Sukhumvit Road|Beach Road|Walking Street|Jomtien|Naklua|Pratumnak|Wong Amat|Bang Lamung|Terminal 21)$/i, '')
  return c.trim()
}

export const getVenueLinks = unstable_cache(
  async (): Promise<VenueLink[]> => {
    const { data } = await supabase.from('venues').select('name, slug').eq('is_active', true)
    const rows = (data || []) as { name: string | null; slug: string | null }[]
    // Each candidate name (full + unambiguous core) -> the set of slugs it could
    // mean. Keep ONLY names that map to exactly one slug, so a link is never
    // ambiguous. Names must be >= 8 chars to stay specific.
    const map = new Map<string, Set<string>>()
    const add = (n: string, slug: string) => {
      const t = n.trim()
      if (t.length < 8) return
      let s = map.get(t)
      if (!s) { s = new Set(); map.set(t, s) }
      s.add(slug)
    }
    for (const r of rows) {
      if (!r.slug || !r.name) continue
      add(r.name, r.slug)
      const core = coreName(r.name)
      if (core !== r.name.trim()) add(core, r.slug)
    }
    return [...map.entries()]
      .filter(([, slugs]) => slugs.size === 1)
      .map(([name, slugs]) => ({ name, slug: [...slugs][0] }))
      .sort((a, b) => b.name.length - a.name.length) // longest (most specific) first
  },
  ['venue-links-v2'],
  { revalidate: 3600, tags: ['venue-links'] },
)
