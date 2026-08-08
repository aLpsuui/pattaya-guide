import type { Metadata } from 'next'
import Link from '@/app/components/LocaleLink'
import './contact.css'
import ContactForm from './ContactForm'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { hasLocale } from '@/lib/i18n/config'
import { localeAlternates, ogDefaultImages } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'

const title = 'Contact Us | Go To Pattaya'
const description = 'Get in touch with the Go To Pattaya team - corrections, listings and partnerships.'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  return {
    title: t(title),
    description: t(description),
    alternates: localeAlternates(locale, '/contact'),
    openGraph: { title: t(title), description: t(description), images: ogDefaultImages },
  }
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s

  const contactLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/${locale}/contact#page`,
    url: `${SITE_URL}/${locale}/contact`,
    name: t(title),
    description: t(description),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    inLanguage: locale,
  }

  return (
    <div className="about-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }} />
      <section className="page-hero">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">{t('Home')}</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span className="cur">{t('Contact')}</span>
          </nav>
          <div className="kicker" style={{ marginTop: 'var(--s3)' }}>{t('Get in touch')}</div>
          <h1>{t('Contact us')}</h1>
          <p className="lead">{t("Spotted something out of date, want your venue listed, or interested in a partnership? We'd love to hear from you.")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 style={{ fontSize: 'var(--text-h4)' }}>{t('Email us directly')}</h2>
          <div className="grid g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 'var(--s4)', marginTop: 'var(--s3)' }}>
            <div className="feature">
              <h3>{t('General & corrections')}</h3>
              <p><a href="mailto:hello@gotopattaya.com" style={{ color: 'var(--ocean)', fontWeight: 600 }}>hello@gotopattaya.com</a></p>
            </div>
            <div className="feature">
              <h3>{t('List your business')}</h3>
              <p><a href="mailto:listings@gotopattaya.com" style={{ color: 'var(--ocean)', fontWeight: 600 }}>listings@gotopattaya.com</a></p>
            </div>
            <div className="feature">
              <h3>{t('Partnerships')}</h3>
              <p><a href="mailto:partners@gotopattaya.com" style={{ color: 'var(--ocean)', fontWeight: 600 }}>partners@gotopattaya.com</a></p>
            </div>
          </div>
          <div style={{ marginTop: 'var(--s6)' }}>
            <h2 style={{ fontSize: 'var(--text-h4)' }}>{t('Send us a message')}</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{t('Prefer a form? Fill this in and it reaches our team directly.')}</p>
            <ContactForm dict={dict} />
          </div>
        </div>
      </section>
    </div>
  )
}
