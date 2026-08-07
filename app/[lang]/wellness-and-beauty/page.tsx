import type { Metadata } from 'next'
import { hasLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { localeAlternates, ogDefaultImages } from '@/lib/seo'
import CategoryListing, { type CatConfig } from '@/app/components/CategoryListing'

export const revalidate = 600

const title = 'Spa, Massage & Wellness in Pattaya | Go To Pattaya'
const description =
  'A locally verified guide to wellness in Pattaya - Thai and oil massage, day spas, luxury spa resorts, beauty and nail salons. Real prices, hours and directions for every venue.'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  return {
    title: t(title),
    description: t(description),
    alternates: localeAlternates(locale, '/wellness-and-beauty'),
    openGraph: { title: t(title), description: t(description), images: ogDefaultImages },
  }
}

const cfg: CatConfig = {
  slug: 'wellness-and-beauty',
  kicker: 'Wellness & Beauty · Pattaya',
  h1: 'Relax, restore and be pampered',
  em: 'restore',
  lead: 'From honest neighbourhood Thai-massage shops to luxury spa resorts and beauty salons - a locally verified guide to where Pattaya unwinds, with real prices and hours.',
  heroImg: 'pattaya-wellness-1.webp',
  heroImg2: 'best-restaurants-pattaya.webp',
  badge: 'Locally verified · weekly',
  searchPlaceholder: 'Search spa, massage, beauty…',
  unit: 'venues',
}

export default async function WellnessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <CategoryListing cfg={cfg} lang={lang} />
}
