'use strict';
/* Page builder, start screen, sites home, template gallery, version history, shortcut sheet and header status.
   Everything here talks to app.js through window.PB.app (see "hooks for builder/ux.js" in app.js). */
(()=>{
const PB=window.PB,A=PB&&PB.app;if(!A)return;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=PB.esc;
const UX=PB.ux={};
const tryJSON=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const trySet=(k,v)=>{try{localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));return true}catch(e){return false}};
const ago=t=>{const s=Math.max(1,Math.round((Date.now()-t)/1000));if(s<60)return 'just now';const m=Math.round(s/60);if(m<60)return m+' min ago';const h=Math.round(m/60);if(h<24)return h+' h ago';return new Date(t).toLocaleDateString()};
function mk(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}

/* ---------- header: back link, site title ---------- */
function header(){const a=$('#backLink'),fromProj=/[?&]site=/.test(location.search)||/projects/.test(document.referrer);
 if(a&&fromProj){a.textContent='← My projects';a.href='atlas.html#projects'}
 const t=$('#siteTitle');if(t)t.textContent=A.site.name||A.site.brand||''}
const prevSwitch=A.onSwitch;A.onSwitch=()=>{header();if(prevSwitch)prevSwitch()};

/* ---------- dialogs ---------- */
function dialog(id,cls,label){let d=document.getElementById(id);if(d)return d;d=mk('dialog','picker '+(cls||''));d.id=id;d.setAttribute('aria-label',label);document.body.append(d);
 d.addEventListener('click',e=>{if(e.target===d)d.close()});return d}
UX.dialog=dialog;UX.mk=mk;UX.tryJSON=tryJSON;UX.trySet=trySet;UX.ago=ago;

/* ---------- site thumbnails drawn from the data (no frames) ---------- */
function palette(s){const st=PB.styles.has(s.style)?PB.styles.get(s.style):null,sw=(st&&st.sw)||['#fff','#f4f4f4','#222','#5B2DFF'],tk=s.tokens||{};
 return {bg:tk.bg||sw[0],surface:tk.surface||sw[1]||sw[0],ink:tk.ink||sw[2]||'#222',accent:tk.accent||sw[3]||'#5B2DFF'}}
function heroText(s){const pg=s.pages.find(p=>p.id===s.home)||s.pages[0];if(!pg)return '';
 for(const b of pg.blocks){const d=A.def(b.id);if(!d)continue;const f=(d.fields||[]).find(x=>x.k==='heading');if(f){const v=b.vals&&b.vals.heading!=null?b.vals.heading:f.def;if(v)return String(v)}}return ''}
function miniThumb(s){const c=palette(s),n=Math.min(8,(s.pages.find(p=>p.id===s.home)||s.pages[0]||{blocks:[]}).blocks.length),h=heroText(s);
 const bars=Array.from({length:Math.max(0,Math.min(3,n-2))},()=>`<i style="background:${c.surface};border:1px solid ${c.ink}22"></i>`).join('');
 return `<div class="mini" aria-hidden="true" style="background:${c.bg};color:${c.ink}"><div class="mn"><b>${esc(s.brand||'')}</b><span><u style="background:${c.ink}"></u><u style="background:${c.ink}"></u><u style="background:${c.ink}"></u></span><em style="background:${c.accent}"></em></div><div class="mh"><strong>${esc(h.slice(0,70))}</strong><span style="background:${c.accent}"></span></div><div class="mb">${bars}</div></div>`}

/* ---------- start dialog ---------- */
const CATS=[['all','All'],['creative','Portfolio & creative'],['business','Business & product'],['shop','Food, shop & places'],['community','Content & community'],['landing','One-page landings']];
const TCAT={portfolio:'creative',photographer:'creative',studio:'creative',agency:'business',saas:'business',app:'business',restaurant:'shop',shop:'shop',blog:'community',event:'community',nonprofit:'community',course:'community',coffee:'shop',fitness:'shop',law:'business',realestate:'shop',wedding:'community',podcast:'community',docs:'business',conference:'community'};
const thumbURL=(t,pid)=>'builder/thumbs/'+t.id+'-'+pid+'.webp';
let view='home',tcat='all',tsel=null,tpage=0;
const dlg=dialog('startDlg','startdlg','Sites and templates');
dlg.innerHTML=`<div class="pkhead"><button class="btn small" id="stBack" type="button" hidden>← Back</button><h2 id="stTitle">Start your site</h2><span style="flex:1"></span><button class="btn small" id="stClose" type="button">Close</button></div><div class="stbody" id="stBody"></div>`;
dlg.setAttribute('aria-labelledby','stTitle');dlg.removeAttribute('aria-label');
$('#stClose').onclick=()=>dlg.close();
$('#stBack').onclick=()=>{view=view==='detail'?'templates':'home';draw()};
function openStart(v){view=v||'home';draw();if(!dlg.open)dlg.showModal();const f=$('#stBody button,#stBody textarea');f&&f.focus()}
UX.openStart=openStart;
{const tb=$('#tplBtn');if(tb&&matchMedia('(max-width:700px)').matches)tb.textContent='Templates'}$('#tplBtn').onclick=()=>openStart('home');$('#openStart')&&($('#openStart').onclick=()=>openStart('home'));
function sitesSorted(){return Object.values(A.store.pages).sort((a,b)=>(b.updated||0)-(a.updated||0))}
function draw(){const body=$('#stBody'),back=$('#stBack');back.hidden=view==='home';
 $('#stTitle').textContent={home:'Start your site',templates:'Start from a template',detail:'Template preview',ai:'Describe your site',brand:'Use a brand kit'}[view];
 if(view==='home')drawHome(body);else if(view==='templates')drawGallery(body);else if(view==='detail')drawDetail(body);else if(view==='ai')drawAI(body);else drawBrand(body)}
