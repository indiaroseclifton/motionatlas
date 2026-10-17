// Issues short-lived client upload tokens so files go straight from the browser to Vercel Blob
// (no 4.5 MB function body limit). Only someone holding a project's edit key can upload to it.
import { handleUpload } from '@vercel/blob/client';
import { ID_RE, hash, sameHash, latest } from './_lib/share.js';

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime', 'application/pdf', 'font/woff2', 'font/ttf', 'font/otf', 'application/zip', 'text/plain'];
export const MAX_BYTES = 100 * 1024 * 1024;

export default async function handler(req, res) {
  const send = (code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
  if (req.method !== 'POST') return send(405, { error: 'Method not allowed' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return send(503, { error: 'Sharing is not set up yet.' });
  try {
    const body = typeof req.body === 'object' && req.body ? req.body : JSON.parse(req.body || '{}');
    const result = await handleUpload({
      body, request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { id, key } = JSON.parse(clientPayload || '{}');
        if (!ID_RE.test(id || '')) throw new Error('Invalid project');
        if (!pathname.startsWith(`shares/${id}/files/`) || pathname.includes('..')) throw new Error('Invalid file path');
        const found = await latest(id);
        if (!found || !key || !sameHash(hash(key), found.manifest.editHash)) throw new Error('This link cannot add files');
        if (found.manifest.files.length >= 200) throw new Error('This project is full');
        return { allowedContentTypes: TYPES, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true, tokenPayload: JSON.stringify({ id }) };
      },
      onUploadCompleted: async () => {}
    });
    return send(200, result);
  } catch (e) {
    return send(400, { error: e.message || 'Upload refused' });
  }
}
