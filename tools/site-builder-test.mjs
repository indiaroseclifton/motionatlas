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
  return { ctx, pg };
}
const site = pg => pg.evaluate(() => JSON.parse(JSON.stringify(PB.getSite())));
const frame = pg => pg.frameLocator('#pv');
const waitPv = pg => pg.waitForTimeout(700);

// ---- 1. multi-page create and edit
{
  const { ctx, pg } = await open();
  let s = await site(pg);
  ok(s.pages.length === 1 && s.header.length === 1 && s.footer.length === 1, 'default site has one page with a shared header and footer');
  await pg.click('#rt-pages'); await pg.click('#addPage'); await waitPv(pg);
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
  ok(await pg.inputValue('#pageSel') === (await site(pg)).pages[2].id, 'clicking a menu link in the preview opens that page');
  // hide from the menu
  await pg.click('#rt-pages'); await pg.uncheck('#pgNav'); await waitPv(pg);
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
  await pg.click('#rt-pages'); await pg.click('.pgrow:nth-child(1) .pgname'); await pg.fill('#ptitle', 'Pottery Co | Classes'); await pg.fill('#pgDesc', 'Learn wheel throwing.'); await waitPv(pg);
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
  for (const tab of ['page', 'pages', 'site', 'style']) {
    await pg.click('#panes [data-p=page]'); await pg.click('#rt-' + tab);
    ok(await pg.evaluate(() => document.documentElement.scrollWidth <= 390), 'no horizontal overflow on the ' + tab + ' tab at 390px');
  }
  await pg.click('#panes [data-p=preview]'); await pg.waitForTimeout(500);
  ok(await pg.locator('#pageSel').isVisible(), 'page switcher visible in the preview pane at 390px');
  await ctx.close();
}
if (axeSrc) {
  const { ctx, pg } = await open();
  for (const tab of ['page', 'pages', 'site']) {
    await pg.click('#rt-' + tab); await pg.waitForTimeout(200);
    await pg.addScriptTag({ content: axeSrc }).catch(() => {});
    const r = await pg.evaluate(() => axe.run(document.querySelector('.app'), { resultTypes: ['violations'] }));
    const bad = r.violations.filter(v => ['serious', 'critical'].includes(v.impact));
    ok(bad.length === 0, 'axe: editor ' + tab + ' tab has no serious or critical issues ' + bad.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).slice(0, 3)).join(' | '));
  }
  await ctx.close();
}
ok(errs.length === 0, 'no console or page errors ' + errs.slice(0, 5).join(' || '));
await br.close();
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
