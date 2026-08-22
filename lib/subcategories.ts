// Controlled subcategory ("tag") taxonomy — the clean, finite vocabulary that
// replaces the messy free-text `venue_type` for filtering, card tags and
// breadcrumbs. Each subcategory belongs to exactly one venueGroups group (the
// SEO landing-page level), so the hierarchy is: category → group → subcategory.
//
// The DB gains a clean `venues.subcategory` slug column (one per venue, set via
// an admin dropdown). `subcatForType()` normalizes the legacy free-text
// venue_type into this vocabulary — used to backfill the column once and as a
// runtime fallback for any venue whose subcategory is still null.

export interface SubCat { slug: string; label: string; group: string }

// Keyed by DB category slug ("thinks-to-do" is the legacy Things-to-Do slug).
// Order within a category = display order in the admin dropdown + filter rail.
export const SUBCATS: Record<string, SubCat[]> = {
  'eat-and-drinks': [
    // Restaurants split by cuisine/type (LLM-classified into the stored column,
    // since the free-text venue_type is just "Restaurants").
    { slug: 'thai', label: 'Thai', group: 'restaurants' },
    { slug: 'seafood', label: 'Seafood', group: 'restaurants' },
    { slug: 'japanese', label: 'Japanese', group: 'restaurants' },
    { slug: 'korean', label: 'Korean', group: 'restaurants' },
    { slug: 'chinese', label: 'Chinese', group: 'restaurants' },
    { slug: 'indian', label: 'Indian', group: 'restaurants' },
    { slug: 'italian', label: 'Italian & Pizza', group: 'restaurants' },
    { slug: 'steakhouse-grill', label: 'Steakhouse & Grill', group: 'restaurants' },
    { slug: 'rooftop-beach-club', label: 'Rooftop & Beach Club', group: 'restaurants' },
    { slug: 'international-restaurant', label: 'International', group: 'restaurants' },
    { slug: 'coffee-cafe', label: 'Coffee & Café', group: 'cafes' },
    { slug: 'specialty-coffee', label: 'Specialty Coffee', group: 'cafes' },
    { slug: 'bakery-brunch', label: 'Bakery & Brunch', group: 'cafes' },
    { slug: 'night-market', label: 'Night Market', group: 'markets' },
  ],
  'nightlife': [
    { slug: 'nightclub', label: 'Nightclub', group: 'clubs' },
    { slug: 'go-go-bar', label: 'Go-Go Bar', group: 'gogo' },
    { slug: 'bar-lounge', label: 'Bar & Lounge', group: 'bars' },
  ],
  'thinks-to-do': [
    { slug: 'temples-culture', label: 'Temples & Culture', group: 'temples' },
    { slug: 'landmarks', label: 'Landmarks', group: 'temples' },
    { slug: 'diving-snorkeling', label: 'Diving & Snorkeling', group: 'diving' },
    { slug: 'islands-beaches', label: 'Islands & Beaches', group: 'beaches' },
    { slug: 'water-sports', label: 'Water Sports', group: 'beaches' },
    { slug: 'water-parks', label: 'Water Parks', group: 'beaches' },
    { slug: 'atv-off-road', label: 'ATV & Off-Road', group: 'adventure' },
    { slug: 'go-kart-racing', label: 'Go-Kart & Racing', group: 'adventure' },
    { slug: 'bungee-zipline', label: 'Bungee & Zipline', group: 'adventure' },
    { slug: 'skydiving', label: 'Skydiving', group: 'adventure' },
    { slug: 'paintball-airsoft', label: 'Paintball & Airsoft', group: 'adventure' },
    { slug: 'nature-wildlife', label: 'Nature & Wildlife', group: 'adventure' },
    { slug: 'golf', label: 'Golf', group: 'adventure' },
    { slug: 'adventure-activities', label: 'Adventure Activities', group: 'adventure' },
    { slug: 'bike-car-rental', label: 'Bike & Car Rental', group: 'rental' },
    { slug: 'tours-day-trips', label: 'Tours & Day Trips', group: 'tours' },
    { slug: 'transfers', label: 'Transfers', group: 'tours' },
  ],
  'yoga-and-fitness': [
    { slug: 'muay-thai', label: 'Muay Thai', group: 'muay-thai' },
    { slug: 'martial-arts', label: 'Martial Arts', group: 'martial-arts' },
    { slug: 'climbing', label: 'Climbing', group: 'martial-arts' },
    { slug: 'yoga-pilates', label: 'Yoga & Pilates', group: 'yoga' },
    { slug: 'gym-24-7', label: '24/7 Gym', group: 'gyms' },
    { slug: 'crossfit', label: 'CrossFit & Functional', group: 'gyms' },
    { slug: 'gym-fitness', label: 'Gym & Fitness', group: 'gyms' },
  ],
  'wellness-and-beauty': [
    { slug: 'onsen-sauna', label: 'Onsen & Sauna', group: 'onsen' },
    { slug: 'spa-massage', label: 'Spa & Massage', group: 'spa' },
  ],
}

