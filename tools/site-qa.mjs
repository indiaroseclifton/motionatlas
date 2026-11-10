/* Whole-site QA crawl.
   Usage:  node tools/site-qa.mjs [--base http://localhost:8798/] [--only substr] [--vp desktop|phone|both]
                                  [--no-axe] [--demos] [--out report.json] [--strict]
   Needs a static server on site/ and playwright + axe-core resolvable (PW_DIR, default /tmp/claude-0/pw).
   Pages come from site/sitemap.xml, every href in atlas-nav.js, every tool in tools-data.js and the ds/ pages.
   For each page at 1440x900 and 390x844 it reports:
     console errors / page errors, failed requests (4xx/5xx, request failures), horizontal overflow,
     broken images and videos, missing <title>, meta description, OG tags and favicon, axe serious/critical,
     headline numbers that disagree with site/counts.json (run tools/site-counts.mjs to refresh it), dead internal links.
   Exit code 1 when anything is found and --strict is given (always 0 otherwise). */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const req = createRequire((process.env.PW_DIR || '/tmp/claude-0/pw') + '/x.js');
const { chromium } = req('playwright');
const axeSrc = fs.readFileSync(req.resolve('axe-core/axe.min.js'), 'utf8');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const base = String(arg('base', 'http://localhost:8798/')).replace(/\/?$/, '/');
const only = arg('only', ''), vpSel = arg('vp', 'both'), noAxe = !!arg('no-axe', false), demos = !!arg('demos', false), strict = !!arg('strict', false), out = arg('out', '');
const CONC = Number(arg('jobs', 3));

