import type { Metadata } from 'next'
import { hasLocale } from '@/lib/i18n/config'
import CategoryListing, { type CatConfig } from '@/app/components/CategoryListing'

export const revalidate = 600

const title = 'Gyms, Muay Thai & Yoga in Pattaya | Go To Pattaya'
const description =
  'A locally verified guide to training in Pattaya - Muay Thai camps, gyms, CrossFit, yoga and pilates studios, with prices, hours and directions.'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/yoga-and-fitness` },
    openGraph: { title, description },
  }
}

const cfg: CatConfig = {
  slug: 'yoga-and-fitness',
  kicker: 'Gym, Muay Thai & Yoga · Pattaya',
  h1: 'Train hard, recover well in Pattaya',
  em: 'Train hard',
  lead: "From world-famous Muay Thai camps to 24-hour fitness gyms, yoga and pilates studios and climbing walls - find where to train, with real prices and the city's highest-rated coaches.",
  heroImg: 'pattaya-muay-thai-1.webp',
  heroImg2: 'pattaya-yoga-1.webp',
  badge: 'Locally verified · weekly',
  searchPlaceholder: 'Search gyms, Muay Thai, yoga…',
  unit: 'venues',
}

export default async function YogaFitnessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <CategoryListing cfg={cfg} lang={lang} />
}
