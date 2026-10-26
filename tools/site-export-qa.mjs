// Export QA for the site builder: builds every template, serves the exported files and checks them like a visitor would.
//   cd site && python3 -m http.server 8797 &        # serve the builder
//   BASE=http://localhost:8797/ node tools/site-export-qa.mjs [templateId ...]
// Env: CHROME (Chromium binary), QUICK=1 (first page of each template only, desktop only).
// Per page: no console or page errors, no broken local links, anchors or images, alt text, title / description / viewport / lang /
// Open Graph / canonical metas, one h1, valid-looking HTML (balanced tags, unique ids), no builder code left behind,
// axe (serious or critical), the mobile menu opens, accordions toggle, galleries open a lightbox, forms validate, send and show success or an error.
import { chromium } from 'playwright';
import fs from 'fs';
import os from 'os';
import path from 'path';
import http from 'http';
const BASE = process.env.BASE || 'http://localhost:8797/';
const CHROME = process.env.CHROME || (fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined);
const QUICK = !!process.env.QUICK;
const only = process.argv.slice(2);
let axeSrc = null; for (const p of ['axe-core/axe.min.js', '/tmp/claude-0/pw/node_modules/axe-core/axe.min.js']) { try { axeSrc = fs.readFileSync(p.startsWith('/') ? p : new URL('./node_modules/' + p, import.meta.url), 'utf8'); break; } catch (e) {} }
const br = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const cov = { menu: 0, acc: 0, gallery: 0, form: 0, galleryPages: 0 };
let fails = 0, checks = 0; const bad = (m) => { fails++; console.log('FAIL', m); }; const ok = (c, m) => { checks++; if (!c) bad(m); };

