'use strict';
/* 01 direction kit · City circuits engine (three.js r128).
   A motherboard laid out like a city: chips are towers, traces are streets, light is traffic.
   One engine, many looks. City3D.start(canvas, opts) -> {pause, play, stop, chips, project, camera, setHeights}
   opts: seed, still, pal{bg,board,grid,trace,traceHi,traffic,live,rare1,rare2,edge,lit,lit2,top}, mode 'solid'|'wire'|'points'|'ghost',
         fog, towers, traffic, trafficSize, tall, cam{a,b,la,lb}, orbit{r,h,speed,cx,cz,ly}, drift, parallax, fov,
         reflect, route, heights(i,chip)->h, edges, leds, onFrame(api) */
window.City3D=(()=>{
 const T=window.THREE;
 const DEF={bg:'#07090C',board:'#0B0E12',grid:'rgba(120,150,170,.07)',trace:'#2C8FA0',traceHi:'#7FE7F7',traffic:'#DDFBFF',live:'#3CF29A',rare1:'#A98BFF',rare2:'#FFB547',edge:'#A8D8E2',lit:'221,251,255',lit2:'127,231,247',top:'#151A21'};
 const hex=s=>new T.Color(s);
 function rng(seed){let s=seed>>>0;return()=>((s=Math.imul(s^s>>>15,1|s)+0x6D2B79F5,((s^s>>>7)>>>0)%100000)/100000)}
 function tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.anisotropy=8;return t}
 function start(canvas,o={}){
  if(!T)return null;
  const P={...DEF,...(o.pal||{})},mode=o.mode||'solid',still=!!o.still;
  let R;try{R=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'})}catch(e){return null}
  const r=rng(o.seed||7);R.setPixelRatio(Math.min(o.dpr||1.75,devicePixelRatio||1));R.setClearColor(hex(P.bg),1);
  const scene=new T.Scene();scene.fog=new T.FogExp2(hex(P.bg),o.fog??.019);
  const cam=new T.PerspectiveCamera(o.fov||42,1,.1,600);
  scene.add(new T.HemisphereLight(0xBFD4E6,0x0A1218,mode==='solid'?1.1:.6));const key=new T.DirectionalLight(0xE7EEF6,1.3);key.position.set(-30,40,20);scene.add(key);const rim=new T.DirectionalLight(hex(P.traceHi),.9);rim.position.set(40,12,-30);scene.add(rim);
  const root=new T.Group();scene.add(root);
  /* board */
  const S=170,bt=tex(1024,1024,(x,w,h)=>{x.fillStyle=P.board;x.fillRect(0,0,w,h);x.strokeStyle=P.grid;x.lineWidth=1;for(let i=0;i<=w;i+=16){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(w,i);x.stroke()}
   for(let k=0;k<500;k++){x.fillStyle=`rgba(150,170,190,${.05+r()*.1})`;x.beginPath();x.arc(r()*w,r()*h,1+r()*2,0,7);x.fill()}});
  bt.wrapS=bt.wrapT=T.RepeatWrapping;bt.repeat.set(3,3);
  const boardMat=new T.MeshStandardMaterial({color:0xffffff,map:bt,roughness:.85,metalness:.2,transparent:!!o.reflect,opacity:o.reflect?.82:1});
  const board=new T.Mesh(new T.PlaneGeometry(S,S),boardMat);board.rotation.x=-Math.PI/2;scene.add(board);
  if(mode==='points'||mode==='wire')board.visible=mode==='wire'?true:false;
  if(mode==='wire'){boardMat.map=null;boardMat.color=hex(P.bg)}
  /* textures */
  const facade=lit=>tex(128,512,(x,w,h)=>{x.fillStyle='#10141A';x.fillRect(0,0,w,h);for(let yy=8;yy<h-20;yy+=7)for(let xx=4;xx<w-4;xx+=6){const v=r();x.fillStyle=v<lit?`rgba(${v<lit*.15?P.lit2:P.lit},${.35+r()*.6})`:'rgba(150,165,180,.07)';x.fillRect(xx,yy,4,3)}x.fillStyle='rgba(200,210,222,.75)';for(let i=2;i<w;i+=6)x.fillRect(i,h-14,3,14)});
  const facades=[.08,.2,.34].map(facade);
  const topTex=tex(128,128,(x,w,h)=>{x.fillStyle=P.top;x.fillRect(0,0,w,h);x.strokeStyle='rgba(200,210,220,.2)';x.lineWidth=2;x.strokeRect(6,6,w-12,h-12);x.fillStyle='rgba(200,210,220,.3)';x.font='600 16px monospace';x.fillText('01',14,30)});
  const edgeMat=new T.LineBasicMaterial({color:hex(P.edge),transparent:true,opacity:o.edges??(mode==='wire'?.85:.4)});
  /* chips */
  const CELL=4,N=36,occ=new Set(),chips=[],want=o.towers||190;const tallP=o.tall??.22;
  for(let a=0;a<want*4&&chips.length<want;a++){const fw=1+(r()*2.4|0),fd=1+(r()*2.4|0),cx=(r()*(N-fw)|0)-N/2,cz=(r()*(N-fd)|0)-N/2;let ok=true;
   for(let i=-1;i<=fw;i++)for(let j=-1;j<=fd;j++)if(occ.has((cx+i)+','+(cz+j)))ok=false;if(!ok)continue;
   for(let i=0;i<fw;i++)for(let j=0;j<fd;j++)occ.add((cx+i)+','+(cz+j));
   const dist=Math.hypot(cx+fw/2-6,cz+fd/2+4),tall=r()<tallP&&dist<22;let h=tall?3.5+r()*(dist<9?11:7):.35+r()*(dist<12?2.6:1.3);
   const w=fw*CELL-1.2,d=fd*CELL-1.2;chips.push({x:(cx+fw/2)*CELL,z:(cz+fd/2)*CELL,w,d,h,h0:h,tall})}
  if(o.heights)chips.forEach((c,i)=>{c.h=c.h0=Math.max(.3,o.heights(i,c))});
  const meshes=[];const unit=new T.BoxGeometry(1,1,1),unitEdges=new T.EdgesGeometry(unit);
  for(const c of chips){
   if(mode==='solid'||mode==='ghost'){const big=c.h>2.2,ft=big?facades[r()*3|0]:null;
    const sm=new T.MeshStandardMaterial({color:0xC9D3DE,map:ft,emissive:0xffffff,emissiveMap:ft,emissiveIntensity:big?.9:0,roughness:.55,metalness:.35,transparent:mode==='ghost',opacity:mode==='ghost'?.35:1});
    if(!big){sm.color=hex('#1A2028');sm.emissive=hex('#000000')}
    const mats=[sm,sm,new T.MeshStandardMaterial({color:0xffffff,map:topTex,emissive:0x1A2630,roughness:.45,metalness:.4,transparent:mode==='ghost',opacity:mode==='ghost'?.5:1}),sm,sm,sm];
    const m=new T.Mesh(unit,mats);m.scale.set(c.w,c.h,c.d);m.position.set(c.x,c.h/2,c.z);root.add(m);c.mesh=m}
   if(mode!=='points'){const e=new T.LineSegments(unitEdges,edgeMat);e.scale.set(c.w,c.h,c.d);e.position.set(c.x,c.h/2,c.z);root.add(e);c.edge=e}
  }
  /* point-cloud towers */
  let cloud=null;if(mode==='points'){const pts=[],col=[];const cA=hex(P.traceHi),cB=hex(P.traffic);for(const c of chips){const n=Math.round(c.w*c.d*c.h*1.6+40);for(let i=0;i<n;i++){const f=r()*6|0;let x=(r()-.5)*c.w,y=r()*c.h,z=(r()-.5)*c.d;if(f<2)x=(f?.5:-.5)*c.w;else if(f<4)z=(f===2?.5:-.5)*c.d;else y=c.h;pts.push(c.x+x,y,c.z+z);const k=r()<.2?cA:cB,b=.25+r()*.6;col.push(k.r*b,k.g*b,k.b*b)}}
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pts,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));cloud=new T.Points(g,new T.PointsMaterial({size:o.pointSize||.16,vertexColors:true,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false}));root.add(cloud)}
  /* traces */
  const routes=[],dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  for(const c of chips){const n=1+(r()*3|0);for(let k=0;k<n;k++){const dir=dirs[r()*4|0];let x=c.x+dir[0]*(c.w/2+.3),z=c.z+dir[1]*(c.d/2+.3);
    x=Math.round(x/2)*2;z=Math.round(z/2)*2;const pts=[[x,z]];let dx=dir[0],dz=dir[1];
    for(let s=0;s<4+(r()*6|0);s++){const len=(2+(r()*7|0))*2;x+=dx*len;z+=dz*len;pts.push([x,z]);if(r()<.55){const t=r()<.5?1:-1,ndx=dx?0:t,ndz=dz?0:t;x+=(dx+ndx)*2;z+=(dz+ndz)*2;pts.push([x,z]);dx=ndx;dz=ndz}}
    routes.push({pts,hi:r()<.18})}}
  for(let k=0;k<7;k++){const z0=(r()*2-1)*50,pts=[[-75,z0]];let x=-75,z=z0;while(x<75){x+=8+r()*14;pts.push([x,z]);if(r()<.4){const t=r()<.5?1:-1,ch=3+r()*4;x+=ch;z+=t*ch;pts.push([x,z])}}routes.push({pts,hi:true,trunk:true})}
  for(let k=0;k<5;k++){const x0=(r()*2-1)*50,pts=[[x0,-75]];let x=x0,z=-75;while(z<75){z+=8+r()*14;pts.push([x,z]);if(r()<.4){const t=r()<.5?1:-1,ch=3+r()*4;z+=ch;x+=t*ch;pts.push([x,z])}}routes.push({pts,hi:true,trunk:true})}
  function ribbon(list,width,color,opacity,y=.02){const pos=[];for(const rt of list){const p=rt.pts;for(let i=0;i<p.length-1;i++){const [x1,z1]=p[i],[x2,z2]=p[i+1];const L=Math.hypot(x2-x1,z2-z1)||1,nx=-(z2-z1)/L*width/2,nz=(x2-x1)/L*width/2;
     pos.push(x1+nx,y,z1+nz,x2+nx,y,z2+nz,x2-nx,y,z2-nz,x1+nx,y,z1+nz,x2-nx,y,z2-nz,x1-nx,y,z1-nz)}}
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));const m=new T.Mesh(g,new T.MeshBasicMaterial({color:hex(color),transparent:true,opacity,blending:T.AdditiveBlending,depthWrite:false}));scene.add(m);return m}
  const dimT=o.route?.25:1;
  ribbon(routes.filter(x=>!x.hi),.16,P.trace,.8*dimT);ribbon(routes.filter(x=>x.hi&&!x.trunk),.22,P.traceHi,.6*dimT);ribbon(routes.filter(x=>x.trunk),.34,P.traceHi,.75*dimT);ribbon(routes.filter(x=>x.trunk),1.4,P.trace,.18*dimT);
  /* lengths */
  routes.forEach(rt=>{const p=rt.pts,L=[0];for(let i=1;i<p.length;i++)L.push(L[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));rt.len=L;rt.total=L[L.length-1]});
  const at=(rt,t)=>{let k=1;while(k<rt.len.length-1&&rt.len[k]<t)k++;const a=rt.pts[k-1],b=rt.pts[k],f=(t-rt.len[k-1])/((rt.len[k]-rt.len[k-1])||1);return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]};
  /* the single route: one trunk lights up end to end, then the next */
  let hero=null,heroT=0,heroGeo=null;
  if(o.route){heroGeo=new T.BufferGeometry();heroGeo.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(600*3),3));hero=new T.Line(heroGeo,new T.LineBasicMaterial({color:hex(P.traceHi),transparent:true,opacity:1,blending:T.AdditiveBlending}));scene.add(hero)}
  const trunks=routes.filter(x=>x.trunk);let heroR=trunks[0];
  /* traffic */
  const sprite=tex(64,64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
  const weighted=routes.flatMap(rt=>Array(rt.trunk?8:rt.hi?3:1).fill(rt));
  const NP=o.traffic??2000,cars=[],pPos=new Float32Array(NP*3),pCol=new Float32Array(NP*3);
  const cW=hex(P.traffic),cG=hex(P.live),c1=hex(P.rare1),c2=hex(P.rare2),cC=hex(P.traceHi);
  for(let i=0;i<NP;i++){const rt=weighted[r()*weighted.length|0];const col=r()<.06?cG:r()<.02?c1:r()<.015?c2:r()<.4?cC:cW;cars.push({rt,t:r()*rt.total,v:(rt.trunk?9:4)+r()*6,dir:r()<.5?1:-1});pCol.set([col.r,col.g,col.b],i*3)}
  const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pPos,3));pg.setAttribute('color',new T.BufferAttribute(pCol,3));
  const pm=new T.PointsMaterial({size:o.trafficSize||1.1,map:sprite,vertexColors:true,transparent:true,opacity:o.route?.35:.95,blending:T.AdditiveBlending,depthWrite:false});scene.add(new T.Points(pg,pm));
  /* LEDs */
  const leds=[];if(o.leds!==false)for(const c of chips){if(r()<.55){const n=1+(r()*3|0);for(let k=0;k<n;k++)leds.push([c.x+(r()-.5)*c.w*.8,c.h+.05,c.z+(r()-.5)*c.d*.8,r()*6.28,r()<.85?cG:cC,c])}}
  const lg=new T.BufferGeometry(),lp=new Float32Array(Math.max(1,leds.length)*3),lc=new Float32Array(Math.max(1,leds.length)*3);leds.forEach((l,i)=>{lp.set([l[0],l[1],l[2]],i*3);lc.set([l[4].r,l[4].g,l[4].b],i*3)});lg.setAttribute('position',new T.BufferAttribute(lp,3));lg.setAttribute('color',new T.BufferAttribute(lc,3));
  scene.add(new T.Points(lg,new T.PointsMaterial({size:.7,map:sprite,vertexColors:true,transparent:true,blending:T.AdditiveBlending,depthWrite:false})));
  /* reflection: the whole city mirrored under a glossy board */
  if(o.reflect){const mir=root.clone();mir.scale.y=-1;mir.traverse(n=>{if(n.material){const m=Array.isArray(n.material)?n.material.map(x=>x.clone()):n.material.clone();(Array.isArray(m)?m:[m]).forEach(x=>{x.transparent=true;x.opacity=(x.opacity??1)*.35});n.material=m}});scene.add(mir)}
  /* camera */
  const C=o.cam||{a:[34,15,40],b:[16,7,6],la:[-6,0,-14],lb:[-26,1,-46]};const camA=new T.Vector3(...C.a),camB=new T.Vector3(...C.b),lookA=new T.Vector3(...C.la),lookB=new T.Vector3(...C.lb);
  let mx=0,my=0,tx=0,ty=0,scroll=0,raf=0,running=true,last=performance.now(),clock=0;const PX=o.parallax??1;
  const onMove=e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5};addEventListener('pointermove',onMove,{passive:true});
  const onScroll=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);scroll=Math.min(1,scrollY/max)};addEventListener('scroll',onScroll,{passive:true});onScroll();
  function size(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;R.setSize(w,h,false);cam.aspect=w/h;cam.fov=(w<700?1.35:1)*(o.fov||42);cam.updateProjectionMatrix()}
  size();const ro=new ResizeObserver(size);ro.observe(canvas);
  const tmp=new T.Vector3(),look=new T.Vector3(),v3=new T.Vector3();
  function project(x,y,z){v3.set(x,y,z).project(cam);return {x:(v3.x+1)/2*canvas.clientWidth,y:(1-v3.y)/2*canvas.clientHeight,on:v3.z<1&&Math.abs(v3.x)<1.1&&Math.abs(v3.y)<1.1}}
  const api={chips,camera:cam,project,get t(){return clock},setHeights(fn){chips.forEach((c,i)=>{c.h0=Math.max(.3,fn(i,c))})},pause(){running=false;cancelAnimationFrame(raf)},play(){if(!running&&!still){running=true;last=performance.now();raf=requestAnimationFrame(frame)}},stop(){running=false;cancelAnimationFrame(raf);ro.disconnect();removeEventListener('pointermove',onMove);removeEventListener('scroll',onScroll)}};
  function place(dt){for(let i=0;i<NP;i++){const c=cars[i];c.t+=c.v*dt*c.dir;if(c.t>c.rt.total)c.t-=c.rt.total;if(c.t<0)c.t+=c.rt.total;const [x,z]=at(c.rt,c.t);pPos[i*3]=x;pPos[i*3+1]=.12;pPos[i*3+2]=z}pg.attributes.position.needsUpdate=true}
  function frame(now){const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;clock+=dt;mx+=(tx-mx)*.04;my+=(ty-my)*.04;
   if(o.orbit){const q=o.orbit,a=clock*(q.speed||.05)+(q.a0||0);tmp.set((q.cx||0)+Math.cos(a)*q.r,q.h+Math.sin(clock*.2)*(q.bob||0),(q.cz||0)+Math.sin(a)*q.r);tmp.y+=-my*2*PX;cam.position.copy(tmp);look.set((q.cx||0)+mx*3*PX,q.ly||0,q.cz||0);cam.lookAt(look)}
   else{const s0=scroll*scroll*(3-2*scroll),s=Math.min(1,s0+(o.drift?(Math.sin(clock*o.drift)*.5+.5)*.25:0));tmp.lerpVectors(camA,camB,s);tmp.x+=mx*6*PX;tmp.y+=-my*3*PX;cam.position.copy(tmp);look.lerpVectors(lookA,lookB,s);look.x+=mx*2.5*PX;cam.lookAt(look)}
   if(!still){place(dt);for(let i=0;i<leds.length;i++){const on=.35+.65*Math.max(0,Math.sin(clock*2.2+leds[i][3]));lc[i*3]=leds[i][4].r*on;lc[i*3+1]=leds[i][4].g*on;lc[i*3+2]=leds[i][4].b*on;lp[i*3+1]=leds[i][5].h+.05}lg.attributes.color.needsUpdate=true;lg.attributes.position.needsUpdate=true}
   if(o.heights||api._grow){let ch=false;for(const c of chips){const d=c.h0-c.h;if(Math.abs(d)>.01){c.h+=d*Math.min(1,dt*3);ch=true;if(c.mesh){c.mesh.scale.y=c.h;c.mesh.position.y=c.h/2}if(c.edge){c.edge.scale.y=c.h;c.edge.position.y=c.h/2}}}}
   if(hero){heroT+=dt*(still?0:28);if(heroT>heroR.total+20){heroT=0;heroR=trunks[(trunks.indexOf(heroR)+1)%trunks.length]}const arr=heroGeo.attributes.position.array;const n=200;for(let i=0;i<n;i++){const t=Math.max(0,Math.min(heroR.total,heroT-60+i*.3));const [x,z]=at(heroR,t);arr[i*3]=x;arr[i*3+1]=.06;arr[i*3+2]=z}heroGeo.setDrawRange(0,n);heroGeo.attributes.position.needsUpdate=true}
   R.render(scene,cam);o.onFrame&&o.onFrame(api);if(running&&!still)raf=requestAnimationFrame(frame)}
  place(0);
  if(still){clock=8;frame(performance.now());addEventListener('scroll',()=>requestAnimationFrame(frame),{passive:true})}else raf=requestAnimationFrame(frame);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf)}else if(running&&!still){last=performance.now();raf=requestAnimationFrame(frame)}});
  return api}
 return {start};
})();
