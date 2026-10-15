'use strict';
/* Animation studio: the live studies and films as one dark river that runs the full width of the page.
   No frames and no play buttons: each piece sits in the river with feathered edges, starts as it scrolls into
   view and stops as it leaves. Live WebGL studies load as they approach and are released once far away, so only
   a couple of GPU contexts exist at a time. The whale opens the river and glides across its whole width. */
(()=>{
 const ITEMS=[
  {id:'whale',kind:'live',wide:true,src:'studies/whale-glide.html?hero',open:'studies/whale-glide.html',kicker:'Live particles · WebGL',title:'Whale, gliding.',
   text:'About 52,000 grains of blue light, sampled from a still of a humpback, cross the page. A wave runs from head to fluke and a wake of dust is left behind in the water.',
   kit:{file:'whale-glide.html',modes:[['glide','Glide across'],['swim','Swim in place']],density:true,original:false,prompt:'A humpback whale made entirely of tiny glowing blue particles, side profile facing right, gliding through a deep black void. Electric-blue stardust outlines the body, flukes and long pectoral fins, with a trail of drifting particles behind the tail and a few soft out-of-focus blue bokeh orbs. Dark, cinematic, highly detailed, 3:2.'}},
  {id:'lion',kind:'live',src:'studies/lion-phoenix.html?hero',open:'studies/lion-phoenix.html',kicker:'Live particles · WebGL',title:'Lion to phoenix.',
   text:'A lion of golden dust, sampled from the reference still. The mane goes first, the dust turns through a spiral galaxy and settles as the phoenix from the film. An 8-second loop.',
   kit:{file:'lion-phoenix.html',modes:[['loop','Lion to phoenix'],['lion','Lion'],['phoenix','Phoenix']],density:true,original:true,prompt:'8-second particle animation to embed in a website. Warm golden particles form a lion’s head, hold, then scatter and reform into a phoenix with wings spread. Dramatic yet elegant luminous motion.'}},
  {id:'lionfilm',kind:'video',src:'assets/films/lion-phoenix.mp4',small:'assets/films/lion-phoenix-720.mp4',webm:'assets/films/lion-phoenix.webm',poster:'assets/films/lion-phoenix.jpg',open:'assets/films/lion-phoenix.mp4',kicker:'Film · loops seamlessly',title:'Lion to phoenix, the film.',
   text:'The original film the live study grew from: the lion dissolves into a golden vortex, a flash, and the phoenix opens its wings.',
   kit:{original:true,prompt:'8-second particle animation to embed in a website. Warm golden particles form a lion’s head, hold, then scatter and reform into a phoenix with wings spread. Dramatic yet elegant luminous motion.'}},
  {id:'butterfly',kind:'live',src:'studies/butterfly.html?hero',open:'studies/butterfly.html',kicker:'Live particles · WebGL',title:'Glitter butterfly.',
   text:'Grains sampled from a frame of the butterfly film, wings fully open. Each grain turns about the body, so the wings fold up out of the page and open again as it drifts, shedding glitter.',
   kit:{file:'butterfly.html',modes:[['flutter','Flutter'],['rest','Rest']],density:true,original:false,prompt:'A swallowtail butterfly formed from fine champagne-gold glitter, seen from directly above with its wings fully open, on pure black. Bright glittering edges and veins, translucent wing panels, a slow gentle wingbeat, a few grains drifting away. Vertical 2:3, 15 seconds, seamless loop.'}},
  {id:'jelly',kind:'video',src:'assets/films/jellyfish.mp4',small:'assets/films/jellyfish-720.mp4',webm:'assets/films/jellyfish.webm',poster:'assets/films/jellyfish.jpg',open:'assets/films/jellyfish.mp4',kicker:'Film · loops seamlessly',title:'Jellyfish, drifting.',
   text:'A lantern jellyfish with an amber core turns through the dark while paler ones drift past, trailing threads of light.',
   kit:{original:false,prompt:'Bioluminescent jellyfish drifting in a black void: one large lantern jellyfish with a glowing amber-peach core and a translucent lavender bell, smaller pale blue and violet jellyfish trailing long smoky tentacles and fine threads of light. Slow, graceful, cinematic, 16:9, 10 seconds, seamless loop.'}},
  {id:'stardust',kind:'live',src:'studies/stardust-bird-fox.html?hero',open:'studies/stardust-bird-fox.html',kicker:'Live particles · WebGL',title:'Stardust: bird to fox.',
   text:'Golden dust settles over animated models of a stork in flight and a running fox; every few seconds it lets go and re-forms as the other animal.',
   kit:{file:'stardust-bird-fox.html',modes:[['loop','Bird to fox'],['bird','Golden bird'],['fox','Running fox']],density:false,original:false,prompt:'Golden stardust forms a stork in flight with its wings raised in a V, shedding embers, then lets go and re-forms as a running fox, and back again. Additive gold particles on black, soft bokeh, elegant and calm.'}}];

 const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let held=reduce.matches; // the river-wide pause
 const rows=[];

 function mediaFor(it){
  if(it.kind==='video'){const v=document.createElement('video');Object.assign(v,{muted:true,loop:true,playsInline:true,preload:'none',poster:it.poster});v.setAttribute('muted','');v.setAttribute('aria-label',it.title.replace(/\.$/,''));
   v.innerHTML=`${it.small?`<source src="${it.small}" type="video/mp4" media="(max-width: 900px)">`:''}<source src="${it.webm}" type="video/webm"><source src="${it.src}" type="video/mp4">`;return v;}
  const f=document.createElement('iframe');f.src=it.src;f.title=it.title.replace(/\.$/,'')+', live study';f.tabIndex=-1;f.setAttribute('allowtransparency','true');f.setAttribute('loading','eager');return f;
 }
 function post(f,msg){['whale','lion','stardust','fly'].forEach(k=>{try{f.contentWindow.postMessage(k+':'+msg,'*');}catch{}});}
 function run(r){
  if(!r.m)return;const go=r.visible&&!held&&isMotion();
  if(r.m.tagName==='VIDEO'){if(go)r.m.play().catch(()=>{});else r.m.pause();}
  else post(r.m,go?'play':'pause');
 }
 const isMotion=()=>document.getElementById('motion')?.classList.contains('active');

 /* "Use it on your site": live settings, an embed snippet that follows them, and the prompt behind the piece */
 const ORIGIN=location.origin;
 function kitHTML(it){
  const k=it.kit;if(!k)return '';const live=it.kind==='live',id=it.id;
  return `<details class="riverKit"><summary>Use it on your site</summary><div class="kitBody">
   ${live?`<label class="kitField"><span>Speed</span><input type="range" min="0.25" max="3" step="0.05" value="1" data-k="speed"><output>1×</output></label>`:''}
   ${live&&k.density?`<label class="kitField"><span>Particles</span><input type="range" min="0.2" max="1.5" step="0.05" value="1" data-k="density"><output>100%</output></label>`:''}
   ${live&&k.modes?`<label class="kitField"><span>Starts as</span><select data-k="mode">${k.modes.map(([v,l])=>`<option value="${v}">${esc(l)}</option>`).join('')}</select></label>`:''}
   <div class="kitChecks">${live?`<label><input type="checkbox" data-k="bg" checked> Transparent background</label>`:''}<label><input type="checkbox" data-k="feather" checked> Feathered edges</label></div>
   <pre class="kitCode" tabindex="0" aria-label="Embed code"><code></code></pre>
   <div class="kitActions"><button type="button" class="kitCopy" data-what="code">Copy embed code</button>${live?`<a class="kitPreview" target="_blank" rel="noopener">Preview with these settings <span aria-hidden="true">↗</span></a>`:''}<span class="kitStatus" role="status"></span></div>
   <p class="riverKicker">${k.original?'The original prompt':'A prompt to recreate the source'}</p>
   <p class="kitPrompt">${esc(k.prompt)}</p>
   <button type="button" class="kitCopy" data-what="prompt">Copy prompt</button>
  </div></details>`;
 }
 const FEATHER='-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 58%,transparent 100%);mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 58%,transparent 100%);';
 function kitCode(it,box){
  const v=k=>box.querySelector(`[data-k="${k}"]`),feather=v('feather')?.checked?FEATHER:'';
  if(it.kind==='video'){const a=p=>ORIGIN+'/'+p;
   return {code:`<video autoplay muted loop playsinline poster="${a(it.poster)}" aria-label="${it.title.replace(/\.$/,'')}"\n  style="display:block;width:100%;height:auto;background:#000;${feather}">\n  <source src="${a(it.small)}" type="video/mp4" media="(max-width: 900px)">\n  <source src="${a(it.webm)}" type="video/webm">\n  <source src="${a(it.src)}" type="video/mp4">\n</video>`};}
  const q=new URLSearchParams();const sp=+v('speed').value,dn=v('density')?+v('density').value:1,md=v('mode')?.value;
  if(sp!==1)q.set('speed',sp);if(dn!==1)q.set('density',dn);if(md&&md!==it.kit.modes[0][0])q.set('mode',md);q.set('controls','0');
  const bg=v('bg').checked;if(bg)q.set('bg','transparent');
  // the live site serves clean URLs (no .html); a local preview server needs the file name
  const page=/^(localhost|127\.)/.test(location.hostname)?it.kit.file:it.kit.file.replace(/\.html$/,'');
  const url=`${ORIGIN}/studies/${page}?${q}`;
  return {url:url.replace('controls=0&','').replace('?controls=0','?').replace(/[?&]$/,''),code:`<iframe src="${url}"\n  title="${it.title.replace(/\.$/,'')}" loading="lazy" allow="fullscreen"\n  style="display:block;width:100%;aspect-ratio:16/9;border:0;background:${bg?'transparent':'#000'};${feather}"></iframe>`};
 }
 function bindKits(river){
  river.querySelectorAll('.riverRow').forEach(row=>{const it=ITEMS.find(x=>x.id===row.dataset.id),box=row.querySelector('.riverKit');if(!box)return;
   const code=box.querySelector('.kitCode code'),prev=box.querySelector('.kitPreview'),status=box.querySelector('.kitStatus');
   const update=()=>{box.querySelectorAll('input[type=range]').forEach(r=>{const o=r.nextElementSibling;o.textContent=r.dataset.k==='speed'?(+r.value).toFixed(2).replace(/\.?0+$/,'')+'×':Math.round(r.value*100)+'%';});
    const c=kitCode(it,box);code.textContent=c.code;if(prev)prev.href=c.url;};
   box.addEventListener('input',update);update();
   box.querySelectorAll('.kitCopy').forEach(b=>b.onclick=()=>{const text=b.dataset.what==='code'?code.textContent:it.kit.prompt;
    const done=ok=>{status.textContent=ok?(b.dataset.what==='code'?'Embed code copied':'Prompt copied'):'Select the text to copy it';setTimeout(()=>status.textContent='',2200);};
    (navigator.clipboard?navigator.clipboard.writeText(text):Promise.reject()).then(()=>done(true),()=>{const r=document.createRange();r.selectNodeContents(b.dataset.what==='code'?code:box.querySelector('.kitPrompt'));const s=getSelection();s.removeAllRanges();s.addRange(r);done(false);});});
  });
 }
 function mount(){
  const page=document.getElementById('motion');if(!page||page.querySelector('.studyRiver'))return !!page;
  const intro=page.querySelector(':scope > .intro');if(!intro)return false;
  const river=document.createElement('section');river.className='studyRiver';river.setAttribute('aria-labelledby','riverTitle');
  river.innerHTML=`<div class="riverHead"><p class="riverKicker">Live studies &amp; films</p><h2 id="riverTitle">Motion, set loose.</h2>
   <button type="button" class="riverHold" aria-pressed="${held}">${held?'Play the motion':'Pause the motion'}</button></div>`+
   ITEMS.map((it,i)=>`<article class="riverRow${it.wide?' isWide':''}${!it.wide&&i%2===0?' isFlip':''}" data-id="${it.id}">
    <div class="riverMedia${it.kind==='video'?' isFilm':''}"></div>
    <div class="riverText"><p class="riverKicker">${esc(it.kicker)}</p><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p>
     <a class="riverOpen" href="${it.open}" target="_blank" rel="noopener">${it.kind==='video'?'Open the film':'Open full screen'} <span aria-hidden="true">↗</span></a>${kitHTML(it)}</div></article>`).join('');
  intro.after(river);bindKits(river);
  const fit=()=>{const sb=innerWidth-document.documentElement.clientWidth;river.style.setProperty('--sbw',sb+'px');};fit();addEventListener('resize',fit);

  river.querySelectorAll('.riverRow').forEach(el=>{const it=ITEMS.find(x=>x.id===el.dataset.id);const r={el,it,box:el.querySelector('.riverMedia'),m:null,visible:false};rows.push(r);
   // films keep their poster in place from the start so the river is never empty
   if(it.kind==='video'){r.m=mediaFor(it);r.box.append(r.m);}});
  // load as a piece approaches, release live studies once far away
  const near=new IntersectionObserver(es=>es.forEach(e=>{const r=rows.find(x=>x.el===e.target);if(!r)return;
   if(e.isIntersecting){if(!r.m){r.m=mediaFor(r.it);r.m.addEventListener('load',()=>run(r));r.box.append(r.m);}else if(r.m.tagName==='VIDEO'&&r.m.preload==='none'){r.m.preload='auto';}}
   else if(r.m&&r.m.tagName==='IFRAME'){r.m.remove();r.m=null;}}),{rootMargin:'90% 0px'});
  const seen=new IntersectionObserver(es=>es.forEach(e=>{const r=rows.find(x=>x.el===e.target);if(!r)return;r.visible=e.isIntersecting;
   run(r);}),{threshold:.3});
  rows.forEach(r=>{near.observe(r.el);seen.observe(r.el);});
  const btn=river.querySelector('.riverHold');
  btn.onclick=()=>{held=!held;btn.setAttribute('aria-pressed',String(held));btn.textContent=held?'Play the motion':'Pause the motion';rows.forEach(run);};
  addEventListener('hashchange',()=>setTimeout(()=>rows.forEach(run),50));
  document.addEventListener('visibilitychange',()=>rows.forEach(run));
  return true;
 }
 const t=setInterval(()=>{if(mount())clearInterval(t);},250);
})();
