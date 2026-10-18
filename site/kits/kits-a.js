'use strict';
/* Theme kits 10-24. Each kit: tokens, fonts, voice, an animated canvas background (c, t, still) -> stop(),
   and SVG generators for its pattern tile, mark and divider. Registered into window.ThemeKits. */
(()=>{
const TK=window.ThemeKits;
const F=(h,b,css)=>({head:h,body:b,css});
const K=[
 {id:'swiss',no:'10',name:'Swiss Editorial',tagline:'A strict grid, one red, nothing extra.',mood:'Publishing, cultural institutions, consultancies, annual reports',feel:'serious',wf:.56,hw:800,scale:1.333,role:'Art director',
  fonts:F("'Inter Tight',system-ui,sans-serif","'Hanken Grotesk',system-ui,sans-serif",'family=Inter+Tight:wght@400;600;800&family=Hanken+Grotesk:wght@400;500;600'),
  t:{bg:'#F2F0EA',surface:'#FFFFFF',ink:'#111111',mute:'#55534E',line:'#D3D0C7',accent:'#D7261B',onAccent:'#FFFFFF',accent2:'#2A5BD7',radius:'0px',shadow:'none',glow:'0 0 0 3px rgba(215,38,27,.35)'},
  bg:'swiss',stroke:{w:2,cap:'butt'},case:'none',bgDesc:'black and red blocks that slide between cells of a visible twelve-column grid',
  voice:['Clarity is the brand.','Information, arranged.','Say it once, say it well.'],
  dos:['Align every element to the twelve-column grid.','Set headlines heavy, tight and flush left.','Use red once per view, for the thing that matters most.'],
  donts:['Centred body text.','Decorative fonts or drop shadows.','More than two type sizes in a block.']},
 {id:'wabi',no:'11',name:'Wabi',tagline:'Washi paper, sumi ink, one brushed circle.',mood:'Tea houses, ceramics, wellness, slow living, craft',feel:'serious',wf:.95,hw:600,scale:1.25,role:'Ceramicist',
  fonts:F("'Shippori Mincho',Georgia,serif","'Zen Kaku Gothic New',system-ui,sans-serif",'family=Shippori+Mincho:wght@500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700'),
  t:{bg:'#F2EDE3',surface:'#FAF7F1',ink:'#2B2723',mute:'#675F56',line:'#DCD3C4',accent:'#A23B24',onAccent:'#FFFFFF',accent2:'#6F7F5E',radius:'2px',shadow:'0 1px 0 #DCD3C4',glow:'0 0 0 3px rgba(162,59,36,.25)'},
  bg:'wabi',stroke:{w:1.25,cap:'round'},case:'none',bgDesc:'an ensō circle brushed in sumi ink on washi paper, drawn slowly, held, then faded and redrawn',
  voice:['Less, held carefully.','Imperfect, and complete.','Made slowly, by hand.'],
  dos:['Leave at least half of every view empty.','Use the vermilion seal colour sparingly, like a stamp.','Let edges be soft and slightly irregular.'],
  donts:['Bright, saturated colour.','Crowded layouts or busy patterns.','Hard drop shadows.']},
 {id:'pastel',no:'12',name:'Neo Pastel',tagline:'Thick outlines, hard shadows, sherbet colours.',mood:'Startups, creator tools, apps, playful SaaS',feel:'playful',wf:.62,hw:700,scale:1.25,role:'Product designer',
  fonts:F("'Space Grotesk',system-ui,sans-serif","'DM Sans',system-ui,sans-serif",'family=Space+Grotesk:wght@500;700&family=DM+Sans:wght@400;500;700'),
  t:{bg:'#FFF1E0',surface:'#FFFFFF',ink:'#161616',mute:'#4D4A45',line:'#161616',accent:'#FF8FB1',onAccent:'#161616',accent2:'#9AD8FF',accent3:'#C6F27A',radius:'14px',shadow:'4px 4px 0 #161616',glow:'0 0 0 3px #9AD8FF'},
  bg:'pastel',stroke:{w:2.25,cap:'round'},case:'none',bgDesc:'outlined pastel stickers with hard offset shadows that bob and tilt over a dotted grid',
  voice:['Make it fun to use.','Big buttons. Bold ideas.','Yes, it really is that easy.'],
  dos:['Outline every surface in 2px ink.','Offset shadows down and right, never blurred.','Mix the three pastels; keep text ink-black.'],
  donts:['Pastel text on pastel backgrounds.','Soft, blurry shadows.','Thin hairline borders.']},
 {id:'riso',no:'13',name:'Risograph',tagline:'Fluorescent pink and blue, slightly off-register.',mood:'Zines, indie publishers, festivals, print studios',feel:'playful',wf:.6,hw:800,scale:1.25,role:'Printer',
  fonts:F("'Bricolage Grotesque',system-ui,sans-serif","'Karla',system-ui,sans-serif",'family=Bricolage+Grotesque:wght@500;700;800&family=Karla:wght@400;500;700'),
  t:{bg:'#F5EFE0',surface:'#FBF8F0',ink:'#1D2340',mute:'#51546C',line:'#D9CFB8',accent:'#FF4FA3',onAccent:'#1D2340',accent2:'#1F6FD1',accent3:'#FFD23F',radius:'4px',shadow:'3px 3px 0 #1F6FD1',glow:'0 0 0 3px rgba(255,79,163,.45)'},
  bg:'riso',stroke:{w:2,cap:'round'},case:'none',bgDesc:'halftone shapes in fluorescent pink, blue and yellow that overprint and drift slightly out of register on cream paper',
  voice:['Printed in two colours. Loved in all of them.','Hot off the drum.','Limited run. Unlimited ideas.'],
  dos:['Overlap the inks with multiply so they mix.','Embrace grain and misregistration.','Keep body text in the dark ink.'],
  donts:['Pure digital gradients.','Pink for small text.','Perfect alignment everywhere.']},
 {id:'solarpunk',no:'14',name:'Solarpunk',tagline:'Green hills, white turbines, a generous sun.',mood:'Climate, energy, cities, community, optimism',feel:'playful',wf:.6,hw:600,scale:1.25,role:'Community gardener',
  fonts:F("'Fraunces',Georgia,serif","'Nunito Sans',system-ui,sans-serif",'family=Fraunces:wght@400;600;700&family=Nunito+Sans:wght@400;600;700'),
  t:{bg:'#F3F0DC',surface:'#FBFAF0',ink:'#1E3A2B',mute:'#4A5E51',line:'#CFD6BC',accent:'#2E7D4F',onAccent:'#FFFFFF',accent2:'#E9A23B',accent3:'#4FA3A5',radius:'18px',shadow:'0 10px 30px -14px rgba(30,58,43,.35)',glow:'0 0 0 3px rgba(233,162,59,.5)'},
  bg:'solarpunk',stroke:{w:1.75,cap:'round'},case:'none',bgDesc:'a rotating sun over rolling green hills with turning wind turbines, swaying grass and drifting seeds',
  voice:['The future is growing.','Powered by sunlight and neighbours.','Build it to last. Plant it to grow.'],
  dos:['Use rounded, organic shapes.','Pair leaf green with warm sun gold.','Show people and plants, not machines alone.'],
  donts:['Grey, industrial palettes.','Dystopian imagery.','Sharp, aggressive angles.']},
 {id:'nordic',no:'15',name:'Nordic Calm',tagline:'Fjord blue, birch, and a lot of quiet.',mood:'Furniture, banking, healthcare, productivity, public services',feel:'serious',wf:.6,hw:600,scale:1.2,role:'Service designer',
  fonts:F("'Sora',system-ui,sans-serif","'Albert Sans',system-ui,sans-serif",'family=Sora:wght@400;600&family=Albert+Sans:wght@400;500;600'),
  t:{bg:'#EEF0EE',surface:'#F8F9F8',ink:'#1D272C',mute:'#536067',line:'#D3D9D9',accent:'#355F73',onAccent:'#FFFFFF',accent2:'#9C7A55',radius:'10px',shadow:'0 1px 2px rgba(29,39,44,.08), 0 8px 24px -12px rgba(29,39,44,.18)',glow:'0 0 0 3px rgba(53,95,115,.3)'},
  bg:'nordic',stroke:{w:1.5,cap:'round'},case:'none',bgDesc:'layered blue-grey mountain ridges drifting at different speeds through bands of soft mist under a pale sun',
  voice:['Simple, honest, and built to last.','Take your time. We saved you some.','Everything you need. Nothing you don’t.'],
  dos:['Use plenty of whitespace and soft, low-contrast surfaces.','Keep one calm blue for actions.','Write short, friendly sentences.'],
  donts:['Loud colour or heavy outlines.','Exclamation marks.','Dense, cramped layouts.']},
 {id:'noir',no:'16',name:'Velvet Noir',tagline:'Oxblood velvet, champagne light.',mood:'Fragrance, fashion houses, cocktail bars, private members',feel:'serious',wf:.62,hw:500,scale:1.333,role:'Perfumer',
  fonts:F("'Bodoni Moda',Georgia,serif","'Mulish',system-ui,sans-serif",'family=Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,500&family=Mulish:wght@400;500;600'),
  t:{bg:'#12080A',surface:'#1C0F12',ink:'#F4E9DD',mute:'#B9A596',line:'#3A2328',accent:'#E2C08D',onAccent:'#12080A',accent2:'#A3263C',radius:'0px',shadow:'0 30px 60px -30px rgba(0,0,0,.8)',glow:'0 0 0 1px #E2C08D'},
  bg:'noir',stroke:{w:1,cap:'butt'},case:'none',bgDesc:'folds of oxblood velvet that ripple slowly while a band of champagne light sweeps across them',
  voice:['After dark, everything is gold.','Quietly, unmistakably yours.','Made for the evening.'],
  dos:['Use hairline champagne rules and generous margins.','Set headlines large in the high-contrast serif.','Keep photography dark and warm.'],
  donts:['Bright white backgrounds.','Rounded, bubbly shapes.','Discount language.']},
 {id:'crt',no:'17',name:'Amber Terminal',tagline:'Phosphor amber on a curved glass tube.',mood:'Dev tools, infrastructure, retro computing, security',feel:'serious',wf:.5,hw:400,scale:1.2,role:'Sysop',
  fonts:F("'VT323',ui-monospace,monospace","'Fira Code',ui-monospace,monospace",'family=VT323&family=Fira+Code:wght@400;500;600'),
  t:{bg:'#100A02',surface:'#1A1205',ink:'#FFC870',mute:'#C9934A',line:'#4A3311',accent:'#FFB000',onAccent:'#100A02',accent2:'#FF7A1A',radius:'2px',shadow:'0 0 0 1px #4A3311',glow:'0 0 14px rgba(255,176,0,.55)'},
  bg:'crt',stroke:{w:1.5,cap:'square'},case:'upper',bgDesc:'a log typing itself line by line in glowing amber, with scanlines, a rolling refresh band and vignette',
  voice:['READY.','Type a command to begin.','All systems nominal.'],
  dos:['Monospace everything; align to character cells.','Use a blinking block cursor as the only animation in text.','Glow on headings only.'],
  donts:['Any colour outside the amber family.','Proportional fonts.','Rounded, glossy UI.']},
 {id:'memphis',no:'18',name:'Memphis',tagline:'Squiggles, confetti and loud primaries.',mood:'Events, kids’ brands, creative agencies, retail pop-ups',feel:'playful',wf:.82,hw:400,scale:1.25,role:'Party planner',
  fonts:F("'Bungee',system-ui,sans-serif","'Rubik',system-ui,sans-serif",'family=Bungee&family=Rubik:wght@400;500;700'),
  t:{bg:'#FFF7EA',surface:'#FFFFFF',ink:'#1A1A1A',mute:'#4F4A44',line:'#1A1A1A',accent:'#2346E8',onAccent:'#FFFFFF',accent2:'#FFC21A',accent3:'#FF5C8A',radius:'4px',shadow:'5px 5px 0 #1A1A1A',glow:'0 0 0 3px #FFC21A'},
  bg:'memphis',stroke:{w:2.5,cap:'round'},case:'upper',bgDesc:'squiggles, zigzags, triangles, dotted arcs and confetti bars that drift and spin over a dotted field',
  voice:['More is more.','Let’s make some noise.','Rules are for other parties.'],
  dos:['Scatter shapes around the edges, never behind text.','Combine blue, yellow and pink with black outlines.','Tilt things a little.'],
  donts:['Muted, earthy palettes.','Perfect symmetry.','Long paragraphs in the display face.']},
 {id:'botanical',no:'19',name:'Botanical Paper',tagline:'Pressed ferns and ink on cotton paper.',mood:'Apothecaries, florists, skincare, gardens, stationery',feel:'serious',wf:.55,hw:400,scale:1.25,role:'Herbalist',
  fonts:F("'DM Serif Display',Georgia,serif","'Source Sans 3',system-ui,sans-serif",'family=DM+Serif+Display:ital@0;1&family=Source+Sans+3:wght@400;500;600'),
  t:{bg:'#F1EADB',surface:'#F9F5EC',ink:'#2B2A20',mute:'#5C5846',line:'#D8CFBA',accent:'#4D6A36',onAccent:'#FFFFFF',accent2:'#A9503A',radius:'6px',shadow:'0 1px 0 #D8CFBA',glow:'0 0 0 3px rgba(77,106,54,.3)'},
  bg:'botanical',stroke:{w:1.25,cap:'round'},case:'none',bgDesc:'line-drawn fern fronds that grow up from the bottom edge and sway gently on cotton paper',
  voice:['Grown slowly, gathered by hand.','Rooted in nature.','Small batch, honest ingredients.'],
  dos:['Draw illustrations as fine ink lines.','Use olive for actions and terracotta for highlights.','Italic serif for labels and captions.'],
  donts:['Neon or synthetic colours.','Heavy, filled icons.','Glossy effects.']},
 {id:'arctic',no:'20',name:'Arctic Glass',tagline:'Aurora over ice, seen through frosted glass.',mood:'Climate science, outdoor tech, cloud, wearables',feel:'serious',wf:.82,hw:600,scale:1.25,role:'Field researcher',
  fonts:F("'Unbounded',system-ui,sans-serif","'Plus Jakarta Sans',system-ui,sans-serif",'family=Unbounded:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600'),
  t:{bg:'#071423',surface:'#0E2136',ink:'#E9F5FF',mute:'#9DB6CC',line:'#1F3A55',accent:'#8EE3FF',onAccent:'#071423',accent2:'#B9A8FF',accent3:'#7CFFCB',radius:'16px',shadow:'0 20px 50px -24px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.08)',glow:'0 0 0 3px rgba(142,227,255,.35)'},
  bg:'arctic',stroke:{w:1.5,cap:'round'},case:'none',bgDesc:'green, ice-blue and violet aurora curtains rippling over stars, falling snow and dark ice',
  voice:['Clear, cold, precise.','Built for extremes.','Light from the north.'],
  dos:['Use frosted, translucent surfaces with a thin top highlight.','Keep aurora colours for data and highlights.','Give everything room to breathe.'],
  donts:['Warm colours.','Heavy, opaque panels.','Busy patterns behind text.']},
 {id:'mission',no:'21',name:'Mission Control',tagline:'Orbits, telemetry and a launch-orange signal.',mood:'Aerospace, logistics, data platforms, operations dashboards',feel:'serious',wf:.62,hw:600,scale:1.2,role:'Flight director',
  fonts:F("'Chakra Petch',system-ui,sans-serif","'Titillium Web',system-ui,sans-serif",'family=Chakra+Petch:wght@400;600;700&family=Titillium+Web:wght@400;600;700'),
  t:{bg:'#0A0E13',surface:'#111921',ink:'#E4ECF2',mute:'#8EA2B2',line:'#24323F',accent:'#FF6A2B',onAccent:'#0A0E13',accent2:'#44D7C8',radius:'2px',shadow:'0 0 0 1px #24323F',glow:'0 0 0 2px #FF6A2B'},
  bg:'mission',stroke:{w:1.5,cap:'square'},case:'upper',bgDesc:'a wireframe planet with an orbiting craft and its trail, plus scrolling telemetry traces and a mission clock',
  voice:['Go for launch.','Every second, accounted for.','Nominal across the board.'],
  dos:['Label everything with units and timestamps.','Use orange only for the next action or an alert.','Teal for live data.'],
  donts:['Decorative illustration.','Soft, rounded corners.','Vague, chatty copy.']},
 {id:'kids',no:'22',name:'Playground',tagline:'Bouncy balls, puffy clouds, big round buttons.',mood:'Children’s learning, toys, family apps, picture books',feel:'playful',wf:.6,hw:800,scale:1.25,role:'Chief play officer',
  fonts:F("'Baloo 2',system-ui,sans-serif","'Nunito',system-ui,sans-serif",'family=Baloo+2:wght@500;700;800&family=Nunito:wght@400;600;700;800'),
  t:{bg:'#FFF5D1',surface:'#FFFFFF',ink:'#2A2350',mute:'#564E7C',line:'#EBD99A',accent:'#FF6B3D',onAccent:'#2A2350',accent2:'#2FA8F5',accent3:'#6CCB4B',radius:'22px',shadow:'0 5px 0 #2A2350',glow:'0 0 0 4px rgba(47,168,245,.45)'},
  bg:'kids',stroke:{w:2.5,cap:'round'},case:'none',bgDesc:'smiling balls bouncing with squash and stretch on a green hill while puffy clouds drift past',
  voice:['Let’s play!','Learning is an adventure.','You did it!'],
  dos:['Make every tap target at least 48px.','Use round shapes and friendly faces.','Write short sentences a seven-year-old can read.'],
  donts:['Small text or thin lines.','Scary, dark imagery.','Long instructions.']},
 {id:'kinetic',no:'23',name:'Kinetic',tagline:'Volt yellow, speed streaks, condensed capitals.',mood:'Sport, fitness, energy drinks, racing, streetwear',feel:'playful',wf:.42,hw:400,scale:1.333,role:'Head coach',
  fonts:F("'Anton',Impact,sans-serif","'Archivo',system-ui,sans-serif",'family=Anton&family=Archivo:wght@400;500;600;700'),
  t:{bg:'#0A0A0C',surface:'#151518',ink:'#F4F4F0',mute:'#A3A39C',line:'#2B2B30',accent:'#D7FF1E',onAccent:'#0A0A0C',accent2:'#FF3B2F',radius:'2px',shadow:'0 0 0 1px #2B2B30',glow:'0 0 0 3px rgba(215,255,30,.5)'},
  bg:'kinetic',stroke:{w:2.5,cap:'square'},case:'upper',bgDesc:'diagonal track lanes with volt and white speed streaks racing past a giant outlined number',
  voice:['Faster than yesterday.','No finish line.','Play loud.'],
  dos:['Slant layouts and images on the same diagonal.','Use condensed capitals, huge and tight.','Volt for the single most important action.'],
  donts:['Soft pastel colour.','Static, centred compositions.','Lowercase headlines.']},
 {id:'desert',no:'24',name:'Desert Modern',tagline:'Terracotta arches, sand dunes, a slow sun.',mood:'Hospitality, architecture, interiors, wellness retreats',feel:'serious',wf:.66,hw:700,scale:1.25,role:'Architect',
  fonts:F("'Syne',system-ui,sans-serif","'Epilogue',system-ui,sans-serif",'family=Syne:wght@500;700&family=Epilogue:wght@400;500;600'),
  t:{bg:'#F4E4CF',surface:'#FBF3E8',ink:'#3A2117',mute:'#6A4A3A',line:'#E2C9AB',accent:'#B0421A',onAccent:'#FFFFFF',accent2:'#2F5E5F',accent3:'#E3A23C',radius:'24px',shadow:'0 12px 30px -18px rgba(58,33,23,.45)',glow:'0 0 0 3px rgba(176,66,26,.3)'},
  bg:'desert',stroke:{w:1.75,cap:'round'},case:'none',bgDesc:'a setting sun framed by arches over layered dunes, with a heat shimmer on the horizon',
  voice:['Warmth, by design.','Stay a while longer.','Shaped by sun and time.'],
  dos:['Use arches and rounded tops for images and panels.','Keep the palette sun-baked: sand, clay, sage.','Set generous line spacing.'],
  donts:['Cold blues and greys.','Sharp, technical grids.','Neon accents.']}
];

const BG={
swiss(c,t,still){const x=c.getContext('2d');let W,H,d,raf,cw,rh;const C=12,R=8;
 const pick=()=>({c:5+(Math.random()*(C-7)|0),r:Math.random()*(R-1)|0,w:1+(Math.random()*3|0),h:1+(Math.random()*2|0)});
 const B=[t.accent,t.ink,t.ink,t.accent2,t.ink,t.accent,'#FFFFFF'].map((col,i)=>{const p=pick();return{a:p,b:p,p:1,hold:Math.random()*3,col,circ:i===0}});
 const ease=v=>v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;cw=W/C;rh=H/R}
 function draw(dt){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.strokeStyle=t.line;x.lineWidth=d;
  for(let i=1;i<C;i++){x.beginPath();x.moveTo(i*cw,0);x.lineTo(i*cw,H);x.stroke()}for(let j=1;j<R;j++){x.beginPath();x.moveTo(0,j*rh);x.lineTo(W,j*rh);x.stroke()}
  B.forEach(b=>{if(b.p<1)b.p=Math.min(1,b.p+dt*.55);else{b.hold-=dt;if(b.hold<0){b.a=b.b;b.b=pick();b.p=0;b.hold=1.5+Math.random()*3}}
   const e=ease(b.p),L=k=>b.a[k]+(b.b[k]-b.a[k])*e,X=L('c')*cw,Y=L('r')*rh,w=L('w')*cw,h=L('h')*rh;x.fillStyle=b.col;
   if(b.circ){const r=Math.min(w,h)/2;x.beginPath();x.arc(X+r,Y+r,r-2*d,0,Math.PI*2);x.fill()}else x.fillRect(X+2*d,Y+2*d,w-4*d,h-4*d)});
  x.fillStyle=t.ink;x.fillRect(0,rh-4*d,W,8*d)}
 size();if(still){draw(0);return()=>{}}let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(n-last)/1000);last=n;draw(dt)};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
wabi(c,t,still){const x=c.getContext('2d');let W,H,d,raf,T=0,Fb=[],a0=-1;
 const hs=n=>((Math.sin(n*91.7)*43758.5453)%1+1)%1;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;Fb=Array.from({length:220},()=>[Math.random()*W,Math.random()*H,(4+Math.random()*18)*d,Math.random()*Math.PI,Math.random()*.08+.02])}
 function enso(p,al){const cx=W*.66,cy=H*.46,R=Math.min(W,H)*.3,N=160;x.save();x.lineCap='round';
  for(let b=0;b<11;b++){const off=(b-5)/5,stop=1-hs(b+3)*.3;x.strokeStyle=t.ink;x.globalAlpha=al*(.35+.55*hs(b+11));x.lineWidth=R*.13/8*(1.3-.5*Math.abs(off));x.beginPath();
   for(let i=0;i<=N;i++){const f=i/N*p;if(f>stop&&f>.55)break;const w=R*.13*(1-.55*f),an=a0+f*Math.PI*1.86,rr=R+off*w*.5+Math.sin(f*17+b)*1.5*d,px=cx+Math.cos(an)*rr,py=cy+Math.sin(an)*rr;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}
  x.globalAlpha=al*.9;x.fillStyle=t.accent;const s=R*.13;x.fillRect(cx+R*.9,cy+R*.82,s,s);x.restore()}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const g=x.createRadialGradient(W*.2,H*.9,0,W*.2,H*.9,W*.6);g.addColorStop(0,'rgba(111,127,94,.12)');g.addColorStop(1,'rgba(111,127,94,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.strokeStyle=t.mute;Fb.forEach(f=>{x.globalAlpha=f[4];x.lineWidth=.6*d;x.beginPath();x.moveTo(f[0],f[1]);x.lineTo(f[0]+Math.cos(f[3])*f[2],f[1]+Math.sin(f[3])*f[2]);x.stroke()});x.globalAlpha=1;
  const cyc=T%11;let p=1,al=1;if(cyc<4.5){const v=cyc/4.5;p=1-Math.pow(1-v,2.2)}else if(cyc>8.5)al=Math.max(0,1-(cyc-8.5)/1.6);enso(p,al)}
 size();if(still){T=6;draw();return()=>{}}let last=performance.now(),prev=0;const loop=n=>{raf=requestAnimationFrame(loop);T+=Math.min(.05,(n-last)/1000);last=n;const cyc=Math.floor(T/11);if(cyc!==prev){prev=cyc;a0=-1.4+Math.random()*.9}draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
pastel(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,S=[];const cols=[t.accent,t.accent2,t.accent3||t.accent,'#FFFFFF','#FFD66B'];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;S=Array.from({length:12},(_,i)=>({x:.08+Math.random()*.9,y:.08+Math.random()*.86,s:(30+Math.random()*60)*d,k:i%5,c:cols[i%cols.length],r:Math.random()*6,p:Math.random()*6,v:.4+Math.random()*.6}))}
 function rr(X,Y,w,h,r){x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()}
 function shape(k,s){x.beginPath();if(k===0)rr(-s,-s*.6,2*s,1.2*s,s*.3);else if(k===1)x.arc(0,0,s,0,Math.PI*2);else if(k===2){for(let i=0;i<10;i++){const r=i%2?s*.48:s,an=i/10*Math.PI*2-Math.PI/2;x.lineTo(Math.cos(an)*r,Math.sin(an)*r)}x.closePath()}else if(k===3)rr(-s*1.3,-s*.42,2.6*s,.84*s,s*.42);else{for(let i=0;i<=36;i++){const an=i/36*Math.PI*2,r=s*(1+.14*Math.sin(an*4));i?x.lineTo(Math.cos(an)*r,Math.sin(an)*r):x.moveTo(Math.cos(an)*r,Math.sin(an)*r)}x.closePath()}}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.fillStyle=t.ink;x.globalAlpha=.13;const g=26*d;for(let Y=g/2;Y<H;Y+=g)for(let X=g/2;X<W;X+=g){x.beginPath();x.arc(X,Y,1.4*d,0,Math.PI*2);x.fill()}x.globalAlpha=1;
  S.forEach(o=>{const px=o.x*W,py=o.y*H+Math.sin(a*o.v+o.p)*12*d,rot=o.r+Math.sin(a*.4*o.v+o.p)*.25;x.save();x.translate(px+6*d,py+6*d);x.rotate(rot);shape(o.k,o.s);x.fillStyle=t.ink;x.fill();x.restore();x.save();x.translate(px,py);x.rotate(rot);shape(o.k,o.s);x.fillStyle=o.c;x.fill();x.lineWidth=3*d;x.lineJoin='round';x.strokeStyle=t.ink;x.stroke();x.restore()})}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.016;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
riso(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,L=[],G;
 function layer(col,shapes,s,ang){const o=document.createElement('canvas');o.width=Math.ceil(W*1.1);o.height=Math.ceil(H*1.1);const q=o.getContext('2d');q.fillStyle=col;const m=Math.min(W,H),ca=Math.cos(ang),sa=Math.sin(ang);
  for(let j=-40;j<(o.width+o.height)/s;j++)for(let i=-40;i<(o.width+o.height)/s;i++){const xx=i*s*ca-j*s*sa,yy=i*s*sa+j*s*ca;if(xx<-s||yy<-s||xx>o.width+s||yy>o.height+s)continue;let v=0;shapes.forEach(([cx,cy,r])=>{const dd=Math.hypot(xx-cx*o.width,yy-cy*o.height)/(r*m);v=Math.max(v,1-dd)});if(v>0){q.beginPath();q.arc(xx,yy,s*.6*Math.min(1,v*1.7),0,Math.PI*2);q.fill()}}return o}
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;const s=Math.max(5,7*d);
  L=[layer(t.accent,[[.7,.4,.5],[.15,.85,.28]],s,.26),layer(t.accent2,[[.52,.66,.42],[.92,.12,.24]],s,.79),layer(t.accent3||t.accent,[[.86,.78,.2],[.3,.2,.16]],s,0)];
  G=document.createElement('canvas');G.width=W;G.height=H;const g=G.getContext('2d');g.fillStyle='rgba(29,35,64,.07)';for(let i=0;i<W*H/900;i++)g.fillRect(Math.random()*W,Math.random()*H,d,d)}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.globalCompositeOperation='multiply';
  L.forEach((o,i)=>{const dx=Math.sin(a*(.6+i*.25)+i*2)*8*d,dy=Math.cos(a*(.5+i*.2)+i)*6*d;x.globalAlpha=i===2?.8:.88;x.drawImage(o,-W*.05+dx,-H*.05+dy)});
  x.globalAlpha=1;x.globalCompositeOperation='source-over';x.drawImage(G,0,0)}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.01;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(()=>{size();draw()});ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
solarpunk(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,P=[],Gr=[];
 const hill=(k,X)=>H*(.66+k*.08)+Math.sin(X/W*Math.PI*(1.1+k*.55)+k*2.1)*H*.05;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;P=Array.from({length:40},()=>[Math.random()*W,Math.random()*H,(1+Math.random()*2.2)*d,.3+Math.random(),Math.random()*6]);Gr=Array.from({length:Math.ceil(W/(7*d))},(_,i)=>[i*7*d+Math.random()*4*d,(18+Math.random()*34)*d,Math.random()*6])}
 function draw(){let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#FDF3C8');g.addColorStop(.6,t.bg);g.addColorStop(1,t.bg);x.fillStyle=g;x.fillRect(0,0,W,H);
  const sx=W*.78,sy=H*.26,r=Math.min(W,H)*.11;x.save();x.translate(sx,sy);x.rotate(a*.08);x.fillStyle=t.accent2;x.globalAlpha=.18;for(let i=0;i<14;i++){x.rotate(Math.PI*2/14);x.beginPath();x.moveTo(r*1.25,-r*.12);x.lineTo(r*2.8,0);x.lineTo(r*1.25,r*.12);x.fill()}x.restore();x.globalAlpha=1;x.fillStyle=t.accent2;x.beginPath();x.arc(sx,sy,r,0,Math.PI*2);x.fill();
  const hc=['#C9DCA4','#8DBB72',t.accent];hc.forEach((col,k)=>{x.fillStyle=col;x.beginPath();x.moveTo(0,H);for(let X=0;X<=W;X+=8*d)x.lineTo(X,hill(k,X));x.lineTo(W,H);x.fill();
   if(k===0)[.18,.32,.5].forEach((f,i)=>{const X=W*f,Y=hill(0,X),h=H*(.2-i*.03);x.strokeStyle='#FFFFFF';x.lineWidth=3*d;x.beginPath();x.moveTo(X,Y);x.lineTo(X,Y-h);x.stroke();x.save();x.translate(X,Y-h);x.rotate(a*(1.2+i*.3)+i);for(let b=0;b<3;b++){x.rotate(Math.PI*2/3);x.beginPath();x.moveTo(0,0);x.lineTo(0,-h*.42);x.lineWidth=2.4*d;x.stroke()}x.restore();x.fillStyle='#FFFFFF';x.beginPath();x.arc(X,Y-h,3*d,0,Math.PI*2);x.fill()})});
  x.strokeStyle='#1E5A35';x.lineWidth=1.6*d;x.lineCap='round';Gr.forEach(([X,h,p])=>{const sw=Math.sin(a*1.3+p+X*.004)*8*d;x.beginPath();x.moveTo(X,H);x.quadraticCurveTo(X+sw*.3,H-h*.6,X+sw,H-h);x.stroke()});
  x.fillStyle='#FFFFFF';P.forEach(p=>{p[1]-=p[3]*.25*d;p[0]+=Math.sin(a+p[4])*.3*d;if(p[1]<-10)p[1]=H+10;x.globalAlpha=.75;x.beginPath();x.arc(p[0],p[1],p[2],0,Math.PI*2);x.fill()});x.globalAlpha=1}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.016;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
nordic(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0;const cols=['#CDD7D9','#AEBEC4','#86A0AA','#5B7A88','#33505D'];
 const ridge=(i,X,off)=>{const u=(X+off)/W;return H*(.38+i*.11)+Math.sin(u*(3+i)+i*1.7)*H*.05+Math.sin(u*(9+i*2)+i)*H*.018+Math.sin(u*(21+i))*H*.006};
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function draw(){let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#DCE4E6');g.addColorStop(.5,t.bg);x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle='#F7F5EE';x.globalAlpha=.9;x.beginPath();x.arc(W*.3,H*.24,Math.min(W,H)*.07,0,Math.PI*2);x.fill();x.globalAlpha=1;
  cols.forEach((col,i)=>{const off=a*(i+1)*14*d;x.fillStyle=col;x.beginPath();x.moveTo(0,H);for(let X=0;X<=W;X+=6*d)x.lineTo(X,ridge(i,X,off));x.lineTo(W,H);x.fill();
   const my=H*(.42+i*.11)+Math.sin(a*.7+i)*H*.02;g=x.createLinearGradient(0,my-H*.06,0,my+H*.06);g.addColorStop(0,'rgba(238,240,238,0)');g.addColorStop(.5,'rgba(238,240,238,.42)');g.addColorStop(1,'rgba(238,240,238,0)');x.fillStyle=g;x.fillRect(0,my-H*.06,W,H*.12)})}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.004;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
noir(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 const fx=(i,Y,N)=>i/N*W*1.2-W*.1+Math.sin(Y/H*2.6+i*.55+a)*W*.035+Math.sin(Y/H*6+i*1.3-a*.7)*W*.008;
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const N=22;
  for(let i=0;i<N;i++){x.beginPath();for(let Y=0;Y<=H;Y+=10*d)x.lineTo(fx(i,Y,N),Y);for(let Y=H;Y>=0;Y-=10*d)x.lineTo(fx(i+1,Y,N),Y);x.closePath();const sh=.5+.5*Math.sin(i*1.1+a*.8);
   const g=x.createLinearGradient(fx(i,H/2,N),0,fx(i+1,H/2,N),0);g.addColorStop(0,`rgba(163,38,60,${.12+.45*sh})`);g.addColorStop(.55,`rgba(163,38,60,${.05+.2*sh})`);g.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=g;x.fill()}
  const sx=((a*.12)%1.6-.3)*W,g=x.createLinearGradient(sx-W*.25,0,sx+W*.25,H);g.addColorStop(0,'rgba(226,192,141,0)');g.addColorStop(.5,'rgba(226,192,141,.13)');g.addColorStop(1,'rgba(226,192,141,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.strokeStyle=t.accent;x.globalAlpha=.55;x.lineWidth=d;x.beginPath();for(let X=0;X<=W;X+=8*d)x.lineTo(X,H*.72+Math.sin(X/W*5+a*1.2)*H*.05+Math.sin(X/W*13-a)*H*.01);x.stroke();x.globalAlpha=1;
  const v=x.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.8);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.7)');x.fillStyle=v;x.fillRect(0,0,W,H)}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.006;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
crt(c,t,still){const x=c.getContext('2d');let W,H,d,raf,fs,T=0,acc=0,src=0,cur='',lines=[];
 const LOG=['BOOT  ROM V2.17 ................ OK','MEM   640K BASE / 15360K EXT .... OK','LINK  CARRIER DETECT  2400 BAUD','> run diagnostics --all','  ch.01   nominal    0.998','  ch.02   nominal    1.002','  ch.03   drift      0.041  [watch]','> tail station.log','  02:14:11  relay A   handshake','  02:14:12  relay B   handshake','  02:14:19  uplink    stable','  02:14:31  buffer    84% free','> sync --mirror archive/','  1024 blocks .......... done','> status','  ALL SYSTEMS NOMINAL'];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;fs=Math.max(12,18*d)}
 function step(){if(cur.length<LOG[src].length)cur=LOG[src].slice(0,cur.length+1);else{lines.push(cur);cur='';src=(src+1)%LOG.length;if(lines.length>60)lines.shift()}}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);let g=x.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,Math.max(W,H)*.6);g.addColorStop(0,'rgba(255,176,0,.10)');g.addColorStop(1,'rgba(255,176,0,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.font=`${fs}px VT323, "Fira Code", monospace`;x.fillStyle=t.ink;x.shadowColor=t.accent;x.shadowBlur=8*d;const lh=fs*1.3,px=W*.5;let y=H-lh*1.2;
  const blink=(T*2|0)%2===0;x.fillText(cur+(blink?'█':' '),px,y);for(let i=lines.length-1;i>=0&&y>0;i--){y-=lh;x.globalAlpha=Math.max(.25,1-(H-y)/H*.8);x.fillText(lines[i],px,y)}x.globalAlpha=1;x.shadowBlur=0;
  x.fillStyle='rgba(0,0,0,.28)';for(let Y=0;Y<H;Y+=3*d)x.fillRect(0,Y,W,d);
  const by=(T*90*d)%(H+200*d)-100*d;g=x.createLinearGradient(0,by-60*d,0,by+60*d);g.addColorStop(0,'rgba(255,200,112,0)');g.addColorStop(.5,'rgba(255,200,112,.05)');g.addColorStop(1,'rgba(255,200,112,0)');x.fillStyle=g;x.fillRect(0,by-60*d,W,120*d);
  const v=x.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.75)');x.fillStyle=v;x.fillRect(0,0,W,H)}
 size();if(still){for(let i=0;i<400;i++)step();draw();return()=>{}}for(let i=0;i<120;i++)step();let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(n-last)/1000);last=n;T+=dt;acc+=dt;while(acc>.035){acc-=.035;step()}draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
