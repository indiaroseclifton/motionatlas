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
const GK=new Set(['navSeed','id','name','brand','style','pair','updated','home','pages','header','footer','navAuto','nav','settings','tokens']);
const curPage=()=>site.pages.find(p=>p.id===curId)||site.pages[0];
const page=new Proxy({},{get:(_,k)=>GK.has(k)?site[k]:curPage()[k],set:(_,k,v)=>{(GK.has(k)?site:curPage())[k]=v;return true}});
function blank(){return S.normalize({name:'Untitled site',brand:'Brand',style:'studio',blocks:[]},def)}
function loadStore(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.pages&&Object.keys(s.pages).length){Object.keys(s.pages).forEach(k=>{s.pages[k]=S.normalize(s.pages[k],def)});return s}}catch(e){}
 const s={cur:null,pages:{}};let first=null;
 try{const o=JSON.parse(localStorage.getItem(OLD));if(o&&o.blocks){first=S.normalize({name:o.brand||'My site',brand:o.brand,title:o.title,style:o.style||'noir',blocks:o.blocks},def)}}catch(e){}
 if(!first)first=S.normalize(TEMPLATES[0](),def);
 s.pages[first.id]=first;s.cur=first.id;return s}
function persist(){site.updated=Date.now();try{localStorage.setItem(KEY,JSON.stringify(store));saved('Saved in this browser')}catch(e){saved('Could not save: storage is full or blocked')}}
function saved(t){const el=$('#saveState');if(el)el.textContent=t}
store=loadStore();site=store.pages[store.cur]||Object.values(store.pages)[0];store.cur=site.id;curId=site.home;
const ui=(()=>{try{return JSON.parse(localStorage.getItem(UIKEY))||{}}catch(e){return {}}})();
const saveUI=()=>{try{localStorage.setItem(UIKEY,JSON.stringify(ui))}catch(e){}};

