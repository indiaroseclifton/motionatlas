'use strict';
/* Explore the catalogue by feel.
   Every entry gets "feels" (Liquid & metal, Pen & line, Generative, Print & paper, Light & glow,
   Handmade, Glass & soft, Digital & retro) from keyword rules plus a few hand-picked overrides.
   The catalogue gains feel chips with live counts, "Has film" and "Live study" toggles, a search that
   understands feel words ("liquid", "pen", "print"…), shareable links (#browse?feel=liquid&film=1)
   and feel tags in each entry's detail view. */
(()=>{
 const FEELS=[
  {k:'liquid',name:'Liquid & metal',words:['liquid','fluid','water','ink','ferro','mercury','metal','soap','metaball','blob','jelly','marbl','caustic','ripple','wet','drip','chrome','molten','suminagashi','thin-film'],alias:['liquid','metal','fluid','water','ink']},
  {k:'line',name:'Pen & line',words:['linework','line drawing','line art','line-art','pen','drawing','drawn','draws a','contour','isoline','harmonograph','lissajous','plotter','engrav','blueprint','epicycle','wireframe','sketch','hand-drawn','pendulum','attractor','cyanotype','technical drawing','svg line','crosshatch','graphite'],alias:['pen','line','lines','drawing','draw','machine','machines']},
  {k:'generative',name:'Generative',words:['generative','procedural','simulation','fractal','automata','voronoi','reaction','attractor','flow field','vector field','l-system','particle','noise','swarm','boids','flock','aggregation','mycel','erosion','lattice','algorithm','chaos','raymarch','mandel','sdf','growth'],alias:['generative','procedural','simulation','algorithmic','code']},
  {k:'print',name:'Print & paper',words:['print','riso','paper','zine','cyanotype','botanical plate','collage','origami','letterpress','halftone','newsprint','cutout','cut-out','engraving','stamp'],alias:['print','paper','editorial','riso','zine']},
  {k:'light',name:'Light & glow',words:['glow','neon','lumin','caustic','laser','nebula','thermal','aurora','phosphor','stained glass','chromatic','sunlit','volumetric','bioluminescent','light painting','light-painting','backlit','light and shadow','light, shadow'],alias:['light','glow','neon','luminous']},
  {k:'hand',name:'Handmade',words:['clay','plasticine','sand','stitch','embroider','paint','watercolour','watercolor','pinscreen','puppet','craft','tactile','handmade','stop-motion','stop motion','felt','wood','domino','cloth','fabric','wayang','marbling','hand-coloured','illustrated'],alias:['handmade','hand','craft','tactile','material']},
  {k:'glass',name:'Glass & soft',words:['glass','translucent','frosted','neumorph','mesh gradient','pastel','claymorph','aurora','blown glass','jelly'],alias:['glass','soft','glossy','translucent']},
  {k:'retro',name:'Digital & retro',words:['crt','terminal','ascii','pixel','glitch','synthwave','retro','datamosh','scanline','8-bit','vhs','telemetry','cli','phosphor','voxel','compression','game of life'],alias:['retro','digital','pixel','glitch','terminal']},
 ];
 const rx=w=>w.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 FEELS.forEach(f=>f.re=new RegExp('(^|[^a-z])('+f.words.map(rx).join('|')+')','i'));
 const OVERRIDE={A49:['liquid','generative'],A23:['liquid','glass'],A88:['liquid','generative','glass'],A50:['liquid','light','glass'],A70:['liquid','light'],A53:['liquid','hand','print'],A37:['liquid','generative'],
  A56:['line','print'],A80:['line','hand'],A01:['line','generative'],A76:['line','generative'],A84:['line','generative','light'],A54:['line','print'],S21:['line','print'],A35:['line','generative'],
  A02:['print'],S20:['print','retro'],A55:['print','hand','line'],S22:['print','hand'],A10:['print','hand'],A29:['print','hand'],A77:['print','hand','light'],
  A26:['generative','retro'],A78:['generative','liquid'],A51:['generative'],A69:['generative'],A12:['generative','line'],A81:['generative','light'],A85:['generative'],A33:['generative','glass'],A32:['generative','line'],
  A67:['light','generative'],A63:['light','line'],A75:['light','liquid'],A40:['light','generative'],A87:['light','hand','glass'],S14:['light','glass'],
  A72:['hand'],A08:['hand'],A86:['hand','retro'],A17:['hand','glass'],A07:['hand','liquid'],A09:['hand','line'],A83:['hand','light','print'],S15:['hand','glass'],S13:['glass','liquid'],
  A04:['retro','generative'],A05:['retro'],A48:['retro','light'],S19:['retro'],A03:['retro','line'],A19:['retro','light']};
 const STUDY_RE=/^M\d\d$/;
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const all=()=>typeof catalogue!=='undefined'?catalogue:[];
 const cache=new Map();
 const text=e=>[e.id,e.title,e.desc,e.use,e.tags,e.cues,e.group,e.kind,e.medium].join(' ').toLowerCase();
 function feelsOf(e){if(cache.has(e.id))return cache.get(e.id);let set;
  if(OVERRIDE[e.id])set=new Set(OVERRIDE[e.id]);else{const t=' '+[e.title,e.desc,e.cues,e.tags,e.kind].join(' ').toLowerCase()+' ';set=new Set(FEELS.filter(f=>f.re.test(t)).map(f=>f.k));}
  cache.set(e.id,set);return set;}
 const isLive=e=>STUDY_RE.test(e.id)||(window.LiveSims?.ids||[]).includes(e.id);
 const S={feel:'',film:false,live:false};
 function matches(e,tokens){const t=' '+text(e),fs=feelsOf(e);return tokens.every(tok=>(/^[a-z]\d\d$/.test(tok)?t.includes(' '+tok):new RegExp('(^|[^a-z])'+rx(tok),'i').test(t))||FEELS.some(f=>f.alias.includes(tok)&&fs.has(f.k)));}
 function filtered(list){let L=list;if(S.feel)L=L.filter(e=>feelsOf(e).has(S.feel));if(S.film)L=L.filter(e=>e.film);if(S.live)L=L.filter(isLive);return L;}

 /* ---------- wrap the catalogue grid ---------- */
 function patch(){if(typeof window.renderGrid!=='function'||window.renderGrid.__explore)return false;const orig=window.renderGrid;
  const w=function(){const inp=document.getElementById('search');const q=(inp?.value||'').trim().toLowerCase();const tokens=q.split(/\s+/).filter(Boolean);
   const full=catalogue;let list=filtered(full);if(tokens.length)list=list.filter(e=>matches(e,tokens));
   const keep=inp?inp.value:'';if(inp)inp.value='';catalogue=list;try{return orig.apply(this,arguments);}finally{catalogue=full;if(inp)inp.value=keep;syncBar();}};
  w.__explore=true;w.__ns=orig.__ns;window.renderGrid=w;return true;}

 /* ---------- bar ---------- */
 let bar;
 function buildBar(){const page=document.getElementById('browse');const first=page?.querySelector('.filters');if(!first||document.getElementById('exploreBar'))return;
  bar=document.createElement('div');bar.id='exploreBar';bar.className='exploreBar';
  bar.innerHTML=`<div class="exRow" role="group" aria-label="Explore by feel"><span class="exLabel">Feel</span>${FEELS.map(f=>`<button type="button" class="exChip" data-feel="${f.k}" aria-pressed="false">${esc(f.name)} <span class="exCount"></span></button>`).join('')}</div>
  <div class="exRow" role="group" aria-label="Show only"><span class="exLabel">Show</span><button type="button" class="exChip exToggle" data-film aria-pressed="false"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z" fill="currentColor"/></svg>Has film <span class="exCount"></span></button><button type="button" class="exChip exToggle" data-live aria-pressed="false"><i class="exDot" aria-hidden="true"></i>Live study <span class="exCount"></span></button><button type="button" class="exClear" hidden>Clear</button><a class="exTours" href="#tours">Guided tours →</a></div>`;
  first.insertAdjacentElement('afterend',bar);
  bar.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;
   if(b.dataset.feel!==undefined)S.feel=S.feel===b.dataset.feel?'':b.dataset.feel;else if(b.hasAttribute('data-film'))S.film=!S.film;else if(b.hasAttribute('data-live'))S.live=!S.live;else if(b.classList.contains('exClear')){S.feel='';S.film=false;S.live=false;}
   apply(true);});}
 function count(fn){return all().filter(fn).length;}
 function syncBar(){if(!bar)return;const base=all();
  bar.querySelectorAll('[data-feel]').forEach(b=>{const k=b.dataset.feel;b.setAttribute('aria-pressed',String(S.feel===k));b.querySelector('.exCount').textContent=base.filter(e=>feelsOf(e).has(k)&&(!S.film||e.film)&&(!S.live||isLive(e))).length;});
  const film=bar.querySelector('[data-film]'),live=bar.querySelector('[data-live]');film.setAttribute('aria-pressed',String(S.film));live.setAttribute('aria-pressed',String(S.live));
  film.querySelector('.exCount').textContent=base.filter(e=>e.film&&(!S.feel||feelsOf(e).has(S.feel))).length;live.querySelector('.exCount').textContent=base.filter(e=>isLive(e)&&(!S.feel||feelsOf(e).has(S.feel))).length;
  bar.querySelector('.exClear').hidden=!(S.feel||S.film||S.live);}
 function apply(push){if(typeof limit!=='undefined')limit=20;if(typeof renderGrid==='function')renderGrid();
  if(push&&location.hash.split('?')[0]==='#browse'){const p=[S.feel&&'feel='+S.feel,S.film&&'film=1',S.live&&'live=1'].filter(Boolean).join('&');history.replaceState(null,'','#browse'+(p?'?'+p:''));}}
 function readHash(){const h=location.hash;if(h.split('?')[0]!=='#browse')return false;const q=new URLSearchParams(h.split('?')[1]||'');if(q.has('entry'))return false;
  const feel=q.get('feel')||'',film=q.get('film')==='1',live=q.get('live')==='1';if(feel===S.feel&&film===S.film&&live===S.live)return false;S.feel=FEELS.some(f=>f.k===feel)?feel:'';S.film=film;S.live=live;return true;}

 /* ---------- feel tags in the detail view ---------- */
 function detailTags(){const body=document.getElementById('detailBody');const notes=body?.querySelector('.detailnotes');const e=typeof selected!=='undefined'?selected:null;if(!notes||!e||notes.querySelector('.exFeels'))return;
  const fs=[...feelsOf(e)];if(!fs.length)return;const p=document.createElement('p');p.className='exFeels';
  p.innerHTML=`<span>Feel</span>${fs.map(k=>`<a href="#browse?feel=${k}" data-feel-link="${k}">${esc(FEELS.find(f=>f.k===k).name)}</a>`).join('')}${isLive(e)?'<a href="#motion" data-live-link>Live study</a>':''}`;
  const h=notes.querySelector('h3');(h||notes.lastElementChild).insertAdjacentElement('beforebegin',p);
  p.addEventListener('click',ev=>{const a=ev.target.closest('a');if(!a)return;ev.preventDefault();document.getElementById('detail')?.close();
   if(a.dataset.feelLink){S.feel=a.dataset.feelLink;S.film=false;S.live=false;location.hash='browse?feel='+S.feel;setTimeout(()=>apply(false),60);}
   else if(window.UIMotion)window.UIMotion.show(e.id);else location.hash='motion';});}

 const ready=setInterval(()=>{if(!all().length||!document.getElementById('browse'))return;if(!patch())return;clearInterval(ready);
  buildBar();readHash();apply(false);
  addEventListener('hashchange',()=>{if(readHash())apply(false);});
  const body=document.getElementById('detailBody');if(body)new MutationObserver(detailTags).observe(body,{childList:true});
  new MutationObserver(()=>{if(!document.getElementById('exploreBar'))buildBar();}).observe(document.getElementById('browse'),{childList:true});},150);
 window.AtlasExplore={FEELS,feelsOf,isLive,set(o){Object.assign(S,o);apply(true);}};
})();
