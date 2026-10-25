'use strict';
/* DVChartMaker: the data-driven chart engine behind the chart studio.
   Charts are drawn from any table (CSV/TSV/JSON or the grid) in any style from dataviz/styles.js, using the
   same drawing kit as the chart style guides (DVCharts.kit), so a chart made here matches the guide for its style.
   Method (the dataviz skill): pick the form from the data's job first (recommend), colour last; categorical hues
   in fixed slot order following the entity; thin marks with a 4px data end; 2px surface gaps; hairline solid grids;
   a legend for 2+ series plus selective direct labels; text always in ink tokens; status colours reserved;
   palettes computed and validated (validate) rather than eyeballed, in the mode actually shown.
   render(kind, table, style, opt) -> {svg, tips, width, height, desc, warnings, palette, pairs, style}
   Every hoverable mark carries data-tip="i" into tips; marks carry data-a/data-ai for the build-up (plan). */
(()=>{
const KIT=()=>window.DVCharts.kit;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let mctx=null;
const measure=(t,size,w,f)=>{if(!mctx&&typeof document!=='undefined')mctx=document.createElement('canvas').getContext('2d');if(!mctx)return String(t).length*size*.56;mctx.font=`${w} ${size}px ${f}`;return mctx.measureText(String(t)).width;};
const clip=(t,size,w,f,max)=>{t=String(t);if(measure(t,size,w,f)<=max)return t;while(t.length>1&&measure(t+'…',size,w,f)>max)t=t.slice(0,-1);return t.trimEnd()+'…';};
const wrapT=(text,size,w,f,max)=>{const words=String(text).split(/\s+/).filter(Boolean),out=[];let line='';for(const wd of words){const tt=line?line+' '+wd:wd;if(measure(tt,size,w,f)<=max||!line)line=tt;else{out.push(line);line=wd;}}if(line)out.push(line);return out.length?out:[''];};
const sum=a=>a.reduce((x,y)=>x+(isFinite(y)?y:0),0);
const fin=a=>a.filter(v=>typeof v==='number'&&isFinite(v));

/* ---------------- colour science (port of the dataviz skill's validate_palette.js) ---------------- */
const BAND={light:[.43,.77],dark:[.48,.67]},CHROMA=.10,CVD_T=8,CVD_F=6,NORMAL=15;
const MACH={protan:[[.152286,1.052583,-.204868],[.114503,.786281,.099216],[-.003882,-.048116,1.051998]],deutan:[[.367322,.860646,-.227968],[.280085,.672501,.047413],[-.01182,.04294,.968881]],tritan:[[1.255528,-.076749,-.178779],[-.078411,.930809,.147602],[.004733,.691367,.3039]]};
const isHex=h=>/^#[0-9a-f]{6}$/i.test(h);
const s2l=c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4,l2s=c=>{c=Math.max(0,Math.min(1,c));return c<=.0031308?12.92*c:1.055*c**(1/2.4)-.055;};
const lin=h=>[1,3,5].map(i=>s2l(parseInt(h.slice(i,i+2),16)/255));
const relLum=h=>{const [r,g,b]=lin(h);return .2126*r+.7152*g+.0722*b;};
const contrast=(a,b)=>{const [x,y]=[relLum(a),relLum(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05);};
const labL=([r,g,b])=>{const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
 return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s];};
const oklab=h=>labL(lin(h));
const fromLab=([L,a,b])=>{const l=(L+.3963377774*a+.2158037573*b)**3,m=(L-.1055613458*a-.0638541728*b)**3,s=(L-.0894841775*a-1.291485548*b)**3;
 return [4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s];};
const linHex=rgb=>'#'+rgb.map(c=>Math.round(l2s(c)*255).toString(16).padStart(2,'0')).join('').toUpperCase();
/* OKLCH -> hex, reducing chroma until the colour is inside sRGB */
const lchHex=(L,C,H)=>{for(let c=C;c>=0;c-=.004){const rgb=fromLab([L,c*Math.cos(H),c*Math.sin(H)]);if(rgb.every(v=>v>=-1e-4&&v<=1+1e-4))return linHex(rgb);}return linHex(fromLab([L,0,0]));};
const lch=h=>{const [L,a,b]=oklab(h);return [L,Math.hypot(a,b),Math.atan2(b,a)];};
/* snap a hue into a lightness band, keeping its hue and as much chroma as fits */
const snapL=(h,lo,hi)=>{if(!isHex(h))return h;const [L,C,H]=lch(h);if(L>=lo&&L<=hi)return h.toUpperCase();return lchHex(Math.max(lo+.01,Math.min(hi-.01,L)),Math.max(C,CHROMA+.01),H);};
const sim=(h,k)=>{const [r,g,b]=lin(h),M=MACH[k],c=v=>Math.max(0,Math.min(1,v));return [c(M[0][0]*r+M[0][1]*g+M[0][2]*b),c(M[1][0]*r+M[1][1]*g+M[1][2]*b),c(M[2][0]*r+M[2][1]*g+M[2][2]*b)];};
const dE=(a,b,k)=>{const x=labL(k?sim(a,k):lin(a)),y=labL(k?sim(b,k):lin(b));return 100*Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2]);};
const pairList=(n,pairs)=>pairs==='all'?[...Array(n)].flatMap((_,i)=>[...Array(n-i-1)].map((_,k)=>[i,i+1+k])):[...Array(Math.max(0,n-1))].map((_,i)=>[i,i+1]);
/* validate(palette,{mode,surface,pairs}) -> {checks:[{name,state:'pass'|'warn'|'fail',detail}], ok, cvd, normal} */
function validate(pal,{mode='light',surface,pairs='adjacent'}={}){pal=pal.filter(isHex);surface=isHex(surface)?surface:(mode==='dark'?'#1A1A19':'#FCFCFB');const [lo,hi]=BAND[mode],out=[];let ok=true;
 const off=pal.filter(c=>{const L=lch(c)[0];return L<lo||L>hi;});if(off.length)ok=false;
 out.push({name:'Lightness band',state:off.length?'fail':'pass',detail:off.length?`${off.join(', ')} outside OKLCH L ${lo}–${hi} for ${mode} mode`:`all ${pal.length} inside L ${lo}–${hi}`});
 const low=pal.filter(c=>lch(c)[1]<CHROMA);if(low.length)ok=false;
 out.push({name:'Chroma floor',state:low.length?'fail':'pass',detail:low.length?`${low.join(', ')} read as grey`:`all ${pal.length} at C ≥ ${CHROMA}`});
 const pl=pairList(pal.length,pairs);let worst=null;for(const k of ['protan','deutan'])for(const [i,j] of pl){const d=dE(pal[i],pal[j],k);if(!worst||d<worst[0])worst=[d,k,pal[i],pal[j]];}
 const cvd=worst?worst[0]:99,cst=cvd>=CVD_T?'pass':cvd>=CVD_F?'warn':'fail';if(cst==='fail')ok=false;
 out.push({name:'Colour-blind separation',state:cst,detail:worst?`worst ${pairs==='all'?'pair':'neighbours'} ${worst[2]} ↔ ${worst[3]} ΔE ${cvd.toFixed(1)} (${worst[1]})${cst==='warn'?' · 6–8 floor band: keep direct labels or the table on':cst==='fail'?' · below 6, too close':''}`:'one colour, nothing to separate'});
 let nw=null;for(const [i,j] of pl){const d=dE(pal[i],pal[j]);if(!nw||d<nw[0])nw=[d,pal[i],pal[j]];}const normal=nw?nw[0]:99;if(normal<NORMAL)ok=false;
 out.push({name:'Normal-vision separation',state:normal>=NORMAL?'pass':'fail',detail:nw?`worst ${nw[1]} ↔ ${nw[2]} ΔE ${normal.toFixed(1)}${normal<NORMAL?' · below 15, hard to tell apart for anyone':''}`:'one colour'});
 const lc=pal.filter(c=>contrast(c,surface)<3);
 out.push({name:'Contrast vs surface',state:lc.length?'warn':'pass',detail:lc.length?`${lc.join(', ')} under 3:1 on ${surface} · labels or the table must carry these`:`all ≥ 3:1 on ${surface}`});
 return {checks:out,ok,cvd,normal};}
/* the order of the style's slots that keeps the n colours in use furthest apart (slot 1 stays first) */
function bestOrder(cat,n,pairs='adjacent'){cat=cat.filter(isHex);n=Math.min(n,cat.length);if(n<2)return [...Array(n).keys()];let best=null;
 const idx=[...cat.keys()].slice(1),perm=(arr,k)=>k===0?[[]]:arr.flatMap((v,i)=>perm([...arr.slice(0,i),...arr.slice(i+1)],k-1).map(p=>[v,...p]));
 for(const p of perm(idx,n-1)){const o=[0,...p],pal=o.map(i=>cat[i]),pl=pairList(n,pairs);let c=99,m=99;for(const [i,j] of pl){c=Math.min(c,dE(pal[i],pal[j],'protan'),dE(pal[i],pal[j],'deutan'));m=Math.min(m,dE(pal[i],pal[j]));}
  const sc=Math.min(c,12)*10+Math.min(m,30);if(!best||sc>best[0])best=[sc,o];}
 return best[1];}

/* ---------------- light / dark: the opposite mode is computed from the style, then validated ---------------- */
const derived=new Map();
function modeStyle(s,mode){if(!mode||mode==='auto'||(mode==='dark')===!!s.t.dark)return s;
 if(s.id==='noir'&&mode==='light')return window.DVStyle('paper');if(s.id==='paper'&&mode==='dark')return window.DVStyle('noir');
 const key=s.id+':'+mode;if(derived.has(key))return derived.get(key);const t=s.t,dark=mode==='dark';
 const [lo,hi]=BAND[mode],cat=(t.cat||t.series).map(c=>snapL(c,lo,hi));
 const seqBase=[...t.seq].sort((a,b)=>lch(a)[0]-lch(b)[0]),hue=lch(seqBase[2]||seqBase[0]);
 const seq=dark?[.38,.5,.62,.74,.86].map(L=>lchHex(L,Math.min(hue[1],.16),hue[2])):[.86,.74,.62,.5,.38].map(L=>lchHex(L,Math.min(hue[1],.16),hue[2]));
 const div=[snapL(t.div[0],lo,hi),t.div[1],dark?'#5A5F6B':'#D9D7D2',t.div[3],snapL(t.div[4],lo,hi)];
 const nt=dark?{bg:'#121419',surface:'#1A1D24',ink:'#ECEEF2',mute:'#A1A7B4',line:'#8B92A0',grid:'rgba(236,238,242,.08)',nodeFill:'#1A1D24',nodeStroke:'#2C313B',good:'#4ADE80',bad:'#F87171'}
  :{bg:'#FAFAF8',surface:'#FFFFFF',ink:'#1A1C22',mute:'#5F6573',line:'#8B92A0',grid:'#E4E6EA',nodeFill:'#FFFFFF',nodeStroke:'#D9DCE2',good:'#15803D',bad:'#C2410C'};
 const tex=dark?(['grain','glow','dots'].includes(t.texture)?t.texture:'none'):(['grain','dots'].includes(t.texture)?t.texture:'none');
 const ns={...s,id:s.id+'-'+mode,baseId:s.id,name:s.name+(dark?' · dark':' · light'),derived:true,
  t:{...t,...nt,cat,series:cat,seq,div,dark,texture:tex,neu:false,frost:false,clay:false,glow:dark&&t.glow,multiply:false,misregister:false,softShadow:dark?[0,6,16,'#000000',.35]:[0,2,8,'#1D2433',.08],accent:cat[0]}};
 derived.set(key,ns);return ns;}
const solidSurface=s=>{const t=s.t;return t.neu?t.bg:t.frost?'#F7F8FC':t.glow?'#121828':isHex(t.surface)?t.surface:(t.dark?'#151A28':'#FFFFFF');};

/* ---------------- data in ---------------- */
function parseNum(v){if(typeof v==='number')return v;let s=String(v??'').trim();if(!s)return NaN;const neg=/^\(.*\)$/.test(s);s=s.replace(/[()£$€¥₹%\s ,]/g,'').replace(/^[−–]/,'-');let m=1;const k=s.match(/^(-?[\d.]+)([kmb])$/i);if(k){s=k[1];m={k:1e3,m:1e6,b:1e9}[k[2].toLowerCase()];}
 if(!/^-?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s))return NaN;const n=parseFloat(s)*m;return neg?-n:n;}
function splitCSV(text,d){const rows=[];let row=[],cell='',q=false;for(let i=0;i<text.length;i++){const c=text[i];
  if(q){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else q=false;}else cell+=c;continue;}
  if(c==='"'&&cell==='')q=true;else if(c===d){row.push(cell);cell='';}else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';}else cell+=c;}
 if(cell!==''||row.length){row.push(cell);rows.push(row);}return rows.filter(r=>r.some(c=>c.trim()!==''));}
