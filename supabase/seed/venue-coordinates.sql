-- ============================================================================
-- Venue coordinates — APPROXIMATE (placed within each venue's correct Pattaya
-- area so they plot sensibly on the explore map). Refine to exact GPS later
-- via Google Places when convenient. Re-run-safe: plain UPDATE by slug.
-- ============================================================================

-- Central Pattaya
update public.venues set latitude=12.9255, longitude=100.8838 where slug='88-massage-and-spa';
update public.venues set latitude=12.9290, longitude=100.8805 where slug='grace-spa';
update public.venues set latitude=12.9210, longitude=100.8865 where slug='health-land-pattaya-sukhumvit-road';
update public.venues set latitude=12.9305, longitude=100.8730 where slug='let-s-relax-spa-pattaya-beach-front';
update public.venues set latitude=12.9268, longitude=100.8848 where slug='poo-na-health-massage';
update public.venues set latitude=12.9240, longitude=100.8820 where slug='rinn-spa-massage';
update public.venues set latitude=12.9335, longitude=100.8800 where slug='tea-tree-spa-pattaya';
update public.venues set latitude=12.9200, longitude=100.8760 where slug='the-one-massage-pattaya';
update public.venues set latitude=12.9276, longitude=100.8771 where slug='pattaya-spa';

-- Naklua / North Pattaya / Wongamat
update public.venues set latitude=12.9605, longitude=100.8920 where slug='health-land-north-pattaya';
update public.venues set latitude=12.9650, longitude=100.8895 where slug='let-s-relax-onsen-and-spa-pattaya';
update public.venues set latitude=12.9580, longitude=100.8930 where slug='let-s-relax-spa-north-pattaya';
update public.venues set latitude=12.9595, longitude=100.8885 where slug='let-s-relax-spa-terminal-21-pattaya';
update public.venues set latitude=12.9620, longitude=100.8870 where slug='makkha-health-spa-pattaya-again-north-pattaya';
update public.venues set latitude=12.9665, longitude=100.8925 where slug='siladon-spa-pattaya';
update public.venues set latitude=12.9700, longitude=100.8860 where slug='the-sea-spa-pattaya';

-- Jomtien / Thappraya
update public.venues set latitude=12.9000, longitude=100.8700 where slug='7-spa-luxury-pattaya';
update public.venues set latitude=12.8950, longitude=100.8740 where slug='oasis-spa-pattaya-jomtien';

-- Pratumnak / Phra Tamnak
update public.venues set latitude=12.9180, longitude=100.8650 where slug='i-siamland-massage-spa-pattaya';

-- Thepprasit
update public.venues set latitude=12.9050, longitude=100.8835 where slug='yunomori-onsen-spa-pattaya';
