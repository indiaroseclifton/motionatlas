// Capture the art-style loops frame by frame from art-styles.html and encode them.
//   node tools/previews/record-art.mjs [R37,R38] [--stills]
// Needs playwright (chromium) and ffmpeg. Outputs site/assets/art-styles/rNN.{mp4,webm,webp}.
import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process';
const here = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(here, '../../site/assets/art-styles');
const tmp = process.env.TMPDIR_ART || '/tmp/art-frames';
const args = process.argv.slice(2), stills = args.includes('--stills');
const only = args.find(a => /^R\d/.test(a))?.split(',');
const exe = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 960, height: 600 } });
await p.addInitScript(() => { window.__capture = true; });
await p.goto('file://' + path.join(here, 'art-styles.html'));
const ids = (only || await p.evaluate(() => window.ARTSTYLES));
fs.mkdirSync(out, { recursive: true });
const FR = 24, SEC = 5, N = FR * SEC;
for (const id of ids) {
  const dir = path.join(tmp, id); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const PI = Math.round(N * .8);
  for (const i of stills ? [PI] : [...Array(N).keys()]) {
    const data = await p.evaluate(([id, u]) => { renderAt(id, u); return document.getElementById('c').toDataURL('image/png'); }, [id, i / N]);
    fs.writeFileSync(path.join(dir, String(i).padStart(4, '0') + '.png'), Buffer.from(data.split(',')[1], 'base64'));
  }
  const base = path.join(out, id.toLowerCase()), src = path.join(dir, '%04d.png');
  const vf = 'scale=720:450:flags=lanczos,format=yuv420p';
  if (!stills) {
    execFileSync('ffmpeg', ['-nostdin', '-v', 'error', '-y', '-framerate', String(FR), '-i', src, '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-maxrate', '760k', '-bufsize', '1500k', '-profile:v', 'high', '-movflags', '+faststart', base + '.mp4']);
    const vp9 = ['-nostdin', '-v', 'error', '-y', '-framerate', String(FR), '-i', src, '-vf', vf, '-c:v', 'libvpx-vp9', '-b:v', '600k', '-row-mt', '1', '-passlogfile', path.join(dir, 'vp9')];
    execFileSync('ffmpeg', [...vp9, '-pass', '1', '-cpu-used', '4', '-f', 'webm', '/dev/null']);
    execFileSync('ffmpeg', [...vp9, '-pass', '2', '-cpu-used', '2', base + '.webm']);
  }
  execFileSync('ffmpeg', ['-nostdin', '-v', 'error', '-y', '-i', path.join(dir, String(PI).padStart(4, '0') + '.png'), '-vf', 'scale=720:450:flags=lanczos', '-c:v', 'libwebp', '-quality', '80', base + '.webp']);
  const sz = ['.mp4', '.webm', '.webp'].map(e => fs.existsSync(base + e) ? fs.statSync(base + e).size : 0);
  console.log(id, sz.join(' '));
}
await b.close();
