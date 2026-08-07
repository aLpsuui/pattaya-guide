import type { Metadata } from 'next'
import ExploreMap from '@/app/components/ExploreMap'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { hasLocale } from '@/lib/i18n/config'
import { localeAlternates, ogDefaultImages } from '@/lib/seo'

const title = 'Pattaya Map - Every venue & area on one map | Go To Pattaya'
const description = 'Explore Pattaya on an interactive map: spas, venues and districts. Filter by areas or places and open any spot.'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  return {
    title: t(title),
    description: t(description),
    alternates: localeAlternates(locale, '/map'),
    openGraph: { title: t(title), description: t(description), images: ogDefaultImages },
  }
}

export default async function MapPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s

  return (
    <main id="main" className="exmap-page">
      <div className="exmap-page-head">
        <span className="kicker">{t('Interactive map')}</span>
        <h1>{t('Explore Pattaya on the map')}</h1>
        <p>{t('Every venue and area across the city - filter by places or districts and tap any pin to open it.')}</p>
      </div>
      <ExploreMap />
    </main>
  )
}
