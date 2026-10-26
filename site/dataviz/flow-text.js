'use strict';
/* FlowText: the flowchart studio's text in and out.
   toMermaid(src)      clean Mermaid 11 (shapes, @{ shape } for the extra kinds, classDef for status, subgraphs)
   fromMermaid(text)   any Mermaid flowchart (graph/flowchart TD|LR|…, shapes, labels, subgraphs, classes) as studio source
   toOutline(src)      a plain indented outline people can read and edit
   fromOutline(text)   outline or numbered/bulleted steps back to source ("?" = decision, indented "Yes: …" or "Yes → …" = branches)
   describe(text)      a rule-based reading of a written process (if/then, otherwise, go back to) for when AI is unavailable
   fromSpec(spec)      structured JSON {title,direction,nodes:[{id,label,kind,note,lane}],edges:[{from,to,label}]} as source
   The studio source stays Mermaid-style, so every route ends in FlowEditor.toSource and the canvas, code view and share links keep working. */
(()=>{
const FE=()=>window.FlowEngine,ED=()=>window.FlowEditor;
const q=s=>String(s??'').replace(/"/g,'#quot;').replace(/\n/g,'<br/>');
const KSHAPE={doc:'doc',delay:'delay',manual:'trap-t',minput:'sl-rect',display:'curv-trap',offpage:'odd',note:'brace'};
const STATUS_CSS={have:'fill:#E8F7EE,stroke:#16A34A',dont:'fill:#FDECEC,stroke:#DC2626',partial:'fill:#FFF6E5,stroke:#D97706',accent:'fill:#EEE9FF,stroke:#5B2DFF,stroke-width:2px'};

function canonical(g){return ED().toSource(ED().fromGraph(g));}

/* ---------- Mermaid out ---------- */
function toMermaid(src,opt={}){const g=FE().parse(src),L=[];
 if(opt.title)L.push('---',`title: ${String(opt.title).replace(/\n/g,' ')}`,'---');
 L.push(`flowchart ${g.dir==='TB'?'TD':g.dir||'TD'}`);
 const node=n=>{const lab=q(n.label+(n.note?'\n'+n.note:'')),k=FE().kindOf(n);
  if(KSHAPE[k])return `${n.id}@{ shape: ${KSHAPE[k]}, label: "${lab}" }`;
  const sh=k==='person'?'round':k==='system'?'rect':/^mod_|^worker$/.test(k)?'hex':n.shape;
  const w={rect:['[',']'],round:['(',')'],pill:['([','])'],sub:['[[',']]'],data:['[(',')]'],circle:['((','))'],decision:['{','}'],io:['[/','/]'],hex:['{{','}}']}[sh]||['[',']'];
  return `${n.id}${w[0]}"${lab}"${w[1]}`;};
 const kids=new Map(g.groups.map(x=>[x.id,[]])),done=new Set();for(const x of g.groups)if(x.parent&&kids.has(x.parent))kids.get(x.parent).push(x);
 const nodes=[...g.nodes.values()].sort((a,b)=>a.i-b.i);
 const emit=(grp,ind)=>{L.push(`${ind}subgraph ${grp.id.replace(/^grp_/,'')} ["${q(grp.title)}"]`);for(const c of kids.get(grp.id))emit(c,ind+'  ');for(const n of nodes)if(n.group===grp.id){L.push(ind+'  '+node(n));done.add(n.id);}L.push(ind+'end');};
 for(const x of g.groups)if(!x.parent)emit(x,'  ');
 for(const n of nodes)if(!done.has(n.id))L.push('  '+node(n));
 for(const e of g.edges){const k=e.kind==='dashed'?'d':e.kind==='thick'?'t':'s';
  const op=e.bi?{s:'<-->',d:'<-.->',t:'<==>'}[k]:e.head?{s:'--',d:'-.-',t:'=='}[k]+e.head:e.arrow===false?{s:'---',d:'-.-',t:'==='}[k]:{s:'-->',d:'-.->',t:'==>'}[k];
  L.push(`  ${e.from} ${op}${e.label?`|"${q(e.label)}"|`:''} ${e.to}`);}
 const by={};for(const n of nodes){const s=String(n.cls||'').split('.')[0];if(STATUS_CSS[s])(by[s]=by[s]||[]).push(n.id);}
 for(const [s,ids] of Object.entries(by))L.push(`  classDef ${s} ${STATUS_CSS[s]}`,`  class ${ids.join(',')} ${s}`);
 return L.join('\n');}

/* ---------- Mermaid in ---------- */
function fromMermaid(text){let t=String(text||'').replace(/\r/g,'');
 t=t.replace(/^\s*---[\s\S]*?---\s*\n/,'');/* front matter */
 t=t.replace(/^\s*```(?:mermaid)?\s*\n?|```\s*$/gm,'');
 t=t.replace(/fa:fa-[\w-]+\s*/g,'');
 if(!/^\s*(flowchart|graph)\b/im.test(t))t='flowchart TD\n'+t;
 /* "A --text--> B" with no spaces, and "A-- text -->B", are written the same way by the parser */
 const g=FE().parse(t);if(!g.nodes.size)throw new Error('No nodes found. A Mermaid flowchart starts with “flowchart TD” or “graph LR”.');
 if(g.dir==='RL')g.dir='LR';if(g.dir==='BT')g.dir='TB';
 return canonical(g);}

/* ---------- outline out ---------- */
const KWORD={pill:'start/end',data:'database',io:'input/output',sub:'subprocess',round:'soft',circle:'point',doc:'document',delay:'delay',manual:'manual',minput:'manual input',display:'display',offpage:'off-page',note:'note',person:'person',system:'system',worker:'worker',mod_internal:'internal connection',mod_external:'external connection',mod_flow:'flow connection'};
const WORDK={start:'pill',end:'pill',stop:'pill','start/end':'pill',terminal:'pill',database:'data',data:'data',db:'data',store:'data','data store':'data',input:'io',output:'io','input/output':'io',io:'io',subprocess:'sub','sub-process':'sub',soft:'round',point:'circle',document:'doc',doc:'doc',delay:'delay',wait:'delay',manual:'manual','manual input':'minput',display:'display',screen:'display','off-page':'offpage',offpage:'offpage',note:'note',person:'person',team:'person',system:'system',app:'system',decision:'decision',worker:'worker','internal connection':'mod_internal','external connection':'mod_external','flow connection':'mod_flow'};
const ARROW={solid:'→',dashed:'⇢',thick:'⇒'};
function toOutline(src){const g=FE().parse(src),nodes=[...g.nodes.values()].sort((a,b)=>a.i-b.i),out=[];let grp;
 const tag=n=>{const k=FE().kindOf(n);if(k==='decision'||n.shape==='decision')return /\?$/.test(n.label)?'':' [decision]';return KWORD[k]?` [${KWORD[k]}]`:'';};
 nodes.forEach((n,i)=>{const top=(()=>{let x=g.groups.find(y=>y.id===n.group);while(x&&x.parent)x=g.groups.find(y=>y.id===x.parent);return x;})();
  if((top&&top.id)!==(grp&&grp.id)){if(top)out.push(`## ${top.title}`);else if(grp)out.push('## (no group)');grp=top;}
  const st=String(n.cls||'').split('.')[0];out.push(`${n.label}${tag(n)}${st&&st!=='none'?` (${st})`:''}${n.note?' | '+n.note:''}`);
  const outs=g.edges.filter(e=>e.from===n.id),next=nodes[i+1];
  if(outs.length===1&&next&&outs[0].to===next.id&&!outs[0].label&&outs[0].kind==='solid'&&outs[0].arrow!==false&&!outs[0].bi&&!outs[0].head)return;
  if(!outs.length&&next){out.push('  (end)');return;}
  for(const e of outs)out.push(`  ${e.label?e.label+' ':''}${ARROW[e.kind]||'→'} ${g.nodes.get(e.to).label}`);});
 return out.join('\n');}

/* ---------- outline in ---------- */
function fromOutline(text,opt={}){const lines=String(text||'').replace(/\r/g,'').split('\n');
 const M={dir:opt.dir||'TD',nodes:new Map(),edges:[],items:[]};const byLabel=new Map(),taken=id=>M.nodes.has(id)||M.items.some(it=>it.type==='stage'&&it.id===id);
 const slug=s=>{let b=String(s||'step').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,18)||'step';if(/^\d/.test(b))b='s_'+b;if(['end','graph','flowchart','subgraph','class','style','click','direction','classdef'].includes(b))b+='_1';let id=b,k=2;while(taken(id))id=b+'_'+k++;return id;};
 let stage=null;const clean=s=>String(s).replace(/[\[\]{}"]/g,'').replace(/\s+/g,' ').trim();
 const implicit=new Set();
 const place=id=>{M.items.forEach(it=>{if(it.type==='stage')it.steps=it.steps.filter(x=>x!==id);});M.items=M.items.filter(it=>!(it.type==='step'&&it.id===id));if(stage)stage.steps.push(id);else M.items.push({type:'step',id});};
 const node=(raw,make=true,top=false)=>{let s=String(raw).trim(),note='',kind=null,status=null;
  const pm=s.match(/^(.*?)\s+\|\s+(.*)$/);if(pm){s=pm[1];note=pm[2];}
  const sm=s.match(/\s*\((have|dont|partial|accent|done|todo)\)\s*$/i);if(sm){status={done:'have',todo:'dont'}[sm[1].toLowerCase()]||sm[1].toLowerCase();s=s.slice(0,sm.index);}
  const km=s.match(/\s*\[([a-z\/ -]+)\]\s*$/i);if(km&&WORDK[km[1].toLowerCase()]){kind=WORDK[km[1].toLowerCase()];s=s.slice(0,km.index);}
  const key=clean(s).toLowerCase().replace(/[?.!]+$/,'');if(!key)return null;
  const set=(id,fresh)=>{const q=/\?\s*$/.test(s);const kd=kind||(q?'decision':null),K=kd&&FE().KIND[kd],n=M.nodes.get(id);
   if(fresh||kd)n.shape=kd==='decision'?'decision':K&&K.tag?K.shape:(kd||'rect');if(fresh||kd||status)n.cls=K&&K.tag?`${status||'none'}.${kd}`:status;if(note)n.note=clean(note);};
  if(byLabel.has(key)){const id=byLabel.get(key);if(top&&implicit.has(id)){implicit.delete(id);set(id,false);place(id);}return id;}
  if(!make)return null;
  const id=slug(s);M.nodes.set(id,{id,label:clean(s)||'Step',note:'',shape:'rect',cls:null});set(id,true);
  if(stage)stage.steps.push(id);else M.items.push({type:'step',id});byLabel.set(key,id);if(!top)implicit.add(id);return id;};
 const edge=(from,to,label,kind)=>{if(!from||!to||from===to)return;if(M.edges.some(e=>e.from===from&&e.to===to))return;M.edges.push({from,to,label:clean(label||''),kind:kind||'solid',arrow:true});};
 const OPP={yes:'No',no:'Yes',true:'False',false:'True',pass:'Fail',fail:'Pass',approved:'Not approved',ok:'Not OK',valid:'Invalid',invalid:'Valid'};
 let prev=null,arrowed=false,branches=[],lastTop=null;
 const firstLine=lines.findIndex(l=>l.trim());if(firstLine>=0&&/^#\s+/.test(lines[firstLine]))lines.splice(firstLine,1);
 for(const raw of lines){if(!raw.trim())continue;const ind=/^\s+/.test(raw);let line=raw.trim();
  const h=line.match(/^#{1,3}\s+(.+)$/);if(h){const title=h[1].trim();if(/^\(no group\)$/i.test(title)){stage=null;continue;}stage={type:'stage',id:slug(title),title,steps:[]};M.items.push(stage);continue;}
  line=line.replace(/^(?:[-*•+]|\d+[.)]|[a-z][.)])\s+/i,'');
  if(ind&&lastTop){if(/^\(end\)$/i.test(line)){arrowed=true;continue;}
   const am=line.match(/^(.*?)\s*(→|->|⇢|-\.->|⇒|==>)\s*(.+)$/);
   if(am){const kind=/⇢|-\.->/.test(am[2])?'dashed':/⇒|==>/.test(am[2])?'thick':'solid';const to=node(am[3].replace(/^(back to|go to|goto|return to)\s+/i,''));edge(lastTop,to,am[1],kind);arrowed=true;continue;}
   const bm=line.match(/^([^:]{1,28}):\s*(.+)$/);
   if(bm){const tgt=bm[2].replace(/^(?:back to|go to|goto|return to|loop back to)\s+(?:step\s+)?/i,'');const existed=!!node(tgt,false);const to=node(tgt);edge(lastTop,to,bm[1].trim(),'solid');branches.push({to,fresh:!existed,label:bm[1].trim()});continue;}
   const to=node(line);edge(lastTop,to,'','solid');arrowed=true;continue;}
  const id=node(line,true,true);if(!id)continue;
  if(!arrowed){if(branches.length===1){const l=branches[0].label.toLowerCase();edge(lastTop,id,OPP[l]||'Otherwise','solid');}
   else if(branches.length>1){const f=[...branches].reverse().find(b=>b.fresh);if(f)edge(f.to,id,'','solid');}
   else if(prev)edge(prev,id,'','solid');}
  prev=id;lastTop=id;arrowed=false;branches=[];}
 /* first and last steps read as start and end */
 const ids=[...M.nodes.keys()];if(opt.ends!==false&&ids.length>1){for(const id of [ids[0],ids[ids.length-1]]){const n=M.nodes.get(id);if(n.shape==='rect'&&!n.cls&&(id===ids[0]?!M.edges.some(e=>e.to===id):!M.edges.some(e=>e.from===id)))n.shape='pill';}}
 if(!M.nodes.size)throw new Error('Write one step per line.');
 return ED().toSource(M);}

/* ---------- a written process, read by rules ---------- */
function describe(text){let t=String(text||'').replace(/\r/g,'').trim();if(!t)throw new Error('Describe the process first.');
 /* one paragraph: split into sentences and "then" clauses */
 const many=t.split('\n').filter(l=>l.trim()).length>1;
 let parts=many?t.split('\n'):t.split(/(?<=[.;!])\s+|,\s*(?:and\s+)?then\s+|\s+then\s+(?=[a-z])/i);
 const out=[];let lastDec=null;
 const tidy=s=>s.trim().replace(/^(?:[-*•+]|\d+[.)])\s+/,'').replace(/^(?:first|next|then|after that|afterwards|finally|lastly|and)\s*,?\s+/i,'').replace(/[.;]+$/,'').trim();
 const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
 for(const raw of parts){const ind=/^\s+/.test(raw);let s=tidy(raw);if(!s)continue;
  let m;
  if((m=s.match(/^if\s+(.+?)(?:,\s*|\s+then\s+)(.+)$/i))){const cond=cap(m[1].replace(/\?$/,''))+'?';out.push(cond);lastDec=cond;
   const act=m[2].replace(/^then\s+/i,'');const back=act.match(/^(?:go back to|return to|loop back to|back to|go to)\s+(?:step\s+)?(.+)$/i);out.push(`  Yes: ${back?back[1]:cap(act)}`);continue;}
  if(lastDec&&(m=s.match(/^(?:otherwise|else|if not|if no)\s*,?\s*(.+)$/i))){const back=m[1].match(/^(?:go back to|return to|loop back to|back to|go to)\s+(?:step\s+)?(.+)$/i);out.push(`  No: ${back?back[1]:cap(m[1])}`);continue;}
  if((m=s.match(/^(?:go back to|return to|loop back to|back to)\s+(?:step\s+)?(.+)$/i))&&out.length){out.push(`  → ${m[1]}`);continue;}
  if(ind){out.push('  '+s);continue;}
  lastDec=/\?$/.test(s)?s:null;out.push(cap(s));}
 /* numbered references ("go back to step 2") point at the second step */
 const tops=out.filter(l=>!/^\s/.test(l));
 const fixed=out.map(l=>l.replace(/^(\s+(?:[^:→]{1,28}:|→)\s*)(\d+)$/,(all,a,n)=>tops[+n-1]?a+tops[+n-1].replace(/\s*\[.*\]$/,''):all));
 return fromOutline(fixed.join('\n'));}

/* ---------- structured JSON (from the AI) ---------- */
const AIKIND={start:'pill',end:'pill',step:'rect',process:'rect',action:'rect',decision:'decision',data:'data',database:'data',io:'io',input:'io',output:'io',document:'doc',subprocess:'sub',delay:'delay',manual:'manual',person:'person',system:'system',note:'note'};
function fromSpec(spec){const nodes=(spec&&spec.nodes)||[];if(!nodes.length)throw new Error('The answer had no steps.');
 const M={dir:/^LR$/i.test(spec.direction||'')?'LR':'TD',nodes:new Map(),edges:[],items:[]},idMap=new Map(),lanes=new Map();
 const taken=id=>M.nodes.has(id)||[...lanes.values()].some(l=>l.id===id);
 const slug=s=>{let b=String(s||'step').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,18)||'step';if(/^\d/.test(b))b='s_'+b;if(['end','graph','flowchart','subgraph','class','style','click','direction','classdef'].includes(b))b+='_1';let id=b,k=2;while(taken(id))id=b+'_'+k++;return id;};
 const clean=s=>String(s??'').replace(/[\[\]{}"|]/g,'').replace(/\s+/g,' ').trim().slice(0,90);
 for(const n of nodes.slice(0,60)){const kind=AIKIND[String(n.kind||'step').toLowerCase()]||'rect',K=FE().KIND[kind]||{},id=slug(n.id||n.label);idMap.set(String(n.id),id);
  M.nodes.set(id,{id,label:clean(n.label)||'Step',note:clean(n.note),shape:K.tag?K.shape:kind,cls:K.tag?`none.${kind}`:null});
  const lane=clean(n.lane);if(lane){if(!lanes.has(lane)){const st={type:'stage',id:slug('lane_'+lane),title:lane,steps:[]};lanes.set(lane,st);M.items.push(st);}lanes.get(lane).steps.push(id);}else M.items.push({type:'step',id});}
 for(const e of (spec.edges||[]).slice(0,120)){const a=idMap.get(String(e.from)),b=idMap.get(String(e.to));if(a&&b&&a!==b&&!M.edges.some(x=>x.from===a&&x.to===b))M.edges.push({from:a,to:b,label:clean(e.label).slice(0,30),kind:'solid',arrow:true});}
 return ED().toSource(M);}

/* ---------- JSON file ---------- */
function toJSON(o){return JSON.stringify({format:'atlas-flowchart',version:1,...o},null,2);}
function fromJSON(text){const o=JSON.parse(text);if(!o||typeof o.source!=='string')throw new Error('This JSON is not a flowchart studio file.');return o;}

/* what kind of text is this? */
function sniff(text){const t=String(text||'').trim();if(!t)return 'empty';if(/^\{[\s\S]*"source"/.test(t))return 'json';if(/^\s*(?:```mermaid|---\s*\n[\s\S]*?---\s*\n\s*)?\s*(flowchart|graph)\b/i.test(t)||/^\s*\w+\s*(-->|==>|-\.->|---)/m.test(t))return 'mermaid';
 if(/^\s*if\s|\botherwise\b|\bthen\b/im.test(t)&&!/^\s+\S+.*?:/m.test(t))return 'prose';return 'outline';}
function anyText(text){const k=sniff(text);if(k==='json')return {kind:k,...fromJSON(text)};if(k==='mermaid')return {kind:k,source:fromMermaid(text)};if(k==='prose')return {kind:k,source:describe(text)};if(k==='empty')throw new Error('Paste some text first.');return {kind:k,source:fromOutline(text)};}

window.FlowText={toMermaid,fromMermaid,toOutline,fromOutline,describe,fromSpec,toJSON,fromJSON,sniff,anyText};
})();
