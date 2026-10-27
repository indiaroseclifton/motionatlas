# Dogfood report

Method: drove the real UI with Playwright at 1440x900 (and 390 for phone checks), built things end to end, and looked at screenshots of every step. api/* mocked off. Scenarios A to G.

## What was tried
- A. Brand generator "Saffron & Salt" (bakery) -> Use in Site builder -> suggested template (Coffee shop and bakery) -> inline text edit -> replace hero photo from Photos -> add Pricing component and Fanned card deck interaction -> add blog post -> Checks on every page -> ZIP -> unzip, serve, screenshot every page at 1440 and 390.
- B. Chart studio: pasted a 12-month, 4-product revenue CSV, stacked column, title/prefix/source, callout, PNG and SVG export, Make share image -> Mockup studio -> OG and Instagram square PNG plus the 10-image ZIP.
- C. Diagram studio roadmap and org chart from text import; Flowchart studio "Describe a process" (rules fallback), select element and connection, change kind, rename, export SVG/PNG/HTML.
- D. Moodboard Brand exploration template, pinned 6 atlas entries, uploaded a picture, palette, "Make this a style", kit ZIP, Use in Site builder.
- E. Top bar menus, search, All tools page, phone menu, 14 tool pages at 390 (no overflow, no console errors).
- F. Saved brand and site to My projects, opened the hub, checked links.
- G. Fresh visitor on atlas.html and page-builder.html.

## Bugs found
Severity: H = data loss or broken output, M = wrong/confusing result, L = polish.

| # | Sev | Bug | Status |
|---|-----|-----|--------|
| 1 | H | Site builder: words typed inline in the last ~1s before a reload, tab close or navigation were lost (250ms + 600ms debounces) | Fixed (flush on pagehide/hidden); test added |
| 2 | H | ZIP export: interaction demo (Fanned card deck) hot-linked its pictures from the live atlas URL, so the "self-contained" export broke offline | Fixed (pictures packed into assets/shelf, paths rewritten); test added |
| 3 | M | Brand -> site: hero headline and intro were the same sentence (tagline = description) | Fixed; test added |
| 4 | M | Brand -> site: template placeholder email (hello@ryeandroast.example) and two copyright lines ("(c) 2026 Brand. (c) 2027 Template Ltd") in every footer | Fixed (email follows brand name; template legal strings no longer carry a second (c)); test added |
| 5 | M | Brand logo image injected into the copyright line, comparison table heading and big footer word | Fixed; test added |
| 6 | M | Image field in the settings panel had only a text box ("Pick a library image or paste a path"): no way to choose a Photo or upload from there | Fixed: "Choose a photo or upload..." button opens the same picker as the canvas toolbar |
| 7 | M | Checks flagged "Heading level jumps h2 to h4" for any UI component (Pricing) the user adds | Fixed (aria-level mapping in component section) ; test added |
| 8 | M | Pricing component rendered tiny and centred in a wide card | Fixed (wider stage for plans) |
| 9 | M | Adding a blog post / switching page kept the previous scroll position, so a new page opened mid-way | Fixed; test added |
| 10 | M | Chart studio: pasting your own CSV kept the sample's title, subtitle, source and annotations ("YouTube pulled ahead...") | Fixed; test added |
| 11 | M | Chart studio: the chart scrolled out of sight while editing long settings panels | Fixed (sticky stage on desktop) |
| 12 | M | Make share image from Chart studio put the chart in a browser frame with a fake "yourproduct.com" URL bar | Fixed (card frame); |
| 13 | M | Diagram studio: text import kept the starter title/subtitle ("AI cooking channel", "Channel team") and the org chart import showed "Name \| Role" literally | Fixed (title reset, `\|` accepted as separator, help text updated); test added |
| 14 | M | Moodboard: pinned atlas entries landed on top of each other and off-screen, and the atlas card height (170/200) was shorter than its drawn size so cards overlapped | Fixed (free-spot placement, scroll into view, correct height); test added |
| 15 | M | Moodboard palette / "Make this a style" ignored the selected picture and always blended in the starter swatches (purple/pink) | Fixed: uses selection when something is selected; dialog says so; test added |
| 16 | M | A brand and a site with the same name became two separate My projects | Fixed: site joins the brand's project hub |
| 17 | L | Project hub opened scrolled under the top bar; "No directions yet." drawn as a white pill on dark | Fixed |
| 18 | L | Home hero offered only "Open the atlas" and "Watch the film": nothing for a visitor who wants to make something | Fixed: "Make something" button scrolls to the tools section |
| 19 | L | "Describe your site" fallback chose Restaurant for a bakery and had no keywords for coffee/fitness/law/real estate/wedding/podcast/docs/conference templates | Fixed (keywords added) |
| 20 | L | Toggle rows in the interaction settings (e.g. transparent background) wrapped help text badly | Fixed |
| 21 | L | Phone: Site builder toolbar pushed Export off-screen | Fixed (Undo/Redo shrink to arrows) |

## Not fixed / remaining
- "Describe your site" with no business name still uses the template's placeholder brand (e.g. "Rye & Roast"); needs a name field or derive from brief.
- Mockup studio ZIP of all 10 sizes is 26 MB for a flat chart image (PNG only); a JPEG/WebP option exists but ZIP default is PNG.
- Moodboard: 'Fit' after many pins can leave cards tiny; acceptable.
- Atlas home tour cards were empty (no thumbnails) in screenshots at first paint; lazy-loaded, not investigated further.
- Flowchart: a branch line that loops back is not detected from plain prose unless it says "go back to".
- Resolved-by-design: API features (AI) not exercised, they degrade with clear messages.

## Regression tests added
- tools/site-builder-test.mjs (brand -> site -> components -> export, typing before reload)
- tools/dataviz-test.mjs (chart sample text, sticky chart, org import)
- tools/moodboard-test.mjs (pin overlap, visibility, palette from selection)
