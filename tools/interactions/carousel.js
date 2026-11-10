/* Carousel engine: drag, arrow keys, click a card. n() is the item count, draw(pos) places the cards. */
/* Artwork is drawn with CSS gradients, so nothing has to load. Swap art(i) for your own image URLs if you have them. */
const PAL=[['#FF8A3D','#FFD166','#7A1E0A'],['#19C2C9','#2B4CFF','#051937'],['#FF8FA3','#FFB703','#7A1F3D'],['#F4E3C1','#D9A066','#6B4423'],['#38BDF8','#F472B6','#0B2545'],['#D8DEE9','#8FA3BF','#1F2937'],['#3DDC97','#0E9F6E','#062B22'],['#FFE066','#FF7A59','#5C1A1B'],['#A7F3D0','#0EA5E9','#0B2E33']];
const art=i=>{const [a,b,c]=PAL[((i%PAL.length)+PAL.length)%PAL.length],k=i*37%100;return `radial-gradient(90% 70% at ${15+k*.5}% ${8+k*.25}%,${a},transparent 62%),radial-gradient(80% 80% at ${88-k*.4}% ${28+k*.3}%,${b},transparent 58%),radial-gradient(120% 90% at 50% 115%,${a}55,transparent 60%),linear-gradient(160deg,${c},#000 140%)`};
const ITEMS=[['Ember','Warm, slow, glowing'],['Lagoon','Cool water at night'],['Orchid','Colour let loose'],['Dune','Soft planes of sand'],['Nebula','Dust, gas and distance'],['Glacier','Pale and precise'],['Moss','Deep, quiet green'],['Nectar','Sweet and bright'],['Dusk','The last light']];
function carousel(stage,n,draw,o={}){let pos=0,target=0,drag=null,raf=0;
 const wrap=v=>o.loop?v:Math.max(0,Math.min(n()-1,v)),mod=v=>((v%n())+n())%n();
 function frame(){pos+=(target-pos)*(calm?1:.14);if(Math.abs(target-pos)<.002)pos=target;draw(pos);raf=pos===target?0:requestAnimationFrame(frame)}
 const kick=()=>{if(!raf)raf=requestAnimationFrame(frame)};
 const go=t=>{target=wrap(t);o.onChange&&o.onChange(mod(Math.round(target)));kick()};
 stage.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;drag={x:e.clientX,t:target,m:0};stage.setPointerCapture(e.pointerId)});
 stage.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;drag.m=Math.max(drag.m,Math.abs(dx));target=wrap(drag.t-dx/(o.step?o.step():170));kick()});
 const up=e=>{if(!drag)return;const m=drag.m;drag=null;if(m<6){const c=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-i]');if(c){const t=Math.round(target),i=+c.dataset.i;let d=i-mod(t);if(o.loop){if(d>n()/2)d-=n();if(d<-n()/2)d+=n()}return go(t+d)}}go(Math.round(target))};
 stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
 stage.addEventListener('keydown',e=>{const k=e.key;if(k==='ArrowRight'){e.preventDefault();go(Math.round(target)+1)}else if(k==='ArrowLeft'){e.preventDefault();go(Math.round(target)-1)}else if(k==='Home'){e.preventDefault();go(0)}else if(k==='End'){e.preventDefault();go(n()-1)}});
 let hold=false,timer=0;['pointerenter','focusin'].forEach(t=>stage.addEventListener(t,()=>hold=true));['pointerleave','focusout'].forEach(t=>stage.addEventListener(t,()=>hold=false));
 const api={go,next:()=>go(Math.round(target)+1),prev:()=>go(Math.round(target)-1),redraw:()=>draw(pos),mod,auto(ms){clearInterval(timer);if(ms&&!calm)timer=setInterval(()=>{if(!hold&&!drag){if(!o.loop&&Math.round(target)>=n()-1)go(0);else api.next()}},ms)}};return api}
/* distance of card i from the centre, wrapped for looping carousels */
const dist=(i,pos,n,loop)=>{let d=i-pos;if(loop){d=((d%n)+n)%n;if(d>n/2)d-=n}return d};
