'use strict';
/* Infographic studio. One picture that explains something: big numbers, steps, a comparison, a timeline, ranked bars,
   percent rings, icon facts or a pictogram. The content is a title, a subtitle, up to eight items and a source line.
   render(S) returns an SVG string at the chosen size. Text is measured on a canvas so it wraps and fits its box.
   PNG and SVG exports embed the fonts through DVExport (dataviz/export.js). Icons come from the atlas icon library. */
(()=>{
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),r1=v=>Math.round(v*10)/10;
const SIZES={portrait:['Portrait',1080,1350],square:['Square',1080,1080],story:['Story',1080,1920],wide:['Wide',1920,1080]};
const FONTS=[
 {id:'inter',name:'Inter',head:'Inter',body:'Inter',hw:800,r:400,b:600,x:800,ls:'-0.03em',g:['Inter:wght@400;600;800']},
 {id:'fraunces',name:'Fraunces and Inter',head:'Fraunces',body:'Inter',hw:700,r:400,b:600,x:800,ls:'-0.02em',g:['Fraunces:opsz,wght@9..144,700','Inter:wght@400;600;800']},
 {id:'grotesk',name:'Space Grotesk',head:'Space Grotesk',body:'Space Grotesk',hw:700,r:500,b:700,x:700,ls:'-0.03em',g:['Space+Grotesk:wght@500;700']},
 {id:'serif',name:'DM Serif Display and Inter',head:'DM Serif Display',body:'Inter',hw:400,r:400,b:600,x:800,ls:'-0.01em',g:['DM+Serif+Display','Inter:wght@400;600;800']},
 {id:'archivo',name:'Archivo Black and Inter',head:'Archivo Black',body:'Inter',hw:400,r:400,b:600,x:800,ls:'-0.02em',g:['Archivo+Black','Inter:wght@400;600;800']},
 {id:'bricolage',name:'Bricolage Grotesque and Inter',head:'Bricolage Grotesque',body:'Inter',hw:800,r:400,b:600,x:800,ls:'-0.03em',g:['Bricolage+Grotesque:opsz,wght@12..96,800','Inter:wght@400;600;800']}];
/* background, text, accent */
const PALS=[['#FFFFFF','#111318','#E4572E'],['#F6F1E7','#1F2A24','#2F6B4F'],['#EEF3FF','#14213D','#2F5BEA'],['#FDF2F8','#3B0A2A','#DB2777'],['#FFF7ED','#3B1D0E','#EA580C'],['#FAFAF7','#1A1A1A','#0E7C86'],
 ['#0F1420','#F4F5F8','#7CE0C3'],['#111111','#FFFFFF','#FFD84D'],['#1B1033','#F5F0FF','#FF7A59'],['#EEF2EC','#22301F','#B4532A'],['#F3EFFF','#1E1633','#6D4AE8'],['#FFFBEA','#2B2100','#D97706']];
const NOTE='Sample numbers. Replace them with your own and name your source here.';
const TPL=[
 {id:'stats',name:'Big numbers',f:{value:'Number',label:'Label',text:'Detail',icon:true},title:'Our year in numbers',subtitle:'What a small roastery got done in twelve months.',items:[
  {value:'48,200',label:'Bags roasted',text:'Up from 31,000 the year before.',icon:'fire'},{value:'92%',label:'Orders out in a day',text:'Packed and posted within 24 hours.',icon:'package'},{value:'17',label:'Farms we buy from',text:'Across four growing regions.',icon:'map-pin'},{value:'4.8',label:'Average review',text:'From 2,300 customer ratings.',icon:'star'}]},
 {id:'steps',name:'Steps',f:{label:'Step',text:'Detail'},title:'How an order reaches you',subtitle:'Five steps, usually inside three days.',items:[
  {label:'You order',text:'Pick a roast and a grind. Subscriptions ship on a fixed day.'},{label:'We roast',text:'Small batches, every morning from Monday to Friday.'},{label:'It rests',text:'Twenty-four hours, so the flavour settles.'},{label:'We pack',text:'Recyclable bags with the roast date on the front.'},{label:'It arrives',text:'Tracked delivery, through the letterbox.'}]},
 {id:'compare',name:'Comparison',f:{label:'Row',value:'First column',text:'Second column'},colA:'Buying',colB:'Renting',title:'Buy the bike or rent it?',subtitle:'The same commute, two ways to pay for it.',items:[
  {label:'Upfront cost',value:'High: the full price on day one',text:'None: a monthly fee'},{label:'Repairs',value:'Yours to arrange and pay for',text:'Included in the fee'},{label:'After two years',value:'You own something you can sell',text:'You have paid about the same and own nothing'},{label:'Best for',value:'Daily riders who will keep it',text:'Trying it out, or short stays'}]},
 {id:'timeline',name:'Timeline',f:{value:'Date',label:'Event',text:'Detail'},title:'The studio so far',subtitle:'Six years, one room to three.',items:[
  {value:'2020',label:'Two desks',text:'Started in a shared room above a bakery.'},{value:'2021',label:'First retainer',text:'A local museum signed for a year.'},{value:'2023',label:'Team of six',text:'Moved to our own floor.'},{value:'2025',label:'Second city',text:'Opened a small studio in Leeds.'},{value:'2026',label:'One hundred projects',text:'Shipped the hundredth in March.'}]},
 {id:'bars',name:'Ranked bars',f:{label:'Label',value:'Number'},title:'Where the budget goes',subtitle:'Share of yearly spend, by area.',items:[
  {label:'People',value:'46%'},{label:'Studio and tools',value:'21%'},{label:'Production',value:'14%'},{label:'Marketing',value:'11%'},{label:'Travel',value:'8%'}]},
 {id:'rings',name:'Percent rings',f:{value:'Percent',label:'Label',text:'Detail'},title:'Launch readiness',subtitle:'Four workstreams, two weeks out.',items:[
  {value:'90%',label:'Design',text:'Final screens in review.'},{value:'72%',label:'Build',text:'Checkout still open.'},{value:'55%',label:'Content',text:'Product pages half written.'},{value:'30%',label:'Testing',text:'Starts on Monday.'}]},
 {id:'icons',name:'Icon facts',f:{label:'Heading',text:'Detail',icon:true},title:'Six habits for better meetings',subtitle:'Small rules that give everyone their time back.',items:[
  {label:'Send the question first',text:'One line on what needs deciding.',icon:'chat-circle'},{label:'Invite fewer people',text:'Only those who decide or do.',icon:'users'},{label:'Keep it to 25 minutes',text:'Short by default, longer by exception.',icon:'clock'},{label:'Write it down',text:'Decisions and owners, in the meeting.',icon:'note-pencil'},{label:'End with next steps',text:'Who does what, by when.',icon:'check-circle'},{label:'Cancel when you can',text:'An update can be a message.',icon:'calendar-blank'}]},
 {id:'picto',name:'Pictogram',f:{value:'How many (7 in 10)',label:'What it counts',icon:true},title:'Who comes back',subtitle:'Customers who order again, by how they first found us.',items:[
  {value:'7 in 10',label:'Came through a friend',icon:'user'},{value:'5 in 10',label:'Found us in a search',icon:'user'},{value:'3 in 10',label:'Clicked an advert',icon:'user'}]}];
const tplOf=id=>TPL.find(t=>t.id===id)||TPL[0];

/* ---------- colour ---------- */
const hex=h=>{h=String(h||'#000').replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)||0)};
const toHex=a=>'#'+a.map(v=>Math.round(clamp(v,0,255)).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return toHex(A.map((v,i)=>v+(B[i]-v)*t))};
const lum=h=>{const [r,g,b]=hex(h).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b};
const on=h=>lum(h)>.42?'#111318':'#FFFFFF';

