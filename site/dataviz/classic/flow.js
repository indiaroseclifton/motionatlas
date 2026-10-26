'use strict';
/* FlowEngine: Mermaid-style text in, a clean layered flowchart out, drawn in any DVStyles style.
   parse()  reads the flowchart subset of Mermaid (nodes, shapes, edges with labels, subgraphs, classes)
   layout() ranks the graph (loops set aside), orders each rank to cut crossings, places nodes with
            isotonic regression so lines run straight, then routes every connector at right angles
            through its own track; loops travel round the outside
   render() returns {svg,width,height,graph,notes} */
(()=>{
const STATUS={have:'good',done:'good',good:'good',ok:'good',green:'good',yes:'good',live:'good',
 dont:'bad',donthave:'bad',missing:'bad',bad:'bad',red:'bad',todo:'bad',blocked:'bad',no:'bad',gap:'bad',
 warn:'warn',partial:'warn',amber:'warn',risk:'warn',wip:'warn',muted:'muted',grey:'muted',gray:'muted',
 accent:'accent',key:'accent',primary:'accent',main:'accent'};
const clean=s=>String(s??'').trim().replace(/^"(.*)"$/,'$1').replace(/<br\s*\/?>/gi,'\n').replace(/&quot;/g,'"').replace(/#quot;/g,'"').replace(/&amp;/g,'&');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------------- parse ---------------- */
const SHAPES=[[/^\[\[(.*?)\]\]/,'sub'],[/^\(\[(.*?)\]\)/,'pill'],[/^\[\((.*?)\)\]/,'data'],[/^\(\((.*?)\)\)/,'circle'],[/^\[\/(.*?)\/\]/,'io'],[/^\[\\(.*?)\\\]/,'io'],[/^\{\{(.*?)\}\}/,'decision'],[/^\{(.*?)\}/,'decision'],[/^\[(.*?)\]/,'rect'],[/^\((.*?)\)/,'round'],[/^>(.*?)\]/,'rect']];
const EDGE=/^\s*(?:(<?)(-{2,}|={2,}|-\.+-)(>|x|o)?\s*(?:\|([^|]*)\|)?|--\s+([^-][^]*?)\s+-->|==\s+(.*?)\s+==>|-\.\s+(.*?)\s+\.->)\s*/;
function parse(src){
 const g={dir:'TB',nodes:new Map(),edges:[],groups:[],order:0};const stack=[];
 const touch=(id,label,shape,cls)=>{let n=g.nodes.get(id);if(!n){n={id,label:id,note:'',shape:'rect',cls:null,group:stack.length?stack[stack.length-1].id:null,i:g.nodes.size};g.nodes.set(id,n);}
  if(label!=null){const t=clean(label),parts=t.split(/\n| \| /);n.label=parts[0].trim();n.note=parts.slice(1).join(' ').trim();}if(shape)n.shape=shape;if(cls)n.cls=cls;if(stack.length&&label!=null&&!n.group)n.group=stack[stack.length-1].id;return n;};
 const nodeAt=s=>{const m=s.match(/^\s*([A-Za-z0-9_][\w\-.]*)/);if(!m)return null;let rest=s.slice(m[0].length),label=null,shape=null,cls=null;
  for(const [re,sh] of SHAPES){const mm=rest.match(re);if(mm){label=mm[1];shape=sh;rest=rest.slice(mm[0].length);break;}}
  const c=rest.match(/^:::([\w-]+)/);if(c){cls=c[1];rest=rest.slice(c[0].length);}
  return {ids:[{id:m[1],label,shape,cls}],rest};};
 const nodesAt=s=>{const first=nodeAt(s);if(!first)return null;let rest=first.rest;const ids=first.ids;let m;
  while((m=rest.match(/^\s*&\s*/))){const nx=nodeAt(rest.slice(m[0].length));if(!nx)break;ids.push(...nx.ids);rest=nx.rest;}return {ids,rest};};
 const lines=String(src).replace(/%%.*$/gm,'').split(/\n|;/);
 for(let raw of lines){const line=raw.trim();if(!line)continue;let m;
  if((m=line.match(/^(?:flowchart|graph)\s*(TD|TB|BT|LR|RL)?/i))){g.dir=(m[1]||'TB').toUpperCase().replace('TD','TB');continue;}
  if((m=line.match(/^subgraph\s+([\w-]+)?\s*(?:\[(.*)\])?\s*(.*)$/i))){const id=m[1]||('g'+g.groups.length),title=clean(m[2]||m[3]||m[1]||'');const grp={id:'grp_'+id,title:title||id,parent:stack.length?stack[stack.length-1].id:null,i:g.groups.length};g.groups.push(grp);stack.push(grp);continue;}
  if(/^end\b/i.test(line)){stack.pop();continue;}
  if((m=line.match(/^class\s+([\w,\s-]+?)\s+([\w-]+)\s*$/i))){m[1].split(',').forEach(id=>touch(id.trim(),null,null,m[2]));continue;}
  if(/^(classDef|style|linkStyle|click|direction|title|accTitle|accDescr)\b/i.test(line))continue;
  let cur=nodesAt(line);if(!cur)continue;cur.ids.forEach(x=>touch(x.id,x.label,x.shape,x.cls));let rest=cur.rest;
  while(rest.trim()){const e=rest.match(EDGE);if(!e)break;rest=rest.slice(e[0].length);
   const label=clean(e[4]??e[5]??e[6]??e[7]??'');const body=e[2]||(e[6]!=null?'==':e[7]!=null?'-.':'--');
   const kind=/=/.test(body)?'thick':/\./.test(body)?'dashed':'solid';const arrow=!!(e[3]==='>'||e[5]!=null||e[6]!=null||e[7]!=null);
   const nx=nodesAt(rest);if(!nx)break;nx.ids.forEach(x=>touch(x.id,x.label,x.shape,x.cls));
   for(const a of cur.ids)for(const b of nx.ids)g.edges.push({from:a.id,to:b.id,label,kind,arrow:arrow||!e[2]?true:arrow,i:g.edges.length});
   cur=nx;rest=nx.rest;}}
 for(const n of g.nodes.values())n.status=STATUS[String(n.cls||'').toLowerCase().replace(/[^a-z]/g,'')]||null;
 return g;}

/* ---------------- measuring ---------------- */
let ctx=null;
function measure(text,size,weight,family){if(!ctx&&typeof document!=='undefined')ctx=document.createElement('canvas').getContext('2d');
 if(!ctx)return text.length*size*.56;ctx.font=`${weight} ${size}px ${family}`;return ctx.measureText(text).width;}
function wrap(text,size,weight,family,max){const words=String(text).split(/\s+/).filter(Boolean),out=[];let line='';
 for(const w of words){const t=line?line+' '+w:w;if(measure(t,size,weight,family)<=max||!line)line=t;else{out.push(line);line=w;}}if(line)out.push(line);return out.length?out:[''];}

/* ---------------- layout ---------------- */
function pav(d,w){/* isotonic (non-decreasing) weighted least squares */const blocks=[];
 for(let i=0;i<d.length;i++){blocks.push({v:d[i],w:w[i],n:1});while(blocks.length>1&&blocks[blocks.length-2].v>blocks[blocks.length-1].v){const b=blocks.pop(),a=blocks.pop();blocks.push({v:(a.v*a.w+b.v*b.w)/(a.w+b.w),w:a.w+b.w,n:a.n+b.n});}}
 const out=[];for(const b of blocks)for(let k=0;k<b.n;k++)out.push(b.v);return out;}

function layout(g,s,opt={}){
 const t=s.t,dir=opt.direction||g.dir||'TB',horiz=dir==='LR'||dir==='RL',up=t.upper;
 const SP={compact:.75,comfortable:1,airy:1.35}[opt.spacing||'comfortable']||1;
 const font=t.font,titleSize=opt.titleSize||13.5,noteSize=12,padX=16,padY=12,maxText=opt.maxText||(horiz?190:200);
 const nodes=[...g.nodes.values()];
 /* sizes */
 for(const n of nodes){const lab=up?n.label.toUpperCase():n.label,deco=t.iconTiles?40:(n.shape==='decision'&&opt.decision!=='diamond'?20:0);
  n.lines=wrap(lab,titleSize,600,font,maxText-deco);n.noteLines=n.note?wrap(n.note,noteSize,400,font,maxText):[];
  const tw=Math.max(...n.lines.map(l=>measure(l,titleSize,600,font)))+deco,nw=n.noteLines.length?Math.max(...n.noteLines.map(l=>measure(l,noteSize,400,font))):0;
  let w=Math.max(tw,nw)+padX*2+(n.status?14:0),h=n.lines.length*titleSize*1.3+(n.noteLines.length?6+n.noteLines.length*noteSize*1.35:0)+padY*2;
  w=Math.max(w,opt.minWidth||132);
  if(n.shape==='pill'||n.shape==='circle')w+=12;if(n.shape==='io')w+=20;if(n.shape==='sub')w+=16;if(n.shape==='data')h+=12;
  if(n.shape==='decision'&&opt.decision==='diamond'){w=w*1.45+10;h=h*1.45+8;}
  if(opt.uniform){w=Math.max(w,opt.uniform);}
  n.w=Math.ceil(w);n.h=Math.ceil(h);n.cs=horiz?n.h:n.w;n.ms=horiz?n.w:n.h;}
 /* back edges via DFS */
 const out=new Map(nodes.map(n=>[n.id,[]]));for(const e of g.edges)out.get(e.from)?.push(e);
 const state=new Map();const visit=id=>{state.set(id,1);for(const e of out.get(id)){if(e.from===e.to){e.self=true;continue;}const st=state.get(e.to);if(st===1)e.back=true;else if(!st)visit(e.to);}state.set(id,2);};
 const hasIn=new Set(g.edges.filter(e=>e.from!==e.to).map(e=>e.to));
 nodes.filter(n=>!hasIn.has(n.id)).forEach(n=>{if(!state.get(n.id))visit(n.id);});nodes.forEach(n=>{if(!state.get(n.id))visit(n.id);});
 const fwd=g.edges.filter(e=>!e.back&&!e.self);
 /* rank: longest path, then pull sources down next to their first child */
 const indeg=new Map(nodes.map(n=>[n.id,0]));fwd.forEach(e=>indeg.set(e.to,indeg.get(e.to)+1));
 const topo=[],q=nodes.filter(n=>!indeg.get(n.id)).map(n=>n.id);const ind=new Map(indeg);
 while(q.length){const id=q.shift();topo.push(id);for(const e of out.get(id))if(!e.back&&!e.self){ind.set(e.to,ind.get(e.to)-1);if(!ind.get(e.to))q.push(e.to);}}
 const rank=new Map(nodes.map(n=>[n.id,0]));for(const id of topo)for(const e of out.get(id))if(!e.back&&!e.self)rank.set(e.to,Math.max(rank.get(e.to),rank.get(id)+1));
 for(const id of [...topo].reverse()){if(indeg.get(id))continue;const succ=out.get(id).filter(e=>!e.back&&!e.self).map(e=>rank.get(e.to));if(succ.length)rank.set(id,Math.max(0,Math.min(...succ)-1));}
 nodes.forEach(n=>n.rank=rank.get(n.id));
 const R=Math.max(0,...nodes.map(n=>n.rank))+1;
 /* layers with dummies for long edges */
 const L=[...Array(R)].map(()=>[]);nodes.forEach(n=>L[n.rank].push(n));
 const dummies=[];
 for(const e of fwd){const a=g.nodes.get(e.from),b=g.nodes.get(e.to);e.chain=[a];
  for(let r=a.rank+1;r<b.rank;r++){const d={id:`~${e.i}_${r}`,dummy:true,rank:r,cs:10,ms:0,w:horiz?0:10,h:horiz?10:0,edge:e,group:null};L[r].push(d);dummies.push(d);e.chain.push(d);}
  e.chain.push(b);}
 /* reserve each group's space on every rank it spans, so boxes never overlap other steps */
 const spacers=[];
 if(!opt.lanes&&opt.groups!==false){const par=new Map(g.groups.map(x=>[x.id,x.parent]));const inG=(gid,child)=>{let x=child;while(x){if(x===gid)return true;x=par.get(x);}return false;};
  for(const grp of g.groups){const ms=nodes.filter(n=>inG(grp.id,n.group));if(!ms.length)continue;const r0=Math.min(...ms.map(n=>n.rank)),r1=Math.max(...ms.map(n=>n.rank)),mw=Math.max(...ms.map(n=>n.cs));
   for(let r=r0;r<=r1;r++)if(!L[r].some(n=>!n.dummy&&!n.spacer&&inG(grp.id,n.group))){const sp={id:`#${grp.id}_${r}`,spacer:true,dummy:false,rank:r,cs:mw*.8,ms:0,w:0,h:0,group:grp.id,members:ms,i:ms[0].i};L[r].push(sp);spacers.push(sp);}}}
 const all=[...nodes,...dummies,...spacers];const ups=new Map(all.map(n=>[n.id,[]])),downs=new Map(all.map(n=>[n.id,[]]));
 for(const e of fwd)for(let i=0;i<e.chain.length-1;i++){downs.get(e.chain[i].id).push(e.chain[i+1]);ups.get(e.chain[i+1].id).push(e.chain[i]);}
 /* ordering: barycentre sweeps, groups kept together, best by crossings */
 const groupKey=n=>n.group||(n.dummy?null:null);
 L.forEach(l=>l.sort((a,b)=>(a.dummy?a.edge.chain[0].i:a.i)-(b.dummy?b.edge.chain[0].i:b.i)));
 const pos=()=>{const p=new Map();L.forEach(l=>l.forEach((n,i)=>p.set(n.id,i)));return p;};
 const crossings=()=>{const p=pos();let c=0;for(let r=0;r<R-1;r++){const es=[];L[r].forEach(n=>downs.get(n.id).forEach(m=>es.push([p.get(n.id),p.get(m.id)])));for(let i=0;i<es.length;i++)for(let j=i+1;j<es.length;j++)if((es[i][0]-es[j][0])*(es[i][1]-es[j][1])<0)c++;}return c;};
 const sortLayer=(r,nb)=>{const p=pos(),l=L[r];const bary=new Map();l.forEach(n=>{const ns=nb.get(n.id);bary.set(n.id,ns.length?ns.reduce((s,m)=>s+p.get(m.id),0)/ns.length:p.get(n.id));});
  const gb=new Map();l.forEach(n=>{const k=groupKey(n);if(!k)return;const v=gb.get(k)||[0,0];v[0]+=bary.get(n.id);v[1]++;gb.set(k,v);});
  l.sort((a,b)=>{const ka=groupKey(a),kb=groupKey(b),ba=ka?gb.get(ka)[0]/gb.get(ka)[1]:bary.get(a.id),bb=kb?gb.get(kb)[0]/gb.get(kb)[1]:bary.get(b.id);return ba-bb||(ka===kb?bary.get(a.id)-bary.get(b.id):0);});};
 let best=crossings(),snap=L.map(l=>[...l]);
 for(let it=0;it<10&&best>0;it++){for(let r=1;r<R;r++)sortLayer(r,ups);for(let r=R-2;r>=0;r--)sortLayer(r,downs);const c=crossings();if(c<best){best=c;snap=L.map(l=>[...l]);}}
 snap.forEach((l,i)=>L[i]=l);
 /* cross positions */
 const gapN=40*SP,gapD=14,gpad=opt.groups===false?0:18;
 const parG=new Map(g.groups.map(x=>[x.id,x.parent])),anc=(gid,child)=>{let x=child;while(x){if(x===gid)return true;x=parG.get(x);}return false;};
 const padOf=gid=>{let d=0,x=parG.get(gid);while(x){d++;x=parG.get(x);}return Math.max(8,gpad-d*6);};
 const sep=(a,b)=>{let extra=0;if(a.group!==b.group){if(a.group&&!anc(a.group,b.group))extra+=padOf(a.group);if(b.group&&!anc(b.group,a.group))extra+=padOf(b.group);if(extra)extra+=6;}return a.cs/2+b.cs/2+(a.dummy||b.dummy?gapD:gapN)+extra;};
 const c=new Map();L.forEach(l=>{let x=0;l.forEach((n,i)=>{if(i)x+=sep(l[i-1],n);c.set(n.id,x);});});
 const place=(l,want,wt)=>{const off=[0];for(let i=1;i<l.length;i++)off.push(off[i-1]+sep(l[i-1],l[i]));const y=pav(l.map((n,i)=>want[i]-off[i]),wt);l.forEach((n,i)=>c.set(n.id,y[i]+off[i]));};
 const median=a=>{a=[...a].sort((x,y)=>x-y);const m=a.length>>1;return a.length%2?a[m]:(a[m-1]+a[m])/2;};
 for(let it=0;it<8;it++){
  const pass=(order,nb)=>{for(const r of order){const l=L[r];if(!l.length)continue;place(l,l.map(n=>{if(n.spacer)return n.members.reduce((a,m)=>a+c.get(m.id),0)/n.members.length;const ns=nb.get(n.id);return ns.length?median(ns.map(m=>c.get(m.id))):c.get(n.id);}),l.map(n=>n.spacer?.5:n.dummy?4:1+0.2*(ups.get(n.id).length+downs.get(n.id).length)));}};
  pass([...Array(R).keys()].slice(1),ups);pass([...Array(R).keys()].reverse().slice(1),downs);}
 /* both-sides balance for nodes with neighbours above and below */
 for(let r=0;r<R;r++){const l=L[r];place(l,l.map(n=>{if(n.spacer)return n.members.reduce((a,m)=>a+c.get(m.id),0)/n.members.length;const ns=[...ups.get(n.id),...downs.get(n.id)];return ns.length?median(ns.map(m=>c.get(m.id))):c.get(n.id);}),l.map(n=>n.spacer?.5:n.dummy?4:1));}
 const top=gid=>{let x=g.groups.find(y=>y.id===gid);while(x&&x.parent)x=g.groups.find(y=>y.id===x.parent);return x?x.id:null;};
 const laneMode=!!opt.lanes&&g.groups.length>0;let laneList=[];
 if(laneMode){const laneOf=n=>n.dummy?top(n.edge.chain[0].group)||'__none':top(n.group)||'__none';all.forEach(n=>n.lane=laneOf(n));
  laneList=[...g.groups.filter(x=>!x.parent).map(x=>x.id)];if(all.some(n=>n.lane==='__none'))laneList.push('__none');
  const li=new Map(laneList.map((x,i)=>[x,i]));L.forEach(l=>{const o=new Map(l.map((n,i)=>[n.id,i]));l.sort((a,b)=>li.get(a.lane)-li.get(b.lane)||o.get(a.id)-o.get(b.id));});
  const pad=22,laneW=new Map(laneList.map(x=>[x,180]));
  for(const l of L)for(const lane of laneList){const ns=l.filter(n=>n.lane===lane);if(!ns.length)continue;let w=ns.reduce((a,n)=>a+n.cs,0)+(ns.length-1)*gapN*.6+pad*2;laneW.set(lane,Math.max(laneW.get(lane),w));}
  let x0=0;const laneStart=new Map();for(const lane of laneList){laneStart.set(lane,x0);x0+=laneW.get(lane);}
  for(const l of L)for(const lane of laneList){const ns=l.filter(n=>n.lane===lane);if(!ns.length)continue;const tot=ns.reduce((a,n)=>a+n.cs,0)+(ns.length-1)*gapN*.6;let x=laneStart.get(lane)+laneW.get(lane)/2-tot/2;
   for(const n of ns){c.set(n.id,x+n.cs/2);x+=n.cs+gapN*.6;}}
  g.lanes=laneList.map(id=>({id,c0:laneStart.get(id),c1:laneStart.get(id)+laneW.get(id),title:id==='__none'?(opt.otherLane||'Other'):(g.groups.find(x=>x.id===id).title)}));}
 const minC=laneMode?0:Math.min(...all.map(n=>c.get(n.id)-n.cs/2));all.forEach(n=>{n.c=c.get(n.id)-minC;});

 /* ports */
 const back=g.edges.filter(e=>e.back),selfs=g.edges.filter(e=>e.self);
 const portsOut=new Map(),portsIn=new Map();const add=(m,id,e,key)=>{if(!m.has(id))m.set(id,[]);m.get(id).push({e,key});};
 const groupOf=id=>g.groups.find(x=>x.id===id);
 /* loop side: whichever is nearer the pair */
 const midC=(Math.max(...all.map(n=>n.c+n.cs/2))||0)/2;
 back.forEach(e=>{const a=g.nodes.get(e.from),b=g.nodes.get(e.to);e.side=(a.c+b.c)/2>midC?1:-1;});
 const clear=(n,side)=>!L[n.rank].some(o=>!o.dummy&&!o.spacer&&o!==n&&(side>0?o.c>n.c:o.c<n.c));
 back.forEach(e=>{const a=g.nodes.get(e.from),b=g.nodes.get(e.to);e.sideOut=clear(a,e.side);e.sideIn=clear(b,e.side);});
 for(const e of fwd){add(portsOut,e.from,e,()=>e.chain[1].c);add(portsIn,e.to,e,()=>e.chain[e.chain.length-2].c);}
 for(const e of back){if(!e.sideOut)add(portsOut,e.from,e,()=>e.side>0?1e6:-1e6);if(!e.sideIn)add(portsIn,e.to,e,()=>e.side>0?1e6:-1e6);}
 const spread=(map,which)=>{for(const [id,ps] of map){const n=g.nodes.get(id);ps.sort((a,b)=>a.key()-b.key());const k=ps.length,span=Math.min(n.cs*.66,(k-1)*22),step=k>1?span/(k-1):0;
  ps.forEach((p,i)=>{p.e[which]=n.c+(k>1?-span/2+i*step:0);});}};
 spread(portsOut,'pOut');spread(portsIn,'pIn');

 /* segments per gap (gap r sits after rank r; gap -1 before rank 0) */
 const gaps=new Map();const seg=(gi,c1,c2,e)=>{if(!gaps.has(gi))gaps.set(gi,[]);const s={c1,c2,e};gaps.get(gi).push(s);return s;};
 for(const e of fwd){e.hops=[];for(let i=0;i<e.chain.length-1;i++){const a=e.chain[i],b=e.chain[i+1];const c1=i===0?e.pOut:a.c,c2=i===e.chain.length-2?e.pIn:b.c;e.hops.push(seg(a.rank,c1,c2,e));}}
 /* lanes for loops */
 const ext=(r1,r2,side)=>{if(laneMode&&g.lanes)return side>0?g.lanes[g.lanes.length-1].c1+16:g.lanes[0].c0-16;let v=side>0?-Infinity:Infinity;for(let r=r1;r<=r2;r++)for(const n of L[r]){const x=side>0?n.c+n.cs/2:n.c-n.cs/2;v=side>0?Math.max(v,x):Math.min(v,x);}return v+side*(gpad+16);};
 const lanes={1:[],[-1]:[]};
 back.sort((a,b)=>(g.nodes.get(a.from).rank-g.nodes.get(a.to).rank)-(g.nodes.get(b.from).rank-g.nodes.get(b.to).rank));
 for(const e of back){const a=g.nodes.get(e.from),b=g.nodes.get(e.to),lo=b.rank,hi=a.rank,side=e.side;let k=0;
  while(lanes[side].some(L2=>L2.k===k&&!(L2.hi<lo||L2.lo>hi)))k++;lanes[side].push({k,lo,hi});
  const base=ext(lo,hi,side);let laneC=base+side*k*14;
  /* keep lanes outside any lane already further in at that spot */
  e.lane=laneC;e.hOut=e.sideOut?null:seg(a.rank,e.pOut,laneC,e);e.hIn=e.sideIn?null:seg(b.rank-1,laneC,e.pIn,e);}
 /* tracks */
 const trackSp=9,tracks=new Map();
 for(const [gi,ss] of gaps){const right=ss.filter(s=>s.c2>s.c1+0.5).sort((a,b)=>b.c1-a.c1),left=ss.filter(s=>s.c2<s.c1-0.5).sort((a,b)=>a.c1-b.c1),done=[];
  for(const s of [...right,...left]){const lo=Math.min(s.c1,s.c2)-6,hi=Math.max(s.c1,s.c2)+6;let t2=-1;
   for(const d of done){if(d.e===s.e&&gi!==-1)continue;const dl=Math.min(d.c1,d.c2)-6,dh=Math.max(d.c1,d.c2)+6;if(!(hi<dl||lo>dh))t2=Math.max(t2,d.t);
    /* a vertical of an earlier segment sitting inside this span also needs ordering: handled by the sort */}
   s.t=t2+1;done.push(s);}
  ss.filter(s=>Math.abs(s.c2-s.c1)<=0.5).forEach(s=>s.t=-1);
  tracks.set(gi,Math.max(-1,...ss.map(s=>s.t))+1);}

 /* main axis: rank bands and gaps */
 const rankSize=L.map(l=>Math.max(0,...l.filter(n=>!n.dummy&&!n.spacer).map(n=>n.ms)));
 const starts=new Set(),ends=new Set();
 for(const grp of g.groups){const ms=nodes.filter(n=>n.group===grp.id||isIn(grp.id,n.group));if(!ms.length)continue;grp.r0=Math.min(...ms.map(n=>n.rank));grp.r1=Math.max(...ms.map(n=>n.rank));starts.add(grp.r0);ends.add(grp.r1);}
 function isIn(gid,child){let x=child;while(x){if(x===gid)return true;const gg=g.groups.find(y=>y.id===x);x=gg?gg.parent:null;}return false;}
 const head=gpad?28:0,baseGap=34*SP;
 const gapInfo=new Map();
 for(let gi=-1;gi<R;gi++){const n=tracks.get(gi)||0,endPad=ends.has(gi)?gpad:0,startPad=starts.has(gi+1)?gpad+head:0;
  const need=n?n*trackSp+28:0;const size=gi===-1||gi===R-1?(n?need+endPad+startPad:endPad+startPad):Math.max(baseGap+endPad+startPad,need+endPad+startPad+8);gapInfo.set(gi,{size,endPad,startPad,n});}
 if(laneMode){const G=gapInfo.get(-1);G.size+=44;G.startPad=(G.startPad||0)+44;const E=gapInfo.get(R-1);E.size+=16;}
 let m=0;const rankTop=[],gapTop=new Map();
 gapTop.set(-1,m);m+=gapInfo.get(-1).size;
 for(let r=0;r<R;r++){rankTop[r]=m;m+=rankSize[r];gapTop.set(r,m);m+=gapInfo.get(r).size;}
 const total=m;
 all.forEach(n=>{n.m=rankTop[n.rank]+rankSize[n.rank]/2;});
 const trackM=(gi,t)=>{const G=gapInfo.get(gi),top=gapTop.get(gi)+G.endPad,bottom=gapTop.get(gi)+G.size-G.startPad,n=G.n||1;
  if(t<0)return (top+bottom)/2;const span=(n-1)*trackSp;return (top+bottom)/2-span/2+t*trackSp;};

 /* routes in (m,c) */
 const pt=(mm,cc)=>({m:mm,c:cc});
 for(const e of fwd){const pts=[];const a=e.chain[0],b=e.chain[e.chain.length-1];pts.push(pt(a.m+a.ms/2,e.pOut));
  e.hops.forEach((h,i)=>{if(h.t>=0){const tm=trackM(e.chain[i].rank,h.t);pts.push(pt(tm,h.c1),pt(tm,h.c2));}});
  pts.push(pt(b.m-b.ms/2,e.pIn));e.pts=pts;}
 const sideSlots=new Map(),slot=(id,side)=>{const k=id+side;const v=sideSlots.get(k)||0;sideSlots.set(k,v+1);return v;};
 for(const e of back){const a=g.nodes.get(e.from),b=g.nodes.get(e.to),pts=[];
  if(e.sideOut){const k=slot(a.id,e.side);pts.push(pt(a.m+k*10,a.c+e.side*a.cs/2),pt(a.m+k*10,e.lane));}
  else{const t1=trackM(a.rank,e.hOut.t<0?0:e.hOut.t);pts.push(pt(a.m+a.ms/2,e.pOut),pt(t1,e.pOut),pt(t1,e.lane));}
  if(e.sideIn){const k=slot(b.id,e.side);const mm2=b.m-Math.min(8,b.ms/4)-k*10;pts.push(pt(mm2,e.lane),pt(mm2,b.c+e.side*b.cs/2));}
  else{const t2=trackM(b.rank-1,e.hIn.t<0?0:e.hIn.t);pts.push(pt(t2,e.lane),pt(t2,e.pIn),pt(b.m-b.ms/2,e.pIn));}
  e.pts=pts;}
 for(const e of selfs){const a=g.nodes.get(e.from),r=a.c+a.cs/2;e.pts=[pt(a.m-6,r),pt(a.m-6,r+22),pt(a.m+6,r+22),pt(a.m+6,r)];e.selfLoop=true;}
 /* groups (abstract) */
 if(laneMode)for(const ln of g.lanes){const grp=g.groups.find(x=>x.id===ln.id)||(()=>{const x={id:'__none',title:ln.title,parent:null,i:g.groups.length};g.groups.push(x);return x;})();grp.lane=true;grp.c0=ln.c0;grp.c1=ln.c1;grp.m0=0;grp.m1=total;grp.depth=0;}
 for(const grp of g.groups){if(grp.lane)continue;const ms=nodes.filter(n=>n.group===grp.id||isIn(grp.id,n.group));if(!ms.length){grp.empty=true;continue;}
  const depth=(()=>{let d=0,x=grp;while(x.parent){d++;x=groupOf(x.parent);}return d;})();const inner=g.groups.filter(x=>x.parent===grp.id&&!x.empty).length?8:0;
  grp.c0=Math.min(...ms.map(n=>n.c-n.cs/2))-gpad-inner;grp.c1=Math.max(...ms.map(n=>n.c+n.cs/2))+gpad+inner;
  grp.m0=Math.min(...ms.map(n=>n.m-n.ms/2))-gpad-head+ (depth?8:0);grp.m1=Math.max(...ms.map(n=>n.m+n.ms/2))+gpad;grp.depth=depth;
  /* stepped outline: one band per rank, as wide as the group's own steps on that rank */
  const pad=padOf(grp.id),r0=Math.min(...ms.map(n=>n.rank)),r1=Math.max(...ms.map(n=>n.rank)),bands=[];
  const mid=r=>gapTop.get(r)+gapInfo.get(r).size/2;
  for(let r=r0;r<=r1;r++){const here=L[r].filter(n=>(!n.dummy&&!n.spacer&&isIn(grp.id,n.group))||(n.spacer&&isIn(grp.id,n.group)));if(!here.length)continue;
   const a=Math.min(...here.map(n=>n.c-n.cs/2))-pad,b=Math.max(...here.map(n=>n.c+n.cs/2))+pad;const real=here.filter(n=>!n.spacer);
   const top=r===r0?Math.min(...real.map(n=>n.m-n.ms/2))-pad-head+(depth?6:0):mid(r-1),bot=r===r1?Math.max(...real.map(n=>n.m+n.ms/2))+pad-(depth?2:0):mid(r);bands.push({a,b,top,bot,r});}
  for(let i=1;i<bands.length;i++){bands[i].top=bands[i-1].bot;}
  /* square the outline up wherever no other step is in the way */
  {const ga=Math.min(...bands.map(x=>x.a)),gb=Math.max(...bands.map(x=>x.b));let ri=0;
   for(let r=r0;r<=r1;r++){const bd=bands.find(x=>x.r===r);if(!bd)continue;const obs=L[r].filter(n=>!n.dummy&&!n.spacer&&!isIn(grp.id,n.group)).map(n=>[n.c-n.cs/2-(n.group&&!isIn(n.group,grp.id)?padOf(n.group):0)-10,n.c+n.cs/2+(n.group&&!isIn(n.group,grp.id)?padOf(n.group):0)+10]);
    let na=ga,nb=gb;for(const [o0,o1] of obs){if(o1<=bd.a+1)na=Math.max(na,o1);else if(o0>=bd.b-1)nb=Math.min(nb,o0);}bd.a=Math.min(bd.a,na);bd.b=Math.max(bd.b,nb);}}
  grp.bands=bands;grp.c0=Math.min(...bands.map(x=>x.a));grp.c1=Math.max(...bands.map(x=>x.b));grp.m0=bands[0].top;grp.m1=bands[bands.length-1].bot;}
 /* bounds */
 let cMin=0,cMax=Math.max(...all.map(n=>n.c+n.cs/2));
 for(const e of [...back,...selfs])for(const p of e.pts){cMin=Math.min(cMin,p.c-8);cMax=Math.max(cMax,p.c+8);}
 for(const grp of g.groups)if(!grp.empty){cMin=Math.min(cMin,grp.c0);cMax=Math.max(cMax,grp.c1);}
 const mMin=Math.min(0,...g.groups.filter(x=>!x.empty).map(x=>x.m0));
 /* map to x,y */
 const flipM=dir==='BT'||dir==='RL';
 const mm=v=>flipM?total-v:v-mMin;
 const map=(mv,cv)=>horiz?[mm(mv),cv-cMin]:[cv-cMin,mm(mv)];
 nodes.forEach(n=>{const [x,y]=map(n.m,n.c);n.x=x-n.w/2;n.y=y-n.h/2;n.cx=x;n.cy=y;});
 for(const e of g.edges)if(e.pts)e.xy=e.pts.map(p=>map(p.m,p.c));
 for(const grp of g.groups)if(!grp.empty){const [x0,y0]=map(flipM?grp.m1:grp.m0,grp.c0),[x1,y1]=map(flipM?grp.m0:grp.m1,grp.c1);grp.x=Math.min(x0,x1);grp.y=Math.min(y0,y1);grp.w=Math.abs(x1-x0);grp.h=Math.abs(y1-y0);
  if(grp.bands&&grp.bands.length){const B=grp.bands,P=[];B.forEach(b=>{P.push([b.top,b.b],[b.bot,b.b]);});for(let i=B.length-1;i>=0;i--){P.push([B[i].bot,B[i].a],[B[i].top,B[i].a]);}
   grp.poly=P.map(([mv,cv])=>map(mv,cv));const [lx,ly]=map(flipM?B[0].bot:B[0].top,B[0].a);grp.lx=horiz?Math.min(lx,map(B[0].top,B[0].a)[0]):lx;grp.ly=horiz?ly:Math.min(ly,map(B[0].bot,B[0].a)[1]);}}
 const W=horiz?total-mMin:cMax-cMin,H=horiz?cMax-cMin:total-mMin;
 return {W,H,horiz,crossings:best,back:back.length,R};}

/* ---------------- drawing helpers ---------------- */
function simplify(p){const o=[p[0]];for(let i=1;i<p.length;i++){const a=o[o.length-1],b=p[i];if(Math.abs(a[0]-b[0])<.5&&Math.abs(a[1]-b[1])<.5)continue;o.push(b);}
 const r=[o[0]];for(let i=1;i<o.length-1;i++){const a=r[r.length-1],b=o[i],c=o[i+1];if((Math.abs(a[0]-b[0])<.5&&Math.abs(b[0]-c[0])<.5)||(Math.abs(a[1]-b[1])<.5&&Math.abs(b[1]-c[1])<.5))continue;r.push(b);}r.push(o[o.length-1]);return r;}
function roundedClosed(p,rad){const q=simplify([...p,p[0]]);if(q.length>2&&Math.abs(q[0][0]-q[q.length-1][0])<.5&&Math.abs(q[0][1]-q[q.length-1][1])<.5)q.pop();const n=q.length;if(n<3)return '';const m=[(q[0][0]+q[1][0])/2,(q[0][1]+q[1][1])/2];return rounded([m,...q.slice(1),q[0],m],rad)+'Z';}
function rounded(p,rad){if(p.length<3)return `M${p.map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' L')}`;let d=`M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
 for(let i=1;i<p.length-1;i++){const [x0,y0]=p[i-1],[x1,y1]=p[i],[x2,y2]=p[i+1];const l1=Math.hypot(x1-x0,y1-y0),l2=Math.hypot(x2-x1,y2-y1),r=Math.min(rad,l1/2,l2/2);
  const ax=x1-(x1-x0)/l1*r,ay=y1-(y1-y0)/l1*r,bx=x1+(x2-x1)/l2*r,by=y1+(y2-y1)/l2*r;d+=` L${ax.toFixed(1)} ${ay.toFixed(1)} Q${x1.toFixed(1)} ${y1.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;}
 const q=p[p.length-1];return d+` L${q[0].toFixed(1)} ${q[1].toFixed(1)}`;}
const mix=(a,b,k)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));if(!/^#[0-9a-f]{6}$/i.test(a)||!/^#[0-9a-f]{6}$/i.test(b))return a;const x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');};
const alpha=(hex,a)=>{if(!/^#[0-9a-f]{6}$/i.test(hex))return hex;const n=parseInt(hex.slice(1),16);return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`;};

function render(src,s,opt={}){
 s=s||(window.DVStyles?DVStyles[0]:null);const t=s.t,g=typeof src==='string'?parse(src):src;
 if(window.DVFonts)DVFonts(s);
 if(!g.nodes.size)return {svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120"><rect width="400" height="120" fill="${t.bg}"/><text x="200" y="64" text-anchor="middle" font-family="${esc(t.font)}" font-size="14" fill="${t.mute}">Nothing to draw yet</text></svg>`,width:400,height:120,graph:g,notes:[]};
 const L=layout(g,s,opt),uid=(opt.id||'fe')+Math.random().toString(36).slice(2,7);
 const PAD=opt.pad??36;
 const statuses=[...new Set([...g.nodes.values()].map(n=>n.status).filter(Boolean))],hasLegend=opt.showLegend!==false&&(statuses.length||g.edges.some(e=>e.back||e.self));
 const head=(opt.title?(opt.subtitle?66:44)+(t.tag?10:0):0)+(hasLegend?30:0);
 const legendW=hasLegend?[...statuses.map(k=>(opt.legend||{})[k]||{good:'Have',bad:"Don't have",warn:'Partial',accent:'Key step',muted:'Out of scope'}[k]||k),...(L.back?[opt.loopLabel||'Loop back']:[])].reduce((a,l)=>a+measure(l,11.5,500,t.font)+40,0):0,titleW=opt.title?measure(opt.title,22,600,t.head)+20:0;
 const W=Math.ceil(Math.max(L.W,legendW,titleW)+PAD*2),H=Math.ceil(L.H+PAD*2+head+(statuses.length||L.back?0:0));
 const ox=PAD+(W-PAD*2-L.W)/2,oy=PAD+head,rough=t.rough>0&&window.DVRough,col={good:t.good,bad:t.bad,warn:t.dark?'#FBBF24':'#D97706',muted:t.mute,accent:t.accent};
 const glyph={good:'M-3 0l2 2.2L3.2-2.4',bad:'M-2.4-2.4l4.8 4.8M2.4-2.4l-4.8 4.8',warn:'M0-3v3.4M0 2.6v.4',accent:'M0-3l.9 2.1 2.2.2-1.7 1.4.5 2.2L0 2.8l-1.9 1.1.5-2.2-1.7-1.4 2.2-.2z',muted:'M-2.6 0h5.2'};
 const tex=window.DVTexture?DVTexture(s,uid+'t',W,H):{defs:'',rect:`<rect width="${W}" height="${H}" fill="${t.bg}"/>`};
 const groupFills=t.fills||null,groupIdx=new Map(g.groups.map((x,i)=>[x.id,i]));const topGroup=gid=>{let x=g.groups.find(y=>y.id===gid);while(x&&x.parent)x=g.groups.find(y=>y.id===x.parent);return x?x.id:gid;};
 let defs=tex.defs,body='';
 /* arrowheads */
 const edgeCol=t.dark?alpha(t.line,.62)||t.line:alpha(t.line,.72),loopCol=t.accent,mk=(id,c)=>t.arrow==='open'?`<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="${7+t.edge*1.5}" markerHeight="${7+t.edge*1.5}" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker>`:`<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="${6+t.edge*1.6}" markerHeight="${6+t.edge*1.6}" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0.8L10 5L0 9.2z" fill="${c}"/></marker>`;
 defs+=mk(uid+'a',edgeCol)+mk(uid+'l',loopCol)+mk(uid+'k',t.accent);
 if(t.hachure)(t.fills||[]).concat(['#B2F2BB','#FFC9C9','#FFEC99']).forEach((f,i)=>defs+=`<pattern id="${uid}h${i}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-42)"><rect width="9" height="9" fill="${t.bg}"/><path d="M0 4.5H9" stroke="${f}" stroke-width="1.7"/></pattern>`);
 if(t.glow)defs+=`<filter id="${uid}g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter><linearGradient id="${uid}n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".10"/><stop offset="1" stop-color="#ffffff" stop-opacity=".03"/></linearGradient>`;
 if(t.softShadow){const [dx,dy,b,c2,o]=t.softShadow;defs+=`<filter id="${uid}s" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${b/2}" flood-color="${c2}" flood-opacity="${o}"/></filter>`;}
 if(t.neu)defs+=`<filter id="${uid}u" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur in="SourceAlpha" stdDeviation="6" result="b"/><feOffset in="b" dx="6" dy="6" result="o1"/><feFlood flood-color="#A7B2C4" flood-opacity=".75"/><feComposite in2="o1" operator="in" result="d"/><feOffset in="b" dx="-6" dy="-6" result="o2"/><feFlood flood-color="#FFFFFF" flood-opacity=".95"/><feComposite in2="o2" operator="in" result="l"/><feMerge><feMergeNode in="d"/><feMergeNode in="l"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="${uid}in" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A7B2C4"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>`;
 if(t.frost)defs+=`<linearGradient id="${uid}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".82"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".46"/></linearGradient>`;
 const gradCache=new Map(),clayGrad=c2=>{if(!gradCache.has(c2)){const id=uid+'c'+gradCache.size;gradCache.set(c2,id);defs+=`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(c2,'#FFFFFF',.82)}"/><stop offset="1" stop-color="${mix(c2,'#FFFFFF',.45)}"/></linearGradient>`;}return `url(#${gradCache.get(c2)})`;};
 if(t.clay)defs+=`<linearGradient id="${uid}hl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".85"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>`;
 const tintOf=n=>{if(!n)return t.series[1]||t.accent;if(n.status&&n.status!=='muted')return col[n.status];const gi=n.group?groupIdx.get(topGroup(n.group)):-1;return gi>=0?t.series[gi%t.series.length]:t.series[1]||t.accent;};
 const F=`font-family="${esc(t.font)}"`;
 /* title */
 if(opt.title){let y=PAD;if(t.tag){body+=`<rect x="${PAD}" y="${y-6}" width="34" height="6" fill="${t.accent}"/>`;y+=10;}
  body+=`<text x="${PAD}" y="${y+20}" font-family="${esc(t.head)}" font-size="${t.id==='tufte'||t.serifTitle?26:21}" font-weight="${t.id==='brutal'?400:600}" fill="${t.ink}">${esc(t.upper?opt.title.toUpperCase():opt.title)}</text>`;
  if(opt.subtitle)body+=`<text x="${PAD}" y="${y+42}" ${F} font-size="12.5" fill="${t.mute}">${esc(opt.subtitle)}</text>`;
  if(t.tag)body+=`<line x1="${PAD}" x2="${W-PAD}" y1="${PAD-6}" y2="${PAD-6}" stroke="${t.ink}" stroke-width="1"/>`;}
 /* legend */
 const legendItems=[];const LBL=opt.legend||{good:'Have',bad:"Don't have",warn:'Partial',accent:'Key step',muted:'Out of scope'};
 statuses.forEach(k=>legendItems.push({k,label:LBL[k]||k}));if(L.back)legendItems.push({k:'loop',label:opt.loopLabel||'Loop back'});
 if(legendItems.length&&opt.showLegend!==false){let lx=PAD;const ly=PAD+head-22;const parts=[];
  for(const it of legendItems){parts.push(it.k==='loop'?`<path d="M${lx} ${ly}h16" stroke="${loopCol}" stroke-width="${t.edge+.5}" stroke-dasharray="4 3"/>`:`<rect x="${lx+3}" y="${ly-5}" width="10" height="10" rx="${t.nodeRadius?3:0}" fill="${col[it.k]}"/>`);lx+=22;
   const tw=measure(it.label,11.5,500,t.font);parts.push(`<text x="${lx}" y="${ly+4}" ${F} font-size="11.5" font-weight="500" fill="${t.mute}">${esc(it.label)}</text>`);lx+=tw+18;}
  body+=parts.join('');}
 body+=`<g transform="translate(${ox},${oy})">`;
 /* groups */
 const sortedGroups=g.groups.filter(x=>!x.empty).sort((a,b)=>a.depth-b.depth);
 sortedGroups.filter(x=>x.lane).forEach((grp,k)=>{const band=k%2?alpha(t.dark?'#ffffff':t.ink,t.dark?.045:.035):alpha(t.dark?'#ffffff':t.ink,t.dark?.02:.012);const div=alpha(t.dark?'#ffffff':t.ink,.12);
  body+=`<rect x="${grp.x}" y="${grp.y}" width="${grp.w}" height="${grp.h}" fill="${band}"/>`;if(k)body+=L.horiz?`<line x1="${grp.x}" x2="${grp.x+grp.w}" y1="${grp.y}" y2="${grp.y}" stroke="${div}"/>`:`<line x1="${grp.x}" x2="${grp.x}" y1="${grp.y}" y2="${grp.y+grp.h}" stroke="${div}"/>`;
  const tc=tintOf({group:grp.id});body+=L.horiz?`<text x="${grp.x+14}" y="${grp.y+20}" font-family="${esc(t.mono)}" font-size="11" font-weight="700" letter-spacing="1.2" fill="${t.ink}">${esc((grp.title||'').toUpperCase())}</text><rect x="${grp.x+14}" y="${grp.y+27}" width="22" height="3" rx="1.5" fill="${tc}"/>`
   :`<rect x="${grp.x+12}" y="${grp.y+12}" width="${grp.w-24}" height="30" rx="${Math.min(t.radius,10)}" fill="${t.surface&&t.surface.startsWith('#')?t.surface:t.bg}" stroke="${div}"/><rect x="${grp.x+24}" y="${grp.y+24}" width="7" height="7" rx="2" fill="${tc}"/><text x="${grp.x+38}" y="${grp.y+31.5}" font-family="${esc(t.font)}" font-size="12" font-weight="600" fill="${t.ink}">${esc(grp.title||'')}</text>`;});
 sortedGroups.filter(x=>!x.lane).forEach((grp)=>{const i=groupIdx.get(grp.id);const fill=t.id==='pastel'&&groupFills?alpha(groupFills[i%groupFills.length].length===7?groupFills[i%groupFills.length]:'#f5f5f5',.55):t.id==='sketch'?'none':t.board&&!t.dark?alpha(tintOf({group:grp.id}),t.neu?.06:.05):alpha(t.dark?'#ffffff':t.ink,t.dark?.035:.028)||'rgba(0,0,0,.03)';
  const stroke=t.id==='brutal'?t.ink:t.id==='blueprint'?alpha('#F1F6FF',.45):t.board?alpha(tintOf({group:grp.id}),.28):alpha(t.dark?'#ffffff':t.ink,t.dark?.14:.16);
  const dash=t.id==='brutal'||t.board?'':' stroke-dasharray="5 4"',sw=t.id==='brutal'?2:1,r=Math.min(t.radius+4,22);
  if(rough)body+=`<path d="${DVRough([[grp.x,grp.y],[grp.x+grp.w,grp.y],[grp.x+grp.w,grp.y+grp.h],[grp.x,grp.y+grp.h]],i+3,1.2,true)}" fill="none" stroke="${alpha(t.ink,.4)}" stroke-width="1.2" stroke-dasharray="6 5"/>`;
  else if(grp.poly)body+=`<path d="${roundedClosed(grp.poly,r)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash}/>`;
  else body+=`<rect x="${grp.x}" y="${grp.y}" width="${grp.w}" height="${grp.h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash}/>`;
  if(grp.poly){grp.x=grp.lx;grp.y=grp.ly;}
  const title=(grp.title||'').toUpperCase();body+=t.board?`<rect x="${grp.x+14}" y="${grp.y+13}" width="6" height="6" rx="1.5" fill="${tintOf({group:grp.id})}"/><text x="${grp.x+26}" y="${grp.y+20}" font-family="${esc(t.font)}" font-size="10.5" font-weight="700" letter-spacing="1.1" fill="${t.mute}">${esc(title)}</text>`:`<text x="${grp.x+14}" y="${grp.y+20}" font-family="${esc(t.mono)}" font-size="10.5" font-weight="600" letter-spacing="1.3" fill="${t.mute}">${esc(title)}</text>`;});
 /* edges */
 const labels=[];const edgesSvg=[];
 for(const e of g.edges){if(!e.xy)continue;const p=simplify(e.xy),isLoop=e.back||e.self,thick=e.kind==='thick';
  const src=g.nodes.get(e.from),lab=(e.label||'').toLowerCase(),branch=/^(yes|pass|approved|ok|true|valid|success)/.test(lab)?t.good:/^(no|fail|reject|false|invalid|error)/.test(lab)?t.bad:null;
  const c=isLoop?loopCol:thick?t.accent:t.edgeTint?(branch||alpha(tintOf(src.status?{group:src.group}:src),.85)):t.neu?'#B3BCCB':edgeCol,w=(thick?t.edge+1:t.edge),dash=isLoop?` stroke-dasharray="${t.id==='brutal'?'7 5':'5 4'}"`:e.kind==='dashed'?' stroke-dasharray="3 4"':'';
  const marker=e.arrow===false||t.arrow==='none'?'':` marker-end="url(#${uid}${isLoop?'l':thick?'k':'a'})"`;e.col=c;
  /* stop the line where the arrowhead begins */
  const end=p[p.length-1],prev=p[p.length-2]||end,len=Math.hypot(end[0]-prev[0],end[1]-prev[1])||1,cut=Math.min(1.5,len/2),q=[...p];q[q.length-1]=[end[0]-(end[0]-prev[0])/len*cut,end[1]-(end[1]-prev[1])/len*cut];
  const d=rough?DVRough(q,e.i+11,.9,false):rounded(q,t.route==='curve'?(t.curve||22):(t.radius>=8?10:t.nodeRadius?7:3));
  if(s.t.misregister)edgesSvg.push(`<path d="${d}" fill="none" stroke="${t.accent}" stroke-width="${w}" opacity=".55" transform="translate(1.4 1)" style="mix-blend-mode:multiply"/>`);
  edgesSvg.push(`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash}${marker}/>`);
  if(t.arrow==='none')edgesSvg.push(`<circle cx="${p[0][0]}" cy="${p[0][1]}" r="3.4" fill="${t.surface}" stroke="${c}" stroke-width="1.6"/><circle cx="${end[0]}" cy="${end[1]}" r="3.4" fill="${c}"/>`);
  if(e.label){const txt=t.upper?e.label.toUpperCase():e.label,lw=measure(txt,11.5,600,t.font)+14,lh=19;let best=null;
   const segs=[];for(let i=0;i<p.length-1;i++){const [x0,y0]=p[i],[x1,y1]=p[i+1],L2=Math.hypot(x1-x0,y1-y0),hz=Math.abs(y0-y1)<.5;segs.push({i,x0,y0,x1,y1,L:L2,hz});}
   const fits=sg=>sg.L>=(sg.hz?lw:lh)+14;
   best=(isLoop?segs.filter(sg=>!sg.hz&&fits(sg)).sort((a,b)=>b.L-a.L)[0]:null)||segs.find(sg=>fits(sg)&&!(sg.i===segs.length-1&&!sg.hz))||segs.find(fits)||segs[0];
   let lx=(best.x0+best.x1)/2,ly=(best.y0+best.y1)/2;
   if(!best.hz&&best.i===0){ly=Math.min(best.y0,best.y1)+Math.min(Math.abs(best.y1-best.y0)/2,22);if(best.y1<best.y0)ly=Math.max(best.y0,best.y1)-Math.min(Math.abs(best.y1-best.y0)/2,22);}
   lx=Math.max(lx,lw/2-ox+6);lx=Math.min(lx,W-ox-lw/2-6);
   for(const o of labels){if(Math.abs(o.x-lx)<(o.w+lw)/2+4&&Math.abs(o.y-ly)<lh+2){if(best.hz)lx+=(o.w+lw)/2+6;else ly+=lh+4;}}
   labels.push({x:lx,y:ly,w:lw,txt,c:isLoop?loopCol:thick?t.accent:t.edgeTint?c:t.mute});}}
 body+=edgesSvg.join('');
 /* nodes */
 const fillFor=n=>{if(t.hachure){const k=n.status==='good'?(t.fills||[]).length:n.status==='bad'?(t.fills||[]).length+1:n.status==='warn'?(t.fills||[]).length+2:(groupIdx.get(n.group)??0)%((t.fills||[1]).length);return `url(#${uid}h${k})`;}
  if(t.id==='pastel'){if(n.status==='good')return '#EBFBEE';if(n.status==='bad')return '#FFF1F0';if(n.status==='warn')return '#FFF8E6';if(n.shape==='decision')return '#F3F0FF';return t.nodeFill;}
  if(t.glow)return `url(#${uid}n)`;
  if(t.clay)return clayGrad(n.shape==='decision'&&!n.status?t.series[1]:n.status?col[n.status]:tintOf(n));
  if(t.frost)return `url(#${uid}f)`;
  if(t.neu)return t.bg;
  if((t.id==='calm'||t.id==='lilac')&&n.shape==='decision'&&!n.status)return t.fills[0];
  if(t.id==='riso')return n.status==='bad'?'#FF48B0':n.status==='good'?'#FFE800':n.shape==='decision'?'#7FC4EA':'#FFE800';
  if(t.id==='brutal'&&(n.shape==='decision'||n.status))return n.status==='bad'?'#FF6B6B':n.status==='good'?'#6BCB77':n.status==='warn'?'#FFD23F':'#FFD23F';
  return t.nodeFill;};
 const strokeFor=n=>{if(t.id==='pastel')return n.status==='good'?'#8CE99A':n.status==='bad'?'#FFA8A8':n.status==='warn'?'#FFD43B':n.shape==='decision'?'#B197FC':t.nodeStroke;
  if(t.hachure||t.id==='brutal'||t.id==='riso'||t.id==='blueprint'||t.id==='tufte'||t.neu||t.clay||t.frost)return t.nodeStroke;
  if(t.board&&n.status)return alpha(col[n.status],.45);
  if(n.status&&!t.hachure)return t.dark?alpha(col[n.status],.75):alpha(col[n.status],.85);return t.nodeStroke;};
 const shapePath=(n,x,y,w,h)=>{const r=n.shape==='pill'||n.shape==='circle'?h/2:n.shape==='round'?Math.max(10,t.nodeRadius):t.nodeRadius;
  if(n.shape==='io'){const k=10;return {d:`M${x+k} ${y}H${x+w}L${x+w-k} ${y+h}H${x}Z`,pts:[[x+k,y],[x+w,y],[x+w-k,y+h],[x,y+h]]};}
  if(n.shape==='decision'&&opt.decision==='diamond')return {d:`M${x+w/2} ${y}L${x+w} ${y+h/2}L${x+w/2} ${y+h}L${x} ${y+h/2}Z`,pts:[[x+w/2,y],[x+w,y+h/2],[x+w/2,y+h],[x,y+h/2]]};
  if(n.shape==='data'){const e=7;return {d:`M${x} ${y+e}C${x} ${y-e/2} ${x+w} ${y-e/2} ${x+w} ${y+e}V${y+h-e}C${x+w} ${y+h+e/2} ${x} ${y+h+e/2} ${x} ${y+h-e}Z M${x} ${y+e}C${x} ${y+e*2} ${x+w} ${y+e*2} ${x+w} ${y+e}`,pts:[[x,y+e],[x+w/2,y-e/3],[x+w,y+e],[x+w,y+h-e],[x+w/2,y+h+e/3],[x,y+h-e]]};}
  const rr=Math.min(r,h/2,w/2);return {d:`M${x+rr} ${y}H${x+w-rr}Q${x+w} ${y} ${x+w} ${y+rr}V${y+h-rr}Q${x+w} ${y+h} ${x+w-rr} ${y+h}H${x+rr}Q${x} ${y+h} ${x} ${y+h-rr}V${y+rr}Q${x} ${y} ${x+rr} ${y}Z`,pts:[[x,y],[x+w,y],[x+w,y+h],[x,y+h]]};};
 for(const n of g.nodes.values()){const {x,y,w,h}=n,sp=shapePath(n,x,y,w,h),fill=fillFor(n),stroke=strokeFor(n);let sw=t.stroke;
  if(n.status&&!t.hachure&&t.id!=='brutal')sw=Math.max(sw,1.4);
  if(t.hardShadow)body+=`<path d="${sp.d}" transform="translate(4 4)" fill="${t.ink}"/>`;
  if(t.glow&&(n.status||n.shape==='decision'))body+=`<path d="${sp.d}" fill="none" stroke="${n.status?col[n.status]:t.accent}" stroke-width="3" opacity=".45" filter="url(#${uid}g)"/>`;
  if(t.shadow&&t.shadow!=='none'&&!t.hardShadow&&!t.glow&&!t.softShadow&&!t.neu)body+=`<path d="${sp.d}" transform="translate(0 1.5)" fill="${alpha('#101828',.07)}"/>`;
  if(rough){body+=`<path d="${sp.d}" fill="${fill}" stroke="none"/><path d="${DVRough(sp.pts,n.i+1,1.3,true)}" fill="none" stroke="${stroke}" stroke-width="${t.stroke}" stroke-linecap="round"/>`;}
  else{const filt=t.neu?` filter="url(#${uid}u)"`:t.softShadow?` filter="url(#${uid}s)"`:'';
   if(t.frost)body+=`<path d="${sp.d}" fill="rgba(255,255,255,.18)"${filt}/>`;
   body+=`<path d="${sp.d}" fill="${fill}" stroke="${stroke==='none'?'none':stroke}" stroke-width="${stroke==='none'?0:sw}"${t.frost?'':filt}${t.multiply?' style="mix-blend-mode:multiply"':''}/>`;
   if(t.clay){const hw=w*.7,hh=Math.min(h*.32,16);body+=`<rect x="${x+(w-hw)/2}" y="${y+4}" width="${hw}" height="${hh}" rx="${hh/2}" fill="url(#${uid}hl)" opacity=".9"/>`;}
   if(t.frost)body+=`<path d="M${x+t.nodeRadius} ${y+1.2}H${x+w-t.nodeRadius}" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" opacity=".95"/>`;
   if(t.misregister)body+=`<path d="${sp.d}" fill="none" stroke="${t.accent}" stroke-width="${t.stroke}" opacity=".6" transform="translate(1.6 1.2)" style="mix-blend-mode:multiply"/>`;}
  if(n.shape==='sub')body+=`<path d="M${x+8} ${y+3}V${y+h-3}M${x+w-8} ${y+3}V${y+h-3}" stroke="${stroke==='none'?t.line:stroke}" stroke-width="1"/>`;
  /* status: a coloured spine plus a glyph, never colour alone */
  const hasSpine=n.status&&!t.hachure&&!t.neu&&!t.clay&&!t.iconTiles&&t.id!=='pastel'&&t.id!=='brutal'&&t.id!=='riso'&&n.shape!=='pill'&&n.shape!=='decision'&&n.shape!=='io'&&n.shape!=='data';
  if(hasSpine){const r=Math.min(t.nodeRadius,6);body+=`<path d="M${x+r+1.5} ${y+1}H${x+4}V${y+h-1}H${x+r+1.5}" fill="none"/><rect x="${x+(t.nodeRadius?1:0)}" y="${y+(t.nodeRadius?Math.min(r,4):0)}" width="3.5" height="${h-(t.nodeRadius?Math.min(r,4)*2:0)}" rx="1.5" fill="${col[n.status]}"/>`;}
  if(n.status){const gx=x+w-14,gy=y+14,gc=col[n.status];body+=`<g transform="translate(${gx} ${gy})"><circle r="7" fill="${t.id==='riso'||t.id==='brutal'?t.ink:gc}"/><path d="${glyph[n.status]}" fill="${n.status==='accent'?t.bg:'none'}" stroke="${t.id==='riso'||t.id==='brutal'?'#fff':t.dark?t.bg:'#fff'}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></g>`;}
  /* text */
  if(t.iconTiles){const tc=n.status?col[n.status]:tintOf(n),tx0=x+14,ty0=y+h/2-14;const outs=g.edges.some(e=>e.from===n.id);
   const ic=n.shape==='decision'?'M6 4v5a4 4 0 0 0 4 4h8M14 9l4 4-4 4':n.shape==='data'?'M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3zM5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3':n.shape==='io'?'M4 12h11M11 7l5 5-5 5M20 5v14':(n.shape==='pill'||n.shape==='circle')?(outs?'M8 5.5l11 6.5-11 6.5z':'M6 21V4M6 4h11l-2 4 2 4H6'):'M13 3L5 14h6l-1 7 8-11h-6z';
   body+=`<rect x="${tx0}" y="${ty0}" width="28" height="28" rx="8" fill="${alpha(tc,.13)}"/><g transform="translate(${tx0+5} ${ty0+5}) scale(.75)"><path d="${ic}" fill="none" stroke="${tc}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></g>`;}
  const deco=!t.iconTiles&&n.shape==='decision'&&opt.decision!=='diamond';const th=n.lines.length*13.5*1.3+(n.noteLines.length?6+n.noteLines.length*12*1.35:0);
  let ty=y+h/2-th/2+13.5*1.0;const center=n.shape==='pill'||n.shape==='circle'||(n.shape==='decision'&&opt.decision==='diamond');const tx=center&&!t.iconTiles?x+w/2:x+16+(hasSpine?2:0)+(deco?20:0)+(t.iconTiles?40:0);const anchor=center&&!t.iconTiles?'middle':'start';
  if(deco){const dx=x+16+(hasSpine?2:0)+6,dy=ty-4.5;body+=`<path d="M${dx} ${dy-6}L${dx+6} ${dy}L${dx} ${dy+6}L${dx-6} ${dy}Z" fill="${t.id==='pastel'?'#7950F2':t.accent}"${rough?'':''}/>`;}
  const ink=t.id==='riso'?'#1B2A6B':t.id==='brutal'&&(n.status||n.shape==='decision')?'#000':t.ink;
  n.lines.forEach((l,i)=>{body+=`<text x="${tx}" y="${(ty+i*13.5*1.3).toFixed(1)}" ${F} font-size="13.5" font-weight="${t.id==='tufte'?500:600}" fill="${ink}" text-anchor="${anchor}">${esc(l)}</text>`;});
  ty+=n.lines.length*13.5*1.3+4;
  n.noteLines.forEach((l,i)=>{body+=`<text x="${tx}" y="${(ty+i*12*1.35).toFixed(1)}" ${F} font-size="12" fill="${t.id==='riso'||t.id==='brutal'&&(n.status||n.shape==='decision')?ink:t.mute}" text-anchor="${anchor}"${t.id==='tufte'?' font-style="italic"':''}>${esc(l)}</text>`;});}
 /* edge labels on top */
 for(const l of labels){const plate=t.id==='blueprint'?t.bg:t.id==='glass'?'#161B2B':t.id==='sketch'?t.bg:t.surface&&t.surface.startsWith('#')?t.surface:t.bg;
  if(t.neu)body+=`<rect x="${(l.x-l.w/2).toFixed(1)}" y="${(l.y-10).toFixed(1)}" width="${l.w.toFixed(1)}" height="20" rx="10" fill="#DFE4EB" stroke="url(#${uid}in)" stroke-width="1.6"/><text x="${l.x.toFixed(1)}" y="${(l.y+4).toFixed(1)}" ${F} font-size="11.5" font-weight="600" fill="${l.c===t.mute?t.ink:l.c}" text-anchor="middle">${esc(l.txt)}</text>`;
  else if(t.board)body+=`<rect x="${(l.x-l.w/2).toFixed(1)}" y="${(l.y-10).toFixed(1)}" width="${l.w.toFixed(1)}" height="20" rx="10" fill="${t.frost?'rgba(255,255,255,.85)':t.clay?'#FFFFFF':t.surface}" stroke="${alpha(l.c===t.mute?t.ink:l.c,t.edgeTint?.75:.22)}" stroke-width="${t.edgeTint?1.3:1}"${t.softShadow&&!t.edgeTint?` filter="url(#${uid}s)"`:''}/><text x="${l.x.toFixed(1)}" y="${(l.y+4).toFixed(1)}" ${F} font-size="11.5" font-weight="600" fill="${l.c===t.mute?t.ink:l.c}" text-anchor="middle">${esc(l.txt)}</text>`;
  else body+=`<rect x="${(l.x-l.w/2).toFixed(1)}" y="${(l.y-10).toFixed(1)}" width="${l.w.toFixed(1)}" height="20" rx="${t.id==='brutal'||t.id==='blueprint'||t.id==='editorial'?0:10}" fill="${plate}" stroke="${t.id==='brutal'?t.ink:alpha(l.c===t.mute?(t.dark?'#ffffff':t.ink):l.c,t.id==='brutal'?1:.28)}" stroke-width="${t.id==='brutal'?2:1}"/><text x="${l.x.toFixed(1)}" y="${(l.y+4).toFixed(1)}" ${F} font-size="11.5" font-weight="600" fill="${l.c===t.mute?t.ink:l.c}" text-anchor="middle">${esc(l.txt)}</text>`;}
 body+='</g>';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(opt.title||'Flowchart')}: ${g.nodes.size} steps, ${g.edges.length} connections"><defs>${defs}</defs>${tex.rect}${body}${tex.over||''}</svg>`;
 /* what the engine took care of, and what the author should look at */
 const notes=[];const nodesArr=[...g.nodes.values()];
 notes.push({ok:true,text:`Laid out in ${L.R} ranks, ${L.horiz?'left to right':'top to bottom'}, on one grid.`});
 notes.push({ok:true,text:L.crossings?`Order chosen to cut line crossings to ${L.crossings}.`:'No connectors cross.'});
 if(L.back)notes.push({ok:true,text:`${L.back} loop${L.back>1?'s':''} routed round the outside, dashed in the accent colour.`});
 const dec=nodesArr.filter(n=>n.shape==='decision');for(const n of dec){const outs=g.edges.filter(e=>e.from===n.id);if(outs.length>1&&outs.some(e=>!e.label))notes.push({ok:false,text:`“${n.label}” has ${outs.filter(e=>!e.label).length} unlabelled branch${outs.filter(e=>!e.label).length>1?'es':''}. Add |Yes| / |No| labels.`});if(outs.length<2)notes.push({ok:false,text:`“${n.label}” is a decision with ${outs.length} way out. Make it an action, or add the other branch.`});}
 const starts=nodesArr.filter(n=>!g.edges.some(e=>e.to===n.id&&!e.back));if(starts.length>1)notes.push({ok:false,text:`${starts.length} steps have no way in (${starts.slice(0,3).map(n=>'“'+n.label+'”').join(', ')}${starts.length>3?'…':''}). One clear start reads better.`});
 if(starts.length===1&&starts[0].shape!=='pill')notes.push({ok:false,text:`Make the start “${starts[0].label}” a pill: id([…]).`});
 const wide=Math.max(...[...Array(L.R).keys()].map(r=>nodesArr.filter(n=>n.rank===r).length));if(wide>5)notes.push({ok:false,text:`One rank holds ${wide} steps. Consider grouping them into a subgraph or splitting the chart.`});
 if(nodesArr.length>28)notes.push({ok:false,text:`${nodesArr.length} steps on one canvas. Split into an overview and linked detail charts.`});
 return {svg,width:W,height:H,graph:g,notes};}

window.FlowEngine={parse,layout,render,STATUS};
})();
