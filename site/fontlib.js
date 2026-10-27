'use strict';
/* My fonts: fonts the visitor owns, kept ONLY in this browser (IndexedDB, metadata mirrored in localStorage).
   Nothing here ever sends font bytes anywhere: no fetch/XHR/beacon, no upload. Font files are never part of the atlas.
   window.MyFonts: ready, list(), add(files), remove(family), rename(family,label), registerAll(), cssFamily(name,kind),
   toBase64(family), exportFiles(family), fontFaceCSS(families,{mode}), glyphPath(family,text,opts), faceFor(family,weight,italic),
   optgroup(select,{selected}), on(fn)/off(fn), mount(el), openDialog(), persistent, NOTICE, LIMIT.
   Change event: window 'myfonts:change' (also across tabs via BroadcastChannel). */
(() => {
if (window.MyFonts) return;
const LIMIT = 5 * 1024 * 1024, MAXFILES = 120, EXT = /\.(ttf|otf|woff2?)$/i;
const NOTICE = 'Fonts stay in this browser only. Make sure your licence allows the use you plan; exports that embed fonts are your responsibility.';
const LS = 'atlas.myfonts.v1', DB = 'atlas-myfonts', STORE = 'files', NOTE_KEY = 'atlas.myfonts.noticeSeen';
const SELF = (document.currentScript && document.currentScript.src) || '';
const BASE = SELF ? SELF.replace(/[^/]*$/, '') : '';
const MIME = { ttf: 'font/ttf', otf: 'font/otf', woff: 'font/woff', woff2: 'font/woff2' };
const FMT = { ttf: 'truetype', otf: 'opentype', woff: 'woff', woff2: 'woff2' };
let meta = [];                       /* face records, no bytes */
const bytes = new Map();             /* id -> ArrayBuffer */
const parsed = new Map();            /* id -> parsed font (lazy, for outlines) */
const blobUrls = new Map();
const registered = new Map();        /* id -> FontFace */
const subs = new Set();
let persistent = true, idb = null, bc = null;

const lsGet = () => { try { const v = JSON.parse(localStorage.getItem(LS) || '[]'); return Array.isArray(v) ? v : [] } catch (e) { return [] } };
const lsSet = () => { try { localStorage.setItem(LS, JSON.stringify(meta)) } catch (e) { persistent = false } };
function openDB() {
  if (idb) return idb;
  idb = new Promise((res, rej) => {
    try {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => { r.result.createObjectStore(STORE, { keyPath: 'id' }) };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); r.onblocked = () => rej(new Error('blocked'));
    } catch (e) { rej(e) }
  });
  idb.catch(() => { persistent = false });
  return idb;
}
const tx = (mode, fn) => openDB().then(db => new Promise((res, rej) => {
  const t = db.transaction(STORE, mode); const out = fn(t.objectStore(STORE));
  t.oncomplete = () => res(out && 'result' in out ? out.result : undefined); t.onerror = t.onabort = () => rej(t.error);
}));
const dbPut = rec => tx('readwrite', s => { s.put(rec) });
const dbDel = id => tx('readwrite', s => { s.delete(id) });
const dbAll = () => tx('readonly', s => s.getAll());

/* ---------- font parsing (name, OS/2, head, cmap, glyf, hmtx) ---------- */
async function inflate(u8, fmt) {
  if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot read compressed fonts');
  const ds = new DecompressionStream(fmt);
  const w = ds.writable.getWriter(); w.write(u8); w.close();
  return new Uint8Array(await new Response(ds.readable).arrayBuffer());
}
async function readTables(buf) {
  const dv = new DataView(buf), tag = dv.getUint32(0), T = {};
  if (tag === 0x774F4632) { const e = new Error('woff2'); e.woff2 = true; throw e }
  if (tag === 0x774F4646) {                       /* WOFF 1 */
    const n = dv.getUint16(12);
    for (let i = 0; i < n; i++) {
      const o = 44 + i * 20, name = String.fromCharCode(dv.getUint8(o), dv.getUint8(o + 1), dv.getUint8(o + 2), dv.getUint8(o + 3));
      const off = dv.getUint32(o + 4), cl = dv.getUint32(o + 8), ol = dv.getUint32(o + 12);
      let u = new Uint8Array(buf, off, cl); if (cl < ol) u = await inflate(u, 'deflate');
      T[name] = new DataView(u.buffer, u.byteOffset, u.byteLength);
    }
    return T;
  }
  if (tag !== 0x00010000 && tag !== 0x4F54544F && tag !== 0x74727565) throw new Error('Not a TrueType/OpenType font');
  const n = dv.getUint16(4);
  for (let i = 0; i < n; i++) {
    const o = 12 + i * 16, name = String.fromCharCode(dv.getUint8(o), dv.getUint8(o + 1), dv.getUint8(o + 2), dv.getUint8(o + 3));
    const off = dv.getUint32(o + 8), len = dv.getUint32(o + 12);
    if (off + len > buf.byteLength) throw new Error('The font file is truncated');
    T[name] = new DataView(buf, off, len);
  }
  return T;
}
function readNames(t) {
  const out = {}; if (!t) return out;
  const count = t.getUint16(2), so = t.getUint16(4);
  for (let i = 0; i < count; i++) {
    const o = 6 + i * 12, pid = t.getUint16(o), eid = t.getUint16(o + 2), lid = t.getUint16(o + 4), nid = t.getUint16(o + 6), len = t.getUint16(o + 8), off = t.getUint16(o + 10);
    if (so + off + len > t.byteLength) continue;
    let s = '';
    if (pid === 3 || pid === 0) for (let k = 0; k < len; k += 2) s += String.fromCharCode(t.getUint16(so + off + k));
    else if (pid === 1 && eid === 0) for (let k = 0; k < len; k++) s += String.fromCharCode(t.getUint8(so + off + k));
    else continue;
    s = s.replace(/\0/g, '').trim(); if (!s) continue;
    const rank = (pid === 3 && lid === 0x409) ? 3 : pid === 3 ? 2 : pid === 0 ? 2 : 1;
    if (!out[nid] || out[nid].rank < rank) out[nid] = { s, rank };
  }
  const r = {}; for (const k in out) r[k] = out[k].s; return r;
}
const WORDS = [[/thin|hairline/i, 100], [/extra.?light|ultra.?light/i, 200], [/light/i, 300], [/regular|normal|book|roman/i, 400], [/medium/i, 500], [/semi.?bold|demi.?bold/i, 600], [/extra.?bold|ultra.?bold|heavy/i, 800], [/black/i, 900], [/bold/i, 700]];
function weightFromWords(s) { for (const [re, w] of WORDS) if (re.test(s)) return w; return 400 }
async function parseFont(buf, filename) {
  const ext = (filename.match(/\.(\w+)$/) || [, ''])[1].toLowerCase();
  let T;
  try { T = await readTables(buf) } catch (e) {
    if (!e.woff2) throw e;
    /* WOFF2 needs Brotli; the browser can still render it, so take names from the file name */
    const base = filename.replace(/\.\w+$/, '');
    const m = base.match(/^(.*?)[-_ ]+([A-Za-z ]*)$/); const fam = (m ? m[1] : base).replace(/[-_]+/g, ' ').trim() || base, style = m ? m[2] : 'Regular';
    return { family: fam, style: style || 'Regular', weight: weightFromWords(style), italic: /italic|oblique/i.test(style), kind: 'sans-serif', ext: 'woff2', fromName: true };
  }
  const nm = readNames(T.name);
  const family = nm[16] || nm[1], style = nm[17] || nm[2] || 'Regular';
  if (!family) throw new Error('No font name found inside the file');
  let weight = 0, italic = false, kind = 'sans-serif';
  const os = T['OS/2'];
  if (os && os.byteLength >= 64) {
    weight = os.getUint16(4); italic = !!(os.getUint16(62) & 1);
    if (os.byteLength >= 42) {
      const fam = os.getUint8(32), ser = os.getUint8(34), prop = os.getUint8(35);
      if (prop === 9) kind = 'monospace'; else if (fam === 2) kind = (ser >= 2 && ser <= 10) || ser === 14 ? 'serif' : 'sans-serif';
      else if (fam === 3) kind = 'cursive'; else if (fam === 4) kind = 'fantasy';
    }
  }
  if (T.head && T.head.byteLength >= 46) { const ms = T.head.getUint16(44); if (ms & 2) italic = true; if (!weight && (ms & 1)) weight = 700 }
  if (!weight || weight < 1 || weight > 1000) weight = weightFromWords(style);
  if (/italic|oblique/i.test(style)) italic = true;
  const hasOutlines = !!(T.glyf && T.loca && T.cmap && T.head && T.hmtx && T.hhea && T.maxp);
  return { family: family.trim(), style, weight: Math.round(weight), italic, kind, ext: ext || 'ttf', hasOutlines, glyphs: T.maxp ? T.maxp.getUint16(4) : 0 };
}

/* glyph outlines (TrueType glyf only; CFF fonts fall back to embedding) */
function buildOutliner(T) {
  const head = T.head, upm = head.getUint16(18), longLoca = head.getInt16(50) === 1, nGlyph = T.maxp.getUint16(4);
  const nHM = T.hhea.getUint16(34), asc = T.hhea.getInt16(4), desc = T.hhea.getInt16(6);
  const cmaps = []; const ct = T.cmap, nt = ct.getUint16(2);
  for (let i = 0; i < nt; i++) cmaps.push({ pid: ct.getUint16(4 + i * 8), eid: ct.getUint16(6 + i * 8), off: ct.getUint32(8 + i * 8) });
  cmaps.sort((a, b) => score(b) - score(a)); function score(c) { return c.pid === 3 && c.eid === 10 ? 4 : c.pid === 3 && c.eid === 1 ? 3 : c.pid === 0 ? 2 : c.pid === 3 && c.eid === 0 ? 1 : 0 }
  function gid(cp) {
    for (const c of cmaps) {
      const o = c.off, f = ct.getUint16(o);
      if (f === 4) {
        const sc = ct.getUint16(o + 6) / 2, endO = o + 14, startO = endO + sc * 2 + 2, deltaO = startO + sc * 2, rangeO = deltaO + sc * 2;
        for (let i = 0; i < sc; i++) if (cp <= ct.getUint16(endO + i * 2)) {
          const st = ct.getUint16(startO + i * 2); if (cp < st) break;
          const ro = ct.getUint16(rangeO + i * 2), dl = ct.getInt16(deltaO + i * 2);
          if (!ro) return (cp + dl) & 0xFFFF;
          const p = rangeO + i * 2 + ro + (cp - st) * 2; if (p + 2 > ct.byteLength) break;
          const g = ct.getUint16(p); return g ? (g + dl) & 0xFFFF : 0;
        }
      } else if (f === 12) {
        const n = ct.getUint32(o + 12);
        for (let i = 0; i < n; i++) { const b = o + 16 + i * 12, s = ct.getUint32(b), e = ct.getUint32(b + 4); if (cp >= s && cp <= e) return ct.getUint32(b + 8) + cp - s }
      } else if (f === 0 && cp < 256) return ct.getUint8(o + 6 + cp);
    }
    return 0;
  }
  const adv = g => { const i = Math.min(g, nHM - 1); return T.hmtx.getUint16(i * 4) };
  const loca = g => longLoca ? T.loca.getUint32(g * 4) : T.loca.getUint16(g * 2) * 2;
  function contours(g, depth) {                     /* -> array of arrays of {x,y,on} in font units */
    if (g >= nGlyph || depth > 6) return [];
    const a = loca(g), b = loca(g + 1); if (b <= a) return [];
    const d = new DataView(T.glyf.buffer, T.glyf.byteOffset + a, b - a), nc = d.getInt16(0);
    if (nc >= 0) {
      let p = 10; const ends = []; for (let i = 0; i < nc; i++) { ends.push(d.getUint16(p)); p += 2 }
      const n = nc ? ends[nc - 1] + 1 : 0; p += 2 + d.getUint16(p);
      const fl = []; while (fl.length < n) { const f = d.getUint8(p++); fl.push(f); if (f & 8) { let r = d.getUint8(p++); while (r-- && fl.length < n) fl.push(f) } }
      const xs = [], ys = []; let v = 0;
      for (let i = 0; i < n; i++) { const f = fl[i]; if (f & 2) { const dx = d.getUint8(p++); v += f & 16 ? dx : -dx } else if (!(f & 16)) { v += d.getInt16(p); p += 2 } xs.push(v) }
      v = 0;
      for (let i = 0; i < n; i++) { const f = fl[i]; if (f & 4) { const dy = d.getUint8(p++); v += f & 32 ? dy : -dy } else if (!(f & 32)) { v += d.getInt16(p); p += 2 } ys.push(v) }
      const out = []; let s = 0;
      for (const e of ends) { const c = []; for (let i = s; i <= e; i++) c.push({ x: xs[i], y: ys[i], on: !!(fl[i] & 1) }); out.push(c); s = e + 1 }
      return out;
    }
    let p = 10, more = true; const out = [];
    while (more) {
      const f = d.getUint16(p), gi = d.getUint16(p + 2); p += 4; let dx, dy;
      if (f & 1) { dx = d.getInt16(p); dy = d.getInt16(p + 2); p += 4 } else { dx = d.getInt8(p); dy = d.getInt8(p + 1); p += 2 }
      let a1 = 1, b1 = 0, c1 = 0, d1 = 1;
      if (f & 8) { a1 = d1 = d.getInt16(p) / 16384; p += 2 } else if (f & 0x40) { a1 = d.getInt16(p) / 16384; d1 = d.getInt16(p + 2) / 16384; p += 4 } else if (f & 0x80) { a1 = d.getInt16(p) / 16384; b1 = d.getInt16(p + 2) / 16384; c1 = d.getInt16(p + 4) / 16384; d1 = d.getInt16(p + 6) / 16384; p += 8 }
      if (!(f & 2)) { dx = 0; dy = 0 }
      for (const c of contours(gi, depth + 1)) out.push(c.map(q => ({ x: a1 * q.x + c1 * q.y + dx, y: b1 * q.x + d1 * q.y + dy, on: q.on })));
      more = !!(f & 0x20);
    }
    return out;
  }
  return { upm, asc, desc, gid, adv, contours };
}
function contourPath(c, k, ox, oy) {
  const n = c.length; if (n < 2) return '';
  const X = v => +(ox + v * k).toFixed(2), Y = v => +(oy - v * k).toFixed(2);
  let st = c.findIndex(q => q.on), pts = c;
  if (st < 0) { const a = c[0], b = c[n - 1]; pts = [{ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, on: true }, ...c]; st = 0 } else pts = c.slice(st).concat(c.slice(0, st));
  let d = 'M' + X(pts[0].x) + ' ' + Y(pts[0].y), i = 1; const m = pts.length;
  while (i <= m) {
    const q = pts[i % m];
    if (q.on) { d += 'L' + X(q.x) + ' ' + Y(q.y); i++; continue }
    const nx = pts[(i + 1) % m];
    if (nx.on) { d += 'Q' + X(q.x) + ' ' + Y(q.y) + ' ' + X(nx.x) + ' ' + Y(nx.y); i += 2 }
    else { const mx = (q.x + nx.x) / 2, my = (q.y + nx.y) / 2; d += 'Q' + X(q.x) + ' ' + Y(q.y) + ' ' + X(mx) + ' ' + Y(my); i++ }
  }
  return d + 'Z';
}

/* ---------- zip reader (stored + deflate) ---------- */
async function unzip(file) {
  const buf = await file.arrayBuffer(), dv = new DataView(buf), out = [];
  let e = -1; for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 66000); i--) if (dv.getUint32(i, true) === 0x06054b50) { e = i; break }
  if (e < 0) throw new Error('Not a readable zip');
  const n = dv.getUint16(e + 10, true); let p = dv.getUint32(e + 16, true); const dec = new TextDecoder();
  for (let i = 0; i < n && out.length < MAXFILES; i++) {
    if (dv.getUint32(p, true) !== 0x02014b50) break;
    const method = dv.getUint16(p + 10, true), cs = dv.getUint32(p + 20, true), us = dv.getUint32(p + 24, true), nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lo = dv.getUint32(p + 42, true);
    const name = dec.decode(new Uint8Array(buf, p + 46, nl)); p += 46 + nl + el + cl;
    if (!EXT.test(name) || /(^|\/)(__MACOSX|\.)/.test(name) || us > LIMIT) { if (EXT.test(name) && us > LIMIT) out.push({ name: name.split('/').pop(), error: 'larger than 5 MB' }); continue }
    const ds = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true);
    try {
      let u = new Uint8Array(buf, ds, cs); if (method === 8) u = await inflate(u, 'deflate-raw'); else if (method !== 0) throw new Error('unsupported zip compression');
      out.push({ name: name.split('/').pop(), buf: u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength) });
    } catch (err) { out.push({ name: name.split('/').pop(), error: err.message }) }
  }
  return out;
}

