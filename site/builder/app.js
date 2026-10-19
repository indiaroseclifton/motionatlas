'use strict';
/* Page builder app: library, page outline and editor, styles, AI, saved pages, preview and export.
   Data: PB_LIB (blocks.js, generated), PB.styles (styles.js), PB.extraTypes (extras.js).
   Page state: {id,name,brand,title,style,pair,blocks:[{uid,id,vals}]}. */
(()=>{
const PB=window.PB,LIB=window.PB_LIB;if(!PB||!LIB||!PB.styles){document.body.insertAdjacentHTML('afterbegin','<p style="padding:20px">The page builder could not load its library. Reload the page.</p>');return}
const SITE='https://motionatlas-ten.vercel.app/',ABS=new URL('./',location.href).href;
const KEY='atlas-page-builder-v2',OLD='atlas-page-builder',UIKEY='atlas-page-builder-ui';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=PB.esc,rows=PB.rows;
const B=Object.fromEntries(LIB.blocks.map(b=>[b.id,b]));
const def=id=>B[id]||PB.extraById[id];
const isX=id=>!!PB.extraById[id];
const uidGen=()=>'b'+Math.random().toString(36).slice(2,8);
const clone=x=>JSON.parse(JSON.stringify(x));
const GROUPS=['Navigation','Heroes','Features','Proof','Sell','Story','Content','Endings','Fonts'];

/* ---------- templates ---------- */
const T=(name,brand,style,title,blocks)=>({name,brand,style,title,pair:-1,blocks:blocks.map(x=>typeof x==='string'?{uid:uidGen(),id:x,vals:{}}:{uid:uidGen(),id:x[0],vals:x[1]})});
const TEMPLATES=[
 ()=>T('Recipe channel','Saffron','noir','Saffron · recipes filmed like still lifes',['nav','hero-film','statement','sec-bento','stats','sec-testimonials','sec-pricing','sec-faq','newsletter','sec-footer']),
 ()=>T('Product launch','Signal','signal','Signal · find the signal in every call',[['announce',{text:'Version 3 is out: themes that grow on their own.',link:'Read the notes'}],['nav',{l1:'Product',l2:'Customers',l3:'Pricing',cta:'Start free'}],['hero-film',{film:'light-threads',kicker:'Version 3 is out',heading:'Find the signal in every call.',intro:'Signal listens to customer calls, pulls out what people asked for and threads it into your roadmap.',b1:'Start free',b2:'See how it works'}],['sec-logos',{kicker:'Trusted by',heading:'Product teams in 31 countries.'}],['feature-grid',{kicker:'Product',heading:'Every conversation, untangled.',intro:'Transcripts, themes and quotes in one place, linked to the moment someone said it.',items:'chat | Every call, transcribed | Calls from Zoom, Meet and the phone arrive as searchable text within minutes.\nspark | Themes that grow | Requests branch into themes as calls come in, so patterns show up early.\nusers | Quotes with context | Every quote links to the second it was said, with who said it.\nchart | Weekly digest | A Friday summary of what changed, sent to the whole product team.\nlock | Private by default | Recordings stay in your region; nothing trains anyone else’s model.\nbolt | Roadmap sync | Push themes to Linear or Jira with the evidence attached.'}],['x-component',{cid:'C20',heading:'Find anything in a keystroke.',kicker:'Command palette',intro:'Press ⌘K anywhere to jump to a call, a theme or a customer.'}],['compare',{heading:'Why teams switch from spreadsheets.',them:'Spreadsheet',rows:'Calls transcribed automatically | yes | no\nThemes grouped as they appear | yes | no\nQuotes linked to the moment | yes | no\nShared with the whole team | yes | yes\nWeekly digest | yes | no'}],['sec-pricing',{kicker:'Pricing',heading:'Start small. Listen more.',intro:'Every plan includes transcripts and quotes. Change or cancel at any time.',p1:'Starter',p2:'Team',p3:'Enterprise'}],['sec-faq',{heading:'Before you start listening.',button:'Talk to us'}],['cta-band',{heading:'Hear it before it’s loud.',button:'Start free'}],['footer-columns',{line:'Customer calls, untangled.'}]]),
 ()=>T('Studio portfolio','Fold','studio','Fold · paper sculpture studio',[['nav-center',{l1:'Work',l2:'Studio',l3:'Journal',cta:'Commission'}],['hero-3d',{kicker:'Paper, light and patience',heading:'Objects made slowly, filmed carefully.',intro:'A small studio making paper sculpture for shop windows, book covers and film.',b1:'See the work',b2:'Commission a piece',img1:'shelf/origami.webp',img2:'shelf/owl.webp',img3:'shelf/dove.webp'}],['statement',{kicker:'How we work',text:'Every piece starts as a single sheet. We cut, score and fold by hand, then light it like a film set, so the shadows do half the work.'}],'gallery',['case-study',{client:'Case study · Larder & Co',heading:'A window display that stopped traffic on Regent Street.',img:'films/paper-bird.jpg',alt:'A paper bird mid-flight'}],['sec-logos',{kicker:'Made for',heading:'Shop windows, book covers and film titles.'}],'team',['sec-contact',{heading:'Tell us about the piece.',intro:'A short note is plenty. We reply within two working days with questions and a rough timeline.',email:'studio@example.com',address:'Unit 4, Mill Yard, Bristol'}],['sec-footer',{news:'A new piece, once a month.'}]]),
 ()=>T('Neon launch (theme kit)','Afterglow','kit:synthwave','Afterglow · a synth record label',[['x-kitbg',{kit:'synthwave',kicker:'New album out Friday',heading:'Drive into the night.',intro:'Twelve tracks recorded on analogue synths in a garage in Rotterdam.',b1:'Pre-save the album',b2:'Watch the video'}],['marquee',{words:'Afterglow\nVol. 3\nOut Friday\nOn vinyl'}],['feature-rows',{kicker:'The record',heading:'Made at night, mixed at dawn.'}],['x-interaction',{iid:'ring-carousel',kicker:'Artwork',heading:'Every sleeve, hand-lettered.',height:'640'}],['x-kitasset',{kit:'synthwave',asset:'pattern',caption:'Tour dates announced soon'}],'newsletter','footer-columns']),
 ()=>T('App on a design system','Ledger','ds:D46','Ledger · calm personal finance',[['nav',{l1:'Features',l2:'Security',l3:'Pricing',cta:'Get the app'}],['hero-center',{badge:'New',news:'Shared budgets for couples',heading:'Money, without the knot in your stomach.',intro:'Ledger sorts every payment, shows what’s safe to spend and nudges you before bills land.',b1:'Get the app',b2:'See how it works',proof:'Rated 4.8 by 22,000 people'}],['x-icons',{family:'regular',heading:'The quiet details.',kicker:'Features'}],['x-component',{cid:'C35',kicker:'Goals',heading:'Watch the savings fill up.',intro:'Set a goal and Ledger moves a little across each payday.'}],['stats',{stats:'£412 | saved in the first three months, on average\n22,000 | people budgeting with Ledger\n0 | adverts, ever\n4.8 | average rating'}],['quote',{quote:'For the first time I know what I can spend on a Thursday without opening four apps.',name:'Hannah Cole',role:'Teacher, Manchester',initials:'HC'}],'app-download',['pricing-tiers',{heading:'Free to start. Fair after that.'}],'footer-columns'])
];

/* ---------- storage ---------- */
let store,page,open=null,hist=[],fut=[],lastSnap='';
function blank(){return {id:'p'+Date.now().toString(36),name:'Untitled page',brand:'Brand',title:'',style:'studio',pair:-1,blocks:[]}}
function fixBlocks(p){p.blocks=(p.blocks||[]).filter(b=>b&&def(b.id)).map(b=>({uid:b.uid||uidGen(),id:b.id,vals:b.vals||{}}));if(p.pair==null)p.pair=-1;return p}
function loadStore(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.pages&&Object.keys(s.pages).length){Object.values(s.pages).forEach(fixBlocks);return s}}catch(e){}
 const s={cur:null,pages:{}};let first=null;
 try{const o=JSON.parse(localStorage.getItem(OLD));if(o&&o.blocks){first={...blank(),name:o.brand||'My page',brand:o.brand,title:o.title,style:o.style||'noir',blocks:o.blocks}}}catch(e){}
 if(!first){const t=TEMPLATES[0]();first={...blank(),...t}}
 fixBlocks(first);s.pages[first.id]=first;s.cur=first.id;return s}
