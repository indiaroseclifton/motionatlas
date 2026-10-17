// Shared project manifests: shares/<id>/m-<timestamp>.json, newest wins (never overwritten, so CDN caches are never stale).
import crypto from 'node:crypto';
import { putJSON, listPrefix, readJSON, remove } from './store.js';

export const ID_RE = /^[A-Za-z0-9_-]{16}$/;
export const newId = () => crypto.randomBytes(12).toString('base64url');
export const newKey = () => crypto.randomBytes(24).toString('base64url');
export const hash = k => crypto.createHash('sha256').update(String(k)).digest('hex');
export const sameHash = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

const str = (v, n) => String(v ?? '').slice(0, n);
const PLATFORMS = ['Web app', 'Website', 'Mobile app', 'Other'], STAGES = ['Exploring', 'Designing', 'Building', 'Archived'];
export function cleanProject(p = {}) {
  return {
    name: str(p.name, 100) || 'Untitled project',
    brief: str(p.brief, 4000),
    platform: PLATFORMS.includes(p.platform) ? p.platform : 'Web app',
    stage: STAGES.includes(p.stage) ? p.stage : 'Exploring',
    decisions: str(p.decisions, 4000),
    entries: Array.isArray(p.entries) ? [...new Set(p.entries.filter(x => typeof x === 'string' && /^[A-Z]\d\d$/.test(x)))].slice(0, 300) : [],
    icons: Array.isArray(p.icons) ? p.icons.filter(x => typeof x === 'string' && /^[\w-]{1,40}$/.test(x)).slice(0, 40) : [],
    notes: p.notes && typeof p.notes === 'object' ? Object.fromEntries(Object.entries(p.notes).filter(([k, v]) => /^[A-Z]\d\d$/.test(k) && typeof v === 'string').slice(0, 300).map(([k, v]) => [k, v.slice(0, 1500)])) : {}
  };
}
export function cleanFile(f = {}) {
  return { url: str(f.url, 600), pathname: str(f.pathname, 400), name: str(f.name, 200) || 'file', type: str(f.type, 100), size: Math.max(0, Math.min(Number(f.size) || 0, 1e10)), addedBy: str(f.addedBy, 60), added: Number(f.added) || Date.now() };
}

export async function latest(id) {
  const items = (await listPrefix(`shares/${id}/m-`)).sort((a, b) => a.pathname < b.pathname ? 1 : -1);
  if (!items.length) return null;
  return { manifest: await readJSON(items[0]), items };
}
export async function write(id, manifest, old = []) {
  manifest.updated = Date.now();
  await putJSON(`shares/${id}/m-${String(manifest.updated).padStart(15, '0')}.json`, manifest);
  await remove(old.slice(1)); // keep the previous version as a fallback
}
export const publicView = m => ({ id: m.id, project: m.project, files: m.files, created: m.created, updated: m.updated });
