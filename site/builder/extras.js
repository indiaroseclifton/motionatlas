'use strict';
/* Page builder, library blocks that are drawn by code rather than templates: UI components (ComponentLab),
   interaction-shelf demos, generated backgrounds (BackgroundAtlas), theme-kit backgrounds and assets
   (ThemeKits), icon families, landing-effect clips, film bands and a type specimen.
   Every source is feature-detected: if a library is missing the block says so instead of breaking.
   type.render(vals, ctx) -> {html, css:[[key,css]], js}. ctx.need(key, code|{src,file}) adds a shared
   script once per page; ctx.A is the asset prefix; ctx.mode is 'preview' | 'html' | 'zip'. */
(()=>{
const PB=window.PB=window.PB||{};
const esc=s=>String(s??'').replace(/[&<>"'{]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','{':'&#123;'}[c]));
const rows=v=>String(v||'').split(/\n/).map(r=>r.trim()).filter(Boolean).map(r=>r.split(/\s*\|\s*/));
const CL=()=>window.ComponentLab&&Array.isArray(window.ComponentLab.components)?window.ComponentLab:null;
const IX=()=>Array.isArray(window.INTERACTIONS)?window.INTERACTIONS:[];
const BGA=()=>window.BackgroundAtlas&&Array.isArray(window.BackgroundAtlas.ALL)?window.BackgroundAtlas:null;
const TK=()=>window.ThemeKits&&Array.isArray(window.ThemeKits.list)?window.ThemeKits:null;
const kit=id=>{const t=TK();return t&&(t.list.find(k=>k.id===id)||t.list[0])};
const ix=id=>IX().find(x=>x.id===id);
PB.esc=esc;PB.rows=rows;PB.src={CL,IX,BGA,TK,kit};
const NOTE=(t)=>`<section class="wrap"><p class="x-missing">${esc(t)}</p></section>`;
const HEAD=(v)=>(v.kicker||v.heading||v.intro)?`<div class="x-head">${v.kicker?`<p class="k">${esc(v.kicker)}</p>`:''}${v.heading?`<h2 class="h">${esc(v.heading)}</h2>`:''}${v.intro?`<p class="x-intro">${esc(v.intro)}</p>`:''}</div>`:'';
const PAUSE_SVG='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>';
const PLAY_SVG='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>';

/* Shared CSS for every extra block (added once). */
PB.extraBase=`.x-head{max-width:760px;margin:0 0 28px}.x-head .h{font-size:clamp(32px,4.4vw,56px);margin:10px 0 12px}.x-intro{color:var(--mute);margin:0;font-size:17px}
.x-missing{padding:24px;border:1px dashed var(--line);border-radius:var(--radius);color:var(--mute);text-align:center;margin:0}
.x-ctrl{position:absolute;right:14px;top:14px;width:44px;height:44px;border-radius:50%;border:0;background:color-mix(in srgb,var(--surface) 82%,transparent);color:var(--ink);cursor:pointer;display:grid;place-items:center;z-index:3}.x-ctrl svg{width:16px;height:16px}
.vh{position:absolute!important;left:0;top:0;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important}`;
/* Pause/play for any [data-x-anim] host: calls host.__stop/__start. Shared runtime. */
const PAUSE_RT=`window.__xPause=function(host,start){var b=host.querySelector('.x-ctrl'),stop=null,on=false;var R=matchMedia('(prefers-reduced-motion: reduce)').matches;
function set(p){if(stop){stop();stop=null}stop=start(!p);on=p;b.innerHTML=p?${JSON.stringify(PAUSE_SVG)}:${JSON.stringify(PLAY_SVG)};b.setAttribute('aria-label',p?'Pause background':'Play background')}
b.onclick=function(){set(!on)};set(!R)};`;

/* ---------- components ---------- */
let clBase=null;
function clBaseCSS(){const L=CL();if(!L)return '';if(clBase!=null)return clBase;try{const all=L.css(),parts=L.components.map(c=>c.css).join('\n');clBase=all.endsWith(parts)?all.slice(0,all.length-parts.length):all}catch(e){clBase=''}return clBase}
PB.clMap=`.cl-root{--cl-bg:var(--bg);--cl-surface:var(--surface);--cl-text:var(--ink);--cl-muted:var(--mute);--cl-line:var(--line);--cl-accent:var(--accent);--cl-on-accent:var(--on-accent);--cl-danger:color-mix(in srgb,#D92D20 72%,var(--ink));--cl-success:color-mix(in srgb,#15803D 78%,var(--ink));--cl-warn:color-mix(in srgb,#B45309 78%,var(--ink));--cl-radius:var(--radius);--cl-radius-sm:min(var(--radius),10px);--cl-bw:1px;--cl-shadow:0 12px 30px -18px rgba(0,0,0,.4);--cl-font:var(--body);--cl-display:var(--head);--cl-weight:600;--cl-backdrop:var(--bg);--cl-glass:none;--cl-pad:10px 18px;--cl-h:44px;--cl-gap:14px;--cl-accent-grad:var(--accent)}`;
PB.componentHTML=(c,variant,uid)=>{try{return c.html(variant||c.v[0][0],{uid:'x'+uid,label:'',icon:false})}catch(e){return '<p class="x-missing">This component could not be drawn.</p>'}};
const comp={id:'x-component',name:'UI component',group:'Components',desc:'Any component from the UI component lab, in a section, themed by the page style and working in the export.',
 fields:[{k:'cid',label:'Component',type:'select',options:()=>(CL()?CL().components:[]).map(c=>[c.id,c.id+' · '+c.name]),def:'C01'},
  {k:'variant',label:'State',type:'select',options:v=>{const c=CL()&&CL().components.find(x=>x.id===v.cid);return c?c.v.map(([k,l])=>[k,l]):[]},def:''},
  {k:'kicker',label:'Kicker',type:'text',def:''},{k:'heading',label:'Heading',type:'text',def:''},{k:'intro',label:'Intro',type:'long',def:''},
  {k:'layout',label:'Layout',type:'select',options:()=>[['card','In a card'],['plain','On the page'],['wide','Full width card']],def:'card'}],
 render(v,ctx){const L=CL();if(!L)return {html:NOTE('The component library has not loaded.')};const c=L.components.find(x=>x.id===v.cid)||L.components[0];
  const variant=c.v.some(x=>x[0]===v.variant)?v.variant:c.v[0][0],cfg=ctx.cfg||{},CF=PB.cfg;
  const live=c.live&&!cfg.st;if(live)ctx.need('cl',{componentLab:true});
  const inner=CF?CF.applyContent(PB.componentHTML(c,variant,ctx.uid),cfg):PB.componentHTML(c,variant,ctx.uid),rs=CF?CF.compStyle(cfg):'';
  const al=cfg.al==='start'||cfg.al==='end'?cfg.al:'center',aid=cfg.id&&/^[A-Za-z][\w-]*$/.test(cfg.id)?` id="${esc(cfg.id)}"`:'';
  return {html:`<section class="wrap x-comp x-${esc(v.layout||'card')}${cfg.calm?' x-calm':''}"${aid}>${HEAD(v)}<div class="x-stage x-frame" style="justify-items:${al}"><div class="cl-root"${live?` data-cllive="${c.id}"`:''}${rs?` style="${esc(rs)}"`:''}>${inner}</div></div></section>`,
   css:[['cl-base',clBaseCSS()],['cl-map',PB.clMap],['cl:'+c.id,c.css||''],['x-comp',`.x-comp .x-stage{display:grid;justify-items:center;overflow:auto}.x-comp.x-plain .x-stage{overflow:visible}.x-comp.x-card .x-stage,.x-comp.x-wide .x-stage{background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--radius) * 1.3);padding:clamp(24px,5vw,56px)}.x-comp.x-wide{max-width:none}.x-comp .cl-root{max-width:100%;color:var(--ink)}.x-calm *,.x-calm *::before,.x-calm *::after{animation:none!important;transition:none!important}`]]}}};

/* ---------- interaction-shelf demos ---------- */
const HEIGHTS=[['480','Short (480px)'],['640','Medium (640px)'],['800','Tall (800px)'],['100vh','Full screen']];
const inter={id:'x-interaction',name:'Interaction',group:'Interactions',desc:'A showpiece from the interactions shelf, embedded as a self-contained frame.',
 fields:[{k:'iid',label:'Interaction',type:'select',options:()=>IX().filter(x=>!/^sec-/.test(x.id)).map(x=>[x.id,x.t+' · '+x.cat]),def:'fan-deck'},
  {k:'kicker',label:'Kicker',type:'text',def:''},{k:'heading',label:'Heading',type:'text',def:''},{k:'intro',label:'Intro',type:'long',def:''},
  {k:'height',label:'Height',type:'select',options:()=>HEIGHTS,def:'640'},{k:'bleed',label:'Width',type:'select',options:()=>[['contained','Inside the page'],['full','Edge to edge']],def:'contained'}],
 render(v,ctx){const x=ix(v.iid)||{id:v.iid,t:v.iid};const cfg=ctx.cfg||{};const h=/^\d+$/.test(v.height)?v.height+'px':(v.height==='100vh'?'100vh':'640px');
  const src=ctx.interactionSrc(x.id,cfg,ctx.uid);const AR={'16/9':'16 / 9','4/3':'4 / 3','1/1':'1 / 1','3/4':'3 / 4','21/9':'21 / 9'};
  const W={narrow:'420px',medium:'640px',wide:'900px'};const al=cfg.al==='start'?'0 auto 0 0':cfg.al==='end'?'0 0 0 auto':'0 auto';
  const sty=[AR[cfg.ar]?'aspect-ratio:'+AR[cfg.ar]+';height:auto':'height:'+h,W[cfg.w]?'max-width:'+W[cfg.w]+';margin:'+al:''].filter(Boolean).join(';');
  const id=cfg.id&&/^[A-Za-z][\w-]*$/.test(cfg.id)?` id="${esc(cfg.id)}"`:'';
  return {html:`<section${id} class="${v.bleed==='full'?'x-ix x-full':'wrap x-ix'}${cfg.tr?' x-tr':''}">${HEAD(v)}<iframe class="x-frame" ${src} title="${esc(cfg.ttl||x.t)} (interactive demo)" loading="lazy" style="${sty}"></iframe></section>`,
   css:[['x-ix',`.x-ix iframe{display:block;width:100%;border:0;border-radius:calc(var(--radius) * 1.3);background:#0b0b0c;box-shadow:0 30px 70px -40px rgba(0,0,0,.6)}.x-ix.x-tr iframe{background:transparent;border-radius:0;box-shadow:none}.x-ix.x-full iframe{border-radius:0}.x-ix.x-full .x-head{padding:clamp(48px,8vh,90px) max(16px,4vw) 0;max-width:1180px;margin:0 auto 28px}`]]}}};

/* ---------- generated backgrounds ---------- */
const BG_RT=frag=>`window.__atlasBg=function(c,S,still){var g=c.getContext('webgl',{premultipliedAlpha:false});if(!g)return function(){};var F=${JSON.stringify(frag)},V='attribute vec2 v;void main(){gl_Position=vec4(v,0.,1.);}';
function sh(t,s){var o=g.createShader(t);g.shaderSource(o,s);g.compileShader(o);return o}var p=g.createProgram();g.attachShader(p,sh(g.VERTEX_SHADER,V));g.attachShader(p,sh(g.FRAGMENT_SHADER,F));g.linkProgram(p);g.useProgram(p);
g.bindBuffer(g.ARRAY_BUFFER,g.createBuffer());g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW);var L=g.getAttribLocation(p,'v');g.enableVertexAttribArray(L);g.vertexAttribPointer(L,2,g.FLOAT,false,0,0);
function u(n){return g.getUniformLocation(p,n)}function rgb(h){var n=parseInt(h.slice(1),16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]}var raf=0,t0=performance.now();
function f(){var d=Math.min(devicePixelRatio||1,2),w=c.clientWidth*d|0,h=c.clientHeight*d|0;if(c.width!==w||c.height!==h){c.width=w;c.height=h}g.viewport(0,0,w,h);g.uniform2f(u('R'),w,h);g.uniform1f(u('A'),still?0:(performance.now()-t0)/1000*Math.PI/6);
g.uniform1f(u('S'),S.seed);g.uniform1f(u('SC'),S.scale);g.uniform1f(u('WP'),S.warp);g.uniform1f(u('SF'),S.soft);g.uniform1f(u('GR'),S.grain);g.uniform1f(u('MO'),S.motion);g.uniform1f(u('GS'),Math.max(1,Math.min(w,h)/1080));g.uniform1i(u('M'),S.mode);
S.colors.forEach(function(x,i){g.uniform3fv(u('C'+i),rgb(x))});g.drawArrays(g.TRIANGLES,0,3);if(!still)raf=requestAnimationFrame(f)}f();var ro=new ResizeObserver(function(){if(still)f()});ro.observe(c);return function(){cancelAnimationFrame(raf);ro.disconnect()}};`;
PB.bgFrag=null; // filled from backgrounds.js by app.js (read-only)
const bgCSSFallback=s=>{const [c0,c1,c2,c3,c4]=s.colors;const pts=[[18,22],[82,18],[70,82],[24,78]];return `background-color:${c0};background-image:${[c1,c2,c3,c4].map((c,i)=>`radial-gradient(at ${pts[i][0]}% ${pts[i][1]}%,${c} 0,transparent ${Math.round(45+s.soft*25)}%)`).join(',')}`};
PB.bgFallback=bgCSSFallback;
const presetOf=key=>{const B=BGA();return B&&(B.ALL.find(p=>p.key===key)||B.ALL[0])};
const textOn=s=>{const L=PB.color.lum;const avg=s.colors.reduce((a,c)=>a+L(c),0)/s.colors.length;return avg<.32?'light':'dark'};
const bgHero={id:'x-background',name:'Background hero',group:'Media',desc:'A hero (or band) over a live generated background from the backgrounds library.',
 fields:[{k:'bg',label:'Background',type:'select',options:()=>(BGA()?BGA().ALL:[]).map(p=>[p.key,p.name+' · '+(BGA().FAMILIES[p.mode]||'')]),def:'velvet-0'},
  {k:'kicker',label:'Kicker',type:'text',def:'Made in your browser'},{k:'heading',label:'Headline',type:'text',def:'Colour that moves, quietly.'},
  {k:'intro',label:'Intro',type:'long',def:'A live background, drawn by one small shader and looping seamlessly. It holds still for anyone who prefers less motion.'},
  {k:'b1',label:'Main button',type:'text',def:'Get started'},{k:'b2',label:'Second button',type:'text',def:'Learn more'},
  {k:'size',label:'Size',type:'select',options:()=>[['hero','Hero (tall)'],['band','Band (medium)'],['strip','Strip (short, no text)']],def:'hero'}],
 render(v,ctx){const s=presetOf(v.bg);if(!s)return {html:NOTE('The backgrounds library has not loaded.')};
  const S={mode:s.mode,colors:s.colors,seed:s.seed,scale:s.scale,warp:s.warp,soft:s.soft,grain:s.grain,motion:s.motion};
  const live=!!PB.bgFrag;if(live){ctx.need('bg-rt',BG_RT(PB.bgFrag));ctx.need('pause-rt',PAUSE_RT)}
  const tone=textOn(s),strip=v.size==='strip';
  const text=strip?'':`<div class="x-bgc"><p class="k">${esc(v.kicker)}</p><h1 class="h">${esc(v.heading)}</h1>${v.intro?`<p class="x-intro">${esc(v.intro)}</p>`:''}<div class="x-row">${v.b1?`<a class="btn p" href="#">${esc(v.b1)}</a>`:''}${v.b2?`<a class="btn" href="#">${esc(v.b2)}</a>`:''}</div></div>`;
  return {html:`<section class="x-bg x-${esc(v.size||'hero')} x-on-${tone}" style="${bgCSSFallback(s)}"${strip?' aria-hidden="true"':''}>${live?'<canvas aria-hidden="true"></canvas>'+(strip?'':`<button class="x-ctrl" type="button" aria-label="Pause background">${PAUSE_SVG}</button>`):''}${text}</section>`,
   css:[['x-bg',`.x-bg{position:relative;overflow:hidden;isolation:isolate;display:grid;align-items:center}.x-bg.x-hero{min-height:min(88vh,820px)}.x-bg.x-band{min-height:420px}.x-bg.x-strip{min-height:180px}
.x-bg canvas{position:absolute;inset:0;width:100%;height:100%;z-index:-1;display:block}
.x-bgc{max-width:1180px;width:100%;margin:0 auto;padding:clamp(56px,10vh,110px) max(16px,4vw);display:grid;gap:18px;justify-items:start}
.x-bg h1{font-size:clamp(44px,7.4vw,104px);margin:0;max-width:14ch}.x-bg .x-intro{max-width:46ch;font-size:clamp(16px,1.6vw,19px)}
.x-on-light{color:#fff;text-shadow:0 1px 18px rgba(0,0,0,.35)}.x-on-light .k,.x-on-light .x-intro{color:#fff}.x-on-dark{color:#111;--line:rgba(0,0,0,.2)}.x-on-dark .k,.x-on-dark .x-intro{color:#111}
.x-bg .btn{text-shadow:none}.x-on-dark .btn:not(.p){background:rgba(255,255,255,.88);color:#111;border-color:transparent}.x-on-light .btn:not(.p){background:rgba(0,0,0,.38);color:#fff;border-color:rgba(255,255,255,.35)}.x-row{display:flex;gap:10px;flex-wrap:wrap}`]],
   js:live&&!strip?`var c=root.querySelector('canvas');__xPause(root.querySelector('.x-bg'),function(play){return __atlasBg(c,${JSON.stringify(S)},!play)});`:live?`__atlasBg(root.querySelector('canvas'),${JSON.stringify(S)},matchMedia('(prefers-reduced-motion: reduce)').matches);`:''}}};

/* ---------- theme-kit backgrounds and assets ---------- */
const kitOpts=()=>(TK()?TK().list:[]).map(k=>[k.id,(k.no?k.no+' · ':'')+k.name]);
const kitVars=k=>{const s=PB.styles&&PB.styles.has('kit:'+k.id)?PB.styles.get('kit:'+k.id):null;return s?s.vars:''};
const kitBg={id:'x-kitbg',name:'Kit background hero',group:'Kit assets',desc:'A hero over a theme kit’s animated signature background, wearing that kit’s colours and type.',
 fields:[{k:'kit',label:'Theme kit',type:'select',options:kitOpts,def:'synthwave'},{k:'kicker',label:'Kicker',type:'text',def:'Now playing'},
  {k:'heading',label:'Headline',type:'text',def:'Turn the volume up on your launch.'},{k:'intro',label:'Intro',type:'long',def:'A signature background drawn live on a canvas, with a pause button and a still frame for reduced motion.'},
  {k:'b1',label:'Main button',type:'text',def:'Get early access'},{k:'b2',label:'Second button',type:'text',def:'Watch the trailer'}],
 render(v,ctx){const T=TK(),k=kit(v.kit);if(!T||!k||!T.BG||!T.BG[k.bg])return {html:NOTE('The theme kits have not loaded.')};
  let fn;try{fn=T.BG[k.bg].toString().replace(/^\s*(?:async\s+)?\w+\s*\(/,'function(')}catch(e){return {html:NOTE('This kit’s background could not be exported.')}}
  ctx.need('kitbg:'+k.id,`window.__kitBg=window.__kitBg||{};window.__kitBg[${JSON.stringify(k.id)}]={T:${JSON.stringify(k.t)},draw:${fn}};`);ctx.need('pause-rt',PAUSE_RT);ctx.font(k.fonts&&k.fonts.css);
  return {html:`<section class="x-kb" style="${esc(kitVars(k))}"><canvas aria-hidden="true"></canvas><div class="x-kbs" aria-hidden="true"></div><button class="x-ctrl" type="button" aria-label="Pause background">${PAUSE_SVG}</button><div class="x-kbc"><p class="k">${esc(v.kicker)}</p><h1 class="h">${esc(v.heading)}</h1>${v.intro?`<p class="x-intro">${esc(v.intro)}</p>`:''}<div class="x-row">${v.b1?`<a class="btn p" href="#">${esc(v.b1)}</a>`:''}${v.b2?`<a class="btn" href="#">${esc(v.b2)}</a>`:''}</div></div></section>`,
   css:[['x-kb',`.x-kb{position:relative;min-height:min(88vh,820px);display:grid;align-items:end;overflow:hidden;isolation:isolate;background:var(--bg);color:var(--ink);font-family:var(--body)}
.x-kb canvas{position:absolute;inset:0;width:100%;height:100%;z-index:-2;display:block}.x-kbs{position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,var(--bg) 4%,color-mix(in srgb,var(--bg) 55%,transparent) 45%,transparent)}
.x-kbc{max-width:1180px;width:100%;margin:0 auto;padding:clamp(56px,10vh,110px) max(16px,4vw);display:grid;gap:18px;justify-items:start}.x-kb h1{font-size:clamp(44px,7.4vw,104px);margin:0;max-width:14ch}.x-kb .x-intro{max-width:46ch;color:var(--mute)}.x-row{display:flex;gap:10px;flex-wrap:wrap}`]],
   js:`var K=window.__kitBg[${JSON.stringify(k.id)}],c=root.querySelector('canvas');__xPause(root.querySelector('.x-kb'),function(play){try{return K.draw(c,K.T,!play)||function(){}}catch(e){return function(){}}});`}}};

const ASSETS=[['logo','Logo'],['mark','Mark'],['pattern','Pattern band'],['divider','Divider'],['icons','Icon set'],['palette','Colour palette']];
const svgURL=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s).replace(/'/g,'%27').replace(/\(/g,'%28').replace(/\)/g,'%29');PB.svgURL=svgURL;
const kitAsset={id:'x-kitasset',name:'Kit asset',group:'Kit assets',desc:'A logo, mark, pattern, divider, icon set or palette generated by a theme kit.',
 fields:[{k:'kit',label:'Theme kit',type:'select',options:kitOpts,def:'deco'},{k:'asset',label:'Asset',type:'select',options:()=>ASSETS,def:'pattern'},{k:'caption',label:'Caption',type:'text',def:''}],
 render(v,ctx){const T=TK(),k=kit(v.kit);if(!T||!k)return {html:NOTE('The theme kits have not loaded.')};let inner='',cls=v.asset||'pattern';const cap=v.caption?`<p class="x-cap">${esc(v.caption)}</p>`:'';
  try{if(cls==='logo'){inner=`<div class="x-ka-art" role="img" aria-label="${esc(k.name)} logo">${T.logo(k,false)}</div>`;ctx.font(k.fonts&&k.fonts.css)}
   else if(cls==='mark')inner=`<div class="x-ka-art" role="img" aria-label="${esc(k.name)} mark"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="160" height="160">${T.mark(k)}</svg></div>`;
   else if(cls==='pattern')return {html:`<section class="x-kp" style="background-image:url('${svgURL(T.pattern(k))}')" ${v.caption?'':'aria-hidden="true"'}>${v.caption?`<p class="x-kpc">${esc(v.caption)}</p>`:''}</section>`,css:[['x-kp',`.x-kp{min-height:240px;background-repeat:repeat;background-size:auto;display:grid;place-items:center;padding:40px 16px}.x-kpc{margin:0;padding:14px 22px;border-radius:var(--radius);background:var(--surface);color:var(--ink);font-family:var(--head);font-size:clamp(20px,2.6vw,30px);box-shadow:0 20px 40px -20px rgba(0,0,0,.5)}`]]};
   else if(cls==='divider')inner=`<div class="x-ka-div" aria-hidden="true">${T.divider(k).replace('<svg ','<svg preserveAspectRatio="xMidYMid meet" ')}</div>`;
   else if(cls==='icons'){const names=Object.keys(T.ICONS||{});inner=`<ul class="x-ka-ic">${names.map(n=>`<li>${T.icon(k,n,32,'currentColor').replace('<svg ','<svg aria-hidden="true" ')}<span>${esc(n)}</span></li>`).join('')}</ul>`}
   else if(cls==='palette'){const t=k.t;inner=`<ul class="x-ka-pal">${[['Background','bg'],['Surface','surface'],['Text','ink'],['Muted','mute'],['Line','line'],['Accent','accent'],['Accent 2','accent2'],['Accent 3','accent3']].filter(x=>t[x[1]]).map(([l,x])=>`<li><i style="background:${esc(t[x])}"></i><b>${l}</b><span>${esc(t[x])}</span></li>`).join('')}</ul>`}}
  catch(e){inner='<p class="x-missing">This asset could not be drawn.</p>'}
  return {html:`<section class="wrap x-ka x-ka-${esc(cls)}">${inner}${cap}</section>`,css:[['x-ka',`.x-ka{display:grid;justify-items:center;gap:14px;text-align:center}.x-ka-art svg{max-width:100%;height:auto}.x-ka-logo .x-ka-art svg{width:min(520px,90vw)}.x-cap{margin:0;color:var(--mute)}
.x-ka-div{width:100%}.x-ka-div svg{width:100%;height:28px;display:block}
.x-ka-ic{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px;width:100%}.x-ka-ic li{display:grid;justify-items:center;gap:8px;padding:16px 8px;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface);font-size:12px;color:var(--mute)}.x-ka-ic svg{color:var(--ink)}
.x-ka-pal{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;width:100%;text-align:left}.x-ka-pal li{border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;background:var(--surface);display:grid}.x-ka-pal i{height:70px}.x-ka-pal b{padding:8px 10px 0;font-size:13px}.x-ka-pal span{padding:0 10px 10px;font:12px ui-monospace,monospace;color:var(--mute)}`]]}}};

/* ---------- icon families ---------- */
PB.iconCache={};
const famOpts=()=>{const o=[['glyphs','Builder glyphs (stroke)']];Object.keys((window.PB_LIB&&PB_LIB.iconFiles)||{}).forEach(f=>o.push([f,f.replace(/-/g,' ')+' (icon files)']));(TK()?TK().list:[]).forEach(k=>o.push(['kit:'+k.id,k.name+' kit icons']));return o};
PB.iconNames=fam=>{if(fam==='glyphs')return Object.keys((window.PB_LIB&&PB_LIB.glyphs)||{});if(fam&&fam.startsWith('kit:')){const T=TK();return T?Object.keys(T.ICONS||{}):[]}const f=((window.PB_LIB&&PB_LIB.iconFiles)||{})[fam]||[];return f.map(x=>x.replace(/\.(svg|png)$/,''))};
PB.iconSVG=(fam,name,ctx)=>{const L=window.PB_LIB||{};
 if(fam==='glyphs'){const d=(L.glyphs||{})[name]||(L.glyphs||{}).spark;return `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`}
 if(fam&&fam.startsWith('kit:')){const T=TK(),k=kit(fam.slice(4));if(!T||!k)return '';const n=(T.ICONS||{})[name]?name:Object.keys(T.ICONS||{})[0];return T.icon(k,n,28,'currentColor').replace('<svg ','<svg aria-hidden="true" ')}
 const files=(L.iconFiles||{})[fam]||[];const file=files.find(f=>f.replace(/\.(svg|png)$/,'')===name)||files[0];if(!file)return '';
 if(file.endsWith('.png'))return `<img src="${ctx?ctx.site:''}icons/${esc(fam)}/${esc(file)}" alt="" width="32" height="32">`;
 const c=PB.iconCache[fam+'/'+file];if(c)return c;PB.loadIcon&&PB.loadIcon(fam,file);return `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><circle cx="12" cy="12" r="6" fill="currentColor" opacity=".25"/></svg>`};
const iconRow={id:'x-icons',name:'Icon features',group:'Icons',desc:'A row of features, each led by an icon from any icon family or theme kit.',
 fields:[{k:'family',label:'Icon family',type:'select',options:famOpts,def:'regular'},{k:'kicker',label:'Kicker',type:'text',def:'Why people stay'},{k:'heading',label:'Heading',type:'text',def:'Thoughtful details, everywhere.'},
  {k:'items',label:'Items (icon | title | text)',type:'list',def:'bell | Quiet alerts | One reminder the night before, never three in a row.\ncalendar-blank | Plans that bend | Move a dinner to Thursday and the list follows.\nheart | Favourites first | The dishes you cook most rise to the top.\nfolder | Everything filed | Recipes, lists and notes in one tidy place.'},
  {k:'style',label:'Icon style',type:'select',options:()=>[['tile','In a soft tile'],['bare','Bare'],['circle','Accent circle']],def:'tile'}],
 render(v,ctx){const names=PB.iconNames(v.family);const items=rows(v.items);
  return {html:`<section class="wrap x-ir x-ir-${esc(v.style||'tile')}">${HEAD(v)}<ul>${items.map((r,i)=>{const n=names.includes(r[0])?r[0]:names[i%Math.max(1,names.length)];return `<li><span class="x-ico">${PB.iconSVG(v.family,n,ctx)}</span><h3>${esc(r[1]||'')}</h3><p>${esc(r[2]||'')}</p></li>`}).join('')}</ul></section>`,
   css:[['x-ir',`.x-ir ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:22px}.x-ir li{display:grid;gap:8px;align-content:start}.x-ir h3{margin:6px 0 0;font-size:18px}.x-ir p{margin:0;color:var(--mute)}
.x-ico{width:56px;height:56px;display:grid;place-items:center;color:var(--accent-ink,var(--accent))}.x-ico svg,.x-ico img{width:30px;height:30px}.x-ir-tile .x-ico{border-radius:calc(var(--radius) * .8);background:color-mix(in srgb,var(--accent) 14%,var(--surface));border:1px solid var(--line)}.x-ir-circle .x-ico{border-radius:50%;background:var(--accent);color:var(--on-accent)}.x-ir-bare .x-ico{width:auto;height:auto;justify-content:start}`]]}}};

/* ---------- landing effects, films, type ---------- */
const effOpts=()=>(PB.effects||[]).map(e=>[e.id,e.id+' · '+e.title]);
const effect={id:'x-effect',name:'Landing effect clip',group:'Media',desc:'A short looping clip of a landing-page effect from the atlas, beside its notes. Good for a design showcase.',
 fields:[{k:'lid',label:'Effect',type:'select',options:effOpts,def:'L19'},{k:'kicker',label:'Kicker',type:'text',def:'Effect study'},{k:'heading',label:'Heading',type:'text',def:''},{k:'text',label:'Text',type:'long',def:''},
  {k:'side',label:'Clip side',type:'select',options:()=>[['left','Left'],['right','Right']],def:'left'}],
 render(v,ctx){const e=(PB.effects||[]).find(x=>x.id===v.lid)||(PB.effects||[])[0];if(!e)return {html:NOTE('The landing effects have not loaded.')};
  const src=e.film.src.replace(/^assets\//,''),poster=(e.film.poster||'').replace(/^assets\//,'');
  return {html:`<section class="wrap x-fx x-fx-${v.side==='right'?'r':'l'}"><div class="x-fxv"><video autoplay muted loop playsinline poster="${ctx.A}${esc(poster)}"><source src="${ctx.A}${esc(src)}" type="video/mp4"></video><button class="x-ctrl" type="button" aria-label="Pause clip">${PAUSE_SVG}</button></div><div><p class="k">${esc(v.kicker)}</p><h2 class="h">${esc(v.heading||e.title)}</h2><p class="x-intro">${esc(v.text||e.desc+' '+(e.cues||''))}</p></div></section>`,
   css:[['x-fx',`.x-fx{display:grid;grid-template-columns:1.2fr 1fr;gap:clamp(24px,5vw,64px);align-items:center}.x-fx-r .x-fxv{order:2}.x-fxv{position:relative;border-radius:calc(var(--radius) * 1.4);overflow:hidden;background:var(--surface);aspect-ratio:16/10}.x-fxv video{width:100%;height:100%;object-fit:cover;display:block}.x-fx .h{font-size:clamp(30px,3.6vw,48px);margin:10px 0 12px}@media (max-width:760px){.x-fx{grid-template-columns:1fr}.x-fx-r .x-fxv{order:0}}`]],js:VIDEO_JS}}};
const VIDEO_JS=`root.querySelectorAll('.x-ctrl').forEach(function(b){var v=b.parentNode.querySelector('video');if(!v)return;function st(p){if(p){v.play().catch(function(){});b.innerHTML=${JSON.stringify(PAUSE_SVG)};b.setAttribute('aria-label','Pause film')}else{v.pause();b.innerHTML=${JSON.stringify(PLAY_SVG)};b.setAttribute('aria-label','Play film')}}if(matchMedia('(prefers-reduced-motion: reduce)').matches){v.removeAttribute('autoplay');st(false)}b.onclick=function(){st(v.paused)}});`;
const filmBand={id:'x-film',name:'Film band',group:'Media',desc:'A full-width looping film with a short caption laid over it.',
 fields:[{k:'film',label:'Film',type:'film',def:'suminagashi'},{k:'caption',label:'Caption',type:'text',def:'Ink, water and one breath.'},{k:'height',label:'Height',type:'select',options:()=>[['60vh','60% of the screen'],['80vh','80% of the screen'],['420px','420px']],def:'60vh'}],
 render(v,ctx){const f=esc(v.film||'suminagashi');return {html:`<section class="x-fb" style="height:${/^\d+(vh|px)$/.test(v.height)?v.height:'60vh'}"><video autoplay muted loop playsinline poster="${ctx.A}films/${f}.jpg"><source src="${ctx.A}films/${f}-720.mp4" type="video/mp4"><source src="${ctx.A}films/${f}-720.webm" type="video/webm"></video><button class="x-ctrl" type="button" aria-label="Pause film">${PAUSE_SVG}</button>${v.caption?`<p class="h">${esc(v.caption)}</p>`:''}</section>`,
  css:[['x-fb',`.x-fb{position:relative;overflow:hidden;min-height:300px;display:grid;align-items:end}.x-fb video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.x-fb::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.6),transparent 55%)}.x-fb p{position:relative;z-index:1;margin:0;padding:0 max(16px,4vw) clamp(28px,5vh,56px);color:#fff;font-size:clamp(28px,4vw,56px);max-width:20ch}`]],js:VIDEO_JS}}};
const typeSpec={id:'x-type',name:'Type specimen',group:'Fonts',desc:'Shows the page’s heading and body fonts with a sample, a scale and the alphabet. Change the pairing in Style.',
 fields:[{k:'kicker',label:'Kicker',type:'text',def:'Typography'},{k:'sample',label:'Sample headline',type:'text',def:'Quietly confident, never loud.'},{k:'para',label:'Sample paragraph',type:'long',def:'Good type disappears into reading. These two families share the work: one sets the voice in headlines, the other carries everything else, at a size that is easy on the eyes for a long time.'}],
 render(v,ctx){return {html:`<section class="wrap x-ty"><p class="k">${esc(v.kicker)}</p><div class="x-tyg"><div class="x-tya"><span class="h" aria-hidden="true">Aa</span><b>Headings</b><span class="x-tyf" data-font="head"></span></div><div><p class="h x-tys">${esc(v.sample)}</p><p class="x-typ">${esc(v.para)}</p><p class="x-tyal" aria-hidden="true">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz 0123456789 &amp;?!</p><ol class="x-tysc" aria-label="Type scale">${[64,44,30,21,16].map(s=>`<li><span>${s}px</span><span class="h" style="font-size:${s}px">Seasonal</span></li>`).join('')}</ol></div></div></section>`,
  css:[['x-ty',`.x-tyg{display:grid;grid-template-columns:260px 1fr;gap:clamp(24px,5vw,64px);margin-top:18px}.x-tya{display:grid;align-content:start;gap:6px;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface);padding:24px}.x-tya .h{font-size:120px;line-height:1}.x-tya b{font-size:14px}.x-tyf{color:var(--mute);font-size:14px}.x-tys{font-size:clamp(36px,5vw,68px);margin:0 0 16px}.x-typ{font-size:18px;max-width:60ch;margin:0 0 18px}.x-tyal{font-size:20px;letter-spacing:.04em;color:var(--mute);margin:0 0 20px;word-break:break-all}
.x-tysc{list-style:none;margin:0;padding:0;display:grid;gap:4px;border-top:1px solid var(--line)}.x-tysc li{display:flex;gap:16px;align-items:baseline;border-bottom:1px solid var(--line);padding:6px 0;overflow:hidden;white-space:nowrap}.x-tysc li>span:first-child{flex:0 0 44px;color:var(--mute);font-size:12px}@media (max-width:760px){.x-tyg{grid-template-columns:1fr}}`]],
  js:`var f=getComputedStyle(document.documentElement).getPropertyValue('--head').split(',')[0].replace(/['"]/g,'').trim();var e=root.querySelector('[data-font]');if(e)e.textContent=f;`}}};

const notFound={id:'x-notfound',name:'Page not found',group:'Content',desc:'The 404 page.',
 fields:[{k:'title',label:'Heading',type:'text',def:'This page has wandered off'},{k:'text',label:'Text',type:'long',def:''},{k:'button',label:'Button',type:'text',def:'Back to the home page'}],
 render(v,ctx){return {html:`<section class="wrap x-nf"><p class="k">404</p><h1 class="h">${esc(v.title)}</h1><p class="x-intro">${esc(v.text)}</p><p><a class="btn p" href="${esc(ctx.home||'index.html')}">${esc(v.button)}</a></p></section>`,css:[['x-nf','.x-nf{min-height:60vh;display:grid;align-content:center;gap:14px;justify-items:start}.x-nf .h{font-size:clamp(40px,7vw,96px);margin:0}']]}}};
const postList={id:'x-posts',name:'Latest posts',group:'Content',desc:'Lists the blog posts of this site automatically, newest first, each linking to its own page. Add posts with “Add a blog post” in the Outline tab.',
 fields:[{k:'kicker',label:'Kicker',type:'text',def:'Journal'},{k:'heading',label:'Headline',type:'text',def:'Latest posts.'},{k:'count',label:'How many',type:'select',options:()=>[['3','The latest 3'],['6','The latest 6'],['12','The latest 12'],['100','All of them']],def:'6'}],
 render(v,ctx){const S=PB.site,list=ctx.siteData?S.posts(ctx.siteData).slice(0,+v.count||6):[];
  const cov=i=>/^user:[\w-]+$/.test(i||'')?'\u0002U:'+i.slice(5)+'\u0002':/^https?:\/\//.test(i||'')?esc(i):ctx.A+esc(i||'films/smoke-plume.jpg');
  const li=list.map(p=>{const b=p.blocks.find(x=>x.id==='blog-post'),x=(b&&b.vals)||{},ex=String(x.paras||'').split('\n').find(l=>l.trim()&&!/^(#|>|-|!)/.test(l.trim()))||'';
   return `<li><a class="x-pc" href="${esc(ctx.pageHref(p))}"><span class="x-pi"><img src="${cov(x.img)}" alt="${esc(x.alt||x.heading||p.name)}" loading="lazy"></span><span class="x-pm"><b>${esc(x.tag||'')}</b>${esc(x.date||'')}</span><span class="x-pt">${esc(x.heading||p.name)}</span><span class="x-pe">${esc(ex.slice(0,120))}</span></a></li>`}).join('');
  return {html:`<section class="wrap x-pl"><p class="k">${esc(v.kicker)}</p><h2 class="h">${esc(v.heading)}</h2>${li?`<ul>${li}</ul>`:'<p class="x-empty">No posts yet. Use “Add a blog post” in the Outline tab and they will appear here.</p>'}</section>`,
   css:[['x-pl','.x-pl h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 30px}.x-pl ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px}.x-pc{display:grid;gap:8px;color:inherit;text-decoration:none}.x-pi{display:block;aspect-ratio:16/10;border-radius:var(--radius);overflow:hidden;background:var(--surface)}.x-pi img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}.x-pc:hover .x-pi img{transform:scale(1.03)}.x-pm{font-size:13px;color:var(--mute)}.x-pm b{color:var(--accent-ink,var(--accent));margin-right:8px;font-weight:600}.x-pt{font:600 20px/1.25 var(--head);letter-spacing:var(--track)}.x-pe{color:var(--mute);font-size:15px}.x-pc:focus-visible{outline:2px solid var(--accent);outline-offset:4px}.x-empty{color:var(--mute)}@media (prefers-reduced-motion:reduce){.x-pi img{transition:none}}']]}}};
PB.extraTypes=[postList,comp,inter,bgHero,kitBg,kitAsset,iconRow,effect,filmBand,typeSpec,notFound];
PB.extraById=Object.fromEntries(PB.extraTypes.map(t=>[t.id,t]));
})();
