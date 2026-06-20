import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileTabBar from './components/MobileTabBar'
import RootChrome from './components/RootChrome'
import { getMegaData } from '@/lib/megaNav'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, INDEXABLE } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Go To Pattaya — Your complete guide to Pattaya',
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  robots: INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: 'Go To Pattaya — Your complete guide to Pattaya',
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Go To Pattaya — Your complete guide to Pattaya',
    description: SITE_DESCRIPTION,
  },
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  themeColor: '#034487',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.ico`,
      description: SITE_DESCRIPTION,
      areaServed: { '@type': 'City', name: 'Pattaya', addressCountry: 'TH' },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
    },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const mega = await getMegaData()
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <RootChrome navbar={<Navbar mega={mega} />} footer={<><Footer /><MobileTabBar /></>}>
          {children}
        </RootChrome>
      </body>
    </html>
  )
}
