'use client'
import { useState } from 'react'
import Link from '@/app/components/LocaleLink'
import BrandLogoWhite from '@/app/components/BrandLogoWhite'

const cols = [
  {
    title: 'Explore',
    links: [
      { label: 'Where to eat & drink', href: '/eat-and-drinks' },
      { label: 'Things to do', href: '/things-to-do' },
      { label: 'Nightlife & bars', href: '/nightlife' },
      { label: 'Wellness & spa', href: '/wellness-and-beauty' },
      { label: 'Gym, Muay Thai & yoga', href: '/yoga-and-fitness' },
      { label: 'Beaches & islands', href: '/areas/islands' },
      { label: 'Interactive map', href: '/map' },
      { label: 'Plan your trip', href: '/plan-my-trip' },
    ],
  },
  {
    title: 'Districts',
    links: [
      { label: 'Central Pattaya', href: '/areas/central-pattaya' },
      { label: 'Jomtien Beach', href: '/areas/jomtien' },
      { label: 'Naklua', href: '/areas/naklua' },
      { label: 'Pratumnak Hill', href: '/areas/pratumnak-hill' },
      { label: 'Wong Amat', href: '/areas/wong-amat' },
      { label: 'Walking Street', href: '/areas/walking-street' },
      { label: 'Koh Larn Island', href: '/areas/islands' },
    ],
  },
  {
    title: 'The guides',
    links: [
      { label: 'Best time to visit Pattaya', href: '/blog/best-time-to-visit-pattaya' },
      { label: 'Getting from Bangkok to Pattaya', href: '/blog/bangkok-to-pattaya' },
      { label: 'First-timer mistakes to avoid', href: '/blog/first-time-pattaya-mistakes' },
      { label: 'Pattaya on a budget: 7 days', href: '/blog/pattaya-budget-7-days' },
      { label: 'Pattaya with kids', href: '/blog/pattaya-with-kids' },
      { label: 'Is Pattaya safe? An honest take', href: '/blog/pattaya-safety' },
      { label: 'Pattaya vs Phuket', href: '/blog/pattaya-vs-phuket' },
      { label: 'All travel guides →', href: '/blog', all: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Editorial standards', href: '/about' },
      { label: 'Our editorial team', href: '/about' },
      { label: 'Submit a venue', href: '/contact' },
      { label: 'List your business', href: '/contact' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
]

// Social links - add a real URL to a platform's `href` and its icon appears.
// Empty href => not rendered (no dead links).
const SOCIALS: { label: string; href: string; stroke?: boolean; svg: string }[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/gotopattayacom', stroke: true, svg: '<rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />' },
  { label: 'Facebook', href: 'https://www.facebook.com/people/Go-To-Pattaya/61591161493028/', svg: '<path d="M14 13.5h2.5l1-4H14v-2c0-1 .5-2 2-2h1.5V2.1S16.1 2 14.7 2C11.9 2 10 3.7 10 6.9V9.5H7v4h3V22h4v-8.5Z" />' },
  { label: 'X', href: 'https://x.com/gotopattayacom', svg: '<path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24H16.17l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25H8.08l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05L17.08 19.77Z" />' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/go-to-pattaya', svg: '<path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.5 8.5h3v12h-3v-12zm5 0h2.9v1.6h.04c.4-.76 1.4-1.6 2.9-1.6 3.1 0 3.67 2 3.67 4.7v7.3h-3v-6.5c0-1.55-.03-3.55-2.16-3.55-2.16 0-2.5 1.7-2.5 3.44v6.6h-3v-12z" />' },
]

function FooterCol({ title, links, t }: { title: string; links: { label: string; href: string; all?: boolean }[]; t: (s: string) => string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`f-col${open ? ' open' : ''}`}>
      <button className="f-col-h" type="button" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        {t(title)}
        <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <ul className="f-col-list">
        {links.map(l => (
          <li key={l.label}>
            {l.href.startsWith('/') ? (
              <Link className={l.all ? 'all' : undefined} href={l.href}>{t(l.label)}</Link>
            ) : (
              <a className={l.all ? 'all' : undefined} href={l.href}>{t(l.label)}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer({ logoUrl, dict }: { logoUrl?: string | null; dict?: Record<string, string> }) {
  const t = (s: string) => dict?.[s] ?? s
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          <div className="footer-brand">
            <Link href="/" className="brand" aria-label="Go To Pattaya home">
              <BrandLogoWhite h={44} override={logoUrl} />
            </Link>
            <p>{t('The honest local guide to Pattaya. Real photos, real prices, verified by people who actually live here.')}</p>
            {SOCIALS.some((s) => s.href) && (
              <div className="socials">
                {SOCIALS.filter((s) => s.href).map((s) => (
                  <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill={s.stroke ? 'none' : 'currentColor'} stroke={s.stroke ? 'currentColor' : undefined} strokeWidth={s.stroke ? 2 : undefined} dangerouslySetInnerHTML={{ __html: s.svg }} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {cols.map(c => <FooterCol key={c.title} title={c.title} links={c.links} t={t} />)}

        </div>

        <div className="footer-bottom">
          <span>© 2026 Go To Pattaya · {t('All rights reserved')} · {t('Made in Thailand')} 🇹🇭 · {t('Made by')}{' '}
            <a href="https://www.tapt.studio/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}>tapt.studio</a>
          </span>
          <div className="legal">
            <Link href="/privacy">{t('Privacy')}</Link>
            <Link href="/terms">{t('Terms')}</Link>
            <Link href="/privacy">{t('Cookies')}</Link>
            <a href="/sitemap.xml">{t('Sitemap')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
