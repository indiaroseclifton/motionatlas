/* Computes every headline number the site quotes (entries, templates, icons, kits...) from the real data
   and writes site/counts.json. Usage: node tools/site-counts.mjs [baseUrl]   (needs a static server on the site/ folder)
   site-qa.mjs compares the numbers printed in pages against this file. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const { chromium } = createRequire((process.env.PW_DIR || '/tmp/claude-0/pw') + '/x.js')('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');
const base = (process.argv[2] || 'http://localhost:8798/').replace(/\/?$/, '/');
const j = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const cat = j('catalogue.json'), exp = j('expansion.json'), icons = j('icons/index.json'), photos = j('assets/photos/photos.json');
const grp = g => exp.entries.filter(e => e.group === g).length;
const counts = {
  entries: cat.length + exp.entries.length,
  artStyles: grp('Art styles'), filmLooks: grp('Cinematic directions'), components: grp('UX/UI components'),
  effects: grp('Landing effects'), systems: grp('Design systems'),
  animationStudies: cat.filter(e => e.group === 'Animation art').length,
  extractedAssets: j('extracted-assets.json').length,
  photos: photos.photos.length,
  iconFamilies: icons.families.length, icons: icons.families.reduce((n, f) => n + (f.count || 0), 0)
};
const br = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
async function ev(p, fn) { const pg = await br.newPage(); await pg.goto(base + p); await pg.waitForTimeout(2500); try { return await pg.evaluate(fn); } finally { await pg.close(); } }
counts.kits = await ev('theme-kits.html', () => window.ThemeKits.list.length);
counts.interactions = await ev('interactions.html', () => window.INTERACTIONS.length);
counts.chartTypes = await ev('chart-studio.html', () => window.DVChartMaker.KINDS.length);
counts.diagramTypes = await ev('diagram-studio.html', () => window.Diagrams.KINDS.length);
counts.flowTemplates = await ev('flowchart-studio.html', () => window.FlowTemplates.length);
counts.devices = await ev('mockup-studio.html', () => window.MockupDevices.list.length);
const pb = await ev('page-builder.html?nostart=1', () => ({ sections: Number((document.querySelector('.lcount')?.textContent.match(/(\d+) sections/) || [])[1]) || PB_LIB.blocks.length, templates: (window.PB.templates || []).length }));
counts.siteSections = pb.sections; counts.siteTemplates = pb.templates;
counts.tours = await ev('atlas.html#tours', () => window.AtlasTours.TOURS.length);
counts.backgrounds = await ev('atlas.html#backgrounds', () => window.BackgroundAtlas.ALL.length);
await br.close();
counts.generated = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(root, 'counts.json'), JSON.stringify(counts, null, 1) + '\n');
console.log(counts);
