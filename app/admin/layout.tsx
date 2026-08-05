import type { Metadata } from 'next'
import '../globals.css'
import './admin.css'

// /admin is outside [lang], so it's its own ROOT layout (renders <html><body>).
// Admin is always English UI and never indexed.
export const metadata: Metadata = {
  title: 'Pattaya Guide - Admin',
  robots: { index: false, follow: false },
}

// Set saved theme on the admin wrapper before paint (scoped, not on <html>).
const themeScript = `try{var t=localStorage.getItem('pg-theme');if(t){document.getElementById('pgadmin-root').setAttribute('data-admin-theme',t);}}catch(e){}`

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="pg-admin" id="pgadmin-root" data-admin-theme="light" suppressHydrationWarning>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
          {children}
        </div>
      </body>
    </html>
  )
}
