'use client'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'
import { locales, defaultLocale } from '@/lib/i18n/config'

// Drop-in replacement for next/link that keeps internal navigation inside the
// current locale. Absolute internal paths ("/blog/x", "/areas#jomtien") get the
// active locale prefix; external URLs, hashes, /api and /admin pass through.
function localeFromPath(pathname: string): string {
  const seg = pathname.split('/')[1]
  return (locales as readonly string[]).includes(seg) ? seg : defaultLocale
}

export default function LocaleLink({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const pathname = usePathname() || '/'
  const locale = localeFromPath(pathname)

  let target = href
  if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
    const alreadyPrefixed = locales.some((l) => href === `/${l}` || href.startsWith(`/${l}/`))
    const passthrough = href.startsWith('/api') || href.startsWith('/admin')
    if (!alreadyPrefixed && !passthrough) {
      target = href === '/' ? `/${locale}` : `/${locale}${href}`
    }
  }

  return <NextLink href={target} {...rest} />
}
