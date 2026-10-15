'use strict';
/* Home hero scenes. The hero can show any of five scenes: the lion-to-phoenix film (the default), the three live
   WebGL studies in their hero mode, and the original Genesis film with its four plates. A quiet row of marks in
   the hero's foot switches between them. A new scene loads behind the current one and only crossfades in once it
   is actually drawing, so the change reads as one picture dissolving into the next. */
(()=>{
 const H=window.HomeAtlas;if(!H||!H.hero)return;
 const SCENES=[
  {id:'lionfilm',name:'Lion to phoenix',label:'Lion to phoenix, film',kind:'video',src:'assets/films/lion-phoenix.mp4',small:'assets/films/lion-phoenix-720.mp4',webm:'assets/films/lion-phoenix.webm',poster:'assets/films/lion-phoenix.jpg'},
  {id:'lion',name:'Lion to phoenix · live',label:'Lion to phoenix, live particles',kind:'live',src:'studies/lion-phoenix.html?hero'},
  {id:'stardust',name:'Bird to fox',label:'Stardust bird to fox, live particles',kind:'live',src:'studies/stardust-bird-fox.html?hero'},
  {id:'lattice',name:'Golden lattice',label:'Golden lattice, live wireframe',kind:'live',src:'studies/golden-lattice.html?hero'},
  {id:'whale',name:'Whale',label:'Whale gliding, live particles',kind:'live',src:'studies/whale-glide.html?hero',tint:['#e3f0ff','#6fb0ff','#2f6dff','#a9d4ff'],eye:'#8fc2ff'},
  {id:'butterfly',name:'Butterfly',label:'Glitter butterfly, live particles',kind:'live',src:'studies/butterfly.html?hero',tint:['#fffaf0','#f3e2c0','#d9b98a','#fff1d8'],eye:'#f0dcb4'},
  {id:'jelly',name:'Jellyfish',label:'Jellyfish, film',kind:'video',src:'assets/films/jellyfish.mp4',webm:'assets/films/jellyfish.webm',poster:'assets/films/jellyfish.jpg',tint:['#f3eaff','#c7b6ff','#ffb98a','#e9d8ff'],eye:'#d6c4ff'},
  {id:'genesis',name:'Genesis',label:'Genesis, the atlas film in four plates',kind:'genesis'}];
 const KEY='vmaHeroScene',hero=H.hero,section=H.section,film=H.film,gv=H.video;
 const store={get(){try{return localStorage.getItem(KEY);}catch{return null;}},set(v){try{localStorage.setItem(KEY,v);}catch{}}};

 // the layer stack sits just above the Genesis film, under the hero's gradients and copy
 const stack=document.createElement('div');stack.className='vmaScenes';stack.setAttribute('aria-hidden','true');film.after(stack);

 // the switcher sits at the start of the foot, opposite the play control
 const meta=hero.querySelector('.vmaMeta');
 const pick=document.createElement('div');pick.className='vmaScenePick';pick.setAttribute('role','group');pick.setAttribute('aria-label','Hero scene');
 pick.innerHTML=SCENES.map((s,i)=>`<button type="button" class="vmaSceneMark" data-id="${s.id}" aria-label="${s.label}" aria-pressed="false"><span></span></button>`).join('')+'<span class="vmaSceneName" aria-live="polite"></span>';
 meta.prepend(pick);
 const nameEl=pick.querySelector('.vmaSceneName'),marks=[...pick.querySelectorAll('.vmaSceneMark')];

 let cur=null,layer=null,token=0,paused=H.reduced.matches,media=null;
 const scene=id=>SCENES.find(s=>s.id===id)||SCENES[0];
 const showName=s=>{nameEl.textContent=`${String(SCENES.indexOf(s)+1).padStart(2,'0')} · ${s.name}`;};
 marks.forEach(m=>{const s=scene(m.dataset.id);
  m.onclick=()=>switchTo(s.id,true);
  m.onmouseenter=m.onfocus=()=>showName(s);m.onmouseleave=m.onblur=()=>showName(scene(cur));});

 function post(msg){if(media&&media.tagName==='IFRAME'){['lion','stardust','lattice'].forEach(k=>{try{media.contentWindow.postMessage(k+':'+msg,'*');}catch{}});}}
 function makeLayer(s){
  const el=document.createElement('div');el.className='vmaSceneLayer isShifted';
  if(s.kind==='video'){
   const v=document.createElement('video');Object.assign(v,{muted:true,loop:true,playsInline:true,preload:'auto',poster:s.poster});v.setAttribute('muted','');
   v.innerHTML=`${s.small?`<source src="${s.small}" type="video/mp4" media="(max-width: 900px)">`:''}<source src="${s.webm}" type="video/webm"><source src="${s.src}" type="video/mp4">`;el.append(v);
   v.addEventListener('timeupdate',()=>{if(cur===s.id)H.tc.textContent=`${H.fmt(v.currentTime)} / ${H.fmt(v.duration||8)}`;});
   return {el,m:v,ready:new Promise(res=>{v.addEventListener(paused?'loadeddata':'playing',res,{once:true});if(!paused)v.play().catch(()=>v.addEventListener('loadeddata',res,{once:true}));})};
  }
  const f=document.createElement('iframe');f.src=s.src;f.title=s.label;f.tabIndex=-1;f.setAttribute('loading','eager');f.setAttribute('allowtransparency','true');el.append(f);
  return {el,m:f,ready:new Promise(res=>{const on=e=>{if(e.source===f.contentWindow&&e.data==='study:ready'){removeEventListener('message',on);res();}};addEventListener('message',on);setTimeout(res,4000);})};
 }

 function switchTo(id,user){
  const s=scene(id);if(s.id===cur)return;const my=++token,prev=layer,prevIsGenesis=cur==='genesis';
  cur=s.id;if(user)store.set(s.id);
  marks.forEach(m=>m.setAttribute('aria-pressed',String(m.dataset.id===s.id)));showName(s);
  hero.classList.toggle('sceneOther',s.kind!=='genesis');
  H.cinemaBtn.querySelector('span').textContent=hero.classList.contains('isCinema')?'Show the atlas':(s.kind==='live'?'Watch the scene':'Watch the film');
  if(s.kind==='genesis'){
   layer=null;media=null;H.eyebrow.textContent='';H.current=-1;H.tick();
   if(prev){prev.el.classList.remove('isOn');setTimeout(()=>prev.el.remove(),1800);}
   H.update();H.syncButton();return;
  }
  H.eyebrow.textContent=`Scene ${String(SCENES.indexOf(s)+1).padStart(2,'0')} · ${s.name}`;
  // each scene tints the title's iridescent word and the eyebrow to its own light; gold by default
  const tint=s.tint||['#fff4d6','#fde68a','#f2b14a','#ffe3a0'];tint.forEach((c,i)=>hero.style.setProperty('--st'+i,c));
  section.style.setProperty('--plate',s.eye||'var(--gold)');
  H.tc.textContent=s.kind==='live'?'Live · WebGL':'00:00 / 00:07';
  const L=makeLayer(s);stack.append(L.el);
  L.ready.then(()=>{
   if(my!==token){L.el.remove();return;}             // a newer choice overtook this one
   layer=L;media=L.m;L.el.classList.add('isOn');
   if(prev){prev.el.classList.remove('isOn');const old=prev;setTimeout(()=>old.el.remove(),1800);}
   if(prevIsGenesis||!prev)setTimeout(()=>{if(cur!=='genesis')gv.pause();},1700);
   H.update();H.syncButton();
  });
 }

 // play / pause, visibility and cinema mode follow whichever scene is showing
 const baseUpdate=H.update.bind(H),baseSync=H.syncButton.bind(H),baseCinema=H.cinemaBtn.onclick;
 H.update=function(){
  if(cur==='genesis'||!cur)return baseUpdate();
  const active=document.getElementById('home').classList.contains('active');
  document.body.classList.toggle('cinemaMode',active);if(!active)document.body.classList.remove('vmaCinema');
  if(layer)gv.pause();
  const run=active&&!document.hidden&&this.inView&&!paused;
  if(!media)return;
  if(media.tagName==='VIDEO'){if(run&&!H.reduced.matches)media.play().catch(()=>{});else media.pause();}
  else post(run?'play':'pause');
 };
 H.syncButton=function(){
  if(cur==='genesis'||!cur)return baseSync();
  this.playLabel.textContent=paused?'Play':'Pause';this.playBtn.setAttribute('aria-label',paused?'Play the scene':'Pause the scene');
  this.playIcon.innerHTML=paused?'<path d="M2 1l7 4-7 4z" fill="currentColor"/>':'<rect x="1" y="1" width="3" height="8" fill="currentColor"/><rect x="6" y="1" width="3" height="8" fill="currentColor"/>';
 };
 const baseTick=H.tick.bind(H);H.tick=function(){if(cur&&cur!=='genesis')return;baseTick();}; // Genesis plates only drive the foot while Genesis shows
 const basePlay=H.playBtn.onclick;
 H.playBtn.onclick=e=>{if(cur==='genesis')return basePlay(e);paused=!paused;H.update();H.syncButton();};
 H.cinemaBtn.onclick=e=>{
  if(cur==='genesis')return baseCinema(e);
  const on=hero.classList.toggle('isCinema');H.cinemaBtn.setAttribute('aria-pressed',String(on));
  H.cinemaBtn.querySelector('span').textContent=on?'Show the atlas':(scene(cur).kind==='live'?'Watch the scene':'Watch the film');
  document.body.classList.toggle('vmaCinema',on);if(on&&paused){paused=false;H.update();H.syncButton();}
 };

 switchTo(store.get()||SCENES[0].id,false);
})();
