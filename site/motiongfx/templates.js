'use strict';
/* Motion graphics templates. Each one draws a frame onto a canvas from a loop position p (0..1):
   draw(c, p, W, H, o, K)   c: 2D context · o: {t1,t2,t3,bg,ink,accent,font,weight} · K: the helpers below.
   Templates only use c, o and K, so the studio can export any of them as a single HTML file (helpers + that one function). */
(()=>{
const K={
 clamp:(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),
 seg:(p,a,b)=>Math.min(1,Math.max(0,(p-a)/(b-a))),
 lerp:(a,b,t)=>a+(b-a)*t,
 out:t=>1-Math.pow(1-t,3),
 inOut:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,
 expo:t=>t>=1?1:1-Math.pow(2,-10*t),
 back:t=>{const c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)},
 rnd:i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)},
 font:(o,size,weight)=>`${weight||o.weight||700} ${size}px ${o.font}`,
 /* largest size up to `size` at which `str` fits maxW */
 fit(c,o,str,maxW,size,weight){c.font=K.font(o,size,weight);const w=c.measureText(str).width;return w>maxW?size*maxW/w:size},
 text(c,o,str,x,y,size,{weight,align='center',color,alpha=1,base='middle',ls=0}={}){c.save();c.font=K.font(o,size,weight);c.textAlign=align;c.textBaseline=base;c.fillStyle=color||o.ink;c.globalAlpha*=alpha;if(ls&&'letterSpacing' in c)c.letterSpacing=ls+'px';c.fillText(str,x,y);c.restore()},
 rr(c,x,y,w,h,r){r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);c.beginPath();c.roundRect?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h)},
 /* in / hold / out envelope: a rises 0..1 over the first part of the loop, z rises 0..1 over the last part */
 io(p,i=.22,z=.86){return{a:K.seg(p,0,i),z:K.seg(p,z,1)}},
 wrap(c,o,str,maxW,size,weight){c.font=K.font(o,size,weight);const words=String(str).split(/\s+/),lines=[];let l='';for(const w of words){const t=l?l+' '+w:w;if(c.measureText(t).width>maxW&&l){lines.push(l);l=w}else l=t}if(l)lines.push(l);return lines}
};
const T=[];const add=t=>T.push(t);
const u=(W,H)=>Math.min(W,H)/100;

/* ───────── Titles ───────── */
add({id:'mask-rise',name:'Mask rise',cat:'Titles',dur:4,d:'Two lines rise out of a mask while a rule draws under them.',f:{t1:'Visual & Motion',t2:'A field guide to how images move'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,{a,z}=K.io(p),m=W*.1,s1=K.fit(c,o,o.t1,W-2*m,U*13),y=H*.46;
  const line=(str,yy,size,d,w,col)=>{const e=K.expo(K.seg(a,d,d+.7))-K.out(z);c.save();c.beginPath();c.rect(0,yy-size*.62,W,size*1.24);c.clip();K.text(c,o,str,W/2,yy+size*1.2*(1-e),size,{weight:w,color:col});c.restore()};
  line(o.t1,y,s1,0,null);const s2=K.fit(c,o,o.t2,W-2*m,U*4);line(o.t2,y+s1*.62+s2*1.3,s2,.25,400,o.ink);
  const r=K.inOut(K.seg(a,.1,.9))*(1-K.inOut(z)),rw=Math.min(W-2*m,U*46)*r;c.fillStyle=o.accent;c.fillRect(W/2-rw/2,y+s1*.62,rw,Math.max(2,U*.5))}});

add({id:'kinetic-stack',name:'Kinetic stack',cat:'Titles',dur:4,d:'Words slam in one at a time and stack; the last one takes the accent.',f:{t1:'MAKE IT MOVE NOW'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,w=String(o.t1).split(/\s+/).slice(0,6),n=w.length,z=K.seg(p,.88,1),lh=Math.min(H*.8/n,U*24);
  w.forEach((s,i)=>{const t=K.seg(p,i*.6/n,i*.6/n+.12),e=K.back(t),size=K.fit(c,o,s,W*.84,lh*.92,800),y=H/2+(i-(n-1)/2)*lh;if(t<=0)return;c.save();c.translate(W/2,y);c.scale(1+(1-e)*1.4,1+(1-e)*1.4);c.translate(-W*1.2*K.out(z)*(i%2?1:-1),0);K.text(c,o,s,0,0,size,{weight:800,color:i===n-1?o.accent:o.ink,alpha:Math.min(1,t*3)});c.restore()})}});

add({id:'typewriter',name:'Typewriter',cat:'Titles',dur:5,d:'A line types itself with a blinking cursor, then a caption fades in.',f:{t1:'Hello, world.',t2:'typed at 14 characters a second'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,s=String(o.t1),k=Math.floor(K.seg(p,.05,.55)*s.length+.001),z=K.seg(p,.9,1),size=K.fit(c,o,s+'_',W*.8,U*11);c.globalAlpha=1-z;
  c.font=K.font(o,size);const full=c.measureText(s).width,x=W/2-full/2,part=s.slice(0,k);K.text(c,o,part,x,H*.47,size,{align:'left'});
  const cw=c.measureText(part).width;if(Math.floor(p*14)%2||k<s.length&&k>0){c.fillStyle=o.accent;c.fillRect(x+cw+size*.06,H*.47-size*.5,size*.09,size)}
  K.text(c,o,o.t2,W/2,H*.47+size*1.1,K.fit(c,o,o.t2,W*.8,U*3.4,400),{weight:400,alpha:K.seg(p,.6,.72)*.75})}});

