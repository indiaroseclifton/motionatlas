'use strict';
/* Motion graphics studio: preview, edit and export the templates in templates.js. */
(()=>{
const G=window.MotionGfx,K=G.K,$=s=>document.querySelector(s);
const cv=$('#mgCanvas'),cx=cv.getContext('2d');
const FONTS=[['Inter','Inter, system-ui, sans-serif',700],['Space Grotesk','"Space Grotesk", sans-serif',700],['Bricolage Grotesque','"Bricolage Grotesque", sans-serif',800],['Manrope','Manrope, sans-serif',800],['Archivo Black','"Archivo Black", sans-serif',400],['Cormorant Garamond','"Cormorant Garamond", Georgia, serif',700],['Fraunces','Fraunces, Georgia, serif',700],['DM Serif Display','"DM Serif Display", Georgia, serif',400],['JetBrains Mono','"JetBrains Mono", monospace',700]];
const PALS=[['#FFFFFF','#111111','#E0522D'],['#0B0D14','#F4F5F8','#F4F5F8'],['#F6F1E7','#1B1A17','#E0522D'],['#101820','#FEE715','#FEE715'],['#0E1A14','#EAF4EC','#3DDC84'],['#F2F0EB','#111111','#FF2D6F'],['#F2F4F7','#14213D','#FCA311'],['#0A0A0A','#FFFFFF','#00E5FF'],['#2B1D0E','#F6E7C8','#D9A441'],['#E8F0FF','#0B2A6F','#2F6BFF'],['#111111','#EDEDED','#FF4D4D'],['#FAF7F2','#2E2A25','#7A9E7E']];
const RATIOS=[['16:9',1920,1080],['9:16',1080,1920],['1:1',1080,1080],['4:5',1080,1350]];
const KEY='mgfx-state-v2';
let S={id:'mask-rise',words:{},font:0,bg:PALS[0][0],ink:PALS[0][1],accent:PALS[0][2],alpha:false,ratio:0,dur:0};
try{const j=JSON.parse(localStorage.getItem(KEY)||'null');if(j&&G.get(j.id))S=Object.assign(S,j)}catch{}
const h=location.hash.slice(1);if(G.get(h))S.id=h;
let playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,pos=0,last=0,busy=false;
const tpl=()=>G.get(S.id);
const dur=()=>S.dur||tpl().dur;
const opts=()=>{const t=tpl(),w=S.words[t.id]||{},f=FONTS[S.font]||FONTS[0];return{t1:w.t1??t.f.t1??'',t2:w.t2??t.f.t2??'',t3:w.t3??t.f.t3??'',bg:S.bg,ink:S.ink,accent:S.accent,font:f[1],weight:f[2]}};
function paint(c,p,W,H,t,o,alpha){c.save();c.clearRect(0,0,W,H);if(!alpha){c.fillStyle=o.bg;c.fillRect(0,0,W,H)}try{t.draw(c,p,W,H,o,K)}finally{c.restore()}}
function size(){const r=RATIOS[S.ratio];if(cv.width!==r[1]||cv.height!==r[2]){cv.width=r[1];cv.height=r[2]}}
function frame(){size();paint(cx,pos,cv.width,cv.height,tpl(),opts(),S.alpha);$('#mgScrub').value=Math.round(pos*1000);$('#mgTime').textContent=(pos*dur()).toFixed(1)+' / '+dur().toFixed(1)+' s'}
function tick(now){if(playing&&!busy){pos=(pos+(now-last)/1000/dur())%1;frame()}last=now;thumbTick(now);requestAnimationFrame(tick)}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch{}};
const toast=m=>{const t=$('#mgToast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2600)};
const status=m=>$('#mgStatus').textContent=m;

/* ── side panel ── */
function words(){const t=tpl(),box=$('#mgWords');box.querySelectorAll('label').forEach(l=>l.remove());const o=opts();
 const LAB={t1:'Main line',t2:'Second line',t3:'Third line'};
 Object.keys(t.f).forEach(k=>{const l=document.createElement('label');l.className='f';const long=(t.f[k]||'').length>34;l.innerHTML=`<span>${LAB[k]}</span>`;const i=document.createElement(long?'textarea':'input');if(!long)i.type='text';i.value=o[k];i.maxLength=160;i.addEventListener('input',()=>{(S.words[t.id]=S.words[t.id]||{})[k]=i.value;save();if(!playing)frame();thumbs.get(t.id)?.draw()});l.append(i);box.append(l)});
 $('#mgName').textContent=t.name;$('#mgDesc').textContent=t.d;$('#mgDur').value=dur();$('#mgDurOut').textContent=dur().toFixed(1)+' s';
 document.querySelectorAll('#mgGrid button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.id===t.id)))}
function pick(id,scroll){S.id=id;S.dur=0;pos=0;history.replaceState(null,'','#'+id);words();frame();save();if(scroll)$('#mgStage').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'})}
$('#mgFont').innerHTML=FONTS.map((f,i)=>`<option value="${i}">${f[0]}</option>`).join('');$('#mgFont').value=S.font;
$('#mgFont').addEventListener('change',e=>{S.font=+e.target.value;save();document.fonts.load(`${FONTS[S.font][2]} 40px ${FONTS[S.font][1]}`).then(()=>{frame();redrawThumbs()})});
$('#mgPals').innerHTML=PALS.map((p,i)=>`<button type="button" data-i="${i}" aria-label="Palette ${i+1}" aria-pressed="false">${p.map(c=>`<i style="background:${c}"></i>`).join('')}</button>`).join('');
const syncCols=()=>{$('#mgBg').value=S.bg;$('#mgInk').value=S.ink;$('#mgAccent').value=S.accent;$('#mgAlpha').checked=S.alpha;document.querySelectorAll('#mgPals button').forEach(b=>{const p=PALS[b.dataset.i];b.setAttribute('aria-pressed',String(p[0]===S.bg&&p[1]===S.ink&&p[2]===S.accent))})};
$('#mgPals').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;[S.bg,S.ink,S.accent]=PALS[b.dataset.i];syncCols();save();frame();redrawThumbs()});
[['#mgBg','bg'],['#mgInk','ink'],['#mgAccent','accent']].forEach(([s,k])=>$(s).addEventListener('input',e=>{S[k]=e.target.value;syncCols();save();frame();redrawThumbs()}));
$('#mgAlpha').addEventListener('change',e=>{S.alpha=e.target.checked;save();frame()});
$('#mgRatio').innerHTML=RATIOS.map((r,i)=>`<button type="button" data-i="${i}" aria-pressed="${i===S.ratio}">${r[0]}</button>`).join('');
$('#mgRatio').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;S.ratio=+b.dataset.i;document.querySelectorAll('#mgRatio button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));save();frame()});
$('#mgDur').addEventListener('input',e=>{S.dur=+e.target.value;$('#mgDurOut').textContent=dur().toFixed(1)+' s';save();frame()});
const setPlay=on=>{playing=on;const b=$('#mgPlay');b.textContent=on?'Pause':'Play';b.setAttribute('aria-pressed',String(on))};
$('#mgPlay').addEventListener('click',()=>setPlay(!playing));
$('#mgScrub').addEventListener('input',e=>{setPlay(false);pos=Math.min(.9999,e.target.value/1000);frame()});
addEventListener('keydown',e=>{if(e.key===' '&&!/INPUT|TEXTAREA|SELECT|BUTTON|SUMMARY/.test(document.activeElement.tagName)){e.preventDefault();setPlay(!playing)}});

/* ── gallery ── */
const thumbs=new Map();let hot=null;
function build(){const grid=$('#mgGrid');grid.innerHTML='';G.list.forEach(t=>{const li=document.createElement('li');li.dataset.cat=t.cat;const b=document.createElement('button');b.type='button';b.dataset.id=t.id;const c=document.createElement('canvas');c.width=480;c.height=270;c.setAttribute('aria-hidden','true');b.append(c);b.insertAdjacentHTML('beforeend',`<b>${t.name}</b><span>${t.cat}</span>`);li.append(b);grid.append(li);
  const x=c.getContext('2d'),o=()=>{const w=S.words[t.id]||{},f=FONTS[S.font]||FONTS[0];return{t1:w.t1??t.f.t1??'',t2:w.t2??t.f.t2??'',t3:w.t3??t.f.t3??'',bg:S.bg,ink:S.ink,accent:S.accent,font:f[1],weight:f[2]}};
  const th={t,start:0,draw(p=t.loop?0:t.cat==='Transitions'?.42:.6){paint(x,p,480,270,t,o(),false)}};thumbs.set(t.id,th);th.draw();
  const on=()=>{hot=th;th.start=performance.now()},off=()=>{if(hot===th)hot=null;th.draw()};b.addEventListener('pointerenter',on);b.addEventListener('pointerleave',off);b.addEventListener('focus',on);b.addEventListener('blur',off);b.addEventListener('click',()=>pick(t.id,true))});
 /* one dropdown, each kind with its count: the same filter as the interactions shelf */
 const sel=$('#mgCat'),n=c=>G.list.filter(t=>t.cat===c).length,all=G.list.length;
 sel.innerHTML=`<option value="All">All templates (${all})</option>`+G.cats.filter(n).map(c=>`<option value="${c}">${c} (${n(c)})</option>`).join('');
 const show=()=>{const c=sel.value;let k=0;grid.querySelectorAll('li').forEach(li=>{li.hidden=c!=='All'&&li.dataset.cat!==c;if(!li.hidden)k++});$('#mgShown').textContent=k===all?all+' templates':k+' of '+all+' templates'};
 sel.addEventListener('change',show);show();
 $('#mgCount').textContent=G.list.length+' motion graphics to edit and export'}
function thumbTick(now){if(hot&&!matchMedia('(prefers-reduced-motion: reduce)').matches)hot.draw(((now-hot.start)/1000/hot.t.dur)%1)}
function redrawThumbs(){thumbs.forEach(t=>t.draw())}

/* ── exports ── */
const dl=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)};
const fname=ext=>`${S.id}-${RATIOS[S.ratio][0].replace(':','x')}.${ext}`;
const blobOf=(c,type='image/png')=>new Promise(r=>c.toBlob(r,type));
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.append(s)})}
async function xWebm(){if(!window.MediaRecorder||!cv.captureStream)return toast('This browser cannot record video. Try the GIF or the PNG sequence.');
 const type=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));if(!type)return toast('This browser cannot record WebM. Try the GIF or the PNG sequence.');
 const was=playing;busy=true;const stream=cv.captureStream(60),rec=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:12e6}),chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
 const done=new Promise(r=>rec.onstop=r);const d=dur()*1000;pos=0;frame();rec.start();const t0=performance.now();
 await new Promise(r=>{(function step(now){const e=now-t0;pos=Math.min(.9999,e/d);frame();status('Recording… '+Math.round(pos*100)+'%');e<d?requestAnimationFrame(step):r()})(performance.now())});
 rec.stop();await done;stream.getTracks().forEach(t=>t.stop());busy=false;setPlay(was);dl(new Blob(chunks,{type:'video/webm'}),fname('webm'));status('Video saved.')}
