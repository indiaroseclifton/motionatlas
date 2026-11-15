/* Smoke test: opens every main page in an installed Chrome and lists uncaught script errors and sideways scroll.
   Usage: node tools/smoke.mjs [baseUrl] [phone]      (static server on site/ required; see tools/cdp.mjs) */
import { launch } from './cdp.mjs';
const base = (process.argv[2] || 'http://localhost:8798/').replace(/\/?$/, '/');
const phone = process.argv[3] === 'phone', W = phone ? 390 : 1280, H = phone ? 844 : 800;
const PAGES = ['index.html', 'tools.html', 'interactions.html', 'app-interfaces.html', 'page-builder.html?nostart=1', 'brand-generator.html', 'theme-kits.html', 'icons.html',
  'motion-graphics.html', 'infographic-studio.html', 'chart-studio.html', 'diagram-studio.html', 'flowchart-studio.html', 'flowchart-canvas.html', 'mockup-studio.html',
  'chart-styles.html', 'moodboard.html', 'my-fonts.html', 'account.html',
  ...['browse', 'motion', 'effects', 'ux', 'icons', 'systems', 'backgrounds', 'art', 'cinema', 'typography', 'compare', 'pairings', 'references', 'projects', 'inspiration', 'creations', 'playground', 'tours', 'vases'].map(h => 'atlas.html#' + h)];
const br = await launch({ width: W, height: H });
let bad = 0;
for (const p of PAGES) {
  const pg = await br.newPage(), errs = [];
  pg.on(m => { if (m.method === 'Runtime.exceptionThrown') { const d = m.params.exceptionDetails; errs.push((d.exception?.description || d.text || '').split('\n')[0]); } });
  await pg.goto(base + p); await pg.wait(2500);
  const wide = await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const line = [...new Set(errs)].slice(0, 3).join(' | ');
  if (line || wide > 1) { bad++; console.log('✗', p, wide > 1 ? `scrolls sideways by ${wide}px` : '', line); } else console.log('✓', p);
  await pg.close();
}
await br.close();
console.log(bad ? bad + ' page(s) need a look' : 'all clear');
process.exit(bad ? 1 : 0);
