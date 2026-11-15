'use strict';
/* Mockup & social asset studio.
   One renderer, compose(W,H), draws background → device (with tilt, rotation and shadow) → words, badge and logo.
   Every size is laid out from relative units, so the preview, the size strip and each export preset all come
   from the same function. Images stay in this browser (IndexedDB); nothing is uploaded. */
(()=>{
/* Safari has no canvas filter, so there the blur is made by shrinking the picture in halves and drawing it back up */
function blurDraw(x,i,dx,dy,dw,dh,r,force){if(!(r>0)||('filter' in x&&!force)){x.save();if(r>0)x.filter=`blur(${r}px)`;x.drawImage(i,dx,dy,dw,dh);x.restore();return}
 const mk=(w,h,from)=>{const t=document.createElement('canvas');t.width=w;t.height=h;const c=t.getContext('2d');c.imageSmoothingQuality='high';c.drawImage(from,0,0,w,h);return t};
 let w=Math.max(2,Math.round(dw)),h=Math.max(2,Math.round(dh)),src=i,k=r*1.2,n=0;
 while(k>1&&w>8&&h>8){w=Math.max(2,Math.round(w/2));h=Math.max(2,Math.round(h/2));src=mk(w,h,src);k/=2;n++}
 for(;n>1;n--){w*=2;h*=2;src=mk(w,h,src)}
 x.save();x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(src,dx,dy,dw,dh);x.restore()}
const $=id=>document.getElementById(id);
const DV=window.MockupDevices;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PRESETS=[
 ['og','Open Graph','Link previews on most sites',1200,630],
 ['x','X / Twitter card','Large image post',1200,675],
 ['li','LinkedIn post','Shared image',1200,627],
 ['igsq','Instagram square','Feed post 1:1',1080,1080],
 ['igpt','Instagram portrait','Feed post 4:5',1080,1350],
 ['igst','Instagram story','Stories and Reels 9:16',1080,1920],
 ['yt','YouTube thumbnail','16:9',1280,720],
 ['dr','Dribbble shot','4:3',1600,1200],
 ['ph','Product Hunt gallery','Gallery image',1270,760],
 ['as','App Store 6.7″','iPhone screenshot',1290,2796]];
const FONTS=[['Inter',800],['Manrope',800],['Space Grotesk',700],['Bricolage Grotesque',800],['Fraunces',700],['DM Serif Display',400],['Playfair Display',700],['Cormorant Garamond',600],['Archivo Black',400],['JetBrains Mono',700]];
const SITE_PAGES=[['atlas.html#home','Atlas home'],['atlas.html#browse','Catalogue'],['atlas.html#systems','Design systems'],['atlas.html#backgrounds','Backgrounds'],['theme-kits.html','Theme kits'],['interactions.html','Interactions shelf'],['icons.html','Icon library'],['chart-styles.html','Chart style guides'],['chart-studio.html','Chart studio'],['diagram-studio.html','Diagram studio'],['page-builder.html','Page builder']];
const DEF={preset:'og',custom:[1500,1000],frame:'browser',color:'black',chrome:'light',url:'yourproduct.com',fit:'top',orient:'auto',
 bg:{type:'atlas',atlas:'velvet-0',solid:'#EEF0F6',g:['#5B2DFF','#FF7AC6','#FFD27A'],gType:'linear',angle:135,kit:'',kitStyle:'glow',dim:.25,blur:0,grain:.03},
 lay:{scale:1,rotate:0,tiltX:0,tiltY:0,pad:.08,shadow:.55,offX:0,offY:0},
 text:{head:'Your product, framed',cap:'Made with the Visual & Motion Atlas',font:'Inter',capFont:'Inter',size:1,color:'auto',pos:'auto',align:'auto'},
 badge:{text:'',pos:'above',color:'#111113'},logo:{pos:'br',size:.1},
 out:{fmt:'png',q:.92,pick:PRESETS.map(p=>p[0])}};
const clone=o=>JSON.parse(JSON.stringify(o));
let S=clone(DEF);
try{const s=JSON.parse(localStorage.getItem('atlas-mockup-v1')||'null');if(s&&typeof s==='object')S=merge(clone(DEF),s)}catch{}
function merge(a,b){for(const k of Object.keys(a)){if(b[k]===undefined)continue;if(a[k]&&typeof a[k]==='object'&&!Array.isArray(a[k]))merge(a[k],b[k]||{});else if(typeof b[k]===typeof a[k])a[k]=b[k]}return a}
const IMG={main:null,second:null,logo:null,bg:null};let SAMPLE=null,SAMPLE_M=null,title='';

/* ---------- storage: images in IndexedDB ---------- */
const idb=()=>idb.p||(idb.p=new Promise((res,rej)=>{let r;try{r=indexedDB.open('atlas-mockup',1)}catch(e){return rej(e)}r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));
async function kv(mode,fn){const d=await idb();return new Promise((res,rej)=>{const t=d.transaction('kv',mode),q=fn(t.objectStore('kv'));t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error)})}
const store=(k,blob)=>kv('readwrite',s=>blob?s.put(blob,k):s.delete(k)).catch(()=>{});
let saveT;function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem('atlas-mockup-v1',JSON.stringify(S))}catch{}},250)}

/* ---------- helpers ---------- */
const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c};
const rr=DV.rr;
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.decoding='async';i.onload=()=>res(i);i.onerror=()=>rej(Error('That file could not be read as an image.'));i.src=src})}
async function blobImg(b){if(window.createImageBitmap){try{return await createImageBitmap(b)}catch{}}const u=URL.createObjectURL(b);try{return await loadImg(u)}finally{setTimeout(()=>URL.revokeObjectURL(u),5000)}}
const hx=h=>{h=String(h).replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');const n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255]};
const lumRGB=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
function toast(t){const el=$('msToast');el.textContent=t;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('on'),2600)}
function status(t){$('msStatus').textContent=t}
const presetSize=id=>{if(id==='custom')return [S.custom[0],S.custom[1]];const p=PRESETS.find(p=>p[0]===id)||PRESETS[0];return [p[3],p[4]]};
const presetName=id=>id==='custom'?'Custom':(PRESETS.find(p=>p[0]===id)||PRESETS[0])[1];

