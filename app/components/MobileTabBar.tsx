'use client'
import { usePathname } from 'next/navigation'
import Link from '@/app/components/LocaleLink'
import { locales } from '@/lib/i18n/config'

export default function MobileTabBar({ dict }: { dict?: Record<string, string> }) {
  const pathname = usePathname() || '/'
  const t = (s: string) => dict?.[s] ?? s
  // Strip the locale prefix so the active state matches under /en and /ru.
  const seg = pathname.split('/')
  const stripped = (locales as readonly string[]).includes(seg[1]) ? '/' + seg.slice(2).join('/') : pathname
  const path = stripped === '' ? '/' : stripped

  return (
    <nav className="mobile-tabbar" aria-label="Mobile navigation">
      <div className="mobile-tabbar-inner">
        <Link href="/" className={`tab-item${path === '/' ? ' active' : ''}`}>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>{t('Home')}</span>
        </Link>
        <Link href="/#cats" className="tab-item">
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>{t('Explore')}</span>
        </Link>
        <Link href="/map" className={`tab-item${path === '/map' ? ' active' : ''}`}>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"/></svg>
          <span>{t('Map')}</span>
        </Link>
        <Link href="/blog" className={`tab-item${path.startsWith('/blog') ? ' active' : ''}`}>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <span>{t('Guides')}</span>
        </Link>
        <Link href="/plan-my-trip" className={`tab-item${path === '/plan-my-trip' ? ' active' : ''}`}>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>
          <span>{t('Plan')}</span>
        </Link>
      </div>
    </nav>
  )
}
