'use strict';
/* Theme kits: tokens, fonts, voice, animated backgrounds and SVG assets for nine themes.
   Every background is a self-contained function (canvas, tokens, still) -> stop(), so it can be
   exported as-is with Function.prototype.toString(). Every asset is generated as an SVG string. */
(()=>{
const K=[
 {id:'matrix',no:'01',name:'Matrix',tagline:'Green rain on black glass.',mood:'Hacker, code, sci-fi, security',
  fonts:{head:"'Share Tech Mono',ui-monospace,monospace",body:"'IBM Plex Mono',ui-monospace,monospace",css:'family=Share+Tech+Mono&family=IBM+Plex+Mono:wght@400;500;600'},
  t:{bg:'#020703',surface:'#06140A',ink:'#B6FFC8',mute:'#5FBF77',line:'#14502A',accent:'#00FF41',onAccent:'#001A07',accent2:'#7DFFB0',radius:'2px',shadow:'0 0 0 1px #14502A, 0 0 24px rgba(0,255,65,.18)',glow:'0 0 12px rgba(0,255,65,.55)'},
  bg:'matrix',stroke:{w:1.5,cap:'square'},case:'upper',
  voice:['> ACCESS GRANTED','Wake up. The system is listening.','Follow the signal.'],
  dos:['Keep text monospace and left-aligned, like a terminal.','Use glow only on the one thing that matters.','Let the rain sit behind dark panels, never behind body text.'],
  donts:['Pure #00FF41 for long paragraphs; use the softer ink.','Rounded, bubbly shapes.','More than one accent hue.']},
 {id:'synthwave',no:'02',name:'Synthwave',tagline:'A neon sun over an endless grid.',mood:'Music, gaming, nightlife, retro-future',
  fonts:{head:"'Orbitron',system-ui,sans-serif",body:"'Rajdhani',system-ui,sans-serif",css:'family=Orbitron:wght@500;700;800&family=Rajdhani:wght@500;600;700'},
  t:{bg:'#12002A',surface:'#1D0640',ink:'#FDEBFF',mute:'#C9A6E8',line:'#3C1470',accent:'#FF2BD6',onAccent:'#1A0016',accent2:'#2DE2E6',radius:'10px',shadow:'0 20px 50px -20px rgba(255,43,214,.45)',glow:'0 0 18px rgba(255,43,214,.7)'},
  bg:'synth',stroke:{w:2,cap:'round'},case:'upper',
  voice:['Drive into the night.','Press play. Turn it up.','1986 called. It wants its future back.'],
  dos:['Pair magenta and cyan, never a third neon.','Use gradients on large shapes, flat colour on text.','Keep the horizon low so headlines sit in the sky.'],
  donts:['Neon text smaller than 18px.','Glow on everything.','Light backgrounds.']},
 {id:'chrome',no:'03',name:'Y2K Chrome',tagline:'Liquid metal, bubbles and blue light.',mood:'Fashion, beauty, tech launches, pop',
  fonts:{head:"'Michroma',system-ui,sans-serif",body:"'Manrope',system-ui,sans-serif",css:'family=Michroma&family=Manrope:wght@400;500;600;700'},
  t:{bg:'#E9EDF4',surface:'#FFFFFF',ink:'#10131A',mute:'#4C5566',line:'#C7CEDB',accent:'#3B5BFF',onAccent:'#FFFFFF',accent2:'#B9C1D3',radius:'22px',shadow:'inset 0 1px 0 #fff, 0 18px 40px -18px rgba(40,60,120,.45)',glow:'0 0 0 3px rgba(59,91,255,.25)'},
  bg:'chrome',stroke:{w:1.75,cap:'round'},case:'none',
  voice:['Shiny, new and slightly from the future.','Now in liquid silver.','Log on. Glow up.'],
  dos:['Use chrome gradients on shapes and buttons, not text.','Round everything generously.','Keep one saturated blue for actions.'],
  donts:['Flat grey where chrome should shine.','Sharp corners.','Dark mode; this one lives in daylight.']},
 {id:'brutalist',no:'04',name:'Brutalist',tagline:'Raw borders, loud type, no apologies.',mood:'Studios, publishers, events, manifestos',
  fonts:{head:"'Archivo Black',system-ui,sans-serif",body:"'Space Mono',ui-monospace,monospace",css:'family=Archivo+Black&family=Space+Mono:wght@400;700'},
  t:{bg:'#F4F1EA',surface:'#FFFFFF',ink:'#0A0A0A',mute:'#3D3D3D',line:'#0A0A0A',accent:'#FF3B00',onAccent:'#0A0A0A',accent2:'#0047FF',radius:'0px',shadow:'6px 6px 0 #0A0A0A',glow:'0 0 0 3px #0047FF'},
  bg:'brutal',stroke:{w:2.5,cap:'square'},case:'upper',
  voice:['NO FILLER.','Read this. Then read it again.','Built in public. Shipped on Friday.'],
  dos:['Use hard 2px borders and offset shadows.','Make the type do the work: huge, heavy, tight.','Let layouts break the grid on purpose.'],
  donts:['Soft shadows and gradients.','Rounded corners.','Polite, small headlines.']},
 {id:'deco',no:'05',name:'Art Deco',tagline:'Gold lines, black lacquer, symmetry.',mood:'Hotels, bars, events, luxury',
  fonts:{head:"'Poiret One',Georgia,serif",body:"'Josefin Sans',system-ui,sans-serif",css:'family=Poiret+One&family=Josefin+Sans:wght@400;600;700'},
  t:{bg:'#0C0B09',surface:'#17140F',ink:'#F3E9D2',mute:'#BFAE86',line:'#4A3E25',accent:'#D4AF37',onAccent:'#0C0B09',accent2:'#2E6B5E',radius:'0px',shadow:'0 0 0 1px #4A3E25, inset 0 0 0 4px #17140F, inset 0 0 0 5px #4A3E25',glow:'0 0 0 1px #D4AF37'},
  bg:'deco',stroke:{w:1.25,cap:'butt'},case:'upper',
  voice:['An evening of uncommon elegance.','Doors at eight. Black tie.','The golden hour, every hour.'],
  dos:['Centre everything and mirror it.','Use thin gold rules, fans and stepped corners.','Space out capitals generously.'],
  donts:['The display face for body text.','Bright colour beyond gold and jade.','Casual, chatty copy.']},
 {id:'blueprint',no:'06',name:'Blueprint',tagline:'White lines on drafting blue.',mood:'Engineering, architecture, documentation, dev tools',
  fonts:{head:"'IBM Plex Mono',ui-monospace,monospace",body:"'IBM Plex Sans',system-ui,sans-serif",css:'family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600'},
  t:{bg:'#0B3B8C',surface:'#0E4AA8',ink:'#FFFFFF',mute:'#D2E1FF',line:'#5F8FE0',accent:'#FFD23F',onAccent:'#0B1E45',accent2:'#FFFFFF',radius:'2px',shadow:'0 0 0 1px #5F8FE0',glow:'0 0 0 2px #FFD23F'},
  bg:'blueprint',stroke:{w:1.25,cap:'butt'},case:'none',
  voice:['Drawn to scale.','Every part, numbered and noted.','Measure twice. Ship once.'],
  dos:['Annotate: labels, dimensions and callouts.','Keep lines thin and white, one yellow highlight.','Align to a visible grid.'],
  donts:['Filled, heavy shapes.','Photographs without a line treatment.','Decorative fonts.']},
 {id:'vaporwave',no:'07',name:'Vaporwave',tagline:'Pastel sky, checker floor, a slow sunset.',mood:'Music, merch, playful brands, internet culture',
  fonts:{head:"'Righteous',system-ui,sans-serif",body:"'Work Sans',system-ui,sans-serif",css:'family=Righteous&family=Work+Sans:wght@400;500;600'},
  t:{bg:'#FCE4F6',surface:'#FFFFFF',ink:'#2B1240',mute:'#6B4A86',line:'#F0B6E2',accent:'#7B2FF7',onAccent:'#FFFFFF',accent2:'#00B3B3',radius:'6px',shadow:'4px 4px 0 #F0B6E2',glow:'0 0 0 3px rgba(123,47,247,.3)'},
  bg:'vapor',stroke:{w:2,cap:'round'},case:'none',
  voice:['Aesthetic, but make it useful.','Now playing: the sunset.','ｗｅｌｃｏｍｅ　ｔｏ　ｔｈｅ　ｍａｌｌ'],
  dos:['Pastel pink and teal with one strong violet.','Retro computer windows for panels.','Wide-spaced text for one line, not paragraphs.'],
  donts:['Teal for text; it is too light.','Dark, heavy backgrounds.','Serious corporate tone.']},
 {id:'bauhaus',no:'08',name:'Bauhaus',tagline:'Circle, square, triangle, red, yellow, blue.',mood:'Education, galleries, design studios, architecture',
  fonts:{head:"'Jost',system-ui,sans-serif",body:"'Jost',system-ui,sans-serif",css:'family=Jost:wght@400;500;700;800'},
  t:{bg:'#F2EDE3',surface:'#FFFFFF',ink:'#111111',mute:'#4A4A4A',line:'#111111',accent:'#D7261E',onAccent:'#FFFFFF',accent2:'#1A4DB8',accent3:'#F5C400',radius:'0px',shadow:'none',glow:'0 0 0 3px #1A4DB8'},
  bg:'bauhaus',stroke:{w:2,cap:'butt'},case:'none',
  voice:['Form follows function.','Less, but better.','Learn by making.'],
  dos:['Build layouts from circles, squares and triangles.','Use primaries in flat blocks.','Set headlines heavy and tight, body light.'],
  donts:['Gradients and shadows.','More than three colours plus black.','Ornament without purpose.']},
 {id:'graphite',no:'09',name:'01 Graphite',tagline:'A motherboard city at night.',mood:'AI, infrastructure, fintech, anything that should feel expensive and alive',
  fonts:{head:"'Geist',system-ui,sans-serif",body:"'Geist',system-ui,sans-serif",css:'family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500'},
  t:{bg:'#07090C',surface:'#0F1318',ink:'#E7EAEE',mute:'#8A94A2',line:'#252D38',accent:'#7FE7F7',onAccent:'#07090C',accent2:'#3CF29A',accent3:'#A98BFF',radius:'4px',shadow:'0 0 0 1px #252D38',glow:'0 0 10px rgba(127,231,247,.55)'},
  bg:'graphite',stroke:{w:1.4,cap:'square'},case:'none',
  voice:['The most powerful agentic system.','Coordinated. Adaptive. Unyielding.','1000+ models, and more always coming.'],
  dos:['Set the headline huge, platinum, left-aligned and off-centre.','Let numbers tick in steps; text decodes from 0s and 1s.','Keep cyan for signal and green for "live"; purple and amber stay rare.'],
  donts:['Boxed callout cards: use hairlines and corner ticks instead.','Overhead or symmetrical compositions.','Small headlines, or any "by invitation only" line.']}
];

/* ---------- Animated backgrounds: (canvas, t, still) -> stop() ---------- */
const BG={
matrix(c,t,still){const x=c.getContext('2d');let W,H,cols,drops,fs,raf;const glyphs='01アイウエオカキクケコサシスセソタチツテトナニヌネノ01ﾊﾋﾌﾍﾎ0110';
 function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;fs=16*d;cols=Math.ceil(W/fs);drops=Array.from({length:cols},()=>Math.random()*-H/fs);x.fillStyle=t.bg;x.fillRect(0,0,W,H)}
 function step(){x.fillStyle='rgba(2,7,3,.1)';x.fillRect(0,0,W,H);x.font=fs+'px monospace';for(let i=0;i<cols;i++){const ch=glyphs[Math.random()*glyphs.length|0];const y=drops[i]*fs;x.fillStyle=Math.random()<.04?'#E9FFEE':t.accent;x.globalAlpha=.85;x.fillText(ch,i*fs,y);x.globalAlpha=1;if(y>H&&Math.random()>.975)drops[i]=0;drops[i]+=.55}}
 size();if(still){for(let k=0;k<160;k++)step();return()=>{}}let last=0;const loop=n=>{raf=requestAnimationFrame(loop);if(n-last<45)return;last=n;step()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
synth(c,t,still){const x=c.getContext('2d');let W,H,raf,off=0;const stars=Array.from({length:120},()=>[Math.random(),Math.random()*.55,Math.random()]);
 function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function draw(){const hz=H*.62;let g=x.createLinearGradient(0,0,0,hz);g.addColorStop(0,t.bg);g.addColorStop(1,'#3A0A5E');x.fillStyle=g;x.fillRect(0,0,W,hz);
  stars.forEach(s=>{x.fillStyle=`rgba(255,235,255,${.3+.7*s[2]})`;x.fillRect(s[0]*W,s[1]*H,1.5,1.5)});
  const r=Math.min(W,H)*.22,cx=W/2,cy=hz-r*.15;g=x.createLinearGradient(0,cy-r,0,cy+r);g.addColorStop(0,'#FFE66D');g.addColorStop(.5,'#FF7AC6');g.addColorStop(1,t.accent);x.save();x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.clip();x.fillStyle=g;x.fillRect(cx-r,cy-r,r*2,r*2);x.fillStyle='#2A0848';for(let i=0;i<7;i++){const yy=cy+r*.1+i*r*.13,h=2+i*1.6;x.fillRect(cx-r,yy,r*2,h)}x.restore();
  x.shadowColor=t.accent;x.shadowBlur=40;x.fillStyle='rgba(0,0,0,0)';x.beginPath();x.arc(cx,cy,r,Math.PI,0);x.fill();x.shadowBlur=0;
  g=x.createLinearGradient(0,hz,0,H);g.addColorStop(0,'#2A0848');g.addColorStop(1,t.bg);x.fillStyle=g;x.fillRect(0,hz,W,H-hz);
  x.strokeStyle=t.accent2;x.lineWidth=1.2;x.globalAlpha=.75;for(let i=-24;i<=24;i++){x.beginPath();x.moveTo(cx+i*W*.012,hz);x.lineTo(cx+i*W*.16,H);x.stroke()}
  for(let i=0;i<16;i++){const p=((i+off)%16)/16,y=hz+(H-hz)*p*p;x.globalAlpha=.2+.6*p;x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke()}x.globalAlpha=1}
 size();if(still){draw();return()=>{}}const loop=()=>{off=(off+.03)%16;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
chrome(c,t,still){const x=c.getContext('2d');let W,H,raf,a=0;const B=Array.from({length:7},(_,i)=>({x:Math.random(),y:Math.random(),r:.12+Math.random()*.16,p:i*1.3,s:.4+Math.random()*.6}));
 function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function draw(){let g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#F5F7FB');g.addColorStop(.5,t.bg);g.addColorStop(1,'#DCE2EE');x.fillStyle=g;x.fillRect(0,0,W,H);
  B.forEach((b,i)=>{const px=(b.x+.08*Math.sin(a*b.s+b.p))*W,py=(b.y+.08*Math.cos(a*b.s*.8+b.p))*H,r=b.r*Math.min(W,H)*1.4;
   const rg=x.createRadialGradient(px-r*.35,py-r*.4,r*.05,px,py,r);rg.addColorStop(0,'#FFFFFF');rg.addColorStop(.35,i%3?'#D9DEE8':'#CFE0FF');rg.addColorStop(.7,i%2?'#8E97AA':'#9AA8D6');rg.addColorStop(.92,'#5D667A');rg.addColorStop(1,'rgba(93,102,122,0)');
   x.fillStyle=rg;x.beginPath();x.arc(px,py,r,0,Math.PI*2);x.fill();x.fillStyle='rgba(255,255,255,.75)';x.beginPath();x.ellipse(px-r*.3,py-r*.45,r*.28,r*.12,-.5,0,Math.PI*2);x.fill()})}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.006;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
brutal(c,t,still){const x=c.getContext('2d');let W,H,raf,cells=[],n=0,cs;const pal=[t.bg,t.bg,t.bg,t.ink,t.accent,t.accent2,'#FFFFFF'];
 function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;cs=Math.max(48,Math.round(W/16));cells=[];for(let y=0;y<H/cs+1;y++)for(let i=0;i<W/cs+1;i++)cells.push({i,y,c:pal[Math.random()*pal.length|0],k:Math.random()*4|0})}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);cells.forEach(e=>{x.fillStyle=e.c;const X=e.i*cs,Y=e.y*cs;if(e.k===0)x.fillRect(X,Y,cs,cs);else if(e.k===1){x.beginPath();x.arc(X+cs/2,Y+cs/2,cs/2,0,Math.PI*2);x.fill()}else if(e.k===2){x.fillRect(X,Y,cs,cs/2)}else{x.beginPath();x.moveTo(X,Y+cs);x.lineTo(X+cs,Y);x.lineTo(X+cs,Y+cs);x.fill()}});x.strokeStyle=t.ink;x.lineWidth=2;for(let X=0;X<W;X+=cs){x.beginPath();x.moveTo(X,0);x.lineTo(X,H);x.stroke()}for(let Y=0;Y<H;Y+=cs){x.beginPath();x.moveTo(0,Y);x.lineTo(W,Y);x.stroke()}}
 size();draw();if(still)return()=>{};let last=0;const loop=s=>{raf=requestAnimationFrame(loop);if(s-last<420)return;last=s;for(let k=0;k<4;k++){const e=cells[Math.random()*cells.length|0];e.c=pal[Math.random()*pal.length|0];e.k=Math.random()*4|0}draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(()=>{size();draw()});ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
deco(c,t,still){const x=c.getContext('2d');let W,H,raf,a=0;
 function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const cx=W/2,cy=H*1.02,R=Math.hypot(W,H);x.strokeStyle=t.accent;
  for(let i=0;i<72;i++){const an=Math.PI+i/72*Math.PI+Math.sin(a+i*.3)*.004;x.globalAlpha=i%2?.18:.42;x.lineWidth=i%6?1:2;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(an)*R,cy+Math.sin(an)*R);x.stroke()}
  x.globalAlpha=1;x.fillStyle=t.bg;for(let k=5;k>=1;k--){const r=k*Math.min(W,H)*.11+((a*20)%(Math.min(W,H)*.11));x.lineWidth=k===1?3:1.4;x.globalAlpha=.55+.08*k;x.beginPath();x.arc(cx,cy,r,Math.PI,0);x.stroke()}
  x.globalAlpha=1;x.beginPath();x.arc(cx,cy,Math.min(W,H)*.09,Math.PI,0);x.fill();x.lineWidth=2;x.stroke()}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.004;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
blueprint(c,t,still){const x=c.getContext('2d');let W,H,raf,d,shapes=[],tm=0;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function add(){const k=Math.random()*3|0,cx=Math.random()*W,cy=Math.random()*H,s=(60+Math.random()*160)*d;shapes.push({k,cx,cy,s,t:0})}
 function grid(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.strokeStyle='rgba(255,255,255,.08)';x.lineWidth=1;for(let X=0;X<W;X+=20*d){x.beginPath();x.moveTo(X,0);x.lineTo(X,H);x.stroke()}for(let Y=0;Y<H;Y+=20*d){x.beginPath();x.moveTo(0,Y);x.lineTo(W,Y);x.stroke()}x.strokeStyle='rgba(255,255,255,.18)';for(let X=0;X<W;X+=100*d){x.beginPath();x.moveTo(X,0);x.lineTo(X,H);x.stroke()}for(let Y=0;Y<H;Y+=100*d){x.beginPath();x.moveTo(0,Y);x.lineTo(W,Y);x.stroke()}}
 function draw(){grid();x.lineWidth=1.4*d;shapes.forEach(s=>{const p=Math.min(1,s.t),fade=s.t>2?Math.max(0,1-(s.t-2)):1;x.globalAlpha=.8*fade;x.strokeStyle='#FFFFFF';x.beginPath();
   if(s.k===0)x.arc(s.cx,s.cy,s.s/2,0,Math.PI*2*p);else if(s.k===1){const L=s.s*4*p;const pts=[[0,0],[s.s,0],[s.s,s.s*.6],[0,s.s*.6],[0,0]];let left=L;x.moveTo(s.cx,s.cy);for(let i=1;i<pts.length&&left>0;i++){const a=pts[i-1],b=pts[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]),f=Math.min(1,left/len);x.lineTo(s.cx+a[0]+(b[0]-a[0])*f,s.cy+a[1]+(b[1]-a[1])*f);left-=len}}else{x.moveTo(s.cx,s.cy);x.lineTo(s.cx+s.s*1.5*p,s.cy)}
   x.stroke();if(s.k===2&&p>=1){x.fillStyle=t.accent;x.font=`${12*d}px monospace`;x.fillText((s.s/d|0)+' mm',s.cx+s.s*.55,s.cy-6*d);x.beginPath();x.moveTo(s.cx,s.cy-6*d);x.lineTo(s.cx,s.cy+6*d);x.moveTo(s.cx+s.s*1.5,s.cy-6*d);x.lineTo(s.cx+s.s*1.5,s.cy+6*d);x.stroke()}});x.globalAlpha=1;shapes=shapes.filter(s=>s.t<3)}
 size();if(still){for(let i=0;i<9;i++){add();shapes[i].t=1}draw();return()=>{}}let last=0;const loop=n=>{raf=requestAnimationFrame(loop);const dt=last?(n-last)/1000:0;last=n;tm+=dt;if(tm>.7){tm=0;if(shapes.length<10)add()}shapes.forEach(s=>s.t+=dt*.5);draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
vapor(c,t,still){const x=c.getContext('2d');let W,H,raf,off=0;
 function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function draw(){const hz=H*.58;let g=x.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#A9E8F0');g.addColorStop(.6,'#F9C6E8');g.addColorStop(1,'#FFD9B8');x.fillStyle=g;x.fillRect(0,0,W,hz);
  const r=Math.min(W,H)*.18,cx=W*.5,cy=hz-r*.2;g=x.createLinearGradient(0,cy-r,0,cy+r);g.addColorStop(0,'#FFB3D9');g.addColorStop(1,'#FF7EB6');x.save();x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.clip();x.fillStyle=g;x.fillRect(cx-r,cy-r,2*r,2*r);x.fillStyle='#FCE4F6';for(let i=0;i<5;i++)x.fillRect(cx-r,cy+i*r*.18,2*r,3+i*2);x.restore();
  x.fillStyle='#2B1240';x.fillRect(0,hz,W,H-hz);const rows=14;for(let j=0;j<rows;j++){const p0=((j+off)/rows),p1=((j+1+off)/rows);const y0=hz+(H-hz)*p0*p0,y1=hz+(H-hz)*p1*p1;const n=16;for(let i=-n;i<n;i++){if((i+j)%2)continue;const xa0=W/2+i/n*W*(.15+p0*1.2),xb0=W/2+(i+1)/n*W*(.15+p0*1.2),xa1=W/2+i/n*W*(.15+p1*1.2),xb1=W/2+(i+1)/n*W*(.15+p1*1.2);x.fillStyle=j%2?'#00B3B3':'#F9A8D4';x.beginPath();x.moveTo(xa0,y0);x.lineTo(xb0,y0);x.lineTo(xb1,y1);x.lineTo(xa1,y1);x.fill()}}}
 size();if(still){draw();return()=>{}}const loop=()=>{off=(off+.01)%2;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
graphite(c,t,still){const x=c.getContext('2d');let W,H,d,raf,routes=[],cars=[],chips=[];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;const g=24*d;routes=[];chips=[];
  for(let k=0;k<26;k++){const cw=(2+Math.random()*4|0)*g,ch=(2+Math.random()*3|0)*g;chips.push([Math.round(Math.random()*W/g)*g,Math.round(Math.random()*H/g)*g,cw,ch])}
  for(let k=0;k<46;k++){let px=Math.round(Math.random()*W/g)*g,py=Math.round(Math.random()*H/g)*g,dx=Math.random()<.5?1:-1,dy=0;const pts=[[px,py]];if(Math.random()<.5){dy=dx;dx=0}
   for(let s=0;s<6;s++){const L=(2+Math.random()*8|0)*g;px+=dx*L;py+=dy*L;pts.push([px,py]);if(Math.random()<.6){const tt=Math.random()<.5?1:-1;const ndx=dx?0:tt,ndy=dy?0:tt;px+=(dx+ndx)*g*.5;py+=(dy+ndy)*g*.5;pts.push([px,py]);dx=ndx;dy=ndy}}
   const len=[0];for(let i=1;i<pts.length;i++)len.push(len[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));routes.push({pts,len,hi:Math.random()<.25})}
  cars=Array.from({length:140},()=>{const r=routes[Math.random()*routes.length|0];return{r,t:Math.random()*r.len[r.len.length-1],v:(40+Math.random()*90)*d,c:Math.random()<.06?t.accent2:Math.random()<.5?t.accent:'#DDFBFF'}})}
 function draw(dt){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.lineWidth=d;
  chips.forEach(([a,b,w,h])=>{x.fillStyle='#10141A';x.fillRect(a,b,w,h);x.strokeStyle='rgba(168,216,226,.28)';x.strokeRect(a+.5,b+.5,w,h);x.fillStyle='rgba(190,200,212,.35)';for(let i=a+6*d;i<a+w-4*d;i+=8*d){x.fillRect(i,b-4*d,3*d,4*d);x.fillRect(i,b+h,3*d,4*d)}});
  routes.forEach(r=>{x.strokeStyle=r.hi?'rgba(127,231,247,.45)':'rgba(44,143,160,.45)';x.lineWidth=(r.hi?1.6:1)*d;x.beginPath();r.pts.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.stroke()});
  cars.forEach(k=>{const r=k.r,tot=r.len[r.len.length-1];k.t=(k.t+k.v*dt)%tot;let i=1;while(i<r.len.length-1&&r.len[i]<k.t)i++;const a=r.pts[i-1],b=r.pts[i],f=(k.t-r.len[i-1])/((r.len[i]-r.len[i-1])||1),px=a[0]+(b[0]-a[0])*f,py=a[1]+(b[1]-a[1])*f;
   const g=x.createRadialGradient(px,py,0,px,py,6*d);g.addColorStop(0,k.c);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(px-6*d,py-6*d,12*d,12*d)})}
 size();if(still){draw(0);return()=>{}}let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(n-last)/1000);last=n;draw(dt)};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
bauhaus(c,t,still){const x=c.getContext('2d');let W,H,raf,a=0,items=[];const cols=[t.accent,t.accent2,t.accent3||'#F5C400',t.ink];
 function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;const s=Math.max(70,W/9);items=[];for(let y=0;y<H/s;y++)for(let i=0;i<W/s;i++){if(Math.random()<.45)items.push({X:i*s,Y:y*s,s,k:Math.random()*4|0,c:cols[Math.random()*cols.length|0],r:Math.random()*4|0,sp:(Math.random()-.5)*.6})}}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);items.forEach(e=>{x.save();x.translate(e.X+e.s/2,e.Y+e.s/2);x.rotate(e.r*Math.PI/2+Math.sin(a+e.X)*e.sp);x.fillStyle=e.c;const h=e.s/2;x.beginPath();if(e.k===0)x.arc(0,0,h*.9,0,Math.PI*2);else if(e.k===1)x.rect(-h*.8,-h*.8,h*1.6,h*1.6);else if(e.k===2){x.moveTo(-h*.9,h*.8);x.lineTo(0,-h*.9);x.lineTo(h*.9,h*.8)}else{x.arc(-h,h,h*1.8,-Math.PI/2,0);x.lineTo(-h,h)}x.fill();x.restore()})}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.01;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}}
};

/* ---------- SVG assets ---------- */
const ICONS={home:'M4 11 12 4l8 7M6 9.5V20h12V9.5M10 20v-5h4v5',search:'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20',user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0',settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',heart:'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z',arrow:'M4 12h15M13 6l6 6-6 6',play:'M7 5v14l12-7z',download:'M12 4v11M7 10l5 5 5-5M5 20h14',mail:'M3.5 6h17v12h-17zM3.5 6l8.5 7 8.5-7',star:'M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.4 9.7l6-.7z',lock:'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',chat:'M4 5h16v11H9l-5 4z'};
function icon(k,name,size=24){const s=k.stroke;const join=s.cap==='round'?'round':'miter';return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${k.t.ink}" stroke-width="${s.w}" stroke-linecap="${s.cap}" stroke-linejoin="${join}"><path d="${ICONS[name]}"/></svg>`}
function pattern(k){const t=k.t;switch(k.id){
 case 'matrix':{let s='';const r=n=>((Math.sin(n*12.9898)*43758.5453)%1+1)%1;for(let y=0;y<8;y++)for(let i=0;i<8;i++){const v=r(y*8+i+1);s+=`<text x="${i*10+2}" y="${y*10+9}" fill="${v>.85?t.accent:t.line}" font-family="monospace" font-size="9">${v>.5?1:0}</text>`}return `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="${t.bg}"/>${s}</svg>`}
 case 'synthwave':return `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="${t.bg}"/><path d="M0 40h80M40 0v80" stroke="${t.accent}" stroke-opacity=".5"/><path d="M0 0h80M0 0v80" stroke="${t.accent2}" stroke-opacity=".35"/><circle cx="40" cy="40" r="2" fill="${t.accent2}"/></svg>`;
 case 'chrome':return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><defs><radialGradient id="b" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#D6DCE8"/><stop offset=".9" stop-color="#7C869B"/><stop offset="1" stop-color="#7C869B" stop-opacity="0"/></radialGradient></defs><rect width="96" height="96" fill="${t.bg}"/><circle cx="24" cy="24" r="16" fill="url(#b)"/><circle cx="72" cy="66" r="22" fill="url(#b)"/><circle cx="76" cy="16" r="7" fill="url(#b)"/><circle cx="20" cy="78" r="9" fill="url(#b)"/></svg>`;
 case 'brutalist':return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="${t.bg}"/><path d="M-12 12 12-12M0 48 48 0M36 60 60 36" stroke="${t.ink}" stroke-width="3"/><circle cx="36" cy="36" r="3" fill="${t.accent}"/></svg>`;
 case 'deco':return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" viewBox="0 0 64 32"><rect width="64" height="32" fill="${t.bg}"/><g fill="none" stroke="${t.accent}" stroke-width="1"><path d="M0 32a32 32 0 0 1 64 0"/><path d="M8 32a24 24 0 0 1 48 0"/><path d="M16 32a16 16 0 0 1 32 0"/><path d="M24 32a8 8 0 0 1 16 0"/><path d="M-32 32a32 32 0 0 1 64 0" transform="translate(0 -32)"/><path d="M32 32a32 32 0 0 1 64 0" transform="translate(0 -32)"/></g></svg>`;
 case 'blueprint':return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="${t.bg}"/><g stroke="#fff" stroke-opacity=".1"><path d="M20 0v100M40 0v100M60 0v100M80 0v100M0 20h100M0 40h100M0 60h100M0 80h100"/></g><path d="M0 .5h100M.5 0v100" stroke="#fff" stroke-opacity=".3"/></svg>`;
 case 'vaporwave':return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="${t.bg}"/><rect width="20" height="20" fill="${t.line}"/><rect x="20" y="20" width="20" height="20" fill="${t.line}"/><path d="M26 6l6 10H20z" fill="${t.accent2}" fill-opacity=".6"/></svg>`;
 case 'graphite':return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" fill="${t.bg}"/><g fill="none" stroke-width="1"><path d="M0 24h30l12 12h54M48 0v18l12 12v66M0 72h20l10-10h22" stroke="#2C8FA0" stroke-opacity=".7"/><path d="M72 0v40l-8 8H0" stroke="${t.accent}" stroke-opacity=".55"/></g><rect x="56" y="56" width="22" height="16" fill="${t.surface}" stroke="#A8D8E2" stroke-opacity=".35"/><circle cx="30" cy="24" r="2" fill="${t.accent}"/><circle cx="64" cy="48" r="2" fill="${t.accent2}"/></svg>`;
 default:return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" fill="${t.bg}"/><circle cx="24" cy="24" r="18" fill="${t.accent}"/><rect x="54" y="6" width="36" height="36" fill="${t.accent2}"/><path d="M6 90 24 54l18 36z" fill="${t.accent3||'#F5C400'}"/><path d="M54 54h36v36a36 36 0 0 1-36-36z" fill="${t.ink}"/></svg>`}}
function mark(k){const t=k.t;switch(k.id){
 case 'matrix':return `<g fill="none" stroke="${t.accent}" stroke-width="3"><rect x="6" y="6" width="52" height="52"/><path d="M18 22l10 10-10 10M32 44h14"/></g>`;
 case 'synthwave':return `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE66D"/><stop offset="1" stop-color="${t.accent}"/></linearGradient></defs><circle cx="32" cy="30" r="24" fill="url(#g)"/><path d="M8 36h48M8 42h48M8 48h48" stroke="${t.bg}" stroke-width="3"/>`;
 case 'chrome':return `<defs><radialGradient id="g" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#C9D0DE"/><stop offset="1" stop-color="#5D667A"/></radialGradient></defs><path d="M32 4c10 14 26 14 26 28S46 60 32 60 6 46 6 32 22 18 32 4z" fill="url(#g)"/>`;
 case 'brutalist':return `<rect x="4" y="4" width="56" height="56" fill="${t.accent}" stroke="${t.ink}" stroke-width="4"/><rect x="14" y="14" width="56" height="56" fill="none" stroke="${t.ink}" stroke-width="4"/>`;
 case 'deco':return `<g fill="none" stroke="${t.accent}" stroke-width="2"><path d="M32 4 60 32 32 60 4 32z"/><path d="M32 14 50 32 32 50 14 32z"/><path d="M32 4v56M4 32h56"/></g>`;
 case 'blueprint':return `<g fill="none" stroke="#fff" stroke-width="2"><circle cx="32" cy="32" r="22"/><path d="M32 4v56M4 32h56"/></g><circle cx="32" cy="32" r="5" fill="${t.accent}"/>`;
 case 'vaporwave':return `<rect x="6" y="10" width="52" height="44" rx="4" fill="#fff" stroke="${t.ink}" stroke-width="3"/><path d="M6 20h52" stroke="${t.ink}" stroke-width="3"/><circle cx="32" cy="38" r="10" fill="${t.accent}"/>`;
 case 'graphite':return `<rect x="2" y="2" width="60" height="60" rx="8" fill="${t.surface}"/><text x="9" y="44" font-family="Geist,Arial,sans-serif" font-weight="700" font-size="30" fill="${t.ink}" letter-spacing="-1.5">01</text><rect x="49" y="37" width="7" height="7" fill="${t.accent}"/>`;
 default:return `<circle cx="20" cy="20" r="16" fill="${t.accent}"/><rect x="34" y="4" width="26" height="26" fill="${t.accent2}"/><path d="M4 60 20 34l16 26z" fill="${t.accent3||'#F5C400'}"/><path d="M38 60V36h22a24 24 0 0 1-22 24z" fill="${t.ink}"/>`}}
function logo(k,dark){const t=k.t,w=Math.max(260,k.name.length*26+110);const fam=k.fonts.head.split(',')[0].replace(/'/g,'');return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="80" viewBox="0 0 ${w} 80"><rect width="${w}" height="80" fill="${dark?t.bg:'none'}"/><g transform="translate(8 8)">${mark(k)}</g><text x="88" y="50" fill="${t.ink}" font-family="${fam}, sans-serif" font-size="30" letter-spacing="${k.case==='upper'?3:0}">${k.case==='upper'?k.name.toUpperCase():k.name}</text></svg>`}
function divider(k){const t=k.t;const by={deco:`<path d="M0 12h150M250 12h150" stroke="${t.accent}"/><path d="M200 2l10 10-10 10-10-10z" fill="none" stroke="${t.accent}"/><circle cx="170" cy="12" r="2" fill="${t.accent}"/><circle cx="230" cy="12" r="2" fill="${t.accent}"/>`,brutalist:`<rect y="6" width="400" height="12" fill="${t.ink}"/><rect x="0" y="6" width="120" height="12" fill="${t.accent}"/>`,matrix:`<text x="0" y="17" fill="${t.accent}" font-family="monospace" font-size="14">${'01001101 01000001 01010100 01010010 01001001 01011000'.slice(0,52)}</text>`,blueprint:`<path d="M0 12h400M0 4v16M400 4v16" stroke="#fff"/><text x="185" y="9" fill="${t.accent}" font-family="monospace" font-size="9">400</text>`};
 return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="24" viewBox="0 0 400 24">${by[k.id]||`<path d="M0 12h400" stroke="${t.accent}" stroke-width="2" stroke-dasharray="${k.id==='bauhaus'?'0':'12 8'}"/><circle cx="200" cy="12" r="6" fill="${t.accent2}"/>`}</svg>`}
function css(k){const t=k.t;return `/* ${k.name} (${k.no}) theme kit · Visual & Motion Atlas */
@import url('https://fonts.googleapis.com/css2?${k.fonts.css}&display=swap');
:root{
  --bg:${t.bg};
  --surface:${t.surface};
  --ink:${t.ink};
  --mute:${t.mute};
  --line:${t.line};
  --accent:${t.accent};
  --on-accent:${t.onAccent};
  --accent-2:${t.accent2};${t.accent3?`\n  --accent-3:${t.accent3};`:''}
  --radius:${t.radius};
  --shadow:${t.shadow};
  --glow:${t.glow};
  --font-head:${k.fonts.head};
  --font-body:${k.fonts.body};
  --case:${k.case==='upper'?'uppercase':'none'};
  --stroke:${k.stroke.w}px;
}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 var(--font-body)}
h1,h2,h3{font-family:var(--font-head);text-transform:var(--case);line-height:1.05}
.btn{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 20px;border:2px solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--on-accent);font:600 15px var(--font-body);text-transform:var(--case);cursor:pointer}
.btn:hover{box-shadow:var(--glow)}
.btn.ghost{background:transparent;color:var(--ink);border-color:var(--line)}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:24px}
.field{width:100%;min-height:44px;padding:0 14px;border:1px solid var(--line);border-radius:var(--radius);background:var(--bg);color:var(--ink);font:inherit}
.field:focus{outline:none;box-shadow:var(--glow);border-color:var(--accent)}
.badge{display:inline-block;padding:4px 10px;border-radius:999px;border:1px solid var(--accent);color:var(--ink);font-size:12px;text-transform:var(--case)}
`}
function json(k){return JSON.stringify({name:k.name,number:k.no,tagline:k.tagline,color:{bg:k.t.bg,surface:k.t.surface,ink:k.t.ink,mute:k.t.mute,line:k.t.line,accent:k.t.accent,onAccent:k.t.onAccent,accent2:k.t.accent2,...(k.t.accent3?{accent3:k.t.accent3}:{})},font:{head:k.fonts.head,body:k.fonts.body,googleFonts:'https://fonts.googleapis.com/css2?'+k.fonts.css+'&display=swap'},radius:k.t.radius,shadow:k.t.shadow,glow:k.t.glow,textCase:k.case,iconStroke:k.stroke},null,2)}

/* ---------- Minimal ZIP writer (stored, no compression) ---------- */
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRC[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0}
function zip(files){const enc=new TextEncoder(),parts=[],central=[];let off=0;const d=new Date(),time=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),date=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate();
 for(const [name,data] of files){const n=enc.encode(name),b=typeof data==='string'?enc.encode(data):data,crc=crc32(b);
  const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint16(10,time,true);h.setUint16(12,date,true);h.setUint32(14,crc,true);h.setUint32(18,b.length,true);h.setUint32(22,b.length,true);h.setUint16(26,n.length,true);h.setUint16(28,0,true);
  parts.push(new Uint8Array(h.buffer),n,b);
  const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(10,0,true);c.setUint16(12,time,true);c.setUint16(14,date,true);c.setUint32(16,crc,true);c.setUint32(20,b.length,true);c.setUint32(24,b.length,true);c.setUint16(28,n.length,true);c.setUint32(42,off,true);
  central.push(new Uint8Array(c.buffer),n);off+=30+n.length+b.length}
 const csize=central.reduce((a,x)=>a+x.length,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,csize,true);e.setUint32(16,off,true);
 return new Blob([...parts,...central,new Uint8Array(e.buffer)],{type:'application/zip'})}

window.ThemeKits={list:K,BG,ICONS,icon,pattern,mark,logo,divider,css,json,zip,crc32};
})();
