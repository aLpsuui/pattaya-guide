import './plan.css'
import Link from '@/app/components/LocaleLink'
import TripPlanner from './TripPlanner'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { hasLocale } from '@/lib/i18n/config'

// AI trip planner landing. The heavy lifting is client-side (TripPlanner posts to
// /api/plan); this server component just renders the localized shell. Results are
// generated on demand from a free-text prompt, so the page itself is static.
// Kept out of the index while it's UAT-only + experimental — flip to index when
// it ships to production.
export const metadata = {
  title: 'AI Trip Planner | Go To Pattaya',
  description: 'Describe your ideal Pattaya trip in your own words and get a day-by-day plan built from real, verified places.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/plan' },
}

// English source strings; translated example chips come from the dictionary.
const EXAMPLE_KEYS = [
  '3 days, local food and Muay Thai, nothing too touristy',
  'Relaxed weekend — spa, quiet beaches and good coffee',
  '5 days with family, kid-friendly and easy dinners',
  'Islands, diving and a bit of adrenaline',
]

export default async function PlanPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  const examples = EXAMPLE_KEYS.map((k) => t(k))

  return (
    <main id="main">
      <section className="page-hero tp-hero">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">{t('Home')}</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span className="cur">{t('AI Trip Planner')}</span>
          </nav>
          <span className="tp-kicker">{t('New')} · {t('AI Trip Planner')}</span>
          <h1>{t('Tell us your trip. Get a real plan.')}</h1>
          <p className="lead">{t('Describe what you want to do in Pattaya - days, interests, budget, vibe - and get a day-by-day plan built only from real, verified places we’ve visited.')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container tp-wrap">
          <TripPlanner lang={locale} dict={dict} examples={examples} />
        </div>
      </section>
    </main>
  )
}