/* ---------- sample screenshots (so the studio is never empty) ---------- */
function sample(mobile){const W=mobile?390:1440,H=mobile?844:900,c=canvas(W*2,H*2),x=c.getContext('2d');x.scale(2,2);
 x.fillStyle='#F6F7FB';x.fillRect(0,0,W,H);const acc='#111318';x.font='600 15px Inter, system-ui, sans-serif';
 const card=(X,Y,w,h)=>{rr(x,X,Y,w,h,14);x.fillStyle='#fff';x.fill();x.strokeStyle='#E4E7EE';x.lineWidth=1;x.stroke()};
 const line=(X,Y,w,col,h=10)=>{rr(x,X,Y,w,h,h/2);x.fillStyle=col||'#E4E7EE';x.fill()};
 const chart=(X,Y,w,h)=>{x.beginPath();for(let i=0;i<=24;i++){const px=X+i*w/24,py=Y+h*(.75-.45*Math.sin(i/3.2)*.6-.25*i/24-.05*Math.cos(i*1.7));i?x.lineTo(px,py):x.moveTo(px,py)}x.strokeStyle=acc;x.lineWidth=3;x.stroke();x.lineTo(X+w,Y+h);x.lineTo(X,Y+h);x.closePath();const g=x.createLinearGradient(0,Y,0,Y+h);g.addColorStop(0,'rgba(17,17,19,.14)');g.addColorStop(1,'rgba(17,17,19,0)');x.fillStyle=g;x.fill()};
 if(mobile){x.fillStyle='#1C1F2A';x.font='700 26px Inter, system-ui, sans-serif';x.fillText('Good morning',20,96);line(20,112,180,'#C9CDD8');
  card(16,140,W-32,190);x.fillStyle='#5F6577';x.font='500 13px Inter';x.fillText('Revenue this week',34,168);x.fillStyle='#1C1F2A';x.font='700 30px Inter';x.fillText('£48,210',34,204);chart(34,220,W-68,90);
  [0,1,2].forEach(i=>{card(16,348+i*86,W-32,72);rr(x,30,362+i*86,44,44,12);x.fillStyle=['#EDE7FF','#FFE8F3','#E3F6EC'][i];x.fill();line(88,370+i*86,150,'#1C1F2A',10);line(88,390+i*86,100)});
  rr(x,16,H-96,W-32,64,22);x.fillStyle='#1C1F2A';x.fill();[0,1,2,3].forEach(i=>{x.beginPath();x.arc(60+i*(W-120)/3,H-64,9,0,7);x.fillStyle=i?'#6B7080':'#fff';x.fill()});
  return c}
 x.fillStyle='#fff';x.fillRect(0,0,232,H);x.fillStyle='#E4E7EE';x.fillRect(232,0,1,H);
 rr(x,24,26,30,30,9);x.fillStyle=acc;x.fill();x.fillStyle='#1C1F2A';x.font='700 17px Inter, system-ui, sans-serif';x.fillText('Northwind',64,47);
 ['Overview','Projects','Customers','Reports','Settings'].forEach((t,i)=>{if(!i){rr(x,16,86,200,38,10);x.fillStyle='#EFEBFF';x.fill()}x.fillStyle=i?'#5F6577':acc;x.font='500 14px Inter, system-ui, sans-serif';x.fillText(t,40,110+i*46)});
 x.fillStyle='#1C1F2A';x.font='700 28px Inter, system-ui, sans-serif';x.fillText('Overview',264,62);line(264,78,240,'#C9CDD8');
 rr(x,W-176,34,144,40,12);x.fillStyle=acc;x.fill();x.fillStyle='#fff';x.font='600 14px Inter';x.fillText('New report',W-148,59);
 const cw=(W-264-32-48)/4;['Revenue','Active users','Conversion','Churn'].forEach((t,i)=>{const X=264+i*(cw+16);card(X,108,cw,112);x.fillStyle='#5F6577';x.font='500 13px Inter';x.fillText(t,X+18,136);x.fillStyle='#1C1F2A';x.font='700 26px Inter';x.fillText(['£482k','18,240','4.8%','1.2%'][i],X+18,172);line(X+18,190,60,['#D4F1E0','#D4F1E0','#FFE7C2','#FAD7D4'][i],12)});
 card(264,240,(W-264-32)*.64,330);x.fillStyle='#1C1F2A';x.font='600 16px Inter';x.fillText('Revenue',288,274);chart(288,300,(W-264-32)*.64-48,240);
 const rx=264+(W-264-32)*.64+16,rw=(W-264-32)*.36-16;card(rx,240,rw,330);x.fillStyle='#1C1F2A';x.font='600 16px Inter';x.fillText('Top channels',rx+24,274);
 [.86,.64,.48,.3,.18].forEach((v,i)=>{line(rx+24,300+i*50,rw-48,'#F0F1F5',14);line(rx+24,300+i*50,(rw-48)*v,i?'#B9A8FF':acc,14)});
 card(264,590,W-264-32,H-590-28);['Customer','Plan','Status','MRR'].forEach((t,i)=>{x.fillStyle='#5F6577';x.font='600 12px Inter';x.fillText(t.toUpperCase(),288+i*(W-330)/4,624)});
 for(let r=0;r<4;r++)for(let i=0;i<4;i++)line(288+i*(W-330)/4,648+r*50,i===2?70:120+((r*7+i*3)%5)*14,i===2?['#D4F1E0','#FFE7C2'][r%2]:'#E4E7EE',12);
 return c}

/* ---------- backgrounds ---------- */
const bgCache=new Map();
function cached(key,make){if(bgCache.has(key))return bgCache.get(key);const v=make();if(v){bgCache.set(key,v);if(bgCache.size>24)bgCache.delete(bgCache.keys().next().value)}return v}
const kit=()=>{const L=window.ThemeKits&&ThemeKits.list;return L?L.find(k=>k.id===S.bg.kit)||null:null};
function kitStill(k,W,H){return cached('kit:'+k.id+':'+W+'x'+H,()=>{const host=$('msOffscreen'),c=document.createElement('canvas'),d=Math.min(2,devicePixelRatio||1);c.style.width=W/d+'px';c.style.height=H/d+'px';host.append(c);let out=null;
 try{const stop=ThemeKits.BG[k.bg](c,k.t,true);if(typeof stop==='function')stop();out=canvas(W,H);out.getContext('2d').drawImage(c,0,0,W,H)}catch{out=null}c.remove();return out})}
