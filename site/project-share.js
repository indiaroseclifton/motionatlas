'use strict';
/* Project files and sharing.
   - Files: add images, video, PDFs, fonts and more to a project (also when creating it). They are kept
     in this browser (IndexedDB) and previewed in the project.
   - Sharing: "Create share links" publishes the project and its files; a view link opens it read-only,
     an edit link lets collaborators add and remove files and edit the brief. "Update shared copy"
     sends later changes. Links carry the id (and edit key) after the #, so they never reach server logs. */
(()=>{
 const $=s=>document.querySelector(s);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const say=m=>(window.toast?window.toast(m):console.log(m));
 const size=n=>n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
 /* ---------- IndexedDB ---------- */
 let dbP=null;
 const db=()=>dbP||(dbP=new Promise((res,rej)=>{const r=indexedDB.open('atlas-project-files',1);r.onupgradeneeded=()=>{const s=r.result.createObjectStore('files',{keyPath:'id'});s.createIndex('project','project')};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));
 const tx=async(mode,fn)=>{const d=await db();return new Promise((res,rej)=>{const t=d.transaction('files',mode);const out=fn(t.objectStore('files'));t.oncomplete=()=>res(out&&out.result!==undefined?out.result:out);t.onerror=()=>rej(t.error)})};
 const Files={
  list:project=>tx('readonly',s=>s.index('project').getAll(project)).then(a=>(a||[]).sort((x,y)=>x.added-y.added)),
  add:(project,file)=>tx('readwrite',s=>s.put({id:crypto.randomUUID(),project,name:file.name,type:file.type,size:file.size,blob:file,added:Date.now()})),
  del:id=>tx('readwrite',s=>s.delete(id))};
 window.ProjectFiles=Files;
 /* ---------- keep share details on projects ---------- */
 const PA=window.ProjectAtlas;if(!PA)return;
 const baseValidate=PA.validate.bind(PA);
 PA.validate=p=>{const o=baseValidate(p);const s=p&&p.share;if(s&&/^[A-Za-z0-9_-]{16}$/.test(s.id||'')){o.share={id:s.id,key:typeof s.key==='string'?s.key.slice(0,64):'',synced:Number(s.synced)||0,uploaded:s.uploaded&&typeof s.uploaded==='object'?Object.fromEntries(Object.entries(s.uploaded).filter(([k,v])=>typeof v==='string').slice(0,400)):{}}}return o};
 if(PA.items.length){PA.load()}
 const baseDetail=PA.renderDetail.bind(PA);
 PA.renderDetail=function(){baseDetail();paint()};
 /* ---------- UI ---------- */
 const urls=new Map();
 function ensure(){const ed=$('#projectEditor');if(!ed||ed.querySelector('.psShare'))return ed;
  ed.querySelector('.projectBrief').insertAdjacentHTML('afterend',`<section class="psShare" aria-labelledby="psShareTitle"><div class="psShareHead"><div><h3 id="psShareTitle">Share this project</h3><p class="psNote" id="psShareNote"></p></div><div class="psShareActions" id="psShareActions"></div></div><div id="psLinks"></div><p class="psStatus" id="psStatus" role="status" aria-live="polite"></p></section>`);
  ed.querySelector('#projectEntries').insertAdjacentHTML('beforebegin',`<section class="projectCollection psFiles" aria-labelledby="psFilesTitle"><h3 id="psFilesTitle">Files <span id="psCount">0</span></h3><label class="psDrop" id="psDrop"><input type="file" id="psInput" multiple accept="image/*,video/mp4,video/webm,video/quicktime,application/pdf,.woff2,.ttf,.otf,.zip,.txt"><b>Add files</b><span>Drop images, video, PDFs, fonts or a zip here, or choose them. Up to 100 MB each.</span></label><div class="psGrid" id="psGrid"></div><div id="psRemote"></div></section>`);
  const drop=ed.querySelector('#psDrop');
  ed.querySelector('#psInput').addEventListener('change',e=>{addFiles([...e.target.files]);e.target.value=''});
  ['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('psOver')}));
  ['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('psOver')}));
  drop.addEventListener('drop',e=>addFiles([...(e.dataTransfer?.files||[])]));
  ed.addEventListener('click',onClick);
  return ed}
 async function addFiles(list,projectId){const p=projectId?PA.items.find(x=>x.id===projectId):PA.current();if(!p||!list.length)return;let added=0;
  for(const f of list){const bad=ShareClient.check(f);if(bad){say(bad);continue}try{await Files.add(p.id,f);added++}catch(e){say('Could not store '+f.name+' in this browser. It may be out of space.')}}
  if(added){say(added+' file'+(added>1?'s':'')+' added to '+p.name+(p.share?'. Select “Update shared copy” to share them.':'.'));if(PA.active===p.id)paint()}}
 window.ProjectFilesAdd=addFiles;
 async function paint(){const p=PA.current();const ed=ensure();if(!p||!ed)return;
  const files=await Files.list(p.id);if(PA.current()!==p)return;
  for(const [k,u] of urls){if(!files.some(f=>f.id===k)){URL.revokeObjectURL(u);urls.delete(k)}}
  const url=f=>{if(!urls.has(f.id))urls.set(f.id,URL.createObjectURL(f.blob));return urls.get(f.id)};
  ed.querySelector('#psCount').textContent=files.length;
  ed.querySelector('#psGrid').innerHTML=files.map(f=>{const kind=(f.type||'').split('/')[0];const shared=p.share&&p.share.uploaded[f.id];
   const prev=kind==='image'?`<img src="${url(f)}" alt="">`:kind==='video'?`<video src="${url(f)}" muted playsinline preload="metadata"></video>`:`<span class="psExt">${esc((f.name.split('.').pop()||'file').slice(0,5).toUpperCase())}</span>`;
   return `<figure class="psFile"><a href="${url(f)}" target="_blank" rel="noopener" class="psPrev" aria-label="Open ${esc(f.name)}">${prev}</a><figcaption><b title="${esc(f.name)}">${esc(f.name)}</b><span>${size(f.size)}${shared?' · shared':''}</span><button class="quiet" data-ps-del="${f.id}" aria-label="Remove ${esc(f.name)}">Remove</button></figcaption></figure>`}).join('')||'<p class="psEmpty">No files yet. Add mood images, screen recordings, briefs or fonts.</p>';
  renderShare(p,files)}
 async function renderShare(p,files){const st=await ShareClient.status();const note=$('#psShareNote'),act=$('#psShareActions'),links=$('#psLinks');
  if(!st.enabled){note.textContent='Sharing switches on once this site’s file storage is connected. Your project and files stay on this device until then.';act.innerHTML='';links.innerHTML='';return}
  if(!p.share){note.textContent='Create a link so other people can see this project and its files. You choose whether they can only view or can also add to it.';act.innerHTML='<button class="primary" data-ps="share">Create share links</button>';links.innerHTML='';return}
  const L=ShareClient.links(p.share.id,p.share.key);const pending=files.filter(f=>!p.share.uploaded[f.id]).length;
  note.textContent=(p.share.synced?'Shared copy last updated '+new Date(p.share.synced).toLocaleString():'Shared')+(pending?` · ${pending} new file${pending>1?'s':''} not shared yet`:'');
  act.innerHTML=`<button class="primary" data-ps="sync">Update shared copy</button><button class="secondary" data-ps="stop">Stop sharing</button>`;
  links.innerHTML=`<div class="psLink"><label for="psView">Anyone with this link can view</label><div><input id="psView" readonly value="${esc(L.view)}"><button class="secondary" data-ps-copy="psView">Copy</button><a class="quiet" href="${esc(L.view)}" target="_blank" rel="noopener">Open ↗</a></div></div>`+(L.edit?`<div class="psLink"><label for="psEdit">Anyone with this link can add files and edit the brief</label><div><input id="psEdit" readonly value="${esc(L.edit)}"><button class="secondary" data-ps-copy="psEdit">Copy</button></div></div>`:'')+`<p class="psNote">Share the edit link only with people you trust. Files are reachable by anyone who has their link.</p>`;
  try{const {share}=await ShareClient.get(p.share.id);const mine=new Set(Object.values(p.share.uploaded));const theirs=share.files.filter(f=>!mine.has(f.url));
   $('#psRemote').innerHTML=theirs.length?`<h4 class="psSub">Added by collaborators <span>${theirs.length}</span></h4><div class="psGrid">${theirs.map(f=>{const k=(f.type||'').split('/')[0];return `<figure class="psFile"><a href="${esc(f.url)}" target="_blank" rel="noopener" class="psPrev" aria-label="Open ${esc(f.name)}">${k==='image'?`<img src="${esc(f.url)}" alt="" loading="lazy">`:k==='video'?`<video src="${esc(f.url)}" muted playsinline preload="metadata"></video>`:`<span class="psExt">${esc((f.name.split('.').pop()||'').slice(0,5).toUpperCase())}</span>`}</a><figcaption><b title="${esc(f.name)}">${esc(f.name)}</b><span>${size(f.size)}${f.addedBy?' · '+esc(f.addedBy):''}</span></figcaption></figure>`}).join('')}</div>`:''}catch(e){if(e.status===404){note.textContent='The shared copy was removed. Create new links to share again.';delete p.share;PA.persist();renderShare(p,files)}}}
 const status=m=>{const s=$('#psStatus');if(s)s.textContent=m};
 const TEXT=['name','brief','decisions'];
 const differs=(a,b)=>TEXT.some(k=>(a[k]||'')!==(b[k]||''));
 async function sync(p,force){const files=await Files.list(p.id);
  if(!p.share){status('Creating share links…');const r=await ShareClient.create(p);p.share={id:r.id,key:r.key,synced:Date.now(),uploaded:{}};PA.persist()}
  else{const {share}=await ShareClient.get(p.share.id);
   if(!force&&share.updated>p.share.synced+1000&&differs(share.project,p)){const s=$('#psStatus');s.innerHTML='Someone changed the shared brief since your last update. <button class="secondary" data-ps="pull">Use their version</button> <button class="quiet" data-ps="force">Replace it with mine</button>';return}
   status('Updating the shared brief…');await ShareClient.update(p.share.id,p.share.key,{project:ShareClient.projectData(p)})}
  const todo=files.filter(f=>!p.share.uploaded[f.id]);const added=[];
  for(const [i,f] of todo.entries()){status(`Uploading ${i+1} of ${todo.length}: ${f.name}…`);const file=new File([f.blob],f.name,{type:f.type});
   const rec=await ShareClient.uploadFile(p.share.id,p.share.key,file,pc=>status(`Uploading ${i+1} of ${todo.length}: ${f.name} · ${pc}%`));added.push(rec);p.share.uploaded[f.id]=rec.url;PA.persist()}
  if(added.length)await ShareClient.update(p.share.id,p.share.key,{addFiles:added});
  p.share.synced=Date.now();PA.persist();status(added.length?`Shared. ${added.length} file${added.length>1?'s':''} uploaded.`:'Shared copy is up to date.');paint()}
 let busy=false;
 async function onClick(e){const b=e.target.closest('button');if(!b)return;const p=PA.current();if(!p)return;
  if(b.dataset.psDel){const id=b.dataset.psDel;const url=p.share&&p.share.uploaded[id];await Files.del(id);if(url){try{await ShareClient.update(p.share.id,p.share.key,{removeFiles:[url]});delete p.share.uploaded[id];PA.persist()}catch(err){say(err.message)}}say('File removed.');paint();return}
  if(b.dataset.psCopy){const i=document.getElementById(b.dataset.psCopy);try{await navigator.clipboard.writeText(i.value);say('Link copied.')}catch(_){i.select();document.execCommand('copy');say('Link copied.')}return}
  const a=b.dataset.ps;if(!a||busy)return;
  if(a==='stop'){if(b.dataset.confirm!=='1'){b.dataset.confirm='1';b.textContent='Select again to stop sharing';status('Stopping removes the shared copy and its uploaded files for everyone. Your project stays on this device.');setTimeout(()=>{if(b.isConnected){b.dataset.confirm='';b.textContent='Stop sharing'}},6000);return}
   busy=true;try{status('Removing the shared copy…');await ShareClient.stop(p.share.id,p.share.key);delete p.share;PA.persist();status('Sharing stopped. The links no longer work.');paint()}catch(err){status(err.message)}finally{busy=false}return}
  if(a==='pull'){busy=true;try{const {share}=await ShareClient.get(p.share.id);TEXT.forEach(k=>p[k]=share.project[k]);p.share.synced=share.updated;PA.persist();PA.render();status('Brought in the shared brief. Select “Update shared copy” to send your files.')}catch(err){status(err.message)}finally{busy=false}return}
  busy=true;b.disabled=true;try{PA.saveBrief(false);await sync(p,a==='force')}catch(err){status(err.message||'Sharing failed. Try again.')}finally{busy=false;b.disabled=false}}
 /* ---------- files while creating a project ---------- */
 function createForm(){const f=$('#newProjectForm');if(!f||f.querySelector('#newProjectFiles'))return;
  f.querySelector('button[type=submit]').insertAdjacentHTML('beforebegin','<label>Files (optional)<input id="newProjectFiles" type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime,application/pdf,.woff2,.ttf,.otf,.zip,.txt"><small class="psHint">Mood images, recordings, a brief. You can add more later.</small></label>');
  f.addEventListener('submit',()=>{const input=f.querySelector('#newProjectFiles');const list=[...input.files];if(!list.length)return;setTimeout(()=>{const id=PA.active;input.value='';addFiles(list,id)},0)})}
 function intro(){const i=$('#projects .intro');if(i&&!i.dataset.ps){i.dataset.ps='1';i.textContent='Give your next app or website its own collection. Bring together visual styles, components, motion, systems, saved inspiration and your own files, record your decisions, then export a design brief or share it. Projects are kept in this browser until you share them.'}}
 const start=()=>{createForm();intro();if(PA.current())paint()};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
 addEventListener('hashchange',()=>{if(location.hash.startsWith('#projects'))setTimeout(start,50)});
})();