/* ---------- text ---------- */
const mc=document.createElement('canvas').getContext('2d');
const tw=(t,w,size,fam)=>{mc.font=`${w} ${size}px "${fam}", system-ui, sans-serif`;return mc.measureText(t).width};
function wrap(t,w,size,fam,maxW,maxLines=9){const words=String(t||'').split(/\s+/).filter(Boolean),lines=[];let cur='';
 for(const wd of words){const nx=cur?cur+' '+wd:wd;if(!cur||tw(nx,w,size,fam)<=maxW)cur=nx;else{lines.push(cur);cur=wd}}
 if(cur)lines.push(cur);
 if(lines.length>maxLines){lines.length=maxLines;let l=lines[maxLines-1];while(l.length>1&&tw(l+'…',w,size,fam)>maxW)l=l.slice(0,-1);lines[maxLines-1]=l.replace(/[\s,.;:]+$/,'')+'…'}
 return lines}
const fit=(t,w,max,min,fam,maxW)=>{let s=Math.round(max);while(s>min&&tw(t,w,s,fam)>maxW)s-=2;return s};
function text(lines,x,top,o){if(!Array.isArray(lines))lines=[lines];const lh=o.lh||Math.round(o.size*1.3);
 return `<text x="${r1(x)}" y="${r1(top+o.size*.82)}" font-family="'${o.fam}', system-ui, sans-serif" font-size="${r1(o.size)}" font-weight="${o.w}" fill="${o.fill}"${o.anchor?` text-anchor="${o.anchor}"`:''}${o.ls?` letter-spacing="${o.ls}"`:''}${o.op?` opacity="${o.op}"`:''}>${lines.map((l,i)=>`<tspan x="${r1(x)}"${i?` dy="${lh}"`:''}>${esc(l)}</tspan>`).join('')}</text>`}
const P=(str,x,top,maxW,o,maxLines=3)=>{if(!str||maxLines<1)return {s:'',h:0};const lh=o.lh||Math.round(o.size*1.3),lines=wrap(str,o.w,o.size,o.fam,maxW,maxLines);return {s:text(lines,x,top,{...o,lh}),h:lines.length*lh}};