function persist(){page.updated=Date.now();try{localStorage.setItem(KEY,JSON.stringify(store))}catch(e){}}
store=loadStore();page=store.pages[store.cur]||Object.values(store.pages)[0];store.cur=page.id;
const ui=(()=>{try{return JSON.parse(localStorage.getItem(UIKEY))||{}}catch(e){return {}}})();
const saveUI=()=>{try{localStorage.setItem(UIKEY,JSON.stringify(ui))}catch(e){}};

/* ---------- history ---------- */
const snap=()=>JSON.stringify({...page,updated:0});
lastSnap=snap();
function commit(){const s=snap();if(s===lastSnap)return;hist.push(lastSnap);if(hist.length>80)hist.shift();fut=[];lastSnap=s;persist();histUI()}
let typing=0;function commitSoon(){clearTimeout(typing);typing=setTimeout(commit,600)}
function restore(s){const p=JSON.parse(s);Object.keys(page).forEach(k=>delete page[k]);Object.assign(page,p);store.pages[page.id]=page;lastSnap=s;persist();refresh()}
function undo(){clearTimeout(typing);commit();if(!hist.length)return say('Nothing to undo');fut.push(lastSnap);restore(hist.pop());histUI();say('Undone')}
function redo(){if(!fut.length)return say('Nothing to redo');hist.push(lastSnap);restore(fut.pop());histUI();say('Redone')}
function histUI(){$('#undoBtn').disabled=!hist.length;$('#redoBtn').disabled=!fut.length}

/* ---------- values and templating ---------- */
const fieldsOf=d=>d.fields||[];
function val(blk,k){const d=def(blk.id),f=fieldsOf(d).find(f=>f.k===k);return blk.vals[k]!=null?blk.vals[k]:f?f.def:''}
function vals(blk){const o={};fieldsOf(def(blk.id)).forEach(f=>o[f.k]=val(blk,f.k));return o}
const glyph=n=>{const d=LIB.glyphs[n]||LIB.glyphs.spark;return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`};
const initials=s=>String(s).split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const TICK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',CROSS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg>';
const tick=c=>/^(yes|y|true|✓|✔|1|included)$/i.test(String(c).trim())?`<span class="y">${TICK}<span class="vh">Yes</span></span>`:/^(no|n|false|✗|✕|0|-|—)$/i.test(String(c).trim())?`<span class="n">${CROSS}<span class="vh">No</span></span>`:esc(c);
function fill(str,blk,A){const d=def(blk.id),keys=new Set(fieldsOf(d).map(f=>f.k));
 str=str.replace(/\{\{each:(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,(m,k,body)=>rows(val(blk,k)).map((cells,i)=>body.replace(/\{\{n\}\}|\{\{(g|i|t|list)?(\d+)\}\}/g,(mm,kind,num)=>{if(mm==='{{n}}')return String(i+1);const c=cells[+num]||'';
  if(!kind)return esc(c);if(kind==='g')return glyph(c);if(kind==='i')return esc(initials(c));if(kind==='t')return tick(c);return c.split(';').map(x=>x.trim()).filter(Boolean).map(x=>'<li>'+esc(x)+'</li>').join('')})).join(''));
 return str.replace(/\{\{(\w+)\}\}/g,(m,k)=>k==='A'?A:k==='brand'?esc(page.brand||'Brand'):keys.has(k)?esc(fieldsOf(d).find(f=>f.k===k).type==='list'?rows(val(blk,k)).map(r=>r.join(' ')).join(', '):val(blk,k)):m)}

/* ---------- compose ---------- */
const AT='\u0001A/';
const cache={cl:null,ix:{}};
function compose(mode){ // mode: preview | html | zip  -> parts
 const site=mode==='preview'?ABS:SITE;const pair=page.pair>=0?LIB.pairs[page.pair]:null;
 const st=PB.styles.resolve(page.style,pair,site);
 const css=new Map(),needs=new Map(),fonts=new Set(),files=new Map(),body=[],js=[];
 (st.fonts||'').split('&').filter(Boolean).forEach(f=>fonts.add(f));
 const ctx={mode,A:AT,site,uid:'',need:(k,v)=>{if(!needs.has(k))needs.set(k,v)},font:q=>{(q||'').split('&').filter(Boolean).forEach(f=>fonts.add(f))},
  interactionSrc:id=>{if(mode==='preview')return `src="${ABS}interactions/demos/${esc(id)}.html"`;const t=cache.ix[id];
   if(mode==='zip'&&t){files.set('interactions/'+id+'.html',t);return `src="interactions/${esc(id)}.html"`}
   if(mode==='html'&&t)return `srcdoc="${t.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"`;return `src="${SITE}interactions/demos/${esc(id)}.html"`}};
 page.blocks.forEach(blk=>{const d=def(blk.id);if(!d)return;ctx.uid=blk.uid;let html='',bjs='';
  try{if(isX(blk.id)){const r=d.render(vals(blk),ctx)||{};html=r.html||'';bjs=r.js||'';(r.css||[]).forEach(([k,c])=>{if(!css.has(k))css.set(k,c)});if(!css.has('x-base'))css.set('x-base',PB.extraBase)}
   else{html=fill(d.html,blk,AT);bjs=d.js?fill(d.js,blk,AT):'';if(!css.has('b:'+d.id))css.set('b:'+d.id,d.css)}}
  catch(e){console.warn('Page builder: block failed',blk.id,e);html='<section class="wrap"><p>This section could not be drawn.</p></section>'}
  html=html.split(AT+'http').join('http');
  body.push(`<div class="b-${isX(blk.id)?'x':d.id}" id="${blk.uid}"${mode==='preview'?' data-pb':''}>${html}</div>`);
  if(bjs)js.push(`(()=>{const root=document.getElementById(${JSON.stringify(blk.uid)});if(!root)return;try{${bjs}}catch(e){console.error(e)}})();`)});
 const rt=[];let cl=false;
 needs.forEach((v,k)=>{if(v&&v.componentLab)cl=true;else rt.push(v)});
 const fontURL=fonts.size?'https://fonts.googleapis.com/css2?'+[...fonts].join('&')+'&display=swap':'';
 const cssText=':root{'+st.vars+'}\n'+(st.face||'')+LIB.base+'.h{text-transform:var(--case,none)}\n'+[...css.values()].join('\n');
 return {st,cssText,body:body.join('\n'),runtime:rt.join('\n'),js:js.join('\n'),cl,fontURL,files,mode};
}
function assemble(P,opt={}){ // opt: {cssHref, jsHref, clSrc, clInline}
 const head=`<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${esc(page.title||page.brand||'Page')}</title>\n`+
  (P.fontURL?`<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="${P.fontURL}">\n`:'')+
  `<!-- Built with the Visual & Motion Atlas page builder. Style: ${esc(P.st.name)}. -->\n`+(opt.cssHref?`<link rel="stylesheet" href="${opt.cssHref}">`:`<style>\n${P.cssText}\n</style>`)+'</head><body>\n';
 let scripts='';
 if(P.cl){scripts+=opt.clInline?`<script>${opt.clInline.replace(/<\/script/gi,'<\\/script')}<\/script>\n`:`<script src="${opt.clSrc||SITE+'component-lab.js'}"><\/script>\n`;
  scripts+=`<script>/* wake the component behaviours */document.body.appendChild(document.createElement('span')).hidden=true;<\/script>\n`}
 const code=(P.runtime?P.runtime+'\n':'')+P.js;
 if(code)scripts+=opt.jsHref?`<script src="${opt.jsHref}"><\/script>\n`:`<script>\n${code.replace(/<\/script/gi,'<\\/script')}\n<\/script>\n`;
 if(P.mode==='preview')scripts+=`<script>document.addEventListener('click',function(e){var b=e.target.closest('[data-pb]');if(b)parent.postMessage({pb:'select',uid:b.id},'*')},true);document.addEventListener('click',function(e){var a=e.target.closest('a[href="#"]');if(a)e.preventDefault()});<\/script>\n`;
 return head+P.body+'\n'+scripts+'</body></html>\n';
}
const swapA=(s,base)=>s.split(AT).join(base);

/* ---------- preview ---------- */
const pv=$('#pv');let rt=0,lastY=0,jump=null;
function render(){clearTimeout(rt);rt=setTimeout(()=>{try{lastY=pv.contentWindow.scrollY||0}catch(e){}const P=compose('preview');pv.srcdoc=swapA(assemble(P,{clSrc:ABS+'component-lab.js'}),ABS+'assets/');status()},160)}
pv.addEventListener('load',()=>{try{const w=pv.contentWindow;if(jump){const el=w.document.getElementById(jump);if(el)el.scrollIntoView();jump=null}else w.scrollTo(0,lastY)}catch(e){}});
addEventListener('message',e=>{if(e.source!==pv.contentWindow||!e.data||e.data.pb!=='select')return;const b=page.blocks.find(x=>x.uid===e.data.uid);if(b){open=b.uid;showPane('page');rtab('page');outline();const el=$(`#ol [data-uid="${b.uid}"] .bname`);el&&el.scrollIntoView({block:'nearest'})}});
function status(){$('#status').textContent=page.blocks.length+' sections · '+PB.styles.get(page.style).name}
function scrollPreviewTo(uid){jump=uid;try{const t=pv.contentWindow.document.getElementById(uid);if(t){t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});jump=null}}catch(e){}}

