'use strict';
/* The strand that makes new agents. A small, faint double helix of 0s and 1s. Every cycle it unzips
   from the top, each half grows a new partner, and the second strand leaves as a new agent.
   A whisper, not the centrepiece: keep it small and low-contrast.
   DNA.start(canvas,{still,onSpawn}) -> {pause,play} */
window.DNA=(()=>{
 const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 function start(canvas,{still=false,onSpawn}={}){
  const x=canvas.getContext('2d');if(!x)return null;
  const N=30,bits=Array.from({length:N},()=>Math.random()<.5?'0':'1'),flip=b=>b==='0'?'1':'0';
  let w=0,h=0,d=1,raf=0,running=!still,t0=performance.now(),spawned=false,newBits=bits.map(flip);
  function size(){d=Math.min(2,devicePixelRatio||1);w=canvas.clientWidth;h=canvas.clientHeight;canvas.width=w*d;canvas.height=h*d}
  size();const ro=new ResizeObserver(()=>{size();if(still)draw(0)});ro.observe(canvas);
  const CYCLE=10;
  function strand(cx,sign,phase0,alpha,list,gap,top,amp,fs){for(let i=0;i<N;i++){const a=list[i];if(!a)continue;const ph=phase0+i*.56,s=Math.sin(ph),z=Math.cos(ph)*sign;
    const px=cx+sign*amp*s,py=top+i*gap;const depth=.45+.55*(z*.5+.5);x.globalAlpha=alpha*a.a*depth;x.fillStyle=a.c||'#E7EAEE';x.font=`500 ${Math.round(fs*(.8+.3*depth))}px "Geist Mono",ui-monospace,monospace`;x.fillText(a.b,px,py)}}
  function draw(time){x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);x.textAlign='center';x.textBaseline='middle';
   const fs=w<240?9:11,gap=Math.min(18,(h-60)/N),top=(h-gap*(N-1))/2,amp=Math.min(26,w*.09),cx=w*.42;
   const c=(time/1000)%CYCLE,phase=time/1000*1.1;
   const unzip=ease(clamp((c-3)/2)),grow=ease(clamp((c-5)/1.5)),leave=ease(clamp((c-6.5)/2.2)),settle=ease(clamp((c-8.2)/1.2));
   if(c<3&&spawned){spawned=false;for(let k=0;k<3;k++){const i=Math.random()*N|0;bits[i]=flip(bits[i])}newBits=bits.map(flip)}
   if(c>6.6&&!spawned){spawned=true;onSpawn&&onSpawn()}
   const sep=amp*2.6;
   const cL=cx-sep*unzip*(1-settle),cR=cx+sep*unzip+leave*w*.32;
   /* rungs: fade as the zipper opens from the top */
   x.lineWidth=1;for(let i=0;i<N;i++){const local=clamp(unzip*1.6-i/N*.6);const ph=phase+i*.56,s=Math.sin(ph),py=top+i*gap;const ra=(1-local)*.22;if(ra<.01)continue;x.globalAlpha=ra;x.strokeStyle='#7FE7F7';x.beginPath();x.moveTo(cx-amp*s+4,py);x.lineTo(cx+amp*s-4,py);x.stroke()}
   const A=bits.map((b,i)=>({b,a:1,c:i%9===4?'#7FE7F7':null})),B=bits.map((b,i)=>({b:flip(b),a:1,c:i%11===7?'#3CF29A':null}));
   const base=still?.55:.5;
   /* original pair, drifting apart top-down */
   const offL=i=>cL+(cx-cL)*(1-clamp(unzip*1.6-i/N*.6)),offR=i=>cR+(cx-cR)*(1-clamp(unzip*1.6-i/N*.6));
   for(let i=0;i<N;i++){strand(offL(i),1,phase,base,A.map((a,k)=>k===i?a:null),gap,top,amp,fs);strand(offR(i),-1,phase,base*(1-leave*.9),B.map((a,k)=>k===i?a:null),gap,top,amp,fs)}
   /* new partners decode in, top-down */
   if(grow>0){const NA=newBits.map((b,i)=>{const g=clamp(grow*1.5-i/N*.5);return g>0?{b:g<1&&Math.random()<.5?(Math.random()<.5?'0':'1'):flip(bits[i]),a:g}:null});
    strand(cL,-1,phase,base,NA,gap,top,amp,fs);
    const NB=bits.map((b,i)=>{const g=clamp(grow*1.5-i/N*.5);return g>0?{b,a:g,c:'#7FE7F7'}:null});strand(cR,1,phase,base*(1-leave*.9),NB,gap,top,amp,fs)}
   x.globalAlpha=1}
  function frame(now){draw(now-t0);if(running)raf=requestAnimationFrame(frame)}
  if(still)draw(1500);else raf=requestAnimationFrame(frame);
  const vis=()=>{if(document.hidden){cancelAnimationFrame(raf)}else if(running){raf=requestAnimationFrame(frame)}};document.addEventListener('visibilitychange',vis);
  return {pause(){running=false;cancelAnimationFrame(raf)},play(){if(still||running)return;running=true;raf=requestAnimationFrame(frame)}};
 }
 return {start};
})();
