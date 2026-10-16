'use strict';
/* Swap the screenshot fragments of UI components for the live components in system-components/<system>.js.
   Cards, system hubs, catalogue tiles and the asset inspector all go through AssetAtlas.fragment / card / detail,
   so patching those three covers every place a component appears. Graphics, icons and type stay as artwork. */
(()=>{
 if(typeof AssetAtlas==='undefined'||!window.SysComponents)return;
 const SC=window.SysComponents,A=AssetAtlas,base=new URL('.',document.currentScript.src).href,loading={};
 const isUI=a=>a&&a.category==='UI components';
 SC.load=sys=>loading[sys]||(loading[sys]=new Promise(res=>{if(SC.systems[sys])return res(true);const s=document.createElement('script');s.src=base+sys+'.js';s.onload=()=>res(!!SC.systems[sys]);s.onerror=()=>res(false);document.head.append(s);}));
 const live=(a,natural)=>`<div class="assetLive${natural?' isNatural':''}" data-sc="${a.id}" data-sys="${a.system}" role="group" aria-label="${esc(a.family+' / '+a.title)}, live component"></div>`;
 const original=A.fragment.bind(A);
 A.fragment=function(a){return isUI(a)?live(a):original(a);};
 const baseCard=A.card.bind(A);
 A.card=function(a){if(!isUI(a))return baseCard(a);
  return `<article class="assetCard isLive"><div class="assetPreview isLive">${live(a)}</div><p class="cardcode">${esc(a.family)} / UI component</p><h3><button data-asset-open="${a.id}">${esc(a.title)}</button></h3><p>Live HTML and CSS · hover and click to try it</p><div class="creatorActions"><button class="quiet" data-sc-copy="${a.id}">Copy code</button><button class="quiet" data-asset-open="${a.id}">Open</button><button class="quiet" data-project-add="${a.id}">Add to project</button></div></article>`;};
 const baseDetail=A.detail.bind(A);
 A.detail=function(a){if(!isUI(a))return baseDetail(a);
  return `<div class="sectionhead"><h2>${esc(a.family+' / '+a.title)}</h2><button class="quiet" data-asset-close>Close</button></div><div class="assetDetail isLive"><div class="assetLiveStage">${live(a,true)}</div><div><h3>Use it</h3><p>A working ${esc(a.family)} component: real HTML and CSS in the system’s own type and colour, with hover, focus and pressed states. Copy it into any page.</p><div class="creatorActions"><button class="secondary" data-sc-copy="${a.id}">Copy code</button><button class="secondary" data-sc-download="${a.id}">Download HTML</button><button class="quiet" data-project-add="${a.id}">Add to project</button></div><pre class="scCode" tabindex="0" aria-label="Component code"><code data-sc-code="${a.id}">Loading…</code></pre><details class="scOriginal"><summary>Original mockup crop</summary>${original(a)}</details><a href="#systems?id=${a.system}" class="quiet">Open ${esc(a.family)} system</a><p class="assetLocalStatus" role="status"></p></div></div>`;};

 /* mount placeholders as they scroll near; the detail view renders at natural size */
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);mount(e.target);}),{rootMargin:'300px 0px'});
 async function mount(el){const id=el.dataset.sc,sys=el.dataset.sys;if(!(await SC.load(sys))||!SC.has(id)){el.classList.add('isMissing');el.outerHTML=original(A.get(id));return;}
  SC.mount(el,id,{fit:!el.classList.contains('isNatural')});el.dataset.scDone='1';
  document.querySelectorAll(`[data-sc-code="${id}"]`).forEach(c=>c.textContent=SC.code(id));}
 const scan=root=>root.querySelectorAll?.('.assetLive:not([data-sc-seen])').forEach(el=>{el.dataset.scSeen='1';io.observe(el);});
 new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches?.('.assetLive'))scan(n.parentNode);else scan(n);}}).observe(document.body,{childList:true,subtree:true});
 scan(document);

 async function codeOf(id){const a=A.get(id);await SC.load(a.system);return SC.code(id);}
 document.addEventListener('click',async e=>{const c=e.target.closest('[data-sc-copy],[data-sc-download]');if(!c)return;e.preventDefault();
  if(c.dataset.scCopy){const txt=await codeOf(c.dataset.scCopy),label=c.textContent;try{await navigator.clipboard.writeText(txt);c.textContent='Copied';}catch{const ta=document.createElement('textarea');ta.value=txt;document.body.append(ta);ta.select();try{document.execCommand('copy');c.textContent='Copied';}catch{c.textContent='Select the code below';}ta.remove();}setTimeout(()=>c.textContent=label,1600);return;}
  const a=A.get(c.dataset.scDownload),body=await codeOf(a.id);
  A.download(a.system.toLowerCase()+'-'+a.id.toLowerCase()+'.html',`<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${a.family} / ${a.title}</title></head>\n<body style="margin:0;min-height:100vh;display:grid;place-items:center;padding:32px;background:#f2f3f6">\n${body}\n</body></html>`,'text/html');});
})();
