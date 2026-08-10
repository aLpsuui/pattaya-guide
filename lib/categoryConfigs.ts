import type { CatConfig, SubView } from '@/app/components/CategoryListing'

// Single source of truth for the category hero configs (shared by each pillar's
// /page.tsx and its /[type] subcategory pages) and the per-subcategory hero copy.
//
// Keyed by the DB category slug. SUBCOPY keys are the venueGroups group keys.

export const CONFIGS: Record<string, CatConfig> = {
  'eat-and-drinks': {
    slug: 'eat-and-drinks',
    kicker: 'Eat & Drinks · Pattaya',
    h1: 'Where Pattaya actually eats',
    em: 'actually',
    lead: 'From morning latte art to late-night rooftop plates - a hand-picked, honestly-ranked guide to the city’s tables, cafés and bars. No paid placements.',
    heroImg: 'best-restaurants-pattaya.webp',
    heroImg2: 'nitan-coffee-pattaya.webp',
    badge: 'Locally verified · weekly',
    searchPlaceholder: 'Search restaurants, cafés, cuisines…',
    unit: 'places',
    typeLabel: 'Type',
    typeIcon: 'eat',
  },
  'thinks-to-do': {
    slug: 'thinks-to-do',
    path: '/things-to-do',
    kicker: 'Things to Do · Pattaya',
    h1: 'Your Pattaya adventure starts here',
    em: 'adventure',
    lead: 'Island day-trips and boat tours, scuba and snorkelling, jungle ATV runs and skydives, plus bikes, cars and jet skis to rent - real, locally checked operators in one place.',
    heroImg: 'pattaya-best-tours.webp',
    heroImg2: 'best-island-pattaya.webp',
    badge: 'Locally verified operators',
    searchPlaceholder: 'Search tours, diving, ATV, rentals…',
    unit: 'activities',
  },
  'nightlife': {
    slug: 'nightlife',
    kicker: 'Nightlife · Pattaya',
    h1: 'Where Pattaya comes alive after dark',
    em: 'comes alive',
    lead: 'From the world-ranked mega-clubs to legendary Walking Street discos, go-go bars and rooftop lounges - a locally verified guide to every kind of night out.',
    heroImg: 'pattaya-night-clubs-1.webp',
    heroImg2: 'pattaya-night-clubs-2.webp',
    badge: 'Locally verified · weekly',
    searchPlaceholder: 'Search clubs, bars, go-go, music…',
    unit: 'venues',
  },
  'yoga-and-fitness': {
    slug: 'yoga-and-fitness',
    kicker: 'Gym, Muay Thai & Yoga · Pattaya',
    h1: 'Train hard, recover well in Pattaya',
    em: 'Train hard',
    lead: "From world-famous Muay Thai camps to 24-hour fitness gyms, yoga and pilates studios and climbing walls - find where to train, with real prices and the city's highest-rated coaches.",
    heroImg: 'pattaya-muay-thai-1.webp',
    heroImg2: 'pattaya-yoga-1.webp',
    badge: 'Locally verified · weekly',
    searchPlaceholder: 'Search gyms, Muay Thai, yoga…',
    unit: 'venues',
  },
  'wellness-and-beauty': {
    slug: 'wellness-and-beauty',
    kicker: 'Wellness & Beauty · Pattaya',
    h1: 'Relax, restore and be pampered',
    em: 'restore',
    lead: 'From honest neighbourhood Thai-massage shops to luxury spa resorts and beauty salons - a locally verified guide to where Pattaya unwinds, with real prices and hours.',
    heroImg: 'pattaya-wellness-1.webp',
    heroImg2: 'best-restaurants-pattaya.webp',
    badge: 'Locally verified · weekly',
    searchPlaceholder: 'Search spa, massage, beauty…',
    unit: 'venues',
  },
}

// Per-subcategory hero copy + SEO title/description. Keys: category slug → group key.
export interface SubCopy extends SubView { title: string; description: string }