memphis(c,t,still){const x=c.getContext('2d');let W,H,d,raf,O=[];const cols=[t.accent,t.accent2,t.accent3||t.accent,t.ink];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;O=Array.from({length:24},(_,i)=>({x:Math.random()*W,y:Math.random()*H,k:i%6,s:(22+Math.random()*40)*d,c:cols[i%4],r:Math.random()*6,vr:(Math.random()-.5)*.01,vx:(Math.random()-.5)*.35*d,vy:(Math.random()-.5)*.35*d}))}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.fillStyle=t.ink;x.globalAlpha=.14;const g=22*d;for(let Y=g/2;Y<H;Y+=g)for(let X=(Y/g%2)*g/2;X<W;X+=g){x.beginPath();x.arc(X,Y,1.5*d,0,Math.PI*2);x.fill()}x.globalAlpha=1;
  O.forEach(o=>{o.x=(o.x+o.vx+W+100)%(W+100);o.y=(o.y+o.vy+H+100)%(H+100);o.r+=o.vr;x.save();x.translate(o.x-50,o.y-50);x.rotate(o.r);const s=o.s;x.lineWidth=5*d;x.lineCap='round';x.lineJoin='round';x.strokeStyle=o.c;x.fillStyle=o.c;
   if(o.k===0){x.beginPath();for(let i=0;i<=40;i++){const u=i/40;x.lineTo(-s*1.5+u*s*3,Math.sin(u*Math.PI*4)*s*.3)}x.stroke()}
   else if(o.k===1){x.beginPath();for(let i=0;i<=6;i++)x.lineTo(-s*1.2+i*s*.4,i%2?-s*.3:s*.3);x.stroke()}
   else if(o.k===2){x.beginPath();x.moveTo(0,-s*.8);x.lineTo(s*.8,s*.6);x.lineTo(-s*.8,s*.6);x.closePath();x.fill();x.lineWidth=3*d;x.strokeStyle=t.ink;x.stroke()}
   else if(o.k===3){x.beginPath();x.arc(0,0,s*.7,0,Math.PI*2);x.fill();x.strokeStyle=t.ink;x.lineWidth=2*d;for(let i=-3;i<=3;i++){x.beginPath();const yy=i*s*.18,hw=Math.sqrt(Math.max(0,s*s*.49-yy*yy));x.moveTo(-hw,yy);x.lineTo(hw,yy);x.stroke()}}
   else if(o.k===4){for(let i=0;i<=12;i++){const an=Math.PI+i/12*Math.PI;x.beginPath();x.arc(Math.cos(an)*s,Math.sin(an)*s,3*d,0,Math.PI*2);x.fill()}}
   else{x.fillRect(-s*.7,-s*.14,s*1.4,s*.28)}x.restore()})}
 size();if(still){draw();return()=>{}}const loop=()=>{draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
botanical(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,T=0,Fr=[],Sp=[];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;Fr=Array.from({length:7},(_,i)=>({bx:(i+.5)/7*W+(Math.random()-.5)*W*.06,len:H*(.42+Math.random()*.42),lean:(Math.random()-.5)*.9,ph:Math.random()*6,col:i%3?t.accent:t.ink,del:i*.35}));Sp=Array.from({length:160},()=>[Math.random()*W,Math.random()*H,Math.random()*1.4*d])}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.fillStyle='rgba(92,88,70,.18)';Sp.forEach(s=>{x.beginPath();x.arc(s[0],s[1],s[2],0,Math.PI*2);x.fill()});x.lineCap='round';
  Fr.forEach(f=>{const g=still?1:Math.max(0,Math.min(1,(T-f.del)*.3)),sw=Math.sin(a*.8+f.ph)*.08,N=34,pts=[];let px=f.bx,py=H;for(let i=0;i<=N;i++){const s=i/N,th=-Math.PI/2+f.lean*s+sw*s*s;pts.push([px,py,th]);px+=Math.cos(th)*f.len/N;py+=Math.sin(th)*f.len/N}
   const lim=Math.max(1,Math.floor(N*g));x.strokeStyle=f.col;x.lineWidth=1.6*d;x.beginPath();for(let i=0;i<=lim;i++)i?x.lineTo(pts[i][0],pts[i][1]):x.moveTo(pts[i][0],pts[i][1]);x.stroke();
   for(let i=3;i<lim;i++){const [X,Y,th]=pts[i],s=i/N,L=f.len*.12*(1-s*.75);[-1,1].forEach(sd=>{const an=th+sd*1.05;x.save();x.translate(X,Y);x.rotate(an);x.beginPath();x.ellipse(L/2,0,L/2,L*.17,0,0,Math.PI*2);x.globalAlpha=.16;x.fillStyle=f.col;x.fill();x.globalAlpha=.85;x.lineWidth=1.1*d;x.stroke();x.beginPath();x.moveTo(0,0);x.lineTo(L*.9,0);x.globalAlpha=.5;x.stroke();x.restore()})}x.globalAlpha=1})}
 size();if(still){draw();return()=>{}}let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(n-last)/1000);last=n;T+=dt;a+=dt;draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
