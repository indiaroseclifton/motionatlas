'use strict';
/* 01ai brand kit v2 · behaviour for the b- concept components. No dependencies.
   B01.init(root) wires everything below it:
   [data-film]       <div class="b-film" data-film="sphere" data-base="films/" data-label="…">  muted loop, plays when visible, poster under reduced motion
   .b-annos          children <span data-anno data-at="x,y" data-to="x,y" data-side="left|right">LABEL<small>note</small></span>  (percent of the box)
   [data-tick]       <dd data-tick="14827" data-rate="2">  ticks up in six visible steps
   .b-typing         <p class="b-typing" data-text="…">  types once behind a caret
   .b-tabbar         <div class="b-tabbar" data-interval="4200"> .b-tabs buttons[data-cap] + .b-rail + .b-cap  auto-advances, pausable */
window.B01=(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const fmt=n=>Math.round(n).toLocaleString('en-US');
 const seen=(el,fn,th=.25)=>{if(!('IntersectionObserver' in window)){fn(true);return}const io=new IntersectionObserver(es=>es.forEach(e=>fn(e.isIntersecting,io)),{threshold:th});io.observe(el);return io};
 /* ---------- film ---------- */
 function film(box){if(box._b)return;box._b=1;const name=box.dataset.film,base=box.dataset.base||'films/',label=box.dataset.label||name+' film';
  box.style.backgroundImage=`url(${base}${name}.jpg)`;
  const v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.preload='none';v.poster=base+name+'.jpg';v.setAttribute('aria-label',label);
  v.innerHTML=`<source src="${base}${name}.webm" type="video/webm"><source src="${base}${name}.mp4" type="video/mp4">`;box.prepend(v);
  let want=!reduce&&box.dataset.autoplay!=='off',vis=false;
  const btn=document.createElement('button');btn.type='button';btn.className='b-film-btn';box.append(btn);
  const sync=()=>{btn.textContent=want?'Pause film':'Play film';btn.setAttribute('aria-pressed',String(!want))};
  const go=()=>{if(want&&vis){const p=v.play();p&&p.catch(()=>{})}else v.pause()};
  btn.onclick=()=>{want=!want;sync();go()};sync();
  seen(box,on=>{vis=on;go()},.3);
  box.b01={play(){want=true;sync();go()},pause(){want=false;sync();go()},video:v}}
 /* ---------- annotations ---------- */
 function annotate(box){if(box._b)return;box._b=1;const items=$$('[data-anno]',box);const NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('aria-hidden','true');box.prepend(svg);
  const labels=items.map(it=>{const l=document.createElement('span');l.className='b-anno-l';l.innerHTML=it.innerHTML;it.replaceWith(l);return {l,at:it.dataset.at.split(',').map(Number),to:it.dataset.to.split(',').map(Number),side:it.dataset.side||(Number(it.dataset.to.split(',')[0])<Number(it.dataset.at.split(',')[0])?'left':'right')}});
  function draw(){const W=box.clientWidth,H=box.clientHeight;if(!W||!H)return;svg.innerHTML='';
   labels.forEach(a=>{const x1=a.at[0]/100*W,y1=a.at[1]/100*H,x2=a.to[0]/100*W,y2=a.to[1]/100*H,leg=a.side==='left'?-26:26,x3=x2+leg;
    const pl=document.createElementNS(NS,'polyline');pl.setAttribute('points',`${x1},${y1} ${x2},${y2} ${x3},${y2}`);const len=Math.hypot(x2-x1,y2-y1)+26;pl.style.setProperty('--len',len);pl.classList.add('draw');svg.append(pl);
    const c=document.createElementNS(NS,'circle');c.setAttribute('cx',x1);c.setAttribute('cy',y1);c.setAttribute('r',4.5);svg.append(c);const d=document.createElementNS(NS,'circle');d.classList.add('core');d.setAttribute('cx',x1);d.setAttribute('cy',y1);d.setAttribute('r',1.6);svg.append(d);
    a.l.style.left=(x3+(a.side==='left'?-8:8))+'px';a.l.style.top=y2+'px';a.l.style.setProperty('--tx',a.side==='left'?'-100%':'0');a.l.style.textAlign=a.side==='left'?'right':'left';
    box.append(a.l)})}
  draw();new ResizeObserver(draw).observe(box);
  if(reduce)box.classList.add('in');else seen(box,(on,io)=>{if(on){box.classList.add('in');io&&io.disconnect()}},.35)}
 /* ---------- ticking stats ---------- */
 function tick(el){if(el._b)return;el._b=1;let v=+el.dataset.tick;el.textContent=fmt(v);if(reduce)return;const rate=+el.dataset.rate||2;let vis=true;seen(el,on=>vis=on,0);
  setInterval(()=>{if(!vis||document.hidden||Math.random()>.55)return;const from=v;v+=Math.max(1,Math.round(Math.random()*rate))*(el.dataset.drift&&Math.random()<.35?-1:1);let s=0;const t=setInterval(()=>{s++;el.textContent=fmt(from+(v-from)*s/6);if(s>=6)clearInterval(t)},80)},2200)}
 /* ---------- typing headline ---------- */
 function typing(el){if(el._b)return;el._b=1;const text=el.dataset.text||el.textContent.trim();
  const sr=document.createElement('span');sr.className='b-vh';sr.textContent=text;
  const out=document.createElement('span');out.setAttribute('aria-hidden','true');const caret=document.createElement('span');caret.className='b-caret';caret.setAttribute('aria-hidden','true');el.textContent='';el.append(sr,out,caret);
  if(reduce){out.textContent=text;return}let i=0;seen(el,(on,io)=>{if(!on)return;io&&io.disconnect();const t=setInterval(()=>{i++;out.textContent=text.slice(0,i);if(i>=text.length)clearInterval(t)},+el.dataset.speed||55)},.4)}
 /* ---------- mono tab bar ---------- */
 function tabbar(bar){if(bar._b)return;bar._b=1;const bs=$$('.b-tabs button[data-cap]',bar),rail=bar.querySelector('.b-rail'),cap=bar.querySelector('.b-cap'),pb=bar.querySelector('.b-tp');const iv=+bar.dataset.interval||4200;
  let i=Math.max(0,bs.findIndex(b=>b.getAttribute('aria-pressed')==='true')),run=!reduce&&!!pb,t0=performance.now(),raf=0;
  function sel(k,user){i=(k+bs.length)%bs.length;bs.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));if(cap){cap.setAttribute('aria-live',user?'polite':'off');cap.textContent=bs[i].dataset.cap}t0=performance.now();if(rail&&!run)rail.style.setProperty('--p',((i+1)/bs.length*100)+'%');bar.dispatchEvent(new CustomEvent('b:tab',{detail:{index:i,label:bs[i].textContent.trim()}}))}
  function frame(now){if(run){const p=Math.min(1,(now-t0)/iv);if(rail)rail.style.setProperty('--p',((i+p)/bs.length*100)+'%');if(p>=1)sel(i+1)}raf=requestAnimationFrame(frame)}
  bs.forEach((b,n)=>b.addEventListener('click',()=>sel(n,true)));
  bar.addEventListener('keydown',e=>{const d={ArrowRight:1,ArrowLeft:-1}[e.key];if(d&&e.target.closest('.b-tabs button[data-cap]')){e.preventDefault();sel(i+d,true);bs[i].focus()}});
  const syncP=()=>{if(!pb)return;pb.textContent=run?'Pause':'Play';pb.setAttribute('aria-pressed',String(!run))};
  if(pb)pb.onclick=()=>{run=!run;t0=performance.now();syncP()};syncP();
  bar.addEventListener('focusin',()=>{bar._hold=run;if(run){run=false;syncP()}});bar.addEventListener('focusout',e=>{if(!bar.contains(e.relatedTarget)&&bar._hold){run=true;t0=performance.now();syncP()}});
  sel(i);if(!reduce)raf=requestAnimationFrame(frame);
  bar.b01={select:k=>sel(k,true)}}
 function init(root=document){$$('[data-film]',root).forEach(film);$$('.b-annos',root).forEach(annotate);$$('[data-tick]',root).forEach(tick);$$('.b-typing',root).forEach(typing);$$('.b-tabbar',root).forEach(tabbar)}
 return {init,film,annotate,tick,typing,tabbar,reduce};
})();
