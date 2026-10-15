'use strict';
/* Featured live studies on the Animation studio. Three WebGL studies share one frame: a row of chips picks the study,
   each loads only when someone presses play, and the playing one pauses whenever it scrolls out of view. */
(()=>{
 const STUDIES=[
  {id:'lion',src:'studies/lion-phoenix.html',poster:'assets/studies/lion-phoenix.webp',chip:'Lion to phoenix',title:'Lion to phoenix.',
   text:'An 8-second loop in live particles. About 80,000 grains of golden dust form a lion sampled from the reference still, so they gather on the fur, the eye and every strand of the mane. The mane goes first, the dust is drawn into a turning spiral galaxy, and it re-forms as the phoenix from the film.',
   notes:['Lion 2 s, vortex 3 s, phoenix 2 s, back to the lion: 8 s in all','Pick the loop, the lion or the phoenix from the bar','Holds a still frame when reduced motion is on']},
  {id:'film',video:true,src:'assets/films/lion-phoenix.mp4',webm:'assets/films/lion-phoenix.webm',poster:'assets/films/lion-phoenix.jpg',chip:'Lion to phoenix film',title:'Lion to phoenix, the film.',
   text:'The original 8-second film the live study is built from: the lion dissolves into a golden vortex, a flash, and the phoenix opens its wings. Encoded for the web with a soft crossfade at the loop point, so it repeats without a cut.',
   notes:['720p, about 4 MB, silent','Plays muted and loops; use the controls to pause','Use it where a video file suits better than live WebGL']},
  {id:'stardust',src:'studies/stardust-bird-fox.html',poster:'assets/studies/stardust-bird-fox.webp',chip:'Bird to fox',title:'Stardust: bird to fox.',
   text:'About 39,000 grains of golden dust settle over real sculpted models of a stork in flight and a running fox, so the wingbeat and the gallop come from the animated models. Every few seconds the dust lets go and re-forms as the other animal.',
   notes:['Move the pointer to drift the camera','Pick bird to fox, the golden bird or the running fox from the bar','Holds a still frame when reduced motion is on']},
  {id:'lattice',src:'studies/golden-lattice.html',poster:'assets/studies/golden-lattice.webp',chip:'Golden lattice',title:'Golden lattice: bird & fox.',
   text:'A bird and a fox built from procedural wireframe grids and twinkling vertex points. The bird soars, dissolves into a spiral vortex, re-forms as a running fox, then both move together, trailed by golden embers.',
   notes:['Drag to orbit the camera','Choose any of the four scenes from the bar at the bottom','Holds a still frame when reduced motion is on']}];
 const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
 let frame=null,io=null;
 const post=msg=>{if(!frame)return;['lion','stardust','lattice'].forEach(k=>{try{frame.contentWindow.postMessage(k+':'+msg,'*');}catch{}});};
 function show(page,s){
  const box=page.querySelector('.latticeFrame'),text=page.querySelector('.latticeText');
  if(io){io.disconnect();io=null;}frame=null;
  box.innerHTML=`<button type="button" class="latticePlay" aria-label="Play the ${esc(s.chip)}${s.video?'':' live study'}"><img src="${s.poster}" alt="" width="1600" height="900" loading="lazy" decoding="async"><span>${s.video?'Play film':'Play live study'}</span></button>`;
  text.querySelector('h2').textContent=s.title;text.querySelector('.latticeBody').textContent=s.text;
  text.querySelector('ul').innerHTML=s.notes.map(n=>`<li>${esc(n)}</li>`).join('');
  text.querySelector('.latticeOpen').href=s.src;
  page.querySelectorAll('.studyChip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.id===s.id)));
  const btn=box.querySelector('.latticePlay');
  if(s.video){btn.onclick=()=>{const v=document.createElement('video');Object.assign(v,{muted:true,loop:true,playsInline:true,autoplay:true,controls:true,poster:s.poster});v.setAttribute('aria-label',s.title);
   v.innerHTML=`<source src="${s.webm}" type="video/webm"><source src="${s.src}" type="video/mp4">`;btn.replaceWith(v);v.play().catch(()=>{});
   io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)v.pause();}),{threshold:.15});io.observe(v);};return;}
  btn.onclick=()=>{const f=document.createElement('iframe');f.src=s.src;f.title=s.title.replace(/\.$/,'')+', live WebGL study';f.allow='fullscreen';f.loading='eager';btn.replaceWith(f);frame=f;
   io=new IntersectionObserver(es=>es.forEach(e=>post(e.isIntersecting?'play':'pause')),{threshold:.15});io.observe(f);};
 }
 function mount(){const page=document.getElementById('motion');if(!page||page.querySelector('.latticeFeature'))return !!page;const intro=page.querySelector(':scope > .intro');if(!intro)return false;
  intro.insertAdjacentHTML('afterend',`<section class="latticeFeature" aria-labelledby="latticeTitle">
   <div class="latticeFrame"></div>
   <div class="latticeText"><p class="cardcode">Live studies &amp; films · WebGL / three.js</p>
    <div class="studyChips" role="group" aria-label="Choose a live study">${STUDIES.map(s=>`<button type="button" class="studyChip" data-id="${s.id}" aria-pressed="false">${esc(s.chip)}</button>`).join('')}</div>
    <h2 id="latticeTitle"></h2><p class="latticeBody"></p><ul></ul>
    <p class="latticeLinks"><a class="secondary latticeOpen" href="#" target="_blank" rel="noopener">Open full screen ↗</a></p></div></section>`);
  page.querySelectorAll('.studyChip').forEach(c=>c.onclick=()=>show(page,STUDIES.find(s=>s.id===c.dataset.id)));
  show(page,STUDIES[0]);
  addEventListener('hashchange',()=>{if(location.hash.split('?')[0]!=='#motion')post('pause');});
  return true;}
 const t=setInterval(()=>{if(mount())clearInterval(t);},250);
})();
