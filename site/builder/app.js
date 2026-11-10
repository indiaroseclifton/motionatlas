'use strict';
/* Page builder app: library, page outline and editor, styles, AI, saved pages, preview and export.
   Data: PB_LIB (blocks.js, generated), PB.styles (styles.js), PB.extraTypes (extras.js).
   Page state: {id,name,brand,title,style,pair,blocks:[{uid,id,vals}]}. */
(()=>{
const PB=window.PB,LIB=window.PB_LIB;if(!PB||!LIB||!PB.styles){document.body.insertAdjacentHTML('afterbegin','<p style="padding:20px">The page builder could not load its library. Reload the page.</p>');return}
const SITE='https://motionatlas-ten.vercel.app/',ABS=new URL('./',location.href).href;
const KEY='atlas-page-builder-v2',OLD='atlas-page-builder',UIKEY='atlas-page-builder-ui';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=PB.esc,rows=PB.rows,S=PB.site;
const B=Object.fromEntries(LIB.blocks.map(b=>[b.id,b]));
const def=id=>B[id]||PB.extraById[id];
const isX=id=>!!PB.extraById[id];
const uidGen=()=>'b'+Math.random().toString(36).slice(2,8);
const clone=x=>JSON.parse(JSON.stringify(x));
const GROUPS=['Navigation','Heroes','Features','Proof','Sell','Story','Content','Endings','Fonts'];

/* ---------- rich words: a field keeps its plain text in vals[k] and its formatting (b, i, a only) as sanitized inline HTML in blk.rich[k] ---------- */
const RICH_URL=/^(https?:\/\/|mailto:|tel:|#|page:)/i;
const unent=h=>h.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
const richText=h=>unent(String(h).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim();
/* keep only <b>, <i> and <a href>; everything else becomes text */
function cleanInline(h){const t=document.createElement('template');t.innerHTML=String(h);const ee=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const walk=n=>{let o='';n.childNodes.forEach(c=>{if(c.nodeType===3)o+=ee(c.nodeValue);else if(c.nodeType===1){const g=c.tagName,i=walk(c);if(!i.trim())o+=i;else if(g==='B'||g==='STRONG')o+='<b>'+i+'</b>';else if(g==='I'||g==='EM')o+='<i>'+i+'</i>';else if(g==='A'&&RICH_URL.test(c.getAttribute('href')||''))o+='<a href="'+ee(c.getAttribute('href'))+'">'+i+'</a>';else if(g==='BR')o+=' ';else o+=i}});return o};return walk(t.content)}
/* the legacy **bold**, *italic*, [text](address) markers become real formatting once, when a saved site loads */
function migrateRich(st){if(!st||st.rich===2)return st;const lists=[st.header||[],st.footer||[],...(st.pages||[]).map(p=>p.blocks||[])];
 lists.forEach(l=>l.forEach(b=>{const d=def(b.id);if(!d||!b.vals)return;(d.fields||[]).forEach(f=>{if(f.type!=='text'&&f.type!=='long')return;const v=b.vals[f.k];if(typeof v!=='string'||!/(\*\*\S|\*\S[^*]*\S\*|\]\()/.test(v))return;
  const hs=v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\*\*(?=\S)([^*]+?)(?<=\S)\*\*/g,'<b>$1</b>').replace(/(^|[^*])\*(?=[^\s*])([^*]+?)(?<=[^\s*])\*(?!\*)/g,'$1<i>$2</i>').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(m,t,u)=>RICH_URL.test(u)?'<a href="'+u.replace(/&amp;/g,'&').replace(/&/g,'&amp;')+'">'+t+'</a>':m);
  if(hs===v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'))return;b.rich=b.rich||{};b.rich[f.k]=hs;b.vals[f.k]=richText(hs)})}));st.rich=2;return st}
function richOf(blk,k,v,pre){const r=blk.rich&&blk.rich[k];if(!r||richText(r)!==String(v).replace(/\s+/g,' ').trim())return esc(v);
 const inA=pre.lastIndexOf('<a')>pre.lastIndexOf('</a>')||pre.lastIndexOf('<button')>pre.lastIndexOf('</button>');let h=cleanInline(r);
 if(inA)h=h.replace(/<a href="[^"]*">/g,'').replace(/<\/a>/g,'');
 return h.replace(/<a href="([^"]*)">/g,(m,u)=>{const raw=unent(u);return `<a data-rich="1" data-raw="${esc(raw)}" href="${esc(CTX?S.href(site,raw,CTX):raw)}">`})}
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
/* A saved item is a whole site (see site.js). `page` below is a view onto it: site-wide keys (brand, style, pair,
   menu, settings, header, footer) read and write the site, every other key (blocks, title, desc) the page being edited. */
let store,site,curId,open=null,hist=[],fut=[],lastSnap='';
const GK=new Set(['logo','navSeed','id','name','brand','style','pair','updated','home','pages','header','footer','navAuto','nav','settings','tokens']);
const curPage=()=>site.pages.find(p=>p.id===curId)||site.pages[0];
const page=new Proxy({},{get:(_,k)=>GK.has(k)?site[k]:curPage()[k],set:(_,k,v)=>{(GK.has(k)?site:curPage())[k]=v;return true}});
function blank(){return S.normalize({name:'Untitled site',brand:'Brand',style:'studio',blocks:[]},def)}
let hasSaved=false;
function loadStore(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.pages&&Object.keys(s.pages).length){hasSaved=true;Object.keys(s.pages).forEach(k=>{s.pages[k]=migrateRich(S.normalize(s.pages[k],def))});return s}}catch(e){}
 const s={cur:null,pages:{}};let first=null;
 try{const o=JSON.parse(localStorage.getItem(OLD));if(o&&o.blocks){hasSaved=true;first=S.normalize({name:o.brand||'My site',brand:o.brand,title:o.title,style:o.style||'noir',blocks:o.blocks},def)}}catch(e){}
 if(!first)first=S.normalize(TEMPLATES[0](),def);
 s.pages[first.id]=first;s.cur=first.id;return s}
let persistedOnce=false;
function persist(){site.updated=Date.now();try{localStorage.setItem(KEY,JSON.stringify(store));persistedOnce=true;saved('Saved','ok');if(PB.projSync)PB.projSync();if(PB.app&&PB.app.onSaved)PB.app.onSaved()}catch(e){saved('Not saved: storage is full or blocked','bad')}}
function saved(t,st){const el=$('#saveInd');if(!el)return;el.dataset.s=st||'ok';el.lastElementChild.textContent=t;el.title=st==='ok'?'Saved in this browser':t}
store=loadStore();site=store.pages[store.cur]||Object.values(store.pages)[0];store.cur=site.id;curId=site.home;
const ui=(()=>{try{return JSON.parse(localStorage.getItem(UIKEY))||{}}catch(e){return {}}})();
const saveUI=()=>{try{localStorage.setItem(UIKEY,JSON.stringify(ui))}catch(e){}};

/* ---------- history ---------- */
const snap=()=>JSON.stringify({...site,updated:0});
lastSnap=snap();
function commit(){const s=snap();if(s===lastSnap)return;hist.push(lastSnap);if(hist.length>80)hist.shift();fut=[];lastSnap=s;persist();histUI()}
let typing=0;function commitSoon(){clearTimeout(typing);saved('Unsaved changes…','dirty');typing=setTimeout(commit,600)}
/* leaving the page (reload, closing the tab, going to another tool) must not lose words typed in the last moment */
const flushTyping=()=>{try{pv.contentWindow.__pbFlush&&pv.contentWindow.__pbFlush()}catch(e){}if(typing){clearTimeout(typing);typing=0;try{commit()}catch(e){}}};window.__pbApply=m=>{applyText(m);commitSoon()};addEventListener('pagehide',flushTyping);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushTyping()});
function restore(s){site=JSON.parse(s);store.pages[site.id]=site;if(!site.pages.some(p=>p.id===curId))curId=site.home;lastSnap=s;persist();refresh()}
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
/* a story body: one block per line. ## heading, ### subheading, > quote, - list item, ![caption](image), anything else a paragraph */
function storyHTML(raw){const lines=String(raw||'').split('\n').map(x=>x.trim()).filter(Boolean);let out='',list=false;const close=()=>{if(list){out+='</ul>';list=false}};
 lines.forEach(l=>{let m;
  if((m=/^-\s+(.+)$/.exec(l))){if(!list){out+='<ul>';list=true}out+='<li>'+esc(m[1])+'</li>';return}close();
  if((m=/^###\s+(.+)$/.exec(l)))out+='<h3>'+esc(m[1])+'</h3>';
  else if((m=/^##\s+(.+)$/.exec(l)))out+='<h2>'+esc(m[1])+'</h2>';
  else if((m=/^>\s+(.+)$/.exec(l)))out+='<blockquote><p>'+esc(m[1])+'</p></blockquote>';
  else if((m=/^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(l))){const src=m[2];const u=/^user:[\w-]+$/.test(src)?'\u0002U:'+src.slice(5)+'\u0002':/^https?:\/\//i.test(src)?esc(src):/^[\w\/.-]+$/.test(src)?'\u0001A/'+src:'';
   out+=u?`<figure class="pf"><img src="${u}" alt="${esc(m[1])}" loading="lazy">${m[1]?'<figcaption>'+esc(m[1])+'</figcaption>':''}</figure>`:''}
  else out+='<p>'+esc(l)+'</p>'});close();return out}
function fill(str,blk,A){const d=def(blk.id),keys=new Set(fieldsOf(d).map(f=>f.k));
 str=str.replace(/\{\{each:(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,(m,k,body)=>rows(val(blk,k)).map((cells,i)=>body.replace(/\{\{n\}\}|\{\{(g|i|t|list)?(\d+)\}\}/g,(mm,kind,num)=>{if(mm==='{{n}}')return String(i+1);const c=cells[+num]||'';
  if(!kind)return esc(c);if(kind==='g')return glyph(c);if(kind==='i')return esc(initials(c));if(kind==='t')return tick(c);return c.split(';').map(x=>x.trim()).filter(Boolean).map(x=>'<li>'+esc(x)+'</li>').join('')})).join(''));
 str=str.replace(/\{\{rich:(\w+)\}\}/g,(m,k)=>storyHTML(val(blk,k)));
 return str.replace(/\{\{(\w+)\}\}/g,(m,k,off)=>{if(k==='A')return A;if(k==='brand'){const pre=str.slice(0,off);if(site.logo&&pre.lastIndexOf('<')<=pre.lastIndexOf('>')&&!/(©\s*\d{4}\s*|<th[^>]*>|class="word"[^>]*>)$/.test(pre))return `<img class="pb-logo" src="${esc(site.logo)}" alt="" style="height:1.1em;width:auto;vertical-align:-.18em;margin-right:.45em">`+esc(page.brand||'Brand');return esc(page.brand||'Brand')}if(k==='formAction')return esc(CTX&&CTX.mode==='preview'?'#':(site.settings.formAction||'#'));if(k==='home')return esc(CTX?CTX.pageHref(S.pageOf(site,site.home)):'#');
  if(k==='menu'||k==='menuL'||k==='menuR'){const it=S.menu(site),h=Math.ceil(it.length/2),sub=k==='menu'?it:k==='menuL'?it.slice(0,h):it.slice(h);return CTX?S.menuHTML(site,sub,CTX,esc):''}
  if(!keys.has(k))return m;const f=fieldsOf(d).find(f=>f.k===k);if(f.type==='link')return esc(CTX?S.href(site,val(blk,k),CTX):'#');if(f.type==='image'&&/^user:[\w-]+$/.test(val(blk,k)))return '\u0002U:'+val(blk,k).slice(5)+'\u0002';
  if(f.type==='text'||f.type==='long'){const pre=str.slice(0,off),inTag=pre.lastIndexOf('<')>pre.lastIndexOf('>');return inTag?esc(val(blk,k)):richOf(blk,k,val(blk,k),pre)}
  return esc(f.type==='list'?rows(val(blk,k)).map(r=>r.join(' ')).join(', '):val(blk,k))})}

/* ---------- compose ---------- */
const AT='\u0001A/';
const cache={cl:null,ix:{}};
let CTX=null;
/* ---- my fonts (kept in the visitor's browser; see fontlib.js) ---- */
const MINE={zip:false,pub:false};
const MF=()=>window.MyFonts||null;
const mineUsed=txt=>{const M=MF();return M&&txt?M.list().map(f=>f.family).filter(n=>txt.includes("'"+n+"'")):[]};
const pairOf=pg=>{const p=pg.pair;if(typeof p==='string'&&/^my[hba]:/.test(p)){const k=p[2],n=p.slice(4),cur=PB.styles.get(pg.style);return ['My font: '+n,k==='b'?cur.head:n,k==='h'?cur.body:n]}return p>=0?LIB.pairs[p]:null};
const newAcc=()=>({css:new Map(),fonts:new Set(),files:new Map()});
let pubBase='';
const pageHrefFor=mode=>p=>mode==='preview'?'#pb-page:'+p.id:(mode==='zip'?pubBase:'')+S.pageFile(site,p);
/* site tokens: colour, radius, font and button overrides on top of the chosen style */
function withTokens(st,acc){const tk=site.tokens;if(!tk||!Object.keys(tk).length)return st;const sw=(st.style&&st.style.sw)||[],C=PB.color;
 const bg=tk.bg||sw[0]||'#FFFFFF',surf=tk.surface||sw[1]||bg,o=[];
 if(tk.bg){o.push('--bg:'+tk.bg);o.push('color-scheme:'+(C.lum(tk.bg)<.2?'dark':'light'))}
 if(tk.surface)o.push('--surface:'+tk.surface);
 if(tk.ink){o.push('--ink:'+tk.ink,'--mute:'+C.ensure(C.mix(tk.ink,bg,.38),[bg,surf],4.6))}
 if(tk.accent){o.push('--accent:'+tk.accent,'--on-accent:'+C.best(tk.accent),'--accent-ink:'+C.ensure(tk.accent,[bg,surf],4.5))}
 if(tk.radius!=null)o.push('--radius:'+tk.radius+'px');
 let fonts=st.fonts||'',vars=st.vars;const names=[];
 if(tk.fontHead){o.push('--head:'+PB.styles.stack(tk.fontHead));names.push(tk.fontHead)}if(tk.fontBody){o.push('--body:'+PB.styles.stack(tk.fontBody));names.push(tk.fontBody)}
 if(names.length)fonts=[fonts,PB.styles.gq(names)].filter(Boolean).join('&');
 if(tk.btn==='sharp')acc.css.set('pb-tk-btn','.btn{border-radius:0!important}');else if(tk.btn==='pill')acc.css.set('pb-tk-btn','.btn{border-radius:999px!important}');
 return {...st,vars:vars+';'+o.join(';'),fonts}}
const buildCSS=(st,acc)=>':root{'+st.vars+'}\n'+(st.face||'')+LIB.base+'.h{text-transform:var(--case,none)}@media (max-width:700px){h1,h2,h3{overflow-wrap:anywhere}}@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}html{scroll-padding-top:72px}@media print{.pb-sticky{position:static!important}video,.ctrl,form{display:none!important}body{background:#fff!important;color:#000!important}a{text-decoration:underline}.x-nf{min-height:0!important}}\n'+[...acc.css.values()].join('\n');
const fontURLOf=acc=>acc.fonts.size?'https://fonts.googleapis.com/css2?'+[...acc.fonts].join('&')+'&display=swap':'';
function compose(mode,pg,acc,opt){ // mode: preview | html | zip  -> parts for one page (header + page + footer). acc shares css/fonts/files between pages.
 pg=pg||curPage();acc=acc||newAcc();
 const base=mode==='preview'?ABS:SITE;const pair=pairOf(page);
 const st=withTokens(PB.styles.resolve(page.style,pair,base),acc);
 const css=acc.css,fonts=acc.fonts,files=acc.files,needs=new Map(),body=[],js=[];
 (st.fonts||'').split('&').filter(Boolean).forEach(f=>fonts.add(f));
 CTX={mode,current:pg.id,pageHref:pageHrefFor(mode)};
 const ctx={mode,A:AT,site:base,siteData:site,pageHref:p=>CTX.pageHref(p),uid:'',home:CTX.pageHref(S.pageOf(site,site.home)),need:(k,v)=>{if(!needs.has(k))needs.set(k,v)},font:q=>{(q||'').split('&').filter(Boolean).forEach(f=>fonts.add(f))},
  vars:PB.ix.vars(st.vars),
  interactionSrc:(id,cfg,uid)=>{const fixA=t=>t.split('../../assets/').join((mode==='preview'?ABS:SITE)+'assets/');
   const img=v=>{if(!v)return '';if(/^user:/.test(v)){const u=upURL(v.slice(5),mode,acc);return mode==='zip'&&!/^(https?:|data:)/.test(u)?'../'+u:u}if(/^(https?:|data:)/.test(v))return v;return (mode==='preview'?ABS:SITE)+'assets/'+v.replace(/^assets\//,'')};
   const mk=()=>{const raw=PB.ix.raw[id];return raw==null?null:PB.ix.build(fixA(raw),{id,cfg,vars:ctx.vars,img})};
   const act=PB.ix.active(cfg);
   if(mode==='preview'){if(!act)return `src="${ABS}interactions/demos/${esc(id)}.html"`;const d=mk();if(d==null){PB.ix.load(id).then(()=>render());return `src="about:blank"`}return `srcdoc="${d.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"`}
   const t=cache.ix[id];if(t==null)return `src="${SITE}interactions/demos/${esc(id)}.html"`;
   const d=act?PB.ix.build(t,{id,cfg,vars:ctx.vars,img}):t;
   if(mode==='zip'){const f='interactions/'+id+(act?'-'+uid:'')+'.html';files.set(f,d);return `src="${f}"`}
   return `srcdoc="${d.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"`}};

 let prevB=null,prevZ=null;
 [...(opt&&opt.solo?[]:site.header).map(b=>[b,'header']),...pg.blocks.map(b=>[b,'page']),...(opt&&opt.solo?[]:site.footer).map(b=>[b,'footer'])].forEach(([blk,zone])=>{const d=def(blk.id);if(!d)return;ctx.uid=blk.uid;ctx.cfg=blk.cfg||{};ctx.blk=blk;let html='',bjs='';
  try{if(isX(blk.id)){const r=d.render(vals(blk),ctx)||{};html=r.html||'';bjs=r.js||'';(r.css||[]).forEach(([k,c])=>{if(!css.has(k))css.set(k,c)});if(!css.has('x-base'))css.set('x-base',PB.extraBase)}
   else{html=fill(mode==='preview'?PB.canvas.mark(d):d.html,blk,AT);bjs=d.js?fill(d.js,blk,AT):'';if(!css.has('b:'+d.id))css.set('b:'+d.id,d.css)}}
  catch(e){console.warn('Page builder: block failed',blk.id,e);html='<section class="wrap"><p>This section could not be drawn.</p></section>'}
  html=applyFocal(html,blk);
  if(mode==='preview')html=lazyMedia(html);
  html=anchors(S.linkPages(site,html.split(AT+'http').join('http'),CTX,esc),blk,mode);
  html=html.replace(/\u0001A\/\u0002U:([\w-]+)\u0002|\u0002U:([\w-]+)\u0002/g,(m,a,b)=>upURL(a||b,mode,acc));
  let eff=blk;if(blk.set&&blk.set.match&&prevB&&prevZ===zone&&prevB.set){const ps=prevB.set,mx={};['bg','bgc','bgv','ov'].forEach(k=>{if(ps[k]!=null)mx[k]=ps[k]});eff={...blk,set:{...blk.set,...mx,matched:1}}}
  prevB=blk;prevZ=zone;
  const sb=PB.sec.build(eff,{mode,A:AT,frame:blk.id==='x-component'||blk.id==='x-interaction',asset:v=>/^user:/.test(v)?upURL(v.slice(5),mode,acc):AT+v});
  if(sb.css)css.set('set:'+blk.uid,sb.css);if(sb.rt)ctx.need(sb.rt,PB.sec.runtime[sb.rt]);
  if(!css.has('pb-base'))css.set('pb-base',PB.sec.base);
  const sticky=S.isTop(d)&&d.id!=='announce';
  body.push(`<div class="b-${isX(blk.id)?'x':d.id}${sticky?' pb-sticky':''}${sb.cls?' '+sb.cls:''}" id="${blk.uid}"${mode==='preview'?' data-pb data-zone="'+zone+'" data-name="'+esc(d.name)+'"':''}>${mode==='preview'?lazyMedia(sb.inner):sb.inner}${sb.flip?`<div class="pb-in" style="${sb.flip}">${html}</div>`:html}</div>`);
  const hh=blk.set&&blk.set.hide;if(mode==='preview'&&EDIT&&!(opt&&opt.solo)&&hh&&(hh.d||hh.t||hh.p)){const nm=[hh.d?'desktop':'',hh.t?'tablet':'',hh.p?'phone':''].filter(Boolean);css.set('pb-ghost','.pb-ghost{display:none;align-items:center;justify-content:center;gap:10px;margin:6px 12px;padding:8px 12px;border:1.5px dashed #8a8fa3;border-radius:10px;background:rgba(138,143,163,.12);color:#555b70;font:600 12px/1.2 system-ui,sans-serif}.pb-ghost button{all:unset;cursor:pointer;color:#5B2DFF;text-decoration:underline;font-weight:700}.pb-ghost button:focus-visible{outline:2px solid #5B2DFF;outline-offset:2px}@media (min-width:1025px){.pbg-d{display:flex}}@media (min-width:641px) and (max-width:1024px){.pbg-t{display:flex}}@media (max-width:640px){.pbg-p{display:flex}}');
   body.push(`<div class="pb-ghost${hh.d?' pbg-d':''}${hh.t?' pbg-t':''}${hh.p?' pbg-p':''}" data-pbg="${blk.uid}"><span>${esc(d.name)}: hidden on ${nm.join(' and ')}</span><button type="button" data-pbg-show="${blk.uid}">Show</button></div>`)}
  if(bjs)js.push(`(()=>{const root=document.getElementById(${JSON.stringify(blk.uid)});if(!root)return;try{${bjs}}catch(e){console.error(e)}})();`)});
 const rt=[];let cl=false;
 needs.forEach((v,k)=>{if(v&&v.componentLab)cl=true;else rt.push(v)});
 return {st,acc,pg,cssText:buildCSS(st,acc),body:body.join('\n'),runtime:rt.join('\n'),js:js.join('\n'),cl,fontURL:fontURLOf(acc),files,mode};
}
/* focus point: vals[k+'_fp'] = 'x% y%' becomes object-position on the image that shows field k */
function applyFocal(html,blk){const v=blk.vals;if(!v)return html;Object.keys(v).filter(k=>/_fp$/.test(k)&&v[k]).forEach(k=>{const fp=String(v[k]);if(!/^\d{1,3}% \d{1,3}%$/.test(fp))return;const val=v[k.slice(0,-3)];if(!val)return;const needle=/^user:/.test(val)?'U:'+String(val).slice(5)+'\u0002':val;
  html=html.replace(/<img\b[^>]*>/g,tag=>tag.includes(needle)?(/style="/.test(tag)?tag.replace('style="','style="object-position:'+fp+';'):tag.replace('<img','<img style="object-position:'+fp+'"')):tag)});return html}
/* poster first: in the editor, films wait for a poster frame and start when they scroll into view; frames load lazily */
function lazyMedia(h){if(!h||h.indexOf('<')<0)return h;return h.replace(/<video\b([^>]*)>/g,(m,a)=>'<video data-pbv preload="none"'+a.replace(/\sautoplay(="[^"]*")?/g,'')+'>').replace(/<iframe\b(?![^>]*loading=)/g,'<iframe loading="lazy"')}
/* anchors: per-link overrides (blk.links[index]) and preview ids */
function anchors(html,blk,mode){let i=0;return html.replace(/<a\s([^>]*)>/g,(m,attrs)=>{if(/data-rich/.test(attrs))return m;const idx=i++;const ov=blk.links&&blk.links[idx];let a=attrs;
  if(ov!==undefined){const h='href="'+esc(S.href(site,ov,CTX))+'"';a=/href="[^"]*"/.test(a)?a.replace(/href="[^"]*"/,h):h+' '+a}
  if(mode==='preview')a+=` data-pba="${idx}"`;return '<a '+a+'>'})}
const dcache=new Map();
function upURL(id,mode,acc){if(mode==='preview')return PB.images.url(id);if(mode==='zip'){(acc.uploads=acc.uploads||new Set()).add(id);return pubBase+'assets/uploads/'+id+'.'+PB.images.ext(id)}return dcache.get(id)||''}
const ogURL=v=>!v?'':/^(https?:|data:)/.test(v)?v:SITE+'assets/'+v.replace(/^\/+/,'');
function mineHead(P){const used=mineUsed(P.cssText),M=MF();if(!used.length)return '';
 if(P.mode==='preview')return `<style id="pb-myfonts">${M.fontFaceCSSSync(used,{mode:'blob'})}</style>`;
 if(P.mode==='html'&&MINE.zip)return `<style id="pb-myfonts">${M.fontFaceCSSSync(used,{mode:'base64'})}</style>`;
 return `\n<!-- Fonts: this page uses your own font${used.length>1?'s':''} (${used.join(', ')}). The font files are not included. Bring your own font files: place them in a /fonts folder and add @font-face rules for them. -->`}
function assemble(P,opt={}){ // opt: {cssHref, jsHref, clSrc, clInline, favHref, canonical, title}
 const pg=P.pg,stg=site.settings,pre=P.mode==='preview',home=pg.id===site.home;
 const title=opt.title||pg.title||(home?(site.brand||pg.name):pg.name+' · '+(site.brand||''));
 const desc=pg.desc||stg.description||'',og=ogURL(pg.og||stg.ogImage);
 let head=`<!doctype html>\n<html lang="${esc(stg.lang||'en')}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${esc(title)}</title>\n`;
 if(!pre){head+=(desc?`<meta name="description" content="${esc(desc)}">\n`:'')+`<meta property="og:title" content="${esc(title)}">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="${esc(site.brand||'')}">\n`+(desc?`<meta property="og:description" content="${esc(desc)}">\n`:'')+(og?`<meta property="og:image" content="${esc(og)}">\n<meta name="twitter:card" content="summary_large_image">\n`:'<meta name="twitter:card" content="summary">\n')+(pg.noindex?'<meta name="robots" content="noindex">\n':'')+(opt.canonical?`<link rel="canonical" href="${esc(opt.canonical)}">\n<meta property="og:url" content="${esc(opt.canonical)}">\n`:'')+(opt.favHref?`<link rel="icon" href="${esc(opt.favHref)}" type="image/svg+xml">\n`:'')+(opt.feedHref&&S.posts(site).length?`<link rel="alternate" type="application/rss+xml" title="${esc(site.brand||site.name)}" href="${esc(opt.feedHref)}">\n`:'')}
 head+=(P.fontURL?`<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="${P.fontURL}">\n`:'')+
  (pre?'':`<!-- Built with the Visual & Motion Atlas site builder. Style: ${esc(P.st.style.name)}. -->\n`)+(opt.cssHref?`<link rel="stylesheet" href="${opt.cssHref}">`:`<style>\n${P.cssText}\n</style>`)+mineHead(P)+(!pre&&stg.analytics?'\n'+stg.analytics+'\n':'')+'</head><body>\n';
 let scripts='';
 if(P.cl){scripts+=opt.clInline?`<script>${opt.clInline.replace(/<\/script/gi,'<\\/script')}<\/script>\n`:`<script src="${opt.clSrc||SITE+'component-lab.js'}"><\/script>\n`;
  scripts+=`<script>/* wake the component behaviours */document.body.appendChild(document.createElement('span')).hidden=true;<\/script>\n`}
 const code=(P.runtime?P.runtime+'\n':'')+P.js;
 if(code)scripts+=opt.jsHref?`<script src="${opt.jsHref}"><\/script>\n`:`<script>\n${code.replace(/<\/script/gi,'<\\/script')}\n<\/script>\n`;
 if(pre&&!opt.noagent)scripts+=`<script>window.__PB_EDIT=${opt.edit?'true':'false'};${PB.agentSrc}<\/script>\n`;
 const emptyMsg=pre&&!pg.blocks.length&&!site.header.length&&!site.footer.length?'<div id="pb-empty" style="padding:14vh 24px;text-align:center;font:500 16px/1.5 system-ui,sans-serif;color:#555"><p style="font:italic 500 30px/1.1 Georgia,serif;margin:0 0 10px;color:#1C1F2A">This page is empty.</p><p style="margin:0 0 18px">Add a section, or start from a template.</p><button type="button" style="font:600 14px system-ui;padding:11px 18px;border-radius:10px;border:0;background:#5B2DFF;color:#fff;cursor:pointer" onclick="parent.postMessage({pb:\'empty\'},\'*\')">Add a section</button> <button type="button" style="font:600 14px system-ui;padding:11px 18px;border-radius:10px;border:1px solid #ccc;background:#fff;color:#1C1F2A;cursor:pointer" onclick="parent.postMessage({pb:\'emptyTpl\'},\'*\')">Browse templates</button></div>':'';
 return head+P.body+emptyMsg+'\n'+scripts+'</body></html>\n';
}
const xe=t=>String(t==null?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function feedXML(base){const u=base.replace(/\/?$/,'/'),items=S.posts(site).slice(0,50).map(p=>{const b=p.blocks.find(x=>x.id==='blog-post'),v=(b&&b.vals)||{},ex=String(v.paras||'').split('\n').find(l=>l.trim()&&!/^(#|>|-|!)/.test(l.trim()))||'';
  return `<item><title>${xe(v.heading||p.name)}</title><link>${xe(u+S.pageFile(site,p))}</link><guid isPermaLink="true">${xe(u+S.pageFile(site,p))}</guid><pubDate>${S.rfc822(p.date)}</pubDate>${v.tag?`<category>${xe(v.tag)}</category>`:''}<description>${xe(ex)}</description></item>`}).join('\n');
 return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${xe(site.brand||site.name)}</title><link>${xe(u)}</link><description>${xe(site.settings.description||site.brand||'')}</description><language>${xe(site.settings.lang||'en')}</language>\n${items}\n</channel></rss>\n`}
const swapA=(s,base)=>s.split(AT).join(base);

/* ---------- preview ---------- */
const pv=$('#pv');let rt=0,lastY=0,jump=null,pgSeen=null;
let editingText=false,rendPending=false;
function render(){clearTimeout(rt);rt=setTimeout(()=>{if(editingText){rendPending=true;return}try{lastY=pv.contentWindow.scrollY||0}catch(e){}if(pgSeen!==curId){if(pgSeen!==null)lastY=0;pgSeen=curId}const P=compose('preview');pv.srcdoc=swapA(assemble(P,{clSrc:ABS+'component-lab.js',edit:EDIT}),ABS+'assets/');status()},160)}
pv.addEventListener('load',()=>{try{const w=pv.contentWindow;if(jump){const el=w.document.getElementById(jump);if(el)el.scrollIntoView();jump=null}else w.scrollTo(0,lastY)}catch(e){}});
function status(){$('#status').textContent=curPage().name+' · '+page.blocks.length+' sections · '+PB.styles.get(page.style).name}
function scrollPreviewTo(uid){jump=uid;try{const t=pv.contentWindow.document.getElementById(uid);if(t){t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});jump=null}}catch(e){}}

/* ---------- toast ---------- */
const toast=$('#toast');function say(m){toast.textContent=m;toast.classList.add('on');clearTimeout(say.t);say.t=setTimeout(()=>toast.classList.remove('on'),2200)}

/* ---------- adding, moving ---------- */
const lists=()=>[['header',site.header],['page',page.blocks],['footer',site.footer]];
function findBlk(u){for(const [kind,list] of lists()){const i=list.findIndex(b=>b.uid===u);if(i>=0)return {blk:list[i],list,i,kind}}return null}
const listFor=id=>{const d=def(id);return S.isTop(d)?site.header:S.isEnd(d)?site.footer:page.blocks};
function placeIndex(id){const d=def(id),bl=listFor(id);
 if(id==='announce')return 0;if(S.isTop(d)){let i=0;while(i<bl.length&&def(bl[i].id).place==='top')i++;return i}
 if(d&&d.place==='hero'){let i=0;while(i<bl.length&&def(bl[i].id).place==='hero')i++;return i}
 return bl.length}
function dropAt(i,list){const items=$$('#ol .blk');if(i<items.length){const t=findBlk(items[i].dataset.uid);return t&&t.list===list?t.i:-1}const l=items[items.length-1],t=l&&findBlk(l.dataset.uid);return t&&t.list===list?list.length:-1}
function addBlock(id,valsIn,at,extra){if(!def(id))return;pushRecent(itemKey(id,valsIn||{}));const b={uid:uidGen(),id,vals:valsIn||{}};if(extra){if(extra.rich)b.rich=clone(extra.rich);if(extra.cfg)b.cfg=clone(extra.cfg);if(extra.set)b.set=clone(extra.set);if(extra.links)b.links=clone(extra.links)}let list=listFor(id),i=-1;
 if(addTarget){const t=findBlk(addTarget.uid),w=addTarget.where;addTarget=null;if(t&&t.list===list){i=t.i+(w==='before'?0:1)}}
 if(i<0&&at!=null)i=dropAt(at,list);if(i<0)i=placeIndex(id);
 list.splice(i,0,b);open=b.uid;csel={uid:b.uid,kind:'section'};commit();outline();render();jump=b.uid;say('Added '+def(id).name+(list===page.blocks?'':list===site.header?' to the header (every page)':' to the footer (every page)'));return b}
function move(list,i,j){if(j<0||j>=list.length||i===j)return;const [b]=list.splice(i,1);list.splice(j,0,b);commit();outline();render()}

/* ---------- outline + editor ---------- */
function outline(){const ol=$('#ol');ol.innerHTML='';
 lists().forEach(([kind,list])=>{const h=document.createElement('li');h.className='grp';h.innerHTML=kind==='page'?`<b>This page: ${esc(curPage().name)}</b>`:`<b>${kind==='header'?'Header':'Footer'}</b><small>Shown on every page</small>`;ol.append(h);
  if(!list.length){const e=document.createElement('li');e.className='empty';e.textContent=kind==='page'?'No sections yet. Add some from the library, or drag them here.':kind==='header'?'No header yet. Add a navigation bar from the library.':'No footer yet. Add a footer from the library.';ol.append(e)}
  list.forEach((blk,i)=>ol.append(outRow(blk,list,i)))});
 selPanel();status()}
/* the Selected item panel: components and interactions get their full settings form pinned at the top of the sidebar */
let selWas=null;
function selPanel(){const host=$('#selItem');if(!host)return;const f=open&&findBlk(open),blk=f&&f.blk;
 if(!blk||!(PB.cfg&&PB.cfg.has(blk)&&PB.cfg.schema(blk))){host.hidden=true;host.innerHTML='';selWas=null;return}
 if(host.contains(document.activeElement)&&selWas===blk.uid&&document.activeElement.matches('input,textarea,select'))return;
 host.hidden=false;host.innerHTML='';const top=document.createElement('div');top.className='selhead';top.innerHTML='<h3>Selected item</h3>';const done=document.createElement('button');done.type='button';done.className='btn small';done.textContent='Done';done.title='Close the settings';done.onclick=()=>{open=null;csel=null;outline();hideTb&&hideTb()};top.append(done);host.append(top,PB.cfg.panel(blk));
 if(selWas!==blk.uid){selWas=blk.uid;const sc=host.closest('.scroll');if(sc)sc.scrollTop=0;}}
function outRow(blk,list,i){const d=def(blk.id);const li=document.createElement('li');li.className='blk'+(open===blk.uid?' open':'');li.dataset.uid=blk.uid;li.draggable=true;
  const sub=isX(blk.id)?xLabel(blk):d.group;
  li.innerHTML=`<div class="bh"><span class="grip" aria-hidden="true">⋮⋮</span><button class="bname" aria-expanded="${open===blk.uid}" aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown" title="Alt + ↑/↓ moves this section"><b>${esc(d.name)}</b><small>${esc(sub)}</small></button>
   <button class="ib" data-a="up" aria-label="Move ${esc(d.name)} up"${i?'':' disabled'}>↑</button><button class="ib" data-a="down" aria-label="Move ${esc(d.name)} down"${i<list.length-1?'':' disabled'}>↓</button><button class="ib" data-a="dup" aria-label="Duplicate ${esc(d.name)}">⧉</button><button class="ib" data-a="rm" aria-label="Remove ${esc(d.name)}">✕</button></div>`;
  if(open===blk.uid&&!(PB.cfg&&PB.cfg.has(blk)&&PB.cfg.schema(blk)))li.append(editor(blk));
  const nb=li.querySelector('.bname');
  nb.onclick=()=>{open=open===blk.uid?null:blk.uid;outline();if(open)scrollPreviewTo(blk.uid);const again=$(`#ol [data-uid="${blk.uid}"] .bname`);again&&again.focus()};
  nb.onkeydown=e=>{if(e.altKey&&(e.key==='ArrowUp'||e.key==='ArrowDown')){e.preventDefault();const j=e.key==='ArrowUp'?i-1:i+1;if(j<0||j>=list.length)return;move(list,i,j);say(d.name+' moved to position '+(j+1));const el=$(`#ol [data-uid="${blk.uid}"] .bname`);el&&el.focus()}};
  li.querySelectorAll('.ib').forEach(b=>b.onclick=()=>{const a=b.dataset.a;
   if(a==='rm'){list.splice(i,1);if(open===blk.uid)open=null;commit();outline();render();say('Removed '+d.name+'. Undo brings it back.');const n=$$('#ol .blk')[Math.min(i,$$('#ol .blk').length-1)];(n?n.querySelector('.bname'):$('#libSearch')).focus();return}
   if(a==='dup'){const c={uid:uidGen(),id:blk.id,vals:clone(blk.vals)};if(blk.rich)c.rich=clone(blk.rich);if(blk.cfg)c.cfg=clone(blk.cfg);list.splice(i+1,0,c);commit();outline();render();say('Duplicated '+d.name);return}
   const j=a==='up'?i-1:i+1;move(list,i,j);const el=$(`#ol [data-uid="${blk.uid}"] [data-a="${a}"]:not(:disabled)`)||$(`#ol [data-uid="${blk.uid}"] .bname`);el&&el.focus()});
  return li}
function xLabel(blk){const v=vals(blk);try{if(blk.id==='x-component'){const c=PB.src.CL()&&PB.src.CL().components.find(x=>x.id===v.cid);return c?c.id+' · '+c.name:'Component'}
 if(blk.id==='x-interaction'){const x=(window.INTERACTIONS||[]).find(x=>x.id===v.iid);return x?x.t:'Interaction'}
 if(blk.id==='x-background'){const p=PB.src.BGA()&&PB.src.BGA().ALL.find(p=>p.key===v.bg);return p?p.name:'Background'}
 if(blk.id==='x-kitbg'||blk.id==='x-kitasset'){const k=PB.src.kit(v.kit);return (k?k.name:'Kit')+(v.asset?' · '+v.asset:'')}
 if(blk.id==='x-icons')return 'Icons · '+v.family;if(blk.id==='x-effect')return v.lid;if(blk.id==='x-film')return v.film}catch(e){}return def(blk.id).group}
let fid=0;
function setS(blk,k,v,redraw){blk.set=blk.set||{};if(v===''||v==null||v==='default'||v===false)delete blk.set[k];else blk.set[k]=v;if(!Object.keys(blk.set).length)delete blk.set;commit();if(redraw)outline();render()}
function settingsUI(blk){const det=document.createElement('details');det.className='setd';if(blk.set)det.open=true;const sm=document.createElement('summary');sm.textContent='Section settings'+(blk.set?' ·  customised':'');det.append(sm);const box=document.createElement('div');box.className='setb';det.append(box);const S0=blk.set||{};
 const sel=(label,opts,key,redraw)=>{const id='f'+(++fid),w=document.createElement('div');w.className='f';const l=document.createElement('label');l.htmlFor=id;l.textContent=label;const s=document.createElement('select');s.id=id;opts.forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;s.append(o)});s.value=S0[key]||opts[0][0];s.onchange=()=>setS(blk,key,s.value,redraw);w.append(l,s);box.append(w);return s};
 sel('Spacing',PB.sec.SPACING,'pad');sel('Width',PB.sec.WIDTH,'width');sel('Alignment',PB.sec.ALIGN,'align');sel('Background',PB.sec.BG,'bg',true);
 if(S0.bg==='custom'){const id='f'+(++fid),w=document.createElement('div');w.className='f';w.innerHTML=`<label for="${id}">Background colour</label><input id="${id}" type="color" value="${/^#[0-9a-f]{6}$/i.test(S0.bgc||'')?S0.bgc:'#f4efe6'}">`;const ci=w.querySelector('input');ci.oninput=()=>{blk.set=blk.set||{};blk.set.bgc=ci.value;commitSoon();render()};ci.onchange=()=>commit();if(!S0.bgc){blk.set=blk.set||{};blk.set.bgc=ci.value}box.append(w)}
 {const id='f'+(++fid),w=document.createElement('label');w.className='check';const c=document.createElement('input');c.type='checkbox';c.id=id;c.checked=!!S0.match;c.onchange=()=>setS(blk,'match',c.checked?1:'',false);w.append(c,' Match the section above (no seam)');box.append(w)}
 sel('Border',PB.sec.BORDER,'bd');sel('Shadow',PB.sec.SHADOW,'sh');
 [['rd','Corner radius',0,60,'As designed'],['pd','Exact space above and below',0,240,'Use the Spacing setting']].forEach(([k,l,mn,mx,em])=>{const id='f'+(++fid),w=document.createElement('div');w.className='f';const has=S0[k]!=null&&S0[k]!=='';w.innerHTML=`<label for="${id}">${l}: <output>${has?S0[k]+'px':em}</output></label><input id="${id}" type="range" min="${mn}" max="${mx}" step="2" value="${has?S0[k]:mn}">`;const r=w.querySelector('input'),o=w.querySelector('output');r.oninput=()=>{o.textContent=r.value+'px';blk.set=blk.set||{};blk.set[k]=+r.value;commitSoon();render()};box.append(w)});
 if(S0.bg==='image'||S0.bg==='film'){const id='f'+(++fid),w=document.createElement('div');w.className='f';const l=document.createElement('label');l.htmlFor=id;l.textContent=S0.bg==='film'?'Background film':'Background image';
  if(S0.bg==='film'){const s=document.createElement('select');s.id=id;[['','Choose a film'],...LIB.films.map(n=>[n,n.replace(/-/g,' ')])].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;s.append(o)});s.value=S0.bgv||'';s.onchange=()=>setS(blk,'bgv',s.value);w.append(l,s)}
  else{const i=document.createElement('input');i.id=id;i.setAttribute('list','pbImages');i.placeholder='Pick a library image or paste a path';i.value=/^user:/.test(S0.bgv||'')?'(uploaded image)':S0.bgv||'';i.onchange=()=>setS(blk,'bgv',i.value.trim());const up=document.createElement('button');up.type='button';up.className='btn small';up.textContent='Upload an image';const fi=document.createElement('input');fi.type='file';fi.accept='image/*';fi.hidden=true;fi.setAttribute('aria-label','Choose a background image file');up.onclick=()=>fi.click();fi.onchange=async()=>{const fl=fi.files[0];if(!fl)return;if(!/^image\//.test(fl.type))return say('That file is not an image. Try a JPG, PNG or WebP.');try{const id2=await PB.images.add(fl);setS(blk,'bgv','user:'+id2,true)}catch(e){say('Could not keep that image. Try a smaller JPG, PNG or WebP.')}};w.append(l,i,up,fi)}
  box.append(w);
  const oid='f'+(++fid),ow=document.createElement('div');ow.className='f';ow.innerHTML=`<label for="${oid}">Tint over the background: <output>${S0.ov>=0&&S0.ov!=null?S0.ov:55}%</output></label><input id="${oid}" type="range" min="0" max="90" step="5" value="${S0.ov>=0&&S0.ov!=null?S0.ov:55}">`;const r=ow.querySelector('input');r.oninput=()=>{ow.querySelector('output').textContent=r.value+'%'};r.onchange=()=>{blk.set=blk.set||{};blk.set.ov=+r.value;commit();render()};box.append(ow)}
 const hs=document.createElement('fieldset');hs.className='hidef';hs.innerHTML='<legend>Hide on</legend>';[['d','Desktop'],['t','Tablet'],['p','Phone']].forEach(([k,t])=>{const lb=document.createElement('label');lb.className='check';const c=document.createElement('input');c.type='checkbox';c.checked=!!(S0.hide&&S0.hide[k]);c.onchange=()=>{blk.set=blk.set||{};const h=Object.assign({},blk.set.hide);if(c.checked)h[k]=1;else delete h[k];if(Object.keys(h).length)blk.set.hide=h;else delete blk.set.hide;if(!Object.keys(blk.set).length)delete blk.set;commit();render()};lb.append(c,' '+t);hs.append(lb)});box.append(hs);
 const bpd=document.createElement('details');bpd.className='setd bpd';if(S0.t||S0.p)bpd.open=true;bpd.innerHTML='<summary>Tablet and phone tweaks</summary>';const bpb=document.createElement('div');bpb.className='setb';bpd.append(bpb);
 [['t','Tablet (641 to 1024 px)'],['p','Phone (up to 640 px)']].forEach(([bp,title])=>{const h=document.createElement('p');h.className='hint';h.textContent=title;bpb.append(h);
  [['Spacing',PB.sec.SPACING,'pad'],['Width',PB.sec.WIDTH,'width'],['Alignment',PB.sec.ALIGN,'align']].forEach(([label,opts,key])=>{const id='f'+(++fid),w=document.createElement('div');w.className='f';const l=document.createElement('label');l.htmlFor=id;l.textContent=label;const sl=document.createElement('select');sl.id=id;[['','Same as desktop'],...opts.filter(o=>o[0]!==''&&!(key==='pad'&&false))].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;sl.append(o)});sl.value=(S0[bp]||{})[key]||'';sl.onchange=()=>{blk.set=blk.set||{};const x=Object.assign({},blk.set[bp]);if(sl.value)x[key]=sl.value;else delete x[key];if(Object.keys(x).length)blk.set[bp]=x;else delete blk.set[bp];if(!Object.keys(blk.set).length)delete blk.set;commit();render()};w.append(l,sl);bpb.append(w)})});box.append(bpd);
 sel('Reveal animation',PB.sec.ANIM,'anim');
 const rs=document.createElement('button');rs.type='button';rs.className='btn small';rs.textContent='Reset settings';rs.onclick=()=>{delete blk.set;commit();outline();render()};box.append(rs);return det}

function editor(blk){if(PB.cfg&&PB.cfg.has(blk)&&PB.cfg.schema(blk))return PB.cfg.panel(blk);const d=def(blk.id),bb=document.createElement('div');bb.className='bb';bb.innerHTML=`<p class="hint">${esc(d.desc)}</p>`;bb.append(settingsUI(blk));
 fieldsOf(d).forEach(f=>{const id='f'+(++fid),wrap=document.createElement('div');wrap.className='f';const lab=document.createElement('label');lab.htmlFor=id;lab.textContent=f.label;let inp;
  if(f.type==='link'){const lp=linkPicker(val(blk,f.k),v=>{blk.vals[f.k]=v;commitSoon();render()},f.label,id);wrap.append(lab,lp);bb.append(wrap);return}
  if(f.type==='select'||f.type==='film'){inp=document.createElement('select');const opts=f.type==='film'?LIB.films.map(n=>[n,n.replace(/-/g,' ')]):(f.options?f.options(vals(blk)):[]);
   opts.forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;inp.append(o)});if(!opts.length){const o=document.createElement('option');o.textContent='Not available yet';inp.append(o);inp.disabled=true}}
  else if(f.type==='long'||f.type==='list'){inp=document.createElement('textarea');if(f.type==='list'){inp.rows=Math.min(8,Math.max(3,rows(val(blk,f.k)).length+1));inp.spellcheck=true}}
  else{inp=document.createElement('input');if(f.type==='image'){inp.setAttribute('list','pbImages')}}
  inp.id=id;inp.value=val(blk,f.k);
  const live=f.type==='select'||f.type==='film';
  inp[live?'onchange':'oninput']=()=>{blk.vals[f.k]=inp.value;if(live){commit();if(blk.id==='x-component'&&f.k==='cid'){delete blk.vals.variant}outline()}else commitSoon();render()};
  wrap.append(lab,inp);if(f.type==='list'){const h=document.createElement('p');h.className='hint';h.textContent='One per line'+(/\|/.test(f.label)?'; separate parts with |':'');wrap.append(h)}
  if(f.type==='image'){const pb=document.createElement('button');pb.type='button';pb.className='btn small';pb.textContent='Choose a photo or upload…';pb.onclick=()=>imgPop({blk},f.k);const h=document.createElement('p');h.className='hint';h.textContent='Pick a library photo, upload your own, or paste any image URL.';wrap.append(pb,h)}
  bb.append(wrap)});
 if(!fieldsOf(d).length)bb.insertAdjacentHTML('beforeend','<p class="hint">This section uses the brand name and has no other words to edit.</p>');
 const tools=document.createElement('div');tools.className='btools';
 if(!isX(blk.id)||blk.id==='x-background'||blk.id==='x-kitbg'){const ai=document.createElement('button');ai.className='btn small';ai.type='button';ai.textContent='Rewrite with AI';ai.onclick=()=>aiSection(blk,ai);tools.append(ai)}
 const rs=document.createElement('button');rs.className='btn small';rs.type='button';rs.textContent='Reset words';rs.onclick=()=>{blk.vals={...(blk.id==='x-component'?{cid:blk.vals.cid}:{}),...(['x-interaction','x-background','x-kitbg','x-kitasset','x-icons','x-effect'].includes(blk.id)?Object.fromEntries(Object.entries(blk.vals).filter(([k])=>['iid','bg','kit','asset','family','lid'].includes(k))):{})};commit();outline();render();say('Back to the default words')};tools.append(rs);
 bb.append(tools);return bb}

/* ---------- canvas controller: selection, in-place editing, floating toolbar ---------- */
let EDIT=ui.edit!==false,csel=null,addTarget=null,ZOOM=1;
const stage=document.querySelector('main.stage'),tb=$('#cvTb');
function setMode(edit){EDIT=edit;ui.edit=edit;saveUI();$$('#modeSeg button').forEach(b=>b.setAttribute('aria-pressed',(b.dataset.m==='edit')===edit));if(!edit)csel=null;hideTb();render()}
$$('#modeSeg button').forEach(b=>{b.onclick=()=>setMode(b.dataset.m==='edit');b.setAttribute('aria-pressed',(b.dataset.m==='edit')===EDIT)});
function hideTb(){tb.hidden=true;if(typeof closePop==='function')closePop()}
function toAgent(m){try{pv.contentWindow.postMessage(m,'*')}catch(e){}}
function applyText(m){const f=findBlk(m.uid);if(!f)return;const blk=f.blk;
 if(m.r!=null){const r=rows(val(blk,m.k)),ri=+m.r-1,ci=+m.c;if(!r[ri])return;while(r[ri].length<=ci)r[ri].push('');r[ri][ci]=m.v.replace(/\|/g,'/');blk.vals[m.k]=r.map(x=>x.join(' | ')).join('\n')}
 else{blk.vals[m.k]=m.v;if(m.h){blk.rich=blk.rich||{};blk.rich[m.k]=cleanInline(m.h)}else if(blk.rich){delete blk.rich[m.k];if(!Object.keys(blk.rich).length)delete blk.rich}}commitSoon();status()}
function tbBtn(label,aria,fn,dis){const b=document.createElement('button');b.type='button';b.className='tbb';b.textContent=label;b.setAttribute('aria-label',aria);b.title=aria;if(dis)b.disabled=true;b.onclick=fn;return b}
function buildTb(){const f=csel&&findBlk(csel.uid);if(!f||!EDIT){hideTb();return null}
 const d=def(f.blk.id);tb.innerHTML='';const name=document.createElement('span');name.className='tbn';name.textContent=d.name+(f.kind==='page'?'':' · shared');tb.append(name);
 const L=f.list,i=f.i;
 elGroup(f).forEach(b=>tb.append(b));
 tb.append(tbBtn('↑','Move section up',()=>move(L,i,i-1),i===0),tbBtn('↓','Move section down',()=>move(L,i,i+1),i===L.length-1),tbBtn('⧉','Duplicate section',()=>dupBlk(csel.uid)),tbBtn('✕','Delete section',()=>rmBlk(csel.uid)),tbBtn('⚙','Section settings and words',()=>{open=csel.uid;showPane('page');rtab('page');outline();const el=$(`#ol [data-uid="${csel.uid}"]`);el&&el.scrollIntoView({block:'nearest'})}),tbBtn('＋','Add a section after this one',()=>askAdd(csel.uid,'after')));
 return f}
function placeTb(m){if(!EDIT||!csel||!m){hideTb();return}const f=buildTb();if(!f)return;tb.hidden=false;
 const ir=pv.getBoundingClientRect(),sr=stage.getBoundingClientRect(),r0=m.el||m.sec;if(!r0){hideTb();return}const z=ZOOM,r={left:r0.left*z,top:r0.top*z,width:r0.width*z,height:r0.height*z};if(r.top+r.height<0||r.top>ir.height){hideTb();return}
 const h=tb.offsetHeight||40,w=tb.offsetWidth||260,top0=ir.top-sr.top;let y=ir.top-sr.top+r.top-h-8;if(y<top0+4)y=top0+Math.max(r.top,0)+8;
 let x=ir.left-sr.left+Math.max(r.left,0);x=Math.max(8,Math.min(x,sr.width-w-8));tb.style.left=x+'px';tb.style.top=Math.min(y,sr.height-h-8)+'px'}
function dupBlk(uid){const f=findBlk(uid);if(!f)return;const c={uid:uidGen(),id:f.blk.id,vals:clone(f.blk.vals)};if(f.blk.rich)c.rich=clone(f.blk.rich);if(f.blk.cfg)c.cfg=clone(f.blk.cfg);if(f.blk.set)c.set=clone(f.blk.set);if(f.blk.links)c.links=clone(f.blk.links);f.list.splice(f.i+1,0,c);csel=null;open=c.uid;commit();outline();render();say('Duplicated '+def(f.blk.id).name)}
function rmBlk(uid){const f=findBlk(uid);if(!f)return;f.list.splice(f.i,1);if(open===uid)open=null;csel=null;hideTb();commit();outline();render();say('Removed '+def(f.blk.id).name+'. Undo brings it back.')}
function askAdd(uid,where){openPicker({uid,where})}
/* element tools: links, images, menu */
const pop=document.createElement('div');pop.id='cvPop';pop.className='cvpop';pop.hidden=true;stage.append(pop);
function closePop(){pop.hidden=true;pop.innerHTML=''}
function showPop(title,el){pop.innerHTML='';const h=document.createElement('div');h.className='pph';h.innerHTML=`<b>${esc(title)}</b>`;const x=document.createElement('button');x.type='button';x.className='ib';x.textContent='✕';x.setAttribute('aria-label','Close');x.onclick=closePop;h.append(x);pop.append(h,el);pop.hidden=false;
 const sr=stage.getBoundingClientRect(),t=tb.getBoundingClientRect();pop.style.left=Math.max(8,Math.min(t.left-sr.left,sr.width-pop.offsetWidth-8))+'px';pop.style.top=Math.min(t.bottom-sr.top+6,Math.max(8,sr.height-pop.offsetHeight-8))+'px';const f=pop.querySelector('select,input,button.pk');f&&f.focus()}
function elGroup(f){const out=[];
 if(csel.kind==='image')out.push(tbBtn('Image…','Replace the image',()=>imgPop(f)));
 if(csel.a!=null&&csel.kind!=='menu')out.push(tbBtn('Link…','Change where this links',()=>linkPop(f)));
 if(csel.kind==='menu')out.push(tbBtn('Menu…','Edit the site menu',()=>{showPane('page');rtab('site')}));
 return out}
function linkPop(f){const blk=f.blk,a=csel.a;const w=document.createElement('div');w.className='ppb';const cur=blk.links&&blk.links[a]!==undefined?blk.links[a]:'';
 w.append(linkPicker(cur,v=>{blk.links=blk.links||{};blk.links[a]=v;commitSoon();render()},'Link target'));const p=document.createElement('p');p.className='hint';p.textContent='Pick a page of this site, or paste any address. Edit the button words by clicking them.';w.append(p);showPop('Link',w)}
function imgPop(f,k0){const blk=f.blk,d=def(blk.id),key=k0||csel.k;const w=document.createElement('div');w.className='ppb';let altInput=null;
 const afterImg=()=>{if(altInput&&!altInput.value.trim()){altInput.focus();say('Describe the image for people who cannot see it')}else closePop()};
 const up=document.createElement('button');up.type='button';up.className='btn small pk';up.textContent='Upload from your device';const fi=document.createElement('input');fi.type='file';fi.accept='image/*';fi.hidden=true;fi.setAttribute('aria-label','Choose an image file');
 up.onclick=()=>fi.click();fi.onchange=async()=>{const file=fi.files[0];if(!file)return;if(!/^image\//.test(file.type))return say('That file is not an image. Try a JPG, PNG or WebP.');if(file.size>25e6)return say('Choose an image under 25 MB');try{const id=await PB.images.add(file);blk.vals[key]='user:'+id;commit();render();say('Image replaced. It is saved in this browser.');afterImg()}catch(e){say(e&&e.name==='QuotaExceededError'?'This browser has no room left to keep that image. Try a smaller one.':'Could not read that image. Try a JPG, PNG or WebP.')}};
 const q=document.createElement('input');q.type='search';q.placeholder='Search photos and atlas art';q.setAttribute('aria-label','Search photos and atlas art');
 const g=document.createElement('div');g.className='pgrid';let src=ui.imgsrc==='art'?'art':'photos',pcat='all';
 const seg=document.createElement('div');seg.className='seg';seg.setAttribute('role','group');seg.setAttribute('aria-label','Image source');const catSel=document.createElement('select');catSel.setAttribute('aria-label','Photo category');
 const catOpts=()=>{catSel.innerHTML='<option value="all">All photo categories</option>'+(PB.photos?PB.photos.cats.map(c=>`<option value="${esc(c)}">${esc(PB.photos.catName(c))}</option>`).join(''):'');catSel.value=pcat;catSel.hidden=src!=='photos'};
 [['photos','Photos'],['art','Atlas art']].forEach(([k,l])=>{const b=document.createElement('button');b.type='button';b.textContent=l;b.setAttribute('aria-pressed',k===src);b.onclick=()=>{src=k;ui.imgsrc=k;saveUI();[...seg.children].forEach(x=>x.setAttribute('aria-pressed',x===b));catOpts();draw()};seg.append(b)});
 const setAlt=t=>{if(altInput&&t&&!altInput.value.trim()){altInput.value=t;blk.vals.alt=t}};
 const draw=()=>{const t=q.value.trim().toLowerCase();g.innerHTML='';
  if(src==='photos'&&PB.photos){const L=PB.photos.match(t,pcat).slice(0,90);if(!L.length)g.innerHTML='<p class="hint">'+(PB.photos.list.length?'No photo matches.':'Loading photos…')+'</p>';
   L.forEach(p=>{const b=document.createElement('button');b.type='button';b.className='pimg';b.title=p.title;b.setAttribute('aria-label','Use the photo '+p.title);b.innerHTML=`<img src="${esc(PB.photos.thumb(p))}" alt="" loading="lazy">`;b.onclick=()=>{blk.vals[key]=PB.photos.path(p);setAlt(p.alt||p.title);if(!blk.vals.alt&&fieldsOf(d).some(x=>x.k==='alt'))blk.vals.alt=p.alt||p.title;delete blk.vals[key+'_fp'];commit();render();afterImg()};g.append(b)});return}
  LIB.images.filter(i=>!t||i.toLowerCase().includes(t)).slice(0,90).forEach(i=>{const b=document.createElement('button');b.type='button';b.className='pimg';b.title=i;b.setAttribute('aria-label','Use '+i);b.innerHTML=`<img src="assets/${esc(i)}" alt="" loading="lazy">`;b.onclick=()=>{blk.vals[key]=i;commit();render();afterImg()};g.append(b)})};
 q.oninput=draw;catSel.onchange=()=>{pcat=catSel.value;draw()};catOpts();draw();if(PB.photos)PB.photos.onload.push(()=>{catOpts();draw()});w.append(up,fi,seg,q,catSel,g);
 const altF=fieldsOf(d).find(x=>x.k==='alt');if(altF){const l=document.createElement('label');l.className='f';l.textContent='Describe the image (alt text)';const ai=document.createElement('input');ai.value=val(blk,'alt');ai.oninput=()=>{blk.vals.alt=ai.value;commitSoon();render()};altInput=ai;l.append(ai);w.append(l)}
 if(blk.vals[key]){const fw=document.createElement('div');fw.className='fpw';const cur=blk.vals[key],id0=/^user:/.test(cur)?cur.slice(5):'',url=id0?PB.images.url(id0):'assets/'+cur;
  fw.innerHTML='<p class="hint">Focus point: click the part of the picture that must stay in view when it is cropped.</p><div class="fpbox"><img alt="" src="'+esc(url)+'"><i></i></div><button type="button" class="btn small">Centre it</button>';
  const box=fw.querySelector('.fpbox'),dot=box.querySelector('i'),place=()=>{const m=/^(\d+)% (\d+)%$/.exec(blk.vals[key+'_fp']||'');dot.style.left=(m?m[1]:50)+'%';dot.style.top=(m?m[2]:50)+'%'};place();
  box.onclick=e=>{const r=box.getBoundingClientRect();blk.vals[key+'_fp']=Math.round((e.clientX-r.left)/r.width*100)+'% '+Math.round((e.clientY-r.top)/r.height*100)+'%';place();commitSoon();render()};
  fw.querySelector('button').onclick=()=>{delete blk.vals[key+'_fp'];place();commit();render()};w.append(fw)}
 showPop('Image',w)}
let lastRects=null;
addEventListener('message',e=>{if(e.source!==pv.contentWindow||!e.data)return;const m=e.data;
 switch(m.pb){
  case 'ready':if(csel&&EDIT)toAgent({pb:'reselect',...csel});break;
  case 'page':{const p=site.pages.find(x=>x.id===m.id);if(p)goPage(p.id);break}
  case 'sel':{if(!csel||csel.uid!==m.uid||csel.kind!==m.kind)closePop();csel={uid:m.uid,kind:m.kind,k:m.k,r:m.r,c:m.c,a:m.a};if(open!==m.uid){open=m.uid;outline();const el=$(`#ol [data-uid="${m.uid}"]`);el&&el.scrollIntoView({block:'nearest'})}break}
  case 'rects':lastRects=m;placeTb(m);break;
  case 'text':applyText(m);break;
  case 'focus':editingText=true;break;
  case 'blur':editingText=false;if(rendPending){rendPending=false;render()}if(open)outline();break;
  case 'add':askAdd(m.uid,m.where);break;
  case 'unhide':{const f=findBlk(m.uid);if(f){setS(f.blk,'hide',null,true);say('Section is visible again')}break}
  case 'move':{const f=findBlk(m.uid);if(!f)break;let t=m.before?f.list.findIndex(b=>b.uid===m.before):f.list.length;if(t<0)break;move(f.list,f.i,t>f.i?t-1:t);break}
  case 'key':{if(!csel)break;const f=findBlk(csel.uid);
   if(m.key==='Escape'){csel=null;hideTb();toAgent({pb:'clear'})}
   else if(!f)break;else if(m.key==='Delete'||m.key==='Backspace')rmBlk(csel.uid);
   else if(m.alt&&m.key==='ArrowUp')move(f.list,f.i,f.i-1);else if(m.alt&&m.key==='ArrowDown')move(f.list,f.i,f.i+1);
   else if(m.mod&&/^d$/i.test(m.key))dupBlk(csel.uid);else if(m.mod&&/^k$/i.test(m.key))askAdd(csel.uid,'after');
   else if(m.mod&&/^z$/i.test(m.key)&&!m.shift)undo();else if(m.mod&&(/^y$/i.test(m.key)||(m.shift&&/^z$/i.test(m.key))))redo();break}}});
let chkT=0;pv.addEventListener('load',()=>{clearTimeout(chkT);chkT=setTimeout(()=>toAgent({pb:'check'}),1400);lastRects=null;editingText=false;if(!csel||!findBlk(csel.uid)){csel=null;hideTb()}});
addEventListener('resize',()=>placeTb(lastRects));

/* ---------- section thumbnails and the section picker ---------- */
const thumbCache=new Map();
const thumbW=id=>{const d=def(id);return d&&(S.isTop(d)||d.id==='announce')?600:1200};
const PH='<div aria-hidden="true" style="padding:36px 6%;display:grid;gap:14px;color:var(--ink,#888)"><i style="display:block;height:10px;width:20%;background:var(--accent,currentColor);opacity:.55;border-radius:4px"></i><i style="display:block;height:30px;width:70%;background:currentColor;opacity:.16;border-radius:6px"></i><i style="display:block;height:30px;width:52%;background:currentColor;opacity:.16;border-radius:6px"></i><i style="display:block;height:12px;width:80%;background:currentColor;opacity:.1;border-radius:4px"></i><i style="display:block;height:12px;width:64%;background:currentColor;opacity:.1;border-radius:4px"></i><i style="display:block;height:34px;width:22%;background:var(--accent,currentColor);opacity:.35;border-radius:8px"></i></div>';
function thumbHTML(id){const key=page.style+'|'+page.pair+'|'+JSON.stringify(site.tokens||{})+'|'+id;if(thumbCache.has(key))return thumbCache.get(key);
 let h='';try{const P=compose('preview',{id:'__t',name:'t',blocks:[{uid:'tb'+id.replace(/\W/g,''),id,vals:{}}]},undefined,{solo:true});h=swapA(assemble(P,{noagent:true,clSrc:ABS+'component-lab.js'}),ABS+'assets/').replace(/\sautoplay\b/g,'').replace(/<video /g,'<video preload="none" ');if(thumbW(id)<1200)h=h.replace('</body>',PH+'</body>');if(id==='spacer'||/b-spacer/.test(h)&&h.length<9000){const bar='<div aria-hidden="true" style="padding:22px 6%;display:grid;gap:10px;color:var(--ink,#888)"><i style="display:block;height:26px;width:60%;background:currentColor;opacity:.16;border-radius:6px"></i><i style="display:block;height:10px;width:80%;background:currentColor;opacity:.1;border-radius:4px"></i></div>';h=h.replace('</head>','<style>.b-spacer{outline:1px dashed var(--accent,#888);outline-offset:-1px;background:repeating-linear-gradient(135deg,transparent 0 9px,rgba(128,128,128,.16) 9px 10px)}</style></head>').replace(/(<body[^>]*>)/,'$1'+bar).replace('</body>',bar+'</body>')}}catch(e){h=''}
 thumbCache.set(key,h);if(thumbCache.size>160)thumbCache.delete(thumbCache.keys().next().value);return h}
let thIO=null;
function mountThumbs(root,scroller){if(!('IntersectionObserver' in window))return;if(thIO)thIO.disconnect();
 thIO=new IntersectionObserver(es=>es.forEach(e=>{const box=e.target;if(!e.isIntersecting||box.firstChild)return;const f=document.createElement('iframe');f.tabIndex=-1;f.setAttribute('aria-hidden','true');f.setAttribute('inert','');f.title='';const W=+box.dataset.sw||1200;f.style.width=W+'px';f.style.height=(W*5/8)+'px';f.style.transform='scale('+(box.clientWidth/W)+')';f.srcdoc=thumbHTML(box.dataset.sth);box.append(f);thIO.unobserve(box)}),{root:scroller,rootMargin:'160px'});
 root.querySelectorAll('[data-sth]').forEach(b=>thIO.observe(b))}
const pk=$('#picker');let pkGroup='All',pkTarget=null;
function openPicker(target){pkTarget=target;$('#pickQ').value='';pkGroup='All';pickDraw();pk.showModal();$('#pickQ').focus()}
function pickDraw(){const all=[...LIB.blocks,PB.extraById['x-posts'],PB.extraById['x-type']],gs=['All',...GROUPS.filter(g=>all.some(b=>b.group===g))],t=($('#pickQ').value||'').trim().toLowerCase();
 $('#pickChips').innerHTML=gs.map(g=>`<button type="button" class="chip" aria-pressed="${g===pkGroup}" data-g="${esc(g)}">${esc(g)}</button>`).join('');
 $$('#pickChips .chip').forEach(b=>b.onclick=()=>{pkGroup=b.dataset.g;pickDraw();$(`#pickChips [data-g="${CSS.escape(pkGroup)}"]`).focus()});
 const items=all.filter(b=>(pkGroup==='All'||b.group===pkGroup)&&(!t||(b.name+' '+b.group+' '+b.desc).toLowerCase().includes(t)));
 $('#pickCount').textContent=items.length+' sections';
 $('#pickGrid').innerHTML=items.map(b=>`<li><button type="button" class="pkcard" data-id="${esc(b.id)}"><span class="pkth" data-sth="${esc(b.id)}" data-sw="${thumbW(b.id)}"></span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></button></li>`).join('')||'<li class="hint">No section matches.</li>';
 $$('#pickGrid .pkcard').forEach(b=>b.onclick=()=>{addTarget=pkTarget;const id=b.dataset.id;pk.close();addBlock(id,{},null)});
 mountThumbs($('#pickGrid'),$('#pickScroll'))}
$('#pickQ').oninput=()=>{clearTimeout(pickDraw.t);pickDraw.t=setTimeout(pickDraw,120)};
$('#pickClose').onclick=()=>pk.close();
$('#addSecBtn').onclick=()=>openPicker(csel&&findBlk(csel.uid)?{uid:csel.uid,where:'after'}:null);
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
 if(dragUid){const f=findBlk(dragUid);if(!f)return;const t=dropAt(i,f.list);if(t<0)return say('A section can only move within its own area');move(f.list,f.i,t>f.i?t-1:t);return}
 try{const x=JSON.parse(e.dataTransfer.getData('application/x-pb')||'null');if(x&&x.id)addBlock(x.id,x.vals,i,x)}catch(err){}});
const frameWrap=$('#wrap');
frameWrap.addEventListener('dragover',e=>{if(dragUid)return;e.preventDefault();frameWrap.classList.add('drop')});
frameWrap.addEventListener('dragleave',()=>frameWrap.classList.remove('drop'));
frameWrap.addEventListener('drop',e=>{frameWrap.classList.remove('drop');if(dragUid)return;e.preventDefault();try{const x=JSON.parse(e.dataTransfer.getData('application/x-pb')||'null');if(x&&x.id)addBlock(x.id,x.vals,null,x)}catch(err){}});

/* ---------- library ---------- */
const LTABS=[['sections','Sections'],['components','Components'],['interactions','Interactions'],['photos','Photos'],['uploads','My images'],['media','Media & backgrounds'],['icons','Icons'],['kit','Kit assets'],['mine','My blocks']];
let ltab=LTABS.some(t=>t[0]===ui.ltab)?ui.ltab:'sections',lgroup='All';
function libTabs(){const tl=$('#ltabs');tl.innerHTML=LTABS.map(([k,l])=>`<button role="tab" type="button" id="lt-${k}" aria-controls="libList" aria-selected="${k===ltab}" tabindex="${k===ltab?0:-1}">${l}</button>`).join('');
 tl.querySelectorAll('[role=tab]').forEach((b,i,all)=>{b.onclick=()=>{ltab=b.id.slice(3);ui.ltab=ltab;saveUI();lgroup='All';libTabs();library()};
  b.onkeydown=e=>{const n=all.length;let j=null;if(e.key==='ArrowRight')j=(i+1)%n;if(e.key==='ArrowLeft')j=(i-1+n)%n;if(e.key==='Home')j=0;if(e.key==='End')j=n-1;if(j!=null){e.preventDefault();all[j].click();$('#lt-'+LTABS[j][0]).focus()}}});
 $('#libList').setAttribute('aria-labelledby','lt-'+ltab)}
const q=()=>($('#libSearch').value||'').trim().toLowerCase();
const match=(...s)=>{const t=q();return !t||s.join(' ').toLowerCase().includes(t)};
/* favourites and recently used, for components and interactions */
const LSK={fav:'atlas-pb-fav',rec:'atlas-pb-recent'};
const lsGet=k=>{try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:[]}catch(e){return[]}};const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const itemKey=(id,v)=>id==='x-component'?'c:'+v.cid:id==='x-interaction'?'i:'+v.iid:'';
const isFav=k=>lsGet(LSK.fav).includes(k);
function toggleFav(k){const a=lsGet(LSK.fav),i=a.indexOf(k);if(i<0)a.push(k);else a.splice(i,1);lsSet(LSK.fav,a);return i<0}
function pushRecent(k){if(!k)return;const a=lsGet(LSK.rec).filter(x=>x!==k);a.unshift(k);lsSet(LSK.rec,a.slice(0,12))}
const COMPCAT=[['Buttons and menus','C01 C02 C41 C42 C43'],['Form fields','C03 C04 C05 C06 C07 C08 C09 C10 C11 C13 C14 C44 C45 C46 C47 C48 C49 C50 C52'],['Navigation','C16 C17 C18 C19 C20 C32 C34 C63'],['Overlays and messages','C21 C22 C23 C24 C26 C27 C57 C64 C66'],['Content and data','C12 C25 C28 C29 C30 C31 C33 C35 C36 C37 C38 C56 C58 C59 C61 C62 C65 C67 C68 C69'],['Tools and layout','C15 C39 C40 C51 C53 C54 C55 C60 C70']];
const compCat=id=>(COMPCAT.find(([,l])=>l.split(' ').includes(id))||['Other'])[0];
const shelfGroups=(base,key)=>{const f=lsGet(LSK.fav).filter(x=>x.startsWith(key)).length,r=lsGet(LSK.rec).filter(x=>x.startsWith(key)).length;return ['All','★ Favourites'+(f?' ('+f+')':''),'Recent'+(r?' ('+r+')':''),...base]};
const inShelf=(g,key)=>g==='All'||(/^★/.test(g)?isFav(key):/^Recent/.test(g)?lsGet(LSK.rec).includes(key):null);
function card({id,vals:v,title,meta,desc,thumb,cls,extra}){const fk=itemKey(id,v||{});return `<li class="lc ${cls||''}" draggable="true" data-add='${esc(JSON.stringify({id,vals:v||{},...(extra||{})}))}'><div class="lth" aria-hidden="true">${thumb||''}</div>${fk?`<button type="button" class="fav" data-fav="${esc(fk)}" aria-pressed="${isFav(fk)}" aria-label="Favourite: ${esc(title)}" title="Keep in Favourites">${isFav(fk)?'★':'☆'}</button>`:''}<div class="lb"><b>${esc(title)}</b>${meta?`<small>${esc(meta)}</small>`:''}${desc?`<p>${esc(desc)}</p>`:''}</div><button type="button" class="btn small add" aria-label="Add ${esc(title)} to the page">Add</button></li>`}
function chips(groups){return `<div class="gchips" role="group" aria-label="Filter">${groups.map(g=>`<button type="button" class="chip" aria-pressed="${g.replace(/ \(\d+\)$/,'')===lgroup}" data-g="${esc(g)}">${esc(g)}</button>`).join('')}</div>`}
const SEC_ICON={Navigation:'M3 6h18M3 6v4h18V6',Heroes:'M3 4h18v12H3zM6 19h12',Features:'M3 4h8v7H3zM13 4h8v7h-8zM3 13h8v7H3zM13 13h8v7h-8z',Proof:'M5 7h6v6H5zM13 7h6v6h-6zM5 16h14',Sell:'M4 5h5v14H4zM10 3h5v18h-5zM16 5h5v14h-5z',Story:'M4 6h16M4 10h16M4 14h12M4 18h8',Content:'M4 4h16v10H4zM4 17h16M4 20h10',Endings:'M3 14h18v6H3zM6 17h4M14 17h4',Fonts:'M5 19 10 5h2l5 14M7 14h8',Components:'M4 6h7v5H4zM13 6h7v5h-7zM4 14h16v4H4z'};
const secThumb=g=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="${SEC_ICON[g]||SEC_ICON.Content}"/></svg>`;
let ixIO=null,bgThumbs={};
function library(){const L=$('#libList');let h='';if(ixIO){ixIO.disconnect();ixIO=null}
 if(ltab==='sections'){const all=[...LIB.blocks,PB.extraById['x-posts'],PB.extraById['x-type']];const gs=['All',...GROUPS.filter(g=>all.some(b=>b.group===g))];h+=chips(gs);
  const items=all.filter(b=>(lgroup==='All'||b.group===lgroup)&&match(b.name,b.group,b.desc));
  h+=`<p class="lcount">${items.length} sections · previews use your style</p><ul class="lgrid tiles">`+items.map(b=>card({id:b.id,title:b.name,meta:b.group,thumb:`<div class="sth" data-sth="${esc(b.id)}" data-sw="${thumbW(b.id)}"></div>`,cls:'sec'})).join('')+'</ul>'+(items.length?'':'<p class="hint">No section matches “'+esc($('#libSearch').value)+'”. Try a shorter word such as “price”, “team” or “form”, or clear the search.</p>')}
 else if(ltab==='components'){const L2=PB.src.CL();if(!L2)h+='<p class="hint">The UI component lab has not loaded, so components are unavailable right now.</p>';else{
  const cg=shelfGroups(COMPCAT.map(x=>x[0]),'c:');if(!cg.some(g=>g.replace(/ \(\d+\)$/,'')===lgroup))lgroup='All';h+=chips(cg.map(g=>g));
  const items=L2.components.filter(c=>{const k='c:'+c.id,sh=inShelf(lgroup,k);return (sh===null?compCat(c.id)===lgroup:sh)&&match(c.id,c.name)});
  if(/^★/.test(lgroup)&&!items.length)h+='<p class="hint">Nothing starred yet. Press the star on a component to keep it here.</p>';if(/^Recent/.test(lgroup)&&!items.length)h+='<p class="hint">Components you add to a page show up here, newest first.</p>';
  if(/^Recent/.test(lgroup))items.sort((a,b)=>lsGet(LSK.rec).indexOf('c:'+a.id)-lsGet(LSK.rec).indexOf('c:'+b.id));
  h+=`<p class="lcount">${items.length} of ${L2.components.length} components · each one is themed by your page style</p><ul class="lgrid comp">`+items.map(c=>card({id:'x-component',vals:{cid:c.id,layout:'plain'},title:c.name,meta:c.id+(c.live?' · interactive':''),thumb:`<div class="cthumb pb-cl"><div class="cl-root" inert>${PB.componentHTML(c,c.thumb||c.v[0][0],'t'+c.id)}</div></div>`,cls:'comp'})).join('')+'</ul>'}}
 else if(ltab==='interactions'){const X=(window.INTERACTIONS||[]).filter(x=>!/^sec-/.test(x.id));if(!X.length)h+='<p class="hint">The interactions shelf has not loaded.</p>';else{
  const cats=shelfGroups([...new Set(X.map(x=>x.cat))],'i:');if(!cats.some(g=>g.replace(/ \(\d+\)$/,'')===lgroup))lgroup='All';h+=chips(cats);const items=X.filter(x=>{const sh=inShelf(lgroup,'i:'+x.id);return (sh===null?x.cat===lgroup:sh)&&match(x.t,x.cat,x.d,x.use)});
  if(/^★/.test(lgroup)&&!items.length)h+='<p class="hint">Nothing starred yet. Press the star on an interaction to keep it here.</p>';if(/^Recent/.test(lgroup)&&!items.length)h+='<p class="hint">Interactions you add to a page show up here, newest first.</p>';
  if(/^Recent/.test(lgroup))items.sort((a,b)=>lsGet(LSK.rec).indexOf('i:'+a.id)-lsGet(LSK.rec).indexOf('i:'+b.id));
  h+=`<p class="lcount">${items.length} interactions · embedded as frames, inlined in the export</p><ul class="lgrid ix">`+items.map(x=>card({id:'x-interaction',vals:{iid:x.id,height:/^story-/.test(x.id)?'800':'640'},extra:/^(sec|story)-/.test(x.id)?{}:{cfg:{tr:1}},title:x.t,meta:x.cat,desc:x.d,thumb:`<div class="ixthumb ${x.tone==='light'?'light':''}" data-ix="${esc(x.id)}"><span>${esc(x.cat)}</span></div>`,cls:'ixc'})).join('')+'</ul>'}}
 else if(ltab==='photos'){const P=PB.photos;if(!P||!P.list.length)h+='<p class="hint">'+(P&&P.ready?'The photo library could not be loaded.':'Loading photos…')+'</p>';else{const items=P.match(q(),lgroup==='All'?'all':lgroup);
  h+=`<div class="gchips" role="group" aria-label="Photo category">${['All',...P.cats].map(c=>`<button type="button" class="chip" aria-pressed="${c===lgroup}" data-g="${esc(c)}">${esc(c==='All'?'All':P.catName(c))}</button>`).join('')}</div><p class="lcount">${items.length} of ${P.list.length} photos · public domain or CC0, credited for you in exports</p><ul class="lgrid tiles">`+items.map(p=>card({id:'image-full',vals:{img:P.path(p),alt:p.alt||p.title,caption:''},title:p.title,meta:P.catName(p.cat)+' · photo',thumb:`<img src="${esc(P.thumb(p))}" alt="" loading="lazy">`,cls:'tile'})).join('')+'</ul>'+(items.length?'':'<p class="hint">No photo matches “'+esc(q())+'”. Try “coffee”, “house” or “flowers”.</p>')}}
 else if(ltab==='media'){const BG=PB.src.BGA();const gs=['All','Backgrounds','Films','Landing effects','Images'];h+=chips(gs);
  if(lgroup==='All'||lgroup==='Backgrounds'){if(!BG)h+='<p class="hint">The backgrounds library has not loaded.</p>';else{const items=BG.ALL.filter(p=>match(p.name,BG.FAMILIES[p.mode],p.collection,'background'));
   h+=`<h3 class="lh">Generated backgrounds <small>${items.length}</small></h3><ul class="lgrid tiles">`+items.map(p=>card({id:'x-background',vals:{bg:p.key},title:p.name,meta:BG.FAMILIES[p.mode]+' · live shader',thumb:`<div class="bgthumb" data-bg="${esc(p.key)}" style="${esc(bgThumbs[p.key]?`background-image:url(${bgThumbs[p.key]});background-size:cover`:PB.bgFallback(p))}"></div>`,cls:'tile'})).join('')+'</ul>'}}
  if(lgroup==='All'||lgroup==='Films'){const items=LIB.films.filter(f=>match(f,'film video'));h+=`<h3 class="lh">Atlas films <small>${items.length}</small></h3><ul class="lgrid tiles">`+items.map(f=>card({id:'x-film',vals:{film:f,caption:''},title:f.replace(/-/g,' '),meta:'Atlas film · looping band',thumb:`<img src="assets/films/${esc(f)}.jpg" alt="" loading="lazy">`,cls:'tile'})).join('')+'</ul>'}
  if(lgroup==='All'||lgroup==='Landing effects'){const items=(PB.effects||[]).filter(e=>match(e.id,e.title,e.desc,'effect'));h+=`<h3 class="lh">Landing effects <small>${items.length}</small></h3>`+(PB.effects?'':'<p class="hint">Loading…</p>')+`<ul class="lgrid tiles">`+items.map(e=>card({id:'x-effect',vals:{lid:e.id},title:e.title,meta:e.id+' · clip',thumb:`<img src="${esc(e.film.poster||e.image&&e.image.url||'')}" alt="" loading="lazy">`,cls:'tile'})).join('')+'</ul>'}
  if(lgroup==='All'||lgroup==='Images'){const items=LIB.images.filter(i=>match(i,'image photo'));h+=`<h3 class="lh">Images <small>${items.length}</small></h3><p class="hint">Adds a full-width image; you can also pick these in any image field.</p><ul class="lgrid tiles">`+items.map(i=>card({id:'image-full',vals:{img:i,alt:'',caption:''},title:i.split('/')[1].replace(/\.\w+$/,'').replace(/-/g,' '),meta:'Atlas art · full-width image',thumb:`<img src="assets/${esc(i)}" alt="" loading="lazy">`,cls:'tile'})).join('')+'</ul>'}}
 else if(ltab==='icons'){const fams=[['glyphs','Builder glyphs',Object.keys(LIB.glyphs)],...Object.entries(LIB.iconFiles).map(([f,list])=>[f,f.replace(/-/g,' '),list.map(x=>x.replace(/\.\w+$/,''))]),...(PB.src.TK()?PB.src.TK().list.map(k=>['kit:'+k.id,k.name+' kit',Object.keys(PB.src.TK().ICONS||{})]):[])];
  const items=fams.filter(([f,n,names])=>match(f,n,names.join(' '),'icon'));
  h+=`<p class="lcount">${items.length} icon families · adds an icon feature row you can edit</p><ul class="lgrid icons">`+items.map(([f,n,names])=>card({id:'x-icons',vals:{family:f,items:iconItems(f)},title:n,meta:names.length+' icons',thumb:`<div class="icstrip" data-fam="${esc(f)}">${names.slice(0,8).map(x=>`<span>${PB.iconSVG(f,x,{site:ABS})}</span>`).join('')}</div>`,cls:'icf'})).join('')+'</ul>'}
 else if(ltab==='mine'){h+=PB.ux&&PB.ux.mineHTML?PB.ux.mineHTML(card):''}
 else if(ltab==='uploads'){h+=PB.ux&&PB.ux.uploadsHTML?PB.ux.uploadsHTML():''}
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
 L.querySelectorAll('.gchips .chip').forEach(b=>b.onclick=()=>{const full=b.dataset.g;lgroup=full.replace(/ \(\d+\)$/,'');library();const n=$$('#libList .chip').find(c=>c.dataset.g.replace(/ \(\d+\)$/,'')===lgroup);n&&n.focus()});
 L.querySelectorAll('.fav').forEach(b=>b.onclick=e=>{e.stopPropagation();const on=toggleFav(b.dataset.fav);b.setAttribute('aria-pressed',on);b.textContent=on?'★':'☆';say(on?'Added to Favourites':'Removed from Favourites');if(/^★/.test(lgroup)||true){const g=$(`#libList .chip[data-g^="★"]`);if(g)g.textContent='★ Favourites'+(lsGet(LSK.fav).filter(x=>x.startsWith(b.dataset.fav.slice(0,2))).length?' ('+lsGet(LSK.fav).filter(x=>x.startsWith(b.dataset.fav.slice(0,2))).length+')':'');if(g)g.dataset.g=g.textContent}});
 L.querySelectorAll('.lc').forEach(li=>{const x=JSON.parse(li.dataset.add);li.querySelector('.add').onclick=()=>addBlock(x.id,clone(x.vals),null,x);
  li.addEventListener('dragstart',e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/x-pb',li.dataset.add);e.dataTransfer.setData('text/plain',x.id)})});
 const ks=$('#kitSel');if(ks){ks.onchange=()=>{ui.kit=ks.value;saveUI();library();$('#kitSel').focus()};
  $('#kitStyle').onclick=()=>{setStyle('kit:'+ks.value)};const z=$('#kitZip');z.onclick=async()=>{const TK=PB.src.TK(),k=TK.list.find(x=>x.id===ks.value);z.disabled=true;say('Building the kit ZIP…');try{dl(await TK.zipKit(k),k.id+'-theme-kit.zip')}catch(e){say('Could not build the kit ZIP')}z.disabled=false}}
 if(ltab==='mine'&&PB.ux&&PB.ux.mineAfter)PB.ux.mineAfter(L);
 if(ltab==='uploads'&&PB.ux&&PB.ux.uploadsAfter)PB.ux.uploadsAfter(L);
 if(ltab==='sections')mountThumbs($('#libList'),$('#libScroll'));
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

/* ---------- accessibility checks ---------- */
let checkTimer=0,lastIssues=null;
function runCheck(){$('#chkList').innerHTML='<li class="hint">Checking this page…</li>';toAgent({pb:'check'})}
function chkDraw(issues){lastIssues=issues;const L=$('#chkList'),groups={contrast:'Colour contrast',heading:'Headings',alt:'Image descriptions',link:'Links and buttons',form:'Form fields'};
 $('#chkSum').textContent=issues.length?issues.length+' thing'+(issues.length>1?'s':'')+' to fix on “'+curPage().name+'”':'No problems found on “'+curPage().name+'”. Run it again on every page.';
 L.innerHTML='';Object.keys(groups).forEach(t=>{const items=issues.filter(i=>i.type===t);if(!items.length)return;const h=document.createElement('li');h.className='grp';h.innerHTML=`<b>${groups[t]}</b><small>${items.length}</small>`;L.append(h);
  items.forEach(it=>{const li=document.createElement('li');li.className='chk';const m=document.createElement('p');m.textContent=it.msg+(it.name?' ('+it.name+')':'');li.append(m);const act=document.createElement('div');act.className='btools';
   if(it.uid){const b=document.createElement('button');b.type='button';b.className='btn small';b.textContent='Show';b.onclick=()=>{open=it.uid;csel={uid:it.uid,kind:'section'};showPane('preview');toAgent({pb:'scrollTo',uid:it.uid,smooth:true});toAgent({pb:'reselect',uid:it.uid,kind:'section'});outline()};act.append(b)}
   if(it.type==='contrast'){const b=document.createElement('button');b.type='button';b.className='btn small primary';b.textContent='Fix site colours';b.onclick=fixContrast;act.append(b)}
   if(it.type==='alt'){const f=findBlk(it.uid),d=f&&def(f.blk.id),has=d&&fieldsOf(d).some(x=>x.k==='alt');if(has){const i=document.createElement('input');i.placeholder='Describe the image';i.setAttribute('aria-label','Alt text');const b=document.createElement('button');b.type='button';b.className='btn small primary';b.textContent='Save';b.onclick=()=>{if(!i.value.trim())return i.focus();f.blk.vals.alt=i.value.trim();commit();render();say('Alt text saved');setTimeout(runCheck,900)};act.append(i,b)}}
   li.append(act);L.append(li)})})}
function fixContrast(){const cur=PB.styles.get(page.style),sw=cur.sw||[],tk=Object.assign({},site.tokens),C=PB.color;const bg=tk.bg||sw[0],surf=tk.surface||sw[1]||bg,ink=tk.ink||sw[2],acc=tk.accent||sw[3];
 tk.ink=C.ensure(ink,[bg,surf],7);tk.accent=acc;site.tokens=tk;commit();render();tokensUI();say('Text colours adjusted to meet AA');setTimeout(runCheck,900)}
addEventListener('message',e=>{if(e.source===pv.contentWindow&&e.data&&e.data.pb==='checked'){const n=(e.data.issues||[]).length;badge(n);if(rtabCur==='check')chkDraw(e.data.issues||[]);else lastIssues=e.data.issues||[]}});
function badge(n){const b=$('#chkBadge');if(!b)return;b.textContent=n;b.dataset.n=n?'bad':'ok';$('#chkBtn').setAttribute('aria-label',n?n+' things to check on this page':'No problems found on this page')}
$('#chkBtn').onclick=()=>{showPane('page');rtab('check')};
$('#chkRun').onclick=runCheck;
/* ---------- site tokens ---------- */
function mineOpts(){const M=MF();if(!M)return '';const L=M.list();return `<optgroup label="My fonts" data-myfonts>${L.map(f=>`<option value="${esc(f.family)}">${esc(f.display)} (mine)</option>`).join('')}<option value="__upload_fonts">+ Upload fonts…</option></optgroup>`}
function mineSelect(sel,get,set){sel.onchange=e=>{if(e.target.value==='__upload_fonts'){e.target.value=get()||'';MF().openDialog();return}set(e.target.value)}}
function tokensUI(){const box=$('#tkBox');if(!box)return;const cur=PB.styles.get(page.style),sw=cur.sw||[],tk=site.tokens||{};
 const eff={bg:tk.bg||sw[0],surface:tk.surface||sw[1],ink:tk.ink||sw[2],accent:tk.accent||sw[3]};const C=PB.color;
 const cr=(a,b)=>{try{return C.ratio(a,b)}catch(e){return 0}};
 const fonts=[...new Set([cur.head,cur.body,...LIB.pairs.flatMap(p=>[p[1],p[2]])].filter(Boolean))];
 const row=(k,l)=>`<label class="tkc"><span>${l}</span><input type="color" data-k="${k}" value="${(/^#[0-9a-f]{6}$/i.test(eff[k]||'')?eff[k]:'#888888').toLowerCase()}"${tk[k]?' data-set="1"':''}></label>`;
 box.innerHTML=`<details${Object.keys(tk).length?' open':''}><summary>Customise this style${Object.keys(tk).length?' · changed':''}</summary><div class="tkb"><p class="hint">Colours, corners and fonts here apply to every section on every page.</p><div class="tkg">${row('bg','Background')}${row('surface','Panels')}${row('ink','Text')}${row('accent','Accent')}</div>
 <p class="hint" id="tkCr">Text on background ${cr(eff.ink,eff.bg).toFixed(1)}:1 ${cr(eff.ink,eff.bg)>=4.5?'(passes AA)':'(too low: needs 4.5)'} · button text ${cr(C.best(eff.accent||'#000'),eff.accent||'#000').toFixed(1)}:1</p>
 <div class="f"><label for="tkRad">Corner radius: <output>${tk.radius!=null?tk.radius:'style default'}</output></label><input id="tkRad" type="range" min="0" max="32" step="2" value="${tk.radius!=null?tk.radius:12}"></div>
 <div class="f"><label for="tkBtn">Buttons</label><select id="tkBtn"><option value="">As the style</option><option value="sharp">Square</option><option value="pill">Pill</option></select></div>
 <div class="f"><label for="tkFh">Heading font</label><select id="tkFh"><option value="">Style’s font</option>${fonts.map(f=>`<option>${esc(f)}</option>`).join('')}${mineOpts()}</select></div>
 <div class="f"><label for="tkFb">Body font</label><select id="tkFb"><option value="">Style’s font</option>${fonts.map(f=>`<option>${esc(f)}</option>`).join('')}${mineOpts()}</select></div>
 <button type="button" class="btn small" id="tkReset">Reset to the style</button></div></details>`;
 $('#tkBtn').value=tk.btn||'';$('#tkFh').value=tk.fontHead||'';$('#tkFb').value=tk.fontBody||'';
 const set=(k,v)=>{site.tokens=site.tokens||{};if(v===''||v==null)delete site.tokens[k];else site.tokens[k]=v;if(!Object.keys(site.tokens).length)delete site.tokens};
 box.querySelectorAll('input[type=color]').forEach(i=>{i.oninput=()=>{set(i.dataset.k,i.value);commitSoon();render()};i.onchange=()=>{commit();tokensUI()}});
 const r=$('#tkRad');r.oninput=()=>{r.previousElementSibling.querySelector('output').textContent=r.value;set('radius',+r.value);commitSoon();render()};
 $('#tkBtn').onchange=e=>{set('btn',e.target.value);commit();render()};mineSelect($('#tkFh'),()=>tk.fontHead,v=>{set('fontHead',v);commit();render()});mineSelect($('#tkFb'),()=>tk.fontBody,v=>{set('fontBody',v);commit();render()});
 $('#tkReset').onclick=()=>{delete site.tokens;commit();tokensUI();render();say('Back to the style’s own look')}}
/* ---------- style panel ---------- */
let skind=ui.skind||'all';
function setStyle(id){if(!PB.styles.has(id))return;page.style=id;commit();styles();render();say('Style: '+PB.styles.get(id).name)}
function styles(){tokensUI();const S=PB.styles.list(),t=($('#styleSearch').value||'').trim().toLowerCase();
 $('#skinds').innerHTML=PB.styles.KINDS.map(([k,l])=>`<button type="button" class="chip" aria-pressed="${k===skind}" data-k="${k}">${l} <small>${k==='all'?S.length:S.filter(s=>s.kind===k).length}</small></button>`).join('');
 $$('#skinds .chip').forEach(b=>b.onclick=()=>{skind=b.dataset.k;ui.skind=skind;saveUI();styles();const n=$(`#skinds [data-k="${skind}"]`);n&&n.focus()});
 const items=S.filter(s=>(skind==='all'||s.kind===skind)&&(!t||(s.name+' '+s.note+' '+s.head+' '+s.body+' '+(s.mood||'')+' '+s.id).toLowerCase().includes(t)));
 const cur=PB.styles.get(page.style);
 $('#styleNow').innerHTML=`<span class="sw">${cur.sw.map(c=>`<i style="background:${esc(c)}"></i>`).join('')}</span><span><b>${esc(cur.name)}</b><small>${esc(cur.note)} · ${esc(cur.head)}${cur.head!==cur.body?' + '+esc(cur.body):''}</small></span>`;
 $('#styleList').innerHTML=items.slice(0,240).map(s=>`<li><button type="button" class="sc" aria-pressed="${s.id===page.style}" data-s="${esc(s.id)}"><span class="sw" aria-hidden="true">${s.sw.map(c=>`<i style="background:${esc(c)}"></i>`).join('')}</span><span class="sn"><b>${esc(s.name)}</b><small>${esc(s.note)} · ${esc(s.head)}</small></span></button></li>`).join('')||'<li class="hint">No style matches.</li>';
 $('#styleCount').textContent=items.length+' styles';
 $$('#styleList .sc').forEach(b=>b.onclick=()=>{setStyle(b.dataset.s);const n=$(`#styleList [data-s="${CSS.escape(b.dataset.s)}"]`);n&&n.focus()});
 const ps=$('#pairSel'),M=MF(),mine=M?M.list():[];ps.innerHTML='<option value="-1">The style’s own fonts</option>'+LIB.pairs.map((p,i)=>`<option value="${i}">${esc(p[0])}: ${esc(p[1])} + ${esc(p[2])}</option>`).join('')+(M?`<optgroup label="My fonts">${mine.map(f=>[['h','for headings'],['b','for body text'],['a','for headings and body']].map(([k,l])=>`<option value="my${k}:${esc(f.family)}">${esc(f.display)} ${l}</option>`).join('')).join('')}<option value="__upload_fonts">+ Upload fonts…</option></optgroup>`:'');ps.value=String(page.pair);if(ps.value!==String(page.pair))ps.value='-1'}
$('#styleSearch').oninput=()=>styles();
$('#pairSel').onchange=e=>{if(e.target.value==='__upload_fonts'){e.target.value=String(page.pair);MF().openDialog();return}page.pair=/^my/.test(e.target.value)?e.target.value:+e.target.value;commit();render();const pr=pairOf(page);say(!pr?'Using the style’s fonts':'Fonts: '+pr[0])};
if(window.MyFonts)MyFonts.on(()=>{try{styles();render();mineExportUI()}catch(e){}});

/* ---------- pages of this site ---------- */
const accentOf=()=>{const st=PB.styles.get(page.style);return (st&&st.sw&&st.sw[3])||'#5B2DFF'};
function goPage(id){if(!site.pages.some(p=>p.id===id))return;curId=id;open=null;pageSelUI();outline();render();if(rtabCur==='page')pagesPanel()}
function pageSelUI(){const sel=$('#pageSel'),cp=curPage();sel.innerHTML=site.pages.map(p=>`<option value="${esc(p.id)}"${p.id===cp.id?' selected':''}>${esc(p.name||'Untitled')}${p.id===site.home&&(p.name||'').trim().toLowerCase()!=='home'?' (home)':''}</option>`).join('')}
$('#pageSel').onchange=e=>goPage(e.target.value);
function siteChanged(msg){commit();pageSelUI();outline();render();if(rtabCur==='page')pagesPanel();if(rtabCur==='site')sitePanel();if(msg)say(msg)}
const uniqueName=base=>{let n=base,i=2;while(site.pages.some(p=>p.name===n))n=base+' '+i++;return n};
function pgListHTML(){const cp=curPage(),L=$('#pgList');
 L.innerHTML=site.pages.map((p,i)=>`<li class="pgrow${p.id===cp.id?' cur':''}" data-id="${esc(p.id)}"><button type="button" class="pgname" data-a="go"${p.id===cp.id?' aria-current="true"':''}><b>${esc(p.name||'Untitled')}${p.id===site.home?' <em>Home</em>':''}${p.kind==='post'?' <em>Post</em>':''}</b><small>${esc(S.pageFile(site,p))} · ${p.blocks.length} sections${p.inNav?'':' · not in menu'}</small></button><span class="pgact"><button type="button" class="ib" data-a="up" aria-label="Move ${esc(p.name)} up"${i?'':' disabled'}>↑</button><button type="button" class="ib" data-a="down" aria-label="Move ${esc(p.name)} down"${i<site.pages.length-1?'':' disabled'}>↓</button><button type="button" class="ib" data-a="dup" aria-label="Duplicate ${esc(p.name)}">⧉</button><button type="button" class="ib" data-a="home" aria-label="Make ${esc(p.name)} the home page"${p.id===site.home?' disabled':''}>⌂</button><button type="button" class="ib" data-a="rm" aria-label="Delete ${esc(p.name)}"${site.pages.length<2?' disabled':''}>✕</button></span></li>`).join('');
 L.querySelectorAll('.pgrow').forEach(li=>{const id=li.dataset.id;li.querySelectorAll('button').forEach(b=>b.onclick=()=>pageAct(id,b.dataset.a))})}
function pageAct(id,a){const i=site.pages.findIndex(p=>p.id===id),p=site.pages[i];if(!p)return;
 if(a==='go')return goPage(id);
 if(a==='up'||a==='down'){const j=a==='up'?i-1:i+1;if(j<0||j>=site.pages.length)return;site.pages.splice(j,0,site.pages.splice(i,1)[0]);return siteChanged('Moved '+p.name)}
 if(a==='dup'){const c=clone(p);c.id=S.uid('pg');c.name=uniqueName(p.name+' copy');c.slug=S.uniqueSlug(site,c.name);c.blocks.forEach(b=>b.uid=uidGen());site.pages.splice(i+1,0,c);curId=c.id;return siteChanged('Duplicated '+p.name)}
 if(a==='home'){site.home=id;return siteChanged(p.name+' is now the home page')}
 if(a==='rm'){if(site.pages.length<2)return;if(!confirm('Delete the page “'+p.name+'”? Undo brings it back.'))return;site.pages.splice(i,1);site.nav=site.nav.filter(n=>n.link!=='page:'+id);if(site.home===id)site.home=site.pages[0].id;if(curId===id)curId=site.home;open=null;return siteChanged('Deleted '+p.name)}}
function serp(){const cp=curPage(),stg=site.settings,t=cp.title||(cp.id===site.home?site.brand:cp.name+' · '+site.brand),d=cp.desc||stg.description||'Add a description: it is what search results show under the title.';
 $('#serp').innerHTML=`<b>${esc(t)}</b><span>${esc((stg.url||'https://yoursite.com').replace(/\/$/,''))}/${cp.id===site.home?'':esc(cp.slug)}</span><p>${esc(d)}</p>`}
function pagesPanel(){const cp=curPage();pgListHTML();
 $('#pgName').value=cp.name;$('#pgSlug').value=cp.id===site.home?'index':cp.slug;$('#pgSlug').disabled=cp.id===site.home;$('#pgNav').checked=cp.inNav;{const pf=$('#pgDateF');pf.hidden=cp.kind!=='post';$('#pgDate').value=cp.date||''}$('#ptitle').value=cp.title||'';$('#pgDesc').value=cp.desc||'';$('#pgOg').value=cp.og||'';serp()}
$('#addPost').onclick=()=>{const n=uniqueName('New post'),today=new Date(),iso=today.toISOString().slice(0,10),nice=today.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
 const p=S.newPage(site,n,[{uid:uidGen(),id:'blog-post',vals:{tag:'News',heading:n,author:site.brand||'Author',date:nice,read:'3 min read',img:'films/smoke-plume.jpg',alt:'Soft smoke drifting upwards',paras:'Start with a sentence that makes someone want the second one.\n## A heading for the next part\nWrite the story one block per line.\n> A line worth quoting.\n- A point\n- Another point',initials:String(site.brand||'A')[0].toUpperCase(),bio:'About the author in one line.'}},{uid:uidGen(),id:'newsletter',vals:{kicker:'Newsletter',heading:'Liked this?',intro:'One email when there is something new.',button:'Subscribe',small:'Unsubscribe whenever you like.'}}]);
 p.name=n;p.kind='post';p.date=iso;p.inNav=false;p.slug=S.uniqueSlug(site,'post-'+n,p.id);site.pages.push(p);if(site.navSeed){site.navAuto=true;site.navSeed=false}curId=p.id;open=null;siteChanged('Added the post “'+n+'”. Write it in the outline, then put “Latest posts” on a page.');const e=$('#pgName');if(e){const d=$('#pgSettings');if(d)d.open=true;e.focus();e.select()}};
$('#addPage').onclick=()=>{const name=uniqueName('New page'),p=S.newPage(site,name,[{uid:uidGen(),id:'rich-text',vals:{kicker:'',heading:name,paras:'Write something here.'}}]);p.name=name;site.pages.push(p);if(site.navSeed){site.navAuto=true;site.navSeed=false}curId=p.id;open=null;siteChanged('Added '+name);const n=$('#pgName');if(n){n.focus();n.select()}};
$('#pgName').oninput=e=>{const cp=curPage(),old=cp.name;cp.name=e.target.value;if(cp.id!==site.home&&cp.slug===S.slugify(old)){cp.slug=S.uniqueSlug(site,cp.name||'page',cp.id);$('#pgSlug').value=cp.slug}commitSoon();pgListHTML();pageSelUI();status();serp();render()};
$('#pgName').onchange=e=>{if(!e.target.value.trim()){e.target.value=curPage().name='Untitled page';siteChanged()}};
$('#pgSlug').onchange=e=>{const cp=curPage();cp.slug=S.uniqueSlug(site,e.target.value||cp.name,cp.id);e.target.value=cp.slug;commit();pgListHTML();serp();say('Address: '+S.pageFile(site,cp))};
$('#pgDate').onchange=e=>{const cp=curPage();if(cp.kind!=='post'||!/^\d{4}-\d{2}-\d{2}$/.test(e.target.value))return;cp.date=e.target.value;const b=cp.blocks.find(x=>x.id==='blog-post');if(b)b.vals.date=new Date(e.target.value+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});commit();render();outline()};
$('#pgNav').onchange=e=>{curPage().inNav=e.target.checked;commit();pgListHTML();render()};
$('#ptitle').oninput=e=>{curPage().title=e.target.value;commitSoon();serp()};
$('#pgDesc').oninput=e=>{curPage().desc=e.target.value;commitSoon();serp()};
$('#pgOg').oninput=e=>{curPage().og=e.target.value.trim();commitSoon()};

/* ---------- link picker: none, a page of this site, or any address ---------- */
function linkPicker(value,on,label,id){const w=document.createElement('div');w.className='lp';const sel=document.createElement('select');if(id)sel.id=id;sel.setAttribute('aria-label',label||'Link target');
 [['','No link'],...site.pages.map(p=>['page:'+p.id,'Page: '+p.name]),['custom','A web address, email or #anchor…']].forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;sel.append(o)});
 const isPage=site.pages.some(p=>'page:'+p.id===value),custom=!!value&&!isPage;sel.value=custom?'custom':isPage?value:'';
 const inp=document.createElement('input');inp.placeholder='https://…, mailto:…, tel:… or #section';inp.value=custom?value:'';inp.hidden=!custom;inp.setAttribute('aria-label','Link address');
 sel.onchange=()=>{if(sel.value==='custom'){inp.hidden=false;inp.focus();on(inp.value.trim())}else{inp.hidden=true;on(sel.value)}};inp.oninput=()=>on(inp.value.trim());
 w.append(sel,inp);return w}

/* ---------- site settings ---------- */
const FAVSETS=()=>[['glyphs','Builder icons'],['letter','First letter of the brand'],...Object.keys(LIB.iconFiles).map(f=>[f,f.replace(/-/g,' ')+' icons'])];
function favUI(){const f=site.settings.favicon;$('#favSet').innerHTML=FAVSETS().map(([k,l])=>`<option value="${esc(k)}">${esc(l)}</option>`).join('');$('#favSet').value=f.set;
 const names=f.set==='letter'?[]:PB.iconNames(f.set);$('#favName').innerHTML=names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');$('#favName').disabled=!names.length;$('#favName').value=f.name||names[0]||'';
 if(f.set!=='letter'&&f.set!=='glyphs'&&f.name&&PB.loadIcon)PB.loadIcon(f.set,f.name+'.svg');
 $('#favPrev').src=S.svgDataURL(S.faviconSVG(site,accentOf()))}
function navRows(){const box=$('#navRows');box.innerHTML='';$('#navAuto').checked=site.navAuto;
 if(site.navAuto){const it=S.menu(site);box.innerHTML=`<p class="hint">The menu lists: ${it.length?it.map(i=>esc(i.label)).join(', '):'no pages yet'}. Hide a page from it in the Outline tab, under “This page’s name, address and search settings”.</p>`;return}
 site.nav.forEach((n,i)=>{const r=document.createElement('div');r.className='navrow';const li=document.createElement('input');li.value=n.label;li.setAttribute('aria-label','Menu item '+(i+1)+' text');li.oninput=()=>{site.navSeed=false;n.label=li.value;commitSoon();render()};
  const lp=linkPicker(n.link,v=>{site.navSeed=false;n.link=v;commitSoon();render()},'Menu item '+(i+1)+' link');
  const act=document.createElement('span');act.className='pgact';act.innerHTML=`<button type="button" class="ib" data-a="up" aria-label="Move ${esc(n.label)} up"${i?'':' disabled'}>↑</button><button type="button" class="ib" data-a="down" aria-label="Move ${esc(n.label)} down"${i<site.nav.length-1?'':' disabled'}>↓</button><button type="button" class="ib" data-a="rm" aria-label="Remove ${esc(n.label)}">✕</button>`;
  act.querySelectorAll('button').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='rm')site.nav.splice(i,1);else{const j=a==='up'?i-1:i+1;site.nav.splice(j,0,site.nav.splice(i,1)[0])}commit();navRows();render()});
  r.append(li,lp,act);box.append(r)});
 const add=document.createElement('button');add.type='button';add.className='btn small';add.textContent='Add menu item';add.onclick=()=>{site.nav.push({label:'New link',link:''});commit();navRows();render()};box.append(add)}
function sitePanel(){const st=site.settings;
 $('#brand').value=site.brand||'';$('#sname').value=site.name||'';$('#slang').value=st.lang||'en';$('#surl').value=st.url||'';$('#sdesc').value=st.description||'';$('#sog').value=st.ogImage||'';
 $('#nfOn').checked=st.notFound.on;$('#nfTitle').value=st.notFound.title;$('#nfText').value=st.notFound.text;$('#nfBtn').value=st.notFound.button;$('#sAnalytics').value=st.analytics||'';$('#sForm').value=st.formAction||'';
 favUI();navRows()}
const bindSite=(sel,fn,live)=>{$(sel).oninput=e=>{fn(e.target.value,e.target);commitSoon();if(live)render()}};
bindSite('#brand',v=>{site.brand=v},1);bindSite('#sname',v=>{site.name=v});bindSite('#slang',v=>{site.settings.lang=v.trim().slice(0,12)||'en'});bindSite('#surl',v=>{site.settings.url=v.trim()});
bindSite('#sdesc',v=>{site.settings.description=v});bindSite('#sog',v=>{site.settings.ogImage=v.trim()});bindSite('#sAnalytics',v=>{site.settings.analytics=v});bindSite('#sForm',v=>{site.settings.formAction=v.trim()},1);
bindSite('#nfTitle',v=>{site.settings.notFound.title=v});bindSite('#nfText',v=>{site.settings.notFound.text=v});bindSite('#nfBtn',v=>{site.settings.notFound.button=v});
$('#nfOn').onchange=e=>{site.settings.notFound.on=e.target.checked;commit()};
$('#favSet').onchange=e=>{const f=site.settings.favicon;f.set=e.target.value;f.name=f.set==='letter'?'':(PB.iconNames(f.set)[0]||'');commit();favUI()};
$('#favName').onchange=e=>{site.settings.favicon.name=e.target.value;commit();favUI();setTimeout(favUI,500)};
$('#navAuto').onchange=e=>{site.navSeed=false;site.navAuto=e.target.checked;if(!site.navAuto&&!site.nav.length)site.nav=S.menu(site).map(i=>({label:i.label,link:i.link}));commit();navRows();render()};

/* ---------- saved sites and templates ---------- */
function switchTo(id){clearTimeout(typing);commit();site=store.pages[id];store.cur=id;curId=site.home;hist=[];fut=[];lastSnap=snap();open=null;persist();refresh();histUI();csel=null;if(PB.app&&PB.app.onSwitch)PB.app.onSwitch()}

/* ---------- right panel tabs, panes ---------- */
const RT=[['page','Outline'],['style','Design'],['site','Site'],['ai','AI']];let rtabCur=RT.some(t=>t[0]===ui.rtab)?ui.rtab:'page';
function rtab(k){if(k==='pages'){k='page';const d=$('#pgSettings');if(d)d.open=true}rtabCur=k;if(k!=='check'){ui.rtab=k;saveUI()}$$('#rtabs [role=tab]').forEach(b=>{const on=b.dataset.t===k;b.setAttribute('aria-selected',on);b.tabIndex=on||(k==='check'&&b.dataset.t==='page')?0:-1});$$('.rpanel').forEach(p=>p.hidden=p.id!=='rp-'+k);if(k==='style')styles();if(k==='page')pagesPanel();if(k==='site')sitePanel();if(k==='check')runCheck();if(k==='ai')aiStatus()}
$('#rtabs').innerHTML=RT.map(([k,l])=>`<button role="tab" type="button" id="rt-${k}" data-t="${k}" aria-controls="rp-${k}">${l}</button>`).join('');
$$('#rtabs [role=tab]').forEach((b,i,all)=>{b.onclick=()=>rtab(b.dataset.t);b.onkeydown=e=>{const n=all.length;let j=null;if(e.key==='ArrowRight')j=(i+1)%n;if(e.key==='ArrowLeft')j=(i-1+n)%n;if(j!=null){e.preventDefault();rtab(all[j].dataset.t);all[j].focus()}}});
function showPane(k){document.body.dataset.pane=k;$$('#panes button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.p===k))}
$$('#panes button').forEach(b=>b.onclick=()=>showPane(b.dataset.p));
const W=[['desk','Desktop','100%'],['tab','Tablet','820px'],['phone','Phone','390px']];
$('#widths').innerHTML=W.map(([k,l])=>`<button type="button" data-w="${k}" aria-pressed="${k===(ui.w||'desk')}">${l}</button>`).join('');
function setW(k){ui.w=k;saveUI();const w=W.find(x=>x[0]===k)||W[0];frameWrap.dataset.w=k;pv.style.width=w[2];applyZoom();$$('#widths button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.w===k))}
function applyZoom(){const z=ZOOM,w=(W.find(x=>x[0]===(ui.w||'desk'))||W[0])[2];frameWrap.classList.toggle('zoomed',z!==1);
 pv.style.maxWidth=z===1?'':'none';pv.style.flex=z===1?'':'none';if(z===1){pv.style.transform='';pv.style.width=w;pv.style.height='';pv.style.transformOrigin='';frameWrap.style.removeProperty('--zh')}
 else{const px=/px$/.test(w)?parseFloat(w):null;pv.style.width=px?px+'px':(100/z)+'%';pv.style.height=(100/z)+'%';pv.style.transformOrigin='top '+(px?'center':'left');pv.style.transform='scale('+z+')'}
 const o=$('#zoomVal');if(o)o.textContent=Math.round(z*100)+'%';placeTb(lastRects)}
function setZoom(z){ZOOM=Math.max(.4,Math.min(1.5,Math.round(z*20)/20));ui.zoom=ZOOM;saveUI();applyZoom()}
$$('#widths button').forEach(b=>b.onclick=()=>setW(b.dataset.w));ZOOM=ui.zoom>=.4&&ui.zoom<=1.5?ui.zoom:1;setW(ui.w||'desk');

/* ---------- export ---------- */
const slug=()=>(page.brand||page.name||'page').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'page';
function dl(blob,name){const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
async function prefetch(){const all=[...site.header,...site.pages.flatMap(p=>p.blocks),...site.footer],jobs=[];
 if(cache.cl==null&&all.some(b=>b.id==='x-component'))jobs.push(fetch('component-lab.js').then(r=>r.ok?r.text():null).then(t=>{cache.cl=t}).catch(()=>{}));
 all.filter(b=>b.id==='x-interaction').forEach(b=>{const id=val(b,'iid');if(cache.ix[id]!=null)return;jobs.push(PB.ix.load(id).then(t=>{if(t)cache.ix[id]=t.split('../../assets/').join(SITE+'assets/')}))});
 [...JSON.stringify(site).matchAll(/user:([\w-]+)/g)].forEach(m=>{if(!dcache.has(m[1]))jobs.push(PB.images.dataURL(m[1]).then(u=>{dcache.set(m[1],u)}))});
 await Promise.all(jobs)}
const favHref=()=>S.svgDataURL(S.faviconSVG(site,accentOf()));
async function htmlFile(){await prefetch();const P=compose('html');return swapA(assemble(P,{clInline:cache.cl||null,favHref:favHref()}),SITE+'assets/')}
$('#dlHtml').onclick=async()=>{closeMenu();try{const h=await htmlFile();dl(new Blob([h],{type:'text/html'}),slug()+'.html');say('Downloading '+slug()+'.html')}catch(e){console.error(e);say('Export failed')}};
$('#copyHtml').onclick=async()=>{closeMenu();copy(await htmlFile(),'HTML copied')};
$('#openTab').onclick=async()=>{closeMenu();const w=window.open('','_blank');const h=await htmlFile();const u=URL.createObjectURL(new Blob([h],{type:'text/html'}));if(w)w.location=u;else window.open(u,'_blank');setTimeout(()=>URL.revokeObjectURL(u),60000)};
/* the whole site as files: [[path, string|Uint8Array]]. opt.pub = {base:'/site/<id>/', origin} makes every link absolute for publishing. */
async function buildSiteFiles(opt={}){await prefetch();const acc=newAcc(),assets=new Map(),out=[];pubBase=opt.pub?opt.pub.base:'';
 try{
 const vids=new Set();const fix=s=>s.replace(/\u0001A\/([^"')\s]+)/g,(m,p)=>{if(/\.(mp4|webm|mov)$/i.test(p)||/[$`{]/.test(p)){if(!/[$`{]/.test(p))vids.add(p);return SITE+'assets/'+p}assets.set(p,1);return pubBase+'assets/'+p});
 const stg=site.settings,nf=stg.notFound,brand=site.brand||site.name;
 const items=site.pages.map(pg=>({pg,file:S.pageFile(site,pg),js:pg.id===site.home?'index':pg.slug}));
 if(nf.on)items.push({pg:{id:'__404',name:'Page not found',slug:'404',title:nf.title+' · '+brand,desc:'',og:'',inNav:false,noindex:true,blocks:[{uid:'nf404',id:'x-notfound',vals:{title:nf.title,text:nf.text,button:nf.button}}]},file:'404.html',js:'404'});
 items.forEach(it=>{it.P=compose('zip',it.pg,acc)});
 const st=items[0].P.st;let css=fix(buildCSS(st,acc));const fontURL=fontURLOf(acc);
 const mUsed=mineUsed(css),mInc=opt.pub?MINE.pub:MINE.zip,mFiles=[];
 if(mUsed.length){const M=MF();if(mInc){css=M.fontFaceCSSSync(mUsed,{mode:'file',dir:opt.pub?pubBase+'fonts/':'../fonts/'})+css;for(const f of mUsed)for(const x of await M.exportFiles(f))mFiles.push([x.path,x.bytes])}
  else css=`/* Fonts: this site uses your own font${mUsed.length>1?'s':''} (${mUsed.join(', ')}). The font files are not included. Bring your own font files: place them in /fonts and add @font-face rules, for example:\n@font-face{font-family:"${mUsed[0]}";src:url("../fonts/${mUsed[0].replace(/[^A-Za-z0-9_.-]+/g,'-')}-400.ttf") format("truetype");font-weight:400;font-style:normal;font-display:swap}\n*/\n`+css}
 const base=((stg.url||'').trim()||(opt.pub?opt.pub.origin+opt.pub.base:'')),canon=it=>base&&!it.pg.noindex?base.replace(/\/?$/,'/')+(it.file==='index.html'?'':it.file):'';
 let anyCl=false;
 items.forEach(it=>{const P=it.P;anyCl=anyCl||P.cl;const code=swapA((P.runtime?P.runtime+'\n':'')+P.js,SITE+'assets/');
  const html=assemble({...P,fontURL,cssText:css,body:fix(P.body),runtime:'',js:code},{cssHref:pubBase+'assets/site.css',jsHref:code.trim()?pubBase+'assets/'+it.js+'.js':null,clSrc:pubBase+'assets/component-lab.js',favHref:pubBase+'assets/favicon.svg',feedHref:pubBase+'feed.xml',canonical:canon(it)});
  out.push([it.file,html]);if(code.trim())out.push(['assets/'+it.js+'.js',code])});
 out.push(['assets/site.css',css],['assets/favicon.svg',S.faviconSVG(site,accentOf())]);mFiles.forEach(f=>out.push(f));
 if(anyCl)out.push(['assets/component-lab.js',cache.cl||'/* component-lab.js could not be copied; load it from '+SITE+'component-lab.js */']);
 acc.files.forEach((t,n)=>{if(/^interactions\/.+\.html$/.test(n)&&typeof t==='string'){/* pictures inside a demo are packed with the site, not hot-linked from the atlas */const ims=PB.ix.images(t.split(SITE+'assets/').join('assets/'));if(/assets\/shelf\/\$\{/.test(t.split(SITE).join('')))t=t.split(SITE+'assets/shelf/').join('../assets/shelf/');ims.forEach(q=>{if(!/^assets\/(shelf|photos)\//.test(q))return;assets.set(q.replace(/^assets\//,''),1);t=t.split(SITE+q).join('../'+q)})}out.push([n,t])});
 const dims=new Map(),vars=new Map(),mime=e=>e==='png'?'image/png':e==='webp'?'image/webp':'image/jpeg';
 const shrink=async(blob,w,type)=>{try{const bm=await createImageBitmap(blob);if(bm.width<=w*1.15)return null;const k=w/bm.width,c=document.createElement('canvas');c.width=w;c.height=Math.round(bm.height*k);c.getContext('2d').drawImage(bm,0,0,c.width,c.height);const o=await new Promise(r=>c.toBlob(r,type,.82));return o?new Uint8Array(await o.arrayBuffer()):null}catch(e){return null}};
 for(const id of (acc.uploads||[])){const b=await PB.images.bytes(id);if(!b)continue;const ext=PB.images.ext(id),base='assets/uploads/'+id,path=base+'.'+ext;out.push([path,b]);const d=await PB.images.dims(id);if(d)dims.set(path,d);
  if(ext!=='svg'&&ext!=='gif'){const rec=PB.images.cache.get(id),list=[];for(const w of [640,1280]){const v=await shrink(rec.blob,w,mime(ext));if(v){out.push([base+'-'+w+'.'+ext,v]);list.push([w,base+'-'+w+'.'+ext])}}if(list.length&&d){list.push([d[0],path]);vars.set(path,list)}}}
 for(const p of assets.keys()){try{const r=await fetch('assets/'+p);if(!r.ok)continue;const bytes=new Uint8Array(await r.arrayBuffer());out.push(['assets/'+p,bytes]);const ext=(p.match(/\.(\w+)$/)||[])[1];
   if(/^(png|jpe?g|webp)$/i.test(ext||'')){try{const bm=await createImageBitmap(new Blob([bytes]));dims.set('assets/'+p,[bm.width,bm.height])}catch(e){}}
   const m=/^photos\/([\w-]+)\.webp$/.exec(p);if(m){try{const r2=await fetch('assets/photos/'+m[1]+'-640.webp');if(r2.ok){out.push(['assets/photos/'+m[1]+'-640.webp',new Uint8Array(await r2.arrayBuffer())]);const d=dims.get('assets/'+p);if(d)vars.set('assets/'+p,[[640,'assets/photos/'+m[1]+'-640.webp'],[d[0],'assets/'+p]])}}catch(e){}}}catch(e){}}
 /* images get their size (no layout shift), async decoding and, where we made smaller copies, a srcset */
 for(const o of out){if(!/\.html$/.test(o[0])||typeof o[1]!=='string')continue;
  o[1]=o[1].replace(/<img\b([^>]*)>/g,(m,at)=>{const sm=/\ssrc="([^"]+)"/.exec(at);if(!sm)return m;let src=sm[1];if(pubBase&&src.startsWith(pubBase))src=src.slice(pubBase.length);src=src.replace(/^\.\//,'');let add='';const d=dims.get(src),vv=vars.get(src);
   if(d&&!/\swidth=/.test(at))add+=` width="${d[0]}" height="${d[1]}"`;if(vv&&!/\ssrcset=/.test(at))add+=` srcset="${vv.map(([w,pp])=>pubBase+pp+' '+w+'w').join(', ')}" sizes="(max-width: 700px) 100vw, 1200px"`;if(!/\sdecoding=/.test(at))add+=' decoding="async"';if(!add)return m;const self=/\/\s*$/.test(at);return '<img'+(self?at.replace(/\s*\/\s*$/,''):at)+add+(self?' /':'')+'>'})}
 const today=new Date().toISOString().slice(0,10);
 {const all=[...site.header,...site.pages.flatMap(p=>p.blocks),...site.footer],fams=new Set(all.filter(b=>b.id==='x-icons').map(b=>(b.vals&&b.vals.family)||'regular'));if(site.settings.favicon&&site.settings.favicon.set&&!['glyphs','letter'].includes(site.settings.favicon.set))fams.add(site.settings.favicon.set);
  const used=[...assets.keys(),...vids];const ph=(PB.photos&&PB.photos.used?PB.photos.used(used):[]);
  out.push(['assets/CREDITS.txt',PB.credits.build({paths:used,fonts:[...acc.fonts],icons:[...fams],photos:ph})])}
 out.push(['sitemap.xml',S.sitemap(site,base||'https://example.com/',today)],['robots.txt',S.robots(base)]);
 if(S.posts(site).length)out.push(['feed.xml',feedXML(base||'https://example.com/')]);
 out.push(['README.txt',`${brand}: a static website made with the Visual & Motion Atlas site builder.\n\n${site.pages.length} page${site.pages.length>1?'s':''}: ${site.pages.map(p=>S.pageFile(site,p)).join(', ')}.\nOpen index.html in a browser. Keep assets/CREDITS.txt with the site: it lists the credits and licences of the pictures, icons and fonts used. Styles are in assets/site.css, behaviour in assets/*.js, images in assets/.\nFilms still stream from ${SITE}assets/films/ so the download stays small; copy them next to your site and change the paths before you publish.\nForms${stg.formAction?' post to '+stg.formAction:' are placeholders and send nothing until you set a form address in Site settings'}.\n\nPublish it: drag this folder onto Netlify Drop, or run "vercel" inside it, or push it to GitHub Pages. To use your own domain, add it in that host's settings and set the Site address in the builder so sitemap.xml and canonical links use it${(stg.url||'').trim()?'':' (it is empty now, so sitemap.xml uses https://example.com/: replace it)'}.\nStyle: ${st.style?st.style.name:''}.\n`]);
 if(mUsed.length){const i=out.findIndex(o=>o[0]==='README.txt');if(i>=0)out[i][1]+=`\n\nFonts: this site uses your own font${mUsed.length>1?'s':''} (${mUsed.join(', ')}). ${mInc?'Copies of your font files are in fonts/. Check that your licence allows you to pass them on or publish them.':'The font files are not included: bring your own font files and place them in a fonts/ folder next to index.html, then add @font-face rules for them in assets/site.css (a template is at the top of that file). Until then visitors see a fallback font.'}\n`}
 return out}finally{pubBase=''}}
$('#mkShare').onclick=async()=>{closeMenu();say('Preparing the page…');try{const h=await htmlFile();await MockupHandoff.send({html:h,title:($('#ptitle').value||$('#brand').value||'').slice(0,100),from:'page builder'})}catch(e){say(e.message||'Could not open the Mockup studio')}};
function mineExportUI(){const row=$('#mineExport');if(!row)return;let u=[];try{u=mineUsed(compose('html').cssText)}catch(e){}row.hidden=!u.length;const pm=$('#pubMine');if(pm)pm.hidden=!u.length}
{const em=$('#exportMenu');if(em)em.addEventListener('toggle',()=>{if(em.open)mineExportUI()})}
$('#exInclFonts')&&($('#exInclFonts').onchange=()=>{MINE.zip=$('#exInclFonts').checked});
$('#dlZip').onclick=async()=>{closeMenu();MINE.zip=!!($('#exInclFonts')&&$('#exInclFonts').checked);const zip=(window.ThemeKits&&window.ThemeKits.zip)||PB.zip;say('Building the site ZIP…');try{const files=await buildSiteFiles();dl(zip(files),slug()+'-site.zip');say('Downloading '+slug()+'-site.zip')}catch(e){console.error(e);say('ZIP export failed')}};
PB.buildSiteFiles=buildSiteFiles;PB.getSite=()=>site;

/* ---------- publish to a shareable address (api/site.js) ---------- */
const PUBKEY='atlas-site-publish-v1',pubDlg=$('#pubDlg');
const pubGetFor=id=>{try{return (JSON.parse(localStorage.getItem(PUBKEY))||{})[id]||null}catch(e){return null}};
const pubGet=()=>pubGetFor(site.id);
const pubSet=r=>{try{const a=JSON.parse(localStorage.getItem(PUBKEY))||{};if(r)a[site.id]=r;else delete a[site.id];localStorage.setItem(PUBKEY,JSON.stringify(a))}catch(e){}};
async function apiSite(method,qs,body,key){let r;try{r=await fetch('/api/site'+qs,{method,headers:{'content-type':'application/json',...(key?{'x-edit-key':key}:{})},body:body?JSON.stringify(body):undefined})}catch(e){return {ok:false,status:0,j:null}}
 let j=null;try{j=await r.json()}catch(e){}return {ok:r.ok,status:r.status,j}}
const b64=u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)};
let pubAvail=null;
async function pubStatus(){const r=await apiSite('GET','?status');pubAvail=r.ok&&r.j&&typeof r.j.enabled==='boolean'?(r.j.enabled?'on':'off'):'none';return pubAvail}
async function pubDraw(msg){const rec=pubGet(),st=pubAvail||await pubStatus();const state=$('#pubState'),link=$('#pubLink');
 $('#pubGo').textContent=rec?'Update the live site':'Publish';$('#pubGo').disabled=st!=='on';$('#pubOff').hidden=!rec;$('#pubCopy').hidden=!rec;$('#pubOpen').hidden=!rec;
 if(st==='none')state.textContent='Publishing runs on the live site only, so it is switched off in this copy. Download the ZIP instead: it works anywhere.';
 else if(st==='off')state.textContent='Publishing is not switched on yet: the site owner needs to connect a Vercel Blob store to this project. You can still download the ZIP and host it anywhere.';
 else state.textContent=msg||(rec?'Published. Update it after you make changes.':'Publish this site to a shareable address on the atlas. You can unpublish any time.');
 if(rec&&rec.url){link.innerHTML=`<a href="${esc(rec.url)}" target="_blank" rel="noopener">${esc(rec.url)}</a>${rec.at?' · '+new Date(rec.at).toLocaleString():''}`;$('#pubOpen').href=rec.url}else link.textContent=''}
const pubMsg=st=>st===0?'Could not reach the publishing service. Check your connection and try again. Your site is safe in this browser, and the ZIP download still works.':st===413?'The site is too big to publish. Remove large uploaded images or download the ZIP instead.':st===429?'Too many publishes just now. Wait a minute and try again.':'Publishing failed ('+st+'). Try again, or download the ZIP.';
async function publishSite(){const go=$('#pubGo');go.disabled=true;let rec=pubGet();MINE.pub=!!($('#pubInclFonts')&&$('#pubInclFonts').checked&&!$('#pubMine').hidden);
 try{
  for(let attempt=0;attempt<2;attempt++){
   if(!rec){await pubDraw('Creating the address…');const c=await apiSite('POST','',{name:site.name,files:[]});if(!c.ok)throw new Error((c.j&&c.j.error)||pubMsg(c.status));rec={id:c.j.id,key:c.j.key};pubSet(rec)}
   $('#pubState').textContent='Building the site…';const base='/site/'+rec.id+'/',files=await buildSiteFiles({pub:{base,origin:location.origin}});
   const payload=files.filter(([p])=>!/^README/.test(p)).map(([p,c])=>typeof c==='string'?{path:p,text:c}:{path:p,b64:b64(c)});
   $('#pubState').textContent='Uploading '+payload.length+' files…';const u=await apiSite('PUT','?id='+rec.id,{name:site.name,files:payload},rec.key);
   if(u.status===403||u.status===404){pubSet(null);rec=null;continue}
   if(!u.ok)throw new Error((u.j&&u.j.error)||pubMsg(u.status));
   rec.url=location.origin+base;rec.at=Date.now();pubSet(rec);await pubDraw('Published. Share the link below.');say('Site published');return}
  throw new Error('Could not publish. Try again.')}
 catch(e){await pubDraw(e.message||'Publishing failed');$('#pubGo').disabled=false}}
$('#pubBtn').onclick=async()=>{closeMenu();mineExportUI();pubDlg.showModal();await pubDraw()};
$('#pubClose').onclick=()=>pubDlg.close();$('#pubGo').onclick=publishSite;
$('#pubCopy').onclick=()=>{const r=pubGet();r&&copy(r.url,'Link copied')};
$('#pubOff').onclick=async()=>{const r=pubGet();if(!r||!confirm('Unpublish this site? The link stops working.'))return;const d=await apiSite('DELETE','?id='+r.id,null,r.key);if(d.ok||d.status===404){pubSet(null);await pubDraw('Unpublished.')}else await pubDraw((d.j&&d.j.error)||'Could not unpublish')};

/* ---------- save into My projects (local first) ---------- */
function projectsList(){try{const l=JSON.parse(localStorage.getItem('atlas-projects-v1')||'[]');return Array.isArray(l)?l:[]}catch(e){return []}}
const projOrigin=s=>'site-'+String(s.id).replace(/[^\w-]/g,'');
const hasProject=s=>projectsList().some(x=>x&&x.origin===projOrigin(s));
function saveToProjects(sx,quiet){sx=sx&&sx.pages?sx:site;const K='atlas-projects-v1';const list=projectsList();
 const origin=projOrigin(sx),rec=pubGetFor(sx.id),links=[{id:'site-edit',title:'Edit in the site builder',url:'page-builder.html?site='+encodeURIComponent(sx.id),kind:'page',text:sx.pages.length+' page'+(sx.pages.length>1?'s':'')+', saved in this browser.'}];
 if(rec&&rec.url)links.push({id:'site-live',title:'Published site',url:rec.url,kind:'page',text:'The live address.'});
 const nm=t=>String(t||'').trim().toLowerCase();let p=list.find(x=>x&&x.origin===origin)||list.find(x=>x&&/^brand-/.test(x.origin||'')&&nm(x.name)===nm(sx.name||sx.brand));/* a brand saved earlier under the same name gets the site in its hub instead of a second project */const now=Date.now();
 if(!p){p={id:(crypto.randomUUID?crypto.randomUUID():'p'+now.toString(36)),name:sx.name||sx.brand,brief:'A website made in the site builder: '+sx.pages.map(x=>x.name).join(', ')+'.',platform:'Website',stage:'Designing',entries:[],icons:[],references:[],decisions:'',notes:{},directions:[],created:now,updated:now,origin,isPublic:false,files:[],hub:{links:[]}};list.push(p)}
 p.name=sx.name||sx.brand;p.updated=now;p.hub=p.hub&&typeof p.hub==='object'?p.hub:{links:[]};const keep=(p.hub.links||[]).filter(l=>!/^site-(edit|live)$/.test(l.id));p.hub.links=[...links,...keep];
 try{localStorage.setItem(K,JSON.stringify(list));if(!quiet)say('Saved to My projects');return true}catch(e){if(!quiet)say('Could not save: storage is full');return false}}
let projT=0;
$('#projBtn').onclick=()=>{closeMenu();saveToProjects()};
PB.projSync=()=>{clearTimeout(projT);projT=setTimeout(()=>{try{if(hasProject(site))saveToProjects(site,true)}catch(e){}},2500)};
/* icon library -> favicon: icons.html stores {set,name} and opens ?favicon=1 */
if(/[?&]favicon=1/.test(location.search))setTimeout(()=>{try{const h=JSON.parse(localStorage.getItem('atlas-pb-favicon-handoff')||'null');localStorage.removeItem('atlas-pb-favicon-handoff');
 if(h&&LIB.iconFiles[h.set]&&PB.iconNames(h.set).includes(h.name)){site.settings.favicon={set:h.set,name:h.name};commit();favUI();say('Favicon set to “'+h.name+'” ('+h.set.replace(/-/g,' ')+'). See it under Site settings.')}else say('That icon is not available as a favicon here. Pick one under Site settings.')}catch(e){}},700);
{const q=new URLSearchParams(location.search).get('site');if(q&&store.pages[q]&&site.id!==q){site=store.pages[q];store.cur=q;curId=site.home;lastSnap=snap()}}

$('#copyPrompt').onclick=()=>{closeMenu();const st=PB.styles.get(page.style),pair=pairOf(page);
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
 box.textContent=aiOn?aiMsg:aiMsg+' You can still describe a site: the closest template is filled with your name and words.';box.className='aistate '+(aiOn?'on':'off');$('#aiGo').disabled=false;$('#aiBrief').disabled=false;$('#aiKeep').disabled=!aiOn}
const AI_X=['x-background','x-kitbg'];
function catalog(only){return [...LIB.blocks,...AI_X.map(x=>PB.extraById[x])].filter(d=>!only||d.id===only).map(d=>({id:d.id,name:d.name,group:d.group,fields:fieldsOf(d).filter(f=>['text','long','list','film','image'].includes(f.type)||(d.id==='x-background'&&f.k==='bg')||(d.id==='x-kitbg'&&f.k==='kit')).map(f=>(f.type==='list'?f.k+'['+(f.label.match(/\(([^)]*)\)/)||[,'one per line'])[1]+']':f.k).slice(0,30))}))}
const aiStyleIds=()=>{const S=PB.styles.list();const pick=[...S.filter(s=>s.kind==='builder'),...S.filter(s=>s.kind==='kit'),...S.filter(s=>s.kind==='ds'),...S.filter(s=>!['builder','kit','ds'].includes(s.kind))].slice(0,200);return pick.map(s=>(s.id+'|'+s.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')).slice(0,40))};
const LIST_NOTE='\n(For fields written key[...], put one row per line and separate the parts of a row with " | ".)';
function toVals(d,fields){const out={};const F=fieldsOf(d);Object.entries(fields||{}).forEach(([k,v])=>{const key=k.split('[')[0];const f=F.find(x=>x.k===key);if(!f)return;v=String(v);
 if(f.type==='list'&&!v.includes('\n')){const multi=/\|/.test(f.label);if(v.includes(' || '))v=v.split(/\s*\|\|\s*/).join('\n');else if(!multi)v=v.split(/\s*\|\s*/).join('\n');else if(v.includes('; '))v=v.split(/\s*;\s+/).join('\n')}
 if(f.type==='film'&&!LIB.films.includes(v))return;if(f.type==='select'&&f.options&&!f.options({}).some(o=>o[0]===v))return;out[key]=v});return out}
async function aiCall(body){const r=await fetch('/api/ai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});let j=null;try{j=await r.json()}catch(e){}if(!r.ok||!j||!j.page)throw new Error((j&&j.error)||'The AI did not answer ('+r.status+').');return j.page}
const aiPageGo=async()=>{const brief=$('#aiBrief').value.trim();if(!brief){say('Describe the page first');$('#aiBrief').focus();return}const go=$('#aiGo');go.disabled=true;$('#aiOut').textContent='Writing your page…';
 try{const keep=$('#aiKeep').checked;const p=await aiCall({mode:'page',brief:(brief+LIST_NOTE).slice(0,1500),catalog:catalog(),styles:aiStyleIds(),current:keep?{title:page.title,brand:page.brand,style:page.style,blocks:page.blocks.filter(b=>B[b.id]||AI_X.includes(b.id)).map(b=>({id:b.id,fields:vals(b)}))}:undefined});
  const blocks=(p.blocks||[]).filter(b=>def(b.id)).map(b=>({uid:uidGen(),id:b.id,vals:toVals(def(b.id),b.fields)}));if(!blocks.length)throw new Error('The AI returned no sections. Try a more specific brief.');
  const sid=String(p.style||'').split('|')[0];{const sp=S.split(blocks,def);if(sp.header.length)site.header=sp.header;if(sp.footer.length)site.footer=sp.footer;page.blocks=sp.body}if(p.brand)page.brand=p.brand.slice(0,40);if(p.title)page.title=p.title.slice(0,80);if(PB.styles.has(sid))page.style=sid;open=null;commit();refresh();
  $('#aiOut').textContent=(p.note||'Done.')+' Undo brings your previous page back.';say('AI page ready')}
 catch(e){$('#aiOut').textContent=e.message||'Something went wrong.'}go.disabled=!aiOn};
async function aiSection(blk,btn){if(aiOn===null)await aiStatus();if(!aiOn){say('The AI is not available here: '+aiMsg);return}
 let form=btn.parentNode.parentNode.querySelector('.aiform');if(!form){const id='aib'+(++fid);form=document.createElement('div');form.className='aiform';form.innerHTML=`<label class="f" for="${id}">What should this section say?</label><textarea id="${id}" rows="2" placeholder="For a dog-walking business in Leeds, friendly tone"></textarea><button type="button" class="btn small primary">Rewrite this section</button>`;btn.parentNode.after(form);
  form.querySelector('button').onclick=()=>aiSectionGo(blk,form);}form.querySelector('textarea').focus()}
async function aiSectionGo(blk,form){const brief=form.querySelector('textarea').value.trim()||('For '+(page.brand||'this brand'));const btn=form.querySelector('button');btn.disabled=true;btn.textContent='Rewriting…';
 try{const p=await aiCall({mode:'section',brief:(brief+LIST_NOTE).slice(0,1500),catalog:catalog(blk.id),styles:[page.style],current:{id:blk.id,fields:vals(blk)}});const b=(p.blocks||[]).find(x=>x.id===blk.id);if(!b)throw new Error('The AI returned nothing for this section.');
  Object.assign(blk.vals,toVals(def(blk.id),b.fields));commit();outline();render();say('Section rewritten. Undo brings the old words back.')}catch(e){say(e.message||'Rewrite failed');btn.disabled=false;btn.textContent='Rewrite this section'}}

/* ---------- generate a whole site: AI when it is on, otherwise the closest template filled with your words ---------- */
const KEYWORDS=[['coffee',/coffee|caf[eé]|bakery|bread|pastr(y|ies)|sourdough|roast(er|ery)|\btea\b/],['fitness',/fitness|\bgym\b|yoga|pilates|wellness|climb|run club|personal train/],['law',/\blaw\b|legal|solicitor|accountan|advis(or|er)|finance firm/],['realestate',/real estate|estate agent|letting|\bhomes?\b|property/],['wedding',/wedding|bride|celebrant|florist|ceremony/],['podcast',/podcast|youtuber|episode|creator/],['docs',/documentation|\bdocs\b|help cent(re|er)/],['conference',/conference|speakers|agenda|congress/],['restaurant',/restaurant|bistro|kitchen|menu|dinner|brunch|pizza|bar and|pub\b|diner/],['photographer',/photograph|camera|portrait|wedding photo|shoot/],['event',/event|conference|festival|meetup|summit|gig|concert|tickets/],['blog',/\bblog\b|writer|writing|journal|diary|newsletter|essays|notes from/],['shop',/\bshop\b|\bstore\b|product|boutique|handmade|e-?commerce|sell\b|gifts?\b/],['nonprofit',/charity|non-?profit|volunteer|foundation|donat|fundrais|community group/],['course',/course|teach|lessons?|learn|tutor|academy|school|class(es)?\b|training|workshops?/],['app',/\bapp\b|mobile|ios\b|android|download/],['saas',/saas|software|platform|dashboard|\bapi\b|startup|tool for|analytics|automation/],['agency',/agency|consult|firm\b|b2b|marketing|branding studio|digital/],['portfolio',/portfolio|designer|freelanc|illustrat|developer|artist|architect/],['studio',/studio|maker|craft|ceramic|pottery|sculpt|paper|workshop space|atelier/]];
function pickTemplate(brief){const t=brief.toLowerCase();let best=null,score=0;KEYWORDS.forEach(([id,re])=>{const m=t.match(new RegExp(re.source,'g'));const n=m?m.length:0;if(n>score){score=n;best=id}});return best||'portfolio'}
const sentence=s=>{s=s.trim().replace(/\s+/g,' ');return s?s[0].toUpperCase()+s.slice(1):s};
function briefBits(brief){const named=brief.match(/(?:called|named|is|for)\s+(?:the\s+)?([A-Z][\w&’' -]{1,28}?)(?=[,.:;]|\s+(?:a|an|the|is|that|which|in|with|who|from)\b|$)/);const first=brief.split(/(?<=[.!?])\s+/)[0].replace(/\s*[.!?]+$/,'');
 const short=first.split(/\s+/).length<=10?sentence(first)+'.':'';return {brand:named?named[1].trim():'',summary:sentence(brief.replace(/\s+/g,' ').trim()).slice(0,170),heading:short}}
function siteFromTemplate(brief){const id=pickTemplate(brief),t=(PB.templates||[]).find(x=>x.id===id)||PB.templates[0],raw=t.make(),bits=briefBits(brief);
 let json=JSON.stringify(raw);if(bits.brand&&raw.brand){json=json.split(raw.brand).join(bits.brand.replace(/["\\]/g,''))}
 const x=JSON.parse(json);if(bits.brand)x.brand=bits.brand.replace(/["\\]/g,'');
 const f=x.pages[0].blocks.find(b=>b.vals&&'intro' in b.vals);if(f&&bits.summary)f.vals.intro=bits.summary;
 const h=x.pages[0].blocks.find(b=>b.vals&&'heading' in b.vals&&['hero-image','hero-center','hero-film','hero-split','hero-3d','page-head'].includes(b.id));if(h&&bits.heading)h.vals.heading=bits.heading;
 x.settings=Object.assign({},x.settings,{description:bits.summary});x.name=(bits.brand||t.name);return {site:x,template:t}}
async function aiSiteGo(brief){const cat=catalog().filter(d=>!['nav','nav-center','announce','footer-columns','sec-footer'].includes(d.id));
 const p=await aiCall({mode:'site',brief:(brief+LIST_NOTE).slice(0,1500),catalog:cat,styles:aiStyleIds()});
 const pages=(p.pages||[]).map((pg,i)=>({id:i?undefined:'home',name:pg.name||'Page',title:pg.title,desc:pg.description,blocks:(pg.blocks||[]).filter(b=>def(b.id)&&!S.isTop(def(b.id))&&!S.isEnd(def(b.id))).map(b=>({id:b.id,vals:toVals(def(b.id),b.fields)}))})).filter(pg=>pg.blocks.length);
 if(!pages.length)throw new Error('The AI returned no pages. Try a more specific brief.');
 const sid=String(p.style||'').split('|')[0],brand=(p.brand||'My site').slice(0,40),last=pages[pages.length-1];
 return S.normalize({name:brand,brand,style:PB.styles.has(sid)?sid:'studio',pages:pages.map((pg,i)=>({...pg,id:pg.id||'p'+i})),
  header:[{id:'nav',vals:{cta:p.cta||'Get in touch',ctaHref:'page:'+(last.id||'p'+(pages.length-1))}}],footer:[{id:'footer-columns',vals:{line:(p.description||'').slice(0,80),c1:'Pages',links1:pages.map(x=>x.name).join('\n'),c2:'',links2:'',c3:'',links3:'',legal:'© '+new Date().getFullYear()+' '+brand}}],
  settings:{description:(p.description||pages[0].desc||'').slice(0,300)},navAuto:true,fresh:true},def)}
$('#aiGo').onclick=async()=>{const brief=$('#aiBrief').value.trim();if(!brief){say('Describe the site first');$('#aiBrief').focus();return}
 if($('#aiKeep').checked&&aiOn)return aiPageGo();
 const go=$('#aiGo');go.disabled=true;$('#aiOut').textContent=aiOn?'Writing your site…':'Building from the closest template…';
 try{let ns,note;
  if(aiOn){ns=await aiSiteGo(brief);note='Done. It is a new site, so your current one is untouched.'}
  else{const r=siteFromTemplate(brief);ns=S.normalize(r.site,def);note='The AI is off, so this is the '+r.template.name+' template with your name and words. Edit anything on the canvas.'}
  store.pages[ns.id]=ns;switchTo(ns.id);$('#aiOut').textContent=note;say('Site ready');showPane('preview')}
 catch(e){$('#aiOut').textContent=e.message||'Something went wrong.'}go.disabled=false};

/* ---------- keyboard ---------- */
document.addEventListener('keydown',e=>{const mod=e.metaKey||e.ctrlKey;if(!mod)return;const inField=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);if(inField)return;
 if(e.key.toLowerCase()==='z'&&!e.shiftKey){e.preventDefault();undo()}else if((e.key.toLowerCase()==='z'&&e.shiftKey)||e.key.toLowerCase()==='y'){e.preventDefault();redo()}});
$('#undoBtn').onclick=undo;$('#redoBtn').onclick=redo;

/* ---------- refresh ---------- */
function refresh(){pageSelUI();outline();render();if(rtabCur==='style')styles();if(rtabCur==='page')pagesPanel();if(rtabCur==='site')sitePanel()}
function imagesList(){$('#pbImages').innerHTML=LIB.images.map(i=>`<option value="${esc(i)}">`).join('')}

/* ---------- async sources (read-only) ---------- */
const usesIcons=()=>[...site.header,...site.footer,...site.pages.flatMap(p=>p.blocks)].some(b=>b.id==='x-icons')||site.settings.favicon.set!=='glyphs';
PB.loadIcon=(fam,file)=>{const k=fam+'/'+file;if(PB.loadIcon.p[k])return;PB.loadIcon.p[k]=fetch('icons/'+fam+'/'+file).then(r=>r.ok?r.text():'').then(t=>{t=t.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/\son\w+="[^"]*"/gi,'').replace(/<\?xml[^>]*>/,'').trim();
 if(t.startsWith('<svg')){PB.iconCache[k]=t.replace('<svg ','<svg aria-hidden="true" width="28" height="28" ');clearTimeout(PB.loadIcon.t);PB.loadIcon.t=setTimeout(()=>{if(usesIcons())render();if(ltab==='icons')library()},120)}}).catch(()=>{})};PB.loadIcon.p={};
/* warm the icon cache once the page is idle (sections still load their own icons on demand) */
{const warm=()=>Object.entries(LIB.iconFiles).forEach(([f,list])=>list.filter(x=>x.endsWith('.svg')).forEach(x=>PB.loadIcon(f,x)));const idle=()=>(window.requestIdleCallback||setTimeout)(warm,{timeout:4000});if(document.readyState==='complete')setTimeout(idle,2500);else addEventListener('load',()=>setTimeout(idle,2500),{once:true});}
fetch('expansion.json').then(r=>r.json()).then(j=>{const E=j.entries||[];PB.designSystems=E.filter(e=>/^D\d+/.test(e.id)&&e.tokens);PB.effects=E.filter(e=>/^L\d+/.test(e.id)&&e.film&&e.film.src);PB.styles.build();if(!PB.styles.has(page.style))page.style='studio';styles();status();if(ltab==='media')library();render()}).catch(()=>{});
fetch('backgrounds.js').then(r=>r.text()).then(t=>{const m=t.match(/const FRAG=`([\s\S]*?)`;/);if(m&&/void main/.test(m[1])){PB.bgFrag=m[1];render();if(ltab==='media')library()}}).catch(()=>{});

PB.dbg=()=>({hist:hist.map(h=>JSON.parse(h).blocks.length),fut:fut.length,last:JSON.parse(lastSnap).blocks.length,now:page.blocks.length});
/* ---------- hooks for builder/ux.js ---------- */
PB.app={saveToProjects,hasProject,setZoom,get zoom(){return ZOOM},addBlockAfter:(id,v,uid,where,extra)=>{addTarget={uid,where:where||'after'};return addBlock(id,v,null,extra)},get site(){return site},get store(){return store},get curId(){return curId},get csel(){return csel},get open(){return open},set open(v){open=v},get first(){return !persistedOnce&&!hasSaved},
 def,B,isX,uidGen,clone,addBlock,render,commit,commitSoon,outline,refresh,say,switchTo,findBlk,goPage,openPicker,siteChanged,showPane,rtab,persist,saved,curPage,blank,S,TEMPLATES,siteFromTemplate,aiSiteGo,get aiOn(){return aiOn},aiStatus,dupBlk,rmBlk,move,toAgent,compose,assemble,swapA,thumbHTML,thumbW,mountThumbs,fieldsOf,val,vals,undo,redo,xLabel,setW,setMode,get EDIT(){return EDIT},status,histSnapshot:()=>lastSnap,restoreSnap:s=>{clearTimeout(typing);commit();hist.push(lastSnap);fut=[];restore(s);histUI()},UI:ui,saveUI,pv,runCheck,libraryRedraw:()=>library(),copy,dl,setS,pickDraw:()=>pickDraw(),selectBlock:uid=>{const f=findBlk(uid);if(!f)return;csel={uid,kind:'section'};open=uid;outline();toAgent({pb:'reselect',uid,kind:'section'});scrollPreviewTo(uid)},clearSel:()=>{csel=null;hideTb();toAgent({pb:'clear'})}};
/* ---------- boot ---------- */
try{const CLX=PB.src.CL();if(CLX){const st=document.createElement('style');st.textContent=CLX.css();document.head.append(st)}}catch(e){}
PB.styles.build();if(!PB.styles.has(page.style)&&!/^ds:/.test(page.style))page.style='studio';
PB.images.load().then(n=>{if(n)render()});if(PB.photos)PB.photos.load().then(()=>{if(ltab==='photos')library()});imagesList();libTabs();library();rtab(rtabCur);refresh();histUI();showPane(ui.pane||'page');
document.body.classList.add('ready');
})();
