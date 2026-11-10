/* Carousel engine: drag, arrow keys, click a card. n() is the item count, draw(pos) places the cards. */
const IMG=n=>'../../assets/shelf/'+n+'.webp';
const ITEMS=[['amber','Amber resin','Warm, slow, translucent'],['biolum','Night water','Light that answers touch'],['bloom','Pigment bloom','Colour let loose in water'],['origami','Folded paper','Sharp planes, soft shadow'],['nebula','Deep field','Dust, gas and distance'],['sumi','Floating ink','One breath, one line'],['threads','Light threads','Fine lines under tension'],['owl','Carved owl','Grain as feather'],['sand','Sand drawing','Patterns from vibration']];
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
