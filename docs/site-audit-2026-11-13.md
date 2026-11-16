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

## Fourteenth pass: one style for the whole site, from the best product sites (15 November)

Asked for, in the owner's words: of a brand-kit logo, "the text is all messed up, look at the best UX UI websites and update everything", then "I don't mean just update the text, I mean our whole site"; of the ink film in the site builder, "very low res and not impressive, replace it all"; of Landing effects, "all also look terrible, either get rid of it or replace all the motions/images".

**What the best sites do, measured** (computed styles on linear.app, stripe.com, vercel.com, apple.com, notion.com, figma.com): one sans typeface for everything; headlines at weight 300 to 600, never heavier, 34 to 56px on a laptop, line-height 1.0 to 1.17, letter-spacing -0.02em to -0.06em; body 14 to 20px at 1.4 to 1.6; navigation and buttons 13 to 18px at weight 400 to 500.

**What we had, measured**: titles in three cuts of Cormorant Garamond from 24 to 132px, Georgia on one page, JetBrains Mono for ordinary labels, four page backgrounds, buttons 27 to 50px tall with corners from square to round, text down to 11px.

The style is written down in `docs/site-style.md`; `site/index.html` is the reference page.

| Area | Before | After |
|---|---|---|
| Type, every page | Serif and italic titles, mono capital labels | Inter throughout; titles weight 600 at -0.035em; labels in sentence case at 12 to 13px |
| Colour and shape | Grey pages, shadowed cards, controls of many sizes | White pages, hairline cards with no shadow at rest, 40px controls with 10px corners (44px on phones) |
| Pages restyled | | Home, Tools, Interactions, App templates, Theme kits, Icons, Chart styles, My fonts, shared project, the Atlas page with all 21 routes, account, public project page, the eight studios, the site builder, the brand kit generator |
| Brand kit logo | Heavy wonky serif without its display cut, two letters colliding in the mark, a coloured dot after the name | Heading weights capped (serif 500, sans 600), optical sizes requested, mark letters spaced, no dot or underline, handwriting and novelty faces no longer chosen automatically, name spacing set by typeface |
| Films in the site builder | Five sections, the film band and the film background played 720p clips | Four motions (ink, silk, mesh, aurora) drawn in a WebGL canvas in the page's colours, sharp at any size, paused off screen and under reduced motion, with a gradient when WebGL is missing. No video is loaded |
| Landing effects | Flat colour studies, old generated pictures, 720p films; stored preview pictures | Photographs and code-drawn motion in all 41 techniques; four video techniques renamed to what they now show (Scroll-scrubbed animation, Knockout type, Moving background done right, Hover-to-play previews); card previews run live |
| Atlas hero | Opened on a film | Opens on the live particle study where the device can draw it; the films stay as other scenes |

Bugs fixed on the way: the sticky filter row slid under the breadcrumb bar on Interactions and App templates; `hidden` buttons still showed on those pages and in two Landing effects demos; the chart studio's data grid header hid its first row; settings tabs stuck under the Atlas bar in two studios; several Landing effects demos (stat numbers, overlapping tiles, a jumping loop); chart, diagram and flowchart exports now wait for the font stylesheet before measuring.

Checked by script in Chrome: smoke test on 38 pages at 1280 and 390; an audit script per page group counting non-Inter text, text under 12px, italic or serif titles and off-size controls in page chrome (all zero or explained); every Landing effects technique opened at 1440 and 390 and with reduced motion; exports from each studio compared byte for byte with the previous version; the site builder's main flows at 1440 and 390; a built page with all five motion sections and a motion background (no video elements, pause works). The four restyle and media jobs were done by helper agents and reviewed from fresh screenshots.

Still open or lost:
- Not looked at in Safari, Firefox or on a real phone. The WebGL motion and the live Landing effects previews were only run in headless Chrome with software rendering.
- `site/expansion.json` still holds the old names and preview pictures for Landing effects, so site search and the catalogue show the old ones for those 41 entries.
- Share images drawn by the Atlas (share card, tour card, moodboard PNG) are still dark with serif titles; that is canvas drawing code and was not changed.
- The catalogue's specimens, films and style pictures are the Atlas's content and keep their own look, including the generated style pictures.
- The old film clips remain in `assets/films/` and are still used by the Atlas's film library and tours.
- Theme kits' picker is about 190px taller. The mockup studio's side panel is wider (432px), so its on-screen preview is slightly smaller.
- A saved site that used a film now shows the nearest motion preset instead.
- `tools/build-atlas-theme.py` no longer matches `atlas-theme.css`; do not run it.
- iCloud had evicted about 2,500 files from the project folder, which made git hang; the clone now has `core.checkStat=minimal` and `core.trustctime=false`.

## Thirteenth pass: everything measured against Interactions (15 November)

The owner's verdict on the earlier passes: "app templates have little diversity", "the menu/filter selection on all pages [is] cluttered and not clear", the site builder "should be started from scratch" ("the flame motion has nothing to do with recipes, the left menu is too busy, the styles make no sense"), "same with brand kit generator", and "the only section I really like is the interactions", which "feel clean, modern, easier, with better graphics that aren't random ones I generated ages ago".

So `interactions.html` became the reference for every page: a serif-italic title with one sentence, one search box and one dropdown, plain cards, one settings panel beside the thing being edited, and no old generated artwork as demo content.

