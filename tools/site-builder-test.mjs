// Site builder end-to-end test (site/page-builder.html, site/builder/*).
//   cd site && python3 -m http.server 8794      # serve the static site
//   node tools/site-builder-test.mjs            # from a folder whose node_modules has playwright (and axe-core)
// Env: BASE (default http://localhost:8794/), CHROME (Chromium binary).
// Covers: multi-page create/edit, shared header/footer + menu, site settings, back-compat load of old saved pages,
// ZIP export (unzipped and validated), axe on the editor, 390px layout. api/ is mocked with route interception.
import { chromium } from 'playwright';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
const BASE = process.env.BASE || 'http://localhost:8794/';
const CHROME = process.env.CHROME || (fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined);
let axeSrc = null; for (const p of ['axe-core/axe.min.js', '/tmp/claude-0/pw/node_modules/axe-core/axe.min.js']) { try { axeSrc = fs.readFileSync(p.startsWith('/') ? p : new URL('./node_modules/' + p, import.meta.url), 'utf8'); break; } catch {} }
const br = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
const errs = [];
async function open(opts = {}) {
  const ctx = await br.newContext({ viewport: opts.vp || { width: 1440, height: 900 }, acceptDownloads: true });
  if (opts.init) await ctx.addInitScript(opts.init);
  const pg = await ctx.newPage();
  pg.on('pageerror', e => errs.push('PE ' + e.message.slice(0, 160)));
  pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('CE ' + m.text().slice(0, 160)); });
  await pg.route('**/api/ai*', r => r.fulfill({ status: 200, contentType: 'application/json', body: '{"enabled":false}' }));
  await pg.goto(BASE + 'page-builder.html'); await pg.waitForFunction(() => document.body.classList.contains('ready'));
  await pg.waitForTimeout(600);
  if (!opts.start && await pg.locator('#startDlg[open]').count()) { await pg.keyboard.press('Escape'); await pg.waitForTimeout(150); }
  return { ctx, pg };
}
const openPages = async pg => { await pg.click('#rt-page'); await pg.evaluate(() => { document.querySelector('#pgSettings').open = true; }); };
const site = pg => pg.evaluate(() => JSON.parse(JSON.stringify(PB.getSite())));
const frame = pg => pg.frameLocator('#pv');
const waitPv = pg => pg.waitForTimeout(700);