/* ---------- toast ---------- */
const toast=$('#toast');function say(m){toast.textContent=m;toast.classList.add('on');clearTimeout(say.t);say.t=setTimeout(()=>toast.classList.remove('on'),2200)}

/* ---------- adding, moving ---------- */
function placeIndex(id){const d=def(id),pl=d&&d.place,bl=page.blocks;
 const tops=()=>{let i=0;while(i<bl.length&&def(bl[i].id).place==='top')i++;return i};
 if(id==='announce')return 0;if(pl==='top')return tops();if(pl==='hero'){let i=tops();while(i<bl.length&&def(bl[i].id).place==='hero')i++;return i}
 if(pl==='end')return bl.length;let i=bl.length;while(i>0&&def(bl[i-1].id).place==='end')i--;return i}
function addBlock(id,valsIn,at){if(!def(id))return;const b={uid:uidGen(),id,vals:valsIn||{}};const i=at==null?placeIndex(id):Math.max(0,Math.min(at,page.blocks.length));
 page.blocks.splice(i,0,b);open=b.uid;commit();outline();render();jump=b.uid;say('Added '+def(id).name+(at==null?'':' at position '+(i+1)));return b}
function move(i,j){if(j<0||j>=page.blocks.length||i===j)return;const [b]=page.blocks.splice(i,1);page.blocks.splice(j,0,b);commit();outline();render()}

/* ---------- outline + editor ---------- */
function outline(){const ol=$('#ol');ol.innerHTML='';
 if(!page.blocks.length)ol.innerHTML='<li class="empty">No sections yet. Add some from the library, or drag them here.</li>';
 page.blocks.forEach((blk,i)=>{const d=def(blk.id);const li=document.createElement('li');li.className='blk'+(open===blk.uid?' open':'');li.dataset.uid=blk.uid;li.draggable=true;
  const sub=isX(blk.id)?xLabel(blk):d.group;
  li.innerHTML=`<div class="bh"><span class="grip" aria-hidden="true">⋮⋮</span><button class="bname" aria-expanded="${open===blk.uid}" aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown" title="Alt + ↑/↓ moves this section"><b>${esc(d.name)}</b><small>${esc(sub)}</small></button>
   <button class="ib" data-a="up" aria-label="Move ${esc(d.name)} up"${i?'':' disabled'}>↑</button><button class="ib" data-a="down" aria-label="Move ${esc(d.name)} down"${i<page.blocks.length-1?'':' disabled'}>↓</button><button class="ib" data-a="dup" aria-label="Duplicate ${esc(d.name)}">⧉</button><button class="ib" data-a="rm" aria-label="Remove ${esc(d.name)}">✕</button></div>`;
  if(open===blk.uid)li.append(editor(blk));
  const nb=li.querySelector('.bname');
  nb.onclick=()=>{open=open===blk.uid?null:blk.uid;outline();if(open)scrollPreviewTo(blk.uid);const again=$(`#ol [data-uid="${blk.uid}"] .bname`);again&&again.focus()};
  nb.onkeydown=e=>{if(e.altKey&&(e.key==='ArrowUp'||e.key==='ArrowDown')){e.preventDefault();const j=e.key==='ArrowUp'?i-1:i+1;if(j<0||j>=page.blocks.length)return;move(i,j);say(d.name+' moved to position '+(j+1));const el=$(`#ol [data-uid="${blk.uid}"] .bname`);el&&el.focus()}};
  li.querySelectorAll('.ib').forEach(b=>b.onclick=()=>{const a=b.dataset.a;
   if(a==='rm'){page.blocks.splice(i,1);if(open===blk.uid)open=null;commit();outline();render();say('Removed '+d.name+'. Undo brings it back.');const n=$$('#ol .blk')[Math.min(i,page.blocks.length-1)];(n?n.querySelector('.bname'):$('#libSearch')).focus();return}
   if(a==='dup'){const c={uid:uidGen(),id:blk.id,vals:clone(blk.vals)};page.blocks.splice(i+1,0,c);commit();outline();render();say('Duplicated '+d.name);return}
   const j=a==='up'?i-1:i+1;move(i,j);const el=$(`#ol [data-uid="${blk.uid}"] [data-a="${a}"]:not(:disabled)`)||$(`#ol [data-uid="${blk.uid}"] .bname`);el&&el.focus()});
  ol.append(li)});
 status()}
function xLabel(blk){const v=vals(blk);try{if(blk.id==='x-component'){const c=PB.src.CL()&&PB.src.CL().components.find(x=>x.id===v.cid);return c?c.id+' · '+c.name:'Component'}
 if(blk.id==='x-interaction'){const x=(window.INTERACTIONS||[]).find(x=>x.id===v.iid);return x?x.t:'Interaction'}
 if(blk.id==='x-background'){const p=PB.src.BGA()&&PB.src.BGA().ALL.find(p=>p.key===v.bg);return p?p.name:'Background'}
 if(blk.id==='x-kitbg'||blk.id==='x-kitasset'){const k=PB.src.kit(v.kit);return (k?k.name:'Kit')+(v.asset?' · '+v.asset:'')}
 if(blk.id==='x-icons')return 'Icons · '+v.family;if(blk.id==='x-effect')return v.lid;if(blk.id==='x-film')return v.film}catch(e){}return def(blk.id).group}
let fid=0;
function editor(blk){const d=def(blk.id),bb=document.createElement('div');bb.className='bb';bb.innerHTML=`<p class="hint">${esc(d.desc)}</p>`;
 fieldsOf(d).forEach(f=>{const id='f'+(++fid),wrap=document.createElement('div');wrap.className='f';const lab=document.createElement('label');lab.htmlFor=id;lab.textContent=f.label;let inp;
  if(f.type==='select'||f.type==='film'){inp=document.createElement('select');const opts=f.type==='film'?LIB.films.map(n=>[n,n.replace(/-/g,' ')]):(f.options?f.options(vals(blk)):[]);
   opts.forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;inp.append(o)});if(!opts.length){const o=document.createElement('option');o.textContent='Not available yet';inp.append(o);inp.disabled=true}}
  else if(f.type==='long'||f.type==='list'){inp=document.createElement('textarea');if(f.type==='list'){inp.rows=Math.min(8,Math.max(3,rows(val(blk,f.k)).length+1));inp.spellcheck=true}}
  else{inp=document.createElement('input');if(f.type==='image'){inp.setAttribute('list','pbImages')}}
  inp.id=id;inp.value=val(blk,f.k);
  const live=f.type==='select'||f.type==='film';
  inp[live?'onchange':'oninput']=()=>{blk.vals[f.k]=inp.value;if(live){commit();if(blk.id==='x-component'&&f.k==='cid'){delete blk.vals.variant}outline()}else commitSoon();render()};
  wrap.append(lab,inp);if(f.type==='list'){const h=document.createElement('p');h.className='hint';h.textContent='One per line'+(/\|/.test(f.label)?'; separate parts with |':'');wrap.append(h)}
  if(f.type==='image'){const h=document.createElement('p');h.className='hint';h.textContent='Pick a library image or paste any image URL.';wrap.append(h)}
  bb.append(wrap)});
 if(!fieldsOf(d).length)bb.insertAdjacentHTML('beforeend','<p class="hint">This section uses the brand name and has no other words to edit.</p>');
 const tools=document.createElement('div');tools.className='btools';
 if(!isX(blk.id)||blk.id==='x-background'||blk.id==='x-kitbg'){const ai=document.createElement('button');ai.className='btn small';ai.type='button';ai.textContent='Rewrite with AI';ai.onclick=()=>aiSection(blk,ai);tools.append(ai)}
 const rs=document.createElement('button');rs.className='btn small';rs.type='button';rs.textContent='Reset words';rs.onclick=()=>{blk.vals={...(blk.id==='x-component'?{cid:blk.vals.cid}:{}),...(['x-interaction','x-background','x-kitbg','x-kitasset','x-icons','x-effect'].includes(blk.id)?Object.fromEntries(Object.entries(blk.vals).filter(([k])=>['iid','bg','kit','asset','family','lid'].includes(k))):{})};commit();outline();render();say('Back to the default words')};tools.append(rs);
 bb.append(tools);return bb}

