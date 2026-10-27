/* Adds the constant top bar (site-bar.js), its no-JS fallback and the standard social meta tags to every public page.
   Idempotent: run it again after adding a page.  Usage: node tools/install-site-bar.mjs
   Skipped on purpose: atlas.html (the same bar is built by atlas-nav.js), work/01 (a private project) and interactions/demos (iframe demos). */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');
const ORIGIN = 'https://motionatlas-ten.vercel.app';
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) { if (!/^(assets|vendor|icons|fonts|api|node_modules)$/.test(f.name)) walk(p) } else if (f.name.endsWith('.html')) files.push(p) } })(root);
const SKIP = /^(atlas\.html|work\/01\/|interactions\/demos\/)/;
const DESC = { 'studies/butterfly': 'A particle butterfly, flapping: grains of light sampled from a still, a Visual & Motion Atlas study.', 'studies/lion-phoenix': 'Golden stardust that morphs from a lion into a phoenix: a particle study from the Visual & Motion Atlas.', 'studies/stardust-bird-fox': 'Golden stardust that morphs from a bird into a fox: a particle study from the Visual & Motion Atlas.', 'studies/whale-glide': 'About 52,000 grains of light form a humpback whale gliding through the dark: a particle study from the Visual & Motion Atlas.' };
let n = 0;
for (const f of files) {
  const rel = path.relative(root, f).split(path.sep).join('/'); if (SKIP.test(rel)) continue;
  let s = fs.readFileSync(f, 'utf8'); const o = s; const up = '../'.repeat(rel.split('/').length - 1);
  const hi = s.search(/<\/head>/i); if (hi < 0) { console.log('no head', rel); continue }
  let add = '';
  const title = (s.match(/<title>([^<]*)<\/title>/i) || [, 'Visual & Motion Atlas'])[1].trim();
  const noindex = /noindex/.test(s);
  let descM = s.match(/<meta name="description" content="([^"]*)"/i);
  const key = rel.replace(/\.html$/, '');
  if (!descM && DESC[key]) { add += `<meta name="description" content="${DESC[key]}">\n`; descM = [0, DESC[key]] }
  const desc = descM ? descM[1] : '';
  if (!/property="og:title"/.test(s)) {
    const pageUrl = ORIGIN + '/' + key;
    add += `<meta property="og:type" content="website"><meta property="og:site_name" content="Visual &amp; Motion Atlas"><meta property="og:title" content="${title}">${desc ? `<meta property="og:description" content="${desc}">` : ''}<meta property="og:url" content="${pageUrl}"><meta property="og:image" content="${ORIGIN}/assets/og-atlas.jpg"><meta name="twitter:card" content="summary_large_image">\n`;
    if (!/rel="canonical"/.test(s) && !noindex) add += `<link rel="canonical" href="${pageUrl}">\n`;
  }
  if (!/rel~?="icon"|rel="icon"/.test(s)) add += `<link rel="icon" href="${up}assets/favicon.svg" type="image/svg+xml">\n`;
  if (!/id="sbPre"/.test(s)) add += `<style id="sbPre">html{--sb-h:calc(44px + env(safe-area-inset-top,0px))}body{padding-top:var(--sb-h)}html:not(.sbReady) body::before{content:"";position:fixed;top:0;left:0;right:0;height:var(--sb-h);background:#0d111b;z-index:2147483000}@media print{body{padding-top:0}}</style><script src="${up}site-nav-data.js" defer></script><script src="${up}site-bar.js" defer></script>\n`;
  s = s.slice(0, hi) + add + s.slice(hi);
  s = s.replace(/<script src="tools-data\.js" defer><\/script><script src="tools-menu\.js" defer><\/script>\n?/, '');
  if (!/id="sbNo"/.test(s)) s = s.replace(/<body([^>]*)>/i, (m) => m + `<noscript><nav id="sbNo" aria-label="Atlas" style="position:fixed;top:0;left:0;right:0;height:44px;box-sizing:border-box;z-index:2147483000;background:#0d111b;padding:12px 16px;font:500 14px/20px system-ui,sans-serif;white-space:nowrap;overflow:auto"><a style="color:#fde68a;margin-right:16px" href="${up}atlas.html">Atlas</a><a style="color:#e8edf5;margin-right:16px" href="${up}tools.html">Tools</a><a style="color:#e8edf5;margin-right:16px" href="${up}atlas.html#browse">Catalogue</a><a style="color:#e8edf5" href="${up}atlas.html#projects">My projects</a></nav></noscript>`);
  if (s !== o) { fs.writeFileSync(f, s); n++ }
}
console.log('updated', n, 'pages');
