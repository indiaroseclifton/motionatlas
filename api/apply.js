// Application endpoint for the shelf's Staged application piece. POST JSON { answers: {key: value}, sections: [[title, [[label, key]]]] } -> emails it.
// Sends through Resend when RESEND_API_KEY and APPLY_TO are set on the Vercel project (APPLY_FROM optional).
// Without them it answers 503, and the page offers the visitor a copy of their application instead.
const send = (res, code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(obj)); };
async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let raw = ''; for await (const c of req) { raw += c; if (raw.length > 120e3) throw new Error('Request too large'); }
  return raw ? JSON.parse(raw) : {};
}
const clip = (v, n) => String(v ?? '').slice(0, n);
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  const key = process.env.RESEND_API_KEY, to = process.env.APPLY_TO, from = process.env.APPLY_FROM || 'Applications <onboarding@resend.dev>';
  if (req.method === 'GET') return send(res, 200, { enabled: !!(key && to) });
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only.' });
  if (!key || !to) return send(res, 503, { error: 'The application inbox is not connected on this deployment yet.' });
  try {
    const b = await body(req), a = b.answers || {};
    if (a.website) return send(res, 200, { ok: true }); // honeypot
    const name = clip(a.name, 120).trim(), email = clip(a.email, 200).trim();
    if (!name || !EMAIL.test(email)) return send(res, 400, { error: 'A name and a working email are required.' });
    const sections = Array.isArray(b.sections) ? b.sections.slice(0, 12) : [];
    let text = '', html = `<div style="font:15px/1.55 -apple-system,Segoe UI,sans-serif;color:#111">`;
    for (const [title, fields] of sections) {
      text += `\n== ${clip(title, 80)} ==\n`; html += `<h2 style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#0A7F94;margin:28px 0 8px">${esc(clip(title, 80))}</h2>`;
      for (const [label, k] of (Array.isArray(fields) ? fields.slice(0, 30) : [])) {
        const v = Array.isArray(a[k]) ? a[k].map(x => clip(x, 80)).join(', ') : clip(a[k], 6000);
        text += `\n${clip(label, 200)}\n${v || '(blank)'}\n`;
        html += `<p style="margin:14px 0 4px;color:#555;font-size:13px">${esc(clip(label, 200))}</p><p style="margin:0;white-space:pre-wrap">${esc(v || '(blank)')}</p>`;
      }
    }
    html += '</div>';
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: to.split(',').map(s => s.trim()), reply_to: email, subject: `New application: ${name}`, text, html })
    });
    if (!r.ok) return send(res, 502, { error: 'The mail service refused the application. Try again in a minute.' });
    return send(res, 200, { ok: true });
  } catch (e) { return send(res, 400, { error: e.message || 'Could not read the application.' }); }
}
