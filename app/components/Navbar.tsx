'use client'
import { useState, useEffect, useRef } from 'react'
import Link from '@/app/components/LocaleLink'
import Icon from '@/app/components/Icon'
import HeroSearch from '@/app/components/HeroSearch'
import BrandLogo from '@/app/components/BrandLogo'
import LanguageSwitcher from '@/app/components/LanguageSwitcher'
import type { MegaData } from '@/lib/megaNav'
import type { NavPillar, NavSub } from '@/lib/navMenu'

const StarSvg = () => (<svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><path d="M12 17.3 6.2 20.5l1.1-6.5L2.5 9.4l6.5-.9L12 2.5l3 6 6.5.9-4.8 4.6 1.1 6.5z" /></svg>)

export default function Navbar({ logoUrl, dict, menu }: { logoUrl?: string | null; dict?: Record<string, string>; menu: NavPillar[] }) {
  const t = (s: string) => dict?.[s] ?? s
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openMega, setOpenMega] = useState<string | null>(null)
  const [mega, setMega] = useState<MegaData>({})
  const megaReq = useRef(false)

  // Lazy-load the mega-menu content on first hover so it isn't baked into every
  // page's RSC payload (keeps the initial DOM lighter - P-03).
  function loadMega() {
    if (megaReq.current) return
    megaReq.current = true
    fetch('/api/mega-nav')
      .then((r) => (r.ok ? r.json() : {}))
      .then(setMega)
      .catch(() => { megaReq.current = false })
  }

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
              <BrandLogo h={36} override={logoUrl} />
            </Link>
            <HeroSearch variant="header" dict={dict} />
            <div className="tier1-actions">
              <LanguageSwitcher />
              <Link href="/plan-my-trip" className="btn btn-primary btn-sm">{t('Plan my trip')}</Link>
              <button className="burger" onClick={() => setDrawerOpen(true)} aria-label="Open menu" aria-expanded={drawerOpen}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="22" height="22"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="tier2">
          <div className="container tier2-inner">
            <ul className="nav-links">
              {menu.map(item => item.flat ? (
                <li key={item.label}>
                  <Link href={item.href} onClick={() => setOpenMega(null)}>
                    <Icon name={item.icon} size={18} className="ic" />
                    {t(item.label)}
                  </Link>
                </li>
              ) : (
                <li key={item.label} className={openMega === item.label ? 'open' : ''}
                  onMouseEnter={() => { setOpenMega(item.label); loadMega() }}
                  onMouseLeave={() => setOpenMega(null)}>
                  <Link href={item.href} onClick={() => setOpenMega(null)}>
                    <Icon name={item.icon} size={18} className="ic" />
                    {t(item.label)}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="cv" width="13" height="13"><path d="m6 9 6 6 6-6"/></svg>
                  </Link>
                  <div className="mega">
                    <div className="container mega-wrap">
                      <div className="mega-rail">
                        <h5>{t('Browse')} {t(item.label)}</h5>
                        <ul>
                          {item.subs.map(sub => (
                            <li key={sub.label}>
                              <Link href={sub.href} onClick={() => setOpenMega(null)}>{t(sub.label)} {sub.count > 0 && <span className="cnt">{sub.count}</span>}</Link>
                            </li>
                          ))}
                        </ul>
                        <Link className="pill-link" href={item.href} onClick={() => setOpenMega(null)}>{t('All')} {t(item.label)} →</Link>
                      </div>

                      <div className={`bento${item.key === 'areas' ? ' bento--even' : ''}`}>
                        {(mega[item.key]?.venues?.length ?? 0) > 0 ? (
                          mega[item.key]!.venues.map((v, i) => (
                            <Link key={v.slug} href={v.href} onClick={() => setOpenMega(null)}>
                              {v.image_url && <img src={v.image_url} alt={v.name} loading="lazy" />}
                              {i === 0 && <span className="badge">{t("Editor's pick")}</span>}
                              {v.rating != null && <span className="rate-chip"><StarSvg />{v.rating.toFixed(1)}</span>}
                              <span className="k">{v.categories?.name_en || v.neighborhood || t(item.label)}</span>
                              <b>{v.name}</b>
                              {v.price_from != null
                                ? <small>from ฿{v.price_from.toLocaleString()}</small>
                                : v.neighborhood ? <small>{v.neighborhood}</small> : null}
                            </Link>
                          ))
                        ) : (
                          <Link href={item.href} onClick={() => setOpenMega(null)} style={{ background: 'var(--grad-brand)' }}>
                            <span className="k">{t('Explore')}</span>
                            <b>{t('Browse all')} {t(item.label)}</b>
                            <small>{t('See every place →')}</small>
                          </Link>
                        )}
                      </div>

                      {mega[item.key]?.guide && (
                        <Link className="mega-promo" href={`/blog/${mega[item.key]!.guide!.slug}`} onClick={() => setOpenMega(null)}>
                          <div className="ph" style={mega[item.key]!.guide!.hero_image
                            ? { backgroundImage: `url(${mega[item.key]!.guide!.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                            : { background: 'var(--grad-brand)' }}><span className="ph-tag">{t('Featured guide')}</span></div>
                          <div className="bd">
                            <div className="k">{t(item.label)} {t('guide')}</div>
                            <h4>{mega[item.key]!.guide!.title}</h4>
                            {mega[item.key]!.guide!.description && <p>{mega[item.key]!.guide!.description}</p>}
                            <div className="row">
                              <small><StarSvg /> {mega[item.key]!.guide!.read_time ? `${mega[item.key]!.guide!.read_time} ${t('min read')}` : t('Read guide')}{mega[item.key]!.guide!.author ? ` · ${mega[item.key]!.guide!.author}` : ''}</small>
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
              <li><Link href="/blog">{t('Blog')}</Link></li>
            </ul>
          </div>
        </div>
      </header>

      <div className={`scrim${drawerOpen ? ' show' : ''}`} onClick={() => setDrawerOpen(false)}/>
      <aside className={`drawer${drawerOpen ? ' show' : ''}`} aria-hidden={!drawerOpen}>
        <div className="drawer-top">
          <Link href="/" className="brand" onClick={() => setDrawerOpen(false)}>
            <BrandLogo h={30} override={logoUrl} />
          </Link>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="drawer-body">
          <div className="m-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="search" placeholder={t('Search places, tours & areas…')}/>
          </div>
          {menu.map(item => item.flat ? (
            <Link key={item.label} className="m-link" href={item.href} onClick={() => setDrawerOpen(false)}>
              <Icon name={item.icon} size={22} className="ic" /> {t(item.label)}
            </Link>
          ) : (
            <MobileAccordion key={item.label} label={item.label} icon={item.icon} items={item.subs} onClose={() => setDrawerOpen(false)} t={t}/>
          ))}
          <Link className="m-link" href="/blog" onClick={() => setDrawerOpen(false)}>
            <Icon name="book" size={22} className="ic" /> {t('Blog')}
          </Link>
        </div>
        <div className="drawer-foot">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><LanguageSwitcher /></div>
          <Link href="/plan-my-trip" className="btn btn-primary" onClick={() => setDrawerOpen(false)}>{t('Plan my trip')} →</Link>
        </div>
      </aside>
    </>
  )
}

function MobileAccordion({ label, icon, items, onClose, t }: {
  label: string
  icon: string
  items: NavSub[]
  onClose: () => void
  t: (s: string) => string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`m-acc${open ? ' open' : ''}`}>
      <button className="m-acc-h" onClick={() => setOpen(!open)} aria-expanded={open}>
        <Icon name={icon} size={22} className="ic" />
        {t(label)}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="cv" width="18" height="18"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div className="m-acc-body" style={{maxHeight: open ? '400px' : '0'}}>
        <div className="m-acc-list">
          {items.map(item => (
            <Link key={item.label} href={item.href} onClick={onClose}>
              {t(item.label)} {item.count > 0 && <span className="cnt">{item.count}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
