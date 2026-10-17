// Local test server for sharing: serves site/, runs api/share.js against a local folder
// (SHARE_LOCAL_DIR) and accepts uploads at /api/upload-local, which production does not have.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const ROOT = path.resolve('site'), LOCAL = path.resolve(process.env.SHARE_LOCAL_DIR || '.share-dev');
process.env.SHARE_LOCAL_DIR = LOCAL;
const { default: share } = await import('../api/share.js');
const { latest, hash, sameHash, ID_RE } = await import('../api/_lib/share.js');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf', '.woff2': 'font/woff2' };
const port = +process.env.PORT || 8790;
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  try {
    if (u.pathname === '/api/share') return share(req, res);
    if (u.pathname === '/api/upload-local' && req.method === 'PUT') {
      const id = u.searchParams.get('id'), key = req.headers['x-edit-key'], name = (u.searchParams.get('name') || 'file').replace(/[^\w.-]+/g, '-').slice(0, 80);
      const f = ID_RE.test(id || '') && await latest(id);
      if (!f || !key || !sameHash(hash(key), f.manifest.editHash)) { res.statusCode = 403; return res.end('{"error":"no"}'); }
      const p = `shares/${id}/files/${crypto.randomBytes(4).toString('hex')}-${name}`;
      await fs.mkdir(path.dirname(path.join(LOCAL, p)), { recursive: true });
      const chunks = []; for await (const c of req) chunks.push(c);
      await fs.writeFile(path.join(LOCAL, p), Buffer.concat(chunks));
      res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ url: '/__local/' + p, pathname: p }));
    }
    let file = u.pathname.startsWith('/__local/') ? path.join(LOCAL, decodeURIComponent(u.pathname.slice(9))) : path.join(ROOT, decodeURIComponent(u.pathname));
    if (!file.startsWith(ROOT) && !file.startsWith(LOCAL)) { res.statusCode = 403; return res.end(); }
    let st = await fs.stat(file).catch(() => null);
    if (st?.isDirectory()) { file = path.join(file, 'index.html'); st = await fs.stat(file).catch(() => null); }
    if (!st) { const h = file + '.html'; if (await fs.stat(h).catch(() => null)) file = h; else { res.statusCode = 404; return res.end('not found'); } }
    res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
    res.end(await fs.readFile(file));
  } catch (e) { console.error(e); res.statusCode = 500; res.end('error'); }
}).listen(port, () => console.log('share dev server on http://localhost:' + port));
