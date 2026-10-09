# Vivek Kumar — portfolio site

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Run locally

```
cd site
node serve.js
```

Then open http://localhost:5173. (Any static server works too, e.g. `npx serve site`.)

## Design system ("sticker desk")

- Colours: Paper `#F3F0FB`, Ink `#1C1747`, Riso pink `#FF5A8C`, Cobalt `#3350FF`, Sun `#FFCF33`, plus mint, sky and lilac accents
- Type: Bricolage Grotesque (headlines, heavy and condensed), Plus Jakarta Sans (body/UI), Covered By Your Grace (notes) — all Google Fonts
- Hard 2.5px outlines with flat offset shadows (no blur); corners 26px / 16px / pill
- Tape and tilt, on a dotted, doodled paper background; "hello" cursor bubble
- All tokens live at the top of `assets/css/style.css`

## Structure

| File | What it is |
| --- | --- |
| `index.html` | Home: hero with ID card and stickers, tape marquee, at a glance, selected work, drawer, service tiles |
| `work.html` | Filterable index of all projects (UI/UX, Brand, Graphic, Motion) |
| `project.html?id=…` | Project detail (ShopUp includes the full case-study board) |
| `about.html` | Bio, background & toolkit bento, working principles |
| `services.html` | Tabbed services, process, draggable capability board, FAQ |
| `journal.html` | Empty state until articles exist |
| `contact.html` | Email, socials and a note form that opens the visitor's email app |
| `playground.html` | Draggable desk of project prints and stickers (shuffle / tidy up) |
| `assets/js/data.js` | **All projects + contact links.** Add a project by adding an entry. |
| `assets/js/cards.js` | Shared project card renderers |
| `assets/js/main.js` | Shared nav, contact band, footer and all interactions |
