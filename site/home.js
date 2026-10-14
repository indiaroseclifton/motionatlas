'use strict';
/* Home: the Visual & Motion Atlas landing page. The Genesis film plays full-bleed;
   the plate index along the foot follows the film's four chapters. The rest of the
   home page carries the same type, palette and plate language. */
window.HomeAtlas={
 PLATES:[
  {no:'I',name:'Harmonics',color:'--ice'},
  {no:'II',name:'Specimens',color:'--mint'},
  {no:'III',name:'Dimension',color:'--rose'},
  {no:'IV',name:'Biosphere',color:'--gold'}
 ],
 LEN:10,TOTAL:40,
 init(){
 if(document.getElementById('home'))return;
 if(!document.getElementById('atlasHomeFonts')){
  const f=document.createElement('link');f.id='atlasHomeFonts';f.rel='stylesheet';
  f.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Manrope:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.append(f);
 }
 const section=document.createElement('section');section.id='home';section.className='page';
 const plate=(id,file,x,y,name,tag)=>`<a class="vmaPlate" href="#systems?id=${id}"><div class="vmaPlateImage" data-bg="assets/${file}" style="background-position:${x}% ${y}%" role="img" aria-label="${name} original design-system concept"></div><div class="vmaPlateCaption"><span class="vmaPlateName">${name}</span><span class="vmaPlateTag">${tag}</span></div></a>`;
 section.innerHTML=`<div class="vmaHome">
<section class="vmaHero" id="vmaHero" aria-label="Visual and Motion Atlas">
 <div class="vmaFilm" id="vmaFilm" aria-hidden="true">
  <img src="assets/atlas-hero-poster.jpg" alt="">
  <video id="genesisHero" muted playsinline loop preload="metadata">
   <source src="assets/atlas-hero-720.mp4" type="video/mp4" media="(max-width: 900px)">
   <source src="assets/atlas-hero-1080.mp4" type="video/mp4">
   <source src="assets/atlas-hero.webm" type="video/webm">
  </video>
 </div>
 <div class="vmaInner vmaCopy">
  <p class="vmaEyebrow vmaRise vmaD1" id="vmaEyebrow">Plate I &middot; Harmonics</p>
  <h1 class="vmaRise vmaD2" id="homeTitle"><span class="vmaLn">Visual <span class="vmaAmp">&amp;</span></span><span class="vmaLn"><em>Motion</em> Atlas</span></h1>
  <p class="vmaLede vmaRise vmaD3">A field guide to how images move. Every plate traces one idea from its equation to its living form, the way <strong>140 spinning harmonics</strong> draw a planet, then grow it a garden.</p>
  <div class="vmaActions vmaRise vmaD4">
   <a class="vmaBtn vmaBtnPrimary" href="#browse">Open the atlas <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg></a>
   <button class="vmaBtn vmaBtnGhost" type="button" id="vmaCinemaBtn" aria-pressed="false"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor"/><path d="M6.5 6v4l3.5-2z" fill="currentColor"/></svg><span>Watch the film</span></button>
  </div>
  <p class="vmaFormula vmaRise vmaD5" aria-label="Fourier series used to draw the film"><var>f(t) = &Sigma; c<sub>k</sub> e<sup>ik&omega;t</sup></var><span>&middot; the rule behind every line in this film</span></p>
 </div>
 <footer class="vmaInner vmaFoot vmaRise vmaD6" id="plates">
  <div class="vmaMeta">
   <div class="vmaMetaLeft"><span>Genesis &middot; Plates I&ndash;IV</span><span class="vmaTc" id="vmaTc">00:00 / 00:40</span></div>
   <button class="vmaCtl" type="button" id="vmaPlayBtn" aria-label="Pause the film"><svg viewBox="0 0 10 10" aria-hidden="true" id="vmaPlayIcon"><rect x="1" y="1" width="3" height="8" fill="currentColor"/><rect x="6" y="1" width="3" height="8" fill="currentColor"/></svg><span id="vmaPlayLabel">Pause</span></button>
  </div>
  <ol class="vmaPlates" id="vmaPlateList">
   <li><button class="vmaPlateBtn" type="button" data-t="0" aria-current="true"><span class="vmaBar"></span><span class="vmaNo">PLATE I &middot; 0:00</span><span class="vmaName">Harmonics</span><span class="vmaDesc">Epicycles trace a planet from frequency.</span></button></li>
   <li><button class="vmaPlateBtn" type="button" data-t="10"><span class="vmaBar"></span><span class="vmaNo">PLATE II &middot; 0:10</span><span class="vmaName">Specimens</span><span class="vmaDesc">Oak, rose, willow, stag and bird drawn in light.</span></button></li>
   <li><button class="vmaPlateBtn" type="button" data-t="20"><span class="vmaBar"></span><span class="vmaNo">PLATE III &middot; 0:20</span><span class="vmaName">Dimension</span><span class="vmaDesc">Flat blueprints rise into a wireframe garden.</span></button></li>
   <li><button class="vmaPlateBtn" type="button" data-t="30"><span class="vmaBar"></span><span class="vmaNo">PLATE IV &middot; 0:30</span><span class="vmaName">Biosphere</span><span class="vmaDesc">Flocks orbit a living world, then return to the void.</span></button></li>
  </ol>
 </footer>
</section>

<nav class="vmaInner vmaIndex" aria-label="Atlas sections"><span class="vmaLabel">Browse the atlas</span><a href="#systems">Design systems</a><a href="#motion">Animation studio</a><a href="#art">Art &amp; graphics</a><a href="#ux">UI components</a><a href="#typography">Typography</a><a href="#effects">Landing effects</a></nav>

<section class="vmaInner vmaSection" style="--c:var(--mint)">
 <div class="vmaSectionHead"><div><p class="vmaLabel vmaLabelC">Design systems &middot; 32 worlds</p><h2>Different worlds.<br><em>One creative library.</em></h2></div><p>Original concepts, coordinated materials and individual assets. Go from a whole visual world to the detail that makes it work.</p></div>
 <div class="vmaPlates3">${plate('D31','4bb6531f690e.jpg',0,100,'Nexus','Electric / dimensional')}${plate('D26','d1bd34fc70f4.jpg',100,0,'Palette','Colour / expressive')}${plate('D32','4bb6531f690e.jpg',100,100,'Terralux','Precision / scientific')}</div>
 <a class="vmaTextLink" href="#systems">Explore every design system <span aria-hidden="true">&rarr;</span></a>
</section>

<section class="vmaMotion" aria-labelledby="homeMotionTitle" style="--c:var(--rose)">
 <div class="vmaInner vmaMotionGrid">
  <div class="vmaKinetic" aria-hidden="true"><canvas id="vmaEpicycle" width="560" height="560"></canvas></div>
  <div class="vmaMotionCopy">
   <p class="vmaLabel vmaLabelC">Animation studio &middot; 60 studies</p>
   <h2 id="homeMotionTitle">See how<br><em>an idea moves.</em></h2>
   <p>Play graphic animations and interface transitions. Slow them down, change the timing and explore the mechanics behind the movement.</p>
   <div class="vmaActions"><a class="vmaBtn vmaBtnPrimary" href="#motion">Enter the animation studio <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg></a><a class="vmaBtn vmaBtnGhost" href="#effects">Try landing effects</a></div>
   <button id="homeMotionToggle" class="vmaCtl" type="button" aria-pressed="false">Pause the drawing</button>
  </div>
 </div>
</section>

<section class="vmaInner vmaSection" style="--c:var(--ice)">
 <div class="vmaSectionHead"><div><p class="vmaLabel vmaLabelC">Specimens &middot; 230 entries</p><h2>The whole system.<br><em>And every little part.</em></h2></div><p>Find controls, graphics, typography and icon assets from our original concepts. Inspect the source, download a specimen or try an editable component.</p></div>
 <div class="vmaPlates2">${plate('D24','09b1d06eba49.jpg',100,100,'Golden Hour','Player / tactile controls')}${plate('D25','d1bd34fc70f4.jpg',0,0,'Clearspace','Glass / translucent layers')}</div>
 <div class="vmaLinks"><a href="#assets">Extracted assets &rarr;</a><a href="#icons">Icon families &rarr;</a><a href="#typography">Fonts &amp; pairings &rarr;</a><a href="#references">Official sources &amp; downloads &rarr;</a></div>
</section>

<section class="vmaInner vmaSection vmaProject" style="--c:var(--gold)">
 <div><p class="vmaLabel vmaLabelC">My projects</p><h2>Give your next<br><em>project a world.</em></h2></div>
 <div><p>Collect directions and references around the thing you&rsquo;re making. Keep your own work alongside the ideas that started it.</p><div class="vmaActions"><a class="vmaBtn vmaBtnPrimary" href="#projects">Open my projects <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"/></svg></a><a class="vmaTextLink" href="#creations">Explore published creations <span aria-hidden="true">&rarr;</span></a></div></div>
</section>

<footer class="vmaInner vmaFooter"><span>Visual &amp; Motion Atlas</span><a href="#inspiration">Your inspiration library &rarr;</a><a href="#home?film" id="vmaBackToFilm">Back to the film &uarr;</a></footer>
</div>`;
 document.getElementById('main').prepend(section);

 const $=s=>section.querySelector(s);
 this.section=section;this.hero=$('#vmaHero');this.film=$('#vmaFilm');this.video=$('#genesisHero');
 this.tc=$('#vmaTc');this.eyebrow=$('#vmaEyebrow');this.plates=[...section.querySelectorAll('.vmaPlateBtn')];
 this.playBtn=$('#vmaPlayBtn');this.playLabel=$('#vmaPlayLabel');this.playIcon=$('#vmaPlayIcon');this.cinemaBtn=$('#vmaCinemaBtn');
 this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.userPaused=this.reduced.matches;this.current=-1;this.inView=true;

 const v=this.video;
 v.addEventListener('playing',()=>{this.film.classList.add('isPlaying');this.syncButton();requestAnimationFrame(()=>this.tick());});
 v.addEventListener('pause',()=>{this.syncButton();this.tick();});
 v.addEventListener('seeked',()=>this.tick());
 this.playBtn.onclick=()=>{if(v.paused){this.userPaused=false;v.play().catch(()=>{});}else{this.userPaused=true;v.pause();}};
 this.plates.forEach(p=>p.onclick=()=>{v.currentTime=Number(p.dataset.t)+0.05;this.film.classList.add('isPlaying');this.userPaused=false;v.play().catch(()=>{});this.tick();});
 this.cinemaBtn.onclick=()=>{const on=this.hero.classList.toggle('isCinema');this.cinemaBtn.setAttribute('aria-pressed',String(on));this.cinemaBtn.querySelector('span').textContent=on?'Show the atlas':'Watch the film';document.body.classList.toggle('vmaCinema',on);if(on){if(v.currentTime>1)v.currentTime=0;this.film.classList.add('isPlaying');this.userPaused=false;v.play().catch(()=>{});}};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.hero.classList.contains('isCinema'))this.cinemaBtn.click();});
 $('#vmaBackToFilm').onclick=e=>{e.preventDefault();this.hero.scrollIntoView({behavior:this.reduced.matches?'auto':'smooth'});};

 this.observer=new IntersectionObserver(([e])=>{this.inView=e.isIntersecting;this.update();},{threshold:.15});this.observer.observe(this.hero);
 document.addEventListener('visibilitychange',()=>this.update());
 this.reduced.addEventListener('change',()=>{if(this.reduced.matches){this.userPaused=true;v.pause();}});

 // Plate imagery below the film loads as it approaches the screen
 const lazy=section.querySelectorAll('[data-bg]');
 const show=el=>{el.style.backgroundImage=`url(${el.dataset.bg})`;el.removeAttribute('data-bg');};
 if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){show(e.target);io.unobserve(e.target);}}),{rootMargin:'600px 0px'});lazy.forEach(el=>io.observe(el));}else lazy.forEach(show);

 this.epicycle($('#vmaEpicycle'),section.querySelector('.vmaMotion'),$('#homeMotionToggle'));
 this.setPlate(0);this.syncButton();
 },
 fmt(s){s=Math.max(0,Math.floor(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');},
 setPlate(i){
  if(i===this.current)return;this.current=i;const c=this.PLATES[i];
  this.eyebrow.textContent=`Plate ${c.no} · ${c.name}`;
  this.section.style.setProperty('--plate',`var(${c.color})`);
  this.plates.forEach((p,k)=>p.setAttribute('aria-current',k===i?'true':'false'));
 },
 tick(){
  const t=this.video.currentTime||0,i=Math.min(3,Math.floor(t/this.LEN));
  this.setPlate(i);this.plates[i].style.setProperty('--p',`${((t-i*this.LEN)/this.LEN)*100}%`);
  this.tc.textContent=`${this.fmt(t)} / ${this.fmt(this.TOTAL)}`;
  if(!this.video.paused)requestAnimationFrame(()=>this.tick());
 },
 syncButton(){
  const paused=this.video.paused;
  this.playLabel.textContent=paused?'Play':'Pause';
  this.playBtn.setAttribute('aria-label',paused?'Play the film':'Pause the film');
  this.playIcon.innerHTML=paused?'<path d="M2 1l7 4-7 4z" fill="currentColor"/>':'<rect x="1" y="1" width="3" height="8" fill="currentColor"/><rect x="6" y="1" width="3" height="8" fill="currentColor"/>';
 },
 /* A small live Fourier drawing for the motion section: five harmonics tracing a rose. */
 epicycle(canvas,band,toggle){
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const S=1.12,N=5,R=[118,52,30,18,10],F=[1,-3,5,-7,9],P=[0,.6,1.4,.3,2.1];
  let phi=0,running=!this.reduced.matches,raf=0,last=0;const trail=[];
  const css=n=>getComputedStyle(band).getPropertyValue(n).trim()||'#fda4af';
  const draw=()=>{
   const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2;ctx.clearRect(0,0,w,h);
   ctx.lineWidth=1;ctx.strokeStyle='rgba(190,210,240,.16)';
   let x=cx,y=cy;
   for(let k=0;k<N;k++){const a=F[k]*phi+P[k];ctx.beginPath();ctx.arc(x,y,R[k]*S,0,Math.PI*2);ctx.stroke();const nx=x+R[k]*S*Math.cos(a),ny=y+R[k]*S*Math.sin(a);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(nx,ny);ctx.strokeStyle='rgba(238,242,248,.55)';ctx.stroke();ctx.strokeStyle='rgba(190,210,240,.16)';x=nx;y=ny;}
   trail.push([x,y]);if(trail.length>720)trail.shift();
   ctx.beginPath();trail.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));
   ctx.strokeStyle=css('--rose');ctx.lineWidth=2;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=12;ctx.stroke();ctx.shadowBlur=0;
   ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();
  };
  for(let i=0;i<720;i++){phi=i/720*Math.PI*2;if(i<719){let x=canvas.width/2,y=canvas.height/2;for(let k=0;k<N;k++){const a=F[k]*phi+P[k];x+=R[k]*S*Math.cos(a);y+=R[k]*S*Math.sin(a);}trail.push([x,y]);}}
  draw();
  const loop=now=>{if(!running)return;raf=requestAnimationFrame(loop);if(now-last<33)return;last=now;phi+=0.012;draw();};
  const set=on=>{running=on;cancelAnimationFrame(raf);if(on)raf=requestAnimationFrame(loop);toggle.setAttribute('aria-pressed',String(!on));toggle.textContent=on?'Pause the drawing':'Play the drawing';};
  toggle.onclick=()=>set(!running);
  new IntersectionObserver(([e])=>{if(!e.isIntersecting&&running){cancelAnimationFrame(raf);}else if(e.isIntersecting&&running){raf=requestAnimationFrame(loop);}}).observe(canvas);
  set(running);
 },
 update(){
  if(!this.video)return;
  const active=document.getElementById('home').classList.contains('active');
  document.body.classList.toggle('cinemaMode',active);
  if(!active)document.body.classList.remove('vmaCinema');
  if(!active||document.hidden||!this.inView)this.video.pause();
  else if(!this.userPaused&&!this.reduced.matches)this.video.play().catch(()=>this.syncButton());
 }
};

HomeAtlas.init();
if(!location.hash||location.hash.split('?')[0]==='#home'){document.getElementById('home').classList.add('active');document.querySelectorAll('.page:not(#home)').forEach(p=>p.classList.remove('active'));document.body.classList.add('cinemaMode');HomeAtlas.update();}
