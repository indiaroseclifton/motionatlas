'use strict';
/* 01 shared: header, sound kit, decode, route reveals. Every page calls O1.init({page}). */
window.O1=(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 /* ---------- Sound: small, precise machine sounds, synthesized; off until the visitor turns it on ---------- */
 const Sound=(()=>{let ctx=null,on=false;try{on=localStorage.getItem('o1-sound')==='on'}catch(e){}
  const ac=()=>ctx||(ctx=new (window.AudioContext||window.webkitAudioContext)());
  function env(g,t,a,d,peak){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)}
  function tone(type,f0,f1,dur,peak=.06){if(!on)return;const c=ac(),t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);env(g,t,.002,dur,peak);o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur+.05)}
  function noise(dur,hp,peak=.05){if(!on)return;const c=ac(),t=c.currentTime,n=Math.floor(c.sampleRate*dur),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=hp;const g=c.createGain();env(g,t,.001,dur,peak);s.connect(f).connect(g).connect(c.destination);s.start(t)}
  return {
   get on(){return on},
   set(v){on=v;try{localStorage.setItem('o1-sound',v?'on':'off')}catch(e){}if(v){ac().resume();this.confirm()}},
   tick(){noise(.012,5200,.07)},
   click(){tone('sine',2400,null,.03,.05)},
   chirp(){tone('sine',3200,6400,.06,.035)},
   buzz(){if(!on)return;const c=ac(),t=c.currentTime,o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=118;f.type='bandpass';f.frequency.value=900;f.Q.value=4;env(g,t,.003,.09,.04);o.connect(f).connect(g).connect(c.destination);o.start(t);o.stop(t+.12)},
   confirm(){tone('sine',1600,null,.04,.045);setTimeout(()=>tone('sine',2400,null,.05,.045),55)},
   deny(){tone('square',220,180,.08,.025)}
  }})();
 /* ---------- Decode: text resolves from 0s and 1s, left to right ---------- */
 function decode(el,{speed=14,delay=0}={}){const final=el.dataset.text||el.textContent;el.dataset.text=final;if(reduce){el.textContent=final;return Promise.resolve()}
  return new Promise(res=>{const chars=[...final];let i=0;const start=performance.now()+delay;el.setAttribute('aria-label',final);
   function frame(now){if(now<start){requestAnimationFrame(frame);return}const done=Math.floor((now-start)/speed);
    el.textContent=chars.map((ch,k)=>k<done||ch===' '?ch:(k<done+8?(Math.random()<.5?'0':'1'):'')).join('');
    if(done<chars.length+1)requestAnimationFrame(frame);else{el.textContent=final;el.removeAttribute('aria-label');res()}}
   requestAnimationFrame(frame)})}
 /* ---------- Routed reveals ---------- */
 function routes(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);e.target.classList.add('in');$$('[data-decode]',e.target).forEach((d,i)=>decode(d,{delay:i*120}))}),{threshold:.18});$$('.o-route').forEach(x=>io.observe(x))}
 /* ---------- Header ---------- */
 const LINKS=[['index.html','Home','home'],['agents.html','Agents','agents'],['integrations.html','Integrations','integrations'],['origin.html','Origin','origin']];
 function header(page){const h=document.createElement('header');h.className='o-head';
  h.innerHTML=`<a class="o-logo" href="index.html" aria-label="01ai home"><img src="assets/01ai-wordmark.svg" alt="01ai" width="92" height="44"></a>
  <div class="o-right"><p class="o-status mono" aria-label="Server status: version 1.0, node War Room, uptime 99.999 percent"><i aria-hidden="true"></i>SERVER v1.0 // NODE: WAR ROOM // UPTIME <span data-uptime>99.999</span>%</p>
  <nav class="o-nav" aria-label="01ai">${LINKS.map(([href,label,id])=>`<a href="${href}"${id===page?' aria-current="page"':''}${id==='home'?' class="o-hide-sm"':''}>${label}</a>`).join('')}<button type="button" class="o-sound" aria-pressed="${Sound.on}" aria-label="Interface sound"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M2 6h3l4-3v10L5 10H2z"/><path d="M11.5 5.5a3.5 3.5 0 0 1 0 5M13.5 3.5a6.5 6.5 0 0 1 0 9"/></svg><span>Sound</span></button><a href="login.html" class="o-login"${page==='login'?' aria-current="page"':''}>Login</a></nav></div>`;
  document.body.prepend(h);
  const solid=()=>h.classList.toggle('solid',scrollY>40);addEventListener('scroll',solid,{passive:true});solid();
  const skip=document.createElement('a');skip.className='skip';skip.href='#main';skip.textContent='Skip to content';document.body.prepend(skip);
  if(page!=='apply'){const a=document.createElement('a');a.className='o-apply';a.href='apply.html';a.innerHTML='<i aria-hidden="true"></i>Apply';document.body.append(a)}
  const sb=$('.o-sound',h);sb.onclick=()=>{Sound.set(!Sound.on);sb.setAttribute('aria-pressed',Sound.on)};
  document.addEventListener('pointerover',e=>{if(e.target.closest('a,button,[data-snd]'))Sound.tick()});
  document.addEventListener('click',e=>{if(e.target.closest('a,button'))Sound.click()});}
 function init({page}={}){header(page);routes();$$('[data-decode-now]').forEach((d,i)=>decode(d,{delay:200+i*160}))}
 return {init,decode,Sound,reduce,$,$$};
})();