/* ---------- history ---------- */
const snap=()=>JSON.stringify({...site,updated:0});
lastSnap=snap();
function commit(){const s=snap();if(s===lastSnap)return;hist.push(lastSnap);if(hist.length>80)hist.shift();fut=[];lastSnap=s;persist();histUI()}
let typing=0;function commitSoon(){clearTimeout(typing);typing=setTimeout(commit,600)}
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
function fill(str,blk,A){const d=def(blk.id),keys=new Set(fieldsOf(d).map(f=>f.k));
 str=str.replace(/\{\{each:(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,(m,k,body)=>rows(val(blk,k)).map((cells,i)=>body.replace(/\{\{n\}\}|\{\{(g|i|t|list)?(\d+)\}\}/g,(mm,kind,num)=>{if(mm==='{{n}}')return String(i+1);const c=cells[+num]||'';
  if(!kind)return esc(c);if(kind==='g')return glyph(c);if(kind==='i')return esc(initials(c));if(kind==='t')return tick(c);return c.split(';').map(x=>x.trim()).filter(Boolean).map(x=>'<li>'+esc(x)+'</li>').join('')})).join(''));
 return str.replace(/\{\{(\w+)\}\}/g,(m,k)=>{if(k==='A')return A;if(k==='brand')return esc(page.brand||'Brand');if(k==='formAction')return esc(CTX&&CTX.mode==='preview'?'#':(site.settings.formAction||'#'));if(k==='home')return esc(CTX?CTX.pageHref(S.pageOf(site,site.home)):'#');
  if(k==='menu'||k==='menuL'||k==='menuR'){const it=S.menu(site),h=Math.ceil(it.length/2),sub=k==='menu'?it:k==='menuL'?it.slice(0,h):it.slice(h);return CTX?S.menuHTML(site,sub,CTX,esc):''}
  if(!keys.has(k))return m;const f=fieldsOf(d).find(f=>f.k===k);if(f.type==='link')return esc(CTX?S.href(site,val(blk,k),CTX):'#');if(f.type==='image'&&/^user:[\w-]+$/.test(val(blk,k)))return '\u0002U:'+val(blk,k).slice(5)+'\u0002';
  return esc(f.type==='list'?rows(val(blk,k)).map(r=>r.join(' ')).join(', '):val(blk,k))})}

/* ---------- compose ---------- */
const AT='\u0001A/';
const cache={cl:null,ix:{}};
let CTX=null;
const newAcc=()=>({css:new Map(),fonts:new Set(),files:new Map()});
const pageHrefFor=mode=>p=>mode==='preview'?'#pb-page:'+p.id:S.pageFile(site,p);
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
const buildCSS=(st,acc)=>':root{'+st.vars+'}\n'+(st.face||'')+LIB.base+'.h{text-transform:var(--case,none)}\n'+[...acc.css.values()].join('\n');
const fontURLOf=acc=>acc.fonts.size?'https://fonts.googleapis.com/css2?'+[...acc.fonts].join('&')+'&display=swap':'';
function compose(mode,pg,acc,opt){ // mode: preview | html | zip  -> parts for one page (header + page + footer). acc shares css/fonts/files between pages.
 pg=pg||curPage();acc=acc||newAcc();
 const base=mode==='preview'?ABS:SITE;const pair=page.pair>=0?LIB.pairs[page.pair]:null;
 const st=withTokens(PB.styles.resolve(page.style,pair,base),acc);
 const css=acc.css,fonts=acc.fonts,files=acc.files,needs=new Map(),body=[],js=[];
 (st.fonts||'').split('&').filter(Boolean).forEach(f=>fonts.add(f));
 CTX={mode,current:pg.id,pageHref:pageHrefFor(mode)};
 const ctx={mode,A:AT,site:base,uid:'',home:CTX.pageHref(S.pageOf(site,site.home)),need:(k,v)=>{if(!needs.has(k))needs.set(k,v)},font:q=>{(q||'').split('&').filter(Boolean).forEach(f=>fonts.add(f))},
  interactionSrc:id=>{if(mode==='preview')return `src="${ABS}interactions/demos/${esc(id)}.html"`;const t=cache.ix[id];
   if(mode==='zip'&&t){files.set('interactions/'+id+'.html',t);return `src="interactions/${esc(id)}.html"`}
   if(mode==='html'&&t)return `srcdoc="${t.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"`;return `src="${SITE}interactions/demos/${esc(id)}.html"`}};

 [...(opt&&opt.solo?[]:site.header).map(b=>[b,'header']),...pg.blocks.map(b=>[b,'page']),...(opt&&opt.solo?[]:site.footer).map(b=>[b,'footer'])].forEach(([blk,zone])=>{const d=def(blk.id);if(!d)return;ctx.uid=blk.uid;let html='',bjs='';
  try{if(isX(blk.id)){const r=d.render(vals(blk),ctx)||{};html=r.html||'';bjs=r.js||'';(r.css||[]).forEach(([k,c])=>{if(!css.has(k))css.set(k,c)});if(!css.has('x-base'))css.set('x-base',PB.extraBase)}
   else{html=fill(mode==='preview'?PB.canvas.mark(d):d.html,blk,AT);bjs=d.js?fill(d.js,blk,AT):'';if(!css.has('b:'+d.id))css.set('b:'+d.id,d.css)}}
  catch(e){console.warn('Page builder: block failed',blk.id,e);html='<section class="wrap"><p>This section could not be drawn.</p></section>'}
  html=anchors(S.linkPages(site,html.split(AT+'http').join('http'),CTX,esc),blk,mode);
  html=html.replace(/\u0001A\/\u0002U:([\w-]+)\u0002|\u0002U:([\w-]+)\u0002/g,(m,a,b)=>upURL(a||b,mode,acc));
  const sb=PB.sec.build(blk,{mode,A:AT,asset:v=>/^user:/.test(v)?upURL(v.slice(5),mode,acc):AT+v});
  if(sb.css)css.set('set:'+blk.uid,sb.css);if(sb.rt)ctx.need(sb.rt,PB.sec.runtime[sb.rt]);
  if(!css.has('pb-base'))css.set('pb-base',PB.sec.base);
  const sticky=S.isTop(d)&&d.id!=='announce';
  body.push(`<div class="b-${isX(blk.id)?'x':d.id}${sticky?' pb-sticky':''}${sb.cls?' '+sb.cls:''}" id="${blk.uid}"${mode==='preview'?' data-pb data-zone="'+zone+'" data-name="'+esc(d.name)+'"':''}>${sb.inner}${sb.flip?`<div class="pb-in" style="${sb.flip}">${html}</div>`:html}</div>`);
  if(bjs)js.push(`(()=>{const root=document.getElementById(${JSON.stringify(blk.uid)});if(!root)return;try{${bjs}}catch(e){console.error(e)}})();`)});
 const rt=[];let cl=false;
 needs.forEach((v,k)=>{if(v&&v.componentLab)cl=true;else rt.push(v)});
 return {st,acc,pg,cssText:buildCSS(st,acc),body:body.join('\n'),runtime:rt.join('\n'),js:js.join('\n'),cl,fontURL:fontURLOf(acc),files,mode};
}
/* anchors: per-link overrides (blk.links[index]) and preview ids */
function anchors(html,blk,mode){let i=0;return html.replace(/<a\s([^>]*)>/g,(m,attrs)=>{const idx=i++;const ov=blk.links&&blk.links[idx];let a=attrs;
  if(ov!==undefined){const h='href="'+esc(S.href(site,ov,CTX))+'"';a=/href="[^"]*"/.test(a)?a.replace(/href="[^"]*"/,h):h+' '+a}
  if(mode==='preview')a+=` data-pba="${idx}"`;return '<a '+a+'>'})}
const dcache=new Map();
function upURL(id,mode,acc){if(mode==='preview')return PB.images.url(id);if(mode==='zip'){(acc.uploads=acc.uploads||new Set()).add(id);return 'assets/uploads/'+id+'.'+PB.images.ext(id)}return dcache.get(id)||''}
const ogURL=v=>!v?'':/^(https?:|data:)/.test(v)?v:SITE+'assets/'+v.replace(/^\/+/,'');
function assemble(P,opt={}){ // opt: {cssHref, jsHref, clSrc, clInline, favHref, canonical, title}
 const pg=P.pg,stg=site.settings,pre=P.mode==='preview',home=pg.id===site.home;
 const title=opt.title||pg.title||(home?(site.brand||pg.name):pg.name+' · '+(site.brand||''));
 const desc=pg.desc||stg.description||'',og=ogURL(pg.og||stg.ogImage);
 let head=`<!doctype html>\n<html lang="${esc(stg.lang||'en')}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${esc(title)}</title>\n`;
 if(!pre){head+=(desc?`<meta name="description" content="${esc(desc)}">\n`:'')+`<meta property="og:title" content="${esc(title)}">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="${esc(site.brand||'')}">\n`+(desc?`<meta property="og:description" content="${esc(desc)}">\n`:'')+(og?`<meta property="og:image" content="${esc(og)}">\n<meta name="twitter:card" content="summary_large_image">\n`:'<meta name="twitter:card" content="summary">\n')+(pg.noindex?'<meta name="robots" content="noindex">\n':'')+(opt.canonical?`<link rel="canonical" href="${esc(opt.canonical)}">\n<meta property="og:url" content="${esc(opt.canonical)}">\n`:'')+(opt.favHref?`<link rel="icon" href="${esc(opt.favHref)}" type="image/svg+xml">\n`:'')}
 head+=(P.fontURL?`<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="${P.fontURL}">\n`:'')+
  (pre?'':`<!-- Built with the Visual & Motion Atlas site builder. Style: ${esc(P.st.style.name)}. -->\n`)+(opt.cssHref?`<link rel="stylesheet" href="${opt.cssHref}">`:`<style>\n${P.cssText}\n</style>`)+(!pre&&stg.analytics?'\n'+stg.analytics+'\n':'')+'</head><body>\n';
 let scripts='';
 if(P.cl){scripts+=opt.clInline?`<script>${opt.clInline.replace(/<\/script/gi,'<\\/script')}<\/script>\n`:`<script src="${opt.clSrc||SITE+'component-lab.js'}"><\/script>\n`;
  scripts+=`<script>/* wake the component behaviours */document.body.appendChild(document.createElement('span')).hidden=true;<\/script>\n`}
 const code=(P.runtime?P.runtime+'\n':'')+P.js;
 if(code)scripts+=opt.jsHref?`<script src="${opt.jsHref}"><\/script>\n`:`<script>\n${code.replace(/<\/script/gi,'<\\/script')}\n<\/script>\n`;
 if(pre&&!opt.noagent)scripts+=`<script>window.__PB_EDIT=${opt.edit?'true':'false'};${PB.agentSrc}<\/script>\n`;
 return head+P.body+'\n'+scripts+'</body></html>\n';
}
const swapA=(s,base)=>s.split(AT).join(base);

/* ---------- preview ---------- */
const pv=$('#pv');let rt=0,lastY=0,jump=null;
let editingText=false,rendPending=false;
function render(){clearTimeout(rt);rt=setTimeout(()=>{if(editingText){rendPending=true;return}try{lastY=pv.contentWindow.scrollY||0}catch(e){}const P=compose('preview');pv.srcdoc=swapA(assemble(P,{clSrc:ABS+'component-lab.js',edit:EDIT}),ABS+'assets/');status()},160)}
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
function addBlock(id,valsIn,at){if(!def(id))return;const b={uid:uidGen(),id,vals:valsIn||{}};let list=listFor(id),i=-1;
 if(addTarget){const t=findBlk(addTarget.uid),w=addTarget.where;addTarget=null;if(t&&t.list===list){i=t.i+(w==='before'?0:1)}}
 if(i<0&&at!=null)i=dropAt(at,list);if(i<0)i=placeIndex(id);
 list.splice(i,0,b);open=b.uid;commit();outline();render();jump=b.uid;say('Added '+def(id).name+(list===page.blocks?'':list===site.header?' to the header (every page)':' to the footer (every page)'));return b}
function move(list,i,j){if(j<0||j>=list.length||i===j)return;const [b]=list.splice(i,1);list.splice(j,0,b);commit();outline();render()}

/* ---------- outline + editor ---------- */
function outline(){const ol=$('#ol');ol.innerHTML='';
 lists().forEach(([kind,list])=>{const h=document.createElement('li');h.className='grp';h.innerHTML=kind==='page'?`<b>This page: ${esc(curPage().name)}</b>`:`<b>${kind==='header'?'Header':'Footer'}</b><small>Shown on every page</small>`;ol.append(h);
  if(!list.length){const e=document.createElement('li');e.className='empty';e.textContent=kind==='page'?'No sections yet. Add some from the library, or drag them here.':kind==='header'?'No header yet. Add a navigation bar from the library.':'No footer yet. Add a footer from the library.';ol.append(e)}
  list.forEach((blk,i)=>ol.append(outRow(blk,list,i)))});
 status()}
function outRow(blk,list,i){const d=def(blk.id);const li=document.createElement('li');li.className='blk'+(open===blk.uid?' open':'');li.dataset.uid=blk.uid;li.draggable=true;
  const sub=isX(blk.id)?xLabel(blk):d.group;
  li.innerHTML=`<div class="bh"><span class="grip" aria-hidden="true">⋮⋮</span><button class="bname" aria-expanded="${open===blk.uid}" aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown" title="Alt + ↑/↓ moves this section"><b>${esc(d.name)}</b><small>${esc(sub)}</small></button>
   <button class="ib" data-a="up" aria-label="Move ${esc(d.name)} up"${i?'':' disabled'}>↑</button><button class="ib" data-a="down" aria-label="Move ${esc(d.name)} down"${i<list.length-1?'':' disabled'}>↓</button><button class="ib" data-a="dup" aria-label="Duplicate ${esc(d.name)}">⧉</button><button class="ib" data-a="rm" aria-label="Remove ${esc(d.name)}">✕</button></div>`;
  if(open===blk.uid)li.append(editor(blk));
  const nb=li.querySelector('.bname');
  nb.onclick=()=>{open=open===blk.uid?null:blk.uid;outline();if(open)scrollPreviewTo(blk.uid);const again=$(`#ol [data-uid="${blk.uid}"] .bname`);again&&again.focus()};
  nb.onkeydown=e=>{if(e.altKey&&(e.key==='ArrowUp'||e.key==='ArrowDown')){e.preventDefault();const j=e.key==='ArrowUp'?i-1:i+1;if(j<0||j>=list.length)return;move(list,i,j);say(d.name+' moved to position '+(j+1));const el=$(`#ol [data-uid="${blk.uid}"] .bname`);el&&el.focus()}};
  li.querySelectorAll('.ib').forEach(b=>b.onclick=()=>{const a=b.dataset.a;
   if(a==='rm'){list.splice(i,1);if(open===blk.uid)open=null;commit();outline();render();say('Removed '+d.name+'. Undo brings it back.');const n=$$('#ol .blk')[Math.min(i,$$('#ol .blk').length-1)];(n?n.querySelector('.bname'):$('#libSearch')).focus();return}
   if(a==='dup'){const c={uid:uidGen(),id:blk.id,vals:clone(blk.vals)};list.splice(i+1,0,c);commit();outline();render();say('Duplicated '+d.name);return}
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
 if(S0.bg==='image'||S0.bg==='film'){const id='f'+(++fid),w=document.createElement('div');w.className='f';const l=document.createElement('label');l.htmlFor=id;l.textContent=S0.bg==='film'?'Background film':'Background image';
  if(S0.bg==='film'){const s=document.createElement('select');s.id=id;[['','Choose a film'],...LIB.films.map(n=>[n,n.replace(/-/g,' ')])].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;s.append(o)});s.value=S0.bgv||'';s.onchange=()=>setS(blk,'bgv',s.value);w.append(l,s)}
  else{const i=document.createElement('input');i.id=id;i.setAttribute('list','pbImages');i.placeholder='Pick a library image or paste a path';i.value=/^user:/.test(S0.bgv||'')?'(uploaded image)':S0.bgv||'';i.onchange=()=>setS(blk,'bgv',i.value.trim());const up=document.createElement('button');up.type='button';up.className='btn small';up.textContent='Upload an image';const fi=document.createElement('input');fi.type='file';fi.accept='image/*';fi.hidden=true;fi.setAttribute('aria-label','Choose a background image file');up.onclick=()=>fi.click();fi.onchange=async()=>{if(fi.files[0]){const id2=await PB.images.add(fi.files[0]);setS(blk,'bgv','user:'+id2,true)}};w.append(l,i,up,fi)}
  box.append(w);
  const oid='f'+(++fid),ow=document.createElement('div');ow.className='f';ow.innerHTML=`<label for="${oid}">Tint over the background: <output>${S0.ov>=0&&S0.ov!=null?S0.ov:55}%</output></label><input id="${oid}" type="range" min="0" max="90" step="5" value="${S0.ov>=0&&S0.ov!=null?S0.ov:55}">`;const r=ow.querySelector('input');r.oninput=()=>{ow.querySelector('output').textContent=r.value+'%'};r.onchange=()=>{blk.set=blk.set||{};blk.set.ov=+r.value;commit();render()};box.append(ow)}
 const hs=document.createElement('fieldset');hs.className='hidef';hs.innerHTML='<legend>Hide on</legend>';[['d','Desktop'],['t','Tablet'],['p','Phone']].forEach(([k,t])=>{const lb=document.createElement('label');lb.className='check';const c=document.createElement('input');c.type='checkbox';c.checked=!!(S0.hide&&S0.hide[k]);c.onchange=()=>{blk.set=blk.set||{};const h=Object.assign({},blk.set.hide);if(c.checked)h[k]=1;else delete h[k];if(Object.keys(h).length)blk.set.hide=h;else delete blk.set.hide;if(!Object.keys(blk.set).length)delete blk.set;commit();render()};lb.append(c,' '+t);hs.append(lb)});box.append(hs);
 const bpd=document.createElement('details');bpd.className='setd bpd';if(S0.t||S0.p)bpd.open=true;bpd.innerHTML='<summary>Tablet and phone tweaks</summary>';const bpb=document.createElement('div');bpb.className='setb';bpd.append(bpb);
 [['t','Tablet (641 to 1024 px)'],['p','Phone (up to 640 px)']].forEach(([bp,title])=>{const h=document.createElement('p');h.className='hint';h.textContent=title;bpb.append(h);
  [['Spacing',PB.sec.SPACING,'pad'],['Width',PB.sec.WIDTH,'width'],['Alignment',PB.sec.ALIGN,'align']].forEach(([label,opts,key])=>{const id='f'+(++fid),w=document.createElement('div');w.className='f';const l=document.createElement('label');l.htmlFor=id;l.textContent=label;const sl=document.createElement('select');sl.id=id;[['','Same as desktop'],...opts.filter(o=>o[0]!==''&&!(key==='pad'&&false))].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;sl.append(o)});sl.value=(S0[bp]||{})[key]||'';sl.onchange=()=>{blk.set=blk.set||{};const x=Object.assign({},blk.set[bp]);if(sl.value)x[key]=sl.value;else delete x[key];if(Object.keys(x).length)blk.set[bp]=x;else delete blk.set[bp];if(!Object.keys(blk.set).length)delete blk.set;commit();render()};w.append(l,sl);bpb.append(w)})});box.append(bpd);
 sel('Reveal animation',PB.sec.ANIM,'anim');
 const rs=document.createElement('button');rs.type='button';rs.className='btn small';rs.textContent='Reset settings';rs.onclick=()=>{delete blk.set;commit();outline();render()};box.append(rs);return det}

