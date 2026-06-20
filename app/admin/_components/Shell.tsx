'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { logout } from '@/app/admin/_actions/auth'
import {
  IconPin, IconDoc, IconImage, IconDash, IconSearch, IconSun, IconMoon, IconBurger, IconLogout,
} from './icons'

type Active = 'dashboard' | 'places' | 'blog' | 'media' | 'seo'

const NAV: { key: Active; href: string; label: string; icon: ReactNode; group: string }[] = [
  { key: 'dashboard', href: '/admin', label: 'Dashboard', icon: <IconDash />, group: 'Overview' },
  { key: 'places', href: '/admin/places', label: 'Places', icon: <IconPin />, group: 'Content' },
  { key: 'blog', href: '/admin/blog', label: 'Blog & Guides', icon: <IconDoc />, group: 'Content' },
  { key: 'media', href: '/admin/media', label: 'Media', icon: <IconImage />, group: 'Content' },
  { key: 'seo', href: '/admin/seo', label: 'SEO Health', icon: <IconSearch />, group: 'Growth' },
]
const GROUPS = ['Overview', 'Content', 'Growth']

export default function Shell({
  active, crumb, title, search, actions, children,
}: {
  active: Active; crumb: ReactNode; title: string; search?: boolean; actions?: ReactNode; children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  function root() { return document.querySelector('.pg-admin') as HTMLElement | null }

  useEffect(() => { setDark(root()?.getAttribute('data-admin-theme') === 'dark') }, [])

  function toggleTheme() {
    const el = root(); if (!el) return
    const next = el.getAttribute('data-admin-theme') === 'dark' ? 'light' : 'dark'
    el.setAttribute('data-admin-theme', next)
    try { localStorage.setItem('pg-theme', next) } catch {}
    setDark(next === 'dark')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchRef.current?.focus() }
      if (e.key === 'Escape') setOpen(false)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div className={`scrim${open ? ' show' : ''}`} onClick={() => setOpen(false)} />
      <div className="admin">
        <aside className={`sidebar${open ? ' open' : ''}`}>
          <div className="sb-head">
            <div className="sb-logo"><IconPin /></div>
            <div className="sb-brand">Pattaya Guide<small>Admin</small></div>
          </div>
          <nav className="sb-scroll">
            {GROUPS.map((g) => (
              <div className="sb-group" key={g}>
                <div className="sb-label">{g}</div>
                {NAV.filter((n) => n.group === g).map((n) => (
                  <Link key={n.key} href={n.href} className={`nav-item${active === n.key ? ' active' : ''}`} onClick={() => setOpen(false)}>
                    {n.icon}{n.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <div className="sb-foot">
            <div className="sb-user">
              <div className="av">OD</div>
              <div className="who"><b>Olcay Dikici</b><span>Editor</span></div>
              <form action={logout}><button className="sb-logout" aria-label="Sign out"><IconLogout /></button></form>
            </div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <button className="burger" onClick={() => setOpen(true)} aria-label="Open menu"><IconBurger /></button>
            <div className="tb-title">
              <div className="crumb">{crumb}</div>
              <h1>{title}</h1>
            </div>
            {search && (
              <div className="tb-search">
                <IconSearch />
                <input ref={searchRef} type="search" placeholder="Search…" /><kbd>⌘K</kbd>
              </div>
            )}
            <div className="tb-right">
              {actions}
              <button className="tb-icon" onClick={toggleTheme} aria-label="Toggle theme">
                {dark ? <IconMoon /> : <IconSun />}
              </button>
            </div>
          </header>
          <main className="content">{children}</main>
        </div>
      </div>
    </>
  )
}
