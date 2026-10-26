'use strict';
/* Diagrams that are not processes: roadmap, org chart, journey map and comparison matrix.
   Same style tokens and drawing kit as the flowchart layouts, so a chosen style looks the same everywhere.
   Diagrams.render(kind,data,style,opt) → {svg,width,height,notes} */
(()=>{
const K=()=>window.FlowTypes.kit;
const PAD=40;
const lines=v=>String(v||'').split(/\n|;\s*/).map(x=>x.trim()).filter(Boolean);
const STATUS_LABEL={done:'Done',doing:'In progress',planned:'Planned',risk:'At risk'};

/* ---------- 1. roadmap ---------- */
function roadmap(d,s,opt){const {ctx,frame,heading,wrap,measure,esc,alpha,mix}=K();const C=ctx(s,opt),t=C.t;
 const P=d.periods.length?d.periods:['Now'],lanes=d.lanes.length?d.lanes:['Work'];const laneW=Math.max(130,...lanes.map(l=>measure(l,13,700,t.font)+34)),colW=opt.colW||Math.min(210,Math.max(118,...P.map(p=>measure(p,12,600,t.font)+24),...d.items.map(it=>(measure(((it.status==='done'||it.status==='risk')?'✓ ':'')+it.label,12.5,600,t.font)+34)/(Math.abs((+it.end||0)-(+it.start||0))+1))));
 const W=PAD*2+laneW+P.length*colW;let y=PAD,o='';const hd=heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;
 const used=[...new Set(d.items.map(i=>i.status).filter(Boolean))];if(used.length){let lx=PAD;for(const k of ['done','doing','planned','risk'])if(used.includes(k)){const c=k==='done'?t.good:k==='risk'?t.bad:t.mute;
  o+=`<rect x="${lx}" y="${y-2}" width="18" height="10" rx="3" fill="${k==='planned'?'none':alpha(c,.3)}" stroke="${c}" stroke-width="1.4"${k==='planned'?' stroke-dasharray="3 2"':''}/>${k==='doing'?`<rect x="${lx+2}" y="${y+4}" width="10" height="2.5" rx="1" fill="${t.ink}"/>`:''}<text x="${lx+24}" y="${y+7}" ${C.F} font-size="11.5" fill="${t.mute}">${STATUS_LABEL[k]}</text>`;lx+=36+measure(STATUS_LABEL[k],11.5,400,t.font)+12;}y+=26;}
 const gx=PAD+laneW,headY=y;const msTrack=d.milestones&&d.milestones.length?30:0;
 /* period header */
 P.forEach((p,i)=>{const x=gx+i*colW;o+=`<text x="${x+colW/2}" y="${headY+14}" ${C.F} font-size="12" font-weight="600" fill="${t.ink}" text-anchor="middle">${esc(C.T(p))}</text>`;});
 y=headY+26+msTrack;
 /* pack items into rows per lane */
 const rowsTop=y,BAR=34,GAP=8;let laneY=[];
 lanes.forEach((ln,li)=>{const its=d.items.filter(it=>(+it.lane||0)===li).map(it=>({...it,_i:d.items.indexOf(it),s:Math.max(0,Math.min(P.length-1,+it.start||0)),e:Math.max(0,Math.min(P.length-1,+(it.end??it.start)||0))})).sort((a,b)=>a.s-b.s);
  const rowsEnd=[];its.forEach(it=>{if(it.e<it.s)[it.s,it.e]=[it.e,it.s];let r=rowsEnd.findIndex(e=>e<it.s);if(r<0){r=rowsEnd.length;rowsEnd.push(-1);}rowsEnd[r]=it.e;it.row=r;});
  const nRows=Math.max(1,rowsEnd.length),h=nRows*(BAR+GAP)+GAP*2;laneY.push({y,h,its});y+=h;});
 const gridBottom=y;
 /* bands, lane labels, grid */
 laneY.forEach((L,li)=>{const tint=C.tint(li);o+=`<rect x="${PAD}" y="${L.y}" width="${W-PAD*2}" height="${L.h}" fill="${li%2?alpha(t.ink,t.dark?.04:.025):'none'}"/>`;
  o+=`<rect x="${PAD}" y="${L.y+10}" width="4" height="${L.h-20}" rx="2" fill="${tint}"/>`;
  wrap(C.T(lanes[li]),13,700,t.font,laneW-28).slice(0,3).forEach((ln,k)=>o+=`<text x="${PAD+14}" y="${L.y+24+k*16}" ${C.F} font-size="13" font-weight="700" fill="${t.ink}">${esc(ln)}</text>`);});
 for(let i=0;i<=P.length;i++){const x=gx+i*colW;o+=`<line x1="${x}" y1="${headY+22}" x2="${x}" y2="${gridBottom}" stroke="${alpha(t.line,.45)}" stroke-width="1"${i&&i<P.length?' stroke-dasharray="2 4"':''}/>`;}
 o+=`<line x1="${PAD}" y1="${rowsTop}" x2="${W-PAD}" y2="${rowsTop}" stroke="${alpha(t.line,.7)}"/><line x1="${PAD}" y1="${gridBottom}" x2="${W-PAD}" y2="${gridBottom}" stroke="${alpha(t.line,.7)}"/>`;
 /* today */
 if(d.today!=null&&d.today!==''){const x=gx+(+d.today+.5)*colW;o+=`<line x1="${x}" y1="${headY+20}" x2="${x}" y2="${gridBottom+6}" stroke="${t.accent}" stroke-width="2"/><rect x="${x-24}" y="${gridBottom+6}" width="48" height="18" rx="9" fill="${t.accent}"/><text x="${x}" y="${gridBottom+19}" ${C.F} font-size="10.5" font-weight="700" fill="#fff" text-anchor="middle">${C.T('Today')}</text>`;}
 /* bars */
 laneY.forEach((L,li)=>{const tint=C.tint(li);L.its.forEach(it=>{const x=gx+it.s*colW+5,w=(it.e-it.s+1)*colW-10,by=L.y+GAP+it.row*(BAR+GAP)+GAP/2;const st=it.status||'planned';
  const c=st==='risk'?t.bad:tint,fill=st==='planned'?(t.dark?alpha(c,.08):mix(c.startsWith('#')?c:'#888888',C.surf.startsWith('#')?C.surf:'#FFFFFF',.94)):st==='done'?(t.dark?alpha(c,.32):mix(c.startsWith('#')?c:'#888888','#FFFFFF',.62)):(t.dark?alpha(c,.2):mix(c.startsWith('#')?c:'#888888','#FFFFFF',.8));
  const r=Math.min(t.nodeRadius||8,10);o+=`<g data-ref="items:${it._i}"><rect x="${x}" y="${by}" width="${w}" height="${BAR}" rx="${r}" fill="${fill}" stroke="${c}" stroke-width="${t.id==='brutal'?2.2:1.3}"${st==='planned'?' stroke-dasharray="5 3"':''}${t.softShadow&&st!=='planned'?` filter="url(#${C.uid}s)"`:''}/>`;
  if(st==='doing')o+=`<rect x="${x}" y="${by+BAR-4}" width="${w*Math.max(.08,Math.min(1,+(it.progress??.5)))}" height="4" rx="2" fill="${c}"/>`;
  const glyph=st==='done'?'✓ ':st==='risk'?'! ':'';const lab=glyph+it.label;const fits=measure(lab,12.5,600,t.font)<=w-20;
  let txt=fits?lab:lab;if(!fits){while(txt.length>3&&measure(txt+'…',12.5,600,t.font)>w-20)txt=txt.slice(0,-1);txt=txt.trimEnd()+'…';}
  o+=`<text x="${x+10}" y="${by+BAR/2+4.5}" ${C.F} font-size="12.5" font-weight="600" fill="${t.dark?t.ink:mix(c.startsWith('#')?c:'#444444','#000000',.55)}"><title>${esc(it.label)}</title>${esc(txt)}</text></g>`;});});
 /* milestones */
 (d.milestones||[]).forEach(m=>{const x=gx+(+m.at||0)*colW,yy=headY+26+msTrack/2;o+=`<line x1="${x}" y1="${yy+6}" x2="${x}" y2="${gridBottom}" stroke="${alpha(t.ink,.35)}" stroke-width="1" stroke-dasharray="3 3"/><path d="M${x} ${yy-7}l7 7-7 7-7-7z" fill="${t.ink}"/>`;
  o+=`<text x="${x+11}" y="${yy+4}" ${C.F} font-size="11.5" font-weight="700" fill="${t.ink}">${esc(C.T(m.label))}</text>`;});
 const H=gridBottom+(d.today!=null&&d.today!==''?30:0)+PAD;
 return {svg:frame(C,W,H,opt,o),width:W,height:H,notes:[{ok:true,text:`${d.items.length} items across ${lanes.length} workstreams and ${P.length} periods.`},{ok:true,text:'Items that overlap in a lane stack into extra rows instead of hiding each other.'}]};}

/* ---------- 2. org chart ---------- */
function parseOrg(text){const root={kids:[],depth:-1};const stack=[root];
 for(const raw of String(text||'').split('\n')){if(!raw.trim())continue;const ind=raw.match(/^[\t ]*/)[0].replace(/\t/g,'  ').length;const line=raw.trim().replace(/^[-*•]\s*/,'');
  const m=line.match(/^(.*?)\s*(?:[—–]|\s-\s|,)\s*(.+)$/);let name=m?m[1]:line,role=m?m[2]:'';const tm=role.match(/\[(.+?)\]\s*$/);let team='';if(tm){team=tm[1];role=role.replace(/\s*\[.+?\]\s*$/,'');}
  const vac=/^(open role|hiring|vacant|tbc)\b/i.test(name);const n={name,role,team,vac,kids:[],depth:ind};while(stack.length>1&&stack[stack.length-1].depth>=ind)stack.pop();stack[stack.length-1].kids.push(n);stack.push(n);}
 return root.kids;}
function org(d,s,opt){const {ctx,frame,heading,wrap,measure,esc,alpha,mix}=K();const C=ctx(s,opt),t=C.t;
 const roots=parseOrg(d.text);const CW=212,CH=66,GX=22,GY=46,STACK=opt.stackAfter??3;
 if(!roots.length)return {svg:frame(C,400,200,opt,`<text x="40" y="100" ${C.F} fill="${t.mute}">Add people, one per line.</text>`),width:400,height:200,notes:[]};
 /* team colour from each person under the top level */
 let k=0;const colour=(n,c)=>{n.c=c;n.kids.forEach(ch=>colour(ch,c));};roots.forEach(r=>{r.c=t.ink;r.kids.forEach(ch=>colour(ch,C.tint(k++)));});
 const size=n=>{n.kids.forEach(size);const leafy=n.kids.length>STACK&&n.kids.every(c=>!c.kids.length);n.stack=leafy;
  if(!n.kids.length){n.w=CW;n.h=CH;}else if(leafy){n.w=CW;n.h=CH+GY*.6+n.kids.length*(CH*.82+10);}else{n.w=Math.max(CW,n.kids.reduce((a,c)=>a+c.w,0)+GX*(n.kids.length-1));n.h=CH+GY+Math.max(...n.kids.map(c=>c.h));}};
 roots.forEach(size);
 let y=PAD,o='',lines_='';const hd=heading(C,opt,PAD,y);o+=hd.o;y+=hd.h+6;const top=y;
 const totalW=roots.reduce((a,r)=>a+r.w,0)+GX*2*(roots.length-1),W=Math.max(PAD*2+totalW,PAD*2+360);
 const card=(n,x,yy,small)=>{const w=small?CW-18:CW,h=small?CH*.82:CH,ini=n.name.split(/\s+/).map(p=>p[0]).join('').slice(0,2).toUpperCase();const c=n.c||t.accent;
  const r=Math.min(t.nodeRadius||10,12),fill=n.vac?(t.bg.startsWith('#')?t.bg:C.surf):C.cardFill;let sv='';
  if(t.hardShadow&&!n.vac)sv+=`<rect x="${x+4}" y="${yy+4}" width="${w}" height="${h}" rx="${r}" fill="#000"/>`;
  sv+=`<rect x="${x}" y="${yy}" width="${w}" height="${h}" rx="${r}" fill="${t.clay?`url(#${C.uid}cl)`:fill}" stroke="${n.vac?alpha(t.ink,.4):C.cardStroke||alpha(t.line,.8)}" stroke-width="${t.id==='brutal'?2.4:1}"${n.vac?' stroke-dasharray="5 4"':''}${t.neu?` filter="url(#${C.uid}u)"`:t.softShadow&&!n.vac?` filter="url(#${C.uid}s)"`:''}/>`;
  sv+=`<rect x="${x}" y="${yy+8}" width="3.5" height="${h-16}" rx="1.5" fill="${c}"/>`;
  const av=small?13:16;sv+=`<circle cx="${x+14+av}" cy="${yy+h/2}" r="${av}" fill="${n.vac?'none':alpha(c,t.dark?.35:.16)}" stroke="${n.vac?alpha(t.ink,.4):'none'}" stroke-dasharray="3 3"/><text x="${x+14+av}" y="${yy+h/2+4}" ${C.F} font-size="${small?10.5:12}" font-weight="700" fill="${t.dark?t.ink:mix(c.startsWith('#')?c:'#444444','#000000',.35)}" text-anchor="middle">${n.vac?'+':esc(ini)}</text>`;
  const tx=x+14+av*2+10,tw=w-(tx-x)-10;const clip=(arr,max,size,wt)=>{if(arr.length<=max)return arr;const o=arr.slice(0,max);let last=o[max-1];while(last.length>2&&measure(last+'…',size,wt,t.font)>tw)last=last.slice(0,-1);o[max-1]=last.trimEnd()+'…';return o;};
  const fs=small?11:11.5,nm=clip(wrap(n.name,small?12:13,650,t.font,tw),1,small?12:13,650)[0],rl=n.role?clip(wrap(n.role+(n.team&&!small?' · '+n.team:''),fs,400,t.font,tw),small?1:2,fs,400):[];
  const blockH=(small?15:16)+rl.length*(fs+3),ty0=yy+h/2-blockH/2+(small?11:12);
  sv+=`<text x="${tx}" y="${ty0}" ${C.F} font-size="${small?12:13}" font-weight="650" fill="${n.vac?t.mute:t.ink}">${esc(C.T(nm))}</text>`;rl.forEach((l,i)=>sv+=`<text x="${tx}" y="${ty0+(small?15:16)+i*(fs+3)}" ${C.F} font-size="${fs}" fill="${t.mute}">${esc(l)}</text>`);
  return sv;};
 const place=(n,x,yy)=>{const cx=x+n.w/2;o+=card(n,cx-CW/2,yy);
  if(!n.kids.length)return;
  if(n.stack){const lx=cx-CW/2+18;let cy=yy+CH+GY*.6;lines_+=`<path d="M${lx} ${yy+CH}V${cy+n.kids.length*(CH*.82+10)-10-CH*.41}" fill="none" stroke="${C.line}" stroke-width="1.5"/>`;
   n.kids.forEach(ch=>{lines_+=`<path d="M${lx} ${cy+CH*.41}H${lx+12}" stroke="${C.line}" stroke-width="1.5"/>`;o+=card(ch,lx+12,cy,true);cy+=CH*.82+10;});return;}
  let kx=x+(n.w-(n.kids.reduce((a,c)=>a+c.w,0)+GX*(n.kids.length-1)))/2;const by=yy+CH+GY/2;
  const xs=n.kids.map(ch=>{const c=kx+ch.w/2;place(ch,kx,yy+CH+GY);kx+=ch.w+GX;return c;});
  lines_+=`<path d="M${cx} ${yy+CH}V${by}" stroke="${C.line}" stroke-width="1.5" fill="none"/>`;if(xs.length>1)lines_+=`<path d="M${xs[0]} ${by}H${xs[xs.length-1]}" stroke="${C.line}" stroke-width="1.5"/>`;
  xs.forEach(c=>lines_+=`<path d="M${c} ${by}V${yy+CH+GY}" stroke="${C.line}" stroke-width="1.5"/>`);};
 let rx=(W-totalW)/2;roots.forEach(r=>{place(r,rx,top);rx+=r.w+GX*2;});
 const count=n=>1+n.kids.reduce((a,c)=>a+count(c),0),people=roots.reduce((a,r)=>a+count(r),0),vac=(function v(ns){return ns.reduce((a,n)=>a+(n.vac?1:0)+v(n.kids),0);})(roots);
 const H=top+Math.max(...roots.map(r=>r.h))+PAD;
 return {svg:frame(C,W,H,opt,lines_+o),width:W,height:H,notes:[{ok:true,text:`${people} roles${vac?`, ${vac} open`:''}. Teams take a colour from the person they report up to.`},{ok:true,text:`Teams of more than ${STACK} with no reports of their own stack in a column, so the chart stays narrow.`}]};}

/* ---------- 3. journey map ---------- */
function journey(d,s,opt){const {ctx,frame,heading,wrap,measure,esc,alpha,mix}=K();const C=ctx(s,opt),t=C.t;
 const st=d.stages.length?d.stages:[{name:'Stage'}],n=st.length,gut=124,colW=opt.colW||210,W=PAD*2+gut+n*colW;let y=PAD,o='';
 const hd=heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;if(d.persona){o+=`<text x="${PAD}" y="${y}" ${C.F} font-size="12.5" fill="${t.ink}"><tspan font-weight="700">${esc(C.T('Persona'))}</tspan>  ${esc(d.persona)}</text>`;y+=24;}
 const gx=PAD+gut,cx=i=>gx+i*colW;const tw=colW-24;
 const rows=[];const add=(label,h,draw)=>{rows.push({label,h,draw});};
 /* stage header */
 add('',46,(yy)=>{let s='';st.forEach((x,i)=>{const c=C.tint(i);s+=`<g data-ref="stages:${i}"><rect x="${cx(i)+4}" y="${yy}" width="${colW-8}" height="36" rx="${Math.min(t.nodeRadius||10,18)}" fill="${t.dark?alpha(c,.3):mix(c.startsWith('#')?c:'#888888','#FFFFFF',.8)}" stroke="${alpha(c,.6)}"/>`;
  if(i<n-1)s+=`<path d="M${cx(i)+colW-6} ${yy+18}l8 0" stroke="${t.ink}" stroke-width="1.5"${C.arrow('ink')}/>`;
  s+=`<text x="${cx(i)+16}" y="${yy+23}" ${C.F} font-size="13" font-weight="700" fill="${t.dark?t.ink:mix(c.startsWith('#')?c:'#444444','#000000',.5)}">${String(i+1).padStart(2,'0')}  ${esc(C.T(wrap(x.name,13,700,t.font,colW-60)[0]))}</text></g>`;});return s;});
 const textRow=(label,key,opts={})=>{const cells=st.map(x=>lines(x[key]));const hh=Math.max(...cells.map(c=>c.reduce((a,l)=>a+wrap(l,12.5,400,t.font,tw-(opts.chip?0:12)).length*17+(opts.box?10:4),0)),18)+(opts.box?14:8);
  add(label,hh+8,(yy)=>{let s='';cells.forEach((c,i)=>{let ly=yy+(opts.box?6:0);c.forEach(l=>{const wl=wrap(l,12.5,400,t.font,tw-(opts.box?16:12));
    if(opts.box){const bh=wl.length*17+10,col=opts.box;s+=`<rect x="${cx(i)+8}" y="${ly}" width="${colW-16}" height="${bh}" rx="8" fill="${t.dark?alpha(col,.16):mix(col.startsWith('#')?col:'#888888','#FFFFFF',.9)}" stroke="${alpha(col,.35)}"/>`;
     wl.forEach((w2,k)=>s+=`<text x="${cx(i)+16}" y="${ly+17+k*17}" ${C.F} font-size="12.5" fill="${t.ink}"${opts.italic?' font-style="italic"':''}>${esc(w2)}</text>`);ly+=bh+6;}
    else{s+=`<circle cx="${cx(i)+14}" cy="${ly+9}" r="2.5" fill="${t.mute}"/>`;wl.forEach((w2,k)=>s+=`<text x="${cx(i)+22}" y="${ly+13+k*17}" ${C.F} font-size="12.5" fill="${t.ink}"${opts.italic?' font-style="italic"':''}>${esc(w2)}</text>`);ly+=wl.length*17+4;}});});return s;});};
 textRow('Doing','doing');
 textRow('Touchpoints','touchpoints');
 textRow('Thinking','thinking',{italic:true,box:t.mute.startsWith('#')?t.mute:'#888888'});
 /* feeling curve */
 add('Feeling',128,(yy)=>{const mid=yy+60,amp=24;let s=`<line x1="${gx}" y1="${mid}" x2="${W-PAD}" y2="${mid}" stroke="${alpha(t.line,.6)}" stroke-dasharray="3 4"/>`;
  s+=`<text x="${gx-8}" y="${mid-amp*2+4}" ${C.F} font-size="11" fill="${t.good}" text-anchor="end">+</text><text x="${gx-8}" y="${mid+amp*2+4}" ${C.F} font-size="11" fill="${t.bad}" text-anchor="end">–</text>`;
  const pts=st.map((x,i)=>[cx(i)+colW/2,mid-Math.max(-2,Math.min(2,+x.feeling||0))*amp]);let dd=`M${pts[0][0]} ${pts[0][1]}`;for(let i=1;i<pts.length;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i],m=(x1-x0)/2;dd+=` C${x0+m} ${y0} ${x1-m} ${y1} ${x1} ${y1}`;}
  s+=`<path d="${dd}" fill="none" stroke="${t.accent}" stroke-width="2.4" stroke-linecap="round"/>`;
  pts.forEach(([x,yy2],i)=>{const f=+st[i].feeling||0,c=f>0?t.good:f<0?t.bad:t.mute;const mouth=f>0?`M-4 1.5q4 4 8 0`:f<0?`M-4 4q4-4 8 0`:`M-4 2.5h8`;
   s+=`<g transform="translate(${x} ${yy2})"><circle r="11" fill="${C.surf}" stroke="${c}" stroke-width="2"/><circle cx="-3.5" cy="-2.5" r="1.3" fill="${c}"/><circle cx="3.5" cy="-2.5" r="1.3" fill="${c}"/><path d="${mouth}" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/></g>`;
   if(st[i].feelingNote)s+=`<text x="${x}" y="${yy2+(f>=0?-18:28)}" ${C.F} font-size="11" fill="${t.mute}" text-anchor="middle">${esc(wrap(st[i].feelingNote,11,400,t.font,colW-20)[0])}</text>`;});return s;});
 textRow('Pain points','pains',{box:t.bad});
 textRow('Opportunities','ideas',{box:t.good});
 rows.forEach((r,i)=>{if(r.label){o+=`<rect x="${PAD}" y="${y}" width="${W-PAD*2}" height="${r.h}" fill="${i%2?alpha(t.ink,t.dark?.035:.022):'none'}"/>`;
   o+=`<text x="${PAD+4}" y="${y+18}" ${C.FM} font-size="10.5" font-weight="700" letter-spacing="1.2" fill="${t.mute}">${esc(r.label.toUpperCase())}</text>`;}
  o+=r.draw(y+(r.label?6:0));y+=r.h+(r.label?6:4);});
 const H=y+PAD-10;
 return {svg:frame(C,W,H,opt,o),width:W,height:H,notes:[{ok:true,text:`${n} stages, read left to right; each row answers one question about the customer.`},{ok:true,text:'The feeling line shows where the experience dips; pain points and opportunities sit right under it.'}]};}

/* ---------- 4. comparison matrix ---------- */
function matrix(d,s,opt){const {ctx,frame,heading,wrap,measure,esc,alpha,mix}=K();const C=ctx(s,opt),t=C.t;
 const cols=d.columns.length?d.columns:[{name:'Option'}],labW=Math.max(170,Math.min(260,...[0].concat(d.rows.map(r=>measure(r.label,13,500,t.font)+30)))),colW=opt.colW||Math.max(130,...cols.map(c=>measure(c.name,13.5,700,t.font)+30));
 const W=PAD*2+labW+cols.length*colW;let y=PAD,o='';const hd=heading(C,opt,PAD,y);o+=hd.o;y+=hd.h;
 const gx=PAD+labW,cx=i=>gx+i*colW;const pick=cols.findIndex(c=>c.pick);
 const headH=Math.max(54,...cols.map(c=>c.note?70:54));const tableTop=y;
 /* body rows */
 let yy=y+headH;const body=[];d.rows.forEach((r,ri)=>{if(r.group){body.push({g:r.group,y:yy,h:30});yy+=30;return;}const lab=wrap(r.label,13,500,t.font,labW-20);
  const ch=Math.max(lab.length*16+18,...(r.cells||[]).map(v=>{const k=String(v??'').trim().toLowerCase();return ['yes','y','✓','no','n','x','✕','partial','~','some','-',''].includes(k)?38:wrap(v,12,400,t.font,colW-20).length*15+18;}),38);body.push({r,lab,y:yy,h:ch});yy+=ch;});
 const H=yy+PAD+10;
 if(pick>=0)o+=`<rect x="${cx(pick)+3}" y="${tableTop-4}" width="${colW-6}" height="${yy-tableTop+12}" rx="14" fill="${t.dark?alpha(t.accent,.12):mix(t.accent.startsWith('#')?t.accent:'#888888','#FFFFFF',.92)}" stroke="${t.accent}" stroke-width="1.6"/>`;
 cols.forEach((c,i)=>{const x=cx(i)+colW/2;if(i===pick){const lab=C.T('Recommended'),w=measure(lab,10,700,t.font)+16;o+=`<rect x="${x-w/2}" y="${tableTop-14}" width="${w}" height="20" rx="10" fill="${t.accent}"/><text x="${x}" y="${tableTop}" ${C.F} font-size="10" font-weight="700" fill="#fff" text-anchor="middle" letter-spacing=".4">${esc(lab)}</text>`;}
  o+=`<text data-ref="columns:${i}" x="${x}" y="${tableTop+24}" ${C.F} font-size="13.5" font-weight="700" fill="${t.ink}" text-anchor="middle">${esc(C.T(c.name))}</text>`;if(c.note)o+=`<text x="${x}" y="${tableTop+42}" ${C.F} font-size="12" fill="${t.mute}" text-anchor="middle">${esc(c.note)}</text>`;});
 o+=`<line x1="${PAD}" y1="${y+headH-6}" x2="${W-PAD}" y2="${y+headH-6}" stroke="${t.ink}" stroke-width="1.4"/>`;
 let zebra=0;body.forEach(b=>{if(b.g){o+=`<text x="${PAD+4}" y="${b.y+20}" ${C.FM} font-size="10.5" font-weight="700" letter-spacing="1.2" fill="${t.mute}">${esc(b.g.toUpperCase())}</text>`;zebra=0;return;}
  if(zebra++%2)o+=`<rect x="${PAD}" y="${b.y}" width="${W-PAD*2}" height="${b.h}" fill="${alpha(t.ink,t.dark?.035:.025)}"/>`;
  o+=`<line x1="${PAD}" y1="${b.y+b.h}" x2="${W-PAD}" y2="${b.y+b.h}" stroke="${alpha(t.line,.5)}"/>`;
  b.lab.forEach((l,k)=>o+=`<text x="${PAD+4}" y="${b.y+b.h/2-(b.lab.length-1)*8+4.5+k*16}" ${C.F} font-size="13" font-weight="500" fill="${t.ink}">${esc(l)}</text>`);
  cols.forEach((c,i)=>{const v=String((b.r.cells||[])[i]??'').trim(),k=v.toLowerCase(),x=cx(i)+colW/2,my=b.y+b.h/2;
   if(['yes','y','✓'].includes(k))o+=`<g transform="translate(${x} ${my})"><circle r="10" fill="${t.good}"/><path d="M-4.5 0l3 3 6-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><title>Yes</title></g>`;
   else if(['no','n','x','✕'].includes(k))o+=`<g transform="translate(${x} ${my})"><circle r="10" fill="none" stroke="${alpha(t.ink,.3)}" stroke-width="1.5"/><path d="M-3.5-3.5l7 7M3.5-3.5l-7 7" stroke="${alpha(t.ink,.45)}" stroke-width="1.6" stroke-linecap="round"/><title>No</title></g>`;
   else if(['partial','~','some'].includes(k))o+=`<g transform="translate(${x} ${my})"><circle r="10" fill="none" stroke="${C.col.warn}" stroke-width="1.8"/><path d="M0-10a10 10 0 0 1 0 20z" fill="${C.col.warn}"/><title>Partly</title></g>`;
   else if(k&&k!=='-'){const wl=wrap(v,12,400,t.font,colW-20);wl.forEach((w2,j)=>o+=`<text x="${x}" y="${my-(wl.length-1)*7.5+4+j*15}" ${C.F} font-size="12" fill="${t.ink}" text-anchor="middle">${esc(w2)}</text>`);}
   else o+=`<text x="${x}" y="${my+4}" ${C.F} font-size="12" fill="${t.mute}" text-anchor="middle">—</text>`;});});
 /* key */
 const ky=yy+22;let kx=PAD;[['Yes',t.good,'y'],['Partly',C.col.warn,'p'],['No',alpha(t.ink,.45),'n']].forEach(([l,c,k])=>{o+=k==='y'?`<circle cx="${kx+6}" cy="${ky-4}" r="6" fill="${c}"/>`:k==='p'?`<circle cx="${kx+6}" cy="${ky-4}" r="6" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M${kx+6} ${ky-10}a6 6 0 0 1 0 12z" fill="${c}"/>`:`<circle cx="${kx+6}" cy="${ky-4}" r="6" fill="none" stroke="${c}" stroke-width="1.4"/>`;o+=`<text x="${kx+18}" y="${ky}" ${C.F} font-size="11.5" fill="${t.mute}">${l}</text>`;kx+=30+measure(l,11.5,400,t.font)+14;});
 return {svg:frame(C,W,H,opt,o),width:W,height:H,notes:[{ok:true,text:`${cols.length} options × ${d.rows.filter(r=>!r.group).length} criteria.`},{ok:pick>=0,text:pick>=0?'The recommended option is outlined in the accent colour, so the answer reads first.':'Tick “recommend” on one option to give readers the answer up front.'}]};}

const KINDS=[
 {id:'roadmap',name:'Roadmap',hint:'Workstreams over time',order:'x'},
 {id:'org',name:'Org chart',hint:'Who reports to whom',order:'y'},
 {id:'journey',name:'Journey map',hint:'A customer’s experience, stage by stage',order:'cols'},
 {id:'matrix',name:'Comparison matrix',hint:'Options against criteria',order:'rows'}];
function render(kind,data,s,opt={}){if(window.DVFonts)window.DVFonts(s);return ({roadmap,org,journey,matrix})[kind](data,s,opt);}
window.Diagrams={KINDS,render,parseOrg};
})();