// Normalization rules: FIRST matching regex wins (order = finest → coarsest),
// so specific tags beat the per-category catch-all (the last entry, match /.*/).
const RULES: Record<string, { re: RegExp; slug: string }[]> = {
  'eat-and-drinks': [
    { re: /night\s*market|bazaar/i, slug: 'night-market' },
    { re: /specialty|roaster|espresso/i, slug: 'specialty-coffee' },
    { re: /bakery|patisserie|brunch|dessert|bubble tea/i, slug: 'bakery-brunch' },
    { re: /caf[eé]|coffee/i, slug: 'coffee-cafe' },
    // Restaurant cuisine is set from the stored (LLM-classified) column; a
    // restaurant with no stored value falls back to the generic "International".
    { re: /.*/, slug: 'international-restaurant' },
  ],
  'nightlife': [
    { re: /go-?go/i, slug: 'go-go-bar' },
    { re: /club/i, slug: 'nightclub' },
    { re: /.*/, slug: 'bar-lounge' },
  ],
  'thinks-to-do': [
    { re: /atv|off-?road/i, slug: 'atv-off-road' },
    { re: /kart|racing/i, slug: 'go-kart-racing' },
    { re: /bungee|zip-?line/i, slug: 'bungee-zipline' },
    { re: /skydiv/i, slug: 'skydiving' },
    { re: /paintball|airsoft|shooting/i, slug: 'paintball-airsoft' },
    { re: /nature|wildlife/i, slug: 'nature-wildlife' },
    { re: /golf/i, slug: 'golf' },
    { re: /diving|snorkel/i, slug: 'diving-snorkeling' },
    { re: /water\s*park/i, slug: 'water-parks' },
    { re: /watersport|sea\s*&|jet\s*ski|parasail|kayak/i, slug: 'water-sports' },
    { re: /island|beach/i, slug: 'islands-beaches' },
    { re: /landmark/i, slug: 'landmarks' },
    { re: /temple|culture|shrine|museum/i, slug: 'temples-culture' },
    { re: /transfer/i, slug: 'transfers' },
    { re: /rental|\brent\b|\bbike\b|motorbike|motors|scooter/i, slug: 'bike-car-rental' },
    { re: /tour|day\s*trip|sightsee/i, slug: 'tours-day-trips' },
    { re: /adventure|adrenaline/i, slug: 'adventure-activities' },
    { re: /.*/, slug: 'tours-day-trips' },
  ],
  'yoga-and-fitness': [
    { re: /yoga|pilates/i, slug: 'yoga-pilates' },
    { re: /climb/i, slug: 'climbing' },
    { re: /muay|boxing|kickbox|combat|\bmma\b|fighter/i, slug: 'muay-thai' },
    { re: /martial|taekwondo|karate|jiu|judo/i, slug: 'martial-arts' },
    { re: /24\s*\/?\s*7|24\s*hour|round.the.clock/i, slug: 'gym-24-7' },
    { re: /crossfit|functional|strength\s*&?\s*conditioning/i, slug: 'crossfit' },
    { re: /.*/, slug: 'gym-fitness' },
  ],
  'wellness-and-beauty': [
    { re: /onsen|sauna/i, slug: 'onsen-sauna' },
    { re: /.*/, slug: 'spa-massage' },
  ],
}

// The clean subcategory slug for a (category, free-text venue_type) pair.
// Falls back to the category's catch-all, then null if the category is unknown.
export function subcatForType(categorySlug: string, venueType: string | null | undefined): string | null {
  const rules = RULES[categorySlug]
  if (!rules) return null
  const t = venueType || ''
  for (const r of rules) if (r.re.test(t)) return r.slug
  return null
}

const BY_SLUG = new Map<string, SubCat>()
for (const list of Object.values(SUBCATS)) for (const s of list) BY_SLUG.set(s.slug, s)

export const subcatBySlug = (slug: string | null | undefined): SubCat | undefined => (slug ? BY_SLUG.get(slug) : undefined)
export const subcatsForCategory = (categorySlug: string): SubCat[] => SUBCATS[categorySlug] || []
// The venueGroups group a subcategory belongs to (for the landing-page level).
export const groupForSubcat = (slug: string | null | undefined): string | null => subcatBySlug(slug)?.group ?? null
// Resolve a venue's clean subcategory: stored column first, else normalized from
// the legacy free-text type. Central helper so every surface stays consistent.
export function resolveSubcat(categorySlug: string, subcategory: string | null | undefined, venueType: string | null | undefined): string | null {
  if (subcategory && BY_SLUG.has(subcategory)) return subcategory
  return subcatForType(categorySlug, venueType)
}
