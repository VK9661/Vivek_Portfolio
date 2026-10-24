# Vivek Kumar — portfolio

Live: https://vivek-portfolio-beta-eight.vercel.app

Plain HTML, CSS and JavaScript. No build step and no dependencies (Lenis smooth scroll loads from a CDN). Every push to `main` deploys to Vercel.

## Map

```
index.html            Home: hero, selected work, the drawer, service tiles
work.html             All projects, with category filters
about.html            Bio, CV download, background, toolkit
services.html         Services, process, capabilities, FAQ
journal.html          Reading list
contact.html          Email, socials, note form
404.html              Not-found page
project.html          Project page template
project-<id>.html     One page per project, generated from project.html (do not edit by hand)

assets/
  css/style.css       The whole stylesheet, in numbered sections (see its table of contents)
  js/data.js          ALL project content and contact links. Start here to change content.
  js/cards.js         Project card markup, shared by Home and Work
  js/main.js          Shared on every page: nav, footer, contact band, theme, reveals, transitions
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
3. Run `python tools/build-share.py`. It needs Python with Pillow, Node and Chrome. It writes the project's page and its link-preview image.
4. Commit and push.

Every project page shows the same sections:
1. Hero
2. Project facts (Type, Medium, Tools, Published)
3. The challenge, The approach, The details
4. Credits, only where a project has them
5. My role
6. Design process
7. Outcome
8. Highlights
9. The Behance link

## Link previews

WhatsApp, LinkedIn, X and similar apps build a link's preview card from the `og:` and `twitter:` tags in the page's `<head>`. They don't run JavaScript, so:

- the main pages share `assets/img/share/portfolio.jpg`
- each project has its own static page, `project-<id>.html`, with its own image

Old `project.html?id=<id>` links redirect to the project's page.

## Design

- **Look:** playful and illustrated. The hero's stickers, doodles and handwriting carry on down every page, on warm paper with a fine film grain.
  - **Sticker cards:** cards have an ink outline (`--outline`) and a hard offset shadow in their own colour (`--c`). They sit slightly crooked and straighten on hover.
  - **Section heads:** a handwritten `.kicker` above the title, one word in `<em class="hl">` with a marker swipe, and two doodles that main.js adds.
  - **Colour blocks (`.pop`):** no two plain sections in a row. A pop section is a full-width colour field with wavy edges (`--pop`; `.pop--ink` for pastel fields with ink text). Inside a page column, `.pop--panel` makes it a framed panel instead; project Highlights use the project's own colour.
  - **Blob buddy:** `.peek-buddy` peeks over a colour block; every `.blob` watches the cursor.
  - **Glass** is only for what floats over the page: the nav pill and the card over the portrait.
  - **Finale:** "Let's talk" and the footer are one dark ink block in both themes.
- **Themes:** day (warm paper `#FAF9F6`) and night (dark ink `#0F0E17`). The site follows the device setting, then remembers the visitor's choice (`localStorage` key `vk-theme`). An inline script in each `<head>` sets the theme before the first paint.
- **Colours:** ink `#1C1747`, pink `#FF5A8C`, cobalt `#3350FF`, sun `#FFCF33`, mint `#6FE3B2`, sky `#7FD8F5`, lilac `#9DB0FF`.
- **Type:** Bricolage Grotesque (headlines), Plus Jakarta Sans (text), Covered By Your Grace (handwritten notes).
- **CSS:** written mobile first, with breakpoints at 381, 601, 901 and 1101px (`min-width` only). All tokens are at the top of `style.css`.
