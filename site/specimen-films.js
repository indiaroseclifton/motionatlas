'use strict';
/* Specimen films and renders (2026 package).
   1. Detail view: the entry's film plays in place of its still, with extra renders below.
   2. Catalogue cards: a Film badge; hovering or focusing a card previews the film.
   3. Animation studio: a film library of every specimen film.
   4. Header band: inner pages carry a quiet, page-specific film behind the navigation.
   5. Home: a specimen reel that continues the hero's plate index (Plates V-XV).
   Films are muted 14 s loops. Reduced motion and Save-Data show posters and wait for a click. */
(()=>{
 const REEL=['A49','A53','A56','A85','A70','A67','A80','A72','A48','A08','A26'];
 const ROMAN=['V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV'];
 const PAGE_FILM={motion:'A80',effects:'A49',browse:'A53',systems:'A26',art:'A70',inspiration:'A67',compare:'A48',projects:'A85',creations:'A72',typography:'A08',vases:'A56'};
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const saveData=!!navigator.connection?.saveData;
 const still=()=>reduce.matches||saveData;
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const cat=()=>typeof catalogue!=='undefined'?catalogue:[];
 const get=id=>cat().find(e=>e.id===id);
 const filmed=()=>cat().filter(e=>e.film);
 const isStudy=id=>/^A(0\d|[1-3]\d|40)$/.test(id)||(window.LiveSims?.ids||[]).includes(id);
 const play=v=>{const p=v.play();if(p)p.catch(()=>{});};
 const video=(f,{auto=!still(),cls='',label=''}={})=>`<video class="${cls}" ${auto?'autoplay':''} muted loop playsinline preload="${auto?'auto':'none'}" poster="${f.poster}" ${label?`aria-label="${esc(label)}"`:'aria-hidden="true"'}><source src="${f.src}" type="video/mp4"></video>`;
 const pauseIcon='<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="1.5" y="1" width="2.5" height="8" fill="currentColor"/><rect x="6" y="1" width="2.5" height="8" fill="currentColor"/></svg>';
 const playIcon='<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z" fill="currentColor"/></svg>';
 function toggleBtn(btn,v){const sync=()=>{const on=!v.paused;btn.innerHTML=(on?pauseIcon:playIcon)+`<span>${on?'Pause':'Play'} film</span>`;btn.setAttribute('aria-pressed',String(on));};v.addEventListener('play',sync);v.addEventListener('pause',sync);btn.onclick=()=>v.paused?play(v):v.pause();sync();}

 /* ---------- 1. Detail view ---------- */
 function augmentDetail(){
  const body=document.getElementById('detailBody');const e=typeof selected!=='undefined'?selected:null;
  const first=body?.firstElementChild;if(!e||!first||first.hasAttribute('data-sf'))return;first.setAttribute('data-sf',e.id);
  const view=typeof currentView!=='undefined'?currentView:'reference';
  if(!isStudy(e.id))body.querySelectorAll('[data-motion]').forEach(b=>{if(e.film){b.textContent='Watch the film ↑';b.removeAttribute('data-motion');b.onclick=()=>{const v=body.querySelector('.sfDetailFilm video');if(v){v.scrollIntoView({block:'center',behavior:'smooth'});play(v);v.focus?.();}};}else b.remove();});
  if(view==='prompts')return;
  const sheet=body.querySelector('.sheet-image');if(!sheet)return;
  const holder=sheet.parentElement;
  if(view==='reference'&&e.film){
   const fig=document.createElement('figure');fig.className='sfDetailFilm';
   fig.innerHTML=`${video(e.film,{label:e.title+' film'})}<figcaption><span class="sfTag">Film · ${e.film.seconds||14} s loop</span><button type="button" class="sfCtl"></button></figcaption>`;
   sheet.replaceWith(fig);toggleBtn(fig.querySelector('.sfCtl'),fig.querySelector('video'));
   const cap=holder.querySelector('.detailimagecaption');if(cap)cap.textContent='Specimen film · the still reference is below';
   const shots=[e.image.url,...(e.gallery||[])];holder.insertAdjacentHTML('beforeend',strip(e,shots,'Stills'));
  }else if(view==='reference'&&e.gallery?.length){
   holder.insertAdjacentHTML('beforeend',strip(e,[e.image.url,...e.gallery],'More renders'));
  }else if(view==='applied'&&e.gallery?.length&&!e.applied){
   const g=document.createElement('div');g.className='sfVariants';
   g.innerHTML=[e.image.url,...e.gallery].map((u,i)=>`<img src="${u}" alt="${esc(e.title)}, render ${i+1}" loading="lazy">`).join('');
   sheet.replaceWith(g);const cap=holder.querySelector('.detailimagecaption');if(cap)cap.textContent=`${1+e.gallery.length} render variations of the same direction`;
  }
  body.querySelectorAll('.sfStrip button').forEach(b=>b.onclick=()=>{
   const main=body.querySelector('.sfDetailFilm, .sheet-image');const url=b.dataset.src;
   if(main?.classList.contains('sheet-image')){main.style.backgroundImage=`url('${url}')`;}
   else if(main){main.querySelector('video')?.pause();const img=document.createElement('div');img.className='sheet-image';img.setAttribute('role','img');img.setAttribute('aria-label',e.title+' render');img.style.cssText=`background-image:url('${url}');background-size:100% 100%`;main.replaceWith(img);}
   body.querySelectorAll('.sfStrip button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  });
 }
 function strip(e,shots,label){
  const filmBtn=e.film?`<button type="button" class="sfFilmBack" data-film-back>${playIcon}<span>Film</span></button>`:'';
  return `<div class="sfStrip" role="group" aria-label="${label} of ${esc(e.title)}"><span class="sfTag">${label}</span>${filmBtn}${shots.map((u,i)=>`<button type="button" data-src="${u}" aria-pressed="${!e.film&&i===0}" aria-label="Show render ${i+1}"><img src="${u}" alt="" loading="lazy"></button>`).join('')}</div>`;
 }
 document.addEventListener('click',ev=>{const b=ev.target.closest('[data-film-back]');if(!b)return;if(typeof renderDetail==='function')renderDetail();});

 /* ---------- 2. Catalogue cards ---------- */
 const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
 function decorateCards(){
  document.querySelectorAll('#grid .cataloguecard:not([data-sf])').forEach(card=>{
   card.dataset.sf='1';const id=card.querySelector('[data-open]')?.dataset.open;const e=id&&get(id);if(!e)return;
   const mediaBtn=card.querySelector('.cardmedia');
   if(e.isNew&&e.id[0]==='A'){const code=card.querySelector('.cardcode span:last-child');if(code)code.textContent=e.film?'Specimen film':'New specimen';}
   if(!e.film||!mediaBtn)return;
   card.classList.add('sfHasFilm');mediaBtn.insertAdjacentHTML('beforeend',`<span class="sfBadge">${playIcon}Film</span>`);
   const start=()=>{if(still()||!finePointer.matches&&!mediaBtn.matches(':focus-visible'))return;let v=mediaBtn.querySelector('.sfCardFilm');if(!v){mediaBtn.insertAdjacentHTML('beforeend',video(e.film,{auto:true,cls:'sfCardFilm'}));v=mediaBtn.querySelector('.sfCardFilm');}v.classList.add('on');play(v);};
   const stop=()=>{const v=mediaBtn.querySelector('.sfCardFilm');if(v){v.pause();v.classList.remove('on');}};
   mediaBtn.addEventListener('pointerenter',start);mediaBtn.addEventListener('pointerleave',stop);mediaBtn.addEventListener('focus',start);mediaBtn.addEventListener('blur',stop);
  });
 }

 /* ---------- 3. Film library on the animation studio ---------- */
 function buildLibrary(){
  const page=document.getElementById('motion');if(!page||document.getElementById('sfLibrary')||!filmed().length)return;
  const list=[...REEL.map(get),...filmed().filter(e=>!REEL.includes(e.id))].filter(e=>e&&e.film);
  const sec=document.createElement('section');sec.id='sfLibrary';sec.className='sfLibrary';sec.setAttribute('aria-labelledby','sfLibTitle');
  sec.innerHTML=`<div class="sfLibHead"><div><p class="sfKicker">Film library · ${list.length} specimen films</p><h2 id="sfLibTitle">Watch the materials move.</h2></div><p>Real footage and simulations for the new specimens: ferrofluid, ink marbling, soap film, a working harmonograph and more. Hover to preview, open one for its brief, prompts and stills.</p></div>
  <div class="sfLibGrid">${list.map((e,i)=>`<button type="button" class="sfLibCard${i===0?' sfLibLead':''}" data-open="${e.id}" aria-label="Open ${esc(e.title)}"><span class="sfLibMedia"><img src="${e.film.poster}" alt="" loading="lazy"></span><span class="sfLibCap"><span class="sfCode">${e.id}</span><b>${esc(e.title)}</b></span></button>`).join('')}</div>`;
  const anchor=page.querySelector('.aeRelated')||page.querySelector('.intro');(anchor||page.firstElementChild).insertAdjacentElement('afterend',sec);
  sec.querySelectorAll('.sfLibCard').forEach(card=>{
   const e=get(card.dataset.open),m=card.querySelector('.sfLibMedia');
   const start=()=>{if(still())return;let v=m.querySelector('video');if(!v){m.insertAdjacentHTML('beforeend',video(e.film,{auto:true}));v=m.querySelector('video');}v.classList.add('on');play(v);};
   const stop=()=>{const v=m.querySelector('video');if(v){v.pause();v.classList.remove('on');}};
   card.addEventListener('pointerenter',start);card.addEventListener('pointerleave',stop);card.addEventListener('focus',start);card.addEventListener('blur',stop);
  });
  // the lead card plays while it is on screen
  const lead=sec.querySelector('.sfLibLead');
  if(lead&&'IntersectionObserver' in window)new IntersectionObserver(([x])=>{if(!document.getElementById('motion')?.classList.contains('active'))return;x.isIntersecting?lead.dispatchEvent(new Event('pointerenter')):lead.dispatchEvent(new Event('pointerleave'));},{threshold:.4}).observe(lead);
 }

 /* ---------- 4. Header band film ---------- */
 let hd;
 function headerFilm(){
  const header=document.querySelector('body>header');if(!header)return;
  const page=location.hash.replace('#','').split('?')[0]||'home';const e=get(PAGE_FILM[page]);
  if(!hd){hd=document.createElement('div');hd.className='sfHeaderFilm';hd.setAttribute('aria-hidden','true');header.prepend(hd);
   const cap=document.createElement('button');cap.type='button';cap.className='sfHeaderCap';header.append(cap);hd.cap=cap;
   cap.onclick=()=>{const id=cap.dataset.id;if(!id)return;if(typeof openEntry==='function')openEntry(id);};}
  if(page==='home'||!e?.film){hd.innerHTML='';hd.dataset.id='';hd.cap.hidden=true;return;}
  hd.cap.hidden=false;hd.cap.dataset.id=e.id;hd.cap.innerHTML=`<span>Plate film</span> ${e.id} · ${esc(e.title)}`;hd.cap.setAttribute('aria-label',`Plate film: ${e.title}. Open the entry`);
  if(hd.dataset.id===e.id)return;hd.dataset.id=e.id;
  hd.innerHTML=still()?`<img src="${e.film.poster}" alt="">`:video(e.film,{auto:true});
 }

 /* ---------- 5. Home specimen reel ---------- */
 function buildReel(){
  const home=document.querySelector('.vmaHome');const after=home?.querySelector('.vmaMotion');if(!after||document.getElementById('sfReel'))return;
  const list=REEL.map(get).filter(e=>e&&e.film);if(!list.length)return;
  const sec=document.createElement('section');sec.id='sfReel';sec.className='sfReel';sec.setAttribute('aria-labelledby','sfReelTitle');
  sec.innerHTML=`<div class="sfReelStage"><div class="sfReelLayer"></div><div class="sfReelLayer"></div><div class="sfReelShade"></div></div>
  <div class="vmaInner sfReelCopy">
   <p class="vmaLabel">Specimen reel &middot; Plates V&ndash;${ROMAN[list.length-1]}</p>
   <h2 id="sfReelTitle"><span class="visually-hidden sfReelFallback">Specimen films</span><span class="sfReelNo"></span><span class="sfReelName"></span></h2>
   <p class="sfReelDesc"></p>
   <div class="vmaActions"><button type="button" class="vmaBtn vmaBtnPrimary sfReelOpen">Open the specimen <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg></button><a class="vmaBtn vmaBtnGhost" href="#motion">All films in the studio</a><button type="button" class="vmaCtl sfReelPlay"></button></div>
  </div>
  <ol class="vmaInner sfReelIndex" aria-label="Specimen films">${list.map((e,i)=>`<li><button type="button" data-i="${i}"><span class="sfReelBar"><i></i></span><span class="sfReelPlate">PLATE ${ROMAN[i]} &middot; ${e.id}</span><span class="sfReelTitle">${esc(e.title.split(' / ')[0])}</span></button></li>`).join('')}</ol>`;
  after.insertAdjacentElement('afterend',sec);
  const layers=[...sec.querySelectorAll('.sfReelLayer')],btns=[...sec.querySelectorAll('.sfReelIndex button')],playBtn=sec.querySelector('.sfReelPlay');
  const SHOW=7000;let cur=-1,front=0,t0=0,held=0,paused=still(),inView=false,raf=0,loaded=false;
  function setPlayLabel(){playBtn.innerHTML=(paused?playIcon:pauseIcon)+`<span>${paused?'Play':'Pause'} the reel</span>`;playBtn.setAttribute('aria-pressed',String(!paused));}
  function show(i,user){
   cur=(i+list.length)%list.length;const e=list[cur];front=1-front;const L=layers[front],B=layers[1-front];
   L.innerHTML=video(e.film,{auto:!paused&&inView});const v=L.querySelector('video');
   if(!paused&&inView)play(v);
   L.classList.add('on');B.classList.remove('on');setTimeout(()=>{if(!B.classList.contains('on')){B.querySelector('video')?.pause();B.innerHTML='';}},1200);
   sec.querySelector('.sfReelNo').textContent=`Plate ${ROMAN[cur]} · ${e.id}`;sec.querySelector('.sfReelName').textContent=e.title.split(' / ')[0];
   sec.querySelector('.sfReelDesc').textContent=e.desc;sec.querySelector('.sfReelOpen').dataset.id=e.id;
   btns.forEach((b,k)=>{b.setAttribute('aria-current',String(k===cur));b.querySelector('i').style.transform=k<cur?'scaleX(1)':'scaleX(0)';});
   t0=performance.now();held=0;if(user)btns[cur].scrollIntoView({block:'nearest',inline:'nearest'});
  }
  function tick(now){raf=0;if(paused||!inView)return;const p=Math.min(1,(now-t0)/SHOW);const bar=btns[cur]?.querySelector('i');if(bar)bar.style.transform=`scaleX(${p})`;if(p>=1){show(cur+1);}raf=requestAnimationFrame(tick);}
  function run(){const was=!!raf;cancelAnimationFrame(raf);raf=0;const v=layers[front].querySelector('video');if(paused||!inView||document.hidden){if(was)held=performance.now()-t0;v?.pause();return;}if(v)play(v);if(held){t0=performance.now()-held;held=0;}raf=requestAnimationFrame(tick);}
  btns.forEach(b=>b.onclick=()=>{show(Number(b.dataset.i),true);if(still()){const v=layers[front].querySelector('video');if(v)play(v);}run();});
  playBtn.onclick=()=>{paused=!paused;setPlayLabel();if(!paused){const v=layers[front].querySelector('video');if(v)play(v);}run();};
  sec.querySelector('.sfReelOpen').onclick=ev=>{const id=ev.currentTarget.dataset.id;if(typeof openEntry==='function'){location.hash='browse';setTimeout(()=>openEntry(id),120);}};
  sec.addEventListener('keydown',ev=>{if(!ev.target.closest('.sfReelIndex'))return;const k=ev.key;if(k!=='ArrowRight'&&k!=='ArrowLeft')return;ev.preventDefault();const i=btns.indexOf(ev.target.closest('button'));const n=btns[(i+(k==='ArrowRight'?1:-1)+btns.length)%btns.length];n.focus();n.click();});
  setPlayLabel();
  const io=new IntersectionObserver(([x])=>{inView=x.isIntersecting;if(inView&&!loaded){loaded=true;show(0);}run();},{rootMargin:'300px 0px',threshold:0});io.observe(sec);
  document.addEventListener('visibilitychange',run);
  reduce.addEventListener('change',()=>{if(reduce.matches){paused=true;setPlayLabel();run();}});
 }

 /* ---------- wiring ---------- */
 function tick(){if(!cat().length)return;buildReel();buildLibrary();decorateCards();headerFilm();augmentDetail();}
 const ready=setInterval(()=>{if(cat().length&&document.getElementById('main')){clearInterval(ready);tick();
  new MutationObserver(()=>{decorateCards();augmentDetail();buildReel();buildLibrary();}).observe(document.getElementById('main'),{childList:true,subtree:true});
  const body=document.getElementById('detailBody');if(body)new MutationObserver(()=>augmentDetail()).observe(body,{childList:true});
  addEventListener('hashchange',headerFilm);document.addEventListener('visibilitychange',()=>{const v=hd?.querySelector('video');if(!v)return;document.hidden?v.pause():play(v);});
 }},150);
 window.SpecimenFilms={get,filmed,PAGE_FILM,REEL};
})();
