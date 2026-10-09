/* =====================================================================
   PROJECTS — single source of truth for Home, Work, Project detail and
   Playground. Add a new work by adding an entry here.

   id        : used in the URL  -> project.html?id=<id>
   title     : project name
   kind      : short category label
   cats      : filters: ux | brand | graphic | motion
   summary   : one line, shown on cards
   about     : intro paragraph on the project page
   year      : shown on cards ('' hides it)
   published : publish date on Behance
   tags      : small chips
   tools     : '' or list of tools actually used
   facts     : [label, value] pairs shown in the project sidebar
   writeup   : sections of the on-site write-up
               { h: 'Heading', p: ['paragraph', ...], list: ['item', ...], quotes: ['...'] }
   img       : cover image path, w/h = its real pixel size (keeps ratio)
   behance   : external link
   color     : pink | blue | sun | mint | sky | lilac | ink (card backing colour)
   featured  : true = shown in the Home "Selected work" grid
   board     : optional array of long-form case study images

   Sources: Behance project pages (descriptions, dates, tags), the earlier
   portfolio copy, and what is visible in each cover image.
   ===================================================================== */
window.PROJECTS = [
  {
    id: 'shopup', title: 'ShopUp', kind: 'UI/UX case study', cats: ['ux'], color: 'lilac', featured: true,
    summary: 'Shop smarter with faster delivery, better deals and personalised recommendations.',
    about: 'ShopUp is a next-gen shopping app concept that personalises the experience using AI-driven recommendations. The case study explores a minimalist, user-centric approach to mobile shopping and follows a full design-thinking process, from research to high-fidelity UI.',
    year: '2026', published: 'May 2026', tags: ['Mobile', 'Ecommerce', 'Case study'], tools: ['Figma', 'Miro', 'Illustrator', 'Google Forms'],
    img: 'assets/img/shopup.jpg', w: 1448, h: 1086,
    behance: 'https://www.behance.net/gallery/248983891/ShopUp-Case-Study',
    facts: [['Type', 'UI/UX case study'], ['Platform', 'Mobile app'], ['Published', 'May 2026'], ['Tools', 'Figma, Miro, Illustrator, Google Forms']],
    writeup: [
      { h: 'Why this project', p: ['Unlike generic e-commerce giants, ShopUp is designed with the user at the centre: a smarter, more personalised shopping experience using AI-powered recommendations that understand taste, needs and budget.', 'A clutter-free interface, fast delivery and real-time customer support aim to make shopping seamless, not stressful, while curated collections, exclusive deals and local seller support help people discover unique products.'] },
      { h: 'What users told me', p: ['Research surfaced recurring pain points, including:'], quotes: ['I often get delayed or wrong deliveries, and the tracking information isn’t clear or updated.', 'I get overwhelmed navigating through the app filters, menus, and categories aren’t intuitive.'] },
      { h: 'The logo', p: ['The ShopUp mark combines a delivery truck and a shopping basket into one fast-moving cart. It stands for quick deliveries and a seamless experience, while the bold blue conveys trust, reliability and innovation.'] }
    ],
    role: ['Design Strategy', 'Problem Solution', 'Information Architecture', 'Empathy Mapping', 'Usability Testing', 'User Flow', 'Prototyping', 'Wireframes', 'Competitive Analysis', 'Visual Design', 'User Research', 'User Persona'],
    process: [
      ['Empathize', 'User research, user interviews, competitive analysis'],
      ['Define', 'User persona, goal statement, empathy mapping'],
      ['Ideate', 'Brainstorming, card sorting, user flow'],
      ['Design', 'Paper wireframing, visual design, prototype'],
      ['Testing', 'Usability checks, survey insights, improvements']
    ],
    board: Array.from({ length: 16 }, function (_, i) { return 'assets/img/shopup/board-' + String(i).padStart(2, '0') + '.jpg'; })
  },
  {
    id: 'volt-47', title: 'VOLT 47', kind: 'Brand identity', cats: ['brand', 'motion'], color: 'ink', featured: true,
    summary: 'A 24/7 gym brand where the lights never go off.',
    about: 'VOLT 47 is a self-initiated brand identity and logo animation for a 24-hour gym in a dense city: the kind of place that fills at 6am, empties at noon and fills again long after midnight.',
    year: '2026', published: 'Oct 2026', tags: ['Brand identity', 'Logo animation'], tools: '',
    img: 'assets/img/volt47.jpg', w: 1100, h: 826,
    behance: 'https://www.behance.net/gallery/256688019/VOLT-47-247-Gym-Brand-Identity-Logo-Animation',
    facts: [['Type', 'Self-initiated concept'], ['Tagline', 'Lights never go off'], ['Typefaces', 'Anton, Space Grotesk'], ['Published', 'Oct 2026']],
    writeup: [
      { h: 'The mark', p: ['One shape, read three ways: a wedge cut at 23°, three barbell plates locking around it, and a bolt struck out of the middle as negative space.'] },
      { h: 'One angle, everywhere', p: ['That 23° angle runs through everything after it: the badge, the slash pattern, the stripes on the towel and the locker tag.', 'The whole system is flat vector geometry with no strokes and no live effects, so it holds from a 16px app icon to a lit shopfront sign.'] },
      { h: 'Black room, one light', p: ['Volt is the only colour that gets to shout, and never more than once per layout. Type is set in Anton and Space Grotesk.'] },
      { h: 'Deliverables', list: ['Logo suite', 'Colour and type system', 'Pattern', 'Eight brand applications', 'Three-post social kit', 'Eight-second logo reveal with sound, 1920×1080'] },
      { h: 'Note', p: ['VOLT 47 is a fictional brand and is not affiliated with any existing business.'] }
    ]
  },
  {
    id: 'watien', title: 'WATIEN', kind: 'Brand identity', cats: ['brand'], color: 'mint', featured: true,
    summary: 'Brand identity for a boutique for the modern soul.',
    about: 'A brand identity for WATIEN Boutique, "a boutique for the modern soul": logo, colours, typography and brand applications, built on four words: luxury, elegance, culture and modern.',
    year: '2025', published: 'Apr 2025', tags: ['Branding', 'Brand system'], tools: '',
    img: 'assets/img/watien.jpg', w: 1415, h: 1111,
    behance: 'https://www.behance.net/gallery/224066753/WATIEN',
    facts: [['Type', 'Brand identity'], ['Palette', 'Deep green and gold'], ['Published', 'Apr 2025']],
    writeup: [
      { h: 'The mark', p: ['An illustrated portrait inside an arched frame: a figure with a sleek bob, gold lips and sculptural statement earrings, paired with a high-contrast serif wordmark and a lighter "Boutique" line between rules.'] },
      { h: 'Colour', p: ['A two-colour palette of deep forest green and soft gold, used on cream paper stock, so the identity reads as quiet luxury rather than loud fashion.'] },
      { h: 'Applications shown', list: ['Primary logo card', 'Swing tag in green with gold foil', 'Storefront window decal', 'Colour and values card', 'Typography and brand applications'] }
    ]
  },
  {
    id: 'talksy', title: 'Talksy', kind: 'App design', cats: ['ux'], color: 'pink', featured: true,
    summary: 'A messaging app, redrawn. Connect. Share. Feel heard.',
    about: 'App design for Talksy, a messaging app built around "a more meaningful way to chat". The project covers the app icon, the welcome screen and the chat experience.',
    year: '2025', published: 'Sep 2025', tags: ['Mobile app', 'Chat UX'], tools: ['Figma'],
    img: 'assets/img/talksy.jpg', w: 1448, h: 1086,
    behance: 'https://www.behance.net/gallery/233957851/Talksy-App',
    facts: [['Type', 'App design'], ['Platform', 'Mobile'], ['Tool', 'Figma'], ['Published', 'Sep 2025']],
    writeup: [
      { h: 'Identity', p: ['The app icon is a profile in a circle, in lilac and sky blue: a face in conversation, which sets the soft, human tone for the whole app.'] },
      { h: 'Welcome screen', p: ['A single clear promise, "Connect. Share. Feel heard. Anywhere.", with one primary action, Start Messaging, so a new user knows exactly what to do next.'] },
      { h: 'Chat screen', list: ['Header with contact, "last seen recently" status, call and menu actions', 'Expressive marbled chat wallpaper', 'Friendly empty state: "No messages here yet. Send a message to start conversation"', 'Composer with attachment and voice note controls'] }
    ]
  },
  {
    id: 'palmonas', title: 'Palmonas', kind: 'Website design', cats: ['ux', 'graphic'], color: 'sun',
    summary: 'E-commerce UI/UX for a demi-fine jewellery brand.',
    about: 'A landing page and hero section design for Palmonas, a demi-fine jewellery brand, balancing editorial restraint with conversion intent.',
    year: '2025', published: 'Jun 2025', tags: ['Landing page', 'Ecommerce', 'Prototyping'], tools: '',
    img: 'assets/img/palmonas.jpg', w: 1559, h: 1009,
    behance: 'https://www.behance.net/gallery/228224345/Hero-Section-%28Palmonas%29',
    facts: [['Type', 'Website / hero section'], ['Focus', 'E-commerce UI/UX'], ['Published', 'Jun 2025']],
    writeup: [
      { h: 'The hero', p: ['A soft lilac campaign banner pairs a script "Sale" headline with a bold offer block, "End of season, Buy 1 Get 1 Free, use code EOSS", and a single Shop Now action, with carousel dots for the next banners.'] },
      { h: 'Page structure', list: ['Header with a gifting search ("Search gifts for your dearest...") and category navigation', '"Everyday demi-fine jewellery" row: Mangalsutra, Rings, Earrings, Bracelets', 'Collection cards on pink: Made for Stunting, For the Love of Me, Stackables Glam', 'Mega sale banner and an occasion carousel (wedding wear, office wear)', '"Shop with confidence" trust row: skin safe, 18K gold vermeil, authentic diamonds', 'Footer with help, about and payment methods'] },
      { h: 'Visual direction', p: ['Warm cream backgrounds, rose-pink campaign colour and editorial photography keep the store feeling premium, while every section still ends in a clear way to shop.'] }
    ]
  },
  {
    id: 'bewakoof', title: 'Bewakoof', kind: 'Heuristic evaluation', cats: ['ux'], color: 'sun',
    summary: "What's working and what isn't across a high-traffic ecommerce funnel.",
    about: "A heuristic evaluation of the Bewakoof shopping app: a structured review of what's working and what isn't across a high-traffic ecommerce funnel.",
    year: '2025', published: 'Jul 2025', tags: ['UX research', 'Audit'], tools: ['Figma'],
    img: 'assets/img/bewakoof.jpg', w: 1448, h: 1086,
    behance: 'https://www.behance.net/gallery/229827375/Heuristic-Evaluation-%28Bewakoof%29',
    facts: [['Type', 'Heuristic evaluation'], ['Platform', 'Mobile shopping app'], ['Tool', 'Figma'], ['Published', 'Jul 2025']],
    writeup: [
      { h: 'What a heuristic evaluation is', p: ['An expert review of an interface against established usability principles. It is a fast way to find friction before running costly user tests.'] },
      { h: 'Screens in focus', list: ['Home: stories row (Specials, Shop Now, Plus Size, Accessories) and promotional banners', 'Offer cards such as "Joggers, buy 2 at ₹1699"', 'New Arrivals and product discovery', 'Bottom navigation: Men, Categories, Studio, Profile'] }
    ]
  },
  {
    id: 'logofolio', title: 'Logofolio', kind: 'Logo design', cats: ['brand'], color: 'sky',
    summary: 'Selected marks across different brands and styles.',
    about: 'A collection of logo designs across different brands and styles, from energetic sports-style marks to refined geometric emblems.',
    year: '2025', published: 'Apr 2025', tags: ['Logo design', 'Brand identity'], tools: '',
    img: 'assets/img/logofolio.jpg', w: 1415, h: 1111,
    behance: 'https://www.behance.net/gallery/222859787/Logofolio',
    facts: [['Type', 'Logo collection'], ['Published', 'Apr 2025']],
    writeup: [
      { h: 'Selected marks', list: ['Zero Energy: a "Z" split by a lightning bolt, with the line "No limits, just power"', 'Fabrisse: a symmetrical geometric emblem with a spaced serif wordmark', 'Redmagic: a monoline "R" built from parallel strokes'] },
      { h: 'Range', p: ['The set moves between bold, high-energy marks and quiet, premium ones, showing how the same geometric thinking adapts to very different brand personalities.'] }
    ]
  },
  {
    id: 'dune-escape', title: 'DuneEscape', kind: 'Parallax UI animation', cats: ['motion'], color: 'sun',
    summary: 'A multi-layer parallax animation for a luxury desert-retreat website.',
    about: 'A multi-layer parallax animation built in After Effects for DuneEscape, a luxury desert-retreat landing page, showing depth and motion control.',
    year: '2025', published: 'Jun 2025', tags: ['Parallax', 'UI animation'], tools: ['After Effects'],
    img: 'assets/img/parallax-dune.jpg', w: 1448, h: 1086,
    behance: 'https://www.behance.net/gallery/228225099/Parallax-Animation',
    facts: [['Type', 'Parallax UI animation'], ['Tool', 'After Effects'], ['Published', 'Jun 2025']],
    writeup: [
      { h: 'The scene', p: ['A golden dune landscape split into separate layers, with an oversized serif "sands" set among them so the type and the landscape move at different speeds and create depth.'] },
      { h: 'Interface', list: ['Navigation: Home, About, Experiences, Sustainability, Contact', 'Headline: "a luxury retreat nested in the heart of the golden sands", mixing script and sans serif', 'Outlined "Explore the resort" action and slider arrows'] }
    ]
  },
  {
    id: 'achilles', title: 'Achilles', kind: 'Parallax UI animation', cats: ['motion'], color: 'sky',
    summary: 'A parallax study built around a coastal landing-page hero.',
    about: 'A second parallax study with layered depth, built around a coastal landing-page hero for Achilles Point.',
    year: '2025', published: 'Jun 2025', tags: ['Parallax', 'Web'], tools: ['Figma'],
    img: 'assets/img/parallax-achilles.jpg', w: 1448, h: 1086,
    behance: 'https://www.behance.net/gallery/228224255/Parallax',
    facts: [['Type', 'Parallax UI'], ['Tool', 'Figma'], ['Published', 'Jun 2025']],
    writeup: [
      { h: 'The hero', p: ['The headline "Achilles" is filled with the coastline itself, so the image shows through the letters while foreground bush and rocks sit on their own layers in front.'] },
      { h: 'Interface', list: ['Navigation: Home, Customize, Pricing, Our Work, Contact', 'Short intro on Achilles Point’s rocky coastline, native bush and Rangitoto Island view', 'Single pill-shaped "Book Now" action'] }
    ]
  },
  {
    id: 'social-media', title: 'Social media designs', kind: 'Graphic design', cats: ['graphic'], color: 'pink',
    summary: 'Campaign and content creatives: posts, banners and ad creatives.',
    about: 'A set of campaign and content creatives across platforms: posts, banners and ad creatives for brands, promotions and campaigns.',
    year: '2025', published: 'Apr 2025', tags: ['Social media', 'Advertising'], tools: '',
    img: 'assets/img/social-media.jpg', w: 1254, h: 1254,
    behance: 'https://www.behance.net/gallery/223899689/Social-Media-Posts',
    facts: [['Type', 'Social media & ad creatives'], ['Formats', 'Posts, banners, ad creatives'], ['Published', 'Apr 2025']],
    writeup: [
      { h: 'Creatives shown', list: ['Gaming chair "Black Friday super sale" with a 50% discount offer', 'Biryani promotion: "Special delicious, limited time only, 50% save"', 'Sneaker ad with repeated outline type and an "Only $50" price tag', 'Organic argan oil skincare post: "Innovative beauty solutions"'] },
      { h: 'Approach', p: ['Each piece leads with one clear message, a strong product cut-out and a single call to action, while colour and type change to match each brand’s category, from bold red retail to soft green skincare.'] }
    ]
  }
];

window.CONTACT = {
  email: 'vivekgupta9661@gmail.com',
  behance: 'https://www.behance.net/vivekgupta143',
  linkedin: 'https://www.linkedin.com/in/vivek-kumar-9641312a8',
  instagram: 'https://www.instagram.com/16__vivek__'
};

/* Card backing colours, from the design system */
window.SWATCH = { pink: '#FF5A8C', blue: '#3350FF', sun: '#FFCF33', mint: '#6FE3B2', sky: '#7FD8F5', lilac: '#9DB0FF', ink: '#1C1747' };
