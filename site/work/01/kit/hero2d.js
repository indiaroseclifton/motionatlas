'use strict';
/* 01 direction kit · 2D city-circuit renderers on a canvas, no libraries.
   Hero2D.trails | glyphs | layers | blueprint | swarm  (canvas, opts) -> {pause, play}
   All share a tiny perspective projector and the same seeded city of chips and traces.
   Camera is always angled and off-centre; never overhead, never symmetrical. */
window.Hero2D=(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function rng(seed){let s=seed>>>0;return()=>((s=Math.imul(s^s>>>15,1|s)+0x6D2B79F5,((s^s>>>7)>>>0)%100000)/100000)}
 function city(seed,{n=120,span=60}={}){const r=rng(seed),occ=new Set(),chips=[];for(let a=0;a<n*5&&chips.length<n;a++){const w=1+(r()*3|0),d=1+(r()*3|0),x=(r()*span|0)-span/2,z=(r()*span|0)-span/2;let ok=true;for(let i=-1;i<=w;i++)for(let j=-1;j<=d;j++)if(occ.has((x+i)+','+(z+j)))ok=false;if(!ok)continue;for(let i=0;i<w;i++)for(let j=0;j<d;j++)occ.add((x+i)+','+(z+j));
   const dist=Math.hypot(x+w/2-4,z+d/2+6);const tall=r()<.25&&dist<18;chips.push({x:x+w/2,z:z+d/2,w:w-.3,d:d-.3,h:tall?2+r()*(dist<8?8:5):.2+r()*1.4})}
  const routes=[];for(let k=0;k<70;k++){let x=(r()*span|0)-span/2,z=(r()*span|0)-span/2;const pts=[[x,z]];let dx=r()<.5?1:0,dz=dx?0:1;if(r()<.5){dx=-dx;dz=-dz}for(let s=0;s<5+(r()*6|0);s++){const L=2+(r()*8|0);x+=dx*L;z+=dz*L;pts.push([x,z]);if(r()<.5){const t=r()<.5?1:-1,ndx=dx?0:t,ndz=dz?0:t;x+=dx+ndx;z+=dz+ndz;pts.push([x,z]);dx=ndx;dz=ndz}}const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));routes.push({pts,len:L,total:L[L.length-1],hi:r()<.25})}
  return {chips,routes,r}}
 const at=(rt,t)=>{let k=1;while(k<rt.len.length-1&&rt.len[k]<t)k++;const a=rt.pts[k-1],b=rt.pts[k],f=(t-rt.len[k-1])/((rt.len[k]-rt.len[k-1])||1);return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]};
 /* camera: position, yaw (around y), pitch (down), focal length in px */
 function projector(){const c={x:0,y:0,z:0,yaw:0,pitch:0,f:800,cx:0,cy:0};
  c.p=(X,Y,Z)=>{let x=X-c.x,y=Y-c.y,z=Z-c.z;const cy=Math.cos(c.yaw),sy=Math.sin(c.yaw);[x,z]=[x*cy-z*sy,x*sy+z*cy];const cp=Math.cos(c.pitch),sp=Math.sin(c.pitch);[y,z]=[y*cp+z*sp,-y*sp+z*cp];if(z<.5)return null;return [c.cx+x/z*c.f,c.cy-y/z*c.f,z]};return c}
 function loop(canvas,draw,{fps=60}={}){const x=canvas.getContext('2d');let W,H,d,raf=0,run=true,t0=performance.now(),last=0;const st={};
  function size(){d=Math.min(2,devicePixelRatio||1);W=canvas.clientWidth;H=canvas.clientHeight;canvas.width=W*d;canvas.height=H*d;x.setTransform(d,0,0,d,0,0);st.resized=true}
  size();const ro=new ResizeObserver(size);ro.observe(canvas);
  let mx=0,my=0,tx=0,ty=0;addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
  function f(now){if(now-last<1000/fps-2){raf=requestAnimationFrame(f);return}last=now;mx+=(tx-mx)*.05;my+=(ty-my)*.05;const sc=Math.min(1,scrollY/Math.max(1,innerHeight));draw(x,W,H,(now-t0)/1000,{mx,my,sc,st});if(run&&!reduce)raf=requestAnimationFrame(f)}
  raf=requestAnimationFrame(f);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else if(run&&!reduce)raf=requestAnimationFrame(f)});
  return {pause(){run=false;cancelAnimationFrame(raf)},play(){if(!run){run=true;raf=requestAnimationFrame(f)}}}}
 const box=(c,ch,H0=0)=>{const {x,z,w,d,h}=ch,y0=H0;return [[x-w/2,y0,z-d/2],[x+w/2,y0,z-d/2],[x+w/2,y0,z+d/2],[x-w/2,y0,z+d/2],[x-w/2,y0+h,z-d/2],[x+w/2,y0+h,z-d/2],[x+w/2,y0+h,z+d/2],[x-w/2,y0+h,z+d/2]].map(p=>c.p(...p))};
 const FACES=[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]];
 function poly(x,pts){x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath()}

 /* 1. long exposure: light trails on an angled board, towers as dark masses with lit edges */
 function trails(canvas,o={}){const C=city(o.seed||11),cam=projector(),cars=Array.from({length:o.cars||900},()=>{const rt=C.routes[C.r()*C.routes.length|0];return {rt,t:C.r()*rt.total,v:(rt.hi?9:5)+C.r()*5,col:C.r()<.08?(o.live||'#3CF29A'):C.r()<.5?(o.hi||'#7FE7F7'):'#DDFBFF'}});
  return loop(canvas,(x,W,H,t,{mx,my,sc,st})=>{cam.cx=W*.62;cam.cy=H*.38;cam.f=Math.max(W,H)*.75;cam.x=22+mx*4;cam.y=11-sc*5+my*2;cam.z=-28+sc*12;cam.yaw=-.62+mx*.06;cam.pitch=.34;
   if(st.resized){x.fillStyle=o.bg||'#07090C';x.fillRect(0,0,W,H);st.resized=false}
   x.fillStyle=`rgba(7,9,12,${o.fade||.045})`;x.fillRect(0,0,W,H);
   x.globalCompositeOperation='lighter';x.lineCap='round';
   for(const c of cars){const p0=at(c.rt,c.t);c.t=(c.t+c.v*(1/60))%c.rt.total;const p1=at(c.rt,c.t);const a=cam.p(p0[0],.05,p0[1]),b=cam.p(p1[0],.05,p1[1]);if(!a||!b)continue;x.strokeStyle=c.col;x.globalAlpha=Math.min(1,26/a[2]);x.lineWidth=Math.max(.8,40/a[2]);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()}
   x.globalAlpha=1;x.globalCompositeOperation='source-over';
   const sorted=C.chips.map(ch=>({ch,z:Math.hypot(ch.x-cam.x,ch.z-cam.z)})).sort((a,b)=>b.z-a.z);
   for(const {ch} of sorted){const v=box(cam,ch);if(v.some(p=>!p))continue;for(const f of FACES){const pts=f.map(i=>v[i]);const ar=(pts[1][0]-pts[0][0])*(pts[2][1]-pts[0][1])-(pts[1][1]-pts[0][1])*(pts[2][0]-pts[0][0]);if(ar>0)continue;poly(x,pts);x.fillStyle=f[0]===4?'rgba(24,30,38,.9)':'rgba(10,13,17,.92)';x.fill();x.strokeStyle='rgba(168,216,226,.18)';x.lineWidth=.6;x.stroke()}}
  },{fps:60})}

 /* 2. binary metropolis: towers drawn as columns of 0s and 1s */
 function glyphs(canvas,o={}){const C=city(o.seed||5,{n:70,span:44}),cam=projector();const font=o.font||'"JetBrains Mono",monospace';
  return loop(canvas,(x,W,H,t,{mx,my,sc})=>{x.fillStyle=o.bg||'#07090C';x.fillRect(0,0,W,H);cam.cx=W*.6;cam.cy=H*.36;cam.f=Math.max(W,H)*.7;const a=-.7+Math.sin(t*.05)*.12+mx*.08;cam.x=Math.sin(-a)*27+6;cam.z=-Math.cos(a)*27-4;cam.y=9.5-sc*4+my*2;cam.yaw=a;cam.pitch=.34;
   const items=[];for(const ch of C.chips){const step=.55;for(const [fx,fz,nx,nz] of [[ch.x-ch.w/2,ch.z-ch.d/2,1,0],[ch.x+ch.w/2,ch.z-ch.d/2,0,1],[ch.x+ch.w/2,ch.z+ch.d/2,-1,0],[ch.x-ch.w/2,ch.z+ch.d/2,0,-1]]){const len=nx?ch.w:ch.d;for(let u=0;u<=len;u+=step)for(let v=0;v<=ch.h;v+=step){const p=cam.p(fx+nx*u,v,fz+nz*u);if(p)items.push([p,((u*7+v*13+ch.x)|0)%7===0])}}}
   items.sort((a,b)=>b[0][2]-a[0][2]);x.textAlign='center';x.textBaseline='middle';
   for(const [p,hot] of items){const s=Math.max(5,Math.min(18,260/p[2]));const fog=Math.max(.08,Math.min(1,30/p[2]));const flick=Math.sin(t*3+p[0]*.05+p[1]*.07)>.6;x.font=`500 ${s}px ${font}`;x.fillStyle=hot?(o.hi||'#7FE7F7'):'#DDE3EA';x.globalAlpha=fog*(hot?1:.68);x.fillText(flick?'1':'0',p[0],p[1])}
   x.globalAlpha=1;
   /* traces as dotted 0/1 streets */
   x.font=`400 9px ${font}`;for(const rt of C.routes){if(!rt.hi)continue;const k=(t*8)%rt.total;for(let s=0;s<rt.total;s+=1.2){const [px,pz]=at(rt,s);const p=cam.p(px,0,pz);if(!p)continue;const near=Math.abs(s-k)<3;x.globalAlpha=Math.min(.9,(near?1:.25)*16/p[2]);x.fillStyle=near?(o.live||'#3CF29A'):(o.hi||'#7FE7F7');x.fillText(s%2.4<1.2?'0':'1',p[0],p[1])}}x.globalAlpha=1},{fps:30})}

 /* 3. layered parallax: five planes of chip skylines, cut like paper, each moving at its own depth */
 function layers(canvas,o={}){const r=rng(o.seed||3);const L=Array.from({length:6},(_,i)=>{const items=[];let x=-200;while(x<2600){const w=20+r()*90,h=(30+r()*(i<2?260:160))*(1-i*.08);items.push({x,w,h,lit:r()});x+=w+4+r()*30}return {items,depth:1-i*.16,i}});
  return loop(canvas,(x,W,H,t,{mx,my,sc})=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,o.sky||'#05070A');g.addColorStop(1,o.bg||'#0B0E12');x.fillStyle=g;x.fillRect(0,0,W,H);
   for(let k=L.length-1;k>=0;k--){const l=L[k],dep=l.depth,base=H*(.9-k*.075)-sc*120*dep,off=-(t*6*dep+mx*120*dep)%2400,tilt=-.08;
    x.save();x.translate(0,base);x.transform(1,tilt,0,1,0,0);
    for(const it of l.items){const X=it.x+off;if(X>W+200||X+it.w<-200)continue;const shade=8+k*6;x.fillStyle=`rgb(${shade},${shade+3},${shade+8})`;x.fillRect(X,-it.h,it.w,it.h+H);
     x.fillStyle=`rgba(${o.litRGB||'221,251,255'},${(.22+.45*(1-k/6))*it.lit})`;for(let yy=-it.h+8;yy<-6;yy+=9)for(let xx=X+5;xx<X+it.w-5;xx+=8)if(((xx*7+yy*3)|0)%5===0)x.fillRect(xx,yy,3,2)
     x.strokeStyle=k<2?(o.hi||'#7FE7F7'):`rgba(127,231,247,${.35-k*.05})`;x.globalAlpha=.6-k*.08;x.lineWidth=1;x.beginPath();x.moveTo(X,-it.h);x.lineTo(X+it.w,-it.h);x.stroke();x.globalAlpha=1}
    /* the trace running along this layer's street */
    x.strokeStyle=`rgba(127,231,247,${.5-k*.07})`;x.beginPath();x.moveTo(-50,2);x.lineTo(W+50,2);x.stroke();
    const n=6-k;for(let q=0;q<n;q++){const px=((t*(60+q*25)*dep+q*400)%(W+200))-100;x.fillStyle=q%3?'#DDFBFF':(o.live||'#3CF29A');x.shadowColor=x.fillStyle;x.shadowBlur=10;x.fillRect(px,0,10-k,3);x.shadowBlur=0}
    x.restore();
    x.fillStyle=`rgba(7,9,12,${.18})`;x.fillRect(0,0,W,H)}
  },{fps:60})}

 /* 4. blueprint: the city drawn as an engineering line projection, traced in as you watch */
 function blueprint(canvas,o={}){const C=city(o.seed||21,{n:60,span:46}),cam=projector();C.chips.forEach(c=>c.h=c.h*2.2+.3);
  return loop(canvas,(x,W,H,t,{mx,my,sc})=>{x.fillStyle=o.bg||'#071018';x.fillRect(0,0,W,H);x.strokeStyle='rgba(127,231,247,.06)';x.lineWidth=1;for(let i=0;i<W;i+=24){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke()}for(let j=0;j<H;j+=24){x.beginPath();x.moveTo(0,j);x.lineTo(W,j);x.stroke()}
   cam.cx=W*.6;cam.cy=H*.4;cam.f=Math.max(W,H)*.72;cam.x=24+mx*5;cam.y=14-sc*5+my*2;cam.z=-24;cam.yaw=-.75+mx*.05;cam.pitch=.42;
   const prog=reduce?1:Math.min(1,(t%26)/12);const n=Math.floor(C.chips.length*prog);
   x.lineWidth=1;C.chips.slice(0,n).forEach((ch,i)=>{const v=box(cam,ch);if(v.some(p=>!p))return;const fresh=i>n-4&&prog<1;x.strokeStyle=fresh?'#DDFBFF':(o.hi||'rgba(127,231,247,.75)');[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(([a,b])=>{x.beginPath();x.moveTo(v[a][0],v[a][1]);x.lineTo(v[b][0],v[b][1]);x.stroke()});
    if(ch.h>5&&i%3===0){const top=v[5];x.fillStyle='rgba(221,251,255,.7)';x.font='10px "IBM Plex Mono",monospace';x.fillText(`H ${(ch.h*12).toFixed(0)}m`,top[0]+6,top[1]-4);x.setLineDash([2,3]);x.beginPath();x.moveTo(v[1][0]+10,v[1][1]);x.lineTo(v[5][0]+10,v[5][1]);x.stroke();x.setLineDash([])}});
   for(const rt of C.routes){if(!rt.hi)continue;x.strokeStyle='rgba(127,231,247,.35)';x.beginPath();let first=true;for(const [px,pz] of rt.pts){const p=cam.p(px,0,pz);if(!p){first=true;continue}first?x.moveTo(p[0],p[1]):x.lineTo(p[0],p[1]);first=false}x.stroke();
    const [ax,az]=at(rt,(t*6)%rt.total),p=cam.p(ax,0,az);if(p){x.fillStyle=o.live||'#3CF29A';x.fillRect(p[0]-2,p[1]-2,4,4)}}
  },{fps:30})}

 /* 5. swarm: agents as lights that flock between towers */
 function swarm(canvas,o={}){const C=city(o.seed||8,{n:80,span:50}),cam=projector(),r=C.r;const tall=C.chips.filter(c=>c.h>2);
  const B=Array.from({length:o.n||360},()=>({x:(r()-.5)*40,y:1+r()*6,z:(r()-.5)*40,vx:0,vy:0,vz:0,tg:tall[r()*tall.length|0],c:r()<.1?(o.live||'#3CF29A'):r()<.04?'#A98BFF':(o.hi||'#7FE7F7')}));
  return loop(canvas,(x,W,H,t,{mx,my,sc})=>{x.fillStyle='rgba(7,9,12,.35)';x.fillRect(0,0,W,H);cam.cx=W*.6;cam.cy=H*.38;cam.f=Math.max(W,H)*.7;cam.x=22+mx*5;cam.y=11-sc*4+my*2;cam.z=-23;cam.yaw=-.7+mx*.05;cam.pitch=.34;
   const sorted=C.chips.slice().sort((a,b)=>Math.hypot(b.x-cam.x,b.z-cam.z)-Math.hypot(a.x-cam.x,a.z-cam.z));
   for(const ch of sorted){const v=box(cam,ch);if(v.some(p=>!p))continue;for(const f of FACES){const pts=f.map(i=>v[i]);const ar=(pts[1][0]-pts[0][0])*(pts[2][1]-pts[0][1])-(pts[1][1]-pts[0][1])*(pts[2][0]-pts[0][0]);if(ar>0)continue;poly(x,pts);x.fillStyle=f[0]===4?'#151A21':'#0D1015';x.fill();x.strokeStyle='rgba(168,216,226,.16)';x.lineWidth=.6;x.stroke()}}
   x.globalCompositeOperation='lighter';
   for(const b of B){if(r()<.002)b.tg=tall[r()*tall.length|0];const tx=b.tg.x,ty=b.tg.h+1.5,tz=b.tg.z;let ax=(tx-b.x)*.004,ay=(ty-b.y)*.004,az=(tz-b.z)*.004;
    ax+=Math.sin(t+b.z)*.003;az+=Math.cos(t*1.3+b.x)*.003;b.vx=(b.vx+ax)*.97;b.vy=(b.vy+ay)*.97;b.vz=(b.vz+az)*.97;b.x+=b.vx;b.y+=b.vy;b.z+=b.vz;
    const p=cam.p(b.x,b.y,b.z);if(!p)continue;const s=Math.max(1.4,36/p[2]);const g=x.createRadialGradient(p[0],p[1],0,p[0],p[1],s*3);g.addColorStop(0,b.c);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(p[0]-s*3,p[1]-s*3,s*6,s*6)}
   x.globalCompositeOperation='source-over'},{fps:60})}
 return {trails,glyphs,layers,blueprint,swarm};
})();
