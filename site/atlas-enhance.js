'use strict';
/* Atlas enhancements for every page except home:
   - a plate band above each page title: plate number, family, and a live Fourier
     drawing in the section's colour (each page has its own curve)
   - "Pairs well with" links under each intro
   - search across every page and catalogue entry (⌘K, Ctrl+K or /)
   - page-entry motion, cards that ease in as they scroll into view
   - a reading-progress line under the header and a back-to-top button
   Everything degrades to the plain page if this script does not run. */
(()=>{
 const PAGES={
  browse:{no:1,name:'Catalogue',family:'Index',color:'ice',related:['systems','motion','art','compare'],h:[1,-2,3,-5],
   film:{src:'assets/films/hydraulic-erosion-720.mp4',webm:'assets/films/hydraulic-erosion-720.webm',poster:'assets/films/hydraulic-erosion-1280.webp',label:'Hydraulic erosion',tone:'light'}},
  systems:{no:2,name:'Design systems',family:'Systems',color:'mint',related:['playground','ux','typography','assets'],h:[1,3,-4,7],
   film:{src:'assets/films/game-of-life-720.mp4',webm:'assets/films/game-of-life-720.webm',poster:'assets/films/game-of-life-1280.webp',label:'Game of Life',tone:'dark'}},
  motion:{no:3,name:'Animation studio',family:'Motion',color:'rose',related:['effects','compare','pairings'],h:[1,-3,5,-7,9],
   film:{src:'assets/films/bioluminescent-trails-720.mp4',webm:'assets/films/bioluminescent-trails-720.webm',poster:'assets/films/bioluminescent-trails-1280.webp',label:'Bioluminescent trails',tone:'dark',to:'.studyRiver'}},
  projects:{no:4,name:'My projects',family:'Studio',color:'gold',related:['inspiration','creations','browse'],h:[1,2,-3],
   film:{src:'assets/films/jellyfish-720.mp4',webm:'assets/films/jellyfish-720.webm',poster:'assets/films/jellyfish-1280.webp',label:'Jellyfish drifting in the dark',tone:'dark'}},
  inspiration:{no:5,name:'Inspiration',family:'Studio',color:'gold',related:['projects','references','creations'],h:[1,-4,6],
   film:{src:'assets/films/embroidery-720.mp4',webm:'assets/films/embroidery-720.webm',poster:'assets/films/embroidery-1280.webp',label:'Embroidery',tone:'light'}},
  creations:{no:6,name:'Your creations',family:'Studio',color:'gold',related:['projects','inspiration'],h:[1,5,-3],
   film:{src:'assets/films/pigment-bloom-720.mp4',webm:'assets/films/pigment-bloom-720.webm',poster:'assets/films/pigment-bloom-1280.webp',label:'Pigment bloom',tone:'dark'}},
  ux:{no:7,name:'UI components',family:'Systems',color:'mint',related:['icons','typography','playground'],h:[1,-3,4],film:{src:'assets/films/light-mesh-720.mp4',webm:'assets/films/light-mesh-720.webm',poster:'assets/films/light-mesh-1280.webp',label:'A glowing wireframe mesh drifting on cream',tone:'light'}},
  icons:{no:8,name:'Icon families',family:'Systems',color:'mint',related:['ux','assets','systems'],h:[1,4,-5],film:{src:'assets/films/sketchbook-horse-720.mp4',webm:'assets/films/sketchbook-horse-720.webm',poster:'assets/films/sketchbook-horse-1280.webp',label:'A sketched horse galloping across a notebook',tone:'light'}},
  typography:{no:9,name:'Fonts & type',family:'Systems',color:'mint',related:['pairings','playground','systems'],h:[1,-6,2],
   film:{src:'assets/films/light-threads-720.mp4',webm:'assets/films/light-threads-720.webm',poster:'assets/films/light-threads-1280.webp',label:'Light threads',tone:'dark'}},
  playground:{no:10,name:'System playground',family:'Systems',color:'mint',related:['systems','typography','ux'],h:[1,3,-2,5],film:{src:'assets/films/swan-construction-720.mp4',webm:'assets/films/swan-construction-720.webm',poster:'assets/films/swan-construction-1280.webp',label:'Swan drawn on its construction lines',tone:'dark'}},
  assets:{no:11,name:'Extracted assets',family:'Systems',color:'mint',related:['systems','icons','ux'],h:[1,-5,3],film:{src:'assets/films/paper-bird-720.mp4',webm:'assets/films/paper-bird-720.webm',poster:'assets/films/paper-bird-1280.webp',label:'A paper-sculpture bird in flight',tone:'light'}},
  art:{no:12,name:'Art styles',family:'Graphics',color:'ice',related:['vases','cinema','compare'],h:[1,-2,5,-3],
   film:{src:'assets/films/suminagashi-720.mp4',webm:'assets/films/suminagashi-720.webm',poster:'assets/films/suminagashi-1280.webp',label:'Suminagashi',tone:'light'}},
  cinema:{no:13,name:'Film looks',family:'Graphics',color:'ice',related:['art','motion','pairings'],h:[1,4,-2],
   film:{src:'assets/films/pixel-sorting-720.mp4',webm:'assets/films/pixel-sorting-720.webm',poster:'assets/films/pixel-sorting-1280.webp',label:'Pixel sorting',tone:'light'}},
  vases:{no:14,name:'Vase studies',family:'Graphics',color:'ice',related:['art','compare','cinema'],h:[1,-4,2,5],
   film:{src:'assets/films/sand-drawing-720.mp4',webm:'assets/films/sand-drawing-720.webm',poster:'assets/films/sand-drawing-1280.webp',label:'Sand drawing',tone:'light'}},
  pairings:{no:15,name:'Style pairings',family:'Motion',color:'rose',related:['systems','motion','typography'],h:[1,2,-5],
   film:{src:'assets/films/lion-phoenix-720.mp4',webm:'assets/films/lion-phoenix-720.webm',poster:'assets/films/lion-phoenix-1280.webp',label:'Lion to phoenix',tone:'dark'}},
  effects:{no:16,name:'Landing effects',family:'Motion',color:'rose',related:['motion','ux','playground'],h:[1,-3,2,-6],
   film:{src:'assets/films/light-ribbons-720.mp4',webm:'assets/films/light-ribbons-720.webm',poster:'assets/films/light-ribbons-1280.webp',label:'Light ribbons',tone:'dark'}},
  compare:{no:17,name:'Comparison desk',family:'Motion',color:'rose',related:['art','systems','vases'],h:[1,3,-6],
   film:{src:'assets/films/ferrofluid-720.mp4',webm:'assets/films/ferrofluid-720.webm',poster:'assets/films/ferrofluid-1280.webp',label:'Ferrofluid',tone:'dark'}},
  references:{no:18,name:'Sources & credits',family:'Studio',color:'gold',related:['browse','systems','typography'],h:[1,-2,4],
   film:{src:'assets/films/smoke-plume-720.mp4',webm:'assets/films/smoke-plume-720.webm',poster:'assets/films/smoke-plume-1280.webp',label:'Smoke plume',tone:'dark',pos:'40% 50%'}}
 };
 const COLORS={ice:['#7dd3fc','#0369a1'],mint:['#6ee7b7','#047857'],rose:['#fda4af','#be123c'],gold:['#fde68a','#854d0e']};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const pad=n=>String(n).padStart(2,'0');
 const current=()=>{const id=location.hash.replace('#','').split('?')[0];return PAGES[id]?id:null;};

 /* ---------- Plate band + related links ---------- */
 const drawings=new Map();
 function decorate(id){
  const page=document.getElementById(id);const meta=PAGES[id];
  if(!page||!meta||page.querySelector('.aeBand'))return;
  const h1=$('h1',page);if(!h1)return;
  page.dataset.ae='1';page.classList.add('aePage');
  const head=h1.closest('.archivehead,.sectionhead,.motionheading,.vasesheethead')||h1;
  const band=document.createElement('div');band.className='aeBand';band.style.setProperty('--c',COLORS[meta.color][1]);band.style.setProperty('--cb',COLORS[meta.color][0]);
  band.innerHTML=`<p class="aeMark"><span class="aeNo">Plate ${pad(meta.no)}</span><span>${meta.family}</span><span class="aeOf">of 18</span></p><canvas class="aeCurve" width="520" height="520" aria-hidden="true"></canvas>`;
  head.parentNode.insertBefore(band,head);
  page.classList.add('aeHasBand');
  // Pages with actions beside the title get a compact drawing next to the plate label
  if(head!==h1){band.classList.add('aeCompact');const cv=$('canvas',band);cv.width=cv.height=112;}
  const intro=$(':scope > .intro, :scope > div > .intro, .archivenote',page);
  const rel=document.createElement('nav');rel.className='aeRelated';rel.setAttribute('aria-label','Related sections');
  rel.innerHTML=`<span class="aeRelLabel">Pairs well with</span>`+meta.related.map(r=>`<a href="#${r}" style="--c:${COLORS[PAGES[r].color][1]}"><span class="aeRelNo">${pad(PAGES[r].no)}</span>${PAGES[r].name}<span aria-hidden="true">→</span></a>`).join('');
  if(intro)intro.insertAdjacentElement('afterend',rel);else head.insertAdjacentElement('afterend',rel);
  drawings.set(id,curve($('canvas',band),meta));
  if(meta.film)film(page,band,rel,meta);
 }

 /* A film behind the page header (pages with a film), like the home hero: it runs full width, fades into the
    title on the left and into the dark section below, plays only while on screen and never under reduced motion */
 /* films with no 1920px WebM master: wide screens keep their 1280px WebM cut */
 const NO_FULL_WEBM=/\/(hydraulic-erosion|game-of-life|bioluminescent-trails|embroidery|suminagashi|pixel-sorting|sand-drawing|soap-film|ferrofluid)-720\./;
 function film(page,band,rel,meta){
  const f=meta.film,bg=document.createElement('div');bg.className='aeHeroBg';bg.setAttribute('aria-hidden','true');
  const mp4First=/^((?!chrome|chromium|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent);
  /* 1280px cuts on ordinary screens; the 1920px masters where the header is wider than ~1400 device pixels */
  const big=innerWidth*Math.min(2,devicePixelRatio||1)>1400&&!navigator.connection?.saveData,full=u=>big&&u&&!(/\.webm$/.test(u)&&NO_FULL_WEBM.test(u))?u.replace('-720.','.'):u;
  const wb=f.webm?`<source src="${full(f.webm)}" type="video/webm">`:'',mp=`<source src="${full(f.src)}" type="video/mp4">`;
  bg.innerHTML=`<video muted loop playsinline preload="none" poster="${f.poster}">${mp4First?mp+wb:wb+mp}</video><i></i>`;
  const tg=document.createElement('button');tg.type='button';tg.className='aeHeroToggle';tg.innerHTML='<span aria-hidden="true"></span><b>Pause film</b>';
  const dark=f.tone!=='light';page.prepend(bg);page.append(tg);page.classList.add('aeHasFilm',dark?'aeHeroDark':'aeHeroLight');if(!f.to)page.classList.add('aeHeroFade');
  const v=$('video',bg);if(f.pos)v.style.objectPosition=f.pos;let userPaused=false,visible=false,gate=false;
  /* the film starts only after the page has loaded, so it never competes with the first paint */
  const open=()=>setTimeout(()=>{gate=true;sync();},900);if(document.readyState==='complete')open();else addEventListener('load',open,{once:true});
  /* the backdrop runs from under the site header (behind the breadcrumb) to the top of the dark section */
  const fit=()=>{if(!page.isConnected||page.hidden)return;const pr=page.getBoundingClientRect(),trail=document.querySelector('.routeTrail'),end=page.querySelector(f.to);
   const top=trail&&dark?Math.min(0,trail.getBoundingClientRect().top-pr.top-12):0;const bottom=end?end.getBoundingClientRect().top-pr.top+Math.min(160,parseFloat(getComputedStyle(end).paddingTop)||0):(rel.getBoundingClientRect().bottom-pr.top+(dark?150:90));
   bg.style.top=top+'px';bg.style.height=Math.max(320,bottom-top)+'px';tg.style.top=(top+24)+'px';};
  const sync=()=>{const go=gate&&visible&&!userPaused&&!reduced.matches&&current()===page.id;if(go)v.play().catch(()=>{});else v.pause();
   const on=!(userPaused||reduced.matches);tg.classList.toggle('paused',!on);tg.querySelector('b').textContent=on?'Pause film':'Play film';};
  tg.onclick=()=>{if(reduced.matches){v.play().catch(()=>{});tg.classList.remove('paused');tg.querySelector('b').textContent='Pause film';return;}userPaused=!userPaused;sync();};
  if('IntersectionObserver' in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();},{threshold:.05}).observe(bg);else{visible=true;sync();}
  reduced.addEventListener?.('change',sync);addEventListener('resize',fit);addEventListener('hashchange',()=>setTimeout(()=>{fit();sync();document.body.classList.toggle('aeDarkHead',dark&&current()===page.id);},60));
  if('ResizeObserver' in window)new ResizeObserver(fit).observe(page);
  document.body.classList.toggle('aeDarkHead',dark&&current()===page.id);fit();setTimeout(fit,400);setTimeout(fit,1500);
 }

 /* A Fourier pen traces each page's own curve in its plate colour */
 function curve(canvas,meta){
  const ctx=canvas.getContext('2d');if(!ctx)return null;
  const [bright,deep]=COLORS[meta.color];
  const W=canvas.width,C=W/2,R=[118,54,30,16,9].slice(0,meta.h.length),F=meta.h,PH=F.map((f,i)=>i*1.3+meta.no*.7);
  const S=(C-14)/R.reduce((a,b)=>a+b,0);
  const N=900;const pts=[];
  for(let i=0;i<=N;i++){const t=i/N*Math.PI*2;let x=C,y=C;for(let k=0;k<F.length;k++){x+=R[k]*S*Math.cos(F[k]*t+PH[k]);y+=R[k]*S*Math.sin(F[k]*t+PH[k]);}pts.push([x,y]);}
  let p=0,raf=0,running=false,last=0;
  function draw(prog){
   ctx.clearRect(0,0,W,W);
   const n=Math.max(1,Math.floor(prog*N));
   ctx.lineWidth=1;ctx.strokeStyle='rgba(13,18,32,.07)';
   ctx.beginPath();ctx.arc(C,C,C-8,0,Math.PI*2);ctx.stroke();
   ctx.beginPath();ctx.moveTo(C,8);ctx.lineTo(C,W-8);ctx.moveTo(8,C);ctx.lineTo(W-8,C);ctx.stroke();
   // ghost of the full curve
   ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle='rgba(13,18,32,.06)';ctx.stroke();
   // traced portion
   ctx.beginPath();for(let i=0;i<=n;i++){const [x,y]=pts[i];i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
   ctx.strokeStyle=deep;ctx.lineWidth=W>200?2:3;ctx.lineJoin='round';ctx.stroke();
   // epicycles
   const t=n/N*Math.PI*2;let x=C,y=C;ctx.lineWidth=1;
   for(let k=0;k<F.length;k++){const r=R[k]*S;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle='rgba(13,18,32,.12)';ctx.stroke();const nx=x+r*Math.cos(F[k]*t+PH[k]),ny=y+r*Math.sin(F[k]*t+PH[k]);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(nx,ny);ctx.strokeStyle='rgba(13,18,32,.45)';ctx.stroke();x=nx;y=ny;}
   ctx.beginPath();ctx.arc(x,y,W>200?5:6,0,Math.PI*2);ctx.fillStyle=bright;ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle=deep;ctx.stroke();
  }
  const loop=now=>{if(!running)return;raf=requestAnimationFrame(loop);if(now-last<33)return;last=now;p+=.0045;if(p>1.25)p=0;draw(Math.min(1,p));};
  draw(reduced.matches?1:0);
  return{play(){if(running||reduced.matches){draw(reduced.matches?1:Math.min(1,p));return;}running=true;raf=requestAnimationFrame(loop);},stop(){running=false;cancelAnimationFrame(raf);}};
 }

 /* ---------- Scroll reveal ---------- */
 const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('aeIn');io.unobserve(e.target);}}),{rootMargin:'0px 0px -6% 0px'}):null;
 function reveal(page){
  if(!io||reduced.matches)return;
  const vh=innerHeight;
  $$('.grid,.vasegrid,[class*="grid"],[class*="Grid"],[class*="plates"],[class*="cards"],[class*="Cards"]',page).forEach(g=>{
   if(g.closest('.specimen-preview,.componentdemo,.systemSample,.systemCompare,.guideSurface,#creatorPreview,.landingDemo,.effectdemo'))return;
   const kids=[...g.children].filter(k=>!k.classList.contains('aeReveal')&&k.offsetParent!==null);
   if(kids.length<3)return;
   kids.forEach((k,i)=>{if(k.getBoundingClientRect().top<vh)return;k.classList.add('aeReveal');k.style.setProperty('--d',`${(i%4)*70}ms`);io.observe(k);});
  });
 }
 // Grids that fill in later (load more, filters) get the same treatment
 const mo=new MutationObserver(()=>{clearTimeout(mo.t);mo.t=setTimeout(()=>{const id=current();if(!id)return;const page=document.getElementById(id);if(!page.querySelector('.aeBand')){decorate(id);drawings.get(id)?.play();}reveal(page);},120);});

 /* ---------- Route handling ---------- */
 function onRoute(){
  const id=current();
  drawings.forEach((d,k)=>d&&k!==id&&d.stop());
  if(!id)return;
  const page=document.getElementById(id);
  /* some pages (Your creations) are built by another script after the route fires: try again shortly */
  if(!page||!page.querySelector('h1')){if((onRoute.n=(onRoute.n||0)+1)<24)setTimeout(onRoute,250);return;}onRoute.n=0;
  decorate(id);
  page.classList.remove('aeEnter');void page.offsetWidth;if(!reduced.matches)page.classList.add('aeEnter');
  drawings.get(id)?.play();
  requestAnimationFrame(()=>reveal(page));
  mo.disconnect();mo.observe(page,{childList:true,subtree:true});
 }
 addEventListener('hashchange',()=>setTimeout(onRoute,30));

 /* ---------- Progress line + back to top ---------- */
 const bar=document.createElement('div');bar.className='aeProgress';bar.setAttribute('aria-hidden','true');
 document.querySelector('body>header')?.append(bar);
 const top=document.createElement('button');top.type='button';top.className='aeTop';top.setAttribute('aria-label','Back to top');
 top.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>';
 top.onclick=()=>scrollTo({top:0,behavior:reduced.matches?'auto':'smooth'});
 document.body.append(top);
 let ticking=false;
 addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;const h=document.documentElement;const max=h.scrollHeight-innerHeight;bar.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;top.classList.toggle('aeShow',scrollY>innerHeight*1.4&&!document.body.classList.contains('cinemaMode'));});},{passive:true});

 /* ---------- Search across the atlas ---------- */
 const trigger=document.createElement('button');trigger.type='button';trigger.className='aeSearchBtn';
 trigger.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="m10.5 10.5 3.5 3.5" stroke="currentColor" stroke-width="1.5"/></svg><span>Search the atlas</span><kbd>/</kbd>';
 trigger.setAttribute('aria-label','Search the atlas');
 const mainNav=$('body>header nav[aria-label=Main]');mainNav?.insertAdjacentElement('afterend',trigger);

 const dlg=document.createElement('dialog');dlg.className='aePalette';dlg.setAttribute('aria-label','Search the atlas');
 dlg.innerHTML=`<form method="dialog" class="aePalForm"><label class="aePalField"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="m10.5 10.5 3.5 3.5" stroke="currentColor" stroke-width="1.5"/></svg><input id="aePalInput" type="search" autocomplete="off" placeholder="Glass, paper, tabs, parallax, Swiss…" aria-label="Search pages and entries" aria-controls="aePalList"></label><ul id="aePalList" class="aePalList" role="listbox"></ul><p class="aePalHint"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span><span id="aePalCount" aria-live="polite"></span></p></form>`;
 document.body.append(dlg);
 const input=$('#aePalInput',dlg),list=$('#aePalList',dlg),count=$('#aePalCount',dlg);
 let items=[],sel=0;
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 function entries(){try{return typeof catalogue!=='undefined'&&Array.isArray(catalogue)?catalogue:[];}catch{return[];}}
 function search(q){
  q=q.trim().toLowerCase();
  const pageHits=[{id:'home',name:'Home',family:'The film'},...Object.entries(PAGES).map(([id,m])=>({id,...m}))]
   .filter(p=>!q||(p.name+' '+p.family+' '+p.id).toLowerCase().includes(q))
   .map(p=>({type:'page',id:p.id,title:p.name,sub:p.no?`Plate ${pad(p.no)} · ${p.family}`:p.family,color:p.color}));
  const words=q.split(/\s+/).filter(Boolean);
  const entryHits=!q?[]:entries().map(e=>{const hay=[e.id,e.title,e.group,e.kind,e.desc,e.tags,e.use].join(' ').toLowerCase();let score=0;for(const w of words){if(!hay.includes(w))return null;score+=(String(e.title).toLowerCase().includes(w)?3:1);}return{e,score};}).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,40)
   .map(({e})=>({type:'entry',id:e.id,title:e.title,sub:`${e.id} · ${e.group||e.kind||'Entry'}`,desc:e.desc}));
  const toolHits=!q?[]:(window.ATLAS_TOOLS?ATLAS_TOOLS.list:[]).filter(t=>words.every(w=>(t.name+' '+t.blurb+' '+t.group).toLowerCase().includes(w))).slice(0,6)
   .map(t=>({type:'tool',href:t.href,title:t.name,sub:'Tool · '+t.group,desc:ATLAS_TOOLS.blurbNow(t)}));
  const recent=!q&&window.AtlasRecent?window.AtlasRecent().map(e=>({type:'entry',id:e.id,title:e.title,sub:`Recently viewed · ${e.id}`,desc:e.desc})):[];
  return q?[...pageHits.slice(0,5),...toolHits,...entryHits]:[...recent,...pageHits];
 }
 function render(){
  items=search(input.value);sel=Math.min(sel,Math.max(0,items.length-1));
  list.innerHTML=items.length?items.map((it,i)=>`<li id="aeOpt${i}" role="option" aria-selected="${i===sel}" data-i="${i}" class="aeOpt aeOpt-${it.type}"><span class="aeOptTag" style="--c:${it.color?COLORS[it.color][1]:'var(--text-dim)'}">${it.type==='page'?'Page':it.type==='tool'?'Tool':'Entry'}</span><span class="aeOptMain"><b>${esc(it.title)}</b><small>${esc(it.sub)}</small>${it.desc?`<em>${esc(it.desc)}</em>`:''}</span><span class="aeOptGo" aria-hidden="true">↵</span></li>`).join(''):`<li class="aeEmpty">Nothing matches “${esc(input.value)}”. Try a material, a movement or a component name.</li>`;
  input.setAttribute('aria-activedescendant',items.length?`aeOpt${sel}`:'');
  count.textContent=input.value?`${items.length} result${items.length===1?'':'s'}`:'';
  list.querySelector('[aria-selected=true]')?.scrollIntoView({block:'nearest'});
 }
 function go(it){
  if(!it)return;dlg.close();
  if(it.type==='page'){location.hash=it.id;scrollTo(0,0);return;}
  if(it.type==='tool'){location.href=it.href;return;}
  try{if(typeof openEntry==='function'){if(location.hash.split('?')[0]!=='#browse'&&it.id[0]!=='D')location.hash='browse';setTimeout(()=>openEntry(it.id),60);return;}}catch{}
  location.hash='browse';setTimeout(()=>{const s=$('#search');if(s){s.value=it.title;s.dispatchEvent(new Event('input',{bubbles:true}));}},80);
 }
 function open(){if(dlg.open)return;input.value='';sel=0;render();dlg.showModal();input.focus();}
 trigger.onclick=open;
 input.addEventListener('input',()=>{sel=0;render();});
 input.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){e.preventDefault();sel=(sel+1)%Math.max(1,items.length);render();}
  else if(e.key==='ArrowUp'){e.preventDefault();sel=(sel-1+items.length)%Math.max(1,items.length);render();}
  else if(e.key==='Enter'){e.preventDefault();go(items[sel]);}
 });
 list.addEventListener('click',e=>{const li=e.target.closest('[data-i]');if(li)go(items[+li.dataset.i]);});
 list.addEventListener('mousemove',e=>{const li=e.target.closest('[data-i]');if(li&&+li.dataset.i!==sel){sel=+li.dataset.i;render();}});
 dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});
 addEventListener('keydown',e=>{
  const typing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)||document.activeElement?.isContentEditable;
  if((e.key==='k'&&(e.metaKey||e.ctrlKey))||(e.key==='/'&&!typing)){e.preventDefault();open();}
 });

 onRoute();
})();