arctic(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,St=[],Sn=[],strips=[];
 function strip(col){const o=document.createElement('canvas');o.width=1;o.height=128;const q=o.getContext('2d'),g=q.createLinearGradient(0,0,0,128);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.25,col);g.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g;q.fillRect(0,0,1,128);return o}
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;St=Array.from({length:140},()=>[Math.random()*W,Math.random()*H*.7,Math.random()]);Sn=Array.from({length:80},()=>[Math.random()*W,Math.random()*H,(.6+Math.random()*1.6)*d,.3+Math.random()*.7,Math.random()*6]);strips=[t.accent3||'#7CFFCB',t.accent,t.accent2].map(strip)}
 function draw(){let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#040B15');g.addColorStop(1,'#0B2A44');x.fillStyle=g;x.fillRect(0,0,W,H);
  St.forEach(s=>{x.fillStyle=`rgba(233,245,255,${.25+.6*s[2]})`;x.fillRect(s[0],s[1],1.3*d,1.3*d)});
  x.globalCompositeOperation='lighter';strips.forEach((sp,k)=>{x.globalAlpha=.32;const st=5*d;for(let X=0;X<W;X+=st){const u=X/W,y=H*(.12+k*.07)+Math.sin(u*4+a*(.5+k*.2)+k)*H*.06+Math.sin(u*9-a*.7+k)*H*.02,h=H*(.22+.1*Math.sin(u*3+a+k*2));x.drawImage(sp,X,y,st+1,h)}});x.globalAlpha=1;x.globalCompositeOperation='source-over';
  x.fillStyle='#0A2033';x.strokeStyle='rgba(142,227,255,.35)';x.lineWidth=d;x.beginPath();x.moveTo(0,H);const pk=[[0,.86],[.08,.8],[.16,.88],[.27,.76],[.36,.86],[.5,.82],[.6,.9],[.72,.78],[.84,.87],[.93,.8],[1,.85]];pk.forEach(([u,v])=>x.lineTo(u*W,v*H));x.lineTo(W,H);x.closePath();x.fill();x.stroke();
  x.fillStyle='#E9F5FF';Sn.forEach(s=>{s[1]+=s[3]*.6*d;s[0]+=Math.sin(a*2+s[4])*.3*d;if(s[1]>H)s[1]=-5;x.globalAlpha=.7;x.beginPath();x.arc(s[0],s[1],s[2],0,Math.PI*2);x.fill()});x.globalAlpha=1}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.008;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