function editor(blk){const d=def(blk.id),bb=document.createElement('div');bb.className='bb';bb.innerHTML=`<p class="hint">${esc(d.desc)}</p>`;bb.append(settingsUI(blk));
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
  if(f.type==='image'){const h=document.createElement('p');h.className='hint';h.textContent='Pick a library image or paste any image URL.';wrap.append(h)}
  bb.append(wrap)});
 if(!fieldsOf(d).length)bb.insertAdjacentHTML('beforeend','<p class="hint">This section uses the brand name and has no other words to edit.</p>');
 const tools=document.createElement('div');tools.className='btools';
 if(!isX(blk.id)||blk.id==='x-background'||blk.id==='x-kitbg'){const ai=document.createElement('button');ai.className='btn small';ai.type='button';ai.textContent='Rewrite with AI';ai.onclick=()=>aiSection(blk,ai);tools.append(ai)}
 const rs=document.createElement('button');rs.className='btn small';rs.type='button';rs.textContent='Reset words';rs.onclick=()=>{blk.vals={...(blk.id==='x-component'?{cid:blk.vals.cid}:{}),...(['x-interaction','x-background','x-kitbg','x-kitasset','x-icons','x-effect'].includes(blk.id)?Object.fromEntries(Object.entries(blk.vals).filter(([k])=>['iid','bg','kit','asset','family','lid'].includes(k))):{})};commit();outline();render();say('Back to the default words')};tools.append(rs);
 bb.append(tools);return bb}