add({id:'split-reveal',name:'Split reveal',cat:'Titles',dur:4,d:'The title splits along its middle and the two halves slide apart to show a subtitle.',f:{t1:'CHAPTER ONE',t2:'Where it begins'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,a=K.out(K.seg(p,0,.14)),g=K.inOut(K.seg(p,.3,.5))-K.inOut(K.seg(p,.82,.96)),size=K.fit(c,o,o.t1,W*.82,U*15,800),gap=size*.42*g,y=H/2;
  for(const top of[1,0]){c.save();c.beginPath();top?c.rect(0,0,W,y-gap):c.rect(0,y+gap,W,H);c.clip();K.text(c,o,o.t1,W/2,y+(top?-gap:gap),size,{weight:800,alpha:a*(1-K.seg(p,.95,1))});c.restore()}
  c.save();c.beginPath();c.rect(0,y-gap,W,gap*2);c.clip();K.text(c,o,o.t2,W/2,y,K.fit(c,o,o.t2,W*.7,size*.3,500),{weight:500,color:o.accent});c.restore();
  c.fillStyle=o.accent;c.globalAlpha=g;c.fillRect(W*.1,y-gap-1,W*.8,2);c.fillRect(W*.1,y+gap-1,W*.8,2)}});

add({id:'outline-fill',name:'Outline fill',cat:'Titles',dur:4,d:'Outlined letters fill with colour from left to right.',f:{t1:'LOADING',t2:'Please stand by'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,{a,z}=K.io(p,.12,.9),size=K.fit(c,o,o.t1,W*.82,U*20,800),y=H*.47,f=K.inOut(K.seg(p,.12,.72));c.globalAlpha=K.out(a)*(1-z);
  c.font=K.font(o,size,800);c.textAlign='center';c.textBaseline='middle';c.lineWidth=Math.max(2,size*.022);c.strokeStyle=o.ink;c.lineJoin='round';c.strokeText(o.t1,W/2,y);
  const tw=c.measureText(o.t1).width,x0=W/2-tw/2;c.save();c.beginPath();c.rect(x0-size*.1,0,(tw+size*.2)*f,H);c.clip();c.fillStyle=o.accent;c.fillText(o.t1,W/2,y);c.restore();
  K.text(c,o,o.t2+'  '+Math.round(f*100)+'%',W/2,y+size*.78,K.fit(c,o,o.t2+' 100%',W*.7,U*3.2,500),{weight:500,alpha:.8})}});

add({id:'letter-cascade',name:'Letter cascade',cat:'Titles',dur:4,d:'Letters drop in one after another with a small bounce, then leave the same way.',f:{t1:'Cascade',t2:'one letter at a time'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,s=[...String(o.t1)],size=K.fit(c,o,o.t1,W*.8,U*18,800);c.font=K.font(o,size,800);const tw=c.measureText(o.t1).width;let x=W/2-tw/2;
  s.forEach((ch,i)=>{const w=c.measureText(ch).width,d=i*.4/s.length,e=K.back(K.seg(p,d,d+.16)),zz=K.out(K.seg(p,.8+d*.25,.9+d*.25));K.text(c,o,ch,x,H*.47-size*(1-e)*.9+size*zz*.9,size,{weight:800,align:'left',alpha:Math.min(1,K.seg(p,d,d+.08)*2)*(1-zz),color:i===0?o.accent:o.ink});x+=w});
  K.text(c,o,o.t2,W/2,H*.47+size*.78,K.fit(c,o,o.t2,W*.7,U*3.4,400),{weight:400,alpha:(K.seg(p,.45,.6)-K.seg(p,.8,.9))*.8})}});

add({id:'highlight-sweep',name:'Highlighter',cat:'Titles',dur:4,d:'A marker stroke sweeps behind the key line.',f:{t1:'This is the part',t2:'that matters'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,{a,z}=K.io(p,.15,.9),s=Math.min(K.fit(c,o,o.t1,W*.8,U*10),K.fit(c,o,o.t2,W*.76,U*10));c.globalAlpha=K.out(a)*(1-z);
  K.text(c,o,o.t1,W/2,H/2-s*.62,s);c.font=K.font(o,s);const tw=c.measureText(o.t2).width,sw=K.inOut(K.seg(p,.22,.5));
  c.save();c.translate(W/2,H/2+s*.62);c.rotate(-.012);c.fillStyle=o.accent;K.rr(c,-tw/2-s*.18,-s*.5,(tw+s*.36)*sw,s*1.04,s*.12);c.fill();c.restore();
  K.text(c,o,o.t2,W/2,H/2+s*.62,s,{color:sw>.5?o.bg:o.ink})}});

