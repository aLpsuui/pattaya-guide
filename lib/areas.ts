// Curated Pattaya areas/districts with approximate centre coordinates.
// Used by the explore map and as a coordinate fallback for venues whose
// own lat/lng aren't set yet (matched via the venue's neighborhood text).
export interface Area {
  slug: string
  name: string
  lat: number
  lng: number
  vibes: string[]
  // neighborhood substrings (case-insensitive) that map a venue to this area
  match: string[]
  image: string // asset filename for cards / mega-menu
}

// The 7 official areas (must match the /areas page taxonomy + legend vibes).
export const AREAS: Area[] = [
  { slug: 'central-pattaya', name: 'Central Pattaya', lat: 12.9329, lng: 100.8821, vibes: ['Nightlife', 'Foodie', 'Backpacker'], match: ['Central Pattaya', 'Central', 'Beach Road', 'Soi Buakhao'], image: 'pattaya-city-beach-2.webp' },
  { slug: 'jomtien', name: 'Jomtien', lat: 12.8920, lng: 100.8760, vibes: ['Beach', 'Family', 'Quiet'], match: ['Jomtien', 'Na Jomtien', 'Thappraya'], image: 'best-island-pattaya.jpg' },
  { slug: 'naklua', name: 'Naklua', lat: 12.9620, lng: 100.8905, vibes: ['Local', 'Quiet', 'Foodie'], match: ['Naklua', 'North Pattaya'], image: 'SanctuaryofTruth.jpg' },
  { slug: 'pratumnak-hill', name: 'Pratumnak Hill', lat: 12.9180, lng: 100.8650, vibes: ['Quiet', 'Luxury', 'Beach'], match: ['Pratumnak', 'Pratamnak', 'Phra Tamnak'], image: 'best-island-pattaya.jpg' },
  { slug: 'wong-amat', name: 'Wong Amat', lat: 12.9760, lng: 100.8880, vibes: ['Luxury', 'Beach', 'Quiet'], match: ['Wong Amat', 'Wongamat'], image: 'pattaya-city-beach-1.jpg' },
  { slug: 'walking-street', name: 'Walking Street', lat: 12.9230, lng: 100.8780, vibes: ['Nightlife', 'Backpacker'], match: ['Walking Street', 'South Pattaya'], image: 'pattaya-night-clubs-1.jpg' },
  { slug: 'islands', name: 'Islands', lat: 12.9180, lng: 100.7830, vibes: ['Beach', 'Snorkel', 'Day-trip'], match: ['Koh Larn', 'Island'], image: 'Coral-Island-pattaya.jpg' },
]

export const areaBySlug = (slug: string) => AREAS.find((a) => a.slug === slug)

// Pick an area centre for a venue that has no coordinates, from its
// neighborhood string (e.g. "Naklua · Bang Lamung").
export function areaCenterFor(neighborhood: string | null): { lat: number; lng: number } {
  const n = (neighborhood || '').toLowerCase()
  if (/naklua|wongamat|terminal 21|grande|north/.test(n)) return { lat: 12.962, lng: 100.8905 }
  if (/jomtien|thappraya/.test(n)) return { lat: 12.892, lng: 100.876 }
  if (/pratumnak|phra tamnak/.test(n)) return { lat: 12.918, lng: 100.865 }
  if (/thepprasit/.test(n)) return { lat: 12.905, lng: 100.883 }
  if (/central|buakhao|walking|beach|chalermphrakiat|nong prue|sukhumvit|holiday inn/.test(n)) return { lat: 12.927, lng: 100.882 }
  return { lat: 12.9276, lng: 100.8771 }
}