/* ---------- canvas controller: selection, in-place editing, floating toolbar ---------- */
let EDIT=ui.edit!==false,csel=null,addTarget=null;
const stage=document.querySelector('main.stage'),tb=$('#cvTb');
function setMode(edit){EDIT=edit;ui.edit=edit;saveUI();$$('#modeSeg button').forEach(b=>b.setAttribute('aria-pressed',(b.dataset.m==='edit')===edit));if(!edit)csel=null;hideTb();render()}
$$('#modeSeg button').forEach(b=>{b.onclick=()=>setMode(b.dataset.m==='edit');b.setAttribute('aria-pressed',(b.dataset.m==='edit')===EDIT)});
function hideTb(){tb.hidden=true;if(typeof closePop==='function')closePop()}
function toAgent(m){try{pv.contentWindow.postMessage(m,'*')}catch(e){}}
function applyText(m){const f=findBlk(m.uid);if(!f)return;const blk=f.blk;
 if(m.r!=null){const r=rows(val(blk,m.k)),ri=+m.r-1,ci=+m.c;if(!r[ri])return;while(r[ri].length<=ci)r[ri].push('');r[ri][ci]=m.v.replace(/\|/g,'/');blk.vals[m.k]=r.map(x=>x.join(' | ')).join('\n')}
 else blk.vals[m.k]=m.v;commitSoon();status()}
function tbBtn(label,aria,fn,dis){const b=document.createElement('button');b.type='button';b.className='tbb';b.textContent=label;b.setAttribute('aria-label',aria);b.title=aria;if(dis)b.disabled=true;b.onclick=fn;return b}
function buildTb(){const f=csel&&findBlk(csel.uid);if(!f||!EDIT){hideTb();return null}
 const d=def(f.blk.id);tb.innerHTML='';const name=document.createElement('span');name.className='tbn';name.textContent=d.name+(f.kind==='page'?'':' · shared');tb.append(name);
 const L=f.list,i=f.i;
 elGroup(f).forEach(b=>tb.append(b));
 tb.append(tbBtn('↑','Move section up',()=>move(L,i,i-1),i===0),tbBtn('↓','Move section down',()=>move(L,i,i+1),i===L.length-1),tbBtn('⧉','Duplicate section',()=>dupBlk(csel.uid)),tbBtn('✕','Delete section',()=>rmBlk(csel.uid)),tbBtn('⚙','Section settings and words',()=>{open=csel.uid;showPane('page');rtab('page');outline();const el=$(`#ol [data-uid="${csel.uid}"]`);el&&el.scrollIntoView({block:'nearest'})}),tbBtn('＋','Add a section after this one',()=>askAdd(csel.uid,'after')));
 return f}
function placeTb(m){if(!EDIT||!csel||!m){hideTb();return}const f=buildTb();if(!f)return;tb.hidden=false;
 const ir=pv.getBoundingClientRect(),sr=stage.getBoundingClientRect(),r=m.el||m.sec;if(!r||r.top+r.height<0||r.top>ir.height){hideTb();return}
 const h=tb.offsetHeight||40,w=tb.offsetWidth||260,top0=ir.top-sr.top;let y=ir.top-sr.top+r.top-h-8;if(y<top0+4)y=top0+Math.max(r.top,0)+8;
 let x=ir.left-sr.left+Math.max(r.left,0);x=Math.max(8,Math.min(x,sr.width-w-8));tb.style.left=x+'px';tb.style.top=Math.min(y,sr.height-h-8)+'px'}
function dupBlk(uid){const f=findBlk(uid);if(!f)return;const c={uid:uidGen(),id:f.blk.id,vals:clone(f.blk.vals)};if(f.blk.set)c.set=clone(f.blk.set);if(f.blk.links)c.links=clone(f.blk.links);f.list.splice(f.i+1,0,c);csel=null;open=c.uid;commit();outline();render();say('Duplicated '+def(f.blk.id).name)}
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
function imgPop(f){const blk=f.blk,d=def(blk.id),key=csel.k;const w=document.createElement('div');w.className='ppb';
 const up=document.createElement('button');up.type='button';up.className='btn small pk';up.textContent='Upload from your device';const fi=document.createElement('input');fi.type='file';fi.accept='image/*';fi.hidden=true;fi.setAttribute('aria-label','Choose an image file');
 up.onclick=()=>fi.click();fi.onchange=async()=>{const file=fi.files[0];if(!file)return;if(file.size>25e6)return say('Choose an image under 25 MB');try{const id=await PB.images.add(file);blk.vals[key]='user:'+id;commit();render();closePop();say('Image replaced. It is saved in this browser.')}catch(e){say('Could not read that image')}};
 const q=document.createElement('input');q.type='search';q.placeholder='Search the atlas images';q.setAttribute('aria-label','Search the atlas images');
 const g=document.createElement('div');g.className='pgrid';
 const draw=()=>{const t=q.value.trim().toLowerCase();g.innerHTML='';LIB.images.filter(i=>!t||i.toLowerCase().includes(t)).slice(0,90).forEach(i=>{const b=document.createElement('button');b.type='button';b.className='pimg';b.title=i;b.setAttribute('aria-label','Use '+i);b.innerHTML=`<img src="assets/${esc(i)}" alt="" loading="lazy">`;b.onclick=()=>{blk.vals[key]=i;commit();render();closePop()};g.append(b)})};
 q.oninput=draw;draw();w.append(up,fi,q,g);
 const altF=fieldsOf(d).find(x=>x.k==='alt');if(altF){const l=document.createElement('label');l.className='f';l.textContent='Describe the image (alt text)';const ai=document.createElement('input');ai.value=val(blk,'alt');ai.oninput=()=>{blk.vals.alt=ai.value;commitSoon();render()};l.append(ai);w.append(l)}
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
  case 'move':{const f=findBlk(m.uid);if(!f)break;let t=m.before?f.list.findIndex(b=>b.uid===m.before):f.list.length;if(t<0)break;move(f.list,f.i,t>f.i?t-1:t);break}
  case 'key':{if(!csel)break;const f=findBlk(csel.uid);
   if(m.key==='Escape'){csel=null;hideTb();toAgent({pb:'clear'})}
   else if(!f)break;else if(m.key==='Delete'||m.key==='Backspace')rmBlk(csel.uid);
   else if(m.alt&&m.key==='ArrowUp')move(f.list,f.i,f.i-1);else if(m.alt&&m.key==='ArrowDown')move(f.list,f.i,f.i+1);
   else if(m.mod&&/^d$/i.test(m.key))dupBlk(csel.uid);else if(m.mod&&/^k$/i.test(m.key))askAdd(csel.uid,'after');
   else if(m.mod&&/^z$/i.test(m.key)&&!m.shift)undo();else if(m.mod&&(/^y$/i.test(m.key)||(m.shift&&/^z$/i.test(m.key))))redo();break}}});