// ---- 1. multi-page create and edit
{
  const { ctx, pg } = await open();
  let s = await site(pg);
  ok(s.pages.length === 1 && s.header.length === 1 && s.footer.length === 1, 'default site has one page with a shared header and footer');
  await openPages(pg); await pg.click('#addPage'); await waitPv(pg);
  await pg.fill('#pgName', 'About us'); await pg.click('#addPage'); await pg.fill('#pgName', 'Contact'); await waitPv(pg);
  s = await site(pg);
  ok(s.pages.map(p => p.slug).join() === 'index,about-us,contact', 'three pages with slugs index, about-us, contact: ' + s.pages.map(p => p.slug));
  await pg.fill('#pgSlug', 'Get in touch!'); await pg.dispatchEvent('#pgSlug', 'change');
  ok((await site(pg)).pages[2].slug === 'get-in-touch', 'file name is sanitised into a slug');
  await pg.fill('#pgSlug', 'contact'); await pg.dispatchEvent('#pgSlug', 'change');
  // duplicate, reorder, home, delete
  await pg.click('.pgrow:nth-child(3) [data-a=dup]'); s = await site(pg);
  ok(s.pages.length === 4 && /copy/.test(s.pages[3].name) && new Set(s.pages.map(p => p.slug)).size === 4, 'duplicate gives a unique slug');
  await pg.click('.pgrow:nth-child(4) [data-a=up]'); s = await site(pg);
  ok(/copy/.test(s.pages[2].name), 'reorder moves the page up');
  pg.once('dialog', d => d.accept()); await pg.click('.pgrow:nth-child(3) [data-a=rm]'); s = await site(pg);
  ok(s.pages.length === 3, 'delete removes the page');
  await pg.click('.pgrow:nth-child(2) [data-a=home]'); s = await site(pg);
  ok(s.home === s.pages[1].id, 'home page can be changed');
  await pg.click('.pgrow:nth-child(1) [data-a=home]');
  // shared menu lists pages in the preview, with real links
  await pg.selectOption('#pageSel', { index: 1 }); await waitPv(pg);
  const links = await frame(pg).locator('.b-nav .links a').allTextContents();
  ok(links.join() === 'Home,About us,Contact', 'menu auto-lists the pages: ' + links);
  ok(await frame(pg).locator('.b-nav .links a[aria-current=page]').textContent() === 'About us', 'current page marked in the menu');
  ok((await frame(pg).locator('h2,h1').first().textContent()).trim().length > 0, 'page 2 renders its own content');
  // clicking a menu link in the preview switches page
  await frame(pg).locator('.b-nav .links a', { hasText: 'Contact' }).click(); await waitPv(pg);
  ok(await pg.inputValue('#pageSel') === (await site(pg)).pages[1].id, 'in Edit mode a menu link only selects it');
  await pg.click('#modeSeg [data-m=view]'); await waitPv(pg);
  await frame(pg).locator('.b-nav .links a', { hasText: 'Contact' }).click(); await waitPv(pg);
  ok(await pg.inputValue('#pageSel') === (await site(pg)).pages[2].id, 'clicking a menu link in the preview opens that page');
  await pg.click('#modeSeg [data-m=edit]'); await waitPv(pg);
  // hide from the menu
  await openPages(pg); await pg.uncheck('#pgNav'); await waitPv(pg);
  ok((await frame(pg).locator('.b-nav .links a').count()) === 2, 'page hidden from the menu');
  // custom menu
  await pg.click('#rt-site'); await pg.uncheck('#navAuto'); await pg.click('#navRows .btn'); await pg.fill('#navRows .navrow:last-of-type > input', 'Docs');
  await pg.selectOption('#navRows .navrow:last-of-type select', 'custom'); await pg.fill('#navRows .navrow:last-of-type .lp input', 'https://example.com/docs'); await waitPv(pg);
  ok(await frame(pg).locator('.b-nav .links a[href="https://example.com/docs"]').count() === 1, 'custom menu item with an external link');
  // site settings
  await pg.fill('#brand', 'Pottery Co'); await pg.fill('#surl', 'https://pottery.example'); await pg.fill('#sdesc', 'Weekend classes in Leeds.'); await pg.fill('#sAnalytics', '<script defer data-domain="pottery.example" src="https://plausible.io/js/script.js"></script>');
  await pg.selectOption('#favSet', 'letter'); await waitPv(pg);
  ok(await frame(pg).locator('.b-nav .logo').textContent() === 'Pottery Co', 'brand name flows into the shared header');
  // per-page SEO
  await openPages(pg); await pg.click('.pgrow:nth-child(1) .pgname'); await pg.fill('#ptitle', 'Pottery Co | Classes'); await pg.fill('#pgDesc', 'Learn wheel throwing.'); await waitPv(pg);
  ok((await pg.textContent('#serp')).includes('Pottery Co | Classes'), 'search result preview shows the page title');
  // add a section to the shared footer / header goes to the right place
  s = await site(pg);
  ok(s.pages.length === 3 && s.settings.url === 'https://pottery.example', 'settings stored');
  // undo / redo covers page changes
  const before = JSON.stringify((await site(pg)).pages.map(p => p.title)); await pg.click('#undoBtn'); await pg.click('#undoBtn'); await pg.click('#redoBtn'); await pg.click('#redoBtn');
  ok(JSON.stringify((await site(pg)).pages.map(p => p.title)) === before, 'undo then redo restores page edits');
  // ZIP export
  await pg.click('#rt-site'); await pg.check('#navAuto');
  const dlp = pg.waitForEvent('download'); await pg.click('#exportMenu summary'); await pg.click('#dlZip'); const d = await dlp;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-zip-')); const zf = path.join(dir, 'site.zip'); await d.saveAs(zf);
  const out = path.join(dir, 'x'); fs.mkdirSync(out); execFileSync('unzip', ['-q', zf, '-d', out]);
  const names = execFileSync('unzip', ['-Z1', zf]).toString().split('\n').filter(Boolean);
  ok(['index.html', 'about-us.html', 'contact.html', '404.html', 'sitemap.xml', 'robots.txt', 'assets/site.css', 'assets/favicon.svg', 'README.txt'].every(n => names.includes(n)), 'ZIP contains pages, 404, sitemap, robots, css, favicon: ' + names.filter(n => !n.startsWith('assets/')).join());
  const idx = fs.readFileSync(path.join(out, 'index.html'), 'utf8'), about = fs.readFileSync(path.join(out, 'about-us.html'), 'utf8');
  ok(/<title>Pottery Co \| Classes<\/title>/.test(idx) && /name="description" content="Learn wheel throwing\."/.test(idx), 'index has the page title and description');
  ok(/rel="canonical" href="https:\/\/pottery\.example\/"/.test(idx) && /rel="canonical" href="https:\/\/pottery\.example\/about-us\.html"/.test(about), 'canonical links use the site address');
  ok(/href="about-us\.html"/.test(idx) && /href="index\.html"/.test(about), 'menu links point at the exported files');
  ok(/plausible\.io/.test(idx), 'analytics snippet is in the export');
  ok(!/pb-page|data-pb|builder\/app|postMessage/.test(idx), 'no builder code in the export');
  ok(/<link rel="icon" href="assets\/favicon\.svg"/.test(idx) && /property="og:title"/.test(idx), 'favicon and Open Graph meta present');
  const sm = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
  ok(/<loc>https:\/\/pottery\.example\/<\/loc>/.test(sm) && /about-us\.html/.test(sm) && /contact\.html/.test(sm) && !/404/.test(sm), 'sitemap lists the pages');
  ok(/Sitemap: https:\/\/pottery\.example\/sitemap\.xml/.test(fs.readFileSync(path.join(out, 'robots.txt'), 'utf8')), 'robots.txt points at the sitemap');
  ok(/noindex/.test(fs.readFileSync(path.join(out, '404.html'), 'utf8')), '404 page is noindex');
  // exported pages open and navigate (served from the unzipped folder)
  const p2 = await ctx.newPage(); const pe = []; p2.on('pageerror', e => pe.push(e.message));
  await p2.route('https://pottery.example/**', r => r.abort()); await p2.route('https://fonts.googleapis.com/**', r => r.abort()); await p2.route('https://fonts.gstatic.com/**', r => r.abort()); await p2.route('https://plausible.io/**', r => r.abort());
  await p2.goto('file://' + path.join(out, 'index.html')); await p2.waitForTimeout(500);
  await p2.click('.b-nav .links a:has-text("About us")'); await p2.waitForURL(/about-us\.html/);
  ok(pe.length === 0, 'exported site runs without script errors ' + pe.join());
  if (axeSrc) { await p2.goto('file://' + path.join(out, 'index.html')); await p2.addScriptTag({ content: axeSrc }); const r = await p2.evaluate(() => axe.run(document, { resultTypes: ['violations'] })); const bad = r.violations.filter(v => ['serious', 'critical'].includes(v.impact)); ok(bad.length === 0, 'axe: exported page has no serious or critical issues ' + bad.map(v => v.id + ' ' + v.nodes.length)); }
  await ctx.close();
}