function drawBg(x,W,H){const b=S.bg,m=Math.min(W,H);x.save();
 if(b.type==='solid'){x.fillStyle=b.solid;x.fillRect(0,0,W,H)}
 else if(b.type==='gradient'){let g;if(b.gType==='radial'){g=x.createRadialGradient(W*.3,H*.25,0,W*.5,H*.5,Math.hypot(W,H)*.65)}else{const a=b.angle*Math.PI/180,r=Math.hypot(W,H)/2,dx=Math.cos(a)*r,dy=Math.sin(a)*r;g=x.createLinearGradient(W/2-dx,H/2-dy,W/2+dx,H/2+dy)}
  b.g.forEach((c,i)=>g.addColorStop(i/(b.g.length-1),c));x.fillStyle=g;x.fillRect(0,0,W,H)}
 else if(b.type==='image'&&IMG.bg){const i=IMG.bg,iw=i.width,ih=i.height,s=Math.max(W/iw,H/ih);const o=b.blur>0?b.blur*m*.08:0;blurDraw(x,i,(W-iw*s)/2-o,(H-ih*s)/2-o,iw*s+2*o,ih*s+2*o,b.blur>0?b.blur*m*.04:0);if(b.dim>0){x.fillStyle=`rgba(0,0,0,${b.dim})`;x.fillRect(0,0,W,H)}}
 else if(b.type==='kit'&&kit()){const k=kit(),t=k.t;let done=false;
  if(b.kitStyle==='signature'&&ThemeKits.BG&&ThemeKits.BG[k.bg]){const c=kitStill(k,W,H);if(c){x.drawImage(c,0,0);done=true;if(b.dim>0){x.fillStyle=`rgba(0,0,0,${b.dim*.8})`;x.fillRect(0,0,W,H)}}}
  if(!done){const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,t.bg);g.addColorStop(1,t.surface||t.bg);x.fillStyle=g;x.fillRect(0,0,W,H);
   const glow=(cx,cy,r,col,a)=>{const rg=x.createRadialGradient(cx,cy,0,cx,cy,r);const [R,G,B]=hx(col);rg.addColorStop(0,`rgba(${R},${G},${B},${a})`);rg.addColorStop(1,`rgba(${R},${G},${B},0)`);x.fillStyle=rg;x.fillRect(0,0,W,H)};
   glow(W*.85,H*.12,Math.max(W,H)*.6,t.accent,.38);glow(W*.1,H*.95,Math.max(W,H)*.55,t.accent2||t.accent,.28)}}
 else{const B=window.BackgroundAtlas;const p=B&&B.ALL.find(p=>p.key===b.atlas);const c=p?cached('bg:'+p.key+':'+W+'x'+H,()=>{try{return B.still(p,W,H)}catch{return null}}):null;
  if(c)x.drawImage(c,0,0,W,H);else{const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#f6d5c4');g.addColorStop(1,'#c9a7eb');x.fillStyle=g;x.fillRect(0,0,W,H)}}
 x.restore();
 if(b.grain>0){const n=cached('grain',()=>{const c=canvas(256,256),g=c.getContext('2d'),d=g.createImageData(256,256);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}g.putImageData(d,0,0);return c});
  x.save();x.globalAlpha=Math.min(.5,b.grain);x.globalCompositeOperation='overlay';x.fillStyle=x.createPattern(n,'repeat');x.fillRect(0,0,W,H);x.restore()}}

/* ---------- perspective: map the device canvas through a 3D rotation with a triangle mesh ---------- */
function project(dw,dh,cx,cy,rx,ry,rz){const f=2.4*Math.max(dw,dh),cz=Math.cos(rz),sz=Math.sin(rz),cyy=Math.cos(ry),syy=Math.sin(ry),cxx=Math.cos(rx),sxx=Math.sin(rx);
 return (u,v)=>{let X=(u-.5)*dw,Y=(v-.5)*dh,Z=0;let X1=X*cz-Y*sz,Y1=X*sz+Y*cz;let X2=X1*cyy+Z*syy,Z2=-X1*syy+Z*cyy;let Y3=Y1*cxx-Z2*sxx,Z3=Y1*sxx+Z2*cxx;const s=f/(f-Z3);return [cx+X2*s,cy+Y3*s]}}
function tri(x,img,s0,s1,s2,d0,d1,d2){const [x0,y0]=s0,[x1,y1]=s1,[x2,y2]=s2,[u0,v0]=d0,[u1,v1]=d1,[u2,v2]=d2;
 const den=(x1-x0)*(y2-y0)-(x2-x0)*(y1-y0);if(!den)return;
 const a=((u1-u0)*(y2-y0)-(u2-u0)*(y1-y0))/den,c=((u2-u0)*(x1-x0)-(u1-u0)*(x2-x0))/den,b=((v1-v0)*(y2-y0)-(v2-v0)*(y1-y0))/den,d=((v2-v0)*(x1-x0)-(v1-v0)*(x2-x0))/den,e=u0-a*x0-c*y0,f=v0-b*x0-d*y0;
 const mx=(u0+u1+u2)/3,my=(v0+v1+v2)/3,grow=p=>{const dx=p[0]-mx,dy=p[1]-my,l=Math.hypot(dx,dy)||1;return [p[0]+dx/l*.9,p[1]+dy/l*.9]};
 const [a0,a1,a2]=[grow(d0),grow(d1),grow(d2)];x.save();x.beginPath();x.moveTo(...a0);x.lineTo(...a1);x.lineTo(...a2);x.closePath();x.clip();x.setTransform(a,b,c,d,e,f);x.drawImage(img,0,0);x.restore()}
function warp(x,img,cx,cy,dw,dh,rx,ry,rz,N){const P=project(dw,dh,cx,cy,rx,ry,rz),W=img.width,H=img.height,pts=[];
 for(let j=0;j<=N;j++){pts[j]=[];for(let i=0;i<=N;i++)pts[j][i]=P(i/N,j/N)}
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){const s=(ii,jj)=>[ii/N*W,jj/N*H];
  tri(x,img,s(i,j),s(i+1,j),s(i,j+1),pts[j][i],pts[j][i+1],pts[j+1][i]);tri(x,img,s(i+1,j),s(i+1,j+1),s(i,j+1),pts[j][i+1],pts[j+1][i+1],pts[j+1][i])}}

