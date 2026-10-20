# Vivek Kumar — portfolio site

Plain HTML, CSS and JavaScript. No build step, no dependencies (Lenis smooth scroll loads from a CDN).

## Run locally

```
cd site
node serve.js
```

Then open http://localhost:5173. Any static server works too, for example `npx serve site`.

## Design

- **Sticker desk on glass:** stickers, notes, stars, tape strips and doodles keep hard ink outlines. UI surfaces (nav, cards, rows, buttons, chips, panels, fields) are frosted glass over a soft aurora.
- **Day and night themes**, switched by the sun/moon button in the nav.
- **Colours:** ink `#1C1747`, riso pink `#FF5A8C`, cobalt `#3350FF`, sun `#FFCF33`, plus mint, sky and lilac.
- **Type:** Bricolage Grotesque (headlines), Plus Jakarta Sans (body and UI), Covered By Your Grace (handwritten notes). All are Google Fonts.
- All tokens live at the top of `assets/css/style.css`.

## Structure

| File | What it is |
| --- | --- |
| `index.html` | Home: name-led "Portfolio 2026" hero, tape marquee, selected work (one featured, three equal), the drawer with category filters, service tiles |
| `work.html` | Filterable index of all projects (UI/UX, Brand, Graphic, Motion) |
| `project-<id>.html` | Each project's page, rendered from `data.js`. Generated from `project.html` by `tools/build-share.py` so its link preview shows that project |
| `about.html` | Bio with CV download, at a glance, background and toolkit |
| `services.html` | Tabbed services, process, capabilities, FAQ |
| `journal.html` | Reading list: illustrated design articles and guides |
| `contact.html` | Email, socials and a note form that opens the visitor's email app |
| `assets/css/style.css` | The whole stylesheet, written mobile first (breakpoints at 381, 601, 901 and 1101px) |
| `assets/js/data.js` | **All projects and contact links.** Add a project by adding an entry; `gallery` holds its highlight images. |
| `assets/js/cards.js` | Shared project card renderers |
| `assets/js/pages/*.js` | The script for each page (home, work, journal, services, contact, project) |
| `assets/js/main.js` | Shared nav, contact band, footer, theme, reveals, cursor, intro and page transitions |
| `assets/cv/Vivek_Kumar_CV.pdf` | The downloadable CV (web copy, without the phone number) |
| `assets/og-portfolio.jpg` | Link-preview image of the portfolio link and the main pages; its source is `tools/og-template.html` in the portfolio folder |
| `assets/og/<id>.jpg` | Each project's link-preview image, rendered from `tools/og-project.html` |
| `assets/js/hero.js` | Home hero interactions: cursor colour, confetti, role pill, tilt, magnetic buttons |

Every page loads its scripts in the same order: `data.js`, `cards.js` (if needed), the page script, Lenis, `main.js`.

## Nav

The nav is one floating glass pill.

- **Scrolling down the page** folds it to a compact pill: profile photo, day/night switch and menu.
- **Scrolling back up**, or **tapping the folded pill**, unfolds it.
- The folding animates CSS grid columns, so it stays smooth on phones.

## Day and night theme

- **First visit:** the site follows the device setting. After that it remembers the visitor's choice (`localStorage` key `vk-theme`).
- **No flash on load:** the inline script at the top of each page's `<head>` sets `data-theme` before the first paint.
- **The switch animation:** the new theme opens as a circle from the switch, using a View Transition. Browsers without View Transitions switch instantly.

## Restoring an earlier design

Two earlier versions are kept:

- **Glass theme before the improvement pass (2026-10-18):** tag `backup-glass-v1`, branch `backup/glass-v1`, local copy `portfolio/backup-glass-v1/`
- **The original "sticker desk" design (before the glass theme):**

  tag `backup-riso-design`, branch `backup/riso-design`, local copy `portfolio/backup-riso-design/`

To put one back live, restore its tag's files onto `main` and push (example for the riso design):

```
git checkout backup-riso-design -- .
git commit -m "Restore riso design"
git push
```

## Link previews

When a link is shared on WhatsApp, LinkedIn, X and similar apps, the preview card (image, title, description) comes from the `og:` tags in each page's `<head>`. These apps don't run JavaScript, so every project has its own static page.

After adding a project or editing `project.html`, run this from the portfolio folder:

```
python tools/build-share.py
```

It renders `assets/og/<id>.jpg` and writes `project-<id>.html` for every project. Old `project.html?id=…` links still work and redirect to the new pages.