/* ---------- page list ---------- */
const pages = new Set();
const add = p => { p = p.replace(/^\//, ''); if (p) pages.add(p); };
const sm = fs.existsSync(path.join(root, 'sitemap.xml')) ? fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8') : '';
for (const m of sm.matchAll(/<loc>https?:\/\/[^/]+\/?([^<]*)<\/loc>/g)) { let p = m[1]; if (!p) p = 'atlas.html'; else if (!/\.\w+$/.test(p.split('#')[0]) && !p.includes('#')) p += '.html'; add(p); }
const nav = fs.readFileSync(path.join(root, 'site-nav-data.js'), 'utf8');
for (const m of nav.matchAll(/\['([^']+)','[^']+','[^']*','[a-z0-9-]+'\]/g)) { const h = m[1]; add(h.startsWith('#') ? 'atlas.html' + h : h); }
{ const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(root, 'tools-data.js'), 'utf8'), ctx); for (const t of ctx.window.ATLAS_TOOLS.list) add(t.href); }
for (const f of fs.readdirSync(path.join(root, 'studies'))) if (f.endsWith('.html')) add('studies/' + f);
add('work/djinyc/home.html');
for (const f of ['account.html', 'shared.html', 'p.html']) if (fs.existsSync(path.join(root, f))) add(f);
if (demos) for (const f of fs.readdirSync(path.join(root, 'interactions/demos'))) if (f.endsWith('.html')) add('interactions/demos/' + f);
let list = [...pages].filter(p => !only || p.includes(only));
/* pages that are embedded views or app shells: not held to the meta requirements */
const META_EXEMPT = /^(interactions\/demos\/|shared\.html|p\.html|work\/)/;
const NUMBER_EXEMPT = /^(ds\/|work\/)/; // the 01 design-system docs and sample work quote their own numbers

const counts = fs.existsSync(path.join(root, 'counts.json')) ? JSON.parse(fs.readFileSync(path.join(root, 'counts.json'), 'utf8')) : {};
const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const wordNum = w => { const p = w.toLowerCase().split('-'); let n = 0; for (const x of p) { if (!(x in WORDS)) return null; n += WORDS[x]; } return n; };
const NUM = '(\\d[\\d,]*|(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:-(?:one|two|three|four|five|six|seven|eight|nine))?|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)';
const TERMS = [
  ['siteTemplates', '(?:site )?templates'], ['photos', 'photographs|photos'], ['icons', 'searchable icons|open-source icons|icons in'], ['iconFamilies', 'families'],
  ['chartTypes', 'chart (?:forms|types)'], ['diagramTypes', 'diagram types'], ['effects', '(?:modern |landing[- ]page )?techniques'], ['kits', '(?:theme )?kits'],
  ['systems', '(?:design |web )?systems'], ['components', '(?:native |UI )?components'], ['artStyles', 'art styles'], ['filmLooks', 'film looks'],
  ['extractedAssets', 'extracted assets|fragments'], ['siteSections', 'sections'], ['entries', 'entries|specimens']
];
function numberIssues(text) {
  const bad = [];
  for (const [key, noun] of TERMS) {
    if (counts[key] == null) continue;
    const re = new RegExp('(?<![\\w.])' + NUM + '[ \\u00a0]+(?:' + noun + ')\\b', 'gi');
    for (const m of text.matchAll(re)) {
      const raw = m[1]; const n = /^\d/.test(raw) ? Number(raw.replace(/,/g, '')) : wordNum(raw);
      if (n == null || n === counts[key]) continue;
      /* small numbers are usually about a selection ("12 sections in this site", "3 components"), skip them */
      if (n < 20) continue;
      if (key === 'icons' && n < 500) continue;
      bad.push(`${raw} ${m[0].slice(raw.length).trim()} (data says ${counts[key]} ${key})`);
    }
  }
  return [...new Set(bad)];
}

/* ---------- crawl ---------- */
const br = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const VPS = { desktop: { width: 1440, height: 900 }, phone: { width: 390, height: 844 } };
const vpNames = vpSel === 'both' ? ['desktop', 'phone'] : [vpSel];
const linkCache = new Map();
async function linkOk(u) {
  if (linkCache.has(u)) return linkCache.get(u);
  let ok = false;
  try { for (const c of [u, u.replace(/\/?$/, '.html')]) { const r = await fetch(c, { method: 'GET' }); if (r.status < 400) { ok = true; break; } } } catch { }
  linkCache.set(u, ok); return ok;
}
const IGNORE_REQ = /fonts\.(googleapis|gstatic)\.com|google-analytics|googletagmanager|mtalk\.google|supabase\.co|vercel-scripts|\/_vercel\/|\/api\//;
const IGNORE_CONSOLE = /Failed to load resource|favicon|ERR_(BLOCKED|NAME_NOT_RESOLVED|TUNNEL|CONNECTION|INTERNET|PROXY)|supabase|net::|GPU stall|WebGL|swiftshader|Automatic fallback to software WebGL/i;
async function audit(url, vpName, pageId) {
  const ctx = await br.newContext({ viewport: VPS[vpName], serviceWorkers: 'block', reducedMotion: 'reduce', deviceScaleFactor: 1, isMobile: vpName === 'phone', hasTouch: vpName === 'phone' });
  const pg = await ctx.newPage(); const r = { page: pageId, vp: vpName, issues: [] };
  const issue = (k, m) => r.issues.push({ kind: k, msg: m });
  pg.on('pageerror', e => issue('pageerror', e.message.slice(0, 200)));
  pg.on('console', m => { if (m.type() === 'error' && !IGNORE_CONSOLE.test(m.text())) issue('console', m.text().slice(0, 200)); });
  pg.on('response', res => { const u = res.url(); if (res.status() >= 400 && !IGNORE_REQ.test(u) && u.startsWith(base)) issue('http' + res.status(), u.replace(base, '')); });
  pg.on('requestfailed', q => { const u = q.url(); const f = q.failure()?.errorText || ''; if (!IGNORE_REQ.test(u) && u.startsWith(base) && !/ABORTED/.test(f)) issue('reqfail', u.replace(base, '') + ' ' + f); });
  try {
    await pg.goto(base + url + (url === 'page-builder.html' ? '?nostart=1' : ''), { waitUntil: 'load', timeout: 45000 });
    await pg.waitForTimeout(2200);
    /* scroll through the page so lazy images and sections load */
    await pg.evaluate(async () => { const h = Math.min(document.documentElement.scrollHeight, 9000); for (let y = 0; y < h; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); } scrollTo(0, 0); });
    await pg.waitForTimeout(900);
    const info = await pg.evaluate(() => {
      const q = s => document.querySelector(s);
      const meta = n => (q(`meta[name="${n}"]`) || q(`meta[property="${n}"]`))?.content || '';
      const vw = innerWidth; const wide = document.documentElement.scrollWidth > vw + 1;
      let culprits = [];
      if (wide) culprits = [...document.querySelectorAll('body *')].filter(e => { const b = e.getBoundingClientRect(); return b.right > vw + 1 && b.width > 0 && getComputedStyle(e).position !== 'fixed' && !e.closest('[hidden],dialog:not([open])'); }).slice(0, 3).map(e => (e.tagName + '.' + String(e.className).slice(0, 30)).toLowerCase());
      const imgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.currentSrc && !i.closest('[hidden]')).map(i => i.currentSrc.slice(-70));
      const vids = [...document.querySelectorAll('video')].filter(v => v.error).map(v => (v.currentSrc || v.src || '?').slice(-60));
      const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h && !/^(#|mailto:|tel:|javascript:|data:|blob:|https?:)/.test(h));
      return { title: document.title, desc: meta('description'), ogt: meta('og:title'), ogd: meta('og:description'), ogi: meta('og:image'), icon: !!q('link[rel~="icon"]'), wide, culprits, imgs, vids, links: [...new Set(links)], text: document.body.innerText.slice(0, 120000) + ' ' + meta('description') };
    });
    if (!info.title || /^\s*$/.test(info.title)) issue('meta', 'missing <title>');
    if (!META_EXEMPT.test(pageId)) {
      if (!info.desc) issue('meta', 'missing meta description');
      if (!info.ogt || !info.ogd) issue('meta', 'missing og:title/og:description');
      if (!info.ogi) issue('meta', 'missing og:image');
      if (!info.icon) issue('meta', 'missing favicon link');
    }
    /* the constant top bar: present, correct current marker, stays at the top while scrolling, does not cover content, links resolve */
    const bar = await pg.evaluate(async () => {
      const b = document.getElementById('sbar'); if (!b) return { missing: true };
      const r0 = b.getBoundingClientRect(); const cur = [...document.querySelectorAll('#sbar [aria-current=page], .sbPanel [aria-current=page], #sbar .sbHere')].map(e => (e.getAttribute('href') || e.textContent).slice(0, 40));
      const probe = document.elementFromPoint(r0.left + r0.width / 2, r0.top + r0.height / 2); const sees = !!(probe && probe.closest('#sbar'));
      const hs = [...document.querySelectorAll('h1')].filter(h => h.getBoundingClientRect().height && getComputedStyle(h).position !== 'fixed' && !h.closest('.sbPanel,dialog')); const under = hs.length && hs[0].getBoundingClientRect().top < r0.height - 2 && hs[0].getBoundingClientRect().bottom > 0;
      const hrefs = [...document.querySelectorAll('.sbar a[href], .sbPanel a[href]')].map(a => a.href);
      scrollTo(0, 1500); await new Promise(r => setTimeout(r, 350)); const r1 = b.getBoundingClientRect(); const probe2 = document.elementFromPoint(r1.left + r1.width / 2, r1.top + r1.height / 2); const stays = r1.top === 0 && r1.height > 30 && !!(probe2 && probe2.closest('#sbar'));
      scrollTo(0, 0); return { cur, sees, under, stays, hrefs: [...new Set(hrefs)], h: r0.height, top: r0.top };
    });
    if (bar.missing) issue('bar', 'constant top bar is missing');
    else {
      if (!bar.sees) issue('bar', 'the bar is covered by other content');
      if (!bar.stays && (info.text.length > 0) && true) { const tall = await pg.evaluate(() => document.documentElement.scrollHeight > innerHeight + 1500 || document.documentElement.scrollHeight > innerHeight + 100); if (tall) issue('bar', 'the bar does not stay at the top while scrolling'); }
      if (bar.under) issue('bar', 'page heading sits under the bar');
      if (!bar.cur.length && !/^(account|shared|p|studies\/|work\/|ds\/)/.test(pageId) ) issue('bar', 'no current-page marker in the bar');
      for (const h of bar.hrefs) { const t = new URL(h); t.hash = ''; if (!t.href.startsWith(base)) continue; if (!(await linkOk(t.href))) issue('deadlink', 'bar link ' + h); }
    }
    if (info.wide) issue('overflow', 'horizontal overflow: ' + info.culprits.join(', '));
    for (const i of info.imgs) issue('image', 'broken image ' + i);
    for (const v of info.vids) issue('video', 'video error ' + v);
    if (!NUMBER_EXEMPT.test(pageId)) for (const n of numberIssues(info.text)) issue('number', n);
    const here = new URL(base + url);
    for (const h of info.links) { let t; try { t = new URL(h, here); } catch { continue; } if (!t.href.startsWith(base)) continue; t.hash = ''; if (!(await linkOk(t.href.split('?')[0]))) issue('deadlink', h); }
    if (!noAxe) {
      await pg.evaluate(axeSrc);
      const res = await pg.evaluate(async () => { try { const r = await axe.run(document, { resultTypes: ['violations'], runOnly: ['wcag2a', 'wcag2aa', 'best-practice'] }); return r.violations.filter(v => v.impact === 'serious' || v.impact === 'critical').map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes[0]?.target?.join(' ').slice(0, 80) })); } catch (e) { return [{ id: 'axe-error', impact: 'n/a', n: 0, sample: String(e).slice(0, 80) }]; } });
      for (const v of res) issue('axe', `${v.id} (${v.impact}, ${v.n}) ${v.sample}`);
    }
  } catch (e) { issue('load', String(e.message).slice(0, 160)); }
  await ctx.close(); return r;
}

