// A very small stand-in for Playwright. It drives an installed Chrome over the DevTools protocol, so the thumbnail
// scripts run with nothing to install. Needs Node 22 or newer (built-in WebSocket) and Chrome or Chromium.
//   import { launch } from './cdp.mjs';  const br = await launch({ width: 1280, height: 800, scale: 0.5 });
//   const pg = await br.newPage();  await pg.goto(url);  await pg.screenshot({ path, type: 'jpeg', quality: 74 });
// Set CHROME=/path/to/chrome to choose the browser. It always uses a throwaway profile, never your own.
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CANDIDATES = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter(Boolean);
export async function launch({ width = 1280, height = 800, scale = 1 } = {}) {
  const exe = CANDIDATES.find(p => fs.existsSync(p));
  if (!exe) throw new Error('No Chrome found. Set CHROME=/path/to/chrome');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-cdp-'));
  const port = 9300 + Math.floor(Math.random() * 500);
  const proc = spawn(exe, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + dir, '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--hide-scrollbars', '--mute-audio', '--enable-unsafe-swiftshader', `--window-size=${width},${height}`, 'about:blank'], { stdio: 'ignore' });
  let up = false;
  for (let i = 0; i < 80 && !up; i++) { try { await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); up = true; } catch { await sleep(250); } }
  if (!up) { proc.kill(); throw new Error('Chrome did not start'); }
  async function newPage() {
    const t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
    const ws = new WebSocket(t.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let id = 0; const waiting = new Map(), listeners = new Set();
    ws.onmessage = e => { const m = JSON.parse(e.data);
      if (m.id && waiting.has(m.id)) { const [res, rej] = waiting.get(m.id); waiting.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
      else if (m.method) listeners.forEach(fn => fn(m)); };
    const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; waiting.set(i, [res, rej]); ws.send(JSON.stringify({ id: i, method, params })); });
    await send('Page.enable'); await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile: false });
    const page = {
      send, wait: sleep,
      /* every protocol event for this tab, for example { method: 'Runtime.exceptionThrown', params } */
      on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
      /* runs before any script of every page this tab loads (for example to seed localStorage) */
      initScript(source) { return send('Page.addScriptToEvaluateOnNewDocument', { source: typeof source === 'function' ? `(${source})()` : source }); },
      async goto(url) { const loaded = new Promise(res => { const fn = m => { if (m.method === 'Page.loadEventFired') { listeners.delete(fn); res(); } }; listeners.add(fn); });
        await send('Page.navigate', { url }); await Promise.race([loaded, sleep(20000)]); },
      async evaluate(fn, arg) { const expression = typeof fn === 'function' ? `(${fn})(${JSON.stringify(arg)})` : fn;
        const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
        if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; },
      async waitFor(fn, timeout = 20000) { const t0 = Date.now(); while (Date.now() - t0 < timeout) { if (await page.evaluate(fn)) return true; await sleep(150); } throw new Error('waitFor timed out'); },
      addStyle(css) { return page.evaluate(c => { const s = document.createElement('style'); s.textContent = c; document.head.append(s); }, css); },
      /* clip: {x, y, width, height} in CSS pixels, or a CSS selector */
      async screenshot({ path: file, type = 'png', quality, clip } = {}) {
        if (typeof clip === 'string') clip = await page.evaluate(sel => { const r = document.querySelector(sel).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }, clip);
        const r = await send('Page.captureScreenshot', { format: type, ...(quality ? { quality } : {}), ...(clip ? { clip: { ...clip, scale: 1 } } : {}) });
        const buf = Buffer.from(r.data, 'base64'); if (file) fs.writeFileSync(file, buf); return buf; },
      async close() { ws.close(); await fetch(`http://127.0.0.1:${port}/json/close/${t.id}`).catch(() => {}); }
    };
    return page;
  }
  return { newPage, async close() { proc.kill(); await sleep(400); fs.rmSync(dir, { recursive: true, force: true }); } };
}