/* ---------- icons ---------- */
const ICONS={};let iconList=[];
function icon(name,x,y,s,col){const ic=ICONS[name];if(!ic)return `<circle cx="${r1(x+s/2)}" cy="${r1(y+s/2)}" r="${r1(s*.34)}" fill="${col}"/>`;
 return `<svg x="${r1(x)}" y="${r1(y)}" width="${r1(s)}" height="${r1(s)}" viewBox="${ic.vb}" fill="${col}" color="${col}">${ic.body}</svg>`}
const tenth=v=>{v=String(v||'');const m=v.match(/(\d+(?:\.\d+)?)\s*(?:\/|in|out of|of)\s*(\d+(?:\.\d+)?)/i);if(m&&+m[2])return clamp(Math.round(+m[1]/+m[2]*10),0,10);const p=v.match(/(\d+(?:\.\d+)?)\s*%/);if(p)return clamp(Math.round(+p[1]/10),0,10);const x=parseFloat(v);return isNaN(x)?0:clamp(Math.round(x<=10?x:x/10),0,10)};
const numOf=v=>parseFloat(String(v||'').replace(/[^0-9.\-]/g,''))||0;

/* ---------- layouts: (ctx, rect) -> svg ---------- */
const dot=(n,cx,cy,r,c)=>`<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="${c.C.ac}"/><text x="${r1(cx)}" y="${r1(cy+r*.34)}" text-anchor="middle" font-family="'${c.F.body}', system-ui, sans-serif" font-size="${r1(r*.95)}" font-weight="${c.F.x}" fill="${c.C.onAc}">${n}</text>`;
const LAYOUT={
 stats(c,R){const {items,F,C}=c,n=items.length||1,k=c.wide?Math.min(n,4):c.tall?(n<=4?1:2):(n<=1?1:2),rows=Math.ceil(n/k),g=28,cw=(R.w-g*(k-1))/k,ch=Math.min((R.h-g*(rows-1))/rows,c.tall?470:c.wide?580:430);let s='';
  items.forEach((it,i)=>{const x=R.x+(i%k)*(cw+g),y=R.y+Math.floor(i/k)*(ch+g),ip=c.cards?36:0,ix=x+ip,iw=cw-ip*2;let iy=y+(c.cards?34:30);
   s+=c.cards?`<rect x="${r1(x)}" y="${r1(y)}" width="${r1(cw)}" height="${r1(ch)}" rx="28" fill="${C.soft}"/>`:`<rect x="${r1(x)}" y="${r1(y)}" width="${r1(cw)}" height="4" fill="${C.hair}"/><rect x="${r1(x)}" y="${r1(y)}" width="64" height="4" fill="${C.ac}"/>`;
   if(it.icon&&ch>=300){s+=icon(it.icon,ix,iy,52,C.ac);iy+=72}
   const vs=fit(it.value||'',F.hw,Math.min(132,ch*.34),40,F.head,iw);s+=text(it.value||'',ix,iy,{size:vs,w:F.hw,fam:F.head,fill:C.ac,ls:F.ls});iy+=vs*1.14;
   const a=P(it.label,ix,iy,iw,{size:30,w:F.b,fam:F.body,fill:C.ink,lh:38},2);s+=a.s;iy+=a.h+6;
   s+=P(it.text,ix,iy,iw,{size:24,w:F.r,fam:F.body,fill:C.mute,lh:33},Math.floor((y+ch-(c.cards?26:0)-iy)/33)).s});
  return s},
 steps(c,R){const {items,F,C}=c,n=items.length||1;let s='';
  if(c.wide){const cw=R.w/n,cr=40,cy=R.y+cr;s+=`<line x1="${r1(R.x+cr)}" y1="${cy}" x2="${r1(R.x+(n-1)*cw+cr)}" y2="${cy}" stroke="${C.hair}" stroke-width="4"/>`;
   items.forEach((it,i)=>{const x=R.x+i*cw;s+=dot(i+1,x+cr,cy,cr,c);let y=cy+cr+36;const a=P(it.label,x,y,cw-40,{size:32,w:F.b,fam:F.body,fill:C.ink,lh:40},2);s+=a.s;y+=a.h+8;s+=P(it.text,x,y,cw-40,{size:24,w:F.r,fam:F.body,fill:C.mute,lh:33},Math.floor((R.y+R.h-y)/33)).s});return s}
  const rh=Math.min(R.h/n,c.tall?320:240),cr=clamp(rh*.26,26,46),ls=clamp(rh*.2,26,40),ts=clamp(rh*.135,20,28),tl=Math.round(ts*1.36);
  s+=`<line x1="${r1(R.x+cr)}" y1="${r1(R.y+cr)}" x2="${r1(R.x+cr)}" y2="${r1(R.y+(n-1)*rh+cr)}" stroke="${C.hair}" stroke-width="4"/>`;
  items.forEach((it,i)=>{const cy=R.y+i*rh+cr,x=R.x+cr*2+30,w=R.w-cr*2-30,bh=rh-18;
   if(c.cards)s+=`<rect x="${r1(x-14)}" y="${r1(cy-cr)}" width="${r1(w+14)}" height="${r1(bh)}" rx="22" fill="${C.soft}"/>`;
   s+=dot(i+1,R.x+cr,cy,cr,c);let y=cy-cr+(c.cards?16:2);const tx=x+(c.cards?12:0),wd=w-(c.cards?40:0);
   const a=P(it.label,tx,y,wd,{size:ls,w:F.b,fam:F.body,fill:C.ink,lh:Math.round(ls*1.22)},1);s+=a.s;y+=a.h+4;
   s+=P(it.text,tx,y,wd,{size:ts,w:F.r,fam:F.body,fill:C.mute,lh:tl},Math.max(1,Math.floor((cy-cr+bh-(c.cards?12:0)-y)/tl))).s});
  return s},
 compare(c,R){const {items,F,C,S}=c,n=items.length||1,lw=R.w*.26,g=16,cw=(R.w-lw-g*2)/2,ax=R.x+lw+g,bx=ax+cw+g,hh=84;let s='';
  if(c.cards)s+=`<rect x="${r1(ax)}" y="${r1(R.y)}" width="${r1(cw)}" height="${r1(R.h)}" rx="24" fill="${C.tint}"/><rect x="${r1(bx)}" y="${r1(R.y)}" width="${r1(cw)}" height="${r1(R.h)}" rx="24" fill="${C.soft}"/>`;
  s+=`<rect x="${r1(ax)}" y="${r1(R.y)}" width="${r1(cw)}" height="${hh}" rx="24" fill="${C.ac}"/><rect x="${r1(bx)}" y="${r1(R.y)}" width="${r1(cw)}" height="${hh}" rx="24" fill="${C.ink}"/>`;
  [[S.colA||'First',ax,C.onAc],[S.colB||'Second',bx,on(C.ink)]].forEach(([t,x,f])=>{const z=fit(t,F.x,32,18,F.body,cw-40);s+=text(t,x+cw/2,R.y+hh/2-z*.6,{size:z,w:F.x,fam:F.body,fill:f,anchor:'middle'})});
  const y0=R.y+hh+10,rh=Math.min((R.h-hh-10)/n,200),ml=Math.max(1,Math.floor((rh-34)/34));
  items.forEach((it,i)=>{const y=y0+i*rh;if(i)s+=`<rect x="${r1(R.x)}" y="${r1(y)}" width="${r1(R.w)}" height="2" fill="${C.hair}"/>`;
   s+=P(it.label,R.x,y+22,lw-12,{size:26,w:F.b,fam:F.body,fill:C.ink,lh:34},Math.min(ml,3)).s;
   s+=P(it.value,ax+24,y+22,cw-48,{size:26,w:F.r,fam:F.body,fill:C.ink,lh:34},ml).s+P(it.text,bx+24,y+22,cw-48,{size:26,w:F.r,fam:F.body,fill:C.ink,lh:34},ml).s});
  return s},
 timeline(c,R){const {items,F,C}=c,n=items.length||1;let s='';
  if(c.wide){const cw=R.w/n,ly=R.y+84;s+=`<line x1="${r1(R.x)}" y1="${ly}" x2="${r1(R.x+R.w)}" y2="${ly}" stroke="${C.hair}" stroke-width="4"/>`;
   items.forEach((it,i)=>{const x=R.x+i*cw,z=fit(it.value||'',F.x,40,22,F.body,cw-36);s+=text(it.value||'',x,R.y+8,{size:z,w:F.x,fam:F.body,fill:C.ac});s+=`<circle cx="${r1(x+13)}" cy="${ly}" r="13" fill="${C.ac}" stroke="${C.bg}" stroke-width="5"/>`;
    let y=ly+40;const a=P(it.label,x,y,cw-40,{size:30,w:F.b,fam:F.body,fill:C.ink,lh:38},2);s+=a.s;y+=a.h+8;s+=P(it.text,x,y,cw-40,{size:24,w:F.r,fam:F.body,fill:C.mute,lh:33},Math.floor((R.y+R.h-y)/33)).s});return s}
  const dw=Math.min(200,R.w*.2),lx=R.x+dw+34,rh=Math.min(R.h/n,c.tall?320:240),ls=clamp(rh*.19,26,38),ts=clamp(rh*.13,20,27),tl=Math.round(ts*1.36);
  s+=`<line x1="${r1(lx)}" y1="${r1(R.y+22)}" x2="${r1(lx)}" y2="${r1(R.y+(n-1)*rh+22)}" stroke="${C.hair}" stroke-width="4"/>`;
  items.forEach((it,i)=>{const cy=R.y+i*rh+22,z=fit(it.value||'',F.x,38,20,F.body,dw);
   s+=text(it.value||'',lx-34,cy-z*.5,{size:z,w:F.x,fam:F.body,fill:C.ac,anchor:'end'})+`<circle cx="${r1(lx)}" cy="${r1(cy)}" r="13" fill="${C.ac}" stroke="${C.bg}" stroke-width="5"/>`;
   const x=lx+38,w=R.x+R.w-x;let y=cy-ls*.55;const a=P(it.label,x,y,w,{size:ls,w:F.b,fam:F.body,fill:C.ink,lh:Math.round(ls*1.22)},1);s+=a.s;y+=a.h+4;
   s+=P(it.text,x,y,w,{size:ts,w:F.r,fam:F.body,fill:C.mute,lh:tl},Math.max(1,Math.floor((R.y+(i+1)*rh-8-y)/tl))).s});
  return s},
 bars(c,R){const {items,F,C}=c,n=items.length||1,vals=items.map(i=>numOf(i.value)),max=Math.max(...vals,1e-9),top=vals.indexOf(Math.max(...vals)),rh=Math.min(R.h/n,c.tall?240:c.wide?130:160),ls=clamp(rh*.2,22,36),bh=clamp(rh*.26,16,44);let s='';
  items.forEach((it,i)=>{const y=R.y+i*rh,vw=tw(it.value||'',F.x,ls,F.body);
   s+=P(it.label,R.x,y,R.w-vw-30,{size:ls,w:F.b,fam:F.body,fill:C.ink},1).s+text(it.value||'',R.x+R.w,y,{size:ls,w:F.x,fam:F.body,fill:i===top?C.ac:C.ink,anchor:'end'});
   const by=y+ls*1.55;s+=`<rect x="${r1(R.x)}" y="${r1(by)}" width="${r1(R.w)}" height="${r1(bh)}" rx="${r1(bh/2)}" fill="${C.soft}"/><rect x="${r1(R.x)}" y="${r1(by)}" width="${r1(Math.max(bh,R.w*Math.max(0,vals[i])/max))}" height="${r1(bh)}" rx="${r1(bh/2)}" fill="${i===top?C.ac:mix(C.bg,C.ac,.5)}"/>`});
  return s},
 rings(c,R){const {items,F,C}=c,n=items.length||1,k=c.wide?Math.min(n,4):c.tall?(n<=3?1:2):(n<=2?n:n<=4?2:3),rows=Math.ceil(n/k),g=28,cw=(R.w-g*(k-1))/k,ch=Math.min((R.h-g*(rows-1))/rows,560);let s='';
  items.forEach((it,i)=>{const x=R.x+(i%k)*(cw+g),y=R.y+Math.floor(i/k)*(ch+g),cx=x+cw/2,rad=Math.min(cw*.34,ch*.29),sw=rad*.2,cy=y+rad+sw/2+(c.cards?34:8),p=clamp(numOf(it.value)/100,0,1),circ=2*Math.PI*rad;
   if(c.cards)s+=`<rect x="${r1(x)}" y="${r1(y)}" width="${r1(cw)}" height="${r1(ch)}" rx="28" fill="${C.soft}"/>`;
   s+=`<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(rad)}" fill="none" stroke="${c.cards?C.hair:C.soft}" stroke-width="${r1(sw)}"/>`;
   if(p>0)s+=`<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(rad)}" fill="none" stroke="${C.ac}" stroke-width="${r1(sw)}" stroke-linecap="round" stroke-dasharray="${r1(circ*p)} ${r1(circ)}" transform="rotate(-90 ${r1(cx)} ${r1(cy)})"/>`;
   const z=fit(it.value||'',F.hw,rad*.6,18,F.head,rad*1.45);s+=text(it.value||'',cx,cy-z*.52,{size:z,w:F.hw,fam:F.head,fill:C.ink,anchor:'middle',ls:F.ls});
   let ty=cy+rad+sw/2+26;const a=P(it.label,cx,ty,cw-48,{size:28,w:F.b,fam:F.body,fill:C.ink,lh:36,anchor:'middle'},2);s+=a.s;ty+=a.h+4;
   s+=P(it.text,cx,ty,cw-48,{size:22,w:F.r,fam:F.body,fill:C.mute,lh:30,anchor:'middle'},Math.floor((y+ch-(c.cards?22:0)-ty)/30)).s});
  return s},
 icons(c,R){const {items,F,C}=c,n=items.length||1,k=c.wide?(n<=4?2:3):c.tall?1:(n<=3?1:2),rows=Math.ceil(n/k),g=24,cw=(R.w-g*(k-1))/k,ch=Math.min((R.h-g*(rows-1))/rows,c.tall?250:220),d=clamp(ch*.6,64,124);let s='';
  items.forEach((it,i)=>{const x=R.x+(i%k)*(cw+g),y=R.y+Math.floor(i/k)*(ch+g),ip=c.cards?28:0,cx=x+ip+d/2,cy=y+ch/2;
   if(c.cards)s+=`<rect x="${r1(x)}" y="${r1(y)}" width="${r1(cw)}" height="${r1(ch)}" rx="26" fill="${C.soft}"/>`;
   s+=`<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(d/2)}" fill="${c.cards?C.bg:C.tint}"/>`+(it.icon&&ICONS[it.icon]?icon(it.icon,cx-d*.26,cy-d*.26,d*.52,C.ac):text(String(i+1),cx,cy-d*.2,{size:d*.4,w:F.x,fam:F.body,fill:C.ac,anchor:'middle'}));
   const tx=x+ip+d+26,wd=cw-ip*2-d-26,la=wrap(it.label||'',F.b,30,F.body,wd,2),ta=wrap(it.text||'',F.r,23,F.body,wd,Math.max(0,Math.floor((ch-24-la.length*38)/31))),bh=la.length*38+ta.length*31;let ty=cy-bh/2;
   s+=text(la,tx,ty,{size:30,w:F.b,fam:F.body,fill:C.ink,lh:38});ty+=la.length*38;if(ta.length)s+=text(ta,tx,ty+2,{size:23,w:F.r,fam:F.body,fill:C.mute,lh:31})});
  return s},
 picto(c,R){const {items,F,C}=c,n=items.length||1,rh=Math.min(R.h/n,c.tall?430:330);let s='';
  items.forEach((it,i)=>{const y=R.y+i*rh,k=tenth(it.value),z=fit(it.value||'',F.hw,Math.min(78,rh*.24),28,F.head,R.w*.5),vw=tw(it.value||'',F.hw,z,F.head);
   if(i)s+=`<rect x="${r1(R.x)}" y="${r1(y-14)}" width="${r1(R.w)}" height="2" fill="${C.hair}"/>`;
   s+=text(it.value||'',R.x,y+6,{size:z,w:F.hw,fam:F.head,fill:C.ac,ls:F.ls})+P(it.label,R.x+vw+26,y+6+z*.5-17,R.w-vw-26,{size:28,w:F.b,fam:F.body,fill:C.ink,lh:36},2).s;
   const gap=12,sz=Math.min((R.w-gap*9)/10,rh-z*1.2-64,96),iy=y+z*1.2+30;for(let j=0;j<10;j++)s+=icon(it.icon||'user',R.x+j*(sz+gap),iy,sz,j<k?C.ac:mix(C.bg,C.ink,.16))});
  return s}};