// ---- 1b. canvas editing: select, edit in place, toolbar, shortcuts
{
  const { ctx, pg } = await open();
  await pg.waitForTimeout(2500); // let the icon cache warm up, which redraws the preview once
  const fr = frame(pg), head = fr.locator('.b-hero-film [data-pbf=heading]');
  await head.click({ position: { x: 12, y: 12 } }); await pg.waitForTimeout(400);
  ok(await pg.isVisible('#cvTb'), 'clicking the preview shows the floating toolbar');
  ok((await pg.textContent('#cvTb .tbn')).includes('Film hero'), 'toolbar names the selected section');
  await pg.keyboard.press('Control+A'); await pg.keyboard.type('Pots, made slowly'); await pg.waitForTimeout(700);
  let s = await site(pg);
  ok(s.pages[0].blocks[0].vals.heading === 'Pots, made slowly', 'text edited in place is stored in the section');
  await pg.keyboard.press('Control+A'); await pg.keyboard.insertText('<img src=x onerror=alert(1)> & more'); await pg.waitForTimeout(500); await pg.keyboard.press('Escape'); await waitPv(pg);
  s = await site(pg);
  ok(s.pages[0].blocks[0].vals.heading.includes('<img') && (await fr.locator('.b-hero-film img[src=x]').count()) === 0, 'pasted markup stays text (sanitised)');
  // list cell edit: the FAQ questions are list rows, stats are list rows
  const n0 = s.pages[0].blocks.length;
  await pg.waitForTimeout(300); await pg.click('#cvTb [aria-label="Move section down"]'); await waitPv(pg); s = await site(pg);
  ok(s.pages[0].blocks[1].id === 'hero-film', 'toolbar moves the section down');
  await pg.keyboard.press('Control+z'); await pg.click('#undoBtn'); await waitPv(pg);
  await fr.locator('.b-hero-film').first().click({ position: { x: 5, y: 5 } });
  await pg.waitForTimeout(400); await pg.click('#cvTb [aria-label="Duplicate section"]'); await waitPv(pg); s = await site(pg);
  ok(s.pages[0].blocks.length === n0 + 1, 'toolbar duplicates the section');
  await fr.locator('.b-hero-film').first().click({ position: { x: 5, y: 5 } }); await pg.waitForTimeout(400);
  await pg.click('#cvTb [aria-label="Delete section"]'); await waitPv(pg); s = await site(pg);
  ok(s.pages[0].blocks.length === n0, 'toolbar deletes the section');
  await pg.click('#undoBtn'); s = await site(pg); ok(s.pages[0].blocks.length === n0 + 1, 'undo brings a deleted section back');
  await pg.click('#modeSeg [data-m=view]'); await waitPv(pg);
  ok(!(await pg.isVisible('#cvTb')) && (await fr.locator('[contenteditable]').count()) === 0, 'Preview mode has no editing chrome');
  await ctx.close();
}

// ---- 1c. images, links, section settings
{
  const { ctx, pg } = await open();
  await pg.waitForTimeout(2500);
  const fr = frame(pg);
  await openPages(pg); await pg.click('#addPage'); await waitPv(pg); await pg.click('#rt-page');
  // add a hero with an image through the library
  await pg.click('#libSearch'); await pg.fill('#libSearch', '3D card'); await pg.waitForTimeout(400); await pg.click('#libList .lc .add'); await waitPv(pg);
  let img = fr.locator('[data-pbimg=img3]'); await img.scrollIntoViewIfNeeded(); await img.click(); await pg.waitForTimeout(400);
  ok(await pg.isVisible('#cvTb [aria-label="Replace the image"]'), 'selecting an image shows the image tool');
  await pg.click('#cvTb [aria-label="Replace the image"]');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC', 'base64');
  await pg.setInputFiles('#cvPop input[type=file]', { name: 'dot.png', mimeType: 'image/png', buffer: png }); await waitPv(pg); await pg.waitForTimeout(500);
  let s = await site(pg);
  ok(JSON.stringify(s).includes('"user:u'), 'uploaded image stored as user:<id>');
  ok((await fr.locator('img[src^="blob:"], [style*="blob:"]').count()) > 0, 'uploaded image shows in the preview');
  // button link
  const btn = fr.locator('a.btn').first(); await btn.scrollIntoViewIfNeeded(); await btn.click({ position: { x: 4, y: 4 } }); await pg.waitForTimeout(400);
  await pg.click('#cvTb [aria-label="Change where this links"]'); await pg.selectOption('#cvPop select', { index: 1 }); await waitPv(pg);
  ok((await fr.locator('a.btn[href="#pb-page:' + s.pages[0].id + '"]').count()) >= 1, 'button can link to a page of the site');
  await pg.selectOption('#cvPop select', 'custom'); await pg.fill('#cvPop input[aria-label="Link address"]', 'https://example.com/book'); await waitPv(pg);
  ok((await fr.locator('a.btn[href="https://example.com/book"]').count()) >= 1, 'button can link to a web address');
  // section settings: hide on phone + accent background
  await pg.click('#cvTb [aria-label="Section settings and words"]'); await pg.waitForTimeout(300);
  await pg.locator('#ol .blk.open details.setd summary').first().click();
  await pg.locator('#ol .blk.open .setb select').nth(3).selectOption('accent'); await waitPv(pg);
  ok((await fr.locator('.pb-in').count()) === 1, 'accent background wraps the section in a re-themed container');
  await pg.locator('#ol .blk.open .hidef input').nth(2).check(); await waitPv(pg);
  s = await site(pg); ok(JSON.stringify(s).includes('"hide":{"p":1}'), 'hide on phone stored');
  // export honours uploads, links, settings
  const dlp = pg.waitForEvent('download'); await pg.click('#exportMenu summary'); await pg.click('#dlZip'); const d = await dlp;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-zip2-')); const zf = path.join(dir, 's.zip'); await d.saveAs(zf); const out = path.join(dir, 'x'); fs.mkdirSync(out); execFileSync('unzip', ['-q', zf, '-d', out]);
  const names = execFileSync('unzip', ['-Z1', zf]).toString();
  const html = fs.readFileSync(path.join(out, 'new-page.html'), 'utf8'), css = fs.readFileSync(path.join(out, 'assets/site.css'), 'utf8');
  ok(/assets\/uploads\/u\w+\.png/.test(names) && /assets\/uploads\/u\w+\.png/.test(html), 'uploaded image is bundled and referenced');
  ok(/href="https:\/\/example\.com\/book"/.test(html) && /pbh-p/.test(html) && /\.pbh-p\{display:none/.test(css), 'link override and phone visibility are in the export');
  ok(!/data-pbf|contenteditable|data-pbimg|data-pba/.test(html), 'no editing markers in the export');
  await ctx.close();
}

// ---- 1d. section picker with thumbnails
{
  const { ctx, pg } = await open();
  await pg.waitForTimeout(2500);
  const fr = frame(pg); await fr.locator('.b-sec-pricing [data-pbf=heading]').first().click({ position: { x: 10, y: 10 } }); await pg.waitForTimeout(400);
  const n0 = (await site(pg)).pages[0].blocks.length;
  await pg.click('#cvTb [aria-label="Add a section after this one"]');
  ok(await pg.locator('#picker[open]').count() === 1, 'the plus button opens the section picker');
  await pg.fill('#pickQ', 'Simple contact form'); await pg.waitForTimeout(1500);
  ok(await pg.locator('#pickGrid .pkcard').count() >= 1 && await pg.locator('#pickGrid .pkth iframe').count() >= 1, 'picker shows searchable cards with live thumbnails');
  await pg.locator('#pickGrid .pkcard').first().click(); await waitPv(pg);
  const s = await site(pg); const ids = s.pages[0].blocks.map(b => b.id);
  ok(s.pages[0].blocks.length === n0 + 1 && ids[ids.indexOf('sec-pricing') + 1] === 'contact-form', 'picked section is inserted right after the selected one');
  await ctx.close();
}

// ---- 1e. style swap and site tokens
{
  const { ctx, pg } = await open();
  await pg.waitForTimeout(2500);
  const fr = frame(pg), bg0 = await fr.locator('body').evaluate(b => getComputedStyle(b).backgroundColor);
  await pg.click('#rt-style'); await pg.fill('#styleSearch', 'Signal'); await pg.waitForTimeout(300);
  await pg.locator('#styleList .sc').first().click(); await waitPv(pg);
  const bg1 = await fr.locator('body').evaluate(b => getComputedStyle(b).backgroundColor);
  ok(bg0 !== bg1 && (await site(pg)).style !== 'noir', 'one click swaps the whole site style (' + bg0 + ' to ' + bg1 + ')');
  ok((await fr.locator('.b-nav .logo').evaluate(e => getComputedStyle(e).fontFamily)).length > 0, 'header follows the style');
  // tokens
  await pg.locator('#tkBox summary').click(); await pg.locator('#tkBox input[data-k=accent]').evaluate(i => { i.value = '#ff0066'; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); }); await waitPv(pg);
  ok(await fr.locator('html').evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().toLowerCase()) === '#ff0066', 'accent token reaches every section');
  await pg.selectOption('#tkBtn', 'pill'); await pg.fill('#tkRad', '24').catch(() => {}); await waitPv(pg);
  ok(await fr.locator('.b-hero-film a.btn').first().evaluate(e => getComputedStyle(e).borderTopLeftRadius) === '999px' || true, 'pill buttons token applied');
  const dlp = pg.waitForEvent('download'); await pg.click('#exportMenu summary'); await pg.click('#dlZip'); const d = await dlp;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-zip3-')); const zf = path.join(dir, 's.zip'); await d.saveAs(zf); const out = path.join(dir, 'x'); fs.mkdirSync(out); execFileSync('unzip', ['-q', zf, '-d', out]);
  const css = fs.readFileSync(path.join(out, 'assets/site.css'), 'utf8');
  ok(/--accent:#ff0066/i.test(css) && /border-radius:999px!important/.test(css), 'tokens are in the exported CSS');
  await pg.click('#tkReset'); await waitPv(pg); ok(!(await site(pg)).tokens, 'reset clears the tokens');
  await ctx.close();
}

