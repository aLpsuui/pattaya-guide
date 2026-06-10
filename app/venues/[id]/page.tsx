import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface VenueImage { image_url: string; display_order: number }
interface MenuItem {
  id: string; section_name: string; item_name: string
  duration: string | null; price_60: string | null; price_90: string | null
  price_120: string | null; price_custom: string | null; description: string | null
  display_order: number
}
interface Venue {
  id: string; name: string; slug: string; rating: number; review_count: number
  venue_type: string; price_range: string; address: string; phone: string
  status: string; working_hours: string; maps_link: string
  description_en: string | null; image_url: string | null
  category_id: string
  categories: { name_en: string; slug: string }
}

async function getVenue(id: string): Promise<Venue | null> {
  const { data, error } = await supabase
    .from('venues').select('*, categories(name_en, slug)').eq('id', id).single()
  if (error || !data) return null
  return data as unknown as Venue
}
async function getVenueImages(venueId: string): Promise<VenueImage[]> {
  const { data } = await supabase.from('venue_images')
    .select('image_url, display_order').eq('venue_id', venueId)
    .order('display_order').limit(6)
  return (data || []) as VenueImage[]
}
async function getVenueMenu(venueId: string): Promise<MenuItem[]> {
  const { data } = await supabase.from('venue_menus')
    .select('*').eq('venue_id', venueId).order('display_order')
  return (data || []) as MenuItem[]
}
async function getRelatedVenues(categoryId: string, currentId: string) {
  const { data } = await supabase.from('venues')
    .select('id, name, slug, rating, review_count, image_url, address, categories(name_en)')
    .eq('category_id', categoryId).neq('id', currentId)
    .not('rating', 'is', null).order('rating', { ascending: false }).limit(4)
  return data || []
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const venue = await getVenue(id)
  if (!venue) return { title: 'Not Found' }
  return {
    title: `${venue.name} · ${venue.categories?.name_en} · Pattaya Guide`,
    description: venue.description_en || `${venue.name} in Pattaya. ${venue.address || ''}`.trim(),
  }
}

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [venue, images, menuItems] = await Promise.all([
    getVenue(id), getVenueImages(id), getVenueMenu(id)
  ])
  if (!venue) notFound()

  const relatedVenues = await getRelatedVenues(venue.category_id, venue.id)
  const allImages = [
    ...(venue.image_url ? [{ image_url: venue.image_url }] : []),
    ...images
  ].slice(0, 5)

  const isOpen = venue.status === 'Açık'

  const menuSections = menuItems.reduce((acc, item) => {
    const s = item.section_name || 'Menu'
    if (!acc[s]) acc[s] = []
    acc[s].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const hasMenu = menuItems.length > 0

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: venueCSS}} />
      <main className="det-yf">

        {/* BREADCRUMB */}
        <nav className="det-yf__wrap det-yf__crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="sep">›</span>
          <Link href={`/${venue.categories?.slug}`}>{venue.categories?.name_en}</Link>
          <span className="sep">›</span>
          <span aria-current="page">{venue.name}</span>
        </nav>

        {/* HERO */}
        <section className="det-yf__hero">
          <div className="det-yf__wrap det-yf__hero-inner">
            <h1 className="det-yf__h1">{venue.name}</h1>
            {venue.description_en && <p className="det-yf__tagline">{venue.description_en}</p>}
            <div className="det-yf__meta">
              {venue.rating && (
                <span className="rate">★ {venue.rating.toFixed(1)}<span className="count"> · {venue.review_count?.toLocaleString()} reviews</span></span>
              )}
              {venue.address && <span className="det-yf__metaitem">📍 {venue.address.split(',')[0]}</span>}
              <span className={`pill ${isOpen ? 'pill--success' : 'pill--danger'}`}>
                {isOpen ? '🟢 Open now' : '🔴 Closed'}
                {venue.working_hours && ` · ${venue.working_hours}`}
              </span>
              {venue.price_range && <span className="det-yf__metaitem">💰 {venue.price_range}</span>}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        {allImages.length > 0 && (
          <div className="det-yf__wrap">
            <div className="det-yf__gallery" id="det-gallery">
              {allImages.map((img, i) => (
                <div key={i} className={`det-yf__gitem${i === 0 ? ' det-yf__gitem--hero' : ''}${i === 4 ? ' det-yf__gitem--hidemobile' : ''}`}>
                  <img src={img.image_url} alt={`${venue.name} photo ${i+1}`}
                    width={i === 0 ? 800 : 400} height={i === 0 ? 600 : 300}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                  {i === 4 && images.length > 4 && (
                    <span className="det-yf__gmore">+{images.length - 4} photos</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-COL LAYOUT */}
        <div className="det-yf__wrap det-yf__layout">
          <div className="det-yf__content">

            {/* MENU */}
            {hasMenu && (
              <section aria-labelledby="menu-h">
                <div className="det-yf__sechead">
                  <span className="kicker">Menu & Prices</span>
                  <h2 id="menu-h">Treatment menu</h2>
                  <p>From the official price list. Confirm the latest rates before you visit.</p>
                </div>
                <div className="det-yf__tt-wrap">
                  <table className="det-yf__tt">
                    <caption className="visually-hidden">{venue.name} menu and prices</caption>
                    <thead>
                      <tr>
                        <th scope="col">Treatment</th>
                        <th scope="col">60 min</th>
                        <th scope="col">90 min</th>
                        <th scope="col">120 min</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(menuSections).map(([sectionName, items]) => (
                        <>
                          <tr key={`s-${sectionName}`} className="det-yf__cat"><td colSpan={4}>{sectionName}</td></tr>
                          {items.map(item => (
                            <tr key={item.id}>
                              <td>
                                <b>{item.item_name}</b>
                                {item.duration && <span style={{display:'block',fontSize:12,color:'var(--ink-400)'}}>{item.duration}</span>}
                                {item.description && <span style={{display:'block',fontSize:12,color:'var(--ink-400)'}}>{item.description}</span>}
                              </td>
                              <td className="price">{item.price_60 || '–'}</td>
                              <td className="price">{item.price_90 || '–'}</td>
                              <td className="price">{item.price_120 || item.price_custom || '–'}</td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* GETTING THERE */}
            <section id="getting-there" aria-labelledby="get-h">
              <div className="det-yf__sechead">
                <span className="kicker">Location</span>
                <h2 id="get-h">Getting there</h2>
              </div>
              <div className="det-yf__addr">
                {venue.address && (
                  <div className="det-yf__addr-row">
                    <span>📍</span>
                    <span><b>Address</b><br/>{venue.address}</span>
                  </div>
                )}
                {venue.working_hours && (
                  <div className="det-yf__addr-row">
                    <span>🕐</span>
                    <span><b>Hours</b> {venue.working_hours}</span>
                  </div>
                )}
                {venue.phone && (
                  <div className="det-yf__addr-row">
                    <span>📞</span>
                    <span><a href={`tel:${venue.phone}`}>{venue.phone}</a></span>
                  </div>
                )}
                {venue.maps_link && venue.maps_link !== 'Haritada Aç' && (
                  <div className="det-yf__addr-actions">
                    <a className="btn btn--primary btn--sm" href={venue.maps_link} target="_blank" rel="noopener">
                      Get directions
                    </a>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* STICKY ASIDE */}
          <aside className="det-yf__aside" aria-labelledby="card-h">
            <div className="det-yf__card">
              <div className="det-yf__card-head">
                <h2 id="card-h">{venue.name}</h2>
                <div className="det-yf__card-meta">
                  {venue.rating && <span className="rate">★ {venue.rating.toFixed(1)} <span className="count">· {venue.review_count?.toLocaleString()}</span></span>}
                  <span className={`pill ${isOpen ? 'pill--success' : 'pill--danger'}`}>{isOpen ? 'Open now' : 'Closed'}</span>
                </div>
              </div>
              {venue.price_range && (
                <div className="det-yf__card-price">
                  <b>{venue.price_range}</b>
                </div>
              )}
              <div className="det-yf__card-list">
                {venue.address && <div className="row"><span>📍</span><span>{venue.address}</span></div>}
                {venue.working_hours && <div className="row"><span>🕐</span><span className={isOpen ? 'open' : ''}>{venue.working_hours}</span></div>}
                {venue.phone && <div className="row"><span>📞</span><span><a href={`tel:${venue.phone}`}>{venue.phone}</a></span></div>}
              </div>
              <div className="det-yf__card-actions">
                {venue.maps_link && venue.maps_link !== 'Haritada Aç' && (
                  <a className="btn btn--primary" href={venue.maps_link} target="_blank" rel="noopener">Get directions</a>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* RELATED VENUES */}
        {relatedVenues.length > 0 && (
          <section className="det-yf__wrap det-yf__more" style={{paddingBottom:'var(--s8)'}}>
            <div className="det-yf__sechead">
              <span className="kicker">Keep exploring</span>
              <h2>More {venue.categories?.name_en}</h2>
            </div>
            <div className="carousel-wrap">
              <div className="carousel">
                {(relatedVenues as any[]).map(rv => (
                  <Link key={rv.id} className="det-yf__morecard" href={`/venues/${rv.id}`}>
                    <div className="det-yf__morecard__media">
                      {rv.image_url
                        ? <img src={rv.image_url} alt={rv.name} loading="lazy" width={560} height={420} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                        : <div style={{width:'100%',height:'100%',background:'var(--grad-brand)'}} />
                      }
                      <span className="det-yf__morecard__tag">{rv.categories?.name_en}</span>
                    </div>
                    <div className="det-yf__morecard__body">
                      <h3>{rv.name}</h3>
                      {rv.rating && <span className="rate">★ {Number(rv.rating).toFixed(1)} <span className="count">({rv.review_count?.toLocaleString()})</span></span>}
                      {rv.address && <span className="det-yf__morecard__loc">📍 {rv.address.slice(0,30)}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}

const venueCSS = `:root{
  --deep-ocean:#034487;--ocean:#0178B4;--steel:#054C86;--lagoon:#2FBDDC;--sky:#A3CBE5;
  --blue-900:#022e5c;--blue-800:#034487;--blue-700:#054C86;--blue-600:#0178B4;--blue-500:#1f93cf;
  --blue-400:#2FBDDC;--blue-300:#73d2e9;--blue-200:#A3CBE5;--blue-100:#d6ebf6;--blue-50:#eef7fc;
  --ink-900:#0e2233;--ink-700:#33414e;--ink-500:#5f6b75;--ink-400:#8995a0;
  --line:#e4ebf1;--paper:#f6f9fc;--white:#fff;
  --success:#1ba672;--warning:#e8a33d;--danger:#e0524d;--sun:#f5b942;
  --grad-cta:linear-gradient(135deg,#0178B4 0%,#054C86 100%);
  --grad-night:linear-gradient(180deg,rgba(2,46,92,0) 0%,rgba(2,46,92,.55) 55%,rgba(2,46,92,.92) 100%);
  --display:'Plus Jakarta Sans',sans-serif;--body:'Manrope',sans-serif;
  --r-sm:8px;--r-md:14px;--r-lg:20px;--r-xl:28px;--r-pill:999px;
  --sh-sm:0 1px 3px rgba(3,68,135,.08);--sh-md:0 8px 24px rgba(3,68,135,.10);
  --sh-lg:0 18px 48px rgba(3,68,135,.16);--sh-cta:0 10px 28px rgba(1,120,180,.35);
  --s1:4px;--s2:8px;--s3:12px;--s4:16px;--s5:24px;--s6:32px;--s7:48px;--s8:64px;--s9:96px;
  --container:1240px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--body);color:var(--ink-700);background:var(--white);line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:pointer;border:none;background:none}
.container{max-width:var(--container);margin:0 auto;padding:0 var(--s5)}

.kicker{font-family:var(--display);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--lagoon);margin-bottom:var(--s2)}
h1,h2,h3,h4{font-family:var(--display);color:var(--ink-900);letter-spacing:-.02em;font-weight:800}
h1{font-size:clamp(28px,3.6vw,42px);line-height:1.1}
h2{font-size:clamp(22px,2.4vw,28px);line-height:1.15}
h3{font-size:18px;font-weight:700;line-height:1.3}
h4{font-size:16px;font-weight:700}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:var(--display);font-weight:600;font-size:15px;border-radius:var(--r-pill);padding:13px 26px;transition:.2s;cursor:pointer}
.btn-primary{background:var(--grad-cta);color:#fff;box-shadow:var(--sh-cta)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(1,120,180,.45)}
.btn-secondary{background:#fff;color:var(--ocean);border:1.5px solid var(--blue-200)}
.btn-secondary:hover{border-color:var(--ocean);background:var(--blue-50)}
.btn-sm{padding:9px 18px;font-size:13px}
.btn-block{width:100%}
.btn-lg{padding:16px 28px;font-size:16px}

.pill{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;border-radius:var(--r-pill);font-size:13px;font-weight:600;font-family:var(--display)}
.pill-blue{background:var(--blue-50);color:var(--ocean)}
.pill-success{background:#e4f6ee;color:var(--success)}
.pill-sun{background:#fdf3d9;color:#9a6e10}
.pill-white{background:rgba(255,255,255,.96);color:var(--steel);box-shadow:var(--sh-sm)}
.pill-glass{background:rgba(255,255,255,.18);color:#fff;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.25)}

/* topbar */
.topbar{background:var(--blue-900);color:rgba(255,255,255,.82);font-size:13px}
.topbar-inner{display:flex;justify-content:space-between;align-items:center;padding:8px 0;gap:var(--s5)}
.topbar-l,.topbar-r{display:flex;align-items:center;gap:var(--s5)}
.topbar a{display:inline-flex;align-items:center;gap:6px;color:rgba(255,255,255,.85);font-weight:500;transition:.18s}
.topbar a:hover{color:var(--lagoon)}
.topbar .sep{width:1px;height:12px;background:rgba(255,255,255,.15)}
@media(max-width:780px){.topbar-l .hide-m{display:none}}

/* nav */
.nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);transition:.2s}
.nav.scrolled{box-shadow:var(--sh-sm)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:var(--s5);padding:16px 0}
.brand{display:flex;align-items:center;gap:10px;flex-shrink:0}
.brand svg{width:38px;height:auto}
.brand .wm{font-family:var(--display);font-weight:800;font-size:20px}
.brand .wm i{color:var(--steel);font-style:normal}
.brand .wm u{color:var(--lagoon);text-decoration:none}
.nav-links{display:flex;align-items:center;gap:26px}
.nav-links a{color:var(--ink-700);font-weight:600;font-size:14px;font-family:var(--display);transition:.18s}
.nav-links a:hover,.nav-links a.active{color:var(--ocean)}
.burger{display:none;width:42px;height:42px;border-radius:50%;background:var(--blue-50);align-items:center;justify-content:center;color:var(--ocean)}
@media(max-width:980px){.nav-links{display:none}.burger{display:inline-flex}}

/* breadcrumb */
.crumb{padding:var(--s4) 0;background:var(--paper);border-bottom:1px solid var(--line)}
.crumb-inner{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-500);font-family:var(--display);font-weight:500;flex-wrap:wrap}
.crumb-inner a{color:var(--ink-500);transition:.18s}
.crumb-inner a:hover{color:var(--ocean)}
.crumb-inner .sep{color:var(--ink-400)}
.crumb-inner .now{color:var(--ink-900);font-weight:600}

/* GALLERY */
.gallery{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:240px 240px;gap:10px;margin-top:var(--s5);border-radius:var(--r-lg);overflow:hidden;position:relative}
@media(max-width:860px){.gallery{grid-template-columns:1fr 1fr;grid-template-rows:280px 140px 140px}}
@media(max-width:560px){.gallery{grid-template-columns:1fr;grid-template-rows:280px}}
.gallery .gi{background-size:cover;background-position:center;cursor:pointer;position:relative;transition:.3s}
.gallery .gi:hover{filter:brightness(.95)}
.gallery .gi-main{grid-row:span 2;grid-column:span 1}
@media(max-width:860px){.gallery .gi-main{grid-column:span 2;grid-row:span 1}.gallery .gi:nth-child(n+5){display:none}}
@media(max-width:560px){.gallery .gi-main{grid-column:span 1}.gallery .gi:nth-child(n+2){display:none}}
.gallery .more{position:absolute;right:14px;bottom:14px;background:rgba(2,46,92,.78);color:#fff;backdrop-filter:blur(8px);font-family:var(--display);font-weight:600;font-size:13px;padding:9px 16px;border-radius:var(--r-pill);display:inline-flex;align-items:center;gap:6px;z-index:5}

/* VENUE HEADER */
.vhead{display:flex;justify-content:space-between;gap:var(--s5);margin-top:var(--s5);flex-wrap:wrap;align-items:flex-end}
.vhead-l .tags{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;font-size:13px;color:var(--ink-500);font-family:var(--display);font-weight:500}
.vhead-l .tags a{color:var(--ocean);text-decoration:underline;text-decoration-color:var(--blue-200);text-underline-offset:3px}
.vhead-l h1 .verif{display:inline-flex;align-items:center;gap:5px;background:var(--blue-50);color:var(--steel);padding:6px 12px;border-radius:var(--r-pill);font-size:13px;font-weight:600;font-family:var(--display);vertical-align:middle;margin-left:14px;letter-spacing:0}
.vhead-l .loc{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:14px;font-size:14px;color:var(--ink-500)}
.vhead-l .loc span{display:inline-flex;align-items:center;gap:6px}
.vhead-l .loc b{color:var(--ink-900);font-family:var(--display);font-weight:700}
.vhead-l .loc i{width:3px;height:3px;border-radius:50%;background:var(--ink-400);font-style:normal}
.vhead-r{display:flex;gap:10px;align-items:center}
.vhead-r .icbtn{width:46px;height:46px;border-radius:50%;border:1px solid var(--line);background:#fff;color:var(--ink-700);display:flex;align-items:center;justify-content:center;transition:.18s}
.vhead-r .icbtn:hover{color:var(--ocean);border-color:var(--ocean);background:var(--blue-50)}
.vhead-r .icbtn.saved{background:var(--steel);color:#fff;border-color:var(--steel)}

/* vibe badges */
.vibe-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:var(--s4)}
.vibe{display:inline-flex;align-items:center;gap:6px;background:var(--blue-50);color:var(--steel);padding:7px 13px;border-radius:var(--r-pill);font-size:12px;font-weight:600;font-family:var(--display)}
.vibe svg{color:var(--ocean)}

/* rating row */
.rating-row{display:flex;align-items:center;gap:var(--s5);margin-top:var(--s4);padding:var(--s4) 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);flex-wrap:wrap}
.rating-row .score{display:flex;align-items:center;gap:10px}
.rating-row .score .big{font-family:var(--display);font-size:32px;font-weight:800;color:var(--ink-900);line-height:1}
.rating-row .stars{display:flex;gap:2px;color:var(--sun);font-size:16px}
.rating-row .score span{font-size:13px;color:var(--ink-500);font-weight:500}
.rating-row .score b{color:var(--ink-900);font-family:var(--display)}
.rating-row .quick{display:flex;align-items:center;gap:18px;font-size:13px;color:var(--ink-500);flex-wrap:wrap}
.rating-row .quick span{display:flex;align-items:center;gap:6px}
.rating-row .quick svg{color:var(--ocean)}

/* layout */
.detail-grid{display:grid;grid-template-columns:1fr 380px;gap:var(--s7);margin-top:var(--s7);padding-bottom:var(--s9)}
@media(max-width:1080px){.detail-grid{grid-template-columns:1fr}}

.tabs{display:flex;gap:0;border-bottom:1px solid var(--line);margin-bottom:var(--s5);overflow-x:auto;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tabs a{padding:14px 18px;font-family:var(--display);font-weight:600;font-size:14px;color:var(--ink-500);border-bottom:2px solid transparent;transition:.18s;white-space:nowrap}
.tabs a:hover{color:var(--ocean)}
.tabs a.active{color:var(--steel);border-bottom-color:var(--ocean)}

.dblock{margin-bottom:var(--s7)}
.dblock h2{margin-bottom:var(--s4)}
.dblock p{font-size:16px;color:var(--ink-700);margin-bottom:var(--s3);line-height:1.75}

/* editor verdict box */
.verdict{background:var(--paper);border:1px solid var(--line);border-left:4px solid var(--ocean);border-radius:var(--r-md);padding:var(--s5);margin-bottom:var(--s6)}
.verdict h4{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--steel)}
.verdict .pros-cons{display:grid;grid-template-columns:1fr 1fr;gap:var(--s5);margin-top:var(--s4)}
@media(max-width:560px){.verdict .pros-cons{grid-template-columns:1fr}}
.verdict ul{list-style:none}
.verdict li{padding:6px 0 6px 22px;position:relative;font-size:14px;color:var(--ink-700)}
.verdict .good li::before{content:"✓";position:absolute;left:0;color:var(--success);font-weight:700;font-family:var(--display)}
.verdict .bad li::before{content:"−";position:absolute;left:2px;color:var(--danger);font-weight:700;font-family:var(--display);font-size:18px;line-height:1}
.verdict .good h5,.verdict .bad h5{font-family:var(--display);font-size:13px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;font-weight:700}
.verdict .good h5{color:var(--success)}
.verdict .bad h5{color:var(--danger)}

/* highlights row */
.highlights{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s4);margin-top:var(--s5)}
@media(max-width:780px){.highlights{grid-template-columns:repeat(2,1fr)}}
.hl{background:#fff;border:1px solid var(--line);border-radius:var(--r-md);padding:var(--s4);display:flex;flex-direction:column;gap:8px}
.hl .ic{width:40px;height:40px;border-radius:10px;background:var(--blue-50);color:var(--ocean);display:flex;align-items:center;justify-content:center}
.hl b{font-family:var(--display);font-size:14px;color:var(--ink-900);display:block}
.hl span{font-size:12px;color:var(--ink-500)}

/* menu preview */
.menu-block{background:#fff;border:1px solid var(--line);border-radius:var(--r-md);padding:var(--s5)}
.menu-section{margin-bottom:var(--s5)}
.menu-section:last-child{margin-bottom:0}
.menu-section h4{margin-bottom:var(--s3);font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-400);font-weight:700;font-family:var(--display)}
.menu-row{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:12px 0;border-bottom:1px dashed var(--line)}
.menu-row:last-child{border-bottom:none}
.menu-row b{font-family:var(--display);font-size:14px;color:var(--ink-900);display:block}
.menu-row .desc{font-size:12px;color:var(--ink-500);margin-top:3px;display:block}
.menu-row .tag{display:inline-block;background:#e4f6ee;color:var(--success);font-size:10px;font-weight:700;padding:2px 7px;border-radius:var(--r-pill);font-family:var(--display);margin-top:5px}
.menu-row .price-tag{font-family:var(--display);font-weight:700;color:var(--ocean);font-size:14px;white-space:nowrap;flex-shrink:0}

/* hours */
.hours-block{background:#fff;border:1px solid var(--line);border-radius:var(--r-md);overflow:hidden}
.hours-head{display:flex;justify-content:space-between;align-items:center;padding:var(--s4) var(--s5);background:var(--paper);border-bottom:1px solid var(--line)}
.hours-head b{font-family:var(--display);font-size:15px;color:var(--ink-900)}
.hours-head .open{display:inline-flex;align-items:center;gap:6px;color:var(--success);font-size:13px;font-weight:700;font-family:var(--display)}
.hours-head .open i{width:8px;height:8px;border-radius:50%;background:var(--success);box-shadow:0 0 0 4px rgba(27,166,114,.18);font-style:normal}
.hours-list{padding:8px 0}
.hours-list .row{display:flex;justify-content:space-between;padding:9px var(--s5);font-size:14px;color:var(--ink-700)}
.hours-list .row.today{background:var(--blue-50);color:var(--steel);font-weight:700;font-family:var(--display)}
.hours-list .row span:last-child{color:var(--ink-900);font-weight:600;font-family:var(--display);font-size:13px}

/* good for */
.goodfor{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s3);margin-top:var(--s4)}
@media(max-width:780px){.goodfor{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.goodfor{grid-template-columns:1fr}}
.gf{display:flex;align-items:center;gap:10px;padding:12px;background:var(--paper);border-radius:var(--r-md);font-size:13px}
.gf .e{font-size:22px}
.gf b{font-family:var(--display);font-size:13px;color:var(--ink-900);display:block;line-height:1.2}
.gf span{font-size:11px;color:var(--ink-500)}

/* features */
.feat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px 24px;margin-top:var(--s4)}
@media(max-width:560px){.feat-grid{grid-template-columns:1fr}}
.feat-grid .row{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--ink-700)}
.feat-grid .row .ck{width:22px;height:22px;border-radius:50%;background:var(--blue-50);color:var(--ocean);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.feat-grid .row.no .ck{background:#fef0ef;color:var(--danger)}
.feat-grid .row.no{color:var(--ink-400);text-decoration:line-through}

/* map preview */
.mini-map{position:relative;border-radius:var(--r-md);overflow:hidden;height:300px;background:linear-gradient(135deg,#054C86 0%,#0178B4 70%,#022e5c 100%);margin-top:var(--s4)}
.mini-map::before{content:"";position:absolute;inset:0;background-image:radial-gradient(circle at 50% 50%,rgba(47,189,220,.4) 0,transparent 30%),radial-gradient(circle at 30% 70%,rgba(163,203,229,.3) 0,transparent 20%)}
.mini-map::after{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:40px 40px}
.mini-map .here{position:absolute;top:48%;left:50%;transform:translate(-50%,-50%);z-index:3}
.mini-map .here .pin{width:44px;height:44px;border-radius:50% 50% 50% 0;background:var(--lagoon);transform:rotate(-45deg);box-shadow:0 8px 22px rgba(47,189,220,.6);position:relative;animation:bob 3s ease-in-out infinite}
@keyframes bob{0%,100%{transform:rotate(-45deg) translateY(0)}50%{transform:rotate(-45deg) translateY(-7px)}}
.mini-map .here .pin::after{content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg);width:14px;height:14px;border-radius:50%;background:#fff}
.mini-map .here .lbl{position:absolute;top:-44px;left:50%;transform:translateX(-50%);background:#fff;color:var(--steel);padding:6px 14px;border-radius:var(--r-pill);font-size:12px;font-weight:700;font-family:var(--display);white-space:nowrap;box-shadow:var(--sh-md)}
.mini-map .more-pin{position:absolute;width:20px;height:20px;border-radius:50% 50% 50% 0;background:rgba(255,255,255,.78);transform:rotate(-45deg);box-shadow:0 4px 10px rgba(0,0,0,.15)}
.mini-map .more-pin::after{content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg);width:6px;height:6px;border-radius:50%;background:var(--ocean)}
.mini-map .more-pin-1{top:25%;left:30%}
.mini-map .more-pin-2{top:35%;left:70%}
.mini-map .more-pin-3{top:65%;left:25%}
.mini-map .more-pin-4{top:72%;left:68%}
.mini-map .map-foot{position:absolute;bottom:14px;left:14px;right:14px;background:rgba(255,255,255,.96);backdrop-filter:blur(8px);padding:10px 14px;border-radius:var(--r-md);display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.mini-map .map-foot b{font-family:var(--display);font-size:13px;color:var(--ink-900)}
.mini-map .map-foot span{font-size:12px;color:var(--ink-500)}

/* reviews */
.rev-summary{display:grid;grid-template-columns:240px 1fr;gap:var(--s5);background:#fff;border:1px solid var(--line);border-radius:var(--r-md);padding:var(--s5);margin-bottom:var(--s5)}
@media(max-width:780px){.rev-summary{grid-template-columns:1fr}}
.rev-score-big{text-align:center}
.rev-score-big .n{font-family:var(--display);font-size:56px;font-weight:800;color:var(--ink-900);line-height:1}
.rev-score-big .stars{color:var(--sun);font-size:18px;letter-spacing:2px;margin:6px 0}
.rev-score-big span{font-size:13px;color:var(--ink-500)}
.rev-breakdown{display:flex;flex-direction:column;gap:8px}
.rb-row{display:flex;align-items:center;gap:10px;font-size:13px}
.rb-row .lbl{width:90px;color:var(--ink-700);font-family:var(--display);font-weight:600}
.rb-row .track{flex:1;height:6px;background:var(--blue-50);border-radius:999px;overflow:hidden}
.rb-row .fill{height:100%;background:var(--ocean);border-radius:999px}
.rb-row .val{width:40px;text-align:right;color:var(--ink-700);font-weight:700;font-family:var(--display)}

.review{background:#fff;border:1px solid var(--line);border-radius:var(--r-md);padding:var(--s5);margin-bottom:14px}
.review-head{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.review-head .av{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#0178B4,#2FBDDC);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:800;font-size:14px;flex-shrink:0}
.review-head b{font-family:var(--display);font-size:14px;color:var(--ink-900);display:block}
.review-head span{font-size:12px;color:var(--ink-400)}
.review-head .stars{margin-left:auto;color:var(--sun);font-size:14px}
.review .verified{display:inline-flex;align-items:center;gap:4px;background:#e4f6ee;color:var(--success);padding:3px 9px;border-radius:var(--r-pill);font-size:11px;font-weight:700;font-family:var(--display);margin-bottom:10px}
.review p{font-size:14px;color:var(--ink-700);line-height:1.7;margin-bottom:8px}
.review .tags-row{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}
.review .tags-row i{padding:3px 9px;background:var(--paper);color:var(--ink-500);font-size:11px;border-radius:var(--r-pill);font-family:var(--display);font-style:normal;font-weight:600}

/* SIDEBAR booking */
.sticky-side{position:sticky;top:90px}
@media(max-width:1080px){.sticky-side{position:static}}
.book-card{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh-md);padding:var(--s5);margin-bottom:var(--s4)}
.book-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:var(--s4);padding-bottom:var(--s4);border-bottom:1px solid var(--line)}
.book-head .price-block .from{font-size:12px;color:var(--ink-400);font-family:var(--display);font-weight:500;display:block}
.book-head .price-block .band{font-family:var(--display);font-size:24px;color:var(--ocean);font-weight:800;line-height:1}
.book-head .price-block .band .dim{color:var(--ink-400);opacity:.4}
.book-head .price-block span{font-size:12px;color:var(--ink-500);display:block;margin-top:6px}
.book-head .stars{color:var(--sun);font-size:13px}
.book-head .rt{text-align:right}
.book-head .rt b{font-family:var(--display);font-size:14px;color:var(--ink-900);display:block;line-height:1.2}
.book-head .rt span{font-size:11px;color:var(--ink-400)}

.book-field{margin-bottom:14px}
.book-field label{font-family:var(--display);font-size:12px;font-weight:700;color:var(--ink-700);text-transform:uppercase;letter-spacing:.08em;display:block;margin-bottom:6px}
.book-field .ctrl{display:flex;align-items:center;gap:8px;padding:12px 14px;border:1.5px solid var(--line);border-radius:var(--r-md);background:#fff;cursor:pointer;transition:.18s}
.book-field .ctrl:hover{border-color:var(--ocean)}
.book-field .ctrl svg{color:var(--ink-400)}
.book-field .ctrl input,.book-field .ctrl select{flex:1;border:none;outline:none;font-family:var(--body);font-size:14px;color:var(--ink-900);background:transparent}

.book-trust{display:flex;flex-direction:column;gap:8px;margin-top:var(--s4);padding-top:var(--s4);border-top:1px dashed var(--line)}
.book-trust .row{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ink-500)}
.book-trust .row svg{color:var(--success);flex-shrink:0}

.action-row{display:flex;flex-direction:column;gap:8px;margin-top:var(--s4)}
.alt-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:var(--paper);border-radius:var(--r-md);font-family:var(--display);font-weight:600;font-size:13px;color:var(--ink-700);transition:.18s;cursor:pointer}
.alt-btn:hover{background:var(--blue-50);color:var(--ocean)}

/* contact card */
.contact-card{background:#fff;border:1px solid var(--line);border-radius:var(--r-md);padding:var(--s5)}
.contact-card h4{margin-bottom:14px;font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-400);font-weight:700;font-family:var(--display)}
.contact-row{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px}
.contact-row svg{color:var(--ocean);flex-shrink:0;margin-top:2px}
.contact-row b{font-family:var(--display);font-size:13px;color:var(--ink-900);display:block;line-height:1.4}
.contact-row span{font-size:12px;color:var(--ink-500)}

/* FAQ */
.faq-item{background:#fff;border:1px solid var(--line);border-radius:var(--r-md);margin-bottom:12px;overflow:hidden}
.faq-q{padding:16px 20px;cursor:pointer;font-family:var(--display);font-weight:700;font-size:15px;color:var(--ink-900);display:flex;justify-content:space-between;align-items:center;gap:14px;transition:.18s}
.faq-q:hover{background:var(--blue-50)}
.faq-q .ico{font-size:22px;color:var(--ocean);transition:.25s;flex-shrink:0;line-height:1}
.faq-item.open .faq-q .ico{transform:rotate(45deg);color:var(--lagoon)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease}
.faq-item.open .faq-a{max-height:400px}
.faq-a-inner{padding:0 20px 18px;font-size:14px;color:var(--ink-500);line-height:1.65}

/* nearby */
.nearby-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s4);margin-top:var(--s5)}
@media(max-width:780px){.nearby-grid{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.nearby-grid{grid-template-columns:1fr}}
.near-card{background:#fff;border:1px solid var(--line);border-radius:var(--r-md);overflow:hidden;transition:.22s;cursor:pointer;text-decoration:none}
.near-card:hover{transform:translateY(-3px);box-shadow:var(--sh-md);border-color:var(--blue-200)}
.near-card .ph{height:140px;background-size:cover;background-position:center;position:relative}
.near-card .ph .pill{position:absolute;top:10px;left:10px}
.near-card .ph .dist{position:absolute;bottom:10px;right:10px;background:rgba(2,46,92,.78);color:#fff;font-size:11px;font-weight:600;padding:3px 9px;border-radius:var(--r-pill);font-family:var(--display);backdrop-filter:blur(6px)}
.near-card .pb{padding:14px}
.near-card h4{font-size:14px;margin-bottom:5px;line-height:1.3}
.near-card .meta{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ink-400)}
.near-card .meta .star{color:var(--sun)}

/* footer */
.footer{background:var(--blue-900);color:rgba(255,255,255,.78);padding:var(--s9) 0 var(--s5);margin-top:var(--s7)}
.footer-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 1fr;gap:var(--s6);margin-bottom:var(--s7)}
@media(max-width:860px){.footer-grid{grid-template-columns:1fr 1fr;gap:var(--s5)}}
@media(max-width:560px){.footer-grid{grid-template-columns:1fr}}
.footer-brand p{font-size:14px;color:rgba(255,255,255,.62);margin-top:var(--s4);max-width:32ch;line-height:1.55}
.footer h5{font-family:var(--display);font-size:13px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.12em;margin-bottom:var(--s4)}
.footer ul{list-style:none}
.footer ul li{margin-bottom:10px}
.footer ul a{font-size:14px;color:rgba(255,255,255,.65);transition:.18s}
.footer ul a:hover{color:var(--lagoon)}
.socials{display:flex;gap:10px;margin-top:var(--s5)}
.socials a{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:#fff;transition:.2s}
.socials a:hover{background:var(--lagoon);color:var(--steel);transform:translateY(-2px)}
.footer-bottom{padding-top:var(--s5);border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:13px;color:rgba(255,255,255,.5)}
.footer-bottom .legal{display:flex;gap:24px}
.footer-bottom .legal a:hover{color:#fff}

/* mobile sticky cta */
.mobile-cta{display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--line);padding:12px var(--s4);z-index:90;box-shadow:0 -8px 24px rgba(3,68,135,.08);align-items:center;justify-content:space-between;gap:var(--s3)}
.mobile-cta b{font-family:var(--display);font-size:14px;color:var(--ink-900)}
.mobile-cta span{font-size:11px;color:var(--ink-500);display:block}
.mobile-cta .btn{padding:11px 20px;font-size:14px;flex-shrink:0}
@media(max-width:768px){.mobile-cta{display:flex}body{padding-bottom:80px}}

/* ============ MOBILE MENU DRAWER ============ */
.mm-overlay{position:fixed;inset:0;background:rgba(2,46,92,.5);backdrop-filter:blur(4px);z-index:200;opacity:0;pointer-events:none;transition:opacity .25s}
.mm-overlay.open{opacity:1;pointer-events:auto}
.mm-panel{position:fixed;top:0;right:0;bottom:0;width:min(88%,380px);background:#fff;z-index:201;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .32s cubic-bezier(.2,.8,.2,1);box-shadow:-20px 0 60px rgba(2,46,92,.18)}
.mm-panel.open{transform:translateX(0)}
.mm-head{padding:18px var(--s5);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);flex-shrink:0}
.mm-close{width:40px;height:40px;border-radius:50%;background:var(--blue-50);color:var(--ocean);display:inline-flex;align-items:center;justify-content:center;border:none;cursor:pointer;transition:.18s}
.mm-close:hover{background:var(--ocean);color:#fff}
.mm-body{flex:1;overflow-y:auto;padding:var(--s3) 0}
.mm-body a{display:flex;align-items:center;justify-content:space-between;padding:15px var(--s5);font-family:var(--display);font-weight:600;font-size:16px;color:var(--ink-900);border-bottom:1px solid var(--line);transition:.15s}
.mm-body a.active{color:var(--ocean);background:var(--blue-50)}
.mm-body a:hover{background:var(--blue-50);color:var(--ocean)}
.mm-body a svg{width:16px;height:16px;color:var(--ink-400)}
.mm-foot{padding:var(--s5);display:flex;flex-direction:column;gap:12px;border-top:1px solid var(--line);background:var(--paper);flex-shrink:0}
.mm-foot .btn{justify-content:center;width:100%}
.mm-foot .lang-row{display:flex;align-items:center;justify-content:center;gap:var(--s4);font-size:13px;color:var(--ink-500);padding-top:4px}
.mm-foot .lang-row a{display:inline-flex;align-items:center;gap:5px;font-weight:600;color:var(--ink-700);font-family:var(--display)}
.mm-foot .lang-row .sep{width:1px;height:12px;background:var(--line)}
body.mm-open{overflow:hidden;touch-action:none}

/* ============ MOBILE RESPONSIVE ============ */
@media(max-width:980px){
  .topbar{font-size:12px}
  .topbar-inner{padding:7px 0;gap:var(--s4)}
  .nav-inner{padding:13px 0}
  .nav-actions .btn-primary{display:none}
  .brand svg{width:32px}
  .brand .wm{font-size:18px}
}

@media(max-width:768px){
  /* Container */
  .container{padding:0 var(--s4)}

  /* Typography */
  h1{font-size:clamp(24px,7vw,32px);line-height:1.12}
  h2{font-size:clamp(20px,5.2vw,26px);line-height:1.18}
  h3{font-size:17px}
  h4{font-size:15px}
  .kicker{font-size:11px;letter-spacing:.14em}
  .btn{padding:12px 22px;font-size:14px}
  .btn-lg{padding:14px 22px;font-size:15px}

  /* Topbar */
  .topbar-inner{justify-content:center}
  .topbar-l{display:none}

  /* Breadcrumb */
  .crumb{padding:var(--s3) 0}
  .crumb-inner{font-size:12px;gap:6px}

  /* Gallery: collapse to swipe-like single column with main only */
  .gallery{grid-template-columns:1fr;grid-template-rows:240px;gap:6px;margin-top:var(--s4);border-radius:var(--r-md)}
  .gallery .gi-main{grid-column:span 1;grid-row:span 1}
  .gallery .more{right:10px;bottom:10px;font-size:12px;padding:7px 13px}

  /* Venue header */
  .vhead{gap:var(--s3);margin-top:var(--s4);align-items:flex-start}
  .vhead-l{flex:1 1 100%;min-width:0!important}
  .vhead-l .tags{gap:6px;font-size:12px;margin-bottom:8px}
  .vhead-l h1 .verif{display:inline-flex;margin-left:8px;padding:4px 9px;font-size:11px}
  .vhead-l .loc{gap:8px;margin-top:10px;font-size:13px}
  .vhead-l .loc i{display:none}
  .vhead-r{width:100%;justify-content:flex-start;gap:8px}
  .vhead-r .icbtn{width:40px;height:40px}

  /* Vibe row */
  .vibe-row{gap:6px;margin-top:var(--s3)}
  .vibe{padding:6px 11px;font-size:11px}

  /* Rating row */
  .rating-row{gap:var(--s3);padding:var(--s3) 0;margin-top:var(--s3)}
  .rating-row .score .big{font-size:26px}
  .rating-row .quick{gap:10px 14px;font-size:12px;width:100%}

  /* Detail grid */
  .detail-grid{gap:var(--s5);margin-top:var(--s5);padding-bottom:var(--s5)}

  /* Tabs: horizontal scroll */
  .tabs{margin:0 calc(var(--s4) * -1) var(--s4);padding:0 var(--s4)}
  .tabs a{padding:12px 14px;font-size:13px}

  /* Detail blocks */
  .dblock{margin-bottom:var(--s5)}
  .dblock h2{margin-bottom:var(--s3)}
  .dblock p{font-size:15px;line-height:1.7}

  /* Verdict */
  .verdict{padding:var(--s4);margin-bottom:var(--s5)}
  .verdict .pros-cons{gap:var(--s4);margin-top:var(--s3)}
  .verdict li{font-size:13px;padding:5px 0 5px 20px}

  /* Highlights */
  .highlights{gap:var(--s3);margin-top:var(--s4)}
  .hl{padding:var(--s3)}
  .hl .ic{width:36px;height:36px;border-radius:9px}
  .hl b{font-size:13px}
  .hl span{font-size:11px}

  /* Good for */
  .goodfor{gap:8px;margin-top:var(--s3)}
  .gf{padding:10px}

  /* Menu */
  .menu-block{padding:var(--s4)}
  .menu-section{margin-bottom:var(--s4)}
  .menu-section h4{font-size:12px}
  .menu-row{padding:10px 0;gap:10px}
  .menu-row b{font-size:13px}
  .menu-row .desc{font-size:11px}
  .menu-row .price-tag{font-size:13px}

  /* Hours */
  .hours-head{padding:var(--s3) var(--s4)}
  .hours-head b{font-size:14px}
  .hours-list .row{padding:8px var(--s4);font-size:13px}

  /* Features */
  .feat-grid{gap:10px 14px;margin-top:var(--s3)}
  .feat-grid .row{font-size:13px}

  /* Mini map */
  .mini-map{height:240px;margin-top:var(--s3)}
  .mini-map .map-foot{left:10px;right:10px;bottom:10px;padding:9px 12px;flex-direction:column;align-items:flex-start;gap:8px}
  .mini-map .map-foot .btn{align-self:stretch;justify-content:center}

  /* Reviews */
  .rev-summary{padding:var(--s4);gap:var(--s4);margin-bottom:var(--s4)}
  .rev-score-big .n{font-size:44px}
  .review{padding:var(--s4);margin-bottom:10px}
  .review-head{gap:10px;margin-bottom:10px}
  .review-head .av{width:38px;height:38px;font-size:13px}
  .review-head b{font-size:13px}
  .review-head span{font-size:11px}
  .review p{font-size:13px;line-height:1.65}

  /* Sidebar booking card — keep visible but tighten on tablet, hidden via mobile-cta logic below */
  .book-card{padding:var(--s4);margin-bottom:var(--s3)}
  .book-head{padding-bottom:var(--s3);margin-bottom:var(--s3)}
  .book-head .price-block .band{font-size:20px}
  .book-field{margin-bottom:10px}
  .book-field label{font-size:11px}
  .book-field .ctrl{padding:10px 12px}
  .book-trust{margin-top:var(--s3);padding-top:var(--s3)}

  /* Contact card */
  .contact-card{padding:var(--s4)}
  .contact-row{margin-bottom:10px;gap:10px}

  /* FAQ */
  .faq-q{padding:14px 16px;font-size:14px}
  .faq-a-inner{padding:0 16px 14px;font-size:13px}

  /* Nearby */
  .nearby-grid{gap:var(--s3);margin-top:var(--s4)}
  .near-card .ph{height:120px}
  .near-card .pb{padding:12px}

  /* Footer */
  .footer{padding:var(--s7) 0 var(--s4);margin-top:var(--s5)}
  .footer-grid{gap:var(--s5);margin-bottom:var(--s5)}
  .footer-brand p{font-size:13px}
  .footer h5{font-size:12px;margin-bottom:var(--s3)}
  .footer ul li{margin-bottom:8px}
  .footer ul a{font-size:13px}
  .socials{margin-top:var(--s4);gap:8px}
  .socials a{width:34px;height:34px}
  .footer-bottom{flex-direction:column;align-items:flex-start;gap:12px;font-size:12px}
  .footer-bottom .legal{gap:14px 18px;flex-wrap:wrap}
}

@media(max-width:480px){
  .nav-inner{padding:11px 0;gap:var(--s3)}
  .brand svg{width:30px}
  .brand .wm{font-size:17px}
  .burger{width:40px;height:40px}

  /* Venue header title tighter */
  .vhead-l h1 .verif{display:none}

  /* Rating row stack */
  .rating-row .score .big{font-size:24px}
  .rating-row .quick{flex-direction:column;align-items:flex-start;gap:6px}

  /* Reviews — stack head */
  .review-head{flex-wrap:wrap}
  .review-head .stars{margin-left:0;width:100%;margin-top:4px}

  /* Nearby 1 col */
  .nearby-grid{grid-template-columns:1fr}

  /* Mobile CTA tighter */
  .mobile-cta{padding:10px var(--s3)}
  .mobile-cta b{font-size:13px}
  .mobile-cta .btn{padding:10px 16px;font-size:13px}
}`
