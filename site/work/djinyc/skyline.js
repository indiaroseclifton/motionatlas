'use strict';
/* Blue-hour flight over Manhattan. Everything is generated: an avenue grid of towers with lit windows
   (one instanced mesh, windows drawn in the fragment shader), avenue traffic, two rivers, Central Park
   and a sunset sky. The camera flies a closed loop up one avenue canyon, over the park and back down the next.
   Skyline.start(canvas,{still}) -> {pause, play, renderAt(seconds), state}  (renderAt is used to export the film) */
window.Skyline=(()=>{
 const T=window.THREE;
 function rng(seed){let s=seed>>>0;return()=>((s=Math.imul(s^s>>>15,1|s)+0x6D2B79F5,((s^s>>>7)>>>0)%100000)/100000)}
 const SKY=`
  varying vec3 vDir;uniform vec3 sunDir;uniform float time;
  float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
  void main(){vec3 d=normalize(vDir);float y=d.y;
   vec3 top=vec3(.012,.025,.07),mid=vec3(.09,.12,.26),hor=vec3(.98,.47,.24),low=vec3(.05,.05,.09);
   float s=max(dot(d,sunDir),0.);
   vec3 c=mix(mid,top,smoothstep(.05,.6,y));
   float sh=max(dot(normalize(vec3(d.x,0.,d.z)),normalize(vec3(sunDir.x,0.,sunDir.z))),0.);vec3 band=mix(vec3(.2,.17,.31),hor*.85,pow(sh,3.));
   c=mix(band,c,smoothstep(-.02,.22,y));
   c+=hor*pow(s,40.)*1.4+vec3(1.,.6,.35)*pow(s,8.)*.35*smoothstep(.3,-.05,y);
   
   vec3 q=floor(d*420.);float st=step(.9975,h(q))*smoothstep(.15,.6,y);c+=vec3(st)*(.55+.45*sin(time*2.+h(q)*30.));
   gl_FragColor=vec4(c,1.);}`;
 const BV=`
  attribute float aSeed;varying vec3 vW;varying vec3 vN;varying float vSeed;varying float vTop;
  void main(){mat4 m=modelMatrix;
   #ifdef USE_INSTANCING
   m=m*instanceMatrix;
   #endif
   vec4 w=m*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(m)*normal);vSeed=aSeed;
   vTop=(m*vec4(0.,.5,0.,1.)).y;gl_Position=projectionMatrix*viewMatrix*w;}`;
 const BF=`
  varying vec3 vW;varying vec3 vN;varying float vSeed;varying float vTop;uniform vec3 sunDir;uniform vec3 fogCol;uniform float fogD;uniform float time;
  float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  vec3 fogC(vec3 p){vec3 d=normalize(p-cameraPosition);float s=max(dot(normalize(vec3(d.x,0.,d.z)),normalize(vec3(sunDir.x,0.,sunDir.z))),0.);return mix(vec3(.2,.17,.31),vec3(.98,.47,.24)*.85,pow(s,3.));}
  void main(){vec3 n=normalize(vN);float dist=length(vW-cameraPosition);
   vec3 base=vec3(.035,.045,.07)+vec3(.02,.025,.04)*vSeed;
   vec3 col;
   if(n.y>.5){col=base*.8;float r=h2(floor(vW.xz/6.)+vSeed*31.);col+=vec3(.5,.55,.6)*step(.985,r)*.4;}
   else{vec2 t=vec2(-n.z,n.x);float u=dot(vW.xz,t);float v=vW.y;
    vec2 cell=floor(vec2(u/2.4,v/3.4));vec2 f=fract(vec2(u/2.4,v/3.4));
    float win=step(.2,f.x)*step(f.x,.8)*step(.3,f.y)*step(f.y,.75);
    float r=h2(cell+vSeed*97.13);float floorOn=step(.18,h2(vec2(cell.y,vSeed*13.)));
    float lit=step(.74-.16*vSeed,r)*floorOn;
    float k=h2(cell*1.7+vSeed);vec3 wc=k<.62?vec3(1.,.74,.42):(k<.93?vec3(.78,.86,1.):vec3(.55,.95,1.));
    wc*=.35+.6*h2(cell+3.1);
    float far=smoothstep(380.,1300.,dist);
    vec3 glass=base+vec3(.03,.04,.07)*(1.-smoothstep(0.,80.,vTop-v));
    col=mix(glass,wc,win*lit*(1.-far));
    col+=wc*(.07+.06*vSeed)*far;
    float sun=max(dot(n,normalize(vec3(sunDir.x,0.,sunDir.z))),0.);col+=vec3(.9,.42,.2)*sun*.12*smoothstep(0.,300.,v);
    col+=vec3(.6,.75,1.)*.05*smoothstep(vTop-6.,vTop,v);}
   float fog=1.-exp(-pow(dist*fogD,1.6));col=mix(col,fogC(vW),clamp(fog,0.,1.));
   gl_FragColor=vec4(col,1.);}`;
 const GV=`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;
 const GF=`
  varying vec3 vW;uniform vec3 fogCol;uniform float fogD;uniform vec3 sunDir;uniform float time;uniform vec4 park;uniform vec2 island;
  float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  vec3 fogC(vec3 p){vec3 d=normalize(p-cameraPosition);float s=max(dot(normalize(vec3(d.x,0.,d.z)),normalize(vec3(sunDir.x,0.,sunDir.z))),0.);return mix(vec3(.2,.17,.31),vec3(.98,.47,.24)*.85,pow(s,3.));}
  void main(){float dist=length(vW-cameraPosition);vec3 c;
   if(abs(vW.x)>island.x+120.*sin(vW.z*.0011)||vW.z<-3320.||vW.z>1980.){
    vec3 w=vec3(.02,.03,.06);vec3 v=normalize(cameraPosition-vW);vec3 r=reflect(-v,vec3(0.,1.,0.));
    float s=max(dot(r,sunDir),0.);float rip=.5+.5*sin(vW.z*.08+time*.9+sin(vW.x*.05)*3.)*sin(vW.x*.11-time*.6);
    c=w+vec3(1.,.5,.25)*pow(s,6.)*(.4+.6*rip)*.9+vec3(.12,.16,.3)*pow(1.-max(v.y,0.),3.)*.5;
    float spark=step(.995,h2(floor(vW.xz/3.)+floor(time*3.)))*smoothstep(1.,.2,v.y);c+=vec3(1.,.8,.6)*spark*.6;
   }else{
    c=vec3(.025,.028,.04);
    float ax=mod(vW.x+980.,280.);float av=1.-smoothstep(10.,16.,abs(ax-0.))*(1.-smoothstep(264.,270.,ax));
    float sz=mod(vW.z,80.);float stv=1.-smoothstep(6.,10.,abs(sz-0.))*(1.-smoothstep(70.,74.,sz));
    float road=max(av,stv);
    c=mix(c,vec3(.05,.045,.042),road);
    vec2 lc=fract(vW.xz/9.)-.5;float lamp=road*step(.6,h2(floor(vW.xz/9.)))*smoothstep(.18,.0,length(lc));c+=vec3(1.,.62,.3)*lamp*.9;
    if(vW.x>park.x&&vW.x<park.y&&vW.z>park.z&&vW.z<park.w){c=vec3(.012,.025,.018);float p=step(.993,h2(floor(vW.xz/7.)));c+=vec3(1.,.8,.5)*p*.5;}
   }
   float fog=1.-exp(-pow(dist*fogD,1.6));c=mix(c,fogC(vW),clamp(fog,0.,1.));gl_FragColor=vec4(c,1.);}`;
 const TV=`
  attribute vec4 aLane;attribute float aKind;uniform float time;uniform float pix;varying float vKind;varying float vFog;uniform float fogD;
  void main(){float len=aLane.w;float z=aLane.y+mod(aLane.z*time+aLane.y*7.,len)-len*.5;
   if(aKind>1.5){z=aLane.y-mod(aLane.z*time+aLane.y*5.,len)+len*.5;}
   vec3 p=vec3(aLane.x,1.6,z);vec4 mv=viewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
   float d=-mv.z;gl_PointSize=clamp(pix*2.2/d,1.,6.);vKind=aKind;vFog=exp(-pow(d*fogD,1.6));}`;
 const TF=`varying float vKind;varying float vFog;void main(){vec2 c=gl_PointCoord-.5;float a=smoothstep(.5,.0,length(c));
   vec3 col=vKind>1.5?vec3(1.,.18,.12):vec3(1.,.93,.78);gl_FragColor=vec4(col*a*vFog*1.4,a*vFog);}`;
 const BEV=`attribute float aPh;uniform float time;uniform float pix;varying float vOn;void main(){vec4 mv=viewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;
   vOn=step(.55,fract(time*.55+aPh));gl_PointSize=clamp(pix*5./(-mv.z),2.,9.);}`;
 const BEF=`varying float vOn;void main(){float a=smoothstep(.5,0.,length(gl_PointCoord-.5));gl_FragColor=vec4(vec3(1.,.12,.1)*a*vOn*1.5,a*vOn);}`;

 function start(canvas,{still=false,seed=11}={}){
  if(!T)return null;
  let R;try{R=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'})}catch(e){return null}
  const r=rng(seed);R.setPixelRatio(Math.min(1.6,devicePixelRatio||1));
  const scene=new T.Scene(),cam=new T.PerspectiveCamera(52,1,1,40000);
  const sunDir=new T.Vector3(-1,.05,-.55).normalize(),fogCol=new T.Color(.13,.11,.2),U={time:{value:0},sunDir:{value:sunDir},fogCol:{value:fogCol},fogD:{value:.00047},pix:{value:900}};
  /* sky */
  const sky=new T.Mesh(new T.SphereGeometry(30000,32,16),new T.ShaderMaterial({uniforms:U,vertexShader:`varying vec3 vDir;void main(){vDir=position;vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position=p.xyww;}`,fragmentShader:SKY,side:T.BackSide,depthWrite:false}));
  scene.add(sky);
  /* ground and rivers */
  const PARK=new T.Vector4(-405,125,-2350,-1150),ISL=new T.Vector2(1010,0);
  const ground=new T.Mesh(new T.PlaneGeometry(60000,60000),new T.ShaderMaterial({uniforms:{...U,park:{value:PARK},island:{value:ISL}},vertexShader:GV,fragmentShader:GF}));
  ground.rotation.x=-Math.PI/2;ground.position.z=-600;scene.add(ground);
  /* the camera route: up one avenue canyon, over the park, down the next, a climbing turn downtown */
  const P=[[-140,230,1300],[-140,260,600],[-140,300,-100],[-160,360,-800],[-60,470,-1450],[120,520,-1850],[260,470,-1450],[300,380,-800],[240,320,-100],[160,300,600],[60,360,1300],[-60,420,1750],[-140,300,1600]];
  const route=new T.CatmullRomCurve3(P.map(p=>new T.Vector3(...p)),true,'centripetal',.5);
  const samples=route.getSpacedPoints(600);
  function clearance(x,z){let best=1e9,y=0;for(const s of samples){const d=Math.hypot(s.x-x,s.z-z);if(d<best){best=d;y=s.y}}return{d:best,y}}
  /* towers */
  const boxes=[];const peak=(z,c,s,a)=>a*Math.exp(-((z-c)*(z-c))/(2*s*s));
  for(let i=0;i<7;i++){const x0=-980+i*280+15,x1=x0+250;
   for(let z0=-3200;z0<1900;z0+=80){const za=z0+8,zb=z0+72;
    if(x1>PARK.x&&x0<PARK.y&&za>PARK.z&&zb<PARK.w)continue;
    let x=x0;while(x<x1-8){const w=Math.min(x1-x,18+r()*46);const dz=r()<.35?(zb-za):(zb-za)/2;
     for(let zz=za;zz<zb-1;zz+=dz){
      const cx=x+w/2,cz=zz+dz/2;
      let hgt=12+r()*30+peak(cz,-350,520,240)+peak(cz,1650,420,210)+peak(cz,-2700,500,80);
      hgt*=.35+Math.pow(r(),2.2)*1.3;if(r()<.045)hgt*=2.3;
      hgt*=1-.45*Math.max(0,(Math.abs(cx)-600)/400);
      const c=clearance(cx,cz);if(c.d<Math.max(w,dz)*.75+22)hgt=Math.min(hgt,c.y-45);
      hgt=Math.max(10,hgt);const sd=r();
      boxes.push([cx,cz,w-3,dz-3,hgt,sd]);
      if(hgt>160&&r()<.7){const f=.55+r()*.25,h2=hgt*(.12+r()*.22);if(c.d>60||hgt+h2<c.y-45)boxes.push([cx,cz,(w-3)*f,(dz-3)*f,hgt+h2,sd,hgt])}
     }x+=w}}}
  const N=boxes.length,geo=new T.BoxGeometry(1,1,1),seeds=new Float32Array(N);
  geo.setAttribute('aSeed',new T.InstancedBufferAttribute(seeds,1));
  const mat=new T.ShaderMaterial({uniforms:U,vertexShader:BV,fragmentShader:BF});
  const inst=new T.InstancedMesh(geo,mat,N);const m4=new T.Matrix4(),tall=[];
  boxes.forEach((b,i)=>{const [x,z,w,d,h,s,base=0]=b;const hh=h-base;m4.makeScale(w,hh,d);m4.setPosition(x,base+hh/2,z);inst.setMatrixAt(i,m4);seeds[i]=s;if(h>200)tall.push([x,h+2,z])});
  scene.add(inst);
  /* aircraft beacons on the tallest roofs */
  tall.sort((a,b)=>b[1]-a[1]);const tb=tall.slice(0,90);const bg=new T.BufferGeometry();bg.setAttribute('position',new T.Float32BufferAttribute(tb.flat(),3));bg.setAttribute('aPh',new T.Float32BufferAttribute(tb.map(()=>r()),1));
  scene.add(new T.Points(bg,new T.ShaderMaterial({uniforms:U,vertexShader:BEV,fragmentShader:BEF,transparent:true,blending:T.AdditiveBlending,depthWrite:false})));
  /* traffic: headlights one way, tail lights the other, on every avenue */
  const lanes=[],kinds=[];for(let i=0;i<8;i++){const ax=-980+i*280;for(let k=0;k<420;k++){const dir=k%2;lanes.push(ax+(dir?5:-5)+(r()-.5)*2,-650,14+r()*16,5200);kinds.push(dir?2:1)}}
  for(let z0=-3200;z0<1900;z0+=240){for(let k=0;k<14;k++){lanes.push(0,0,0,0);kinds.push(0)}}
  const tg=new T.BufferGeometry(),NT=kinds.length;tg.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(NT*3),3));tg.setAttribute('aLane',new T.Float32BufferAttribute(lanes,4));tg.setAttribute('aKind',new T.Float32BufferAttribute(kinds,1));
  const traffic=new T.Points(tg,new T.ShaderMaterial({uniforms:U,vertexShader:TV,fragmentShader:TF,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));traffic.frustumCulled=false;scene.add(traffic);
  /* flight */
  let scroll=0,mx=0,my=0,tx=0,ty=0,raf=0,running=!still,last=performance.now(),clock=0;const LOOP=240;
  const state={alt:0,speed:0,dist:0,heading:0};const home=new T.Vector3(...P[0]);
  const onMove=e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5};addEventListener('pointermove',onMove,{passive:true});
  const onScroll=()=>{scroll=Math.min(1,scrollY/Math.max(1,innerHeight*1.2))};addEventListener('scroll',onScroll,{passive:true});onScroll();
  function size(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;R.setSize(w,h,false);cam.aspect=w/h;cam.fov=w<700?64:50;cam.updateProjectionMatrix();U.pix.value=h*1.1}
  size();const ro=new ResizeObserver(size);ro.observe(canvas);
  const pos=new T.Vector3(),ahead=new T.Vector3(),prev=new T.Vector3(),look=new T.Vector3();let roll=0;
  function place(t,dt){const u=(t/LOOP)%1,u2=(u+.03)%1;route.getPointAt(u,pos);route.getPointAt(u2,ahead);
   const lift=scroll*scroll*(3-2*scroll)*260;pos.y+=lift;ahead.y+=lift-(70+scroll*180);
   mx+=(tx-mx)*.03;my+=(ty-my)*.03;
   const side=new T.Vector3().subVectors(ahead,pos).cross(new T.Vector3(0,1,0)).normalize();
   pos.addScaledVector(side,mx*18);pos.y-=my*10;
   cam.position.copy(pos);look.copy(ahead).addScaledVector(side,mx*40);cam.lookAt(look);
   const t3=route.getTangentAt(u),t4=route.getTangentAt((u+.02)%1);const turn=t3.x*t4.z-t3.z*t4.x;roll+=(turn*9-roll)*.05;cam.rotateZ(roll);
   if(dt>0){state.speed=pos.distanceTo(prev)/dt}prev.copy(pos);
   state.alt=pos.y;state.dist=Math.hypot(pos.x-home.x,pos.z-home.z);state.heading=(Math.atan2(t3.x,-t3.z)*180/Math.PI+389)%360}
  function renderAt(t,dt=1/30){U.time.value=t;place(t,dt);R.render(scene,cam)}
  function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;clock+=dt;renderAt(clock,dt);if(running)raf=requestAnimationFrame(frame)}
  if(still){clock=38;renderAt(clock,0);addEventListener('scroll',()=>requestAnimationFrame(()=>renderAt(clock,0)),{passive:true})}else raf=requestAnimationFrame(frame);
  const vis=()=>{if(document.hidden){cancelAnimationFrame(raf)}else if(running){last=performance.now();raf=requestAnimationFrame(frame)}};document.addEventListener('visibilitychange',vis);
  return {state,renderAt,size,pause(){running=false;cancelAnimationFrame(raf)},play(){if(still||running)return;running=true;last=performance.now();raf=requestAnimationFrame(frame)},get running(){return running},count:N};
 }
 return {start};
})();
