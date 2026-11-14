'use strict';
/* FlowEditor: edit a flowchart without writing Mermaid. Stages hold steps; each step has a status, a kind,
   an optional note and a list of "goes to" connections. Every change is written back as Mermaid source,
   so the code view, share links and exports keep working unchanged. */
(()=>{
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clean=(s,parens)=>String(s??'').replace(parens?/[\[\]{}"]/g:/[\[\]{}()"]/g,'').replace(/\|/g,'/').replace(/\s+/g,' ').trim();
const KINDS=[['rect','Step'],['decision','Decision'],['pill','Start / end'],['data','Data store'],['io','Input / output'],['sub','Sub-process'],['round','Soft step'],['circle','Point']];
const WRAP={rect:['[',']'],decision:['{','}'],pill:['([','])'],data:['[(',')]'],io:['[/','/]'],sub:['[[',']]'],round:['(',')'],circle:['((','))']};
const STATUS=[[null,'No status'],['have','Have'],['dont',"Don't have"],['partial','Partial'],['accent','Key step']];
const LINKS=[['solid','→'],['dashed','⇢ dashed'],['thick','⇒ main path']];

/* ---------- model ---------- */
function fromGraph(g){const top=gid=>{let x=g.groups.find(y=>y.id===gid);while(x&&x.parent)x=g.groups.find(y=>y.id===x.parent);return x||null;};
 const M={dir:g.dir||'TD',nodes:new Map(),edges:[],items:[]};const stageOf=new Map();
 [...g.nodes.values()].sort((a,b)=>a.i-b.i).forEach(n=>{M.nodes.set(n.id,{id:n.id,label:n.label,note:n.note||'',shape:n.shape||'rect',cls:n.cls||null});
  const grp=top(n.group);if(grp){let st=stageOf.get(grp.id);if(!st){st={type:'stage',id:grp.id.replace(/^grp_/,''),title:grp.title||grp.id.replace(/^grp_/,''),steps:[]};stageOf.set(grp.id,st);M.items.push(st);}st.steps.push(n.id);}
  else M.items.push({type:'step',id:n.id});});
 g.edges.forEach(e=>M.edges.push({from:e.from,to:e.to,label:e.label||'',kind:e.kind||'solid',arrow:e.arrow!==false,bi:!!e.bi,...(e.head?{head:e.head}:{})}));
 return M;}
function toSource(M){const L=[`flowchart ${M.dir||'TD'}`];const node=id=>{const n=M.nodes.get(id),w=WRAP[n.shape]||WRAP.rect,keep=!['round','circle'].includes(n.shape),lab=clean(n.label,keep)||'Untitled',note=clean(n.note,keep);return `${id}${w[0]}${lab}${note?' | '+note:''}${w[1]}${n.cls?':::'+n.cls:''}`;};
 for(const it of M.items){if(it.type==='stage'){L.push(`  subgraph ${it.id} [${clean(it.title)||'Stage'}]`);it.steps.forEach(id=>L.push('    '+node(id)));L.push('  end');}else L.push('  '+node(it.id));}
 for(const e of M.edges){const lab=clean(e.label);const op=e.head&&!e.bi?(e.kind==='dashed'?'-.-':e.kind==='thick'?'==':'--')+e.head:e.bi?(e.kind==='dashed'?'<-.->':e.kind==='thick'?'<==>':'<-->'):e.kind==='dashed'?'-.->':e.kind==='thick'?'==>':e.arrow===false?'---':'-->';L.push(`  ${e.from} ${op}${lab?`|${lab}|`:''} ${e.to}`);}
 return L.join('\n');}
const slug=(s,taken)=>{let b=String(s||'step').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,18)||'step';if(/^\d/.test(b))b='s_'+b;let id=b,k=2;while(taken(id))id=b+'_'+k++;return id;};
const RESERVED=new Set(['end','subgraph','graph','flowchart','class','classdef','style','click','direction']);

function mount(root,api){let M=null,open=new Set(),lastSrc=null;
 const order=()=>M.items.flatMap(it=>it.type==='stage'?it.steps:[it.id]);
 const stageOfStep=id=>M.items.find(it=>it.type==='stage'&&it.steps.includes(id))||null;
 const taken=id=>M.nodes.has(id)||RESERVED.has(id)||M.items.some(it=>it.type==='stage'&&it.id===id);
 const commit=(structural=true)=>{const src=toSource(M);lastSrc=src;api.set(src);if(structural)draw();};

 /* adding: a new step goes straight after `after` and takes over its onward connections, so the chain stays whole */
 function addStep(after,stage,shape='rect'){const id=slug('step',taken);M.nodes.set(id,{id,label:'New step',note:'',shape,cls:null});
  if(stage){const i=after?stage.steps.indexOf(after):stage.steps.length-1;stage.steps.splice(i+1,0,id);}
  else{const i=after?M.items.findIndex(it=>it.type==='step'&&it.id===after):M.items.length-1;M.items.splice(i+1,0,{type:'step',id});}
  if(after){const a=M.nodes.get(after);if(a.shape!=='decision'){M.edges.filter(e=>e.from===after).forEach(e=>{e.from=id;});}M.edges.push({from:after,to:id,label:'',kind:'solid',arrow:true});}
  open.add(id);commit();focusKey(`l:${id}`,true);}
 function removeStep(id){const ins=M.edges.filter(e=>e.to===id&&e.from!==id),outs=M.edges.filter(e=>e.from===id&&e.to!==id);
  M.edges=M.edges.filter(e=>e.from!==id&&e.to!==id);if(ins.length===1&&outs.length===1&&ins[0].from!==outs[0].to)M.edges.push({...ins[0],to:outs[0].to});
  M.nodes.delete(id);M.items=M.items.filter(it=>!(it.type==='step'&&it.id===id));M.items.forEach(it=>{if(it.type==='stage')it.steps=it.steps.filter(x=>x!==id);});open.delete(id);commit();}
 function moveStep(id,d){const st=stageOfStep(id);if(st){const i=st.steps.indexOf(id),j=i+d;if(j<0||j>=st.steps.length)return;[st.steps[i],st.steps[j]]=[st.steps[j],st.steps[i]];}
  else{const i=M.items.findIndex(it=>it.type==='step'&&it.id===id),j=i+d;if(j<0||j>=M.items.length)return;[M.items[i],M.items[j]]=[M.items[j],M.items[i]];}commit();focusKey(`${d<0?'u':'d'}:${id}`);}
 function setStage(id,target){const from=stageOfStep(id);if(from)from.steps=from.steps.filter(x=>x!==id);else M.items=M.items.filter(it=>!(it.type==='step'&&it.id===id));
  const to=M.items.find(it=>it.type==='stage'&&it.id===target);if(to)to.steps.push(id);else M.items.push({type:'step',id});commit();focusKey(`g:${id}`);}
 function addStage(){const id=slug('stage',taken);const st={type:'stage',id,title:'New stage',steps:[]};M.items.push(st);commit();focusKey(`t:${id}`,true);}
 function removeStage(id){const i=M.items.findIndex(it=>it.type==='stage'&&it.id===id);if(i<0)return;const st=M.items[i];M.items.splice(i,1,...st.steps.map(s=>({type:'step',id:s})));commit();}
 function moveStage(id,d){const i=M.items.findIndex(it=>it.type==='stage'&&it.id===id),j=i+d;if(j<0||j>=M.items.length)return;[M.items[i],M.items[j]]=[M.items[j],M.items[i]];commit();focusKey(`${d<0?'su':'sd'}:${id}`);}

 /* ---------- view ---------- */
 const sum=id=>{const outs=M.edges.filter(e=>e.from===id);if(!outs.length)return '<span class="fe-end">ends here</span>';
  return outs.map(e=>`${e.label?`<b>${esc(e.label)}</b> `:''}→ ${esc(M.nodes.get(e.to)?.label||e.to)}`).join(' · ');};
 const hd=n=>{const h=String(n.cls||'').split('.')[0];return h&&h!=='none'?h:null;};
 const dot=n=>`<button type="button" class="fe-dot" data-act="status" data-id="${n.id}" data-k="s:${n.id}" data-st="${hd(n)||''}" aria-label="Status: ${esc((STATUS.find(s=>s[0]===hd(n))||STATUS[0])[1])}. Click to change" title="${esc((STATUS.find(s=>s[0]===hd(n))||STATUS[0])[1])}"></button>`;
 function stepRow(id,i,len){const n=M.nodes.get(id),isOpen=open.has(id),outs=M.edges.map((e,k)=>[e,k]).filter(([e])=>e.from===id);
  const opts=sel=>order().filter(x=>x!==id).map(x=>`<option value="${x}"${x===sel?' selected':''}>${esc(M.nodes.get(x).label)}</option>`).join('');
  return `<li class="fe-step${isOpen?' open':''}${n.shape==='decision'?' dec':''}" data-id="${id}">
  <div class="fe-row">${dot(n)}<input class="fe-label" data-act="label" data-id="${id}" data-k="l:${id}" value="${esc(n.label)}" aria-label="Step name">
   <button type="button" class="fe-ic" data-act="toggle" data-id="${id}" data-k="o:${id}" aria-expanded="${isOpen}" aria-label="${isOpen?'Close':'Edit'} details for ${esc(n.label)}">${isOpen?'▴':'▾'}</button></div>
  <p class="fe-sum">${n.shape==='decision'?'<i class="fe-tag">Decision</i> ':''}${sum(id)}</p>
  ${isOpen?`<div class="fe-more">
   <label class="fe-f">Note <input data-act="note" data-id="${id}" data-k="n:${id}" value="${esc(n.note)}" placeholder="Optional second line"></label>
   <div class="fe-two"><label class="fe-f">Kind <select data-act="shape" data-id="${id}" data-k="k:${id}">${KINDS.map(([v,l])=>`<option value="${v}"${v===n.shape?' selected':''}>${l}</option>`).join('')}</select></label>
   <label class="fe-f">Stage <select data-act="stage" data-id="${id}" data-k="g:${id}"><option value="">No stage</option>${M.items.filter(it=>it.type==='stage').map(st=>`<option value="${st.id}"${stageOfStep(id)===st?' selected':''}>${esc(st.title)}</option>`).join('')}</select></label></div>
   <div class="fe-f">Goes to</div>
   <ul class="fe-links">${outs.map(([e,k])=>`<li><input data-act="elabel" data-e="${k}" data-k="el:${k}" value="${esc(e.label)}" placeholder="${n.shape==='decision'?'Yes / No…':'label'}" aria-label="Connection label"><select data-act="eto" data-e="${k}" data-k="et:${k}" aria-label="Goes to step">${opts(e.to)}</select><select data-act="ekind" data-e="${k}" data-k="ek:${k}" aria-label="Line style">${LINKS.map(([v,l])=>`<option value="${v}"${v===e.kind?' selected':''}>${l}</option>`).join('')}</select><button type="button" class="fe-ic" data-act="eremove" data-e="${k}" aria-label="Remove connection">×</button></li>`).join('')}</ul>
   <div class="fe-acts"><button type="button" class="fe-btn" data-act="connect" data-id="${id}" data-k="c:${id}">+ Connection</button><button type="button" class="fe-btn" data-act="after" data-id="${id}">+ Step after</button>${n.shape!=='decision'?`<button type="button" class="fe-btn" data-act="branch" data-id="${id}">+ Yes / No after</button>`:''}</div>
   <div class="fe-acts"><button type="button" class="fe-ic" data-act="up" data-id="${id}" data-k="u:${id}" aria-label="Move up"${i===0?' disabled':''}>↑</button><button type="button" class="fe-ic" data-act="down" data-id="${id}" data-k="d:${id}" aria-label="Move down"${i===len-1?' disabled':''}>↓</button><span style="flex:1"></span><button type="button" class="fe-btn danger" data-act="remove" data-id="${id}">Delete step</button></div>
  </div>`:''}</li>`;}
 function draw(){if(!M)return;const keep=document.activeElement&&root.contains(document.activeElement)?document.activeElement.dataset.k:null;let html='';
  const stages=M.items.filter(it=>it.type==='stage');
  M.items.forEach((it,ii)=>{if(it.type==='stage'){const si=stages.indexOf(it);html+=`<section class="fe-stage" data-stage="${it.id}"><div class="fe-head"><span class="fe-num">${String(si+1).padStart(2,'0')}</span><input class="fe-title" data-act="title" data-stage="${it.id}" data-k="t:${it.id}" value="${esc(it.title)}" aria-label="Stage name">
    <button type="button" class="fe-ic" data-act="sup" data-stage="${it.id}" data-k="su:${it.id}" aria-label="Move stage up"${ii===0?' disabled':''}>↑</button><button type="button" class="fe-ic" data-act="sdown" data-stage="${it.id}" data-k="sd:${it.id}" aria-label="Move stage down"${ii===M.items.length-1?' disabled':''}>↓</button><button type="button" class="fe-ic" data-act="sremove" data-stage="${it.id}" aria-label="Remove stage (keeps its steps)" title="Remove stage (keeps its steps)">×</button></div>
    <ol class="fe-steps">${it.steps.map((id,i)=>stepRow(id,i,it.steps.length)).join('')}</ol><button type="button" class="fe-add" data-act="add" data-stage="${it.id}">+ Add step</button></section>`;}
   else html+=`<ol class="fe-steps fe-loose">${stepRow(it.id,ii,M.items.length)}</ol>`;});
  html+=`<div class="fe-acts fe-foot"><button type="button" class="fe-btn" data-act="addloose">+ Add a step</button><button type="button" class="fe-btn" data-act="addstage" title="A stage is a named group of steps">+ Add a stage</button></div>`;
  root.innerHTML=html;if(keep)focusKey(keep);}
 function focusKey(k,select){requestAnimationFrame(()=>{const el=root.querySelector(`[data-k="${CSS.escape(k)}"]`);if(el){el.focus({preventScroll:false});if(select&&el.select)el.select();}});}

 /* ---------- events ---------- */
 root.addEventListener('input',e=>{const el=e.target,a=el.dataset.act;if(!a)return;
  if(a==='label'){M.nodes.get(el.dataset.id).label=el.value;commit(false);}
  else if(a==='note'){M.nodes.get(el.dataset.id).note=el.value;commit(false);}
  else if(a==='title'){M.items.find(it=>it.id===el.dataset.stage&&it.type==='stage').title=el.value;commit(false);}
  else if(a==='elabel'){M.edges[+el.dataset.e].label=el.value;commit(false);}});
 root.addEventListener('change',e=>{const el=e.target,a=el.dataset.act;if(!a)return;
  if(a==='shape'){M.nodes.get(el.dataset.id).shape=el.value;commit();}
  else if(a==='stage')setStage(el.dataset.id,el.value);
  else if(a==='eto'){M.edges[+el.dataset.e].to=el.value;commit();}
  else if(a==='ekind'){M.edges[+el.dataset.e].kind=el.value;commit();}
  else if(a==='label'||a==='title'||a==='elabel')draw();});
 root.addEventListener('keydown',e=>{const el=e.target;if(e.key==='Enter'&&el.dataset.act==='label'){e.preventDefault();addStep(el.dataset.id,stageOfStep(el.dataset.id));}
  if(e.key==='Enter'&&el.dataset.act==='title'){e.preventDefault();el.blur();}});
 root.addEventListener('click',e=>{const b=e.target.closest('button[data-act]');if(!b)return;const a=b.dataset.act,id=b.dataset.id,sid=b.dataset.stage;
  if(a==='status'){const n=M.nodes.get(id),parts=String(n.cls||'').split('.'),head=parts[0]&&parts[0]!=='none'?parts[0]:null,i=STATUS.findIndex(s=>s[0]===head),nx=STATUS[(i+1)%STATUS.length][0],kinds=parts.slice(1);n.cls=kinds.length?[nx||'none',...kinds].join('.'):nx;commit();focusKey(`s:${id}`);}
  else if(a==='toggle'){open.has(id)?open.delete(id):open.add(id);draw();focusKey(`o:${id}`);}
  else if(a==='add'){const st=M.items.find(it=>it.type==='stage'&&it.id===sid);const last=st.steps[st.steps.length-1];
   if(last)addStep(last,st);else{const prev=order().filter(x=>!st.steps.includes(x));const before=M.items.slice(0,M.items.indexOf(st)).flatMap(it=>it.type==='stage'?it.steps:[it.id]).pop();
    const nid=slug('step',taken);M.nodes.set(nid,{id:nid,label:'New step',note:'',shape:'rect',cls:null});st.steps.push(nid);if(before&&prev.length){const bn=M.nodes.get(before);if(bn.shape!=='decision')M.edges.filter(x=>x.from===before&&!st.steps.includes(x.to)).forEach(x=>{x.from=nid;});M.edges.push({from:before,to:nid,label:'',kind:'solid',arrow:true});}open.add(nid);commit();focusKey(`l:${nid}`,true);}}
  else if(a==='after')addStep(id,stageOfStep(id));
  else if(a==='branch'){const st=stageOfStep(id),dec=slug('check',taken);M.nodes.set(dec,{id:dec,label:'Approved?',note:'',shape:'decision',cls:null});
   if(st)st.steps.splice(st.steps.indexOf(id)+1,0,dec);else M.items.splice(M.items.findIndex(it=>it.type==='step'&&it.id===id)+1,0,{type:'step',id:dec});
   const outs=M.edges.filter(x=>x.from===id);outs.forEach(x=>{x.from=dec;if(!x.label)x.label='Yes';});M.edges.push({from:id,to:dec,label:'',kind:'solid',arrow:true});M.edges.push({from:dec,to:id,label:'No',kind:'solid',arrow:true});
   open.add(dec);commit();focusKey(`l:${dec}`,true);}
  else if(a==='connect'){const o=order(),i=o.indexOf(id),to=o[i+1]||o.find(x=>x!==id);if(!to)return;M.edges.push({from:id,to,label:'',kind:'solid',arrow:true});commit();focusKey(`et:${M.edges.length-1}`);}
  else if(a==='eremove'){M.edges.splice(+b.dataset.e,1);commit();}
  else if(a==='remove')removeStep(id);
  else if(a==='up')moveStep(id,-1);else if(a==='down')moveStep(id,1);
  else if(a==='addstage')addStage();else if(a==='sremove')removeStage(sid);else if(a==='sup')moveStage(sid,-1);else if(a==='sdown')moveStage(sid,1);
  else if(a==='addloose'){const last=M.items.length?M.items[M.items.length-1]:null;addStep(last&&last.type==='step'?last.id:null,null);}});

 return {
  /* re-read the source; skipped when the source is what this editor just wrote */
  load(src){if(src===lastSrc&&M)return true;try{const g=window.FlowEngine.parse(src);M=fromGraph(g);lastSrc=src;draw();return true;}catch(err){root.innerHTML=`<p class="fe-err">The visual editor could not read this source: ${esc(err.message||err)}. Fix it in Code.</p>`;M=null;return false;}},
  select(id){if(!M||!M.nodes.has(id))return;open.add(id);draw();const li=root.querySelector(`.fe-step[data-id="${CSS.escape(id)}"]`);if(li){li.scrollIntoView({block:'center',behavior:'smooth'});li.classList.add('flash');setTimeout(()=>li.classList.remove('flash'),900);}focusKey(`l:${id}`);},
  find(text){if(!M)return null;const t=String(text).trim().toLowerCase();if(!t)return null;let best=null;for(const n of M.nodes.values()){const l=n.label.toLowerCase();if(l===t)return n.id;if(!best&&(l.startsWith(t)||t.startsWith(l)||l.toUpperCase()===text.trim()))best=n.id;}return best;}};}
window.FlowEditor={mount,toSource,fromGraph};
})();
