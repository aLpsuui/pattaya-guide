// Curated Pattaya areas/districts with approximate centre coordinates.
// Used by the explore map and as a coordinate fallback for venues whose
// own lat/lng aren't set yet (matched via the venue's neighborhood text).
export interface Area {
  name: string
  lat: number
  lng: number
}

export const AREAS: Area[] = [
  { name: 'Central Pattaya', lat: 12.9329, lng: 100.8821 },
  { name: 'North Pattaya / Naklua', lat: 12.9620, lng: 100.8905 },
  { name: 'Jomtien', lat: 12.8920, lng: 100.8760 },
  { name: 'Pratumnak Hill', lat: 12.9180, lng: 100.8650 },
  { name: 'Wongamat', lat: 12.9760, lng: 100.8880 },
  { name: 'Walking Street', lat: 12.9230, lng: 100.8780 },
  { name: 'Thepprasit', lat: 12.9050, lng: 100.8830 },
  { name: 'Koh Larn', lat: 12.9180, lng: 100.7830 },
]

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
