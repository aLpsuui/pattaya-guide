'use client'
import { useState } from 'react'
import Link from 'next/link'

// Brand logo — same mark as the navbar, used white-on-dark in the footer.
const LogoSVG = ({ size = 42 }: { size?: number }) => (
  <svg viewBox="0 0 220 240" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: 'auto', flexShrink: 0 }} aria-hidden="true">
    <defs><linearGradient id="fpb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#034487" /><stop offset="1" stopColor="#0178B4" /></linearGradient></defs>
    <path fill="url(#fpb)" d="M110 8C56 8 14 49 14 102c0 70 78 122 92 128 3 1 5 1 8 0 14-6 92-58 92-128C206 49 164 8 110 8Z" />
    <circle cx="110" cy="98" r="74" fill="#EAF6FB" />
    <circle cx="110" cy="80" r="20" fill="#2FBDDC" />
    <path fill="#0178B4" d="M44 120c14-10 24-10 38 0s24 10 38 0 24-10 38 0 24 10 38 0v22c-14 10-24 10-38 0s-24-10-38 0-24 10-38 0-24-10-38 0Z" />
  </svg>
)

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
      { label: 'Best time to visit Pattaya', href: '/blog' },
      { label: 'Getting from Bangkok to Pattaya', href: '/blog' },
      { label: 'First-timer mistakes to avoid', href: '/blog' },
      { label: '7 days in Pattaya under $400', href: '/blog' },
      { label: 'Pattaya with kids', href: '/blog' },
      { label: 'Is Pattaya safe? An honest take', href: '/blog' },
      { label: 'Pattaya vs Phuket', href: '/blog' },
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

// Social links — add a real URL to a platform's `href` and its icon appears.
// Empty href => not rendered (no dead links).
const SOCIALS: { label: string; href: string; stroke?: boolean; svg: string }[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/gotopattayacom', stroke: true, svg: '<rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61591161493028', svg: '<path d="M14 13.5h2.5l1-4H14v-2c0-1 .5-2 2-2h1.5V2.1S16.1 2 14.7 2C11.9 2 10 3.7 10 6.9V9.5H7v4h3V22h4v-8.5Z" />' },
  { label: 'X', href: 'https://x.com/gotopattayacom', svg: '<path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24H16.17l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25H8.08l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05L17.08 19.77Z" />' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/go-to-pattaya', svg: '<path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.5 8.5h3v12h-3v-12zm5 0h2.9v1.6h.04c.4-.76 1.4-1.6 2.9-1.6 3.1 0 3.67 2 3.67 4.7v7.3h-3v-6.5c0-1.55-.03-3.55-2.16-3.55-2.16 0-2.5 1.7-2.5 3.44v6.6h-3v-12z" />' },
]

function FooterCol({ title, links }: { title: string; links: { label: string; href: string; all?: boolean }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`f-col${open ? ' open' : ''}`}>
      <button className="f-col-h" type="button" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        {title}
        <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <ul className="f-col-list">
        {links.map(l => (
          <li key={l.label}>
            {l.href.startsWith('/') ? (
              <Link className={l.all ? 'all' : undefined} href={l.href}>{l.label}</Link>
            ) : (
              <a className={l.all ? 'all' : undefined} href={l.href}>{l.label}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          <div className="footer-brand">
            <Link href="/" className="brand" aria-label="Go To Pattaya home">
              <LogoSVG />
              <div className="wm"><i>Go To&nbsp;</i><u>Pattaya</u></div>
            </Link>
            <p>The honest local guide to Pattaya. Real photos, real prices, verified by people who actually live here.</p>
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

          {cols.map(c => <FooterCol key={c.title} title={c.title} links={c.links} />)}

        </div>

        <div className="footer-bottom">
          <span>© 2026 Go To Pattaya · Made in Pattaya 🇹🇭</span>
          <div className="legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Cookies</Link>
            <a href="/sitemap.xml">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
