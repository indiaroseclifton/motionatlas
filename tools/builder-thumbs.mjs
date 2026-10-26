// Pre-renders template thumbnails for the site builder start screen: site/builder/thumbs/<template>-<page>.webp (560x350).
//   cd site && python3 -m http.server 8797 &      # serve the static site
//   BASE=http://localhost:8797/ node tools/builder-thumbs.mjs [templateId ...]     # needs playwright and python3 with Pillow
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
const BASE = process.env.BASE || 'http://localhost:8797/';
const OUT = process.env.OUT || path.resolve(new URL('../site/builder/thumbs', import.meta.url).pathname);
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const only = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const br = await chromium.launch({ executablePath: CHROME, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } });
await ctx.addInitScript(() => { try { localStorage.setItem('atlas-page-builder-ui', JSON.stringify({ edit: false, w: 'desk' })); } catch (e) {} });
const pg = await ctx.newPage();
await pg.route('**/api/ai*', r => r.fulfill({ status: 200, contentType: 'application/json', body: '{"enabled":false}' }));
await pg.goto(BASE + 'page-builder.html?nostart=1'); await pg.waitForFunction(() => document.body.classList.contains('ready'));
await pg.addStyleTag({ content: '.lib,.right,header,.bar,.panes,.cvtb{display:none!important}.app{grid-template-columns:1fr!important;grid-template-rows:1fr!important}.frameWrap{padding:0!important;background:#fff!important}#pv{width:1280px!important;height:800px!important;border-radius:0!important;box-shadow:none!important}.toast{display:none!important}' });
const tpls = await pg.evaluate(() => PB.templates.map(t => t.id));
for (let i = 0; i < tpls.length; i++) {
  if (only.length && !only.includes(tpls[i])) continue;
  await pg.evaluate(i => PB.ux.useTemplate(i), i);
  const pages = await pg.evaluate(() => PB.app.site.pages.map(p => p.id));
  for (const pid of pages) {
    await pg.evaluate(id => PB.app.goPage(id), pid);
    await pg.waitForTimeout(2800);
    const png = path.join(OUT, tpls[i] + '-' + pid + '.png');
    await pg.locator('#pv').screenshot({ path: png });
    execFileSync('python3', ['-c', 'import sys;from PIL import Image;im=Image.open(sys.argv[1]).convert("RGB");im=im.resize((560,350),Image.LANCZOS);im.save(sys.argv[2],"WEBP",quality=62,method=6)', png, png.replace(/\.png$/, '.webp')]);
    fs.unlinkSync(png);
    console.log('thumb', tpls[i], pid);
  }
}
await br.close();
