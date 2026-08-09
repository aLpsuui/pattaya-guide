// Curated sub-category groups per category. The raw `venue_type` field is far too
// granular (128+ distinct values across the venues: "Coffee Shop", "Specialty
// Coffee", "Garden Café"… dozens of near-duplicates), so each category maps its
// types into a handful of clean groups. A venue is assigned to the FIRST group
// whose regex matches its type (order matters); the last group uses /.*/ as an
// explicit catch-all so no venue is ever lost. Both the nav menu (lib/navMenu.ts)
// and the category-page filter rail (CategoryListing) read these groups, and menu
// counts are computed live from the DB against them — so a count can never drift
// into fiction again.
//
// Labels are Title Case (every word capitalised). `icon` is an Icon name used by
// the category-page filter rail; the nav menu shows label + live count only.

export interface VGroup { key: string; label: string; icon: string; match: RegExp }

// Keyed by the DB category slug ("thinks-to-do" is the legacy Things-to-Do slug).
export const CATEGORY_GROUPS: Record<string, VGroup[]> = {
  'eat-and-drinks': [
    { key: 'cafes', label: 'Cafés & Coffee', icon: 'coffee', match: /caf[eé]|coffee|roaster|espresso|bakery|patisserie|brunch|bubble tea|dessert/i },
    { key: 'markets', label: 'Night Markets', icon: 'shopping', match: /market|bazaar/i },
    { key: 'restaurants', label: 'Restaurants', icon: 'eat', match: /.*/ },
  ],
  'thinks-to-do': [
    { key: 'temples', label: 'Temples & Culture', icon: 'attractions', match: /temple|culture|landmark/i },
    { key: 'diving', label: 'Diving & Snorkeling', icon: 'diving', match: /diving|snorkel/i },
    { key: 'beaches', label: 'Beaches & Water Sports', icon: 'beach', match: /island|beach|sea|watersport|water park/i },
    { key: 'adventure', label: 'Adventure & Adrenaline', icon: 'route', match: /adventure|adrenaline|atv|off-road|bungee|zipline|skydiv|kart|paintball|airsoft|shooting|racing|golf|nature|wildlife/i },
    { key: 'rental', label: 'Bike & Car Rental', icon: 'transport', match: /rental|\brent\b|motorbike|\bbike\b|motors/i },
    { key: 'tours', label: 'Tours & Day Trips', icon: 'tours', match: /.*/ },
  ],
  'nightlife': [
    { key: 'gogo', label: 'Go-Go Bars', icon: 'moon', match: /go-?go/i },
    { key: 'clubs', label: 'Clubs', icon: 'nightlife', match: /club/i },
    { key: 'bars', label: 'Bars & Lounges', icon: 'bars', match: /.*/ },
  ],
  'yoga-and-fitness': [
    { key: 'muay-thai', label: 'Muay Thai', icon: 'muay-thai', match: /muay|boxing|kickbox|combat|\bmma\b|fighter/i },
    { key: 'martial-arts', label: 'Martial Arts', icon: 'muay-thai', match: /martial|taekwondo|climb/i },
    { key: 'yoga', label: 'Yoga & Pilates', icon: 'wellness', match: /yoga|pilates/i },
    { key: 'gyms', label: 'Gyms & Fitness', icon: 'live', match: /.*/ },
  ],
  'wellness-and-beauty': [
    { key: 'onsen', label: 'Onsen & Sauna', icon: 'massage', match: /onsen|sauna/i },
    { key: 'spa', label: 'Spa & Massage', icon: 'wellness', match: /.*/ },
  ],
}

// Which group key a venue_type belongs to within a category (null if the
// category isn't grouped or the type is empty).
export function groupKeyForType(categorySlug: string, venueType: string | null | undefined): string | null {
  const groups = CATEGORY_GROUPS[categorySlug]
  if (!groups) return null
  const t = venueType || ''
  for (const g of groups) if (g.match.test(t)) return g.key
  return groups[groups.length - 1]?.key ?? null
}

export function groupsForCategory(categorySlug: string): VGroup[] {
  return CATEGORY_GROUPS[categorySlug] || []
}
