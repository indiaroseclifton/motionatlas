'use strict';
/* System kits: every atlas design system (D01–D48) presented as a complete, downloadable kit.
   - Hub additions: a token bar (Download tokens ZIP, Copy CSS variables, Download kit ZIP and a live
     WCAG contrast readout) and a "Kit" tab with an animated token-driven background, colour and type
     scales, a component sheet, the product screen, generated logo / mark / icons / pattern / divider,
     and voice, dos and don'ts.
   - Catalogue additions: a Cards / Kits view toggle on #systems, collection filters that understand
     D37–D48, and corrected collection counts.
   Every background is a self-contained function (canvas, tokens, still) -> stop(), so it is exported
   into the kit as-is. If kits/themes.js is loaded, its ZIP writer is used; otherwise our own. */
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const num=id=>Number(String(id).slice(1));
const svgURL=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);

/* ---------- colour ---------- */
const hex=h=>{h=String(h||'#000').trim();if(h.length===4)h='#'+[...h.slice(1)].map(c=>c+c).join('');return h.slice(1,7).match(/../g).map(x=>parseInt(x,16));};
const toHex=a=>'#'+a.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
const lum=h=>{const v=hex(h).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2];};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const mix=(a,b,t)=>{const x=hex(a),y=hex(b);return toHex(x.map((v,i)=>v+(y[i]-v)*t));};
const safe=(c,ink,grounds,min=4.5)=>{for(let t=0;t<=1.0001;t+=.05){const m=mix(c,ink,t);if(grounds.every(g=>ratio(m,g)>=min))return m;}return ink;};
const onColor=c=>ratio(c,'#000000')>=ratio(c,'#ffffff')?'#000000':'#ffffff';
const hue=(h,deg)=>{let [r,g,b]=hex(h).map(v=>v/255);const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let H=0,S=0;if(mx!==mn){const d=mx-mn;S=l>.5?d/(2-mx-mn):d/(mx+mn);H=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;H*=60;}H=(H+deg+360)%360;const f=n=>{const k=(n+H/30)%12,a=S*Math.min(l,1-l);return l-a*Math.max(-1,Math.min(k-3,9-k,1));};return toHex([f(0),f(8),f(4)].map(v=>v*255));};
const grade=r=>r>=7?'AAA':r>=4.5?'AA':r>=3?'AA large':'Fails';
const A=(h,a)=>{const [r,g,b]=hex(h);return `rgba(${r},${g},${b},${a})`;};

