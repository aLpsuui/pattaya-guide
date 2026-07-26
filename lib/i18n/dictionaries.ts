import 'server-only'
import type { Locale } from './config'

// Flat English->translation lookup for chrome strings. English is the source,
// so its dictionary is empty and t() falls back to the English key.
export type Dict = Record<string, string>

const loaders: Record<Locale, () => Promise<Dict>> = {
  en: async () => ({}),
  ru: async () => (await import('./ru.json')).default as Dict,
}

export async function getDictionary(lang: Locale): Promise<Dict> {
  return (loaders[lang] ?? loaders.en)()
}