function drawHome(body){const P=sitesSorted(),hasAny=P.length&&!A.first,cur=A.site;
 const opt=(k,t,d,ic,primary)=>`<button type="button" class="stopt${primary?' primary':''}" data-o="${k}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ic}"/></svg><b>${t}</b><small>${d}</small></button>`;
 body.innerHTML=`<div class="stopts">`+(hasAny?opt('continue','Continue “'+esc((cur.name||cur.brand||'Untitled').slice(0,26)+((cur.name||cur.brand||'').length>26?'…':''))+'”','Pick up where you left off','M5 12h14M13 6l6 6-6 6',1):'')+
  opt('templates','Start from a template',PB.templates.length+' multi-page sites to adapt','M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z')+
  opt('ai','Describe your site','Say what it is for, get a first draft','M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z')+
  opt('blank','Blank site','Empty canvas, add sections yourself','M6 3h9l4 4v14H6zM14 3v5h5')+
  opt('brand','From a brand kit','Colours and fonts from the Brand generator','M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s.2-2.5 2-2.5H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3z')+`</div>`+
  `<h3 class="sth3">Your sites <small>${hasAny?P.length:0}</small></h3><div class="btools stfiles"><button type="button" class="btn small" id="stOpenFile">Open a site file…</button>${hasAny?'<button type="button" class="btn small" id="stSave">Download this site as a file</button><button type="button" class="btn small" id="stSync">Sync all sites to My projects</button>':''}</div>`+(hasAny?`<ul class="sitegrid" id="siteGrid">`+P.map(s=>`<li class="sitecard${s.id===cur.id?' cur':''}" data-id="${esc(s.id)}"><button type="button" class="stthumb" data-a="open" aria-label="Open ${esc(s.name||'site')}">${miniThumb(s)}</button><div class="stmeta"><b class="sname" data-name>${esc(s.name||s.brand||'Untitled')}</b><small>${s.pages.length} page${s.pages.length>1?'s':''} · ${esc(PB.styles.has(s.style)?PB.styles.get(s.style).name:s.style)}${s.updated?' · '+ago(s.updated):''}</small></div><div class="stact"><button type="button" class="btn small" data-a="open">${s.id===cur.id?'Continue':'Open'}</button><button type="button" class="btn small" data-a="rename" aria-label="Rename ${esc(s.name||'site')}">Rename</button><button type="button" class="btn small" data-a="dup" aria-label="Duplicate ${esc(s.name||'site')}">Duplicate</button><button type="button" class="btn small" data-a="del" aria-label="Delete ${esc(s.name||'site')}">Delete</button></div></li>`).join('')+`</ul>`:`<p class="hint">Sites you build are saved in this browser and listed here. Pick one of the options above to start the first one.</p>`);
 body.querySelectorAll('.stopt').forEach(b=>b.onclick=()=>{const o=b.dataset.o;if(o==='continue')dlg.close();else if(o==='templates'){view='templates';draw()}else if(o==='ai'){view='ai';draw()}else if(o==='brand'){view='brand';draw()}else if(o==='blank'){const p=A.blank();A.store.pages[p.id]=p;A.switchTo(p.id);dlg.close();A.showPane('lib');A.say('New blank site. Add sections from the library.')}});
 {const g=id=>body.querySelector(id);g('#stOpenFile').onclick=()=>$('#openJson').click();if(g('#stSave'))g('#stSave').onclick=()=>UX.exportFile();if(g('#stSync'))g('#stSync').onclick=()=>UX.syncAll()}
 body.querySelectorAll('.sitecard [data-a]').forEach(b=>b.onclick=()=>siteAct(b.closest('.sitecard').dataset.id,b.dataset.a,b))}
function siteAct(id,a,btn){const st=A.store,s=st.pages[id];if(!s)return;
 if(a==='open'){if(id!==A.site.id)A.switchTo(id);dlg.close();return}
 if(a==='dup'){const c=A.clone(s);c.id=A.S.uid('s');c.name=(c.name||'Site')+' copy';c.updated=Date.now();st.pages[c.id]=c;A.persist();draw();A.say('Duplicated');return}
 if(a==='rename'){const card=btn.closest('.sitecard'),nm=card.querySelector('[data-name]'),inp=mk('input','strename');inp.value=s.name||'';inp.setAttribute('aria-label','Site name');nm.replaceWith(inp);inp.focus();inp.select();
  let fin=false;const done=ok=>{if(fin)return;fin=true;if(ok&&inp.value.trim()){s.name=inp.value.trim().slice(0,60);A.persist();header()}draw()};inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();done(true)}else if(e.key==='Escape'){e.stopPropagation();e.preventDefault();done(false)}};inp.onblur=()=>done(true);return}
 if(a==='del'){const card=btn.closest('.sitecard'),copy=A.clone(s),wasCur=id===A.site.id;
  delete st.pages[id];
  if(!Object.keys(st.pages).length){const p=A.blank();st.pages[p.id]=p}
  if(wasCur)A.switchTo(Object.keys(st.pages)[0]);else A.persist();
  const li=mk('li','sitecard gone',`<div class="stmeta"><b>Deleted “${esc(copy.name||'site')}”</b><small>It is gone from this browser.</small></div><div class="stact"><button type="button" class="btn small primary">Undo</button></div>`);card.replaceWith(li);
  li.querySelector('button').onclick=()=>{st.pages[copy.id]=copy;A.persist();draw();A.say('Restored “'+(copy.name||'site')+'”')};
  const sub=$('.sth3 small');if(sub)sub.textContent=Object.keys(st.pages).length;return}}

/* template gallery */
function tplList(){return PB.templates.map((t,i)=>({t,i,cat:t.cat==='landing'?'landing':(TCAT[t.id]||'business')}))}
function thumbImg(t,pid,cls){const i=mk('img',cls||'');i.alt='';i.loading='lazy';i.decoding='async';i.src=thumbURL(t,pid);i.onerror=()=>{i.onerror=null;i.replaceWith(mk('div','nothumb',`<span>${esc(t.name)}</span>`))};return i}
function drawGallery(body){body.innerHTML=`<div class="gchips" id="tcats" role="group" aria-label="Template category">${CATS.map(([k,l])=>`<button type="button" class="chip" data-c="${k}" aria-pressed="${k===tcat}">${l}</button>`).join('')}</div><p class="lcount" id="tcount" role="status"></p><ul class="tplgrid" id="tplGallery"></ul>`;
 const L=$("#tplGallery"),items=tplList().filter(x=>tcat==='all'||x.cat===tcat);$('#tcount').textContent=items.length+' template'+(items.length===1?'':'s')+' · each one is a complete, editable site';
 items.forEach(({t,i})=>{const li=mk('li','tplcard');const b=mk('button','tplbtn');b.type='button';b.dataset.n=i;b.setAttribute('aria-label',t.name+', '+t.pages+' pages. Preview');
  const th=mk('span','tplth');th.append(thumbImg(t,'home'));b.append(th);b.insertAdjacentHTML('beforeend',`<b>${esc(t.name)}</b><small>${t.pages} page${t.pages>1?'s':''} · ${esc(PB.styles.has(t.style)?PB.styles.get(t.style).name:t.style)}</small><span class="tpld">${esc(t.desc)}</span>`);
  b.onclick=()=>{tsel=i;tpage=0;view='detail';draw()};li.append(b);L.append(li)});
 $$('#tcats .chip').forEach(b=>b.onclick=()=>{tcat=b.dataset.c;drawGallery(body);const n=$(`#tcats [data-c="${b.dataset.c}"]`);n&&n.focus()})}
function drawDetail(body){const t=PB.templates[tsel];if(!t){view='templates';return draw()}let raw;try{raw=t.make()}catch(e){raw={pages:[{id:'home',name:'Home',blocks:[]}]}}
 const pages=raw.pages||[];if(tpage>=pages.length)tpage=0;const pg=pages[tpage]||pages[0];
 body.innerHTML=`<div class="tdet"><div class="tprev"><div class="tpimg" id="tpImg"></div><p class="hint" id="tpCap"></p></div><div class="tinfo"><h3 class="tname">${esc(t.name)}</h3><p>${esc(t.desc)}</p><p class="hint">${t.pages} pages · Style: ${esc(PB.styles.has(t.style)?PB.styles.get(t.style).name:t.style)}</p><h4 class="sth3">Pages</h4><ul class="tpages" id="tPages"></ul><div class="btools"><button type="button" class="btn primary" id="tUse">Use this template</button><button type="button" class="btn" id="tAll">All templates</button></div><p class="hint">Your current site is not touched: the template becomes a new site in your list.</p></div></div>`;
 $('#tpImg').append(thumbImg(t,pg.id,'big'));$('#tpCap').textContent=(pg.name||'Page')+(pg.desc?' · '+pg.desc:'');
 $('#tPages').innerHTML=pages.map((p,i)=>`<li><button type="button" class="tpgb" data-i="${i}" aria-pressed="${i===tpage}"><b>${esc(p.name||'Page')}</b><small>${(p.blocks||[]).length} sections</small></button></li>`).join('');
 $$('#tPages .tpgb').forEach(b=>b.onclick=()=>{tpage=+b.dataset.i;drawDetail(body);const n=$(`#tPages [data-i="${tpage}"]`);n&&n.focus()});
 $('#tAll').onclick=()=>{view='templates';draw()};$('#tUse').onclick=()=>useTemplate(tsel)}