mission(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,trail=[],tel=[];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;tel=[0,1,2].map(k=>Array.from({length:90},(_,i)=>Math.sin(i*.2+k)*.5+Math.random()*.3));trail=[]}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.strokeStyle=t.line;x.lineWidth=d;const g=48*d;x.globalAlpha=.6;for(let X=0;X<W;X+=g){x.beginPath();x.moveTo(X,0);x.lineTo(X,H);x.stroke()}for(let Y=0;Y<H;Y+=g){x.beginPath();x.moveTo(0,Y);x.lineTo(W,Y);x.stroke()}x.globalAlpha=1;
  const cx=W*.62,cy=H*1.02,R=Math.min(W,H)*.55;x.fillStyle='#0E1822';x.beginPath();x.arc(cx,cy,R,0,Math.PI*2);x.fill();x.strokeStyle=t.accent2;x.globalAlpha=.35;for(let i=1;i<6;i++){x.beginPath();x.ellipse(cx,cy,R,R*i/6,0,0,Math.PI*2);x.stroke();x.beginPath();x.ellipse(cx,cy,R*i/6,R,a*.2,0,Math.PI*2);x.stroke()}x.globalAlpha=.8;x.beginPath();x.arc(cx,cy,R,0,Math.PI*2);x.stroke();
  const rx=R*1.5,ry=R*.62,rot=-.32;x.globalAlpha=.6;x.setLineDash([6*d,6*d]);x.strokeStyle=t.mute;x.beginPath();x.ellipse(cx,cy-R*.15,rx,ry,rot,0,Math.PI*2);x.stroke();x.setLineDash([]);x.globalAlpha=1;
  const th=a*.5,ex=Math.cos(th)*rx,ey=Math.sin(th)*ry,px=cx+ex*Math.cos(rot)-ey*Math.sin(rot),py=cy-R*.15+ex*Math.sin(rot)+ey*Math.cos(rot);trail.push([px,py]);if(trail.length>70)trail.shift();
  trail.forEach((p,i)=>{x.fillStyle=t.accent;x.globalAlpha=i/trail.length*.6;x.fillRect(p[0]-1.5*d,p[1]-1.5*d,3*d,3*d)});x.globalAlpha=1;x.fillStyle=t.accent;x.shadowColor=t.accent;x.shadowBlur=14*d;x.fillRect(px-4*d,py-4*d,8*d,8*d);x.shadowBlur=0;
  const bx=W*.6,by=H*.08,bw=W*.34,bh=H*.24;x.strokeStyle=t.line;x.strokeRect(bx,by,bw,bh);tel.forEach((arr,k)=>{if(!still&&Math.random()<.5){arr.shift();arr.push(Math.sin(a*3+k)*.5+Math.random()*.3)}x.strokeStyle=k===0?t.accent2:k===1?t.accent:t.mute;x.globalAlpha=.85;x.beginPath();arr.forEach((v,i)=>{const X=bx+i/(arr.length-1)*bw,Y=by+bh*(.2+k*.28)+v*bh*.12;i?x.lineTo(X,Y):x.moveTo(X,Y)});x.stroke()});x.globalAlpha=1;
  x.font=`${12*d}px "Chakra Petch", monospace`;x.fillStyle=t.mute;const s=Math.floor(a*20);x.fillText('T+'+[s/3600|0,(s/60|0)%60,s%60].map(v=>String(v).padStart(2,'0')).join(':'),bx,by+bh+18*d);x.fillText('ALT '+(412+Math.sin(a)*3).toFixed(1)+' KM',bx+bw*.5,by+bh+18*d)}
 size();if(still){a=4;for(let i=0;i<70;i++){a+=.03;draw()}return()=>{}}let last=0;const loop=n=>{raf=requestAnimationFrame(loop);if(n-last<30)return;last=n;a+=.02;draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
kids(c,t,still){const x=c.getContext('2d');let W,H,d,raf,B=[],C=[],gy;const cols=[t.accent,t.accent2,t.accent3||t.accent,'#FFC93C','#B57BFF'];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;gy=H*.84;B=Array.from({length:6},(_,i)=>{const r=(22+Math.random()*26)*d,hm=H*(.25+Math.random()*.35);return{x:W*(.1+i*.16),y:gy-r-Math.random()*hm,vx:(Math.random()-.5)*90*d,vy:0,r,vb:Math.sqrt(2*900*d*hm),c:cols[i%cols.length]}});C=Array.from({length:5},(_,i)=>({x:Math.random()*W,y:H*(.08+Math.random()*.3),s:(30+Math.random()*30)*d,v:(8+Math.random()*12)*d}))}
 function cloud(X,Y,s){x.beginPath();x.arc(X,Y,s,0,Math.PI*2);x.arc(X+s,Y-s*.4,s*1.1,0,Math.PI*2);x.arc(X+s*2.1,Y,s*.9,0,Math.PI*2);x.rect(X,Y,s*2.1,s*.9);x.fill()}
 function draw(dt){let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#CFEBFF');g.addColorStop(.7,t.bg);x.fillStyle=g;x.fillRect(0,0,W,H);x.fillStyle='#FFFFFF';C.forEach(cl=>{cl.x+=cl.v*dt;if(cl.x>W+cl.s)cl.x=-cl.s*3.2;cloud(cl.x,cl.y,cl.s)});
  x.fillStyle=t.accent3||'#6CCB4B';x.beginPath();x.moveTo(0,H);for(let X=0;X<=W;X+=10*d)x.lineTo(X,gy+Math.sin(X/W*Math.PI*2)*8*d);x.lineTo(W,H);x.fill();
  B.forEach(b=>{b.vy+=900*d*dt;b.y+=b.vy*dt;b.x+=b.vx*dt;if(b.x<b.r||b.x>W-b.r){b.vx*=-1;b.x=Math.max(b.r,Math.min(W-b.r,b.x))}if(b.y+b.r>gy){b.y=gy-b.r;b.vy=-b.vb}
   const near=Math.max(0,1-(gy-(b.y+b.r))/(b.r*.6)),sy=1-.22*near,sx=1+.22*near;x.save();x.translate(b.x,b.y+b.r*(1-sy));x.scale(sx,sy);x.beginPath();x.arc(0,0,b.r,0,Math.PI*2);x.fillStyle=b.c;x.fill();x.lineWidth=3*d;x.strokeStyle=t.ink;x.stroke();
   x.fillStyle=t.ink;x.beginPath();x.arc(-b.r*.3,-b.r*.15,b.r*.1,0,Math.PI*2);x.arc(b.r*.3,-b.r*.15,b.r*.1,0,Math.PI*2);x.fill();x.beginPath();x.arc(0,b.r*.1,b.r*.35,.2*Math.PI,.8*Math.PI);x.lineWidth=2.5*d;x.stroke();x.restore()})}
 size();if(still){draw(0);return()=>{}}let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);const dt=Math.min(.04,(n-last)/1000);last=n;draw(dt)};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
