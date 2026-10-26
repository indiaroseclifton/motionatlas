'use strict';
/* Device frames for the Mockup studio, drawn as vectors on canvas so they stay sharp at any export size.
   MockupDevices.dims(id, ctx) -> {w,h} in frame units; MockupDevices.build(id, k, ctx) -> canvas at k px per unit.
   ctx: {img, img2, fit, color, chrome, url, orient}. Every frame is original artwork, not a vendor asset. */
(()=>{
 const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c};
 function rr(c,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
 const iw=i=>i?(i.naturalWidth||i.videoWidth||i.width):0,ih=i=>i?(i.naturalHeight||i.videoHeight||i.height):0;
 /* the picture inside a screen: cover from the top (screenshots), cover centred, or contain */
 function screen(c,img,x,y,w,h,r,fit,fill){c.save();rr(c,x,y,w,h,r);c.clip();c.fillStyle=fill||'#0b0b0d';c.fillRect(x,y,w,h);
  if(img&&iw(img)){const W=iw(img),H=ih(img),s=fit==='contain'?Math.min(w/W,h/H):Math.max(w/W,h/H),dw=W*s,dh=H*s;
   const dx=x+(w-dw)/2,dy=fit==='top'?y:y+(h-dh)/2;c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(img,dx,dy,dw,dh)}
  /* a faint glass sheen */
  const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'rgba(255,255,255,.06)');g.addColorStop(.45,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(x,y,w,h);c.restore()}
 const METAL={black:['#26272b','#4b4c52','#18191c','#0e0e10'],silver:['#bfc3ca','#f3f4f6','#a9adb5','#e9ebef'],sand:['#b3a084','#e8dcc8','#9e8b70','#d9ccb6'],blue:['#2f3d55','#5d7194','#223047','#16202f']};
 function metal(c,x,y,w,h,col,vertical){const m=METAL[col]||METAL.black,g=vertical?c.createLinearGradient(x,y,x,y+h):c.createLinearGradient(x,y,x+w,y);g.addColorStop(0,m[2]);g.addColorStop(.08,m[1]);g.addColorStop(.18,m[0]);g.addColorStop(.82,m[0]);g.addColorStop(.92,m[1]);g.addColorStop(1,m[2]);return g}

 const D={
  phone:{name:'Phone',dims:()=>({w:446,h:900}),draw(c,o){
   c.fillStyle=(METAL[o.color]||METAL.black)[2];[[4,150,6,36],[4,212,6,64],[4,290,6,64],[436,240,6,104]].forEach(b=>{rr(c,...b,3);c.fill()});
   rr(c,8,8,430,884,72);c.fillStyle=metal(c,8,8,430,884,o.color);c.fill();
   rr(c,13,13,420,874,67);c.fillStyle='#060607';c.fill();
   screen(c,o.img,25,25,396,850,54,o.fit);
   rr(c,223-60,39,120,34,17);c.fillStyle='#000';c.fill();
   c.beginPath();c.arc(223+40,56,6,0,7);c.fillStyle='#10131a';c.fill()}},
  classic:{name:'Classic phone',dims:()=>({w:416,h:840}),draw(c,o){
   const light=o.color==='silver'||o.color==='sand';
   c.fillStyle=(METAL[o.color]||METAL.black)[2];[[3,150,7,40],[3,220,7,62],[3,296,7,62],[406,200,7,70]].forEach(b=>{rr(c,...b,3);c.fill()});
   rr(c,8,4,400,832,62);c.fillStyle=metal(c,8,4,400,832,o.color);c.fill();
   rr(c,12,8,392,824,58);c.fillStyle=light?'#f4f4f6':'#0d0d0f';c.fill();
   screen(c,o.img,33,112,350,622,3,o.fit);
   rr(c,173,54,70,9,4.5);c.fillStyle=light?'#9a9ca2':'#2a2b30';c.fill();
   c.beginPath();c.arc(138,58,6.5,0,7);c.fillStyle=light?'#5a5c63':'#1d2027';c.fill();
   c.beginPath();c.arc(208,783,31,0,7);c.lineWidth=3;c.strokeStyle=light?'#c9cbd0':'#2c2d32';c.stroke()}},
  tablet:{name:'Tablet',dims:o=>o.orient==='landscape'?{w:1160,h:840}:{w:840,h:1160},draw(c,o,d){
   rr(c,0,0,d.w,d.h,56);c.fillStyle=metal(c,0,0,d.w,d.h,o.color,d.w>d.h);c.fill();
   rr(c,6,6,d.w-12,d.h-12,50);c.fillStyle='#0a0a0b';c.fill();
   screen(c,o.img,34,34,d.w-68,d.h-68,18,o.fit);
   c.beginPath();c.arc(d.w/2,19,4.5,0,7);c.fillStyle='#1c2029';c.fill()}},
  laptop:{name:'Laptop',dims:()=>({w:1600,h:1000}),draw(c,o){
   rr(c,100,0,1400,940,32);c.fillStyle=(METAL[o.color]||METAL.black)[2];c.fill();
   rr(c,103,3,1394,934,29);c.fillStyle='#0b0b0d';c.fill();
   screen(c,o.img,128,32,1344,840,8,o.fit);
   c.beginPath();c.arc(800,17,4.5,0,7);c.fillStyle='#1c2029';c.fill();
   const h=c.createLinearGradient(0,930,0,948);h.addColorStop(0,'#2a2b2f');h.addColorStop(1,'#5b5d63');c.fillStyle=h;c.fillRect(110,930,1380,16);
   c.beginPath();c.moveTo(0,946);c.lineTo(1600,946);c.lineTo(1600,968);c.quadraticCurveTo(1598,990,1560,996);c.lineTo(40,996);c.quadraticCurveTo(2,990,0,968);c.closePath();
   const b=c.createLinearGradient(0,946,0,996),m=METAL[o.color==='black'?'blue':o.color]||METAL.silver;b.addColorStop(0,m[3]||m[1]);b.addColorStop(.35,m[1]);b.addColorStop(1,m[2]);c.fillStyle=o.color==='black'?(()=>{const g=c.createLinearGradient(0,946,0,996);g.addColorStop(0,'#55575d');g.addColorStop(.4,'#3a3c41');g.addColorStop(1,'#1f2023');return g})():b;c.fill();
   rr(c,700,946,200,12,6);c.fillStyle='rgba(0,0,0,.22)';c.fill()}},
  browser:{name:'Browser window',dims:o=>{const W=1440,a=o.img&&iw(o.img)?ih(o.img)/iw(o.img):900/1440;return {w:W,h:78+Math.round(Math.max(560,Math.min(1700,W*a)))}},draw(c,o,d){
   const dark=o.chrome==='dark',bar=dark?'#1f2125':'#eceef2';
   c.save();rr(c,0,0,d.w,d.h,18);c.clip();c.fillStyle=bar;c.fillRect(0,0,d.w,78);
   screen(c,o.img,0,78,d.w,d.h-78,0,o.fit,dark?'#111':'#fff');c.restore();
   rr(c,.75,.75,d.w-1.5,d.h-1.5,18);c.lineWidth=1.5;c.strokeStyle=dark?'#3a3d44':'#cfd3da';c.stroke();
   c.fillStyle=dark?'#33363c':'#dadde3';c.fillRect(0,77,d.w,1.5);
   [['#ff5f57',34],['#febc2e',62],['#28c840',90]].forEach(([f,x])=>{c.beginPath();c.arc(x,39,8,0,7);c.fillStyle=f;c.fill()});
   const pw=Math.min(680,d.w-360),px=(d.w-pw)/2;rr(c,px,19,pw,40,20);c.fillStyle=dark?'#2e3136':'#ffffff';c.fill();
   if(!dark){c.lineWidth=1;c.strokeStyle='#d7dae0';c.stroke()}
   const url=String(o.url||'').slice(0,80);c.font='500 18px Inter, system-ui, sans-serif';c.textBaseline='middle';c.fillStyle=dark?'#c8ccd3':'#3b3f47';
   const tw=Math.min(c.measureText(url).width,pw-80),tx=d.w/2-tw/2+10;
   c.save();c.translate(tx-22,39);c.strokeStyle=c.fillStyle;c.lineWidth=1.8;rr(c,-6,-2,12,10,2);c.stroke();c.beginPath();c.arc(0,-3,4,Math.PI,0);c.stroke();c.restore();
   c.save();c.beginPath();c.rect(px+40,19,pw-60,40);c.clip();c.textAlign='left';c.fillText(url,tx,40);c.restore();
   c.strokeStyle=dark?'#7d828c':'#8a8f99';c.lineWidth=2;c.lineCap='round';[[150,1],[184,-1]].forEach(([x,s])=>{c.beginPath();c.moveTo(x+5*s,31);c.lineTo(x-3*s,39);c.lineTo(x+5*s,47);c.stroke()})}},
  watch:{name:'Watch',dims:()=>({w:420,h:760}),draw(c,o){
   const band=o.color==='silver'?'#d9d6cf':o.color==='sand'?'#c8b393':'#2c2e34';
   [[70,0],[70,560]].forEach(([x,y])=>{rr(c,x,y,280,200,46);c.fillStyle=band;c.fill();c.strokeStyle='rgba(0,0,0,.12)';c.lineWidth=2;for(let i=1;i<6;i++){const yy=y+i*32;c.beginPath();c.moveTo(x+20,yy);c.lineTo(x+260,yy);c.stroke()}});
   rr(c,396,280,24,78,9);c.fillStyle=(METAL[o.color]||METAL.black)[1];c.fill();rr(c,398,394,16,64,6);c.fill();
   rr(c,20,150,380,460,112);c.fillStyle=metal(c,20,150,380,460,o.color);c.fill();
   rr(c,30,160,360,440,104);c.fillStyle='#050505';c.fill();
   screen(c,o.img,50,180,320,400,80,o.fit==='top'?'center':o.fit)}},
  card:{name:'Card',dims:o=>{const W=1400,a=o.img&&iw(o.img)?ih(o.img)/iw(o.img):.625;return {w:W,h:Math.round(Math.max(420,Math.min(2600,W*a)))}},draw(c,o,d){screen(c,o.img,0,0,d.w,d.h,30,o.fit==='top'?'top':o.fit,'#fff')}},
  combo:{name:'Laptop + phone',dims:()=>({w:1760,h:1060}),draw(c,o){
   const L=D.laptop,P=D.phone,k=c.getTransform().a;
   const lc=canvas(1600*k,1000*k),lx=lc.getContext('2d');lx.scale(k,k);L.draw(lx,o,L.dims(o));
   const s=640/900,pc=canvas(446*s*k,900*s*k),px=pc.getContext('2d');px.scale(s*k,s*k);P.draw(px,Object.assign({},o,{img:o.img2||o.img,fit:o.img2?o.fit:'top'}),P.dims(o));
   c.save();c.setTransform(1,0,0,1,0,0);c.drawImage(lc,0,0);
   c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=40*k;c.shadowOffsetY=18*k;c.drawImage(pc,(1760-446*s-10)*k,(1060-900*s)*k);c.restore()}}
 };
 function dims(id,o){const d=D[id]||D.phone;return d.dims(o||{})}
 function build(id,k,o){const d=D[id]||D.phone,u=d.dims(o),c=canvas(u.w*k,u.h*k),x=c.getContext('2d');x.scale(k,k);d.draw(x,o,u);return c}
 window.MockupDevices={dims,build,rr,list:Object.entries(D).map(([id,d])=>[id,d.name])};
})();
