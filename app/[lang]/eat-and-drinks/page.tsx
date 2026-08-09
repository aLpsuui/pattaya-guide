import type { Metadata } from 'next'
import { hasLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { localeAlternates, ogDefaultImages } from '@/lib/seo'
import CategoryListing from '@/app/components/CategoryListing'
import { CONFIGS } from '@/lib/categoryConfigs'

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

export default async function EatDrinksPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <CategoryListing cfg={CONFIGS['eat-and-drinks']} lang={lang} />
}