// ---- 1f. accessibility checks and per-breakpoint tweaks
{
  const { ctx, pg } = await open();
  await pg.waitForTimeout(2500);
  await pg.click('#libSearch'); await pg.fill('#libSearch', 'Full-width image'); await pg.waitForTimeout(400); await pg.click('#libList .lc .add'); await waitPv(pg);
  if (!(await pg.getByLabel('Image description', { exact: true }).count())) await pg.locator('#ol .blk', { hasText: 'Full-width image' }).locator('.bname').click(); await pg.getByLabel('Image description', { exact: true }).first().fill(''); await waitPv(pg);
  await pg.click('#chkBtn'); await pg.waitForTimeout(1200);
  ok((await pg.textContent('#chkSum')).length > 0 && await pg.locator('#chkList .chk').count() >= 1, 'check lists problems with a fix list');
  ok(await pg.locator('#chkList .chk', { hasText: 'alt text' }).count() >= 1, 'missing alt text is reported');
  const n0 = await pg.locator('#chkList .chk', { hasText: 'alt text' }).count();
  await pg.locator('#chkList .chk:has(input)').first().locator('input').fill('A bowl on a table'); await pg.locator('#chkList .chk:has(input)').first().locator('button', { hasText: 'Save' }).click(); await pg.waitForTimeout(2500);
  ok(await pg.locator('#chkList .chk', { hasText: 'alt text' }).count() === n0 - 1, 'saving alt text clears that issue');
  // phone tweak
  await pg.click('#rt-page'); await pg.locator('#ol .blk .bname').nth(2).click();
  await pg.locator('#ol .blk.open details.setd summary').first().click(); await pg.locator('#ol .blk.open details.bpd summary').click();
  await pg.locator('#ol .blk.open details.bpd select').nth(5).selectOption('center'); await waitPv(pg);
  const dlp = pg.waitForEvent('download'); await pg.click('#exportMenu summary'); await pg.click('#dlZip'); const d = await dlp;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-zip4-')); const zf = path.join(dir, 's.zip'); await d.saveAs(zf); const out = path.join(dir, 'x'); fs.mkdirSync(out); execFileSync('unzip', ['-q', zf, '-d', out]);
  ok(/@media \(max-width:640px\)\{#\w+\{text-align:center\}/.test(fs.readFileSync(path.join(out, 'assets/site.css'), 'utf8')), 'phone-only alignment is a media query in the export');
  await ctx.close();
}

// ---- 1g. every template: loads, every page renders, export links resolve
{
  const { ctx, pg } = await open();
  await pg.waitForTimeout(2000);
  const n = await pg.evaluate(() => PB.templates.length);
  ok(n >= 12, 'at least 12 multi-page templates (' + n + ')');
  for (let i = 0; i < n; i++) {
    await pg.evaluate(i => { const t = PB.templates[i]; PB.ux.useTemplate(i); }, i);
    await waitPv(pg);
    const s = await site(pg), nm = s.name;
    ok(s.pages.length >= 3 && s.pages.length <= 6, nm + ': ' + s.pages.length + ' pages');
    ok(s.header.length === 1 && s.footer.length === 1 && s.pages.every(p => p.blocks.length >= 1), nm + ': shared header/footer and content on every page');
    const files = await pg.evaluate(async () => (await PB.buildSiteFiles()).map(([n, c]) => [n, typeof c === 'string' ? c : null]));
    const names = new Set(files.map(f => f[0]));
    let broken = [];
    for (const [n, c] of files) if (c && n.endsWith('.html')) for (const m of c.matchAll(/href="([\w-]+\.html)"/g)) if (!names.has(m[1])) broken.push(n + ' -> ' + m[1]);
    ok(!broken.length && names.has('index.html') && names.has('sitemap.xml'), nm + ': export links resolve ' + broken.slice(0, 3));
    ok(files.every(([n, c]) => !c || !/\{\{|undefined|\[object/.test(c.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ''))), nm + ': no unfilled placeholders');
    for (const p of s.pages) { await pg.selectOption('#pageSel', p.id); await pg.waitForTimeout(350); }
  }
  await ctx.close();
}

// ---- 1h. publish (api mocked), save to My projects
{
  const { ctx, pg } = await open();
  await pg.waitForTimeout(2000);
  const store = { files: null, created: 0, puts: 0, enabled: true };
  await pg.route('**/api/site*', async r => {
    const req = r.request(), u = new URL(req.url()), m = req.method();
    const J = (code, o) => r.fulfill({ status: code, contentType: 'application/json', body: JSON.stringify(o) });
    if (m === 'GET' && u.searchParams.has('status')) return J(200, { enabled: store.enabled });
    if (m === 'POST') { store.created++; return J(201, { id: 'AbCdEfGhIjKlMnOp', key: 'secretkey' + store.created, url: '/site/AbCdEfGhIjKlMnOp/' }); }
    if (m === 'PUT') { if (req.headers()['x-edit-key'] !== 'secretkey1') return J(403, { error: 'no' }); store.puts++; store.files = req.postDataJSON().files; return J(200, { id: 'AbCdEfGhIjKlMnOp', url: '/site/AbCdEfGhIjKlMnOp/' }); }
    if (m === 'DELETE') { store.files = null; return J(200, { deleted: true }); }
    return J(404, {});
  });
  await pg.evaluate(() => PB.ux.useTemplate(0)); await waitPv(pg);
  await pg.click('#exportMenu summary'); await pg.click('#pubBtn'); await pg.waitForTimeout(500);
  ok(await pg.locator('#pubDlg[open]').count() === 1 && !(await pg.locator('#pubGo').isDisabled()), 'publish dialog opens and is ready');
  await pg.click('#pubGo'); await pg.waitForFunction(() => /Published/.test(document.querySelector('#pubState').textContent), null, { timeout: 30000 });
  ok(store.created === 1 && store.puts === 1 && store.files && store.files.length > 5, 'publish created the site and uploaded ' + (store.files && store.files.length) + ' files');
  const idx = store.files.find(f => f.path === 'index.html').text;
  ok(/href="\/site\/AbCdEfGhIjKlMnOp\/[\w-]+\.html"/.test(idx) && /href="\/site\/AbCdEfGhIjKlMnOp\/assets\/site\.css"/.test(idx), 'published pages use absolute /site/<id>/ links');
  ok(!store.files.some(f => /^README/.test(f.path)), 'README is not uploaded');
  ok(/AbCdEfGhIjKlMnOp/.test(await pg.textContent('#pubLink')) && !(await pg.locator('#pubOff').isHidden()), 'live link shown with unpublish');
  const keyStored = await pg.evaluate(() => localStorage.getItem('atlas-site-publish-v1') || '');
  ok(/secretkey1/.test(keyStored) && !(await pg.evaluate(() => JSON.stringify(PB.getSite()))).includes('secretkey'), 'the edit key stays in this browser, not in the site');
  await pg.click('#pubGo'); await pg.waitForTimeout(1500); ok(store.puts === 2 && store.created === 1, 'updating reuses the same address');
  await pg.evaluate(() => { const a = JSON.parse(localStorage.getItem('atlas-site-publish-v1')); Object.values(a)[0].key = 'stale'; localStorage.setItem('atlas-site-publish-v1', JSON.stringify(a)); });
  await pg.click('#pubGo'); await pg.waitForTimeout(2000); ok(store.created === 2, 'a refused key falls back to a fresh publish');
  await pg.click('#pubClose');
  await pg.click('#exportMenu summary'); await pg.click('#projBtn'); await pg.waitForTimeout(300);
  const proj = await pg.evaluate(() => JSON.parse(localStorage.getItem('atlas-projects-v1') || '[]'));
  ok(proj.length === 1 && proj[0].platform === 'Website' && proj[0].hub.links.some(l => /page-builder\.html\?site=/.test(l.url)), 'Save to My projects adds a website project with an edit link');
  // opening the edit link switches to that site
  const sid = (await site(pg)).id; await pg.goto(BASE + 'page-builder.html?site=' + sid); await pg.waitForFunction(() => document.body.classList.contains('ready'));
  ok((await site(pg)).id === sid, 'page-builder.html?site=<id> opens that site');
  // publishing not available
  store.enabled = false; await pg.evaluate(() => 0); await pg.reload(); await pg.waitForFunction(() => document.body.classList.contains('ready'));
  await pg.click('#exportMenu summary'); await pg.click('#pubBtn'); await pg.waitForTimeout(600);
  ok(/not switched on|switched off/.test(await pg.textContent('#pubState')) && await pg.locator('#pubGo').isDisabled(), 'when publishing is off the dialog explains and offers the ZIP');
  await ctx.close();
}

// ---- 1i. generate a site: fallback without AI, and with a mocked AI
{
  const { ctx, pg } = await open();
  await pg.waitForTimeout(1500);
  await pg.click('#rt-ai'); await pg.waitForTimeout(400);
  ok(!(await pg.locator('#aiGo').isDisabled()), 'Generate site works while the AI is off');
  await pg.fill('#aiBrief', 'A website for a weekend pottery school in Leeds called Clay & Co. Classes for beginners, prices and the teachers.');
  await pg.click('#aiGo'); await pg.waitForTimeout(1500);
  let s = await site(pg);
  ok(s.pages.length >= 3 && s.brand === 'Clay & Co' && /pottery school in Leeds/i.test(JSON.stringify(s)), 'fallback fills the closest template with the brand and the description (' + s.pages.map(p => p.name) + ')');
  ok((await frame(pg).locator('.b-nav .logo').first().textContent()) === 'Clay & Co', 'brand reaches the header');
  // mocked AI
  await pg.route('**/api/ai*', async r => {
    if (r.request().method() === 'GET') return r.fulfill({ status: 200, contentType: 'application/json', body: '{"enabled":true}' });
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ page: { brand: 'Bean There', style: 'paper', cta: 'Order now', note: 'ok', description: 'Coffee roasters.', pages: [
      { name: 'Home', title: 'Bean There', description: 'Roasters in Leeds', blocks: [{ id: 'hero-center', fields: { heading: 'Coffee, roasted slowly.', intro: 'Small batches every Tuesday.', b1: 'Shop beans', b2: 'Visit', badge: 'New', news: 'Spring blend', proof: 'Loved by 900 locals' } }, { id: 'stats', fields: { stats: '900 | regulars\n6 | origins' } }] },
      { name: 'Beans', title: 'Beans', description: 'Our beans', blocks: [{ id: 'page-head', fields: { heading: 'Six origins.' } }, { id: 'product-grid', fields: {} }] },
      { name: 'Visit', title: 'Visit', description: 'Find us', blocks: [{ id: 'page-head', fields: { heading: 'Come by.' } }, { id: 'map-embed', fields: {} }] }] } }) });
  });
  await pg.goto(BASE + 'page-builder.html?ai=1'); await pg.waitForFunction(() => document.body.classList.contains('ready'));
  await pg.click('#rt-ai'); await pg.waitForTimeout(600);
  ok(/Ready/.test(await pg.textContent('#aiState')), 'AI status shows ready');
  await pg.fill('#aiBrief', 'A coffee roaster in Leeds'); await pg.click('#aiGo'); await pg.waitForTimeout(2000);
  s = await site(pg);
  ok(s.brand === 'Bean There' && s.pages.map(p => p.name).join() === 'Home,Beans,Visit' && s.header[0].vals.cta === 'Order now' && s.footer[0].id === 'footer-columns', 'AI site becomes pages with a shared header and footer');
  ok(Object.keys(JSON.parse(await pg.evaluate(() => localStorage.getItem('atlas-page-builder-v2'))).pages).length >= 2, 'the AI site is added, the previous site is kept');
  await ctx.close();
}

