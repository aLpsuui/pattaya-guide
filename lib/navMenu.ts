import { supabase } from '@/lib/supabase'
import { unstable_cache } from 'next/cache'
import { CATEGORY_GROUPS, groupKeyForType } from '@/lib/venueGroups'
import { AREAS } from '@/lib/areas'

// The site's primary navigation, built LIVE from the DB so every pillar and every
// sub-item count reflects real venues (no more hand-typed, drifting numbers). The
// clean sub-groups come from lib/venueGroups (shared with the category pages), so
// a submenu item and its category-page filter button are always the same bucket.
//
// Structural choices baked in here (per product decisions):
//  - "Sports & Fitness" is the public label for the yoga-and-fitness category.
//  - Nightlife is its own pillar (Clubs / Bars & Lounges / Go-Go Bars).
//  - Night markets are food-first, so they live under Eat & Drinks, not Nightlife.
//  - Wellness & Beauty is a single flat link (no submenu).
//  - Islands is an Area (a destination), reached from the Areas pillar.

export interface NavSub { label: string; count: number; href: string }
export interface NavPillar { key: string; label: string; icon: string; href: string; subs: NavSub[]; flat?: boolean }

const routeFor = (slug: string) => (slug === 'thinks-to-do' ? '/things-to-do' : `/${slug}`)

// Category pillars in display order. `label` overrides the DB name where the
// public wording differs (yoga-and-fitness → "Sports & Fitness").
const PILLARS: { key: string; label: string; icon: string; flat?: boolean }[] = [
  { key: 'eat-and-drinks', label: 'Eat & Drinks', icon: 'eat' },
  { key: 'thinks-to-do', label: 'Things to Do', icon: 'tours' },
  { key: 'nightlife', label: 'Nightlife', icon: 'nightlife' },
  { key: 'yoga-and-fitness', label: 'Sports & Fitness', icon: 'muay-thai' },
  { key: 'wellness-and-beauty', label: 'Wellness & Beauty', icon: 'wellness', flat: true },
]

type Row = { venue_type: string | null; neighborhood: string | null; categories: { slug: string } | null }

export const getNavMenu = unstable_cache(
  async (): Promise<NavPillar[]> => {
    const { data } = await supabase
      .from('venues')
      .select('venue_type, neighborhood, categories!inner(slug)')
      .eq('is_active', true)
    const rows = (data || []) as unknown as Row[]

    const out: NavPillar[] = []

    for (const p of PILLARS) {
      const href = routeFor(p.key)
      if (p.flat) {
        out.push({ ...p, href, subs: [] })
        continue
      }
      const groups = CATEGORY_GROUPS[p.key] || []
      const catRows = rows.filter((r) => r.categories?.slug === p.key)
      const subs: NavSub[] = groups
        .map((g) => ({
          label: g.label,
          count: catRows.filter((r) => groupKeyForType(p.key, r.venue_type) === g.key).length,
          href: `${href}?type=${g.key}`,
        }))
        .filter((s) => s.count > 0)
      out.push({ ...p, href, subs })
    }

    // Areas pillar — curated destinations (incl. Islands), counted by matching a
    // venue's neighborhood against the area's known name fragments.
    const areaSubs: NavSub[] = AREAS.map((a) => {
      const m = a.match.map((s) => s.toLowerCase())
      return {
        label: a.name,
        count: rows.filter((r) => {
          const nb = (r.neighborhood || '').toLowerCase()
          return m.some((frag) => nb.includes(frag))
        }).length,
        href: `/areas/${a.slug}`,
      }
    })
    out.push({ key: 'areas', label: 'Areas', icon: 'pin', href: '/areas', subs: areaSubs })

    return out
  },
  ['nav-menu-v1'],
  { revalidate: 600, tags: ['mega-nav'] },
)
