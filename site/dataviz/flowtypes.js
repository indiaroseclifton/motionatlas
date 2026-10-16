'use strict';
/* FlowTypes: different kinds of diagram from the same steps. Where FlowEngine draws one layered flowchart,
   each type here is a different layout with its own reading order:
   stepper   numbered list on a rail; branches and loops written as routes, not drawn as lines
   stages    one column per stage, steps stacked; arrows only between stages; loops as arcs below
   cycle     stages around a ring for processes that loop; feedback drawn as the ring closing
   tree      decision tree left to right; plain runs of steps folded into one card; merges become "go to" links
   capability stages × steps as status chips with progress per stage; no arrows, just what exists
   mindmap   title in the middle, stages as branches, steps as leaves
   flow and swimlanes are drawn by FlowEngine. FlowTypes.suggest(graph) ranks the types for a chart. */
(()=>{
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const alpha=(h,a)=>{if(!/^#[0-9a-f]{6}$/i.test(h))return h;const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`;};
const mix=(a,b,k)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));if(!/^#[0-9a-f]{6}$/i.test(a)||!/^#[0-9a-f]{6}$/i.test(b))return a;const x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');};
let mctx=null;const measure=(t,size,w,f)=>{if(!mctx&&typeof document!=='undefined'&&document.createElement)mctx=document.createElement('canvas').getContext('2d');if(!mctx)return String(t).length*size*.56;mctx.font=`${w} ${size}px ${f}`;return mctx.measureText(t).width;};
const wrap=(text,size,w,f,max)=>{const words=String(text).split(/\s+/).filter(Boolean),out=[];let line='';for(const wd of words){const tt=line?line+' '+wd:wd;if(measure(tt,size,w,f)<=max||!line)line=tt;else{out.push(line);line=wd;}}if(line)out.push(line);return out.length?out:[''];};

/* ---------- graph analysis shared by every type ---------- */
function analyse(g){const nodes=[...g.nodes.values()],out=new Map(nodes.map(n=>[n.id,[]])),inn=new Map(nodes.map(n=>[n.id,[]]));
 g.edges.forEach(e=>{out.get(e.from)?.push(e);inn.get(e.to)?.push(e);});
 /* back edges by DFS from starts */
 const st=new Map();g.edges.forEach(e=>{e.back=false;});const dfs=id=>{st.set(id,1);for(const e of out.get(id)){if(e.from===e.to){e.back=true;continue;}const s=st.get(e.to);if(s===1)e.back=true;else if(!s)dfs(e.to);}st.set(id,2);};
 const starts=nodes.filter(n=>!inn.get(n.id).length);(starts.length?starts:[nodes[0]]).forEach(n=>{if(!st.get(n.id))dfs(n.id);});nodes.forEach(n=>{if(!st.get(n.id))dfs(n.id);});
 /* topological order, ties broken by source order */
 const indeg=new Map(nodes.map(n=>[n.id,inn.get(n.id).filter(e=>!e.back).length])),ready=nodes.filter(n=>!indeg.get(n.id)),order=[];
 while(ready.length){ready.sort((a,b)=>a.i-b.i);const n=ready.shift();order.push(n);for(const e of out.get(n.id))if(!e.back){indeg.set(e.to,indeg.get(e.to)-1);if(!indeg.get(e.to))ready.push(g.nodes.get(e.to));}}
 nodes.forEach(n=>{if(!order.includes(n))order.push(n);});
 const top=gid=>{let x=g.groups.find(y=>y.id===gid);while(x&&x.parent)x=g.groups.find(y=>y.id===x.parent);return x?x.id:null;};
 /* sections: top-level groups in the order their first step appears; loose steps become their own section */
 const secs=[],byKey=new Map();
 for(const n of order){const k=top(n.group);if(k){if(!byKey.has(k)){const grp=g.groups.find(x=>x.id===k);const s={key:k,title:grp.title,steps:[],loose:false};byKey.set(k,s);secs.push(s);}byKey.get(k).steps.push(n);}
  else{const s={key:'~'+n.id,title:n.label,steps:[n],loose:true};secs.push(s);byKey.set(s.key,s);}}
 /* keep the stage order honest: a section goes after every section that feeds it, where possible */
 const secOf=new Map();secs.forEach((s,i)=>s.steps.forEach(n=>secOf.set(n.id,s)));
 const num=new Map();let k=0;secs.forEach(s=>s.steps.forEach(n=>num.set(n.id,++k)));
 const fwd=g.edges.filter(e=>!e.back&&e.from!==e.to),back=g.edges.filter(e=>e.back);
 return {nodes,order,out,inn,secs,secOf,num,fwd,back,starts};}

/* ---------- drawing context ---------- */
function ctx(s,opt={}){const t=s.t,uid=(opt.id||'ft')+Math.random().toString(36).slice(2,6);const C={t,s,uid,defs:'',body:'',F:`font-family="${esc(t.font)}"`,FM:`font-family="${esc(t.mono)}"`,
 col:{good:t.good,bad:t.bad,warn:t.dark?'#FBBF24':'#D97706',accent:t.accent,muted:t.mute},up:!!t.upper};
 C.T=x=>C.up?String(x).toUpperCase():x;
 C.surf=t.surface&&t.surface.startsWith('#')?t.surface:(t.dark?'#161C2C':'#FFFFFF');
 C.cardFill=t.neu?t.bg:t.frost?'rgba(255,255,255,.72)':t.glow?'rgba(255,255,255,.07)':t.nodeFill&&t.nodeFill!=='transparent'?t.nodeFill:t.bg;
 C.cardStroke=t.nodeStroke&&t.nodeStroke!=='none'?t.nodeStroke:null;
 C.line=t.dark?alpha(t.line,.6):alpha(t.line,.68);
 C.tint=i=>(t.cat||t.series)[i%(t.cat||t.series).length];
 if(t.softShadow){const [dx,dy,b,c,o]=t.softShadow;C.defs+=`<filter id="${uid}s" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${b/2}" flood-color="${c}" flood-opacity="${o}"/></filter>`;}
 if(t.neu)C.defs+=`<filter id="${uid}u" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b"/><feOffset in="b" dx="5" dy="5" result="o1"/><feFlood flood-color="#A7B2C4" flood-opacity=".7"/><feComposite in2="o1" operator="in" result="d"/><feOffset in="b" dx="-5" dy="-5" result="o2"/><feFlood flood-color="#FFFFFF" flood-opacity=".95"/><feComposite in2="o2" operator="in" result="l"/><feMerge><feMergeNode in="d"/><feMergeNode in="l"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
 if(t.clay)C.defs+=`<linearGradient id="${uid}cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="${mix(t.accent,'#FFFFFF',.78)}"/></linearGradient>`;
 const mk=(id,c)=>t.arrow==='open'?`<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker>`:`<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="${8+t.edge}" markerHeight="${8+t.edge}" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 1L10 5L0 9z" fill="${c}"/></marker>`;
 C.defs+=mk(uid+'a',C.line)+mk(uid+'l',t.accent)+mk(uid+'k',t.ink);
 C.arrow=(kind)=>` marker-end="url(#${uid}${kind==='loop'?'l':kind==='ink'?'k':'a'})"`;
 /* a card: rounded surface, optional status spine and glyph, number badge, title, note, extra lines */
 C.card=(x,y,w,o={})=>{const pad=14,tf=t.font,lines=wrap(C.T(o.title||''),o.size||13.5,600,tf,w-pad*2-(o.status?16:0)-(o.badge?30:0)-(o.decision?18:0));
  const note=o.note?wrap(o.note,12,400,tf,w-pad*2-(o.badge?30:0)):[];const extra=o.lines||[];
  let h=pad*2+lines.length*(o.size||13.5)*1.3+(note.length?4+note.length*15:0)+(extra.length?(note.length?16:8)+extra.reduce((a,l)=>a+(l.h||18),0):0);h=Math.max(h,o.minH||40);
  const r=Math.min(t.nodeRadius,14),d=`M${x+r} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${y+h-r}Q${x+w} ${y+h} ${x+w-r} ${y+h}H${x+r}Q${x} ${y+h} ${x} ${y+h-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`;let sv='';
  const stc=o.status&&C.col[o.status];
  if(t.hardShadow)sv+=`<path d="${d}" transform="translate(4 4)" fill="#000"/>`;
  const filt=t.neu?` filter="url(#${uid}u)"`:t.softShadow?` filter="url(#${uid}s)"`:'';
  const fill=o.fill||(t.clay?`url(#${uid}cl)`:t.id==='brutal'&&stc?mix(stc,'#FFFFFF',.55):t.id==='pastel'&&stc?mix(stc,'#FFFFFF',.88):C.cardFill);
  const stroke=t.id==='brutal'?'#000':stc&&t.board&&!t.neu&&!t.clay?alpha(stc,.5):C.cardStroke;
  if(t.rough&&window.DVRough)sv+=`<path d="${d}" fill="${fill}"/><path d="${window.DVRough([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],Math.round(x+y),1.2,true)}" fill="none" stroke="${t.ink}" stroke-width="1.6"/>`;
  else sv+=`<path d="${d}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${t.id==='brutal'?2.5:t.stroke||1}"`:''}${filt}/>`;
  if(t.frost)sv+=`<path d="M${x+r} ${y+1}H${x+w-r}" stroke="#fff" stroke-width="1.4" opacity=".9"/>`;
  if(stc&&!t.neu&&!t.clay&&t.id!=='brutal'&&t.id!=='pastel')sv+=`<rect x="${x+1}" y="${y+Math.min(r,6)}" width="3.5" height="${h-Math.min(r,6)*2}" rx="1.5" fill="${stc}"/>`;
  if(stc){const gl={good:'M-3 0l2 2.2L3.2-2.4',bad:'M-2.4-2.4l4.8 4.8M2.4-2.4l-4.8 4.8',warn:'M0-3v3.2M0 2.6v.3',accent:'M-2.6 0h5.2M0-2.6v5.2',muted:'M-2.6 0h5.2'}[o.status];sv+=`<g transform="translate(${x+w-14} ${y+14})"><circle r="7" fill="${stc}"/><path d="${gl}" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></g>`;}
  let tx=x+pad+(stc&&!t.neu&&!t.clay?2:0),ty=y+pad+(o.size||13.5)*.95;
  if(o.badge){sv+=`<circle cx="${tx+10}" cy="${y+pad+9}" r="11" fill="${o.badgeFill||t.accent}"/><text x="${tx+10}" y="${y+pad+13}" ${C.F} font-size="11" font-weight="700" fill="#fff" text-anchor="middle">${esc(o.badge)}</text>`;tx+=30;}
  if(o.decision){sv+=`<path d="M${tx+5} ${ty-10.5}l5 5-5 5-5-5z" fill="${t.accent}"/>`;tx+=16;}
  const ink=t.id==='brutal'&&stc?'#000':t.ink;
  lines.forEach((l,i)=>sv+=`<text x="${tx}" y="${(ty+i*(o.size||13.5)*1.3).toFixed(1)}" ${C.F} font-size="${o.size||13.5}" font-weight="600" fill="${ink}">${esc(l)}</text>`);
  let cy=ty+lines.length*(o.size||13.5)*1.3-(o.size||13.5)*.3+2;
  note.forEach((l,i)=>sv+=`<text x="${tx-(o.decision?16:0)}" y="${(cy+12+i*15).toFixed(1)}" ${C.F} font-size="12" fill="${t.mute}">${esc(l)}</text>`);if(note.length)cy+=4+note.length*15;
  if(extra.length){cy+=note.length?16:8;extra.forEach(l=>{sv+=l.svg(tx-(o.decision?16:0)-(o.badge?30:0)+(o.badge?30:0),cy);cy+=(l.h||18);});}
  return {svg:sv,h,w};};
 /* a small pill: chip(x,y,text,color,{fill}) → {svg,w} */
 C.chip=(x,y,text,c,o={})=>{text=String(text);const lim=(o.max||C.chipMax||1e9)-(o.icon?14:0)-16;if(measure(text,11.5,600,t.font)>lim){while(text.length>4&&measure(text+'…',11.5,600,t.font)>lim)text=text.slice(0,-1);text=text.trimEnd()+'…';}const tw=measure(text,11.5,600,t.font)+(o.icon?14:0)+16,r=t.id==='brutal'||t.id==='blueprint'||t.id==='editorial'?2:10;
  return {svg:`<rect x="${x}" y="${y}" width="${tw}" height="20" rx="${r}" fill="${o.fill||(t.dark?(c.startsWith('#')&&C.surf.startsWith('#')?mix(c,C.surf,.8):alpha(c,.18)):mix(c.startsWith('#')?c:'#888888',C.surf.startsWith('#')?C.surf:'#FFFFFF',.86))}" stroke="${alpha(c,t.dark?.5:.35)}" stroke-width="1"/>${o.icon?`<text x="${x+8}" y="${y+14}" ${C.F} font-size="11" fill="${c}">${o.icon}</text>`:''}<text x="${x+8+(o.icon?14:0)}" y="${y+14}" ${C.F} font-size="11.5" font-weight="600" fill="${t.dark?t.ink:mix(c,'#000000',.35)}">${esc(text)}</text>`,w:tw};};
 return C;}

function frame(C,W,H,opt,body){const t=C.t;const tex=window.DVTexture?window.DVTexture(C.s,C.uid+'t',W,H):{defs:'',rect:`<rect width="${W}" height="${H}" fill="${t.bg}"/>`};
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(opt.title||'Diagram')}"><defs>${tex.defs}${C.defs}</defs>${tex.rect}${body}${tex.over||''}</svg>`;}
function heading(C,opt,x,y){const t=C.t;let o='',h=0;if(!opt.title)return {o,h:0};
 if(t.tag){o+=`<rect x="${x}" y="${y-6}" width="34" height="6" fill="${t.accent}"/>`;y+=10;h+=10;}
 o+=`<text x="${x}" y="${y+22}" font-family="${esc(t.head)}" font-size="${t.serifTitle||t.id==='tufte'?28:23}" font-weight="${t.id==='brutal'?400:600}" fill="${t.ink}">${esc(C.T(opt.title))}</text>`;h+=34;
 if(opt.subtitle){o+=`<text x="${x}" y="${y+44}" ${C.F} font-size="13" fill="${t.mute}">${esc(opt.subtitle)}</text>`;h+=22;}
 return {o,h:h+18};}
function legendRow(C,A,x,y){const t=C.t,used=[...new Set(A.nodes.map(n=>n.status).filter(Boolean))];let o='',cx=x;const L={good:'Have',bad:"Don't have",warn:'Partial',accent:'Key step',muted:'Out of scope'};
 used.forEach(k=>{o+=`<circle cx="${cx+5}" cy="${y}" r="5" fill="${C.col[k]}"/><text x="${cx+15}" y="${y+4}" ${C.F} font-size="12" fill="${t.mute}">${L[k]}</text>`;cx+=measure(L[k],12,400,t.font)+36;});
 if(A.back.length){o+=`<path d="M${cx} ${y}h18" stroke="${t.accent}" stroke-width="2" stroke-dasharray="5 4"/><text x="${cx+24}" y="${y+4}" ${C.F} font-size="12" fill="${t.mute}">Loops back</text>`;cx+=110;}
 return {o,w:cx-x};}
const statusCount=(steps)=>{const c={good:0,bad:0,warn:0};steps.forEach(n=>{if(c[n.status]!=null)c[n.status]++;});return c;};

/* ---------- 1. step list ---------- */
function stepper(g,s,opt){const A=analyse(g),C=ctx(s,opt),t=C.t,PAD=40,W=opt.width||820,rail=PAD+78,cardX=rail+34,cardW=W-cardX-PAD;let y=PAD,o='';
 const hd=heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;const lg=legendRow(C,A,PAD,y);if(lg.w){o+=lg.o;y+=30;}
 const pos=new Map(),loops=[];
 A.secs.forEach((sec,si)=>{
  if(!sec.loose){const c=statusCount(sec.steps),has=c.good+c.bad+c.warn;y+=8;
   o+=`<text x="${cardX}" y="${y+12}" ${C.FM} font-size="11.5" font-weight="700" letter-spacing="1.4" fill="${t.mute}">${esc(sec.title.toUpperCase())}</text>`;
   if(has)o+=`<text x="${W-PAD}" y="${y+12}" ${C.F} font-size="12" fill="${t.mute}" text-anchor="end">${c.good} of ${sec.steps.length} in place</text>`;y+=24;}
  sec.steps.forEach(n=>{const i=A.num.get(n.id),outs=A.out.get(n.id).filter(e=>e.from!==e.to);const nextId=(()=>{const flat=A.secs.flatMap(z=>z.steps);const k=flat.indexOf(n);return flat[k+1]?.id;})();
   const routes=[];outs.forEach(e=>{const tg=g.nodes.get(e.to);if(e.back){routes.push({kind:'loop',text:`${e.label?e.label+': ':''}back to ${A.num.get(tg.id)} · ${tg.label}`});return;}
    if(e.to===nextId&&!e.label&&outs.length===1)return;routes.push({kind:e.label?'branch':'feed',text:`${e.label?e.label+' → ':'→ '}${A.num.get(tg.id)} · ${tg.label}`});});
   const ins=A.inn.get(n.id).filter(e=>!e.back&&A.num.get(e.from)!==i-1);if(ins.length>1||(ins.length===1&&A.num.get(ins[0].from)<i-1))routes.push({kind:'from',text:`from ${ins.map(e=>A.num.get(e.from)).sort((a,b)=>a-b).join(', ')}`});
   const lines=[];if(routes.length){let row=[],rw=0;const maxW=cardW-60;routes.forEach(r=>{const c=r.kind==='loop'?t.accent:r.kind==='branch'?(/^(yes|pass|approved|ok)/i.test(r.text)?t.good:/^(no|fail)/i.test(r.text)?t.bad:t.ink):t.mute;
     const w=measure(r.text,11.5,600,t.font)+38;if(rw+w>maxW&&row.length){lines.push(row);row=[];rw=0;}row.push({r,c,w});rw+=w+6;});if(row.length)lines.push(row);}
   const extra=lines.map(row=>({h:26,svg:(x,yy)=>{let xx=x,sv='';row.forEach(({r,c})=>{const ch=C.chip(xx,yy-4,r.text,c,{icon:r.kind==='loop'?'↺':r.kind==='from'?'↘':''});sv+=ch.svg;xx+=ch.w+6;});return sv;}}));
   const cd=C.card(cardX,y,cardW,{title:n.label,note:n.note,status:n.status,decision:n.shape==='decision',lines:extra});
   const cy=y+Math.min(cd.h/2,24);
   o+=`<circle cx="${rail}" cy="${cy}" r="14" fill="${n.status?C.col[n.status]:t.accent}"${t.neu?` filter="url(#${C.uid}u)"`:''}/><text x="${rail}" y="${cy+4.5}" ${C.F} font-size="12" font-weight="700" fill="#fff" text-anchor="middle">${i}</text>`;
   o+=cd.svg;pos.set(n.id,{y:cy,top:y,bottom:y+cd.h});y+=cd.h+12;});});
 /* the rail, drawn under the badges */
 const ys=[...pos.values()].map(p=>p.y);let rl=`<line x1="${rail}" x2="${rail}" y1="${Math.min(...ys)}" y2="${Math.max(...ys)}" stroke="${alpha(t.ink,.18)}" stroke-width="2"/>`;
 /* loops as arcs left of the rail */
 A.back.forEach((e,k)=>{const a=pos.get(e.from),b=pos.get(e.to);if(!a||!b)return;const lx=rail-26-k*12;rl+=`<path d="M${rail-15} ${a.y}H${lx+8}Q${lx} ${a.y} ${lx} ${a.y-8}V${b.y+8}Q${lx} ${b.y} ${lx+8} ${b.y}H${rail-17}" fill="none" stroke="${t.accent}" stroke-width="1.6" stroke-dasharray="5 4"${C.arrow('loop')}/>`;});
 const H=y+PAD-12;return {svg:frame(C,W,H,opt,rl+o),width:W,height:H,notes:[{ok:true,text:`${A.nodes.length} steps numbered in reading order across ${A.secs.filter(x=>!x.loose).length||1} sections.`},{ok:true,text:'Branches and loops are written as routes on each step, so no line has to cross the page.'}]};}

/* ---------- 2. stage columns ---------- */
function stages(g,s,opt){const A=analyse(g),C=ctx(s,opt),t=C.t,PAD=40,colW=opt.colW||232,gap=54;C.chipMax=colW-34;const n=A.secs.length,W=PAD*2+n*colW+(n-1)*gap;let y=PAD,o='';
 const hd=heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;const lg=legendRow(C,A,PAD,y);if(lg.w){o+=lg.o;y+=34;}
 const top=y,colX=i=>PAD+i*(colW+gap),cardPos=new Map();let maxB=top;
 A.secs.forEach((sec,i)=>{const x=colX(i),c=statusCount(sec.steps),has=c.good+c.bad+c.warn;let yy=top;
  const title=sec.loose?sec.steps[0].label:sec.title;
  o+=`<text x="${x}" y="${yy+14}" ${C.FM} font-size="11" font-weight="700" letter-spacing="1.3" fill="${t.mute}">${String(i+1).padStart(2,'0')}</text><text x="${x+26}" y="${yy+14}" ${C.F} font-size="13.5" font-weight="700" fill="${t.ink}">${esc(C.T(title.replace(/^[\d–\-, ]+·\s*/,'')))}</text>`;
  yy+=24;if(has){const bw=colW,gw=bw*c.good/sec.steps.length,ww=bw*c.warn/sec.steps.length;o+=`<rect x="${x}" y="${yy}" width="${bw}" height="5" rx="2.5" fill="${alpha(t.bad,t.dark?.35:.22)}"/><rect x="${x}" y="${yy}" width="${gw}" height="5" rx="2.5" fill="${t.good}"/>${ww?`<rect x="${x+gw}" y="${yy}" width="${ww}" height="5" fill="${C.col.warn}"/>`:''}<text x="${x+colW}" y="${yy-6}" ${C.F} font-size="11" fill="${t.mute}" text-anchor="end">${c.good}/${sec.steps.length}</text>`;yy+=16;}else yy+=6;
  const colTop=yy;sec.steps.forEach((nd,j)=>{const brs=nd.shape==='decision'?A.fwd.filter(e=>e.from===nd.id&&e.label&&A.secOf.get(e.to)===sec).map(e=>({h:24,svg:(xx,y2)=>C.chip(xx,y2-14,`${e.label} → ${g.nodes.get(e.to).label}`,t.mute).svg})):[];const inl=A.back.filter(e=>e.from===nd.id&&e.from!==e.to&&A.secOf.get(e.to)===sec).map(e=>({h:24,svg:(xx,y2)=>C.chip(xx,y2-14,`${e.label||'back'} → ${g.nodes.get(e.to).label}`,t.accent,{icon:'↺'}).svg}));const skips=brs.concat(inl).concat(A.fwd.filter(e=>e.from===nd.id&&A.secs.indexOf(A.secOf.get(e.to))-i>1).map(e=>({h:24,svg:(xx,y2)=>C.chip(xx,y2-14,`${e.label?e.label+' ':''}→ ${String(A.secs.indexOf(A.secOf.get(e.to))+1).padStart(2,'0')} ${g.nodes.get(e.to).label}`,t.mute).svg})));const cd=C.card(x,yy,colW,{title:nd.label,note:nd.note,status:nd.status,decision:nd.shape==='decision',size:13,lines:skips});
   const inner=j>0&&A.fwd.some(e=>e.from===sec.steps[j-1].id&&e.to===nd.id);if(inner)o+=`<path d="M${x+colW/2} ${yy-9}v6" stroke="${C.line}" stroke-width="1.5"${C.arrow()}/>`;
   o+=cd.svg;cardPos.set(nd.id,{x,y:yy,h:cd.h,col:i});yy+=cd.h+12;});
  sec.top=colTop;sec.bottom=yy-12;maxB=Math.max(maxB,yy);});
 /* stage arrows between neighbouring columns, at the header */
 for(let i=0;i<n-1;i++){const linked=A.fwd.some(e=>A.secOf.get(e.from)===A.secs[i]&&A.secOf.get(e.to)===A.secs[i+1]);const x0=colX(i)+colW+10,x1=colX(i+1)-10,yy=top+9;
  o+=`<path d="M${x0} ${yy}H${x1}" stroke="${linked?t.ink:alpha(t.ink,.3)}" stroke-width="${linked?1.8:1.2}"${linked?'':' stroke-dasharray="3 4"'}${C.arrow('ink')}/>`;}
 /* links that skip stages: a chip on the source card */
 let extra='';
 /* loops as arcs under the columns */
 let ly=maxB+24;const arcs=[];const cross=A.back.filter(e=>{const a=cardPos.get(e.from),b=cardPos.get(e.to);return a&&b&&a.col!==b.col;});cross.forEach((e,k)=>{const a=cardPos.get(e.from),b=cardPos.get(e.to);const x0=a.x+colW/2+8,x1=b.x+colW/2-8,yy=ly+k*30;
  arcs.push(`<path d="M${x0} ${A.secs[a.col].bottom+4}V${yy-10}Q${x0} ${yy} ${x0-10} ${yy}H${x1+10}Q${x1} ${yy} ${x1} ${yy-10}V${A.secs[b.col].bottom+6}" fill="none" stroke="${t.accent}" stroke-width="1.6" stroke-dasharray="5 4"${C.arrow('loop')}/>`);
  const lab=`↺ ${e.label||'back'}: ${g.nodes.get(e.from).label} → ${g.nodes.get(e.to).label}`;const ch=C.chip(Math.min(x0,x1)+(Math.abs(x0-x1)-measure(lab,11.5,600,t.font)-16)/2,yy-10,lab,t.accent,{max:Math.max(160,Math.abs(x0-x1)-20)});arcs.push(ch.svg);});
 const H=maxB+(cross.length?24+cross.length*30:0)+PAD;
 return {svg:frame(C,W,H,opt,o+extra+arcs.join('')),width:W,height:H,notes:[{ok:true,text:`${n} stages read left to right; steps inside a stage read top to bottom.`},{ok:true,text:A.back.length?`${A.back.length} loop${A.back.length>1?'s':''} drawn once each, under the stages, with a label.`:'No loops.'}]};}

/* ---------- 3. cycle ---------- */
function cycle(g,s,opt){const A=analyse(g),C=ctx(s,opt),t=C.t,PAD=48;const secs=A.secs,n=secs.length,cw=opt.cardW||256;C.chipMax=cw-56;
 const si=id=>secs.indexOf(A.secOf.get(id)),closer=A.back.find(e=>si(e.from)===n-1&&si(e.to)===0),toFirst=A.back.some(e=>si(e.to)===0);
 /* loops other than the ring closing are written on the card they leave from */
 const loopLines=sec=>A.back.filter(e=>e!==closer&&A.secOf.get(e.from)===sec&&e.from!==e.to).map(e=>({h:24,svg:(xx,yy)=>C.chip(xx,yy-12,`${e.label||'back'} → ${si(e.to)+1} ${g.nodes.get(e.to).label}`,t.accent,{icon:'↺'}).svg}));
 /* card heights first */
 const mk=(sec,x,y)=>{const lines=sec.steps.slice(0,10).map(st=>({h:19,svg:(xx,yy)=>`<circle cx="${xx+4}" cy="${yy-4}" r="4" fill="${st.status?C.col[st.status]:alpha(t.ink,.35)}"/><text x="${xx+14}" y="${yy}" ${C.F} font-size="12" fill="${t.ink}">${esc(wrap(st.label,12,400,t.font,cw-48)[0])}${wrap(st.label,12,400,t.font,cw-48).length>1?'…':''}</text>`}));
  if(sec.steps.length>10)lines.push({h:19,svg:(xx,yy)=>`<text x="${xx}" y="${yy}" ${C.F} font-size="12" fill="${t.mute}">+${sec.steps.length-10} more</text>`});
  const c=statusCount(sec.steps),has=c.good+c.bad+c.warn;
  return C.card(x,y,cw,{title:sec.loose?sec.steps[0].label:sec.title.replace(/^[\d–\-, ]+·\s*/,''),note:sec.loose?(sec.steps[0].note||''):(has?`${c.good} of ${sec.steps.length} in place`:`${sec.steps.length} steps`),badge:String(secs.indexOf(sec)+1),badgeFill:C.tint(secs.indexOf(sec)),lines:(sec.loose?[]:lines).concat(loopLines(sec)),status:sec.loose?sec.steps[0].status:null,decision:sec.loose&&sec.steps[0].shape==='decision',size:14});};
 const hs=secs.map(sec=>mk(sec,0,0).h),maxH=Math.max(...hs);
 /* ellipse big enough that neighbouring cards clear each other */
 let Rx=Math.max(340,n*(cw+40)/(2*Math.PI)*1.15),Ry=Math.max(230,Rx*.62);const P=i=>{const a=-Math.PI/2+i*2*Math.PI/n;return [Math.cos(a)*Rx,Math.sin(a)*Ry];};
 for(let it=0;it<40;it++){let clash=false;for(let i=0;i<n;i++){const j=(i+1)%n,[x0,y0]=P(i),[x1,y1]=P(j);if(Math.abs(x0-x1)<cw+150&&Math.abs(y0-y1)<(hs[i]+hs[j])/2+64)clash=true;}if(!clash)break;Rx*=1.07;Ry*=1.07;}
 const hd=heading(C,opt,PAD,PAD),cx=PAD+Rx+cw/2,cy=PAD+hd.h+Ry+maxH/2+10,W=Math.round(cx*2),H=Math.round(cy+Ry+maxH/2+PAD+(A.back.length>1?10:0));
 let o=hd.o,ring='';const centres=secs.map((_,i)=>{const [x,y]=P(i);return [cx+x,cy+y];});
 /* ring arrows between consecutive stages, along the ellipse */
 const linked=(i,j)=>A.fwd.concat(A.back).some(e=>A.secOf.get(e.from)===secs[i]&&A.secOf.get(e.to)===secs[j]);
 const edgePt=(c,h,dx,dy)=>{const hw=cw/2+8,hh=h/2+8,k=Math.min(dx?hw/Math.abs(dx):1e9,dy?hh/Math.abs(dy):1e9);return [c[0]+dx*k,c[1]+dy*k];};
 for(let i=0;i<n;i++){const j=(i+1)%n;if(j===0&&!toFirst)continue;if(n<2)break;
  const a=centres[i],b=centres[j],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;const p0=edgePt(a,hs[i],dx/L,dy/L),p1=edgePt(b,hs[j],-dx/L,-dy/L);
  const mx=(p0[0]+p1[0])/2,my=(p0[1]+p1[1])/2,ox=mx-cx,oy=my-cy,ol=Math.hypot(ox,oy)||1,bend=Math.min(40,Math.hypot(p1[0]-p0[0],p1[1]-p0[1])*.25),qx=mx+ox/ol*bend,qy=my+oy/ol*bend;
  const isLoop=j===0||!linked(i,j);ring+=`<path d="M${p0[0].toFixed(1)} ${p0[1].toFixed(1)}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}" fill="none" stroke="${isLoop?t.accent:alpha(t.ink,.55)}" stroke-width="${isLoop?2:1.8}"${isLoop?' stroke-dasharray="6 5"':''} stroke-linecap="round"${C.arrow(isLoop?'loop':'ink')}/>`;
  if(j===0){const lab=closer?closer.label||'loop':'next round';const lx=(p0[0]+2*qx+p1[0])/4,ly=(p0[1]+2*qy+p1[1])/4;const ch=C.chip(lx-measure(lab,11.5,600,t.font)/2-15,ly-10,lab,t.accent,{icon:'↺',max:400});ring+=ch.svg;}}
 secs.forEach((sec,i)=>{const [x,y]=centres[i];o+=mk(sec,x-cw/2,y-hs[i]/2).svg;});
 /* the centre */
 const lg=legendRow(C,A,0,0);o+=`<text x="${cx}" y="${cy-6}" ${C.F} font-size="12" fill="${t.mute}" text-anchor="middle">${esc(C.T(A.back.length?'One connected loop':'A cycle'))}</text><text x="${cx}" y="${cy+16}" ${C.F} font-size="13" font-weight="600" fill="${t.ink}" text-anchor="middle">${n} stages · ${A.nodes.length} steps</text>`;
 if(lg.w)o+=`<g transform="translate(${cx-lg.w/2} ${cy+42})">${lg.o}</g>`;
 return {svg:frame(C,W,H,opt,ring+o),width:W,height:H,notes:[{ok:true,text:`${n} stages placed round one ring, read clockwise from the top.`},{ok:true,text:A.back.length?'The ring closing is the feedback loop; any other loop is written on the card it leaves from, so nothing cuts across the middle.':'No loops.'}]};}

/* ---------- 4. decision tree ---------- */
function tree(g,s,opt){const A=analyse(g),C=ctx(s,opt),t=C.t,PAD=40,colW=opt.colW||250,gapY=16;C.chipMax=colW-34;const gapX=Math.max(64,...g.edges.map(e=>e.label?measure(e.label,11.5,600,s.t.font)+60:0));
 /* fold plain runs (one in, one out, not decisions) into blocks */
 const blockOf=new Map(),blocks=[];const single=id=>{const n=g.nodes.get(id);return n.shape!=='decision'&&A.out.get(id).filter(e=>!e.back).length===1&&!A.out.get(id).some(e=>e.back);};
 const visited=new Set(),reach=id=>{const seen=new Set([id]),q=[id];while(q.length){for(const e of A.out.get(q.shift()))if(!e.back&&!seen.has(e.to)){seen.add(e.to);q.push(e.to);}}return seen.size;};
 const root=A.starts.length?A.starts.reduce((a,b)=>reach(b.id)>reach(a.id)?b:a):A.order[0];
 /* a lone starting step that only feeds one step becomes an input on that step's card, not a tree of its own */
 const inputs=new Map();A.starts.forEach(n=>{if(n===root||n.shape==='decision')return;const o=A.out.get(n.id);if(o.length!==1||o[0].back)return;visited.add(n.id);if(!inputs.has(o[0].to))inputs.set(o[0].to,[]);inputs.get(o[0].to).push(n);});
 function build(id,depth){if(visited.has(id))return {ref:id};visited.add(id);const run=[g.nodes.get(id)];let cur=id;
  while(single(cur)){const e=A.out.get(cur).find(x=>!x.back),nx=e.to;if(visited.has(nx)||A.inn.get(nx).filter(x=>!x.back).length!==1||e.label)break;visited.add(nx);run.push(g.nodes.get(nx));cur=nx;}
  const b={run,depth,kids:[],refs:[],loops:[]};blocks.push(b);run.forEach(r=>blockOf.set(r.id,b));
  A.out.get(cur).forEach(e=>{if(e.from===e.to)return;if(e.back){b.loops.push(e);return;}const ch=build(e.to,depth+1);if(ch.ref)b.refs.push({e,id:ch.ref});else b.kids.push({e,b:ch});});return b;}
 const rootB=build(root.id,0);A.order.forEach(n=>{if(!visited.has(n.id))build(n.id,0);});
 /* sizes */
 const cardOf=b=>{const title=b.run.length===1?b.run[0].label:b.run[0].label;const lines=b.run.length>1?b.run.slice(1).map(r=>({h:19,svg:(x,y)=>`<text x="${x}" y="${y}" ${C.F} font-size="12" fill="${t.ink}"><tspan fill="${r.status?C.col[r.status]:r.shape==='decision'?t.accent:t.mute}">${r.shape==='decision'?'◆':'●'}</tspan> ${esc(wrap(r.label,12,400,t.font,colW-50)[0])}</text>`})):[];
  const ins=(inputs.get(b.run[0].id)||[]).map(n=>({h:24,svg:(x,y)=>C.chip(x,y-14,`← ${n.label}`,n.status?C.col[n.status]:t.mute).svg}));
  const extra=[...ins,...lines,...b.refs.map(r=>({h:24,svg:(x,y)=>C.chip(x,y-14,`${r.e.label?r.e.label+' → ':'→ '}${g.nodes.get(r.id).label}`,r.e.label&&/^(no|fail)/i.test(r.e.label)?t.bad:t.mute).svg})),...b.loops.map(e=>({h:24,svg:(x,y)=>C.chip(x,y-14,`${e.label?e.label+': ':''}back to ${g.nodes.get(e.to).label}`,t.accent,{icon:'↺'}).svg}))];
  return o=>C.card(o.x,o.y,colW,{title,note:b.run.length===1?b.run[0].note:(b.run.length>1?`${b.run.length} steps`:''),status:b.run.length===1?b.run[0].status:null,decision:b.run.length===1&&b.run[0].shape==='decision',lines:extra});};
 blocks.forEach(b=>{b.draw=cardOf(b);b.h=b.draw({x:0,y:0}).h;});
 /* tidy layout: leaves stacked, parents centred on their children */
 let nextY=0;const place=b=>{if(!b.kids.length){b.y=nextY;nextY+=b.h+gapY;return;}b.kids.forEach(k=>place(k.b));const f=b.kids[0].b,l=b.kids[b.kids.length-1].b;b.y=Math.max((f.y+l.y+l.h)/2-b.h/2,f.y-b.h+20);if(b.y+b.h+gapY>nextY)nextY=b.y+b.h+gapY;};
 const roots=blocks.filter(b=>b.depth===0);roots.forEach(r=>{place(r);nextY+=gapY*2;});
 const hd=heading(C,opt,PAD,PAD),lg=legendRow(C,A,PAD,PAD+hd.h);const top=PAD+hd.h+(lg.w?30:0);const maxD=Math.max(...blocks.map(b=>b.depth));
 const W=PAD*2+(maxD+1)*colW+maxD*gapX,H=top+nextY+PAD;let o=hd.o+(lg.w?lg.o:''),edges='';
 blocks.forEach(b=>{b.x=PAD+b.depth*(colW+gapX);b.yy=top+b.y;});
 blocks.forEach(b=>{b.kids.forEach(({e,b:k})=>{const x0=b.x+colW,y0=b.yy+Math.min(b.h/2,26),x1=k.x,y1=k.yy+Math.min(k.h/2,26),mx=x0+18;const r=Math.min(10,Math.abs(y1-y0)/2);
  const d=Math.abs(y1-y0)<1?`M${x0} ${y0}H${x1}`:`M${x0} ${y0}H${mx-r}Q${mx} ${y0} ${mx} ${y0+(y1>y0?r:-r)}V${y1-(y1>y0?r:-r)}Q${mx} ${y1} ${mx+r} ${y1}H${x1-2}`;
  const c=e.label&&/^(yes|pass|approved|ok)/i.test(e.label)?t.good:e.label&&/^(no|fail)/i.test(e.label)?t.bad:C.line;edges+=`<path d="${d}" fill="none" stroke="${c}" stroke-width="1.6"${C.arrow()}/>`;
  if(e.label){const lw=measure(e.label,11.5,600,t.font)+16;const ch=C.chip(x1-lw-8,y1-24,e.label,c===C.line?t.mute:c);edges+=ch.svg;}});});
 blocks.forEach(b=>o+=b.draw({x:b.x,y:b.yy}).svg);
 return {svg:frame(C,W,H,opt,edges+o),width:W,height:H,notes:[{ok:true,text:`${blocks.length} cards: plain runs of steps folded together, every decision opens a new branch.`},{ok:true,text:'Where branches meet again, the tree says “→ go to” instead of drawing a crossing line.'}]};}

/* ---------- 5. capability map ---------- */
function capability(g,s,opt){const A=analyse(g),C=ctx(s,opt),t=C.t,PAD=40,colW=opt.colW||226,gap=20,perRow=Math.min(opt.perRow||5,A.secs.length);const W=PAD*2+perRow*colW+(perRow-1)*gap;
 let y=PAD,o='';const hd=heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;
 const all=statusCount(A.nodes),tot=A.nodes.length;if(all.good+all.bad+all.warn){const bw=W-PAD*2;o+=`<text x="${PAD}" y="${y+14}" ${C.F} font-size="14" fill="${t.ink}"><tspan font-weight="700">${all.good}</tspan> of ${tot} parts in place${all.warn?` · ${all.warn} partial`:''} · <tspan font-weight="700">${all.bad}</tspan> to build</text>`;
  y+=26;o+=`<rect x="${PAD}" y="${y}" width="${bw}" height="10" rx="5" fill="${alpha(t.bad,t.dark?.35:.25)}"/><rect x="${PAD}" y="${y}" width="${bw*all.good/tot}" height="10" rx="5" fill="${t.good}"/>${all.warn?`<rect x="${PAD+bw*all.good/tot}" y="${y}" width="${bw*all.warn/tot}" height="10" fill="${C.col.warn}"/>`:''}`;y+=30;}
 const lg=legendRow(C,A,PAD,y);if(lg.w){o+=lg.o;y+=30;}
 let rowTop=y;for(let r=0;r*perRow<A.secs.length;r++){const row=A.secs.slice(r*perRow,(r+1)*perRow);let maxH=0;
  row.forEach((sec,i)=>{const x=PAD+i*(colW+gap),c=statusCount(sec.steps),k=r*perRow+i;let yy=rowTop;const title=sec.loose?sec.steps[0].label:sec.title.replace(/^[\d–\-, ]+·\s*/,'');
   const chips=[];sec.steps.forEach(st=>{const lines=wrap(st.label,12,500,t.font,colW-42);chips.push({st,lines,h:lines.length*15+14});});
   const head=wrap(C.T(title),13.5,700,t.font,colW-40);const hh=head.length*17+(c.good+c.bad+c.warn?26:8)+14;const bodyH=chips.reduce((a,ch)=>a+ch.h+6,0)+10;const h=hh+bodyH;
   const panel=C.card(x,yy,colW,{title:'',minH:h,fill:t.dark?alpha('#FFFFFF',.04):t.neu?t.bg:t.frost?'rgba(255,255,255,.55)':C.surf});o+=panel.svg;
   o+=`<text x="${x+14}" y="${yy+22}" ${C.FM} font-size="11" font-weight="700" fill="${C.tint(k)}">${String(k+1).padStart(2,'0')}</text>`;head.forEach((l,j)=>o+=`<text x="${x+40}" y="${yy+22+j*17}" ${C.F} font-size="13.5" font-weight="700" fill="${t.ink}">${esc(l)}</text>`);
   let cy=yy+22+head.length*17;if(c.good+c.bad+c.warn){const bw=colW-28;o+=`<rect x="${x+14}" y="${cy}" width="${bw}" height="5" rx="2.5" fill="${alpha(t.bad,t.dark?.35:.22)}"/><rect x="${x+14}" y="${cy}" width="${bw*c.good/sec.steps.length}" height="5" rx="2.5" fill="${t.good}"/><text x="${x+colW-14}" y="${cy-6}" ${C.F} font-size="11" fill="${t.mute}" text-anchor="end">${c.good}/${sec.steps.length}</text>`;cy+=18;}else cy+=6;
   chips.forEach(({st,lines,h:ch})=>{const sc=st.status?C.col[st.status]:alpha(t.ink,.4),fillc=st.status?(t.dark?alpha(sc,.16):mix(sc,C.surf.startsWith('#')?C.surf:'#FFFFFF',.88)):(t.dark?alpha('#FFFFFF',.06):alpha(t.ink,.04));
    o+=`<rect x="${x+10}" y="${cy}" width="${colW-20}" height="${ch}" rx="${Math.min(t.nodeRadius,10)}" fill="${fillc}"${t.id==='brutal'?' stroke="#000" stroke-width="1.5"':''}/>`;
    const gl={good:'✓',bad:'✕',warn:'!',accent:'★'}[st.status]||'·';o+=`<text x="${x+22}" y="${cy+18}" ${C.F} font-size="12" font-weight="700" fill="${st.status?mix(sc,'#000000',t.dark?0:.15):t.mute}" text-anchor="middle">${gl}</text>`;
    lines.forEach((l,j)=>o+=`<text x="${x+34}" y="${cy+18+j*15}" ${C.F} font-size="12" font-weight="500" fill="${t.ink}">${esc(l)}</text>`);cy+=ch+6;});
   maxH=Math.max(maxH,h);});
  rowTop+=maxH+gap;}
 const H=rowTop+PAD-gap;return {svg:frame(C,W,H,opt,o),width:W,height:H,notes:[{ok:true,text:`${A.secs.length} stages, each with its steps as status chips and a progress bar.`},{ok:true,text:'No connectors: this view answers “what do we have?”; switch to Cycle or Stage columns for the flow.'}]};}

/* ---------- 6. mind map ---------- */
function mindmap(g,s,opt){const A=analyse(g),C=ctx(s,opt),t=C.t,PAD=40;const secs=A.secs,half=Math.ceil(secs.length/2),L=secs.slice(0,half),R=secs.slice(half);
 const leafH=22,secGap=22,secH=sec=>Math.max(44,sec.steps.length*leafH)+secGap;const hL=L.reduce((a,x)=>a+secH(x),0),hR=R.reduce((a,x)=>a+secH(x),0),bodyH=Math.max(hL,hR);
 const leafW=Math.max(...A.nodes.map(n=>measure(n.label,12.5,400,t.font)))+30,secW=200,cW=220;
 const W=PAD*2+2*(leafW+secW+60)+cW,hd=heading(C,opt,PAD,PAD),top=PAD+hd.h,H=top+bodyH+PAD;const cx=W/2,cy=top+bodyH/2;let o=hd.o,lines='';
 const side=(list,dir,total)=>{let y=cy-total/2;list.forEach(sec=>{const k=secs.indexOf(sec),col=C.tint(k),sh=secH(sec)-secGap,sy=y+sh/2,sx=cx+dir*(cW/2+60+secW/2);
   lines+=`<path d="M${cx+dir*cW/2} ${cy}C${cx+dir*(cW/2+40)} ${cy} ${sx-dir*(secW/2+40)} ${sy} ${sx-dir*secW/2} ${sy}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" opacity=".85"/>`;
   const title=sec.loose?sec.steps[0].label:sec.title.replace(/^[\d–\-, ]+·\s*/,'');const tl=wrap(C.T(title),13,700,t.font,secW-26);const bh=tl.length*16+18;
   const cd=C.card(sx-secW/2,sy-bh/2,secW,{title:'',minH:bh,fill:t.dark?alpha(col,.2):mix(col,C.surf.startsWith('#')?C.surf:'#FFFFFF',.85)});o+=cd.svg;tl.forEach((l,j)=>o+=`<text x="${sx}" y="${sy-bh/2+22+j*16}" ${C.F} font-size="13" font-weight="700" fill="${t.ink}" text-anchor="middle">${esc(l)}</text>`);
   if(!sec.loose)sec.steps.forEach((st,j)=>{const ly=sy-(sec.steps.length-1)*leafH/2+j*leafH,lx=sx+dir*(secW/2+40);lines+=`<path d="M${sx+dir*secW/2} ${sy}C${sx+dir*(secW/2+22)} ${sy} ${lx-dir*22} ${ly} ${lx} ${ly}" fill="none" stroke="${col}" stroke-width="1.3" opacity=".6"/>`;
    o+=`<circle cx="${lx}" cy="${ly}" r="4" fill="${st.status?C.col[st.status]:col}"/><text x="${lx+dir*10}" y="${ly+4}" ${C.F} font-size="12.5" fill="${t.ink}" text-anchor="${dir>0?'start':'end'}">${esc(st.label)}</text>`;});
   y+=secH(sec);});};
 side(L,-1,hL);side(R,1,hR);
 const ct=wrap(C.T(opt.title||'Overview'),15,700,t.font,cW-30);const chh=ct.length*19+24;const cc=C.card(cx-cW/2,cy-chh/2,cW,{title:'',minH:chh,fill:t.ink});o+=cc.svg;ct.forEach((l,j)=>o+=`<text x="${cx}" y="${cy-chh/2+28+j*19}" ${C.F} font-size="15" font-weight="700" fill="${t.dark?'#0B0F1A':'#FFFFFF'}" text-anchor="middle">${esc(l)}</text>`);
 return {svg:frame(C,W,H,opt,lines+o),width:W,height:H,notes:[{ok:true,text:`${secs.length} branches from the centre, ${A.nodes.length} leaves. An overview: the order of steps is not shown.`}]};}

/* ---------- recommendation ---------- */
function suggest(g){const A=analyse(g),n=A.nodes.length,dec=A.nodes.filter(x=>x.shape==='decision').length,grp=A.secs.filter(x=>!x.loose).length,st=A.nodes.filter(x=>x.status).length,loops=A.back.length,linear=A.nodes.filter(x=>A.inn.get(x.id).length<=1&&A.out.get(x.id).length<=1).length/n;
 const S=[];const add=(id,score,why)=>S.push({id,score,why});
 add('flow',(n<=14?60:n<=22?35:10)+(dec>=1?10:0)-(grp>=4?10:0),n<=14?'Short enough to read as one flowchart.':'Gets tall and tangled past about 15 steps.');
 add('stepper',(n>=12?55:30)+linear*25+(loops?5:0),`Numbers all ${n} steps in reading order; loops and branches become notes, not crossing lines.`);
 add('stages',(grp>=3?60:15)+(n>=15?15:0),grp>=3?`${grp} stages side by side, each with its steps stacked; the overview at a glance.`:'Works best with three or more subgraphs (stages).');
 add('cycle',(loops&&grp>=3?62:loops?35:5)+(grp>=4&&grp<=10?8:0),loops?'Your process loops back on itself; a ring shows that directly.':'Only useful when the process loops.');
 add('tree',(dec>=3?62:dec>=1?30:5)-(n>25?20:0),dec>=1?`${dec} decision${dec>1?'s':''}: a tree makes every branch a clear fork.`:'No decisions to branch on.');
 add('capability',(st/n>=.4?66:st?25:0),st?`${st} of ${n} steps carry a status; this shows what exists and what is missing per stage.`:'Needs :::have / :::dont statuses.');
 add('swimlanes',(grp>=2&&grp<=6&&n<=24?40:10),'Use when each subgraph is a team or owner, not a phase.');
 add('mindmap',(grp>=3?30:10),'An overview of everything, without the order.');
 return S.sort((a,b)=>b.score-a.score);}

const TYPES=[
 {id:'flow',name:'Flow',hint:'Top-down process with decisions'},
 {id:'stepper',name:'Step list',hint:'Numbered, long processes'},
 {id:'stages',name:'Stage columns',hint:'Phases side by side'},
 {id:'cycle',name:'Cycle',hint:'Processes that loop'},
 {id:'tree',name:'Decision tree',hint:'Many yes/no forks'},
 {id:'capability',name:'Capability map',hint:'What we have vs need'},
 {id:'swimlanes',name:'Swimlanes',hint:'Owners in lanes'},
 {id:'mindmap',name:'Mind map',hint:'Overview, no order'}];
function render(type,src,s,opt={}){const g=typeof src==='string'?window.FlowEngine.parse(src):src;if(window.DVFonts)window.DVFonts(s);
 if(!g.nodes.size)return window.FlowEngine.render(src,s,opt);
 if(type==='flow')return window.FlowEngine.render(src,s,opt);
 if(type==='swimlanes')return window.FlowEngine.render(src,s,{...opt,lanes:true,direction:opt.direction||'LR'});
 const f={stepper,stages,cycle,tree,capability,mindmap}[type]||stepper;return f(g,s,opt);}
window.FlowTypes={TYPES,render,suggest,analyse};
})();