function render(S){const [,W,H]=SIZES[S.size]||SIZES.portrait,F=FONTS.find(f=>f.id===S.font)||FONTS[0];
 const C={bg:S.bg,ink:S.ink,ac:S.accent,soft:mix(S.bg,S.ink,.06),hair:mix(S.bg,S.ink,.16),mute:mix(S.ink,S.bg,.36),tint:mix(S.bg,S.accent,.16),onAc:on(S.accent)};
 const wide=S.size==='wide',tall=S.size==='story',pad=wide?96:84,bold=S.look==='bold',out=[`<rect width="${W}" height="${H}" fill="${C.bg}"/>`];
 const items=S.items.filter(i=>String(i.value||'')+String(i.label||'')+String(i.text||'')).slice(0,8),hw=W-pad*2-(wide?W*.22:0);
 let ts=wide?84:tall?92:80,tl;for(;;){tl=wrap(S.title||'',F.hw,ts,F.head,hw,9);if(tl.length<=3||ts<=46)break;ts-=6}tl=tl.slice(0,4);
 const tlh=Math.round(ts*1.08),sl=S.subtitle?wrap(S.subtitle,F.r,30,F.body,hw,3):[];let y=pad;
 if(bold)out.push(`<rect width="${W}" height="${r1(pad+tl.length*tlh+(sl.length?18+sl.length*40:0)+pad*.62)}" fill="${C.ac}"/>`);else{out.push(`<rect x="${pad}" y="${pad}" width="72" height="10" rx="5" fill="${C.ac}"/>`);y+=44}
 out.push(text(tl,pad,y,{size:ts,w:F.hw,fam:F.head,fill:bold?C.onAc:C.ink,lh:tlh,ls:F.ls}));y+=tl.length*tlh;
 if(sl.length){y+=18;out.push(text(sl,pad,y,{size:30,w:F.r,fam:F.body,fill:bold?C.onAc:C.mute,lh:40,op:bold?.9:0}));y+=sl.length*40}
 const top=y+(bold?pad*.62+50:54);let bottom=H-pad;
 if(S.footer){const fl=wrap(S.footer,F.r,22,F.body,W-pad*2,2),fy=H-pad*.72-fl.length*30;out.push(`<rect x="${pad}" y="${r1(fy-22)}" width="${W-pad*2}" height="2" fill="${C.hair}"/>`,text(fl,pad,fy,{size:22,w:F.r,fam:F.body,fill:C.mute,lh:30}));bottom=fy-22-34}
 out.push((LAYOUT[S.tpl]||LAYOUT.stats)({S,F,C,W,H,wide,tall,items,cards:S.look!=='clean'},{x:pad,y:top,w:W-pad*2,h:Math.max(120,bottom-top)}));
 return {svg:`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(S.title||'Infographic')}">${out.join('')}</svg>`,W,H,F}}

