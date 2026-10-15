'use strict';
/* Featured live studies on the Animation studio. Three WebGL studies share one frame: a row of chips picks the study,
   each loads only when someone presses play, and the playing one pauses whenever it scrolls out of view. */
(()=>{
 const STUDIES=[
  {id:'lion',src:'studies/lion-phoenix.html',poster:'assets/studies/lion-phoenix.webp',chip:'Lion to phoenix',title:'Lion to phoenix.',
   text:'An 8-second loop. About 80,000 grains of golden dust form a lion in profile, sampled from a reference still built from the same dust, so they gather on the fur, the eye and every strand of the mane. The mane blows away first, the dust swirls, and it re-forms as a phoenix with its wings spread.',
   notes:['Holds the lion, transforms, holds the phoenix, returns: 8 s in all','Pick the loop, the lion or the phoenix from the bar','Holds a still frame when reduced motion is on']},
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
  box.innerHTML=`<button type="button" class="latticePlay" aria-label="Play the ${esc(s.chip)} live study"><img src="${s.poster}" alt="" width="1600" height="900" loading="lazy" decoding="async"><span>Play live study</span></button>`;
  text.querySelector('h2').textContent=s.title;text.querySelector('.latticeBody').textContent=s.text;
  text.querySelector('ul').innerHTML=s.notes.map(n=>`<li>${esc(n)}</li>`).join('');
  text.querySelector('.latticeOpen').href=s.src;
  page.querySelectorAll('.studyChip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.id===s.id)));
  const btn=box.querySelector('.latticePlay');btn.onclick=()=>{const f=document.createElement('iframe');f.src=s.src;f.title=s.title.replace(/\.$/,'')+', live WebGL study';f.allow='fullscreen';f.loading='eager';btn.replaceWith(f);frame=f;
   io=new IntersectionObserver(es=>es.forEach(e=>post(e.isIntersecting?'play':'pause')),{threshold:.15});io.observe(f);};
 }
 function mount(){const page=document.getElementById('motion');if(!page||page.querySelector('.latticeFeature'))return !!page;const intro=page.querySelector(':scope > .intro');if(!intro)return false;
  intro.insertAdjacentHTML('afterend',`<section class="latticeFeature" aria-labelledby="latticeTitle">
   <div class="latticeFrame"></div>
   <div class="latticeText"><p class="cardcode">Live studies · WebGL / three.js</p>
    <div class="studyChips" role="group" aria-label="Choose a live study">${STUDIES.map(s=>`<button type="button" class="studyChip" data-id="${s.id}" aria-pressed="false">${esc(s.chip)}</button>`).join('')}</div>
    <h2 id="latticeTitle"></h2><p class="latticeBody"></p><ul></ul>
    <p class="latticeLinks"><a class="secondary latticeOpen" href="#" target="_blank" rel="noopener">Open full screen ↗</a></p></div></section>`);
  page.querySelectorAll('.studyChip').forEach(c=>c.onclick=()=>show(page,STUDIES.find(s=>s.id===c.dataset.id)));
  show(page,STUDIES[0]);
  addEventListener('hashchange',()=>{if(location.hash.split('?')[0]!=='#motion')post('pause');});
  return true;}
 const t=setInterval(()=>{if(mount())clearInterval(t);},250);
})();
