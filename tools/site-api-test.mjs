// Tests api/site.js (publishing) against a local folder store. Run: node tools/site-api-test.mjs
import os from 'os'; import fs from 'fs'; import path from 'path';
process.env.SHARE_LOCAL_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'site-api-'));
delete process.env.BLOB_READ_WRITE_TOKEN;
const { default: handler } = await import('../api/site.js');
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
function call(method, url, body, headers = {}) {
  return new Promise(resolve => {
    const res = { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, end(b) { resolve({ code: this.statusCode, headers: this.headers, body: b }); } };
    handler({ method, url, body, headers }, res);
  });
}
const J = r => JSON.parse(r.body);
ok(J(await call('GET', '/api/site?status')).enabled === true, 'status says publishing is enabled with a local store');
const files = [{ path: 'index.html', text: '<!doctype html><title>Home</title><a href="/site/X/about.html">About</a>' }, { path: 'about.html', text: '<!doctype html><title>About</title>' }, { path: '404.html', text: '<!doctype html><title>Nope</title>' }, { path: 'assets/site.css', text: 'body{margin:0}' }, { path: 'assets/uploads/u1.png', b64: Buffer.from('png').toString('base64') }];
const c = await call('POST', '/api/site', { name: 'Test', files }); const made = J(c);
ok(c.code === 201 && /^[\w-]{16}$/.test(made.id) && made.key.length > 20 && made.url === `/site/${made.id}/`, 'create returns id, secret key and url');
let g = await call('GET', `/api/site?id=${made.id}`);
ok(g.code === 200 && /text\/html/.test(g.headers['content-type']) && /sandbox allow-scripts/.test(g.headers['content-security-policy']) && /Home/.test(g.body), 'index is served as HTML inside a sandbox CSP');
g = await call('GET', `/api/site?id=${made.id}&path=about`); ok(g.code === 200 && /About/.test(g.body), 'clean URL resolves to about.html');
g = await call('GET', `/api/site?id=${made.id}&path=assets/site.css`); ok(/text\/css/.test(g.headers['content-type']) && !g.headers['content-security-policy'], 'css is served with its type');
g = await call('GET', `/api/site?id=${made.id}&path=assets/uploads/u1.png`); ok(g.headers['content-type'] === 'image/png' && Buffer.isBuffer(g.body) && g.body.toString() === 'png', 'binary files round-trip');
g = await call('GET', `/api/site?id=${made.id}&path=missing`); ok(g.code === 404 && /Nope/.test(g.body), 'unknown pages show the site’s own 404 page');
ok((await call('PUT', `/api/site?id=${made.id}`, { files: [{ path: 'index.html', text: 'x' }] })).code === 403, 'update without the key is refused');
ok((await call('PUT', `/api/site?id=${made.id}`, { files: [{ path: 'index.html', text: 'x' }] }, { 'x-edit-key': 'wrong' })).code === 403, 'update with a wrong key is refused');
const u = await call('PUT', `/api/site?id=${made.id}`, { files: [{ path: 'index.html', text: '<title>Updated</title>' }] }, { 'x-edit-key': made.key });
ok(u.code === 200 && /Updated/.test((await call('GET', `/api/site?id=${made.id}`)).body), 'update with the key replaces the site');
ok((await call('POST', '/api/site', { files: [{ path: '../evil.html', text: 'x' }] })).code === 400, 'path traversal is refused');
ok((await call('POST', '/api/site', { files: [{ path: 'run.exe', text: 'x' }] })).code === 400, 'unknown file types are refused');
ok((await call('POST', '/api/site', { files: [{ path: 'index.html', text: 'x'.repeat(4e6) }] })).code === 400, 'oversize sites are refused with a clear message');
ok((await call('GET', '/api/site?id=bad')).code === 404, 'bad ids are a 404 page');
ok((await call('DELETE', `/api/site?id=${made.id}`, null, { 'x-edit-key': made.key })).code === 200 && (await call('GET', `/api/site?id=${made.id}`)).code === 404, 'unpublish removes the site');
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
