import './areas.css'
import BlogScript from '@/app/components/BlogScript'

export const metadata = {
  title: 'Areas of Pattaya — Find Your Neighborhood | Go To Pattaya',
  description: "An orientation guide to Pattaya's neighborhoods — Central, Jomtien, Naklua, Pratumnak Hill, Wong Amat and Walking Street. Compare vibes, beaches and nightlife to decide where to base yourself.",
  alternates: { canonical: '/areas' },
}

const HTML = String.raw`
<!-- ===== Inline icon sprite (only the symbols this page uses) ===== -->
<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
  <symbol id="pg-pin" viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></symbol>
  <symbol id="pg-map" viewBox="0 0 24 24"><path d="m9 4-6 2.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z"/><path d="M9 4v13"/><path d="M15 6.5v13"/></symbol>
  <symbol id="pg-near-me" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></symbol>
  <symbol id="pg-route" viewBox="0 0 24 24"><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="5.5" r="2.5"/><path d="M9 18.5h6a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7"/></symbol>
  <symbol id="pg-directions" viewBox="0 0 24 24"><path d="M21 3 3 10.5l7.5 2.8 2.8 7.5z"/><path d="m21 3-10.7 10.3"/></symbol>
  <symbol id="pg-beach" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 16 0z"/><path d="M12 4v14"/><path d="M12 4c-2.4 1.4-3.9 4.4-3.9 8"/><path d="M12 4c2.4 1.4 3.9 4.4 3.9 8"/><path d="M9 21c1-1.2 2-1.2 3 0s2 1.2 3 0"/></symbol>
  <symbol id="pg-nightlife" viewBox="0 0 24 24"><path d="M5 5h14l-7 8z"/><path d="M12 13v6"/><path d="M8.5 19h7"/><path d="M14 8.5 18.5 5"/><circle cx="18.6" cy="4.9" r=".6" fill="currentColor" stroke="none"/></symbol>
  <symbol id="pg-eat" viewBox="0 0 24 24"><path d="M5 3v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3"/><path d="M8 11v10"/><path d="M19 21V3a4 4 0 0 0-4 4v6a2 2 0 0 0 2 2h2"/></symbol>
  <symbol id="pg-coffee" viewBox="0 0 24 24"><path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 9h2.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 2.6c.6 1-.6 2 0 3"/><path d="M12 2.6c.6 1-.6 2 0 3"/></symbol>
  <symbol id="pg-bars" viewBox="0 0 24 24"><path d="M6 8h9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M15 11h2.5a2.5 2.5 0 0 1 0 5H15"/><path d="M6 11.5h9"/></symbol>
  <symbol id="pg-wellness" viewBox="0 0 24 24"><path d="M12 17C10 14.5 10 9.5 12 7c2 2.5 2 7.5 0 10z"/><path d="M12 17C9 16 6 14.5 5.5 11.5 8.5 11.8 11 13.5 12 17z"/><path d="M12 17c3-1 6-2.5 6.5-5.5C15.5 11.8 13 13.5 12 17z"/><path d="M5 18.6c2.4 1.3 11.6 1.3 14 0"/></symbol>
  <symbol id="pg-attractions" viewBox="0 0 24 24"><path d="M3.5 9 12 4l8.5 5"/><path d="M5 9h14"/><path d="M5.5 9v9"/><path d="M9.5 9v9"/><path d="M14.5 9v9"/><path d="M18.5 9v9"/><path d="M4 18h16"/><path d="M3 21h18"/></symbol>
  <symbol id="pg-shopping" viewBox="0 0 24 24"><path d="M5.5 8h13l-.9 11.1a2 2 0 0 1-2 1.9H8.4a2 2 0 0 1-2-1.9z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></symbol>
  <symbol id="pg-family" viewBox="0 0 24 24"><circle cx="8" cy="6" r="2.5"/><path d="M3.5 20v-3.5a4.5 4.5 0 0 1 9 0V20"/><circle cx="16.5" cy="8" r="1.8"/><path d="M14 20v-3a3 3 0 0 1 6 0v3"/></symbol>
  <symbol id="pg-kids" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.2"/><path d="M12 7.2v6.5"/><path d="M8.5 9.5h7"/><path d="m9 20 3-6 3 6"/></symbol>
  <symbol id="pg-moon" viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/><path d="m17 5 .6 1.5L19 7l-1.4.5L17 9l-.6-1.5L15 7l1.4-.5z" fill="currentColor" stroke="none"/></symbol>
  <symbol id="pg-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.3"/><path d="M12 2v2.4"/><path d="M12 19.6V22"/><path d="m4.4 4.4 1.7 1.7"/><path d="m17.9 17.9 1.7 1.7"/><path d="M2 12h2.4"/><path d="M19.6 12H22"/><path d="m4.4 19.6 1.7-1.7"/><path d="m17.9 6.1 1.7-1.7"/></symbol>
  <symbol id="pg-sunset" viewBox="0 0 24 24"><path d="M7 18a5 5 0 0 1 10 0"/><path d="M3 18h2.5"/><path d="M18.5 18H21"/><path d="M12 3v6"/><path d="m9 6.2 3 3 3-3"/><path d="m4.6 12.6 1.6 1.2"/><path d="m19.4 12.6-1.6 1.2"/></symbol>
  <symbol id="pg-star" viewBox="0 0 24 24"><path d="M12 2.6 14.85 8.4 21.2 9.3l-4.6 4.4 1.1 6.3L12 17.4 6.3 20l1.1-6.3-4.6-4.4 6.35-.9z"/></symbol>
  <symbol id="pg-walk" viewBox="0 0 24 24"><circle cx="12.5" cy="4" r="2"/><path d="M12.5 6.5 10.5 12l2 1.5 1.5 6.5"/><path d="M10.5 12 9 17l-1.5 3"/><path d="M11 9l2.5 1.5"/></symbol>
  <symbol id="pg-songthaew" viewBox="0 0 24 24"><path d="M2 16V9h11v7"/><path d="M13 16v-4h3l2.5 3v1"/><path d="M2 12.5h11"/><path d="M5.5 9V6.5h7V9"/><circle cx="6" cy="16.5" r="1.7"/><circle cx="16" cy="16.5" r="1.7"/></symbol>
  <symbol id="pg-anchor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.5"/><path d="M12 7.5v13.5"/><path d="M5 13a7 7 0 0 0 14 0"/><path d="M5 13H3"/><path d="M19 13h2"/><path d="M9 9.5h6"/></symbol>
  <symbol id="pg-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".8" fill="currentColor" stroke="none"/></symbol>
  <symbol id="pg-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7"/></symbol>
  <symbol id="pg-chevron-right" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
  <symbol id="pg-chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
  <symbol id="pg-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></symbol>
  <symbol id="pg-filter" viewBox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4-2v-4z"/></symbol>
  <symbol id="pg-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></symbol>
  <symbol id="pg-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.5 4 5.7 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.7-4-9s1.4-6.5 4-9z"/></symbol>
  <symbol id="pg-verified" viewBox="0 0 24 24"><path d="M12 3 5 6v6c0 4 3 6.6 7 8 4-1.4 7-4 7-8V6z"/><path d="m9 12 2 2 4-4.5"/></symbol>
  <symbol id="pg-local-verified" viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><path d="m9.2 9.9 2 2 3.6-3.8"/></symbol>
  <symbol id="pg-coins" viewBox="0 0 24 24"><circle cx="9" cy="9" r="5.5"/><path d="M8 7h1.5v4"/><path d="M16.2 9.3a5.5 5.5 0 1 1-7 7.4"/></symbol>
</svg>

<div class="area-page">

  <!-- ===================== 1 · HERO ===================== -->
  <section class="ar-hero" aria-labelledby="ar-hero-title">
    <img class="ar-hero__img" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-city-beach-1.jpg"
         alt="Aerial view of Pattaya's curved bay, beachfront skyline and the Gulf of Thailand at dusk"
         width="1600" height="900">
    <div class="ar-hero__veil" aria-hidden="true"></div>
    <div class="ar-hero__inner">
      <div class="container">
        <span class="kicker">Areas</span>
        <h1 id="ar-hero-title">Find Your Pattaya Neighborhood</h1>
        <p class="ar-hero__lead">Pattaya is really six small cities in one bay. This is the map-first guide to where to base yourself — and what each district actually feels like.</p>
        <nav class="ar-jump" aria-label="Jump to a district">
          <a class="chip" href="#central"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg>Central</a>
          <a class="chip" href="#jomtien"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg>Jomtien</a>
          <a class="chip" href="#naklua"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg>Naklua</a>
          <a class="chip" href="#pratumnak"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg>Pratumnak</a>
          <a class="chip" href="#wong-amat"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg>Wong Amat</a>
          <a class="chip" href="#walking-street"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg>Walking Street</a>
        </nav>
      </div>
    </div>
  </section>

  <!-- ===================== 2 · PATTAYA AT A GLANCE ===================== -->
  <section class="bg-sunken" aria-labelledby="glance-title">
    <div class="container">
      <div class="sec-head">
        <span class="kicker">Pattaya at a glance</span>
        <h2 id="glance-title">One bay, six personalities</h2>
        <p>South to north along the coast, here is how the districts line up — and the vibe each one is known for.</p>
      </div>

      <div class="glance">
        <!-- Stylized schematic map (NOT a real map embed) -->
        <div class="ar-mapcard">
          <p class="ar-mapcard__title"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg>Orientation map · schematic</p>
          <svg class="ar-schematic" viewBox="0 0 460 380" role="img" aria-labelledby="schematic-title schematic-desc">
            <title id="schematic-title">Schematic map of Pattaya's six districts along the bay</title>
            <desc id="schematic-desc">An abstract coastline running top to bottom. From north to south: Wong Amat, Naklua, Central Pattaya and Walking Street on the main bay, Pratumnak Hill on the headland, and Jomtien on the long southern beach.</desc>
            <defs>
              <linearGradient id="seaGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#0a7e9c"/>
                <stop offset="1" stop-color="#022e5c"/>
              </linearGradient>
              <linearGradient id="pinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#2fbddc"/>
                <stop offset="1" stop-color="#0178b4"/>
              </linearGradient>
            </defs>
            <!-- sea -->
            <rect x="0" y="0" width="460" height="380" rx="20" fill="url(#seaGrad)"/>
            <!-- subtle wave lines -->
            <g stroke="rgba(255,255,255,.10)" stroke-width="1.5" fill="none">
              <path d="M30 70q16-10 32 0t32 0"/>
              <path d="M30 320q16-10 32 0t32 0"/>
              <path d="M360 150q16-10 32 0t32 0"/>
            </g>
            <!-- land mass (the coast) -->
            <path d="M170 0 C 210 40 235 70 240 120 C 244 160 280 180 300 220 C 320 258 300 300 280 340 L 280 380 L 460 380 L 460 0 Z"
                  fill="#0e2233" stroke="rgba(255,255,255,.12)" stroke-width="2"/>
            <text x="392" y="200" text-anchor="middle" class="ar-pin-sub" transform="rotate(90 392 200)" letter-spacing="3">PATTAYA · MAINLAND</text>

            <!-- pins (north → south). Each: stem + head + dot + label -->
            <!-- Wong Amat -->
            <g>
              <circle cx="148" cy="44" r="9" fill="url(#pinGrad)" stroke="#fff" stroke-width="2"/>
              <circle cx="148" cy="44" r="3" fill="#fff"/>
              <text x="138" y="38" text-anchor="end" class="ar-pin-label">Wong Amat</text>
              <text x="138" y="50" text-anchor="end" class="ar-pin-sub">boutique beach</text>
            </g>
            <!-- Naklua -->
            <g>
              <circle cx="180" cy="104" r="9" fill="url(#pinGrad)" stroke="#fff" stroke-width="2"/>
              <circle cx="180" cy="104" r="3" fill="#fff"/>
              <text x="170" y="98" text-anchor="end" class="ar-pin-label">Naklua</text>
              <text x="170" y="110" text-anchor="end" class="ar-pin-sub">old-town · seafood</text>
            </g>
            <!-- Central -->
            <g>
              <circle cx="206" cy="166" r="9" fill="url(#pinGrad)" stroke="#fff" stroke-width="2"/>
              <circle cx="206" cy="166" r="3" fill="#fff"/>
              <text x="196" y="160" text-anchor="end" class="ar-pin-label">Central</text>
              <text x="196" y="172" text-anchor="end" class="ar-pin-sub">shops · nightlife</text>
            </g>
            <!-- Walking Street -->
            <g>
              <circle cx="232" cy="212" r="9" fill="#ef4d63" stroke="#fff" stroke-width="2"/>
              <circle cx="232" cy="212" r="3" fill="#fff"/>
              <text x="222" y="206" text-anchor="end" class="ar-pin-label">Walking St.</text>
              <text x="222" y="218" text-anchor="end" class="ar-pin-sub">the strip</text>
            </g>
            <!-- Pratumnak (headland) -->
            <g>
              <circle cx="278" cy="256" r="9" fill="url(#pinGrad)" stroke="#fff" stroke-width="2"/>
              <circle cx="278" cy="256" r="3" fill="#fff"/>
              <text x="290" y="250" text-anchor="start" class="ar-pin-label">Pratumnak</text>
              <text x="290" y="262" text-anchor="start" class="ar-pin-sub">the hill · views</text>
            </g>
            <!-- Jomtien -->
            <g>
              <circle cx="252" cy="330" r="9" fill="url(#pinGrad)" stroke="#fff" stroke-width="2"/>
              <circle cx="252" cy="330" r="3" fill="#fff"/>
              <text x="240" y="324" text-anchor="end" class="ar-pin-label">Jomtien</text>
              <text x="240" y="336" text-anchor="end" class="ar-pin-sub">long quiet beach</text>
            </g>
            <!-- N indicator -->
            <text x="34" y="30" class="ar-pin-sub" fill="rgba(255,255,255,.5)">N ↑</text>
          </svg>
        </div>

        <!-- Legend -->
        <div class="ar-legend">
          <a class="ar-legend__row" href="#central">
            <span class="ar-legend__dot d-central" aria-hidden="true"></span>
            <span class="ar-legend__txt"><b>Central Pattaya</b>
              <span class="vibes">
                <span class="vibe vibe--nightlife">Nightlife</span>
                <span class="vibe vibe--foodie">Foodie</span>
                <span class="vibe vibe--backpacker">Backpacker</span>
              </span>
            </span>
          </a>
          <a class="ar-legend__row" href="#jomtien">
            <span class="ar-legend__dot d-jomtien" aria-hidden="true"></span>
            <span class="ar-legend__txt"><b>Jomtien</b>
              <span class="vibes">
                <span class="vibe vibe--beach">Beach</span>
                <span class="vibe vibe--family">Family</span>
                <span class="vibe vibe--quiet">Quiet</span>
              </span>
            </span>
          </a>
          <a class="ar-legend__row" href="#naklua">
            <span class="ar-legend__dot d-naklua" aria-hidden="true"></span>
            <span class="ar-legend__txt"><b>Naklua</b>
              <span class="vibes">
                <span class="vibe vibe--local">Local</span>
                <span class="vibe vibe--quiet">Quiet</span>
                <span class="vibe vibe--foodie">Foodie</span>
              </span>
            </span>
          </a>
          <a class="ar-legend__row" href="#pratumnak">
            <span class="ar-legend__dot d-pratumnak" aria-hidden="true"></span>
            <span class="ar-legend__txt"><b>Pratumnak Hill</b>
              <span class="vibes">
                <span class="vibe vibe--quiet">Quiet</span>
                <span class="vibe vibe--luxury">Luxury</span>
                <span class="vibe vibe--beach">Beach</span>
              </span>
            </span>
          </a>
          <a class="ar-legend__row" href="#wong-amat">
            <span class="ar-legend__dot d-wongamat" aria-hidden="true"></span>
            <span class="ar-legend__txt"><b>Wong Amat</b>
              <span class="vibes">
                <span class="vibe vibe--luxury">Luxury</span>
                <span class="vibe vibe--beach">Beach</span>
                <span class="vibe vibe--quiet">Quiet</span>
              </span>
            </span>
          </a>
          <a class="ar-legend__row" href="#walking-street">
            <span class="ar-legend__dot d-walking" aria-hidden="true"></span>
            <span class="ar-legend__txt"><b>Walking Street</b>
              <span class="vibes">
                <span class="vibe vibe--nightlife">Nightlife</span>
                <span class="vibe vibe--backpacker">Backpacker</span>
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ===================== 3 · DISTRICT CARDS ===================== -->
  <section aria-labelledby="districts-title">
    <div class="container">
      <div class="sec-head">
        <span class="kicker">The districts</span>
        <h2 id="districts-title">Six neighborhoods, honestly compared</h2>
        <p>An orientation card for each — who it suits, the numbers at a glance, and a few real spots to anchor your bearings.</p>
      </div>

      <div class="ar-districts">

        <!-- ===== Central Pattaya ===== -->
        <article class="area-card" id="central">
          <div class="area-card__media">
            <span class="area-card__num" aria-hidden="true">1</span>
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-city-beach-2.webp"
                 alt="Central Pattaya beachfront with the city skyline and Beach Road behind the sand"
                 loading="lazy" width="800" height="680">
          </div>
          <div class="area-card__body">
            <span class="area-card__best"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-near-me"></use></svg>Best for first-timers who want everything walkable</span>
            <h3>Central Pattaya</h3>
            <div class="area-card__vibes">
              <span class="vibe vibe--nightlife">Nightlife</span>
              <span class="vibe vibe--foodie">Foodie</span>
              <span class="vibe vibe--backpacker">Backpacker</span>
            </div>
            <div class="area-card__stats">
              <div class="ministat"><b>120+</b><span>restaurants</span></div>
              <div class="ministat"><b>40+</b><span>things to do</span></div>
              <div class="ministat"><b>2 min</b><span>walk to beach</span></div>
            </div>
            <p class="area-card__desc">The buzzy heart of the city: Central Festival mall, Beach Road, and a tangle of sois packed with restaurants and bars. It is the most convenient base if you want shopping, food and nightlife within a short walk — but expect traffic, crowds and noise that runs late.</p>
            <ul class="area-card__spots">
              <li class="lbl">Top spots here</li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/nitan-coffee-pattaya.webp" alt="The Coffee Club Central storefront" loading="lazy" width="44" height="44">
                <span><span class="spot__name">The Coffee Club Central</span><span class="spot__type">All-day café</span></span>
              </li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/best-restaurants-pattaya.jpg" alt="Hard Rock Cafe Pattaya interior" loading="lazy" width="44" height="44">
                <span><span class="spot__name">Hard Rock Cafe Pattaya</span><span class="spot__type">Bar &amp; grill</span></span>
              </li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/best-restaurants-pattaya.jpg" alt="Indiagate Restaurant dining area" loading="lazy" width="44" height="44">
                <span><span class="spot__name">Indiagate Restaurant</span><span class="spot__type">Indian dining</span></span>
              </li>
            </ul>
            <div class="area-card__cta">
              <a class="btn btn--primary" href="#">Explore Central<svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></a>
              <a class="btn btn--secondary" href="#"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-map"></use></svg>See on map</a>
            </div>
          </div>
        </article>

        <!-- ===== Jomtien ===== -->
        <article class="area-card flip" id="jomtien">
          <div class="area-card__media">
            <span class="area-card__num" aria-hidden="true">2</span>
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/best-island-pattaya.jpg"
                 alt="The long, calm Jomtien beach stretching south with palm trees and quiet sand"
                 loading="lazy" width="800" height="680">
          </div>
          <div class="area-card__body">
            <span class="area-card__best"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-beach"></use></svg>Best for families and long-stay beach days</span>
            <h3>Jomtien</h3>
            <div class="area-card__vibes">
              <span class="vibe vibe--beach">Beach</span>
              <span class="vibe vibe--family">Family</span>
              <span class="vibe vibe--quiet">Quiet</span>
            </div>
            <div class="area-card__stats">
              <div class="ministat"><b>80+</b><span>restaurants</span></div>
              <div class="ministat"><b>25+</b><span>things to do</span></div>
              <div class="ministat"><b>1 min</b><span>walk to beach</span></div>
            </div>
            <p class="area-card__desc">A long, relaxed beach just south of the headland, with a wide promenade and a more residential, family-friendly feel. Popular with long-stayers and digital nomads who want sea air without Walking Street energy. You will rely on a baht-bus or scooter to reach the city centre.</p>
            <ul class="area-card__spots">
              <li class="lbl">Top spots here</li>
              <li class="spot">
                <span class="spot__pin" aria-hidden="true"><svg class="pg-icon is-20 is-ocean"><use href="#pg-pin"></use></svg></span>
                <span><span class="spot__name">Skoop Beach Café</span><span class="spot__type">Beachfront café</span></span>
              </li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-night-clubs-1.jpg" alt="Jomtien Sauna and Gym fitness floor" loading="lazy" width="44" height="44">
                <span><span class="spot__name">Jomtien Sauna &amp; Gym</span><span class="spot__type">Gym &amp; sauna</span></span>
              </li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-night-clubs-1.jpg" alt="Rage Fight Academy training gym" loading="lazy" width="44" height="44">
                <span><span class="spot__name">Rage Fight Academy</span><span class="spot__type">Muay Thai &amp; fitness</span></span>
              </li>
            </ul>
            <div class="area-card__cta">
              <a class="btn btn--primary" href="#">Explore Jomtien<svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></a>
              <a class="btn btn--secondary" href="#"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-map"></use></svg>See on map</a>
            </div>
          </div>
        </article>

        <!-- ===== Naklua ===== -->
        <article class="area-card" id="naklua">
          <div class="area-card__media">
            <span class="area-card__num" aria-hidden="true">3</span>
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/SanctuaryofTruth.jpg"
                 alt="The all-teak Sanctuary of Truth temple on the Naklua headland"
                 loading="lazy" width="800" height="680">
          </div>
          <div class="area-card__body">
            <span class="area-card__best"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-eat"></use></svg>Best for a calmer, more local stay near good seafood</span>
            <h3>Naklua</h3>
            <div class="area-card__vibes">
              <span class="vibe vibe--local">Local</span>
              <span class="vibe vibe--quiet">Quiet</span>
              <span class="vibe vibe--foodie">Foodie</span>
            </div>
            <div class="area-card__stats">
              <div class="ministat"><b>60+</b><span>restaurants</span></div>
              <div class="ministat"><b>15+</b><span>things to do</span></div>
              <div class="ministat"><b>6 min</b><span>walk to beach</span></div>
            </div>
            <p class="area-card__desc">Pattaya's old town to the north — a working fishing-port neighborhood with the wholesale seafood market, Thai-Chinese shophouses and the Sanctuary of Truth. Quieter and more authentic than the centre, with fewer tourist bars. Great value if you want a local rhythm and don't mind a short ride into the action.</p>
            <ul class="area-card__spots">
              <li class="lbl">Top spots here</li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-massage-1.jpeg" alt="Yunomori Onsen and Spa indoor onsen pool" loading="lazy" width="44" height="44">
                <span><span class="spot__name">Yunomori Onsen &amp; Spa</span><span class="spot__type">Onsen &amp; spa</span></span>
              </li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-wellness-1.jpeg" alt="The Sea.Spa reception" loading="lazy" width="44" height="44">
                <span><span class="spot__name">The Sea.Spa</span><span class="spot__type">Day spa</span></span>
              </li>
              <li class="spot">
                <span class="spot__pin" aria-hidden="true"><svg class="pg-icon is-20 is-ocean"><use href="#pg-pin"></use></svg></span>
                <span><span class="spot__name">Sanctuary of Truth</span><span class="spot__type">Landmark</span></span>
              </li>
            </ul>
            <div class="area-card__cta">
              <a class="btn btn--primary" href="#">Explore Naklua<svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></a>
              <a class="btn btn--secondary" href="#"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-map"></use></svg>See on map</a>
            </div>
          </div>
        </article>

        <!-- ===== Pratumnak Hill ===== -->
        <article class="area-card flip" id="pratumnak">
          <div class="area-card__media">
            <span class="area-card__num" aria-hidden="true">4</span>
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-buddhist-pagoda-golden.jpg"
                 alt="The golden Big Buddha hilltop temple on Pratumnak Hill above Pattaya"
                 loading="lazy" width="800" height="680">
          </div>
          <div class="area-card__body">
            <span class="area-card__best"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-attractions"></use></svg>Best for upscale calm with viewpoints between the two beaches</span>
            <h3>Pratumnak Hill</h3>
            <div class="area-card__vibes">
              <span class="vibe vibe--quiet">Quiet</span>
              <span class="vibe vibe--luxury">Luxury</span>
              <span class="vibe vibe--beach">Beach</span>
            </div>
            <div class="area-card__stats">
              <div class="ministat"><b>45+</b><span>restaurants</span></div>
              <div class="ministat"><b>12+</b><span>things to do</span></div>
              <div class="ministat"><b>8 min</b><span>walk to beach</span></div>
            </div>
            <p class="area-card__desc">"The hill" sits between Pattaya and Jomtien — leafy, residential and noticeably calmer, with the Big Buddha, Pattaya Viewpoint and small coves like Cosy Beach. A favourite of couples and repeat visitors who want hotels and condos with a bit of luxury and quiet, while staying minutes from both beaches by scooter.</p>
            <ul class="area-card__spots">
              <li class="lbl">Top spots here</li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/nitan-coffee-pattaya.webp" alt="La Baguette Phra Tamnak storefront" loading="lazy" width="44" height="44">
                <span><span class="spot__name">La Baguette Phra Tamnak</span><span class="spot__type">Bakery café</span></span>
              </li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/nitan-coffee-pattaya.webp" alt="King of Coffee Pratumnak drink menu board" loading="lazy" width="44" height="44">
                <span><span class="spot__name">King of Coffee Pratumnak</span><span class="spot__type">Coffee roaster</span></span>
              </li>
              <li class="spot">
                <span class="spot__pin" aria-hidden="true"><svg class="pg-icon is-20 is-ocean"><use href="#pg-pin"></use></svg></span>
                <span><span class="spot__name">Pattaya View Point</span><span class="spot__type">Viewpoint</span></span>
              </li>
            </ul>
            <div class="area-card__cta">
              <a class="btn btn--primary" href="#">Explore Pratumnak<svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></a>
              <a class="btn btn--secondary" href="#"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-map"></use></svg>See on map</a>
            </div>
          </div>
        </article>

        <!-- ===== Wong Amat ===== -->
        <article class="area-card" id="wong-amat">
          <div class="area-card__media">
            <span class="area-card__num" aria-hidden="true">5</span>
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/Coral-Island-pattaya.jpg"
                 alt="The calm, upscale Wong Amat beach in north Pattaya with clear water and resorts"
                 loading="lazy" width="800" height="680">
          </div>
          <div class="area-card__body">
            <span class="area-card__best"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-wellness"></use></svg>Best for a quiet, resort-style beach escape</span>
            <h3>Wong Amat</h3>
            <div class="area-card__vibes">
              <span class="vibe vibe--luxury">Luxury</span>
              <span class="vibe vibe--beach">Beach</span>
              <span class="vibe vibe--quiet">Quiet</span>
            </div>
            <div class="area-card__stats">
              <div class="ministat"><b>35+</b><span>restaurants</span></div>
              <div class="ministat"><b>10+</b><span>things to do</span></div>
              <div class="ministat"><b>1 min</b><span>walk to beach</span></div>
            </div>
            <p class="area-card__desc">A boutique stretch of beach at the northern end, lined with upscale resorts and condos. The water is cleaner and the sand quieter than the main bay — this is where you base yourself for a calmer, more polished trip and don't mind taking a baht-bus into town for the action.</p>
            <ul class="area-card__spots">
              <li class="lbl">Top spots here</li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-wellness-1.jpeg" alt="The Sea.Spa reception" loading="lazy" width="44" height="44">
                <span><span class="spot__name">The Sea.Spa</span><span class="spot__type">Day spa</span></span>
              </li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-wellness-1.jpeg" alt="Makkha Health and Spa interior detail" loading="lazy" width="44" height="44">
                <span><span class="spot__name">Makkha Health &amp; Spa</span><span class="spot__type">Wellness spa</span></span>
              </li>
              <li class="spot">
                <span class="spot__pin" aria-hidden="true"><svg class="pg-icon is-20 is-ocean"><use href="#pg-anchor"></use></svg></span>
                <span><span class="spot__name">Wong Amat Beach</span><span class="spot__type">Boutique beach</span></span>
              </li>
            </ul>
            <div class="area-card__cta">
              <a class="btn btn--primary" href="#">Explore Wong Amat<svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></a>
              <a class="btn btn--secondary" href="#"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-map"></use></svg>See on map</a>
            </div>
          </div>
        </article>

        <!-- ===== Walking Street ===== -->
        <article class="area-card flip" id="walking-street">
          <div class="area-card__media">
            <span class="area-card__num" aria-hidden="true">6</span>
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-night-clubs-1.jpg"
                 alt="Neon-lit Walking Street at night, packed with bars and clubs"
                 loading="lazy" width="800" height="680">
          </div>
          <div class="area-card__body">
            <span class="area-card__best"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-nightlife"></use></svg>Best for the full-throttle, late-night nightlife strip</span>
            <h3>Walking Street</h3>
            <div class="area-card__vibes">
              <span class="vibe vibe--nightlife">Nightlife</span>
              <span class="vibe vibe--backpacker">Backpacker</span>
            </div>
            <div class="area-card__stats">
              <div class="ministat"><b>90+</b><span>bars &amp; clubs</span></div>
              <div class="ministat"><b>30+</b><span>things to do</span></div>
              <div class="ministat"><b>3 min</b><span>walk to beach</span></div>
            </div>
            <p class="area-card__desc">The famous pedestrian strip at the south end of the bay — neon, clubs, live music and go-go bars from late evening until dawn. Electric to experience, but loud and pricey: most people visit Walking Street rather than sleep on it, and base themselves a few sois back for a quieter night.</p>
            <ul class="area-card__spots">
              <li class="lbl">Top spots here</li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-night-clubs-1.jpg" alt="Lucifer club bar and dance floor" loading="lazy" width="44" height="44">
                <span><span class="spot__name">Lucifer</span><span class="spot__type">Nightclub</span></span>
              </li>
              <li class="spot">
                <span class="spot__pin" aria-hidden="true"><svg class="pg-icon is-20 is-ocean"><use href="#pg-pin"></use></svg></span>
                <span><span class="spot__name">Hollywood Pattaya</span><span class="spot__type">Disco &amp; live</span></span>
              </li>
              <li class="spot">
                <img class="spot__thumb" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-night-clubs-1.jpg" alt="808 Night Club bar area" loading="lazy" width="44" height="44">
                <span><span class="spot__name">808 Night Club</span><span class="spot__type">Nightclub</span></span>
              </li>
            </ul>
            <div class="area-card__cta">
              <a class="btn btn--primary" href="#">Explore Walking Street<svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></a>
              <a class="btn btn--secondary" href="#"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-map"></use></svg>See on map</a>
            </div>
          </div>
        </article>

      </div>
    </div>
  </section>

  <!-- ===================== 4 · COMPARE DISTRICTS ===================== -->
  <section class="bg-sunken" aria-labelledby="compare-title">
    <div class="container">
      <div class="sec-head">
        <span class="kicker">At a glance</span>
        <h2 id="compare-title">Compare the six districts</h2>
        <p>Scan it side by side. Dots show relative strength for beach and nightlife — more filled, more of it.</p>
      </div>

      <div class="compare-wrap">
        <table class="compare">
          <caption class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Comparison of Pattaya districts by vibe, who they suit, beach quality, nightlife and budget.</caption>
          <thead>
            <tr>
              <th scope="col">District</th>
              <th scope="col">Vibe</th>
              <th scope="col">Best for</th>
              <th scope="col">Beach</th>
              <th scope="col">Nightlife</th>
              <th scope="col">Budget</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><a href="#central" style="color:var(--ocean)">Central Pattaya</a></th>
              <td><span class="vibe vibe--nightlife">Nightlife</span></td>
              <td>First-timers, all-in-one</td>
              <td><span class="meter is-beach" aria-hidden="true"><i class="on"></i><i class="on"></i><i></i></span><span class="meter-lbl">Busy city beach</span></td>
              <td><span class="meter is-night" aria-hidden="true"><i class="on"></i><i class="on"></i><i class="on"></i></span><span class="meter-lbl">High</span></td>
              <td><span class="pill pill--blue">Mid</span></td>
            </tr>
            <tr>
              <th scope="row"><a href="#jomtien" style="color:var(--ocean)">Jomtien</a></th>
              <td><span class="vibe vibe--beach">Beach</span></td>
              <td>Families, long-stayers</td>
              <td><span class="meter is-beach" aria-hidden="true"><i class="on"></i><i class="on"></i><i class="on"></i></span><span class="meter-lbl">Long &amp; relaxed</span></td>
              <td><span class="meter is-night" aria-hidden="true"><i class="on"></i><i></i><i></i></span><span class="meter-lbl">Low-key</span></td>
              <td><span class="pill pill--success">Value</span></td>
            </tr>
            <tr>
              <th scope="row"><a href="#naklua" style="color:var(--ocean)">Naklua</a></th>
              <td><span class="vibe vibe--local">Local</span></td>
              <td>Authentic, seafood</td>
              <td><span class="meter is-beach" aria-hidden="true"><i class="on"></i><i></i><i></i></span><span class="meter-lbl">Small &amp; quiet</span></td>
              <td><span class="meter is-night" aria-hidden="true"><i class="on"></i><i></i><i></i></span><span class="meter-lbl">Local bars</span></td>
              <td><span class="pill pill--success">Value</span></td>
            </tr>
            <tr>
              <th scope="row"><a href="#pratumnak" style="color:var(--ocean)">Pratumnak Hill</a></th>
              <td><span class="vibe vibe--luxury">Luxury</span></td>
              <td>Couples, upscale calm</td>
              <td><span class="meter is-beach" aria-hidden="true"><i class="on"></i><i class="on"></i><i></i></span><span class="meter-lbl">Quiet coves</span></td>
              <td><span class="meter is-night" aria-hidden="true"><i class="on"></i><i></i><i></i></span><span class="meter-lbl">Minimal</span></td>
              <td><span class="pill pill--navy">Higher</span></td>
            </tr>
            <tr>
              <th scope="row"><a href="#wong-amat" style="color:var(--ocean)">Wong Amat</a></th>
              <td><span class="vibe vibe--luxury">Luxury</span></td>
              <td>Resort-style escape</td>
              <td><span class="meter is-beach" aria-hidden="true"><i class="on"></i><i class="on"></i><i class="on"></i></span><span class="meter-lbl">Cleanest sand</span></td>
              <td><span class="meter is-night" aria-hidden="true"><i class="on"></i><i></i><i></i></span><span class="meter-lbl">Resort bars</span></td>
              <td><span class="pill pill--navy">Higher</span></td>
            </tr>
            <tr>
              <th scope="row"><a href="#walking-street" style="color:var(--ocean)">Walking Street</a></th>
              <td><span class="vibe vibe--nightlife">Nightlife</span></td>
              <td>Full-on nightlife</td>
              <td><span class="meter is-beach" aria-hidden="true"><i class="on"></i><i></i><i></i></span><span class="meter-lbl">Near, not for it</span></td>
              <td><span class="meter is-night" aria-hidden="true"><i class="on"></i><i class="on"></i><i class="on"></i></span><span class="meter-lbl">Highest</span></td>
              <td><span class="pill pill--warn">Pricey at night</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ===================== 5 · WHICH AREA IS RIGHT FOR YOU? ===================== -->
  <section aria-labelledby="persona-title">
    <div class="container">
      <div class="sec-head">
        <span class="kicker">Quick match</span>
        <h2 id="persona-title">Which area is right for you?</h2>
        <p>Pick the traveller that sounds most like you for a one-line recommendation.</p>
      </div>

      <div class="persona">
        <div class="persona__chips" role="tablist" aria-label="Choose your traveller type">
          <button class="chip active" role="tab" aria-selected="true" aria-controls="persona-panel" data-persona="first">First-timer</button>
          <button class="chip" role="tab" aria-selected="false" aria-controls="persona-panel" data-persona="night">Nightlife</button>
          <button class="chip" role="tab" aria-selected="false" aria-controls="persona-panel" data-persona="family">Family</button>
          <button class="chip" role="tab" aria-selected="false" aria-controls="persona-panel" data-persona="nomad">Digital nomad</button>
          <button class="chip" role="tab" aria-selected="false" aria-controls="persona-panel" data-persona="quiet">Quiet escape</button>
        </div>

        <div class="persona__panel" id="persona-panel" role="tabpanel" aria-live="polite">
          <span class="ic" aria-hidden="true"><svg class="pg-icon is-28 is-ocean" id="persona-ic"><use href="#pg-near-me"></use></svg></span>
          <div>
            <b id="persona-head">Base yourself in Central Pattaya</b>
            <p id="persona-body">Everything — beach, malls, food and nightlife — is walkable, and it's the easiest place to find your feet. <a href="#central">See Central →</a></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===================== 6 · LOCAL TIP ===================== -->
  <section class="bg-sunken" aria-labelledby="tip-title">
    <div class="container">
      <div class="sec-head" style="margin-bottom:var(--s4)">
        <span class="kicker">Good to know</span>
        <h2 id="tip-title">Getting around the bay</h2>
      </div>
      <div class="ar-tip">
        <div class="alert alert--info">
          <svg class="pg-icon is-24" aria-hidden="true" style="color:var(--steel)"><use href="#pg-songthaew"></use></svg>
          <div>
            <b>The blue songthaews (baht-buses) are how locals move.</b> They loop a fixed route along Beach Road and Second Road for a flat 10–20 baht — just hop on, then press the buzzer to get off. Don't tell the driver a destination first or it becomes a private "taxi" charter at many times the price. To reach Jomtien or Naklua you usually change buses, or take a scooter for door-to-door.
          </div>
        </div>
        <p class="ar-tip__local">
          <svg class="pg-icon is-20 is-ocean" aria-hidden="true"><use href="#pg-local-verified"></use></svg>
          Locally verified · checked on the ground by the Pattaya Guide team
        </p>
      </div>
    </div>
  </section>

</div>
`