function useTemplate(i){const t=PB.templates[i];if(!t)return;const p=A.S.normalize(t.make(),A.def);p.name=t.name;A.store.pages[p.id]=p;A.switchTo(p.id);dlg.close();A.showPane('preview');A.say('New site from '+t.name)}
UX.useTemplate=useTemplate;

/* describe your site */
function drawAI(body){body.innerHTML=`<div class="staiw"><p class="aistate" id="stAiState" role="status">Checking whether the AI is available…</p><div class="f"><label for="stBrief">What is the site for?</label><textarea id="stBrief" rows="5" maxlength="1300" placeholder="A website for a weekend pottery school in Leeds called Clay & Co: classes, prices, the teachers, a gallery and a booking page. Warm and calm."></textarea></div><div class="btools"><button type="button" class="btn primary" id="stGo">Generate site</button></div><p id="stOut" role="status" class="hint"></p></div>`;
 A.aiStatus().then(()=>{const e=$('#stAiState');if(!e)return;e.className='aistate '+(A.aiOn?'on':'off');e.textContent=A.aiOn?'The AI is ready. It chooses pages, sections and a style and writes the words.':'The AI is not available here, so you get the closest template filled with your name and words. You can edit everything afterwards.'});
 $('#stGo').onclick=async()=>{const brief=$('#stBrief').value.trim();if(!brief){$('#stOut').textContent='Describe the site first.';$('#stBrief').focus();return}
  const go=$('#stGo');go.disabled=true;$('#stOut').textContent=A.aiOn?'Writing your site…':'Building from the closest template…';
  try{let ns;if(A.aiOn)ns=await A.aiSiteGo(brief);else{const r=A.siteFromTemplate(brief);ns=A.S.normalize(r.site,A.def)}
   A.store.pages[ns.id]=ns;A.switchTo(ns.id);dlg.close();A.showPane('preview');A.say(A.aiOn?'Site ready. Your other sites are untouched.':'Built from the closest template. Edit anything on the canvas.')}
  catch(e){$('#stOut').textContent=(e&&e.message)||'Something went wrong. Try a more specific brief.';go.disabled=false}}}

