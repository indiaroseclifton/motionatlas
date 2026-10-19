/* Visual & Motion Atlas service worker: the atlas keeps working offline.
   Same-origin GETs are served from cache when present and refreshed in the background;
   pages fall back to the cached shell when the network is down. Video is never cached. */
const CACHE='atlas-v73';
const SHELL=['atlas.html','app.css','home.css','atlas-theme.css','atlas-enhance.css','atlas-nav.css','atlas-nav.js','component-lab.css','effects-lab.css','motion-lab.css','new-styles.css','atlas-features.css','specimen-films.css','live-sims.css','atlas-share.css','atlas-explore.css','atlas-tours.css','atlas-refine.css','system-previews.css','art-references.js','art-references.css','art-references.json','backgrounds.js','backgrounds.css','showcase.js','showcase.css','studio-river.js','studio-river.css','app.js','home.js','hero-scenes.js','atlas-themes.js','component-lab.js','effects-lab.js','motion-lab.js','new-styles.js','atlas-features.js','specimen-films.js','live-sims.js','atlas-share.js','atlas-explore.js','atlas-tours.js','atlas-refine.js','system-previews.js','atlas-enhance.js','catalogue.json','expansion.json','content.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL).catch(()=>{})).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin!==location.origin||/\.(mp4|webm)$/.test(u.pathname)||u.pathname.includes('/api/')||r.headers.has('range'))return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match('atlas.html'))));return;}
 e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));}return res;}).catch(()=>hit);return hit||net;}));});