export const SUBCOPY: Record<string, Record<string, SubCopy>> = {
  'eat-and-drinks': {
    cafes: {
      key: 'cafes', label: 'Cafés & Coffee',
      h1: 'Where Pattaya drinks its coffee', em: 'coffee',
      lead: 'Specialty roasters, garden cafés and all-day brunch spots - the city’s best places for a proper flat white, cake and a slow morning.',
      title: 'Best Cafés & Coffee Shops in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to the best cafés and specialty coffee in Pattaya - roasters, brunch spots and garden cafés, with real hours and directions.',
    },
    restaurants: {
      key: 'restaurants', label: 'Restaurants',
      h1: 'Where Pattaya actually eats', em: 'actually',
      lead: 'From Thai street classics to seafood grills and international kitchens - a hand-picked, honestly-ranked guide to the city’s best restaurants. No paid placements.',
      title: 'Best Restaurants in Pattaya | Go To Pattaya',
      description: 'An honest, editor-curated guide to the best restaurants in Pattaya - Thai, seafood and international. No pay-to-play. Filter by area to find where to eat.',
    },
    markets: {
      key: 'markets', label: 'Night Markets',
      h1: 'Pattaya’s best night markets', em: 'night markets',
      lead: 'Street-food stalls, cheap eats and buzzing weekend crowds - the city’s liveliest night markets for a plate-in-hand dinner.',
      title: 'Best Night Markets in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to Pattaya’s night markets - the best street food, snacks and shopping after dark, with hours and directions.',
    },
  },
  'thinks-to-do': {
    temples: {
      key: 'temples', label: 'Temples & Culture',
      h1: 'Temples & culture in Pattaya', em: 'culture',
      lead: 'Golden temples, giant Buddhas and landmark attractions - the sights that give Pattaya its history and its best photos.',
      title: 'Temples, Culture & Landmarks in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to temples, culture and landmark attractions in Pattaya - what to see, opening hours and how to get there.',
    },
    diving: {
      key: 'diving', label: 'Diving & Snorkeling',
      h1: 'Diving & snorkeling in Pattaya', em: 'Diving',
      lead: 'PADI dive schools, wreck dives and easy snorkelling trips to the near islands - clear water and real, checked operators.',
      title: 'Diving & Snorkeling in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to diving and snorkelling in Pattaya - PADI schools, wreck dives and island snorkel trips, with prices and directions.',
    },
    beaches: {
      key: 'beaches', label: 'Beaches & Water Sports',
      h1: 'Beaches & water sports in Pattaya', em: 'Beaches',
      lead: 'Island beaches, jet skis, parasailing and water parks - everywhere to get on, in or under the water around Pattaya.',
      title: 'Beaches & Water Sports in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to beaches and water sports in Pattaya - islands, jet skis, parasailing and water parks, with directions.',
    },
    adventure: {
      key: 'adventure', label: 'Adventure & Adrenaline',
      h1: 'Adventure & adrenaline in Pattaya', em: 'adrenaline',
      lead: 'ATV trails, zip-lines, bungee, skydiving and go-kart tracks - the biggest thrills in and around the city.',
      title: 'Adventure & Adrenaline Activities in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to adventure and adrenaline in Pattaya - ATV, zip-lines, bungee, skydiving and karting, with prices and directions.',
    },
    rental: {
      key: 'rental', label: 'Bike & Car Rental',
      h1: 'Bike & car rental in Pattaya', em: 'rental',
      lead: 'Scooters, big bikes and cars from checked local shops - clear prices, deposits and the fine print, so you drive away sorted.',
      title: 'Bike & Car Rental in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to bike and car rental in Pattaya - scooters, motorbikes and cars, with real prices, deposits and directions.',
    },
    tours: {
      key: 'tours', label: 'Tours & Day Trips',
      h1: 'Tours & day trips from Pattaya', em: 'day trips',
      lead: 'Coral-island boat tours, city sightseeing and further-afield day trips - real, locally checked operators, not commission desks.',
      title: 'Tours & Day Trips from Pattaya | Go To Pattaya',
      description: 'A locally verified guide to tours and day trips from Pattaya - island boat tours, sightseeing and transfers, with real operators and prices.',
    },
  },
  'nightlife': {
    gogo: {
      key: 'gogo', label: 'Go-Go Bars',
      h1: 'Go-go bars in Pattaya', em: 'Go-go',
      lead: 'Walking Street and beyond - the city’s best-known go-go bars, with the honest lowdown on vibe, drinks and door.',
      title: 'Go-Go Bars in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to go-go bars in Pattaya - Walking Street and beyond, with the honest lowdown on vibe, hours and directions.',
    },
    clubs: {
      key: 'clubs', label: 'Clubs',
      h1: 'Nightclubs in Pattaya', em: 'Nightclubs',
      lead: 'World-ranked mega-clubs and Walking Street discos - where Pattaya dances until sunrise, with the music, cover and crowd for each.',
      title: 'Best Nightclubs in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to nightclubs in Pattaya - mega-clubs, EDM and Walking Street discos, with music, hours and directions.',
    },
    bars: {
      key: 'bars', label: 'Bars & Lounges',
      h1: 'Bars & lounges in Pattaya', em: 'lounges',
      lead: 'Rooftop lounges, craft-beer bars and easy neighbourhood spots - a drink for every mood, honestly ranked.',
      title: 'Best Bars & Lounges in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to bars and lounges in Pattaya - rooftops, craft beer and neighbourhood spots, with hours and directions.',
    },
  },
  'yoga-and-fitness': {
    'muay-thai': {
      key: 'muay-thai', label: 'Muay Thai',
      h1: 'Muay Thai camps in Pattaya', em: 'Muay Thai',
      lead: 'From tourist-friendly gyms to hardcore fighter camps - train the national sport with Pattaya’s highest-rated coaches.',
      title: 'Muay Thai Camps & Gyms in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to Muay Thai in Pattaya - camps and gyms for beginners to fighters, with real prices and directions.',
    },
    'martial-arts': {
      key: 'martial-arts', label: 'Martial Arts',
      h1: 'Martial arts in Pattaya', em: 'Martial arts',
      lead: 'BJJ, MMA, taekwondo and climbing walls - cross-train or start something new with checked local academies.',
      title: 'Martial Arts & MMA in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to martial arts in Pattaya - MMA, BJJ, taekwondo and climbing, with prices, hours and directions.',
    },
    yoga: {
      key: 'yoga', label: 'Yoga & Pilates',
      h1: 'Yoga & pilates in Pattaya', em: 'Yoga',
      lead: 'Studio classes, reformer pilates and drop-in flows - where Pattaya stretches, breathes and resets.',
      title: 'Yoga & Pilates Studios in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to yoga and pilates in Pattaya - studios, reformer classes and drop-in flows, with prices and directions.',
    },
    gyms: {
      key: 'gyms', label: 'Gyms & Fitness',
      h1: 'Gyms & fitness in Pattaya', em: 'fitness',
      lead: '24-hour gyms, CrossFit boxes and full-service fitness clubs - where to lift, sweat and stay on programme.',
      title: 'Best Gyms & Fitness in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to gyms and fitness in Pattaya - 24-hour gyms, CrossFit and fitness clubs, with prices, hours and directions.',
    },
  },
}

