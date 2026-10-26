// Published sites: sites/<id>/m-<timestamp>.json holds {editHash, files:{path:{type,text|b64}}}. Newest wins, like shares.
import { putJSON, listPrefix, readJSON, remove } from './store.js';
export { ID_RE, newId, newKey, hash, sameHash } from './share.js';

export const MAX_BYTES = 3.8e6, MAX_FILES = 150;
export const TYPES = { html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8', xml: 'application/xml; charset=utf-8', txt: 'text/plain; charset=utf-8', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', json: 'application/json' };
const TEXT = new Set(['html', 'css', 'js', 'xml', 'txt', 'svg', 'json']);
const PATH_RE = /^[A-Za-z0-9_][A-Za-z0-9_.\/-]{0,119}$/;

/** Validate the files a client sends. Returns {files, bytes} or throws an Error with a message fit for the user. */
export function cleanFiles(list) {
  if (!Array.isArray(list)) throw new Error('No files were sent.');
  if (list.length > MAX_FILES) throw new Error(`A site can have ${MAX_FILES} files.`);
  const files = {}; let bytes = 0;
  for (const f of list) {
    const path = String(f && f.path || '');
    if (!PATH_RE.test(path) || path.includes('..') || path.includes('//')) throw new Error('A file name is not allowed: ' + path.slice(0, 40));
    const ext = path.split('.').pop().toLowerCase();
    if (!TYPES[ext]) throw new Error('This file type cannot be published: ' + path.slice(0, 40));
    if (TEXT.has(ext)) {
      if (typeof f.text !== 'string') throw new Error('A text file has no content: ' + path);
      bytes += f.text.length; files[path] = { type: TYPES[ext], text: f.text };
    } else {
      if (typeof f.b64 !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(f.b64)) throw new Error('An image is not valid: ' + path);
      bytes += Math.floor(f.b64.length * 0.75); files[path] = { type: TYPES[ext], b64: f.b64 };
    }
  }
  if (bytes > MAX_BYTES) throw new Error('This site is too large to publish here (' + (bytes / 1e6).toFixed(1) + ' MB, the limit is ' + (MAX_BYTES / 1e6).toFixed(1) + ' MB). Use smaller images or download the ZIP and host it yourself.');
  return { files, bytes };
}
export async function latestSite(id) {
  const items = (await listPrefix(`sites/${id}/m-`)).sort((a, b) => a.pathname < b.pathname ? 1 : -1);
  return items.length ? { manifest: await readJSON(items[0]), items } : null;
}
export async function writeSite(id, manifest, old = []) {
  manifest.updated = Date.now();
  await putJSON(`sites/${id}/m-${String(manifest.updated).padStart(15, '0')}.json`, manifest);
  await remove(old.slice(1));
}
export const publicSite = m => ({ id: m.id, updated: m.updated, created: m.created, name: m.name, files: Object.keys(m.files || {}) });
