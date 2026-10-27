/* =====================================================================
   PROJECTS: the single source of truth for Home, Work and every project page.
   Add a project by adding an entry here, then run: python tools/build-share.py

   Every project has the same fields, in this order:

   Card and hero
     id        : used in the URL, project-<id>.html
     title     : project name
     kind      : short category label
     cats      : filters, any of ux | brand | graphic | motion
     color     : card colour, pink | blue | sun | mint | sky | lilac | ink
     featured  : true = shown in the Home "Selected work" grid (keep to 4)
     summary   : one line, shown on cards
     about     : intro paragraph on the project page
     year      : shown on cards
     published : publish date on Behance
     tags      : small chips
     tools     : tools used, from the Behance page
     img, w, h : cover image and its real pixel size
     behance   : link to the full presentation

   Project page, top to bottom
     facts     : [label, value], always Type, Medium, Tools, Published
     writeup   : always three sections: The challenge, The approach, The details
                { h, p: [paragraphs], list: [items], quotes: [quotes] }
                 The challenge is always one intro line + a list (the boxed style), on every project
     credits   : optional small print under the write-up (music, AI use, disclaimers)
     role      : chips under "My role"
     process   : five steps under "Design process", [name, what happened]
     outcome   : { note, delivered, measure, shows }. No invented results: concept work says so.
     gallery   : 1 to 4 key boards from Behance, [path, w, h, caption]
     video     : optional, the films from the Behance post. { label, host, items: [[id, w, h, title]] }
                 host is 'vimeo' (default), 'youtube' or 'file' (id = assets/video/<id>.mp4, played on the page)
                 the poster is assets/img/video/<id>.webp; nothing loads until someone presses play
     loop      : optional, a short silent clip that plays over the card cover on hover (assets/video/loop/<id>.mp4)
   ===================================================================== */
