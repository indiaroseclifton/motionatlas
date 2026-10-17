'use strict';
/* 01 interface system · behaviour for u- components. Needs 01.js (for O1.Sound, O1.decode, O1.reduce) loaded first.
   UI.icon(name) · UI.glyph(seed) · UI.toast(title,text,kind) · UI.palette.open() · UI.wire(root)
   Markup hooks: [data-tabs] [data-seg] table[data-sortable] [data-menu] [data-open-dialog] [data-close-dialog] [data-range] */
window.UI=(()=>{
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const S=()=>window.O1&&O1.Sound||{tick(){},click(){},chirp(){},confirm(){},buzz(){},deny(){}};
 /* ---------- icons: 24px grid, 1.5 stroke, square caps ---------- */
 const P={
  chat:'M4 5h16v11H9l-5 4z',agents:'M12 3v3M12 18v3M3 12h3M18 12h3M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  skills:'M4 7h10M4 12h16M4 17h7M17 4v6M20 7h-6',models:'M12 3 3 8l9 5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5',plug:'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4',
  settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1',
  search:'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20',plus:'M12 5v14M5 12h14',home:'M4 11 12 4l8 7M6 9.5V20h12V9.5',
  tasks:'M4 6h3M4 12h3M4 18h3M10 6h10M10 12h10M10 18h10',clients:'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18.5 14a6 6 0 0 1 3 6',
  inbox:'M3 13h5l1.5 3h5L16 13h5M5 5h14l2 8v6H3v-6z',chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',bolt:'M13 2 4 14h7l-1 8 9-12h-7z',
  file:'M6 2h8l5 5v15H6zM14 2v5h5',play:'M7 4v16l13-8z',pause:'M7 4h3v16H7zM14 4h3v16h-3z',close:'M6 6l12 12M18 6 6 18',more:'M5 12h.01M12 12h.01M19 12h.01',
  arrow:'M4 12h15M13 6l6 6-6 6',check:'M5 12.5 9.5 17 19 7.5',warn:'M12 3 2 20h20zM12 10v4M12 17h.01',user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5a7.5 7.5 0 0 1 15 0',
  logout:'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11',command:'M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z',menu:'M4 7h16M4 12h16M4 17h16',
  globe:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',shield:'M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z',
  clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',filter:'M3 5h18l-7 8v6l-4 2v-8z',send:'M4 12 20 4l-6 16-3-7z',attach:'M20 11.5 12 19.5a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7',
  mic:'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',sliders:'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4',
  grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',layers:'M12 3 2 8l10 5 10-5zM2 16l10 5 10-5',bell:'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0',
  route:'M5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 15V9a3 3 0 0 1 3-3h7M19 9v6a3 3 0 0 1-3 3H9',
  spark:'M3 17l5-6 4 3 5-8 4 5',copy:'M8 8h12v12H8zM16 8V4H4v12h4',refresh:'M20 7v5h-5M4 17v-5h5M5.5 9a7 7 0 0 1 12-2.5L20 12M18.5 15a7 7 0 0 1-12 2.5L4 12',
  doc:'M7 3h10v18H7zM10 8h4M10 12h4M10 16h2',briefcase:'M3 8h18v12H3zM8 8V5h8v3M3 13h18',calendar:'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  eye:'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',lock:'M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11'};
 function icon(n,cls=''){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"${cls?` class="${cls}"`:''}><path d="${P[n]||P.more}"/></svg>`}
 /* ---------- glyph: a symmetric 5x5 binary identicon for each agent, model or person ---------- */
 function hash(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
 function glyph(seed,{hue}={}){const h=hash(seed);const cols=['#7FE7F7','#3CF29A','#A98BFF','#FFB547','#DDFBFF'];const c=hue||cols[h%5];let r='';
  for(let y=0;y<5;y++)for(let x=0;x<3;x++){if((h>>(y*3+x))&1){r+=`<rect x="${4+x*4}" y="${4+y*4}" width="3.4" height="3.4" fill="${c}"/>`;if(x<2)r+=`<rect x="${4+(4-x)*4}" y="${4+y*4}" width="3.4" height="3.4" fill="${c}"/>`}}
  return `<svg viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" fill="#141920"/>${r}</svg>`}
 /* ---------- toast ---------- */
 let host;function toast(title,text='',kind=''){if(!host){host=document.createElement('div');host.className='u-toasts';host.setAttribute('role','status');host.setAttribute('aria-live','polite');document.body.append(host)}
  const t=document.createElement('div');t.className='u-toast '+kind;t.innerHTML=`<div><b></b><span></span></div><button type="button" aria-label="Dismiss">×</button>`;t.querySelector('b').textContent=title;t.querySelector('span').textContent=text;
  t.querySelector('button').onclick=()=>t.remove();host.append(t);(kind==='err'?S().buzz:kind==='ok'?S().confirm:S().chirp).call(S());setTimeout(()=>t.remove(),5200);return t}
 /* ---------- command palette ---------- */
 const palette=(()=>{let dlg,list,input,items=[],sel=0,shown=[];
  function build(){dlg=document.createElement('dialog');dlg.className='u-dialog u-palette';dlg.setAttribute('aria-label','Command palette');
   dlg.innerHTML=`<div class="q">${icon('command')}<input type="text" placeholder="Type a command or search…" aria-label="Command" role="combobox" aria-expanded="true" aria-controls="u-pal-list" autocomplete="off"><kbd>esc</kbd></div><ul id="u-pal-list" role="listbox"></ul><div class="ft"><span>↑↓ move</span><span>↵ run</span><span>esc close</span></div>`;
   document.body.append(dlg);list=$('ul',dlg);input=$('input',dlg);input.oninput=()=>{sel=0;render()};
   input.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(shown.length-1,sel+1);render(false);S().tick()}else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(0,sel-1);render(false);S().tick()}else if(e.key==='Enter'){e.preventDefault();run(shown[sel])}};
   list.onclick=e=>{const li=e.target.closest('li[data-i]');if(li)run(shown[+li.dataset.i])};dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()})}
  function render(rebuild=true){const q=input.value.trim().toLowerCase();if(rebuild)shown=items.filter(i=>!q||(i.label+' '+(i.group||'')+' '+(i.keys||'')).toLowerCase().includes(q));
   list.innerHTML=shown.length?shown.map((i,k)=>`<li role="option" id="u-pal-${k}" data-i="${k}" aria-selected="${k===sel}">${icon(i.icon||'arrow')}<span>${i.label}</span><span class="g">${i.group||''}</span></li>`).join(''):'<li class="empty" role="presentation">Nothing matches. Try another word.</li>';
   input.setAttribute('aria-activedescendant',shown.length?'u-pal-'+sel:'');const a=$('[aria-selected=true]',list);a&&a.scrollIntoView({block:'nearest'})}
  function run(i){if(!i)return;dlg.close();S().click();setTimeout(()=>i.run&&i.run(),60)}
  function open(){if(!dlg)build();input.value='';sel=0;render();dlg.showModal();input.focus();S().chirp()}
  addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();dlg&&dlg.open?dlg.close():open()}});
  return {open,set(v){items=v},add(v){items.push(...v)}}})();
 /* ---------- wiring ---------- */
 function tabs(root){$$('[data-tabs]',root).forEach(t=>{const btns=$$('[role=tab]',t);btns.forEach((b,i)=>{b.onclick=()=>select(i);b.onkeydown=e=>{const k={ArrowRight:1,ArrowLeft:-1}[e.key];if(k){e.preventDefault();const n=(i+k+btns.length)%btns.length;btns[n].focus();select(n)}}});
  function select(i){btns.forEach((b,k)=>{b.setAttribute('aria-selected',k===i);b.tabIndex=k===i?0:-1;const p=document.getElementById(b.getAttribute('aria-controls'));if(p)p.hidden=k!==i});S().tick();t.dispatchEvent(new CustomEvent('tab',{detail:i}))}})}
 function seg(root){$$('[data-seg]',root).forEach(g=>{g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',g).forEach(x=>x.setAttribute('aria-pressed',x===b));S().tick();g.dispatchEvent(new CustomEvent('change',{detail:b.dataset.v||b.textContent}))})})}
 function sortable(root){$$('table[data-sortable]',root).forEach(tb=>{$$('th[data-key]',tb).forEach((th,ci)=>{const b=document.createElement('button');b.type='button';b.innerHTML=th.innerHTML;th.innerHTML='';th.append(b);
  b.onclick=()=>{const dir=th.getAttribute('aria-sort')==='ascending'?'descending':'ascending';$$('th',tb).forEach(x=>x.removeAttribute('aria-sort'));th.setAttribute('aria-sort',dir);const idx=[...th.parentElement.children].indexOf(th);const body=tb.tBodies[0];
   const rows=[...body.rows].sort((a,b)=>{const x=a.cells[idx].dataset.v??a.cells[idx].textContent,y=b.cells[idx].dataset.v??b.cells[idx].textContent;const nx=parseFloat(x),ny=parseFloat(y);const c=!isNaN(nx)&&!isNaN(ny)?nx-ny:x.localeCompare(y);return dir==='ascending'?c:-c});rows.forEach(r=>body.append(r));S().tick()}})})}
 let openMenu=null;function menus(root){$$('[data-menu]',root).forEach(b=>{b.setAttribute('aria-haspopup','menu');b.setAttribute('aria-expanded','false');b.onclick=e=>{e.stopPropagation();const m=document.getElementById(b.dataset.menu);if(!m)return;if(openMenu===m){close();return}close();const r=b.getBoundingClientRect();m.hidden=false;m.style.top=(r.bottom+6+scrollY)+'px';m.style.left=Math.max(8,Math.min(innerWidth-m.offsetWidth-8,r.right-m.offsetWidth+scrollX))+'px';b.setAttribute('aria-expanded','true');openMenu=m;m._btn=b;$('button',m)?.focus();S().tick()}})}
 function close(){if(openMenu){openMenu.hidden=true;openMenu._btn?.setAttribute('aria-expanded','false');openMenu=null}}
 document.addEventListener('click',e=>{if(openMenu&&!openMenu.contains(e.target))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&openMenu){const b=openMenu._btn;close();b?.focus()}});
 function dialogs(root){$$('[data-open-dialog]',root).forEach(b=>b.onclick=()=>{const d=document.getElementById(b.dataset.openDialog);d?.showModal();S().chirp()});$$('[data-close-dialog]',root).forEach(b=>b.onclick=()=>b.closest('dialog')?.close())}
 function ranges(root){$$('input[type=range].u-range',root).forEach(r=>{const f=()=>{const v=(r.value-r.min)/(r.max-r.min)*100;r.style.setProperty('--v',v+'%');const o=r.dataset.out&&document.getElementById(r.dataset.out);if(o)o.textContent=r.value+(r.dataset.unit||'')};r.addEventListener('input',f);f()})}
 function glyphs(root){$$('[data-glyph]',root).forEach(g=>{g.innerHTML=glyph(g.dataset.glyph)});$$('[data-icon]',root).forEach(el=>{if(!el.querySelector('svg'))el.insertAdjacentHTML('afterbegin',icon(el.dataset.icon))})}
 function burger(root){$$('.u-burger',root).forEach(b=>b.onclick=()=>{const a=b.closest('.u-app');a.classList.toggle('nav-open');b.setAttribute('aria-expanded',a.classList.contains('nav-open'))})}
 function wire(root=document){glyphs(root);tabs(root);seg(root);sortable(root);menus(root);dialogs(root);ranges(root);burger(root)}
 /* ---------- small helpers ---------- */
 function spark(c,data,{color='#7FE7F7',fill=true}={}){const d=Math.min(2,devicePixelRatio||1),w=c.clientWidth,h=c.clientHeight;c.width=w*d;c.height=h*d;const x=c.getContext('2d');x.scale(d,d);const mx=Math.max(...data),mn=Math.min(...data);const p=(v,i)=>[i/(data.length-1)*w,h-2-(v-mn)/((mx-mn)||1)*(h-4)];
  x.beginPath();data.forEach((v,i)=>{const [a,b]=p(v,i);i?x.lineTo(a,b):x.moveTo(a,b)});x.strokeStyle=color;x.lineWidth=1.3;x.stroke();if(fill){x.lineTo(w,h);x.lineTo(0,h);x.closePath();const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,color+'33');g.addColorStop(1,color+'00');x.fillStyle=g;x.fill()}}
 const fmt=n=>Number(n).toLocaleString('en-GB'),pad=n=>String(n).padStart(2,'0'),now=()=>{const d=new Date();return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`};
 return {icon,glyph,toast,palette,wire,spark,fmt,now,$,$$,close};
})();
