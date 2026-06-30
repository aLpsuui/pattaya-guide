'use client'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import ChatWidget from './ChatWidget'

// Hides the public site chrome (navbar/footer/main wrapper) on /admin routes,
// which render their own full-screen shell. Public routes are unaffected.
export default function RootChrome({ navbar, footer, children }: { navbar: ReactNode; footer: ReactNode; children: ReactNode }) {
  const pathname = usePathname() || ''
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return <>{children}</>
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      {navbar}
      <main id="main">{children}</main>
      {footer}
      <ChatWidget />
    </>
  )
}
