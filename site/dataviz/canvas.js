'use strict';
/* FlowCanvas: the studio as one live canvas. Every element (step, decision, person, system, connection module, group)
   is its own piece that you can drag, double-click to edit, connect and combine with other diagram types.
   The Mermaid source stays the single record of what exists; positions, connection details and which diagram
   type each cluster uses are saved alongside it. */
(()=>{
const $$=(r,s)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KIND_ORDER=['rect','decision','pill','data','io','sub','round','person','system','doc','note','mod_internal','mod_external','mod_flow'];
const SHAPE_FOR_KIND={rect:'rect',decision:'decision',pill:'pill',data:'data',io:'io',sub:'sub',round:'round'};
const STATUSES=[['','No status'],['have','Have'],['partial','Partial'],['dont',"Don't have"],['accent','Key step']];
const MODFIELDS=[['system','Connects to','e.g. Stripe, our CRM, a supplier'],['payload','What moves across','e.g. orders, invoices, stock counts'],['method','How it connects','',['','API','Webhook','File drop','Email','Manual','Database','Other']],['owner','Who owns it','Name or team'],['freq','How often','e.g. every order, nightly'],['creds','Where access is kept','Say where, never paste a key']];
const MSTATUS=[['planned','Planned'],['building','Building'],['live','Live'],['broken','Broken']];
const HC={ok:'#16A34A',warn:'#D97706',bad:'#DC2626'};

function create(host){
 const FE=window.FlowEngine,FP=window.FlowPresets;
 const st={pos:{},meta:{},cl:{},ct:{},frozen:false,sel:null,pending:[]};
 let last=null,raf=0,drag=null,insp=null;
 const stage=host.stage,paper=host.paper,panel=host.panel;
 const store=()=>host.save(JSON.stringify({pos:st.pos,meta:st.meta,cl:st.cl,ct:st.ct,frozen:st.frozen}));
 function setState(o){st.pos=o?.pos||{};st.meta=o?.meta||{};st.cl=o?.cl||{};st.ct=o?.ct||{};st.frozen=!!o?.frozen;st.pending=[];}
 function load(json){try{setState(json?JSON.parse(json):null);}catch{setState(null);}}
 const getState=()=>({pos:st.pos,meta:st.meta,cl:st.cl,ct:st.ct,frozen:st.frozen});

 /* ---------- model edits: parse, change, write back ---------- */
 function model(){return window.FlowEditor.fromGraph(FE.parse(host.source()));}
 function write(M){host.setSource(window.FlowEditor.toSource(M));}
 function mut(fn){const M=model();fn(M);write(M);}
 const slug=(base,taken)=>{let b=String(base||'item').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,16)||'item';if(/^\d/.test(b))b='n_'+b;if(['end','graph','flowchart','subgraph','class','style','click','direction','classdef'].includes(b))b+='_1';let id=b,k=2;while(taken(id))id=b+'_'+k++;return id;};
 const stageOf=(M,id)=>M.items.find(it=>it.type==='stage'&&it.steps.includes(id))||null;
 const takenId=M=>id=>M.nodes.has(id)||M.items.some(it=>it.type==='stage'&&it.id===id);
 const parts=cls=>{const p=String(cls||'').split('.');return {status:p[0]&&p[0]!=='none'?p[0]:'',kind:p.slice(1).find(k=>FE.KIND[k]&&FE.KIND[k].tag)||''};};
 const mkcls=(status,kind)=>kind?`${status||'none'}.${kind}`:(status||null);
 function removeNode(M,id){M.edges=M.edges.filter(e=>e.from!==id&&e.to!==id);M.nodes.delete(id);M.items=M.items.filter(it=>!(it.type==='step'&&it.id===id));M.items.forEach(it=>{if(it.type==='stage')it.steps=it.steps.filter(x=>x!==id);});}
 function addNode(kind,label,at){let id;mut(M=>{id=slug(label,takenId(M));const base=FE.KIND[kind]||{};
   const shape=base.shape||SHAPE_FOR_KIND[kind]||'rect';M.nodes.set(id,{id,label,note:'',shape,cls:base.tag?mkcls('',kind):null});M.items.push({type:'step',id});});
  if(at){st.pos[id]=at;freeze();}return id;}

 /* ---------- layout pipeline ---------- */
 function freeze(){if(st.frozen)return;st.frozen=true;if(last)for(const n of last.g.nodes.values())if(!st.pos[n.id])st.pos[n.id]={x:Math.round(n.x),y:Math.round(n.y)};}
 const overlap=(a,b,pad=14)=>a.x<b.x+b.w+pad&&a.x+a.w+pad>b.x&&a.y<b.y+b.h+pad&&a.y+a.h+pad>b.y;
 function freeSpot(g,pos,n,anchorId){const placed=[...g.nodes.values()].filter(m=>m.id!==n.id&&pos[m.id]).map(m=>({x:pos[m.id].x,y:pos[m.id].y,w:m.w,h:m.h}));
  const an=anchorId&&pos[anchorId]?g.nodes.get(anchorId):null,ax=an?pos[an.id].x:0,ay=an?pos[an.id].y:0,aw=an?an.w:n.w,ah=an?an.h:n.h;
  const cands=an?[[ax+aw+70,ay],[ax,ay+ah+60],[ax-n.w-70,ay],[ax,ay-n.h-60]]:[];
  for(const [x,y] of cands){const b={x,y,w:n.w,h:n.h};if(!placed.some(p=>overlap(b,p)))return {x:Math.round(x),y:Math.round(y)};}
  let mx=0,my=0;for(const p of placed){mx=Math.max(mx,p.x+p.w);my=Math.max(my,p.y+p.h);}
  return an?{x:Math.round(ax),y:Math.round(my+60)}:{x:0,y:Math.round(my?my+60:0)};}

 function mainType(g){const t=host.mainType();if(t&&t!=='auto')return t;const sug=window.FlowTypes?window.FlowTypes.suggest(g):[];return sug[0]?sug[0].id:'flow';}
 function build(){
  const style=host.style(),o=host.opts(),g=FE.parse(host.engineSource());
  const clusterOf=n=>st.cl[n.id]||'main',ids=[];const mem=new Map();
  for(const n of g.nodes.values()){const c=clusterOf(n);if(!mem.has(c)){mem.set(c,[]);ids.push(c);}mem.get(c).push(n);}
  if(!ids.length){ids.push('main');mem.set('main',[]);}
  const typeOf=c=>st.ct[c]||(c==='main'?mainType(g):'flow');
  FE.layout(g,style,{canvas:true,direction:o.dir,spacing:o.spacing,decision:o.decision});
  const ctx={style,t:style.t,dir:o.dir,spacing:o.spacing,decision:o.decision,groups:g.groups};
  const clusters=ids.map(c=>({id:c,type:typeOf(c),nodes:mem.get(c),edges:g.edges.filter(e=>mem.get(c).some(n=>n.id===e.from)&&mem.get(c).some(n=>n.id===e.to))}));
  const auto=FP.compose(clusters.filter(c=>c.nodes.length),ctx);
  const pos={};
  for(const n of g.nodes.values()){pos[n.id]=st.pos[n.id]||auto[n.id]||{x:0,y:0};}
  /* a diagram added to a busy canvas lands to the right of what is already there */
  if(st.pending.length){for(const c of clusters.filter(c=>st.pending.includes(c.id))){const others=[...g.nodes.values()].filter(n=>clusterOf(n)!==c.id&&st.pos[n.id]);
    const maxX=others.length?Math.max(...others.map(n=>st.pos[n.id].x+n.w)):0,r=FP.place(c.type,c.nodes,c.edges,ctx);
    for(const n of c.nodes){const p=r.pos[n.id];st.pos[n.id]=pos[n.id]={x:Math.round(p.x+(others.length?maxX+140:0)),y:Math.round(p.y)};}}
   st.pending=[];st.frozen=true;store();}
  else if(st.frozen){for(const n of g.nodes.values())if(!st.pos[n.id]){const sp=freeSpot(g,pos,n,st.sel&&g.nodes.has(st.sel)?st.sel:null);pos[n.id]=sp;st.pos[n.id]=sp;}}
  const routes={};let decor='';
  for(const c of clusters){if(!c.nodes.length)continue;const f=FP.finish(c.type,c.nodes,c.edges,pos,ctx);Object.assign(routes,f.routes);decor+=f.decor;}
  const health={},nodeTypes={};for(const c of clusters)for(const n of c.nodes)nodeTypes[n.id]=c.type;
  for(const n of g.nodes.values()){const m=st.meta[n.id];if(m&&m.analysis)health[n.id]={s:m.analysis.state,tip:m.analysis.headline};}
  return {g,style,o,pos,routes,decor,health,nodeTypes,clusters,typeOf};}

 function draw(){
  const b=build(),sel=st.sel;
  const r=FE.render(b.g,b.style,{canvas:true,positions:b.pos,routes:b.routes,decor:b.decor,health:b.health,nodeTypes:b.nodeTypes,direction:b.o.dir,spacing:b.o.spacing,decision:b.o.decision});
  let svg=r.svg;
  if(sel&&b.g.nodes.has(sel)){const n=b.g.nodes.get(sel);svg=svg.replace(/<\/svg>$/,`<rect class="fc-sel" x="${n.x-5}" y="${n.y-5}" width="${n.w+10}" height="${n.h+10}" rx="${Math.max(8,b.style.t.nodeRadius+4)}" fill="none" stroke="#5B2DFF" stroke-width="2" stroke-dasharray="5 4" pointer-events="none"/></svg>`);}
  paper.innerHTML=svg;
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const n of b.g.nodes.values()){x0=Math.min(x0,n.x);y0=Math.min(y0,n.y);x1=Math.max(x1,n.x+n.w);y1=Math.max(y1,n.y+n.h);}
  for(const grp of b.g.groups)if(!grp.empty&&grp.w!=null){x0=Math.min(x0,grp.x);y0=Math.min(y0,grp.y);x1=Math.max(x1,grp.x+grp.w);y1=Math.max(y1,grp.y+grp.h);}
  if(x0>x1){x0=y0=0;x1=y1=1;}
  last={g:b.g,style:b.style,o:b.o,pos:b.pos,routes:b.routes,decor:b.decor,clusters:b.clusters,typeOf:b.typeOf,bbox:{x0,y0,x1,y1},health:b.health,nodeTypes:b.nodeTypes,notes:r.notes};
  return last;}

 /* what the exports draw: the same positions on a framed page */
 function exportSvg(opts){const b=build();const r=FE.render(b.g,b.style,{scene:true,flow:true,positions:b.pos,routes:b.routes,decor:b.decor,direction:b.o.dir,spacing:b.o.spacing,decision:b.o.decision,title:opts.title,subtitle:opts.subtitle,showLegend:opts.showLegend});return r;}

 /* ---------- connection health, in words ---------- */
 function edgesOf(g,id){return {ins:g.edges.filter(e=>e.to===id&&e.from!==id),outs:g.edges.filter(e=>e.from===id&&e.to!==id)};}
 function analyse(id){const g=last.g,n=g.nodes.get(id),K=FE.KIND[FE.kindOf(n)]||FE.KIND.rect,m=st.meta[id]||{},{ins,outs}=edgesOf(g,id);
  const type=K.module||'internal',miss=[],improve=[],must=[];
  for(const [k,label] of [['system','who or what it connects to'],['payload','what moves across it'],['method','how it connects'],['owner','who owns it']])if(!m[k])miss.push(label);
  if(type==='external'&&!m.creds)miss.push('where access is kept');if(type==='flow'&&!m.freq)miss.push('how often it runs');
  const live=m.status==='live',broken=m.status==='broken';
  let exists,state='ok';
  if(broken){exists='It exists but is broken right now.';state='bad';}
  else if(live&&!miss.includes('how it connects')&&!miss.includes('who or what it connects to')&&ins.length&&outs.length)exists='Yes. It is described end to end and sits between other steps.';
  else if(m.status==='planned'||!m.status){exists='Not yet. It is planned, not built.';state='warn';}
  else if(miss.includes('how it connects')||miss.includes('who or what it connects to')){exists='Cannot tell. It is not clear what it connects to or how.';state='warn';}
  else{exists='Partly. It is being built.';state='warn';}
  let needed;
  if(!outs.length){needed='Probably not needed yet: nothing uses what it produces.';if(state==='ok')state='warn';}
  else if(!ins.length){needed='It is needed, but nothing feeds it. Add a step that leads in.';if(state==='ok')state='warn';}
  else needed='Needed. The steps either side depend on it.';
  if(!ins.length&&!outs.length)state='bad';
  if(state==='ok'&&(miss.length||!m.status))state='warn';
  for(const x of miss)must.push('Add '+x+'.');
  if(!m.status)must.push('Set its status (planned, building, live or broken).');
  if(type==='external'){improve.push('Add a failure path: retry once, then tell the owner.','Queue the work so a slow partner never blocks you.');must.push('Check the partner’s limits and terms.');}
  if(type==='internal'){improve.push('Write down the contract between the two sides: what is sent, what comes back.');if(m.method==='Manual'||m.method==='Email')improve.push('Replace the manual or email handoff with a direct call.');}
  if(type==='flow'){improve.push('Name one owner and a time limit for each stage.','Give it a clear start trigger and an end state.');}
  if(m.status==='live'&&!m.freq)improve.push('Note how often it runs so you can spot a stall.');
  const headline=state==='ok'?'Looks complete':state==='warn'?(miss.length?`Missing: ${miss.slice(0,2).join(', ')}${miss.length>2?'…':''}`:'Needs attention'):'Needs fixing';
  return {at:Date.now(),state,headline,exists,needed,must,improve,miss};}

 /* ---------- the inspector ---------- */
 const HO=n=>FE.healthOf(last.g,n,{health:last.health,nodeTypes:last.nodeTypes});
 const kindName=n=>{const K=FE.KIND[FE.kindOf(n)];return K?K.name:'Step';};
 const iconSvg=(K,sz=20)=>K&&K.icon?`<svg viewBox="0 0 24 24" width="${sz}" height="${sz}" fill="none" stroke="${K.tint}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${K.icon}"/></svg>`:'';
 const dotHtml=(s,tip)=>`<span class="ih" data-h="${s}" title="${esc(tip)}" aria-label="${esc(tip)}"></span>`;
 function open(kind,id,focus){insp={kind,id};st.sel=kind==='node'?id:(kind==='edge'?null:st.sel);panel.hidden=false;renderPanel(focus);if(kind==='node'&&last){draw();}}
 function close(){insp=null;panel.hidden=true;panel.innerHTML='';}
 function connRow(g,e,dir){const other=g.nodes.get(dir==='in'?e.from:e.to),H=HO(other)||{s:'ok',tip:''};
  return `<li class="ic" data-e="${e.i}"><button type="button" class="ic-head" data-act="e-open" data-e="${e.i}" aria-expanded="false">${dotHtml(H.s,H.tip)}<span class="ic-name">${esc(other.label)}</span><span class="ic-dir">${dir==='in'?'comes in':'goes out'}${e.label?' · '+esc(e.label):''}</span><span class="ic-caret" aria-hidden="true">▾</span></button>
   <div class="ic-more" hidden><label class="f">Label<input type="text" data-act="e-label" data-e="${e.i}" value="${esc(e.label||'')}" placeholder="${dir==='out'?'Yes / No / what happens':'optional'}"></label>
    <div class="two"><label class="f">Line<select data-act="e-kind" data-e="${e.i}">${[['solid','Solid'],['dashed','Dashed (optional)'],['thick','Thick (main path)']].map(([v,l])=>`<option value="${v}"${(e.kind||'solid')===v?' selected':''}>${l}</option>`).join('')}</select></label>
    <label class="f">Direction<select data-act="e-dir" data-e="${e.i}">${[['fwd','One way'],['bi','Both ways'],['none','No arrow']].map(([v,l])=>`<option value="${v}"${(e.bi?'bi':e.arrow===false?'none':'fwd')===v?' selected':''}>${l}</option>`).join('')}</select></label></div>
    <p class="note">${esc(H.tip||'')}</p>
    <div class="acts"><button type="button" class="b" data-act="e-swap" data-e="${e.i}">Reverse</button><button type="button" class="b danger" data-act="e-del" data-e="${e.i}">Remove</button></div></div></li>`;}
 function renderPanel(focus){if(!insp)return;const g=last.g;
  if(insp.kind==='node'){const n=g.nodes.get(insp.id);if(!n){close();return;}const K=FE.KIND[FE.kindOf(n)]||FE.KIND.rect,pr=parts(n.cls),m=st.meta[n.id]||{},{ins,outs}=edgesOf(g,n.id),H=HO(n)||null;
   const others=[...g.nodes.values()].filter(x=>x.id!==n.id),grp=g.groups.find(x=>x.id===n.group);
   let h=`<header class="ph"><span class="pk">${iconSvg(K,22)}</span><div><b>${esc(n.label)}</b><small>${esc(K.name)}${H?` ${dotHtml(H.s,H.tip)}`:''}</small></div><button type="button" class="x" data-act="close" aria-label="Close panel">×</button></header><div class="pb">
   <label class="f">Name<input type="text" data-act="n-label" value="${esc(n.label)}"></label>
   <label class="f">Details<textarea data-act="n-note" rows="2" placeholder="A second line shown under the name">${esc(n.note||'')}</textarea></label>
   <div class="two"><label class="f">Kind<select data-act="n-kind">${KIND_ORDER.map(k=>`<option value="${k}"${(FE.kindOf(n)===k)?' selected':''}>${esc(FE.KIND[k].name)}</option>`).join('')}</select></label>
   <label class="f">Status<select data-act="n-status">${STATUSES.map(([v,l])=>`<option value="${v}"${pr.status===v?' selected':''}>${l}</option>`).join('')}</select></label></div>`;
   if(K.module){h+=`<section class="mod"><h3>${esc(K.name)}</h3><p class="sub">Say what this connection is. The check below reads what you write.</p>`
    +MODFIELDS.map(([k,l,ph,opts])=>opts?`<label class="f">${l}<select data-act="m-${k}">${opts.map(o=>`<option${m[k]===o?' selected':''}>${o}</option>`).join('')}</select></label>`:`<label class="f">${l}<input type="text" data-act="m-${k}" value="${esc(m[k]||'')}" placeholder="${esc(ph)}"></label>`).join('')
    +`<label class="f">Status<select data-act="m-status"><option value="">Not set</option>${MSTATUS.map(([v,l])=>`<option value="${v}"${m.status===v?' selected':''}>${l}</option>`).join('')}</select></label>
     <label class="f">Notes<textarea data-act="m-notes" rows="2">${esc(m.notes||'')}</textarea></label>
     <div class="acts"><button type="button" class="b primary" data-act="m-check">Check this connection</button></div>${host.ai&&(host.ai().check||host.ai().suggest)?'<p class="note">AI is switched on in the toolbar, but no AI service is connected yet, so this uses the rule check.</p>':''}`;
    if(m.analysis){const a=m.analysis;h+=`<div class="verdict" data-h="${a.state}"><b>${dotHtml(a.state,a.headline)} ${esc(a.headline)}</b>
     <dl><dt>Does it exist?</dt><dd>${esc(a.exists)}</dd><dt>Is it needed?</dt><dd>${esc(a.needed)}</dd></dl>
     ${a.must.length?`<h4>What needs to happen</h4><ul>${a.must.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
     ${a.improve.length?`<h4>Make it better</h4><ul>${a.improve.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}<small>Rule check from what you entered.</small></div>`;}
    h+='</section>';}
   h+=`<section><h3>Connections <small>${ins.length} in · ${outs.length} out</small></h3><ul class="ics">${ins.map(e=>connRow(g,e,'in')).join('')}${outs.map(e=>connRow(g,e,'out')).join('')}</ul>${!ins.length&&!outs.length?'<p class="note">Nothing connects to this yet.</p>':''}
   <div class="add"><select data-act="c-target" aria-label="Connect to"><option value="">Connect to…</option>${others.map(x=>`<option value="${esc(x.id)}">${esc(x.label)}</option>`).join('')}</select><select data-act="c-way" aria-label="Which way"><option value="out">goes to it</option><option value="in">comes from it</option></select><button type="button" class="b" data-act="c-add">Add</button></div></section>`;
   h+=`<section><label class="f">Group<select data-act="n-group"><option value="">No group</option>${g.groups.filter(x=>x.parent==null).map(x=>`<option value="${esc(x.id.replace(/^grp_/,''))}"${grp&&(grp.id===x.id||(grp.parent&&g.groups.find(y=>y.id===grp.parent)&&g.groups.find(y=>y.id===grp.parent).id===x.id))?' selected':''}>${esc(x.title)}</option>`).join('')}</select></label>
   <div class="acts"><button type="button" class="b" data-act="n-dup">Duplicate</button><button type="button" class="b danger" data-act="n-del">Delete element</button></div></section></div>`;
   panel.innerHTML=h;}
  else if(insp.kind==='edge'){const e=g.edges.find(x=>String(x.i)===String(insp.id));if(!e){close();return;}const a=g.nodes.get(e.from),b=g.nodes.get(e.to),Ha=HO(a),Hb=HO(b);
   panel.innerHTML=`<header class="ph"><span class="pk"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h14M13 6l6 6-6 6"/></svg></span><div><b>Connection</b><small>${esc(a.label)} → ${esc(b.label)}</small></div><button type="button" class="x" data-act="close" aria-label="Close panel">×</button></header><div class="pb">
    <label class="f">Label<input type="text" data-act="e-label" data-e="${e.i}" value="${esc(e.label||'')}" placeholder="What happens along this line"></label>
    <div class="two"><label class="f">Line<select data-act="e-kind" data-e="${e.i}">${[['solid','Solid'],['dashed','Dashed (optional)'],['thick','Thick (main path)']].map(([v,l])=>`<option value="${v}"${(e.kind||'solid')===v?' selected':''}>${l}</option>`).join('')}</select></label>
    <label class="f">Direction<select data-act="e-dir" data-e="${e.i}">${[['fwd','One way'],['bi','Both ways'],['none','No arrow']].map(([v,l])=>`<option value="${v}"${(e.bi?'bi':e.arrow===false?'none':'fwd')===v?' selected':''}>${l}</option>`).join('')}</select></label></div>
    <section><h3>Ends</h3><ul class="ics"><li class="ic"><button type="button" class="ic-head" data-act="goto" data-id="${esc(a.id)}">${Ha?dotHtml(Ha.s,Ha.tip):''}<span class="ic-name">${esc(a.label)}</span><span class="ic-dir">starts here</span></button></li><li class="ic"><button type="button" class="ic-head" data-act="goto" data-id="${esc(b.id)}">${Hb?dotHtml(Hb.s,Hb.tip):''}<span class="ic-name">${esc(b.label)}</span><span class="ic-dir">ends here</span></button></li></ul></section>
    <div class="acts"><button type="button" class="b" data-act="e-swap" data-e="${e.i}">Reverse</button><button type="button" class="b danger" data-act="e-del" data-e="${e.i}">Remove connection</button></div></div>`;}
  else if(insp.kind==='group'){const grp=g.groups.find(x=>x.id===insp.id);if(!grp){close();return;}const mem=[...g.nodes.values()].filter(n=>n.group===grp.id);
   panel.innerHTML=`<header class="ph"><span class="pk"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"><rect x="3" y="4" width="18" height="16" rx="3"/></svg></span><div><b>${esc(grp.title)}</b><small>Group · ${mem.length} element${mem.length===1?'':'s'}</small></div><button type="button" class="x" data-act="close" aria-label="Close panel">×</button></header><div class="pb">
    <label class="f">Title<input type="text" data-act="g-title" value="${esc(grp.title)}"></label>
    <section><h3>Inside</h3><ul class="ics">${mem.map(n=>{const H=HO(n);return `<li class="ic"><button type="button" class="ic-head" data-act="goto" data-id="${esc(n.id)}">${H?dotHtml(H.s,H.tip):''}<span class="ic-name">${esc(n.label)}</span><span class="ic-dir">${esc(kindName(n))}</span></button></li>`;}).join('')||'<li class="note">Empty</li>'}</ul></section>
    <div class="acts"><button type="button" class="b danger" data-act="g-del">Ungroup</button></div></div>`;}
  if(focus){const el=panel.querySelector(focus);if(el){el.focus();if(el.select)el.select();}}}

 /* ---------- panel events ---------- */
 const idOfEdge=(M,i)=>{const g=last.g,e=g.edges.find(x=>String(x.i)===String(i));return e?M.edges.findIndex(x=>x.from===e.from&&x.to===e.to&&(x.label||'')===(e.label||'')):-1;};
 function after(fnRedraw=true){const keep=document.activeElement&&panel.contains(document.activeElement)?document.activeElement.getAttribute('data-act')+'|'+(document.activeElement.getAttribute('data-e')||''):null;host.rerender();if(fnRedraw&&insp)renderPanel();if(keep&&panel){const [a,e]=keep.split('|');const el=panel.querySelector(`[data-act="${a}"]${e?`[data-e="${e}"]`:''}`);if(el&&/INPUT|TEXTAREA/.test(el.tagName)){el.focus();try{const l=el.value.length;el.setSelectionRange(l,l);}catch{}}}}
 let typing=0;
 panel.addEventListener('input',ev=>{const el=ev.target,a=el.dataset.act;if(!a||!insp)return;
  if(insp.kind==='node'){const id=insp.id;
   if(a==='n-label'){mut(M=>{M.nodes.get(id).label=el.value||'Untitled';});after(false);}
   else if(a==='n-note'){mut(M=>{M.nodes.get(id).note=el.value;});after(false);}
   else if(a.startsWith('m-')&&el.tagName!=='SELECT'){const k=a.slice(2);(st.meta[id]=st.meta[id]||{})[k]=el.value;store();}}
  if(a==='e-label'){const i=el.dataset.e;mut(M=>{const k=idOfEdge(M,i);if(k>=0)M.edges[k].label=el.value;});after(false);}
  if(a==='g-title'){mut(M=>{const it=M.items.find(x=>x.type==='stage'&&('grp_'+x.id)===insp.id);if(it)it.title=el.value||'Group';});after(false);}});
 panel.addEventListener('change',ev=>{const el=ev.target,a=el.dataset.act;if(!a||!insp)return;
  if(insp.kind==='node'){const id=insp.id;
   if(a==='n-kind'){const kind=el.value,base=FE.KIND[kind]||{};mut(M=>{const n=M.nodes.get(id),p=parts(n.cls);n.shape=base.shape||SHAPE_FOR_KIND[kind]||'rect';n.cls=mkcls(p.status,base.tag?kind:'');});after();}
   else if(a==='n-status'){mut(M=>{const n=M.nodes.get(id),p=parts(n.cls);n.cls=mkcls(el.value,p.kind);});after();}
   else if(a==='n-group'){mut(M=>{const from=stageOf(M,id);if(from)from.steps=from.steps.filter(x=>x!==id);else M.items=M.items.filter(it=>!(it.type==='step'&&it.id===id));const to=M.items.find(it=>it.type==='stage'&&it.id===el.value);if(to)to.steps.push(id);else M.items.push({type:'step',id});});after();}
   else if(a.startsWith('m-')){const k=a.slice(2);(st.meta[id]=st.meta[id]||{})[k]=el.value;store();}}
  if(a==='e-kind'){mut(M=>{const k=idOfEdge(M,el.dataset.e);if(k>=0)M.edges[k].kind=el.value;});after();}
  if(a==='e-dir'){mut(M=>{const k=idOfEdge(M,el.dataset.e);if(k>=0){M.edges[k].bi=el.value==='bi';M.edges[k].arrow=el.value!=='none';}});after();}});
 panel.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b||!insp)return;const a=b.dataset.act;
  if(a==='close'){close();st.sel=null;draw();return;}
  if(a==='goto'){open('node',b.dataset.id);return;}
  if(a==='e-open'){const li=b.closest('.ic'),more=li.querySelector('.ic-more');more.hidden=!more.hidden;b.setAttribute('aria-expanded',String(!more.hidden));return;}
  if(a==='e-del'){mut(M=>{const k=idOfEdge(M,b.dataset.e);if(k>=0)M.edges.splice(k,1);});if(insp.kind==='edge')close();after();return;}
  if(a==='e-swap'){mut(M=>{const k=idOfEdge(M,b.dataset.e);if(k>=0){const e=M.edges[k];[e.from,e.to]=[e.to,e.from];}});after();return;}
  if(a==='c-add'){const t=panel.querySelector('[data-act=c-target]').value,w=panel.querySelector('[data-act=c-way]').value;if(!t)return;
   mut(M=>{M.edges.push(w==='out'?{from:insp.id,to:t,label:'',kind:'solid',arrow:true}:{from:t,to:insp.id,label:'',kind:'solid',arrow:true});});after();return;}
  if(a==='n-del'){const id=insp.id;mut(M=>removeNode(M,id));delete st.pos[id];delete st.meta[id];store();close();st.sel=null;host.rerender();return;}
  if(a==='n-dup'){const src=last.g.nodes.get(insp.id),p=st.pos[insp.id]||{x:src.x,y:src.y};let nid;mut(M=>{const n=M.nodes.get(insp.id);nid=slug(n.label,takenId(M));M.nodes.set(nid,{...n,id:nid,label:n.label+' copy'});const s0=stageOf(M,insp.id);if(s0)s0.steps.push(nid);else M.items.push({type:'step',id:nid});});
   st.pos[nid]={x:Math.round(p.x+40),y:Math.round(p.y+src.h+40)};if(st.meta[insp.id])st.meta[nid]=JSON.parse(JSON.stringify({...st.meta[insp.id],analysis:undefined}));freeze();store();host.rerender();open('node',nid,'[data-act=n-label]');return;}
  if(a==='m-check'){const id=insp.id;(st.meta[id]=st.meta[id]||{}).analysis=analyse(id);store();host.rerender();renderPanel();return;}
  if(a==='g-del'){mut(M=>{const i=M.items.findIndex(x=>x.type==='stage'&&('grp_'+x.id)===insp.id);if(i>=0){const s0=M.items[i];M.items.splice(i,1,...s0.steps.map(x=>({type:'step',id:x})));}});close();host.rerender();return;}});
 panel.addEventListener('keydown',ev=>{if(ev.key==='Escape'){close();st.sel=null;draw();stage.focus?.();}});

 /* ---------- stage interactions: drag elements, double-click to edit, pan ---------- */
 const mode=()=>host.mode()==='canvas';
 const world=ev=>{const r=stage.getBoundingClientRect(),v=host.view();return {x:(ev.clientX-r.left-v.x)/v.zoom,y:(ev.clientY-r.top-v.y)/v.zoom};};
 const target=ev=>{let t=ev.target;if(t===stage||!t.closest||!t.closest('.fc-n,.fc-e,.fc-l,.fc-g')){const u=document.elementFromPoint(ev.clientX,ev.clientY);if(u)t=u;}
  return {n:t.closest&&t.closest('.fc-n'),e:t.closest&&t.closest('.fc-e,.fc-l'),g:t.closest&&t.closest('.fc-g'),ui:ev.target.closest&&ev.target.closest('.zoom,.motion,.cvbar,.insp,.styleinfo')};};
 let tap=null;
 stage.addEventListener('pointerdown',ev=>{if(!mode()||ev.button>0)return;const T=target(ev);if(T.ui)return;
  if(T.n&&!ev.target.closest('.fc-h')){const id=T.n.dataset.nid,n=last&&last.g.nodes.get(id);if(!n)return;const p=st.pos[id]||last.pos[id]||{x:n.x,y:n.y};
   drag={kind:'node',id,start:world(ev),orig:{x:p.x,y:p.y},ox:ev.clientX,oy:ev.clientY,moved:false,pid:ev.pointerId};stage.setPointerCapture(ev.pointerId);ev.stopPropagation();return;}
  if(T.g&&!T.e){const gid=T.g.dataset.gid,mem=last?[...last.g.nodes.values()].filter(n=>{let x=n.group;while(x){if(x===gid)return true;const gg=last.g.groups.find(y=>y.id===x);x=gg?gg.parent:null;}return false;}):[];
   drag={kind:'group',id:gid,start:world(ev),orig:Object.fromEntries(mem.map(n=>[n.id,{x:(st.pos[n.id]||last.pos[n.id]).x,y:(st.pos[n.id]||last.pos[n.id]).y}])),ox:ev.clientX,oy:ev.clientY,moved:false,pid:ev.pointerId};stage.setPointerCapture(ev.pointerId);ev.stopPropagation();return;}
  if(T.e){st.sel=null;ev.stopPropagation();const eid=T.e.dataset.eid;drag={kind:'edge',id:eid,ox:ev.clientX,oy:ev.clientY,moved:false};return;}
  drag={kind:'pan',ox:ev.clientX,oy:ev.clientY,sx:host.view().x,sy:host.view().y,moved:false,pid:ev.pointerId};stage.classList.add('drag');stage.setPointerCapture(ev.pointerId);});
 stage.addEventListener('pointermove',ev=>{if(!drag||!mode())return;const dx=ev.clientX-drag.ox,dy=ev.clientY-drag.oy;if(!drag.moved&&Math.hypot(dx,dy)<4)return;drag.moved=true;
  if(drag.kind==='pan'){host.pan(drag.sx+dx,drag.sy+dy);return;}
  if(drag.kind==='node'||drag.kind==='group'){freeze();const w=world(ev),mx=w.x-drag.start.x,my=w.y-drag.start.y;
   if(drag.kind==='node'){st.pos[drag.id]={x:Math.round((drag.orig.x+mx)/2)*2,y:Math.round((drag.orig.y+my)/2)*2};}
   else for(const [id,o] of Object.entries(drag.orig))st.pos[id]={x:Math.round(o.x+mx),y:Math.round(o.y+my)};
   if(!raf)raf=requestAnimationFrame(()=>{raf=0;host.rerender(true);});}});
 stage.addEventListener('pointerup',ev=>{if(!drag||!mode())return;const d=drag;drag=null;stage.classList.remove('drag');try{stage.releasePointerCapture(ev.pointerId);}catch{}
  if(d.moved){if(d.kind==='node'||d.kind==='group'){store();host.rerender();}return;}
  if(d.kind==='node'){const now=performance.now();const dbl=tap&&tap.id===d.id&&now-tap.t<420;tap={id:d.id,t:now};st.sel=d.id;host.rerender(true);if(dbl){tap=null;open('node',d.id,'[data-act=n-label]');}else if(insp)open('node',d.id);}
  else if(d.kind==='edge'){const now=performance.now();const dbl=tap&&tap.id==='e'+d.id&&now-tap.t<420;tap={id:'e'+d.id,t:now};if(dbl||insp){tap=null;open('edge',d.id);}}
  else{st.sel=null;if(!ev.target.closest('.insp'))close();host.rerender(true);}});
 stage.addEventListener('dblclick',ev=>{if(!mode())return;const T=target(ev);if(T.ui)return;ev.preventDefault();
  if(T.n){open('node',T.n.dataset.nid,'[data-act=n-label]');}
  else if(T.e){open('edge',T.e.dataset.eid);}
  else if(T.g){open('group',T.g.dataset.gid,'[data-act=g-title]');}});
 stage.addEventListener('keydown',ev=>{if(!mode())return;const n=ev.target.closest&&ev.target.closest('.fc-n');
  if(n&&ev.key==='Enter'){open('node',n.dataset.nid,'[data-act=n-label]');ev.preventDefault();}
  if(n&&(ev.key==='Delete'||ev.key==='Backspace')){const id=n.dataset.nid;mut(M=>removeNode(M,id));delete st.pos[id];store();close();st.sel=null;host.rerender();ev.preventDefault();}
  if(ev.key==='Escape'&&insp){close();st.sel=null;draw();}});
 stage.addEventListener('focusin',ev=>{if(!mode())return;const n=ev.target.closest&&ev.target.closest('.fc-n');if(n&&st.sel!==n.dataset.nid){st.sel=n.dataset.nid;}});

 /* ---------- adding and combining ---------- */
 function addElement(kind){const K=FE.KIND[kind]||{};let at=null;const v=host.view(),r=stage.getBoundingClientRect();
  const cx=(r.width/2-v.x)/v.zoom,cy=(r.height/2-v.y)/v.zoom;at={x:Math.round(cx-(K.w||176)/2),y:Math.round(cy-(K.h||68)/2)};
  if(last){const g=last.g,pos=Object.fromEntries([...g.nodes.values()].map(n=>[n.id,st.pos[n.id]||last.pos[n.id]||{x:n.x,y:n.y}]));
   const probe={id:'__new',w:K.w||176,h:K.h||68};let tries=0;const taken=(p)=>[...g.nodes.values()].some(m=>pos[m.id]&&overlap({x:p.x,y:p.y,w:probe.w,h:probe.h},{x:pos[m.id].x,y:pos[m.id].y,w:m.w,h:m.h}));
   while(taken(at)&&tries++<40)at={x:at.x+30,y:at.y+30};}
  const id=addNode(kind,K.name||'New element',at);st.sel=id;host.rerender();open('node',id,'[data-act=n-label]');return id;}
 function addDiagram(tpl){const M=model(),T=window.FlowEngine.parse(tpl.src),prefix='d'+(Object.keys(st.ct).length+2)+'_',cid='x'+(Object.keys(st.ct).length+2);
  const map=new Map();const Mt=window.FlowEditor.fromGraph(T);
  for(const [id,n] of Mt.nodes){const nid=prefix+id;map.set(id,nid);M.nodes.set(nid,{...n,id:nid});st.cl[nid]=cid;}
  for(const it of Mt.items){if(it.type==='stage')M.items.push({type:'stage',id:prefix+it.id,title:it.title,steps:it.steps.map(x=>map.get(x))});else M.items.push({type:'step',id:map.get(it.id)});}
  for(const e of Mt.edges)M.edges.push({...e,from:map.get(e.from),to:map.get(e.to)});
  st.ct[cid]=tpl.type;st.pending.push(cid);write(M);store();host.rerender();return cid;}
 function setClusterType(cid,type){if(cid==='main'){host.setMainType(type);}else st.ct[cid]=type;for(const n of (last?last.g.nodes.values():[]))if((st.cl[n.id]||'main')===cid)delete st.pos[n.id];if(!Object.keys(st.pos).length)st.frozen=false;store();host.rerender();}
 function removeCluster(cid){if(cid==='main')return;mut(M=>{for(const id of [...M.nodes.keys()])if(st.cl[id]===cid)removeNode(M,id);});for(const id of Object.keys(st.cl))if(st.cl[id]===cid){delete st.cl[id];delete st.pos[id];delete st.meta[id];}delete st.ct[cid];store();host.rerender();}

 return {draw,exportSvg,load,getState,setState,store,reset(){setState(null);close();},open,close,addElement,addDiagram,setClusterType,removeCluster,
  clusters:()=>last?last.clusters.map(c=>({id:c.id,type:c.type,count:c.nodes.length})):[],
  last:()=>last,select(id){st.sel=id;},get frozen(){return st.frozen;},unfreeze(){st.pos={};st.frozen=false;store();host.rerender();},
  inspectorOpen:()=>!!insp,refreshPanel(){if(insp)renderPanel();}};
}
window.FlowCanvas={create};
})();