| Area | Before | After |
|---|---|---|
| Filters, every gallery | Rows of pills, segmented controls, a wall of 27 family cards, a left rail of 11 collections | One row: search and dropdowns with counts, one count line. Changed on App templates, Theme kits, Motion graphics, Icons, Chart styles, the chart, diagram and flowchart studios, Tools, and three Atlas sections (catalogue, backgrounds, icons) |
| App templates | 22 screens, nearly all one product in one sidebar shell; 2 phone screens | 35 screens: 13 new products with their own shells (calendar, support desk, document editor, video call, issue tracker, report, banking, travel search with a map, till, four phone apps) and 7 existing screens given new shells. 7 phone or tablet screens |
| Site builder start | A modal over the whole site in its own type style; ways-to-start tiles; pill filters | A page under the Atlas bar in the Interactions pattern: title, one search box, one dropdown, the same cards. Other ways to start are one sentence of links |
| Site builder editor | A left rail of six buttons plus a panel beside it; zoom buttons | No left menu. The page, and one panel on its right with three plain tabs (Page, Design, Site) and AI. A section's settings take the panel's place while it is edited. Library, checks, history and shortcuts are in one menu |
| Styles | One flat list of 144 styles from four sources ("Kitchen noir", "Matrix", "Synthwave") | Nine named looks drawn as tiles: Studio, Clean, Paper, Editorial, Soft, Garden, Bold, Evening, Midnight (five are new). The other 140 styles are folded under "More styles" with one source dropdown |
| Template styles | 18 of 26 templates wore theme-kit styles (a pottery course in a code font) | All 26 use one of the nine looks |
| Pictures | About 95 uses of old generated artwork and films in section defaults and templates; a smoke film under "Recipes filmed like still lifes" | Photographs only, chosen to match the words (207 references, none missing). No template uses a film. Film sections stay in the library, listed last, with words that describe their film. Two blog posts were rewritten to match their photographs |
| Brand kit generator | A form with 13 feel-word pills, 5 tabs with more tabs inside, 248 buttons; palettes with clashing accents; invented slogans and filler in the mock-ups | One column: name, description, one Feel dropdown, Shuffle; then logo, colours, fonts, in use and download. 31 buttons visible before anything is opened. Accents are relatives of the primary (192 generated kits surveyed: 144 had a saturated clashing pair before, none after). No slogans: previews use the brand's own name and description |

Checked by script in Chrome: smoke test all clear on 38 pages at 1280 and 390; all 94 template pages for script errors, sideways scroll and broken images at both widths; the builder's main flows (first visit, pick a template, add a section, change the look, more styles, your sites, brand kit and describe views, blank site) at 1440 and 390; each changed filter driven from a script with the item count checked against the option's count; the brand kit's 36-step walkthrough. All 94 template thumbnails regenerated.

Parts of this pass were built by helper agents (filters, app screens, the picture swap, the brand kit page) and reviewed by eye afterwards from fresh screenshots.

Still open or lost:
- Not looked at in Safari, Firefox or on a real phone. Native dropdown lists were not seen opened (headless Chrome does not draw them).
- The manual zoom buttons are gone from the builder's bar; the page fits its frame by itself.
- With native dropdowns the colour dots on app-template colour choices and the sample icon on each icon family are gone.
- The app home and app landing templates lost their App Store and Google Play badges, because only the film section had them.
- The shop template now sells candles and tableware and the creative studio template is a ceramics studio, because no photograph of prints or paper sculpture exists.
- `tools/brand-generator-test.mjs`, `tools/site-builder-test.mjs` and `tools/dataviz-test.mjs` describe the old pages and were not run (Playwright is not installed).
- The zip's guidelines page still has a "Voice" heading (`kits/brand.js` is shared and was left alone).
- Seven app screens still use the original sidebar shell. The issue tracker opens with its command palette showing, so its thumbnail is dimmed.
- The style catalogue itself still shows the Atlas's generated style pictures; that is the catalogue's subject and was not touched.

## Twelfth pass: the templates' inner pages (15 November)

The 68 inner pages (services, pricing, contact, about and so on) were listed and eight were rendered top to bottom. 65 of the 68 open with the page heading section and 40 close with the call-to-action band, so those two and the sections between them were redesigned once, in `tools/sections_src.py`; every page that uses them changes with them.

| Section | Before | After |
|---|---|---|
| Page heading (65 pages) | Headline up to 92px in a narrow measure, intro directly under it | Headline up to 136px; the intro sits in the right half under a full-width hairline |
| Call-to-action band (40 pages) | Headline up to 56px with a button on the right | One line up to 112px with a larger button under it |
| Contact form (15 pages) | A 760px boxed card in the middle of the page | Words on the left, an open form on the right with underlined fields; one column on phones |
| Team (10 pages) | Small boxed cards with gradient initials | Rows on hairlines in two columns, names in the heading face |
| Timeline (6 pages) | A narrow column on a dotted line | Dated rows on hairlines with the date large |

Sixteen inner pages were also re-composed in `builder/templates3.js`: the two Work pages use the staggered work grid in place of the masonry gallery; process steps and feature cards on five pages became numbered rows or the sticky split; eight About pages gained one wide photograph that fits the subject.