kinetic(c,t,still){const x=c.getContext('2d');let W,H,d,raf,S=[],off=0;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;S=Array.from({length:80},()=>({x:Math.random()*W*2,y:Math.random()*H*2,len:(40+Math.random()*260)*d,v:(600+Math.random()*1400)*d,w:(1+Math.random()*4)*d,c:Math.random()<.3?t.accent:Math.random()<.1?t.accent2:t.ink,al:.2+Math.random()*.7}))}
 function draw(dt){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.save();x.translate(W/2,H/2);x.rotate(-.21);x.translate(-W,-H);
  for(let i=0;i<10;i++){x.fillStyle=i%2?'rgba(255,255,255,.03)':'rgba(255,255,255,0)';x.fillRect(0,i*H*.2,W*2,H*.2);x.fillStyle='rgba(255,255,255,.08)';x.fillRect(0,i*H*.2,W*2,d)}
  off=(off+dt*60*d)%(W*1.2);x.font=`${H*1.1}px Anton, Impact, sans-serif`;x.lineWidth=3*d;x.strokeStyle=t.accent;x.globalAlpha=.28;x.strokeText('23',W*1.6-off,H*1.45);x.strokeText('23',W*2.8-off,H*1.45);x.globalAlpha=1;
  S.forEach(s=>{s.x-=s.v*dt;if(s.x+s.len<0){s.x=W*2+Math.random()*W;s.y=Math.random()*H*2}x.globalAlpha=s.al;x.fillStyle=s.c;x.fillRect(s.x,s.y,s.len,s.w)});x.globalAlpha=1;x.restore()}
 size();if(still){draw(.3);return()=>{}}let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(n-last)/1000);last=n;draw(dt)};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