/* brand kit from the Brand generator: a populated multi-page site in the brand's colours, fonts, corners and mark */
const HK='atlas-pb-brand-handoff';
const KW={portfolio:/portfolio|designer|freelanc|illustrat|artist|architect|creative|developer/,agency:/agency|consult|b2b|marketing|digital|branding|product team/,saas:/saas|software|platform|dashboard|\bapi\b|startup|analytics|automation|tool/,restaurant:/restaurant|bistro|dinner|supper|kitchen|chef|pub\b|diner/,photographer:/photograph|camera|portrait|wedding photo/,event:/event|festival|meetup|summit|gig|concert|tickets/,blog:/\bblog\b|writer|journal|essays|notes|newsletter/,shop:/\bshop\b|\bstore\b|boutique|handmade|e-?commerce|gifts?|products?/,nonprofit:/charity|non-?profit|volunteer|foundation|donat|community group/,course:/course|teach|lessons?|learn|tutor|academy|school|training|workshop/,app:/\bapp\b|mobile|ios|android|download|fintech/,studio:/studio|maker|craft|ceramic|pottery|paper|atelier/,coffee:/coffee|caf[eé]|bakery|bread|pastry|tea\b|roast/,fitness:/fitness|gym|yoga|pilates|training|wellness|climb|run club/,law:/law|legal|solicitor|accountan|advis|consultancy|finance firm/,realestate:/real estate|estate agent|property|homes?\b|letting|architect/,wedding:/wedding|bride|celebrant|florist|ceremony/,podcast:/podcast|creator|show\b|episode|youtuber|newsletter/,docs:/documentation|docs\b|help centre|developer|api|support/,conference:/conference|summit|speakers|agenda|congress/};
function suggest(h){const t=[h.name,h.desc,h.audience,h.tagline,(h.feels||[]).join(' ')].join(' ').toLowerCase();return PB.templates.map((tp,i)=>{const re=KW[tp.id];const n=re?(t.match(new RegExp(re.source,'g'))||[]).length:0;return {i,n,id:tp.id}}).sort((a,b)=>b.n-a.n||a.i-b.i)}
function createBrandSite(h,i){const t=PB.templates[i],raw=t.make(),old=raw.brand,nm=String(h.name||'My brand').replace(/["\\]/g,'').slice(0,40)||'My brand';let json=JSON.stringify(raw);if(old)json=json.split(old).join(nm);const x=JSON.parse(json);
 x.name=nm;x.brand=nm;const tag=String(h.tagline||'').trim(),HERO=new Set(['hero-image','hero-center','hero-film','hero-split','hero-3d','hero-video','hero-kinetic','page-head']);
 const hero=x.pages[0].blocks.find(b=>b.vals&&'heading' in b.vals&&HERO.has(b.id));if(hero&&tag&&tag.length<=72)hero.vals.heading=tag;
 const intro=x.pages[0].blocks.find(b=>b.vals&&'intro' in b.vals&&HERO.has(b.id));if(intro&&h.desc)intro.vals.intro=String(h.desc).slice(0,200);
 x.settings=Object.assign({},x.settings,{description:String(h.desc||tag).slice(0,300)});if(x.footer&&x.footer[0]&&x.footer[0].vals&&tag)x.footer[0].vals.line=tag.slice(0,80);
 const T=h.t||{};x.tokens={bg:T.bg,surface:T.surface,ink:T.ink,accent:T.primary,...(h.radius!=null?{radius:h.radius}:{}),...(h.head?{fontHead:h.head}:{}),...(h.body?{fontBody:h.body}:{})};if(h.mark)x.logo=h.mark;
 const ns=A.S.normalize(x,A.def);ns.name=nm;A.store.pages[ns.id]=ns;A.switchTo(ns.id);try{localStorage.removeItem(HK)}catch(e){}return ns}
let brandSel=null;
function drawBrand(body){const h=tryJSON(HK,null);
 if(!h||!h.t){body.innerHTML=`<div class="staiw"><p>No brand kit is waiting in this browser.</p><p class="hint">Make one in the Brand generator, then press “Use in the site builder” there. You will pick a template here and get a populated site in your colours, fonts and mark.</p><div class="btools"><a class="btn primary" href="brand-generator.html">Open the Brand generator</a></div></div>`;return}
 const sg=suggest(h);if(brandSel==null)brandSel=sg[0].i;
 body.innerHTML=`<div class="brandrow"><span class="sw">${[h.t.bg,h.t.surface,h.t.ink,h.t.primary].map(c=>`<i style="background:${esc(c)}"></i>`).join('')}</span>${h.mark?`<img src="${esc(h.mark)}" alt="" width="36" height="36" style="background:${esc(h.t.bg)};border-radius:8px;padding:4px">`:''}<span><b>${esc(h.name)}</b><small>${esc(h.head||'')}${h.body?' + '+esc(h.body):''} · ${esc((h.feels||[]).join(', '))}</small></span></div>
  <p class="hint" style="margin:10px 0">Pick the kind of site you need. It becomes a complete multi-page site using ${esc(h.name)}’s name, tagline, colours, corners, fonts and mark. ${sg[0].n?'We suggest <b>'+esc(PB.templates[sg[0].i].name)+'</b> from your description.':'Nothing in your description points to one type, so start with any of these.'}</p>
  <ul class="tplgrid brandgrid" id="brandGrid">${PB.templates.map((tp,i)=>`<li class="tplcard"><button type="button" class="tplbtn${i===brandSel?' sel':''}" data-i="${i}" aria-pressed="${i===brandSel}"><span class="tplth"></span><b>${esc(tp.name)}${i===sg[0].i&&sg[0].n?' <em class="sugg">Suggested</em>':''}</b><small>${tp.pages} page${tp.pages>1?'s':''}</small></button></li>`).join('')}</ul>
  <div class="btools" style="margin-top:14px"><button type="button" class="btn primary" id="brGo">Build the site</button><a class="btn" href="brand-generator.html">Back to the Brand generator</a></div>`;
 body.querySelectorAll('#brandGrid .tplbtn').forEach(b=>{const tp=PB.templates[+b.dataset.i],th=b.querySelector('.tplth');th.append(thumbImg(tp,tp.pages&&'home'));b.onclick=()=>{brandSel=+b.dataset.i;body.querySelectorAll('#brandGrid .tplbtn').forEach(x=>{x.classList.toggle('sel',x===b);x.setAttribute('aria-pressed',x===b)})}});
 $('#brGo').onclick=()=>{createBrandSite(h,brandSel);brandSel=null;dlg.close();A.showPane('preview');A.say('Built a site for '+h.name+'. Edit anything on the canvas.')}}
UX.createBrandSite=createBrandSite;UX.suggest=suggest;

/* first run: a start screen for visitors with no saved site */
if(/[?&]brand=1/.test(location.search)&&tryJSON(HK,null))setTimeout(()=>openStart('brand'),50);
else if(A.first&&!/[?&](site|nostart|favicon)=?/.test(location.search))setTimeout(()=>openStart('home'),50);

/* ---------- version history: last 20 autosaves per site, kept in IndexedDB (no size cap) ---------- */
const MAXV=20;
let dbp=null;
function hdb(){if(dbp)return dbp;dbp=new Promise((res,rej)=>{try{const r=indexedDB.open('atlas-pb-history',1);r.onupgradeneeded=()=>{const d=r.result;const st=d.createObjectStore('v',{keyPath:'k'});st.createIndex('site','sid')};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error||new Error('IndexedDB error'))}catch(e){rej(e)}});dbp.catch(()=>{dbp=null});return dbp}
const req=r=>new Promise((res,rej)=>{r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
async function listV(sid){const d=await hdb(),all=await req(d.transaction('v').objectStore('v').index('site').getAll(sid));return all.sort((a,b)=>b.t-a.t)}
let vTimer=0,lastV=0,lastJson={},warned=false;
async function captureVersion(force){const id=A.site.id,json=JSON.stringify({...A.site,updated:0});
 if(lastJson[id]===json)return true;if(!force&&Date.now()-lastV<60000)return true;
 try{const d=await hdb(),list=await listV(id);if(list.length&&list[0].json===json){lastJson[id]=json;return true}
  const t=Date.now(),tx=d.transaction('v','readwrite'),st=tx.objectStore('v');st.put({k:id+':'+t,sid:id,t,json,pages:A.site.pages.length,sections:A.site.pages.reduce((n,p)=>n+p.blocks.length,0)});
  list.slice(MAXV-1).forEach(v=>st.delete(v.k));await new Promise((res,rej)=>{tx.oncomplete=res;tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error)});
  lastJson[id]=json;lastV=t;return true}
 catch(e){if(!warned||force){warned=true;A.say('Could not save a history snapshot ('+((e&&e.name==='QuotaExceededError')?'this browser is out of space':'history storage is unavailable here')+'). Your site itself is still saved.')}return false}}
const prevSaved=A.onSaved;A.onSaved=()=>{if(prevSaved)prevSaved();clearTimeout(vTimer);vTimer=setTimeout(()=>captureVersion(false),4000)};
addEventListener('pagehide',()=>{captureVersion(true)});
UX.captureVersion=captureVersion;
const hd=dialog('histDlg','pubdlg','Version history');hd.setAttribute('aria-labelledby','hdTitle');hd.removeAttribute('aria-label');
async function drawHist(){let list=[],err='';try{list=await listV(A.site.id)}catch(e){err='History is not available in this browser (private windows can block it).'}
 hd.innerHTML=`<div class="pkhead"><h2 id="hdTitle">Version history</h2><span style="flex:1"></span><button class="btn small" id="hdClose" type="button">Close</button></div><div class="pubb"><p class="hint">Automatic snapshots of “${esc(A.site.name||'this site')}”, kept in this browser (the last ${MAXV}, any size). Restoring is itself undoable.</p><div class="btools"><button class="btn small" id="hdNow" type="button">Save a snapshot now</button></div>${err?`<p role="alert">${esc(err)}</p>`:list.length?`<ul class="histl">`+list.map((v,i)=>`<li><div><b>${ago(v.t)}</b><small>${new Date(v.t).toLocaleString()} · ${v.pages} page${v.pages>1?'s':''} · ${v.sections} sections</small></div><button class="btn small" type="button" data-i="${i}">Restore</button></li>`).join('')+`</ul>`:'<p>No snapshots yet. They appear a few seconds after you make changes.</p>'}</div>`;
 $('#hdClose').onclick=()=>hd.close();$('#hdNow').onclick=async()=>{if(await captureVersion(true)){await drawHist();A.say('Snapshot saved')}};
 hd.querySelectorAll('[data-i]').forEach(b=>b.onclick=async()=>{const v=list[+b.dataset.i];if(!v)return;await captureVersion(true);A.restoreSnap(v.json);hd.close();A.say('Restored the version from '+ago(v.t)+'. Undo brings back what you had.')})}
$('#histBtn').onclick=async()=>{await captureVersion(true);await drawHist();hd.showModal()};

/* ---------- keyboard cheat sheet ---------- */
const hp=dialog('helpDlg','pubdlg','Keyboard shortcuts');hp.setAttribute('aria-labelledby','hpTitle');hp.removeAttribute('aria-label');
const KEYS=[['Undo / redo','Ctrl + Z / Ctrl + Shift + Z'],['Add a section after the selected one','Ctrl + K'],['Duplicate the selected section','Ctrl + D'],['Copy / paste a section (also to other pages)','Ctrl + C / Ctrl + V'],['Move the selected section','Alt + ↑ / ↓'],['Delete the selected section','Delete'],['Deselect','Esc'],['Find and replace text across the site','Ctrl + Shift + H'],['Open the section menu','Right-click, or Shift + F10'],['Bold / italic while editing words','Ctrl + B / Ctrl + I'],['Zoom the canvas','Ctrl + scroll, or the zoom buttons'],['Show this list','?']];
hp.innerHTML=`<div class="pkhead"><h2 id="hpTitle">Keyboard shortcuts</h2><span style="flex:1"></span><button class="btn small" id="hpClose" type="button">Close</button></div><div class="pubb"><dl class="keys">${KEYS.map(([a,b])=>`<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl></div>`;
$('#hpClose').onclick=()=>hp.close();
function help(){if(!hp.open)hp.showModal()}UX.help=help;
$('#helpBtn').onclick=help;
document.addEventListener('keydown',e=>{if(e.key==='?'&&!e.ctrlKey&&!e.metaKey&&!/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)&&!document.activeElement.isContentEditable){e.preventDefault();help()}});

header();

/* ---------- phone: bottom bar, sheets, more menu ---------- */
{const mq=matchMedia('(max-width:980px)');
 const ic=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${p}"/></svg>`;
 const bar=mk('nav','phbar',`<button type="button" id="phOutline" aria-pressed="false">${ic('M4 6h16M4 12h16M4 18h10')}Outline</button><button type="button" id="phLib" aria-pressed="false">${ic('M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z')}Library</button><button type="button" class="add" id="phAdd" aria-label="Add a section"><span>${ic('M12 5v14M5 12h14')}</span></button><button type="button" id="phDesign" aria-pressed="false">${ic('M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s.2-2.5 2-2.5H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3z')}Design</button><button type="button" id="phMore" aria-haspopup="dialog">${ic('M5 12h.01M12 12h.01M19 12h.01')}More</button>`);
 bar.setAttribute('aria-label','Editor');document.body.append(bar);
 const back=mk('div','sheetback');back.onclick=()=>A.showPane('preview');document.body.append(back);
 [['.lib','Library'],['.right','Outline and settings']].forEach(([sel,t])=>{const el=$(sel),sb=mk('div','sheetbar',`<b>${t}</b><button type="button" class="btn small">Done</button>`);sb.querySelector('button').onclick=()=>A.showPane('preview');el.prepend(sb)});
 const sync=()=>{const p=document.body.dataset.pane;$('#phOutline').setAttribute('aria-pressed',p==='page'&&A.UI.rtab!=='style');$('#phLib').setAttribute('aria-pressed',p==='lib');$('#phDesign').setAttribute('aria-pressed',p==='page'&&A.UI.rtab==='style')};
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-pane']});
 $('#phOutline').onclick=()=>{if(document.body.dataset.pane==='page'&&A.UI.rtab!=='style')return A.showPane('preview');A.rtab('page');A.showPane('page');sync()};
 $('#phDesign').onclick=()=>{if(document.body.dataset.pane==='page'&&A.UI.rtab==='style')return A.showPane('preview');A.rtab('style');A.showPane('page');sync()};
 $('#phLib').onclick=()=>A.showPane(document.body.dataset.pane==='lib'?'preview':'lib');
 $('#phAdd').onclick=()=>{A.showPane('preview');const c=A.csel;A.openPicker(c&&A.findBlk(c.uid)?{uid:c.uid,where:'after'}:null)};
 const ms=dialog('moreDlg','moresheet','More');ms.setAttribute('aria-labelledby','mrT');ms.removeAttribute('aria-label');
 $('#phMore').onclick=()=>{ms.innerHTML=`<div class="pkhead"><h2 id="mrT">More</h2><span style="flex:1"></span><button class="btn small" id="mrX" type="button">Close</button></div><div class="morelist">`+[['sites','Sites & templates'],['undo','Undo'],['redo','Redo'],['checks','Checks on this page'],['find','Find and replace'],['hist','Version history'],['site','Site settings'],['help','Keyboard shortcuts']].map(([k,l])=>`<button type="button" data-k="${k}">${l}</button>`).join('')+`</div>`;
  $('#mrX').onclick=()=>ms.close();ms.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;ms.close();
   ({sites:()=>openStart('home'),undo:()=>A.undo(),redo:()=>A.redo(),checks:()=>{A.rtab('check');A.showPane('page')},find:()=>UX.find&&UX.find(),hist:()=>$('#histBtn').click(),site:()=>{A.rtab('site');A.showPane('page')},help:help})[k]()});
  ms.showModal()};
 if(mq.matches&&A.first===false&&!/[?&]pane=/.test(location.search))A.showPane('preview');
 else if(mq.matches)A.showPane('preview');
 sync();
}