Checked by script at 1280 and 390 wide: all 94 template pages for script errors, sideways scroll and anything running off the edge.

Still open: pricing tables, the menu, the schedule, the map and the FAQ sections were looked at and left as they are; `rich-text` keeps its narrow reading column. Not looked at in Safari or on a real phone.

## Eleventh pass: site builder look, start screen, picker and templates (15 November)

Asked for: "not just the navigation but the whole look, layout, templates etc of the tool itself", with awwwards.com as the reference. Taken from the awwwards gallery and its winners: large borderless picture tiles, one bar of pill filters with search, bold plain headings, black pill buttons, very large type, hairlines instead of boxed cards. Nothing of theirs was copied.

**What was wrong, measured.** All 26 templates were looked at together. Most home pages followed one run (hero, proof, cards, quote, call to action); seven had a stats band followed by boxed feature cards. Eight opened on a generated film. Several pictures did not fit the subject (a budgeting app shown with a desk of design books; a food charity with a latte). On the start screen "Start another way" was 2,274px down, under all 26 templates.

| Area | Before | After |
|---|---|---|
| Start screen | Capped at 88% of the window; four-column boxed cards; ways to start at the bottom | Full page; a large heading; the ways to start in one row under it; "Your sites" as large tiles; templates in three columns of borderless thumbnails with category pills and a new search |
| Template detail | Small preview | Large preview, "Use this template" as the main button, every page as a thumbnail |
| Section picker | A 620px-high box, four columns of small boxed cards, category chips in a row | Near full height, categories with counts down the left, three columns of large live previews, an Add pill on hover and focus |
| Section designs | 16px body, 46px buttons, 1180px column | 17px body, 52px buttons that follow each style's corner radius, 1280px column, more space between sections |
| New sections | | Big type hero, Statement hero, Work grid, Numbered list, Sticky split (61 sections in the library) |
| Template home pages | Seven on stats then feature cards; eight film heroes | 14 given a new layout and 2 more a new picture (`builder/templates3.js`): type-led and photo-led heroes, numbered lists for boxed cards, work grids. One still has stats then cards; none opens on a generated film |
| Pictures | Mismatched in five templates | Chosen to match: charts for the budgeting app, a shared table for the charity, a potter's hands for the course, a microphone for the podcast, a starting line for the gym |
| Default site in the editor | Dark, on a smoke film | Light, on a photograph |
| Thumbnails | 560 by 350 | 1,000 by 625, all 94 regenerated |

Checked by script in Chrome at 1440, 1024 and 390 wide: all 26 templates render with no script errors and no sideways scroll at 1280 and 390; the start screen, a template's detail, "Use this template", blank site, describe-your-site and brand kit; search and category filters; the picker (focus, search, adding a section, adding after a chosen section, Escape); rename, duplicate and delete of a saved site.

Still open: the inner pages of the templates (services, pricing, contact and so on) keep their earlier compositions; only home pages were re-composed. The four built-in styles and the 144 style choices were not redrawn. The start screen and picker were built by a helper agent and checked afterwards. Not looked at in Safari or on a real phone; `tools/site-builder-test.mjs` was not run (Playwright is not installed).

## Tenth pass: site builder editor rebuilt (15 November)

Asked for: "the site builder needs a complete overhaul". Used first at 1440 by 900 and at 390 by 844. The phone layout was already page-first (page, bottom bar, sheets); the desktop editor was three fixed columns under three stacked bars. The desktop editor now follows the phone's model. No function was removed.

| | Before | After |
|---|---|---|
| Bars above the page | Site bar, builder header, toolbar, status line: the page began 175px down | Site bar and one top bar: the page begins 117px down. The status line sits under the page |
| "Desktop" preview at 1440 wide | 750px wide, so it showed the tablet layout | Always laid out 1280 wide and scaled to the space (78% with a panel open, 100% with none). − and + set a fixed zoom; clicking the figure returns to fit |
| Side panels | Library (330px) and outline (360px) always open | A rail (Add, Outline, Library, Design, Site, AI) opens one 328px panel at a time; pressing it again closes it |
| Editing a section | The form unfolded inside the outline list | Its own edit panel: the same place as the outline under 1600 wide (Done goes back), a right-hand column from 1600; on a phone, a sheet |
| Section and page rows | Four or five icon buttons on every row | Shown for the row you are on (hover or keyboard focus); always shown on touch |
| Top bar | "Sites & templates", Saved, Undo, Redo, More as text buttons; page picker and Edit/Preview in a second bar | Sites, site name, page picker, device widths and zoom, Saved, undo, redo, more, Edit/Preview, Export in one row |

Checked with a script in Chrome at 1024, 1100, 1440 and 1680 wide and at 390 and 820: clicking the page opens the edit panel; typing keeps the field and updates the page; a dropdown change keeps focus; section settings stay open; delete, undo, Done, Checks, Preview mode, the three widths and zoom; a UI component and an interaction open their settings; the phone edit sheet opens and closes. No script errors; smoke test clear at both sizes.

Not done: `tools/site-builder-test.mjs` (the long Playwright suite) was not run, as Playwright is not installed; it clicks `#rt-page`, which is now hidden on wide screens, so that step needs updating. The start screen, the section picker and the templates themselves are unchanged. Not looked at in Safari.

## Ninth pass: Safari (15 November)

