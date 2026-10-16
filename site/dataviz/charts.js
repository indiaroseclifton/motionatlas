'use strict';
/* DVCharts: thirteen chart forms drawn from one style's tokens (dataviz/styles.js).
   Mark specs follow the dataviz method: bars capped at 24px with a 4px rounded data end and a square baseline,
   2px lines, markers r>=4 with a 2px surface ring, 10% area washes, hairline solid grids, a 2px surface gap between
   touching fills, a legend for two or more series plus sparing direct labels, text in ink tokens (never series
   colour), categorical hues in fixed order following the entity, status colours reserved.
   render(kind, style) -> {svg, tips:[...], table:{head,rows}, title, sub} ; every mark that can be hovered carries
   data-tip="i" pointing into tips, and the table is the no-hover twin. */
(()=>{
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const D={
 platforms:['YouTube','TikTok','Instagram','Newsletter','Other'],
 views:{YouTube:[42,45,51,48,57,63,68,74,79,88,96,104],TikTok:[30,36,44,52,49,58,66,71,69,77,85,92],Instagram:[22,24,23,27,29,31,30,34,36,35,39,41]},
 kpis:[{label:'Views',value:236400,delta:8.4,unit:'%',good:true,spark:[150,162,170,168,181,190,201,198,214,221,229,236]},
  {label:'Watch time',value:18200,suffix:' h',delta:3.1,unit:'%',good:true,spark:[14.1,14.6,15.2,15,15.8,16.1,16.6,16.9,17.2,17.5,17.9,18.2]},
  {label:'Subscribers',value:48600,delta:1.9,unit:'%',good:true,spark:[40,41,41.8,42.5,43.1,44,44.8,45.6,46.4,47.2,47.9,48.6]},
  {label:'Avg. retention',value:41,suffix:'%',delta:-2.3,unit:' pts',good:false,spark:[45,44.6,44.8,44,43.5,43.9,43.1,42.6,42.8,42,41.6,41]}],
 episodes:[['Cacio e pepe, three ways',184],['Brisket at dawn',152],['Mapo tofu in 8 minutes',131],['Bistro onion soup',118],['Scallion pancakes',96],['Sunday ragù',88]],
 quarters:{labels:['Q1','Q2','Q3','Q4'],now:[138,168,221,282],prev:[96,121,150,190]},
 stack:{labels:['Jul','Aug','Sep','Oct','Nov','Dec'],series:{YouTube:[3.1,3.4,3.6,4.1,4.4,4.8],TikTok:[2.2,2.4,2.3,2.6,2.9,3.2],Instagram:[1.1,1.2,1.3,1.2,1.4,1.5],Newsletter:[.4,.4,.5,.5,.6,.7]}},
 share:[['YouTube',44],['TikTok',31],['Instagram',17],['Newsletter',8]],
 chefs:[['Nonna Lucia','Italian',14,412,[22,25,27,30,33,36,38,41],46],['Chef Bastien','French bistro',11,356,[20,21,25,28,27,31,34,36],44],['Big Earl','Texas BBQ',9,298,[18,22,21,24,26,25,28,30],39],['Mei','Taipei street food',6,187,[8,10,13,15,18,21,24,27],42]],
 heat:{rows:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],cols:['6am','9am','12pm','3pm','6pm','9pm'],v:[[12,18,24,21,30,26],[11,17,22,20,29,27],[13,19,25,23,33,31],[12,20,27,24,36,34],[10,16,22,25,41,38],[15,24,33,36,47,44],[18,27,38,35,44,40]]},
 sankey:{src:[['Search',34],['Recommended',51],['Shares',15]],mid:['YouTube','TikTok','Instagram'],out:['Subscribed','Watched past half','Left early'],
  a:[[16,10,8],[22,21,8],[6,5,4]],b:[[9,20,15],[5,18,13],[3,8,9]]},
 roadmap:[['Research','Jan','Mar','done'],['Chef roster','Feb','Apr','done'],['Pilot episodes','Apr','Jul','now'],['Multi-platform','Jul','Oct','next'],['Monetisation','Sep','Dec','next']],
 goal:{label:'Monthly views goal',value:236,target:300},
 funnel:[['Impressions',1200000],['Clicked',96000],['Watched 30s',61000],['Finished',22000],['Subscribed',3100]]};

const compact=v=>{const a=Math.abs(v);return a>=1e6?(v/1e6).toFixed(a>=1e7?0:1).replace(/\.0$/,'')+'M':a>=1e3?(v/1e3).toFixed(a>=1e4?0:1).replace(/\.0$/,'')+'K':String(Math.round(v*10)/10);};
const niceMax=v=>{const p=10**Math.floor(Math.log10(v)),n=v/p;return (n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p;};
const ticks=(max,n=4)=>{const raw=max/n,p=10**Math.floor(Math.log10(raw)),st=[1,2,2.5,5,10].map(k=>k*p).find(k=>k>=raw),m=Math.ceil(max/st-1e-9);return [...Array(m+1)].map((_,i)=>+(i*st).toFixed(6));};
const mix=(a,b,k)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));if(!/^#[0-9a-f]{6}$/i.test(a)||!/^#[0-9a-f]{6}$/i.test(b))return a;const x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');};
const alpha=(h,a)=>{if(!/^#[0-9a-f]{6}$/i.test(h))return h;const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`;};
const lum=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];};
const onFill=(h,t)=>lum(h)>.38?(t.dark?'#0B0F1A':t.ink):'#FFFFFF';

function ctx(s,kind){const t=s.t,uid='c'+kind+Math.random().toString(36).slice(2,6);
 const solidSurf=t.surface&&t.surface.startsWith('#')?t.surface:(t.dark?'#151A28':'#FFFFFF');
 const cardBg=t.neu?t.bg:t.frost?'#F7F8FC':t.glow?'#121828':solidSurf;
 const grid=t.grid&&t.grid!=='transparent'?(t.id==='brutal'?alpha('#000000',.18):t.grid):null;
 const C={t,s,uid,defs:'',tips:[],F:`font-family="${esc(t.font)}"`,FM:`font-family="${esc(t.mono)}"`,cardBg,grid,
  ink:t.ink,mute:t.mute,cat:t.cat||t.series,seq:t.seq,div:t.div,
  r:t.id==='brutal'||t.id==='blueprint'||t.id==='editorial'||t.id==='tufte'?0:t.clay?7:4,up:t.upper};
 C.T=x=>C.up?String(x).toUpperCase():x;
 C.tip=(title,rows)=>{C.tips.push({title,rows});return C.tips.length-1;};
 if(t.softShadow){const [dx,dy,b,c,o]=t.softShadow;C.defs+=`<filter id="${uid}s" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="${dx/2}" dy="${dy/2}" stdDeviation="${b/4}" flood-color="${c}" flood-opacity="${o}"/></filter>`;}
 if(t.neu)C.defs+=`<filter id="${uid}u" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b"/><feOffset in="b" dx="3" dy="3" result="o1"/><feFlood flood-color="#A7B2C4" flood-opacity=".7"/><feComposite in2="o1" operator="in" result="d"/><feOffset in="b" dx="-3" dy="-3" result="o2"/><feFlood flood-color="#FFFFFF" flood-opacity=".9"/><feComposite in2="o2" operator="in" result="l"/><feMerge><feMergeNode in="d"/><feMergeNode in="l"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
 if(t.clay)C.defs+=`<linearGradient id="${uid}hl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/><stop offset=".55" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>`;
 if(t.glow)C.defs+=`<filter id="${uid}g" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>`;
 return C;}

/* a filled mark with the style's surface treatment; d is a path */
function fill(C,d,color,opt={}){const t=C.t;let o='';
 if(t.hardShadow)o+=`<path d="${d}" transform="translate(3 3)" fill="#000"/>`;
 if(t.rough&&window.DVRough&&opt.pts){o+=`<path d="${d}" fill="${mix(color,'#FFFFFF',.35)}"/><path d="${window.DVRough(opt.pts,opt.seed||1,1.1,true)}" fill="none" stroke="${mix(color,'#000000',.25)}" stroke-width="1.6"/>`;return o;}
 const f=t.neu?` filter="url(#${C.uid}u)"`:t.softShadow&&!opt.flat?` filter="url(#${C.uid}s)"`:'';
 o+=`<path d="${d}" fill="${color}"${f}${t.multiply?' style="mix-blend-mode:multiply"':''}${t.id==='brutal'?' stroke="#000" stroke-width="2"':''}/>`;
 if(t.misregister)o+=`<path d="${d}" fill="none" stroke="${t.cat[1]}" stroke-width="1" opacity=".55" transform="translate(1.4 1.1)" style="mix-blend-mode:multiply"/>`;
 if(t.clay&&opt.hl!==false)o+=`<path d="${d}" fill="url(#${C.uid}hl)"/>`;
 if(t.glow&&opt.glow)o+=`<path d="${d}" fill="${color}" opacity=".5" filter="url(#${C.uid}g)"/>`;
 return o;}
/* bar with a rounded data end and square baseline; dir: 'up' | 'right' */
function bar(x,y,w,h,r,dir){r=Math.max(0,Math.min(r,dir==='up'?w/2:h/2,dir==='up'?h:w));
 if(dir==='right')return `M${x} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${y+h-r}Q${x+w} ${y+h} ${x+w-r} ${y+h}H${x}Z`;
 return `M${x} ${y+h}V${y+r}Q${x} ${y} ${x+r} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${y+h}Z`;}
const barPts=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
function line(C,pts,color,w=2,dash=''){const t=C.t;if(t.rough&&window.DVRough)return `<path d="${window.DVRough(pts,pts.length,.8,false)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
 let d;if(t.route==='curve'&&(t.glow||t.frost||t.clay||t.neu)){d=`M${pts[0][0]} ${pts[0][1]}`;for(let i=1;i<pts.length;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i],mx=(x0+x1)/2;d+=` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`;}}else d='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
 let o='';if(t.glow)o+=`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w+3}" opacity=".35" filter="url(#${C.uid}g)"/>`;
 if(t.misregister)o+=`<path d="${d}" fill="none" stroke="${t.cat[1]}" stroke-width="${w}" opacity=".5" transform="translate(1.4 1.1)" style="mix-blend-mode:multiply"/>`;
 return o+`<path d="${d}" fill="none" stroke="${color}" stroke-width="${t.id==='brutal'?3:w}" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;}
const dot=(C,x,y,color,r=4.5)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r+2}" fill="${C.cardBg}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${color}"${C.t.id==='brutal'?' stroke="#000" stroke-width="1.5"':''}/>`;
function gridY(C,x0,x1,y0,y1,max,fmt=compact,n=5){const tk=ticks(max,n),top=tk[tk.length-1],sy=v=>y1-(v/top)*(y1-y0);let o='';
 tk.forEach(v=>{const y=sy(v);if(C.grid&&!C.t.rangeFrame)o+=`<line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" stroke="${v===0?alpha(C.ink,.35):C.grid}" stroke-width="1"/>`;
  o+=`<text x="${x0-8}" y="${y+4}" ${C.FM} font-size="10.5" fill="${C.mute}" text-anchor="end" style="font-variant-numeric:tabular-nums">${fmt(v)}</text>`;});
 if(C.t.rangeFrame)o+=`<line x1="${x0-2}" x2="${x0-2}" y1="${sy(0)}" y2="${sy(max)}" stroke="${C.ink}" stroke-width=".75"/>`;
 return {o,sy,top};}
function legend(C,items,x,y,kind='rect'){let o='',cx=x;
 items.forEach(([label,color])=>{o+=kind==='line'?`<path d="M${cx} ${y}h14" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`:`<rect x="${cx}" y="${y-5}" width="10" height="10" rx="${C.r?2.5:0}" fill="${color}"/>`;cx+=kind==='line'?20:16;
  o+=`<text x="${cx}" y="${y+4}" ${C.F} font-size="11.5" fill="${C.mute}">${esc(C.T(label))}</text>`;cx+=String(label).length*6.4+18;});return o;}
const hit=(x,y,w,h,i,label)=>`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(w,1).toFixed(1)}" height="${Math.max(h,1).toFixed(1)}" fill="transparent" data-tip="${i}" tabindex="0" role="graphics-symbol" aria-label="${esc(label)}"/>`;

/* ---------------- chart forms ---------------- */
const K={};
K.kpi={name:'KPI tiles',note:'The number is the chart: label, value, signed delta against a named period, a sparkline for shape.',
 title:'Views are up, retention is slipping',sub:'Last 30 days vs the previous 30',h:210,
 draw(C,W){const n=4,gap=12,w=(W-48-gap*(n-1))/n;let o='';
  D.kpis.forEach((k,i)=>{const x=24+i*(w+gap),y=86,h=104,up=k.delta>0,dc=k.good?C.t.good:C.t.bad,arrow=up?'▲':'▼';
   const card=C.t.board||C.t.id==='saas'||C.t.dark;if(card)o+=fill(C,`M${x+8} ${y}H${x+w-8}Q${x+w} ${y} ${x+w} ${y+8}V${y+h-8}Q${x+w} ${y+h} ${x+w-8} ${y+h}H${x+8}Q${x} ${y+h} ${x} ${y+h-8}V${y+8}Q${x} ${y} ${x+8} ${y}Z`,C.t.neu?C.t.bg:C.t.glow?'#1A2133':C.t.frost?'#FFFFFF':C.t.surface.startsWith('#')?C.t.surface:'#fff',{hl:false});
   else if(C.t.id!=='tufte')o+=`<line x1="${x}" x2="${x+w}" y1="${y}" y2="${y}" stroke="${C.t.id==='brutal'?'#000':C.ink}" stroke-width="${C.t.id==='brutal'?3:1}"/>`;
   const px=x+(card?14:0);
   o+=`<text x="${px}" y="${y+22}" ${C.F} font-size="12" fill="${C.mute}">${esc(C.T(k.label))}</text>`;
   o+=`<text x="${px}" y="${y+54}" ${C.F} font-size="26" font-weight="600" fill="${C.ink}">${k.suffix==='%'?k.value+'%':compact(k.value)+(k.suffix||'')}</text>`;
   o+=`<text x="${px}" y="${y+76}" ${C.F} font-size="11.5" font-weight="600" fill="${dc}">${arrow} ${Math.abs(k.delta)}${k.unit}</text><text x="${px+62}" y="${y+76}" ${C.F} font-size="11" fill="${C.mute}">vs last 30d</text>`;
   const sx=px,sw=w-(card?28:0),sy=y+86,sh=12,mn=Math.min(...k.spark),mx=Math.max(...k.spark),P=k.spark.map((v,j)=>[sx+j*sw/(k.spark.length-1),sy+sh-(v-mn)/(mx-mn||1)*sh]);
   o+=line(C,P.slice(0,-1),alpha(C.mute,.6),1.5)+line(C,P.slice(-2),C.cat[0],1.8)+dot(C,P[P.length-1][0],P[P.length-1][1],C.cat[0],2.6);
   const ti=C.tip(k.label,[[null,(k.suffix==='%'?k.value+'%':k.value.toLocaleString('en-GB')+(k.suffix||''))],[null,`${up?'+':'−'}${Math.abs(k.delta)}${k.unit} vs last 30 days`]]);o+=hit(x,y,w,h,ti,k.label);});
  return o;},
 table(){return {head:['Metric','Value','Change vs last 30d'],rows:D.kpis.map(k=>[k.label,k.suffix==='%'?k.value+'%':k.value.toLocaleString('en-GB')+(k.suffix||''),(k.delta>0?'+':'')+k.delta+k.unit])};}};

K.line={name:'Line',note:'Change over time for up to four series; direct labels at the line ends, a legend above.',
 title:'YouTube pulled ahead in the autumn',sub:'Monthly views by platform, thousands, 2026',h:330,
 draw(C,W){const x0=52,x1=W-(C.up?118:92),y0=96,y1=290,names=Object.keys(D.views),max=Math.max(...names.flatMap(n=>D.views[n]));
  const g=gridY(C,x0,x1,y0,y1,max);let o=g.o;const sx=i=>x0+i*(x1-x0)/11;
  MONTHS.forEach((m,i)=>{if(i%2===0||i===11)o+=`<text x="${sx(i)}" y="${y1+18}" ${C.FM} font-size="10.5" fill="${C.mute}" text-anchor="middle">${C.T(m)}</text>`;});
  o+=`<line x1="${sx(3)}" x2="${sx(3)}" y1="${y0}" y2="${y1}" stroke="${alpha(C.ink,.25)}" stroke-width="1"/><text x="${sx(3)+6}" y="${y0+10}" ${C.F} font-size="11" fill="${C.mute}">TikTok series launches</text>`;
  const ends=[];names.forEach((n,k)=>{const P=D.views[n].map((v,i)=>[sx(i),g.sy(v)]);o+=line(C,P,C.cat[k]);o+=dot(C,...P[11],C.cat[k]);ends.push([P[11][1],n,D.views[n][11]]);});
  ends.sort((a,b)=>a[0]-b[0]);for(let i=1;i<ends.length;i++)if(ends[i][0]-ends[i-1][0]<16)ends[i][0]=ends[i-1][0]+16;
  ends.forEach(([y,n,v])=>{o+=`<text x="${x1+10}" y="${y+4}" ${C.F} font-size="11.5" fill="${C.ink}"><tspan font-weight="600">${compact(v)}K</tspan> <tspan fill="${C.mute}">${esc(C.T(n))}</tspan></text>`;});
  o+=legend(C,names.map((n,k)=>[n,C.cat[k]]),x0-28,70,'line');
  MONTHS.forEach((m,i)=>{const ti=C.tip(m+' 2026',names.map((n,k)=>[C.cat[k],`${D.views[n][i]}K`,n]));o+=`<g class="xh" data-x="${sx(i)}" data-y0="${y0}" data-y1="${y1}">${hit(sx(i)-(x1-x0)/22,y0,(x1-x0)/11,y1-y0,ti,m)}</g>`;});
  return o;},
 table(){const n=Object.keys(D.views);return {head:['Month',...n],rows:MONTHS.map((m,i)=>[m,...n.map(k=>D.views[k][i]+'K')])};}};

K.area={name:'Area',note:'One measure over time where volume matters; a 10% wash under a 2px line.',
 title:'Watch time grew every month bar one',sub:'Hours watched, thousands, 2026',h:300,
 draw(C,W){const v=D.kpis[1].spark,x0=52,x1=W-30,y0=86,y1=262,g=gridY(C,x0,x1,y0,y1,Math.max(...v)+2);let o=g.o;const sx=i=>x0+i*(x1-x0)/11,P=v.map((d,i)=>[sx(i),g.sy(d)]);
  const id=C.uid+'a';C.defs+=`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.cat[0]}" stop-opacity="${C.t.glow||C.t.frost?.38:.12}"/><stop offset="1" stop-color="${C.cat[0]}" stop-opacity="${C.t.glow||C.t.frost?0:.08}"/></linearGradient>`;
  o+=`<path d="M${P.map(p=>p.join(' ')).join(' L')} L${x1} ${y1} L${x0} ${y1}Z" fill="url(#${id})"/>`+line(C,P,C.cat[0])+dot(C,...P[11],C.cat[0]);
  o+=`<text x="${P[11][0]-8}" y="${P[11][1]-12}" ${C.F} font-size="12" font-weight="600" fill="${C.ink}" text-anchor="end">18.2K h</text>`;
  MONTHS.forEach((m,i)=>{if(i%2===0||i===11)o+=`<text x="${sx(i)}" y="${y1+18}" ${C.FM} font-size="10.5" fill="${C.mute}" text-anchor="middle">${C.T(m)}</text>`;const ti=C.tip(m+' 2026',[[C.cat[0],v[i]+'K h','Watch time']]);o+=`<g class="xh" data-x="${sx(i)}" data-y0="${y0}" data-y1="${y1}">${hit(sx(i)-(x1-x0)/22,y0,(x1-x0)/11,y1-y0,ti,m)}</g>`;});
  return o;},
 table(){return {head:['Month','Watch time (K h)'],rows:MONTHS.map((m,i)=>[m,D.kpis[1].spark[i]])};}};

K.bar={name:'Ranked bars',note:'Compare magnitudes across named things; one series, one colour, the one that matters highlighted.',
 title:'One recipe out-pulled the rest by a fifth',sub:'Views per episode, thousands, last 90 days',h:300,
 draw(C,W){const x0=C.up?206:176,x1=W-56,y0=78,bh=Math.min(22,24),gap=14,max=niceMax(184);let o='';
  D.episodes.forEach(([n,v],i)=>{const y=y0+i*(bh+gap),w=(v/max)*(x1-x0),hl=i===0,col=C.t.highlightOnly&&!hl?'#C9C5BE':hl?C.cat[0]:(C.t.highlightOnly||C.t.id==='tufte'?mix(C.cat[0],C.cardBg,.55):mix(C.cat[0],C.cardBg,.45));
   o+=`<text x="${x0-12}" y="${y+bh/2+4}" ${C.F} font-size="12" fill="${hl?C.ink:C.mute}" font-weight="${hl?600:400}" text-anchor="end">${esc(C.T(n))}</text>`;
   o+=fill(C,bar(x0,y,w,bh,C.r,'right'),col,{pts:barPts(x0,y,w,bh),seed:i+1,glow:hl});
   o+=`<text x="${x0+w+8}" y="${y+bh/2+4}" ${C.F} font-size="12" font-weight="${hl?600:500}" fill="${C.ink}" style="font-variant-numeric:tabular-nums">${v}K</text>`;
   const ti=C.tip(n,[[col,v+'K views']]);o+=hit(0,y-gap/2,W,bh+gap,ti,n);});
  o+=`<line x1="${x0}" x2="${x0}" y1="${y0-6}" y2="${y0+6*(bh+gap)-gap+6}" stroke="${alpha(C.ink,.35)}" stroke-width="1"/>`;return o;},
 table(){return {head:['Episode','Views (K)'],rows:D.episodes};}};

K.columns={name:'Current vs previous',note:'The current period in colour, the comparison in grey, side by side on one baseline.',
 title:'Every quarter beat last year',sub:'Views per quarter, thousands, 2026 vs 2025',h:300,
 draw(C,W){const x0=52,x1=W-24,y0=92,y1=262,g=gridY(C,x0,x1,y0,y1,282);let o=g.o;const band=(x1-x0)/4,bw=Math.min(24,band/3.4),prev=C.t.dark?'#5A5F6B':'#C8C6C0';
  D.quarters.labels.forEach((q,i)=>{const cx=x0+band*(i+.5),a=D.quarters.prev[i],b=D.quarters.now[i];
   o+=fill(C,bar(cx-bw-1,g.sy(a),bw,y1-g.sy(a),C.r,'up'),prev,{pts:barPts(cx-bw-1,g.sy(a),bw,y1-g.sy(a)),seed:i+3,hl:false,flat:true});
   o+=fill(C,bar(cx+1,g.sy(b),bw,y1-g.sy(b),C.r,'up'),C.cat[0],{pts:barPts(cx+1,g.sy(b),bw,y1-g.sy(b)),seed:i+9,glow:i===3});
   o+=`<text x="${cx+1+bw/2}" y="${g.sy(b)-7}" ${C.F} font-size="11" font-weight="600" fill="${C.ink}" text-anchor="middle">${b}</text>`;
   o+=`<text x="${cx}" y="${y1+18}" ${C.FM} font-size="10.5" fill="${C.mute}" text-anchor="middle">${C.T(q)}</text>`;
   const ti=C.tip(q,[[C.cat[0],b+'K','2026'],[prev,a+'K','2025'],[null,'+'+Math.round((b/a-1)*100)+'% year on year']]);o+=hit(cx-band/2,y0,band,y1-y0,ti,q);});
  o+=legend(C,[['2026',C.cat[0]],['2025',prev]],x0-28,70);return o;},
 table(){return {head:['Quarter','2026 (K)','2025 (K)'],rows:D.quarters.labels.map((q,i)=>[q,D.quarters.now[i],D.quarters.prev[i]])};}};

K.stacked={name:'Stacked columns',note:'Part-to-whole over time; four parts at most, a 2px surface gap between segments.',
 title:'TikTok and YouTube carry the growth',sub:'Hours watched by platform, thousands, Jul–Dec',h:310,
 draw(C,W){const names=Object.keys(D.stack.series),x0=52,x1=W-24,y0=96,y1=270,tot=D.stack.labels.map((_,i)=>names.reduce((a,n)=>a+D.stack.series[n][i],0)),g=gridY(C,x0,x1,y0,y1,Math.max(...tot));let o=g.o;
  const band=(x1-x0)/6,bw=Math.min(24,band*.55);
  D.stack.labels.forEach((m,i)=>{const cx=x0+band*(i+.5);let base=y1;names.forEach((n,k)=>{const v=D.stack.series[n][i],h=y1-g.sy(v),top=k===names.length-1;
    const y=base-h+(k?2:0),hh=h-(k?2:0);o+=fill(C,top?bar(cx-bw/2,y,bw,hh,C.r,'up'):`M${cx-bw/2} ${y}h${bw}v${hh}h${-bw}Z`,C.cat[k],{pts:barPts(cx-bw/2,y,bw,hh),seed:i*5+k,hl:top,flat:true});base-=h;});
   o+=`<text x="${cx}" y="${y1+18}" ${C.FM} font-size="10.5" fill="${C.mute}" text-anchor="middle">${C.T(m)}</text>`;
   const ti=C.tip(m,[...names.map((n,k)=>[C.cat[k],D.stack.series[n][i]+'K h',n]).reverse(),[null,'Total '+tot[i].toFixed(1)+'K h']]);o+=hit(cx-band/2,y0,band,y1-y0,ti,m);});
  o+=legend(C,names.map((n,k)=>[n,C.cat[k]]),x0-28,70);return o;},
 table(){const n=Object.keys(D.stack.series);return {head:['Month',...n],rows:D.stack.labels.map((m,i)=>[m,...n.map(k=>D.stack.series[k][i])])};}};

K.donut={name:'Donut',note:'Part-to-whole at a glance, five parts or fewer; the total in the middle, values in the legend.',
 title:'YouTube is still the biggest audience',sub:'Share of audience by platform, last 90 days',h:300,
 draw(C,W){const cx=150,cy=180,R=86,r=C.t.clay||C.t.neu?54:60;let a=-Math.PI/2,o='';const gapA=2/R;
  D.share.forEach(([n,v],k)=>{const sweep=v/100*Math.PI*2,a0=a+gapA/2,a1=a+sweep-gapA/2,large=sweep>Math.PI?1:0;
   const p=(ang,rad)=>[cx+Math.cos(ang)*rad,cy+Math.sin(ang)*rad];const [x0,y0]=p(a0,R),[x1,y1]=p(a1,R),[x2,y2]=p(a1,r),[x3,y3]=p(a0,r);
   const d=`M${x0} ${y0}A${R} ${R} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 ${large} 0 ${x3} ${y3}Z`;o+=fill(C,d,C.cat[k],{hl:false,flat:k>0});
   const ti=C.tip(n,[[C.cat[k],v+'%','of audience']]);o+=`<path d="${d}" fill="transparent" data-tip="${ti}" tabindex="0" role="graphics-symbol" aria-label="${n} ${v}%"/>`;a+=sweep;});
  o+=`<text x="${cx}" y="${cy-2}" ${C.F} font-size="24" font-weight="600" fill="${C.ink}" text-anchor="middle">108K</text><text x="${cx}" y="${cy+18}" ${C.F} font-size="11.5" fill="${C.mute}" text-anchor="middle">${C.T('viewers')}</text>`;
  D.share.forEach(([n,v],k)=>{const y=126+k*28;o+=`<rect x="${290}" y="${y-6}" width="12" height="12" rx="${C.r?3:0}" fill="${C.cat[k]}"/><text x="${310}" y="${y+4}" ${C.F} font-size="12.5" fill="${C.ink}">${esc(C.T(n))}</text><text x="${W-30}" y="${y+4}" ${C.F} font-size="12.5" font-weight="600" fill="${C.ink}" text-anchor="end" style="font-variant-numeric:tabular-nums">${v}%</text>`;});
  return o;},
 table(){return {head:['Platform','Share'],rows:D.share.map(([n,v])=>[n,v+'%'])};}};

K.table={name:'Table with sparklines',note:'Exact values that must align: tabular figures, a bar in the cell, a trend line per row.',
 title:'Nonna Lucia leads on reach and retention',sub:'Per chef, all episodes to date',h:270,
 draw(C,W){const y0=96,rh=40,cols=[24,190,250,410,W-24];let o='';const max=412;
  o+=`<text x="${cols[0]}" y="${y0-10}" ${C.F} font-size="11" fill="${C.mute}">${C.T('Chef')}</text><text x="${cols[2]-14}" y="${y0-10}" ${C.F} font-size="11" fill="${C.mute}" text-anchor="end">${C.T('Episodes')}</text><text x="${cols[2]}" y="${y0-10}" ${C.F} font-size="11" fill="${C.mute}">${C.T('Views')}</text><text x="${cols[3]}" y="${y0-10}" ${C.F} font-size="11" fill="${C.mute}">${C.T('Trend')}</text><text x="${cols[4]}" y="${y0-10}" ${C.F} font-size="11" fill="${C.mute}" text-anchor="end">${C.T('Retention')}</text>`;
  o+=`<line x1="${cols[0]}" x2="${cols[4]}" y1="${y0-2}" y2="${y0-2}" stroke="${C.t.id==='brutal'?'#000':alpha(C.ink,.4)}" stroke-width="${C.t.id==='brutal'?2:1}"/>`;
  D.chefs.forEach(([n,c,e,v,sp,ret],i)=>{const y=y0+i*rh;o+=`<text x="${cols[0]}" y="${y+18}" ${C.F} font-size="12.5" font-weight="600" fill="${C.ink}">${esc(C.T(n))}</text><text x="${cols[0]}" y="${y+33}" ${C.F} font-size="11" fill="${C.mute}">${esc(c)}</text>`;
   o+=`<text x="${cols[2]-14}" y="${y+24}" ${C.F} font-size="12.5" fill="${C.ink}" text-anchor="end" style="font-variant-numeric:tabular-nums">${e}</text>`;
   const bw=(v/max)*110;o+=fill(C,bar(cols[2],y+14,bw,10,Math.min(C.r,4),'right'),i===0?C.cat[0]:mix(C.cat[0],C.cardBg,.5),{pts:barPts(cols[2],y+14,bw,10),seed:i+2,hl:false,flat:true})+`<text x="${cols[2]+bw+6}" y="${y+23}" ${C.F} font-size="11.5" fill="${C.ink}" style="font-variant-numeric:tabular-nums">${v}K</text>`;
   const mn=Math.min(...sp),mx=Math.max(...sp),P=sp.map((d,j)=>[cols[3]+j*(84/(sp.length-1)),y+28-(d-mn)/(mx-mn)*16]);o+=line(C,P,i===0?C.cat[0]:alpha(C.mute,.8),1.6)+dot(C,...P[P.length-1],i===0?C.cat[0]:C.mute,2.4);
   o+=`<text x="${cols[4]}" y="${y+24}" ${C.F} font-size="12.5" font-weight="${i===0?600:400}" fill="${C.ink}" text-anchor="end" style="font-variant-numeric:tabular-nums">${ret}%</text>`;
   if(i<D.chefs.length-1)o+=`<line x1="${cols[0]}" x2="${cols[4]}" y1="${y+rh}" y2="${y+rh}" stroke="${C.grid||alpha(C.ink,.1)}" stroke-width="1"/>`;
   const ti=C.tip(n,[[null,e+' episodes'],[C.cat[0],v+'K views'],[null,ret+'% average retention']]);o+=hit(cols[0],y,cols[4]-cols[0],rh,ti,n);});return o;},
 table(){return {head:['Chef','Cuisine','Episodes','Views (K)','Retention'],rows:D.chefs.map(r=>[r[0],r[1],r[2],r[3],r[5]+'%'])};}};

K.heatmap={name:'Heatmap',note:'Magnitude across two dimensions; one hue light to dark, with a scale legend.',
 title:'Weekend evenings are the sweet spot',sub:'Average views per upload in the first 24 hours, thousands',h:330,
 draw(C,W){const x0=64,y0=96,cw=Math.min(62,(W-x0-30)/6),ch=26,gap=2,mx=47,mn=10;let o='';
  D.heat.cols.forEach((c,j)=>o+=`<text x="${x0+j*cw+cw/2}" y="${y0-8}" ${C.FM} font-size="10.5" fill="${C.mute}" text-anchor="middle">${C.T(c)}</text>`);
  D.heat.rows.forEach((r,i)=>{o+=`<text x="${x0-10}" y="${y0+i*ch+ch/2+4}" ${C.FM} font-size="10.5" fill="${C.mute}" text-anchor="end">${C.T(r)}</text>`;
   D.heat.v[i].forEach((v,j)=>{const k=Math.min(4,Math.floor((v-mn)/(mx-mn+1)*5)),col=C.seq[k],x=x0+j*cw,y=y0+i*ch;
    o+=`<rect x="${x+gap/2}" y="${y+gap/2}" width="${cw-gap}" height="${ch-gap}" rx="${C.r?3:0}" fill="${col}"${C.t.multiply?' style="mix-blend-mode:multiply"':''}/>`;
    if(v>=44)o+=`<text x="${x+cw/2}" y="${y+ch/2+4}" ${C.F} font-size="10.5" font-weight="600" fill="${onFill(col,C.t)}" text-anchor="middle">${v}K</text>`;
    const ti=C.tip(`${r} · ${D.heat.cols[j]}`,[[col,v+'K views']]);o+=hit(x,y,cw,ch,ti,`${r} ${D.heat.cols[j]}`);});});
  const lx=x0,ly=y0+7*ch+18;o+=`<text x="${lx}" y="${ly+4}" ${C.F} font-size="11" fill="${C.mute}">${C.T('Fewer')}</text>`;C.seq.forEach((c,k)=>o+=`<rect x="${lx+44+k*26}" y="${ly-6}" width="24" height="12" rx="${C.r?2:0}" fill="${c}"/>`);o+=`<text x="${lx+44+5*26+6}" y="${ly+4}" ${C.F} font-size="11" fill="${C.mute}">${C.T('More')}</text>`;
  return o;},
 table(){return {head:['Day',...D.heat.cols],rows:D.heat.rows.map((r,i)=>[r,...D.heat.v[i].map(v=>v+'K')])};}};

K.sankey={name:'Flow (sankey)',note:'Where volume goes between stages; ribbon width is the quantity, colour follows the source.',
 title:'Recommendations bring the viewers who stay',sub:'Viewer flow from source to platform to outcome, thousands',h:340,
 draw(C,W){const cols=[118,W/2,W-150],y0=86,H=210,nw=12,gp=10;let o='';const S=D.sankey;
  const lay=(vals)=>{const tot=vals.reduce((a,b)=>a+b,0),sc=(H-gp*(vals.length-1))/tot;let y=y0;return vals.map(v=>{const r={y,h:v*sc};y+=v*sc+gp;return r;});};
  const srcV=S.src.map(s=>s[1]),midV=S.mid.map((_,j)=>S.a.reduce((a,r)=>a+r[j],0)),outV=S.out.map((_,k)=>S.b.reduce((a,r)=>a+r[k],0));
  const A=lay(srcV),B=lay(midV),Cc=lay(outV),sc=A[0].h/srcV[0];
  const ribbon=(x0,ya,x1,yb,h,col,ti,lab)=>{const mx=(x0+x1)/2,d=`M${x0} ${ya}C${mx} ${ya} ${mx} ${yb} ${x1} ${yb}V${yb+h}C${mx} ${yb+h} ${mx} ${ya+h} ${x0} ${ya+h}Z`;return `<path d="${d}" fill="${col}" opacity="${C.t.dark?.42:.32}"${C.t.multiply?' style="mix-blend-mode:multiply"':''}/><path d="${d}" fill="transparent" data-tip="${ti}" tabindex="0" role="graphics-symbol" aria-label="${esc(lab)}"/>`;};
  const offA=A.map(a=>a.y),inB=B.map(b=>b.y),offB=B.map(b=>b.y),inC=Cc.map(c=>c.y);
  S.a.forEach((row,i)=>row.forEach((v,j)=>{const h=v*sc;o+=ribbon(cols[0]+nw,offA[i],cols[1],inB[j],h,C.cat[i],C.tip(`${S.src[i][0]} → ${S.mid[j]}`,[[C.cat[i],v+'K viewers']]),`${S.src[i][0]} to ${S.mid[j]}`);offA[i]+=h;inB[j]+=h;}));
  S.b.forEach((row,j)=>row.forEach((v,k)=>{const h=v*sc;const col=k===2?(C.t.dark?'#5A5F6B':'#B9B6AE'):C.cat[j];o+=ribbon(cols[1]+nw,offB[j],cols[2],inC[k],h,col,C.tip(`${S.mid[j]} → ${S.out[k]}`,[[col,v+'K viewers']]),`${S.mid[j]} to ${S.out[k]}`);offB[j]+=h;inC[k]+=h;}));
  const node=(x,r,col,label,v,anchor)=>fill(C,`M${x} ${r.y}h${nw}v${r.h}h${-nw}Z`,col,{hl:false,flat:true})+`<text x="${anchor==='end'?x-8:x+nw+8}" y="${r.y+r.h/2+4}" ${C.F} font-size="11.5" fill="${C.ink}" text-anchor="${anchor}" paint-order="stroke" stroke="${C.cardBg}" stroke-width="4" stroke-linejoin="round"><tspan font-weight="600">${esc(C.T(label))}</tspan> <tspan fill="${C.mute}">${v}K</tspan></text>`;
  A.forEach((r,i)=>o+=node(cols[0],r,C.cat[i],S.src[i][0],srcV[i],'end'));B.forEach((r,j)=>o+=node(cols[1],r,C.t.dark?'#8A90A0':C.ink,S.mid[j],midV[j],'start'));Cc.forEach((r,k)=>o+=node(cols[2],r,k===2?(C.t.dark?'#5A5F6B':'#9A968E'):C.t.good,S.out[k],outV[k],'start'));
  return o;},
 table(){const S=D.sankey;const rows=[];S.a.forEach((r,i)=>r.forEach((v,j)=>rows.push([S.src[i][0],S.mid[j],v])));S.b.forEach((r,j)=>r.forEach((v,k)=>rows.push([S.mid[j],S.out[k],v])));return {head:['From','To','Viewers (K)'],rows};}};

K.timeline={name:'Roadmap timeline',note:'Phases over time with state: done, now, next. A today line anchors the reader.',
 title:'Pilot episodes are in production now',sub:'2026 channel roadmap',h:290,
 draw(C,W){const x0=150,x1=W-24,y0=82,rh=34,m=i=>x0+i*(x1-x0)/12;let o='';const mi=s=>MONTHS.indexOf(s);
  ['Jan','Apr','Jul','Oct'].forEach(q=>{const x=m(mi(q));o+=`<text x="${x}" y="${y0-8}" ${C.FM} font-size="10.5" fill="${C.mute}">${C.T(q)}</text>`;if(C.grid)o+=`<line x1="${x}" x2="${x}" y1="${y0}" y2="${y0+5*rh}" stroke="${C.grid}"/>`;});
  D.roadmap.forEach(([n,a,b,st],i)=>{const y=y0+i*rh+8,xa=m(mi(a)),xb=m(mi(b)+1),h=18,col=st==='done'?mix(C.cat[0],C.cardBg,.55):st==='now'?C.cat[0]:C.cardBg;
   o+=`<text x="${x0-12}" y="${y+h/2+4}" ${C.F} font-size="12" fill="${C.ink}" text-anchor="end" font-weight="${st==='now'?600:400}">${esc(C.T(n))}</text>`;
   if(st==='next')o+=`<path d="${bar(xa,y,xb-xa,h,Math.min(C.r+2,h/2),'right')}" fill="${C.cardBg}" stroke="${C.cat[0]}" stroke-width="1.5" stroke-dasharray="4 3"/>`;else o+=fill(C,`M${xa+Math.min(C.r,8)} ${y}H${xb-Math.min(C.r,8)}Q${xb} ${y} ${xb} ${y+Math.min(C.r,8)}V${y+h-Math.min(C.r,8)}Q${xb} ${y+h} ${xb-Math.min(C.r,8)} ${y+h}H${xa+Math.min(C.r,8)}Q${xa} ${y+h} ${xa} ${y+h-Math.min(C.r,8)}V${y+Math.min(C.r,8)}Q${xa} ${y} ${xa+Math.min(C.r,8)} ${y}Z`,col,{pts:barPts(xa,y,xb-xa,h),seed:i+4,glow:st==='now'});
   const lbl=st==='done'?'✓ Done':st==='now'?'In progress':'Next';o+=`<text x="${xa+8}" y="${y+h/2+4}" ${C.F} font-size="10.5" font-weight="600" fill="${st==='now'?onFill(C.cat[0],C.t):C.ink}">${C.T(lbl)}</text>`;
   const ti=C.tip(n,[[st==='next'?null:col,`${a} – ${b}`],[null,lbl.replace('✓ ','')]]);o+=hit(0,y-8,W,rh,ti,n);});
  const tx=m(5.5);o+=`<line x1="${tx}" x2="${tx}" y1="${y0-2}" y2="${y0+5*rh+8}" stroke="${C.t.bad}" stroke-width="1.5"/><text x="${tx+5}" y="${y0+5*rh+20}" ${C.F} font-size="11" font-weight="600" fill="${C.ink}">${C.T('Today')}</text>`;return o;},
 table(){return {head:['Phase','Start','End','State'],rows:D.roadmap.map(r=>[r[0],r[1],r[2],r[3]])};}};

K.gauge={name:'Goal meter',note:'Progress against a target: a ring for the headline, a bar for the detail; the track is a pale step of the same hue.',
 title:'79% of the way to this month’s goal',sub:'Views this month against a 300K target',h:280,
 draw(C,W){const g=D.goal,p=g.value/g.target,cx=140,cy=168,R=78,sw=C.t.clay||C.t.neu?18:12,track=C.seq[0];let o='';
  const arc=(a0,a1,col,w)=>{const P=a=>[cx+Math.cos(a)*R,cy+Math.sin(a)*R],[x0,y0]=P(a0),[x1,y1]=P(a1);return `<path d="M${x0} ${y0}A${R} ${R} 0 ${a1-a0>Math.PI?1:0} 1 ${x1} ${y1}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="${C.r?'round':'butt'}"${C.t.neu?` filter="url(#${C.uid}u)"`:''}/>`;};
  const s=Math.PI*.75,e=Math.PI*2.25;o+=arc(s,e,C.t.dark?alpha('#FFFFFF',.12):mix(track,C.cardBg,.4),sw)+arc(s,s+(e-s)*p,C.cat[0],sw);
  if(C.t.glow)o+=`<path d="M${cx+Math.cos(s)*R} ${cy+Math.sin(s)*R}A${R} ${R} 0 1 1 ${cx+Math.cos(s+(e-s)*p)*R} ${cy+Math.sin(s+(e-s)*p)*R}" fill="none" stroke="${C.cat[0]}" stroke-width="${sw}" opacity=".45" filter="url(#${C.uid}g)"/>`;
  o+=`<text x="${cx}" y="${cy+4}" ${C.F} font-size="30" font-weight="600" fill="${C.ink}" text-anchor="middle">${Math.round(p*100)}%</text><text x="${cx}" y="${cy+24}" ${C.F} font-size="11.5" fill="${C.mute}" text-anchor="middle">${g.value}K of ${g.target}K</text>`;
  const bx=280,bw=W-bx-30,by=128;[['Views',236,300,C.cat[0]],['Watch time',18.2,20,C.cat[0]],['New subscribers',2.4,4,C.t.bad]].forEach(([n,v,t2,col],i)=>{const y=by+i*44,w=bw*Math.min(1,v/t2);
   o+=`<text x="${bx}" y="${y-6}" ${C.F} font-size="12" fill="${C.ink}">${esc(C.T(n))}</text><text x="${bx+bw}" y="${y-6}" ${C.F} font-size="11.5" fill="${C.mute}" text-anchor="end" style="font-variant-numeric:tabular-nums">${Math.round(v/t2*100)}%</text>`;
   o+=`<path d="${bar(bx,y,bw,8,C.r?4:0,'right')}" fill="${C.t.dark?alpha('#FFFFFF',.1):mix(col===C.t.bad?mix(col,'#FFFFFF',.6):track,C.cardBg,.4)}"/>`+fill(C,bar(bx,y,w,8,C.r?4:0,'right'),col,{hl:false,flat:true});
   const ti=C.tip(n,[[col,`${v} of ${t2}`],[null,Math.round(v/t2*100)+'% of target'+(col===C.t.bad?' · behind':'')]]);o+=hit(bx,y-22,bw,34,ti,n);});
  o+=`<text x="${bx}" y="${by+3*44-4}" ${C.F} font-size="11" fill="${C.mute}">${C.T('Red marks a target that is behind pace.')}</text>`;return o;},
 table(){return {head:['Goal','Progress'],rows:[['Views','236K of 300K (79%)'],['Watch time','18.2K of 20K h (91%)'],['New subscribers','2.4K of 4K (60%)']]};}};

K.funnel={name:'Funnel',note:'Ordered stages take a one-hue ramp, dark to light as volume falls; step rates beside each stage.',
 title:'One in three finishers subscribes… of the few who finish',sub:'Viewer funnel, last 30 days',h:300,
 draw(C,W){const x0=150,x1=W-110,y0=84,h=30,gap=8,mx=Math.log10(1.2e6),mn=Math.log10(2e3);let o='';const seq=[...C.seq].reverse();
  D.funnel.forEach(([n,v],i)=>{const w=Math.max(18,(Math.log10(v)-mn)/(mx-mn)*(x1-x0)),x=x0+((x1-x0)-w)/2,y=y0+i*(h+gap),col=seq[i];
   o+=`<text x="${x0-12}" y="${y+h/2+4}" ${C.F} font-size="12" fill="${C.ink}" text-anchor="end">${esc(C.T(n))}</text>`;
   o+=fill(C,`M${x+Math.min(C.r,6)} ${y}H${x+w-Math.min(C.r,6)}Q${x+w} ${y} ${x+w} ${y+Math.min(C.r,6)}V${y+h-Math.min(C.r,6)}Q${x+w} ${y+h} ${x+w-Math.min(C.r,6)} ${y+h}H${x+Math.min(C.r,6)}Q${x} ${y+h} ${x} ${y+h-Math.min(C.r,6)}V${y+Math.min(C.r,6)}Q${x} ${y} ${x+Math.min(C.r,6)} ${y}Z`,col,{pts:barPts(x,y,w,h),seed:i+6,hl:i===0,flat:true});
   const fits=w>70;o+=`<text x="${fits?x+w/2:x+w+8}" y="${y+h/2+4}" ${C.F} font-size="11.5" font-weight="600" fill="${fits?onFill(col,C.t):C.ink}" text-anchor="${fits?'middle':'start'}" style="font-variant-numeric:tabular-nums">${compact(v)}</text>`;
   if(i)o+=`<text x="${W-24}" y="${y+h/2+4}" ${C.F} font-size="11.5" fill="${C.mute}" text-anchor="end">${(v/D.funnel[i-1][1]*100).toFixed(v/D.funnel[i-1][1]<.1?1:0)}%</text>`;
   const ti=C.tip(n,[[col,v.toLocaleString('en-GB')],[null,i?`${(v/D.funnel[i-1][1]*100).toFixed(1)}% of ${D.funnel[i-1][0].toLowerCase()}`:'Top of funnel']]);o+=hit(0,y-gap/2,W,h+gap,ti,n);});
  o+=`<text x="${W-24}" y="${y0-10}" ${C.F} font-size="11" fill="${C.mute}" text-anchor="end">${C.T('Step rate')}</text>`;return o;},
 table(){return {head:['Stage','Viewers','Step rate'],rows:D.funnel.map(([n,v],i)=>[n,v.toLocaleString('en-GB'),i?(v/D.funnel[i-1][1]*100).toFixed(1)+'%':'—'])};}};
K.funnel.title='Fewer than one in four finishers subscribe';

/* ---------------- frame ---------------- */
function render(kind,s,opt={}){const k=K[kind],C=ctx(s,kind),t=s.t,W=opt.width||560,hasSrc=!!(t.tag||t.id==='newsroom'||t.id==='tufte'),H=k.h+(hasSrc?18:0);if(window.DVFonts)window.DVFonts(s);
 const body=k.draw(C,W);const tex=window.DVTexture&&t.texture&&t.texture!=='none'&&t.texture!=='dots'?window.DVTexture(s,C.uid+'t',W,H):null;
 let bg=tex?tex.rect:`<rect width="${W}" height="${H}" fill="${t.neu?t.bg:t.glow?'#0E1320':C.cardBg}"/>`;if(tex)C.defs+=tex.defs;
 if(t.frost)bg+=`<rect width="${W}" height="${H}" fill="rgba(255,255,255,.62)"/>`;if(t.glow&&tex)bg+=`<rect width="${W}" height="${H}" fill="rgba(255,255,255,.035)"/>`;
 if(t.texture==='dots')C.defs+=`<pattern id="${C.uid}d" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="${t.grid}"/></pattern>`,bg+=`<rect width="${W}" height="${H}" fill="url(#${C.uid}d)" opacity=".6"/>`;
 const titleSize=t.serifTitle||t.id==='tufte'||t.id==='editorial'?19:16.5,titleFont=t.serifTitle||t.id==='tufte'||t.id==='editorial'?t.head:t.font,tag=t.tag?`<rect x="24" y="14" width="30" height="5" fill="${t.accent}"/>`:'';
 const head=`${tag}<text x="24" y="${t.tag?42:36}" font-family="${esc(titleFont)}" font-size="${titleSize}" font-weight="${t.id==='brutal'?400:600}" fill="${C.ink}">${esc(C.T(k.title))}</text><text x="24" y="${t.tag?60:54}" ${C.F} font-size="12" fill="${C.mute}">${esc(k.sub)}</text>`;
 const src=hasSrc?`<text x="24" y="${H-12}" ${C.F} font-size="10.5" fill="${C.mute}">${C.T('Source: channel analytics, illustrative data')}</text>`:'';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(k.title)}. ${esc(k.sub)}."><defs>${C.defs}</defs>${bg}${head}${body}${src}${tex&&tex.over?tex.over:''}</svg>`;
 return {svg,tips:C.tips,table:k.table(),title:k.title,sub:k.sub,name:k.name,note:k.note,height:H,width:W};}

window.DVCharts={kinds:Object.keys(K).map(id=>({id,name:K[id].name,note:K[id].note})),render,data:D};
})();
