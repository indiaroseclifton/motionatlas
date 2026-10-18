'use strict';
/* Project hubs. A hub is the landing page for one project, modelled on the 01ai hub
   (work/01/hub.html): big title and brief, a featured block of directions with a thumbnail
   montage and a shortlist, the chosen theme kit, the chosen atlas design system, rows of
   prototypes and pages with screenshots, files and notes.
   ProjectHub.render(el, project, opts) draws it. With opts.editable the owner can shortlist and
   switch to edit mode; every change is applied to the project object and opts.save(project) is called.
   The same renderer draws the read-only public page (p.html), from the snapshots kept in project.hub. */
(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const KINDS=[['system','Interface system'],['prototype','Prototypes'],['page','Site pages'],['brand','Brand'],['other','More links']];
 const kindName=k=>(KINDS.find(x=>x[0]===k)||KINDS[4])[1];
 const short=k=>({system:'system',prototype:'prototype',page:'page',brand:'brand',other:'link'})[k]||'link';
 const size=n=>n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round((n||0)/1024))+' KB';
 const hex=v=>/^#[0-9a-f]{3,8}$/i.test(String(v||''))?v:'';
 const uid=()=>(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)).replace(/[^\w-]/g,'').slice(0,40);
 /* Links may be absolute http(s) or site-relative; anything else (javascript:, data:) is dropped. */
 function safeURL(u){u=String(u||'').trim();if(!u)return '';try{const x=new URL(u,location.href);return /^https?:$/.test(x.protocol)?u.slice(0,1000):''}catch{return ''}}
 const str=(v,n)=>String(v??'').slice(0,n);

 /* ---------- data ---------- */
 function clean(h){h=h&&typeof h==='object'?h:{};
  const snapOne=s=>s&&typeof s==='object'?{t:str(s.t,160),u:safeURL(s.u),s:str(s.s,40).replace(/[^\w\s%.-]/g,''),p:str(s.p,40).replace(/[^\w\s%.-]/g,'')}:null;
  const kit=h.kitSnap&&typeof h.kitSnap==='object'?{id:str(h.kitSnap.id,40),no:str(h.kitSnap.no,4),name:str(h.kitSnap.name,60),tagline:str(h.kitSnap.tagline,160),head:str(h.kitSnap.head,120),body:str(h.kitSnap.body,120),css:str(h.kitSnap.css,300).replace(/[^\w:@;,.+=&-]/g,''),t:Object.fromEntries(['bg','surface','ink','mute','line','accent','accent2','onAccent'].map(k=>[k,hex(h.kitSnap.t&&h.kitSnap.t[k])]))}:null;
  const sys=h.systemSnap&&typeof h.systemSnap==='object'?{id:str(h.systemSnap.id,4),title:str(h.systemSnap.title,120),desc:str(h.systemSnap.desc,400),tokens:Object.fromEntries(['background','surface','ink','accent'].map(k=>[k,hex(h.systemSnap.tokens&&h.systemSnap.tokens[k])])),font:str(h.systemSnap.font,60)}:null;
  const shot=s=>s&&typeof s==='object'?(s.f?{f:str(s.f,80).replace(/[^\w-]/g,'')}:s.u&&safeURL(s.u)?{u:safeURL(s.u)}:null):null;
  return {
   accent:str(h.accent,120),lede:str(h.lede,600),
   shortlist:Array.isArray(h.shortlist)?[...new Set(h.shortlist.filter(x=>typeof x==='string'&&/^[A-Z]\d\d$/.test(x)))].slice(0,300):[],
   snap:h.snap&&typeof h.snap==='object'?Object.fromEntries(Object.entries(h.snap).filter(([k])=>/^[A-Z]\d\d$/.test(k)).slice(0,300).map(([k,v])=>[k,snapOne(v)]).filter(([,v])=>v)):{},
   feature:h.feature&&typeof h.feature==='object'&&h.feature.title?{title:str(h.feature.title,120),text:str(h.feature.text,400),url:safeURL(h.feature.url),cta:str(h.feature.cta,60),shots:Array.isArray(h.feature.shots)?h.feature.shots.map(safeURL).filter(Boolean).slice(0,8):[]}:null,
   kit:str(h.kit,40).replace(/[^\w-]/g,''),kitSnap:kit,
   system:/^D\d\d$/.test(h.system||'')?h.system:'',systemSnap:sys,
   seeded:!!h.seeded,
   links:Array.isArray(h.links)?h.links.filter(l=>l&&typeof l.title==='string').slice(0,80).map(l=>({id:str(l.id,40).replace(/[^\w-]/g,'')||uid(),kind:KINDS.some(k=>k[0]===l.kind)?l.kind:'other',title:str(l.title,120),text:str(l.text,300),url:safeURL(l.url),shot:shot(l.shot)})):[]
  }}

 /* The 01ai starter opens as a worked example of a hub, pointing at the real 01 pages. */
 const W='work/01/';
 const STARTER={accent:'everything in one place.',lede:'Twenty home-page directions to choose from, the interface system, three product prototypes and the first pass of the site pages. Start with the directions.',
  shortlist:['L05','L01','A03','D08'],
  feature:{title:'20 home-page directions',text:'Working home pages, each with its own type, layout, motion and city. Shortlist your favourites, then pick the one the site gets built in.',url:W+'kit/directions.html',cta:'Open the directions',shots:['d01','d08','d09','d17','d03','d13','d10','d20'].map(d=>W+'kit/shots/'+d+'.webp')},
  kit:'graphite',kitSnap:{id:'graphite',no:'09',name:'Graphite',tagline:'A motherboard city at night.',head:"'Geist',system-ui,sans-serif",body:"'Geist',system-ui,sans-serif",css:'family=Geist:wght@300..700',t:{bg:'#07090C',surface:'#0F1318',ink:'#E7EAEE',mute:'#8A94A2',line:'#252D38',accent:'#7FE7F7',accent2:'#3CF29A',onAccent:'#041014'}},
  system:'D08',systemSnap:{id:'D08',title:'Cinematic cyber system',desc:'Token structure starting point; swap neon for graphite and platinum.',tokens:{background:'#0b1522',surface:'#15263a',ink:'#e6f4ff',accent:'#75dbff'},font:'system-ui'},
  links:[
   ['system','Interface system','Foundations, components with live code, patterns.','system.html','system'],
   ['prototype','01ai Console','Chat that spawns agents, runs, models, connections, settings.','app.html','console'],
   ['prototype','01 Workspace','Ops overview, task board, clients, agent inbox.','workspace.html','workspace'],
   ['prototype','01 Agency','Agency site: services, work, process, brief form.','agency.html','agency'],
   ['page','Home','The original city-circuits home page.','home.html','home'],
   ['page','Agents','The agent lineage, with the DNA helix.','agents.html','agents'],
   ['page','Integrations','The integration wall.','integrations.html','integrations'],
   ['page','Apply','The staged application.','apply.html','apply'],
   ['page','Origin','The story.','origin.html',''],
   ['page','Login','Discreet sign-in into the console.','login.html',''],
   ['brand','Brand book','Logo, colour, type, motion and sound.','brand.html','brand']
  ].map(([kind,title,text,url,shot],i)=>({id:'s01-'+i,kind,title,text,url:W+url,shot:shot?{u:W+'assets/shots/'+shot+'.webp'}:null}))};
 function seed(p){if(!p||p.hub&&p.hub.seeded)return false;if(p.id!=='starter-01ai'&&p.origin!=='starter-01ai')return false;
  const h=p.hub||clean({});if(h.links.length||h.feature||h.kit)return false;p.hub=Object.assign(clean(STARTER),{seeded:true,snap:h.snap});return true}

 /* ---------- view ---------- */
 const thumbStyle=s=>s&&s.u?`background-image:url('${esc(s.u)}');background-size:${esc(s.s||'cover')};background-position:${esc(s.p||'50% 50%')}`:'';
 function thumb(p,id,o){const s=p.hub.snap[id];if(s&&s.u)return `<span class="phThumb" style="${thumbStyle(s)}" aria-hidden="true"></span>`;const live=o.thumb&&o.thumb(id);return live?`<span class="phThumb phLive" aria-hidden="true">${live}</span>`:`<span class="phThumb phNone" aria-hidden="true"><b>${esc(id)}</b></span>`}
 const title=(p,id,o)=>(o.entryTitle&&o.entryTitle(id))||(p.hub.snap[id]&&p.hub.snap[id].t)||id;
 function autolink(t){return esc(t).replace(/(https?:\/\/[^\s<]+[^\s<.,;:)])/g,u=>`<a href="${u}" target="_blank" rel="noopener">${u.replace(/^https?:\/\//,'')}</a>`)}
 function para(t){return String(t||'').split(/\n{2,}/).map(x=>x.trim()).filter(Boolean).map(x=>`<p>${autolink(x).replace(/\n/g,'<br>')}</p>`).join('')}

 function render(el,p,o={}){
  if(!el||!p)return;p.hub=p.hub||clean({});
  const st=el._ph||(el._ph={editing:false,filter:'all'});st.p=p;st.o=o;if(!o.editable)st.editing=false;
  const E=st.editing,ed=!!o.editable,H=o.level||2,h=n=>'h'+Math.min(6,H+n),hub=p.hub;
  const entries=p.entries.filter(id=>/^[A-Z]\d\d$/.test(id));
  const sl=hub.shortlist.filter(id=>entries.includes(id));
  const shown=st.filter==='short'?sl:entries;
  const lede=hub.lede||String(p.brief||'').split(/\n{2,}/)[0].slice(0,420);
  const montage=(hub.feature&&hub.feature.shots.length?hub.feature.shots.map(u=>({u})):[...sl,...entries.filter(i=>!sl.includes(i))].map(id=>hub.snap[id]).filter(s=>s&&s.u)).slice(0,8);
  const fid=(el.id||'ph')+'-';
  const groups=KINDS.map(([k,name])=>[k,name,hub.links.filter(l=>l.kind===k)]).filter(g=>g[2].length);
  const head=`<div class="phTop">${o.back?`<a class="phBack" href="${esc(o.back.href)}">← ${esc(o.back.label)}</a>`:'<span></span>'}<p class="phMeta">${esc(p.platform||'')}${p.stage?' · '+esc(p.stage):''}${o.statusText?` · <span>${esc(o.statusText)}</span>`:''}</p>${ed?`<div class="phTools"><button type="button" class="phBtn" data-ph="edit" aria-pressed="${E}">${E?'Done editing':'Edit hub'}</button>${o.editorHref?`<a class="phBtn ghost" href="${esc(o.editorHref)}">Project details</a>`:''}</div>`:''}</div>`;
  const pub=o.cloud?`<div class="phPublic"><label class="phSwitch"><input type="checkbox" data-ph-public ${p.isPublic?'checked':''}><span>Public page</span></label>${p.isPublic&&o.publicURL?`<input class="phLinkOut" readonly aria-label="Public page link" value="${esc(o.publicURL)}"><button type="button" class="phBtn ghost" data-ph="copy">Copy link</button><a class="phBtn ghost" href="${esc(o.publicURL)}" target="_blank" rel="noopener">Open ↗</a>`:`<span class="phHint">Anyone with the link can view the hub and its files while this is on.</span>`}</div>`:(ed&&o.publicHint?`<p class="phHint phPublicHint">${esc(o.publicHint)}</p>`:'');

  const intro=E?`<section class="phIntro phForm" aria-labelledby="${fid}h"><${h(0)} id="${fid}h" class="phSr">Edit the hub title</${h(0)}>
    <label>Project name<input data-ph-field="name" maxlength="100" value="${esc(p.name)}"></label>
    <label>Highlighted phrase after the name<input data-ph-field="hub.accent" maxlength="120" value="${esc(hub.accent)}" placeholder="everything in one place."></label>
    <label class="wide">Introduction<textarea data-ph-field="hub.lede" maxlength="600" rows="3" placeholder="Leave empty to use the first paragraph of the brief.">${esc(hub.lede)}</textarea></label>
    <label class="wide">Brief<textarea data-ph-field="brief" maxlength="4000" rows="6">${esc(p.brief)}</textarea></label></section>`
   :`<section class="phIntro" aria-labelledby="${fid}h"><${h(0)} id="${fid}h" class="phTitle">${esc(p.name)}${hub.accent?`, <span>${esc(hub.accent)}</span>`:''}</${h(0)}>${lede?`<p class="phLede">${esc(lede)}</p>`:''}${p.brief&&p.brief.length>lede.length+2?`<details class="phBrief"><summary>Full brief</summary>${para(p.brief)}</details>`:''}</section>`;

  const featInner=`<div class="phMont" aria-hidden="true">${montage.length?montage.map(s=>`<span style="${thumbStyle(s)}"></span>`).join(''):Array.from({length:8},()=>'<span class="phBlank"></span>').join('')}</div><div><${h(1)} class="phFeatTitle">${esc(hub.feature?hub.feature.title:(entries.length?entries.length+' direction'+(entries.length>1?'s':''):'Collect your first directions'))}</${h(1)}><p>${esc(hub.feature?hub.feature.text:(entries.length?`${sl.length} shortlisted. Compare them below, shortlist your favourites, then pick the one to build.`:'Add styles, motion and components from the atlas with “Add to project”, or add an entry by name below.'))}</p><span class="phGo">${esc(hub.feature?(hub.feature.cta||'Open')+' →':'See the directions ↓')}</span></div>`;
  const feat=hub.feature&&hub.feature.url&&!E?`<a class="phFeat" href="${esc(hub.feature.url)}">${featInner}</a>`:`<button type="button" class="phFeat" data-ph="jump" data-target="${fid}dirs">${featInner}</button>`;
  const featEdit=E?`<details class="phForm phFeatForm"${hub.feature?' open':''}><summary>Featured link (optional)</summary><p class="phHint">Point the featured block at your own page, for example a directions board. Leave the title empty to feature the directions below.</p><label>Title<input data-ph-field="hub.feature.title" maxlength="120" value="${esc(hub.feature?hub.feature.title:'')}"></label><label>Link<input data-ph-field="hub.feature.url" maxlength="1000" value="${esc(hub.feature?hub.feature.url:'')}" placeholder="https://…"></label><label class="wide">Text<textarea data-ph-field="hub.feature.text" maxlength="400" rows="2">${esc(hub.feature?hub.feature.text:'')}</textarea></label><label class="wide">Thumbnail images, one link per line (up to 8)<textarea data-ph-field="hub.feature.shots" rows="3">${esc(hub.feature?hub.feature.shots.join('\n'):'')}</textarea></label></details>`:'';

  const dirs=`<section class="phSec" id="${fid}dirs" aria-labelledby="${fid}dh" tabindex="-1"><div class="phSecHead"><${h(1)} id="${fid}dh" class="phKick">Directions <span>${entries.length}</span></${h(1)}>${entries.length?`<div class="phSeg" role="group" aria-label="Show directions"><button type="button" data-ph="filter" data-v="all" aria-pressed="${st.filter!=='short'}">All</button><button type="button" data-ph="filter" data-v="short" aria-pressed="${st.filter==='short'}">Shortlist <span>${sl.length}</span></button></div>`:''}</div>
   ${shown.length?`<ul class="phDirs">${shown.map(id=>{const on=sl.includes(id),t=title(p,id,o);return `<li class="phDir${on?' on':''}">${o.openEntry?`<button type="button" class="phDirOpen" data-ph="open" data-id="${id}" aria-label="Open ${esc(t)} in the atlas">${thumb(p,id,o)}</button>`:thumb(p,id,o)}<div class="phDirText"><b><small>${id}</small> ${esc(t)}</b>${E?`<label class="phNote">Note<textarea data-ph-note="${id}" maxlength="1500" rows="2">${esc(p.notes[id]||'')}</textarea></label>`:(p.notes[id]?`<span>${esc(p.notes[id])}</span>`:'')}</div>${ed?`<div class="phDirAct"><button type="button" class="phStar" data-ph="star" data-id="${id}" aria-pressed="${on}" aria-label="${on?'Remove '+esc(t)+' from the shortlist':'Shortlist '+esc(t)}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>${on?'Shortlisted':'Shortlist'}</button>${E?`<button type="button" class="phBtn ghost sm" data-ph="unentry" data-id="${id}" aria-label="Remove ${esc(t)} from the project">Remove</button>`:''}</div>`:(on?'<span class="phTag">Shortlisted</span>':'')}</li>`}).join('')}</ul>`:`<p class="phEmpty">${st.filter==='short'&&entries.length?'Nothing shortlisted yet. Use the star on a direction to shortlist it.':'No directions yet.'}</p>`}
   ${ed&&o.entryOptions?`<form class="phAdd" data-ph-form="entry"><label>Add an atlas entry<input list="${fid}entries" data-ph-input="entry" placeholder="Search styles, motion, components…" autocomplete="off"></label><datalist id="${fid}entries">${o.entryOptions().filter(x=>!entries.includes(x.id)).map(x=>`<option value="${x.id} · ${esc(x.title)}"></option>`).join('')}</datalist><button class="phBtn" type="submit">Add direction</button>${o.browseHref?`<a class="phBtn ghost" href="${esc(o.browseHref)}">Browse the atlas</a>`:''}</form>`:''}</section>`;

  const k=hub.kitSnap;
  const kitView=k?`<div class="phKit" style="--k-bg:${k.t.bg};--k-surface:${k.t.surface||k.t.bg};--k-ink:${k.t.ink};--k-line:${k.t.line||k.t.ink};--k-accent:${k.t.accent};--k-on:${k.t.onAccent||k.t.bg};--k-head:${esc(k.head)};--k-body:${esc(k.body)}"><div class="phKitCard"><p class="phKitNo">Kit ${esc(k.no)}</p><p class="phKitName">${esc(k.name)}</p><p class="phKitTag">${esc(k.tagline)}</p><p class="phKitType"><span>Aa</span> The quick brown fox jumps over the lazy dog.</p><span class="phKitBtn">Primary action</span></div><ul class="phSw" aria-label="${esc(k.name)} colours">${['bg','surface','ink','mute','line','accent','accent2'].filter(c=>k.t[c]).map(c=>`<li><span style="background:${k.t[c]}" aria-hidden="true"></span><b>${c==='bg'?'background':c}</b><code>${k.t[c]}</code></li>`).join('')}</ul></div><p class="phRowLinks"><a href="theme-kits.html#${esc(k.id)}">Open the full kit →</a>${ed?` <button type="button" class="phBtn ghost sm" data-ph="zip">Download kit (.zip)</button>`:''}</p>`:'<p class="phEmpty">No theme kit picked yet.</p>';
  const kitSec=(k||ed)?`<section class="phSec" aria-labelledby="${fid}kh"><${h(1)} id="${fid}kh" class="phKick">Kit</${h(1)}>${E||(!k&&ed)?`<div class="phForm phPick"><label>Theme kit<select data-ph-kit><option value="">${o.kits?'Choose a theme kit':'Loading theme kits…'}</option>${(o.kits||[]).map(x=>`<option value="${esc(x.id)}" ${x.id===hub.kit?'selected':''}>${esc(x.no+' · '+x.name)}</option>`).join('')}</select></label></div>`:''}${kitView}</section>`:'';

  const s=hub.systemSnap;
  const sysView=s?`<a class="phSys" href="${esc((o.atlasHref??'atlas.html')+'#systems?id='+s.id)}"><span class="phSysSw" aria-hidden="true">${['background','surface','ink','accent'].filter(c=>s.tokens[c]).map(c=>`<i style="background:${s.tokens[c]}"></i>`).join('')}</span><span><b><small>${esc(s.id)}</small> ${esc(s.title)}</b><span>${esc(s.desc)}</span></span><i class="phArrow">system →</i></a>`:'<p class="phEmpty">No design system picked yet.</p>';
  const sysSec=(s||ed)?`<section class="phSec" aria-labelledby="${fid}sh"><${h(1)} id="${fid}sh" class="phKick">Design system</${h(1)}>${E||(!s&&ed)?`<div class="phForm phPick"><label>Atlas design system<select data-ph-system><option value="">Choose a design system</option>${(o.systems||[]).map(x=>`<option value="${x.id}" ${x.id===hub.system?'selected':''}>${esc(x.id+' · '+x.title)}</option>`).join('')}</select></label></div>`:''}${sysView}</section>`:'';

  const row=(l,i,arr)=>`<li${l.shot?'':' class="noimg"'}>${l.url&&!E?`<a href="${esc(l.url)}">`:'<div class="phRowIn">'}${l.shot?`<img data-ph-shot="${esc(l.shot.f||'')}" ${l.shot.u?`src="${esc(l.shot.u)}"`:''} alt="" loading="lazy" width="1200" height="750">`:''}<div><b>${esc(l.title)}</b>${l.text?`<span>${esc(l.text)}</span>`:''}</div>${E?`<div class="phRowAct"><button type="button" class="phBtn ghost sm" data-ph="up" data-id="${l.id}" ${i?'':'disabled'} aria-label="Move ${esc(l.title)} up">↑</button><button type="button" class="phBtn ghost sm" data-ph="down" data-id="${l.id}" ${i<arr.length-1?'':'disabled'} aria-label="Move ${esc(l.title)} down">↓</button><button type="button" class="phBtn ghost sm" data-ph="unlink" data-id="${l.id}" aria-label="Remove ${esc(l.title)}">Remove</button></div>`:`<i>${short(l.kind)} →</i>`}${l.url&&!E?'</a>':'</div>'}</li>`;
  const linksSec=(groups.length||ed)?`<section class="phSec" aria-labelledby="${fid}lh"><${h(1)} id="${fid}lh" class="phKick">Prototypes &amp; pages</${h(1)}>${groups.map(([kk,name,ls])=>`<p class="phSub">${esc(name)}</p><ul class="phRows">${ls.map(row).join('')}</ul>`).join('')||'<p class="phEmpty">No prototypes or pages yet.</p>'}
   ${ed?`<details class="phForm phLinkForm"${E?' open':''}><summary>Add a prototype or page</summary><form data-ph-form="link"><label>Kind<select name="kind">${KINDS.map(([kk,n])=>`<option value="${kk}">${n}</option>`).join('')}</select></label><label>Title<input name="title" required maxlength="120" placeholder="Checkout prototype"></label><label class="wide">Link<input name="url" maxlength="1000" placeholder="https://… or a page on this site"></label><label class="wide">Description<input name="text" maxlength="300" placeholder="What it shows"></label><label>Screenshot image<input name="shot" type="file" accept="image/*"></label><label>or screenshot link<input name="shotUrl" maxlength="1000" placeholder="https://…/shot.png"></label><button class="phBtn" type="submit">Add to hub</button></form></details>`:''}</section>`:'';

  const filesSec=`<section class="phSec" aria-labelledby="${fid}fh"><${h(1)} id="${fid}fh" class="phKick">Files <span data-ph-count></span></${h(1)}><div class="phFiles" data-ph-files><p class="phEmpty">Loading files…</p></div>${ed&&o.addFiles?`<label class="phDrop"><input type="file" multiple data-ph-upload accept="image/*,video/mp4,video/webm,video/quicktime,application/pdf,.woff2,.ttf,.otf,.zip,.txt"><b>Add files</b><span>Images, recordings, PDFs, fonts or a zip.</span></label>`:''}</section>`;
  const notesSec=(p.decisions||ed)?`<section class="phSec" aria-labelledby="${fid}nh"><${h(1)} id="${fid}nh" class="phKick">Notes</${h(1)}>${E?`<label class="phForm wide"><span class="phSr">Notes and decisions</span><textarea data-ph-field="decisions" maxlength="4000" rows="8" placeholder="Decisions, open questions, links.">${esc(p.decisions)}</textarea></label>`:(p.decisions?`<div class="phNotes">${para(p.decisions)}</div>`:'<p class="phEmpty">No notes yet.</p>')}</section>`:'';

  el.classList.add('ph');el.classList.toggle('phEditing',E);
  el.innerHTML=head+pub+intro+featEdit+feat+dirs+kitSec+sysSec+linksSec+filesSec+notesSec+`<p class="phStatus" role="status" aria-live="polite" data-ph-status></p>`;
  if(k&&k.css&&!document.querySelector(`link[data-ph-font="${k.id}"]`)){const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?'+k.css+'&display=swap';l.dataset.phFont=k.id;document.head.appendChild(l)}
  paintFiles(el);
  if(!el._phBound){el._phBound=true;bind(el)}
  if(st.focus){const f=el.querySelector(st.focus);st.focus=null;if(f)f.focus()}
 }

 async function paintFiles(el){const st=el._ph,{p,o}=st;const box=el.querySelector('[data-ph-files]');if(!box)return;
  let files=[];try{files=o.files?await o.files(p):[]}catch(e){files=[]}
  if(st.p!==p||!box.isConnected)return;
  const count=el.querySelector('[data-ph-count]');if(count)count.textContent=files.length;
  box.innerHTML=files.length?`<ul class="phFileGrid">${files.map(f=>{const kind=(f.type||'').split('/')[0];return `<li><a href="${esc(f.url||'#')}" target="_blank" rel="noopener" class="phFilePrev" aria-label="Open ${esc(f.name)}">${kind==='image'&&f.url?`<img src="${esc(f.url)}" alt="" loading="lazy">`:kind==='video'&&f.url?`<video src="${esc(f.url)}" muted playsinline preload="metadata"></video>`:`<span>${esc((f.name.split('.').pop()||'file').slice(0,5).toUpperCase())}</span>`}</a><b title="${esc(f.name)}">${esc(f.name)}</b><small>${size(f.size)}${f.state?' · '+esc(f.state):''}</small>${o.editable&&o.removeFile?`<button type="button" class="phBtn ghost sm" data-ph="unfile" data-id="${esc(f.id)}" aria-label="Remove ${esc(f.name)}">Remove</button>`:''}</li>`}).join('')}</ul>`:'<p class="phEmpty">No files yet.</p>';
  /* screenshots that point at project files */
  const map=new Map(files.map(f=>[f.id,f.url]));
  for(const img of el.querySelectorAll('img[data-ph-shot]')){const id=img.dataset.phShot;if(!id)continue;const u=map.get(id)||(o.fileURL?await o.fileURL(p,id).catch(()=>''):'');if(u)img.src=u;else img.closest('li')?.classList.add('noimg'),img.remove()}}

 function status(el,m){const s=el.querySelector('[data-ph-status]');if(s)s.textContent=m}
 function set(p,path,v){
  if(path==='name'){p.name=String(v).trim().slice(0,100)||p.name;return}
  if(path==='brief'||path==='decisions'){p[path]=String(v).slice(0,4000);return}
  const k=path.split('.');
  p.hub[k[1]]=String(v).slice(0,k[1]==='lede'?600:120)}

 function bind(el){
  const save=(rerender,focus)=>{const st=el._ph;st.p.hub=clean(st.p.hub);st.o.save&&st.o.save(st.p);if(rerender){st.focus=focus||null;render(el,st.p,st.o)}};
  let t=null;
  el.addEventListener('input',e=>{const st=el._ph,x=e.target;
   if(x.dataset.phField){clearTimeout(t);const path=x.dataset.phField,val=x.value;if(path.startsWith('hub.feature')){const g=n=>(el.querySelector(`[data-ph-field="hub.feature.${n}"]`)||{}).value||'';const title=g('title').trim().slice(0,120);st.p.hub.feature=title?{title,text:g('text').slice(0,400),url:safeURL(g('url')),cta:(st.p.hub.feature&&st.p.hub.feature.cta)||'Open',shots:g('shots').split(/\s*\n\s*/).map(safeURL).filter(Boolean).slice(0,8)}:null}else set(st.p,path,val);t=setTimeout(()=>{save(false);status(el,'Saved.')},400)}
   if(x.dataset.phNote){clearTimeout(t);st.p.notes[x.dataset.phNote]=x.value.slice(0,1500);t=setTimeout(()=>{save(false);status(el,'Note saved.')},400)}});
  el.addEventListener('change',async e=>{const st=el._ph,x=e.target;
   if(x.matches('[data-ph-kit]')){const kit=(st.o.kits||[]).find(k=>k.id===x.value);st.p.hub.kit=kit?kit.id:'';st.p.hub.kitSnap=kit?st.o.kitSnap(kit):null;save(true,'[data-ph-kit]');status(el,kit?'Kit set to '+kit.name+'.':'Kit cleared.')}
   if(x.matches('[data-ph-system]')){const s=(st.o.systems||[]).find(k=>k.id===x.value);st.p.hub.system=s?s.id:'';st.p.hub.systemSnap=s?{id:s.id,title:s.title,desc:s.desc||'',tokens:s.tokens||{},font:s.font||''}:null;save(true,'[data-ph-system]');status(el,s?'Design system set to '+s.title+'.':'Design system cleared.')}
   if(x.matches('[data-ph-public]')){x.disabled=true;try{await st.o.setPublic(st.p,x.checked);render(el,st.p,st.o);status(el,st.p.isPublic?'This hub now has a public page.':'The public page is off.')}catch(err){x.checked=!x.checked;x.disabled=false;status(el,err.message)}}
   if(x.matches('[data-ph-upload]')&&x.files.length){const list=[...x.files];x.value='';status(el,'Adding '+list.length+' file'+(list.length>1?'s':'')+'…');await st.o.addFiles(st.p,list);status(el,'Files added.');paintFiles(el)}});
  el.addEventListener('submit',async e=>{const st=el._ph,f=e.target;e.preventDefault();
   if(f.dataset.phForm==='entry'){const inp=f.querySelector('input');const id=(inp.value.match(/^\s*([A-Z]\d\d)\b/)||[])[1]||(st.o.entryOptions().find(x=>x.title.toLowerCase()===inp.value.trim().toLowerCase())||{}).id;if(!id||!st.o.entryOptions().some(x=>x.id===id)){status(el,'Choose an entry from the list, for example “L05 · Text scramble and decode”.');return}if(!st.p.entries.includes(id))st.p.entries.push(id);st.o.snapEntry&&st.o.snapEntry(st.p,id);save(true,'[data-ph-input=entry]');status(el,'Direction added.')}
   if(f.dataset.phForm==='link'){const d=new FormData(f);const title=String(d.get('title')||'').trim();if(!title)return;const l={id:uid(),kind:d.get('kind'),title,text:String(d.get('text')||''),url:safeURL(d.get('url')),shot:null};const file=f.querySelector('[name=shot]').files[0];
    if(String(d.get('url')||'').trim()&&!l.url){status(el,'Use a link that starts with https:// or a page on this site.');return}
    if(file&&st.o.addFiles){status(el,'Adding the screenshot…');const ids=await st.o.addFiles(st.p,[file]);if(ids&&ids[0])l.shot={f:ids[0]}}else if(safeURL(d.get('shotUrl')))l.shot={u:safeURL(d.get('shotUrl'))};
    st.p.hub.links.push(l);save(true,'[data-ph-form=link] [name=title]');status(el,'“'+title+'” added to the hub.')}});
  el.addEventListener('click',async e=>{const b=e.target.closest('[data-ph]');if(!b||!el.contains(b))return;const st=el._ph,p=st.p,a=b.dataset.ph,id=b.dataset.id;
   if(a==='edit'){st.editing=!st.editing;st.focus='[data-ph=edit]';render(el,p,st.o);if(st.editing)st.o.onEdit&&st.o.onEdit();return}
   if(a==='filter'){st.filter=b.dataset.v;st.focus=`[data-ph=filter][data-v=${b.dataset.v}]`;render(el,p,st.o);return}
   if(a==='jump'){const t=document.getElementById(b.dataset.target);if(t){t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});t.focus({preventScroll:true})}return}
   if(a==='open'){st.o.openEntry&&st.o.openEntry(id);return}
   if(a==='star'){const on=p.hub.shortlist.includes(id);p.hub.shortlist=on?p.hub.shortlist.filter(x=>x!==id):[...p.hub.shortlist,id];save(true,`[data-ph=star][data-id=${id}]`);status(el,on?'Removed from the shortlist.':'Shortlisted.');return}
   if(a==='unentry'){p.entries=p.entries.filter(x=>x!==id);p.hub.shortlist=p.hub.shortlist.filter(x=>x!==id);save(true,'[data-ph=edit]');status(el,'Direction removed.');return}
   if(a==='unlink'){p.hub.links=p.hub.links.filter(l=>l.id!==id);save(true,'[data-ph=edit]');status(el,'Removed from the hub.');return}
   if(a==='up'||a==='down'){const L=p.hub.links,i=L.findIndex(l=>l.id===id);const same=L.map((l,j)=>[l,j]).filter(([l])=>l.kind===L[i].kind).map(x=>x[1]);const pos=same.indexOf(i),j=same[pos+(a==='up'?-1:1)];if(j==null)return;[L[i],L[j]]=[L[j],L[i]];save(true,`[data-ph=${a}][data-id="${id}"]`);return}
   if(a==='unfile'){if(st.o.removeFile){await st.o.removeFile(p,id);status(el,'File removed.');paintFiles(el)}return}
   if(a==='copy'){const i=el.querySelector('.phLinkOut');try{await navigator.clipboard.writeText(i.value)}catch{i.select();document.execCommand('copy')}status(el,'Link copied.');return}
   if(a==='zip'){b.disabled=true;status(el,'Building the kit zip…');try{await st.o.zipKit(p.hub.kit);status(el,'Kit downloaded.')}catch(err){status(el,err.message||'Could not build the kit zip.')}finally{b.disabled=false}return}});
 }
 window.ProjectHub={render,clean,seed,safeURL,KINDS};
})();
