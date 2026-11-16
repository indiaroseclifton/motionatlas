'use strict';
/* Landing effects lab (#effects): the technique library.
   The techniques themselves live in effects-data.js (window.FX_TECHNIQUES). Each one is a complete page that runs
   full screen in a frame; "Copy" exports the very same page, so the code always matches the preview.
   Controls feed CSS variables into the page: --fx-intensity, --fx-duration and --fx-ease; "Reduced motion" adds
   .reduce to <html>. Interactions (interactions/manifest.js) list the techniques they use in `uses`, so each
   technique can link to the finished pieces built from it. */
function fxLab(){
 const E=window.FX_TECHNIQUES||[];
 const SITE='https://motionatlas-ten.vercel.app/';
 const BASE_CSS=`*{box-sizing:border-box}
body{margin:0;font:400 17px/1.5 "Inter",system-ui,sans-serif;background:#fafafa;color:#111113;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:"Inter",system-ui,sans-serif;font-weight:600;letter-spacing:-.03em;line-height:1.05;margin:0}
p{margin:0}
[hidden]{display:none!important}
img,video,canvas,svg{display:block;max-width:100%}
.kicker{font:500 13px/1.4 "Inter",system-ui,sans-serif;letter-spacing:0;color:#6b6f76}
.lede{font-size:clamp(16px,1.25vw,18px);line-height:1.5;max-width:42ch;color:#4b4f57}
.display{font-size:clamp(40px,6vw,88px)}
.cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.pill{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid #d4d4d8;background:#fff;color:#111113;font:500 15px/1 "Inter",system-ui,sans-serif;cursor:pointer}
.pill.solid{background:#111113;color:#fff;border-color:#111113}
:focus-visible{outline:2px solid #111113;outline-offset:3px}
.end{min-height:100vh;display:grid;place-content:center;gap:14px;text-align:center;padding:12vh 6vw;background:#fafafa;color:#111113}
.end h2{font-size:clamp(32px,4.4vw,64px)}.end .kicker{color:#6b6f76}
html.reduce *,html.reduce *::before,html.reduce *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}`;
 const BASE_JS=`if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reduce');
const FX=(()=>{const cs=getComputedStyle(document.documentElement);const n=(v,d)=>{const x=parseFloat(cs.getPropertyValue(v));return isNaN(x)?d:x;};return {i:n('--fx-intensity',1),d:n('--fx-duration',900),ease:cs.getPropertyValue('--fx-ease').trim()||'ease',R:document.documentElement.classList.contains('reduce'),clamp:(v,a,b)=>Math.min(b,Math.max(a,v)),progress(el){const r=el.getBoundingClientRect();return FX.clamp(-r.top/Math.max(1,el.offsetHeight-innerHeight),0,1);}};})();`;
 const EASES={expressive:['Expressive','cubic-bezier(.2,.7,.1,1)'],standard:['Standard','cubic-bezier(.4,0,.2,1)'],spring:['Spring','linear(0,.009,.035 2.1%,.141,.281 6.7%,.723 12.9%,.938 16.7%,1.017,1.077,1.121,1.149 24.3%,1.159,1.163,1.161,1.154 29.9%,1.129 32.8%,1.051 39.6%,1.017 43.1%,.991,.977 51%,.974 53.8%,.975 57.1%,.997 69.8%,1.003 76.9%,1.004 83.8%,1)'],linear:['Linear','linear'],snappy:['Snappy','cubic-bezier(.7,0,.2,1)']};
 const FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap">';
 const abs=s=>s.replace(/(["'(])assets\//g,'$1'+SITE+'assets/');
 const vars=o=>`html{--fx-intensity:${o.intensity};--fx-duration:${o.duration}ms;--fx-ease:${EASES[o.ease][1]}}`;
 /* A card preview is drawn about a fifth of full size, so its canvases are told the screen is coarser than it is. */
 const SMALL='<script>try{Object.defineProperty(window,"devicePixelRatio",{get:()=>.6,configurable:true})}catch(e){}<\/script>\n';
 function doc(e,o,forExport){
  const out=`<!doctype html>\n<html lang="en"${o.reduce&&!forExport?' class="reduce"':''}>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${e.id} ${e.name}</title>\n${FONTS}\n${e.extraHead||''}\n<style>\n${vars(o)}\n${BASE_CSS}\n${e.css}\n</style>\n</head>\n<body>\n${o.small&&!forExport?SMALL:''}${e.html}\n<script>\n${BASE_JS}\n${e.js}\n<\/script>\n</body>\n</html>`;
  return forExport?abs(out):out;
 }
 /* A technique made of several real documents (e.pages) is served to the preview as blob URLs, so links between the
    pages are true navigations. Each page gets the lab's settings, a <base> so its pictures resolve, and a few lines that
    point its links at the sibling pages (their addresses travel in window.name). The exported files have none of this. */
 function show(f,e,o){
  (f._urls||[]).forEach(u=>URL.revokeObjectURL(u));f._urls=[];
  if(!e.pages){f.removeAttribute('src');f.srcdoc=doc(e,o,false);return;}
  const head=`<base href="${new URL('.',location.href).href}">\n<style>:root{--fx-duration:${o.duration}ms;--fx-ease:${EASES[o.ease][1]}}</style>\n`;
  const links='<script>(()=>{let m={};try{m=JSON.parse(window.name)}catch(e){}document.querySelectorAll("a[href]").forEach(a=>{const u=new URL(a.href),to=m[u.pathname.split("/").pop()];if(to)a.href=to+u.hash;});})()<\/script>\n';
  const map={};
  for(const [name,html] of Object.entries(e.pages)){
   const page=html.replace('<html lang="en">',`<html lang="en"${o.reduce?' class="reduce"':''}>`).replace('</head>',head+'</head>').replace('</body>',links+'</body>');
   f._urls.push(map[name]=URL.createObjectURL(new Blob([page],{type:'text/html'})));
  }
  f.removeAttribute('srcdoc');try{f.contentWindow.name=JSON.stringify(map);}catch(err){}f.src=map[Object.keys(e.pages)[0]];
 }

 /* ---------- Lab UI ---------- */
 const S={q:'',filter:'All',device:'desktop',intensity:1,duration:900,ease:'expressive',reduce:matchMedia('(prefers-reduced-motion: reduce)').matches,codeTab:'full'};
 const TAGS=['All','Scroll','Reveal','Transition','Pointer','Type','Media','Canvas','WebGL','Ambient','Accessibility','CSS-first'];
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const WORDS=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
 const inWords=n=>n<20?WORDS[n]:TENS[Math.floor(n/10)]+(n%10?'-'+WORDS[n%10]:'');
 const cap=s=>s[0].toUpperCase()+s.slice(1);
 let root,dlg,frame,timer,cur=null,uses=null,seen=null,sized=null;

 /* Which shelf pieces use each technique: read from the interactions manifest, loaded on demand. */
 function loadUses(cb){
  if(uses)return cb();
  const done=()=>{uses={};(window.INTERACTIONS||[]).forEach(x=>(x.uses||[]).forEach(id=>(uses[id]=uses[id]||[]).push(x)));cb();};
  if(window.INTERACTIONS)return done();
  const s=document.createElement('script');s.src='interactions/manifest.js';s.onload=done;s.onerror=()=>{uses={};cb();};document.head.append(s);
 }

 function build(){
  const page=document.getElementById('effects');if(!page||document.getElementById('effectsLab'))return;
  root=document.createElement('section');root.id='effectsLab';root.className='fxl';
  const n=E.length;
  root.innerHTML=`<div class="listBar fxl-bar"><label><span class="tbHide">Search techniques</span><input type="search" id="fxlSearch" placeholder="Search scroll, reveal, cursor, shader…" autocomplete="off"></label><label><span class="tbHide">Kind of technique</span><select id="fxlTag">${TAGS.map(t=>{const c=t==='All'?n:E.filter(e=>e.tags.includes(t)).length;return c?`<option value="${t}">${t==='All'?'All kinds':t} (${c})</option>`:'';}).join('')}</select></label></div>
  <p class="resultcount" id="fxlCount" role="status"></p>
  <div class="fxl-grid" id="fxlGrid"></div>`;
  const anchor=page.querySelector('h1')?.closest('.aeHasBand')?page.querySelector('.aeRelated')||page.querySelector('.intro'):page.querySelector('.intro');
  (anchor||page.firstElementChild).insertAdjacentElement('afterend',root);
  dropLegacy(page);
  root.querySelector('#fxlTag').onchange=e=>{S.filter=e.target.value;grid();};root.querySelector('#fxlSearch').oninput=e=>{S.q=e.target.value.trim().toLowerCase();grid();};
  if(!dlg)makeDialog();
  grid();
  loadUses(()=>{grid();if(cur&&dlg.open)guide();});
  const id=(location.hash.match(/[?&]fx=(L\d\d)/)||[])[1];if(id&&!dlg.open)open(id);
 }

 /* The original 18 studies (landing.js) are superseded by this library; remove them and set the page intro. */
 function dropLegacy(page){
  let el=root.nextElementSibling;while(el){const next=el.nextElementSibling;if(!el.matches('script,dialog,.aeTop'))el.remove();el=next;}
  // expansion.js still renders catalogue cards into #effectGrid; keep an empty, hidden container for it.
  if(!document.getElementById('effectGrid')){const g=document.createElement('div');g.id='effectGrid';g.hidden=true;page.append(g);}
  const intro=page.querySelector('.intro');
  if(intro)intro.textContent=`${cap(inWords(E.length))} modern techniques for landing pages, each running live. Open one to tune it, read when to use it and copy the code. Finished pieces built from them are in UI interactions.`;
  const h1=page.querySelector('h1.pagetitle');if(h1&&/studio\.?$/i.test(h1.textContent))h1.textContent='Landing effects.';
 }

 function makeDialog(){
  dlg=document.createElement('dialog');dlg.className='fxl-dialog';dlg.setAttribute('aria-labelledby','fxlName');
  dlg.innerHTML=`<div class="fxl-top"><button type="button" class="fxl-close" aria-label="Close preview">←</button><div class="fxl-title"><span class="fxl-kicker" id="fxlCode"></span><b id="fxlName"></b></div>
   <div class="fxl-controls">
    <div class="fxl-seg" role="group" aria-label="Device">${[['desktop','Desktop'],['tablet','Tablet'],['phone','Phone']].map(([k,l])=>`<button type="button" data-device="${k}">${l}</button>`).join('')}</div>
    <label>Intensity<input type="range" id="fxlI" min="0.25" max="2" step="0.25"></label>
    <label>Duration<input type="range" id="fxlD" min="300" max="2000" step="100"><output id="fxlDo"></output></label>
    <label>Easing<select id="fxlE">${Object.entries(EASES).map(([k,[l]])=>`<option value="${k}">${l}</option>`).join('')}</select></label>
    <label class="fxl-check"><input type="checkbox" id="fxlR"> Reduced motion</label>
    <button type="button" class="fxl-btn" id="fxlReplay">Replay</button>
    <button type="button" class="fxl-btn primary" id="fxlCodeBtn" aria-expanded="false" aria-controls="fxlSide">Guide &amp; code</button>
   </div></div>
   <div class="fxl-body"><div class="fxl-stage"><div class="fxl-device" id="fxlDevice"><iframe id="fxlFrame" class="fxl-frame" title="Technique preview"></iframe></div></div>
   <aside class="fxl-side" id="fxlSide" hidden><div class="fxl-guide" id="fxlGuide"></div><div class="fxl-tabs" role="group" aria-label="Code part" id="fxlTabs"></div><pre class="fxl-pre" tabindex="0" aria-label="Code"><code id="fxlOut"></code></pre><p class="fxl-note">Asset paths point at this site, so the code runs as soon as you paste it. Swap in your own pictures before you ship.</p></aside></div>`;
  document.body.append(dlg);
  frame=dlg.querySelector('#fxlFrame');
  dlg.querySelector('.fxl-close').onclick=()=>dlg.close();
  dlg.addEventListener('close',()=>{frame.removeAttribute('srcdoc');frame.removeAttribute('src');(frame._urls||[]).forEach(u=>URL.revokeObjectURL(u));frame._urls=[];if(location.hash.includes('fx='))history.replaceState(null,'','#effects');});
  dlg.querySelectorAll('[data-device]').forEach(b=>b.onclick=()=>{S.device=b.dataset.device;sync();});
  dlg.querySelector('#fxlI').oninput=e=>{S.intensity=+e.target.value;reload();};
  dlg.querySelector('#fxlD').oninput=e=>{S.duration=+e.target.value;dlg.querySelector('#fxlDo').textContent=S.duration+' ms';reload();};
  dlg.querySelector('#fxlE').onchange=e=>{S.ease=e.target.value;reload(0);};
  dlg.querySelector('#fxlR').onchange=e=>{S.reduce=e.target.checked;reload(0);};
  dlg.querySelector('#fxlReplay').onclick=()=>reload(0);
  dlg.querySelector('#fxlCodeBtn').onclick=e=>{const side=dlg.querySelector('#fxlSide');side.hidden=!side.hidden;e.currentTarget.setAttribute('aria-expanded',String(!side.hidden));code();};
 }

 const first=t=>{const m=String(t).match(/^.*?[.!?](?=\s|$)/);return m?m[0]:t;};
 function grid(){
  if(!root)return;
  const terms=S.q.split(/\s+/).filter(Boolean);
  const list=E.filter(e=>(S.filter==='All'||e.tags.includes(S.filter))&&terms.every(t=>(e.name+' '+e.tags.join(' ')+' '+e.api+' '+e.what).toLowerCase().includes(t)));
  root.querySelectorAll('.fxl-live').forEach(f=>(f._urls||[]).forEach(u=>URL.revokeObjectURL(u)));
  root.querySelector('#fxlCount').textContent=list.length+(list.length===1?' technique':' techniques');
  root.querySelector('#fxlGrid').innerHTML=list.length?list.map(e=>`<button type="button" class="fxl-card" data-fx="${e.id}" aria-label="${esc(e.name)}: open the technique"><span class="fxl-thumb"></span><span class="fxl-meta"><span class="fxl-kicker">${e.tags.slice(0,2).join(' · ')}</span><b>${esc(e.name)}</b><span class="fxl-what">${esc(first(e.what))}</span></span></button>`).join(''):'<p class="fxl-none">No technique matches. Clear the search or choose All kinds.</p>';
  root.querySelectorAll('[data-fx]').forEach(b=>b.onclick=()=>open(b.dataset.fx));
  live();
 }

 /* Card previews run the real page in a small frame, so a card can never drift from its technique. A frame exists only
    while its card is near the viewport. With a mouse, pointing at a card (or focusing it) also scrolls the page gently.
    Reduced motion gets the same page held still. */
 const DEFAULTS={intensity:1,duration:900,ease:'expressive'};
 function live(){
  if(seen)seen.disconnect();if(sized)sized.disconnect();
  /* Save-Data: no previews at all; the card says so and the technique still opens. */
  if(navigator.connection?.saveData){root.querySelectorAll('.fxl-thumb').forEach(b=>b.dataset.note='Open to preview');return;}
  const calm=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
  const fit=box=>box.querySelector('iframe')?.style.setProperty('--k',(box.clientWidth/1280).toFixed(4));
  const rest=box=>{cancelAnimationFrame(box._raf);box._raf=0;try{box.querySelector('iframe')?.contentWindow.scrollTo(0,0);}catch{}};
  const tour=box=>{const f=box.querySelector('iframe');if(!f||box._raf)return;const t0=performance.now();
   const step=now=>{box._raf=requestAnimationFrame(step);try{const w=f.contentWindow,max=Math.min(w.document.documentElement.scrollHeight-w.innerHeight,w.innerHeight*4);if(max>60){const p=((now-t0)/(6000+max*3))%1,tri=p<.5?p*2:2-p*2;w.scrollTo(0,max*(.5-.5*Math.cos(tri*Math.PI)));}}catch{}};
   box._raf=requestAnimationFrame(step);};
  seen=new IntersectionObserver(es=>es.forEach(en=>{const box=en.target,f=box.querySelector('iframe');
   if(en.isIntersecting&&!f){const e=E.find(x=>x.id===box.parentNode.dataset.fx);if(!e)return;
    const n=document.createElement('iframe');n.className='fxl-live';n.setAttribute('aria-hidden','true');n.inert=true;n.tabIndex=-1;n.title='';n.onload=()=>n.classList.add('on');
    box.append(n);fit(box);show(n,e,Object.assign({},DEFAULTS,{reduce:calm,small:true}));}
   else if(!en.isIntersecting&&f){rest(box);(f._urls||[]).forEach(u=>URL.revokeObjectURL(u));f.remove();}}),{rootMargin:'160px 0px'});
  sized=new ResizeObserver(es=>es.forEach(en=>fit(en.target)));
  root.querySelectorAll('.fxl-card').forEach(card=>{const box=card.querySelector('.fxl-thumb');seen.observe(box);sized.observe(box);
   if(calm||!fine)return;
   card.addEventListener('pointerenter',()=>tour(box));card.addEventListener('pointerleave',()=>rest(box));card.addEventListener('focus',()=>tour(box));card.addEventListener('blur',()=>rest(box));});
 }

 function open(id){cur=E.find(e=>e.id===id);if(!cur)return;
  dlg.querySelector('#fxlCode').textContent=cur.tags.join(' · ');dlg.querySelector('#fxlName').textContent=cur.name;
  dlg.querySelector('#fxlI').value=S.intensity;dlg.querySelector('#fxlD').value=S.duration;dlg.querySelector('#fxlDo').textContent=S.duration+' ms';dlg.querySelector('#fxlE').value=S.ease;dlg.querySelector('#fxlR').checked=S.reduce;
  const tabs=cur.pages?Object.keys(cur.pages).map(f=>[f,f]):[['full','Full file'],['html','HTML'],['css','CSS'],['js','JS']];
  if(!tabs.some(([k])=>k===S.codeTab))S.codeTab=tabs[0][0];
  dlg.querySelector('#fxlTabs').innerHTML=tabs.map(([k,l])=>`<button type="button" data-code="${k}">${l}</button>`).join('')+'<button type="button" id="fxlCopy" class="fxl-copy">Copy</button>';
  dlg.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>{S.codeTab=b.dataset.code;code();});
  dlg.querySelector('#fxlCopy').onclick=async e=>{const b=e.currentTarget,txt=dlg.querySelector('#fxlOut').textContent;try{await navigator.clipboard.writeText(txt);b.textContent='Copied';}catch{const r=document.createRange();r.selectNodeContents(dlg.querySelector('#fxlOut'));getSelection().removeAllRanges();getSelection().addRange(r);b.textContent='Selected';}setTimeout(()=>b.textContent='Copy',1600);};
  guide();
  if(!dlg.open)dlg.showModal();
  history.replaceState(null,'','#effects?fx='+id);
  sync();reload(0);
 }
 function guide(){
  const used=uses?.[cur.id]||[];
  const rows=[['What it is',cur.what],['Built on',`<code>${esc(cur.api)}</code>`,true],['When to use it',cur.when],['Performance',`<span class="fxl-cost c-${cur.cost.toLowerCase().replace(' ','')}">${esc(cur.cost)} cost</span> Animates ${esc(cur.animates)}. ${esc(cur.perf)}`,true],['Accessibility and reduced motion',cur.a11y],['Browser support',cur.support]];
  dlg.querySelector('#fxlGuide').innerHTML=rows.map(([h,t,raw])=>`<h3>${h}</h3><p>${raw?t:esc(t)}</p>`).join('')+
   (used.length?`<h3>Used in</h3><p class="fxl-links">${used.map(x=>`<a href="interactions.html#${x.id}">${esc(x.t)}</a>`).join('')}</p>`:'');
 }
 function sync(){dlg.querySelectorAll('[data-device]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.device===S.device)));dlg.querySelector('#fxlDevice').dataset.device=S.device;}
 function reload(delay=220){clearTimeout(timer);timer=setTimeout(()=>{show(frame,cur,S);code();},delay);}
 function code(){if(!cur||dlg.querySelector('#fxlSide').hidden)return;dlg.querySelectorAll('[data-code]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.code===S.codeTab)));
  const parts=cur.pages?Object.fromEntries(Object.entries(cur.pages).map(([f,t])=>[f,abs(t)])):{full:doc(cur,S,true),html:abs(cur.html),css:`${vars(S)}\n${BASE_CSS}\n${abs(cur.css)}`,js:BASE_JS+'\n'+abs(cur.js)};
  dlg.querySelector('#fxlOut').textContent=parts[S.codeTab];}

 window.EffectsLab={effects:E,open,build,doc:(id,o)=>doc(E.find(e=>e.id===id),Object.assign({},S,o||{}),true),page:(id,o)=>doc(E.find(e=>e.id===id),Object.assign({},S,o||{}),false),show:(f,id,o)=>show(f,E.find(e=>e.id===id),Object.assign({},S,o||{}))};
 // landing.js rebuilds #effects when the catalogue loads, so rebuild the lab whenever it goes missing
 function watch(){build();const page=document.getElementById('effects');if(page)new MutationObserver(()=>{if(!document.getElementById('effectsLab'))build();}).observe(page,{childList:true});}
 if(document.readyState!=='loading')watch();else addEventListener('DOMContentLoaded',watch);
 addEventListener('hashchange',()=>{const id=(location.hash.match(/[?&]fx=(L\d\d)/)||[])[1];if(id&&root&&(!dlg.open||cur?.id!==id))open(id);});
}
// effects-data.js normally loads first; load it here if a cached page did not include it.
if(window.FX_TECHNIQUES)fxLab();else{const s=document.createElement('script');s.src='effects-data.js';s.onload=fxLab;document.head.append(s);}
