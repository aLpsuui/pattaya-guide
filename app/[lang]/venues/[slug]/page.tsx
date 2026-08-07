import './venue.css'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from '@/app/components/LocaleLink'
import BlogScript from '@/app/components/BlogScript'
import { SITE_URL } from '@/lib/site'
import VenueIcons from './VenueIcons'
import { getTranslated, translateMany } from '@/lib/i18n/translateContent'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { hasLocale } from '@/lib/i18n/config'
import { localeAlternates, clampDescription, pageTitle } from '@/lib/seo'
import { cardImg } from '@/lib/img'

// Re-generate from the database at most once every 60s (ISR), so edits to a
// venue and its child rows go live without a full rebuild.
export const revalidate = 60

// Pre-render every active venue at build (SSG) so detail pages are served from
// the edge cache (HIT) instead of dynamically rendered on each request. New
// venues added later are generated on-demand + cached (dynamicParams default).
// Only English is pre-rendered at build; Russian pages generate on-demand on
// first visit (they translate + cache DB content, which we don't want to run
// for every venue at build time — there are ~1000+ venues).
export async function generateStaticParams() {
  const { data } = await supabase.from('venues').select('slug').eq('is_active', true).limit(2000)
  return (data || []).map((v: { slug: string }) => ({ lang: 'en', slug: v.slug }))
}

interface Photo { url: string; alt: string | null; caption: string | null; sort_order: number }
interface MenuItem { section: string | null; name: string; detail: string | null; duration: string | null; price: string | null; is_featured: boolean; sort_order: number }
interface Facility { icon: string; label: string; sort_order: number }
interface QuickFact { icon: string; value: string; label: string; sort_order: number }
interface Tag { label: string; color: string; sort_order: number }
interface Highlight { label: string; sort_order: number }
interface Faq { question: string; answer: string; sort_order: number }

interface Venue {
  id: string
  slug: string
  name: string
  venue_type: string | null
  price_range: string | null
  rating: number | null
  review_count: number | null
  locally_verified: boolean | null
  tagline: string | null
  description: string | null
  about: string[] | null
  address: string | null
  neighborhood: string | null
  nearby: string | null
  hours: string | null
  hours_note: string | null
  phone: string | null
  website: string | null
  website_label: string | null
  facebook_url: string | null
  maps_query: string | null
  price_from: number | null
  price_from_label: string | null
  menu_intro: string | null
  menu_note: string | null
  map_road_label: string | null
  map_soi_label: string | null
  map_pin_label: string | null
  latitude: number | null
  longitude: number | null
  gallery_more_count: number | null
  image_url: string | null
  categories: { name_en: string; slug: string } | null
  venue_photos: Photo[]
  venue_menu_items: MenuItem[]
  venue_facilities: Facility[]
  venue_quick_facts: QuickFact[]
  venue_treatment_tags: Tag[]
  venue_highlights: Highlight[]
  venue_faqs: Faq[]
}

interface RelatedVenue {
  id: string
  slug: string
  name: string
  rating: number | null
  review_count: number | null
  image_url: string | null
  venue_type: string | null
  neighborhood: string | null
  price_from: number | null
  price_from_label: string | null
}

const SELECT = `
  id, slug, name, venue_type, price_range, rating, review_count, locally_verified,
  tagline, description, about, address, neighborhood, nearby, hours, hours_note,
  phone, website, website_label, facebook_url, maps_query, price_from, price_from_label,
  menu_intro, menu_note, map_road_label, map_soi_label, map_pin_label,
  latitude, longitude, gallery_more_count, image_url,
  categories(name_en, slug),
  venue_photos(url, alt, caption, sort_order),
  venue_menu_items(section, name, detail, duration, price, is_featured, sort_order),
  venue_facilities(icon, label, sort_order),
  venue_quick_facts(icon, value, label, sort_order),
  venue_treatment_tags(label, color, sort_order),
  venue_highlights(label, sort_order),
  venue_faqs(question, answer, sort_order)
`.replace(/\s+/g, '')

