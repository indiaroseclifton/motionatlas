'use strict';
/* More diagram kinds for the diagram studio, registered into window.Diagrams next to roadmap, org chart, journey map
   and comparison matrix (dataviz/diagrams.js, unchanged): timeline, Gantt, radial mind map, Venn, 2×2 quadrant,
   pyramid, cycle, sequence, entity-relationship, network, kanban, SWOT, fishbone and process arrows.
   Each kind brings: a starter, a template or two, a schema for the studio's form editor, parse(text) and toText(data)
   for the text/outline import (Mermaid-like for sequence and ER), and render(data,style,opt) -> {svg,width,height,notes}.
   Drawn with the same kit as the flowchart layouts (FlowTypes.kit), so every style looks the same everywhere.
   Elements carry data-ref="list:index" so a click on the canvas opens that item in the editor; quadrant points also
   carry data-xy for dragging, with the plot box returned as box. */
(()=>{
const K=()=>window.FlowTypes.kit;
const PAD=40;
const L=v=>String(v??'').split(/\n|;\s*/).map(x=>x.trim()).filter(Boolean);
const STATUS={done:'good',now:'accent',doing:'accent',next:'muted',planned:'muted',risk:'bad',blocked:'bad'};
const ST_LABEL={done:'Done',now:'In progress',next:'Next',risk:'At risk'};
const isHex=h=>/^#[0-9a-f]{6}$/i.test(h);
function base(s,opt){const k=K(),C=k.ctx(s,opt),t=C.t;const surf=isHex(C.surf)?C.surf:(t.dark?'#161C2C':'#FFFFFF');
 const tintFill=(c,a=.86)=>t.dark?k.alpha(isHex(c)?c:'#888888',.2):k.mix(isHex(c)?c:'#888888',surf,a);
 const deep=c=>t.dark?t.ink:k.mix(isHex(c)?c:'#444444','#000000',.45);
 const tx=(x,y,s,o={})=>`<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" ${o.mono?C.FM:C.F} font-size="${o.size||12.5}" font-weight="${o.w||400}" fill="${o.fill||t.ink}"${o.anchor?` text-anchor="${o.anchor}"`:''}${o.ls?` letter-spacing="${o.ls}"`:''}${o.italic?' font-style="italic"':''}${o.halo?` paint-order="stroke" stroke="${surf}" stroke-width="4" stroke-linejoin="round"`:''}>${k.esc(o.raw?s:C.T(s))}</text>`;
 const multi=(x,y,s,size,w,max,lh,o={})=>{const ls=k.wrap(C.T(s),size,w,t.font,max).slice(0,o.max||4);return {svg:ls.map((l,i)=>`<text x="${x.toFixed(1)}" y="${(y+i*lh).toFixed(1)}" ${C.F} font-size="${size}" font-weight="${w}" fill="${o.fill||t.ink}"${o.anchor?` text-anchor="${o.anchor}"`:''}>${k.esc(l)}</text>`).join(''),h:ls.length*lh,n:ls.length};};
 const box=(x,y,w,h,o={})=>{const r=o.r??Math.min(t.nodeRadius||10,14,h/2,w/2);const d=`M${x+r} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${y+h-r}Q${x+w} ${y+h} ${x+w-r} ${y+h}H${x+r}Q${x} ${y+h} ${x} ${y+h-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`;let sv='';
  if(t.hardShadow&&!o.flat)sv+=`<path d="${d}" transform="translate(4 4)" fill="#000"/>`;const filt=o.flat?'':t.neu?` filter="url(#${C.uid}u)"`:t.softShadow?` filter="url(#${C.uid}s)"`:'';
  const fill=o.fill||(t.clay?`url(#${C.uid}cl)`:C.cardFill),stroke=o.stroke??(t.id==='brutal'?'#000':C.cardStroke);
  if(t.rough&&window.DVRough)sv+=`<path d="${d}" fill="${fill}"/><path d="${window.DVRough([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],Math.round(x*3+y),1.2,true)}" fill="none" stroke="${o.stroke||t.ink}" stroke-width="1.5"/>`;
  else sv+=`<path d="${d}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${o.sw||(t.id==='brutal'?2.5:t.stroke||1)}"`:''}${o.dash?` stroke-dasharray="${o.dash}"`:''}${filt}/>`;
  return sv;};
 const ref=(r,body,extra='')=>`<g data-ref="${r}"${extra}>${body}</g>`;
 return {...k,C,t,surf,tintFill,deep,tx,multi,box,ref};}
const done=(B,W,H,opt,body,notes,extra={})=>({svg:B.frame(B.C,Math.round(W),Math.round(H),opt,body),width:Math.round(W),height:Math.round(H),notes,...extra});
const pairSplit=(s,re=/\s+[—–-]\s+|\s*\|\s*/)=>{const i=s.search(re);if(i<0)return [s.trim(),''];const m=s.slice(i).match(re)[0];return [s.slice(0,i).trim(),s.slice(i+m.length).trim()];};

const KINDS=[];const add=k=>KINDS.push(k);

/* ---------- timeline / milestones ---------- */
add({id:'timeline',name:'Timeline',hint:'Milestones in date order',order:'x',
 icon:'<path d="M1 14h32"/><circle cx="6" cy="14" r="2.5" fill="currentColor"/><circle cx="17" cy="14" r="2.5"/><circle cx="28" cy="14" r="2.5"/><path d="M6 11V4M17 17v7M28 11V4"/>',
 starter:{title:'Channel milestones',subtitle:'2026, from first idea to first brand deal',data:{items:[{date:'Jan',label:'Concept and chef roster',note:'Four AI chefs, one kitchen',status:'done'},{date:'Mar',label:'Pipeline locked',note:'Identity, video model, upscaler',status:'done'},{date:'May',label:'Pilot episodes',note:'Four episodes, one per chef',status:'now'},{date:'Jul',label:'Weekly schedule',note:'Long-form plus Shorts',status:'next'},{date:'Sep',label:'Partner programme',note:'Monetisation threshold',status:'next'},{date:'Nov',label:'First brand deal',note:'Kitchenware sponsor',status:'risk'}]}},
 templates:[{name:'Product launch',title:'Launch plan',subtitle:'Eight weeks to public launch',data:{items:[{date:'Week 1',label:'Kick-off',status:'done'},{date:'Week 2',label:'Beta invites',status:'done'},{date:'Week 4',label:'Pricing set',status:'now'},{date:'Week 6',label:'Press embargo',status:'next'},{date:'Week 8',label:'Public launch',note:'Blog, email, socials',status:'next'}]}}],
 schema:{lists:[{k:'items',label:'Milestones',title:'label',add:{date:'',label:'New milestone',note:'',status:'next'},fields:[{k:'label',label:'Milestone'},{k:'date',label:'When',half:1},{k:'status',label:'Status',half:1,type:'select',options:[['done','Done'],['now','In progress'],['next','Next'],['risk','At risk']]},{k:'note',label:'Note'}]}]},
 help:'One milestone per line: <b>When | Milestone | note</b>. Add <b>(done)</b>, <b>(now)</b> or <b>(risk)</b> at the end.',
 parse(text){return {items:String(text).split('\n').map(l=>l.trim().replace(/^[-*•]\s*/,'')).filter(Boolean).map(l=>{let status='next';const m=l.match(/\((done|now|next|risk)\)\s*$/i);if(m){status=m[1].toLowerCase();l=l.slice(0,m.index).trim();}const p=l.split(/\s*\|\s*/);if(p.length===1){const [d,r]=pairSplit(l,/:\s+/);return r?{date:d,label:r,note:'',status}:{date:'',label:d,note:'',status};}return {date:p[0],label:p[1]||'',note:p.slice(2).join(' | '),status};})};},
 toText(d){return d.items.map(i=>[i.date,i.label,i.note].filter((x,j)=>j<2||x).join(' | ')+(i.status&&i.status!=='next'?` (${i.status})`:'')).join('\n');},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,multi,box,ref}=B;const items=d.items||[];const n=Math.max(1,items.length),cw=184,gap=24,W=Math.max(760,PAD*2+n*(cw+gap)-gap);let y=PAD,o='';
  const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;const used=[...new Set(items.map(i=>i.status))].filter(k=>ST_LABEL[k]);let lx=PAD;used.forEach(k=>{o+=`<circle cx="${lx+6}" cy="${y}" r="6" fill="${C.col[STATUS[k]]}"/>`+tx(lx+18,y+4,ST_LABEL[k],{size:12,fill:t.mute});lx+=40+B.measure(ST_LABEL[k],12,400,t.font);});if(used.length)y+=28;
  const cards=items.map(it=>{const lines=it.note?[]:[];const c=C.card(0,0,cw,{title:it.label,note:it.note});return c.h;});const maxH=Math.max(60,...cards);
  const axis=y+maxH+40,step=(W-PAD*2-cw)/Math.max(1,n-1);let tl=`<line x1="${PAD}" x2="${W-PAD}" y1="${axis}" y2="${axis}" stroke="${B.alpha(t.ink,.35)}" stroke-width="2"/>`;
  items.forEach((it,i)=>{const cx=n===1?W/2:PAD+cw/2+i*step,up=i%2===0,st=STATUS[it.status]||'muted',col=C.col[st];const h=cards[i];const cy=up?axis-30-h:axis+30;
   const c=C.card(cx-cw/2,cy,cw,{title:it.label,note:it.note,status:st==='muted'?undefined:st});
   o+=ref('items:'+i,`<line x1="${cx}" x2="${cx}" y1="${up?cy+h:axis+8}" y2="${up?axis-8:cy}" stroke="${B.alpha(t.ink,.3)}" stroke-width="1.4"/>`+c.svg+`<circle cx="${cx}" cy="${axis}" r="8" fill="${it.status==='next'?C.surf:col}" stroke="${col}" stroke-width="2.4"/>`+tx(cx,up?axis+24:axis-16,it.date||'',{size:12,w:700,anchor:'middle',fill:t.ink,halo:1}));});
  const H=axis+30+maxH+PAD;return done(B,W,H,opt,tl+o,[{ok:true,text:`${items.length} milestones, alternating above and below the line so labels never collide.`},{ok:true,text:'Status colours carry a glyph on each card, never colour alone.'}]);}});

/* ---------- Gantt with dependencies ---------- */
const ganttPlan=d=>{const ts=(d.tasks||[]).map((x,i)=>({...x,i,dur:Math.max(0,+x.dur||0)}));const byId=new Map(ts.filter(x=>x.id).map(x=>[String(x.id).trim(),x]));
 for(let it=0;it<ts.length+2;it++)ts.forEach(x=>{const deps=String(x.after||'').split(/[\s,]+/).filter(Boolean).map(i=>byId.get(i)).filter(Boolean);x.deps=deps;x.s=deps.length?Math.max(...deps.map(p=>(p.s??0)+p.dur)):Math.max(0,+x.start||0);});return ts;};
add({id:'gantt',name:'Gantt',hint:'Tasks over time with dependencies',order:'y',
 icon:'<path d="M1 3v24"/><rect x="3" y="4" width="12" height="4" rx="1" fill="currentColor" stroke="none"/><rect x="13" y="12" width="12" height="4" rx="1"/><rect x="21" y="20" width="10" height="4" rx="1"/><path d="M15 8v2h2M25 16v2h2"/>',
 starter:{title:'Pilot production plan',subtitle:'Weeks from kick-off; arrows show what waits on what',data:{unit:'Week',today:'4',tasks:[{id:'a',label:'Lock chef identities',group:'Pipeline',start:0,dur:2,progress:100},{id:'b',label:'Video model + upscaler',group:'Pipeline',after:'a',dur:2,progress:60},{id:'c',label:'Recipe research',group:'Content',start:0,dur:3,progress:100},{id:'d',label:'Scripts for 4 episodes',group:'Content',after:'c',dur:2,progress:30},{id:'e',label:'Render episodes',group:'Production',after:'b d',dur:3,progress:0},{id:'f',label:'Edit + sound',group:'Production',after:'e',dur:2,progress:0},{id:'g',label:'Pilot live',group:'Production',after:'f',dur:0,progress:0}]}},
 templates:[{name:'Website rebuild',title:'Website rebuild',subtitle:'Weeks',data:{unit:'Week',today:'',tasks:[{id:'r',label:'Research',group:'Discover',start:0,dur:2},{id:'w',label:'Wireframes',group:'Design',after:'r',dur:2},{id:'v',label:'Visual design',group:'Design',after:'w',dur:3},{id:'b',label:'Build',group:'Build',after:'w',dur:5},{id:'q',label:'QA',group:'Build',after:'b v',dur:1},{id:'l',label:'Launch',group:'Build',after:'q',dur:0}]}}],
 schema:{fields:[{k:'unit',label:'Time unit',half:1},{k:'today',label:'Today at',half:1}],lists:[{k:'tasks',label:'Tasks',title:'label',add:{id:'',label:'New task',group:'',start:0,dur:1,after:'',progress:0},fields:[{k:'label',label:'Task'},{k:'id',label:'ID',half:1},{k:'group',label:'Group',half:1},{k:'start',label:'Start',half:1,type:'number'},{k:'dur',label:'Length (0 = milestone)',half:1,type:'number'},{k:'after',label:'After (IDs)',half:1},{k:'progress',label:'% done',half:1,type:'number'}]}]},
 help:'Mermaid-like: <b>section Name</b>, then <b>Task :id, start, length</b> or <b>Task :id, after a b, length</b>. Length 0 is a milestone.',
 parse(text){const tasks=[];let group='',unit='Week';String(text).split('\n').forEach(raw=>{const l=raw.trim();if(!l||/^gantt$/i.test(l)||/^(title|dateformat|axisformat)\b/i.test(l))return;const u=l.match(/^unit\s+(.+)/i);if(u){unit=u[1];return;}const sm=l.match(/^section\s+(.+)/i);if(sm){group=sm[1].trim();return;}
  const m=l.match(/^(.*?)\s*:\s*(.*)$/);if(!m)return tasks.push({id:'',label:l,group,start:0,dur:1});const parts=m[2].split(',').map(x=>x.trim()).filter(x=>!/^(done|active|crit|milestone)$/i.test(x));const t={label:m[1].trim(),group,id:'',start:0,dur:1,after:'',progress:/\bdone\b/i.test(m[2])?100:/\bactive\b/i.test(m[2])?50:0};
  parts.forEach((p,i)=>{if(/^after\s+/i.test(p))t.after=p.replace(/^after\s+/i,'');else if(/^\d+(\.\d+)?\s*[a-z]*$/i.test(p)){const v=parseFloat(p);if(i===parts.length-1&&parts.length>1)t.dur=v;else t.start=v;}else if(i===0)t.id=p;});if(/milestone/i.test(m[2]))t.dur=0;tasks.push(t);});return {unit,today:'',tasks};},
 toText(d){let g=null,o=`unit ${d.unit||'Week'}\n`;(d.tasks||[]).forEach(t=>{if(t.group!==g){g=t.group;o+=`section ${g||'Tasks'}\n`;}o+=`  ${t.label} :${[t.id,t.after?'after '+t.after:String(t.start||0),String(t.dur??1)].filter(x=>x!=='').join(', ')}${+t.progress>=100?', done':''}\n`;});return o;},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;const ts=ganttPlan(d);const end=Math.max(1,...ts.map(x=>x.s+x.dur)),labW=Math.min(240,Math.max(150,...ts.map(x=>B.measure(x.label,12.5,600,t.font)+30)));
  const colW=Math.max(44,Math.min(90,700/end)),W=PAD*2+labW+end*colW+90;let y=PAD,o='';const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;const gx=PAD+labW,top=y+24,rh=34;
  for(let i=0;i<=end;i++){const x=gx+i*colW;o+=`<line x1="${x}" x2="${x}" y1="${top-4}" y2="${top+ts.length*rh+ (new Set(ts.map(x=>x.group)).size)*22}" stroke="${B.alpha(t.line,i%5?.25:.5)}" stroke-width="1"/>`;if(i<end)o+=tx(x+colW/2,top-10,`${i+1}`,{size:10.5,mono:1,fill:t.mute,anchor:'middle'});}
  o+=tx(gx-10,top-10,d.unit||'Week',{size:10.5,mono:1,fill:t.mute,anchor:'end'});
  let yy=top,g=null,gi=-1;const pos=new Map();let bars='';
  ts.forEach(x=>{if(x.group!==g){g=x.group;gi++;if(g){o+=tx(PAD,yy+15,String(g).toUpperCase(),{size:10.5,w:700,fill:t.mute,ls:1.2,mono:1,raw:1});yy+=22;}}
   const col=C.tint(gi),x0=gx+x.s*colW,w=x.dur*colW,cy=yy+rh/2;pos.set(x.i,{x0,x1:x0+w,cy});const pr=Math.max(0,Math.min(100,+x.progress||0));
   let b=tx(PAD+(g?10:0),cy+4.5,B.wrap(x.label,12.5,500,t.font,labW-20)[0],{size:12.5,w:500});
   if(x.dur===0)b+=`<path d="M${x0} ${cy-9}l9 9-9 9-9-9z" fill="${t.ink}"/>`+tx(x0+14,cy+4,x.label,{size:11.5,w:600,halo:1});
   else{b+=B.box(x0+2,cy-11,w-4,22,{fill:B.tintFill(col,.78),stroke:col,r:Math.min(7,(t.nodeRadius||8)),flat:1});if(pr)b+=`<rect x="${x0+2}" y="${cy+7}" width="${((w-4)*pr/100).toFixed(1)}" height="4" rx="2" fill="${col}"/>`;if(pr>=100)b+=tx(x0+10,cy+4,'✓',{size:11,w:700,fill:B.deep(col)});}
   bars+=ref('tasks:'+x.i,b);yy+=rh;});
  let arrows='';ts.forEach(x=>x.deps.forEach(p=>{const a=pos.get(p.i),b=pos.get(x.i);if(!a||!b)return;const sx=a.x1,sy=a.cy,ex=b.x0-(x.dur===0?10:2),ey=b.cy,mx=Math.max(sx+8,ex-12);
   arrows+=`<path d="M${sx} ${sy}H${mx-6}Q${mx} ${sy} ${mx} ${sy+(ey>sy?6:-6)}V${ey+(ey>sy?-6:6)}Q${mx} ${ey} ${mx+6} ${ey}H${ex}" fill="none" stroke="${B.alpha(t.ink,.55)}" stroke-width="1.3"${C.arrow('ink')}/>`;}));
  if(d.today!==''&&d.today!=null&&isFinite(+d.today)){const x=gx+(+d.today)*colW;o+=`<line x1="${x}" x2="${x}" y1="${top-4}" y2="${yy+4}" stroke="${t.accent}" stroke-width="2"/>`+B.box(x-24,yy+4,48,18,{fill:t.accent,stroke:'none',r:9,flat:1})+tx(x,yy+17,'Today',{size:10.5,w:700,fill:'#fff',anchor:'middle'});yy+=22;}
  const crit=ts.filter(x=>x.s+x.dur===end).map(x=>x.label);const H=yy+PAD;
  return done(B,W,H,opt,o+arrows+bars,[{ok:true,text:`${ts.length} tasks over ${end} ${String(d.unit||'week').toLowerCase()}s; dependencies push start dates automatically.`},{ok:true,text:`Finishes with ${crit.slice(0,2).join(' and ')}.`}]);}});

/* ---------- radial mind map ---------- */
add({id:'mindmap',name:'Mind map',hint:'Ideas radiating from one topic',order:'radial',
 icon:'<circle cx="17" cy="14" r="5"/><path d="M12 12L4 5M22 12l8-7M12 16l-8 7M22 16l8 7"/><circle cx="4" cy="5" r="2"/><circle cx="30" cy="5" r="2"/><circle cx="4" cy="23" r="2"/><circle cx="30" cy="23" r="2"/>',
 starter:{title:'',subtitle:'',data:{center:'AI cooking channel',branches:[{label:'Chefs',items:'Nonna Lucia\nChef Bastien\nBig Earl\nMei'},{label:'Formats',items:'Long-form recipe\nShorts\nLive cook-along'},{label:'Pipeline',items:'Identity lock\nVideo model\nUpscale\nApproval gate'},{label:'Growth',items:'Thumbnails\nCommunity replies\nCollabs'},{label:'Money',items:'Ad revenue\nSponsors\nRecipe book'}]}},
 templates:[{name:'Personal goals',title:'',data:{center:'2027 goals',branches:[{label:'Health',items:'Run a 10K\nSleep by 11'},{label:'Work',items:'Ship v2\nMentor two people'},{label:'Learning',items:'Spanish B1\nPottery'},{label:'Money',items:'Emergency fund\nPay off card'}]}}],
 schema:{fields:[{k:'center',label:'Central topic'}],lists:[{k:'branches',label:'Branches',title:'label',add:{label:'New branch',items:''},fields:[{k:'label',label:'Branch'},{k:'items',label:'Ideas, one per line',type:'textarea'}]}]},
 help:'An indented outline: the first line is the centre, lines indented once are branches, deeper lines are ideas.',
 parse(text){const ls=String(text).split('\n').filter(l=>l.trim());if(!ls.length)return {center:'Topic',branches:[]};const ind=l=>l.match(/^[\t ]*/)[0].replace(/\t/g,'  ').length;const clean=l=>l.trim().replace(/^[-*•]\s*/,'');
  const c0=ind(ls[0]);let center=clean(ls[0]),rest=ls.slice(1);const bi=rest.length?Math.min(...rest.map(ind)):0;if(rest.length&&bi<=c0){/* no centre line: every top line is a branch */rest=ls;center='Topic';}
  const levels=[...new Set(rest.map(ind))].sort((a,b)=>a-b);const br=[];rest.forEach(l=>{if(ind(l)===levels[0])br.push({label:clean(l),items:''});else if(br.length)br[br.length-1].items+=(br[br.length-1].items?'\n':'')+clean(l);});return {center,branches:br};},
 toText(d){return d.center+'\n'+(d.branches||[]).map(b=>'  '+b.label+'\n'+L(b.items).map(i=>'    '+i).join('\n')).join('\n');},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;const br=d.branches||[],n=Math.max(1,br.length);const leafMax=Math.max(1,...br.map(b=>L(b.items).length));
  const R1=Math.max(170,n*44),leafW=Math.max(90,...br.flatMap(b=>L(b.items).map(i=>B.measure(i,12,400,t.font)))),R2=R1+70,ext=R2+leafW+30;
  let y=PAD;const hd=B.heading(C,opt,PAD,y);y+=hd.h;const W=Math.max(760,ext*2+PAD*2),cx=W/2,cy=y+ext*.78+10,H=cy+ext*.78+PAD;let o=hd.o,lines='';
  br.forEach((b,i)=>{const a=-Math.PI/2+i*2*Math.PI/n,col=C.tint(i),bx=cx+Math.cos(a)*R1,by=cy+Math.sin(a)*R1*.78;const items=L(b.items);
   lines+=`<path d="M${cx} ${cy}Q${cx+Math.cos(a)*R1*.5} ${cy+Math.sin(a)*R1*.2} ${bx.toFixed(1)} ${by.toFixed(1)}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" opacity=".85"/>`;
   const bw=Math.min(190,B.measure(C.T(b.label),13,700,t.font)+30),bh=36;let g=B.box(bx-bw/2,by-bh/2,bw,bh,{fill:B.tintFill(col,.8),stroke:col})+tx(bx,by+4.5,B.wrap(C.T(b.label),13,700,t.font,bw-14)[0],{size:13,w:700,anchor:'middle',fill:B.deep(col),raw:1});
   const spread=Math.min(Math.PI*2/n*.8,.18*items.length+.1);const right=Math.cos(a)>=-.01;
   items.forEach((it,j)=>{const aa=a+(items.length>1?(j/(items.length-1)-.5)*spread:0),lx=cx+Math.cos(aa)*R2,ly=cy+Math.sin(aa)*R2*.78+(Math.abs(Math.cos(a))<.3?(j-(items.length-1)/2)*20:0);
    lines+=`<path d="M${bx.toFixed(1)} ${by.toFixed(1)}L${lx.toFixed(1)} ${ly.toFixed(1)}" stroke="${col}" stroke-width="1.3" opacity=".55"/>`;
    g+=`<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="4" fill="${col}"/>`+tx(lx+(right?9:-9),ly+4,it,{size:12,anchor:right?'start':'end',halo:1});});
   o+=ref('branches:'+i,g);});
  const cw=Math.min(240,B.measure(C.T(d.center||'Topic'),16,700,t.font)+40),ch=52;o+=ref('center:0',B.box(cx-cw/2,cy-ch/2,cw,ch,{fill:t.ink,stroke:'none',r:Math.min(26,t.nodeRadius*2||14)})+tx(cx,cy+5.5,B.wrap(C.T(d.center||'Topic'),16,700,t.font,cw-20)[0],{size:16,w:700,anchor:'middle',fill:t.dark?'#0B0F1A':'#FFFFFF',raw:1}));
  return done(B,W,H,opt,lines+o,[{ok:true,text:`${br.length} branches and ${br.reduce((a,b)=>a+L(b.items).length,0)} ideas around one topic, read clockwise from the top.`}]);}});

/* ---------- Venn ---------- */
add({id:'venn',name:'Venn',hint:'Two or three overlapping sets',order:'y',
 icon:'<circle cx="12" cy="14" r="9"/><circle cx="22" cy="14" r="9"/>',
 starter:{title:'What makes an episode work',subtitle:'Where the three things we test overlap',data:{sets:[{label:'Great recipe',items:'Real amounts\nUnder 30 min'},{label:'Strong chef',items:'Personality\nSignature line'},{label:'Visual hook',items:'Sizzle close-up\nPlating shot'}],ab:'Teaches a technique',ac:'Thumbnail writes itself',bc:'Clips well for Shorts',abc:'Episodes that grow the channel'}},
 templates:[{name:'Two sets',title:'Design meets engineering',data:{sets:[{label:'Design',items:'Research\nVisual systems'},{label:'Engineering',items:'Performance\nInfrastructure'}],ab:'Design systems\nPrototyping',ac:'',bc:'',abc:''}}],
 schema:{lists:[{k:'sets',label:'Sets (2 or 3)',title:'label',max:3,add:{label:'New set',items:''},fields:[{k:'label',label:'Set'},{k:'items',label:'Only in this set',type:'textarea'}]}],fields:[{k:'ab',label:'Sets 1 + 2',type:'textarea'},{k:'ac',label:'Sets 1 + 3',type:'textarea'},{k:'bc',label:'Sets 2 + 3',type:'textarea'},{k:'abc',label:'All three',type:'textarea'}]},
 help:'<b>A: Label</b>, <b>B: Label</b>, <b>C: Label</b> name the sets; <b>A: item</b> lines after that add items; <b>A&amp;B: text</b>, <b>A&amp;C</b>, <b>B&amp;C</b>, <b>A&amp;B&amp;C</b> fill the overlaps.',
 parse(text){const d={sets:[],ab:'',ac:'',bc:'',abc:''};const named={};String(text).split('\n').map(l=>l.trim()).filter(Boolean).forEach(l=>{const m=l.match(/^([ABC](?:\s*&\s*[ABC])*)\s*:\s*(.+)$/i);if(!m)return;const key=m[1].toLowerCase().replace(/[\s&]/g,'').split('').sort().join('');
  if(key.length===1){const i='abc'.indexOf(key);if(!named[key]){named[key]=1;d.sets[i]={label:m[2],items:''};}else d.sets[i].items+=(d.sets[i].items?'\n':'')+m[2];}else if(d[key]!=null)d[key]+=(d[key]?'\n':'')+m[2];});d.sets=d.sets.filter(Boolean);return d;},
 toText(d){const S='ABC';return (d.sets||[]).map((s,i)=>[`${S[i]}: ${s.label}`,...L(s.items).map(x=>`${S[i]}: ${x}`)].join('\n')).join('\n')+'\n'+[['ab','A&B'],['ac','A&C'],['bc','B&C'],['abc','A&B&C']].flatMap(([k,l])=>L(d[k]).map(x=>`${l}: ${x}`)).join('\n');},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;const sets=(d.sets||[]).slice(0,3),n=Math.max(2,sets.length);let y=PAD,o='';const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;
  const R=150,W=n===2?760:780,cx=W/2,cy=y+(n===2?R+40:R*1.32+44);const centres=n===2?[[cx-R*.62,cy],[cx+R*.62,cy]]:[[cx-R*.6,cy-R*.32],[cx+R*.6,cy-R*.32],[cx,cy+R*.62]];
  const blend=t.dark||!t.multiply?'':' style="mix-blend-mode:multiply"';
  sets.forEach((st,i)=>{const [x,yy]=centres[i],col=C.tint(i);o+=ref('sets:'+i,`<circle cx="${x}" cy="${yy}" r="${R}" fill="${col}" fill-opacity="${t.dark?.2:.16}" stroke="${col}" stroke-width="2"${blend}/>`);});
  const lab=(x,yy,text,max,o2={})=>{const ls=L(text).slice(0,4);return ls.map((l,j)=>B.wrap(C.T(l),12,o2.w||400,t.font,max).slice(0,2).map((w,k)=>({w,j,k}))).flat().map((q,i,a)=>tx(x,yy+(i-(a.length-1)/2)*15+4,q.w,{size:12,w:o2.w||400,anchor:'middle',raw:1,halo:1})).join('');};
  sets.forEach((st,i)=>{const [x,yy]=centres[i],ox=n===2?(i?1:-1)*R*.42:[[-.42,-.28],[.42,-.28],[0,.48]][i][0]*R,oy=n===2?0:[[-.42,-.28],[.42,-.28],[0,.48]][i][1]*R;const col=C.tint(i);
   const ty=n===3&&i===2?yy+R+24:yy-R-12;o+=ref('sets:'+i,tx(x,ty,st.label,{size:14,w:700,anchor:'middle',fill:B.deep(col)}));o+=lab(x+ox,yy+oy,st.items,R*.55);});
  if(n===2)o+=lab(cx,cy,d.ab,R*.55,{w:600});else{o+=lab((centres[0][0]+centres[1][0])/2,centres[0][1]-R*.36,d.ab,R*.5,{w:600})+lab((centres[0][0]+centres[2][0])/2-R*.18,(centres[0][1]+centres[2][1])/2+R*.12,d.ac,R*.42,{w:600})+lab((centres[1][0]+centres[2][0])/2+R*.18,(centres[1][1]+centres[2][1])/2+R*.12,d.bc,R*.42,{w:600})+lab(cx,cy-R*.02,d.abc,R*.42,{w:700});}
  const H=cy+R+(n===3?R*.62+52:40)+PAD;return done(B,W,H,opt,o,[{ok:sets.length>=2,text:sets.length>=2?`${sets.length} sets; the overlaps hold what they share.`:'A Venn needs at least two sets.'},{ok:true,text:'Circles are equal in size: this shows overlap, not quantity.'}]);}});

/* ---------- 2×2 quadrant ---------- */
add({id:'quadrant',name:'2×2 matrix',hint:'Items placed on two axes',order:'y',
 icon:'<rect x="2" y="2" width="30" height="24"/><path d="M17 2v24M2 14h30"/><circle cx="9" cy="8" r="2" fill="currentColor"/><circle cx="25" cy="19" r="2" fill="currentColor"/>',
 starter:{title:'What to make next',subtitle:'Drag the dots to re-score',data:{xLow:'Low effort',xHigh:'High effort',yLow:'Low impact',yHigh:'High impact',q1:'Quick wins',q2:'Big bets',q3:'Fill-ins',q4:'Money pits',items:[{label:'Shorts cut-downs',x:18,y:78},{label:'Recipe book',x:82,y:72},{label:'Live cook-along',x:66,y:58},{label:'Pinned recipe cards',x:12,y:62},{label:'New chef',x:88,y:40},{label:'Merch',x:72,y:18},{label:'Community polls',x:22,y:28}]}},
 templates:[{name:'Eisenhower',title:'This week',data:{xLow:'Not urgent',xHigh:'Urgent',yLow:'Not important',yHigh:'Important',q1:'Schedule',q2:'Do now',q3:'Drop',q4:'Delegate',items:[{label:'Quarterly plan',x:25,y:80},{label:'Client fix',x:85,y:85},{label:'Inbox',x:70,y:25},{label:'Old newsletter',x:15,y:15}]}}],
 schema:{fields:[{k:'xLow',label:'X axis, left',half:1},{k:'xHigh',label:'X axis, right',half:1},{k:'yLow',label:'Y axis, bottom',half:1},{k:'yHigh',label:'Y axis, top',half:1},{k:'q1',label:'Top-left',half:1},{k:'q2',label:'Top-right',half:1},{k:'q3',label:'Bottom-left',half:1},{k:'q4',label:'Bottom-right',half:1}],
  lists:[{k:'items',label:'Items (0–100 on each axis)',title:'label',add:{label:'New item',x:50,y:50},fields:[{k:'label',label:'Item'},{k:'x',label:'X',half:1,type:'number'},{k:'y',label:'Y',half:1,type:'number'}]}]},
 help:'One item per line: <b>Name | x | y</b> with x and y from 0 to 100. Lines like <b>x: Low effort → High effort</b> and <b>y: Low impact → High impact</b> set the axes.',
 parse(text){const d={xLow:'Low',xHigh:'High',yLow:'Low',yHigh:'High',q1:'',q2:'',q3:'',q4:'',items:[]};String(text).split('\n').map(l=>l.trim()).filter(Boolean).forEach(l=>{const ax=l.match(/^([xy])\s*:\s*(.+?)\s*(?:→|->|to)\s*(.+)$/i);if(ax){d[ax[1].toLowerCase()+'Low']=ax[2];d[ax[1].toLowerCase()+'High']=ax[3];return;}const q=l.match(/^(q[1-4])\s*:\s*(.+)$/i);if(q){d[q[1].toLowerCase()]=q[2];return;}const p=l.split(/\s*[|,]\s*/);d.items.push({label:p[0],x:Math.max(0,Math.min(100,+p[1]||50)),y:Math.max(0,Math.min(100,+p[2]||50))});});return d;},
 toText(d){return `x: ${d.xLow} → ${d.xHigh}\ny: ${d.yLow} → ${d.yHigh}\n`+['q1','q2','q3','q4'].filter(k=>d[k]).map(k=>`${k}: ${d[k]}`).join('\n')+'\n'+(d.items||[]).map(i=>`${i.label} | ${i.x} | ${i.y}`).join('\n');},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;let y=PAD,o='';const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;const S=520,x0=PAD+70,y0=y+10,W=x0+S+PAD+40,mid=S/2;
  [['q1',0,0],['q2',1,0],['q3',0,1],['q4',1,1]].forEach(([k,i,j],n)=>{const col=C.tint(n);o+=`<rect x="${x0+i*mid}" y="${y0+j*mid}" width="${mid}" height="${mid}" fill="${B.tintFill(col,t.dark?.86:.9)}"/>`;if(d[k])o+=tx(x0+i*mid+(i?mid-14:14),y0+j*mid+24,d[k],{size:13,w:700,fill:B.deep(col),anchor:i?'end':'start'});});
  o+=`<rect x="${x0}" y="${y0}" width="${S}" height="${S}" fill="none" stroke="${B.alpha(t.ink,.35)}"/><line x1="${x0+mid}" x2="${x0+mid}" y1="${y0}" y2="${y0+S}" stroke="${B.alpha(t.ink,.35)}"/><line x1="${x0}" x2="${x0+S}" y1="${y0+mid}" y2="${y0+mid}" stroke="${B.alpha(t.ink,.35)}"/>`;
  o+=tx(x0,y0+S+22,d.xLow||'',{size:12,fill:t.mute})+tx(x0+S,y0+S+22,(d.xHigh||'')+' →',{size:12,fill:t.mute,anchor:'end'});
  o+=`<text transform="translate(${x0-16} ${y0+S}) rotate(-90)" ${C.F} font-size="12" fill="${t.mute}">${B.esc(C.T(d.yLow||''))}</text><text transform="translate(${x0-16} ${y0}) rotate(-90)" ${C.F} font-size="12" fill="${t.mute}" text-anchor="end">${B.esc(C.T((d.yHigh||'')+' →'))}</text>`;
  const placed=[];(d.items||[]).forEach((it,i)=>{const px=x0+Math.max(0,Math.min(100,+it.x||0))/100*S,py=y0+S-Math.max(0,Math.min(100,+it.y||0))/100*S,w=B.measure(C.T(it.label),12.5,600,t.font);let ly=py-12;
   if(placed.some(p=>Math.abs(p[0]-px)<(w+p[2])/2+4&&Math.abs(p[1]-ly)<14))ly=py+22;placed.push([px,ly,w]);const right=px+w/2>x0+S-4,left=px-w/2<x0+4;
   o+=ref('items:'+i,`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="13" fill="transparent"/><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="8" fill="${t.accent}" stroke="${B.surf}" stroke-width="2.5"/>`+tx(right?px-12:left?px+12:px,ly,it.label,{size:12.5,w:600,anchor:right?'end':left?'start':'middle',halo:1}),` data-xy="items:${i}" style="cursor:move"`);});
  const H=y0+S+PAD+12;return done(B,W,H,opt,o,[{ok:true,text:`${(d.items||[]).length} items placed on two axes. Drag a dot on the canvas to move it.`}],{box:{x:x0,y:y0,w:S,h:S}});}});

/* ---------- pyramid / hierarchy ---------- */
add({id:'pyramid',name:'Pyramid',hint:'Levels that build on each other',order:'y',
 icon:'<path d="M17 2L32 26H2z"/><path d="M10 14h14M6 20h22"/>',
 starter:{title:'What a viewer needs, in order',subtitle:'Each level only works once the one below it does',data:{levels:[{label:'Loyalty',note:'Subscribes, turns on notifications'},{label:'Trust',note:'The recipe works at home'},{label:'Enjoyment',note:'The chef is fun to watch'},{label:'Attention',note:'The first three seconds hook'},{label:'Discovery',note:'The thumbnail gets the click'}]}},
 templates:[{name:'Content funnel',title:'Content hierarchy',data:{levels:[{label:'Hero',note:'One big piece a quarter'},{label:'Hub',note:'Weekly episodes'},{label:'Help',note:'Daily Shorts and answers'}]}}],
 schema:{lists:[{k:'levels',label:'Levels, top first',title:'label',add:{label:'New level',note:''},fields:[{k:'label',label:'Level'},{k:'note',label:'Note'}]}]},
 help:'One level per line, top first: <b>Level — note</b>.',
 parse(text){return {levels:String(text).split('\n').map(l=>l.trim().replace(/^[-*•\d.]+\s*/,'')).filter(Boolean).map(l=>{const [a,b]=pairSplit(l);return {label:a,note:b};})};},
 toText(d){return (d.levels||[]).map(l=>l.label+(l.note?' — '+l.note:'')).join('\n');},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;const lv=d.levels||[],n=Math.max(1,lv.length);let y=PAD,o='';const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;
  const PW=520,lh=Math.max(54,Math.min(76,380/n)),gap=6,noteW=280,W=PAD*2+PW+40+noteW,cx=PAD+PW/2;const seq=t.seq||[];
  lv.forEach((l,i)=>{const yt=y+i*(lh+gap),yb=yt+lh,wt=PW*(i/n)+(i?0:0),wb=PW*((i+1)/n);const col=seq.length?seq[Math.min(seq.length-1,Math.round((t.dark?i:(n-1-i))*(seq.length-1)/Math.max(1,n-1)))]:C.tint(i);
   const pts=i===0?`${cx},${yt} ${cx+wb/2},${yb} ${cx-wb/2},${yb}`:`${cx-wt/2},${yt} ${cx+wt/2},${yt} ${cx+wb/2},${yb} ${cx-wb/2},${yb}`;
   const lum=(()=>{if(!isHex(col))return .5;const c=[1,3,5].map(k=>parseInt(col.slice(k,k+2),16)/255);return .2126*c[0]+.7152*c[1]+.0722*c[2];})();const ink=lum>.45?(t.dark?'#0B0F1A':'#1A1A1A'):'#FFFFFF';
   let g=(t.hardShadow?`<polygon points="${pts}" transform="translate(4 4)" fill="#000"/>`:'')+`<polygon points="${pts}" fill="${col}"${t.id==='brutal'?' stroke="#000" stroke-width="2"':''}/>`;
   const tw=i===0?wb*.55:(wt+wb)/2-20;g+=tx(cx,yt+lh*(i===0?.7:.5)+5,B.wrap(C.T(l.label),14,700,t.font,Math.max(60,tw))[0],{size:i===0?13:14,w:700,anchor:'middle',fill:ink,raw:1});
   if(l.note){const ny=yt+lh/2;g+=`<line x1="${cx+wb/2+8}" x2="${PAD+PW+30}" y1="${ny}" y2="${ny}" stroke="${B.alpha(t.ink,.25)}" stroke-dasharray="2 3"/>`+B.multi(PAD+PW+40,ny-((Math.min(2,B.wrap(l.note,12.5,400,t.font,noteW).length)-1)*8)+4,l.note,12.5,400,noteW,16,{max:2,fill:t.ink}).svg;}
   o+=ref('levels:'+i,g);});
  const H=y+n*(lh+gap)+PAD;return done(B,W,H,opt,o,[{ok:true,text:`${lv.length} levels, widest at the base; shade deepens with each level.`}]);}});

/* ---------- cycle ---------- */
add({id:'cycle',name:'Cycle',hint:'Steps that repeat',order:'angle',
 icon:'<circle cx="17" cy="14" r="10"/><path d="M27 14l-3-3M27 14l3-3"/><circle cx="17" cy="4" r="2.5" fill="currentColor"/><circle cx="7" cy="14" r="2.5" fill="currentColor"/><circle cx="17" cy="24" r="2.5" fill="currentColor"/>',
 starter:{title:'The weekly episode loop',subtitle:'Every Monday it starts again',data:{center:'One episode a week',steps:[{label:'Pick the recipe',note:'From comments and search'},{label:'Generate the chef',note:'Locked identity, new scene'},{label:'Render + edit',note:'Approval gate before upload'},{label:'Publish everywhere',note:'Long-form, Shorts, Reels'},{label:'Read the numbers',note:'What held attention'}]}},
 templates:[{name:'Design sprint',title:'Design sprint',data:{center:'Five days',steps:[{label:'Understand'},{label:'Sketch'},{label:'Decide'},{label:'Prototype'},{label:'Test'}]}}],
 schema:{fields:[{k:'center',label:'In the middle'}],lists:[{k:'steps',label:'Steps, clockwise from the top',title:'label',add:{label:'New step',note:''},fields:[{k:'label',label:'Step'},{k:'note',label:'Note'}]}]},
 help:'One step per line, in order: <b>Step — note</b>. A line starting <b>centre:</b> sets the middle.',
 parse(text){const d={center:'',steps:[]};String(text).split('\n').map(l=>l.trim()).filter(Boolean).forEach(l=>{const c=l.match(/^cent(?:er|re)\s*:\s*(.+)/i);if(c){d.center=c[1];return;}const [a,b]=pairSplit(l.replace(/^[-*•\d.]+\s*/,''));d.steps.push({label:a,note:b});});return d;},
 toText(d){return (d.center?`centre: ${d.center}\n`:'')+(d.steps||[]).map(s=>s.label+(s.note?' — '+s.note:'')).join('\n');},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;const st=d.steps||[],n=Math.max(1,st.length);let y=PAD,o='';const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;
  const cw=200,R=Math.max(190,n*(cw+30)/(2*Math.PI)),cards=st.map(x=>C.card(0,0,cw,{title:x.label,note:x.note}).h),mh=Math.max(60,...cards);const W=Math.max(760,(R+cw/2+PAD)*2),cx=W/2,cy=y+R*.8+mh/2+10;let ring='';
  const P=i=>{const a=-Math.PI/2+i*2*Math.PI/n;return [cx+Math.cos(a)*R,cy+Math.sin(a)*R*.8];};
  for(let i=0;i<n&&n>1;i++){const a0=-Math.PI/2+i*2*Math.PI/n,a1=a0+2*Math.PI/n,pad=Math.min(.45,(cw*.62)/R);const s0=a0+pad,s1=a1-pad;if(s1<=s0)continue;const p=a=>[cx+Math.cos(a)*R,cy+Math.sin(a)*R*.8];const [x0,y0]=p(s0),[x1,y1]=p(s1);
   ring+=`<path d="M${x0.toFixed(1)} ${y0.toFixed(1)}A${R} ${R*.8} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${i===n-1?t.accent:B.alpha(t.ink,.5)}" stroke-width="2"${i===n-1?' stroke-dasharray="6 5"':''}${C.arrow(i===n-1?'loop':'ink')}/>`;}
  st.forEach((x,i)=>{const [px,py]=P(i);const c=C.card(px-cw/2,py-cards[i]/2,cw,{title:x.label,note:x.note,badge:String(i+1),badgeFill:C.tint(i)});o+=ref('steps:'+i,c.svg);});
  if(d.center)o+=ref('center:0',tx(cx,cy+5,d.center,{size:15,w:700,anchor:'middle'}));
  const H=cy+R*.8+mh/2+PAD;return done(B,W,H,opt,ring+o,[{ok:true,text:`${st.length} steps clockwise from the top; the dashed accent arrow is the loop closing.`}]);}});

/* ---------- sequence diagram ---------- */
add({id:'sequence',name:'Sequence',hint:'Messages between people or systems',order:'y',
 icon:'<rect x="1" y="1" width="9" height="5" rx="1"/><rect x="24" y="1" width="9" height="5" rx="1"/><path d="M5.5 6v21M28.5 6v21M6 11h20M28 18H8" /><path d="M24 9l3 2-3 2M10 16l-3 2 3 2"/>',
 starter:{title:'Publishing an episode',subtitle:'Who talks to whom, in order',data:{actors:[{name:'Producer'},{name:'Render farm'},{name:'Approval bot'},{name:'YouTube'}],messages:[{from:'Producer',to:'Render farm',text:'Render episode 12',type:'sync'},{from:'Render farm',to:'Approval bot',text:'Frames + audio ready',type:'sync'},{from:'Approval bot',to:'Approval bot',text:'Check identity lock',type:'sync'},{from:'Approval bot',to:'Producer',text:'Needs review: 2 shots',type:'reply'},{from:'Producer',to:'Approval bot',text:'Approved',type:'sync'},{from:'Approval bot',to:'YouTube',text:'Upload + schedule',type:'sync'},{from:'YouTube',to:'Producer',text:'Live at 18:00',type:'reply'},{from:'Producer',to:'',text:'Shorts cut follows next day',type:'note'}]}},
 templates:[{name:'Login flow',title:'Sign-in',data:{actors:[{name:'User'},{name:'App'},{name:'Auth'}],messages:[{from:'User',to:'App',text:'Email + password',type:'sync'},{from:'App',to:'Auth',text:'Verify',type:'sync'},{from:'Auth',to:'App',text:'Token',type:'reply'},{from:'App',to:'User',text:'Signed in',type:'reply'}]}}],
 schema:{lists:[{k:'actors',label:'Participants',title:'name',add:{name:'New'},fields:[{k:'name',label:'Name'}]},{k:'messages',label:'Messages, in order',title:'text',add:{from:'',to:'',text:'Message',type:'sync'},fields:[{k:'from',label:'From',half:1,type:'actor'},{k:'to',label:'To',half:1,type:'actor'},{k:'text',label:'Message'},{k:'type',label:'Kind',type:'select',options:[['sync','Call →'],['reply','Reply ⇢'],['note','Note']]}]}]},
 help:'Mermaid-like: <b>participant Name</b>, <b>A->>B: message</b>, <b>B-->>A: reply</b>, <b>Note over A: text</b>.',
 parse(text){const d={actors:[],messages:[]};const act=n=>{n=n.trim();if(n&&!d.actors.some(a=>a.name===n))d.actors.push({name:n});return n;};
  String(text).split('\n').map(l=>l.trim()).filter(l=>l&&!/^sequenceDiagram$/i.test(l)).forEach(l=>{let m=l.match(/^(?:participant|actor)\s+(?:\S+\s+as\s+)?(.+)$/i);if(m){act(m[1]);return;}
   m=l.match(/^note\s+(?:over|left of|right of)\s+([^:]+):\s*(.+)$/i);if(m){d.messages.push({from:act(m[1].split(',')[0]),to:'',text:m[2],type:'note'});return;}
   m=l.match(/^(.+?)\s*(-->>|->>|-->|->|-x|--x)\s*(.+?)\s*:\s*(.*)$/);if(m)d.messages.push({from:act(m[1]),to:act(m[3]),text:m[4],type:m[2].startsWith('--')?'reply':'sync'});});return d;},
 toText(d){return (d.actors||[]).map(a=>`participant ${a.name}`).join('\n')+'\n'+(d.messages||[]).map(m=>m.type==='note'?`Note over ${m.from}: ${m.text}`:`${m.from}${m.type==='reply'?'-->>':'->>'}${m.to}: ${m.text}`).join('\n');},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;const A=(d.actors||[]).map(a=>a.name);(d.messages||[]).forEach(m=>{[m.from,m.to].forEach(n=>{if(n&&!A.includes(n))A.push(n);});});const n=Math.max(1,A.length);
  let y=PAD,o='';const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;const colW=Math.max(170,...(d.messages||[]).map(m=>B.measure(m.text,12,500,t.font)+50)),W=PAD*2+n*colW,cx=i=>PAD+colW*(i+.5),top=y;
  const head=yy=>A.map((a,i)=>{const w=Math.min(colW-20,B.measure(C.T(a),13,700,t.font)+30);return ref('actors:'+i,B.box(cx(i)-w/2,yy,w,36,{fill:B.tintFill(C.tint(i),.82),stroke:C.tint(i)})+tx(cx(i),yy+22,a,{size:13,w:700,anchor:'middle',fill:B.deep(C.tint(i))}));}).join('');
  o+=head(top);let yy=top+64;let msgs='';
  (d.messages||[]).forEach((m,k)=>{const a=A.indexOf(m.from),b=A.indexOf(m.to);if(m.type==='note'||b<0){const x=cx(Math.max(0,a)),w=Math.min(colW*1.6,B.measure(m.text,12,400,t.font)+26);msgs+=ref('messages:'+k,B.box(x-w/2,yy-14,w,28,{fill:t.dark?B.alpha(C.col.warn,.18):B.mix(C.col.warn,'#FFFFFF',.85),stroke:B.alpha(C.col.warn,.6),r:4,flat:1})+tx(x,yy+4,m.text,{size:12,anchor:'middle',raw:0}));yy+=44;return;}
   const x0=cx(a),x1=cx(b),reply=m.type==='reply';let g;
   if(a===b){g=`<path d="M${x0} ${yy-6}h40v22h-34" fill="none" stroke="${t.ink}" stroke-width="1.4"${C.arrow('ink')}/>`+tx(x0+48,yy+8,m.text,{size:12,w:500});yy+=14;}
   else{g=`<path d="M${x0+(x1>x0?6:-6)} ${yy}H${x1+(x1>x0?-8:8)}" fill="none" stroke="${t.ink}" stroke-width="1.4"${reply?' stroke-dasharray="5 4"':''}${C.arrow('ink')}/>`+tx((x0+x1)/2,yy-7,m.text,{size:12,w:500,anchor:'middle',halo:1});}
   msgs+=ref('messages:'+k,`<text x="${PAD-6}" y="${yy+4}" ${C.FM} font-size="10" fill="${t.mute}" text-anchor="end">${k+1}</text>`+g);yy+=40;});
  const bottom=yy;let life='';A.forEach((_,i)=>life+=`<line x1="${cx(i)}" x2="${cx(i)}" y1="${top+36}" y2="${bottom}" stroke="${B.alpha(t.ink,.3)}" stroke-width="1.2" stroke-dasharray="3 4"/>`);
  const H=bottom+PAD;return done(B,W,H,opt,life+o+msgs,[{ok:true,text:`${A.length} participants and ${(d.messages||[]).length} messages, numbered top to bottom.`},{ok:true,text:'Calls are solid, replies dashed, notes sit on a pale band.'}]);}});

/* ---------- entity relationship / table schema ---------- */
const parseFields=v=>L(v).map(l=>{const p=l.split(/\s+/);const keys=p.filter(x=>/^(PK|FK|UK)$/i.test(x)).map(x=>x.toUpperCase());const rest=p.filter(x=>!/^(PK|FK|UK)$/i.test(x));let type='',name=rest[0]||'';if(rest.length>1&&/^(int|integer|bigint|text|string|varchar|uuid|date|datetime|timestamp|bool|boolean|float|decimal|json|money|number)\b/i.test(rest[0])){type=rest[0];name=rest[1];}else if(rest.length>1)type=rest.slice(1).join(' ');return {name,type,keys};});
add({id:'er',name:'Entity relationship',hint:'Tables and how they relate',order:'y',
 icon:'<rect x="1" y="2" width="12" height="12" rx="1"/><path d="M1 6h12"/><rect x="21" y="13" width="12" height="13" rx="1"/><path d="M21 17h12M13 8h4v11h4M19 17l2 2-2 2"/>',
 starter:{title:'Channel data model',subtitle:'What the publishing pipeline stores',data:{tables:[{name:'Chef',fields:'id PK uuid\nname text\ncuisine text\nidentity_ref text'},{name:'Episode',fields:'id PK uuid\nchef_id FK uuid\ntitle text\nstatus text\npublished_at timestamp'},{name:'Render',fields:'id PK uuid\nepisode_id FK uuid\nmodel text\napproved bool'},{name:'Post',fields:'id PK uuid\nepisode_id FK uuid\nplatform text\nurl text'},{name:'Metric',fields:'post_id FK uuid\nday date\nviews int\nretention float'}],rels:[{from:'Chef',to:'Episode',card:'1-n',label:'hosts'},{from:'Episode',to:'Render',card:'1-n',label:'has'},{from:'Episode',to:'Post',card:'1-n',label:'published as'},{from:'Post',to:'Metric',card:'1-n',label:'tracks'}]}},
 templates:[{name:'Shop',title:'Shop schema',data:{tables:[{name:'Customer',fields:'id PK int\nemail text'},{name:'Order',fields:'id PK int\ncustomer_id FK int\ntotal money'},{name:'Item',fields:'order_id FK int\nproduct_id FK int\nqty int'},{name:'Product',fields:'id PK int\nname text\nprice money'}],rels:[{from:'Customer',to:'Order',card:'1-n',label:'places'},{from:'Order',to:'Item',card:'1-n',label:'contains'},{from:'Product',to:'Item',card:'1-n',label:'in'}]}}],
 schema:{lists:[{k:'tables',label:'Tables',title:'name',add:{name:'Table',fields:'id PK int'},fields:[{k:'name',label:'Table'},{k:'fields',label:'Fields: name type PK/FK, one per line',type:'textarea'}]},{k:'rels',label:'Relationships',title:'label',add:{from:'',to:'',card:'1-n',label:''},fields:[{k:'from',label:'From',half:1,type:'table'},{k:'to',label:'To',half:1,type:'table'},{k:'card',label:'Cardinality',half:1,type:'select',options:[['1-1','one to one'],['1-n','one to many'],['n-n','many to many']]},{k:'label',label:'Label',half:1}]}]},
 help:'Mermaid-like: <b>TABLE { type name PK }</b> blocks and lines like <b>A ||--o{ B : label</b> (one to many), <b>A ||--|| B</b> (one to one), <b>A }o--o{ B</b> (many to many).',
 parse(text){const d={tables:[],rels:[]};let cur=null;String(text).split('\n').map(l=>l.trim()).filter(l=>l&&!/^erDiagram$/i.test(l)).forEach(l=>{if(cur){if(l.startsWith('}')){cur=null;return;}const p=l.split(/\s+/);cur.fields+=(cur.fields?'\n':'')+(p.length>1&&/^[a-z]/i.test(p[0])?[p[1],p[0],...p.slice(2)].join(' '):l);return;}
  let m=l.match(/^([\w-]+)\s*\{\s*$/);if(m){cur=d.tables.find(x=>x.name===m[1]);if(!cur){cur={name:m[1],fields:''};d.tables.push(cur);}return;}
  m=l.match(/^([\w-]+)\s+([|}o]{1,2})(--|\.\.)([|{o]{1,2})\s+([\w-]+)\s*(?::\s*"?(.*?)"?)?$/);if(m){const many=x=>/[{}]/.test(x);const card=many(m[2])&&many(m[4])?'n-n':many(m[4])?'1-n':many(m[2])?'n-1':'1-1';const r=card==='n-1'?{from:m[5],to:m[1],card:'1-n'}:{from:m[1],to:m[5],card};r.label=m[6]||'';d.rels.push(r);[m[1],m[5]].forEach(n=>{if(!d.tables.some(x=>x.name===n))d.tables.push({name:n,fields:''});});}});return d;},
 toText(d){return (d.tables||[]).map(x=>`${x.name} {\n${parseFields(x.fields).map(f=>`  ${f.type||'text'} ${f.name}${f.keys.length?' '+f.keys.join(' '):''}`).join('\n')}\n}`).join('\n')+'\n'+(d.rels||[]).map(r=>`${r.from} ${r.card==='n-n'?'}o--o{':r.card==='1-1'?'||--||':'||--o{'} ${r.to} : ${r.label||''}`).join('\n');},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;const T=d.tables||[],n=Math.max(1,T.length);let y=PAD,o='';const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;
  const tw=230,cols=Math.min(n,n<=4?n:Math.ceil(Math.sqrt(n*1.6))),gx=90,gy=60,rowH=22;const F=T.map(x=>parseFields(x.fields));const hs=F.map(f=>40+Math.max(1,f.length)*rowH+8);
  const rows=Math.ceil(n/cols),rowTop=[];let yy=y+10;for(let r=0;r<rows;r++){rowTop.push(yy);yy+=Math.max(...hs.slice(r*cols,r*cols+cols))+gy;}
  const W=PAD*2+cols*tw+(cols-1)*gx,pos=new Map();
  T.forEach((x,i)=>{const r=Math.floor(i/cols),c=i%cols,rowN=Math.min(cols,n-r*cols),off=(cols-rowN)*(tw+gx)/2,px=PAD+off+c*(tw+gx),py=rowTop[r],h=hs[i],col=C.tint(i);pos.set(x.name,{x:px,y:py,w:tw,h,i});
   let g=B.box(px,py,tw,h,{})+`<path d="M${px} ${py+34}H${px+tw}" stroke="${B.alpha(t.line,.6)}"/>`+`<rect x="${px+1}" y="${py+1}" width="${tw-2}" height="33" rx="${Math.min(t.nodeRadius||8,10)}" fill="${B.tintFill(col,.82)}"/><rect x="${px+1}" y="${py+20}" width="${tw-2}" height="14" fill="${B.tintFill(col,.82)}"/>`+tx(px+14,py+22,x.name,{size:13.5,w:700,fill:B.deep(col)});
   F[i].forEach((f,k)=>{const fy=py+40+k*rowH+15;g+=(f.keys.length?tx(px+14,fy,f.keys.join(' '),{size:9.5,w:700,mono:1,fill:f.keys.includes('PK')?t.accent:t.mute,raw:1}):'')+tx(px+44,fy,f.name,{size:12,w:f.keys.includes('PK')?700:400,raw:1})+tx(px+tw-12,fy,f.type,{size:11,mono:1,fill:t.mute,anchor:'end',raw:1});});
   o+=ref('tables:'+i,g);});
  let lines='';(d.rels||[]).forEach((r,k)=>{const a=pos.get(r.from),b=pos.get(r.to);if(!a||!b)return;const acx=a.x+a.w/2,acy=a.y+a.h/2,bcx=b.x+b.w/2,bcy=b.y+b.h/2;let p0,p1,horiz;
   if(Math.abs(a.y-b.y)<10||(Math.abs(acx-bcx)>a.w+20&&!(a.y+a.h<b.y||b.y+b.h<a.y))){horiz=true;p0=[acx<bcx?a.x+a.w:a.x,Math.min(acy,a.y+60)];p1=[acx<bcx?b.x:b.x+b.w,Math.min(bcy,b.y+60)];}else{horiz=false;p0=[acx,acy<bcy?a.y+a.h:a.y];p1=[bcx,acy<bcy?b.y:b.y+b.h];}
   const path=horiz?`M${p0[0]} ${p0[1]}C${(p0[0]+p1[0])/2} ${p0[1]} ${(p0[0]+p1[0])/2} ${p1[1]} ${p1[0]} ${p1[1]}`:`M${p0[0]} ${p0[1]}C${p0[0]} ${(p0[1]+p1[1])/2} ${p1[0]} ${(p0[1]+p1[1])/2} ${p1[0]} ${p1[1]}`;
   const foot=(p,dirx,diry,many)=>{const [x,y]=p;if(!many)return `<path d="M${x+dirx*8-diry*6} ${y+diry*8-dirx*6}l${diry*12} ${dirx*12}M${x+dirx*12-diry*6} ${y+diry*12-dirx*6}l${diry*12} ${dirx*12}" stroke="${t.ink}" stroke-width="1.4"/>`;return `<path d="M${x+dirx*12} ${y+diry*12}L${x-diry*7} ${y-dirx*7}M${x+dirx*12} ${y+diry*12}L${x} ${y}M${x+dirx*12} ${y+diry*12}L${x+diry*7} ${y+dirx*7}" stroke="${t.ink}" stroke-width="1.4" fill="none"/>`;};
   const d0=horiz?[p1[0]>p0[0]?1:-1,0]:[0,p1[1]>p0[1]?1:-1];lines+=ref('rels:'+k,`<path d="${path}" fill="none" stroke="${B.alpha(t.ink,.6)}" stroke-width="1.4"/>`+foot(p0,d0[0],d0[1],r.card==='n-n')+foot(p1,-d0[0],-d0[1],r.card!=='1-1')+(r.label?tx((p0[0]+p1[0])/2,(p0[1]+p1[1])/2-6,r.label,{size:11.5,w:600,fill:t.mute,anchor:'middle',halo:1}):''));});
  const H=yy-gy+PAD;return done(B,W,H,opt,lines+o,[{ok:true,text:`${T.length} tables, ${(d.rels||[]).length} relationships. Crow's feet mark the “many” end.`},{ok:true,text:'Primary keys are bold with a PK tag; foreign keys are tagged FK.'}]);}});

/* ---------- network graph ---------- */
add({id:'network',name:'Network',hint:'Who or what connects to what',order:'radial',
 icon:'<circle cx="6" cy="6" r="3"/><circle cx="28" cy="8" r="3"/><circle cx="17" cy="16" r="3.5" fill="currentColor"/><circle cx="7" cy="24" r="3"/><circle cx="27" cy="24" r="3"/><path d="M8 8l7 6M26 10l-7 5M9 22l6-4M25 22l-6-4"/>',
 starter:{title:'Who the channel works with',subtitle:'Line weight is how often we talk',data:{links:'Channel -- Render studio : weekly\nChannel -- Sound designer\nChannel -- Kitchenware sponsor : contract\nChannel -- Recipe researcher : daily\nRecipe researcher -- Food stylist\nRender studio -- Upscaler vendor\nRender studio -- Sound designer\nChannel -- Shorts editor : daily\nShorts editor -- Community manager\nCommunity manager -- Fan club',groups:'Channel: core\nRecipe researcher: core\nShorts editor: core\nCommunity manager: core\nRender studio: vendor\nUpscaler vendor: vendor\nSound designer: vendor\nKitchenware sponsor: partner\nFan club: partner\nFood stylist: vendor'}},
 templates:[{name:'Service map',title:'Services',data:{links:'Web -- API\nAPI -- Auth\nAPI -- Database\nAPI -- Queue\nQueue -- Worker\nWorker -- Database\nWorker -- Email',groups:'Web: edge\nAPI: core\nAuth: core\nDatabase: data\nQueue: data\nWorker: core\nEmail: external'}}],
 schema:{fields:[{k:'links',label:'Links: A -- B : label, one per line',type:'textarea',code:1},{k:'groups',label:'Groups: Node: group (colours)',type:'textarea',code:1}]},
 help:'One link per line: <b>A -- B</b>, optionally <b>: label</b>. Use <b>A -&gt; B</b> for a direction. Groups: <b>Node: group</b>.',
 parse(text){const ls=String(text).split('\n').map(l=>l.trim()).filter(Boolean);return {links:ls.filter(l=>/--|->/.test(l)).join('\n'),groups:ls.filter(l=>!/--|->/.test(l)&&/:/.test(l)).join('\n')};},
 toText(d){return d.links+'\n'+d.groups;},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;const links=L(d.links).map(l=>{const m=l.match(/^(.+?)\s*(--|->|<->)\s*([^:]+?)\s*(?::\s*(.*))?$/);return m?{a:m[1].trim(),b:m[3].trim(),dir:m[2]==='->',label:m[4]||''}:null;}).filter(Boolean);
  const gmap=new Map(L(d.groups).map(l=>{const [a,b]=l.split(/\s*:\s*/);return [a,b||''];}));const names=[...new Set(links.flatMap(l=>[l.a,l.b]))];const groups=[...new Set(names.map(n=>gmap.get(n)||''))];
  let y=PAD,o='';const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;if(groups.filter(Boolean).length>1){let lx=PAD;groups.forEach((g,i)=>{if(!g)return;o+=`<circle cx="${lx+6}" cy="${y}" r="6" fill="${C.tint(i)}"/>`+tx(lx+18,y+4,g,{size:12,fill:t.mute});lx+=40+B.measure(g,12,400,t.font);});y+=28;}
  const deg=new Map(names.map(n=>[n,0]));links.forEach(l=>{deg.set(l.a,deg.get(l.a)+1);deg.set(l.b,deg.get(l.b)+1);});
  /* force layout, seeded so the picture is stable */
  const W=Math.max(820,Math.min(1200,names.length*80)),Hh=Math.max(440,Math.min(760,names.length*48)),rnd=window.DVRand?window.DVRand(names.length*31+links.length):Math.random;
  const P=names.map((n,i)=>({n,x:W/2+Math.cos(i*2.4)*Hh*.3+rnd()*10,y:y+Hh/2+Math.sin(i*2.4)*Hh*.3+rnd()*10,vx:0,vy:0}));const ix=new Map(P.map((p,i)=>[p.n,i]));const k=Math.sqrt((W-200)*(Hh-60)/Math.max(1,names.length))*.75;
  for(let it=0;it<400;it++){const temp=(1-it/400)*30+1;P.forEach(p=>{p.dx=0;p.dy=0;});for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j];let dx=a.x-b.x,dy=a.y-b.y,dd=Math.hypot(dx,dy)||.01;const f=k*k/dd;a.dx+=dx/dd*f;a.dy+=dy/dd*f;b.dx-=dx/dd*f;b.dy-=dy/dd*f;}
   links.forEach(l=>{const a=P[ix.get(l.a)],b=P[ix.get(l.b)];const dx=a.x-b.x,dy=a.y-b.y,dd=Math.hypot(dx,dy)||.01,f=dd*dd/k;a.dx-=dx/dd*f;a.dy-=dy/dd*f;b.dx+=dx/dd*f;b.dy+=dy/dd*f;});
   P.forEach(p=>{p.dx+=(W/2-p.x)*.02*k/10;p.dy+=(y+Hh/2-p.y)*.02*k/10;const dl=Math.hypot(p.dx,p.dy)||1;p.x+=p.dx/dl*Math.min(dl,temp);p.y+=p.dy/dl*Math.min(dl,temp);p.x=Math.max(PAD+150,Math.min(W-PAD-150,p.x));p.y=Math.max(y+30,Math.min(y+Hh-30,p.y));});}
  for(let it=0;it<80;it++)for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j],dx=a.x-b.x,dy=a.y-b.y,dd=Math.hypot(dx,dy)||.01;if(dd<96&&Math.abs(dy)<34){const push=(96-dd)/2;a.x+=dx/dd*push;b.x-=dx/dd*push;a.y+=(dy>=0?1:-1)*6;b.y-=(dy>=0?1:-1)*6;[a,b].forEach(p=>{p.x=Math.max(PAD+150,Math.min(W-PAD-150,p.x));p.y=Math.max(y+30,Math.min(y+Hh-30,p.y));});}}
  const rad=n=>8+Math.min(14,(deg.get(n)||1)*2.4);let ln='';
  links.forEach((l,i)=>{const a=P[ix.get(l.a)],b=P[ix.get(l.b)],dx=b.x-a.x,dy=b.y-a.y,dd=Math.hypot(dx,dy)||1,ra=rad(l.a)+3,rb=rad(l.b)+5;
   ln+=`<path d="M${(a.x+dx/dd*ra).toFixed(1)} ${(a.y+dy/dd*ra).toFixed(1)}L${(b.x-dx/dd*rb).toFixed(1)} ${(b.y-dy/dd*rb).toFixed(1)}" stroke="${B.alpha(t.ink,.4)}" stroke-width="${l.label?2:1.4}"${l.dir?C.arrow('ink'):''}/>`;
   if(l.label)ln+=tx((a.x+b.x)/2,(a.y+b.y)/2-4,l.label,{size:10.5,fill:t.mute,anchor:'middle',halo:1});});
  P.forEach((p,i)=>{const g=groups.indexOf(gmap.get(p.n)||''),col=C.tint(Math.max(0,g)),r=rad(p.n),right=p.x<W/2;o+=ref('node:'+i,`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r.toFixed(1)}" fill="${col}" stroke="${B.surf}" stroke-width="2.5"/>`+tx(p.x+(right?-(r+6):r+6),p.y+4,p.n,{size:12,w:deg.get(p.n)>2?700:500,anchor:right?'end':'start',halo:1}));});
  const hub=names.slice().sort((a,b)=>deg.get(b)-deg.get(a))[0];const H=y+Hh+PAD;return done(B,W,H,opt,ln+o,[{ok:true,text:`${names.length} nodes and ${links.length} links. ${hub?`${hub} is the hub with ${deg.get(hub)} connections.`:''}`},{ok:true,text:'Node size follows the number of connections; colour follows the group.'}]);}});