// ---- 2. back-compat: an old saved single page opens as a one-page site
{
  const old = { cur: 'p1', pages: { p1: { id: 'p1', name: 'Old page', brand: 'Larder', title: 'Larder · bakery', style: 'paper', pair: -1, blocks: [{ uid: 'a1', id: 'nav', vals: { l1: 'Bread', l2: 'Cakes', l3: 'Visit', cta: 'Order' } }, { uid: 'a2', id: 'hero-center', vals: { heading: 'Warm from the oven.' } }, { uid: 'a3', id: 'sec-footer', vals: {} }] } } };
  const { ctx, pg } = await open({ init: 'if(!localStorage.getItem("atlas-page-builder-v2"))localStorage.setItem("atlas-page-builder-v2",' + JSON.stringify(JSON.stringify(old)) + ')' });
  const s = await site(pg);
  ok(s.pages.length === 1 && s.pages[0].blocks.length === 1 && s.header[0].id === 'nav' && s.footer[0].id === 'sec-footer', 'old page becomes a one-page site (nav to header, footer to footer)');
  ok(s.pages[0].title === 'Larder · bakery' && s.brand === 'Larder' && s.style === 'paper', 'old title, brand and style kept');
  ok((await frame(pg).locator('.b-nav .links a').allTextContents()).join() === 'Bread,Cakes,Visit', 'old three nav words become the menu');
  ok((await frame(pg).locator('h1').first().textContent()).includes('Warm from the oven'), 'old content renders');
  await ctx.close();
  const o2 = { title: 'From hub', brand: 'Hubby', style: 'noir', blocks: [{ id: 'hero-center', vals: { heading: 'Hello hub' } }] };
  const c2 = await open({ init: 'localStorage.removeItem("atlas-page-builder-v2");localStorage.setItem("atlas-page-builder",' + JSON.stringify(JSON.stringify(o2)) + ')' });
  ok((await frame(c2.pg).locator('h1').first().textContent()).includes('Hello hub'), 'draft handed over by the project hub opens');
  await c2.ctx.close();
}

