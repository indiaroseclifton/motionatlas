/* Phone-width load measurements with network throttling (10 Mbps down, 40 ms), for every public page.
   Usage: node tools/site-perf.mjs [--base http://localhost:8798/] [--top 15] [--only text] [--out perf.json]
   Reports per page: bytes and requests at load and after 4 s, the heaviest files, render-blocking scripts in <head>,
   videos that preload eagerly, images over 400 KB. Local servers send files uncompressed, so real transfers are smaller. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const { chromium } = createRequire((process.env.PW_DIR || '/tmp/claude-0/pw') + '/x.js')('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : process.argv[i + 1]; };
const base = String(arg('base', 'http://localhost:8798/')).replace(/\/?$/, '/'), TOP = +arg('top', 15), only = arg('only', ''), out = arg('out', '');
const pages = new Set(['atlas.html']);
for (const m of fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>https?:\/\/[^/]+\/([^<]*)<\/loc>/g)) pages.add(m[1] ? m[1] + '.html' : 'atlas.html');
for (const h of ['browse', 'systems', 'motion', 'effects', 'ux', 'art', 'cinema', 'icons', 'backgrounds', 'showcase', 'references', 'projects']) pages.add('atlas.html#' + h);
const br = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const res = [];
async function one(p) {
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const pg = await ctx.newPage(); const cdp = await ctx.newCDPSession(pg);
  await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 40, downloadThroughput: 10e6 / 8, uploadThroughput: 5e6 / 8 });
  let bytes = 0, reqs = 0; const by = {}, urls = new Map();
  cdp.on('Network.requestWillBeSent', e => { reqs++; urls.set(e.requestId, e.request.url) });
  cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength; const u = urls.get(e.requestId) || ''; by[u] = (by[u] || 0) + e.encodedDataLength });
  const t0 = Date.now(); let load = null, err = null;
  try { await pg.goto(base + p, { waitUntil: 'load', timeout: 90000 }); load = Date.now() - t0 } catch (e) { err = e.message.slice(0, 80) }
  const atLoad = { bytes, reqs }; await pg.waitForTimeout(4000);
  const flags = await pg.evaluate(() => ({
    blocking: [...document.head.querySelectorAll('script[src]:not([defer]):not([async]):not([type=module])')].map(s => s.getAttribute('src')).filter(s => !/^https?:/.test(s)).length,
    eagerVideos: [...document.querySelectorAll('video')].filter(v => (v.preload === 'auto' || v.autoplay) && !v.closest('[hidden]') && v.getBoundingClientRect().top > innerHeight * 2).length
  })).catch(() => ({}));
  const big = Object.entries(by).filter(([u, b]) => /\.(jpe?g|png|webp|gif)(\?|$)/i.test(u) && b > 400 * 1024).map(([u, b]) => u.replace(base, '') + ' ' + Math.round(b / 1024) + 'KB');
  const top = Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([u, b]) => u.replace(base, '') + ' ' + Math.round(b / 1024) + 'KB');
  res.push({ p, loadMs: load, loadKB: Math.round(atLoad.bytes / 1024), loadReqs: atLoad.reqs, KB: Math.round(bytes / 1024), reqs, blockingScripts: flags.blocking, eagerVideos: flags.eagerVideos, bigImages: big, top, err });
  await ctx.close();
}
const q = [...pages].filter(p => !only || p.includes(only));
await Promise.all(Array.from({ length: 3 }, async () => { while (q.length) { const p = q.shift(); try { await one(p) } catch (e) { res.push({ p, err: e.message.slice(0, 100) }) } } }));
res.sort((a, b) => (b.KB || 0) - (a.KB || 0));
for (const r of res.slice(0, TOP)) console.log(String(r.KB).padStart(7), 'KB', String(r.reqs).padStart(4), 'req', String(r.loadMs).padStart(6), 'ms  load:', r.loadKB + 'KB/' + r.loadReqs, ' blocking:' + r.blockingScripts, ' eagerVideo:' + r.eagerVideos, ' ', r.p, r.err || '', r.bigImages.length ? '\n          big: ' + r.bigImages.join(', ') : '');
if (out) fs.writeFileSync(out, JSON.stringify(res, null, 1));
await br.close();