/* ───────── Lower thirds ───────── */
add({id:'lower-bar',name:'Lower third: bar',cat:'Lower thirds',dur:5,d:'A solid bar slides in from the left with a name and a role.',f:{t1:'Amara Okafor',t2:'Head of Design, Northwind'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,a=K.expo(K.seg(p,.04,.24)),z=K.inOut(K.seg(p,.84,.98)),s1=U*5.6,s2=U*3;c.font=K.font(o,s1);const w=Math.min(W*.8,Math.max(c.measureText(o.t1).width,c.measureText(o.t2).width*s2/s1)+U*10),h=U*15,x=W*.06,y=H*.76;
  c.save();c.beginPath();c.rect(x,y-U,(w+U)*(a-z),h+2*U);c.clip();c.fillStyle=o.accent;c.fillRect(x,y,U*1.2,h);c.fillStyle=o.ink;c.globalAlpha=.94;c.fillRect(x+U*1.2,y,w,h);c.globalAlpha=1;
  const t=K.out(K.seg(p,.14,.34));K.text(c,o,o.t1,x+U*5+U*4*(1-t),y+h*.36,K.fit(c,o,o.t1,w-U*8,s1),{align:'left',color:o.bg,alpha:t});K.text(c,o,o.t2,x+U*5+U*6*(1-t),y+h*.7,K.fit(c,o,o.t2,w-U*8,s2,500),{align:'left',weight:500,color:o.bg,alpha:t*.8});c.restore()}});

add({id:'lower-tag',name:'Lower third: live tag',cat:'Lower thirds',dur:5,d:'A pill with a pulsing dot, then the name pushes out beside it.',f:{t1:'LIVE',t2:'Studio session with Kenji Mori'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,a=K.back(K.seg(p,.04,.2)),z=K.seg(p,.88,1),h=U*8,y=H*.8,x=W*.06,s=U*3.4;c.globalAlpha=1-z;c.font=K.font(o,s,800);const pw=c.measureText(o.t1).width+h*1.5;
  c.font=K.font(o,s,500);const nw=Math.min(W*.86-pw,c.measureText(o.t2).width+h),e=K.expo(K.seg(p,.2,.42));
  c.fillStyle=o.ink;c.globalAlpha*=.92;K.rr(c,x,y,pw*a+nw*e,h,h/2);c.fill();c.globalAlpha=1-z;
  c.save();K.rr(c,x,y,pw*a+nw*e,h,h/2);c.clip();c.fillStyle=o.accent;K.rr(c,x,y,pw*a,h,h/2);c.fill();
  const pulse=(Math.sin(p*Math.PI*10)+1)/2;c.fillStyle=o.bg;c.beginPath();c.arc(x+h*.5,y+h/2,h*.13+h*.05*pulse,0,7);c.fill();
  K.text(c,o,o.t1,x+h*.85,y+h/2,s,{weight:800,align:'left',color:o.bg,alpha:a});K.text(c,o,o.t2,x+pw+h*.3,y+h/2,K.fit(c,o,o.t2,nw-h*.6,s,500),{weight:500,align:'left',color:o.bg,alpha:e});c.restore()}});

add({id:'lower-line',name:'Lower third: line',cat:'Lower thirds',dur:5,d:'A thin line draws across; the name rises above it and the role below.',f:{t1:'Dr. Lena Fischer',t2:'Marine biologist'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,l=K.inOut(K.seg(p,.03,.25))-K.inOut(K.seg(p,.86,.99)),x=W*.07,y=H*.82,s1=U*5.4,s2=U*3;c.font=K.font(o,s1);const w=Math.min(W*.8,Math.max(c.measureText(o.t1).width,U*30));
  c.fillStyle=o.accent;c.fillRect(x,y-U*.2,w*l,U*.4);const up=(str,size,dir,d,wt,al)=>{const e=K.expo(K.seg(p,d,d+.2))-K.out(K.seg(p,.8,.9));c.save();c.beginPath();dir<0?c.rect(0,y-size*1.6,W,size*1.6-U*.4):c.rect(0,y+U*.4,W,size*1.8);c.clip();K.text(c,o,str,x,y+dir*(size*.78)+(-dir)*size*1.4*(1-e),K.fit(c,o,str,w,size,wt),{align:'left',weight:wt,alpha:al});c.restore()};
  up(o.t1,s1,-1,.14);up(o.t2,s2,1,.22,500,.8)}});

/* ───────── Logo stings ───────── */
add({id:'logo-ring',name:'Logo sting: ring',cat:'Logo stings',dur:3.5,d:'A ring draws, the monogram pops in and sparks fly off.',f:{t1:'V/M',t2:'Visual & Motion Atlas'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,r=U*17,cx=W/2,cy=H*.44,d=K.inOut(K.seg(p,.02,.32)),z=K.seg(p,.9,1);c.globalAlpha=1-z;
  c.lineWidth=U*1.1;c.lineCap='round';c.strokeStyle=o.accent;c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*d);c.stroke();
  const e=K.back(K.seg(p,.26,.44));if(e>0){c.save();c.translate(cx,cy);c.scale(e,e);K.text(c,o,o.t1,0,0,K.fit(c,o,o.t1,r*1.45,r*.8,800),{weight:800});c.restore()}
  const b=K.seg(p,.32,.6);if(b>0&&b<1)for(let i=0;i<16;i++){const an=i/16*Math.PI*2+K.rnd(i),rr=r+U*(2+K.out(b)*(8+K.rnd(i+9)*10));c.fillStyle=i%3?o.accent:o.ink;c.globalAlpha=(1-b)*(1-z);c.beginPath();c.arc(cx+Math.cos(an)*rr,cy+Math.sin(an)*rr,U*(.5+K.rnd(i+3)*.5)*(1-b),0,7);c.fill()}
  c.globalAlpha=1-z;K.text(c,o,o.t2,cx,cy+r+U*8,K.fit(c,o,o.t2,W*.8,U*3.6,500),{weight:500,alpha:K.out(K.seg(p,.42,.6)),ls:U*.4})}});