Everything before this was checked in Chrome only. This pass ran the same checks in Safari 27.2 on the Mac: all 38 pages as real page loads, the same pages at phone width, and all 141 demos, with Chrome run alongside for comparison. There is no iPhone simulator on this Mac (Xcode is not installed), so iPhone Safari itself is still untested.

| Finding | Evidence | Fix |
|---|---|---|
| Every dropdown ignored its design in Safari | A native select kept Safari's own small control: 20 to 25px high where the page sets 44px (for example `#catSel` 22px against 44px in Chrome); 165 selects across 15 pages | One shared rule in `site-bar.js` drops the native look and draws one arrow; measured again in Safari at 44px. The app templates and two demos carry the same rule |
| Background blur did nothing in Safari | Safari has no canvas `filter`; used by the mockup studio background and the showcase | `blurDraw()` falls back to shrinking the picture in halves and scaling it back up |
| Account page button and field used the wrong font | `font:16px inherit` is not valid CSS, so the rule was dropped: Arial 13px in Chrome, system 11px in Safari | Twelve such declarations rewritten in five stylesheets |
| iPhone zooms the page when a small field takes focus | 78 fields under 16px on the tool pages | Fields are 16px on iOS only (`@supports (-webkit-touch-callout:none)`); simulated in Chrome with no sideways scroll. Not seen on a real phone |
| Small checkboxes | 13 to 18px in the icon library, component lab, site builder, mockup studio, chart studio, film viewer | 20px, labels 40 to 44px high |
| Atlas overview long on a phone | 10 screens; the eight tool cards stacked to 3,041px | One swipeable row, 379px; the page is 6.9 screens |

Clean in Safari: no script errors, no sideways scroll, no failed shader or canvas on any page or demo. Not a difference: Safari leaves dropdown options out of `innerText`, which made five pages look shorter in the first comparison.

Still open: nobody has looked at the pages in Safari by eye (the checks compare measurements, not pictures); a real iPhone; Firefox; screen readers.

## Eighth pass: every open finding worked through

14 November 2026. Each change was checked at 1280 × 800 and 390 × 844. `tools/smoke.mjs` now opens 38 pages at both
sizes and reports no script errors and no sideways scroll.

**All 25 animation ideas are built.** Fifteen more pieces joined the twelve from the seventh pass: liquid metal, silk
and caustics shaders, burn-away transition, fluid ink, world map with arcs, ASCII picture, grid backgrounds, layered
waves, meteors, hero parallax wall, page preloader, liquid glass, page-turn book and metaball loader. The interactions
page lists 135 pieces, 64 with sliders. Each new piece was run in the gallery with every slider pushed to both ends:
no script errors, no focus taken from the page, no sideways scroll at 390 px, no control under 36 px.

| Finding | Before | After |
|---|---|---|
| G · long pages on phones | UI components 46 screens, animation studio 33, backgrounds 29, references 27, art styles 17 | 8, 13, 7, 11 and 4. Long lists show twelve cards and a "Show more" row (`atlas-pager.js`) |
| UI components lab | A 1,404 px lab above the list of 70 | The list comes first; the lab is one folded row that a card opens. 15,545 px down to 2,859 px on desktop |
| H · animation studio dark | Two black bands, 13,375 px of the page, serif titles in cream | Light page. Each live study, film and simulation keeps a dark frame |
| Site bar inside embedded pages | The top bar drew inside every live study in the animation studio | It does not draw inside a frame |
| 2 · generated art in templates | Twenty illustrations (crane, owl, dove, lion…) across 26 templates; thumbnails were screenshots of them | Abstract studies, words rewritten to match, a real photograph for the photographer template. 94 template thumbnails and 20 tool thumbnails regenerated |
| Hover-to-play demo | Four of six films dark | Six light films |
| 1 · purple accent | Still on theme kits, brand kit generator, My fonts, moodboard and the mockup sample | Ink |
| 8 · type under 11 px | Brand kit generator 132 elements (down to 9 px), theme kits 66, animation studio 7 | Shade ramps, colour scales and film labels are 11 px. What is left is type specimens showing their own small sizes |
| 10 · heading order | h1 to h3 on references, film looks and style guides | In order on every atlas section |
| Interactions page filters | Seventeen chips over two rows | One search box and one filter, as on the atlas sections |
| A · sign-in down | A button that failed after a wait | The form says sign-in is not available and that work is still saved in this browser. The service itself still needs restoring |
| Mockup page capture | A block of unstyled text at the top of the picture | Clean. No-script fallbacks are left out of the capture |
| Near-duplicate pieces | Two hold-to-confirm pieces | One, with an optional confetti finish |
| Infographic studio | No way on to the mockup studio | Make share image, like the chart, diagram and flowchart studios |
| My fonts | system-ui | Inter |

Found and fixed along the way:

- A script error on every load of the atlas page (a button removed in the fourth pass was still being wired up),
  which stopped the rest of start-up.
- The diagram studio scrolled sideways by 75 px on a phone, caused by the Charts and diagrams switch added in the
  sixth pass.

How it was done without installing anything: `tools/cdp.mjs` drives the Chrome already on the machine over its
debugging port. `builder-thumbs.mjs` and `tool-thumbs.mjs` use it in place of Playwright, and `smoke.mjs` is new.
The fifteen pieces were written by three helper agents from a brief and the existing sources, then checked here.

