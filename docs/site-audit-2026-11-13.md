# Visual & Motion Atlas: site audit

13 November 2026. Local copy of `main`, measured in a browser at 1440 × 900 and 390 × 844.

**Covered:** 17 standalone pages (home, tools, interactions, app templates, theme kits, icon library, brand
generator, motion graphics, mockup, chart, diagram and flowchart studios, moodboard, my fonts, account, chart style
guides, site builder home and editor) and 22 sections of `atlas.html`. **Not covered:** `p.html`, `shared.html`,
`flowchart-canvas.html` and `work/djinyc` (they need saved data), keyboard focus order, screen-reader passes, signed-in
states, the serverless API, and the project's own Playwright gate.

**Method:** a script measured every page for text contrast (WCAG 1.4.3), target size (2.5.8, 24 px), control names,
heading order, missing alt text, sideways scroll, text under 11 px, fonts, corner radii and page background. Console
errors were attributed per page. Suspicious readings were checked by eye before being reported.

## Summary

The site is in good technical shape. The open work is consistency, not breakage.

| Check | Result |
| --- | --- |
| Sideways scroll, 39 desktop views and 33 phone views | 0 |
| Images missing alt text | 0 |
| Pages without one `h1`, a title, a description, `lang` | 0 |
| Page-specific JavaScript errors | 0 (one failed external request on `account.html`, see finding 9) |
| Real text-contrast failures | 1 group (finding 6, fixed) |
| Tap targets under 24 px | 228 across the desktop views before today. Re-measured on 8 views after the fix: only native sliders were left on 6 of them; the other 2 were patched after that reading |

## India's brief (the screenshot), item by item

| Asked | Status |
| --- | --- |
| Older interaction pieces should match the newer ones | Done in `cdf5096`: 73 pieces restyled to the light look. |
| No mock-ups that are just earlier generated images | Done for interactions in `cdf5096` (drawn artwork in `assets/art`). **Open:** nine site-builder templates still lead with atlas art (finding 2). |
| Site builder: photo buttons too busy | Done in `8ea9a8e`: one Category dropdown. |
| Site builder: land on sites and templates | Done in `8ea9a8e`: full-page home. |
| Site builder: much cleaner | Done: `453dbe6` (neutral chrome) and `8ea9a8e` (library is search, source, category). |
| Icons: far more variety | Done in `8b69956`: 22 families shown as 15 looks. |
| Icons: a colour per icon in a project | Done in `8b69956`. |
| Left pop-out menu: less text, description on hover, no pictures | Done in `cdf5096`: names only, description as large type on the right. **Open on phones** (finding 4). |
| Apply it everywhere: clean, modern | Partly. Fixed today: findings 1 and 5. Open: findings 2, 3, 7, 8. |

## Fixed in this pass

**1 · The old purple accent survived on nine pages.** The clean look is black on white, set in `e6dc37f`, but only
the home page, site builder and the three pages that load `tool-themes.js` had it.

```
--accent:#5B2DFF   mockup-studio, chart-studio, chart-styles, diagram-studio, flowchart-studio,
                   flowchart-canvas, shared, moodboard/board.css
--accent:#4f3bd8   tools.css (plus a warm #f6f5f1 page and an automatic dark version no other page has)
```

All now use `#111113` on white, tints are neutral, the mockup sample screen draws in ink, and the tools page no longer
switches to dark on its own.

**5 · Small tap targets (WCAG 2.5.8).** The mono "← ATLAS" back link was 57 × 11 px on eight pages; the atlas route
trail, footer credit link and source links were 17 to 22 px tall.

```
before  atlas #references 38 · #art 3 · #browse 4 · tools 5 · chart-styles 26 · moodboard 1
after   0 · 0 · 0 · 0 · 20 · 0
```

Fixed with vertical padding on inline links, so nothing moves. The 20 left on chart-styles were "Data table"
disclosure rows at 20 px; they were patched after this reading and not re-measured.

**6 · Accessibility · 1.4.3 · Drag handles in the site-builder outline.** `ol#ol > li.blk > .grip` rendered "⋮⋮" at
2.38:1 against a 4.5:1 requirement, ten instances. `.grip` now uses `var(--mute)`. Not re-measured.

## Open findings, most valuable first

**2 · Major · Site-builder templates and the tools page still show earlier generated art.** Portfolio (origami
crane), Agency (dark crystals), Shop (golden bird) and others open with atlas art, and the pre-rendered thumbnails in
`builder/thumbs/` and on `tools.html` are screenshots of it. The tools thumbnails also still show purple buttons. Fix:
swap those templates to the CC0 photographs or drawn artwork, then re-run `tools/builder-thumbs.mjs` and
`tools/tool-thumbs.mjs`. Both need Playwright, which is not on this machine.

**3 · Major · The atlas sections and the newer pages are two different designs.** Measured on cards and controls:

```
newer pages (home, interactions, app templates, effects)   Inter · 16px cards · pill buttons · white
atlas sections (#browse, #art, #systems, #ux, #vases...)    Manrope + Cormorant · 0px cards · #f2f4f7
```

