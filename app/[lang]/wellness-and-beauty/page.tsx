import type { Metadata } from 'next'
import { hasLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { localeAlternates, ogDefaultImages } from '@/lib/seo'
import CategoryListing from '@/app/components/CategoryListing'
import { CONFIGS } from '@/lib/categoryConfigs'

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

export default async function WellnessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <CategoryListing cfg={CONFIGS['wellness-and-beauty']} lang={lang} />
}