desert(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0;const cols=['#EDC59A','#DE9A68',t.accent,'#6E2E17'];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function draw(){let g=x.createLinearGradient(0,0,0,H*.6);g.addColorStop(0,t.bg);g.addColorStop(1,'#F6C79E');x.fillStyle=g;x.fillRect(0,0,W,H);
  const sx=W*.64,r=Math.min(W,H)*.2,sy=H*.5+Math.sin(a*.15)*H*.03;x.fillStyle=t.accent3||'#E3A23C';x.beginPath();x.arc(sx,sy,r,0,Math.PI*2);x.fill();
  x.strokeStyle=t.accent;x.lineWidth=2*d;[1.35,1.6].forEach((m,i)=>{x.globalAlpha=.4-i*.12;x.beginPath();x.moveTo(sx-r*m,H*.62);x.lineTo(sx-r*m,sy-r*.2);x.arc(sx,sy-r*.2,r*m,Math.PI,0);x.lineTo(sx+r*m,H*.62);x.stroke()});x.globalAlpha=1;
  x.strokeStyle='#FFFFFF';x.lineWidth=d;for(let k=0;k<5;k++){x.globalAlpha=.3;x.beginPath();for(let X=0;X<=W;X+=6*d)x.lineTo(X,H*.53+k*7*d+Math.sin(X*.02/d+a*3+k)*2*d);x.stroke()}x.globalAlpha=1;
  cols.forEach((col,i)=>{x.fillStyle=col;x.beginPath();x.moveTo(0,H);for(let X=0;X<=W;X+=8*d)x.lineTo(X,H*(.6+i*.09)+Math.sin(X/W*Math.PI*(1+i*.6)+i*1.7+a*.05*(i+1))*H*.04+Math.sin(X/W*7+i)*H*.008);x.lineTo(W,H);x.fill()})}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.01;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}}
};

