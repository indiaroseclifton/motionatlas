'use strict';
/* Page builder, canvas editing.
   1. mark(def): adds data-pbf / data-pbimg markers to a section template so the preview knows which words belong to which field.
   2. agent(): runs inside the preview frame (selection, in-place text editing, drag handle, add buttons) and talks to the editor with postMessage.
   3. PB.images: uploaded pictures kept in IndexedDB, referenced from fields as "user:<id>".
   4. PB.sec: per-section settings (spacing, width, alignment, background, visibility) as CSS.
   5. PB.canvas.init(ctx): the editor side, toolbar, popovers and section picker. ctx is handed over by app.js. */
(()=>{
const PB=window.PB=window.PB||{};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- 1. template markers (preview only) ---------- */
const markCache=new Map();
function mark(d){if(markCache.has(d.id))return markCache.get(d.id);
 const F=new Map((d.fields||[]).map(f=>[f.k,f])),html=d.html,edits=[],tagDone=new Set();let curEach=null;
 const re=/\{\{(each:(\w+)|\/each|\w+)\}\}/g;let m;
 while((m=re.exec(html))){const tok=m[1],idx=m.index,before=html.slice(0,idx),text=before.lastIndexOf('<')<=before.lastIndexOf('>');
  if(m[2]){curEach=m[2];continue}if(tok==='/each'){curEach=null;continue}
  if(/^\d+$/.test(tok)){if(curEach&&text)edits.push({pos:idx,len:m[0].length,repl:`<span data-pbf="${curEach}" data-r="{{n}}" data-c="${tok}">${m[0]}</span>`});continue}
  const f=F.get(tok);if(!f)continue;
  if((f.type==='text'||f.type==='long')&&text)edits.push({pos:idx,len:m[0].length,repl:`<span data-pbf="${tok}">${m[0]}</span>`});
  else if(f.type==='image'&&!text){const ts=before.lastIndexOf('<');if(!tagDone.has(ts)){const tn=/^<\w+/.exec(html.slice(ts));if(tn){tagDone.add(ts);edits.push({pos:ts+tn[0].length,len:0,repl:` data-pbimg="${tok}"`})}}}}
 let out=html;edits.sort((a,b)=>b.pos-a.pos).forEach(e=>{out=out.slice(0,e.pos)+e.repl+out.slice(e.pos+e.len)});
 markCache.set(d.id,out);return out}

/* ---------- 2. the agent that runs inside the preview frame ---------- */
function agent(){
 var EDIT=!!window.__PB_EDIT,sel=null,ed=null,drag=null,raf=0,tmr=0,pend=null;
 var css=document.createElement('style');
 css.textContent='#pb-ui{position:fixed;inset:0;pointer-events:none;z-index:2147483000;font:600 11px/1 system-ui,sans-serif}#pb-ui *{box-sizing:border-box}#pb-ui .h,#pb-ui .s,#pb-ui .e,#pb-ui .d{position:fixed;display:none;border-radius:2px}#pb-ui .h{border:1px dashed #5B2DFF;background:rgba(91,45,255,.04)}#pb-ui .h span{position:absolute;left:-1px;top:-19px;background:#5B2DFF;color:#fff;padding:3px 7px;border-radius:5px 5px 0 0;white-space:nowrap}#pb-ui .s{border:2px solid #5B2DFF}#pb-ui .e{border:2px solid #5B2DFF;background:rgba(91,45,255,.08)}#pb-ui .d{height:4px;background:#5B2DFF;border-radius:2px}#pb-ui button{position:fixed;display:none;pointer-events:auto;border:0;background:#5B2DFF;color:#fff;font:700 15px/1 system-ui,sans-serif;width:28px;height:28px;border-radius:50%;cursor:pointer;padding:0;box-shadow:0 4px 12px rgba(40,20,120,.35)}#pb-ui button.g{border-radius:8px;cursor:grab;font-size:13px;letter-spacing:-2px;width:30px}#pb-ui button:hover{background:#4A1FE6}'+(EDIT?'[data-pbf]{outline:none;cursor:text}[data-pbf]:hover{outline:1px dashed rgba(91,45,255,.55);outline-offset:2px}[data-pbf]:focus{outline:2px solid #5B2DFF;outline-offset:2px}[data-pbf]:empty::before{content:"Add text";opacity:.45}[data-pbimg]{cursor:pointer}':'')+'body.pb-drag{cursor:grabbing!important;user-select:none}';
 document.head.appendChild(css);
 var UI=document.createElement('div');UI.id='pb-ui';
 UI.innerHTML='<div class="h"><span></span></div><div class="s"></div><div class="e"></div><div class="d"></div><button type="button" class="a t" tabindex="-1" aria-hidden="true" title="Add a section above">+</button><button type="button" class="a b" tabindex="-1" aria-hidden="true" title="Add a section below">+</button><button type="button" class="g" tabindex="-1" aria-hidden="true" title="Drag to move this section">⋮⋮</button>';
 document.body.appendChild(UI);
 var H=UI.querySelector('.h'),S=UI.querySelector('.s'),E=UI.querySelector('.e'),D=UI.querySelector('.d'),AT=UI.querySelector('.a.t'),AB=UI.querySelector('.a.b'),G=UI.querySelector('.g');
 function send(m){parent.postMessage(m,'*')}
 function box(el,r){if(!r){el.style.display='none';return}el.style.display='block';el.style.left=r.left+'px';el.style.top=r.top+'px';el.style.width=r.width+'px';el.style.height=r.height+'px'}
 function btn(el,x,y){el.style.display='block';el.style.left=Math.max(4,Math.min(innerWidth-32,x))+'px';el.style.top=Math.max(4,Math.min(innerHeight-32,y))+'px'}
 function blockOf(n){return n&&n.closest?n.closest('[data-pb]'):null}
 function selBlock(){return sel&&document.getElementById(sel.uid)}
 function selEl(){if(!sel)return null;var b=selBlock();if(!b)return null;if(sel.kind==='text'){var q='[data-pbf="'+sel.k+'"]'+(sel.r!=null&&sel.r!==''?'[data-r="'+sel.r+'"][data-c="'+sel.c+'"]':'');return b.querySelector(q)}
  if(sel.kind==='image')return b.querySelector('[data-pbimg="'+sel.k+'"]');if(sel.kind==='link'||sel.kind==='menu')return b.querySelector('[data-pba="'+sel.a+'"]');return null}
 function rc(el){var r=el.getBoundingClientRect();return {left:r.left,top:r.top,width:r.width,height:r.height}}
 function draw(){raf=0;if(!EDIT)return;var b=selBlock();if(!sel||!b){box(S,null);box(E,null);AT.style.display=AB.style.display=G.style.display='none';return}
  var r=rc(b);box(S,r);var el=selEl();box(E,el&&el!==b?rc(el):null);
  btn(AT,r.left+r.width/2-14,r.top-14);btn(AB,r.left+r.width/2-14,r.top+r.height-14);btn(G,r.left+6,r.top+6);
  report()}
 function report(){var b=selBlock();if(!b)return;var el=selEl();send({pb:'rects',sec:rc(b),el:el?rc(el):null})}
 function later(){if(!raf)raf=requestAnimationFrame(draw)}
 addEventListener('scroll',later,{passive:true});addEventListener('resize',later);
 if(window.ResizeObserver)new ResizeObserver(later).observe(document.body);
 function anchorIdx(el){var a=el.closest&&el.closest('a[data-pba]');return a?a.getAttribute('data-pba'):null}
 function infoOf(t){var b=blockOf(t);if(!b)return null;var o={pb:'sel',uid:b.id,kind:'section'};
  var f=t.closest('[data-pbf]');
  if(f){o.kind='text';o.k=f.getAttribute('data-pbf');o.r=f.getAttribute('data-r');o.c=f.getAttribute('data-c');var ai=anchorIdx(f);if(ai!=null)o.a=ai;return o}
  var im=t.closest('[data-pbimg]');if(im){o.kind='image';o.k=im.getAttribute('data-pbimg');var ai0=anchorIdx(im);if(ai0!=null)o.a=ai0;return o}
  var a=t.closest('a[data-pba]');if(a){o.kind=a.hasAttribute('data-pbm')?'menu':'link';o.a=a.getAttribute('data-pba');o.text=(a.textContent||'').trim().slice(0,60);return o}
  return o}
 function setSel(o){sel=o&&{uid:o.uid,kind:o.kind,k:o.k,r:o.r,c:o.c,a:o.a};later()}
 /* clicks */
 document.addEventListener('click',function(e){
  var pl=e.target.closest&&e.target.closest('a[href^="#pb-page:"]');
  if(!EDIT){if(pl){e.preventDefault();send({pb:'page',id:pl.getAttribute('href').slice(9)});return}var a0=e.target.closest&&e.target.closest('a[href]');if(a0){var h=a0.getAttribute('href');if(h==='#'||h===''){e.preventDefault()}else if(/^https?:|^mailto:|^tel:/.test(h)){a0.target='_blank';a0.rel='noopener'}}return}
  if(e.target.closest&&e.target.closest('#pb-ui'))return;
  var a=e.target.closest&&e.target.closest('a');if(a)e.preventDefault();
  var o=infoOf(e.target);if(!o)return;setSel(o);send(o)},true);
 document.addEventListener('submit',function(e){e.preventDefault()},true);
 /* hover */
 document.addEventListener('mouseover',function(e){if(!EDIT||drag)return;var b=blockOf(e.target);if(!b){box(H,null);return}if(sel&&sel.uid===b.id){box(H,null);return}box(H,rc(b));H.firstChild.textContent=b.getAttribute('data-name')||''});
 document.addEventListener('mouseleave',function(){box(H,null)});
 /* text editing */
 function ee(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
 function inl(n){var o='';for(var i=0;i<n.childNodes.length;i++){var c=n.childNodes[i];if(c.nodeType===3)o+=ee(c.nodeValue);else if(c.nodeType===1){var t=c.tagName,inn=inl(c),fw=c.style&&c.style.fontWeight||'',fs=c.style&&c.style.fontStyle||'';
   if(t==='BR')o+=' ';else if(!inn.replace(/\s/g,''))o+=inn;else if(t==='B'||t==='STRONG'||/^(bold|[6-9]00)$/.test(fw))o+='<b>'+inn+'</b>';
   else if(t==='I'||t==='EM'||fs==='italic')o+='<i>'+inn+'</i>';
   else if(t==='A'&&(c.getAttribute('data-raw')||c.getAttribute('href'))&&/^(https?:\/\/|mailto:|tel:|#|page:)/i.test(c.getAttribute('data-raw')||c.getAttribute('href')))o+='<a href="'+ee(c.getAttribute('data-raw')||c.getAttribute('href'))+'">'+inn+'</a>';else o+=inn}}return o}
 function plain(el){return (el.textContent||'').replace(/\s+/g,' ').trim()}
 function fmt(el){if(!el.querySelector('b,strong,i,em,a,[style]'))return '';var h=inl(el).replace(/\s+/g,' ').trim();return /<(b|i|a)[ >]/.test(h)?h:''}
 function pushText(el){var o={pb:'text',uid:blockOf(el).id,k:el.getAttribute('data-pbf'),v:plain(el),h:el.getAttribute('data-r')!=null?'':fmt(el)};var r=el.getAttribute('data-r');if(r!=null){o.r=r;o.c=el.getAttribute('data-c')}
  /* mirror into other copies of the same field in this section */
  var b=blockOf(el),q='[data-pbf="'+o.k+'"]'+(r!=null?'[data-r="'+r+'"][data-c="'+o.c+'"]':'');if(!o.h&&!el.querySelector('b,strong,i,em,a'))b.querySelectorAll(q).forEach(function(x){if(x!==el&&x!==document.activeElement)x.textContent=o.v});
  send(o);later()}
 document.addEventListener('input',function(e){var el=e.target.closest&&e.target.closest('[data-pbf]');if(!el)return;pend=el;clearTimeout(tmr);tmr=setTimeout(function(){pend=null;pushText(el)},250);later()});
 document.addEventListener('focusin',function(e){if(e.target.closest&&e.target.closest('[data-pbf]'))send({pb:'focus'})});
 document.addEventListener('focusout',function(e){var el=e.target.closest&&e.target.closest('[data-pbf]');if(!el)return;clearTimeout(tmr);if(pend){pend=null;pushText(el)}send({pb:'blur'})});
 document.addEventListener('paste',function(e){var el=e.target.closest&&e.target.closest('[data-pbf]');if(!el)return;e.preventDefault();var t=(e.clipboardData||window.clipboardData).getData('text/plain').replace(/\s+/g,' ');document.execCommand('insertText',false,t)});
 document.addEventListener('drop',function(e){if(e.target.closest&&e.target.closest('[data-pbf]'))e.preventDefault()});
 document.addEventListener('keydown',function(e){var el=e.target.closest&&e.target.closest('[data-pbf]');
  if(el){if(e.key==='Enter'||e.key==='Escape'){e.preventDefault();el.blur()}e.stopPropagation();return}
  if(!EDIT)return;var mod=e.ctrlKey||e.metaKey,k=e.key;
  var hand=(k==='Delete'||k==='Backspace'||k==='Escape'||k==='?'||(e.shiftKey&&k==='F10')||(e.altKey&&(k==='ArrowUp'||k==='ArrowDown'))||(mod&&/^[dkzyZYcvCVhH]$/.test(k)));
  if(hand){e.preventDefault();send({pb:'key',key:k,mod:mod,shift:e.shiftKey,alt:e.altKey})}},true);
 /* context menu and long press */
 function ctx(e,x,y){var b=blockOf(e.target);if(!b||!EDIT)return false;var o=infoOf(e.target);if(o){setSel(o);send(o)}send({pb:'ctx',uid:b.id,x:x,y:y});return true}
 document.addEventListener('contextmenu',function(e){if(ctx(e,e.clientX,e.clientY))e.preventDefault()},true);
 var lp=0,lpx=0,lpy=0;document.addEventListener('touchstart',function(e){if(!EDIT||e.touches.length!==1)return;var t=e.touches[0];lpx=t.clientX;lpy=t.clientY;var tg=e.target;clearTimeout(lp);lp=setTimeout(function(){lp=0;ctx({target:tg},lpx,lpy)},650)},{passive:true});
 document.addEventListener('touchmove',function(e){var t=e.touches[0];if(lp&&(Math.abs(t.clientX-lpx)>8||Math.abs(t.clientY-lpy)>8)){clearTimeout(lp);lp=0}},{passive:true});document.addEventListener('touchend',function(){clearTimeout(lp);lp=0},{passive:true});
 document.addEventListener('keyup',function(e){if(e.target.closest&&e.target.closest('[data-pbf]'))e.stopPropagation()},true);
 /* buttons */
 AT.onclick=function(){if(sel)send({pb:'add',uid:sel.uid,where:'before'})};AB.onclick=function(){if(sel)send({pb:'add',uid:sel.uid,where:'after'})};
 /* drag a section by its handle */
 G.addEventListener('pointerdown',function(e){if(!sel)return;e.preventDefault();G.setPointerCapture(e.pointerId);drag={uid:sel.uid,zone:selBlock().getAttribute('data-zone'),before:null};document.body.classList.add('pb-drag')});
 G.addEventListener('pointermove',function(e){if(!drag)return;var bs=[].slice.call(document.querySelectorAll('[data-pb][data-zone="'+drag.zone+'"]')).filter(function(b){return b.id!==drag.uid}),y=e.clientY,t=null,line=null;
  for(var i=0;i<bs.length;i++){var r=bs[i].getBoundingClientRect();if(y<r.top+r.height/2){t=bs[i];line=r.top;break}}
  if(!t&&bs.length){line=bs[bs.length-1].getBoundingClientRect().bottom}drag.before=t?t.id:null;
  if(line==null)return;D.style.display='block';D.style.left='0';D.style.width='100%';D.style.top=(line-2)+'px'});
 function endDrag(){if(!drag)return;var d=drag;drag=null;document.body.classList.remove('pb-drag');D.style.display='none';send({pb:'move',uid:d.uid,before:d.before})}
 G.addEventListener('pointerup',endDrag);G.addEventListener('pointercancel',endDrag);
 /* messages from the editor */
 addEventListener('message',function(e){var m=e.data;if(!m||e.source!==parent)return;
  if(m.pb==='reselect'){setSel(m);later()}
  if(m.pb==='clear'){sel=null;later()}
  if(m.pb==='focus'){var el=selEl();if(el&&el.hasAttribute('data-pbf'))el.focus()}
  if(m.pb==='scrollTo'){var b=document.getElementById(m.uid);if(b)b.scrollIntoView({behavior:m.smooth?'smooth':'auto',block:'start'})}});
 /* make the words editable */
 if(EDIT){var mode='true';
  document.querySelectorAll('[data-pbf]').forEach(function(el){if(el.closest('summary,button,select,option,label'))return;el.setAttribute('contenteditable',mode);el.setAttribute('spellcheck','false');el.setAttribute('role','textbox');el.setAttribute('aria-label','Edit text')})}
 /* rich words: a small bold / italic / link bar over a text selection */
 if(EDIT){var RT=document.createElement('div');RT.id='pb-rt';RT.setAttribute('role','toolbar');RT.setAttribute('aria-label','Format the selected words');RT.innerHTML='<button type="button" data-c="b" aria-label="Bold" title="Bold (Ctrl+B)"><b>B</b></button><button type="button" data-c="i" aria-label="Italic" title="Italic (Ctrl+I)"><i>I</i></button><button type="button" data-c="a" aria-label="Link" title="Link">Link</button>';
  var rs=document.createElement('style');rs.textContent='#pb-rt{position:fixed;display:none;z-index:2147483001;gap:2px;padding:3px;background:#1C1F2A;border-radius:9px;box-shadow:0 10px 24px -8px rgba(0,0,0,.5);font:600 12px/1 system-ui,sans-serif}#pb-rt button{all:unset;cursor:pointer;color:#fff;min-width:30px;height:28px;display:grid;place-items:center;border-radius:6px;padding:0 6px;font:600 13px system-ui,sans-serif}#pb-rt button:hover{background:rgba(255,255,255,.18)}';document.head.appendChild(rs);document.body.appendChild(RT);
  RT.addEventListener('mousedown',function(e){e.preventDefault()});
  RT.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var c=b.getAttribute('data-c');
   if(c==='b')document.execCommand('bold');else if(c==='i')document.execCommand('italic');
   else{var n=window.getSelection().anchorNode,a=n&&(n.nodeType===1?n:n.parentNode).closest('a');if(a){document.execCommand('unlink')}else{var u=prompt('Link address (https://…, mailto:…, tel:… or #section)','https://');if(u&&/^(https?:\/\/|mailto:|tel:|#)/i.test(u.trim())){document.execCommand('createLink',false,u.trim());var sa=window.getSelection().anchorNode;var an=sa&&(sa.nodeType===1?sa:sa.parentNode).closest('a');if(an)an.setAttribute('data-raw',u.trim())}}}
   var ed=document.activeElement;if(ed&&ed.closest&&ed.closest('[data-pbf]'))ed.dispatchEvent(new Event('input',{bubbles:true}))});
  document.addEventListener('selectionchange',function(){var s=window.getSelection();if(!s||s.isCollapsed||!s.rangeCount){RT.style.display='none';return}var n=s.anchorNode,el=n&&(n.nodeType===1?n:n.parentNode);if(!el||!el.closest||!el.closest('[data-pbf][contenteditable]')){RT.style.display='none';return}
   var r=s.getRangeAt(0).getBoundingClientRect();RT.style.display='flex';RT.style.left=Math.max(4,Math.min(innerWidth-130,r.left))+'px';RT.style.top=Math.min(innerHeight-40,r.bottom+8)+'px'})}
 /* start films once they scroll into view (poster first), unless motion is reduced */
 try{var vs=[].slice.call(document.querySelectorAll('video[data-pbv]'));if(vs.length&&window.IntersectionObserver&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var vio=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){v.preload='auto';var pr=v.play&&v.play();if(pr&&pr.catch)pr.catch(function(){})}else if(v.pause)v.pause()})});setTimeout(function(){vs.forEach(function(v){vio.observe(v)})},900)}}catch(x){}
 addEventListener('wheel',function(e){if(e.ctrlKey&&EDIT){e.preventDefault();send({pb:'zoom',d:e.deltaY<0?1:-1})}},{passive:false});
 /* accessibility scan */
 function pc(v){var m=/rgba?\(([^)]+)\)/.exec(v);if(!m)return null;var p=m[1].split(/[ ,\/]+/).filter(Boolean).map(parseFloat);return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1}}
 function L(c){var f=[c.r,c.g,c.b].map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*f[0]+.7152*f[1]+.0722*f[2]}
 function ratio(a,b){var x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
 function effBg(el){var layers=[],n=el;while(n&&n.nodeType===1){var cs=getComputedStyle(n);if(cs.backgroundImage!=='none'&&!/^linear-gradient\(.*\)$/.test('')){return null}var c=pc(cs.backgroundColor);if(c&&c.a>0)layers.push(c);if(c&&c.a>=.99)break;n=n.parentElement}var out={r:255,g:255,b:255,a:1};for(var i=layers.length-1;i>=0;i--){var l=layers[i];out={r:l.r*l.a+out.r*(1-l.a),g:l.g*l.a+out.g*(1-l.a),b:l.b*l.a+out.b*(1-l.a),a:1}}return out}
 function hex(c){return '#'+[c.r,c.g,c.b].map(function(v){return ('0'+Math.round(v).toString(16)).slice(-2)}).join('')}
 function vis(el){var cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')return false;var r=el.getBoundingClientRect();return r.width>0&&r.height>0}
 function name(el){return ((el.getAttribute('aria-label')||el.getAttribute('title')||el.textContent||'')+'').replace(/\s+/g,' ').trim()||(el.querySelector('img[alt]:not([alt=""])')?'img':'')}
 function scan(){var out=[],seen={};function add(type,el,msg,extra){var b=blockOf(el);if(!b)return;var k=type+b.id+msg;if(seen[k]>=3)return;seen[k]=(seen[k]||0)+1;var o={type:type,msg:msg,uid:b.id,name:b.getAttribute('data-name')||''};if(extra)for(var x in extra)o[x]=extra[x];out.push(o)}
  document.querySelectorAll('[data-pb] *').forEach(function(el){if(el.closest('script,style,svg,[aria-hidden="true"]'))return;var has=false;for(var i=0;i<el.childNodes.length;i++){var n=el.childNodes[i];if(n.nodeType===3&&n.nodeValue.trim()){has=true;break}}if(!has||!vis(el))return;var cs=getComputedStyle(el),fg=pc(cs.color),bg=effBg(el);if(!fg||!bg)return;if(fg.a<1){fg={r:fg.r*fg.a+bg.r*(1-fg.a),g:fg.g*fg.a+bg.g*(1-fg.a),b:fg.b*fg.a+bg.b*(1-fg.a)}}var sz=parseFloat(cs.fontSize),big=sz>=24||(sz>=18.66&&parseInt(cs.fontWeight,10)>=700),need=big?3:4.5,r=ratio(fg,bg);if(r<need-.02)add('contrast',el,'Text “'+(el.textContent||'').trim().slice(0,28)+'” has contrast '+r.toFixed(1)+':1 (needs '+need+':1)',{fg:hex(fg),bg:hex(bg),ratio:+r.toFixed(2)})});
  var hs=[].slice.call(document.querySelectorAll('[data-pb] h1,[data-pb] h2,[data-pb] h3,[data-pb] h4,[data-pb] h5,[data-pb] h6')).filter(vis),prev=0,h1=0;hs.forEach(function(h){var lv=+h.tagName[1];if(lv===1)h1++;if(!(h.textContent||'').trim())add('heading',h,'An empty heading');if(prev&&lv>prev+1)add('heading',h,'Heading level jumps from h'+prev+' to h'+lv+': “'+h.textContent.trim().slice(0,24)+'”');prev=lv});
  if(!h1)out.push({type:'heading',msg:'This page has no main heading (h1). Add a hero or text section with a headline.',uid:'',name:''});else if(h1>1)out.push({type:'heading',msg:'This page has '+h1+' main headings (h1); one is best.',uid:'',name:''});
  document.querySelectorAll('[data-pb] img').forEach(function(im){if(im.closest('[aria-hidden="true"]'))return;if(!im.hasAttribute('alt'))add('alt',im,'An image has no alt text',{k:im.getAttribute('data-pbimg')||''});else if(!im.getAttribute('alt').trim()&&(im.hasAttribute('data-pbimg')||(im.getBoundingClientRect().width>=160&&im.getBoundingClientRect().height>=100)))add('alt',im,'An image has empty alt text. Describe it, or it is skipped by screen readers.',{k:im.getAttribute('data-pbimg')||''})});
  var generic=/^(click here|here|read more|more|learn more|link)$/i;document.querySelectorAll('[data-pb] a,[data-pb] button').forEach(function(a){if(a.closest('[aria-hidden="true"]')||!vis(a))return;var nm=name(a);if(!nm)add('link',a,'A '+(a.tagName==='A'?'link':'button')+' has no name for screen readers');else if(generic.test(nm))add('link',a,'The link “'+nm+'” does not say where it goes')});
  document.querySelectorAll('[data-pb] input:not([type=hidden]):not([type=checkbox]):not([type=radio]),[data-pb] textarea,[data-pb] select').forEach(function(f){if(f.getAttribute('aria-label')||f.getAttribute('aria-labelledby')||f.closest('label')||(f.id&&document.querySelector('label[for="'+f.id+'"]')))return;add('form',f,'A form field has no label')});
  return out}
 addEventListener('message',function(e){if(e.source===parent&&e.data&&e.data.pb==='check')send({pb:'checked',issues:scan()})});
 send({pb:'ready'});
}
PB.agentSrc='('+agent.toString()+')();';

/* ---------- 3. uploaded images ---------- */
const IMG={cache:new Map(),dbp:null,
 db(){return this.dbp||(this.dbp=new Promise((res,rej)=>{try{const r=indexedDB.open('atlas-site-images',1);r.onupgradeneeded=()=>r.result.createObjectStore('img',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}}))},
 async tx(mode,fn){const d=await this.db();return new Promise((res,rej)=>{const t=d.transaction('img',mode),q=fn(t.objectStore('img'));t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error)})},
 async load(){try{const all=await this.tx('readonly',s=>s.getAll())||[];all.forEach(r=>{this.cache.set(r.id,{...r,url:URL.createObjectURL(r.blob)})})}catch(e){}return this.cache.size},
 async add(file){const blob=await downscale(file),id='u'+Math.random().toString(36).slice(2,9);const rec={id,name:file.name||'image',type:blob.type||file.type,blob,added:Date.now()};
  this.cache.set(id,{...rec,url:URL.createObjectURL(blob)});try{await this.tx('readwrite',s=>s.put(rec))}catch(e){PB.imgWarn=true}return id},
 url(id){const r=this.cache.get(id);return r?r.url:''},
 ext(id){const r=this.cache.get(id),t=r&&r.type||'';return t.includes('png')?'png':t.includes('webp')?'webp':t.includes('svg')?'svg':t.includes('gif')?'gif':'jpg'},
 async bytes(id){const r=this.cache.get(id);return r?new Uint8Array(await r.blob.arrayBuffer()):null},
 async dataURL(id){const r=this.cache.get(id);if(!r)return '';return new Promise(res=>{const f=new FileReader();f.onload=()=>res(f.result);f.readAsDataURL(r.blob)})}};
async function downscale(file){if(!/^image\/(png|jpe?g|webp)$/.test(file.type)||file.size<350e3)return file;
 try{const bm=await createImageBitmap(file),k=Math.min(1,2000/Math.max(bm.width,bm.height));if(k>=1&&file.size<2e6)return file;const c=document.createElement('canvas');c.width=Math.round(bm.width*k);c.height=Math.round(bm.height*k);c.getContext('2d').drawImage(bm,0,0,c.width,c.height);
  return await new Promise(r=>c.toBlob(b=>r(b||file),file.type==='image/png'?'image/png':'image/jpeg',.86))}catch(e){return file}}
PB.images=IMG;

/* ---------- 4. per-section settings ---------- */
const SPACING=[['default','Default'],['compact','Compact'],['roomy','Roomy'],['spacious','Spacious']],WIDTH=[['default','Default'],['narrow','Narrow'],['wide','Wide'],['full','Full width']],ALIGN=[['','As designed'],['left','Left'],['center','Centre'],['right','Right']],
 BG=[['','As designed'],['surface','Soft panel'],['accent','Accent colour'],['ink','Inverted'],['gradient','Gradient'],['image','Image'],['film','Film']],ANIM=[['','None'],['rise','Fade up on scroll']];
const FLIP={accent:'--bg:var(--q-acc);--ink:var(--q-on);--mute:color-mix(in srgb,var(--q-on) 78%,var(--q-acc));--line:color-mix(in srgb,var(--q-on) 28%,transparent);--surface:color-mix(in srgb,var(--q-on) 12%,var(--q-acc));--accent:var(--q-on);--on-accent:var(--q-acc);--accent-ink:var(--q-on);color:var(--q-on)',
 ink:'--bg:var(--q-ink);--ink:var(--q-bg);--mute:color-mix(in srgb,var(--q-bg) 70%,var(--q-ink));--line:color-mix(in srgb,var(--q-bg) 24%,transparent);--surface:color-mix(in srgb,var(--q-bg) 10%,var(--q-ink));color:var(--q-bg)',
 surface:'--bg:var(--q-surface);--surface:var(--q-bg)'};
/* returns {cls, css, inner (html at the start of the section), wrap (inner wrapper style or ''), rt} */
function secBuild(blk,o){const s=blk.set;if(!s||!Object.keys(s).length)return {cls:'',css:'',inner:'',flip:'',rt:''};
 const u='#'+blk.uid,r=[],cls=[];let inner='',flip='';
 const rules=(q,x)=>{const o=[];const sp=x.pad;if(sp==='compact')o.push(`${u} .wrap{padding-top:clamp(24px,5vh,56px)!important;padding-bottom:clamp(24px,5vh,56px)!important}`);else if(sp==='roomy')o.push(`${u}{padding-block:clamp(32px,6vw,80px)}`);else if(sp==='spacious')o.push(`${u}{padding-block:clamp(64px,10vw,160px)}`);else if(sp==='default'&&q)o.push(`${u}{padding-block:0}${u} .wrap{padding-top:clamp(56px,10vh,110px)!important;padding-bottom:clamp(56px,10vh,110px)!important}`);
  const w=x.width;if(w==='narrow')o.push(`${u} .wrap{max-width:820px!important}`);else if(w==='wide')o.push(`${u} .wrap{max-width:1560px!important}`);else if(w==='full')o.push(`${u} .wrap{max-width:none!important}`);
  const al=x.align;if(al){const j=al==='center'?'center':al==='right'?'flex-end':'flex-start',ji=al==='center'?'center':al==='right'?'end':'start';o.push(`${u}{text-align:${al}}${u} .row,${u} .btns,${u} .rowb{justify-content:${j}!important}${u} .hc,${u} .c{justify-items:${ji}!important}`)}
  return o};
 r.push(...rules(false,s));
 if(s.t){const o=rules(true,s.t);if(o.length)r.push('@media (min-width:641px) and (max-width:1024px){'+o.join('')+'}')}
 if(s.p){const o=rules(true,s.p);if(o.length)r.push('@media (max-width:640px){'+o.join('')+'}')}
 const bg=s.bg;
 if(bg&&bg!=='default'){cls.push('pb-bg');r.push(`${u}{position:relative;isolation:isolate;--q-bg:var(--bg);--q-ink:var(--ink);--q-acc:var(--accent);--q-on:var(--on-accent);--q-surface:var(--surface)}`);
  if(FLIP[bg]){flip=FLIP[bg];r.push(`${u}{background:${bg==='accent'?'var(--accent)':bg==='ink'?'var(--ink)':'var(--surface)'}}`)}
  else if(bg==='gradient')r.push(`${u}{background:linear-gradient(180deg,var(--bg),color-mix(in srgb,var(--accent) 18%,var(--bg)))}`);
  else if(bg==='image'&&s.bgv){inner+=`<div class="pb-bgm" aria-hidden="true" style="background-image:url(${o.asset(s.bgv)})"></div>`}
  else if(bg==='film'&&s.bgv){const f=String(s.bgv).replace(/[^\w-]/g,'');inner+=`<video class="pb-bgm" aria-hidden="true" tabindex="-1" ${o.mode==='preview'?'':'autoplay '}muted loop playsinline poster="${o.A}films/${f}.jpg"><source src="${o.A}films/${f}-720.mp4" type="video/mp4"></video>`}
  if((bg==='image'||bg==='film')&&s.bgv){const ov=Math.max(0,Math.min(90,+s.ov>=0?+s.ov:55));inner+=`<div class="pb-bgo" aria-hidden="true" style="background:color-mix(in srgb,var(--bg) ${ov}%,transparent)"></div>`;
   r.push(`${u} .pb-bgm{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background-size:cover;background-position:center;z-index:-2}${u} .pb-bgo{position:absolute;inset:0;z-index:-1}`)}}
 const hide=s.hide||{};if(hide.d)cls.push('pbh-d');if(hide.t)cls.push('pbh-t');if(hide.p)cls.push('pbh-p');
 let rt='';if(s.anim==='rise'&&o.mode!=='preview'){cls.push('pb-rise');rt='pbrise'}
 return {cls:cls.join(' '),css:r.join('\n'),inner,flip,rt}}
PB.sec={build:secBuild,SPACING,WIDTH,ALIGN,BG,ANIM,
 base:`@media (min-width:1025px){.pbh-d{display:none!important}}@media (min-width:641px) and (max-width:1024px){.pbh-t{display:none!important}}@media (max-width:640px){.pbh-p{display:none!important}}.pb-sticky{position:sticky;top:0;z-index:40}.pb-rise{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1)}.pb-rise.in{opacity:1;transform:none}@media (prefers-reduced-motion:reduce){.pb-rise{opacity:1;transform:none;transition:none}}`,
 runtime:{pbrise:`(function(){var els=document.querySelectorAll('.pb-rise');if(!('IntersectionObserver' in window)){els.forEach(function(x){x.classList.add('in')});return}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(x){io.observe(x)})})();`}};

PB.canvas={mark,agent,esc};
})();
