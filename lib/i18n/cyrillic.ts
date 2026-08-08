// Share of Cyrillic among the alphabetic characters in a string. A properly
// translated Russian page scores ~0.6-0.9 (brand/place names like "Pattaya"
// stay Latin); a page still serving the English source scores ~0. Used to keep
// untranslated RU pages out of the index until they're actually translated -
// the duplicate-content signal that was suppressing site-wide crawl demand.
export function cyrillicRatio(text: string | null | undefined): number {
  if (!text) return 0
  const latin = (text.match(/[A-Za-z]/g) || []).length
  const cyr = (text.match(/[Ѐ-ӿ]/g) || []).length
  const total = latin + cyr
  return total === 0 ? 0 : cyr / total
}

// True when a RU page's main text is still (essentially) English, so it should
// be noindex'd. Only ever returns true for locale 'ru'. Threshold 0.3 sits well
// clear of both extremes (untranslated ~0, translated ~0.7+), so a mostly-Latin
// but real Russian snippet won't be flagged. Self-healing: once the text is
// translated the ratio rises and the page indexes again on the next render.
export function isUntranslatedRu(locale: string, ...texts: (string | null | undefined)[]): boolean {
  if (locale !== 'ru') return false
  const joined = texts.filter(Boolean).join(' ')
  if (joined.replace(/[^A-Za-zЀ-ӿ]/g, '').length < 20) return false // too little text to judge
  return cyrillicRatio(joined) < 0.3
}
