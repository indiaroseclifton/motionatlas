'use strict';
/* War room feeds: telemetry sparkline, ticking stats, node log, models online.
   Numbers move in steps (the "tick"), never smooth tweens. Static under reduced motion. */
window.Feeds=(()=>{
 const $=id=>document.getElementById(id);let timers=[],raf=0,paused=false;
 const verbs=[['TASK ALLOCATED','PRIORITY',()=>Math.random()*3|0],['CONTEXT SYNC','DELTA',()=>(Math.random()*4+.5).toFixed(1)+'ms'],['STRATEGY UPDATE','CONFIDENCE',()=>(0.9+Math.random()*.099).toFixed(3)],['EXECUTING','IMPACT RADIUS',()=>(80+Math.random()*19).toFixed(1)+'%'],['ROUTE SWITCH','MODEL',()=>['ORION-4','HELIX-L','KESTREL','VANTA-2','NOVA-X'][Math.random()*5|0]],['SKILL ACQUIRED','ID',()=>'SK-'+(10000+Math.random()*89999|0)],['EQUILIBRIUM HOLD','DRIFT',()=>(Math.random()*.001).toFixed(4)]];
 const pad=n=>String(n).padStart(2,'0');
 function stamp(){const d=new Date();return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`}
 function line(){const v=verbs[Math.random()*verbs.length|0];const agent=Math.random()<.12?'SYSTEM    ':'AGENT_'+(1000+Math.random()*8999|0);
  return `<time>[${stamp()}]</time> ${agent} &gt;&gt; <b>${v[0]}</b> [ ${v[1]} <em>${v[2]()}</em> ]`}
 function log(){const l=$('log');if(!l)return;const li=document.createElement('li');li.innerHTML=line();l.append(li);while(l.children.length>7)l.firstChild.remove()}
 const data=Array.from({length:80},(_,i)=>.5+.3*Math.sin(i/5)+.1*Math.random());
 function spark(){const c=$('spark');if(!c)return;const d=Math.min(2,devicePixelRatio||1),w=c.clientWidth,h=c.clientHeight;if(c.width!==w*d){c.width=w*d;c.height=h*d}const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);
  x.strokeStyle='rgba(127,231,247,.9)';x.lineWidth=1.2;x.beginPath();data.forEach((v,i)=>{const px=i/(data.length-1)*w,py=h-v*h;i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke();
  x.fillStyle='#3CF29A';const lx=w,ly=h-data[data.length-1]*h;x.fillRect(lx-3,ly-1.5,3,3)}
 function step(){data.shift();const last=data[data.length-1];data.push(Math.max(.08,Math.min(.95,last+(Math.random()-.5)*.18)));spark()}
 function stats(){const cpu=55+Math.random()*25,mem=66+Math.random()*12;const set=(k,v)=>{const el=document.querySelector(`[data-n="${k}"]`);if(el)el.textContent=v};
  set('cpu',cpu.toFixed(1)+'%');set('mem',mem.toFixed(1)+'%');const n=$('cpuBar');if(n)n.style.width=cpu+'%';const m=$('memBar');if(m)m.style.width=mem+'%';
  const nodes=document.querySelector('[data-n="nodes"]');if(nodes){const v=+nodes.textContent.replace(/,/g,'')+((Math.random()*40|0)-12);nodes.textContent=v.toLocaleString('en-GB')}}
 function models(){const el=$('models');if(!el)return;if(Math.random()<.25){el.textContent=(+el.textContent.replace(/,/g,'')+1).toLocaleString('en-GB');window.O1?.Sound.chirp()}}
 function uptime(){document.querySelectorAll('[data-uptime]').forEach(u=>u.textContent='99.999')}
 function run(){if(paused)return;timers.push(setInterval(()=>{step()},220),setInterval(()=>{log();window.O1?.Sound.tick()},900),setInterval(stats,1200),setInterval(models,2600))}
 function stop(){timers.forEach(clearInterval);timers=[]}
 return {start(){for(let i=0;i<6;i++)log();spark();uptime();addEventListener('resize',spark);if(!(window.O1&&O1.reduce))run()},pause(){paused=true;stop()},play(){paused=false;stop();run()}};
})();