async function xGif(){busy=true;status('Making the GIF…');try{if(!window.gifenc)await loadScript('vendor/gifenc.js');const{GIFEncoder,quantize,applyPalette}=window.gifenc;const r=RATIOS[S.ratio],sc=Math.min(1,640/r[1]),W=Math.round(r[1]*sc),H=Math.round(r[2]*sc),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true}),t=tpl(),o=opts(),n=Math.round(dur()*20),g=GIFEncoder();
  for(let i=0;i<n;i++){paint(x,i/n,W,H,t,o,false);const d=x.getImageData(0,0,W,H).data,pal=quantize(d,256);g.writeFrame(applyPalette(d,pal),W,H,{palette:pal,delay:50});if(i%5===0){status('Making the GIF… '+Math.round(i/n*100)+'%');await new Promise(r=>setTimeout(r))}}
  g.finish();dl(new Blob([g.bytes()],{type:'image/gif'}),fname('gif'));status('GIF saved.')}catch(e){status('The GIF could not be made: '+e.message)}busy=false}
async function xPng(){frame();dl(await blobOf(cv),fname('png'));status('Frame saved.')}
async function xSeq(){busy=true;const r=RATIOS[S.ratio],c=document.createElement('canvas');c.width=r[1];c.height=r[2];const x=c.getContext('2d'),t=tpl(),o=opts(),n=Math.round(dur()*30),files=[];
 for(let i=0;i<n;i++){paint(x,i/n,r[1],r[2],t,o,S.alpha);files.push([`${S.id}/frame-${String(i+1).padStart(4,'0')}.png`,new Uint8Array(await(await blobOf(c)).arrayBuffer())]);if(i%4===0)status('Rendering frames… '+Math.round(i/n*100)+'%')}
 dl(window.PB.zip(files),fname('zip'));busy=false;status(n+' frames saved (30 a second).')}
