'use strict';
/* FlowCanvas: the studio as one live canvas. Every element (step, decision, person, system, worker, connection module,
   group) is its own piece: drag it, select several, copy and paste, undo, connect it, double-click to edit it.
   The Mermaid source stays the single record of what exists; positions, connection details, workers and which
   diagram type each cluster uses are saved alongside it. */
(()=>{
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KIND_ORDER=['rect','decision','pill','data','io','sub','round','doc','delay','manual','minput','display','offpage','person','system','note','worker','mod_internal','mod_external','mod_flow'];
const SHAPE_FOR_KIND={rect:'rect',decision:'decision',pill:'pill',data:'data',io:'io',sub:'sub',round:'round'};
const STATUSES=[['','No status'],['have','Have'],['partial','Partial'],['dont',"Don't have"],['accent','Key step']];
const MODFIELDS=[['system','Connects to','e.g. Stripe, our CRM, a supplier'],['payload','What moves across','e.g. orders, invoices, stock counts'],['method','How it connects','',['','API','Webhook','File drop','Email','Manual','Database','Other']],['owner','Who owns it','Name or team'],['freq','How often','e.g. every order, nightly'],['creds','Where access is kept','Say where, never paste a key']];
const MSTATUS=[['planned','Planned'],['building','Building'],['live','Live'],['broken','Broken']];
const WSTATUS=[['idle','Idle'],['running','Running'],['paused','Paused'],['broken','Broken']];
const TRIGGERS=[['','Not set'],['prev','When the step before it finishes'],['request','When a client request arrives'],['schedule','On a schedule'],['manual','When someone starts it']];
const EDIRS=[['fwd','Arrow, one way'],['bi','Arrows both ways'],['o','Ends in a circle'],['x','Ends in a cross'],['none','Plain line']];
const edir=e=>e.head&&!e.bi?e.head:e.bi?'bi':e.arrow===false?'none':'fwd';
const MOD=navigator.platform&&/mac|iphone|ipad/i.test(navigator.platform)?'⌘':'Ctrl+';

function create(host){
 const FE=window.FlowEngine,FP=window.FlowPresets;
 const st={pos:{},size:{},meta:{},cl:{},ct:{},frozen:false,pending:[]};
 let sel=new Set(),selEdge=null,primary=null,clip=null,pasteN=0,snapOn=false,guides=null;const GRID=24;
 let last=null,raf=0,drag=null,insp=null,menu=null,tap=null,press=null;
 const stage=host.stage,paper=host.paper,panel=host.panel;
 stage.tabIndex=0;
 const store=()=>host.save(JSON.stringify(getState()));
 function setState(o){st.pos=o?.pos||{};st.size=o?.size||{};st.meta=o?.meta||{};st.cl=o?.cl||{};st.ct=o?.ct||{};st.frozen=!!o?.frozen;st.pending=[];}
 function load(json){try{setState(json?JSON.parse(json):null);}catch{setState(null);}hist.u=[];hist.r=[];notify();}
 const getState=()=>({pos:st.pos,size:st.size,meta:st.meta,cl:st.cl,ct:st.ct,frozen:st.frozen});

 /* ---------- history ---------- */
 const hist={u:[],r:[],key:null,t:0};
 const notify=()=>host.history&&host.history(hist.u.length>0,hist.r.length>0);
 const snap=()=>({src:host.source(),state:JSON.stringify(getState()),sel:[...sel]});
 function pushUndo(key){const now=performance.now();if(key&&hist.key===key&&now-hist.t<900){hist.t=now;return;}hist.key=key||null;hist.t=now;hist.u.push(snap());if(hist.u.length>150)hist.u.shift();hist.r=[];notify();}
 function restore(sn){setState(JSON.parse(sn.state));store();sel=new Set(sn.sel);selEdge=null;primary=[...sel][0]||null;host.setSource(sn.src);if(insp)renderPanel();}
 function undo(){if(!hist.u.length){host.toast('Nothing to undo');return;}hist.r.push(snap());restore(hist.u.pop());notify();}
 function redo(){if(!hist.r.length){host.toast('Nothing to redo');return;}hist.u.push(snap());restore(hist.r.pop());notify();}

 /* ---------- model edits: parse, change, write back ---------- */
 function model(){return window.FlowEditor.fromGraph(FE.parse(host.source()));}
 function write(M){host.setSource(window.FlowEditor.toSource(M));}
 function mut(fn,key){pushUndo(key);const M=model();fn(M);write(M);}
 const slug=(base,taken)=>{let b=String(base||'item').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,16)||'item';if(/^\d/.test(b))b='n_'+b;if(['end','graph','flowchart','subgraph','class','style','click','direction','classdef'].includes(b))b+='_1';let id=b,k=2;while(taken(id))id=b+'_'+k++;return id;};
 const stageOf=(M,id)=>M.items.find(it=>it.type==='stage'&&it.steps.includes(id))||null;
 const takenId=M=>id=>M.nodes.has(id)||M.items.some(it=>it.type==='stage'&&it.id===id);
 const parts=cls=>{const p=String(cls||'').split('.');return {status:p[0]&&p[0]!=='none'?p[0]:'',kind:p.slice(1).find(k=>FE.KIND[k]&&FE.KIND[k].tag)||''};};
 const mkcls=(status,kind)=>kind?`${status||'none'}.${kind}`:(status||null);
 const kindShape=kind=>(FE.KIND[kind]&&FE.KIND[kind].shape)||SHAPE_FOR_KIND[kind]||'rect';
 const newNode=(M,id,label,kind,note)=>{const base=FE.KIND[kind]||{};M.nodes.set(id,{id,label,note:note||'',shape:kindShape(kind),cls:base.tag?mkcls('',kind):null});M.items.push({type:'step',id});};
 function removeNode(M,id){M.edges=M.edges.filter(e=>e.from!==id&&e.to!==id);M.nodes.delete(id);M.items=M.items.filter(it=>!(it.type==='step'&&it.id===id));M.items.forEach(it=>{if(it.type==='stage')it.steps=it.steps.filter(x=>x!==id);});}
 const posOf=id=>st.pos[id]||(last&&last.pos[id])||null;

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
  FE.layout(g,style,{canvas:true,sizes:st.size,direction:o.dir,spacing:o.spacing,decision:o.decision});
  const ctx={style,t:style.t,dir:o.dir,spacing:o.spacing,decision:o.decision,groups:g.groups};
  const clusters=ids.map(c=>({id:c,type:typeOf(c),nodes:mem.get(c),edges:g.edges.filter(e=>mem.get(c).some(n=>n.id===e.from)&&mem.get(c).some(n=>n.id===e.to))}));
  const auto=FP.compose(clusters.filter(c=>c.nodes.length),ctx);
  const pos={};
  for(const n of g.nodes.values()){pos[n.id]=st.pos[n.id]||auto[n.id]||{x:0,y:0};}
  if(st.pending.length){for(const c of clusters.filter(c=>st.pending.includes(c.id))){const others=[...g.nodes.values()].filter(n=>clusterOf(n)!==c.id&&st.pos[n.id]);
    const maxX=others.length?Math.max(...others.map(n=>st.pos[n.id].x+n.w)):0,r=FP.place(c.type,c.nodes,c.edges,ctx);
    for(const n of c.nodes){const p=r.pos[n.id];st.pos[n.id]=pos[n.id]={x:Math.round(p.x+(others.length?maxX+140:0)),y:Math.round(p.y)};}}
   st.pending=[];st.frozen=true;store();}
  else if(st.frozen){for(const n of g.nodes.values())if(!st.pos[n.id]){const sp=freeSpot(g,pos,n,primary&&g.nodes.has(primary)?primary:null);pos[n.id]=sp;st.pos[n.id]=sp;}}
  const routes={};let decor='';
  for(const c of clusters){if(!c.nodes.length)continue;const f=FP.finish(c.type,c.nodes,c.edges,pos,ctx);Object.assign(routes,f.routes);decor+=f.decor;}
  const health={},nodeTypes={},badges={},tips={};for(const c of clusters)for(const n of c.nodes)nodeTypes[n.id]=c.type;
  for(const n of g.nodes.values()){const m=st.meta[n.id]||{},K=FE.KIND[FE.kindOf(n)]||{};
   if(m.analysis)health[n.id]={s:m.analysis.state,tip:m.analysis.headline};
   if(K.worker){const w=m.wstatus||'idle';badges[n.id]='×'+(m.count||1);tips[n.id]=m.role||'';
    if(w==='running')health[n.id]={s:'ok',tip:`Running · ${m.count||1} at once`};else if(w==='paused')health[n.id]={s:'warn',tip:'Paused'};else if(w==='broken')health[n.id]={s:'bad',tip:'Broken'};}
   else if(K.module&&(m.payload||m.system))tips[n.id]=[m.system,m.payload].filter(Boolean).join(' · ');
   if(m.kick&&m.trigger)tips[n.id]=(tips[n.id]?tips[n.id]+'. ':'')+'Kick-starts: '+m.kick;}
  return {g,style,o,pos,routes,decor,health,nodeTypes,badges,tips,clusters,typeOf};}

 function draw(){
  const hadFocus=stage.contains(document.activeElement)&&document.activeElement!==stage;
  const b=build();
  const r=FE.render(b.g,b.style,{canvas:true,sizes:st.size,positions:b.pos,routes:b.routes,decor:b.decor,health:b.health,nodeTypes:b.nodeTypes,badges:b.badges,tips:b.tips,direction:b.o.dir,spacing:b.o.spacing,decision:b.o.decision});
  paper.innerHTML=r.svg.replace(/<\/svg>$/,'<g class="fc-ov"></g></svg>');
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const n of b.g.nodes.values()){x0=Math.min(x0,n.x);y0=Math.min(y0,n.y);x1=Math.max(x1,n.x+n.w);y1=Math.max(y1,n.y+n.h);}
  for(const grp of b.g.groups)if(!grp.empty&&grp.w!=null){x0=Math.min(x0,grp.x);y0=Math.min(y0,grp.y);x1=Math.max(x1,grp.x+grp.w);y1=Math.max(y1,grp.y+grp.h);}
  if(x0>x1){x0=y0=0;x1=y1=1;}
  last={g:b.g,style:b.style,o:b.o,pos:b.pos,routes:b.routes,decor:b.decor,clusters:b.clusters,typeOf:b.typeOf,bbox:{x0,y0,x1,y1},health:b.health,nodeTypes:b.nodeTypes,notes:r.notes};
  for(const id of [...sel])if(!b.g.nodes.has(id))sel.delete(id);
  if(primary&&!b.g.nodes.has(primary))primary=[...sel][0]||null;
  paintOverlay();
  if(hadFocus&&primary){const el=paper.querySelector(`.fc-n[data-nid="${CSS.escape(primary)}"]`);if(el)el.focus({preventScroll:true});}
  return last;}

 /* what the exports draw: the same positions on a framed page */
 function exportSvg(opts){const b=build();return FE.render(b.g,b.style,{scene:true,flow:true,sizes:st.size,positions:b.pos,routes:b.routes,decor:b.decor,direction:b.o.dir,spacing:b.o.spacing,decision:b.o.decision,title:opts.title,subtitle:opts.subtitle,showLegend:opts.showLegend});}

 /* ---------- selection and overlay ---------- */
 const edgeKey=e=>e.from+'>'+e.to;
 const findEdge=key=>last&&last.g.edges.find(e=>edgeKey(e)===key);
 function setSel(ids,edge){sel=new Set(ids);selEdge=edge||null;primary=[...sel][0]||null;paintOverlay();if(insp&&sel.size===1&&!selEdge)open('node',primary);host.selection&&host.selection(sel.size,!!selEdge,selEdge);}
 function paintOverlay(tmp){const ov=paper.querySelector('.fc-ov');if(!ov||!last)return;const z=Math.max(.25,host.view().zoom),acc='#111113';let h='';
  const hr=Math.max(6,8/z);
  for(const id of sel){const n=last.g.nodes.get(id);if(!n)continue;h+=`<rect x="${n.x-5}" y="${n.y-5}" width="${n.w+10}" height="${n.h+10}" rx="${Math.max(8,(last.style.t.nodeRadius||8)+4)}" fill="none" stroke="${acc}" stroke-width="${2/Math.min(1,z)*.7+.6}" stroke-dasharray="5 4" pointer-events="none"/>`;}
  if(guides&&drag)for(const gd of guides)h+=gd.v?`<line x1="${gd.at}" x2="${gd.at}" y1="${gd.a-16}" y2="${gd.b+16}" stroke="#E5398F" stroke-width="${1.2/Math.min(1,z)}" stroke-dasharray="4 3" pointer-events="none"/>`:`<line y1="${gd.at}" y2="${gd.at}" x1="${gd.a-16}" x2="${gd.b+16}" stroke="#E5398F" stroke-width="${1.2/Math.min(1,z)}" stroke-dasharray="4 3" pointer-events="none"/>`;
  if(!canEdit()){ov.innerHTML=h;return;}
  if(sel.size===1&&!selEdge&&!tmp){const n=last.g.nodes.get(primary);if(n){for(const [sd,x,y] of [['t',n.x+n.w/2,n.y-14],['b',n.x+n.w/2,n.y+n.h+14],['l',n.x-14,n.y+n.h/2],['r',n.x+n.w+14,n.y+n.h/2]])
   h+=`<g class="fc-handle" data-side="${sd}" data-nid="${esc(n.id)}"><title>Drag to another element to connect. Drop on empty space to add a new one.</title><circle cx="${x}" cy="${y}" r="${hr*1.9}" fill="transparent"/><circle cx="${x}" cy="${y}" r="${hr}" fill="#fff" stroke="${acc}" stroke-width="2"/><path d="M${x-hr*.45} ${y}H${x+hr*.45}M${x} ${y-hr*.45}V${y+hr*.45}" stroke="${acc}" stroke-width="1.6" stroke-linecap="round"/></g>`;}}
  if(sel.size===1&&!selEdge&&!tmp){const n=last.g.nodes.get(primary);if(n){const rs=hr*1.15;
   for(const [c,x,y] of [['nw',n.x,n.y],['ne',n.x+n.w,n.y],['sw',n.x,n.y+n.h],['se',n.x+n.w,n.y+n.h]])
    h+=`<g class="fc-rz" data-corner="${c}" data-nid="${esc(n.id)}"><title>Drag to resize. Double-click to reset the size.</title><rect x="${x-rs*1.9}" y="${y-rs*1.9}" width="${rs*3.8}" height="${rs*3.8}" fill="transparent"/><rect x="${x-rs}" y="${y-rs}" width="${rs*2}" height="${rs*2}" rx="2.5" fill="#fff" stroke="${acc}" stroke-width="2"/></g>`;}}
  if(selEdge&&!tmp){const e=findEdge(selEdge);if(e&&e.xy){const d='M'+e.xy.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L');
   h+=`<path d="${d}" fill="none" stroke="${acc}" stroke-width="${4/Math.min(1,z)}" stroke-opacity=".35" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>`;
   const a=e.xy[0],b=e.xy[e.xy.length-1];
   for(const [end,p] of [['from',a],['to',b]])h+=`<g class="fc-ehandle" data-end="${end}" data-ekey="${esc(selEdge)}"><title>Drag to another element to reconnect. Drop on empty space to disconnect.</title><circle cx="${p[0]}" cy="${p[1]}" r="${hr*1.9}" fill="transparent"/><circle cx="${p[0]}" cy="${p[1]}" r="${hr}" fill="#fff" stroke="${acc}" stroke-width="2.4"/></g>`;}}
  if(tmp){h+=`<path d="M${tmp.x1} ${tmp.y1}L${tmp.x2} ${tmp.y2}" fill="none" stroke="${acc}" stroke-width="${2.4/Math.min(1,z)}" stroke-dasharray="6 5" stroke-linecap="round" pointer-events="none"/>`;
   if(tmp.target){const n=last.g.nodes.get(tmp.target);if(n)h+=`<rect x="${n.x-6}" y="${n.y-6}" width="${n.w+12}" height="${n.h+12}" rx="12" fill="${acc}" fill-opacity=".08" stroke="${acc}" stroke-width="2.4" pointer-events="none"/>`;}}
  ov.innerHTML=h;}

 /* ---------- connection health, in words ---------- */
 const HO=n=>FE.healthOf(last.g,n,{health:last.health,nodeTypes:last.nodeTypes});
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
 const kindName=n=>{const K=FE.KIND[FE.kindOf(n)];return K?K.name:'Step';};
 const iconSvg=(K,sz=20)=>K&&K.icon?`<svg viewBox="0 0 24 24" width="${sz}" height="${sz}" fill="none" stroke="${K.tint}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${K.icon}"/></svg>`:'';
 const dotHtml=(s,tip)=>`<span class="ih" role="img" data-h="${s}" title="${esc(tip)}" aria-label="${esc(tip)}"></span>`;
 function open(kind,id,focus){insp={kind,id};if(kind==='node'){sel=new Set([id]);primary=id;selEdge=null;}panel.hidden=false;renderPanel(focus);if(last)paintOverlay();}
 function close(){insp=null;panel.hidden=true;panel.innerHTML='';}
 function connRow(g,e,dir){const other=g.nodes.get(dir==='in'?e.from:e.to),H=HO(other)||{s:'ok',tip:''};
  return `<li class="ic" data-e="${esc(edgeKey(e))}"><button type="button" class="ic-head" data-act="e-open" aria-expanded="false">${dotHtml(H.s,H.tip)}<span class="ic-name">${esc(other.label)}</span><span class="ic-dir">${dir==='in'?'comes in':'goes out'}${e.label?' · '+esc(e.label):''}</span><span class="ic-caret" aria-hidden="true">▾</span></button>
   <div class="ic-more" hidden><label class="f">Label<input type="text" data-act="e-label" data-ek="${esc(edgeKey(e))}" value="${esc(e.label||'')}" placeholder="${dir==='out'?'Yes / No / what happens':'optional'}"></label>
    <div class="two"><label class="f">Line<select data-act="e-kind" data-ek="${esc(edgeKey(e))}">${[['solid','Solid'],['dashed','Dashed (optional)'],['thick','Thick (main path)']].map(([v,l])=>`<option value="${v}"${(e.kind||'solid')===v?' selected':''}>${l}</option>`).join('')}</select></label>
    <label class="f">Direction<select data-act="e-dir" data-ek="${esc(edgeKey(e))}">${EDIRS.map(([v,l])=>`<option value="${v}"${edir(e)===v?' selected':''}>${l}</option>`).join('')}</select></label></div>
    <p class="note">${esc(H.tip||'')}</p>
    <div class="acts"><button type="button" class="b" data-act="e-swap" data-ek="${esc(edgeKey(e))}">Reverse</button><button type="button" class="b danger" data-act="e-del" data-ek="${esc(edgeKey(e))}">Disconnect</button></div></div></li>`;}
 function kickHtml(m){return `<section class="mod"><h3>Kick-start</h3><p class="sub">Say when this should start something. It is saved with the diagram; running it comes with the Workspace connection.</p>
   <label class="f">It starts<select data-act="k-trigger">${TRIGGERS.map(([v,l])=>`<option value="${v}"${(m.trigger||'')===v?' selected':''}>${l}</option>`).join('')}</select></label>
   <label class="f">What it kick-starts<input type="text" data-act="k-kick" value="${esc(m.kick||'')}" placeholder="e.g. open a task for the team, tell the client"></label></section>`;}
 function renderPanel(focus){if(!insp)return;const g=last.g;
  if(insp.kind==='node'){const n=g.nodes.get(insp.id);if(!n){close();return;}const K=FE.KIND[FE.kindOf(n)]||FE.KIND.rect,pr=parts(n.cls),m=st.meta[n.id]||{},{ins,outs}=edgesOf(g,n.id),H=HO(n)||null;
   const others=[...g.nodes.values()].filter(x=>x.id!==n.id),grp=g.groups.find(x=>x.id===n.group);
   let h=`<header class="ph"><span class="pk">${iconSvg(K,22)}</span><div><b>${esc(n.label)}</b><small>${esc(K.name)}${H?` ${dotHtml(H.s,H.tip)}`:''}</small></div><button type="button" class="x" data-act="close" aria-label="Close panel">×</button></header><div class="pb">
   <label class="f">Name<input type="text" data-act="n-label" value="${esc(n.label)}"></label>
   <label class="f">Details<textarea data-act="n-note" rows="2" placeholder="A second line shown under the name">${esc(n.note||'')}</textarea></label>
   <div class="two"><label class="f">Kind<select data-act="n-kind">${KIND_ORDER.map(k=>`<option value="${k}"${(FE.kindOf(n)===k)?' selected':''}>${esc(FE.KIND[k].name)}</option>`).join('')}</select></label>
   <label class="f">Status<select data-act="n-status">${STATUSES.map(([v,l])=>`<option value="${v}"${pr.status===v?' selected':''}>${l}</option>`).join('')}</select></label></div>`;
   if(K.worker){h+=`<section class="mod"><h3>Worker</h3><p class="sub">A worker does a job. Add more of them and each one shows its own copy of the workflow.</p>
    <label class="f">What it does<textarea data-act="w-role" rows="2" placeholder="Reads incoming mail and creates tasks">${esc(m.role||'')}</textarea></label>
    <div class="two"><label class="f">How many<input type="number" min="1" max="12" step="1" data-act="w-count" value="${esc(m.count||1)}"></label>
    <label class="f">State<select data-act="w-status">${WSTATUS.map(([v,l])=>`<option value="${v}"${(m.wstatus||'idle')===v?' selected':''}>${l}</option>`).join('')}</select></label></div></section>`;}
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
   h+=`<section class="mod"><h3>Size</h3><p class="sub">Drag a corner of the element to resize it, or type a size. Text shrinks to fit.</p><div class="two"><label class="f">Width<input type="number" min="96" max="720" step="4" data-act="s-w" value="${Math.round(n.w)}"></label><label class="f">Height<input type="number" min="44" max="420" step="4" data-act="s-h" value="${Math.round(n.h)}"></label></div><div class="acts"><button type="button" class="b" data-act="s-reset"${st.size[n.id]?'':' disabled'}>Back to the standard size</button></div></section>`;
   h+=kickHtml(m);
   h+=`<section><h3>Connections <small>${ins.length} in · ${outs.length} out</small></h3><ul class="ics">${ins.map(e=>connRow(g,e,'in')).join('')}${outs.map(e=>connRow(g,e,'out')).join('')}</ul>${!ins.length&&!outs.length?'<p class="note">Nothing connects to this yet. Drag from one of its round handles to another element.</p>':''}
   <div class="add"><select data-act="c-target" aria-label="Connect to"><option value="">Connect to…</option>${others.map(x=>`<option value="${esc(x.id)}">${esc(x.label)}</option>`).join('')}</select><select data-act="c-way" aria-label="Which way"><option value="out">goes to it</option><option value="in">comes from it</option></select><button type="button" class="b" data-act="c-add">Add</button></div></section>`;
   h+=`<section><label class="f">Group<select data-act="n-group"><option value="">No group</option>${g.groups.filter(x=>x.parent==null).map(x=>`<option value="${esc(x.id.replace(/^grp_/,''))}"${grp&&(grp.id===x.id||(grp.parent&&g.groups.find(y=>y.id===grp.parent)&&g.groups.find(y=>y.id===grp.parent).id===x.id))?' selected':''}>${esc(x.title)}</option>`).join('')}</select></label>
   <div class="acts"><button type="button" class="b" data-act="n-dup">Duplicate</button><button type="button" class="b danger" data-act="n-del">Delete element</button></div></section></div>`;
   panel.innerHTML=h;}
  else if(insp.kind==='edge'){const e=findEdge(insp.id);if(!e){close();return;}const a=g.nodes.get(e.from),b=g.nodes.get(e.to),Ha=HO(a),Hb=HO(b),ek=esc(edgeKey(e));
   panel.innerHTML=`<header class="ph"><span class="pk"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h14M13 6l6 6-6 6"/></svg></span><div><b>Connection</b><small>${esc(a.label)} → ${esc(b.label)}</small></div><button type="button" class="x" data-act="close" aria-label="Close panel">×</button></header><div class="pb">
    <label class="f">Label<input type="text" data-act="e-label" data-ek="${ek}" value="${esc(e.label||'')}" placeholder="What happens along this line"></label>
    <div class="two"><label class="f">Line<select data-act="e-kind" data-ek="${ek}">${[['solid','Solid'],['dashed','Dashed (optional)'],['thick','Thick (main path)']].map(([v,l])=>`<option value="${v}"${(e.kind||'solid')===v?' selected':''}>${l}</option>`).join('')}</select></label>
    <label class="f">Direction<select data-act="e-dir" data-ek="${ek}">${EDIRS.map(([v,l])=>`<option value="${v}"${edir(e)===v?' selected':''}>${l}</option>`).join('')}</select></label></div>
    <section><h3>Ends</h3><ul class="ics"><li class="ic"><button type="button" class="ic-head" data-act="goto" data-id="${esc(a.id)}">${Ha?dotHtml(Ha.s,Ha.tip):''}<span class="ic-name">${esc(a.label)}</span><span class="ic-dir">starts here</span></button></li><li class="ic"><button type="button" class="ic-head" data-act="goto" data-id="${esc(b.id)}">${Hb?dotHtml(Hb.s,Hb.tip):''}<span class="ic-name">${esc(b.label)}</span><span class="ic-dir">ends here</span></button></li></ul></section>
    <div class="acts"><button type="button" class="b" data-act="e-swap" data-ek="${ek}">Reverse</button><button type="button" class="b danger" data-act="e-del" data-ek="${ek}">Disconnect</button></div></div>`;}
  else if(insp.kind==='group'){const grp=g.groups.find(x=>x.id===insp.id);if(!grp){close();return;}const mem=[...g.nodes.values()].filter(n=>n.group===grp.id);
   panel.innerHTML=`<header class="ph"><span class="pk"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"><rect x="3" y="4" width="18" height="16" rx="3"/></svg></span><div><b>${esc(grp.title)}</b><small>Group · ${mem.length} element${mem.length===1?'':'s'}</small></div><button type="button" class="x" data-act="close" aria-label="Close panel">×</button></header><div class="pb">
    <label class="f">Title<input type="text" data-act="g-title" value="${esc(grp.title)}"></label>
    <section><h3>Inside</h3><ul class="ics">${mem.map(n=>{const H=HO(n);return `<li class="ic"><button type="button" class="ic-head" data-act="goto" data-id="${esc(n.id)}">${H?dotHtml(H.s,H.tip):''}<span class="ic-name">${esc(n.label)}</span><span class="ic-dir">${esc(kindName(n))}</span></button></li>`;}).join('')||'<li class="note">Empty</li>'}</ul></section>
    <div class="acts"><button type="button" class="b danger" data-act="g-del">Ungroup</button></div></div>`;}
  if(!canEdit()){const pb=panel.querySelector('.pb');if(pb){panel.querySelectorAll('input,select,textarea').forEach(el=>{el.disabled=true;});panel.querySelectorAll('.acts,.add,.mod .sub,.mod h3+p').forEach(el=>{if(!el.closest('.verdict'))el.hidden=true;});
    const n=document.createElement('p');n.className='note';n.textContent='You are viewing. Switch to Editing to change this.';pb.insertBefore(n,pb.firstChild);}}
  if(focus&&canEdit()){const el=panel.querySelector(focus);if(el){el.focus();if(el.select)el.select();}}}

 /* ---------- edge helpers ---------- */
 const edgeIndex=(M,key)=>{const [f,t]=key.split('>');return M.edges.findIndex(x=>x.from===f&&x.to===t);};
 function addEdge(from,to,label){if(from===to)return false;let ok=false;mut(M=>{if(M.edges.some(e=>e.from===from&&e.to===to)){host.toast('Those two are already connected');return;}M.edges.push({from,to,label:label||'',kind:'solid',arrow:true});ok=true;});return ok;}
 function removeEdges(keys){mut(M=>{for(const k of keys){const i=edgeIndex(M,k);if(i>=0)M.edges.splice(i,1);}});}

 /* ---------- panel events ---------- */
 function after(fnRedraw=true){const keep=document.activeElement&&panel.contains(document.activeElement)?document.activeElement.getAttribute('data-act')+'|'+(document.activeElement.getAttribute('data-ek')||''):null;host.rerender();if(fnRedraw&&insp)renderPanel();if(keep){const [a,e]=keep.split('|');const el=[...panel.querySelectorAll(`[data-act="${a}"]`)].find(x=>!e||x.getAttribute('data-ek')===e);if(el&&/INPUT|TEXTAREA/.test(el.tagName)){el.focus();try{const l=el.value.length;el.setSelectionRange(l,l);}catch{}}}}
 const metaOf=id=>(st.meta[id]=st.meta[id]||{});
 panel.addEventListener('input',ev=>{const el=ev.target,a=el.dataset.act;if(!a||!insp)return;
  if(insp.kind==='node'){const id=insp.id;
   if(a==='n-label'){mut(M=>{M.nodes.get(id).label=el.value||'Untitled';},'label:'+id);after(false);}
   else if(a==='n-note'){mut(M=>{M.nodes.get(id).note=el.value;},'note:'+id);after(false);}
   else if(a==='w-role'){pushUndo('meta:'+id);metaOf(id).role=el.value;store();host.rerender(true);}
   else if(a==='k-kick'){pushUndo('meta:'+id);metaOf(id).kick=el.value;store();host.rerender(true);}
   else if(a.startsWith('m-')&&el.tagName!=='SELECT'){pushUndo('meta:'+id);metaOf(id)[a.slice(2)]=el.value;store();}}
  if(a==='e-label'){const k=el.dataset.ek;mut(M=>{const i=edgeIndex(M,k);if(i>=0)M.edges[i].label=el.value;},'elabel:'+k);after(false);}
  if(a==='g-title'){mut(M=>{const it=M.items.find(x=>x.type==='stage'&&('grp_'+x.id)===insp.id);if(it)it.title=el.value||'Group';},'gt');after(false);}});
 panel.addEventListener('change',ev=>{const el=ev.target,a=el.dataset.act;if(!a||!insp)return;
  if(insp.kind==='node'){const id=insp.id;
   if(a==='n-kind'){const kind=el.value,base=FE.KIND[kind]||{};mut(M=>{const n=M.nodes.get(id),p=parts(n.cls);n.shape=kindShape(kind);n.cls=mkcls(p.status,base.tag?kind:'');});after();}
   else if(a==='n-status'){mut(M=>{const n=M.nodes.get(id),p=parts(n.cls);n.cls=mkcls(el.value,p.kind);});after();}
   else if(a==='n-group'){mut(M=>{const from=stageOf(M,id);if(from)from.steps=from.steps.filter(x=>x!==id);else M.items=M.items.filter(it=>!(it.type==='step'&&it.id===id));const to=M.items.find(it=>it.type==='stage'&&it.id===el.value);if(to)to.steps.push(id);else M.items.push({type:'step',id});});after();}
   else if(a==='w-count'){const n=Math.max(1,Math.min(12,Math.round(+el.value||1)));el.value=n;pushUndo();metaOf(id).count=n;syncLanes(id);store();after();}
   else if(a==='w-status'){pushUndo();metaOf(id).wstatus=el.value;store();after();}
   else if(a==='s-w'||a==='s-h'){const nn=last.g.nodes.get(id),w=a==='s-w'?+el.value:nn.w,hh=a==='s-h'?+el.value:nn.h;setSize(id,w,hh);renderPanel();}
   else if(a==='k-trigger'){pushUndo();metaOf(id).trigger=el.value;store();host.rerender(true);}
   else if(a.startsWith('m-')){pushUndo();metaOf(id)[a.slice(2)]=el.value;store();}}
  if(a==='e-kind'){mut(M=>{const i=edgeIndex(M,el.dataset.ek);if(i>=0)M.edges[i].kind=el.value;});after();}
  if(a==='e-dir'){mut(M=>{const i=edgeIndex(M,el.dataset.ek);if(i>=0){const v=el.value,x=M.edges[i];x.bi=v==='bi';x.arrow=v!=='none';if(v==='o'||v==='x')x.head=v;else delete x.head;}});after();}});
 panel.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b||!insp)return;const a=b.dataset.act;
  if(a==='close'){close();paintOverlay();return;}
  if(a==='goto'){open('node',b.dataset.id);return;}
  if(a==='e-open'){const li=b.closest('.ic'),more=li.querySelector('.ic-more');more.hidden=!more.hidden;b.setAttribute('aria-expanded',String(!more.hidden));return;}
  if(a==='e-del'){removeEdges([b.dataset.ek]);selEdge=null;if(insp.kind==='edge')close();after();return;}
  if(a==='e-swap'){const k=b.dataset.ek;mut(M=>{const i=edgeIndex(M,k);if(i>=0){const e=M.edges[i];[e.from,e.to]=[e.to,e.from];}});if(insp.kind==='edge')insp.id=k.split('>').reverse().join('>');after();return;}
  if(a==='c-add'){const t=panel.querySelector('[data-act=c-target]').value,w=panel.querySelector('[data-act=c-way]').value;if(!t)return;
   if(w==='out')addEdge(insp.id,t);else addEdge(t,insp.id);after();return;}
  if(a==='s-reset'){resetSize(insp.id);return;}
  if(a==='n-del'){deleteSelection();return;}
  if(a==='n-dup'){duplicate();return;}
  if(a==='m-check'){const id=insp.id;pushUndo();metaOf(id).analysis=analyse(id);store();host.rerender();renderPanel();return;}
  if(a==='g-del'){mut(M=>{const i=M.items.findIndex(x=>x.type==='stage'&&('grp_'+x.id)===insp.id);if(i>=0){const s0=M.items[i];M.items.splice(i,1,...s0.steps.map(x=>({type:'step',id:x})));}});close();host.rerender();return;}});
 panel.addEventListener('keydown',ev=>{if(ev.key==='Escape'){close();paintOverlay();stage.focus();}});

 function resetSize(id){if(!st.size[id])return;pushUndo();delete st.size[id];store();host.rerender();if(insp)renderPanel();}
 function setSize(id,w,h){const n=last&&last.g.nodes.get(id);if(!n)return;pushUndo('size:'+id);freeze();const cur=posOf(id)||{x:n.x,y:n.y};st.size[id]={w:Math.max(96,Math.min(720,Math.round(w||n.w))),h:Math.max(44,Math.min(420,Math.round(h||n.h)))};st.pos[id]=cur;store();host.rerender(true);paintOverlay();}
 /* ---------- clipboard, delete, duplicate ---------- */
 function copy(){const ids=[...sel];if(!ids.length)return false;const M=model();
  clip={nodes:ids.filter(id=>M.nodes.has(id)).map(id=>({n:{...M.nodes.get(id)},pos:{...(posOf(id)||{x:0,y:0})},meta:st.meta[id]?JSON.parse(JSON.stringify({...st.meta[id],analysis:undefined})):null,size:st.size[id]?{...st.size[id]}:null})),edges:M.edges.filter(e=>ids.includes(e.from)&&ids.includes(e.to)).map(e=>({...e}))};
  pasteN=0;try{navigator.clipboard&&navigator.clipboard.writeText('atlas-canvas '+JSON.stringify(clip)).catch(()=>{});}catch{}return true;}
 function paste(at){if(!clip||!clip.nodes.length){host.toast('Nothing copied yet');return;}freeze();pasteN++;const ids=[];
  const x0=Math.min(...clip.nodes.map(c=>c.pos.x)),y0=Math.min(...clip.nodes.map(c=>c.pos.y)),dx=at?at.x-x0:30*pasteN,dy=at?at.y-y0:30*pasteN;
  mut(M=>{const map=new Map(),taken=takenId(M);for(const c of clip.nodes){const id=slug(c.n.label,taken);map.set(c.n.id,id);M.nodes.set(id,{...c.n,id});M.items.push({type:'step',id});ids.push(id);st.pos[id]={x:Math.round(c.pos.x+dx),y:Math.round(c.pos.y+dy)};if(c.meta)st.meta[id]=JSON.parse(JSON.stringify(c.meta));if(c.size)st.size[id]={...c.size};}
   for(const e of clip.edges)M.edges.push({...e,from:map.get(e.from),to:map.get(e.to)});});
  store();setSel(ids);host.rerender(true);paintOverlay();}
 function duplicate(){if(!sel.size)return;const keep=clip,n=pasteN;copy();paste();clip=keep||clip;pasteN=n;}
 function cut(){if(copy())deleteSelection();}
 function deleteSelection(){if(selEdge){const k=selEdge;selEdge=null;removeEdges([k]);close();host.rerender();return;}
  if(!sel.size)return;const ids=[...sel];mut(M=>{for(const id of ids)removeNode(M,id);});for(const id of ids){delete st.pos[id];delete st.meta[id];delete st.size[id];}store();sel=new Set();primary=null;close();host.rerender();}
 function selectAll(){if(!last)return;setSel([...last.g.nodes.keys()]);}
 function nudge(dx,dy){if(!sel.size)return;freeze();pushUndo('nudge');for(const id of sel){const p=posOf(id);if(!p)continue;let x=p.x+dx,y=p.y+dy;if(snapOn&&Math.abs(dx||dy)>=GRID){if(dx)x=Math.round(x/GRID)*GRID;if(dy)y=Math.round(y/GRID)*GRID;}st.pos[id]={x,y};}store();host.rerender(true);}

 /* ---------- arrange: align, distribute, group ---------- */
 const boxOf=id=>{const n=last&&last.g.nodes.get(id),p=posOf(id);return n&&p?{id,x:p.x,y:p.y,w:n.w,h:n.h}:null;};
 function align(how){const bs=[...sel].map(boxOf).filter(Boolean);if(bs.length<2){host.toast('Select two or more elements to align');return;}freeze();pushUndo();
  const x0=Math.min(...bs.map(b=>b.x)),x1=Math.max(...bs.map(b=>b.x+b.w)),y0=Math.min(...bs.map(b=>b.y)),y1=Math.max(...bs.map(b=>b.y+b.h));
  for(const b of bs){let {x,y}=b;if(how==='left')x=x0;else if(how==='right')x=x1-b.w;else if(how==='center')x=(x0+x1)/2-b.w/2;else if(how==='top')y=y0;else if(how==='bottom')y=y1-b.h;else if(how==='middle')y=(y0+y1)/2-b.h/2;st.pos[b.id]={x:Math.round(x),y:Math.round(y)};}
  store();host.rerender(true);paintOverlay();}
 function distribute(axis){const bs=[...sel].map(boxOf).filter(Boolean);if(bs.length<3){host.toast('Select three or more elements to space them evenly');return;}freeze();pushUndo();
  const H=axis==='h',k=H?'x':'y',d=H?'w':'h';bs.sort((a,b)=>a[k]-b[k]);const first=bs[0],lastB=bs[bs.length-1],span=lastB[k]+lastB[d]-first[k],used=bs.reduce((a,b)=>a+b[d],0),gap=(span-used)/(bs.length-1);
  let at=first[k];for(const b of bs){st.pos[b.id]={...st.pos[b.id]||{x:b.x,y:b.y},[k]:Math.round(at)};at+=b[d]+gap;}
  store();host.rerender(true);paintOverlay();}
 function groupSelection(title){let ids=[...sel].filter(id=>last&&last.g.nodes.has(id));if(!ids.length){const id=addElement('rect');ids=[id];}let gid;
  mut(M=>{const taken=takenId(M);gid=slug(title||'group',taken);const stg={type:'stage',id:gid,title:title||'Group',steps:[]};const at=M.items.findIndex(it=>(it.type==='step'&&ids.includes(it.id))||(it.type==='stage'&&it.steps.some(x=>ids.includes(x))));
   for(const id of ids){const from=stageOf(M,id);if(from)from.steps=from.steps.filter(x=>x!==id);else M.items=M.items.filter(it=>!(it.type==='step'&&it.id===id));stg.steps.push(id);}
   M.items=M.items.filter(it=>it.type!=='stage'||it.steps.length);M.items.splice(Math.max(0,Math.min(at,M.items.length)),0,stg);});
  host.rerender();open('group','grp_'+gid,'[data-act=g-title]');host.toast('Grouped. Drag the group’s edge to move everything inside');return gid;}
 function ungroupSelection(){const gids=new Set();for(const id of sel){const n=last&&last.g.nodes.get(id);if(n&&n.group)gids.add(n.group);}if(insp&&insp.kind==='group')gids.add(insp.id);if(!gids.size){host.toast('Nothing selected is in a group');return;}
  mut(M=>{for(const gid of gids){const i=M.items.findIndex(x=>x.type==='stage'&&('grp_'+x.id)===gid);if(i>=0){const s0=M.items[i];M.items.splice(i,1,...s0.steps.map(x=>({type:'step',id:x})));}}});if(insp&&insp.kind==='group')close();host.rerender();host.toast('Ungrouped');}
 function selectionBox(){const bs=(sel.size?[...sel]:[]).map(boxOf).filter(Boolean);if(!bs.length)return null;return {x0:Math.min(...bs.map(b=>b.x)),y0:Math.min(...bs.map(b=>b.y)),x1:Math.max(...bs.map(b=>b.x+b.w)),y1:Math.max(...bs.map(b=>b.y+b.h))};}
 function zoomToSelection(){const b=selectionBox();if(!b){host.fit&&host.fit();return;}host.zoomTo&&host.zoomTo(b);}

 /* ---------- adding things ---------- */
 const viewCentre=()=>{const v=host.view(),r=stage.getBoundingClientRect();return {x:(r.width/2-v.x)/v.zoom,y:(r.height/2-v.y)/v.zoom};};
 function clearSpot(at,w,h){if(!last)return at;const g=last.g,pos=last.pos;let p={...at},tries=0;const hit=q=>[...g.nodes.values()].some(m=>pos[m.id]&&overlap({x:q.x,y:q.y,w,h},{x:(st.pos[m.id]||pos[m.id]).x,y:(st.pos[m.id]||pos[m.id]).y,w:m.w,h:m.h}));
  while(hit(p)&&tries++<60)p={x:p.x+34,y:p.y+34};return p;}
 function addElement(kind,at){const K=FE.KIND[kind]||{};freeze();const c=at||viewCentre(),w=K.w||176,h=K.h||68;let p=clearSpot({x:Math.round(c.x-w/2),y:Math.round(c.y-h/2)},w,h);let id;
  mut(M=>{id=slug(K.name||'element',takenId(M));newNode(M,id,K.name||'New element',kind);st.pos[id]=p;});
  store();setSel([id]);host.rerender(true);open('node',id,'[data-act=n-label]');return id;}
 function addConnected(fromId,at,label){const n=last&&last.g.nodes.get(fromId),p0=posOf(fromId);if(!n||!p0)return null;freeze();const K=FE.KIND.rect;
  const p=at?{x:Math.round(at.x-K.w/2),y:Math.round(at.y-K.h/2)}:clearSpot({x:p0.x+n.w+80,y:p0.y},K.w,K.h);let id;
  mut(M=>{id=slug('step',takenId(M));newNode(M,id,'New step','rect');M.edges.push({from:fromId,to:id,label:label||'',kind:'solid',arrow:true});st.pos[id]=p;});
  store();setSel([id]);host.rerender(true);open('node',id,'[data-act=n-label]');return id;}
 function addDiagram(tpl){pushUndo();const M=model(),T=window.FlowEngine.parse(tpl.src),n0=Object.keys(st.ct).length+2,prefix='d'+n0+'_',cid='x'+n0;
  const map=new Map();const Mt=window.FlowEditor.fromGraph(T);
  for(const [id,n] of Mt.nodes){const nid=prefix+id;map.set(id,nid);M.nodes.set(nid,{...n,id:nid});st.cl[nid]=cid;}
  for(const it of Mt.items){if(it.type==='stage')M.items.push({type:'stage',id:prefix+it.id,title:it.title,steps:it.steps.map(x=>map.get(x))});else M.items.push({type:'step',id:map.get(it.id)});}
  for(const e of Mt.edges)M.edges.push({...e,from:map.get(e.from),to:map.get(e.to)});
  st.ct[cid]=tpl.type;st.pending.push(cid);write(M);store();host.rerender();return cid;}
 /* a worker brings its workflow with it; setting more of them shows more lanes of that workflow */
 const STEP_KIND={io:'io',rect:'rect',decision:'decision',data:'data',system:'system',pill:'pill',person:'person',doc:'doc'};
 function buildLane(M,wid,W,k,base){const ids=[],cid='w_'+wid,rows=W.steps.length;let x=base.x,maxH=Math.max(...W.steps.map(s=>(FE.KIND[STEP_KIND[s[1]]]||FE.KIND.rect).h)),cy=base.y+k*(maxH+64)+maxH/2;
  W.steps.forEach((s,i)=>{const kind=STEP_KIND[s[1]]||'rect',K=FE.KIND[kind]||FE.KIND.rect,id=`${wid}_l${k}_${i}`;newNode(M,id,s[0],kind,s[2]);ids.push(id);st.cl[id]=cid;st.pos[id]={x:Math.round(x),y:Math.round(cy-K.h/2)};x+=K.w+56;});
  for(let i=0;i<rows-1;i++){const dec=W.steps[i][1]==='decision';M.edges.push({from:ids[i],to:ids[i+1],label:dec?'Yes':'',kind:'solid',arrow:true});if(dec&&i>0)M.edges.push({from:ids[i],to:ids[i-1],label:'No',kind:'solid',arrow:true});}
  M.edges.push({from:wid,to:ids[0],label:'',kind:'solid',arrow:true});st.ct[cid]='flow';return ids;}
 function addWorker(key,at){const W=FP.WORKERS.find(x=>x.id===key);if(!W)return null;freeze();const K=FE.KIND.worker,c=at||viewCentre();
  const p=clearSpot({x:Math.round(c.x-K.w/2-220),y:Math.round(c.y-K.h/2)},K.w+80+W.steps.length*230,K.h);let wid;
  mut(M=>{wid=slug(W.name,takenId(M));newNode(M,wid,W.name,'worker',W.role.slice(0,60));st.pos[wid]=p;st.meta[wid]={role:W.role,count:1,wstatus:'idle',workflow:key,lanes:1};
   buildLane(M,wid,W,0,{x:p.x+K.w+90,y:p.y+K.h/2-34});});
  store();setSel([wid]);host.rerender(true);host.fit&&host.fit();open('node',wid);return wid;}
 function syncLanes(wid){const m=st.meta[wid];if(!m||!m.workflow)return;const W=FP.WORKERS.find(x=>x.id===m.workflow);if(!W)return;const want=m.count||1,have=m.lanes||1;if(want===have)return;
  const p=st.pos[wid]||posOf(wid),K=FE.KIND.worker;
  mut(M=>{if(want>have)for(let k=have;k<want;k++)buildLane(M,wid,W,k,{x:p.x+K.w+90,y:p.y+K.h/2-34});
   else for(let k=want;k<have;k++)for(let i=0;i<W.steps.length;i++){const id=`${wid}_l${k}_${i}`;if(M.nodes.has(id)){removeNode(M,id);delete st.pos[id];delete st.cl[id];}}});
  m.lanes=want;}
 function setClusterType(cid,type){pushUndo();if(cid==='main'){host.setMainType(type);}else st.ct[cid]=type;for(const n of (last?last.g.nodes.values():[]))if((st.cl[n.id]||'main')===cid)delete st.pos[n.id];if(!Object.keys(st.pos).length)st.frozen=false;store();host.rerender();}
 function removeCluster(cid){if(cid==='main')return;mut(M=>{for(const id of [...M.nodes.keys()])if(st.cl[id]===cid)removeNode(M,id);});for(const id of Object.keys(st.cl))if(st.cl[id]===cid){delete st.cl[id];delete st.pos[id];delete st.meta[id];}delete st.ct[cid];store();host.rerender();}

 /* ---------- right-click menu ---------- */
 function closeMenu(){if(menu){menu.remove();menu=null;}}
 function showMenu(cx,cy,items){closeMenu();menu=document.createElement('div');menu.className='cmenu';menu.setAttribute('role','menu');
  menu.innerHTML=items.map((it,i)=>it.sep?`<div class="cm-sep" role="separator">${esc(it.sep)}</div>`:`<button type="button" role="menuitem" data-i="${i}"${it.off?' disabled':''}>${esc(it.label)}${it.key?`<kbd>${esc(it.key)}</kbd>`:''}</button>`).join('');
  document.body.appendChild(menu);const r=menu.getBoundingClientRect();menu.style.left=Math.max(8,Math.min(cx,innerWidth-r.width-8))+'px';menu.style.top=Math.max(8,Math.min(cy,innerHeight-r.height-8))+'px';
  menu.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(!b)return;const it=items[+b.dataset.i];closeMenu();it.run&&it.run();});
  menu.addEventListener('keydown',e=>{const bs=[...menu.querySelectorAll('button:not([disabled])')],i=bs.indexOf(document.activeElement);
   if(e.key==='ArrowDown'){e.preventDefault();bs[(i+1)%bs.length].focus();}else if(e.key==='ArrowUp'){e.preventDefault();bs[(i-1+bs.length)%bs.length].focus();}else if(e.key==='Escape'){closeMenu();stage.focus();}});
  const f=menu.querySelector('button:not([disabled])');if(f)f.focus();}
 function contextItems(T,w){const items=[];
  if(T.n){const id=T.n.dataset.nid;if(!sel.has(id))setSel([id]);const many=sel.size>1;
   items.push({label:'Edit details',key:'Enter',run:()=>open('node',primary,'[data-act=n-label]'),off:many},{label:'Add a connected element',key:MOD+'↵',run:()=>addConnected(primary),off:many},{sep:'Element'},
    {label:many?`Duplicate ${sel.size}`:'Duplicate',key:MOD+'D',run:duplicate},{label:'Copy',key:MOD+'C',run:copy},{label:'Cut',key:MOD+'X',run:cut},{label:many?`Delete ${sel.size}`:'Delete',key:'⌫',run:deleteSelection},
    {label:many?`Group ${sel.size}`:'Put in a group',key:MOD+'G',run:()=>groupSelection()},{label:'Ungroup',key:MOD+'⇧G',run:ungroupSelection,off:![...sel].some(id=>last.g.nodes.get(id)&&last.g.nodes.get(id).group)},{label:'Zoom to selection',key:'⇧2',run:zoomToSelection});
   if(many)items.push({sep:'Arrange'},{label:'Align left',key:'⌥A',run:()=>align('left')},{label:'Align centres',key:'⌥H',run:()=>align('center')},{label:'Align right',key:'⌥D',run:()=>align('right')},{label:'Align tops',key:'⌥W',run:()=>align('top')},{label:'Align middles',key:'⌥V',run:()=>align('middle')},{label:'Align bottoms',key:'⌥S',run:()=>align('bottom')},{label:'Space evenly across',key:'⌥⇧H',run:()=>distribute('h'),off:sel.size<3},{label:'Space evenly down',key:'⌥⇧V',run:()=>distribute('v'),off:sel.size<3});}
  else if(T.e){const e=T.e.dataset.eid!=null?last.g.edges.find(x=>String(x.i)===String(T.e.dataset.eid)):null;if(e){setSel([],edgeKey(e));
   items.push({label:'Edit connection',run:()=>open('edge',edgeKey(e))},{label:'Reverse direction',run:()=>{mut(M=>{const i=edgeIndex(M,edgeKey(e));if(i>=0){const x=M.edges[i];[x.from,x.to]=[x.to,x.from];}});setSel([],e.to+'>'+e.from);}},{label:'Disconnect',key:'⌫',run:deleteSelection});}}
  else{items.push({label:'Paste here',key:MOD+'V',run:()=>paste(w),off:!clip},{label:'Select all',key:MOD+'A',run:selectAll},{label:'Fit to screen',key:'0',run:()=>host.fit&&host.fit()},{sep:'Add an element here'});
   for(const k of ['rect','decision','pill','data','io','sub','doc','delay','manual','offpage','person','system','note','mod_internal','mod_external','mod_flow'])items.push({label:FE.KIND[k].name,run:()=>addElement(k,w)});
   items.push({sep:'Add a worker here'});for(const W of FP.WORKERS)items.push({label:W.name,run:()=>addWorker(W.id,w)});}
  return items;}

 /* ---------- stage interactions ---------- */
 const mode=()=>host.mode()==='canvas';
 const canEdit=()=>!host.canEdit||host.canEdit();
 const world=ev=>{const r=stage.getBoundingClientRect(),v=host.view();return {x:(ev.clientX-r.left-v.x)/v.zoom,y:(ev.clientY-r.top-v.y)/v.zoom};};
 const topEl=ev=>{const u=document.elementFromPoint(ev.clientX,ev.clientY);return u||ev.target;};
 const target=ev=>{let t=ev.target;if(!t.closest||!t.closest('.fc-n,.fc-e,.fc-l,.fc-g,.fc-handle,.fc-ehandle,.fc-rz'))t=topEl(ev);
  return {n:t.closest&&t.closest('.fc-n'),e:t.closest&&t.closest('.fc-e,.fc-l'),g:t.closest&&t.closest('.fc-g'),h:t.closest&&t.closest('.fc-handle'),rz:t.closest&&t.closest('.fc-rz'),eh:t.closest&&t.closest('.fc-ehandle'),ui:ev.target.closest&&ev.target.closest('.rail,.fly,.dock,.mnu,.panel,.empty>div,.motion,.insp,.cmenu')};};
 const nodeAt=ev=>{const u=topEl(ev),n=u.closest&&u.closest('.fc-n');return n?n.dataset.nid:null;};
 const edgeOfEl=el=>{const id=el.dataset.eid;const e=last&&last.g.edges.find(x=>String(x.i)===String(id));return e||null;};
 stage.addEventListener('pointerdown',ev=>{if(!mode()||ev.button>0)return;closeMenu();const T=target(ev);if(T.ui)return;
  stage.focus({preventScroll:true});
  if(!canEdit()){const e=T.e?edgeOfEl(T.e):null;drag={kind:'pan',ox:ev.clientX,oy:ev.clientY,sx:host.view().x,sy:host.view().y,moved:false,pid:ev.pointerId,hit:{n:T.n?T.n.dataset.nid:null,e:e?edgeKey(e):null}};stage.classList.add('drag');stage.setPointerCapture(ev.pointerId);return;}
  if(T.h){const id=T.h.dataset.nid;drag={kind:'connect',from:id,ox:ev.clientX,oy:ev.clientY,moved:false,pid:ev.pointerId};stage.setPointerCapture(ev.pointerId);ev.stopPropagation();return;}
  if(T.rz){const id=T.rz.dataset.nid,n=last&&last.g.nodes.get(id),p0=posOf(id);if(!n||!p0)return;
   drag={kind:'resize',id,corner:T.rz.dataset.corner,orig:{x:p0.x,y:p0.y,w:n.w,h:n.h},start:world(ev),ox:ev.clientX,oy:ev.clientY,moved:false,pid:ev.pointerId};stage.setPointerCapture(ev.pointerId);ev.stopPropagation();return;}
  if(T.eh){drag={kind:'reconnect',end:T.eh.dataset.end,key:T.eh.dataset.ekey,ox:ev.clientX,oy:ev.clientY,moved:false,pid:ev.pointerId};stage.setPointerCapture(ev.pointerId);ev.stopPropagation();return;}
  if(T.n){const id=T.n.dataset.nid,n=last&&last.g.nodes.get(id);if(!n)return;
   if(ev.shiftKey||ev.metaKey||ev.ctrlKey){const s=new Set(sel);s.has(id)?s.delete(id):s.add(id);setSel([...s]);}else if(!sel.has(id)||selEdge){setSel([id]);}
   const orig={};for(const sid of sel){const p=posOf(sid);if(p)orig[sid]={x:p.x,y:p.y};}
   drag={kind:'node',id,start:world(ev),orig,ox:ev.clientX,oy:ev.clientY,moved:false,pid:ev.pointerId,hit:id};stage.setPointerCapture(ev.pointerId);ev.stopPropagation();
   if(ev.pointerType!=='mouse')armPress(ev);return;}
  if(T.g&&!T.e){const gid=T.g.dataset.gid,mem=last?[...last.g.nodes.values()].filter(n=>{let x=n.group;while(x){if(x===gid)return true;const gg=last.g.groups.find(y=>y.id===x);x=gg?gg.parent:null;}return false;}):[];
   drag={kind:'group',id:gid,start:world(ev),orig:Object.fromEntries(mem.map(n=>[n.id,{...posOf(n.id)}])),ox:ev.clientX,oy:ev.clientY,moved:false,pid:ev.pointerId};stage.setPointerCapture(ev.pointerId);ev.stopPropagation();return;}
  if(T.e){const e=edgeOfEl(T.e);if(e){setSel([],edgeKey(e));}drag={kind:'edge',id:e?edgeKey(e):null,ox:ev.clientX,oy:ev.clientY,moved:false};ev.stopPropagation();return;}
  if(ev.shiftKey){const w=world(ev);drag={kind:'marquee',start:w,ox:ev.clientX,oy:ev.clientY,moved:false,pid:ev.pointerId,box:null};stage.setPointerCapture(ev.pointerId);return;}
  drag={kind:'pan',ox:ev.clientX,oy:ev.clientY,sx:host.view().x,sy:host.view().y,moved:false,pid:ev.pointerId};stage.classList.add('drag');stage.setPointerCapture(ev.pointerId);
  if(ev.pointerType!=='mouse')armPress(ev);});
 /* smart guides: line the moving piece up with the edges and centres of the others; the grid when nothing is near. Alt turns both off. */
 function snapMove(d,mx,my,off){if(off||!last)return {mx,my,guides:null};const ids=Object.keys(d.orig);const moving=new Set(ids);
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const id of ids){const n=last.g.nodes.get(id),o=d.orig[id];if(!n||!o)continue;x0=Math.min(x0,o.x+mx);y0=Math.min(y0,o.y+my);x1=Math.max(x1,o.x+mx+n.w);y1=Math.max(y1,o.y+my+n.h);}
  if(x0>x1)return {mx,my,guides:null};const tol=6/Math.max(.25,host.view().zoom);
  const xs=[x0,(x0+x1)/2,x1],ys=[y0,(y0+y1)/2,y1];let bx=null,by=null;
  for(const n of last.g.nodes.values()){if(moving.has(n.id))continue;const p=posOf(n.id);if(!p)continue;const ox=[p.x,p.x+n.w/2,p.x+n.w],oy=[p.y,p.y+n.h/2,p.y+n.h];
   for(let i=0;i<3;i++)for(let j=0;j<3;j++){const dx=ox[j]-xs[i];if(Math.abs(dx)<=tol&&(!bx||Math.abs(dx)<Math.abs(bx.d)))bx={d:dx,at:ox[j],n,p};const dy=oy[j]-ys[i];if(Math.abs(dy)<=tol&&(!by||Math.abs(dy)<Math.abs(by.d)))by={d:dy,at:oy[j],n,p};}}
  const g=[];
  if(bx){mx+=bx.d;g.push({v:1,at:bx.at,a:Math.min(y0+(by?by.d:0),bx.p.y),b:Math.max(y1+(by?by.d:0),bx.p.y+bx.n.h)});}else if(snapOn){mx+=Math.round(x0/GRID)*GRID-x0;}
  if(by){my+=by.d;g.push({v:0,at:by.at,a:Math.min(x0+(bx?bx.d:0),by.p.x),b:Math.max(x1+(bx?bx.d:0),by.p.x+by.n.w)});}else if(snapOn){my+=Math.round(y0/GRID)*GRID-y0;}
  return {mx,my,guides:g.length?g:null};}
 function armPress(ev){if(!canEdit())return;clearTimeout(press);const cx=ev.clientX,cy=ev.clientY,w=world(ev);press=setTimeout(()=>{if(drag&&!drag.moved){const T=target({target:topEl({clientX:cx,clientY:cy}),clientX:cx,clientY:cy});drag=null;stage.classList.remove('drag');showMenu(cx,cy,contextItems(T,w));}},560);}
 stage.addEventListener('pointermove',ev=>{if(!drag||!mode())return;const dx=ev.clientX-drag.ox,dy=ev.clientY-drag.oy;if(!drag.moved&&Math.hypot(dx,dy)<4)return;
  if(!drag.moved){drag.moved=true;clearTimeout(press);if(drag.kind==='node'||drag.kind==='group'||drag.kind==='resize'){freeze();pushUndo();}}
  if(drag.kind==='pan'){host.pan(drag.sx+dx,drag.sy+dy);return;}
  if(drag.kind==='node'||drag.kind==='group'){const w=world(ev);let mx=w.x-drag.start.x,my=w.y-drag.start.y;
   const sn=snapMove(drag,mx,my,ev.altKey);mx=sn.mx;my=sn.my;guides=sn.guides;
   for(const [id,o] of Object.entries(drag.orig))st.pos[id]={x:Math.round(o.x+mx),y:Math.round(o.y+my)};
   if(!raf)raf=requestAnimationFrame(()=>{raf=0;host.rerender(true);});return;}
  if(drag.kind==='resize'){const w=world(ev),o=drag.orig;let dx=w.x-drag.start.x,dy=w.y-drag.start.y;const c=drag.corner,west=c==='nw'||c==='sw',north=c==='nw'||c==='ne';
   let nw=Math.max(96,Math.min(720,o.w+(west?-dx:dx))),nh=Math.max(44,Math.min(420,o.h+(north?-dy:dy)));
   if(ev.shiftKey){const k=o.w/o.h;if(nw/nh>k)nw=nh*k;else nh=nw/k;nw=Math.max(96,nw);nh=Math.max(44,nh);}
   nw=Math.round(nw);nh=Math.round(nh);st.size[drag.id]={w:nw,h:nh};st.pos[drag.id]={x:Math.round(west?o.x+o.w-nw:o.x),y:Math.round(north?o.y+o.h-nh:o.y)};
   if(!raf)raf=requestAnimationFrame(()=>{raf=0;host.rerender(true);});return;}
  if(drag.kind==='connect'||drag.kind==='reconnect'){const w=world(ev),tid=nodeAt(ev);let a;
   if(drag.kind==='connect')a=last.g.nodes.get(drag.from);
   const fromPt=drag.kind==='connect'?{x:a.x+a.w/2,y:a.y+a.h/2}:(()=>{const e=findEdge(drag.key);const n=last.g.nodes.get(drag.end==='from'?e.to:e.from);return {x:n.x+n.w/2,y:n.y+n.h/2};})();
   paintOverlay({x1:fromPt.x,y1:fromPt.y,x2:w.x,y2:w.y,target:tid});return;}
  if(drag.kind==='marquee'){const w=world(ev),x=Math.min(drag.start.x,w.x),y=Math.min(drag.start.y,w.y),ww=Math.abs(w.x-drag.start.x),hh=Math.abs(w.y-drag.start.y);drag.box={x,y,w:ww,h:hh};
   const v=host.view();let mq=stage.querySelector('.mq');if(!mq){mq=document.createElement('div');mq.className='mq';stage.appendChild(mq);}
   mq.style.cssText=`left:${x*v.zoom+v.x}px;top:${y*v.zoom+v.y}px;width:${ww*v.zoom}px;height:${hh*v.zoom}px`;}});
 stage.addEventListener('pointerup',ev=>{clearTimeout(press);if(!drag||!mode())return;const d=drag;drag=null;if(guides){guides=null;paintOverlay();}stage.classList.remove('drag');try{stage.releasePointerCapture(ev.pointerId);}catch{}
  const mq=stage.querySelector('.mq');if(mq)mq.remove();
  if(d.kind==='resize'){paintOverlay();return;}
  if(d.kind==='connect'){const tid=nodeAt(ev),w=world(ev);if(!d.moved){paintOverlay();return;}
   if(tid&&tid!==d.from){if(addEdge(d.from,tid))setSel([tid]);else paintOverlay();host.rerender(true);}
   else if(!tid){addConnected(d.from,w);}else paintOverlay();return;}
  if(d.kind==='reconnect'){const tid=nodeAt(ev);if(!d.moved){paintOverlay();return;}const e=findEdge(d.key);if(!e){paintOverlay();return;}
   if(tid){const f=d.end==='from'?tid:e.from,t=d.end==='to'?tid:e.to;if(f===t){paintOverlay();return;}
    mut(M=>{const i=edgeIndex(M,d.key);if(i>=0){if(M.edges.some((x,j)=>j!==i&&x.from===f&&x.to===t)){M.edges.splice(i,1);}else{M.edges[i].from=f;M.edges[i].to=t;}}});setSel([],f+'>'+t);}
   else{removeEdges([d.key]);setSel([]);host.toast('Disconnected');}
   host.rerender(true);return;}
  if(d.kind==='marquee'){if(d.box){const b=d.box,ids=[...last.g.nodes.values()].filter(n=>{const p=posOf(n.id);return p&&p.x<b.x+b.w&&p.x+n.w>b.x&&p.y<b.y+b.h&&p.y+n.h>b.y;}).map(n=>n.id);setSel(ids);}return;}
  if(d.moved){if(d.kind==='node'||d.kind==='group'||d.kind==='resize'){store();host.rerender();}return;}
  if(d.kind==='node'){const now=performance.now(),dbl=tap&&tap.id===d.id&&now-tap.t<420;tap={id:d.id,t:now};
   if(!ev.shiftKey&&!ev.metaKey&&!ev.ctrlKey&&sel.size>1)setSel([d.id]);
   if(dbl){tap=null;open('node',d.id,'[data-act=n-label]');}else if(insp)open('node',d.id);paintOverlay();}
  else if(d.kind==='edge'){const now=performance.now(),dbl=tap&&tap.id==='e'+d.id&&now-tap.t<420;tap={id:'e'+d.id,t:now};if(dbl||insp){tap=null;open('edge',d.id);}}
  else if(d.kind==='pan'){if(d.hit&&d.hit.n){setSel([d.hit.n]);open('node',d.hit.n);}else if(d.hit&&d.hit.e){setSel([],d.hit.e);open('edge',d.hit.e);}else{setSel([]);if(!ev.target.closest('.insp'))close();}}});
 stage.addEventListener('dblclick',ev=>{if(!mode()||!canEdit())return;const T=target(ev);if(T.ui||T.h||T.eh)return;ev.preventDefault();
  if(T.rz){resetSize(T.rz.dataset.nid);return;}
  if(T.n){open('node',T.n.dataset.nid,'[data-act=n-label]');}
  else if(T.e){const e=edgeOfEl(T.e);if(e)open('edge',edgeKey(e));}
  else if(T.g){open('group',T.g.dataset.gid,'[data-act=g-title]');}
  else{addElement('rect',world(ev));}});
 stage.addEventListener('contextmenu',ev=>{if(!mode())return;ev.preventDefault();if(!canEdit())return;clearTimeout(press);const T=target(ev);if(T.ui)return;showMenu(ev.clientX,ev.clientY,contextItems(T,world(ev)));});
 document.addEventListener('pointerdown',ev=>{if(menu&&!menu.contains(ev.target))closeMenu();},true);
 stage.addEventListener('focusin',ev=>{if(!mode())return;const n=ev.target.closest&&ev.target.closest('.fc-n');if(n&&!sel.has(n.dataset.nid)){sel=new Set([n.dataset.nid]);selEdge=null;primary=n.dataset.nid;paintOverlay();}});

 /* ---------- keyboard ---------- */
 const ALIGNK={KeyA:'left',KeyH:'center',KeyD:'right',KeyW:'top',KeyV:'middle',KeyS:'bottom'};
 const editable=t=>t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable);
 document.addEventListener('keydown',ev=>{if(!mode()||ev.defaultPrevented)return;const t=ev.target;if(editable(t)||(t.closest&&t.closest('dialog,.dd-list,.cmenu,.insp,.toolbar,.pickers,.side,header')))return;
  const mod=ev.metaKey||ev.ctrlKey,k=ev.key.toLowerCase();let used=true;
  if(!canEdit()){if(k==='escape'){closeMenu();if(insp)close();setSel([]);}else if(k==='enter'&&primary&&sel.size===1)open('node',primary);else if(k==='+'||k==='='){host.zoomIn&&host.zoomIn();}else if(k==='-'||k==='_'){host.zoomOut&&host.zoomOut();}else if(k==='0'){host.fit&&host.fit();}else if(k==='?'){host.showKeys&&host.showKeys();}else used=false;if(used)ev.preventDefault();return;}
  if(mod&&k==='z'&&!ev.shiftKey)undo();else if(mod&&(k==='y'||(k==='z'&&ev.shiftKey)))redo();
  else if(mod&&k==='c'){if(!copy())used=false;}else if(mod&&k==='x'){if(sel.size)cut();else used=false;}
  else if(mod&&k==='v'){if(clip)paste();else{used=false;pasteFromSystem();}}
  else if(mod&&k==='d')duplicate();else if(mod&&k==='a')selectAll();
  else if(mod&&k==='g'){if(ev.shiftKey)ungroupSelection();else groupSelection();}
  else if(ev.altKey&&!mod&&sel.size>1&&ALIGNK[ev.code]){const a=ALIGNK[ev.code];if(ev.shiftKey&&(a==='center'||a==='middle'))distribute(a==='center'?'h':'v');else align(a);}
  else if(ev.shiftKey&&(ev.code==='Digit2'||k==='@')){zoomToSelection();}
  else if(ev.shiftKey&&(ev.code==='Digit1'||k==='!')){host.fit&&host.fit();}
  else if(mod&&k==='enter'){if(primary)addConnected(primary);}
  else if(k==='delete'||k==='backspace'){if(sel.size||selEdge)deleteSelection();else used=false;}
  else if(k==='enter'){if(primary&&sel.size===1)open('node',primary,'[data-act=n-label]');else if(selEdge)open('edge',selEdge);else used=false;}
  else if(k==='escape'){closeMenu();if(insp)close();setSel([]);}
  else if(k.startsWith('arrow')&&ev.altKey&&sel.size===1){const n=last.g.nodes.get(primary),s=ev.shiftKey?40:10;if(n)setSize(primary,n.w+(k==='arrowright'?s:k==='arrowleft'?-s:0),n.h+(k==='arrowdown'?s:k==='arrowup'?-s:0));}
  else if(k.startsWith('arrow')&&sel.size){const s=ev.shiftKey?40:10;nudge(k==='arrowleft'?-s:k==='arrowright'?s:0,k==='arrowup'?-s:k==='arrowdown'?s:0);}
  else if(k==='+'||k==='='){host.zoomIn&&host.zoomIn();}else if(k==='-'||k==='_'){host.zoomOut&&host.zoomOut();}else if(k==='0'){host.fit&&host.fit();}
  else if(k==='?'||(ev.shiftKey&&k==='/')){host.showKeys&&host.showKeys();}
  else used=false;
  if(used)ev.preventDefault();});
 async function pasteFromSystem(){try{const txt=await navigator.clipboard.readText();if(txt&&txt.startsWith('atlas-canvas ')){clip=JSON.parse(txt.slice(13));paste();}}catch{}}

 return {draw,exportSvg,load,getState,setState,store,align,distribute,groupSelection,ungroupSelection,zoomToSelection,selectionBox,setSnap(on){snapOn=!!on;},get selection(){return [...sel];},select(ids){setSel(ids);},reset(){setState(null);close();sel=new Set();selEdge=null;primary=null;hist.u=[];hist.r=[];notify();},open,close,addElement,addWorker,addDiagram,setClusterType,removeCluster,undo,redo,copy,cut,paste,duplicate,deleteSelection,selectAll,
  clusters:()=>last?last.clusters.map(c=>({id:c.id,type:c.type,count:c.nodes.length})):[],workers:()=>FP.WORKERS,
  last:()=>last,get frozen(){return st.frozen;},unfreeze(){pushUndo();st.pos={};st.frozen=false;store();host.rerender();},
  inspectorOpen:()=>!!insp,refreshPanel(){if(insp)renderPanel();},repaint(){paintOverlay();},viewMode(){close();closeMenu();setSel([]);},
  canUndo:()=>hist.u.length>0,canRedo:()=>hist.r.length>0,selectedCount:()=>sel.size};
}
window.FlowCanvas={create};
})();
