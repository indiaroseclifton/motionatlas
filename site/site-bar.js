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
 const LIB=['Explore','Visual','Motion','Interface'].map(grp).filter(g=>g.items.length);
 const MAKE=grp('Make').items.filter(i=>i[0]!=='tools.html'),STUDIO=grp('Your studio').items;
 const item=i=>`<a href="${esc(url(i[0]).href)}"${isCur(i[0])?' aria-current="page"':''}><b>${esc(i[1])}</b><span>${esc(i[2])}</span></a>`;
 const has=items=>items.some(i=>isCur(i[0]));
 const chev='<svg viewBox="0 0 10 10" aria-hidden="true"><path d="m2.5 4 2.5 2.5L7.5 4" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>';
 const css=document.createElement('style');css.id='sbCss';css.textContent=`
:root{--sb-h:calc(44px + env(safe-area-inset-top,0px))}
html.sbReady body::before{display:none}
.sbar{position:fixed;top:0;left:0;right:0;z-index:2147483000;box-sizing:border-box;height:var(--sb-h);padding:env(safe-area-inset-top,0px) max(12px,env(safe-area-inset-right,0px)) 0 max(12px,env(safe-area-inset-left,0px));display:flex;align-items:center;gap:4px;background:rgba(13,17,27,.96);color:#e8edf5;border-bottom:1px solid rgba(190,210,240,.16);font:500 13.5px/1 "Manrope",Inter,system-ui,sans-serif;-webkit-text-size-adjust:100%;text-align:left}
.sbar *{box-sizing:border-box}
.sbar a,.sbar button{font:inherit;color:inherit;text-decoration:none;background:none;border:0;cursor:pointer}
.sbBrand{display:inline-flex;align-items:center;gap:9px;height:36px;padding:0 10px 0 4px;border-radius:10px;font-weight:700;letter-spacing:.02em;white-space:nowrap}
.sbMark{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:8px;border:1px solid rgba(253,230,138,.6);color:#fde68a;font:700 10px/1 "JetBrains Mono",ui-monospace,monospace}
.sbTop{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 11px;border-radius:999px;white-space:nowrap;color:#c9d3e3}
.sbTop:hover,.sbTop[aria-expanded=true]{background:rgba(255,255,255,.08);color:#fff}
.sbTop[aria-current=page],.sbTop.sbHere{color:#fff;box-shadow:inset 0 -2px 0 #fde68a;border-radius:8px}
.sbTop svg{width:10px;height:10px;transition:transform .2s}.sbTop[aria-expanded=true] svg{transform:rotate(180deg)}
.sbGrow{flex:1}
.sbar :focus-visible{outline:2px solid #fde68a;outline-offset:2px}
.sbSearch{display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 12px;border-radius:999px;border:1px solid rgba(190,210,240,.28);color:#c9d3e3}
.sbSearch kbd{font:500 11px "JetBrains Mono",monospace;border:1px solid rgba(190,210,240,.3);border-radius:5px;padding:2px 6px}
.sbSearch svg,.sbMenuBtn svg{width:16px;height:16px}
.sbMenuBtn{display:none;align-items:center;gap:7px;height:36px;padding:0 12px;border-radius:999px;border:1px solid rgba(190,210,240,.28)!important}
.sbPanel{position:fixed;z-index:2147483001;top:var(--sb-h);left:8px;max-width:calc(100vw - 16px);max-height:calc(100vh - var(--sb-h) - 12px);max-height:calc(100dvh - var(--sb-h) - 12px);overflow:auto;background:#0d111b;border:1px solid rgba(190,210,240,.18);border-radius:16px;box-shadow:0 24px 60px -20px rgba(0,0,0,.7);padding:10px;color:#e8edf5}
.sbPanel[hidden]{display:none}
.sbPanel h2{margin:10px 8px 4px;font:600 10.5px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#8fa0bb}.sbPanel h2:first-child{margin-top:4px}
.sbPanel .sbList{display:grid;gap:2px}
.sbPanel a{display:grid;gap:3px;padding:9px 12px;border-radius:10px;color:#e8edf5}
.sbPanel a:hover{background:rgba(255,255,255,.08)}.sbPanel a b{font-weight:600;font-size:14px}.sbPanel a span{font-size:12px;line-height:1.35;color:#9fb0c8;font-weight:400}
.sbPanel a[aria-current=page]{background:rgba(253,230,138,.14);box-shadow:inset 3px 0 0 #fde68a}
.sbPanel.sbWide{width:min(980px,calc(100vw - 16px))}.sbPanel.sbWide .sbCols{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0 8px}
.sbPanel.sbNarrow{width:min(360px,calc(100vw - 16px))}
.sbPanel.sbSheet{left:0;right:0;top:var(--sb-h);bottom:0;max-width:none;max-height:none;border-radius:0;border-width:1px 0 0}
.sbQuick{display:flex;gap:8px;flex-wrap:wrap;padding:4px 8px 8px}.sbQuick a{display:inline-flex;padding:9px 14px;border:1px solid rgba(190,210,240,.28);border-radius:999px;font-weight:600;font-size:13px}
.sbSkip{position:fixed;left:8px;top:-60px;z-index:2147483002;background:#fde68a;color:#111;padding:10px 14px;border-radius:8px;font:600 14px/1 Inter,sans-serif}.sbSkip:focus{top:calc(var(--sb-h) + 6px)}
.sbSrch{width:min(640px,calc(100vw - 24px));margin:0;padding:0;border:1px solid rgba(190,210,240,.25);border-radius:16px;background:#0d111b;color:#e8edf5;position:fixed;top:12vh;left:50%;transform:translateX(-50%)}
.sbSrch::backdrop{background:rgba(5,8,14,.6)}
.sbSrch input{width:100%;box-sizing:border-box;padding:16px 18px;font:500 16px "Manrope",Inter,system-ui,sans-serif;background:transparent;border:0;border-bottom:1px solid rgba(190,210,240,.18);color:#fff;outline:0}
.sbSrch ul{list-style:none;margin:0;padding:6px;max-height:55vh;overflow:auto}.sbSrch li a{display:grid;gap:2px;padding:9px 12px;border-radius:10px;color:#e8edf5;text-decoration:none}
.sbSrch li a:hover,.sbSrch li a.on{background:rgba(255,255,255,.09)}.sbSrch li b{font:600 14px Manrope,Inter,sans-serif}.sbSrch li small{font:400 12px/1.35 Manrope,Inter,sans-serif;color:#9fb0c8}
.sbSrch p{margin:0;padding:10px 18px 14px;font:400 12px Manrope,Inter,sans-serif;color:#8fa0bb}
@media (max-width:900px){.sbTop.sbDesk,.sbSearch kbd,.sbSearch span.sbLbl{display:none}.sbMenuBtn{display:inline-flex}.sbSearch{width:36px;height:36px;padding:0;justify-content:center}}
@media (max-width:520px){.sbBrand .sbName{display:none}}
@media (prefers-reduced-motion:reduce){.sbTop svg{transition:none}}
@media print{.sbar,.sbPanel{display:none}body{padding-top:0!important}}`;
 document.head.append(css);

 const bar=document.createElement('div');bar.id='sbar';bar.className='sbar';bar.setAttribute('role','navigation');bar.setAttribute('aria-label','Visual & Motion Atlas');
 const top=(id,label,cls)=>`<button type="button" class="sbTop sbDesk ${cls||''}" data-m="${id}" aria-expanded="false" aria-controls="sbP-${id}" aria-haspopup="true">${esc(label)}${chev}</button>`;
 const toolsCur=isCur('tools.html');
 bar.innerHTML=`<a class="sbBrand" href="${esc(url('atlas.html#home').href)}" aria-label="Visual and Motion Atlas home"><span class="sbMark" aria-hidden="true">V/M</span><span class="sbName">Atlas</span></a>
 ${top('lib','Library',has(LIB.flatMap(g=>g.items))?'sbHere':'')}${top('make','Make',has(MAKE)?'sbHere':'')}${top('studio','Your studio',has(STUDIO)?'sbHere':'')}<a class="sbTop sbDesk" href="${esc(url('tools.html').href)}"${toolsCur?' aria-current="page"':''}>All tools</a>
 <span class="sbGrow"></span>
 <button type="button" class="sbSearch" data-m="search" aria-label="Search the atlas"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="m10.5 10.5 3.5 3.5" stroke="currentColor" stroke-width="1.5"/></svg><span class="sbLbl">Search</span><kbd>/</kbd></button>
 <a class="sbTop sbDesk${isCur('#projects')?' sbHere':''}" href="${esc(url('#projects').href)}">My projects</a><a class="sbTop sbDesk${isCur('account.html')?' sbHere':''}" href="${esc(url('account.html').href)}">Account</a>
 <button type="button" class="sbMenuBtn" data-m="menu" aria-expanded="false" aria-controls="sbP-menu"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 4h11M2.5 8h11M2.5 12h11" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>Menu</button>`;
 const skip=document.createElement('a');skip.className='sbSkip';skip.href='#';skip.textContent='Skip to content';
 skip.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector('main,[role=main],#main')||document.querySelector('h1');if(t){if(!t.hasAttribute('tabindex'))t.setAttribute('tabindex','-1');t.focus({preventScroll:false})}});
 const panels={
  lib:`<div class="sbCols">${LIB.map(g=>`<section><h2>${esc(g.name)}</h2><div class="sbList">${g.items.map(item).join('')}</div></section>`).join('')}</div>`,
  make:`<div class="sbList">${MAKE.map(item).join('')}</div><div class="sbQuick"><a href="${esc(url('tools.html').href)}">All tools &rarr;</a></div>`,
  studio:`<div class="sbList">${STUDIO.map(item).join('')}</div>`,
  menu:`<div class="sbQuick"><a href="${esc(url('tools.html').href)}"${toolsCur?' aria-current="page"':''}>All tools</a><a href="${esc(url('#projects').href)}">My projects</a><a href="${esc(url('account.html').href)}">Account</a></div>${[...LIB,grp('Make'),grp('Your studio')].map(g=>`<h2>${esc(g.name)}</h2><div class="sbList">${g.items.map(item).join('')}</div>`).join('')}`};
 const cls={lib:'sbWide',make:'sbNarrow',studio:'sbNarrow',menu:'sbSheet'};
 const els={};
 for(const k in panels){const p=document.createElement('div');p.id='sbP-'+k;p.className='sbPanel '+cls[k];p.hidden=true;p.innerHTML=panels[k];els[k]=p}
 let openKey=null,opener=null;
 function close(refocus){if(!openKey)return;els[openKey].hidden=true;bar.querySelectorAll('[aria-expanded=true]').forEach(b=>b.setAttribute('aria-expanded','false'));const o=opener;openKey=null;opener=null;if(refocus&&o)o.focus()}
 function open(k,btn){close();openKey=k;opener=btn;els[k].hidden=false;btn.setAttribute('aria-expanded','true');
  if(k!=='menu'&&k!=='lib'){const r=btn.getBoundingClientRect();els[k].style.left=Math.max(8,Math.min(r.left,innerWidth-els[k].offsetWidth-8))+'px'}else if(k==='lib')els[k].style.left='8px'}
 bar.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;const k=b.dataset.m;if(k==='search'){close();openSearch();return}
  if(openKey===k)close(true);else open(k,b)});
 document.addEventListener('click',e=>{if(openKey&&!e.target.closest('.sbar,.sbPanel'))close()});
 for(const k in els)els[k].addEventListener('click',e=>{if(e.target.closest('a'))close()});
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
    try{await new Promise((res,rej)=>{const s=document.createElement('script');s.src=new URL('ds/search-index.js',BASE).href;s.onload=res;s.onerror=rej;document.head.append(s)});
     for(const d of window.DS_INDEX||[])out.push({t:d.t,s:'01 Design System · '+d.p,h:new URL('ds/'+d.u,BASE).href,k:(d.t+' '+d.p+' '+d.k).toLowerCase()})}catch(_){}
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