const fnSrc=(k,f)=>{const s=f.toString();return s.startsWith(k+'(')||s.startsWith('async '+k)?s:k+':'+s};
function html(){const t=tpl(),o=opts(),r=RATIOS[S.ratio],f=FONTS[S.font],gf=f[0]==='Inter'?'':`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${f[0].replace(/ /g,'+')}:wght@400;500;${f[2]}&display=swap">\n`;
 const esc=s=>s.replace(/<\/(script)/gi,'<\\/$1'),escJ=s=>s.replace(/</g,'\\u003c');
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.name}</title>
${gf}<style>html,body{margin:0;height:100%;background:${S.alpha?'transparent':o.bg}}body{display:grid;place-items:center}canvas{max-width:100%;max-height:100vh;display:block}</style></head><body>
<canvas id="mg" width="${r[1]}" height="${r[2]}" role="img" aria-label="${(o.t1||t.name).replace(/"/g,'&quot;')}"></canvas>
<script>
/* ${t.name} · made with the Motion graphics studio, Visual & Motion Atlas. No libraries. */
const K={${esc(Object.entries(K).map(([k,v])=>fnSrc(k,v)).join(',\n '))}};
const T={${esc(fnSrc('draw',t.draw))}};
const O=${escJ(JSON.stringify(o))},DUR=${dur()},ALPHA=${S.alpha};
const cv=document.getElementById('mg'),c=cv.getContext('2d'),still=matchMedia('(prefers-reduced-motion: reduce)').matches;
function frame(p){c.save();c.clearRect(0,0,cv.width,cv.height);if(!ALPHA){c.fillStyle=O.bg;c.fillRect(0,0,cv.width,cv.height)}T.draw(c,p,cv.width,cv.height,O,K);c.restore()}
(document.fonts?document.fonts.load(O.weight+' 40px '+O.font):Promise.resolve()).finally(()=>{if(still)return frame(${t.loop?0:.6});const t0=performance.now();(function loop(now){frame(((now-t0)/1000/DUR)%1);requestAnimationFrame(loop)})(t0)});
<\/script></body></html>`}
async function act(x){$('#mgExport').open=false;if(busy)return;try{if(x==='webm')await xWebm();else if(x==='gif')await xGif();else if(x==='png')await xPng();else if(x==='seq')await xSeq();else if(x==='html'){dl(new Blob([html()],{type:'text/html'}),fname('html'));status('HTML file saved.')}}catch(e){busy=false;status('That export did not work: '+e.message)}}
$('#mgExport').addEventListener('click',e=>{const b=e.target.closest('[data-x]');if(b)act(b.dataset.x)});
document.addEventListener('pointerdown',e=>{const m=$('#mgExport');if(m.open&&!m.contains(e.target))m.open=false});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#mgExport').open){$('#mgExport').open=false;$('#mgExport summary').focus()}});
$('#mgCopy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(html());toast('HTML copied. Paste it into a file or an embed block.')}catch{toast('Copying was blocked. Use Export, One HTML file.')}});

window.MotionGfxStudio={state:()=>S,html,pick,frame:p=>{pos=p;frame()}};
build();syncCols();words();setPlay(playing);frame();
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{frame();redrawThumbs()});
requestAnimationFrame(t=>{last=t;requestAnimationFrame(tick)});
})();
