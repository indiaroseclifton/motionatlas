'use strict';
/* Landing effects: the technique library.
   Each entry is one reusable technique as a complete page (HTML + CSS + JS). The lab in effects-lab.js runs that
   page full screen and exports the very same strings, so the copied code is exactly what the preview runs.
   Controls feed CSS variables into every page: --fx-intensity, --fx-duration and --fx-ease; "Reduced motion"
   adds .reduce to <html> (the page also adds it itself when the visitor asks for reduced motion).
   Fields: what / when / perf / a11y / support are the guide; api is the key platform feature, shown on the card.
   Pictures are photographs from assets/photos/; moving backdrops are drawn in code by flowField (below), so
   nothing here depends on video. A technique with `pages` instead of html/css/js is a set of real documents. */
window.FX_TECHNIQUES=(()=>{
 const PH='assets/photos/';   /* photographs: name.webp is 1400px wide, name-640.webp is the small copy for tiles */
 const END=(t,k)=>`<section class="end"><p class="kicker">${k||'End of the demo'}</p><h2>${t}</h2></section>`;
 /* Shared by every technique that draws its backdrop in code. It is pasted into that technique's own script,
    so the exported page carries it and needs nothing from the lab. */
 const FLOW=`/* flowField(canvas, options): a calm, flowing colour field drawn live by a small WebGL fragment shader
   (two layers of soft fractal noise, the second warped by the first). It stays sharp at any size: the canvas is
   sized to its box with the pixel ratio capped at 2. It draws only while on screen, holds one still frame
   under reduced motion, and shows a CSS gradient when WebGL is unavailable.
   options  colors: four hex colours            to: a second palette to blend towards
            zoom, warp, speed: about 1          sun: 0 to 1, a soft light that crosses the frame
            clock: () => seconds, to drive time yourself, for example from the scroll position
            progress: () => 0 to 1, blends colors into to and moves the sun
            autoplay: on by default unless reduced motion is set      onstate(api): it started or stopped
   returns  { ok, playing, running, play(), pause(), draw() } */
function flowField(canvas,o){
 o=o||{};
 const A=o.colors||['#fafafa','#d9d4ff','#c4e4ff','#ffd9e2'],B=o.to||A;
 const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
 const reduce=document.documentElement.classList.contains('reduce')||matchMedia('(prefers-reduced-motion: reduce)').matches;
 canvas.style.background='linear-gradient(135deg,'+A[1]+','+A[0]+' 50%,'+A[2]+')';   /* first paint, and the fallback without WebGL */
 let gl=null;try{gl=canvas.getContext('webgl',{antialias:false,powerPreference:'low-power'});}catch(e){}
 let playing=o.autoplay===undefined?!reduce:!!o.autoplay,visible=false,raf=0,t=o.still||9,last=0,shown=NaN,U=null;
 const api={ok:false,get playing(){return playing;},get running(){return !!raf;},play(){playing=true;sync();},pause(){playing=false;sync();},draw};
 const FRAG='uniform vec2 r;uniform float t,p,z,k,s;uniform vec3 c0,c1,c2,c3;'+
  'float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}'+
  'float n(vec2 q){vec2 i=floor(q),f=fract(q),u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}'+
  'float fbm(vec2 q){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*n(q);q=q*2.03+vec2(1.7,9.2);a*=.45;}return v/.82;}'+
  'void main(){float m=min(r.x,r.y);vec2 q=(gl_FragCoord.xy-.5*r)/m,w=q*1.15*z;'+
  'float a=fbm(w+vec2(t*.05,-t*.03)),b=fbm(w*1.1+a*1.7*k+vec2(-t*.04,t*.06));'+                 /* the second field is warped by the first */
  'vec3 col=mix(c0,c1,smoothstep(.25,.75,b));col=mix(col,c2,smoothstep(.4,.85,a)*.9);col=mix(col,c3,smoothstep(.5,.95,a*b*2.4));'+
  'vec2 d=q-vec2(mix(-.4,.4,p)*r.x/m,.1+.26*sin(p*3.1416));col=mix(col,vec3(1.,.99,.94),s*.92*exp(-dot(d,d)*4.5));'+   /* the sun */
  'col+=(h(gl_FragCoord.xy)-.5)/160.;gl_FragColor=vec4(col,1.);}';                              /* a little dither stops banding */
 function init(){
  const sh=(type,src)=>{const x=gl.createShader(type);gl.shaderSource(x,src);gl.compileShader(x);return gl.getShaderParameter(x,gl.COMPILE_STATUS)?x:null;};
  const vs=sh(gl.VERTEX_SHADER,'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}');
  const fs=sh(gl.FRAGMENT_SHADER,'precision highp float;'+FRAG)||sh(gl.FRAGMENT_SHADER,'precision mediump float;'+FRAG);
  if(!vs||!fs)return false;
  const pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.bindAttribLocation(pr,0,'a');gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return false;
  gl.useProgram(pr);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);   /* one triangle that covers the canvas */
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  U={};['r','t','p','z','k','s','c0','c1','c2','c3'].forEach(name=>U[name]=gl.getUniformLocation(pr,name));
  return true;
 }
 function draw(){
  if(!U||gl.isContextLost())return;
  const dpr=Math.min(2,window.devicePixelRatio||1),w=Math.max(1,Math.round(canvas.clientWidth*dpr)),h=Math.max(1,Math.round(canvas.clientHeight*dpr));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
  const p=o.progress?Math.min(1,Math.max(0,o.progress())):0;
  gl.uniform2f(U.r,w,h);gl.uniform1f(U.t,o.clock?o.clock():t);gl.uniform1f(U.p,p);
  gl.uniform1f(U.z,o.zoom||1);gl.uniform1f(U.k,o.warp===undefined?1:o.warp);gl.uniform1f(U.s,o.sun||0);
  for(let i=0;i<4;i++){const a=rgb(A[i]),b=rgb(B[i]);gl.uniform3f(U['c'+i],a[0]+(b[0]-a[0])*p,a[1]+(b[1]-a[1])*p,a[2]+(b[2]-a[2])*p);}
  gl.drawArrays(gl.TRIANGLES,0,3);
 }
 function frame(now){raf=0;if(!playing||!visible)return;
  if(o.clock){const c=o.clock();if(c!==shown){shown=c;draw();}}                 /* your clock: redraw only when it has moved */
  else{t+=Math.min(.05,(now-last)/1000)*(o.speed||1);draw();}
  last=now;raf=requestAnimationFrame(frame);}
 function sync(){
  const run=playing&&visible&&!!U;
  if(run&&!raf){last=performance.now();raf=requestAnimationFrame(frame);}
  else if(!run){cancelAnimationFrame(raf);raf=0;draw();}                     /* stopped: leave one still frame */
  if(o.onstate)o.onstate(api);
 }
 if(!gl||!init()){if(o.onstate)o.onstate(api);return api;}
 api.ok=true;draw();
 new IntersectionObserver(es=>{visible=es[es.length-1].intersectionRatio>=.01;sync();},{threshold:[0,.01]}).observe(canvas);   /* no drawing while off screen */
 new ResizeObserver(()=>{shown=NaN;if(!raf)draw();}).observe(canvas);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;U=null;});
 canvas.addEventListener('webglcontextrestored',()=>{if(init())sync();});
 return api;
}`;
 const T=[

 /* ---------------- Scroll ---------------- */
 {id:'L19',name:'Scroll-driven animations',api:'animation-timeline: view()',tags:['Scroll','CSS-first','Reveal'],cost:'Very low',animates:'opacity, transform, clip-path',
  what:'Elements animate against their own position in the viewport, declared entirely in CSS with animation-timeline: view() and animation-range. No scroll listeners, no IntersectionObserver.',
  when:'Any reveal that should track the scroll rather than fire once: images settling in, captions fading up, sections handing over to the next.',
  perf:'Runs on the compositor when it animates transform, opacity or clip-path, so it stays smooth even while the main thread is busy. The fallback uses one IntersectionObserver.',
  a11y:'Under reduced motion the animations are removed and every element sits in its final, readable state, because the base styles are the end state.',
  support:'Chrome and Edge 115+, Safari 26+. Firefox and older browsers get the IntersectionObserver fallback; the badge in the demo says which one is running.',
  html:`<div class="prog" aria-hidden="true"></div><section class="sd-hero"><p class="kicker" id="mode">Checking support…</p><h1 class="display">Motion from<br>the scroll itself.</h1><p class="lede">Scroll down. Every picture below is animated by its own position in the viewport.</p></section>
<section class="sd-list">${[['nature-colorful-landscape-with-a-snow','Summit','Snow on the peak, red scrub on the plain below.','A snow-covered mountain above pine forest and a red meadow'],['nature-mountain-lake-in-the-summer','Reservoir','Turquoise water threading a dry valley.','A turquoise reservoir winding through a dry mountain valley'],['nature-flachau-mountain-valley','Valley','Blue ridges, seen from between the pines.','Snowy blue mountain ridges framed by dark pine trees'],['nature-lush-mountain-landscape','Canyon','A track winding under red cliffs.','A green canyon floor with a winding track beneath tall red cliffs']].map(([n,t,d,a],i)=>`<figure class="rv${i%2?' alt':''}"><img src="${PH}${n}.webp" alt="${a}"><figcaption><span class="kicker">0${i+1}</span><b>${t}</b><span>${d}</span></figcaption></figure>`).join('')}</section>${END('Declared in CSS.')}`,
  css:`.prog{position:fixed;top:0;left:0;right:0;height:3px;background:#111113;transform-origin:left;transform:scaleX(0);z-index:5}
.sd-hero{min-height:72vh;display:grid;align-content:center;gap:20px;padding:6vh 7vw 0}
.sd-list{display:grid;gap:20vh;padding:0 0 26vh}
.rv{margin:0;display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:5vw;align-items:end;padding:0 7vw}
.rv.alt{grid-template-columns:minmax(0,1fr) minmax(0,1.6fr)}.rv.alt img{order:2}
.rv img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:16px}
.rv figcaption{display:grid;gap:10px}.rv b{font:600 clamp(26px,3vw,44px)/1.05 "Inter",system-ui,sans-serif;letter-spacing:-.03em}.rv figcaption span:last-child{color:#4b4f57;max-width:30ch}
@keyframes rise{from{opacity:0;transform:translateY(calc(120px*var(--fx-intensity))) scale(.9);clip-path:inset(18% 8% 18% 8% round 16px)}to{opacity:1;transform:none;clip-path:inset(0 round 16px)}}
@keyframes cap{from{opacity:0;transform:translateY(40px)}}
@keyframes grow{to{transform:scaleX(1)}}
@supports (animation-timeline:view()){
 .rv img{animation:rise linear both;animation-timeline:view();animation-range:entry 0% cover 40%}
 .rv figcaption{animation:cap linear both;animation-timeline:view();animation-range:entry 30% cover 45%}
 .prog{animation:grow linear both;animation-timeline:scroll(root)}}
.io .rv img,.io .rv figcaption{opacity:0;transform:translateY(60px);transition:opacity var(--fx-duration) var(--fx-ease),transform var(--fx-duration) var(--fx-ease)}
.io .rv.in img,.io .rv.in figcaption{opacity:1;transform:none}
@media(max-width:720px){.rv,.rv.alt{grid-template-columns:1fr}.rv.alt img{order:0}}`,
  js:`const ok=CSS.supports('animation-timeline: view()');
document.getElementById('mode').textContent=ok?'Running on CSS scroll timelines':'Fallback: IntersectionObserver';
if(!ok&&!FX.R){document.body.classList.add('io');
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.25});
 document.querySelectorAll('.rv').forEach(r=>io.observe(r));
 const pr=document.querySelector('.prog');addEventListener('scroll',()=>{pr.style.transform='scaleX('+scrollY/(document.documentElement.scrollHeight-innerHeight)+')';},{passive:true});}`},

 {id:'L07',name:'Scroll progress',api:'animation-timeline: scroll() · @property',tags:['Scroll','CSS-first'],cost:'Very low',animates:'transform, stroke-dashoffset, a registered --p',
  what:'A reading bar, a progress ring and a live percentage, all driven by the page scroll in CSS. The percentage is a registered custom property (@property) animated on a scroll timeline and printed with a CSS counter.',
  when:'Long reads, documentation and case studies, where people want to know how far they are and how much is left.',
  perf:'The bar and ring animate on the compositor. The counter repaints one small element. Chapter highlighting uses a single IntersectionObserver.',
  a11y:'The indicators are decorative (aria-hidden); the chapter list is a real nav of links, and the current one gets aria-current. Under reduced motion the indicators simply jump with the scroll.',
  support:'Scroll timelines: Chrome and Edge 115+, Safari 26+. Elsewhere a small scroll handler sets the same values.',
  html:`<div class="bar" aria-hidden="true"></div><div class="ring" aria-hidden="true"><svg viewBox="0 0 40 40"><circle class="trk" cx="20" cy="20" r="17"/><circle class="val" cx="20" cy="20" r="17" pathLength="1"/></svg><span class="pct"></span></div>
<nav class="toc" aria-label="Chapters">${['Brief','Direction','Assets','Review'].map((t,i)=>`<a href="#c${i}">${t}</a>`).join('')}</nav>
${[['Brief','workspace-laptop-and-books','Start with the question the page has to answer, in one sentence.','A laptop on a pale wooden desk, with a stack of books and a green chair','60% 50%'],['Direction','workspace-desktop-after-work','Choose the few decisions that everything else follows from.','A laptop and mouse on a dark wooden desk beside a white chair','62% 50%'],['Assets','workspace-laptop-on-a-desk','Gather the pieces: images, words, data, motion.','A laptop, notebooks, a phone and a lamp on a pale desk, seen from above','50% 50%'],['Review','tech-statistics-on-a-laptop','Read it as a stranger would, from the top, at speed.','A laptop showing charts and figures on a glass table','30% 50%']].map(([t,n,d,a,pos],i)=>`<section class="ch" id="c${i}"><div><p class="kicker">Chapter 0${i+1} of 04</p><h2>${t}.</h2><p class="lede">${d}</p></div><img src="${PH}${n}.webp" alt="${a}" style="object-position:${pos}"></section>`).join('')}`,
  css:`@property --p{syntax:"<integer>";inherits:true;initial-value:0}
.bar{position:fixed;top:0;left:0;right:0;height:3px;z-index:5;background:#111113;transform-origin:left;transform:scaleX(0)}
.ring{position:fixed;right:24px;bottom:24px;width:72px;height:72px;z-index:5;display:grid;place-items:center;border-radius:50%;background:rgba(255,255,255,.85);border:1px solid #e4e4e7;backdrop-filter:blur(10px)}
.ring svg{position:absolute;inset:6px;transform:rotate(-90deg)}
.ring circle{fill:none;stroke-width:3}.trk{stroke:rgba(17,17,19,.15)}.val{stroke:#111113;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1}
.pct{font:500 13px "Inter",system-ui,sans-serif;font-variant-numeric:tabular-nums;counter-reset:p var(--p)}.pct::after{content:counter(p) "%"}
.toc{position:fixed;left:24px;top:50%;transform:translateY(-50%);display:grid;gap:4px;z-index:5}
.toc a{color:#6b6f76;text-decoration:none;font:500 13px "Inter",system-ui,sans-serif;padding:6px 0 6px 16px;border-left:2px solid rgba(17,17,19,.12);transition:color .3s,border-color .3s}
.toc a[aria-current=true]{color:#111113;border-color:#111113}
.ch{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:5vw;padding:0 6vw 0 16vw}
.ch:nth-of-type(even){background:#f4f4f5}
.ch h2{font-size:clamp(36px,5vw,72px);margin:14px 0 18px}
.ch img{width:100%;aspect-ratio:4/5;max-height:76vh;object-fit:cover;border-radius:16px;box-shadow:0 0 0 1px rgba(17,17,19,.06)}
@keyframes grow{to{transform:scaleX(1)}}@keyframes ring{to{stroke-dashoffset:0}}@keyframes pct{to{--p:100}}
@supports (animation-timeline:scroll()){
 .bar{animation:grow linear both;animation-timeline:scroll(root)}
 .val{animation:ring linear both;animation-timeline:scroll(root)}
 .ring{animation:pct linear both;animation-timeline:scroll(root)}}
@media(max-width:720px){.ch{grid-template-columns:1fr;padding:12vh 6vw}.toc{display:none}.ch img{max-height:44vh}}`,
  js:`if(!CSS.supports('animation-timeline: scroll()')){const bar=document.querySelector('.bar'),val=document.querySelector('.val'),ring=document.querySelector('.ring');
 const draw=()=>{const p=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);bar.style.transform='scaleX('+p+')';val.style.strokeDashoffset=1-p;ring.style.setProperty('--p',Math.round(p*100));};
 addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});draw();}
const links=[...document.querySelectorAll('.toc a')];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+e.target.id)));}),{threshold:.5});
document.querySelectorAll('.ch').forEach(s=>io.observe(s));
links.forEach(a=>a.onclick=e=>{e.preventDefault();document.querySelector(a.hash).scrollIntoView({behavior:FX.R?'auto':'smooth'});});`},

 {id:'L01',name:'Parallax depth',api:'view-timeline · translate3d',tags:['Scroll','CSS-first'],cost:'Low',animates:'transform',
  what:'Background, headline and foreground travel at different speeds as the hero scrolls away, so a flat page reads as depth. The speeds come from a CSS view timeline on the hero, one custom property per layer.',
  when:'One hero or chapter opener with a strong image. Keep it to one parallax moment per page.',
  perf:'Transforms only. With animation-timeline it runs on the compositor; the fallback reads scrollY once per frame and writes one transform per layer.',
  a11y:'Large speed differences can cause vestibular discomfort, so depth is capped by intensity and removed under reduced motion: the layers sit still and the page reads normally.',
  support:'Scroll timelines: Chrome and Edge 115+, Safari 26+. Firefox uses the requestAnimationFrame fallback.',
  html:`<section class="px"><img class="layer bg" src="${PH}nature-green-mountain-landscape.webp" alt="Sunrise over a green mountain valley, with granite boulders in the foreground"><div class="layer shade"></div><div class="layer title"><p class="kicker">Scroll · three layers, three speeds</p><h1 class="display">Find your<br>quiet wild.</h1></div><div class="layer cards">${[['nature-alpine-landscape','Snowy peaks behind a dark ridge under a clear sky'],['nature-mountain-lake','Mountains and autumn forest reflected in a still lake'],['nature-mountain-lake-in-the-summer','A turquoise reservoir in a dry mountain valley']].map(([n,a])=>`<img src="${PH}${n}.webp" alt="${a}">`).join('')}</div></section>${END('Depth without a 3D engine.')}`,
  css:`.px{position:relative;height:100vh;overflow:hidden;background:#0d0f12;view-timeline:--hero}
.layer{position:absolute;will-change:transform}
.bg{left:0;top:-15%;width:100%;height:130%;object-fit:cover;--depth:.55}
.shade{inset:-20% 0 0;background:linear-gradient(180deg,rgba(13,15,18,.55),rgba(13,15,18,0) 50%,rgba(13,15,18,.4));--depth:.55}
.title{left:7vw;top:16vh;display:grid;gap:18px;color:#fff;--depth:.28}.title .kicker{color:rgba(255,255,255,.8)}
.cards{right:6vw;bottom:-10vh;display:flex;gap:1.6vw;align-items:flex-start;--depth:-.5}
.cards img{width:min(17vw,250px);aspect-ratio:3/4;object-fit:cover;border-radius:14px;box-shadow:0 0 0 1px rgba(255,255,255,.3),0 24px 40px -28px rgba(0,0,0,.6)}
.cards img:nth-child(2){margin-top:-10vh}
@keyframes depth{to{transform:translate3d(0,calc(var(--depth)*70vh*var(--fx-intensity)),0)}}
@supports (animation-timeline:view()){.layer{animation:depth linear both;animation-timeline:--hero;animation-range:exit 0% exit 100%}}
@media(max-width:720px){.cards{left:6vw;right:auto}.cards img{width:27vw}}`,
  js:`if(!CSS.supports('animation-timeline: view()')&&!FX.R){
 const L=[...document.querySelectorAll('.layer')].map(el=>[el,parseFloat(getComputedStyle(el).getPropertyValue('--depth'))||0]);
 const draw=()=>{const y=Math.min(scrollY,innerHeight);for(const [el,d] of L)el.style.transform='translate3d(0,'+(y*d*.7*FX.i)+'px,0)';};
 addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});draw();}`},

 {id:'L02',name:'Sticky scrollytelling',api:'position: sticky · IntersectionObserver',tags:['Scroll','Media'],cost:'Low',animates:'opacity, transform',
  what:'A full-bleed picture stays pinned while chapters of text scroll over it; each chapter swaps the picture with a short crossfade. Sticky positioning does the pinning, one observer picks the chapter.',
  when:'Product tours, case studies and editorial stories where each step needs its own image.',
  perf:'Only opacity and transform change, once per chapter. Images are in the HTML so they load in order; lazy-load the later ones on long pages.',
  a11y:'The text is ordinary HTML in reading order. Under reduced motion the swap is instant. Keep text contrast high where it overlaps the image (the gradient here is part of the technique).',
  support:'position: sticky and IntersectionObserver work in every current browser.',
  html:`<section class="story"><div class="stage" aria-hidden="true">${['cafe-coffee-in-montreal','cafe-cafe-with-light-bulbs-hanging','drink-blue-coffee-cup','cafe-crew-montr-al-canada'].map((n,i)=>`<img src="${PH}${n}.webp" alt=""${i?'':' class="on"'}>`).join('')}</div><div class="steps">${[['Start with a place.','A long table by the window sets the tone: warm, quiet, unhurried.'],['Change the light.','The second picture drops the colour and looks up.'],['Bring in the subject.','One cup gives the eye somewhere to rest.'],['Then open the view.','End wide, on the whole room at work.']].map(([t,d],i)=>`<article class="step${i?'':' on'}"><p class="kicker">Chapter 0${i+1}</p><h2>${t}</h2><p class="lede">${d}</p></article>`).join('')}</div></section>${END('One picture per chapter.')}`,
  css:`.story{position:relative;background:#0d0f12;color:#fff}
.stage{position:sticky;top:0;height:100vh;overflow:hidden}
.stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(calc(1 + .08*var(--fx-intensity)));transition:opacity var(--fx-duration) var(--fx-ease),transform calc(var(--fx-duration)*2.2) var(--fx-ease)}
.stage img.on{opacity:1;transform:none}
.stage::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(13,15,18,.8),rgba(13,15,18,.2) 72%)}
.steps{position:relative;margin-top:-100vh}
.step{min-height:100vh;display:grid;align-content:center;gap:18px;padding:0 7vw;max-width:760px;opacity:.25;transition:opacity calc(var(--fx-duration)*.6) ease}
.step.on{opacity:1}.step h2{font-size:clamp(36px,5vw,72px)}.step .kicker{color:rgba(255,255,255,.75)}.step .lede{color:rgba(255,255,255,.88)}`,
  js:`const imgs=[...document.querySelectorAll('.stage img')],steps=[...document.querySelectorAll('.step')];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const i=steps.indexOf(e.target);imgs.forEach((im,k)=>im.classList.toggle('on',k===i));steps.forEach((s,k)=>s.classList.toggle('on',k===i));}),{threshold:.55});
steps.forEach(s=>io.observe(s));`},

 {id:'L03',name:'Pinned horizontal scroll',api:'view-timeline · animation-range: contain',tags:['Scroll','CSS-first','Media'],cost:'Low',animates:'transform',
  what:'Vertical scrolling moves a strip of images sideways while the section stays pinned. The strip translates by its own overflow, calc(-100% + 100vw), on a view timeline, so it needs no measuring in JavaScript.',
  when:'A gallery, a timeline or a set of steps that reads better side by side. Use one per page and keep the section height proportional to the strip.',
  perf:'One transform on one element. The fallback measures progress once per frame.',
  a11y:'Under reduced motion the pin is released and the strip becomes a normal horizontal scroller you can swipe or tab through. Captions are real text.',
  support:'Chrome and Edge 115+, Safari 26+ run it in CSS; other browsers use the small scroll handler.',
  html:`<section class="hz"><div class="pin"><p class="kicker head">The morning bake · scroll down to travel sideways</p><div class="track">${[['bakery-fresh-bread-and-butter','White loaf','A white loaf on paper beside a dish of butter'],['bakery-fresh-rustic-bread','Seeded loaf','A dark seeded loaf on a wooden board with a bread knife'],['bakery-loaves-of-bread','On the racks','Rows of loaves on wooden bakery racks'],['bakery-mink-mingle-2017','Pastries','Trays of croissants and pain au chocolat'],['bakery-the-bakery','The counter','Pastries in a glass bakery display case'],['food-bread-on-the-table','Table basket','A bread roll in a wire basket on a red cloth'],['food-alisa-anton-2016-03-12','Croissants','Croissants on a dark slate plate beside a coffee']].map(([n,t,a],i)=>`<figure><img src="${PH}${n}.webp" alt="${a}"><figcaption><span>0${i+1}</span>${t}</figcaption></figure>`).join('')}</div><div class="bar" aria-hidden="true"><i></i></div></div></section>${END('Back to vertical.')}`,
  css:`.hz{height:420vh;view-timeline:--hz;background:#fafafa}
.pin{position:sticky;top:0;height:100vh;overflow:hidden;display:grid;grid-template-rows:auto 1fr auto;gap:3vh;padding:6vh 0}
.head{padding:0 6vw}
.track{display:flex;gap:3vw;padding:0 6vw;align-items:center;width:max-content;will-change:transform}
.track figure{margin:0;height:66vh;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:16px}
.track img{height:100%;width:auto;aspect-ratio:4/5;object-fit:cover;border-radius:16px}
.track figcaption{display:flex;gap:14px;align-items:baseline;font:600 clamp(20px,2vw,28px)/1.05 "Inter",system-ui,sans-serif;letter-spacing:-.03em}
.track figcaption span{font:500 13px "Inter",system-ui,sans-serif;letter-spacing:0;color:#6b6f76}
.bar{margin:0 6vw;height:2px;background:rgba(17,17,19,.15)}.bar i{display:block;height:100%;background:#111113;transform-origin:left;transform:scaleX(0)}
@keyframes slide{to{transform:translateX(calc(-100% + 100vw))}}@keyframes fill{to{transform:scaleX(1)}}
@supports (animation-timeline:view()){.track{animation:slide linear both;animation-timeline:--hz;animation-range:contain}.bar i{animation:fill linear both;animation-timeline:--hz;animation-range:contain}}
html.reduce .hz{height:auto}html.reduce .pin{position:static;overflow-x:auto}html.reduce .track{transform:none!important}`,
  js:`if(!CSS.supports('animation-timeline: view()')&&!FX.R){const sec=document.querySelector('.hz'),track=document.querySelector('.track'),bar=document.querySelector('.bar i');
 const draw=()=>{const p=FX.progress(sec);track.style.transform='translate3d('+(-p*(track.scrollWidth-innerWidth))+'px,0,0)';bar.style.transform='scaleX('+p+')';};
 addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});addEventListener('resize',draw);draw();}`},

 {id:'L21',name:'Sticky stacking cards',api:'position: sticky · scroll-linked scale',tags:['Scroll'],cost:'Low',animates:'transform, filter',
  what:'Each card is position: sticky with a top offset that grows by index, so cards pile up like a deck; as the next card arrives, the one beneath scales back and dims.',
  when:'Services, process steps or features that should feel sequential and physical.',
  perf:'Sticky does the pinning for free. The scale and dim are one transform and one filter per card, updated in a single requestAnimationFrame.',
  a11y:'Content stays in reading order and fully legible. Under reduced motion the cards still stack (that is layout) but nothing scales or dims.',
  support:'Everywhere: position: sticky and requestAnimationFrame.',
  html:`<section class="st-head"><p class="kicker">Process · four steps</p><h1 class="display">One deck,<br>four steps.</h1></section><section class="stack">${[['Centre','#ffffff','hands-making-pottery','Press the clay to the middle of the wheel until it runs true.','Hands pressing into clay at the centre of a spinning wheel, seen from above'],['Open','#f7f7f8','hands-black-and-white-pottery','Thumbs find the middle and the walls begin.','Two hands cupped around a mound of clay on a wheel, in black and white'],['Raise','#f1f1f3','hands-pottery-wheel','Lift the wall a little on every turn.','Clay-covered hands raising the wall of a bowl on a wheel, in black and white'],['Shape','#eaeaec','hands-mud-games','Close the form, then let the wheel slow.','Hands shaping the neck of a small clay pot on a wheel']].map(([t,c,n,d,a],i)=>`<article class="sc" style="--i:${i};--c:${c}"><div><p class="kicker">Step 0${i+1}</p><h2>${t}</h2><p class="lede">${d}</p></div><img src="${PH}${n}.webp" alt="${a}"></article>`).join('')}</section>${END('Dealt.')}`,
  css:`.st-head{min-height:70vh;display:grid;align-content:end;gap:20px;padding:0 6vw 8vh}
.stack{display:grid;gap:8vh;padding:0 4vw 24vh}
.sc{position:sticky;top:calc(6vh + var(--i)*24px);height:82vh;border-radius:24px;display:grid;grid-template-columns:1fr 1.1fr;gap:4vw;align-items:center;padding:4vw;background:var(--c);color:#111113;border:1px solid #e4e4e7;transform-origin:50% 0;box-shadow:0 -12px 32px -28px rgba(17,17,19,.3);will-change:transform}
.sc h2{font-size:clamp(36px,5vw,72px);margin:12px 0 18px}
.sc img{width:100%;height:100%;max-height:70vh;object-fit:cover;border-radius:16px}
@media(max-width:720px){.sc{grid-template-columns:1fr}.sc img{max-height:32vh}}`,
  js:`const cards=[...document.querySelectorAll('.sc')];
function draw(){cards.forEach((c,i)=>{const next=cards[i+1];if(!next){c.style.transform='';return;}const r=next.getBoundingClientRect(),top=innerHeight*.06+(i+1)*24;const p=FX.clamp(1-(r.top-top)/(innerHeight*.75),0,1);c.style.transform='scale('+(1-p*.08*FX.i)+')';c.style.filter='brightness('+(1-p*.35*FX.i)+')';});}
if(!FX.R){addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});draw();}`},

 {id:'L40',name:'Scroll-snap story',api:'scroll-snap-type · scrollsnapchange',tags:['Scroll','CSS-first','Media'],cost:'Very low',animates:'opacity, transform (on the snapped slide)',
  what:'Full-screen slides that the browser snaps into place, one per gesture. The scrollsnapchange event says which slide settled, so the dots and the caption entrance follow the browser instead of guessing.',
  when:'Story-like landing pages, product chapters and portfolios where each screen is one idea.',
  perf:'Snapping is native scrolling, so it is as smooth as the platform. Only the settled slide animates its caption.',
  a11y:'Keyboard scrolling (Space, Page Down, arrows) snaps too. Avoid mandatory snapping when slides are taller than the screen; here they are exactly one screen. Under reduced motion captions appear without travel.',
  support:'Scroll snap: everywhere. scrollsnapchange: Chrome and Edge 129+; other browsers fall back to an IntersectionObserver.',
  html:`<nav class="dots" aria-label="Slides">${[0,1,2,3].map(i=>`<a href="#s${i}" aria-label="Slide ${i+1}"></a>`).join('')}</nav>${[['property-apartment-high-rise-building','Arrive','The first screen holds one idea and one picture.','An apartment tower against a blue sky with scattered clouds'],['property-living-room','Settle','Each swipe lands exactly on the next slide.','A bright living room with a blue sofa and a herringbone floor'],['property-coffee-table-corner-in-a-londo','Look around','The caption enters only when the slide has settled.','Two armchairs and a small table beside a window over the city'],['products-afternoon-light','Stay a while','Native scrolling, so it feels like the platform.','Afternoon sun across a sofa, with a vase of tulips on the table']].map(([n,t,d,a],i)=>`<section class="slide" id="s${i}"><img class="cover" src="${PH}${n}.webp" alt="${a}"><div class="cap"><p class="kicker">0${i+1} / 04 · scroll-snap-align: start</p><h2>${t}</h2><p class="lede">${d}</p></div></section>`).join('')}`,
  css:`html{scroll-snap-type:y mandatory}
body{background:#0d0f12}
.slide{position:relative;height:100vh;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden;display:grid;align-items:end;color:#fff}
.slide::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(13,15,18,.8),rgba(13,15,18,0) 62%)}
.cap{position:relative;z-index:1;display:grid;gap:16px;padding:0 7vw 12vh;opacity:0;transform:translateY(calc(50px*var(--fx-intensity)));transition:opacity var(--fx-duration) var(--fx-ease),transform var(--fx-duration) var(--fx-ease)}
.slide.on .cap{opacity:1;transform:none}
.cap h2{font-size:clamp(40px,6vw,88px)}.cap .kicker{color:rgba(255,255,255,.75)}.cap .lede{color:rgba(255,255,255,.88)}
.dots{position:fixed;right:14px;top:50%;transform:translateY(-50%);display:grid;z-index:3}
.dots a{width:28px;height:28px;display:grid;place-items:center}
.dots a::before{content:"";width:9px;height:9px;border-radius:50%;border:1.5px solid #fff;transition:background .3s,transform .3s}
.dots a[aria-current=true]::before{background:#fff;transform:scale(1.25)}
:focus-visible{outline-color:#fff}
html.reduce .cap{transform:none}`,
  js:`const slides=[...document.querySelectorAll('.slide')],dots=[...document.querySelectorAll('.dots a')];
function settle(el){const i=slides.indexOf(el);if(i<0)return;slides.forEach((s,k)=>s.classList.toggle('on',k===i));dots.forEach((d,k)=>d.setAttribute('aria-current',String(k===i)));}
settle(slides[0]);
if('onscrollsnapchange' in window){addEventListener('scrollsnapchange',e=>settle(e.snapTargetBlock));}
else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)settle(e.target);}),{threshold:.6});slides.forEach(s=>io.observe(s));}
dots.forEach(d=>d.onclick=e=>{e.preventDefault();document.querySelector(d.hash).scrollIntoView({behavior:FX.R?'auto':'smooth'});});`},

 {id:'L15',name:'SVG path drawing',api:'stroke-dashoffset · pathLength="1"',tags:['Scroll','CSS-first','Reveal'],cost:'Very low',animates:'stroke-dashoffset',
  what:'A line draws itself in step with the scroll. Setting pathLength="1" on the path means the dash maths is always 0 to 1, whatever the real length, so the whole effect is two lines of CSS on a view timeline.',
  when:'Routes, timelines, signatures and diagrams that should be traced rather than shown all at once.',
  perf:'stroke-dashoffset repaints only the SVG. Keep paths simple; a few hundred points is plenty.',
  a11y:'The drawing is decorative here (aria-hidden). For a meaningful diagram, give the SVG a title and show it complete under reduced motion, which is what this demo does.',
  support:'pathLength and dash offsets: everywhere. Scroll timeline: Chrome and Edge 115+, Safari 26+; others use the scroll fallback.',
  html:`<section class="draw"><div class="pin"><svg viewBox="0 0 1200 700" aria-hidden="true"><path class="ghost" d="M40 600 C 220 120, 380 80, 470 330 S 690 640, 820 360 S 1040 40, 1160 140"/><path class="line" pathLength="1" d="M40 600 C 220 120, 380 80, 470 330 S 690 640, 820 360 S 1040 40, 1160 140"/><circle class="dot" r="12" cx="40" cy="600"/></svg><div class="copy"><p class="kicker">pathLength="1" · stroke-dashoffset 1 → 0</p><h1 class="display">Draw the<br>connection.</h1></div></div></section>${END('Arrived.')}`,
  css:`.draw{height:300vh;view-timeline:--draw;background:#f4f4f5}
.pin{position:sticky;top:0;height:100vh;overflow:hidden}
.pin svg{position:absolute;inset:0;width:100%;height:100%}
.ghost{fill:none;stroke:rgba(17,17,19,.16);stroke-width:3;stroke-dasharray:6 12}
.line{fill:none;stroke:#111113;stroke-width:calc(4px*var(--fx-intensity));stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1}
.dot{fill:#111113}
.copy{position:absolute;right:7vw;bottom:11vh;display:grid;gap:18px;text-align:right}
@keyframes ink{to{stroke-dashoffset:0}}
@supports (animation-timeline:view()){.line{animation:ink linear both;animation-timeline:--draw;animation-range:contain 5% contain 90%}}
html.reduce .line{stroke-dashoffset:0}`,
  js:`const sec=document.querySelector('.draw'),line=document.querySelector('.line'),dot=document.querySelector('.dot'),L=line.getTotalLength(),css=CSS.supports('animation-timeline: view()');
(function frame(){let p;if(FX.R)p=1;else if(css)p=1-parseFloat(getComputedStyle(line).strokeDashoffset);else{p=FX.clamp((FX.progress(sec)-.05)/.85,0,1);line.style.strokeDashoffset=1-p;}
 const pt=line.getPointAtLength(L*FX.clamp(p,0,1));dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y);requestAnimationFrame(frame);})();`},

 {id:'L18',name:'Scroll-aware header',api:'animation-timeline: scroll() · animation-range',tags:['Scroll','CSS-first'],cost:'Very low',animates:'background, padding, transform',
  what:'A generous header compacts as reading starts (in CSS, on the first 160px of a scroll timeline), slides away while you scroll down, and comes back the moment you scroll up.',
  when:'Any page with a fixed header: it gives the work the space and keeps navigation one flick away.',
  perf:'The compacting is a scroll-linked CSS animation; hiding is one class toggled on direction change, animated with transform.',
  a11y:'Focusing anything in the header always brings it back (:focus-within), so keyboard users never lose it. Under reduced motion it compacts but never slides.',
  support:'The compacting needs scroll timelines (Chrome and Edge 115+, Safari 26+); elsewhere a class toggles at 40px. Hide-on-scroll works everywhere.',
  html:`<header class="hd"><b class="logo">Field Studio</b><nav><a href="#">Work</a><a href="#">Journal</a><a href="#">Contact</a></nav></header><section class="hero"><img class="cover" src="${PH}workspace-laptop-on-desk-book-stacks.webp" alt="A desk lamp, a laptop and stacked books on a white desk"><div class="copy"><p class="kicker">Scroll down, then up a little</p><h1 class="display">More room<br>for the work.</h1></div></section><section class="text">${['The header steps back once reading starts.','Scroll down and it leaves the way; scroll up and it returns at once.','Tab into it and it always comes back, so nothing is hidden from a keyboard.'].map(t=>`<p>${t}</p>`).join('')}</section>${END('Out of the way, never lost.')}`,
  css:`.hd{position:fixed;top:0;left:0;right:0;z-index:5;display:flex;justify-content:space-between;align-items:center;padding:28px 6vw;color:#111113;transition:transform calc(var(--fx-duration)*.5) var(--fx-ease)}
.logo{font:600 20px "Inter",system-ui,sans-serif;letter-spacing:-.02em;transform-origin:left center}
.hd nav{display:flex;gap:28px}.hd a{color:inherit;text-decoration:none;font:500 15px "Inter",system-ui,sans-serif;padding:12px 0}
.hd.away:not(:focus-within){transform:translateY(-110%)}
@keyframes compact{to{padding-top:8px;padding-bottom:8px;background:rgba(250,250,250,.86);box-shadow:0 1px 0 rgba(17,17,19,.08);backdrop-filter:blur(14px)}}
@keyframes logo{to{transform:scale(.85)}}
@supports (animation-timeline:scroll()){.hd{animation:compact linear both;animation-timeline:scroll(root);animation-range:0 160px}.logo{animation:logo linear both;animation-timeline:scroll(root);animation-range:0 160px}}
.hd.small{padding-top:8px;padding-bottom:8px;background:rgba(250,250,250,.86);box-shadow:0 1px 0 rgba(17,17,19,.08);backdrop-filter:blur(14px)}.hd.small .logo{transform:scale(.85)}
.hero{position:relative;height:100vh;display:grid;align-items:start;overflow:hidden;background:#fff}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,#fafafa,rgba(250,250,250,0) 16%)}
.hero .copy{position:relative;z-index:1;display:grid;gap:18px;padding:19vh 6vw 0}.hero .copy .kicker{color:#4b4f57}
.text{padding:18vh 6vw;display:grid;gap:10vh}.text p{font:500 clamp(24px,3vw,44px)/1.15 "Inter",system-ui,sans-serif;letter-spacing:-.03em;max-width:20ch}
html.reduce .hd{transform:none!important}`,
  js:`const hd=document.querySelector('.hd'),css=CSS.supports('animation-timeline: scroll()');let last=scrollY;
addEventListener('scroll',()=>{const y=scrollY;if(!css)hd.classList.toggle('small',y>40);if(!FX.R)hd.classList.toggle('away',y>last&&y>200);last=y;},{passive:true});`},

 {id:'L23',name:'Image sequence scrub',api:'canvas drawImage · scroll progress',tags:['Scroll','Media','Canvas'],cost:'Medium',animates:'canvas pixels',
  what:'Scrolling steps through a sequence of stills drawn to a canvas, the way product pages turn a phone in your hand. Here the sequence is seven photographs of one day, so each still dissolves into the next; with 40 to 120 rendered frames of one object you would cut straight from frame to frame. Stills load progressively and the nearest loaded one is shown meanwhile.',
  when:'Hero moments where the object itself should turn, assemble or transform under the visitor\'s control.',
  perf:'One or two drawImage calls per changed frame. Keep frames small (WebP, about 1400px) and few; prefer a code-drawn or video scrub (L32) when the sequence is long.',
  a11y:'The canvas has role="img" and a label describing the sequence. Under reduced motion the slow push-in is removed and the stills follow the scroll exactly, so nothing moves unless the visitor moves it.',
  support:'Canvas and image decoding work everywhere.',
  html:`<section class="fs"><div class="pin"><canvas role="img" aria-label="Seven photographs of one day, from a morning coffee to the city at night, stepped through by scrolling"></canvas><div class="copy"><p class="kicker" id="fc">Still 01 / 07</p><h1 class="display">Scroll the<br>day.</h1></div></div></section>${END('One day, at your pace.')}`,
  css:`.fs{height:500vh;background:#0d0f12}
.pin{position:sticky;top:0;height:100vh;overflow:hidden}
canvas{position:absolute;inset:0;width:100%;height:100%}
.pin::after{content:"";position:absolute;inset:0;background:linear-gradient(15deg,rgba(13,15,18,.75),rgba(13,15,18,0) 55%);pointer-events:none}
.copy{position:absolute;z-index:1;left:6vw;bottom:10vh;display:grid;gap:14px;color:#fff}.copy .kicker{color:rgba(255,255,255,.8);font-variant-numeric:tabular-nums}`,
  js:`const PHOTOS='${PH}',NAMES=['drink-coffee-day','workspace-laptop-on-a-desk','food-gluten-free-gnocchi','products-afternoon-light','city-flatiron-at-night','city-new-york-city-center-street-at','city-city-night-lights'];
const c=document.querySelector('canvas'),x=c.getContext('2d'),sec=document.querySelector('.fs'),fc=document.getElementById('fc'),N=NAMES.length;let shown=-1;
const stills=NAMES.map(n=>{const im=new Image();im.decoding='async';im.src=PHOTOS+n+'.webp';im.onload=()=>paint(true);return im;});
const ready=im=>im.complete&&im.naturalWidth>0;
/* object-fit: cover by hand, with a slow push-in so neighbouring stills read as one take */
function cover(im,alpha,zoom){const s=Math.max(c.width/im.naturalWidth,c.height/im.naturalHeight)*zoom,w=im.naturalWidth*s,h=im.naturalHeight*s;x.globalAlpha=alpha;x.drawImage(im,(c.width-w)/2,(c.height-h)/2,w,h);}
function paint(force){const p=FX.progress(sec)*(N-1);if(!force&&Math.abs(p-shown)<.0005)return;shown=p;
 const i=Math.min(N-2,Math.floor(p)),f=p-i,m=FX.clamp((f-.36)/.28,0,1),zoom=k=>FX.R?1:1+.04*FX.i*FX.clamp(p-k+1,0,2);
 let k=i;while(k>0&&!ready(stills[k]))k--;                                   /* the nearest loaded still, while the rest arrive */
 if(ready(stills[k]))cover(stills[k],1,zoom(k));
 if(m>0&&ready(stills[i+1]))cover(stills[i+1],m*m*(3-2*m),zoom(i+1));        /* each still holds, then dissolves into the next */
 x.globalAlpha=1;fc.textContent='Still '+String(Math.round(p)+1).padStart(2,'0')+' / '+String(N).padStart(2,'0');}
function size(){const d=Math.min(2,devicePixelRatio||1);c.width=Math.round(c.clientWidth*d);c.height=Math.round(c.clientHeight*d);paint(true);}
addEventListener('resize',size);addEventListener('scroll',()=>requestAnimationFrame(()=>paint()),{passive:true});size();`},

 {id:'L32',name:'Scroll-scrubbed animation',api:'scroll progress → shader clock (or video.currentTime)',tags:['Scroll','WebGL'],cost:'Medium',animates:'GPU fragment shader, clocked by the scroll',
  what:'The page scroll is the clock of a code-drawn animation: scroll down and the light crosses the frame, scroll up and it runs backwards. Captions arrive at set points. Every frame is computed from the scroll position, so there is nothing to seek or decode and it stays sharp at any size. The same eased scroll value can drive video.currentTime when you have footage; encode that with a keyframe every few frames so seeking is instant.',
  when:'Longer sequences than an image set can carry, such as a process, a build or a reveal.',
  perf:'One shader pass each time the scroll value moves (none while it rests or the section is off screen), at a pixel ratio capped at 2, and nothing to download. The scroll value is eased so the picture never jumps. For video, seeking costs decoding: use a short GOP (for example ffmpeg -g 4) and a modest resolution.',
  a11y:'The canvas is decorative (aria-hidden); the captions carry the story in text. Under reduced motion the easing is removed, so the picture follows the scroll exactly and never moves on its own. Without WebGL a CSS gradient stands in.',
  support:'WebGL 1: every current browser.',
  html:`<section class="scrub"><div class="pin"><canvas aria-hidden="true"></canvas><div class="title"><p class="kicker">The scroll is the clock</p><h1 class="display">Scroll the<br>light.</h1></div><div class="caps"><p data-at="0.12">It starts warm, with the light low on the left.</p><p data-at="0.42">Halfway down, the light is overhead.</p><p data-at="0.72">It ends cool, as the light leaves on the right.</p></div><div class="meter"><i></i></div></div></section>${END('The light is yours to scrub.')}`,
  css:`.scrub{height:calc(340vh * var(--fx-intensity))}
.pin{position:sticky;top:0;height:100vh;overflow:hidden;background:#fbf3ea}
.pin canvas{position:absolute;inset:0;width:100%;height:100%}
.title{position:absolute;left:6vw;top:12vh;display:grid;gap:14px;color:#111113}.title .kicker{color:#4b4f57}
.caps{position:absolute;left:6vw;bottom:13vh;display:grid;gap:10px;width:min(88vw,560px)}
.caps p{font:500 clamp(20px,2vw,28px)/1.2 "Inter",system-ui,sans-serif;letter-spacing:-.02em;color:#111113;opacity:0;transform:translateY(16px);transition:opacity var(--fx-duration) var(--fx-ease),transform var(--fx-duration) var(--fx-ease)}
.caps p.on{opacity:1;transform:none}
.meter{position:absolute;left:6vw;right:6vw;bottom:6vh;height:2px;background:rgba(17,17,19,.15)}.meter i{display:block;height:100%;background:#111113;transform-origin:left;transform:scaleX(0)}`,
  js:`${FLOW}
const sec=document.querySelector('.scrub'),caps=[...sec.querySelectorAll('.caps p')],bar=sec.querySelector('.meter i');let cur=0;
/* The scroll position is the clock: 24 seconds of flow from top to bottom, forwards or backwards. */
flowField(sec.querySelector('canvas'),{colors:['#fff7ec','#ffd8b5','#ffc0a8','#fff0c4'],to:['#eef2ff','#bccaf7','#8ea4ea','#dfe7ff'],sun:1,zoom:1.3,warp:Math.min(1.5,FX.i),autoplay:true,clock:()=>cur*24,progress:()=>cur});
function frame(){const p=FX.progress(sec);cur=FX.R||Math.abs(p-cur)<.0005?p:cur+(p-cur)*.18;bar.style.transform='scaleX('+cur+')';caps.forEach(c=>c.classList.toggle('on',cur>=+c.dataset.at));requestAnimationFrame(frame);}
requestAnimationFrame(frame);`},

 /* ---------------- Reveal ---------------- */
 {id:'L04',name:'Clip-path and mask reveals',api:'clip-path: inset() · circle() · polygon() · mask-image',tags:['Reveal','CSS-first','Media'],cost:'Low',animates:'clip-path, mask-position',
  what:'Images uncover themselves through an animated clipping shape or a gradient mask, so they arrive with intent instead of popping in. Four shapes here, each on a view timeline: inset, circle, polygon and a soft mask wipe.',
  when:'Hero images and galleries. Pick one shape and one direction for a whole page; mixing them (as this demo does for comparison) gets busy.',
  perf:'clip-path animations are compositor-friendly in current engines; masks repaint. The image itself never changes size, so there is no layout work.',
  a11y:'The image is in the page from the start (only clipped), so alt text and layout are stable. Under reduced motion images are shown whole.',
  support:'clip-path and mask-image: everywhere. The scroll timeline is Chrome, Edge and Safari 26+; other browsers reveal on intersection.',
  html:`<section class="hero"><img class="cover open" src="${PH}podcast-ben-koorengevel-2017-03-17.webp" alt="A studio microphone in low light, with blue lights out of focus behind it"><div class="copy"><p class="kicker">clip-path · mask-image</p><h1 class="display">Seen, then<br>shown.</h1></div></section>
<section class="tiles">${[['podcast-elegant-steel-microphone','s1','inset(100% 0 0 0) → inset(0)','A vintage ribbed steel microphone against a dark background','50% 50%'],['podcast-microphone','s2','circle(0%) → circle(75%)','A gold and silver handheld microphone standing upright','50% 50%'],['podcast-jonathan-velasquez-2016','s3','polygon() diagonal wipe','A studio microphone in a shock mount behind a pop filter','68% 50%'],['podcast-kai-oberh-user-2016-02-26','s4','mask-image gradient wipe','A gold handheld microphone lying at an angle','45% 50%']].map(([n,s,c,a,pos])=>`<figure class="tile"><img class="${s}" src="${PH}${n}.webp" alt="${a}" style="object-position:${pos}"><figcaption>${c}</figcaption></figure>`).join('')}</section>${END('Arrived with intent.')}`,
  css:`.hero{position:relative;height:100vh;overflow:hidden;display:grid;align-items:end;background:#0d0f12;color:#fff}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(13,15,18,.8),rgba(13,15,18,0) 60%)}
.open{animation:open calc(var(--fx-duration)*1.8) var(--fx-ease) both}
@keyframes open{from{clip-path:inset(42% 30% 42% 30% round 24px)}to{clip-path:inset(0 round 0)}}
.hero .copy{position:relative;z-index:1;display:grid;gap:16px;padding:0 6vw 10vh}.hero .kicker{color:rgba(255,255,255,.78)}
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:8vh 4vw;padding:14vh 6vw}
.tile{margin:0;display:grid;gap:14px}.tile:nth-child(even){margin-top:18vh}
.tile img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:16px;animation:none}
.tile figcaption{font:500 13px ui-monospace,"JetBrains Mono",monospace;color:#6b6f76}
@keyframes s1{from{clip-path:inset(100% 0 0 0 round 16px)}to{clip-path:inset(0 round 16px)}}
@keyframes s2{from{clip-path:circle(0% at 50% 50%)}to{clip-path:circle(75% at 50% 50%)}}
@keyframes s3{from{clip-path:polygon(0 0,0 0,0 0,0 0)}to{clip-path:polygon(0 0,200% 0,0 200%,0 0)}}
@keyframes s4{from{mask-position:100% 0}to{mask-position:0 0}}
.s4{mask-image:linear-gradient(90deg,#fff 40%,transparent 60%);mask-size:260% 100%;mask-position:0 0}
@supports (animation-timeline:view()){.tile img{animation:var(--k) linear both;animation-timeline:view();animation-range:entry 5% cover 45%}}
.s1{--k:s1}.s2{--k:s2}.s3{--k:s3}.s4{--k:s4}
.io .tile img{animation:var(--k) calc(var(--fx-duration)*1.4) var(--fx-ease) both paused}.io .tile.in img{animation-play-state:running}
@media(max-width:720px){.tiles{grid-template-columns:1fr}.tile:nth-child(even){margin-top:0}}`,
  js:`if(!CSS.supports('animation-timeline: view()')&&!FX.R){document.body.classList.add('io');
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.3});
 document.querySelectorAll('.tile').forEach(t=>io.observe(t));}`},

 {id:'L12',name:'Staggered entrance',api:'--i × transition-delay',tags:['Reveal','CSS-first'],cost:'Low',animates:'opacity, transform',
  what:'A grid assembles tile by tile. Each tile carries its index as a custom property (--i) and its delay is calc(var(--i) * step), so the choreography lives in CSS and one class starts it.',
  when:'Feature grids, bento layouts and galleries on first view. Keep the whole set under a second; long staggers make people wait.',
  perf:'Opacity and transform only, started by one class change.',
  a11y:'Tiles are in the DOM and readable from the start for assistive tech; under reduced motion they simply appear.',
  support:'Custom properties in calc(): everywhere.',
  html:`<section class="bento" id="b"><div class="t lead" style="--i:0"><p class="kicker">transition-delay: calc(var(--i) × 70ms)</p><h1>Everything<br>in its place.</h1><button class="pill" id="replay" type="button">Replay</button></div>${[['workspace-laptop-on-a-desk','','Desk','big','A laptop, notebooks, a phone and a lamp on a pale desk, seen from above'],['office-old-books-on-bookshelf','-640','Spines','','Old cloth-bound books leaning on a shelf'],['office-on-the-shelf','','Shelf','tall','Rows of leather-bound books in red, blue and brown'],['office-chantilly-library-study','','Library','wide','A two-storey library with carved shelves and a painted ceiling'],['workspace-laptop-on-desk-book-stacks','-640','Lamp','','A desk lamp, a laptop and stacked books on a white desk']].map(([n,sz,t,c,a],i)=>`<figure class="t ${c}" style="--i:${i+1}"><img src="${PH}${n}${sz}.webp" alt="${a}"><figcaption>${t}</figcaption></figure>`).join('')}</section>`,
  css:`.bento{height:100vh;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);gap:12px;padding:12px;background:#fafafa}
.t{position:relative;margin:0;border-radius:16px;overflow:hidden;background:#ececee;opacity:0;transform:translateY(calc(56px*var(--fx-intensity))) scale(.95);transition:opacity var(--fx-duration) var(--fx-ease) calc(var(--i)*70ms),transform var(--fx-duration) var(--fx-ease) calc(var(--i)*70ms)}
.in .t{opacity:1;transform:none}
.t img{width:100%;height:100%;object-fit:cover}
.t figcaption{position:absolute;left:12px;bottom:12px;padding:7px 12px;border-radius:999px;background:#fff;font:500 13px/1.05 "Inter",system-ui,sans-serif;color:#111113}
.lead{grid-row:span 2;display:grid;align-content:space-between;gap:16px;padding:28px;background:#111113;color:#fff}.lead .kicker{color:rgba(255,255,255,.7)}.lead h1{font-size:clamp(28px,3.4vw,52px)}.lead .pill{justify-self:start}
.big{grid-column:span 2;grid-row:span 2}.tall{grid-row:span 2}.wide{grid-column:span 2}
@media(max-width:720px){.bento{height:auto;grid-template-columns:1fr 1fr;grid-auto-rows:30vh}.big,.wide{grid-column:span 2}}`,
  js:`const b=document.getElementById('b');const go=()=>{b.classList.remove('in');void b.offsetWidth;requestAnimationFrame(()=>b.classList.add('in'));};
go();document.getElementById('replay').onclick=go;`},

 {id:'L24',name:'Split-text reveal',api:'aria-label + aria-hidden spans · transform',tags:['Reveal','Type'],cost:'Low',animates:'transform',
  what:'A headline is split into lines, words or letters, each sliding up from behind its own mask. Lines are found by measuring where words actually wrap, so the split survives any width.',
  when:'Section openers and statements: one per screen. Letters for short words, lines for sentences.',
  perf:'Each piece is a transform; a 10-word line is 10 compositor animations. Re-split on resize (debounced) so lines stay true.',
  a11y:'The heading keeps its words in an aria-label and the pieces are aria-hidden, so screen readers read the sentence once, not letter by letter. Under reduced motion the text simply appears.',
  support:'Everywhere.',
  html:`${[['words','Each word rises from behind its own mask.','Split by word'],['chars','Letters suit short lines.','Split by letter'],['lines','Lines are found where the words really wrap, so the split survives any width.','Split by measured line']].map(([m,t,k],i)=>`<section class="panel p${i}"><p class="kicker">${k}</p><h1 class="split" data-mode="${m}">${t}</h1></section>`).join('')}`,
  css:`.panel{min-height:100vh;display:grid;align-content:center;gap:24px;padding:0 7vw}
.p1{background:#f4f4f5}.p2{background:#ececee}
.split{font-size:clamp(40px,6.4vw,96px);max-width:17ch;text-wrap:wrap}
.split .m{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.1em;margin-bottom:-.1em}
.split .m>span{display:inline-block;transform:translateY(110%);transition:transform var(--fx-duration) var(--fx-ease) var(--d,0ms)}
.split .m.ln{display:block}
.split.in .m>span{transform:none}
html.reduce .split .m>span{transform:none}`,
  js:`function split(h){const text=h.dataset.text||h.textContent.trim();h.dataset.text=text;h.setAttribute('aria-label',text);const mode=h.dataset.mode;h.textContent='';let k=0;
 const piece=(t,cls)=>{const m=document.createElement('span');m.className='m'+(cls?' '+cls:'');m.setAttribute('aria-hidden','true');const s=document.createElement('span');s.textContent=t;m.append(s);return m;};
 const words=text.split(' ');
 if(mode==='chars'){words.forEach((w,i)=>{const g=document.createElement('span');g.style.whiteSpace='nowrap';[...w].forEach(c=>g.append(piece(c)));h.append(g);if(i<words.length-1)h.append(' ');});}
 else{const ws=words.map((w,i)=>{const m=piece(w);h.append(m);if(i<words.length-1)h.append(' ');return m;});
  if(mode==='lines'){const lines=[];let top=null;ws.forEach(m=>{if(m.offsetTop!==top){lines.push([]);top=m.offsetTop;}lines[lines.length-1].push(m.textContent);});h.textContent='';lines.forEach(l=>h.append(piece(l.join(' '),'ln')));}}
 const step=mode==='chars'?24:mode==='lines'?110:70;h.querySelectorAll('.m>span').forEach(s=>s.style.setProperty('--d',(k++*step/Math.max(.25,FX.i))+'ms'));}
const heads=[...document.querySelectorAll('.split')];heads.forEach(split);
const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('in',e.isIntersecting)),{threshold:.5});heads.forEach(h=>io.observe(h));
let t;addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(()=>heads.forEach(h=>{const was=h.classList.contains('in');split(h);h.classList.toggle('in',was);}),200);});`},

 {id:'L05',name:'Text decode',api:'requestAnimationFrame · aria-label',tags:['Reveal','Type'],cost:'Low',animates:'text content',
  what:'A phrase resolves from random glyphs into words, left to right, each character settling at its own moment. The real words live in an aria-label; the glyph soup is hidden from assistive tech.',
  when:'Technical, archival or data-led brands, for one headline or a status line. Not for body copy.',
  perf:'Rewrites a few dozen characters per frame for under two seconds, then stops.',
  a11y:'Screen readers hear the final phrase once. Under reduced motion the phrase is shown directly with no scramble, and the cycle pauses.',
  support:'Everywhere.',
  html:`<section class="dec"><p class="kicker">Glyphs settle left to right</p><h1 class="scr" id="scr"></h1><p class="lede">The words are in an aria-label; the noise is aria-hidden.</p><button class="pill" id="again" type="button">Decode the next phrase</button></section>`,
  css:`.dec{min-height:100vh;display:grid;align-content:center;justify-items:start;gap:28px;padding:0 7vw;background:#fafafa;color:#111113}
.scr{font:500 clamp(32px,8vw,120px)/1.05 "JetBrains Mono",ui-monospace,monospace;letter-spacing:-.05em;min-height:1em;white-space:nowrap}
.scr i{font-style:normal;color:#a1a1aa}`,
  js:`const el=document.getElementById('scr'),phrases=['MAKE IT MOVE','SIGNAL / NOISE','DECODED','HELLO, WORLD'],G='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*+';let n=0,timer;
function decode(text){el.setAttribute('aria-label',text);if(FX.R){el.textContent=text;return;}const start=performance.now(),dur=FX.d*1.8,at=[...text].map((c,i)=>i/text.length*.7+Math.random()*.3);
 (function frame(now){const p=Math.min(1,(now-start)/dur);let out='';for(let i=0;i<text.length;i++){const c=text[i];out+=c===' '||p>=at[i]?c:'<i>'+G[Math.floor(Math.random()*G.length)]+'</i>';}el.innerHTML='<span aria-hidden="true">'+out+'</span>';if(p<1)requestAnimationFrame(frame);})(start);}
function next(){decode(phrases[n++%phrases.length]);clearTimeout(timer);if(!FX.R)timer=setTimeout(next,FX.d*4.2);}
next();document.getElementById('again').onclick=next;`},

 {id:'L27',name:'Odometer counter',api:'font-variant-numeric: tabular-nums · translateY',tags:['Reveal','Type'],cost:'Low',animates:'transform',
  what:'Each digit is a window onto a 0 to 9 strip that rolls to its value, with tabular figures so nothing jitters. Everything shown here is live: the clock, the day of the year and the days left, computed from today\'s date.',
  when:'Prices, live counts, scores and stats. Show real numbers; a counter that animates to a stale figure is worse than none.',
  perf:'One transform per digit. Digits only roll when their value changes.',
  a11y:'Each number carries its final value in an aria-label and the rolling strips are aria-hidden; the clock is a <time> element. Under reduced motion digits change without rolling.',
  support:'Everywhere.',
  html:`<section class="odo"><p class="kicker" id="today"></p><div class="clock" id="clock"></div><div class="stats">${[['doy','Day of the year'],['left','Days left this year'],['week','Week number']].map(([k,l])=>`<div class="st"><b class="num" data-k="${k}"></b><span>${l}</span></div>`).join('')}</div></section>`,
  css:`.odo{min-height:100vh;display:grid;align-content:center;gap:5vh;padding:0 7vw}
.clock{font:600 clamp(52px,11vw,168px)/1.05 "Inter",system-ui,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:-.03em;color:#111113;display:flex}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:4vw;border-top:1px solid rgba(17,17,19,.15);padding-top:4vh}
.st b{display:flex;font:600 clamp(36px,4.6vw,64px)/1.05 "Inter",system-ui,sans-serif;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:#111113}
.st>span{display:block;margin-top:8px;font:500 13px "Inter",system-ui,sans-serif;color:#6b6f76}
.dg{display:inline-block;height:1em;overflow:hidden;line-height:1}
.dg>span{display:block;transform:translateY(calc(var(--n,0)*-10%));transition:transform var(--fx-duration) var(--fx-ease)}
.clock .dg>span{transition-duration:calc(var(--fx-duration)*.45)}
.dg>span>span{display:block;height:1em}
.sep{display:inline-block;width:.32em;text-align:center;opacity:.6}
@media(max-width:720px){.stats{grid-template-columns:1fr}}`,
  js:`const strip=()=>{const d=document.createElement('span');d.className='dg';d.setAttribute('aria-hidden','true');const s=document.createElement('span');for(let i=0;i<10;i++){const k=document.createElement('span');k.textContent=i;s.append(k);}d.append(s);return d;};
function setNum(el,str,label){el.setAttribute('aria-label',label||str);el.setAttribute('role','img');const want=[...str];
 if(el.children.length!==want.length){el.textContent='';want.forEach(c=>{if(/\\d/.test(c))el.append(strip());else{const s=document.createElement('span');s.className='sep';s.setAttribute('aria-hidden','true');s.textContent=c;el.append(s);}});}
 want.forEach((c,i)=>{const d=el.children[i];if(d.classList.contains('dg'))d.firstChild.style.setProperty('--n',c);});}
const now=new Date(),y=now.getFullYear(),start=new Date(y,0,1),doy=Math.floor((now-start)/864e5)+1,len=(new Date(y+1,0,1)-start)/864e5;
const th=new Date(Date.UTC(y,now.getMonth(),now.getDate()));th.setUTCDate(th.getUTCDate()+4-(th.getUTCDay()||7));const week=Math.ceil(((th-Date.UTC(th.getUTCFullYear(),0,1))/864e5+1)/7);
document.getElementById('today').textContent=now.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const vals={doy:String(doy),left:String(len-doy),week:String(week)};
const nums=[...document.querySelectorAll('.num')];nums.forEach(n=>setNum(n,'0'.repeat(vals[n.dataset.k].length),vals[n.dataset.k]));
setTimeout(()=>nums.forEach(n=>setNum(n,vals[n.dataset.k])),FX.R?0:300);
const clock=document.getElementById('clock');const pad=v=>String(v).padStart(2,'0');
function tick(){const t=new Date(),s=pad(t.getHours())+':'+pad(t.getMinutes())+':'+pad(t.getSeconds());setNum(clock,s,'The time is '+s);}
tick();setInterval(tick,1000);`},

 /* ---------------- Transitions ---------------- */
 {id:'L20',name:'View Transitions (same page)',api:'document.startViewTransition()',tags:['Transition'],cost:'Low',animates:'snapshots on the compositor',
  what:'A card morphs into its detail view: the browser snapshots the old and new states and animates between them. You only give the two elements the same view-transition-name and change the DOM inside startViewTransition().',
  when:'Any state change inside a page where people should not lose their place: grid to detail, list to editor, tab to tab.',
  perf:'The animation runs on snapshots on the compositor, so the DOM swap can be as heavy as it likes. Keep names unique and few.',
  a11y:'Focus moves to the new view and back, so keyboard users follow the morph. Under reduced motion the DOM swaps instantly without a transition.',
  support:'Same-document view transitions: Chrome and Edge 111+, Safari 18+, Firefox 144+. Without support the DOM simply swaps.',
  html:`<main class="vt"><section id="list"><div class="cards">${[['city-city-from-docks-at-night','Harbour','A city skyline across dark water at dusk'],['city-flatiron-at-night','Corner','A red-brick flatiron building at a lit junction at dusk'],['city-bogot-city-and-street-lights','Avenue','Tower blocks above an avenue streaked with car lights'],['city-city-night-lights','River','A lit bridge and towers reflected in a river at night']].map(([n,t,a])=>`<button class="c" type="button" data-n="${n}" data-t="${t}"><img src="${PH}${n}.webp" alt="${a}"><span>${t}</span></button>`).join('')}</div><div class="hint"><p class="kicker">startViewTransition()</p><h1>Pick a place.</h1></div></section><section id="detail" hidden><img alt=""><div class="dcopy"><button class="pill back" type="button">← All places</button><h2></h2><p class="lede">The card you chose became this page. Back reverses the morph.</p></div></section></main>`,
  css:`.vt{height:100vh;overflow:hidden}
#list{height:100%;display:grid;grid-template-rows:1fr auto}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:12px}
.c{all:unset;position:relative;cursor:pointer;border-radius:16px;overflow:hidden;background:#0d0f12}
.c img{width:100%;height:100%;object-fit:cover;transition:transform .6s}.c:hover img{transform:scale(1.04)}
.c::before{content:"";position:absolute;inset:auto 0 0 0;height:55%;background:linear-gradient(rgba(13,15,18,0),rgba(13,15,18,.72))}.c span{position:absolute;left:20px;bottom:18px;font:600 clamp(20px,1.9vw,28px)/1.05 "Inter",system-ui,sans-serif;letter-spacing:-.03em;color:#fff}
.c:focus-visible{outline:2px solid #fff;outline-offset:-6px}
.hint{display:flex;justify-content:space-between;align-items:baseline;padding:10px 26px 22px}.hint h1{font-size:clamp(28px,3.4vw,48px)}
#detail{position:relative;height:100%}#detail[hidden]{display:none}
#detail img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;view-transition-name:hero}
#detail::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(13,15,18,.82),rgba(13,15,18,0) 60%)}
.dcopy{position:absolute;left:6vw;bottom:9vh;z-index:1;display:grid;gap:18px;justify-items:start;color:#fff}.dcopy .lede{color:rgba(255,255,255,.88)}
.dcopy h2{font-size:clamp(40px,6vw,88px);view-transition-name:title}
::view-transition-group(*){animation-duration:var(--fx-duration);animation-timing-function:var(--fx-ease)}
@media(max-width:720px){.cards{grid-template-columns:1fr 1fr}}`,
  js:`const IMGPATH='${PH}';
const list=document.getElementById('list'),det=document.getElementById('detail');let last=null;
const name=(c,on)=>{c.querySelector('img').style.viewTransitionName=on?'hero':'';c.querySelector('span').style.viewTransitionName=on?'title':'';};
function go(fn){if(document.startViewTransition&&!FX.R)return document.startViewTransition(fn);fn();}
document.querySelectorAll('.c').forEach(c=>c.onclick=()=>{last=c;name(c,true);
 go(()=>{name(c,false);const big=det.querySelector('img');big.src=IMGPATH+c.dataset.n+'.webp';big.alt=c.querySelector('img').alt;det.querySelector('h2').textContent=c.dataset.t;list.hidden=true;det.hidden=false;det.querySelector('.back').focus();});});
det.querySelector('.back').onclick=()=>{const t=go(()=>{list.hidden=false;det.hidden=true;name(last,true);last.focus();});if(t)t.finished.then(()=>name(last,false));else name(last,false);};`},

 {id:'L38',name:'View Transitions (across pages)',api:'@view-transition { navigation: auto } · pageswap / pagereveal',tags:['Transition','CSS-first'],cost:'Low',animates:'snapshots on the compositor',
  what:'Two separate HTML pages morph into each other on an ordinary link click. Both pages opt in with one CSS rule; pageswap and pagereveal name the clicked picture on each side so it flies into place. The preview navigates between two real documents, and the code tabs give you both files.',
  when:'Multi-page sites (static sites, CMS templates) that want app-like continuity without a client-side router.',
  perf:'The browser snapshots both pages and animates on the compositor; the navigation itself is a normal page load, so keep pages fast.',
  a11y:'It is a real navigation, so the back button, history and screen-reader page announcements all work. Under reduced motion the pages switch without a transition.',
  support:'Cross-document view transitions: Chrome and Edge 126+, Safari 18.2+. Other browsers navigate normally.',
  html:'',css:'',js:'',
  pages:{'index.html':`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cross-document view transition: index</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
<style>
/* 1. Both pages opt in. That is the whole API for a basic crossfade. */
@view-transition{navigation:auto}
:root{--fx-duration:900ms;--fx-ease:cubic-bezier(.2,.7,.1,1)}
::view-transition-group(*){animation-duration:var(--fx-duration);animation-timing-function:var(--fx-ease)}
*{box-sizing:border-box}
body{margin:0;height:100vh;display:grid;grid-template-rows:1fr auto;background:#fafafa;color:#111113;font:400 17px/1.5 "Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:12px;min-height:0}
.cards a{position:relative;display:block;border-radius:16px;overflow:hidden;color:#fff;text-decoration:none;background:#0d0f12}
.cards img{width:100%;height:100%;object-fit:cover;display:block}
.cards a::after{content:"";position:absolute;inset:auto 0 0 0;height:50%;background:linear-gradient(rgba(13,15,18,0),rgba(13,15,18,.72))}
.cards span{position:absolute;z-index:1;left:20px;bottom:18px;font:600 clamp(20px,1.9vw,28px)/1.05 "Inter",system-ui,sans-serif;letter-spacing:-.03em}
.cards a:focus-visible{outline:2px solid #fff;outline-offset:-6px}
footer{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:8px 16px;padding:12px 26px 22px}
footer h1{margin:0;font:600 clamp(28px,3.4vw,48px)/1.05 "Inter",system-ui,sans-serif;letter-spacing:-.03em}
.kicker{margin:0;font:500 13px/1.4 "Inter",system-ui,sans-serif;color:#6b6f76}
@media(max-width:720px){.cards{grid-template-columns:1fr 1fr}}
@media(prefers-reduced-motion:reduce){@view-transition{navigation:none}}
</style>
</head>
<body>
<main class="cards">
 <a href="detail.html#summit" data-p="summit"><img src="${PH}nature-colorful-landscape-with-a-snow.webp" alt="A snow-covered mountain above pine forest and a red meadow"><span>Summit</span></a>
 <a href="detail.html#lake" data-p="lake"><img src="${PH}nature-mountain-lake.webp" alt="Mountains and autumn forest reflected in a still lake"><span>Lake</span></a>
 <a href="detail.html#valley" data-p="valley"><img src="${PH}nature-green-mountain-landscape.webp" alt="Sunrise over a green mountain valley, with granite boulders in the foreground"><span>Valley</span></a>
 <a href="detail.html#canyon" data-p="canyon"><img src="${PH}nature-lush-mountain-landscape.webp" alt="A green canyon floor with a winding track beneath tall red cliffs"><span>Canyon</span></a>
</main>
<footer><h1>Two pages, one motion.</h1><p class="kicker">@view-transition · pageswap · pagereveal</p></footer>
<script>
/* Add class="reduce" to <html> to switch the motion off (the media query above already follows the system setting). */
const reduce=()=>document.documentElement.classList.contains('reduce');
/* The link's fragment (detail.html#lake) says which picture is in play, on both pages. */
const cardFor=url=>{const p=new URL(url).hash.slice(1);return [...document.querySelectorAll('.cards a')].find(a=>a.dataset.p===p);};
const pair=(card,on)=>{card.querySelector('img').style.viewTransitionName=on?'hero':'';card.querySelector('span').style.viewTransitionName=on?'title':'';};

/* 2. Leaving this page: name the picture that was clicked, so it morphs into the detail hero. */
addEventListener('pageswap',e=>{
 if(!e.viewTransition)return;
 if(reduce()){e.viewTransition.skipTransition();return;}
 const card=e.activation&&cardFor(e.activation.entry.url);if(card)pair(card,true);
});
/* 3. Arriving back from a detail page: name the matching card so the hero flies home. */
addEventListener('pagereveal',e=>{
 if(!e.viewTransition)return;
 if(reduce()){e.viewTransition.skipTransition();return;}
 const from=window.navigation&&navigation.activation&&navigation.activation.from;
 const card=cardFor(from?from.url:location.href);if(!card)return;
 pair(card,true);e.viewTransition.finished.then(()=>pair(card,false));
});
/* Clear names if this page is restored from the back/forward cache. */
addEventListener('pageshow',()=>document.querySelectorAll('.cards a').forEach(a=>pair(a,false)));
</script>
</body>
</html>`,'detail.html':`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cross-document view transition: detail</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
<style>
@view-transition{navigation:auto}
:root{--fx-duration:900ms;--fx-ease:cubic-bezier(.2,.7,.1,1)}
::view-transition-group(*){animation-duration:var(--fx-duration);animation-timing-function:var(--fx-ease)}
*{box-sizing:border-box}
body{margin:0;height:100vh;overflow:hidden;background:#0d0f12;color:#fff;font:400 17px/1.5 "Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
/* The hero always carries the name, so it pairs with whichever card the index page named. */
.hero{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;view-transition-name:hero}
body::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(13,15,18,.82),rgba(13,15,18,0) 60%);pointer-events:none}
.copy{position:absolute;left:6vw;bottom:9vh;z-index:1;display:grid;gap:18px;justify-items:start}
h1{margin:0;font:600 clamp(40px,6vw,88px)/1.05 "Inter",system-ui,sans-serif;letter-spacing:-.03em;view-transition-name:title}
p{margin:0;font-size:clamp(16px,1.25vw,18px);max-width:42ch;color:rgba(255,255,255,.88)}
.back{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid #d4d4d8;background:#fff;color:#111113;text-decoration:none;font:500 15px/1.05 "Inter",system-ui,sans-serif}
.back:focus-visible{outline:2px solid #fff;outline-offset:3px}
@media(prefers-reduced-motion:reduce){@view-transition{navigation:none}}
</style>
</head>
<body>
<img class="hero" alt="">
<div class="copy"><a class="back" href="index.html">← All places</a><h1></h1><p>This is a separate HTML page. The browser morphed the card you clicked into this picture across the navigation.</p></div>
<script>
const PLACES={
 summit:['Summit','nature-colorful-landscape-with-a-snow','A snow-covered mountain above pine forest and a red meadow'],
 lake:['Lake','nature-mountain-lake','Mountains and autumn forest reflected in a still lake'],
 valley:['Valley','nature-green-mountain-landscape','Sunrise over a green mountain valley, with granite boulders in the foreground'],
 canyon:['Canyon','nature-lush-mountain-landscape','A green canyon floor with a winding track beneath tall red cliffs']};
const key=PLACES[location.hash.slice(1)]?location.hash.slice(1):'summit',[title,file,alt]=PLACES[key];
const hero=document.querySelector('.hero');hero.src='${PH}'+file+'.webp';hero.alt=alt;
document.querySelector('h1').textContent=title;document.title=title;
/* Send the fragment back with the link, so the index page knows which card to pair with. */
document.querySelector('.back').href+='#'+key;
const reduce=()=>document.documentElement.classList.contains('reduce');
addEventListener('pagereveal',e=>{if(e.viewTransition&&reduce())e.viewTransition.skipTransition();});
addEventListener('pageswap',e=>{if(e.viewTransition&&reduce())e.viewTransition.skipTransition();});
</script>
</body>
</html>`}},

 {id:'L39',name:'Entry animations with @starting-style',api:'@starting-style · transition-behavior: allow-discrete',tags:['Transition','CSS-first'],cost:'Very low',animates:'opacity, transform, display, overlay',
  what:'New elements, dialogs and popovers animate in and out with plain CSS transitions. @starting-style gives the "before" state for something that has just appeared; allow-discrete lets display and overlay wait for the exit animation.',
  when:'Anything inserted or opened: list items, toasts, dialogs, popovers, menus. No more adding a class on the next frame.',
  perf:'Plain transitions on opacity and transform. No JavaScript in the animation path at all.',
  a11y:'Native <dialog> and popover keep focus handling, Escape and top-layer stacking. Under reduced motion they open instantly.',
  support:'@starting-style and allow-discrete: Chrome and Edge 117+, Safari 17.5+, Firefox 129+ (Firefox does not yet animate the display/overlay exit).',
  html:`<section class="ss"><img class="cover" src="${PH}drink-minimalist-black-coffee.webp" alt="A small cup of black coffee on a plain white surface"><div class="panel"><p class="kicker">@starting-style</p><h1>Arrive in CSS.</h1><div class="row"><button class="pill solid" id="add" type="button">Add a note</button><button class="pill" id="open" type="button">Open dialog</button><button class="pill" popovertarget="tip" type="button">Show popover</button></div><ul id="notes" aria-live="polite"></ul></div></section>
<dialog id="dlg" aria-labelledby="dt"><p class="kicker">Native dialog</p><h2 id="dt">Fades in, fades out.</h2><p class="lede">Escape, focus and the backdrop are all the browser's.</p><form method="dialog"><button class="pill solid">Close</button></form></dialog>
<div id="tip" popover><b>Popover</b> · enters from @starting-style, leaves with allow-discrete.</div>`,
  css:`.ss{position:relative;height:100vh;display:grid;align-items:center;overflow:hidden;background:#fff}
.panel{position:relative;margin-left:7vw;width:min(560px,86vw);display:grid;gap:20px}
.panel h1{font-size:clamp(36px,5vw,72px)}
.row{display:flex;flex-wrap:wrap;gap:10px}
#notes{list-style:none;margin:0;padding:0;display:grid;gap:10px;max-height:34vh;overflow:hidden}
.note{padding:14px 18px;border-radius:12px;background:#fff;border:1px solid #e4e4e7;font-size:16px;transition:opacity var(--fx-duration) var(--fx-ease),transform var(--fx-duration) var(--fx-ease)}
@starting-style{.note{opacity:0;transform:translateY(calc(30px*var(--fx-intensity))) scale(.96)}}
dialog{border:1px solid #e4e4e7;border-radius:20px;padding:32px;max-width:min(460px,90vw);background:#fff;color:#111113;box-shadow:0 24px 48px -32px rgba(17,17,19,.35);display:grid;gap:14px;opacity:0;transform:translateY(20px) scale(.94);
 transition:opacity var(--fx-duration) var(--fx-ease),transform var(--fx-duration) var(--fx-ease),overlay var(--fx-duration) allow-discrete,display var(--fx-duration) allow-discrete}
dialog:not([open]){display:none}
dialog[open]{opacity:1;transform:none}
@starting-style{dialog[open]{opacity:0;transform:translateY(20px) scale(.94)}}
dialog h2{font-size:28px}dialog form{margin-top:6px}
dialog::backdrop{background:rgb(17 17 19/0);transition:background var(--fx-duration),overlay var(--fx-duration) allow-discrete,display var(--fx-duration) allow-discrete}
dialog[open]::backdrop{background:rgb(17 17 19/.28)}
@starting-style{dialog[open]::backdrop{background:rgb(17 17 19/0)}}
[popover]{inset:auto 24px 24px auto;margin:0;border:0;border-radius:16px;padding:14px 18px;background:#111113;color:#fff;font-size:15px;opacity:0;transform:translateY(16px);
 transition:opacity var(--fx-duration) var(--fx-ease),transform var(--fx-duration) var(--fx-ease),overlay var(--fx-duration) allow-discrete,display var(--fx-duration) allow-discrete}
[popover]:popover-open{opacity:1;transform:none}
@starting-style{[popover]:popover-open{opacity:0;transform:translateY(16px)}}`,
  js:`const notes=document.getElementById('notes'),lines=['A new note slides in from @starting-style.','No requestAnimationFrame, no extra class.','The browser knows it has just appeared.','Older notes leave as new ones arrive.'];let n=0;
function add(){const li=document.createElement('li');li.className='note';li.textContent=lines[n++%lines.length];notes.prepend(li);while(notes.children.length>3)notes.lastElementChild.remove();}
document.getElementById('add').onclick=add;document.getElementById('open').onclick=()=>document.getElementById('dlg').showModal();
[0,1,2].forEach(i=>setTimeout(add,FX.R?0:400+i*FX.d*.5));`},

 {id:'L13',name:'FLIP layout animation',api:'getBoundingClientRect · element.animate()',tags:['Transition'],cost:'Low',animates:'transform, opacity',
  what:'When filtering re-flows a grid, every tile glides from where it was to where it lands. First and Last positions are measured, the difference is Inverted into a transform, then Played back with the Web Animations API.',
  when:'Filtering, sorting, reordering and adding items: anywhere the layout itself changes and a jump would lose people.',
  perf:'One measurement pass before and after the change, then pure transform animations. Avoid animating width and height directly.',
  a11y:'The filter buttons are real toggles (aria-pressed) and the count is announced. Under reduced motion tiles move instantly.',
  support:'Web Animations API: everywhere. (Same-document view transitions, L20, can do this too in newer browsers.)',
  html:`<section class="flip"><header><div><p class="kicker">First · Last · Invert · Play</p><h1>Filter without the jump.</h1></div><div class="chips" role="group" aria-label="Filter">${['All','Coffee','Bread','Clay'].map((t,i)=>`<button class="pill${i?'':' solid'}" type="button" aria-pressed="${!i}" data-f="${t}">${t}</button>`).join('')}<button class="pill" type="button" id="shuffle">Shuffle</button></div><p class="kicker" id="count" role="status"></p></header><ul class="grid">${[['drink-black-coffee-cup','Coffee','A foamy coffee in a black cup and saucer'],['bakery-fresh-bread-and-butter','Bread','A white loaf beside a dish of butter'],['hands-making-pottery','Clay','Hands pressing into clay on a wheel, seen from above'],['drink-blue-coffee-cup','Coffee','A flat white in a blue cup on a blue tray'],['bakery-loaves-of-bread','Bread','Rows of loaves on bakery racks'],['hands-mud-games','Clay','Hands shaping the neck of a small clay pot'],['drink-frothy-coffee-in-a-green-cup','Coffee','A frothy coffee in a green cup and saucer'],['bakery-fresh-rustic-bread','Bread','A dark seeded loaf on a wooden board'],['hands-pottery-wheel','Clay','Clay-covered hands raising the wall of a bowl'],['drink-coffee-day','Coffee','Coffee in a white cup and saucer'],['bakery-mink-mingle-2017','Bread','Trays of croissants and pain au chocolat'],['hands-black-and-white-pottery','Clay','Two hands cupped around a mound of clay']].map(([n,k,a])=>`<li data-k="${k}"><img src="${PH}${n}-640.webp" alt="${a}"><span>${k}</span></li>`).join('')}</ul></section>`,
  css:`.flip{height:100vh;display:grid;grid-template-rows:auto 1fr;gap:14px;padding:22px 26px;background:#fafafa}
.flip header{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:14px}.flip h1{font-size:clamp(28px,3.2vw,44px)}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:minmax(0,1fr);gap:12px;min-height:0}
.grid li{position:relative;border-radius:12px;overflow:hidden;background:#ececee}
.grid li[hidden]{display:none}
.grid img{width:100%;height:100%;object-fit:cover}
.grid span{position:absolute;left:8px;bottom:8px;padding:6px 10px;border-radius:999px;background:#fff;font:500 12px/1.05 "Inter",system-ui,sans-serif;color:#111113}
@media(max-width:720px){.flip{height:auto;min-height:100vh}.grid{grid-template-columns:repeat(3,1fr);grid-auto-rows:26vw}}`,
  js:`const grid=document.querySelector('.grid'),items=[...grid.children],count=document.getElementById('count');let f='All';
function flip(change){const first=new Map(items.map(el=>[el,el.getBoundingClientRect()]));change();
 items.forEach(el=>{if(el.hidden)return;const a=first.get(el),b=el.getBoundingClientRect();const opt={duration:FX.R?0:FX.d,easing:FX.ease,fill:'backwards'};
  if(!a.width){el.animate([{opacity:0,transform:'scale(.6)'},{opacity:1,transform:'none'}],opt);return;}
  const dx=a.left-b.left,dy=a.top-b.top,sx=a.width/b.width,sy=a.height/b.height;if(dx||dy||sx!==1||sy!==1)el.animate([{transformOrigin:'0 0',transform:'translate('+dx+'px,'+dy+'px) scale('+sx+','+sy+')'},{transformOrigin:'0 0',transform:'none'}],opt);});}
function apply(){items.forEach(el=>el.hidden=!(f==='All'||el.dataset.k===f));count.textContent=items.filter(el=>!el.hidden).length+' of '+items.length+' shown';}
document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{f=b.dataset.f;document.querySelectorAll('[data-f]').forEach(x=>{x.setAttribute('aria-pressed',String(x===b));x.classList.toggle('solid',x===b);});flip(apply);});
document.getElementById('shuffle').onclick=()=>flip(()=>{items.sort(()=>Math.random()-.5).forEach(el=>grid.append(el));});
apply();`},

 {id:'L49',name:'Spring easing with linear()',api:'transition-timing-function: linear(…)',tags:['Transition','CSS-first'],cost:'Very low',animates:'transform',
  what:'linear() takes a list of points, so it can describe a real spring: overshoot, settle and all. Here a tiny spring simulation writes the linear() string from stiffness and damping, and three controls share it through one custom property.',
  when:'Toggles, tab indicators, sheets and anything that should feel physical. Use a gentle spring for UI; save the bouncy one for playful moments.',
  perf:'It is an ordinary CSS transition, so it runs on the compositor. The string is generated once, not per frame.',
  a11y:'Under reduced motion springs are replaced by a short, plain ease (and the demo stops auto-playing). Every control is a real button or switch.',
  support:'linear() easing: Chrome and Edge 113+, Safari 17.2+, Firefox 112+. Older browsers fall back to the ease declared first.',
  html:`<section class="sp"><div class="copy"><p class="kicker">linear() generated from a spring</p><h1>Physics,<br>in one line of CSS.</h1><label class="ctl">Bounce<input type="range" id="bounce" min="0" max="0.9" step="0.05" value="0.45"></label><pre id="out" aria-label="Generated easing"></pre></div>
<div class="demos"><button class="switch" role="switch" aria-checked="false" type="button" aria-label="Spring switch"><i></i></button>
<div class="seg" role="group" aria-label="View">${['Day','Week','Month'].map((t,i)=>`<button type="button" aria-pressed="${!i}">${t}</button>`).join('')}<i class="pill-ind"></i></div>
<div class="pop"><img src="${PH}bakery-sweet-tooth-640.webp" alt="Iced doughnuts in a black dish, with sweets scattered around it"></div></div></section>`,
  css:`.sp{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:5vw;padding:0 7vw;background:#fafafa;color:#111113}
.sp .kicker{color:#6b6f76}.sp h1{font-size:clamp(32px,4.4vw,64px);margin:14px 0 26px}
.ctl{display:flex;align-items:center;gap:12px;font-weight:500;font-size:15px}.ctl input{width:220px;accent-color:#111113}
#out{margin:18px 0 0;max-width:100%;white-space:pre-wrap;word-break:break-all;font:12px/1.5 "JetBrains Mono",monospace;color:#6b6f76;max-height:22vh;overflow:hidden}
.demos{display:grid;gap:44px;justify-items:center}
.switch{width:150px;height:78px;border-radius:999px;border:0;background:#d4d4d8;position:relative;cursor:pointer;transition:background .3s}
.switch i{position:absolute;left:8px;top:8px;width:62px;height:62px;border-radius:50%;background:#fff;box-shadow:0 6px 16px -6px rgba(17,17,19,.12);transition:transform var(--spring-d) var(--spring)}
.switch[aria-checked=true]{background:#111113}.switch[aria-checked=true] i{transform:translateX(72px)}
.seg{position:relative;display:flex;padding:6px;border-radius:999px;background:#ececee}
.seg button{position:relative;z-index:1;border:0;background:none;color:#111113;font:500 15px "Inter",system-ui,sans-serif;padding:14px 26px;cursor:pointer;width:110px}
.pill-ind{position:absolute;left:6px;top:6px;bottom:6px;width:110px;border-radius:999px;background:#fff;box-shadow:0 4px 12px -6px rgba(17,17,19,.09);transition:transform var(--spring-d) var(--spring)}
.pop{width:min(320px,70vw);aspect-ratio:4/3;border-radius:16px;overflow:hidden;transform:scale(.6);opacity:.4;transition:transform var(--spring-d) var(--spring),opacity .3s}
.pop.on{transform:none;opacity:1}.pop img{width:100%;height:100%;object-fit:cover}
@media(max-width:720px){.sp{grid-template-columns:1fr;padding:10vh 6vw}}`,
  js:`const root=document.documentElement,out=document.getElementById('out');
function spring(bounce){const k=170,c=2*Math.sqrt(k)*(1-bounce),pts=[];let x=0,v=0,t=0,dt=1/120,settle=0;
 while(t<3){const a=-k*(x-1)-c*v;v+=a*dt;x+=v*dt;t+=dt;pts.push(x);if(Math.abs(x-1)<.001&&Math.abs(v)<.01){if(++settle>12)break;}else settle=0;}
 const step=Math.max(1,Math.round(pts.length/48));const s=[0];for(let i=step;i<pts.length;i+=step)s.push(+pts[i].toFixed(3));s.push(1);
 return {ease:'linear('+s.join(', ')+')',ms:Math.round(t*1000*(FX.d/900))};}
function set(){const b=+document.getElementById('bounce').value*Math.min(1.2,FX.i),r=FX.R?{ease:'ease-out',ms:150}:spring(b);root.style.setProperty('--spring',r.ease);root.style.setProperty('--spring-d',r.ms+'ms');out.textContent='transition: transform '+r.ms+'ms '+r.ease+';';}
document.getElementById('bounce').oninput=set;set();
const sw=document.querySelector('.switch'),seg=[...document.querySelectorAll('.seg button')],ind=document.querySelector('.pill-ind'),pop=document.querySelector('.pop');
sw.onclick=()=>sw.setAttribute('aria-checked',String(sw.getAttribute('aria-checked')!=='true'));
seg.forEach((b,i)=>b.onclick=()=>{seg.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));ind.style.transform='translateX('+(i*110)+'px)';});
pop.onclick=()=>pop.classList.toggle('on');
let k=0,auto=!FX.R;document.querySelector('.sp').addEventListener('pointerdown',()=>auto=false);
(function cycle(){if(!auto)return;sw.click();seg[k%3].click();pop.classList.toggle('on',k%2===0);k++;setTimeout(cycle,1500);})();`},

 /* ---------------- Pointer ---------------- */
 {id:'L10',name:'Cursor spotlight',api:'mask-image: radial-gradient() · custom properties',tags:['Pointer','Media'],cost:'Low',animates:'mask position (custom properties)',
  what:'A dark, desaturated image is revealed in full colour under the pointer. The pointer only updates two custom properties; a radial-gradient mask on the lit copy does the rest.',
  when:'Exploratory heroes, product details and "look closer" moments. Also the basis of glowing card borders (move the gradient into a border).',
  perf:'Two custom properties per frame, eased; the mask repaints one layer. Pauses work when off screen if you add an observer.',
  a11y:'The content never depends on the light: the headline is always readable. On touch, and under reduced motion, the spotlight sits wide and still.',
  support:'mask-image: everywhere (unprefixed in all current engines).',
  html:`<section class="spot"><img class="base" src="${PH}office-chantilly-library-study.webp" alt=""><img class="lit" src="${PH}office-chantilly-library-study.webp" alt="A two-storey library with carved wooden shelves and a painted ceiling"><div class="copy"><p class="kicker">Move to light it</p><h1 class="display">Look<br>closer.</h1></div></section>`,
  css:`.spot{position:relative;height:100vh;overflow:hidden;background:#0d0f12;color:#fff;--x:50%;--y:50%;--r:calc(240px*var(--fx-intensity))}
.spot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.base{filter:grayscale(1) brightness(.32)}
.lit{-webkit-mask-image:radial-gradient(circle var(--r) at var(--x) var(--y),#fff 35%,transparent 100%);mask-image:radial-gradient(circle var(--r) at var(--x) var(--y),#fff 35%,transparent 100%)}
.spot::after{content:"";position:absolute;inset:0;background:linear-gradient(20deg,rgba(13,15,18,.78),rgba(13,15,18,0) 48%);pointer-events:none}
.copy{position:absolute;z-index:1;left:7vw;bottom:10vh;display:grid;gap:14px;pointer-events:none}.copy .kicker{color:rgba(255,255,255,.8)}
html.reduce .spot{--r:70vmax}`,
  js:`const s=document.querySelector('.spot');let tx=50,ty=50,x=50,y=50,user=false;
s.addEventListener('pointermove',e=>{const r=s.getBoundingClientRect();tx=(e.clientX-r.left)/r.width*100;ty=(e.clientY-r.top)/r.height*100;user=true;});
(function loop(t){if(!user&&!FX.R){tx=55+Math.sin(t/1700)*26;ty=45+Math.cos(t/2300)*20;}x+=(tx-x)*.12;y+=(ty-y)*.12;s.style.setProperty('--x',x+'%');s.style.setProperty('--y',y+'%');requestAnimationFrame(loop);})(0);`},

 {id:'L09',name:'Magnetic pull',api:'pointermove · eased translate',tags:['Pointer'],cost:'Low',animates:'transform',
  what:'Buttons lean toward a nearby pointer and their label follows a little further, then spring back. The pull is eased every frame so it feels weighted rather than glued to the cursor.',
  when:'One or two key calls to action, social links or a cursor-led portfolio. Not for every button: the effect is a highlight.',
  perf:'One transform on the button and one on its label, eased in a single requestAnimationFrame loop.',
  a11y:'The hit area never moves away from the pointer (the pull is a fraction of the distance), focus rings are visible, and under reduced motion nothing moves.',
  support:'Everywhere. Fine pointers only: touch devices skip it.',
  html:`<section class="mag"><p class="kicker">Bring the pointer close</p><h1 class="display">Follow your<br>curiosity.</h1><div class="btns"><button class="magnet primary" type="button"><span>Explore the work</span></button><button class="magnet" type="button"><span>Book a call</span></button></div></section>`,
  css:`.mag{min-height:100vh;display:grid;place-content:center;justify-items:center;gap:32px;text-align:center;background:#fafafa;color:#111113}
.mag .kicker{color:#6b6f76}
.btns{display:flex;gap:16px;flex-wrap:wrap;justify-content:center}
.magnet{font:500 15px/1.05 "Inter",system-ui,sans-serif;height:44px;padding:0 22px;border-radius:999px;border:1px solid #d4d4d8;background:#fff;color:#111113;cursor:pointer;will-change:transform}
.magnet span{display:inline-block;will-change:transform}.magnet.primary{background:#111113;border-color:#111113;color:#fff}
.magnet:focus-visible{outline:2px solid #111113;outline-offset:4px}`,
  js:`const radius=160,pull=.38*FX.i,B=[...document.querySelectorAll('.magnet')].map(b=>({b,l:b.querySelector('span'),x:0,y:0,tx:0,ty:0}));let px=-1e4,py=-1e4;
if(!FX.R&&matchMedia('(pointer:fine)').matches){addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;});
 (function loop(){for(const o of B){const r=o.b.getBoundingClientRect(),cx=r.left+r.width/2-o.x,cy=r.top+r.height/2-o.y,dx=px-cx,dy=py-cy,near=Math.hypot(dx,dy)<radius+r.width/2;const cap=28*FX.i;o.tx=near?FX.clamp(dx*pull,-cap,cap):0;o.ty=near?FX.clamp(dy*pull,-cap,cap):0;o.x+=(o.tx-o.x)*.15;o.y+=(o.ty-o.y)*.15;o.b.style.transform='translate('+o.x+'px,'+o.y+'px)';o.l.style.transform='translate('+o.x*.45+'px,'+o.y*.45+'px)';}requestAnimationFrame(loop);})();}`},

 {id:'L08',name:'3D tilt with perspective',api:'perspective · rotateX / rotateY · translateZ',tags:['Pointer'],cost:'Low',animates:'transform',
  what:'Cards lean toward the pointer in 3D with a soft glare that follows it, and their labels float above the surface with translateZ. The angle is eased and capped.',
  when:'Product cards, covers and collectibles: things people would pick up. Cap the angle near 12 degrees; more looks broken.',
  perf:'Transforms only, eased in one loop; the glare is a gradient positioned by custom properties.',
  a11y:'Keyboard focus lifts the card instead of tilting it. Under reduced motion, and on touch, cards stay flat.',
  support:'3D transforms: everywhere.',
  html:`<section class="tilt"><div class="copy"><p class="kicker">perspective: 1000px</p><h1>Small moves,<br>big character.</h1></div><div class="cards">${[['drink-blue-coffee-cup','Blue','A flat white in a blue cup on a blue tray','62% 50%'],['drink-frothy-coffee-in-a-green-cup','Green','A frothy coffee in a green cup and saucer','50% 50%'],['drink-black-coffee-cup','Black','A foamy coffee in a black cup and saucer','38% 50%']].map(([n,t,a,pos])=>`<a class="card" href="#"><img src="${PH}${n}.webp" alt="${a}" style="object-position:${pos}"><span class="glare"></span><b>${t}</b></a>`).join('')}</div></section>`,
  css:`.tilt{min-height:100vh;display:grid;align-content:center;gap:5vh;padding:6vh 6vw}
.tilt h1{font-size:clamp(32px,4.2vw,60px)}.tilt .copy{display:grid;gap:14px}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:3vw;perspective:1000px}
.card{position:relative;display:block;border-radius:16px;overflow:hidden;transform-style:preserve-3d;background:#0d0f12;color:#fff;text-decoration:none;will-change:transform}
.card img{width:100%;aspect-ratio:4/5;max-height:58vh;object-fit:cover}
.card::after{content:"";position:absolute;inset:auto 0 0 0;height:45%;background:linear-gradient(rgba(13,15,18,0),rgba(13,15,18,.68));pointer-events:none}
.card b{position:absolute;z-index:1;left:20px;bottom:18px;font:600 clamp(20px,2vw,28px)/1.05 "Inter",system-ui,sans-serif;letter-spacing:-.03em;transform:translateZ(50px)}
.glare{position:absolute;inset:0;background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.36),transparent 55%);opacity:var(--go,0);pointer-events:none;transition:opacity .3s}
.card:focus-visible{outline:2px solid #111113;outline-offset:5px;transform:translateY(-8px)}
@media(max-width:720px){.cards{grid-template-columns:1fr 1fr}}`,
  js:`const max=12*FX.i;
document.querySelectorAll('.card').forEach(c=>{c.addEventListener('click',e=>e.preventDefault());if(FX.R||!matchMedia('(pointer:fine)').matches)return;let rx=0,ry=0,tx=0,ty=0,raf=0;
 const loop=()=>{rx+=(tx-rx)*.14;ry+=(ty-ry)*.14;c.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)';raf=Math.abs(tx-rx)+Math.abs(ty-ry)>.01?requestAnimationFrame(loop):0;};
 c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;ty=(x-.5)*max*2;tx=(.5-y)*max*2;c.style.setProperty('--gx',x*100+'%');c.style.setProperty('--gy',y*100+'%');c.style.setProperty('--go',1);if(!raf)raf=requestAnimationFrame(loop);});
 c.addEventListener('pointerleave',()=>{tx=ty=0;c.style.setProperty('--go',0);if(!raf)raf=requestAnimationFrame(loop);});});`},

 {id:'L29',name:'Cursor trail',api:'canvas 2D · quadratic smoothing',tags:['Pointer','Canvas'],cost:'Low',animates:'canvas pixels',
  what:'The pointer leaves a brush stroke that thins and fades, smoothed with quadratic curves through the midpoints of recent samples. It sits behind the text and never blocks clicks.',
  when:'Playful portfolios, art and music sites, and empty states that invite play.',
  perf:'Draws only the last second of points; the canvas is cleared each frame. With no pointer it idles on a slow figure, which you can remove.',
  a11y:'Purely decorative (aria-hidden, pointer-events: none). Under reduced motion it is switched off.',
  support:'Everywhere.',
  html:`<section class="ink"><canvas aria-hidden="true"></canvas><div class="copy"><p class="kicker">Draw with the pointer</p><h1 class="display">Leave a<br>mark.</h1><p class="lede">Strokes fade after a second, so the page stays clean.</p></div></section>`,
  css:`.ink{position:relative;height:100vh;background:#fafafa;color:#111113;overflow:hidden;cursor:crosshair}
.ink canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.copy{position:relative;z-index:1;height:100%;display:grid;align-content:center;gap:18px;padding:0 8vw;pointer-events:none}.copy .kicker{color:#6b6f76}`,
  js:`const c=document.querySelector('canvas'),x=c.getContext('2d'),pts=[],life=1000;let last=0;
function size(){const d=Math.min(2,devicePixelRatio);c.width=c.clientWidth*d;c.height=c.clientHeight*d;x.setTransform(d,0,0,d,0,0);}size();addEventListener('resize',size);
c.parentNode.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();last=performance.now();pts.push({x:e.clientX-r.left,y:e.clientY-r.top,t:last});});
(function loop(){if(FX.R)return;const now=performance.now();x.clearRect(0,0,c.width,c.height);
 if(now-last>1500){const W=c.clientWidth,H=c.clientHeight,t=now/1000;pts.push({x:W*.62+Math.sin(t*1.3)*W*.25,y:H*.5+Math.sin(t*2.1)*H*.28,t:now});}
 while(pts.length&&now-pts[0].t>life)pts.shift();
 for(let i=1;i<pts.length-1;i++){const a=pts[i-1],b=pts[i],n=pts[i+1],age=(now-b.t)/life;x.beginPath();x.moveTo((a.x+b.x)/2,(a.y+b.y)/2);x.quadraticCurveTo(b.x,b.y,(b.x+n.x)/2,(b.y+n.y)/2);x.lineWidth=Math.max(.5,(1-age)*16*FX.i);x.lineCap='round';x.strokeStyle='rgba(17,17,19,'+(1-age)+')';x.stroke();}
 requestAnimationFrame(loop);})();`},

 {id:'L30',name:'Infinite drag canvas',api:'pointer capture · modular wrap · transform',tags:['Pointer'],cost:'Low',animates:'transform',
  what:'Drag, wheel-zoom or use the arrow keys to roam a moodboard that never ends. A fixed set of tiles wraps around with modular arithmetic, so the world is endless with a constant number of elements; a little inertia keeps it feeling physical.',
  when:'Moodboards, archives and portfolios where wandering is the point.',
  perf:'A fixed pool of tiles, each moved by transform; images are lazy-loaded.',
  a11y:'The board is focusable with arrow keys and +/- to zoom, and the buttons do the same. Under reduced motion there is no inertia or idle drift.',
  support:'Pointer events and pointer capture: everywhere.',
  html:`<section class="ic" tabindex="0" aria-label="Infinite moodboard. Drag, or use the arrow keys, and plus or minus to zoom."><div class="world"></div><div class="hud"><button type="button" data-z="1.2" aria-label="Zoom in">+</button><button type="button" data-z="0.83" aria-label="Zoom out">−</button><button type="button" data-reset>Reset</button><span class="kicker">Drag · wheel · arrow keys</span></div></section>`,
  css:`.ic{position:relative;height:100vh;overflow:hidden;background:#f4f4f5;color:#111113;cursor:grab;touch-action:none}
.ic:active{cursor:grabbing}.ic:focus-visible{outline:none;box-shadow:inset 0 0 0 3px #111113}
.world{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}
.tile{position:absolute;width:240px;border-radius:12px;overflow:hidden;background:#fff;border:1px solid #e4e4e7;user-select:none}
.tile img{width:100%;aspect-ratio:var(--ar);object-fit:cover;pointer-events:none}
.tile span{display:block;padding:9px 12px;font:500 14px "Inter",system-ui,sans-serif}
.hud{position:absolute;left:20px;bottom:20px;display:flex;gap:8px;align-items:center;background:rgba(255,255,255,.9);border:1px solid #e4e4e7;backdrop-filter:blur(10px);padding:8px;border-radius:999px}
.hud button{font:500 15px "Inter",system-ui,sans-serif;min-width:44px;height:44px;border-radius:999px;border:1px solid #d4d4d8;background:#fff;color:#111113;cursor:pointer;padding:0 14px}
.hud .kicker{padding:0 8px;color:#6b6f76}`,
  js:`const IMGS='${PH}';
/* each entry is file|label; the small 640px copies are plenty for a 240px tile */
const names=['drink-blue-coffee-cup|Coffee','nature-alpine-landscape|Ridge','bakery-fresh-bread-and-butter|Bread','city-flatiron-at-night|City','hands-making-pottery|Clay','office-old-books-on-bookshelf|Books','property-living-room|Room','podcast-elegant-steel-microphone|Studio','nature-mountain-lake|Lake','drink-frothy-coffee-in-a-green-cup|Coffee','cafe-copper-tea-kettles|Copper','fitness-starting-line|Track','bakery-mink-mingle-2017|Pastry','city-city-from-docks-at-night|Harbour','hands-mud-games|Clay','nature-colorful-landscape-with-a-snow|Summit','office-on-the-shelf|Shelf','drink-coffee-day|Coffee','products-afternoon-light|Light','city-city-night-lights|River','bakery-fresh-rustic-bread|Bread','nature-flachau-mountain-valley|Valley','podcast-microphone|Microphone','property-coffee-table-corner-in-a-londo|Window','hands-pottery-wheel|Clay','drink-black-coffee-cup|Coffee','office-chantilly-library-study|Library','nature-lush-mountain-landscape|Canyon','bakery-loaves-of-bread|Bakery','city-bogot-city-and-street-lights|Avenue','products-burning-prayer-candles|Candles','fitness-800-meter-line|Lane'];
const ic=document.querySelector('.ic'),world=document.querySelector('.world'),CELL=280,COLS=8,ROWS=4;let ox=0,oy=0,z=1,vx=0,vy=0,drag=null,idle=!FX.R;
const tiles=[];for(let r=0;r<ROWS*2;r++)for(let col=0;col<COLS*2;col++){const [n,label]=names[(r*COLS+col)%names.length].split('|'),t=document.createElement('div');t.className='tile';t.style.setProperty('--ar',['6/5','5/4','4/3'][(r+col)%3]);t.innerHTML='<img src="'+IMGS+n+'-640.webp" alt="" loading="lazy" draggable="false"><span>'+label+'</span>';world.append(t);tiles.push({t,c:col,r,off:(col%2)*100});}
function draw(){const W=COLS*2*CELL,H=ROWS*2*CELL;for(const o of tiles){const px=((o.c*CELL+ox)%W+W)%W-CELL,py=((o.r*CELL+o.off+oy)%H+H)%H-CELL;o.t.style.transform='translate('+px+'px,'+py+'px)';}world.style.transform='scale('+z+')';}
ic.addEventListener('pointerdown',e=>{idle=false;drag={x:e.clientX,y:e.clientY};vx=vy=0;ic.setPointerCapture(e.pointerId);});
ic.addEventListener('pointermove',e=>{if(!drag)return;const dx=(e.clientX-drag.x)/z,dy=(e.clientY-drag.y)/z;ox+=dx;oy+=dy;vx=dx;vy=dy;drag={x:e.clientX,y:e.clientY};draw();});
ic.addEventListener('pointerup',()=>{drag=null;});
ic.addEventListener('wheel',e=>{e.preventDefault();idle=false;z=FX.clamp(z*(e.deltaY<0?1.08:.93),.4,2.2);draw();},{passive:false});
ic.addEventListener('keydown',e=>{const s=70;idle=false;if(e.key==='ArrowLeft')ox+=s;else if(e.key==='ArrowRight')ox-=s;else if(e.key==='ArrowUp')oy+=s;else if(e.key==='ArrowDown')oy-=s;else if(e.key==='+'||e.key==='=')z=Math.min(2.2,z*1.2);else if(e.key==='-')z=Math.max(.4,z/1.2);else return;e.preventDefault();draw();});
document.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{z=FX.clamp(z*+b.dataset.z,.4,2.2);draw();});document.querySelector('[data-reset]').onclick=()=>{ox=oy=0;z=1;draw();};
(function loop(){if(!drag&&!FX.R){if(idle){ox-=.6*FX.i;oy-=.25*FX.i;}else{ox+=vx;oy+=vy;vx*=.92;vy*=.92;}if(idle||Math.abs(vx)+Math.abs(vy)>.05)draw();}requestAnimationFrame(loop);})();draw();`},

 {id:'L25',name:'Image distortion shader',api:'WebGL fragment shader',tags:['Pointer','WebGL','Media'],cost:'Medium',animates:'GPU fragment shader',
  what:'The picture ripples and splits into colour fringes under the pointer, rendered by a 10-line fragment shader on a single full-screen triangle strip. Without WebGL it shows the plain picture.',
  when:'Hero images and showcase moments with one image. One shader per page is plenty.',
  perf:'All work is on the GPU; the ripple amplitude decays so the loop is cheap at rest. Cap devicePixelRatio at 2 and pause it when off screen on long pages.',
  a11y:'The canvas has an aria-label; the headline is HTML. Under reduced motion the ripple amplitude is zero and the image is still.',
  support:'WebGL 1: every current browser. A plain <img> is the fallback.',
  html:`<section class="lq"><canvas role="img" aria-label="A ripple moving across a photograph of a mountain lake"></canvas><img class="fallback" src="${PH}nature-mountain-lake.webp" alt="Mountains and autumn forest reflected in a still lake" hidden><div class="copy"><p class="kicker">Move across the image</p><h1 class="display">Liquid<br>surface.</h1></div></section>`,
  css:`.lq{position:relative;height:100vh;background:#0d0f12;color:#fff;overflow:hidden}
.lq canvas,.fallback{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.lq::after{content:"";position:absolute;inset:0;background:radial-gradient(70% 60% at 100% 100%,rgba(13,15,18,.66),rgba(13,15,18,0) 72%);pointer-events:none}.copy{position:absolute;right:6vw;bottom:9vh;text-align:right;display:grid;gap:14px;pointer-events:none;z-index:1;justify-items:end}.copy .kicker{color:rgba(255,255,255,.8)}`,
  js:`const c=document.querySelector('canvas'),gl=c.getContext('webgl');
if(!gl){c.hidden=true;document.querySelector('.fallback').hidden=false;}else{
 const vs='attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0,1);}';
 const fs='precision mediump float;varying vec2 v;uniform sampler2D t;uniform vec2 m,sc;uniform float time,amp,asp,ia;void main(){vec2 uv0=(v-.5)*sc+.5;vec2 d=v-m;d.x*=asp;float r=length(d);float w=sin(r*40.-time*4.)*exp(-r*6.)*amp*ia;vec2 uv=uv0+normalize(d+1e-4)*w*.05;float ca=w*.012;vec3 col=vec3(texture2D(t,uv+ca).r,texture2D(t,uv).g,texture2D(t,uv-ca).b);gl_FragColor=vec4(col,1.);}';
 const sh=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;};
 const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 const U=n=>gl.getUniformLocation(pr,n),im=new Image(),plain=()=>{c.hidden=true;document.querySelector('.fallback').hidden=false;};im.crossOrigin='anonymous';im.onerror=plain;im.src=document.querySelector('.fallback').src;let m=[.5,.5],tm=[.5,.5],amp=0,start=performance.now();
 im.onload=()=>{start=performance.now();gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,im);}catch(e){return plain();}requestAnimationFrame(loop);};
 c.parentNode.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();tm=[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height];amp=1;});
 function loop(){const now=performance.now(),d=Math.min(2,devicePixelRatio);if(c.width!==Math.round(c.clientWidth*d)||c.height!==Math.round(c.clientHeight*d)){c.width=Math.round(c.clientWidth*d);c.height=Math.round(c.clientHeight*d);gl.viewport(0,0,c.width,c.height);}
  const a=c.width/c.height,ia=im.width/im.height;gl.uniform2f(U('sc'),a>ia?1:a/ia,a>ia?ia/a:1);
  m[0]+=(tm[0]-m[0])*.1;m[1]+=(tm[1]-m[1])*.1;amp*=.985;
  gl.uniform2f(U('m'),m[0],m[1]);gl.uniform1f(U('time'),(now-start)/1000);gl.uniform1f(U('amp'),FX.R?0:amp+.15);gl.uniform1f(U('asp'),a);gl.uniform1f(U('ia'),FX.i);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(loop);}}`},

 /* ---------------- Type ---------------- */
 {id:'L42',name:'Variable-font axes',api:'font-variation-settings · wght · wdth',tags:['Type','Pointer'],cost:'Low',animates:'font-variation-settings',
  what:'One variable font file holds a whole family along continuous axes. Here every letter of the headline swells in weight and width as the pointer passes, like a wave; when idle, the wave travels on its own.',
  when:'Display headlines and wordmarks where type is the image. Pair with a font that has generous axes (Roboto Flex here: weight 100 to 1000, width 25 to 151).',
  perf:'Changing axes re-shapes text, which is layout work: keep it to one headline and a dozen letters. Width changes can reflow, so the line is set nowrap.',
  a11y:'The heading keeps its words in an aria-label; letters are aria-hidden. Under reduced motion the letters sit at a fixed, readable weight.',
  support:'Variable fonts: every current browser. The font is from Google Fonts.',
  extraHead:'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap">',
  html:`<section class="vf"><p class="kicker">Roboto Flex · wght 100–1000 · wdth 25–151</p><h1 id="vf">Weight in motion</h1><p class="lede" id="axes" aria-hidden="true"></p></section>`,
  css:`.vf{min-height:100vh;display:grid;place-content:center;justify-items:center;gap:30px;padding:0 4vw;background:#fafafa;color:#111113;text-align:center}
.vf .lede{font:500 13px "Inter",system-ui,sans-serif;font-variant-numeric:tabular-nums;color:#6b6f76}
#vf{font-family:"Roboto Flex",system-ui,sans-serif;font-size:clamp(30px,9.5vw,150px);font-weight:400;letter-spacing:-.02em;line-height:1;white-space:nowrap}
#vf span{display:inline-block;font-variation-settings:"wght" var(--w,300),"wdth" var(--s,100),"opsz" 144}`,
  js:`const h=document.getElementById('vf'),out=document.getElementById('axes'),text=h.textContent;h.setAttribute('aria-label',text);
h.innerHTML=[...text].map(ch=>'<span aria-hidden="true">'+(ch===' '?'&nbsp;':ch)+'</span>').join('');const L=[...h.children];let px=null;
h.parentNode.addEventListener('pointermove',e=>{px=e.clientX;});h.parentNode.addEventListener('pointerleave',()=>{px=null;});
(function loop(t){const ctr=L.map(s=>{const r=s.getBoundingClientRect();return r.left+r.width/2;});const wave=px===null?innerWidth*(.5+.45*Math.sin(t/(FX.d*2.2))):px;let peak=0;
 L.forEach((s,i)=>{const d=Math.abs(ctr[i]-wave)/(innerWidth*.11),k=FX.R?0:Math.exp(-d*d)*Math.min(1.2,FX.i);const w=Math.round(250+700*k),wd=Math.round(70+70*k);s.style.setProperty('--w',FX.R?500:w);s.style.setProperty('--s',FX.R?100:wd);if(k>peak){peak=k;out.textContent='wght '+w+' · wdth '+wd;}});
 if(!FX.R)requestAnimationFrame(loop);else out.textContent='wght 500 · wdth 100';})(0);`},

 {id:'L41',name:'Text along a path',api:'SVG <textPath> · startOffset',tags:['Type','Scroll'],cost:'Low',animates:'startOffset',
  what:'A sentence rides a curved SVG path and slides along it as you scroll, with a slow drift of its own. The text stays real, selectable SVG text.',
  when:'Section dividers, stamps and badges, or a playful line that leads the eye down a page.',
  perf:'Updating startOffset re-lays one text run; cheap at one or two paths.',
  a11y:'The curved line is aria-hidden and the same sentence is in the page as a normal heading. Under reduced motion it stays still.',
  support:'SVG textPath: everywhere.',
  html:`<section class="tp"><img class="cover" src="${PH}fitness-800-meter-line.webp" alt="A red running track with a curved white lane line and the number 800"><svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><path id="curve" d="M-80 520 C 200 140, 460 120, 640 380 S 1060 640, 1300 220"/></defs><use href="#curve" class="guide"/><text><textPath href="#curve" startOffset="0%">Follow the line where the work leads · </textPath></text></svg><div class="copy"><p class="kicker">&lt;textPath&gt;</p><h1 class="display">Follow<br>the line.</h1></div></section>${END('Type that travels.')}`,
  css:`.tp{position:relative;height:100vh;overflow:hidden;background:#7c2318;color:#fff}
.tp::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,15,18,.55),rgba(13,15,18,.12) 60%)}
.tp svg{position:absolute;z-index:1;inset:0;width:100%;height:100%}
.guide{fill:none;stroke:rgba(255,255,255,.4);stroke-width:2;stroke-dasharray:4 10}
.tp text{font:600 40px "Inter",system-ui,sans-serif;letter-spacing:-.01em;fill:#fff}
.copy{position:absolute;z-index:2;right:7vw;top:11vh;display:grid;gap:16px;text-align:right}.copy .kicker{color:rgba(255,255,255,.82)}`,
  js:`const tp=document.querySelector('textPath'),path=document.getElementById('curve'),unit=tp.textContent;let per=40,drift=0;
tp.textContent=unit.repeat(7);
/* One sentence is this share of the path; wrapping the offset by it makes the loop seamless in any font. */
const measure=()=>{const len=tp.getSubStringLength(0,unit.length);if(len)per=len/path.getTotalLength()*100;};
measure();if(document.fonts)document.fonts.ready.then(measure);
(function loop(){drift=FX.R?0:drift+.03*FX.i;const p=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);tp.setAttribute('startOffset',(-2*per+(p*45*FX.i+drift)%per)+'%');if(!FX.R)requestAnimationFrame(loop);})();`},

 {id:'L11',name:'Marquee with controls',api:'@keyframes translateX(-50%) · animation-play-state',tags:['Type','Media','CSS-first'],cost:'Low',animates:'transform',
  what:'An endless ribbon of words and images. The content is doubled and the row slides by -50%, so it loops seamlessly in CSS. It reverses with your scroll direction, pauses on hover and focus, and has a real pause button.',
  when:'Logo walls, ticker lines and keyword bands. One or two per page.',
  perf:'A single linear transform animation per row; the doubled copy is aria-hidden.',
  a11y:'Anything that moves for more than five seconds needs a way to stop it (WCAG 2.2.2): the pause button is a real toggle, and under reduced motion the marquee starts paused.',
  support:'Everywhere.',
  html:`<section class="mq-wrap"><button class="pill pause" type="button" aria-pressed="false">Pause motion</button><div class="mq"><div class="row"><span>Coffee · Bread · Clay · Light · Paper · Stone · </span><span aria-hidden="true">Coffee · Bread · Clay · Light · Paper · Stone · </span></div></div><div class="mq rev"><div class="row imgs">${[0,1].map(k=>`<span${k?' aria-hidden="true"':''}>${[['drink-frothy-coffee-in-a-green-cup','A frothy coffee in a green cup'],['bakery-fresh-rustic-bread','A dark seeded loaf on a wooden board'],['hands-making-pottery','Hands pressing into clay on a wheel'],['products-burning-prayer-candles','Small candles burning in red and blue glass holders'],['office-old-books-on-bookshelf','Old cloth-bound books on a shelf'],['nature-alpine-landscape','Snowy peaks behind a dark ridge']].map(([n,a])=>`<img src="${PH}${n}-640.webp" alt="${k?'':a}">`).join('')}</span>`).join('')}</div></div><div class="mq"><div class="row small">${[0,1].map(k=>`<span${k?' aria-hidden="true"':''}>${'Scroll up to reverse · Hover to pause · '.repeat(5)}</span>`).join('')}</div></div></section>${END('Movement you can stop.')}`,
  css:`.mq-wrap{min-height:100vh;display:grid;align-content:center;gap:4vh;background:#fafafa;color:#111113;position:relative;overflow:hidden}
.mq{overflow:hidden;white-space:nowrap}
.row{display:inline-flex;width:max-content;animation:mq calc(var(--fx-duration)*24/var(--fx-intensity)) linear infinite;font:600 clamp(44px,7vw,104px)/1.05 "Inter",system-ui,sans-serif;letter-spacing:-.03em}
.row>span{display:inline-flex;align-items:center;gap:2vw;padding-right:2vw}
.row.small{font:500 15px/1.4 "Inter",system-ui,sans-serif;letter-spacing:0;color:#6b6f76;white-space:pre}
.rev .row{animation-direction:reverse}
.imgs img{height:24vh;aspect-ratio:1;object-fit:cover;border-radius:14px}
.mq-wrap:hover .row,.mq-wrap:focus-within .row,.mq-wrap.paused .row{animation-play-state:paused}
html.backward .row{animation-direction:reverse}html.backward .rev .row{animation-direction:normal}
@keyframes mq{to{transform:translateX(-50%)}}
.pause{position:absolute;top:24px;right:24px;z-index:1}`,
  js:`let last=scrollY;addEventListener('scroll',()=>{document.documentElement.classList.toggle('backward',scrollY<last);last=scrollY;},{passive:true});
const w=document.querySelector('.mq-wrap'),b=document.querySelector('.pause');
b.onclick=()=>{const p=w.classList.toggle('paused');b.setAttribute('aria-pressed',String(p));b.textContent=p?'Play motion':'Pause motion';};
if(FX.R)b.click();`},

 {id:'L33',name:'Knockout type',api:'mix-blend-mode: screen',tags:['Type','WebGL','Scroll'],cost:'Medium',animates:'transform, opacity',
  what:'A live colour field shows through giant letters. A white layer with black text in screen blend mode punches the letters out, so they stay real, selectable text. Scroll and the letters grow until you fall through into the field. The layer underneath can be anything: a canvas (as here), a photograph or a video.',
  when:'Bold openers for film, music and fashion. Needs a heavy face and very few letters.',
  perf:'One blended layer over one canvas; the scale is a transform. The field is drawn only while the section is on screen.',
  a11y:'The word is real HTML text. Under reduced motion the field holds one still frame and the letters do not scale.',
  support:'mix-blend-mode: everywhere. The field needs WebGL 1 and falls back to a CSS gradient.',
  html:`<section class="ft"><div class="pin"><canvas aria-hidden="true"></canvas><div class="mask"><h1>FLOW</h1></div><p class="hint kicker">Scroll</p></div></section>${END('Through the letters.')}`,
  css:`.ft{height:260vh}.pin{position:sticky;top:0;height:100vh;overflow:hidden;background:#fff}
.pin canvas{position:absolute;inset:0;width:100%;height:100%}
.mask{position:absolute;inset:0;background:#fff;mix-blend-mode:screen;display:grid;place-items:center}
.mask h1{font:800 clamp(110px,29vw,420px)/.8 "Inter",system-ui,sans-serif;letter-spacing:-.06em;color:#000;transform-origin:50% 52%;will-change:transform}
.hint{position:absolute;left:50%;bottom:6vh;transform:translateX(-50%);color:#6b6f76}`,
  js:`${FLOW}
const s=document.querySelector('.ft'),h=s.querySelector('h1'),m=s.querySelector('.mask'),hint=s.querySelector('.hint');
flowField(s.querySelector('canvas'),{colors:['#0f1d5c','#2f5bff','#7cc7ff','#ff9db5'],zoom:.9,warp:Math.min(1.5,FX.i),speed:1260/FX.d});
function f(){const p=FX.R?0:FX.progress(s);h.style.transform='scale('+(1+Math.pow(p,1.6)*6*FX.i)+')';m.style.opacity=String(FX.clamp(1-(p-.4)/.35,0,1));hint.style.opacity=String(1-p*4);requestAnimationFrame(f);}f();`},

 {id:'L48',name:'SVG displacement filter',api:'feTurbulence + feDisplacementMap',tags:['Type','Pointer'],cost:'Medium',animates:'SVG filter attributes',
  what:'The headline ripples as if seen through warm air or water: an SVG turbulence noise feeds a displacement map. Hover stirs the air; it settles back to crisp, readable type.',
  when:'One expressive headline or logo. The same filter family powers gooey blobs (blur + alpha threshold) and glitch splits.',
  perf:'SVG filters run on the CPU in some engines; keep the filtered area to one headline and animate only the scale.',
  a11y:'The text stays real and settles to sharp at rest. Under reduced motion the displacement is zero.',
  support:'SVG filters on HTML: every current browser.',
  html:`<section class="dh"><svg class="defs" aria-hidden="true"><filter id="warp" x="-10%" y="-20%" width="120%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.035" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></svg><div class="copy"><p class="kicker">feTurbulence → feDisplacementMap</p><h1>Mirage<br>season.</h1><p class="lede">Hover the words to stir the air.</p></div></section>`,
  css:`.dh{height:100vh;display:grid;place-items:center;background:#fafafa;color:#111113;text-align:center}
.defs{position:absolute;width:0;height:0}
.copy{display:grid;gap:20px;justify-items:center}.copy h1{font-size:clamp(48px,9vw,128px);filter:url(#warp);cursor:default}.copy .kicker,.copy .lede{color:#6b6f76}`,
  js:`const turb=document.querySelector('feTurbulence'),disp=document.querySelector('feDisplacementMap'),h=document.querySelector('.dh h1');let hot=0,target=.3,t=0;
h.addEventListener('pointerenter',()=>target=1);h.addEventListener('pointerleave',()=>target=.3);
(function loop(){t+=.012;hot+=(target-hot)*.05;disp.setAttribute('scale',(FX.R?0:hot*40*FX.i).toFixed(2));turb.setAttribute('baseFrequency',(0.012+Math.sin(t)*.003).toFixed(4)+' '+(0.035+Math.cos(t*.8)*.008).toFixed(4));if(!FX.R)requestAnimationFrame(loop);})();`},

 /* ---------------- Canvas & WebGL ---------------- */
 {id:'L16',name:'Canvas particle field',api:'canvas 2D · devicePixelRatio · IntersectionObserver',tags:['Canvas','Pointer','Ambient'],cost:'Medium',animates:'canvas pixels',
  what:'A quiet constellation that links nearby points and parts around the pointer. Particle count scales with the screen area and intensity; the loop stops when the canvas is off screen.',
  when:'Tech, science and data heroes that want life without video.',
  perf:'Neighbour links are O(n²), so the count is tied to area; the loop pauses off screen and when hidden. Draw at devicePixelRatio for crisp points.',
  a11y:'Decorative (aria-hidden), behind real text. Under reduced motion a single still frame is drawn.',
  support:'Everywhere.',
  html:`<section class="pf"><canvas aria-hidden="true"></canvas><div class="copy"><p class="kicker">Live field · move the pointer through it</p><h1 class="display">Form follows<br>motion.</h1></div></section>`,
  css:`.pf{position:relative;height:100vh;background:#fafafa;overflow:hidden}
.pf canvas{position:absolute;inset:0;width:100%;height:100%}
.copy{position:absolute;left:7vw;top:50%;transform:translateY(-50%);color:#111113;display:grid;gap:16px;pointer-events:none}`,
  js:`const c=document.querySelector('canvas'),x=c.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1);let W,H,P=[],m={x:-999,y:-999},run=true;
function size(){W=c.clientWidth;H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);const n=Math.round(110*FX.i*(W*H)/(1280*800));P=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5}));}
size();addEventListener('resize',size);
c.parentNode.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top;});c.parentNode.addEventListener('pointerleave',()=>{m.x=m.y=-999;});
new IntersectionObserver(([e])=>{run=e.isIntersecting;if(run)requestAnimationFrame(tick);}).observe(c);
function tick(){if(!run)return;x.clearRect(0,0,W,H);
 for(const p of P){if(!FX.R){p.x+=p.vx;p.y+=p.vy;}const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);if(d<140&&d>0){p.x+=dx/d*2;p.y+=dy/d*2;}if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;}
 x.lineWidth=1;for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j],dx=a.x-b.x;if(dx>120||dx<-120)continue;const d=Math.hypot(dx,a.y-b.y);if(d<120){x.strokeStyle='rgba(17,17,19,'+(.3*(1-d/120))+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}}
 x.fillStyle='#111113';for(const p of P){x.beginPath();x.arc(p.x,p.y,1.8,0,6.3);x.fill();}
 if(!FX.R)requestAnimationFrame(tick);}
requestAnimationFrame(tick);`},

 {id:'L47',name:'Text to particles',api:'canvas getImageData sampling',tags:['Canvas','Type'],cost:'Medium',animates:'canvas pixels',
  what:'A word is drawn once to an off-screen canvas and its filled pixels become targets for a cloud of particles, which assemble, hold, then flow into the next word. The pointer pushes them aside.',
  when:'Launch heroes, loading moments and interactive logos.',
  perf:'Sampling happens once per word; the loop moves a couple of thousand points with simple springs. The step size adapts to the screen width.',
  a11y:'The canvas is aria-hidden and the words are in the HTML as a visually hidden heading. Under reduced motion particles snap to the first word and stay.',
  support:'Everywhere.',
  html:`<section class="pt"><canvas aria-hidden="true"></canvas><h1 class="sr">Form, flow, field.</h1><div class="copy"><p class="kicker">Pixels sampled from text</p><p class="lede">Move the pointer through the letters.</p></div></section>`,
  css:`.pt{position:relative;height:100vh;background:#fafafa;overflow:hidden}
.pt canvas{position:absolute;inset:0;width:100%;height:100%}
.copy{position:absolute;left:6vw;bottom:8vh;display:grid;gap:10px}`,
  js:`const c=document.querySelector('canvas'),x=c.getContext('2d'),words=['FORM','FLOW','FIELD'];let W,H,pts=[],targets=[],wi=0,mouse={x:-999,y:-999};
function sample(word){const o=document.createElement('canvas');o.width=W;o.height=H;const g=o.getContext('2d');g.fillStyle='#111113';g.textAlign='center';g.textBaseline='middle';g.font='800 '+Math.min(W/3.8,H/2.4)+'px "Inter",system-ui,sans-serif';g.fillText(word,W/2,H*.45);const d=g.getImageData(0,0,W,H).data,out=[],step=Math.max(5,Math.round(W/200));for(let y=0;y<H;y+=step)for(let X=0;X<W;X+=step)if(d[(y*W+X)*4+3]>128)out.push([X,y]);return out;}
function size(){const d=Math.min(2,devicePixelRatio);W=c.clientWidth;H=c.clientHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);targets=sample(words[wi]);while(pts.length<targets.length)pts.push({x:Math.random()*W,y:Math.random()*H,vx:0,vy:0,h:Math.random()});}
size();addEventListener('resize',size);
c.parentNode.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});c.parentNode.addEventListener('pointerleave',()=>{mouse.x=mouse.y=-999;});
if(!FX.R)setInterval(()=>{wi=(wi+1)%words.length;targets=sample(words[wi]);while(pts.length<targets.length)pts.push({x:W/2,y:H/2,vx:0,vy:0,h:Math.random()});for(const p of pts){p.vx+=(Math.random()-.5)*14*FX.i;p.vy+=(Math.random()-.5)*14*FX.i;}},Math.max(1800,FX.d*3.2));
(function loop(){x.fillStyle='rgba(250,250,250,.32)';x.fillRect(0,0,W,H);pts.forEach((p,i)=>{const t=targets[i%targets.length];if(FX.R){p.x=t[0];p.y=t[1];}else{const k=i<targets.length?.021:.007;p.vx+=(t[0]-p.x)*k;p.vy+=(t[1]-p.y)*k;const dx=p.x-mouse.x,dy=p.y-mouse.y,d2=dx*dx+dy*dy;if(d2<9000){const f=(9000-d2)/9000*3*FX.i;p.vx+=dx/Math.sqrt(d2+1)*f;p.vy+=dy/Math.sqrt(d2+1)*f;}p.vx*=.82;p.vy*=.82;p.x+=p.vx;p.y+=p.vy;}
 x.fillStyle=i<targets.length?'rgba(17,17,19,'+(.5+p.h*.5)+')':'rgba(17,17,19,.14)';x.fillRect(p.x,p.y,2.2,2.2);});requestAnimationFrame(loop);})();`},

 {id:'L43',name:'Noise gradient shader',api:'WebGL · fbm domain warping',tags:['WebGL','Ambient'],cost:'Medium',animates:'GPU fragment shader',
  what:'A slowly flowing colour field made from fractal noise (fbm) warped by itself, rendered by a fragment shader at half resolution. No images, no libraries, about 40 lines.',
  when:'Ambient hero backgrounds for product and AI launches, behind short, strong type.',
  perf:'GPU only, drawn at half resolution and upscaled (the gradient has no hard edges, so it does not show). The loop pauses when the canvas is off screen.',
  a11y:'Decorative (aria-hidden). Under reduced motion one still frame is drawn. A CSS gradient shows if WebGL is missing.',
  support:'WebGL 1: every current browser.',
  html:`<section class="ng"><canvas aria-hidden="true"></canvas><div class="copy"><p class="kicker">Fragment shader · fbm noise</p><h1 class="display">Calm, then<br>colour.</h1><p class="lede">A living background with no images at all.</p></div></section>`,
  css:`.ng{position:relative;height:100vh;overflow:hidden;display:grid;align-content:center;background:linear-gradient(135deg,#eef2ff,#fde7f0 50%,#e6f7f1)}
.ng canvas{position:absolute;inset:0;width:100%;height:100%}
.copy{position:relative;display:grid;gap:18px;padding:0 7vw}.copy .kicker,.copy .lede{color:#3f4249}`,
  js:`const c=document.querySelector('canvas'),gl=c.getContext('webgl');
if(gl){const fs='precision highp float;uniform vec2 r;uniform float t,k;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*1.6;float q=fbm(p+vec2(t*.04,t*.03));float w=fbm(p+q*1.9*k+vec2(-t*.06,t*.05));vec3 col=mix(vec3(.97,.96,1.),vec3(.80,.76,.99),smoothstep(.25,.75,w));col=mix(col,vec3(.72,.90,.98),smoothstep(.45,.9,q));col=mix(col,vec3(1.,.82,.88),smoothstep(.55,.95,w*q*1.7));gl_FragColor=vec4(col,1.);}';
 const sh=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;};
 const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}'));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
 const U=v=>gl.getUniformLocation(pr,v);let run=true,t0=performance.now();
 new IntersectionObserver(([e])=>{run=e.isIntersecting;if(run)requestAnimationFrame(draw);}).observe(c);
 function draw(now){if(!run)return;const s=.5;if(c.width!==Math.round(c.clientWidth*s)){c.width=Math.round(c.clientWidth*s);c.height=Math.round(c.clientHeight*s);gl.viewport(0,0,c.width,c.height);}
  gl.uniform2f(U('r'),c.width,c.height);gl.uniform1f(U('t'),FX.R?12:(now-t0)/1000*(900/FX.d)*2);gl.uniform1f(U('k'),FX.i);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);if(!FX.R)requestAnimationFrame(draw);}
 requestAnimationFrame(draw);}else c.remove();`},

 /* ---------------- Ambient ---------------- */
 {id:'L26',name:'Animated mesh gradient',api:'@property · radial-gradient positions',tags:['Ambient','CSS-first'],cost:'Low',animates:'registered custom properties (background)',
  what:'Four soft colour fields drift across each other in pure CSS. Each position is a registered custom property (@property … <percentage>), so the browser can interpolate it inside the gradients; no blur filters, no canvas.',
  when:'Ambient backgrounds behind type: launch pages, portfolios, pricing headers.',
  perf:'Repaints one background per frame but avoids blur filters, which are the expensive part of most "aurora" effects. Slow it right down; it should feel still at a glance.',
  a11y:'Decorative. Under reduced motion the gradient holds still. Check text contrast against the brightest point of the cycle.',
  support:'@property: Chrome and Edge 85+, Safari 16.4+, Firefox 128+. Older browsers show a static gradient.',
  html:`<section class="mesh"><div class="copy"><p class="kicker">@property --x1 { syntax: "&lt;percentage&gt;" }</p><h1 class="display">Colour that<br>breathes.</h1><p class="lede">Four gradients, eight registered properties, one keyframe.</p></div></section>`,
  css:`@property --x1{syntax:"<percentage>";inherits:false;initial-value:15%}@property --y1{syntax:"<percentage>";inherits:false;initial-value:20%}
@property --x2{syntax:"<percentage>";inherits:false;initial-value:85%}@property --y2{syntax:"<percentage>";inherits:false;initial-value:15%}
@property --x3{syntax:"<percentage>";inherits:false;initial-value:70%}@property --y3{syntax:"<percentage>";inherits:false;initial-value:85%}
@property --x4{syntax:"<percentage>";inherits:false;initial-value:20%}@property --y4{syntax:"<percentage>";inherits:false;initial-value:80%}
.mesh{min-height:100vh;display:grid;align-content:center;padding:0 7vw;color:#111113;
 background:radial-gradient(circle at var(--x1) var(--y1),#c7b8ff 0,transparent calc(42% * var(--fx-intensity))),radial-gradient(circle at var(--x2) var(--y2),#9fd8ff 0,transparent calc(40% * var(--fx-intensity))),radial-gradient(circle at var(--x3) var(--y3),#ffc2d4 0,transparent calc(42% * var(--fx-intensity))),radial-gradient(circle at var(--x4) var(--y4),#ffd9a8 0,transparent calc(36% * var(--fx-intensity))),#fafafa;
 animation:mesh calc(var(--fx-duration)*12) ease-in-out infinite alternate}
@keyframes mesh{50%{--x1:60%;--y1:35%;--x2:30%;--y2:30%;--x3:85%;--y3:55%;--x4:45%;--y4:95%}100%{--x1:80%;--y1:75%;--x2:15%;--y2:70%;--x3:30%;--y3:20%;--x4:75%;--y4:35%}}
.copy{display:grid;gap:18px}.copy .kicker,.copy .lede{color:#3f4249}`,
  js:`/* No JavaScript needed: the motion is a CSS animation of registered custom properties. */`},

 {id:'L44',name:'Film grain overlay',api:'SVG feTurbulence · steps() jitter',tags:['Ambient','CSS-first'],cost:'Low',animates:'background-position (steps)',
  what:'A fine noise texture from an SVG feTurbulence filter, tiled as a background and jittered with a steps() animation so it flickers like film. It breaks up gradient banding and gives flat colour some tooth.',
  when:'Over gradients, dark photographs and flat illustration, at low opacity. Toggle it here to see what it adds.',
  perf:'The noise is generated once into a small tile; the animation only moves a background in a few discrete steps.',
  a11y:'Keep it subtle (opacity under 0.2) so it never competes with text. Under reduced motion the grain stays but does not flicker.',
  support:'Everywhere.',
  html:`<section class="gr"><img class="cover" src="${PH}hands-pottery-wheel.webp" alt="Clay-covered hands raising the wall of a bowl on a wheel, in black and white"><div class="grain" aria-hidden="true"></div><div class="copy"><p class="kicker">feTurbulence tile · animation: grain steps(6)</p><h1 class="display">Give it<br>some tooth.</h1><button class="pill" type="button" id="tg" aria-pressed="true">Grain on</button></div></section>`,
  css:`.gr{position:relative;height:100vh;overflow:hidden;display:grid;align-content:center;background:#0d0f12;color:#fff}
.gr::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(13,15,18,.82),rgba(13,15,18,.15) 75%)}
.grain{position:absolute;inset:-50%;z-index:2;pointer-events:none;opacity:calc(.18*var(--fx-intensity));mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 1.6 -.3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");animation:grain calc(var(--fx-duration)*.9) steps(6) infinite;transition:opacity .4s}
.gr.off .grain{opacity:0}
@keyframes grain{0%{transform:translate(0,0)}20%{transform:translate(-8%,4%)}40%{transform:translate(6%,-6%)}60%{transform:translate(-4%,8%)}80%{transform:translate(8%,2%)}100%{transform:translate(0,0)}}
.copy{position:relative;z-index:3;display:grid;gap:20px;justify-items:start;padding:0 7vw}.copy .kicker{color:rgba(255,255,255,.8)}
:focus-visible{outline-color:#fff}`,
  js:`const g=document.querySelector('.gr'),b=document.getElementById('tg');b.onclick=()=>{const off=g.classList.toggle('off');b.setAttribute('aria-pressed',String(!off));b.textContent=off?'Grain off':'Grain on';};`},

 /* ---------------- Media ---------------- */
 {id:'L14',name:'Moving background, done right',api:'canvas · IntersectionObserver · prefers-reduced-motion · Save-Data',tags:['Ambient','WebGL','Accessibility'],cost:'Medium',animates:'GPU fragment shader',
  what:'A full-bleed moving backdrop behind the hero, with everything that makes it polite: drawn in code, so it is sharp at any size and costs no download; a CSS gradient for the first paint and for browsers without WebGL; a real pause button; one still frame instead of motion under reduced motion or Save-Data; and no drawing at all while it is off screen. A background video needs the same manners: muted, playsinline, a poster, and the same pause rules.',
  when:'Brand and product heroes where slow movement says more than a still. Keep it slow and low in contrast, so the headline stays the subject.',
  perf:'Draws only while the hero is on screen, at a pixel ratio capped at 2, and downloads nothing. The fragment shader is two passes of three-octave noise per pixel, which integrated graphics handle comfortably.',
  a11y:'A visible pause control (WCAG 2.2.2). Under reduced motion and Save-Data it holds one still frame and offers a play button instead. The canvas is decorative (aria-hidden), so the headline carries the message.',
  support:'WebGL 1: every current browser. The CSS gradient is the fallback.',
  html:`<section class="bv"><canvas class="cover" aria-hidden="true"></canvas><div class="shade"></div><div class="copy"><p class="kicker" id="state">Starting…</p><h1 class="display">Set the<br>scene.</h1><p class="lede">Drawn live, paused off screen, with a real pause button.</p></div><button class="pill pp" type="button" aria-pressed="false">Pause motion</button></section>${END('Then get to the point.')}`,
  css:`.bv{position:relative;height:100vh;overflow:hidden;display:grid;align-content:end;background:#fbf7f2}
.shade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(251,247,242,.72),rgba(251,247,242,0) 55%)}
.copy{position:relative;display:grid;gap:18px;padding:0 6vw 12vh}.copy .kicker{color:#4b4f57}
.pp{position:absolute;right:24px;bottom:24px}`,
  js:`${FLOW}
const hero=document.querySelector('.bv'),pp=hero.querySelector('.pp'),st=document.getElementById('state');
let wants=!(FX.R||navigator.connection?.saveData),visible=true;
const bg=flowField(hero.querySelector('canvas'),{colors:['#fbf7f2','#f4d8c2','#d6e3f6','#f7e6b5'],autoplay:wants,warp:Math.min(1.5,FX.i),speed:900/FX.d});
const sync=()=>{pp.hidden=!bg.ok;pp.textContent=wants?'Pause motion':'Play motion';pp.setAttribute('aria-pressed',String(!wants));
 st.textContent=!bg.ok?'No WebGL here: showing the CSS gradient':wants?(visible?'Playing':'Paused while off screen'):FX.R?'Reduced motion: one still frame until you press play':navigator.connection?.saveData?'Save-Data: one still frame until you press play':'Paused';};
pp.onclick=()=>{wants=!wants;wants?bg.play():bg.pause();sync();};
new IntersectionObserver(es=>{visible=es[es.length-1].intersectionRatio>=.01;sync();},{threshold:[0,.01]}).observe(hero);sync();`},

 {id:'L34',name:'Hover-to-play previews',api:'pictures fetched on demand · (hover: hover)',tags:['Media','Pointer'],cost:'Low',animates:'opacity, transform; pictures on demand',
  what:'Cards show one still until you hover or focus them; then the rest of that card\'s pictures are fetched and play as a short sequence, with a progress line, and it rewinds to the cover when you leave. On touch, a tap toggles it. A video preview works the same way: create the element on first hover, play it, and pause it on leave.',
  when:'Product galleries, case-study grids and libraries where each card has more to show than its cover.',
  perf:'Nothing beyond the cover is downloaded until it is wanted, and only one card plays at a time. Size the pictures to the card.',
  a11y:'Cards are buttons, so keyboard focus plays the sequence too. Under reduced motion nothing plays on hover; the cover stays.',
  support:'Everywhere. (hover: hover) separates mouse from touch.',
  html:`<section class="hf"><div class="grid">${[['Coffee',['drink-coffee-day','drink-blue-coffee-cup','drink-frothy-coffee-in-a-green-cup'],'Coffee in a white cup and saucer'],['Bakery',['bakery-mink-mingle-2017','bakery-fresh-bread-and-butter','bakery-the-bakery'],'Trays of croissants and pain au chocolat'],['Pottery',['hands-making-pottery','hands-mud-games','hands-pottery-wheel'],'Hands pressing into clay on a wheel, seen from above'],['City nights',['city-city-from-docks-at-night','city-flatiron-at-night','city-city-night-lights'],'A city skyline across dark water at dusk'],['Mountains',['nature-alpine-landscape','nature-mountain-lake','nature-colorful-landscape-with-a-snow'],'Snowy peaks behind a dark ridge'],['Studio',['podcast-elegant-steel-microphone','podcast-microphone','podcast-kai-oberh-user-2016-02-26'],'A vintage ribbed steel microphone against a dark background']].map(([t,s,a])=>`<button class="card" type="button" data-s="${s.join(',')}"><img src="${PH}${s[0]}.webp" alt="${a}"><span class="ticks" aria-hidden="true">${s.map(()=>'<i></i>').join('')}</span><b>${t}</b></button>`).join('')}</div><p class="kicker hint">Hover or focus a card · tap on touch</p></section>`,
  css:`.hf{height:100vh;display:grid;grid-template-rows:1fr auto;gap:10px;padding:12px;background:#fafafa}
.grid{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);gap:12px;min-height:0}
.card{all:unset;position:relative;cursor:pointer;border-radius:16px;overflow:hidden;background:#ececee;transition:transform var(--fx-duration) var(--fx-ease)}
.card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.card img+img{opacity:0;transition:opacity calc(var(--fx-duration)*.5) ease}.card img.on{opacity:1}
.card.on{transform:scale(calc(1 + .02*var(--fx-intensity)));z-index:1}
.ticks{position:absolute;z-index:1;left:14px;right:14px;top:12px;display:flex;gap:4px;opacity:0;transition:opacity .3s}.card.on .ticks{opacity:1}
.ticks i{flex:1;height:2px;border-radius:2px;background:rgba(255,255,255,.45)}.ticks i.on{background:#fff}
.card b{position:absolute;z-index:1;left:12px;bottom:12px;padding:7px 12px;border-radius:999px;background:#fff;font:500 13px/1.05 "Inter",system-ui,sans-serif;color:#111113}
.card:focus-visible{outline:2px solid #111113;outline-offset:3px}
.hint{padding:4px 8px}
@media(max-width:720px){.hf{height:auto}.grid{grid-template-columns:1fr 1fr;grid-template-rows:none;grid-auto-rows:40vw}}`,
  js:`const PHOTOS='${PH}',fine=matchMedia('(hover:hover)').matches,STEP=Math.max(500,FX.d*1.2);let stop=null;
document.querySelectorAll('.card').forEach(c=>{const names=c.dataset.s.split(','),ticks=[...c.querySelectorAll('.ticks i')];let frames=null,i=0,timer=0;
 const show=k=>{i=k;frames.forEach((im,j)=>im.classList.toggle('on',j===k));ticks.forEach((t,j)=>t.classList.toggle('on',j<=k));};
 const off=()=>{if(!c.classList.contains('on'))return;c.classList.remove('on');clearInterval(timer);show(0);stop=null;};
 const on=()=>{if(FX.R||c.classList.contains('on'))return;if(stop)stop();
  if(!frames){frames=[c.querySelector('img')];                                 /* the other pictures are requested only now */
   names.slice(1).forEach(n=>{const im=new Image();im.alt='';im.src=PHOTOS+n+'.webp';frames[frames.length-1].after(im);frames.push(im);});}
  c.classList.add('on');show(0);stop=off;
  timer=setInterval(()=>{const k=(i+1)%frames.length;if(frames[k].complete)show(k);},STEP);};
 if(fine){c.addEventListener('pointerenter',on);c.addEventListener('pointerleave',off);}else c.addEventListener('click',()=>c.classList.contains('on')?off():on());
 c.addEventListener('focus',on);c.addEventListener('blur',off);});`},

 {id:'L45',name:'Blur-up image loading',api:'inline LQIP · img.decode() · filter: blur',tags:['Media','Reveal'],cost:'Very low',animates:'opacity, filter',
  what:'Each picture starts as a 20-pixel placeholder (well under a kilobyte, inlined in the HTML) scaled up and blurred, so the layout and colour are there at once. When the real picture has decoded it fades in sharply on top.',
  when:'Any image-heavy page: galleries, articles, product grids. It turns a slow connection into a calm one.',
  perf:'Placeholders cost nothing to fetch. img.decode() avoids a half-painted frame. The demo adds artificial network delays so you can see it; remove them in real use.',
  a11y:'The real image carries the alt text from the start. Under reduced motion it swaps without the fade.',
  support:'Everywhere.',
  html:`<section class="bu"><header><p class="kicker">20 px placeholder → decoded image</p><h1>Calm on a slow line.</h1><button class="pill" type="button" id="again">Load again</button></header><div class="grid">${[['wedding-aisle-for-a-wedding','UklGRpACAABXRUJQVlA4WAoAAAAgAAAAEwAADAAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggogAAAHAEAJ0BKhQADQA+tUieSackIqEwCADgFolkAJ0ygxgDSMXOM2VuX/rKqV5QAP7iDw3krWe4f5l5wteX9VBIbOpurSjL6m69nRVayZEBbrEkco/ItW2cp+sztiOxGa19FlbCL4JTlPNWCE7mw/GiZ1xpt3r6f/8Sm1is/q53pOjVsW1FitgvVd6hRhW/DY6caZ+vaChiSy2vogNhTw7rroAAAA==','Flower arrangements lining an outdoor wedding aisle of gilt chairs'],['wedding-bridal-chair','UklGRoICAABXRUJQVlA4WAoAAAAgAAAAEwAADAAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgglAAAALAEAJ0BKhQADQA+tUieSackIqEwCADgFolqAJ0yhHcmgeH+Ak8YDeJvC5gZTgAA/tgXLKRqtMuzf6vEu5TrI/gV9CRM2PqkRiZkZtjy1RH1CNPOW5E3QM+3jHwpIKN/Sn6qofcckRX2yI3ZYWxJmCxegD1baJZ35j9IWCly1P1XOLoLRjgM9N5hs+ur272swFgAAAA=','Studded sandals, a bouquet and a red book on a woven chair'],['wedding-bujenka-poland','UklGRmACAABXRUJQVlA4WAoAAAAgAAAAEwAADAAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggcgAAADAEAJ0BKhQADQA+tUieSackIqEwCADgFoljAKwAIgs1KsPJdk4aHJh3gAD+g/N4+6wTwc7hb8CWDLlsHM26YaR3Y3mvdo5wDmYWqEXqMBwSErHhh+dYY4dgFBODH7o4SG+FwJ7ium/eKKe0uWlHSoAAAA==','A couple embracing, a bouquet of pink roses between them'],['wedding-groom-holds-bride-s-hand','UklGRmYCAABXRUJQVlA4WAoAAAAgAAAAEwAADAAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggeAAAAPADAJ0BKhQADQA+tUieSackIqEwCADgFolAE6ADpM1ewNb/9065OWgA/oHiVfaruBOhYFQnfSSoRcsNIu9xnE5I9rRu+bgiNo0BfSPv5islxPCeBa0XIe7MsuvsMJf9YMttVGEFaYHeheQ3z958d1KpbnFLWfAAAA==','Two clasped hands, one wearing a wedding ring'],['wedding-32','UklGRkwCAABXRUJQVlA4WAoAAAAgAAAAEwAADAAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggXgAAANADAJ0BKhQADQA+tUieSackIqEwCADgFollAABhyHTHkVkMld5SXAD+4Ms5vSczmu+T1/YS3OCco3Kr20+GproQ/Dky9qALTdeNXLufaojgn8Jo/ecHKCkWDmBcAAA=','A bride\'s hands with rings, resting on white lace'],['wedding-church-on-the-morning-of-the-w','UklGRnACAABXRUJQVlA4WAoAAAAgAAAAEwAADAAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggggAAALADAJ0BKhQADQA+tUieSackIqEwCADgFolnAAA482NAOPj0xj+AAP71z8JRUd/2LQ2tsL6+c9prdCKxV4NfV0eVjmbiWFKtuTqxWOGWTH5IdjNm4qGr87ey2ElrniD/L8WM/dYXYswpn9ZOh9JQQHdPlpW/+utZOcZfV+g9Rk9AAAA=','A bouquet tied to the end of a dark church pew']].map(([n,b,a])=>`<figure class="ph" style="background-image:url(data:image/webp;base64,${b})"><img data-src="${PH}${n}.webp" alt="${a}"></figure>`).join('')}</div></section>`,
  css:`.bu{height:100vh;display:grid;grid-template-rows:auto 1fr;gap:16px;padding:22px 26px;background:#fafafa}
.bu header{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:12px}.bu h1{font-size:clamp(28px,3.2vw,44px)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);gap:12px;min-height:0}
.ph{position:relative;margin:0;border-radius:14px;overflow:hidden;background-size:cover;background-position:center}
.ph::before{content:"";position:absolute;inset:0;backdrop-filter:blur(calc(18px*var(--fx-intensity)));transform:scale(1.1)}
.ph img{position:relative;width:100%;height:100%;object-fit:cover;opacity:0;filter:blur(calc(14px*var(--fx-intensity)));transform:scale(1.04);transition:opacity var(--fx-duration) var(--fx-ease),filter var(--fx-duration) var(--fx-ease),transform var(--fx-duration) var(--fx-ease)}
.ph img.ready{opacity:1;filter:none;transform:none}
@media(max-width:720px){.bu{height:auto}.grid{grid-template-columns:1fr 1fr;grid-auto-rows:44vw}}`,
  js:`/* Demo only: SLOW adds a fake network delay so the placeholder is visible. Remove it in real use. */
const SLOW=()=>500+Math.random()*1600;
function load(){document.querySelectorAll('.ph img').forEach(img=>{img.classList.remove('ready');const src=img.dataset.src+'?r='+Math.random().toString(36).slice(2,7);
 setTimeout(()=>{const pre=new Image();pre.src=src;pre.decode().catch(()=>{}).then(()=>{img.src=src;img.classList.add('ready');});},SLOW());});}
load();document.getElementById('again').onclick=load;`},

 /* ---------------- Accessibility ---------------- */
 {id:'L46',name:'Reduced-motion strategies',api:'@media (prefers-reduced-motion) · motion as a multiplier',tags:['Accessibility','CSS-first'],cost:'Very low',animates:'transform, opacity',
  what:'The same hero twice: full motion on the left, reduced on the right. Instead of switching animations off, every travel distance is multiplied by a --motion variable that the media query sets to 0, so fades and colour still communicate while nothing moves across the screen. The moving backdrop becomes one still frame with a play button.',
  when:'Every page with motion. This is the pattern behind the "Reduced motion" switch on every technique in this library.',
  perf:'Free: the same animations run, just with zero distance; the reduced side draws its backdrop once instead of every frame.',
  a11y:'Respects the operating system setting, keeps meaning (state changes still fade), and never removes controls. Test with the setting on: nothing should slide, zoom, spin or parallax.',
  support:'prefers-reduced-motion: every current browser.',
  html:`<section class="rm-demo">${[['Full motion',''],['Reduced motion','rm']].map(([t,c])=>`<div class="side ${c}"><p class="kicker">${t}${c?' · --motion: 0':' · --motion: 1'}</p><div class="hero"><canvas class="cover" aria-hidden="true"></canvas><div class="float a"><img src="${PH}products-burning-prayer-candles-640.webp" alt="Rows of small candles burning in red and blue glass holders"></div><div class="float b"><img src="${PH}products-diy-candles-640.webp" alt="Amber glass jars and bottles on a blue box"></div><h2 class="in">Same page,<br>calmer.</h2><button class="pill solid play" type="button" hidden>Play motion</button></div></div>`).join('')}</section>`,
  css:`:root{--motion:1}
@media (prefers-reduced-motion:reduce){:root{--motion:0}}
.rm{--motion:0}
.rm-demo{height:100vh;display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px;background:#fafafa}
.side{display:grid;grid-template-rows:auto 1fr;gap:10px;min-height:0}.side .kicker{padding:6px 8px}
.hero{position:relative;border-radius:16px;overflow:hidden;display:grid;align-content:end;padding:6%;background:#f6efe8}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(250,247,243,.8),rgba(250,247,243,0) 55%);pointer-events:none}
.float{position:absolute;width:30%;aspect-ratio:3/4;border-radius:12px;overflow:hidden;box-shadow:0 16px 32px -24px rgba(17,17,19,.5);z-index:1;animation:float calc(var(--fx-duration)*5) ease-in-out infinite alternate}
.float img{width:100%;height:100%;object-fit:cover}.float.a{right:8%;top:10%}.float.b{right:34%;top:30%;width:22%;animation-delay:-2s}
@keyframes float{from{transform:translate(0,calc(var(--motion)*-30px*var(--fx-intensity))) rotate(calc(var(--motion)*-4deg))}to{transform:translate(0,calc(var(--motion)*30px*var(--fx-intensity))) rotate(calc(var(--motion)*4deg))}}
.in{position:relative;z-index:2;font-size:clamp(32px,4.4vw,64px);animation:in calc(var(--fx-duration)*1.4) var(--fx-ease) both}
@keyframes in{from{opacity:0;transform:translateY(calc(var(--motion)*80px))}}
.play{position:relative;z-index:2;justify-self:start;margin-top:16px}
@media(max-width:720px){.rm-demo{grid-template-columns:1fr;height:auto}.hero{min-height:70vh}}`,
  js:`${FLOW}
const sysReduce=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.side').forEach(side=>{const b=side.querySelector('.play');
 const calm=()=>side.classList.contains('rm')||sysReduce.matches||FX.R;
 const bg=flowField(side.querySelector('canvas'),{colors:['#f6efe8','#f0cfb8','#cfdcf2','#f5e2ad'],autoplay:!calm(),speed:900/FX.d});
 function apply(){if(calm()){bg.pause();b.hidden=!bg.ok;b.textContent='Play motion';}else{b.hidden=true;bg.play();}}
 b.onclick=()=>{if(bg.playing){bg.pause();b.textContent='Play motion';}else{bg.play();b.textContent='Pause motion';}};
 sysReduce.addEventListener('change',apply);apply();});
/* Replay the entrance every few seconds so the two sides can be compared. Not needed in real use. */
setInterval(()=>document.querySelectorAll('.in').forEach(h=>{h.style.animation='none';void h.offsetWidth;h.style.animation='';}),FX.d*5);`},
 ];

 /* Some scripts declare a path constant after first use in the template above; keep declarations first. */
 return T;
})();
