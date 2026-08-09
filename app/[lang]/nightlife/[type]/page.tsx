import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { localeAlternates, ogDefaultImages } from '@/lib/seo'
import CategoryListing from '@/app/components/CategoryListing'
import { CONFIGS, SUBCOPY } from '@/lib/categoryConfigs'

export const revalidate = 600

const SLUG = 'nightlife'
const PATH = '/nightlife'

export function generateStaticParams() {
  return Object.keys(SUBCOPY[SLUG]).map((type) => ({ type }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; type: string }> }): Promise<Metadata> {
  const { lang, type } = await params
  const sub = SUBCOPY[SLUG][type]
  if (!sub) return {}
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  return {
    title: t(sub.title),
    description: t(sub.description),
    alternates: localeAlternates(locale, `${PATH}/${type}`),
    openGraph: { title: t(sub.title), description: t(sub.description), images: ogDefaultImages },
  }
}

export default async function Page({ params }: { params: Promise<{ lang: string; type: string }> }) {
  const { lang, type } = await params
  const sub = SUBCOPY[SLUG][type]
  if (!sub) notFound()
  return <CategoryListing cfg={CONFIGS[SLUG]} lang={lang} sub={sub} />
}