/* drag and drop: library cards and outline rows */
let dragUid=null;
const ol=$('#ol');
ol.addEventListener('dragstart',e=>{const li=e.target.closest('.blk');if(!li)return;dragUid=li.dataset.uid;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',dragUid);li.classList.add('dragging')});
ol.addEventListener('dragend',()=>{dragUid=null;$$('.blk.dragging').forEach(x=>x.classList.remove('dragging'));clearMark()});
function dropIndex(y){const items=$$('#ol .blk');for(let i=0;i<items.length;i++){const r=items[i].getBoundingClientRect();if(y<r.top+r.height/2)return i}return items.length}
function clearMark(){$$('#ol .mark').forEach(x=>x.classList.remove('mark','after'))}
function mark(i){clearMark();const items=$$('#ol .blk');if(!items.length)return;if(i<items.length)items[i].classList.add('mark');else items[items.length-1].classList.add('mark','after')}
ol.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect=dragUid?'move':'copy';mark(dropIndex(e.clientY))});
ol.addEventListener('dragleave',e=>{if(!ol.contains(e.relatedTarget))clearMark()});
ol.addEventListener('drop',e=>{e.preventDefault();const i=dropIndex(e.clientY);clearMark();
 if(dragUid){const from=page.blocks.findIndex(b=>b.uid===dragUid);if(from<0)return;move(from,i>from?i-1:i);return}
 try{const x=JSON.parse(e.dataTransfer.getData('application/x-pb')||'null');if(x&&x.id)addBlock(x.id,x.vals,i)}catch(err){}});
const frameWrap=$('#wrap');
frameWrap.addEventListener('dragover',e=>{if(dragUid)return;e.preventDefault();frameWrap.classList.add('drop')});
frameWrap.addEventListener('dragleave',()=>frameWrap.classList.remove('drop'));
frameWrap.addEventListener('drop',e=>{frameWrap.classList.remove('drop');if(dragUid)return;e.preventDefault();try{const x=JSON.parse(e.dataTransfer.getData('application/x-pb')||'null');if(x&&x.id)addBlock(x.id,x.vals)}catch(err){}});

/* ---------- library ---------- */
const LTABS=[['sections','Sections'],['components','Components'],['interactions','Interactions'],['media','Media & backgrounds'],['icons','Icons'],['kit','Kit assets']];
let ltab=LTABS.some(t=>t[0]===ui.ltab)?ui.ltab:'sections',lgroup='All';
function libTabs(){const tl=$('#ltabs');tl.innerHTML=LTABS.map(([k,l])=>`<button role="tab" type="button" id="lt-${k}" aria-controls="libList" aria-selected="${k===ltab}" tabindex="${k===ltab?0:-1}">${l}</button>`).join('');
 tl.querySelectorAll('[role=tab]').forEach((b,i,all)=>{b.onclick=()=>{ltab=b.id.slice(3);ui.ltab=ltab;saveUI();lgroup='All';libTabs();library()};
  b.onkeydown=e=>{const n=all.length;let j=null;if(e.key==='ArrowRight')j=(i+1)%n;if(e.key==='ArrowLeft')j=(i-1+n)%n;if(e.key==='Home')j=0;if(e.key==='End')j=n-1;if(j!=null){e.preventDefault();all[j].click();$('#lt-'+LTABS[j][0]).focus()}}});
 $('#libList').setAttribute('aria-labelledby','lt-'+ltab)}
