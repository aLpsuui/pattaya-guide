import type { Metadata } from 'next'
import { hasLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { localeAlternates, ogDefaultImages } from '@/lib/seo'
import CategoryListing from '@/app/components/CategoryListing'
import { CONFIGS } from '@/lib/categoryConfigs'

export const revalidate = 600

const title = 'Gyms, Muay Thai & Yoga in Pattaya | Go To Pattaya'
const description =
  'A locally verified guide to training in Pattaya - Muay Thai camps, gyms, CrossFit, yoga and pilates studios, with prices, hours and directions.'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  return {
    title: t(title),
    description: t(description),
    alternates: localeAlternates(locale, '/yoga-and-fitness'),
    openGraph: { title: t(title), description: t(description), images: ogDefaultImages },
  }
}

export default async function YogaFitnessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <CategoryListing cfg={CONFIGS['yoga-and-fitness']} lang={lang} />
}