add({id:'logo-tiles',name:'Logo sting: tiles',cat:'Logo stings',dur:3.5,d:'Tiles flip in from the corners and settle into a badge behind the monogram.',f:{t1:'A',t2:'ATLAS STUDIO'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,n=4,s=U*8,cx=W/2,cy=H*.44,z=K.seg(p,.9,1);c.globalAlpha=1-z;
  for(let i=0;i<n*n;i++){const gx=i%n,gy=(i/n)|0,d=(gx+gy)*.035+K.rnd(i)*.06,e=K.expo(K.seg(p,d,d+.3)),x=cx+(gx-n/2)*s,y=cy+(gy-n/2)*s,ox=(gx-1.5)*U*30*(1-e),oy=(gy-1.5)*U*30*(1-e);c.save();c.translate(x+s/2+ox,y+s/2+oy);c.rotate((1-e)*(K.rnd(i+5)-.5)*4);c.scale(e,1);c.fillStyle=(gx+gy)%2?o.accent:o.ink;c.globalAlpha=e*(1-z);c.fillRect(-s/2+1,-s/2+1,s-2,s-2);c.restore()}
  const e=K.back(K.seg(p,.36,.52));c.save();c.translate(cx,cy);c.scale(e,e);K.text(c,o,o.t1,0,0,K.fit(c,o,o.t1,s*n*.7,s*n*.62,800),{weight:800,color:o.bg});c.restore();
  K.text(c,o,o.t2,cx,cy+s*n/2+U*8,K.fit(c,o,o.t2,W*.8,U*3.4,600),{weight:600,alpha:K.out(K.seg(p,.5,.66)),ls:U*.5})}});

add({id:'logo-glitch',name:'Logo sting: glitch',cat:'Logo stings',dur:3,d:'The name jitters in split colour channels and snaps into place.',f:{t1:'SIGNAL',t2:'broadcast identity'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,size=K.fit(c,o,o.t1,W*.8,U*18,800),g=1-K.out(K.seg(p,.05,.4))+(p>.62&&p<.68?.5:0),z=K.seg(p,.92,1),f=Math.floor(p*40);c.globalAlpha=1-z;
  const j=k=>(K.rnd(f*3+k)-.5)*U*9*g;c.save();c.globalCompositeOperation='lighter';[['#ff2a55',1],['#22e0ff',2],[o.accent,3]].forEach(([col,k])=>K.text(c,o,o.t1,W/2+j(k),H*.46+j(k+7)*.3,size,{weight:800,color:col,alpha:g>.02?.8:0}));c.restore();
  K.text(c,o,o.t1,W/2,H*.46,size,{weight:800,alpha:g>.02?.55:1});
  if(g>.05)for(let i=0;i<5;i++){const y=H*.46+(K.rnd(f+i)-.5)*size,h=U*(.5+K.rnd(f+i+3)*2);c.fillStyle=o.bg;c.fillRect(0,y,W,h*g)}
  K.text(c,o,o.t2,W/2,H*.46+size*.74,K.fit(c,o,o.t2,W*.7,U*3.2,500),{weight:500,alpha:K.seg(p,.42,.55)*.8,ls:U*.6})}});

/* ───────── Transitions ───────── */
add({id:'wipe-stripes',name:'Stripe wipe',cat:'Transitions',dur:2.4,alpha:true,d:'Diagonal stripes sweep across and clear. Export with a transparent background to lay it over a cut.',f:{t1:'NEXT'},
 draw(c,p,W,H,o,K){const n=6,sk=H*.35;for(let i=0;i<n;i++){const d=i*.05,a=K.inOut(K.seg(p,d,d+.36)),z=K.inOut(K.seg(p,.5+d,.86+d)),y=i*H/n,x0=-sk+(W+sk*2)*z-sk,x1=(W+sk*2)*a-sk;c.fillStyle=i%2?o.accent:o.ink;c.beginPath();c.moveTo(x0+sk,y);c.lineTo(x1+sk,y);c.lineTo(x1,y+H/n+1);c.lineTo(x0,y+H/n+1);c.fill()}
  const U=Math.min(W,H)/100,m=K.seg(p,.36,.5)-K.seg(p,.5,.62);K.text(c,o,o.t1,W/2,H/2,K.fit(c,o,o.t1,W*.7,U*14,800),{weight:800,color:o.bg,alpha:K.clamp(m*2)})}});