const S='http://www.w3.org/2000/svg',sv=(w,h,body)=>`<svg xmlns="${S}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const PAT={
 swiss:t=>sv(80,80,`<rect width="80" height="80" fill="${t.bg}"/><path d="M0 .5h80M.5 0v80M40 0v80" stroke="${t.line}"/><rect x="4" y="4" width="32" height="12" fill="${t.ink}"/><circle cx="60" cy="60" r="12" fill="${t.accent}"/>`),
 wabi:t=>sv(80,40,`<rect width="80" height="40" fill="${t.bg}"/><g fill="none" stroke="${t.line}" stroke-width="1.5">${[0,40,80].map(cx=>[20,14,8].map(r=>`<path d="M${cx-r} 40a${r} ${r} 0 0 1 ${2*r} 0"/>`).join('')).join('')}${[20,60].map(cx=>[20,14,8].map(r=>`<path d="M${cx-r} 20a${r} ${r} 0 0 1 ${2*r} 0"/>`).join('')).join('')}</g>`),
 pastel:t=>sv(80,80,`<rect width="80" height="80" fill="${t.bg}"/><circle cx="20" cy="20" r="9" fill="${t.accent}" stroke="${t.ink}" stroke-width="2"/><path d="M44 58q6-8 12 0t12 0" fill="none" stroke="${t.ink}" stroke-width="2.5" stroke-linecap="round"/><rect x="48" y="12" width="20" height="14" rx="5" fill="${t.accent2}" stroke="${t.ink}" stroke-width="2"/><circle cx="20" cy="62" r="2" fill="${t.ink}"/>`),
 riso:t=>sv(40,40,`<rect width="40" height="40" fill="${t.bg}"/><g fill="${t.accent}" fill-opacity=".85">${[[5,5,4],[25,5,3],[15,15,4],[35,15,2],[5,25,2.5],[25,25,4]].map(([a,b,r])=>`<circle cx="${a}" cy="${b}" r="${r}"/>`).join('')}</g><g fill="${t.accent2}" fill-opacity=".7">${[[8,8,3],[28,10,4],[18,30,4],[36,32,3],[6,34,2]].map(([a,b,r])=>`<circle cx="${a}" cy="${b}" r="${r}"/>`).join('')}</g>`),
 solarpunk:t=>sv(80,80,`<rect width="80" height="80" fill="${t.bg}"/><path d="M20 60c0-14 10-24 24-24-1 14-10 24-24 24z" fill="${t.accent}" fill-opacity=".8"/><path d="M20 60l18-18" stroke="${t.ink}" stroke-width="1.5"/><circle cx="62" cy="18" r="7" fill="${t.accent2}"/><circle cx="62" cy="62" r="2" fill="${t.accent3}"/>`),
 nordic:t=>sv(60,40,`<rect width="60" height="40" fill="${t.bg}"/><path d="M0 34l12-14 8 8 10-14 14 20M30 34l10-10 8 8 12-12" fill="none" stroke="${t.line}" stroke-width="1.5" stroke-linejoin="round"/>`),
 noir:t=>sv(40,40,`<rect width="40" height="40" fill="${t.bg}"/><path d="M0 20 20 0 40 20 20 40z" fill="none" stroke="${t.accent}" stroke-opacity=".35"/><circle cx="20" cy="20" r="1.5" fill="${t.accent}" fill-opacity=".7"/>`),
 crt:t=>sv(48,48,`<rect width="48" height="48" fill="${t.bg}"/><g fill="${t.line}">${Array.from({length:16},(_,i)=>`<rect y="${i*3}" width="48" height="1"/>`).join('')}</g><path d="M10 16l6 6-6 6M20 30h10" fill="none" stroke="${t.accent}" stroke-width="2"/>`),
 memphis:t=>sv(96,96,`<rect width="96" height="96" fill="${t.bg}"/><path d="M8 20q6-10 12 0t12 0 12 0" fill="none" stroke="${t.accent}" stroke-width="4" stroke-linecap="round"/><path d="M60 70l12-20 12 20z" fill="${t.accent2}" stroke="${t.ink}" stroke-width="2"/><circle cx="24" cy="70" r="10" fill="${t.accent3}"/><g fill="${t.ink}">${[0,1,2,3].map(i=>`<circle cx="${60+i*8}" cy="16" r="2"/>`).join('')}</g>`),
 botanical:t=>sv(80,80,`<rect width="80" height="80" fill="${t.bg}"/><g fill="none" stroke="${t.accent}" stroke-width="1.2" stroke-linecap="round"><path d="M20 70C22 50 30 36 44 26"/>${[[24,56,-1],[28,46,1],[33,38,-1],[39,31,1]].map(([a,b,s])=>`<ellipse cx="${a+s*6}" cy="${b-3}" rx="7" ry="2.6" transform="rotate(${s*-35} ${a+s*6} ${b-3})"/>`).join('')}</g><circle cx="62" cy="62" r="2" fill="${t.accent2}"/>`),
 arctic:t=>sv(56,56,`<rect width="56" height="56" fill="${t.bg}"/><g stroke="${t.accent}" stroke-opacity=".45" stroke-linecap="round"><path d="M28 16v24M17.6 22l20.8 12M17.6 34l20.8-12"/></g><circle cx="4" cy="4" r="1" fill="${t.ink}" fill-opacity=".5"/>`),
 mission:t=>sv(48,48,`<rect width="48" height="48" fill="${t.bg}"/><path d="M0 .5h48M.5 0v48" stroke="${t.line}"/><path d="M24 20v8M20 24h8" stroke="${t.mute}" stroke-opacity=".7"/>`),
 kids:t=>sv(64,64,`<rect width="64" height="64" fill="${t.bg}"/><circle cx="16" cy="16" r="7" fill="${t.accent}"/><circle cx="48" cy="20" r="5" fill="${t.accent2}"/><circle cx="32" cy="46" r="8" fill="${t.accent3}"/><circle cx="56" cy="54" r="3" fill="${t.accent}"/>`),
 kinetic:t=>sv(40,40,`<rect width="40" height="40" fill="${t.bg}"/><path d="M-10 50 50-10M10 50 50 10M-10 30 30-10" stroke="${t.line}" stroke-width="4"/><path d="M30 50 50 30" stroke="${t.accent}" stroke-width="4"/>`),
 desert:t=>sv(60,60,`<rect width="60" height="60" fill="${t.bg}"/><path d="M8 60V30a22 22 0 0 1 44 0v30" fill="none" stroke="${t.line}" stroke-width="2"/><circle cx="30" cy="34" r="8" fill="${t.accent3}"/>`)
};
const MARK={
 swiss:t=>`<rect x="4" y="4" width="56" height="56" fill="${t.ink}"/><circle cx="42" cy="22" r="13" fill="${t.accent}"/><rect x="12" y="38" width="22" height="6" fill="#FFFFFF"/>`,
 wabi:t=>`<path d="M48.5 13.5A23 23 0 1 0 54 30" fill="none" stroke="${t.ink}" stroke-width="7" stroke-linecap="round"/><rect x="46" y="46" width="12" height="12" fill="${t.accent}"/>`,
 pastel:t=>`<rect x="9" y="9" width="50" height="50" rx="14" fill="${t.ink}"/><rect x="4" y="4" width="50" height="50" rx="14" fill="${t.accent}" stroke="${t.ink}" stroke-width="3"/><path d="M29 14l3.6 8 8.4.8-6.4 5.6 2 8.4-7.6-4.6-7.6 4.6 2-8.4-6.4-5.6 8.4-.8z" fill="${t.accent2}" stroke="${t.ink}" stroke-width="2.5" stroke-linejoin="round"/>`,
 riso:t=>`<circle cx="24" cy="30" r="20" fill="${t.accent}" style="mix-blend-mode:multiply"/><circle cx="40" cy="34" r="20" fill="${t.accent2}" fill-opacity=".85" style="mix-blend-mode:multiply"/>`,
 solarpunk:t=>`<circle cx="40" cy="22" r="14" fill="${t.accent2}"/><path d="M8 56c0-22 16-36 38-36-2 22-16 36-38 36z" fill="${t.accent}"/><path d="M8 56 34 32" stroke="${t.bg}" stroke-width="2.5" stroke-linecap="round"/>`,
 nordic:t=>`<path d="M6 48 22 28l10 12 10-14 16 22" fill="none" stroke="${t.accent}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="46" cy="14" r="5" fill="${t.accent2}"/><path d="M6 56h52" stroke="${t.ink}" stroke-width="3" stroke-linecap="round"/>`,
 noir:t=>`<circle cx="32" cy="32" r="27" fill="none" stroke="${t.accent}" stroke-width="1.5"/><path d="M38 12a20 20 0 1 0 0 40 16 16 0 1 1 0-40z" fill="${t.accent}"/><circle cx="44" cy="22" r="2" fill="${t.accent}"/>`,
 crt:t=>`<rect x="4" y="8" width="56" height="42" rx="6" fill="${t.surface}" stroke="${t.accent}" stroke-width="3"/><path d="M14 20l8 8-8 8M28 38h12" fill="none" stroke="${t.accent}" stroke-width="3.5"/><path d="M22 58h20" stroke="${t.accent}" stroke-width="3"/>`,
 memphis:t=>`<circle cx="22" cy="24" r="16" fill="${t.accent}" stroke="${t.ink}" stroke-width="3"/><path d="M34 58 48 32l14 26z" fill="${t.accent2}" stroke="${t.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M6 52l6-6 6 6 6-6 6 6" fill="none" stroke="${t.accent3}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
 botanical:t=>`<circle cx="32" cy="32" r="28" fill="none" stroke="${t.ink}" stroke-width="1.5"/><path d="M32 52V18" stroke="${t.accent}" stroke-width="2" stroke-linecap="round"/><path d="M32 30c-10-2-14-8-14-14 8 0 13 5 14 14zM32 40c10-2 14-8 14-14-8 0-13 5-14 14z" fill="${t.accent}"/><circle cx="32" cy="16" r="3" fill="${t.accent2}"/>`,
 arctic:t=>`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.accent3}"/><stop offset="1" stop-color="${t.accent2}"/></linearGradient></defs><path d="M32 4 56 18v28L32 60 8 46V18z" fill="url(#g)" fill-opacity=".25" stroke="url(#g)" stroke-width="2.5"/><path d="M32 14v36M16 23l32 18M16 41l32-18" stroke="${t.ink}" stroke-width="2.5" stroke-linecap="round"/>`,
 mission:t=>`<circle cx="32" cy="32" r="12" fill="${t.surface}" stroke="${t.ink}" stroke-width="2.5"/><ellipse cx="32" cy="32" rx="28" ry="11" transform="rotate(-25 32 32)" fill="none" stroke="${t.accent2}" stroke-width="2"/><rect x="51" y="16" width="7" height="7" fill="${t.accent}"/>`,
 kids:t=>`<circle cx="32" cy="32" r="27" fill="${t.accent}" stroke="${t.ink}" stroke-width="3.5"/><circle cx="23" cy="27" r="3.5" fill="${t.ink}"/><circle cx="41" cy="27" r="3.5" fill="${t.ink}"/><path d="M21 38q11 10 22 0" fill="none" stroke="${t.ink}" stroke-width="3.5" stroke-linecap="round"/><circle cx="50" cy="12" r="6" fill="${t.accent2}" stroke="${t.ink}" stroke-width="2.5"/>`,
 kinetic:t=>`<path d="M18 6h42L46 58H4z" fill="${t.accent}"/><path d="M22 22l10 10-10 10M34 22l10 10-10 10" fill="none" stroke="${t.onAccent}" stroke-width="5"/>`,
 desert:t=>`<path d="M10 60V30a22 22 0 0 1 44 0v30z" fill="${t.accent}"/><circle cx="32" cy="34" r="10" fill="${t.accent3}"/><path d="M10 50h44" stroke="${t.bg}" stroke-width="3"/>`
};
const DIV={
 swiss:t=>`<rect y="4" width="400" height="8" fill="${t.ink}"/><rect y="17" width="400" height="1" fill="${t.ink}"/><rect y="4" width="40" height="8" fill="${t.accent}"/>`,
 wabi:t=>`<path d="M10 13c80-6 200-4 380-2-150 3-300 5-380 2z" fill="${t.ink}" fill-opacity=".8"/><rect x="194" y="6" width="12" height="12" fill="${t.accent}"/>`,
 pastel:t=>`<path d="M4 12${Array.from({length:16},(_,i)=>` q6 ${i%2?8:-8} 12 0 t12 0`).slice(0,16).join('')}" fill="none" stroke="${t.ink}" stroke-width="3" stroke-linecap="round"/>`,
 riso:t=>`<path d="M0 10h400" stroke="${t.accent}" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round"/><path d="M3 14h400" stroke="${t.accent2}" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round" stroke-opacity=".8"/>`,
 solarpunk:t=>`<path d="M0 12C100 4 300 20 400 12" fill="none" stroke="${t.accent}" stroke-width="2"/>${[60,140,220,300].map((v,i)=>`<path d="M${v} ${i%2?13:10}c6-8 14-8 18-6-4 6-12 8-18 6z" fill="${t.accent}"/>`).join('')}<circle cx="200" cy="12" r="5" fill="${t.accent2}"/>`,
 nordic:t=>`<path d="M0 12h184M216 12h184" stroke="${t.line}" stroke-width="1.5"/><path d="M200 5l7 7-7 7-7-7z" fill="${t.accent}"/>`,
 noir:t=>`<path d="M0 12h175M225 12h175" stroke="${t.accent}" stroke-width=".75"/><circle cx="200" cy="12" r="7" fill="none" stroke="${t.accent}"/><circle cx="200" cy="12" r="2" fill="${t.accent}"/>`,
 crt:t=>`<g fill="${t.accent}">${Array.from({length:25},(_,i)=>`<rect x="${i*16}" y="9" width="10" height="6"/>`).join('')}</g>`,
 memphis:t=>`<path d="M0 16${Array.from({length:20},(_,i)=>` l10 ${i%2?8:-8}`).join('')}" transform="translate(0 -4)" fill="none" stroke="${t.accent}" stroke-width="4" stroke-linejoin="round"/><circle cx="380" cy="12" r="6" fill="${t.accent3}"/>`,
 botanical:t=>`<path d="M20 12h360" stroke="${t.accent}" stroke-width="1.2"/>${[80,140,200,260,320].map(v=>`<ellipse cx="${v}" cy="7" rx="9" ry="3" fill="none" stroke="${t.accent}" transform="rotate(-20 ${v} 7)"/><ellipse cx="${v+10}" cy="17" rx="9" ry="3" fill="none" stroke="${t.accent}" transform="rotate(20 ${v+10} 17)"/>`).join('')}`,
 arctic:t=>`<path d="M0 12h180M220 12h180" stroke="${t.accent}" stroke-opacity=".6"/><path d="M200 2v20M191.3 7l17.4 10M191.3 17l17.4-10" stroke="${t.accent}" stroke-width="1.5" stroke-linecap="round"/>`,
 mission:t=>`<path d="M0 12h400" stroke="${t.line}"/>${Array.from({length:41},(_,i)=>`<path d="M${i*10} ${i%5?9:5}v${i%5?6:14}" stroke="${t.mute}"/>`).join('')}<path d="M236 2l6 8 6-8z" fill="${t.accent}"/>`,
 kids:t=>`<path d="M0 14${Array.from({length:20},()=>' a10 10 0 0 1 20 0').join('')}" fill="none" stroke="${t.accent2}" stroke-width="4" stroke-linecap="round"/>`,
 kinetic:t=>`${[0,1,2,3,4].map(i=>`<path d="M${i*70} 20l14-16h${50-i*8}l-14 16z" fill="${i?t.ink:t.accent}" fill-opacity="${1-i*.17}"/>`).join('')}`,
 desert:t=>`<path d="M0 18h176M224 18h176" stroke="${t.accent}" stroke-width="1.5"/><path d="M184 22V12a16 16 0 0 1 32 0v10" fill="none" stroke="${t.accent}" stroke-width="2"/><circle cx="200" cy="14" r="4" fill="${t.accent3}"/>`
};
TK.list.push(...K);Object.assign(TK.BG,BG);Object.assign(TK.PAT,PAT);Object.assign(TK.MARK,MARK);Object.assign(TK.DIV,DIV);
})();
