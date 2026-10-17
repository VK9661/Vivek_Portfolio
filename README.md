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
| `index.html` | Home: "Portfolio, 2026 edition" hero, tape marquee, selected work, the drawer with category filters, service tiles |
| `work.html` | Filterable index of all projects (UI/UX, Brand, Graphic, Motion) |
| `project.html?id=…` | Project page, rendered from `data.js` |
| `about.html` | Bio, at a glance, background and toolkit, working principles |
| `services.html` | Tabbed services, process, draggable capability board, FAQ |
| `journal.html` | Illustrated design reading list |
| `contact.html` | Email, socials and a note form that opens the visitor's email app |
| `assets/css/style.css` | The whole stylesheet, written mobile first (breakpoints at 381, 601, 901 and 1101px) |
| `assets/js/data.js` | **All projects and contact links.** Add a project by adding an entry. |
| `assets/js/cards.js` | Shared project card renderers |
| `assets/js/pages/*.js` | The script for each page (home, work, journal, services, contact, project) |
| `assets/js/main.js` | Shared nav, contact band, footer, theme, reveals, cursor, intro and page transitions |
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

## Restoring the previous design

The previous "sticker desk" design (before the glass theme) is kept in three places:

- the Git tag `backup-riso-design`
- the branch `backup/riso-design`
- a local copy in `portfolio/backup-riso-design/`

To put it back live, restore the tag's files onto `main` and push:

```
git checkout backup-riso-design -- .
git commit -m "Restore riso design"
git push
```
