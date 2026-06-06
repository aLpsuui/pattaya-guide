'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const LogoSVG = () => (
  <svg viewBox="0 0 220 240" xmlns="http://www.w3.org/2000/svg" style={{width:36,height:'auto',flexShrink:0}}>
    <defs><linearGradient id="np" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#034487"/><stop offset="1" stopColor="#0178B4"/></linearGradient></defs>
    <path fill="url(#np)" d="M110 8C56 8 14 49 14 102c0 70 78 122 92 128 3 1 5 1 8 0 14-6 92-58 92-128C206 49 164 8 110 8Z"/>
    <circle cx="110" cy="98" r="74" fill="#EAF6FB"/>
    <circle cx="110" cy="80" r="20" fill="#2FBDDC"/>
    <path fill="#0178B4" d="M44 120c14-10 24-10 38 0s24 10 38 0 24-10 38 0 24 10 38 0v22c-14 10-24 10-38 0s-24-10-38 0-24-10-38 0-24-10-38 0Z"/>
  </svg>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('mm-open', menuOpen)
  }, [menuOpen])

  const navLinks = [
    { href: '#cats', label: 'Categories' },
    { href: '#districts', label: 'Districts' },
    { href: '#plan', label: 'Plan your trip' },
    { href: '#adventure', label: 'Adventure' },
    { href: '#map', label: 'Map' },
    { href: '#blog', label: 'Blog' },
  ]

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-l">
            <a href="#" className="hide-m">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              EN · English
            </a>
            <span className="sep hide-m"></span>
            <a href="#" className="hide-m">฿ THB</a>
          </div>
          <div className="topbar-r">
            <a href="#">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Open Pattaya map →
            </a>
            <span className="sep"></span>
            <a href="#">Sign in</a>
          </div>
        </div>
      </div>

      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="container nav-inner">
          <Link href="/" className="brand" aria-label="Pattaya Guide home">
            <LogoSVG />
            <div className="wm"><i>Pattaya</i><u>Guide</u></div>
          </Link>
          <nav className="nav-links" aria-label="Main">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>
          <div className="nav-actions">
            <button className="icon-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <a href="#blog" className="btn btn-secondary btn-sm">Read the guides</a>
            <button className="burger" id="burger" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`mm-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} aria-hidden="true"></div>
      <aside className={`mm-panel${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen} aria-label="Mobile menu">
        <div className="mm-head">
          <Link href="/" className="brand">
            <LogoSVG />
            <div className="wm"><i>Pattaya</i><u>Guide</u></div>
          </Link>
          <button className="mm-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <nav className="mm-body">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m9 6 6 6-6 6"/></svg>
            </a>
          ))}
        </nav>
        <div className="mm-foot">
          <a href="#blog" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Read the guides</a>
        </div>
      </aside>
    </>
  )
}
