'use strict';
/* City circuits: a motherboard laid out like a city. Chips are towers, traces are streets, light is
   traffic that never stops. Angled, off-centre camera with pointer parallax; scroll moves the camera
   deeper in. three.js r128, no post-processing: glow comes from additive sprites and fog.
   CityCircuits.start(canvas,{still}) -> {stop()} */
window.CityCircuits=(()=>{
 const T=window.THREE;
 const C={bg:0x07090C,board:0x0B0E12,chipTop:0x151A21,chipSide:0x0D1015,edge:0x8E99A8,trace:0x2C8FA0,traceHi:0x7FE7F7,cyanDeep:0x0A7F94,traffic:0xDDFBFF,green:0x3CF29A,purple:0xA98BFF,amber:0xFFB547};
 function rng(seed){let s=seed>>>0;return()=>((s=Math.imul(s^s>>>15,1|s)+0x6D2B79F5,((s^s>>>7)>>>0)%100000)/100000)}
 function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.anisotropy=8;return t}
 function boardTexture(r){return canvasTex(2048,2048,(x,w,h)=>{x.fillStyle='#0B0E12';x.fillRect(0,0,w,h);
   x.strokeStyle='rgba(120,150,170,.07)';x.lineWidth=1;for(let i=0;i<=w;i+=32){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(w,i);x.stroke()}
   for(let k=0;k<900;k++){const px=r()*w,py=r()*h;x.fillStyle=`rgba(150,170,190,${.06+r()*.12})`;x.beginPath();x.arc(px,py,1.5+r()*2.5,0,Math.PI*2);x.fill()}
   x.fillStyle='rgba(180,195,210,.10)';x.font='22px monospace';for(let k=0;k<70;k++)x.fillText(['R','C','U','Q','L','TP'][r()*6|0]+(1+(r()*99|0)),r()*w,r()*h)})}
 function chipTopTexture(label,r){return canvasTex(256,256,(x,w,h)=>{x.fillStyle='#151A21';x.fillRect(0,0,w,h);x.strokeStyle='rgba(200,210,220,.18)';x.lineWidth=3;x.strokeRect(10,10,w-20,h-20);
   x.fillStyle='rgba(200,210,220,.32)';x.font='600 28px monospace';x.fillText(label,24,64);x.font='18px monospace';x.fillStyle='rgba(200,210,220,.18)';x.fillText('01-'+(1000+(r()*8999|0)),24,96);
   x.beginPath();x.arc(w-40,h-40,8,0,Math.PI*2);x.fillStyle='rgba(200,210,220,.22)';x.fill()})}
 /* facade: a die seen edge-on, rows of lit cells like windows, pins along the foot. Used as colour and as emissive map */
 function sideTexture(r,lit){return canvasTex(256,1024,(x,w,h)=>{x.fillStyle="#10141A";x.fillRect(0,0,w,h);
   for(let yy=14;yy<h-40;yy+=12)for(let xx=8;xx<w-8;xx+=10){const v=r();if(v<lit){const c=v<lit*.12?'127,231,247':'221,251,255';x.fillStyle=`rgba(${c},${.35+r()*.6})`}else x.fillStyle='rgba(150,165,180,.07)';x.fillRect(xx,yy,6,5)}
   x.fillStyle='rgba(200,210,222,.75)';for(let i=4;i<w;i+=10)x.fillRect(i,h-26,5,26);x.fillStyle='rgba(127,231,247,.5)';x.fillRect(0,0,w,2)})}
 function darkSide(){return canvasTex(256,64,(x,w,h)=>{x.fillStyle='#0D1015';x.fillRect(0,0,w,h);x.fillStyle='rgba(190,200,212,.55)';for(let i=6;i<w;i+=14)x.fillRect(i,h-10,6,10);x.fillStyle='rgba(127,231,247,.25)';x.fillRect(0,0,w,2)})}
 function glowSprite(){return canvasTex(64,64,(x,w,h)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,w,h)})}

 function start(canvas,{still=false,seed=1}={}){
  if(!T)return null;
  let renderer;try{renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'})}catch(e){return null}
  const r=rng(seed);renderer.setPixelRatio(Math.min(1.75,devicePixelRatio||1));renderer.setClearColor(C.bg,1);
  const scene=new T.Scene();scene.fog=new T.FogExp2(C.bg,.019);
  const cam=new T.PerspectiveCamera(42,1,.1,400);
  scene.add(new T.HemisphereLight(0xBFD4E6,0x0A1218,1.1));const key=new T.DirectionalLight(0xE7EEF6,1.3);key.position.set(-30,40,20);scene.add(key);const rim=new T.DirectionalLight(0x7FE7F7,.9);rim.position.set(40,12,-30);scene.add(rim);
  /* board */
  const S=170,bt=boardTexture(r);bt.wrapS=bt.wrapT=T.RepeatWrapping;bt.repeat.set(3,3);
  const board=new T.Mesh(new T.PlaneGeometry(S,S),new T.MeshStandardMaterial({color:0xffffff,map:bt,roughness:.85,metalness:.2}));board.rotation.x=-Math.PI/2;scene.add(board);
  /* city blocks on a grid of 4-unit cells; streets run between them */
  const CELL=4,N=36,occ=new Set(),chips=[];const facades=[.08,.18,.32].map(l=>sideTexture(r,l)),low=darkSide();
  const labels=['01','AX','NX','Q7','RT','MX','K2','V9','ZE','OS'];
  const edgeMat=new T.LineBasicMaterial({color:0xA8D8E2,transparent:true,opacity:.42});
  const group=new T.Group();scene.add(group);
  for(let a=0;a<700&&chips.length<190;a++){const fw=1+(r()*2.4|0),fd=1+(r()*2.4|0),cx=(r()*(N-fw)|0)-N/2,cz=(r()*(N-fd)|0)-N/2;let ok=true;
   for(let i=-1;i<=fw;i++)for(let j=-1;j<=fd;j++)if(occ.has((cx+i)+','+(cz+j)))ok=false;if(!ok)continue;
   for(let i=0;i<fw;i++)for(let j=0;j<fd;j++)occ.add((cx+i)+','+(cz+j));
   const dist=Math.hypot(cx+fw/2-6,cz+fd/2+4);const tall=r()<.22&&dist<22;const h=tall?3.5+r()*(dist<9?11:7):.35+r()*(dist<12?2.6:1.3);
   const w=fw*CELL-1.2,d=fd*CELL-1.2,top=chipTopTexture(labels[r()*labels.length|0],r);const ft=h>2.2?facades[r()*3|0].clone():low;ft.needsUpdate=true;ft.wrapS=ft.wrapT=T.RepeatWrapping;if(h>2.2)ft.repeat.set(Math.max(1,Math.round(Math.max(w,d)/4)),Math.min(1,h/14));const sm=new T.MeshStandardMaterial({color:0xC9D3DE,map:ft,emissive:0xffffff,emissiveMap:h>2.2?ft:null,emissiveIntensity:h>2.2?.9:0,roughness:.55,metalness:.35});
   const mats=[sm,sm,new T.MeshStandardMaterial({color:0xffffff,map:top,emissive:0x1A2630,roughness:.45,metalness:.4}),sm,sm,sm];
   const m=new T.Mesh(new T.BoxGeometry(w,h,d),mats);m.position.set((cx+fw/2)*CELL,h/2,(cz+fd/2)*CELL);group.add(m);
   const e=new T.LineSegments(new T.EdgesGeometry(m.geometry),edgeMat);e.position.copy(m.position);group.add(e);
   chips.push({x:m.position.x,z:m.position.z,w,d,h})}
  /* traces: Manhattan routes with 45-degree chamfers, from chip edges along the streets */
  const routes=[];const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  for(const c of chips){const n=1+(r()*3|0);for(let k=0;k<n;k++){const dir=dirs[r()*4|0];let x=c.x+dir[0]*(c.w/2+.3),z=c.z+dir[1]*(c.d/2+.3);
    x=Math.round(x/2)*2+(dir[1]?(r()-.5)*c.w*.6:0);z=Math.round(z/2)*2+(dir[0]?(r()-.5)*c.d*.6:0);const pts=[[x,z]];let dx=dir[0],dz=dir[1];
    for(let s=0;s<4+(r()*6|0);s++){const len=(2+(r()*7|0))*2;x+=dx*len;z+=dz*len;pts.push([x,z]);if(r()<.55){const t=r()<.5?1:-1;const ndx=dx?0:t,ndz=dz?0:t;const ch=2;x+=(dx+ndx)*ch;z+=(dz+ndz)*ch;pts.push([x,z]);dx=ndx;dz=ndz}}
    routes.push({pts,hi:r()<.18})}}
  /* trunk avenues: long bright traces across the city */
  for(let k=0;k<7;k++){const z0=(r()*2-1)*50,pts=[[-75,z0]];let x=-75,z=z0;while(x<75){x+=8+r()*14;pts.push([x,z]);if(r()<.4){const t=r()<.5?1:-1,ch=3+r()*4;x+=ch;z+=t*ch;pts.push([x,z])}}routes.push({pts,hi:true,trunk:true})}
  for(let k=0;k<5;k++){const x0=(r()*2-1)*50,pts=[[x0,-75]];let x=x0,z=-75;while(z<75){z+=8+r()*14;pts.push([x,z]);if(r()<.4){const t=r()<.5?1:-1,ch=3+r()*4;z+=ch;x+=t*ch;pts.push([x,z])}}routes.push({pts,hi:true,trunk:true})}
  function ribbon(list,width,color,opacity){const pos=[];for(const rt of list){const p=rt.pts;for(let i=0;i<p.length-1;i++){const [x1,z1]=p[i],[x2,z2]=p[i+1];const L=Math.hypot(x2-x1,z2-z1)||1,nx=-(z2-z1)/L*width/2,nz=(x2-x1)/L*width/2,y=.02;
     pos.push(x1+nx,y,z1+nz,x2+nx,y,z2+nz,x2-nx,y,z2-nz,x1+nx,y,z1+nz,x2-nx,y,z2-nz,x1-nx,y,z1-nz)}}
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));const m=new T.Mesh(g,new T.MeshBasicMaterial({color,transparent:true,opacity,blending:T.AdditiveBlending,depthWrite:false}));scene.add(m);return m}
  ribbon(routes.filter(x=>!x.hi),.16,C.trace,.8);ribbon(routes.filter(x=>x.hi&&!x.trunk),.22,C.traceHi,.6);ribbon(routes.filter(x=>x.trunk),.34,C.traceHi,.75);ribbon(routes.filter(x=>x.trunk),1.4,C.cyanDeep,.18);
  /* traffic: light that never stops */
  const seg=rt=>{const p=rt.pts,L=[0];for(let i=1;i<p.length;i++)L.push(L[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));rt.len=L;rt.total=L[L.length-1];return rt};routes.forEach(seg);
  const weighted=routes.flatMap(rt=>Array(rt.trunk?8:rt.hi?3:1).fill(rt));
  const NP=still?1400:2000,cars=[];const pPos=new Float32Array(NP*3),pCol=new Float32Array(NP*3),pSize=new Float32Array(NP);
  const cWhite=new T.Color(C.traffic),cGreen=new T.Color(C.green),cPurple=new T.Color(C.purple),cAmber=new T.Color(C.amber),cCyan=new T.Color(C.traceHi);
  for(let i=0;i<NP;i++){const rt=weighted[r()*weighted.length|0];const col=r()<.06?cGreen:r()<.02?cPurple:r()<.015?cAmber:r()<.4?cCyan:cWhite;cars.push({rt,t:r()*rt.total,v:(rt.trunk?9:4)+r()*6,dir:r()<.5?1:-1});pCol.set([col.r,col.g,col.b],i*3);pSize[i]=rt.trunk?1.15:.75+r()*.4}
  const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pPos,3));pg.setAttribute('color',new T.BufferAttribute(pCol,3));
  const sprite=glowSprite();const pm=new T.PointsMaterial({size:1.1,map:sprite,vertexColors:true,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false,sizeAttenuation:true});
  const points=new T.Points(pg,pm);scene.add(points);
  /* LEDs on chip tops: small green pulses */
  const leds=[];for(const c of chips){if(r()<.55){const n=1+(r()*3|0);for(let k=0;k<n;k++)leds.push([c.x+(r()-.5)*c.w*.8,c.h+.05,c.z+(r()-.5)*c.d*.8,r()*6.28,r()<.85?cGreen:cCyan])}}
  const lg=new T.BufferGeometry(),lp=new Float32Array(leds.length*3),lc=new Float32Array(leds.length*3);leds.forEach((l,i)=>{lp.set([l[0],l[1],l[2]],i*3);lc.set([l[4].r,l[4].g,l[4].b],i*3)});lg.setAttribute('position',new T.BufferAttribute(lp,3));lg.setAttribute('color',new T.BufferAttribute(lc,3));
  const lm=new T.PointsMaterial({size:.7,map:sprite,vertexColors:true,transparent:true,blending:T.AdditiveBlending,depthWrite:false});const ledPts=new T.Points(lg,lm);scene.add(ledPts);
  /* camera path: angled, deep, off-centre */
  const camA=new T.Vector3(34,15,40),camB=new T.Vector3(16,7,6),lookA=new T.Vector3(-6,0,-14),lookB=new T.Vector3(-26,1,-46);
  let mx=0,my=0,tx=0,ty=0,scroll=0,raf=0,running=true,last=performance.now();
  const onMove=e=>{tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)};addEventListener('pointermove',onMove,{passive:true});
  const onScroll=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);scroll=Math.min(1,scrollY/max)};addEventListener('scroll',onScroll,{passive:true});onScroll();
  function size(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.fov=w<700?58:42;cam.updateProjectionMatrix()}
  size();const ro=new ResizeObserver(size);ro.observe(canvas);
  const tmp=new T.Vector3(),look=new T.Vector3();
  function place(dt){for(let i=0;i<NP;i++){const c=cars[i],rt=c.rt;c.t+=c.v*dt*c.dir;if(c.t>rt.total)c.t-=rt.total;if(c.t<0)c.t+=rt.total;let k=1;while(k<rt.len.length-1&&rt.len[k]<c.t)k++;const a=rt.pts[k-1],b=rt.pts[k],f=(c.t-rt.len[k-1])/((rt.len[k]-rt.len[k-1])||1);pPos[i*3]=a[0]+(b[0]-a[0])*f;pPos[i*3+1]=.12;pPos[i*3+2]=a[1]+(b[1]-a[1])*f}pg.attributes.position.needsUpdate=true}
  function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;mx+=(tx-mx)*.04;my+=(ty-my)*.04;
   const s=scroll*scroll*(3-2*scroll);tmp.lerpVectors(camA,camB,s);tmp.x+=mx*6;tmp.y+=-my*3;cam.position.copy(tmp);look.lerpVectors(lookA,lookB,s);look.x+=mx*2.5;cam.lookAt(look);
   if(!still){place(dt);const t=now/1000;for(let i=0;i<leds.length;i++){const on=.35+.65*Math.max(0,Math.sin(t*2.2+leds[i][3]));lc[i*3]=leds[i][4].r*on;lc[i*3+1]=leds[i][4].g*on;lc[i*3+2]=leds[i][4].b*on}lg.attributes.color.needsUpdate=true}
   renderer.render(scene,cam);if(running&&!still)raf=requestAnimationFrame(frame)}
  place(0);
  if(still){frame(performance.now());addEventListener('scroll',()=>requestAnimationFrame(frame),{passive:true});addEventListener('pointermove',()=>requestAnimationFrame(frame),{passive:true})}
  else raf=requestAnimationFrame(frame);
  const vis=()=>{if(document.hidden){running=false;cancelAnimationFrame(raf)}else if(!still&&!running){running=true;last=performance.now();raf=requestAnimationFrame(frame)}};document.addEventListener('visibilitychange',vis);
  return {stop(){running=false;cancelAnimationFrame(raf);ro.disconnect();removeEventListener('pointermove',onMove);removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',vis)},pause(){running=false;cancelAnimationFrame(raf)},play(){if(!running&&!still){running=true;last=performance.now();raf=requestAnimationFrame(frame)}},get running(){return running}}
 }
 return {start};
})();
