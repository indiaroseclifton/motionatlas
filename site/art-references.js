'use strict';
/* Historical reference works for the art styles (R entries), from The Met Open Access (CC0).
   Shown under the art workbench specimen and in each style's detail view, with full credit lines. */
(()=>{
 let data=null,loading=null;
 const load=()=>loading||(loading=fetch('art-references.json').then(r=>r.ok?r.json():null).then(d=>{data=d;return d;}).catch(()=>null));
 const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function block(id){const refs=data?.refs?.[id];if(!refs?.length)return '';
  return `<section class="artHistory" data-art-history="${id}"><div class="artHistoryHead"><p class="cardcode">From the collection</p><h3>Where this style comes from</h3><p>Real works in the public domain from The Metropolitan Museum of Art. Compare their marks, surfaces and colour with the specimen above.</p></div><div class="artHistoryGrid">${refs.map(r=>`<figure class="artRef"><a href="${e(r.url)}" target="_blank" rel="noopener" aria-label="${e(r.title)}, ${e(r.artist)}, at The Met (opens in a new tab)"><img src="${e(r.src)}" width="${r.w}" height="${r.h}" loading="lazy" decoding="async" alt="${e(r.title)} by ${e(r.artist)}, ${e(r.date)}"></a><figcaption><b>${e(r.title)}</b><span>${e(r.artist)}${r.date?' · '+e(r.date):''}</span><small>${e(r.medium)}</small><small>${e(r.museum)} · ${e(r.licence)} · <a href="${e(r.url)}" target="_blank" rel="noopener">View record ↗</a></small></figcaption></figure>`).join('')}</div></section>`;}
 /* Art workbench: refresh the block whenever the selected style changes. */
 function patchArt(){if(typeof ArtAtlas==='undefined'||!ArtAtlas.update||ArtAtlas.update.__refs)return !!ArtAtlas?.update?.__refs;
  const up=ArtAtlas.update;ArtAtlas.update=function(){up.apply(this,arguments);render();};ArtAtlas.update.__refs=true;render();return true;}
 async function render(){await load();const host=document.querySelector('#artWorkbench>div:first-child');if(!host||typeof ArtAtlas==='undefined')return;
  host.querySelector('.artHistory')?.remove();host.insertAdjacentHTML('beforeend',block(ArtAtlas.selected));}
 /* Detail dialog: append to the Reference view of an R entry. */
 function watchDetail(){const body=document.getElementById('detailBody');if(!body)return false;
  new MutationObserver(async()=>{let s,v;try{s=selected;v=currentView;}catch{return;}if(!s||s.id[0]!=='R'||v!=='reference'||body.querySelector('.artHistory'))return;await load();if(selected===s&&!body.querySelector('.artHistory'))body.insertAdjacentHTML('beforeend',block(s.id));}).observe(body,{childList:true});return true;}
 const t=setInterval(()=>{const a=patchArt(),b=watchDetail.done||(watchDetail.done=watchDetail());if(a&&b)clearInterval(t);},150);
 /* Credits list on the Source library page. */
 async function credits(){const host=document.getElementById('creditsMuseum');if(!host||host.dataset.done)return;const d=await load();if(!d)return;host.dataset.done='1';
  const name=id=>{try{return find(id)?.title||id;}catch{return id;}};
  const all=Object.entries(d.refs).flatMap(([id,list])=>list.map(r=>({id,...r})));
  document.getElementById('creditsMuseumIntro').textContent=`${all.length} public-domain works from The Metropolitan Museum of Art Open Access (CC0), shown next to the art styles they inform.`;
  host.innerHTML=all.map(r=>`<p><b>${e(r.title)}</b>, ${e(r.artist)}${r.date?', '+e(r.date):''}. ${e(r.credit||'')} <a href="${e(r.url)}" target="_blank" rel="noopener">Record ↗</a><br><small>Shown with ${e(r.id)} ${e(name(r.id))}</small></p>`).join('');}
 window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#references'))credits();});setTimeout(()=>{if(location.hash.startsWith('#references'))credits();},1500);
 window.ArtReferences={load,block,credits};
})();