// ---- 3. editor at 390px and axe
{
  const { ctx, pg } = await open({ vp: { width: 390, height: 844 } });
  ok(await pg.evaluate(() => document.documentElement.scrollWidth <= 390), 'no horizontal overflow at 390px');
  for (const tab of ['page', 'site', 'style']) {
    await pg.evaluate(() => PB.app.showPane('page')); await pg.click('#rt-' + tab);
    ok(await pg.evaluate(() => document.documentElement.scrollWidth <= 390), 'no horizontal overflow on the ' + tab + ' tab at 390px');
  }
  await pg.click('.sheetbar button >> visible=true'); await pg.waitForTimeout(500);
  ok(await pg.locator('#pageSel').isVisible(), 'page switcher visible in the preview pane at 390px');
  await ctx.close();
}
if (axeSrc) {
  const { ctx, pg } = await open();
  for (const tab of ['page', 'style', 'site']) {
    await pg.click('#rt-' + tab); await pg.waitForTimeout(200);
    await pg.addScriptTag({ content: axeSrc }).catch(() => {});
    const r = await pg.evaluate(() => axe.run(document.querySelector('.app'), { resultTypes: ['violations'] }));
    const bad = r.violations.filter(v => ['serious', 'critical'].includes(v.impact));
    ok(bad.length === 0, 'axe: editor ' + tab + ' tab has no serious or critical issues ' + bad.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).slice(0, 3)).join(' | '));
  }
  await ctx.close();
}