/* ---------- section menu (right-click, long press, Shift+F10) ---------- */
const CK='atlas-pb-clip-v1',BK='atlas-pb-blocks-v1';
const menuEl=mk('div','ctxmenu');menuEl.setAttribute('role','menu');menuEl.setAttribute('aria-label','Section actions');menuEl.hidden=true;document.body.append(menuEl);
function closeMenu(){menuEl.hidden=true;menuEl.innerHTML=''}
const clip=()=>tryJSON(CK,null);
function menuFor(uid,x,y){const f=A.findBlk(uid);if(!f)return;const d=A.def(f.blk.id),L=f.list,i=f.i;
 const hid=!!(f.blk.set&&f.blk.set.hide&&f.blk.set.hide.d&&f.blk.set.hide.t&&f.blk.set.hide.p);
 const items=[['edit','Edit words and settings'],['add','Add a section after'],['dup','Duplicate'],['copy','Copy'],clip()?['paste','Paste after “'+(A.def(clip().bid)||{name:'section'}).name+'”']:null,['up','Move up',i===0],['down','Move down',i===L.length-1],['hide',hid?'Show on every screen':'Hide on every screen'],['save','Save as reusable block…'],['rm','Delete','danger']].filter(Boolean);
 menuEl.innerHTML='<div class="cmh">'+esc(d.name)+'</div>'+items.map(([k,l,x2])=>`<button type="button" role="menuitem" data-k="${k}"${x2===true?' disabled':''}${x2==='danger'?' class="danger"':''}>${esc(l)}</button>`).join('');
 menuEl.hidden=false;
 if(x==null){const r=($(`#ol [data-uid="${uid}"]`)||$('#wrap')).getBoundingClientRect();x=r.left+24;y=r.top+24}
 menuEl.style.left=Math.max(6,Math.min(x,innerWidth-menuEl.offsetWidth-6))+'px';menuEl.style.top=Math.max(6,Math.min(y,innerHeight-menuEl.offsetHeight-6))+'px';
 const bs=[...menuEl.querySelectorAll('button:not(:disabled)')];bs[0]&&bs[0].focus();
 menuEl.onkeydown=e=>{const j=bs.indexOf(document.activeElement);if(e.key==='ArrowDown'){e.preventDefault();bs[(j+1)%bs.length].focus()}else if(e.key==='ArrowUp'){e.preventDefault();bs[(j-1+bs.length)%bs.length].focus()}else if(e.key==='Escape'||e.key==='Tab'){e.preventDefault();closeMenu()}};
 menuEl.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;closeMenu();act(k,uid)})}
function act(k,uid){const f=A.findBlk(uid);if(!f)return;
 if(k==='edit'){A.open=uid;A.showPane('page');A.rtab('page');A.outline();const el=$(`#ol [data-uid="${uid}"]`);el&&el.scrollIntoView({block:'nearest'})}
 else if(k==='add')A.openPicker({uid,where:'after'});
 else if(k==='dup')A.dupBlk(uid);else if(k==='copy')copyBlk(uid);else if(k==='paste')pasteBlk(uid);
 else if(k==='up')A.move(f.list,f.i,f.i-1);else if(k==='down')A.move(f.list,f.i,f.i+1);
 else if(k==='hide'){const hid=!!(f.blk.set&&f.blk.set.hide&&f.blk.set.hide.d&&f.blk.set.hide.t&&f.blk.set.hide.p);A.setS(f.blk,'hide',hid?null:{d:1,t:1,p:1},true);A.say(hid?'Section is visible again':'Section hidden on every screen. Show it again from this menu or Section settings.')}
 else if(k==='save')saveBlock(uid);else if(k==='rm')A.rmBlk(uid)}
