# Vivek Kumar — portfolio

Live: https://vivek-portfolio-beta-eight.vercel.app

Plain HTML, CSS and JavaScript. No build step. Lenis smooth scrolling loads from a CDN. Every push to `main` deploys to Vercel.

## Map

```
index.html            Home: hero, selected work, the drawer, service tiles
work.html             All projects, with category filters
about.html            Bio, CV download, background, toolkit
services.html         Services, process, capabilities, FAQ
journal.html          Reading list (not linked from the nav or footer; reachable by its URL)
contact.html          Email, socials, note form
404.html              Not-found page
project.html          Project page template
project-<id>.html     One page per project, generated from project.html (do not edit by hand)

assets/
  css/style.css       The whole stylesheet, in numbered sections (see its table of contents)
  js/data.js          ALL project content and contact links. Start here to change content.
  js/cards.js         Project card markup, shared by Home and Work
  js/main.js          Shared on every page: nav, footer, contact band, theme, reveals, prefetch
  js/hero.js          Home hero effects only
  js/pages/<page>.js  The script for one page (home, work, project, services, journal, contact)
  img/covers/<id>     Project cover images
  img/gallery/<id>/   Project highlight boards (01.webp to 04.webp)
  img/share/          Link-preview images: portfolio.jpg and <id>.jpg
  img/me/             Portraits and the nav avatar
  icons/              Favicon and home-screen icon
  cv/                 The downloadable CV (web copy, without the phone number)

tools/                Not deployed (see .vercelignore)
  serve.js            Local server
  build-share.py      Builds the link previews and the project-<id>.html pages
  og-portfolio.html   Template of the portfolio link preview
  og-project.html     Template of a project link preview
  capture-linkedin.js LinkedIn showcase screenshots (+ mockup-template.html)
```

Every page loads its scripts in the same order: `data.js`, `cards.js` (if needed), the page script, Lenis, `main.js`.

## Run locally

```
node tools/serve.js
```

Then open http://localhost:5173.

## Add or edit a project

1. Add the cover to `assets/img/covers/<id>` and up to four boards to `assets/img/gallery/<id>/`.
2. Add an entry to `assets/js/data.js`. Copy an existing project: every project has the same fields, and the comment at the top of the file explains each one.
3. Run `python tools/build-share.py`. It needs Python with Pillow, Node and Chrome. It writes the project's page and its link-preview image, and pre-renders the page body (nav, case study, footer) into the file so the content is there before JavaScript runs. Rerun it after any change to `data.js`, `project.html`, `cards.js`, `pages/project.js` or the nav and footer in `main.js`.
4. Commit and push.

Every project page uses this shared sequence:
1. Hero
2. First look: the first gallery board, shown early and opened larger on request
3. Film, when the project has one
4. Project facts (Type, Medium, Tools, Published)
5. The challenge, The approach, The details
6. Credits, only where a project has them
7. My role and design process
8. Outcome, including proposed success checks for concept work
9. Highlights: the remaining gallery boards
10. The Behance link

The gallery board is rendered once in the page. Keep generated imagery and voices in `credits`, separate from the designer's own tool list. Main navigation focuses on Work, About, Services and Contact; the curated Reading list remains accessible from the footer.

## Link previews

WhatsApp, LinkedIn, X and similar apps build a link's preview card from the `og:` and `twitter:` tags in the page's `<head>`. They don't run JavaScript, so:

- the main pages share `assets/img/share/portfolio.jpg`
- each project has its own static page, `project-<id>.html`, with its own image

Old `project.html?id=<id>` links redirect to the project's page.

## Design

The style is **sticker / neo-brutalist, playful and illustrated**: the hero's stickers, doodles and handwriting carry on down every page, on warm paper with a fine film grain. These are the rules; keep to them when adding anything.

- **Surfaces:** everything is a solid sticker sheet (`--surface`) with an ink outline (`--glass-edge`, 2px via `--bw`) and a hard offset shadow (`--sh-sm` 2/3px, `--sh` 4/5px, `--sh-lg` 6/8px, colour `--hard`). No blur, no glass, no soft shadows.
- **Interaction:** hover lifts a sticker a little; pressing moves it into its shadow (section 18f). Cards may sit slightly crooked and straighten on hover.
- **Colour roles:**
  - cobalt `#3350FF`: titles, links and focus;
  - sun `#FFCF33`: the primary button, highlights and the marker swipe;
  - pink, mint, sky, lilac: category colours, sticker shadows and pastel blocks;
  - ink `#1C1747`: text and every outline.
  Pastel blocks (`.pop--ink`) hold non-work sections, so the project images stay the most colourful thing on the page.
- **Type scale:** headlines `.t-xxl` (page titles), `.t-xl` (Home sections), `.t-lg` (sections); body 1rem at 1.5 line height; labels .8 to .9rem. Bricolage Grotesque (headlines), Plus Jakarta Sans (text), Covered By Your Grace (handwritten notes only). The fonts are served from `assets/fonts`.
- **Corners:** pill (`--r-pill`) for buttons, chips and the nav; 26px (`--r-lg`) for cards and panels; 16px (`--r-md`) for small cards and fields.
- **Section heads:** a handwritten `.kicker` above the title, one word in `<em class="hl">` with a marker swipe, and two doodles that main.js adds.
- **Colour blocks (`.pop`):** no two plain sections in a row. A pop section is a full-width colour field with flowing wavy edges (`--pop`); inside a page column, `.pop--panel` makes it a framed panel. Project Highlights use the project's own colour.
- **Motion:** it comes from scrolling, hovering and pressing. At most one looping animation per screen (the wavy edges, the tape marquee, the role sticker, the theme switch). Decorations stay still. Everything stops for reduced motion.
- **Contact wording:** "Say hello" everywhere (nav, hero, contact band).
- **Blob buddy:** `.peek-buddy` peeks over a colour block; every `.blob` watches the cursor.
- **Finale:** the contact band ("Got a project? Say hello.") and the footer are one dark ink block in both themes.
- **Themes:** day (warm paper `#FAF9F6`) and night (dark ink `#0F0E17`). Visitors switch with the animated sun/moon switch (`.tsw`, built in main.js), inside the nav on phones and beside it on desktop. The site follows the device setting, then remembers the visitor's choice (`localStorage` key `vk-theme`). An inline script in each `<head>` sets the theme before the first paint.
- **Navigation:** links navigate immediately. Page content reveals after loading; no blocking intro or transition curtain.
- **CSS:** written mobile first, with breakpoints at 381, 601, 901 and 1101px (`min-width` only). All tokens are at the top of `style.css`.
