import ExploreMap from '@/app/components/ExploreMap'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { hasLocale } from '@/lib/i18n/config'

const title = 'Pattaya Map - Every venue & area on one map | Go To Pattaya'
const description = 'Explore Pattaya on an interactive map: spas, venues and districts. Filter by areas or places and open any spot.'
export const metadata = {
  title,
  description,
  alternates: { canonical: '/map' },
  openGraph: { title, description },
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