document.addEventListener('click',e=>{if(!menuEl.hidden&&!menuEl.contains(e.target))closeMenu()},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menuEl.hidden){e.stopPropagation();closeMenu()}},true);
UX.menu=menuFor;
$('#ol').addEventListener('contextmenu',e=>{const li=e.target.closest('.blk');if(!li)return;e.preventDefault();menuFor(li.dataset.uid,e.clientX,e.clientY)});
{let t=0,px=0,py=0;const ol=$('#ol');ol.addEventListener('touchstart',e=>{const li=e.target.closest('.blk');if(!li||e.touches.length!==1)return;px=e.touches[0].clientX;py=e.touches[0].clientY;clearTimeout(t);t=setTimeout(()=>menuFor(li.dataset.uid,px,py),650)},{passive:true});['touchend','touchmove','touchcancel'].forEach(n=>ol.addEventListener(n,()=>clearTimeout(t),{passive:true}))}

/* ---------- copy and paste sections, saved blocks ---------- */
function snapBlk(f){return {bid:f.blk.id,vals:A.clone(f.blk.vals),...(f.blk.rich?{rich:A.clone(f.blk.rich)}:{}),...(f.blk.cfg?{cfg:A.clone(f.blk.cfg)}:{}),...(f.blk.set?{set:A.clone(f.blk.set)}:{}),...(f.blk.links?{links:A.clone(f.blk.links)}:{})}}
function copyBlk(uid){const f=A.findBlk(uid);if(!f)return;trySet(CK,snapBlk(f));A.say('Copied “'+A.def(f.blk.id).name+'”. Paste it on any page with Ctrl + V.')}
function pasteBlk(uid){const c=clip();if(!c||!A.def(c.bid))return A.say('Nothing copied yet. Select a section and press Ctrl + C.');const target=uid||(A.csel&&A.findBlk(A.csel.uid)&&A.csel.uid)||null;A.addBlockAfter(c.bid,A.clone(c.vals),target,'after',c)}
UX.copy=copyBlk;UX.paste=pasteBlk;
function blocks(){const a=tryJSON(BK,[]);return Array.isArray(a)?a:[]}
function saveBlock(uid){const f=A.findBlk(uid);if(!f)return;const d=A.def(f.blk.id),nd=dialog('nameDlg','pubdlg','Save as block');
 nd.setAttribute('aria-labelledby','ndT');nd.removeAttribute('aria-label');
 nd.innerHTML=`<div class="pkhead"><h2 id="ndT">Save as reusable block</h2></div><div class="pubb"><div class="f"><label for="ndName">Block name</label><input id="ndName" maxlength="50"></div><p class="hint">Keeps the words and section settings. Find it under Library, My blocks, in this browser.</p><div class="btools"><button class="btn primary" id="ndOk" type="button">Save block</button><button class="btn" id="ndNo" type="button">Cancel</button></div></div>`;
 $('#ndName').value=d.name;nd.showModal();$('#ndName').select();
 const ok=()=>{const n=$('#ndName').value.trim()||d.name,list=blocks();list.unshift({mid:'m'+Date.now().toString(36),name:n.slice(0,50),...snapBlk(f)});if(!trySet(BK,list.slice(0,100)))A.say('Could not save: this browser is out of space.');else A.say('Saved “'+n+'” under Library, My blocks');nd.close();if(document.getElementById('lt-mine'))A.libraryRedraw()};
 $('#ndOk').onclick=ok;$('#ndNo').onclick=()=>nd.close();$('#ndName').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();ok()}}}
UX.mineHTML=card=>{const L=blocks();if(!L.length)return '<p class="hint">Nothing saved yet. Right-click a section on the page (or press and hold on a phone) and choose “Save as reusable block…”. Your blocks keep their words and settings and can be added to any page or site.</p>';
 return `<p class="lcount">${L.length} saved block${L.length>1?'s':''} · stored in this browser</p><ul class="lgrid tiles">`+L.map(b=>{const d=A.def(b.bid);if(!d)return '';const w=Object.values(b.vals||{}).find(v=>typeof v==='string'&&v.length>2&&!/^(https?:|user:|shelf\/|films\/)/.test(v))||'';return card({id:b.bid,vals:b.vals,title:b.name,meta:d.name,thumb:`<div class="minith"><b>${esc(String(w).slice(0,70))}</b></div>`,cls:'tile mine',extra:{set:b.set,links:b.links,rich:b.rich,cfg:b.cfg,mid:b.mid}})}).join('')+'</ul>'};
UX.mineAfter=L=>{L.querySelectorAll('.lc.mine').forEach(li=>{const x=JSON.parse(li.dataset.add),b=mk('button','btn small rmmine','Remove');b.type='button';b.setAttribute('aria-label','Remove saved block '+li.querySelector('b').textContent);b.onclick=()=>{trySet(BK,blocks().filter(y=>y.mid!==x.mid));A.libraryRedraw();A.say('Removed from My blocks')};li.querySelector('.lb').append(b)})};

/* ---------- keyboard and messages from the canvas ---------- */
addEventListener('message',e=>{if(e.source!==A.pv.contentWindow||!e.data)return;const m=e.data;
 if(m.pb==='ctx'){const r=A.pv.getBoundingClientRect(),z=A.zoom;menuFor(m.uid,r.left+m.x*z,r.top+m.y*z)}
 else if(m.pb==='zoom')A.setZoom(A.zoom+(m.d>0?.1:-.1))
 else if(m.pb==='key'){const c=A.csel;if(m.key==='?')help();else if(m.mod&&m.shift&&/^h$/i.test(m.key))find();else if(c&&m.mod&&/^c$/i.test(m.key))copyBlk(c.uid);else if(m.mod&&/^v$/i.test(m.key))pasteBlk(null);else if(c&&m.shift&&m.key==='F10')menuFor(c.uid)}});
document.addEventListener('keydown',e=>{const t=document.activeElement,inField=/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable,mod=e.ctrlKey||e.metaKey;if(document.querySelector('dialog[open]'))return;
 if(mod&&e.shiftKey&&/^h$/i.test(e.key)){e.preventDefault();find();return}
 if(inField)return;const c=A.csel;
 if(mod&&/^c$/i.test(e.key)&&c&&getSelection().isCollapsed){e.preventDefault();copyBlk(c.uid)}
 else if(mod&&/^v$/i.test(e.key)){e.preventDefault();pasteBlk(null)}
 else if(e.shiftKey&&e.key==='F10'&&c){e.preventDefault();menuFor(c.uid)}
 else if(e.key==='ContextMenu'&&c){e.preventDefault();menuFor(c.uid)}
 else if((e.key==='+'||e.key==='=')&&!mod){A.setZoom(A.zoom+.1)}else if(e.key==='-'&&!mod){A.setZoom(A.zoom-.1)}});