/* ---------- words ---------- */
/* My fonts (kept in this browser, see fontlib.js): select value 'my:Family' */
const MFx=()=>window.MyFonts||null,isMine=v=>typeof v==='string'&&v.startsWith('my:')&&!!(MFx()&&MFx().has(v.slice(3)));
function capFam(){return isMine(S.text.capFont)?MFx().cssFamily(S.text.capFont.slice(3)):'Inter, system-ui, sans-serif'}
function mineFill(){const M=MFx();if(!M)return;for(const id of ['msFont','msCapFont']){const sel=$(id);if(!sel)continue;const keep=sel.value;sel.querySelectorAll('optgroup[data-myfonts]').forEach(g=>g.remove());M.optgroup(sel,{prefix:'my:',always:true});const v=id==='msFont'?S.text.font:S.text.capFont;if([...sel.options].some(o=>o.value===v))sel.value=v}}
function fontFor(){if(isMine(S.text.font)){const n=S.text.font.slice(3);return {fam:MFx().cssFamily(n),w:MFx().faceFor(n,700).weight}}const k=S.bg.type==='kit'&&kit();if(S.text.font==='kit'&&k)return {fam:k.fonts.head,w:k.hw||700};const f=FONTS.find(f=>f[0]===S.text.font)||FONTS[0];return {fam:`'${f[0]}', system-ui, sans-serif`,w:f[1]}}
function wrap(x,t,max){const out=[];for(const para of String(t).split('\n')){let line='';for(const w of para.split(/\s+/).filter(Boolean)){const tryL=line?line+' '+w:w;if(x.measureText(tryL).width>max&&line){out.push(line);line=w}else line=tryL}out.push(line)}return out.filter((l,i,a)=>l||a.length===1)}
function textBlock(x,maxW,m,scale=1){const F=fontFor(),hs=m*.082*S.text.size*scale,cs=Math.max(11,hs*.4);const head=S.text.head.trim(),cap=S.text.cap.trim();
 x.font=`${F.w} ${hs}px ${F.fam}`;const hl=head?wrap(x,head,maxW).slice(0,4):[];x.font=`500 ${cs}px ${capFam()}`;const cl=cap?wrap(x,cap,maxW).slice(0,4):[];
 const bt=S.badge.text.trim()&&S.badge.pos==='above'?cs*2.1:0;
 const h=bt+hl.length*hs*1.08+(hl.length&&cl.length?hs*.35:0)+cl.length*cs*1.4;return {F,hs,cs,hl,cl,h,bt}}
function autoColor(c,r){const t=canvas(8,8),g=t.getContext('2d');g.drawImage(c,Math.max(0,r.x),Math.max(0,r.y),Math.max(1,r.w),Math.max(1,r.h),0,0,8,8);const d=g.getImageData(0,0,8,8).data;let L=0;for(let i=0;i<d.length;i+=4)L+=lumRGB([d[i],d[i+1],d[i+2]]);L/=64;return L>.38?['#111318','rgba(17,19,24,.72)']:['#FFFFFF','rgba(255,255,255,.82)']}
function badge(x,X,Y,cs,align){const t=S.badge.text.trim();if(!t)return 0;x.font=`700 ${cs*.86}px Inter, system-ui, sans-serif`;const w=x.measureText(t).width+cs*1.4,h=cs*1.7;const bx=align==='center'?X-w/2:align==='right'?X-w:X;
 const col=S.bg.type==='kit'&&kit()?kit().t.accent:S.badge.color;rr(x,bx,Y,w,h,h/2);x.fillStyle=col;x.fill();x.fillStyle=lumRGB(hx(col))>.45?'#111318':'#FFFFFF';x.textBaseline='middle';x.textAlign='center';x.fillText(t,bx+w/2,Y+h/2+1);return h}

/* ---------- compose ---------- */
function frameOpts(){const img=IMG.main||(['phone','classic','watch'].includes(S.frame)?SAMPLE_M:SAMPLE);
 const ori=S.orient==='auto'?(img&&img.width>img.height?'landscape':'portrait'):S.orient;
 return {img,img2:IMG.second||(IMG.main?null:SAMPLE_M),fit:S.fit,color:S.color,chrome:S.chrome,url:S.url,orient:ori}}
