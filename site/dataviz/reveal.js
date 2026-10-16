'use strict';
/* FlowReveal: builds a rendered chart up in reading order. It reads the geometry of the live SVG, so it
   works for every diagram type and style without the renderers knowing about it:
   - big regions (lanes, group boxes) and the heading are there from the start;
   - cards appear one by one with the labels, chips and icons that sit inside them;
   - connectors draw on just before the card they lead to;
   - loops (dashed) come last, so the story ends with "and then it repeats".
   plan(svg,{order}) → {duration, apply(t), reset()} with t in milliseconds. */
(()=>{
const SKIP='defs,marker,pattern,clipPath,mask,filter,symbol,linearGradient,radialGradient,style,title,desc';
const DRAW='path,rect,circle,ellipse,line,polyline,polygon,text,image,use';
const ease=p=>p<=0?0:p>=1?1:1-Math.pow(1-p,3);

function plan(svg,opt={}){
 const vb=svg.viewBox.baseVal,W=vb&&vb.width?vb.width:svg.width.baseVal.value,H=vb&&vb.height?vb.height:svg.height.baseVal.value;
 const sr=svg.getBoundingClientRect(),kx=W/sr.width,ky=H/sr.height;
 const box=el=>{const r=el.getBoundingClientRect();return {x:(r.left-sr.left)*kx,y:(r.top-sr.top)*ky,w:r.width*kx,h:r.height*ky};};
 const els=[...svg.querySelectorAll(DRAW)].filter(el=>!el.closest(SKIP)&&!(el.parentElement&&el.parentElement.closest('text')));
 const A=W*H,items=els.map(el=>{const b=box(el),cs=getComputedStyle(el);const fill=cs.fill,stroke=cs.stroke;
  return {el,b,area:b.w*b.h,cx:b.x+b.w/2,cy:b.y+b.h/2,tag:el.tagName.toLowerCase(),filled:fill&&fill!=='none'&&!/rgba\([^)]*,\s*0\)/.test(fill),
   stroked:stroke&&stroke!=='none',dashed:(el.getAttribute('stroke-dasharray')||cs.strokeDasharray||'none')!=='none',text:el.tagName==='text'?el.textContent:''};});
 /* roles */
 const cards=[],loops=[],links=[],stat=[],rest=[];
 for(const it of items){
  if(it.dashed&&!it.filled&&it.tag==='path'){loops.push(it);continue;}
  if(it.area>=A*.12||it.b.w>=W*.9){stat.push(it);continue;}
  if((it.tag==='rect'||it.tag==='path'||it.tag==='polygon'||it.tag==='ellipse'||it.tag==='circle')&&it.filled&&it.b.w>=44&&it.b.h>=26&&it.area<A*.12){cards.push(it);continue;}
  if((it.tag==='path'||it.tag==='line'||it.tag==='polyline')&&!it.filled&&it.stroked&&Math.max(it.b.w,it.b.h)>=24){links.push(it);continue;}
  rest.push(it);}
 /* heading: everything above the first card */
 const top=cards.length?Math.min(...cards.map(c=>c.b.y))-2:0;
 const isHead=it=>it.b.y+it.b.h<=top;
 /* cards nested in cards (a chip-sized panel inside a card) belong to the outer card */
 cards.sort((a,b)=>b.area-a.area);
 const inside=(it,c)=>it.cx>=c.b.x-1&&it.cx<=c.b.x+c.b.w+1&&it.cy>=c.b.y-1&&it.cy<=c.b.y+c.b.h+1;
 const units=[],unitOf=new Map();
 for(const c of cards){const host=units.find(u=>u.kind==='card'&&inside(c,u.main)&&u.main.area>c.area*1.6);if(host){host.parts.push(c);unitOf.set(c,host);continue;}
  const u={kind:'card',main:c,parts:[c]};units.push(u);unitOf.set(c,u);}
 /* loop labels: any small thing whose text has the loop glyph, plus the pill it sits on */
 const loopText=rest.filter(it=>/↺/.test(it.text));const loopSet=new Set(loopText);
 rest.forEach(it=>{if(it.tag!=='text'&&loopText.some(t=>inside(t,it)&&it.area<A*.02))loopSet.add(it);});
 const cardUnits=units.filter(u=>u.kind==='card');
 for(const it of rest){if(isHead(it)){stat.push(it);continue;}
  const u=!loopSet.has(it)&&cardUnits.filter(u=>inside(it,u.main.b?u.main:u.main)).sort((a,b)=>a.main.area-b.main.area)[0];
  if(u){u.parts.push(it);continue;}
  if(loopSet.has(it)&&!cardUnits.some(u=>inside(it,u.main))){loops.push(it);continue;}
  units.push({kind:'note',main:it,parts:[it]});}
 const notes=units.filter(u=>u.kind==='note');const texts=notes.filter(u=>u.main.tag==='text');
 for(const u of notes){if(u.main.tag==='text'||u.main.b.w>14||u.main.b.h>14)continue;let best=null,bd=1e9;for(const tx of texts){const dy=Math.abs(tx.main.cy-u.main.cy),dx=tx.main.b.x-(u.main.b.x+u.main.b.w);if(dy<12&&dx>-4&&dx<28&&dx+dy<bd){bd=dx+dy;best=tx;}}if(best){best.parts.push(...u.parts);u.merged=true;}}
 for(let i=units.length-1;i>=0;i--)if(units[i].merged)units.splice(i,1);
 links.forEach(l=>{if(isHead(l)){stat.push(l);return;}units.push({kind:'link',main:l,parts:[l]});});
 /* reading order */
 const order=opt.order||'y';const ccx=W/2,ccy=H/2;
 const key=u=>{const b=u.main.b,cx=u.main.cx,cy=u.main.cy;
  if(u.kind==='link'){/* a connector sorts at the far end of its run, just before what it points to */
   if(order==='x')return [b.x+b.w-1,cy];if(order==='cols')return [Math.round((b.x+b.w-1)/40)*1e4+b.y+b.h-1,0];if(order==='rows')return [Math.round((b.y+b.h-1)/60)*1e5+b.x+b.w,0];if(order==='angle'){const a=Math.atan2(cy-ccy,cx-ccx);return [((a+Math.PI/2+Math.PI*2)%(Math.PI*2))-.01,0];}
   return [b.y+b.h-1,cx];}
  if(order==='x')return [b.x,cy];
  if(order==='cols'){const col=Math.round(b.x/40);return [col*1e4+cy,0];}
  if(order==='rows'){const row=Math.round(b.y/60);return [row*1e5+b.x,0];}
  if(order==='angle'){const d=Math.hypot(cx-ccx,cy-ccy);if(d<Math.min(W,H)*.2)return [99,0];const a=Math.atan2(cy-ccy,cx-ccx);return [(a+Math.PI/2+Math.PI*2)%(Math.PI*2),0];}
  if(order==='radial'){return [Math.hypot(cx-ccx,cy-ccy),Math.atan2(cy-ccy,cx-ccx)];}
  return [b.y,cx];};
 units.forEach(u=>u.k=key(u));units.sort((a,b)=>a.k[0]-b.k[0]||a.k[1]-b.k[1]);
 /* timing: aim for a total that suits the size, never rushed, never dragging */
 const n=units.filter(u=>u.kind!=='link').length||1,speed=opt.speed||1;
 const step=Math.max(90,Math.min(320,5200/n))/speed,cardDur=420/speed,linkDur=300/speed;
 let t=250/speed;const intro=t;
 units.forEach(u=>{if(u.kind==='link'){u.s=Math.max(intro,t-step*.55);u.d=linkDur;}else{u.s=t;u.d=cardDur;t+=step;}});
 const loopStart=t+150/speed,loopDur=700/speed;const end=(loops.length?loopStart+loopDur:t+cardDur)+120/speed;
 /* path lengths for draw-on */
 const lens=new Map();units.forEach(u=>{if(u.kind==='link'){try{lens.set(u.main.el,u.main.el.getTotalLength());}catch{lens.set(u.main.el,0);}}});
 loops.forEach(l=>{if(l.tag==='path'){try{lens.set(l.el,l.el.getTotalLength());}catch{}}});
 const saved=new Map();const touch=el=>{if(!saved.has(el))saved.set(el,el.getAttribute('style'));};
 const all=[...units.flatMap(u=>u.parts),...loops];all.forEach(it=>touch(it.el));
 function setCard(u,p){const e=ease(p),dy=(1-e)*8;for(const it of u.parts){it.el.style.opacity=e.toFixed(3);it.el.style.transform=dy>.01?`translateY(${dy.toFixed(2)}px)`:'';}}
 function setLink(u,p){const el=u.main.el,L=lens.get(el)||0,e=ease(p);if(L>0){el.style.strokeDasharray=`${L} ${L}`;el.style.strokeDashoffset=((1-e)*L).toFixed(2);el.style.opacity=p>0?'1':'0';}else el.style.opacity=e.toFixed(3);
  /* arrowheads appear at the end of the draw */
  if(el.hasAttribute('marker-end'))el.style.markerEnd=p>=.98?'':'none';}
 function apply(ms){for(const u of units){const p=(ms-u.s)/u.d;if(u.kind==='link')setLink(u,Math.max(0,Math.min(1,p)));else setCard(u,Math.max(0,Math.min(1,p)));}
  const lp=ease(Math.max(0,Math.min(1,(ms-loopStart)/loopDur)));for(const it of loops){it.el.style.opacity=lp.toFixed(3);}}
 function reset(){for(const [el,st] of saved){if(st==null)el.removeAttribute('style');else el.setAttribute('style',st);}}
 return {duration:end,apply,reset,count:n,units:units.length};}

/* a sensible reading order for each diagram type */
const ORDER={flow:'y',stepper:'y',stages:'cols',cycle:'angle',tree:'x',capability:'rows',swimlanes:'x',mindmap:'radial'};
window.FlowReveal={plan,ORDER};
})();