addEventListener('message',e=>{if(e.source!==A.pv.contentWindow||!e.data)return;if(e.data.pb==='empty')A.openPicker(null);else if(e.data.pb==='emptyTpl')openStart('templates')});
/* ---------- zoom control ---------- */
{const z=mk('div','seg',`<button type="button" id="zoomOut" aria-label="Zoom out">−</button><output id="zoomVal" aria-live="polite">100%</output><button type="button" id="zoomIn" aria-label="Zoom in">+</button>`);z.id='zoomSeg';z.setAttribute('role','group');z.setAttribute('aria-label','Zoom');$('#widths').after(z);
 $('#zoomOut').onclick=()=>A.setZoom(A.zoom-.1);$('#zoomIn').onclick=()=>A.setZoom(A.zoom+.1);$('#zoomVal').onclick=()=>A.setZoom(1);$('#zoomVal').title='Reset zoom';$('#zoomVal').textContent=Math.round(A.zoom*100)+'%';
 $('#wrap').addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();A.setZoom(A.zoom+(e.deltaY<0?.1:-.1))}},{passive:false})}

/* ---------- drag a library card onto the canvas, with a drop line ---------- */
{const wrap=$('#wrap'),ov=mk('div','dropov'),ind=mk('div','dropind');ov.hidden=true;ind.hidden=true;wrap.append(ov,ind);let tgt=null;
 const arm=()=>{ov.hidden=false},disarm=()=>{ov.hidden=true;ind.hidden=true;tgt=null};
 $('#libList').addEventListener('dragstart',arm);document.addEventListener('dragend',disarm);document.addEventListener('drop',()=>setTimeout(disarm,0));
 ov.addEventListener('dragover',e=>{e.preventDefault();e.stopPropagation();e.dataTransfer.dropEffect='copy';let doc;try{doc=A.pv.contentDocument}catch(x){return}if(!doc)return;
  const bs=[...doc.querySelectorAll('[data-pb][data-zone="page"]')],ir=A.pv.getBoundingClientRect(),wr=wrap.getBoundingClientRect(),z=A.zoom,y=(e.clientY-ir.top)/z;let line=null;tgt=null;
  for(const b of bs){const r=b.getBoundingClientRect();if(y<r.top+r.height/2){tgt={uid:b.id,where:'before'};line=r.top;break}}
  if(!tgt&&bs.length){const l=bs[bs.length-1],r=l.getBoundingClientRect();tgt={uid:l.id,where:'after'};line=r.bottom}
  if(line==null){ind.hidden=true;return}ind.hidden=false;ind.style.top=(ir.top-wr.top+line*z-2+wrap.scrollTop)+'px';ind.style.left=(ir.left-wr.left)+'px';ind.style.width=ir.width+'px'});
 ov.addEventListener('drop',e=>{e.preventDefault();e.stopPropagation();let x=null;try{x=JSON.parse(e.dataTransfer.getData('application/x-pb')||'null')}catch(err){}const t=tgt;disarm();if(!x||!x.id)return;if(t)A.addBlockAfter(x.id,x.vals,t.uid,t.where,x);else A.addBlock(x.id,x.vals,null,x)})}

/* ---------- find and replace across the whole site ---------- */
const fd=dialog('findDlg','pubdlg finddlg','Find and replace');fd.setAttribute('aria-labelledby','fdT');fd.removeAttribute('aria-label');
fd.innerHTML=`<div class="pkhead"><h2 id="fdT">Find and replace</h2><span style="flex:1"></span><button class="btn small" id="fdX" type="button">Close</button></div><div class="pubb"><div class="f"><label for="fdQ">Find</label><input id="fdQ" autocomplete="off"></div><div class="f"><label for="fdR">Replace with</label><input id="fdR" autocomplete="off"></div><label class="check"><input type="checkbox" id="fdCase"> Match case</label><p class="hint" id="fdCount" role="status">Type something to search every page, the header and the footer.</p><ul class="findl" id="fdList"></ul><div class="btools"><button class="btn primary" id="fdSel" type="button" disabled>Replace selected</button><button class="btn" id="fdAll" type="button" disabled>Replace all</button></div></div>`;
$('#fdX').onclick=()=>fd.close();
function scan(q,cs){const out=[];if(!q)return out;const re=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),cs?'g':'gi');
 const zones=[['Header',A.site.header],...A.site.pages.map(p=>[p.name||'Page',p.blocks]),['Footer',A.site.footer]];
 zones.forEach(([zn,list])=>list.forEach(blk=>{const d=A.def(blk.id);if(!d)return;A.fieldsOf(d).forEach(f=>{if(!['text','long','list'].includes(f.type))return;const v=String(A.val(blk,f.k)||'');const m=v.match(re);if(!m)return;re.lastIndex=0;const i=v.search(re);out.push({blk,k:f.k,zone:zn,name:d.name,label:f.label.replace(/\s*\(.*\)/,''),n:m.length,ctx:(i>24?'…':'')+v.slice(Math.max(0,i-24),i+q.length+34).replace(/\n/g,' ')+(v.length>i+q.length+34?'…':''),i:Math.min(24,i)+(i>24?1:0),len:q.length})})}));return out}
let found=[];
function fdDraw(){const q=$('#fdQ').value,cs=$('#fdCase').checked;found=scan(q,cs);const tot=found.reduce((n,x)=>n+x.n,0);
 $('#fdCount').textContent=q?(tot?tot+' match'+(tot>1?'es':'')+' in '+found.length+' place'+(found.length>1?'s':''):'No matches.'):'Type something to search every page, the header and the footer.';
 $('#fdList').innerHTML=found.slice(0,200).map((x,i)=>`<li><label class="check"><input type="checkbox" data-i="${i}" checked> <span><b>${esc(x.zone)} · ${esc(x.name)}</b> <small>${esc(x.label)}${x.n>1?' · '+x.n+' matches':''}</small><br><span class="fctx">${esc(x.ctx.slice(0,x.i))}<mark>${esc(x.ctx.slice(x.i,x.i+x.len))}</mark>${esc(x.ctx.slice(x.i+x.len))}</span></span></label></li>`).join('');
 $('#fdSel').disabled=$('#fdAll').disabled=!found.length}
function fdRun(onlySel){const q=$('#fdQ').value,r=$('#fdR').value,cs=$('#fdCase').checked;if(!q)return;const re=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),cs?'g':'gi');
 const pick=onlySel?new Set([...fd.querySelectorAll('#fdList input:checked')].map(i=>+i.dataset.i)):null;let n=0;
 found.forEach((x,i)=>{if(pick&&!pick.has(i))return;const v=String(A.val(x.blk,x.k));x.blk.vals[x.k]=v.replace(re,()=>{n++;return r})});
 if(!n)return A.say('Nothing selected to replace');A.commit();A.outline();A.render();fdDraw();A.say('Replaced '+n+' match'+(n>1?'es':'')+'. Undo brings them back.')}
$('#fdQ').oninput=fdDraw;$('#fdCase').onchange=fdDraw;$('#fdSel').onclick=()=>fdRun(true);$('#fdAll').onclick=()=>fdRun(false);
function find(){if(!fd.open)fd.showModal();const sel=getSelection&&String(getSelection()).trim();if(sel&&sel.length<60&&!$('#fdQ').value)$('#fdQ').value=sel;$('#fdQ').focus();$('#fdQ').select();fdDraw()}
UX.find=find;