const q=()=>($('#libSearch').value||'').trim().toLowerCase();
const match=(...s)=>{const t=q();return !t||s.join(' ').toLowerCase().includes(t)};
function card({id,vals:v,title,meta,desc,thumb,cls}){return `<li class="lc ${cls||''}" draggable="true" data-add='${esc(JSON.stringify({id,vals:v||{}}))}'><div class="lth" aria-hidden="true">${thumb||''}</div><div class="lb"><b>${esc(title)}</b>${meta?`<small>${esc(meta)}</small>`:''}${desc?`<p>${esc(desc)}</p>`:''}</div><button type="button" class="btn small add" aria-label="Add ${esc(title)} to the page">Add</button></li>`}
function chips(groups){return `<div class="gchips" role="group" aria-label="Filter">${groups.map(g=>`<button type="button" class="chip" aria-pressed="${g===lgroup}" data-g="${esc(g)}">${esc(g)}</button>`).join('')}</div>`}
const SEC_ICON={Navigation:'M3 6h18M3 6v4h18V6',Heroes:'M3 4h18v12H3zM6 19h12',Features:'M3 4h8v7H3zM13 4h8v7h-8zM3 13h8v7H3zM13 13h8v7h-8z',Proof:'M5 7h6v6H5zM13 7h6v6h-6zM5 16h14',Sell:'M4 5h5v14H4zM10 3h5v18h-5zM16 5h5v14h-5z',Story:'M4 6h16M4 10h16M4 14h12M4 18h8',Content:'M4 4h16v10H4zM4 17h16M4 20h10',Endings:'M3 14h18v6H3zM6 17h4M14 17h4',Fonts:'M5 19 10 5h2l5 14M7 14h8',Components:'M4 6h7v5H4zM13 6h7v5h-7zM4 14h16v4H4z'};
const secThumb=g=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="${SEC_ICON[g]||SEC_ICON.Content}"/></svg>`;
let ixIO=null,bgThumbs={};
function library(){const L=$('#libList');let h='';if(ixIO){ixIO.disconnect();ixIO=null}
 if(ltab==='sections'){const all=[...LIB.blocks,PB.extraById['x-type']];const gs=['All',...GROUPS.filter(g=>all.some(b=>b.group===g))];h+=chips(gs);
  const items=all.filter(b=>(lgroup==='All'||b.group===lgroup)&&match(b.name,b.group,b.desc));
  h+=`<p class="lcount">${items.length} sections</p><ul class="lgrid">`+items.map(b=>card({id:b.id,title:b.name,meta:b.group,desc:b.desc,thumb:secThumb(b.group),cls:'sec'})).join('')+'</ul>'}
 else if(ltab==='components'){const L2=PB.src.CL();if(!L2)h+='<p class="hint">The UI component lab has not loaded, so components are unavailable right now.</p>';else{
  const items=L2.components.filter(c=>match(c.id,c.name));h+=`<p class="lcount">${items.length} of ${L2.components.length} components · each one is themed by your page style</p><ul class="lgrid comp">`+items.map(c=>card({id:'x-component',vals:{cid:c.id},title:c.name,meta:c.id+(c.live?' · interactive':''),thumb:`<div class="cthumb pb-cl"><div class="cl-root" inert>${PB.componentHTML(c,c.thumb||c.v[0][0],'t'+c.id)}</div></div>`,cls:'comp'})).join('')+'</ul>'}}
 else if(ltab==='interactions'){const X=(window.INTERACTIONS||[]).filter(x=>!/^sec-/.test(x.id));if(!X.length)h+='<p class="hint">The interactions shelf has not loaded.</p>';else{
  const cats=['All',...new Set(X.map(x=>x.cat))];h+=chips(cats);const items=X.filter(x=>(lgroup==='All'||x.cat===lgroup)&&match(x.t,x.cat,x.d,x.use));
  h+=`<p class="lcount">${items.length} interactions · embedded as frames, inlined in the export</p><ul class="lgrid ix">`+items.map(x=>card({id:'x-interaction',vals:{iid:x.id,height:/^story-/.test(x.id)?'800':'640'},title:x.t,meta:x.cat,desc:x.d,thumb:`<div class="ixthumb ${x.tone==='light'?'light':''}" data-ix="${esc(x.id)}"><span>${esc(x.cat)}</span></div>`,cls:'ixc'})).join('')+'</ul>'}}
 else if(ltab==='media'){const BG=PB.src.BGA();const gs=['All','Backgrounds','Films','Landing effects','Images'];h+=chips(gs);
  if(lgroup==='All'||lgroup==='Backgrounds'){if(!BG)h+='<p class="hint">The backgrounds library has not loaded.</p>';else{const items=BG.ALL.filter(p=>match(p.name,BG.FAMILIES[p.mode],p.collection,'background'));
   h+=`<h3 class="lh">Generated backgrounds <small>${items.length}</small></h3><ul class="lgrid tiles">`+items.map(p=>card({id:'x-background',vals:{bg:p.key},title:p.name,meta:BG.FAMILIES[p.mode]+' · live shader',thumb:`<div class="bgthumb" data-bg="${esc(p.key)}" style="${esc(bgThumbs[p.key]?`background-image:url(${bgThumbs[p.key]});background-size:cover`:PB.bgFallback(p))}"></div>`,cls:'tile'})).join('')+'</ul>'}}
  if(lgroup==='All'||lgroup==='Films'){const items=LIB.films.filter(f=>match(f,'film video'));h+=`<h3 class="lh">Atlas films <small>${items.length}</small></h3><ul class="lgrid tiles">`+items.map(f=>card({id:'x-film',vals:{film:f,caption:''},title:f.replace(/-/g,' '),meta:'Looping film band',thumb:`<img src="assets/films/${esc(f)}.jpg" alt="" loading="lazy">`,cls:'tile'})).join('')+'</ul>'}
  if(lgroup==='All'||lgroup==='Landing effects'){const items=(PB.effects||[]).filter(e=>match(e.id,e.title,e.desc,'effect'));h+=`<h3 class="lh">Landing effects <small>${items.length}</small></h3>`+(PB.effects?'':'<p class="hint">Loading…</p>')+`<ul class="lgrid tiles">`+items.map(e=>card({id:'x-effect',vals:{lid:e.id},title:e.title,meta:e.id+' · clip',thumb:`<img src="${esc(e.film.poster||e.image&&e.image.url||'')}" alt="" loading="lazy">`,cls:'tile'})).join('')+'</ul>'}
  if(lgroup==='All'||lgroup==='Images'){const items=LIB.images.filter(i=>match(i,'image photo'));h+=`<h3 class="lh">Images <small>${items.length}</small></h3><p class="hint">Adds a full-width image; you can also pick these in any image field.</p><ul class="lgrid tiles">`+items.map(i=>card({id:'image-full',vals:{img:i,alt:'',caption:''},title:i.split('/')[1].replace(/\.\w+$/,'').replace(/-/g,' '),meta:'Full-width image',thumb:`<img src="assets/${esc(i)}" alt="" loading="lazy">`,cls:'tile'})).join('')+'</ul>'}}
 else if(ltab==='icons'){const fams=[['glyphs','Builder glyphs',Object.keys(LIB.glyphs)],...Object.entries(LIB.iconFiles).map(([f,list])=>[f,f.replace(/-/g,' '),list.map(x=>x.replace(/\.\w+$/,''))]),...(PB.src.TK()?PB.src.TK().list.map(k=>['kit:'+k.id,k.name+' kit',Object.keys(PB.src.TK().ICONS||{})]):[])];
  const items=fams.filter(([f,n,names])=>match(f,n,names.join(' '),'icon'));
  h+=`<p class="lcount">${items.length} icon families · adds an icon feature row you can edit</p><ul class="lgrid icons">`+items.map(([f,n,names])=>card({id:'x-icons',vals:{family:f,items:iconItems(f)},title:n,meta:names.length+' icons',thumb:`<div class="icstrip" data-fam="${esc(f)}">${names.slice(0,8).map(x=>`<span>${PB.iconSVG(f,x,{site:ABS})}</span>`).join('')}</div>`,cls:'icf'})).join('')+'</ul>'}
 else if(ltab==='kit'){const TK=PB.src.TK();if(!TK)h+='<p class="hint">The theme kits have not loaded.</p>';else{
  const kits=TK.list.filter(k=>match(k.name,k.mood||'',k.tagline||'',k.id));const sel=kits.find(k=>k.id===ui.kit)||kits[0]||TK.list[0];
  h+=`<div class="f"><label for="kitSel">Theme kit (${kits.length})</label><select id="kitSel">${kits.map(k=>`<option value="${esc(k.id)}"${k===sel?' selected':''}>${esc((k.no?k.no+' · ':'')+k.name)}</option>`).join('')}</select></div>`;
  if(sel){let still='';try{still=TK.stillURL?TK.stillURL(sel,320,180):''}catch(e){}
   const sw=[sel.t.bg,sel.t.surface,sel.t.ink,sel.t.accent,sel.t.accent2].filter(Boolean);
   h+=`<p class="hint">${esc(sel.tagline||'')} ${esc(sel.mood||'')}</p><div class="kitrow"><button type="button" class="btn small" id="kitStyle">Use ${esc(sel.name)} as the page style</button><button type="button" class="btn small" id="kitZip"${TK.zipKit?'':' disabled'}>Download kit ZIP</button></div><ul class="lgrid tiles">`+
    card({id:'x-kitbg',vals:{kit:sel.id},title:'Background hero',meta:'Animated canvas',thumb:still?`<img src="${still}" alt="">`:`<div style="background:${esc(sel.t.bg)};height:100%"></div>`,cls:'tile'})+
    [['logo','Logo'],['mark','Mark'],['pattern','Pattern band'],['divider','Divider'],['icons','Icon set'],['palette','Colour palette']].map(([a,l])=>{let art='';try{
     if(a==='logo')art=TK.logo(sel,true);else if(a==='mark')art=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" style="background:${sel.t.bg}">${TK.mark(sel)}</svg>`;else if(a==='pattern')art=`<div style="height:100%;background:url('${PB.svgURL(TK.pattern(sel))}')"></div>`;
     else if(a==='divider')art=`<div style="background:${sel.t.bg};height:100%;display:grid;align-items:center">${TK.divider(sel)}</div>`;else if(a==='icons')art=`<div class="icstrip" style="background:${sel.t.bg};color:${sel.t.ink}">${Object.keys(TK.ICONS||{}).slice(0,8).map(n=>`<span>${TK.icon(sel,n,22,'currentColor')}</span>`).join('')}</div>`;
     else art=`<div class="palthumb">${sw.map(c=>`<i style="background:${c}"></i>`).join('')}</div>`}catch(e){}
     return card({id:'x-kitasset',vals:{kit:sel.id,asset:a},title:l,meta:sel.name,thumb:art,cls:'tile'})}).join('')+'</ul>'}}}
 L.innerHTML=h;
 L.querySelectorAll('.gchips .chip').forEach(b=>b.onclick=()=>{lgroup=b.dataset.g;library();const n=$(`#libList .chip[data-g="${CSS.escape(lgroup)}"]`);n&&n.focus()});
 L.querySelectorAll('.lc').forEach(li=>{const x=JSON.parse(li.dataset.add);li.querySelector('.add').onclick=()=>addBlock(x.id,clone(x.vals));
  li.addEventListener('dragstart',e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/x-pb',li.dataset.add);e.dataTransfer.setData('text/plain',x.id)})});
 const ks=$('#kitSel');if(ks){ks.onchange=()=>{ui.kit=ks.value;saveUI();library();$('#kitSel').focus()};
  $('#kitStyle').onclick=()=>{setStyle('kit:'+ks.value)};const z=$('#kitZip');z.onclick=async()=>{const TK=PB.src.TK(),k=TK.list.find(x=>x.id===ks.value);z.disabled=true;say('Building the kit ZIP…');try{dl(await TK.zipKit(k),k.id+'-theme-kit.zip')}catch(e){say('Could not build the kit ZIP')}z.disabled=false}}
 if(ltab==='interactions')mountIx();if(ltab==='media')bgThumbsLater();
}
function iconItems(f){const names=PB.iconNames(f);const base=rows(PB.extraById['x-icons'].fields.find(x=>x.k==='items').def);return base.map((r,i)=>[names[i%Math.max(1,names.length)]||r[0],r[1],r[2]].join(' | ')).join('\n')}
function mountIx(){if(!('IntersectionObserver' in window))return;ixIO=new IntersectionObserver(es=>es.forEach(e=>{const box=e.target;if(e.isIntersecting){if(!box.querySelector('iframe')){const f=document.createElement('iframe');f.src='interactions/demos/'+box.dataset.ix+'.html';f.tabIndex=-1;f.setAttribute('aria-hidden','true');f.setAttribute('inert','');f.title='';f.loading='lazy';box.append(f)}}else{const f=box.querySelector('iframe');if(f)f.remove()}}),{root:$('#libScroll'),rootMargin:'100px'});$$('#libList [data-ix]').forEach(b=>ixIO.observe(b))}
/* background thumbnails: one WebGL canvas draws every preset once */
let bgR=null;
function bgThumbsLater(){if(!PB.bgFrag||!PB.src.BGA())return;const todo=$$('#libList [data-bg]').filter(b=>!bgThumbs[b.dataset.bg]);if(!todo.length)return;
 if(!bgR){try{const c=document.createElement('canvas');c.width=240;c.height=150;const g=c.getContext('webgl',{preserveDrawingBuffer:true});if(!g)return;
  const sh=(t,s)=>{const o=g.createShader(t);g.shaderSource(o,s);g.compileShader(o);return o};const p=g.createProgram();g.attachShader(p,sh(g.VERTEX_SHADER,'attribute vec2 v;void main(){gl_Position=vec4(v,0.,1.);}'));g.attachShader(p,sh(g.FRAGMENT_SHADER,PB.bgFrag));g.linkProgram(p);if(!g.getProgramParameter(p,g.LINK_STATUS))return;g.useProgram(p);
  g.bindBuffer(g.ARRAY_BUFFER,g.createBuffer());g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW);const L=g.getAttribLocation(p,'v');g.enableVertexAttribArray(L);g.vertexAttribPointer(L,2,g.FLOAT,false,0,0);
  const u=n=>g.getUniformLocation(p,n),rgb=h=>{const n=parseInt(h.slice(1),16);return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]};
  bgR=s=>{g.viewport(0,0,240,150);g.uniform2f(u('R'),240,150);g.uniform1f(u('A'),0);g.uniform1f(u('S'),s.seed);g.uniform1f(u('SC'),s.scale);g.uniform1f(u('WP'),s.warp);g.uniform1f(u('SF'),s.soft);g.uniform1f(u('GR'),s.grain);g.uniform1f(u('MO'),s.motion);g.uniform1f(u('GS'),1);g.uniform1i(u('M'),s.mode);s.colors.forEach((x,i)=>g.uniform3fv(u('C'+i),rgb(x)));g.drawArrays(g.TRIANGLES,0,3);return c.toDataURL('image/jpeg',.8)}}catch(e){return}}
 let i=0;const step=()=>{const end=performance.now()+12;while(i<todo.length&&performance.now()<end){const b=todo[i++],p=PB.src.BGA().ALL.find(x=>x.key===b.dataset.bg);if(p){try{bgThumbs[p.key]=bgR(p);b.style.cssText=`background-image:url(${bgThumbs[p.key]});background-size:cover`}catch(e){}}}if(i<todo.length)requestAnimationFrame(step)};requestAnimationFrame(step)}
