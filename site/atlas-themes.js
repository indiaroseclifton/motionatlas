'use strict';
/* Atlas style themes: tokens shared by the component lab, the landing effects lab and the
   new style entries. S01-S12 interpret the existing visual styles; S13-S20 are the new styles.
   Each theme has light and dark token sets, fonts (Google Fonts) and surface treatment. */
window.AtlasThemes=(()=>{
 const T=(id,name,fonts,light,dark,shape)=>({id,name,fonts,light,dark,shape});
 // token order: bg, surface, text, muted, line, accent, onAccent, danger, success, warn
 const k=(bg,surface,text,muted,line,accent,onAccent,danger='#c2410c',success='#15803d',warn='#a16207')=>({bg,surface,text,muted,line,accent,onAccent,danger,success,warn});
 const list=[
  T('S01','Editorial minimalism',{display:'Newsreader',body:'Source Sans 3'},k('#faf8f3','#ffffff','#1b1a17','#5f5b52','#e4dfd3','#1b1a17','#faf8f3','#b42318','#2f6b3a'),k('#151412','#1d1c19','#f1ede4','#a9a397','#33302a','#f1ede4','#151412','#f97066','#86c99a'),{radius:2,bw:1,shadow:'none',weight:500}),
  T('S02','Swiss / typographic',{display:'Archivo',body:'Archivo'},k('#ffffff','#ffffff','#0a0a0a','#4b4b4b','#0a0a0a','#e2231a','#ffffff','#e2231a','#0a7d32'),k('#0a0a0a','#111111','#f5f5f5','#b5b5b5','#f5f5f5','#ff3b30','#0a0a0a','#ff3b30','#3ddc84'),{radius:0,bw:2,shadow:'none',weight:700}),
  T('S03','Warm organic',{display:'Fraunces',body:'Nunito Sans'},k('#f4efe6','#fbf8f2','#2b2a24','#6b6656','#e2d9c8','#5f7a3d','#fbf8f2','#b5452a','#3f7a3a'),k('#1a1915','#24221d','#efe9dc','#b0a891','#3a362d','#a9c27e','#1a1915','#f08a6c','#9fd08f'),{radius:14,bw:1,shadow:'0 8px 24px -14px rgba(60,48,20,.35)',weight:600}),
  T('S04','Soft tactile',{display:'Nunito',body:'Nunito'},k('#e8ecef','#e8ecef','#2d3748','#5f6b7a','#d5dbe1','#3d5ce6','#ffffff','#e5484d','#30a46c'),k('#22262c','#22262c','#e6ebf0','#9aa5b1','#2f343b','#8ba1ff','#14161a','#ff6369','#4cc38a'),{radius:16,bw:0,shadow:'6px 6px 14px rgba(163,177,198,.6),-6px -6px 14px rgba(255,255,255,.9)',shadowDark:'6px 6px 14px rgba(0,0,0,.45),-6px -6px 14px rgba(255,255,255,.04)',weight:700}),
  T('S05','Glass / translucent',{display:'Manrope',body:'Manrope'},k('#dbe7f3','rgba(255,255,255,.55)','#0f172a','#475569','rgba(255,255,255,.7)','#2563eb','#ffffff','#dc2626','#16a34a'),k('#0b1220','rgba(30,41,59,.55)','#e2e8f0','#94a3b8','rgba(148,163,184,.25)','#60a5fa','#0b1220','#f87171','#4ade80'),{radius:16,bw:1,shadow:'0 10px 30px -12px rgba(15,23,42,.35)',glass:true,backdrop:'radial-gradient(circle at 15% 20%,#a5d8ff,transparent 45%),radial-gradient(circle at 85% 30%,#d0bfff,transparent 45%),radial-gradient(circle at 50% 90%,#b2f2bb,transparent 50%)',weight:600}),
  T('S06','Spatial soft 3D',{display:'Plus Jakarta Sans',body:'Plus Jakarta Sans'},k('#eef0f6','#ffffff','#14152b','#5d6080','#e3e5f0','#6d5efc','#ffffff','#e5484d','#12a594'),k('#11121f','#1a1b2e','#ecedf7','#9b9dc0','#2a2c45','#9d92ff','#11121f','#ff6b70','#3dd6c4'),{radius:22,bw:0,shadow:'0 24px 48px -24px rgba(40,40,110,.35),0 2px 6px rgba(40,40,110,.08)',weight:700}),
  T('S07','Bento / modular',{display:'Space Grotesk',body:'Space Grotesk'},k('#f3f3f1','#ffffff','#111111','#5c5c5c','#e3e3df','#ff5a1f','#1a0a00','#d92d20','#16803c'),k('#101010','#1a1a1a','#f2f2f0','#a3a3a0','#2c2c2c','#ff7a45','#101010','#f97066','#47cd89'),{radius:18,bw:1,shadow:'none',weight:600}),
  T('S08','Neo-brutalist',{display:'Archivo Black',body:'Space Mono'},k('#fffbe6','#ffffff','#000000','#333333','#000000','#ffd400','#000000','#ff3b30','#00a650'),k('#111111','#1c1c1c','#fffbe6','#cfcab0','#fffbe6','#ffd400','#000000','#ff6b5e','#3ddc84'),{radius:0,bw:3,shadow:'4px 4px 0 #000',shadowDark:'4px 4px 0 #fffbe6',weight:400}),
  T('S09','Illustrated / hand-drawn',{display:'Caveat',body:'Nunito'},k('#fffdf7','#ffffff','#2a2622','#6b625a','#2a2622','#e26d5c','#1f0f0c','#c2410c','#3b7d3a'),k('#1b1916','#24211d','#f3ede4','#b7ab9c','#f3ede4','#f29486','#1b1916','#fb923c','#8bd17c'),{radius:'255px 15px 225px 15px/15px 225px 15px 255px',bw:2,shadow:'2px 3px 0 rgba(42,38,34,.85)',weight:700}),
  T('S10','Retro phosphor',{display:'VT323',body:'IBM Plex Mono'},k('#eef6ee','#ffffff','#0b3d0b','#2f6b2f','#7fbf7f','#0a7f00','#eef6ee','#b00020','#0a7f00'),k('#071007','#0b170b','#9cff9c','#5fbf5f','#1f4d1f','#39ff14','#071007','#ff5470','#39ff14'),{radius:0,bw:1,shadow:'none',shadowDark:'0 0 12px rgba(57,255,20,.25)',weight:500,darkFirst:true}),
  T('S11','Chromatic / luminous',{display:'Sora',body:'Sora'},k('#f7f5ff','#ffffff','#17112e','#5c5480','#e6e1fa','#7c3aed','#ffffff','#e11d48','#059669'),k('#0e0b1f','#171331','#efeaff','#a59dcc','#2a2450','#c084fc','#0e0b1f','#fb7185','#34d399'),{radius:14,bw:1,shadow:'0 0 0 1px rgba(192,132,252,.15),0 14px 40px -16px rgba(139,92,246,.55)',gradient:'linear-gradient(120deg,#c084fc,#22d3ee)',weight:600,darkFirst:true}),
  T('S12','Technical / scientific',{display:'IBM Plex Sans',body:'IBM Plex Sans'},k('#f6f8fa','#ffffff','#0d1117','#57606a','#d0d7de','#0b5fff','#ffffff','#cf222e','#1a7f37'),k('#0d1117','#161b22','#e6edf3','#8d96a0','#30363d','#4c8dff','#0d1117','#ff7b72','#3fb950'),{radius:4,bw:1,shadow:'none',weight:600}),
  T('S13','Liquid glass',{display:'Figtree',body:'Figtree'},k('#cfe3ff','rgba(255,255,255,.42)','#0b1324','#3d4a63','rgba(255,255,255,.75)','#0071e3','#ffffff','#ff3b30','#30d158'),k('#05070f','rgba(40,48,70,.42)','#f2f6ff','#a8b3cc','rgba(255,255,255,.18)','#4aa3ff','#05070f','#ff6961','#4cd964'),{radius:24,bw:1,shadow:'inset 0 1px 0 rgba(255,255,255,.8),inset 0 -1px 0 rgba(255,255,255,.25),0 18px 40px -18px rgba(10,30,80,.45)',glass:true,liquid:true,backdrop:'radial-gradient(circle at 20% 25%,#ff9ec7,transparent 40%),radial-gradient(circle at 80% 20%,#7cc4ff,transparent 42%),radial-gradient(circle at 60% 85%,#ffe08a,transparent 45%),linear-gradient(135deg,#b9d4ff,#e9d5ff)',weight:600}),
  T('S14','Aurora / mesh gradient',{display:'Outfit',body:'Outfit'},k('#f5f3ff','rgba(255,255,255,.78)','#1c1433','#5b5275','#e4defa','#7c3aed','#ffffff','#e11d48','#059669'),k('#090616','rgba(23,17,45,.72)','#f1edff','#a79fc7','#2b2350','#a78bfa','#090616','#fb7185','#34d399'),{radius:16,bw:1,shadow:'0 20px 50px -24px rgba(124,58,237,.45)',glass:true,backdrop:'radial-gradient(60% 80% at 10% 10%,#c4b5fd 0,transparent 60%),radial-gradient(50% 70% at 90% 20%,#67e8f9 0,transparent 60%),radial-gradient(60% 70% at 50% 100%,#f9a8d4 0,transparent 60%)',backdropDark:'radial-gradient(60% 80% at 10% 10%,#4c1d95 0,transparent 60%),radial-gradient(50% 70% at 90% 20%,#155e75 0,transparent 60%),radial-gradient(60% 70% at 50% 100%,#831843 0,transparent 60%)',weight:600}),
  T('S15','Claymorphism',{display:'Baloo 2',body:'Baloo 2'},k('#f6e9ff','#fff5fb','#3a1f4d','#7a5c8c','#ecd6f7','#ff6fae','#3a1f4d','#f43f5e','#22c55e'),k('#1e1428','#2a1d38','#fbeaff','#c3a6d4','#3a2a4d','#ff8cc0','#1e1428','#fb7185','#4ade80'),{radius:28,bw:0,shadow:'inset -6px -6px 12px rgba(120,60,150,.18),inset 6px 6px 12px rgba(255,255,255,.9),10px 14px 24px -10px rgba(120,60,150,.35)',shadowDark:'inset -6px -6px 12px rgba(0,0,0,.35),inset 6px 6px 12px rgba(255,255,255,.08),10px 14px 24px -10px rgba(0,0,0,.6)',weight:700}),
  T('S16','Editorial maximalism',{display:'Playfair Display',body:'Libre Franklin'},k('#f1e9db','#fbf6ec','#1d1a16','#5c5246','#1d1a16','#c2410c','#fbf6ec','#9f1239','#166534'),k('#17130f','#211b15','#f4ece0','#bfb2a0','#f4ece0','#fb923c','#17130f','#fb7185','#86efac'),{radius:0,bw:2,shadow:'8px 8px 0 #c2410c',shadowDark:'8px 8px 0 #fb923c',weight:700,italic:true}),
  T('S17','Anti-design',{display:'Times New Roman',body:'Arial',system:true},k('#ffffff','#ffffff','#000000','#000000','#000000','#0000ee','#ffffff','#ff0000','#008000'),k('#000000','#000000','#ffffff','#ffffff','#ffffff','#7f7fff','#000000','#ff4040','#40ff40'),{radius:0,bw:1,shadow:'none',weight:400,tilt:true}),
  T('S18','Solarpunk',{display:'DM Serif Display',body:'DM Sans'},k('#f2f5e9','#fbfcf6','#1f2a1c','#56644e','#d9e2c7','#2f7d32','#fbfcf6','#b4441f','#2f7d32','#b58b2a'),k('#10160e','#182117','#eaf2dc','#a3b393','#2c3a27','#7fc97f','#10160e','#f08a5d','#7fc97f','#e0b54f'),{radius:999,bw:1,shadow:'0 10px 24px -16px rgba(47,125,50,.45)',weight:500,pill:true}),
  T('S19','Terminal / CLI',{display:'JetBrains Mono',body:'JetBrains Mono'},k('#f6f8fa','#ffffff','#1f2328','#59636e','#d1d9e0','#1a7f37','#ffffff','#cf222e','#1a7f37'),k('#0d1117','#010409','#e6edf3','#8d96a0','#30363d','#3fb950','#0d1117','#ff7b72','#3fb950'),{radius:4,bw:1,shadow:'none',weight:600,darkFirst:true,mono:true}),
  T('S20','Zine / riso print',{display:'Bebas Neue',body:'Courier Prime'},k('#fdf6e3','#fffaf0','#1a1a2e','#4a4a5e','#1a1a2e','#ff48b0','#1a1a2e','#e4002b','#00a95c'),k('#141420','#1c1c2b','#fdf6e3','#c9c2ad','#fdf6e3','#ff48b0','#141420','#ff5a5f','#3ddc97'),{radius:0,bw:2,shadow:'3px 3px 0 #0078bf',shadowDark:'3px 3px 0 #0078bf',weight:400,riso:true}),
  T('S21','Cyanotype',{display:'Barlow Condensed',body:'IBM Plex Mono'},k('#eef3f9','#f8fbfe','#123a75','#3f5f8f','#9fb4d3','#123a75','#ffffff','#b42318','#1f7a4d'),k('#163f7d','#1b4a8f','#eef4ff','#c3d2ec','rgba(238,244,255,.5)','#ffffff','#163f7d','#ffb4a8','#9be7c0'),{radius:0,bw:1,shadow:'none',weight:600,mono:false,backdrop:'linear-gradient(rgba(18,58,117,.07) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(18,58,117,.07) 1px,transparent 1px) 0 0/24px 24px,#eef3f9',backdropDark:'linear-gradient(rgba(238,244,255,.08) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(238,244,255,.08) 1px,transparent 1px) 0 0/24px 24px,radial-gradient(120% 90% at 50% 40%,#1d4f96,#123468)'}),
  T('S22','Botanical plate',{display:'IM Fell English',body:'EB Garamond'},k('#f3ead6','#faf4e6','#2b2a22','#655e4a','#cbbd9a','#5b3f8c','#ffffff','#9b2d20','#4f6b3a'),k('#1f1d17','#2a271f','#efe6d0','#c4b99c','#4a4434','#c3b0ea','#1f1d17','#f0a090','#a9c48e'),{radius:2,bw:1,shadow:'0 1px 0 #cbbd9a, 0 10px 24px -18px rgba(60,45,20,.35)',shadowDark:'0 10px 24px -18px rgba(0,0,0,.6)',weight:400,backdrop:'radial-gradient(130% 100% at 50% 40%,#f7efdd,#e9dcbd)',backdropDark:'radial-gradient(130% 100% at 50% 40%,#2a271f,#17150f)'})
 ];
 const byId=Object.fromEntries(list.map(t=>[t.id,t]));
 const loaded=new Set();
 function loadFonts(t){
  if(t.shape.system)return;
  const fams=[...new Set([t.fonts.display,t.fonts.body])].filter(f=>!loaded.has(f));
  if(!fams.length)return;
  fams.forEach(f=>loaded.add(f));
  const l=document.createElement('link');l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?'+fams.map(f=>'family='+encodeURIComponent(f).replace(/%20/g,'+')+(/VT323|Caveat|Bebas|Archivo Black|DM Serif|IM Fell/.test(f)?'':':wght@400;500;600;700')).join('&')+'&display=swap';
  document.head.append(l);
 }
 function vars(t,mode='light',density='comfortable'){
  const c=t[mode],s=t.shape,dark=mode==='dark';
  const shadow=dark&&s.shadowDark?s.shadowDark:s.shadow;
  const backdrop=dark&&s.backdropDark?s.backdropDark:s.backdrop;
  const r=typeof s.radius==='number'?s.radius+'px':s.radius;
  const fam=f=>`"${f}",${s.mono||/Mono/.test(f)?'ui-monospace,monospace':/Serif|Newsreader|Fraunces|Playfair|Times|Fell|Garamond/.test(f)?'Georgia,serif':'system-ui,sans-serif'}`;
  return {
   '--cl-bg':c.bg,'--cl-surface':c.surface,'--cl-text':c.text,'--cl-muted':c.muted,'--cl-line':c.line,
   '--cl-accent':c.accent,'--cl-on-accent':c.onAccent,'--cl-danger':c.danger,'--cl-success':c.success,'--cl-warn':c.warn||c.danger,
   '--cl-radius':r,'--cl-radius-sm':typeof s.radius==='number'?Math.min(s.radius,12)+'px':r,'--cl-bw':s.bw+'px','--cl-shadow':shadow,
   '--cl-font':fam(t.fonts.body),'--cl-display':fam(t.fonts.display),'--cl-weight':s.weight,
   '--cl-backdrop':backdrop||c.bg,'--cl-glass':s.glass?'blur(18px) saturate(160%)':'none',
   '--cl-pad':density==='compact'?'6px 12px':'10px 18px','--cl-h':density==='compact'?'34px':'44px','--cl-gap':density==='compact'?'8px':'14px',
   '--cl-accent-grad':s.gradient||c.accent
  };
 }
 function tokensJSON(t,mode){const c=t[mode],s=t.shape;return {name:t.name,id:t.id,mode,color:{background:c.bg,surface:c.surface,text:c.text,muted:c.muted,line:c.line,accent:c.accent,onAccent:c.onAccent,danger:c.danger,success:c.success},type:{display:t.fonts.display,body:t.fonts.body,weight:s.weight},shape:{radius:s.radius,borderWidth:s.bw,shadow:mode==='dark'&&s.shadowDark?s.shadowDark:s.shadow}};}
 return {list,byId,loadFonts,vars,tokensJSON};
})();
