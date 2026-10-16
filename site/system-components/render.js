'use strict';
/* Live design-system components. Each system file calls SysComponents.add({system, fonts, css, items}); every
   component renders inside its own shadow root so the atlas theme never leaks in, and sits on the page with no
   backdrop of its own unless the component itself has a surface. */
window.SysComponents=window.SysComponents||{systems:{},img:new URL('img/',document.currentScript?.src||location.href).href,
 html(it){return it.html.replaceAll('{{img}}/',this.img);},
 add(s){this.systems[s.system]=s;},
 has(id){return !!this.item(id)[1];},
 item(id){for(const s of Object.values(this.systems))if(s.items&&s.items[id])return [s,s.items[id]];return [];},
 fonts(s){if(!s.fonts||!s.fonts.length||document.querySelector(`link[data-sc-font="${s.system}"]`))return;const l=document.createElement('link');l.rel='stylesheet';l.dataset.scFont=s.system;l.href='https://fonts.googleapis.com/css2?'+s.fonts.map(f=>'family='+f).join('&')+'&display=swap';document.head.append(l);},
 BASE:':host{display:block;width:100%;height:100%}*,*::before,*::after{box-sizing:border-box}.scStage{position:relative;width:100%;height:100%;overflow:hidden}.scStage:not(.isNatural)>.sc{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}.scStage.isNatural{overflow:visible;height:auto;display:flex;justify-content:safe center}.sc{transform-origin:center;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}button,input,select,textarea{font:inherit;color:inherit}button{background:none;border:0;padding:0;cursor:pointer}a{color:inherit}img,svg{display:block}@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}}',
 /* mount(host, id, {fit:true}) scales the component down to fit host; without fit it renders at natural size */
 mount(host,id,opt={}){const [s,it]=this.item(id);if(!it)return false;this.fonts(s);const root=host.shadowRoot||host.attachShadow({mode:'open'});
  root.innerHTML=`<style>${this.BASE}${s.css||''}${it.css||''}</style><div class="scStage${opt.fit?'':' isNatural'}"><div class="sc sc-${s.system}" style="width:${it.w?it.w+'px':'auto'}">${this.html(it)}</div></div>`;
  const sc=root.querySelector('.sc');if(it.init)try{it.init(sc);}catch(e){console.error(e);}
  if(!opt.fit){const nat=()=>{sc.style.zoom='';const bw=host.clientWidth,w=sc.offsetWidth;if(bw&&w>bw)sc.style.zoom=(bw/w).toFixed(4);};nat();if(!host._scRO&&window.ResizeObserver){host._scRO=new ResizeObserver(nat);host._scRO.observe(host);}document.fonts?.ready.then(nat);}
  if(opt.fit){const go=()=>{sc.style.transform='translate(-50%,-50%)';const bw=host.clientWidth,bh=host.clientHeight,w=sc.offsetWidth,h=sc.offsetHeight;if(!w||!h||!bw)return;const k=Math.min(1,(bw-8)/w,(bh-8)/h);sc.style.transform=`translate(-50%,-50%) scale(${k})`;};go();
   if(!host._scRO&&window.ResizeObserver){host._scRO=new ResizeObserver(go);host._scRO.observe(host);}document.fonts?.ready.then(go);}
  return true;},
 /* a standalone snippet: the system's CSS, the component, and its small script when it has one */
 code(id){const [s,it]=this.item(id);if(!it)return '';const css=((s.css||'')+'\n'+(it.css||'')).trim();
  const font=s.fonts&&s.fonts.length?`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${s.fonts.map(f=>'family='+f).join('&')}&display=swap">\n`:'';
  return `${font}<style>\n*,*::before,*::after{box-sizing:border-box}\n${css}\n</style>\n<div class="sc sc-${s.system}"${it.w?` style="max-width:${it.w}px"`:''}>\n${this.html(it).trim()}\n</div>${it.init?`\n<script>(${it.init.toString()})(document.currentScript.previousElementSibling);</script>`:''}`;}
};
