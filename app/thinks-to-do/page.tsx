import './ttd.css'
import BlogScript from '@/app/components/BlogScript'

export const metadata = {
  title: 'Things to Do in Pattaya — Tours, Islands, Diving & Adventure | Go To Pattaya',
  description: 'Browse the best things to do in Pattaya: island day trips, scuba diving, jet ski & water sports, temples, skydiving and bike rentals. A curated adventure catalog.',
  alternates: { canonical: '/thinks-to-do' },
}

const HTML = String.raw`<!-- ===== Hidden inline icon sprite (only the symbols used on this page) ===== -->
<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
<symbol id="pg-tours" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15.8 8.2 13.5 13.5 8.2 15.8 10.5 10.5z"/></symbol>
<symbol id="pg-islands" viewBox="0 0 24 24"><path d="M6.5 19a5.5 5.5 0 0 1 11 0"/><path d="M13 19c0-3 .3-5.6 1-7.6"/><path d="M14 11.4c-1.6-1.6-3.9-2.2-5.9-1.6"/><path d="M14 11.4c1.6-1.6 3.9-2.2 5.9-1.6"/><path d="M14 11.4c-2.2-.8-4.7-.3-6.1 1.2"/><path d="M14 11.4c2.2-.8 4.7-.3 6.1 1.2"/><path d="M3 21c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0"/></symbol>
<symbol id="pg-beach" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 16 0z"/><path d="M12 4v14"/><path d="M12 4c-2.4 1.4-3.9 4.4-3.9 8"/><path d="M12 4c2.4 1.4 3.9 4.4 3.9 8"/><path d="M9 21c1-1.2 2-1.2 3 0s2 1.2 3 0"/></symbol>
<symbol id="pg-attractions" viewBox="0 0 24 24"><path d="M3.5 9 12 4l8.5 5"/><path d="M5 9h14"/><path d="M5.5 9v9"/><path d="M9.5 9v9"/><path d="M14.5 9v9"/><path d="M18.5 9v9"/><path d="M4 18h16"/><path d="M3 21h18"/></symbol>
<symbol id="pg-diving" viewBox="0 0 24 24"><path d="M4 8h16a1.5 1.5 0 0 1 1.5 1.5V12a3.5 3.5 0 0 1-3.5 3.5h-1.6a2 2 0 0 1-1.9-1.3 1.6 1.6 0 0 0-3 0A2 2 0 0 1 7.6 15.5H6A3.5 3.5 0 0 1 2.5 12V9.5A1.5 1.5 0 0 1 4 8z"/><path d="M18 8V5.6a2 2 0 0 1 2-2"/></symbol>
<symbol id="pg-water-sports" viewBox="0 0 24 24"><path d="M3 7q2.5-3 5 0t5 0t5 0"/><path d="M3 12q2.5-3 5 0t5 0t5 0"/><path d="M3 17q2.5-3 5 0t5 0t5 0"/></symbol>
<symbol id="pg-transport" viewBox="0 0 24 24"><circle cx="6" cy="17.5" r="2.5"/><circle cx="18" cy="17.5" r="2.5"/><path d="M6 17.5 8.5 11H13"/><path d="M8 11h6"/><path d="M13.5 11 16 6.5h3"/><path d="M16 6.5 18 15"/><path d="M8.5 17.5h7"/></symbol>
<symbol id="pg-ferry" viewBox="0 0 24 24"><path d="M4 14h16l-2 4H6z"/><path d="M7 14v-4h7l2 4"/><path d="M9.5 11.5h3"/><path d="M10 10V7.5"/><path d="M3 20.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0"/></symbol>
<symbol id="pg-anchor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.5"/><path d="M12 7.5v13"/><path d="M5 13a7 7 0 0 0 14 0"/><path d="M5 13H3"/><path d="M19 13h2"/><path d="M9 9.5h6"/></symbol>
<symbol id="pg-route" viewBox="0 0 24 24"><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="5.5" r="2.5"/><path d="M9 18.5h6a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7"/></symbol>
<symbol id="pg-near-me" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></symbol>
<symbol id="pg-pin" viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></symbol>
<symbol id="pg-map" viewBox="0 0 24 24"><path d="m9 4-6 2.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z"/><path d="M9 4v13"/><path d="M15 6.5v13"/></symbol>
<symbol id="pg-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></symbol>
<symbol id="pg-calendar" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v4"/><path d="M16 3v4"/></symbol>
<symbol id="pg-star" viewBox="0 0 24 24"><path d="M12 2.6 14.85 8.4 21.2 9.3l-4.6 4.4 1.1 6.3L12 17.4 6.3 20l1.1-6.3-4.6-4.4 6.35-.9z"/></symbol>
<symbol id="pg-ticket" viewBox="0 0 24 24"><path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v2a2 2 0 0 0 0 4v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 15.5v-2a2 2 0 0 0 0-4z"/><path d="M14 6.5v11" stroke-dasharray="1.6 2"/></symbol>
<symbol id="pg-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.3"/><path d="M12 2v2.4"/><path d="M12 19.6V22"/><path d="m4.4 4.4 1.7 1.7"/><path d="m17.9 17.9 1.7 1.7"/><path d="M2 12h2.4"/><path d="M19.6 12H22"/><path d="m4.4 19.6 1.7-1.7"/><path d="m17.9 6.1 1.7-1.7"/></symbol>
<symbol id="pg-sunset" viewBox="0 0 24 24"><path d="M7 18a5 5 0 0 1 10 0"/><path d="M3 18h2.5"/><path d="M18.5 18H21"/><path d="M12 3v6"/><path d="m9 6.2 3 3 3-3"/><path d="m4.6 12.6 1.6 1.2"/><path d="m19.4 12.6-1.6 1.2"/></symbol>
<symbol id="pg-moon" viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/><path d="m17 5 .6 1.5L19 7l-1.4.5L17 9l-.6-1.5L15 7l1.4-.5z" fill="currentColor" stroke="none"/></symbol>
<symbol id="pg-heart" viewBox="0 0 24 24"><path d="M12 20.3 4.6 12.9a4.7 4.7 0 0 1 6.6-6.6l.8.8.8-.8a4.7 4.7 0 0 1 6.6 6.6z"/></symbol>
<symbol id="pg-share" viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6"/><path d="m8.2 13.2 7.6 3.6"/></symbol>
<symbol id="pg-filter" viewBox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4-2v-4z"/></symbol>
<symbol id="pg-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></symbol>
<symbol id="pg-chevron-right" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
<symbol id="pg-chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
<symbol id="pg-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></symbol>
<symbol id="pg-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7"/></symbol>
<symbol id="pg-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".8" fill="currentColor" stroke="none"/></symbol>
<symbol id="pg-warning" viewBox="0 0 24 24"><path d="M12 4 2.7 20a1 1 0 0 0 .9 1.5h16.8a1 1 0 0 0 .9-1.5z"/><path d="M12 9.5v4.5"/><circle cx="12" cy="17.5" r=".7" fill="currentColor" stroke="none"/></symbol>
<symbol id="pg-kids" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.2"/><path d="M12 7.2v6.5"/><path d="M8.5 9.5h7"/><path d="m9 20 3-6 3 6"/></symbol>
<symbol id="pg-family" viewBox="0 0 24 24"><circle cx="8" cy="6" r="2.5"/><path d="M3.5 20v-3.5a4.5 4.5 0 0 1 9 0V20"/><circle cx="16.5" cy="8" r="1.8"/><path d="M14 20v-3a3 3 0 0 1 6 0v3"/></symbol>
<symbol id="pg-car" viewBox="0 0 24 24"><path d="M3 16v-3.3a2 2 0 0 1 1.4-1.9L6 10.3l1.7-3.5A2 2 0 0 1 9.5 5.6h5a2 2 0 0 1 1.8 1.2L18 10.3l1.6.5A2 2 0 0 1 21 12.7V16"/><path d="M3 16h2"/><path d="M9.5 16h5"/><path d="M19 16h2"/><circle cx="7.5" cy="16.8" r="1.8"/><circle cx="16.5" cy="16.8" r="1.8"/></symbol>
<symbol id="pg-local-verified" viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><path d="m9.2 9.9 2 2 3.6-3.8"/></symbol>
<symbol id="pg-close" viewBox="0 0 24 24"><path d="M6 6 18 18"/><path d="M18 6 6 18"/></symbol>
<symbol id="pg-scam-alert" viewBox="0 0 24 24"><path d="M12 3 5 6v6c0 4 3 6.6 7 8 4-1.4 7-4 7-8V6z"/><path d="m9.8 9.8 4.4 4.4"/><path d="m14.2 9.8-4.4 4.4"/></symbol>
</svg>

<div class="ttd-page">

  <!-- ============================================================ 1 · HERO -->
  <section class="ttd-hero" aria-labelledby="ttd-hero-title">
    <img class="ttd-hero__img"
         src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-parasiling.webp"
         alt="Parasailing high above the turquoise sea off Pattaya beach on a bright sunny day"
         width="1600" height="900" fetchpriority="high">
    <div class="ttd-hero__scrim" aria-hidden="true"></div>
    <div class="ttd-hero__inner">
      <div class="container">
        <nav class="crumb" aria-label="Breadcrumb" style="color:rgba(255,255,255,.78);margin-bottom:var(--s3)">
          <a href="/" style="color:var(--lagoon)">Home</a>
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg>
          <span class="cur" style="color:#fff">Things to Do</span>
        </nav>
        <span class="kicker">Things to Do</span>
        <h1 id="ttd-hero-title">Your Pattaya Adventure Starts Here</h1>
        <p class="ttd-hero__lead">Speedboats to coral islands, scuba dives, jet skis, jungle ATV trails, golden temples and skydives over the bay — browse real, locally-checked experiences and build the day you want.</p>

        <div class="ttd-hero__pills" role="list" aria-label="Browse by interest">
          <span class="pill pill--ghost" role="listitem"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-tours"></use></svg> Adventure</span>
          <span class="pill pill--ghost" role="listitem"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-water-sports"></use></svg> Water</span>
          <span class="pill pill--ghost" role="listitem"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-attractions"></use></svg> Culture</span>
          <span class="pill pill--ghost" role="listitem"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-family"></use></svg> Family</span>
          <span class="pill pill--ghost" role="listitem"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-islands"></use></svg> Nature</span>
        </div>

        <form class="search" role="search" onsubmit="return false">
          <svg class="pg-icon is-20 is-muted" aria-hidden="true"><use href="#pg-search"></use></svg>
          <input type="search" id="ttd-hero-search" name="q" placeholder="Search tours, islands, dive trips…" aria-label="Search tours, islands and dive trips">
          <button type="submit" class="go" aria-label="Search">
            <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-arrow-right"></use></svg>
          </button>
        </form>

        <div class="ttd-hero__stats" role="list" aria-label="Catalog at a glance">
          <div class="ttd-hero__stat" role="listitem"><b>179+</b><span>experiences listed</span></div>
          <div class="ttd-hero__stat" role="listitem"><b>14</b><span>islands &amp; beaches</span></div>
          <div class="ttd-hero__stat" role="listitem"><b>4.6</b><span>average rating</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================================================ 2 · CATEGORY MEDALLIONS -->
  <section class="ttd-sec" aria-labelledby="ttd-cat-title">
    <div class="container">
      <div class="ttd-head">
        <span class="kicker">Browse by category</span>
        <h2 id="ttd-cat-title">What kind of day are you after?</h2>
        <p>Tap a category to jump straight into the matching experiences below.</p>
      </div>
      <div class="exp-tiles">
        <button class="exp-tile" type="button" data-jump="tours" aria-label="Tours and day trips, 83 listings">
          <span class="exp-tile__med exp-tile__med--tours" aria-hidden="true"><svg class="pg-icon is-32" aria-hidden="true"><use href="#pg-tours"></use></svg></span>
          <b>Tours &amp; Day Trips</b><span>83 experiences</span>
        </button>
        <button class="exp-tile" type="button" data-jump="islands" aria-label="Islands and beaches, 14 listings">
          <span class="exp-tile__med exp-tile__med--islands" aria-hidden="true"><svg class="pg-icon is-32" aria-hidden="true"><use href="#pg-islands"></use></svg></span>
          <b>Islands &amp; Beaches</b><span>14 spots</span>
        </button>
        <button class="exp-tile" type="button" data-jump="culture" aria-label="Temples and culture, 19 listings">
          <span class="exp-tile__med exp-tile__med--culture" aria-hidden="true"><svg class="pg-icon is-32" aria-hidden="true"><use href="#pg-attractions"></use></svg></span>
          <b>Temples &amp; Culture</b><span>19 sites</span>
        </button>
        <button class="exp-tile" type="button" data-jump="diving" aria-label="Diving and snorkeling, 12 listings">
          <span class="exp-tile__med exp-tile__med--diving" aria-hidden="true"><svg class="pg-icon is-32" aria-hidden="true"><use href="#pg-diving"></use></svg></span>
          <b>Diving &amp; Snorkeling</b><span>12 centres</span>
        </button>
        <button class="exp-tile" type="button" data-jump="adrenaline" aria-label="Skydiving and adrenaline, 21 listings">
          <span class="exp-tile__med exp-tile__med--adrenaline" aria-hidden="true"><svg class="pg-icon is-32" aria-hidden="true"><use href="#pg-water-sports"></use></svg></span>
          <b>Skydiving &amp; Adrenaline</b><span>21 thrills</span>
        </button>
        <button class="exp-tile" type="button" data-jump="rent" aria-label="Rent a bike or car, 30 listings">
          <span class="exp-tile__med exp-tile__med--rent" aria-hidden="true"><svg class="pg-icon is-32" aria-hidden="true"><use href="#pg-transport"></use></svg></span>
          <b>Rent a Bike / Car</b><span>30 rentals</span>
        </button>
      </div>
    </div>
  </section>

  <!-- =========================================== 3 · FILTER BAR + 4 · LISTING -->
  <section class="ttd-sec" id="experiences" aria-labelledby="ttd-list-title" style="padding-top:0">
    <div class="container">

      <div class="ttd-head">
        <span class="kicker">The full catalog</span>
        <h2 id="ttd-list-title">Pick your experience</h2>
        <p>Real, locally-checked operators. Prices are illustrative “from” guides per person — confirm on the day.</p>
      </div>

      <!-- FILTER BAR (sticky) -->
      <div class="ttd-filters" role="region" aria-label="Filter experiences">
        <div class="filterbar" role="group" aria-label="Filter by interest">
          <button class="chip" type="button" data-filter="all" aria-pressed="true">
            <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-filter"></use></svg> All experiences
          </button>
          <button class="chip" type="button" data-filter="tours" aria-pressed="false">
            <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-tours"></use></svg> Tours &amp; Day Trips
          </button>
          <button class="chip" type="button" data-filter="adrenaline" aria-pressed="false">
            <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-water-sports"></use></svg> Water &amp; Adrenaline
          </button>
          <button class="chip" type="button" data-filter="diving" aria-pressed="false">
            <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-diving"></use></svg> Diving &amp; Snorkel
          </button>
          <button class="chip" type="button" data-filter="culture" aria-pressed="false">
            <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-attractions"></use></svg> Temples &amp; Culture
          </button>
          <button class="chip" type="button" data-filter="rent" aria-pressed="false">
            <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-transport"></use></svg> Rent a Bike / Car
          </button>
          <button class="chip" type="button" data-filter="family" aria-pressed="false">
            <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-family"></use></svg> Family-friendly
          </button>
        </div>

        <div class="filterbar" role="group" aria-label="Filter by duration" style="margin-top:var(--s2)">
          <span class="ttd-filters__label" style="align-self:center">Duration</span>
          <button class="chip chip--sm" type="button" data-dur="any" aria-pressed="true">Any</button>
          <button class="chip chip--sm" type="button" data-dur="few" aria-pressed="false">Few hours</button>
          <button class="chip chip--sm" type="button" data-dur="half" aria-pressed="false">Half-day</button>
          <button class="chip chip--sm" type="button" data-dur="full" aria-pressed="false">Full-day</button>
        </div>
      </div>

      <p id="exp-count" class="stack-2" style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--s4)" aria-live="polite">Showing all 16 experiences</p>

      <!-- LISTING -->
      <div class="exp-grid" id="exp-grid">

        <!-- TOURS & DAY TRIPS -->
        <article class="exp-card" data-cat="tours family" data-dur="full">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-best-tours.jpg" alt="A rescued elephant being gently bathed in the river at an ethical sanctuary near Pattaya" width="400" height="500">
            <span class="exp-card__cat">Day Trip</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Pattaya Ethical Elephant Tour"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Pattaya Ethical Elephant Tour</h3>
            <p class="exp-card__blurb">Feed, walk and river-bathe rescued elephants at a no-riding sanctuary — gentle and genuinely kid-friendly.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Full-day · 6h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Living Green, Bang Lamung</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.9 <span class="count">(612)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿1,900 <span>/ person</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <article class="exp-card" data-cat="tours family" data-dur="full">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/Coral-Island-pattaya.jpg" alt="A guided sightseeing group on an island excursion boat trip from Pattaya" width="400" height="500">
            <span class="exp-card__cat">Guided Tour</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Bangkok Holiday Travels"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Bangkok Holiday Travels (DMC)</h3>
            <p class="exp-card__blurb">A full-service operator running island, city and countryside day trips with English-speaking guides and hotel pick-up.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Full-day · 8h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.5 <span class="count">(238)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿1,400 <span>/ person</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <article class="exp-card" data-cat="tours family" data-dur="half">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/coral-island-pattaya-2.jpg" alt="35 Group Pattaya island excursion boat with passengers on a sightseeing trip" width="400" height="500">
            <span class="exp-card__cat">Day Trip</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save 35 Group Pattaya"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>35 Group Pattaya</h3>
            <p class="exp-card__blurb">Private vans and small-group tours to Coral Island, floating markets and viewpoints — flexible and comfortable.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Half-day · 5h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Pratamnak area</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.4 <span class="count">(176)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿1,200 <span>/ person</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <article class="exp-card" data-cat="tours" data-dur="half">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-best-tours.jpg" alt="A Pattaya day-trip group setting off on a sightseeing tour" width="400" height="500">
            <span class="exp-card__cat">Guided Tour</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Tour And Travel"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Tour And Travel</h3>
            <p class="exp-card__blurb">Budget-friendly join-in tours covering the big Pattaya sights in a single half-day loop.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Half-day · 4h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Beach Road</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.2 <span class="count">(94)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿900 <span>/ person</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <article class="exp-card" data-cat="tours culture family" data-dur="few">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-city-beach-1.jpg" alt="The giant hillside Pattaya City letter sign overlooking the bay" width="400" height="500">
            <span class="exp-card__cat">Viewpoint</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Pattaya City Sign"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Pattaya City Sign &amp; Viewpoint</h3>
            <p class="exp-card__blurb">The Hollywood-style hillside sign and Pratamnak viewpoint — the classic free panorama over the whole bay.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Few hours · 1–2h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Pratamnak Hill</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.6 <span class="count">(2,103)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">Free <span>to visit</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <article class="exp-card" data-cat="culture tours" data-dur="few">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-night-clubs-1.jpg" alt="The neon-lit nightlife of Pattaya Walking Street after dark" width="400" height="500">
            <span class="exp-card__cat">Landmark</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Pattaya Walking Street"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Pattaya Walking Street</h3>
            <p class="exp-card__blurb">Pattaya's famous after-dark strip of bars, clubs and street food — best explored on foot from around 9pm.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Few hours · evening</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> South Pattaya</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.3 <span class="count">(5,401)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">Free <span>to walk</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <!-- WATER & ADRENALINE -->
        <article class="exp-card" data-cat="adrenaline tours family" data-dur="full">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/best-island-pattaya.jpg" alt="A catamaran with a water slide anchored off a Pattaya island for a day cruise" width="400" height="500">
            <span class="exp-card__cat">Boat Cruise</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Manta Marina Speedboat and Catamaran"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Manta Marina Speedboat &amp; Catamaran</h3>
            <p class="exp-card__blurb">Private speedboat and catamaran charters to the outer islands, with a swim deck, slide and snorkel stops.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Full-day · 7h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Ocean Marina</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.7 <span class="count">(318)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿2,500 <span>/ person</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <article class="exp-card" data-cat="adrenaline" data-dur="few">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-parasiling.webp" alt="Riders speeding across the bay on jet skis off Pattaya beach" width="400" height="500">
            <span class="exp-card__cat">Water Sport</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Pattaya Jet Ski Adventure"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Pattaya Jet Ski Adventure (TSA)</h3>
            <p class="exp-card__blurb">Guided jet ski runs across the bay with a safety briefing and clear, fixed-price terms agreed before you ride.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Few hours · 1h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Jomtien Beach</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.4 <span class="count">(207)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿1,000 <span>/ 30 min</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <article class="exp-card" data-cat="adrenaline tours" data-dur="half">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-atv-tour.jpg" alt="Enduro Madness dirt bike tour team briefing before a guided off-road ride" width="400" height="500">
            <span class="exp-card__cat">Off-road</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Enduro Madness Dirt Bike Tours"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Enduro Madness Dirt Bike Tours</h3>
            <p class="exp-card__blurb">Guided enduro and dirt-bike trails through the hills behind Pattaya — bikes, gear and instruction for all levels.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Half-day · 4h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> East Pattaya hills</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.8 <span class="count">(141)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿3,500 <span>/ person</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <!-- DIVING & SNORKEL -->
        <article class="exp-card" data-cat="diving adrenaline" data-dur="full">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-scuba-diving.jpg" alt="Scuba tanks lined up on a dive boat ready for a trip out of Pattaya" width="400" height="500">
            <span class="exp-card__cat">Scuba</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Dive Station Pattaya"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Dive Station Pattaya</h3>
            <p class="exp-card__blurb">Two-tank fun dives and Discover Scuba trips to the near islands and wrecks, with small groups and pro guides.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Full-day · 7h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Bali Hai Pier</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.7 <span class="count">(289)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿2,800 <span>/ person</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <article class="exp-card" data-cat="diving" data-dur="full">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-scuba-diving-2.webp" alt="Scuba training in the pool at a PADI 5-Star dive centre in Pattaya" width="400" height="500">
            <span class="exp-card__cat">PADI Course</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Pattaya Dive Centre PADI 5-Star"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Pattaya Dive Centre — PADI 5-Star</h3>
            <p class="exp-card__blurb">Beginner courses to advanced certifications at a 5-Star CDC centre, with pool training before you hit the reef.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Full-day · 8h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> South Pattaya</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.9 <span class="count">(456)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿3,200 <span>/ person</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <article class="exp-card" data-cat="diving family" data-dur="half">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-snorkeling.jpg" alt="A scuba diver gliding underwater on a reef dive near Pattaya" width="400" height="500">
            <span class="exp-card__cat">Snorkel &amp; Dive</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Thai Ocean Academy"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Thai Ocean Academy</h3>
            <p class="exp-card__blurb">Relaxed snorkel safaris and intro dives over shallow coral — great for families and total beginners.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Half-day · 5h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Jomtien</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.6 <span class="count">(132)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿1,800 <span>/ person</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <!-- CULTURE -->
        <article class="exp-card" data-cat="culture tours family" data-dur="few">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/SanctuaryofTruth.jpg" alt="The all-wood Sanctuary of Truth temple rising beside the sea in Pattaya" width="400" height="500">
            <span class="exp-card__cat">Temple</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Sanctuary of Truth"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Sanctuary of Truth</h3>
            <p class="exp-card__blurb">A breathtaking all-teak temple carved entirely by hand — Pattaya's most photographed cultural landmark.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Few hours · 2h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Naklua</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.7 <span class="count">(9,820)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿500 <span>/ person</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <article class="exp-card" data-cat="culture family" data-dur="few">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-buddhist-pagoda-golden.jpg" alt="A golden Buddhist pagoda gleaming in the sun near Pattaya" width="400" height="500">
            <span class="exp-card__cat">Temple</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Big Buddha Hill"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Big Buddha Hill (Wat Phra Yai)</h3>
            <p class="exp-card__blurb">A serene hilltop temple complex with a giant golden Buddha and sweeping views over Pattaya bay.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Few hours · 1h</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Pratamnak Hill</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.5 <span class="count">(3,470)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">Free <span>to visit</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <!-- RENT A BIKE / CAR -->
        <article class="exp-card" data-cat="rent" data-dur="full">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-atv-tour.jpg" alt="A fleet of rental motorbikes lined up at Adventure Bikes Pattaya" width="400" height="500">
            <span class="exp-card__cat">Bike Rental</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Adventure Bikes Pattaya"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Adventure Bikes Pattaya</h3>
            <p class="exp-card__blurb">Scooters to big bikes for self-guided exploring, with helmets, insurance options and clear daily rates.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Full-day · 24h hire</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.5 <span class="count">(168)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿250 <span>/ day</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

        <article class="exp-card" data-cat="rent family" data-dur="full">
          <div class="exp-card__media">
            <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-atv-tour.jpg" alt="A clean rental motorcycle ready for hire at Pattaya Rent a Car" width="400" height="500">
            <span class="exp-card__cat">Car &amp; Bike</span>
            <button class="exp-card__save" type="button" aria-pressed="false" aria-label="Save Pattaya Rent a Car"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="exp-card__body">
            <h3>Pattaya Rent a Car</h3>
            <p class="exp-card__blurb">Cars and scooters for families and longer trips, with delivery to your hotel and English-speaking staff.</p>
            <div class="exp-card__meta">
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-car"></use></svg> Full-day · 24h hire</span>
              <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Jomtien</span>
            </div>
            <div class="exp-card__tags">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.4 <span class="count">(121)</span></span>
            </div>
            <div class="exp-card__foot">
              <span class="exp-card__price">from ฿900 <span>/ day</span></span>
              <a class="btn btn--secondary btn--sm" href="#">View details</a>
            </div>
          </div>
        </article>

      </div><!-- /exp-grid -->

      <p class="exp-empty" id="exp-empty" role="status">No experiences match these filters yet. Try clearing one of them.</p>

    </div>
  </section>

  <!-- =================================================== 5 · PLAN YOUR DAY -->
  <section class="ttd-sec ttd-bleed" aria-labelledby="ttd-plan-title">
    <div class="container">
      <div class="ttd-head">
        <span class="kicker">Plan your day</span>
        <h2 id="ttd-plan-title">A perfect Pattaya day, hour by hour</h2>
        <p>A sample flow to mix and match — pair an island morning with a temple afternoon and a Walking Street night.</p>
      </div>
      <div class="plan">
        <div class="plan__col plan__col--morning">
          <div class="plan__when">
            <span class="plan__badge plan__badge--morning" aria-hidden="true"><svg class="pg-icon is-24" aria-hidden="true"><use href="#pg-sun"></use></svg></span>
            <span><b>Morning</b><span>7:00 – 12:00</span></span>
          </div>
          <div class="plan__item">
            <svg class="pg-icon is-20 is-ocean" aria-hidden="true"><use href="#pg-ferry"></use></svg>
            <span><b>Speedboat to Coral Island</b><span>Beat the crowds and the heat — first boats out have the clearest water for snorkeling.</span></span>
          </div>
          <div class="plan__item">
            <svg class="pg-icon is-20 is-ocean" aria-hidden="true"><use href="#pg-beach"></use></svg>
            <span><b>Beach + breakfast</b><span>Grab a sun lounger and fresh fruit before the day-trip boats arrive.</span></span>
          </div>
        </div>
        <div class="plan__col plan__col--afternoon">
          <div class="plan__when">
            <span class="plan__badge plan__badge--afternoon" aria-hidden="true"><svg class="pg-icon is-24" aria-hidden="true"><use href="#pg-sunset"></use></svg></span>
            <span><b>Afternoon</b><span>12:00 – 18:00</span></span>
          </div>
          <div class="plan__item">
            <svg class="pg-icon is-20 is-ocean" aria-hidden="true"><use href="#pg-attractions"></use></svg>
            <span><b>Sanctuary of Truth</b><span>Cool off inside the hand-carved teak temple, then catch the sea-side breeze.</span></span>
          </div>
          <div class="plan__item">
            <svg class="pg-icon is-20 is-ocean" aria-hidden="true"><use href="#pg-near-me"></use></svg>
            <span><b>City Sign viewpoint</b><span>Time it for golden hour — the whole bay lights up behind you.</span></span>
          </div>
        </div>
        <div class="plan__col plan__col--evening">
          <div class="plan__when">
            <span class="plan__badge plan__badge--evening" aria-hidden="true"><svg class="pg-icon is-24" aria-hidden="true"><use href="#pg-moon"></use></svg></span>
            <span><b>Evening</b><span>18:00 – late</span></span>
          </div>
          <div class="plan__item">
            <svg class="pg-icon is-20 is-ocean" aria-hidden="true"><use href="#pg-pin"></use></svg>
            <span><b>Dinner on Beach Road</b><span>Seafood with a sunset view before the night really begins.</span></span>
          </div>
          <div class="plan__item">
            <svg class="pg-icon is-20 is-ocean" aria-hidden="true"><use href="#pg-tours"></use></svg>
            <span><b>Walking Street stroll</b><span>People-watch your way down Pattaya's famous neon strip from around 9pm.</span></span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================================================ 6 · ISLAND HOPPING RAIL -->
  <section class="ttd-sec" id="islands" aria-labelledby="ttd-isle-title">
    <div class="container">
      <div class="ttd-head row" style="justify-content:space-between;align-items:flex-end;max-width:none;flex-wrap:wrap;gap:var(--s3)">
        <div style="max-width:62ch">
          <span class="kicker">Island hopping</span>
          <h2 id="ttd-isle-title">Islands &amp; beaches by speedboat</h2>
          <p>Pattaya's near islands are a short hop offshore — clear water, white sand and snorkel reefs.</p>
        </div>
        <a class="ttd-more" href="#">All islands <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></a>
      </div>

      <div class="carousel-wrap">
        <button class="car-btn car-prev" type="button" aria-label="Scroll islands left" data-car="isle-rail" data-dir="-1">
          <svg class="pg-icon is-20" aria-hidden="true" style="transform:rotate(180deg)"><use href="#pg-chevron-right"></use></svg>
        </button>
        <button class="car-btn car-next" type="button" aria-label="Scroll islands right" data-car="isle-rail" data-dir="1">
          <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-chevron-right"></use></svg>
        </button>
        <div class="carousel" id="isle-rail" tabindex="0" aria-label="Islands and beaches, scrollable">

          <article class="isle">
            <div class="isle__media">
              <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/Coral-Island-pattaya.jpg" alt="The turquoise water and white sand of Coral Island (Koh Larn) near Pattaya" width="300" height="190">
              <span class="pill pill--cyan isle__tag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-ferry"></use></svg> Most popular</span>
              <span class="isle__title">Coral Island (Koh Larn)</span>
            </div>
            <div class="isle__body">
              <p>The classic Pattaya island — six beaches, snorkeling and beach clubs just offshore.</p>
              <div class="isle__meta">
                <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-ferry"></use></svg> ~15 min by speedboat</span>
                <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-anchor"></use></svg> Bali Hai Pier</span>
              </div>
            </div>
          </article>

          <article class="isle">
            <div class="isle__media">
              <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/Koh-Sak.jpg" alt="Calm clear water and a quiet beach at Koh Sak island near Pattaya" width="300" height="190">
              <span class="pill pill--navy isle__tag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-anchor"></use></svg> Quiet</span>
              <span class="isle__title">Koh Sak</span>
            </div>
            <div class="isle__body">
              <p>A tiny, calm island between Koh Larn and the mainland — superb for snorkeling away from crowds.</p>
              <div class="isle__meta">
                <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-ferry"></use></svg> ~20 min by speedboat</span>
                <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-anchor"></use></svg> Bali Hai Pier</span>
              </div>
            </div>
          </article>

          <article class="isle">
            <div class="isle__media">
              <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/best-island-pattaya.jpg" alt="A pristine palm-fringed beach on one of Pattaya's best islands" width="300" height="190">
              <span class="pill pill--cyan isle__tag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-islands"></use></svg> Day trip</span>
              <span class="isle__title">Koh Phai (Bamboo Is.)</span>
            </div>
            <div class="isle__body">
              <p>Further out and protected by the navy — the cleanest water of the group, best on a full-day charter.</p>
              <div class="isle__meta">
                <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-ferry"></use></svg> ~40 min by speedboat</span>
                <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-anchor"></use></svg> Ocean Marina</span>
              </div>
            </div>
          </article>

          <article class="isle">
            <div class="isle__media">
              <img loading="lazy" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/coral-island-pattaya-2.jpg" alt="Speedboats moored along the shore of Coral Island near Pattaya" width="300" height="190">
              <span class="pill pill--navy isle__tag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-beach"></use></svg> Beach club</span>
              <span class="isle__title">Tien Beach</span>
            </div>
            <div class="isle__body">
              <p>Koh Larn's prettiest cove — soft sand, beach bars and parasailing right off the shore.</p>
              <div class="isle__meta">
                <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-ferry"></use></svg> ~15 min + songthaew</span>
                <span class="mi"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-anchor"></use></svg> Bali Hai Pier</span>
              </div>
            </div>
          </article>

        </div>
      </div>
    </div>
  </section>

  <!-- ======================================================= 7 · LOCAL TIP -->
  <section class="ttd-sec ttd-bleed" aria-labelledby="ttd-tip-title">
    <div class="container">
      <div class="ttd-head" style="margin-bottom:var(--s4)">
        <span class="kicker">Good to know</span>
        <h2 id="ttd-tip-title">One honest tip before you go</h2>
      </div>
      <div class="alert alert--warn alert--lg" role="note">
        <svg class="pg-icon is-24" aria-hidden="true"><use href="#pg-scam-alert"></use></svg>
        <div>
          <b>Agree jet ski &amp; rental terms up front — in writing.</b>
          The most common Pattaya hassle is a “damage” charge raised after you return a jet ski or scooter. Before you ride, photograph every existing scratch, confirm the price and deposit, and never hand over your passport as security — a photocopy or cash deposit is enough. Book through a listed, reviewed operator and walk away if anyone refuses clear terms.
          <span class="tip-verify"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-local-verified"></use></svg> Checked by Pattaya Guide local editors</span>
        </div>
      </div>
    </div>
  </section>

</div>`