pv.addEventListener('load',()=>{lastRects=null;editingText=false;if(!csel||!findBlk(csel.uid)){csel=null;hideTb()}});
addEventListener('resize',()=>placeTb(lastRects));

/* ---------- section thumbnails and the section picker ---------- */
const thumbCache=new Map();
function thumbHTML(id){const key=page.style+'|'+page.pair+'|'+JSON.stringify(site.tokens||{})+'|'+id;if(thumbCache.has(key))return thumbCache.get(key);
 let h='';try{const P=compose('preview',{id:'__t',name:'t',blocks:[{uid:'tb'+id.replace(/\W/g,''),id,vals:{}}]},undefined,{solo:true});h=swapA(assemble(P,{noagent:true,clSrc:ABS+'component-lab.js'}),ABS+'assets/').replace(/\sautoplay\b/g,'').replace(/<video /g,'<video preload="none" ')}catch(e){h=''}
 thumbCache.set(key,h);if(thumbCache.size>160)thumbCache.delete(thumbCache.keys().next().value);return h}
let thIO=null;
function mountThumbs(root,scroller){if(!('IntersectionObserver' in window))return;if(thIO)thIO.disconnect();
 thIO=new IntersectionObserver(es=>es.forEach(e=>{const box=e.target;if(!e.isIntersecting||box.firstChild)return;const f=document.createElement('iframe');f.tabIndex=-1;f.setAttribute('aria-hidden','true');f.setAttribute('inert','');f.title='';f.style.transform='scale('+(box.clientWidth/1200)+')';f.srcdoc=thumbHTML(box.dataset.sth);box.append(f);thIO.unobserve(box)}),{root:scroller,rootMargin:'160px'});
 root.querySelectorAll('[data-sth]').forEach(b=>thIO.observe(b))}
const pk=$('#picker');let pkGroup='All',pkTarget=null;
function openPicker(target){pkTarget=target;$('#pickQ').value='';pkGroup='All';pickDraw();pk.showModal();$('#pickQ').focus()}
function pickDraw(){const all=[...LIB.blocks,PB.extraById['x-type']],gs=['All',...GROUPS.filter(g=>all.some(b=>b.group===g))],t=($('#pickQ').value||'').trim().toLowerCase();
 $('#pickChips').innerHTML=gs.map(g=>`<button type="button" class="chip" aria-pressed="${g===pkGroup}" data-g="${esc(g)}">${esc(g)}</button>`).join('');
 $$('#pickChips .chip').forEach(b=>b.onclick=()=>{pkGroup=b.dataset.g;pickDraw();$(`#pickChips [data-g="${CSS.escape(pkGroup)}"]`).focus()});
 const items=all.filter(b=>(pkGroup==='All'||b.group===pkGroup)&&(!t||(b.name+' '+b.group+' '+b.desc).toLowerCase().includes(t)));
 $('#pickCount').textContent=items.length+' sections';
 $('#pickGrid').innerHTML=items.map(b=>`<li><button type="button" class="pkcard" data-id="${esc(b.id)}"><span class="pkth" data-sth="${esc(b.id)}"></span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></button></li>`).join('')||'<li class="hint">No section matches.</li>';
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
  h+=`<p class="lcount">${items.length} sections · previews use your style</p><ul class="lgrid tiles">`+items.map(b=>card({id:b.id,title:b.name,meta:b.group,thumb:`<div class="sth" data-sth="${esc(b.id)}"></div>`,cls:'sec'})).join('')+'</ul>'}
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
addEventListener('message',e=>{if(e.source===pv.contentWindow&&e.data&&e.data.pb==='checked'&&rtabCur==='check')chkDraw(e.data.issues||[])});
$('#chkRun').onclick=runCheck;
/* ---------- site tokens ---------- */
function tokensUI(){const box=$('#tkBox');if(!box)return;const cur=PB.styles.get(page.style),sw=cur.sw||[],tk=site.tokens||{};
 const eff={bg:tk.bg||sw[0],surface:tk.surface||sw[1],ink:tk.ink||sw[2],accent:tk.accent||sw[3]};const C=PB.color;
 const cr=(a,b)=>{try{return C.ratio(a,b)}catch(e){return 0}};
 const fonts=[...new Set([cur.head,cur.body,...LIB.pairs.flatMap(p=>[p[1],p[2]])].filter(Boolean))];
 const row=(k,l)=>`<label class="tkc"><span>${l}</span><input type="color" data-k="${k}" value="${(/^#[0-9a-f]{6}$/i.test(eff[k]||'')?eff[k]:'#888888').toLowerCase()}"${tk[k]?' data-set="1"':''}></label>`;
 box.innerHTML=`<details${Object.keys(tk).length?' open':''}><summary>Customise this style${Object.keys(tk).length?' · changed':''}</summary><div class="tkb"><p class="hint">Colours, corners and fonts here apply to every section on every page.</p><div class="tkg">${row('bg','Background')}${row('surface','Panels')}${row('ink','Text')}${row('accent','Accent')}</div>
 <p class="hint" id="tkCr">Text on background ${cr(eff.ink,eff.bg).toFixed(1)}:1 ${cr(eff.ink,eff.bg)>=4.5?'(passes AA)':'(too low: needs 4.5)'} · button text ${cr(C.best(eff.accent||'#000'),eff.accent||'#000').toFixed(1)}:1</p>
 <div class="f"><label for="tkRad">Corner radius: <output>${tk.radius!=null?tk.radius:'style default'}</output></label><input id="tkRad" type="range" min="0" max="32" step="2" value="${tk.radius!=null?tk.radius:12}"></div>
 <div class="f"><label for="tkBtn">Buttons</label><select id="tkBtn"><option value="">As the style</option><option value="sharp">Square</option><option value="pill">Pill</option></select></div>
 <div class="f"><label for="tkFh">Heading font</label><select id="tkFh"><option value="">Style’s font</option>${fonts.map(f=>`<option>${esc(f)}</option>`).join('')}</select></div>
 <div class="f"><label for="tkFb">Body font</label><select id="tkFb"><option value="">Style’s font</option>${fonts.map(f=>`<option>${esc(f)}</option>`).join('')}</select></div>
 <button type="button" class="btn small" id="tkReset">Reset to the style</button></div></details>`;
 $('#tkBtn').value=tk.btn||'';$('#tkFh').value=tk.fontHead||'';$('#tkFb').value=tk.fontBody||'';
 const set=(k,v)=>{site.tokens=site.tokens||{};if(v===''||v==null)delete site.tokens[k];else site.tokens[k]=v;if(!Object.keys(site.tokens).length)delete site.tokens};
 box.querySelectorAll('input[type=color]').forEach(i=>{i.oninput=()=>{set(i.dataset.k,i.value);commitSoon();render()};i.onchange=()=>{commit();tokensUI()}});
 const r=$('#tkRad');r.oninput=()=>{r.previousElementSibling.querySelector('output').textContent=r.value;set('radius',+r.value);commitSoon();render()};
 $('#tkBtn').onchange=e=>{set('btn',e.target.value);commit();render()};$('#tkFh').onchange=e=>{set('fontHead',e.target.value);commit();render()};$('#tkFb').onchange=e=>{set('fontBody',e.target.value);commit();render()};
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
 const ps=$('#pairSel');ps.innerHTML='<option value="-1">The style’s own fonts</option>'+LIB.pairs.map((p,i)=>`<option value="${i}">${esc(p[0])}: ${esc(p[1])} + ${esc(p[2])}</option>`).join('');ps.value=String(page.pair)}
