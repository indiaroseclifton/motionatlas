'use strict';
/* Hand a theme kit (the kits/themes.js shape, also what the Brand generator and the Moodboard style dialog produce)
   to the Site builder or the Brand kit generator.
   KitHandoff.toSite(kit)  -> writes the Site builder's brand hand-off and opens page-builder.html?brand=1
   KitHandoff.toBrand(kit) -> opens brand-generator.html with the kit's name, mood and accent as the starting brief */
(()=>{
 const fam=f=>{const n=String(f||'').split(',')[0].replace(/['"]/g,'').trim();return /^[\w ]{2,40}$/.test(n)?n:''};
 const b64=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 function siteBrief(k){let mark='';try{if(window.ThemeKits&&ThemeKits.favicon)mark='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(ThemeKits.favicon(k))}catch(e){}
  return {name:String(k.name||'My brand'),desc:k.mood||'',audience:'',feels:[k.feel].filter(Boolean),tagline:k.tagline||'',headline:(k.voice&&k.voice[0])||'',voice:[],group:'',mode:k.tone||'light',
   t:{bg:k.t.bg,surface:k.t.surface,ink:k.t.ink,primary:k.t.accent},head:fam(k.fonts&&k.fonts.head),body:fam(k.fonts&&k.fonts.body),radius:Math.min(40,parseInt(k.t.radius)||0),mark,at:Date.now()}}
 window.KitHandoff={
  siteBrief,
  toSite(k){localStorage.setItem('atlas-pb-brand-handoff',JSON.stringify(siteBrief(k)));location.href='page-builder.html?brand=1'},
  toBrand(k){location.href='brand-generator.html#s='+b64({name:String(k.name||''),desc:k.mood||'',feels:[k.feel].filter(Boolean),base:k.t.accent})}
 };
})();