add({id:'wipe-iris',name:'Iris',cat:'Transitions',dur:2.4,alpha:true,d:'A circle closes to a point and opens again in the accent colour.',f:{t1:''},
 draw(c,p,W,H,o,K){const R=Math.hypot(W,H)/2,a=K.inOut(K.seg(p,0,.45)),z=K.inOut(K.seg(p,.55,1)),r=p<.5?R*(1-a):R*z;c.fillStyle=o.ink;c.beginPath();c.rect(0,0,W,H);c.arc(W/2,H/2,Math.max(0,r),0,Math.PI*2,true);c.fill('evenodd');
  c.strokeStyle=o.accent;c.lineWidth=Math.min(W,H)*.012;c.beginPath();c.arc(W/2,H/2,Math.max(0,r),0,7);c.stroke();if(o.t1)K.text(c,o,o.t1,W/2,H/2,K.fit(c,o,o.t1,W*.6,Math.min(W,H)*.1),{color:o.bg,alpha:K.clamp((K.seg(p,.4,.5)-K.seg(p,.5,.6))*2)})}});

add({id:'wipe-blocks',name:'Block cover',cat:'Transitions',dur:2.6,alpha:true,d:'A grid of blocks scales up to cover the frame, then drops away in the same order.',f:{t1:''},
 draw(c,p,W,H,o,K){const cols=W>H?8:5,s=W/cols,rows=Math.ceil(H/s);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const d=(x/cols*.6+y/rows*.4)*.3,a=K.out(K.seg(p,d,d+.18)),z=K.inOut(K.seg(p,.52+d,.72+d)),e=a-z;if(e<=0)continue;c.fillStyle=(x+y)%3===0?o.accent:o.ink;const q=s*e;c.fillRect(x*s+(s-q)/2-.5,y*s+(s-q)/2-.5,q+1,q+1)}
  if(o.t1)K.text(c,o,o.t1,W/2,H/2,K.fit(c,o,o.t1,W*.6,Math.min(W,H)*.1),{color:o.bg,alpha:K.clamp((K.seg(p,.38,.48)-K.seg(p,.5,.6))*2)})}});

add({id:'wipe-liquid',name:'Liquid wipe',cat:'Transitions',dur:2.8,alpha:true,d:'Two waves rise from the bottom, fill the frame and pour off the top.',f:{t1:''},
 draw(c,p,W,H,o,K){[[o.accent,0],[o.ink,.07]].forEach(([col,d],k)=>{const a=K.inOut(K.seg(p,d,d+.42)),z=K.inOut(K.seg(p,.5+d,.92+d)),amp=H*.07;const edge=(lvl,ph)=>x=>H-(H+amp*2)*lvl+amp+Math.sin(x/W*Math.PI*3+ph+p*9)*amp;const top=edge(a,k),bot=edge(z,k+2);c.fillStyle=col;c.beginPath();for(let x=0;x<=W;x+=W/40)c.lineTo(x,top(x));for(let x=W;x>=0;x-=W/40)c.lineTo(x,z>0?bot(x):H+2);c.closePath();c.fill()});
  if(o.t1)K.text(c,o,o.t1,W/2,H/2,K.fit(c,o,o.t1,W*.6,Math.min(W,H)*.1),{color:o.bg,alpha:K.clamp((K.seg(p,.42,.5)-K.seg(p,.52,.6))*2)})}});

/* ───────── Numbers & data ───────── */
add({id:'count-up',name:'Count up',cat:'Numbers',dur:4,d:'A big number counts up to its value; a bar fills beneath it.',f:{t1:'12,480',t2:'new members this month'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,{a,z}=K.io(p,.1,.9),raw=String(o.t1),num=parseFloat(raw.replace(/[^0-9.]/g,''))||0,pre=(raw.match(/^[^0-9]*/)||[''])[0],suf=(raw.match(/[^0-9.,]*$/)||[''])[0],dec=(raw.split('.')[1]||'').replace(/[^0-9]/g,'').length,e=K.expo(K.seg(p,.08,.62));c.globalAlpha=K.out(a)*(1-z);
  const v=(num*e).toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec}),size=K.fit(c,o,raw,W*.8,U*24,800);K.text(c,o,pre+v+suf,W/2,H*.42,size,{weight:800});
  const bw=Math.min(W*.6,U*70),by=H*.42+size*.7;c.fillStyle=o.ink;c.globalAlpha*=.14;K.rr(c,W/2-bw/2,by,bw,U*1.4,U);c.fill();c.globalAlpha=K.out(a)*(1-z);c.fillStyle=o.accent;K.rr(c,W/2-bw/2,by,bw*e,U*1.4,U);c.fill();
  K.text(c,o,o.t2,W/2,by+U*7,K.fit(c,o,o.t2,W*.8,U*3.8,500),{weight:500,alpha:.8})}});

