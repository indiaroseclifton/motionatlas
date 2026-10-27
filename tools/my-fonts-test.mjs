// My fonts tests. Run: node tools/my-fonts-test.mjs  (static server on BASE, default http://localhost:8799; playwright + axe-core from PW_MODULES)
// The fonts are synthesised here at test time (tools/mini-ttf.mjs) into a temp folder; no real font is read, committed or sent anywhere.
import fs from 'fs'; import os from 'os'; import path from 'path'; import { createRequire } from 'module';
import { mkFont } from './mini-ttf.mjs';
const BASE = process.env.BASE || 'http://localhost:8799';
const require = createRequire((process.env.PW_MODULES || import.meta.dirname) + '/'); const { chromium } = require('playwright');
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'myfonts-')); let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m) } else console.log('ok  ', m) };
const F = (n, o) => { const p = path.join(tmp, n); fs.writeFileSync(p, mkFont(o)); return p };
const reg = F('Zedtest-Regular.ttf', { family: 'Zed Test', style: 'Regular', weight: 400 });
const bold = F('Zedtest-Bold.ttf', { family: 'Zed Test', style: 'Bold', weight: 700, block: 800 });
const ital = F('Zedtest-Italic.ttf', { family: 'Zed Test', style: 'Italic', weight: 400, italic: true });
const junk = path.join(tmp, 'broken.ttf'); fs.writeFileSync(junk, Buffer.from('this is not a font at all, just text padding padding padding padding padding'));
const big = path.join(tmp, 'huge.ttf'); fs.writeFileSync(big, Buffer.alloc(5 * 1024 * 1024 + 10));
const br = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await br.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true }); const pg = await ctx.newPage();
const errs = []; const net = [];
pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|googleapis|gstatic/.test(m.text())) errs.push(m.text()) });
/* no network request may carry font bytes: any non-GET with a body, or any request whose body holds the test font's name/bytes */
const needle = fs.readFileSync(reg).subarray(0, 64).toString('latin1');
await ctx.route('**/*', r => {
  const q = r.request(), b = q.postDataBuffer(); net.push({ m: q.method(), u: q.url(), n: b ? b.length : 0, hit: !!(b && b.toString('latin1').includes(needle.slice(0, 16))) });
  r.continue();
});
await pg.goto(BASE + '/my-fonts.html'); await pg.waitForFunction(() => window.MyFonts);
ok(await pg.evaluate(() => MyFonts.list().length === 0), 'starts empty');
ok(/stay in this browser only/i.test(await pg.textContent('.mfNote')), 'licence/privacy notice is shown');
/* add: bad files report errors, good ones are listed */
await pg.setInputFiles('[data-files]', [reg, bold, ital, junk, big]);
await pg.waitForSelector('.mfFam');
const fam = await pg.evaluate(() => MyFonts.list().map(f => ({ n: f.family, w: f.faces.map(x => x.weight + (x.italic ? 'i' : '')).join(',') })));
ok(fam.length === 1 && fam[0].n === 'Zed Test' && fam[0].w === '400,400i,700', 'one family with 400, 400 italic, 700: ' + JSON.stringify(fam));
const errTxt = await pg.textContent('[data-msg]'); ok(/broken\.ttf/.test(errTxt) && /huge\.ttf/.test(errTxt) && /5 MB/.test(errTxt), 'bad and oversize files are reported, not fatal');
ok((await pg.$$('.mfChip')).length === 3, 'three style chips');
ok(await pg.evaluate(() => document.fonts.check('700 20px "Zed Test"') && document.fonts.check('italic 400 20px "Zed Test"')), 'registered with document.fonts');
/* the preview renders with the uploaded font (blocks are wider than any fallback glyph row) */
const w1 = await pg.evaluate(() => { const d = document.querySelector('.mfPrev div'); const s = document.createElement('span'); s.style.cssText = 'font:24px "Zed Test";position:absolute;visibility:hidden'; s.textContent = 'iiii'; document.body.appendChild(s); const a = s.getBoundingClientRect().width; s.style.fontFamily = 'serif'; return [a, s.getBoundingClientRect().width] });
ok(w1[0] > w1[1] * 2, 'text measures wider in the test font than in the fallback (' + w1.map(Math.round) + ')');
/* rename */
await pg.click('[data-ren]'); await pg.fill('.mfRen', 'My Display'); await pg.keyboard.press('Enter'); await pg.waitForSelector('.mfName');
ok((await pg.textContent('.mfName')) === 'My Display', 'rename display name');
/* persists after reload */
await pg.reload(); await pg.waitForFunction(() => window.MyFonts && MyFonts.list().length === 1); await pg.evaluate(() => MyFonts.ready);
ok(await pg.evaluate(() => MyFonts.list()[0].display === 'My Display' && MyFonts.list()[0].faces.length === 3 && document.fonts.check('700 20px "Zed Test"')), 'persists after reload and re-registers');
await pg.evaluate(() => MyFonts.remove('Zed Test')); ok(await pg.evaluate(() => MyFonts.list().length === 0), 'delete works');
await pg.reload(); await pg.evaluate(() => MyFonts.ready); ok(await pg.evaluate(() => MyFonts.list().length === 0), 'delete persists after reload');

