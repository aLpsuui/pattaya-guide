import type { Metadata } from 'next'
import { hasLocale } from '@/lib/i18n/config'
import CategoryListing, { type CatConfig } from '@/app/components/CategoryListing'

export const revalidate = 600

const title = 'Pattaya Nightlife - Clubs, Bars & Go-Go Bars | Go To Pattaya'
const description =
  "An honest, locally verified guide to Pattaya nightlife - EDM clubs, Walking Street bars, go-go bars, lounges and night markets, with hours and directions."
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/nightlife` },
    openGraph: { title, description },
  }
}

const cfg: CatConfig = {
  slug: 'nightlife',
  kicker: 'Nightlife · Pattaya',
  h1: 'Where Pattaya comes alive after dark',
  em: 'comes alive',
  lead: 'From the world-ranked mega-clubs to legendary Walking Street discos, go-go bars and late-night markets - a locally verified guide to every kind of night out.',
  heroImg: 'pattaya-night-clubs-1.webp',
  heroImg2: 'pattaya-night-clubs-2.webp',
  badge: 'Locally verified · weekly',
  searchPlaceholder: 'Search clubs, bars, go-go, music…',
  unit: 'venues',
}

export default async function NightlifePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <CategoryListing cfg={cfg} lang={lang} />
}
