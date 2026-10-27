/* Builds a tiny TrueType font at test time (every printable ASCII glyph is a solid block, so it is easy to tell from a fallback).
   No third-party font is used or committed. mkFont({family, style, weight, italic}) -> Buffer */
const u16 = n => Buffer.from([(n >> 8) & 255, n & 255]);
const i16 = n => u16(n & 0xFFFF);
const u32 = n => Buffer.from([(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]);
const pad4 = b => Buffer.concat([b, Buffer.alloc((4 - b.length % 4) % 4)]);
const sum = b => { const p = pad4(b); let s = 0; for (let i = 0; i < p.length; i += 4) s = (s + p.readUInt32BE(i)) >>> 0; return s };
const utf16 = s => { const b = Buffer.alloc(s.length * 2); for (let i = 0; i < s.length; i++) b.writeUInt16BE(s.charCodeAt(i), i * 2); return b };
export function mkFont({ family = 'Mini Test', style = 'Regular', weight = 400, italic = false, block = 700 } = {}) {
  const upm = 1000, first = 32, last = 126, n = last - first + 2;      /* glyph 0 = .notdef, then 32..126 */
  /* glyph: a rectangle (box height varies a little per weight so weights differ visibly) */
  const rect = (w, h) => Buffer.concat([i16(1), i16(50), i16(0), i16(w - 50), i16(h), u16(3), u16(0), Buffer.from([1, 1, 1, 1]),
    /* x deltas as int16 (flags without short bits => int16 deltas) */ i16(50), i16(0), i16(w - 100), i16(0),
    i16(0), i16(h), i16(0), i16(-h)]);
  const glyphs = [], adv = [];
  for (let g = 0; g < n; g++) {
    if (g === 1) { glyphs.push(Buffer.alloc(0)); adv.push(300); continue }   /* space */
    const body = rect(560, block); glyphs.push(pad4(body)); adv.push(620);
  }
  const loca = []; let off = 0; const glyf = []; for (const g of glyphs) { loca.push(off); glyf.push(g); off += g.length } loca.push(off);
  const T = {};
  const head = Buffer.concat([u32(0x00010000), u32(0x00010000), u32(0), u32(0x5F0F3CF5), u16(0), u16(upm), Buffer.alloc(16), i16(0), i16(0), i16(600), i16(block), u16((weight >= 600 ? 1 : 0) | (italic ? 2 : 0)), u16(8), i16(2), i16(1), i16(0)]);
  T.head = head;
  T.hhea = Buffer.concat([u32(0x00010000), i16(800), i16(-200), i16(0), u16(700), i16(0), i16(0), i16(600), i16(1), i16(0), i16(0), Buffer.alloc(8), i16(0), u16(n)]);
  T.maxp = Buffer.concat([u32(0x00010000), u16(n), u16(4), u16(1), u16(0), u16(0), u16(2), u16(0), u16(0), u16(0), u16(0), u16(0), u16(0), u16(0), u16(0)]);
  const os = Buffer.alloc(96); os.writeUInt16BE(3, 0); os.writeUInt16BE(weight, 4); os.writeUInt16BE(5, 6); os.writeUInt16BE((italic ? 1 : 0) | (weight >= 600 ? 32 : 0) | (italic || weight >= 600 ? 0 : 64), 62);
  os.writeUInt8(2, 32); os.writeUInt8(11, 34); os.writeUInt16BE(first, 64); os.writeUInt16BE(last, 66); os.writeInt16BE(800, 68); os.writeInt16BE(-200, 70);
  T['OS/2'] = os;
  const names = [[1, family], [2, style], [4, family + ' ' + style], [6, family.replace(/ /g, '') + '-' + style.replace(/ /g, '')]];
  const strs = names.map(([, s]) => utf16(s)); let so = 0; const recs = names.map(([id], i) => { const r = Buffer.concat([u16(3), u16(1), u16(0x409), u16(id), u16(strs[i].length), u16(so)]); so += strs[i].length; return r });
  T.name = Buffer.concat([u16(0), u16(names.length), u16(6 + 12 * names.length), ...recs, ...strs]);
  const segCount = 2, cm4 = Buffer.concat([u16(4), u16(16 + segCount * 8), u16(0), u16(segCount * 2), u16(4), u16(1), u16(0), u16(last), u16(0xFFFF), u16(0), u16(first), u16(0xFFFF), i16(1 - first), i16(1), u16(0), u16(0)]);
  T.cmap = Buffer.concat([u16(0), u16(1), u16(3), u16(1), u32(12), cm4]);
  T.hmtx = Buffer.concat(adv.flatMap(a => [u16(a), i16(50)]));
  T.loca = Buffer.concat(loca.map(l => u32(l)));
  T.glyf = Buffer.concat(glyf);
  T.post = Buffer.concat([u32(0x00030000), u32(0), i16(-100), i16(50), u32(0), u32(0), u32(0), u32(0), u32(0)]);
  const tags = Object.keys(T).sort(), nt = tags.length; let p = 12 + 16 * nt; const dir = [], body = [];
  for (const t of tags) { const d = T[t]; dir.push(Buffer.concat([Buffer.from(t), u32(sum(d)), u32(p), u32(d.length)])); const pd = pad4(d); body.push(pd); p += pd.length }
  const sr = 16 * 2 ** Math.floor(Math.log2(nt));
  return Buffer.concat([u32(0x00010000), u16(nt), u16(sr), u16(Math.floor(Math.log2(nt))), u16(nt * 16 - sr), ...dir, ...body]);
}