add({id:'bar-race',name:'Bar chart build',cat:'Numbers',dur:5,d:'Five bars grow in turn with their values. Type labels and values as “Mon 42, Tue 58 …”.',f:{t1:'Weekly sign-ups',t2:'Mon 42, Tue 58, Wed 51, Thu 77, Fri 93'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,z=K.seg(p,.92,1),rows=String(o.t2).split(',').map(s=>{const m=s.trim().match(/^(.*?)\s*(-?[\d.]+)\s*$/);return m?[m[1],+m[2]]:[s.trim(),0]}).slice(0,8),mx=Math.max(1,...rows.map(r=>r[1])),x0=W*.12,x1=W*.88,y0=H*.3,y1=H*.82,n=rows.length,bw=(x1-x0)/n;c.globalAlpha=1-z;
  K.text(c,o,o.t1,x0,H*.17,K.fit(c,o,o.t1,x1-x0,U*6),{align:'left',alpha:K.out(K.seg(p,0,.14))});c.fillStyle=o.ink;c.globalAlpha=.25*(1-z);c.fillRect(x0,y1,(x1-x0)*K.inOut(K.seg(p,.02,.2)),U*.3);c.globalAlpha=1-z;
  rows.forEach(([l,v],i)=>{const d=.12+i*.09,e=K.expo(K.seg(p,d,d+.3)),h=(y1-y0)*v/mx*e,x=x0+i*bw+bw*.16,w=bw*.68;c.fillStyle=i===rows.findIndex(r=>r[1]===mx)?o.accent:o.ink;K.rr(c,x,y1-h,w,h,U*.8);c.fill();K.text(c,o,String(Math.round(v*e)),x+w/2,y1-h-U*3,Math.min(U*3.6,w*.4),{alpha:e});K.text(c,o,l,x+w/2,y1+U*4,K.fit(c,o,l,w*1.3,U*2.8,500),{weight:500,alpha:e*.75})})}});

add({id:'ring-percent',name:'Progress ring',cat:'Numbers',dur:4,d:'A ring sweeps round to a percentage with the number counting inside it.',f:{t1:'87%',t2:'of people finished the course'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,{a,z}=K.io(p,.1,.9),v=K.clamp((parseFloat(o.t1)||0)/100),e=K.expo(K.seg(p,.08,.6)),r=U*20,cx=W/2,cy=H*.43;c.globalAlpha=K.out(a)*(1-z);c.lineWidth=U*3.2;c.lineCap='round';
  c.strokeStyle=o.ink;c.globalAlpha*=.14;c.beginPath();c.arc(cx,cy,r,0,7);c.stroke();c.globalAlpha=K.out(a)*(1-z);c.strokeStyle=o.accent;c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*v*e+.0001);c.stroke();
  K.text(c,o,Math.round(v*100*e)+'%',cx,cy,r*.62,{weight:800});K.text(c,o,o.t2,cx,cy+r+U*9,K.fit(c,o,o.t2,W*.8,U*3.8,500),{weight:500,alpha:.8})}});

add({id:'countdown',name:'Countdown',cat:'Numbers',dur:4,d:'Three, two, one: each number punches in while a ring sweeps a full turn, then your word lands.',f:{t1:'GO',t2:''},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,k=Math.min(3,Math.floor(p*4)),q=p*4-k,r=U*24,cx=W/2,cy=H/2;if(k<3){c.lineWidth=U*1.6;c.strokeStyle=o.ink;c.globalAlpha=.16;c.beginPath();c.arc(cx,cy,r,0,7);c.stroke();c.globalAlpha=1;c.strokeStyle=o.accent;c.lineCap='round';c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*q);c.stroke();
   const e=K.back(K.seg(q,0,.25));c.save();c.translate(cx,cy);c.scale(e,e);K.text(c,o,String(3-k),0,0,r*1.15,{weight:800,alpha:1-K.seg(q,.82,1)});c.restore()}
  else{const e=K.back(K.seg(q,0,.3));c.save();c.translate(cx,cy);c.scale(e,e);K.text(c,o,o.t1,0,0,K.fit(c,o,o.t1,W*.8,U*30,800),{weight:800,color:o.accent,alpha:1-K.seg(q,.8,1)});c.restore();const b=K.out(K.seg(q,0,.6));c.strokeStyle=o.accent;c.globalAlpha=1-b;c.lineWidth=U*1.2;c.beginPath();c.arc(cx,cy,r*(1+b*1.4),0,7);c.stroke()}}});

