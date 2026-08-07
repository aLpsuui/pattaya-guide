import type { Metadata, Viewport } from 'next'
import '../globals.css'
import { notFound } from 'next/navigation'
import Analytics from '../components/Analytics'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import MobileTabBar from '@/app/components/MobileTabBar'
import ChatWidget from '@/app/components/ChatWidget'
import { getSiteSettings } from '@/lib/siteSettings'
import { locales, hasLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, INDEXABLE, GA_ID } from '@/lib/site'
import { ogDefaultImages } from '@/lib/seo'

// This is the site's ROOT layout: it lives under the [lang] segment so it can
// render <html lang={lang}> server-side (Yandex weights the lang attribute and
// tolerates the JS fix less than Google). There is no app/layout.tsx; /admin has
// its own root layout, and app/global-not-found.tsx covers unmatched top-level
// URLs. Both locales are statically pre-rendered (generateStaticParams).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Go To Pattaya - Your complete guide to Pattaya',
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: 'Go To Pattaya - Your complete guide to Pattaya',
    description: SITE_DESCRIPTION,
    locale: 'en_US',
    images: ogDefaultImages,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Go To Pattaya - Your complete guide to Pattaya',
    description: SITE_DESCRIPTION,
    images: ogDefaultImages,
  },
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = { themeColor: '#034487' }

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
      description: SITE_DESCRIPTION,
      areaServed: { '@type': 'City', name: 'Pattaya', addressCountry: 'TH' },
      sameAs: [
        'https://www.instagram.com/gotopattayacom',
        'https://www.facebook.com/profile.php?id=61591161493028',
        'https://x.com/gotopattayacom',
        'https://www.linkedin.com/company/go-to-pattaya',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

// Pre-render both locales at build.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangRootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [{ logo_url }, dict] = await Promise.all([getSiteSettings(), getDictionary(lang)])

  return (
    <html lang={lang}>
      <head>
        {/* Warm up the image hosts so the first venue/hero images start sooner. */}
        <link rel="preconnect" href="https://cdn.gotopattaya.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://hjkcmxfmismliskipedz.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.gotopattaya.com" />
        <link rel="dns-prefetch" href="https://hjkcmxfmismliskipedz.supabase.co" />
        {/* Fonts: preconnect (incl. gstatic) + a head stylesheet so they load in
            parallel instead of chaining behind the CSS bundle's @import. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main" className="skip-link">Skip to content</a>
        <Navbar logoUrl={logo_url} dict={dict} />
        <main id="main">{children}</main>
        <Footer dict={dict} logoUrl={logo_url} />
        <MobileTabBar dict={dict} />
        <ChatWidget dict={dict} />
        {GA_ID && <Analytics gaId={GA_ID} />}
      </body>
    </html>
  )
}