/* ---------- site files: backup and move between browsers; keep My projects in step ---------- */
{const exp=$('#exportMenu');const close=()=>{exp.open=false};
 const fi=mk('input');fi.type='file';fi.accept='.json,application/json';fi.hidden=true;fi.setAttribute('aria-label','Choose a site file');document.body.append(fi);
 async function download(){close();try{const s=A.site,ids=[...new Set([...JSON.stringify(s).matchAll(/user:([\w-]+)/g)].map(m=>m[1]))],images={};
   for(const id of ids){const u=await PB.images.dataURL(id);if(u)images[id]=u}
   const out={format:'atlas-site',v:1,exported:new Date().toISOString(),site:s,images,blocks:blocks()};
   const nm=(s.name||s.brand||'site').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'site';
   A.dl(new Blob([JSON.stringify(out)],{type:'application/json'}),nm+'.atlas-site.json');A.say('Downloaded '+nm+'.atlas-site.json'+(ids.length?' with '+ids.length+' image'+(ids.length>1?'s':''):''))}
  catch(e){A.say('Could not build the site file: '+((e&&e.message)||'unknown error'))}}
 async function importFile(f){if(!f)return;if(f.size>80e6)return A.say('That file is too big to be a site file (over 80 MB).');
  let j;try{j=JSON.parse(await f.text())}catch(e){return A.say('That file is not valid JSON, so it cannot be a site file.')}
  const raw=j&&j.format==='atlas-site'&&j.site?j.site:(j&&Array.isArray(j.pages)?j:null);if(!raw||!Array.isArray(raw.pages)||!raw.pages.length)return A.say('That file is not a site builder file. Use “Download site file” to make one.');
  try{for(const [id,u] of Object.entries(j.images||{})){if(/^[\w-]+$/.test(id)&&/^data:image\//.test(u))await PB.images.putData(id,u)}
   const ns=A.S.normalize({...raw,id:undefined},A.def);ns.name=(ns.name||'Imported site').slice(0,60);ns.updated=Date.now();A.store.pages[ns.id]=ns;
   if(Array.isArray(j.blocks)){const have=new Set(blocks().map(b=>b.mid));const add=j.blocks.filter(b=>b&&b.mid&&b.bid&&!have.has(b.mid)).slice(0,50);if(add.length)trySet(BK,[...add,...blocks()].slice(0,100))}
   A.switchTo(ns.id);const d=document.getElementById('startDlg');if(d&&d.open)d.close();A.say('Opened “'+ns.name+'” as a new site')}
  catch(e){A.say('Could not open that file: '+((e&&e.message)||'unknown error'))}}
 $('#dlJson').onclick=download;$('#openJson').onclick=()=>{close();fi.value='';fi.click()};fi.onchange=()=>importFile(fi.files[0]);
 UX.exportFile=download;UX.importFile=importFile;
 UX.syncAll=()=>{let n=0;Object.values(A.store.pages).forEach(s=>{if(A.saveToProjects(s,true))n++});A.say(n?'Synced '+n+' site'+(n>1?'s':'')+' to My projects':'Could not sync to My projects')}}
$('#chkBack').onclick=()=>A.rtab('page');

/* ---------- image library: every uploaded picture, with rename, alt text, add and delete ---------- */
UX.uploadsHTML=()=>{const L=PB.images.list();
 return `<div class="btools"><button type="button" class="btn small primary" id="upMany">Upload images</button><input type="file" id="upFiles" accept="image/*" multiple hidden aria-label="Choose image files"></div><p class="lcount">${L.length} image${L.length===1?'':'s'} in this browser · optimised to 2400 px WebP on upload, with 640 and 1280 px versions made on export</p>`+
 (L.length?`<ul class="myimg">`+L.map(r=>`<li data-id="${esc(r.id)}"><span class="mt"><img src="${esc(r.url)}" alt=""></span><div class="mf"><input data-f="name" value="${esc(r.name||'')}" aria-label="Name of ${esc(r.name||'image')}"><input data-f="alt" value="${esc(r.alt||'')}" placeholder="Alt text: describe the picture" aria-label="Alt text for ${esc(r.name||'image')}"><small>${r.w&&r.h?r.w+' × '+r.h+' · ':''}${Math.round((r.blob&&r.blob.size||0)/1024)} KB · ${usedCount(r.id)} use${usedCount(r.id)===1?'':'s'}</small><div class="btools"><button type="button" class="btn small" data-a="add">Add as section</button><button type="button" class="btn small" data-a="del" aria-label="Delete ${esc(r.name||'image')}">Delete</button></div></div></li>`).join('')+`</ul>`:'<p class="hint">Pictures you upload (in any image field, or here) appear here. Name them, write their alt text once, and add them to a page.</p>')};
function usedCount(id){try{return (JSON.stringify(A.store.pages).match(new RegExp('user:'+id,'g'))||[]).length}catch(e){return 0}}
UX.uploadsAfter=L=>{const up=L.querySelector('#upMany'),fi=L.querySelector('#upFiles');if(!up)return;up.onclick=()=>fi.click();
 fi.onchange=async()=>{let n=0;for(const f of fi.files){if(!/^image\//.test(f.type)){A.say('“'+f.name+'” is not an image');continue}if(f.size>25e6){A.say('“'+f.name+'” is over 25 MB');continue}try{await PB.images.add(f);n++}catch(e){A.say('Could not keep “'+f.name+'”: '+((e&&e.name==='QuotaExceededError')?'this browser is out of space':'storage is unavailable'))}}if(n)A.say(n+' image'+(n>1?'s':'')+' added');A.libraryRedraw()};
 L.querySelectorAll('.myimg li').forEach(li=>{const id=li.dataset.id;li.querySelector('[data-f=name]').onchange=e=>{PB.images.rename(id,e.target.value);A.say('Renamed')};li.querySelector('[data-f=alt]').onchange=e=>{PB.images.setAlt(id,e.target.value);A.say('Alt text saved. It is used when you add this image.')};
  li.querySelector('[data-a=add]').onclick=()=>{const r=PB.images.cache.get(id);A.addBlock('image-full',{img:'user:'+id,alt:(r&&r.alt)||'',caption:''})};
  li.querySelector('[data-a=del]').onclick=async()=>{const n=usedCount(id);if(n&&!confirm('This image is used '+n+' time'+(n>1?'s':'')+' in your sites. Delete it anyway? Those places will show no picture.'))return;await PB.images.remove(id);A.render();A.libraryRedraw();A.say('Image deleted')}})};
})();
/* the "More" menu in the header: closes after a choice, on outside click and on Escape; shows the checks count on its button */
{const mm=document.getElementById('moreMenu');if(mm){const close=()=>{mm.open=false},cb=document.getElementById('chkBadge'),mb=document.getElementById('moreBadge');
 mm.addEventListener('click',e=>{if(e.target.closest('.mlist button'))setTimeout(close,0)});
 document.addEventListener('click',e=>{if(mm.open&&!mm.contains(e.target))close()});
 mm.addEventListener('keydown',e=>{if(e.key==='Escape'&&mm.open){close();mm.querySelector('summary').focus()}});
 const sync=()=>{const t=(cb&&cb.textContent||'').trim();const n=/^\d+$/.test(t)&&+t>0;mb.hidden=!n;mb.textContent=n?t:''};
 if(cb){new MutationObserver(sync).observe(cb,{childList:true,characterData:true,subtree:true});sync()}}}
