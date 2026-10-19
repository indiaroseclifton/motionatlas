'use strict';
/* Lazy backgrounds for the atlas. Catalogue, art, system and study cards are drawn as <div class="sheet-image">
   with an inline background-image, and the grids render dozens at once. This holds each one's image back until
   the card comes within a screen of view (hidden pages never load theirs), and on phone-width screens it uses the
   800px tile, which already covers the card at 2x. Load this before the scripts that render the grids. */
(()=>{
 if(!('IntersectionObserver' in window)||!('MutationObserver' in window))return;
 const SEL='.sheet-image';
 const io=new IntersectionObserver(es=>{for(const e of es){if(!e.isIntersecting)continue;io.unobserve(e.target);show(e.target);}},{rootMargin:'100% 0px'});
 function show(el){
  let bg=el.dataset.lazyBg;delete el.dataset.lazyBg;if(!bg||el.style.backgroundImage!=='none')return; // someone set a new image meanwhile
  if(innerWidth<=520&&!el.classList.contains('closeup')){const m=bg.match(/image-set\(\s*url\(["']?([^"')]+-800\.webp)["']?\)/);if(m)bg=`url("${m[1]}")`;}
  el.style.backgroundImage=bg;
 }
 function hold(el){
  if(el.dataset.lazyBg!==undefined)return;const bg=el.style.backgroundImage;if(!bg||!bg.includes('url('))return;
  /* no measuring here: a layout now would resolve the style and start the download we are holding back */
  el.dataset.lazyBg=bg;el.style.backgroundImage='none';io.observe(el);
 }
 new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1)continue;if(n.matches(SEL))hold(n);for(const el of n.querySelectorAll(SEL))hold(el);}})
  .observe(document.documentElement,{childList:true,subtree:true});
})();
