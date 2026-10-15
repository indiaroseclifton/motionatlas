'use strict';
/* Animation studio: the live studies and films as one dark river that runs the full width of the page.
   No frames and no play buttons: each piece sits in the river with feathered edges, starts as it scrolls into
   view and stops as it leaves. Live WebGL studies load as they approach and are released once far away, so only
   a couple of GPU contexts exist at a time. The whale opens the river and glides across its whole width. */
(()=>{
 const ITEMS=[
  {id:'whale',kind:'live',wide:true,src:'studies/whale-glide.html?hero',open:'studies/whale-glide.html',kicker:'Live particles · WebGL',title:'Whale, gliding.',
   text:'About 52,000 grains of blue light, sampled from a still of a humpback, cross the page. A wave runs from head to fluke and a wake of dust is left behind in the water.'},
  {id:'lion',kind:'live',src:'studies/lion-phoenix.html?hero',open:'studies/lion-phoenix.html',kicker:'Live particles · WebGL',title:'Lion to phoenix.',
   text:'A lion of golden dust, sampled from the reference still. The mane goes first, the dust turns through a spiral galaxy and settles as the phoenix from the film. An 8-second loop.'},
  {id:'lionfilm',kind:'video',src:'assets/films/lion-phoenix.mp4',webm:'assets/films/lion-phoenix.webm',poster:'assets/films/lion-phoenix.jpg',open:'assets/films/lion-phoenix.mp4',kicker:'Film · loops seamlessly',title:'Lion to phoenix, the film.',
   text:'The original film the live study grew from: the lion dissolves into a golden vortex, a flash, and the phoenix opens its wings.'},
  {id:'butterfly',kind:'live',src:'studies/butterfly.html?hero',open:'studies/butterfly.html',kicker:'Live particles · WebGL',title:'Glitter butterfly.',
   text:'Grains sampled from a frame of the butterfly film, wings fully open. Each grain turns about the body, so the wings fold up out of the page and open again as it drifts, shedding glitter.'},
  {id:'jelly',kind:'video',src:'assets/films/jellyfish.mp4',webm:'assets/films/jellyfish.webm',poster:'assets/films/jellyfish.jpg',open:'assets/films/jellyfish.mp4',kicker:'Film · loops seamlessly',title:'Jellyfish, drifting.',
   text:'A lantern jellyfish with an amber core turns through the dark while paler ones drift past, trailing threads of light.'},
  {id:'stardust',kind:'live',src:'studies/stardust-bird-fox.html?hero',open:'studies/stardust-bird-fox.html',kicker:'Live particles · WebGL',title:'Stardust: bird to fox.',
   text:'Golden dust settles over animated models of a stork in flight and a running fox; every few seconds it lets go and re-forms as the other animal.'},
  {id:'lattice',kind:'live',src:'studies/golden-lattice.html?hero',open:'studies/golden-lattice.html',kicker:'Live wireframe · WebGL',title:'Golden lattice.',
   text:'A bird and a fox drawn as procedural wireframe and twinkling vertices, dissolving through a spiral vortex into one another.'}];
 const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let held=reduce.matches; // the river-wide pause
 const rows=[];

 function mediaFor(it){
  if(it.kind==='video'){const v=document.createElement('video');Object.assign(v,{muted:true,loop:true,playsInline:true,preload:'none',poster:it.poster});v.setAttribute('muted','');v.setAttribute('aria-label',it.title.replace(/\.$/,''));
   v.innerHTML=`<source src="${it.webm}" type="video/webm"><source src="${it.src}" type="video/mp4">`;return v;}
  const f=document.createElement('iframe');f.src=it.src;f.title=it.title.replace(/\.$/,'')+', live study';f.tabIndex=-1;f.setAttribute('allowtransparency','true');f.setAttribute('loading','eager');return f;
 }
 function post(f,msg){['whale','lion','stardust','lattice','fly'].forEach(k=>{try{f.contentWindow.postMessage(k+':'+msg,'*');}catch{}});}
 function run(r){
  if(!r.m)return;const go=r.visible&&!held&&isMotion();
  if(r.m.tagName==='VIDEO'){if(go)r.m.play().catch(()=>{});else r.m.pause();}
  else post(r.m,go?'play':'pause');
 }
 const isMotion=()=>document.getElementById('motion')?.classList.contains('active');

 function mount(){
  const page=document.getElementById('motion');if(!page||page.querySelector('.studyRiver'))return !!page;
  const intro=page.querySelector(':scope > .intro');if(!intro)return false;
  const river=document.createElement('section');river.className='studyRiver';river.setAttribute('aria-labelledby','riverTitle');
  river.innerHTML=`<div class="riverHead"><p class="riverKicker">Live studies &amp; films</p><h2 id="riverTitle">Motion, set loose.</h2>
   <button type="button" class="riverHold" aria-pressed="${held}">${held?'Play the motion':'Pause the motion'}</button></div>`+
   ITEMS.map((it,i)=>`<article class="riverRow${it.wide?' isWide':''}${!it.wide&&i%2===0?' isFlip':''}" data-id="${it.id}">
    <div class="riverMedia${it.kind==='video'?' isFilm':''}"></div>
    <div class="riverText"><p class="riverKicker">${esc(it.kicker)}</p><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p>
     <a class="riverOpen" href="${it.open}" target="_blank" rel="noopener">${it.kind==='video'?'Open the film':'Open full screen'} <span aria-hidden="true">↗</span></a></div></article>`).join('');
  intro.after(river);
  const fit=()=>{const sb=innerWidth-document.documentElement.clientWidth;river.style.setProperty('--sbw',sb+'px');};fit();addEventListener('resize',fit);

  river.querySelectorAll('.riverRow').forEach(el=>{const it=ITEMS.find(x=>x.id===el.dataset.id);const r={el,it,box:el.querySelector('.riverMedia'),m:null,visible:false};rows.push(r);
   // films keep their poster in place from the start so the river is never empty
   if(it.kind==='video'){r.m=mediaFor(it);r.box.append(r.m);}});
  // load as a piece approaches, release live studies once far away
  const near=new IntersectionObserver(es=>es.forEach(e=>{const r=rows.find(x=>x.el===e.target);if(!r)return;
   if(e.isIntersecting){if(!r.m){r.m=mediaFor(r.it);r.m.addEventListener('load',()=>run(r));r.box.append(r.m);}else if(r.m.tagName==='VIDEO'&&r.m.preload==='none'){r.m.preload='auto';}}
   else if(r.m&&r.m.tagName==='IFRAME'){r.m.remove();r.m=null;}}),{rootMargin:'90% 0px'});
  const seen=new IntersectionObserver(es=>es.forEach(e=>{const r=rows.find(x=>x.el===e.target);if(!r)return;r.visible=e.isIntersecting;
   run(r);}),{threshold:.3});
  rows.forEach(r=>{near.observe(r.el);seen.observe(r.el);});
  const btn=river.querySelector('.riverHold');
  btn.onclick=()=>{held=!held;btn.setAttribute('aria-pressed',String(held));btn.textContent=held?'Play the motion':'Pause the motion';rows.forEach(run);};
  addEventListener('hashchange',()=>setTimeout(()=>rows.forEach(run),50));
  document.addEventListener('visibilitychange',()=>rows.forEach(run));
  return true;
 }
 const t=setInterval(()=>{if(mount())clearInterval(t);},250);
})();
