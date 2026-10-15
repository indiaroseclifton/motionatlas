'use strict';
/* Featured live study on the Animation studio: "Golden lattice: bird & fox" (studies/golden-lattice.html).
   It loads only when someone presses play, and pauses whenever it scrolls out of view. */
(()=>{
 const SRC='studies/golden-lattice.html';
 function mount(){const page=document.getElementById('motion');if(!page||page.querySelector('.latticeFeature'))return !!page;const intro=page.querySelector(':scope > .intro');if(!intro)return false;
  intro.insertAdjacentHTML('afterend',`<section class="latticeFeature" aria-labelledby="latticeTitle">
   <div class="latticeFrame"><button type="button" class="latticePlay" aria-label="Play the Golden lattice live study"><img src="assets/studies/golden-lattice.webp" alt="" width="1600" height="820" loading="lazy" decoding="async"><span>Play live study</span></button></div>
   <div class="latticeText"><p class="cardcode">Live study · WebGL / three.js</p><h2 id="latticeTitle">Golden lattice: bird &amp; fox.</h2>
    <p>A bird and a fox built from procedural wireframe grids and twinkling vertex points. The bird soars, dissolves into a spiral vortex, re-forms as a running fox, then both move together, trailed by golden embers.</p>
    <ul><li>Drag to orbit the camera</li><li>Choose any of the four scenes from the bar at the bottom</li><li>Holds a still frame when reduced motion is on</li></ul>
    <p class="latticeLinks"><a class="secondary" href="${SRC}" target="_blank" rel="noopener">Open full screen ↗</a></p></div></section>`);
  const btn=page.querySelector('.latticePlay');btn.onclick=()=>{const f=document.createElement('iframe');f.src=SRC;f.title='Golden lattice: bird and fox, live WebGL study';f.allow='fullscreen';f.loading='eager';btn.replaceWith(f);
   const io=new IntersectionObserver(es=>es.forEach(e=>{try{f.contentWindow.postMessage(e.isIntersecting?'lattice:play':'lattice:pause','*');}catch{}}),{threshold:.15});io.observe(f);
   addEventListener('hashchange',()=>{if(location.hash.split('?')[0]!=='#motion'){try{f.contentWindow.postMessage('lattice:pause','*');}catch{}}});};
  return true;}
 const t=setInterval(()=>{if(mount())clearInterval(t);},250);
})();