/* zip import (deflate) and folder-style multi selection */
import zlib from 'zlib';
function mkzip(entries) { const parts = [], cen = []; let off = 0; for (const [name, data] of entries) { const c = zlib.deflateRawSync(data), n = Buffer.from(name); const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(8, 8); h.writeUInt32LE(0, 14); h.writeUInt32LE(c.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(n.length, 26); parts.push(h, n, c); const e = Buffer.alloc(46); e.writeUInt32LE(0x02014b50, 0); e.writeUInt16LE(20, 4); e.writeUInt16LE(20, 6); e.writeUInt16LE(8, 10); e.writeUInt32LE(c.length, 20); e.writeUInt32LE(data.length, 24); e.writeUInt16LE(n.length, 28); e.writeUInt32LE(off, 42); cen.push(e, n); off += 30 + n.length + c.length } const cd = Buffer.concat(cen), end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(off, 16); return Buffer.concat([...parts, cd, end]) }
const zp = path.join(tmp, 'pack.zip'); fs.writeFileSync(zp, mkzip([['Pack/Quill-Regular.ttf', mkFont({ family: 'Quill Pack', style: 'Regular', weight: 400 })], ['Pack/Quill-Black.ttf', mkFont({ family: 'Quill Pack', style: 'Black', weight: 900 })], ['Pack/EULA.txt', Buffer.from('licence text')]]));
await pg.setInputFiles('[data-files]', zp); await pg.waitForSelector('.mfFam');
ok(await pg.evaluate(() => { const l = MyFonts.list(); return l.length === 1 && l[0].family === 'Quill Pack' && l[0].faces.map(f => f.weight).join() === '400,900' }), 'zip is unzipped client-side; the EULA text is ignored');
const h = await pg.evaluate(() => { const l = MyFonts.list()[0]; return MyFonts.fontFaceCSS(l.family, { mode: 'file' }) }); ok(/url\("fonts\/Quill-Pack-900\.ttf"\)/.test(h), 'file-mode @font-face references fonts/');
const gp = await pg.evaluate(() => MyFonts.glyphPath('Quill Pack', 'AB', { size: 100 }).then(r => r && { d: r.d.slice(0, 40), w: Math.round(r.width) })); ok(gp && /^M/.test(gp.d) && gp.w > 100, 'glyphPath gives outlines ' + JSON.stringify(gp));
await pg.evaluate(() => MyFonts.remove('Quill Pack'));
await pg.setViewportSize({ width: 390, height: 800 }); await pg.setInputFiles('[data-files]', [reg]); await pg.waitForSelector('.mfFam');
ok(await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '390px: no horizontal overflow');
await pg.addScriptTag({ content: axeSrc }); const ax = await pg.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] }).then(r => r.violations.map(v => v.id + ':' + v.nodes.length + ' ' + v.nodes[0].html.slice(0, 80))));
ok(ax.length === 0, 'axe clean on my-fonts.html ' + ax.join(' | '));
await pg.evaluate(() => MyFonts.remove('Zed Test'));
/* private mode / blocked storage: fonts last for the page session only, with a notice */
const pc = await br.newContext({ viewport: { width: 1000, height: 800 } }); await pc.addInitScript(() => { Object.defineProperty(window, 'indexedDB', { get() { throw new Error('blocked') } }); const g = () => { throw new Error('blocked') }; Object.defineProperty(window, 'localStorage', { get: g }) });
const pp = await pc.newPage(); const pe = []; pp.on('pageerror', e => pe.push(e.message)); await pp.goto(BASE + '/my-fonts.html'); await pp.evaluate(() => MyFonts.ready);
await pp.setInputFiles('[data-files]', [reg]); await pp.waitForSelector('.mfFam');
ok(pe.length === 0 && await pp.evaluate(() => !MyFonts.persistent && !document.querySelector('[data-priv]').hidden), 'blocked storage: still works for the session, shows the notice, no exceptions ' + pe.join());
await pc.close();
/* nothing uploaded */
const posts = net.filter(n => n.m !== 'GET' && n.m !== 'HEAD' && n.m !== 'OPTIONS'); ok(posts.length === 0, 'no non-GET requests at all ' + JSON.stringify(posts.slice(0, 3)));
ok(!net.some(n => n.hit), 'no request body contains font bytes'); ok(!net.some(n => /\.(ttf|otf|woff2?)(\?|$)/i.test(n.u) && !n.u.includes('/fonts/Atlas')), 'no font file URL was requested');
ok(errs.length === 0, 'no console errors ' + errs.join(' | '));
fs.rmSync(tmp, { recursive: true, force: true }); await br.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
