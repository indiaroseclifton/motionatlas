'use strict';
/* The constant top bar: one slim fixed bar, identical on every page (atlas.html has the same bar built by atlas-nav.js).
   Brand/home · Library · Make · Your studio · All tools · search · My projects · Account. On phones: brand, search, Menu.
   Data comes from site-nav-data.js (load it first). Pages reserve the bar's height with the inline style the build step adds
   (body padding-top: var(--sb-h)); full-height editors are fitted below the bar by fit().
   Keyboard: Tab through; Enter/Space opens a menu; Esc closes and returns focus; "/" or Ctrl/Cmd+K opens search. */
(()=>{
 if(window.__siteBar||document.getElementById('sbar'))return;window.__siteBar=1;
 const G=window.ATLAS_NAV_GROUPS||[];
 const cs=document.currentScript;const BASE=cs&&cs.src?new URL('.',cs.src).href:new URL('.',location.href).href;
 const url=h=>new URL(h.startsWith('#')?'atlas.html'+h:h,BASE);
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const here=()=>{const u=new URL(location.href);return {p:u.pathname.replace(/\/$/,'').replace(/\.html$/,''),h:u.hash.split('?')[0]}};
 const isCur=href=>{const t=url(href),h=here();const tp=t.pathname.replace(/\.html$/,'');
  if(tp!==h.p&&!(tp.endsWith('/atlas')&&h.p==='')){return false}
  if(t.hash)return t.hash===h.h||(t.hash==='#home'&&!h.h);return !(/atlas$/.test(tp)&&h.h&&false)};
 const grp=n=>G.find(g=>g.name===n)||{items:[]};
 const BY={};G.forEach(g=>g.items.forEach(i=>{BY[i[0]]={href:i[0],name:i[1],note:i[2]}}));
 const MENUS=window.ATLAS_NAV_MENUS||[];
 const flat=m=>[...(m.top||[]),...m.groups.flatMap(g=>g.items.flatMap(i=>i.items||[i]))];
 const has=hrefs=>hrefs.some(isCur);
 const link=h=>{const e=BY[h];if(!e)return '';return `<li><a href="${esc(url(h).href)}" data-note="${esc(e.note)}"${isCur(h)?' aria-current="page"':''}>${esc(e.name)}</a></li>`};
 const rows=items=>items.map(i=>typeof i==='string'?link(i):`<li class="sbMoreLi"><button type="button" class="sbMore" aria-expanded="false" aria-controls="sbM-${esc(i.more.replace(/\W/g,''))}">${esc(i.more)}${chev}</button><ul id="sbM-${esc(i.more.replace(/\W/g,''))}" hidden>${i.items.map(link).join('')}</ul></li>`).join('');
 const chev='<svg viewBox="0 0 10 10" aria-hidden="true"><path d="m2.5 4 2.5 2.5L7.5 4" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>';
 const css=document.createElement('style');css.id='sbCss';css.textContent=`
:root{--sb-h:calc(44px + env(safe-area-inset-top,0px))}
html.sbReady body::before{display:none}
/* the pages' own cross-links between studios are now in the bar's menus */
html.sbReady nav[aria-label="Other studios"],html.sbReady header nav[aria-label=Related]{display:none}
.sbar{position:fixed;top:0;left:0;right:0;z-index:2147483000;box-sizing:border-box;height:var(--sb-h);padding:env(safe-area-inset-top,0px) max(12px,env(safe-area-inset-right,0px)) 0 max(12px,env(safe-area-inset-left,0px));display:flex;align-items:center;gap:4px;background:rgba(255,255,255,.94);color:#111113;border-bottom:1px solid rgba(0,0,0,.12);font:500 13.5px/1 "Inter",Inter,system-ui,sans-serif;-webkit-text-size-adjust:100%;text-align:left}
.sbar *{box-sizing:border-box}
.sbar a,.sbar button{font:inherit;color:inherit;text-decoration:none;background:none;border:0;cursor:pointer}
.sbBrand{display:inline-flex;align-items:center;gap:9px;height:36px;padding:0 10px 0 4px;border-radius:10px;font-weight:700;letter-spacing:.02em;white-space:nowrap}
.sbMark{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:8px;background:#111113;border:1px solid #111113;color:#fff;font:700 10px/1 "JetBrains Mono",ui-monospace,monospace}
.sbTop{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 11px;border-radius:999px;white-space:nowrap;color:#3f4249}
.sbTop:hover,.sbTop[aria-expanded=true]{background:rgba(0,0,0,.05);color:#000}
.sbTop[aria-current=page],.sbTop.sbHere{color:#000;box-shadow:inset 0 -2px 0 #111113;border-radius:8px}
.sbTop svg{width:10px;height:10px;transition:transform .2s}.sbTop[aria-expanded=true] svg{transform:rotate(180deg)}
.sbGrow{flex:1}
/* phones have no hover, so the menu sheet shows each page's one-line description under its name */
.sbSheet a[data-note]::after{content:attr(data-note);display:block;margin-top:3px;font:400 12.5px/1.4 Inter,system-ui,sans-serif;color:#6B6F76;white-space:normal}
.sbSheet a[data-note]{display:block;height:auto;min-height:44px;padding-top:9px;padding-bottom:9px;white-space:normal}
.sbar :focus-visible{outline:2px solid #111113;outline-offset:2px}
.sbSearch{display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 12px;border-radius:999px;border:1px solid rgba(0,0,0,.12);color:#3f4249}
.sbSearch kbd{font:500 11px "JetBrains Mono",monospace;border:1px solid rgba(0,0,0,.12);border-radius:5px;padding:2px 6px}
.sbSearch svg,.sbMenuBtn svg{width:16px;height:16px}
.sbMenuBtn{display:none;align-items:center;gap:7px;height:36px;padding:0 12px;border-radius:999px;border:1px solid rgba(0,0,0,.12)!important}
.sbPanel{position:fixed;z-index:2147483001;top:var(--sb-h);left:8px;max-width:calc(100vw - 16px);max-height:calc(100vh - var(--sb-h) - 12px);max-height:calc(100dvh - var(--sb-h) - 12px);overflow:auto;background:#ffffff;border:1px solid rgba(0,0,0,.12);border-radius:16px;box-shadow:0 24px 60px -20px rgba(0,0,0,.25);padding:10px;color:#111113}
.sbPanel[hidden]{display:none}
.sbPanel{font:500 14px/1.3 "Inter",Inter,system-ui,sans-serif}.sbPanel *{box-sizing:border-box}.sbPanel a,.sbPanel button{font:inherit;text-decoration:none;background:none;border:0;cursor:pointer;color:inherit}.sbPanel :focus-visible{outline:2px solid #111113;outline-offset:-2px}
.sbPanel h2{margin:10px 8px 4px;font:600 10.5px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#6b6f76}.sbPanel h2:first-child{margin-top:4px}
.sbPanel .sbList{display:grid;gap:2px}
.sbPanel a{display:grid;gap:3px;padding:9px 12px;border-radius:10px;color:#111113}
.sbPanel a:hover{background:rgba(0,0,0,.05)}.sbPanel a b{font-weight:600;font-size:14px}.sbPanel a span{font-size:12px;line-height:1.35;color:#6b6f76;font-weight:400}
.sbPanel a[aria-current=page]{background:rgba(0,0,0,.06);box-shadow:inset 3px 0 0 #111113}
.sbPanel.sbNarrow{width:min(300px,calc(100vw - 16px))}
.sbMega{width:min(640px,calc(100vw - 16px));padding:8px}
.sbMegaBody{display:grid;grid-template-columns:190px minmax(0,1fr);gap:8px;max-height:min(340px,calc(100vh - var(--sb-h) - 90px));min-height:0}
.sbGl{list-style:none;margin:0;padding:0;display:grid;align-content:start;gap:2px;border-right:1px solid rgba(0,0,0,.12);padding-right:8px;overflow:auto}
.sbG{display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;padding:10px 12px;border-radius:10px;color:#3f4249;font-weight:600}
.sbG svg{width:10px;height:10px;transform:rotate(-90deg)}.sbG[aria-expanded=true]{background:rgba(0,0,0,.06);color:#000}.sbG.sbHere{box-shadow:inset 3px 0 0 #111113}
.sbGr ul{list-style:none;margin:0;padding:0;display:grid;gap:1px;overflow:auto;max-height:inherit}.sbGr ul[hidden]{display:none}
.sbPanel li a,.sbPanel .sbMore{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:9px;color:#111113;font-weight:500;font-size:14px;text-align:left;width:100%}
.sbPanel li a:hover,.sbPanel .sbMore:hover{background:rgba(0,0,0,.05)}.sbPanel .sbMore{color:#6b6f76}.sbPanel .sbMore svg{width:10px;height:10px}.sbPanel .sbMore[aria-expanded=true] svg{transform:rotate(180deg)}
.sbMoreLi ul{list-style:none;margin:0 0 4px 12px;padding:0;border-left:1px solid rgba(0,0,0,.12)}.sbMoreLi ul[hidden]{display:none}
.sbPanel li a[aria-current=page]{background:rgba(0,0,0,.06);box-shadow:inset 3px 0 0 #111113}
.sbPrime{display:flex!important;align-items:center;justify-content:space-between;margin:2px 0 8px;padding:11px 14px!important;background:#111113!important;color:#ffffff!important;border-radius:12px!important;font-weight:700!important}
.sbPrime small{font-weight:500;opacity:.75;font-size:12px}
.sbDesc{margin:8px 6px 2px;min-height:34px;font-size:12px;line-height:1.4;color:#6b6f76}
.sbPanel.sbSheet{left:0;right:0;top:var(--sb-h);bottom:0;max-width:none;max-height:none;border-radius:0;border-width:1px 0 0;padding:12px 12px 24px}
.sbAcc{border-bottom:1px solid rgba(0,0,0,.12)}
.sbAcc>button{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:52px;padding:0 6px;font-weight:700;font-size:16px;color:#111113;text-align:left}
.sbAcc>button svg{width:14px;height:14px;transition:transform .2s}.sbAcc>button[aria-expanded=true] svg{transform:rotate(180deg)}.sbAcc>button.sbHere{color:#111113}
.sbAcc ul{list-style:none;margin:0 0 10px;padding:0}.sbAcc ul[hidden]{display:none}.sbAcc li a{min-height:48px;font-size:15px}
.sbSheetSearch{display:flex;align-items:center;gap:10px;width:100%;min-height:48px;margin:2px 0 6px;padding:0 14px;border:1px solid rgba(0,0,0,.12);border-radius:12px;color:#3f4249;font-size:15px;text-align:left}
.sbSheetSearch svg{width:16px;height:16px}
.sbQuick{display:flex;gap:8px;flex-wrap:wrap;padding:4px 8px 8px}.sbQuick a{display:inline-flex;padding:9px 14px;border:1px solid rgba(0,0,0,.12);border-radius:999px;font-weight:600;font-size:13px}
.sbSkip{position:fixed;left:8px;top:-60px;z-index:2147483002;background:#111113;color:#fff;padding:10px 14px;border-radius:8px;font:600 14px/1 Inter,sans-serif}.sbSkip:focus{top:calc(var(--sb-h) + 6px)}
.sbSrch{width:min(640px,calc(100vw - 24px));margin:0;padding:0;border:1px solid rgba(0,0,0,.12);border-radius:16px;background:#ffffff;color:#111113;position:fixed;top:12vh;left:50%;transform:translateX(-50%)}
.sbSrch::backdrop{background:rgba(20,20,24,.35)}
.sbSrch input{width:100%;box-sizing:border-box;padding:16px 18px;font:500 16px "Inter",Inter,system-ui,sans-serif;background:transparent;border:0;border-bottom:1px solid rgba(0,0,0,.12);color:#111113;outline:0}
.sbSrch ul{list-style:none;margin:0;padding:6px;max-height:55vh;overflow:auto}.sbSrch li a{display:grid;gap:2px;padding:9px 12px;border-radius:10px;color:#111113;text-decoration:none}
.sbSrch li a:hover,.sbSrch li a.on{background:rgba(0,0,0,.06)}.sbSrch li b{font:600 14px Inter,Inter,sans-serif}.sbSrch li small{font:400 12px/1.35 Inter,Inter,sans-serif;color:#6b6f76}
.sbSrch p{margin:0;padding:10px 18px 14px;font:400 12px Inter,Inter,sans-serif;color:#6b6f76}
@media (max-width:900px){.sbTop.sbDesk,.sbSearch kbd,.sbSearch span.sbLbl{display:none}.sbMenuBtn{display:inline-flex}.sbSearch{width:36px;height:36px;padding:0;justify-content:center}}
@media (max-width:520px){.sbBrand .sbName{display:none}}
@media (prefers-reduced-motion:reduce){.sbTop svg{transition:none}}
@media print{.sbar,.sbPanel{display:none}body{padding-top:0!important}}`;
 document.head.append(css);

 const bar=document.createElement('div');bar.id='sbar';bar.className='sbar';bar.setAttribute('role','navigation');bar.setAttribute('aria-label','Visual & Motion Atlas');
 const top=(id,label,cls)=>`<button type="button" class="sbTop sbDesk ${cls||''}" data-m="${id}" aria-expanded="false" aria-controls="sbP-${id}" aria-haspopup="true">${esc(label)}${chev}</button>`;
 const toolsCur=isCur('tools.html');
 bar.innerHTML=`<a class="sbBrand" href="${esc(url('index.html').href)}" aria-label="Home"><span class="sbMark" aria-hidden="true">V/M</span><span class="sbName">Atlas</span></a>
 ${MENUS.map(m=>top(m.id,m.name,has(flat(m))?'sbHere':'')).join('')}
 <span class="sbGrow"></span>
 <button type="button" class="sbSearch" data-m="search" aria-label="Search the atlas"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="m10.5 10.5 3.5 3.5" stroke="currentColor" stroke-width="1.5"/></svg><span class="sbLbl">Search</span><kbd>/</kbd></button>
 <button type="button" class="sbMenuBtn" data-m="menu" aria-expanded="false" aria-controls="sbP-menu"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 4h11M2.5 8h11M2.5 12h11" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>Menu</button>`;
 const skip=document.createElement('a');skip.className='sbSkip';skip.href='#';skip.textContent='Skip to content';
 skip.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector('main,[role=main],#main')||document.querySelector('h1');if(t){if(!t.hasAttribute('tabindex'))t.setAttribute('tabindex','-1');t.focus({preventScroll:false})}});
 const mega=m=>{const gs=m.groups,named=gs.length>1||gs[0].name;const cur=Math.max(0,gs.findIndex(g=>has(g.items.flatMap(i=>i.items||[i]))));
  const prime=(m.top||[]).map(h=>{const e=BY[h];return `<a class="sbPrime" href="${esc(url(h).href)}" data-note="${esc(e.note)}"${isCur(h)?' aria-current="page"':''}>${esc(e.name)}<small>${esc(e.note.split(';')[0])}</small></a>`}).join('');
  if(!named)return `<ul class="sbSolo" style="list-style:none;margin:0;padding:0">${rows(gs[0].items)}</ul><p class="sbDesc" aria-live="polite"></p>`;
  return `${prime}<div class="sbMegaBody"><ul class="sbGl">${gs.map((g,i)=>`<li><button type="button" class="sbG${has(g.items.flatMap(x=>x.items||[x]))?' sbHere':''}" aria-expanded="${i===cur}" aria-controls="sbL-${m.id}-${i}">${esc(g.name)}${chev}</button></li>`).join('')}</ul><div class="sbGr">${gs.map((g,i)=>`<ul id="sbL-${m.id}-${i}"${i===cur?'':' hidden'}>${rows(g.items)}</ul>`).join('')}</div></div><p class="sbDesc" aria-live="polite"></p>`};
 /* phone sheet: an accordion, one group open at a time, the current page's group open */
 const SHEET=['Library','Styles','Make','Your studio'].map(grp).filter(g=>g.items&&g.items.length);
 const sheet=()=>{const cur=Math.max(0,SHEET.findIndex(g=>g.items.some(i=>isCur(i[0]))));
  return `<button type="button" class="sbSheetSearch" data-m="search"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="m10.5 10.5 3.5 3.5" stroke="currentColor" stroke-width="1.5"/></svg>Search the atlas</button>
  
  ${SHEET.map((g,i)=>{const id='sbA-'+i;return `<div class="sbAcc"><button type="button" aria-expanded="${i===cur}" aria-controls="${id}"${g.items.some(x=>isCur(x[0]))?' class="sbHere"':''}>${esc(g.name)}${chev}</button><ul id="${id}"${i===cur?'':' hidden'}>${g.items.map(x=>link(x[0])).join('')}</ul></div>`}).join('')}`};
 const panels={};MENUS.forEach(m=>panels[m.id]=mega(m));panels.menu=sheet();
 const cls={lib:'sbNarrow',make:'sbNarrow',studio:'sbNarrow',menu:'sbSheet'};
 const els={};
 for(const k in panels){const p=document.createElement('div');p.id='sbP-'+k;p.className='sbPanel '+cls[k];p.hidden=true;p.innerHTML=panels[k];els[k]=p}
 /* group / accordion / more toggles and descriptions */
 function activateGroup(btn){const p=btn.closest('.sbPanel');p.querySelectorAll('.sbG').forEach(b=>{const on=b===btn;b.setAttribute('aria-expanded',String(on));const l=document.getElementById(b.getAttribute('aria-controls'));if(l)l.hidden=!on})}
 for(const k in els){const p=els[k];
  p.addEventListener('pointerover',e=>{const g=e.target.closest('.sbG');if(g&&e.pointerType==='mouse')activateGroup(g);const a=e.target.closest('a[data-note]');const d=p.querySelector('.sbDesc');if(a&&d)d.textContent=a.dataset.note});
  p.addEventListener('focusin',e=>{const g=e.target.closest('.sbG');if(g)activateGroup(g);const a=e.target.closest('a[data-note]');const d=p.querySelector('.sbDesc');if(a&&d)d.textContent=a.dataset.note});
  p.addEventListener('click',e=>{const g=e.target.closest('.sbG');if(g){activateGroup(g);return}
   const m=e.target.closest('.sbMore');if(m){const on=m.getAttribute('aria-expanded')!=='true';m.setAttribute('aria-expanded',String(on));document.getElementById(m.getAttribute('aria-controls')).hidden=!on;return}
   const ac=e.target.closest('.sbAcc>button');if(ac){const on=ac.getAttribute('aria-expanded')!=='true';p.querySelectorAll('.sbAcc>button').forEach(b=>{b.setAttribute('aria-expanded','false');document.getElementById(b.getAttribute('aria-controls')).hidden=true});if(on){ac.setAttribute('aria-expanded','true');document.getElementById(ac.getAttribute('aria-controls')).hidden=false}return}
   if(e.target.closest('[data-m=search]')){close();openSearch();return}
   if(e.target.closest('a'))close()});
  /* keyboard: arrows move between rows, Right enters the list, Left returns to the groups */
  p.addEventListener('keydown',e=>{const t=e.target;if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
   const gl=[...p.querySelectorAll('.sbG')];
   if(t.classList.contains('sbG')){const i=gl.indexOf(t);if(e.key==='ArrowDown'){e.preventDefault();gl[(i+1)%gl.length].focus()}else if(e.key==='ArrowUp'){e.preventDefault();gl[(i-1+gl.length)%gl.length].focus()}else if(e.key==='ArrowRight'){e.preventDefault();const l=document.getElementById(t.getAttribute('aria-controls'));const f=l&&l.querySelector('a,button');if(f)f.focus()}else if(e.key==='Home'){e.preventDefault();gl[0].focus()}else if(e.key==='End'){e.preventDefault();gl[gl.length-1].focus()}return}
   const list=t.closest('ul');if(!list||t.closest('.sbSheet')&&false)return;const items=[...list.querySelectorAll(':scope > li > a, :scope > li > button, :scope > li > ul:not([hidden]) > li > a')];const i=items.indexOf(t);if(i<0)return;
   if(e.key==='ArrowDown'){e.preventDefault();items[(i+1)%items.length].focus()}else if(e.key==='ArrowUp'){e.preventDefault();items[(i-1+items.length)%items.length].focus()}else if(e.key==='Home'){e.preventDefault();items[0].focus()}else if(e.key==='End'){e.preventDefault();items[items.length-1].focus()}
   else if(e.key==='ArrowLeft'){const g=p.querySelector('.sbG[aria-expanded=true]');if(g){e.preventDefault();g.focus()}}})}
 let openKey=null,opener=null;
 function close(refocus){if(!openKey)return;els[openKey].hidden=true;bar.querySelectorAll('[aria-expanded=true]').forEach(b=>b.setAttribute('aria-expanded','false'));const o=opener;openKey=null;opener=null;if(refocus&&o)o.focus()}
 function open(k,btn){close();openKey=k;opener=btn;els[k].hidden=false;btn.setAttribute('aria-expanded','true');
  if(k!=='menu'){const r=btn.getBoundingClientRect();els[k].style.left=Math.max(8,Math.min(r.left,innerWidth-els[k].offsetWidth-8))+'px'}}
 bar.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;const k=b.dataset.m;if(k==='search'){close();openSearch();return}
  if(openKey===k)close(true);else{open(k,b);if(e.detail===0){const f=els[k].querySelector('.sbG[aria-expanded=true],a,button');if(f)f.focus()}}});
 document.addEventListener('click',e=>{if(openKey&&!e.target.closest('.sbar,.sbPanel'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&openKey){e.preventDefault();close(true)}
  const typing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement&&document.activeElement.tagName)||(document.activeElement&&document.activeElement.isContentEditable);
  if(document.querySelector('.aeSearchBtn'))return;if(((e.key==='k'||e.key==='K')&&(e.metaKey||e.ctrlKey))||(e.key==='/'&&!typing&&!e.metaKey&&!e.ctrlKey)){e.preventDefault();openSearch()}});
 /* ---- search: pages and tools, the catalogue, and the 01 design-system docs ---- */
 let sd=null,idx=null;
 function openSearch(){close();const ae=document.querySelector('.aeSearchBtn');if(ae){ae.click();return}if(!sd){sd=document.createElement('dialog');sd.className='sbSrch';sd.setAttribute('aria-label','Search the atlas');
   sd.innerHTML='<input type="search" placeholder="Search pages, tools, styles, docs…" aria-label="Search the atlas" autocomplete="off"><ul role="listbox" aria-label="Results"></ul><p>Enter opens the first result. Esc closes.</p>';
   document.body.append(sd);const inp=sd.querySelector('input'),ul=sd.querySelector('ul');
   const draw=q=>{q=q.trim().toLowerCase();const w=q.split(/\s+/).filter(Boolean);const base=G.flatMap(g=>g.items.map(i=>({t:i[1],s:g.name+' · '+i[2],h:url(i[0]).href})));
    let hits=base.filter(x=>!w.length||w.every(y=>(x.t+' '+x.s).toLowerCase().includes(y)));
    if(w.length&&idx)hits=hits.concat(idx.filter(x=>w.every(y=>x.k.includes(y))).slice(0,30));
    ul.innerHTML=hits.slice(0,40).map((x,i)=>`<li><a href="${esc(x.h)}"${i===0?' class="on"':''}><b>${esc(x.t)}</b><small>${esc(x.s)}</small></a></li>`).join('')||'<li><small style="padding:10px 14px;display:block">No matches. Try a style, a mood or a tool name.</small></li>'};
   inp.addEventListener('input',()=>draw(inp.value));
   inp.addEventListener('keydown',e=>{const as=[...ul.querySelectorAll('a')];let i=as.findIndex(a=>a.classList.contains('on'));
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();as[i]&&as[i].classList.remove('on');i=(i+(e.key==='ArrowDown'?1:-1)+as.length)%Math.max(1,as.length);as[i]&&(as[i].classList.add('on'),as[i].scrollIntoView({block:'nearest'}))}
    else if(e.key==='Enter'){e.preventDefault();const a=as[Math.max(0,i)];if(a)location.href=a.href}});
   sd.addEventListener('click',e=>{if(e.target===sd)sd.close()});
   sd.draw=draw;
   /* the catalogue and the docs index load on first use */
   const load=async()=>{const out=[];try{const [c,x]=await Promise.all([fetch(new URL('catalogue.json',BASE)).then(r=>r.json()),fetch(new URL('expansion.json',BASE)).then(r=>r.json())]);
     for(const e of [...c,...(x.entries||[])])out.push({t:e.title,s:(e.id||'')+' · '+(e.group||e.kind||'Entry'),h:url('#browse?entry='+e.id).href,k:[e.id,e.title,e.group,e.kind,e.desc,e.tags,e.use].join(' ').toLowerCase()})}catch(_){}
    idx=out;draw(inp.value)};load()}
  sd.showModal();sd.querySelector('input').value='';sd.draw('');sd.querySelector('input').focus()}

 /* ---- fit full-height layouts below the bar ---- */
 function fit(){const H=innerHeight,bh=bar.getBoundingClientRect().height;if(!bh)return;
  {const b=document.body,bc=getComputedStyle(b);if(bc.boxSizing==='content-box'&&(Math.abs(parseFloat(bc.height)-H)<2||Math.abs((parseFloat(bc.minHeight)||0)-H)<2))b.style.boxSizing='border-box'}
  document.querySelectorAll('body *').forEach(el=>{if(el.closest('.sbar,.sbPanel,.sbSrch,dialog,svg,script,style')||el.dataset.sbFit)return;const c=getComputedStyle(el);
   if(c.display==='none')return;
   if(c.position==='fixed'){if(Math.abs(parseFloat(c.top))<1&&c.top!=='auto'){el.dataset.sbFit='1';el.style.top='var(--sb-h)';if(Math.abs(el.getBoundingClientRect().height-H)<2||c.bottom==='0px')el.style.height='calc(100vh - var(--sb-h))'}return}
   if(c.position==='sticky'&&c.top==='0px'){el.dataset.sbFit='1';el.style.top='var(--sb-h)';return}
   if(c.position==='static'||c.position==='relative'||c.position==='sticky'||c.position==='absolute'){
    if(c.position==='absolute')return;
    const h=el.getBoundingClientRect().height;if(h<H-2||h>H+2||el.tagName==='HTML'||el.tagName==='BODY')return;
    const mh=parseFloat(c.minHeight)||0,ht=c.height;el.dataset.sbFit='1';
    if(Math.abs(mh-H)<2)el.style.minHeight='calc(100vh - var(--sb-h))';
    if(!mh||Math.abs(parseFloat(ht)-H)<2)el.style.height='calc(100vh - var(--sb-h))'}});}
 function mount(){document.body.prepend(skip,bar);document.body.append(...Object.values(els));document.documentElement.classList.add('sbReady');
  const f=()=>{try{fit()}catch(_){}};f();setTimeout(f,700);setTimeout(f,2500);addEventListener('load',f);addEventListener('orientationchange',()=>setTimeout(()=>{document.querySelectorAll('[data-sb-fit]').forEach(e=>delete e.dataset.sbFit);f()},300))}
 if(document.body)mount();else document.addEventListener('DOMContentLoaded',mount,{once:true});
 window.SiteBar={open:openSearch,close,fit};
})();