function compose(W,H,{mesh=14}={}){
 const c=canvas(W,H),x=c.getContext('2d'),m=Math.min(W,H),L=S.lay;drawBg(x,W,H);
 const pad=L.pad*m,area={x:pad,y:pad,w:W-2*pad,h:H-2*pad};
 const has=!!(S.text.head.trim()||S.text.cap.trim()||(S.badge.text.trim()&&S.badge.pos==='above'));
 let pos=S.text.pos==='auto'?(W/H>1.25?'left':'top'):S.text.pos;if(!has)pos='none';
 let tr=null,da=area,tb=null;
 if(pos==='left'||pos==='right'){const tw=area.w*.42;tb=textBlock(x,tw,m,W/H>1.6?.92:1);const gap=pad*.6;
  tr={x:pos==='left'?area.x:area.x+area.w-tw,y:area.y+(area.h-tb.h)/2,w:tw,h:tb.h};da={x:pos==='left'?area.x+tw+gap:area.x,y:area.y,w:area.w-tw-gap,h:area.h}}
 else if(pos==='top'||pos==='bottom'){tb=textBlock(x,area.w*.88,m,H/W>1.6?1.05:.95);const gap=pad*.55;
  tr={x:area.x+area.w*.06,y:pos==='top'?area.y:area.y+area.h-tb.h,w:area.w*.88,h:tb.h};da={x:area.x,y:pos==='top'?area.y+tb.h+gap:area.y,w:area.w,h:area.h-tb.h-gap}}
 /* device */
 if(S.frame!=='none'){const o=frameOpts(),u=DV.dims(S.frame,o);let k=Math.min(da.w/u.w,da.h/u.h)*L.scale;if(!(k>0))k=.01;
  const dev=DV.build(S.frame,k,o),cx=da.x+da.w/2+L.offX*W,cy=da.y+da.h/2+L.offY*H;
  const layer=canvas(W,H),lx=layer.getContext('2d');lx.imageSmoothingQuality='high';
  const rx=-L.tiltX*Math.PI/180,ry=L.tiltY*Math.PI/180,rz=L.rotate*Math.PI/180;
  if(!L.tiltX&&!L.tiltY){lx.translate(cx,cy);lx.rotate(rz);lx.drawImage(dev,-dev.width/2,-dev.height/2)}else warp(lx,dev,cx,cy,dev.width,dev.height,rx,ry,rz,mesh);
  x.save();if(L.shadow>0){x.shadowColor=`rgba(8,10,20,${.18+.4*L.shadow})`;x.shadowBlur=m*.07*L.shadow;x.shadowOffsetY=m*.035*L.shadow}x.drawImage(layer,0,0);x.restore()}
 /* words */
 if(tb&&tr){const [ink,mute]=S.text.color==='auto'?autoColor(c,tr):[S.text.color,S.text.color];
  const align=S.text.align==='auto'?(pos==='left'||pos==='right'?'left':'center'):S.text.align,ax=align==='center'?tr.x+tr.w/2:align==='right'?tr.x+tr.w:tr.x;let y=tr.y;
  if(tb.bt){badge(x,ax,y,tb.cs,align);y+=tb.bt}
  x.textAlign=align;x.textBaseline='top';x.fillStyle=ink;x.font=`${tb.F.w} ${tb.hs}px ${tb.F.fam}`;
  for(const l of tb.hl){x.fillText(l,ax,y);y+=tb.hs*1.08}if(tb.hl.length&&tb.cl.length)y+=tb.hs*.35;
  x.fillStyle=mute;x.font=`500 ${tb.cs}px ${capFam()}`;for(const l of tb.cl){x.fillText(l,ax,y);y+=tb.cs*1.4}}
 /* corner badge and logo */
 const corner=(p,w,h)=>{const e=pad*.55;return [p[1]==='l'?e:W-e-w,p[0]==='t'?e:H-e-h]};
 if(S.badge.text.trim()&&S.badge.pos!=='above'){const cs=m*.03;x.font=`700 ${cs*.86}px Inter, system-ui, sans-serif`;const w=x.measureText(S.badge.text.trim()).width+cs*1.4,h=cs*1.7,[bx,by]=corner(S.badge.pos,w,h);badge(x,bx,by,cs,'left')}
 if(IMG.logo){const s=m*S.logo.size,i=IMG.logo,r=Math.min(s/i.width,s/i.height),w=i.width*r,h=i.height*r,[lx,ly]=corner(S.logo.pos,w,h);x.drawImage(i,lx,ly,w,h)}
 return c}

/* ---------- preview ---------- */
let raf=0;const view=$('msCanvas');
function draw(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const [W,H]=presetSize(S.preset),box=$('msStage').getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);
 const maxW=Math.max(200,box.width-32),maxH=Math.max(240,Math.min(innerHeight*.72,900)),s=Math.min(maxW/W,maxH/H,1),cw=Math.round(W*s),ch=Math.round(H*s);
 const k=Math.min(1,(cw*dpr)/W),c=compose(Math.round(W*k),Math.round(H*k),{mesh:10});
 view.width=c.width;view.height=c.height;view.style.width=cw+'px';view.style.height=ch+'px';view.getContext('2d').drawImage(c,0,0);
 view.setAttribute('aria-label',`Preview, ${presetName(S.preset)} ${W} by ${H}: ${DV.list.find(d=>d[0]===S.frame)?.[1]||'no frame'}${S.text.head?', headline “'+S.text.head+'”':''}`);
 $('msSizeNow').textContent=`${presetName(S.preset)} · ${W}×${H}`;strip()})}
let stripT;function strip(){clearTimeout(stripT);stripT=setTimeout(()=>{const box=$('msStrip');[...box.querySelectorAll('canvas[data-p]')].forEach(cv=>{const [W,H]=presetSize(cv.dataset.p),k=150/Math.max(W,H),c=compose(Math.round(W*k*1.5),Math.round(H*k*1.5),{mesh:6});cv.width=c.width;cv.height=c.height;cv.getContext('2d').drawImage(c,0,0)})},500)}
function buildStrip(){const all=[...PRESETS.map(p=>p[0]),'custom'];$('msStrip').innerHTML=all.map(id=>{const [W,H]=presetSize(id);return `<li><button type="button" data-p="${id}" aria-pressed="${id===S.preset}"><canvas data-p="${id}" aria-hidden="true" width="10" height="10"></canvas><span><b>${esc(presetName(id))}</b><small>${W}×${H}</small></span></button></li>`}).join('')}

