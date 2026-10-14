'use strict';
/* Live simulations for five specimen entries, run in the animation studio like the other studies.
   A49 ferrofluid, A76 double pendulum, A78 reaction-diffusion, A84 Lorenz attractor, A88 metaballs.
   Each draws to #simCanvas over the study stage, follows Play / Pause / Speed / Reduced motion from
   StudyEngine, and has its own sliders. The maths is real: RK4 for the pendulum and Lorenz system,
   Gray-Scott for reaction-diffusion, a summed inverse-square field for metaballs. The ferrofluid is a
   stylised Rosensweig-pattern surface (spikes on a hexagonal lattice) rather than a fluid solver. */
(()=>{
 const TAU=Math.PI*2,clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const SE=()=>typeof StudyEngine!=='undefined'?StudyEngine:null;

 /* ---------- A84 Lorenz attractor ---------- */
 const lorenz={name:'Lorenz attractor',note:'Integrates the Lorenz equations with RK4 and draws the last few thousand steps in 3D. Change ρ below about 24.7 and the butterfly collapses to a fixed point. Drag to turn the view.',
  params:[{k:'sigma',l:'σ (sigma)',min:1,max:20,step:.1,v:10},{k:'rho',l:'ρ (rho)',min:5,max:50,step:.1,v:28},{k:'beta',l:'β (beta)',min:.5,max:5,step:.01,v:2.667},{k:'trail',l:'Trail length',min:500,max:8000,step:100,v:4000},{k:'spin',l:'Auto-rotate',min:0,max:1,step:.01,v:.25}],
  init(s,P){s.p=[0.1,0,0];s.pts=[];s.yaw=.6;s.pitch=.15;this.step(s,{...P,spin:0},7.5);},
  f(p,P){return [P.sigma*(p[1]-p[0]),p[0]*(P.rho-p[2])-p[1],p[0]*p[1]-P.beta*p[2]];},
  step(s,P,dt){const h=.005,n=Math.max(1,Math.round(dt*3/h));for(let i=0;i<n;i++){const p=s.p,k1=this.f(p,P),a=p.map((v,j)=>v+k1[j]*h/2),k2=this.f(a,P),b=p.map((v,j)=>v+k2[j]*h/2),k3=this.f(b,P),c=p.map((v,j)=>v+k3[j]*h),k4=this.f(c,P);s.p=p.map((v,j)=>v+h/6*(k1[j]+2*k2[j]+2*k3[j]+k4[j]));s.pts.push(s.p);}
   const max=P.trail|0;if(s.pts.length>max)s.pts.splice(0,s.pts.length-max);s.yaw+=dt*P.spin*.6;},
  draw(ctx,w,h,s,P){ctx.fillStyle='#03050c';ctx.fillRect(0,0,w,h);const sc=Math.min(w,h)/62,cy=Math.cos(s.yaw),sy=Math.sin(s.yaw),cp=Math.cos(s.pitch),sp=Math.sin(s.pitch);
   const proj=p=>{const x=p[0],y=p[1],z=p[2]-P.rho+1;const X=x*cy-y*sy,Y=x*sy+y*cy;const Z=z*cp-Y*sp;return [w/2+X*sc,h/2-Z*sc];};
   ctx.globalCompositeOperation='lighter';ctx.lineWidth=1.2;const pts=s.pts,n=pts.length;
   for(let i=1;i<n;i++){const a=proj(pts[i-1]),b=proj(pts[i]);const age=i/n;ctx.strokeStyle=pts[i][0]>0?`rgba(34,211,238,${.08+age*.6})`:`rgba(232,121,249,${.08+age*.6})`;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
   if(n){const e=proj(pts[n-1]);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(e[0],e[1],3,0,TAU);ctx.fill();}
   ctx.globalCompositeOperation='source-over';label(ctx,['LORENZ ATTRACTOR',`σ ${P.sigma.toFixed(1)}  ρ ${P.rho.toFixed(1)}  β ${P.beta.toFixed(2)}`,`steps ${n}`]);},
  drag(s,dx,dy){s.yaw+=dx*.01;s.pitch=clamp(s.pitch+dy*.01,-1.2,1.2);}};

 /* ---------- A76 Double pendulum ---------- */
 const pend={name:'Double pendulum',note:'Two linked pendulums integrated with RK4. Turn on the twin to release a second pendulum one thousandth of a degree away: the paths match at first, then diverge completely. That is chaos.',
  params:[{k:'a1',l:'Release angle 1 (°)',min:10,max:179,step:1,v:120},{k:'a2',l:'Release angle 2 (°)',min:-179,max:179,step:1,v:-20},{k:'ratio',l:'Arm length ratio',min:.4,max:1.6,step:.01,v:1},{k:'mass',l:'Mass ratio',min:.2,max:3,step:.01,v:1},{k:'trail',l:'Trail length',min:100,max:3000,step:50,v:1400},{k:'twin',l:'Chaos twin',type:'toggle',v:1}],
  init(s,P){const r=d=>d*Math.PI/180;s.A=[r(P.a1),r(P.a2),0,0];s.B=[r(P.a1)+r(.001),r(P.a2),0,0];s.ta=[];s.tb=[];},
  d(st,P){const [t1,t2,w1,w2]=st,m1=1,m2=P.mass,l1=1,l2=P.ratio,g=9.81,dt=t1-t2,den=2*m1+m2-m2*Math.cos(2*dt);
   const a1=(-g*(2*m1+m2)*Math.sin(t1)-m2*g*Math.sin(t1-2*t2)-2*Math.sin(dt)*m2*(w2*w2*l2+w1*w1*l1*Math.cos(dt)))/(l1*den);
   const a2=(2*Math.sin(dt)*(w1*w1*l1*(m1+m2)+g*(m1+m2)*Math.cos(t1)+w2*w2*l2*m2*Math.cos(dt)))/(l2*den);return [w1,w2,a1,a2];},
  rk(st,P,h){const k1=this.d(st,P),a=st.map((v,i)=>v+k1[i]*h/2),k2=this.d(a,P),b=st.map((v,i)=>v+k2[i]*h/2),k3=this.d(b,P),c=st.map((v,i)=>v+k3[i]*h),k4=this.d(c,P);return st.map((v,i)=>v+h/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]));},
  tip(st,P){const x1=Math.sin(st[0]),y1=Math.cos(st[0]);return [x1,y1,x1+P.ratio*Math.sin(st[1]),y1+P.ratio*Math.cos(st[1])];},
  step(s,P,dt){const h=.002,n=Math.max(1,Math.round(dt/h));for(let i=0;i<n;i++){s.A=this.rk(s.A,P,h);if(P.twin)s.B=this.rk(s.B,P,h);}
   const ta=this.tip(s.A,P);s.ta.push([ta[2],ta[3]]);if(P.twin){const tb=this.tip(s.B,P);s.tb.push([tb[2],tb[3]]);}const m=P.trail|0;if(s.ta.length>m)s.ta.splice(0,s.ta.length-m);if(s.tb.length>m)s.tb.splice(0,s.tb.length-m);},
  draw(ctx,w,h,s,P){ctx.fillStyle='#03050c';ctx.fillRect(0,0,w,h);const sc=Math.min(w,h)*.42/(1+P.ratio),ox=w/2,oy=h*.42;const X=v=>ox+v[0]*sc,Y=v=>oy+v[1]*sc;
   const trail=(t,col)=>{ctx.lineWidth=1.6;for(let i=1;i<t.length;i++){ctx.strokeStyle=col.replace('A',(i/t.length*.85).toFixed(3));ctx.beginPath();ctx.moveTo(X(t[i-1]),Y(t[i-1]));ctx.lineTo(X(t[i]),Y(t[i]));ctx.stroke();}};
   ctx.globalCompositeOperation='lighter';trail(s.ta,'rgba(34,211,238,A)');if(P.twin)trail(s.tb,'rgba(253,164,175,A)');ctx.globalCompositeOperation='source-over';
   const arm=(st,col)=>{const p=this.tip(st,P);ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(X([p[0],p[1]]),Y([p[0],p[1]]));ctx.lineTo(X([p[2],p[3]]),Y([p[2],p[3]]));ctx.stroke();ctx.fillStyle=col;[[p[0],p[1],7],[p[2],p[3],5+4*P.mass]].forEach(([a,b,r])=>{ctx.beginPath();ctx.arc(X([a,b]),Y([a,b]),r,0,TAU);ctx.fill();});};
   if(P.twin)arm(s.B,'rgba(253,164,175,.85)');arm(s.A,'#eef2f8');ctx.fillStyle='#a8b3c7';ctx.beginPath();ctx.arc(ox,oy,4,0,TAU);ctx.fill();
   const dx=P.twin&&s.tb.length?Math.hypot(s.ta.at(-1)[0]-s.tb.at(-1)[0],s.ta.at(-1)[1]-s.tb.at(-1)[1]):0;
   label(ctx,['DOUBLE PENDULUM',`release ${P.a1}° / ${P.a2}°  ratio ${P.ratio.toFixed(2)}`,P.twin?`twin offset 0.001° → gap ${dx.toFixed(3)} arm lengths`:'twin off']);}};

 /* ---------- A78 Gray-Scott reaction-diffusion ---------- */
 const rd={name:'Reaction-diffusion (Gray-Scott)',note:'Two chemicals diffuse and react on a grid. Feed and kill rates choose the pattern family: spots, stripes, coral or dividing cells. Draw on the stage to seed new growth.',
  params:[{k:'F',l:'Feed rate',min:.01,max:.09,step:.0005,v:.029},{k:'K',l:'Kill rate',min:.045,max:.07,step:.0005,v:.057},{k:'iters',l:'Steps per frame',min:1,max:24,step:1,v:10},{k:'preset',l:'Pattern preset',type:'select',opts:[[1,'Labyrinth'],[2,'Spots'],[3,'Coral'],[4,'Mitosis']],v:1}],
  presets:{1:[.029,.057],2:[.035,.065],3:[.0545,.062],4:[.0367,.0649]},
  init(s,P,w,h){const W=200,H=Math.max(80,Math.round(W*h/w));s.W=W;s.H=H;s.a=new Float32Array(W*H).fill(1);s.b=new Float32Array(W*H);s.a2=new Float32Array(W*H);s.b2=new Float32Array(W*H);
   for(let n=0;n<14;n++){const cx=Math.random()*W|0,cy=Math.random()*H|0,r=3+(Math.random()*4|0);for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){const X=(cx+x+W)%W,Y=(cy+y+H)%H;if(x*x+y*y<=r*r){s.a[Y*W+X]=.5+Math.random()*.04;s.b[Y*W+X]=.25+Math.random()*.04;}}}
   s.img=new ImageData(W,H);s.off=document.createElement('canvas');s.off.width=W;s.off.height=H;s.lastPreset=P.preset;},
  step(s,P){if(P.preset!==s.lastPreset){s.lastPreset=P.preset;const p=this.presets[P.preset];if(p){P.F=p[0];P.K=p[1];syncSliders();}}
   const {W,H}=s,F=P.F,K=P.K,Da=1,Db=.5;for(let it=0;it<P.iters;it++){const a=s.a,b=s.b,A=s.a2,B=s.b2;
    for(let y=0;y<H;y++){const ym=((y-1+H)%H)*W,y0=y*W,yp=((y+1)%H)*W;for(let x=0;x<W;x++){const xm=(x-1+W)%W,xp=(x+1)%W,i=y0+x;
     const la=a[ym+x]*.2+a[yp+x]*.2+a[y0+xm]*.2+a[y0+xp]*.2+a[ym+xm]*.05+a[ym+xp]*.05+a[yp+xm]*.05+a[yp+xp]*.05-a[i];
     const lb=b[ym+x]*.2+b[yp+x]*.2+b[y0+xm]*.2+b[y0+xp]*.2+b[ym+xm]*.05+b[ym+xp]*.05+b[yp+xm]*.05+b[yp+xp]*.05-b[i];
     const abb=a[i]*b[i]*b[i];A[i]=a[i]+Da*la-abb+F*(1-a[i]);B[i]=b[i]+Db*lb+abb-(K+F)*b[i];}}
    s.a=A;s.b=B;s.a2=a;s.b2=b;}},
  draw(ctx,w,h,s,P){const {W,H}=s,d=s.img.data;for(let i=0;i<W*H;i++){const v=clamp((s.a[i]-s.b[i]),0,1),t=1-v;d[i*4]=8+t*40;d[i*4+1]=20+t*190;d[i*4+2]=40+t*200;d[i*4+3]=255;}
   s.off.getContext('2d').putImageData(s.img,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(s.off,0,0,w,h);label(ctx,['GRAY-SCOTT REACTION-DIFFUSION',`feed ${P.F.toFixed(4)}  kill ${P.K.toFixed(4)}`,'draw to seed']);},
  paint(s,u,v){const {W,H}=s,cx=u*W|0,cy=v*H|0,r=3;for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){if(x*x+y*y>r*r)continue;const X=(cx+x+W)%W,Y=(cy+y+H)%H;s.a[Y*W+X]=.5;s.b[Y*W+X]=.25;}}};

 /* ---------- A88 Metaballs ---------- */
 const meta={name:'Metaballs',note:'Each blob adds an inverse-square field; the surface is where the total crosses a threshold, so blobs neck and merge smoothly instead of overlapping. Colour mixes by each blob\'s share of the field. Move the pointer to add a blob.',
  params:[{k:'count',l:'Blobs',min:2,max:9,step:1,v:5},{k:'size',l:'Blob size',min:.5,max:1.8,step:.01,v:1},{k:'thresh',l:'Threshold (lower is gooier)',min:.6,max:2,step:.01,v:1},{k:'gloss',l:'Gloss',min:0,max:1,step:.01,v:.8}],
  init(s){s.t=0;s.ptr=null;s.off=document.createElement('canvas');},
  step(s,P,dt){s.t+=dt;},
  balls(s,P){const B=[];for(let i=0;i<P.count;i++){const a=i*2.399+s.t*(.25+i*.04),r=.28+.12*Math.sin(i*1.7+s.t*.3);B.push([.5+Math.cos(a)*r*1.3,.5+Math.sin(a*1.3)*r*.8,(.09+.03*Math.sin(i*3.1))*P.size,i%2]);}if(s.ptr)B.push([s.ptr[0],s.ptr[1],.1*P.size,2]);return B;},
  draw(ctx,w,h,s,P){const W=Math.min(260,w>>1),H=Math.round(W*h/w);if(s.off.width!==W||s.off.height!==H){s.off.width=W;s.off.height=H;s.img=new ImageData(W,H);}
   const B=this.balls(s,P),d=s.img.data,ar=w/h,cols=[[37,99,235],[236,72,153],[250,204,21]];const L=[-.5,-.6,.62];
   const field=(x,y)=>{let f=0;for(const b of B){const dx=(x-b[0])*ar,dy=y-b[1];f+=b[2]*b[2]/(dx*dx+dy*dy+1e-5);}return f;};
   for(let j=0;j<H;j++)for(let i=0;i<W;i++){const x=i/W,y=j/H,k=(j*W+i)*4;let f=0,r=0,g=0,bl=0;for(const b of B){const dx=(x-b[0])*ar,dy=y-b[1],c=b[2]*b[2]/(dx*dx+dy*dy+1e-5);f+=c;const C=cols[b[3]];r+=C[0]*c;g+=C[1]*c;bl+=C[2]*c;}
    if(f<P.thresh){const v=12+8*(j/H);d[k]=v;d[k+1]=v+6;d[k+2]=v+40;d[k+3]=255;continue;}
    const e=1/W,nx=field(x-e,y)-field(x+e,y),ny=field(x,y-e)-field(x,y+e),nz=.9,nl=Math.hypot(nx,ny,nz);const N=[nx/nl,ny/nl,nz/nl];
    const diff=clamp(-(N[0]*L[0]+N[1]*L[1])+N[2]*L[2],0,1),spec=Math.pow(clamp(N[2]*.9-N[0]*.3-N[1]*.4,0,1),40)*P.gloss;const edge=clamp((f-P.thresh)*3,0,1);
    d[k]=clamp(r/f*(.35+.75*diff)+spec*255,0,255)*edge+20*(1-edge);d[k+1]=clamp(g/f*(.35+.75*diff)+spec*255,0,255)*edge+26*(1-edge);d[k+2]=clamp(bl/f*(.35+.75*diff)+spec*255,0,255)*edge+60*(1-edge);d[k+3]=255;}
   s.off.getContext('2d').putImageData(s.img,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(s.off,0,0,w,h);label(ctx,['METABALLS',`${B.length} blobs  threshold ${P.thresh.toFixed(2)}`,'move the pointer to add one']);},
  pointer(s,u,v){s.ptr=u==null?null:[u,v];}};

 /* ---------- A49 Ferrofluid (stylised) ---------- */
 const ferro={name:'Ferrofluid spikes',note:'A stylised Rosensweig instability: spikes sit on a hexagonal lattice and rise with the local field strength under a moving magnet, while pulses ripple outward. Move the pointer to steer the magnet. Not a fluid solver.',
  params:[{k:'field',l:'Field strength',min:0,max:1.5,step:.01,v:1},{k:'reach',l:'Magnet reach',min:.15,max:.8,step:.01,v:.5},{k:'pulse',l:'Pulse speed',min:0,max:2,step:.01,v:.8},{k:'density',l:'Spike density',min:9,max:24,step:1,v:17}],
  init(s){s.t=0;s.mag=null;},
  step(s,P,dt){s.t+=dt;},
  draw(ctx,w,h,s,P){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#05060a');g.addColorStop(1,'#16181f');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
   const mx=s.mag?s.mag[0]:.5+.18*Math.sin(s.t*.4),my=s.mag?s.mag[1]:.5+.12*Math.cos(s.t*.33);
   const N=P.density|0,horizon=h*.18,spikes=[];
   for(let r=0;r<N;r++)for(let c=0;c<N*1.6;c++){const u=(c+(r%2?.5:0))/(N*1.6),v=r/(N-1);const dx=(u-mx)*1.4,dy=(v-my),d=Math.hypot(dx,dy);
    const near=Math.exp(-(d*d)/(P.reach*P.reach));const ring=.55+.45*Math.sin(d*22-s.t*P.pulse*6);const ht=P.field*near*(.6+.4*ring);if(ht<.04)continue;
    const persp=.35+.65*v,X=w/2+(u-.5)*w*1.25*persp,Y=horizon+Math.pow(v,1.35)*(h-horizon)*.95;spikes.push([X,Y,ht,persp]);}
   // pool sheen
   const pool=ctx.createRadialGradient(w*mx,horizon+(h-horizon)*my,10,w*mx,horizon+(h-horizon)*my,w*.6);pool.addColorStop(0,'rgba(120,130,150,.18)');pool.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=pool;ctx.fillRect(0,0,w,h);
   spikes.sort((a,b)=>a[1]-b[1]);
   for(const [X,Y,ht,p] of spikes){const H=ht*h*.3*p,Wd=Math.max(4,h*.034*p*(.55+ht));
    ctx.fillStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.ellipse(X,Y,Wd*1.6,Wd*.45,0,0,TAU);ctx.fill();
    const gr=ctx.createLinearGradient(X-Wd,0,X+Wd,0);gr.addColorStop(0,'#0b0c10');gr.addColorStop(.32,'#3a3f4a');gr.addColorStop(.42,'#e8ecf2');gr.addColorStop(.52,'#20232b');gr.addColorStop(1,'#050608');
    ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(X-Wd*1.15,Y);ctx.quadraticCurveTo(X-Wd*.35,Y-H*.35,X,Y-H);ctx.quadraticCurveTo(X+Wd*.35,Y-H*.35,X+Wd*1.15,Y);ctx.closePath();ctx.fill();}
   label(ctx,['FERROFLUID / ROSENSWEIG SPIKES',`field ${P.field.toFixed(2)}  reach ${P.reach.toFixed(2)}`,'move the pointer to steer the magnet']);},
  pointer(s,u,v){s.mag=u==null?null:[u,v];}};

 const SIMS={A84:lorenz,A76:pend,A78:rd,A88:meta,A49:ferro};
 function label(ctx,lines){ctx.save();ctx.font='500 11px "JetBrains Mono",ui-monospace,monospace';ctx.fillStyle='rgba(238,242,248,.72)';lines.forEach((t,i)=>ctx.fillText(t,16,24+i*16));ctx.restore();}

 /* ---------- wiring ---------- */
 let cv,ctx,panel,cur=null,state={},P={},raf=0,last=0,showRef=false,ptrDown=false,lastPtr=null;
 function ensure(){const stage=document.getElementById('motionStage');if(!stage)return false;if(cv)return true;
  cv=document.createElement('canvas');cv.id='simCanvas';cv.className='simcanvas';cv.hidden=true;cv.setAttribute('role','img');stage.append(cv);ctx=cv.getContext('2d');
  panel=document.createElement('div');panel.id='simPanel';panel.className='simPanel';panel.hidden=true;stage.insertAdjacentElement('afterend',panel);
  const rel=e=>{const r=cv.getBoundingClientRect();return [clamp((e.clientX-r.left)/r.width,0,1),clamp((e.clientY-r.top)/r.height,0,1)];};
  cv.addEventListener('pointerdown',e=>{ptrDown=true;lastPtr=[e.clientX,e.clientY];cv.setPointerCapture(e.pointerId);const [u,v]=rel(e);cur?.paint?.(state,u,v);});
  cv.addEventListener('pointermove',e=>{const [u,v]=rel(e);cur?.pointer?.(state,u,v);if(ptrDown){cur?.paint?.(state,u,v);if(cur?.drag&&lastPtr){cur.drag(state,e.clientX-lastPtr[0],e.clientY-lastPtr[1]);}lastPtr=[e.clientX,e.clientY];}if(!running())paintOnce();});
  cv.addEventListener('pointerup',()=>{ptrDown=false;lastPtr=null;});cv.addEventListener('pointerleave',()=>{cur?.pointer?.(state,null,null);});
  return true;}
 function size(){const r=cv.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1),w=Math.max(2,Math.round(r.width*dpr)),h=Math.max(2,Math.round(r.height*dpr));if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}return [w,h];}
 function running(){const se=SE();return !!se&&se.playing&&!se.reduced&&se.visible;}
 function paintOnce(){if(!cur)return;const [w,h]=size();ctx.setTransform(1,0,0,1,0,0);cur.draw(ctx,w,h,state,P);}
 function loop(now){raf=0;if(!cur||cv.hidden)return;const dt=last?Math.min(.05,(now-last)/1000):0;last=now;const se=SE();
  if(running())cur.step(state,P,dt*(se.speed||1));paintOnce();if(running())raf=requestAnimationFrame(loop);}
 function kick(){if(!raf&&cur&&!cv.hidden){last=0;raf=requestAnimationFrame(loop);}}
 function reset(){const [w,h]=size();state={};cur.init(state,P,w,h);
  const se=SE();if(se?.reduced){for(let i=0;i<240;i++)cur.step(state,P,1/60);}paintOnce();}
 function syncSliders(){panel?.querySelectorAll('input[data-k]').forEach(i=>{i.value=P[i.dataset.k];const o=i.parentElement.querySelector('output');if(o)o.textContent=fmt(P[i.dataset.k],i.step);});}
 const fmt=(v,step)=>{const d=String(step).includes('.')?String(step).split('.')[1].length:0;return Number(v).toFixed(d);};
 function buildPanel(id,sim){panel.innerHTML=`<p class="simKicker">Live simulation · ${id}</p><div class="simGrid">${sim.params.map(p=>p.type==='toggle'?`<label class="simToggle"><input type="checkbox" data-t="${p.k}" ${P[p.k]?'checked':''}><span>${p.l}</span></label>`:p.type==='select'?`<label class="simSelect"><span>${p.l}</span><select data-s="${p.k}">${p.opts.map(([v,t])=>`<option value="${v}" ${v===P[p.k]?'selected':''}>${t}</option>`).join('')}</select></label>`:`<label><span>${p.l}</span><input type="range" data-k="${p.k}" min="${p.min}" max="${p.max}" step="${p.step}" value="${P[p.k]}"><output>${fmt(P[p.k],p.step)}</output></label>`).join('')}</div><div class="simActions"><button type="button" class="secondary" data-sim="reset">Reset simulation</button><button type="button" class="secondary" data-sim="ref" aria-pressed="false">Show reference image</button></div>`;
  panel.querySelectorAll('input[data-k]').forEach(inp=>inp.oninput=()=>{P[inp.dataset.k]=Number(inp.value);inp.parentElement.querySelector('output').textContent=fmt(inp.value,inp.step);if(['a1','a2','ratio','mass','twin'].includes(inp.dataset.k)&&cur===pend)reset();if(!running())paintOnce();});
  panel.querySelectorAll('[data-t]').forEach(c=>c.onchange=()=>{P[c.dataset.t]=c.checked?1:0;if(cur===pend)reset();kick();});
  panel.querySelectorAll('[data-s]').forEach(c=>c.onchange=()=>{P[c.dataset.s]=Number(c.value);if(!running()){cur.step(state,{...P,iters:0},0);paintOnce();}});
  panel.querySelector('[data-sim="reset"]').onclick=()=>{reset();kick();};
  const ref=panel.querySelector('[data-sim="ref"]');ref.onclick=()=>{showRef=!showRef;ref.setAttribute('aria-pressed',String(showRef));ref.textContent=showRef?'Show live simulation':'Show reference image';cv.hidden=showRef;document.getElementById('motionStage').classList.toggle('simLive',!showRef);if(!showRef){paintOnce();kick();}};}
 function activate(id){if(!ensure())return;const sim=SIMS[id];document.getElementById('motionStage').classList.toggle('simLive',!!sim);
  if(!sim){cancelAnimationFrame(raf);raf=0;cur=null;cv.hidden=true;panel.hidden=true;return;}
  cancelAnimationFrame(raf);raf=0;cur=sim;showRef=false;P={};sim.params.forEach(p=>P[p.k]=p.v);cv.hidden=false;panel.hidden=false;buildPanel(id,sim);cv.setAttribute('aria-label',sim.name+' live simulation');
  reset();kick();
  const type=document.getElementById('studyType'),hint=document.getElementById('motionHint');if(type)type.textContent='Live simulation';if(hint)hint.textContent=sim.note;}
 function hook(){if(typeof window.selectStudy!=='function'||window.selectStudy.__sims)return false;const orig=window.selectStudy;const w=function(id){const r=orig.apply(this,arguments);try{activate(id);}catch(e){console.warn(e);}return r;};w.__sims=true;w.__atlas=orig.__atlas;window.selectStudy=w;return true;}
 const t=setInterval(()=>{if(window.selectStudy?.__atlas&&hook()){clearInterval(t);const id=document.getElementById('motionSelect')?.value;if(id&&SIMS[id])activate(id);}},300);
 // follow the studio's transport and page visibility
 document.addEventListener('click',e=>{if(e.target.closest('#playPause,#replay,#reduce,#speed')){setTimeout(()=>{if(e.target.closest('#replay')&&cur)reset();kick();},30);}});
 document.addEventListener('change',e=>{if(e.target.id==='speed')kick();});
 addEventListener('hashchange',()=>setTimeout(kick,60));addEventListener('resize',()=>{if(cur&&!cv.hidden)paintOnce();});
 window.LiveSims={ids:Object.keys(SIMS),activate,get current(){return cur?.name||null;}};
})();