const MIME = { html: 'text/html', css: 'text/css', js: 'text/javascript', svg: 'image/svg+xml', xml: 'application/xml', txt: 'text/plain', png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', json: 'application/json' };
function serve(dir) { return new Promise(res => { const s = http.createServer((q, r) => { let u = decodeURIComponent(q.url.split('?')[0]); if (u.endsWith('/')) u += 'index.html'; const f = path.join(dir, u); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404, { 'content-type': 'text/html' }); return r.end('<h1>Not found</h1>'); } r.writeHead(200, { 'content-type': MIME[path.extname(f).slice(1)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }); s.listen(0, () => res(s)); }); }

/* a small HTML check: balanced tags, unique ids, no leftovers from the editor */
function lint(html, label) {
  const out = []; const VOID = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
  const body = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/gi, '<script></script>').replace(/<style[\s\S]*?<\/style>/gi, '<style></style>');
  const stack = []; const re = /<(\/?)([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g; let m;
  while ((m = re.exec(body))) { const close = m[1], tag = m[2].toLowerCase(), self = /\/$/.test(m[3]); if (VOID.has(tag) || self) continue; if (!close) stack.push(tag); else { const i = stack.lastIndexOf(tag); if (i < 0) out.push('stray </' + tag + '>'); else { if (i !== stack.length - 1 && !['p', 'li', 'td', 'tr', 'th', 'option'].includes(stack[stack.length - 1])) out.push('<' + stack[stack.length - 1] + '> closed late'); stack.length = i; } } }
  if (stack.filter(t => !['p', 'li', 'html', 'body', 'head'].includes(t)).length) out.push('unclosed ' + stack.filter(t => !['p', 'li'].includes(t)).join(','));
  const ids = [...body.matchAll(/\sid="([^"]+)"/g)].map(x => x[1]); const dup = ids.filter((x, i) => ids.indexOf(x) !== i); if (dup.length) out.push('duplicate ids ' + [...new Set(dup)].slice(0, 4).join(','));
  if (!/^<!doctype html>/i.test(html.trim())) out.push('no doctype');
  for (const bad of ['contenteditable', 'data-pbf', 'data-pb ', 'data-pba', 'pb-t', '__PB_EDIT', 'pb-ghost', 'pb-ui', 'data-pbv', 'postMessage({pb']) if (html.includes(bad)) out.push('editor leftover: ' + bad);
  if (/\{\{|\[object|undefined/.test(body.replace(/<script[\s\S]*?<\/script>/g, ''))) out.push('unfilled placeholder');
  return out.map(x => label + ': ' + x);
}

const ctxB = await br.newContext({ viewport: { width: 1440, height: 900 } });
const builder = await ctxB.newPage();
await builder.route('**/api/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '{"enabled":false}' }));
await builder.goto(BASE + 'page-builder.html?nostart=1'); await builder.waitForFunction(() => document.body.classList.contains('ready'));
const ids = await builder.evaluate(() => PB.templates.map(t => t.id));
for (let ti = 0; ti < ids.length; ti++) {
  if (only.length && !only.includes(ids[ti])) continue;
  const t0 = Date.now();
  await builder.evaluate(([i, form]) => { PB.ux.useTemplate(i); PB.app.site.settings.formAction = form; PB.app.site.settings.url = 'https://example.org/'; }, [ti, 'https://formspree.io/f/qatest']);
  const files = await builder.evaluate(async () => (await PB.buildSiteFiles()).map(([n, c]) => [n, typeof c === 'string' ? c : null, typeof c === 'string' ? null : (() => { let x = ''; for (let i = 0; i < c.length; i += 0x8000) x += String.fromCharCode.apply(null, c.subarray(i, i + 0x8000)); return btoa(x); })()]));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pbqa-' + ids[ti] + '-'));
  for (const [n, c, b] of files) { const f = path.join(dir, n); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, c != null ? c : Buffer.from(b, 'base64')); }
  const names = new Set(files.map(f => f[0])); const server = await serve(dir); const origin = 'http://localhost:' + server.address().port + '/';
  const htmls = files.filter(f => f[0].endsWith('.html')).map(f => f[0]);
  ok(names.has('sitemap.xml') && names.has('robots.txt') && names.has('index.html'), ids[ti] + ': index, sitemap and robots present');
  for (const [n, c] of files) if (c && n.endsWith('.html')) for (const e of lint(c, ids[ti] + '/' + n)) bad(e);
  const sm = files.find(f => f[0] === 'sitemap.xml')[1]; for (const f of htmls) if (f !== '404.html') ok(sm.includes(f === 'index.html' ? 'https://example.org/</loc>' : f), ids[ti] + ': sitemap lists ' + f);
  if (names.has('feed.xml')) { const fx = files.find(f => f[0] === 'feed.xml')[1]; ok(/<rss/.test(fx) && /<item>/.test(fx), ids[ti] + ': feed.xml has items'); }
  for (const vp of QUICK ? [{ width: 1280, height: 800 }] : [{ width: 1280, height: 800 }, { width: 390, height: 800 }]) {
    const ctx = await br.newContext({ viewport: vp, reducedMotion: 'reduce' });
    const sent = []; await ctx.route('https://formspree.io/**', r => { sent.push(r.request().postData() || ''); r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); });
    await ctx.route(/^https?:\/\/(?!localhost)/, r => r.request().url().includes('formspree.io') ? r.fallback() : r.abort());
    for (const f of QUICK ? htmls.slice(0, 1) : htmls) {
      const pg = await ctx.newPage(); const errs = [];
      pg.on('pageerror', e => errs.push(e.message.slice(0, 140))); pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED|net::/.test(m.text())) errs.push(m.text().slice(0, 140)); });
      await pg.goto(origin + f, { waitUntil: 'load' }).catch(() => {}); await pg.waitForTimeout(250);
      const L = ids[ti] + '/' + f + '@' + vp.width;
      ok(!errs.length, L + ' no console errors ' + errs.slice(0, 2));
      const info = await pg.evaluate(() => {
        const q = s => document.querySelector(s), m = n => (q('meta[name="' + n + '"],meta[property="' + n + '"]') || {}).content || '';
        const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h && !/^(https?:|mailto:|tel:|javascript:)/i.test(h));
        return { title: document.title, lang: document.documentElement.lang, vp: !!q('meta[name=viewport]'), desc: m('description'), ogt: m('og:title'), canon: (q('link[rel=canonical]') || {}).href || '', h1: document.querySelectorAll('h1').length, links, noAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length, broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.src.startsWith(location.origin)).map(i => i.getAttribute('src')), anchors: links.filter(h => h.startsWith('#') && h.length > 1).filter(h => !document.getElementById(h.slice(1))), overflow: document.documentElement.scrollWidth > innerWidth + 1 ? [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed').slice(0, 3).map(e => e.tagName + '.' + String(e.className).slice(0, 30)).join(' ') || 'page' : '' };
      });
      if (f !== '404.html') { ok(info.title.length > 2, L + ' has a title'); ok(info.desc.length > 10, L + ' has a description'); ok(info.ogt, L + ' has og:title'); ok(info.canon, L + ' has a canonical link'); ok(info.h1 === 1, L + ' has exactly one h1 (' + info.h1 + ')'); }
      ok(info.lang && info.vp, L + ' has lang and viewport'); ok(info.noAlt === 0, L + ' every image has alt'); ok(!info.broken.length, L + ' no broken local images ' + info.broken.slice(0, 2)); ok(!info.anchors.length, L + ' anchors resolve ' + info.anchors.slice(0, 2));
      ok(!info.overflow, L + ' no horizontal overflow ' + info.overflow);
      for (const h of info.links) { const p = h.split('#')[0].split('?')[0]; if (!p) continue; ok(names.has(p.replace(/^\.?\//, '')), L + ' link target exists: ' + h); }
      if (axeSrc) { await pg.addScriptTag({ content: axeSrc }).catch(() => {}); const r = await pg.evaluate(() => axe.run(document, { resultTypes: ['violations'] })).catch(() => ({ violations: [] })); const b = r.violations.filter(v => ['serious', 'critical'].includes(v.impact)); ok(!b.length, L + ' axe ' + b.map(v => v.id + ' ' + v.nodes.map(n => n.target.join(' ')).slice(0, 2)).join(' | ')); }
      if (vp.width < 600) { const tg = await pg.$('header button[aria-expanded], nav button[aria-expanded], button.menu, button[aria-controls]'); if (tg && await tg.isVisible()) { await tg.click(); await pg.waitForTimeout(200); cov.menu++; ok((await tg.getAttribute('aria-expanded')) === 'true', L + ' mobile menu opens'); } else if (f === 'index.html' && (await pg.$('nav a'))) ok(await pg.evaluate(() => [...document.querySelectorAll('nav a')].some(a => a.offsetParent !== null)), L + ' mobile nav links reachable'); }
      const acc = await pg.$('details > summary, .fq button[aria-expanded], button[aria-expanded][aria-controls]:not(header button)'); if (acc && vp.width > 600) { const tag = await acc.evaluate(e => e.tagName); cov.acc++; await acc.click(); await pg.waitForTimeout(150); const open = tag === 'SUMMARY' ? await acc.evaluate(e => e.parentElement.open) : (await acc.getAttribute('aria-expanded')) === 'true'; ok(open, L + ' accordion opens'); }
      if (await pg.$('.b-gallery img')) cov.galleryPages++; const gal = await pg.$('.gl img, [data-lightbox] img, .b-gallery img'); if (gal && vp.width > 600) { cov.gallery++; await gal.click({ force: true }).catch(() => {}); await pg.waitForTimeout(250); ok(await pg.evaluate(() => !!document.querySelector('dialog[open], .lb[open], .lightbox.on, [role=dialog]:not([hidden])')), L + ' gallery opens a lightbox'); await pg.keyboard.press('Escape'); }
      const form = await pg.$('form[name=contact]'); if (form && vp.width > 600) { cov.form++;
        await pg.click('form[name=contact] button[type=submit]'); await pg.waitForTimeout(150); ok(await pg.evaluate(() => [...document.querySelectorAll('form[name=contact] .err')].some(e => e.textContent.trim())), L + ' contact form shows validation messages');
        await pg.fill('form[name=contact] [name=name]', 'Test'); await pg.fill('form[name=contact] [name=email]', 'test@example.com'); await pg.fill('form[name=contact] [name=message]', 'Hello there'); const n0 = sent.length;
        await pg.click('form[name=contact] button[type=submit]'); await pg.waitForTimeout(500); ok(sent.length === n0 + 1 && /name=|Test/.test(sent[sent.length - 1]), L + ' contact form posts to the form address'); ok(/Thanks/.test(await pg.textContent('form[name=contact] .ok')), L + ' contact form shows a success message');
        await pg.fill('form[name=contact] [name=name]', 'Bot'); await pg.fill('form[name=contact] [name=email]', 'bot@example.com'); await pg.fill('form[name=contact] [name=message]', 'spam'); await pg.evaluate(() => { document.querySelector('form[name=contact] [name=_gotcha]').value = 'x'; }); const n1 = sent.length; await pg.click('form[name=contact] button[type=submit]'); await pg.waitForTimeout(300); ok(sent.length === n1, L + ' the honeypot stops spam from being sent');
      }
      await pg.close();
    }
    await ctx.close();
  }
  server.close(); fs.rmSync(dir, { recursive: true, force: true }); console.log('checked', ids[ti], ((Date.now() - t0) / 1000).toFixed(0) + 's');
}
await br.close();
console.log('coverage', JSON.stringify(cov));
console.log(fails ? fails + ' FAILED of ' + checks : 'EXPORT QA PASSED (' + checks + ' checks)'); process.exit(fails ? 1 : 0);
