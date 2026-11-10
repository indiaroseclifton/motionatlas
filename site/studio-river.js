'use strict';
/* Animation studio: the live studies and films as one dark river that runs the full width of the page.
   No frames and no play buttons: each piece sits in the river with feathered edges, starts as it scrolls into
   view and stops as it leaves. Live WebGL studies load as they approach and are released once far away, so only
   a couple of GPU contexts exist at a time. The whale opens the river and glides across its whole width. */
(()=>{
 const ITEMS=[
  {id:'whale',kind:'live',wide:true,still:'assets/studies/whale-source.jpg',src:'studies/whale-glide.html?hero',open:'studies/whale-glide.html',kicker:'Live particles · WebGL',title:'Whale, gliding.',
   text:'About 52,000 grains of blue light, sampled from a still of a humpback, cross the page. A wave runs from head to fluke and a wake of dust is left behind in the water.',
   kit:{file:'whale-glide.html',modes:[['glide','Glide across'],['swim','Swim in place']],density:true,original:false,prompt:'A humpback whale made entirely of tiny glowing blue particles, side profile facing right, gliding through a deep black void. Electric-blue stardust outlines the body, flukes and long pectoral fins, with a trail of drifting particles behind the tail and a few soft out-of-focus blue bokeh orbs. Dark, cinematic, highly detailed, 3:2.'}},
  {id:'lionfilm',kind:'video',src:'assets/films/lion-phoenix.mp4',small:'assets/films/lion-phoenix-720.mp4',webm:'assets/films/lion-phoenix.webm',poster:'assets/films/lion-phoenix.jpg',open:'assets/films/lion-phoenix.mp4',kicker:'Film · loops seamlessly',title:'Lion to phoenix.',
   text:'A lion of golden light dissolves into a spiralling vortex, a flash, and a phoenix opens its wings.',
   kit:{original:true,prompt:'8-second particle animation to embed in a website. Warm golden particles form a lion’s head, hold, then scatter and reform into a phoenix with wings spread. Dramatic yet elegant luminous motion.'}},
  {id:'butterfly',kind:'live',still:'assets/studies/butterfly-source.jpg',src:'studies/butterfly.html?hero',open:'studies/butterfly.html',kicker:'Live particles · WebGL',title:'Glitter butterfly.',
   text:'Grains sampled from a frame of the butterfly film, wings fully open. Each grain turns about the body, so the wings fold up out of the page and open again as it drifts, shedding glitter.',
   kit:{file:'butterfly.html',modes:[['flutter','Flutter'],['rest','Rest']],density:true,original:false,prompt:'A swallowtail butterfly formed from fine champagne-gold glitter, seen from directly above with its wings fully open, on pure black. Bright glittering edges and veins, translucent wing panels, a slow gentle wingbeat, a few grains drifting away. Vertical 2:3, 15 seconds, seamless loop.'}},
  {id:'jelly',kind:'video',src:'assets/films/jellyfish.mp4',small:'assets/films/jellyfish-720.mp4',webm:'assets/films/jellyfish.webm',poster:'assets/films/jellyfish.jpg',open:'assets/films/jellyfish.mp4',kicker:'Film · loops seamlessly',title:'Jellyfish, drifting.',
   text:'A lantern jellyfish with an amber core turns through the dark while paler ones drift past, trailing threads of light.',
   kit:{original:false,prompt:'Bioluminescent jellyfish drifting in a black void: one large lantern jellyfish with a glowing amber-peach core and a translucent lavender bell, smaller pale blue and violet jellyfish trailing long smoky tentacles and fine threads of light. Slow, graceful, cinematic, 16:9, 10 seconds, seamless loop.'}},
  {id:'dove',kind:'video',tall:true,src:'assets/films/golden-dove.mp4',small:'assets/films/golden-dove-720.mp4',webm:'assets/films/golden-dove.webm',poster:'assets/films/golden-dove.jpg',open:'assets/films/golden-dove.mp4',kicker:'Film · loops seamlessly',title:'A dove of golden dust.',
   text:'A dove made of fine golden glitter beats its wings through the dark, shedding sparks that drift away behind it.',
   kit:{original:false,prompt:'A dove formed from fine champagne-gold glitter flying on pure black, wings beating slowly, every feather traced in glittering particles, sparks and dust trailing behind. Elegant, luminous, vertical 2:3, 15 seconds, seamless loop.'}},
  {id:'figure',kind:'video',tall:true,src:'assets/films/golden-figure.mp4',small:'assets/films/golden-figure-720.mp4',webm:'assets/films/golden-figure.webm',poster:'assets/films/golden-figure.jpg',open:'assets/films/golden-figure.mp4',kicker:'Film · loops seamlessly',title:'Drawn in gold leaf.',
   text:'A woman sketched in loose gold-leaf strokes on black paper. Her hair and drapery keep flowing as the lines redraw themselves.',
   kit:{original:false,prompt:'A woman in profile, eyes lowered, drawn in loose flowing gold-leaf lines on black textured paper. Her long hair and draped fabric stream and ripple as if underwater, the gilded strokes shimmering and redrawing themselves. Elegant, quiet, vertical 2:3, 15 seconds, seamless loop.'}},
  {id:'swan',kind:'video',src:'assets/films/swan-construction.mp4',small:'assets/films/swan-construction-720.mp4',webm:'assets/films/swan-construction.webm',poster:'assets/films/swan-construction.jpg',open:'assets/films/swan-construction.mp4',kicker:'Film · loops seamlessly',title:'A swan on its construction lines.',
   text:'Circles, diagonals and guides are laid down first, then a single glowing line traces the swan over them while gold bokeh drifts past.',
   kit:{original:false,prompt:'A logo-construction animation on deep charcoal: fine grey circles, diagonals and baseline guides draw in, then one warm glowing gold line traces a standing swan over the geometry, sparks rising from its head, soft gold bokeh drifting. Elegant, precise, 16:9, seamless loop.'}},
  {id:'horse',kind:'video',src:'assets/films/sketchbook-horse.mp4',small:'assets/films/sketchbook-horse-720.mp4',webm:'assets/films/sketchbook-horse.webm',poster:'assets/films/sketchbook-horse.jpg',open:'assets/films/sketchbook-horse.mp4',kicker:'Film · loops seamlessly',title:'A horse that leaves the page.',
   text:'A pencil horse gallops across an open sketchbook, trailing ribbons of warm light across the gutter.',
   kit:{original:false,prompt:'An open sketchbook on a dark wooden desk, a loose graphite drawing of a galloping horse spanning both pages; the drawing comes alive and gallops in place while ribbons of soft golden light and sparks swirl around it. Warm, cosy, 3:2, 15 seconds, seamless loop.'}},
  {id:'petals',kind:'video',tall:true,src:'assets/films/petal-swirl.mp4',small:'assets/films/petal-swirl-720.mp4',webm:'assets/films/petal-swirl.webm',poster:'assets/films/petal-swirl.jpg',open:'assets/films/petal-swirl.mp4',kicker:'Film · loops seamlessly',title:'Petals in a slow vortex.',
   text:'Translucent peach and lilac petals spiral around a glowing centre, folding over each other like silk in water.',
   kit:{original:false,prompt:'Translucent silken petals in peach, blush and lilac spiralling slowly around a softly glowing centre on a pale cream background, layers folding over each other like fabric underwater, dreamy and luminous. Vertical 2:3, 15 seconds, seamless loop.'}},
  {id:'paperbird',kind:'video',src:'assets/films/paper-bird.mp4',small:'assets/films/paper-bird-720.mp4',webm:'assets/films/paper-bird.webm',poster:'assets/films/paper-bird.jpg',open:'assets/films/paper-bird.mp4',kicker:'Film · loops seamlessly',title:'A bird cut from paper.',
   text:'A white paper-sculpture bird beats its layered wings while paper curls unfurl beneath it.',
   kit:{original:false,prompt:'A white paper-craft bird with layered cut-paper feathers flying against an off-white relief background, curled paper scrolls unfurling below, soft studio light and gentle shadows, all white on white. 3:2, 15 seconds, seamless loop.'}},
  {id:'threads',kind:'video',src:'assets/films/light-threads.mp4',small:'assets/films/light-threads-720.mp4',webm:'assets/films/light-threads.webm',poster:'assets/films/light-threads.jpg',open:'assets/films/light-threads.mp4',kicker:'Film · loops seamlessly',title:'Light threads.',
   text:'Points of cyan light swing like a chaotic pendulum, and every path they take stays on the plate until the dark fills with a tangle of glowing string.',
   kit:{original:false,prompt:'A few glowing cyan points swing on invisible strings like a chaotic multi-pendulum on pure black, each leaving a thin luminous trail that never fades, so the paths build into a dense tangle of light. Long exposure look, calm and hypnotic, 3:2, 15 seconds, seamless loop.'}},
  {id:'smoke',kind:'video',src:'assets/films/smoke-plume.mp4',small:'assets/films/smoke-plume-720.mp4',webm:'assets/films/smoke-plume.webm',poster:'assets/films/smoke-plume.jpg',open:'assets/films/smoke-plume.mp4',kicker:'Film · loops seamlessly',title:'Smoke, rising.',
   text:'Cream and amber smoke curls up out of the dark, folds over itself and spreads into a slow, soft cloud.',
   kit:{original:false,prompt:'Slow cream and warm amber smoke rising from below on pure black, curling, folding over itself and spreading into a soft billowing cloud. Studio lighting from one side, fine wisps, cinematic, 3:2, 15 seconds, seamless loop.'}},
  {id:'bloom',kind:'video',src:'assets/films/pigment-bloom.mp4',small:'assets/films/pigment-bloom-720.mp4',webm:'assets/films/pigment-bloom.webm',poster:'assets/films/pigment-bloom.jpg',open:'assets/films/pigment-bloom.mp4',kicker:'Film · loops seamlessly',title:'Pigment bloom.',
   text:'Magenta and cyan pigment collide in a burst of powder, and out of the cloud a feathered violet flower opens.',
   kit:{original:false,prompt:'A burst of magenta and cyan pigment powder colliding on black, billowing ink-like clouds, then a feathered violet flower blooms open out of the middle of the cloud. Vivid, high detail, slow motion, 3:2, 15 seconds, seamless loop.'}},
  {id:'tree',kind:'video',tall:true,src:'assets/films/particle-tree.mp4',small:'assets/films/particle-tree-720.mp4',webm:'assets/films/particle-tree.webm',poster:'assets/films/particle-tree.jpg',open:'assets/films/particle-tree.mp4',kicker:'Film · loops seamlessly',title:'A seed becomes a tree.',
   text:'A golden seed of light sprouts, its stem winds upward and branches out into a tree of glowing particles with green buds at every tip.',
   kit:{original:false,prompt:'A single seed made of golden glowing particles sprouts on black, a winding stem grows upward and branches into a full tree of fine golden light, small green glowing buds appear at the tips. Elegant, magical, vertical 2:3, 15 seconds, seamless loop.'}},
];

 const M=window.AtlasMotion||{lite:false,saveData:false,sources:s=>`<source src="${s.webm}" type="video/webm"><source src="${s.src}" type="video/mp4">`,setFull(){}};
 const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let held=reduce.matches||M.saveData; // the river-wide pause (Data Saver starts it held)
 const rows=[];

 function mediaFor(it){
  if(it.kind==='video'){const v=document.createElement('video');Object.assign(v,{muted:true,loop:true,playsInline:true,preload:'none',poster:it.poster});v.setAttribute('muted','');v.setAttribute('aria-label',it.title.replace(/\.$/,''));
   if(M.saveData)v.controls=true;v.innerHTML=M.sources(it);return v;}
  // on a low-power device a live study shows its source still instead of running WebGL
  if(M.lite){const im=document.createElement('img');im.src=it.still;im.alt='';im.decoding='async';im.className='riverStill';return im;}
  const f=document.createElement('iframe');f.src=it.src;f.title=it.title.replace(/\.$/,'')+', live study';f.tabIndex=-1;f.setAttribute('allowtransparency','true');f.setAttribute('loading','eager');return f;
 }
 function post(f,msg){['whale','lion','stardust','fly'].forEach(k=>{try{f.contentWindow.postMessage(k+':'+msg,'*');}catch{}});}
 function run(r){
  if(!r.m||r.m.tagName==='IMG')return;const go=r.visible&&!held&&isMotion();
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
   return {code:`<video autoplay muted loop playsinline poster="${a(it.poster)}" aria-label="${it.title.replace(/\.$/,'')}"\n  style="display:block;width:100%;height:auto;background:#000;${feather}">\n  <source src="${a(it.small)}" type="video/mp4" media="(max-width: 900px)">\n  <source src="${a(it.src)}" type="video/mp4">\n  <source src="${a(it.webm)}" type="video/webm">\n</video>`};}
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
   ${M.lite?`<p class="riverLite">Showing stills on this device to save power. <button type="button" class="riverLiteOn">Show live motion</button></p>`:''}
   <button type="button" class="riverHold" aria-pressed="${held}">${held?'Play the motion':'Pause the motion'}</button></div>`+
   ITEMS.map((it,i)=>`<article class="riverRow${it.wide?' isWide':''}${it.tall?' isTall':''}${!it.wide&&i%2===0?' isFlip':''}" data-id="${it.id}">
    <div class="riverMedia${it.kind==='video'?' isFilm':''}"></div>
    <div class="riverText"><p class="riverKicker">${esc(it.kicker)}</p><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p>
     <a class="riverOpen" href="${it.open}" target="_blank" rel="noopener">${it.kind==='video'?'Open the film':'Open full screen'} <span aria-hidden="true">↗</span></a>${kitHTML(it)}</div></article>`).join('');
  const anchor=intro.nextElementSibling&&intro.nextElementSibling.classList.contains("aeRelated")?intro.nextElementSibling:intro;anchor.after(river);bindKits(river);
  const fit=()=>{const sb=innerWidth-document.documentElement.clientWidth;river.style.setProperty('--sbw',sb+'px');};fit();addEventListener('resize',fit);

  river.querySelectorAll('.riverRow').forEach(el=>{const it=ITEMS.find(x=>x.id===el.dataset.id);const r={el,it,box:el.querySelector('.riverMedia'),m:null,visible:false};rows.push(r);
  });
  // load as a piece approaches, release live studies once far away
  const near=new IntersectionObserver(es=>es.forEach(e=>{const r=rows.find(x=>x.el===e.target);if(!r)return;
   if(e.isIntersecting){if(!r.m){r.m=mediaFor(r.it);if(r.m.tagName==='IFRAME')r.m.addEventListener('load',()=>run(r));else if(r.m.tagName==='VIDEO')r.m.preload=M.saveData?'none':'auto';r.box.append(r.m);run(r);}else if(r.m.tagName==='VIDEO'&&r.m.preload==='none'){r.m.preload='auto';}}
   else if(r.m&&r.m.tagName==='IFRAME'){r.m.remove();r.m=null;}}),{rootMargin:'40% 0px'});
  const seen=new IntersectionObserver(es=>es.forEach(e=>{const r=rows.find(x=>x.el===e.target);if(!r)return;r.visible=e.isIntersecting;
   run(r);}),{threshold:.3});
  rows.forEach(r=>{near.observe(r.el);seen.observe(r.el);});
  const liteOn=river.querySelector('.riverLiteOn');if(liteOn)liteOn.onclick=()=>{M.setFull(true);location.reload();};
  const btn=river.querySelector('.riverHold');
  btn.onclick=()=>{held=!held;btn.setAttribute('aria-pressed',String(held));btn.textContent=held?'Play the motion':'Pause the motion';rows.forEach(run);};
  addEventListener('hashchange',()=>setTimeout(()=>rows.forEach(run),50));
  document.addEventListener('visibilitychange',()=>rows.forEach(run));
  return true;
 }
 const t=setInterval(()=>{if(mount())clearInterval(t);},250);
})();
