'use strict';
/* New styles S13-S20: native style tiles (no raster image), built from the same theme tokens as
   the component lab, plus links to the component lab skin and the paired landing effect. */
(()=>{
 const NEW=/^S(1[3-9]|20)$/;
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 function vars(id,mode='light'){const t=AtlasThemes.byId[id];if(!t)return'';AtlasThemes.loadFonts(t);return Object.entries(AtlasThemes.vars(t,mode,'comfortable')).map(([k,v])=>`${k}:${String(v).replace(/"/g,"'")}`).join(';');}
 function tile(e,interactive){
  const t=AtlasThemes.byId[e.id];if(!t)return '';
  const c=t.light;const fx=e.pairs?.effect;
  return `<div class="styleTile cl-root" data-style-tile="${e.id}" style="${vars(e.id)}">
   <div class="stHead"><span class="stCode">${e.id} · New style</span><span class="stAa" aria-hidden="true">Aa</span></div>
   <h4 class="stTitle">${esc(e.title)}</h4>
   <div class="stSwatches" aria-label="Palette">${[c.bg,c.surface,c.text,c.accent,c.success,c.danger].map(v=>`<i style="background:${v}" title="${v}"></i>`).join('')}</div>
   <div class="stUI" aria-hidden="true"><div class="cl-row"><span class="cl-btn primary">Get started</span><span class="cl-btn">Preview</span></div>
   <div class="cl-surface stCard"><b>Garden Notes</b><span class="cl-muted">12 references · In review</span><span class="cl-switch on" aria-hidden="true"><i></i></span></div></div>
   ${interactive?`<div class="stLinks"><a href="#ux?component=C01&theme=${e.id}">Open this skin in the component lab →</a>${fx?`<a href="#effects?fx=${fx}">Paired effect: ${fx} →</a>`:''}</div>`:''}
  </div>`;
 }
 function patch(){
  if(typeof window.elementExample!=='function'||window.elementExample.__ns)return false;
  const orig=window.elementExample;
  const wrapped=function(e,interactive=true){if(e&&NEW.test(e.id))return tile(e,interactive);return orig.apply(this,arguments);};
  wrapped.__ns=true;window.elementExample=wrapped;
  if(typeof window.sameUI==='function'&&!window.sameUI.__ns){const o=window.sameUI;const w=function(style){const html=o.apply(this,arguments);if(NEW.test(style)&&window.AtlasThemes){const t=AtlasThemes.byId[style];AtlasThemes.loadFonts(t);}return html;};w.__ns=true;window.sameUI=w;}
  return true;
 }
 const iv=setInterval(()=>{if(patch()){clearInterval(iv);if(typeof renderGrid==='function'&&typeof catalogue!=='undefined'&&catalogue.length)try{renderGrid();}catch{}fill();}},200);
 function fill(){document.querySelectorAll('[data-pending-style]').forEach(el=>{const e=typeof catalogue!=='undefined'&&catalogue.find(x=>x.id===el.dataset.pendingStyle);if(e)el.outerHTML=tile(e,false);});}
 new MutationObserver(()=>{if(document.querySelector('[data-pending-style]'))fill();}).observe(document.body,{childList:true,subtree:true});
 window.NewStyles={tile};
})();