$('#libSearch').oninput=()=>{clearTimeout(library.t);library.t=setTimeout(library,120)};

/* ---------- style panel ---------- */
let skind=ui.skind||'all';
function setStyle(id){if(!PB.styles.has(id))return;page.style=id;commit();styles();render();say('Style: '+PB.styles.get(id).name)}
function styles(){const S=PB.styles.list(),t=($('#styleSearch').value||'').trim().toLowerCase();
 $('#skinds').innerHTML=PB.styles.KINDS.map(([k,l])=>`<button type="button" class="chip" aria-pressed="${k===skind}" data-k="${k}">${l} <small>${k==='all'?S.length:S.filter(s=>s.kind===k).length}</small></button>`).join('');
 $$('#skinds .chip').forEach(b=>b.onclick=()=>{skind=b.dataset.k;ui.skind=skind;saveUI();styles();const n=$(`#skinds [data-k="${skind}"]`);n&&n.focus()});
 const items=S.filter(s=>(skind==='all'||s.kind===skind)&&(!t||(s.name+' '+s.note+' '+s.head+' '+s.body+' '+(s.mood||'')+' '+s.id).toLowerCase().includes(t)));
 const cur=PB.styles.get(page.style);
 $('#styleNow').innerHTML=`<span class="sw">${cur.sw.map(c=>`<i style="background:${esc(c)}"></i>`).join('')}</span><span><b>${esc(cur.name)}</b><small>${esc(cur.note)} · ${esc(cur.head)}${cur.head!==cur.body?' + '+esc(cur.body):''}</small></span>`;
 $('#styleList').innerHTML=items.slice(0,240).map(s=>`<li><button type="button" class="sc" aria-pressed="${s.id===page.style}" data-s="${esc(s.id)}"><span class="sw" aria-hidden="true">${s.sw.map(c=>`<i style="background:${esc(c)}"></i>`).join('')}</span><span class="sn"><b>${esc(s.name)}</b><small>${esc(s.note)} · ${esc(s.head)}</small></span></button></li>`).join('')||'<li class="hint">No style matches.</li>';
 $('#styleCount').textContent=items.length+' styles';
 $$('#styleList .sc').forEach(b=>b.onclick=()=>{setStyle(b.dataset.s);const n=$(`#styleList [data-s="${CSS.escape(b.dataset.s)}"]`);n&&n.focus()});
 const ps=$('#pairSel');ps.innerHTML='<option value="-1">The style’s own fonts</option>'+LIB.pairs.map((p,i)=>`<option value="${i}">${esc(p[0])}: ${esc(p[1])} + ${esc(p[2])}</option>`).join('');ps.value=String(page.pair)}
$('#styleSearch').oninput=()=>styles();
$('#pairSel').onchange=e=>{page.pair=+e.target.value;commit();render();say(page.pair<0?'Using the style’s fonts':'Fonts: '+LIB.pairs[page.pair][0])};

/* ---------- pages ---------- */
function pages(){const P=Object.values(store.pages).sort((a,b)=>(b.updated||0)-(a.updated||0));
 $('#pageList').innerHTML=P.map(p=>`<li class="${p.id===page.id?'cur':''}"><div><b>${esc(p.name||p.brand||'Untitled')}</b><small>${p.blocks.length} sections · ${esc(PB.styles.has(p.style)?PB.styles.get(p.style).name:p.style)}${p.updated?' · '+new Date(p.updated).toLocaleDateString():''}</small></div><span>${p.id===page.id?'<em>Open now</em>':`<button type="button" class="btn small" data-open="${p.id}">Open</button>`}<button type="button" class="btn small" data-dup="${p.id}" aria-label="Duplicate ${esc(p.name)}">Duplicate</button>${P.length>1?`<button type="button" class="btn small" data-del="${p.id}" aria-label="Delete ${esc(p.name)}">Delete</button>`:''}</span></li>`).join('');
 $$('#pageList [data-open]').forEach(b=>b.onclick=()=>switchTo(b.dataset.open));
 $$('#pageList [data-dup]').forEach(b=>b.onclick=()=>{const c=clone(store.pages[b.dataset.dup]);c.id='p'+Date.now().toString(36);c.name=(c.name||'Page')+' copy';store.pages[c.id]=c;switchTo(c.id);say('Duplicated')});
 $$('#pageList [data-del]').forEach(b=>b.onclick=()=>{const p=store.pages[b.dataset.del];if(!confirm('Delete “'+(p.name||'this page')+'”? This cannot be undone.'))return;delete store.pages[p.id];if(page.id===p.id)switchTo(Object.keys(store.pages)[0]);else{persist();pages()}say('Page deleted')});
 $('#tplList').innerHTML=TEMPLATES.map((t,i)=>{const x=t();return `<li><button type="button" class="chip" data-t="${i}">${esc(x.name)}</button></li>`}).join('');
 $$('#tplList [data-t]').forEach(b=>b.onclick=()=>{const t=TEMPLATES[+b.dataset.t]();const p={...blank(),...t};store.pages[p.id]=p;switchTo(p.id);say('New page from '+t.name)})}
function switchTo(id){clearTimeout(typing);commit();page=store.pages[id];store.cur=id;hist=[];fut=[];lastSnap=snap();open=null;persist();refresh();histUI()}
$('#newPage').onclick=()=>{const p=blank();store.pages[p.id]=p;switchTo(p.id);say('New blank page');showPane('lib')};
$('#pname').oninput=e=>{page.name=e.target.value;commitSoon()};
$('#pname').onchange=()=>pages();
$('#brand').oninput=e=>{page.brand=e.target.value;commitSoon();render()};
$('#ptitle').oninput=e=>{page.title=e.target.value;commitSoon();render()};

