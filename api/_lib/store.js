// Storage for shared projects. Vercel Blob in production (BLOB_READ_WRITE_TOKEN set when a Blob
// store is connected to the project); a local folder for testing (SHARE_LOCAL_DIR, dev server only).
import { put, list, del } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';

const LOCAL = process.env.SHARE_LOCAL_DIR;
export const mode = process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : (LOCAL ? 'local' : null);
const localPath = p => path.join(LOCAL, p.replace(/\.\.+/g, ''));

export async function putJSON(pathname, obj) {
  const body = JSON.stringify(obj);
  if (mode === 'blob') {
    const r = await put(pathname, body, { access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60 });
    return r.url;
  }
  await fs.mkdir(path.dirname(localPath(pathname)), { recursive: true });
  await fs.writeFile(localPath(pathname), body);
  return '/__local/' + pathname;
}

export async function listPrefix(prefix) {
  if (mode === 'blob') {
    const out = []; let cursor;
    do { const r = await list({ prefix, cursor, limit: 1000 }); out.push(...r.blobs); cursor = r.hasMore ? r.cursor : undefined; } while (cursor);
    return out.map(b => ({ pathname: b.pathname, url: b.url, size: b.size }));
  }
  const dir = localPath(prefix.slice(0, prefix.lastIndexOf('/') + 1));
  const walk = async d => { let r = []; for (const e of await fs.readdir(d, { withFileTypes: true }).catch(() => [])) { const f = path.join(d, e.name); r = r.concat(e.isDirectory() ? await walk(f) : [f]); } return r; };
  return (await walk(dir)).map(f => path.relative(LOCAL, f).split(path.sep).join('/')).filter(p => p.startsWith(prefix)).map(p => ({ pathname: p, url: '/__local/' + p, size: 0 }));
}

export async function readJSON(item) {
  if (mode === 'blob') { const r = await fetch(item.url, { cache: 'no-store' }); if (!r.ok) throw new Error('read failed'); return r.json(); }
  return JSON.parse(await fs.readFile(localPath(item.pathname), 'utf8'));
}

export async function remove(items) {
  if (!items.length) return;
  if (mode === 'blob') return del(items.map(i => i.url));
  await Promise.all(items.map(i => fs.unlink(localPath(i.pathname)).catch(() => {})));
}

export function isOwnFileURL(url, id) {
  try {
    if (mode === 'blob') { const u = new URL(url); return u.protocol === 'https:' && u.hostname.endsWith('.public.blob.vercel-storage.com') && u.pathname.startsWith(`/shares/${id}/files/`); }
    return url.startsWith(`/__local/shares/${id}/files/`);
  } catch { return false; }
}
