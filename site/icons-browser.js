'use strict';
/* Icon library (icons.html). Reads icons/index.json, loads one family manifest at a time
   (icons/sets/<family>.json, built by tools/icons.py) and renders the grid in chunks as it
   scrolls into view. Grid keys: arrows / Home / End / Page Up / Page Down; Enter opens the
   detail panel with copy and download actions; Esc closes it; "/" focuses search. */
(()=>{
 const $=s=>document.querySelector(s);
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const CHUNK=72;
 const ICON={copy:'<path d="M8 8h11v11H8z"/><path d="M5 15V5h10"/>',down:'<path d="M12 4v11M7 10l5 5 5-5M5 19h14"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',zip:'<path d="M6 3h9l4 4v14H6z"/><path d="M11 3v2h2v2h-2v2h2v2h-2"/>'};
 const svgI=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
 const S={index:null,fam:'regular',q:'',size:32,colour:'#0d1220',bake:false,sel:-1,list:[],shown:0,cache:{}};
 const qs=new URLSearchParams(location.search);
 let io=null,toastT=0;

 function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),1800);}
 async function copy(text,label){try{await navigator.clipboard.writeText(text);}catch{const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.append(ta);ta.select();try{document.execCommand('copy');}catch{}ta.remove();}toast(label+' copied');}
 function download(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}
 const fam=()=>S.index.families.find(f=>f.id===S.fam)||S.index.families[0];
 const fmtK=b=>b>1048576?(b/1048576).toFixed(1)+' MB':Math.round(b/1024)+' KB';

 /* ---------- data ---------- */
 async function loadFamily(id){
  if(S.cache[id])return S.cache[id];
  const f=S.index.families.find(x=>x.id===id);
  const r=await fetch(f.manifest);if(!r.ok)throw new Error('manifest '+r.status);
  const m=await r.json();
  m.icons.forEach(i=>{i.hay=(i.n.replace(/-/g,' ')+' '+i.k).toLowerCase();});
  return S.cache[id]=m;
 }
 function filter(m){
  const q=S.q.trim().toLowerCase();if(!q)return m.icons.slice();
  const terms=q.split(/\s+/).filter(Boolean);
  const scored=[];
  for(const i of m.icons){
   if(!terms.every(t=>i.hay.includes(t)))continue;
   const n=i.n.replace(/-/g,' ');let s=0;
   if(n===q||i.n===q)s=100;else if(n.startsWith(q))s=80;else if(n.includes(q))s=60;else if(terms.every(t=>n.includes(t)))s=50;else s=10;
   scored.push([s,i]);
  }
  return scored.sort((a,b)=>b[0]-a[0]).map(x=>x[1]);
 }

 /* ---------- markup ---------- */
 function sized(i,size){
  let s=i.s.replace('<svg',`<svg width="${size}" height="${size}"`);
  if(S.bake&&fam().monochrome)s=s.replace(/currentColor/g,S.colour);
  return s;
 }
 function jsx(i,size){
  const name=i.n.replace(/(^|-)([a-z0-9])/g,(_,a,c)=>c.toUpperCase()).replace(/^(\d)/,'Icon$1')+'Icon';
  const body=sized(i,size).replace(/\s([a-z]+)-([a-z])([a-z-]*)=/g,(m,a,b,c)=>' '+a+b.toUpperCase()+c.replace(/-([a-z])/g,(_,x)=>x.toUpperCase())+'=').replace(/\sclass=/g,' className=').replace(/\sxlink:href=/g,' xlinkHref=').replace(/\sxml:space="[^"]*"/g,'').replace(/<svg ([^>]*?)(\/?)>/,(m,a,sl)=>`<svg ${a} {...props}${sl}>`).replace(/style="([^"]*)"/g,(m,css)=>'style={{'+css.split(';').filter(Boolean).map(d=>{const [k,...v]=d.split(':');return JSON.stringify(k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()))+':'+JSON.stringify(v.join(':').trim());}).join(',')+'}}');
  return `export function ${name}(props) {\n  return (\n    ${body}\n  );\n}\n`;
 }
 function art(i,f){return f.format==='png'?`<img src="${esc(i.f)}" alt="" loading="lazy" decoding="async" width="64" height="64">`:i.s.replace('<svg','<svg aria-hidden="true" focusable="false"');}

 function famCards(){
  $('#fams').innerHTML=S.index.families.map(f=>`<li><button type="button" class="fam" data-fam="${f.id}" aria-pressed="${f.id===S.fam}"><span class="fi" data-sample="${f.id}"></span><b>${esc(f.title)}</b><small>${f.count} · ${esc(f.licence)}</small></button></li>`).join('');
  $('#famSel').innerHTML=S.index.families.map(f=>`<option value="${f.id}">${esc(f.title)} (${f.count})</option>`).join('');
  $('#famSel').value=S.fam;
  // one sample per card, loaded lazily so the first paint stays light
  S.index.families.forEach(f=>{const el=$(`[data-sample="${f.id}"]`);if(f.format==='png'){el.innerHTML=`<img src="icons/fluent-3d/house.png" alt="" width="26" height="26">`;}else el.innerHTML=`<img src="${f.card||`icons/${f.id}/house.svg`}" alt="" width="26" height="26">`;});
 }
 function strip(){
  const f=fam();
  $('#strip').innerHTML=`<h2>${esc(f.title)}</h2><p>${esc(f.description)} ${f.count} icons${f.monochrome?' in currentColor, so they follow the text colour they sit in':''}.</p>
   <a class="btn" href="${esc(f.pack)}" download>${svgI('zip')}Download all ${f.count} · ZIP ${fmtK(f.packBytes)}</a>
   <p class="lic">${esc(f.licence)} · source <a href="${esc(f.package)}" target="_blank" rel="noopener">${esc(f.source)}</a> · <a href="${esc(f.home)}" target="_blank" rel="noopener">project site ↗</a> · <a href="icons/LICENSES.txt">licence text</a> · <a href="${esc(f.specimenPack)}" download>13-icon specimen pack</a>${f.id==='openmoji'?' · Attribution required: “OpenMoji, CC BY-SA 4.0”':''}</p>`;
  const mono=f.monochrome;
  ['#colourField','#bakeField'].forEach(s=>{const el=$(s);el.setAttribute('aria-disabled',String(!mono));el.querySelector('input').disabled=!mono;el.title=mono?'':'Colour is part of this family’s artwork';});
  document.querySelectorAll('[data-fam]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.fam===S.fam)));
  $('#famSel').value=S.fam;
 }

 /* ---------- grid (chunked) ---------- */
 function renderGrid(reset=true){
  const g=$('#grid'),f=fam(),m=S.cache[S.fam];
  if(reset){S.shown=0;g.innerHTML='';g.scrollTop=0;}
  g.querySelector('.more')?.remove();
  if(!m){g.innerHTML='<li class="loading">Loading icons…</li>';return;}
  if(!S.list.length){g.innerHTML=`<li class="empty">No ${esc(f.title)} icon matches “${esc(S.q)}”. Try a broader word, or another family.</li>`;return;}
  const end=Math.min(S.list.length,S.shown+CHUNK);
  const frag=document.createDocumentFragment();
  for(let k=S.shown;k<end;k++){const i=S.list[k];const li=document.createElement('li');li.innerHTML=`<button type="button" class="ic" data-k="${k}" tabindex="-1" aria-label="${esc(i.n.replace(/-/g,' '))}" aria-current="${k===S.sel}" title="${esc(i.n)}">${art(i,f)}<span aria-hidden="true">${esc(i.n)}</span></button>`;frag.append(li);}
  g.append(frag);S.shown=end;
  if(end<S.list.length){const li=document.createElement('li');li.className='more';li.innerHTML=`<button type="button" class="btn ghost" data-more>Show more (${S.list.length-end} left)</button>`;g.append(li);io?.observe(li);}
  // keep exactly one icon in the tab order
  const cur=g.querySelector('.ic[tabindex="0"]');if(!cur){const first=g.querySelector(`.ic[data-k="${Math.max(0,S.sel)}"]`)||g.querySelector('.ic');if(first)first.tabIndex=0;}
 }
 function ensureShown(k){while(k>=S.shown&&S.shown<S.list.length)renderGrid(false);}
 function focusK(k){k=Math.max(0,Math.min(S.list.length-1,k));ensureShown(k);const g=$('#grid');g.querySelectorAll('.ic[tabindex="0"]').forEach(b=>b.tabIndex=-1);const b=g.querySelector(`.ic[data-k="${k}"]`);if(b){b.tabIndex=0;b.focus();}}
 function cols(){const g=$('#grid');const n=getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length;return Math.max(1,n);}

 async function apply({keepSel=false}={}){
  const f=fam();strip();
  if(!S.cache[S.fam]){renderGrid();try{await loadFamily(S.fam);}catch(e){$('#grid').innerHTML='<li class="empty">This family could not load. Check your connection and reload.</li>';return;}}
  S.list=filter(S.cache[S.fam]);
  if(!keepSel)S.sel=-1;
  $('#count').textContent=S.q?`${S.list.length} of ${f.count} match`:`${f.count} icons`;
  renderGrid();
  sync();
 }
 function sync(){const p=new URLSearchParams();if(S.fam!=='regular')p.set('family',S.fam);if(S.q)p.set('q',S.q);if(S.sel>=0&&S.list[S.sel])p.set('icon',S.list[S.sel].n);const s=p.toString();history.replaceState(null,'',s?'?'+s:location.pathname);}

 /* ---------- detail ---------- */
 function openDetail(k,focus=true){
  const i=S.list[k];if(!i)return;S.sel=k;const f=fam(),d=$('#detail'),size=S.size;
  document.querySelectorAll('.ic[aria-current=true]').forEach(b=>b.setAttribute('aria-current','false'));
  document.querySelector(`.ic[data-k="${k}"]`)?.setAttribute('aria-current','true');
  const png=f.format==='png';
  const kws=[...new Set(i.k.split(' '))].filter(w=>w&&w!==i.n).slice(0,14);
  d.innerHTML=`<div class="dhead"><div><h2 id="dName" tabindex="-1">${esc(i.n)}</h2><p>${esc(f.title)} · ${png?'PNG 192 px':'SVG'}</p></div><button type="button" class="x" data-close aria-label="Close details">${svgI('x')}</button></div>
   <div class="stage" style="--ds:${Math.max(64,size*2)}px;color:${S.colour}">${png?`<img src="${esc(i.f)}" alt="${esc(i.n.replace(/-/g,' '))}" width="140" height="140">`:i.s.replace('<svg',`<svg role="img" aria-label="${esc(i.n.replace(/-/g,' '))}"`)}</div>
   <div class="acts">${png?`<button type="button" class="btn" data-act="html">${svgI('copy')}Copy &lt;img&gt;</button><button type="button" class="btn ghost" data-act="name">${svgI('copy')}Copy name</button><button type="button" class="btn ghost wide" data-act="png">${svgI('down')}Download PNG</button>`
   :`<button type="button" class="btn" data-act="svg">${svgI('copy')}Copy SVG</button><button type="button" class="btn ghost" data-act="jsx">${svgI('copy')}Copy JSX</button><button type="button" class="btn ghost" data-act="name">${svgI('copy')}Copy name</button><button type="button" class="btn ghost" data-act="dl">${svgI('down')}Download SVG</button><button type="button" class="btn ghost wide" data-act="fav">${svgI('copy')}Use as favicon in the Site builder</button>`}</div>
   ${png?'':`<pre class="code" tabindex="0" aria-label="SVG code">${esc(sized(i,size))}</pre>`}
   ${kws.length?`<div><p class="dl">Also found by</p><div class="kw">${kws.map(w=>`<button type="button" data-kw="${esc(w)}">${esc(w)}</button>`).join('')}</div></div>`:''}
   <p class="dl">${esc(f.licence)} · ${esc(f.source)}${f.id==='openmoji'?' · credit “OpenMoji, CC BY-SA 4.0”':''}. Copies are ${size} px${!png&&f.monochrome?(S.bake?` in ${S.colour}`:' in currentColor'):''}.</p>`;
  d.hidden=false;d.parentNode.classList.add('has-detail');sync();
  if(focus)d.querySelector('#dName').focus();
 }
 function closeDetail(){const d=$('#detail');if(d.hidden)return;hideDetail();const k=S.sel;S.sel=-1;document.querySelectorAll('.ic[aria-current=true]').forEach(b=>b.setAttribute('aria-current','false'));sync();if(k>=0)focusK(k);}
 function hideDetail(){const d=$('#detail');d.hidden=true;d.parentNode.classList.remove('has-detail');}
 async function act(a){
  const i=S.list[S.sel],f=fam();if(!i)return;const size=S.size;
  if(a==='svg')copy(sized(i,size),'SVG');
  else if(a==='jsx')copy(jsx(i,size),'JSX');
  else if(a==='name')copy(i.n,'Name');
  else if(a==='dl'){download(`${i.n}.svg`,new Blob([sized(i,size)+'\n'],{type:'image/svg+xml'}));toast(`${i.n}.svg downloaded`);}
  else if(a==='html')copy(`<img src="${new URL(i.f,location.href).href}" alt="${i.n.replace(/-/g,' ')}" width="${size}" height="${size}">`,'HTML');
  else if(a==='fav'){try{localStorage.setItem('atlas-pb-favicon-handoff',JSON.stringify({set:f.id,name:i.n}));toast('Opening the Site builder…');location.href='page-builder.html?favicon=1'}catch{toast('Could not hand the icon over: storage is blocked.')}}
  else if(a==='png'){try{const r=await fetch(i.f);download(`${i.n}.png`,await r.blob());toast(`${i.n}.png downloaded`);}catch{toast('Download failed. Try again.');}}
 }

 /* ---------- events ---------- */
 function bind(){
  const g=$('#grid');
  let qT=0;
  $('#q').addEventListener('input',e=>{clearTimeout(qT);qT=setTimeout(()=>{S.q=e.target.value;hideDetail();apply();},120);});
  $('#size').addEventListener('input',e=>{S.size=+e.target.value;$('#sizeOut').textContent=S.size+' px';g.style.setProperty('--is',S.size+'px');if(!$('#detail').hidden)openDetail(S.sel,false);});
  $('#colour').addEventListener('input',e=>{S.colour=e.target.value;g.style.color=S.colour;if(!$('#detail').hidden)openDetail(S.sel,false);});
  $('#bake').addEventListener('change',e=>{S.bake=e.target.checked;if(!$('#detail').hidden)openDetail(S.sel,false);});
  const setFam=id=>{if(id===S.fam)return;S.fam=id;hideDetail();apply();};
  $('#fams').addEventListener('click',e=>{const b=e.target.closest('[data-fam]');if(b)setFam(b.dataset.fam);});
  $('#famSel').addEventListener('change',e=>setFam(e.target.value));
  g.addEventListener('click',e=>{const m=e.target.closest('[data-more]');if(m){const k=S.shown;renderGrid(false);focusK(k);return;}const b=e.target.closest('.ic');if(!b)return;g.querySelectorAll('.ic[tabindex="0"]').forEach(x=>x.tabIndex=-1);b.tabIndex=0;openDetail(+b.dataset.k);});
  g.addEventListener('keydown',e=>{const b=e.target.closest('.ic');if(!b)return;const k=+b.dataset.k,c=cols();
   const to={ArrowRight:k+1,ArrowLeft:k-1,ArrowDown:k+c,ArrowUp:k-c,Home:0,End:S.list.length-1,PageDown:k+c*4,PageUp:k-c*4}[e.key];
   if(to!=null){e.preventDefault();focusK(to);}});
  $('#detail').addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeDetail();const a=e.target.closest('[data-act]');if(a)act(a.dataset.act);const w=e.target.closest('[data-kw]');if(w){$('#q').value=w.dataset.kw;S.q=w.dataset.kw;apply();$('#q').focus();}});
  document.addEventListener('keydown',e=>{
   if(e.key==='Escape'&&!$('#detail').hidden){e.preventDefault();closeDetail();return;}
   if(e.key==='/'&&!/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)){e.preventDefault();$('#q').focus();$('#q').select();}
  });
  if('IntersectionObserver' in window)io=new IntersectionObserver(es=>{for(const en of es)if(en.isIntersecting){io.unobserve(en.target);renderGrid(false);}},{rootMargin:'600px 0px'});
 }

 async function init(){
  try{const r=await fetch('icons/index.json');S.index=await r.json();}catch{$('#grid').innerHTML='<li class="empty">The icon index could not load. Check your connection and reload.</li>';return;}
  const total=S.index.families.reduce((a,f)=>a+f.count,0);$('#total').textContent=total.toLocaleString('en-GB');
  const want=qs.get('family');if(want&&S.index.families.some(f=>f.id===want))S.fam=want;
  S.q=qs.get('q')||'';$('#q').value=S.q;
  famCards();bind();
  await apply();
  const ic=qs.get('icon');if(ic){const k=S.list.findIndex(i=>i.n===ic);if(k>=0){ensureShown(k);openDetail(k,false);}}
 }
 window.IconBrowser={state:S};
 init();
})();
