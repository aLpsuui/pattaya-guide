import { notFound } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import MobileTabBar from '@/app/components/MobileTabBar'
import ChatWidget from '@/app/components/ChatWidget'
import { getSiteSettings } from '@/lib/siteSettings'
import { locales, hasLocale } from '@/lib/i18n/config'

// Public chrome, rendered per-locale. Admin is outside [lang] so it never gets
// this. Pre-render both locales.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const { logo_url } = await getSiteSettings()

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar logoUrl={logo_url} />
      <main id="main">{children}</main>
      <Footer logoUrl={logo_url} />
      <MobileTabBar />
      <ChatWidget />
    </>
  )
}
