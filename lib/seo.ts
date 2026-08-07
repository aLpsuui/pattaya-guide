import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME } from '@/lib/site'

// Shared metadata helpers so every template emits consistent, well-formed SEO.

// Default OG/Twitter image for pages without their own photo (hubs, static
// pages). Points at the app's dynamic 1200x630 branded OG route so social/AI
// cards never render blank.
export const ogDefaultImages = [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: SITE_NAME }]

// Per-locale <link rel="alternate" hreflang> in the page <head> (in addition to
// the sitemap hreflang) - Yandex reads head/HTTP annotation more reliably than
// sitemap. `path` is locale-agnostic, e.g. '/venues/grace-spa' or '' for home.
export function altLanguages(path: string): NonNullable<Metadata['alternates']>['languages'] {
  return {
    en: `/en${path}`,
    ru: `/ru${path}`,
    'x-default': `/en${path}`,
  }
}

// canonical (self, locale-prefixed) + hreflang alternates in one object.
export function localeAlternates(locale: string, path: string): Metadata['alternates'] {
  return { canonical: `/${locale}${path}`, languages: altLanguages(path) }
}

// Clamp a meta description to ~155 chars on a word boundary (SERP snippet limit).
export function clampDescription(s: string | null | undefined, max = 155): string | undefined {
  if (!s) return undefined
  const t = s.trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const sp = cut.lastIndexOf(' ')
  return (sp > max - 30 ? cut.slice(0, sp) : cut).replace(/[\s,;:.\-–—]+$/, '') + '…'
}

// Build a page title, dropping the " | Go To Pattaya" suffix when the base is
// already long enough that the full lockup would overflow ~60 chars.
const BRAND = ' | Go To Pattaya'
export function pageTitle(base: string, max = 60): string {
  const b = base.trim()
  return (b.length + BRAND.length <= max) ? `${b}${BRAND}` : b
}