const SCRIPT = String.raw`(function(){
  "use strict";

  /* —— 1 · Interest / category filter chips ————————————————————————————— */
  var grid    = document.getElementById('exp-grid');
  var cards   = grid ? Array.prototype.slice.call(grid.querySelectorAll('.exp-card')) : [];
  var empty   = document.getElementById('exp-empty');
  var counter = document.getElementById('exp-count');

  var state = { cat:'all', dur:'any' };

  function matches(card){
    var cats = (card.getAttribute('data-cat') || '').split(/\s+/);
    var okCat = state.cat === 'all' || cats.indexOf(state.cat) !== -1;
    var okDur = state.dur === 'any' || card.getAttribute('data-dur') === state.dur;
    return okCat && okDur;
  }

  function applyFilters(){
    var shown = 0;
    cards.forEach(function(card){
      var show = matches(card);
      card.classList.toggle('is-hidden', !show);
      if (show) shown++;
    });
    if (empty) empty.classList.toggle('show', shown === 0);
    if (counter){
      counter.textContent = shown === cards.length
        ? 'Showing all ' + shown + ' experiences'
        : 'Showing ' + shown + ' of ' + cards.length + ' experiences';
    }
  }

  function wireGroup(selector, key){
    var btns = Array.prototype.slice.call(document.querySelectorAll(selector));
    btns.forEach(function(btn){
      btn.addEventListener('click', function(){
        btns.forEach(function(b){ b.setAttribute('aria-pressed','false'); b.classList.remove('active'); });
        btn.setAttribute('aria-pressed','true'); btn.classList.add('active');
        state[key] = btn.getAttribute('data-' + (key==='cat'?'filter':key));
        applyFilters();
      });
    });
  }
  wireGroup('[data-filter]', 'cat');
  wireGroup('[data-dur]', 'dur');

  /* —— 2 · Category medallions act as quick filters —————————————————————— */
  Array.prototype.slice.call(document.querySelectorAll('[data-jump]')).forEach(function(tile){
    tile.addEventListener('click', function(){
      var cat = tile.getAttribute('data-jump');
      var chip = document.querySelector('[data-filter="' + cat + '"]');
      if (chip){ chip.click(); }
      var target = document.getElementById('experiences');
      if (target){ target.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });

  /* —— 3 · Save (favourite) toggle ————————————————————————————————————————— */
  Array.prototype.slice.call(document.querySelectorAll('.exp-card__save')).forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      var on = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', on ? 'false' : 'true');
    });
  });

  /* —— 4 · Carousel scroll buttons ————————————————————————————————————————— */
  Array.prototype.slice.call(document.querySelectorAll('[data-car]')).forEach(function(btn){
    btn.addEventListener('click', function(){
      var rail = document.getElementById(btn.getAttribute('data-car'));
      if (!rail) return;
      var dir = parseInt(btn.getAttribute('data-dir'), 10) || 1;
      rail.scrollBy({ left: dir * Math.min(rail.clientWidth * 0.9, 340), behavior:'smooth' });
    });
  });

  /* —— 5 · Hero search filters the listing too ————————————————————————————— */
  var heroSearch = document.getElementById('ttd-hero-search');
  if (heroSearch){
    heroSearch.addEventListener('input', function(){
      var q = heroSearch.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function(card){
        var passFilter = matches(card);
        var text = card.textContent.toLowerCase();
        var passQ = q === '' || text.indexOf(q) !== -1;
        var show = passFilter && passQ;
        card.classList.toggle('is-hidden', !show);
        if (show) shown++;
      });
      if (empty) empty.classList.toggle('show', shown === 0);
      if (counter){
        counter.textContent = q === ''
          ? (shown === cards.length ? 'Showing all ' + shown + ' experiences' : 'Showing ' + shown + ' of ' + cards.length + ' experiences')
          : 'Showing ' + shown + ' result' + (shown === 1 ? '' : 's') + ' for “' + heroSearch.value.trim() + '”';
      }
    });
  }

  applyFilters();
})();`

export default function ThingsToDoPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
      <BlogScript script={SCRIPT} />
    </>
  )
}