/* ---------- store ---------- */
const uid = () => 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const fam = name => meta.find(m => m.family === name || m.display === name) && (meta.find(m => m.family === name || m.display === name).family);
const publish = () => { lsSet(); emit(); try { bc && bc.postMessage('change') } catch (e) { } };
function emit() { for (const f of [...subs]) { try { f() } catch (e) { } } try { window.dispatchEvent(new CustomEvent('myfonts:change')) } catch (e) { } }

function register(m) {
  if (registered.has(m.id) || !bytes.has(m.id) || typeof FontFace === 'undefined') return Promise.resolve();
  try {
    const ff = new FontFace(m.family, bytes.get(m.id).slice(0), { weight: String(m.weight), style: m.italic ? 'italic' : 'normal', display: 'swap' });
    registered.set(m.id, ff); document.fonts.add(ff);
    return ff.load().catch(() => { document.fonts.delete(ff); registered.delete(m.id); m.bad = true });
  } catch (e) { return Promise.resolve() }
}
function unregister(id) { const bu = blobUrls.get(id); if (bu) { try { URL.revokeObjectURL(bu) } catch (e) { } blobUrls.delete(id) } const ff = registered.get(id); if (ff) { try { document.fonts.delete(ff) } catch (e) { } registered.delete(id) } }