/* ---------- per-system kit data: background, case, voice, one do, one don't ---------- */
const D={
 D01:['drift',0,'Room to think.|Your day, in one calm view.|Less chrome, more work.','Keep translucent bars above solid reading surfaces.','Glass behind body text.'],
 D02:['bubbles',0,'A little more done.|Big, friendly, obvious.|Tap the thing you need next.','Reserve the strongest tonal container for the next action.','Five equally loud buttons.'],
 D03:['grid',0,'All systems nominal.|Data first. Chrome last.|Know before they do.','Give tables the full width and use tabular figures.','Hiding errors in toasts that vanish.'],
 D04:['drift',0,'Work, together.|Keep the work visible.|Pick up where the team left off.','Keep people and activity next to the document.','Moving the document while panes open.'],
 D05:['dots',0,'Ship the next thing.|Quiet UI, clear focus.|Fewer pixels, more product.','Use semantic controls and visible focus rings.','Grey-on-grey text below 4.5:1.'],
 D06:['paper',0,'Pay attention.|Words first, always.|A slower kind of web.','Let one serif headline lead each page.','Scroll effects that interrupt reading.'],
 D07:['waves',0,'Press, and feel it.|Quiet controls. Clear feedback.|Turn it up, gently.','Pair soft depth with a visible border.','Shadows as the only boundary.'],
 D08:['rain',1,'System ready.|Signal acquired.|One glow. One meaning.','Keep live readings static and legible.','Animating every number.'],
 D09:['drift',0,'Light through leaves.|A workspace that breathes.|See the garden, read the page.','Tint reading panels strongly over the scene.','Clear glass behind paragraphs.'],
 D10:['drift',0,'Made by hand, kept by you.|Cool mint, warm hands.|Press softly.','Keep raised controls outlined.','Mint text on porcelain.'],
 D11:['paper',0,'Soft light, slow reading.|A quieter page.|Room for one idea.','Use serif headlines and generous margins.','Lilac for body text.'],
 D12:['drift',0,'An evening in amber.|Warm light, clear choices.|Arrive slowly.','Keep booking details on solid tinted panels.','Gold on champagne for labels.'],
 D13:['drift',0,'Clear skies ahead.|Information with altitude.|Light, layered, legible.','Use cool frosted cards over a soft sky.','Stacking more than two glass layers.'],
 D14:['bubbles',0,'Good morning.|Small steps, softly counted.|Gentle on purpose.','Round generously and keep one accent.','Pastel text on pastel.'],
 D15:['orbit',0,'Look closer.|Dark glass, bright work.|Let the image speak.','Keep panels dark so the photo holds the colour.','Glowing chrome around the canvas.'],
 D16:['grid',1,'Measure twice.|Tolerance ±0.05.|Drawn to scale.','Align everything to the grid and label every dimension.','Rounded, decorative shapes.'],
 D17:['bubbles',0,'Let’s play!|Squishy, bright and sure.|Every tap does something.','Use chunky shadows for pressable things.','Thin hairlines and tiny type.'],
 D18:['paper',0,'Water on Thursday.|Slow growth, careful notes.|Every leaf, recorded.','Use ruled tables and pressed-specimen artwork.','Neon greens.'],
 D19:['paper',0,'What the margins know.|Set in ink.|Read it twice.','Use double rules and a drop cap sparingly.','More than one red.'],
 D20:['waves',0,'Wind down.|Colour that breathes.|Slow light for slow minds.','Keep aurora gradients behind solid cards.','Fast colour cycling.'],
 D21:['paper',0,'Spaces for a calmer world.|Less, but better.|Light, stone, silence.','Lead with one large image and a short headline.','Busy grids of thumbnails.'],
 D22:['blocks',0,'Form follows talk.|Grid. Type. Red.|Rationed colour, radical clarity.','Snap everything to a strict column grid.','Centred, decorative layouts.'],
 D23:['waves',0,'Sow in March.|Notes from the potting shed.|Grow what you love.','Use organic corners and botanical art.','Hard enterprise chrome.'],
 D24:['drift',0,'Made slowly.|Warm light, real texture.|Hold it in your hands.','Use raised controls with readable labels.','Low-contrast embossed text.'],
 D25:['drift',0,'Home, at a glance.|Clear glass, calm rooms.|Everything in its place.','Use translucent tiles over a soft ambient backdrop.','Glass on glass on glass.'],
 D26:['bubbles',0,'Mix the light.|Colour, in three dimensions.|Soft shapes, sure hands.','Use depth only for interactive objects.','3D type for body copy.'],
 D27:['bars',0,'Everything, in its tile.|Modular by default.|See the week at once.','Size tiles by importance and keep gutters even.','Every tile the same size.'],
 D28:['blocks',1,'Loud by design.|No apologies.|Buy the ticket.','Use thick borders and offset shadows.','Subtle greys.'],
 D29:['waves',0,'What’s for dinner?|Recipes with stories.|Cook together.','Pair illustrated art with clear ingredient lists.','Clip-art food.'],
 D30:['rain',1,'> Uplink locked|Carrier stable.|Stand by.','Use monospace and phosphor glow on readings only.','Glow on paragraphs.'],
 D31:['orbit',0,'Turn it up.|Chromatic and alive.|Light is the instrument.','Let one luminous gradient lead.','Neon text under 18 px.'],
 D32:['grid',0,'Measured, then shown.|Data you can defend.|Precision, made legible.','Show units and uncertainty everywhere.','3D charts.'],
 D33:['dots',0,'Ship it.|Status speaks first.|Built for builders.','Pair label colour with text.','Coloured backgrounds for whole rows.'],
 D34:['dots',0,'Apply online.|One thing per page.|Plain words, big buttons.','Ask one question per page.','Clever words when plain ones work.'],
 D35:['drift',0,'Make something.|Grey so your colour can sing.|Tools out of the way.','Keep panels neutral around the canvas.','Brand colour on every control.'],
 D36:['dots',0,'Here’s what to expect.|Clear steps, trusted service.|Built for everyone.','Show progress with a step indicator.','Hiding deadlines in small print.'],
 D37:['bars',0,'Close the deal.|Every record at a glance.|Progress, step by step.','Summarise the record in a highlights panel.','Status in colour alone.'],
 D38:['grid',0,'Certain. Efficient.|Data in, decisions out.|Admin, but pleasant.','Put the query form above the table.','More than one primary action per card.'],
 D39:['dots',0,'Get started.|Ship the page today.|Familiar on purpose.','Use the grid and utilities before custom CSS.','Overriding every default.'],
 D40:['grid',0,'Pipeline passed.|Review, approve, merge.|Make the state obvious.','Show pipeline, approvals and merge in one widget.','Burying failed jobs.'],
 D41:['grid',0,'Cluster healthy.|Status first, then action.|Open by default.','Pair status colour with an icon and a word.','Alerts that vanish.'],
 D42:['drift',0,'Take it with you.|Feels native everywhere.|One codebase, every pocket.','Use platform-native titles, lists and tab bars.','Desktop density on a phone.'],
 D43:['waves',0,'Message delivered.|Conversations, clearly.|Every reply counts.','Show delivery state on every outbound message.','Animating the log while people read.'],
 D44:['drift',0,'Time off, sorted.|Work tools that feel human.|Plain forms, friendly buttons.','Mark required fields and show balances first.','Jargon in labels.'],
 D45:['bubbles',0,'What’s next?|Plan it on the board.|Small cards, big picture.','Use badges and progress on every card.','Colour-only priority.'],
 D46:['bars',0,'You’re on track.|Money, minus the panic.|One next step.','Use tabular figures and plain-language insights.','Red for ordinary spending.'],
 D47:['riso',1,'Print fair Saturday.|Two inks. No rules.|Make it loud.','Overprint shapes, never small text.','More than two inks plus one spot colour.'],
 D48:['orbit',0,'Ask anything.|Answers with sources.|Calm intelligence.','Cite sources next to every answer.','Letting the glow imply certainty.']
};
const GF={'Public Sans':'Public+Sans:wght@400;600;700','Source Sans 3':'Source+Sans+3:wght@400;600;700','Inter':'Inter:wght@400;600;700','Red Hat Text':'Red+Hat+Text:wght@400;500&family=Red+Hat+Display:wght@500;700','Roboto':'Roboto:wght@400;500;700','Manrope':'Manrope:wght@400;600;700','Space Grotesk':'Space+Grotesk:wght@500;700','Playfair Display':'Playfair+Display:wght@600&family=Source+Serif+4:wght@400','IBM Plex Sans':'IBM+Plex+Sans:wght@400;500;600','JetBrains Mono':'JetBrains+Mono:wght@400;600'};
const HEAD={D06:"'Playfair Display', Georgia, serif",D03:"'IBM Plex Sans', system-ui, sans-serif",D08:"'JetBrains Mono', ui-monospace, monospace",D30:"ui-monospace, 'JetBrains Mono', monospace",D41:"'Red Hat Display', 'Red Hat Text', system-ui, sans-serif",D22:"'Atlas Display', 'Helvetica Neue', Arial, sans-serif",D28:"'Atlas Display', Impact, 'Arial Black', sans-serif"};
const STROKE={thin:1.25,light:1.5,regular:1.75,bold:2.25,fill:2,duotone:1.75,'hero-outline':1.5,'hero-solid':2,lucide:2,tabler:2,pixel:2,openmoji:1.75,'fluent-3d':1.75};
const SQUARE=new Set(['D03','D08','D16','D22','D28','D30','D47']);
const first=f=>String(f||'system-ui').split(',')[0].replace(/["']/g,'').trim();

function spec(e){return window.SystemAtlas?.specs?.[e.id]||{};}
function kitFor(e,tokens){const tk={...e.tokens,...(tokens||{})},d=D[e.id]||['drift',0,`${e.title.split(' / ')[0]}.|${e.rule||''}|`,e.cues||'',e.avoid||''],s=spec(e);
 const bg=tk.background,sf=tk.surface,ink=tk.ink,ac=tk.accent;
 const dark=lum(bg)<.2,mute=safe(mix(ink,sf,.45),ink,[bg,sf]),line=mix(ink,bg,dark?.78:.84);
 const accent2=safe(hue(ac,dark?-40:40),ink,[bg],3);
 const body=tk.font&&tk.font!=='system-ui'?tk.font:'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
 const head=HEAD[e.id]||(/Georgia/.test(body)?'Georgia, "Times New Roman", serif':body);
 const css=[...new Set([first(head),first(body)].map(f=>GF[f]).filter(Boolean))].map(q=>'family='+q).join('&');
 const r=Number(tk.radius)||0;
 const shadow=dark?`0 18px 40px -22px ${A(ac,.55)}`:`0 1px 2px ${A(ink,.08)}, 0 12px 28px -18px ${A(ink,.35)}`;
 return {id:e.id,no:e.id.slice(1),name:e.title.split(' / ')[0],title:e.title,tagline:s.principle||e.rule||e.desc,mood:[e.mood,e.use].filter(Boolean).join(' · '),desc:e.desc,
  fonts:{head,body,css},
  t:{bg,surface:sf,ink,mute,line,accent:ac,onAccent:onColor(ac),accent2,radius:r+'px',shadow,glow:`0 0 0 3px ${A(ac,.35)}`},
  space:tk.space||[4,8,12,16,24,32,48],controlHeight:tk.controlHeight||44,motionMs:tk.motionMs||180,
  bg:d[0],case:d[1]?'upper':'none',stroke:{w:STROKE[s.icons]||1.75,cap:SQUARE.has(e.id)?'square':'round'},
  voice:d[2].split('|').filter(Boolean),dos:[d[3],s.pattern||e.cues,s.motionRule||e.motion].filter(Boolean),donts:[d[4],'Colour alone to show state; pair it with a word or icon.','Decorative motion when reduced motion is requested.'],
  source:window.SystemPreviews?.sources?.[e.id]||null,links:s.links||[],type:s.type||''};}

/* ---------- animated backgrounds (self-contained: they only use A() and the tokens) ---------- */
const BG={
 drift(c,t,still){const x=c.getContext('2d');let W,H,raf,tt=0;const cols=[t.accent,t.accent2,t.surface,t.accent];const blobs=cols.map((col,i)=>({col,a:i*1.7,s:.00018+i*.00005,r:.42+i*.08}));
  function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,c.clientWidth*d);H=c.height=Math.max(1,c.clientHeight*d);}
  function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';blobs.forEach((b,i)=>{const px=W*(.5+.38*Math.cos(b.a+tt*b.s*6)),py=H*(.5+.34*Math.sin(b.a*1.3+tt*b.s*5)),R=Math.max(W,H)*b.r;const g=x.createRadialGradient(px,py,0,px,py,R);g.addColorStop(0,A(b.col,i===2?.55:.42));g.addColorStop(1,A(b.col,0));x.fillStyle=g;x.fillRect(0,0,W,H);});}
  size();if(still){tt=4000;draw();return()=>{};}const loop=n=>{tt=n;draw();raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect();};},
 grid(c,t,still){const x=c.getContext('2d');let W,H,raf,s,nodes=[];
  function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,c.clientWidth*d);H=c.height=Math.max(1,c.clientHeight*d);s=28*d;nodes=Array.from({length:14},()=>({i:Math.floor(Math.random()*W/s),j:Math.floor(Math.random()*H/s),p:Math.random()}));}
  function draw(n){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.strokeStyle=A(t.ink,.08);x.lineWidth=1;x.beginPath();for(let i=0;i<=W;i+=s){x.moveTo(i+.5,0);x.lineTo(i+.5,H);}for(let j=0;j<=H;j+=s){x.moveTo(0,j+.5);x.lineTo(W,j+.5);}x.stroke();
   const sweep=(n*.00006%1)*(W+H);x.strokeStyle=A(t.accent,.5);x.lineWidth=2;x.beginPath();x.moveTo(sweep,0);x.lineTo(sweep-H,H);x.stroke();
   nodes.forEach(o=>{const v=.5+.5*Math.sin(n*.002+o.p*7);x.fillStyle=A(t.accent,.25+.6*v);x.fillRect(o.i*s-3,o.j*s-3,6,6);x.strokeStyle=A(t.accent,.35*v);x.strokeRect(o.i*s-s/2,o.j*s-s/2,s,s);});}
  size();if(still){draw(2600);return()=>{};}const loop=n=>{draw(n);raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect();};},
 rain(c,t,still){const x=c.getContext('2d');let W,H,raf,cols,drops,fs,last=0;const g='01ABCDEF<>/=+';
  function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,c.clientWidth*d);H=c.height=Math.max(1,c.clientHeight*d);fs=14*d;cols=Math.ceil(W/fs);drops=Array.from({length:cols},()=>Math.random()*-H/fs);x.fillStyle=t.bg;x.fillRect(0,0,W,H);}
  function step(){x.fillStyle=A(t.bg,.14);x.fillRect(0,0,W,H);x.font=fs+'px ui-monospace,monospace';for(let i=0;i<cols;i++){const y=drops[i]*fs;x.fillStyle=Math.random()<.05?t.ink:A(t.accent,.85);x.fillText(g[Math.random()*g.length|0],i*fs,y);if(y>H&&Math.random()>.97)drops[i]=0;drops[i]+=.5;}}
  size();if(still){for(let k=0;k<140;k++)step();return()=>{};}const loop=n=>{raf=requestAnimationFrame(loop);if(n-last<50)return;last=n;step();};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect();};},
 paper(c,t,still){const x=c.getContext('2d');let W,H,raf,lines;
  function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,c.clientWidth*d);H=c.height=Math.max(1,c.clientHeight*d);const lh=22*d;lines=Array.from({length:Math.ceil(H/lh)},(_,i)=>({y:i*lh+lh*.7,w:.35+Math.random()*.5,o:Math.random()*6}));}
  function draw(n){x.fillStyle=t.bg;x.fillRect(0,0,W,H);for(let k=0;k<260;k++){const px=(Math.sin(k*91.7)*.5+.5)*W,py=(Math.cos(k*47.3)*.5+.5)*H;x.fillStyle=A(t.ink,.05);x.fillRect(px,py,1.5,1.5);}
   const p=(n*.00008)%1;lines.forEach((l,i)=>{const prog=Math.min(1,Math.max(0,(p*lines.length*1.4-i*.9+l.o*.05)));x.strokeStyle=A(t.ink,.12);x.lineWidth=2;x.beginPath();x.moveTo(W*.08,l.y);x.lineTo(W*.08+W*.84*l.w*prog,l.y);x.stroke();});
   x.fillStyle=A(t.accent,.9);x.beginPath();x.arc(W*.86,H*.22,Math.min(W,H)*.06,0,7);x.fill();x.strokeStyle=A(t.accent,.6);x.lineWidth=2;x.beginPath();x.moveTo(W*.08,H*.12);x.lineTo(W*.6,H*.12);x.stroke();}
  size();if(still){draw(9000);return()=>{};}const loop=n=>{draw(n);raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect();};},
 bars(c,t,still){const x=c.getContext('2d');let W,H,raf;const N=28,seed=Array.from({length:N},(_,i)=>Math.sin(i*1.7)*.5+.5);
  function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,c.clientWidth*d);H=c.height=Math.max(1,c.clientHeight*d);}
  function draw(n){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const bw=W/N;x.strokeStyle=A(t.ink,.08);for(let j=1;j<5;j++){x.beginPath();x.moveTo(0,H*j/5);x.lineTo(W,H*j/5);x.stroke();}
   for(let i=0;i<N;i++){const v=.25+.55*(seed[i]*.6+.4*(.5+.5*Math.sin(n*.0012+i*.6)));x.fillStyle=i%5===3?A(t.accent2,.75):A(t.accent,.7);x.fillRect(i*bw+bw*.18,H-v*H*.8,bw*.64,v*H*.8);}
   x.strokeStyle=A(t.ink,.5);x.lineWidth=2;x.beginPath();for(let i=0;i<N;i++){const v=.3+.4*(seed[(i+3)%N]*.5+.5*(.5+.5*Math.sin(n*.0009+i*.4)));const px=i*bw+bw/2,py=H-v*H*.9;i?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();}
  size();if(still){draw(1800);return()=>{};}const loop=n=>{draw(n);raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect();};},
 bubbles(c,t,still){const x=c.getContext('2d');let W,H,raf,b=[];
  function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,c.clientWidth*d);H=c.height=Math.max(1,c.clientHeight*d);const m=Math.min(W,H);b=Array.from({length:9},(_,i)=>({x:Math.random()*W,y:Math.random()*H,r:m*(.07+Math.random()*.12),p:Math.random()*6,k:i%3}));}
  function draw(n){x.fillStyle=t.bg;x.fillRect(0,0,W,H);b.forEach(o=>{const yy=o.y+Math.sin(n*.0011+o.p)*o.r*.5,xx=o.x+Math.cos(n*.0007+o.p)*o.r*.3,col=[t.accent,t.accent2,t.surface][o.k];x.fillStyle=A(t.ink,.12);x.beginPath();x.roundRect?x.roundRect(xx-o.r,yy-o.r+o.r*.18,o.r*2,o.r*2,o.r*(o.k===1?.35:1)):x.arc(xx,yy+o.r*.18,o.r,0,7);x.fill();x.fillStyle=A(col,.95);x.beginPath();x.roundRect?x.roundRect(xx-o.r,yy-o.r,o.r*2,o.r*2,o.r*(o.k===1?.35:1)):x.arc(xx,yy,o.r,0,7);x.fill();x.fillStyle=A('#ffffff',.35);x.beginPath();x.arc(xx-o.r*.35,yy-o.r*.4,o.r*.22,0,7);x.fill();});}
  size();if(still){draw(1200);return()=>{};}const loop=n=>{draw(n);raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect();};},
 blocks(c,t,still){const x=c.getContext('2d');let W,H,raf,cells,cs,cols,rows,last=0;const pal=[t.bg,t.surface,t.ink,t.accent,t.bg,t.bg];
  function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,c.clientWidth*d);H=c.height=Math.max(1,c.clientHeight*d);cs=Math.max(40,Math.min(W,H)/5);cols=Math.ceil(W/cs);rows=Math.ceil(H/cs);cells=Array.from({length:cols*rows},(_,i)=>pal[(i*7+3)%pal.length]);}
  function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);cells.forEach((col,i)=>{const cx=(i%cols)*cs,cy=Math.floor(i/cols)*cs;x.fillStyle=col;x.fillRect(cx,cy,cs,cs);});x.strokeStyle=t.ink;x.lineWidth=3;for(let i=0;i<=cols;i++){x.beginPath();x.moveTo(i*cs,0);x.lineTo(i*cs,H);x.stroke();}for(let j=0;j<=rows;j++){x.beginPath();x.moveTo(0,j*cs);x.lineTo(W,j*cs);x.stroke();}}
  size();draw();if(still)return()=>{};const loop=n=>{raf=requestAnimationFrame(loop);if(n-last<700)return;last=n;cells[Math.random()*cells.length|0]=pal[Math.random()*pal.length|0];draw();};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(()=>{size();draw();});ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect();};},
 waves(c,t,still){const x=c.getContext('2d');let W,H,raf;
  function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,c.clientWidth*d);H=c.height=Math.max(1,c.clientHeight*d);}
  function draw(n){x.fillStyle=t.bg;x.fillRect(0,0,W,H);[[t.accent2,.25,.55],[t.accent,.35,.66],[t.accent,.6,.78]].forEach(([col,a,base],k)=>{x.fillStyle=A(col,a);x.beginPath();x.moveTo(0,H);for(let i=0;i<=W;i+=8){x.lineTo(i,H*base+Math.sin(i/W*Math.PI*(2+k)+n*.0008*(k+1))*H*.06+Math.sin(i/W*9+n*.0005)*H*.015);}x.lineTo(W,H);x.fill();});
   x.fillStyle=A(t.surface,.8);x.beginPath();x.arc(W*.78,H*.26,Math.min(W,H)*.09,0,7);x.fill();}
  size();if(still){draw(2000);return()=>{};}const loop=n=>{draw(n);raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect();};},
 orbit(c,t,still){const x=c.getContext('2d');let W,H,raf;
  function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,c.clientWidth*d);H=c.height=Math.max(1,c.clientHeight*d);}
  function draw(n){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const cx=W*.68,cy=H*.48,m=Math.min(W,H);const g=x.createRadialGradient(cx,cy,0,cx,cy,m*.5);g.addColorStop(0,A(t.accent,.45));g.addColorStop(1,A(t.accent,0));x.fillStyle=g;x.fillRect(0,0,W,H);
   for(let k=1;k<=4;k++){const R=m*.11*k;x.strokeStyle=A(k%2?t.accent:t.accent2,.35);x.lineWidth=1.5;x.beginPath();x.ellipse(cx,cy,R*1.5,R,-.3,0,7);x.stroke();const a=n*.0004*(5-k)+k;x.fillStyle=k%2?t.accent:t.accent2;x.beginPath();const px=cx+Math.cos(a)*R*1.5*Math.cos(-.3)-Math.sin(a)*R*Math.sin(-.3),py=cy+Math.cos(a)*R*1.5*Math.sin(-.3)+Math.sin(a)*R*Math.cos(-.3);x.arc(px,py,m*.012+k,0,7);x.fill();}
   x.fillStyle=t.accent;x.beginPath();x.arc(cx,cy,m*.05,0,7);x.fill();}
  size();if(still){draw(3000);return()=>{};}const loop=n=>{draw(n);raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect();};},
 dots(c,t,still){const x=c.getContext('2d');let W,H,raf,s;
  function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,c.clientWidth*d);H=c.height=Math.max(1,c.clientHeight*d);s=18*d;}
  function draw(n){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const cx=W*.7,cy=H*.45,ph=n*.003;for(let i=s/2;i<W;i+=s)for(let j=s/2;j<H;j+=s){const dd=Math.hypot(i-cx,j-cy)/s,v=.5+.5*Math.sin(dd*.55-ph);x.fillStyle=v>.82?A(t.accent,.25+.6*(v-.82)/.18):A(t.ink,.1);x.beginPath();x.arc(i,j,s*(.1+.12*v),0,7);x.fill();}}
  size();if(still){draw(1000);return()=>{};}const loop=n=>{draw(n);raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect();};},
 riso(c,t,still){const x=c.getContext('2d');let W,H,raf;const shapes=[[t.accent,.8,0],['#2c5fd1',.65,1],['#f0c419',.7,2],[t.accent,.5,1]];
  function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,c.clientWidth*d);H=c.height=Math.max(1,c.clientHeight*d);}
  function draw(n){x.globalCompositeOperation='source-over';x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.globalCompositeOperation='multiply';const m=Math.min(W,H);shapes.forEach(([col,a,k],i)=>{const px=W*(.3+.5*((i*.37+n*.00004*(i+1))%1)),py=H*(.3+.4*Math.sin(n*.0004+i*2));x.fillStyle=A(col,a);x.save();x.translate(px,py);x.rotate(n*.0002*(i%2?1:-1)+i);x.beginPath();k===0?x.arc(0,0,m*.24,0,7):k===1?x.rect(-m*.32,-m*.1,m*.64,m*.2):(x.moveTo(0,-m*.2),x.lineTo(m*.2,m*.16),x.lineTo(-m*.2,m*.16),x.closePath());x.fill();x.restore();});
   x.globalCompositeOperation='source-over';for(let k=0;k<500;k++){x.fillStyle=A(t.ink,.06);x.fillRect((Math.sin(k*12.9)*.5+.5)*W,(Math.cos(k*78.2)*.5+.5)*H,2,2);}}
  size();if(still){draw(5000);return()=>{};}const loop=n=>{draw(n);raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect();};}
};