/* ---------- kanban snapshot ---------- */
add({id:'kanban',name:'Kanban',hint:'Work by stage, right now',order:'cols',
 icon:'<rect x="1" y="2" width="9" height="24" rx="1"/><rect x="12.5" y="2" width="9" height="24" rx="1"/><rect x="24" y="2" width="9" height="24" rx="1"/><rect x="3" y="5" width="5" height="4" fill="currentColor"/><rect x="14.5" y="5" width="5" height="4" fill="currentColor"/><rect x="14.5" y="11" width="5" height="4"/>',
 starter:{title:'Episode board',subtitle:'Snapshot, Monday',data:{columns:[{name:'Ideas',wip:'',cards:'Miso butter corn #recipe\nLemon tart #recipe\nCollab with a baker #growth'},{name:'Scripting',wip:'2',cards:'Scallion pancakes #recipe @Kai\nSunday ragù #recipe @Kai'},{name:'Rendering',wip:'2',cards:'Brisket at dawn #episode @Lena\nMapo tofu #episode @Lena\nOnion soup #episode @Marco !'},{name:'Review',wip:'',cards:'Cacio e pepe #episode @Sam'},{name:'Live',wip:'',cards:'Pilot 1 #episode\nPilot 2 #episode'}]}},
 templates:[{name:'Sprint board',title:'Sprint 14',data:{columns:[{name:'To do',cards:'Search filters #feature\nError states #design'},{name:'Doing',wip:'3',cards:'Billing page #feature @Ana\nOnboarding copy #content @Ben'},{name:'Done',cards:'Login fix #bug'}]}}],
 schema:{lists:[{k:'columns',label:'Columns',title:'name',add:{name:'Column',wip:'',cards:''},fields:[{k:'name',label:'Column',half:1},{k:'wip',label:'WIP limit',half:1},{k:'cards',label:'Cards, one per line (#tag @owner, ! = blocked)',type:'textarea'}]}]},
 help:'<b>## Column</b> starts a column (add <b>(3)</b> for a WIP limit); each line under it is a card. <b>#tag</b>, <b>@owner</b> and a trailing <b>!</b> for blocked.',
 parse(text){const cols=[];String(text).split('\n').forEach(raw=>{const l=raw.trim();if(!l)return;const h=l.match(/^#{1,3}\s+(.+?)(?:\s*\((\d+)\))?$/);if(h){cols.push({name:h[1],wip:h[2]||'',cards:''});return;}if(!cols.length)cols.push({name:'To do',wip:'',cards:''});const c=cols[cols.length-1];c.cards+=(c.cards?'\n':'')+l.replace(/^[-*•]\s*/,'');});return {columns:cols};},
 toText(d){return (d.columns||[]).map(c=>`## ${c.name}${c.wip?` (${c.wip})`:''}\n`+L(c.cards).map(x=>'- '+x).join('\n')).join('\n');},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;const cols=d.columns||[],n=Math.max(1,cols.length),cw=210,gap=16,W=PAD*2+n*cw+(n-1)*gap;let y=PAD,o='';const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;
  const tags=[...new Set(cols.flatMap(c=>L(c.cards).flatMap(x=>(x.match(/#[\w-]+/g)||[]))))];let maxB=y;
  cols.forEach((c,i)=>{const x=PAD+i*(cw+gap),cards=L(c.cards),over=c.wip&&cards.length>+c.wip;let yy=y+44;let g='';
   cards.forEach((raw,j)=>{const tg=(raw.match(/#[\w-]+/g)||[]),own=(raw.match(/@[\w-]+/g)||[])[0],blocked=/!\s*$/.test(raw),title=raw.replace(/#[\w-]+|@[\w-]+|!\s*$/g,'').trim();
    const lines=[];if(tg.length||own)lines.push({h:24,svg:(lx,ly)=>{let sv='',xx=lx;tg.forEach(tag=>{const ch=C.chip(xx,ly-12,tag.slice(1),C.tint(tags.indexOf(tag)));sv+=ch.svg;xx+=ch.w+4;});if(own)sv+=tx(lx+cw-36,ly+2,own,{size:11,fill:t.mute,anchor:'end',raw:1});return sv;}});
    const cd=C.card(x+8,yy,cw-16,{title,size:12.5,status:blocked?'bad':undefined,lines});g+=cd.svg;yy+=cd.h+8;});
   const h=Math.max(yy-y+8,120);o+=`<rect x="${x}" y="${y}" width="${cw}" height="${h}" rx="${Math.min(14,(t.nodeRadius||8)+2)}" fill="${B.alpha(t.ink,t.dark?.05:.035)}"${over?` stroke="${t.bad}" stroke-width="1.6"`:''}/>`;
   o+=ref('columns:'+i,tx(x+14,y+26,c.name,{size:13,w:700})+tx(x+cw-14,y+26,`${cards.length}${c.wip?' / '+c.wip:''}`,{size:11.5,w:600,fill:over?t.bad:t.mute,anchor:'end',mono:1,raw:1})+g);maxB=Math.max(maxB,y+h);});
  const blocked=cols.reduce((a,c)=>a+L(c.cards).filter(x=>/!\s*$/.test(x)).length,0),over=cols.filter(c=>c.wip&&L(c.cards).length>+c.wip);const H=maxB+PAD;
  return done(B,W,H,opt,o,[{ok:!over.length,text:over.length?`${over.map(c=>c.name).join(', ')} ${over.length>1?'are':'is'} over the WIP limit (outlined).`:'Every column is within its WIP limit.'},{ok:!blocked,text:blocked?`${blocked} blocked card${blocked>1?'s':''}, marked with the red spine and ✕.`:'Nothing is blocked.'}]);}});

/* ---------- SWOT ---------- */
add({id:'swot',name:'SWOT',hint:'Strengths, weaknesses, opportunities, threats',order:'rows',
 icon:'<rect x="1" y="2" width="15" height="11"/><rect x="18" y="2" width="15" height="11"/><rect x="1" y="15" width="15" height="11"/><rect x="18" y="15" width="15" height="11"/>',
 starter:{title:'AI cooking channel · SWOT',subtitle:'Before the pilot goes live',data:{s:'Four distinct chefs\nFast, cheap production\nRecipes tested for real',w:'Viewers may distrust AI hosts\nNo live presence\nSmall team',o:'Shorts audiences want food\nBrand deals with kitchenware\nRecipe book spin-off',t:'Platform rules on AI content\nCopycat channels\nModel costs rising'}},
 templates:[],
 schema:{fields:[{k:'s',label:'Strengths',type:'textarea'},{k:'w',label:'Weaknesses',type:'textarea'},{k:'o',label:'Opportunities',type:'textarea'},{k:'t',label:'Threats',type:'textarea'}]},
 help:'Four headings, <b>## Strengths</b>, <b>## Weaknesses</b>, <b>## Opportunities</b>, <b>## Threats</b>, each followed by one point per line.',
 parse(text){const d={s:'',w:'',o:'',t:''};let k='s';String(text).split('\n').forEach(raw=>{const l=raw.trim();if(!l)return;const h=l.match(/^#*\s*(strengths?|weakness(?:es)?|opportunit(?:y|ies)|threats?)\s*:?$/i);if(h){k=h[1][0].toLowerCase();return;}d[k]+=(d[k]?'\n':'')+l.replace(/^[-*•]\s*/,'');});return d;},
 toText(d){return [['s','Strengths'],['w','Weaknesses'],['o','Opportunities'],['t','Threats']].map(([k,n])=>`## ${n}\n`+L(d[k]).map(x=>'- '+x).join('\n')).join('\n');},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;let y=PAD,o='';const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;const cw=380,gap=14,W=PAD*2+cw*2+gap;
  const Q=[['s','Strengths','Helpful · inside',t.good],['w','Weaknesses','Harmful · inside',t.bad],['o','Opportunities','Helpful · outside',C.col.accent],['t','Threats','Harmful · outside',C.col.warn]];
  const hOf=k=>34+L(d[k]).reduce((a,l)=>a+B.wrap(l,13,400,t.font,cw-56).length*18+6,0)+24;const rh=[Math.max(hOf('s'),hOf('w'),120),Math.max(hOf('o'),hOf('t'),120)];
  Q.forEach(([k,name,sub,col],i)=>{const x=PAD+(i%2)*(cw+gap),yy=y+(i>1?rh[0]+gap:0),h=rh[i>1?1:0];let g=B.box(x,yy,cw,h,{fill:B.tintFill(col,t.dark?.82:.9),stroke:B.alpha(col,.5)});
   g+=`<text x="${x+18}" y="${yy+34}" font-family="${B.esc(t.head)}" font-size="${t.serifTitle?24:20}" font-weight="700" fill="${B.deep(col)}">${B.esc(C.T(name[0]))}</text>`+tx(x+44,yy+30,name,{size:14,w:700,fill:B.deep(col)})+tx(x+cw-16,yy+30,sub,{size:11,fill:t.mute,anchor:'end'});
   let ly=yy+58;L(d[k]).forEach(l=>{g+=`<circle cx="${x+24}" cy="${ly-4}" r="3" fill="${col}"/>`;B.wrap(l,13,400,t.font,cw-56).forEach((w,j)=>{g+=tx(x+36,ly+j*18,w,{size:13,raw:1});});ly+=B.wrap(l,13,400,t.font,cw-56).length*18+6;});o+=ref(k+':0',g);});
  const H=y+rh[0]+rh[1]+gap+PAD;return done(B,W,H,opt,o,[{ok:true,text:'Inside factors on top, outside factors below; helpful on the left, harmful on the right.'}]);}});

/* ---------- fishbone / Ishikawa ---------- */
add({id:'fishbone',name:'Fishbone',hint:'Causes behind one effect',order:'x',
 icon:'<path d="M1 14h28M29 14l-4-3v6zM6 14L2 5M14 14l-4-9M22 14l-4-9M6 14l-4 9M14 14l-4 9M22 14l-4 9"/>',
 starter:{title:'Why viewers leave early',subtitle:'Causes grouped by where they come from',data:{effect:'Retention drops after 2 minutes',causes:[{label:'Story',items:'Slow intro\nRecipe shown too late'},{label:'Chef',items:'Same jokes each week\nVoice too calm'},{label:'Picture',items:'Plating shot repeats\nUpscale artefacts'},{label:'Sound',items:'Music too loud\nNo sizzle'},{label:'Packaging',items:'Thumbnail oversells\nTitle mismatch'},{label:'Platform',items:'Shown to non-cooks\nMid-roll ad at 2:00'}]}},
 templates:[{name:'Late deliveries',title:'Late deliveries',data:{effect:'Orders arrive late',causes:[{label:'People',items:'New drivers\nShift gaps'},{label:'Process',items:'Manual routing'},{label:'Tools',items:'Old scanners'},{label:'Suppliers',items:'Late stock'}]}}],
 schema:{fields:[{k:'effect',label:'The effect (problem)'}],lists:[{k:'causes',label:'Cause groups',title:'label',add:{label:'Category',items:''},fields:[{k:'label',label:'Category'},{k:'items',label:'Causes, one per line',type:'textarea'}]}]},
 help:'An outline: the first line is the effect; each unindented line after it is a category, with its causes indented underneath.',
 parse(text){const ls=String(text).split('\n').filter(l=>l.trim());const d={effect:(ls.shift()||'Effect').trim(),causes:[]};ls.forEach(l=>{if(/^\s/.test(l)&&d.causes.length){const c=d.causes[d.causes.length-1];c.items+=(c.items?'\n':'')+l.trim().replace(/^[-*•]\s*/,'');}else d.causes.push({label:l.trim().replace(/^[-*•]\s*/,''),items:''});});return d;},
 toText(d){return d.effect+'\n'+(d.causes||[]).map(c=>c.label+'\n'+L(c.items).map(i=>'  '+i).join('\n')).join('\n');},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;const cs=d.causes||[],n=cs.length,per=Math.ceil(n/2);let y=PAD,o='';const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;
  const maxItems=Math.max(2,...cs.map(c=>L(c.items).length)),bone=Math.max(150,maxItems*26+60),step=230,headW=220,W=PAD*2+per*step+headW+60+130,spine=y+bone+20,H=spine+bone+20+PAD;
  const hx=W-PAD-headW;o+=`<path d="M${PAD} ${spine}H${hx}" stroke="${t.ink}" stroke-width="3"/>`+`<path d="M${hx-14} ${spine-8}L${hx} ${spine}L${hx-14} ${spine+8}" fill="none" stroke="${t.ink}" stroke-width="3"/>`;
  const eh=Math.max(60,B.wrap(C.T(d.effect||''),15,700,t.font,headW-30).length*20+28);o+=ref('effect:0',B.box(hx+8,spine-eh/2,headW-8,eh,{fill:t.ink,stroke:'none'})+B.wrap(C.T(d.effect||''),15,700,t.font,headW-30).map((l,i,a)=>tx(hx+8+(headW-8)/2,spine-(a.length-1)*10+5+i*20,l,{size:15,w:700,anchor:'middle',fill:t.dark?'#0B0F1A':'#FFFFFF',raw:1})).join(''));
  cs.forEach((c,i)=>{const up=i%2===0,k=Math.floor(i/2),bx=PAD+170+k*step+(up?0:step*.35),ex=bx+bone*.55,ey=up?spine-bone:spine+bone,col=C.tint(i);let g=`<path d="M${bx} ${ey}L${ex} ${spine}" stroke="${col}" stroke-width="2.4"/>`;
   const lw=B.measure(C.T(c.label),13,700,t.font)+26;g+=B.box(bx-lw/2,up?ey-30:ey+4,lw,26,{fill:B.tintFill(col,.8),stroke:col,flat:1})+tx(bx,up?ey-12:ey+22,c.label,{size:13,w:700,anchor:'middle',fill:B.deep(col)});
   L(c.items).forEach((it,j)=>{const f=(j+1)/(L(c.items).length+1),px=bx+(ex-bx)*f,py=ey+(spine-ey)*f;g+=`<path d="M${px-70} ${py}H${px}" stroke="${B.alpha(col,.7)}" stroke-width="1.3"/>`+tx(px-74,py+4,it,{size:12,anchor:'end',halo:1});});o+=ref('causes:'+i,g);});
  return done(B,W,H,opt,o,[{ok:true,text:`${n} categories and ${cs.reduce((a,c)=>a+L(c.items).length,0)} causes lead to one effect, read right to left.`}]);}});

/* ---------- process arrows / value chain ---------- */
add({id:'process',name:'Process arrows',hint:'A value chain of chevrons',order:'x',
 icon:'<path d="M1 8h7l4 6-4 6H1l4-6zM11 8h7l4 6-4 6h-7l4-6zM21 8h7l4 6-4 6h-7l4-6z"/>',
 starter:{title:'How an episode creates value',subtitle:'Primary steps, with the support that runs under all of them',data:{steps:[{label:'Research',note:'Recipes viewers search for'},{label:'Generate',note:'Chef, kitchen, every shot'},{label:'Edit',note:'Pace, sound, captions'},{label:'Publish',note:'Long-form, Shorts, Reels'},{label:'Grow',note:'Replies, collabs, sponsors'}],support:'Pipeline tooling\nBrand and identity lock\nAnalytics',outcome:'Margin'}},
 templates:[{name:'Porter value chain',title:'Value chain',data:{steps:[{label:'Inbound logistics'},{label:'Operations'},{label:'Outbound logistics'},{label:'Marketing & sales'},{label:'Service'}],support:'Firm infrastructure\nHuman resources\nTechnology\nProcurement',outcome:'Margin'}}],
 schema:{fields:[{k:'support',label:'Support activities, one per line',type:'textarea'},{k:'outcome',label:'Outcome (end cap)'}],lists:[{k:'steps',label:'Steps',title:'label',add:{label:'Step',note:''},fields:[{k:'label',label:'Step'},{k:'note',label:'Note'}]}]},
 help:'One step per line: <b>Step — note</b>. Lines starting <b>support:</b> add a support bar; <b>outcome:</b> sets the end cap.',
 parse(text){const d={steps:[],support:'',outcome:''};String(text).split('\n').map(l=>l.trim()).filter(Boolean).forEach(l=>{const s2=l.match(/^support\s*:\s*(.+)/i);if(s2){d.support+=(d.support?'\n':'')+s2[1];return;}const oc=l.match(/^outcome\s*:\s*(.+)/i);if(oc){d.outcome=oc[1];return;}const [a,b]=pairSplit(l.replace(/^[-*•\d.]+\s*/,''));d.steps.push({label:a,note:b});});return d;},
 toText(d){return (d.steps||[]).map(s=>s.label+(s.note?' — '+s.note:'')).join('\n')+'\n'+L(d.support).map(x=>'support: '+x).join('\n')+(d.outcome?`\noutcome: ${d.outcome}`:'');},
 render(d,s,opt){const B=base(s,opt),{C,t,tx,ref}=B;const st=d.steps||[],n=Math.max(1,st.length),sup=L(d.support);let y=PAD,o='';const hd=B.heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;
  const cw=170,tip=26,capW=d.outcome?90:0,W=PAD*2+n*(cw+6)+tip+capW;const bodyW=n*(cw+6)+tip-6;
  sup.forEach((sv,i)=>{const yy=y+i*36;o+=ref('support:0',B.box(PAD,yy,bodyW,30,{fill:B.alpha(t.ink,t.dark?.07:.05),stroke:'none',r:6,flat:1})+tx(PAD+14,yy+19,sv,{size:12.5,w:600}));});
  const sy=y+sup.length*36+(sup.length?12:0),ch=120;
  st.forEach((x,i)=>{const x0=PAD+i*(cw+6),col=C.tint(i),notch=i?tip:0;const pts=`${x0},${sy} ${x0+cw},${sy} ${x0+cw+tip},${sy+ch/2} ${x0+cw},${sy+ch} ${x0},${sy+ch} ${x0+notch},${sy+ch/2}`;
   let g=(t.hardShadow?`<polygon points="${pts}" transform="translate(4 4)" fill="#000"/>`:'')+`<polygon points="${pts}" fill="${B.tintFill(col,.78)}" stroke="${col}" stroke-width="${t.id==='brutal'?2.5:1.4}" stroke-linejoin="round"${t.softShadow?` filter="url(#${C.uid}s)"`:''}/>`;
   const tx0=x0+notch+(cw-notch)/2+6;g+=tx(tx0,sy+28,String(i+1).padStart(2,'0'),{size:11,w:700,mono:1,fill:B.deep(col),anchor:'middle',raw:1});
   g+=B.wrap(C.T(x.label),14,700,t.font,cw-notch-10).slice(0,2).map((l,j)=>tx(tx0,sy+50+j*17,l,{size:14,w:700,anchor:'middle',fill:B.deep(col),raw:1})).join('');
   if(x.note)g+=B.wrap(x.note,11.5,400,t.font,cw-notch-14).slice(0,2).map((l,j)=>tx(tx0,sy+86+j*14,l,{size:11.5,anchor:'middle',fill:t.dark?t.mute:B.deep(col),raw:1})).join('');o+=ref('steps:'+i,g);});
  if(d.outcome){const x0=PAD+bodyW+12;o+=ref('outcome:0',`<path d="M${x0} ${y}H${x0+capW-30}L${x0+capW} ${(y+sy+ch)/2}L${x0+capW-30} ${sy+ch}H${x0}Z" fill="${t.ink}"/>`+`<text transform="translate(${x0+capW/2-6} ${(y+sy+ch)/2}) rotate(-90)" ${C.F} font-size="13" font-weight="700" fill="${t.dark?'#0B0F1A':'#FFFFFF'}" text-anchor="middle">${B.esc(C.T(d.outcome))}</text>`);}
  const H=sy+ch+PAD;return done(B,W,H,opt,o,[{ok:true,text:`${st.length} primary steps left to right${sup.length?`, ${sup.length} support activities spanning all of them`:''}.`}]);}});

/* ---------- register ---------- */
const D=window.Diagrams;const baseRender=D.render;const byId=Object.fromEntries(KINDS.map(k=>[k.id,k]));
KINDS.forEach(k=>{if(!D.KINDS.some(x=>x.id===k.id))D.KINDS.push({id:k.id,name:k.name,hint:k.hint,order:k.order});});
D.render=(kind,data,s,opt={})=>{if(byId[kind]){if(window.DVFonts)window.DVFonts(s);return byId[kind].render(data,s,opt);}return baseRender(kind,data,s,opt);};
D.more=byId;
})();
