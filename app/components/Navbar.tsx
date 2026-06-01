'use client'

import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="nav" id="nav">
      <div className="container nav-inner">
        <a href="/" className="brand">
          <svg viewBox="0 0 220 240" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="np" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#034487"/><stop offset="1" stopColor="#0178B4"/></linearGradient></defs>
            <path fill="url(#np)" d="M110 8C56 8 14 49 14 102c0 70 78 122 92 128 3 1 5 1 8 0 14-6 92-58 92-128C206 49 164 8 110 8Z"/>
            <circle cx="110" cy="98" r="74" fill="#EAF6FB"/>
            <circle cx="110" cy="80" r="20" fill="#2FBDDC"/>
            <path fill="#0178B4" d="M44 120c14-10 24-10 38 0s24 10 38 0 24-10 38 0 24 10 38 0v22c-14 10-24 10-38 0s-24-10-38 0-24 10-38 0-24-10-38 0Z"/>
            <g fill="#034487">
              <path d="M112 96c14-8 28-7 40 2-13-2-25 0-37 8Z"/>
              <path d="M112 96c12-12 26-16 40-12-13 3-23 9-33 19Z"/>
              <path d="M112 96c-14-8-28-7-40 2 13-2 25 0 37 8Z"/>
              <path d="M112 96c-12-12-26-16-40-12 13 3 23 9 33 19Z"/>
            </g>
          </svg>
          <div className="wm"><i>Pattaya</i><u>Guide</u></div>
        </a>

        <nav className="nav-links">
          <a href="#">Eat &amp; Coffee</a>
          <a href="#">Tours &amp; Activities</a>
          <a href="#">Wellness</a>
          <a href="#">Beaches</a>
          <a href="#">Map</a>
          <a href="#">Blog</a>
        </nav>

        <div className="nav-actions">
          <a href="#" className="btn btn-primary btn-sm">Book a tour →</a>
          <button 
            className="burger" 
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="container">
            <nav className="mobile-nav">
              <a href="#" onClick={() => setMenuOpen(false)}>Eat &amp; Coffee</a>
              <a href="#" onClick={() => setMenuOpen(false)}>Tours &amp; Activities</a>
              <a href="#" onClick={() => setMenuOpen(false)}>Wellness</a>
              <a href="#" onClick={() => setMenuOpen(false)}>Beaches</a>
              <a href="#" onClick={() => setMenuOpen(false)}>Map</a>
              <a href="#" onClick={() => setMenuOpen(false)}>Blog</a>
              <a href="#" className="btn btn-primary" style={{marginTop:8}}>Book a tour →</a>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
