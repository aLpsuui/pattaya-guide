import '../areas.css'
import './area-detail.css'
import './area-guide.css'
import './area-guide-fixes.css'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from '@/app/components/LocaleLink'
import Icon from '@/app/components/Icon'
import Star from '@/app/components/Star'
import { AREAS, areaBySlug } from '@/lib/areas'
import { localeAlternates, clampDescription } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'
import BlogScript from '@/app/components/BlogScript'
import guidesData from './area-guides.json'
import { getTranslated, translateMany } from '@/lib/i18n/translateContent'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { hasLocale } from '@/lib/i18n/config'
import { isUntranslatedRu } from '@/lib/i18n/cyrillic'

export const revalidate = 300

// FAQ accordions + in-page smooth scroll for the bespoke .det-area guides
// (the source page's inline script lived outside <main>, so it was dropped).
const AREA_GUIDE_SCRIPT = String.raw`
(function () {
  document.querySelectorAll('.det-area .acc .q').forEach(function (q) {
    q.addEventListener('click', function () {
      var acc = q.closest('.acc');
      var open = acc.classList.toggle('open');
      q.setAttribute('aria-expanded', String(open));
    });
  });
  document.querySelectorAll('.det-area a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id === '#') return;
      var t = document.querySelector(id); if (!t) return;
      e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
`

const ASSETS = 'https://cdn.gotopattaya.com/Assets'
const guides = guidesData as Record<string, { name: string; html: string }>

// The authored guide HTML links to other pages with locale-less paths
// ("/areas/naklua", "/eat-and-drinks") - each of those 308-redirects and burns
// crawl budget. Prefix every internal href with the active locale (skip already
// prefixed, hashes, external, /api, /admin). Query strings + hashes are kept.
function localizeLinks(html: string, locale: string): string {
  return html.replace(/href="(\/[^/"][^"#]*)/g, (m, path: string) => {
    if (/^\/(en|ru)(\/|$)/.test(path) || path.startsWith('/api') || path.startsWith('/admin')) return m
    return `href="/${locale}${path}`
  })
}

// The bespoke area guides carry a FAQ accordion as authored HTML (not
// structured data). R-4: pull the Q&A pairs out so we can emit FAQPage schema
// - same rich-result opportunity the blog posts already get.
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "'").replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;|&ndash;/g, '-').replace(/&nbsp;/g, ' ')
}
function stripHtml(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}
function extractFaq(html: string): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = []
  for (const block of html.split('<div class="acc">').slice(1)) {
    const qm = block.match(/<button class="q"[^>]*>([\s\S]*?)<\/button>/)
    const am = block.match(/<div class="a-in">([\s\S]*?)<\/div>\s*<\/div>/)
    if (!qm || !am) continue
    const q = stripHtml(qm[1]); const a = stripHtml(am[1])
    if (q && a) out.push({ q, a })
  }
  return out
}

const INFO: Record<string, { blurb: string; hero: string }> = {
  'central-pattaya': { blurb: 'The all-in-one heart of the bay - Beach Road, malls, street food and nightlife, all walkable.', hero: `${ASSETS}/pattaya-city-beach-2.webp` },
  'jomtien': { blurb: 'A long, calm beach with a residential feel - the family and long-stay pick.', hero: `${ASSETS}/best-island-pattaya.webp` },
  'naklua': { blurb: 'The older, more local north end - fishing-village roots, seafood and a quieter pace.', hero: `${ASSETS}/pattaya-buddhist-pagoda-golden.webp` },
  'pratumnak-hill': { blurb: 'The leafy headland between the two beaches - upscale, calm, with viewpoints and coves.', hero: `${ASSETS}/pattaya-city-beach-1.webp` },
  'wong-amat': { blurb: 'The bay’s most refined beach - clean sand, boutique resorts and a peaceful escape.', hero: `${ASSETS}/pattaya-city-beach-1.webp` },
  'walking-street': { blurb: 'The full-throttle nightlife strip and the sois around it - clubs, bars and late-night energy.', hero: `${ASSETS}/pattaya-night-clubs-1.webp` },
  'islands': { blurb: 'Just offshore lie Koh Larn (Coral Island) and its neighbours - the clearest water and best sand.', hero: `${ASSETS}/Coral-Island-pattaya.webp` },
}

