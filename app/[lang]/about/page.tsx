import type { Metadata } from 'next'
import Link from '@/app/components/LocaleLink'
import Icon from '@/app/components/Icon'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { hasLocale } from '@/lib/i18n/config'
import { localeAlternates, ogDefaultImages } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'

const ASSETS = 'https://cdn.gotopattaya.com/Assets'

const title = 'About Go To Pattaya - The Honest Local Guide to Pattaya, Thailand'
const description =
  'Who we are and how we work: an independent, locally-run directory of 500+ verified Pattaya places - no paid placements, updated weekly by editors who live here.'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  return {
    title: t(title),
    description: t(description),
    alternates: localeAlternates(locale, '/about'),
    openGraph: { title: t(title), description: t(description), images: ogDefaultImages },
  }
}

const stats = [
  { n: '500+', l: 'Verified places' },
  { n: '50+', l: 'In-depth guides' },
  { n: '9', l: 'Districts mapped' },
  { n: '0', l: 'Paid placements' },
]

const rules = [
  { icon: 'verified', h: 'Verified on the ground', p: "Every venue is visited or re-checked in person by a local editor before it's published." },
  { icon: 'calendar', h: 'Updated weekly', p: 'Hours, prices and openings change fast here. We re-verify the directory every single week.' },
  { icon: 'editors-pick', h: 'No pay-to-play', p: "Rankings can't be bought. Sponsored content is always labelled and never affects a rating." },
  { icon: 'local-verified', h: 'Written by locals', p: 'Editors who live in Pattaya - fluent in the food, the seasons, and the scams to skip.' },
]

const team = [
  { av: 'OV', name: 'Olga Vavilova', role: 'Editor · Wellness & Community', bio: "Covers spas, yoga and Pattaya's Russian-speaking community. 6 years local." },
  { av: 'NS', name: 'Niran "Nine" Sukjai', role: 'Local Editor · Food & Nightlife', bio: 'Born in Chonburi. Knows every street-food soi and rooftop bar worth your baht.' },
  { av: 'JC', name: 'James Carter', role: 'Editor · Things to Do', bio: "Tests the tours, islands and dive trips so the listings reflect what you'll actually get." },
]

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s

  const aboutLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_URL}/${locale}/about#page`,
    url: `${SITE_URL}/${locale}/about`,
    name: t(title),
    description: t(description),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: locale,
  }

  return (
    <div className="about-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd) }} />
      {/* HERO */}
      <section className="page-hero">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">{t('Home')}</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span className="cur">{t('About')}</span>
          </nav>
          <div className="kicker" style={{ marginTop: 'var(--s3)' }}>{t('Who we are')}</div>
          <h1>{t('The honest local guide to Pattaya.')}</h1>
          <p className="lead">{t('Go To Pattaya is an independent directory built by people who actually live here. We verify every place on the ground, update weekly, and never accept money to rank a venue higher. Just the real Pattaya - clearly mapped.')}</p>
          <div className="row" style={{ marginTop: 'var(--s4)', flexWrap: 'wrap' }}>
            <Link href="/plan-my-trip" className="btn btn-primary">{t('Plan my trip')}</Link>
            <Link href="/eat-and-drinks" className="btn btn-secondary">{t('Browse all places')}</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section bleed">
        <div className="container">
          <div className="stat-band">
            {stats.map(s => (
              <div key={s.l} className="stat"><b>{s.n}</b><span>{t(s.l)}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section">
        <div className="container split">
          <div className="prose">
            <div className="kicker">{t('Our story')}</div>
            <h2>{t('Built in Pattaya, for everyone who visits it.')}</h2>
            <p>{t('Pattaya is one of the most visited cities in the world - and one of the hardest to navigate honestly. Most "top 10" lists are paid, outdated, or written by people who have never set foot here.')}</p>
            <p>{t('We started Go To Pattaya to fix that. Our editors live across Central Pattaya, Jomtien and Naklua. We eat at the restaurants, take the tours, and sit in the cafés before a single one of them goes on the site.')}</p>
            <p>{t('If a place slips - prices jump, quality drops, it closes - we update it. The guide you read today reflects the Pattaya of this week, not last year.')}</p>
            <Link href="/blog" className="viewall">{t('Read our latest guides')} <Arrow /></Link>
          </div>
          <div className="media"><img src={`${ASSETS}/pattaya-city-beach-1.webp`} alt="Pattaya city beach and bay seen from above at daytime" loading="lazy" /></div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="section bleed-sunken">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">{t('How we work')}</div>
              <h2>{t('Four rules we never break')}</h2>
              <p>{t('The standards behind every listing, rating and recommendation on Go To Pattaya.')}</p>
            </div>
          </div>
          <div className="grid g4">
            {rules.map(r => (
              <article key={r.h} className="feature">
                <div className="fic"><Icon name={r.icon} size={24} /></div>
                <h3>{t(r.h)}</h3>
                <p>{t(r.p)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">{t('The editors')}</div>
              <h2>{t('Real people, on the ground')}</h2>
              <p>{t('A small, multilingual team covering food, wellness, nightlife and things to do.')}</p>
            </div>
          </div>
          <div className="grid g3">
            {team.map(member => (
              <div key={member.name} className="author">
                <div className="ava">{member.av}</div>
                <div className="who">
                  <b>{member.name}</b>
                  <span className="role">{t(member.role)}</span>
                  <p>{t(member.bio)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMISE */}
      <section className="section bleed">
        <div className="container split">
          <div className="media"><img src={`${ASSETS}/pattaya-temputre.webp`} alt="Golden Buddhist temple detail in Pattaya, Thailand" loading="lazy" /></div>
          <div className="prose">
            <div className="kicker">{t('Our promise')}</div>
            <h2>{t("If it's on Go To Pattaya, we'd send our own friends there.")}</h2>
            <ul>
              <li>{t('We label every partnership and affiliate link - clearly.')}</li>
              <li>{t('We remove places that decline quietly, no exceptions.')}</li>
              <li>{t('We answer corrections from readers and owners within 2 business days.')}</li>
              <li>{t('We keep the core guide free, with no signup wall.')}</li>
            </ul>
            <Link href="/blog" className="viewall">{t('Found something off? Tell us')} <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div className="kicker">{t('Ready when you are')}</div>
            <h2>{t('Start planning your Pattaya trip')}</h2>
            <p>{t("Tell us your dates and interests and we'll build a day-by-day itinerary from verified places - free, no signup.")}</p>
            <div className="row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/plan-my-trip" className="btn btn-primary">{t('Plan my trip')}</Link>
              <Link href="/blog" className="btn btn-secondary">{t('Read the blog')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