Still open, honestly:

- **Sign-in and cloud sync** need the Supabase project restored. Nothing in the code can do that.
- **Video scrub demo** still uses an ordinary encode, so fast scrubbing can lag. Re-encoding needs a video tool that
  is not on this machine.
- **Browsers.** Everything was checked in Chrome only. The 27 new pieces have not been tried in Safari or Firefox, on
  a real phone, or with a screen reader. Liquid glass refracts only in Chromium and falls back to a frosted bar.
- **World map** is a hand-made dot map: recognisable, but Europe is coarse and there are no Pacific crossings.
- **Native checkboxes** of 13 to 18 px remain on about ten views (finding 12).
- **Atlas overview** (`atlas.html#home`, not in any menu) is still 13 screens on a phone.
- `tools/site-counts.mjs` still needs Playwright; `counts.json` was corrected by hand.

## Seventh pass: twelve new interactions

Twelve of the 25 ideas in "Animation and interaction opportunities" are built and live on the interactions page
(ideas 1, 2, 5, 6, 7, 8, 11, 12, 15, 18, 21 and 22). Each is one HTML file with no libraries and no image files, has
a settings panel, light and dark, a reduced-motion path and keyboard access, and plays itself on its gallery card
until touched.

| Piece | Category | What was checked by hand |
|---|---|---|
| Lanyard badge | Cards | Drag and throw, settles, Enter gives a push, dark mode |
| Vanishing input | Controls | Type and send, field clears, status line announces the text |
| Flashlight reveal | Type | Light follows, Reveal all covers the page, text colour follows the accent |
| Scatter to list | Lists | Scatter, grid and list all fit at 1280 and 375 wide |
| Icon cloud sphere | Canvas | 40 icons, idle spin, drag, scales down on a phone |
| Scratch to reveal | Cards | Scratching past 55% clears the foil, Copy enables, Scratch again resets |
| Morphing text | Type | Words cycle, Pause works, word list is read to screen readers |
| Card to detail | Cards | Opens from the card, focus moves in and back, Escape closes |
| Orbiting icons | Sections | Three rings, speed slider does not make rings jump, Pause |
| Direction-aware hover | Galleries | Enters from left, leaves by top, as measured |
| Scroll text reveal | Type | 15 of 31 words lit at half way, key words take the accent |
| Tracing beam timeline | Scroll | Beam reaches the last entry at the bottom of the page |

All twelve: no sideways scroll at 375 px, no control under 38 px tall, no console errors.

They are sources in `tools/interactions/src/` and are built by `node tools/build-interactions.mjs`, like the other 37
tunable pieces, so a rebuild keeps them. Artwork is flat CSS shapes (`tools/interactions/flat-art.js`), not images.

Also fixed on the interactions page:

- Five pieces were listed twice (arc carousel, image ring, expanding panels, toasts, radial menu). Both cards opened
  the same demo, one with an out-of-date description. The stale cards are gone: 121 pieces, all different.
- "New" meant 79 of 114 pieces. It now means the latest batch only (12).
- Opening a piece by its address while another was open left an empty preview. It now switches.

Still open: 13 of the 25 ideas (the WebGL ones, world map, liquid glass, page-turn book, ASCII image, hero parallax
wall, preloader, grid backgrounds, layered waves, metaball loader, meteors); the UI components lab; older template
thumbnails; sign-in and cloud sync until the Supabase project is restored.

## Sixth pass: lead with interactions, landing effects rebuilt, brand kit simplified, infographics added

14 November 2026. Each change was checked at 1440 × 900 and 390 × 844. All 41 landing demos were looked at one by one.

**What the site is for.** The motion work is the reason to visit, and two thirds of it was in no menu. The menus now
open with Interactions: UI interactions, Landing effects and Animation studio. The home page headline, intro and first
section are about them.

**Charts and diagrams.** They are different jobs that looked like one tool three times over. A chart draws numbers.
A diagram draws structure. A flowchart draws steps. The three studios share a shell and the same look presets, and
two of them offered the same types (cycle and mind map). They are now one menu entry, Charts & diagrams, and the
studios share a switch where their titles were. None of them made an infographic, which is a composed picture of
numbers, icons and short text. That tool did not exist and now does.

| Area | Before | After |
|---|---|---|
| Menus | Library, Styles, Make, Yours. Landing effects and Animation studio unlisted. Charts, Diagrams and Flowcharts as three entries. Guided tours, Theme kits and Chart style guides listed | Interactions first. One Charts & diagrams entry. Tours, Theme kits and Chart style guides out of the menus, addresses kept |
| Landing effects, demos | 41 dark pages in a serif display face, built on 48 generated illustrations and 60 film frames | 41 light pages in Inter with one ink colour. Abstract colour studies replace every illustration. Captions and alt text rewritten |
| Landing effects, page | A second title, a paragraph, twelve filter chips, cards with a label, a code line and a usage count, recordings of the old demos | One search box and one filter. Cards show a picture, a name and one line. Pointing at a card runs the real page. 17 MB of recordings deleted |
| Brand kit generator | A form 832 px tall with 27 chips and every option open. Seven tabs, five action buttons, and a second set of nine tabs inside the seventh | A 580 px brief with twelve words and the rest behind two disclosures. Five tabs, one Download button and a More menu. No tabs inside tabs on the main path |
| Infographics | None | Infographic studio: eight layouts, four shapes, twelve palettes, six type pairings, 300 icons, PNG and SVG export with fonts embedded |

