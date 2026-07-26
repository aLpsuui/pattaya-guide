'use client'
import { usePathname, useRouter } from 'next/navigation'
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config'

// EN | RU toggle. Swaps the locale segment of the current path and remembers the
// choice in a cookie (read by proxy.ts on the next unprefixed visit).
export default function LanguageSwitcher() {
  const pathname = usePathname() || '/'
  const router = useRouter()
  const seg = pathname.split('/')[1]
  const current: Locale = (locales as readonly string[]).includes(seg) ? (seg as Locale) : defaultLocale

  function switchTo(loc: Locale) {
    if (loc === current) return
    const parts = pathname.split('/')
    if ((locales as readonly string[]).includes(parts[1])) parts[1] = loc
    else parts.splice(1, 0, loc)
    try { document.cookie = `locale=${loc};path=/;max-age=31536000` } catch {}
    router.push(parts.join('/') || `/${loc}`)
  }

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-pressed={l === current}
          style={{
            padding: '5px 9px',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 12.5,
            lineHeight: 1,
            borderRadius: 8,
            textTransform: 'uppercase',
            color: l === current ? 'var(--ocean, #0178b4)' : 'var(--text-muted, #64748b)',
            background: l === current ? 'color-mix(in srgb, var(--ocean, #0178b4) 12%, transparent)' : 'transparent',
          }}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