async function sync() {
  meta = lsGet(); let recs = null;
  try { recs = await dbAll() } catch (e) { persistent = false }
  if (recs) {
    const byId = new Map(recs.map(r => [r.id, r]));
    meta = meta.filter(m => byId.has(m.id));
    for (const r of recs) { if (!meta.find(m => m.id === r.id) && r.meta) meta.push(r.meta); bytes.set(r.id, r.buf) }
    for (const id of [...bytes.keys()]) if (!byId.has(id) && persistent) { bytes.delete(id); unregister(id) }
    lsSet();
  }
  await registerAll();
}
async function registerAll() { await Promise.all(meta.map(register)); }

async function addOne(name, buf, rep) {
  if (!EXT.test(name)) { rep.errors.push({ name, error: 'not a .ttf, .otf, .woff or .woff2 file' }); return }
  if (buf.byteLength > LIMIT) { rep.errors.push({ name, error: 'larger than 5 MB' }); return }
  if (buf.byteLength < 64) { rep.errors.push({ name, error: 'the file is empty or damaged' }); return }
  let info; try { info = await parseFont(buf, name) } catch (e) { rep.errors.push({ name, error: e.message || 'not a usable font' }); return }
  const dup = meta.find(m => m.family === info.family && m.weight === info.weight && m.italic === info.italic);
  const id = dup ? dup.id : uid();
  const old = meta.find(m => m.family === info.family);
  const m = { id, family: info.family, display: old ? old.display : info.family, style: info.style, weight: info.weight, italic: info.italic, kind: info.kind, ext: info.ext, file: name, size: buf.byteLength, hasOutlines: !!info.hasOutlines, added: Date.now() };
  /* check the browser can really use it before keeping it */
  if (typeof FontFace !== 'undefined') { try { const t = new FontFace('mf-test', buf.slice(0)); await t.load() } catch (e) { rep.errors.push({ name, error: 'the browser could not read this font' }); return } }
  if (dup) { unregister(dup.id); meta = meta.filter(x => x.id !== dup.id); parsed.delete(dup.id) }
  bytes.set(id, buf); meta.push(m);
  try { await dbPut({ id, buf, meta: m }) } catch (e) { persistent = false }
  await register(m); rep.added.push(m);
}
async function add(files) {
  const rep = { added: [], errors: [] }; await ready;
  const list = Array.from(files || []);
  for (const f of list) {
    if (rep.added.length + rep.errors.length > MAXFILES) { rep.errors.push({ name: f.name, error: 'too many files at once' }); continue }
    try {
      if (/\.zip$/i.test(f.name)) { for (const z of await unzip(f)) { if (z.error) rep.errors.push({ name: z.name, error: z.error }); else await addOne(z.name, z.buf, rep) } }
      else if (EXT.test(f.name)) { if (f.size > LIMIT) rep.errors.push({ name: f.name, error: 'larger than 5 MB' }); else await addOne(f.name, await f.arrayBuffer(), rep) }
      else if (list.length === 1 || !f.webkitRelativePath) rep.errors.push({ name: f.name, error: 'not a font file' });
    } catch (e) { rep.errors.push({ name: f.name, error: e.message || 'could not be read' }) }
  }
  if (rep.added.length) publish();
  return rep;
}
async function remove(family) {
  await ready; const key = fam(family); if (!key) return false;
  for (const m of meta.filter(x => x.family === key)) { unregister(m.id); bytes.delete(m.id); parsed.delete(m.id); try { await dbDel(m.id) } catch (e) { } }
  meta = meta.filter(x => x.family !== key); publish(); return true;
}
function rename(family, label) {
  const key = fam(family); label = String(label || '').trim().slice(0, 60); if (!key || !label) return false;
  meta.forEach(m => { if (m.family === key) m.display = label });
  meta.filter(m => m.family === key).forEach(m => { dbPut({ id: m.id, buf: bytes.get(m.id), meta: m }).catch(() => { }) });
  publish(); return true;
}