interface AreaVenue {
  id: string; slug: string | null; name: string; rating: number | null; review_count: number | null
  venue_type: string | null; price_range: string | null; address: string | null; neighborhood: string | null; image_url: string | null
  categories: { name_en: string } | null
}

async function getAreaVenues(match: string[]): Promise<AreaVenue[]> {
  const or = match.map((m) => `neighborhood.ilike.%${m}%`).join(',')
  const { data } = await supabase
    .from('venues')
    .select('id, slug, name, rating, review_count, venue_type, price_range, address, neighborhood, image_url, categories(name_en)')
    .eq('is_active', true)
    .or(or)
    .order('rating', { ascending: false, nullsFirst: false })
    .order('review_count', { ascending: false, nullsFirst: false })
    .limit(60)
  return (data || []) as unknown as AreaVenue[]
}

// Pre-render English only; Russian area guides translate on first visit + cache
// (the guide HTML is large, so we don't want to translate all of them at build).
export function generateStaticParams() {
  return AREAS.map((a) => ({ lang: 'en', slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const area = areaBySlug(slug)
  if (!area) return { title: 'Not Found', robots: { index: false } }
  const info = INFO[slug]
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  // The area blurb is a code-defined English string; translate it for RU (was
  // shipping English meta descriptions on every /ru/areas page - audit finding).
  const blurbTx = info?.blurb ? await getTranslated('static', `area:${slug}:blurb`, 'text', info.blurb, locale) : undefined
  const desc = clampDescription(blurbTx || info?.blurb)
  return {
    title: `${area.name}, Pattaya - ${t('Area Guide')} | Go To Pattaya`,
    description: desc,
    robots: isUntranslatedRu(locale, blurbTx) ? { index: false, follow: true } : undefined,
    alternates: localeAlternates(locale, `/areas/${slug}`),
    openGraph: { title: `${area.name}, Pattaya`, description: desc, url: `${SITE_URL}/${locale}/areas/${slug}`, images: info?.hero ? [{ url: info.hero }] : undefined },
  }
}

export default async function AreaDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const area = areaBySlug(slug)
  if (!area) notFound()
  const locale = hasLocale(lang) ? lang : 'en'
  const info = INFO[slug]
  const guide = guides[slug]
  const [dict, venues, guideHtml] = await Promise.all([
    getDictionary(locale),
    getAreaVenues(area.match),
    guide ? getTranslated('static', `area-guide-${slug}`, 'html', guide.html, locale) : Promise.resolve(''),
  ])
  const t = (s: string) => dict?.[s] ?? s

  // Translate venue card labels (type + category); names stay Latin.
  const [typeMap, catMap] = await Promise.all([
    translateMany('venue_types', 'label', venues.map((v) => v.venue_type), locale),
    translateMany('categories', 'name_en', venues.map((v) => v.categories?.name_en), locale),
  ])
  const tt = (s: string | null | undefined) => (s ? (typeMap.get(s) ?? catMap.get(s) ?? s) : s)

  const faq = guide ? extractFaq(guide.html) : []
  const areaUrl = `${SITE_URL}/${locale}/areas/${slug}`
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('Home'), item: `${SITE_URL}/${locale}` },
        { '@type': 'ListItem', position: 2, name: t('Areas'), item: `${SITE_URL}/${locale}/areas` },
        { '@type': 'ListItem', position: 3, name: area.name, item: areaUrl },
      ],
    },
    {
      '@type': 'Place',
      '@id': `${areaUrl}#place`,
      name: `${area.name}, Pattaya`,
      description: info?.blurb || undefined,
      image: info?.hero || undefined,
      url: areaUrl,
      containedInPlace: {
        '@type': 'City',
        name: 'Pattaya',
        address: { '@type': 'PostalAddress', addressRegion: 'Chon Buri', addressCountry: 'TH' },
      },
    },
  ]
  // ItemList of the places listed on this area hub - tells Google the page is a
  // curated listing (audit Faz 3.12). URLs locale-prefixed to match canonical.
  if (venues.length) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${areaUrl}#places`,
      name: `${t('Places in')} ${area.name}`,
      numberOfItems: venues.length,
      itemListElement: venues.slice(0, 40).map((v, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/${locale}/venues/${v.slug}`,
        name: v.name,
      })),
    })
  }
  if (faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${areaUrl}#faq`,
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  const jsonLd = { '@context': 'https://schema.org', '@graph': graph }

  return (
    <div className="adx">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {guide ? (
        // Rich editorial area guide (bespoke .det-area design). translate="no"
        // keeps Google Translate from breaking the CSS grids (e.g. quick numbers).
        <>
          <div translate="no" dangerouslySetInnerHTML={{ __html: localizeLinks(guideHtml, locale) }} />
          <BlogScript script={AREA_GUIDE_SCRIPT} />
        </>
      ) : (
        // Fallback hero for areas without a guide (e.g. the islands)
        <section className="adx-hero">
          <img className="adx-hero__img" src={venues.find((v) => v.image_url)?.image_url || info?.hero || `${ASSETS}/pattaya-city-beach-1.webp`} alt={`${area.name}, Pattaya`} />
          <div className="adx-hero__veil" aria-hidden="true" />
          <div className="adx-hero__inner">
            <div className="container">
              <Link href="/areas" className="adx-back"><Icon name="arrow-left" size={16} /> {t('All areas')}</Link>
              <span className="kicker" style={{ color: '#bfe3ff' }}>{t('Area guide')}</span>
              <h1>{t(area.name)}</h1>
              <p className="adx-lead">{t(info?.blurb ?? '')}</p>
              <div className="adx-vibes">{area.vibes.map((v) => <span key={v} className="adx-chip">{t(v)}</span>)}</div>
            </div>
          </div>
        </section>
      )}

      {/* DB venues in this area */}
      <section className="adx-section">
        <div className="container">
          <div className="eat-head">
            <div className="titles">
              <p className="kicker">{t('Where to go')}</p>
              <h2>{t('Places in')} {t(area.name)}</h2>
              <p>{t('Restaurants, bars, spas and things to do we cover in this part of the bay - sorted by rating.')}</p>
            </div>
            {venues.length > 0 && <span className="pill pill--navy">{venues.length} {venues.length === 1 ? t('place') : t('places')}</span>}
          </div>

          {venues.length > 0 ? (
            <div className="eat-grid">
              {venues.map((v) => (
                <Link key={v.id} href={`/venues/${v.slug}`} className="eat-card">
                  <div className="eat-card__media">
                    {v.image_url && <img src={v.image_url} alt={v.name} loading="lazy" />}
                    <span className="eat-card__tag">{tt(v.venue_type || v.categories?.name_en)}</span>
                  </div>
                  <div className="eat-card__body">
                    {v.venue_type && <div className="eat-card__cuisine">{tt(v.venue_type)}</div>}
                    <h3>{v.name}</h3>
                    {v.address && <div className="eat-card__loc"><Icon name="pin" size={16} className="ic" />{v.address}</div>}
                    <div className="eat-card__foot">
                      <span className="eat-card__rate"><Star /> {v.rating?.toFixed(1) ?? '-'} {v.review_count != null && <span className="count">({v.review_count.toLocaleString()})</span>}</span>
                      <span className="eat-card__price">{v.price_range || ''}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="adx-empty">
              <Icon name="pin" size={32} style={{ color: 'var(--text-faint)' }} /><br />
              {t('We don’t have individual places listed for')} {t(area.name)} {t('yet - explore it on the')} <Link href="/areas#areas-map">{t('map')}</Link>.
            </p>
          )}

          <div className="adx-other">
            <span>{t('Other areas:')}</span>
            {AREAS.filter((a) => a.slug !== slug).map((a) => (
              <Link key={a.slug} href={`/areas/${a.slug}`} className="adx-otherlink">{t(a.name)}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