`#art` has 60 media tiles at 8 px inside 0 px cards; `#effects` in the same file uses 16 px. Body font is Inter on 12
pages, Manrope on the atlas, icon library and account page, and system-ui on My fonts.

*Update, same day: the card half is done.* `site/atlas-cards.css` gives nine atlas card types (about 370 cards) the
shell the landing-effects grid already used: white panel, hairline border, 16 px corners, preview inset 8 px with
10 px corners, 22 px title, one hover. Measured after on eight sections at 1440 px and nine at 390 px: every card at
16 px, previews at 10 px, titles at 22 px (19 px on phones), no sideways scroll. Still open: one body font, and the
cards on the standalone pages (theme kits, icon library) were not touched.

**4 · Major · On a phone the library drawer has no descriptions at all.** At 760 px and below the drawer drops the
right-hand panel, and there is no hover on touch. Fix: show the note of the row being pressed in a strip pinned to the
bottom of the drawer, or as one muted line under the current group's rows only.

**7 · Major · Half the atlas heroes are dark.** Ten sections (systems, typography, motion, effects, compare,
pairings, creations, references, projects, playground) open on a dark film with cream type; nine open light. The text
is readable, the fallback behind it is solid `rgb(4,5,10)`. It is a consistency choice: if "clean light" is the rule,
these ten need light films or a light scrim.

**8 · Note · Dense small type.** Text under 11 px: brand generator 132 elements (down to 9 px), theme kits 67, chart
style guides 66, animation studio 66. Raise the floor to 11 px, as the 10 November audit pass did elsewhere.

**9 · Note · `account.html` requests a host that does not resolve** (`ERR_NAME_NOT_RESOLVED`) on load. Likely the
Supabase project URL from a local or placeholder config. Check it on the live site while signed out.

**10 · Note · Heading levels skip** on six atlas sections (`h1 → h3` on #systems, #cinema, #assets, #references;
`h3 → h5` on #ux; `h2 → h4` on #compare). Cards use `h3` directly under the page title.

**11 · Note · Standalone pages carry two headers.** Each studio has its own "← ATLAS · Title" row under the global
bar, and `tools.html` adds a second nav (Catalogue, Design systems, My projects, Sources) that repeats the bar's menus.

**12 · Note · Remaining small targets** are native sliders (16 px tall) and 13 to 18 px checkboxes on about ten
views, and 138 controls inside the component specimens on `#ux` at phone width.

## Readings that were not defects

- **Hero text at 1.01:1** on ten sections: the probe cannot see the sibling film layer. Checked by screenshot.
- **Skip links at 1:1:** parked off-screen until focused.
- **"Unnamed" inputs** in the builder page settings and animation kits: they have `label[for]` or a wrapping label; the
  panel was collapsed when measured.
- **Selects whose name "includes every option":** a probe heuristic for wrapping labels. Standard name computation
  leaves the control's own options out, and I could not confirm a problem in the browser's accessibility tree. My
  earlier note about the icon family select should be read the same way.

## Ideas from the reference sites

Read from the pages' own markup: 21st.dev, Magic UI, Aceternity UI, Oversight Supply, Hoverstat.es, Minimal Gallery,
Typewolf, Haikei. Siteinspire was summaries only; Maxibestof would not load. None of them shows descriptions inside a
navigation menu, so the atlas drawer is already ahead there.

1. **One filter shell** in place of chip rows: search, a category dropdown, a segmented control with counts, and a live
   "70 results" line. From Oversight Supply. The interactions shelf has 17 chips over two rows.
2. **One card everywhere:** bordered shell with 8 px padding, a fixed-ratio preview with a smaller radius, a 13 px
   title and an 11 px "category · type" line. From Supply and 21st. This is the fix for finding 3.
3. **One hover:** lift 4 px, scale the image 1.025, fade up a small pill, only under `@media (hover:hover)` and with a
   reduced-motion guard. From Supply.
4. **Still artwork first, live demo on hover or click.** From Supply and Minimal Gallery. The interactions shelf loads
   live previews as they scroll in.
5. **Draw previews inside a browser or device frame** with the item's name in the address bar. From Hoverstat.es. Good
   answer to "mock-ups should not just be images".
6. **Counts on every tab and chip, tabular numerals, in a sticky bar under the header.** From 21st.
7. **One detail layout per item:** breadcrumb, Preview and Code tabs, copy button, spec list, "More in this
   category". From 21st, Magic UI and Aceternity.
8. **Long tag lists behind an "All types" button** that opens a filter sheet, six chips visible. From Minimal Gallery.
9. **A one-line grey subtitle under each section heading** and a two-line clamp on card descriptions. From 21st and
   Aceternity.
10. **Metadata that links to its own listing** (a card's style or font opens that style's page). From Typewolf.

## Where to start

1. Finding 2: replace generated art in the templates, regenerate both thumbnail sets (needs Playwright).
2. Finding 3 with ideas 2 and 3: one card and one hover across the atlas sections.
3. Finding 4: descriptions in the phone drawer.
4. Idea 1 on the interactions shelf.
5. Findings 8 and 10: an afternoon of small fixes.
