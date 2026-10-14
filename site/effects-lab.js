'use strict';
/* Landing effects lab (#effects).
   30 effects you scroll for real: each one is a self-contained page (HTML + CSS + JS) that
   runs inside a full-screen preview frame. The same strings are what "Get the code" exports,
   so the code always matches the preview. Controls feed CSS variables into the page:
   --fx-intensity, --fx-duration and --fx-ease; "Reduced motion" adds .reduce to <html>. */
(()=>{
 const IMG='assets/fx/';
 const BASE_CSS=`*{box-sizing:border-box}
body{margin:0;font-family:"Manrope",system-ui,sans-serif;background:#f2f4f7;color:#0d1220;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:300;letter-spacing:-.02em;line-height:.95;margin:0}
p{margin:0}
img{display:block;max-width:100%}
.wrap{max-width:1120px;margin:0 auto;padding:0 6vw}
.kicker{font:500 11px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;color:#4a5466}
.lede{font-size:clamp(16px,1.4vw,19px);line-height:1.6;color:#4a5466;max-width:38ch}
.spacer{height:55vh;display:grid;place-items:center;font:500 11px "JetBrains Mono",ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;color:#7a8596}
.end{min-height:70vh;display:grid;place-content:center;gap:14px;text-align:center;padding:10vh 6vw}
.end h2{font-size:clamp(36px,5vw,64px)}
html.reduce *,html.reduce *::before,html.reduce *::after{animation:none!important;transition:none!important}`;
 const BASE_JS=`const FX=(()=>{const cs=getComputedStyle(document.documentElement);const n=(v,d)=>{const x=parseFloat(cs.getPropertyValue(v));return isNaN(x)?d:x;};return {i:n('--fx-intensity',1),d:n('--fx-duration',900),R:document.documentElement.classList.contains('reduce')||matchMedia('(prefers-reduced-motion: reduce)').matches,clamp:(v,a,b)=>Math.min(b,Math.max(a,v)),progress(el){const r=el.getBoundingClientRect();return FX.clamp(-r.top/Math.max(1,el.offsetHeight-innerHeight),0,1);}};})();`;
 const END=t=>`<section class="end"><p class="kicker">End of preview</p><h2>${t}</h2></section>`;

 const E=[
 {id:'L01',name:'Layered parallax',tags:['Scroll'],perf:['transform','Low'],about:'Background, image and headline move at different speeds, so a flat page reads as depth. Keep the speed differences small: big gaps feel seasick.',
  html:`<section class="px"><div class="layer sky"></div><img class="layer far" src="${IMG}castle.webp" alt=""><div class="layer veil"></div><div class="layer near"><p class="kicker" style="color:#dbe4f3">Plate 01 · Parallax</p><h1>Find your<br>quiet wild.</h1><p class="lede" style="color:#dbe4f3">Three layers, three speeds. Scroll slowly.</p></div></section><div class="spacer">Keep scrolling</div>${END('Depth without a 3D engine.')}`,
  css:`.px{position:relative;height:130vh;overflow:hidden;background:#0d1220}
.layer{position:absolute;inset:0;will-change:transform}
.sky{background:linear-gradient(#1b2f4d,#e7a76c)}
.far{width:100%;height:115%;object-fit:cover;opacity:.9}
.veil{background:linear-gradient(transparent 40%,#0d1220 95%)}
.near{display:grid;align-content:center;gap:18px;padding:0 8vw;color:#fff}
.near h1{font-size:clamp(52px,10vw,140px)}`,
  js:`const layers=[['.sky',.1],['.far',.32],['.near',.62]].map(([s,k])=>[document.querySelector(s),k]);
function draw(){const y=scrollY;for(const [el,k] of layers)el.style.transform='translate3d(0,'+(y*k*FX.i)+'px,0)';}
if(!FX.R){addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});draw();}`},

 {id:'L02',name:'Sticky storytelling',tags:['Scroll','Reveal'],perf:['opacity, transform','Low'],about:'The picture stays put while the story scrolls past it, and each chapter swaps the image. Good for product tours and case studies.',
  html:`<section class="story wrap"><div class="visual"><img src="${IMG}lake.webp" alt="" class="on"><img src="${IMG}lighthouse.webp" alt=""><img src="${IMG}deer.webp" alt=""><img src="${IMG}coast.webp" alt=""></div><div class="steps"><article><span class="kicker">Chapter 01</span><h2>Start with a place.</h2><p class="lede">A still lake sets the tone: calm, cool, and open.</p></article><article><span class="kicker">Chapter 02</span><h2>Add a little weather.</h2><p class="lede">Tension arrives as the light turns and the sea rises.</p></article><article><span class="kicker">Chapter 03</span><h2>Let something live there.</h2><p class="lede">A subject gives the eye somewhere to rest.</p></article><article><span class="kicker">Chapter 04</span><h2>Then open the view.</h2><p class="lede">End wide, warm and specific.</p></article></div></section>${END('One picture, four chapters.')}`,
  css:`.story{display:grid;grid-template-columns:1.1fr 1fr;gap:6vw;padding-top:8vh}
.visual{position:sticky;top:8vh;height:84vh;border-radius:18px;overflow:hidden;background:#0d1220}
.visual img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(calc(1 + .08*var(--fx-intensity)));transition:opacity var(--fx-duration) var(--fx-ease),transform calc(var(--fx-duration)*1.8) var(--fx-ease)}
.visual img.on{opacity:1;transform:none}
.steps article{min-height:92vh;display:grid;align-content:center;gap:14px}
.steps h2{font-size:clamp(34px,4.4vw,60px)}
@media(max-width:720px){.story{grid-template-columns:1fr}.visual{top:0;height:46vh;z-index:0}.steps article{min-height:70vh;background:linear-gradient(transparent,#f2f4f7 30%);position:relative;padding-top:20vh}}`,
  js:`const imgs=[...document.querySelectorAll('.visual img')];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=[...document.querySelectorAll('.steps article')].indexOf(e.target);imgs.forEach((im,k)=>im.classList.toggle('on',k===i));}}),{threshold:.55});
document.querySelectorAll('.steps article').forEach(a=>io.observe(a));`},

 {id:'L03',name:'Horizontal gallery',tags:['Scroll','Media'],perf:['transform','Low'],about:'Vertical scrolling drives a horizontal strip of images, pinned in place. Keep it to one strip per page and make sure it still reads on a phone.',
  html:`<section class="intro wrap"><p class="kicker">Material studies</p><h1>Twelve materials,<br>one direction.</h1></section><section class="hz"><div class="pin"><div class="track">${['amber','mercury','lattice','fluid','origami','cymatics','moire','smoke'].map((n,i)=>`<figure><img src="${IMG}${n}.webp" alt=""><figcaption><span class="kicker">0${i+1}</span>${n[0].toUpperCase()+n.slice(1)}</figcaption></figure>`).join('')}</div></div></section>${END('Back to vertical.')}`,
  css:`.intro{padding:16vh 6vw 8vh}.intro h1{font-size:clamp(46px,7vw,100px)}
.hz{position:relative}
.pin{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;align-items:center}
.track{display:flex;gap:3vw;padding:0 6vw;will-change:transform}
.track figure{margin:0;flex:0 0 min(42vw,520px)}
.track img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:14px}
.track figcaption{display:flex;gap:12px;align-items:baseline;margin-top:12px;font:400 26px "Cormorant Garamond",serif}
@media(max-width:720px){.track figure{flex-basis:76vw}}`,
  js:`const sec=document.querySelector('.hz'),track=document.querySelector('.track');
function size(){sec.style.height=(track.scrollWidth-innerWidth+innerHeight)+'px';}
function draw(){const max=track.scrollWidth-innerWidth;track.style.transform='translate3d('+(-FX.progress(sec)*max)+'px,0,0)';}
size();addEventListener('resize',()=>{size();draw();});
addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});draw();`},

 {id:'L04',name:'Image mask reveals',tags:['Reveal','Media'],perf:['clip-path, transform','Low'],about:'Images uncover themselves with a clipping mask as they enter. One direction for the whole page keeps it calm.',
  html:`<section class="wrap grid">${[['nebula','Nebula'],['tree','Fractal tree'],['bird','Field notes'],['owl','Night study']].map(([n,t],i)=>`<figure class="m m${i%2}"><div class="mask"><img src="${IMG}${n}.webp" alt=""></div><figcaption><span class="kicker">0${i+1}</span><h2>${t}</h2></figcaption></figure>`).join('')}</section>${END('Seen, then shown.')}`,
  css:`.grid{display:grid;grid-template-columns:1fr 1fr;gap:10vh 5vw;padding:14vh 6vw}
.m1{margin-top:22vh}
.mask{overflow:hidden;border-radius:14px;clip-path:inset(100% 0 0 0);transition:clip-path var(--fx-duration) var(--fx-ease)}
.mask img{width:100%;aspect-ratio:4/5;object-fit:cover;transform:scale(calc(1 + .25*var(--fx-intensity)));transition:transform calc(var(--fx-duration)*1.6) var(--fx-ease)}
figure{margin:0}figcaption{display:grid;gap:8px;margin-top:16px;opacity:0;transform:translateY(16px);transition:all var(--fx-duration) var(--fx-ease) calc(var(--fx-duration)*.3)}
figcaption h2{font-size:clamp(28px,3vw,42px)}
.in .mask{clip-path:inset(0)}.in .mask img{transform:none}.in figcaption{opacity:1;transform:none}
@media(max-width:720px){.grid{grid-template-columns:1fr}.m1{margin-top:0}}`,
  js:`const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.25});
document.querySelectorAll('.m').forEach(m=>FX.R?m.classList.add('in'):io.observe(m));`},

 {id:'L05',name:'Text scramble',tags:['Reveal','Type'],perf:['text only','Low'],about:'Headlines decode from random glyphs into words. Fun for technical or archival brands; keep it to one headline and always show the final text to screen readers.',
  html:`<section class="hero"><p class="kicker">Signal acquired</p><h1 class="scr" data-text="MAKE IT MOVE" aria-label="Make it move">MAKE IT MOVE</h1><p class="lede">Characters settle left to right.</p><button type="button" id="again">Decode again</button></section><div class="spacer">Scroll</div><section class="hero"><h1 class="scr" data-text="SIGNAL / NOISE" aria-label="Signal / noise">SIGNAL / NOISE</h1></section>${END('Decoded.')}`,
  css:`.hero{min-height:90vh;display:grid;place-content:center;justify-items:center;gap:22px;text-align:center;background:#0b0f0b;color:#c6ffc6}
.hero .kicker,.hero .lede{color:#7fbf7f}
.scr{font:400 clamp(44px,9vw,128px)/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:-.04em}
button{font:600 13px "Manrope",sans-serif;padding:12px 20px;border-radius:999px;border:1px solid #39ff14;background:none;color:#c6ffc6;cursor:pointer}`,
  js:`const glyphs='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*';
function decode(el){const text=el.dataset.text;if(FX.R){el.textContent=text;return;}const start=performance.now(),dur=FX.d*1.8;
 (function frame(now){const p=Math.min(1,(now-start)/dur);let out='';for(let i=0;i<text.length;i++){const settle=i/text.length;out+=text[i]===' '||p>settle+.15*FX.i?text[i]:glyphs[Math.floor(Math.random()*glyphs.length)];}el.textContent=out;if(p<1)requestAnimationFrame(frame);else el.textContent=text;})(start);}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){decode(e.target);io.unobserve(e.target);}}),{threshold:.6});
document.querySelectorAll('.scr').forEach(el=>io.observe(el));
document.getElementById('again').onclick=()=>decode(document.querySelector('.scr'));`},

 {id:'L06',name:'Kinetic hero typography',tags:['Scroll','Type'],perf:['transform','Low'],about:'Big lines of type slide against each other as you scroll. Works best with a condensed or high-contrast face and very few words.',
  html:`<section class="kin"><div class="lines"><h1 data-dir="1">MOVE WITH</h1><h1 data-dir="-1" class="out">INTENT · INTENT</h1><h1 data-dir="1">AND CARE.</h1></div></section>${END('Type that travels.')}`,
  css:`.kin{height:220vh;background:#e9e3f5}
.lines{position:sticky;top:0;height:100vh;display:grid;align-content:center;overflow:hidden}
.lines h1{font:800 clamp(64px,15vw,220px)/.86 "Archivo","Arial Narrow",sans-serif;letter-spacing:-.05em;white-space:nowrap;will-change:transform;color:#1c1433}
.lines .out{color:transparent;-webkit-text-stroke:2px #7c3aed}`,
  js:`const sec=document.querySelector('.kin'),lines=[...document.querySelectorAll('.lines h1')];
function draw(){const p=FX.progress(sec);lines.forEach((l,i)=>{l.style.transform='translate3d('+((p-.5)*40*FX.i*l.dataset.dir)+'vw,0,0)';});}
if(!FX.R){addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});}draw();`,
  extraHead:'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@800&display=swap">'},

 {id:'L07',name:'Scroll progress landmarks',tags:['Scroll','Navigation'],perf:['transform','Low'],about:'A progress line and chapter markers tell people where they are in a long page and let them jump. Markers are real links.',
  html:`<header class="bar"><i></i></header><nav class="dots" aria-label="Chapters">${['Brief','Direction','Assets','Review'].map((t,i)=>`<a href="#c${i}"><span>${t}</span></a>`).join('')}</nav>${['Brief','Direction','Assets','Review'].map((t,i)=>`<section id="c${i}" class="ch"><p class="kicker">Chapter 0${i+1}</p><h2>${t}.</h2><p class="lede">Long-form pages need landmarks. This marker lights up while you read it.</p></section>`).join('')}`,
  css:`.bar{position:fixed;top:0;left:0;right:0;height:4px;z-index:5;background:#e3e7ee}
.bar i{display:block;height:100%;background:linear-gradient(90deg,#0369a1,#047857,#be123c);transform-origin:left;transform:scaleX(0)}
.dots{position:fixed;right:24px;top:50%;transform:translateY(-50%);display:grid;gap:14px;z-index:5}
.dots a{display:flex;align-items:center;justify-content:flex-end;gap:10px;text-decoration:none;color:#4a5466;font:500 11px "JetBrains Mono",monospace;letter-spacing:.12em;text-transform:uppercase}
.dots a::after{content:"";width:10px;height:10px;border-radius:50%;border:1.5px solid currentColor;transition:all .3s}
.dots a.on{color:#0d1220}.dots a.on::after{background:#0369a1;border-color:#0369a1;transform:scale(1.3)}
.dots span{opacity:0;transform:translateX(6px);transition:all .3s}.dots a:hover span,.dots a.on span,.dots a:focus-visible span{opacity:1;transform:none}
.ch{min-height:100vh;display:grid;align-content:center;gap:16px;padding:0 12vw}
.ch:nth-child(odd){background:#fff}.ch h2{font-size:clamp(48px,7vw,96px)}`,
  js:`const bar=document.querySelector('.bar i'),links=[...document.querySelectorAll('.dots a')];
addEventListener('scroll',()=>requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(scrollY/max)+')';}),{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.hash==='#'+e.target.id));}),{threshold:.5});
document.querySelectorAll('.ch').forEach(s=>io.observe(s));
links.forEach(a=>a.onclick=e=>{e.preventDefault();document.querySelector(a.hash).scrollIntoView({behavior:FX.R?'auto':'smooth'});});`},

 {id:'L08',name:'3D card tilt',tags:['Pointer'],perf:['transform','Low'],about:'Cards lean toward the pointer with a soft glare. Cap the angle; anything over about 12 degrees looks broken.',
  html:`<section class="wrap tilt-wrap"><p class="kicker">Hover or touch a card</p><h1>Small moves,<br>big character.</h1><div class="cards">${[['amber','Amber'],['mercury','Mercury'],['lattice','Crystal']].map(([n,t])=>`<a class="card" href="#" tabindex="0"><img src="${IMG}${n}.webp" alt=""><span class="glare"></span><b>${t}</b></a>`).join('')}</div></section>`,
  css:`.tilt-wrap{min-height:100vh;display:grid;align-content:center;gap:24px;padding:10vh 6vw}
.tilt-wrap h1{font-size:clamp(44px,6vw,84px)}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:3vw;perspective:900px}
.card{position:relative;display:block;border-radius:18px;overflow:hidden;transform-style:preserve-3d;transition:transform .2s ease-out,box-shadow .3s;box-shadow:0 20px 40px -24px rgba(13,18,32,.5);color:#fff;text-decoration:none}
.card img{width:100%;aspect-ratio:3/4;object-fit:cover}
.card b{position:absolute;left:18px;bottom:16px;font:400 30px "Cormorant Garamond",serif;transform:translateZ(40px)}
.glare{position:absolute;inset:0;background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.45),transparent 50%);opacity:0;transition:opacity .3s;pointer-events:none}
.card:hover .glare{opacity:1}
.card:focus-visible{outline:3px solid #0369a1;outline-offset:4px;transform:translateY(-6px)}
@media(max-width:720px){.cards{grid-template-columns:1fr 1fr}}`,
  js:`const max=12*FX.i;
document.querySelectorAll('.card').forEach(c=>{if(FX.R)return;
 c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.transform='rotateY('+((x-.5)*max)+'deg) rotateX('+((.5-y)*max)+'deg) translateZ(0)';c.style.setProperty('--gx',x*100+'%');c.style.setProperty('--gy',y*100+'%');});
 c.addEventListener('pointerleave',()=>{c.style.transform='';});
 c.addEventListener('click',e=>e.preventDefault());});`},

 {id:'L09',name:'Magnetic calls to action',tags:['Pointer'],perf:['transform','Low'],about:'Buttons lean toward a nearby pointer and the label follows a little further. Use on one or two key actions only.',
  html:`<section class="mag"><p class="kicker">Bring the pointer close</p><h1>Follow<br>your curiosity.</h1><div class="btns"><button class="magnet primary"><span>Explore the work</span></button><button class="magnet"><span>Book a call</span></button></div></section>`,
  css:`.mag{min-height:100vh;display:grid;place-content:center;justify-items:center;gap:28px;text-align:center;background:#c2410c;color:#fff4ea}
.mag .kicker{color:#ffd9bf}.mag h1{font-size:clamp(52px,8vw,120px)}
.btns{display:flex;gap:18px;flex-wrap:wrap;justify-content:center}
.magnet{font:600 15px "Manrope",sans-serif;padding:18px 30px;border-radius:999px;border:1.5px solid #fff4ea;background:transparent;color:#fff4ea;cursor:pointer;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.magnet span{display:inline-block;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.magnet.primary{background:#fff4ea;color:#c2410c}
.magnet:focus-visible{outline:3px solid #fff;outline-offset:4px}`,
  js:`const radius=140,pull=.35*FX.i;
document.querySelectorAll('.magnet').forEach(b=>{if(FX.R)return;const label=b.querySelector('span');
 addEventListener('pointermove',e=>{const r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,d=Math.hypot(dx,dy);
  if(d<radius+r.width/2){b.style.transform='translate('+dx*pull+'px,'+dy*pull+'px)';label.style.transform='translate('+dx*pull*.5+'px,'+dy*pull*.5+'px)';}
  else{b.style.transform='';label.style.transform='';}});});`},

 {id:'L10',name:'Cursor spotlight',tags:['Pointer','Media'],perf:['mask-position','Medium'],about:'A dark, quiet image is revealed in full colour under the pointer. On touch screens the spotlight drifts on its own.',
  html:`<section class="spot"><img class="base" src="${IMG}mercury.webp" alt=""><img class="lit" src="${IMG}mercury.webp" alt=""><div class="copy"><p class="kicker">Move to light it</p><h1>Look closer.</h1></div></section>${END('Detail rewards attention.')}`,
  css:`.spot{position:relative;height:100vh;overflow:hidden;background:#000;--x:50%;--y:50%;--r:calc(180px*var(--fx-intensity))}
.spot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.base{filter:grayscale(1) brightness(.25)}
.lit{-webkit-mask-image:radial-gradient(circle var(--r) at var(--x) var(--y),#000 40%,transparent 100%);mask-image:radial-gradient(circle var(--r) at var(--x) var(--y),#000 40%,transparent 100%)}
.copy{position:absolute;left:7vw;bottom:10vh;color:#fff;display:grid;gap:12px;pointer-events:none}
.copy .kicker{color:#c9d3e3}.copy h1{font-size:clamp(56px,9vw,130px)}`,
  js:`const s=document.querySelector('.spot');let tx=50,ty=50,x=50,y=50,user=false;
s.addEventListener('pointermove',e=>{const r=s.getBoundingClientRect();tx=(e.clientX-r.left)/r.width*100;ty=(e.clientY-r.top)/r.height*100;user=true;});
(function loop(t){if(!user&&!FX.R){tx=50+Math.sin(t/1700)*28;ty=45+Math.cos(t/2300)*20;}x+=(tx-x)*.12;y+=(ty-y)*.12;s.style.setProperty('--x',x+'%');s.style.setProperty('--y',y+'%');requestAnimationFrame(loop);})(0);`},

 {id:'L11',name:'Controlled marquee',tags:['Scroll','Type'],perf:['transform','Low'],about:'An endless ribbon of words and images that reverses with your scroll direction, pauses on hover, and has a real pause button.',
  html:`<section class="mq-wrap"><button class="pause" aria-pressed="false">Pause motion</button><div class="mq"><div class="row">${'ART · FORM · FEEL · MOTION · '.repeat(4)}</div></div><div class="mq rev"><div class="row imgs">${['riso','synthwave','fox','nebula','amber','tree','riso','synthwave','fox','nebula','amber','tree'].map(n=>`<img src="${IMG}${n}.webp" alt="">`).join('')}</div></div></section>${END('Movement you can stop.')}`,
  css:`.mq-wrap{min-height:100vh;display:grid;align-content:center;gap:3vh;background:#0f3d2e;color:#eafff4;position:relative;overflow:hidden}
.mq{overflow:hidden;white-space:nowrap}
.row{display:inline-flex;align-items:center;gap:2vw;animation:mq calc(var(--fx-duration)*24) linear infinite;font:400 clamp(56px,10vw,150px)/1 "Cormorant Garamond",serif}
.rev .row{animation-direction:reverse}
.imgs img{height:22vh;aspect-ratio:1;object-fit:cover;border-radius:14px}
.mq-wrap:hover .row,.mq-wrap.paused .row{animation-play-state:paused}
html.backward .row{animation-direction:reverse}html.backward .rev .row{animation-direction:normal}
@keyframes mq{to{transform:translateX(-50%)}}
.pause{position:absolute;top:24px;right:24px;font:600 13px "Manrope",sans-serif;padding:10px 16px;border-radius:999px;border:1px solid #eafff4;background:transparent;color:#eafff4;cursor:pointer}`,
  js:`let last=scrollY;addEventListener('scroll',()=>{document.documentElement.classList.toggle('backward',scrollY<last);last=scrollY;},{passive:true});
const w=document.querySelector('.mq-wrap'),b=document.querySelector('.pause');
b.onclick=()=>{const p=w.classList.toggle('paused');b.setAttribute('aria-pressed',String(p));b.textContent=p?'Play motion':'Pause motion';};
if(FX.R)b.click();`},

 {id:'L12',name:'Bento reveal choreography',tags:['Reveal'],perf:['opacity, transform','Low'],about:'A modular grid assembles tile by tile, largest first. Stagger stays short so the whole set lands in under a second.',
  html:`<section class="wrap bento-wrap"><p class="kicker">Studio · 2026</p><h1>Everything in its place.</h1><div class="bento"><div class="t big"><img src="${IMG}coast.webp" alt=""><b>Coastal study</b></div><div class="t"><img src="${IMG}amber.webp" alt=""></div><div class="t stat"><b>230</b><span>specimens</span></div><div class="t tall"><img src="${IMG}cathedral.webp" alt=""></div><div class="t wide"><img src="${IMG}synthwave.webp" alt=""><b>Night drive</b></div><div class="t note"><span>“A direction is a set of decisions you can keep.”</span></div></div></section>${END('Assembled.')}`,
  css:`.bento-wrap{padding:14vh 6vw;display:grid;gap:22px}.bento-wrap h1{font-size:clamp(44px,6vw,84px)}
.bento{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:22vh;gap:14px}
.t{position:relative;border-radius:18px;overflow:hidden;background:#fff;opacity:0;transform:translateY(calc(40px*var(--fx-intensity))) scale(.96);transition:opacity var(--fx-duration) var(--fx-ease),transform var(--fx-duration) var(--fx-ease)}
.t img{width:100%;height:100%;object-fit:cover}
.t b{position:absolute;left:16px;bottom:14px;color:#fff;font:400 26px "Cormorant Garamond",serif}
.big{grid-column:span 2;grid-row:span 2}.tall{grid-row:span 2}.wide{grid-column:span 2}
.stat{display:grid;place-content:center;text-align:center;background:#0d1220;color:#fff}.stat b{position:static;font-size:64px}
.note{display:grid;place-content:center;padding:20px;background:#fde68a;font:italic 400 22px "Cormorant Garamond",serif}
.bento.in .t{opacity:1;transform:none}
@media(max-width:720px){.bento{grid-template-columns:1fr 1fr}.big,.wide{grid-column:span 2}}`,
  js:`const g=document.querySelector('.bento');[...g.children].forEach((t,i)=>t.style.transitionDelay=(i*70)+'ms');
if(FX.R)g.classList.add('in');else new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){g.classList.add('in');o.disconnect();}}),{threshold:.2}).observe(g);`},

 {id:'L13',name:'Shared element transition',tags:['Pointer','Navigation'],perf:['transform','Low'],about:'A thumbnail grows into its detail view, so people never lose their place. Built with the FLIP technique and Web Animations.',
  html:`<section class="wrap sh"><p class="kicker">Tap a card</p><h1>A familiar object.</h1><div class="list">${[['origami','Paper crane'],['statue','Garden statue'],['moon','Moon study']].map(([n,t])=>`<button class="item" data-src="${IMG}${n}.webp" data-title="${t}"><img src="${IMG}${n}.webp" alt=""><span>${t}</span></button>`).join('')}</div></section><div class="detail" hidden><img alt=""><div class="dcopy"><p class="kicker">Material detail</p><h2></h2><p class="lede">The image you tapped became this view. Close to send it back.</p><button class="close">Close</button></div></div>`,
  css:`.sh{min-height:100vh;display:grid;align-content:center;gap:22px;padding:10vh 6vw}.sh h1{font-size:clamp(44px,6vw,84px)}
.list{display:grid;grid-template-columns:repeat(3,1fr);gap:2vw}
.item{all:unset;cursor:pointer;display:grid;gap:10px;font:400 24px "Cormorant Garamond",serif}
.item img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:14px}
.item:focus-visible{outline:3px solid #0369a1;outline-offset:4px;border-radius:14px}
.detail{position:fixed;inset:0;display:grid;grid-template-columns:1.2fr 1fr;background:#f2f4f7;z-index:10}
.detail[hidden]{display:none}
.detail img{width:100%;height:100vh;object-fit:cover}
.dcopy{display:grid;align-content:center;gap:16px;padding:6vw}.dcopy h2{font-size:clamp(44px,5vw,72px)}
.close{justify-self:start;font:600 14px "Manrope",sans-serif;padding:12px 22px;border-radius:999px;border:1px solid #0d1220;background:none;cursor:pointer}
@media(max-width:720px){.detail{grid-template-columns:1fr}.detail img{height:50vh}}`,
  js:`const d=document.querySelector('.detail'),dImg=d.querySelector('img'),dT=d.querySelector('h2');let from=null;
function flip(a,b,reverse){const r1=a.getBoundingClientRect(),r2=b.getBoundingClientRect();const kf=[{transform:'translate('+(r1.left-r2.left)+'px,'+(r1.top-r2.top)+'px) scale('+(r1.width/r2.width)+','+(r1.height/r2.height)+')',borderRadius:'40px'},{transform:'none',borderRadius:'0'}];
 return b.animate(reverse?kf.reverse():kf,{duration:FX.R?0:FX.d*.8,easing:'cubic-bezier(.2,.7,.1,1)',fill:'both'}).finished;}
document.querySelectorAll('.item').forEach(it=>it.onclick=()=>{from=it.querySelector('img');dImg.src=it.dataset.src;dT.textContent=it.dataset.title;d.hidden=false;dImg.style.transformOrigin='top left';flip(from,dImg);d.querySelector('.close').focus();});
d.querySelector('.close').onclick=async()=>{dImg.style.transformOrigin='top left';await flip(from,dImg,true);d.hidden=true;from.closest('button').focus();};
addEventListener('keydown',e=>{if(e.key==='Escape'&&!d.hidden)d.querySelector('.close').click();});`},

 {id:'L14',name:'Video hero',tags:['Scroll','Media'],perf:['transform, border-radius','Medium'],about:'A full-bleed film that settles into a card as you scroll on. Always muted, always with a pause button and a poster.',
  html:`<section class="vh"><div class="stage"><video autoplay muted loop playsinline poster="assets/atlas-hero-poster.jpg" src="assets/atlas-hero-720.mp4"></video><div class="copy"><p class="kicker">Genesis · 40 s loop</p><h1>Set the scene.</h1></div><button class="pp" aria-pressed="false">Pause film</button></div></section>${END('Then get to the point.')}`,
  css:`.vh{height:200vh;background:#f2f4f7}
.stage{position:sticky;top:0;height:100vh;overflow:hidden;display:grid;place-items:center}
video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform-origin:center;will-change:transform}
.copy{position:relative;color:#fff;text-align:center;display:grid;gap:14px;text-shadow:0 2px 30px rgba(0,0,0,.6)}
.copy .kicker{color:#dbe4f3}.copy h1{font-size:clamp(56px,10vw,140px)}
.pp{position:absolute;right:24px;bottom:24px;font:600 13px "Manrope",sans-serif;padding:10px 16px;border-radius:999px;border:1px solid #fff;background:rgba(0,0,0,.3);color:#fff;cursor:pointer}`,
  js:`const v=document.querySelector('video'),sec=document.querySelector('.vh'),pp=document.querySelector('.pp');
pp.onclick=()=>{if(v.paused){v.play();pp.textContent='Pause film';pp.setAttribute('aria-pressed','false');}else{v.pause();pp.textContent='Play film';pp.setAttribute('aria-pressed','true');}};
if(FX.R){v.removeAttribute('autoplay');v.pause();pp.textContent='Play film';}
function draw(){const p=FX.progress(sec);const s=1-p*.35*FX.i;v.style.transform='scale('+s+')';v.style.borderRadius=(p*40)+'px';}
addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});draw();`},

 {id:'L15',name:'SVG line drawing',tags:['Scroll'],perf:['stroke-dashoffset','Low'],about:'A line draws itself in step with the scroll, tying sections together. Keep the path simple and the stroke steady.',
  html:`<section class="draw"><div class="pin"><svg viewBox="0 0 800 500" aria-hidden="true"><path id="p" d="M40 420 C 160 120, 260 120, 330 260 S 520 460, 600 230 S 720 40, 770 90" fill="none" stroke="#047857" stroke-width="3" stroke-linecap="round"/><circle id="dot" r="8" fill="#047857"/></svg><div class="copy"><p class="kicker">Route 01</p><h1>Draw the<br>connection.</h1></div></div></section>${END('Arrived.')}`,
  css:`.draw{height:260vh;background:#f2f5e9}
.pin{position:sticky;top:0;height:100vh;display:grid;grid-template-columns:1fr 1.4fr;align-items:center;gap:4vw;padding:0 6vw}
.copy{display:grid;gap:14px}.copy h1{font-size:clamp(48px,7vw,100px)}
svg{width:100%;height:auto}
@media(max-width:720px){.pin{grid-template-columns:1fr}}`,
  js:`const path=document.getElementById('p'),dot=document.getElementById('dot'),sec=document.querySelector('.draw'),L=path.getTotalLength();
path.style.strokeDasharray=L;
function draw(){const p=FX.R?1:FX.progress(sec);path.style.strokeDashoffset=L*(1-p);const pt=path.getPointAtLength(L*p);dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y);}
addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});draw();`},

 {id:'L16',name:'Particle field hero',tags:['Pointer','Canvas'],perf:['canvas 2D','Medium'],about:'A quiet constellation that links nearby points and parts around the pointer. Particle count scales with intensity; it pauses when off screen.',
  html:`<section class="pf"><canvas aria-hidden="true"></canvas><div class="copy"><p class="kicker">Live field</p><h1>Form follows<br>motion.</h1></div></section>${END('Still, when you need it.')}`,
  css:`.pf{position:relative;height:100vh;background:#08151a;overflow:hidden}
canvas{position:absolute;inset:0;width:100%;height:100%}
.copy{position:absolute;left:7vw;top:50%;transform:translateY(-50%);color:#e6fffb;display:grid;gap:14px;pointer-events:none}
.copy .kicker{color:#7dd3c8}.copy h1{font-size:clamp(52px,8vw,120px)}`,
  js:`const c=document.querySelector('canvas'),x=c.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1);let W,H,P=[],m={x:-999,y:-999},run=true;
function size(){W=c.clientWidth;H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);const n=Math.round(90*FX.i*(W*H)/(1280*800));P=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}));}
size();addEventListener('resize',size);
c.parentNode.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top;});
new IntersectionObserver(([e])=>{run=e.isIntersecting;if(run)requestAnimationFrame(tick);}).observe(c);
function tick(){if(!run)return;x.clearRect(0,0,W,H);
 for(const p of P){if(!FX.R){p.x+=p.vx;p.y+=p.vy;}const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);if(d<120){p.x+=dx/d*1.5;p.y+=dy/d*1.5;}if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;}
 x.strokeStyle='rgba(125,211,200,.18)';x.beginPath();for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j];if(Math.abs(a.x-b.x)<110&&Math.hypot(a.x-b.x,a.y-b.y)<110){x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);}}x.stroke();
 x.fillStyle='#bff5ec';for(const p of P){x.beginPath();x.arc(p.x,p.y,1.6,0,6.3);x.fill();}
 if(!FX.R)requestAnimationFrame(tick);}
requestAnimationFrame(tick);`},

 {id:'L17',name:'Before and after',tags:['Pointer','Media'],perf:['clip-path','Low'],about:'Drag the divider, or use the arrow keys, to compare two treatments of the same image. The divider is a real range input.',
  html:`<section class="ba-wrap wrap"><p class="kicker">Drag or use ← →</p><h1>Colour or ink?</h1><div class="ba"><img src="${IMG}bird.webp" alt="Bird study in full colour"><img class="after" src="${IMG}bird.webp" alt="Bird study as monochrome ink"><input type="range" min="0" max="100" value="50" aria-label="Comparison position"><span class="handle"></span><span class="lbl l">Colour</span><span class="lbl r">Ink</span></div></section>`,
  css:`.ba-wrap{min-height:100vh;display:grid;align-content:center;gap:20px;padding:8vh 6vw}.ba-wrap h1{font-size:clamp(44px,6vw,84px)}
.ba{position:relative;border-radius:18px;overflow:hidden;--p:50%;max-width:900px}
.ba img{width:100%;aspect-ratio:16/10;object-fit:cover}
.after{position:absolute;inset:0;height:100%;filter:grayscale(1) contrast(1.6) brightness(1.1) sepia(.2);clip-path:inset(0 0 0 var(--p))}
.ba input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}
.handle{position:absolute;top:0;bottom:0;left:var(--p);width:3px;margin-left:-1.5px;background:#fff;pointer-events:none;box-shadow:0 0 12px rgba(0,0,0,.4)}
.handle::after{content:"↔";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:18px;color:#0d1220}
.ba input:focus-visible~.handle::after{outline:3px solid #0369a1}
.lbl{position:absolute;top:16px;font:500 11px "JetBrains Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#fff;background:rgba(0,0,0,.45);padding:6px 10px;border-radius:999px}.l{left:16px}.r{right:16px}`,
  js:`const ba=document.querySelector('.ba'),r=ba.querySelector('input');r.oninput=()=>ba.style.setProperty('--p',r.value+'%');`},

 {id:'L18',name:'Shrinking sticky header',tags:['Scroll','Navigation'],perf:['transform','Low'],about:'A generous header compacts once reading starts, then stays out of the way. Animate transform, not height, to avoid layout jumps.',
  html:`<header class="hd"><div class="logo">FIELD / STUDIO</div><nav><a href="#">Work</a><a href="#">About</a><a href="#">Contact</a></nav></header><section class="wrap body"><p class="kicker">Journal</p><h1>More space<br>for the work.</h1><img src="${IMG}garden.webp" alt=""><p class="lede">Scroll a little: the header steps back so the page can lead.</p><div class="spacer"></div></section>`,
  css:`.hd{position:fixed;top:0;left:0;right:0;z-index:5;display:flex;justify-content:space-between;align-items:center;padding:34px 6vw;background:rgba(242,244,247,.85);backdrop-filter:blur(12px);transition:padding var(--fx-duration) var(--fx-ease),box-shadow .3s}
.logo{font:700 28px "Manrope",sans-serif;letter-spacing:.06em;transform-origin:left;transition:transform var(--fx-duration) var(--fx-ease)}
.hd nav{display:flex;gap:24px}.hd a{color:#0d1220;text-decoration:none;font-weight:600}
.hd.small{padding:12px 6vw;box-shadow:0 8px 24px -16px rgba(13,18,32,.4)}.hd.small .logo{transform:scale(.6)}
.body{padding-top:24vh;display:grid;gap:22px}.body h1{font-size:clamp(52px,8vw,120px)}.body img{width:100%;max-height:70vh;object-fit:cover;border-radius:18px}`,
  js:`const hd=document.querySelector('.hd');addEventListener('scroll',()=>hd.classList.toggle('small',scrollY>40),{passive:true});`},

 /* ---------- New effects ---------- */
 {id:'L19',name:'Scroll-driven reveals',isNew:true,tags:['Scroll','Reveal'],perf:['opacity, transform (CSS only)','Very low'],about:'Elements animate against their position in the viewport with CSS animation-timeline, no JavaScript. Browsers without support get an IntersectionObserver fallback; the badge says which one is running.',
  html:`<div class="prog"></div><section class="wrap sd"><p class="kicker" id="mode">Checking support…</p><h1>Motion from the<br>scroll itself.</h1>${[['fieldlines','Field lines'],['contours','Contours'],['constellation','Constellation'],['voronoi','Voronoi']].map(([n,t])=>`<figure class="rv"><img src="${IMG}${n}.webp" alt=""><figcaption>${t}</figcaption></figure>`).join('')}</section>`,
  css:`.prog{position:fixed;top:0;left:0;right:0;height:4px;background:#0369a1;transform-origin:left;transform:scaleX(0);z-index:5}
.sd{display:grid;gap:12vh;padding:16vh 6vw}.sd h1{font-size:clamp(48px,7vw,104px)}
.rv{margin:0;max-width:720px}.rv:nth-of-type(even){justify-self:end}
.rv img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:16px}
.rv figcaption{margin-top:10px;font:400 28px "Cormorant Garamond",serif}
@keyframes rise{from{opacity:0;transform:translateY(calc(80px*var(--fx-intensity))) scale(.94)}to{opacity:1;transform:none}}
@keyframes grow{to{transform:scaleX(1)}}
@supports (animation-timeline:view()){
 .rv{animation:rise linear both;animation-timeline:view();animation-range:entry 0% cover 35%}
 .prog{animation:grow linear both;animation-timeline:scroll(root)}}
.js-fallback .rv{opacity:0;transform:translateY(60px);transition:all var(--fx-duration) var(--fx-ease)}.js-fallback .rv.in{opacity:1;transform:none}`,
  js:`const ok=CSS.supports('animation-timeline: view()');document.getElementById('mode').textContent=ok?'Running on CSS scroll timelines':'Fallback: IntersectionObserver';
if(!ok){document.body.classList.add('js-fallback');const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.2});document.querySelectorAll('.rv').forEach(r=>io.observe(r));
 const pr=document.querySelector('.prog');addEventListener('scroll',()=>{pr.style.transform='scaleX('+scrollY/(document.documentElement.scrollHeight-innerHeight)+')';},{passive:true});}`},

 {id:'L20',name:'Page morph',isNew:true,tags:['Navigation'],perf:['View Transitions (compositor)','Low'],about:'A card morphs into its detail page across a navigation with the View Transitions API. Where it is not supported the page simply swaps.',
  html:`<main class="wrap vt"><section id="list"><p class="kicker">Collection</p><h1>Four worlds.</h1><div class="cards">${[['cathedral','Green cathedral'],['lighthouse','Storm light'],['coast','Coastal town'],['synthwave','Night drive']].map(([n,t],i)=>`<button class="c" data-i="${i}" data-n="${n}" data-t="${t}"><img src="${IMG}${n}.webp" alt=""><span>${t}</span></button>`).join('')}</div></section><section id="detail" hidden><button class="back">← All worlds</button><img alt=""><h2></h2><p class="lede">The card you chose became this page. Back reverses the morph.</p></section></main>`,
  css:`.vt{padding:10vh 6vw;min-height:100vh}.vt h1{font-size:clamp(46px,6vw,88px);margin:12px 0 28px}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.c{all:unset;cursor:pointer;display:grid;gap:10px;font:400 22px "Cormorant Garamond",serif}
.c img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:14px}
.c:focus-visible{outline:3px solid #0369a1;outline-offset:4px;border-radius:14px}
#detail{display:grid;gap:18px}#detail[hidden]{display:none}#detail img{width:100%;max-height:62vh;object-fit:cover;border-radius:18px;view-transition-name:hero}#detail h2{font-size:clamp(44px,6vw,90px);view-transition-name:title}
.back{justify-self:start;font:600 14px "Manrope",sans-serif;padding:10px 18px;border-radius:999px;border:1px solid #0d1220;background:none;cursor:pointer}
::view-transition-group(*){animation-duration:var(--fx-duration);animation-timing-function:var(--fx-ease)}
@media(max-width:720px){.cards{grid-template-columns:1fr 1fr}}`,
  js:`const list=document.getElementById('list'),det=document.getElementById('detail');let last=null;
function go(fn){if(document.startViewTransition&&!FX.R)document.startViewTransition(fn);else fn();}
document.querySelectorAll('.c').forEach(c=>c.onclick=()=>{last=c;c.querySelector('img').style.viewTransitionName='hero';c.querySelector('span').style.viewTransitionName='title';
 go(()=>{c.querySelector('img').style.viewTransitionName='';c.querySelector('span').style.viewTransitionName='';det.querySelector('img').src=IMGPATH+c.dataset.n+'.webp';det.querySelector('h2').textContent=c.dataset.t;list.hidden=true;det.hidden=false;det.querySelector('.back').focus();});});
det.querySelector('.back').onclick=()=>go(()=>{list.hidden=false;det.hidden=true;last.querySelector('img').style.viewTransitionName='hero';last.querySelector('span').style.viewTransitionName='title';last.focus();setTimeout(()=>{last.querySelector('img').style.viewTransitionName='';last.querySelector('span').style.viewTransitionName='';},FX.d+50);});
const IMGPATH='${IMG}';`},

 {id:'L21',name:'Stacking cards',isNew:true,tags:['Scroll'],perf:['transform, filter','Low'],about:'Sections pin and stack like a deck; each new card pushes the last one back. A strong pattern for services or process steps.',
  html:`<section class="wrap st-head"><p class="kicker">Process</p><h1>Four steps,<br>one deck.</h1></section><section class="stack wrap">${[['Brief','#fde68a','riso'],['Direction','#6ee7b7','tree'],['Assets','#7dd3fc','exploded'],['Review','#fda4af','bird']].map(([t,c,n],i)=>`<article class="sc" style="--i:${i};background:${c}"><div><span class="kicker">Step 0${i+1}</span><h2>${t}</h2><p class="lede">Each step lands on top of the last, so progress feels physical.</p></div><img src="${IMG}${n}.webp" alt=""></article>`).join('')}</section>${END('Dealt.')}`,
  css:`.st-head{padding:14vh 6vw 6vh}.st-head h1{font-size:clamp(48px,7vw,104px)}
.stack{display:grid;gap:6vh;padding-bottom:20vh}
.sc{position:sticky;top:calc(8vh + var(--i)*22px);height:72vh;border-radius:24px;display:grid;grid-template-columns:1fr 1fr;gap:4vw;align-items:center;padding:5vw;transform-origin:top center;box-shadow:0 -10px 40px -20px rgba(13,18,32,.35);will-change:transform}
.sc h2{font-size:clamp(44px,6vw,90px);margin:10px 0 14px}
.sc img{width:100%;height:100%;max-height:56vh;object-fit:cover;border-radius:16px}
@media(max-width:720px){.sc{grid-template-columns:1fr}.sc img{max-height:30vh}}`,
  js:`const cards=[...document.querySelectorAll('.sc')];
function draw(){cards.forEach((c,i)=>{const next=cards[i+1];if(!next){c.style.transform='';return;}const r=next.getBoundingClientRect(),top=innerHeight*.08+(i+1)*22;const p=FX.clamp(1-(r.top-top)/(innerHeight*.7),0,1);c.style.transform='scale('+(1-p*.08*FX.i)+')';c.style.filter='brightness('+(1-p*.25*FX.i)+')';});}
if(!FX.R){addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});draw();}`},

 {id:'L22',name:'Zoom-through hero',isNew:true,tags:['Scroll','Type'],perf:['transform','Medium'],about:'A giant word, filled with the picture behind it, scales until you fly through its letters into the scene.',
  html:`<section class="zt"><div class="pin"><img class="bg" src="${IMG}synthwave.webp" alt=""><h1 class="word">ATLAS</h1><p class="kicker hint">Scroll to enter</p></div></section>${END('You are inside the picture now.')}`,
  css:`.zt{height:300vh;background:#0d1220}
.pin{position:sticky;top:0;height:100vh;overflow:hidden;display:grid;place-items:center;background:#0d1220}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0}
.word{position:relative;font:900 clamp(90px,22vw,340px)/.8 "Archivo","Arial Black",sans-serif;letter-spacing:-.06em;background:url(${IMG}synthwave.webp) center/cover;-webkit-background-clip:text;background-clip:text;color:transparent;will-change:transform;transform-origin:47% 52%}
.hint{position:absolute;bottom:6vh;color:#a8b3c7}`,
  js:`const sec=document.querySelector('.zt'),w=document.querySelector('.word'),bg=document.querySelector('.bg'),hint=document.querySelector('.hint');
function draw(){const p=FX.R?0:FX.progress(sec);const s=1+Math.pow(p,2.4)*60*FX.i;w.style.transform='scale('+s+')';bg.style.opacity=FX.clamp((p-.55)/.3,0,1);w.style.opacity=1-FX.clamp((p-.7)/.2,0,1);hint.style.opacity=1-p*4;}
addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});draw();`,
  extraHead:'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@900&display=swap">'},

 {id:'L23',name:'Film scrub',isNew:true,tags:['Scroll','Media','Canvas'],perf:['canvas drawImage','Medium'],about:'Scrolling scrubs the Genesis film frame by frame: 60 WebP stills (1.3 MB) drawn to a canvas. Frames load progressively, so the first ones appear at once.',
  html:`<section class="fs"><div class="pin"><canvas aria-label="Genesis film, scrubbed by scroll"></canvas><div class="copy"><p class="kicker" id="fc">Frame 01 / 60</p><h1>Scroll the<br>film.</h1></div></div></section>${END('Forty seconds, at your pace.')}`,
  css:`.fs{height:500vh;background:#02040b}
.pin{position:sticky;top:0;height:100vh;overflow:hidden}
canvas{position:absolute;inset:0;width:100%;height:100%}
.copy{position:absolute;left:6vw;bottom:9vh;color:#eef2f8;display:grid;gap:12px}.copy .kicker{color:#a8b3c7}.copy h1{font-size:clamp(52px,8vw,120px)}`,
  js:`const c=document.querySelector('canvas'),x=c.getContext('2d'),sec=document.querySelector('.fs'),fc=document.getElementById('fc'),N=60,frames=[];let cur=-1;
for(let i=0;i<N;i++){const im=new Image();im.decoding='async';im.src=FRAMES+String(i+1).padStart(2,'0')+'.webp';im.onload=()=>{if(i===want())paint(i,true);};frames.push(im);}
function want(){return Math.min(N-1,Math.floor(FX.progress(sec)*N));}
function size(){c.width=c.clientWidth*Math.min(2,devicePixelRatio);c.height=c.clientHeight*Math.min(2,devicePixelRatio);cur=-1;paint(want(),true);}
function paint(i,force){if(i===cur&&!force)return;let k=i;while(k>0&&!frames[k].complete)k--;const im=frames[k];if(!im.complete)return;cur=i;const s=Math.max(c.width/im.width,c.height/im.height),w=im.width*s,h=im.height*s;x.drawImage(im,(c.width-w)/2,(c.height-h)/2,w,h);fc.textContent='Frame '+String(i+1).padStart(2,'0')+' / '+N;}
addEventListener('resize',size);addEventListener('scroll',()=>requestAnimationFrame(()=>paint(want())),{passive:true});size();
const FRAMES='${IMG}film/f';`},

 {id:'L24',name:'Split-text reveal',isNew:true,tags:['Reveal','Type'],perf:['transform','Low'],about:'Headlines rise in by line, word or letter from behind a mask. Screen readers get the whole sentence once, from an aria-label.',
  html:`<section class="wrap sp">${['Ideas deserve another dimension.','Every plate traces one idea.','From equation to living form.'].map((t,i)=>`<h1 class="split" data-mode="${['words','chars','lines'][i]}" aria-label="${t}">${t}</h1><p class="kicker">Split by ${['word','letter','line'][i]}</p>`).join('<div class="gap"></div>')}</section>${END('Read at the speed of reveal.')}`,
  css:`.sp{padding:20vh 6vw;display:grid;gap:14px}.gap{height:30vh}
.split{font-size:clamp(48px,7.5vw,112px);max-width:14ch}
.split .w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em}
.split .w>span{display:inline-block;transform:translateY(110%);transition:transform var(--fx-duration) var(--fx-ease)}
.split.in .w>span{transform:none}`,
  js:`document.querySelectorAll('.split').forEach(h=>{const t=h.textContent,mode=h.dataset.mode;h.textContent='';let k=0;
 const add=(txt,space)=>{const w=document.createElement('span');w.className='w';w.setAttribute('aria-hidden','true');const s=document.createElement('span');s.textContent=txt;s.style.transitionDelay=(k++*(mode==='chars'?22:70)/Math.max(.25,FX.i))+'ms';w.append(s);h.append(w);if(space)h.append(' ');};
 if(mode==='chars')t.split(' ').forEach((word,wi,arr)=>{[...word].forEach(ch=>add(ch,false));if(wi<arr.length-1)h.append(' ');});
 else if(mode==='lines'){const words=t.split(' ');add(words.slice(0,3).join(' '),true);add(words.slice(3).join(' '),false);}
 else t.split(' ').forEach((w,i,a)=>add(w,i<a.length-1));});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.4});
document.querySelectorAll('.split').forEach(h=>FX.R?h.classList.add('in'):io.observe(h));`},

 {id:'L25',name:'Liquid hover',isNew:true,tags:['Pointer','WebGL'],perf:['WebGL fragment shader','Medium'],about:'The image ripples and refracts under the pointer, rendered by a small WebGL shader. Without WebGL it falls back to the plain image.',
  html:`<section class="lq"><canvas aria-label="Liquid ripple over a mercury study"></canvas><img class="fallback" src="${IMG}mercury.webp" alt="" hidden><div class="copy"><p class="kicker">Move across the image</p><h1>Liquid<br>surface.</h1></div></section>${END('Surface tension.')}`,
  css:`.lq{position:relative;height:100vh;background:#000;overflow:hidden}
canvas,.fallback{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.copy{position:absolute;right:6vw;bottom:9vh;text-align:right;color:#fff;display:grid;gap:12px;pointer-events:none}.copy .kicker{color:#c9d3e3}.copy h1{font-size:clamp(52px,8vw,120px)}`,
  js:`const c=document.querySelector('canvas'),gl=c.getContext('webgl');
if(!gl){c.hidden=true;document.querySelector('.fallback').hidden=false;}else{
 const vs='attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0,1);}';
 const fs='precision mediump float;varying vec2 v;uniform sampler2D t;uniform vec2 m;uniform float time,amp,asp,ia;void main(){vec2 d=v-m;d.x*=asp;float r=length(d);float w=sin(r*40.-time*4.)*exp(-r*6.)*amp*ia;vec2 uv=v+normalize(d+1e-4)*w*.03;float ca=w*.004;vec3 col=vec3(texture2D(t,uv+ca).r,texture2D(t,uv).g,texture2D(t,uv-ca).b);gl_FragColor=vec4(col,1.);}';
 const sh=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;};
 const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
 const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 const U=n=>gl.getUniformLocation(pr,n);const tex=gl.createTexture();const im=new Image();im.src=document.querySelector('.fallback').src;
 let m=[.5,.5],tm=[.5,.5],amp=0,start=performance.now();
 im.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,im);requestAnimationFrame(loop);};
 c.parentNode.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();tm=[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height];amp=1;});
 function loop(now){const d=Math.min(2,devicePixelRatio);if(c.width!==c.clientWidth*d){c.width=c.clientWidth*d;c.height=c.clientHeight*d;gl.viewport(0,0,c.width,c.height);}
  m[0]+=(tm[0]-m[0])*.1;m[1]+=(tm[1]-m[1])*.1;amp*=.985;if(FX.R)amp=0;
  gl.uniform2f(U('m'),m[0],m[1]);gl.uniform1f(U('time'),(now-start)/1000);gl.uniform1f(U('amp'),amp+.15);gl.uniform1f(U('asp'),c.width/c.height);gl.uniform1f(U('ia'),FX.i);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(loop);}}`},

 {id:'L26',name:'Aurora field',isNew:true,tags:['Scroll','Ambient'],perf:['filter: blur on 4 layers','Medium'],about:'Slow, blurred colour fields drift behind crisp type and shift hue as you scroll. Grain keeps the gradients from banding.',
  html:`<section class="au"><div class="blobs" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="grain" aria-hidden="true"></div><div class="copy"><p class="kicker">Ambient</p><h1>Calm, then<br>colour.</h1><p class="lede">A living background for launch pages and portfolios.</p></div></section><section class="au two"><div class="blobs" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="copy"><h1>The light keeps moving.</h1></div></section>`,
  css:`.au{position:relative;min-height:100vh;overflow:hidden;display:grid;place-items:center;background:#0b0820;color:#f4f0ff;isolation:isolate}
.blobs{position:absolute;inset:-20%;filter:blur(calc(70px*var(--fx-intensity))) saturate(140%);z-index:-1}
.blobs i{position:absolute;width:55vmax;height:55vmax;border-radius:50%;mix-blend-mode:screen;animation:drift calc(var(--fx-duration)*18) ease-in-out infinite alternate}
.blobs i:nth-child(1){background:#7c3aed;left:5%;top:10%}.blobs i:nth-child(2){background:#06b6d4;right:0;top:0;animation-delay:-4s}
.blobs i:nth-child(3){background:#f472b6;left:30%;bottom:-10%;animation-delay:-8s}.blobs i:nth-child(4){background:#22c55e;right:20%;bottom:10%;opacity:.6;animation-delay:-12s}
@keyframes drift{to{transform:translate(12vw,-8vh) scale(1.2)}}
.grain{position:absolute;inset:0;z-index:-1;opacity:.12;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.copy{text-align:center;display:grid;gap:16px;justify-items:center;padding:0 6vw}.copy .kicker,.copy .lede{color:#d6ccff}.copy h1{font-size:clamp(56px,9vw,130px)}
.two{background:#060b18}`,
  js:`addEventListener('scroll',()=>requestAnimationFrame(()=>{document.querySelectorAll('.blobs').forEach(b=>b.style.filter='blur('+(70*FX.i)+'px) saturate(140%) hue-rotate('+(scrollY*.08)+'deg)');}),{passive:true});`},

 {id:'L27',name:'Data reveal',isNew:true,tags:['Reveal','Data'],perf:['transform, text','Low'],about:'Numbers count up and bars grow as they enter, with tabular figures so nothing jitters. The final values are in the HTML for screen readers and no-JS.',
  html:`<section class="wrap dr"><p class="kicker">Atlas in numbers</p><h1>A library that grows.</h1><div class="stats">${[[264,'specimens'],[60,'motion studies'],[32,'design systems'],[201,'extracted assets']].map(([n,l])=>`<div class="st"><b data-to="${n}">${n}</b><span>${l}</span></div>`).join('')}</div><figure class="chart" aria-label="Entries per collection"><svg viewBox="0 0 600 260" role="img" aria-label="Bar chart: Animation art 40, UX/UI 40, Art styles 36, Systems 32, Interface motion 20, Effects 18">${[['Anim. art',40],['UX/UI',40],['Art',36],['Systems',32],['Motion UI',20],['Effects',18]].map(([l,v],i)=>`<g transform="translate(${20+i*96},0)"><rect class="bar" x="0" y="${220-v*5}" width="64" height="${v*5}" rx="6"/><text x="32" y="${212-v*5}" text-anchor="middle" class="v">${v}</text><text x="32" y="246" text-anchor="middle" class="l">${l}</text></g>`).join('')}</svg></figure></section>${END('Counted.')}`,
  css:`.dr{padding:16vh 6vw;display:grid;gap:30px}.dr h1{font-size:clamp(46px,6vw,88px)}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.st{background:#fff;border:1px solid #d9dee6;border-radius:16px;padding:22px}
.st b{display:block;font:300 clamp(48px,6vw,84px)/1 "Cormorant Garamond",serif;font-variant-numeric:tabular-nums}
.st span{font:500 11px "JetBrains Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#4a5466}
.chart{margin:0;background:#fff;border:1px solid #d9dee6;border-radius:16px;padding:20px}
.bar{fill:#047857;transform-box:fill-box;transform-origin:bottom;transform:scaleY(0);transition:transform var(--fx-duration) var(--fx-ease)}
.chart.in .bar{transform:none}
.v{font:600 14px "Manrope",sans-serif;fill:#0d1220;opacity:0;transition:opacity .4s calc(var(--fx-duration)*.8)}.chart.in .v{opacity:1}
.l{font:500 11px "JetBrains Mono",monospace;fill:#4a5466}
@media(max-width:720px){.stats{grid-template-columns:1fr 1fr}}`,
  js:`document.querySelectorAll('.bar').forEach((b,i)=>b.style.transitionDelay=i*80+'ms');
function count(el){const to=+el.dataset.to,start=performance.now(),d=FX.d*1.6;(function f(now){const p=Math.min(1,(now-start)/d),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(f);})(start);}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);if(e.target.matches('.chart'))e.target.classList.add('in');else count(e.target);}),{threshold:.5});
if(FX.R)document.querySelector('.chart').classList.add('in');else{document.querySelectorAll('.st b').forEach(b=>{b.textContent='0';io.observe(b);});io.observe(document.querySelector('.chart'));}`},

 {id:'L28',name:'Pinned horizontal story',isNew:true,tags:['Scroll','Navigation'],perf:['transform','Low'],about:'Chapters sit side by side and vertical scroll moves through them, with a chapter counter and progress line so the sideways move never disorients.',
  html:`<section class="hs"><div class="pin"><div class="meta"><span class="kicker" id="hc">Chapter 1 of 4</span><span class="pl"><i></i></span></div><div class="rail">${[['Harmonics','fieldlines','Rotating circles draw a planet from pure frequency.'],['Specimens','tree','Oak, rose, willow and stag, drawn in light.'],['Dimension','lattice','Flat drawings lift into a wireframe garden.'],['Biosphere','nebula','The world fills with flocks, then fades to the void.']].map(([t,n,d],i)=>`<article><img src="${IMG}${n}.webp" alt=""><div><span class="kicker">Plate 0${i+1}</span><h2>${t}</h2><p class="lede">${d}</p></div></article>`).join('')}</div></div></section>${END('The end of the strip.')}`,
  css:`.hs{position:relative;background:#02040b;color:#eef2f8}
.pin{position:sticky;top:0;height:100vh;overflow:hidden;display:grid;grid-template-rows:auto 1fr}
.meta{display:flex;align-items:center;gap:20px;padding:4vh 6vw}.meta .kicker{color:#a8b3c7}
.pl{flex:1;height:2px;background:rgba(190,210,240,.18)}.pl i{display:block;height:100%;background:#7dd3fc;transform-origin:left;transform:scaleX(0)}
.rail{display:flex;height:100%;will-change:transform}
.rail article{flex:0 0 100vw;display:grid;grid-template-columns:1fr 1fr;gap:5vw;align-items:center;padding:0 6vw 8vh}
.rail img{width:100%;height:60vh;object-fit:cover;border-radius:18px}
.rail h2{font-size:clamp(48px,7vw,104px);margin:10px 0 16px}.rail .lede{color:#a8b3c7}
@media(max-width:720px){.rail article{grid-template-columns:1fr}.rail img{height:36vh}}`,
  js:`const sec=document.querySelector('.hs'),rail=document.querySelector('.rail'),hc=document.getElementById('hc'),pl=document.querySelector('.pl i'),N=rail.children.length;
function size(){sec.style.height=(N*innerHeight*1.1)+'px';}
function draw(){const p=FX.progress(sec);rail.style.transform='translate3d('+(-p*(N-1)*innerWidth)+'px,0,0)';pl.style.transform='scaleX('+p+')';hc.textContent='Chapter '+Math.min(N,Math.round(p*(N-1))+1)+' of '+N;}
size();addEventListener('resize',()=>{size();draw();});addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});draw();`},

 {id:'L29',name:'Ink trail cursor',isNew:true,tags:['Pointer','Canvas'],perf:['canvas 2D','Low'],about:'The pointer leaves a brush stroke that thins and fades, smoothed with quadratic curves. It sits behind the text and never blocks clicks.',
  html:`<section class="ink"><canvas aria-hidden="true"></canvas><div class="copy"><p class="kicker">Draw with the pointer</p><h1>Leave a<br>mark.</h1><p class="lede">Strokes fade after a second, so the page stays clean.</p></div></section>`,
  css:`.ink{position:relative;height:100vh;background:#fdf6e3;overflow:hidden;cursor:crosshair}
canvas{position:absolute;inset:0;width:100%;height:100%}
.copy{position:relative;z-index:1;height:100%;display:grid;align-content:center;gap:14px;padding:0 8vw;pointer-events:none}.copy h1{font-size:clamp(56px,9vw,130px);color:#1a1a2e}`,
  js:`const c=document.querySelector('canvas'),x=c.getContext('2d'),pts=[],life=1000;
function size(){const d=Math.min(2,devicePixelRatio);c.width=c.clientWidth*d;c.height=c.clientHeight*d;x.setTransform(d,0,0,d,0,0);}size();addEventListener('resize',size);
c.parentNode.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();pts.push({x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now()});});
(function loop(now){x.clearRect(0,0,c.width,c.height);while(pts.length&&now-pts[0].t>life)pts.shift();
 for(let i=1;i<pts.length-1;i++){const a=pts[i-1],b=pts[i],n=pts[i+1],age=(now-b.t)/life;x.beginPath();x.moveTo((a.x+b.x)/2,(a.y+b.y)/2);x.quadraticCurveTo(b.x,b.y,(b.x+n.x)/2,(b.y+n.y)/2);x.lineWidth=Math.max(.5,(1-age)*14*FX.i);x.lineCap='round';x.strokeStyle='rgba(255,72,176,'+(1-age)+')';x.stroke();}
 if(!FX.R)requestAnimationFrame(loop);})(performance.now());`},

 {id:'L30',name:'Infinite canvas',isNew:true,tags:['Pointer','Navigation'],perf:['transform','Low'],about:'Drag, scroll-zoom or use the arrow keys to roam a moodboard that never ends; tiles wrap around in every direction.',
  html:`<section class="ic" tabindex="0" aria-label="Infinite moodboard. Drag, or use arrow keys and plus or minus to zoom."><div class="world"></div><div class="hud"><button data-z="1.2" aria-label="Zoom in">+</button><button data-z="0.83" aria-label="Zoom out">−</button><button data-reset>Reset</button><span class="kicker">Drag · scroll · arrows</span></div></section>`,
  css:`.ic{position:relative;height:100vh;overflow:hidden;background:#e9edf3;cursor:grab;touch-action:none;outline:none}
.ic:active{cursor:grabbing}.ic:focus-visible{box-shadow:inset 0 0 0 3px #0369a1}
.world{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}
.tile{position:absolute;width:220px;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 10px 24px -14px rgba(13,18,32,.4);user-select:none;-webkit-user-drag:none}
.tile img{width:100%;aspect-ratio:var(--ar);object-fit:cover;pointer-events:none}
.tile span{display:block;padding:8px 12px;font:400 18px "Cormorant Garamond",serif}
.hud{position:absolute;left:20px;bottom:20px;display:flex;gap:8px;align-items:center;background:rgba(255,255,255,.85);backdrop-filter:blur(10px);padding:8px;border-radius:999px}
.hud button{font:600 14px "Manrope",sans-serif;min-width:38px;height:38px;border-radius:999px;border:1px solid #d9dee6;background:#fff;cursor:pointer;padding:0 12px}
.hud .kicker{padding:0 8px}`,
  js:`const names=['origami','statue','wave','swirl','moon','voronoi','constellation','contours','fluid','lattice','moire','nebula','cymatics','lake','mercury','smoke','cathedral','castle','lighthouse','owl','audio','cells','amber','fox','coast','synthwave','bird','riso','scope','deer','tree','garden'];
const ic=document.querySelector('.ic'),world=document.querySelector('.world'),CELL=260,COLS=8,ROWS=4;let ox=0,oy=0,z=1,drag=null;
const tiles=[];for(let r=0;r<ROWS*2;r++)for(let col=0;col<COLS*2;col++){const n=names[(r*COLS+col)%names.length],t=document.createElement('div');t.className='tile';t.style.setProperty('--ar',['1','4/5','5/4'][(r+col)%3]);t.innerHTML='<img src="'+IMGS+n+'.webp" alt="" loading="lazy"><span>'+n[0].toUpperCase()+n.slice(1)+'</span>';world.append(t);tiles.push({t,c:col,r,off:(col%2)*90});}
function draw(){const W=COLS*2*CELL,H=ROWS*2*CELL;for(const o of tiles){let px=((o.c*CELL+ox)%W+W)%W-CELL,py=((o.r*CELL+o.off+oy)%H+H)%H-CELL;o.t.style.transform='translate('+px+'px,'+py+'px)';}world.style.transform='scale('+z+')';}
ic.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};ic.setPointerCapture(e.pointerId);});
ic.addEventListener('pointermove',e=>{if(!drag)return;ox+=(e.clientX-drag.x)/z;oy+=(e.clientY-drag.y)/z;drag={x:e.clientX,y:e.clientY};draw();});
ic.addEventListener('pointerup',()=>drag=null);
ic.addEventListener('wheel',e=>{e.preventDefault();z=FX.clamp(z*(e.deltaY<0?1.08:.93),.4,2.2);draw();},{passive:false});
ic.addEventListener('keydown',e=>{const s=60;if(e.key==='ArrowLeft')ox+=s;else if(e.key==='ArrowRight')ox-=s;else if(e.key==='ArrowUp')oy+=s;else if(e.key==='ArrowDown')oy-=s;else if(e.key==='+'||e.key==='=')z=Math.min(2.2,z*1.2);else if(e.key==='-')z=Math.max(.4,z/1.2);else return;e.preventDefault();draw();});
document.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{z=FX.clamp(z*+b.dataset.z,.4,2.2);draw();});document.querySelector('[data-reset]').onclick=()=>{ox=oy=0;z=1;draw();};
draw();const IMGS='${IMG}';`},

 {id:'L31',name:'Film reel hero',isNew:true,tags:['Media','Reveal'],perf:['opacity (two video layers)','Medium'],about:'A full-screen hero that crossfades between short films, with a plate index and progress bars like the atlas home page. Only two videos exist at a time; reduced motion shows posters and waits for a click.',
  html:`<section class="reel"><div class="stage"><div class="layer"></div><div class="layer"></div><div class="shade"></div></div><div class="copy wrap"><p class="kicker" id="rNo"></p><h1 id="rTitle"></h1><p class="lede" id="rDesc"></p><button class="pp" type="button" id="rPlay"></button></div><ol class="idx wrap" aria-label="Films"></ol></section>${END('Plates that move.')}`,
  css:`.reel{position:relative;min-height:100vh;display:grid;grid-template-rows:1fr auto;background:#02040b;color:#eef2f8;overflow:hidden}
.stage,.layer,.shade{position:absolute;inset:0}.layer{opacity:0;transition:opacity calc(var(--fx-duration)*1.2) var(--fx-ease)}.layer.on{opacity:1}
.layer video{width:100%;height:100%;object-fit:cover}
.shade{background:linear-gradient(90deg,rgba(2,4,11,calc(.9*var(--fx-intensity))) 0%,rgba(2,4,11,.35) 45%,transparent 75%),linear-gradient(0deg,rgba(2,4,11,.9),transparent 40%)}
.copy{position:relative;align-self:center;display:grid;gap:16px;max-width:760px;margin:0;padding-top:14vh}
.copy .kicker{color:#fda4af}.copy h1{font-size:clamp(52px,8vw,120px);color:#eef2f8}.copy .lede{color:#a8b3c7}
.pp{justify-self:start;font:600 14px "Manrope",sans-serif;color:#eef2f8;background:none;border:1px solid rgba(238,242,248,.4);border-radius:999px;padding:10px 18px;cursor:pointer}
.idx{position:relative;list-style:none;margin:0;padding:20px 6vw 30px;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(140px,1fr);gap:12px;overflow-x:auto;max-width:none}
.idx button{all:unset;display:grid;gap:6px;width:100%;cursor:pointer;color:#a8b3c7}.idx button[aria-current="true"]{color:#eef2f8}
.idx button:focus-visible{outline:2px solid #fda4af;outline-offset:4px}
.bar{height:2px;background:rgba(238,242,248,.2)}.bar i{display:block;height:100%;background:#fda4af;transform:scaleX(0);transform-origin:left}
.idx small{font:500 10px "JetBrains Mono",monospace;letter-spacing:.14em;text-transform:uppercase}.idx b{font:400 18px "Cormorant Garamond",serif}`,
  js:`const FILM='assets/films/';
const list=[['ferrofluid','Ferrofluid','Glossy peaks rise in rings and sink back into a calm pool.'],['suminagashi','Suminagashi','Floating ink drawn into slow marbled tendrils.'],['soap-film','Soap film','Interference colours swirl, then the film bursts.'],['bioluminescent-trails','Bioluminescence','Rivers of light drift through the dark.']];
const L=[...document.querySelectorAll('.layer')],idx=document.querySelector('.idx'),btn=document.getElementById('rPlay');
idx.innerHTML=list.map((f,i)=>'<li><button type="button" data-i="'+i+'"><span class="bar"><i></i></span><small>Plate '+(i+1)+'</small><b>'+f[1]+'</b></button></li>').join('');
const B=[...idx.querySelectorAll('button')],SHOW=FX.d*8;let cur=-1,front=0,t0=0,paused=FX.R;
function show(i){cur=(i+list.length)%list.length;const f=list[cur];front=1-front;const a=L[front],b=L[1-front];
 a.innerHTML='<video muted loop playsinline poster="'+FILM+f[0]+'.jpg" src="'+FILM+f[0]+'.mp4"></video>';if(!paused)a.firstChild.play().catch(()=>{});
 a.classList.add('on');b.classList.remove('on');setTimeout(()=>{if(!b.classList.contains('on'))b.innerHTML='';},FX.d*1.4);
 document.getElementById('rNo').textContent='Plate '+(cur+1)+' of '+list.length;document.getElementById('rTitle').textContent=f[1];document.getElementById('rDesc').textContent=f[2];
 B.forEach((x,k)=>{x.setAttribute('aria-current',String(k===cur));x.querySelector('i').style.transform=k<cur?'scaleX(1)':'scaleX(0)';});t0=performance.now();}
function label(){btn.textContent=paused?'Play the reel':'Pause the reel';}
(function loop(now){if(!paused&&cur>=0){const p=Math.min(1,(now-t0)/SHOW);B[cur].querySelector('i').style.transform='scaleX('+p+')';if(p>=1)show(cur+1);}requestAnimationFrame(loop);})(0);
B.forEach(b=>b.onclick=()=>{show(+b.dataset.i);if(paused)L[front].firstChild.play().catch(()=>{});});
btn.onclick=()=>{paused=!paused;label();const v=L[front].firstChild;if(paused)v.pause();else{v.play().catch(()=>{});t0=performance.now();}};
show(0);label();`},

 {id:'L32',name:'Scroll-scrubbed film',isNew:true,tags:['Scroll','Media'],perf:['video.currentTime (keyframe-dense encode)','Medium'],about:'The page scroll drives the film: scroll down and the pen draws, scroll up and it rewinds. Captions arrive at set points. The film is encoded with a keyframe every few frames so seeking stays smooth.',
  html:`<section class="wrap" style="padding:14vh 6vw 8vh"><p class="kicker">Specimen A80</p><h1 style="font-size:clamp(48px,7vw,104px)">Scroll to draw.</h1></section><section class="scrub"><div class="pin"><video muted playsinline preload="auto" poster="assets/films/lissajous-drawing.jpg" src="assets/films/lissajous-scrub.mp4"></video><div class="caps"><p data-at="0.08">Two pendulums swing at right angles.</p><p data-at="0.38">Their ratio sets the figure.</p><p data-at="0.68">Damping draws the curve inward.</p></div><div class="meter"><i></i></div></div></section>${END('The drawing is yours to scrub.')}`,
  css:`.scrub{height:calc(320vh * var(--fx-intensity))}
.pin{position:sticky;top:0;height:100vh;overflow:hidden;background:#0d1220}
.pin video{width:100%;height:100%;object-fit:cover}
.caps{position:absolute;left:0;bottom:0;display:grid;gap:10px;width:min(100%,560px);padding:18vh 6vw 12vh;background:radial-gradient(120% 100% at 0% 100%,rgba(13,18,32,.82),rgba(13,18,32,0) 70%)}
.caps p{font:400 clamp(26px,3vw,42px)/1.05 "Cormorant Garamond",serif;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,.6);opacity:0;transform:translateY(16px);transition:opacity var(--fx-duration) var(--fx-ease),transform var(--fx-duration) var(--fx-ease)}
.caps p.on{opacity:1;transform:none}
.meter{position:absolute;left:6vw;right:6vw;bottom:6vh;height:2px;background:rgba(255,255,255,.25)}.meter i{display:block;height:100%;background:#fde68a;transform-origin:left;transform:scaleX(0)}`,
  js:`const sec=document.querySelector('.scrub'),v=sec.querySelector('video'),caps=[...sec.querySelectorAll('.caps p')],bar=sec.querySelector('.meter i');let target=0,cur=0;
function frame(){const p=FX.progress(sec);target=p;cur+=(target-cur)*(FX.R?1:.18);bar.style.transform='scaleX('+cur+')';caps.forEach(c=>c.classList.toggle('on',cur>=+c.dataset.at));
 if(v.duration&&Math.abs(v.currentTime-cur*v.duration)>.03)v.currentTime=cur*(v.duration-.05);requestAnimationFrame(frame);}
v.addEventListener('loadedmetadata',()=>{v.pause();});requestAnimationFrame(frame);`},

 {id:'L33',name:'Film in type',isNew:true,tags:['Type','Media','Scroll'],perf:['transform, mix-blend-mode','Medium'],about:'A film plays inside giant letters. Scroll and the letters grow until you fall through them into the full film. Built with a white layer in screen blend mode, so the letters stay real, selectable text.',
  html:`<section class="ft"><div class="pin"><video muted loop playsinline autoplay poster="assets/films/soap-film.jpg" src="assets/films/soap-film.mp4"></video><div class="mask"><h1>FILM</h1></div><p class="hint kicker">Scroll</p></div></section>${END('Through the letters.')}`,
  css:`.ft{height:260vh}.pin{position:sticky;top:0;height:100vh;overflow:hidden;background:#000}
.pin video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mask{position:absolute;inset:0;background:#fff;mix-blend-mode:screen;display:grid;place-items:center}
.mask h1{font:800 clamp(120px,30vw,420px)/.8 "Manrope",sans-serif;letter-spacing:-.06em;color:#000;transform-origin:50% 52%;will-change:transform}
.hint{position:absolute;left:50%;bottom:6vh;transform:translateX(-50%)}`,
  js:`const s=document.querySelector('.ft'),h=s.querySelector('h1'),m=s.querySelector('.mask'),hint=s.querySelector('.hint');
function f(){const p=FX.R?0:FX.progress(s);const k=1+Math.pow(p,1.6)*6*FX.i;h.style.transform='scale('+k+')';m.style.opacity=String(FX.clamp(1-(p-.4)/.35,0,1));hint.style.opacity=String(1-p*4);requestAnimationFrame(f);}f();
if(FX.R)s.querySelector('video').pause();`},

 {id:'L34',name:'Hover film cards',isNew:true,tags:['Pointer','Media'],perf:['opacity, transform; video created on demand','Low'],about:'Cards show a still until you hover or focus them, then the film fades in and plays. Videos are only created when needed and pause as soon as you leave. On touch, a tap toggles the film.',
  html:`<section class="wrap" style="padding:12vh 6vw"><p class="kicker">Film library</p><h1 style="font-size:clamp(46px,6vw,88px);margin:12px 0 30px">Hover to watch.</h1><div class="fc">${[['embroidery','Embroidery'],['ferrofluid','Ferrofluid'],['hydraulic-erosion','Erosion'],['pixel-sorting','Pixel sorting'],['sand-drawing','Sand drawing'],['game-of-life','Game of Life']].map(([s,t])=>`<button class="card" type="button" data-s="${s}"><img src="assets/films/${s}.jpg" alt=""><b>${t}</b></button>`).join('')}</div></section>${END('Stills until you ask.')}`,
  css:`.fc{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.card{all:unset;position:relative;cursor:pointer;border-radius:16px;overflow:hidden;aspect-ratio:3/2;background:#0d1220;transition:transform var(--fx-duration) var(--fx-ease)}
.card img,.card video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.card video{opacity:0;transition:opacity calc(var(--fx-duration)*.5) ease}.card.on video{opacity:1}
.card.on{transform:scale(calc(1 + .03*var(--fx-intensity)))}
.card b{position:absolute;left:16px;bottom:12px;font:400 26px "Cormorant Garamond",serif;color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.6)}
.card:focus-visible{outline:3px solid #0369a1;outline-offset:4px}
@media(max-width:720px){.fc{grid-template-columns:1fr 1fr}}`,
  js:`const fine=matchMedia('(hover:hover)').matches;
document.querySelectorAll('.card').forEach(c=>{const on=()=>{if(FX.R)return;let v=c.querySelector('video');if(!v){v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.src='assets/films/'+c.dataset.s+'.mp4';c.prepend(v);c.querySelector('img').after(v);}c.classList.add('on');v.play().catch(()=>{});};
 const off=()=>{c.classList.remove('on');c.querySelector('video')?.pause();};
 if(fine){c.addEventListener('pointerenter',on);c.addEventListener('pointerleave',off);}else c.addEventListener('click',()=>c.classList.contains('on')?off():on());
 c.addEventListener('focus',on);c.addEventListener('blur',off);});`},
 ];

 // A few scripts declare their image path last; move that declaration to the top so it exists before use.
 E.forEach(e=>{const re=/const (IMGPATH|FRAMES|IMGS)='[^']*';\s*$/;const m=e.js.match(re);if(m)e.js=m[0].trim()+'\n'+e.js.slice(0,m.index).replace(/;?\s*$/,';');});

 const EASES={expressive:['Expressive','cubic-bezier(.2,.7,.1,1)'],standard:['Standard','cubic-bezier(.4,0,.2,1)'],spring:['Spring','linear(0,.009,.035 2.1%,.141,.281 6.7%,.723 12.9%,.938 16.7%,1.017,1.077,1.121,1.149 24.3%,1.159,1.163,1.161,1.154 29.9%,1.129 32.8%,1.051 39.6%,1.017 43.1%,.991,.977 51%,.974 53.8%,.975 57.1%,.997 69.8%,1.003 76.9%,1.004 83.8%,1)'],linear:['Linear','linear'],snappy:['Snappy','cubic-bezier(.7,0,.2,1)']};
 const FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Manrope:wght@400;600&family=JetBrains+Mono:wght@500&display=swap">';
 function doc(e,o,forExport){
  const root=`html{--fx-intensity:${o.intensity};--fx-duration:${o.duration}ms;--fx-ease:${EASES[o.ease][1]}}`;
  return `<!doctype html>\n<html lang="en"${o.reduce&&!forExport?' class="reduce"':''}>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${e.id} ${e.name}</title>\n${FONTS}\n${e.extraHead||''}\n<style>\n${root}\n${BASE_CSS}\n${e.css}\n</style>\n</head>\n<body>\n${e.html}\n<script>\n${BASE_JS}\n${e.js}\n<\/script>\n</body>\n</html>`;
 }

 /* ---------- Lab UI ---------- */
 const S={filter:'All',device:'desktop',intensity:1,duration:900,ease:'expressive',reduce:matchMedia('(prefers-reduced-motion: reduce)').matches,codeTab:'full'};
 const THUMB={L01:'castle',L02:'lake',L03:'amber',L04:'nebula',L05:'scope',L06:'riso',L07:'contours',L08:'mercury',L09:'thermal',L10:'smoke',L11:'synthwave',L12:'coast',L13:'origami',L14:'pointface',L15:'fieldlines',L16:'constellation',L17:'bird',L18:'garden',L19:'voronoi',L20:'cathedral',L21:'exploded',L22:'mandelbulb',L23:'film/f30',L24:'tree',L25:'fluid',L26:'audio',L27:'cells',L28:'wave',L29:'riso',L30:'fox',L31:'film-reel',L32:'film-scrub',L33:'film-type',L34:'film-cards'};
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 let root,dlg,frame,timer;
 function build(){
  const page=document.getElementById('effects');if(!page||document.getElementById('effectsLab'))return;
  root=document.createElement('section');root.id='effectsLab';root.className='fxl';
  const tags=['All','New','Scroll','Pointer','Reveal','Type','Media','Canvas','WebGL','Navigation'];
  root.innerHTML=`<div class="fxl-head"><div><p class="fxl-kicker">Effects lab · 34 effects · 16 new</p><h2>Scroll them for real.</h2></div><p>Every effect opens full screen in a working page. Tune intensity, duration and easing, check it on a phone, then copy the code: the code is exactly what the preview runs.</p></div>
  <div class="fxl-filters" role="group" aria-label="Filter effects">${tags.map(t=>`<button type="button" data-tag="${t}" aria-pressed="${t==='All'}">${t}</button>`).join('')}</div>
  <div class="fxl-grid" id="fxlGrid"></div>`;
  const anchor=page.querySelector('h1')?.closest('.aeHasBand')?page.querySelector('.aeRelated')||page.querySelector('.intro'):page.querySelector('.intro');
  (anchor||page.firstElementChild).insertAdjacentElement('afterend',root);
  const legacy=document.createElement('h2');legacy.className='fxl-legacy';legacy.textContent='Original effect studies';root.insertAdjacentElement('afterend',legacy);
  root.querySelectorAll('[data-tag]').forEach(b=>b.onclick=()=>{S.filter=b.dataset.tag;root.querySelectorAll('[data-tag]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));grid();});
  if(!dlg){
  dlg=document.createElement('dialog');dlg.className='fxl-dialog';dlg.setAttribute('aria-label','Effect preview');
  dlg.innerHTML=`<div class="fxl-top"><button type="button" class="fxl-close" aria-label="Close preview">←</button><div class="fxl-title"><span class="fxl-kicker" id="fxlCode"></span><b id="fxlName"></b></div>
   <div class="fxl-controls">
    <div class="fxl-seg" role="group" aria-label="Device">${[['desktop','Desktop'],['tablet','Tablet'],['phone','Phone']].map(([k,l])=>`<button type="button" data-device="${k}">${l}</button>`).join('')}</div>
    <label>Intensity<input type="range" id="fxlI" min="0.25" max="2" step="0.25"></label>
    <label>Duration<input type="range" id="fxlD" min="300" max="2000" step="100"><output id="fxlDo"></output></label>
    <label>Easing<select id="fxlE">${Object.entries(EASES).map(([k,[l]])=>`<option value="${k}">${l}</option>`).join('')}</select></label>
    <label class="fxl-check"><input type="checkbox" id="fxlR"> Reduced motion</label>
    <button type="button" class="fxl-btn" id="fxlReplay">Replay</button>
    <button type="button" class="fxl-btn primary" id="fxlCodeBtn" aria-expanded="false">Get the code</button>
   </div></div>
   <div class="fxl-body"><div class="fxl-stage"><div class="fxl-device" id="fxlDevice"><iframe id="fxlFrame" class="fxl-frame" title="Effect preview" loading="lazy"></iframe></div></div>
   <aside class="fxl-side" id="fxlSide" hidden><div class="fxl-perf" id="fxlPerf"></div><p id="fxlAbout" class="fxl-about"></p><div class="fxl-tabs" role="group" aria-label="Code part">${[['full','Full file'],['html','HTML'],['css','CSS'],['js','JS']].map(([k,l])=>`<button type="button" data-code="${k}">${l}</button>`).join('')}<button type="button" id="fxlCopy" class="fxl-copy">Copy</button></div><pre class="fxl-pre"><code id="fxlOut"></code></pre><p class="fxl-note">Image paths point at this site's <code>assets/fx/</code>. Swap in your own images when you reuse the code.</p></aside></div>`;
  document.body.append(dlg);
  frame=dlg.querySelector('#fxlFrame');
  dlg.querySelector('.fxl-close').onclick=()=>dlg.close();
  dlg.addEventListener('close',()=>{frame.srcdoc='';if(location.hash.includes('fx='))history.replaceState(null,'','#effects');});
  dlg.querySelectorAll('[data-device]').forEach(b=>b.onclick=()=>{S.device=b.dataset.device;sync();});
  dlg.querySelector('#fxlI').oninput=e=>{S.intensity=+e.target.value;reload();};
  dlg.querySelector('#fxlD').oninput=e=>{S.duration=+e.target.value;dlg.querySelector('#fxlDo').textContent=S.duration+' ms';reload();};
  dlg.querySelector('#fxlE').onchange=e=>{S.ease=e.target.value;reload(0);};
  dlg.querySelector('#fxlR').onchange=e=>{S.reduce=e.target.checked;reload(0);};
  dlg.querySelector('#fxlReplay').onclick=()=>reload(0);
  dlg.querySelector('#fxlCodeBtn').onclick=e=>{const side=dlg.querySelector('#fxlSide');side.hidden=!side.hidden;e.currentTarget.setAttribute('aria-expanded',String(!side.hidden));code();};
  dlg.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>{S.codeTab=b.dataset.code;code();});
  dlg.querySelector('#fxlCopy').onclick=async e=>{const b=e.currentTarget;try{await navigator.clipboard.writeText(dlg.querySelector('#fxlOut').textContent);b.textContent='Copied';}catch{const r=document.createRange();r.selectNodeContents(dlg.querySelector('#fxlOut'));getSelection().removeAllRanges();getSelection().addRange(r);b.textContent='Selected';}setTimeout(()=>b.textContent='Copy',1600);};
  }
  grid();
  const id=(location.hash.match(/[?&]fx=(L\d\d)/)||[])[1];if(id&&!dlg.open)open(id);
 }
 function grid(){
  const list=E.filter(e=>S.filter==='All'||(S.filter==='New'?e.isNew:e.tags.includes(S.filter)));
  root.querySelector('#fxlGrid').innerHTML=list.map(e=>`<button type="button" class="fxl-card" data-fx="${e.id}"><span class="fxl-thumb"><img src="${IMG}${THUMB[e.id]}.webp" alt="" loading="lazy"><span class="fxl-glyph g-${e.tags[0].toLowerCase()}" aria-hidden="true"></span>${e.isNew?'<span class="fxl-new">New</span>':''}</span><span class="fxl-meta"><span class="fxl-kicker">${e.id} · ${e.tags.join(' · ')}</span><b>${e.name}</b><span class="fxl-cost c-${e.perf[1].toLowerCase().replace(' ','')}">${e.perf[1]} cost</span></span></button>`).join('');
  root.querySelectorAll('[data-fx]').forEach(b=>b.onclick=()=>open(b.dataset.fx));
 }
 let cur=null;
 function open(id){cur=E.find(e=>e.id===id);if(!cur)return;
  dlg.querySelector('#fxlCode').textContent=cur.id+(cur.isNew?' · New':'');dlg.querySelector('#fxlName').textContent=cur.name;
  dlg.querySelector('#fxlI').value=S.intensity;dlg.querySelector('#fxlD').value=S.duration;dlg.querySelector('#fxlDo').textContent=S.duration+' ms';dlg.querySelector('#fxlE').value=S.ease;dlg.querySelector('#fxlR').checked=S.reduce;
  dlg.querySelector('#fxlPerf').innerHTML=`<span class="fxl-cost c-${cur.perf[1].toLowerCase().replace(' ','')}">${cur.perf[1]} cost</span><span>Animates <b>${esc(cur.perf[0])}</b></span><span>${/transform|opacity|clip|compositor|CSS only/.test(cur.perf[0])?'Stays on the compositor where supported':'Runs on the main thread; paused when off screen'}</span>`;
  dlg.querySelector('#fxlAbout').textContent=cur.about;
  if(!dlg.open)dlg.showModal();
  history.replaceState(null,'','#effects?fx='+id);
  sync();reload(0);code();
 }
 function sync(){dlg.querySelectorAll('[data-device]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.device===S.device)));dlg.querySelector('#fxlDevice').dataset.device=S.device;}
 function reload(delay=220){clearTimeout(timer);timer=setTimeout(()=>{frame.srcdoc=doc(cur,S,false);code();},delay);}
 function code(){if(!cur||dlg.querySelector('#fxlSide').hidden)return;dlg.querySelectorAll('[data-code]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.code===S.codeTab)));
  const full=doc(cur,S,true);const parts={full,html:cur.html,css:`html{--fx-intensity:${S.intensity};--fx-duration:${S.duration}ms;--fx-ease:${EASES[S.ease][1]}}\n${BASE_CSS}\n${cur.css}`,js:BASE_JS+'\n'+cur.js};
  dlg.querySelector('#fxlOut').textContent=parts[S.codeTab];}
 window.EffectsLab={effects:E,open,build,doc:(id,o)=>doc(E.find(e=>e.id===id),Object.assign({},S,o||{}),true)};
 // landing.js rebuilds #effects when the catalogue loads, so rebuild the lab whenever it goes missing
 function watch(){build();const page=document.getElementById('effects');if(page)new MutationObserver(()=>{if(!document.getElementById('effectsLab'))build();}).observe(page,{childList:true});}
 if(document.readyState!=='loading')watch();else addEventListener('DOMContentLoaded',watch);
 addEventListener('hashchange',()=>{const id=(location.hash.match(/[?&]fx=(L\d\d)/)||[])[1];if(id&&root&&(!dlg.open||cur?.id!==id))open(id);});
})();
