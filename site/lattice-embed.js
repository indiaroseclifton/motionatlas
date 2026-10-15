'use strict';
/* Featured live study on the Animation studio: "Stardust: bird to fox" (studies/stardust-bird-fox.html),
   with the earlier Golden lattice study linked alongside.
   It loads only when someone presses play, and pauses whenever it scrolls out of view. */
(()=>{
 const SRC='studies/stardust-bird-fox.html', ALT='studies/golden-lattice.html';
 function mount(){const page=document.getElementById('motion');if(!page||page.querySelector('.latticeFeature'))return !!page;const intro=page.querySelector(':scope > .intro');if(!intro)return false;
  intro.insertAdjacentHTML('afterend',`<section class="latticeFeature" aria-labelledby="latticeTitle">
   <div class="latticeFrame"><button type="button" class="latticePlay" aria-label="Play the Stardust bird to fox live study"><img src="assets/studies/stardust-bird-fox.webp" alt="" width="1600" height="900" loading="lazy" decoding="async"><span>Play live study</span></button></div>
   <div class="latticeText"><p class="cardcode">Live study · WebGL / three.js</p><h2 id="latticeTitle">Stardust: bird to fox.</h2>
    <p>About 39,000 grains of golden dust form a bird in flight, wings raised in a V, shedding a trail of embers. Every few seconds the dust lets go and re-forms as a running fox, then back again.</p>
    <ul><li>Move the pointer to drift the camera</li><li>Pick bird to fox, the golden bird or the running fox from the bar</li><li>Holds a still frame when reduced motion is on</li></ul>
    <p class="latticeLinks"><a class="secondary" href="${SRC}" target="_blank" rel="noopener">Open full screen ↗</a> <a class="secondary" href="${ALT}" target="_blank" rel="noopener">Earlier study: Golden lattice ↗</a></p></div></section>`);
  const btn=page.querySelector('.latticePlay');btn.onclick=()=>{const f=document.createElement('iframe');f.src=SRC;f.title='Stardust: bird to fox, live WebGL study';f.allow='fullscreen';f.loading='eager';btn.replaceWith(f);
   const io=new IntersectionObserver(es=>es.forEach(e=>{try{f.contentWindow.postMessage(e.isIntersecting?'lattice:play':'lattice:pause','*');}catch{}}),{threshold:.15});io.observe(f);
   addEventListener('hashchange',()=>{if(location.hash.split('?')[0]!=='#motion'){try{f.contentWindow.postMessage('lattice:pause','*');}catch{}}});};
  return true;}
 const t=setInterval(()=>{if(mount())clearInterval(t);},250);
})();