/* ---------- SVG assets ---------- */
const ICONS={home:'M4 11 12 4l8 7M6 9.5V20h12V9.5M10 20v-5h4v5',search:'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20',user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0',settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',heart:'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z',arrow:'M4 12h15M13 6l6 6-6 6',play:'M7 5v14l12-7z',download:'M12 4v11M7 10l5 5 5-5M5 20h14',mail:'M3.5 6h17v12h-17zM3.5 6l8.5 7 8.5-7',star:'M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.4 9.7l6-.7z',lock:'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',chat:'M4 5h16v11H9l-5 4z',bell:'M6 16v-5a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0',folder:'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',calendar:'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',check:'M5 12l4.5 4.5L19 7'};
/* Library-name aliases so the hub's Phosphor-named icons can fall back to the kit set. */
const ALIAS={house:'home','magnifying-glass':'search',gear:'settings','bookmark-simple':'star','calendar-blank':'calendar','check-circle':'check',plus:'arrow','upload-simple':'download','squares-four':'folder'};
function icon(k,name,size=24,color){const s=k.stroke,join=s.cap==='round'?'round':'miter';return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color||k.t.ink}" stroke-width="${s.w}" stroke-linecap="${s.cap}" stroke-linejoin="${join}"><path d="${ICONS[name]||ICONS[ALIAS[name]]||ICONS.star}"/></svg>`;}
function mark(k){const t=k.t,r=parseFloat(t.radius)||0,n=num(k.id),L=esc(k.name.replace(/[^A-Za-z]/g,'')[0]||'A');const shape=k.case==='upper'?`<rect x="6" y="6" width="52" height="52" fill="${t.accent}"/>`:r>=14?`<circle cx="32" cy="32" r="26" fill="${t.accent}"/>`:r>=6?`<rect x="6" y="6" width="52" height="52" rx="${Math.min(18,r+4)}" fill="${t.accent}"/>`:`<path d="M32 4 60 32 32 60 4 32z" fill="${t.accent}"/>`;
 const ornament=[`<circle cx="48" cy="16" r="6" fill="${t.accent2}"/>`,`<path d="M10 54h44" stroke="${t.accent2}" stroke-width="4"/>`,`<rect x="40" y="40" width="16" height="16" fill="${t.accent2}" opacity=".9"/>`,`<path d="M8 8l12 0 0 12" fill="none" stroke="${t.onAccent}" stroke-width="3"/>`][n%4];
 const ff=first(k.fonts.head);return `${shape}${ornament}<text x="32" y="${k.case==='upper'?42:43}" text-anchor="middle" fill="${t.onAccent}" font-family="${esc(ff)}, sans-serif" font-size="30" font-weight="700">${L}</text>`;}