/* ---------- right panel tabs, panes ---------- */
const RT=[['page','Page'],['style','Style'],['ai','AI'],['pages','Pages']];let rtabCur=RT.some(t=>t[0]===ui.rtab)?ui.rtab:'page';
function rtab(k){rtabCur=k;ui.rtab=k;saveUI();$$('#rtabs [role=tab]').forEach(b=>{const on=b.dataset.t===k;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});$$('.rpanel').forEach(p=>p.hidden=p.id!=='rp-'+k);if(k==='style')styles();if(k==='pages')pages();if(k==='ai')aiStatus()}
$('#rtabs').innerHTML=RT.map(([k,l])=>`<button role="tab" type="button" id="rt-${k}" data-t="${k}" aria-controls="rp-${k}">${l}</button>`).join('');
$$('#rtabs [role=tab]').forEach((b,i,all)=>{b.onclick=()=>rtab(b.dataset.t);b.onkeydown=e=>{const n=all.length;let j=null;if(e.key==='ArrowRight')j=(i+1)%n;if(e.key==='ArrowLeft')j=(i-1+n)%n;if(j!=null){e.preventDefault();rtab(all[j].dataset.t);all[j].focus()}}});
function showPane(k){document.body.dataset.pane=k;$$('#panes button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.p===k))}
$$('#panes button').forEach(b=>b.onclick=()=>showPane(b.dataset.p));
const W=[['desk','Desktop','100%'],['tab','Tablet','820px'],['phone','Phone','390px']];
$('#widths').innerHTML=W.map(([k,l])=>`<button type="button" data-w="${k}" aria-pressed="${k===(ui.w||'desk')}">${l}</button>`).join('');
function setW(k){ui.w=k;saveUI();const w=W.find(x=>x[0]===k)||W[0];frameWrap.dataset.w=k;pv.style.width=w[2];$$('#widths button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.w===k))}
$$('#widths button').forEach(b=>b.onclick=()=>setW(b.dataset.w));setW(ui.w||'desk');

/* ---------- export ---------- */
const slug=()=>(page.brand||page.name||'page').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'page';
function dl(blob,name){const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
async function prefetch(){const need=compose('preview');const jobs=[];
 if(need.cl&&cache.cl==null)jobs.push(fetch('component-lab.js').then(r=>r.ok?r.text():null).then(t=>{cache.cl=t}).catch(()=>{}));
 page.blocks.filter(b=>b.id==='x-interaction').forEach(b=>{const id=val(b,'iid');if(cache.ix[id]!=null)return;jobs.push(fetch('interactions/demos/'+id+'.html').then(r=>r.ok?r.text():null).then(t=>{if(t)cache.ix[id]=t.split('../../assets/').join(SITE+'assets/')}).catch(()=>{}))});
 await Promise.all(jobs)}
async function htmlFile(){await prefetch();const P=compose('html');return swapA(assemble(P,{clInline:cache.cl||null}),SITE+'assets/')}
$('#dlHtml').onclick=async()=>{closeMenu();try{const h=await htmlFile();dl(new Blob([h],{type:'text/html'}),slug()+'.html');say('Downloading '+slug()+'.html')}catch(e){console.error(e);say('Export failed')}};
$('#copyHtml').onclick=async()=>{closeMenu();copy(await htmlFile(),'HTML copied')};
$('#openTab').onclick=async()=>{closeMenu();const w=window.open('','_blank');const h=await htmlFile();const u=URL.createObjectURL(new Blob([h],{type:'text/html'}));if(w)w.location=u;else window.open(u,'_blank');setTimeout(()=>URL.revokeObjectURL(u),60000)};
$('#dlZip').onclick=async()=>{closeMenu();const zip=(window.ThemeKits&&window.ThemeKits.zip)||PB.zip;say('Building the ZIP…');try{await prefetch();const P=compose('zip');
 const assets=new Map();const fix=s=>s.replace(/\u0001A\/([^"')\s]+)/g,(m,p)=>{if(/\.(mp4|webm|mov)$/i.test(p)||/[$`{]/.test(p))return SITE+'assets/'+p;assets.set(p,1);return 'assets/'+p});
 const css=fix(P.cssText),body=fix(P.body),js=swapA((P.runtime?P.runtime+'\n':'')+P.js,SITE+'assets/');
 const html=assemble({...P,cssText:css,body,runtime:'',js},{cssHref:'assets/page.css',jsHref:js.trim()?'assets/page.js':null,clSrc:'assets/component-lab.js'});
 const files=[['index.html',html],['assets/page.css',css]];if(js.trim())files.push(['assets/page.js',js]);
 if(P.cl)files.push(['assets/component-lab.js',cache.cl||'/* component-lab.js could not be copied; load it from '+SITE+'component-lab.js */']);
 P.files.forEach((t,n)=>files.push([n,t]));
 for(const p of assets.keys()){try{const r=await fetch('assets/'+p);if(r.ok)files.push(['assets/'+p,new Uint8Array(await r.arrayBuffer())])}catch(e){}}
 files.push(['README.txt',`${page.brand||'Page'}, built with the Visual & Motion Atlas page builder.\n\nOpen index.html in a browser. Styles are in assets/page.css and behaviour in assets/page.js.\nImages are in assets/. Films still stream from ${SITE}assets/films/ so the download stays small; download them from there and change the paths before you publish.\nInteraction demos are in interactions/. Forms and buttons are placeholders and send nothing.\nStyle: ${P.st.name}.\n`]);
 dl(zip(files),slug()+'.zip');say('Downloading '+slug()+'.zip')}catch(e){console.error(e);say('ZIP export failed')}};
$('#copyPrompt').onclick=()=>{closeMenu();const st=PB.styles.get(page.style),pair=page.pair>=0?LIB.pairs[page.pair]:null;
 const lines=page.blocks.map((b,i)=>{const d=def(b.id);const v=vals(b);const words=fieldsOf(d).filter(f=>['text','long','list'].includes(f.type)).map(f=>f.label.replace(/\s*\(.*\)/,'').toLowerCase()+' “'+String(v[f.k]).replace(/\n/g,' / ')+'”').filter(x=>!/“”$/.test(x)).join('; ');
  const film=fieldsOf(d).find(f=>f.type==='film');return (i+1)+'. '+d.name+(isX(b.id)?' ('+xLabel(b)+')':'')+'. '+(d.prompt||d.desc)+(film?' Background film: '+SITE+'assets/films/'+v[film.k]+'-720.mp4 (poster '+SITE+'assets/films/'+v[film.k]+'.jpg).':'')+(words?' Words: '+words+'.':'')});
 copy('Build a one-page website for “'+(page.brand||'my brand')+'” as a single HTML file with no libraries (Google Fonts are fine).\n\nStyle: '+(st.desc||st.name)+(pair?'. Override fonts: '+pair[1]+' for headings and '+pair[2]+' for text':'')+'.\n\nSections, top to bottom:\n'+lines.join('\n')+'\n\nThroughout: lay out at phone width as well as desktop, make every control keyboard-accessible with visible focus, keep text contrast at WCAG AA, pause or calm all motion under prefers-reduced-motion, give looping videos a pause button, and make forms show a confirmation without sending anything.','Prompt copied')};
async function copy(t,m){try{await navigator.clipboard.writeText(t);say(m)}catch(e){const ta=document.createElement('textarea');ta.value=t;document.body.append(ta);ta.select();try{document.execCommand('copy');say(m)}catch(_){say('Copy failed')}ta.remove()}}
const menu=$('#exportMenu');function closeMenu(){menu.open=false}
document.addEventListener('click',e=>{if(menu.open&&!menu.contains(e.target))closeMenu()});
menu.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menu.querySelector('summary').focus()}});

/* ---------- AI ---------- */
let aiOn=null,aiMsg='';
async function aiStatus(){const box=$('#aiState');if(aiOn===null){box.textContent='Checking whether the AI is available…';
  if((/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)||location.protocol==='file:')&&!/[?&]ai=1/.test(location.search)){aiOn=false;aiMsg='The AI runs on the live site only, so it is switched off in this local copy. Everything else works as normal.'}
  else try{const r=await fetch('/api/ai?status',{headers:{accept:'application/json'}});const j=r.ok&&/json/.test(r.headers.get('content-type')||'')?await r.json():null;
   if(!j){aiOn=false;aiMsg='The AI service isn’t reachable from this copy of the site (it runs on the live site). Everything else works as normal.'}
   else{aiOn=!!j.enabled;aiMsg=aiOn?'Ready. Describe the page and the AI picks sections, a style and writes the words.':'The AI isn’t switched on yet: the site owner needs to add an ANTHROPIC_API_KEY to the Vercel project. Everything else works as normal.'}}
  catch(e){aiOn=false;aiMsg='The AI service isn’t reachable right now. Everything else works as normal.'}}
 box.textContent=aiMsg;box.className='aistate '+(aiOn?'on':'off');$('#aiGo').disabled=!aiOn;$('#aiBrief').disabled=!aiOn;$('#aiKeep').disabled=!aiOn}
const AI_X=['x-background','x-kitbg'];
function catalog(only){return [...LIB.blocks,...AI_X.map(x=>PB.extraById[x])].filter(d=>!only||d.id===only).map(d=>({id:d.id,name:d.name,group:d.group,fields:fieldsOf(d).filter(f=>['text','long','list','film','image'].includes(f.type)||(d.id==='x-background'&&f.k==='bg')||(d.id==='x-kitbg'&&f.k==='kit')).map(f=>(f.type==='list'?f.k+'['+(f.label.match(/\(([^)]*)\)/)||[,'one per line'])[1]+']':f.k).slice(0,30))}))}
const aiStyleIds=()=>{const S=PB.styles.list();const pick=[...S.filter(s=>s.kind==='builder'),...S.filter(s=>s.kind==='kit'),...S.filter(s=>s.kind==='ds'),...S.filter(s=>!['builder','kit','ds'].includes(s.kind))].slice(0,200);return pick.map(s=>(s.id+'|'+s.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')).slice(0,40))};
const LIST_NOTE='\n(For fields written key[...], put one row per line and separate the parts of a row with " | ".)';
function toVals(d,fields){const out={};const F=fieldsOf(d);Object.entries(fields||{}).forEach(([k,v])=>{const key=k.split('[')[0];const f=F.find(x=>x.k===key);if(!f)return;v=String(v);
 if(f.type==='list'&&!v.includes('\n')){const multi=/\|/.test(f.label);if(v.includes(' || '))v=v.split(/\s*\|\|\s*/).join('\n');else if(!multi)v=v.split(/\s*\|\s*/).join('\n');else if(v.includes('; '))v=v.split(/\s*;\s+/).join('\n')}
 if(f.type==='film'&&!LIB.films.includes(v))return;if(f.type==='select'&&f.options&&!f.options({}).some(o=>o[0]===v))return;out[key]=v});return out}
async function aiCall(body){const r=await fetch('/api/ai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});let j=null;try{j=await r.json()}catch(e){}if(!r.ok||!j||!j.page)throw new Error((j&&j.error)||'The AI did not answer ('+r.status+').');return j.page}
$('#aiGo').onclick=async()=>{const brief=$('#aiBrief').value.trim();if(!brief){say('Describe the page first');$('#aiBrief').focus();return}const go=$('#aiGo');go.disabled=true;$('#aiOut').textContent='Writing your page…';
 try{const keep=$('#aiKeep').checked;const p=await aiCall({mode:'page',brief:(brief+LIST_NOTE).slice(0,1500),catalog:catalog(),styles:aiStyleIds(),current:keep?{title:page.title,brand:page.brand,style:page.style,blocks:page.blocks.filter(b=>B[b.id]||AI_X.includes(b.id)).map(b=>({id:b.id,fields:vals(b)}))}:undefined});
  const blocks=(p.blocks||[]).filter(b=>def(b.id)).map(b=>({uid:uidGen(),id:b.id,vals:toVals(def(b.id),b.fields)}));if(!blocks.length)throw new Error('The AI returned no sections. Try a more specific brief.');
  const sid=String(p.style||'').split('|')[0];page.blocks=blocks;if(p.brand)page.brand=p.brand.slice(0,40);if(p.title)page.title=p.title.slice(0,80);if(PB.styles.has(sid))page.style=sid;open=null;commit();refresh();
  $('#aiOut').textContent=(p.note||'Done.')+' Undo brings your previous page back.';say('AI page ready')}
 catch(e){$('#aiOut').textContent=e.message||'Something went wrong.'}go.disabled=!aiOn};
async function aiSection(blk,btn){if(aiOn===null)await aiStatus();if(!aiOn){say('The AI is not available here: '+aiMsg);return}
 let form=btn.parentNode.parentNode.querySelector('.aiform');if(!form){const id='aib'+(++fid);form=document.createElement('div');form.className='aiform';form.innerHTML=`<label class="f" for="${id}">What should this section say?</label><textarea id="${id}" rows="2" placeholder="For a dog-walking business in Leeds, friendly tone"></textarea><button type="button" class="btn small primary">Rewrite this section</button>`;btn.parentNode.after(form);
  form.querySelector('button').onclick=()=>aiSectionGo(blk,form);}form.querySelector('textarea').focus()}
async function aiSectionGo(blk,form){const brief=form.querySelector('textarea').value.trim()||('For '+(page.brand||'this brand'));const btn=form.querySelector('button');btn.disabled=true;btn.textContent='Rewriting…';
 try{const p=await aiCall({mode:'section',brief:(brief+LIST_NOTE).slice(0,1500),catalog:catalog(blk.id),styles:[page.style],current:{id:blk.id,fields:vals(blk)}});const b=(p.blocks||[]).find(x=>x.id===blk.id);if(!b)throw new Error('The AI returned nothing for this section.');
  Object.assign(blk.vals,toVals(def(blk.id),b.fields));commit();outline();render();say('Section rewritten. Undo brings the old words back.')}catch(e){say(e.message||'Rewrite failed');btn.disabled=false;btn.textContent='Rewrite this section'}}

/* ---------- keyboard ---------- */
document.addEventListener('keydown',e=>{const mod=e.metaKey||e.ctrlKey;if(!mod)return;const inField=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);if(inField)return;
 if(e.key.toLowerCase()==='z'&&!e.shiftKey){e.preventDefault();undo()}else if((e.key.toLowerCase()==='z'&&e.shiftKey)||e.key.toLowerCase()==='y'){e.preventDefault();redo()}});
$('#undoBtn').onclick=undo;$('#redoBtn').onclick=redo;

/* ---------- refresh ---------- */
function refresh(){$('#brand').value=page.brand||'';$('#ptitle').value=page.title||'';$('#pname').value=page.name||'';outline();render();if(rtabCur==='style')styles();if(rtabCur==='pages')pages()}
function imagesList(){$('#pbImages').innerHTML=LIB.images.map(i=>`<option value="${esc(i)}">`).join('')}

/* ---------- async sources (read-only) ---------- */
PB.loadIcon=(fam,file)=>{const k=fam+'/'+file;if(PB.loadIcon.p[k])return;PB.loadIcon.p[k]=fetch('icons/'+fam+'/'+file).then(r=>r.ok?r.text():'').then(t=>{t=t.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/\son\w+="[^"]*"/gi,'').replace(/<\?xml[^>]*>/,'').trim();
 if(t.startsWith('<svg')){PB.iconCache[k]=t.replace('<svg ','<svg aria-hidden="true" width="28" height="28" ');clearTimeout(PB.loadIcon.t);PB.loadIcon.t=setTimeout(()=>{render();if(ltab==='icons')library()},120)}}).catch(()=>{})};PB.loadIcon.p={};
/* warm the icon cache once the page is idle (sections still load their own icons on demand) */
{const warm=()=>Object.entries(LIB.iconFiles).forEach(([f,list])=>list.filter(x=>x.endsWith('.svg')).forEach(x=>PB.loadIcon(f,x)));const idle=()=>(window.requestIdleCallback||setTimeout)(warm,{timeout:4000});if(document.readyState==='complete')setTimeout(idle,2500);else addEventListener('load',()=>setTimeout(idle,2500),{once:true});}
fetch('expansion.json').then(r=>r.json()).then(j=>{const E=j.entries||[];PB.designSystems=E.filter(e=>/^D\d+/.test(e.id)&&e.tokens);PB.effects=E.filter(e=>/^L\d+/.test(e.id)&&e.film&&e.film.src);PB.styles.build();if(!PB.styles.has(page.style))page.style='studio';styles();status();if(ltab==='media')library();render()}).catch(()=>{});
fetch('backgrounds.js').then(r=>r.text()).then(t=>{const m=t.match(/const FRAG=`([\s\S]*?)`;/);if(m&&/void main/.test(m[1])){PB.bgFrag=m[1];render();if(ltab==='media')library()}}).catch(()=>{});

PB.dbg=()=>({hist:hist.map(h=>JSON.parse(h).blocks.length),fut:fut.length,last:JSON.parse(lastSnap).blocks.length,now:page.blocks.length});
/* ---------- boot ---------- */
try{const CLX=PB.src.CL();if(CLX){const st=document.createElement('style');st.textContent=CLX.css();document.head.append(st)}}catch(e){}
PB.styles.build();if(!PB.styles.has(page.style)&&!/^ds:/.test(page.style))page.style='studio';
imagesList();libTabs();library();rtab(rtabCur);refresh();histUI();showPane(ui.pane||'page');
document.body.classList.add('ready');
})();