/* ───────── Social & callouts ───────── */
add({id:'follow-button',name:'Follow button',cat:'Social',dur:4,d:'A cursor glides in, presses the button and it flips to a tick.',f:{t1:'Follow',t2:'Following',t3:'@motionatlas'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,a=K.back(K.seg(p,.02,.2)),z=K.seg(p,.92,1),done=p>.5,press=K.seg(p,.46,.5)-K.seg(p,.5,.56),s=U*6,label=done?o.t2:o.t1;c.globalAlpha=1-z;c.font=K.font(o,s);const bw=Math.max(c.measureText(o.t1).width,c.measureText(o.t2).width)+U*22,bh=U*15,cx=W/2,cy=H*.48;
  c.save();c.translate(cx,cy);c.scale(a*(1-press*.06),a*(1-press*.06));c.fillStyle=done?o.ink:o.accent;K.rr(c,-bw/2,-bh/2,bw,bh,bh/2);c.fill();K.text(c,o,label,done?U*3:0,0,s,{color:o.bg});
  if(done){const t=K.out(K.seg(p,.5,.62));c.strokeStyle=o.accent;c.lineWidth=U*1.1;c.lineCap='round';c.lineJoin='round';const x=-bw/2+U*8;c.beginPath();c.moveTo(x-U*2,0);c.lineTo(x-U*2+U*1.6*Math.min(1,t*2),U*1.6*Math.min(1,t*2));if(t>.5)c.lineTo(x-U*.4+U*3.4*(t-.5)*2,U*1.6-U*4*(t-.5)*2);c.stroke()}c.restore();
  if(done){const b=K.seg(p,.5,.75);for(let i=0;i<12;i++){const an=i/12*Math.PI*2,rr=bh*.7+K.out(b)*U*16;c.fillStyle=i%2?o.accent:o.ink;c.globalAlpha=(1-b)*(1-z);c.beginPath();c.arc(cx+Math.cos(an)*rr*1.6,cy+Math.sin(an)*rr,U*.7,0,7);c.fill()}c.globalAlpha=1-z}
  K.text(c,o,o.t3,cx,cy+bh*.5+U*7,K.fit(c,o,o.t3,W*.8,U*3.6,500),{weight:500,alpha:K.seg(p,.2,.32)*.75});
  const m=K.inOut(K.seg(p,.2,.46)),px=K.lerp(W*.85,cx+bw*.2,m),py=K.lerp(H*.9,cy+bh*.1,m)+press*U;c.save();c.translate(px,py);c.globalAlpha=(1-K.seg(p,.6,.72))*(1-z);c.fillStyle=o.ink;c.strokeStyle=o.bg;c.lineWidth=U*.5;c.beginPath();c.moveTo(0,0);c.lineTo(0,U*6);c.lineTo(U*1.6,U*4.6);c.lineTo(U*2.8,U*7);c.lineTo(U*3.8,U*6.5);c.lineTo(U*2.7,U*4.2);c.lineTo(U*4.6,U*4.2);c.closePath();c.fill();c.stroke();c.restore()}});

add({id:'quote-card',name:'Quote card',cat:'Social',dur:6,d:'A quotation appears line by line under a large quote mark, then the name.',f:{t1:'Design is the silent ambassador of your brand.',t2:'Paul Rand'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,z=K.seg(p,.92,1),size=U*(W>H?6:7),lines=K.wrap(c,o,o.t1,W*.76,size,500).slice(0,7),lh=size*1.34,y0=H/2-lines.length*lh/2+lh*.2;c.globalAlpha=1-z;
  const q=K.back(K.seg(p,0,.14));c.save();c.translate(W*.12,y0-lh*.6);c.scale(q,q);K.text(c,o,'“',0,0,size*4.2,{color:o.accent,align:'left',base:'alphabetic',weight:800});c.restore();
  lines.forEach((l,i)=>{const d=.08+i*.07,e=K.out(K.seg(p,d,d+.16));K.text(c,o,l,W*.12+U*3*(1-e),y0+i*lh,size,{weight:500,align:'left',alpha:e})});
  const e=K.out(K.seg(p,.14+lines.length*.07,.3+lines.length*.07)),ay=y0+lines.length*lh+U*3;c.fillStyle=o.accent;c.fillRect(W*.12,ay-U*.3,U*8*e,U*.6);K.text(c,o,o.t2,W*.12+U*11,ay,K.fit(c,o,o.t2,W*.6,U*3.6,700),{align:'left',alpha:e})}});

add({id:'sale-burst',name:'Offer burst',cat:'Social',dur:4,d:'A turning starburst badge with an offer that pulses.',f:{t1:'50% OFF',t2:'this weekend only'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,a=K.back(K.seg(p,.02,.22)),z=K.seg(p,.9,1),r=U*30,cx=W/2,cy=H*.46,n=18,rot=p*Math.PI*.5,pulse=1+Math.sin(p*Math.PI*8)*.03;c.globalAlpha=1-z;c.save();c.translate(cx,cy);c.scale(a*pulse,a*pulse);c.save();c.rotate(rot);c.fillStyle=o.accent;c.beginPath();for(let i=0;i<n*2;i++){const rr=i%2?r*.86:r,an=i/(n*2)*Math.PI*2;c.lineTo(Math.cos(an)*rr,Math.sin(an)*rr)}c.closePath();c.fill();c.restore();
  c.strokeStyle=o.bg;c.lineWidth=U*.5;c.setLineDash([U*1.5,U*1.5]);c.beginPath();c.arc(0,0,r*.74,0,7);c.stroke();c.setLineDash([]);
  const s=K.fit(c,o,o.t1,r*1.25,r*.5,800);K.text(c,o,o.t1,0,-s*.12,s,{weight:800,color:o.bg});K.text(c,o,o.t2,0,s*.62,K.fit(c,o,o.t2,r*1.1,U*3.2,600),{weight:600,color:o.bg});c.restore()}});

