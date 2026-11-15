// Pre-renders template thumbnails for the site builder start screen: site/builder/thumbs/<template>-<page>.webp (1000x625).
//   cd site && python3 -m http.server 8797 &      # serve the static site
//   BASE=http://localhost:8797/ node tools/builder-thumbs.mjs [templateId ...]     # uses an installed Chrome (tools/cdp.mjs) and python3 with Pillow
import { launch } from './cdp.mjs';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
const BASE = process.env.BASE || 'http://localhost:8797/';
const OUT = process.env.OUT || path.resolve(new URL('../site/builder/thumbs', import.meta.url).pathname);
const only = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const br = await launch({ width: 1280, height: 800 });
const pg = await br.newPage();
await pg.initScript(() => { try { localStorage.setItem('atlas-page-builder-ui', JSON.stringify({ edit: false, w: 'desk' })); } catch (e) {} });
await pg.goto(BASE + 'page-builder.html?nostart=1'); await pg.waitFor(() => document.body.classList.contains('ready'));
await pg.addStyle('.lib,.right,.rail,.insp,header,.bar,.panes,.cvtb{display:none!important}.app{grid-template-columns:1fr!important;grid-template-rows:1fr!important}.frameWrap{padding:0!important;background:#fff!important}#pv{width:1280px!important;height:800px!important;border-radius:0!important;box-shadow:none!important}.toast{display:none!important}');
const tpls = await pg.evaluate(() => PB.templates.map(t => t.id));
for (let i = 0; i < tpls.length; i++) {
  if (only.length && !only.includes(tpls[i])) continue;
  await pg.evaluate(i => { PB.ux.useTemplate(i); }, i);
  const pages = await pg.evaluate(() => PB.app.site.pages.map(p => p.id));
  for (const pid of pages) {
    await pg.evaluate(id => { PB.app.goPage(id); }, pid);
    await pg.wait(2800);
    const png = path.join(OUT, tpls[i] + '-' + pid + '.png');
    await pg.screenshot({ path: png, clip: '#pv' });
    execFileSync('python3', ['-c', 'import sys;from PIL import Image;im=Image.open(sys.argv[1]).convert("RGB");im=im.resize((1000,625),Image.LANCZOS);im.save(sys.argv[2],"WEBP",quality=64,method=6)', png, png.replace(/\.png$/, '.webp')]);
    fs.unlinkSync(png);
    console.log('thumb', tpls[i], pid);
  }
}
await br.close();
