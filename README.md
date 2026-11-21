# Vivek Kumar: portfolio

Live: https://vivek-portfolio-beta-eight.vercel.app

Plain HTML, CSS and JavaScript (ES modules). No build step. Lenis, GSAP (ScrollTrigger, SplitText, CustomEase, Flip) and Three.js load from jsDelivr; the fonts (Clash Display, General Sans, IBM Plex Mono) load from Fontshare and Google Fonts. Every push to `main` deploys to Vercel.

## Map

```
index.html            Home: particle portrait hero, statement, 3D ring of selected work, capabilities, about teaser
works.html            Every project: category filters, Grid and Index views
about.html            Bio, experience, education, tools
services.html         Six services (stacking cards), process (horizontal), capabilities, FAQ
contact.html          Email, copy button, email-draft form, downloads, links
404.html              Not-found page (has <base href="/"> so it works at any path)
work.html             Old address of Works; redirects to works.html
project.html          Project page template (project.html?id=<id> also works; noindex)
project-<id>.html     One page per project, generated from project.html (do not edit by hand)

assets/
  css/v4.css          The whole stylesheet
  js/data.js          ALL project content and contact links. Start here to change content.
  js/core.js          Shared by every page: top bar, menu, footer, page transitions, smooth scroll, reveals, title letter roll, cursor
  js/home.js          Home only: particle portrait, the 3D ring
  js/pages.js         Works, project, about, services, contact and 404 pages
  img/covers/<id>     Project cover images
  img/gallery/<id>/   Project boards (01.webp to 04.webp)
  img/share/          Link-preview images: portfolio.jpg and <id>.jpg
  img/me/             Portraits (portrait-cutout.webp feeds the particle hero)
  icons/              Favicons and home-screen icon (favicon.ico is also at the root)
  cv/                 The downloadable CV (web copy, without the phone number) and portfolio PDF

tools/                Not deployed (see .vercelignore)
  serve.js            Local server
  build-share.py      Builds the link previews, the project-<id>.html pages and sitemap.xml
  og.html             Link-preview template (?id=<id> for a project)
  capture-linkedin.js LinkedIn showcase screenshots (+ mockup-template.html)
```

Each page loads `data.js`, the CDN libraries, then one module: `home.js` on Home, `pages.js` everywhere else. The page's `<body data-page>` says which builder runs.

## Run locally

```
node tools/serve.js
```

Then open http://localhost:5173.

## Add or edit a project

1. Add the cover to `assets/img/covers/<id>` and up to four boards to `assets/img/gallery/<id>/`.
2. Add an entry to `assets/js/data.js`. Copy an existing project: every project has the same fields, and the comment at the top of the file explains each one. `featured: true` puts it on the Home ring.
3. Run `python tools/build-share.py` (needs Python with Pillow, Node and Chrome). It writes the project's page, its link-preview image and the sitemap. `--pages` skips the images.
4. Commit and push.

## Link previews

WhatsApp, LinkedIn, X and similar apps build a link's preview card from the `og:` and `twitter:` tags in the page's `<head>`. They don't run JavaScript, so the main pages share `assets/img/share/portfolio.jpg` and each project has its own static page with its own image. Bump `V` in `build-share.py` (and the `?v=` on the main pages) when the images change.

## Design (v4, live 2026-11-21)

Dark and cinematic. Tokens are at the top of `v4.css`.

- **Colour:** background `#0A0A0B`, panels `#111113` / `#18181B`, text `#EDEBE6`, muted `#8E8C87`, one accent `#FF4A1C`.
- **Type:** Clash Display for headings, General Sans for text, IBM Plex Mono for small labels such as `( Selected work )`. Display headings use slightly loosened tracking plus `word-spacing` so words stay apart.
- **Motion:** Lenis smooth scroll; reveals and page transitions are the same on every page (five shutters close, the next page's name rises, the shutters open). Page titles roll each letter to an orange twin once after arriving and on hover, like the logo. Everything stops for reduced motion.
- **Images:** covers are always shown at their own ratio, never cropped.
- **Copy:** facts come only from the project page or Behance. No phone number anywhere on the site.
