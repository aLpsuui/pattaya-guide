import { supabase } from '@/lib/supabase'
import Navbar from './components/Navbar'

interface Venue {
  id: string
  name: string
  rating: number
  review_count: number
  venue_type: string
  price_range: string
  address: string
  status: string
  working_hours: string
  categories: {
    name_en: string
    slug: string
  }
}

interface Category {
  id: string
  name_en: string
  slug: string
}

async function getCategories() {
  const { data } = await supabase.from('categories').select('id, name_en, slug').order('name_en')
  return (data || []) as Category[]
}

async function getTopVenues() {
  const { data } = await supabase
    .from('venues')
    .select('id, name, rating, review_count, venue_type, price_range, address, status, working_hours, categories(name_en, slug)')
    .eq('is_active', true)
    .not('rating', 'is', null)
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })
    .limit(6)
  return (data || []) as unknown as Venue[]
}

async function getOpenVenues() {
  const { data } = await supabase
    .from('venues')
    .select('id, name, rating, review_count, price_range, status, categories(name_en, slug)')
    .eq('status', 'Açık')
    .not('rating', 'is', null)
    .order('rating', { ascending: false })
    .limit(6)
  return (data || []) as unknown as Venue[]
}

async function getOpenCount() {
  const { count } = await supabase
    .from('venues')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Açık')
  return count || 0
}