add({id:'end-card',name:'End card',cat:'Social',dur:6,d:'Thanks, a handle and a turning mark: something to hold on while the video ends.',f:{t1:'Thanks for watching',t2:'@motionatlas',t3:'New film every Friday'},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,z=K.seg(p,.94,1),cx=W/2;c.globalAlpha=1-z;const a=K.out(K.seg(p,0,.14));
  c.save();c.translate(cx,H*.28);c.rotate(p*Math.PI*2);c.strokeStyle=o.accent;c.lineWidth=U*.8;for(let i=0;i<3;i++){c.rotate(Math.PI/3);c.globalAlpha=a*(1-z);c.beginPath();c.ellipse(0,0,U*9,U*3.6,0,0,7);c.stroke()}c.restore();c.globalAlpha=1-z;
  const s=K.fit(c,o,o.t1,W*.82,U*9);K.text(c,o,o.t1,cx,H*.5+U*4*(1-a),s,{alpha:a});const e=K.back(K.seg(p,.12,.28));c.font=K.font(o,U*4.2,700);const tw=c.measureText(o.t2).width+U*8;
  c.save();c.translate(cx,H*.5+s*.9+U*3);c.scale(e,e);c.fillStyle=o.accent;K.rr(c,-tw/2,-U*4.2,tw,U*8.4,U*4.2);c.fill();K.text(c,o,o.t2,0,0,U*4.2,{color:o.bg});c.restore();
  K.text(c,o,o.t3,cx,H*.5+s*.9+U*14,K.fit(c,o,o.t3,W*.8,U*3.2,500),{weight:500,alpha:K.seg(p,.24,.36)*.7})}});

/* ───────── Backdrops (seamless loops) ───────── */
add({id:'orb-drift',name:'Drifting orbs',cat:'Backdrops',dur:8,loop:true,d:'Soft orbs of colour drift behind a title. Loops without a seam.',f:{t1:'Calm launch',t2:''},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,t=p*Math.PI*2;for(let i=0;i<5;i++){const x=W*(.5+.36*Math.sin(t+i*1.9)),y=H*(.5+.3*Math.cos(t*(i%2?1:2)+i)),r=Math.max(W,H)*(.22+.06*i),g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,i%2?o.accent:o.ink);g.addColorStop(1,'transparent');c.globalAlpha=i%2?.5:.12;c.fillStyle=g;c.fillRect(0,0,W,H)}c.globalAlpha=1;
  if(o.t1)K.text(c,o,o.t1,W/2,H/2,K.fit(c,o,o.t1,W*.8,U*12));if(o.t2)K.text(c,o,o.t2,W/2,H/2+U*11,K.fit(c,o,o.t2,W*.7,U*3.6,500),{weight:500,alpha:.8})}});

add({id:'retro-grid',name:'Horizon grid',cat:'Backdrops',dur:4,loop:true,d:'A perspective grid rolls toward the camera under a sun. Loops without a seam.',f:{t1:'NIGHT DRIVE',t2:''},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,hy=H*.56,cx=W/2;const g=c.createLinearGradient(0,hy-U*30,0,hy);g.addColorStop(0,o.accent);g.addColorStop(1,o.ink);c.save();c.beginPath();c.rect(0,0,W,hy);c.clip();c.fillStyle=g;c.globalAlpha=.9;c.beginPath();c.arc(cx,hy-U*4,U*20,0,7);c.fill();c.fillStyle=o.bg;c.globalAlpha=1;for(let i=0;i<5;i++)c.fillRect(cx-U*22,hy-U*(2+i*3.4),U*44,U*(.5+i*.2));c.restore();
  c.strokeStyle=o.accent;c.lineWidth=Math.max(1,U*.25);c.globalAlpha=.9;for(let i=-14;i<=14;i++){c.beginPath();c.moveTo(cx+i*U*3,hy);c.lineTo(cx+i*W*.2,H);c.stroke()}for(let i=0;i<12;i++){const q=Math.pow((i+p)/12,2.6),y=hy+(H-hy)*q;c.globalAlpha=.25+.65*q;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}c.globalAlpha=1;
  if(o.t1)K.text(c,o,o.t1,cx,H*.24,K.fit(c,o,o.t1,W*.8,U*11,800),{weight:800});if(o.t2)K.text(c,o,o.t2,cx,H*.24+U*9,K.fit(c,o,o.t2,W*.7,U*3.4,500),{weight:500,alpha:.8})}});

add({id:'particle-field',name:'Star field',cat:'Backdrops',dur:6,loop:true,d:'Points of light stream past the camera. Loops without a seam.',f:{t1:'',t2:''},
 draw(c,p,W,H,o,K){const U=Math.min(W,H)/100,cx=W/2,cy=H/2,R=Math.hypot(W,H)/2;for(let i=0;i<220;i++){const an=K.rnd(i)*Math.PI*2,q=(K.rnd(i+500)+p)%1,r=Math.pow(q,2.2)*R,l=U*(.3+6*q*q);c.strokeStyle=i%5?o.ink:o.accent;c.globalAlpha=Math.min(1,q*1.6)*(1-K.seg(q,.92,1));c.lineWidth=U*(.12+.35*q);c.lineCap='round';c.beginPath();c.moveTo(cx+Math.cos(an)*r,cy+Math.sin(an)*r);c.lineTo(cx+Math.cos(an)*(r+l),cy+Math.sin(an)*(r+l));c.stroke()}c.globalAlpha=1;
  if(o.t1)K.text(c,o,o.t1,cx,cy,K.fit(c,o,o.t1,W*.8,U*12,800),{weight:800});if(o.t2)K.text(c,o,o.t2,cx,cy+U*10,K.fit(c,o,o.t2,W*.7,U*3.4,500),{weight:500,alpha:.8})}});

window.MotionGfx={K,list:T,get:id=>T.find(t=>t.id===id),cats:[...new Set(T.map(t=>t.cat))]};
})();
