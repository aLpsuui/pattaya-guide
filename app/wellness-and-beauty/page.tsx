import './well.css'
import BlogScript from '@/app/components/BlogScript'

export const metadata = {
  title: 'Wellness & Beauty in Pattaya — Spas, Massage, Onsen & Beauty | Go To Pattaya',
  description: "Reset, recharge, repeat. Discover Pattaya's best spas, Thai massage, onsen baths, beauty salons, facials and wellness retreats — calmly curated and locally verified.",
}

const HTML = String.raw`
<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
<symbol id="pg-wellness" viewBox="0 0 24 24"><path d="M12 17C10 14.5 10 9.5 12 7c2 2.5 2 7.5 0 10z"/><path d="M12 17C9 16 6 14.5 5.5 11.5 8.5 11.8 11 13.5 12 17z"/><path d="M12 17c3-1 6-2.5 6.5-5.5C15.5 11.8 13 13.5 12 17z"/><path d="M5 18.6c2.4 1.3 11.6 1.3 14 0"/></symbol>
<symbol id="pg-massage" viewBox="0 0 24 24"><ellipse cx="12" cy="7.5" rx="6" ry="2.3"/><ellipse cx="12" cy="12.5" rx="5" ry="2.1"/><ellipse cx="12" cy="17.3" rx="4" ry="2"/></symbol>
<symbol id="pg-sauna" viewBox="0 0 24 24"><path d="M3 20.5h18"/><path d="M5 20.5v-9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9"/><path d="M5 13.5h14"/><path d="M8.5 6.5c0-1.5-1.2-1.7-1.2-3M12 6.5c0-1.5-1.2-1.7-1.2-3M15.5 6.5c0-1.5-1.2-1.7-1.2-3"/></symbol>
<symbol id="pg-sparkle" viewBox="0 0 24 24"><path d="M12 3c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5z"/><path d="M18.5 14.5c.3 1.6.7 2 2.5 2.5-1.8.3-2.2.9-2.5 2.5-.3-1.6-.7-2-2.5-2.5 1.8-.3 2.2-.9 2.5-2.5z"/></symbol>
<symbol id="pg-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></symbol>
<symbol id="pg-map" viewBox="0 0 24 24"><path d="m9 4-6 2.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z"/><path d="M9 4v13"/><path d="M15 6.5v13"/></symbol>
<symbol id="pg-filter" viewBox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4-2v-4z"/></symbol>
<symbol id="pg-heart" viewBox="0 0 24 24"><path d="M12 20.3 4.6 12.9a4.7 4.7 0 0 1 6.6-6.6l.8.8.8-.8a4.7 4.7 0 0 1 6.6 6.6z"/></symbol>
<symbol id="pg-share" viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6"/><path d="m8.2 13.2 7.6 3.6"/></symbol>
<symbol id="pg-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></symbol>
<symbol id="pg-chevron-right" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
<symbol id="pg-chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
<symbol id="pg-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></symbol>
<symbol id="pg-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7"/></symbol>
<symbol id="pg-pin" viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></symbol>
<symbol id="pg-star" viewBox="0 0 24 24"><path d="M12 2.6 14.85 8.4 21.2 9.3l-4.6 4.4 1.1 6.3L12 17.4 6.3 20l1.1-6.3-4.6-4.4 6.35-.9z"/></symbol>
<symbol id="pg-parking" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9.5 16.5v-9h3.5a2.75 2.75 0 0 1 0 5.5H9.5"/></symbol>
<symbol id="pg-sea-view" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.2"/><path d="M3 16c1.6-1.6 3.4-1.6 5 0s3.4 1.6 5 0 3.4-1.6 5 0"/><path d="M3 19.5c1.6-1.6 3.4-1.6 5 0s3.4 1.6 5 0 3.4-1.6 5 0"/></symbol>
<symbol id="pg-outdoor" viewBox="0 0 24 24"><path d="M4 20C4 12 9 5 20 5c0 9-6 15-15 15"/><path d="M4.5 19.5c4-8 8-9 11-9.4"/></symbol>
<symbol id="pg-air-con" viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M4.5 7.5 19.5 16.5"/><path d="M19.5 7.5 4.5 16.5"/><path d="m9.8 5.2 2.2-2 2.2 2"/><path d="m9.8 18.8 2.2 2 2.2-2"/><path d="m4.5 10.5-.3-3 2.9.8"/><path d="m19.5 13.5.3 3-2.9-.8"/><path d="m19.5 10.5.3-3-2.9.8"/><path d="m4.5 13.5-.3 3 2.9-.8"/></symbol>
<symbol id="pg-languages" viewBox="0 0 24 24"><path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v7a1.5 1.5 0 0 1-1.5 1.5H10l-4 3.5V15H5.5A1.5 1.5 0 0 1 4 13.5z"/><path d="M8 9h8"/><path d="M8 12h5"/></symbol>
<symbol id="pg-verified" viewBox="0 0 24 24"><path d="M12 3 5 6v6c0 4 3 6.6 7 8 4-1.4 7-4 7-8V6z"/><path d="m9 12 2 2 4-4.5"/></symbol>
<symbol id="pg-card" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 9.5h18"/><path d="M7 14.5h3"/></symbol>
<symbol id="pg-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.3"/><path d="M12 2v2.4"/><path d="M12 19.6V22"/><path d="m4.4 4.4 1.7 1.7"/><path d="m17.9 17.9 1.7 1.7"/><path d="M2 12h2.4"/><path d="M19.6 12H22"/><path d="m4.4 19.6 1.7-1.7"/><path d="m17.9 6.1 1.7-1.7"/></symbol>
<symbol id="pg-sunset" viewBox="0 0 24 24"><path d="M7 18a5 5 0 0 1 10 0"/><path d="M3 18h2.5"/><path d="M18.5 18H21"/><path d="M12 3v6"/><path d="m9 6.2 3 3 3-3"/><path d="m4.6 12.6 1.6 1.2"/><path d="m19.4 12.6-1.6 1.2"/></symbol>
<symbol id="pg-moon" viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/><path d="m17 5 .6 1.5L19 7l-1.4.5L17 9l-.6-1.5L15 7l1.4-.5z" fill="currentColor" stroke="none"/></symbol>
<symbol id="pg-local-verified" viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><path d="m9.2 9.9 2 2 3.6-3.8"/></symbol>
<symbol id="pg-near-me" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></symbol>
<symbol id="pg-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".8" fill="currentColor" stroke="none"/></symbol>
<symbol id="pg-accessible" viewBox="0 0 24 24"><circle cx="13" cy="4.3" r="1.7"/><path d="M13 6.5v6h4.5l1.5 5.5"/><path d="M13 9.5H9"/><circle cx="11" cy="16.5" r="4.8"/></symbol>
</svg>

<div class="well-page">

  <!-- ============ 1 · CALM HERO ============ -->
  <section class="well-hero" aria-labelledby="well-hero-title">
    <div class="well-wrap">
      <div class="well-hero-grid">
        <div class="well-hero-copy">
          <span class="kicker">Wellness &amp; Beauty</span>
          <h1 id="well-hero-title">Reset, Recharge,<span class="soft">Repeat.</span></h1>
          <p class="lead">Pattaya's calmest corner — onsen baths, Thai massage, glowing facials and unhurried beauty. Pick a treatment, let your shoulders drop.</p>

          <form class="search" role="search" aria-label="Search wellness venues" onsubmit="return false">
            <svg class="pg-icon is-20 is-muted" aria-hidden="true"><use href="#pg-search"></use></svg>
            <input type="search" name="q" placeholder="Find spas, massage, onsen &amp; beauty…" aria-label="Search spas, massage, onsen and beauty">
            <button class="go" type="submit" aria-label="Search">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-arrow-right"></use></svg>
            </button>
          </form>

          <div class="well-hero-meta">
            <span><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-wellness"></use></svg> 134 places to unwind</span>
            <span><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-local-verified"></use></svg> Locally verified</span>
            <span><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-near-me"></use></svg> Across every neighborhood</span>
          </div>
        </div>

        <div class="well-hero-art">
          <div class="frame">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-wellness-1.jpeg" alt="Serene spa relaxation lounge with soft natural light in Pattaya" width="600" height="720">
          </div>
          <div class="float">
            <span class="ic"><svg class="pg-icon is-24 is-ocean" aria-hidden="true"><use href="#pg-massage"></use></svg></span>
            <div>
              <b>Traditional Thai</b>
              <span>from ฿300 / hour</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ 2 · CATEGORY TABS + 3 · MOOD ============ -->
  <section class="well-sec well-sec--tint" aria-labelledby="well-browse-title">
    <div class="well-wrap">
      <div class="well-head">
        <span class="kicker">Browse by category</span>
        <h2 id="well-browse-title">Find your kind of calm</h2>
        <p>Five ways to feel better in Pattaya — from a quiet onsen soak to a glowing facial.</p>
      </div>

      <div class="well-tabs" role="tablist" aria-label="Wellness categories">
        <button class="well-tab" role="tab" id="tab-spa" aria-controls="panel-spa" aria-selected="true" data-tab="spa">
          <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-massage"></use></svg>
          Spa &amp; Massage <span class="ct">65</span>
        </button>
        <button class="well-tab" role="tab" id="tab-onsen" aria-controls="panel-onsen" aria-selected="false" data-tab="onsen">
          <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-sauna"></use></svg>
          Onsen &amp; Sauna <span class="ct">8</span>
        </button>
        <button class="well-tab" role="tab" id="tab-beauty" aria-controls="panel-beauty" aria-selected="false" data-tab="beauty">
          <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-sparkle"></use></svg>
          Beauty &amp; Nails <span class="ct">34</span>
        </button>
        <button class="well-tab" role="tab" id="tab-facial" aria-controls="panel-facial" aria-selected="false" data-tab="facial">
          <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-wellness"></use></svg>
          Facials &amp; Skincare <span class="ct">18</span>
        </button>
        <button class="well-tab" role="tab" id="tab-retreat" aria-controls="panel-retreat" aria-selected="false" data-tab="retreat">
          <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-sun"></use></svg>
          Wellness Retreats <span class="ct">9</span>
        </button>
      </div>

      <div class="well-mood">
        <span class="lbl">By goal / mood</span>
        <button class="chip" type="button" aria-pressed="true" data-mood="all">All</button>
        <button class="chip" type="button" aria-pressed="false" data-mood="relax">
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg> Relax
        </button>
        <button class="chip" type="button" aria-pressed="false" data-mood="detox">
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-sauna"></use></svg> Detox
        </button>
        <button class="chip" type="button" aria-pressed="false" data-mood="recover">
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-sunset"></use></svg> Recover
        </button>
        <button class="chip" type="button" aria-pressed="false" data-mood="glow">
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-sun"></use></svg> Glow
        </button>
        <button class="chip" type="button" aria-pressed="false" data-mood="sleep">
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-moon"></use></svg> Sleep
        </button>
      </div>

      <!-- ===== 4 · LISTING GRIDS ===== -->

      <!-- SPA & MASSAGE -->
      <div class="well-panel" id="panel-spa" role="tabpanel" aria-labelledby="tab-spa">
        <div class="well-grid">

          <article class="well-card" data-cat="spa" data-mood="relax detox">
            <div class="ph">
              <span class="toptag"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-verified"></use></svg> Editor's Pick</span>
              <button class="save" type="button" aria-pressed="false" aria-label="Save Yunomori Onsen & Spa">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-massage-1.jpeg" alt="Indoor onsen soaking pool at Yunomori Onsen & Spa, Pattaya" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Onsen</span><span class="type">Aroma</span><span class="type">Thai</span></div>
              <h3>Yunomori Onsen &amp; Spa</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 90–150 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg> Onsen</span>
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
                <span class="pill pill--blue">Couples</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.8 <span class="count">(2,140)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Jomtien</span>
                  <span class="price">from <b>฿650</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="spa" data-mood="relax recover">
            <div class="ph">
              <span class="toptag"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-local-verified"></use></svg> Local Verified</span>
              <button class="save" type="button" aria-pressed="false" aria-label="Save The One Massage Pattaya">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-massage-2.jpg" alt="Outdoor Thai massage sala at The One Massage, Pattaya" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Thai</span><span class="type">Herbal</span><span class="type">Foot</span></div>
              <h3>The One Massage</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 60–120 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-outdoor"></use></svg> Garden</span>
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.7 <span class="count">(1,310)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
                  <span class="price">from <b>฿300</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="spa" data-mood="relax detox">
            <div class="ph">
              <button class="save" type="button" aria-pressed="false" aria-label="Save Health Land Pattaya Sukhumvit">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-wellnes-2.jpg" alt="Illuminated spa building of Health Land on Sukhumvit Road, Pattaya at dusk" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Thai</span><span class="type">Aroma</span><span class="type">Oil</span></div>
              <h3>Health Land Sukhumvit</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 60–120 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
                <span class="pill pill--blue">Couples</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.6 <span class="count">(3,005)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Sukhumvit Rd</span>
                  <span class="price">from <b>฿500</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="spa" data-mood="relax glow">
            <div class="ph">
              <button class="save" type="button" aria-pressed="false" aria-label="Save Grace Spa">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-wellness-1.jpeg" alt="Calm relaxation area with daybeds at Grace Spa, Pattaya" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Aroma</span><span class="type">Facial</span><span class="type">Body</span></div>
              <h3>Grace Spa</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 60–150 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
                <span class="pill pill--blue">Couples</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.5 <span class="count">(640)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Pratumnak</span>
                  <span class="price">from <b>฿450</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="spa" data-mood="relax detox">
            <div class="ph">
              <button class="save" type="button" aria-pressed="false" aria-label="Save Siladon Spa Pattaya">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-massage-4.png" alt="Elegant reception lounge at Siladon Spa, Pattaya" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Thai</span><span class="type">Herbal</span><span class="type">Scrub</span></div>
              <h3>Siladon Spa</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 90–180 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.7 <span class="count">(880)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> North Pattaya</span>
                  <span class="price">from <b>฿700</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="spa" data-mood="relax recover">
            <div class="ph">
              <span class="toptag"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-sea-view"></use></svg> Sea view</span>
              <button class="save" type="button" aria-pressed="false" aria-label="Save Tea Tree Spa Pattaya">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/best-island-pattaya.jpg" alt="Ocean-view relaxation deck at Tea Tree Spa, Pattaya" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Aroma</span><span class="type">Thai</span><span class="type">Hot Stone</span></div>
              <h3>Tea Tree Spa</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 60–120 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-sea-view"></use></svg> Sea view</span>
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.6 <span class="count">(510)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Wong Amat</span>
                  <span class="price">from <b>฿600</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="spa" data-mood="relax detox">
            <div class="ph">
              <button class="save" type="button" aria-pressed="false" aria-label="Save Let's Relax Onsen & Spa">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-massage-1.jpeg" alt="Tranquil courtyard with stone fountain at Let's Relax Onsen & Spa, Pattaya" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Onsen</span><span class="type">Aroma</span><span class="type">Foot</span></div>
              <h3>Let's Relax Onsen &amp; Spa</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 90–150 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg> Onsen</span>
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
                <span class="pill pill--blue">Couples</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.7 <span class="count">(1,920)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
                  <span class="price">from <b>฿750</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="spa" data-mood="relax glow">
            <div class="ph">
              <button class="save" type="button" aria-pressed="false" aria-label="Save The Sea.Spa Pattaya">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-wellness-1.jpeg" alt="Rose petal flower bath ready for a couples treatment at The Sea.Spa, Pattaya" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Flower Bath</span><span class="type">Aroma</span><span class="type">Body</span></div>
              <h3>The Sea.Spa</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 120–180 min</span>
              <div class="amen">
                <span class="pill pill--blue">Couples</span>
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.8 <span class="count">(430)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Pratumnak</span>
                  <span class="price">from <b>฿1,200</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="spa" data-mood="relax glow">
            <div class="ph">
              <span class="toptag"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-verified"></use></svg> Luxury</span>
              <button class="save" type="button" aria-pressed="false" aria-label="Save 7 Spa Luxury Pattaya">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-wellnes-2.jpg" alt="Illuminated luxury spa exterior of 7 Spa, Pattaya at night" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Thai</span><span class="type">Aroma</span><span class="type">Package</span></div>
              <h3>7 Spa Luxury</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 90–210 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
                <span class="pill pill--blue">Couples</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.6 <span class="count">(1,070)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> South Pattaya</span>
                  <span class="price">from <b>฿900</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="spa" data-mood="relax detox">
            <div class="ph">
              <span class="toptag"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-local-verified"></use></svg> Local Verified</span>
              <button class="save" type="button" aria-pressed="false" aria-label="Save Health Land North Pattaya">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-wellnes-2.jpg" alt="Illuminated spa building of Health Land North Pattaya at dusk" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Thai</span><span class="type">Aroma</span><span class="type">Oil</span></div>
              <h3>Health Land North Pattaya</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 60–120 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
                <span class="pill pill--blue">Couples</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.6 <span class="count">(2,210)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> North Pattaya</span>
                  <span class="price">from <b>฿500</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="spa" data-mood="relax recover">
            <div class="ph">
              <button class="save" type="button" aria-pressed="false" aria-label="Save Poo Na Health Massage">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-massage-2.jpg" alt="Foot massage session in progress at Poo Na Health Massage, Pattaya" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Thai</span><span class="type">Foot</span><span class="type">Herbal</span></div>
              <h3>Poo Na Health Massage</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 60–120 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
                <span class="pill pill--blue">Walk-in</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.5 <span class="count">(720)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
                  <span class="price">from <b>฿250</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="spa" data-mood="relax sleep">
            <div class="ph">
              <button class="save" type="button" aria-pressed="false" aria-label="Save RINN Spa & Massage">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-massage-1.jpeg" alt="Quiet Thai massage room with floor mats at RINN Spa & Massage, Pattaya" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Thai</span><span class="type">Aroma</span><span class="type">Foot</span></div>
              <h3>RINN Spa &amp; Massage</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 60–120 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
                <span class="pill pill--blue">Walk-in</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.6 <span class="count">(560)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Jomtien</span>
                  <span class="price">from <b>฿300</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

        </div>

        <p class="well-crosslink">
          <svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-info"></use></svg>
          Looking for yoga, gyms or Muay Thai? See <a href="/yoga-and-fitness">Yoga &amp; Fitness</a>
          <svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-arrow-right"></use></svg>
        </p>
      </div>

      <!-- ONSEN & SAUNA -->
      <div class="well-panel" id="panel-onsen" role="tabpanel" aria-labelledby="tab-onsen" hidden>
        <div class="well-grid">

          <article class="well-card" data-cat="onsen" data-mood="relax detox">
            <div class="ph">
              <span class="toptag"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-verified"></use></svg> Editor's Pick</span>
              <button class="save" type="button" aria-pressed="false" aria-label="Save Yunomori Onsen & Spa">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-massage-1.jpeg" alt="Indoor onsen soaking pool at Yunomori Onsen & Spa, Pattaya" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Onsen</span><span class="type">Mineral baths</span><span class="type">Sauna</span></div>
              <h3>Yunomori Onsen &amp; Spa</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> Full-day soak</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-sauna"></use></svg> Sauna</span>
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
                <span class="pill pill--blue">Couples</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.8 <span class="count">(2,140)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Jomtien</span>
                  <span class="price">from <b>฿650</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="onsen" data-mood="relax detox">
            <div class="ph">
              <span class="toptag"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-local-verified"></use></svg> Local Verified</span>
              <button class="save" type="button" aria-pressed="false" aria-label="Save Let's Relax Onsen & Spa">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-massage-1.jpeg" alt="Tranquil courtyard with stone fountain at Let's Relax Onsen & Spa, Pattaya" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Onsen</span><span class="type">Sauna</span><span class="type">Aroma</span></div>
              <h3>Let's Relax Onsen &amp; Spa</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 90–150 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-sauna"></use></svg> Sauna</span>
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC</span>
                <span class="pill pill--blue">Couples</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.7 <span class="count">(1,920)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
                  <span class="price">from <b>฿750</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

          <article class="well-card" data-cat="onsen" data-mood="relax recover">
            <div class="ph">
              <span class="toptag"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-sea-view"></use></svg> Sea view</span>
              <button class="save" type="button" aria-pressed="false" aria-label="Save The Sea.Spa Pattaya">
                <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg>
              </button>
              <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-wellnes-2.jpg" alt="Rose petal flower bath ready for a soak at The Sea.Spa, Pattaya" loading="lazy" width="400" height="300">
            </div>
            <div class="body">
              <div class="types"><span class="type">Steam</span><span class="type">Flower Bath</span><span class="type">Sauna</span></div>
              <h3>The Sea.Spa</h3>
              <span class="dur"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-clock"></use></svg> 120–180 min</span>
              <div class="amen">
                <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-sea-view"></use></svg> Sea view</span>
                <span class="pill pill--blue">Couples</span>
              </div>
              <div class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg> 4.8 <span class="count">(430)</span></div>
              <div class="foot">
                <div class="loc">
                  <span class="nb"><svg class="pg-icon is-16 is-muted" aria-hidden="true"><use href="#pg-pin"></use></svg> Pratumnak</span>
                  <span class="price">from <b>฿1,200</b></span>
                </div>
                <a class="view" href="#">View details <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg></a>
              </div>
            </div>
          </article>

        </div>
      </div>

      <!-- FACIALS & SKINCARE -->
      <div class="well-panel" id="panel-facial" role="tabpanel" aria-labelledby="tab-facial" hidden>
        <div class="well-empty">
          <div class="alert alert--info">
            <svg class="pg-icon is-24 is-ocean" aria-hidden="true"><use href="#pg-info"></use></svg>
            <div>
              <b>Facials &amp; Skincare — listings landing soon.</b>
              <p style="margin-top:6px">We're verifying 18 skin clinics and facial studios across Pattaya — from gentle hydrating facials to dermatologist-led treatments — before we publish them. Glow goals incoming; check back shortly.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- BEAUTY & NAILS — tasteful empty state -->
      <div class="well-panel" id="panel-beauty" role="tabpanel" aria-labelledby="tab-beauty" hidden>
        <div class="well-empty">
          <div class="alert alert--info">
            <svg class="pg-icon is-24 is-ocean" aria-hidden="true"><use href="#pg-info"></use></svg>
            <div>
              <b>Beauty &amp; Nails — listings landing soon.</b>
              <p style="margin-top:6px">We're verifying 34 salons, nail bars and lash studios across Pattaya before we publish them. Glow goals incoming — check back shortly.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- WELLNESS RETREATS — tasteful empty state -->
      <div class="well-panel" id="panel-retreat" role="tabpanel" aria-labelledby="tab-retreat" hidden>
        <div class="well-empty">
          <div class="alert alert--info">
            <svg class="pg-icon is-24 is-ocean" aria-hidden="true"><use href="#pg-info"></use></svg>
            <div>
              <b>Multi-day wellness retreats — coming soon.</b>
              <p style="margin-top:6px">Detox programs, fasting and meditation stays around Pattaya and Koh Larn. We're confirming dates and locations for 9 retreats — back with the full list soon.</p>
            </div>
          </div>
        </div>
      </div>

      <p id="well-noresults" class="well-empty" hidden>
        <span class="alert alert--info">
          <svg class="pg-icon is-24 is-ocean" aria-hidden="true"><use href="#pg-info"></use></svg>
          <span><b>No matches for this mood here.</b> Try another goal chip or switch category.</span>
        </span>
      </p>

    </div>
  </section>

  <!-- ============ 5 · FEATURED RETREAT ============ -->
  <section class="well-sec" aria-labelledby="well-feature-title">
    <div class="well-wrap">
      <div class="well-head">
        <span class="kicker">Featured this month</span>
        <h2 id="well-feature-title">A long soak, then nothing on the agenda</h2>
      </div>

      <div class="well-feature">
        <div class="pic">
          <span class="badge"><svg class="pg-icon is-16 is-ocean" aria-hidden="true"><use href="#pg-verified"></use></svg> Editor's Pick</span>
          <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-massage-1.jpeg" alt="Japanese soaking bath at Yunomori Onsen & Spa, Pattaya — the featured retreat" loading="lazy" width="640" height="480">
        </div>
        <div class="txt">
          <span class="pill pill--cyan" style="align-self:flex-start"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg> Onsen &amp; Spa</span>
          <h3>Yunomori Onsen &amp; Spa, Jomtien</h3>
          <p class="note">"The mineral baths run hot, the rule is no rush. Arrive early, cycle the pools, then book an aroma massage when your shoulders finally drop. It's the closest thing to a Japanese onsen day on this coast."</p>
          <div class="quick">
            <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-clock"></use></svg> Full-day soak</span>
            <span class="pill pill--blue"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> AC lounges</span>
            <span class="pill pill--blue">Couples</span>
            <span class="pill pill--sun"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-star"></use></svg> 4.8</span>
          </div>
          <p style="color:var(--text-muted);font-size:14px">Day-pass <span style="font-family:var(--font-display);font-weight:700;color:var(--steel)">from ฿650</span> · aroma massage add-on from ฿900.</p>
          <div class="acts">
            <a class="btn btn--primary" href="#">View details <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></a>
            <a class="btn btn--secondary" href="#"><svg class="pg-icon is-20 is-ocean" aria-hidden="true"><use href="#pg-map"></use></svg> See on map</a>
            <button class="btn btn--ghost" type="button" aria-label="Save Yunomori Onsen & Spa to your collection"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg> Save</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ 6 · WELLNESS TIP ============ -->
  <section class="well-tip" aria-labelledby="well-tip-title">
    <div class="well-wrap">
      <div class="alert alert--info">
        <span class="ic"><svg class="pg-icon is-24 is-ocean" aria-hidden="true"><use href="#pg-info"></use></svg></span>
        <div>
          <h3 id="well-tip-title">How to spot a legit, licensed massage shop</h3>
          <p>A proper shop in Thailand displays a Ministry of Public Health license near the door and lists fixed prices on a board — no "special menu" haggling. Therapists work in an open, well-lit room, you keep your clothes on for traditional Thai, and a 60-minute Thai massage realistically runs ฿250–฿500 in most areas. If the price is oddly low, the room is curtained-off and dim, or the upsell starts before the oil does, walk on — there are hundreds of honest shops nearby.</p>
          <p class="verline">
            <svg class="pg-icon is-20 is-ocean" aria-hidden="true"><use href="#pg-local-verified"></use></svg>
            Every venue tagged "Local Verified" on Go To Pattaya has been visited in person and had its license checked.
          </p>
        </div>
      </div>
    </div>
  </section>

</div>
`

