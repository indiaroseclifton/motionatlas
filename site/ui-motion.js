'use strict';
/* Animation studio, lower half: the nine live simulations on a clean dark stage, and twenty UI micro-interactions as
   live cards. Each card plays itself while on screen, hands over to the pointer when you hover or tap it, and copies
   as a standalone snippet. The old 2D sketch viewer stays in the DOM (other modules still drive it) but is hidden. */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const T=ms=>`calc(${ms}ms * var(--slow,1))`;
 const SPRING='linear(0,.009,.035 2.1%,.141,.281 6.7%,.723 12.9%,.938 16.7%,1.017,1.077,1.121,1.149 24.3%,1.159,1.163,1.161,1.154 29.9%,1.129 32.8%,1.051 39.6%,1.017 43.1%,.991,.977 51%,.974 53.8%,.975 57.1%,.997 69.8%,1.003 76.9%,1)';
 const OUT='cubic-bezier(.2,.7,.1,1)';
 const VARS=`.st{--bg:#0f1116;--card:#191c23;--card2:#232731;--line:rgba(255,255,255,.09);--ink:#efe9dc;--mute:#9b968b;--gold:#e5c27c;--ok:#8fd3a8;--bad:#f0907e;color:var(--ink);font:14px/1.4 'Atlas Sans',Inter,system-ui,sans-serif;width:100%;height:100%;display:grid;place-items:center;position:relative;overflow:hidden;-webkit-font-smoothing:antialiased}
*,*::before,*::after{box-sizing:border-box}button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}button:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.mono{font:500 10px/1 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}`;
 const ic={check:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chev:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  file:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg>',
  grip:'<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg>'};
 const tog=(r,on)=>r.classList.toggle('on',on);
 const D=[
 {id:'M01',title:'Fade & short rise',use:'New content arrives without pulling focus: toasts, saved states, inline messages.',every:1500,
  html:`<div class="toast" role="status"><span class="dot"></span><div><b>Draft saved</b><small>Just now &middot; Version 12</small></div></div>`,
  css:`.toast{display:flex;gap:14px;align-items:center;padding:14px 20px 14px 16px;background:var(--card);border:1px solid var(--line);border-radius:14px;box-shadow:0 18px 40px -18px #000;opacity:0;transform:translateY(12px);transition:opacity ${T(260)} ease-out,transform ${T(420)} ${OUT}}
.toast b{display:block;font-weight:600}.toast small{color:var(--mute);font-size:12px}.dot{width:10px;height:10px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 4px rgba(143,211,168,.15)}
.on .toast{opacity:1;transform:none}`,
  tick:(r,n)=>tog(r,n%2===0),init:r=>r.addEventListener('click',()=>r.classList.toggle('on'))},
 {id:'M02',title:'Staggered reveal',use:'Related items enter in reading order, 50–80 ms apart. Lists, menus, search results.',every:1900,
  html:`<ul class="list">${[['Moodboard','12 images'],['Type pairing','Cormorant &middot; Inter'],['Colour study','5 swatches'],['Motion notes','3 curves']].map(([a,b],i)=>`<li style="--i:${i}"><span class="sw sw${i}"></span><div><b>${a}</b><small>${b}</small></div></li>`).join('')}</ul>`,
  css:`.list{list-style:none;margin:0;padding:0;width:min(78%,300px);display:grid;gap:8px}.list li{display:flex;gap:12px;align-items:center;padding:10px 12px;border-radius:12px;background:var(--card);border:1px solid var(--line);opacity:0;transform:translateY(10px);transition:opacity ${T(260)} ease-out,transform ${T(380)} ${OUT};transition-delay:calc(var(--i) * 70ms * var(--slow,1))}
.list b{display:block;font-weight:600;font-size:13px}.list small{color:var(--mute);font-size:11.5px}.sw{width:30px;height:30px;border-radius:8px;flex:none}.sw0{background:linear-gradient(135deg,#3a4152,#8a7a62)}.sw1{background:#e8e2d4}.sw2{background:conic-gradient(#e5c27c,#d3786b,#7f9fd6,#8fd3a8,#e5c27c)}.sw3{background:linear-gradient(90deg,#232731 30%,#e5c27c 30% 34%,#232731 34%)}
.on .list li{opacity:1;transform:none}`,
  tick:(r,n)=>tog(r,n%2===0),init:r=>r.addEventListener('click',()=>r.classList.toggle('on'))},
 {id:'M03',title:'Spring & settle',use:'Things that are thrown or released overshoot slightly and settle. Sheets, drawers, picked-up objects.',every:1900,
  html:`<div class="sheet"><span class="handle"></span><p class="mono">Share to</p><div class="people">${['IR','MK','JS','AL'].map((p,i)=>`<span class="av a${i}">${p}</span>`).join('')}</div><button class="go">Send</button></div>`,
  css:`.sheet{position:absolute;left:50%;bottom:-6px;width:min(82%,320px);padding:12px 20px 22px;background:var(--card);border:1px solid var(--line);border-radius:20px 20px 0 0;display:grid;justify-items:center;gap:12px;translate:-50% 110%;transition:translate ${T(380)} cubic-bezier(.4,0,1,1)}
.on .sheet{translate:-50% 0;transition:translate ${T(900)} cubic-bezier(.34,1.45,.5,1);transition-timing-function:${SPRING}}
.handle{width:38px;height:4px;border-radius:4px;background:var(--line)}.people{display:flex;gap:10px}.av{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:600;color:#111}.a0{background:#e5c27c}.a1{background:#9fc2e8}.a2{background:#e8a59a}.a3{background:#a9dbbc}
.go{width:100%;padding:10px;border-radius:10px;background:var(--ink);color:#111;font-weight:600}`,
  tick:(r,n)=>tog(r,n%2===0),init:r=>r.addEventListener('click',e=>{if(!e.target.closest('.go'))r.classList.toggle('on');})},
 {id:'M04',title:'Hover, focus & press',use:'Every control answers: lift on hover, a clear ring on keyboard focus, a small dip when pressed.',every:900,
  html:`<div class="wrap"><button class="btn">Publish direction</button><p class="mono state">Rest</p></div>`,
  css:`.wrap{display:grid;justify-items:center;gap:22px}.btn{padding:14px 26px;border-radius:999px;background:var(--gold);color:#16130c;font-weight:600;box-shadow:0 1px 0 rgba(255,255,255,.4) inset,0 6px 16px -10px var(--gold);transition:transform ${T(160)} ease-out,box-shadow ${T(200)} ease-out,background ${T(200)}}
.btn:hover,.s1 .btn{transform:translateY(-2px);background:#ecd08f;box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 14px 26px -12px var(--gold)}
.btn:focus-visible,.s2 .btn{outline:2px solid var(--ink);outline-offset:4px}
.btn:active,.s3 .btn{transform:translateY(1px) scale(.97);box-shadow:0 1px 0 rgba(255,255,255,.3) inset,0 2px 6px -4px var(--gold);transition-duration:${T(70)}}`,
  tick:(r,n)=>{const s=n%4;r.classList.remove('s1','s2','s3');if(s)r.classList.add('s'+s);r.querySelector('.state').textContent=['Rest','Hover','Keyboard focus','Pressed'][s];},
  init:r=>{const st=r.querySelector('.state'),b=r.querySelector('.btn');b.onpointerenter=()=>st.textContent='Hover';b.onpointerleave=()=>st.textContent='Rest';b.onpointerdown=()=>st.textContent='Pressed';b.onpointerup=()=>st.textContent='Hover';b.onfocus=()=>{if(b.matches(':focus-visible'))st.textContent='Keyboard focus';};}},
 {id:'M05',title:'Magnetic pull',use:'A primary target leans toward a nearby pointer, a few pixels at most. Hero calls to action, cursor-led sites.',
  html:`<div class="field"><button class="mag" aria-label="Continue">${ic.arrow}</button><span class="ring"></span><span class="cur"></span></div>`,
  css:`.field{position:relative;width:100%;height:100%;display:grid;place-items:center}.mag{width:74px;height:74px;border-radius:50%;background:var(--ink);color:#111;display:grid;place-items:center;transition:transform ${T(260)} ${OUT};position:relative;z-index:1}.mag svg{transition:transform ${T(260)} ${OUT}}
.ring{position:absolute;width:180px;height:180px;border-radius:50%;border:1px dashed var(--line)}.cur{position:absolute;left:0;top:0;width:12px;height:12px;margin:-6px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 5px rgba(229,194,124,.18);pointer-events:none;z-index:2}
.st.live .cur{opacity:0}`,
  frame(r,t){const f=r.querySelector('.field'),w=f.clientWidth,h=f.clientHeight,x=w/2+Math.cos(t*.9)*w*.3,y=h/2+Math.sin(t*1.6)*h*.26;r.querySelector('.cur').style.transform=`translate(${x}px,${y}px)`;this.pull(r,x,y);},
  pull(r,x,y){const f=r.querySelector('.field'),m=r.querySelector('.mag'),cx=f.clientWidth/2,cy=f.clientHeight/2,dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy),k=d<90?(1-d/90):0;m.style.transform=`translate(${dx*k*.35}px,${dy*k*.35}px)`;m.firstElementChild.style.transform=`translate(${dx*k*.12}px,${dy*k*.12}px)`;},
  init(r){const f=r.querySelector('.field');f.onpointermove=e=>{const b=f.getBoundingClientRect();this.pull(r,e.clientX-b.left,e.clientY-b.top);};f.onpointerleave=()=>this.pull(r,-999,-999);}},
 {id:'M06',title:'Tilt & glare',use:'A shallow turn toward the pointer suggests a physical card. Keep it under 8°, and only on large targets.',
  html:`<div class="scene"><div class="card"><div class="art"></div><div class="meta"><span class="mono">Plate 07</span><b>Glass study</b></div><span class="glare"></span></div></div>`,
  css:`.scene{perspective:700px}.card{width:200px;border-radius:16px;background:var(--card);border:1px solid var(--line);overflow:hidden;position:relative;transform-style:preserve-3d;box-shadow:0 30px 50px -30px #000;transition:transform ${T(120)} linear}
.art{height:150px;background:radial-gradient(circle at 30% 30%,#f4e3b8,transparent 45%),radial-gradient(circle at 70% 70%,#7f9fd6,transparent 50%),linear-gradient(135deg,#2a2f3b,#1a1d24)}.meta{padding:12px 14px;display:grid;gap:6px}.meta b{font-family:'Cormorant Garamond',Georgia,serif;font-size:21px;font-weight:500}
.glare{position:absolute;inset:0;background:radial-gradient(circle at var(--gx,50%) var(--gy,30%),rgba(255,255,255,.22),transparent 45%);pointer-events:none;mix-blend-mode:screen}`,
  set(r,x,y){const c=r.querySelector('.card');c.style.transform=`rotateX(${-y*8}deg) rotateY(${x*10}deg)`;c.style.setProperty('--gx',50+x*60+'%');c.style.setProperty('--gy',50+y*60+'%');},
  frame(r,t){this.set(r,Math.sin(t*.8)*.8,Math.cos(t*1.1)*.6);},
  init(r){const s=r.querySelector('.scene');r.onpointermove=e=>{const b=r.getBoundingClientRect();this.set(r,(e.clientX-b.left)/b.width*2-1,(e.clientY-b.top)/b.height*2-1);};r.onpointerleave=()=>this.set(r,0,0);}},
 {id:'M07',title:'State morph',use:'One control changes shape to show what is happening: action → working → done, without swapping elements.',every:1100,
  html:`<button class="mb"><span class="lbl add">Add to project</span><span class="spin"></span><span class="lbl done">${ic.check} Added</span></button>`,
  css:`.mb{position:relative;height:48px;width:190px;border-radius:999px;background:var(--ink);color:#111;font-weight:600;transition:width ${T(380)} ${OUT},background ${T(300)},color ${T(300)};overflow:hidden}
.lbl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:6px;transition:opacity ${T(200)},transform ${T(300)} ${OUT}}.done{opacity:0;transform:translateY(10px)}
.spin{position:absolute;left:50%;top:50%;width:20px;height:20px;margin:-10px;border-radius:50%;border:2px solid rgba(0,0,0,.18);border-top-color:#111;opacity:0;animation:sp calc(.8s * var(--slow,1)) linear infinite;transition:opacity ${T(160)}}
@keyframes sp{to{transform:rotate(1turn)}}
.s1 .mb{width:48px}.s1 .add{opacity:0;transform:translateY(-10px)}.s1 .spin{opacity:1}
.s2 .mb{width:140px;background:var(--ok)}.s2 .add{opacity:0;transform:translateY(-10px)}.s2 .done{opacity:1;transform:none}`,
  tick:(r,n)=>{const s=n%3;r.classList.remove('s1','s2');if(s)r.classList.add('s'+s);},
  init(r){let n=0,t;r.querySelector('.mb').onclick=()=>{clearTimeout(t);n=1;this.tick(r,1);t=setTimeout(()=>{this.tick(r,2);t=setTimeout(()=>this.tick(r,0),1400);},900);};}},
 {id:'M08',title:'Shared element',use:'The thing you tapped travels into its detail view, so people never lose their place.',every:2000,
  html:`<div class="gal">${[0,1,2].map(i=>`<button class="th t${i}" aria-label="Open plate ${i+1}"></button>`).join('')}<div class="det"><span class="mono">Plate 02</span><b>Low tide</b><p>Long exposure, cobalt and bone.</p></div></div>`,
  css:`.gal{position:relative;width:min(86%,330px);height:200px}.th{position:absolute;top:60px;width:30%;height:80px;border-radius:10px;transition:all ${T(520)} ${OUT};background-size:cover}
.t0{left:0;background:linear-gradient(160deg,#c9b38a,#5c4a36)}.t1{left:35%;background:linear-gradient(160deg,#9fc2e8,#2c3d5c 70%,#e8e2d4)}.t2{left:70%;background:linear-gradient(160deg,#d3786b,#3a2230)}
.det{position:absolute;left:0;right:0;bottom:0;display:grid;gap:4px;opacity:0;transform:translateY(8px);transition:opacity ${T(220)},transform ${T(300)} ${OUT}}.det b{font:500 22px/1 'Cormorant Garamond',Georgia,serif}.det p{margin:0;color:var(--mute);font-size:12.5px}
.on .t1{left:0;top:0;width:100%;height:118px;border-radius:14px}.on .t0,.on .t2{opacity:0;transform:scale(.9)}.on .det{opacity:1;transform:none;transition-delay:calc(220ms * var(--slow,1))}`,
  tick:(r,n)=>tog(r,n%2===0),init:r=>r.querySelector('.gal').addEventListener('click',()=>r.classList.toggle('on'))},
 {id:'M09',title:'Tabs with a sliding marker',use:'The marker travels between tabs and the panel shifts in the same direction, so the change has a place.',every:1500,
  html:`<div class="tabs"><div class="seg" role="tablist"><span class="pill"></span>${['Brief','Assets','Log'].map((t,i)=>`<button role="tab" data-i="${i}">${t}</button>`).join('')}</div><div class="panes">${[['Brief','Calm, editorial, warm light.'],['Assets','Cover &middot; Ready<br>Invite &middot; In review'],['Log','Curve tuned to 420 ms']].map(([h,p],i)=>`<div class="pane" data-i="${i}"><b>${h}</b><p>${p}</p></div>`).join('')}</div></div>`,
  css:`.tabs{width:min(84%,300px);display:grid;gap:14px}.seg{position:relative;display:grid;grid-template-columns:repeat(3,1fr);padding:4px;border-radius:12px;background:var(--card);border:1px solid var(--line)}.seg button{position:relative;z-index:1;padding:9px 0;font-size:13px;color:var(--mute);transition:color ${T(200)}}.seg button[aria-selected=true]{color:#111;font-weight:600}
.pill{position:absolute;top:4px;bottom:4px;left:4px;width:calc((100% - 8px)/3);border-radius:9px;background:var(--ink);transform:translateX(calc(var(--t,0) * 100%));transition:transform ${T(380)} ${OUT}}
.panes{position:relative;height:84px}.pane{position:absolute;inset:0;padding:14px 16px;border-radius:12px;background:var(--card);border:1px solid var(--line);opacity:0;transform:translateX(calc(var(--d,1) * 14px));transition:opacity ${T(220)},transform ${T(340)} ${OUT};pointer-events:none}.pane.cur{opacity:1;transform:none;pointer-events:auto}.pane b{font-size:13px}.pane p{margin:6px 0 0;color:var(--mute);font-size:12.5px;line-height:1.5}`,
  pick(r,i){const prev=+(r.dataset.t||0);r.dataset.t=i;r.style.setProperty('--t',i);r.style.setProperty('--d',i>=prev?1:-1);r.querySelectorAll('[role=tab]').forEach(b=>b.setAttribute('aria-selected',String(+b.dataset.i===i)));r.querySelectorAll('.pane').forEach(p=>p.classList.toggle('cur',+p.dataset.i===i));},
  tick(r,n){this.pick(r,n%3);},init(r){this.pick(r,0);r.querySelectorAll('[role=tab]').forEach(b=>b.onclick=()=>this.pick(r,+b.dataset.i));}},
 {id:'M10',title:'Accordion',use:'Detail opens right where it was asked for; the rows below make room smoothly instead of jumping.',every:1500,
  html:`<div class="acc">${[['What is included?','Tokens, type scale and three starter screens.'],['Can I change the colours?','Every colour is a variable you can retune.'],['Is it accessible?','Contrast-checked, keyboard-first, reduced-motion aware.']].map(([q,a],i)=>`<div class="row" data-i="${i}"><button class="q"><span>${q}</span>${ic.chev}</button><div class="a"><div><p>${a}</p></div></div></div>`).join('')}</div>`,
  css:`.acc{width:min(86%,320px);border-top:1px solid var(--line)}.row{border-bottom:1px solid var(--line)}.q{width:100%;display:flex;justify-content:space-between;align-items:center;padding:12px 2px;font-size:13.5px;text-align:left}.q svg{color:var(--mute);transition:transform ${T(300)} ${OUT}}
.a{display:grid;grid-template-rows:0fr;transition:grid-template-rows ${T(360)} ${OUT}}.a>div{overflow:hidden}.a p{margin:0 0 12px;color:var(--mute);font-size:12.5px;opacity:0;transition:opacity ${T(200)}}
.row.open .a{grid-template-rows:1fr}.row.open .a p{opacity:1;transition-delay:calc(80ms * var(--slow,1))}.row.open .q svg{transform:rotate(180deg);color:var(--gold)}`,
  open(r,i){r.querySelectorAll('.row').forEach(x=>x.classList.toggle('open',+x.dataset.i===i&&!x.classList.contains('open')));},
  tick(r,n){r.querySelectorAll('.row').forEach(x=>x.classList.toggle('open',+x.dataset.i===n%3));},init(r){r.querySelectorAll('.q').forEach(b=>b.onclick=()=>this.open(r,+b.parentElement.dataset.i));}},
 {id:'M11',title:'Layered parallax',use:'Distant layers move less than near ones. Use a small range on hero art; never on body text.',
  html:`<div class="pl"><span class="sky"></span><span class="moon"></span>${[0,1,2].map(i=>`<svg class="hill h${i}" viewBox="0 0 400 120" preserveAspectRatio="none"><path d="${['M0 70 Q60 30 120 60 T240 50 T400 60 V120 H0Z','M0 85 Q80 50 160 80 T300 70 T400 85 V120 H0Z','M0 100 Q90 75 180 98 T330 92 T400 102 V120 H0Z'][i]}"/></svg>`).join('')}</div>`,
  css:`.pl{position:absolute;inset:0;overflow:hidden}.sky{position:absolute;inset:0;background:linear-gradient(#141826,#2b2a3a 60%,#4a3a3a)}.moon{position:absolute;width:46px;height:46px;border-radius:50%;left:62%;top:18%;background:#f1e4c2;box-shadow:0 0 40px 8px rgba(241,228,194,.25)}
.hill{position:absolute;left:-12%;width:124%;bottom:0;height:62%}.h0{fill:#3a3446}.h1{fill:#262535;height:52%}.h2{fill:#14141d;height:40%}`,
  set(r,x){const k=[6,16,32];r.querySelectorAll('.hill').forEach((h,i)=>h.style.transform=`translateX(${x*k[i]}px)`);r.querySelector('.moon').style.transform=`translateX(${x*2}px)`;},
  frame(r,t){this.set(r,Math.sin(t*.6));},init(r){r.onpointermove=e=>{const b=r.getBoundingClientRect();this.set(r,((e.clientX-b.left)/b.width*2-1));};}},
 {id:'M12',title:'Scroll-driven story',use:'Scroll position drives the scene, so the reader sets the pace. Scroll inside the card to try it.',
  html:`<div class="phone"><span class="bar"><i></i></span><div class="sc" tabindex="0" aria-label="Scrollable story"><div class="hero"><span class="sun"></span><b>The long light</b></div>${['Morning comes slowly over the estuary.','The tide turns; the colour follows.','By noon the water is a sheet of tin.','Evening returns the gold.'].map(p=>`<p>${p}</p>`).join('')}</div></div>`,
  css:`.phone{position:relative;width:200px;height:86%;max-height:250px;border-radius:22px;border:1px solid var(--line);background:var(--card);overflow:hidden}.bar{position:absolute;top:0;left:0;right:0;height:3px;background:var(--line);z-index:2}.bar i{display:block;height:100%;width:100%;background:var(--gold);transform-origin:left;transform:scaleX(var(--p,0))}
.sc{height:100%;overflow-y:auto;scrollbar-width:none;padding:0 16px 30px}.sc::-webkit-scrollbar{display:none}.hero{position:sticky;top:0;height:150px;display:grid;place-items:center;background:var(--card);z-index:1}
.sun{position:absolute;width:70px;height:70px;border-radius:50%;background:radial-gradient(circle,#f3d28b,#d3786b);transform:translateY(calc(var(--p,0) * 50px)) scale(calc(1 - var(--p,0) * .35));opacity:calc(1 - var(--p,0) * .5)}.hero b{position:relative;font:500 22px 'Cormorant Garamond',Georgia,serif;opacity:calc(1 - var(--p,0) * 1.4)}
.sc p{margin:0 0 70px;font-size:13px;color:var(--mute);line-height:1.6}`,
  frame(r,t){const s=r.querySelector('.sc'),m=s.scrollHeight-s.clientHeight;s.scrollTop=m*(.5-.5*Math.cos(t*.5));},
  init(r){const s=r.querySelector('.sc'),ph=r.querySelector('.phone');const on=()=>{const m=s.scrollHeight-s.clientHeight;ph.style.setProperty('--p',m?(s.scrollTop/m).toFixed(3):0);};s.addEventListener('scroll',on,{passive:true});on();}},
 {id:'M13',title:'Mask & line reveal',use:'A wipe uncovers the headline line by line, and its direction says which way things are going.',every:1900,
  html:`<div class="hd"><span class="ln"><span>Reveal</span></span><span class="ln"><span>the idea.</span></span><span class="rule"></span><span class="mono sub">Directional mask</span></div>`,
  css:`.hd{display:grid;gap:2px;justify-items:start}.ln{display:block;font:500 46px/1 'Cormorant Garamond',Georgia,serif;font-style:italic}.ln span{display:block;clip-path:inset(0 100% 0 0);transition:clip-path ${T(560)} cubic-bezier(.65,0,.25,1)}.ln:nth-child(2) span{transition-delay:calc(140ms * var(--slow,1))}
.rule{display:block;width:100%;height:1px;background:var(--gold);margin:14px 0 10px;transform:scaleX(0);transform-origin:left;transition:transform ${T(600)} ${OUT} calc(260ms * var(--slow,1))}.sub{opacity:0;transition:opacity ${T(300)} calc(420ms * var(--slow,1))}
.on .ln span{clip-path:inset(0 0 0 0)}.on .rule{transform:none}.on .sub{opacity:1}`,
  tick:(r,n)=>tog(r,n%2===0),init:r=>r.addEventListener('click',()=>r.classList.toggle('on'))},
 {id:'M14',title:'Kinetic type',use:'Words arrive on a beat to stress a message. Short phrases only, and never for text people must read twice.',every:1700,
  html:`<p class="kt">${['Make','it','move.'].map((w,i)=>`<span class="w" style="--i:${i}"><span>${w}</span></span>`).join(' ')}</p>`,
  css:`.kt{margin:0;font:700 54px/1 'Atlas Display','Archivo Narrow',sans-serif;letter-spacing:-.01em;text-transform:uppercase;display:flex;gap:14px}.w{display:inline-block;overflow:hidden;padding-bottom:4px}.w span{display:inline-block;transform:translateY(105%);transition:transform ${T(520)} cubic-bezier(.7,0,.2,1);transition-delay:calc(var(--i) * 90ms * var(--slow,1))}
.w:last-child span{color:var(--gold)}.reset .w span{transition:none}.on .w span{transform:none}.off .w span{transform:translateY(-105%)}`,
  tick:(r,n)=>{const s=n%3;r.classList.toggle('reset',s===0);r.classList.toggle('off',s===2);r.classList.toggle('on',s===1);},
  init:r=>r.addEventListener('click',()=>{r.classList.remove('off','reset');r.classList.toggle('on');})},
 {id:'M15',title:'Carousel with snap',use:'A bounded set of images people can compare. Swipe or use the arrows; it always settles on a whole card.',every:1600,
  html:`<div class="car"><div class="trk" tabindex="0" aria-label="Gallery">${['#c9b38a,#5c4a36','#9fc2e8,#2c3d5c','#d3786b,#3a2230','#a9dbbc,#24413a'].map((g,i)=>`<div class="sl" style="background:linear-gradient(150deg,${g})"><span class="mono">0${i+1}</span></div>`).join('')}</div><div class="ctl"><button class="pv" aria-label="Previous">&lsaquo;</button><span class="dots">${[0,1,2,3].map(()=>'<i></i>').join('')}</span><button class="nx" aria-label="Next">&rsaquo;</button></div></div>`,
  css:`.car{width:min(88%,330px);display:grid;gap:12px}.trk{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;border-radius:14px}.trk::-webkit-scrollbar{display:none}.sl{flex:0 0 78%;height:140px;border-radius:14px;scroll-snap-align:center;display:flex;align-items:flex-end;padding:12px}.sl .mono{color:rgba(255,255,255,.8)}
.ctl{display:flex;justify-content:space-between;align-items:center}.ctl button{width:34px;height:34px;border-radius:50%;border:1px solid var(--line);font-size:18px;line-height:1}.dots{display:flex;gap:6px}.dots i{width:6px;height:6px;border-radius:6px;background:var(--line);transition:width ${T(300)} ${OUT},background ${T(300)}}.dots i.cur{width:18px;background:var(--ink)}`,
  go(r,i){const t=r.querySelector('.trk'),s=t.children[i];t.scrollTo({left:s.offsetLeft-(t.clientWidth-s.clientWidth)/2,behavior:reduce.matches?'auto':'smooth'});},
  tick(r,n){this.go(r,n%4);},
  init(r){const t=r.querySelector('.trk'),dots=[...r.querySelectorAll('.dots i')],cur=()=>{const c=t.scrollLeft+t.clientWidth/2;let b=0,bd=1e9;[...t.children].forEach((s,i)=>{const d=Math.abs(s.offsetLeft+s.clientWidth/2-c);if(d<bd){bd=d;b=i;}});return b;};
   t.addEventListener('scroll',()=>{const c=cur();dots.forEach((d,i)=>d.classList.toggle('cur',i===c));},{passive:true});dots[0].classList.add('cur');
   r.querySelector('.pv').onclick=()=>this.go(r,Math.max(0,cur()-1));r.querySelector('.nx').onclick=()=>this.go(r,Math.min(3,cur()+1));}},
 {id:'M16',title:'Drag, reorder & snap',use:'The lifted row rises and casts a shadow; the others slide aside and everything snaps into place. Tap a row to send it to the top.',every:1300,
  html:`<div class="ro">${['Brief','References','Artwork','Hand-off'].map((t,i)=>`<button class="it" data-k="${i}"><span class="g">${ic.grip}</span><span>${t}</span><span class="mono n"></span></button>`).join('')}</div>`,
  css:`.ro{position:relative;width:min(80%,280px);height:${4*50-6}px}.it{position:absolute;left:0;right:0;height:44px;display:flex;align-items:center;gap:10px;padding:0 14px;border-radius:11px;background:var(--card);border:1px solid var(--line);font-size:13.5px;text-align:left;transition:transform ${T(380)} ${OUT},box-shadow ${T(200)},background ${T(200)}}
.it .g{color:var(--mute);display:grid}.it .n{margin-left:auto}.it.lift{z-index:2;background:var(--card2);box-shadow:0 18px 30px -14px #000;border-color:rgba(229,194,124,.45)}`,
  lay(r){const o=JSON.parse(r.dataset.o||'[0,1,2,3]');r.querySelectorAll('.it').forEach(el=>{const p=o.indexOf(+el.dataset.k);el.style.transform=`translateY(${p*50}px)${el.classList.contains('lift')?' scale(1.03)':''}`;el.querySelector('.n').textContent='0'+(p+1);});},
  move(r,k){const o=JSON.parse(r.dataset.o||'[0,1,2,3]'),el=r.querySelector(`[data-k="${k}"]`);el.classList.add('lift');this.lay(r);setTimeout(()=>{o.splice(o.indexOf(k),1);o.unshift(k);r.dataset.o=JSON.stringify(o);this.lay(r);setTimeout(()=>{el.classList.remove('lift');this.lay(r);},380*(+getComputedStyle(r).getPropertyValue('--slow')||1));},180*(+getComputedStyle(r).getPropertyValue('--slow')||1));},
  tick(r){const o=JSON.parse(r.dataset.o||'[0,1,2,3]');this.move(r,o[3]);},
  init(r){this.lay(r);r.querySelectorAll('.it').forEach(b=>b.onclick=()=>this.move(r,+b.dataset.k));}},
 {id:'M17',title:'Loading to content',use:'A skeleton holds the layout while work happens, then the real content fades in exactly in its place.',every:1700,
  html:`<div class="lc"><div class="sk"><span class="av"></span><span class="l1"></span><span class="l2"></span><span class="l3"></span></div><div class="ct"><span class="av real"></span><b>Ines R.</b><small>Approved the palette</small><p>“Warmer gold on the hero, otherwise ready.”</p></div><span class="pb"><i></i></span></div>`,
  css:`.lc{position:relative;width:min(84%,300px);height:150px;padding:18px;border-radius:16px;background:var(--card);border:1px solid var(--line);overflow:hidden}.sk,.ct{position:absolute;inset:18px;display:grid;grid-template-columns:40px 1fr;column-gap:12px;row-gap:8px;align-content:start;transition:opacity ${T(300)}}
.av{width:40px;height:40px;border-radius:50%;grid-row:span 2;background:var(--card2)}.av.real{background:linear-gradient(135deg,#e5c27c,#d3786b)}.sk span:not(.av){height:10px;border-radius:6px;background:linear-gradient(90deg,var(--card2) 30%,#2f3440 50%,var(--card2) 70%);background-size:300% 100%;animation:sh calc(1.3s * var(--slow,1)) linear infinite}.l1{width:50%;margin-top:6px}.l2{width:35%}.l3{grid-column:1/-1;width:90%;margin-top:12px}
@keyframes sh{from{background-position:100% 0}to{background-position:-100% 0}}
.ct{opacity:0}.ct b{align-self:end;font-size:13.5px}.ct small{color:var(--mute);font-size:12px}.ct p{grid-column:1/-1;margin:8px 0 0;font-size:13px;line-height:1.5}
.pb{position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--line)}.pb i{display:block;height:100%;background:var(--gold);transform-origin:left;transform:scaleX(0)}
.load .pb i{transform:scaleX(1);transition:transform ${T(1300)} cubic-bezier(.3,.1,.3,1)}.done .sk{opacity:0}.done .ct{opacity:1}.done .pb{opacity:0;transition:opacity ${T(300)}}`,
  tick:(r,n)=>{r.classList.toggle('load',n%2===0);r.classList.toggle('done',n%2===1);},
  init:r=>r.addEventListener('click',()=>{r.classList.remove('done','load');void r.offsetWidth;r.classList.add('load');setTimeout(()=>{r.classList.remove('load');r.classList.add('done');},1400);})},
 {id:'M18',title:'Undo instead of “Are you sure?”',use:'The action happens at once, the row folds away, and a short-lived Undo brings it back.',every:1300,
  html:`<div class="ud"><div class="files">${['Hero film.mp4','Palette v3.ase','Moodboard.pdf'].map((f,i)=>`<div class="fr${i===1?' tgt':''}"><div class="fi">${ic.file}<span>${f}</span>${i===1?'<button class="del">Delete</button>':''}</div></div>`).join('')}</div><div class="snack" role="status"><span>Palette deleted</span><button class="und">Undo</button></div></div>`,
  css:`.ud{position:relative;width:min(86%,310px);height:190px}.files{display:grid}.fr{display:grid;grid-template-rows:1fr;transition:grid-template-rows ${T(320)} ${OUT},opacity ${T(220)}}.fi{overflow:hidden;display:flex;align-items:center;gap:10px;padding:11px 4px;border-bottom:1px solid var(--line);font-size:13px;color:var(--ink)}.fi svg{color:var(--mute);flex:none}.del{margin-left:auto;font-size:12px;color:var(--bad)}
.gone .tgt{grid-template-rows:0fr;opacity:0}.snack{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;align-items:center;padding:11px 14px;border-radius:12px;background:var(--ink);color:#111;font-size:13px;opacity:0;transform:translateY(14px);transition:opacity ${T(220)},transform ${T(380)} ${OUT}}.und{font-weight:700;color:#8a5b12}
.gone .snack{opacity:1;transform:none}.press .und{background:rgba(0,0,0,.08);border-radius:6px}.und{padding:4px 8px}`,
  tick:(r,n)=>{const s=n%3;r.classList.toggle('gone',s===1);r.classList.toggle('press',s===1);},
  init:r=>{r.querySelector('.del').onclick=()=>r.classList.add('gone');r.querySelector('.und').onclick=()=>r.classList.remove('gone','press');}},
 {id:'M19',title:'Exploded view',use:'Layers lift apart to explain how something is built, then reassemble. Product pages, onboarding, diagrams.',every:1900,
  html:`<div class="ex"><div class="stack">${[['Content','#efe9dc'],['Surface','#e5c27c'],['Shadow','#3a3f4c']].map(([l,c],i)=>`<div class="pl p${i}" style="--c:${c};--i:${i}"><span class="mono">${l}</span></div>`).join('')}</div></div>`,
  css:`.ex{perspective:900px}.stack{position:relative;width:170px;height:120px;transform:rotateX(58deg) rotateZ(-38deg);transform-style:preserve-3d}.pl{position:absolute;inset:0;border-radius:14px;background:var(--c);opacity:.92;border:1px solid rgba(255,255,255,.25);transform:translateZ(calc((2 - var(--i)) * 4px));transition:transform ${T(700)} ${OUT};box-shadow:0 0 0 1px rgba(0,0,0,.2)}
.p0{background:linear-gradient(135deg,#f4efe4,#d9d1bf)}.p2{opacity:.6;filter:blur(1px)}.pl .mono{position:absolute;right:-78px;top:40%;transform:rotateZ(38deg) rotateX(-58deg);transform-origin:left;color:var(--ink);opacity:0;transition:opacity ${T(300)}}
.on .pl{transform:translateZ(calc((2 - var(--i)) * 46px))}.on .pl .mono{opacity:1;transition-delay:calc(300ms * var(--slow,1))}`,
  tick:(r,n)=>tog(r,n%2===0),init:r=>r.addEventListener('click',()=>r.classList.toggle('on'))},
 {id:'M20',title:'Ambient breathing',use:'A slow, low-amplitude cycle says “listening” or “alive” without asking for attention. Four seconds or longer.',
  html:`<div class="br"><span class="halo"></span><span class="orb"></span><span class="mono lb">Listening</span></div>`,
  css:`.br{position:relative;display:grid;place-items:center;width:100%;height:100%}.orb{width:96px;height:96px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff6dc,#e5c27c 40%,#b0703f 80%);box-shadow:0 0 60px 10px rgba(229,194,124,.25);animation:bre calc(4.2s * var(--slow,1)) ease-in-out infinite}
.halo{position:absolute;width:150px;height:150px;border-radius:50%;border:1px solid rgba(229,194,124,.3);animation:hal calc(4.2s * var(--slow,1)) ease-in-out infinite}.lb{position:absolute;bottom:14%}
@keyframes bre{0%,100%{transform:scale(.93)}50%{transform:scale(1.04)}}@keyframes hal{0%,100%{transform:scale(.85);opacity:.2}50%{transform:scale(1.05);opacity:.7}}
.paused .orb,.paused .halo{animation-play-state:paused}`}
 ];
 const byId=Object.fromEntries(D.map(d=>[d.id,d]));
 const fnSrc=(k,f)=>{const src=String(f);return src.startsWith(k+'(')?src:k+':'+src;};
 /* a standalone snippet: the styles, the markup and a small script carrying the same behaviour (with the demo loop) */
 const code=d=>{const fns=Object.keys(d).filter(k=>typeof d[k]==='function').map(k=>'  '+fnSrc(k,d[k])).join(',\n');
  return `<meta charset="utf-8">\n<style>\n${VARS}\n.st{min-height:320px}\n${d.css}\n@media (prefers-reduced-motion:reduce){.st *{transition-duration:.01ms!important;animation-duration:.01ms!important}}\n</style>\n<div class="st">\n${d.html}\n</div>\n<script>\n(()=>{const r=document.currentScript.previousElementSibling,reduce=matchMedia('(prefers-reduced-motion: reduce)'),tog=(r,on)=>r.classList.toggle('on',on);\nconst d={\n${fns}\n};\nd.init&&d.init.call(d,r);d.tick&&d.tick.call(d,r,0);\n/* demo loop: delete it and call d.tick (or toggle the "on" class) from your own events */\n${d.tick?`let n=0;if(!reduce.matches)setInterval(()=>d.tick.call(d,r,++n),${d.every});`:d.frame?`const t0=performance.now(),go=t=>{if(!r.matches(':hover'))d.frame.call(d,r,(t-t0)/1000);requestAnimationFrame(go);};if(!reduce.matches)requestAnimationFrame(go);`:''}\n})();\n</script>`;};

 /* ---------- markup ---------- */
 const page=document.getElementById('motion');if(!page)return;
 const band=document.createElement('section');band.className='umBand';band.setAttribute('aria-labelledby','umSimTitle');
 band.innerHTML=`<div class="umSims"><div class="umHead"><p class="umKicker">Live simulations</p><h2 id="umSimTitle">Nine systems you can steer.</h2><p class="umLede">Real physics and maths running in your browser, not loops. Pick one, then drag, click or move the pointer across it.</p></div>
  <div class="umSimRail" role="tablist" aria-label="Simulation"></div><div class="umSimSlot"></div></div>
  <div class="umUI" id="uiMotion"><div class="umHead"><p class="umKicker">UI motion</p><h2>Twenty interactions, ready to copy.</h2><p class="umLede">Small, purposeful movements for interfaces. Each one plays on its own; hover or tap to take over, then copy the code.</p>
   <div class="umTools"><button type="button" class="umTool" id="umSlow" aria-pressed="false">Slow motion</button><button type="button" class="umTool" id="umPause" aria-pressed="false">Pause all</button></div></div>
   <div class="umGrid">${D.map((d,i)=>`<article class="umCard" id="ui-${d.id}" data-um="${d.id}"><div class="umStage"></div><div class="umText"><p class="umNum">${String(i+1).padStart(2,'0')}</p><h3>${d.title}</h3><p>${d.use}</p><div class="umActs"><button type="button" class="umCopy" data-um-copy="${d.id}">Copy code</button><button type="button" class="umMore" data-open="${d.id}">Notes</button></div></div></article>`).join('')}</div></div>`;
 const pg=page.querySelector('.playground');(pg||page.lastElementChild).before(band);
 // the easing lab is a tool; it reads better after the galleries
 const moveEzl=()=>{const ezl=document.getElementById('easingLab');if(ezl&&band.nextElementSibling!==ezl){band.after(ezl);return true;}return !!ezl;};if(!moveEzl()){const w=setInterval(()=>{if(moveEzl())clearInterval(w);},300);setTimeout(()=>clearInterval(w),15000);}
 // retire the sketch viewer's chrome; keep its stage for the simulations
 page.querySelector('.animationChoices')?.setAttribute('hidden','');page.querySelector('.motionheading>div')?.setAttribute('hidden','');
 const intro=page.querySelector(':scope>.intro');if(intro)intro.textContent='Live particle studies and films, nine steerable simulations, twenty UI interactions to copy, and an easing lab for tuning curves.';
 const stage=document.getElementById('motionStage'),sims=(window.LiveSims?.ids)||['A49','A84','A32','A26'];
 if(pg)pg.hidden=true;

 /* ---------- simulations ---------- */
 const rail=band.querySelector('.umSimRail'),slot=band.querySelector('.umSimSlot');
 const simName=id=>{const e=typeof find==='function'?find(id):null;return e?e.title.split(/\s+\/\s+/)[0]:id;};
 let simId=null;
 function buildSims(){const ids=(window.LiveSims?.ids)||[];if(!ids.length||!stage||typeof find!=='function'||!catalogue.length||!find(ids[0]))return false;
  const pref=['A49','A84','A76','A32','A26','A78','A88','A81','A56'];ids.sort((a,b)=>(pref.indexOf(a)+99)%99-(pref.indexOf(b)+99)%99);rail.innerHTML=ids.map(id=>`<button type="button" role="tab" data-sim-id="${id}" aria-selected="false">${simName(id)}</button>`).join('');
  const ctl=document.createElement('div');ctl.className='umSimCtl';ctl.innerHTML=`<p class="umSimNote" id="umSimNote"></p><div><button type="button" class="umTool" id="umSimPause">Pause</button><button type="button" class="umTool" id="umSimFull">Full screen</button><button type="button" class="umTool" id="umSimTune" aria-expanded="false">Tune</button></div>`;
  slot.append(stage,ctl);pickSim(ids.includes('A49')?'A49':ids[0]);const p=document.getElementById('simPanel');if(p){p.classList.add('umSimPanel');slot.append(p);}
  rail.onclick=e=>{const b=e.target.closest('[data-sim-id]');if(b)pickSim(b.dataset.simId);};
  rail.onkeydown=e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;const bs=[...rail.children],i=bs.findIndex(b=>b.dataset.simId===simId),j=(i+(e.key==='ArrowRight'?1:bs.length-1))%bs.length;pickSim(bs[j].dataset.simId);bs[j].focus();};
  document.getElementById('umSimPause').onclick=()=>{document.getElementById('playPause')?.click();setTimeout(syncPause,40);};
  document.getElementById('umSimFull').onclick=()=>{const el=slot;(document.fullscreenElement?document.exitFullscreen():el.requestFullscreen?.())?.catch?.(()=>{});};
  document.getElementById('umSimTune').onclick=e=>{const pn=slot.querySelector('.umSimPanel');if(!pn)return;const open=pn.classList.toggle('isOpen');e.currentTarget.setAttribute('aria-expanded',String(open));};
  return true;}
 function syncPause(){const b=document.getElementById('umSimPause');if(b)b.textContent=window.StudyEngine?.playing===false?'Play':'Pause';}
 function pickSim(id){simId=id;window.selectStudy?.(id);rail.querySelectorAll('[data-sim-id]').forEach(b=>{const on=b.dataset.simId===id;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});
  const note=document.getElementById('motionHint')?.textContent||'';document.getElementById('umSimNote').textContent=note;syncPause();}
 const wait=setInterval(()=>{if(window.selectStudy?.__sims&&buildSims())clearInterval(wait);},250);setTimeout(()=>clearInterval(wait),15000);

 /* ---------- UI motion cards ---------- */
 const state=new Map();let slow=1,pausedAll=reduce.matches;
 for(const card of band.querySelectorAll('.umCard')){const d=byId[card.dataset.um],host=card.querySelector('.umStage'),root=host.attachShadow({mode:'open'});
  root.innerHTML=`<style>${VARS}${d.css}@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important;animation-duration:.01ms!important}}</style><div class="st">${d.html}</div>`;
  const r=root.querySelector('.st'),s={d,r,n:0,timer:0,vis:false,hover:false,host};state.set(d.id,s);
  try{d.init?.call(d,r);}catch(e){console.warn(e);}
  if(d.tick){try{d.tick.call(d,r,0);}catch{}}
  host.addEventListener('pointerenter',()=>{s.hover=true;r.classList.add('live');stop(s);});
  host.addEventListener('pointerleave',()=>{s.hover=false;r.classList.remove('live');setTimeout(()=>schedule(s),1200);});
  host.addEventListener('focusin',()=>{s.hover=true;stop(s);});host.addEventListener('focusout',()=>{s.hover=false;schedule(s);});}
 const running=s=>s.vis&&!s.hover&&!pausedAll&&!document.hidden&&page.classList.contains('active');
 function stop(s){clearTimeout(s.timer);s.timer=0;}
 function schedule(s){stop(s);s.r.classList.toggle('paused',!running(s)&&!s.hover);if(!running(s)||!s.d.tick)return;s.timer=setTimeout(()=>{s.n++;try{s.d.tick.call(s.d,s.r,s.n);}catch(e){console.warn(e);}schedule(s);},s.d.every*slow);}
 const io=new IntersectionObserver(es=>es.forEach(e=>{const s=state.get(e.target.dataset.um);s.vis=e.isIntersecting;schedule(s);if(s.vis)kick();}),{rootMargin:'0px 0px -10% 0px'});
 band.querySelectorAll('.umCard').forEach(c=>io.observe(c));
 let raf=0,t0=performance.now();
 function frame(now){raf=0;let any=false;for(const s of state.values()){if(!s.d.frame||!running(s))continue;any=true;try{s.d.frame.call(s.d,s.r,(now-t0)/1000/slow);}catch{}}if(any)raf=requestAnimationFrame(frame);}
 function kick(){if(!raf&&!pausedAll)raf=requestAnimationFrame(frame);}
 const all=()=>{for(const s of state.values())schedule(s);kick();};
 document.getElementById('umSlow').onclick=e=>{slow=slow===1?4:1;e.currentTarget.setAttribute('aria-pressed',String(slow>1));for(const s of state.values())s.r.style.setProperty('--slow',slow);all();};
 const pb=document.getElementById('umPause');const syncPB=()=>{pb.textContent=pausedAll?'Play all':'Pause all';pb.setAttribute('aria-pressed',String(pausedAll));};syncPB();
 pb.onclick=()=>{pausedAll=!pausedAll;syncPB();all();};
 document.addEventListener('visibilitychange',all);addEventListener('hashchange',()=>setTimeout(all,80));
 band.addEventListener('click',async e=>{const b=e.target.closest('[data-um-copy]');if(!b)return;const txt=code(byId[b.dataset.umCopy]);
  try{await navigator.clipboard.writeText(txt);b.textContent='Copied';}catch{const ta=document.createElement('textarea');ta.value=txt;document.body.append(ta);ta.select();try{document.execCommand('copy');b.textContent='Copied';}catch{b.textContent='Copy failed';}ta.remove();}
  setTimeout(()=>b.textContent='Copy code',1600);});

 /* ---------- old links into the sketch viewer ---------- */
 function show(id){if(!id)return;if(byId[id]){location.hash='motion';setTimeout(()=>{const c=document.getElementById('ui-'+id);c?.scrollIntoView({block:'center',behavior:reduce.matches?'auto':'smooth'});c?.classList.add('isFlash');setTimeout(()=>c?.classList.remove('isFlash'),1600);},120);return;}
  if((window.LiveSims?.ids||[]).includes(id)){location.hash='motion';setTimeout(()=>{pickSim(id);band.querySelector('.umSims').scrollIntoView({block:'start',behavior:reduce.matches?'auto':'smooth'});},120);return;}
  if(typeof openEntry==='function')openEntry(id);}
 window.UIMotion={show,demos:D};
 const readHash=()=>{const m=location.hash.match(/^#motion\?(?:.*&)?id=([AM]\d\d)/);if(m)setTimeout(()=>show(m[1]),300);};
 addEventListener('hashchange',readHash);readHash();
})();
