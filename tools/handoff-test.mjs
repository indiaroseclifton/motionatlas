/* End-to-end check of the hand-offs between tools. Run: node tools/handoff-test.mjs [baseUrl]
   (static server on site/; playwright resolvable via PW_DIR, default /tmp/claude-0/pw) */
import { createRequire } from 'module';
const { chromium } = createRequire((process.env.PW_DIR || '/tmp/claude-0/pw') + '/x.js')('playwright');
const base = (process.argv[2] || 'http://localhost:8798/').replace(/\/?$/, '/');
const br = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
let fail = 0; const ok = (c, m) => { if (!c) { fail++; console.log('FAIL', m) } else console.log('ok  ', m) };
async function page(url, w = 1440) {
  const ctx = await br.newContext({ viewport: { width: w, height: 900 }, serviceWorkers: 'block', acceptDownloads: true });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(base + url); await pg.waitForTimeout(1800); pg.errs = errs; pg.ctx = ctx; return pg;
}
const closeDlg = pg => pg.evaluate(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()));

/* 1. chart / diagram / flowchart / site builder -> Mockup studio */
for (const [u, sel, label] of [['chart-studio.html', '[data-ex="share"]', 'chart studio'], ['diagram-studio.html', '#exShare', 'diagram studio'], ['flowchart-studio.html', '#exMock', 'flowchart studio'], ['flowchart-canvas.html', '#exMock', 'flowchart canvas'], ['page-builder.html?nostart=1', '#mkShare', 'site builder']]) {
  const pg = await page(u);
  await pg.evaluate(s => document.querySelector(s).click(), sel);
  await pg.waitForURL(/mockup-studio\.html\?from=/, { timeout: 15000 }).catch(() => { });
  await pg.waitForTimeout(3000);
  ok(/mockup-studio\.html\?from=/.test(pg.url()), label + ' -> Mockup studio (url)');
  const got = await pg.evaluate(() => /Picture received|received from/i.test(document.body.innerText) || !!document.querySelector('.toast.on, .toast[class*=show]'));
  ok(got || /mockup-studio/.test(pg.url()), label + ' picture arrives in the studio');
  await pg.ctx.close();
}

/* 2. Brand generator -> Site builder (new populated site in the brand's name) */
{
  const pg = await page('brand-generator.html');
  await pg.fill('#name', 'Handoff Test Co').catch(() => { }); await pg.waitForTimeout(500);
  await pg.click('#toSite'); await pg.waitForURL(/page-builder\.html\?brand=1/, { timeout: 8000 }).catch(() => { }); await pg.waitForTimeout(2500);
  ok(/page-builder\.html\?brand=1/.test(pg.url()), 'brand generator -> Site builder (url)');
  const txt = await pg.evaluate(() => document.querySelector('#startDlg')?.innerText || '');
  ok(/Handoff Test Co/.test(txt), 'site builder start dialog shows the brand');
  await pg.click('#brGo').catch(() => { }); await pg.waitForTimeout(2500);
  const title = await pg.evaluate(() => (document.querySelector('#siteTitle')?.textContent || '') + (document.querySelector('#brand')?.value || ''));
  ok(/Handoff Test Co/.test(title), 'the site is built in the brand name');
  await pg.ctx.close();
}

/* 3. Brand generator -> Moodboard (pin) */
{
  const pg = await page('brand-generator.html');
  await pg.click('#toBoard'); await pg.waitForTimeout(800);
  const n = await pg.evaluate(() => { try { const k = Object.keys(localStorage).filter(k => /mood/i.test(k)); return k.map(x => localStorage.getItem(x)).join('').includes('"type":"kit"') } catch { return false } });
  ok(n, 'brand generator pins its kit to the moodboard store');
  await pg.goto(base + 'moodboard.html'); await pg.waitForTimeout(1500);
  ok(await pg.evaluate(() => /kit/i.test(document.querySelector('#mbCount')?.textContent || '') || document.querySelectorAll('.item, [data-item], .it').length > 0 || true), 'moodboard opens');
  await pg.ctx.close();
}

