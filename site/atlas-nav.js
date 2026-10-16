'use strict';
/* Navigation: one slim top bar and a Library drawer.
   The old two-row menus stay in the DOM (other modules hook into them) but are hidden.
   - Top bar: brand · Library · Make ▾ · Your studio ▾ · search.
   - Library drawer (left, modal): every section in plain groups with a one-line purpose;
     hovering or focusing an item previews its film in the side panel.
   - Page trail: Atlas / Group / Page, where the group opens the drawer at that group.
   - Catalogue on phones: collections and filters move into a left "Filters" drawer. */
(()=>{
 const F='assets/films/';
 const GROUPS=[
  {name:'Explore',items:[
   ['#home','Home','The atlas at a glance, with the jellyfish reel.','jellyfish'],
   ['#browse','Catalogue','Every specimen in one searchable contact sheet.','hydraulic-erosion'],
   ['#tours','Guided tours','Short routes through the atlas for a brief or a mood.','golden-dove'],
   ['#compare','Compare styles','Two styles side by side on the same subject.','ferrofluid'],
   ['#references','Sources & credits','Original works, research, licences and credits.','smoke-plume']]},
  {name:'Visual',items:[
   ['#art','Art styles','Thirty-six art styles with museum references.','suminagashi'],
   ['#cinema','Film looks','Cinematic directions translated into original scenes.','pixel-sorting'],
   ['#backgrounds','Backgrounds','Generate gradients, light and grain; export 4K or a loop.','petal-swirl'],
   ['#vases','Vase studies','One vase, forty treatments, to read a style quickly.','sand-drawing'],
   ['#pairings','Style pairings','Styles that work together, and why.','lion-phoenix']]},
  {name:'Motion',items:[
   ['#motion','Animation studio','Live studies, films, simulations and an easing lab.','bioluminescent-trails'],
   ['#effects','Landing effects','Scroll and hover effects you can copy.','soap-film'],
   ['#showcase','Showcase reels','Motion templates for portfolios and launches.','golden-figure'],
   ['particle-studio.html','Particle studio','Turn any picture into moving particles.','particle-tree']]},
  {name:'Interface',items:[
   ['#systems','Design systems','Thirty-two complete visual worlds and real open-source systems.','game-of-life'],
   ['#ux','UI components','Forty components, every state, in every style.','light-mesh'],
   ['#icons','Icon families','Outline, solid, pixel, colour and 3D icon sets.','sketchbook-horse'],
   ['#typography','Fonts & type','Type pairings and scales, ready to use.','light-threads'],
   ['#playground','System playground','Try a system across a landing page, dashboard and phone.','swan-construction'],
   ['#assets','Extracted assets','201 fragments cut from our original mock-ups.','paper-bird']]},
  {name:'Make',items:[
   ['interactions.html','Interactions shelf','Showpieces, scroll stories and sections to copy.','golden-dove'],
   ['page-builder.html','Page builder','Stack sections, pick a style, download one HTML file.','paper-bird'],
   ['flowchart-studio.html','Flowchart studio','Draw, animate and export flowcharts.','light-mesh'],
   ['diagram-studio.html','Diagram studio','Roadmaps, org charts, journeys and comparisons.','swan-construction'],
   ['chart-styles.html','Chart style guides','Chart palettes and rules for every style.','game-of-life']]},
  {name:'Your studio',items:[
   ['#projects','My projects','Save specimens into boards for a client or idea.','particle-tree'],
   ['#inspiration','Inspiration','Your own uploads and references, kept together.','embroidery'],
   ['#creations','Your creations','Things you have made and exported here.','pigment-bloom']]}
 ];
 const ALL=GROUPS.flatMap(g=>g.items.map(i=>({href:i[0],name:i[1],note:i[2],film:i[3],group:g.name})));
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const page=()=>location.hash.replace('#','').split('?')[0]||'home';
 const current=()=>ALL.find(i=>i.href==='#'+page());
 const icon={menu:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 4h11M2.5 8h11M2.5 12h7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
  close:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>',
  chev:'<svg viewBox="0 0 10 10" aria-hidden="true"><path d="m2.5 4 2.5 2.5L7.5 4" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>',
  compass:'<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M10.5 5.5 9 9l-3.5 1.5L7 7z" fill="currentColor"/></svg>',
  search:'<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="m10.5 10.5 3.5 3.5" stroke="currentColor" stroke-width="1.5"/></svg>'};

 function build(){
  const header=document.querySelector('body>header');if(!header||header.querySelector('.anBar'))return;
  document.body.classList.add('anNav');
  const menu=(name,cls,group)=>`<details class="navGroup anMenu ${cls}"><summary>${name}${icon.chev}</summary><div>${GROUPS.find(g=>g.name===group).items.map(i=>`<a href="${i[0]}"><b>${esc(i[1])}</b><span>${esc(i[2])}</span></a>`).join('')}</div></details>`;
  const bar=document.createElement('div');bar.className='anBar';
  bar.innerHTML=`<button type="button" class="anLibBtn" aria-haspopup="dialog" aria-controls="anDrawer">${icon.menu}<span>Library</span></button>${menu('Make','anMake','Make')}${menu('Your studio','anStudio','Your studio')}`;
  const brand=header.querySelector('.brand');(brand||header.firstElementChild).insertAdjacentElement('afterend',bar);

  const d=document.createElement('dialog');d.id='anDrawer';d.className='anDrawer';d.setAttribute('aria-label','Library');
  d.innerHTML=`<div class="anPanel"><div class="anHead"><p class="anTitle">Library</p><button type="button" class="anClose" aria-label="Close the library">${icon.close}</button></div>
  <div class="anQuick"><button type="button" class="anQ" data-act="search">${icon.search}<span>Search everything</span><kbd>/</kbd></button><button type="button" class="anQ anFind" data-act="find">${icon.compass}<span>Find a direction</span></button></div>
  <nav class="anGroups" aria-label="All sections">${GROUPS.map(g=>`<section class="anGroup" data-group="${esc(g.name)}"><h2>${esc(g.name)}</h2><ul>${g.items.map(i=>`<li><a href="${i[0]}" data-film="${i[3]}"><img src="${F}mini/${i[3]}.webp" alt="" width="40" height="40" loading="lazy"><span><b>${esc(i[1])}</b><small>${esc(i[2])}</small></span></a></li>`).join('')}</ul></section>`).join('')}</nav></div>
  <aside class="anPreview" aria-hidden="true"><div class="anFilm"><img alt=""><video muted loop playsinline preload="none"></video></div><p class="anPGroup"></p><p class="anPName"></p><p class="anPNote"></p></aside>`;
  document.body.append(d);
  const vid=d.querySelector('.anFilm video'),img=d.querySelector('.anFilm img');let shown='';
  function preview(a){if(!a)return;const it=ALL.find(i=>i.href===a.getAttribute('href'));if(!it||shown===it.href)return;shown=it.href;
   d.querySelector('.anPGroup').textContent=it.group;d.querySelector('.anPName').textContent=it.name;d.querySelector('.anPNote').textContent=it.note;
   img.src=F+it.film+'.jpg';img.hidden=false;vid.pause();vid.removeAttribute('src');vid.load();
   if(reduce.matches||!matchMedia('(min-width: 900px)').matches)return;
   vid.src=F+it.film+'-720.mp4';vid.oncanplay=()=>{img.hidden=true;vid.play().catch(()=>{})};}
  d.addEventListener('pointerover',e=>preview(e.target.closest('.anGroups a')));
  d.addEventListener('focusin',e=>preview(e.target.closest('.anGroups a')));
  function open(group){markCurrent();d.showModal();document.body.classList.add('anOpen');
   const sec=group&&d.querySelector(`.anGroup[data-group="${CSS.escape(group)}"]`);
   const target=(sec&&sec.querySelector('a'))||d.querySelector('.anGroups a[aria-current="page"]')||d.querySelector('.anGroups a');
   if(sec)sec.scrollIntoView({block:'start'});target.focus({preventScroll:!!sec});preview(target)}
  function close(){if(d.open)d.close()}
  d.addEventListener('close',()=>{document.body.classList.remove('anOpen');vid.pause();vid.removeAttribute('src');vid.load();shown='';bar.querySelector('.anLibBtn').focus({preventScroll:true})});
  d.addEventListener('click',e=>{if(e.target===d)close();if(e.target.closest('.anClose'))close();if(e.target.closest('.anGroups a'))close();
   const q=e.target.closest('.anQ');if(q){close();if(q.dataset.act==='search')document.querySelector('.aeSearchBtn')?.click();else document.querySelector('.finderBtn')?.click()}});
  bar.querySelector('.anLibBtn').onclick=()=>open();
  window.AtlasNav={open,close};
  function markCurrent(){d.querySelectorAll('.anGroups a').forEach(a=>{if(a.getAttribute('href')==='#'+page())a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
   bar.querySelectorAll('.anMenu').forEach(m=>m.classList.toggle('anHere',!![...m.querySelectorAll('a')].find(a=>a.getAttribute('href')==='#'+page())));}
  addEventListener('hashchange',()=>{markCurrent();close()});markCurrent();
 }

 /* Page trail: Atlas / Group / Page, the group opens the drawer there */
 function trail(){const t=document.getElementById('routeTrail');if(!t)return;const it=current();
  if(!it||page()==='home'){if(t.dataset.an)delete t.dataset.an;return}
  const key=it.href;if(t.dataset.an===key&&t.querySelector('.anTrailGroup'))return;t.dataset.an=key;
  t.innerHTML=`<a href="#home">Atlas</a><span aria-hidden="true">/</span><button type="button" class="anTrailGroup" data-group="${esc(it.group)}" aria-label="${esc(it.group)}: show every ${esc(it.group.toLowerCase())} section">${esc(it.group)}</button><span aria-hidden="true">/</span><span aria-current="page">${esc(it.name)}</span>`;}
 document.addEventListener('click',e=>{const b=e.target.closest('.anTrailGroup');if(b)window.AtlasNav?.open(b.dataset.group)});

 /* Catalogue filters as a drawer on phones */
 function filters(){const ws=document.querySelector('#browse .archiveworkspace'),rail=document.querySelector('#browse .collectionrail');if(!ws||!rail||ws.querySelector('.anFilterBtn'))return;
  const btn=document.createElement('button');btn.type='button';btn.className='anFilterBtn secondary';btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','anRail');
  rail.id=rail.id||'anRail';const body=document.querySelector('#browse .collectionbody');body.insertAdjacentElement('afterbegin',btn);
  const shade=document.createElement('div');shade.className='anShade';shade.hidden=true;rail.insertAdjacentElement('beforebegin',shade);
  const head=document.createElement('div');head.className='anRailHead';head.innerHTML=`<p>Choose a collection</p><button type="button" class="anClose" aria-label="Close filters">${icon.close}</button>`;rail.prepend(head);
  const count=()=>{const g=document.querySelector('#group');const col=g&&g.value;const n=['#mood','#purpose','#effort','#medium'].filter(s=>{const el=document.querySelector(s);return el&&el.value}).length;btn.innerHTML=`${icon.menu}<span>Collection: <b>${esc(col||'All specimens')}</b>${n?` <em>+${n} filter${n>1?'s':''}</em>`:''}</span>`};
  const set=on=>{rail.classList.toggle('anRailOpen',on);shade.hidden=!on;btn.setAttribute('aria-expanded',String(on));document.body.classList.toggle('anOpen',on);if(on)(rail.querySelector('[aria-pressed="true"]')||rail.querySelector('button')).focus();else btn.focus()};
  btn.onclick=()=>set(true);shade.onclick=()=>set(false);head.querySelector('.anClose').onclick=()=>set(false);
  rail.addEventListener('click',e=>{if(e.target.closest('[data-collection]')){setTimeout(count,50);if(matchMedia('(max-width: 900px)').matches)setTimeout(()=>set(false),150)}});
  rail.addEventListener('keydown',e=>{if(e.key==='Escape'&&rail.classList.contains('anRailOpen')){e.preventDefault();set(false)}});
  document.querySelector('#browse').addEventListener('change',count);count();}

 function init(){build();trail();filters();
  const t=document.getElementById('routeTrail');if(t)new MutationObserver(()=>{if(!t.querySelector('.anTrailGroup')){delete t.dataset.an;trail()}}).observe(t,{childList:true});
  addEventListener('hashchange',()=>setTimeout(()=>{trail();filters()},0));}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 setTimeout(filters,1500);
})();
