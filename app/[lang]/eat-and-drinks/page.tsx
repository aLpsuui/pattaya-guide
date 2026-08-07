import type { Metadata } from 'next'
import { hasLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { localeAlternates, ogDefaultImages } from '@/lib/seo'
import CategoryListing, { CatConfig } from '@/app/components/CategoryListing'

const title = 'Eat & Drinks in Pattaya - Where Pattaya Actually Eats | Go To Pattaya'
const description =
  'An honest, editor-curated guide to the best restaurants, cafés and rooftop bars in Pattaya. No pay-to-play. Filter by type and area to find where to eat.'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  return {
    title: t(title),
    description: t(description),
    alternates: localeAlternates(locale, '/eat-and-drinks'),
    openGraph: { title: t(title), description: t(description), images: ogDefaultImages },
  }
}

const cfg: CatConfig = {
  slug: 'eat-and-drinks',
  kicker: 'Eat & Drinks · Pattaya',
  h1: 'Where Pattaya actually eats',
  em: 'actually',
  lead: 'From morning latte art to late-night rooftop plates - a hand-picked, honestly-ranked guide to the city’s tables, cafés and bars. No paid placements.',
  heroImg: 'best-restaurants-pattaya.webp',
  heroImg2: 'nitan-coffee-pattaya.webp',
  badge: 'Locally verified · weekly',
  searchPlaceholder: 'Search restaurants, cafés, cuisines…',
  unit: 'places',
  typeLabel: 'Type',
  typeIcon: 'eat',
  primaryGroups: [
    { slug: 'cafe', label: 'Cafés & Coffee', icon: 'coffee', match: ['coffee', 'café', 'cafe', 'roaster', 'espresso', 'brew', 'bakery', 'dessert', 'patisserie', 'tea'] },
    { slug: 'bar', label: 'Bars & Rooftops', icon: 'bars', match: ['bar', 'pub', 'rooftop', 'lounge', 'beer', 'brewery', 'cocktail', 'wine', 'tavern'] },
    { slug: 'restaurant', label: 'Restaurants', icon: 'eat', match: ['restaurant', 'thai', 'indian', 'grill', 'bbq', 'seafood', 'steak', 'italian', 'cuisine', 'eatery', 'diner', 'buffet', 'bistro', 'kitchen', 'food', 'ramen', 'sushi', 'pizza', 'burger'] },
  ],
}

export default async function EatDrinksPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <CategoryListing cfg={cfg} lang={lang} />
}