function logo(k,dark){const t=k.t,name=k.case==='upper'?k.name.toUpperCase():k.name,w=Math.max(240,name.length*19+104);return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="80" viewBox="0 0 ${w} 80"><rect width="${w}" height="80" fill="${dark?t.bg:'none'}"/><g transform="translate(8 8)">${mark(k)}</g><text x="86" y="50" fill="${t.ink}" font-family="${esc(first(k.fonts.head))}, sans-serif" font-size="28" font-weight="600" letter-spacing="${k.case==='upper'?2:0}">${esc(name)}</text></svg>`;}
function pattern(k){const t=k.t,by={grid:`<path d="M0 .5H80M.5 0V80" stroke="${t.line}"/><circle cx="40" cy="40" r="2.5" fill="${t.accent}"/>`,dots:`<circle cx="20" cy="20" r="3" fill="${t.line}"/><circle cx="60" cy="60" r="3" fill="${t.line}"/><circle cx="60" cy="20" r="3" fill="${t.accent}"/>`,paper:`<path d="M10 20h44M10 32h60M10 44h36M10 56h52" stroke="${t.line}" stroke-width="2"/><circle cx="66" cy="20" r="4" fill="${t.accent}"/>`,waves:`<path d="M0 40c13-12 27 12 40 0s27 12 40 0" fill="none" stroke="${t.accent}" stroke-width="2.5"/><path d="M0 60c13-12 27 12 40 0s27 12 40 0" fill="none" stroke="${t.line}" stroke-width="2"/>`,bubbles:`<circle cx="22" cy="24" r="12" fill="${t.accent}"/><rect x="44" y="44" width="24" height="24" rx="8" fill="${t.accent2}"/>`,blocks:`<rect width="40" height="40" fill="${t.ink}"/><rect x="40" y="40" width="40" height="40" fill="${t.accent}"/>`,rain:`<text x="8" y="22" fill="${t.accent}" font-family="monospace" font-size="12">01</text><text x="44" y="52" fill="${t.line}" font-family="monospace" font-size="12">10</text><text x="20" y="72" fill="${t.accent}" font-family="monospace" font-size="12">1</text>`,orbit:`<ellipse cx="40" cy="40" rx="30" ry="14" fill="none" stroke="${t.accent}" stroke-width="1.5"/><circle cx="40" cy="40" r="6" fill="${t.accent}"/>`,drift:`<circle cx="26" cy="30" r="20" fill="${t.accent}" opacity=".35"/><circle cx="56" cy="54" r="16" fill="${t.accent2}" opacity=".35"/>`,bars:`<rect x="10" y="40" width="10" height="30" fill="${t.accent}"/><rect x="30" y="24" width="10" height="46" fill="${t.accent}" opacity=".7"/><rect x="50" y="50" width="10" height="20" fill="${t.accent2}"/>`,riso:`<circle cx="30" cy="34" r="18" fill="${t.accent}" opacity=".8"/><rect x="30" y="38" width="40" height="16" fill="#2c5fd1" opacity=".7" transform="rotate(-12 50 46)"/>`};
 return `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="${t.bg}"/>${by[k.bg]||by.dots}</svg>`;}
function divider(k){const t=k.t,by={blocks:`<rect y="6" width="400" height="12" fill="${t.ink}"/><rect width="120" y="6" height="12" fill="${t.accent}"/>`,paper:`<path d="M0 10h400M0 14h400" stroke="${t.ink}" stroke-width="1"/><circle cx="200" cy="12" r="4" fill="${t.accent}"/>`,grid:`<path d="M0 12h400M0 4v16M400 4v16M200 6v12" stroke="${t.ink}" stroke-opacity=".5"/><rect x="196" y="8" width="8" height="8" fill="${t.accent}"/>`,rain:`<text x="0" y="17" fill="${t.accent}" font-family="monospace" font-size="13">0100 1101 0100 0001 0101 0100 0101 0010 0100 1001</text>`,waves:`<path d="M0 12c25-10 50 10 75 0s50 10 75 0 50 10 75 0 50 10 75 0 50 10 100 0" fill="none" stroke="${t.accent}" stroke-width="2"/>`,riso:`<rect y="4" width="260" height="10" fill="${t.accent}" opacity=".85"/><rect x="140" y="10" width="260" height="10" fill="#2c5fd1" opacity=".7"/>`};
 return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="24" viewBox="0 0 400 24">${by[k.bg]||`<path d="M0 12h170M230 12h170" stroke="${t.line}" stroke-width="2"/><circle cx="200" cy="12" r="5" fill="${t.accent}"/><circle cx="184" cy="12" r="2" fill="${t.accent2}"/><circle cx="216" cy="12" r="2" fill="${t.accent2}"/>`}</svg>`;}

