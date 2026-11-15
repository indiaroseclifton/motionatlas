/* Regenerates site/assets/tools/<id>.jpg (640x400) from the live tool pages listed in site/tools-data.js.
   Usage: node tools/tool-thumbs.mjs [baseUrl] [id ...]   (static server on site/ required; uses an installed Chrome, see tools/cdp.mjs) */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { launch } from './cdp.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');
const base = (process.argv[2] || 'http://localhost:8798/').replace(/\/?$/, '/');
const only = process.argv.slice(3);
const ctxv = { window: {}, fetch: () => Promise.reject(), location: {} }; vm.createContext(ctxv);
vm.runInContext(fs.readFileSync(path.join(root, 'tools-data.js'), 'utf8'), ctxv);
const tools = ctxv.window.ATLAS_TOOLS.list;
const br = await launch({ width: 1280, height: 800, scale: 0.5 });   // 1280 x 800 drawn at half size = 640 x 400
for (const t of tools) {
  if (only.length && !only.includes(t.id)) continue;
  const pg = await br.newPage();
  await pg.goto(base + t.href); await pg.wait(3000);
  if (t.id === 'site-builder') { await pg.evaluate(() => { document.querySelectorAll('dialog[open]').forEach(d => d.close()); }); await pg.wait(600); }
  if (['backgrounds', 'effects', 'components', 'motion', 'playground'].includes(t.id)) { await pg.evaluate(() => scrollTo(0, 430)); await pg.wait(1500); }
  await pg.screenshot({ path: path.join(root, 'assets/tools', t.id + '.jpg'), type: 'jpeg', quality: 74 });
  await pg.close(); console.log('ok', t.id);
}
await br.close();
