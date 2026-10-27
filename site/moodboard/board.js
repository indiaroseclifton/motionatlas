'use strict';
/* Moodboard canvas: pan/zoom, drag, resize, z-order, group, align, auto-arrange, palette, "Make this a style", PNG, share link. */
(()=>{
const $=id=>document.getElementById(id),S=window.MoodStore;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hexOK=v=>/^#[0-9a-f]{6}$/i.test(String(v||''));
const safeURL=u=>{u=String(u||'').trim();try{const x=new URL(u,location.href);return /^https?:$/.test(x.protocol)?x.href:''}catch{return ''}};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const world=$('mbWorld'),view=$('mbView');
let board=null,sel=new Set(),readonly=false,cat=null,undo=[],redo=[];
const imgURL=new Map(),imgEl=new Map(),sheets=new Map();

/* ---------- colour maths ---------- */
const hx=h=>{h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
const toHex=a=>'#'+a.map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('').toUpperCase();
const mix=(a,b,p)=>{const A=hx(a),B=hx(b);return toHex(A.map((v,i)=>v+(B[i]-v)*p))};
const lum=h=>{const c=hx(h).map(v=>v/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const sat=h=>{const [r,g,b]=hx(h).map(v=>v/255),M=Math.max(r,g,b),m=Math.min(r,g,b);return M?(M-m)/M:0};
const best=bg=>ratio('#FFFFFF',bg)>=ratio('#000000',bg)?'#FFFFFF':'#000000';
function ensure(fg,bg,min){if(ratio(fg,bg)>=min)return fg;const to=best(bg);for(let p=.05;p<=1.001;p+=.05){const c=mix(fg,to,p);if(ratio(c,bg)>=min)return c}return to}
const ink=bg=>ratio('#111318',bg)>=ratio('#FFFFFF',bg)?'#111318':'#FFFFFF';

/* ---------- messages ---------- */
function say(t){$('mbLive').textContent=t}
function toast(t){const el=$('mbToast');el.textContent=t;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('on'),2800)}

/* ---------- state ---------- */
const commit=(label)=>{if(readonly)return;undo.push(JSON.stringify(board.items));if(undo.length>60)undo.shift();redo.length=0;persist();upd()};
function persist(){if(readonly)return;if(!S.save(board))toast('Could not save. Storage is full: export a PNG or remove large pictures.')}
const items=()=>board.items;const byId=id=>board.items.find(i=>i.id===id);
const nextZ=()=>(board.z=(board.z||1)+1);
function setSel(ids,add){if(!add)sel.clear();ids.forEach(id=>{const it=byId(id);if(!it)return;if(it.g)board.items.filter(x=>x.g===it.g).forEach(x=>sel.add(x.id));else sel.add(id)});paint()}
function paint(){world.querySelectorAll('.mbItem').forEach(e=>{const on=sel.has(e.dataset.id);e.classList.toggle('sel',on);e.dataset.sel=on?'1':'0'});handles();inspector();upd()}

/* ---------- rendering items ---------- */
const fontLoaded=new Set();
function loadFont(css){if(!css||fontLoaded.has(css))return;fontLoaded.add(css);const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?'+css.replace(/[^\w:@;,.+=&-]/g,'')+'&display=swap';document.head.append(l)}
const cap=it=>`<div class="mbCap"><b>${esc(it.title||'')}</b><small>${esc(it.sub||'')}</small></div>`;
function sheet(url){if(sheets.has(url))return sheets.get(url);const p=new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=url});sheets.set(url,p);return p}
function inner(it){
 switch(it.type){
  case 'entry':{const im=it.img;const art=im?`<div class="mbArt" style="background-image:url('${esc(im.u)}');background-size:${esc(im.s)};background-position:${esc(im.p)}"></div>`:`<div class="mbArt mbNoArt"><b>${esc(it.ref||'')}</b></div>`;
   if(im&&!it.ar)sheet(im.u).then(i=>{if(!i||it.ar||readonly&&false)return;const c=im.c||2,r=im.r||2;it.ar=(i.naturalWidth/c)/(i.naturalHeight/r);it.h=Math.round(it.w/it.ar)+36;render(it.id);if(!readonly)persist()});
   return art+cap(it)}
  case 'kit':{loadFont(it.css);const cs=(it.colors||[]).filter(hexOK);return `<div class="mbKit">${cs.map(c=>`<i style="background:${c}"></i>`).join('')}</div><div class="mbCap"><b style="font-family:${esc(it.head||'inherit')}">${esc(it.title)}</b><small>${esc(it.sub||'Theme kit')}</small></div>`}
  case 'icon':return `<div class="mbIcon" style="color:${hexOK(it.color)?it.color:'#111318'}">${it.svg||''}</div>`;
  case 'swatch':{const c=hexOK(it.color)?it.color:'#888888';return `<div class="mbSwatch" style="background:${c};color:${ink(c)}"><b>${c.toUpperCase()}</b><small>${esc(it.title||'')}</small></div>`}
  case 'note':{const bg=hexOK(it.bg)?it.bg:'#FFF3A8';return `<div class="mbNote" style="background:${bg};color:${ink(bg)}">${esc(it.text||'').replace(/\n/g,'<br>')}</div>`}
  case 'link':{const u=safeURL(it.url);let host='';try{host=new URL(u).hostname.replace(/^www\./,'')}catch{}return `<div class="mbLink"><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M6.5 9.5a3 3 0 0 0 4.2 0l2.3-2.3a3 3 0 0 0-4.2-4.2L7.5 4M9.5 6.5a3 3 0 0 0-4.2 0L3 8.8A3 3 0 0 0 7.2 13l1.3-1" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg><b>${esc(it.title||host||'Link')}</b><small>${esc(host)}</small></div>`}
  case 'image':{const u=imgURL.get(it.imgId);return u?`<img src="${u}" alt="${esc(it.title||'Your picture')}" draggable="false">`:`<div class="mbNoArt"><small>${it.missing?'Picture not included in a shared link':'Loading…'}</small></div>`}
 }return ''}
const label=it=>({entry:'Atlas entry',kit:'Theme kit',icon:'Icon',swatch:'Colour',note:'Note',link:'Link',image:'Picture'})[it.type]+': '+(it.title||it.text||it.color||it.url||'').toString().slice(0,60);
function render(id){const it=byId(id);if(!it)return;let e=world.querySelector(`[data-id="${CSS.escape(id)}"]`);if(!e){e=document.createElement('div');e.className='mbItem';e.dataset.id=id;e.tabIndex=0;e.setAttribute('role','group');world.append(e)}
 e.dataset.type=it.type;e.style.cssText=`left:${it.x}px;top:${it.y}px;width:${it.w}px;height:${it.h}px;z-index:${it.z||1}`;e.setAttribute('aria-label',label(it));e.innerHTML=inner(it);e.classList.toggle('sel',sel.has(id));
 if(it.type==='image'&&it.imgId&&!imgURL.has(it.imgId)&&!it.missing)S.getImage(it.imgId).then(b=>{if(b){imgURL.set(it.imgId,URL.createObjectURL(b));render(id)}else{it.missing=true;render(id)}}).catch(()=>{})}
function renderAll(){world.querySelectorAll('.mbItem').forEach(e=>{if(!byId(e.dataset.id))e.remove()});items().forEach(it=>render(it.id));applyView();$('mbEmpty').hidden=items().length>0;paint()}

/* ---------- viewport ---------- */
const V=()=>board.view;
function applyView(){const v=V();world.style.transform=`translate(${v.x}px,${v.y}px) scale(${v.k})`;view.style.backgroundSize=`${24*v.k}px ${24*v.k}px`;view.style.backgroundPosition=`${v.x}px ${v.y}px`;$('mbZoom').textContent=Math.round(v.k*100)+'%'}
function toWorld(cx,cy){const r=view.getBoundingClientRect(),v=V();return [(cx-r.left-v.x)/v.k,(cy-r.top-v.y)/v.k]}
function zoomAt(cx,cy,f){const r=view.getBoundingClientRect(),v=V(),k=clamp(v.k*f,.1,3),px=cx-r.left,py=cy-r.top;v.x=px-(px-v.x)*(k/v.k);v.y=py-(py-v.y)*(k/v.k);v.k=k;applyView();persist()}
function bbox(list){if(!list.length)return null;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;list.forEach(i=>{x0=Math.min(x0,i.x);y0=Math.min(y0,i.y);x1=Math.max(x1,i.x+i.w);y1=Math.max(y1,i.y+i.h)});return {x:x0,y:y0,w:x1-x0,h:y1-y0}}
function fit(list){const b=bbox(list&&list.length?list:items());const r=view.getBoundingClientRect();if(!b){V().x=0;V().y=0;V().k=1;return applyView()}const k=clamp(Math.min((r.width-80)/b.w,(r.height-80)/b.h,1.2),.1,3);V().k=k;V().x=(r.width-b.w*k)/2-b.x*k;V().y=(r.height-b.h*k)/2-b.y*k;applyView();persist()}

/* ---------- pointer interaction ---------- */
let drag=null;
view.addEventListener('pointerdown',e=>{if(e.button===2)return;if(e.target.closest('input,textarea,select,button.mbH'))return;
 const h=e.target.closest('.mbHandle'),el=e.target.closest('.mbItem');view.setPointerCapture(e.pointerId);
 if(h&&!readonly){const it=byId([...sel][0]);drag={t:'resize',id:it.id,x:e.clientX,y:e.clientY,w:it.w,h:it.h,lock:['image','entry'].includes(it.type)&&it.w/it.h||0,moved:false};return}
 if(el){const id=el.dataset.id;if(e.shiftKey)(sel.has(id)?(()=>{const it=byId(id);(it.g?items().filter(x=>x.g===it.g):[it]).forEach(x=>sel.delete(x.id));paint()})():setSel([id],true));else if(!sel.has(id))setSel([id]);
  if(readonly)return;drag={t:'move',x:e.clientX,y:e.clientY,start:[...sel].map(i=>{const it=byId(i);return [it,it.x,it.y]}),moved:false};el.focus({preventScroll:true});return}
 if(e.shiftKey&&!readonly){const [wx,wy]=toWorld(e.clientX,e.clientY);drag={t:'marquee',wx,wy,x:e.clientX,y:e.clientY,base:new Set(sel)};return}
 drag={t:'pan',x:e.clientX,y:e.clientY,vx:V().x,vy:V().y,moved:false}});
view.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y,k=V().k;if(!drag.moved&&Math.hypot(dx,dy)<3&&drag.t!=='marquee')return;drag.moved=true;
 if(drag.t==='pan'){V().x=drag.vx+dx;V().y=drag.vy+dy;applyView()}
 else if(drag.t==='move'){drag.start.forEach(([it,x,y])=>{it.x=Math.round(x+dx/k);it.y=Math.round(y+dy/k);const el=world.querySelector(`[data-id="${CSS.escape(it.id)}"]`);if(el){el.style.left=it.x+'px';el.style.top=it.y+'px'}});handles()}
 else if(drag.t==='resize'){const it=byId(drag.id);let w=Math.max(60,drag.w+dx/k),h=Math.max(40,drag.h+dy/k);if(drag.lock)h=w/drag.lock;it.w=Math.round(w);it.h=Math.round(h);render(it.id);handles()}
 else if(drag.t==='marquee'){const [wx,wy]=toWorld(e.clientX,e.clientY),x0=Math.min(wx,drag.wx),y0=Math.min(wy,drag.wy),x1=Math.max(wx,drag.wx),y1=Math.max(wy,drag.wy);const m=$('mbMarq');const r=view.getBoundingClientRect();m.hidden=false;m.style.cssText=`left:${Math.min(e.clientX,drag.x)-r.left}px;top:${Math.min(e.clientY,drag.y)-r.top}px;width:${Math.abs(dx)}px;height:${Math.abs(dy)}px`;
  sel=new Set(drag.base);items().forEach(i=>{if(i.x<x1&&i.x+i.w>x0&&i.y<y1&&i.y+i.h>y0)sel.add(i.id)});paint()}});
const endDrag=()=>{if(!drag)return;const d=drag;drag=null;$('mbMarq').hidden=true;
 if(d.t==='pan'){if(!d.moved){sel.clear();paint()}else persist()}else if(d.moved&&(d.t==='move'||d.t==='resize')){commit()}};
view.addEventListener('pointerup',endDrag);view.addEventListener('pointercancel',endDrag);
view.addEventListener('wheel',e=>{e.preventDefault();if(e.ctrlKey||e.metaKey)zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*.01));else{V().x-=e.deltaX;V().y-=e.deltaY;applyView()}},{passive:false});
view.addEventListener('dblclick',e=>{const el=e.target.closest('.mbItem');if(!el||readonly)return;const it=byId(el.dataset.id);if(it&&it.type==='note')editNote(it)});
view.addEventListener('contextmenu',e=>e.preventDefault());
function editNote(it){const el=world.querySelector(`[data-id="${CSS.escape(it.id)}"]`);const bg=hexOK(it.bg)?it.bg:'#FFF3A8';el.innerHTML=`<textarea class="mbNoteEd" aria-label="Note text" style="background:${bg};color:${ink(bg)}">${esc(it.text||'')}</textarea>`;const t=el.querySelector('textarea');t.focus();t.select();
 const done=()=>{const v=t.value.slice(0,1000);if(v!==it.text){it.text=v;commit()}render(it.id)};t.addEventListener('blur',done,{once:true});t.addEventListener('keydown',ev=>{ev.stopPropagation();if(ev.key==='Escape')t.blur()});t.addEventListener('pointerdown',ev=>ev.stopPropagation())}