/* ---------- token files ---------- */
const slug=k=>k.id.toLowerCase()+'-'+k.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function cssVars(k){const t=k.t;return `:root{
  /* ${k.title} (${k.id}) · Visual & Motion Atlas */
  --ds-bg:${t.bg};
  --ds-surface:${t.surface};
  --ds-ink:${t.ink};
  --ds-mute:${t.mute};
  --ds-line:${t.line};
  --ds-accent:${t.accent};
  --ds-on-accent:${t.onAccent};
  --ds-accent-2:${t.accent2};
  --ds-radius:${t.radius};
  --ds-shadow:${t.shadow};
  --ds-focus:${t.glow};
  --ds-font-head:${k.fonts.head};
  --ds-font-body:${k.fonts.body};
  --ds-case:${k.case==='upper'?'uppercase':'none'};
  --ds-control-height:${k.controlHeight}px;
  --ds-motion:${k.motionMs}ms;
${k.space.map((v,i)=>`  --ds-space-${i+1}:${v}px;`).join('\n')}
}`;}
function tokensCSS(k){return `/* ${k.title} (${k.id}) tokens · Visual & Motion Atlas */
${k.fonts.css?`@import url('https://fonts.googleapis.com/css2?${k.fonts.css}&display=swap');\n`:''}${cssVars(k)}
*{box-sizing:border-box}
body{margin:0;background:var(--ds-bg);color:var(--ds-ink);font:16px/1.55 var(--ds-font-body)}
h1,h2,h3{font-family:var(--ds-font-head);text-transform:var(--ds-case);line-height:1.1}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:var(--ds-control-height);padding:0 20px;border:1px solid var(--ds-accent);border-radius:var(--ds-radius);background:var(--ds-accent);color:var(--ds-on-accent);font:600 15px/1 var(--ds-font-body);text-transform:var(--ds-case);cursor:pointer;text-decoration:none;transition:box-shadow var(--ds-motion),transform var(--ds-motion)}
.btn:hover{transform:translateY(-1px)}
.btn.ghost{background:var(--ds-surface);color:var(--ds-ink);border-color:var(--ds-line)}
.btn:focus-visible,.field:focus-visible{outline:none;box-shadow:var(--ds-focus)}
.card{background:var(--ds-surface);border:1px solid var(--ds-line);border-radius:var(--ds-radius);padding:var(--ds-space-5,24px);box-shadow:var(--ds-shadow)}
.field{width:100%;min-height:var(--ds-control-height);padding:0 12px;border:1px solid var(--ds-mute);border-radius:var(--ds-radius);background:var(--ds-surface);color:var(--ds-ink);font:inherit}
.badge{display:inline-block;padding:2px 10px;border-radius:999px;background:color-mix(in srgb,var(--ds-accent) 16%,var(--ds-surface));color:var(--ds-ink);font-size:13px;font-weight:600}
.muted{color:var(--ds-mute)}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;}
function tokensJSON(k){const t=k.t,c=(v,d)=>({$value:v,$type:'color',...(d?{$description:d}:{})});return JSON.stringify({$schema:'https://design-tokens.github.io/community-group/format/',$description:`${k.title} (${k.id}) · Visual & Motion Atlas. ${k.source?k.source[0]+'. '+k.source[1]:'Original atlas system.'}`,
 color:{background:c(t.bg),surface:c(t.surface),ink:c(t.ink,'Body text'),mute:c(t.mute,'Secondary text, AA on background and surface'),line:c(t.line,'Borders and dividers'),accent:c(t.accent,'Primary action'),onAccent:c(t.onAccent,'Text on the accent'),accent2:c(t.accent2,'Supporting accent')},
 font:{heading:{$value:k.fonts.head,$type:'fontFamily'},body:{$value:k.fonts.body,$type:'fontFamily'}},
 radius:{$value:t.radius,$type:'dimension'},controlHeight:{$value:k.controlHeight+'px',$type:'dimension'},
 space:Object.fromEntries(k.space.map((v,i)=>[String(i+1),{$value:v+'px',$type:'dimension'}])),
 motion:{duration:{$value:k.motionMs+'ms',$type:'duration'},easing:{$value:[0.2,0,0,1],$type:'cubicBezier'}},
 shadow:{$value:t.shadow,$type:'shadow'},
 $extensions:{'atlas.contrast':contrast(k).map(r=>({pair:r.label,ratio:+r.ratio.toFixed(2),grade:r.grade})),'atlas.textCase':k.case,'atlas.iconStroke':k.stroke}},null,2);}
function tokensSCSS(k){const t=k.t;return `// ${k.title} (${k.id}) · Visual & Motion Atlas
$ds-bg: ${t.bg};
$ds-surface: ${t.surface};
$ds-ink: ${t.ink};
$ds-mute: ${t.mute};
$ds-line: ${t.line};
$ds-accent: ${t.accent};
$ds-on-accent: ${t.onAccent};
$ds-accent-2: ${t.accent2};
$ds-radius: ${t.radius};
$ds-shadow: ${t.shadow};
$ds-font-head: ${k.fonts.head};
$ds-font-body: ${k.fonts.body};
$ds-control-height: ${k.controlHeight}px;
$ds-motion: ${k.motionMs}ms;
$ds-space: (${k.space.map((v,i)=>`${i+1}: ${v}px`).join(', ')});
`;}
function tailwind(k){const t=k.t;return `/* ${k.title} (${k.id}) Tailwind preset · Visual & Motion Atlas
   Use: module.exports = { presets: [require('./tailwind.preset.js')], content: [...] } */
module.exports = {
  theme: {
    extend: {
      colors: {
        ds: {
          bg: '${t.bg}', surface: '${t.surface}', ink: '${t.ink}', mute: '${t.mute}', line: '${t.line}',
          accent: '${t.accent}', 'on-accent': '${t.onAccent}', accent2: '${t.accent2}'
        }
      },
      borderRadius: { ds: '${t.radius}' },
      fontFamily: { head: ${JSON.stringify(k.fonts.head.split(',').map(s=>s.trim().replace(/^["']|["']$/g,'')))}, body: ${JSON.stringify(k.fonts.body.split(',').map(s=>s.trim().replace(/^["']|["']$/g,'')))} },
      spacing: { ${k.space.map((v,i)=>`'ds-${i+1}': '${v}px'`).join(', ')} },
      height: { control: '${k.controlHeight}px' },
      boxShadow: { ds: '${t.shadow}', focus: '${t.glow}' },
      transitionDuration: { ds: '${k.motionMs}ms' }
    }
  }
};
`;}
function bgJS(k){return `/* ${k.title} (${k.id}) animated background · Visual & Motion Atlas
   startBackground(canvas, still) draws on the canvas and returns a stop() function.
   Pass still=true for a single frame (use it under prefers-reduced-motion). */
(function(){var T=${JSON.stringify(k.t)};
var hex=${hex.toString()};
var A=${A.toString()};
var draw=${BG[k.bg].toString().replace(/^\w+\(/,'function(')};
window.startBackground=function(canvas,still){return draw(canvas,T,!!still)};})();
`;}
function demoHTML(k){return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(k.name)} kit demo</title><link rel="stylesheet" href="tokens.css"><style>
.hero{position:relative;min-height:70vh;display:grid;align-items:end;padding:6vw;overflow:hidden;isolation:isolate}.hero canvas{position:absolute;inset:0;width:100%;height:100%;z-index:-2}.hero::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,var(--ds-bg) 0,color-mix(in srgb,var(--ds-bg) 75%,transparent) 50%,transparent 85%)}
.hero h1{font-size:clamp(40px,7vw,96px);margin:16px 0;max-width:14ch}.hero p{max-width:44ch;font-size:19px}.row{display:flex;gap:12px;flex-wrap:wrap}
main{padding:6vw;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}.pause{position:absolute;top:20px;right:20px}label{display:grid;gap:6px;font-weight:600}</style></head><body>
<section class="hero"><canvas id="bg" aria-hidden="true"></canvas><button class="btn ghost pause" id="p">Pause</button><img src="svg/logo.svg" alt="${esc(k.name)}" height="56"><h1>${esc(k.voice[0]||k.name)}</h1><p>${esc(k.tagline)}</p><div class="row"><a class="btn" href="#">Get started</a><a class="btn ghost" href="#">Learn more</a></div></section>
<main><div class="card"><h3>Card</h3><p class="muted">Surfaces, borders and shadows come from tokens.css.</p><span class="badge">New</span></div><div class="card"><label for="e">Email<input id="e" class="field" placeholder="you@example.com"></label></div><div class="card"><h3>Icons</h3><img src="svg/icons/home.svg" alt="" width="24"> <img src="svg/icons/search.svg" alt="" width="24"> <img src="svg/icons/heart.svg" alt="" width="24"></div></main>
<script src="background.js"><\/script><script>var c=document.getElementById('bg'),still=matchMedia('(prefers-reduced-motion: reduce)').matches,stop=startBackground(c,still),on=!still,p=document.getElementById('p');p.textContent=on?'Pause':'Play';p.onclick=function(){stop();on=!on;stop=startBackground(c,!on);p.textContent=on?'Pause':'Play'};<\/script></body></html>`;}
function readme(k,full){const src=k.source;return `# ${k.title} (${k.id})

${k.tagline}

From the Visual & Motion Atlas design-system library: https://motionatlas-ten.vercel.app/atlas#systems?id=${k.id}

## Files
- tokens.css: CSS custom properties (--ds-*) plus small base components (.btn, .card, .field, .badge)
- tokens.json: the same tokens in Design Tokens Community Group format
${full?`- tokens.scss: Sass variables
- tailwind.preset.js: a Tailwind CSS preset
- background.js: the animated background, startBackground(canvas, still)
- demo.html: open it to see the kit working
- prompt.txt: a build prompt for this system
- svg/: logo, logo on background, mark, pattern tile, divider and ${Object.keys(ICONS).length} icons
`:''}
## Contrast (WCAG 2.2)
${contrast(k).map(r=>`- ${r.label}: ${r.ratio.toFixed(2)}:1 (${r.grade})`).join('\n')}

## Source and licence
${src?`${src[0]}. ${src[1]}\n${/^https?:/.test(src[2])?src[2]:''}`:'Original atlas system. The tokens and generated assets in this kit are free to use.'}
Fonts: ${[...new Set([first(k.fonts.head),first(k.fonts.body)])].join(' and ')}${k.fonts.css?' (Google Fonts, SIL Open Font Licence)':' (system or local fonts)'}.
Logos and marks in svg/ are generated placeholders for your own product, not the publisher's brand.
`;}
function promptText(k){const t=k.t;return `Design and build an interface in the "${k.title}" design system (${k.id}). ${k.tagline}
Mood: ${k.mood}.
Colours: background ${t.bg}, surfaces ${t.surface}, text ${t.ink}, muted text ${t.mute}, lines ${t.line}, accent ${t.accent} (text on accent ${t.onAccent}), second accent ${t.accent2}.
Type: headings in ${first(k.fonts.head)}${k.case==='upper'?' set in capitals':''}, body in ${first(k.fonts.body)}. Corner radius ${t.radius}. Controls ${k.controlHeight}px high. Spacing ${k.space.join('/')} px. Motion ${k.motionMs} ms.
Pattern: ${k.dos[1]||''}
Voice: ${k.voice.join(' / ')}
Do: ${k.dos.join(' ')}
Avoid: ${k.donts.join(' ')}
Keep text contrast at WCAG AA and make every control keyboard-accessible; provide a reduced-motion state.`;}
function contrast(k){const t=k.t;return [['Text on background',t.ink,t.bg],['Text on surface',t.ink,t.surface],['Muted text on background',t.mute,t.bg],['Accent on background',t.accent,t.bg],['Label on accent',t.onAccent,t.accent]].map(([label,a,b])=>{const r=ratio(a,b);return {label,a,b,ratio:r,grade:grade(r)};});}

/* ---------- ZIP (stored) ---------- */
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc32(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRC[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;}
function zipOwn(files){const enc=new TextEncoder(),parts=[],central=[];let off=0;const d=new Date(),time=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),date=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate();
 for(const [name,data] of files){const n=enc.encode(name),b=typeof data==='string'?enc.encode(data):data,crc=crc32(b);
  const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint16(10,time,true);h.setUint16(12,date,true);h.setUint32(14,crc,true);h.setUint32(18,b.length,true);h.setUint32(22,b.length,true);h.setUint16(26,n.length,true);h.setUint16(28,0,true);parts.push(new Uint8Array(h.buffer),n,b);
  const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(10,0,true);c.setUint16(12,time,true);c.setUint16(14,date,true);c.setUint32(16,crc,true);c.setUint32(20,b.length,true);c.setUint32(24,b.length,true);c.setUint16(28,n.length,true);c.setUint16(30,0,true);c.setUint16(32,0,true);c.setUint16(34,0,true);c.setUint16(36,0,true);c.setUint32(38,0,true);c.setUint32(42,off,true);central.push(new Uint8Array(c.buffer),n);off+=30+n.length+b.length;}
 const size=central.reduce((s,a)=>s+a.length,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,size,true);e.setUint32(16,off,true);return new Blob([...parts,...central,new Uint8Array(e.buffer)],{type:'application/zip'});}
const zip=files=>(window.ThemeKits&&typeof ThemeKits.zip==='function')?ThemeKits.zip(files):zipOwn(files);
function save(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);}
const say=m=>{if(typeof window.toast==='function')window.toast(m);else{const s=$('#systemKitStatus');if(s)s.textContent=m;}const s=$('#systemKitStatus');if(s)s.textContent=m;};
function tokenFiles(k){return [['README.md',readme(k,false)],['tokens.css',tokensCSS(k)],['tokens.json',tokensJSON(k)]];}
function kitFiles(k){return [['README.md',readme(k,true)],['tokens.css',tokensCSS(k)],['tokens.json',tokensJSON(k)],['tokens.scss',tokensSCSS(k)],['tailwind.preset.js',tailwind(k)],['background.js',bgJS(k)],['demo.html',demoHTML(k)],['prompt.txt',promptText(k)],
 ['svg/logo.svg',logo(k,false)],['svg/logo-on-background.svg',logo(k,true)],['svg/mark.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">${mark(k)}</svg>`],['svg/pattern.svg',pattern(k)],['svg/divider.svg',divider(k)],...Object.keys(ICONS).map(n=>['svg/icons/'+n+'.svg',icon(k,n)])];}
function downloadTokens(e,tokens){const k=kitFor(e,tokens);save(zip(tokenFiles(k)),slug(k)+'-tokens.zip');say('Downloaded '+slug(k)+'-tokens.zip');}
function downloadKit(e,tokens){const k=kitFor(e,tokens);save(zip(kitFiles(k)),slug(k)+'-kit.zip');say('Downloaded '+slug(k)+'-kit.zip');}
async function copyVars(e,tokens){const text=cssVars(kitFor(e,tokens));try{await navigator.clipboard.writeText(text);say('CSS variables copied.');}catch{const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('aria-hidden','true');ta.style.cssText='position:fixed;left:-9999px';document.body.append(ta);ta.select();try{document.execCommand('copy');say('CSS variables copied.');}catch{say('Copy failed. Download the tokens instead.');}ta.remove();}}

/* ---------- canvas lifecycle: animate only visible canvases ---------- */
const live=new Map();let io=null;
function mount(canvas,k){if(!canvas)return;canvas._kit=k;try{canvas._stop?.();}catch{}canvas._stop=BG[k.bg](canvas,k.t,true);
 if(reduce()||canvas.dataset.paused==='true')return;
 io=io||new IntersectionObserver(es=>es.forEach(en=>{const c=en.target;try{c._stop?.();}catch{}c._stop=BG[c._kit.bg](c,c._kit.t,!en.isIntersecting||reduce()||c.dataset.paused==='true');}),{threshold:.05});io.observe(canvas);live.set(canvas,1);}
function unmountAll(root){(root?[...root.querySelectorAll('canvas[data-kitbg]')]:[...live.keys()]).forEach(c=>{try{c._stop?.();}catch{}io?.unobserve(c);live.delete(c);});}

/* ---------- kit view ---------- */
const kitVars=k=>{const t=k.t;return `--k-bg:${t.bg};--k-surface:${t.surface};--k-ink:${t.ink};--k-mute:${t.mute};--k-line:${t.line};--k-accent:${t.accent};--k-on:${t.onAccent};--k-accent2:${t.accent2};--k-radius:${t.radius};--k-shadow:${t.shadow};--k-glow:${t.glow};--k-head:${k.fonts.head};--k-body:${k.fonts.body};--k-case:${k.case==='upper'?'uppercase':'none'};--k-ch:${k.controlHeight}px`;};
const loadedFonts=new Set();function loadFonts(k){if(!k.fonts.css||loadedFonts.has(k.fonts.css))return;loadedFonts.add(k.fonts.css);const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?'+k.fonts.css+'&display=swap';document.head.append(l);}
function componentSheet(k){const ic=n=>icon(k,n,18,'currentColor').replace('<svg ','<svg aria-hidden="true" ');const id=k.id.toLowerCase();return `<div class="kComp">
 <section><h4>Buttons</h4><div class="kRow"><button type="button" class="kBtn" data-kit-say="Primary action selected.">${ic('arrow')}Primary</button><button type="button" class="kBtn ghost" data-kit-say="Secondary action selected.">Secondary</button><button type="button" class="kBtn" disabled>Disabled</button></div></section>
 <section><h4>Fields</h4><label class="kLabel" for="${id}-kf1">Project name</label><input class="kField" id="${id}-kf1" value="Garden journal"><label class="kLabel" for="${id}-kf2">Status</label><select class="kField" id="${id}-kf2"><option>In review</option><option>Planning</option><option>Shipped</option></select></section>
 <section><h4>Choices</h4><label class="kCheck"><input type="checkbox" checked> Email me updates</label><label class="kCheck"><input type="radio" name="${id}-kr" checked> Weekly</label><label class="kCheck"><input type="radio" name="${id}-kr"> Monthly</label><label class="kCheck kSwitch"><input type="checkbox" role="switch" checked> Focus mode</label></section>
 <section><h4>Navigation</h4><div class="kTabs" role="tablist" aria-label="Sample tabs"><button type="button" role="tab" aria-selected="true">Overview</button><button type="button" role="tab" aria-selected="false" tabindex="-1">Library</button><button type="button" role="tab" aria-selected="false" tabindex="-1">Activity</button></div><nav class="kCrumb" aria-label="Sample breadcrumb"><a href="#systems?id=${k.id}">Projects</a> / <span>Garden journal</span></nav></section>
 <section><h4>Feedback</h4><div class="kAlert" role="note">${ic('bell')}<span><b>Saved.</b> Your direction is ready to share.</span></div><div class="kProg" role="progressbar" aria-label="Completion" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100"><i style="width:64%"></i></div><p class="kSmall">64% complete · <span class="kBadge">New</span> <span class="kBadge ok">Ready</span></p></section>
 <section><h4>Card</h4><article class="kCard"><small>PROJECT / 024</small><b>Garden journal</b><p>Three references. One clear direction.</p><button type="button" class="kBtn" data-kit-say="Project opened in this sample.">Open project</button></article></section>
</div><p class="kStatus" role="status" aria-live="polite"></p>`;}
function kitView(e,tokens){const k=kitFor(e,tokens);loadFonts(k);const t=k.t,logoURL=svgURL(logo(k,false)),patURL=svgURL(pattern(k)),divURL=svgURL(divider(k));
 const swatches=[['Background','bg'],['Surface','surface'],['Text','ink'],['Muted text','mute'],['Lines','line'],['Accent','accent'],['On accent','onAccent'],['Accent 2','accent2']].map(([n,key])=>{const c=t[key],r=ratio(c,key==='bg'?t.ink:t.bg);return `<button type="button" class="kChip" data-kit-copy="${c}" aria-label="Copy ${n} ${c}"><i style="background:${c}"></i><span><b>${n}</b><code>${c}</code><small>${key==='bg'?'vs text':'vs background'} ${r.toFixed(1)}:1 · ${grade(r)}</small></span></button>`;}).join('');
 const scale=[['Display',44,700],['Heading 1',32,650],['Heading 2',24,600],['Body',16,400],['Small',14,400],['Caption',12,500]];
 const screen=window.SystemPreviews?.render?SystemPreviews.render({...e,tokens:{...e.tokens,...(tokens||{})}},true):null;
 return `<div class="kitView" style="${kitVars(k)}" data-kit="${k.id}">
 <section class="kHero"><canvas data-kitbg aria-hidden="true"></canvas><button type="button" class="kPause" data-kit-pause aria-pressed="false" aria-label="Pause the background">${reduce()?'Play':'Pause'}</button>
  <div class="kIn"><img class="kLogo" src="${logoURL}" alt="${esc(k.name)} logo (generated)"><p class="kNo">KIT ${k.no} · ${esc(k.source?'Open-source interpretation':'Original atlas system')}</p><h3 class="kTitle">${esc(k.voice[0]||k.name)}</h3><p class="kTag">${esc(k.tagline)}</p>
  <div class="kRow"><button type="button" class="kBtn" data-kit-download="${k.id}">${icon(k,'download',18,'currentColor').replace('<svg ','<svg aria-hidden="true" ')}Download kit ZIP</button><button type="button" class="kBtn ghost" data-kit-tokens="${k.id}">Tokens ZIP</button><button type="button" class="kBtn ghost" data-kit-vars="${k.id}">Copy CSS variables</button></div></div></section>
 <section class="kSec"><h3>Colour</h3><p class="kLede">Contrast is measured against the background (WCAG 2.2). Select a swatch to copy it.</p><div class="kSw">${swatches}</div></section>
 <section class="kSec kTwo"><div><h3>Type</h3><p class="kLede">${esc(k.type||first(k.fonts.body))}</p><div class="kScale">${scale.map(([n,s,w],i)=>`<p style="font:${w} ${s}px/1.15 ${i<3?'var(--k-head)':'var(--k-body)'};${i<3&&k.case==='upper'?'text-transform:uppercase':''}"><small>${n} · ${s}px</small>${i<3?esc(k.name):'Interfaces that explain themselves.'}</p>`).join('')}</div></div>
  <div><h3>Spacing &amp; shape</h3><div class="kSpace">${k.space.map(v=>`<span><i style="width:${Math.min(v,64)}px"></i>${v}px</span>`).join('')}</div><p class="kSmall">Radius ${t.radius} · control height ${k.controlHeight}px · motion ${k.motionMs}ms · icon stroke ${k.stroke.w}px ${k.stroke.cap}</p></div></section>
 <section class="kSec"><h3>Components</h3><p class="kLede">Native controls styled only from this kit’s tokens.</p>${componentSheet(k)}</section>
 ${screen?`<section class="kSec"><h3>Product screen</h3><p class="kLede">The system applied to a full screen. Change the accent in the workbench to recolour it.</p><div class="kScreen">${screen}</div></section>`:''}
 <section class="kSec"><h3>Brand assets</h3><p class="kLede">Generated mark, logo, icons, pattern and divider for your own product, included as SVG in the kit ZIP. They are not the publisher’s brand.</p>
  <div class="kAssets"><figure><span class="kMark">${`<svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true">${mark(k)}</svg>`}</span><figcaption>Mark</figcaption></figure><figure><img src="${svgURL(logo(k,true))}" alt="" height="56"><figcaption>Logo on background</figcaption></figure><figure><span class="kPat" style="background-image:url('${patURL}')"></span><figcaption>Pattern tile</figcaption></figure></div>
  <img class="kDiv" src="${divURL}" alt="" width="400" height="24"><div class="kIcons">${Object.keys(ICONS).map(n=>`<span title="${n}">${icon(k,n,26).replace('<svg ','<svg aria-hidden="true" ')}<small>${n}</small></span>`).join('')}</div></section>
 <section class="kSec kTwo"><div><h3>Voice</h3>${k.voice.map(v=>`<p class="kVoice">“${esc(v)}”</p>`).join('')}<p class="kSmall">${esc(k.mood)}</p></div><div class="kDo"><div><h4>Do</h4><ul>${k.dos.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h4>Don’t</h4><ul>${k.donts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div></section>
</div>`;}

/* ---------- hub: token bar + contrast + Kit tab ---------- */
function current(){return window.AtlasExpansion?.system||null;}
function bar(){const e=current();const host=$('#systemKitBar');if(!e||!host)return;const k=kitFor(e,e.tokens),rows=contrast(k);
 host.innerHTML=`<div class="skActions"><button type="button" class="secondary" data-kit-tokens="${e.id}">Download tokens (CSS + JSON)</button><button type="button" class="secondary" data-kit-vars="${e.id}">Copy CSS variables</button><button type="button" class="secondary" data-kit-download="${e.id}">Download full kit ZIP</button><button type="button" class="quiet" data-kit-open="${e.id}">Open the kit →</button></div>
 <div class="skContrast" aria-label="Contrast check"><p class="cardcode">Contrast check · WCAG 2.2</p><ul>${rows.map(r=>`<li class="sk-${r.grade.replace(/\s/g,'').toLowerCase()}"><span class="skPair"><i style="background:${r.b}"><b style="color:${r.a}">Aa</b></i>${r.label}</span><b>${r.ratio.toFixed(2)}:1</b><em>${r.grade}</em></li>`).join('')}</ul></div><p id="systemKitStatus" class="skStatus" role="status" aria-live="polite"></p>`;}
function ensureHubChrome(){const tabs=$('#systemHubTabs');if(tabs&&!tabs.querySelector('[data-hub-tab="kit"]')){const b=document.createElement('button');b.dataset.hubTab='kit';b.setAttribute('aria-pressed','false');b.textContent='Kit';const ov=tabs.querySelector('[data-hub-tab="overview"]');ov?ov.after(b):tabs.append(b);}
 if(!$('#systemKitBar')&&tabs){const d=document.createElement('section');d.id='systemKitBar';d.className='systemKitBar';d.setAttribute('aria-label','Tokens and contrast');tabs.before(d);}}

/* Missing icon files: the hub draws library icons by file; fall back to inline kit icons for files
   that are not in /icons so nothing 404s. */
const HAVE=new Set('duotone/folder duotone/gear duotone/heart duotone/house fill/bell fill/folder fill/gear fill/heart fill/house fill/squares-four fluent-3d/folder fluent-3d/gear fluent-3d/heart fluent-3d/house hero-outline/bell hero-outline/squares-four lucide/bell lucide/squares-four openmoji/folder openmoji/gear openmoji/heart openmoji/house pixel/folder pixel/gear pixel/heart pixel/house regular/bell regular/bookmark-simple regular/calendar-blank regular/check-circle regular/folder regular/gear regular/heart regular/house regular/magnifying-glass regular/plus regular/squares-four regular/upload-simple regular/user tabler/bell tabler/squares-four thin/bell thin/squares-four'.split(' '));
function patchIcons(){const S=window.SpecimenAtlas;if(!S||!S.icon||S.icon.__kit)return !!S?.icon?.__kit;const orig=S.icon.bind(S);
 S.icon=function(name='house',family='regular'){if(HAVE.has(family+'/'+name))return orig(name,family);if(HAVE.has('regular/'+name)&&!/^(fill|duotone|pixel|openmoji|fluent-3d|hero-solid)$/.test(family))return orig(name,'regular');const w=STROKE[family]||1.75,fill=/fill|solid/.test(family);return `<svg class="libraryIcon" viewBox="0 0 24 24" width="24" height="24" fill="${fill?'currentColor':'none'}" fill-opacity="${fill?.18:0}" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${ICONS[ALIAS[name]||name]||ICONS.star}"/></svg>`;};S.icon.__kit=true;return true;}

/* ---------- catalogue: filters, counts and the Kits view ---------- */
const GROUPS={inspired:n=>n<9,material:n=>n>=9&&n<=20,original:n=>(n>=9&&n<=32)||n>=46,open:n=>n>=33&&n<=45};
let view='cards';try{view=localStorage.getItem('atlas.systemView')==='kits'?'kits':'cards';}catch{}
function systemItems(){const q=($('#guideSearch')?.value||'').toLowerCase(),col=$('#guideCollection')?.value||'all';return (window.catalogue||[]).filter(e=>e.id[0]==='D'&&[e.title,e.desc,e.tags].join(' ').toLowerCase().includes(q)&&(col==='all'||(col==='reference'?!!e.guide?.reference:(GROUPS[col]||GROUPS.inspired)(num(e.id)))));}
function tile(e){const k=kitFor(e);loadFonts(k);const t=k.t;return `<article class="kitTile" style="${kitVars(k)}"><div class="ktArt"><canvas data-kitbg aria-hidden="true"></canvas><img src="${svgURL(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${mark(k)}</svg>`)}" alt="" width="44" height="44"><span class="ktNo">${e.id}</span></div>
 <div class="ktBody"><p class="ktName">${esc(e.title)}</p><p class="ktTag">${esc(k.voice[0]||'')}</p><span class="ktSw" aria-hidden="true">${['bg','surface','ink','accent','accent2'].map(x=>`<i style="background:${t[x]}"></i>`).join('')}</span><p class="ktMeta">${esc(first(k.fonts.head))} · ${t.radius} · ${grade(ratio(t.ink,t.bg))} text</p>
 <div class="ktActs"><a class="ktOpen" href="#systems?id=${e.id}&tab=kit">Open ${esc(k.name)} kit</a><button type="button" class="ktDl" data-kit-download="${e.id}" aria-label="Download ${esc(k.name)} kit ZIP">ZIP ↓</button></div></div></article>`;}
function renderSystems(){const items=systemItems(),grid=$('#systemGrid');if(!grid)return;$('#guideCount').textContent=items.length+' matching style guides';
 let kg=$('#systemKitGrid');if(!kg){kg=document.createElement('div');kg.id='systemKitGrid';kg.className='kitTiles';grid.after(kg);}
 grid.hidden=view==='kits';kg.hidden=view!=='kits';unmountAll(kg);
 if(view==='kits'){kg.innerHTML=items.length?items.map(tile).join(''):'<p>No matching systems. Clear the search to restore the library.</p>';[...kg.querySelectorAll('canvas[data-kitbg]')].forEach((c,i)=>mount(c,kitFor(items[i])));}
 else grid.innerHTML=items.length?items.map(e=>`<article class="cataloguecard"><button class="cardmedia" data-open="${e.id}" aria-label="Explore ${esc(e.title)}">${window.media?media(e):''}</button><p class="cardcode">${e.id} / ${esc(e.group)}</p><h3><button data-open="${e.id}">${esc(e.title)}</button></h3><p class="carddesc">${esc(e.desc)}</p><button class="quiet" data-system="${e.id}">Open system hub →</button></article>`).join(''):'<p>No matching style guides. Clear the search or choose another collection.</p>';
 $$('[data-system-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.systemView===view)));}
function catalogueChrome(){const f=$('#guideBrowse .guideFilters');if(f&&!$('#systemViewToggle')){const d=document.createElement('div');d.id='systemViewToggle';d.className='systemViewToggle';d.setAttribute('role','group');d.setAttribute('aria-label','Show systems as');d.innerHTML='<span>View</span><button type="button" data-system-view="cards" aria-pressed="true">Cards</button><button type="button" data-system-view="kits" aria-pressed="false">Kits</button>';f.append(d);}
 const sel=$('#guideCollection');if(sel){const all=(window.catalogue||[]).filter(e=>e.id[0]==='D'),cnt=g=>all.filter(e=>GROUPS[g](num(e.id))).length;const o=v=>sel.querySelector(`option[value="${v}"]`);
  if(o('original'))o('original').textContent=`All ${cnt('original')} original systems`;if(o('open'))o('open').textContent=`Open-source systems (${cnt('open')}, official tokens)`;if(o('all'))o('all').textContent=`All ${all.length} web systems`;if(o('inspired'))o('inspired').textContent=`Established-system interpretations (${cnt('inspired')})`;}
 const help=$('#guideBrowse .routeHelp');if(help&&!help.dataset.kit){help.dataset.kit='1';help.textContent='Forty-eight systems, each with a live product screen and a downloadable kit. Twenty-seven originals (material families, website-mockup systems and three new product directions), eight established-system interpretations and thirteen open-source systems built on official tokens: Primer, GOV.UK Frontend, Spectrum, USWDS, Lightning, Ant Design, Bootstrap, Pajamas, PatternFly, Ionic, Paste, Canvas and Mantine. Switch to Kits to see every system as a theme kit.';}}

/* ---------- wiring ---------- */
function onClick(ev){const b=ev.target.closest('button,a');if(!b)return;const sys=id=>window.find?find(id):(window.catalogue||[]).find(e=>e.id===id);const tokFor=id=>current()?.id===id?current().tokens:undefined;
 if(b.dataset.kitTokens){downloadTokens(sys(b.dataset.kitTokens),tokFor(b.dataset.kitTokens));}
 else if(b.dataset.kitDownload){downloadKit(sys(b.dataset.kitDownload),tokFor(b.dataset.kitDownload));}
 else if(b.dataset.kitVars){copyVars(sys(b.dataset.kitVars),tokFor(b.dataset.kitVars));}
 else if(b.dataset.kitOpen){SystemAtlas.tab='kit';SystemAtlas.renderHub();$('#systemHubTabs')?.scrollIntoView({block:'start',behavior:reduce()?'auto':'smooth'});}
 else if(b.dataset.kitCopy){navigator.clipboard?.writeText(b.dataset.kitCopy).then(()=>say(b.dataset.kitCopy+' copied.'),()=>say('Copy failed.'));const s=b.closest('.kitView')?.querySelector('.kStatus');if(s)s.textContent=b.dataset.kitCopy+' copied.';}
 else if(b.dataset.kitSay){const s=b.closest('.kitView')?.querySelector('.kStatus');if(s)s.textContent=b.dataset.kitSay;}
 else if(b.hasAttribute('data-kit-pause')){const c=b.closest('.kHero').querySelector('canvas');const paused=c.dataset.paused!=='true';c.dataset.paused=String(paused);b.setAttribute('aria-pressed',String(paused));b.textContent=paused?'Play':'Pause';b.setAttribute('aria-label',(paused?'Play':'Pause')+' the background');try{c._stop?.();}catch{}c._stop=BG[c._kit.bg](c,c._kit.t,paused);}
 else if(b.dataset.systemView){view=b.dataset.systemView;try{localStorage.setItem('atlas.systemView',view);}catch{}renderSystems();}
 else if(b.getAttribute('role')==='tab'&&b.closest('.kTabs')){b.parentElement.querySelectorAll('[role=tab]').forEach(x=>{x.setAttribute('aria-selected',String(x===b));x.tabIndex=x===b?0:-1;});const s=b.closest('.kitView')?.querySelector('.kStatus');if(s)s.textContent=b.textContent+' selected.';}}

function patch(){const SA=window.SystemAtlas,AE=window.AtlasExpansion;if(!SA?.renderHub||!AE?.renderPage||SA.renderHub.__kit)return !!SA?.renderHub?.__kit;
 patchIcons();
 const hub=SA.renderHub;SA.renderHub=function(){ensureHubChrome();if(this.tab==='kit'){const prev='overview';this.tab=prev;hub.apply(this,arguments);this.tab='kit';$$('[data-hub-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.hubTab==='kit')));const e=current();const body=$('#systemHubBody');if(e&&body){unmountAll(body);body.innerHTML=kitView(e,e.tokens);mount(body.querySelector('canvas[data-kitbg]'),kitFor(e,e.tokens));}}else{unmountAll($('#systemHubBody'));hub.apply(this,arguments);}bar();};SA.renderHub.__kit=true;
 const rp=AE.renderPage;AE.renderPage=function(code,id){if(code==='D'&&id==='systemGrid'){catalogueChrome();return renderSystems();}return rp.apply(this,arguments);};
 const sel=AE.selectSystem;AE.selectSystem=function(id){const r=sel.apply(this,arguments);try{const pdf=$('#systemPDF');if(pdf)pdf.hidden=true;const bk=$('#guideBooklet');if(bk)bk.hidden=false;const s=SA.specs[id],src=window.SystemPreviews?.sources?.[id],a=$('#systemSource');const link=src&&/^https?:/.test(src[2])?[src[3],src[2]]:(s?.links||[]).find(l=>/^https?:/.test(l[1]));if(a&&link){a.textContent=link[0]+' ↗';a.href=link[1];}}catch{}bar();return r;};
 const tabFromHash=()=>{const q=new URLSearchParams(location.hash.split('?')[1]||'');if(location.hash.startsWith('#systems')&&q.get('id')&&q.get('tab')){SA.tab=q.get('tab');SA.renderHub();}};
 addEventListener('hashchange',()=>{if(!location.hash.startsWith('#systems'))unmountAll();setTimeout(tabFromHash,0);});
 if(document.readyState!=='loading')setTimeout(tabFromHash,0);
 try{if(AE.ready){catalogueChrome();renderSystems();}if(SA.ready)SA.renderHub();}catch{}
 return true;}
document.addEventListener('click',onClick);
document.addEventListener('keydown',ev=>{const t=ev.target.closest?.('.kTabs [role=tab]');if(!t||!['ArrowLeft','ArrowRight'].includes(ev.key))return;const tabs=[...t.parentElement.querySelectorAll('[role=tab]')],i=tabs.indexOf(t),j=(i+(ev.key==='ArrowRight'?1:tabs.length-1))%tabs.length;tabs[j].click();tabs[j].focus();});
if(!patch()){const timer=setInterval(()=>{if(patch())clearInterval(timer);},120);}
window.SystemKits={kitFor,kitView,componentSheet,tokensCSS,tokensJSON,tokensSCSS,tailwind,cssVars,contrast,kitFiles,tokenFiles,BG,ICONS,icon,mark,logo,pattern,divider,zip,crc32,downloadKit,downloadTokens,ratio,renderSystems};
})();
