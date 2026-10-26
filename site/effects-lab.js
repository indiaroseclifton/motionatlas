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
body{margin:0;font-family:"Manrope",system-ui,sans-serif;background:#0b0d12;color:#f2f4f8;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:300;letter-spacing:-.02em;line-height:.92;margin:0}
p{margin:0}
img,video,canvas,svg{display:block;max-width:100%}
.kicker{font:500 12px/1.3 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase}
.lede{font-size:clamp(17px,1.5vw,21px);line-height:1.55;max-width:38ch}
.display{font-size:clamp(60px,10.5vw,168px)}
.cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.pill{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 20px;border-radius:999px;border:1px solid currentColor;background:none;color:inherit;font:600 14px "Manrope",sans-serif;cursor:pointer}
.pill.solid{background:#f2f4f8;color:#0b0d12;border-color:#f2f4f8}
:focus-visible{outline:3px solid #7dd3fc;outline-offset:3px}
.end{min-height:100vh;display:grid;place-content:center;gap:16px;text-align:center;padding:10vh 6vw;background:#0b0d12;color:#f2f4f8}
.end h2{font-size:clamp(48px,7vw,104px)}.end .kicker{color:#8d98ab}
html.reduce *,html.reduce *::before,html.reduce *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}`;
 const BASE_JS=`if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reduce');
const FX=(()=>{const cs=getComputedStyle(document.documentElement);const n=(v,d)=>{const x=parseFloat(cs.getPropertyValue(v));return isNaN(x)?d:x;};return {i:n('--fx-intensity',1),d:n('--fx-duration',900),ease:cs.getPropertyValue('--fx-ease').trim()||'ease',R:document.documentElement.classList.contains('reduce'),clamp:(v,a,b)=>Math.min(b,Math.max(a,v)),progress(el){const r=el.getBoundingClientRect();return FX.clamp(-r.top/Math.max(1,el.offsetHeight-innerHeight),0,1);}};})();`;
 const EASES={expressive:['Expressive','cubic-bezier(.2,.7,.1,1)'],standard:['Standard','cubic-bezier(.4,0,.2,1)'],spring:['Spring','linear(0,.009,.035 2.1%,.141,.281 6.7%,.723 12.9%,.938 16.7%,1.017,1.077,1.121,1.149 24.3%,1.159,1.163,1.161,1.154 29.9%,1.129 32.8%,1.051 39.6%,1.017 43.1%,.991,.977 51%,.974 53.8%,.975 57.1%,.997 69.8%,1.003 76.9%,1.004 83.8%,1)'],linear:['Linear','linear'],snappy:['Snappy','cubic-bezier(.7,0,.2,1)']};
 const FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Manrope:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap">';
 const abs=s=>s.replace(/(["'(])assets\//g,'$1'+SITE+'assets/');
 const vars=o=>`html{--fx-intensity:${o.intensity};--fx-duration:${o.duration}ms;--fx-ease:${EASES[o.ease][1]}}`;
 function doc(e,o,forExport){
  const out=`<!doctype html>\n<html lang="en"${o.reduce&&!forExport?' class="reduce"':''}>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${e.id} ${e.name}</title>\n${FONTS}\n${e.extraHead||''}\n<style>\n${vars(o)}\n${BASE_CSS}\n${e.css}\n</style>\n</head>\n<body>\n${e.html}\n<script>\n${BASE_JS}\n${e.js}\n<\/script>\n</body>\n</html>`;
  return forExport?abs(out):out;
 }

 /* ---------- Lab UI ---------- */
 const S={filter:'All',device:'desktop',intensity:1,duration:900,ease:'expressive',reduce:matchMedia('(prefers-reduced-motion: reduce)').matches,codeTab:'full'};
 const TAGS=['All','Scroll','Reveal','Transition','Pointer','Type','Media','Canvas','WebGL','Ambient','Accessibility','CSS-first'];
 const CLIPS='assets/fx/clips/';
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const WORDS=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
 const inWords=n=>n<20?WORDS[n]:TENS[Math.floor(n/10)]+(n%10?'-'+WORDS[n%10]:'');
 const cap=s=>s[0].toUpperCase()+s.slice(1);
 let root,dlg,frame,timer,cur=null,uses=null;

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
  root.innerHTML=`<div class="fxl-head"><div><p class="fxl-kicker">Landing effects · ${n} techniques</p><h2>The techniques.</h2></div><p>Each card is one reusable technique, running for real: CSS scroll-driven animation, View Transitions, @starting-style, shaders, variable fonts and more. Open one full screen, tune intensity, duration and easing, read when to use it and how it degrades, then copy the exact code. For finished pieces built from these, see the <a href="interactions.html">Interactions shelf</a>.</p></div>
  <div class="fxl-filters" role="group" aria-label="Filter techniques">${TAGS.map(t=>{const c=t==='All'?n:E.filter(e=>e.tags.includes(t)).length;return c?`<button type="button" data-tag="${t}" aria-pressed="${t===S.filter}">${t}<span>${c}</span></button>`:'';}).join('')}</div>
  <div class="fxl-grid" id="fxlGrid"></div>`;
  const anchor=page.querySelector('h1')?.closest('.aeHasBand')?page.querySelector('.aeRelated')||page.querySelector('.intro'):page.querySelector('.intro');
  (anchor||page.firstElementChild).insertAdjacentElement('afterend',root);
  dropLegacy(page);
  root.querySelectorAll('[data-tag]').forEach(b=>b.onclick=()=>{S.filter=b.dataset.tag;root.querySelectorAll('[data-tag]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));grid();});
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
  if(intro)intro.textContent=`${cap(inWords(E.length))} modern techniques for landing pages, each running live with tunable settings and copyable code. The Interactions shelf holds the finished pieces built from them.`;
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
   <aside class="fxl-side" id="fxlSide" hidden><div class="fxl-guide" id="fxlGuide"></div><div class="fxl-tabs" role="group" aria-label="Code part" id="fxlTabs"></div><pre class="fxl-pre" tabindex="0" aria-label="Code"><code id="fxlOut"></code></pre><p class="fxl-note">Asset paths point at this site, so the code runs as soon as you paste it. Swap in your own images and films before you ship.</p></aside></div>`;
  document.body.append(dlg);
  frame=dlg.querySelector('#fxlFrame');
  dlg.querySelector('.fxl-close').onclick=()=>dlg.close();
  dlg.addEventListener('close',()=>{frame.removeAttribute('srcdoc');frame.removeAttribute('src');if(location.hash.includes('fx='))history.replaceState(null,'','#effects');});
  dlg.querySelectorAll('[data-device]').forEach(b=>b.onclick=()=>{S.device=b.dataset.device;sync();});
  dlg.querySelector('#fxlI').oninput=e=>{S.intensity=+e.target.value;reload();};
  dlg.querySelector('#fxlD').oninput=e=>{S.duration=+e.target.value;dlg.querySelector('#fxlDo').textContent=S.duration+' ms';reload();};
  dlg.querySelector('#fxlE').onchange=e=>{S.ease=e.target.value;reload(0);};
  dlg.querySelector('#fxlR').onchange=e=>{S.reduce=e.target.checked;reload(0);};
  dlg.querySelector('#fxlReplay').onclick=()=>reload(0);
  dlg.querySelector('#fxlCodeBtn').onclick=e=>{const side=dlg.querySelector('#fxlSide');side.hidden=!side.hidden;e.currentTarget.setAttribute('aria-expanded',String(!side.hidden));code();};
 }

 function grid(){
  if(!root)return;
  const list=E.filter(e=>S.filter==='All'||e.tags.includes(S.filter));
  root.querySelector('#fxlGrid').innerHTML=list.map(e=>{const u=uses?.[e.id]?.length||0;return `<button type="button" class="fxl-card" data-fx="${e.id}" aria-label="${esc(e.name)}: open the technique"><span class="fxl-thumb"><img src="${CLIPS}${e.id}.webp" alt="" loading="lazy" width="1280" height="800"><video muted loop playsinline preload="none" aria-hidden="true" data-webm="${CLIPS}${e.id}.webm" data-mp4="${CLIPS}${e.id}.mp4"></video><span class="fxl-type">Technique</span></span><span class="fxl-meta"><span class="fxl-kicker">${e.id} · ${e.tags.join(' · ')}</span><b>${esc(e.name)}</b><code class="fxl-api">${esc(e.api)}</code>${u?`<span class="fxl-used">Used in ${u} shelf piece${u>1?'s':''}</span>`:''}</span></button>`;}).join('');
  root.querySelectorAll('[data-fx]').forEach(b=>b.onclick=()=>open(b.dataset.fx));
  clips();
 }

 /* Card clips: the poster shows at once; the clip plays on hover or focus with a mouse, and while the card is
    in view on touch screens. Reduced motion and Save-Data keep the poster. */
 let clipIO=null;
 function load(v){if(v.dataset.ready)return;v.dataset.ready='1';v.innerHTML=`<source src="${v.dataset.webm}" type="video/webm"><source src="${v.dataset.mp4}" type="video/mp4">`;v.load();}
 function play(v){load(v);v.classList.add('on');const p=v.play();if(p)p.catch(()=>{});}
 function stop(v){v.pause();v.classList.remove('on');}
 function clips(){
  if(clipIO){clipIO.disconnect();clipIO=null;}
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||navigator.connection?.saveData)return;
  const vids=[...root.querySelectorAll('.fxl-thumb video')];
  if(matchMedia('(hover: hover) and (pointer: fine)').matches){
   vids.forEach(v=>{const card=v.closest('.fxl-card');card.addEventListener('pointerenter',()=>play(v));card.addEventListener('pointerleave',()=>stop(v));card.addEventListener('focus',()=>play(v));card.addEventListener('blur',()=>stop(v));});
  }else{
   clipIO=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting?play(x.target):stop(x.target)),{threshold:.75});
   vids.forEach(v=>clipIO.observe(v));
  }
 }

 function open(id){cur=E.find(e=>e.id===id);if(!cur)return;
  dlg.querySelector('#fxlCode').textContent=cur.id+' · Technique · '+cur.api;dlg.querySelector('#fxlName').textContent=cur.name;
  dlg.querySelector('#fxlI').value=S.intensity;dlg.querySelector('#fxlD').value=S.duration;dlg.querySelector('#fxlDo').textContent=S.duration+' ms';dlg.querySelector('#fxlE').value=S.ease;dlg.querySelector('#fxlR').checked=S.reduce;
  const tabs=cur.src?cur.files.map(f=>[f,f]):[['full','Full file'],['html','HTML'],['css','CSS'],['js','JS']];
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
  const rows=[['What it is',cur.what],['When to use it',cur.when],['Performance',`<span class="fxl-cost c-${cur.cost.toLowerCase().replace(' ','')}">${esc(cur.cost)} cost</span> Animates ${esc(cur.animates)}. ${esc(cur.perf)}`,true],['Accessibility and reduced motion',cur.a11y],['Browser support',cur.support]];
  dlg.querySelector('#fxlGuide').innerHTML=rows.map(([h,t,raw])=>`<h3>${h}</h3><p>${raw?t:esc(t)}</p>`).join('')+
   (used.length?`<h3>Used in</h3><p class="fxl-links">${used.map(x=>`<a href="interactions.html#${x.id}">${esc(x.t)}</a>`).join('')}</p>`:'');
 }
 function sync(){dlg.querySelectorAll('[data-device]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.device===S.device)));dlg.querySelector('#fxlDevice').dataset.device=S.device;}
 function reload(delay=220){clearTimeout(timer);timer=setTimeout(()=>{
  if(cur.src){frame.removeAttribute('srcdoc');const q=new URLSearchParams({i:S.intensity,d:S.duration,e:EASES[S.ease][1]});if(S.reduce)q.set('r','1');frame.src=cur.src+'?'+q;}
  else{frame.removeAttribute('src');frame.srcdoc=doc(cur,S,false);}
  code();},delay);}
 const fileCache={};
 function code(){if(!cur||dlg.querySelector('#fxlSide').hidden)return;dlg.querySelectorAll('[data-code]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.code===S.codeTab)));
  const out=dlg.querySelector('#fxlOut');
  if(cur.src){const dir=cur.src.replace(/[^/]+$/,''),f=S.codeTab,key=dir+f;
   const show=t=>{if(cur.src.startsWith(dir))out.textContent=t;};
   if(fileCache[key])return show(fileCache[key]);out.textContent='Loading '+f+'…';
   fetch(dir+f).then(r=>r.text()).then(t=>{fileCache[key]=t.replace(/(["'])\.\.\//g,'$1'+SITE+dir.replace(/vt\/$/,''));if(S.codeTab===f)show(fileCache[key]);}).catch(()=>{out.textContent='Could not load '+f+'.';});return;}
  const parts={full:doc(cur,S,true),html:abs(cur.html),css:`${vars(S)}\n${BASE_CSS}\n${abs(cur.css)}`,js:BASE_JS+'\n'+abs(cur.js)};
  out.textContent=parts[S.codeTab];}

 window.EffectsLab={effects:E,open,build,doc:(id,o)=>doc(E.find(e=>e.id===id),Object.assign({},S,o||{}),true),page:(id,o)=>doc(E.find(e=>e.id===id),Object.assign({},S,o||{}),false)};
 // landing.js rebuilds #effects when the catalogue loads, so rebuild the lab whenever it goes missing
 function watch(){build();const page=document.getElementById('effects');if(page)new MutationObserver(()=>{if(!document.getElementById('effectsLab'))build();}).observe(page,{childList:true});}
 if(document.readyState!=='loading')watch();else addEventListener('DOMContentLoaded',watch);
 addEventListener('hashchange',()=>{const id=(location.hash.match(/[?&]fx=(L\d\d)/)||[])[1];if(id&&root&&(!dlg.open||cur?.id!==id))open(id);});
}
// effects-data.js normally loads first; load it here if a cached page did not include it.
if(window.FX_TECHNIQUES)fxLab();else{const s=document.createElement('script');s.src='effects-data.js';s.onload=fxLab;document.head.append(s);}