/* parse(text) -> {columns:[...], rows:[[...]]}; accepts CSV, TSV, semicolon CSV, JSON (array of objects, array of arrays, {columns,rows}) */
function parse(text){text=String(text||'').replace(/^﻿/,'').trim();if(!text)return {columns:['Label','Value'],rows:[]};
 if(/^[[{]/.test(text)){const j=JSON.parse(text);if(j&&Array.isArray(j.columns)&&Array.isArray(j.rows))return norm(j.columns,j.rows);
  const arr=Array.isArray(j)?j:Array.isArray(j.data)?j.data:Object.values(j).find(Array.isArray);if(!arr||!arr.length)throw new Error('No rows found in that JSON');
  if(Array.isArray(arr[0]))return norm(arr[0].map(String),arr.slice(1));const cols=[...new Set(arr.flatMap(o=>Object.keys(o)))];return norm(cols,arr.map(o=>cols.map(c=>o[c]??'')));}
 const first=text.split(/\r?\n/)[0],d=first.includes('\t')?'\t':(first.split(';').length>first.split(',').length?';':',');const all=splitCSV(text,d).map(r=>r.map(c=>c.trim()));
 const head=all[0].every(c=>isFinite(parseNum(c))&&c!=='')?all[0].map((_,i)=>'Column '+(i+1)):all.shift();return norm(head,all);}
function norm(cols,rows){const n=Math.max(cols.length,...rows.map(r=>r.length),1);cols=[...Array(n)].map((_,i)=>String(cols[i]??'').trim()||'Column '+(i+1));
 return {columns:cols,rows:rows.map(r=>[...Array(n)].map((_,i)=>r[i]==null?'':String(r[i])))};}
const MONTH=/^(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?(\s+'?\d{2,4})?$/i,DAY=/^(mon|tue|wed|thu|fri|sat|sun)[a-z]*$/i;
const timeLike=v=>/^\d{4}([-/.]\d{1,2}([-/.]\d{1,2})?)?$/.test(v)||/^\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}$/.test(v)||MONTH.test(v)||/^(q[1-4]|h[12])(\s*'?\d{2,4})?$/i.test(v)||/^\d{4}\s*(q[1-4]|h[12])$/i.test(v)||/^(fy|w|wk|week)\s*\d+/i.test(v)||DAY.test(v);
/* infer(table) -> per column 'num' | 'time' | 'text' */
function infer(tb){return tb.columns.map((_,c)=>{const v=tb.rows.map(r=>String(r[c]??'').trim()).filter(Boolean);if(!v.length)return 'text';
 const nums=v.filter(x=>isFinite(parseNum(x))).length,times=v.filter(timeLike).length;
 if(times>=v.length*.8&&!(nums===v.length&&!v.every(x=>/^(19|20)\d\d$/.test(x))))return 'time';
 if(nums>=v.length*.7)return 'num';return 'text';});}

/* ---------------- the chart forms ---------------- */
const KINDS=[
 {id:'column',name:'Column',group:'Compare',hint:'Values side by side on one baseline',roles:['x','y'],max:5},
 {id:'bar',name:'Horizontal bar',group:'Compare',hint:'Long or many category names; ranked',roles:['x','y'],max:5,sort:true},
 {id:'stacked',name:'Stacked column',group:'Part to whole',hint:'Parts adding to a total, per category',roles:['x','y'],max:5,fold:true},
 {id:'stacked100',name:'100% stacked',group:'Part to whole',hint:'Share of each part, totals equal',roles:['x','y'],max:5,fold:true},
 {id:'barStacked',name:'Stacked bar',group:'Part to whole',hint:'Parts per category, long names',roles:['x','y'],max:5,fold:true},
 {id:'pie',name:'Pie',group:'Part to whole',hint:'Two to five shares of one whole',roles:['x','y1'],max:5,fold:true},
 {id:'donut',name:'Donut',group:'Part to whole',hint:'Shares with the total in the middle',roles:['x','y1'],max:5,fold:true},
 {id:'treemap',name:'Treemap',group:'Part to whole',hint:'Many parts of one whole, by area',roles:['x','y1','group']},
 {id:'line',name:'Line',group:'Change over time',hint:'Trends for up to five series',roles:['x','y'],max:5},
 {id:'area',name:'Area',group:'Change over time',hint:'One measure over time where volume matters',roles:['x','y1'],max:1},
 {id:'stackedArea',name:'Stacked area',group:'Change over time',hint:'Parts of a total over time',roles:['x','y'],max:5,fold:true},
 {id:'multiples',name:'Small multiples',group:'Change over time',hint:'Many series, one small chart each',roles:['x','y'],max:12},
 {id:'slope',name:'Slope',group:'Change over time',hint:'Before and after for each item',roles:['x','y2']},
 {id:'dumbbell',name:'Dumbbell',group:'Compare',hint:'The gap between two values per item',roles:['x','y2']},
 {id:'waterfall',name:'Waterfall',group:'Compare',hint:'How increases and decreases add up',roles:['x','y1']},
 {id:'bullet',name:'Bullet',group:'Single values',hint:'Actual against target, per row',roles:['x','y2']},
 {id:'kpi',name:'KPI tiles',group:'Single values',hint:'Headline numbers with a sparkline',roles:['x','y'],max:4},
 {id:'gauge',name:'Meter',group:'Single values',hint:'Progress against a target',roles:['x','y2']},
 {id:'funnel',name:'Funnel',group:'Flow',hint:'Ordered stages that narrow',roles:['x','y1']},
 {id:'sankey',name:'Sankey',group:'Flow',hint:'Where volume goes, from → to',roles:['x','label','y1']},
 {id:'histogram',name:'Histogram',group:'Distribution',hint:'How one measure is spread',roles:['y1']},
 {id:'boxplot',name:'Box plot',group:'Distribution',hint:'Spread and median per group',roles:['xg','y'],max:8},
 {id:'heatmap',name:'Heatmap',group:'Compare',hint:'Magnitude across two dimensions',roles:['x','y'],max:24},
 {id:'scatter',name:'Scatter',group:'Relationship',hint:'Two measures per item',roles:['xn','y1','group','label'],pairs:'all'},
 {id:'bubble',name:'Bubble',group:'Relationship',hint:'Two measures plus size',roles:['xn','y1','size','group','label'],pairs:'all'},
 {id:'radar',name:'Radar',group:'Relationship',hint:'Profiles across a few dimensions',roles:['x','y'],max:3,pairs:'all'}];
const KIND=Object.fromEntries(KINDS.map(k=>[k.id,k]));
const ROLE_LABEL={x:'Categories',xg:'Group by',xn:'X axis (number)',y:'Series',y1:'Value',y2:'Values (two)',size:'Bubble size',group:'Colour by',label:'Names'};
const SANKEY_LABEL={x:'From',label:'To',y1:'Amount'};

/* default column roles for a kind and table */
function defaultMap(kind,tb){const ty=infer(tb),idx=[...ty.keys()],txt=idx.filter(i=>ty[i]!=='num'),num=idx.filter(i=>ty[i]==='num');
 const distinct=c=>new Set(tb.rows.map(r=>r[c])).size;const repeats=c=>distinct(c)<tb.rows.length;
 const m={x:txt.length?txt[0]:-1,y:num.slice(0,8),size:-1,group:-1,label:-1};
 if(m.x<0&&num.length>1&&!['scatter','bubble','histogram','boxplot'].includes(kind)){m.x=num[0];m.y=num.slice(1,9);}
 const k=KIND[kind]||{};
 if(k.roles.includes('y1'))m.y=m.y.slice(0,1);
 if(k.roles.includes('y2'))m.y=m.y.slice(0,2);
 if(k.max)m.y=m.y.slice(0,Math.max(k.max,1));
 if(kind==='scatter'||kind==='bubble'){m.x=num[0]??-1;m.y=num.slice(1,2);if(kind==='bubble')m.size=num[2]??-1;m.label=txt[0]??-1;const g=txt.find(c=>repeats(c)&&distinct(c)<=3);m.group=g??-1;if(m.group===m.label)m.label=txt.find(c=>c!==m.group)??-1;}
 if(kind==='sankey'){m.x=txt[0]??-1;m.label=txt[1]??-1;m.y=num.slice(0,1);}
 if(kind==='boxplot'){const g=txt.find(repeats);m.x=g??-1;m.y=g!=null?num.slice(0,1):num.slice(0,8);}
 if(kind==='histogram'){m.x=-1;m.y=num.slice(0,1);}
 if(kind==='treemap'){const g=txt.find(c=>c!==m.x&&repeats(c));m.group=g??-1;}
 return m;}

/* recommend(table) -> ranked [{id,score,why}] following the form heuristic: the data's job picks the chart */
function recommend(tb){const ty=infer(tb),idx=[...ty.keys()],txt=idx.filter(i=>ty[i]==='text'),time=idx.filter(i=>ty[i]==='time'),num=idx.filter(i=>ty[i]==='num'),n=tb.rows.length;
 const R=[];const add=(id,score,why)=>{const e=R.find(r=>r.id===id);if(e){if(score>e.score){e.score=score;e.why=why;}}else R.push({id,score,why});};
 const vals=c=>tb.rows.map(r=>parseNum(r[c])).filter(isFinite);const neg=num.some(c=>vals(c).some(v=>v<0));const nn=num.length;
 const labelCol=txt[0]??time[0],labels=labelCol!=null?tb.rows.map(r=>String(r[labelCol])):[],longNames=labels.some(l=>l.length>14);
 const distinct=c=>new Set(tb.rows.map(r=>r[c])).size;
 if(!n||!nn)return [{id:'column',score:1,why:'Add at least one column of numbers to chart.'}];
 if(n===1){add('kpi',95,'One row of headline numbers: the number is the chart, so use stat tiles, not a one-bar chart.');if(nn>=2)add('gauge',70,'A value against a target reads as a meter.');add('bullet',55,'Actual against target, with a scale.');}
 if(txt.length>=2&&nn>=1&&labelCol!=null&&distinct(txt[0])<n&&distinct(txt[1])<n)add('sankey',88,'Two name columns and an amount look like flows from one thing to another.');
 if(time.length&&n>=3){if(nn===1){add('line',90,'One measure over time: a line shows the trend.');add('area',72,'An area works when the volume under the line matters.');}
  else if(nn<=5){add('line',92,`${nn} series over time: lines, direct-labelled at the ends.`);add(neg?'column':'stackedArea',70,neg?'Grouped columns keep negative values honest.':'If the series add up to a total, a stacked area shows the parts.');add('stacked',62,'Stacked columns for part-to-whole per period.');}
  else{add('multiples',92,`${nn} series is past the five-colour ceiling: one small chart each, on a shared scale.`);add('heatmap',75,'A heatmap shows every series and period in one grid.');}
  add('kpi',nn<=4?50:30,'Lead a dashboard with the latest value of each series.');}
 if(!time.length&&labelCol!=null){
  if(nn===1){const v=vals(num[0]),pos=v.every(x=>x>=0),dec=v.every((x,i)=>!i||x<=v[i-1]);
   add(longNames||n>7?'bar':'column',88,n>7||longNames?'Compare magnitudes across named things; horizontal bars give long names room, sorted high to low.':'Compare a few values on one baseline.');
   if(dec&&n>=3&&n<=8&&pos&&v[0]>v[v.length-1]*2)add('funnel',84,'Values fall stage by stage: an ordered funnel with step rates.');
   if(pos&&n>=2&&n<=5)add('donut',58,'Part-to-whole with five parts or fewer; bars still compare more precisely.');
   if(pos&&n>8)add('treemap',60,'Many parts of one whole, sized by area.');
   if(neg||/total|net|start|end/i.test(labels.join(' ')))add('waterfall',neg?80:66,'Rises and falls that add up to a total read best as a waterfall.');}
  else if(nn===2){add('dumbbell',80,'Two values per item: a dumbbell shows the gap between them.');add('slope',74,'Before → after for each item; the slope is the change.');add('column',70,'Grouped columns: the two measures side by side.');add('bullet',52,'If the second value is a target, a bullet chart shows actual against it.');
   const g=txt.find(c=>distinct(c)<n);if(!g)add('scatter',48,'Two measures per named item: is there a relationship?');}
  else{add('column',76,`${nn} measures per category: grouped columns, legend plus labels.`);if(n>=3&&nn>=3)add('heatmap',72,'Many categories × many measures: a heatmap shows the grid at once.');if(!neg)add('stacked',66,'If the measures are parts of a whole, stack them.');if(n>=3&&n<=10&&nn<=3)add('radar',40,'Profiles across a few dimensions (use sparingly).');}}
 if(!txt.length&&!time.length&&nn>=2){add('scatter',90,'Two numeric columns: a scatter shows the relationship.');if(nn>=3)add('bubble',78,'A third measure can size the points.');}
 if(nn>=1&&n>=20){const g=txt.find(c=>distinct(c)<=8&&distinct(c)<n);add(g!=null?'boxplot':'histogram',g!=null?86:84,g!=null?'Many values in a few groups: box plots compare the spread and median.':'Many values of one measure: a histogram shows how they are spread.');if(g==null&&nn>1)add('boxplot',60,'Box plots compare the spread of each column.');}
 if(!R.length)add('column',50,'Columns are a safe default for comparing values.');
 return R.sort((a,b)=>b.score-a.score).slice(0,5);}

/* ---------------- number formats ---------------- */
function makeFmt(f={}){const st=f.style||'auto',dp=f.decimals===''||f.decimals==null||f.decimals==='auto'?null:+f.decimals,pre=f.prefix||'',suf=f.suffix||'';
 const cmp=v=>{const a=Math.abs(v),d=dp??(a>=1e10||(a>=1e4&&a<1e6)||(a>=1e7&&a<1e9)?0:1);return a>=1e9?(v/1e9).toFixed(d).replace(/\.0+$/,'')+'B':a>=1e6?(v/1e6).toFixed(d).replace(/\.0+$/,'')+'M':a>=1e3?(v/1e3).toFixed(d).replace(/\.0+$/,'')+'K':plain(v);};
 const plain=v=>{const a=Math.abs(v),d=dp??(a===0||Number.isInteger(v)?0:a<1?2:a<10?1:a<100?1:0);return v.toLocaleString('en-GB',{minimumFractionDigits:dp??0,maximumFractionDigits:d});};
 return v=>{if(typeof v!=='number'||!isFinite(v))return '–';const a=Math.abs(v);let s;
  if(st==='percent')s=plain(a)+'%';else if(st==='compact'||(st==='auto'&&a>=1e4))s=cmp(a);else s=plain(a);return (v<0?'−':'')+pre+s+suf;};}

/* ---------------- shared plotting ---------------- */
function niceScale(lo,hi,n=5){if(!isFinite(lo)||!isFinite(hi)){lo=0;hi=1;}if(lo===hi){if(lo===0)hi=1;else if(lo>0)lo=0;else hi=0;}
 const raw=(hi-lo)/n,p=10**Math.floor(Math.log10(raw)),st=[1,2,2.5,5,10].map(k=>k*p).find(k=>k>=raw-1e-12)||p*10;const a=Math.floor(lo/st+1e-9)*st,b=Math.ceil(hi/st-1e-9)*st;
 const ticks=[];for(let v=a;v<=b+st*1e-6;v+=st)ticks.push(+v.toFixed(10));return {lo:a,hi:b,ticks,step:st};}
function ctx(s,kind,opt){const C=KIT().ctx(s,kind);C.kind=kind;C.opt=opt;C.W=Math.max(300,Math.round(opt.width||760));C.fmt=makeFmt(opt.fmt);C.warn=[];C.anchors=new Map();C.vs=null;C.ai=0;C.used=[];C.extra=[];
 C.FT=t=>esc(C.T(t));C.mono=C.t.mono;C.ph=opt.height||(C.W<480?240:300);C.neutral=C.t.dark?'#5A5F6B':'#B9B6AE';C.small=C.W<520;
 C.defs+=`<marker id="${C.uid}ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M1 1.5L9 5L1 8.5" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker>`;
 return C;}
const tipText=v=>v;
const hitR=(x,y,w,h,i)=>`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(w,1).toFixed(1)}" height="${Math.max(h,1).toFixed(1)}" fill="transparent" data-tip="${i}"/>`;
const mark=(C,a,o,body,cls='')=>`<g class="mk${cls?' '+cls:''}" data-a="${a}" data-ai="${C.ai++}"${o?` data-o="${o[0].toFixed(1)} ${o[1].toFixed(1)}"`:''}>${body}</g>`;
const T=(C,x,y,txt,o={})=>`<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" ${o.mono?C.FM:C.F} font-size="${o.size||11.5}"${o.w?` font-weight="${o.w}"`:''} fill="${o.fill||C.mute}"${o.anchor?` text-anchor="${o.anchor}"`:''}${o.halo?` paint-order="stroke" stroke="${C.cardBg}" stroke-width="3.5" stroke-linejoin="round"`:''}${o.num?' style="font-variant-numeric:tabular-nums"':''}>${o.raw?txt:C.FT(txt)}</text>`;
/* legend row(s) at y; returns the y below it. kind: rect | line | dot */
function legend(C,items,y,kind='rect'){if(C.opt.legend==='off'||items.length<2)return y;let o='',x=24,row=0;const max=C.W-24;
 items.forEach(([label,color])=>{const w=(kind==='line'?20:16)+measure(C.T(label),11.5,400,C.t.font)+18;if(x+w>max&&x>24){x=24;row++;}const yy=y+row*20;
  o+=kind==='line'?`<path d="M${x} ${yy}h14" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`:kind==='dot'?`<circle cx="${x+5}" cy="${yy}" r="5" fill="${color}"/>`:`<rect x="${x}" y="${yy-5}" width="10" height="10" rx="${C.r?2.5:0}" fill="${color}"/>`;
  o+=T(C,x+(kind==='line'?20:16),yy+4,label);x+=w;});C.legendSVG=(C.legendSVG||'')+`<g class="lg">${o}</g>`;return y+row*20+22;}
/* y value axis with hairline grid */
function yAxis(C,sc,P,o={}){const map=v=>P.y1-(v-sc.lo)/(sc.hi-sc.lo)*(P.y1-P.y0);let s='';const grid=C.opt.grid!=='off'&&C.grid&&!C.t.rangeFrame;
 sc.ticks.forEach(v=>{const y=map(v);if(grid)s+=`<line x1="${P.x0}" x2="${P.x1}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${v===0?KIT().alpha(C.ink,.35):C.grid}" stroke-width="1"/>`;
  if(C.opt.yLabels!=='off')s+=T(C,P.x0-8,y+3.5,C.fmt(v),{mono:1,size:10.5,anchor:'end',num:1});});
 if(C.t.rangeFrame)s+=`<line x1="${P.x0-3}" x2="${P.x0-3}" y1="${P.y1}" y2="${P.y0}" stroke="${C.ink}" stroke-width=".75"/>`;
 if(!o.noVS)C.vs={axis:'y',map,a:P.x0,b:P.x1};return {s:`<g class="ax">${s}</g>`,map};}
function xAxis(C,sc,P,o={}){const map=v=>P.x0+(v-sc.lo)/(sc.hi-sc.lo)*(P.x1-P.x0);let s='';const grid=C.opt.grid!=='off'&&C.grid&&!C.t.rangeFrame;
 const lw=Math.max(...sc.ticks.map(v=>measure(C.fmt(v),10.5,400,C.mono)))+10,every=Math.max(1,Math.ceil(lw/((P.x1-P.x0)/Math.max(1,sc.ticks.length-1))));
 sc.ticks.forEach((v,i)=>{const x=map(v);if(grid&&o.grid!==false)s+=`<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${P.y0}" y2="${P.y1}" stroke="${v===0?KIT().alpha(C.ink,.35):C.grid}" stroke-width="1"/>`;
  if(C.opt.xLabels!=='off'&&i%every===0)s+=T(C,x,P.y1+17,C.fmt(v),{mono:1,size:10.5,anchor:'middle',num:1});});
 if(C.t.rangeFrame)s+=`<line x1="${P.x0}" x2="${P.x1}" y1="${P.y1+3}" y2="${P.y1+3}" stroke="${C.ink}" stroke-width=".75"/>`;
 if(o.vs!==false)C.vs={axis:'x',map,a:P.y0,b:P.y1};return {s:`<g class="ax">${s}</g>`,map};}
/* category labels under a band axis, thinned so they never collide */
function catLabels(C,labels,cx,bw,y){if(C.opt.xLabels==='off')return '';const lw=Math.max(...labels.map(l=>measure(C.T(l),10.5,400,C.mono)))+8;const every=Math.max(1,Math.ceil(lw/Math.max(bw,1)));let s='';
 labels.forEach((l,i)=>{if(i%every===0||(i===labels.length-1&&(labels.length-1)%every>=every*.75))s+=T(C,cx(i),y,clip(C.T(l),10.5,400,C.mono,Math.max(bw*every-6,40)),{mono:1,size:10.5,anchor:'middle'});});return `<g class="ax">${s}</g>`;}
const axisW=(C,sc)=>C.opt.yLabels==='off'?14:Math.max(...sc.ticks.map(v=>measure(C.fmt(v),10.5,400,C.mono)))+16;
const labelsW=(C,labels,size=12,cap=.34)=>Math.min(C.W*cap,Math.max(...labels.map(l=>measure(C.T(l),size,400,C.t.font)))+18);

/* the data prepared for drawing: labels, series with colours, row order */
function prep(C,tb,map){const kind=C.kind,k=KIND[kind],ty=infer(tb);const rows0=tb.rows.map((r,i)=>({r,i})).filter(o=>o.r.some(c=>String(c??'').trim()!==''));
 const xi=map.x,labelOf=o=>xi>=0?(String(o.r[xi]??'').trim()||'Row '+(o.i+1)):'Row '+(o.i+1);
 let ys=(map.y||[]).filter(c=>c>=0&&c<tb.columns.length&&c!==xi);if(!ys.length){const f=ty.findIndex((t,i)=>t==='num'&&i!==xi);if(f>=0)ys=[f];}
 let rows=rows0;const sortable=['column','bar','stacked','stacked100','barStacked','pie','donut','dumbbell','bullet','heatmap','funnel','slope'].includes(kind);
 const sortBy=C.opt.sort||(['pie','donut'].includes(kind)?'desc':kind==='bar'&&ys.length===1?'desc':'none');
 if(sortable&&sortBy!=='none'&&ys.length){const key=o=>kind==='dumbbell'||kind==='slope'?parseNum(o.r[ys[ys.length-1]]):sum(ys.map(c=>parseNum(o.r[c])));rows=[...rows].sort((a,b)=>sortBy==='desc'?(key(b)||0)-(key(a)||0):sortBy==='asc'?(key(a)||0)-(key(b)||0):a.r[xi]>b.r[xi]?1:-1);}
 const pal=C.cat,slots=C.opt.slots||[];
 let ser=ys.map((c,si)=>({name:tb.columns[c],col:c,si,vals:rows.map(o=>parseNum(o.r[c]))}));
 const lim=k.max||8;if(ser.length>lim){if(k.fold){const keep=ser.slice(0,lim-1),rest=ser.slice(lim-1);keep.push({name:'Other',col:-1,si:lim-1,other:true,vals:rows.map((_,ri)=>sum(rest.map(s=>s.vals[ri])))});C.warn.push(`${rest.length} series folded into “Other”: five parts is the colour ceiling.`);ser=keep;}
  else{C.warn.push(`Showing the first ${lim} of ${ser.length} series${kind==='line'||kind==='column'?'. Use small multiples or a heatmap for all of them':''}.`);ser=ser.slice(0,lim);}}
 const emph=C.opt.emph==null||C.opt.emph===''?-1:+C.opt.emph;
 ser.forEach((s,i)=>{const slot=slots[i]!=null&&slots[i]!==''?+slots[i]:i;s.slot=slot;s.color=s.other?C.neutral:emph>=0?(i===emph?pal[0]:C.neutral):(C.t.highlightOnly&&ser.length>1&&i>0&&C.opt.slotsTouched!==true?pal[slot%pal.length]:pal[slot%pal.length]);if(!s.other&&(emph<0||i===emph))C.used.push(s.color);});
 C.d={rows,labels:rows.map(labelOf),ri:rows.map(o=>o.i),ser,ty,xi,xName:xi>=0?tb.columns[xi]:'Row',map,tb};
 return C.d;}
const anchor=(C,ri,si,x,y)=>C.anchors.set(`${ri}:${si}`,{x,y});

/* ---------------- renderers ---------------- */
const R={};
/* columns and bars: grouped, stacked or 100% */
function bars(C,orient,mode){const {fill,bar,barPts,mix,alpha,onFill}=KIT();const D=C.d,ser=D.ser,n=D.labels.length;let o='';
 if(!n||!ser.length){C.H=C.top+80;return T(C,24,C.top+30,'Add rows and at least one numeric column.');}
 let y=legend(C,ser.map(s=>[s.name,s.color]),C.top+6);
 const stackV=(ri)=>ser.map(s=>Math.max(0,s.vals[ri]||0));if(mode!=='group'&&ser.some(s=>s.vals.some(v=>v<0)))C.warn.push('Negative values cannot stack; they are drawn as zero. Use grouped columns.');
 const tot=D.labels.map((_,ri)=>sum(stackV(ri)));
 let lo,hi;if(mode==='pct'){lo=0;hi=100;}else if(mode==='stack'){lo=0;hi=Math.max(...tot,0);}else{const v=fin(ser.flatMap(s=>s.vals));lo=Math.min(0,...v);hi=Math.max(0,...v);}
 const sc=niceScale(lo,hi,C.small?4:5);const fmt0=C.fmt;if(mode==='pct')C.fmt=v=>(Math.round(v*10)/10)+'%';
 const valLab=C.opt.labels||'auto',showAll=valLab==='all'||(valLab==='auto'&&ser.length===1&&n<=(orient==='h'?24:C.small?8:14)),showMax=valLab==='max';
 const r=C.r;let body='',labs='',hits='';
 if(orient==='v'){const P={x0:24+axisW(C,sc),x1:C.W-24,y0:y+6,y1:y+6+C.ph};const ya=yAxis(C,sc,P);o+=ya.s;const bw0=(P.x1-P.x0)/n,cx=i=>P.x0+bw0*(i+.5),base=ya.map(Math.max(sc.lo,Math.min(0,sc.hi)));
  const gbw=mode==='group'?Math.max(2,Math.min(24,(bw0*.78-(ser.length-1)*2)/ser.length)):Math.max(3,Math.min(28,bw0*.62));
  const maxV=Math.max(...fin(ser.flatMap(s=>s.vals)));
  D.labels.forEach((lab,i)=>{const ri=D.ri[i];
   if(mode==='group'){const gw=ser.length*gbw+(ser.length-1)*2;ser.forEach((s,k)=>{const v=s.vals[i];if(!isFinite(v))return;const x=cx(i)-gw/2+k*(gbw+2),yv=ya.map(v),top=Math.min(yv,base),h=Math.abs(base-yv);
     const d=v>=0?bar(x,top,gbw,h,r,'up'):`M${x} ${top}H${x+gbw}V${top+h-Math.min(r,h)}Q${x+gbw} ${top+h} ${x+gbw-Math.min(r,gbw/2)} ${top+h}H${x+Math.min(r,gbw/2)}Q${x} ${top+h} ${x} ${top+h-Math.min(r,h)}Z`;
     body+=mark(C,'gy',[x,base],fill(C,d,s.color,{pts:barPts(x,top,gbw,h),seed:i*7+k,flat:k>0}));anchor(C,ri,s.si,x+gbw/2,v>=0?top:top+h);
     if(showAll||(showMax&&v===maxV))labs+=T(C,x+gbw/2,v>=0?top-6:top+h+13,C.fmt(v),{size:11,w:600,fill:C.ink,anchor:'middle',num:1});});}
   else{let acc=base;const vals=stackV(i),t=tot[i]||1;ser.forEach((s,k)=>{const v=mode==='pct'?vals[k]/t*100:vals[k];if(!v)return;const h=base-ya.map(sc.lo+v)+0;const yy=acc-h+(k?2:0),hh=Math.max(0,h-(k?2:0)),x=cx(i)-gbw/2,isTop=k===ser.length-1||ser.slice(k+1).every((_,j)=>!vals[k+1+j]);
     body+=mark(C,'gy',[x,base],fill(C,isTop?bar(x,yy,gbw,hh,r,'up'):`M${x} ${yy}h${gbw}v${hh}h${-gbw}Z`,s.color,{pts:barPts(x,yy,gbw,hh),seed:i*5+k,hl:isTop,flat:true}));anchor(C,ri,s.si,x+gbw/2,yy);
     if(valLab==='all'&&hh>16&&gbw>=26)labs+=T(C,x+gbw/2,yy+hh/2+4,mode==='pct'?Math.round(v)+'%':C.fmt(v),{size:10.5,w:600,fill:onFill(s.color,C.t),anchor:'middle',num:1});acc-=h;});
    if(mode==='stack'&&(valLab==='auto'||valLab==='all')&&n<=14)labs+=T(C,cx(i),acc-6,C.fmt(tot[i]),{size:11,w:600,fill:C.ink,anchor:'middle',num:1});}
   const ti=C.tip(lab,[...ser.map(s=>[s.color,mode==='pct'?((Math.max(0,s.vals[i]||0)/(tot[i]||1))*100).toFixed(1)+'%':C.fmt(s.vals[i]),s.name]).reverse(),...(mode!=='group'&&ser.length>1?[[null,'Total '+fmt0(tot[i])]]:[])]);hits+=hitR(cx(i)-bw0/2,P.y0,bw0,P.y1-P.y0,ti);});
  o+=`<line x1="${P.x0}" x2="${P.x1}" y1="${base}" y2="${base}" stroke="${alpha(C.ink,.35)}" stroke-width="1"/>`+catLabels(C,D.labels,cx,bw0,P.y1+17);
  C.H=P.y1+28;}
 else{const lw=labelsW(C,D.labels),valW=showAll?52:12,P={x0:24+lw,x1:C.W-24-valW,y0:y+4,y1:0};const bh0=Math.max(18,Math.min(40,(C.ph*1.15)/n)),pad=mode==='group'?.28:.34;P.y1=P.y0+bh0*n;
  const xa=xAxis(C,sc,P,{grid:true});const cy=i=>P.y0+bh0*(i+.5),base=xa.map(Math.max(sc.lo,Math.min(0,sc.hi)));const gbh=mode==='group'?Math.max(3,Math.min(24,(bh0*(1-pad)-(ser.length-1)*2)/ser.length)):Math.max(4,Math.min(24,bh0*(1-pad)));
  const maxV=Math.max(...fin(ser.flatMap(s=>s.vals)));
  D.labels.forEach((lab,i)=>{const ri=D.ri[i];o+=T(C,P.x0-10,cy(i)+4,clip(C.T(lab),12,400,C.t.font,lw-14),{size:12,anchor:'end',fill:C.ink});
   if(mode==='group'){const gh=ser.length*gbh+(ser.length-1)*2;ser.forEach((s,k)=>{const v=s.vals[i];if(!isFinite(v))return;const yy=cy(i)-gh/2+k*(gbh+2),xv=xa.map(v),left=Math.min(xv,base),w=Math.abs(xv-base);
     const d=v>=0?bar(left,yy,w,gbh,r,'right'):`M${left+w} ${yy}H${left+Math.min(r,w)}Q${left} ${yy} ${left} ${yy+Math.min(r,gbh/2)}V${yy+gbh-Math.min(r,gbh/2)}Q${left} ${yy+gbh} ${left+Math.min(r,w)} ${yy+gbh}H${left+w}Z`;
     body+=mark(C,'gx',[base,yy],fill(C,d,s.color,{pts:barPts(left,yy,w,gbh),seed:i*7+k,flat:k>0}));anchor(C,ri,s.si,v>=0?left+w:left,yy+gbh/2);
     if(showAll||(showMax&&v===maxV))labs+=T(C,v>=0?left+w+6:left-6,yy+gbh/2+4,C.fmt(v),{size:11.5,w:600,fill:C.ink,anchor:v>=0?'start':'end',num:1});});}
   else{let acc=base;const vals=stackV(i),t=tot[i]||1;ser.forEach((s,k)=>{const v=mode==='pct'?vals[k]/t*100:vals[k];if(!v)return;const w=xa.map(sc.lo+v)-P.x0,xx=acc+(k?2:0),ww=Math.max(0,w-(k?2:0)),isTop=k===ser.length-1||ser.slice(k+1).every((_,j)=>!vals[k+1+j]),yy=cy(i)-gbh/2;
     body+=mark(C,'gx',[base,yy],fill(C,isTop?bar(xx,yy,ww,gbh,r,'right'):`M${xx} ${yy}h${ww}v${gbh}h${-ww}Z`,s.color,{pts:barPts(xx,yy,ww,gbh),seed:i*5+k,hl:isTop,flat:true}));anchor(C,ri,s.si,xx+ww,yy+gbh/2);
     if(valLab==='all'&&ww>34&&gbh>=14)labs+=T(C,xx+ww/2,yy+gbh/2+4,mode==='pct'?Math.round(v)+'%':C.fmt(v),{size:10.5,w:600,fill:onFill(s.color,C.t),anchor:'middle',num:1});acc+=w;});
    if(mode==='stack'&&(valLab==='auto'||valLab==='all'))labs+=T(C,acc+6,cy(i)+4,C.fmt(tot[i]),{size:11,w:600,fill:C.ink,num:1});}
   const ti=C.tip(lab,[...ser.map(s=>[s.color,mode==='pct'?((Math.max(0,s.vals[i]||0)/(tot[i]||1))*100).toFixed(1)+'%':C.fmt(s.vals[i]),s.name]),...(mode!=='group'&&ser.length>1?[[null,'Total '+fmt0(tot[i])]]:[])]);hits+=hitR(0,cy(i)-bh0/2,C.W,bh0,ti);});
  o+=`<line x1="${base}" x2="${base}" y1="${P.y0-4}" y2="${P.y1+4}" stroke="${alpha(C.ink,.35)}" stroke-width="1"/>`;C.H=P.y1+28;}
 C.fmt=fmt0;return o+body+`<g class="mk lab" data-a="fade" data-ai="${C.ai++}">${labs}</g>`+hits;}
R.column=C=>bars(C,'v','group');R.stacked=C=>bars(C,'v','stack');R.stacked100=C=>bars(C,'v','pct');R.bar=C=>bars(C,'h','group');R.barStacked=C=>bars(C,'h','stack');

/* end labels for lines, nudged apart */
function endLabels(C,items,x,anchorEnd){items.sort((a,b)=>a.y-b.y);for(let i=1;i<items.length;i++)if(items[i].y-items[i-1].y<15)items[i].y=items[i-1].y+15;let s='';
 items.forEach(it=>{s+=`<text x="${x}" y="${(it.y+4).toFixed(1)}" ${C.F} font-size="11.5" fill="${C.ink}"${anchorEnd?' text-anchor="end"':''}>${it.v!=null?`<tspan font-weight="600" style="font-variant-numeric:tabular-nums">${esc(it.v)}</tspan> `:''}<tspan fill="${C.mute}">${C.FT(it.name)}</tspan></text>`;});return s;}
function lineLike(C,mode){const {line,dot,alpha}=KIT();const D=C.d,n=D.labels.length;let ser=D.ser;if(mode==='single')ser=ser.slice(0,1);let o='';
 if(!n||!ser.length){C.H=C.top+80;return T(C,24,C.top+30,'Add rows and at least one numeric column.');}
 const stacked=mode==='stack';const y=legend(C,ser.map(s=>[s.name,s.color]),C.top+6,stacked?'rect':'line');
 if(stacked&&ser.some(s=>s.vals.some(v=>v<0)))C.warn.push('Negative values cannot stack; they are drawn as zero.');
 const cum=D.labels.map((_,i)=>{let a=0;return ser.map(s=>a+=Math.max(0,s.vals[i]||0));});
 const all=stacked?cum.map(c=>c[c.length-1]):fin(ser.flatMap(s=>s.vals));const lo0=Math.min(...all),hi0=Math.max(...all);
 const zero=C.opt.zero==='on'||mode!=='line'||(C.opt.zero!=='off'&&lo0>=0&&lo0<(hi0-lo0)*.8);const sc=niceScale(zero?Math.min(0,lo0):lo0,hi0,C.small?4:5);
 const direct=C.opt.direct!=='off'&&ser.length<=4&&ser.length>1&&mode!=='single';
 const endW=direct?Math.min(150,Math.max(...ser.map(s=>measure(C.T(s.name),11.5,400,C.t.font)+measure(C.fmt(fin(s.vals).slice(-1)[0]??0),11.5,600,C.t.font)))+18):(mode==='single'?16:16);
 const P={x0:24+axisW(C,sc),x1:C.W-24-(direct?endW:0),y0:y+6,y1:y+6+C.ph};const ya=yAxis(C,sc,P);o+=ya.s;
 const sx=i=>n===1?(P.x0+P.x1)/2:P.x0+i*(P.x1-P.x0)/(n-1);
 const step=(P.x1-P.x0)/Math.max(1,n-1);o+=catLabels(C,D.labels,sx,step,P.y1+17);
 let body='';const ends=[];
 if(stacked){for(let k=ser.length-1;k>=0;k--){const s=ser[k],top=D.labels.map((_,i)=>[sx(i),ya.map(cum[i][k])]),bot=D.labels.map((_,i)=>[sx(i),ya.map(k?cum[i][k-1]:0)]).reverse();
   body+=mark(C,'fade',null,`<path d="M${top.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')} L${bot.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')}Z" fill="${s.color}" stroke="${C.cardBg}" stroke-width="2" stroke-linejoin="round"${C.t.multiply?' style="mix-blend-mode:multiply"':''}/>`);
   D.labels.forEach((_,i)=>anchor(C,D.ri[i],s.si,sx(i),ya.map(cum[i][k])));const yl=(ya.map(cum[n-1][k])+ya.map(k?cum[n-1][k-1]:0))/2;ends.push({y:yl,name:s.name,v:null});}}
 else ser.forEach((s,k)=>{const segs=[];let cur=[];s.vals.forEach((v,i)=>{if(isFinite(v))cur.push([sx(i),ya.map(v)]);else if(cur.length){segs.push(cur);cur=[];}});if(cur.length)segs.push(cur);
  if(mode==='single'||mode==='area'){const id=C.uid+'a'+k;C.defs+=`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity="${C.t.glow||C.t.frost?.38:.14}"/><stop offset="1" stop-color="${s.color}" stop-opacity="${C.t.glow||C.t.frost?0:.08}"/></linearGradient>`;
   segs.forEach(P2=>{if(P2.length>1)body+=mark(C,'fade',null,`<path d="M${P2.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')} L${P2[P2.length-1][0].toFixed(1)} ${ya.map(Math.max(sc.lo,0))} L${P2[0][0].toFixed(1)} ${ya.map(Math.max(sc.lo,0))}Z" fill="url(#${id})"/>`);});}
  segs.forEach(P2=>{body+=mark(C,'draw',null,P2.length>1?line(C,P2,s.color,2):dot(C,P2[0][0],P2[0][1],s.color,3.5));});
  s.vals.forEach((v,i)=>{if(isFinite(v))anchor(C,D.ri[i],s.si,sx(i),ya.map(v));});
  const li=s.vals.map(isFinite).lastIndexOf(true);if(li>=0){body+=mark(C,'pop',[sx(li),ya.map(s.vals[li])],dot(C,sx(li),ya.map(s.vals[li]),s.color));ends.push({y:ya.map(s.vals[li]),name:s.name,v:C.fmt(s.vals[li])});}
  if(n<=24&&C.opt.markers==='on')s.vals.forEach((v,i)=>{if(isFinite(v)&&i!==li)body+=mark(C,'pop',[sx(i),ya.map(v)],dot(C,sx(i),ya.map(v),s.color,3));});});
 let labs='';if(direct)labs+=endLabels(C,ends,P.x1+10);
 else if(mode!=='stack'&&C.opt.labels!=='none'){const s=ser[0],li=s.vals.map(isFinite).lastIndexOf(true);if(li>=0&&ser.length===1)labs+=T(C,sx(li)-8,ya.map(s.vals[li])-12,C.fmt(s.vals[li]),{size:12,w:600,fill:C.ink,anchor:'end',halo:1,num:1});
  if(C.opt.labels==='max'||C.opt.labels==='all')ser.forEach(s=>{const v=fin(s.vals),mx=Math.max(...v),i=s.vals.indexOf(mx);if(i!==li||ser.length>1)labs+=T(C,sx(i),ya.map(mx)-10,C.fmt(mx),{size:11,w:600,fill:C.ink,anchor:'middle',halo:1,num:1});});}
 else if(stacked&&C.opt.direct!=='off'&&ser.length<=4)labs+=endLabels(C,ends,P.x1-6,true);
 o+=body+`<g class="mk lab" data-a="fade" data-ai="${C.ai++}">${labs}</g>`;
 D.labels.forEach((lab,i)=>{const ti=C.tip(lab,ser.map(s=>[s.color,C.fmt(s.vals[i]),s.name]).reverse().reverse().concat(stacked&&ser.length>1?[[null,'Total '+C.fmt(cum[i][ser.length-1])]]:[]));
  o+=`<g class="xh" data-x="${sx(i).toFixed(1)}" data-y0="${P.y0}" data-y1="${P.y1}">${hitR(sx(i)-step/2,P.y0,n===1?P.x1-P.x0:step,P.y1-P.y0,ti)}</g>`;});
 C.H=P.y1+28;return o;}
R.line=C=>lineLike(C,'line');R.area=C=>lineLike(C,'single');R.stackedArea=C=>lineLike(C,'stack');

/* small multiples: one panel per series, shared scale, the others ghosted */
R.multiples=C=>{const {line,dot,alpha}=KIT();const D=C.d,ser=D.ser,n=D.labels.length;let o='';if(!n||!ser.length){C.H=C.top+80;return T(C,24,C.top+30,'Add rows and numeric columns.');}
 const cols=C.W>=900?4:C.W>=600?3:2,gap=18,pw=(C.W-48-gap*(cols-1))/cols,ph=Math.max(90,Math.min(150,C.ph*.45));const all=fin(ser.flatMap(s=>s.vals)),sc=niceScale(Math.min(0,...all),Math.max(...all),3);
 const lw=axisW(C,sc);let y0=C.top+10;
 ser.forEach((s,k)=>{const col=k%cols,row=Math.floor(k/cols),x=24+col*(pw+gap),y=y0+row*(ph+52),P={x0:x+(col===0?lw-10:6),x1:x+pw-6,y0:y+24,y1:y+24+ph};
  o+=T(C,x,y+12,clip(C.T(s.name),12.5,600,C.t.font,pw),{size:12.5,w:600,fill:C.ink});
  const map=v=>P.y1-(v-sc.lo)/(sc.hi-sc.lo)*(P.y1-P.y0),sx=i=>n===1?(P.x0+P.x1)/2:P.x0+i*(P.x1-P.x0)/(n-1);
  sc.ticks.forEach(v=>{if(C.grid&&C.opt.grid!=='off'&&!C.t.rangeFrame)o+=`<line x1="${P.x0}" x2="${P.x1}" y1="${map(v).toFixed(1)}" y2="${map(v).toFixed(1)}" stroke="${v===0?alpha(C.ink,.3):C.grid}"/>`;if(col===0&&C.opt.yLabels!=='off')o+=T(C,P.x0-6,map(v)+3.5,C.fmt(v),{mono:1,size:10,anchor:'end'});});
  o+=T(C,P.x0,P.y1+15,D.labels[0],{mono:1,size:10})+(n>1?T(C,P.x1,P.y1+15,D.labels[n-1],{mono:1,size:10,anchor:'end'}):'');
  ser.forEach((g,j)=>{if(j===k)return;const pts=g.vals.map((v,i)=>[sx(i),map(v)]).filter(p=>isFinite(p[1]));if(pts.length>1)o+=`<path d="M${pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')}" fill="none" stroke="${alpha(C.mute,.28)}" stroke-width="1"/>`;});
  const pts=s.vals.map((v,i)=>[sx(i),map(v),i]).filter(p=>isFinite(p[1]));const c=C.cat[0];
  if(pts.length>1)o+=mark(C,'draw',null,line(C,pts.map(p=>[p[0],p[1]]),c,2));const last=pts[pts.length-1];
  if(last){o+=mark(C,'pop',[last[0],last[1]],dot(C,last[0],last[1],c,3.5))+T(C,last[0],last[1]-9,C.fmt(s.vals[last[2]]),{size:11,w:600,fill:C.ink,anchor:'end',halo:1,num:1});}
  pts.forEach(p=>anchor(C,D.ri[p[2]],s.si,p[0],p[1]));const step=(P.x1-P.x0)/Math.max(1,n-1);
  D.labels.forEach((lab,i)=>{const ti=C.tip(`${s.name} · ${lab}`,[[c,C.fmt(s.vals[i]),s.name]]);o+=`<g class="xh" data-x="${sx(i).toFixed(1)}" data-y0="${P.y0}" data-y1="${P.y1}">${hitR(sx(i)-step/2,P.y0,n===1?P.x1-P.x0:step,ph,ti)}</g>`;});});
 C.used=[C.cat[0]];C.H=y0+Math.ceil(ser.length/cols)*(ph+52)-8;C.extra.push(`One panel per series on a shared scale; the other series are ghosted in grey for context.`);return o;};

/* pie and donut: five parts at most, sorted, values in the legend */
function pie(C,hole){const {fill,alpha,onFill}=KIT();const D=C.d,s=D.ser[0];let o='';if(!s){C.H=C.top+80;return T(C,24,C.top+30,'Pick a value column.');}
 let parts=D.labels.map((l,i)=>({l,v:s.vals[i],ri:D.ri[i]})).filter(p=>isFinite(p.v));if(parts.some(p=>p.v<0)){C.warn.push('A pie cannot show negative values; they are left out. Use bars.');parts=parts.filter(p=>p.v>=0);}
 parts=parts.filter(p=>p.v>0);if(!parts.length){C.H=C.top+80;return T(C,24,C.top+30,'No positive values to share out.');}
 if(parts.length>5){const rest=parts.slice(4);parts=parts.slice(0,4);parts.push({l:'Other',v:sum(rest.map(p=>p.v)),other:true,ri:-1});C.warn.push(`${rest.length} smaller parts folded into “Other”: a pie reads with five slices or fewer.`);}
 if(parts.length>=3){const v=parts.map(p=>p.v),mx=Math.max(...v),mn=Math.min(...v);if(mx/mn<1.25)C.warn.push('These shares are close in size; angles are hard to compare. A bar chart will read better.');}
 if(parts.length===1)C.warn.push('One slice is a whole circle; use a single number instead.');
 const total=sum(parts.map(p=>p.v));const narrow=C.W<560,R0=Math.min(narrow?(C.W-48)/2*.62:118,C.ph*.48),cx=narrow?C.W/2:24+R0+8,cy=C.top+14+R0,r=hole?R0*(C.t.clay||C.t.neu?.62:.66):0;
 const slots=C.opt.slots||[];C.used=[];let a=-Math.PI/2;const gapA=parts.length>1?2/R0:0;
 parts.forEach((p,k)=>{const col=p.other?C.neutral:C.cat[(slots[k]!=null&&slots[k]!==''?+slots[k]:k)%C.cat.length];p.c=col;if(!p.other)C.used.push(col);const sw=p.v/total*Math.PI*2,a0=a+gapA/2,a1=a+sw-gapA/2,large=sw>Math.PI?1:0;const P=(an,rad)=>[cx+Math.cos(an)*rad,cy+Math.sin(an)*rad];
  let d;if(parts.length===1)d=`M${cx-R0} ${cy}a${R0} ${R0} 0 1 0 ${R0*2} 0a${R0} ${R0} 0 1 0 ${-R0*2} 0Z`+(r?`M${cx-r} ${cy}a${r} ${r} 0 1 1 ${r*2} 0a${r} ${r} 0 1 1 ${-r*2} 0Z`:'');
  else{const [x0,y0]=P(a0,R0),[x1,y1]=P(a1,R0);if(r){const [x2,y2]=P(a1,r),[x3,y3]=P(a0,r);d=`M${x0.toFixed(2)} ${y0.toFixed(2)}A${R0} ${R0} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}A${r} ${r} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)}Z`;}else d=`M${cx} ${cy}L${x0.toFixed(2)} ${y0.toFixed(2)}A${R0} ${R0} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z`;}
  const ti=C.tip(p.l,[[col,(p.v/total*100).toFixed(1)+'%',C.fmt(p.v)]]);
  o+=mark(C,'pop',[cx,cy],fill(C,d,col,{hl:false,flat:k>0})+`<path d="${d}" fill="transparent" data-tip="${ti}" fill-rule="evenodd"/>`);
  const mid=a+sw/2,ar=r?(R0+r)/2:R0*.62;if(p.ri>=0)anchor(C,p.ri,0,cx+Math.cos(mid)*ar,cy+Math.sin(mid)*ar);
  if(C.opt.labels==='all'&&sw>.35)o+=T(C,cx+Math.cos(mid)*ar,cy+Math.sin(mid)*ar+4,Math.round(p.v/total*100)+'%',{size:11,w:600,fill:onFill(col,C.t),anchor:'middle'});a+=sw;});
 if(hole)o+=T(C,cx,cy+2,C.fmt(total),{size:Math.max(16,Math.min(26,r*.42)),w:600,fill:C.ink,anchor:'middle',num:1})+T(C,cx,cy+20,'total',{size:11.5,anchor:'middle'});
 const lx=narrow?24:cx+R0+36,ly=narrow?cy+R0+30:cy-parts.length*14+10,lw=C.W-24-lx;let lg='';
 parts.forEach((p,k)=>{const yy=ly+k*28;lg+=`<rect x="${lx}" y="${yy-6}" width="12" height="12" rx="${C.r?3:0}" fill="${p.c}"/>`+T(C,lx+20,yy+4,clip(C.T(p.l),12.5,400,C.t.font,lw-120),{size:12.5,fill:C.ink})+T(C,lx+lw,yy+4,`${Math.round(p.v/total*1000)/10}%`,{size:12.5,w:600,fill:C.ink,anchor:'end',num:1})+T(C,lx+lw-56,yy+4,C.fmt(p.v),{size:11.5,anchor:'end',num:1});});
 o+=`<g class="mk lab" data-a="fade" data-ai="${C.ai++}">${lg}</g>`;C.H=Math.max(cy+R0+20,narrow?ly+parts.length*28:0);
 const top=parts[0];C.extra.push(`${top.l} is the largest share at ${(top.v/total*100).toFixed(0)}% of ${C.fmt(total)}.`);return o;}
R.pie=C=>pie(C,false);R.donut=C=>pie(C,true);

/* treemap (squarified) */
function squarify(items,x,y,w,h){const out=[];const tot=sum(items.map(i=>i.v));if(tot<=0)return out;let rest=items.map(i=>({...i,a:i.v/tot*w*h}));
 while(rest.length){const short=Math.min(w,h);let row=[],best=Infinity;
  for(const it of rest){const r=[...row,it],s=sum(r.map(q=>q.a)),mx=Math.max(...r.map(q=>q.a)),mn=Math.min(...r.map(q=>q.a)),wst=Math.max(short*short*mx/(s*s),(s*s)/(short*short*mn));if(wst<=best||!row.length){row=r;best=wst;}else break;}
  rest=rest.slice(row.length);const s=sum(row.map(q=>q.a));
  if(w>=h){const cw=s/h;let yy=y;row.forEach(q=>{const ch=q.a/cw;out.push({...q,x,y:yy,w:cw,h:ch});yy+=ch;});x+=cw;w-=cw;}else{const ch=s/w;let xx=x;row.forEach(q=>{const cw=q.a/ch;out.push({...q,x:xx,y,w:cw,h:ch});xx+=cw;});y+=ch;h-=ch;}}
 return out;}
R.treemap=C=>{const {fill,onFill}=KIT();const D=C.d,s=D.ser[0];if(!s){C.H=C.top+80;return T(C,24,C.top+30,'Pick a value column.');}
 const gi=D.map.group;let items=D.labels.map((l,i)=>({l,v:s.vals[i],ri:D.ri[i],g:gi>=0?String(D.rows[i].r[gi]):''})).filter(p=>isFinite(p.v)&&p.v>0).sort((a,b)=>b.v-a.v);
 if(!items.length){C.H=C.top+80;return T(C,24,C.top+30,'No positive values.');}
 const groups=[...new Set(items.map(i=>i.g))];let y=C.top+6;
 if(gi>=0){if(groups.length>5)C.warn.push('More than five groups: the rest share a grey.');y=legend(C,groups.map((g,k)=>[g,k<5?C.cat[k]:C.neutral]),y);C.used=groups.slice(0,5).map((_,k)=>C.cat[k]);}
 const P={x0:24,y0:y+2,x1:C.W-24,y1:y+2+C.ph*1.1};const total=sum(items.map(i=>i.v));const seq=C.seq;
 const cells=squarify(items,P.x0,P.y0,P.x1-P.x0,P.y1-P.y0);let o='',labs='';const vs=items.map(i=>i.v),mx=Math.max(...vs),mn=Math.min(...vs);
 cells.forEach((c,k)=>{const col=gi>=0?(groups.indexOf(c.g)<5?C.cat[groups.indexOf(c.g)]:C.neutral):seq[Math.min(4,Math.floor((Math.log(c.v)-Math.log(mn))/((Math.log(mx)-Math.log(mn))||1)*4.999))];
  const x=c.x+1,yy=c.y+1,w=Math.max(0,c.w-2),h=Math.max(0,c.h-2),r=Math.min(C.r,w/2,h/2);const d=`M${x+r} ${yy}H${x+w-r}Q${x+w} ${yy} ${x+w} ${yy+r}V${yy+h-r}Q${x+w} ${yy+h} ${x+w-r} ${yy+h}H${x+r}Q${x} ${yy+h} ${x} ${yy+h-r}V${yy+r}Q${x} ${yy} ${x+r} ${yy}Z`;
  const ti=C.tip(c.l,[[col,C.fmt(c.v),(c.v/total*100).toFixed(1)+'% of total'],...(c.g?[[null,c.g]]:[])]);o+=mark(C,'pop',[x+w/2,yy+h/2],fill(C,d,col,{hl:false,flat:true})+`<path d="${d}" fill="transparent" data-tip="${ti}"/>`);anchor(C,c.ri,0,x+w/2,yy+h/2);
  if(w>54&&h>34){const ink=onFill(col,C.t);labs+=T(C,x+8,yy+18,clip(C.T(c.l),12,600,C.t.font,w-14),{size:12,w:600,fill:ink})+T(C,x+8,yy+33,C.fmt(c.v),{size:11,fill:ink,num:1});}});
 if(gi<0){const ly=P.y1+18;labs+=T(C,24,ly+4,'Smaller')+seq.map((c,k)=>`<rect x="${78+k*26}" y="${ly-6}" width="24" height="12" rx="${C.r?2:0}" fill="${c}"/>`).join('')+T(C,78+5*26+6,ly+4,'Larger');C.H=ly+16;}else C.H=P.y1+12;
 o+=`<g class="mk lab" data-a="fade" data-ai="${C.ai++}">${labs}</g>`;if(gi<0)C.used=[];C.extra.push(`${cells.length} parts; ${items[0].l} is the largest at ${(items[0].v/total*100).toFixed(0)}% of ${C.fmt(total)}.`);return o;};

/* waterfall: rises and falls on diverging poles, totals neutral */
R.waterfall=C=>{const {fill,bar,alpha}=KIT();const D=C.d,s=D.ser[0];if(!s){C.H=C.top+80;return T(C,24,C.top+30,'Pick a value column.');}
 const up=C.div[4],down=C.div[0],totC=C.t.dark?'#8A90A0':'#6B6F78';const isTot=l=>/^(total|net|end|final|balance|closing|result|sum)\b/i.test(l),isStart=l=>/^(start|opening|begin|initial|base|last year|previous)\b/i.test(l);
 const steps=[];let run=0;D.labels.forEach((l,i)=>{const v=s.vals[i];if(isTot(l)){steps.push({l,a:0,b:isFinite(v)?v:run,tot:true,ri:D.ri[i]});run=isFinite(v)?v:run;return;}if(!isFinite(v))return;
  if(i===0&&(C.opt.wfStart!=='off'&&(isStart(l)||C.opt.wfStart==='on'))){steps.push({l,a:0,b:v,tot:true,ri:D.ri[i]});run=v;return;}steps.push({l,a:run,b:run+v,ri:D.ri[i],v});run+=v;});
 if(C.opt.wfEnd!=='off'&&steps.length&&!steps[steps.length-1].tot)steps.push({l:'Total',a:0,b:run,tot:true,ri:-1});
 const n=steps.length;const y=legend(C,[['Increase',up],['Decrease',down],['Total',totC]],C.top+6);C.used=[];
 const all=steps.flatMap(st=>[st.a,st.b]),sc=niceScale(Math.min(0,...all),Math.max(0,...all),C.small?4:5);const P={x0:24+axisW(C,sc),x1:C.W-24,y0:y+6,y1:y+6+C.ph};const ya=yAxis(C,sc,P);let o=ya.s,labs='';
 const bw0=(P.x1-P.x0)/n,bw=Math.max(4,Math.min(36,bw0*.64)),cx=i=>P.x0+bw0*(i+.5);
 steps.forEach((st,i)=>{const col=st.tot?totC:st.b>=st.a?up:down,y0=ya.map(Math.max(st.a,st.b)),y1=ya.map(Math.min(st.a,st.b)),x=cx(i)-bw/2,h=Math.max(1,y1-y0);
  o+=mark(C,'gy',[x,ya.map(st.a)],fill(C,`M${x} ${y0}h${bw}v${h}h${-bw}Z`,col,{pts:[[x,y0],[x+bw,y0],[x+bw,y0+h],[x,y0+h]],seed:i+3,hl:false,flat:true}));
  if(i<n-1){const nx=cx(i+1)-bw/2;o+=`<line x1="${x+bw}" x2="${nx}" y1="${ya.map(st.b).toFixed(1)}" y2="${ya.map(st.b).toFixed(1)}" stroke="${alpha(C.ink,.35)}" stroke-width="1"/>`;}
  if(st.ri>=0)anchor(C,st.ri,0,cx(i),y0);
  if(C.opt.labels!=='none'&&n<=16)labs+=T(C,cx(i),y0-6,st.tot?C.fmt(st.b):(st.v>0?'+':'')+C.fmt(st.v),{size:11,w:600,fill:C.ink,anchor:'middle',num:1});
  const ti=C.tip(st.l,st.tot?[[col,C.fmt(st.b),'Total']]:[[col,(st.v>0?'+':'')+C.fmt(st.v),st.v>=0?'Increase':'Decrease'],[null,'Running total '+C.fmt(st.b)]]);o+=hitR(cx(i)-bw0/2,P.y0,bw0,P.y1-P.y0,ti);});
 o+=catLabels(C,steps.map(s=>s.l),cx,bw0,P.y1+17)+`<g class="mk lab" data-a="fade" data-ai="${C.ai++}">${labs}</g>`;C.H=P.y1+28;
 C.extra.push(`Starts at ${C.fmt(steps[0]?.b)} and ends at ${C.fmt(run)}. Increases and decreases take the two diverging poles; totals are neutral.`);return o;};

/* funnel: ordered stages, one-hue ramp, step rates */
R.funnel=C=>{const {fill,onFill}=KIT();const D=C.d,s=D.ser[0];if(!s){C.H=C.top+80;return T(C,24,C.top+30,'Pick a value column.');}
 const st=D.labels.map((l,i)=>({l,v:s.vals[i],ri:D.ri[i]})).filter(p=>isFinite(p.v));const n=st.length;if(!n){C.H=C.top+80;return '';}
 const lw=labelsW(C,st.map(p=>p.l),12,.3),rate=C.small?44:64,P={x0:24+lw,x1:C.W-24-rate},h=Math.max(20,Math.min(40,C.ph/n-8)),gap=8;const mx=Math.max(...st.map(p=>p.v));const seq=[...C.seq].reverse();let o='',labs='',y=C.top+14;
 if(st.some((p,i)=>i&&p.v>st[i-1].v))C.warn.push('A stage is bigger than the one before it; a funnel expects values to narrow.');
 labs+=T(C,C.W-24,y-4,'Step rate',{anchor:'end',size:11});
 st.forEach((p,i)=>{const yy=y+6+i*(h+gap),w=Math.max(16,p.v/mx*(P.x1-P.x0)),x=P.x0+((P.x1-P.x0)-w)/2,col=seq[Math.min(4,Math.round(i*4/Math.max(1,n-1)))];const r=Math.min(C.r+2,6);
  o+=T(C,P.x0-12,yy+h/2+4,clip(C.T(p.l),12,400,C.t.font,lw-14),{size:12,anchor:'end',fill:C.ink});
  o+=mark(C,'pop',[x+w/2,yy+h/2],fill(C,`M${x+r} ${yy}H${x+w-r}Q${x+w} ${yy} ${x+w} ${yy+r}V${yy+h-r}Q${x+w} ${yy+h} ${x+w-r} ${yy+h}H${x+r}Q${x} ${yy+h} ${x} ${yy+h-r}V${yy+r}Q${x} ${yy} ${x+r} ${yy}Z`,col,{pts:[[x,yy],[x+w,yy],[x+w,yy+h],[x,yy+h]],seed:i+6,hl:i===0,flat:true}));anchor(C,p.ri,0,x+w,yy+h/2);
  const fits=measure(C.fmt(p.v),11.5,600,C.t.font)+14<w;labs+=T(C,fits?x+w/2:x+w+8,yy+h/2+4,C.fmt(p.v),{size:11.5,w:600,fill:fits?onFill(col,C.t):C.ink,anchor:fits?'middle':'start',num:1});
  if(i)labs+=T(C,C.W-24,yy+h/2+4,(p.v/st[i-1].v*100).toFixed(p.v/st[i-1].v<.1?1:0)+'%',{anchor:'end',num:1});
  const ti=C.tip(p.l,[[col,C.fmt(p.v)],[null,i?`${(p.v/st[i-1].v*100).toFixed(1)}% of ${st[i-1].l}`:'Top of funnel'],[null,`${(p.v/st[0].v*100).toFixed(1)}% of ${st[0].l}`]]);o+=hitR(0,yy-gap/2,C.W,h+gap,ti);});
 C.used=[];o+=`<g class="mk lab" data-a="fade" data-ai="${C.ai++}">${labs}</g>`;C.H=y+6+n*(h+gap)+8;C.extra.push(`${(st[n-1].v/st[0].v*100).toFixed(1)}% of ${st[0].l} reach ${st[n-1].l}.`);return o;};

/* bullet: actual bar over qualitative bands, target tick. With targets, every row is drawn as % of its own target,
   so rows in different units share one honest scale; without, a shared value scale. */
R.bullet=C=>{const {fill,bar,mix}=KIT();const D=C.d,[a,b]=D.ser;if(!a){C.H=C.top+80;return T(C,24,C.top+30,'Pick an actual and a target column.');}
 const rows=D.labels.map((l,i)=>({l,v:a.vals[i],t:b?b.vals[i]:NaN,ri:D.ri[i]})).filter(r=>isFinite(r.v));const n=rows.length;if(!n){C.H=C.top+80;return '';}
 const pct=rows.every(r=>isFinite(r.t)&&r.t>0);const y=legend(C,[[a.name,C.cat[0]],...(b?[[b.name+' (target)',C.ink]]:[])],C.top+6);const lw=labelsW(C,rows.map(r=>r.l),12,.3);
 const val=r=>pct?r.v/r.t*100:r.v,mx=Math.max(...rows.map(r=>pct?Math.max(val(r),100):Math.max(r.v,isFinite(r.t)?r.t:0)))*1.08,sc=niceScale(0,mx,C.small?4:5);
 const fmt0=C.fmt;if(pct)C.fmt=v=>Math.round(v)+'%';const P={x0:24+lw,x1:C.W-24-(C.small?54:70),y0:y+4};const rh=Math.max(30,Math.min(48,C.ph/n));P.y1=P.y0+n*rh;
 const xa=xAxis(C,sc,P,{grid:false});C.fmt=fmt0;let o=xa.s,labs='';const bands=[.93,.85,.76].map(k=>C.t.dark?mix(C.cardBg,'#FFFFFF',1-k-.02):mix('#FFFFFF',C.ink,1-k));
 rows.forEach((r,i)=>{const cy=P.y0+rh*(i+.5),bh=Math.min(22,rh*.6);o+=T(C,P.x0-10,cy+4,clip(C.T(r.l),12,400,C.t.font,lw-14),{size:12,anchor:'end',fill:C.ink});
  const ref=pct?100:isFinite(r.t)?r.t:sc.hi;[[sc.hi/ref,0],[1,1],[.75,2]].forEach(([k,j])=>{const w=xa.map(Math.min(sc.hi,ref*k))-P.x0;o+=`<rect x="${P.x0}" y="${(cy-bh/2).toFixed(1)}" width="${Math.max(0,w).toFixed(1)}" height="${bh}" fill="${bands[j]}"/>`;});
  const w=Math.max(1,xa.map(Math.min(sc.hi,val(r)))-P.x0),vh=Math.max(6,bh*.38);o+=mark(C,'gx',[P.x0,cy],fill(C,bar(P.x0,cy-vh/2,w,vh,Math.min(C.r,3),'right'),C.cat[0],{pts:[[P.x0,cy-vh/2],[P.x0+w,cy-vh/2],[P.x0+w,cy+vh/2],[P.x0,cy+vh/2]],seed:i+2,hl:false,flat:true}));anchor(C,r.ri,0,P.x0+w,cy);
  if(isFinite(r.t)){const tx=xa.map(pct?100:r.t);o+=mark(C,'fade',null,`<rect x="${(tx-1.25).toFixed(1)}" y="${(cy-bh/2-3).toFixed(1)}" width="2.5" height="${bh+6}" fill="${C.ink}"/>`);}
  labs+=`<text x="${C.W-24}" y="${(cy+4).toFixed(1)}" ${C.F} font-size="12" text-anchor="end" fill="${C.ink}" style="font-variant-numeric:tabular-nums"><tspan font-weight="600">${esc(C.fmt(r.v))}</tspan>${isFinite(r.t)&&!C.small?`<tspan fill="${C.mute}"> / ${esc(C.fmt(r.t))}</tspan>`:''}</text>`;
  const ti=C.tip(r.l,[[C.cat[0],C.fmt(r.v),a.name],...(isFinite(r.t)?[[C.ink,C.fmt(r.t),'Target'],[null,Math.round(r.v/r.t*100)+'% of target']]:[])]);o+=hitR(0,cy-rh/2,C.W,rh,ti);});
 if(pct){C.vs=null;o+=T(C,P.x1,P.y1+32,'% of target',{size:11,anchor:'end'});}
 C.used=[C.cat[0]];C.H=P.y1+(pct?40:28);o+=`<g class="mk lab" data-a="fade" data-ai="${C.ai++}">${labs}</g>`;const ok=rows.filter(r=>isFinite(r.t)&&r.v>=r.t).length;if(b)C.extra.push(`${ok} of ${n} rows meet or beat their target.`);return o;};

/* slope: two moments per item */
R.slope=C=>{const {line,dot,alpha}=KIT();const D=C.d,[a,b]=D.ser;if(!a||!b){C.H=C.top+80;return T(C,24,C.top+30,'Pick two numeric columns: before and after.');}
 const rows=D.labels.map((l,i)=>({l,a:a.vals[i],b:b.vals[i],ri:D.ri[i]})).filter(r=>isFinite(r.a)&&isFinite(r.b));const all=rows.flatMap(r=>[r.a,r.b]),sc=niceScale(Math.min(...all),Math.max(...all),4);
 const big=rows.reduce((m,r)=>Math.abs(r.b-r.a)>Math.abs(m.b-m.a)?r:m,rows[0]||{a:0,b:0});const emph=C.opt.emph==null||C.opt.emph===''?-1:+C.opt.emph;const cat=rows.length<=5&&emph<0;
 const lab=Math.min(C.W*.26,Math.max(...rows.map(r=>measure(C.T(r.l),11.5,400,C.t.font)))+56),P={x0:24+lab,x1:C.W-24-lab,y0:C.top+34,y1:C.top+34+C.ph};const map=v=>P.y1-(v-sc.lo)/(sc.hi-sc.lo)*(P.y1-P.y0);
 C.vs={axis:'y',map,a:P.x0,b:P.x1};let o=`<line x1="${P.x0}" x2="${P.x0}" y1="${P.y0-8}" y2="${P.y1+8}" stroke="${alpha(C.ink,.3)}"/><line x1="${P.x1}" x2="${P.x1}" y1="${P.y0-8}" y2="${P.y1+8}" stroke="${alpha(C.ink,.3)}"/>`;
 o+=T(C,P.x0,P.y0-16,a.name,{size:12,w:600,fill:C.ink,anchor:'middle'})+T(C,P.x1,P.y0-16,b.name,{size:12,w:600,fill:C.ink,anchor:'middle'});
 const L=[],Rr=[];C.used=[];rows.forEach((r,i)=>{const hl=emph>=0?i===emph:r===big;const col=cat?C.cat[i%C.cat.length]:hl?C.cat[0]:alpha(C.mute,.55);if(cat||hl)C.used.push(cat?C.cat[i%C.cat.length]:C.cat[0]);
  o+=mark(C,'draw',null,line(C,[[P.x0,map(r.a)],[P.x1,map(r.b)]],col,hl||cat?2.2:1.4));o+=mark(C,'pop',[P.x0,map(r.a)],dot(C,P.x0,map(r.a),col,3.5)+dot(C,P.x1,map(r.b),col,3.5));anchor(C,r.ri,0,P.x0,map(r.a));anchor(C,r.ri,1,P.x1,map(r.b));
  L.push({y:map(r.a),name:r.l,v:C.fmt(r.a),hl:hl||cat});Rr.push({y:map(r.b),name:r.l,v:C.fmt(r.b),hl:hl||cat});
  const ti=C.tip(r.l,[[cat?col:C.cat[0],C.fmt(r.a),a.name],[cat?col:C.cat[0],C.fmt(r.b),b.name],[null,(r.b>=r.a?'+':'')+C.fmt(r.b-r.a)+(r.a?` (${((r.b/r.a-1)*100).toFixed(0)}%)`:'')]]);
  o+=`<path d="M${P.x0} ${map(r.a)}L${P.x1} ${map(r.b)}" stroke="transparent" stroke-width="14" fill="none" data-tip="${ti}"/>`;});
 const spread=arr=>{arr.sort((p,q)=>p.y-q.y);for(let i=1;i<arr.length;i++)if(arr[i].y-arr[i-1].y<14)arr[i].y=arr[i-1].y+14;};spread(L);spread(Rr);let labs='';
 L.forEach(it=>labs+=`<text x="${P.x0-10}" y="${(it.y+4).toFixed(1)}" ${C.F} font-size="11.5" text-anchor="end" fill="${it.hl?C.ink:C.mute}"><tspan>${C.FT(clip(it.name,11.5,400,C.t.font,lab-60))}</tspan> <tspan font-weight="600" fill="${C.ink}">${esc(it.v)}</tspan></text>`);
 Rr.forEach(it=>labs+=`<text x="${P.x1+10}" y="${(it.y+4).toFixed(1)}" ${C.F} font-size="11.5" fill="${it.hl?C.ink:C.mute}"><tspan font-weight="600" fill="${C.ink}">${esc(it.v)}</tspan> <tspan>${C.FT(clip(it.name,11.5,400,C.t.font,lab-60))}</tspan></text>`);
 o+=`<g class="mk lab" data-a="fade" data-ai="${C.ai++}">${labs}</g>`;C.H=Math.max(P.y1,...L.map(l=>l.y),...Rr.map(l=>l.y))+22;
 if(big)C.extra.push(`${big.l} changed most, from ${C.fmt(big.a)} to ${C.fmt(big.b)}.`);return o;};

/* dumbbell: before and after on one scale, one hue in two shades */
R.dumbbell=C=>{const {dot,mix,alpha}=KIT();const D=C.d,[a,b]=D.ser;if(!a||!b){C.H=C.top+80;return T(C,24,C.top+30,'Pick two numeric columns.');}
 const ca=mix(C.cat[0],C.cardBg,.55),cb=C.cat[0];const y=legend(C,[[a.name,ca],[b.name,cb]],C.top+6,'dot');C.used=[cb];
 const rows=D.labels.map((l,i)=>({l,a:a.vals[i],b:b.vals[i],ri:D.ri[i]})).filter(r=>isFinite(r.a)&&isFinite(r.b));const n=rows.length;const all=rows.flatMap(r=>[r.a,r.b]);
 const sc=niceScale(Math.min(0,...all)<0||C.opt.zero==='on'?Math.min(0,...all):Math.min(...all),Math.max(...all),C.small?4:5);const lw=labelsW(C,rows.map(r=>r.l),12,.3),rh=Math.max(24,Math.min(40,C.ph/n));
 const P={x0:24+lw,x1:C.W-34,y0:y+4,y1:y+4+n*rh};const xa=xAxis(C,sc,P);let o=xa.s,labs='';
 rows.forEach((r,i)=>{const cy=P.y0+rh*(i+.5),xa1=xa.map(r.a),xb=xa.map(r.b);o+=T(C,P.x0-10,cy+4,clip(C.T(r.l),12,400,C.t.font,lw-14),{size:12,anchor:'end',fill:C.ink});
  o+=mark(C,'gx',[xa1,cy],`<line x1="${xa1.toFixed(1)}" x2="${xb.toFixed(1)}" y1="${cy}" y2="${cy}" stroke="${alpha(C.cat[0],.45)}" stroke-width="3" stroke-linecap="round"/>`)+mark(C,'pop',[xa1,cy],dot(C,xa1,cy,ca,5))+mark(C,'pop',[xb,cy],dot(C,xb,cy,cb,5.5));
  anchor(C,r.ri,0,xa1,cy);anchor(C,r.ri,1,xb,cy);if(C.opt.labels!=='none'&&n<=20)labs+=T(C,xb+(xb>=xa1?10:-10),cy+4,C.fmt(r.b),{size:11,w:600,fill:C.ink,anchor:xb>=xa1?'start':'end',num:1});
  const ti=C.tip(r.l,[[ca,C.fmt(r.a),a.name],[cb,C.fmt(r.b),b.name],[null,'Change '+(r.b>=r.a?'+':'')+C.fmt(r.b-r.a)]]);o+=hitR(0,cy-rh/2,C.W,rh,ti);});
 o+=`<g class="mk lab" data-a="fade" data-ai="${C.ai++}">${labs}</g>`;C.H=P.y1+28;const up=rows.filter(r=>r.b>r.a).length;C.extra.push(`${up} of ${n} items went up from ${a.name} to ${b.name}.`);return o;};

/* KPI tiles */
R.kpi=C=>{const {line,dot,fill,alpha}=KIT();const D=C.d,ser=D.ser.slice(0,4);const n=ser.length;if(!n){C.H=C.top+80;return T(C,24,C.top+30,'Pick numeric columns.');}
 const cols=C.W<520?Math.min(2,n):n,gap=12,w=(C.W-48-gap*(cols-1))/cols,h=112;let o='';const card=C.t.board||C.t.id==='saas'||C.t.dark||C.t.derived;
 ser.forEach((s,i)=>{const col=i%cols,row=Math.floor(i/cols),x=24+col*(w+gap),y=C.top+10+row*(h+gap);const v=fin(s.vals),last=v[v.length-1],prev=v[v.length-2],li=s.vals.map(isFinite).lastIndexOf(true);
  const delta=isFinite(prev)&&prev!==0?(last-prev)/Math.abs(prev)*100:NaN,upGood=C.opt.invert!=='on',good=delta===0?null:(delta>0)===upGood,dc=good==null?C.mute:good?C.t.good:C.t.bad;
  if(card)o+=fill(C,`M${x+8} ${y}H${x+w-8}Q${x+w} ${y} ${x+w} ${y+8}V${y+h-8}Q${x+w} ${y+h} ${x+w-8} ${y+h}H${x+8}Q${x} ${y+h} ${x} ${y+h-8}V${y+8}Q${x} ${y} ${x+8} ${y}Z`,C.t.neu?C.t.bg:C.t.glow?'#1A2133':C.t.frost?'#FFFFFF':isHex(C.t.surface)?C.t.surface:'#FFFFFF',{hl:false});
  else if(C.t.id!=='tufte')o+=`<line x1="${x}" x2="${x+w}" y1="${y}" y2="${y}" stroke="${C.t.id==='brutal'?'#000':C.ink}" stroke-width="${C.t.id==='brutal'?3:1}"/>`;
  const px=x+(card?14:0),pw=w-(card?28:0);
  o+=mark(C,'fade',null,T(C,px,y+22,clip(C.T(s.name),12,400,C.t.font,pw),{size:12})+T(C,px,y+54,C.fmt(last),{size:Math.min(28,Math.max(18,pw/7)),w:600,fill:C.ink})+
   (isFinite(delta)?T(C,px,y+76,`${delta>0?'▲':delta<0?'▼':'■'} ${Math.abs(delta).toFixed(Math.abs(delta)<10?1:0)}%`,{size:11.5,w:600,fill:dc})+T(C,px+64,y+76,clip('vs '+(D.labels[li-1]||'previous'),11,400,C.t.font,pw-66),{size:11}):''));
  if(v.length>1){const mn=Math.min(...v),mx=Math.max(...v),sy=y+86,sh=14,P=s.vals.map((q,j)=>[px+j*pw/Math.max(1,s.vals.length-1),sy+sh-(q-mn)/(mx-mn||1)*sh,q]).filter(p=>isFinite(p[2])).map(p=>[p[0],p[1]]);
   o+=mark(C,'draw',null,line(C,P.slice(0,-1),alpha(C.mute,.6),1.5)+line(C,P.slice(-2),C.cat[0],1.8))+mark(C,'pop',P[P.length-1],dot(C,P[P.length-1][0],P[P.length-1][1],C.cat[0],2.6));anchor(C,D.ri[li],s.si,P[P.length-1][0],P[P.length-1][1]);}
  const ti=C.tip(s.name,[[null,C.fmt(last),D.labels[li]||''],...(isFinite(delta)?[[null,`${delta>0?'+':'−'}${Math.abs(delta).toFixed(1)}% vs ${D.labels[li-1]||'previous'}`]]:[])]);o+=hitR(x,y,w,h,ti);});
 C.used=[C.cat[0]];C.H=C.top+10+Math.ceil(n/cols)*(h+gap);C.extra.push(ser.map(s=>`${s.name} is ${C.fmt(fin(s.vals).slice(-1)[0])}`).join('; ')+'.');return o;};

/* meter: ring for the first row, bars for the rest */
R.gauge=C=>{const {fill,bar,mix,alpha}=KIT();const D=C.d,[a,b]=D.ser;if(!a){C.H=C.top+80;return T(C,24,C.top+30,'Pick a value column (and a target).');}
 const rows=D.labels.map((l,i)=>({l,v:a.vals[i],t:b?b.vals[i]:NaN,ri:D.ri[i]})).filter(r=>isFinite(r.v)).map(r=>({...r,t:isFinite(r.t)&&r.t>0?r.t:(+C.opt.target||niceScale(0,r.v,4).hi)}));if(!rows.length){C.H=C.top+80;return '';}
 const r0=rows[0],p=Math.max(0,Math.min(1,r0.v/r0.t)),narrow=C.W<560||rows.length===1,R0=narrow?Math.min(90,(C.W-60)/2*.7):88,cx=narrow?C.W/2:24+R0+20,cy=C.top+R0+24,sw=C.t.clay||C.t.neu?18:13;let o='';
 const arc=(a0,a1,col,w)=>{const P=an=>[cx+Math.cos(an)*R0,cy+Math.sin(an)*R0],[x0,y0]=P(a0),[x1,y1]=P(a1);return `<path d="M${x0.toFixed(2)} ${y0.toFixed(2)}A${R0} ${R0} 0 ${a1-a0>Math.PI?1:0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="${C.r?'round':'butt'}"/>`;};
 const s0=Math.PI*.75,e0=Math.PI*2.25,track=C.t.dark?alpha('#FFFFFF',.12):mix(C.seq[0],C.cardBg,.45);
 o+=arc(s0,e0,track,sw)+(p>0?mark(C,'fade',null,arc(s0,s0+(e0-s0)*Math.max(p,.005),C.cat[0],sw)):'');anchor(C,r0.ri,0,cx+Math.cos(s0+(e0-s0)*p)*R0,cy+Math.sin(s0+(e0-s0)*p)*R0);
 o+=T(C,cx,cy+6,Math.round(r0.v/r0.t*100)+'%',{size:30,w:600,fill:C.ink,anchor:'middle'})+T(C,cx,cy+26,`${C.fmt(r0.v)} of ${C.fmt(r0.t)}`,{size:11.5,anchor:'middle'})+T(C,cx,cy+R0*.72+28,clip(C.T(r0.l),12.5,600,C.t.font,R0*2),{size:12.5,w:600,fill:C.ink,anchor:'middle'});
 o+=hitR(cx-R0,cy-R0,R0*2,R0*2,C.tip(r0.l,[[C.cat[0],`${C.fmt(r0.v)} of ${C.fmt(r0.t)}`],[null,Math.round(r0.v/r0.t*100)+'% of target']]));
 let H=cy+R0*.72+40;
 if(rows.length>1){const bx=narrow?24:cx+R0+50,bw=C.W-24-bx;let by=narrow?H+16:C.top+30;rows.slice(narrow?1:0).forEach((r,i)=>{const q=Math.min(1,r.v/r.t),behind=q<.5;const col=C.cat[0];
   o+=T(C,bx,by-6,clip(C.T(r.l),12,400,C.t.font,bw-60),{size:12,fill:C.ink})+T(C,bx+bw,by-6,Math.round(r.v/r.t*100)+'%',{size:11.5,anchor:'end',num:1});
   o+=`<path d="${bar(bx,by,bw,8,C.r?4:0,'right')}" fill="${track}"/>`+mark(C,'gx',[bx,by],fill(C,bar(bx,by,Math.max(1,bw*q),8,C.r?4:0,'right'),col,{hl:false,flat:true}));anchor(C,r.ri,0,bx+bw*q,by+4);
   o+=hitR(bx,by-22,bw,34,C.tip(r.l,[[col,`${C.fmt(r.v)} of ${C.fmt(r.t)}`],[null,Math.round(r.v/r.t*100)+'% of target']]));by+=44;});H=Math.max(H,by);}
 C.used=[C.cat[0]];C.H=H;C.extra.push(`${r0.l} is at ${Math.round(r0.v/r0.t*100)}% of its ${C.fmt(r0.t)} target.`);return o;};

/* sankey: nodes in columns by depth, ribbons coloured by their source */
R.sankey=C=>{const {fill,alpha}=KIT();const D=C.d,m=D.map,s=D.ser[0];if(m.x<0||m.label<0||!s){C.H=C.top+80;return T(C,24,C.top+30,'Pick a From column, a To column and an amount.');}
 const links=D.rows.map((o,i)=>({a:String(o.r[m.x]).trim(),b:String(o.r[m.label]).trim(),v:s.vals[i],ri:D.ri[i]})).filter(l=>l.a&&l.b&&l.a!==l.b&&isFinite(l.v)&&l.v>0);if(!links.length){C.H=C.top+80;return T(C,24,C.top+30,'No flows with positive amounts.');}
 const names=[...new Set(links.flatMap(l=>[l.a,l.b]))],N=new Map(names.map((n,i)=>[n,{n,i,in:[],out:[],depth:0}]));links.forEach(l=>{N.get(l.a).out.push(l);N.get(l.b).in.push(l);});
 for(let it=0;it<names.length;it++){let ch=false;links.forEach(l=>{const d=N.get(l.a).depth+1;if(d>N.get(l.b).depth&&d<names.length){N.get(l.b).depth=d;ch=true;}});if(!ch)break;}
 const nodes=[...N.values()];nodes.forEach(n=>n.v=Math.max(sum(n.in.map(l=>l.v)),sum(n.out.map(l=>l.v))));const maxD=Math.max(...nodes.map(n=>n.depth));const cols=[...Array(maxD+1)].map((_,d)=>nodes.filter(n=>n.depth===d));
 const lab=C.small?70:Math.min(170,Math.max(...nodes.map(n=>measure(C.T(n.n),11.5,600,C.t.font)+measure(C.fmt(n.v),11.5,400,C.t.font)))+20);const nw=12,gp=10,P={x0:24+lab,x1:C.W-24-lab,y0:C.top+10,y1:C.top+10+C.ph*1.05};
 const sc=Math.min(...cols.map(c=>(P.y1-P.y0-gp*(c.length-1))/sum(c.map(n=>n.v))));const cx=d=>maxD?P.x0+d*(P.x1-P.x0-nw)/maxD:(P.x0+P.x1)/2;
 cols.forEach(c=>{let y=P.y0;c.forEach(n=>{n.y=y;n.h=Math.max(1,n.v*sc);y+=n.h+gp;});});C.used=[];
 cols[0].forEach((n,k)=>{n.c=k<5?C.cat[k]:C.neutral;if(k<5)C.used.push(n.c);});
 nodes.sort((a,b)=>a.depth-b.depth).forEach(n=>{if(!n.c){const big=n.in.slice().sort((a,b)=>b.v-a.v)[0];n.c=big?N.get(big.a).c:C.neutral;}});
 nodes.forEach(n=>{n.out.sort((a,b)=>N.get(a.b).y-N.get(b.b).y);n.in.sort((a,b)=>N.get(a.a).y-N.get(b.a).y);let oy=n.y;n.out.forEach(l=>{l.y0=oy;oy+=l.v*sc;});let iy=n.y;n.in.forEach(l=>{l.y1=iy;iy+=l.v*sc;});});
 let o='';links.forEach(l=>{const A=N.get(l.a),B=N.get(l.b),x0=cx(A.depth)+nw,x1=cx(B.depth),h=l.v*sc,mx=(x0+x1)/2,d=`M${x0} ${l.y0.toFixed(1)}C${mx} ${l.y0.toFixed(1)} ${mx} ${l.y1.toFixed(1)} ${x1} ${l.y1.toFixed(1)}V${(l.y1+h).toFixed(1)}C${mx} ${(l.y1+h).toFixed(1)} ${mx} ${(l.y0+h).toFixed(1)} ${x0} ${(l.y0+h).toFixed(1)}Z`;
  const ti=C.tip(`${l.a} → ${l.b}`,[[A.c,C.fmt(l.v)],[null,`${(l.v/A.v*100).toFixed(0)}% of ${l.a}`]]);o+=mark(C,'fade',null,`<path d="${d}" fill="${A.c}" opacity="${C.t.dark?.42:.32}"${C.t.multiply?' style="mix-blend-mode:multiply"':''}/><path d="${d}" fill="transparent" data-tip="${ti}"/>`);anchor(C,l.ri,0,mx,(l.y0+l.y1)/2+h/2);});
 let labs='';nodes.forEach(n=>{const x=cx(n.depth),last=n.depth===maxD;o+=mark(C,'pop',[x+nw/2,n.y+n.h/2],fill(C,`M${x} ${n.y.toFixed(1)}h${nw}v${n.h.toFixed(1)}h${-nw}Z`,n.depth?C.t.dark?'#8A90A0':C.ink:n.c,{hl:false,flat:true}));
  const left=n.depth===0;labs+=`<text x="${left?x-8:x+nw+8}" y="${(n.y+n.h/2+4).toFixed(1)}" ${C.F} font-size="11.5" fill="${C.ink}" text-anchor="${left?'end':'start'}" paint-order="stroke" stroke="${C.cardBg}" stroke-width="4" stroke-linejoin="round"><tspan font-weight="600">${C.FT(clip(n.n,11.5,600,C.t.font,lab-40))}</tspan> <tspan fill="${C.mute}">${esc(C.fmt(n.v))}</tspan></text>`;
  if(!left&&!last){}});
 o+=`<g class="mk lab" data-a="fade" data-ai="${C.ai++}">${labs}</g>`;C.H=Math.max(...nodes.map(n=>n.y+n.h))+20;const top=links.slice().sort((a,b)=>b.v-a.v)[0];C.extra.push(`${links.length} flows between ${nodes.length} nodes; the largest is ${top.a} → ${top.b} (${C.fmt(top.v)}).`);return o;};

/* histogram */
R.histogram=C=>{const {fill,bar,alpha}=KIT();const D=C.d,s=D.ser[0];if(!s){C.H=C.top+80;return T(C,24,C.top+30,'Pick a numeric column.');}
 const v=fin(s.vals).sort((a,b)=>a-b);const n=v.length;if(n<2){C.H=C.top+80;return T(C,24,C.top+30,'A histogram needs at least two values.');}
 const k=+C.opt.bins||Math.max(6,Math.min(40,Math.ceil((Math.log2(n)+1)*1.6))),xs=niceScale(v[0],v[n-1],k),w=xs.step,edges=xs.ticks;if(edges.length<2)edges.push(edges[0]+w);
 const bins=edges.slice(0,-1).map((e,i)=>({a:e,b:edges[i+1],c:v.filter(q=>q>=e&&(i===edges.length-2?q<=edges[i+1]:q<edges[i+1])).length}));
 const ys=niceScale(0,Math.max(...bins.map(b=>b.c)),4);const fmt0=C.fmt;const P={x0:24+Math.max(...ys.ticks.map(t=>measure(String(t),10.5,400,C.mono)))+16,x1:C.W-24,y0:C.top+16,y1:C.top+16+C.ph};
 C.fmt=q=>String(q);const ya=yAxis(C,ys,P,{noVS:true});C.fmt=fmt0;let o=ya.s;const xm=q=>P.x0+(q-edges[0])/(edges[edges.length-1]-edges[0])*(P.x1-P.x0);
 bins.forEach((b,i)=>{const x=xm(b.a)+1,ww=Math.max(1,xm(b.b)-xm(b.a)-2),y=ya.map(b.c),h=P.y1-y;if(b.c)o+=mark(C,'gy',[x,P.y1],fill(C,bar(x,y,ww,h,Math.min(C.r,ww/2),'up'),C.cat[0],{pts:[[x,y],[x+ww,y],[x+ww,P.y1],[x,P.y1]],seed:i+1,hl:false,flat:true}));
  o+=hitR(xm(b.a),P.y0,xm(b.b)-xm(b.a),P.y1-P.y0,C.tip(`${C.fmt(b.a)} – ${C.fmt(b.b)}`,[[C.cat[0],b.c+' value'+(b.c===1?'':'s')],[null,(b.c/n*100).toFixed(1)+'% of all']]));});
 const lw=Math.max(...edges.map(e=>measure(C.fmt(e),10.5,400,C.mono)))+8,every=Math.max(1,Math.ceil(lw/Math.max(1,xm(edges[1])-xm(edges[0]))));
 edges.forEach((e,i)=>{if(i%every===0)o+=T(C,xm(e),P.y1+17,C.fmt(e),{mono:1,size:10.5,anchor:'middle',num:1});});
 const med=n%2?v[(n-1)/2]:(v[n/2-1]+v[n/2])/2,mx=xm(med);o+=`<g class="mk lab" data-a="fade" data-ai="${C.ai++}"><line x1="${mx}" x2="${mx}" y1="${P.y0-4}" y2="${P.y1}" stroke="${C.ink}" stroke-width="1.5"/>${T(C,mx+6,P.y0+6,'Median '+C.fmt(med),{size:11,w:600,fill:C.ink,halo:1})}</g>`;
 o+=`<line x1="${P.x0}" x2="${P.x1}" y1="${P.y1}" y2="${P.y1}" stroke="${alpha(C.ink,.35)}"/>`;C.vs={axis:'x',map:xm,a:P.y0,b:P.y1};C.used=[C.cat[0]];C.H=P.y1+28;
 C.extra.push(`${n} values of ${s.name} from ${C.fmt(v[0])} to ${C.fmt(v[n-1])}, median ${C.fmt(med)}, in ${bins.length} bins of ${C.fmt(w)}.`);return o;};

/* box plot */
const quant=(v,p)=>{const i=(v.length-1)*p,lo=Math.floor(i),hi=Math.ceil(i);return v[lo]+(v[hi]-v[lo])*(i-lo);};
R.boxplot=C=>{const {fill,dot,alpha,mix}=KIT();const D=C.d;let groups=[];const gi=D.map.x;
 if(gi>=0&&D.ser.length){const s=D.ser[0],names=[...new Set(D.rows.map(o=>String(o.r[gi]).trim()))];groups=names.slice(0,8).map(n=>({name:n,v:fin(D.rows.map((o,i)=>String(o.r[gi]).trim()===n?s.vals[i]:NaN))}));if(names.length>8)C.warn.push('Showing the first eight groups.');}
 else groups=D.ser.map(s=>({name:s.name,v:fin(s.vals)}));groups=groups.filter(g=>g.v.length).map(g=>({...g,v:g.v.sort((a,b)=>a-b)}));
 if(!groups.length){C.H=C.top+80;return T(C,24,C.top+30,'Pick numeric columns (or a group column and a value).');}
 groups.forEach(g=>{g.q1=quant(g.v,.25);g.md=quant(g.v,.5);g.q3=quant(g.v,.75);const iqr=g.q3-g.q1;g.lo=g.v.find(x=>x>=g.q1-1.5*iqr);g.hi=[...g.v].reverse().find(x=>x<=g.q3+1.5*iqr);g.out=g.v.filter(x=>x<g.lo||x>g.hi);});
 const all=groups.flatMap(g=>g.v),sc=niceScale(Math.min(...all),Math.max(...all),C.small?4:5);const P={x0:24+axisW(C,sc),x1:C.W-24,y0:C.top+14,y1:C.top+14+C.ph};const ya=yAxis(C,sc,P);let o=ya.s;
 const bw0=(P.x1-P.x0)/groups.length,bw=Math.max(10,Math.min(44,bw0*.5)),cx=i=>P.x0+bw0*(i+.5);const col=C.cat[0],soft=mix(col,C.cardBg,.72);
 groups.forEach((g,i)=>{const x=cx(i),y1=ya.map(g.q3),y3=ya.map(g.q1),r=Math.min(C.r,4);
  o+=mark(C,'fade',null,`<line x1="${x}" x2="${x}" y1="${ya.map(g.hi).toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${C.ink}" stroke-width="1.25"/><line x1="${x}" x2="${x}" y1="${y3.toFixed(1)}" y2="${ya.map(g.lo).toFixed(1)}" stroke="${C.ink}" stroke-width="1.25"/><line x1="${x-bw/4}" x2="${x+bw/4}" y1="${ya.map(g.hi).toFixed(1)}" y2="${ya.map(g.hi).toFixed(1)}" stroke="${C.ink}" stroke-width="1.25"/><line x1="${x-bw/4}" x2="${x+bw/4}" y1="${ya.map(g.lo).toFixed(1)}" y2="${ya.map(g.lo).toFixed(1)}" stroke="${C.ink}" stroke-width="1.25"/>`);
  o+=mark(C,'pop',[x,ya.map(g.md)],`<rect x="${x-bw/2}" y="${y1.toFixed(1)}" width="${bw}" height="${Math.max(1,y3-y1).toFixed(1)}" rx="${r}" fill="${soft}" stroke="${col}" stroke-width="1.5"/><line x1="${x-bw/2}" x2="${x+bw/2}" y1="${ya.map(g.md).toFixed(1)}" y2="${ya.map(g.md).toFixed(1)}" stroke="${col}" stroke-width="2.5"/>`);
  g.out.forEach(q=>o+=mark(C,'pop',[x,ya.map(q)],dot(C,x,ya.map(q),col,2.6)));
  o+=hitR(x-bw0/2,P.y0,bw0,P.y1-P.y0,C.tip(g.name,[[col,'Median '+C.fmt(g.md)],[null,`Middle half ${C.fmt(g.q1)} – ${C.fmt(g.q3)}`],[null,`Range ${C.fmt(g.v[0])} – ${C.fmt(g.v[g.v.length-1])}`],[null,`${g.v.length} values${g.out.length?`, ${g.out.length} outlier${g.out.length>1?'s':''}`:''}`]]));});
 o+=catLabels(C,groups.map(g=>g.name),cx,bw0,P.y1+17);C.used=[col];C.H=P.y1+28;const hiG=groups.reduce((a,b)=>b.md>a.md?b:a);C.extra.push(`${groups.length} groups; ${hiG.name} has the highest median at ${C.fmt(hiG.md)}. Boxes span the middle half of values; whiskers reach 1.5× that span.`);return o;};

/* heatmap */
R.heatmap=C=>{const {onFill}=KIT();const D=C.d,ser=D.ser,n=D.labels.length;if(!n||!ser.length){C.H=C.top+80;return T(C,24,C.top+30,'Add rows and numeric columns.');}
 const all=fin(ser.flatMap(s=>s.vals)),mn=Math.min(...all),mx=Math.max(...all),diverge=mn<0&&mx>0;const pal=diverge?C.div:C.seq;
 const lw=labelsW(C,D.labels,11.5,.28),P={x0:24+lw,x1:C.W-24,y0:C.top+30};const cw=(P.x1-P.x0)/ser.length,ch=Math.max(18,Math.min(40,C.ph/n)),gap=2;P.y1=P.y0+n*ch;
 const step=v=>{if(diverge){const m=Math.max(-mn,mx);return Math.max(0,Math.min(4,Math.round((v/m+1)*2)));}return Math.max(0,Math.min(4,Math.floor((v-mn)/((mx-mn)||1)*4.999)));};let o='',labs='';
 ser.forEach((s,j)=>o+=T(C,P.x0+cw*(j+.5),P.y0-10,clip(C.T(s.name),10.5,400,C.mono,cw-4),{mono:1,size:10.5,anchor:'middle'}));
 const show=C.opt.labels==='all'||(C.opt.labels!=='none'&&cw>=40&&ch>=20&&n*ser.length<=120);
 D.labels.forEach((l,i)=>{const y=P.y0+i*ch;o+=T(C,P.x0-10,y+ch/2+4,clip(C.T(l),11.5,400,C.t.font,lw-14),{size:11.5,anchor:'end',fill:C.ink});
  ser.forEach((s,j)=>{const v=s.vals[i],x=P.x0+j*cw;if(!isFinite(v)){o+=`<rect x="${x+gap/2}" y="${y+gap/2}" width="${cw-gap}" height="${ch-gap}" fill="none" stroke="${C.grid||C.mute}" stroke-dasharray="2 2"/>`;return;}const col=pal[step(v)];
   o+=mark(C,'fade',null,`<rect x="${(x+gap/2).toFixed(1)}" y="${(y+gap/2).toFixed(1)}" width="${(cw-gap).toFixed(1)}" height="${(ch-gap).toFixed(1)}" rx="${C.r?3:0}" fill="${col}"${C.t.multiply?' style="mix-blend-mode:multiply"':''}/>`);anchor(C,D.ri[i],s.si,x+cw/2,y+ch/2);
   if(show)labs+=T(C,x+cw/2,y+ch/2+4,C.fmt(v),{size:10.5,w:600,fill:onFill(col,C.t),anchor:'middle',num:1});o+=hitR(x,y,cw,ch,C.tip(`${l} · ${s.name}`,[[col,C.fmt(v)]]));});});
 const ly=P.y1+20;labs+=T(C,P.x0,ly+4,diverge?'Lower':'Less')+pal.map((c,k)=>`<rect x="${P.x0+48+k*26}" y="${ly-6}" width="24" height="12" rx="${C.r?2:0}" fill="${c}"/>`).join('')+T(C,P.x0+48+5*26+6,ly+4,diverge?'Higher':'More')+T(C,P.x1,ly+4,`${C.fmt(mn)} to ${C.fmt(mx)}`,{anchor:'end',num:1});
 o+=`<g class="mk lab" data-a="fade" data-ai="${C.ai++}">${labs}</g>`;C.used=[];C.H=ly+16;let best=null;ser.forEach(s=>s.vals.forEach((v,i)=>{if(isFinite(v)&&(!best||v>best[0]))best=[v,D.labels[i],s.name];}));
 if(best)C.extra.push(`Highest cell: ${best[1]} · ${best[2]} at ${C.fmt(best[0])}. ${diverge?'A diverging ramp centred on zero':'A one-hue ramp, more is darker'}.`);return o;};

/* scatter and bubble */
function scatter(C,bubble){const {alpha}=KIT();const D=C.d,m=D.map,tb=D.tb;if(m.x<0||!D.ser[0]){C.H=C.top+80;return T(C,24,C.top+30,'Pick a numeric X column and a Y column.');}
 const xs=D.rows.map(o=>parseNum(o.r[m.x])),ys=D.ser[0].vals,ss=bubble&&m.size>=0?D.rows.map(o=>parseNum(o.r[m.size])):null;
 const gi=m.group,names=m.label>=0?D.rows.map(o=>String(o.r[m.label])):D.labels;const groups=gi>=0?[...new Set(D.rows.map(o=>String(o.r[gi])))]:[''];
 if(groups.length>3){C.warn.push(`${groups.length} colour groups: past three, colours get hard to tell apart in a scatter. The rest are grey.`);}
 const gcol=g=>{const k=groups.indexOf(g);return k<3?C.cat[((C.opt.slots||[])[k]!=null&&(C.opt.slots||[])[k]!==''?+(C.opt.slots||[])[k]:k)%C.cat.length]:C.neutral;};C.used=groups.slice(0,3).map(gcol);
 let y=gi>=0?legend(C,groups.map(g=>[g,gcol(g)]),C.top+6,'dot'):C.top+6;
 const pts=xs.map((x,i)=>({x,y:ys[i],s:ss?ss[i]:1,n:names[i],g:gi>=0?String(D.rows[i].r[gi]):'',ri:D.ri[i]})).filter(p=>isFinite(p.x)&&isFinite(p.y)&&(!ss||isFinite(p.s)));if(!pts.length){C.H=C.top+80;return T(C,24,C.top+30,'No rows with both values.');}
 const zx=C.opt.zero==='on',sx=niceScale(zx?Math.min(0,...pts.map(p=>p.x)):Math.min(...pts.map(p=>p.x)),Math.max(...pts.map(p=>p.x)),C.small?4:6),sy=niceScale(zx?Math.min(0,...pts.map(p=>p.y)):Math.min(...pts.map(p=>p.y)),Math.max(...pts.map(p=>p.y)),C.small?4:5);
 const P={x0:24+axisW(C,sy),x1:C.W-24,y0:y+26,y1:y+26+C.ph};const ya=yAxis(C,sy,P,{noVS:true}),xa=xAxis(C,sx,P,{vs:false});C.vs={axis:'y',map:ya.map,a:P.x0,b:P.x1};let o=ya.s+xa.s;
 o+=T(C,P.x1,P.y1+34,tb.columns[m.x]+' →',{size:11.5,anchor:'end',fill:C.ink})+T(C,24,P.y0-16,D.ser[0].name+' ↑',{size:11.5,fill:C.ink});
 const smax=ss?Math.max(...pts.map(p=>Math.abs(p.s))):1,rad=p=>bubble?Math.max(3,Math.sqrt(Math.abs(p.s)/smax)*Math.min(30,C.W/26)):4.5;
 const order=bubble?[...pts].sort((a,b)=>Math.abs(b.s)-Math.abs(a.s)):pts;let body='',labs='';
 order.forEach((p,k)=>{const x=xa.map(p.x),yy=ya.map(p.y),r=rad(p),c=gcol(p.g);body+=mark(C,'pop',[x,yy],`<circle cx="${x.toFixed(1)}" cy="${yy.toFixed(1)}" r="${(r+2).toFixed(1)}" fill="${C.cardBg}"${bubble?' opacity=".9"':''}/><circle cx="${x.toFixed(1)}" cy="${yy.toFixed(1)}" r="${r.toFixed(1)}" fill="${c}"${bubble?' fill-opacity=".78"':''}${C.t.id==='brutal'?' stroke="#000" stroke-width="1.5"':''}/>`);
  anchor(C,p.ri,0,x,yy);body+=`<circle cx="${x.toFixed(1)}" cy="${yy.toFixed(1)}" r="${Math.max(r,9).toFixed(1)}" fill="transparent" data-tip="${C.tip(p.n,[[c,`${C.fmt(p.x)} · ${C.fmt(p.y)}`,`${tb.columns[m.x]} · ${D.ser[0].name}`],...(ss?[[null,C.fmt(p.s),tb.columns[m.size]]]:[]),...(p.g?[[null,p.g]]:[])])}"/>`;});
 const lab=C.opt.labels||'auto';if(lab!=='none'){const pick=lab==='all'?pts:[...new Set([pts.reduce((a,b)=>b.y>a.y?b:a),pts.reduce((a,b)=>b.x>a.x?b:a),pts.reduce((a,b)=>b.y<a.y?b:a),...(bubble?[pts.reduce((a,b)=>b.s>a.s?b:a)]:[])])];const placed=[];
  pick.forEach(p=>{const x=xa.map(p.x),yy=ya.map(p.y)-rad(p)-6,w=measure(p.n,11,400,C.t.font);if(placed.some(q=>Math.abs(q[0]-x)<(w+q[2])/2&&Math.abs(q[1]-yy)<13))return;placed.push([x,yy,w]);labs+=T(C,Math.min(P.x1-w/2,Math.max(P.x0+w/2,x)),yy,clip(p.n,11,400,C.t.font,160),{size:11,fill:C.ink,anchor:'middle',halo:1});});}
 o+=body+`<g class="mk lab" data-a="fade" data-ai="${C.ai++}">${labs}</g>`;C.H=P.y1+44;
 const mxv=sum(pts.map(p=>p.x))/pts.length,myv=sum(pts.map(p=>p.y))/pts.length,cov=sum(pts.map(p=>(p.x-mxv)*(p.y-myv))),r=cov/Math.sqrt(sum(pts.map(p=>(p.x-mxv)**2))*sum(pts.map(p=>(p.y-myv)**2))||1);
 C.extra.push(`${pts.length} points. ${Math.abs(r)<.2?'No clear relationship':`A ${Math.abs(r)>.7?'strong':Math.abs(r)>.4?'moderate':'weak'} ${r>0?'positive':'negative'} relationship`} between ${tb.columns[m.x]} and ${D.ser[0].name} (r = ${r.toFixed(2)}).`);return o;}
R.scatter=C=>scatter(C,false);R.bubble=C=>scatter(C,true);

/* radar */
R.radar=C=>{const {alpha}=KIT();const D=C.d,ser=D.ser.slice(0,3),n=D.labels.length;if(n<3||!ser.length){C.H=C.top+80;return T(C,24,C.top+30,'A radar needs at least three rows (axes) and a numeric column.');}
 if(n>12)C.warn.push('More than twelve axes are hard to read; consider bars.');const y=legend(C,ser.map(s=>[s.name,s.color]),C.top+6,'line');
 const all=fin(ser.flatMap(s=>s.vals)),sc=niceScale(0,Math.max(...all),4);const R0=Math.min((C.W-48)/2-(C.small?40:90),C.ph*.52),cx=C.W/2,cy=y+12+R0+16;const ang=i=>-Math.PI/2+i*2*Math.PI/n,P=(i,v)=>[cx+Math.cos(ang(i))*R0*v/sc.hi,cy+Math.sin(ang(i))*R0*v/sc.hi];let o='';
 sc.ticks.slice(1).forEach(t=>{o+=`<path d="M${D.labels.map((_,i)=>P(i,t).map(q=>q.toFixed(1)).join(' ')).join(' L')}Z" fill="none" stroke="${C.grid||alpha(C.ink,.12)}"/>`+T(C,cx+4,cy-R0*t/sc.hi-3,C.fmt(t),{mono:1,size:9.5});});
 D.labels.forEach((l,i)=>{const [x,yy]=P(i,sc.hi);o+=`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${yy.toFixed(1)}" stroke="${C.grid||alpha(C.ink,.12)}"/>`;const c=Math.cos(ang(i));o+=T(C,cx+Math.cos(ang(i))*(R0+12),cy+Math.sin(ang(i))*(R0+12)+4,clip(C.T(l),11.5,400,C.t.font,C.small?60:110),{size:11.5,fill:C.ink,anchor:Math.abs(c)<.2?'middle':c>0?'start':'end'});});
 ser.forEach(s=>{const pts=D.labels.map((_,i)=>P(i,Math.max(0,s.vals[i]||0)));o+=mark(C,'pop',[cx,cy],`<path d="M${pts.map(q=>q.map(z=>z.toFixed(1)).join(' ')).join(' L')}Z" fill="${alpha(s.color,.1)}" stroke="${s.color}" stroke-width="2" stroke-linejoin="round"/>`);pts.forEach((q,i)=>anchor(C,D.ri[i],s.si,q[0],q[1]));});
 D.labels.forEach((l,i)=>{const [x,yy]=P(i,sc.hi*.6);o+=`<circle cx="${x.toFixed(1)}" cy="${yy.toFixed(1)}" r="${Math.min(30,R0*.3)}" fill="transparent" data-tip="${C.tip(l,ser.map(s=>[s.color,C.fmt(s.vals[i]),s.name]))}"/>`;});
 C.H=cy+R0+30;return o;};

/* ---------------- annotations: callout on a value, reference line, reference band ---------------- */
function annotate(C){let o='';const t=C.t;(C.opt.notes||[]).forEach((n,k)=>{if(!n||!n.type)return;
 if(n.type==='point'){const a=C.anchors.get(`${+n.row||0}:${+n.series||0}`)||C.anchors.get(`${+n.row||0}:0`);if(!a){C.warn.push(`The callout “${n.text||''}” points at a value this chart does not show.`);return;}
  const lines=wrapT(n.text||'',11.5,600,t.font,C.small?120:170).slice(0,3),w=Math.max(...lines.map(l=>measure(l,11.5,600,t.font))),h=lines.length*15;
  const right=a.x<C.W*.62,tx=right?Math.min(C.W-24-w,a.x+36):Math.max(24,a.x-36-w),up=a.y-h-30>C.top;const ty=up?a.y-h-26:Math.min(C.H-h-6,a.y+28);
  const sx=right?tx-4:tx+w+4,sy=ty+h/2-2,mx=(sx+a.x)/2,my=up?Math.min(sy,a.y)-6:Math.max(sy,a.y)+6;
  o+=`<path d="M${sx.toFixed(1)} ${sy.toFixed(1)}Q${a.x.toFixed(1)} ${sy.toFixed(1)} ${(a.x+(sx<a.x?-5:5)*0).toFixed(1)} ${(a.y+(up?-7:7)).toFixed(1)}" fill="none" stroke="${C.ink}" stroke-width="1.25" marker-end="url(#${C.uid}ar)"/>`;
  o+=`<circle cx="${a.x.toFixed(1)}" cy="${a.y.toFixed(1)}" r="7.5" fill="none" stroke="${C.ink}" stroke-width="1.25"/>`;
  lines.forEach((l,i)=>o+=T(C,tx,ty+11+i*15,l,{size:11.5,w:600,fill:C.ink,halo:1}));}
 else if((n.type==='line'||n.type==='band')&&C.vs){const v=parseNum(n.value),v2=parseNum(n.to);if(!isFinite(v))return;const vs=C.vs,p=vs.map(v);
  if(n.type==='line'){if(vs.axis==='y')o+=`<line x1="${vs.a}" x2="${vs.b}" y1="${p.toFixed(1)}" y2="${p.toFixed(1)}" stroke="${C.ink}" stroke-width="1.5" opacity=".75"/>`+T(C,vs.b-2,p-6,n.text||C.fmt(v),{size:11,w:600,fill:C.ink,anchor:'end',halo:1});
   else o+=`<line y1="${vs.a}" y2="${vs.b}" x1="${p.toFixed(1)}" x2="${p.toFixed(1)}" stroke="${C.ink}" stroke-width="1.5" opacity=".75"/>`+T(C,p+5,vs.a+10,n.text||C.fmt(v),{size:11,w:600,fill:C.ink,halo:1});}
  else if(isFinite(v2)){const q=vs.map(v2);const lo=Math.min(p,q),hi=Math.max(p,q);if(vs.axis==='y')o+=`<rect x="${vs.a}" y="${lo.toFixed(1)}" width="${vs.b-vs.a}" height="${(hi-lo).toFixed(1)}" fill="${C.ink}" opacity="${t.dark?.08:.06}"/>`+T(C,vs.a+6,lo+13,n.text||'',{size:11,w:600,fill:C.ink});
   else o+=`<rect y="${vs.a}" x="${lo.toFixed(1)}" height="${vs.b-vs.a}" width="${(hi-lo).toFixed(1)}" fill="${C.ink}" opacity="${t.dark?.08:.06}"/>`+T(C,lo+6,vs.a+12,n.text||'',{size:11,w:600,fill:C.ink});}}
 else if(n.type==='line'||n.type==='band')C.warn.push('Reference lines need a chart with a value axis.');});
 return o?`<g class="mk notes" data-a="fade" data-ai="${C.ai++}">${o}</g>`:'';}

/* ---------------- long description ---------------- */
function describe(C,kind,title){const D=C.d,k=KIND[kind],parts=[`${k.name} chart${title?`: ${title}`:''}.`];
 if(['histogram','scatter','bubble','sankey','boxplot','treemap','pie','donut','waterfall','funnel','gauge','kpi','heatmap','bullet','slope','dumbbell','multiples'].includes(kind)){}
 if(!['histogram','scatter','bubble','sankey','boxplot'].includes(kind)&&D.labels.length){const L=D.labels;parts.push(`${L.length} ${D.xName.toLowerCase()==='row'?'rows':`values of ${D.xName}`}${L.length>1?`, from ${L[0]} to ${L[L.length-1]}`:''}.`);
  if(!['pie','donut','treemap','funnel','gauge','kpi','waterfall'].includes(kind))D.ser.slice(0,5).forEach(s=>{const v=s.vals.map((x,i)=>[x,i]).filter(p=>isFinite(p[0]));if(!v.length)return;const mx=v.reduce((a,b)=>b[0]>a[0]?b:a),mn=v.reduce((a,b)=>b[0]<a[0]?b:a);
   const f=v[0][0],l=v[v.length-1][0];parts.push(`${s.name}: highest ${C.fmt(mx[0])} (${L[mx[1]]}), lowest ${C.fmt(mn[0])} (${L[mn[1]]})${v.length>2&&['line','area','stackedArea','column','multiples','kpi'].includes(kind)?`, ${l>f?'up':l<f?'down':'flat'} from ${C.fmt(f)} to ${C.fmt(l)}${f?` (${l>=f?'+':''}${((l/f-1)*100).toFixed(0)}%)`:''}`:''}.`);});}
 parts.push(...C.extra);(C.opt.notes||[]).filter(n=>n&&n.text).forEach(n=>parts.push(`Note: ${n.text}.`));if(C.opt.source)parts.push(`Source: ${C.opt.source}.`);
 return parts.join(' ').replace(/\.\./g,'.');}

/* ---------------- frame ---------------- */
function render(kind,tb,style,opt={}){if(!KIND[kind])kind='column';const s=modeStyle(style,opt.mode);if(window.DVFonts)window.DVFonts(s);
 const C=ctx(s,kind,opt),t=s.t,map=opt.map||defaultMap(kind,tb);prep(C,tb,map);
 const title=(opt.title??'').trim(),sub=(opt.subtitle??'').trim(),serif=t.serifTitle||t.id==='tufte'||t.id==='editorial';const tsz=serif?(C.small?17:20):(C.small?15.5:17);
 const tw=C.W-48,tl=title?wrapT(C.T(title),tsz,600,serif?t.head:t.font,tw).slice(0,2):[],sl=sub?wrapT(sub,12.5,400,t.font,tw).slice(0,2):[];
 let y=t.tag?30:22,head=t.tag?`<rect x="24" y="14" width="30" height="5" fill="${t.accent}"/>`:'';
 tl.forEach(l=>{y+=tsz*1.2;head+=`<text x="24" y="${y.toFixed(1)}" font-family="${esc(serif?t.head:t.font)}" font-size="${tsz}" font-weight="${t.id==='brutal'?400:600}" fill="${C.ink}">${esc(l)}</text>`;});
 sl.forEach((l,i)=>{y+=i?16:tl.length?20:16;head+=`<text x="24" y="${y.toFixed(1)}" ${C.F} font-size="12.5" fill="${C.mute}">${esc(l)}</text>`;});
 C.top=y+(tl.length||sl.length?16:4);
 let body;try{body=R[kind](C);}catch(e){console.error(e);C.H=C.top+80;body=T(C,24,C.top+30,'Could not draw this chart from the data: '+(e.message||e));C.warn.push('The chart failed to draw: '+(e.message||e));}
 if(new Set(C.used).size<C.used.length)C.warn.push('Two series share a colour slot; give each its own slot.');
 C.H=Math.ceil(C.H||C.top+200);const notes=annotate(C);const srcTxt=(opt.source||'').trim();const W=C.W;let H=C.H+(srcTxt?14:0)+16;
 const src=srcTxt?`<text x="24" y="${H-14}" ${C.F} font-size="10.5" fill="${C.mute}">${esc(C.T('Source: '))}${esc(srcTxt)}</text>`:'';
 const tex=window.DVTexture&&t.texture&&t.texture!=='none'&&t.texture!=='dots'?window.DVTexture(s,C.uid+'t',W,H):null;
 let bg=tex?tex.rect:`<rect width="${W}" height="${H}" fill="${t.neu?t.bg:t.glow?'#0E1320':C.cardBg}"/>`;if(tex)C.defs+=tex.defs;
 if(t.frost)bg+=`<rect width="${W}" height="${H}" fill="rgba(255,255,255,.62)"/>`;if(t.glow&&tex)bg+=`<rect width="${W}" height="${H}" fill="rgba(255,255,255,.035)"/>`;
 if(t.texture==='dots'){C.defs+=`<pattern id="${C.uid}d" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="${t.grid}"/></pattern>`;bg+=`<rect width="${W}" height="${H}" fill="url(#${C.uid}d)" opacity=".6"/>`;}
 const desc=opt.desc&&String(opt.desc).trim()?String(opt.desc).trim():describe(C,kind,title);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="${C.uid}-t ${C.uid}-d"><title id="${C.uid}-t">${esc(title||KIND[kind].name+' chart')}</title><desc id="${C.uid}-d">${esc(desc)}</desc><defs>${C.defs}</defs>${bg}<g class="hd">${head}</g>${C.legendSVG||''}${body}${notes}${src}${tex&&tex.over?tex.over:''}</svg>`;
 return {svg,tips:C.tips,width:W,height:H,desc,warnings:C.warn,palette:[...new Set(C.used)],pairs:KIND[kind].pairs||'adjacent',style:s,surface:solidSurface(s),map,kind};}

/* ---------------- build-up animation: bars grow, lines draw, the rest fades in, in mark order ---------------- */
const ease=p=>p<=0?0:p>=1?1:1-Math.pow(1-p,3);
function plan(svg,o={}){const sp=o.speed||1;const els=[...svg.querySelectorAll('g.mk')].sort((a,b)=>(+a.dataset.ai)-(+b.dataset.ai));const saved=new Map(els.map(e=>[e,e.getAttribute('style')]));
 const isLab=e=>e.classList.contains('lab')||e.classList.contains('notes');const marks=els.filter(e=>!isLab(e)),labs=els.filter(isLab);
 const step=Math.max(12,Math.min(140,2600/Math.max(1,marks.length)))/sp,dur=520/sp;let t=300/sp;const sched=new Map();
 marks.forEach(e=>{sched.set(e,[t,dur]);t+=step;});const after=t+dur*.6;labs.forEach((e,i)=>sched.set(e,[after+i*260/sp,420/sp]));const end=(labs.length?after+labs.length*260/sp+420/sp:t+dur)+120/sp;
 const lens=new Map();els.forEach(e=>{if(e.dataset.a==='draw')e.querySelectorAll('path').forEach(p=>{try{lens.set(p,p.getTotalLength());}catch{lens.set(p,0);}});});
 function apply(ms){for(const e of els){const [s0,d]=sched.get(e),p=ease(Math.max(0,Math.min(1,(ms-s0)/d))),a=e.dataset.a,org=(e.dataset.o||'0 0').split(' ');
   if(a==='gy'){e.style.transformOrigin=`${org[0]}px ${org[1]}px`;e.style.transform=p>=1?'':`scaleY(${Math.max(.0001,p).toFixed(4)})`;e.style.opacity=p>0?'1':'0';}
   else if(a==='gx'){e.style.transformOrigin=`${org[0]}px ${org[1]}px`;e.style.transform=p>=1?'':`scaleX(${Math.max(.0001,p).toFixed(4)})`;e.style.opacity=p>0?'1':'0';}
   else if(a==='pop'){e.style.transformOrigin=`${org[0]}px ${org[1]}px`;e.style.transform=p>=1?'':`scale(${(.4+.6*p).toFixed(4)})`;e.style.opacity=p.toFixed(3);}
   else if(a==='draw'){e.querySelectorAll('path').forEach(pa=>{const L=lens.get(pa)||0;if(L>0){pa.style.strokeDasharray=`${L} ${L}`;pa.style.strokeDashoffset=((1-p)*L).toFixed(2);}});e.style.opacity=p>0?'1':'0';}
   else e.style.opacity=p.toFixed(3);}}
 function reset(){for(const [e,st] of saved){if(st==null)e.removeAttribute('style');else e.setAttribute('style',st);e.querySelectorAll('path').forEach(p=>{p.style.strokeDasharray='';p.style.strokeDashoffset='';});}}
 return {duration:end,apply,reset,count:marks.length};}

/* ---------------- sample data to start from ---------------- */
const SAMPLES=[
 {id:'views',name:'Monthly views by platform',kind:'line',title:'YouTube pulled ahead in the autumn',subtitle:'Monthly views by platform, thousands, 2026',source:'Channel analytics (illustrative)',
  text:`Month,YouTube,TikTok,Instagram\nJan,42,30,22\nFeb,45,36,24\nMar,51,44,23\nApr,48,52,27\nMay,57,49,29\nJun,63,58,31\nJul,68,66,30\nAug,74,71,34\nSep,79,69,36\nOct,88,77,35\nNov,96,85,39\nDec,104,92,41`},
 {id:'episodes',name:'Views per episode',kind:'bar',title:'One recipe out-pulled the rest by a fifth',subtitle:'Views per episode, last 90 days',source:'Channel analytics (illustrative)',
  text:`Episode,Views\nCacio e pepe three ways,184000\nBrisket at dawn,152000\nMapo tofu in 8 minutes,131000\nBistro onion soup,118000\nScallion pancakes,96000\nSunday ragù,88000\nMiso butter corn,71000\nLemon tart,64000`},
 {id:'quarters',name:'This year vs last',kind:'column',title:'Every quarter beat last year',subtitle:'Views per quarter, thousands',
  text:`Quarter,2025,2026\nQ1,96,138\nQ2,121,168\nQ3,150,221\nQ4,190,282`},
 {id:'share',name:'Audience share',kind:'donut',title:'YouTube is still the biggest audience',subtitle:'Share of viewers by platform, last 90 days',
  text:`Platform,Viewers\nYouTube,47500\nTikTok,33500\nInstagram,18400\nNewsletter,8600`},
 {id:'hours',name:'Hours by platform (stacked)',kind:'stacked',title:'TikTok and YouTube carry the growth',subtitle:'Hours watched, thousands',
  text:`Month,YouTube,TikTok,Instagram,Newsletter\nJul,3.1,2.2,1.1,0.4\nAug,3.4,2.4,1.2,0.4\nSep,3.6,2.3,1.3,0.5\nOct,4.1,2.6,1.2,0.5\nNov,4.4,2.9,1.4,0.6\nDec,4.8,3.2,1.5,0.7`},
 {id:'funnel',name:'Viewer funnel',kind:'funnel',title:'Fewer than one in four finishers subscribe',subtitle:'Viewers, last 30 days',
  text:`Stage,Viewers\nImpressions,1200000\nClicked,96000\nWatched 30s,61000\nFinished,22000\nSubscribed,3100`},
 {id:'budget',name:'Budget bridge',kind:'waterfall',title:'Sponsorship covered the new kit',subtitle:'Channel budget, £, this quarter',
  text:`Item,Amount\nOpening balance,12000\nAd revenue,8400\nSponsorship,6200\nNew camera kit,-9800\nFreelance editing,-4300\nSoftware,-1200\nClosing balance,`},
 {id:'heat',name:'Best time to post',kind:'heatmap',title:'Weekend evenings are the sweet spot',subtitle:'Average views in the first 24 h, thousands',
  text:`Day,6am,9am,12pm,3pm,6pm,9pm\nMon,12,18,24,21,30,26\nTue,11,17,22,20,29,27\nWed,13,19,25,23,33,31\nThu,12,20,27,24,36,34\nFri,10,16,22,25,41,38\nSat,15,24,33,36,47,44\nSun,18,27,38,35,44,40`},
 {id:'scatter',name:'Length vs retention',kind:'scatter',title:'Shorter episodes keep more of the audience',subtitle:'Each dot is an episode',
  text:`Episode,Minutes,Retention %,Chef\nCacio e pepe,9,52,Lucia\nBrisket,22,38,Earl\nMapo tofu,8,55,Mei\nOnion soup,14,46,Bastien\nPancakes,6,58,Mei\nRagù,18,41,Lucia\nRibs,25,34,Earl\nCroque,11,49,Bastien\nDumplings,12,50,Mei\nPesto,7,57,Lucia\nCassoulet,20,39,Bastien\nBrisket tacos,16,43,Earl`},
 {id:'bubble',name:'Chefs: reach, retention, episodes',kind:'bubble',title:'Nonna Lucia leads on reach and retention',subtitle:'Bubble size is episodes made',
  text:`Chef,Views (K),Retention %,Episodes\nNonna Lucia,412,46,14\nChef Bastien,356,44,11\nBig Earl,298,39,9\nMei,187,42,6\nAyo,120,48,4`},
 {id:'kpi',name:'Weekly KPIs',kind:'kpi',title:'Views are up, retention is slipping',subtitle:'Last eight weeks',
  text:`Week,Views,Watch hours,Subscribers,Retention %\nW1,150000,14100,40000,45\nW2,162000,14600,41000,44.6\nW3,170000,15200,41800,44.8\nW4,168000,15000,42500,44\nW5,181000,15800,43100,43.5\nW6,190000,16100,44000,43.9\nW7,201000,16600,44800,43.1\nW8,214000,17200,45600,42.6`},
 {id:'goals',name:'Goals vs targets',kind:'bullet',title:'Watch time is closest to target',subtitle:'This month against target',
  text:`Goal,Actual,Target\nViews (K),236,300\nWatch hours (K),18.2,20\nNew subscribers (K),2.4,4\nShorts posted,26,30`},
 {id:'flow',name:'Viewer flow',kind:'sankey',title:'Recommendations bring the viewers who stay',subtitle:'Viewers, thousands',
  text:`From,To,Viewers\nSearch,YouTube,16\nSearch,TikTok,10\nSearch,Instagram,8\nRecommended,YouTube,22\nRecommended,TikTok,21\nRecommended,Instagram,8\nShares,YouTube,6\nShares,TikTok,5\nShares,Instagram,4\nYouTube,Subscribed,17\nYouTube,Watched past half,27\nTikTok,Subscribed,8\nTikTok,Watched past half,18\nTikTok,Left early,10\nInstagram,Watched past half,9\nInstagram,Left early,11`},
 {id:'durations',name:'Watch durations',kind:'histogram',title:'Most sessions last under ten minutes',subtitle:'Minutes per viewing session, sample of 60',
  text:`Session,Minutes\n`+[3.2,4.1,5.5,6.2,2.8,7.4,8.1,4.6,5.2,9.8,12.4,3.9,6.6,7.7,5.1,4.4,2.2,15.6,6.9,8.8,5.7,4.9,3.3,10.2,6.1,7.2,4.0,5.9,11.3,6.4,2.9,8.4,5.4,4.7,7.9,13.8,6.7,5.0,3.7,9.1,6.0,4.3,18.2,7.0,5.6,8.9,4.8,6.3,3.5,10.7,5.3,7.5,6.8,4.2,9.4,5.8,3.1,7.1,6.5,22.4].map((v,i)=>`S${i+1},${v}`).join('\n')},
 {id:'box',name:'Retention by chef',kind:'boxplot',title:'Mei’s episodes hold attention most consistently',subtitle:'Average retention per episode, %',
  text:`Chef,Retention\n`+[['Lucia',[46,52,41,57,44,49,38,51,47]],['Bastien',[44,46,39,49,42,50,36]],['Earl',[38,34,43,39,31,41,36,29]],['Mei',[55,58,50,53,57,52,56]]].flatMap(([c,a])=>a.map(v=>`${c},${v}`)).join('\n')},
 {id:'slope',name:'Before and after the redesign',kind:'slope',title:'The thumbnail redesign lifted every chef',subtitle:'Click-through rate, %, before vs after',
  text:`Chef,Before,After\nNonna Lucia,4.1,6.2\nChef Bastien,3.8,4.6\nBig Earl,3.2,5.1\nMei,4.6,5.0\nAyo,2.9,4.4`},
 {id:'dumbbell',name:'Retention gap',kind:'dumbbell',title:'Shorts close the retention gap for every cuisine',subtitle:'Average retention, %, long-form vs Shorts',
  text:`Cuisine,Long-form,Shorts\nItalian,46,63\nFrench bistro,44,58\nTexas BBQ,39,61\nTaipei street food,42,66\nWest African,48,62`},
 {id:'multiples',name:'Views per chef (8 series)',kind:'multiples',title:'Every chef grew, Mei fastest',subtitle:'Monthly views, thousands',
  text:`Month,Lucia,Bastien,Earl,Mei,Ayo,Priya,Tom,Jade\nJan,22,20,18,8,5,7,6,4\nFeb,25,21,22,10,6,8,6,5\nMar,27,25,21,13,8,8,7,6\nApr,30,28,24,15,9,9,7,8\nMay,33,27,26,18,11,10,8,9\nJun,36,31,25,21,12,11,8,11\nJul,38,34,28,24,14,12,9,13\nAug,41,36,30,27,16,12,9,15`},
 {id:'radar',name:'Chef profiles',kind:'radar',title:'Two chefs, two strengths',subtitle:'Score out of 10 from viewer surveys',
  text:`Quality,Nonna Lucia,Big Earl\nWarmth,9,7\nTechnique,8,6\nPace,5,8\nHumour,6,9\nRecipe clarity,9,6\nVisuals,7,8`},
 {id:'goal',name:'Monthly goal',kind:'gauge',title:'79% of the way to this month’s goal',subtitle:'Views this month against target',
  text:`Goal,Actual,Target\nViews (K),236,300\nWatch hours (K),18.2,20\nNew subscribers (K),2.4,4`},
 {id:'tree',name:'Views by episode and chef',kind:'treemap',title:'Lucia’s pasta episodes are a third of all views',subtitle:'Views, thousands, sized by area',
  text:`Episode,Views,Chef\nCacio e pepe,184,Lucia\nSunday ragù,88,Lucia\nPesto,64,Lucia\nBrisket at dawn,152,Earl\nRibs,58,Earl\nBrisket tacos,41,Earl\nMapo tofu,131,Mei\nPancakes,96,Mei\nDumplings,77,Mei\nOnion soup,118,Bastien\nCroque,52,Bastien\nCassoulet,39,Bastien`}];

window.DVChartMaker={KINDS,KIND,ROLE_LABEL,SANKEY_LABEL,SAMPLES,parse,parseNum,infer,defaultMap,recommend,render,plan,validate,bestOrder,modeStyle,makeFmt,snapL,contrast};
})();