$('#styleSearch').oninput=()=>styles();
$('#pairSel').onchange=e=>{page.pair=+e.target.value;commit();render();say(page.pair<0?'Using the style’s fonts':'Fonts: '+LIB.pairs[page.pair][0])};

/* ---------- pages of this site ---------- */
const accentOf=()=>{const st=PB.styles.get(page.style);return (st&&st.sw&&st.sw[3])||'#5B2DFF'};
function goPage(id){if(!site.pages.some(p=>p.id===id))return;curId=id;open=null;pageSelUI();outline();render();if(rtabCur==='pages')pagesPanel()}
function pageSelUI(){const sel=$('#pageSel'),cp=curPage();sel.innerHTML=site.pages.map(p=>`<option value="${esc(p.id)}"${p.id===cp.id?' selected':''}>${esc(p.name||'Untitled')}${p.id===site.home?' (home)':''}</option>`).join('')}
$('#pageSel').onchange=e=>goPage(e.target.value);
function siteChanged(msg){commit();pageSelUI();outline();render();if(rtabCur==='pages')pagesPanel();if(rtabCur==='site')sitePanel();if(msg)say(msg)}
const uniqueName=base=>{let n=base,i=2;while(site.pages.some(p=>p.name===n))n=base+' '+i++;return n};
function pgListHTML(){const cp=curPage(),L=$('#pgList');
 L.innerHTML=site.pages.map((p,i)=>`<li class="pgrow${p.id===cp.id?' cur':''}" data-id="${esc(p.id)}"><button type="button" class="pgname" data-a="go"${p.id===cp.id?' aria-current="true"':''}><b>${esc(p.name||'Untitled')}${p.id===site.home?' <em>Home</em>':''}</b><small>${esc(S.pageFile(site,p))} · ${p.blocks.length} sections${p.inNav?'':' · not in menu'}</small></button><span class="pgact"><button type="button" class="ib" data-a="up" aria-label="Move ${esc(p.name)} up"${i?'':' disabled'}>↑</button><button type="button" class="ib" data-a="down" aria-label="Move ${esc(p.name)} down"${i<site.pages.length-1?'':' disabled'}>↓</button><button type="button" class="ib" data-a="dup" aria-label="Duplicate ${esc(p.name)}">⧉</button><button type="button" class="ib" data-a="home" aria-label="Make ${esc(p.name)} the home page"${p.id===site.home?' disabled':''}>⌂</button><button type="button" class="ib" data-a="rm" aria-label="Delete ${esc(p.name)}"${site.pages.length<2?' disabled':''}>✕</button></span></li>`).join('');
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
 $('#pgName').value=cp.name;$('#pgSlug').value=cp.id===site.home?'index':cp.slug;$('#pgSlug').disabled=cp.id===site.home;$('#pgNav').checked=cp.inNav;$('#ptitle').value=cp.title||'';$('#pgDesc').value=cp.desc||'';$('#pgOg').value=cp.og||'';serp()}
$('#addPage').onclick=()=>{const name=uniqueName('New page'),p=S.newPage(site,name,[{uid:uidGen(),id:'rich-text',vals:{kicker:'',heading:name,paras:'Write something here.'}}]);p.name=name;site.pages.push(p);if(site.navSeed){site.navAuto=true;site.navSeed=false}curId=p.id;open=null;siteChanged('Added '+name);const n=$('#pgName');if(n){n.focus();n.select()}};
$('#pgName').oninput=e=>{const cp=curPage(),old=cp.name;cp.name=e.target.value;if(cp.id!==site.home&&cp.slug===S.slugify(old)){cp.slug=S.uniqueSlug(site,cp.name||'page',cp.id);$('#pgSlug').value=cp.slug}commitSoon();pgListHTML();pageSelUI();status();serp();render()};
$('#pgName').onchange=e=>{if(!e.target.value.trim()){e.target.value=curPage().name='Untitled page';siteChanged()}};
$('#pgSlug').onchange=e=>{const cp=curPage();cp.slug=S.uniqueSlug(site,e.target.value||cp.name,cp.id);e.target.value=cp.slug;commit();pgListHTML();serp();say('Address: '+S.pageFile(site,cp))};
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
 if(site.navAuto){const it=S.menu(site);box.innerHTML=`<p class="hint">The menu lists: ${it.length?it.map(i=>esc(i.label)).join(', '):'no pages yet'}. Hide a page from it in Pages.</p>`;return}
 site.nav.forEach((n,i)=>{const r=document.createElement('div');r.className='navrow';const li=document.createElement('input');li.value=n.label;li.setAttribute('aria-label','Menu item '+(i+1)+' text');li.oninput=()=>{site.navSeed=false;n.label=li.value;commitSoon();render()};
  const lp=linkPicker(n.link,v=>{site.navSeed=false;n.link=v;commitSoon();render()},'Menu item '+(i+1)+' link');
  const act=document.createElement('span');act.className='pgact';act.innerHTML=`<button type="button" class="ib" data-a="up" aria-label="Move ${esc(n.label)} up"${i?'':' disabled'}>↑</button><button type="button" class="ib" data-a="down" aria-label="Move ${esc(n.label)} down"${i<site.nav.length-1?'':' disabled'}>↓</button><button type="button" class="ib" data-a="rm" aria-label="Remove ${esc(n.label)}">✕</button>`;
  act.querySelectorAll('button').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='rm')site.nav.splice(i,1);else{const j=a==='up'?i-1:i+1;site.nav.splice(j,0,site.nav.splice(i,1)[0])}commit();navRows();render()});
  r.append(li,lp,act);box.append(r)});
 const add=document.createElement('button');add.type='button';add.className='btn small';add.textContent='Add menu item';add.onclick=()=>{site.nav.push({label:'New link',link:''});commit();navRows();render()};box.append(add)}
