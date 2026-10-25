'use strict';
/* FlowPresets: every diagram type is a way of arranging the same elements on one canvas.
   place(type, nodes, edges, ctx) gives each element a starting position; the person moves them freely after that.
   finish(type, ...) adds what a type needs on top (sequence lifelines, timeline axis, journey mood bands).
   compose() lays several diagrams side by side so different types can live on one canvas. */
(()=>{
const TYPES=[
 {id:'flow',name:'Flow',hint:'Top-down process with decisions'},
 {id:'stepper',name:'Step list',hint:'Numbered, long processes'},
 {id:'stages',name:'Stage columns',hint:'Phases side by side'},
 {id:'cycle',name:'Cycle',hint:'Processes that loop'},
 {id:'tree',name:'Decision tree',hint:'Many yes/no forks'},
 {id:'capability',name:'Capability map',hint:'What we have vs need'},
 {id:'swimlanes',name:'Swimlanes',hint:'Owners in lanes'},
 {id:'mindmap',name:'Mind map',hint:'Overview, no order'},
 {id:'sequence',name:'Sequence diagram',hint:'Who sends what, in order',more:true},
 {id:'er',name:'Entity relationship',hint:'Data tables and how they link',more:true},
 {id:'state',name:'State machine',hint:'States and what moves between them',more:true},
 {id:'org',name:'Org chart',hint:'Who reports to whom',more:true},
 {id:'timeline',name:'Timeline',hint:'Milestones along a line',more:true},
 {id:'journey',name:'Customer journey',hint:'Steps and how it feels, by stage',more:true}
];
const byId=Object.fromEntries(TYPES.map(t=>[t.id,t]));
const GAP=36;
const ord=nodes=>[...nodes].sort((a,b)=>a.i-b.i);
const norm=pos=>{let x0=1e9,y0=1e9;for(const p of Object.values(pos)){x0=Math.min(x0,p.x);y0=Math.min(y0,p.y);}for(const p of Object.values(pos)){p.x=Math.round(p.x-x0);p.y=Math.round(p.y-y0);}return pos;};
const box=(pos,nodes)=>{let w=0,h=0;for(const n of nodes){const p=pos[n.id];w=Math.max(w,p.x+n.w);h=Math.max(h,p.y+n.h);}return {w,h};};
const top=(ctx,n)=>{let x=ctx.groups.find(g=>g.id===n.group);while(x&&x.parent)x=ctx.groups.find(g=>g.id===x.parent);return x?x.id:null;};

/* a tidy tree: children from the edges, depth along one axis, leaves spread along the other */
function tree(nodes,edges,{horiz=true,gx=70,gy=26}={}){
 const ids=new Set(nodes.map(n=>n.id)),by=new Map(nodes.map(n=>[n.id,n])),kids=new Map(nodes.map(n=>[n.id,[]])),hasIn=new Set();
 for(const e of edges)if(ids.has(e.from)&&ids.has(e.to)&&e.from!==e.to&&!hasIn.has(e.to)){kids.get(e.from).push(e.to);hasIn.add(e.to);}
 const roots=ord(nodes).filter(n=>!hasIn.has(n.id)).map(n=>n.id);const seen=new Set(),pos={};let leaf=0;
 const mw=Math.max(...nodes.map(n=>n.w)),mh=Math.max(...nodes.map(n=>n.h));
 const place=(id,d)=>{seen.add(id);const ch=kids.get(id).filter(c=>!seen.has(c));const n=by.get(id);
  const cs=ch.map(c=>place(c,d+1));let along;
  if(cs.length)along=(cs[0]+cs[cs.length-1])/2;else{along=leaf;leaf+=(horiz?mh:mw)+(horiz?gy:gx)*0+(horiz?gy:gx);}
  pos[id]=horiz?{x:d*(mw+gx),y:along}:{x:along,y:d*(mh+gy*2)};return along;};
 for(const r of roots)if(!seen.has(r))place(r,0);for(const n of ord(nodes))if(!seen.has(n.id))place(n.id,0);
 return pos;}

function place(type,nodes,edges,ctx){
 nodes=ord(nodes);const pos={};const n0=nodes.length;if(!n0)return {pos,w:0,h:0};
 const mw=Math.max(...nodes.map(n=>n.w)),mh=Math.max(...nodes.map(n=>n.h));
 const dir=ctx.dir||'TB';
 if(type==='flow'||type==='state'||type==='swimlanes'){
  const g2={dir,nodes:new Map(nodes.map(n=>[n.id,n])),edges:edges.map(e=>({...e,xy:null,back:false,self:false})),groups:[],order:0};
  window.FlowEngine.layout(g2,ctx.style,{canvas:true,direction:type==='swimlanes'?'LR':(type==='state'?'LR':dir),spacing:ctx.spacing,decision:ctx.decision});
  for(const n of nodes)pos[n.id]={x:n.x,y:n.y};
  if(type==='swimlanes'){const lanes=[];for(const n of nodes){const k=top(ctx,n)||'';if(!lanes.includes(k))lanes.push(k);}
   const lh=mh+70;nodes.forEach(n=>{pos[n.id].y=lanes.indexOf(top(ctx,n)||'')*lh;});
   for(const l of lanes){const row=nodes.filter(n=>(top(ctx,n)||'')===l).sort((a,b)=>pos[a.id].x-pos[b.id].x);
    row.forEach((n,i)=>{for(let j=0;j<i;j++){const m=row[j];if(pos[n.id].x<pos[m.id].x+m.w+16&&pos[n.id].y<pos[m.id].y+m.h+12&&pos[n.id].y+n.h+12>pos[m.id].y)pos[n.id].x=pos[m.id].x+m.w+GAP;}});}}
 }
 else if(type==='stepper'){nodes.forEach((n,i)=>{pos[n.id]={x:(mw-n.w)/2,y:i*(mh+34)};});}
 else if(type==='stages'||type==='capability'){
  const cols=[];for(const n of nodes){const k=top(ctx,n)||'';if(!cols.includes(k))cols.push(k);}
  if(type==='stages'||cols.length<=1&&nodes.length<5)cols.forEach((k,ci)=>{nodes.filter(n=>(top(ctx,n)||'')===k).forEach((n,ri)=>{pos[n.id]={x:ci*(mw+60)+(mw-n.w)/2,y:ri*(mh+26)};});});
  else{cols.forEach((k,ri)=>{nodes.filter(n=>(top(ctx,n)||'')===k).forEach((n,ci)=>{pos[n.id]={x:(ci%4)*(mw+26),y:ri*(mh+70)+Math.floor(ci/4)*(mh+22)};});});}
  if(cols.length===1&&nodes.length>=5&&type==='stages'){nodes.forEach((n,i)=>{pos[n.id]={x:Math.floor(i/4)*(mw+60),y:(i%4)*(mh+26)};});}
 }
 else if(type==='cycle'){const r=Math.max(150,n0*(mw+40)/(2*Math.PI));
  nodes.forEach((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/n0;pos[n.id]={x:r+Math.cos(a)*r-n.w/2,y:r+Math.sin(a)*r*0.82-n.h/2};});}
 else if(type==='tree'){Object.assign(pos,tree(nodes,edges,{horiz:true,gx:80,gy:20}));}
 else if(type==='org'){Object.assign(pos,tree(nodes,edges,{horiz:false,gx:28,gy:30}));
  /* centre each node over the spread of its team */ }
 else if(type==='mindmap'){
  const deg=new Map(nodes.map(n=>[n.id,0]));edges.forEach(e=>{if(deg.has(e.from))deg.set(e.from,deg.get(e.from)+1);if(deg.has(e.to))deg.set(e.to,deg.get(e.to)+1);});
  const root=nodes.slice().sort((a,b)=>deg.get(b.id)-deg.get(a.id)||a.i-b.i)[0],adj=new Map(nodes.map(n=>[n.id,[]]));
  edges.forEach(e=>{if(adj.has(e.from)&&adj.has(e.to)){adj.get(e.from).push(e.to);adj.get(e.to).push(e.from);}});
  const seen=new Set([root.id]),side=new Map(),sub=[[],[]];let flip=0;
  const walk=(id,s)=>{for(const c of adj.get(id)){if(seen.has(c))continue;seen.add(c);side.set(c,s);sub[s].push(c);walk(c,s);}};
  for(const c of adj.get(root.id)){if(seen.has(c))continue;seen.add(c);side.set(c,flip);sub[flip].push(c);walk(c,flip);flip^=1;}
  for(const n of nodes)if(!seen.has(n.id)){seen.add(n.id);side.set(n.id,flip);sub[flip].push(n.id);flip^=1;}
  const parent=new Map();const q=[root.id],vis=new Set([root.id]);while(q.length){const id=q.shift();for(const c of adj.get(id))if(!vis.has(c)){vis.add(c);parent.set(c,id);q.push(c);}}
  for(const s of [0,1]){const mem=nodes.filter(n=>n.id!==root.id&&side.get(n.id)===s);if(!mem.length)continue;const es=[];mem.forEach(n=>{const p=parent.get(n.id);if(p)es.push({from:p===root.id?'__root':p,to:n.id});});
   const fake={id:'__root',w:root.w,h:root.h,i:-1},tp=tree([fake,...mem],es,{horiz:true,gx:70,gy:16}),ry=tp['__root']?tp['__root'].y:0;
   for(const n of mem){const p=tp[n.id];if(p)pos[n.id]={x:s===0?p.x:-p.x,y:p.y-ry};}}
  pos[root.id]={x:0,y:0};
 }
 else if(type==='sequence'){const cols=Math.max(...nodes.map(n=>n.w))+70;nodes.forEach((n,i)=>{pos[n.id]={x:i*cols+(mw-n.w)/2,y:0};});}
 else if(type==='er'){const cols=Math.max(2,Math.ceil(Math.sqrt(n0)));const dg=new Map(nodes.map(n=>[n.id,0]));edges.forEach(e=>{dg.set(e.from,(dg.get(e.from)||0)+1);dg.set(e.to,(dg.get(e.to)||0)+1);});
  nodes.slice().sort((a,b)=>(dg.get(b.id)||0)-(dg.get(a.id)||0)||a.i-b.i).forEach((n,k)=>{pos[n.id]={x:(k%cols)*(mw+110),y:Math.floor(k/cols)*(mh+90)};});}
 else if(type==='timeline'){nodes.forEach((n,i)=>{pos[n.id]={x:i*(mw*0.62+24),y:i%2?mh*0.5+40:-mh*0.5-40};});}
 else if(type==='journey'){const cols=[];for(const n of nodes){const k=top(ctx,n)||'';if(!cols.includes(k))cols.push(k);}
  const band=n=>n.status==='good'?0:n.status==='bad'?2:1;const used=new Map();
  cols.forEach((k,ci)=>{nodes.filter(n=>(top(ctx,n)||'')===k).forEach(n=>{const b=band(n),key=ci+'|'+b,c=used.get(key)||0;used.set(key,c+1);pos[n.id]={x:ci*(mw+50)+(mw-n.w)/2,y:b*(mh+70)+c*(mh+18)};});});}
 else {nodes.forEach((n,i)=>{pos[n.id]={x:i*(mw+GAP),y:0};});}
 norm(pos);const b=box(pos,nodes);return {pos,w:b.w,h:b.h};}

/* decor and routes: the extra drawing a type needs once final positions are known */
function finish(type,nodes,edges,pos,ctx){const t=ctx.t,routes={};let decor='';
 const P=n=>pos[n.id];nodes=ord(nodes);if(!nodes.length)return {routes,decor};
 const mono=t.mono||t.font,ink=t.mute||'#888';
 if(type==='sequence'){const es=edges.filter(e=>pos[e.from]&&pos[e.to]).sort((a,b)=>a.i-b.i);const y0=Math.max(...nodes.map(n=>P(n).y+n.h))+44,step=46;const by=new Map(nodes.map(n=>[n.id,n]));
  es.forEach((e,k)=>{const a=by.get(e.from),b=by.get(e.to),y=y0+k*step,xa=P(a).x+a.w/2,xb=P(b).x+b.w/2;
   routes[e.i]=e.from===e.to?[[xa,y-8],[xa+34,y-8],[xa+34,y+10],[xa,y+10]]:[[xa,y],[xb,y]];});
  const yEnd=y0+Math.max(1,es.length)*step;
  decor=`<g pointer-events="none">${nodes.map(n=>`<path d="M${P(n).x+n.w/2} ${P(n).y+n.h}V${yEnd}" stroke="${ink}" stroke-width="1.2" stroke-dasharray="5 5" opacity=".55" fill="none"/>`).join('')}</g>`;}
 else if(type==='timeline'){const xs=nodes.map(n=>P(n).x),x0=Math.min(...xs)-30,x1=Math.max(...nodes.map(n=>P(n).x+n.w))+30,ym=nodes.reduce((a,n)=>a+P(n).y+n.h/2,0)/nodes.length;
  decor=`<g pointer-events="none"><path d="M${x0} ${ym}H${x1}" stroke="${t.accent}" stroke-width="2.4" stroke-linecap="round" opacity=".8" fill="none"/>${nodes.map(n=>`<circle cx="${P(n).x+n.w/2}" cy="${ym}" r="5" fill="${t.accent}"/><path d="M${P(n).x+n.w/2} ${ym}V${P(n).y<ym?P(n).y+n.h:P(n).y}" stroke="${t.accent}" stroke-width="1.4" opacity=".5" fill="none"/>`).join('')}</g>`;
  for(const e of edges)routes[e.i]=null;}
 else if(type==='journey'){const mh=Math.max(...nodes.map(n=>n.h)),x0=Math.min(...nodes.map(n=>P(n).x))-30,x1=Math.max(...nodes.map(n=>P(n).x+n.w))+30,names=['Delighted','Neutral','Frustrated'];
  decor=`<g pointer-events="none" font-family="${mono}" font-size="10.5" font-weight="700" letter-spacing="1.2">${[0,1,2].map(b=>`<rect x="${x0}" y="${b*(mh+70)-18}" width="${x1-x0}" height="${mh+36}" rx="14" fill="${t.ink}" opacity="${b===1?.025:.045}"/><text x="${x0+12}" y="${b*(mh+70)-4}" fill="${ink}" opacity=".85">${names[b].toUpperCase()}</text>`).join('')}</g>`;}
 return {routes,decor};}

/* lay several diagrams side by side. clusters: [{id,type,nodes,edges}] */
function compose(clusters,ctx){const all={},placed=[];let x=0;
 for(const c of clusters){const r=place(c.type,c.nodes,c.edges,ctx);const o=x;for(const [id,p] of Object.entries(r.pos))all[id]={x:p.x+o,y:p.y};placed.push({c,r,x:o});x+=r.w+160;}
 return all;}

/* starter diagrams ("Start from"). Each is a diagram, not a finished example. */
const SQ=`flowchart TD
  a(["Start"]):::none --> b["Step one"]
  b --> c{"Decision?"}
  c -->|Yes| d["Do this"]
  c -->|No| e["Do that"]
  d --> f(["Done"])
  e --> f`;
const TEMPLATES=[
 {id:'blank',name:'Blank canvas',type:'flow',src:'flowchart TD\n  a(["Start"])'},
 {id:'t-flow',name:'Flow',type:'flow',src:SQ},
 {id:'t-stepper',name:'Step list',type:'stepper',src:'flowchart TD\n  a["Step one"] --> b["Step two"] --> c["Step three"] --> d["Step four"] --> e["Step five"]'},
 {id:'t-stages',name:'Stage columns',type:'stages',src:'flowchart LR\n  subgraph s1 [Plan]\n    a["Define scope"] --> b["Agree budget"]\n  end\n  subgraph s2 [Build]\n    c["Make it"] --> d["Review it"]\n  end\n  subgraph s3 [Launch]\n    e["Ship"] --> f["Measure"]\n  end\n  b --> c\n  d --> e'},
 {id:'t-cycle',name:'Cycle',type:'cycle',src:'flowchart TD\n  a["Plan"] --> b["Do"] --> c["Check"] --> d["Adjust"]\n  d --> a'},
 {id:'t-tree',name:'Decision tree',type:'tree',src:'flowchart LR\n  a{"Is it urgent?"} -->|Yes| b{"Can we do it today?"}\n  a -->|No| c["Schedule it"]\n  b -->|Yes| d["Do it now"]\n  b -->|No| e["Ask for help"]'},
 {id:'t-capability',name:'Capability map',type:'capability',src:'flowchart TD\n  subgraph k1 [Design]\n    a["Brand"]:::have\n    b["Web"]:::partial\n    c["Motion"]:::dont\n  end\n  subgraph k2 [Operations]\n    d["Support"]:::have\n    e["Billing"]:::dont\n  end'},
 {id:'t-swimlanes',name:'Swimlanes',type:'swimlanes',src:'flowchart LR\n  subgraph l1 [Client]\n    a(["Request"]) --> d["Review"]\n  end\n  subgraph l2 [Studio]\n    b["Scope it"] --> c["Build it"]\n  end\n  a --> b\n  c --> d'},
 {id:'t-mindmap',name:'Mind map',type:'mindmap',src:'flowchart TD\n  r(["Main idea"]) --- a["Topic one"]\n  r --- b["Topic two"]\n  r --- c["Topic three"]\n  a --- a1["Detail"]\n  b --- b1["Detail"]'},
 {id:'t-sequence',name:'Sequence diagram',type:'sequence',src:'flowchart TD\n  u["Customer"]:::none.person\n  w["Website"]:::none.system\n  p["Payments"]:::none.mod_external\n  u -->|Place order| w\n  w -->|Charge card| p\n  p -->|Confirmed| w\n  w -->|Receipt| u'},
 {id:'t-er',name:'Entity relationship',type:'er',src:'flowchart TD\n  c["Customer | id, name, email"]:::none.system\n  o["Order | id, date, total"]:::none.system\n  i["Item | id, sku, price"]:::none.system\n  c -->|1 to many| o\n  o -->|1 to many| i'},
 {id:'t-state',name:'State machine',type:'state',src:'flowchart LR\n  a(["Draft"]) -->|Submit| b["In review"]\n  b -->|Approve| c["Published"]\n  b -->|Reject| a\n  c -->|Retire| d(["Archived"])'},
 {id:'t-org',name:'Org chart',type:'org',src:'flowchart TD\n  a["Founder"]:::none.person --> b["Design lead"]:::none.person\n  a --> c["Operations lead"]:::none.person\n  b --> d["Designer"]:::none.person\n  b --> e["Designer"]:::none.person\n  c --> f["Coordinator"]:::none.person'},
 {id:'t-timeline',name:'Timeline',type:'timeline',src:'flowchart LR\n  a["Kickoff | Jan"] --> b["Concept | Feb"] --> c["Build | Mar"] --> d["Launch | Apr"] --> e["Review | May"]'},
 {id:'t-journey',name:'Customer journey',type:'journey',src:'flowchart LR\n  subgraph j1 [Discover]\n    a["Sees an ad"]:::have\n    b["Reads reviews"]:::none\n  end\n  subgraph j2 [Buy]\n    c["Adds to cart"]:::none\n    d["Pays"]:::dont\n  end\n  subgraph j3 [Use]\n    e["Unboxes"]:::have\n    f["Needs support"]:::dont\n  end\n  a --> b --> c --> d --> e --> f'}
];
/* combinations: several diagram types on one canvas. clusters list node ids per type */
const COMBOS=[
 {id:'c-org-flow',name:'Org chart + process',type:'org',src:'flowchart TD\n  a["Director"]:::none.person --> b["Producer"]:::none.person\n  a --> c["Designer"]:::none.person\n  r(["Request in"]) --> s["Scope"] --> t{"Approved?"}\n  t -->|Yes| u["Build"]\n  t -->|No| s\n  b --> s',cl:{r:'x1',s:'x1',t:'x1',u:'x1'},ct:{x1:'flow'}},
 {id:'c-journey-state',name:'Journey + states',type:'journey',src:'flowchart LR\n  subgraph j1 [Browse]\n    a["Finds product"]:::have\n  end\n  subgraph j2 [Order]\n    b["Pays"]:::none\n    c["Waits"]:::dont\n  end\n  a --> b --> c\n  o1(["New"]) -->|Paid| o2["Packed"] -->|Sent| o3(["Delivered"])\n  b --> o1',cl:{o1:'x1',o2:'x1',o3:'x1'},ct:{x1:'state'}},
 {id:'c-sequence-er',name:'Sequence + data model',type:'sequence',src:'flowchart TD\n  u["Customer"]:::none.person\n  w["Website"]:::none.system\n  u -->|Order| w\n  w -->|Receipt| u\n  c["Customer | id, name"]:::none.system\n  o["Order | id, total"]:::none.system\n  c -->|1 to many| o',cl:{c:'x1',o:'x1'},ct:{x1:'er'}}
];
/* workers: an element that does work. Adding one shows the workflow it runs; more of them show more lanes of that workflow. */
const WORKERS=[
 {id:'intake',name:'Intake worker',role:'Reads every incoming message and turns it into a task',steps:[['Message arrives','io','Email, form or upload'],['Sort it','rect','What is it, how urgent?'],['Pull out the details','rect','Names, dates, amounts'],['Clear enough?','decision',''],['Create the task','system','Assigned to a person'],['Tell the client','pill','']]},
 {id:'catalog',name:'Catalog worker',role:'Brings product files in and checks them against your rules',steps:[['File arrives','io','Spreadsheet or feed'],['Match the columns','rect',''],['Check the rules','rect','Prices, images, required fields'],['Looks right?','decision',''],['Draft the products','data','Waits for a person to approve'],['Ready to publish','pill','']]},
 {id:'support',name:'Support worker',role:'Drafts replies to customers and hands over what it should not decide',steps:[['Customer writes in','io',''],['Find the order','data','Read only'],['Draft a reply','rect','In your voice'],['Safe to send?','decision',''],['Send the reply','system',''],['Done','pill','']]},
 {id:'purchasing',name:'Purchasing worker',role:'Keeps orders with vendors matched to what arrives',steps:[['Vendor update','io','Confirmation or change'],['Match to the order','data',''],['Different from the order?','decision',''],['Ask a buyer','person','Approve or reject'],['Update the order','system',''],['Done','pill','']]},
 {id:'listing',name:'Listing worker',role:'Writes complete, search-ready product listings as drafts',steps:[['Product to list','data',''],['Write title and description','rect',''],['Add images and specs','rect',''],['Complete?','decision',''],['Draft ready','doc','A person approves it'],['Done','pill','']]},
 {id:'watch',name:'Market watcher',role:'Watches competitors and flags what changed',steps:[['Check the sources','io','On a schedule'],['Compare to last time','rect',''],['Big change?','decision',''],['Flag it','system','Shows in your workspace'],['Done','pill','']]}
];
window.FlowPresets={TYPES,byId,place,finish,compose,TEMPLATES,COMBOS,WORKERS};
})();
