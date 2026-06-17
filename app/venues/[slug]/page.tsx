import './venue.css'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BlogScript from '@/app/components/BlogScript'
import { SITE_URL } from '@/lib/site'
import VenueIcons from './VenueIcons'
import VenueMap from '@/app/components/VenueMap'

const HAS_MAPS = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

// Re-generate from the database at most once every 60s (ISR), so edits to a
// venue and its child rows go live without a full rebuild.
export const revalidate = 60

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const v = await getVenue(slug)
  if (!v) return { title: 'Not Found', robots: { index: false } }
  const canonical = `/venues/${v.slug}`
  const description = v.description || v.tagline || undefined
  return {
    title: `${v.name} — ${v.neighborhood || 'Pattaya'} | Go To Pattaya`,
    description,
    alternates: { canonical },
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

const Icon = ({ id, size = 16, cls = '' }: { id: string; size?: number; cls?: string }) => (
  <svg className={`pg-icon is-${size}${cls ? ' ' + cls : ''}`} aria-hidden="true"><use href={`#${id}`} /></svg>
)

export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const v = await getVenue(slug)
  if (!v) notFound()

  const categorySlug = v.categories?.slug ? `/${v.categories.slug}` : '/'
  const categoryName = v.categories?.name_en || 'Pattaya'
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(v.maps_query || v.name + ' Pattaya')}`
  const photos = v.venue_photos
  const gallery = photos.slice(0, 5)

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

  // Related venues share the same category; we only have the category slug here,
  // so getRelatedBySlug resolves it to a category_id then queries siblings.
  const relatedVenues = await getRelatedBySlug(v.categories?.slug || null, v.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        name: v.name,
        description: v.description || v.tagline || undefined,
        image: photos.map(p => p.url),
        address: v.address || undefined,
        telephone: v.phone || undefined,
        url: v.website || undefined,
        aggregateRating: v.rating
          ? { '@type': 'AggregateRating', ratingValue: v.rating, reviewCount: v.review_count || 0 }
          : undefined,
        priceRange: v.price_range || undefined,
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
      <nav className="det-yf__wrap det-yf__crumb crumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <Icon id="pg-chevron-right" />
        <Link href={categorySlug}>{categoryName}</Link>
        {v.venue_type && (<><Icon id="pg-chevron-right" /><Link href={categorySlug}>{v.venue_type}</Link></>)}
        <Icon id="pg-chevron-right" />
        <span className="cur" aria-current="page">{v.name}</span>
      </nav>

      {/* 2 · HERO / TITLE */}
      <section className="det-yf__hero" aria-labelledby="det-h1">
        <div className="det-yf__wrap det-yf__hero-inner">
          <div className="det-yf__title"><h1 id="det-h1">{v.name}</h1></div>
          {v.tagline && <p className="det-yf__tagline">{v.tagline}</p>}
          <div className="det-yf__meta">
            {v.rating != null && (
              <span className="rate"><Icon id="pg-star" cls="is-rating" />{v.rating.toFixed(1)}
                {v.review_count != null && <span className="count"> · {v.review_count.toLocaleString()} reviews</span>}</span>
            )}
            {v.neighborhood && <span className="det-yf__metaitem"><Icon id="pg-pin" /> {v.neighborhood}</span>}
            {v.hours && <span className="pill pill--success"><Icon id="pg-clock" /> {v.hours}</span>}
            {v.locally_verified && <span className="det-yf__verified"><Icon id="pg-local-verified" /> Locally verified</span>}
          </div>
        </div>
      </section>

      {/* 3 · GALLERY */}
      {gallery.length > 0 && (
        <section className="det-yf__wrap" aria-label="Photo gallery">
          <div className="det-yf__gallery" id="det-gallery">
            {gallery.map((p, i) => (
              <button
                key={i}
                className={`det-yf__gitem${i === 0 ? ' det-yf__gitem--hero' : ''}${i === 4 ? ' det-yf__gitem--hidemobile' : ''}`}
                type="button"
                data-lb={i}
                aria-label={`Open photo: ${p.alt || v.name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.alt || v.name} loading={i === 0 ? undefined : 'lazy'}
                  width={i === 0 ? 800 : 400} height={i === 0 ? 600 : 300} />
                {i === 4 && (v.gallery_more_count || 0) > 0 && (
                  <span className="det-yf__gmore" aria-hidden="true">+{v.gallery_more_count} photos</span>
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
                <span className="kicker">At a glance</span>
                <h2 id="qf-h">Quick facts</h2>
                <p>The essentials before you go — what {v.name} offers and what it costs.</p>
              </div>
              <div className="det-yf__facts">
                {v.venue_quick_facts.map((f, i) => (
                  <div className="det-yf__fact" key={i}>
                    <Icon id={f.icon} size={24} />
                    <b>{f.value}</b><span>{f.label}</span>
                  </div>
                ))}
              </div>
              {v.venue_treatment_tags.length > 0 && (
                <div className="det-yf__styles" aria-label="Treatments offered">
                  {v.venue_treatment_tags.map((t, i) => (
                    <span key={i} className={`pill pill--${t.color === 'cyan' ? 'cyan' : 'blue'}`}>{t.label}</span>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 5 · MENU */}
          {v.venue_menu_items.length > 0 && (
            <section aria-labelledby="menu-h">
              <div className="det-yf__sechead">
                <span className="kicker"><Icon id="pg-massage" /> Treatments</span>
                <h2 id="menu-h">Menu &amp; prices</h2>
                {v.menu_intro && <p>{v.menu_intro}</p>}
              </div>
              <div className="det-yf__tt-wrap">
                <table className="det-yf__tt">
                  <caption className="visually-hidden">{v.name} treatment menu and prices</caption>
                  <thead>
                    <tr><th scope="col">Treatment</th><th scope="col">Duration</th><th scope="col">Price</th></tr>
                  </thead>
                  <tbody>
                    {v.venue_menu_items.map((m, i) => {
                      const prev = v.venue_menu_items[i - 1]
                      const showSection = m.section && (!prev || prev.section !== m.section)
                      return (
                        <ItemRows key={i} showSection={!!showSection} section={m.section} m={m} />
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {v.menu_note && (
                <div className="det-yf__ttnote alert alert--info" role="note">
                  <Icon id="pg-info" size={20} />
                  <span>{v.menu_note}</span>
                </div>
              )}
            </section>
          )}

          {/* 6 · FACILITIES */}
          {v.venue_facilities.length > 0 && (
            <section aria-labelledby="fac-h">
              <div className="det-yf__sechead">
                <span className="kicker">On site</span>
                <h2 id="fac-h">Facilities</h2>
              </div>
              <div className="det-yf__fac-grid">
                {v.venue_facilities.map((f, i) => (
                  <div className="det-yf__fac-item" key={i}>
                    <span className="ic" aria-hidden="true"><Icon id={f.icon} size={20} /></span>
                    <b>{f.label}</b>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7 · ABOUT */}
          {v.about && v.about.length > 0 && (
            <section aria-labelledby="about-h">
              <div className="det-yf__sechead">
                <span className="kicker">The space</span>
                <h2 id="about-h">About {v.name}</h2>
              </div>
              <div className="det-yf__prose">
                {v.about.map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </section>
          )}

          {/* 8 · GOOD TO KNOW */}
          {v.venue_highlights.length > 0 && (
            <section aria-labelledby="bring-h">
              <div className="det-yf__sechead">
                <span className="kicker">Good to know</span>
                <h2 id="bring-h">Good to know</h2>
              </div>
              <ul className="det-yf__bring">
                {v.venue_highlights.map((h, i) => (
                  <li key={i}><Icon id="pg-check" size={20} /> {h.label}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 10 · GETTING THERE */}
          <section id="getting-there" aria-labelledby="get-h">
            <div className="det-yf__sechead">
              <span className="kicker"><Icon id="pg-pin" /> Location</span>
              <h2 id="get-h">Getting there</h2>
            </div>
            <div className="det-yf__getting">
              <figure className="det-yf__mapfig" role="img" aria-label={`Map of ${v.name}`}>
                {HAS_MAPS ? (
                  <VenueMap lat={v.latitude} lng={v.longitude} query={v.maps_query || `${v.name} Pattaya`} label={v.name} />
                ) : (
                  <>
                    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="400" height="300" fill="#eef7fc" />
                      <rect x="40" y="40" width="110" height="64" rx="6" fill="#d6ebf6" />
                      <rect x="250" y="40" width="110" height="64" rx="6" fill="#d6ebf6" />
                      <rect x="40" y="196" width="120" height="70" rx="6" fill="#d6ebf6" />
                      <rect x="250" y="196" width="110" height="70" rx="6" fill="#d6ebf6" />
                      <rect x="0" y="120" width="400" height="24" fill="#ffffff" stroke="#cfe1ee" />
                      <rect x="180" y="0" width="24" height="300" fill="#ffffff" stroke="#cfe1ee" />
                      <rect x="214" y="150" width="96" height="38" rx="6" fill="#cfe8f5" stroke="#2fbddc" strokeWidth="2" />
                      {v.map_road_label && <text x="60" y="136" fontFamily="Manrope, sans-serif" fontSize="9" fill="#5f6b75">{v.map_road_label}</text>}
                      {v.map_soi_label && <text x="186" y="290" fontFamily="Manrope, sans-serif" fontSize="9" fill="#5f6b75" transform="rotate(-90 191 285)">{v.map_soi_label}</text>}
                    </svg>
                    <span className="det-yf__mappin" aria-hidden="true"><Icon id="pg-pin" size={40} /></span>
                    {v.map_pin_label && <span className="det-yf__maplabel">{v.map_pin_label}</span>}
                  </>
                )}
              </figure>

              <div className="det-yf__addr">
                {v.address && (
                  <div className="det-yf__addr-row"><Icon id="pg-pin" size={20} />
                    <span><b>Address</b>{v.address}</span></div>
                )}
                {v.nearby && (
                  <div className="det-yf__addr-row"><Icon id="pg-near-me" size={20} />
                    <span><b>Nearby</b>{v.nearby}</span></div>
                )}
                {v.hours && (
                  <div className="det-yf__addr-row"><Icon id="pg-clock" size={20} />
                    <span><b>Hours</b>{v.hours}{v.hours_note ? ` · ${v.hours_note}` : ''}</span></div>
                )}
                <div className="det-yf__addr-actions">
                  <a className="btn btn--primary btn--sm" href={mapsHref} target="_blank" rel="noopener">
                    <Icon id="pg-directions" /> Get directions</a>
                </div>
              </div>
            </div>
          </section>

          {/* 11 · FAQ */}
          {v.venue_faqs.length > 0 && (
            <section aria-labelledby="faq-h">
              <div className="det-yf__sechead">
                <span className="kicker">Before you go</span>
                <h2 id="faq-h">Frequently asked</h2>
              </div>
              <div className="det-yf__faq">
                {v.venue_faqs.map((f, i) => (
                  <div className="acc" key={i}>
                    <button className="q" type="button" aria-expanded="false">{f.question}
                      <svg className="pg-icon is-20 det-yf__pm" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path className="v" d="M12 5v14" /></svg></button>
                    <div className="a"><div className="a-in">{f.answer}</div></div>
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
                <span className="per">{v.price_from_label || 'from'}</span>
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
                <div className="row"><Icon id="pg-globe" size={20} /><span><a href={v.website} target="_blank" rel="noopener">{v.website_label || 'Website'}</a></span></div>
              )}
              {v.locally_verified && (
                <div className="row"><Icon id="pg-local-verified" size={20} /><span>Locally verified by Pattaya Guide</span></div>
              )}
            </div>

            <div className="det-yf__card-actions">
              <a className="btn btn--primary" href={mapsHref} target="_blank" rel="noopener">
                <Icon id="pg-directions" size={20} /> Get directions</a>
              {v.website && (
                <a className="btn btn--secondary" href={v.website} target="_blank" rel="noopener">
                  <Icon id="pg-globe" size={20} /> Visit website</a>
              )}
            </div>
          </div>
        </aside>
      </div>{/* /layout */}

      {/* 12 · MORE VENUES */}
      {relatedVenues.length > 0 && (
        <section className="det-yf__wrap det-yf__more" aria-labelledby="more-h" style={{ paddingBottom: 'var(--s8)' }}>
          <div className="det-yf__sechead">
            <span className="kicker">Keep exploring</span>
            <h2 id="more-h">More {categoryName.toLowerCase()}</h2>
            <p>Other locally verified places around Pattaya.</p>
          </div>
          <div className="carousel-wrap">
            <button className="car-btn car-prev" type="button" aria-label="Previous" data-car="prev">
              <Icon id="pg-arrow-left" size={20} /></button>
            <button className="car-btn car-next" type="button" aria-label="Next" data-car="next">
              <Icon id="pg-arrow-right" size={20} /></button>
            <div className="carousel" id="det-more">
              {relatedVenues.map(r => (
                <Link key={r.id} className="det-yf__morecard" href={`/venues/${r.slug}`}>
                  <div className="det-yf__morecard__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.image_url || ''} alt={r.name} loading="lazy" width={560} height={420} />
                    <span className="det-yf__morecard__tag"><Icon id="pg-massage" /> {r.venue_type || 'Venue'}</span>
                  </div>
                  <div className="det-yf__morecard__body">
                    <h3>{r.name}</h3>
                    {r.rating != null && (
                      <span className="rate"><Icon id="pg-star" cls="is-rating" />{r.rating.toFixed(1)}
                        {r.review_count != null && <span className="count"> ({r.review_count.toLocaleString()})</span>}</span>
                    )}
                    {r.neighborhood && <span className="det-yf__morecard__loc"><Icon id="pg-pin" /> {r.neighborhood}</span>}
                    {r.price_from != null && (
                      <span className="det-yf__morecard__price">From ฿{r.price_from.toLocaleString()} {r.price_from_label && <span>· {r.price_from_label}</span>}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX */}
      <div className="det-yf__lb" id="det-lb" role="dialog" aria-modal="true" aria-label="Photo viewer">
        <button className="det-yf__lbclose" type="button" data-lb-close aria-label="Close photo viewer">
          <Icon id="pg-close" size={24} /></button>
        <button className="det-yf__lbnav det-yf__lbnav--prev" type="button" data-lb-prev aria-label="Previous photo">
          <Icon id="pg-arrow-left" size={24} /></button>
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="det-lb-img" src="" alt="" />
          <figcaption id="det-lb-cap"></figcaption>
        </figure>
        <button className="det-yf__lbnav det-yf__lbnav--next" type="button" data-lb-next aria-label="Next photo">
          <Icon id="pg-arrow-right" size={24} /></button>
      </div>

      <BlogScript script={SCRIPT} />
    </div>
  )
}

// Render a menu section header row (when the section changes) plus the item row.
function ItemRows({ showSection, section, m }: { showSection: boolean; section: string | null; m: MenuItem }) {
  return (
    <>
      {showSection && <tr className="det-yf__cat"><td colSpan={3}>{section}</td></tr>}
      <tr>
        <td>{m.is_featured ? <b>{m.name}</b> : m.name}{m.detail ? ` ${m.detail}` : ''}</td>
        <td className="dur">{m.duration}</td>
        <td className="price">{m.price}</td>
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