const by = (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order

async function getVenue(slug: string): Promise<Venue | null> {
  const { data } = await supabase
    .from('venues')
    .select(SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (!data) return null
  const v = data as unknown as Venue
  v.venue_photos = (v.venue_photos || []).slice().sort(by)
  v.venue_menu_items = (v.venue_menu_items || []).slice().sort(by)
  v.venue_facilities = (v.venue_facilities || []).slice().sort(by)
  v.venue_quick_facts = (v.venue_quick_facts || []).slice().sort(by)
  v.venue_treatment_tags = (v.venue_treatment_tags || []).slice().sort(by)
  v.venue_highlights = (v.venue_highlights || []).slice().sort(by)
  v.venue_faqs = (v.venue_faqs || []).slice().sort(by)
  return v
}

async function getRelated(categoryId: string | null, excludeSlug: string): Promise<RelatedVenue[]> {
  if (!categoryId) return []
  const { data } = await supabase
    .from('venues')
    .select('id, slug, name, rating, review_count, image_url, venue_type, neighborhood, price_from, price_from_label')
    .eq('is_active', true)
    .eq('category_id', categoryId)
    .neq('slug', excludeSlug)
    .order('rating', { ascending: false })
    .limit(4)
  return (data as RelatedVenue[]) || []
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const v = await getVenue(slug)
  if (!v) return { title: 'Not Found', robots: { index: false } }
  const locale = hasLocale(lang) ? lang : 'en'
  // The site is prefix-all (/en + /ru); the canonical is the locale-prefixed URL
  // to match the sitemap's hreflang entries. Names/neighborhoods stay Latin.
  const canonical = `/${locale}/venues/${v.slug}`
  const [descTx, taglineTx] = await Promise.all([
    getTranslated('venues', v.id, 'description', v.description, locale),
    getTranslated('venues', v.id, 'tagline', v.tagline, locale),
  ])
  const description = clampDescription(descTx || taglineTx)
  // pageTitle drops the " | Go To Pattaya" suffix when the base already fills the
  // ~60-char SERP budget (name + neighborhood are the ranking signal).
  const title = pageTitle(`${v.name} - ${v.neighborhood || 'Pattaya'}`)
  return {
    title,
    description,
    alternates: localeAlternates(locale, `/venues/${v.slug}`),
    openGraph: {
      type: 'website',
      title: v.name,
      description,
      url: `${SITE_URL}${canonical}`,
      images: v.image_url ? [{ url: v.image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: v.name,
      description,
      images: v.image_url ? [v.image_url] : undefined,
    },
  }
}

// Symbols defined in <VenueIcons/>. Imported venues use richer icon ids
// (pg-music, pg-dumbbell…) that aren't in the sprite - fall back so no icon
// box renders blank.
const SPRITE = new Set([
  'pg-wellness', 'pg-massage', 'pg-star', 'pg-clock', 'pg-pin', 'pg-near-me', 'pg-directions',
  'pg-phone', 'pg-globe', 'pg-calendar', 'pg-air-con', 'pg-parking', 'pg-card', 'pg-sun',
  'pg-check', 'pg-info', 'pg-local-verified', 'pg-chevron-right', 'pg-arrow-right', 'pg-arrow-left', 'pg-close',
  'pg-music', 'pg-drink', 'pg-ticket', 'pg-moon', 'pg-users', 'pg-fire', 'pg-dumbbell', 'pg-glove',
  'pg-ring', 'pg-pool', 'pg-pulse', 'pg-trophy', 'pg-parachute', 'pg-plane', 'pg-mountain', 'pg-wave', 'pg-target',
])
const Icon = ({ id, size = 16, cls = '' }: { id: string; size?: number; cls?: string }) => (
  <svg className={`pg-icon is-${size}${cls ? ' ' + cls : ''}`} aria-hidden="true"><use href={`#${SPRITE.has(id) ? id : 'pg-check'}`} /></svg>
)

export default async function VenuePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const v = await getVenue(slug)
  if (!v) notFound()
  const locale = hasLocale(lang) ? lang : 'en'

  // Related venues share the same category; we only have the category slug here,
  // so getRelatedBySlug resolves it to a category_id then queries siblings.
  // Fetched up-front so their venue_type labels join the translation batch.
  const relatedVenues = await getRelatedBySlug(v.categories?.slug || null, v.slug)

  // The DB category slug for Things to Do is the legacy 'thinks-to-do'; its
  // public route is /things-to-do. Linking the raw slug costs a 308 hop on
  // every venue page (breadcrumb + JSON-LD), so map it here.
  const categorySlug = v.categories?.slug
    ? (v.categories.slug === 'thinks-to-do' ? '/things-to-do' : `/${v.categories.slug}`)
    : '/'
  // English category name — used verbatim in the JSON-LD breadcrumb (schema stays
  // English so structured data matches the canonical English page).
  const categoryName = v.categories?.name_en || 'Pattaya'
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(v.maps_query || v.name + ' Pattaya')}`
  const photos = v.venue_photos
  const gallery = photos.slice(0, 5)

  // ---- i18n: static UI dict + all per-venue DB text translated in parallel ----
  // Every getTranslated/translateMany promise below is created BEFORE the single
  // await Promise.all, so they resolve concurrently (fast first /ru render). For
  // locale 'en' each call returns its source synchronously (no API hit → build-safe).
  const tg = (field: string, text: string | null | undefined) => getTranslated('venues', v.id, field, text, locale)
  const cg = (id: string, field: string, text: string | null | undefined) => getTranslated('venues', id, field, text, locale)

  const dictP = getDictionary(locale)
  const typeMapP = translateMany('venue_types', 'label', [v.venue_type, ...relatedVenues.map((r) => r.venue_type)], locale)
  const catMapP = translateMany('categories', 'name_en', [v.categories?.name_en], locale)
  const taglineP = tg('tagline', v.tagline)
  const menuIntroP = tg('menu_intro', v.menu_intro)
  const menuNoteP = tg('menu_note', v.menu_note)
  const aboutP = Promise.all((v.about || []).map((p, i) => tg(`about:${i}`, p)))
  const quickFactsP = Promise.all(v.venue_quick_facts.map((f, i) => Promise.all([cg(`${v.id}:qf:${i}`, 'value', f.value), cg(`${v.id}:qf:${i}`, 'label', f.label)])))
  const tagsP = Promise.all(v.venue_treatment_tags.map((tg2, i) => cg(`${v.id}:tag:${i}`, 'label', tg2.label)))
  const facilitiesP = Promise.all(v.venue_facilities.map((f, i) => cg(`${v.id}:fac:${i}`, 'label', f.label)))
  const highlightsP = Promise.all(v.venue_highlights.map((h, i) => cg(`${v.id}:hl:${i}`, 'label', h.label)))
  const faqsP = Promise.all(v.venue_faqs.map((f, i) => Promise.all([cg(`${v.id}:faq:${i}`, 'q', f.question), cg(`${v.id}:faq:${i}`, 'a', f.answer)])))
  const menuP = Promise.all(v.venue_menu_items.map((m, i) => Promise.all([cg(`${v.id}:menu:${i}`, 'section', m.section), cg(`${v.id}:menu:${i}`, 'name', m.name), cg(`${v.id}:menu:${i}`, 'detail', m.detail)])))

  const [dict, typeMap, catMap, tagline, menuIntro, menuNote, about, quickFacts, tagLabels, facilityLabels, highlightLabels, faqTx, menuTx] =
    await Promise.all([dictP, typeMapP, catMapP, taglineP, menuIntroP, menuNoteP, aboutP, quickFactsP, tagsP, facilitiesP, highlightsP, faqsP, menuP])

  const t = (s: string) => dict?.[s] ?? s
  const tt = (s: string | null | undefined) => (s ? (typeMap.get(s) ?? s) : s)
  // Category + venue_type labels for on-page display (translated; JSON-LD keeps English).
  const categoryLabel = v.categories?.name_en ? (catMap.get(v.categories.name_en) ?? categoryName) : 'Pattaya'
  const venueTypeLabel = tt(v.venue_type)

  // Build the lightbox photo list (all photos) for the injected client script.
  const lbPhotos = photos.map(p => ({ src: p.url, cap: p.caption || p.alt || v.name }))
  const SCRIPT = `
(function(){
  "use strict";
  var photos = ${JSON.stringify(lbPhotos).replace(/</g, '\\u003c')};
  var lb = document.getElementById('det-lb');
  if(!lb) return;
  var lbImg = document.getElementById('det-lb-img');
  var lbCap = document.getElementById('det-lb-cap');
  var cur = 0, lastFocus = null;
  function show(i){ cur = (i + photos.length) % photos.length; if(!photos.length) return;
    lbImg.src = photos[cur].src; lbImg.alt = photos[cur].cap; lbCap.textContent = photos[cur].cap; }
  function open(i){ lastFocus = document.activeElement; show(i);
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
    lb.querySelector('[data-lb-close]').focus(); }
  function close(){ lb.classList.remove('open'); document.body.style.overflow = '';
    if(lastFocus) lastFocus.focus(); }
  document.querySelectorAll('#det-gallery [data-lb]').forEach(function(btn){
    btn.addEventListener('click', function(){ open(parseInt(btn.getAttribute('data-lb'),10)); }); });
  lb.querySelector('[data-lb-close]').addEventListener('click', close);
  lb.querySelector('[data-lb-prev]').addEventListener('click', function(){ show(cur-1); });
  lb.querySelector('[data-lb-next]').addEventListener('click', function(){ show(cur+1); });
  lb.addEventListener('click', function(e){ if(e.target === lb) close(); });
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    else if(e.key === 'ArrowLeft') show(cur-1);
    else if(e.key === 'ArrowRight') show(cur+1); });
  document.querySelectorAll('.det-yf .acc .q').forEach(function(q){
    q.addEventListener('click', function(){
      var acc = q.closest('.acc');
      var openState = acc.classList.toggle('open');
      q.setAttribute('aria-expanded', openState ? 'true' : 'false'); }); });
  var car = document.getElementById('det-more');
  if(car){ document.querySelectorAll('.det-yf__more [data-car]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var amount = Math.min(car.clientWidth * 0.8, 320);
      car.scrollBy({ left: btn.getAttribute('data-car') === 'next' ? amount : -amount, behavior: 'smooth' }); }); }); }
})();
`

  const sameAs = [v.website, v.facebook_url].filter(Boolean)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/venues/${v.slug}#business`,
        name: v.name,
        description: v.description || v.tagline || undefined,
        image: photos.map(p => p.url),
        url: `${SITE_URL}/venues/${v.slug}`,
        telephone: v.phone || undefined,
        priceRange: v.price_range || undefined,
        address: v.address
          ? {
              '@type': 'PostalAddress',
              streetAddress: v.address,
              addressLocality: v.neighborhood || 'Pattaya',
              addressRegion: 'Chon Buri',
              addressCountry: 'TH',
            }
          : undefined,
        geo: v.latitude != null && v.longitude != null
          ? { '@type': 'GeoCoordinates', latitude: v.latitude, longitude: v.longitude }
          : undefined,
        sameAs: sameAs.length ? sameAs : undefined,
        // No aggregateRating in JSON-LD: the ratings come from Google Maps, not
        // first-party reviews we collect and display, so marking them up is
        // self-serving per Google's review-snippet policy. The rating still
        // shows in the visible page (with its source), just not as rich-result
        // markup - closing a site-wide structured-data risk.
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: categoryName, item: `${SITE_URL}${categorySlug}` },
          { '@type': 'ListItem', position: 3, name: v.name, item: `${SITE_URL}/venues/${v.slug}` },
        ],
      },
    ],
  }

  return (
    <div className="det-yf">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VenueIcons />

      {/* 1 · BREADCRUMB */}
      <nav className="det-yf__wrap det-yf__crumb crumb" aria-label={t('Breadcrumb')}>
        <Link href="/">{t('Home')}</Link>
        <Icon id="pg-chevron-right" />
        <Link href={categorySlug}>{categoryLabel}</Link>
        {venueTypeLabel && (<><Icon id="pg-chevron-right" /><Link href={categorySlug}>{venueTypeLabel}</Link></>)}
        <Icon id="pg-chevron-right" />
        <span className="cur" aria-current="page">{v.name}</span>
      </nav>

      {/* 2 · HERO / TITLE */}
      <section className="det-yf__hero" aria-labelledby="det-h1">
        <div className="det-yf__wrap det-yf__hero-inner">
          <div className="det-yf__title"><h1 id="det-h1">{v.name}</h1></div>
          {tagline && <p className="det-yf__tagline">{tagline}</p>}
          <div className="det-yf__meta">
            {v.rating != null && (
              <span className="rate"><Icon id="pg-star" cls="is-rating" />{v.rating.toFixed(1)}
                {v.review_count != null && <span className="count"> · {v.review_count.toLocaleString()} {t('reviews')}</span>}</span>
            )}
            {v.neighborhood && <span className="det-yf__metaitem"><Icon id="pg-pin" /> {v.neighborhood}</span>}
            {v.hours && <span className="pill pill--success"><Icon id="pg-clock" /> {v.hours}</span>}
            {v.locally_verified && <span className="det-yf__verified"><Icon id="pg-local-verified" /> {t('Locally verified')}</span>}
          </div>
        </div>
      </section>

      {/* 3 · GALLERY */}
      {gallery.length > 0 && (
        <section className="det-yf__wrap" aria-label={t('Photo gallery')}>
          <div className="det-yf__gallery" id="det-gallery">
            {gallery.map((p, i) => (
              <button
                key={i}
                className={`det-yf__gitem${i === 0 ? ' det-yf__gitem--hero' : ''}${i === 4 ? ' det-yf__gitem--hidemobile' : ''}`}
                type="button"
                data-lb={i}
                aria-label={`${t('Open photo')}: ${p.alt || v.name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i === 0 ? p.url : (cardImg(p.url) || p.url)} alt={p.alt || v.name} loading={i === 0 ? undefined : 'lazy'}
                  width={i === 0 ? 800 : 400} height={i === 0 ? 600 : 300} />
                {i === 4 && (v.gallery_more_count || 0) > 0 && (
                  <span className="det-yf__gmore" aria-hidden="true">+{v.gallery_more_count} {t('photos')}</span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 2-COL LAYOUT */}
      <div className="det-yf__wrap det-yf__layout">
        <div className="det-yf__content">

          {/* 4 · QUICK FACTS */}
          {v.venue_quick_facts.length > 0 && (
            <section aria-labelledby="qf-h">
              <div className="det-yf__sechead">
                <span className="kicker">{t('At a glance')}</span>
                <h2 id="qf-h">{t('Quick facts')}</h2>
                <p>{t('The essentials before you go - what')} {v.name} {t('offers and what it costs.')}</p>
              </div>
              <div className="det-yf__facts">
                {v.venue_quick_facts.map((f, i) => (
                  <div className="det-yf__fact" key={i}>
                    <Icon id={f.icon} size={24} />
                    <b>{quickFacts[i][0]}</b><span>{quickFacts[i][1]}</span>
                  </div>
                ))}
              </div>
              {v.venue_treatment_tags.length > 0 && (
                <div className="det-yf__styles" aria-label={t('Treatments offered')}>
                  {v.venue_treatment_tags.map((tag, i) => (
                    <span key={i} className={`pill pill--${tag.color === 'cyan' ? 'cyan' : 'blue'}`}>{tagLabels[i]}</span>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 5 · MENU */}
          {v.venue_menu_items.length > 0 && (
            <section aria-labelledby="menu-h">
              <div className="det-yf__sechead">
                <span className="kicker"><Icon id="pg-massage" /> {t('Treatments')}</span>
                <h2 id="menu-h">{t('Menu & prices')}</h2>
                {menuIntro && <p>{menuIntro}</p>}
              </div>
              <div className="det-yf__tt-wrap">
                <table className="det-yf__tt">
                  <caption className="visually-hidden">{v.name} {t('treatment menu and prices')}</caption>
                  <thead>
                    <tr><th scope="col">{t('Treatment')}</th><th scope="col">{t('Duration')}</th><th scope="col">{t('Price')}</th></tr>
                  </thead>
                  <tbody>
                    {v.venue_menu_items.map((m, i) => {
                      const prev = v.venue_menu_items[i - 1]
                      const showSection = m.section && (!prev || prev.section !== m.section)
                      return (
                        <ItemRows key={i} showSection={!!showSection} section={menuTx[i][0]} name={menuTx[i][1]}
                          detail={menuTx[i][2]} isFeatured={m.is_featured} duration={m.duration} price={m.price} />
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {menuNote && (
                <div className="det-yf__ttnote alert alert--info" role="note">
                  <Icon id="pg-info" size={20} />
                  <span>{menuNote}</span>
                </div>
              )}
            </section>
          )}

          {/* 6 · FACILITIES */}
          {v.venue_facilities.length > 0 && (
            <section aria-labelledby="fac-h">
              <div className="det-yf__sechead">
                <span className="kicker">{t('On site')}</span>
                <h2 id="fac-h">{t('Facilities')}</h2>
              </div>
              <div className="det-yf__fac-grid">
                {v.venue_facilities.map((f, i) => (
                  <div className="det-yf__fac-item" key={i}>
                    <span className="ic" aria-hidden="true"><Icon id={f.icon} size={20} /></span>
                    <b>{facilityLabels[i]}</b>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7 · ABOUT */}
          {v.about && v.about.length > 0 && (
            <section aria-labelledby="about-h">
              <div className="det-yf__sechead">
                <span className="kicker">{t('The space')}</span>
                <h2 id="about-h">{t('About')} {v.name}</h2>
              </div>
              <div className="det-yf__prose">
                {about.map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </section>
          )}

          {/* 8 · GOOD TO KNOW */}
          {v.venue_highlights.length > 0 && (
            <section aria-labelledby="bring-h">
              <div className="det-yf__sechead">
                <span className="kicker">{t('Good to know')}</span>
                <h2 id="bring-h">{t('Good to know')}</h2>
              </div>
              <ul className="det-yf__bring">
                {v.venue_highlights.map((h, i) => (
                  <li key={i}><Icon id="pg-check" size={20} /> {highlightLabels[i]}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 10 · GETTING THERE */}
          <section id="getting-there" aria-labelledby="get-h">
            <div className="det-yf__sechead">
              <span className="kicker"><Icon id="pg-pin" /> {t('Location')}</span>
              <h2 id="get-h">{t('Getting there')}</h2>
            </div>
            <div className="det-yf__getting">
              <figure className="det-yf__mapfig">
                <iframe
                  title={`${t('Map of')} ${v.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(v.maps_query || v.address || `${v.name} Pattaya`)}&output=embed`}
                />
              </figure>

              <div className="det-yf__addr">
                {v.address && (
                  <div className="det-yf__addr-row"><Icon id="pg-pin" size={20} />
                    <span><b>{t('Address')}</b>{v.address}</span></div>
                )}
                {v.nearby && (
                  <div className="det-yf__addr-row"><Icon id="pg-near-me" size={20} />
                    <span><b>{t('Nearby')}</b>{v.nearby}</span></div>
                )}
                {v.hours && (
                  <div className="det-yf__addr-row"><Icon id="pg-clock" size={20} />
                    <span><b>{t('Hours')}</b>{v.hours}{v.hours_note ? ` · ${v.hours_note}` : ''}</span></div>
                )}
                <div className="det-yf__addr-actions">
                  <a className="btn btn--primary btn--sm" href={mapsHref} target="_blank" rel="noopener">
                    <Icon id="pg-directions" /> {t('Get directions')}</a>
                </div>
              </div>
            </div>
          </section>

          {/* 11 · FAQ */}
          {v.venue_faqs.length > 0 && (
            <section aria-labelledby="faq-h">
              <div className="det-yf__sechead">
                <span className="kicker">{t('Before you go')}</span>
                <h2 id="faq-h">{t('Frequently asked')}</h2>
              </div>
              <div className="det-yf__faq">
                {v.venue_faqs.map((f, i) => (
                  <div className="acc" key={i}>
                    <button className="q" type="button" aria-expanded="false">{faqTx[i][0]}
                      <svg className="pg-icon is-20 det-yf__pm" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path className="v" d="M12 5v14" /></svg></button>
                    <div className="a"><div className="a-in">{faqTx[i][1]}</div></div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>{/* /content */}

        {/* 13 · INFO CARD (sticky aside) */}
        <aside className="det-yf__aside" aria-labelledby="card-h">
          <div className="det-yf__card">
            <div className="det-yf__card-head">
              <h2 id="card-h">{v.name}</h2>
              <div className="det-yf__card-meta">
                {v.rating != null && (
                  <span className="rate"><Icon id="pg-star" cls="is-rating" />{v.rating.toFixed(1)}
                    {v.review_count != null && <span className="count"> · {v.review_count.toLocaleString()}</span>}</span>
                )}
                {v.hours && <span className="pill pill--success"><Icon id="pg-clock" /> {v.hours}</span>}
              </div>
            </div>

            {v.price_from != null && (
              <div className="det-yf__card-price">
                <b>฿{v.price_from.toLocaleString()}</b>
                <span className="per">{v.price_from_label || t('from')}</span>
              </div>
            )}

            <div className="det-yf__card-list">
              {v.address && (
                <div className="row"><Icon id="pg-pin" size={20} /><span>{v.address}</span></div>
              )}
              {v.hours && (
                <div className="row"><Icon id="pg-clock" size={20} /><span><span className="open">{v.hours}</span></span></div>
              )}
              {v.phone && (
                <div className="row"><Icon id="pg-phone" size={20} /><span><a href={`tel:${v.phone.replace(/[^0-9+]/g, '')}`}>{v.phone}</a></span></div>
              )}
              {v.website && (
                <div className="row"><Icon id="pg-globe" size={20} /><span><a href={v.website} target="_blank" rel="noopener">{v.website_label || t('Website')}</a></span></div>
              )}
              {v.locally_verified && (
                <div className="row"><Icon id="pg-local-verified" size={20} /><span>{t('Locally verified by Go To Pattaya')}</span></div>
              )}
            </div>

            <div className="det-yf__card-actions">
              <a className="btn btn--primary" href={mapsHref} target="_blank" rel="noopener">
                <Icon id="pg-directions" size={20} /> {t('Get directions')}</a>
              {v.website && (
                <a className="btn btn--secondary" href={v.website} target="_blank" rel="noopener">
                  <Icon id="pg-globe" size={20} /> {t('Visit website')}</a>
              )}
            </div>
          </div>
        </aside>
      </div>{/* /layout */}

      {/* 12 · MORE VENUES */}
      {relatedVenues.length > 0 && (
        <section className="det-yf__wrap det-yf__more" aria-labelledby="more-h" style={{ paddingBottom: 'var(--s8)' }}>
          <div className="det-yf__sechead">
            <span className="kicker">{t('Keep exploring')}</span>
            <h2 id="more-h">{t('More')} {categoryLabel.toLowerCase()}</h2>
            <p>{t('Other locally verified places around Pattaya.')}</p>
          </div>
          <div className="carousel-wrap">
            <button className="car-btn car-prev" type="button" aria-label={t('Previous')} data-car="prev">
              <Icon id="pg-arrow-left" size={20} /></button>
            <button className="car-btn car-next" type="button" aria-label={t('Next')} data-car="next">
              <Icon id="pg-arrow-right" size={20} /></button>
            <div className="carousel" id="det-more">
              {relatedVenues.map(r => (
                <Link key={r.id} className="det-yf__morecard" href={`/venues/${r.slug}`}>
                  <div className="det-yf__morecard__media">
                    {r.image_url
                      ? // eslint-disable-next-line @next/next/no-img-element
                        <img src={cardImg(r.image_url) || r.image_url} alt={r.name} loading="lazy" width={560} height={420} />
                      : <div className="det-yf__morecard__ph" aria-hidden="true"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'var(--grad-brand, #e2e8f0)', color: '#fff' }}>
                          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="m4 17 4.5-4.5 3.5 3.5 3.5-3.5L20 16" /></svg>
                        </div>}
                    <span className="det-yf__morecard__tag"><Icon id="pg-massage" /> {tt(r.venue_type) || t('Venue')}</span>
                  </div>
                  <div className="det-yf__morecard__body">
                    <h3>{r.name}</h3>
                    {r.rating != null && (
                      <span className="rate"><Icon id="pg-star" cls="is-rating" />{r.rating.toFixed(1)}
                        {r.review_count != null && <span className="count"> ({r.review_count.toLocaleString()})</span>}</span>
                    )}
                    {r.neighborhood && <span className="det-yf__morecard__loc"><Icon id="pg-pin" /> {r.neighborhood}</span>}
                    {r.price_from != null && (
                      <span className="det-yf__morecard__price">{t('From')} ฿{r.price_from.toLocaleString()} {r.price_from_label && <span>· {r.price_from_label}</span>}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX */}
      <div className="det-yf__lb" id="det-lb" role="dialog" aria-modal="true" aria-label={t('Photo viewer')}>
        <button className="det-yf__lbclose" type="button" data-lb-close aria-label={t('Close photo viewer')}>
          <Icon id="pg-close" size={24} /></button>
        <button className="det-yf__lbnav det-yf__lbnav--prev" type="button" data-lb-prev aria-label={t('Previous photo')}>
          <Icon id="pg-arrow-left" size={24} /></button>
        <figure>
          {/* src is set by the lightbox script on open; omitted here to avoid an empty-src warning */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="det-lb-img" alt="" />
          <figcaption id="det-lb-cap"></figcaption>
        </figure>
        <button className="det-yf__lbnav det-yf__lbnav--next" type="button" data-lb-next aria-label={t('Next photo')}>
          <Icon id="pg-arrow-right" size={24} /></button>
      </div>

      <BlogScript script={SCRIPT} />
    </div>
  )
}

// Render a menu section header row (when the section changes) plus the item row.
// section/name/detail arrive already translated; duration/price stay verbatim.
function ItemRows({ showSection, section, name, detail, isFeatured, duration, price }: {
  showSection: boolean; section: string | null; name: string; detail: string | null
  isFeatured: boolean; duration: string | null; price: string | null
}) {
  return (
    <>
      {showSection && <tr className="det-yf__cat"><td colSpan={3}>{section}</td></tr>}
      <tr>
        <td>{isFeatured ? <b>{name}</b> : name}{detail ? ` ${detail}` : ''}</td>
        <td className="dur">{duration}</td>
        <td className="price">{price}</td>
      </tr>
    </>
  )
}

async function getRelatedBySlug(categorySlug: string | null, excludeSlug: string): Promise<RelatedVenue[]> {
  if (!categorySlug) return []
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single()
  const categoryId = (cat as { id: string } | null)?.id
  if (!categoryId) return []
  return getRelated(categoryId, excludeSlug)
}