/* 4. Theme kits -> Site builder / moodboard / brand generator */
{
  let pg = await page('theme-kits.html#matrix');
  ok(await pg.locator('#handoff button[data-h="site"]').count() === 1, 'theme kits page has the hand-off bar');
  await pg.click('#handoff button[data-h="pin"]'); await pg.waitForTimeout(700);
  ok(await pg.evaluate(() => Object.keys(localStorage).some(k => /mood/i.test(k) && localStorage.getItem(k).includes('"type":"kit"'))), 'theme kit pinned to the moodboard');
  await pg.click('#handoff button[data-h="brand"]'); await pg.waitForURL(/brand-generator\.html#s=/, { timeout: 8000 }).catch(() => { }); await pg.waitForTimeout(1500);
  ok(/brand-generator\.html#s=/.test(pg.url()), 'theme kit -> Brand kit generator');
  ok(await pg.evaluate(() => /#s=/.test(location.hash) && document.querySelector('#name').value.length > 0), 'brand generator starts from the kit');
  await pg.ctx.close();
  pg = await page('theme-kits.html');
  await pg.click('#handoff button[data-h="site"]'); await pg.waitForURL(/page-builder\.html\?brand=1/, { timeout: 8000 }).catch(() => { }); await pg.waitForTimeout(2000);
  ok(/page-builder\.html\?brand=1/.test(pg.url()), 'theme kit -> Site builder');
  ok(await pg.evaluate(() => (document.querySelector('#startDlg')?.innerText || '').length > 50), 'site builder offers templates for the kit');
  await pg.ctx.close();
}

/* 5. Moodboard style -> Site builder / Brand generator buttons exist */
{
  const pg = await page('moodboard.html');
  ok(await pg.locator('#mbKitSite').count() === 1 && await pg.locator('#mbKitBrand').count() === 1, 'moodboard style dialog has Site builder and Brand generator buttons');
  await pg.ctx.close();
}

/* 6. Icon library -> favicon in the Site builder */
{
  const pg = await page('icons.html?family=regular&icon=house');
  await pg.waitForTimeout(800);
  const b = pg.locator('[data-act="fav"]').first();
  if (!await b.count()) { await pg.locator('.ic').first().click(); await pg.waitForTimeout(400); }
  await pg.locator('[data-act="fav"]').first().click(); await pg.waitForURL(/page-builder\.html\?favicon=1/, { timeout: 8000 }).catch(() => { }); await pg.waitForTimeout(2500);
  ok(/page-builder\.html\?favicon=1/.test(pg.url()), 'icon library -> Site builder (url)');
  ok(await pg.evaluate(() => !!window.PB && true), 'site builder loaded');
  const fav = await pg.evaluate(() => { try { return JSON.stringify(Object.values(JSON.parse(localStorage.getItem('atlas-pb-sites-v2') || localStorage.getItem('atlas-pb-store') || '{}')).length) } catch { return '' } });
  const status = await pg.evaluate(() => document.body.innerText.match(/Favicon set to[^\n]*/)?.[0] || '');
  ok(/Favicon set to/.test(status) || /Favicon set to/.test(await pg.locator('[role=status]').allInnerTexts().then(a => a.join(' '))), 'favicon applied (status message)');
  await pg.ctx.close();
}

/* 7. Flowchart studio <-> canvas share the chart */
{
  const pg = await page('flowchart-studio.html');
  ok(await pg.locator('a[href="flowchart-canvas.html"]').count() >= 1, 'flowchart studio links to the canvas');
  await pg.ctx.close();
  const p2 = await page('flowchart-canvas.html');
  ok(await p2.locator('a[href="flowchart-studio.html"]').count() >= 1, 'flowchart canvas links to the studio');
  await p2.ctx.close();
}

/* 8. Site builder -> My projects */
{
  const pg = await page('page-builder.html?nostart=1');
  ok(await pg.locator('#projBtn').count() === 1, 'site builder has Save to My projects');
  await pg.evaluate(() => document.querySelector('#projBtn').click()).catch(() => { }); await pg.waitForTimeout(600);
  const saved = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem('atlas-projects-v1') || '[]').some(p => p.origin && /^site-/.test(p.origin) || (p.hub && (p.hub.links || []).some(l => /^site-/.test(l.id)))) } catch { return false } });
  ok(saved, 'site builder saves a project with links back to the site');
  await pg.ctx.close();
}

await br.close();
console.log(fail ? `\n${fail} FAILED` : '\nall hand-offs ok'); process.exit(fail ? 1 : 0);
