'use strict';
/* Kit tabs: a rendered theme kit is nine sections and about ten screens tall. This shows one section at a time
   under a row of tabs (Overview, Colours, Light & dark, Fonts, Components, Examples, Assets, Guidelines, Download).
   Sections that are not showing are parked at full width with no height, so their canvases still measure.
   Works on theme-kits.html (#kit) and inside the brand kit generator (#kitBox). The kit is re-rendered when the
   chosen kit or brand changes; a MutationObserver re-applies the tabs and keeps the open one. */
(()=>{
 const NAMES={'Colour':'Colours','Light and dark':'Light & dark','Type':'Fonts','Brand applications':'Examples','Brand guidelines':'Guidelines','Take the whole kit':'Download'};
 const st=document.createElement('style');st.textContent=`
.ktBar{position:sticky;top:var(--sb-h,44px);z-index:6;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;box-sizing:border-box;max-width:1240px;margin:0 auto;padding:10px 24px;background:var(--pbg,#F4F5F8)}
.ktBar::-webkit-scrollbar{display:none}
.ktBar[hidden]{display:none}
.ktBar button{flex:none;min-height:40px;padding:0 16px;border:1px solid #DCE0E8;border-radius:999px;background:#fff;color:#1C1F2A;font:600 13.5px/1 Inter,system-ui,sans-serif;cursor:pointer}
.ktBar button[aria-selected=true]{background:#1C1F2A;border-color:#1C1F2A;color:#fff}
.ktBar button:focus-visible{outline:2px solid #1C1F2A;outline-offset:2px}
#out .ktBar{position:static;max-width:none;padding:0 0 12px;background:none}
.ktHost{position:relative}
.ktHost>section.ktOff{position:absolute!important;left:0;right:0;top:0;height:0!important;min-height:0!important;margin:0!important;padding-top:0!important;padding-bottom:0!important;overflow:hidden!important;visibility:hidden!important;pointer-events:none}
@media (max-width:700px){.ktBar{padding:8px 14px}}`;
 document.head.append(st);
 const sbh=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sb-h'))||44;
 function host(el){if(!el)return null;if(el.querySelector(':scope>section.tk-sec'))return el;const s=el.querySelector('section.tk-sec');return s?s.parentElement:el}
 function attach(el){
  if(!el||el.__kt)return;el.__kt=1;
  const bar=document.createElement('div');bar.className='ktBar';bar.setAttribute('role','tablist');bar.setAttribute('aria-label','Parts of this kit');el.before(bar);
  let cur=0;
  function apply(){const root=host(el),secs=[...root.querySelectorAll(':scope>section')];
   if(secs.length<2){bar.hidden=true;return}
   bar.hidden=false;root.classList.add('ktHost');if(cur>=secs.length)cur=0;
   const sig=cur+'|'+secs.map(s=>s.classList.contains('tk-hero')?'o':((s.querySelector('h2')||{}).textContent||'').trim()).join(',');
   if(bar.dataset.sig!==sig){bar.dataset.sig=sig;bar.innerHTML=secs.map((s,i)=>{const h=s.classList.contains('tk-hero')?'Overview':((s.querySelector('h2')||{}).textContent||'Part '+(i+1)).trim();
    return `<button type="button" role="tab" data-i="${i}" aria-selected="${i===cur}" tabindex="${i===cur?0:-1}">${(NAMES[h]||h).replace(/&/g,'&amp;').replace(/</g,'&lt;')}</button>`}).join('')}
   secs.forEach((s,i)=>s.classList.toggle('ktOff',i!==cur))}
  function go(i,focus){cur=i;apply();const top=bar.getBoundingClientRect().top+scrollY-sbh()-8;if(scrollY>top)scrollTo({top});dispatchEvent(new Event('resize'));if(focus){const b=bar.querySelector('[aria-selected=true]');b&&b.focus()}}
  bar.addEventListener('click',e=>{const b=e.target.closest('[role=tab]');if(b)go(+b.dataset.i,true)});
  bar.addEventListener('keydown',e=>{const n=bar.children.length;let j=null;if(e.key==='ArrowRight')j=(cur+1)%n;if(e.key==='ArrowLeft')j=(cur-1+n)%n;if(e.key==='Home')j=0;if(e.key==='End')j=n-1;if(j!=null){e.preventDefault();go(j,true)}});
  new MutationObserver(()=>{clearTimeout(el.__ktT);el.__ktT=setTimeout(apply,30)}).observe(el,{childList:true,subtree:el.id==='kitBox'});
  apply();
 }
 const start=()=>{attach(document.getElementById('kit'));attach(document.getElementById('kitBox'))};
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',start);else start();
 window.KitTabs={attach};
})();
