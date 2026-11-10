/* Regenerates site/sitemap.xml: the atlas, the tools overview, every standalone tool page, the 01 design-system docs and the studies.
   Usage: node tools/build-sitemap.mjs */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');
const ORIGIN = 'https://motionatlas-ten.vercel.app';
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(root, 'tools-data.js'), 'utf8'), ctx);
const urls = [['atlas', 1.0, 'weekly'], ['tools', 0.9, 'weekly']];
for (const t of ctx.window.ATLAS_TOOLS.list) { if (t.href.includes('#')) continue; urls.push([t.href.replace(/\.html$/, ''), 0.8, 'monthly']); }
for (const f of fs.readdirSync(path.join(root, 'studies')).sort()) if (f.endsWith('.html')) urls.push(['studies/' + f.replace(/\.html$/, ''), 0.5, 'monthly']);
const day = new Date().toISOString().slice(0, 10);
const seen = new Set();
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.filter(([u]) => !seen.has(u) && seen.add(u)).map(([u, p, c]) => `  <url><loc>${ORIGIN}/${u}</loc><lastmod>${day}</lastmod><changefreq>${c}</changefreq><priority>${p.toFixed(1)}</priority></url>`).join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log(seen.size + ' urls');
