# Icon families rebuild — design

Date: 2026-11-13. Status: approved in conversation ("do whatever you think").

## Intent

The atlas page's Icon families section (`site/atlas.html#icons`) should show real
variety between families, and a project should hold individual icons that each carry
their own colour. The brief came from India: "icons etc should have way more variety and
if you choose it for your projects you should be able to customize the color for each
individual icon", clarified as "it didn't feel like there was much actual variety between
all the icon families". Everything should read clean and modern, like the newer pages.

## What's wrong today (measured 2026-11-13)

- 13 families, 7 of them outline sets that look alike (Phosphor ×4 weights, Heroicons
  outline, Lucide, Tabler). Only 6 appear as cards; the other 7 hide in a 13-option select.
- Icons render as `<img src="….svg">`, so CSS cannot recolour them although every
  monochrome SVG uses `currentColor`.
- A project stores family ids only (`p.icons`), drawn as three fixed glyphs. No per-icon
  pick, no colour.
- The section ends in 37 "custom systems" cards: 25 px fragments cropped from earlier
  mockups, centred in large empty tiles. They read as broken thumbnails.
- A11y: the family select's name swallows all 13 options (wrapping label); five links
  read "All 300 in the library →" with different targets; the intro link has no
  underline; "13 specimens only" link vs 12 specimens shown.

## Goals

1. Fifteen or more visibly different looks on the page, each one card.
2. Nine new families with distinct looks, built by the existing `tools/icons.py`
   pipeline from pinned packages, with licences and packs like the current ones.
3. Icons drawn inline so colour, size and tile style apply live ("look bar").
4. Projects hold `iconPicks: [{family, name, colour}]`, picked from an in-page picker
   (any icon of any family, searchable), with a colour per icon, shown on the project
   page and included in the exported brief.
5. The section is clean: no cropped-mockup block, a11y issues above fixed.

## Non-goals

- Replacing the standalone icon library page (`icons.html`); it gains the new families
  through `icons/index.json` and otherwise stays as is.
- Uploading custom icons.
- Animated preview of Line MD icons in packs (the SVGs carry their own animation).

## Anti-goals

- Adding more outline sets. More variety means different looks, not more vendors.
- A heavier page: the atlas section must not load every manifest up front.

## Approaches considered

1. **Styling layer only** (colour/size/tile over the existing 13). Cheap, but the
   families would still look the same. Rejected after India's clarification.
2. **New sets, hand-built**. Download each vendor's repo and write a builder per set, as
   the script does today. Reliable but nine new builders.
3. **New sets through Iconify JSON bundles** (`@iconify-json/<prefix>` on jsDelivr,
   pinned versions). One generic builder covers all nine, licences and versions come
   with the bundle. **Chosen.**

## Families after the rebuild (22)

Existing 13 stay. New, with the Iconify prefix and licence:

| id | Card title | Look | prefix / filter | licence |
| --- | --- | --- | --- | --- |
| broken | Solar / Broken line | outline with gaps | solar, `*-broken` | CC BY 4.0 |
| bold-duotone | Solar / Bold duotone | heavy two-tone | solar, `*-bold-duotone` | CC BY 4.0 |
| rounded | Material Symbols / Rounded | chunky filled, Google | material-symbols, `*-rounded` not `*-outline-rounded` | Apache 2.0 |
| pencil | Pepicons / Pencil | hand-drawn | pepicons-pencil | CC BY 4.0 |
| flat-color | Flat Color Icons / Flat colour | flat multicolour | flat-color-icons | MIT |
| two-tone | Icon Park / Two-tone colour | blue-and-ink colour outline | icon-park | Apache 2.0 |
| game | Game Icons / Illustrative | silhouette illustrations | game-icons | CC BY 3.0 |
| brand | Simple Icons / Brand logos | brand marks | simple-icons | CC0 |
| animated | Line MD / Animated line | self-animating line icons | line-md | MIT |

Monochrome (recolourable): all except flat-color, two-tone, openmoji, fluent-3d.

## Section layout (atlas.html#icons)

- Hero and intro as today, copy updated (count from index.json).
- **Look bar**: colour (ink + 5 preset dots + custom), size (S/M/L), tile (none /
  tinted / rounded / circle). Applies to every card and the inspect panel. Stored per
  viewer in localStorage; disabled with a note on colour-locked families.
- **Cards, one per look** (15): Outline (Phosphor, with weight toggle thin/light/
  regular/bold and alt draws Lucide/Tabler), Solid (Phosphor fill), Heroicons (outline/
  solid toggle), Duotone, Broken line, Bold duotone, Rounded filled, Hand-drawn, Pixel,
  Two-tone colour, Flat colour, Colour pictograms, 3D emoji, Illustrative, Brand logos,
  Animated line. Each card: four specimens drawn inline, title, one line, "Inspect",
  "All N in the library".
- **Inspect panel**: family title, description, licence, 12 specimens inline at the look
  bar's settings, per-specimen "Add to project" (uses the look bar colour), "Add this
  family", browse/download links. The family select gets a `label[for]`.
- The extracted-assets block is no longer mounted into #icons (it stays in #assets).

## Project model

- `project.iconPicks = [{family, name, colour}]`, max 200, validated like other fields;
  `project.icons` (families) stays for compatibility.
- Project page "Icon direction" shows picked icons as tiles with a colour swatch each
  (native colour input plus preset dots), remove, and a "Pick icons" button opening a
  picker dialog: family select, search box, chunked grid from the family manifest,
  click to add with the current colour.
- Export (brief markdown) lists picks as `family/name #colour`.

## Rendering

- `SpecimenAtlas.svg(name, family)` returns inline SVG text from
  `site/icons/specimens.json` (generated: 12 specimens per family, SVG text or PNG path).
  `SpecimenAtlas.icon()` keeps returning an `<img>` for other pages.
- Colour via CSS `color` on the wrapper; size via `--icon-size`.

## Build

`tools/icons.py` gains a generic `build_iconify(prefix, version, filter, rename)` using
`https://cdn.jsdelivr.net/npm/@iconify-json/<prefix>@<ver>/icons.json` (+ `info.json`
for licence text and author). Concept matching reuses `pick()`. It also writes
`site/icons/<fid>/<specimen>.svg`, the specimen packs, and `site/icons/specimens.json`
for all 22 families.

## Left to the builder

Exact copy on cards, preset colours (use the atlas accent tokens), picker chunk size,
whether to show Line MD animations in cards (yes if under 60 fps budget).