function list() {
  const g = new Map();
  for (const m of meta) { if (!g.has(m.family)) g.set(m.family, { family: m.family, display: m.display || m.family, kind: m.kind || 'sans-serif', faces: [] }); g.get(m.family).faces.push({ id: m.id, weight: m.weight, italic: m.italic, style: m.style, file: m.file, size: m.size, ext: m.ext, hasOutlines: m.hasOutlines }) }
  const out = [...g.values()].sort((a, b) => a.display.localeCompare(b.display));
  out.forEach(f => f.faces.sort((a, b) => a.weight - b.weight || a.italic - b.italic));
  return out;
}
function cssFamily(name, kind) {
  const key = fam(name) || name, m = meta.find(x => x.family === key);
  const k = kind || (m && m.kind) || 'sans-serif';
  const fb = { serif: 'Georgia, "Times New Roman", serif', 'sans-serif': 'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif', monospace: 'ui-monospace, Menlo, Consolas, monospace', cursive: 'cursive, Georgia, serif', fantasy: 'Georgia, serif' }[k] || 'system-ui, sans-serif';
  return '"' + String(key).replace(/["\\]/g, '') + '", ' + fb;
}
const has = name => !!fam(name);
function faceFor(family, weight, italic) {
  const key = fam(family); const fs = meta.filter(m => m.family === key); if (!fs.length) return null;
  weight = weight || 400;
  return fs.slice().sort((a, b) => (Math.abs(a.weight - weight) + (a.italic !== !!italic ? 1000 : 0)) - (Math.abs(b.weight - weight) + (b.italic !== !!italic ? 1000 : 0)))[0];
}
function b64(buf) { const u = new Uint8Array(buf); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s) }
const safe = s => String(s).replace(/[^A-Za-z0-9_.-]+/g, '-').replace(/^-+|-+$/g, '') || 'font';
function faceFile(m) { return safe(m.family) + '-' + m.weight + (m.italic ? 'italic' : '') + '.' + m.ext }
async function toBase64(family) {
  await ready; const key = fam(family);
  return meta.filter(m => m.family === key && bytes.has(m.id)).map(m => ({ id: m.id, weight: m.weight, italic: m.italic, ext: m.ext, mime: MIME[m.ext] || 'font/ttf', format: FMT[m.ext] || 'truetype', filename: faceFile(m), b64: b64(bytes.get(m.id)) }));
}
async function exportFiles(family) {
  await ready; const key = fam(family);
  return meta.filter(m => m.family === key && bytes.has(m.id)).map(m => ({ path: 'fonts/' + faceFile(m), name: faceFile(m), weight: m.weight, italic: m.italic, format: FMT[m.ext] || 'truetype', bytes: new Uint8Array(bytes.get(m.id)) }));
}
/* @font-face rules. mode 'base64' (self-contained, for iframes/SVG/HTML), 'file' (url(fonts/..) next to an exported ZIP) */
function fontFaceCSSSync(families, opt) {
  opt = opt || {}; const mode = opt.mode || 'base64', dir = opt.dir == null ? 'fonts/' : opt.dir; let css = '';
  for (const f of [].concat(families || [])) {
    const key = fam(f); if (!key) continue;
    for (const m of meta.filter(x => x.family === key && bytes.has(x.id))) {
      const src = mode === 'file' ? 'url("' + dir + faceFile(m) + '")' : mode === 'blob' ? 'url(' + blobUrl(m) + ')' : 'url(data:' + (MIME[m.ext] || 'font/ttf') + ';base64,' + b64(bytes.get(m.id)) + ')';
      css += '@font-face{font-family:"' + key + '";font-style:' + (m.italic ? 'italic' : 'normal') + ';font-weight:' + m.weight + ';font-display:swap;src:' + src + ' format("' + (FMT[m.ext] || 'truetype') + '")}\n';
    }
  }
  return css;
}
function blobUrl(m) { if (!blobUrls.has(m.id)) blobUrls.set(m.id, URL.createObjectURL(new Blob([bytes.get(m.id)], { type: MIME[m.ext] || 'font/ttf' }))); return blobUrls.get(m.id) }
async function fontFaceCSS(families, opt) { await ready; return fontFaceCSSSync(families, opt) }
/* outline text: {d, width, ascent, descent, size} with the baseline at y=0, or null if the font has no TrueType outlines.
   prepare(families) parses the files once so glyphPathSync works without awaiting. */
async function prepare(families) {
  await ready;
  for (const f of [].concat(families || [])) for (const m of meta.filter(x => x.family === fam(f) && x.hasOutlines && bytes.has(x.id) && !parsed.has(x.id))) { try { parsed.set(m.id, buildOutliner(await readTables(bytes.get(m.id)))) } catch (e) { } }
}
function glyphPathSync(family, text, o) {
  o = o || {}; const m = faceFor(family, o.weight, o.italic); const P = m && parsed.get(m.id); if (!P) return null;
  const size = o.size || 64, k = size / P.upm, track = (o.tracking || 0) * size; let x = 0, d = '';
  for (const ch of String(text)) {
    const g = P.gid(ch.codePointAt(0));
    if (g) { try { for (const c of P.contours(g, 0)) d += contourPath(c, k, x, 0) } catch (e) { } }
    x += (P.adv(g || 0) * k) + track;
  }
  return { d, width: x, ascent: P.asc * k, descent: -P.desc * k, size };
}
async function glyphPath(family, text, o) { await prepare(family); return glyphPathSync(family, text, o) }
function optgroup(sel, o) {
  o = o || {}; const old = sel.querySelector('optgroup[data-myfonts]'); if (old) old.remove();
  const L = list(); if (!L.length && !o.always) return null;
  const g = document.createElement('optgroup'); g.label = 'My fonts'; g.setAttribute('data-myfonts', '');
  for (const f of L) { const op = document.createElement('option'); op.value = o.prefix ? o.prefix + f.family : f.family; op.textContent = f.display + ' (mine)'; op.setAttribute('data-myfont', f.family); g.appendChild(op) }
  const up = document.createElement('option'); up.value = '__upload_fonts'; up.textContent = '+ Upload fonts…'; g.appendChild(up);
  sel.appendChild(g); return g;
}

/* ---------- manager UI ---------- */
function css() { if (document.getElementById('mfCss')) return; const l = document.createElement('link'); l.id = 'mfCss'; l.rel = 'stylesheet'; l.href = BASE + 'fontlib.css'; document.head.appendChild(l) }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const WN = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };
const chip = f => (WN[f.weight] || f.weight) + (f.italic ? ' Italic' : '') + ' ' + f.weight;
const TESTS = [['brand-generator.html', 'Brand kit generator'], ['page-builder.html', 'Site builder'], ['mockup-studio.html', 'Mockup studio'], ['chart-studio.html', 'Chart studio']];
function mount(root, opt) {
  css(); opt = opt || {}; let sample = 'Sphinx of black quartz, judge my vow 0123456789', msg = '', errs = [];
  root.classList.add('mf');
  const seen = (() => { try { return localStorage.getItem(NOTE_KEY) === '1' } catch (e) { return false } })();
  root.innerHTML = '<div class="mfNote" data-note role="note"><strong>Your fonts, your device.</strong> ' + esc(NOTICE) + ' The atlas never uploads or shares them.</div>' +
    '<div class="mfPriv" data-priv role="status" hidden>Private or restricted browsing: your fonts will last for this page session only.</div>' +
    '<div class="mfDrop" data-drop tabindex="-1"><p><strong>Drop font files here</strong><br><span>.ttf .otf .woff .woff2, or a .zip of fonts. Up to 5 MB each.</span></p>' +
    '<div class="mfRow"><label class="mfBtn" for="mfFiles' + uidn + '">Choose font files</label><input id="mfFiles' + uidn + '" class="mfVh" type="file" multiple accept=".ttf,.otf,.woff,.woff2,.zip,font/ttf,font/otf,font/woff,font/woff2,application/zip" data-files>' +
    '<label class="mfBtn ghost" for="mfDir' + uidn + '">Choose a folder</label><input id="mfDir' + uidn + '" class="mfVh" type="file" webkitdirectory multiple data-dir></div></div>' +
    '<div class="mfMsg" data-msg role="status" aria-live="polite"></div>' +
    '<div class="mfRow mfSample"><label for="mfS' + uidn + '">Preview text</label><input id="mfS' + uidn + '" type="text" data-sample maxlength="120" value="' + esc(sample) + '"></div>' +
    '<ul class="mfList" data-list aria-label="Your fonts"></ul>' +
    '<p class="mfTest" data-test></p>';
  uidn++;
  const q = s => root.querySelector(s), listEl = q('[data-list]'), msgEl = q('[data-msg]'), drop = q('[data-drop]');
  const draw = () => {
    q('[data-priv]').hidden = persistent;
    q('[data-note]').classList.toggle('seen', seen);
    const L = list();
    listEl.innerHTML = L.length ? L.map(f => '<li class="mfFam" data-fam="' + esc(f.family) + '"><div class="mfHead"><h3 class="mfName">' + esc(f.display) + '</h3>' + (f.display !== f.family ? '<span class="mfSub">' + esc(f.family) + '</span>' : '') +
      '<div class="mfAct"><button type="button" class="mfBtn ghost sm" data-ren>Rename</button><button type="button" class="mfBtn ghost sm danger" data-del aria-label="Delete ' + esc(f.display) + '">Delete</button></div></div>' +
      '<div class="mfChips">' + f.faces.map(x => '<span class="mfChip" title="' + esc(x.file) + ', ' + Math.round(x.size / 1024) + ' KB">' + esc(chip(x)) + '</span>').join('') + '</div>' +
      '<div class="mfPrev" lang="en">' + f.faces.map(x => '<div style="font-family:' + esc(cssFamily(f.family)) + ';font-weight:' + x.weight + ';font-style:' + (x.italic ? 'italic' : 'normal') + '">' + esc(sample) + '</div>').join('') + '</div></li>').join('') :
      '<li class="mfEmpty">No fonts yet. Add the font files you own and they appear in the font choosers of the brand generator, site builder, mockup studio and chart studio.</li>';
    q('[data-test]').innerHTML = L.length ? 'Test in: ' + TESTS.map(t => '<a href="' + t[0] + '">' + t[1] + '</a>').join(' · ') : '';
    msgEl.innerHTML = (msg ? '<p>' + esc(msg) + '</p>' : '') + (errs.length ? '<ul class="mfErr">' + errs.map(e => '<li><strong>' + esc(e.name) + '</strong> was skipped: ' + esc(e.error) + '.</li>').join('') + '</ul>' : '');
  };
  const take = async files => {
    if (!files || !files.length) return; msg = 'Reading ' + files.length + ' file' + (files.length > 1 ? 's' : '') + '…'; errs = []; draw();
    const r = await add(files); errs = r.errors;
    msg = r.added.length ? 'Added ' + r.added.length + ' style' + (r.added.length > 1 ? 's' : '') + ' (' + [...new Set(r.added.map(m => m.family))].join(', ') + ').' : (r.errors.length ? '' : 'No fonts found in that selection.');
    try { localStorage.setItem(NOTE_KEY, '1') } catch (e) { }
    draw(); if (opt.onAdd) opt.onAdd(r);
  };
  q('[data-files]').addEventListener('change', e => { take(e.target.files).then(() => { e.target.value = '' }) });
  q('[data-dir]').addEventListener('change', e => { take(e.target.files).then(() => { e.target.value = '' }) });
  ['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('on') }));
  ['dragleave', 'drop'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove('on') }));
  drop.addEventListener('drop', async e => {
    const items = e.dataTransfer && e.dataTransfer.items, fs = [];
    const walk = async en => { if (!en) return; if (en.isFile) await new Promise(r => en.file(f => { fs.push(f); r() }, r)); else if (en.isDirectory) { const rd = en.createReader(); let b; do { b = await new Promise(r => rd.readEntries(r, () => r([]))); for (const c of b) await walk(c) } while (b.length) } };
    if (items && items.length && items[0].webkitGetAsEntry) { for (const it of Array.from(items)) await walk(it.webkitGetAsEntry()) } else for (const f of e.dataTransfer.files) fs.push(f);
    take(fs);
  });
  q('[data-sample]').addEventListener('input', e => { sample = e.target.value || ' '; listEl.querySelectorAll('.mfPrev div').forEach(d => { d.textContent = sample }) });
  listEl.addEventListener('click', e => {
    const li = e.target.closest('[data-fam]'); if (!li) return; const f = li.getAttribute('data-fam');
    if (e.target.closest('[data-del]')) { if (confirm('Remove "' + (list().find(x => x.family === f) || {}).display + '" from this browser? Your original files are not touched.')) remove(f).then(() => { msg = 'Removed.'; errs = []; draw() }) }
    if (e.target.closest('[data-ren]')) {
      const h = li.querySelector('.mfName'), cur = h.textContent, inp = document.createElement('input'); inp.type = 'text'; inp.value = cur; inp.maxLength = 60; inp.className = 'mfRen'; inp.setAttribute('aria-label', 'Display name');
      h.replaceWith(inp); inp.focus(); inp.select(); const done = ok => { if (ok && inp.value.trim()) rename(f, inp.value); else draw() };
      inp.addEventListener('keydown', k => { if (k.key === 'Enter') done(true); if (k.key === 'Escape') done(false) }); inp.addEventListener('blur', () => done(true));
    }
  });
  const on = () => draw(); subs.add(on); draw();
  return { refresh: draw, destroy() { subs.delete(on) }, take };
}
let uidn = 0;
function openDialog(opt) {
  css(); let d = document.getElementById('mfDialog');
  if (!d) {
    d = document.createElement('dialog'); d.id = 'mfDialog'; d.className = 'mfDlg'; d.setAttribute('aria-labelledby', 'mfDlgT');
    d.innerHTML = '<div class="mfDlgHead"><h2 id="mfDlgT">My fonts</h2><button type="button" class="mfBtn ghost sm" data-x>Done</button></div><div class="mfDlgBody"></div>';
    document.body.appendChild(d); mount(d.querySelector('.mfDlgBody'), opt);
    d.querySelector('[data-x]').addEventListener('click', () => d.close());
    d.addEventListener('click', e => { if (e.target === d) d.close() });
  }
  if (d.showModal) { if (!d.open) d.showModal() } else d.setAttribute('open', '');
  return d;
}

/* ---------- boot ---------- */
meta = lsGet();
try { if (typeof BroadcastChannel !== 'undefined') { bc = new BroadcastChannel('atlas-myfonts'); bc.onmessage = () => { sync().then(emit) } } } catch (e) { }
const ready = sync().then(() => { emit() }, () => { });
window.MyFonts = { ready, list, add, remove, rename, registerAll, cssFamily, has, faceFor, toBase64, exportFiles, fontFaceCSS, fontFaceCSSSync, glyphPath, glyphPathSync, prepare, optgroup, mount, openDialog, NOTICE, LIMIT,
  get persistent() { return persistent }, on: f => subs.add(f), off: f => subs.delete(f), parse: parseFont };
})();
