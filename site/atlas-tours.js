'use strict';
/* Guided tours: short curated paths through the atlas that mix specimen films, live simulations,
   visual styles and landing effects. #tours lists them; #tours?t=liquid opens one. Each tour can be
   shared as a link or saved as a 1200x630 card, and the home page shows a teaser row. */
(()=>{
 const TOURS=[
  {k:'liquid',title:'Liquid & metal',kicker:'Tour I',cover:'A49',intro:'Surfaces that flow, bead, shimmer and set: magnetic fluid, soap film, floating ink and chrome, and the interface styles and effects that borrow their behaviour.',
   stops:[['A49','A magnet lifts glossy spikes out of a black pool. Watch the film, then steer the magnet yourself in the live study.'],['A70','Interference colours swirl across a film one molecule thin, then it bursts into droplets.'],['A53','Suminagashi: ink rings floating on water, combed into marbled tendrils.'],['A88','Metaballs neck and merge like liquid. Add your own blob in the live study.'],['A23','The mercury look: chrome reflections that stay continuous as forms move.'],['A50','Thin-film colour on a curved surface: the palette for holographic brand moments.'],['S13','Liquid glass as an interface style: translucent layers, rounded and bright.'],['L25','Liquid hover: a landing effect where images ripple under the pointer.'],['L33','Film in type: the soap film plays inside giant letters as you scroll.']]},
  {k:'lines',title:'Lines & machines',kicker:'Tour II',cover:'A80',intro:'Drawings made by mechanisms and equations: pendulums, rotating vectors and chaotic orbits, and the blueprint style that documents them.',
   stops:[['A56','A harmonograph: two damped pendulums at right angles drive a pen. Change the ratio in the live study.'],['A80','The same idea filmed: a brass pen arm tracing dense Lissajous curves in graphite.'],['A01','Fourier epicycles: rotating circles that can draw any closed shape.'],['A76','A double pendulum, with a twin started a thousandth of a degree away that drifts apart.'],['A84','The Lorenz attractor, the butterfly of chaos theory, traced live in three dimensions.'],['A35','Contours and isolines: lines of equal value that describe a landscape.'],['A54','Cyanotype: white linework developing out of Prussian blue.'],['S21','The cyanotype as a full interface style, from buttons to dashboards.'],['L32','Scroll-scrubbed film: scrolling makes the pen draw, and scrolling back rewinds it.']]},
  {k:'print',title:'Print & paper',kicker:'Tour III',cover:'A55',intro:'Ink on paper and paper itself: risograph, hand-coloured plates, folded and cut forms, and the editorial styles they inspire.',
   stops:[['A02','Risograph: spot inks printed slightly out of register.'],['S20','Zine and riso print as an interface style, with halftones and offset shadows.'],['A55','An antique botanical plate: engraving first, then hand-colouring.'],['S22','The botanical plate as a full interface style, from captions to buttons.'],['A10','Paper cutout and collage: layered shapes, visible edges and shadow.'],['A29','Origami: flat paper folding into form along mountain and valley creases.'],['A77','Paper-cut shadow theatre: layered silhouettes in coloured light.'],['A47','Colour cycling: a printed palette that moves while the shapes stay still.'],['L21','Stacking cards: sections stack like sheets of paper as you scroll.']]},
  {k:'living',title:'Living systems',kicker:'Tour IV',cover:'A26',intro:'Simple local rules, complex results: cells that live and die, chemicals that make patterns, flocks, fungi and rivers that carve a landscape.',
   stops:[['A26','Cellular automata: switch between Life, HighLife, Day & Night and more in the live study.'],['A78','Reaction-diffusion: two chemicals that make spots, stripes and coral. Draw to seed it.'],['A81','Flocking: three local rules create the whole swarm. Attract it with the pointer.'],['A32','A flow field: thousands of particles riding an invisible current.'],['A51','Mycelium: white filaments exploring and connecting across dark soil.'],['A69','Diffusion-limited aggregation: wandering particles stick and grow a fractal coral.'],['A12','L-systems: branching growth from a few rewriting rules.'],['A85','Hydraulic erosion: simulated water carving ridges and braided rivers.'],['L16','Particle field hero: a landing effect built on the same particle idea.']]},
  {k:'light',title:'Light & glow',kicker:'Tour V',cover:'A67',intro:'Light as the subject: bioluminescence, caustics, long exposures, nebulae and coloured glass, and the effects that put a glow behind a page.',
   stops:[['A67','Bioluminescent trails: rivers of light drifting through darkness.'],['A63','Light painting: coloured ribbons drawn by moving lights in a long exposure.'],['A75','Caustics: refracted sunlight constantly reorganising on a pool floor.'],['A40','A nebula rendered live with a fragment shader.'],['A11','Thermal palettes: heat mapped to colour.'],['A87','Leaded stained glass: light moving behind jewel-coloured panes.'],['S14','Aurora and mesh gradients as an interface style.'],['L26','Aurora field: a glowing gradient background for a landing page.'],['L37','Looping film with type: a hero built on the bioluminescence film.']]},
  {k:'hand',title:'By hand',kicker:'Tour VI',cover:'A72',intro:'The marks of making: sand, thread, clay, paint and puppets, slow processes you can see happening.',
   stops:[['A72','Embroidery: stitches added one at a time, building a flower.'],['A08','Sand animation: drawings made and erased on a light table.'],['A86','Cross-stitch: a picture made of tiny thread crosses on a grid.'],['A17','Claymation: fingerprints and stepped posing.'],['A07','Paint on glass: wet colour smeared and reworked under the camera.'],['A09','The pinscreen: thousands of pins making soft tonal images.'],['A83','Wayang kulit: perforated shadow puppets on rods, in coloured light.'],['S15','Claymorphism: a soft, tactile interface style.'],['L34','Hover film cards: stills that become films when you hover.']]},
 ];
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const cat=()=>typeof catalogue!=='undefined'?catalogue:[];
 const findE=id=>cat().find(e=>e.id===id);
 const fx=id=>window.EffectsLab?.effects?.find(e=>e.id===id);
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const isLive=id=>window.AtlasExplore?.isLive?.({id})||(window.LiveSims?.ids||[]).includes(id);
 const IMG='assets/fx/';const THUMB_FX={L16:'constellation',L21:'exploded',L25:'fluid',L26:'nebula',L32:'film-scrub',L33:'film-type',L34:'film-cards',L37:'film-loop'};
 function stopInfo(id){
  if(id[0]==='L'){const f=fx(id);return {id,title:f?.name||id,type:'Landing effect',desc:f?.about||'',poster:'assets/fx/clips/'+id+'.webp',action:[['Open the effect',`#effects?fx=${id}`]]};}
  const e=findE(id);if(!e)return null;
  const acts=[['Open the entry',`entry:${id}`]];
  if(isLive(id))acts.unshift(['Play the live study',`study:${id}`]);
  if(id[0]==='S')acts.push(['Try it in the component lab',`#ux?component=C01&theme=${id}`]);
  const ref=e.film?null:e.image;
  return {id,title:e.title,type:id[0]==='S'?'Visual style':e.film?'Specimen film':isLive(id)?'Live study':'Animation art',desc:e.desc,film:e.film,ref,entry:e,action:acts};}
 function media(s){if(s.film)return `<img src="${s.film.poster}" alt="" loading="lazy"><span class="tbBadge">Film</span>`;
  if(s.poster)return `<img src="${s.poster}" alt="" loading="lazy">`;
  if(s.entry&&typeof window.elementExample==='function'){try{return window.elementExample(s.entry,false);}catch{}}return '';}
 function cover(t){const e=findE(t.cover);return e?.film?e.film.poster:e?.image?.url||'';}

 let page,current=null;
 function render(){page=document.getElementById('tours');if(!page)return;const q=new URLSearchParams(location.hash.split('?')[1]||'');const k=q.get('t');const t=TOURS.find(x=>x.k===k);current=t||null;
  page.innerHTML=t?tourHTML(t):indexHTML();wire();window.scrollTo?.(0,0);}
 function indexHTML(){return `<div class="tourIndex"><p class="tKicker">Guided tours · ${TOURS.length} paths</p><h1 id="toursTitle">Guided tours.</h1><p class="tIntro">Short curated paths through the atlas. Each one mixes specimen films, live simulations, visual styles and landing effects around one idea, about ten minutes from start to finish.</p>
  <div class="tourGrid">${TOURS.map(t=>{const e=findE(t.cover);return `<a class="tourCard" href="#tours?t=${t.k}" data-cover="${t.cover}"><span class="tcMedia"><img src="${cover(t)}" alt="" loading="lazy">${e?.film?`<video muted loop playsinline preload="none" poster="${e.film.poster}" data-src="${e.film.src}"></video>`:''}</span><span class="tcBody"><span class="tKicker">${t.kicker} · ${t.stops.length} stops</span><b>${esc(t.title)}</b><span class="tcIntro">${esc(t.intro)}</span></span></a>`;}).join('')}</div></div>`;}
 function tourHTML(t){const stops=t.stops.map(([id,why])=>({...stopInfo(id),why})).filter(s=>s.title);const e=findE(t.cover);const i=TOURS.indexOf(t),next=TOURS[(i+1)%TOURS.length];
  return `<article class="tour"><header class="tourHero"><div class="thMedia">${e?.film?`<video muted loop playsinline ${reduce.matches?'':'autoplay'} poster="${e.film.poster}" src="${e.film.src}"></video>`:`<img src="${cover(t)}" alt="">`}</div><div class="thShade"></div>
   <div class="thCopy"><a class="thBack" href="#tours">← All tours</a><p class="tKicker">${t.kicker} · ${stops.length} stops · about ten minutes</p><h1 id="toursTitle">${esc(t.title)}</h1><p class="tIntro">${esc(t.intro)}</p>
   <div class="thActions"><a class="tBtn primary" href="#stop-1" data-jump="1">Start the tour</a><button type="button" class="tBtn" data-tshare>Share tour</button><button type="button" class="tBtn" data-tcard>Save tour card</button></div><p class="tStatus" role="status" aria-live="polite"></p></div></header>
   <ol class="tourStops">${stops.map((s,n)=>`<li class="tStop" id="stop-${n+1}"><div class="tsNo" aria-hidden="true">${String(n+1).padStart(2,'0')}</div><div class="tsMedia" ${s.film?`data-film="${s.film.src}"`:''}>${media(s)}</div>
    <div class="tsBody"><p class="tKicker">${s.id} · ${esc(s.type)}${isLive(s.id)?' · <span class="tsLive">live</span>':''}</p><h2>${esc(s.title)}</h2><p class="tsWhy">${esc(s.why)}</p><div class="tsActions">${s.action.map(([l,h],j)=>`<button type="button" class="tBtn${j===0?' primary':''}" data-go="${esc(h)}">${esc(l)}</button>`).join('')}</div>
    <p class="tsStep">Stop ${n+1} of ${stops.length}${n<stops.length-1?` · <a href="#stop-${n+2}" data-jump="${n+2}">Next stop ↓</a>`:''}</p></div></li>`).join('')}</ol>
   <footer class="tourNext"><p class="tKicker">Next tour</p><a href="#tours?t=${next.k}"><b>${esc(next.title)}</b> →</a></footer></article>`;}
 function go(h){if(h.startsWith('entry:')){const id=h.slice(6);location.hash='browse';setTimeout(()=>window.openEntry?.(id),120);}
  else if(h.startsWith('study:')){const id=h.slice(6);if(window.UIMotion)window.UIMotion.show(id);else location.hash='motion';}
  else location.hash=h.replace(/^#/,'');}
 function wire(){
  page.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  page.querySelectorAll('[data-jump]').forEach(a=>a.onclick=ev=>{ev.preventDefault();page.querySelector('#stop-'+a.dataset.jump)?.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'});});
  // films play while their stop or card is on screen (cards on hover)
  const play=v=>{if(reduce.matches)return;if(!v.src&&v.dataset.src)v.src=v.dataset.src;v.play().catch(()=>{});};
  page.querySelectorAll('.tourCard').forEach(c=>{const v=c.querySelector('video');if(!v)return;c.addEventListener('pointerenter',()=>{v.classList.add('on');play(v);});c.addEventListener('pointerleave',()=>{v.classList.remove('on');v.pause();});});
  const io=new IntersectionObserver(es=>es.forEach(x=>{const m=x.target;let v=m.querySelector('video');if(x.isIntersecting){if(!v&&m.dataset.film&&!reduce.matches){m.insertAdjacentHTML('beforeend',`<video muted loop playsinline src="${m.dataset.film}"></video>`);v=m.querySelector('video');}if(v){v.classList.add('on');play(v);}}else if(v)v.pause();}),{threshold:.5});
  page.querySelectorAll('.tsMedia[data-film]').forEach(m=>io.observe(m));
  const st=page.querySelector('.tStatus');
  page.querySelector('[data-tshare]')?.addEventListener('click',async()=>{const url=`${location.origin}${location.pathname}#tours?t=${current.k}`;try{if(navigator.share){await navigator.share({title:`${current.title} · Visual & Motion Atlas`,text:current.intro,url});st.textContent='Shared.';return;}await navigator.clipboard.writeText(url);st.textContent='Link copied.';}catch(e){if(e?.name!=='AbortError')st.textContent=url;}});
  page.querySelector('[data-tcard]')?.addEventListener('click',async()=>{const b=await card(current);const url=URL.createObjectURL(b);const a=document.createElement('a');a.href=url;a.download=`atlas-tour-${current.k}.png`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);st.textContent='Tour card saved to your downloads.';});}
 const loadImg=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src;});
 async function card(t){const c=document.createElement('canvas');c.width=1200;c.height=630;const x=c.getContext('2d');
  try{await Promise.all(['300 80px "Cormorant Garamond"','500 18px "JetBrains Mono"','400 22px Manrope'].map(f=>document.fonts.load(f)));}catch{}
  x.fillStyle='#02040b';x.fillRect(0,0,1200,630);
  const stops=t.stops.slice(0,4).map(([id])=>stopInfo(id)).filter(Boolean);const cells=[[640,40],[920,40],[640,330],[920,330]];
  for(let i=0;i<stops.length;i++){const s=stops[i];const src=s.film?.poster||s.poster||(s.ref&&(s.ref.columns===1?s.ref.url:null))||cover(t);const img=src&&await loadImg(src);const [cx,cy]=cells[i],w=260,h=260;
   x.save();x.beginPath();x.roundRect?x.roundRect(cx,cy,w,h,14):x.rect(cx,cy,w,h);x.clip();if(img){const sc=Math.max(w/img.width,h/img.height);x.drawImage(img,cx+(w-img.width*sc)/2,cy+(h-img.height*sc)/2,img.width*sc,img.height*sc);}else{x.fillStyle='#16203a';x.fillRect(cx,cy,w,h);}
   x.fillStyle='rgba(2,4,11,.55)';x.fillRect(cx,cy+h-44,w,44);x.fillStyle='#eef2f8';x.font='500 14px "JetBrains Mono", monospace';x.fillText(`${String(i+1).padStart(2,'0')} · ${s.id}`,cx+14,cy+h-17);x.restore();}
  x.fillStyle='#fda4af';x.font='500 18px "JetBrains Mono", monospace';x.fillText(`${t.kicker.toUpperCase()} · GUIDED TOUR · ${t.stops.length} STOPS`,64,96);
  x.fillStyle='#eef2f8';x.font='300 84px "Cormorant Garamond", Georgia, serif';const words=t.title.split(' ');let line='',y=190;for(const w of words){const tt=line?line+' '+w:w;if(x.measureText(tt).width>520&&line){x.fillText(line,64,y);y+=84;line=w;}else line=tt;}x.fillText(line,64,y);
  x.fillStyle='#c4cddc';x.font='400 22px Manrope, sans-serif';let l2='',y2=y+60;for(const w of t.intro.split(' ')){const tt=l2?l2+' '+w:w;if(x.measureText(tt).width>520&&l2){x.fillText(l2,64,y2);y2+=32;l2=w;if(y2>520)break;}else l2=tt;}if(y2<=520)x.fillText(l2,64,y2);
  x.fillStyle='#eef2f8';x.font='italic 300 28px "Cormorant Garamond", Georgia, serif';x.fillText('Visual & Motion Atlas',64,590);
  return new Promise(r=>c.toBlob(r,'image/png'));}

 /* ---------- home teaser ---------- */
 function teaser(){const home=document.querySelector('.vmaHome');if(!home||document.getElementById('tourTeaser'))return;const after=home.querySelector('#sfReel')||home.querySelector('.vmaMotion');if(!after)return;
  const sec=document.createElement('section');sec.id='tourTeaser';sec.className='vmaInner vmaSection tourTeaser';sec.setAttribute('aria-labelledby','tourTeaserTitle');
  sec.innerHTML=`<div class="vmaSectionHead"><div><p class="vmaLabel">Guided tours &middot; ${TOURS.length} paths</p><h2 id="tourTeaserTitle">Start somewhere.<br><em>Follow one idea through the atlas.</em></h2></div><p>Each tour mixes films, live simulations, styles and effects around one theme, about ten minutes from start to finish.</p></div>
  <div class="ttGrid">${TOURS.map(t=>`<a class="ttCard" href="#tours?t=${t.k}"><img src="${cover(t)}" alt="" loading="lazy"><span><small>${t.kicker}</small><b>${esc(t.title)}</b></span></a>`).join('')}</div>`;
  after.insertAdjacentElement('afterend',sec);}

 const ready=setInterval(()=>{if(!cat().length||!document.getElementById('tours'))return;clearInterval(ready);
  const onRoute=()=>{if(location.hash.split('?')[0]==='#tours')render();};onRoute();teaser();
  addEventListener('hashchange',onRoute);new MutationObserver(()=>teaser()).observe(document.getElementById('main'),{childList:true});},150);
 window.AtlasTours={TOURS,render};
})();