const SCRIPT = String.raw`
(function () {
  "use strict";
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Quick-jump chips: smooth scroll + brief highlight ---- */
  var jumpLinks = document.querySelectorAll('.ar-jump a[href^="#"], .ar-legend__row[href^="#"], .compare a[href^="#"], .persona__panel a[href^="#"]');
  jumpLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      // accessible focus without re-scrolling
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  /* ---- Persona quick-match: chip -> note reveal ---- */
  var DATA = {
    first: { ic: 'pg-near-me',  head: 'Base yourself in Central Pattaya',
             body: "Everything — beach, malls, food and nightlife — is walkable, and it's the easiest place to find your feet. ",
             link: '#central', linkLabel: 'See Central →' },
    night: { ic: 'pg-nightlife', head: 'Stay near Walking Street (a few sois back)',
             body: 'You want the strip on your doorstep — but sleep one street back so the music ends when you do. ',
             link: '#walking-street', linkLabel: 'See Walking Street →' },
    family:{ ic: 'pg-family',   head: 'Jomtien is the family pick',
             body: 'A long, calm beach, a wide promenade and a residential feel — easy days with kids, away from the bar scene. ',
             link: '#jomtien', linkLabel: 'See Jomtien →' },
    nomad: { ic: 'pg-coffee',   head: 'Jomtien or Pratumnak suit nomads',
             body: 'Long-stay condos, cafés and gyms with sea air, while staying a short ride from the centre when you need it. ',
             link: '#jomtien', linkLabel: 'See Jomtien →' },
    quiet: { ic: 'pg-wellness', head: 'Go north to Wong Amat or up Pratumnak Hill',
             body: 'Cleaner sand, upscale resorts and far less noise — the calmest bases in the bay. ',
             link: '#wong-amat', linkLabel: 'See Wong Amat →' }
  };
  var chips = document.querySelectorAll('.persona__chips .chip');
  var icUse = document.querySelector('#persona-ic use');
  var head  = document.getElementById('persona-head');
  var body  = document.getElementById('persona-body');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); c.setAttribute('aria-selected', 'false'); });
      chip.classList.add('active'); chip.setAttribute('aria-selected', 'true');
      var d = DATA[chip.getAttribute('data-persona')];
      if (!d) return;
      icUse.setAttribute('href', '#' + d.ic);
      head.textContent = d.head;
      body.innerHTML = d.body + '<a href="' + d.link + '">' + d.linkLabel + '</a>';
      // re-wire the new link for smooth scroll
      var newLink = body.querySelector('a[href^="#"]');
      if (newLink) newLink.addEventListener('click', function (e) {
        var t = document.querySelector(newLink.getAttribute('href'));
        if (!t) return; e.preventDefault();
        t.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });
      });
    });
  });
})();
`

export default function AreasPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
      <BlogScript script={SCRIPT} />
    </>
  )
}
