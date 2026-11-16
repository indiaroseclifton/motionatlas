# The site style (November 2026)

Why: the owner asked for the whole site to be brought up to the standard of the best current product websites. Measured on linear.app, stripe.com, vercel.com, apple.com, notion.com and figma.com: every one uses a single sans typeface for titles, text and labels; headlines are weight 300 to 600 (never heavier), 34 to 56px on a laptop, line-height 1.0 to 1.17, letter-spacing -0.02em to -0.06em; body text is 14 to 20px at line-height 1.4 to 1.6; navigation and buttons are 13 to 18px at weight 400 to 500.

Measured on our site before this change: page titles in three different cuts of Cormorant Garamond (italic 500, upright 300, upright 400) from 24px to 132px; Georgia on one page; JetBrains Mono used for ordinary labels; four different page backgrounds; buttons 27 to 50px tall with corners from 0 to fully round; text down to 11px.

The reference implementation is `site/index.html` (already done and live). Open it and copy its values.

## Type
- One family for all page chrome: `Inter, system-ui, sans-serif` (weights 400, 500, 600). No Cormorant Garamond, no Georgia, no other serif, and no italic titles. JetBrains Mono only for real code, hex values, file names and keyboard keys.
- Remove fonts a page no longer uses from its Google Fonts link (keep fonts that exhibits/previews need).
- Page title (h1) on a landing or gallery page: weight 600, `clamp(40px,6vw,76px)` on the home page and `clamp(36px,5vw,64px)` elsewhere, line-height 1.05, letter-spacing -0.035em, `text-wrap:balance`.
- Title in a tool or studio bar (compact pages): weight 600, 16px, letter-spacing -0.01em.
- Section heading (h2): weight 600, `clamp(24px,2.6vw,32px)`, line-height 1.15, letter-spacing -0.025em.
- Card title / h3: weight 600, 16 to 17px, line-height 1.3, letter-spacing -0.01em.
- Lead paragraph under a title: 17 to 18px, line-height 1.55, muted colour, at most about 60 characters wide.
- Body 15 to 16px at 1.55. Secondary text 14px. Nothing smaller than 12px anywhere; nothing clickable smaller than 13px.
- Labels, kickers, counts, breadcrumbs: Inter 500, 12 to 13px, muted, sentence case, letter-spacing 0. No uppercase tracked mono labels. Convert the text to sentence case in the markup where it is written in capitals.
- Numbers in tables and counters: `font-variant-numeric: tabular-nums`.

## Colour
- Page background `#FFFFFF`. Alternate surface (wells, stages, soft panels) `#F6F7F9`. Hairline `#E6E8EC`. Stronger hairline (hover, inputs) `#D5D8DF`. Text `#0F1115`. Muted text `#5F6573` (it must stay at or above 4.5:1 on white and on `#F6F7F9`).
- Primary action: fill `#0F1115`, text `#FFFFFF`, hover `#000`. Secondary: white with the stronger hairline, hover background `#F6F7F9`. Quiet: no border, hover background `#F6F7F9`.
- Focus: 2px `#0F1115` outline, offset 2px.
- Keep existing status colours (success, warning, danger) and any colour that is content (swatches, charts, kit previews).
- No coloured page bands, no dark header bands, no gradients, glows or coloured shadows in page chrome. Where a page maps its own variables (`--bg`, `--panel`, `--ink`, `--mute`, `--hair`, `--soft`, `--accent` or others), set those variables to these values rather than adding overrides.
- The optional theme picker on three pages (`tool-themes.js`) stays; its default "Clean" theme should equal these values.

## Shape
- Buttons, inputs and selects: 40px tall (44px at 640px wide and below), radius 10px, 14px text at weight 500, side padding 14 to 16px. Selects must not set `appearance` or their own arrow (the shared arrow comes from `site-bar.js`); use `background-color`, never the `background` shorthand, on selects.
- Filter chips where any remain: 32px tall, fully round.
- Cards: radius 14px, 1px hairline, no shadow at rest. On hover: stronger hairline, `translateY(-2px)`, shadow `0 12px 28px -18px rgba(15,17,21,.25)`, 200ms `cubic-bezier(.2,.8,.2,1)`.
- Dialogs and sheets: radius 16px; a soft shadow is fine there.
- Checkboxes at least 20px with a 40px label hit area (already the case; keep it).

## Layout
- Content max-width 1248px (up to 1440px for dense galleries and tools), side gutter `clamp(20px,4vw,48px)`.
- Hero top padding `clamp(56px,11vh,120px)` on landing pages, less on tool pages. About 96px between major sections on desktop, 56px on phones.
- Sticky filter rows: white background, hairline underneath.

## Motion
- Hover and press 150 to 200ms; panels 220 to 280ms; easing `cubic-bezier(.2,.8,.2,1)`. Honour `prefers-reduced-motion`.

## What is content, not chrome (leave its own look alone)
Demos in iframes, interaction pieces, app screens, theme-kit previews and kit pages, brand previews, design-system samples, art-style specimens, chart previews, the canvas of every studio, user content, exported code. They are exhibits on the wall; the wall is what changes.

## Do not break
- Every feature keeps working (merge, do not remove). Do not change ids, data attributes, storage keys or URLs that scripts use.
- The Atlas bar (`site-bar.js`, `site-nav-data.js`, the `sbPre` style block) is not yours to edit.
- No commits, pushes, installs or downloads. No new image files. Do not fetch the live site.
- Do not put JS template literals (backticks, `${}`) inside Bash heredocs; write script files with your file-writing tool and run them.

## How to check
`tools/cdp.mjs` drives the installed Chrome:
`import { launch } from '/Users/indiaclifton/Documents/motionatlas/tools/cdp.mjs'; const br=await launch({width:1440,height:900,scale:1}); const pg=await br.newPage(); await pg.goto(url); await pg.wait(2000); await pg.evaluate("js string"); await pg.screenshot({path:'/abs/x.jpg',type:'jpeg'}); await pg.close(); await br.close();`
(`pg.on(m=>...)` receives CDP events such as `Runtime.exceptionThrown`.) The site is served at http://localhost:8772/. Put scripts and screenshots in a scratch folder you create under /private/tmp/claude-501/, never in the repo.

For every page you change: a before and an after screenshot at 1440x900 and 390x844 that you LOOK at; a script that reports, for the page chrome (excluding the Atlas bar and the exhibits), every element whose computed font-family is not Inter (or mono where allowed), every font-size under 12px, every italic or serif title, every button/input/select whose height or radius is off the values above, and the page background; no script errors; no sideways scroll at 390; text not clipped or overlapping. Fix what the script reports or say why it stays. Finish with `node tools/smoke.mjs http://localhost:8772/` and `node tools/smoke.mjs http://localhost:8772/ phone`.

## Report
Per page: what changed (title, labels, colours, controls, cards, layout), what you left alone and why, the script's before and after counts, anything not verified.
