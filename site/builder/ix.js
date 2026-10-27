'use strict';
/* Page builder, interactions. Each interaction is a standalone demo page. PB.ix rewrites the demo for one placed instance:
   it can take away the demo's own backdrop so the page shows through, borrow the page's text colours, change the accent,
   speed the motion up or down, pause it until it is hovered or on screen, and calm it. The result is a plain HTML document
   (no builder code): it goes into the preview and the export as srcdoc or as its own file. */
(()=>{
const PB=window.PB=window.PB||{};
const IX=PB.ix={raw:{},pending:{}};
const HEX=/^#[0-9a-f]{6}$/i;
const clamp=(v,a,b,d)=>{v=+v;return Number.isFinite(v)?Math.max(a,Math.min(b,v)):d};
const parseVars=s=>{const o={};String(s||'').split(';').forEach(d=>{const i=d.indexOf(':');if(i>0)o[d.slice(0,i).trim()]=d.slice(i+1).trim()});return o};
/* colour setting ('', 'tok:accent', '#rrggbb') -> a real colour, using the page's own values */
const colour=(v,vars)=>{if(!v)return '';if(HEX.test(v))return v;const m=/^tok:(\w+)$/.exec(v);if(!m)return '';const map={accent:'--accent',ink:'--ink',mute:'--mute',surface:'--surface',bg:'--bg',line:'--line'};return vars[map[m[1]]]||''};
const dark=(vars)=>{const cs=(vars['color-scheme']||'').trim();if(cs==='dark'||cs==='light')return cs==='dark';return PB.color&&vars['--bg']&&HEX.test(vars['--bg'])?PB.color.lum(vars['--bg'])<.2:false};
IX.active=cfg=>{cfg=cfg||{};return !!(cfg.tr||cfg.ac||cfg.tc||(cfg.sp&&+cfg.sp!==100)||(cfg.pl&&cfg.pl!=='always')||cfg.calm||cfg.nohint)};
/* the document for one placed instance */
IX.build=(html,o)=>{const cfg=o.cfg||{},vars=o.vars||{},tr=!!cfg.tr,sp=clamp(cfg.sp,10,300,100)/100;
 const ink=colour(cfg.tc,vars)||(tr?vars['--ink']:''),mute=cfg.tc?`color-mix(in srgb,${ink} 62%,transparent)`:(tr?vars['--mute']:''),acc=colour(cfg.ac,vars);
 const P={tr:tr?1:0,sp,pl:cfg.pl||'always',calm:cfg.calm?1:0};
 let css='';
 if(tr||ink||acc){css+=':root{';if(tr)css+='--bg:transparent;--surface:transparent;';if(ink)css+='--ink:'+ink+';--ink-2:'+ink+';';if(mute)css+='--mute:'+mute+';';if(acc)css+='--accent:'+acc+';';if(tr)css+='color-scheme:'+(dark(vars)?'dark':'light')+';';css+='}'}
 if(tr)css+='html,body{background:none!important;background-color:transparent!important}canvas{background:none!important}.scrim{display:none!important}';
 if(tr&&FIX[o.id])css+=FIX[o.id];
 if(tr&&ink)css+='html,body{color:'+ink+'}';
 if(cfg.nohint)css+='.cap,.hint,.tip,.legend,.scrim{display:none!important}';
 if(cfg.calm)css+='*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition:none!important}';
 const rt='(function(){var P='+JSON.stringify(P)+';window.__IXP=P;'+RUNTIME+'})();';
 const head='<style>'+css+'</style>';
 const early='<script>'+rt.replace(/<\/script/gi,'<\\/script')+'<\/script>';
 let out=html;
 /* the runtime must run before the demo's own scripts, the style after the demo's own style */
 out=/<head[^>]*>/i.test(out)?out.replace(/<head[^>]*>/i,m=>m+early):early+out;
 out=/<\/head>/i.test(out)?out.replace(/<\/head>/i,head+'</head>'):head+out;
 return out};
/* demos whose backdrop is a glow on an inner element rather than the page */
const FIX={'scroll-scrub':'.sticky{background:none!important}','status-header':'.hero{background:none!important}','telemetry-feeds':'main{background:none!important}'};
const RUNTIME=String.raw`
var rn=performance.now.bind(performance),dn=Date.now.bind(Date),T0=rn(),D0=dn(),acc=0,last=T0,scale=P.sp,paused=false,run=true;
function vt(){var r=rn();if(!paused)acc+=(r-last)*scale;last=r;return T0+acc}
if(P.sp!==1||P.pl!=='always'){
 performance.now=function(){return vt()};Date.now=function(){return D0+(vt()-T0)};
 var raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=function(f){return raf(function(){if(paused){return window.requestAnimationFrame(f)}f(vt())})};
 var si=window.setInterval.bind(window),st=window.setTimeout.bind(window);
 window.setInterval=function(f,d){var a=[].slice.call(arguments,2);return si(function(){if(!paused)f.apply(null,a)},Math.max(1,(d||0)/P.sp))};
 window.setTimeout=function(f,d){var a=[].slice.call(arguments,2);return st(function(){f.apply(null,a)},Math.max(0,(d||0)/P.sp))};
}
function anims(){try{document.getAnimations().forEach(function(a){a.updatePlaybackRate(paused?0:P.sp)})}catch(e){}}
function setPaused(p){if(p===paused)return;vt();paused=p;anims()}
if(P.sp!==1||P.pl!=='always'){setInterval(anims,400);document.addEventListener('animationstart',anims,true)}
if(P.calm){var mm=window.matchMedia.bind(window);window.matchMedia=function(q){var r=mm(q);if(/prefers-reduced-motion/.test(q)){var red=!/no-preference/.test(q);return {matches:red,media:q,onchange:null,addListener:function(){},removeListener:function(){},addEventListener:function(){},removeEventListener:function(){},dispatchEvent:function(){return false}}}return r}}
if(P.pl==='hover'){window.addEventListener('load',function(){setTimeout(function(){setPaused(true)},700);var d=document.documentElement;d.addEventListener('pointerenter',function(){setPaused(false)});d.addEventListener('pointerleave',function(){setPaused(true)});d.addEventListener('focusin',function(){setPaused(false)})})}
if(P.pl==='visible'){window.addEventListener('load',function(){try{new IntersectionObserver(function(e){setPaused(!e[e.length-1].isIntersecting)}).observe(document.documentElement)}catch(x){}})}

if(P.tr){
 function rgb(c){var m=/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+))?/.exec(c||'');return m?[+m[1],+m[2],+m[3],m[4]==null?1:+m[4]]:null}
 function lum(c){var a=c.slice(0,3).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]}
 function ratio(a,b){var x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
 /* a panel that keeps its own colour needs text that reads on it, whatever the page's text colour is */
 function fix(){var nt=document.createElement('style');nt.textContent='*{transition:none!important}';document.head.appendChild(nt);try{var els=document.body.querySelectorAll('*'),n=0;for(var i=0;i<els.length&&n<4000;i++,n++){var e=els[i];if(e.__ixf)continue;var cs=getComputedStyle(e),bg=rgb(cs.backgroundColor);if(!bg||bg[3]<.6)continue;var fg=rgb(cs.color);if(!fg||ratio(fg,bg)>=4)continue;
  var r=e.getBoundingClientRect();if(r.width<24||r.height<14)continue;
  e.__ixf=1;var c=lum(bg)>.4?'#15171b':'#f4f5f7';e.style.setProperty('--ink',c);e.style.setProperty('--bg',cs.backgroundColor);e.style.setProperty('--mute','color-mix(in srgb,'+c+' 62%,transparent)');var b2=rgb(getComputedStyle(e).backgroundColor);e.style.color=b2&&b2[3]>.5?(lum(b2)>.4?'#15171b':'#f4f5f7'):c}}catch(x){}getComputedStyle(document.body).color;setTimeout(function(){nt.remove()},60)}
 window.addEventListener('load',function(){fix();setTimeout(fix,500);setTimeout(fix,1800)});
}
`;
/* raw demos: fetched once, assets made absolute */
IX.url=id=>new URL('interactions/demos/'+id+'.html',location.href).href;
IX.load=id=>{if(IX.raw[id]!=null)return Promise.resolve(IX.raw[id]);if(IX.pending[id])return IX.pending[id];
 return IX.pending[id]=fetch(IX.url(id)).then(r=>r.ok?r.text():null).then(t=>{if(t)IX.raw[id]=t;delete IX.pending[id];return IX.raw[id]||null}).catch(()=>{delete IX.pending[id];return null})};
IX.vars=parseVars;
})();