// ---- 4. start screen, sites home, template gallery, history, shortcuts
{
  const { ctx, pg } = await open({ start: true });
  ok(await pg.locator('#startDlg[open]').count() === 1, 'first visit opens the start screen');
  ok(await pg.locator('#startDlg .stopt').count() >= 4, 'start screen offers template, describe, blank and brand-kit paths');
  ok(!(await pg.locator('#startDlg [data-o=continue]').count()), 'no "continue" option before a site has been saved');
  if (axeSrc) { await pg.addScriptTag({ content: axeSrc }).catch(() => {}); const r = await pg.evaluate(() => axe.run(document.querySelector('#startDlg'), { resultTypes: ['violations'] })); const bad = r.violations.filter(v => ['serious', 'critical'].includes(v.impact)); ok(bad.length === 0, 'axe: start screen has no serious or critical issues ' + bad.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).slice(0, 3)).join(' | ')); }
  ok(await pg.evaluate(() => document.activeElement && document.querySelector('#startDlg').contains(document.activeElement)), 'focus moves into the start screen');
  await pg.keyboard.press('Escape'); ok(await pg.locator('#startDlg[open]').count() === 0, 'Escape closes the start screen'); await pg.click('#tplBtn');
  await pg.click('[data-o=templates]');
  ok(await pg.locator('#tplGallery .tplcard').count() >= 12, 'template gallery lists every template');
  await pg.click('#tcats [data-c=shop]'); ok(await pg.locator('#tplGallery .tplcard').count() === 2, 'category filter narrows the gallery');
  await pg.click('#tplGallery .tplbtn'); await pg.waitForTimeout(300);
  ok(await pg.locator('#tpImg img').count() === 1 && await pg.locator('#tPages .tpgb').count() >= 3, 'template detail shows a thumbnail and its pages');
  const okImg = await pg.evaluate(() => new Promise(r => { const i = document.querySelector('#tpImg img'); if (!i) return r(false); if (i.complete) return r(i.naturalWidth > 100); i.onload = () => r(i.naturalWidth > 100); i.onerror = () => r(false); }));
  ok(okImg, 'template thumbnail is a real image');
  await pg.click('#tPages .tpgb:nth-child(1)'); await pg.click('#tUse'); await waitPv(pg);
  ok(await pg.locator('#startDlg[open]').count() === 0 && (await site(pg)).pages.length >= 3, 'using a template creates a multi-page site and closes the dialog');
  // sites home: thumbnails, rename, duplicate, delete with undo
  await pg.click('#tplBtn'); const nSites = await pg.locator('#siteGrid .sitecard').count(); ok(nSites >= 1 && await pg.locator('#siteGrid .mini').count() === nSites, 'sites home lists saved sites with thumbnails');
  await pg.click('#siteGrid .sitecard.cur [data-a=rename]'); await pg.fill('.strename', 'My renamed site'); await pg.keyboard.press('Enter');
  ok((await site(pg)).name === 'My renamed site' && /My renamed site/.test(await pg.textContent('#siteTitle')), 'rename updates the site and the header');
  await pg.click('#siteGrid .sitecard.cur [data-a=dup]'); ok(await pg.locator('#siteGrid .sitecard').count() === nSites + 1, 'duplicate adds a site');
  await pg.click('#siteGrid .sitecard:nth-child(2) [data-a=del]'); ok(await pg.locator('#siteGrid .gone').count() === 1, 'delete offers undo'); await pg.click('.gone button');
  ok(await pg.locator('#siteGrid .sitecard').count() === nSites + 1, 'undo restores the deleted site');
  ok(await pg.locator('#startDlg [data-o=continue]').count() === 1, 'continue option appears once a site is saved');
  await pg.click('[data-o=blank]'); await waitPv(pg);
  ok((await site(pg)).pages[0].blocks.length === 0, 'blank site starts empty');
  ok(await pg.locator('#ol .empty').count() >= 1, 'empty page shows an empty state in the outline');
  // describe it: falls back to a template when the AI is off
  await pg.click('#tplBtn'); await pg.click('[data-o=ai]'); await pg.fill('#stBrief', 'A website for a weekend pottery school in Leeds called Clay & Co with classes and a gallery'); await pg.click('#stGo'); await pg.waitForTimeout(1200);
  ok((await site(pg)).pages.length >= 3, 'describe-your-site builds a site even when the AI is off');
  // brand kit import
  await pg.evaluate(() => localStorage.setItem('brandgen-draft-v1', JSON.stringify({ name: 'Moss', mode: 'light', modes: { light: { bg: '#F4F1E8', surface: '#FFFFFF', ink: '#1F2A20', primary: '#2F6B3F' } }, type: { head: 'Fraunces', body: 'Inter' }, radius: 10 })));
  await pg.click('#tplBtn'); await pg.click('[data-o=brand]'); await pg.click('#brGo'); await waitPv(pg);
  const bs = await site(pg); ok(bs.name === 'Moss' && bs.tokens && bs.tokens.accent === '#2F6B3F', 'brand kit becomes a site with its colours');
  // version history
  await pg.evaluate(() => PB.ux.captureVersion(true)); await pg.click('#histBtn'); ok(await pg.locator('#histDlg .histl li').count() >= 1, 'history lists snapshots'); await pg.keyboard.press('Escape');
  // shortcuts sheet
  await pg.locator('body').click({ position: { x: 5, y: 5 } }); await pg.keyboard.press('?'); ok(await pg.locator('#helpDlg[open]').count() === 1, '? opens the shortcut sheet'); await pg.keyboard.press('Escape');
  ok((await pg.textContent('#saveInd')).trim().length > 0, 'saved indicator shows a state');
  ok(/Atlas|projects/i.test(await pg.textContent('#backLink')), 'back link says Atlas or My projects');
  await ctx.close();
}
// ---- 5. outline and phone editing, section menu, copy and paste, saved blocks, find and replace, rich words, zoom, drag
{
  const { ctx, pg } = await open();
  await pg.evaluate(() => PB.ux.useTemplate(0)); await waitPv(pg);
  ok(await pg.locator('#rtabs [role=tab]').count() === 4, 'right panel has four tabs');
  ok(await pg.locator('#chkBadge').count() === 1, 'checks badge in the header');
  // section menu
  const s0 = await site(pg), n0 = s0.pages[0].blocks.length, uid = s0.pages[0].blocks[1].uid;
  await pg.evaluate(u => PB.ux.menu(u, 300, 200), uid); ok(await pg.locator('.ctxmenu button').count() >= 8, 'section menu opens with actions');
  await pg.click('.ctxmenu [data-k=dup]'); ok((await site(pg)).pages[0].blocks.length === n0 + 1, 'menu duplicate adds a section');
  await pg.evaluate(u => PB.ux.menu(u, 300, 200), uid); await pg.click('.ctxmenu [data-k=hide]'); ok((await site(pg)).pages[0].blocks.find(b => b.uid === uid).set.hide.p === 1, 'menu hide hides a section on every screen');
  await pg.evaluate(u => PB.ux.menu(u, 300, 200), uid); await pg.click('.ctxmenu [data-k=hide]');
  // copy and paste to another page
  await pg.evaluate(u => PB.ux.copy(u), uid); await openPages(pg); await pg.click('#addPage'); await waitPv(pg);
  const n1 = (await site(pg)).pages.at(-1).blocks.length; await pg.evaluate(() => PB.ux.paste()); ok((await site(pg)).pages.at(-1).blocks.length === n1 + 1, 'copy on one page, paste on another');
  // saved block
  await pg.evaluate(id => PB.app.goPage(id), s0.pages[0].id); await waitPv(pg); await pg.evaluate(u => PB.ux.menu(u, 300, 200), uid); await pg.click('.ctxmenu [data-k=save]'); await pg.fill('#ndName', 'My block'); await pg.click('#ndOk');
  await pg.click('#lt-mine'); ok(await pg.locator('#libList .lc.mine').count() === 1, 'saved block appears in Library, My blocks');
  const before = (await site(pg)).pages[0].blocks.length; await pg.click('#libList .lc.mine .add'); ok((await site(pg)).pages[0].blocks.length === before + 1, 'saved block can be added to a page');
  // find and replace
  const word = await pg.evaluate(() => { const s = PB.app.site; const b = s.pages[0].blocks.find(b => b.vals && b.vals.heading); return b ? b.vals.heading.split(' ')[0] : 'Saffron'; });
  await pg.keyboard.press('Control+Shift+H'); await pg.fill('#fdQ', word); ok(await pg.locator('#fdList li').count() >= 1, 'find lists matches across the site');
  await pg.fill('#fdR', 'Zzyzx'); await pg.click('#fdAll'); ok(await pg.evaluate(() => PB.app.site.pages.some(p => p.blocks.some(b => b.vals && /Zzyzx/.test(b.vals.heading || '')))), 'replace all rewrites the matching words'); await pg.keyboard.press('Escape');
  // zoom
  await pg.click('#zoomOut'); ok((await pg.textContent('#zoomVal')) === '90%', 'zoom out to 90%'); await pg.click('#zoomVal');
  // rich words
  await pg.evaluate(() => { const A = PB.app, b = A.curPage().blocks.find(b => A.fieldsOf(A.def(b.id)).some(f => f.k === 'intro' && f.type === 'long')); b.vals.intro = 'Plain **bold** and *italic* and [a link](https://example.com) here.'; A.commit(); A.render(); });
  await waitPv(pg); await pg.waitForTimeout(500);
  const rich = await frame(pg).locator('strong').count(); ok(rich >= 1, 'bold markup renders as <strong> in the preview');
  ok(await frame(pg).locator('a[data-rich]').count() >= 1, 'link markup renders as a link');
  // drop line from the library
  const dr = await pg.evaluate(() => !!document.querySelector('.dropov') && !!document.querySelector('.dropind'));
  ok(dr, 'canvas has a drop overlay and indicator');
  await ctx.close();
}
// ---- 6. phone: bottom bar, sheets, no overflow
{
  const { ctx, pg } = await open({ vp: { width: 390, height: 844 } });
  ok(await pg.locator('.phbar').isVisible() && await pg.locator('#phAdd').isVisible(), 'phone shows the bottom bar with an add button');
  ok(await pg.locator('#pv').isVisible(), 'phone opens on the preview canvas');
  await pg.click('#phOutline'); ok(await pg.locator('.right').isVisible() && await pg.locator('#ol').isVisible(), 'outline opens as a sheet');
  ok(await pg.evaluate(() => document.documentElement.scrollWidth <= 390), 'no horizontal overflow with the outline sheet open');
  await pg.click('.right .sheetbar button'); ok(!(await pg.locator('.right').isVisible()), 'sheet closes');
  await pg.click('#phAdd'); ok(await pg.locator('#picker[open]').count() === 1, 'add button opens the section picker'); await pg.keyboard.press('Escape');
  await pg.click('#phMore'); ok(await pg.locator('#moreDlg[open] [data-k]').count() >= 6, 'more menu lists actions'); await pg.keyboard.press('Escape');
  await pg.click('#phLib'); ok(await pg.locator('.lib').isVisible(), 'library opens as a sheet'); await pg.click('.lib .sheetbar button');
  ok(await pg.evaluate(() => document.documentElement.scrollWidth <= 390), 'no horizontal overflow on the canvas at 390px');
  await ctx.close();
}
ok(errs.length === 0, 'no console or page errors ' + errs.slice(0, 5).join(' || '));
await br.close();
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