/* ---------- controls ---------- */
function opts(sel,list,val){sel.innerHTML=list.map(([v,t])=>`<option value="${esc(v)}">${esc(t)}</option>`).join('');sel.value=val}
function bind(){
 const on=(id,fn,ev='input')=>{const el=$(id);if(el)el.addEventListener(ev,()=>{fn(el);save();draw()})};
 opts($('msFrame'),[...DV.list,['none','No frame (background and words only)']],S.frame);on('msFrame',e=>{S.frame=e.value;sync()},'change');
 on('msColor',e=>S.color=e.value,'change');on('msChrome',e=>S.chrome=e.value,'change');on('msUrl',e=>S.url=e.value);on('msFit',e=>S.fit=e.value,'change');on('msOrient',e=>S.orient=e.value,'change');
 on('msBgType',e=>{S.bg.type=e.value;sync();if(e.value==='kit')loadKits()},'change');
 on('msBgSolid',e=>S.bg.solid=e.value);[0,1,2].forEach(i=>on('msG'+i,e=>S.bg.g[i]=e.value));on('msGType',e=>S.bg.gType=e.value,'change');on('msAngle',e=>S.bg.angle=+e.value);
 on('msKit',e=>{S.bg.kit=e.value;fontsForKit()},'change');on('msKitStyle',e=>S.bg.kitStyle=e.value,'change');on('msDim',e=>S.bg.dim=+e.value);on('msBlur',e=>S.bg.blur=+e.value);on('msGrain',e=>S.bg.grain=+e.value);
 [['msScale','scale'],['msRotate','rotate'],['msTiltX','tiltX'],['msTiltY','tiltY'],['msPad','pad'],['msShadow','shadow'],['msOffX','offX'],['msOffY','offY']].forEach(([id,k])=>on(id,e=>{S.lay[k]=+e.value;out(id)}));
 on('msHead',e=>S.text.head=e.value.slice(0,140));on('msCap',e=>S.text.cap=e.value.slice(0,220));on('msFont',e=>{if(e.value==='__upload_fonts'){e.value=S.text.font;MFx().openDialog();return}S.text.font=e.value;fontsReady().then(draw)},'change');on('msCapFont',e=>{if(e.value==='__upload_fonts'){e.value=S.text.capFont;MFx().openDialog();return}S.text.capFont=e.value;fontsReady().then(draw)},'change');on('msTSize',e=>S.text.size=+e.value);
 on('msTPos',e=>S.text.pos=e.value,'change');on('msTAlign',e=>S.text.align=e.value,'change');on('msTColorAuto',e=>{S.text.color=e.checked?'auto':$('msTColor').value;sync()},'change');on('msTColor',e=>{if(S.text.color!=='auto')S.text.color=e.value});
 on('msBadge',e=>S.badge.text=e.value.slice(0,40));on('msBadgePos',e=>S.badge.pos=e.value,'change');on('msBadgeColor',e=>S.badge.color=e.value);on('msLogoPos',e=>S.logo.pos=e.value,'change');on('msLogoSize',e=>S.logo.size=+e.value);
 on('msCW',e=>{S.custom[0]=Math.max(64,Math.min(4096,+e.value||1200));buildStrip()},'change');on('msCH',e=>{S.custom[1]=Math.max(64,Math.min(4096,+e.value||630));buildStrip()},'change');
 on('msFmt',e=>S.out.fmt=e.value,'change');on('msQ',e=>S.out.q=+e.value);
 $('msStrip').addEventListener('click',e=>{const b=e.target.closest('button[data-p]');if(!b)return;S.preset=b.dataset.p;$('msStrip').querySelectorAll('button[data-p]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));save();draw()});
 $('msReset').onclick=()=>{const keep=S.out;S=clone(DEF);S.out=keep;sync();save();draw();toast('Layout reset')};
 document.querySelectorAll('[data-tilt]').forEach(b=>b.onclick=()=>{const [r,tx,ty]=b.dataset.tilt.split(',').map(Number);Object.assign(S.lay,{rotate:r,tiltX:tx,tiltY:ty});sync();save();draw()});
 /* tabs */
 const tabs=[...document.querySelectorAll('#msTabs [role=tab]')];tabs.forEach((t,i)=>{t.onclick=()=>tab(t.dataset.t);t.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];n.focus();tab(n.dataset.t)}}});
 /* images */
 const pick=(id,slot)=>$(id).addEventListener('change',async e=>{const f=e.target.files&&e.target.files[0];e.target.value='';if(f)await setImage(slot,f)});
 pick('msFile','main');pick('msFile2','second');pick('msLogoFile','logo');pick('msBgFile','bg');
 $('msClear2').onclick=()=>{IMG.second=null;store('second');draw();sync()};$('msClearLogo').onclick=()=>{IMG.logo=null;store('logo');draw();sync()};$('msClearMain').onclick=()=>{IMG.main=null;title='';store('main');sync();draw();status('Showing the sample screen')};
 const stage=$('msStage');['dragenter','dragover'].forEach(t=>stage.addEventListener(t,e=>{e.preventDefault();stage.classList.add('drop')}));['dragleave','drop'].forEach(t=>stage.addEventListener(t,()=>stage.classList.remove('drop')));
 stage.addEventListener('drop',e=>{e.preventDefault();const f=[...(e.dataTransfer?.files||[])].find(f=>/^image\//.test(f.type));if(f)setImage('main',f);else toast('Drop an image file (PNG, JPEG, WebP, GIF or SVG).')});
 document.addEventListener('paste',e=>{if(e.target.closest&&e.target.closest('input,textarea'))return;const it=[...(e.clipboardData?.items||[])].find(i=>/^image\//.test(i.type));if(it){e.preventDefault();setImage('main',it.getAsFile())}});
 $('msPasteBtn').onclick=async()=>{try{const items=await navigator.clipboard.read();for(const it of items){const t=it.types.find(t=>/^image\//.test(t));if(t){await setImage('main',await it.getType(t));return}}toast('No image on the clipboard. Copy a screenshot first.')}catch{toast('Press Ctrl+V (⌘V) anywhere on this page to paste a screenshot.')}};
 opts($('msSitePage'),SITE_PAGES,SITE_PAGES[0][0]);$('msCapture').onclick=()=>capture($('msSitePage').value,$('msSiteSize').value);
 /* export */
 $('msDl').onclick=()=>exportOne(S.preset);$('msCopy').onclick=copyPNG;$('msZip').onclick=zipAll;
 $('msPickAll').onclick=()=>{S.out.pick=PRESETS.map(p=>p[0]);checks();save()};$('msPickNone').onclick=()=>{S.out.pick=[];checks();save()};
 $('msPicks').addEventListener('change',e=>{const c=e.target.closest('input[type=checkbox]');if(!c)return;S.out.pick=[...$('msPicks').querySelectorAll('input:checked')].map(i=>i.value);save();checks()});
 addEventListener('resize',()=>draw());
 const tm=$('msMenu');document.addEventListener('click',e=>{if(tm.open&&!tm.contains(e.target))tm.open=false});tm.addEventListener('click',e=>{if(e.target.closest('button'))tm.open=false});
}
function tab(id){document.querySelectorAll('#msTabs [role=tab]').forEach(t=>{const on=t.dataset.t===id;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1});document.querySelectorAll('.msPanel').forEach(p=>p.hidden=p.id!=='msP-'+id)}
function out(id){const el=$(id),o=document.querySelector(`output[for="${id}"]`);if(!o)return;const v=+el.value;o.textContent=id==='msRotate'||id.startsWith('msTilt')?v+'°':id==='msScale'?Math.round(v*100)+'%':Math.round(v*100)+'%'}
function checks(){$('msPicks').innerHTML=PRESETS.map(p=>`<label class="pk"><input type="checkbox" value="${p[0]}" ${S.out.pick.includes(p[0])?'checked':''}><span><b>${esc(p[1])}</b><small>${p[3]}×${p[4]} · ${esc(p[2])}</small></span></label>`).join('');
 const n=S.out.pick.length;$('msZip').disabled=!n;$('msZip').textContent=n?`Download ZIP · ${n} image${n>1?'s':''}`:'Choose sizes to export'}
function sync(){
 const set=(id,v)=>{const el=$(id);if(el)el.value=v};set('msFrame',S.frame);set('msColor',S.color);set('msChrome',S.chrome);set('msUrl',S.url);set('msFit',S.fit);set('msOrient',S.orient);
 set('msBgType',S.bg.type);set('msBgSolid',S.bg.solid);[0,1,2].forEach(i=>set('msG'+i,S.bg.g[i]));set('msGType',S.bg.gType);set('msAngle',S.bg.angle);set('msKit',S.bg.kit);set('msKitStyle',S.bg.kitStyle);set('msDim',S.bg.dim);set('msBlur',S.bg.blur);set('msGrain',S.bg.grain);
 [['msScale','scale'],['msRotate','rotate'],['msTiltX','tiltX'],['msTiltY','tiltY'],['msPad','pad'],['msShadow','shadow'],['msOffX','offX'],['msOffY','offY']].forEach(([id,k])=>{set(id,S.lay[k]);out(id)});
 set('msHead',S.text.head);set('msCap',S.text.cap);mineFill();set('msFont',S.text.font);set('msCapFont',S.text.capFont||'Inter');set('msTSize',S.text.size);set('msTPos',S.text.pos);set('msTAlign',S.text.align);$('msTColorAuto').checked=S.text.color==='auto';$('msTColor').disabled=S.text.color==='auto';if(S.text.color!=='auto')set('msTColor',S.text.color);
 set('msBadge',S.badge.text);set('msBadgePos',S.badge.pos);set('msBadgeColor',S.badge.color);set('msLogoPos',S.logo.pos);set('msLogoSize',S.logo.size);set('msCW',S.custom[0]);set('msCH',S.custom[1]);set('msFmt',S.out.fmt);set('msQ',S.out.q);
 const f=S.frame;$('msColorRow').hidden=!['phone','classic','tablet','laptop','watch','combo'].includes(f);$('msChromeRow').hidden=f!=='browser';$('msOrientRow').hidden=f!=='tablet';$('msSecondRow').hidden=f!=='combo';
 document.querySelectorAll('[data-bg]').forEach(el=>el.hidden=!el.dataset.bg.split(' ').includes(S.bg.type));
 $('msClear2').hidden=!IMG.second;$('msClearLogo').hidden=!IMG.logo;$('msClearMain').hidden=!IMG.main;
 $('msImgNow').textContent=IMG.main?`${title||'Your image'} · ${IMG.main.width}×${IMG.main.height}`:'Sample screen (add your own)';
 document.querySelectorAll('#msAtlasBgs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===S.bg.atlas)));
}
async function setImage(slot,blob,name){try{if(!blob||!/^image\//.test(blob.type||'image/png'))throw Error('Choose an image file.');if(blob.size>25*1024*1024)throw Error('Choose an image under 25 MB.');
 const img=await blobImg(blob);IMG[slot]=img;store(slot,blob);if(slot==='main'){title=name||blob.name||'';try{localStorage.setItem('atlas-mockup-title',title)}catch{}
  if(S.frame==='browser'||S.frame==='card'){} /* those adapt to the picture */ status(`Image added: ${img.width}×${img.height}`)}
 if(slot==='bg'){S.bg.type='image';save()}sync();draw();toast(slot==='main'?'Image added':slot==='logo'?'Logo added':slot==='bg'?'Background image added':'Phone image added')}catch(e){toast(e.message||'That image could not be used.')}}

/* ---------- capture a page of this site (same-origin) ---------- */
let msLib=null;
function lib(){return msLib||(msLib=new Promise((res,rej)=>{if(window.modernScreenshot)return res(window.modernScreenshot);const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/modern-screenshot@4.6.8/dist/index.js';s.crossOrigin='anonymous';s.onload=()=>res(window.modernScreenshot);s.onerror=()=>{msLib=null;rej(Error('Could not load the capture library. Check your connection, or take a screenshot and drop it here.'))};document.head.append(s)}))}
async function capture(src,size,{html=''}={}){const [w,h]=size==='phone'?[390,844]:[1440,900];const btn=$('msCapture');btn.disabled=true;status('Capturing…');
 const fr=document.createElement('iframe');fr.title='Page being captured';fr.setAttribute('aria-hidden','true');fr.tabIndex=-1;fr.style.cssText=`position:fixed;left:-20000px;top:0;width:${w}px;height:${h}px;border:0;opacity:0;pointer-events:none`;
 try{const L=await lib();await new Promise((res,rej)=>{fr.onload=()=>res();fr.onerror=()=>rej(Error('The page did not load.'));if(html)fr.srcdoc=html;else{const u=new URL(src,location.href);if(u.origin!==location.origin)return rej(Error('Only pages on this site can be captured.'));fr.src=u.href}document.body.append(fr);setTimeout(res,9000)});
  await new Promise(r=>setTimeout(r,2200));const doc=fr.contentDocument;if(!doc)throw Error('That page cannot be read.');try{await doc.fonts.ready}catch{}
  const node=doc.documentElement,cv=await L.domToCanvas(node,{width:w,height:h,scale:2,backgroundColor:getComputedStyle(doc.body).backgroundColor||'#fff',timeout:8000,/* leave out video, and the no-script fallbacks and code blocks that a cloned page would print as plain text */filter:n=>!/^(VIDEO|NOSCRIPT|SCRIPT|TEMPLATE)$/.test(n.tagName),style:{overflow:'hidden'},features:{removeControlCharacter:true}});
  if(!cv||!cv.width)throw Error('The capture came back empty.');const blob=await new Promise(r=>cv.toBlob(r,'image/png'));if(!blob||blob.size<2000)throw Error('The capture came back empty.');
  await setImage('main',blob,(html?'Site builder page':SITE_PAGES.find(p=>p[0]===src)?.[1]||src)+' · capture');status('Captured. Live canvases and video may show as still frames or blanks; drop in a screenshot for a pixel-perfect copy.')}
 catch(e){status(e.message||'Capture failed. Take a screenshot and drop it here instead.');toast('Capture failed. Drop a screenshot instead.')}
 finally{fr.remove();btn.disabled=false}}

/* ---------- export ---------- */
const MIME={png:'image/png',jpeg:'image/jpeg',webp:'image/webp'};
function slug(id){const base=(S.text.head||title||'mockup').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)||'mockup';const [W,H]=presetSize(id);return `${base}-${id}-${W}x${H}`}
function blobOf(id,fmt=S.out.fmt){const [W,H]=presetSize(id),c=compose(W,H,{mesh:20});return new Promise(r=>c.toBlob(b=>r(b),MIME[fmt]||'image/png',fmt==='png'?undefined:S.out.q))}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),5000)}
async function exportOne(id){status('Rendering…');await fontsReady();const b=await blobOf(id);if(!b)return status('This browser could not make that format. Try PNG.');const ext=S.out.fmt==='jpeg'?'jpg':S.out.fmt;download(b,slug(id)+'.'+ext);status(`Downloaded ${presetName(id)} (${Math.round(b.size/1024)} KB)`);toast('Image downloaded');window.__msLast={id,size:b.size,type:b.type}}
async function copyPNG(){try{await fontsReady();const p=blobOf(S.preset,'png');if(navigator.clipboard&&window.ClipboardItem){await navigator.clipboard.write([new ClipboardItem({'image/png':p})]);toast('Copied as PNG');status('Copied to the clipboard')}else throw 0}catch{const b=await blobOf(S.preset,'png');download(b,slug(S.preset)+'.png');toast('Copy was blocked, so the PNG was downloaded')}}
async function zipAll(){const ids=S.out.pick.slice();if(!ids.length)return;const btn=$('msZip');btn.disabled=true;await fontsReady();const files=[],ext=S.out.fmt==='jpeg'?'jpg':S.out.fmt;
 try{for(let i=0;i<ids.length;i++){status(`Rendering ${i+1} of ${ids.length}: ${presetName(ids[i])}…`);await new Promise(r=>setTimeout(r,16));const b=await blobOf(ids[i]);if(b)files.push([slug(ids[i])+'.'+ext,new Uint8Array(await b.arrayBuffer())])}
  const readme=`Social and store images made in the Mockup & social asset studio (Visual & Motion Atlas).\n\n${ids.map(id=>{const [W,H]=presetSize(id);return `- ${presetName(id)}: ${W}x${H}`}).join('\n')}\n`;files.push(['README.txt',readme]);
  const zip=(window.PB&&PB.zip)(files);download(zip,'share-images.zip');window.__msZip={count:files.length-1,size:zip.size};status(`ZIP downloaded: ${files.length-1} images, ${Math.round(zip.size/1024)} KB`);toast('ZIP downloaded')}
 catch(e){status('The ZIP could not be built: '+(e.message||e))}finally{btn.disabled=false}}

/* ---------- fonts and kits ---------- */
function fontsReady(){const F=fontFor(),fam=F.fam;return Promise.race([Promise.all([document.fonts.load(`${F.w} 40px ${fam}`),document.fonts.load(`500 20px ${capFam()}`),document.fonts.load('500 20px Inter'),document.fonts.load('700 20px Inter')]).catch(()=>{}),new Promise(r=>setTimeout(r,2500))])}
let kitsP=null;
function script(src){return new Promise((res,rej)=>{if(document.querySelector(`script[src="${src}"]`))return res();const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(Error('Could not load '+src));document.head.append(s)})}
function loadKits(){return kitsP||(kitsP=(async()=>{try{for(const f of ['kits/themes.js','kits/kits-a.js','kits/kits-b.js'])await script(f)}catch{toast('Theme kits could not be loaded.');return}
 const L=ThemeKits.list;opts($('msKit'),L.map(k=>[k.id,`${k.no} · ${k.name}`]),S.bg.kit||L[0].id);if(!S.bg.kit)S.bg.kit=L[0].id;
 $('msFont').insertAdjacentHTML('afterbegin','<option value="kit">Theme kit heading font</option>');$('msFont').value=S.text.font;fontsForKit();draw()})())}
function fontsForKit(){const k=kit();if(!k||!k.fonts||!k.fonts.css)return;const id='msKitFont-'+k.id;if(!document.getElementById(id)){const l=document.createElement('link');l.id=id;l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?'+k.fonts.css+'&display=swap';document.head.append(l)}setTimeout(()=>fontsReady().then(draw),300)}
function atlasBgs(){const B=window.BackgroundAtlas;if(!B)return;const box=$('msAtlasBgs');
 box.innerHTML=B.ALL.map(p=>`<button type="button" data-k="${p.key}" aria-pressed="${p.key===S.bg.atlas}" title="${esc(p.name)}"><span style="background:linear-gradient(135deg,${p.colors.slice(0,4).join(',')})"></span><b>${esc(p.name)}</b></button>`).join('');
 box.addEventListener('click',e=>{const b=e.target.closest('button[data-k]');if(!b)return;S.bg.atlas=b.dataset.k;S.bg.type='atlas';save();sync();draw()})}

/* ---------- start ---------- */
async function start(){SAMPLE=sample(false);SAMPLE_M=sample(true);
 $('msTabs').querySelector('[data-t]')&&tab('image');buildStrip();checks();atlasBgs();bind();sync();
 if(S.bg.type==='kit'||S.text.font==='kit')loadKits();
 try{title=localStorage.getItem('atlas-mockup-title')||''}catch{}
 for(const k of ['main','second','logo','bg']){try{const b=await kv('readonly',s=>s.get(k));if(b)IMG[k]=await blobImg(b)}catch{}}
 sync();draw();fontsReady().then(draw);if(window.MyFonts)MyFonts.on(()=>{mineFill();fontsReady().then(draw)});
 const q=new URLSearchParams(location.search);
 if(q.get('from')&&window.MockupHandoff){const v=await MockupHandoff.receive();if(v){if(v.title&&S.text.head===DEF.text.head)S.text.head=v.title;
  if(v.blob){if(['phone','classic','watch','browser'].includes(S.frame))S.frame='card';await setImage('main',v.blob,v.title||'From '+v.from);toast('Picture received from the '+(v.from||'studio'));}
  else if(v.html){tab('image');S.frame='browser';sync();await capture('', 'desktop',{html:v.html})}
  history.replaceState(null,'',location.pathname);sync();save();draw()}}
 const pg=q.get('page');if(pg&&/^[\w./#-]+$/.test(pg))capture(pg,q.get('size')==='phone'?'phone':'desktop');
 window.MockupStudio={compose,state:()=>S,presets:PRESETS,setImage,ready:true};
}
start();
})();