How the demos were converted: a script inverted the lightness of every colour and dropped its hue, so contrast
relationships held, and swapped the serif for Inter at 74% of the size. Sixteen demos then needed hand work: those that
were light to begin with, the two that are about colour, the video demos and the cross-page transition. The artwork is
made by `tools/fx-art.py` and can be regenerated.

Still open after this pass: the films in three video demos are the atlas's own abstract light studies, and four of the
six in the hover-to-play grid are dark; the video scrub demo uses an ordinary encode, so fast scrubbing can lag; the
UI components section still opens with a tall component lab; template thumbnails in the site builder and on the
all-tools page still show older artwork; sign-in and cloud sync are down until the Supabase project is restored.

## Fifth pass: tool layouts, missing content, one save control, one toolbar

14 November 2026. Each change was checked at 1440 × 900 and 390 × 844.

| Area | Before | After |
|---|---|---|
| Motion graphics studio | Stage, then 28 templates below it: 2.2 screens on desktop. On a phone the edit controls sat under all 28 templates | Side panel has two tabs, Templates and Edit, and scrolls on its own. 1.0 screen on desktop, 1.6 on a phone |
| Diagram studio | One side panel 3,186 px tall holding type, title, content, style and checks | Four tabs: Type, Content, Style, Checks. Type, Style and Checks fit without scrolling |
| Flowchart studio and canvas | Four panel sections stacked, with tab styles in the page but no tab bar | Four tabs: Steps, Chart, Layout, Checks. "+ Add a step" comes first, then "+ Add a stage" |
| Site builder export menu | Ten rows in one list | Three groups: Download, Share, Back up and hand off. Rows reworded |
| Art styles, content | 60 entries where "What to notice" repeated the summary and the other notes were shared boilerplate, folded away last pass | Each entry has its own five notes: what to notice, good for, how it moves, how to make it, avoid. 300 notes, none repeated |
| Art styles, layout | A 1,354 px prompt builder sat above the list. Clicking a card image jumped to the builder | Search and family filter first, the builder folded into one row, then the 60 styles. A card opens its entry like every other card; "Use in prompt builder" opens the builder |
| Entry view actions | Five buttons: Add to project, Share, Pin to moodboard, Save for later, Add to inspiration | Add to project, Save, and a More menu holding the other three |
| List toolbars | Search and filter rows differed by section: label rows on two, text from 12 to 15 px, heights from 38 to 45 px, a 50/50 split on Art styles | One row: search grows, one 230 px filter beside it, 44 px high, 14 px text, labels kept for screen readers |
| Section headings | Backgrounds and Guided tours started 36 to 76 px lower than the rest, under a label line | All section titles start at the same height |

How it is built: `site/studio-tabs.js` adds the tab bar to the three studios from their existing panel sections, so no
studio logic changed. The new art notes were drafted by a writing agent from each entry's title, summary and tags, then
checked by script (60 ids, five fields, no repeats) and by reading a sample of thirteen against what the media are.

Still open after this pass: the UI components section still opens with a 1,223 px component lab above its list; the
chart and mockup studios already had tabs and were left as they are; template thumbnails still show older artwork;
none of the 25 animation ideas is built; sign-in and cloud sync are down until the Supabase project is restored.

## Fourth pass: structure and content, not function

The owner's point: checking that tools work is not a redesign, and the content had not been read. This pass read
the 409 catalogue entries and every section's copy, mapped the navigation, and changed the structure.

**What the content actually is.** Each entry's one-line summary is specific and good (median 77 characters; almost
no filler words). The problem is around it:

```
identical "checks" paragraph      72 entries, another on 60
identical "build" paragraph       36 + 24 entries
identical "use", "motion", "avoid" 36 entries each (every art style)
```

So opening Gouache, Stencil or Chalk pastel showed the same four paragraphs under headings that looked specific.
"What to notice" often repeated the summary word for word. *Changed:* the entry view shows only what is true of that
entry. A paragraph shared by eight or more entries folds into one "General advice for art styles" line. Gouache went
from 250 words to 164, none of them repeated.

**Four places to save one thing.** An entry offered "Add to direction collection", "Save to inspiration", "Add to
project", "Share this direction" and "Pin to moodboard" in one row. *Changed:* "Add to project" is the main button;
the rest are secondary and renamed in plain words. The four destinations still exist. Merging them is a product
decision, and it is the next thing to decide.

**201 cropped mock-up fragments were mixed into the style catalogue**, so "Everything" said 588. *Changed:* the
catalogue lists the 387 styles. The fragments remain on their own page, which is no longer in any menu.

**The catalogue had two collection pickers, a mood filter, eight "feel" chips and two "show" chips.** *Changed:*
one collection list, search, mood, and everything else behind "More filters".

**Navigation.** There were 34 destinations in five groups, with a 12-item "More" and several pages that duplicated
another (two icon pages, two home pages, vase studies beside art styles). *Changed:* four groups that each mean one
thing, used by the top bar, the phone menu, the drawer and the home page:

| Group | Means | Pages |
| --- | --- | --- |
| Library | things to copy | 7 |
| Styles | looks to brief from | 6 |
| Make | tools | 7 |
| Yours | what you saved | 6 |

