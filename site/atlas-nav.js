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
   ['#art','Art styles','Sixty art styles, from museum references to procedural specimen films.','suminagashi'],
   ['#cinema','Film looks','Cinematic directions translated into original scenes.','pixel-sorting'],
   ['#backgrounds','Backgrounds','Generate gradients, light and grain; export 4K or a loop.','petal-swirl'],
   ['#vases','Vase studies','One vase, forty treatments, to read a style quickly.','sand-drawing'],
   ['#pairings','Style pairings','Styles that work together, and why.','lion-phoenix']]},
  {name:'Motion',items:[
   ['#motion','Animation studio','Live studies, films, simulations and an easing lab.','bioluminescent-trails'],
   ['#effects','Landing effects','The techniques: scroll-driven CSS, View Transitions, shaders, with code.','light-ribbons'],
   ['#showcase','Showcase reels','Motion templates for portfolios and launches.','golden-figure'],
   ['particle-studio.html','Particle studio','Turn any picture into moving particles.','particle-tree']]},
  {name:'Interface',items:[
   ['#systems','Design systems','Forty-eight complete visual worlds and real open-source systems.','game-of-life'],
   ['#ux','UI components','Sixty-four components, every state, in every style.','light-mesh'],
   ['#icons','Icon families','Outline, solid, pixel, colour and 3D icon sets.','sketchbook-horse'],
   ['icons.html','Icon library','3,768 searchable icons in 13 families, with full packs.','sketchbook-horse'],
   ['#typography','Fonts & type','Type pairings and scales, ready to use.','light-threads'],
   ['#playground','System playground','Try a system across a landing page, dashboard and phone.','swan-construction'],
   ['#assets','Extracted assets','201 fragments cut from our original mock-ups.','paper-bird'],
   ['theme-kits.html','Theme kits','Matrix to Graphite: tokens, components, backgrounds and assets.','game-of-life']]},
  {name:'Make',items:[
   ['interactions.html','Interactions shelf','Showpieces, scroll stories and sections to copy.','golden-dove'],
   ['page-builder.html','Page builder','Stack sections, pick a style, download one HTML file.','paper-bird'],
   ['flowchart-studio.html','Flowchart studio','Draw, animate and export flowcharts.','light-mesh'],
   ['chart-studio.html','Chart studio','Your data as a chart: 26 forms, any style.','pigment-bloom'],
   ['diagram-studio.html','Diagram studio','Eighteen diagram types: roadmaps to sequence and ER.','swan-construction'],
   ['chart-styles.html','Chart style guides','Chart palettes and rules for every style.','game-of-life']]},
  {name:'Your studio',items:[
   ['#projects','My projects','Save specimens into boards for a client or idea.','particle-tree'],
   ['#inspiration','Inspiration','Your own uploads and references, kept together.','embroidery'],
   ['#creations','Your creations','Things you have made and exported here.','pigment-bloom']]}
 ];
 const ALL=GROUPS.flatMap(g=>g.items.map(i=>({href:i[0],name:i[1],note:i[2],film:i[3],group:g.name})));
 const ICON={"#home": "M4 11 12 4l8 7M6 9.5V20h12V9.5M10 20v-5h4v5", "#browse": "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z", "#tours": "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z", "#compare": "M4 5h7v14H4zM13 5h7v14h-7zM7.5 9v6M16.5 9v6", "#references": "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10M9 8h5", "#art": "M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.9 1.4-1.9-.5-1.2.3-2.3 1.6-2.3H17a4 4 0 0 0 4-4c0-5.2-4-9.8-9-9.8zM7.5 11.5h.01M10 7.5h.01M15 7.5h.01", "#cinema": "M3 5h18v14H3zM3 9h18M3 15h18M7 5v4M12 5v4M17 5v4M7 15v4M12 15v4M17 15v4", "#backgrounds": "M4 4h16v16H4zM4 15c3-3 5-3 8 0s5 3 8 0M4 10c3-3 5-3 8 0s5 3 8 0", "#vases": "M9 3h6M10 3v3c-3 2-4 5-4 8a6 6 0 0 0 12 0c0-3-1-6-4-8V3M7 13h10", "#pairings": "M9 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM15 19a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "#motion": "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM10 8.5v7l5.5-3.5z", "#effects": "M5 19 15 9M15 9l1.5-4.5L18 9l4.5 1.5L18 12l-1.5 4.5L15 12l-4.5-1.5z", "#showcase": "M4 6h16v12H4zM8 6v12M16 6v12M4 10h4M4 14h4M16 10h4M16 14h4", "particle-studio.html": "M6 6h.01M12 5h.01M18 7h.01M5 12h.01M10 11h.01M15 12h.01M19 13h.01M7 18h.01M13 17h.01M17 19h.01", "#systems": "M12 3 4 7.5v9L12 21l8-4.5v-9zM4 7.5 12 12l8-4.5M12 12v9", "#ux": "M4 7h10M18 7h2M14 5v4M4 17h4M12 17h8M8 15v4", "#icons": "M4 4h16v16H4zM12 7.5l1.3 2.7 3 .4-2.2 2 .6 3-2.7-1.5-2.7 1.5.6-3-2.2-2 3-.4z", "#typography": "M4 19 9 5l5 14M6 14h6M15 19v-6a2.5 2.5 0 0 1 5 0v6M15 16h5", "#playground": "M4 6h16M4 12h16M4 18h16M8 4v4M15 10v4M10 16v4", "#assets": "M6 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM6 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 9.5l12 8M8 14.5l12-8", "ds/start.html": "M12 3 3 8l9 5 9-5zM3 13l9 5 9-5M3 18l9 5 9-5", "theme-kits.html": "M4 20 9 5l4 1.5-4.5 13.5zM9 19.5l7-12 3.5 2-7 12M12 20h8v-4", "interactions.html": "M9 11V5a1.5 1.5 0 0 1 3 0v5M12 10V8.5a1.5 1.5 0 0 1 3 0V11M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4.5 15a1.5 1.5 0 0 1 2.5-1.7L9 15", "page-builder.html": "M4 4h16v4H4zM4 10h10v4H4zM4 16h16v4H4zM16 10h4v4h-4z", "flowchart-studio.html": "M4 4h6v5H4zM14 15h6v5h-6zM14 4h6v5h-6zM7 9v4h10v2M17 9v6", "diagram-studio.html": "M4 6h10M4 12h14M4 18h7M4 3v18", "chart-styles.html": "M4 20h16M7 20v-7M11 20V8M15 20v-5M19 20V5", "chart-studio.html": "M4 4v16h16M8 15l3-4 3 2 5-6", "#projects": "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "#inspiration": "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.7.5 1 1.2 1 2.1h5c0-.9.3-1.6 1-2.1A6 6 0 0 0 12 3z", "#creations": "M14.5 4.5l5 5L9 20H4v-5zM12 7l5 5"};
 const svgIcon=h=>`<svg class="anIco" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${ICON[h]||ICON['#browse']}"/></svg>`;
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
  <nav class="anGroups" aria-label="All sections">${GROUPS.map(g=>`<section class="anGroup" data-group="${esc(g.name)}"><h2>${esc(g.name)}</h2><ul>${g.items.map(i=>`<li><a href="${i[0]}" data-film="${i[3]}"><span class="anIcoBox">${svgIcon(i[0])}</span><span><b>${esc(i[1])}</b><small>${esc(i[2])}</small></span></a></li>`).join('')}</ul></section>`).join('')}</nav></div>
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
