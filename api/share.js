// Share API. GET ?status | GET ?id | POST (create) | PUT ?id (edit, x-edit-key) | DELETE ?id (stop sharing).
import { mode, isOwnFileURL, listPrefix, remove } from './_lib/store.js';
import { ID_RE, newId, newKey, hash, sameHash, cleanProject, cleanFile, latest, write, publicView } from './_lib/share.js';

const MAX_FILES = 200;
const send = (res, code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(obj)); };
async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let raw = ''; for await (const c of req) { raw += c; if (raw.length > 256e3) throw new Error('Request too large'); }
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://x'), id = url.searchParams.get('id');
  try {
    if (req.method === 'GET' && url.searchParams.has('status')) return send(res, 200, { enabled: !!mode, mode });
    if (!mode) return send(res, 503, { error: 'Sharing is not set up yet: connect a Vercel Blob store to this project.' });

    if (req.method === 'POST') {
      const b = await body(req), nid = newId(), key = newKey();
      const m = { v: 1, id: nid, editHash: hash(key), project: cleanProject(b.project), files: [], created: Date.now() };
      await write(nid, m);
      return send(res, 201, { id: nid, key, share: publicView(m) });
    }
    if (!id || !ID_RE.test(id)) return send(res, 400, { error: 'Missing or invalid share id.' });
    const found = await latest(id);
    if (!found) return send(res, 404, { error: 'This shared project no longer exists.' });
    const { manifest: m, items } = found;
    if (req.method === 'GET') return send(res, 200, { share: publicView(m) });

    const key = req.headers['x-edit-key'];
    if (!key || !sameHash(hash(key), m.editHash)) return send(res, 403, { error: 'This link can view the project but not change it.' });

    if (req.method === 'PUT') {
      const b = await body(req);
      if (b.project) m.project = cleanProject(b.project);
      if (Array.isArray(b.removeFiles) && b.removeFiles.length) {
        const gone = m.files.filter(f => b.removeFiles.includes(f.url));
        m.files = m.files.filter(f => !b.removeFiles.includes(f.url));
        await remove(gone.map(f => ({ url: f.url, pathname: f.pathname })));
      }
      if (Array.isArray(b.addFiles)) {
        for (const f of b.addFiles.map(cleanFile)) {
          if (!isOwnFileURL(f.url, id)) return send(res, 400, { error: 'A file was not uploaded to this project.' });
          f.pathname = mode === 'blob' ? decodeURIComponent(new URL(f.url).pathname.slice(1)) : f.url.slice('/__local/'.length);
          if (!m.files.some(x => x.url === f.url)) m.files.push(f);
        }
        if (m.files.length > MAX_FILES) return send(res, 400, { error: `A shared project can hold ${MAX_FILES} files.` });
      }
      await write(id, m, items);
      return send(res, 200, { share: publicView(m) });
    }
    if (req.method === 'DELETE') {
      await remove(await listPrefix(`shares/${id}/`));
      return send(res, 200, { deleted: true });
    }
    return send(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'Something went wrong on our side. Please try again.' });
  }
}
