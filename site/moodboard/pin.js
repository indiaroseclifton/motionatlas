'use strict';
/* "Pin to moodboard" on atlas entries and theme kits. Works without the moodboard page loaded:
   it writes straight into the same local store the moodboard reads (MoodStore, moodboard/store.js). */
(()=>{
 const cat=()=>(typeof catalogue!=='undefined'?catalogue:(window.catalogue||[]));
 const toast=t=>{if(typeof window.toast==='function'){try{return window.toast(t)}catch{}}let el=document.getElementById('mbPinToast');if(!el){el=document.createElement('div');el.id='mbPinToast';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;background:#111;color:#fff;padding:10px 16px;border-radius:10px;font:14px/1.4 system-ui,sans-serif;max-width:calc(100vw - 32px);box-shadow:0 10px 30px rgba(0,0,0,.4)';document.body.append(el)}el.innerHTML=t;el.hidden=false;clearTimeout(el._t);el._t=setTimeout(()=>el.hidden=true,4200)};
 const sprite=e=>{const r=e.image;if(!r||!r.url)return null;const c=r.columns||2,w=r.rows||2,col=r.index%c,row=Math.floor(r.index/c);return {u:r.url,s:`${c*100}% ${w*100}%`,p:`${c===1?0:col/(c-1)*100}% ${w===1?0:row/(w-1)*100}%`,c,r:w,i:r.index}};
 function pin(e){if(!window.MoodStore)return;const b=MoodStore.target();const sp=sprite(e);
  MoodStore.addItem(b,{type:'entry',ref:e.id,title:e.title,sub:e.group||e.kind||'',img:sp,w:240,h:sp?170:110});
  toast(`Pinned “${String(e.title).replace(/[<>&]/g,'')}” to ${String(b.name).replace(/[<>&]/g,'')}. <a href="moodboard.html?board=${b.id}" style="color:#9fd">Open the moodboard</a>`)}
 function button(){const body=document.getElementById('detailBody');const notes=body&&body.querySelector('.detailnotes');if(!notes||notes.querySelector('.mbPinBtn'))return;
  const b=document.createElement('button');b.type='button';b.className='secondary mbPinBtn';b.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true" width="14" height="14" style="margin-right:6px;vertical-align:-2px"><path d="M9.5 1.5 14.5 6.5 12 7l-2 3 .5 3-1 1-3-3-4.5 4.5M7 6l-2 .5L4 5.5l1-1 3 .5z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>Pin to moodboard';
  b.onclick=()=>{const id=(typeof selected!=='undefined'&&selected&&selected.id)||(notes.closest('dialog')&&document.getElementById('detailCode')?.textContent||'').slice(0,3);const e=cat().find(x=>x.id===id);if(e)pin(e)};
  const after=notes.querySelector('.shareDirBtn')||notes.querySelector('[data-project-add]');(after||notes.firstElementChild)?.insertAdjacentElement('afterend',b)}
 function init(){if(!window.MoodStore)return;const body=document.getElementById('detailBody');if(!body)return;new MutationObserver(button).observe(body,{childList:true});button()}
 function load(){if(window.MoodStore)return init();const s=document.createElement('script');s.src='moodboard/store.js';s.onload=init;document.head.append(s)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
 window.MoodPin={pin,pinKit(k){const b=MoodStore.target();MoodStore.addItem(b,{type:'kit',ref:k.id,title:k.name,sub:k.tagline||'',colors:['bg','surface','ink','accent','accent2'].map(x=>k.t[x]).filter(Boolean),head:k.fonts&&k.fonts.head||'',body:k.fonts&&k.fonts.body||'',css:k.fonts&&k.fonts.css||'',w:240,h:150});toast(`Pinned the ${String(k.name).replace(/[<>&]/g,'')} kit to ${String(b.name).replace(/[<>&]/g,'')}. <a href="moodboard.html?board=${b.id}" style="color:#9fd">Open</a>`)}};
})();