window.PROJECTS = [
  {
    id: 'fikr', title: 'FIKR', kind: 'UI/UX case study', cats: ['ux', 'motion'], color: 'blue', featured: true,
    summary: 'Medicine care for a parent who lives far away.',
    about: 'Every evening, millions of adult children ask, "Papa, medicines le liye?" The answer is always "Haan beta." But nobody can be sure. FIKR (फ़िक्र) is a concept app designed to ease this worry without making parents feel monitored.',
    year: '2026', published: 'Oct 2026', tags: ['Mobile app', 'Healthcare', 'Motion'],
    tools: ['Figma', 'Photoshop', 'After Effects'],
    img: 'assets/img/covers/fikr.webp', w: 1400, h: 1079,
    behance: 'https://www.behance.net/gallery/256988001/FIKR-Medicine-Care-UXUI-Case-Study',

    facts: [['Type', 'Concept UI/UX case study'], ['Medium', 'Mobile app'], ['Tools', 'Figma, Photoshop, After Effects'], ['Published', 'Oct 2026']],
    writeup: [
      { h: 'The challenge', p: ['Five interviews surfaced two things:'], list: ['Being asked can hurt more than taking the medicine', 'Routines often break during trips, illness or festivals'] },
      { h: 'The approach', p: ['Parents tap one haldi button: Taken. The child sees silence when all is well, and a clear alert when something needs attention. FIKR turns everyday worry into quiet reassurance, without making parents feel monitored.'] },
      { h: 'The details', list: ['One large "Taken" button, and one action per screen', 'Large type for older eyes', 'A bilingual interface with a spoken language option', 'A Material 3 design system with a night mode'] }
    ],
    credits: 'Concept project. Persona photos are AI-generated. Music: "Classical Vibes 4" by Mixkit.',
    role: ['User research', 'Affinity mapping', 'Personas', 'User flows', 'Wireframes', 'Logo design', 'Design system', 'UI design', 'Motion design'],
    process: [
      ['Research', 'Five interviews and affinity mapping'],
      ['Define', 'Personas and the core problem'],
      ['Ideate', 'User flows and wireframes'],
      ['Design', 'Logo, Material 3 system and final screens'],
      ['Animate', 'An After Effects film of the app']
    ],
    outcome: {
      note: 'A concept project, so these are the results it is designed for, not live numbers.',
      delivered: ['Research from five interviews, with affinity mapping', 'Personas, user flows and wireframes', 'A Material 3 design system with a night mode', 'Final screens and an After Effects film'],
      measure: ['Doses marked "Taken" each day, without a reminder', 'How often children open the app to check (fewer is better: silence means all is well)', 'Missed-dose alerts followed by a call the same day', 'Whether parents feel checked on less, in follow-up interviews'],
      shows: ['Turning interview insights into one clear decision: a single button', 'Designing for older users: large type and one action per screen', 'A bilingual interface with a spoken language option', 'Motion used to tell the story']
    },
    gallery: [
      ['assets/img/gallery/fikr/01.webp', 1400, 3319, 'Personas'],
      ['assets/img/gallery/fikr/02.webp', 1400, 4040, 'One tap to say "Taken"'],
      ['assets/img/gallery/fikr/03.webp', 1400, 2355, 'Colours'],
      ['assets/img/gallery/fikr/04.webp', 1400, 3201, 'The Taken screen, day and night']
    ],
    video: { label: 'film', items: [['1234786917', 1920, 1080, 'FIKR film']] },
    loop: 'assets/video/loop/fikr.mp4'
  },
  {
    id: 'volt-47', title: 'VOLT 47', kind: 'Brand identity', cats: ['brand', 'motion'], color: 'ink', featured: true,
    summary: 'A 24/7 gym brand where the lights never go off.',
    about: 'VOLT 47 is a self-initiated brand identity and logo animation for a 24-hour gym in a dense city: the kind of place that fills at 6am, empties at noon and fills again long after midnight.',
    year: '2026', published: 'Oct 2026', tags: ['Motion', 'Brand identity', 'Logo animation'],
    tools: ['Illustrator', 'Photoshop', 'Figma', 'After Effects'],
    img: 'assets/img/covers/volt-47.jpg', w: 1100, h: 826,
    behance: 'https://www.behance.net/gallery/256688019/VOLT-47-247-Gym-Brand-Identity-Logo-Animation',

    facts: [['Type', 'Self-initiated brand identity'], ['Medium', 'Logo, print, signage, social, motion'], ['Tools', 'Illustrator, Photoshop, Figma, After Effects'], ['Published', 'Oct 2026']],
    writeup: [
      { h: 'The challenge', p: ['A 24-hour gym never closes, so its identity has to:'], list: ['Work at any hour, day or night', 'Hold at any size, from a 16px app icon to a lit shopfront sign'] },
      { h: 'The approach', p: ['One shape, read three ways: a wedge cut at 23°, three barbell plates locking around it, and a bolt struck out of the middle as negative space. That 23° angle then runs through everything after it.'] },
      { h: 'The details', list: ['The angle shapes the badge, the slash pattern, the towel stripes and the locker tag', 'Flat vector geometry with no strokes or live effects, so it holds at any size', 'Volt is the only colour that shouts, and never more than once per layout', 'Type set in Anton and Space Grotesk', 'An eight-second logo reveal with sound, 1920×1080'] }
    ],
    credits: 'VOLT 47 is a fictional brand and is not affiliated with any existing business.',
    role: ['Logo design', 'Visual identity', 'Colour system', 'Typography', 'Pattern design', 'Brand applications', 'Social media design', 'Logo animation'],
    process: [
      ['Idea', 'One angle: 23°'],
      ['Mark', 'A wedge, three plates and a bolt'],
      ['System', 'Colour, type and the slash pattern'],
      ['Apply', 'Eight brand applications and a social kit'],
      ['Animate', 'An eight-second logo reveal with sound']
    ],
    outcome: {
      note: 'A self-initiated concept, so these are the checks it is designed to pass, not live numbers.',
      delivered: ['Logo suite, colour and type system', 'A pattern built on the 23° angle', 'Eight brand applications and a three-post social kit', 'An eight-second logo reveal with sound'],
      measure: ['Recognition of the mark at app-icon size and on a lit sign', 'Consistency: every touchpoint built from one angle and one accent colour', 'Quick recall: can people redraw the mark after a glance', 'Engagement on the launch posts'],
      shows: ['Building a whole identity from one idea', 'Restraint with colour: one light in a black room', 'Systems thinking from a 16px icon to a shopfront', 'Logo animation and sound']
    },
    gallery: [
      ['assets/img/gallery/volt-47/01.webp', 1400, 950, 'Three readings, one mark'],
      ['assets/img/gallery/volt-47/02.webp', 1400, 1400, 'One angle, one light, two typefaces'],
      ['assets/img/gallery/volt-47/03.webp', 1400, 1400, 'Open 24/7'],
      ['assets/img/gallery/volt-47/04.webp', 1400, 1260, 'Carried, worn, hung up']
    ],
    video: { label: 'logo reveal', host: 'file', items: [['volt-47-reveal', 1280, 720, 'VOLT 47 logo reveal']] },
    loop: 'assets/video/loop/volt-47.mp4'
  },
  {
    id: 'shady', title: 'Shady?', kind: 'UI/UX case study', cats: ['ux', 'motion'], color: 'lilac', featured: true,
    summary: 'An AI scam checker for families: a calm answer, and the why, in seconds.',
    about: "Shady is a concept AI scam checker built for families, including first-time smartphone users. Paste any message and get a calm answer (Likely a scam, Not sure or Likely safe) with the red flags underlined in your own words and one clear next step. When it isn't sure, Shady asks someone you trust.",
    year: '2026', published: 'Oct 2026', tags: ['AI product', 'Web app', 'Motion'],
    tools: ['Figma', 'Illustrator', 'After Effects'],
    img: 'assets/img/covers/shady.webp', w: 808, h: 632,
    behance: 'https://www.behance.net/gallery/257390493/Shady-AI-Scam-Checker-UIUX-Case-Study',

    facts: [['Type', 'Concept UI/UX case study'], ['Medium', 'Web app (installable), phone to desktop'], ['Tools', 'Figma, Illustrator, After Effects'], ['Published', 'Oct 2026']],
    writeup: [
      { h: 'The challenge', p: ['Scams win on speed and silence:'], list: ['57% of adults worldwide met a scam last year', '64% of scams are over within a day of first contact', '22% of targeted older people told no one because they felt too embarrassed', 'Existing checkers give a score, but people need the why, in their own language, and someone to ask'] },
      { h: 'The approach', p: ['Not a score, but an answer with the evidence. Shady gives an honest verdict with its confidence in words, underlines the red flags in the message itself and offers one clear next step. When it is not sure, one tap sends the message to someone you trust, and their reply comes back in the app.'] },
      { h: 'The details', list: ['Honest, not absolute: always "likely", never "100% safe"', 'Every verdict points to the exact words, links or numbers', 'A "Take a breath" pause, because scammers want you to rush', 'Names, numbers and accounts are blurred before checking', 'Accessible by default: 18px text, 48px targets, 4.5:1 contrast, voice in and out, and verdicts never shown by colour alone', 'One light and dark design system, where every colour is a token'] }
    ],
    credits: 'Concept project. Statistics: GASA and Feedzai, Global State of Scams 2025; Age UK.',
    role: ['Competitive research', 'Personas', 'User flows', 'AI UX principles', 'Design system', 'UI design', 'Accessibility', 'Prototyping', 'Motion design'],
    process: [
      ['Research', 'Five scam checkers compared, three personas'],
      ['Define', 'Seven rules for an AI people can trust'],
      ['Design', 'A calm light and dark system, 16 app and 6 web screens'],
      ['Build', 'A working, installable web-app prototype'],
      ['Launch', 'A 41-second launch film']
    ],
    outcome: {
      note: 'A concept project. The prototype numbers come from my own tests; the rest are the results it is designed for, not live numbers.',
      delivered: ['Brand, logo and a light and dark design system', '16 app screens and 6 web screens', 'A working web-app prototype: 36 of 36 tested flows pass, and 10 of 10 test messages are judged right', 'A 41-second launch film'],
      measure: ['Time from pasting a message to knowing what to do', 'How often "Not sure" ends with a reply from family', 'Scams stopped before anyone clicks or pays', 'Whether older users feel calmer, and less embarrassed to ask'],
      shows: ['Designing AI people can trust: honest, explainable and easy to correct', 'Accessibility built in from the first screen', 'Taking a product from research to a working prototype', 'Motion used to tell the story']
    },
    gallery: [
      ['assets/img/gallery/shady/01.webp', 1400, 1100, 'Four calm steps'],
      ['assets/img/gallery/shady/02.webp', 1400, 1180, 'Not a score: an answer, with the evidence'],
      ['assets/img/gallery/shady/03.webp', 1400, 1060, 'Not sure? Shady asks a human'],
      ['assets/img/gallery/shady/04.webp', 1400, 1260, 'One calm system, light and dark']
    ],
    video: { label: 'animation', items: [['1237869620', 1920, 1080, 'Shady? animation']] },
    loop: 'assets/video/loop/shady.mp4'
  },
  {
    id: 'chashni', title: 'CHASHNI', kind: 'Social campaign + packaging', cats: ['brand', 'graphic', 'motion'], color: 'sun', featured: true,
    summary: 'A Diwali mithai brand whose box names the sweet before anyone opens it.',
    about: 'CHASHNI is a concept Diwali gifting brand named after the sugar syrup that binds every mithai, and after the test a halwai uses to judge it: one thread between finger and thumb. Every Diwali the same gift box does the rounds unopened, because nothing on it says what is inside. CHASHNI puts the answer on the lid.',
    year: '2026', published: 'Oct 2026', tags: ['Motion', 'Packaging', 'Social campaign', 'Brand identity'],
    tools: ['Illustrator', 'Photoshop', 'After Effects', 'Adobe Firefly', 'Google Veo', 'Google Flow', 'ElevenLabs'],
    img: 'assets/img/covers/chashni.jpg', w: 1400, h: 1095,
    behance: 'https://www.behance.net/gallery/256926977/CHASHNI-This-one-stops-here',

    facts: [['Type', 'Concept brand, packaging and campaign'], ['Medium', 'Packaging, reels, carousels'], ['Tools', 'Illustrator, Photoshop, After Effects, Adobe Firefly, Google Veo, Google Flow, ElevenLabs'], ['Published', 'Oct 2026']],
    writeup: [
      { h: 'The challenge', p: ['Every Diwali, the same gift box does the rounds unopened:'], list: ['Nothing on the box says what is inside', 'So it gets passed on instead of opened'] },
      { h: 'The approach', p: ['One mark, one colour variable, four sweets. The pour on the lid and the drawer take the colour of the sweet, so the box names what it holds before anyone opens it.', 'The identity is bilingual, set in Devanagari and Latin.'] },
      { h: 'The details', p: ['The campaign runs on a single line, "This one stops here", which lands three different ways across three reels:'], list: ['The Test: the standard', 'The Count: the problem', 'Keep One: the box you keep for yourself'] }
    ],
    credits: 'Concept, identity, packaging and motion by Vivek Kumar. AI was used to generate the kitchen footage (Adobe Firefly, Google Veo), the travertine plate (Google Flow) and the voice (ElevenLabs). Music: paulyudin, "Ambient" (Pixabay).',
    role: ['Concept and naming', 'Brand identity', 'Bilingual typography', 'Packaging design', 'Social campaign', 'Motion design'],
    process: [
      ['Name', 'CHASHNI, after the one-thread syrup test'],
      ['Identity', 'One mark in Devanagari and Latin'],
      ['Packaging', 'A colour for each sweet, with dielines'],
      ['Campaign', 'One line across three reels and three carousels'],
      ['Motion', 'Edit, voice and AI-generated footage']
    ],
    outcome: {
      note: 'A concept project, so these are the results it is designed for, not live numbers.',
      delivered: ['A bilingual Devanagari and Latin identity', 'Print-ready packaging with dielines', 'Three reels and three carousels', 'One campaign line across every piece'],
      measure: ['Can shoppers name the sweet from the box alone, in a quick shelf test', 'Reel completion and shares during Diwali week', 'How many buyers keep one box for themselves', 'Fewer gift boxes passed on unopened'],
      shows: ['A brand name and concept drawn from a cultural detail', 'A packaging system run on one colour variable', 'Bilingual typography', 'A campaign carried across packaging, reels and carousels']
    },
    gallery: [
      ['assets/img/gallery/chashni/01.webp', 1400, 2166, 'A box that says what it is'],
      ['assets/img/gallery/chashni/02.webp', 1400, 1095, 'One variable, four values'],
      ['assets/img/gallery/chashni/03.webp', 1400, 1806, 'Three carousels, ten slides'],
      ['assets/img/gallery/chashni/04.webp', 1400, 1652, 'Two scripts, one family']
    ],
    video: { label: 'reels', items: [['1234676395', 1080, 1920, 'Reel 1'], ['1234676523', 1080, 1920, 'Reel 2'], ['1234676656', 1080, 1920, 'Reel 3']] },
    loop: 'assets/video/loop/chashni.mp4'
  },
  {
    id: 'enough', title: 'ENOUGH.', kind: 'Kinetic typography film', cats: ['motion'], color: 'pink', featured: false,
    summary: 'A film about food waste, narrated by the dinner you didn\'t finish.',
    about: 'A personal concept film about food waste, told by the dinner itself. In 42.6 seconds it moves from the plate to the fridge to the bin, and the typography changes with it.',
    year: '2026', published: 'Oct 2026', tags: ['Motion', 'Kinetic typography', 'Social impact'],
    tools: ['After Effects', 'Figma'],
    img: 'assets/img/covers/enough.webp', w: 1400, h: 1095,
    behance: 'https://www.behance.net/gallery/257694299/ENOUGH-The-dinner-you-didnt-finish',

    facts: [['Type', 'Concept motion film'], ['Medium', 'Vertical video, 1080 × 1920'], ['Tools', 'After Effects, Figma'], ['Published', 'Oct 2026']],
    writeup: [
      { h: 'The challenge', p: ['Food waste is a numbers story, and numbers are hard to feel:'], list: ['1 billion meals are thrown away every day, and 60% of food waste happens at home', 'Everyone agrees it is a problem; nobody thinks it is them'] },
      { h: 'The approach', p: ['The film gives the numbers a narrator: the dinner itself. It goes from the plate to the fridge to the bin, and the type goes off with it.', '"That\'s enough" is said once as an excuse and given back at the end as a demand: ENOUGH.'] },
      { h: 'The details', list: ['Seven acts, seven moves: land, print, push, rot, reveal, still, slam', 'A printed receipt, decaying type and rolling counters', 'Timed to a measured voice on a 76 BPM grid', 'Three typefaces: Bricolage Grotesque, Instrument Serif and JetBrains Mono', 'Every move is a real keyframe, with no expressions'] }
    ],
    credits: 'Personal concept project. Concept, script and motion by Vivek Kumar. Images are AI-generated (Google Flow) and the voices are AI-generated (ElevenLabs). Music: "Sad" by The Mountain (Pixabay). Data: UNEP Food Waste Index Report 2024 and FAO, The State of Food Security and Nutrition in the World 2026.',
    role: ['Concept', 'Scriptwriting', 'Art direction', 'Kinetic typography', 'Motion design'],
    process: [
      ['Insight', 'Food waste data from UNEP and FAO'],
      ['Script', 'The dinner tells its own story, in seven acts'],
      ['Art direction', 'One thali in six states, from full to empty'],
      ['Type and colour', 'Three typefaces; tomato and mould as the accents'],
      ['Animate', 'After Effects, on a 76 BPM grid']
    ],
    outcome: {
      note: 'A personal concept film, so these are the results it is designed for, not live numbers.',
      delivered: ['A 42.6-second vertical film, 1080 × 1920', 'Seven acts, each with its own motion device', 'A visual system of five colours and three typefaces', 'Boards on the premise, structure, art direction and motion'],
      measure: ['How many viewers watch to the end', 'Shares and saves of the film', 'Whether viewers remember the line "that\'s enough"'],
      shows: ['Kinetic typography that carries a story', 'Turning data into something people feel', 'Art direction of one subject in six states', 'Motion timed to voice and music']
    },
    gallery: [
      ['assets/img/gallery/enough/01.webp', 1400, 1200, 'A film narrated by the dinner you didn\'t finish'],
      ['assets/img/gallery/enough/02.webp', 1400, 857, 'Seven acts'],
      ['assets/img/gallery/enough/03.webp', 1400, 1660, 'One dinner, six states'],
      ['assets/img/gallery/enough/04.webp', 1400, 1960, 'Inside the fridge']
    ],
    video: { label: 'film', items: [['1234800947', 1080, 1920, 'ENOUGH. film']] }
  },
  {
    id: 'bijli-bazaar', title: 'BIJLI BAZAAR', kind: 'Social posts', cats: ['graphic'], color: 'pink', featured: false,
    summary: "Nine social posts for a night mela that doesn't exist, each solving a different layout problem.",
    about: 'BIJLI BAZAAR (बिजली बाज़ार, "the electric market") is an invented three-night music festival: a night mela of bulbs, tent edges and hand-painted signs. Nine social posts announce it, each in 4:5 and 9:16, and no photograph does the work.',
    year: '2026', published: 'Oct 2026', tags: ['Social media', 'Typography', 'Festival'],
    tools: ['Illustrator', 'Photoshop', 'Figma'],
    img: 'assets/img/covers/bijli-bazaar.webp', w: 808, h: 632,
    behance: 'https://www.behance.net/gallery/257537299/BIJLI-BAZAAR-Social-Posts-for-a-Night-Mela',

    facts: [['Type', 'Concept social campaign'], ['Medium', 'Nine posts, each in 4:5 and 9:16'], ['Tools', 'Illustrator, Photoshop, Figma'], ['Published', 'Oct 2026']],
    writeup: [
      { h: 'The challenge', p: ['Nine social posts, where every post solves a different layout problem:'], list: ['A long headline, a number, a list, a quote and a date', 'A single object, a timetable, price tiers and a status change', 'Most festival feeds are one template with the text swapped, but a line-up, a date and a house rule are different shapes of information'] },
      { h: 'The approach', p: ['The festival is the feed. One fixed system holds all nine posts together, while each post gets its own layout. A night mela is lit by bulbs, wires and hand-painted signs, so light is the type.'] },
      { h: 'The details', list: ['Five named colours: Night, Rani, Genda, Mor and Kagaz', 'Two typefaces: Unbounded and Space Mono', 'Four type treatments, one per post: bulb marquee, sign-paint, tile-fill and misprint', 'Six fairground modules: chakri, genda, jhumka, bulbs, shamiana and ticket', 'A shamiana edge and a bilingual wordmark sign every post', 'Nine 9:16 Stories, recomposed rather than cropped'] }
    ],
    credits: 'Concept project: the festival, its acts, dates and prices are fictional and have no connection to any real event.',
    role: ['Concept and naming', 'Art direction', 'Visual system', 'Typography', 'Layout', 'Illustration', 'Social media design'],
    process: [
      ['Premise', 'An invented three-night festival'],
      ['System', 'Five colours, two typefaces, one edge'],
      ['Kit', 'Six fairground modules, four type treatments'],
      ['Posts', 'Nine layout problems, nine posts in 4:5'],
      ['Stories', 'Every post recomposed for 9:16']
    ],
    outcome: {
      note: 'A concept project, so these are the results it is designed for, not live numbers.',
      delivered: ['Nine posts, each in 4:5 and 9:16: 18 artworks', 'A visual system: colours, type, four type treatments and six modules', 'A bilingual wordmark and monogram', 'A feed that reads as one long tent when posted in order'],
      measure: ['Can people read the date, the line-up and the prices at a glance', 'Saves and shares on the line-up and timetable posts', 'Is the feed recognised as one festival, even without the logo', 'Story taps through all nine posts'],
      shows: ['Layout: a different answer for each kind of information', 'A system strict enough to hold nine different posts', 'Typography as the image, with no photographs', 'Indian craft references in a contemporary system']
    },
    gallery: [
      ['assets/img/gallery/bijli-bazaar/01.webp', 1400, 1241, 'The system: five colours, two typefaces'],
      ['assets/img/gallery/bijli-bazaar/02.webp', 1400, 882, 'Four type treatments, one per post'],
      ['assets/img/gallery/bijli-bazaar/03.webp', 1400, 1167, 'A status change: SOLD lands like a stamp'],
      ['assets/img/gallery/bijli-bazaar/04.webp', 1400, 1167, 'A list: twelve invented acts, three tiers']
    ],
    loop: 'assets/video/loop/bijli-bazaar.mp4'
  },
  {
    id: 'shopup', title: 'ShopUp', kind: 'UI/UX case study', cats: ['ux'], color: 'lilac', featured: false,
    summary: 'Shop smarter with faster delivery, better deals and personalised recommendations.',
    about: 'ShopUp is a next-gen shopping app concept that personalises the experience using AI-driven recommendations. The case study explores a minimalist, user-centric approach to mobile shopping and follows a full design-thinking process, from research to high-fidelity UI.',
    year: '2026', published: 'May 2026', tags: ['Mobile', 'Ecommerce', 'Case study'],
    tools: ['Figma', 'Illustrator', 'Photoshop', 'Miro', 'Google Forms'],
    img: 'assets/img/covers/shopup.jpg', w: 1448, h: 1086,
    behance: 'https://www.behance.net/gallery/248983891/ShopUp-Case-Study',

    facts: [['Type', 'UI/UX case study'], ['Medium', 'Mobile app'], ['Tools', 'Figma, Illustrator, Photoshop, Miro, Google Forms'], ['Published', 'May 2026']],
    writeup: [
      { h: 'The challenge', p: ['Research surfaced recurring pain points, including:'], list: ['“I often get delayed or wrong deliveries, and the tracking information isn’t clear or updated.”', '“I get overwhelmed navigating through the app filters, menus, and categories aren’t intuitive.”'] },
      { h: 'The approach', p: ['Unlike generic e-commerce giants, ShopUp is designed with the user at the centre: a smarter, more personalised shopping experience using AI-powered recommendations that understand taste, needs and budget.', 'A clutter-free interface, fast delivery and real-time customer support aim to make shopping seamless, not stressful, while curated collections, exclusive deals and local seller support help people discover unique products.'] },
      { h: 'The details', p: ['The ShopUp mark combines a delivery truck and a shopping basket into one fast-moving cart. It stands for quick deliveries and a seamless experience, while the bold blue conveys trust, reliability and innovation.'] }
    ],
    role: ['Design Strategy', 'Problem Solution', 'Information Architecture', 'Empathy Mapping', 'Usability Testing', 'User Flow', 'Prototyping', 'Wireframes', 'Competitive Analysis', 'Visual Design', 'User Research', 'User Persona'],
    process: [
      ['Empathize', 'User research, user interviews, competitive analysis'],
      ['Define', 'User persona, goal statement, empathy mapping'],
      ['Ideate', 'Brainstorming, card sorting, user flow'],
      ['Design', 'Paper wireframing, visual design, prototype'],
      ['Testing', 'Usability checks, survey insights, improvements']
    ],
    outcome: {
      note: 'A concept project, so these are the results it is designed for, not live numbers.',
      delivered: ['User research and usability testing with six participants', 'Persona, empathy map and competitive analysis', 'Information architecture, user flows and wireframes', 'Style guide, high-fidelity UI and the ShopUp logo'],
      measure: ['Time to find a product using filters', 'Checkout completion', 'Support questions about where an order is (clearer tracking should cut them)', 'Repeat orders from recommendations'],
      shows: ['A full design-thinking process, from research to UI', 'Turning real pain points (tracking, filters) into features', 'Brand and product design working together']
    },
    gallery: [
      ['assets/img/gallery/shopup/01.webp', 1200, 1998, 'User persona'],
      ['assets/img/gallery/shopup/02.webp', 1200, 1320, 'Style guide'],
      ['assets/img/gallery/shopup/03.webp', 1200, 1500, 'Low-fidelity wireframes'],
      ['assets/img/gallery/shopup/04.webp', 1200, 1714, 'UI designs']
    ]
  },
  {
    id: 'bewakoof', title: 'Bewakoof', kind: 'Heuristic evaluation', cats: ['ux'], color: 'sun', featured: false,
    summary: "What's working and what isn't across a high-traffic ecommerce funnel.",
    about: "A heuristic evaluation of the Bewakoof shopping app: a structured review of what's working and what isn't across a high-traffic ecommerce funnel.",
    year: '2025', published: 'Jul 2025', tags: ['UX research', 'Audit'],
    tools: ['Figma', 'Photoshop'],
    img: 'assets/img/covers/bewakoof.jpg', w: 1448, h: 1086,
    behance: 'https://www.behance.net/gallery/229827375/Heuristic-Evaluation-%28Bewakoof%29',

    facts: [['Type', 'Heuristic evaluation'], ['Medium', 'Mobile shopping app'], ['Tools', 'Figma, Photoshop'], ['Published', 'Jul 2025']],
    writeup: [
      { h: 'The challenge', p: ['Bewakoof is a high-traffic shopping app. The aim was to:'], list: ['Find where its funnel creates friction', 'Do it quickly, before any costly user testing'] },
      { h: 'The approach', p: ["A heuristic evaluation: an expert review of the interface against Nielsen's 10 usability heuristics. Each issue is shown as the current screen next to a proposed fix."] },
      { h: 'The details', p: ['The screens in focus:'], list: ['Home: stories row (Specials, Shop Now, Plus Size, Accessories) and promotional banners', 'Offer cards such as "Joggers, buy 2 at ₹1699"', 'New Arrivals and product discovery', 'Bottom navigation: Men, Categories, Studio, Profile'] }
    ],
    credits: 'An independent review. Not affiliated with Bewakoof.',
    role: ['Heuristic evaluation', 'UX audit', 'Usability analysis', 'Redesign proposals', 'Visual presentation'],
    process: [
      ['Scope', 'Pick the key screens of the funnel'],
      ['Review', 'Check each against the 10 heuristics'],
      ['Rate', 'Rank the issues by severity'],
      ['Propose', 'Show the current screen next to a fix'],
      ['Present', 'Lay out the findings board by board']
    ],
    outcome: {
      note: 'An independent review of a live app, so these are the checks I would use to confirm the fixes.',
      delivered: ["A review of the app against Nielsen's 10 heuristics", 'Severity-rated issues across the home, offers, new arrivals and navigation', 'Prioritised recommendations'],
      measure: ['Task success when finding and applying an offer', 'Time to reach a category from the home screen', 'The same issues re-checked after changes, with users'],
      shows: ['A critical, structured eye for usability', 'Prioritising problems by severity', 'Presenting findings clearly and visually']
    },
    gallery: [
      ['assets/img/gallery/bewakoof/01.webp', 1400, 909, "Nielsen's 10 heuristics"],
      ['assets/img/gallery/bewakoof/02.webp', 1400, 909, 'Visibility of system status'],
      ['assets/img/gallery/bewakoof/03.webp', 1400, 909, 'Consistency and standards'],
      ['assets/img/gallery/bewakoof/04.webp', 1400, 909, 'Aesthetic and minimalist design']
    ]
  },
  {
    id: 'achilles', title: 'Achilles', kind: 'Parallax UI animation', cats: ['motion'], color: 'sky', featured: false,
    summary: 'A parallax study built around a coastal landing-page hero.',
    about: 'A second parallax study with layered depth, built around a coastal landing-page hero for Achilles Point.',
    year: '2025', published: 'Jun 2025', tags: ['Motion', 'Parallax', 'Web'],
    tools: ['Figma', 'Photoshop'],
    img: 'assets/img/covers/achilles.jpg', w: 1448, h: 1086,
    behance: 'https://www.behance.net/gallery/228224255/Parallax',

    facts: [['Type', 'Parallax UI study'], ['Medium', 'Web landing page'], ['Tools', 'Figma, Photoshop'], ['Published', 'Jun 2025']],
    writeup: [
      { h: 'The challenge', p: ['A landing-page hero that has to:'], list: ['Give depth and movement', 'Keep one clear message and one action'] },
      { h: 'The approach', p: ['The headline "Achilles" is filled with the coastline itself, so the image shows through the letters while foreground bush and rocks sit on their own layers in front.'] },
      { h: 'The details', list: ['Navigation: Home, Customize, Pricing, Our Work, Contact', 'Short intro on Achilles Point’s rocky coastline, native bush and Rangitoto Island view', 'Single pill-shaped "Book Now" action'] }
    ],
    role: ['UI design', 'Visual composition', 'Parallax animation', 'Prototyping'],
    process: [
      ['Layout', 'A landing page with one message'],
      ['Layers', 'Foreground bush and rocks on their own layers'],
      ['Type', 'The headline filled with the coastline'],
      ['Motion', 'Layers moving at different speeds, in Figma'],
      ['Interface', 'Navigation and one "Book Now" action']
    ],
    outcome: {
      note: 'A design study, so these are the signals it is designed to improve, not live numbers.',
      delivered: ['A layered parallax hero designed and animated in Figma', 'A headline filled with the coastline image', 'A landing-page interface with one clear "Book Now" action'],
      measure: ['How far visitors scroll past the hero', 'Clicks on "Book Now"', 'Time spent on the first screen'],
      shows: ['Motion and depth in interface design', 'Image-in-type composition', 'Restraint: one action, one message']
    },
    gallery: [
      ['assets/img/gallery/achilles/01.webp', 1400, 905, 'The headline, filled with the coastline'],
      ['assets/img/gallery/achilles/02.webp', 1400, 905, 'The landing-page hero']
    ],
    video: { label: 'animation', host: 'youtube', items: [['AX3CeYFNuXg', 1920, 1080, 'Achilles parallax animation']] }
  }
];

/* Contact links, used by the nav, footer, contact band and Contact page */
window.CONTACT = {
  email: 'vivekgupta9661@gmail.com',
  behance: 'https://www.behance.net/vivekgupta143',
  book: 'https://www.behance.net/gallery/257604137/Viveks-Portfolio-2026-Brand-UIUX-Motion',
  linkedin: 'https://www.linkedin.com/in/vivek-kumar-9641312a8',
  instagram: 'https://www.instagram.com/16__vivek__'
};

/* Card colours, from the design system */
window.SWATCH = { pink: '#FF5A8C', blue: '#3350FF', sun: '#FFCF33', mint: '#6FE3B2', sky: '#7FD8F5', lilac: '#9DB0FF', ink: '#1C1747' };
