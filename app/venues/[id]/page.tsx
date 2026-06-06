import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface VenueImage {
  image_url: string
  display_order: number
}

interface Venue {
  id: string
  name: string
  slug: string
  rating: number
  review_count: number
  venue_type: string
  price_range: string
  address: string
  phone: string
  status: string
  working_hours: string
  maps_link: string
  image_url: string | null
  categories: { name_en: string; slug: string }
}

async function getVenue(id: string): Promise<Venue | null> {
  const { data, error } = await supabase
    .from('venues')
    .select('*, categories(name_en, slug)')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return data as unknown as Venue
}

async function getVenueImages(venueId: string): Promise<VenueImage[]> {
  const { data } = await supabase
    .from('venue_images')
    .select('image_url, display_order')
    .eq('venue_id', venueId)
    .order('display_order')
    .limit(5)
  return (data || []) as VenueImage[]
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const venue = await getVenue(id)
  if (!venue) return { title: 'Not Found' }
  return {
    title: `${venue.name} · ${venue.categories?.name_en} · Pattaya Guide`,
    description: `${venue.name} in Pattaya. ${venue.venue_type || ''} ${venue.address || ''}`.trim(),
  }
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
const staticBottom = `<!-- DETAIL GRID -->
  <div class="detail-grid">
    <!-- MAIN -->
    <div>
      <div class="tabs">
        <a href="#overview" class="active">Overview</a>
        <a href="#menu">Menu &amp; prices</a>
        <a href="#reviews">Reviews · 1,420</a>
        <a href="#location">Location</a>
        <a href="#faq">FAQ</a>
        <a href="#nearby">Nearby</a>
      </div>

      <!-- VERDICT -->
      <div class="verdict">
        <h4><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 17.3-6.2 3.7 1.6-7L2 9.3l7.1-.6L12 2l2.9 6.7 7.1.6-5.4 4.7 1.6 7Z"/></svg> Editor's verdict</h4>
        <p style="margin:0">A rare three-mood venue: morning espresso with sea breeze, all-afternoon WiFi work, and a sunset cocktail you'll remember. The bean-bag deck is the move. Don't expect destination food — come for the coffee, the view, and the patience to let an evening unfold.</p>
        <div class="pros-cons">
          <div class="good">
            <h5>What works</h5>
            <ul>
              <li>Unobstructed sea-to-Pattaya-bay view from cliff edge</li>
              <li>Specialty coffee genuinely well-pulled (own roast)</li>
              <li>200Mb WiFi tested by us — fast enough for video calls</li>
              <li>Dog-friendly with water bowls and shaded deck</li>
              <li>Sunset cocktails priced fairly (฿280–฿420)</li>
            </ul>
          </div>
          <div class="bad">
            <h5>Skip if</h5>
            <ul>
              <li>You need lunch — food menu is small, not their strength</li>
              <li>Sunset crowd 17:30–19:00 is intense, plan around it</li>
              <li>WiFi gets congested when sunset crowd arrives</li>
              <li>No table service for laptop seating — order at bar</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- OVERVIEW -->
      <div class="dblock" id="overview">
        <h2>About this place</h2>
        <p>The Glass House sits on the western cliff of Pratumnak Hill — 110 m above the bay, with an unblocked view across to Koh Larn. It's been around since 2019, ran by Beam (the barista who roasts in-house) and her partner Tom. Daytime is a quiet coffee/work crowd. Around 17:00 the vibe shifts: bean bags fill, cocktails come out, and by 19:00 it's a sunset-bar that books out an hour ahead.</p>
        <p>The food menu exists but isn't the reason to come — we'd say solid brunch and decent toasties, nothing more. The coffee is the real specialty: single-origin Doi Tung beans, roasted on-site, ground per order. The cold brew is a different conversation entirely.</p>

        <div class="highlights">
          <div class="hl"><div class="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/></svg></div><b>In-house roastery</b><span>Doi Tung beans, daily</span></div>
          <div class="hl"><div class="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0"/></svg></div><b>WiFi 200Mb tested</b><span>Speedtested by us</span></div>
          <div class="hl"><div class="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg></div><b>Sunset 18:30</b><span>Golden hour starts 17:00</span></div>
          <div class="hl"><div class="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 2"/></svg></div><b>Stay 2-3 hours</b><span>Avg. dwell time</span></div>
        </div>
      </div>

      <!-- GOOD FOR -->
      <div class="dblock">
        <h2>Good for…</h2>
        <p>Different times of day, different vibes. Pick yours.</p>
        <div class="goodfor">
          <div class="gf"><span class="e">💻</span><div><b>Remote work</b><span>09–16 · best window</span></div></div>
          <div class="gf"><span class="e">📷</span><div><b>Solo travel</b><span>Easy bar seating</span></div></div>
          <div class="gf"><span class="e">🥐</span><div><b>Brunch</b><span>10–13 · weekends</span></div></div>
          <div class="gf"><span class="e">💑</span><div><b>Date night</b><span>17–19 · sunset</span></div></div>
          <div class="gf"><span class="e">🐕</span><div><b>With your dog</b><span>Deck area · water bowls</span></div></div>
          <div class="gf"><span class="e">📱</span><div><b>Sunset photos</b><span>Cliff deck · best 18:00</span></div></div>
        </div>
      </div>

      <!-- MENU -->
      <div class="dblock" id="menu">
        <h2>Menu &amp; prices</h2>
        <p>Verified May 28, 2026. Prices include service charge (no tip expected on top).</p>

        <div class="menu-block">
          <div class="menu-section">
            <h4>Specialty coffee</h4>
            <div class="menu-row">
              <div><b>Single-origin filter (Doi Tung)</b><span class="desc">V60 or AeroPress · choice of bean</span><span class="tag">Editor's must-try</span></div>
              <span class="price-tag">฿140</span>
            </div>
            <div class="menu-row">
              <div><b>Cold brew · house</b><span class="desc">24h slow extract · served over rocks</span></div>
              <span class="price-tag">฿160</span>
            </div>
            <div class="menu-row">
              <div><b>Flat white</b><span class="desc">Double shot · oat or whole milk</span></div>
              <span class="price-tag">฿110</span>
            </div>
            <div class="menu-row">
              <div><b>Espresso · double</b><span class="desc">From the bar — sit at the counter</span></div>
              <span class="price-tag">฿85</span>
            </div>
          </div>

          <div class="menu-section">
            <h4>Brunch (until 14:00)</h4>
            <div class="menu-row">
              <div><b>Sourdough avocado toast</b><span class="desc">Smashed avo · poached egg · chili oil · feta</span><span class="tag">Vegan opt.</span></div>
              <span class="price-tag">฿280</span>
            </div>
            <div class="menu-row">
              <div><b>Big breakfast plate</b><span class="desc">Two eggs · bacon · sausage · mushroom · sourdough</span></div>
              <span class="price-tag">฿320</span>
            </div>
            <div class="menu-row">
              <div><b>Açaí bowl · house granola</b><span class="desc">Banana · berries · coconut · honey</span></div>
              <span class="price-tag">฿240</span>
            </div>
          </div>

          <div class="menu-section">
            <h4>Sunset cocktails (from 17:00)</h4>
            <div class="menu-row">
              <div><b>Bay Spritz</b><span class="desc">House gin · pomelo · prosecco · grapefruit</span><span class="tag">Editor's pick</span></div>
              <span class="price-tag">฿320</span>
            </div>
            <div class="menu-row">
              <div><b>Lemongrass Old Fashioned</b><span class="desc">Bourbon · lemongrass · palm sugar · bitters</span></div>
              <span class="price-tag">฿420</span>
            </div>
            <div class="menu-row">
              <div><b>Watermelon margarita</b><span class="desc">Tequila · fresh watermelon · lime · chili rim</span></div>
              <span class="price-tag">฿340</span>
            </div>
          </div>
        </div>
      </div>

      <!-- HOURS -->
      <div class="dblock">
        <h2>Opening hours</h2>
        <div class="hours-block">
          <div class="hours-head">
            <b>This week</b>
            <span class="open"><i></i>Open now · closes at 23:00</span>
          </div>
          <div class="hours-list">
            <div class="row today"><span>Monday — today</span><span>08:00 – 23:00</span></div>
            <div class="row"><span>Tuesday</span><span>08:00 – 23:00</span></div>
            <div class="row"><span>Wednesday</span><span>08:00 – 23:00</span></div>
            <div class="row"><span>Thursday</span><span>08:00 – 23:00</span></div>
            <div class="row"><span>Friday</span><span>08:00 – 24:00</span></div>
            <div class="row"><span>Saturday</span><span>08:00 – 24:00</span></div>
            <div class="row"><span>Sunday</span><span>08:00 – 23:00</span></div>
          </div>
        </div>
      </div>

      <!-- FEATURES -->
      <div class="dblock">
        <h2>Amenities</h2>
        <div class="feat-grid">
          <div class="row"><span class="ck"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 6"/></svg></span> Free WiFi (200Mb tested)</div>
          <div class="row"><span class="ck"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 6"/></svg></span> Power outlets at every laptop seat</div>
          <div class="row"><span class="ck"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 6"/></svg></span> Dog-friendly (water bowls)</div>
          <div class="row"><span class="ck"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 6"/></svg></span> Card / QR / cash all accepted</div>
          <div class="row"><span class="ck"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 6"/></svg></span> Free on-site parking</div>
          <div class="row"><span class="ck"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 6"/></svg></span> Vegan options · oat milk standard</div>
          <div class="row"><span class="ck"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 6"/></svg></span> Restrooms (gender-neutral, clean)</div>
          <div class="row no"><span class="ck"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 18 18 6M6 6l12 12"/></svg></span> Children's menu (limited)</div>
          <div class="row no"><span class="ck"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 18 18 6M6 6l12 12"/></svg></span> Reservations at sunset hours</div>
          <div class="row no"><span class="ck"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 18 18 6M6 6l12 12"/></svg></span> Wheelchair access (steep stairs)</div>
        </div>
      </div>

      <!-- REVIEWS -->
      <div class="dblock" id="reviews">
        <h2>Reviews · 1,420 verified</h2>

        <div class="rev-summary">
          <div class="rev-score-big">
            <div class="n">4.8</div>
            <div class="stars">★★★★★</div>
            <span>Based on 1,420 reviews</span>
          </div>
          <div class="rev-breakdown">
            <div class="rb-row"><span class="lbl">View</span><div class="track"><div class="fill" style="width:98%"></div></div><span class="val">4.9</span></div>
            <div class="rb-row"><span class="lbl">Coffee</span><div class="track"><div class="fill" style="width:96%"></div></div><span class="val">4.8</span></div>
            <div class="rb-row"><span class="lbl">Vibe</span><div class="track"><div class="fill" style="width:94%"></div></div><span class="val">4.8</span></div>
            <div class="rb-row"><span class="lbl">Service</span><div class="track"><div class="fill" style="width:88%"></div></div><span class="val">4.5</span></div>
            <div class="rb-row"><span class="lbl">Food</span><div class="track"><div class="fill" style="width:78%"></div></div><span class="val">4.0</span></div>
            <div class="rb-row"><span class="lbl">Value</span><div class="track"><div class="fill" style="width:84%"></div></div><span class="val">4.3</span></div>
          </div>
        </div>

        <div class="review">
          <div class="review-head">
            <div class="av">AS</div>
            <div>
              <b>Anya S.</b>
              <span>Berlin · Visited May 20, 2026</span>
            </div>
            <div class="stars">★★★★★</div>
          </div>
          <span class="verified"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 12l2 2 4-4"/></svg> Verified visit</span>
          <p>"Came for an hour of work, stayed for sunset. WiFi held up for a Zoom call (which I did not expect). Bean bag deck was the right call — paid ฿140 for the V60 and ฿320 for the Bay Spritz later. The transition from café to bar at 17:00 is so smooth you don't notice until they hand you a cocktail menu."</p>
          <div class="tags-row"><i>Solo work</i><i>Sunset</i><i>Specialty coffee</i></div>
        </div>

        <div class="review">
          <div class="review-head">
            <div class="av">DC</div>
            <div>
              <b>David C.</b>
              <span>Singapore · Visited May 14, 2026</span>
            </div>
            <div class="stars">★★★★☆</div>
          </div>
          <span class="verified"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 12l2 2 4-4"/></svg> Verified visit</span>
          <p>"Honest review: coffee is great, view is great, food is fine. Tried the big breakfast — it's a hotel breakfast at café prices, not bad just not the move. Stick to coffee + a pastry, save the appetite for dinner elsewhere. Get here by 17:30 if you want a sunset seat without queuing."</p>
          <div class="tags-row"><i>Sunset</i><i>Coffee</i><i>With partner</i></div>
        </div>

        <div class="review">
          <div class="review-head">
            <div class="av">MJ</div>
            <div>
              <b>Mei-Lin J.</b>
              <span>Taipei · Visited May 8, 2026</span>
            </div>
            <div class="stars">★★★★★</div>
          </div>
          <span class="verified"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 12l2 2 4-4"/></svg> Verified visit</span>
          <p>"Brought my golden retriever — they brought him a water bowl and an ice cube before I could ask. Beam (the owner) actually came over to introduce herself. The cold brew is the move on a hot day. Will come back next trip."</p>
          <div class="tags-row"><i>Dog-friendly</i><i>Cold brew</i><i>Service</i></div>
        </div>

        <a href="#" class="btn btn-secondary" style="display:flex;justify-content:center;margin-top:var(--s5)">Show all 1,420 reviews →</a>
      </div>

      <!-- LOCATION -->
      <div class="dblock" id="location">
        <h2>Location &amp; how to get there</h2>
        <p>The Glass House sits at the western edge of Pratumnak Hill, on the cliff above Cosy Beach. From Central Pattaya, expect ฿80–฿120 by Grab (10 min). Free parking on-site — 14 spots, fills up at sunset. By Bolt motorbike it's a 6-minute zip from Walking Street.</p>

        <div class="mini-map">
          <div class="here">
            <span class="lbl">The Glass House</span>
            <div class="pin"></div>
          </div>
          <div class="more-pin more-pin-1"></div>
          <div class="more-pin more-pin-2"></div>
          <div class="more-pin more-pin-3"></div>
          <div class="more-pin more-pin-4"></div>
          <div class="map-foot">
            <div>
              <b>418/8 Pratumnak Soi 5, Pattaya</b>
              <span>10 min from Central Pattaya · 12 min from Jomtien</span>
            </div>
            <a href="#" class="btn btn-primary btn-sm">Open in map →</a>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div class="dblock" id="faq">
        <h2>Frequently asked</h2>

        <div class="faq-item open">
          <div class="faq-q">Do I need a reservation? <span class="ico">+</span></div>
          <div class="faq-a"><div class="faq-a-inner">Daytime (08:00–16:00): no need. Sunset window (17:00–19:00) on Friday/Saturday/Sunday: yes, book a day ahead. Use the reservation widget on the right — it's free.</div></div>
        </div>
        <div class="faq-item">
          <div class="faq-q">Is the WiFi actually fast? <span class="ico">+</span></div>
          <div class="faq-a"><div class="faq-a-inner">We speed-tested it three times across different times: ~200 Mbps down / 180 Mbps up at 11:00, ~120 Mbps at 17:30 (peak). Solid for video calls, Figma, Adobe sync. Bring an Ethernet adapter if you need rock-stable; one outlet near the bar has hardwired access on request.</div></div>
        </div>
        <div class="faq-item">
          <div class="faq-q">Best seat for sunset photos? <span class="ico">+</span></div>
          <div class="faq-a"><div class="faq-a-inner">The cliff-edge bean bags facing west. Arrive by 17:00 to claim one. The bar counter has a slightly elevated view if all bean bags are taken — same sunset, less Instagram.</div></div>
        </div>
        <div class="faq-item">
          <div class="faq-q">Is it okay to stay for hours with one coffee? <span class="ico">+</span></div>
          <div class="faq-a"><div class="faq-a-inner">During work hours (09–16) yes — they're explicit about being remote-work friendly. Sunset/evening hours: minimum one drink per hour as a courtesy; staff will mention if it's busy.</div></div>
        </div>
        <div class="faq-item">
          <div class="faq-q">Is it kid-friendly? <span class="ico">+</span></div>
          <div class="faq-a"><div class="faq-a-inner">Daytime yes — they have an açaí bowl kids love and the deck is open. After 19:00 it's a bar atmosphere — adults preferred. No kids menu specifically.</div></div>
        </div>
      </div>

      <!-- NEARBY -->
      <div class="dblock" id="nearby">
        <h2>Other places nearby</h2>
        <p>If you have a half-day on Pratumnak, here's what to pair with The Glass House.</p>

        <div class="nearby-grid">
          <a href="#" class="near-card">
            <div class="ph" style="background-image:url('/pattaya-fotograflar/imgi_124_40360161c5206c760df9b228482dfa480c658edaad32f4f1745231de3afe9358.jpg');background-position:left">
              <span class="pill pill-white">Rooftop bar</span>
              <span class="dist">900 m</span>
            </div>
            <div class="pb">
              <h4>The Sky Gallery</h4>
              <div class="meta"><span class="star">★</span> 4.7 · ฿฿฿</div>
            </div>
          </a>
          <a href="#" class="near-card">
            <div class="ph" style="background-image:url('/pattaya-fotograflar/imgi_127_ryutaro-uozumi-lsdURl-_ktc-unsplash-HEADER.jpg')">
              <span class="pill pill-white">Beach</span>
              <span class="dist">1.4 km</span>
            </div>
            <div class="pb">
              <h4>Cosy Beach</h4>
              <div class="meta"><span class="star">★</span> 4.6 · Free</div>
            </div>
          </a>
          <a href="#" class="near-card">
            <div class="ph" style="background-image:url('/pattaya-fotograflar/imgi_129_iStock-1312283557-HEADER-DESKTOP.jpg');background-position:right">
              <span class="pill pill-white">Vegan</span>
              <span class="dist">2.1 km</span>
            </div>
            <div class="pb">
              <h4>Tamarind Vegan</h4>
              <div class="meta"><span class="star">★</span> 4.8 · ฿฿</div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- SIDEBAR -->
    <aside>
      <div class="sticky-side">
        <div class="book-card">
          <div class="book-head">
            <div class="price-block">
              <span class="from">Price range</span>
              <span class="band">฿฿<span class="dim">฿฿</span></span>
              <span>Avg. ฿180/coffee · ฿380/cocktail</span>
            </div>
            <div class="rt">
              <span class="stars">★★★★★</span>
              <b>4.8 · 1,420</b>
              <span>verified reviews</span>
            </div>
          </div>

          <div class="book-field">
            <label>Date</label>
            <div class="ctrl">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <input type="text" value="May 30, 2026">
            </div>
          </div>

          <div class="book-field">
            <label>Time</label>
            <div class="ctrl">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 2"/></svg>
              <select>
                <option>17:00 — sunset (recommended)</option>
                <option>17:30 — sunset</option>
                <option>18:00 — sunset</option>
                <option>19:00 — after sunset</option>
                <option>20:00 — evening</option>
              </select>
            </div>
          </div>

          <div class="book-field">
            <label>Party size</label>
            <div class="ctrl">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <select><option>2 guests</option><option>1 guest</option><option>3 guests</option><option>4 guests</option><option>5+ guests (deck section)</option></select>
            </div>
          </div>

          <a href="#" class="btn btn-primary btn-block btn-lg" style="margin-top:var(--s4)">Reserve table — free <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>

          <div class="action-row">
            <a href="#" class="alt-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z"/></svg> Call · +66 38 234 567</a>
            <a href="#" class="alt-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M14 5l7 7-7 7"/></svg> Get directions</a>
          </div>

          <div class="book-trust">
            <div class="row"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg> Free reservation · no card needed</div>
            <div class="row"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg> Hold table 15 min after time</div>
            <div class="row"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg> Cancel anytime · no penalty</div>
          </div>
        </div>

        <div class="contact-card">
          <h4>Quick info</h4>
          <div class="contact-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            <div><b>418/8 Pratumnak Soi 5, Pattaya</b><span>Pratumnak Hill, cliff side</span></div>
          </div>
          <div class="contact-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z"/></svg>
            <div><b>+66 38 234 567</b><span>WhatsApp · Line: glasshouse_pty</span></div>
          </div>
          <div class="contact-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>
            <div><b>@glasshouse.pattaya</b><span>Instagram · 28K followers</span></div>
          </div>
          <div class="contact-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 2"/></svg>
            <div><b>Open until 23:00 today</b><span style="color:var(--success);font-weight:600">Closes in 8h 28min</span></div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</div>

<!-- MOBILE STICKY CTA -->
<div class="mobile-cta">
  <div>
    <b>The Glass House</b>
    <span>★ 4.8 · Open till 23:00</span>
  </div>
  <a href="#" class="btn btn-primary">Reserve →</a>
</div>`

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{color:'var(--sun)'}}>
    <path d="m12 17.3-6.2 3.7 1.6-7L2 9.3l7.1-.6L12 2l2.9 6.7 7.1.6-5.4 4.7 1.6 7Z"/>
  </svg>
)

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [venue, images] = await Promise.all([getVenue(id), getVenueImages(id)])
  if (!venue) notFound()

  const allImages = [
    ...(venue.image_url ? [venue.image_url] : []),
    ...images.map(i => i.image_url)
  ].slice(0, 5)

  const isOpen = venue.status === 'Açık'

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: venueCSS}} />

      <div className="crumb">
        <div className="container crumb-inner">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <Link href={`/${venue.categories?.slug}`}>{venue.categories?.name_en}</Link>
          <span className="sep">/</span>
          <span className="now">{venue.name}</span>
        </div>
      </div>

      <div className="container">
        <div className="gallery">
          {allImages.length > 0 ? (
            <>
              <div className="gi gi-main" style={{backgroundImage:`url(${allImages[0]})`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
              {allImages.slice(1,4).map((img, i) => (
                <div key={i} className="gi" style={{backgroundImage:`url(${img})`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
              ))}
              {allImages[4] && (
                <div className="gi" style={{backgroundImage:`url(${allImages[4]})`,backgroundSize:'cover',backgroundPosition:'center',position:'relative'}}>
                  <span className="more">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    All photos
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="gi gi-main" style={{background:'var(--grad-brand)'}}></div>
          )}
        </div>

        <div className="vhead">
          <div className="vhead-l" style={{flex:1,minWidth:280}}>
            <div className="tags">
              <span className="pill pill-blue">{venue.venue_type || venue.categories?.name_en}</span>
              {isOpen ? (
                <span className="pill pill-success">Open now</span>
              ) : (
                <span className="pill pill-danger">Closed</span>
              )}
              {venue.categories?.name_en && <><span>·</span><Link href={`/${venue.categories.slug}`}>{venue.categories.name_en}</Link></>}
            </div>
            <h1>{venue.name}</h1>
            <div className="loc">
              {venue.address && (
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
                  {' '}<b>{venue.address}</b>
                </span>
              )}
              {venue.working_hours && (<><i></i><span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {' '}{venue.working_hours}
              </span></>)}
              {venue.price_range && (<><i></i><span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {' '}{venue.price_range}
              </span></>)}
            </div>
          </div>
          <div className="vhead-r">
            <button className="icbtn" title="Save">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>
            </button>
            <button className="icbtn" title="Share">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>
        </div>

        <div className="rating-row">
          <div className="score">
            <span className="big">{venue.rating?.toFixed(1)}</span>
            <div>
              <div className="stars">{[1,2,3,4,5].map(i => <StarIcon key={i}/>)}</div>
              <span><b>{venue.review_count?.toLocaleString()}</b> verified reviews</span>
            </div>
          </div>
          <div className="quick">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
              Verified listing
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
              Re-checked weekly
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
              {venue.review_count?.toLocaleString()} reviews
            </span>
          </div>
        </div>

        <div dangerouslySetInnerHTML={{__html: staticBottom}} />
      </div>
    </>
  )
}
