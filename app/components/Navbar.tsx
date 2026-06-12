'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Icon from '@/app/components/Icon'

const LogoSVG = ({ size = 36 }: { size?: number }) => (
  <svg viewBox="0 0 220 240" xmlns="http://www.w3.org/2000/svg" style={{width:size,height:'auto',flexShrink:0}}>
    <defs><linearGradient id="npb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#034487"/><stop offset="1" stopColor="#0178B4"/></linearGradient></defs>
    <path fill="url(#npb)" d="M110 8C56 8 14 49 14 102c0 70 78 122 92 128 3 1 5 1 8 0 14-6 92-58 92-128C206 49 164 8 110 8Z"/>
    <circle cx="110" cy="98" r="74" fill="#EAF6FB"/>
    <circle cx="110" cy="80" r="20" fill="#2FBDDC"/>
    <path fill="#0178B4" d="M44 120c14-10 24-10 38 0s24 10 38 0 24-10 38 0 24 10 38 0v22c-14 10-24 10-38 0s-24-10-38 0-24 10-38 0-24-10-38 0Z"/>
  </svg>
)

const navItems = [
  { label: 'Eat & Drinks', icon: 'eat', slug: 'eat-and-drinks', items: [
    { label: 'Restaurants', count: '84', href: '/eat-and-drinks' },
    { label: 'Cafés & coffee', count: '105', href: '/eat-and-drinks' },
    { label: 'Bars & rooftops', count: '38', href: '/eat-and-drinks' },
    { label: 'Seafood', count: '22', href: '/eat-and-drinks' },
    { label: 'Street food', count: '40', href: '/eat-and-drinks' },
    { label: 'Vegan & healthy', count: '16', href: '/eat-and-drinks' },
  ]},
  { label: 'Things to Do', icon: 'tours', slug: 'thinks-to-do', items: [
    { label: 'Tours & day trips', count: '83', href: '/thinks-to-do' },
    { label: 'Islands & beaches', count: '14', href: '/thinks-to-do#islands' },
    { label: 'Temples & culture', count: '19', href: '/thinks-to-do' },
    { label: 'Diving & snorkeling', count: '12', href: '/thinks-to-do' },
    { label: 'Skydiving & adrenaline', count: '21', href: '/thinks-to-do' },
    { label: 'Rent a bike / car', count: '30', href: '/thinks-to-do' },
  ]},
  { label: 'Yoga & Fitness', icon: 'muay-thai', slug: 'yoga-and-fitness', items: [
    { label: 'Yoga & Pilates', count: '26', href: '/yoga-and-fitness#lane-yoga' },
    { label: 'Gyms & fitness', count: '95', href: '/yoga-and-fitness#lane-gym' },
    { label: 'Muay Thai camps', count: '65', href: '/yoga-and-fitness#lane-muay' },
    { label: 'Sound healing & breathwork', count: '12', href: '/yoga-and-fitness#lane-yoga' },
  ]},
  { label: 'Wellness & Beauty', icon: 'wellness', slug: 'wellness-and-beauty', items: [
    { label: 'Spa & massage', count: '65', href: '/wellness-and-beauty' },
    { label: 'Onsen & sauna', count: '8', href: '/wellness-and-beauty' },
    { label: 'Beauty & nails', count: '34', href: '/wellness-and-beauty' },
    { label: 'Facials & skincare', count: '18', href: '/wellness-and-beauty' },
    { label: 'Wellness retreats', count: '9', href: '/wellness-and-beauty' },
  ]},
  { label: 'Areas', icon: 'pin', slug: 'areas', items: [
    { label: 'Central Pattaya', count: '', href: '/areas#central' },
    { label: 'Jomtien', count: '', href: '/areas#jomtien' },
    { label: 'Naklua', count: '', href: '/areas#naklua' },
    { label: 'Pratumnak Hill', count: '', href: '/areas#pratumnak' },
    { label: 'Wong Amat', count: '', href: '/areas#wong-amat' },
    { label: 'Walking Street', count: '', href: '/areas#walking-street' },
  ]},
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openMega, setOpenMega] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', drawerOpen)
  }, [drawerOpen])

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="tier1">
          <div className="container tier1-inner">
            <Link href="/" className="brand">
              <LogoSVG />
              <div className="wm"><i>Go To&nbsp;</i><u>Pattaya</u></div>
            </Link>
            <div className="searchbar">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
  <input type="search" placeholder="Search 1,200+ places, tours & areas…" aria-label="Search"/>
  <button type="button" className="scope" aria-label="Search scope: All">
    All
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" width="10" height="10"><path d="m6 9 6 6 6-6"/></svg>
  </button>
  <button type="button" className="go" aria-label="Search">
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" width="16" height="16"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
  </button>