"More" is four links. Atlas overview, Vase studies, Extracted assets and the second icon entry left the menus; their
addresses still work.

**Words.** Fifteen section intros rewritten to say what is on the page and what you can do there. Card labels lost
their codes ("A02 / Animation art · Generated reference" is now "Animation art"). "Specimen", "plate", "treatment",
"contact sheet" and "direction collection" replaced where a visitor reads them.

**Not done in this pass.** The layout inside each tool (charts, diagrams, flowcharts, mockups, motion graphics, the
site builder editor) was not redesigned. The atlas sections still each have their own toolbar arrangement. The
boilerplate paragraphs were hidden, not rewritten: 60 art styles still lack their own "how to make it" text.

## What the first pass missed, and the second pass

The first pass measured markup. It did not try to use each tool the way a person would, so it reported the site as
"in good technical shape" while tools such as the brand kit generator were close to unusable. That was the wrong
conclusion, and the owner called it out. The second pass, the same day, used the tools by hand. What it found:

**A · Critical · Sign-in is down.** `supabase-client.js` points at `ymrbfnxesuuohysgwxtw.supabase.co`, and that host
does not exist in DNS:

```
nslookup ymrbfnxesuuohysgwxtw.supabase.co   ->  NXDOMAIN
curl .../auth/v1/health                      ->  no connection
```

Every page that loads the client logs `ERR_NAME_NOT_RESOLVED`. "Email me a sign-in link" on the account page, cloud
sync of projects and public project hubs cannot work until the Supabase project is restored or the URL is replaced.
Nothing in the UI says so. Not fixable from the code alone.

**B · Critical · The brand kit generator was one page 20 screens tall** (18,472 px at 1440 × 900, 250 controls). The
download and save buttons were 7,500 px and 17,600 px down. The form stuck 12 px from the top and slid under the
44 px site bar, hiding the first field. The Colours section opened with contrast tables and a colour-blind matrix.
*Fixed:* seven tabs (Colours, Fonts, Logo, Examples, Guide, Code, Full kit), the actions in one row under them, the
form clear of the bar, shades and checks folded into one disclosure, a plain-words intro. The page is now 1.4 screens.

**C · Major · A theme kit was one page 10 screens tall.** *Fixed:* `kits/tabs.js` shows Overview, Colours, Light &
dark, Fonts, Components, Examples, Assets, Guidelines and Download as tabs. Now 2.1 screens.

**D · Major · Section titles did not match the menu.** You chose "Icon families" and landed on "Different visual
voices."; "Fonts & type" opened "Type / together."; "Compare styles" opened "Comparison desk." *Fixed:* ten titles
now say what the menu says.

**E · Major · Every atlas section opened with a film, a "Plate 08 · Systems · of 18" label and a curve drawing**, ten
of them dark and nine light. *Fixed:* headers are a plain title, one line of text and "See also" links, all light.
One switch (`CALM` in `atlas-enhance.js`) brings the films back.

**F · Major · On phones the menu had no descriptions.** *Fixed:* the menu sheet shows each page's one-line description
under its name, and the library drawer folds into groups with descriptions in the open one.

**G · Open · Very long pages on phones.** UI components is 46 screens and the animation studio 44 at 390 px. They need
"show 12, load more" like the catalogue has.

**H · Open · The animation studio's content area is still dark** below its now-light header.

Also fixed in the second pass: one body font (Inter) on the atlas, icon library and account page; the strips of
cropped mock-up fragments removed from UI components, art styles and fonts; the tools page's duplicate nav removed;
a hidden `h2` where cards sat directly under the page title; sliders 24 px tall.

## Third pass: every other tool, used by hand

Each tool was opened at 1440 px and 390 px and given its main job. Nothing was broken; the problems were clutter.

| Tool | The job tried | Result |
| --- | --- | --- |
| Chart studio | Paste my own table, change chart type, open Export | Works. Pasted 4 rows × 2 series, got a line chart, switched to stacked column; eight export options, clearly labelled |
| Mockup studio | Put a picture in a frame, open Export | Works. "Capture a page of this site" took between 6 and 15 s and the atlas home came out with a block of unstyled text at the top |
| Diagram studio | Switch between diagram types, open Export | Works. Kanban, SWOT, Sequence, Venn, Fishbone and Gantt all drew. *Fixed:* two header buttons that repeated the top bar's menu |
| Flowchart studio | Add a step | Works. The step appeared in the list and the chart. Buttons say "Add stage" and "Step outside stages", which needs a plainer name |
| Motion graphics | Change the words, open Export | Works. Five export formats |
| Moodboards | Add a note and a colour | Works |
| Site builder editor | Add a section, undo, open Export | Works. *Fixed:* on a phone the Export button was pushed off the right edge (it ended at 405 px on a 390 px screen); it now ends at 377 px |
| UI interactions | Open a piece, find Copy HTML | Works well on both widths: live preview, sliders, Copy HTML and Download at the top |
| App templates | Open a screen, find Copy HTML | Works. *Fixed:* a 620-character intro cut to two sentences (same on UI interactions) |
| Icon library | Search "mail", open an icon, find Copy | Works. *Fixed:* three stacked header rows (dark banner, breadcrumb, "Plate 08" label) reduced to the breadcrumb; intro cut to two sentences |

