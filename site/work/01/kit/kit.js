'use strict';
/* 01 direction kit · shared runtime for the 20 home-page directions.
   Fills the fixed brief elements (logo, status line, nav, claims, footer), runs one war-room data engine
   that any feed style can read through data attributes, and adds the review bar (prev / all / next / pause).
   Feed hooks:  [data-v=key] text · [data-bar=key] sets --v · [data-gauge=key] ring · [data-bars=key] histogram
               [data-spark=key] canvas line (stroke = CSS color) · [data-log=N] list · [data-ticker=log|names]
               [data-hex=N] hex rows · [data-clock] · [data-decode] scramble-in · [data-split] chars · [data-count] */
window.Kit=(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const DIRS=[
  ['01','Graphite Standard','The brief played straight: solid towers, scroll-driven camera, three framed feeds.','Geist · Geist Mono','City3D solid'],
  ['02','Midnight Wireframe','The city as pure edge light. A terminal strip runs the full width of the floor.','Space Grotesk · JetBrains Mono','City3D wire'],
  ['03','Platinum Monolith','A street-level camera looking up at the tallest chips. Expanded caps, feeds stacked in a right rail.','Archivo Expanded · IBM Plex Mono','City3D low camera'],
  ['04','Long Exposure','Traffic photographed over minutes: light trails through dark towers, with a ticker rail.','Inter Tight · DM Mono','Hero2D trails'],
  ['05','Binary Metropolis','Every tower is built from 0s and 1s. Feeds sit in terminal windows.','JetBrains Mono','Hero2D glyphs'],
  ['06','Point Cloud','A lidar scan of the board. Radial gauges instead of bars.','Sora · Fira Code','City3D points'],
  ['07','Layered Parallax','Six cut-paper skylines sliding at their own depth. Feeds float between layers.','Manrope · Red Hat Mono','Hero2D layers'],
  ['08','War Room HUD','Targeting reticles lock onto towers as the camera drifts. Readouts in corner brackets.','Chakra Petch · Share Tech Mono','City3D + projected HUD'],
  ['09','Luxe','A slow, quiet city and a serif headline. Feeds reduced to one hairline ticker.','Instrument Serif · Geist Mono','City3D soft'],
  ['10','Blueprint','The city drawn as an engineering projection, traced in live, with a spec table.','IBM Plex Sans Condensed · IBM Plex Mono','Hero2D blueprint'],
  ['11','Wet Neon','The city mirrored in a wet board, purple in the light. Bold rounded display type.','Unbounded · Azeret Mono','City3D reflect'],
  ['12','Split Screen','Type owns the left 45%. The city runs in a tall framed window on the right.','Bricolage Grotesque · Geist Mono','City3D framed'],
  ['13','Orbit Cam','The camera circles the downtown core on its own. A compass dial tracks the bearing.','Syne · Syne Mono','City3D orbit'],
  ['14','Data Skyline','Tower heights are live load. The skyline rises and falls with the feed.','Oxanium · Roboto Mono','City3D live heights'],
  ['15','Tilt-Shift Macro','A macro lens on the board: sharp middle band, blurred foreground and sky.','Figtree · Spline Sans Mono','City3D close + blur bands'],
  ['16','Glitch Signal','Wireframe city, interference bands and an RGB-split headline. Hex streams for feeds.','Space Mono · Space Grotesk','City3D wire + glitch'],
  ['17','Kinetic Type','The headline is the window: the city shows only through the letters.','Archivo Black · Archivo','City3D through type'],
  ['18','Minimal Signal','Fog, one trace lighting end to end, and a lot of graphite. Light weight type.','Geist Light · Geist Mono','City3D route'],
  ['19','Swarm Lights','Agents as lights flocking between towers. Feeds as a soft ledger.','Plus Jakarta Sans · Geist Mono','Hero2D swarm'],
  ['20','Command Deck','The home page is the console: panels docked over the city and a live command line.','JetBrains Mono · Geist','City3D + console']
 ].map(([id,name,idea,type,hero])=>({id,name,idea,type,hero,href:'d'+id+'.html'}));

 const LOGO=`<svg viewBox="0 0 208 100" role="img" aria-label="01ai"><path fill="currentColor" d="M31 0H31A31 31 0 0 1 62 31V69A31 31 0 0 1 31 100H31A31 31 0 0 1 0 69V31A31 31 0 0 1 31 0ZM31 17A14 14 0 0 0 17 31V69A14 14 0 0 0 31 83H31A14 14 0 0 0 45 69V31A14 14 0 0 0 31 17ZM76 18 94 0H111V100H94V24L84 34ZM152 38H152A26 26 0 0 1 178 64V74A26 26 0 0 1 152 100H152A26 26 0 0 1 126 74V64A26 26 0 0 1 152 38ZM152 53A10 10 0 0 0 142 63V75A10 10 0 0 0 152 85H152A10 10 0 0 0 162 75V63A10 10 0 0 0 152 53ZM162 38H178V100H162ZM192 38H208V100H192Z"/><path style="fill:var(--k-dot,#7FE7F7)" d="M192 10H208V26H192Z"/></svg>`;
 const HEAD=`<a class="k-logo" href="#top">${LOGO}</a>
<div class="k-right"><p class="k-status">SERVER v1.0 <i>//</i> NODE: WAR ROOM <i>//</i> UPTIME <b>99.999%</b></p>
<nav class="k-nav" aria-label="Primary"><a class="k-sec" href="../agents.html">Agents</a><a class="k-sec" href="../integrations.html">Integrations</a><a class="k-sec" href="../origin.html">Origin</a><a class="k-login" href="../login.html">Login</a><a class="k-apply" href="../apply.html">Apply</a></nav></div>`;
 const CLAIMS=[['The most powerful <em>agentic AI.</em>','Full stop'],['<em>1000+</em> models. More always coming.','Every frontier lab'],['Endless skills.','Learned, not listed'],['Adaptive routing.','Right model, every token'],['The best agents.','They build the next ones'],['The maximum <em>power stack.</em>','No ceiling']];

 /* ---------- data engine ---------- */
 const S={cpu:63.2,mem:72.7,nodes:14208,agents:3912,tps:48210,lat:4.2,models:1042,skills:88412};
 const loc=n=>Math.round(n).toLocaleString('en-GB');
 const FMT={cpu:v=>v.toFixed(1)+'%',mem:v=>v.toFixed(1)+'%',nodes:loc,agents:loc,tps:loc,lat:v=>v.toFixed(1)+'ms',models:loc,skills:loc};
 const NORM={cpu:v=>v/100,mem:v=>v/100,nodes:v=>(v-13000)/2500,agents:v=>v/5000,tps:v=>v/62000,lat:v=>v/9,models:v=>(v-1000)/80,skills:v=>(v%1000)/1000};
 const hist={};for(const k of Object.keys(S)){hist[k]=Array.from({length:90},(_,i)=>Math.max(.06,Math.min(.96,NORM[k](S[k])+.18*Math.sin(i/6+k.length)+.06*(Math.random()-.5))))}
 const walk=(v,a,lo,hi)=>Math.max(lo,Math.min(hi,v+(Math.random()-.5)*a));
 function step(){S.cpu=walk(S.cpu,9,48,91);S.mem=walk(S.mem,4,61,84);S.nodes+=((Math.random()*44|0)-14);S.agents=walk(S.agents,120,3400,4800);S.tps=walk(S.tps,4200,38000,61000);S.lat=walk(S.lat,1.1,1.8,8.6);S.skills+=1+(Math.random()*9|0);if(Math.random()<.22)S.models++}
 const VERBS=[['TASK ALLOCATED','PRIORITY',()=>Math.random()*3|0],['CONTEXT SYNC','DELTA',()=>(Math.random()*4+.5).toFixed(1)+'ms'],['STRATEGY UPDATE','CONFIDENCE',()=>(0.9+Math.random()*.099).toFixed(3)],['EXECUTING','IMPACT RADIUS',()=>(80+Math.random()*19).toFixed(1)+'%'],['ROUTE SWITCH','MODEL',()=>['ORION-4','HELIX-L','KESTREL','VANTA-2','NOVA-X'][Math.random()*5|0]],['SKILL ACQUIRED','ID',()=>'SK-'+(10000+Math.random()*89999|0)],['AGENT SPAWNED','LINEAGE',()=>'G'+(40+Math.random()*30|0)],['EQUILIBRIUM HOLD','DRIFT',()=>(Math.random()*.001).toFixed(4)]];
 const pad=n=>String(n).padStart(2,'0'),stamp=()=>{const d=new Date();return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`};
 function line(fmt){const v=VERBS[Math.random()*VERBS.length|0],who=Math.random()<.12?'SYSTEM':'AGENT_'+(1000+Math.random()*8999|0),val=v[2]();
  if(fmt==='short')return `<b class="k-l-v">${v[0]}</b> <em>${val}</em>`;
  if(fmt==='json')return `<span class="k-l-t">{t:"${stamp()}",</span> <b class="k-l-v">op:"${v[0].toLowerCase().replace(' ','_')}"</b>, <em>${v[1].toLowerCase().replace(' ','_')}:"${val}"</em>}`;
  return `<time class="k-l-t">[${stamp()}]</time> <span class="k-l-a">${who}</span> &gt;&gt; <b class="k-l-v">${v[0]}</b> [ ${v[1]} <em>${val}</em> ]`}
 const $$=(s,r=document)=>[...r.querySelectorAll(s)];
 function paint(){
  $$('[data-v]').forEach(e=>{const k=e.dataset.v;if(k in S)e.textContent=FMT[k](S[k])});
  $$('[data-bar]').forEach(e=>e.style.setProperty('--v',Math.max(0,Math.min(1,NORM[e.dataset.bar](S[e.dataset.bar]))).toFixed(3)));
  $$('[data-gauge]').forEach(e=>{const c=e.querySelector('.k-g-on');if(c)c.style.strokeDashoffset=(1-Math.max(0,Math.min(1,NORM[e.dataset.gauge](S[e.dataset.gauge]))))*251.3});
  $$('[data-bars]').forEach(e=>{const h=hist[e.dataset.bars],n=e.children.length;[...e.children].forEach((b,i)=>b.style.height=(h[h.length-n+i]*100).toFixed(1)+'%')})}
 function sparks(){$$('canvas[data-spark]').forEach(c=>{const d=Math.min(2,devicePixelRatio||1),w=c.clientWidth,h=c.clientHeight;if(!w||!h)return;if(c.width!==Math.round(w*d)){c.width=w*d;c.height=h*d}const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);
  const data=hist[c.dataset.spark],cs=getComputedStyle(c),fill=c.dataset.fill!==undefined;x.strokeStyle=cs.color;x.lineWidth=+c.dataset.lw||1.2;x.beginPath();data.forEach((v,i)=>{const px=i/(data.length-1)*w,py=h-v*h*.9-1;i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke();
  if(fill){x.lineTo(w,h);x.lineTo(0,h);x.closePath();x.globalAlpha=.14;x.fillStyle=cs.color;x.fill();x.globalAlpha=1}
  x.fillStyle=cs.getPropertyValue('--k-tip').trim()||'#3CF29A';x.fillRect(w-3,h-data[data.length-1]*h*.9-2.5,3,3)})}
 function fast(){for(const k in hist){const a=hist[k],t=NORM[k](S[k]);a.shift();a.push(Math.max(.06,Math.min(.96,a[a.length-1]+(t-a[a.length-1])*.25+(Math.random()-.5)*.1)))}sparks();emit('fast')}
 function logs(){$$('[data-log]').forEach(l=>{const li=document.createElement('li');li.innerHTML=line(l.dataset.fmt);l.append(li);while(l.children.length>(+l.dataset.log||7))l.firstElementChild.remove()})}
 const HEX='0123456789ABCDEF';const hexRow=n=>Array.from({length:n},()=>HEX[Math.random()*16|0]+HEX[Math.random()*16|0]).join(' ');
 function hex(){$$('[data-hex]').forEach(e=>{const rows=+e.dataset.hex||6,cols=+e.dataset.cols||8;if(e.children.length<rows){e.innerHTML=Array.from({length:rows},()=>`<li>${hexRow(cols)}</li>`).join('')}else{const r=e.children[Math.random()*rows|0];r.textContent=hexRow(cols)}})}
 function clock(){const d=new Date();$$('[data-clock]').forEach(e=>e.textContent=`${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`)}
 const ev={};function on(n,f){(ev[n]=ev[n]||[]).push(f)}function emit(n){(ev[n]||[]).forEach(f=>f(S,hist))}
 let timers=[],paused=false;
 function run(){stopT();if(paused||reduce)return;timers=[setInterval(fast,240),setInterval(()=>{step();paint();emit('tick')},1200),setInterval(logs,950),setInterval(hex,150),setInterval(clock,1000)]}
 function stopT(){timers.forEach(clearInterval);timers=[]}

 /* ---------- type effects ---------- */
 const GL='01/\\<>_#▚▞';
 function decode(el,dur=750){const fin=el.textContent;if(reduce){return}el.setAttribute('aria-label',fin);const t0=performance.now();const f=now=>{const p=Math.min(1,(now-t0)/dur);el.textContent=[...fin].map((c,i)=>c===' '||i/fin.length<p?c:GL[Math.random()*GL.length|0]).join('');if(p<1)requestAnimationFrame(f);else{el.textContent=fin;el.removeAttribute('aria-label')}};requestAnimationFrame(f)}
 function split(el){const txt=el.textContent.replace(/\s+/g,' ').trim();el.setAttribute('aria-label',txt);let i=0;el.innerHTML=txt.split(' ').map(w=>`<span class="k-w" aria-hidden="true">${[...w].map(c=>`<span class="k-ch" style="--i:${i++}">${c}</span>`).join('')}</span>`).join(' ')}
 function count(el){const end=+el.dataset.count,dur=1400,t0=performance.now();if(reduce){el.textContent=loc(end);return}const f=now=>{const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=loc(end*e);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}

 /* ---------- hero + pause ---------- */
 let hero=null;const heroes=[];
 function setPaused(p){paused=p;document.documentElement.classList.toggle('k-paused',p);heroes.forEach(h=>h&&(p?h.pause():h.play()));p?stopT():run();const b=document.querySelector('.k-pause');if(b){b.setAttribute('aria-pressed',p);b.textContent=p?'Play':'Pause'}}
 function city(cv,o={}){const h=window.City3D&&City3D.start(cv,{still:reduce,...o});if(!h)cv.classList.add('k-fallback');heroes.push(h);hero=h;return h}
 function flat(kind,cv,o={}){const h=window.Hero2D&&Hero2D[kind](cv,o);heroes.push(h);hero=h;return h}

 function init(){
  const cur=document.body.dataset.dir;
  $$('[data-kit=head]').forEach(h=>{h.classList.add('k-head');h.innerHTML=HEAD});
  $$('[data-kit=claims]').forEach(s=>{s.innerHTML=`<p class="k-kick">The stack</p><h2 class="k-h2">Nothing else comes close.</h2><ol class="k-claims">${CLAIMS.map(([h,p],i)=>`<li><span class="k-n">${pad(i+1)}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>`});
  $$('[data-kit=foot]').forEach(f=>{f.classList.add('k-foot');f.innerHTML=`<span>01ai · a 01 company</span><span>Direction ${cur} of 20 · <a href="directions.html">All directions</a></span>`});
  $$('[data-gauge]').forEach(g=>g.insertAdjacentHTML('afterbegin','<svg class="k-g" viewBox="0 0 100 100" aria-hidden="true"><circle class="k-g-off" cx="50" cy="50" r="40"/><circle class="k-g-on" cx="50" cy="50" r="40" stroke-dasharray="251.3" stroke-dashoffset="251.3"/></svg>'));
  $$('[data-bars]').forEach(b=>{b.innerHTML='<i></i>'.repeat(+b.dataset.n||24)});
  $$('[data-ticker]').forEach(t=>{const kind=t.dataset.ticker;const items=kind==='names'?Array.from({length:40},(_,i)=>'Company '+pad(i+1)):Array.from({length:14},()=>line('short'));const row=items.map(n=>`<span class="k-ti">${n}</span>`).join('');t.innerHTML=`<div class="k-track">${row}<span aria-hidden="true" style="display:contents">${row}</span></div>`});
  $$('[data-split]').forEach(split);$$('[data-decode]').forEach(e=>decode(e));$$('[data-count]').forEach(count);
  for(let i=0;i<9;i++)logs();hex();clock();paint();sparks();addEventListener('resize',sparks);
  /* review bar */
  const i=DIRS.findIndex(d=>d.id===cur);if(i>-1){const d=DIRS[i],p=DIRS[(i+19)%20],n=DIRS[(i+1)%20];
   document.body.insertAdjacentHTML('beforeend',`<nav class="k-bar" aria-label="Design directions"><a href="${p.href}" aria-label="Previous direction: ${p.name}">‹</a><a class="k-now" href="directions.html"><b>${d.id}</b><span>/20 · ${d.name}</span></a><a href="${n.href}" aria-label="Next direction: ${n.name}">›</a><button type="button" class="k-pause" aria-pressed="false">Pause</button></nav>`);
   const b=document.querySelector('.k-pause');if(reduce)b.hidden=true;else b.onclick=()=>setPaused(!paused)}
  document.addEventListener('visibilitychange',()=>{if(paused)return;document.hidden?stopT():run()});
  run()}
 return {DIRS,S,hist,on,init,city,flat,decode,split,reduce,get hero(){return hero},fmt:FMT,norm:NORM,line};
})();