const SCRIPT = String.raw`
(function(){
  "use strict";
  var root = document.querySelector('.well-page');
  if(!root) return;

  /* ---------- Save toggle ---------- */
  root.addEventListener('click', function(e){
    var save = e.target.closest('.save');
    if(save){
      var on = save.getAttribute('aria-pressed') === 'true';
      save.setAttribute('aria-pressed', String(!on));
      return;
    }
    var ghostSave = e.target.closest('.btn--ghost');
    if(ghostSave && ghostSave.closest('.acts')){
      var pressed = ghostSave.getAttribute('aria-pressed') === 'true';
      ghostSave.setAttribute('aria-pressed', String(!pressed));
      ghostSave.style.color = !pressed ? 'var(--color-danger)' : '';
    }
  });

  /* ---------- Category tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.well-tab'));
  var panels = {
    spa: document.getElementById('panel-spa'),
    onsen: document.getElementById('panel-onsen'),
    beauty: document.getElementById('panel-beauty'),
    facial: document.getElementById('panel-facial'),
    retreat: document.getElementById('panel-retreat')
  };

  function selectTab(name){
    tabs.forEach(function(t){
      t.setAttribute('aria-selected', String(t.dataset.tab === name));
    });
    Object.keys(panels).forEach(function(k){
      if(panels[k]) panels[k].hidden = (k !== name);
    });
    applyMood(); // re-apply current mood filter to the visible grid
  }

  tabs.forEach(function(t){
    t.addEventListener('click', function(){ selectTab(t.dataset.tab); });
    t.addEventListener('keydown', function(e){
      var i = tabs.indexOf(t), n;
      if(e.key === 'ArrowRight'){ n = (i+1) % tabs.length; }
      else if(e.key === 'ArrowLeft'){ n = (i-1+tabs.length) % tabs.length; }
      else return;
      e.preventDefault();
      tabs[n].focus();
      selectTab(tabs[n].dataset.tab);
    });
  });

  /* ---------- Mood chips ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.well-mood .chip'));
  var activeMood = 'all';
  var noResults = document.getElementById('well-noresults');

  function applyMood(){
    var visiblePanel = null;
    Object.keys(panels).forEach(function(k){
      if(panels[k] && !panels[k].hidden) visiblePanel = panels[k];
    });
    if(noResults) noResults.hidden = true;
    if(!visiblePanel) return;

    var cards = visiblePanel.querySelectorAll('.well-card');
    if(!cards.length) return; // empty-state panel, nothing to filter
    var shown = 0;
    cards.forEach(function(card){
      var moods = (card.dataset.mood || '').split(/\s+/);
      var match = activeMood === 'all' || moods.indexOf(activeMood) !== -1;
      card.classList.toggle('is-hidden', !match);
      if(match) shown++;
    });
    if(noResults) noResults.hidden = shown !== 0;
  }

  chips.forEach(function(chip){
    chip.addEventListener('click', function(){
      chips.forEach(function(c){ c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      activeMood = chip.dataset.mood || 'all';
      applyMood();
    });
  });

  /* init */
  selectTab('spa');
})();
`

export default function WellnessBeautyPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
      <BlogScript script={SCRIPT} />
    </>
  )
}