</div>
            <div className="tier1-actions">
              <button className="lang-chip" aria-label="Language">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.5 4 5.7 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.7-4-9s1.4-6.5 4-9z"/></svg>
                EN
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="cv" width="11" height="11"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <Link href="/plan-my-trip" className="btn btn-primary btn-sm">Plan my trip</Link>
              <button className="burger" onClick={() => setDrawerOpen(true)} aria-label="Open menu" aria-expanded={drawerOpen}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="22" height="22"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="tier2">
          <div className="container tier2-inner">
            <ul className="nav-links">
              {navItems.map(item => (
                <li key={item.label} className={openMega === item.label ? 'open' : ''}
                  onMouseEnter={() => setOpenMega(item.label)}
                  onMouseLeave={() => setOpenMega(null)}>
                  <Link href={`/${item.slug}`} onClick={() => setOpenMega(null)}>
                    <Icon name={item.icon} size={18} className="ic" />
                    {item.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="cv" width="13" height="13"><path d="m6 9 6 6 6-6"/></svg>
                  </Link>
                  <div className="mega">
                    <div className="container mega-wrap" style={{gridTemplateColumns:'200px 1fr'}}>
                      <div className="mega-rail">
                        <h5>Browse {item.label}</h5>
                        <ul>
                          {item.items.map(sub => (
                            <li key={sub.label}>
                              <Link href={sub.href}>{sub.label} {sub.count && <span className="cnt">{sub.count}</span>}</Link>
                            </li>
                          ))}
                        </ul>
                        <Link className="pill-link" href={`/${item.slug}`}>All {item.label} →</Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>
        </div>
      </header>

      <div className={`scrim${drawerOpen ? ' show' : ''}`} onClick={() => setDrawerOpen(false)}/>
      <aside className={`drawer${drawerOpen ? ' show' : ''}`} aria-hidden={!drawerOpen}>
        <div className="drawer-top">
          <Link href="/" className="brand" onClick={() => setDrawerOpen(false)}>
            <LogoSVG size={30}/>
            <div className="wm"><i>Go To&nbsp;</i><u>Pattaya</u></div>
          </Link>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="drawer-body">
          <div className="m-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="search" placeholder="Search places, tours & areas…"/>
          </div>
          {navItems.map(item => (
            <MobileAccordion key={item.label} label={item.label} icon={item.icon} items={item.items} onClose={() => setDrawerOpen(false)}/>
          ))}
          <Link className="m-link" href="/blog" onClick={() => setDrawerOpen(false)}>
            <Icon name="book" size={22} className="ic" /> Blog
          </Link>
        </div>
        <div className="drawer-foot">
          <Link href="/plan-my-trip" className="btn btn-primary" onClick={() => setDrawerOpen(false)}>Plan my trip →</Link>
          <div className="frow">
            <a href="#">🌐 English · ฿ THB</a>
            <a href="#">+ Add your place</a>
          </div>
        </div>
      </aside>
    </>
  )
}

function MobileAccordion({ label, icon, items, onClose }: {
  label: string
  icon: string
  items: { label: string; count: string; href: string }[]
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`m-acc${open ? ' open' : ''}`}>
      <button className="m-acc-h" onClick={() => setOpen(!open)} aria-expanded={open}>
        <Icon name={icon} size={22} className="ic" />
        {label}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="cv" width="18" height="18"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div className="m-acc-body" style={{maxHeight: open ? '400px' : '0'}}>
        <div className="m-acc-list">
          {items.map(item => (
            <Link key={item.label} href={item.href} onClick={onClose}>
              {item.label} {item.count && <span className="cnt">{item.count}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
