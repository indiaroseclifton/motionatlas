# Visual & Motion Atlas

A field guide to how images move, and a toolkit for building with what it shows. It's a static
site (`site/`) with a few serverless functions (`api/`), deployed by Vercel from `main`.

## Contents

- [Flowchart studio (canvas)](#flowchart-studio-canvas)
- [Chart studio](#chart-studio)
- [Diagram studio](#diagram-studio)
- [Tools overview](#tools-overview)
- [The constant top bar](#the-constant-top-bar)
- [Directory map](#directory-map)
- [Theme kits (site/theme-kits.html, site/kits/)](#theme-kits-sitetheme-kitshtml-sitekits)
- [Brand kit generator (site/brand-generator.html, site/brandgen/)](#brand-kit-generator-sitebrand-generatorhtml-sitebrandgen)
- [Design systems D01–D48](#design-systems-d01d48)
- [Icon families (#icons) and project icons](#icon-families-icons-siteicon-libraryjs-and-project-icons)
- [UI components (#ux, site/component-lab.js)](#ui-components-ux-sitecomponent-labjs)
- [Interactions shelf (site/interactions.html, site/interactions/)](#interactions-shelf-siteinteractionshtml-siteinteractions)
- [Site builder (site/page-builder.html, site/builder/)](#site-builder-sitepage-builderhtml-sitebuilder)
- [My projects and accounts (Supabase)](#my-projects-and-accounts-supabase)
- [AI endpoint (api/ai.js)](#ai-endpoint-apiaijs)
- [Service worker (site/sw.js)](#service-worker-siteswjs)
- [Performance notes](#performance-notes)
- [Local development](#local-development)
- [Deploying](#deploying)
- [Feature notes](#feature-notes)
- [Mockup & social asset studio](#mockup--social-asset-studio)
- [Moodboards](#moodboards)
- [Adding things](#adding-things)
- [QA scripts](#qa-scripts)
- [Contributing and collaborator workflow](#contributing-and-collaborator-workflow)
- [Publishing (Vercel Blob) and accounts, in one place](#publishing-vercel-blob-and-accounts-in-one-place)
- [Credits and licences](#credits-and-licences)

The library holds:

| What | Count | Where it lives |
| --- | --- | --- |
| Catalogue entries (styles, art, animation, motion, components, effects, systems, films) | 387 | `site/catalogue.json` + `site/expansion.json` |
| Theme kits | 48 | `site/kits/` |
| Atlas design systems | 48 (D01–D48) | `site/expansion.json`, `systems.js`, `system-previews.js`, `system-kits.js` |
| UI components | 70 (C01–C70) | `site/component-lab.js` |
| Interactions | 114 | `site/interactions/` |
| Landing effects (techniques) | 41 (L01–L49, with gaps where older effects were retired) | `site/effects-data.js` (the techniques), `site/effects-lab.js` (the lab UI), `site/expansion.json`, clips in `site/assets/fx/clips/` |
| Atlas themes (component lab skins) | 22 | `site/atlas-themes.js` |
| Site-builder templates / sections / photographs | 26 / 56 / 82 (CC0, `site/assets/photos/`) | `site/builder/` |
| Icons | 6,468 in 22 families, shown as 15 looks | `site/icons/`, `site/icon-library.js`, `site/specimens.js` |
| Chart types / diagram types / flowchart templates | 26 / 18 / 24 | `site/dataviz/` |

### Landing effects and the Interactions shelf

Two sections with a clear split. **Landing effects** (`atlas.html#effects`) are the techniques: one reusable technique per
entry (CSS scroll-driven animation, View Transitions, `@starting-style`, scroll snap, clip-path and masks, SVG path
drawing, split text, variable fonts, WebGL shaders, canvas particles, pointer effects, video scrub, blur-up loading,
reduced-motion strategies…). Each runs full screen with intensity, duration, easing and reduced-motion controls, a guide
(what it is, when to use it, performance, accessibility, browser support) and the exact code it runs. The
**Interactions shelf** (`interactions.html`) holds finished pieces built from them: every entry in
`site/interactions/manifest.js` has `uses:['L..']`, shown as "Built with" on the shelf and "Used in" on each technique.
Retired effect IDs (L06, L17, L22, L28, L31, L35–L37) were merged into techniques or left to the shelf. Card clips
(`assets/fx/clips/Lxx.{mp4,webm,webp}`, 1280×800, about 5 s, each video under 700 KB) are recorded with Playwright in
virtual time and encoded with ffmpeg.

If you change one of these, update the numbers in this table, the page `<meta name="description">`
tags and the few hard-coded labels (`atlas.html` noscript and catalogue rail, `home.js`,
`atlas-share.js`, `page-builder.html`). Most counts on the atlas itself are computed at runtime.

Live: https://motionatlas-ten.vercel.app (`/` rewrites to `/atlas`).

## Flowchart studio (canvas)

`site/flowchart-studio.html` is the full studio: the left panel (title, diagram type grid with best-fit suggestion, steps editor Visual/Code, layout, pre-flight, Templates), style chips across the top, Play/Video/GIF build-up and every export. Its centre is the **interactive canvas** (`dataviz/canvas.js` plus the newer `flow.js`, `flow-editor.js`, `flow-text.js`, `presets.js`, `templates-more.js`): clicking any element, in any of the diagram types, selects it and opens its details with its incoming and outgoing connections (click one to jump to it) and connection health; elements drag and resize, handles create and reconnect connections, double-click edits, and the rail adds shapes from the searchable library, imports Mermaid/outline/JSON, loads the 29 process templates and runs Describe a process (AI with a rules fallback). Editing on the canvas rewrites the steps text and editing the steps redraws the canvas; switching diagram type re-lays-out the same elements. Undo/redo, Viewing/Editing, minimap, align/distribute, presentation mode and keyboard shortcuts come with it. The studio page is built from the canvas page's script (`site/flowchart-canvas.html`) with the studio layout; `site/flowchart-canvas.html` stays as the slimmer canvas-first layout of the same engine, and both share the saved chart. `dataviz/classic/` holds the older pre-canvas engine copies (no longer loaded by the studio). In the canvas page, every element is its own piece you can drag, and a double-click (or double-tap) opens a side panel to edit it and its connections.

- **One canvas.** Starting from a template, adding an element or combining another diagram puts separate elements on the same canvas. Positions are saved with the chart and travel in share links.
- **Start from** lists diagram templates (one per type, plus combinations). **Process templates** is a searchable gallery of 29 real processes with live thumbnails (incident response, refund handling, purchase and invoice approval, hiring, onboarding and offboarding, lead qualification, A/B tests, data pipeline, password reset, returns, support escalation, social scheduling, CI release, sign-up with email verification and more; `dataviz/templates.js`, `dataviz/templates-more.js`, `dataviz/examples.js`).
- **Describe a process** (Assist). Write the process in sentences or as a list; on the live site `/api/ai` (`mode:'flow'`, Claude Haiku, structured JSON: nodes with kind and lane, labelled edges) draws it, and anywhere the AI is off or unreachable (including localhost) a rule-based reading does instead and says so: numbered or bulleted steps, `If …, …` / `Otherwise …` become a decision with Yes and No branches, `go back to step 2` becomes a loop, the first and last steps become start and end. Replace the canvas or add to it.
- **14 diagram types.** Flow, step list, stage columns, cycle, decision tree, capability map, swimlanes, mind map, and six more in a dropdown: sequence, entity relationship, state machine, org chart, timeline, customer journey. Several types can share one canvas (`dataviz/presets.js`).
- **Kinds.** Each kind has its own icon, subtle colour and box shape, and one fixed size (`KIND` in `dataviz/flow.js`). Kinds are written in the source as `:::status.kind`, for example `a[Stripe]:::none.mod_external`.
- **Connection modules** (internal, external, flow) hold details and run a plain rule check: does it exist, is it needed, what must happen, how to improve it. No AI is called.
- **Health dots.** Green, amber or red dot on every element with a hover note (in and out counts). A glyph rides with the colour.
- **Flow motion.** Connections animate in the direction they flow (both ways for `<-->`). Off under reduced motion.
- **Fixed layout** keeps the original one-picture view and its build-up video and GIF export.
- **Layout.** A slim header (name, look, share, export), a tool rail on the left (Add, Templates, Workspace, Assist, Diagram settings), a bottom dock (undo, redo, zoom, level of detail, flow motion, shortcuts), and an element panel on the right that opens when you select or double-click something. The Diagram settings panel (Chart, Steps, Layout, Checks) is closed until asked for.
- **Mouse and keyboard.** Click selects; Shift-click or Shift-drag selects several; drag moves; drag from a round handle to connect (drop on empty space to add a connected element); select a line and drag an end to reconnect or drop it on nothing to disconnect; right-click or press and hold for a menu; double-click empty space adds an element. Copy, cut, paste, duplicate, select all, undo and redo, Delete, arrows to nudge, Tab to move between elements, 0 to fit, + and - to zoom, ? for the full list.
- **Resize.** Drag any corner of a selected element (Shift keeps the shape), or type a width and height in its panel; Alt+arrows resize from the keyboard; double-click a corner to go back to the standard size. Text refits to the new box.
- **Workers.** A worker is an element that does a job. Adding one shows the workflow it runs; setting "How many" shows one lane of that workflow per worker. Elements can also record what they kick-start (saved with the chart).
- **Shapes library.** Add opens a searchable shape picker (type "database", "wait", "actor"…, Enter adds the first hit): the basic flowchart set plus document, delay, manual step, manual input, display and off-page link, people and systems, notes, connection modules, and containers (Group wraps the selection; Swimlane pool adds three named lanes).
- **Connectors.** Ports on all four sides; drag from one to another element to connect, or onto empty space to add a linked step. Connectors route at right angles round other elements. Each connection has a label, a line (solid, dashed, thick) and an end (arrow, both ways, circle, cross, plain), set in its panel; Mermaid `--o` and `--x` read and write the same ends.
- **Arrange.** With two or more selected, a toolbar appears: align left, centre, right, top, middle, bottom; space evenly across or down; group; zoom to selection (also Alt+A/H/D/W/V/S, Alt+Shift+H/V, Ctrl+G and Ctrl+Shift+G, Shift+2). Smart guides line a dragged element up with the edges and centres of the others; the grid button snaps to a 24px grid; hold Alt to place freely. Groups move everything inside them.
- **Minimap** (dock) shows the whole canvas and the current view; click or drag in it to move. **Present** (dock) steps through the flow from its start, one element at a time, dimming what comes later; arrows step, Esc ends.
- **Text in and out** (`dataviz/flow-text.js`, `window.FlowText`). Import text (rail) takes Mermaid flowcharts (`graph`/`flowchart` TD/LR/RL/BT, every classic node shape, Mermaid 11 `A@{ shape: delay }`, quoted and `<br/>` labels, subgraphs, `class`, `--o`/`--x`), a plain outline (one step per line, `?` makes a decision, indented `Yes: step` or `Yes → step` are branches, `## Group` starts a group, `[database]` sets a kind, `(have)` a status), or a JSON file from this studio; it can replace the canvas or add to it. Export adds Mermaid (`.mmd`, also Copy Mermaid), Outline (`.txt`) and JSON, next to SVG, PNG, web page, video, GIF and style guide. Mermaid and outline round-trip every template (checked in `tools/dataviz-test.mjs`).
- Files: `dataviz/flow.js` (engine, kinds, free placement, routing), `dataviz/presets.js` (layouts, templates, workers), `dataviz/canvas.js` (canvas controller, history, clipboard, arrange, guides, menus, panel), `dataviz/flow-text.js` (Mermaid, outline, JSON). `window.FlowStudio` exposes the canvas for tests.

## Chart studio

`site/chart-studio.html` turns your own data into a chart. Engine: `dataviz/chartmaker.js` (`window.DVChartMaker`), drawn with the chart style guides' kit (`DVCharts.kit` in `dataviz/charts.js`) so a chart matches its style guide.

- **Data in.** Paste cells from a spreadsheet (also straight into the grid), upload `.csv`/`.tsv`/`.json`, or edit the grid (add/remove rows and columns, transpose). 21 sample datasets. Column types (number, time, text) are inferred.
- **26 forms.** Column, horizontal bar, stacked and 100% stacked column, stacked bar, pie, donut (five slices max, the tail folds into Other, close values warn), treemap, line, area, stacked area, small multiples, slope, dumbbell, waterfall, bullet, KPI tiles, meter, funnel, sankey, histogram, box plot, heatmap, scatter, bubble, radar.
- **Recommend.** `recommend(table)` ranks forms from the data's shape (the dataviz form heuristic: the job picks the chart, a single row is a stat tile, five-plus series go to small multiples).
- **Style.** Any of the nineteen styles; light/dark: the opposite mode is computed (surfaces swapped, hues snapped into the mode's OKLCH lightness band) and validated. Colour slots per series, emphasis (one series in colour), "Most distinct order" (searches slot orders for the widest colour-blind separation). The palette check is a browser port of the dataviz validator (lightness band, chroma floor, Machado CVD ΔE, normal-vision ΔE, contrast) run on the colours actually shown.
- **Options.** Number format (auto, 1,234, 1.2K, percent, prefix/suffix, decimals), value labels, legend, direct labels, gridlines, axis labels, zero baseline, sort, size. Annotations: a callout with an arrow to one value, a reference line, a reference band.
- **Accessible.** The SVG has `role="img"`, a `<title>` and a generated long `<desc>` (overridable); a data-table toggle; the chart is one tab stop and the arrow keys walk every mark with its tooltip (announced in a live region).
- **Out.** SVG (fonts embedded), PNG 2×, copy SVG, embed HTML (chart + data table), CSV, build-up video/GIF (`DVChartMaker.plan`: bars grow, lines draw; `DVExport` takes a `plan`). Drafts in localStorage, a share link with the whole chart compressed into `#c=`, undo/redo. `?style=`, `?kind=` and `?sample=` preset the studio (the style guides link here per style).

## Diagram studio

`site/diagram-studio.html` draws eighteen non-process diagrams: roadmap, org chart, journey map, comparison matrix (`dataviz/diagrams.js`) and timeline, Gantt with dependencies, radial mind map, Venn (2–3 sets), 2×2 matrix, pyramid, cycle, sequence, entity relationship, network, kanban, SWOT, fishbone and process arrows (`dataviz/diagrams-more.js`, registered into `window.Diagrams`). Click an element on the canvas to edit it in the panel; drag ⋮⋮ to reorder list items (arrow keys work too); drag 2×2 points to re-score. **Import text** reads an outline or Mermaid-like syntax for every type (sequence `A->>B: msg`, ER `A ||--o{ B : label`, Gantt `Task :id, after a, 2`) and shows the current diagram as text. Templates gallery, undo/redo, drafts, share link (`#d=`), SVG, PNG, embed HTML, text export, build-up video and GIF.

---

## Tools overview

Every tool is listed once in `site/tools-data.js` (name, page, group, one-line purpose, thumbnail in
`site/assets/tools/`). That registry feeds `tools.html`, the home page shelf, the search and
`tools/site-qa.mjs`. Numbers in the blurbs are `{tokens}` filled from `site/counts.json`.

| Tool | Page | Makes |
| --- | --- | --- |
| Site builder | `page-builder.html` | multi-page sites from 26 templates, export ZIP or Publish |
| Brand kit generator | `brand-generator.html` | palette, fonts, logo, tokens and a theme kit |
| Mockup studio | `mockup-studio.html` | device frames and every social size |
| Chart / Diagram / Flowchart studios | `chart-studio.html`, `diagram-studio.html`, `flowchart-studio.html` (and the lighter `flowchart-canvas.html`) | SVG, PNG, video, GIF |
| App templates | `app-interfaces.html`, `app-screens/`, `tools/app-screens/` | 22 screens, six colour skins and four looks (four dashboards including a CRM pipeline, a project timeline, product inventory, a shop product page, a documentation page, a fitness tracker, landing and pricing pages, mobile banking, calendar, kanban, data table, files, inbox, AI chat, sign-in, onboarding, billing, settings); light and dark; built from `tools/app-screens/src` by `node tools/build-app-screens.mjs` |
| Motion graphics studio | `motion-graphics.html`, `motiongfx/templates.js`, `motiongfx/studio.js` | 28 canvas animations (titles, lower thirds, logo stings, transitions, numbers, social, backdrops); export WebM (keeps transparency), GIF, PNG, PNG sequence or one HTML file |
| Interactions shelf, Background generator | `interactions.html`, `atlas.html#backgrounds` | single-file motion |
| Theme kits, Icon library, Chart style guides | `theme-kits.html`, `icons.html`, `chart-styles.html` | tokens, packs, palettes |
| Moodboards, My projects | `moodboard.html`, `atlas.html#projects` | boards and project hubs |

Hand-offs (all checked by `tools/handoff-test.mjs`): chart, diagram, flowchart studios and the Site
builder export **Make share image** into the Mockup studio (`mockup/handoff.js`); the Brand generator,
Theme kits and the Moodboard style dialog send a brand to the Site builder (`kits/handoff.js`, the
`atlas-pb-brand-handoff` key); Theme kits and the Brand generator pin to Moodboards (`moodboard/pin.js`);
the Icon library sets a Site builder favicon (`?favicon=1`); the two flowchart pages share one saved chart.

## The constant top bar

`site/site-bar.js` is a fixed 44 px bar on every public page, including `atlas.html`: brand, **Library**, **Make**,
**Your studio**, **All tools** and search (five items). Library and Make open two-column menus (groups on the
left, one-line rows on the right, the purpose of the hovered row underneath); Your studio is a short list; a group
can hold a **More** row that expands in place. On phones the bar is brand, search and a Menu button that opens an
accordion (one group open, the current page's group first). Keyboard: Enter or Space opens a menu, arrows move,
Right enters the list, Left returns, Esc closes.

**Editing the menus:** everything comes from `site/site-nav-data.js`. `ATLAS_NAV_GROUPS` holds every entry once
(href, name, one-line purpose, film); `ATLAS_NAV_MENUS` arranges them into the bar's menus (keep a menu to about
seven rows; put rarer items in a `{more}` row). `atlas-nav.js` (the Library drawer and breadcrumb) reads the same
groups. Studios keep primary actions in their own toolbars and put the rest under one **More** menu (Site builder,
Moodboards); their cross-links to other studios are hidden because the bar's menus carry them.

A page gets the bar from the lines `tools/install-site-bar.mjs` adds to its `<head>` (an inline style that reserves
the height, plus two deferred scripts) and a no-JS link row after `<body>`. **After adding a page, run
`node tools/install-site-bar.mjs`.** Full-height editors are fitted below the bar by `fit()` in
`site-bar.js`; where a layout uses `calc(100vh - Npx)`, write `calc(100vh - Npx - var(--sb-h,0px))`.
`interactions/demos/` (embedded) and exported or published user sites
never get the bar.

## Directory map

```
api/                     Vercel serverless functions
  ai.js                  site-builder AI (Claude Haiku 5.5)
  site.js                site publishing (/site/<id>/)
  share.js, upload.js    project sharing (Vercel Blob)
  apply.js               "Staged application" form → email via Resend
  _lib/                  shared helpers for share/upload
site/                    everything that is served (outputDirectory in vercel.json)
  atlas.html             the atlas: one page, sections after the # (see below)
  app.js, app.css        catalogue core: routing, grid, detail view, compare, vases
  catalogue.json         144 original entries (A, S, M, E, W prefixes)
  expansion.json         237 more entries (C, D, L, R, F) + source references
  atlas-*.js/.css        nav, enhance (plate bands, header films, search), share, explore, tours, refine
  lazy-bg.js             holds catalogue card images back until they scroll near (load it first)
  kits/                  theme kits (theme-kits.html)
  interactions/          interactions shelf: manifest.js + demos/*.html
  builder/               Site builder (page-builder.html)
  system-components/     live HTML/CSS components for systems D21–D32
  dataviz/               flowchart, diagram and chart studios, chart style guides
  mockup/, moodboard/, brandgen/   Mockup studio, Moodboards, Brand kit generator
  tools.html, tools-data.js        the Tools overview and the registry every tool is listed in
  site-bar.js, site-nav-data.js    the constant top bar and its menu data (see below)
  counts.json            every headline number, computed from the data (tools/site-counts.mjs)
  studies/               live WebGL particle studies (lion, whale, butterfly, bird/fox)
  supabase-client.js     accounts (window.AtlasCloud)
  projects*.js, account.html, p.html, shared.html   My projects, sign-in, public hubs, shared links
  icons/, fonts/, vendor/, assets/                  static assets (films in assets/films/)
  work/djinyc/           a client mock-up (served at /work/djinyc/home)
  original/              backups of files from the first mirror; not linked
  sw.js                  service worker (bump the cache name on every deploy)
supabase/schema.sql      tables, policies and storage bucket for My projects
tools/                   generators and helper scripts (see each section)
film/                    HyperFrames source for the Genesis hero film
index.html               the original stand-alone landing hero (not deployed; site/ is)
docs/, deliverables/     research notes, audit, exported charts
vercel.json              cleanUrls, rewrites, redirects, cache headers
```

### The atlas (`site/atlas.html`)

One HTML page. Each section is a `<section class="page" id="…">` shown by `route()` in `app.js`
from the hash: `#home`, `#browse` (catalogue), `#motion` (animation studio), `#effects`, `#ux`
(component lab), `#systems`, `#icons`, `#typography`, `#art`, `#cinema`, `#vases`, `#pairings`,
`#compare`, `#inspiration`, `#playground`, `#projects`, `#tours`, `#backgrounds`, `#showcase`,
`#references`, `#assets`, `#creations`. Deep links carry a query after the hash, for example
`#browse?entry=A53`, `#ux?component=C30&theme=S16`, `#effects?fx=L25`, `#systems?id=D22`,
`#browse?feel=liquid&film=1`, `#tours?t=lines`, `#backgrounds?bg=…`.

Scripts are plain globals loaded in order at the end of `atlas.html`; feature modules hook into
`app.js` and each other, so keep the order when adding one. `atlas-theme.css` is generated by
`tools/build-atlas-theme.py` (edit the script, not the CSS). `atlas-cards.css` loads last and gives every
atlas card one shell: white panel, hairline border, 16 px corners, a preview inset 8 px with 10 px corners, an
11 px mono kicker, a 22 px display title and 14 px text, with a 4 px lift on hover for cards that open something
(`.cataloguecard`, `.artcard`, `.assetCard`, `.iconChoice`, `.bgCard`; text-only `.refcard`, `.fontpair`,
`.fontspecimen`, `.paircard`). Give a new card type that shell by adding its class there. Section headers are plain (title, one line, "See also" links): `CALM` in `atlas-enhance.js` switches the header films, plate labels and curve drawings back on. The brand kit generator and a rendered theme kit show one part at a time under tabs (`brand-generator.html`, `kits/tabs.js`).

Inner pages get a plate band, "Pairs well with" links and, for most, a looping header film.
These are set per page in `PAGES` at the top of `atlas-enhance.js` (film, poster, tone). Header
films start after the page has loaded and only play while on screen. Posters are 1280px WebP
(`assets/films/*-1280.webp`).

---

## Theme kits (`site/theme-kits.html`, `site/kits/`)

48 complete brand kits, Matrix (01) to Chambers (48). Each one has colour scales with contrast
grades, light and dark tokens, a type scale, components, a live animated canvas background, logo,
mark, pattern, divider, icons, a social card, slide, email header, business cards, favicon and
guidelines. Each kit downloads as a ZIP with CSS, SCSS, JSON and Tailwind tokens.
`theme-kits.html#<kit id>` opens a kit.

| File | Role |
| --- | --- |
| `kits/themes.js` | Kits 01–09, their backgrounds and SVG generators; creates `window.ThemeKits` with the registries `list`, `BG`, `ICONS`, `PAT`, `MARK`, `DIV` and the zip writer |
| `kits/kits-a.js` | Kits 10–24 (same shape), pushed into `ThemeKits.list` and the registries |
| `kits/kits-b.js` | Kits 25–48 |
| `kits/brand.js` | Brand layer: colour maths, `scales`, `modes`, `typeScale`, exports (`css`, `scss`, `json`, `tailwind`), brand applications (`og`, `slide`, `email`, `favicon`, `cardFront`, `cardBack`, `clearspace`), `files(k)` and `zipKit(k)` |
| `kits/render.js` | `ThemeKits.render(kit, el, {say, playing})`, `miniCard`, `mountStill`, `loadFonts`, `vars`, `save`, `copy` |
| `kits/kits.css` | Kit page styles |

Load order is always `themes.js`, `kits-a.js`, `kits-b.js`, `brand.js`, `render.js`. The page
builder loads the same files to offer kits as styles and asset blocks.

**Add a kit:** append an object to `K` in `kits/kits-b.js` (or a new file loaded after it) with
`id`, `no`, `name`, `tagline`, `mood`, `feel`, `fonts` (`head`, `body`, Google Fonts `css`
query), tokens `t` (`bg surface ink mute line accent onAccent accent2 radius shadow glow`),
`bg` (key of a background function), `stroke`, `case`, `bgDesc`, `voice`, `dos` and `donts`.
Add its background to `BG` as `(canvas, tokens, still) => stop()` (self-contained, because it is
exported with `Function.prototype.toString()`), plus `PAT`, `MARK` and `DIV` generators that
return SVG strings. Check the contrast labels on the page and run axe. Then update the counts
(the theme-kits meta description says "Forty-eight").

## Brand kit generator (`site/brand-generator.html`, `site/brandgen/`)

Name, a sentence and 3–5 feel words (plus optional logo, base colour, mode, audience) give a deterministic brand: OKLCH palette with automatic WCAG fixes and colour-blind checks (`brandgen/engine.js`, `window.BrandGen`), one of ~45 Google Fonts pairings with rationale, logo lockups (SVG), CSS/JSON/Tailwind tokens, and a theme-kit object rendered by `ThemeKits.render` and downloadable with `ThemeKits.zipKit`. State lives in the URL hash (`#s=`) and a localStorage draft.

## Design systems D01–D48

Every atlas design system is a catalogue entry in `expansion.json` (`group: "Design systems"`,
with `tokens` and `rule`) and has a hub on `#systems`. Sets: D01–D32 originals and mock-up
derived systems, D33–D36 and the other open-source interpretations built from published tokens
(Primer, GOV.UK, Spectrum, USWDS, Lightning, Ant, Bootstrap, Pajamas, PatternFly, Ionic, Paste,
Canvas, Mantine), and the newer originals up to D48.

| File | Role |
| --- | --- |
| `systems.js` | `SystemAtlas`: hub tabs, specs for the earlier systems, `#systems?id=` links |
| `system-previews.js` / `.css` | `SystemPreviews`: an original product screen for each system, coloured from `--sys-*` tokens; `SPECS` and `SOURCES` for the later systems |
| `system-kits.js` / `.css` | `SystemKits`: each system as a downloadable kit (token bar, Kit tab with animated background, scales, component sheet, logo/icons/pattern, voice, dos and don'ts), the Cards/Kits toggle and collection filters, credits for open-source sources |
| `system-components/` | Live HTML/CSS components for D21–D32 (`D21.js`…`D32.js`, rendered in shadow roots by `render.js`, swapped in by `integrate.js`); check one with `system-components/preview.html?sys=D22` |

**Add a system:** copy the D48 entry in `expansion.json` with a new id, add its spec and screen in
`system-previews.js`, add its kit row (background family, voice lines, do, don't) next to `D48`
in `system-kits.js`, and a credit line if it interprets someone else's system. Update the counts.


## Icon families (`#icons`, `site/icon-library.js`) and project icons

`atlas.html#icons` shows the 22 families as 15 **looks**, one card each (`SpecimenAtlas.looks` in
`specimens.js`): Outline (the four Phosphor weights plus Lucide, Tabler and Heroicons as draws of
the same idea), Solid, Duotone, Broken line, Bold duotone, Rounded filled, Hand-drawn, Pixel,
Two-tone colour, Flat colour, Colour pictograms, 3D emoji, Illustrative, Brand logos and Animated
line. A **look bar** (colour presets or a custom colour, size S/M/L, tile tint/plain/round/circle)
restyles every monochrome family live; the choice is kept per browser in `atlas-icon-look`.
Specimens are drawn inline from `site/icons/specimens.json` (13 per family, written by
`tools/icons.py`), so `currentColor` applies; OpenMoji, Fluent 3D, Flat Color Icons and Icon Park
carry their own colours and ignore it. The inspect panel's "+" on each specimen, and the **Pick
icons** dialog on a project page (any icon of any family, searched from `icons/sets/<family>.json`),
add single icons to a project as `project.iconPicks = [{family, name, colour}]`; each pick has its own
colour swatch on the project page and is listed in the exported brief. Whole families can still be
saved (`project.icons`). The nine families added in November 2026 come from Iconify bundles
(`ICONIFY` in `tools/icons.py`); run `python3 tools/icons.py` (Pillow needed for Fluent) to rebuild.

## UI components (`#ux`, `site/component-lab.js`)

70 native HTML/CSS components (C41–C70 fully interactive), each shown in every state, in any of
the 22 atlas themes (`atlas-themes.js`), light or dark, comfortable or compact, with HTML, CSS,
React and token export plus accessibility notes. Components are objects in `component-lab.js`
(`id`, `name`, `v`, `html`, `css`, `a11y`, `live`) exposed as `ComponentLab.components`; each also
has a catalogue entry (`C..`) in `expansion.json`. The page builder lists them automatically.

## Interactions shelf (`site/interactions.html`, `site/interactions/`)

82 original pieces, each one self-contained HTML file in `interactions/demos/` with no
libraries (the circuit-city hero uses three.js from cdnjs). The shelf mounts live previews only
while they're on screen. Each piece has Copy HTML, Download, full screen, notes and an AI build
prompt, and `interactions.html#<id>` opens it. Copied code rewrites `../../assets/` to the live
site.

**Add one:** put `interactions/demos/<id>.html` in place (keyboard support, phone width,
`prefers-reduced-motion`, axe clean), then add an entry to `window.INTERACTIONS` in
`interactions/manifest.js`:

```js
{id:'my-piece', t:'Title', cat:'Cards', tone:'dark', d:'One-line description.',
 how:'How it works.', use:'What it suits.', p:'AI build prompt…', added:'2026-10'}
```

`cat` is one of the existing categories (Cards, Carousels, Scroll, Canvas, Galleries, Navigation,
Lists, Controls, Buttons, Type, Feedback, Scroll stories, Sections, Signal & data). `added` marks
it New. `hash` picks a style for `sec-*` pieces. The page builder picks it up automatically
(sections excluded). Update the count in the `interactions.html` meta description and `home.js`.

## Site builder (`site/page-builder.html`, `site/builder/`)

A website builder that runs in the browser: multi-page sites, edit on the canvas, one design system, export a
static site or publish it to a live address. Old single-page saves open as one-page sites.

- **Home screen (sites and templates):** opening the builder shows a full-page home, not the editor: your sites as
  cards (rename, duplicate, delete with undo, open a site file, download, sync to My projects), the 26 templates with a
  category filter and a preview page per template, and "Start another way" (Continue, Describe your site, Blank site,
  From a brand kit). First-time visitors see the templates first. "Sites & templates" in the editor header returns home;
  "Go to editor" leaves it. Template thumbnails are pre-rendered WebP files in
  `site/builder/thumbs/<template>-<page>.webp` (about 10 KB each); regenerate them after editing a template with
  `BASE=http://localhost:8797/ node tools/builder-thumbs.mjs [templateId...]` (needs Playwright and Pillow). "From a
  brand kit" takes the Brand generator's hand-off (`atlas-pb-brand-handoff`: name, tagline, description, feel words,
  colours, corners, fonts and mark), suggests a template from the description and builds a populated multi-page site.
- **Library panel:** one "Library" dropdown chooses the source (Sections, Components, Interactions, Photos, My images,
  Media & backgrounds, Icons, Kit assets, My blocks) and a "Category" dropdown filters within it, with the search box
  above both; the panel no longer wraps rows of tabs and chips.
- **Layout of the editor:** header shows the site name, a saved / unsaved indicator, Undo and Redo, a **Checks** badge
  (issue count for the page; click for the list), **History** (last 20 automatic snapshots per site, kept in IndexedDB with no size cap, restore is
  undoable) and `?` for the shortcut sheet. The right panel has four tabs: Outline (pages, sections, this page's
  settings), Design (styles and tokens), Site (identity, menu, SEO, 404, forms) and AI. On phones and narrow screens
  the canvas fills the screen with a bottom bar (Outline, Library, Add, Design, More); panels open as sheets and
  the selected section's actions sit in a bar above the bottom bar.
- **Section menu and clipboard:** right-click (or press and hold, or Shift+F10) a section on the canvas or in the
  outline for edit, add after, duplicate, copy, paste, move, hide on every screen, save as reusable block and delete.
  Ctrl/Cmd+C and V copy sections between pages (and sites). Saved blocks keep words and settings and live under
  Library, My blocks (`atlas-pb-blocks-v1`). Find and replace (Ctrl/Cmd+Shift+H) searches every page, the header and
  the footer. Select words on the canvas for the B / I / Link bar (or Ctrl+B / Ctrl+I): the plain text stays in the field and the
  formatting is stored beside it as sanitized inline HTML (`b`, `i`, `a` only), so literal asterisks and brackets stay
  literal; editing the words in the side panel drops stale formatting. Hidden sections show as dashed ghost bars on the
  canvas with a Show button. Zoom (40 to 150%) with the buttons, + and -, or Ctrl+wheel; drag a library card onto the canvas to see a drop line (checked at 100% and zoomed out).
- **Backup and My projects:** Export has "Download site file (.json)" (the whole site plus uploaded images and saved
  blocks) and "Open a site file…" (adds it as a new site). Autosave keeps an existing My projects entry up to date;
  "Sync all sites to My projects" in the start dialog creates a Website project for every site (cloud sync of projects
  follows the projects page when signed in; nothing happens silently when not).
- **Blog:** "Add a blog post" (Outline tab) adds a post page (slug `post-…`, publish date, left out of the menu) built
  from the Article section; its story is one block per line (`## heading`, `> quote`, `- list item`, `![caption](image)`,
  anything else a paragraph). The "Latest posts" section lists posts newest first on any page. The export adds `feed.xml`
  (RSS), a feed link on every page and the posts in `sitemap.xml`. The Blog template ships three posts.
- **Forms:** contact and newsletter forms validate inline, carry a hidden spam trap, Netlify attributes and a success or
  error message, and send by `fetch` to a Formspree address, by `mailto:`, or to Netlify when the form address is the word
  `netlify`; with no address they only confirm.
- **Export QA:** `BASE=http://localhost:8797/ node tools/site-export-qa.mjs [templateId...]` builds every template, serves
  the files and checks each page at desktop and phone width (console errors, links, anchors, images and alt text, metas,
  one h1, balanced HTML, no editor code left behind, axe, mobile menu, accordions, lightbox, forms and honeypot).
- **Photos and images:** the Photos tab (and a Photos source in every image picker) offers 82 CC0 photographs
  from Wikimedia Commons (category CC-Zero, mostly former Unsplash CC0 uploads) in 16 categories, with tag search.
  Files live in `site/assets/photos/` (1400 px WebP, `-640` variants and `th/` thumbnails) and `photos.json` records title,
  author, source URL and licence; every export credits the photos it uses in `assets/CREDITS.txt`. Uploaded images
  are resized to 2400 px and stored as WebP (PNG when transparent); "My images" lists them with rename, alt text, add and
  delete. Each image has a focus point (click the part that must stay in view; stored as `<field>_fp`, rendered as
  `object-position`). Exports add width and height, async decoding and `srcset` (640 / 1280 px copies of uploads, 640 px
  copies of photos). Templates for places, food, property, fitness, weddings, podcasts, documentation and offices use these photographs (the abstract atlas art stays on the design, paper and product templates). Licence table: `docs/image-licences.md`.
- **Speed:** films in the canvas load their poster first and start when they scroll into view; library previews and
  embedded frames are lazy.
- **Pages and sites:** a site has pages (add, rename, duplicate, reorder, delete, home page, file names), a shared
  header and footer, a menu that lists the pages (or a custom list) and a mobile menu. Site settings cover the brand,
  favicon (icon library), language, site address, default description and social image, a 404 page, a form address
  (Formspree URL or `mailto:`) and an analytics snippet. Every page has its own title, description and social image.
- **Editing on the canvas:** click text to edit it in place, click a section for its toolbar (move,
  duplicate, delete, settings, add), drag a section by its handle, replace images (upload, kept in IndexedDB, or pick from
  the atlas), set where a button links, and use the searchable section picker with live thumbnails. Per section: spacing,
  width, alignment, background (soft, accent, inverted, gradient, image, film), tablet and phone tweaks, hide on a
  breakpoint, reveal animation. Shortcuts: Delete, Alt+Up/Down, Ctrl/Cmd+D (duplicate), Ctrl/Cmd+K (add), Ctrl/Cmd+Z/Y, Esc.
  Everything autosaves to this browser.
- **Design system:** 144 styles (4 builder styles, 48 theme kits, 48 design systems, 22 atlas themes in light and dark)
  swap the whole site in one click; site tokens (colours, corner radius, button shape, fonts) sit on top of any style.
- **Responsive and accessibility:** desktop, tablet and phone previews; the Checks list shows low contrast, heading order,
  missing alt text, unnamed links and unlabelled fields, with fixes where they can be automatic.
- **Library:** 54 sections (including article, find-us map, menu, schedule, product grid, course outline, contact form,
  donate, countdown), 70 components, interactions, backgrounds, films, icons and theme-kit assets, plus 26 templates: 20 multi-page
  sites (portfolio, agency, SaaS, restaurant, photographer, event, blog, shop, nonprofit, course, app, studio, coffee shop and
  bakery, fitness studio, law firm, estate agent, wedding, podcast, documentation, conference; files `builder/templates.js` and
  `templates2.js`) and 6 one-page landings (waitlist, product launch, app download, webinar, link in bio, coming soon).
  Every page of a template ends with a call to action, and photographs come from the atlas image library, chosen per template.
- **Settings for every component and interaction:** select one and the panel becomes a "Selected item" form with
  collapsible groups (Content, Layout, Style, Background and frame, Behaviour, Advanced), a settings search, Looks
  (presets), Copy and Paste settings between items of the same kind, Reset to defaults and a first-run tip. The schema is
  derived from the item itself (`builder/settings.js`): all 70 components expose every word, placeholder, picture and link,
  state, size, width, position, accent, text and panel colours, corners, line, shadow, weight, calm motion and an anchor;
  all 82 interactions expose heading, height or shape, width, position, text and accent colour, speed, play always / on
  screen / on hover, calm motion, hidden caption, words and pictures found in the demo, and (for 14 hand-tuned demos,
  `CFG.IXP`) their own options such as points, spacing, hold time or phrases (demos read `window.__ixp(key, default)`).
  Values live in `blk.cfg` (look and behaviour), `blk.set` (background and frame) and `blk.vals` (words). Components and
  interactions are **transparent by default** and blend into the page; every section, component and interaction also has
  Background (Transparent, Page colour, Surface, Accent, Text colour, Custom, Gradient, Image, Film), Border, Shadow,
  Corners, exact padding and "Match the section above". Interactions are rewritten per placed instance by
  `builder/ix.js`: the demo's backdrop is removed (transparent `html`/`body`, canvases and WebGL cleared, glow layers
  hidden, panels that keep their colour get readable text), colours follow the page, speed scales the demo's clocks, and
  the result goes into the preview and the export as a clean `srcdoc` or `interactions/<id>-<uid>.html` file. The
  Components and Interactions library tabs have categories, favourites and recently used.
- **Export and publish:** Export downloads a clean static site as a ZIP (every page, `assets/`, `sitemap.xml`,
  `robots.txt`, `404.html`, favicon, canonical and Open Graph tags, no builder code), a single HTML file for the current
  page, or an AI prompt. **Publish** puts the site at `/site/<id>/` on this domain through `api/site.js` (Vercel Blob; the
  same store as shares). The edit key stays in the browser (`atlas-site-publish-v1`); published HTML is served with a
  sandboxing `Content-Security-Policy`, so a site's own scripts cannot reach the atlas. Limit about 3.8 MB per site.
- **My projects:** "Save to My projects" adds a Website project whose hub links to `page-builder.html?site=<id>`
  (and to the live address once published). Sites are stored in this browser (`atlas-page-builder-v2`).
- **AI:** "Rewrite with AI" per section and "Generate" via `api/ai.js` when `ANTHROPIC_API_KEY` is set; without it
  the builder explains that AI is off and everything else works.

**Your own domain.** Hosting custom domains is out of scope here. Download the ZIP, then deploy the folder to Vercel
(`vercel` inside it), Netlify (drag it onto Netlify Drop) or GitHub Pages, and add your domain in that host's settings.
Set the Site address in Site settings first so `sitemap.xml` and canonical links use your domain.

| File | Role |
| --- | --- |
| `builder/blocks.js` | **Generated.** Run `python3 tools/blocks.py`; it reads `tools/sections_src.py` (`HEAD`, the eight `S` sections, `MORE`) and also writes `interactions/demos/sec-*.html` |
| `builder/site.js` | The site model: pages, shared header and footer, menu, slugs, links, favicon, sitemap and robots helpers |
| `builder/canvas.js` | Template markers, the editing agent that runs inside the preview, uploaded-image store, per-section settings |
| `builder/styles.js` | Style registry, mapping every source onto the builder variables |
| `builder/extras.js` | Code-drawn library blocks (components, interactions, media, icons, kit assets, 404) |
| `builder/settings.js` | Per-item settings: schemas for components and interactions, content extraction and the Selected item panel |
| `builder/ix.js` | Rewrites a demo for one placed interaction: transparent background, colours, speed, play mode, words, pictures |
| `builder/templates.js` | The 12 multi-page site templates |
| `builder/app.js` | UI: library, outline, panels, preview, export and publish |
| `builder/zip.js` | Stored-zip writer (same as the kits') |
| `api/site.js`, `api/_lib/site.js` | Publishing: create, update, unpublish and serve `/site/<id>/<file>` (rewrites in `vercel.json`) |
| `tools/site-builder-test.mjs`, `tools/site-api-test.mjs` | End-to-end editor test (Playwright, API mocked) and the publishing API test |

Block CSS is scoped under `.b-<id>`, so a block can appear more than once. Edit sections in
`tools/sections_src.py`, never in `blocks.js`.

## My projects and accounts (Supabase)

Projects live in the browser by default. Signing in syncs them to Supabase so they open on any
device, and a project can be made public as a hub page.

| File | Role |
| --- | --- |
| `site/supabase-client.js` | `window.AtlasCloud`: loads supabase-js on demand, email magic link / one-time code, Google (only if enabled), `projects.*` and `files.*` |
| `site/projects.js`, `projects-hub.js` | My projects (`#projects`) and the project hub renderer (`ProjectHub.render`) |
| `site/account.html` | Sign-in page; also the auth redirect target |
| `site/p.html` | Public hub: `/p?id=<project id>` (only for projects marked public) |
| `supabase/schema.sql` | `profiles`, `projects` (data in `jsonb`), private `project-files` bucket (50 MB per file), row-level security |

**Setup**

1. In Supabase, open **SQL Editor → New query**, paste all of `supabase/schema.sql` and run it.
   It is safe to run again.
2. In **Authentication → URL Configuration**, set **Site URL** to
   `https://motionatlas-ten.vercel.app` and add redirect URLs for `https://motionatlas-ten.vercel.app/account`
   and `/account.html` (plus `http://localhost:8772/account.html` for local testing).
   Sign-in links come back to `account.html?next=…`.
3. Optional: enable Google under **Authentication → Providers**. The button only shows when it's on.
4. The project URL and **publishable** key are in `supabase-client.js`. That key is meant for
   browsers, and row-level security protects the data. **Never put the service-role key in
   `site/`** or anywhere the browser can load it.

Separate from accounts, **share links** (`/shared#v/<id>`, `/shared#e/<id>/<key>`) use
`api/share.js` and `api/upload.js` with Vercel Blob. Connect a Blob store (sets
`BLOB_READ_WRITE_TOKEN`) and redeploy. To test locally, run `npm run dev:share` (port 8790,
stores in `.share-dev/`).

## AI endpoint (`api/ai.js`)

The page builder's "Generate page from brief" and "Rewrite with AI", and the project hubs'
"Generate with AI", call this function. It runs on **Claude Haiku 5.5**, and the key never
reaches the browser.

- **Key:** set `ANTHROPIC_API_KEY` in the Vercel project's environment variables, then redeploy.
- **Status:** `GET /api/ai?status` returns `{enabled, model}`. The UI uses it to explain when AI
  is off. Locally there is no function, so add `?ai=1` to the builder URL to try the panel.
- **Request:** `POST /api/ai` with JSON
  `{mode: 'page'|'section', brief, catalog: [{id, name, group, fields}], styles: [ids], current?}`.
  It returns `{page: {title, brand, style, blocks: [{id, fields}], note}, usage}`. Only ids from
  the catalogue and styles you send come back.
- **Limits:** `AI_HOURLY_LIMIT` per IP per hour (default 20) and `AI_DAILY_LIMIT` requests per day
  (default 500, resets at midnight UTC). Both are counted in memory per warm instance, so they
  are soft caps. Input sizes are capped (brief 1,500 characters, 160 sections, 200 styles, 64 KB
  body).
- **Errors:** 503 if the key is missing or invalid, 429 when a limit is hit, and 422 if the
  model refuses.

Other functions: `api/apply.js` emails the Staged application piece through Resend once
`RESEND_API_KEY` and `APPLY_TO` are set (`APPLY_FROM` is optional). Without them it returns 503
and the page offers the visitor a copy instead.

## Service worker (`site/sw.js`)

Caches the atlas shell for offline use and refreshes it in the background; video is never cached.
It's registered from `atlas-features.js` on https and localhost. **On every deploy, bump `CACHE`**
(for example `atlas-v75` → `atlas-v76`) so returning visitors get the new files immediately.
If you add a core atlas file, add it to `SHELL`.

## Performance notes

- Catalogue, art, system and study cards are `div.sheet-image` backgrounds. `lazy-bg.js` holds
  them back until they're within a screen of view, and at phone width it uses the 800px tile.
  Keep it loaded before the scripts that render grids.
- The catalogue section is not `active` in the HTML; `route()` shows the right page, so hidden
  grids never download their images.
- Header films use `preload="none"`, start after `load`, play only when visible, and on wide
  screens use the 1920px master only where it exists (`NO_FULL_WEBM` in `atlas-enhance.js`).
- The home hero downloads one source per device. Phones get the 720p MP4, with the 720p WebM as
  a fallback.
- The page builder warms its icon cache when idle. Interactions previews mount only while visible.
- Measured at 390px with 10 Mbps / 40 ms throttling (local server, uncompressed): the heaviest
  atlas sections went from 6–15 MB and 170–210 requests to about 3–6 MB and 120 requests. Vercel
  serves text compressed, so real transfers are smaller.

## Local development

```bash
cd site && python3 -m http.server 8772     # then open http://localhost:8772/atlas.html#home
npm install                                # only needed for the API functions / share dev server
npm run dev:share                          # site + real share API on http://localhost:8790
python3 tools/blocks.py                    # rebuild builder/blocks.js and sec-* demos
python3 tools/build-atlas-theme.py         # regenerate atlas-theme.css
python3 -I tools/add-specimens.py site/catalogue.json   # merge a specimen package (safe to re-run)
tools/add-film.sh A41 path/to/A41.mp4      # encode a film loop + poster and attach it to an entry
npm run vendor:blob                        # rebuild site/vendor/blob-client.js
```

The Python server doesn't do Vercel's clean URLs, so use `.html` paths locally (`/ds/start.html`,
`/p.html?id=…`). The serverless functions only run on Vercel (or through `npm run dev:share` for
sharing).

### Before pushing: the gate

A Playwright check (`gate.mjs`, kept outside the repo; run it with `node gate.mjs` while the local
server runs on 8772) loads `atlas.html#motion`, `#projects`, `#systems`, `#ux`, `theme-kits.html`,
`interactions.html` and `page-builder.html` at 1440px and fails on any page error
or console error. It must pass. Also check, at 1440px and 390px, that nothing scrolls sideways
(`document.documentElement.scrollWidth <= innerWidth`) and that axe (WCAG 2 A/AA) reports no
serious or critical issues on the pages you touched.

## Deploying

Push to `main` and Vercel deploys `site/` with `api/` as functions (`vercel.json`: no build step,
`cleanUrls`, `/` → `/atlas`, a redirect for `/work/djinyc`, a week of caching on
`/assets/*`, and `no-cache` on `/sw.js`). Checklist:

1. Bump `CACHE` in `site/sw.js`.
2. Run the gate.
3. Set or confirm the env vars: `ANTHROPIC_API_KEY` (and the optional `AI_HOURLY_LIMIT`,
   `AI_DAILY_LIMIT`), `BLOB_READ_WRITE_TOKEN` for sharing, and `RESEND_API_KEY` / `APPLY_TO` for
   the application form.

## Feature notes

Short notes on parts of the atlas that are easy to miss:

- **Catalogue** (`#browse`): collections rail (a drawer on phones), feel chips and "Has film" /
  "Live study" filters (`atlas-explore.js`, rules and `OVERRIDE` at the top), share links and
  1200 × 630 share cards (`atlas-share.js`), and Compare (`#compare`). Search is ⌘K / Ctrl+K / `/`.
- **Animation studio** (`#motion`): the studio river of live studies and films (`studio-river.js`),
  nine live simulations (`live-sims.js`), twenty UI motion cards M01–M20 (`ui-motion.js`), and the
  easing lab (`motion-lab.js`).
- **Guided tours** (`#tours`, `atlas-tours.js`): edit `TOURS` at the top of the file.
- **Background generator** (`#backgrounds`, `backgrounds.js`): one WebGL shader with 16 families and
  80 presets, with PNG, loop, CSS and code export.
- **Showcase reels** (`#showcase`, `showcase.js`): eight motion templates with 1080p export.
- **Studios:** flowchart, diagram, chart studio, chart style guides and the particle studio (`dataviz/`,
  `*-studio.html`, `chart-styles.html`, `particle-engine.js`). The dataviz tools share nineteen styles (`dataviz/styles.js`), the channel's Kitchen noir and Kitchen paper first.
- **Low-power mode** (`window.AtlasMotion` in `hero-scenes.js`): Data Saver, no or software WebGL,
  or ≤ 2 GB of memory turn off live hero scenes. Use `?fullmotion` to override.
- **Email sign-up** on home is not connected. Set `ATLAS_SIGNUP.endpoint` in `atlas-share.js`.
- **Your creations** (`#creations`) needs a publisher server this deployment doesn't run, so it
  shows an explanation instead. It only tries the API if `window.ATLAS_PUBLISHER` is set.
- **Films:** web encodes are in `site/assets/films/` (1920px masters, `-720` cuts for phones,
  posters). The Genesis hero source is the HyperFrames project in `film/`
  (`npx hyperframes render`).

### Video, GIF and view-only mode (Flowchart Studio)
- Export menu: **Canvas video (MP4)** and **Canvas GIF** play the diagram building up element by element.
- `flowchart-canvas.html?view=1` opens the studio read-only (pan, open panels, no editing); the Viewing/Editing switch toggles it otherwise.

## Mockup & social asset studio

`site/mockup-studio.html` (`site/mockup/studio.js`, `devices.js`, `handoff.js`) puts a screenshot into a vector device frame (modern and classic phone, tablet, laptop, desktop browser window with light/dark chrome and editable URL, watch, card, laptop + phone) on an atlas background (`BackgroundAtlas.still`), gradient, solid colour, image, or a theme kit palette/signature background (`ThemeKits`). Tilt, turn, rotate, scale, padding, shadow, headline, caption (font choices incl. the kit's heading font), badge and logo. One `compose(W,H)` renderer drives the preview, the size strip and exports: Open Graph 1200×630, X 1200×675, LinkedIn 1200×627, Instagram square/portrait/story, YouTube 1280×720, Dribbble 1600×1200, Product Hunt 1270×760, App Store 6.7″ 1290×2796 and a custom size. Export one PNG/JPEG/WebP, copy PNG, or a ZIP of every chosen size (`PB.zip`). Pictures stay in the browser (IndexedDB). Drop, paste, upload, or capture a same-origin page (modern-screenshot, loaded from jsDelivr on demand; canvas/video may come out still). **Make share image** in the Chart studio, Diagram studio and Page builder export menus hands their picture over via `MockupHandoff` (IndexedDB). Test: `node tools/mockup-studio-test.mjs`.

## My fonts (`site/my-fonts.html`, `site/fontlib.js`, `site/fontlib.css`)
Fonts a visitor owns (for example a commercial typeface whose licence forbids redistribution) can be used in the tools without ever entering the repo or a server. `fontlib.js` keeps font files in the visitor's own browser (IndexedDB, with metadata mirrored in localStorage), parses the name/OS/2 tables itself, registers them with `document.fonts`, and exposes `window.MyFonts` (`list`, `add`, `remove`, `rename`, `cssFamily`, `toBase64`, `exportFiles`, `fontFaceCSS`, `glyphPath`, `optgroup`, `mount`, `openDialog`, and a `myfonts:change` event that also fires across tabs). Files: .ttf .otf .woff .woff2 or a .zip of them, up to 5 MB each. Nothing is uploaded: there are no network calls in the module and `tools/my-fonts-test.mjs` asserts that no request carries font bytes. In private windows (storage blocked) fonts last for the page session only and the manager says so.
User-supplied fonts are the user's responsibility. The atlas never uploads, copies or redistributes them, and exports that embed a font (ZIP, SVG, published sites) are opt-in, off by default, with a licence reminder. Never commit font files you do not have the right to publish: `git ls-files | grep -iE '\.(ttf|otf|woff2?)$'` should list only the atlas's own fonts in `site/fonts/`. The tests synthesise a tiny font at run time (`tools/mini-ttf.mjs`). Limitations: WOFF2 names come from the file name (no Brotli in the browser), and outline conversion supports TrueType (glyf) fonts only; CFF-based .otf fonts fall back to embedding or live text.

## Moodboards

`site/moodboard.html` (`site/moodboard/store.js`, `board.js`, `board.css`, `pin.js`) is a free canvas for a project. Pan (drag) and zoom (Ctrl/⌘ + scroll, or the buttons), drag, resize, z-order (Front/Back, `]` `[`), group (Ctrl+G), align, duplicate, undo/redo, Shift-drag to select several, arrow keys nudge. Pin atlas entries (a **Pin to moodboard** button in the catalogue detail view, or Add > Atlas entry), theme kits, icons (from `icons/sets`), colour swatches, notes, links and your own pictures (drop, paste or upload). **Grid** and **Masonry** auto-arrange; **Palette and style** reads colours from swatches, kits, notes and the pictures, and **Make this a style** builds a theme kit from the palette plus the fonts of pinned kits or design-system entries (`ThemeKits.zipKit` → ZIP, tokens as CSS, or pin the kit back on the board). Export the board as a PNG (drawn directly on canvas). **Share link** encodes the board into the URL hash (deflate + base64url, view-only, uploaded pictures are left out). Templates: Brand exploration, Campaign, Website redesign. Boards open from My projects via the **Moodboard** button (`moodboard.html?project=<id>`).

Storage is local-first and needs no account or `schema.sql` change: boards in `localStorage` (`atlas-moodboards-v1`), pictures in IndexedDB (`atlas-moodboard`). Signed-in cloud sync of boards is not built yet. Test: `node tools/moodboard-test.mjs`.

## Adding things

- **A catalogue entry:** `python3 -I tools/add-specimens.py site/catalogue.json <package>` (or add to
  `expansion.json`), then `node tools/site-counts.mjs` to refresh `counts.json`.
- **A tool or page:** add the page, list it in `site/tools-data.js` (and a thumbnail:
  `node tools/tool-thumbs.mjs http://localhost:8772/ <id>`), add it to `site/site-nav-data.js`, run
  `node tools/install-site-bar.mjs` and `node tools/build-sitemap.mjs`, add core files to `SHELL` in
  `sw.js`, and bump `CACHE`.
- **A number in copy:** prefer a `{token}` or run the QA crawl; it flags counts that disagree with the data.

## QA scripts

```bash
cd site && python3 -m http.server 8798 &
node tools/site-counts.mjs          # recompute site/counts.json from the data
node tools/site-qa.mjs --strict     # crawl every page at 1440x900 and 390x844
node tools/handoff-test.mjs         # the tool-to-tool hand-offs, end to end
node tools/my-fonts-test.mjs        # My fonts: synthesised font, no upload, exports, a11y (BASE=http://localhost:8798)
node tools/build-sitemap.mjs        # regenerate sitemap.xml
```

`site-qa.mjs` reports console and page errors, failed requests, horizontal overflow, broken images and
videos, missing title, description, Open Graph tags and favicon, axe serious and critical violations,
numbers that disagree with `counts.json`, dead links, and the top bar (present, current page marked, stays
fixed while scrolling, nothing under it). Options: `--only <text>`, `--vp phone|desktop`, `--no-axe`,
`--demos`, `--out report.json`. It needs Playwright and axe-core (set `PW_DIR` to where they are installed).

## Contributing and collaborator workflow

- Small, safe changes go straight to `main`; larger ones through a pull request. Before pushing:
  rebase on `origin/main` (others push too, keep their work), bump `CACHE` in `site/sw.js` above the one on
  `main`, and run the gate and `tools/site-qa.mjs`.
- The collaborator **ng549** pushes pull requests. **Vercel may not auto-deploy commits whose Git author is
  not a member of the Vercel team** (it shows "Deployment blocked: needs authorization"). The maintainer
  either adds the author to the Vercel team, or merges the work through a pull request opened by a team
  member, so the production deploy runs under a team account.
- Never put secrets in `site/`. Keys live in Vercel environment variables.

## Publishing (Vercel Blob) and accounts, in one place

| Need | Setting |
| --- | --- |
| AI in the Site builder and project hubs | `ANTHROPIC_API_KEY` in Vercel (Project, Settings, Environment Variables), redeploy |
| Publish a site (`/site/<id>/`), share links, uploads | connect a **Vercel Blob** store to the project (adds `BLOB_READ_WRITE_TOKEN`) |
| Sign-in and cloud projects | run `supabase/schema.sql`; Site URL `https://motionatlas-ten.vercel.app` plus the `/account` redirects (see My projects) |
| Application form email | `RESEND_API_KEY`, `APPLY_TO` (optional `APPLY_FROM`) |

## Credits and licences

The in-site page is `atlas.html#references` ("Sources & credits"); the Site builder lists every asset
source in its credits table and writes `assets/CREDITS.txt` into each export. In short: 82 CC0 /
public-domain photographs from Wikimedia Commons (`site/assets/photos/photos.json`, audit in
`docs/image-licences.md`); icon families Phosphor (MIT), Heroicons (MIT), Lucide (ISC), Tabler (MIT),
Pixelarticons (MIT), OpenMoji (CC BY-SA 4.0), Fluent 3D emoji (MIT), Solar (CC BY 4.0), Material Symbols (Apache 2.0),
Pepicons (CC BY 4.0), Flat Color Icons (MIT), Icon Park (Apache 2.0), Game Icons (CC BY 3.0), Simple Icons (CC0) and
Line MD (MIT), the last nine through their Iconify bundles (`@iconify-json/*`), with licences in
`site/icons/LICENSES.txt`; Google Fonts under the SIL Open Font Licence or Apache 2.0.

## Motion graphics studio

`site/motion-graphics.html` plays the templates in `site/motiongfx/templates.js`. Each template is one function,
`draw(c, p, W, H, o, K)`: `c` is a 2D canvas context, `p` the loop position from 0 to 1, `o` the words, colours and font,
and `K` a small set of helpers (easing, text fitting, rounded rectangles). Because a template only touches `c`, `o` and `K`,
the studio can write any of them out as a single HTML file (helpers plus that one function, no libraries).
To add a template, `add({id, name, cat, dur, d, f:{t1,…}, draw})` in `templates.js`; set `loop:true` for seamless backdrops.
`tools/site-counts.mjs` counts them as `motionGraphics`.

## App interfaces and shared tool themes

`site/app-interfaces.html` is the shelf for app and tool screens. Each screen in `site/app-screens/demos/` is one
self-contained HTML file generated by `node tools/build-app-screens.mjs` from `tools/app-screens/src/<id>.html`
(the shell, tokens, chart code and helpers in `tools/app-screens/` are inlined, so edit the sources, not the output).
A source starts with `<!--META {json}-->` (title, category, description, AI prompt) and can use `<!--SHELL Active|Search-->`
to get the sidebar and top bar. Add `#dark` to a screen's address to open it dark.

**Skins and looks.** `tools/app-screens/base.css` carries six colour skins (default, `ocean`, `forest`, `sunset`, `rose`,
`sand`, each with a dark variant) and four style looks (`soft` big corners, `sharp` square, `serif` headings,
`compact` dense) chosen by `data-skin` and `data-look` on the `html` element. `base.js` also reads them from the address,
for example `#sand-serif-dark`. The shelf has Mode, Colour and Style pickers (remembered in `atlas-app-look`) that restyle
every card, plus the same pickers in the preview dialog; Copy and Download bake the choice into the file as attributes.
Skins only change the shared tokens (`--bg --panel --ink --mute --line --soft --ac --ac-ink --ac-soft`) and `--r`/`--rb`.

`site/tool-themes.js` gives Motion graphics, UI interactions and App interfaces a shared theme picker (Clean, a white page with black accents, is the
default; Paper, Sky, Midnight, Graphite, Ocean and Forest are the others). It sets the page's CSS variables and remembers
the choice in the browser. It also scales the live preview frames, each `.view` shows a 1200 x 750 page shrunk to fit.

## Tunable interactions

The interactions marked `tune:true` in `site/interactions/manifest.js` are generated by `node tools/build-interactions.mjs`
from `tools/interactions/src/<id>.html` (shared styles, the settings bridge and the carousel engine in `tools/interactions/`
are inlined, as are `art.js` (CSS gradient artwork, so demos load no images) and `shader.js` (a small WebGL runner for the shader backgrounds); the manifest entries are spliced between the `LAB-START` and `LAB-END` markers). A source keeps its values in
`<script type="application/json" id="settings">` and lists its sliders, toggles, colours and selects in `CONTROLS`.
Inside the shelf the demo posts both to the parent page, which draws the Settings panel, posts changes back
(`{atlasSet:{key:value}}`) and writes the chosen values into the settings block of the copied or downloaded file.

## Home page and navigation

`site/index.html` is the home page (the site root serves it; the old rewrite of `/` to `/atlas` is gone). It lists three
groups of tiles, read from `ATLAS_NAV_GROUPS` in `site/site-nav-data.js`: Browse, Make and Styles. The bar on every page
has the same three short menus (Browse, Make, Yours), defined in `ATLAS_NAV_MENUS`; pages that are not in a menu sit in the
More group so their breadcrumbs and search still work. Both bars (`site-bar.js` and the atlas page's `atlas-nav.js`) are
white with black text.

- `site/studio-tabs.js` gives the diagram, flowchart and motion graphics studios a tabbed side panel. Each page's panes are listed at the bottom of that file. In `atlas.html`, `.listBar` is the one search-plus-filter row and `.foldTool` folds a tool that sits above a list (see `atlas-cards.css`).
- Landing effects: the 41 demos in `site/effects-data.js` share the light base page in `site/effects-lab.js`. Their artwork is generated by `tools/fx-art.py` (Pillow); card pictures are in `site/assets/fx/clips/`.
- `site/infographic-studio.html` and `site/infographic/studio.js` are the infographic maker. `render(state)` returns an SVG string; layouts are the functions in `LAYOUT`.
- Menus live in `site/site-nav-data.js`. Interactions comes first. The chart, diagram, flowchart and infographic studios share the mode switch in `site/studio-tabs.js`.
