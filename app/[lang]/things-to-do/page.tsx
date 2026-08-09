import type { Metadata } from 'next'
import { hasLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { localeAlternates, ogDefaultImages } from '@/lib/seo'
import CategoryListing from '@/app/components/CategoryListing'
import { CONFIGS } from '@/lib/categoryConfigs'

export const revalidate = 600

const title = 'Things to Do in Pattaya - Tours, Islands & Diving | Go To Pattaya'
const description =
  'A locally verified guide to the best things to do in Pattaya - island tours and boat trips, diving and snorkelling, ATV and adrenaline activities, plus bike, car and jet-ski rentals.'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  return {
    title: t(title),
    description: t(description),
    alternates: localeAlternates(locale, '/things-to-do'),
    openGraph: { title: t(title), description: t(description), images: ogDefaultImages },
  }
}

export default async function ThingsToDoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <CategoryListing cfg={CONFIGS['thinks-to-do']} lang={lang} />
}