/* selection handle + group frame */
function handles(){const h=$('mbHandle'),f=$('mbFrame');const list=[...sel].map(byId).filter(Boolean);if(!list.length||readonly){h.hidden=f.hidden=true;return}const b=bbox(list);f.hidden=false;f.style.cssText=`left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px`;
 const single=list.length===1;h.hidden=!single;if(single){h.style.left=b.x+b.w+'px';h.style.top=b.y+b.h+'px';h.style.transform=`translate(-50%,-50%) scale(${1/V().k})`}}

/* keyboard */
view.addEventListener('keydown',e=>{if(e.target.closest('textarea,input'))return;const mod=e.ctrlKey||e.metaKey,k=e.key;
 if(k==='Enter'||k===' '){const el=e.target.closest('.mbItem');if(el){e.preventDefault();setSel([el.dataset.id],e.shiftKey)}return}
 if(mod&&k.toLowerCase()==='a'){e.preventDefault();setSel(items().map(i=>i.id));return}
 if(readonly)return;
 if(k==='Delete'||k==='Backspace'){e.preventDefault();del();return}
 if(mod&&k.toLowerCase()==='d'){e.preventDefault();dup();return}
 if(mod&&k.toLowerCase()==='g'){e.preventDefault();e.shiftKey?ungroup():group();return}
 if(mod&&k.toLowerCase()==='z'){e.preventDefault();e.shiftKey?doRedo():doUndo();return}
 if(k===']'){order(1);return}if(k==='['){order(-1);return}
 if(k==='Escape'){sel.clear();paint();return}
 const d=e.shiftKey?20:2;const mv={ArrowLeft:[-d,0],ArrowRight:[d,0],ArrowUp:[0,-d],ArrowDown:[0,d]}[k];if(mv&&sel.size){e.preventDefault();[...sel].map(byId).forEach(i=>{i.x+=mv[0];i.y+=mv[1];render(i.id)});handles();clearTimeout(view._k);view._k=setTimeout(()=>commit(),400)}});

