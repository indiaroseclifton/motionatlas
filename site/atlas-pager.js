'use strict';
/* Long lists show twelve cards and a "Show more" row, so a section is a few screens on a phone instead of forty.
   Works on any grid whose cards are its direct children: it only hides the children past the limit, so each
   section keeps drawing its own cards. A new result set (search, filter) starts again at twelve.
   Add a list to GRIDS: [selector, how many to show, optional selector for what counts as a card]. */
(()=>{
 const GRIDS=[['#componentGrid',12],['#bgGrid',12],['#referenceGrid',12],['#cinemaGrid',12],['#artGrid',12],['#fxlGrid',12],['#vaseGrid',12],
  ['#motion .studyRiver',4,'.riverRow'],['#motion .umGrid',6,'.umCard'],['#sfLibrary .sfLibGrid',6],['#creditsMuseum',12,'*'],['#fontPairings',6],['#fontSpecimens',6]];
 const st=document.createElement('style');st.textContent=`.pgOff{display:none!important}
.pgMore{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 12px;margin:24px 0 8px}
.pgMore[hidden]{display:none}
.pgMore span{flex-basis:100%;text-align:center;font:400 13px/1.4 Inter,system-ui,sans-serif;color:var(--text-dim,#4a5466)}
.pgMore button{min-height:44px;padding:0 20px;border-radius:999px;border:1px solid var(--hair,#d9dee6);background:#fff;font:600 14px/1 Inter,system-ui,sans-serif;color:var(--text,#0d1220);cursor:pointer}
.pgMore button:hover{border-color:currentColor}
.pgMore button:focus-visible{outline:2px solid var(--text,#0d1220);outline-offset:2px}
.pgMore .pgAll{border-color:transparent;background:none;font-weight:500;text-decoration:underline;text-underline-offset:3px}`;
 document.head.append(st);
 function attach(grid,size,pick){
  if(grid.pg)return;const s=grid.pg={limit:size,n:-1},bar=document.createElement('div');bar.className='pgMore';bar.hidden=true;pick?grid.append(bar):grid.after(bar);
  const cards=()=>[...grid.children].filter(k=>k!==bar&&(pick?k.matches(pick):!/^(P|TEMPLATE|SCRIPT|STYLE)$/.test(k.tagName)));
  function apply(){const k=cards();if(k.length!==s.n){s.n=k.length;s.limit=size}
   k.forEach((c,i)=>c.classList.toggle('pgOff',i>=s.limit));const left=k.length-s.limit;bar.hidden=left<=0;
   if(left>0)bar.innerHTML=`<span>Showing ${s.limit} of ${k.length}</span><button type="button" class="pgNext">Show ${Math.min(size,left)} more</button><button type="button" class="pgAll">Show all ${k.length}</button>`}
  bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const first=cards()[s.limit];s.limit=b.classList.contains('pgAll')?1e9:s.limit+size;apply();
   const f=first&&(first.matches('button,a[href]')?first:first.querySelector('button,a[href],[tabindex="0"]'));if(f)f.focus({preventScroll:true})});
  new MutationObserver(apply).observe(grid,{childList:true});apply();
 }
 const scan=()=>{for(const [sel,size,pick] of GRIDS){const g=document.querySelector(sel);if(g)attach(g,size,pick)}};
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',scan);else scan();
 const soon=()=>[300,1200,3000].forEach(t=>setTimeout(scan,t));addEventListener('hashchange',soon);addEventListener('load',soon);
 window.AtlasPager={attach,scan};
})();
