import type { Metadata } from 'next'
import { hasLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { localeAlternates, ogDefaultImages } from '@/lib/seo'
import CategoryListing from '@/app/components/CategoryListing'
import { CONFIGS } from '@/lib/categoryConfigs'

export const revalidate = 600

const title = 'Pattaya Nightlife - Clubs, Bars & Go-Go Bars | Go To Pattaya'
const description =
  "An honest, locally verified guide to Pattaya nightlife - EDM clubs, Walking Street bars, go-go bars, lounges and night markets, with hours and directions."
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  return {
    title: t(title),
    description: t(description),
    alternates: localeAlternates(locale, '/nightlife'),
    openGraph: { title: t(title), description: t(description), images: ogDefaultImages },
  }
}

export default async function NightlifePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <CategoryListing cfg={CONFIGS['nightlife']} lang={lang} />
}