/* ---------- menu behaviour (once, on the Tools page): fits the viewport, groups expand, keyboard works, phone accordion ---------- */
async function menuTests() {
  const out = []; const bad = m => out.push({ kind: 'menu', msg: m });
  for (const vpName of vpNames) {
    const ctx = await br.newContext({ viewport: VPS[vpName], serviceWorkers: 'block', reducedMotion: 'reduce', isMobile: vpName === 'phone', hasTouch: vpName === 'phone' });
    const pg = await ctx.newPage(); await pg.goto(base + 'tools.html'); await pg.waitForTimeout(1500);
    if (vpName === 'desktop') {
      const top = await pg.evaluate(() => [...document.querySelectorAll('#sbar .sbTop, #sbar .sbSearch')].filter(e => e.offsetParent).length);
      if (top > 5) bad(`desktop bar shows ${top} items (max 5)`);
      for (const k of ['lib', 'make', 'studio']) {
        await pg.click(`.sbTop[data-m=${k}]`); await pg.waitForTimeout(150);
        const m = await pg.evaluate(k => { const p = document.getElementById('sbP-' + k); const r = p.getBoundingClientRect(); return { fits: r.bottom <= innerHeight && r.top >= 0, h: r.height, rows: [...p.querySelectorAll('a')].filter(a => a.offsetParent).length, expanded: p.querySelectorAll('.sbG').length }; }, k);
        if (!m.fits) bad(`${k} menu does not fit the viewport (${Math.round(m.h)}px)`);
        if (m.rows > 8) bad(`${k} menu shows ${m.rows} rows at once (max 8)`);
        if (m.expanded > 1) { const before = await pg.evaluate(k => document.querySelector(`#sbP-${k} .sbGr ul:not([hidden])`).id, k); await pg.click(`#sbP-${k} .sbG:nth-child(1) >> nth=1`).catch(() => { }); await pg.locator(`#sbP-${k} .sbG`).nth(1).click(); const after = await pg.evaluate(k => document.querySelector(`#sbP-${k} .sbGr ul:not([hidden])`).id, k); if (before === after) bad(`${k} menu: clicking a group does not expand it`); }
        await pg.keyboard.press('Escape'); if (await pg.evaluate(k => !document.getElementById('sbP-' + k).hidden, k)) bad(`${k} menu: Esc does not close`);
      }
      await pg.focus('.sbTop[data-m=lib]'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(100);
      if (!await pg.evaluate(() => document.querySelector('.sbTop[data-m=lib]').getAttribute('aria-expanded') === 'true')) bad('Library: Enter does not open the menu');
      await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('ArrowRight');
      if (!await pg.evaluate(() => document.activeElement && document.activeElement.closest('.sbGr'))) bad('Library: arrow keys do not reach the item list');
      await pg.keyboard.press('Escape'); if (!await pg.evaluate(() => document.activeElement === document.querySelector('.sbTop[data-m=lib]'))) bad('Library: Esc does not return focus to the button');
    } else {
      await pg.click('.sbMenuBtn'); await pg.waitForTimeout(150);
      const m = await pg.evaluate(() => { const p = document.getElementById('sbP-menu'); const openN = p.querySelectorAll('.sbAcc > button[aria-expanded=true]').length; return { openN, vis: [...p.querySelectorAll('a')].filter(a => a.offsetParent).length, h: p.scrollHeight, groups: p.querySelectorAll('.sbAcc').length, search: !!p.querySelector('.sbSheetSearch') }; });
      if (m.openN !== 1) bad(`phone sheet has ${m.openN} groups open (want 1)`);
      if (m.h > 1200) bad(`phone sheet is ${m.h}px tall collapsed`);
      if (!m.search) bad('phone sheet has no search');
      await pg.locator('#sbP-menu .sbAcc > button').nth(2).click(); const n2 = await pg.evaluate(() => document.querySelectorAll('#sbP-menu .sbAcc > button[aria-expanded=true]').length); if (n2 !== 1) bad('phone sheet: opening a group must close the others');
    }
    await ctx.close();
  }
  return out;
}
const jobs = []; for (const p of list) for (const v of vpNames) jobs.push([p, v]);
const results = []; let next = 0;
async function worker() { while (next < jobs.length) { const [p, v] = jobs[next++]; const r = await audit(p, v, p); results.push(r); process.stderr.write(`${r.issues.length ? 'x' : '.'}`); } }
await Promise.all(Array.from({ length: CONC }, worker));
if (!only || process.argv.includes('--menus')) { const mi = await menuTests(); if (mi.length) results.push({ page: 'menus', vp: vpNames.join('+'), issues: mi }); }
await br.close();
process.stderr.write('\n');

results.sort((a, b) => a.page.localeCompare(b.page) || a.vp.localeCompare(b.vp));
const tally = {}; let total = 0;
for (const r of results) { for (const i of r.issues) { tally[i.kind] = (tally[i.kind] || 0) + 1; total++; } }
for (const r of results) if (r.issues.length) { console.log(`\n${r.page} [${r.vp}]`); for (const i of r.issues) console.log(`  ${i.kind.padEnd(10)} ${i.msg}`); }
console.log(`\nChecked ${list.length} pages x ${vpNames.length} viewport(s). ${total} issue(s)`, total ? JSON.stringify(tally) : '');
if (out) fs.writeFileSync(out, JSON.stringify({ base, date: new Date().toISOString(), tally, results }, null, 1));
process.exit(strict && total ? 1 : 0);