/* ---------- actions ---------- */
const selItems=()=>[...sel].map(byId).filter(Boolean);
function del(){const l=selItems();if(!l.length)return;l.forEach(i=>{if(i.imgId){S.delImage(i.imgId);imgURL.delete(i.imgId)}});const ids=new Set(l.map(i=>i.id));board.items=board.items.filter(i=>!ids.has(i.id));sel.clear();commit();renderAll();say(l.length+' removed. Press Ctrl+Z to undo.')}
function dup(){const l=selItems();if(!l.length)return;const map={},n=[];l.forEach(i=>{const c=Object.assign({},i,{id:S.uid(),x:i.x+24,y:i.y+24,z:nextZ()});if(i.g){map[i.g]=map[i.g]||S.uid();c.g=map[i.g]}board.items.push(c);n.push(c.id)});sel=new Set(n);commit();renderAll()}
function group(){const l=selItems();if(l.length<2)return say('Select two or more items to group.');const g=S.uid();l.forEach(i=>i.g=g);commit();say(l.length+' items grouped.')}
function ungroup(){const l=selItems();l.forEach(i=>delete i.g);commit();say('Ungrouped.')}
function order(dir){const l=selItems();if(!l.length)return;if(dir>0)l.forEach(i=>i.z=nextZ());else{const min=Math.min(...board.items.map(i=>i.z||1));l.forEach((i,n)=>i.z=min-1-n)}commit();renderAll();say(dir>0?'Brought to front.':'Sent to back.')}
function align(how){const l=selItems();if(l.length<2)return say('Select two or more items to align.');const b=bbox(l);l.forEach(i=>{if(how==='l')i.x=b.x;if(how==='r')i.x=b.x+b.w-i.w;if(how==='c')i.x=Math.round(b.x+(b.w-i.w)/2);if(how==='t')i.y=b.y;if(how==='b')i.y=b.y+b.h-i.h;if(how==='m')i.y=Math.round(b.y+(b.h-i.h)/2)});commit();renderAll()}
function arrange(mode){const l=selItems().length>1?selItems():items().slice();if(!l.length)return;const b=bbox(l),ox=b.x,oy=b.y,gap=24;l.sort((a,c)=>a.y-c.y||a.x-c.x);
 if(mode==='grid'){const cols=Math.max(1,Math.round(Math.sqrt(l.length*1.3))),cw=Math.max(...l.map(i=>i.w)),ch=Math.max(...l.map(i=>i.h));l.forEach((i,n)=>{i.x=ox+(n%cols)*(cw+gap);i.y=oy+Math.floor(n/cols)*(ch+gap)})}
 else{const cols=Math.max(1,Math.round(Math.sqrt(l.length*1.2))),W=240,hs=Array(cols).fill(0);l.forEach(i=>{const c=hs.indexOf(Math.min(...hs));const r=i.h/i.w;if(!['note','swatch'].includes(i.type)||true){i.h=Math.round(W*r);i.w=W}i.x=ox+c*(W+gap);i.y=oy+hs[c];hs[c]+=i.h+gap})}
 commit();renderAll();fit(l);say('Arranged as a '+mode+'.')}
function doUndo(){if(!undo.length)return;redo.push(JSON.stringify(board.items));board.items=JSON.parse(undo.pop());sel.clear();persist();renderAll()}
function doRedo(){if(!redo.length)return;undo.push(JSON.stringify(board.items));board.items=JSON.parse(redo.pop());sel.clear();persist();renderAll()}
function addItem(it,at){const r=view.getBoundingClientRect();const [cx,cy]=at||toWorld(r.left+r.width/2,r.top+r.height/2);const base=Object.assign({w:200,h:140},it);const n=S.addItem(board,Object.assign(base,{x:Math.round(cx-base.w/2+(items().length%5)*18),y:Math.round(cy-base.h/2+(items().length%5)*18)}),false);commit();renderAll();setSel([n.id]);return n}