function sitePanel(){const st=site.settings;
 $('#brand').value=site.brand||'';$('#sname').value=site.name||'';$('#slang').value=st.lang||'en';$('#surl').value=st.url||'';$('#sdesc').value=st.description||'';$('#sog').value=st.ogImage||'';
 $('#nfOn').checked=st.notFound.on;$('#nfTitle').value=st.notFound.title;$('#nfText').value=st.notFound.text;$('#nfBtn').value=st.notFound.button;$('#sAnalytics').value=st.analytics||'';$('#sForm').value=st.formAction||'';
 favUI();navRows();sitesList()}
const bindSite=(sel,fn,live)=>{$(sel).oninput=e=>{fn(e.target.value,e.target);commitSoon();if(live)render()}};
bindSite('#brand',v=>{site.brand=v},1);bindSite('#sname',v=>{site.name=v});bindSite('#slang',v=>{site.settings.lang=v.trim().slice(0,12)||'en'});bindSite('#surl',v=>{site.settings.url=v.trim()});
bindSite('#sdesc',v=>{site.settings.description=v});bindSite('#sog',v=>{site.settings.ogImage=v.trim()});bindSite('#sAnalytics',v=>{site.settings.analytics=v});bindSite('#sForm',v=>{site.settings.formAction=v.trim()},1);
bindSite('#nfTitle',v=>{site.settings.notFound.title=v});bindSite('#nfText',v=>{site.settings.notFound.text=v});bindSite('#nfBtn',v=>{site.settings.notFound.button=v});
$('#nfOn').onchange=e=>{site.settings.notFound.on=e.target.checked;commit()};
$('#favSet').onchange=e=>{const f=site.settings.favicon;f.set=e.target.value;f.name=f.set==='letter'?'':(PB.iconNames(f.set)[0]||'');commit();favUI()};
$('#favName').onchange=e=>{site.settings.favicon.name=e.target.value;commit();favUI();setTimeout(favUI,500)};
$('#navAuto').onchange=e=>{site.navSeed=false;site.navAuto=e.target.checked;if(!site.navAuto&&!site.nav.length)site.nav=S.menu(site).map(i=>({label:i.label,link:i.link}));commit();navRows();render()};

/* ---------- saved sites and templates ---------- */
function sitesList(){const P=Object.values(store.pages).sort((a,b)=>(b.updated||0)-(a.updated||0));
 $('#siteList').innerHTML=P.map(p=>`<li class="${p.id===site.id?'cur':''}"><div><b>${esc(p.name||p.brand||'Untitled')}</b><small>${p.pages.length} page${p.pages.length>1?'s':''} · ${esc(PB.styles.has(p.style)?PB.styles.get(p.style).name:p.style)}${p.updated?' · '+new Date(p.updated).toLocaleDateString():''}</small></div><span>${p.id===site.id?'<em>Open now</em>':`<button type="button" class="btn small" data-open="${esc(p.id)}">Open</button>`}<button type="button" class="btn small" data-dup="${esc(p.id)}" aria-label="Duplicate ${esc(p.name)}">Duplicate</button>${P.length>1?`<button type="button" class="btn small" data-del="${esc(p.id)}" aria-label="Delete ${esc(p.name)}">Delete</button>`:''}</span></li>`).join('');
 $$('#siteList [data-open]').forEach(b=>b.onclick=()=>switchTo(b.dataset.open));
 $$('#siteList [data-dup]').forEach(b=>b.onclick=()=>{const c=clone(store.pages[b.dataset.dup]);c.id=S.uid('s');c.name=(c.name||'Site')+' copy';store.pages[c.id]=c;switchTo(c.id);say('Duplicated')});
 $$('#siteList [data-del]').forEach(b=>b.onclick=()=>{const p=store.pages[b.dataset.del];if(!confirm('Delete “'+(p.name||'this site')+'”? This cannot be undone.'))return;delete store.pages[p.id];if(site.id===p.id)switchTo(Object.keys(store.pages)[0]);else{persist();sitesList()}say('Site deleted')});
 const NT=PB.templates||[];
 $('#tplList').innerHTML=NT.map((t,i)=>`<li class="tpl"><button type="button" data-n="${i}"><b>${esc(t.name)}</b><small>${t.pages} pages · ${esc(PB.styles.has(t.style)?PB.styles.get(t.style).name:t.style)}</small><span>${esc(t.desc)}</span></button></li>`).join('')+TEMPLATES.map((t,i)=>{const x=t();return `<li><button type="button" class="chip" data-t="${i}">${esc(x.name)} · one page</button></li>`}).join('');
 $$('#tplList [data-n]').forEach(b=>b.onclick=()=>{const t=NT[+b.dataset.n],p=S.normalize(t.make(),def);p.name=t.name;store.pages[p.id]=p;switchTo(p.id);showPane('preview');say('New site from '+t.name)});
 $$('#tplList [data-t]').forEach(b=>b.onclick=()=>{const t=TEMPLATES[+b.dataset.t]();const p=S.normalize(t,def);store.pages[p.id]=p;switchTo(p.id);say('New site from '+t.name)})}
function switchTo(id){clearTimeout(typing);commit();site=store.pages[id];store.cur=id;curId=site.home;hist=[];fut=[];lastSnap=snap();open=null;persist();refresh();histUI()}
$('#tplBtn').onclick=()=>{showPane('page');rtab('site');const el=$('#tplList');el&&el.scrollIntoView({block:'start'})};
$('#newSite').onclick=()=>{const p=blank();store.pages[p.id]=p;switchTo(p.id);say('New blank site');showPane('lib')};

/* ---------- right panel tabs, panes ---------- */
const RT=[['page','Page'],['pages','Pages'],['site','Site'],['style','Style'],['check','Check'],['ai','AI']];let rtabCur=RT.some(t=>t[0]===ui.rtab)?ui.rtab:'page';
function rtab(k){rtabCur=k;ui.rtab=k;saveUI();$$('#rtabs [role=tab]').forEach(b=>{const on=b.dataset.t===k;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});$$('.rpanel').forEach(p=>p.hidden=p.id!=='rp-'+k);if(k==='style')styles();if(k==='pages')pagesPanel();if(k==='site')sitePanel();if(k==='check')runCheck();if(k==='ai')aiStatus()}
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
async function prefetch(){const all=[...site.header,...site.pages.flatMap(p=>p.blocks),...site.footer],jobs=[];
 if(cache.cl==null&&all.some(b=>b.id==='x-component'))jobs.push(fetch('component-lab.js').then(r=>r.ok?r.text():null).then(t=>{cache.cl=t}).catch(()=>{}));
 all.filter(b=>b.id==='x-interaction').forEach(b=>{const id=val(b,'iid');if(cache.ix[id]!=null)return;jobs.push(fetch('interactions/demos/'+id+'.html').then(r=>r.ok?r.text():null).then(t=>{if(t)cache.ix[id]=t.split('../../assets/').join(SITE+'assets/')}).catch(()=>{}))});
 [...JSON.stringify(site).matchAll(/user:([\w-]+)/g)].forEach(m=>{if(!dcache.has(m[1]))jobs.push(PB.images.dataURL(m[1]).then(u=>{dcache.set(m[1],u)}))});
 await Promise.all(jobs)}
