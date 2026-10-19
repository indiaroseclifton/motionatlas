'use strict';
/* 01 Design System · documentation runtime.
   Builds the shared chrome (top bar, sidebar, on-page contents, pager, footer), the site search,
   live example frames with a Code tab, copyable code blocks, and the helpers pages use
   (tokens from the real CSS, icon names from the real 01-ui.js, a stored ZIP writer, copy and save).
   Needs ../work/01/01.js and ../work/01/01-ui.js loaded first; search-index.js is optional. */
window.DS=(()=>{
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const VERSION='v1.0',HOST='https://motionatlas-ten.vercel.app';
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 /* ---------- site map: one source for sidebar, pager and search ---------- */
 const NAV=[
  ['Get started',[['start','Overview'],['resources','Downloads & kit'],['changelog','Changelog'],['contribute','Contribute']]],
  ['Foundations',[['colour','Colour'],['type','Typography'],['layout','Layout & space'],['motion','Motion'],['sound','Sound'],['iconography','Iconography'],['illustration','Illustration'],['voice','Voice & tone'],['logo','Logo']]],
  ['Components',[['components','All components'],['components-buttons','Buttons'],['components-forms','Forms'],['components-data','Data display'],['components-feedback','Feedback'],['components-navigation','Navigation'],['components-overlays','Overlays'],['components-chat','Chat'],['components-shell','Shell & layout']]],
  ['Patterns & kits',[['patterns','Patterns'],['templates','Templates'],['directions','Home directions'],['kits','Direction kits'],['brand-kit','Brand Kit v2 ↗','../work/01/brand-kit.html']]]
 ];
 const FLAT=NAV.flatMap(([g,items])=>items.map(([id,label,href])=>({id,label,group:g,href:href||id+'.html'})));
 const page=document.body.dataset.page||'';
 const I=n=>window.UI?UI.icon(n):'';
 /* ---------- small helpers ---------- */
 function toast(t,m,k){if(window.UI)UI.toast(t,m||'',k||'')}
 async function copy(text,what='Copied'){
  try{await navigator.clipboard.writeText(text);toast(what,'It is on your clipboard.','ok');return true}
  catch(e){const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;left:-9999px';document.body.append(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}ta.remove();toast(ok?what:'Copy blocked',ok?'It is on your clipboard.':'Select the text and press Ctrl+C.',ok?'ok':'warn');return ok}}
 function save(blob,name){const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
 /* stored (uncompressed) ZIP writer, after the one in kits/themes.js */
 const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
 function crc32(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRC[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0}
 function zipBytes(files){const enc=new TextEncoder(),parts=[],central=[];let off=0;const d=new Date(),time=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),date=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate();
  for(const [name,data] of files){const n=enc.encode(name),b=typeof data==='string'?enc.encode(data):data,crc=crc32(b);
   const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint16(10,time,true);h.setUint16(12,date,true);h.setUint32(14,crc,true);h.setUint32(18,b.length,true);h.setUint32(22,b.length,true);h.setUint16(26,n.length,true);h.setUint16(28,0,true);
   parts.push(new Uint8Array(h.buffer),n,b);
   const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(10,0,true);c.setUint16(12,time,true);c.setUint16(14,date,true);c.setUint32(16,crc,true);c.setUint32(20,b.length,true);c.setUint32(24,b.length,true);c.setUint16(28,n.length,true);c.setUint32(42,off,true);
   central.push(new Uint8Array(c.buffer),n);off+=30+n.length+b.length}
  const csize=central.reduce((a,x)=>a+x.length,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,csize,true);e.setUint32(16,off,true);
  return [...parts,...central,new Uint8Array(e.buffer)]}
 const zip=files=>new Blob(zipBytes(files),{type:'application/zip'});
 async function fetchText(u){const r=await fetch(u);if(!r.ok)throw new Error(r.status+' '+u);return r.text()}
 async function fetchBytes(u){const r=await fetch(u);if(!r.ok)throw new Error(r.status+' '+u);return new Uint8Array(await r.arrayBuffer())}
 /* ---------- colour maths ---------- */
 function rgb(c){c=String(c).trim();if(c[0]==='#'){if(c.length===4)c='#'+[...c.slice(1)].map(x=>x+x).join('');return [1,3,5].map(i=>parseInt(c.slice(i,i+2),16))}const m=c.match(/[\d.]+/g);return m?m.slice(0,3).map(Number):[0,0,0]}
 function lum(c){return rgb(c).map(v=>v/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0)}
 function contrast(a,b){const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
 function grade(r){return r>=7?'AAA':r>=4.5?'AA':r>=3?'AA large':'Fail'}
 const cssVar=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
 /* ---------- tokens, read from the real stylesheets ---------- */
 let _tok=null;
 async function tokens(){if(_tok)return _tok;const out=[];
  for(const [file,src] of [['01.css','../work/01/01.css'],['01-ui.css','../work/01/01-ui.css']]){let css='';try{css=await fetchText(src)}catch(e){continue}
   css=css.replace(/\/\*[\s\S]*?\*\//g,'');const re=/(:root|\.u-dense)\s*\{([^}]*)\}/g;let m;
   while((m=re.exec(css))){const scope=m[1];let depth=0,cur='';const decl=[];for(const ch of m[2]){if(ch==='(')depth++;if(ch===')')depth--;if(ch===';'&&!depth){decl.push(cur);cur=''}else cur+=ch}decl.push(cur);
    decl.forEach(d=>{const i=d.indexOf(':');if(i<0)return;const name=d.slice(0,i).trim(),value=d.slice(i+1).trim();if(name.startsWith('--'))out.push({name,value,file,scope})})}}
  _tok=out;return out}
 function group(n){if(/^--g-/.test(n))return 'graphite';if(/^--pt/.test(n))return 'platinum';if(/^--(cyan|green|purple|amber|red)/.test(n))return 'signal';if(/^--(bg|surface|raised|line|ink|mute|accent|panel|hover|select|focus)/.test(n))return 'role';if(/^--(f-|t-)/.test(n))return 'type';if(/^--(e-|d-)/.test(n))return 'motion';return 'space'}
 function tokensCSS(list){const by={};list.forEach(t=>{(by[t.scope]=by[t.scope]||[]).push(t)});
  return `/* 01 Design System ${VERSION} · tokens\n   Generated from 01.css and 01-ui.css on ${new Date().toISOString().slice(0,10)}.\n   Source: ${HOST}/ds/resources */\n@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');\n`+
   Object.entries(by).map(([scope,ts])=>`${scope}{\n${ts.map(t=>`  ${t.name}: ${t.value};`).join('\n')}${scope===':root'?'\n  color-scheme: dark;':''}\n}`).join('\n')+'\n'}
 function tokensJSON(list){const o={$schema:'01-design-system/tokens',version:VERSION,generated:new Date().toISOString().slice(0,10)};
  list.forEach(t=>{const g=t.scope===':root'?group(t.name):'dense';(o[g]=o[g]||{})[t.name.slice(2)]={value:t.value,css:`var(${t.name})`,source:t.file}});return JSON.stringify(o,null,2)+'\n'}
 /* ---------- icon names, read from the real 01-ui.js ---------- */
 let _icons=null;
 async function iconNames(){if(_icons)return _icons;try{const js=await fetchText('../work/01/01-ui.js');const blk=js.slice(js.indexOf('const P={'),js.indexOf('};',js.indexOf('const P={')));const n=[...blk.matchAll(/(?:^|[,{\s])([a-zA-Z][\w]*):'/g)].map(m=>m[1]);if(n.length)return _icons=[...new Set(n)]}catch(e){}
  return _icons=['chat','agents','skills','models','plug','settings','search','plus','home','tasks','clients','inbox','chart','bolt','file','play','pause','close','more','arrow','check','warn','user','logout','command','menu','globe','shield','clock','filter','send','attach','mic','sliders','grid','layers','bell','route','spark','copy','refresh','doc','briefcase','calendar','star','eye','lock']}
 const iconSVG=n=>(window.UI?UI.icon(n):'').replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ').replace(' aria-hidden="true"','');
 /* ---------- code: dedent + tiny highlighter ---------- */
 function dedent(s){s=s.replace(/^\s*\n/,'').replace(/\s+$/,'');const lines=s.split('\n');const ind=Math.min(...lines.filter(l=>l.trim()).map(l=>l.match(/^ */)[0].length));return lines.map(l=>l.slice(ind)).join('\n')}
 function hl(src,lang='html'){let re,cls;
  if(lang==='html'){re=/(<!--[\s\S]*?-->)|(<\/?[\w-]+)|("[^"]*")|(\/?>)|([\w:@-]+)(?==)/g;cls=['c','t','s','t','a']}
  else{re=/(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|('[^'\n]*'|"[^"\n]*"|`[^`]*`)|(--[\w-]+)|\b(const|let|var|function|return|new|await|async|if|else|for|of|import|from|export|true|false|null)\b|(#[0-9A-Fa-f]{3,8}\b|\b\d+(?:\.\d+)?(?:px|ms|s|%|vw|vh)?\b)/g;cls=['c','s','a','k','n']}
  let out='',last=0,m;while((m=re.exec(src))){out+=esc(src.slice(last,m.index));const gi=m.slice(1).findIndex(x=>x!==undefined);out+=`<span class="tk-${cls[gi]}">${esc(m[0])}</span>`;last=m.index+m[0].length;if(!m[0].length)re.lastIndex++}
  return out+esc(src.slice(last))}
 let uid=0;
 function codeBlock(pre){const lang=pre.dataset.lang||'html';const src=dedent(pre.textContent);pre.classList.add("ds-pre");pre.tabIndex=0;pre.setAttribute("role","region");pre.innerHTML=`<code>${hl(src,lang)}</code>`;
  const wrap=document.createElement('div');wrap.className='ds-code';pre.before(wrap);
  const bar=document.createElement('div');bar.className='ds-lang';bar.innerHTML=`<span>${esc(pre.dataset.title||lang)}</span><button class="u-btn ghost sm ds-copy" type="button">${I('copy')}Copy</button>`;
  wrap.append(bar,pre);if(!pre.getAttribute('aria-label'))pre.setAttribute('aria-label',(pre.dataset.title||lang)+' code');bar.querySelector('button').onclick=()=>copy(src,'Code copied')}
 function example(ex){const stage=$('.ds-stage',ex)||ex;const n=++uid;const name=ex.dataset.name||'Example';
  const srcEl=ex.dataset.src&&document.querySelector(ex.dataset.src);
  const raw=srcEl?srcEl.textContent:stage.innerHTML.replace(/ data-ds-[\w-]+="[^"]*"/g,'');const src=dedent(raw.replace(/=""/g,''));
  const bar=document.createElement('div');bar.className='ds-ex-bar';
  bar.innerHTML=`<div data-tabs><div class="u-tabs" role="tablist" aria-label="${esc(name)}"><button role="tab" type="button" id="dsx${n}a" aria-selected="true" aria-controls="dsx${n}p">Preview</button><button role="tab" type="button" id="dsx${n}b" aria-selected="false" aria-controls="dsx${n}c" tabindex="-1">Code</button></div></div><span class="ds-ex-name">${esc(name)}</span>`;
  const tabsEl=bar.firstElementChild;ex.prepend(bar);
  /* move the tabs wrapper so [data-tabs] contains tablist only; panels are found by id */
  stage.id='dsx'+n+'p';stage.setAttribute('role','tabpanel');stage.setAttribute('aria-labelledby','dsx'+n+'a');
  const pane=document.createElement('div');pane.className='ds-codepane';pane.id='dsx'+n+'c';pane.setAttribute('role','tabpanel');pane.setAttribute('aria-labelledby','dsx'+n+'b');pane.hidden=true;
  const lang=ex.dataset.lang||'html';
  pane.innerHTML=`<button class="u-btn ghost sm ds-copy" type="button">${I('copy')}Copy</button><pre class="ds-pre" tabindex="0" role="region" aria-label="${esc(name)} markup"><code>${hl(src,lang)}</code></pre>`;
  ex.append(pane);$('.ds-copy',pane).onclick=()=>copy(src,'Markup copied');return tabsEl}
 /* ---------- chrome ---------- */
 function chrome(){const main=$('main');if(!main)return;main.id=main.id||'main';main.classList.add('ds-main');main.tabIndex=-1;
  const cur=FLAT.find(p=>p.id===page);
  const skip=document.createElement('a');skip.className='skip';skip.href='#'+main.id;skip.textContent='Skip to content';
  const top=document.createElement('header');top.className='ds-top';
  top.innerHTML=`<button class="u-btn ghost icon ds-menu-btn" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="ds-side">${I('menu')}</button>
  <a class="ds-brand" href="start.html" aria-label="01 Design System home"><img src="../work/01/assets/01-mark.svg" alt="" width="30" height="30"><b>01 Design System</b></a><span class="ds-ver" title="Current release">${VERSION}</span>
  <button class="ds-search-btn" type="button" aria-haspopup="dialog" aria-label="Search the design system">${I('search')}<span>Search the system</span><kbd>/</kbd></button>
  <nav class="ds-toplinks" aria-label="Quick links"><a href="components.html"${/^components/.test(page)?' aria-current="page"':''}>Components</a><a href="resources.html"${page==='resources'?' aria-current="page"':''}>Download</a><a href="../work/01/hub.html">Prototypes</a></nav>`;
  const side=document.createElement('nav');side.className='ds-side';side.id='ds-side';side.setAttribute('aria-label','Design system');
  side.innerHTML=NAV.map(([g,items])=>`<div class="ds-grp"><p class="ds-grp-h">${esc(g)}</p><ul>${items.map(([id,label,href])=>`<li><a href="${href||id+'.html'}"${id===page?' aria-current="page"':''}>${esc(label)}</a></li>`).join('')}</ul></div>`).join('')+
   `<div class="ds-side-foot"><span>01 DESIGN SYSTEM · ${VERSION}</span><a href="../work/01/brand.html">Brand book</a><a href="../atlas.html">Visual &amp; Motion Atlas</a></div>`;
  const shell=document.createElement('div');shell.className='ds-shell';const body=document.createElement('div');body.className='ds-body';
  const toc=document.createElement('aside');toc.className='ds-toc';toc.setAttribute('aria-label','On this page');
  const scrim=document.createElement('div');scrim.className='ds-scrim';
  main.before(skip,top,shell);shell.append(side,body);body.append(main,toc);document.body.append(scrim);
  /* pager + footer inside main so they share its column */
  const i=FLAT.findIndex(p=>p.id===page),prev=FLAT[i-1],next=FLAT[i+1];
  if(i>=0){const pg=document.createElement('nav');pg.className='ds-pager';pg.setAttribute('aria-label','Previous and next page');
   pg.innerHTML=(prev?`<a href="${prev.href}"><span>Previous · ${esc(prev.group)}</span><b>${esc(prev.label)}</b></a>`:'<span></span>')+(next?`<a class="next" href="${next.href}"><span>Next · ${esc(next.group)}</span><b>${esc(next.label)}</b></a>`:'');main.append(pg)}
  const ft=document.createElement('footer');ft.className='ds-foot';ft.innerHTML=`<span>01 Design System ${VERSION} · Built only from <a href="../work/01/01.css">01.css</a>, <a href="../work/01/01-ui.css">01-ui.css</a> and <a href="../work/01/01-ui.js">01-ui.js</a></span><span><a href="changelog.html">Changelog</a> · <a href="contribute.html">Contribute</a> · <a href="../atlas.html">Atlas</a></span>`;main.append(ft);
  if(cur&&!document.title.includes('01 Design System'))document.title+=' · 01 Design System';
  /* mobile drawer */
  const mb=$('.ds-menu-btn',top);
  const setNav=open=>{document.body.classList.toggle('ds-nav-open',open);mb.setAttribute('aria-expanded',open);mb.setAttribute('aria-label',open?'Close navigation':'Open navigation');mb.innerHTML=I(open?'close':'menu');if(open){($('[aria-current=page]',side)||$('a',side)).focus()}};
  mb.onclick=()=>setNav(!document.body.classList.contains('ds-nav-open'));scrim.onclick=()=>setNav(false);
  addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('ds-nav-open')){setNav(false);mb.focus()}});
  matchMedia('(min-width:1001px)').addEventListener('change',e=>{if(e.matches)setNav(false)});
  const ca=$('[aria-current=page]',side);if(ca&&ca.offsetTop>side.clientHeight-80)side.scrollTop=ca.offsetTop-side.clientHeight/2;
  $('.ds-search-btn',top).onclick=()=>search.open();
  /* on-page contents */
  const hs=$$('h2[id]',main).filter(h=>!h.closest('.ds-ex,dialog,[hidden]'));
  if(hs.length>1){toc.innerHTML=`<p>On this page</p><ol>${hs.map(h=>`<li><a href="#${h.id}">${esc(h.dataset.toc||h.textContent.trim())}</a></li>`).join('')}</ol>`;
   const links=$$('a',toc);const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-20% 0px -70% 0px'});hs.forEach(h=>io.observe(h))}
 }
 /* ---------- search ---------- */
 const search=(()=>{let dlg,input,list,status,shown=[];
  function index(){const pages=FLAT.map(p=>({t:p.label,u:p.href,p:p.group,k:'page'}));return pages.concat((window.DS_INDEX||[]).filter(e=>e.u.includes('#')))}
  function build(){dlg=document.createElement('dialog');dlg.className='u-dialog ds-search';dlg.setAttribute('aria-label','Search the design system');
   dlg.innerHTML=`<div class="q">${I('search')}<input type="search" placeholder="Search components, tokens, rules…" aria-label="Search" aria-describedby="ds-sr-status" autocomplete="off" spellcheck="false"><kbd>esc</kbd></div><p id="ds-sr-status" class="vh" role="status" aria-live="polite"></p><ul class="ds-sr"></ul><div class="ft"><span>↓ to results</span><span>↵ open</span><span>esc close</span></div>`;
   document.body.append(dlg);input=$('input',dlg);list=$('ul',dlg);status=$('#ds-sr-status',dlg);
   input.oninput=render;input.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();$('a',list)?.focus()}else if(e.key==='Enter'){const a=$('a',list);if(a){e.preventDefault();go(a)}}};
   list.onkeydown=e=>{const as=$$('a',list),i=as.indexOf(document.activeElement);if(e.key==='ArrowDown'){e.preventDefault();as[Math.min(as.length-1,i+1)]?.focus()}else if(e.key==='ArrowUp'){e.preventDefault();(i<=0?input:as[i-1]).focus()}};
   list.onclick=e=>{const a=e.target.closest('a');if(a){e.preventDefault();go(a)}};
   dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()})}
  function go(a){dlg.close();const u=a.getAttribute('href');if(u.split('#')[0]===location.pathname.split('/').pop()||(u.startsWith('#'))){location.hash=u.split('#')[1]||''}else location.href=u}
  function score(e,q){const t=e.t.toLowerCase(),hay=(e.t+' '+e.p+' '+(e.k||'')).toLowerCase();let s=0;for(const w of q){if(!hay.includes(w))return 0;s+=t.startsWith(w)?6:t.includes(w)?4:1}if(e.k==='page')s+=2;return s}
  function mark(t,q){let h=esc(t);q.forEach(w=>{if(w.length>1)h=h.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>')});return h}
  function render(){const q=input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);const all=index();
   shown=q.length?all.map(e=>[score(e,q),e]).filter(x=>x[0]).sort((a,b)=>b[0]-a[0]).slice(0,40).map(x=>x[1]):all.filter(e=>e.k==='page');
   list.innerHTML=shown.length?shown.map(e=>`<li><a href="${esc(e.u)}"><b>${mark(e.t,q)}</b><i>${esc(e.k==='page'?'Page':e.p)}</i><small>${esc(e.k==='page'?e.p:(e.d||e.u.split('#')[0].replace('.html','')))}</small></a></li>`).join(''):`<li class="none">Nothing matches “${esc(input.value)}”. Try a component name, a token like cyan, or a word like focus.</li>`;
   status.textContent=q.length?`${shown.length} result${shown.length===1?'':'s'}`:''}
  function open(){if(!dlg)build();if(dlg.open)return;input.value='';render();dlg.showModal();input.focus()}
  addEventListener('keydown',e=>{const k=e.key.toLowerCase();const typing=/^(input|textarea|select)$/i.test(e.target.tagName)||e.target.isContentEditable;
   if((e.metaKey||e.ctrlKey)&&k==='k'){e.preventDefault();e.stopImmediatePropagation();dlg&&dlg.open?dlg.close():open()}else if(k==='/'&&!typing){e.preventDefault();open()}},true);
  return {open}})();
 /* ---------- init ---------- */
 function init(){chrome();
  $$('pre[data-lang]').forEach(codeBlock);
  $$('.ds-ex').forEach(example);
  if(window.UI)UI.wire(document);
  $$('[data-copy]').forEach(b=>{if(!b.onclick)b.onclick=()=>copy(b.dataset.copy,b.dataset.copyMsg||'Copied')});
  document.dispatchEvent(new CustomEvent('ds:ready'))}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init);
 return {VERSION,HOST,NAV,FLAT,$,$$,esc,copy,save,zip,zipBytes,crc32,fetchText,fetchBytes,rgb,lum,contrast,grade,cssVar,tokens,tokensCSS,tokensJSON,iconNames,iconSVG,hl,dedent,codeBlock,toast,search};
})();
