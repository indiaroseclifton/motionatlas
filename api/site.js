// Published sites. GET ?status | POST (create) | PUT ?id (replace files, x-edit-key) | DELETE ?id (unpublish, x-edit-key)
// GET ?id&path=file serves a published file (this is what /site/<id>/<file> rewrites to; see vercel.json).
// Published HTML is served with a sandboxing Content-Security-Policy, so a site's own scripts (analytics, embeds) can never reach the atlas.
import { mode } from './_lib/store.js';
import { ID_RE, newId, newKey, hash, sameHash, cleanFiles, latestSite, writeSite, publicSite, TYPES } from './_lib/site.js';

const json = (res, code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(obj)); };
async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let raw = ''; for await (const c of req) { raw += c; if (raw.length > 4.6e6) throw new Error('Request too large'); }
  return raw ? JSON.parse(raw) : {};
}
const page = (res, code, title, text) => { res.statusCode = code; res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.setHeader('Content-Security-Policy', 'sandbox'); res.end(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="font:18px/1.6 system-ui,sans-serif;max-width:560px;margin:18vh auto;padding:0 20px"><h1 style="font-size:32px;margin:0 0 8px">${title}</h1><p>${text}</p><p><a href="/page-builder">Make your own site</a></p>`); };

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://x'), id = url.searchParams.get('id');
  try {
    if (req.method === 'GET' && url.searchParams.has('status')) return json(res, 200, { enabled: !!mode, mode, maxBytes: 3.8e6 });
    if (req.method === 'POST') {
      if (!mode) return json(res, 503, { error: 'Publishing is not set up yet: connect a Vercel Blob store to this project. You can still download the site as a ZIP.' });
      const b = await body(req), { files } = cleanFiles(b.files || []);
      const nid = newId(), key = newKey(), m = { v: 1, id: nid, name: String(b.name || 'Site').slice(0, 80), editHash: hash(key), files, created: Date.now() };
      await writeSite(nid, m);
      return json(res, 201, { id: nid, key, url: `/site/${nid}/`, site: publicSite(m) });
    }
    if (!id || !ID_RE.test(id)) return req.method === 'GET' ? page(res, 404, 'No site here', 'This link is missing its site id.') : json(res, 400, { error: 'Missing or invalid site id.' });
    if (!mode) return req.method === 'GET' ? page(res, 503, 'Publishing is not set up', 'This site cannot be shown until a storage connection is added.') : json(res, 503, { error: 'Publishing is not set up yet.' });
    const found = await latestSite(id);
    if (req.method === 'GET') {
      if (!found) return page(res, 404, 'This site is not published', 'It may have been taken down, or the link may have a typo.');
      const m = found.manifest;
      if (url.searchParams.has('meta')) return json(res, 200, { site: publicSite(m) });
      let p = decodeURIComponent(url.searchParams.get('path') || '').replace(/^\/+|\/+$/g, '') || 'index.html';
      let f = m.files[p] || (!/\.\w+$/.test(p) && m.files[p + '.html']);
      let code = 200;
      if (!f) { f = m.files['404.html']; code = 404; if (!f) return page(res, 404, 'Page not found', 'This page is not part of the site.'); }
      res.statusCode = code; res.setHeader('Content-Type', f.type || TYPES.html); res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=300');
      if (/html/.test(f.type)) res.setHeader('Content-Security-Policy', 'sandbox allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads');
      return res.end(f.text != null ? f.text : Buffer.from(f.b64, 'base64'));
    }
    if (!found) return json(res, 404, { error: 'This published site no longer exists.' });
    const key = req.headers['x-edit-key'];
    if (!key || !sameHash(hash(key), found.manifest.editHash)) return json(res, 403, { error: 'This browser does not hold the key for that site.' });
    if (req.method === 'PUT') {
      const b = await body(req), m = found.manifest;
      if (b.files) m.files = cleanFiles(b.files).files;
      if (b.name) m.name = String(b.name).slice(0, 80);
      await writeSite(id, m, found.items);
      return json(res, 200, { id, url: `/site/${id}/`, site: publicSite(m) });
    }
    if (req.method === 'DELETE') { const { remove, listPrefix } = await import('./_lib/store.js'); await remove(await listPrefix(`sites/${id}/`)); return json(res, 200, { deleted: true }); }
    return json(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return json(res, /Request too large|not allowed|too large|cannot be published|not valid|No files|no content|can have/.test(e.message) ? 400 : 500, { error: /Request too large/.test(e.message) ? 'This site is too large to publish here. Use smaller images or download the ZIP.' : (/not allowed|too large|cannot be published|not valid|No files|no content|can have/.test(e.message) ? e.message : 'Something went wrong on our side. Please try again.') });
  }
}