/* ---------- state ---------- */
const KEY='atlas-infographic-v1';
const sample=id=>{const t=tplOf(id);return {title:t.title,subtitle:t.subtitle,footer:NOTE,colA:t.colA||'',colB:t.colB||'',items:t.items.map(i=>({...i}))}};
let S=Object.assign({tpl:'stats',size:'portrait',pal:0,bg:PALS[0][0],ink:PALS[0][1],accent:PALS[0][2],font:'inter',look:'cards',dirty:false},sample('stats'));
try{const j=JSON.parse(localStorage.getItem(KEY)||'null');if(j&&Array.isArray(j.items)&&tplOf(j.tpl).id===j.tpl)S=Object.assign(S,j)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const say=m=>{const t=$('igToast');t.textContent=m;t.classList.add('on');clearTimeout(say.t);say.t=setTimeout(()=>t.classList.remove('on'),2200)};

/* ---------- drawing the page ---------- */
let raf=0;const later=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{stage();save()})};
function stage(){const r=render(S);$('igStage').innerHTML=r.svg;$('igStage').dataset.size=S.size;$('igMeta').textContent=`${r.W} × ${r.H} px`}
function thumbs(){$('igTpl').innerHTML=TPL.map(t=>`<li><button type="button" data-tpl="${t.id}" aria-pressed="${t.id===S.tpl}"><span class="igTh">${render(Object.assign({},S,sample(t.id),{tpl:t.id,size:'square'})).svg}</span><b>${t.name}</b></button></li>`).join('')}
function fields(){const T=tplOf(S.tpl);$('igCols').hidden=T.id!=='compare';$('igTitle').value=S.title||'';$('igSub').value=S.subtitle||'';$('igFoot').value=S.footer||'';$('igColA').value=S.colA||'';$('igColB').value=S.colB||'';
 $('igItems').innerHTML=S.items.map((it,i)=>`<div class="igItem" data-i="${i}"><div class="igTop">${T.f.icon?`<button type="button" class="igIco" data-act="icon" aria-label="Choose an icon for item ${i+1}">${it.icon&&ICONS[it.icon]?`<svg viewBox="${ICONS[it.icon].vb}" fill="currentColor" aria-hidden="true">${ICONS[it.icon].body}</svg>`:'<span>Icon</span>'}</button>`:''}<b>Item ${i+1}</b><span class="igSp"></span><button type="button" data-act="up" aria-label="Move item ${i+1} up"${i?'':' disabled'}>↑</button><button type="button" data-act="down" aria-label="Move item ${i+1} down"${i<S.items.length-1?'':' disabled'}>↓</button><button type="button" data-act="del" aria-label="Remove item ${i+1}">×</button></div>${['value','label','text'].filter(k=>T.f[k]).map(k=>k==='text'&&T.id!=='compare'?`<textarea rows="2" data-k="text" aria-label="${esc(T.f[k])}, item ${i+1}" placeholder="${esc(T.f[k])}">${esc(it.text||'')}</textarea>`:`<input type="text" data-k="${k}" aria-label="${esc(k==='value'&&T.id==='compare'?(S.colA||T.f[k]):k==='text'&&T.id==='compare'?(S.colB||T.f[k]):T.f[k])}, item ${i+1}" placeholder="${esc(k==='value'&&T.id==='compare'?(S.colA||T.f[k]):k==='text'&&T.id==='compare'?(S.colB||T.f[k]):T.f[k])}" value="${esc(it[k]||'')}">`).join('')}</div>`).join('');
 $('igAdd').disabled=S.items.length>=8;$('igAdd').textContent=S.items.length>=8?'Eight items is the most':'+ Add an item'}
