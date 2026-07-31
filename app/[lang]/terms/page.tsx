import type { Metadata } from 'next'
import Link from '@/app/components/LocaleLink'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { hasLocale } from '@/lib/i18n/config'

const title = 'Terms of Use | Go To Pattaya'
const description = 'The terms of use for Go To Pattaya - the rules for using our Pattaya travel guide, directory and content, plus liability, links and contact details.'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/terms` },
    openGraph: { title, description },
  }
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s

  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">{t('Home')}</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span className="cur">{t('Terms of Use')}</span>
          </nav>
          <div className="kicker" style={{ marginTop: 'var(--s3)' }}>{t('Legal')}</div>
          <h1>{t('Terms of Use')}</h1>
          <p className="lead">{t('The rules for using Go To Pattaya.')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="prose">
            <p style={{ color: 'var(--ink-400)', fontSize: 14 }}>{t('Last updated: 24 June 2026')}</p>
            <p>{t('By using Go To Pattaya you agree to these terms. If you do not agree, please do not use the site. These terms may change over time; continued use after an update means you accept the revised terms.')}</p>

            <h2>{t('Using this site')}</h2>
            <p>{t('Go To Pattaya is an independent travel guide provided for general information only. We work hard to keep details accurate, but ')}<strong>{t('listings, prices, opening hours and availability change frequently and may be out of date')}</strong>{t(' - always confirm directly with a venue or operator before relying on anything here. You agree to use the site lawfully and not to disrupt it, scrape it at scale, or misuse its content.')}</p>

            <h2>{t('Listings & reviews')}</h2>
            <p>{t('Our rankings and recommendations are editorial. ')}<strong>{t('We do not accept payment for a higher position')}</strong>{t(' - paying for a listing never moves a venue up the order. We add, update and remove venues at our discretion based on our own research and reader feedback. Where a link is an affiliate or a partnership is in place, we aim to disclose it; such arrangements do not change our editorial judgement.')}</p>

            <h2>{t('Intellectual property')}</h2>
            <p>{t('The site’s text, design, logo and original photography are owned by Go To Pattaya or used under licence, and are protected by applicable law. You may share links and brief quotations with attribution, but you may not republish, copy or use our content commercially without written permission. Third-party trademarks and images remain the property of their owners.')}</p>

            <h2>{t('Liability')}</h2>
            <p>{t('The site is provided “as is” without warranties of any kind. To the fullest extent permitted by law, we are not liable for any loss or damage arising from your use of the site or reliance on its content, or from third-party websites we link to (which we do not control or endorse).')}</p>

            <h2>{t('Governing law')}</h2>
            <p>{t('These terms are governed by the laws of Thailand, without regard to conflict-of-law rules.')}</p>

            <h2>{t('Contact')}</h2>
            <p>{t('Questions? ')}<Link className="inline" href="/contact" style={{ color: 'var(--ocean)', fontWeight: 600 }}>{t('Contact us')}</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