Not exercised: the final click of any download or export, uploading an image or font, dragging on canvases, the AI
features, publishing a site, and anything that needs sign-in.

Open from this pass: the mockup page capture quality, plainer words in the flowchart step editor, and the 10-item
export menu in the site builder, which could be grouped.

## Summary (first pass)

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

## Animation and interaction opportunities from the reference sites

This is what the reference links were for. The shelf's 114 pieces and 41 techniques were compared with Aceternity UI
(names and functions read from the site), Magic UI and 21st.dev (names read; behaviour partly inferred from the
names), hoverstat.es and Haikei. Oversight Supply returned section names only.

**Already covered, do not rebuild:** carousels (arc, ring, cover flow), card decks, tilt and holographic cards,
spotlight and glowing borders, compare slider, magnifier, masonry, dock, gooey tabs, radial menus, magnetic and
confetti buttons, toasts, scramble, split-flap, odometer, typewriter, marquee, particle globe, and mesh, dither,
halftone and aurora shaders. The manifest also has near-duplicates worth merging: expanding panels ×2, stacked toasts
×2, hold-to-confirm ×2, radial menu ×2.

**Gaps, ranked.** S is under about 80 lines, M medium, L needs WebGL.

Built: all 25 (twelve in the seventh pass, the rest in the eighth).

| # | Piece | What you see | Seen at | Shelf category | Build | Size |
|---|---|---|---|---|---|---|
| 1 | Scroll text reveal | Words go from grey to ink as you scroll | Magic UI | Type | per-word `animation-timeline: view()` | S |
| 2 | Flashlight reveal | The cursor is a round window onto a second layer | Aceternity, 21st | Type | CSS mask + pointer | S |
| 3 | Liquid metal, silk, caustics | Flowing chrome, cloth folds, pool light | 21st shaders | Backgrounds | WebGL fragment shader each | L |
| 4 | Burn-away transition | An image chars and dissolves into the next | Aceternity, 21st | Carousels | WebGL noise threshold | L |
| 5 | Scratch to reveal | Rub off foil to uncover a code | Magic UI, 21st | Cards | canvas `destination-out` | S |
| 6 | Expanding card to detail | A card grows in place into a detail sheet | Aceternity | Cards | View Transitions, FLIP fallback | M |
| 7 | Morphing text | One word melts into the next | Magic UI | Type | blur crossfade + SVG threshold | S |
| 8 | Orbiting icons | Logos circle a centre mark on rings | Magic UI | Sections | CSS rotate + counter-rotate | S |
| 9 | Fluid ink | Coloured smoke swirls after the pointer | 21st | Backgrounds | WebGL fluid simulation | L |
| 10 | World map with arcs | Dotted map, lines flying between cities | Aceternity, Magic UI | Signal & data | SVG dots + dash-offset arcs | M |
| 11 | Icon cloud sphere | Logos on a draggable sphere | Magic UI, 21st | Canvas | Fibonacci sphere, depth sort | M |
| 12 | Vanishing input | Submitted text crumbles into particles | Aceternity | Controls | canvas pixel particles | M |
| 13 | Grid backgrounds | Flickering cells, retro floor, hover-lit boxes | Magic UI, Aceternity | Backgrounds | canvas grid, CSS perspective | S |
| 14 | Hero parallax wall | Rows of screens slide opposite ways on scroll | Aceternity | Scroll | scroll-driven transforms | M |
| 15 | Tracing beam timeline | A glowing line follows your scroll | Aceternity | Scroll | SVG dash-offset on `scroll()` | S |
| 16 | Page preloader | Counter to 100, then a curtain lifts | 21st | Feedback | counter + clip-path | S |
| 17 | Liquid glass | A lens that refracts what is behind it | Aceternity, 21st | Navigation | backdrop-filter + displacement map | M |
| 18 | Lanyard badge | An ID card on a strap you can swing | 21st | Cards | Verlet rope + drag | M |
| 19 | Page-turn book | Pages curl like a journal | 21st | Galleries | CSS 3D pages | M |
| 20 | ASCII image | A photo redrawn in characters | Aceternity, 21st | Canvas | luminance to glyph grid | M |
| 21 | Direction-aware hover | The overlay enters from the side you came in | Aceternity | Galleries | entry-angle maths, `:has()` | S |
| 22 | Scatter to list | Scattered images fly into an ordered list | hoverstat.es | Lists | FLIP between layouts | M |
| 23 | Meteors | Streaks fall across a dark hero | Magic UI, Aceternity | Backgrounds | CSS keyframes | S |
| 24 | Layered waves | Stacked wave bands drift, reseedable | Haikei | Backgrounds | generated SVG paths | S |
| 25 | Metaball loader | Blobs merge and split | 21st | Feedback | SVG goo filter | S |

**Where the references are ahead:** shader backgrounds (21st lists about 30 kinds, the shelf has five); material
transitions such as burn, ink and liquid glass (the shelf has none); scroll and entrance text effects (the shelf's
type pieces are pointer or loop driven); ambient pattern backgrounds and generators.

A sensible first batch is the twelve S pieces: 1, 2, 5, 7, 8, 13, 15, 16, 21, 23, 24, 25.

## Layout notes from the same sites (not what was asked for, kept for reference)

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