const categoryMeta: Record<string, {icon: string, photo: string, count: string, live: string}> = {
  tours: {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 21h18M5 21V8l7-4 7 4v13"/></svg>`,
    photo: '/pattaya-fotograflar/imgi_5_30a4dff84cffd371f8aabdc0aefa5995ee9c9118cd0062581a0f727f523c19f5.png',
    count: '77 tours', live: '180 today'
  },
  cafes: {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 1v3M10 1v3M14 1v3"/></svg>`,
    photo: '/pattaya-fotograflar/imgi_124_40360161c5206c760df9b228482dfa480c658edaad32f4f1745231de3afe9358.jpg',
    count: '101 cafés', live: '240 open'
  },
  restaurants: {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10M18 3c-2 0-3 2-3 5s1 4 3 4v9"/></svg>`,
    photo: '/pattaya-fotograflar/imgi_129_iStock-1312283557-HEADER-DESKTOP.jpg',
    count: '73 restaurants', live: 'Open now'
  },
  nightclubs: {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/></svg>`,
    photo: '/pattaya-fotograflar/imgi_117_a8aecbcd2734c0097e1808212aeb96019326d828d01f08525486a0c4623d254a.jpg',
    count: '77 venues', live: 'Opens 18:00'
  },
  spas: {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 4a5 5 0 0 1 5 5c-3 0-5 2-5 5-2-3-4-5-5-5a5 5 0 0 1 5-5Z"/></svg>`,
    photo: '/pattaya-fotograflar/imgi_135_c88b5db4b5413c41.jpg',
    count: '60 spas', live: '290 open'
  },
  skydiving: {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2v10M6 6l6-4 6 4M4 12c0 4 3.6 7 8 7s8-3 8-7"/></svg>`,
    photo: '/pattaya-fotograflar/imgi_125_fff8cb1ff88f4005141bf5dc3190c52198b4efe2e8651b485066d49ff0a910d2.jpg',
    count: '21 spots', live: 'Book now'
  },
  gyms: {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 4v16M18 4v16M3 8h4M17 8h4M3 16h4M17 16h4"/></svg>`,
    photo: '/pattaya-fotograflar/imgi_22_8095e53d10eba6e77c7a6d5b4513c20322d7a512826fbf43739e03d5ad7658d7.jpg',
    count: '79 gyms', live: 'Drop-ins ok'
  },
  'rent-a-bike': {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/><path d="M12 17V7l-5 3M9 7h10l-3 6"/></svg>`,
    photo: '/pattaya-fotograflar/imgi_127_ryutaro-uozumi-lsdURl-_ktc-unsplash-HEADER.jpg',
    count: '27 shops', live: 'From ฿200/day'
  },
}
const top8Slugs = ['tours','cafes','restaurants','nightclubs','spas','skydiving','gyms','rent-a-bike']

export default async function Home() {
  const [categories, topVenues, openVenues, openCount] = await Promise.all([
    getCategories(),
    getTopVenues(),
    getOpenVenues(),
    getOpenCount(),
  ])

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
:root{
  --deep-ocean:#034487;--ocean:#0178B4;--steel:#054C86;--lagoon:#2FBDDC;--sky:#A3CBE5;
  --blue-900:#022e5c;--blue-50:#eef7fc;--blue-100:#d6ebf6;--blue-200:#A3CBE5;
  --ink-900:#0e2233;--ink-700:#33414e;--ink-500:#5f6b75;--ink-400:#8995a0;
  --line:#e4ebf1;--paper:#f6f9fc;--white:#fff;
  --success:#1ba672;--warning:#e8a33d;--danger:#e0524d;--sun:#f5b942;--live:#e0524d;
  --grad-hero:linear-gradient(135deg,#eaf6fb 0%,#cfe8f5 100%);
  --grad-brand:linear-gradient(135deg,#034487 0%,#0178B4 55%,#2FBDDC 100%);
  --grad-cta:linear-gradient(135deg,#0178B4 0%,#054C86 100%);
  --grad-night:linear-gradient(180deg,rgba(2,46,92,0) 0%,rgba(2,46,92,.65) 60%,rgba(2,46,92,.92) 100%);
  --display:'Plus Jakarta Sans',sans-serif;--body:'Manrope',sans-serif;
  --r-sm:8px;--r-md:14px;--r-lg:20px;--r-xl:28px;--r-pill:999px;
  --sh-sm:0 1px 3px rgba(3,68,135,.08);--sh-md:0 8px 24px rgba(3,68,135,.10);
  --sh-lg:0 18px 48px rgba(3,68,135,.16);--sh-cta:0 10px 28px rgba(1,120,180,.35);
  --s1:4px;--s2:8px;--s3:12px;--s4:16px;--s5:24px;--s6:32px;--s7:48px;--s8:64px;--s9:96px;
  --container:1240px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--body);color:var(--ink-700);background:var(--white);line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:pointer;border:none;background:none}
.container{max-width:var(--container);margin:0 auto;padding:0 var(--s5)}
.section{padding:var(--s8) 0}
.kicker{font-family:var(--display);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--lagoon);margin-bottom:var(--s2)}
h1,h2,h3,h4{font-family:var(--display);color:var(--ink-900);letter-spacing:-.02em}
h1{font-weight:800;font-size:clamp(40px,5.8vw,72px);line-height:1.02;letter-spacing:-.03em}
h2{font-weight:800;font-size:clamp(28px,3.4vw,40px);line-height:1.1}
h3{font-weight:700;font-size:20px;line-height:1.25}
h4{font-weight:700;font-size:17px}
.lead{font-size:17px;color:var(--ink-500);max-width:62ch}
.sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:var(--s5);margin-bottom:var(--s6);flex-wrap:wrap}
.sec-head .titles{max-width:640px}
.sec-head .titles p{font-size:15px;color:var(--ink-500);margin-top:8px}
.viewall{color:var(--ocean);font-weight:600;font-size:14px;font-family:var(--display);display:inline-flex;align-items:center;gap:6px;transition:.18s}
.viewall:hover{color:var(--steel);gap:10px}
.btn{display:inline-flex;align-items:center;gap:8px;font-family:var(--display);font-weight:600;font-size:15px;border-radius:var(--r-pill);padding:13px 26px;transition:.2s;cursor:pointer}
.btn-primary{background:var(--grad-cta);color:#fff;box-shadow:var(--sh-cta)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(1,120,180,.45)}
.btn-secondary{background:#fff;color:var(--ocean);border:1.5px solid var(--blue-200)}
.btn-sm{padding:9px 18px;font-size:13px}
.pill{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;border-radius:var(--r-pill);font-size:13px;font-weight:600;font-family:var(--display)}
.pill-white{background:rgba(255,255,255,.92);color:var(--steel);box-shadow:var(--sh-sm)}
.pill-glass{background:rgba(255,255,255,.18);color:#fff;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.25)}
@keyframes pulse{0%,100%{box-shadow:0 0 0 4px rgba(224,82,77,.18)}50%{box-shadow:0 0 0 7px rgba(224,82,77,.05)}}
.topbar{background:var(--blue-900);color:rgba(255,255,255,.82);font-size:13px}
.topbar-inner{display:flex;justify-content:space-between;align-items:center;padding:8px 0;gap:var(--s5)}
.topbar-l,.topbar-r{display:flex;align-items:center;gap:var(--s5)}
.topbar a{display:inline-flex;align-items:center;gap:6px;color:rgba(255,255,255,.85);transition:.18s;font-weight:500}
.topbar a:hover{color:var(--lagoon)}
.topbar .sep{width:1px;height:12px;background:rgba(255,255,255,.15)}
@media(max-width:780px){.topbar-l .hide-m{display:none}}
.nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);transition:.2s}
.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:var(--s5);padding:16px 0}
.brand{display:flex;align-items:center;gap:10px;flex-shrink:0}
.brand svg{width:38px;height:auto}
.brand .wm{font-family:var(--display);font-weight:800;font-size:20px;letter-spacing:-.02em}
.brand .wm i{color:var(--steel);font-style:normal}
.brand .wm u{color:var(--lagoon);text-decoration:none}
.nav-links{display:flex;align-items:center;gap:26px}
.nav-links a{color:var(--ink-700);font-weight:600;font-size:14px;font-family:var(--display);transition:.18s}
.nav-links a:hover{color:var(--ocean)}
.nav-actions{display:flex;align-items:center;gap:12px}
.burger{display:none;width:42px;height:42px;border-radius:50%;background:var(--blue-50);align-items:center;justify-content:center;color:var(--ocean)}
@media(max-width:980px){.nav-links{display:none}.burger{display:inline-flex}}
.hero{position:relative;height:720px;overflow:hidden;color:#fff;display:flex;align-items:center}
.hero-bg{position:absolute;inset:0;background:url(/pattaya-fotograflar/hero-bg.jpg) center/cover no-repeat;animation:kenburns 24s ease-in-out infinite alternate}
@keyframes kenburns{0%{transform:scale(1.04)}100%{transform:scale(1.12)}}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,46,92,.25) 0%,rgba(2,46,92,.1) 35%,rgba(2,46,92,.55) 75%,rgba(2,46,92,.88) 100%)}
.hero-inner{position:relative;z-index:2;width:100%;padding:var(--s8) 0 calc(var(--s9) + 60px)}
.hero .badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.14);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.22);padding:7px 16px;border-radius:var(--r-pill);font-size:13px;font-weight:600;color:#fff;margin-bottom:var(--s5)}
.hero .badge .dot{width:8px;height:8px;border-radius:50%;background:var(--success);box-shadow:0 0 0 4px rgba(27,166,114,.32);display:inline-block}
.hero h1{color:#fff;max-width:880px;text-shadow:0 4px 28px rgba(0,0,0,.18)}
.hero h1 span{background:linear-gradient(135deg,#A3CBE5 0%,#2FBDDC 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hero p.intro{margin-top:var(--s5);font-size:19px;color:rgba(255,255,255,.92);max-width:54ch;text-shadow:0 2px 18px rgba(0,0,0,.25)}
.hero-search{margin-top:var(--s6);background:#fff;border-radius:var(--r-xl);padding:10px;box-shadow:var(--sh-lg);display:flex;gap:8px;align-items:center;max-width:680px}
.hsr{display:flex;align-items:center;flex:1;gap:12px;padding:8px 18px}
.hsr svg{color:var(--ink-400);flex-shrink:0}
.hsr input{flex:1;border:none;outline:none;font-family:var(--body);font-size:16px;color:var(--ink-900);background:transparent}
.hsr input::placeholder{color:var(--ink-400)}
.hero-search .go{display:inline-flex;align-items:center;gap:8px;padding:0 22px;height:54px;border-radius:var(--r-pill);background:var(--grad-cta);box-shadow:var(--sh-cta);color:#fff;font-family:var(--display);font-weight:600;font-size:15px;flex-shrink:0;border:none;cursor:pointer;transition:.2s}
.hero-search .go:hover{transform:translateY(-2px)}
.hero-tags{display:flex;gap:10px;margin-top:var(--s5);flex-wrap:wrap}
.qtag{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);backdrop-filter:blur(10px);border-radius:var(--r-pill);font-size:13px;font-weight:600;color:#fff;transition:.18s;cursor:pointer}
.qtag:hover{background:rgba(255,255,255,.22);transform:translateY(-1px)}
.qtag.live{border-color:rgba(224,82,77,.6);background:rgba(224,82,77,.18)}
.qtag.live::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--live);box-shadow:0 0 0 4px rgba(224,82,77,.25);animation:pulse 1.6s ease-in-out infinite;display:inline-block}
.tod-wrap{margin-top:-58px;position:relative;z-index:5}
.tod{background:#fff;border-radius:var(--r-xl);padding:var(--s5) var(--s6);box-shadow:var(--sh-lg);display:flex;align-items:center;justify-content:space-between;gap:var(--s5);flex-wrap:wrap;border:1px solid var(--line)}
.tod-l{display:flex;flex-direction:column;gap:4px}
.tod-l b{font-family:var(--display);font-size:15px;color:var(--ink-900);display:flex;align-items:center;gap:8px}
.tod-l b .dot{width:8px;height:8px;border-radius:50%;background:var(--success);box-shadow:0 0 0 4px rgba(27,166,114,.18);display:inline-block}
.tod-l span{font-size:13px;color:var(--ink-500)}
.tod-tabs{display:flex;background:var(--blue-50);border-radius:var(--r-pill);padding:5px;gap:4px}
.tod-tab{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:var(--r-pill);font-family:var(--display);font-weight:600;font-size:14px;color:var(--ink-500);cursor:pointer;transition:.2s;border:none;background:transparent}
.tod-tab:hover{color:var(--ocean)}
.tod-tab.active{background:#fff;color:var(--steel);box-shadow:var(--sh-sm)}
.burger{display:none;width:42px;height:42px;border-radius:50%;background:var(--blue-50);align-items:center;justify-content:center;color:var(--ocean);border:none;cursor:pointer}
@media(max-width:980px){.nav-links{display:none}.burger{display:inline-flex}}
.mobile-menu{background:#fff;border-top:1px solid var(--line);padding:var(--s4) 0;box-shadow:var(--sh-md)}
.mobile-nav{display:flex;flex-direction:column;gap:4px}
.mobile-nav a{display:block;padding:12px 16px;color:var(--ink-700);font-weight:600;font-size:15px;font-family:var(--display);border-radius:var(--r-md);transition:.18s}
.mobile-nav a:hover{background:var(--blue-50);color:var(--ocean)}
.trusted{padding:var(--s5) 0;background:#fff;border-bottom:1px solid var(--line);margin-top:var(--s7)}
.trusted-inner{display:flex;align-items:center;justify-content:center;gap:var(--s7);flex-wrap:wrap;color:var(--ink-400);font-size:13px}
.trusted-inner b{font-family:var(--display);color:var(--ink-700);font-weight:700;margin-right:var(--s4)}
.trusted-inner .item{font-weight:600;color:var(--ink-500);font-family:var(--display)}
.cats{background:var(--paper)}
.cats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s4)}
@media(max-width:980px){.cats-grid{grid-template-columns:repeat(2,1fr)}}
.cat{position:relative;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;padding:var(--s5);border-radius:var(--r-lg);background:#fff;transition:.22s;cursor:pointer;overflow:hidden;height:220px;color:#fff;text-decoration:none;border:1px solid var(--line)}
.cat-bg{position:absolute;inset:0;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;transition:.5s;z-index:0;width:100%;height:100%}
.cat::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(3,68,135,0) 0%,rgba(3,68,135,.3) 35%,rgba(3,68,135,.88) 100%);z-index:1}
.cat:hover{transform:translateY(-4px);box-shadow:var(--sh-lg);border-color:transparent}
.cat:hover .cat-bg{transform:scale(1.08)}
.cat>*{position:relative;z-index:2}
.cat .cat-ic{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.18);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;color:#fff;border:1px solid rgba(255,255,255,.25);margin-bottom:auto}
.cat b{font-family:var(--display);font-size:18px;color:#fff;display:block;line-height:1.2}
.cat .meta{display:flex;align-items:center;justify-content:space-between;font-size:13px;color:rgba(255,255,255,.88);margin-top:4px}
.cat .meta .live{display:inline-flex;align-items:center;gap:5px;font-weight:600}
.cat .meta .live i{width:6px;height:6px;border-radius:50%;background:#7CE0AB;box-shadow:0 0 0 3px rgba(124,224,171,.3);font-style:normal;display:inline-block}
.carousel-wrap{position:relative}
.carousel{display:flex;gap:var(--s4);overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:8px;scrollbar-width:none}
.carousel::-webkit-scrollbar{display:none}
.carousel>*{scroll-snap-align:start;flex:0 0 290px}
.car-btn{position:absolute;top:200px;width:48px;height:48px;border-radius:50%;background:#fff;border:1px solid var(--line);box-shadow:var(--sh-md);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--ocean);z-index:2;transition:.18s}
.car-btn:hover{background:var(--ocean);color:#fff;border-color:var(--ocean)}
.car-prev{left:-18px}.car-next{right:-18px}
.place{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;transition:.22s;cursor:pointer}
.place:hover{transform:translateY(-4px);box-shadow:var(--sh-lg);border-color:var(--blue-200)}
.place .ph{height:200px;position:relative;background:var(--grad-brand);display:flex;align-items:center;justify-content:center}
.place .ph .tagpill{position:absolute;top:12px;left:12px;background:rgba(3,68,135,.82);color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:var(--r-pill);backdrop-filter:blur(6px);font-family:var(--display)}
.place .ph .live-badge{position:absolute;bottom:12px;left:12px;display:inline-flex;align-items:center;gap:6px;background:rgba(224,82,77,.95);color:#fff;font-size:12px;font-weight:700;padding:5px 11px;border-radius:var(--r-pill);font-family:var(--display)}
.place .ph .live-badge i{width:6px;height:6px;border-radius:50%;background:#fff;font-style:normal;display:inline-block}
.place .pb{padding:var(--s4)}
.place .pb h4{font-family:var(--display);font-size:17px;font-weight:700;color:var(--ink-900);margin-bottom:6px;line-height:1.3}
.place .pb .meta{display:flex;align-items:center;gap:12px;font-size:13px;color:var(--ink-400);flex-wrap:wrap}
.place .rate{display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)}
.place .rate .left{display:flex;align-items:center;gap:5px;font-size:13px;font-weight:700;color:var(--ink-700);font-family:var(--display)}
.place .rate .star{color:var(--sun);font-size:14px}
.place .rate .count{color:var(--ink-400);font-weight:500;font-family:var(--body)}
.place .rate .price{font-size:13px;color:var(--ocean);font-weight:700;font-family:var(--display)}
.tonight{background:linear-gradient(180deg,#fdf3ee 0%,#fff 100%)}
.tonight-head{display:flex;justify-content:space-between;align-items:flex-end;gap:var(--s5);margin-bottom:var(--s6);flex-wrap:wrap}
.tonight-head h2{display:flex;align-items:center;gap:12px}
.tonight-head h2::before{content:"🔥";font-size:34px}
.filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:var(--s5)}
.cat-pill{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border:1px solid var(--line);background:#fff;border-radius:var(--r-pill);font-weight:600;font-size:14px;color:var(--ink-700);cursor:pointer;transition:.18s;font-family:var(--display)}
.cat-pill:hover,.cat-pill.active{border-color:var(--ocean);background:var(--blue-50);color:var(--ocean)}
.trust{background:var(--blue-50)}
.trust-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s5)}
@media(max-width:860px){.trust-grid{grid-template-columns:1fr}}
.trust-card{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);padding:var(--s6);text-align:center;transition:.22s}
.trust-card:hover{transform:translateY(-3px);box-shadow:var(--sh-md)}
.trust-card .ic{width:64px;height:64px;border-radius:18px;background:var(--blue-50);display:flex;align-items:center;justify-content:center;color:var(--ocean);margin:0 auto var(--s4)}
.trust-card h3{font-size:18px;margin-bottom:8px}
.trust-card p{font-size:14px;color:var(--ink-500)}
.blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s5)}
@media(max-width:860px){.blog-grid{grid-template-columns:1fr}}
.post{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;transition:.22s;cursor:pointer;text-decoration:none;display:flex;flex-direction:column}
.post:hover{transform:translateY(-4px);box-shadow:var(--sh-lg);border-color:var(--blue-200)}
.post .ph{height:220px;background-size:cover;background-position:center;position:relative}
.post .ph .pill{position:absolute;top:14px;left:14px}
.post .pb{padding:var(--s5);flex:1;display:flex;flex-direction:column}
.post .pb .pmeta{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--ink-400);margin-bottom:10px;font-weight:500}
.post .pb .pmeta i{width:3px;height:3px;border-radius:50%;background:var(--ink-400);font-style:normal;display:inline-block}
.post h3{font-size:19px;line-height:1.3;margin-bottom:10px;transition:.18s}
.post:hover h3{color:var(--ocean)}
.post .excerpt{font-size:14px;color:var(--ink-500);line-height:1.55;flex:1}
.post .author{display:flex;align-items:center;gap:10px;margin-top:var(--s4);padding-top:var(--s4);border-top:1px dashed var(--line)}
.post .author .av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#0178B4,#2FBDDC);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:700;font-size:13px;flex-shrink:0}
.post .author b{font-family:var(--display);font-size:13px;color:var(--ink-700);display:block}
.post .author span{font-size:12px;color:var(--ink-400)}
.map-block{display:grid;grid-template-columns:2fr 1fr;border-radius:var(--r-xl);overflow:hidden;box-shadow:var(--sh-md);background:#fff;border:1px solid var(--line);min-height:480px}
@media(max-width:980px){.map-block{grid-template-columns:1fr;min-height:auto}}
.map-canvas{position:relative;background:linear-gradient(135deg,#054C86 0%,#0178B4 70%,#022e5c 100%);overflow:hidden;min-height:440px}
.map-canvas::before{content:"";position:absolute;inset:0;background-image:radial-gradient(circle at 25% 30%,rgba(47,189,220,.35) 0,transparent 16%),radial-gradient(circle at 65% 55%,rgba(163,203,229,.3) 0,transparent 14%),radial-gradient(circle at 40% 75%,rgba(47,189,220,.28) 0,transparent 18%),radial-gradient(circle at 80% 22%,rgba(255,255,255,.18) 0,transparent 12%)}
.map-canvas::after{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:48px 48px}
.map-pin{position:absolute;z-index:3}
.map-pin .pin{width:34px;height:34px;border-radius:50% 50% 50% 0;background:var(--lagoon);transform:rotate(-45deg);box-shadow:0 6px 16px rgba(47,189,220,.5);position:relative;animation:bob 3s ease-in-out infinite}
.map-pin .pin::after{content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg);width:10px;height:10px;border-radius:50%;background:#fff}
.map-pin.alt .pin{background:#fff}
.map-pin.alt .pin::after{background:var(--ocean)}
.map-pin .lbl{position:absolute;top:-32px;left:50%;transform:translateX(-50%);background:#fff;color:var(--steel);padding:3px 10px;border-radius:var(--r-pill);font-size:11px;font-weight:700;font-family:var(--display);white-space:nowrap;box-shadow:var(--sh-md);opacity:0;transition:.2s;pointer-events:none}
.map-pin:hover .lbl{opacity:1;top:-38px}
@keyframes bob{0%,100%{transform:rotate(-45deg) translateY(0)}50%{transform:rotate(-45deg) translateY(-6px)}}
.map-pin-1{top:22%;left:18%}.map-pin-2{top:48%;left:42%}.map-pin-3{top:30%;left:62%}.map-pin-4{top:68%;left:30%}.map-pin-5{top:55%;left:72%;animation-delay:.4s}.map-pin-6{top:14%;left:75%;animation-delay:.8s}
.map-fade{position:absolute;bottom:var(--s5);left:var(--s5);right:var(--s5);z-index:4;background:rgba(255,255,255,.96);backdrop-filter:blur(8px);padding:14px 18px;border-radius:var(--r-md);display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap}
.map-fade b{font-family:var(--display);color:var(--ink-900);font-size:14px}
.map-fade span{font-size:12px;color:var(--ink-500)}
.map-side{padding:var(--s5);display:flex;flex-direction:column;gap:14px;background:#fff}
.map-side h3{margin:0}
.map-side .count{font-size:13px;color:var(--ink-400);font-weight:500;margin-bottom:6px}
.map-list{display:flex;flex-direction:column;gap:10px}
.map-row{display:flex;align-items:center;gap:12px;padding:10px;border-radius:var(--r-md);background:var(--paper);transition:.18s;cursor:pointer;text-decoration:none}
.map-row:hover{background:var(--blue-50)}
.map-row .num{width:28px;height:28px;border-radius:50%;background:var(--grad-cta);color:#fff;font-family:var(--display);font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.map-row .info b{font-family:var(--display);font-size:13px;color:var(--ink-900);display:block;line-height:1.3}
.map-row .info span{font-size:12px;color:var(--ink-400)}
.map-row .star{margin-left:auto;font-size:12px;color:var(--ink-700);font-weight:700;font-family:var(--display)}
.map-row .star i{color:var(--sun);font-style:normal}
.app-cta{position:relative;border-radius:var(--r-xl);overflow:hidden;color:#fff;min-height:520px;display:flex;align-items:center}
.app-cta::before{content:"";position:absolute;inset:0;background:url(/pattaya-fotograflar/imgi_67_90.webp) center/cover no-repeat;z-index:0}
.app-cta::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,rgba(2,46,92,.88) 0%,rgba(3,68,135,.78) 40%,rgba(1,120,180,.35) 100%);z-index:1}
.app-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:var(--s7);align-items:center;position:relative;z-index:2;padding:var(--s8);width:100%}
@media(max-width:860px){.app-grid{grid-template-columns:1fr;padding:var(--s6)}}
.app-cta h2{color:#fff;font-size:clamp(28px,3.4vw,40px);margin-bottom:var(--s4)}
.app-cta p{color:rgba(255,255,255,.9);font-size:17px;margin-bottom:var(--s5);max-width:48ch}
.app-cta .kicker{color:var(--blue-200)}
.app-row{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.app-store{display:inline-flex;align-items:center;gap:12px;background:#0e2233;color:#fff;padding:12px 22px;border-radius:var(--r-md);transition:.2s;text-decoration:none}
.app-store:hover{background:#022e5c;transform:translateY(-2px)}
.app-store span{font-size:11px;display:block;opacity:.7}
.app-store b{font-family:var(--display);font-size:15px;display:block}
.phone-mock{position:relative;width:240px;height:480px;margin:0 auto;background:#0e2233;border-radius:36px;padding:14px;box-shadow:0 30px 80px rgba(2,46,92,.5);transform:rotate(-5deg)}
.phone-screen{width:100%;height:100%;border-radius:24px;background:#fff;overflow:hidden;position:relative}
.phone-bar{height:38px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--ink-900);font-family:var(--display);position:relative;z-index:2}
.phone-bar::after{content:"";position:absolute;top:6px;left:50%;transform:translateX(-50%);width:90px;height:24px;background:#0e2233;border-radius:14px}
.phone-content{padding:6px 14px 14px}
.phone-hero{height:140px;background:var(--grad-brand);border-radius:14px;margin-bottom:12px;position:relative;overflow:hidden}
.phone-hero::after{content:"";position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(to top,rgba(3,68,135,.7),transparent)}
.phone-tags{display:flex;gap:6px;margin-bottom:10px}
.phone-tags i{padding:4px 10px;background:var(--blue-50);color:var(--ocean);font-style:normal;font-size:9px;font-weight:700;border-radius:999px;font-family:var(--display)}
.phone-list{display:flex;flex-direction:column;gap:8px}
.phone-row{display:flex;align-items:center;gap:8px;padding:8px;background:var(--paper);border-radius:10px}
.phone-row .pi{width:34px;height:34px;border-radius:8px;flex-shrink:0}
.phone-row b{font-family:var(--display);font-size:10px;color:var(--ink-900);display:block;line-height:1.2}
.phone-row span{font-size:8px;color:var(--ink-400);display:block;margin-top:2px}
.news{padding:var(--s8) 0;background:var(--paper)}
.news-inner{background:#fff;border:1px solid var(--line);border-radius:var(--r-xl);padding:var(--s8);text-align:center;box-shadow:var(--sh-md);max-width:780px;margin:0 auto}
.news-inner h2{margin-bottom:var(--s3)}
.news-inner p{font-size:16px;color:var(--ink-500);max-width:52ch;margin:0 auto var(--s5)}
.news-form{display:flex;gap:8px;max-width:480px;margin:0 auto;background:var(--paper);border-radius:var(--r-pill);padding:6px 6px 6px 22px;border:1px solid var(--line)}
.news-form input{flex:1;border:none;outline:none;background:transparent;font-family:var(--body);font-size:15px;color:var(--ink-900)}
.news-form input::placeholder{color:var(--ink-400)}
.footer{background:var(--blue-900);color:rgba(255,255,255,.78);padding:var(--s9) 0 var(--s5)}
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
.venue-icon{font-size:28px;color:rgba(255,255,255,.9)}
      `}</style>

      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-l">
            <a href="#" className="hide-m">🌐 EN · English ▾</a>
            <span className="sep hide-m"></span>
            <a href="#" className="hide-m">฿ THB ▾</a>
          </div>
          <div className="topbar-r">
            <a href="#">📍 Open Pattaya map →</a>
            <span className="sep"></span>
            <a href="#">Sign in</a>
          </div>
        </div>
      </div>

      <Navbar />


      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="container hero-inner">
          <span className="badge"><span className="dot"></span> Verified by 800+ locals · Updated weekly</span>
          <h1>Pattaya,<br/>decoded by people<br/>who <span>live here.</span></h1>
          <p className="intro">{openCount}+ places open right now — eat, beach, tours, wellness, Muay Thai. Real photos, real prices, real opening hours.</p>
          <div className="hero-search">
            <div className="hsr">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <input id="heroInput" placeholder='Try "rooftop bar", "muay thai gym", "massage now"...'/>
            </div>
            <button className="go">
              <span>Search</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </div>
          <div className="hero-tags">
            <button className="qtag live">Open now</button>
            <button className="qtag">Near me</button>
            <button className="qtag">Top rated</button>
            <button className="qtag">Tonight</button>
            <button className="qtag">中文 friendly</button>
          </div>
        </div>
      </section>

      <div className="container tod-wrap">
        <div className="tod">
          <div className="tod-l">
            <b><span className="dot"></span>It&apos;s {new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Bangkok'})} in Pattaya</b>
            <span>{openCount} places open right now</span>
          </div>
          <div className="tod-tabs">
            <button className="tod-tab active">☀ Day <span style={{opacity:.5,fontWeight:500}}>06–17</span></button>
            <button className="tod-tab">🌅 Evening <span style={{opacity:.5,fontWeight:500}}>17–22</span></button>
            <button className="tod-tab">🌙 Night <span style={{opacity:.5,fontWeight:500}}>22–05</span></button>
          </div>
          <div style={{fontSize:14,color:'var(--ink-500)'}}>
            <span>32° · Light breeze · <b style={{color:'var(--ocean)'}}>perfect for the beach</b></span>
          </div>
        </div>
      </div>

      <div className="trusted">
        <div className="container trusted-inner">
          <b>As featured in</b>
          <span className="item">Lonely Planet</span>
          <span className="item">Time Out</span>
          <span className="item">Travel + Leisure</span>
          <span className="item">Bangkok Post</span>
          <span className="item">Condé Nast</span>
        </div>
      </div>

      {/* CATEGORIES — from database */}
      <section className="section cats">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Browse Pattaya</div>
              <h2>What are you in the mood for?</h2>
              <p>Every category verified in-person and re-checked every 7 days.</p>
            </div>
            <a href="#" className="viewall">All categories →</a>
          </div>
          <div className="cats-grid">
            {categories
              .filter((cat: Category) => top8Slugs.includes(cat.slug))
              .sort((a: Category, b: Category) => top8Slugs.indexOf(a.slug) - top8Slugs.indexOf(b.slug))
              .map((cat: Category) => {
                const meta = categoryMeta[cat.slug]
                return (
                  <a key={cat.id} href={`/${cat.slug}`} className="cat">
                    <div style={{backgroundImage:`url(${meta?.photo})`,backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat',position:'absolute',inset:0,zIndex:0,transition:'.5s'}}></div>
                    <div className="cat-ic" dangerouslySetInnerHTML={{__html: meta?.icon || '📍'}}/>
                    <b>{cat.name_en}</b>
                    <div className="meta">
                      <span>{meta?.count}</span>
                      <span className="live"><i></i>{meta?.live}</span>
                    </div>
                  </a>
                )
              })}
          </div>
        </div>
      </section>

      {/* TONIGHT — open venues from database */}
      <section className="section tonight">
        <div className="container">
          <div className="tonight-head">
            <div>
              <h2>Tonight in Pattaya</h2>
              <p style={{fontSize:14,color:'var(--ink-500)',marginTop:4,display:'flex',alignItems:'center',gap:8}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:'var(--live)',display:'inline-block',boxShadow:'0 0 0 4px rgba(224,82,77,.2)'}}></span>
                Live · {openCount} places open right now
              </p>
            </div>
            <a href="#" className="viewall">View all live →</a>
          </div>
          <div className="carousel-wrap">
            <div className="carousel" id="tonightCar">
              {openVenues.map((venue: Venue) => (
                <article key={venue.id} className="place">
                  <div className="ph">
                    <span className="tagpill">{venue.categories?.name_en}</span>
                    <span className="live-badge"><i></i>Open now</span>
                  </div>
                  <div className="pb">
                    <h4>{venue.name}</h4>
                    <div className="meta"><span>{venue.venue_type}</span></div>
                    <div className="rate">
                      <div className="left"><span className="star">★</span> {venue.rating?.toFixed(1)} <span className="count">({venue.review_count?.toLocaleString()})</span></div>
                      <span className="price">{venue.price_range || '—'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TOP VENUES — from database */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Editor&apos;s picks</div>
              <h2>Top things to do in Pattaya</h2>
              <p>Handpicked by our team — every place visited in person, re-checked every 7 days.</p>
            </div>
            <a href="#" className="viewall">View all 600+ →</a>
          </div>
          <div className="filters">
            <button className="cat-pill active">All</button>
            {categories.slice(0,5).map((cat: Category) => (
              <button key={cat.id} className="cat-pill">{cat.name_en}</button>
            ))}
          </div>
          <div className="carousel-wrap">
            <div className="carousel" id="topCar">
              {topVenues.map((venue: Venue) => (
                <article key={venue.id} className="place">
                  <div className="ph">
                    <span className="tagpill">{venue.categories?.name_en}</span>
                  </div>
                  <div className="pb">
                    <h4>{venue.name}</h4>
                    <div className="meta"><span>{venue.venue_type}</span>{venue.address && <span>· {venue.address.slice(0,30)}...</span>}</div>
                    <div className="rate">
                      <div className="left"><span className="star">★</span> {venue.rating?.toFixed(1)} <span className="count">({venue.review_count?.toLocaleString()})</span></div>
                      <span className="price">{venue.price_range || '—'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Interactive map</div>
              <h2>Every place. One map. Works offline.</h2>
              <p>Filter by category, district or rating. Save areas before you fly. Walking routes between picks — no data roaming required.</p>
            </div>
          </div>

          <div className="map-block">
            <div className="map-canvas">
              <div className="map-pin map-pin-1"><span className="lbl">Sanctuary of Truth</span><div className="pin"></div></div>
              <div className="map-pin map-pin-2 alt"><span className="lbl">Pattaya Beach</span><div className="pin"></div></div>
              <div className="map-pin map-pin-3"><span className="lbl">Walking Street</span><div className="pin"></div></div>
              <div className="map-pin map-pin-4"><span className="lbl">Sky Gallery</span><div className="pin"></div></div>
              <div className="map-pin map-pin-5 alt"><span className="lbl">Jomtien Beach</span><div className="pin"></div></div>
              <div className="map-pin map-pin-6"><span className="lbl">Koh Larn</span><div className="pin"></div></div>
              <div className="map-fade">
                <div>
                  <b>600+ places visible</b>
                  <span style={{display:'block'}}>filtered by ☀ Day · all categories</span>
                </div>
                <a href="#" className="btn btn-primary btn-sm">Open full map →</a>
              </div>
            </div>
            <div className="map-side">
              <h3>Nearby right now</h3>
              <span className="count">{openCount} places open right now</span>
              <div className="map-list">
                {topVenues.slice(0,5).map((venue: Venue, i: number) => (
                  <a key={venue.id} href="#" className="map-row">
                    <div className="num">{i+1}</div>
                    <div className="info">
                      <b>{venue.name}</b>
                      <span>{venue.categories?.name_en}{venue.venue_type ? ` · ${venue.venue_type}` : ''}</span>
                    </div>
                    <span className="star"><i>★</i> {venue.rating?.toFixed(1)}</span>
                  </a>
                ))}
              </div>
              <a href="#" className="viewall" style={{marginTop:'auto'}}>See all {openCount} nearby →</a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section trust">
        <div className="container">
          <div className="sec-head" style={{justifyContent:'center',textAlign:'center'}}>
            <div className="titles" style={{textAlign:'center',margin:'0 auto'}}>
              <div className="kicker">Why Pattaya Guide is different</div>
              <h2>The honest local guide. No paid placements.</h2>
            </div>
          </div>
          <div className="trust-grid">
            <div className="trust-card">
              <div className="ic"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg></div>
              <h3>Verified by 800+ locals</h3>
              <p>Every venue visited monthly by residents who actually live in Pattaya.</p>
            </div>
            <div className="trust-card">
              <div className="ic"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m12 17.3-6.2 3.7 1.6-7L2 9.3l7.1-.6L12 2l2.9 6.7 7.1.6-5.4 4.7 1.6 7Z"/></svg></div>
              <h3>Real reviews only</h3>
              <p>No fake stars. No paid placements. We reject every offer that doesn&apos;t meet our standards.</p>
            </div>
            <div className="trust-card">
              <div className="ic"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg></div>
              <h3>Updated every 7 days</h3>
              <p>Opening hours, prices, seasonal closings — we re-check every place every week.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG - Static for now */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Travel Blog</div>
              <h2>Stories from the coast</h2>
              <p>Deeper guides and seasonal updates from our local editorial team.</p>
            </div>
            <a href="#" className="viewall">All articles →</a>
          </div>
          <div className="blog-grid">
            <a href="#" className="post">
              <div className="ph" style={{backgroundImage:"url(/pattaya-fotograflar/imgi_135_c88b5db4b5413c41.jpg)",backgroundSize:'cover',backgroundPosition:'center'}}>
                <span className="pill pill-white">Guides</span>
              </div>
              <div className="pb">
                <div className="pmeta"><span>May 24, 2026</span><i></i><span>7 min read</span></div>
                <h3>The honest 48-hour Pattaya itinerary</h3>
                <p className="excerpt">Skip the obvious tourist loop. Here's how to spend a weekend the way locals actually do — including the one beach we always come back to.</p>
                <div className="author">
                  <div className="av">NK</div>
                  <div><b>Nadia K.</b><span>Senior editor · Pattaya 6 yrs</span></div>
                </div>
              </div>
            </a>
            <a href="#" className="post">
              <div className="ph" style={{backgroundImage:"url(/pattaya-fotograflar/imgi_129_iStock-1312283557-HEADER-DESKTOP.jpg)",backgroundSize:'cover',backgroundPosition:'center'}}>
                <span className="pill pill-white">Food</span>
              </div>
              <div className="pb">
                <div className="pmeta"><span>May 18, 2026</span><i></i><span>5 min read</span></div>
                <h3>Where to eat seafood that isn&apos;t a tourist trap</h3>
                <p className="excerpt">Six no-frills places along Naklua and Jomtien where the catch is hours old, not days. We tasted everything so you don&apos;t have to guess.</p>
                <div className="author">
                  <div className="av">RT</div>
                  <div><b>Rin T.</b><span>Food editor</span></div>
                </div>
              </div>
            </a>
            <a href="#" className="post">
              <div className="ph" style={{backgroundImage:"url(/pattaya-fotograflar/imgi_137_63e3c62ef0c5d.jpg)",backgroundSize:'cover',backgroundPosition:'center'}}>
                <span className="pill pill-white">Outdoors</span>
              </div>
              <div className="pb">
                <div className="pmeta"><span>May 12, 2026</span><i></i><span>6 min read</span></div>
                <h3>Koh Larn beaches, ranked by quietness</h3>
                <p className="excerpt">Tien Beach? Skip it after 11 AM. Samae Beach? Go on weekdays. The honest map of where to swim, snorkel and actually hear the waves.</p>
                <div className="author">
                  <div className="av">MS</div>
                  <div><b>Marek S.</b><span>Travel writer</span></div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* APP CTA */}
      <section className="section">
        <div className="container">
          <div className="app-cta">
            <div className="app-grid">
              <div>
                <div className="kicker">Get the app</div>
                <h2>Pattaya, in your pocket — even offline.</h2>
                <p>Save places, build itineraries, navigate without data. Free on iOS and Android. No account required to start.</p>
                <div className="app-row">
                  <a href="#" className="app-store">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.04c-.03-2.85 2.33-4.22 2.43-4.29-1.32-1.94-3.39-2.2-4.12-2.23-1.76-.18-3.43 1.04-4.32 1.04-.91 0-2.27-1.02-3.73-.99-1.92.03-3.69 1.11-4.68 2.83-2 3.46-.51 8.59 1.43 11.4.95 1.38 2.08 2.92 3.57 2.87 1.43-.06 1.97-.93 3.71-.93 1.72 0 2.22.93 3.74.9 1.55-.03 2.52-1.4 3.46-2.79 1.09-1.6 1.54-3.15 1.57-3.23-.03-.02-3.01-1.16-3.06-4.58zM14.13 3.85c.78-.95 1.31-2.27 1.16-3.58-1.13.05-2.5.76-3.31 1.71-.72.84-1.36 2.18-1.19 3.47 1.26.1 2.55-.64 3.34-1.6z"/></svg>
                    <div><span>Download on the</span><b>App Store</b></div>
                  </a>
                  <a href="#" className="app-store">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3.6 1.4c-.4.4-.6 1-.6 1.8v17.6c0 .8.2 1.4.6 1.8l11.2-11.2L3.6 1.4zm12.5 12.5L5.3 24.6l11.2-6.4 3.4-1.9-3.8-2.4zm5.4-3.1l-3.6-2.1-3.8 3.4 3.8 3.4 3.6-2.1c1.1-.6 1.1-2 0-2.6zM5.3-.6l10.8 10.8 3.8-2.4-3.4-1.9L5.3-.6z"/></svg>
                    <div><span>Get it on</span><b>Google Play</b></div>
                  </a>
                </div>
                <p style={{marginTop:'var(--s5)',fontSize:13,color:'rgba(255,255,255,.78)',display:'flex',alignItems:'center',gap:8}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                  12,000+ five-star reviews · Free, no ads, no account needed
                </p>
              </div>
              <div>
                <div className="phone-mock">
                  <div className="phone-screen">
                    <div className="phone-bar">9:41</div>
                    <div className="phone-content">
                      <div className="phone-hero" style={{backgroundImage:'url(/pattaya-fotograflar/imgi_5_30a4dff84cffd371f8aabdc0aefa5995ee9c9118cd0062581a0f727f523c19f5.png)',backgroundSize:'cover',backgroundPosition:'center'}}></div>
                      <div className="phone-tags"><i>Temple</i><i>Open</i><i>4.8★</i></div>
                      <div className="phone-list">
                        {topVenues.slice(0,3).map((venue: Venue) => (
                          <div key={venue.id} className="phone-row">
                            <div className="pi" style={{background:'var(--grad-brand)'}}></div>
                            <div><b>{venue.name.slice(0,20)}{venue.name.length > 20 ? '...' : ''}</b><span>{venue.categories?.name_en} · {venue.rating}★</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="news">
        <div className="container">
          <div className="news-inner">
            <div className="kicker">Plan in 5 minutes</div>
            <h2>Get our free 1-week Pattaya itinerary.</h2>
            <p>New openings, seasonal pop-ups, and the editor-picked itinerary we send to friends.</p>
            <form className="news-form">
              <input type="email" placeholder="your@email.com" required/>
              <button className="btn btn-primary btn-sm" type="submit">Send to my inbox →</button>
            </form>
            <p style={{fontSize:12,color:'var(--ink-400)',marginTop:'var(--s4)'}}>One email a month. No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand">
                <div className="wm"><i style={{color:'#fff'}}>Pattaya</i><u>Guide</u></div>
              </div>
              <p>The honest local guide to Pattaya. Verified by 800+ locals · Updated weekly · EN · RU · ZH</p>
            </div>
            <div>
              <h5>Explore</h5>
              <ul>
                {categories.slice(0,6).map((cat: Category) => (
                  <li key={cat.id}><a href={`/${cat.slug}`}>{cat.name_en}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h5>Districts</h5>
              <ul>
                <li><a href="#">Central Pattaya</a></li>
                <li><a href="#">Jomtien</a></li>
                <li><a href="#">Pratumnak Hill</a></li>
                <li><a href="#">Naklua</a></li>
                <li><a href="#">Koh Larn Island</a></li>
              </ul>
            </div>
            <div>
              <h5>Company</h5>
              <ul>
                <li><a href="#">About us</a></li>
                <li><a href="#">Travel blog</a></li>
                <li><a href="#">Submit a venue</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5>Languages</h5>
              <ul>
                <li><a href="#">English</a></li>
                <li><a href="#">Русский</a></li>
                <li><a href="#">中文</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Pattaya Guide · Made in Pattaya 🇹🇭</span>
            <div className="legal">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <script dangerouslySetInnerHTML={{__html:`
        document.querySelectorAll('.cat-pill').forEach(p=>{
          p.addEventListener('click',e=>{
            e.preventDefault();
            p.parentElement.querySelectorAll('.cat-pill').forEach(s=>s.classList.remove('active'));
            p.classList.add('active');
          });
        });
        document.querySelectorAll('.tod-tab').forEach(t=>{
          t.addEventListener('click',()=>{
            document.querySelectorAll('.tod-tab').forEach(s=>s.classList.remove('active'));
            t.classList.add('active');
          });
        });
        const nav=document.getElementById('nav');
        window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>20));
      `}}/>
    </>
  )
}
