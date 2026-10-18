// AI page engine. GET ?status | POST {mode:'page'|'section', brief, catalog, styles, current?}
// Runs on Claude Haiku 5.5. The key lives in the ANTHROPIC_API_KEY env var and never reaches the browser.
// Guard rails: per-IP hourly limit, a daily request cap (AI_DAILY_LIMIT), size limits on everything sent in.
import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-haiku-5-5';
const HOURLY = Number(process.env.AI_HOURLY_LIMIT || 20);
const DAILY = Number(process.env.AI_DAILY_LIMIT || 500);
const hits = new Map(); // ip -> [timestamps] (per warm instance)
let day = '', dayCount = 0;

const send = (res, code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(obj)); };
async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let raw = ''; for await (const c of req) { raw += c; if (raw.length > 64e3) throw new Error('Request too large'); }
  return raw ? JSON.parse(raw) : {};
}
function allowed(ip) {
  const now = Date.now(), today = new Date().toISOString().slice(0, 10);
  if (today !== day) { day = today; dayCount = 0; }
  if (dayCount >= DAILY) return 'The AI has reached today\'s limit. It resets at midnight UTC.';
  const list = (hits.get(ip) || []).filter(t => now - t < 3600e3);
  if (list.length >= HOURLY) return 'You have used the AI a lot this hour. Try again in a little while.';
  list.push(now); hits.set(ip, list); dayCount++;
  return null;
}
const str = (v, n) => String(v ?? '').slice(0, n);

const SCHEMA = {
  type: 'object', additionalProperties: false, required: ['title', 'brand', 'style', 'blocks', 'note'],
  properties: {
    title: { type: 'string' }, brand: { type: 'string' }, style: { type: 'string' }, note: { type: 'string' },
    blocks: { type: 'array', items: {
      type: 'object', additionalProperties: false, required: ['id', 'fields'],
      properties: { id: { type: 'string' }, fields: { type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['key', 'value'],
        properties: { key: { type: 'string' }, value: { type: 'string' } } } } } } }
  }
};

const SYSTEM = `You design landing pages inside a page builder. You can only use the sections in the catalogue you are given, by their exact id, and only fill the field keys each section lists.
Write real, specific copy for the brief: concrete nouns, numbers where they help, short headlines, no lorem ipsum, no filler like "unlock" or "elevate".
Pick a style id from the styles list that suits the brief. Choose 5 to 9 sections in a sensible order (a hero first, a call to action near the end).
Keep each field value to the length its field name implies: headlines under 9 words, body text under 45 words, list items separated by " | ".
"note" is one sentence telling the person what you chose and why.`;

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'GET' && url.searchParams.has('status')) return send(res, 200, { enabled: !!process.env.ANTHROPIC_API_KEY, model: MODEL });
  if (req.method !== 'POST') return send(res, 405, { error: 'Use POST.' });
  if (!process.env.ANTHROPIC_API_KEY) return send(res, 503, { error: 'The AI is not set up yet: add ANTHROPIC_API_KEY to this Vercel project.' });
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'anon').split(',')[0].trim();
  const stop = allowed(ip); if (stop) return send(res, 429, { error: stop });
  try {
    const b = await body(req);
    const brief = str(b.brief, 1500).trim(); if (!brief) return send(res, 400, { error: 'Describe the page you want first.' });
    const catalog = (Array.isArray(b.catalog) ? b.catalog : []).slice(0, 160).map(s => ({ id: str(s.id, 40), name: str(s.name, 60), group: str(s.group, 30), fields: (Array.isArray(s.fields) ? s.fields : []).slice(0, 16).map(f => str(f, 30)) }));
    const styles = (Array.isArray(b.styles) ? b.styles : []).slice(0, 80).map(s => str(s, 40));
    if (!catalog.length) return send(res, 400, { error: 'No sections were sent.' });
    const ids = new Set(catalog.map(s => s.id));
    const mode = b.mode === 'section' ? 'section' : 'page';
    const current = b.current ? JSON.stringify(b.current).slice(0, 12000) : '';
    const ask = mode === 'section'
      ? `Rewrite only the copy of this one section for the brief. Return it as the single item in "blocks", keep its id. Keep title, brand and style unchanged.\nSection: ${current}\nBrief: ${brief}`
      : `Build a page for this brief.\nBrief: ${brief}${current ? `\nCurrent page (improve it rather than start over if the brief asks for changes): ${current}` : ''}`;

    const client = new Anthropic();
    const r = await client.messages.create({
      model: MODEL, max_tokens: 8000,
      output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
      system: [{ type: 'text', text: SYSTEM }, { type: 'text', text: `Catalogue: ${JSON.stringify(catalog)}\nStyles: ${JSON.stringify(styles)}`, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: ask }],
    });
    if (r.stop_reason === 'refusal') return send(res, 422, { error: 'The AI declined that brief. Try describing the page differently.' });
    if (r.stop_reason === 'max_tokens') return send(res, 502, { error: 'The answer was too long. Try a shorter brief.' });
    const text = r.content.filter(c => c.type === 'text').map(c => c.text).join('');
    const out = JSON.parse(text);
    out.blocks = (out.blocks || []).filter(x => ids.has(x.id)).slice(0, 14).map(x => ({ id: x.id, fields: Object.fromEntries((x.fields || []).map(f => [str(f.key, 30), str(f.value, 600)])) }));
    if (!styles.includes(out.style)) out.style = styles[0] || '';
    return send(res, 200, { page: out, usage: { input: r.usage.input_tokens, output: r.usage.output_tokens } });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return send(res, 429, { error: 'The AI is busy. Try again in a minute.' });
    if (e instanceof Anthropic.AuthenticationError) return send(res, 503, { error: 'The AI key on the server is not valid.' });
    if (e instanceof Anthropic.APIError) return send(res, 502, { error: 'The AI service returned an error (' + e.status + ').' });
    return send(res, 400, { error: e.message || 'Something went wrong.' });
  }
}