export interface SubExtra {
  intro: { en: string[]; ru: string[] }
  faqs: { q: { en: string; ru: string }; a: { en: string; ru: string } }[]
}

// Long-form editorial + FAQ for the thin subcategory pages (few venues => little
// on-page text). Kept bilingual inline so it renders in Russian without a
// dictionary round-trip. Keyed by "<category slug>/<group key>".
export const SUBEXTRA: Record<string, SubExtra> = {
  'eat-and-drinks/markets': {
    intro: {
      en: [
        "Pattaya's night markets are where the city really eats after dark. Once the heat drops, whole streets fill with charcoal smoke, sizzling woks and rows of plastic stools - and locals far outnumber tourists. Two markets anchor the scene: Thepprasit Night Market, the big weekend institution off Thepprasit Road, and Tree Town, a compact, everyday food-and-drink village in the heart of the city. Between them you get the full range, from a five-minute street snack to a sit-down seafood dinner with a cold beer.",
        "Come hungry. The stalls lean heavily on Thai street classics - pad thai cooked to order, grilled pork skewers (moo ping) with sticky rice, som tam pounded in front of you, whole grilled fish and prawns, and mango with coconut sticky rice to finish. Adventurous eaters will find fried insects and durian; cautious ones will find fried chicken, dumplings and fresh fruit shakes. Most single dishes run 40-120 baht, and a generous dinner for two rarely tops 400 baht.",
        "Thepprasit is busiest Friday to Sunday evenings, roughly 5pm until late; Tree Town runs every night and skews a little later. Both are easiest reached by baht-bus or a short Grab ride, and both are cash-first - bring small notes, as few stalls take cards. Prices on cooked food are fixed and fair, so there's no need to haggle over a plate; save the bargaining for clothes and souvenirs.",
        "The markets are about more than dinner. Thepprasit spreads into aisles of cheap clothing, phone cases, sunglasses and football shirts, while Tree Town pairs its food court with bars and live music, making it an easy first stop before a bigger night out. Go early for the food and the photos, later for the atmosphere - either way, arrive with an empty stomach and a bit of cash.",
      ],
      ru: [
        "Ночные рынки Паттайи — это место, где город по-настоящему ест после заката. Как только спадает жара, целые улицы наполняются дымом от углей, шипящими сковородами-вок и рядами пластиковых табуретов, а местных здесь куда больше, чем туристов. Сцену держат два рынка: Thepprasit Night Market — большой рынок выходного дня у Thepprasit Road, и Tree Town — компактная, работающая каждый день деревня еды и напитков в центре города. Вместе они дают весь диапазон: от пятиминутного перекуса до полноценного ужина с морепродуктами и холодным пивом.",
        "Приходите голодными. Прилавки держатся на тайской уличной классике — пад-тай, который готовят при вас, шашлычки из свинины (му пинг) с клейким рисом, сом-там, который отбивают прямо перед вами, рыба и креветки на гриле и манго с кокосовым клейким рисом на десерт. Любители экзотики найдут жареных насекомых и дуриан, осторожные — жареную курицу, пельмени и свежие фруктовые шейки. Большинство блюд стоит 40–120 бат, а сытный ужин на двоих редко превышает 400 бат.",
        "Thepprasit оживлённее всего с вечера пятницы по воскресенье, примерно с 17:00 и до поздна; Tree Town работает каждый вечер и закрывается чуть позже. До обоих проще всего добраться на бат-басе или коротком Grab, и оба принимают в первую очередь наличные — берите мелкие купюры, картой платят немногие прилавки. Цены на готовую еду фиксированные и честные, торговаться из-за тарелки не нужно; оставьте это для одежды и сувениров.",
        "Рынки — это не только ужин. Thepprasit расходится рядами дешёвой одежды, чехлов для телефонов, очков и футбольных футболок, а Tree Town дополняет фуд-корт барами и живой музыкой — удобная первая остановка перед большим вечером. Приходите пораньше за едой и фото, позже — за атмосферой; в любом случае возьмите с собой пустой желудок и немного наличных.",
      ],
    },
    faqs: [
      {
        q: { en: "What time do Pattaya's night markets open?", ru: "Во сколько открываются ночные рынки Паттайи?" },
        a: { en: "Thepprasit Night Market runs mainly Friday to Sunday from about 5pm until late, while Tree Town is open every evening and stays lively past midnight. Arrive by 6-7pm for the best choice of food before the busiest stalls sell out.", ru: "Thepprasit Night Market работает в основном с пятницы по воскресенье примерно с 17:00 и до поздна, а Tree Town открыт каждый вечер и остаётся оживлённым после полуночи. Приходите к 18:00–19:00 за лучшим выбором еды." },
      },
      {
        q: { en: "Which is the best night market in Pattaya for food?", ru: "Какой ночной рынок в Паттайе лучший для еды?" },
        a: { en: "For sheer variety and weekend buzz, Thepprasit is the classic choice; for a relaxed, any-night meal with bars nearby, Tree Town is more convenient. Both focus on Thai street food at similar prices.", ru: "За разнообразием и атмосферой выходного дня — это Thepprasit; за спокойным ужином в любой вечер с барами рядом удобнее Tree Town. Оба сосредоточены на тайском стрит-фуде по схожим ценам." },
      },
      {
        q: { en: "How much should I budget?", ru: "Какой бюджет закладывать?" },
        a: { en: "Individual dishes cost about 40-120 baht. A full dinner with drinks for two people usually comes to 300-400 baht. Bring cash in small notes, as most stalls don't accept cards.", ru: "Отдельные блюда стоят около 40–120 бат. Полный ужин с напитками на двоих обычно выходит в 300–400 бат. Берите наличные мелкими купюрами — картой принимают немногие." },
      },
      {
        q: { en: "Do I need to bargain?", ru: "Нужно ли торговаться?" },
        a: { en: "Not for cooked food - prices are fixed and reasonable. You can politely negotiate on clothing, souvenirs and accessories, especially if buying more than one item.", ru: "За готовую еду — нет, цены фиксированные и разумные. Вежливо поторговаться можно за одежду, сувениры и аксессуары, особенно если берёте несколько вещей." },
      },
    ],
  },
  'yoga-and-fitness/yoga': {
    intro: {
      en: [
        "Pattaya's yoga scene is small but genuinely good, built around a handful of dedicated studios rather than hotel-gym afterthoughts. You'll find classic vinyasa and hatha flows, hot yoga, reformer Pilates and the occasional aerial or yin class - enough variety to keep a daily practice interesting whether you're here for a week or a season. Most studios cluster around Central Pattaya, Pratumnak and Jomtien, so wherever you're based there's usually a mat within a short ride.",
        "Classes are welcoming to all levels and taught in English, with many instructors also speaking Thai or Russian. Drop-ins are the norm, so you don't need to commit to a membership - expect to pay roughly 300-500 baht for a single class, with cheaper five- and ten-class passes and monthly unlimited options for longer stays. Mats, blocks and props are provided; just bring water and a towel, because even an early class works up a sweat in the Pattaya heat.",
        "Mornings are the sweet spot. A 7-9am class lets you practise before the sun and humidity peak, and studios are noticeably calmer than the evening rush after work. Reformer Pilates and small-group sessions book out fastest, so message the studio ahead on the day; open-level yoga classes almost always have space for a walk-in.",
        "Beyond the regular timetable, several studios run beginner courses, teacher trainings and one-off workshops in breathwork, sound healing and meditation. If you're chasing a full reset, pair a morning practice with one of the city's spas or a quiet Pratumnak beach afternoon - Pattaya makes it easy to build your own low-key wellness routine without booking an expensive retreat.",
      ],
      ru: [
        "Йога-сцена Паттайи небольшая, но по-настоящему хорошая — она держится на нескольких специализированных студиях, а не на залах при отелях. Здесь есть классические виньяса и хатха, горячая йога, пилатес на реформерах и время от времени аэройога или инь-йога — достаточно разнообразия, чтобы поддерживать ежедневную практику, приехали вы на неделю или на сезон. Большинство студий сосредоточено в Центральной Паттайе, на Пратамнаке и в Джомтьене, так что где бы вы ни остановились, коврик обычно в паре минут езды.",
        "Занятия дружелюбны к любому уровню и ведутся на английском, многие преподаватели также говорят по-тайски или по-русски. Разовые визиты — норма, так что абонемент не обязателен: одно занятие стоит примерно 300–500 бат, дешевле выходят абонементы на пять и десять занятий и безлимит на месяц для долгих поездок. Коврики, блоки и реквизит выдают; берите с собой воду и полотенце — даже раннее занятие в жару Паттайи заставляет попотеть.",
        "Утро — лучшее время. Занятие в 7–9 утра позволяет практиковать до пика солнца и влажности, и студии заметно спокойнее вечернего наплыва после работы. Пилатес на реформерах и занятия в малых группах разбирают быстрее всего, поэтому напишите в студию заранее в тот же день; на открытые классы йоги почти всегда есть место для тех, кто пришёл без записи.",
        "Помимо обычного расписания, несколько студий проводят курсы для начинающих, обучение преподавателей и разовые воркшопы по дыханию, саунд-хилингу и медитации. Если вам нужна полная перезагрузка, соедините утреннюю практику со спа или тихим днём на пляже Пратамнака — Паттайя позволяет собрать собственный ненавязчивый велнес-режим без дорогого ретрита.",
      ],
    },
    faqs: [
      {
        q: { en: "How much does a yoga class cost in Pattaya?", ru: "Сколько стоит занятие йогой в Паттайе?" },
        a: { en: "A single drop-in class is usually 300-500 baht. Multi-class passes and monthly unlimited memberships bring the per-class price down and suit longer stays.", ru: "Разовое занятие обычно стоит 300–500 бат. Абонементы на несколько занятий и безлимит на месяц снижают цену за занятие и подходят для длительных поездок." },
      },
      {
        q: { en: "Do I need to book in advance?", ru: "Нужно ли записываться заранее?" },
        a: { en: "Open-level yoga classes usually welcome walk-ins, but reformer Pilates and small-group sessions have limited spots and can fill up - message the studio the same morning to reserve a place.", ru: "На открытые занятия йогой обычно можно прийти без записи, но пилатес на реформерах и малые группы имеют ограниченное число мест и могут заполниться — напишите в студию тем же утром, чтобы забронировать место." },
      },
      {
        q: { en: "Are classes suitable for beginners?", ru: "Подходят ли занятия для начинающих?" },
        a: { en: "Yes. Most studios run open-level and dedicated beginner classes, taught in English, with mats and props provided. Tell the teacher if it's your first class and they'll offer easier variations.", ru: "Да. В большинстве студий есть открытые и отдельные занятия для начинающих на английском, с ковриками и реквизитом. Скажите преподавателю, что это ваш первый класс, и вам предложат более простые варианты." },
      },
      {
        q: { en: "When is the best time to practise?", ru: "Когда лучше всего заниматься?" },
        a: { en: "Early morning (around 7-9am) is coolest and calmest, before Pattaya's heat and humidity peak. Evening classes are livelier but busier after the working day.", ru: "Раннее утро (около 7–9) — самое прохладное и спокойное время, до пика жары и влажности. Вечерние занятия оживлённее, но многолюднее после рабочего дня." },
      },
    ],
  },
}

