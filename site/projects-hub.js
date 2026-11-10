'use strict';
/* Project hubs. A hub is the landing page for one project, modelled on a studio project page:
   big title and brief, a featured directions block with a thumbnail montage,
   a directions board with a shortlist, the chosen theme kit, the chosen atlas design system,
   rows of prototypes and pages with screenshots, files and notes.
   - ProjectHub.render(el, project, opts) draws it. With opts.editable the owner can shortlist and
     switch to edit mode; changes are written to the project and opts.save(project) is called.
   - Empty slots (a direction or page with no link yet) can be drafted with "Generate with AI"
     (POST /api/ai, mode 'page'); the draft opens in the page builder.
   - ProjectHub.TEMPLATES / fromTemplate() make a new project with the same structure as the
     01 package, so the same kind of hub can be produced for any client.
   The same renderer draws the read-only public page (p.html) from the snapshots in project.hub. */
(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const KINDS=[['system','Interface & design system'],['prototype','Prototypes'],['page','Site pages'],['brand','Brand'],['other','More links']];
 const short=k=>({system:'system',prototype:'prototype',page:'page',brand:'brand',other:'link'})[k]||'link';
 const size=n=>n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round((n||0)/1024))+' KB';
 const hex=v=>/^#[0-9a-f]{3,8}$/i.test(String(v||''))?v:'';
 const uid=()=>(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)).replace(/[^\w-]/g,'').slice(0,40);
 /* Links may be absolute http(s) or site-relative; anything else (javascript:, data:) is dropped. */
 function safeURL(u){u=String(u||'').trim();if(!u)return '';try{const x=new URL(u,location.href);return /^https?:$/.test(x.protocol)?u.slice(0,1000):''}catch{return ''}}
 const str=(v,n)=>String(v??'').slice(0,n);
 const ATLAS_ID=/^[A-Z]\d\d$/;

 /* ---------- data ---------- */
 const cleanShot=s=>s&&typeof s==='object'?(s.f?{f:str(s.f,80).replace(/[^\w-]/g,'')}:s.u&&safeURL(s.u)?{u:safeURL(s.u)}:null):null;
 /* a page-builder page ({title,brand,style,note,blocks:[{id,vals}]}) drafted by the AI for a slot */
 const cleanDraft=d=>d&&typeof d==='object'&&Array.isArray(d.blocks)?{title:str(d.title,160),brand:str(d.brand,80),style:str(d.style,30).replace(/[^\w-]/g,''),note:str(d.note,400),at:Number(d.at)||Date.now(),blocks:d.blocks.filter(b=>b&&typeof b.id==='string').slice(0,14).map(b=>({id:str(b.id,40).replace(/[^\w-]/g,''),vals:Object.fromEntries(Object.entries(b.vals&&typeof b.vals==='object'?b.vals:{}).slice(0,20).map(([k,v])=>[str(k,30),str(v,600)]))}))}:null;
 const cleanItem=(l,kinds)=>({id:str(l.id,40).replace(/[^\w-]/g,'')||uid(),kind:kinds&&KINDS.some(k=>k[0]===l.kind)?l.kind:'other',title:str(l.title,120),text:str(l.text,300),url:safeURL(l.url),shot:cleanShot(l.shot),draft:cleanDraft(l.draft)});
 function clean(h){h=h&&typeof h==='object'?h:{};
  const snapOne=s=>s&&typeof s==='object'?{t:str(s.t,160),u:safeURL(s.u),s:str(s.s,40).replace(/[^\w\s%.-]/g,''),p:str(s.p,40).replace(/[^\w\s%.-]/g,'')}:null;
  const kt=h.kitSnap&&h.kitSnap.t||{};
  const kit=h.kitSnap&&typeof h.kitSnap==='object'?{id:str(h.kitSnap.id,40).replace(/[^\w-]/g,''),no:str(h.kitSnap.no,4),name:str(h.kitSnap.name,60),tagline:str(h.kitSnap.tagline,160),head:str(h.kitSnap.head,120).replace(/[^\w\s',.-]/g,''),body:str(h.kitSnap.body,120).replace(/[^\w\s',.-]/g,''),css:str(h.kitSnap.css,300).replace(/[^\w:@;,.+=&-]/g,''),t:Object.fromEntries(['bg','surface','ink','mute','line','accent','accent2','onAccent'].map(k=>[k,hex(kt[k])]))}:null;
  const tk=h.systemSnap&&h.systemSnap.tokens||{};
  const sys=h.systemSnap&&typeof h.systemSnap==='object'?{id:str(h.systemSnap.id,4),title:str(h.systemSnap.title,120),desc:str(h.systemSnap.desc,400),tokens:Object.fromEntries(['background','surface','ink','accent'].map(k=>[k,hex(tk[k])])),font:str(h.systemSnap.font,60)}:null;
  return {
   accent:str(h.accent,120),lede:str(h.lede,600),template:str(h.template,40).replace(/[^\w-]/g,''),seeded:!!h.seeded,seedV:Math.max(0,Math.min(99,Number(h.seedV)||0)),
   shortlist:Array.isArray(h.shortlist)?[...new Set(h.shortlist.filter(x=>typeof x==='string'&&/^[\w-]{1,40}$/.test(x)))].slice(0,300):[],
   snap:h.snap&&typeof h.snap==='object'?Object.fromEntries(Object.entries(h.snap).filter(([k])=>ATLAS_ID.test(k)).slice(0,300).map(([k,v])=>[k,snapOne(v)]).filter(([,v])=>v)):{},
   feature:h.feature&&typeof h.feature==='object'&&h.feature.title?{title:str(h.feature.title,120),text:str(h.feature.text,400),url:safeURL(h.feature.url),cta:str(h.feature.cta,60),shots:Array.isArray(h.feature.shots)?h.feature.shots.map(safeURL).filter(Boolean).slice(0,8):[]}:null,
   kit:str(h.kit,40).replace(/[^\w-]/g,''),kitSnap:kit,
   system:/^D\d\d$/.test(h.system||'')?h.system:'',systemSnap:sys,
   directions:Array.isArray(h.directions)?h.directions.filter(l=>l&&typeof l.title==='string').slice(0,60).map(l=>cleanItem(l,false)):[],
   links:Array.isArray(h.links)?h.links.filter(l=>l&&typeof l.title==='string').slice(0,80).map(l=>cleanItem(l,true)):[]
  }}


 /* ---------- templates ---------- */
 const slot=(kind,title,text)=>({kind,title,text});
 const TEMPLATES=[
  {id:'launch',name:'Brand + product launch',desc:'The full package: a board of home-page directions, a theme kit, a design system, product prototypes, site pages and a brand book.',platform:'Website',accent:'everything in one place.',
   directions:6,dirText:'A home-page direction: its own type, layout, motion and hero.',
   decisions:'Voice:\nColour:\nType:\nMotion:\nSound:\nAvoid:\n\nDecisions so far:\n- \n\nStill to do:\n- ',
   links:[slot('system','Design system','Foundations, components and patterns.'),slot('system','Interface system','Components with live code.'),slot('prototype','Product app','The core product, e.g. a console or dashboard.'),slot('prototype','Workspace','Internal tools or the team dashboard.'),slot('prototype','Client-facing site','Services, work and a brief form.'),slot('page','Home','The chosen direction, built out.'),slot('page','About / origin','The story.'),slot('page','Apply / contact','The way in.'),slot('page','Login','Sign-in.'),slot('brand','Brand book','Logo, colour, type, motion and sound.')]},
  {id:'landing',name:'Landing page',desc:'One page, done properly: three directions, a kit, the page and its thank-you state.',platform:'Website',accent:'one page, three ways.',
   directions:3,dirText:'A landing-page direction to compare.',decisions:'Audience:\nThe one action:\nProof points:\nAvoid:\n\nStill to do:\n- ',
   links:[slot('page','Landing page','The page itself.'),slot('page','Thank-you page','What people see after they act.'),slot('other','Analytics & experiments','What we measure and test.')]},
  {id:'system',name:'Design system',desc:'Foundation options, then the documented system: tokens, components, patterns and guidelines.',platform:'Web app',accent:'the system.',
   directions:3,dirText:'A foundation option: palette, type and density.',decisions:'Principles:\nPlatforms:\nAccessibility target: WCAG 2.2 AA\nAvoid:\n\nStill to do:\n- ',
   links:[slot('system','Foundations','Colour, type, space, radius, elevation, motion.'),slot('system','Components','Buttons, forms, navigation, overlays, data.'),slot('system','Patterns','How components combine.'),slot('page','Documentation site','Where the team reads it.'),slot('brand','Brand guidelines','Logo, voice and imagery.')]},
  {id:'campaign',name:'Campaign',desc:'Concepts to choose from, then the landing page, social cut-downs, email and a toolkit.',platform:'Website',accent:'the campaign.',
   directions:4,dirText:'A campaign concept: the idea, the line and the look.',decisions:'The idea:\nThe line:\nChannels:\nDates:\nAvoid:\n\nStill to do:\n- ',
   links:[slot('page','Campaign landing page','Where every channel points.'),slot('other','Social cut-downs','Posts, stories and short films.'),slot('other','Email','Announcement and follow-up.'),slot('brand','Campaign toolkit','Logo lock-ups, colours, type and templates.')]}
 ];
 function fromTemplate(id,{name,brief}={}){const t=TEMPLATES.find(x=>x.id===id)||TEMPLATES[0];
  return {name,brief:brief||'',platform:t.platform,stage:'Exploring',decisions:t.decisions,
   hub:clean({template:t.id,accent:t.accent,directions:Array.from({length:t.directions},(_,i)=>({id:'dir-'+(i+1),title:'Direction '+String(i+1).padStart(2,'0'),text:t.dirText})),links:t.links.map((l,i)=>Object.assign({id:'slot-'+i},l))})}}

 /* ---------- AI drafting for empty slots ---------- */
 let aiP=null,libP=null;
 const AI={
  status(){return aiP||(aiP=fetch('/api/ai?status',{headers:{accept:'application/json'}}).then(r=>r.ok?r.json():{enabled:false}).then(s=>({enabled:!!s.enabled})).catch(()=>({enabled:false})))},
  lib(){return libP||(libP=window.PB_LIB?Promise.resolve(window.PB_LIB):new Promise((res,rej)=>{const s=document.createElement('script');s.src='builder/blocks.js';s.onload=()=>res(window.PB_LIB);s.onerror=()=>{libP=null;rej(Error('Could not load the page builder sections.'))};document.head.appendChild(s)}))},
  async generate(p,item){const lib=await AI.lib();
   const catalog=lib.blocks.map(b=>({id:b.id,name:b.name,group:b.group,fields:(b.fields||[]).filter(f=>f.type!=='film').map(f=>f.k)}));
   const brief=[`Project: ${p.name}.`,item.title?`This page: ${item.title}${item.text?' — '+item.text:''}.`:'',p.brief||''].join('\n').slice(0,1500);
   const r=await fetch('/api/ai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'page',brief,catalog,styles:Object.keys(lib.styles)})});
   let data={};try{data=await r.json()}catch{}
   if(!r.ok||!data.page)throw Error(data.error||'The AI could not draft this page. Try again.');
   const pg=data.page,ids=new Set(lib.blocks.map(b=>b.id));
   return cleanDraft({title:pg.title,brand:pg.brand,style:lib.styles[pg.style]?pg.style:Object.keys(lib.styles)[0],note:pg.note,at:Date.now(),blocks:(pg.blocks||[]).filter(b=>ids.has(b.id)).map(b=>({id:b.id,vals:Array.isArray(b.fields)?Object.fromEntries(b.fields.map(f=>[f.key,f.value])):(b.fields||{})}))})},
  open(draft){try{localStorage.setItem('atlas-page-builder',JSON.stringify({title:draft.title,brand:draft.brand,style:draft.style,blocks:draft.blocks}))}catch{throw Error('Could not hand the draft to the page builder.')}location.href='page-builder.html'}
 };

 /* ---------- view ---------- */
 const thumbStyle=s=>s&&s.u?`background-image:url('${esc(s.u)}');background-size:${esc(s.s||'cover')};background-position:${esc(s.p||'50% 50%')}`:'';
 function thumb(p,id,o){const s=p.hub.snap[id];if(s&&s.u)return `<span class="phThumb" style="${thumbStyle(s)}" aria-hidden="true"></span>`;const live=o.thumb&&o.thumb(id);return live?`<span class="phThumb phLive" aria-hidden="true">${live}</span>`:`<span class="phThumb phNone" aria-hidden="true"><b>${esc(id)}</b></span>`}
 const shotThumb=it=>it.shot?(it.shot.u?`<span class="phThumb" style="background-image:url('${esc(it.shot.u)}')" aria-hidden="true"></span>`:`<span class="phThumb" data-ph-shotbg="${esc(it.shot.f)}" aria-hidden="true"></span>`):`<span class="phThumb phNone" aria-hidden="true"><b>${it.url?'Link':'Slot'}</b></span>`;
 const title=(p,id,o)=>(o.entryTitle&&o.entryTitle(id))||(p.hub.snap[id]&&p.hub.snap[id].t)||id;
 function autolink(t){return esc(t).replace(/(https?:\/\/[^\s<&]+[^\s<&.,;:)])/g,u=>`<a href="${u}" target="_blank" rel="noopener">${u.replace(/^https?:\/\//,'')}</a>`)}
 function para(t){return String(t||'').split(/\n{2,}/).map(x=>x.trim()).filter(Boolean).map(x=>`<p>${autolink(x).replace(/\n/g,'<br>')}</p>`).join('')}

 function render(el,p,o={}){
  if(!el||!p)return;p.hub=p.hub||clean({});
  const st=el._ph||(el._ph={editing:false,filter:'all',busy:new Set()});st.p=p;st.o=o;if(!o.editable)st.editing=false;
  const E=st.editing,ed=!!o.editable,H=o.level||2,h=n=>'h'+Math.min(6,H+n),hub=p.hub;
  const entries=p.entries.filter(id=>ATLAS_ID.test(id)),custom=hub.directions;
  const allIds=[...custom.map(d=>d.id),...entries];
  const sl=hub.shortlist.filter(id=>allIds.includes(id));
  const lede=hub.lede||String(p.brief||'').split(/\n{2,}/)[0].slice(0,420);
  const fid=(el.id||'ph')+'-';
  const montage=(hub.feature&&hub.feature.shots.length?hub.feature.shots.map(u=>({u})):[...custom.filter(d=>d.shot&&d.shot.u).map(d=>({u:d.shot.u})),...[...sl,...entries.filter(i=>!sl.includes(i))].map(id=>hub.snap[id]).filter(s=>s&&s.u)]).slice(0,8);
  const groups=KINDS.map(([k,name])=>[k,name,hub.links.filter(l=>l.kind===k)]).filter(g=>g[2].length);
  const aiBtn=(it,where)=>ed&&!it.url?`<button type="button" class="phBtn sm" data-ph="ai" data-where="${where}" data-id="${it.id}" ${st.ai&&st.ai.enabled&&!st.busy.has(it.id)?'':'disabled'} aria-describedby="${fid}aihelp">${st.busy.has(it.id)?'Drafting…':it.draft?'Draft again with AI':'Generate with AI'}</button>`:'';
  const draftBits=(it)=>it.draft?`<p class="phDraft">AI draft: <b>${esc(it.draft.title)}</b>${it.draft.note?' · '+esc(it.draft.note):''} <button type="button" class="phLinkBtn" data-ph="opendraft" data-id="${it.id}">Open in page builder</button></p>`:'';
  const itemEdit=(it,where)=>`<div class="phInline"><label>Title<input data-ph-item="${where}" data-id="${it.id}" data-k="title" maxlength="120" value="${esc(it.title)}"></label><label>Link<input data-ph-item="${where}" data-id="${it.id}" data-k="url" maxlength="1000" value="${esc(it.url)}" placeholder="https://… or a page on this site"></label><label class="wide">Description<input data-ph-item="${where}" data-id="${it.id}" data-k="text" maxlength="300" value="${esc(it.text)}"></label><label class="wide">Screenshot link<input data-ph-item="${where}" data-id="${it.id}" data-k="shot" maxlength="1000" value="${esc(it.shot&&it.shot.u||'')}" placeholder="${it.shot&&it.shot.f?'Using an uploaded file':'https://…/shot.webp'}"></label></div>`;
  const anySlots=ed&&(custom.some(d=>!d.url)||hub.links.some(l=>!l.url));

  const head=`<div class="phTop">${o.back?`<a class="phBack" href="${esc(o.back.href)}">← ${esc(o.back.label)}</a>`:'<span></span>'}<p class="phMeta">${esc(p.platform||'')}${p.stage?' · '+esc(p.stage):''}${o.statusText?` · <span>${esc(o.statusText)}</span>`:''}</p>${ed?`<div class="phTools"><button type="button" class="phBtn" data-ph="edit" aria-pressed="${E}">${E?'Done editing':'Edit hub'}</button></div>`:''}</div>`;
  const pub=o.cloud?`<div class="phPublic"><label class="phSwitch"><input type="checkbox" data-ph-public ${p.isPublic?'checked':''}><span>Public page</span></label>${p.isPublic&&o.publicURL?`<input class="phLinkOut" readonly aria-label="Public page link" value="${esc(o.publicURL)}"><button type="button" class="phBtn ghost sm" data-ph="copy">Copy link</button><a class="phBtn ghost sm" href="${esc(o.publicURL)}" target="_blank" rel="noopener">Open ↗</a>`:`<span class="phHint">Turn on to share a read-only page of this hub and its files.</span>`}</div>`:(ed&&o.publicHint?`<p class="phHint phPublicHint">${esc(o.publicHint)}</p>`:'');
  const aihelp=anySlots?`<p class="phHint" id="${fid}aihelp">${st.ai?st.ai.enabled?'Empty slots can be drafted with AI from your brief. Drafts open in the page builder, where you can edit and download them.':'Generate with AI is unavailable: the AI isn’t switched on for this site yet (it needs ANTHROPIC_API_KEY on Vercel). You can still add links and screenshots by hand.':'Checking whether AI drafting is available…'}</p>`:'';

  const intro=E?`<section class="phIntro phForm" aria-labelledby="${fid}h"><${h(0)} id="${fid}h" class="phSr">Edit the hub title</${h(0)}>
    <label>Project name<input data-ph-field="name" maxlength="100" value="${esc(p.name)}"></label>
    <label>Highlighted phrase after the name<input data-ph-field="hub.accent" maxlength="120" value="${esc(hub.accent)}" placeholder="everything in one place."></label>
    <label class="wide">Introduction<textarea data-ph-field="hub.lede" maxlength="600" rows="3" placeholder="Leave empty to use the first paragraph of the brief.">${esc(hub.lede)}</textarea></label>
    <label class="wide">Brief<textarea data-ph-field="brief" maxlength="4000" rows="6" placeholder="Who is it for? What should it help them do? What should it feel like?">${esc(p.brief)}</textarea></label></section>`
   :`<section class="phIntro" aria-labelledby="${fid}h"><${h(0)} id="${fid}h" class="phTitle">${esc(p.name)}${hub.accent?`, <span>${esc(hub.accent)}</span>`:''}</${h(0)}>${lede?`<p class="phLede">${esc(lede)}</p>`:''}${p.brief&&p.brief.trim().length>lede.trim().length+2?`<details class="phBrief"><summary>Full brief</summary>${para(p.brief)}</details>`:''}</section>`;

  const n=allIds.length;
  const featInner=`<div class="phMont" aria-hidden="true">${montage.length?montage.map(s=>`<span style="${thumbStyle(s)}"></span>`).join(''):Array.from({length:8},()=>'<span class="phBlank"></span>').join('')}</div><div><${h(1)} class="phFeatTitle">${esc(hub.feature?hub.feature.title:(n?n+' direction'+(n>1?'s':''):'Collect your first directions'))}</${h(1)}><p>${esc(hub.feature?hub.feature.text:(n?`${sl.length} shortlisted. Compare them below, shortlist your favourites, then pick the one to build.`:'Add styles, motion and components from the atlas with “Add to project”, or add an entry by name below.'))}</p><span class="phGo">${esc(hub.feature?(hub.feature.cta||'Open')+' →':'See the directions ↓')}</span></div>`;
  const feat=hub.feature&&hub.feature.url&&!E?`<a class="phFeat" href="${esc(hub.feature.url)}">${featInner}</a>`:`<button type="button" class="phFeat" data-ph="jump" data-target="${fid}dirs">${featInner}</button>`;
  const featEdit=E?`<details class="phForm phFeatForm"${hub.feature?' open':''}><summary>Featured link (optional)</summary><p class="phHint">Point the featured block at your own page, for example a directions board. Leave the title empty to feature the directions below.</p><div class="phInline"><label>Title<input data-ph-field="hub.feature.title" maxlength="120" value="${esc(hub.feature?hub.feature.title:'')}"></label><label>Link<input data-ph-field="hub.feature.url" maxlength="1000" value="${esc(hub.feature?hub.feature.url:'')}" placeholder="https://…"></label><label class="wide">Text<textarea data-ph-field="hub.feature.text" maxlength="400" rows="2">${esc(hub.feature?hub.feature.text:'')}</textarea></label><label class="wide">Thumbnail images, one link per line (up to 8)<textarea data-ph-field="hub.feature.shots" rows="3">${esc(hub.feature?hub.feature.shots.join('\n'):'')}</textarea></label></div></details>`:'';

  const star=(id,t)=>{const on=sl.includes(id);return ed?`<button type="button" class="phStar" data-ph="star" data-id="${esc(id)}" aria-pressed="${on}" aria-label="${on?'Remove '+esc(t)+' from the shortlist':'Shortlist '+esc(t)}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>${on?'Shortlisted':'Shortlist'}</button>`:(on?'<span class="phTag">Shortlisted</span>':'')};
  const customCard=d=>{const on=sl.includes(d.id);return `<li class="phDir${on?' on':''}${d.url?'':' slot'}">${d.url&&!E?`<a class="phDirOpen" href="${esc(d.url)}" aria-label="Open ${esc(d.title)}">${shotThumb(d)}</a>`:shotThumb(d)}<div class="phDirText">${E?itemEdit(d,'dir'):`<b>${d.url?`<a href="${esc(d.url)}">${esc(d.title)}</a>`:esc(d.title)}</b>${d.text?`<span>${esc(d.text)}</span>`:''}${!d.url?'<span class="phTag slotTag">Empty slot</span>':''}`}${draftBits(d)}</div><div class="phDirAct">${star(d.id,d.title)}${aiBtn(d,'dir')}${E?`<button type="button" class="phBtn ghost sm" data-ph="undir" data-id="${d.id}" aria-label="Remove ${esc(d.title)}">Remove</button>`:''}</div></li>`};
  const entryCard=id=>{const on=sl.includes(id),t=title(p,id,o);return `<li class="phDir${on?' on':''}">${o.openEntry?`<button type="button" class="phDirOpen" data-ph="open" data-id="${id}" aria-label="Open ${esc(t)} in the atlas">${thumb(p,id,o)}</button>`:thumb(p,id,o)}<div class="phDirText"><b><small>${id}</small> ${esc(t)}</b>${E?`<label class="phNote">Note<textarea data-ph-note="${id}" maxlength="1500" rows="2">${esc(p.notes[id]||'')}</textarea></label>`:(p.notes[id]?`<span>${esc(p.notes[id])}</span>`:'')}</div><div class="phDirAct">${star(id,t)}${E?`<button type="button" class="phBtn ghost sm" data-ph="unentry" data-id="${id}" aria-label="Remove ${esc(t)} from the project">Remove</button>`:''}</div></li>`};
  const keep=id=>st.filter!=='short'||sl.includes(id);
  const cs=custom.filter(d=>keep(d.id)),es=entries.filter(keep);
  const dirs=`<section class="phSec" id="${fid}dirs" aria-labelledby="${fid}dh" tabindex="-1"><div class="phSecHead"><${h(1)} id="${fid}dh" class="phKick">Directions <span>${n}</span></${h(1)}>${n?`<div class="phSeg" role="group" aria-label="Show directions"><button type="button" data-ph="filter" data-v="all" aria-pressed="${st.filter!=='short'}">All</button><button type="button" data-ph="filter" data-v="short" aria-pressed="${st.filter==='short'}">Shortlist <span>${sl.length}</span></button></div>`:''}</div>
   ${cs.length?`${es.length||E?`<p class="phSub">Your directions</p>`:''}<ul class="phDirs">${cs.map(customCard).join('')}</ul>`:''}
   ${es.length?`${cs.length||custom.length?'<p class="phSub">From the atlas</p>':''}<ul class="phDirs">${es.map(entryCard).join('')}</ul>`:''}
   ${!cs.length&&!es.length?`<p class="phNone">${st.filter==='short'&&n?'Nothing shortlisted yet. Use the star on a direction to shortlist it.':'No directions yet.'}</p>`:''}
   ${E?`<p class="phRowLinks"><button type="button" class="phBtn ghost sm" data-ph="adddir">Add a direction slot</button></p>`:''}
   ${ed&&o.entryOptions?`<form class="phAdd" data-ph-form="entry"><label>Add an atlas entry<input list="${fid}entries" data-ph-input="entry" placeholder="Search styles, motion, components…" autocomplete="off"></label><datalist id="${fid}entries">${o.entryOptions().filter(x=>!entries.includes(x.id)).map(x=>`<option value="${x.id} · ${esc(x.title)}"></option>`).join('')}</datalist><button class="phBtn" type="submit">Add direction</button>${o.browseHref?`<a class="phBtn ghost" href="${esc(o.browseHref)}">Browse the atlas</a>`:''}</form>`:''}</section>`;

  const k=hub.kitSnap;
  const kitView=k?`<div class="phKit" style="--k-bg:${k.t.bg};--k-surface:${k.t.surface||k.t.bg};--k-ink:${k.t.ink};--k-line:${k.t.line||k.t.ink};--k-accent:${k.t.accent};--k-on:${k.t.onAccent||k.t.bg};--k-head:${esc(k.head)};--k-body:${esc(k.body)}"><div class="phKitCard"><p class="phKitNo">Kit ${esc(k.no)}</p><p class="phKitName">${esc(k.name)}</p><p class="phKitTag">${esc(k.tagline)}</p><p class="phKitType"><span>Aa</span> The quick brown fox jumps over the lazy dog.</p><span class="phKitBtn">Primary action</span></div><ul class="phSw" aria-label="${esc(k.name)} colours">${['bg','surface','ink','mute','line','accent','accent2'].filter(c=>k.t[c]).map(c=>`<li><span style="background:${k.t[c]}" aria-hidden="true"></span><b>${c==='bg'?'background':c==='accent2'?'accent 2':c}</b><code>${k.t[c]}</code></li>`).join('')}</ul></div><p class="phRowLinks"><a href="theme-kits.html#${esc(k.id)}">Open the full kit →</a>${ed?` <button type="button" class="phBtn ghost sm" data-ph="zip">Download kit (.zip)</button>`:''}</p>`:'<p class="phNone">No theme kit picked yet.</p>';
  const kitSec=(k||ed)?`<section class="phSec" aria-labelledby="${fid}kh"><${h(1)} id="${fid}kh" class="phKick">Kit</${h(1)}>${E||(!k&&ed)?`<div class="phForm phPick"><label>Theme kit<select data-ph-kit><option value="">${o.kits?'Choose a theme kit':'Loading theme kits…'}</option>${(o.kits||[]).map(x=>`<option value="${esc(x.id)}" ${x.id===hub.kit?'selected':''}>${esc(x.no+' · '+x.name)}</option>`).join('')}</select></label></div>`:''}${kitView}</section>`:'';

  const s=hub.systemSnap;
  const sysView=s?`<a class="phSys" href="${esc((o.atlasHref??'atlas.html')+'#systems?id='+s.id)}"><span class="phSysSw" aria-hidden="true">${['background','surface','ink','accent'].filter(c=>s.tokens[c]).map(c=>`<i style="background:${s.tokens[c]}"></i>`).join('')}</span><span><b><small>${esc(s.id)}</small> ${esc(s.title)}</b><span>${esc(s.desc)}</span></span><i class="phArrow">system →</i></a>`:'<p class="phNone">No design system picked yet.</p>';
  const sysSec=(s||ed)?`<section class="phSec" aria-labelledby="${fid}sh"><${h(1)} id="${fid}sh" class="phKick">Design system</${h(1)}>${E||(!s&&ed)?`<div class="phForm phPick"><label>Atlas design system<select data-ph-system><option value="">Choose a design system</option>${(o.systems||[]).map(x=>`<option value="${x.id}" ${x.id===hub.system?'selected':''}>${esc(x.id+' · '+x.title)}</option>`).join('')}</select></label></div>`:''}${sysView}</section>`:'';

  const row=(l,i,arr)=>{const img=l.shot?`<img data-ph-shot="${esc(l.shot.f||'')}" ${l.shot.u?`src="${esc(l.shot.u)}"`:''} alt="" loading="lazy" width="1200" height="750">`:'';
   if(E)return `<li class="phRowEdit${l.url?'':' slot'}">${img||'<span class="phRowNo" aria-hidden="true"></span>'}<div>${itemEdit(l,'link')}${draftBits(l)}</div><div class="phRowAct">${aiBtn(l,'link')}<button type="button" class="phBtn ghost sm" data-ph="up" data-id="${l.id}" ${i?'':'disabled'} aria-label="Move ${esc(l.title)} up">↑</button><button type="button" class="phBtn ghost sm" data-ph="down" data-id="${l.id}" ${i<arr.length-1?'':'disabled'} aria-label="Move ${esc(l.title)} down">↓</button><button type="button" class="phBtn ghost sm" data-ph="unlink" data-id="${l.id}" aria-label="Remove ${esc(l.title)}">Remove</button></div></li>`;
   if(!l.url)return `<li class="slot${l.shot?'':' noimg'}"><div class="phRowIn">${img}<div><b>${esc(l.title)}</b>${l.text?`<span>${esc(l.text)}</span>`:''}${draftBits(l)}</div><div class="phRowAct"><span class="phTag slotTag">Empty slot</span>${aiBtn(l,'link')}</div></div></li>`;
   return `<li${l.shot?'':' class="noimg"'}><a href="${esc(l.url)}">${img}<div><b>${esc(l.title)}</b>${l.text?`<span>${esc(l.text)}</span>`:''}</div><i>${short(l.kind)} →</i></a></li>`};
  const linksSec=(groups.length||ed)?`<section class="phSec" aria-labelledby="${fid}lh"><${h(1)} id="${fid}lh" class="phKick">Prototypes &amp; pages</${h(1)}>${groups.map(([kk,name,ls])=>`<p class="phSub">${esc(name)}</p><ul class="phRows">${ls.map(row).join('')}</ul>`).join('')||'<p class="phNone">No prototypes or pages yet.</p>'}
   ${ed?`<details class="phForm phLinkForm"><summary>Add a prototype or page</summary><form data-ph-form="link" class="phInline"><label>Kind<select name="kind">${KINDS.map(([kk,nm])=>`<option value="${kk}">${nm}</option>`).join('')}</select></label><label>Title<input name="title" required maxlength="120" placeholder="Checkout prototype"></label><label class="wide">Link (leave empty for a slot to fill later)<input name="url" maxlength="1000" placeholder="https://… or a page on this site"></label><label class="wide">Description<input name="text" maxlength="300" placeholder="What it shows"></label><label>Screenshot image<input name="shot" type="file" accept="image/*"></label><label>or screenshot link<input name="shotUrl" maxlength="1000" placeholder="https://…/shot.png"></label><button class="phBtn" type="submit">Add to hub</button></form></details>`:''}</section>`:'';

  const filesSec=`<section class="phSec" aria-labelledby="${fid}fh"><${h(1)} id="${fid}fh" class="phKick">Files <span data-ph-count></span></${h(1)}><div class="phFiles" data-ph-files><p class="phNone">Loading files…</p></div>${ed&&o.addFiles?`<label class="phDrop"><input type="file" multiple data-ph-upload accept="image/*,video/mp4,video/webm,video/quicktime,application/pdf,.woff2,.ttf,.otf,.zip,.txt"><b>Add files</b><span>Images, recordings, PDFs, fonts or a zip.</span></label>`:''}</section>`;
  const notesSec=(p.decisions||ed)?`<section class="phSec" aria-labelledby="${fid}nh"><${h(1)} id="${fid}nh" class="phKick">Notes</${h(1)}>${E?`<label class="phForm"><span class="phSr">Notes and decisions</span><textarea data-ph-field="decisions" maxlength="4000" rows="8" placeholder="Decisions, open questions, links.">${esc(p.decisions)}</textarea></label>`:(p.decisions?`<div class="phNotes">${para(p.decisions)}</div>`:'<p class="phNone">No notes yet.</p>')}</section>`:'';

  el.classList.add('ph');el.classList.toggle('phEditing',E);
  el.innerHTML=head+pub+intro+featEdit+feat+aihelp+dirs+kitSec+sysSec+linksSec+filesSec+notesSec+`<p class="phStatus" role="status" aria-live="polite" data-ph-status></p>`;
  if(k&&k.css&&!document.querySelector(`link[data-ph-font="${k.id}"]`)){const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?'+k.css+'&display=swap';l.dataset.phFont=k.id;document.head.appendChild(l)}
  paintFiles(el);
  if(anySlots&&!st.ai)AI.status().then(a=>{st.ai=a;if(el._ph.p===p)render(el,p,st.o)});
  if(!el._phBound){el._phBound=true;bind(el)}
  if(st.focus){const f=el.querySelector(st.focus);st.focus=null;if(f)f.focus({preventScroll:true})}
 }

 async function paintFiles(el){const st=el._ph,{p,o}=st;const box=el.querySelector('[data-ph-files]');if(!box)return;
  let files=[];try{files=o.files?await o.files(p):[]}catch(e){files=[]}
  if(st.p!==p||!box.isConnected)return;
  const count=el.querySelector('[data-ph-count]');if(count)count.textContent=files.length;
  box.innerHTML=files.length?`<ul class="phFileGrid">${files.map(f=>{const kind=(f.type||'').split('/')[0];return `<li><a href="${esc(f.url||'#')}" target="_blank" rel="noopener" class="phFilePrev" aria-label="Open ${esc(f.name)}">${kind==='image'&&f.url?`<img src="${esc(f.url)}" alt="" loading="lazy">`:kind==='video'&&f.url?`<video src="${esc(f.url)}" muted playsinline preload="metadata"></video>`:`<span>${esc((f.name.split('.').pop()||'file').slice(0,5).toUpperCase())}</span>`}</a><b title="${esc(f.name)}">${esc(f.name)}</b><small>${size(f.size)}${f.state?' · '+esc(f.state):''}</small>${o.editable&&o.removeFile?`<button type="button" class="phBtn ghost sm" data-ph="unfile" data-id="${esc(f.id)}" aria-label="Remove ${esc(f.name)}">Remove</button>`:''}</li>`}).join('')}</ul>`:'<p class="phNone">No files yet.</p>';
  /* screenshots that point at project files */
  const map=new Map(files.map(f=>[f.id,f.url]));
  const url=async id=>map.get(id)||(o.fileURL?await o.fileURL(p,id).catch(()=>''):'');
  for(const img of el.querySelectorAll('img[data-ph-shot]')){const id=img.dataset.phShot;if(!id)continue;const u=await url(id);if(u)img.src=u;else{img.closest('li')?.classList.add('noimg');img.remove()}}
  for(const t of el.querySelectorAll('[data-ph-shotbg]')){const u=await url(t.dataset.phShotbg);if(u)t.style.backgroundImage=`url('${u}')`}}

 function status(el,m){const s=el.querySelector('[data-ph-status]');if(s)s.textContent=m}
 const findItem=(p,where,id)=>(where==='dir'?p.hub.directions:p.hub.links).find(x=>x.id===id);

 function bind(el){
  const save=(rerender,focus)=>{const st=el._ph;st.p.hub=clean(st.p.hub);st.o.save&&st.o.save(st.p);if(rerender){st.focus=focus||null;render(el,st.p,st.o)}};
  let t=null;const later=m=>{clearTimeout(t);t=setTimeout(()=>{save(false);status(el,m)},400)};
  el.addEventListener('input',e=>{const st=el._ph,p=st.p,x=e.target;
   if(x.dataset.phField){const path=x.dataset.phField,v=x.value;
    if(path.startsWith('hub.feature')){const g=n=>(el.querySelector(`[data-ph-field="hub.feature.${n}"]`)||{}).value||'';const ttl=g('title').trim().slice(0,120);p.hub.feature=ttl?{title:ttl,text:g('text').slice(0,400),url:safeURL(g('url')),cta:(p.hub.feature&&p.hub.feature.cta)||'Open',shots:g('shots').split(/\s*\n\s*/).map(safeURL).filter(Boolean).slice(0,8)}:null}
    else if(path==='name')p.name=v.trim().slice(0,100)||p.name;
    else if(path==='brief'||path==='decisions')p[path]=v.slice(0,4000);
    else p.hub[path.split('.')[1]]=v.slice(0,path==='hub.lede'?600:120);
    later('Saved.')}
   if(x.dataset.phItem){const it=findItem(p,x.dataset.phItem,x.dataset.id);if(!it)return;const k=x.dataset.k,v=x.value;
    if(k==='url'){const u=safeURL(v);if(v.trim()&&!u){status(el,'Use a link that starts with https:// or a page on this site.');return}it.url=u}
    else if(k==='shot'){const u=safeURL(v);if(u)it.shot={u};else if(!v.trim()&&it.shot&&it.shot.u)it.shot=null}
    else it[k]=v.slice(0,k==='text'?300:120);
    later('Saved.')}
   if(x.dataset.phNote){p.notes[x.dataset.phNote]=x.value.slice(0,1500);later('Note saved.')}});
  el.addEventListener('change',async e=>{const st=el._ph,x=e.target;
   if(x.matches('[data-ph-kit]')){const kit=(st.o.kits||[]).find(k=>k.id===x.value);st.p.hub.kit=kit?kit.id:'';st.p.hub.kitSnap=kit?st.o.kitSnap(kit):null;save(true,'[data-ph-kit]');status(el,kit?'Kit set to '+kit.name+'.':'Kit cleared.')}
   if(x.matches('[data-ph-system]')){const s=(st.o.systems||[]).find(k=>k.id===x.value);st.p.hub.system=s?s.id:'';st.p.hub.systemSnap=s?{id:s.id,title:s.title,desc:s.desc||'',tokens:s.tokens||{},font:s.font||''}:null;save(true,'[data-ph-system]');status(el,s?'Design system set to '+s.title+'.':'Design system cleared.')}
   if(x.matches('[data-ph-public]')){x.disabled=true;try{await st.o.setPublic(st.p,x.checked);st.focus='[data-ph-public]';render(el,st.p,st.o);status(el,st.p.isPublic?'This hub now has a public page.':'The public page is off.')}catch(err){x.checked=!x.checked;x.disabled=false;status(el,err.message)}}
   if(x.matches('[data-ph-upload]')&&x.files.length){const list=[...x.files];x.value='';status(el,'Adding '+list.length+' file'+(list.length>1?'s':'')+'…');await st.o.addFiles(st.p,list);status(el,'Files added.');paintFiles(el)}});
  el.addEventListener('submit',async e=>{const st=el._ph,f=e.target;e.preventDefault();
   if(f.dataset.phForm==='entry'){const inp=f.querySelector('input');const opts=st.o.entryOptions();const id=(inp.value.match(/^\s*([A-Z]\d\d)\b/)||[])[1]||(opts.find(x=>x.title.toLowerCase()===inp.value.trim().toLowerCase())||{}).id;if(!id||!opts.some(x=>x.id===id)){status(el,'Choose an entry from the list, for example “L05 · Text scramble and decode”.');return}if(!st.p.entries.includes(id))st.p.entries.push(id);st.o.snapEntry&&st.o.snapEntry(st.p,id);save(true,'[data-ph-input=entry]');status(el,'Direction added.')}
   if(f.dataset.phForm==='link'){const d=new FormData(f);const ttl=String(d.get('title')||'').trim();if(!ttl)return;const l={id:uid(),kind:d.get('kind'),title:ttl,text:String(d.get('text')||''),url:safeURL(d.get('url')),shot:null};const file=f.querySelector('[name=shot]').files[0];
    if(String(d.get('url')||'').trim()&&!l.url){status(el,'Use a link that starts with https:// or a page on this site.');return}
    if(file&&st.o.addFiles){status(el,'Adding the screenshot…');const ids=await st.o.addFiles(st.p,[file]);if(ids&&ids[0])l.shot={f:ids[0]}}else if(safeURL(d.get('shotUrl')))l.shot={u:safeURL(d.get('shotUrl'))};
    st.p.hub.links.push(l);save(true,'[data-ph-form=link] [name=title]');el.querySelector('.phLinkForm').open=true;status(el,'“'+ttl+'” added to the hub.')}});
  el.addEventListener('click',async e=>{const b=e.target.closest('[data-ph]');if(!b||!el.contains(b))return;const st=el._ph,p=st.p,a=b.dataset.ph,id=b.dataset.id;
   if(a==='edit'){st.editing=!st.editing;st.focus='[data-ph=edit]';render(el,p,st.o);if(st.editing)st.o.onEdit&&st.o.onEdit();return}
   if(a==='filter'){st.filter=b.dataset.v;st.focus=`[data-ph=filter][data-v=${b.dataset.v}]`;render(el,p,st.o);return}
   if(a==='jump'){const t=document.getElementById(b.dataset.target);if(t){t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});t.focus({preventScroll:true})}return}
   if(a==='open'){st.o.openEntry&&st.o.openEntry(id);return}
   if(a==='star'){const on=p.hub.shortlist.includes(id);p.hub.shortlist=on?p.hub.shortlist.filter(x=>x!==id):[...p.hub.shortlist,id];save(true,`[data-ph=star][data-id="${id}"]`);status(el,on?'Removed from the shortlist.':'Shortlisted.');return}
   if(a==='unentry'){p.entries=p.entries.filter(x=>x!==id);p.hub.shortlist=p.hub.shortlist.filter(x=>x!==id);save(true,'[data-ph=edit]');status(el,'Direction removed.');return}
   if(a==='undir'){p.hub.directions=p.hub.directions.filter(x=>x.id!==id);p.hub.shortlist=p.hub.shortlist.filter(x=>x!==id);save(true,'[data-ph=adddir]');status(el,'Direction removed.');return}
   if(a==='adddir'){const nid='dir-'+uid().slice(0,8);p.hub.directions.push({id:nid,title:'Direction '+String(p.hub.directions.length+1).padStart(2,'0'),text:'',url:'',shot:null});save(true,`[data-ph-item=dir][data-id="${nid}"][data-k=title]`);status(el,'Direction slot added.');return}
   if(a==='unlink'){p.hub.links=p.hub.links.filter(l=>l.id!==id);save(true,'[data-ph=edit]');status(el,'Removed from the hub.');return}
   if(a==='up'||a==='down'){const Ls=p.hub.links,i=Ls.findIndex(l=>l.id===id);const same=Ls.map((l,j)=>[l,j]).filter(([l])=>l.kind===Ls[i].kind).map(x=>x[1]);const j=same[same.indexOf(i)+(a==='up'?-1:1)];if(j==null)return;[Ls[i],Ls[j]]=[Ls[j],Ls[i]];save(true,`[data-ph=${a}][data-id="${id}"]`);return}
   if(a==='unfile'){if(st.o.removeFile){await st.o.removeFile(p,id);status(el,'File removed.');paintFiles(el)}return}
   if(a==='copy'){const i=el.querySelector('.phLinkOut');try{await navigator.clipboard.writeText(i.value)}catch{i.select();document.execCommand('copy')}status(el,'Link copied.');return}
   if(a==='zip'){b.disabled=true;status(el,'Building the kit zip…');try{await st.o.zipKit(p.hub.kit);status(el,'Kit downloaded.')}catch(err){status(el,err.message||'Could not build the kit zip.')}finally{b.disabled=false}return}
   if(a==='ai'){const it=findItem(p,b.dataset.where,id);if(!it||st.busy.has(id))return;st.busy.add(id);render(el,p,st.o);status(el,'Drafting “'+it.title+'” from your brief…');
    try{it.draft=await AI.generate(p,it);status(el,'Draft ready: '+it.draft.title+'. Open it in the page builder to edit and download it.')}catch(err){status(el,err.message)}finally{st.busy.delete(id);save(true,`[data-ph=opendraft][data-id="${id}"]`)}return}
   if(a==='opendraft'){const it=findItem(p,'dir',id)||findItem(p,'link',id);if(it&&it.draft){try{AI.open(it.draft)}catch(err){status(el,err.message)}}return}});
 }
 window.ProjectHub={render,clean,safeURL,KINDS,TEMPLATES,fromTemplate,AI};
})();