const favHref=()=>S.svgDataURL(S.faviconSVG(site,accentOf()));
async function htmlFile(){await prefetch();const P=compose('html');return swapA(assemble(P,{clInline:cache.cl||null,favHref:favHref()}),SITE+'assets/')}
$('#dlHtml').onclick=async()=>{closeMenu();try{const h=await htmlFile();dl(new Blob([h],{type:'text/html'}),slug()+'.html');say('Downloading '+slug()+'.html')}catch(e){console.error(e);say('Export failed')}};
$('#copyHtml').onclick=async()=>{closeMenu();copy(await htmlFile(),'HTML copied')};
$('#openTab').onclick=async()=>{closeMenu();const w=window.open('','_blank');const h=await htmlFile();const u=URL.createObjectURL(new Blob([h],{type:'text/html'}));if(w)w.location=u;else window.open(u,'_blank');setTimeout(()=>URL.revokeObjectURL(u),60000)};
/* the whole site as files: [[path, string|Uint8Array]] */
async function buildSiteFiles(){await prefetch();const acc=newAcc(),assets=new Map(),out=[];
 const fix=s=>s.replace(/\u0001A\/([^"')\s]+)/g,(m,p)=>{if(/\.(mp4|webm|mov)$/i.test(p)||/[$`{]/.test(p))return SITE+'assets/'+p;assets.set(p,1);return 'assets/'+p});
 const stg=site.settings,nf=stg.notFound,brand=site.brand||site.name;
 const items=site.pages.map(pg=>({pg,file:S.pageFile(site,pg),js:pg.id===site.home?'index':pg.slug}));
 if(nf.on)items.push({pg:{id:'__404',name:'Page not found',slug:'404',title:nf.title+' · '+brand,desc:'',og:'',inNav:false,noindex:true,blocks:[{uid:'nf404',id:'x-notfound',vals:{title:nf.title,text:nf.text,button:nf.button}}]},file:'404.html',js:'404'});
 items.forEach(it=>{it.P=compose('zip',it.pg,acc)});
 const st=items[0].P.st,css=fix(buildCSS(st,acc)),fontURL=fontURLOf(acc),base=(stg.url||'').trim();
 const canon=it=>base&&!it.pg.noindex?base.replace(/\/?$/,'/')+(it.file==='index.html'?'':it.file):'';
 let anyCl=false;
 items.forEach(it=>{const P=it.P;anyCl=anyCl||P.cl;const code=swapA((P.runtime?P.runtime+'\n':'')+P.js,SITE+'assets/');
  const html=assemble({...P,fontURL,cssText:css,body:fix(P.body),runtime:'',js:code},{cssHref:'assets/site.css',jsHref:code.trim()?'assets/'+it.js+'.js':null,clSrc:'assets/component-lab.js',favHref:'assets/favicon.svg',canonical:canon(it)});
  out.push([it.file,html]);if(code.trim())out.push(['assets/'+it.js+'.js',code])});
 out.push(['assets/site.css',css],['assets/favicon.svg',S.faviconSVG(site,accentOf())]);
 if(anyCl)out.push(['assets/component-lab.js',cache.cl||'/* component-lab.js could not be copied; load it from '+SITE+'component-lab.js */']);
 acc.files.forEach((t,n)=>out.push([n,t]));
 for(const id of (acc.uploads||[])){const b=await PB.images.bytes(id);if(b)out.push(['assets/uploads/'+id+'.'+PB.images.ext(id),b])}
 for(const p of assets.keys()){try{const r=await fetch('assets/'+p);if(r.ok)out.push(['assets/'+p,new Uint8Array(await r.arrayBuffer())])}catch(e){}}
 const today=new Date().toISOString().slice(0,10);
 out.push(['sitemap.xml',S.sitemap(site,base||'https://example.com/',today)],['robots.txt',S.robots(base)]);
 out.push(['README.txt',`${brand}: a static website made with the Visual & Motion Atlas site builder.\n\n${site.pages.length} page${site.pages.length>1?'s':''}: ${site.pages.map(p=>S.pageFile(site,p)).join(', ')}.\nOpen index.html in a browser. Styles are in assets/site.css, behaviour in assets/*.js, images in assets/.\nFilms still stream from ${SITE}assets/films/ so the download stays small; copy them next to your site and change the paths before you publish.\nForms${stg.formAction?' post to '+stg.formAction:' are placeholders and send nothing until you set a form address in Site settings'}.\n\nPublish it: drag this folder onto Netlify Drop, or run "vercel" inside it, or push it to GitHub Pages. To use your own domain, add it in that host's settings and set the Site address in the builder so sitemap.xml and canonical links use it${base?'':' (it is empty now, so sitemap.xml uses https://example.com/: replace it)'}.\nStyle: ${st.style?st.style.name:''}.\n`]);
 return out}
$('#dlZip').onclick=async()=>{closeMenu();const zip=(window.ThemeKits&&window.ThemeKits.zip)||PB.zip;say('Building the site ZIP…');try{const files=await buildSiteFiles();dl(zip(files),slug()+'-site.zip');say('Downloading '+slug()+'-site.zip')}catch(e){console.error(e);say('ZIP export failed')}};
PB.buildSiteFiles=buildSiteFiles;PB.getSite=()=>site;

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
  const sid=String(p.style||'').split('|')[0];{const sp=S.split(blocks,def);if(sp.header.length)site.header=sp.header;if(sp.footer.length)site.footer=sp.footer;page.blocks=sp.body}if(p.brand)page.brand=p.brand.slice(0,40);if(p.title)page.title=p.title.slice(0,80);if(PB.styles.has(sid))page.style=sid;open=null;commit();refresh();
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
function refresh(){pageSelUI();outline();render();if(rtabCur==='style')styles();if(rtabCur==='pages')pagesPanel();if(rtabCur==='site')sitePanel()}
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
/* ---------- boot ---------- */
try{const CLX=PB.src.CL();if(CLX){const st=document.createElement('style');st.textContent=CLX.css();document.head.append(st)}}catch(e){}
PB.styles.build();if(!PB.styles.has(page.style)&&!/^ds:/.test(page.style))page.style='studio';
PB.images.load().then(n=>{if(n)render()});imagesList();libTabs();library();rtab(rtabCur);refresh();histUI();showPane(ui.pane||'page');
document.body.classList.add('ready');
})();
