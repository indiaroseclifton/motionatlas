#!/usr/bin/env node
/* QA for the chart studio, the diagram studio, the flowchart studio and the chart style guides.
   For 1440×900 and 390×844: every chart type and every diagram type renders in three styles without console
   errors or NaN, exports produce non-empty files, axe finds no serious or critical issues, and nothing scrolls
   sideways. Also checks share links round-trip, the text import round-trips, the keyboard cursor and canvas
   click-to-edit.

   Usage:  (cd site && python3 -m http.server 8772) &   node tools/dataviz-test.mjs
   Env:    BASE=http://localhost:8772  PW=<path to playwright index.mjs>  AXE=<path to axe.min.js>  QUICK=1 (one viewport) */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const BASE = process.env.BASE || 'http://localhost:8772';
const tryPaths = [process.env.PW, 'playwright', '/tmp/claude-0/pw/node_modules/playwright/index.mjs'].filter(Boolean);
let chromium;
for (const p of tryPaths) { try { ({ chromium } = await import(p)); break; } catch {} }
if (!chromium) { console.error('Playwright not found; set PW=/path/to/playwright/index.mjs'); process.exit(2); }
const axePath = [process.env.AXE, '/tmp/claude-0/pw/node_modules/axe-core/axe.min.js', path.resolve('node_modules/axe-core/axe.min.js')].filter(Boolean).find(p => { try { return fs.existsSync(p); } catch { return false; } });
const axeSrc = axePath ? fs.readFileSync(axePath, 'utf8') : null;
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(p => fs.existsSync(p));
const browser = await chromium.launch(exe ? { executablePath: exe } : {});

const VIEWPORTS = process.env.QUICK ? [[1440, 900]] : [[1440, 900], [390, 844]];
const CHART_STYLES = ['noir', 'editorial', 'sketch'];
const DIAGRAM_STYLES = ['paper', 'pastel', 'blueprint'];
let fails = 0; const log = []; const note = (ok, msg) => { if (!ok) fails++; log.push(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) console.log('FAIL', msg); };

async function newPage(vw, vh) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, acceptDownloads: true });
  try { await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE }); } catch {}
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|fonts\.g|ERR_|net::/.test(m.text())) errors.push('console: ' + m.text().slice(0, 200)); });
  return { ctx, page, errors };
}
async function axe(page, label) {
  if (!axeSrc) { note(true, `${label}: axe skipped (axe-core not found)`); return; }
  await page.evaluate(axeSrc);
  const res = await page.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations.filter(v => v.impact === 'serious' || v.impact === 'critical').map(v => `${v.id} (${v.impact}) ×${v.nodes.length}: ${v.nodes[0]?.target}`));
  note(!res.length, `${label}: axe serious/critical ${res.length ? res.join(' | ') : 'none'}`);
}
const overflow = page => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
async function download(page, trigger, label, min = 200) {
  try {
    const [d] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), trigger()]);
    const p = await d.path(); const size = p ? fs.statSync(p).size : 0;
    note(size >= min, `${label}: ${d.suggestedFilename()} ${size} bytes`);
  } catch (e) { note(false, `${label}: no download (${e.message.split('\n')[0]})`); }
}