function style(){$('igPals').innerHTML=PALS.map((p,i)=>`<button type="button" data-pal="${i}" aria-pressed="${S.pal===i}" aria-label="Palette ${i+1}"><i style="background:${p[0]}"></i><i style="background:${p[1]}"></i><i style="background:${p[2]}"></i></button>`).join('');
 $('igBg').value=S.bg;$('igInk').value=S.ink;$('igAc').value=S.accent;$('igFont').value=S.font;
 document.querySelectorAll('#igSize button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.size===S.size)));document.querySelectorAll('#igLook button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.look===S.look)))}
function all(){thumbs();fields();style();stage();save()}

/* ---------- wiring ---------- */
function start(){
 $('igSize').innerHTML=Object.entries(SIZES).map(([k,[n]])=>`<button type="button" data-size="${k}">${n}</button>`).join('');
 $('igLook').innerHTML=[['clean','Clean'],['cards','Cards'],['bold','Bold top']].map(([k,n])=>`<button type="button" data-look="${k}">${n}</button>`).join('');
 $('igFont').innerHTML=FONTS.map(f=>`<option value="${f.id}">${f.name}</option>`).join('');
 $('igTpl').onclick=e=>{const b=e.target.closest('[data-tpl]');if(!b)return;S.tpl=b.dataset.tpl;if(!S.dirty)Object.assign(S,sample(S.tpl));all()};
 $('igSize').onclick=e=>{const b=e.target.closest('[data-size]');if(b){S.size=b.dataset.size;style();stage();save()}};
 $('igLook').onclick=e=>{const b=e.target.closest('[data-look]');if(b){S.look=b.dataset.look;all()}};
 $('igPals').onclick=e=>{const b=e.target.closest('[data-pal]');if(!b)return;S.pal=+b.dataset.pal;[S.bg,S.ink,S.accent]=PALS[S.pal];all()};
 [['igBg','bg'],['igInk','ink'],['igAc','accent']].forEach(([id,k])=>$(id).oninput=e=>{S[k]=e.target.value;S.pal=-1;later();clearTimeout(start.t);start.t=setTimeout(()=>{thumbs();style()},250)});
 $('igFont').onchange=async e=>{S.font=e.target.value;await fonts();all()};
 [['igTitle','title'],['igSub','subtitle'],['igFoot','footer'],['igColA','colA'],['igColB','colB']].forEach(([id,k])=>$(id).oninput=e=>{S[k]=e.target.value;S.dirty=true;later()});
 $('igItems').addEventListener('input',e=>{const f=e.target.closest('[data-k]'),row=e.target.closest('[data-i]');if(!f||!row)return;S.items[+row.dataset.i][f.dataset.k]=f.value;S.dirty=true;later()});
 $('igItems').addEventListener('click',e=>{const b=e.target.closest('[data-act]'),row=e.target.closest('[data-i]');if(!b||!row)return;const i=+row.dataset.i,a=b.dataset.act;
  if(a==='icon')return pick(i);if(a==='del')S.items.splice(i,1);if(a==='up'&&i)[S.items[i-1],S.items[i]]=[S.items[i],S.items[i-1]];if(a==='down'&&i<S.items.length-1)[S.items[i+1],S.items[i]]=[S.items[i],S.items[i+1]];
  S.dirty=true;fields();stage();save()});
 $('igAdd').onclick=()=>{if(S.items.length>=8)return;S.items.push({value:'',label:'',text:'',icon:''});S.dirty=true;fields();stage();save();$('igItems').lastElementChild?.querySelector('input,textarea')?.focus()};
 $('igReset').onclick=()=>{Object.assign(S,sample(S.tpl),{dirty:false});all();say('Sample content is back')};
 $('igExport').addEventListener('click',e=>{const b=e.target.closest('[data-x]');if(b){$('igExport').open=false;exportAs(b.dataset.x)}});
 document.addEventListener('click',e=>{const m=$('igExport');if(m.open&&!m.contains(e.target))m.open=false});
 /* icon picker */
 const dlg=$('igIcons');let target=-1;
 function grid(){const q=$('igIconQ').value.trim().toLowerCase(),list=iconList.filter(i=>!q||i.n.includes(q)||i.k.includes(q)).slice(0,160);
  $('igIconGrid').innerHTML=list.length?list.map(i=>`<button type="button" data-n="${i.n}" title="${i.n.replace(/-/g,' ')}" aria-label="${i.n.replace(/-/g,' ')}"><svg viewBox="${ICONS[i.n].vb}" fill="currentColor" aria-hidden="true">${ICONS[i.n].body}</svg></button>`).join(''):'<p>No icon matches that word.</p>'}
 function pick(i){target=i;$('igIconQ').value='';grid();dlg.showModal();$('igIconQ').focus()}
 $('igIconQ').oninput=grid;$('igIconClose').onclick=()=>dlg.close();
 const set=n=>{if(S.items[target]){S.items[target].icon=n;S.dirty=true}dlg.close();fields();stage();save()};
 $('igIconNone').onclick=()=>set('');$('igIconGrid').onclick=e=>{const b=e.target.closest('[data-n]');if(b)set(b.dataset.n)};
 fonts().then(all);
 fetch('icons/sets/regular.json').then(r=>r.json()).then(j=>{(j.icons||[]).forEach(i=>{const m=i.s.match(/viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/);if(m){ICONS[i.n]={vb:m[1],body:m[2]};iconList.push({n:i.n,k:i.k||''})}});all()}).catch(()=>{});
}
const fonts=()=>{const F=FONTS.find(f=>f.id===S.font)||FONTS[0];return Promise.all([[F.hw,F.head],[F.r,F.body],[F.b,F.body],[F.x,F.body]].map(([w,f])=>document.fonts.load(`${w} 40px "${f}"`))).catch(()=>{})};
async function exportAs(kind){const r=render(S),st={id:'ig-'+r.F.id,fonts:r.F.g},name=(S.title||'infographic').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,50)||'infographic';
 try{say('Preparing the file…');
  if(kind==='svg')DVExport.download(name+'.svg',await DVExport.svgWithFonts(r.svg,st),'image/svg+xml');
  else if(kind==='copy'){await navigator.clipboard.writeText(r.svg);return say('SVG code copied')}
  /* same hand-off the chart, diagram and flowchart studios use: the picture opens in the Mockup studio, ready to frame */
  else if(kind==='share'){if(!window.MockupHandoff)await new Promise((res,rej)=>{const t=document.createElement('script');t.src='mockup/handoff.js';t.onload=res;t.onerror=rej;document.head.append(t)});
   return MockupHandoff.send({blob:await DVExport.png(r.svg,r.W,r.H,st,1),title:S.title||'',from:'infographic studio'})}
  else DVExport.download(name+(kind==='png2'?'@2x':'')+'.png',await DVExport.png(r.svg,r.W,r.H,st,kind==='png2'?2:1));
  say('Saved to your downloads')}catch(e){say('That export did not work. Try the SVG.')}}
window.InfographicStudio={render,get state(){return S},TPL,SIZES};
if(document.readyState==='loading')addEventListener('DOMContentLoaded',start);else start();
})();
