'use client'
import { useState } from 'react'
import Link from 'next/link'
import Icon from '@/app/components/Icon'

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
      { label: 'Beaches & islands', href: '#' },
      { label: 'Things to do', href: '#' },
      { label: 'Wellness & spa', href: '#' },
      { label: 'Nightlife', href: '#' },
      { label: 'Tours & day trips', href: '#' },
      { label: 'Interactive map', href: '/#map' },
      { label: 'Plan your trip', href: '/blog' },
    ],
  },
  {
    title: 'Districts',
    links: [
      { label: 'Central Pattaya', href: '#' },
      { label: 'Jomtien Beach', href: '#' },
      { label: 'Naklua', href: '#' },
      { label: 'Pratumnak Hill', href: '#' },
      { label: 'Wong Amat', href: '#' },
      { label: 'Walking Street', href: '#' },
      { label: 'Koh Larn Island', href: '#' },
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
      { label: 'Editorial standards', href: '#' },
      { label: 'Our editorial team', href: '#' },
      { label: 'Submit a venue', href: '/contact' },
      { label: 'List your business', href: '/contact' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
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
            <div className="f-trust">
              <div className="f-trust-item"><Icon name="check" size={14} style={{ color: 'var(--lagoon)' }} /> Verified by 800+ residents</div>
              <div className="f-trust-item"><Icon name="check" size={14} style={{ color: 'var(--lagoon)' }} /> Updated weekly · No paid placements</div>
              <div className="f-trust-item"><Icon name="check" size={14} style={{ color: 'var(--lagoon)' }} /> 600+ places · 50+ guides · 4 languages</div>
            </div>
            <div className="socials">
              <a href="#" aria-label="Instagram"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg></a>
              <a href="#" aria-label="TikTok"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19.5 7.5a5.5 5.5 0 0 1-4.5-2.4V16a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V2h3a5.5 5.5 0 0 0 4.5 5.5Z" /></svg></a>
              <a href="#" aria-label="YouTube"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5 3-5 3Z" /></svg></a>
              <a href="#" aria-label="Facebook"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1 .5-2 2-2h1.5V2.1S16.1 2 14.7 2C11.9 2 10 3.7 10 6.9V9.5H7v4h3V22h4v-8.5Z" /></svg></a>
              <a href="#" aria-label="WeChat"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 4C4.4 4 1 6.9 1 10.5c0 2 1 3.8 2.7 5L3 18l2.7-1.4c.5.1 1 .2 1.5.2-.1-.4-.2-.9-.2-1.3 0-3.2 3.1-5.8 7-5.8.3 0 .6 0 .9.1C14.3 7.1 11.7 4 8.5 4Zm-2.7 4c.5 0 .9.4.9.9 0 .5-.4.9-.9.9s-.9-.4-.9-.9c0-.5.4-.9.9-.9Zm5.4 0c.5 0 .9.4.9.9 0 .5-.4.9-.9.9s-.9-.4-.9-.9c0-.5.4-.9.9-.9ZM14.5 11C11 11 8 13.3 8 16.2c0 2.9 3 5.3 6.5 5.3.7 0 1.4-.1 2-.3l2.5 1.3-.6-2c1.4-1 2.6-2.5 2.6-4.3 0-2.9-3-5.2-6.5-5.2Zm-2 3c.4 0 .7.3.7.7 0 .4-.3.7-.7.7-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7Zm4.5 0c.4 0 .7.3.7.7 0 .4-.3.7-.7.7-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7Z" /></svg></a>
            </div>
          </div>

          {cols.map(c => <FooterCol key={c.title} title={c.title} links={c.links} />)}

        </div>

        <div className="footer-bottom">
          <span>© 2026 Go To Pattaya · Made in Pattaya 🇹🇭</span>
          <div className="fb-lang">
            <a href="#" className="active">EN</a>
            <a href="#">RU</a>
            <a href="#">中文</a>
            <a href="#">ไทย</a>
          </div>
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
