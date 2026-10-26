# Visual & Motion Atlas

A field guide to how images move, and a toolkit for building with what it shows. It's a static
site (`site/`) with a few serverless functions (`api/`), deployed by Vercel from `main`.

The library holds:

| What | Count | Where it lives |
| --- | --- | --- |
| Catalogue entries (styles, art, animation, motion, components, effects, systems, films) | 381 | `site/catalogue.json` + `site/expansion.json` |
| Theme kits | 48 | `site/kits/` |
| Atlas design systems | 48 (D01–D48) | `site/expansion.json`, `systems.js`, `system-previews.js`, `system-kits.js` |
| UI components | 64 (C01–C64) | `site/component-lab.js` |
| Interactions | 70 | `site/interactions/` |
| Landing effects (techniques) | 41 (L01–L49, with gaps where older effects were retired) | `site/effects-data.js` (the techniques), `site/effects-lab.js` (the lab UI), `site/expansion.json`, clips in `site/assets/fx/clips/` |
| Atlas themes (component lab skins) | 22 | `site/atlas-themes.js` |
| Page-builder sections / styles | 44 / 144 | `site/builder/` |

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

`site/flowchart-studio.html` is a live canvas, not a single picture. Every element is its own piece you can drag, and a double-click (or double-tap) opens a side panel to edit it and its connections.

- **One canvas.** Starting from a template, adding an element or combining another diagram puts separate elements on the same canvas. Positions are saved with the chart and travel in share links.
- **Start from** lists diagram templates (one per type, plus combinations). **Examples** is the gallery of pre-made workflows.
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
- **Workspace feeds.** Where the host serves `/_01/feeds/index.json` (the 01 Design Suite) a Workspace button loads a model of a client's workspace onto the canvas. This site serves none, so the button stays hidden.
- Files: `dataviz/flow.js` (engine, kinds, free placement, routing), `dataviz/presets.js` (layouts, templates, workers), `dataviz/canvas.js` (canvas controller, history, clipboard, menus, panel).

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

## Directory map

```
api/                     Vercel serverless functions
  ai.js                  page-builder AI (Claude Haiku 5.5)
  share.js, upload.js    project sharing (Vercel Blob)
  apply.js               "Staged application" form → email via Resend
  _lib/                  shared helpers for share/upload
site/                    everything that is served (outputDirectory in vercel.json)
  atlas.html             the atlas: one page, sections after the # (see below)
  app.js, app.css        catalogue core: routing, grid, detail view, compare, vases
  catalogue.json         144 original entries (A, S, M, E, W prefixes)
  expansion.json         193 more entries (C, D, L, R, F) + source references
  atlas-*.js/.css        nav, enhance (plate bands, header films, search), share, explore, tours, refine
  lazy-bg.js             holds catalogue card images back until they scroll near (load it first)
  kits/                  theme kits (theme-kits.html)
  ds/                    the 01 Design System docs site
  interactions/          interactions shelf: manifest.js + demos/*.html
  builder/               page builder (page-builder.html)
  system-components/     live HTML/CSS components for systems D21–D32
  dataviz/               flowchart, diagram and chart studios, chart style guides
  studies/               live WebGL particle studies (lion, whale, butterfly, bird/fox)
  supabase-client.js     accounts (window.AtlasCloud)
  projects*.js, account.html, p.html, shared.html   My projects, sign-in, public hubs, shared links
  icons/, fonts/, vendor/, assets/                  static assets (films in assets/films/)
  work/djinyc/           a client mock-up (served at /work/djinyc/home)
  work/01/               a personal project. Its assets are used by ds/, but keep it OUT of the atlas nav
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
`tools/build-atlas-theme.py` (edit the script, not the CSS).

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

## The 01 Design System docs (`site/ds/`)

A separate documentation site for 01 (graphite and platinum, routed motion, machine sound, 44
`u-` components in 8 families, patterns, templates, kits). `/ds` redirects to `/ds/start`.

- `ds.js` builds the shared chrome, search, live example frames and code blocks. Pages load
  `../work/01/01.js` and `../work/01/01-ui.js` first, which is why `work/01` must stay deployed.
- `kitview.js` renders a 01 kit in the theme-kit format (used by `kits.html` and `resources.html`).
- `search-index.js` is generated. After adding or renaming headings, run
  `node site/ds/tools/build-search-index.mjs` from the repo root. It reads every `h2`/`h3` with
  an `id` in `site/ds/*.html`.

## UI components (`#ux`, `site/component-lab.js`)

64 native HTML/CSS components (C41–C64 fully interactive), each shown in every state, in any of
the 22 atlas themes (`atlas-themes.js`), light or dark, comfortable or compact, with HTML, CSS,
React and token export plus accessibility notes. Components are objects in `component-lab.js`
(`id`, `name`, `v`, `html`, `css`, `a11y`, `live`) exposed as `ComponentLab.components`; each also
has a catalogue entry (`C..`) in `expansion.json`. The page builder lists them automatically.

## Interactions shelf (`site/interactions.html`, `site/interactions/`)

70 original pieces, each one self-contained HTML file in `interactions/demos/` with no
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

## Page builder (`site/page-builder.html`, `site/builder/`)

Build a page from the library, choose a style, write or generate copy, export.

- **Library:** 44 sections, all 64 components, the interactions, backgrounds, films, effects,
  images, icon families and theme-kit assets.
- **Styles (144):** 4 builder styles, 48 theme kits, 48 design systems, and 22 atlas themes in
  light and dark.
- **Pages, templates and undo:** pages are saved in this browser, there are five templates, and
  undo covers every change.
- **Export:** one HTML file, a ZIP, copied HTML, or an AI prompt.

| File | Role |
| --- | --- |
| `builder/blocks.js` | **Generated.** Run `python3 tools/blocks.py`; it reads `tools/sections_src.py` (`HEAD`, the eight `S` sections, `MORE`) and also writes `interactions/demos/sec-*.html` |
| `builder/styles.js` | Style registry, mapping every source onto the builder variables |
| `builder/extras.js` | Code-drawn library blocks (components, interactions, media, icons, kit assets) |
| `builder/app.js` | UI, editing, pages, AI panel, export |
| `builder/zip.js` | Stored-zip writer (same as the kits') |

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
node site/ds/tools/build-search-index.mjs  # rebuild the ds search index
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
`interactions.html`, `page-builder.html` and `ds/start.html` at 1440px and fails on any page error
or console error. It must pass. Also check, at 1440px and 390px, that nothing scrolls sideways
(`document.documentElement.scrollWidth <= innerWidth`) and that axe (WCAG 2 A/AA) reports no
serious or critical issues on the pages you touched.

## Deploying

Push to `main` and Vercel deploys `site/` with `api/` as functions (`vercel.json`: no build step,
`cleanUrls`, `/` → `/atlas`, redirects for `/ds`, `/work/01`, `/work/djinyc`, a week of caching on
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
- `flowchart-studio.html?view=1` opens the studio read-only (pan, open panels, no editing); the Viewing/Editing switch toggles it otherwise.