for (const [vw, vh] of VIEWPORTS) {
  const tag = `${vw}px`;
  /* ---------------- chart studio ---------------- */
  {
    const { ctx, page, errors } = await newPage(vw, vh);
    await page.goto(`${BASE}/chart-studio.html`); await page.waitForTimeout(1200);
    const kinds = await page.evaluate(() => DVChartMaker.KINDS.map(k => k.id));
    const FALLBACK = { stacked100: 'hours', barStacked: 'hours', pie: 'share', area: 'views', stackedArea: 'hours', column: 'quarters' };
    let rendered = 0, bad = [];
    for (const style of CHART_STYLES) for (const kind of kinds) {
      const r = await page.evaluate(([kind, style, FB]) => {
        const smp = DVChartMaker.SAMPLES.find(s => s.kind === kind) || DVChartMaker.SAMPLES.find(s => s.id === FB[kind]);
        ChartStudio.set({ sample: smp.id }); const last = ChartStudio.set({ kind, style });
        const el = document.querySelector('#chart svg'); const b = el && el.getBoundingClientRect();
        return { len: last.svg.length, nan: /NaN|undefined|Infinity/.test(last.svg), w: b ? b.width : 0, h: b ? b.height : 0, marks: el ? el.querySelectorAll('[data-tip]').length : 0, desc: last.desc.length, role: el && el.getAttribute('role'), warn: last.warnings };
      }, [kind, style, FALLBACK]);
      rendered++;
      if (r.len < 800 || r.nan || r.w < 200 || r.h < 100 || r.role !== 'img' || r.desc < 20) bad.push(`${style}/${kind} ${JSON.stringify(r)}`);
    }
    note(!bad.length, `${tag} chart studio: ${rendered} renders (${kinds.length} types × ${CHART_STYLES.length} styles)${bad.length ? ': ' + bad.slice(0, 4).join(' ; ') : ''}`);
    /* light and dark modes computed from a style, and the palette check */
    const modes = await page.evaluate(() => ['light', 'dark'].map(mode => { ChartStudio.set({ sample: 'views' }); ChartStudio.set({ kind: 'line', style: 'workflow', mode }); const l = ChartStudio.last; const v = DVChartMaker.validate(l.palette, { mode: l.style.t.dark ? 'dark' : 'light', surface: l.surface, pairs: l.pairs }); return { mode, dark: !!l.style.t.dark, ok: v.ok, cvd: +v.cvd.toFixed(1) }; }));
    note(modes[0].dark === false && modes[1].dark === true && modes.every(m => m.ok), `${tag} chart studio: computed light/dark modes validate ${JSON.stringify(modes)}`);
    await page.evaluate(() => ChartStudio.set({ mode: 'auto', style: 'paper', sample: 'views', kind: 'line' }));
    /* keyboard cursor over the marks */
    await page.focus('#fig'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200);
    const kb = await page.evaluate(() => ({ tip: document.getElementById('tip').classList.contains('on'), live: document.getElementById('live').textContent }));
    note(kb.tip && /2 of/.test(kb.live), `${tag} chart studio: arrow keys step through marks ("${kb.live.slice(0, 60)}")`);
    await page.keyboard.press('Escape');
    /* share link round trip */
    const share = await page.evaluate(async () => { const tok = await ChartStudio.packState(); const back = await ChartStudio.unpack(tok); return JSON.stringify(back) === JSON.stringify(ChartStudio.state) ? tok.length : -1; });
    note(share > 0, `${tag} chart studio: share link round-trips (${share} chars)`);
    /* data in: parse CSV/TSV/JSON and the paste dialog */
    const parse = await page.evaluate(() => { const M = DVChartMaker; const a = M.parse('Month\tA\tB\nJan\t1,200\t£3\nFeb\t1.5k\t45%'); const b = M.parse('[{"x":"a","v":1},{"x":"b","v":2}]'); return [a.rows.length, M.parseNum(a.rows[1][1]), b.columns.join(), M.infer(a).join()]; });
    note(parse[0] === 2 && parse[1] === 1500 && parse[2] === 'x,v' && parse[3] === 'time,num,num', `${tag} chart studio: TSV/JSON parsing ${JSON.stringify(parse)}`);
    /* every tab: overflow and axe */
    for (const t of ['data', 'chart', 'style', 'notes', 'check']) {
      await page.click(`#t-${t}`); await page.waitForTimeout(150);
      const ov = await overflow(page); note(ov <= 0, `${tag} chart studio [${t} tab]: horizontal overflow ${ov}px`);
    }
    await page.click('#t-chart'); await page.click('#tableToggle'); await page.waitForTimeout(100);
    await axe(page, `${tag} chart studio (line, chart tab, data table on)`);
    await page.evaluate(() => ChartStudio.set({ sample: 'share', kind: 'donut', style: 'noir' })); await page.click('#t-style');
    await axe(page, `${tag} chart studio (donut, noir, style tab)`);
    await page.evaluate(() => ChartStudio.set({ sample: 'views', kind: 'line', style: 'editorial', notes: [{ type: 'point', row: 9, series: 0, text: 'Autumn push' }, { type: 'line', value: 60, text: 'Target' }] }));
    const ann = await page.evaluate(() => document.querySelector('#chart svg .notes')?.textContent || '');
    note(/Autumn push/.test(ann) && /Target/.test(ann), `${tag} chart studio: callout and reference line drawn`);
    /* exports */
    if (vw < 600) { await page.evaluate(() => document.getElementById('side').classList.remove('open')); }
    for (const [k, min] of [['svg', 2000], ['png', 5000], ['csv', 50], ['embed', 2000]]) {
      await download(page, async () => { await page.click('#exportMenu > summary'); await page.click(`[data-ex="${k}"]`); }, `${tag} chart studio export ${k}`, min);
    }
    if (vw >= 1000) {
      await download(page, async () => { await page.click('#exportMenu > summary'); await page.click('[data-ex="gif"]'); }, `${tag} chart studio export GIF build-up`, 5000);
      await download(page, async () => { await page.click('#exportMenu > summary'); await page.click('[data-ex="video"]'); }, `${tag} chart studio export video build-up`, 5000);
    }
    note(!errors.length, `${tag} chart studio: console errors ${errors.length ? errors.slice(0, 3).join(' | ') : 'none'}`);
    await ctx.close();
  }
  /* ---------------- diagram studio ---------------- */
  {
    const { ctx, page, errors } = await newPage(vw, vh);
    await page.goto(`${BASE}/diagram-studio.html`); await page.waitForTimeout(1200);
    const kinds = await page.evaluate(() => Diagrams.KINDS.map(k => k.id));
    let bad = [], n = 0;
    for (const style of DIAGRAM_STYLES) for (const kind of kinds) {
      const r = await page.evaluate(([kind, style]) => { const l = DiagramStudio.set({ kind, style }); const el = document.querySelector('#paper svg'); return { len: l.svg.length, nan: /NaN|undefined|Infinity/.test(l.svg), w: l.width, h: l.height, dom: !!el, refs: el ? el.querySelectorAll('[data-ref]').length : 0 }; }, [kind, style]);
      n++; if (r.len < 800 || r.nan || !r.dom || r.w < 200 || r.h < 100) bad.push(`${style}/${kind} ${JSON.stringify(r)}`);
    }
    note(!bad.length, `${tag} diagram studio: ${n} renders (${kinds.length} types × ${DIAGRAM_STYLES.length} styles)${bad.length ? ': ' + bad.slice(0, 4).join(' ; ') : ''}`);
    /* text import round trip for every type */
    const rt = await page.evaluate(() => Diagrams.KINDS.map(k => { DiagramStudio.set({ kind: k.id }); const io = DiagramStudio.io(); const text = io.toText(DiagramStudio.state.docs[k.id].data); const back = io.parse(text); const r = Diagrams.render(k.id, back, DVStyle('paper'), {}); return [k.id, text.length > 10 && r.svg.length > 800 && !/NaN|undefined/.test(r.svg)]; }).filter(x => !x[1]).map(x => x[0]));
    note(!rt.length, `${tag} diagram studio: text export → import round-trips for every type${rt.length ? ' except ' + rt.join(', ') : ''}`);
    const mm = await page.evaluate(() => { const s = DiagramStudio.io; DiagramStudio.set({ kind: 'sequence' }); const d = Diagrams.more.sequence.parse('sequenceDiagram\nparticipant Alice\nAlice->>Bob: Hi\nBob-->>Alice: Hello\nNote over Bob: thinks'); const e = Diagrams.more.er.parse('erDiagram\nCUSTOMER ||--o{ ORDER : places\nCUSTOMER {\n int id PK\n string name\n}'); return [d.actors.length, d.messages.length, d.messages[1].type, e.tables.length, e.rels[0].card, e.tables[0].fields.split('\n').length]; });
    note(JSON.stringify(mm) === JSON.stringify([2, 3, 'reply', 2, '1-n', 2]), `${tag} diagram studio: Mermaid-like sequence/ER import ${JSON.stringify(mm)}`);
    /* click an element on the canvas to edit it */
    await page.evaluate(() => DiagramStudio.set({ kind: 'timeline', style: 'paper' })); await page.waitForTimeout(150);
    const target = await page.$('#paper svg [data-ref="items:2"]');
    if (target) { const b = await target.boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + 6); await page.waitForTimeout(250); }
    const sel = await page.evaluate(() => { const a = document.activeElement; const li = a && a.closest('li[data-li]'); return li ? li.dataset.li + ':' + li.dataset.ix : (a ? a.tagName : ''); });
    note(sel === 'items:2', `${tag} diagram studio: clicking a milestone on the canvas opens it in the editor (${sel})`);
    /* drag to reorder (pointer) and undo */
    const before = await page.evaluate(() => DiagramStudio.state.docs.timeline.data.items.map(i => i.label).join('|'));
    const h0 = await page.$('#ed li[data-drag="items:0"] .drag'), l2 = await page.$('#ed li[data-drag="items:2"]');
    if (h0 && l2) { await h0.scrollIntoViewIfNeeded(); const a = await h0.boundingBox(); await l2.scrollIntoViewIfNeeded(); const a2 = await h0.boundingBox(); const b = await l2.boundingBox(); await page.mouse.move(a2.x + a2.width / 2, a2.y + a2.height / 2); await page.mouse.down(); await page.mouse.move(b.x + 20, b.y + 10, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(200); }
    const after = await page.evaluate(() => DiagramStudio.state.docs.timeline.data.items.map(i => i.label).join('|'));
    note(before !== after, `${tag} diagram studio: drag ⋮⋮ reorders items`);
    await page.click('#undo'); await page.waitForTimeout(200);
    const undone = await page.evaluate(() => DiagramStudio.state.docs.timeline.data.items.map(i => i.label).join('|'));
    note(undone === before, `${tag} diagram studio: undo restores the order`);
    /* drag a 2×2 point */
    await page.evaluate(() => DiagramStudio.set({ kind: 'quadrant' })); await page.waitForTimeout(150);
    const pt = await page.$('#paper svg [data-xy="items:0"] circle');
    if (pt) { const b = await pt.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + 60, b.y + 40, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(200); }
    const moved = await page.evaluate(() => { const i = DiagramStudio.state.docs.quadrant.data.items[0]; return [i.x, i.y]; });
    note(moved[0] !== 18 || moved[1] !== 78, `${tag} diagram studio: dragging a 2×2 point re-scores it ${JSON.stringify(moved)}`);
    const share = await page.evaluate(async () => { const tok = await DiagramStudio.pack({ a: DiagramStudio.state.docs.er }); const back = await DiagramStudio.unpack(tok); return JSON.stringify(back.a) === JSON.stringify(DiagramStudio.state.docs.er); });
    note(share, `${tag} diagram studio: share link round-trips`);
    /* templates gallery opens and loads */
    await page.click('#tplOpen'); await page.waitForTimeout(400);
    const tplCount = await page.evaluate(() => document.querySelectorAll('#tplGrid .tpl-card').length);
    note(tplCount >= 1, `${tag} diagram studio: templates gallery shows ${tplCount} template(s) for this type`);
    await axe(page, `${tag} diagram studio (templates dialog)`);
    await page.click('#tplGrid .tpl-card'); await page.waitForTimeout(200);
    const ov = await overflow(page); note(ov <= 0, `${tag} diagram studio: horizontal overflow ${ov}px`);
    await page.evaluate(() => DiagramStudio.set({ kind: 'er', style: 'noir' }));
    await axe(page, `${tag} diagram studio (ER, noir)`);
    for (const [id, min, label] of [['exSvg', 2000, 'SVG'], ['exPng', 5000, 'PNG'], ['exEmbed', 1500, 'embed HTML'], ['exJson', 30, 'text']]) {
      await download(page, async () => { await page.click('#exportMenu > summary'); await page.click('#' + id); }, `${tag} diagram studio export ${label}`, min);
    }
    if (vw >= 1000) await download(page, async () => { await page.evaluate(() => DiagramStudio.set({ kind: 'cycle' })); await page.click('#mvGif'); }, `${tag} diagram studio export GIF build-up`, 5000);
    note(!errors.length, `${tag} diagram studio: console errors ${errors.length ? errors.slice(0, 3).join(' | ') : 'none'}`);
    await ctx.close();
  }
  /* ---------------- flowchart studio ---------------- */
  {
    const { ctx, page, errors } = await newPage(vw, vh);
    await page.goto(`${BASE}/flowchart-studio.html`); await page.waitForTimeout(1500);
    /* every element kind renders in three styles, on the canvas and in the framed export */
    const kinds = await page.evaluate(() => Object.keys(FlowEngine.KIND).filter(k => FlowEngine.KIND[k].tag || ['rect', 'decision', 'pill', 'data', 'io', 'sub', 'round', 'circle'].includes(k)));
    const shapeBad = await page.evaluate(([kinds, styles]) => { const bad = []; const W = { rect: ['[', ']'], decision: ['{', '}'], pill: ['([', '])'], data: ['[(', ')]'], io: ['[/', '/]'], sub: ['[[', ']]'], round: ['(', ')'], circle: ['((', '))'] };
      const src = 'flowchart TD\n' + kinds.map((k, i) => { const K = FlowEngine.KIND[k]; return K.tag ? `  n${i}[${K.name}]:::none.${k}` : `  n${i}${W[k][0]}${K.name}${W[k][1]}`; }).join('\n') + '\n' + kinds.slice(1).map((k, i) => `  n${i} --> n${i + 1}`).join('\n');
      for (const st of styles) for (const canvas of [true, false]) { const r = FlowEngine.render(src, DVStyle(st), { canvas, title: 'Shapes' }); const kindsIn = (r.svg.match(/data-kind="/g) || []).length; if (/NaN|undefined/.test(r.svg) || kindsIn !== kinds.length) bad.push(`${st}/${canvas ? 'canvas' : 'framed'} kinds=${kindsIn}`); }
      return bad; }, [kinds, ['workflow', 'paper', 'blueprint']]);
    note(!shapeBad.length, `${tag} flowchart studio: ${kinds.length} element kinds render in 3 styles${shapeBad.length ? ': ' + shapeBad.join(', ') : ''}`);
    /* shape picker: search, then add */
    await page.click('.rail [data-fly=add]'); await page.waitForTimeout(200);
    await page.fill('#addQ', 'delay'); await page.waitForTimeout(100);
    const found = await page.evaluate(() => [...document.querySelectorAll('#addList [data-add]')].map(b => b.dataset.add));
    await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    const added = await page.evaluate(() => document.querySelectorAll('#paper .fc-n[data-kind="delay"]').length);
    note(found.length === 1 && found[0] === 'delay' && added === 1, `${tag} flowchart studio: shape search finds “delay” and adds it (${found.join(',')}, ${added} on canvas)`);
    await page.keyboard.press('Escape');
    if (vw >= 1000) await axe(page, `${tag} flowchart studio (canvas)`);
    /* Mermaid in, Mermaid out, outline round trip, for every template */
    const rt = await page.evaluate(() => { const bad = []; const sig = src => { const g = FlowEngine.parse(src); return [...g.nodes.values()].map(n => n.label + '/' + FlowEngine.kindOf(n)).sort().join('|') + '#' + g.edges.map(e => e.from + '>' + e.to + ':' + (e.label || '')).sort().join('|'); };
      const sigL = src => { const g = FlowEngine.parse(src); return [...g.nodes.values()].length + '#' + g.edges.length + '#' + g.edges.filter(e => e.label).length; };
      const all = [...FlowTemplates, ...FlowExamples];
      for (const t of all) { try { const a = FlowText.fromMermaid(FlowText.toMermaid(t.src)); if (sig(a) !== sig(FlowText.fromMermaid(t.src))) bad.push('mermaid:' + t.id); const o = FlowText.fromOutline(FlowText.toOutline(t.src)); if (sigL(o) !== sigL(t.src)) bad.push('outline:' + t.id); } catch (e) { bad.push(t.id + ' ' + e.message); } }
      return { n: all.length, bad }; });
    note(!rt.bad.length, `${tag} flowchart studio: Mermaid and outline round-trip for ${rt.n} templates${rt.bad.length ? ': ' + rt.bad.slice(0, 5).join(', ') : ''}`);
    const mm = await page.evaluate(() => { const src = FlowText.fromMermaid('graph LR\nA[Christmas] -->|Get money| B(Go shopping)\nB --> C{Let me think}\nC -->|One| D[Laptop]\nC -->|Two| E[iPhone]\nsubgraph s1 [Shop]\nD\nE\nend\nW@{ shape: delay, label: "Wait" } --> A\nE --o F[(Orders)]'); const g = FlowEngine.parse(src); return [g.dir, g.nodes.size, g.edges.length, g.groups.length, FlowEngine.kindOf(g.nodes.get('W')), g.nodes.get('C').shape, g.edges.find(e => e.to === 'F').head]; });
    note(JSON.stringify(mm) === JSON.stringify(['LR', 7, 6, 1, 'delay', 'decision', 'o']), `${tag} flowchart studio: Mermaid import reads direction, shapes, @{shape}, subgraphs and arrowheads ${JSON.stringify(mm)}`);
    /* import through the panel, then the connectors stay clear of other elements */
    await page.click('.rail [data-fly=text]'); await page.waitForTimeout(150);
    await page.fill('#txIn', 'Customer asks for a refund\nSupport checks the order\nOlder than 30 days?\n  Yes: Explain the policy\n  No: Approve the refund\nFinance pays it back\nCustomer is told [end]');
    await page.click('[data-tx=replace]'); await page.waitForTimeout(500);
    const imp = await page.evaluate(() => { const g = FlowStudio.cv.last().g; return [g.nodes.size, g.edges.length, document.getElementById('title').value]; });
    note(imp[0] === 7 && imp[1] === 6, `${tag} flowchart studio: outline import builds ${imp[0]} elements and ${imp[1]} connections`);
    const cross = await page.evaluate(() => { const L = FlowStudio.cv.last(), g = L.g; let hits = 0, segs = 0; for (const e of g.edges) { if (!e.xy) continue; for (let i = 0; i < e.xy.length - 1; i++) { const [p, q] = [e.xy[i], e.xy[i + 1]]; segs++; for (const n of g.nodes.values()) { if (n.id === e.from || n.id === e.to) continue; const x0 = Math.min(p[0], q[0]), x1 = Math.max(p[0], q[0]), y0 = Math.min(p[1], q[1]), y1 = Math.max(p[1], q[1]); if (x1 > n.x + 2 && x0 < n.x + n.w - 2 && y1 > n.y + 2 && y0 < n.y + n.h - 2) hits++; } } } return { hits, segs }; });
    note(cross.hits === 0 && cross.segs > 0, `${tag} flowchart studio: connectors route round elements (${cross.segs} segments, ${cross.hits} through an element)`);
    /* layout both ways */
    const lay = await page.evaluate(async () => { const r = []; for (const d of ['TB', 'LR']) { document.querySelector(`#dir [data-v="${d}"]`).click(); FlowStudio.cv.unfreeze(); await new Promise(r => setTimeout(r, 250)); const b = FlowStudio.cv.last().bbox; r.push((b.x1 - b.x0) / (b.y1 - b.y0)); } return r; });
    note(lay[1] > lay[0], `${tag} flowchart studio: top-down and left-right layouts (aspect ${lay.map(x => x.toFixed(2)).join(' → ')})`);
    /* align, distribute, group */
    const arr = await page.evaluate(async () => { const cv = FlowStudio.cv, ids = [...cv.last().g.nodes.keys()].slice(0, 3); cv.select(ids); cv.align('left'); await new Promise(r => setTimeout(r, 100)); const xs = ids.map(id => cv.last().g.nodes.get(id).x); const gid = cv.groupSelection('Intake'); await new Promise(r => setTimeout(r, 100)); const g = cv.last().g; return { same: new Set(xs).size === 1, grouped: g.groups.length === 1 && ids.every(id => g.nodes.get(id).group === 'grp_' + gid), bar: !document.getElementById('selbar').hidden || innerWidth < 600 }; });
    note(arr.same && arr.grouped, `${tag} flowchart studio: align left lines up 3 elements and Group wraps them ${JSON.stringify(arr)}`);
    await page.keyboard.press('Escape'); await page.evaluate(() => FlowStudio.cv.close());
    /* presentation steps through every element */
    const pres = await page.evaluate(async () => { FlowStudio.presentStart(); const n = FlowStudio.presenting.order.length; for (let i = 0; i < n; i++) document.getElementById('pNext').click(); await new Promise(r => setTimeout(r, 100)); return [n, FlowStudio.presenting === null]; });
    note(pres[0] === 7 && pres[1], `${tag} flowchart studio: presentation steps through ${pres[0]} elements and ends`);
    const ov = await overflow(page); note(ov <= 0, `${tag} flowchart studio: horizontal overflow ${ov}px`);
    /* exports */
    for (const [id, min, label] of [['exSvg', 2000, 'SVG'], ['exPng', 4000, 'PNG'], ['exMmd', 150, 'Mermaid'], ['exOutline', 100, 'outline'], ['exJson', 300, 'JSON']]) {
      await download(page, async () => { await page.click('#exportBtn'); await page.click('#' + id); }, `${tag} flowchart studio export ${label}`, min);
    }
    note(!errors.length, `${tag} flowchart studio: console errors ${errors.length ? errors.slice(0, 3).join(' | ') : 'none'}`);
    await ctx.close();
  }
  /* ---------------- chart style guides ---------------- */
  {
    const { ctx, page, errors } = await newPage(vw, vh);
    await page.goto(`${BASE}/chart-styles.html#s=calm`); await page.waitForTimeout(1200);
    const link = await page.evaluate(() => document.querySelector('a[href="chart-studio.html?style=calm"]') ? 1 : 0);
    note(link === 1, `${tag} chart style guides: “Open in Chart studio with this style” links to the studio`);
    const ov = await overflow(page); note(ov <= 0, `${tag} chart style guides: horizontal overflow ${ov}px`);
    await axe(page, `${tag} chart style guides (calm)`);
    note(!errors.length, `${tag} chart style guides: console errors ${errors.length ? errors.slice(0, 3).join(' | ') : 'none'}`);
    await ctx.close();
  }
}
await browser.close();
console.log('\n' + log.join('\n'));
console.log(`\n${fails ? `DATAVIZ TEST FAIL (${fails})` : 'DATAVIZ TEST OK'}`);
process.exit(fails ? 1 : 0);