/* ---------- adding things ---------- */
async function addPicture(blob,at){try{if(!/^image\//.test(blob.type))throw Error('That is not an image file.');if(blob.size>20*1024*1024)throw Error('Choose a picture under 20 MB.');
 const bm=await createImageBitmap(blob),w=Math.min(300,bm.width),ar=bm.width/bm.height,id=S.uid();await S.putImage(id,blob);imgURL.set(id,URL.createObjectURL(blob));
 addItem({type:'image',imgId:id,title:(blob.name||'Picture').replace(/\.[a-z0-9]+$/i,''),w,h:Math.round(w/ar),ar},at);bm.close&&bm.close()}catch(e){toast(e.message||'Could not add that picture.')}}
view.addEventListener('dragover',e=>{e.preventDefault()});
view.addEventListener('drop',async e=>{e.preventDefault();if(readonly)return;const at=toWorld(e.clientX,e.clientY);for(const f of [...(e.dataTransfer.files||[])])await addPicture(f,at);const t=e.dataTransfer.getData('text/uri-list')||e.dataTransfer.getData('text/plain');if(t&&!e.dataTransfer.files.length&&safeURL(t))addItem({type:'link',url:safeURL(t),title:'',w:220,h:90},at)});
document.addEventListener('paste',async e=>{if(readonly||e.target.closest('input,textarea'))return;const it=[...(e.clipboardData?.items||[])].find(i=>/^image\//.test(i.type));if(it){e.preventDefault();addPicture(it.getAsFile())}else{const t=e.clipboardData?.getData('text/plain')||'';if(safeURL(t)&&/^https?:\/\//.test(t.trim())){e.preventDefault();addItem({type:'link',url:safeURL(t),title:'',w:220,h:90})}else if(t.trim()){e.preventDefault();addItem({type:'note',text:t.slice(0,600),bg:'#FFF3A8',w:220,h:150})}}});
const pickers={};
function dlg(id){const d=$(id);if(!d.dataset.init){d.dataset.init='1';d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-close]'))d.close()})}return d}
async function catalogue(){if(cat)return cat;try{cat=await (await fetch('catalogue.json')).json()}catch{cat=[]}return cat}
const sprite=e=>{const r=e.image;if(!r||!r.url)return null;const c=r.columns||2,w=r.rows||2,col=r.index%c,row=Math.floor(r.index/c);return {u:r.url,s:`${c*100}% ${w*100}%`,p:`${c===1?0:col/(c-1)*100}% ${w===1?0:row/(w-1)*100}%`,c,r:w,i:r.index}};
async function atlasPicker(){const d=dlg('mbAtlasDlg');d.showModal();const list=await catalogue(),box=$('mbAtlasList'),q=$('mbAtlasQ');
 const draw=()=>{const s=q.value.trim().toLowerCase();const r=list.filter(e=>!s||[e.id,e.title,e.group,e.kind,e.mood,e.desc].join(' ').toLowerCase().includes(s)).slice(0,60);
  box.innerHTML=r.map(e=>{const sp=sprite(e);return `<li><button type="button" data-id="${esc(e.id)}"><span class="th" style="${sp?`background-image:url('${esc(sp.u)}');background-size:${esc(sp.s)};background-position:${esc(sp.p)}`:''}"></span><span><b>${esc(e.title)}</b><small>${esc(e.id)} · ${esc(e.group||'')}</small></span></button></li>`}).join('')||'<li class="hint">Nothing matches.</li>'};
 if(!q.dataset.b){q.dataset.b=1;q.addEventListener('input',draw);box.addEventListener('click',ev=>{const b=ev.target.closest('button[data-id]');if(!b)return;const e=list.find(x=>x.id===b.dataset.id),sp=sprite(e);addItem({type:'entry',ref:e.id,title:e.title,sub:e.group||'',img:sp,w:240,h:sp?200:110});toast('Pinned '+e.title)})}draw();q.focus()}
let kitsP=null;const loadScript=s=>new Promise((res,rej)=>{if(document.querySelector(`script[src="${s}"]`))return res();const t=document.createElement('script');t.src=s;t.onload=res;t.onerror=()=>rej(Error('Could not load '+s));document.head.append(t)});
function loadKits(){return kitsP||(kitsP=(async()=>{for(const f of ['kits/themes.js','kits/kits-a.js','kits/kits-b.js'])await loadScript(f);return window.ThemeKits.list})().catch(e=>{kitsP=null;throw e}))}
async function kitPicker(){const d=dlg('mbKitDlg');d.showModal();const box=$('mbKitList');try{const L=await loadKits();box.innerHTML=L.map(k=>`<li><button type="button" data-id="${esc(k.id)}"><span class="th kitTh">${['bg','surface','accent','accent2','ink'].map(x=>`<i style="background:${k.t[x]}"></i>`).join('')}</span><span><b>${esc(k.name)}</b><small>${esc(k.tagline)}</small></span></button></li>`).join('');
 if(!box.dataset.b){box.dataset.b=1;box.addEventListener('click',ev=>{const b=ev.target.closest('button[data-id]');if(!b)return;const k=ThemeKits.list.find(x=>x.id===b.dataset.id);addItem({type:'kit',ref:k.id,title:k.name,sub:k.tagline,colors:['bg','surface','ink','accent','accent2'].map(x=>k.t[x]),head:k.fonts.head,body:k.fonts.body,css:k.fonts.css,w:240,h:150});toast('Pinned the '+k.name+' kit')})}}catch(e){box.innerHTML='<li class="hint">Theme kits could not be loaded.</li>'}}
let iconIdx=null;const iconSets={};
async function iconPicker(){const d=dlg('mbIconDlg');d.showModal();const sel_=$('mbIconFam'),q=$('mbIconQ'),box=$('mbIconList');
 if(!iconIdx){try{iconIdx=(await (await fetch('icons/index.json')).json()).families}catch{iconIdx=[]}sel_.innerHTML=iconIdx.map(f=>`<option value="${esc(f.id)}">${esc(f.title)}</option>`).join('');sel_.value=iconIdx.find(f=>f.id==='regular')?'regular':iconIdx[0]?.id||''}
 const draw=async()=>{const id=sel_.value;if(!id)return;if(!iconSets[id]){box.innerHTML='<li class="hint">Loading…</li>';try{iconSets[id]=(await (await fetch('icons/sets/'+id+'.json')).json()).icons}catch{iconSets[id]=[]}}
  const s=q.value.trim().toLowerCase(),r=iconSets[id].filter(i=>!s||i.k.includes(s)||i.n.includes(s)).slice(0,90);box.innerHTML=r.map((i,n)=>`<li><button type="button" data-n="${n}" aria-label="${esc(i.n)}"><span class="ic">${i.s}</span></button></li>`).join('')||'<li class="hint">Nothing matches.</li>';box._r=r};
 if(!d.dataset.b){d.dataset.b=1;sel_.onchange=draw;q.oninput=draw;box.addEventListener('click',ev=>{const b=ev.target.closest('button[data-n]');if(!b)return;const i=box._r[+b.dataset.n];addItem({type:'icon',svg:i.s,title:i.n,w:96,h:96,color:'#111318'});toast('Added '+i.n)})}draw();q.focus()}
function swatch(c){addItem({type:'swatch',color:c||'#5B2DFF',title:'',w:120,h:120})}

/* ---------- inspector ---------- */
function inspector(){const box=$('mbInsp'),l=selItems();if(readonly||l.length!==1){box.hidden=true;box.innerHTML='';return}const it=l[0];let h='';
 const field=(k,lab,type='text',extra='')=>`<label class="f"><span>${lab}</span><input type="${type}" data-k="${k}" value="${esc(it[k]??'')}" ${extra}></label>`;
 if(it.type==='note')h=`<label class="f"><span>Text</span><textarea data-k="text" rows="3" maxlength="1000">${esc(it.text)}</textarea></label>${field('bg','Colour','color')}`;
 else if(it.type==='swatch')h=field('color','Colour','color')+field('title','Name','text','maxlength="40"');
 else if(it.type==='link')h=field('url','Address','url','maxlength="1000"')+field('title','Title','text','maxlength="80"')+(safeURL(it.url)?`<a class="btn sm" href="${esc(safeURL(it.url))}" target="_blank" rel="noopener">Open link</a>`:'');
 else if(it.type==='icon')h=field('color','Icon colour','color');
 else h=field('title','Caption','text','maxlength="80"');
 box.hidden=false;box.innerHTML=`<h2>${label(it).split(':')[0]}</h2>${h}`;
 box.oninput=e=>{const k=e.target.dataset.k;if(!k)return;it[k]=e.target.value;if(k==='color'&&it.type==='swatch'&&!hexOK(it.color))return;render(it.id);clearTimeout(box._t);box._t=setTimeout(()=>commit(),400)}}

/* ---------- drawing the board to a canvas (PNG export, colour extraction) ---------- */
function wrapText(x,t,max){const out=[];String(t).split('\n').forEach(p=>{let line='';p.split(/\s+/).filter(Boolean).forEach(w=>{const tl=line?line+' '+w:w;if(x.measureText(tl).width>max&&line){out.push(line);line=w}else line=tl});out.push(line)});return out}
const rr=(c,x,y,w,h,r)=>{r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.closePath()};
const svgImg=(svg,color)=>new Promise(res=>{let s=String(svg).replace(/currentColor/g,color||'#111318');if(!/xmlns=/.test(s))s=s.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s)});
async function drawItem(x,it){const {x:X,y:Y,w:W,h:H}=it;x.save();x.shadowColor='rgba(20,20,30,.18)';x.shadowBlur=14;x.shadowOffsetY=4;
 const card=(f)=>{rr(x,X,Y,W,H,10);x.fillStyle=f||'#fff';x.fill();x.shadowColor='transparent'};
 const text=(t,tx,ty,font,col,max,lh,lines)=>{x.font=font;x.fillStyle=col;x.textBaseline='top';const L=wrapText(x,t,max).slice(0,lines||99);L.forEach((l,n)=>x.fillText(l,tx,ty+n*lh));return L.length*lh};
 if(it.type==='note'){const bg=hexOK(it.bg)?it.bg:'#FFF3A8';card(bg);text(it.text||'',X+14,Y+14,'500 15px Inter, system-ui, sans-serif',ink(bg),W-28,21,Math.floor((H-20)/21))}
 else if(it.type==='swatch'){const c=hexOK(it.color)?it.color:'#888';card(c);text(c.toUpperCase(),X+12,Y+H-34,'700 14px "JetBrains Mono", monospace',ink(c),W-24,16);if(it.title)text(it.title,X+12,Y+H-18,'500 11px Inter, sans-serif',ink(c),W-24,13)}
 else if(it.type==='kit'){card('#fff');x.shadowColor='transparent';const cs=(it.colors||[]).filter(hexOK),sw=(W)/Math.max(1,cs.length);x.save();rr(x,X,Y,W,H,10);x.clip();cs.forEach((c,n)=>{x.fillStyle=c;x.fillRect(X+n*sw,Y,sw+1,H-48)});x.restore();text(it.title||'',X+12,Y+H-42,`600 15px ${it.head||'Inter'}, system-ui, sans-serif`,'#111318',W-24,18,1);text(it.sub||'Theme kit',X+12,Y+H-22,'400 11px Inter, sans-serif','#5F6577',W-24,14,1)}
 else if(it.type==='link'){card('#fff');text(it.title||safeURL(it.url),X+14,Y+14,'700 14px Inter, system-ui, sans-serif','#111318',W-28,18,2);try{text(new URL(it.url).hostname,X+14,Y+H-26,'400 12px Inter, sans-serif','#5F6577',W-28,14,1)}catch{}}
 else if(it.type==='icon'){card('#fff');x.shadowColor='transparent';const i=await svgImg(it.svg,it.color);if(i){const s=Math.min(W,H)*.6;x.drawImage(i,X+(W-s)/2,Y+(H-s)/2,s,s)}}
 else if(it.type==='image'){const im=await imgBitmap(it.imgId);card('#fff');x.shadowColor='transparent';if(im){x.save();rr(x,X,Y,W,H,6);x.clip();const s=Math.max(W/im.width,H/im.height);x.drawImage(im,X+(W-im.width*s)/2,Y+(H-im.height*s)/2,im.width*s,im.height*s);x.restore()}}
 else if(it.type==='entry'){card('#fff');x.shadowColor='transparent';const ah=H-36;if(it.img){const sh=await sheet(it.img.u);if(sh){const c=it.img.c||2,r=it.img.r||2,tw=sh.naturalWidth/c,th=sh.naturalHeight/r,col=it.img.i%c,row=Math.floor(it.img.i/c);x.save();rr(x,X,Y,W,ah+6,10);x.clip();const s=Math.max(W/tw,ah/th);x.drawImage(sh,col*tw,row*th,tw,th,X+(W-tw*s)/2,Y+(ah-th*s)/2,tw*s,th*s);x.restore()}}
  text(it.title||'',X+10,Y+ah+7,'600 12px Inter, sans-serif','#111318',W-20,14,1);text(it.sub||'',X+10,Y+ah+22,'400 10px Inter, sans-serif','#5F6577',W-20,12,1)}
 x.restore()}
const bmCache=new Map();async function imgBitmap(id){if(!id)return null;if(bmCache.has(id))return bmCache.get(id);let b=null;try{const blob=await S.getImage(id);if(blob)b=await createImageBitmap(blob)}catch{}bmCache.set(id,b);return b}
async function renderBoard(maxPx=3200,margin=48){const l=items().slice().sort((a,b)=>(a.z||0)-(b.z||0));if(!l.length)return null;const b=bbox(l),W=b.w+margin*2,H=b.h+margin*2,k=Math.min(2,maxPx/Math.max(W,H)),c=document.createElement('canvas');c.width=Math.round(W*k);c.height=Math.round(H*k);const x=c.getContext('2d');x.scale(k,k);x.fillStyle='#F3F0E8';x.fillRect(0,0,W,H);x.translate(margin-b.x,margin-b.y);for(const it of l)await drawItem(x,it);return c}
$('mbPng').onclick=async()=>{const c=await renderBoard();if(!c)return toast('Add something to the board first.');const bl=await new Promise(r=>c.toBlob(r,'image/png'));const a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=(board.name||'moodboard').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);window.__mbPng={w:c.width,h:c.height,size:bl.size};say('PNG downloaded');toast('PNG downloaded')};

/* ---------- palette from the board ---------- */
async function palette(){const out=new Map();const add=(c,w)=>{if(!hexOK(c))return;c=c.toUpperCase();out.set(c,(out.get(c)||0)+w)};
 items().forEach(i=>{if(i.type==='swatch')add(i.color,5e4);if(i.type==='kit')(i.colors||[]).forEach(c=>add(c,2e4));if(i.type==='note')add(i.bg,6e3);if(i.type==='icon')add(i.color,3e3)});
 const c=await renderBoard(360,0);const picked=[];
 if(c){const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data,bk=new Map();for(let n=0;n<d.length;n+=4){if(d[n+3]<200)continue;const r=d[n],g=d[n+1],b=d[n+2];if(r>236&&g>232&&b>220&&Math.abs(r-243)<8)continue;const key=(r>>4)<<8|(g>>4)<<4|(b>>4),e=bk.get(key)||[0,0,0,0];e[0]++;e[1]+=r;e[2]+=g;e[3]+=b;bk.set(key,e)}
  bk.forEach(e=>{const h=toHex([e[1]/e[0],e[2]/e[0],e[3]/e[0]]);add(h,e[0]*(1+sat(h)*2))})}
 const dist=(a,b)=>{const A=hx(a),B=hx(b);return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2])};
 [...out.entries()].sort((a,b)=>b[1]-a[1]).forEach(([h])=>{if(picked.length<8&&picked.every(p=>dist(p,h)>54))picked.push(h)});return picked}
async function showPalette(){const d=dlg('mbPalDlg');d.showModal();const box=$('mbPalList');box.innerHTML='<li class="hint">Reading the board…</li>';const p=await palette();window.__mbPalette=p;
 box.innerHTML=p.length?p.map(c=>`<li><button type="button" data-c="${c}" style="background:${c};color:${ink(c)}"><b>${c}</b><small>Copy</small></button></li>`).join(''):'<li class="hint">Add pictures, colours or kits first.</li>';
 $('mbPalAdd').disabled=$('mbStyle').disabled=!p.length;
 if(!box.dataset.b){box.dataset.b=1;box.addEventListener('click',e=>{const b=e.target.closest('button[data-c]');if(!b)return;navigator.clipboard?.writeText(b.dataset.c).then(()=>toast('Copied '+b.dataset.c),()=>toast(b.dataset.c))})}}
$('mbPalAdd').onclick=()=>{(window.__mbPalette||[]).slice(0,6).forEach((c,n)=>addItem({type:'swatch',color:c,title:'',w:100,h:100},[ -100+n*110,(Math.max(0,...items().map(i=>i.y+i.h))||0)+80]));$('mbPalDlg').close();fit();toast('Palette added as swatches')};

/* ---------- Make this a style ---------- */
function buildKit(pal){const name=(board.name||'Moodboard').replace(/\bmoodboard\b/i,'').trim()||board.name||'Board';const sorted=pal.slice().sort((a,b)=>lum(a)-lum(b));const darkest=sorted[0],lightest=sorted[sorted.length-1];
 const avg=pal.reduce((s,c)=>s+lum(c),0)/pal.length,dark=avg<.35;
 const bySat=pal.slice().sort((a,b)=>sat(b)-sat(a));let accent=bySat[0],accent2=bySat.find(c=>c!==accent&&Math.hypot(...hx(c).map((v,i)=>v-hx(accent)[i]))>70)||bySat[1]||accent;
 let bg=dark?mix(darkest,'#000000',.45):mix(lightest,'#FFFFFF',.75);if(dark&&lum(bg)>.06)bg=mix(bg,'#000000',.5);if(!dark&&lum(bg)<.8)bg=mix(bg,'#FFFFFF',.6);
 const surface=dark?mix(bg,'#FFFFFF',.07):mix(bg,'#FFFFFF',.7);const inkc=ensure(dark?lightest:darkest,bg,12);const mute=ensure(mix(inkc,bg,.4),bg,4.6);const line=mix(inkc,bg,.82);
 accent=ensure(accent,bg,3);accent2=ensure(accent2,bg,3);
 const kits=items().filter(i=>i.type==='kit'),ents=items().filter(i=>i.type==='entry');let head,bodyF,css;
 if(kits.length){head=kits[0].head;bodyF=(kits[1]||kits[0]).body;css=[...new Set(kits.slice(0,2).map(k=>k.css).filter(Boolean))].join('&')}
 if(!head){const D=ents.map(e=>(cat||[]).find(c=>c.id===e.ref)).find(e=>e&&e.tokens&&e.tokens.font);const fam=D&&D.tokens.font&&!/^system/.test(D.tokens.font)?D.tokens.font.split(',')[0].replace(/['"]/g,'').trim():'';if(fam){head=bodyF=`'${fam}',system-ui,sans-serif`;css='family='+fam.replace(/ /g,'+')+':wght@400;600;700'}}
 if(!head){head="'Fraunces',Georgia,serif";bodyF="'Inter',system-ui,sans-serif";css='family=Fraunces:wght@600;700&family=Inter:wght@400;500;600'}
 const fonts=[...new Set(kits.map(k=>k.title)),...ents.slice(0,3).map(e=>e.title)];
 const id='board-'+(board.name||'style').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,24)+'-'+board.id.slice(0,4);
 return {id,no:'B1',name:name+' style',tagline:`Palette and type drawn from the “${board.name}” moodboard.`,mood:fonts.length?'Built from '+fonts.slice(0,4).join(', '):'Built from your moodboard',feel:'serious',wf:.6,hw:700,scale:1.25,role:'Designer',
  fonts:{head,body:bodyF||head,css},t:{bg,surface,ink:inkc,mute,line,accent,onAccent:best(accent),accent2,radius:'12px',shadow:`0 18px 40px -22px ${mix(inkc,bg,.5)}`,glow:`0 0 0 3px ${accent}55`},
  bg:'swiss',stroke:{w:1.75,cap:'round'},case:'none',bgDesc:'blocks of the board’s colours on a visible grid',
  voice:['Start from what you collected.','Every choice traces back to the board.','Keep what feels true.'],
  dos:['Use the accent once per view.','Keep body text on the ink colour.','Return to the board when unsure.'],donts:['Add colours that are not on the board.','Use the accent for long paragraphs.','Mix more than two typefaces.']}}
let styleKit=null;
$('mbStyle').onclick=async()=>{$('mbPalDlg').close();const p=await palette();if(p.length<2)return toast('Add more colour (pictures, swatches or kits) first.');await catalogue();let ok=true;try{await loadKits()}catch{ok=false}styleKit=buildKit(p);window.__mbKit=styleKit;
 const t=styleKit.t,d=dlg('mbStyleDlg');$('mbStyleBody').innerHTML=`<div class="stylePrev" style="background:${t.bg};color:${t.ink};border-color:${t.line}"><h3 style="font-family:${esc(styleKit.fonts.head)}">${esc(styleKit.name)}</h3><p style="color:${t.mute};font-family:${esc(styleKit.fonts.body)}">${esc(styleKit.tagline)}</p><div class="row">${['bg','surface','ink','mute','line','accent','accent2'].map(k=>`<i title="${k} ${t[k]}" style="background:${t[k]};border:1px solid ${t.line}"></i>`).join('')}</div><span class="btn" style="background:${t.accent};color:${t.onAccent};border-radius:${t.radius}">Accent</span></div><p class="hint">Fonts: ${esc(styleKit.fonts.head.split(',')[0])} / ${esc(styleKit.fonts.body.split(',')[0])}. ${ok?'':'Theme kit code could not load, so the ZIP is unavailable.'}</p>`;
 loadFont(styleKit.fonts.css);$('mbKitZip').disabled=!ok;d.showModal()};
$('mbKitZip').onclick=async()=>{const b=$('mbKitZip');b.disabled=true;try{if(!ThemeKits.zipKit)await loadScript('kits/brand.js');const blob=await ThemeKits.zipKit(styleKit);window.__mbZip={size:blob.size};const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=styleKit.id+'-theme-kit.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Theme kit ZIP downloaded')}catch(e){toast('The kit ZIP could not be built: '+(e.message||e))}finally{b.disabled=false}};
$('mbKitPin').onclick=()=>{const k=styleKit;addItem({type:'kit',ref:k.id,title:k.name,sub:'Made from this board',colors:['bg','surface','ink','accent','accent2'].map(x=>k.t[x]),head:k.fonts.head,body:k.fonts.body,css:k.fonts.css,w:240,h:150});$('mbStyleDlg').close();toast('Style kit added to the board')};
const kitHand=async m=>{try{if(!window.KitHandoff)await loadScript('kits/handoff.js');if(!(window.ThemeKits&&ThemeKits.favicon)&&m==='toSite'){try{await loadScript('kits/brand.js')}catch{}}KitHandoff[m](styleKit)}catch(e){toast('Could not hand the style over: '+(e.message||e))}};
$('mbKitSite').onclick=()=>kitHand('toSite');$('mbKitBrand').onclick=()=>kitHand('toBrand');
$('mbKitCss').onclick=async()=>{try{if(!ThemeKits.css)await loadScript('kits/brand.js');await navigator.clipboard.writeText(ThemeKits.css(styleKit));toast('Tokens copied as CSS')}catch{toast('Could not copy.')}};

/* ---------- share link ---------- */
const b64=u8=>{let s='';u8.forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const unb64=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');const b=atob(s+'==='.slice((s.length+3)%4));return Uint8Array.from(b,c=>c.charCodeAt(0))};
async function pack(o){const raw=new TextEncoder().encode(JSON.stringify(o));if(window.CompressionStream){const cs=new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'));return 'z'+b64(new Uint8Array(await new Response(cs).arrayBuffer()))}return 'p'+b64(raw)}
async function unpack(s){const u=unb64(s.slice(1));if(s[0]==='z'){const ds=new Blob([u]).stream().pipeThrough(new DecompressionStream('deflate-raw'));return JSON.parse(await new Response(ds).text())}return JSON.parse(new TextDecoder().decode(u))}
async function share(){const drop=items().filter(i=>i.type==='image').length;const o={n:board.name,i:items().map(i=>{const c=Object.assign({},i);delete c.imgId;if(c.type==='image'){c.missing=true}if(c.svg&&c.svg.length>3000)c.svg='';return c})};const code=await pack(o);const url=new URL('moodboard.html',location.href).href+'#b='+code;
 const len=url.length;$('mbShareUrl').value=url;$('mbShareNote').textContent=(len>8000?`This link is long (${Math.round(len/1000)} kB) and may not open everywhere. `:'')+(drop?`${drop} uploaded picture${drop>1?'s are':' is'} not included, because pictures stay in this browser. `:'')+'Anyone with the link sees a view-only copy and can save it to their own browser.';dlg('mbShareDlg').showModal();window.__mbShare=len}
$('mbShareCopy').onclick=()=>{const v=$('mbShareUrl').value;navigator.clipboard?.writeText(v).then(()=>toast('Link copied'),()=>{$('mbShareUrl').select();toast('Press Ctrl+C to copy')})};

/* ---------- templates ---------- */
const N=(text,x,y,bg='#FFF3A8',w=220,h=130)=>({type:'note',text,x,y,w,h,bg});const SW=(color,x,y,title='')=>({type:'swatch',color,x,y,w:110,h:110,title});
const TEMPLATES={
 blank:{name:'Blank board',desc:'An empty canvas.',make:()=>[]},
 brand:{name:'Brand exploration',desc:'Personality, palette, type and references to find a direction.',make:()=>[
  N('BRAND EXPLORATION\nWho are we, in three words?',0,0,'#FFE08A',280,120),N('Personality\n• \n• \n• ',320,0,'#FFF3A8'),N('Audience\nWho is this for, and what do they need to feel?',560,0,'#FFF3A8'),
  SW('#111318',0,170,'Ink'),SW('#F3F0E8',130,170,'Paper'),SW('#5B2DFF',260,170,'Accent'),SW('#FF7AC6',390,170,'Support'),
  N('Typography\nPin a kit or an atlas type pairing here.',0,310,'#D9F0FF',280,120),N('Logo and mark\nDrop sketches and references.',320,310,'#D9F0FF'),N('Voice\nHow do we sound? Write three example lines.',560,310,'#D9F0FF'),
  N('Pin atlas styles you love →\nUse “Add” > Atlas entry, or “Pin to moodboard” in the catalogue.',0,470,'#E4F7DC',400,90)]},
 campaign:{name:'Campaign',desc:'The idea, the line, the channels and the look.',make:()=>[
  N('THE IDEA\nOne sentence a stranger would repeat.',0,0,'#FFE08A',280,130),N('The line\nHeadline options:\n1. \n2. ',320,0,'#FFF3A8'),N('Audience and moment',560,0,'#FFF3A8',200,130),
  N('Channels\nSocial · Email · Landing page · Out of home',0,170,'#D9F0FF',280,100),N('Key dates\nBrief · First look · Launch · Review',320,170,'#D9F0FF',280,100),
  SW('#FF4D4D',0,310,'Hero'),SW('#FFD166',130,310,'Warm'),SW('#06D6A0',260,310,'Fresh'),SW('#118AB2',390,310,'Cool'),SW('#073B4C',520,310,'Deep'),
  N('Visual references\nPin atlas styles, drop photos.',0,450,'#E4F7DC',400,100),N('Avoid\nWhat would make this feel off-brand?',440,450,'#FAD7D4',240,100)]},
 website:{name:'Website redesign',desc:'What works now, what to change, and the direction.',make:()=>[
  N('WEBSITE REDESIGN\nGoal in one line:',0,0,'#FFE08A',280,120),N('Keep\n• \n• ',320,0,'#E4F7DC',200,130),N('Change\n• \n• ',560,0,'#FAD7D4',200,130),
  {type:'link',url:'https://example.com',title:'Current site (replace this link)',x:0,y:160,w:260,h:90},N('Sitemap\nHome · Product · Pricing · About · Contact',300,160,'#D9F0FF',260,100),N('Key pages and the one action each should drive',600,160,'#D9F0FF',200,100),
  N('Direction\nPin atlas design systems, art styles and theme kits here.',0,290,'#FFF3A8',320,110),SW('#0B1220',360,290,'Background'),SW('#E8EEF9',490,290,'Text'),SW('#4F8CFF',620,290,'Action'),
  N('Components to rethink\nNavigation · Hero · Cards · Forms',0,430,'#FFF3A8',320,100),N('Open questions\n• \n• ',360,430,'#FFF3A8',260,100)]}};
function applyTemplate(id,bd){bd=bd||board;const t=TEMPLATES[id]||TEMPLATES.blank;t.make().forEach(i=>S.addItem(bd,Object.assign({w:200,h:140},i),false));}

/* ---------- boards list and header ---------- */
function projectName(){if(!board.project)return '';try{const l=JSON.parse(localStorage.getItem('atlas-projects-v1')||'[]');const p=l.find(x=>x.id===board.project);return p?p.name:''}catch{return ''}}
function upd(){if(!board)return;$('mbName').value=board.name;const pn=projectName();$('mbProj').textContent=pn?'Project: '+pn:'';$('mbProj').hidden=!pn;
 const n=sel.size;['mbDel','mbDup','mbFront','mbBack','mbGroup','mbUngroup'].forEach(id=>$(id).disabled=readonly||!n);document.querySelectorAll('[data-align]').forEach(b=>b.disabled=readonly||n<2);$('mbUndo').disabled=readonly||!undo.length;$('mbRedo').disabled=readonly||!redo.length;
 $('mbCount').textContent=items().length+' item'+(items().length===1?'':'s')+(n?` · ${n} selected`:'');if(n)say(n+' selected')}
function boardsMenu(){const l=S.list();$('mbBoards').innerHTML=l.map(b=>`<li><a href="moodboard.html?board=${b.id}"${b.id===board.id?' aria-current="page"':''}>${esc(b.name)} <small>${b.items.length} items${b.project?' · project':''}</small></a></li>`).join('')||'<li class="hint">No boards yet.</li>'}
async function open(b){board=b;sel.clear();undo=[];redo=[];world.querySelectorAll('.mbItem').forEach(e=>e.remove());await catalogue().catch(()=>{});renderAll();boardsMenu();if(!b._fit){b._fit=1;if(items().length&&!b.view.k_set){fit();}}document.title=b.name+' · Moodboard · Visual & Motion Atlas';}
function newBoard(){const d=dlg('mbNewDlg');$('mbNewTpl').innerHTML=Object.entries(TEMPLATES).map(([k,t],n)=>`<label class="tpl"><input type="radio" name="tpl" value="${k}" ${n===1?'checked':''}><span><b>${esc(t.name)}</b><small>${esc(t.desc)}</small></span></label>`).join('');$('mbNewName').value='';d.showModal();$('mbNewName').focus()}
$('mbNewForm').onsubmit=e=>{e.preventDefault();const tpl=document.querySelector('input[name=tpl]:checked')?.value||'blank';const b=S.create({name:$('mbNewName').value.trim()||TEMPLATES[tpl].name,project:new URLSearchParams(location.search).get('project')||''});applyTemplate(tpl,b);S.save(b);$('mbNewDlg').close();history.replaceState(null,'','moodboard.html?board='+b.id);open(b).then(()=>fit())};

/* ---------- wiring ---------- */
const on=(id,fn)=>$(id).addEventListener('click',fn);
on('mbAddAtlas',atlasPicker);on('mbAddKit',kitPicker);on('mbAddIcon',iconPicker);on('mbAddColour',()=>swatch());on('mbAddNote',()=>{const n=addItem({type:'note',text:'New note',bg:'#FFF3A8',w:200,h:130});editNote(n)});
on('mbAddLink',()=>{const u=safeURL(prompt('Paste a link (https://…)')||'');if(u)addItem({type:'link',url:u,title:'',w:220,h:90})});
$('mbUpload').addEventListener('change',async e=>{for(const f of [...e.target.files])await addPicture(f);e.target.value=''});
on('mbDel',del);on('mbDup',dup);on('mbFront',()=>order(1));on('mbBack',()=>order(-1));on('mbGroup',group);on('mbUngroup',ungroup);on('mbUndo',doUndo);on('mbRedo',doRedo);
document.querySelectorAll('[data-align]').forEach(b=>b.addEventListener('click',()=>align(b.dataset.align)));
on('mbGrid',()=>arrange('grid'));on('mbMasonry',()=>arrange('masonry'));on('mbPalette',showPalette);on('mbShare',share);on('mbNew',newBoard);
on('mbFit',()=>fit(selItems().length?selItems():null));on('mbIn',()=>{const r=view.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,1.25)});on('mbOut',()=>{const r=view.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,.8)});
on('mbEmptyNew',newBoard);
$('mbName').addEventListener('change',()=>{if(readonly)return;board.name=$('mbName').value.trim().slice(0,100)||'Untitled moodboard';persist();boardsMenu();document.title=board.name+' · Moodboard'});
on('mbDelBoard',()=>{if(!confirm('Delete the board “'+board.name+'”? This cannot be undone.'))return;items().forEach(i=>i.imgId&&S.delImage(i.imgId));S.remove(board.id);location.href='moodboard.html'});
on('mbSaveCopy',()=>{const b=S.create({name:board.name+' (copy)'});board.items.forEach(i=>S.addItem(b,Object.assign({},i,{missing:i.missing}),false));S.save(b);location.href='moodboard.html?board='+b.id});
const bm=$('mbBoardsMenu');document.addEventListener('click',e=>{if(bm.open&&!bm.contains(e.target))bm.open=false});
addEventListener('resize',()=>handles());

/* ---------- start ---------- */
async function start(){const q=new URLSearchParams(location.search),h=location.hash.match(/^#b=(.+)$/);
 if(h){try{const o=await unpack(h[1]);readonly=true;document.body.classList.add('ro');board={id:'shared',name:String(o.n||'Shared moodboard').slice(0,100),items:(o.i||[]).slice(0,300).map(i=>Object.assign({},i,{id:String(i.id||S.uid()).replace(/[^\w-]/g,'')})),view:{x:0,y:0,k:1},z:50};
   board.items.forEach(i=>{if(i.type==='link')i.url=safeURL(i.url);if(i.type==='entry'&&i.img&&!/^assets\//.test(i.img.u||''))i.img=null;if(i.svg&&/<script|on\w+=/i.test(i.svg))i.svg=''});
   $('mbRoBar').hidden=false;await open(board);await new Promise(r=>setTimeout(r,50));fit();return}catch{toast('That share link could not be read.')}}
 let b=q.get('board')&&S.get(q.get('board'));const proj=q.get('project');
 if(!b&&proj){b=S.list().find(x=>x.project===proj);if(!b){let name='Moodboard';try{const l=JSON.parse(localStorage.getItem('atlas-projects-v1')||'[]');name=((l.find(x=>x.id===proj)||{}).name||'Project')+' moodboard'}catch{}b=S.create({name,project:proj})}}
 if(!b)b=S.list()[0];
 if(!b){b=S.create({name:'My first moodboard'});applyTemplate('brand',b);S.save(b);b.view={x:0,y:0,k:1}}
 await open(b);if(items().length)fit();if(q.get('new'))newBoard();window.MoodBoard={board:()=>board,items,select:setSel,renderBoard,palette,buildKit,ready:true}}
window.MoodBoardReady=start().then(()=>{window.MoodBoard=window.MoodBoard||{board:()=>board,items,select:setSel,renderBoard,palette,buildKit,ready:true};window.MoodBoard.ready=true});
})();
