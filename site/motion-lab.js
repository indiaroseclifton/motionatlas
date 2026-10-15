'use strict';
/* Motion studio 2.0 (#motion)
   1. Easing lab: drag a cubic-bezier or tune a spring, compare two curves, export CSS / Web
      Animations / GSAP / Motion code, share a link, and save curves as motion tokens.
   2. Real-time shaders: twelve art studies that were animated stills now render live in WebGL,
      driven by the studio's own transport (play, scrub, speed, reduced motion).
   3. Record any study as a WebM clip. */
(()=>{
 const $=(s,r=document)=>r.querySelector(s);
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const PRESETS={
  'Expressive (Atlas)':[.2,.7,.1,1],'Standard':[.4,0,.2,1],'Decelerate':[0,0,.2,1],'Accelerate':[.4,0,1,1],'Snappy':[.7,0,.2,1],
  'Gentle overshoot':[.34,1.56,.64,1],'Anticipate':[.68,-.55,.27,1.55],'Ease (browser)':[.25,.1,.25,1],'Linear':[0,0,1,1]};
 const SPRINGS={'Gentle':[120,14,1],'Responsive':[300,24,1],'Bouncy':[260,10,1],'Heavy':[200,26,3]};

 /* ---------- maths ---------- */
 function bez(t,a,b){const u=1-t;return 3*u*u*t*a+3*u*t*t*b+t*t*t;}
 function solveX(x,x1,x2){let t=x;for(let i=0;i<8;i++){const xx=bez(t,x1,x2)-x;const d=3*(1-t)*(1-t)*x1+6*(1-t)*t*(x2-x1)+3*t*t*(1-x2);if(Math.abs(xx)<1e-5)break;if(Math.abs(d)<1e-6)break;t-=xx/d;}return Math.min(1,Math.max(0,t));}
 function bezierY(x,c){return bez(solveX(x,c[0],c[2]),c[1],c[3]);}
 function spring([k,c,m]){const dt=1/120;let x=0,v=0,t=0;const pts=[[0,0]];while(t<6){const a=(-k*(x-1)-c*v)/m;v+=a*dt;x+=v*dt;t+=dt;pts.push([t,x]);if(t>.2&&Math.abs(x-1)<.0008&&Math.abs(v)<.0008)break;}
  const dur=t,step=Math.max(1,Math.floor(pts.length/48)),samp=[];for(let i=0;i<pts.length;i+=step)samp.push(pts[i]);samp.push([dur,1]);
  return {dur:Math.round(dur*1000),fn:x=>{const tt=x*dur;let i=pts.findIndex(p=>p[0]>=tt);if(i<1)return i===0?0:1;const [t0,y0]=pts[i-1],[t1,y1]=pts[i];return y0+(y1-y0)*(tt-t0)/(t1-t0);},linear:'linear('+samp.map(([t,y],i)=>+y.toFixed(3)+(i&&i<samp.length-1?' '+(t/dur*100).toFixed(1)+'%':'')).join(', ')+')'};}

 /* ---------- state ---------- */
 const S={mode:'bezier',c:[.2,.7,.1,1],sp:[260,10,1],dur:700,compare:'Standard'};
 try{Object.assign(S,JSON.parse(localStorage.getItem('atlasEasingLab')||'{}'));}catch{}
 const save=()=>{try{localStorage.setItem('atlasEasingLab',JSON.stringify(S));}catch{}};
 const tokens=()=>{try{return JSON.parse(localStorage.getItem('atlasMotionTokens')||'[]');}catch{return[];}};
 const setTokens=t=>{try{localStorage.setItem('atlasMotionTokens',JSON.stringify(t));}catch{}};
 function current(){if(S.mode==='spring'){const s=spring(S.sp);return {css:s.linear,dur:s.dur,fn:s.fn,label:`spring(${S.sp.join(', ')})`};}
  const c=S.c.map(v=>+(+v).toFixed(2));return {css:`cubic-bezier(${c.join(', ')})`,dur:S.dur,fn:x=>bezierY(x,c),label:`cubic-bezier(${c.join(', ')})`};}
 function readLink(){const h=location.hash;let m=h.match(/[?&]ease=([-\d.,]+)/);if(m){const v=m[1].split(',').map(Number);if(v.length>=4){S.mode='bezier';S.c=v.slice(0,4);if(v[4])S.dur=v[4];}}
  m=h.match(/[?&]spring=([\d.,]+)/);if(m){const v=m[1].split(',').map(Number);if(v.length===3){S.mode='spring';S.sp=v;}}}

 /* ---------- easing lab UI ---------- */
 let root;
 function build(){
  const page=document.getElementById('motion');if(!page||document.getElementById('easingLab'))return;
  readLink();
  root=document.createElement('section');root.id='easingLab';root.className='ezl';
  root.innerHTML=`<div class="ezl-head"><div><p class="ezl-kicker">Easing lab · design the timing</p><h2>Shape the curve, feel the difference.</h2></div><p>Drag the handles or tune a spring, play it against a second curve, then copy it as CSS, Web Animations, GSAP or Motion. Save the ones you like as motion tokens for your project.</p></div>
  <div class="ezl-body">
   <div class="ezl-editor">
    <div class="ezl-seg" role="group" aria-label="Curve type"><button type="button" data-mode="bezier">Cubic bezier</button><button type="button" data-mode="spring">Spring</button></div>
    <svg class="ezl-plot" viewBox="-24 -190 348 560" role="img" aria-label="Easing curve. Use the number fields to edit it with the keyboard.">
     <rect x="0" y="0" width="300" height="300" class="ezl-box"/><line x1="0" y1="300" x2="300" y2="0" class="ezl-diag"/>
     <path id="ezlCompare" class="ezl-cmp"/><path id="ezlCurve" class="ezl-curve"/>
     <g id="ezlHandles"><line id="ezlL1" class="ezl-arm"/><line id="ezlL2" class="ezl-arm"/><circle id="ezlH1" r="9" class="ezl-h h1" tabindex="-1"/><circle id="ezlH2" r="9" class="ezl-h h2" tabindex="-1"/></g>
     <text x="0" y="322" class="ezl-ax">time →</text><text x="-6" y="-10" class="ezl-ax" transform="rotate(-90 -6 -10)">progress →</text>
    </svg>
    <div class="ezl-fields" id="ezlBez">${['x1','y1','x2','y2'].map((k,i)=>`<label>${k}<input type="number" step="0.01" ${i%2?'min="-1" max="2"':'min="0" max="1"'} data-i="${i}"></label>`).join('')}<label>Duration<input type="number" id="ezlDur" min="100" max="3000" step="50"> ms</label></div>
    <div class="ezl-fields" id="ezlSpr" hidden>${[['Stiffness',50,600,10],['Damping',4,60,1],['Mass',.5,5,.5]].map(([l,a,b,st],i)=>`<label>${l}<input type="range" min="${a}" max="${b}" step="${st}" data-s="${i}"><output data-so="${i}"></output></label>`).join('')}<p class="ezl-note" id="ezlSprNote"></p></div>
    <div class="ezl-presets"><label>Preset<select id="ezlPreset"><option value="">Choose a preset…</option>${Object.keys(PRESETS).map(k=>`<option value="b:${k}">${k}</option>`).join('')}${Object.keys(SPRINGS).map(k=>`<option value="s:${k}">Spring · ${k}</option>`).join('')}</select></label></div>
   </div>
   <div class="ezl-play">
    <div class="ezl-tracks">
     <div class="ezl-track"><span class="ezl-tl">Your curve</span><div class="ezl-lane"><i id="ezlDotA" class="ezl-dot a"></i></div></div>
     <div class="ezl-track"><label class="ezl-tl">Compare with <select id="ezlCmp">${Object.keys(PRESETS).map(k=>`<option>${k}</option>`).join('')}</select></label><div class="ezl-lane"><i id="ezlDotB" class="ezl-dot b"></i></div></div>
     <div class="ezl-demo"><div class="ezl-card" id="ezlCard"><b>Saved</b><span>Direction added to project</span></div><div class="ezl-modal" id="ezlModal"></div></div>
    </div>
    <div class="ezl-actions"><button type="button" class="ezl-btn primary" id="ezlPlay">Play both</button><button type="button" class="ezl-btn" id="ezlShare">Copy share link</button><button type="button" class="ezl-btn" id="ezlSave">Save as motion token</button></div>
    <div class="ezl-code"><div class="ezl-tabs" role="group" aria-label="Code format">${['CSS','Web Animations','GSAP','Motion'].map((k,i)=>`<button type="button" data-code="${i}">${k}</button>`).join('')}<button type="button" class="ezl-copy" id="ezlCopy">Copy</button></div><pre class="ezl-pre" tabindex="0" aria-label="Generated code"><code id="ezlOut"></code></pre></div>
    <div class="ezl-tokens"><div class="ezl-row"><b>Motion tokens</b><button type="button" class="ezl-btn small" id="ezlExport">Copy as CSS variables</button></div><ol id="ezlTokens"></ol></div>
   </div>
  </div>`;
  const anchor=page.querySelector('.aeRelated')||page.querySelector('.intro');(anchor||page.firstElementChild).insertAdjacentElement('afterend',root);
  wire();draw();tokensUI();
 }
 let codeTab=0,status='';
 function wire(){
  root.querySelectorAll('button[data-mode]').forEach(b=>b.onclick=()=>{S.mode=b.dataset.mode;draw();});
  root.querySelectorAll('#ezlBez [data-i]').forEach(inp=>inp.oninput=()=>{const v=parseFloat(inp.value);if(!isNaN(v)){S.c[+inp.dataset.i]=v;draw(false);}});
  $('#ezlDur',root).oninput=e=>{S.dur=+e.target.value||700;draw(false);};
  root.querySelectorAll('[data-s]').forEach(r=>r.oninput=()=>{S.sp[+r.dataset.s]=+r.value;draw(false);});
  $('#ezlPreset',root).onchange=e=>{const v=e.target.value;if(!v)return;const [t,k]=[v[0],v.slice(2)];if(t==='b'){S.mode='bezier';S.c=PRESETS[k].slice();}else{S.mode='spring';S.sp=SPRINGS[k].slice();}e.target.value='';draw();play();};
  $('#ezlCmp',root).value=S.compare;$('#ezlCmp',root).onchange=e=>{S.compare=e.target.value;draw(false);};
  $('#ezlPlay',root).onclick=play;
  root.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>{codeTab=+b.dataset.code;code();});
  $('#ezlCopy',root).onclick=e=>copy($('#ezlOut',root).textContent,e.currentTarget);
  $('#ezlShare',root).onclick=e=>{const link=location.origin+location.pathname+'#motion?'+(S.mode==='spring'?'spring='+S.sp.join(','):'ease='+S.c.map(v=>+(+v).toFixed(2)).join(',')+','+S.dur);copy(link,e.currentTarget,'Link copied');};
  $('#ezlSave',root).onclick=()=>{const cur=current();const t=tokens();const name=`motion-${t.length+1}`;t.push({name,easing:cur.css,duration:cur.dur,label:cur.label});setTokens(t);tokensUI();};
  $('#ezlExport',root).onclick=e=>{const t=tokens();copy(':root{\n'+t.map(x=>`  --${x.name}-easing: ${x.easing};\n  --${x.name}-duration: ${x.duration}ms;`).join('\n')+'\n}',e.currentTarget);};
  // draggable handles
  const svg=$('.ezl-plot',root);let drag=null;
  const toPlot=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const q=p.matrixTransform(svg.getScreenCTM().inverse());return [Math.min(1,Math.max(0,q.x/300)),Math.min(2,Math.max(-1,(300-q.y)/300))];};
  ['ezlH1','ezlH2'].forEach((id,i)=>{const h=$('#'+id,root);h.addEventListener('pointerdown',e=>{if(S.mode!=='bezier')return;drag=i;h.setPointerCapture(e.pointerId);});h.addEventListener('pointermove',e=>{if(drag!==i)return;const [x,y]=toPlot(e);S.c[i*2]=+x.toFixed(2);S.c[i*2+1]=+y.toFixed(2);draw(false);});h.addEventListener('pointerup',()=>{drag=null;play();});});
 }
 function path(fn){let d='';for(let i=0;i<=60;i++){const x=i/60,y=fn(x);d+=(i?'L':'M')+(x*300).toFixed(1)+' '+(300-y*300).toFixed(1);}return d;}
 function draw(full=true){
  const cur=current();const spr=S.mode==='spring';
  root.querySelectorAll('button[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===S.mode)));
  $('#ezlBez',root).hidden=spr;$('#ezlSpr',root).hidden=!spr;$('#ezlHandles',root).style.display=spr?'none':'';
  $('#ezlCurve',root).setAttribute('d',path(cur.fn));
  const cmp=PRESETS[S.compare]||PRESETS.Standard;$('#ezlCompare',root).setAttribute('d',path(x=>bezierY(x,cmp)));
  if(!spr){const [x1,y1,x2,y2]=S.c;const P=(x,y)=>[x*300,300-y*300];const [a,b]=P(x1,y1),[c,d]=P(x2,y2);
   Object.entries({ezlH1:[a,b],ezlH2:[c,d]}).forEach(([id,[x,y]])=>{$('#'+id,root).setAttribute('cx',x);$('#'+id,root).setAttribute('cy',y);});
   $('#ezlL1',root).setAttribute('x1',0);$('#ezlL1',root).setAttribute('y1',300);$('#ezlL1',root).setAttribute('x2',a);$('#ezlL1',root).setAttribute('y2',b);
   $('#ezlL2',root).setAttribute('x1',300);$('#ezlL2',root).setAttribute('y1',0);$('#ezlL2',root).setAttribute('x2',c);$('#ezlL2',root).setAttribute('y2',d);
   root.querySelectorAll('#ezlBez [data-i]').forEach(inp=>{if(document.activeElement!==inp)inp.value=S.c[+inp.dataset.i];});
   if(document.activeElement!==$('#ezlDur',root))$('#ezlDur',root).value=S.dur;}
  else{root.querySelectorAll('[data-s]').forEach(r=>{r.value=S.sp[+r.dataset.s];root.querySelector(`[data-so="${r.dataset.s}"]`).textContent=S.sp[+r.dataset.s];});$('#ezlSprNote',root).textContent=`Settles in ${cur.dur} ms. Exported as a CSS linear() curve, so it runs without JavaScript.`;}
  code();save();
 }
 function code(){
  const cur=current();const c=S.c.map(v=>+(+v).toFixed(2));const spr=S.mode==='spring';
  root.querySelectorAll('[data-code]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.code===codeTab)));
  const out=[
   `/* ${cur.label} */\n.card {\n  transition: transform ${cur.dur}ms ${cur.css},\n              opacity ${Math.round(cur.dur*.6)}ms ${cur.css};\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .card { transition-duration: 0ms; }\n}`,
   `const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;\nel.animate(\n  [{ transform: 'translateY(24px)', opacity: 0 }, { transform: 'none', opacity: 1 }],\n  { duration: reduce ? 0 : ${cur.dur}, easing: '${cur.css}', fill: 'both' }\n);`,
   spr?`// GSAP has no built-in spring; this uses the sampled curve via CustomEase\ngsap.registerPlugin(CustomEase);\nCustomEase.create('atlas', '${cur.css.replace(/^linear\(|\)$/g,'')}');\ngsap.to('.card', { y: 0, opacity: 1, duration: ${(cur.dur/1000).toFixed(2)}, ease: 'atlas' });`:`gsap.registerPlugin(CustomEase);\nCustomEase.create('atlas', 'M0,0 C${c[0]},${c[1]} ${c[2]},${c[3]} 1,1');\ngsap.to('.card', { y: 0, opacity: 1, duration: ${(cur.dur/1000).toFixed(2)}, ease: 'atlas' });`,
   spr?`import { animate } from 'motion';\nanimate('.card', { y: [24, 0], opacity: [0, 1] },\n  { type: 'spring', stiffness: ${S.sp[0]}, damping: ${S.sp[1]}, mass: ${S.sp[2]} });`:`import { animate } from 'motion';\nanimate('.card', { y: [24, 0], opacity: [0, 1] },\n  { duration: ${(cur.dur/1000).toFixed(2)}, ease: [${c.join(', ')}] });`];
  $('#ezlOut',root).textContent=out[codeTab];
 }
 function play(){const cur=current(),cmp=PRESETS[S.compare]||PRESETS.Standard;const d=reduced.matches?0:cur.dur;
  const lane=$('.ezl-lane',root).clientWidth-22;
  $('#ezlDotA',root).animate([{transform:'translateX(0)'},{transform:`translateX(${lane}px)`}],{duration:d,easing:cur.css,fill:'both'});
  $('#ezlDotB',root).animate([{transform:'translateX(0)'},{transform:`translateX(${lane}px)`}],{duration:reduced.matches?0:S.dur,easing:`cubic-bezier(${cmp.join(',')})`,fill:'both'});
  $('#ezlCard',root).animate([{transform:'translateY(30px) scale(.94)',opacity:0},{transform:'none',opacity:1}],{duration:d,easing:cur.css,fill:'both'});
  $('#ezlModal',root).animate([{transform:'scale(.6)',borderRadius:'50%'},{transform:'none',borderRadius:'14px'}],{duration:d,easing:cur.css,fill:'both'});}
 function tokensUI(){const t=tokens();$('#ezlTokens',root).innerHTML=t.length?t.map((x,i)=>`<li><code>--${esc(x.name)}</code><span>${x.duration} ms · ${esc(x.label)}</span><button type="button" data-del="${i}" aria-label="Delete ${esc(x.name)}">Remove</button></li>`).join(''):'<li class="ezl-empty">No tokens yet. Save a curve to start a set for your project.</li>';
  root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const t=tokens();t.splice(+b.dataset.del,1);setTokens(t);tokensUI();});}
 async function copy(text,btn,done='Copied'){const old=btn.textContent;try{await navigator.clipboard.writeText(text);btn.textContent=done;}catch{btn.textContent='Copy failed · select the code';}setTimeout(()=>btn.textContent=old,1600);}

 /* ---------- real-time shaders for still-image studies ---------- */
 const COMMON='precision highp float;uniform float t;uniform vec2 res;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}';
 const SH={
  A03:['CRT telemetry','void main(){vec2 uv=gl_FragCoord.xy/res;vec2 c=uv-.5;uv+=c*dot(c,c)*.18;float l=0.;for(int i=0;i<3;i++){float fi=float(i);float y=.5+.18*sin(uv.x*(8.+fi*5.)+t*(1.2+fi*.4)+fi)*sin(t*.3+fi);l+=.004/abs(uv.y-y);}vec3 col=vec3(.2,1.,.35)*l;col+=vec3(.05,.25,.1)*step(.985,fract(uv.x*20.))+vec3(.05,.25,.1)*step(.985,fract(uv.y*12.));col*=.75+.25*sin(gl_FragCoord.y*3.1416);col*=1.-dot(c,c)*1.4;col+=.04*h(uv*res+t);if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)col=vec3(0);gl_FragColor=vec4(col,1);}'],
  A11:['Thermal palette','vec3 ramp(float x){return clamp(vec3(1.5*x-.2,2.*x-.9,1.3-abs(2.*x-.6)*2.+max(0.,x-.85)*5.),0.,1.);}void main(){vec2 uv=gl_FragCoord.xy/res;vec2 p=uv*vec2(res.x/res.y,1.)*3.;float hand=exp(-pow(length((uv-vec2(.42+.05*sin(t*.4),.45))*vec2(1.6,1.)),2.)*9.);float cup=exp(-pow(length((uv-vec2(.7,.38))*vec2(2.,1.4)),2.)*14.);float steam=fbm(vec2(p.x*1.5,p.y*1.2-t*.8))*smoothstep(.35,.9,uv.y)*exp(-pow((uv.x-.7)*6.,2.));float v=.12+.6*hand+.85*cup+.55*steam+.08*fbm(p+t*.1);gl_FragColor=vec4(ramp(clamp(v,0.,1.)),1);}'],
  A14:['Raymarched SDF','float sd(vec3 p){vec3 q=p;q.xz*=mat2(cos(t*.4),-sin(t*.4),sin(t*.4),cos(t*.4));float s=length(q)-1.;float tor=length(vec2(length(q.xy)-1.4,q.z))-.25;float d=mix(s,tor,.5+.5*sin(t*.6));return d+.05*sin(5.*q.x+t)*sin(5.*q.y)*sin(5.*q.z);}vec3 nor(vec3 p){vec2 e=vec2(.002,0);return normalize(vec3(sd(p+e.xyy)-sd(p-e.xyy),sd(p+e.yxy)-sd(p-e.yxy),sd(p+e.yyx)-sd(p-e.yyx)));}void main(){vec2 uv=(gl_FragCoord.xy-.5*res)/res.y;vec3 ro=vec3(0,0,4),rd=normalize(vec3(uv,-1.6));float d=0.;vec3 col=mix(vec3(.95,.82,.65),vec3(.35,.45,.7),uv.y+.5);for(int i=0;i<80;i++){vec3 p=ro+rd*d;float s=sd(p);if(s<.001){vec3 n=nor(p);vec3 l=normalize(vec3(.6,.8,.5));float dif=max(dot(n,l),0.);float rim=pow(1.-max(dot(n,-rd),0.),3.);col=vec3(.92,.88,.82)*(.25+.75*dif)+vec3(1.,.7,.45)*rim*.8;break;}d+=s;if(d>12.)break;}gl_FragColor=vec4(pow(col,vec3(.9)),1);}'],
  A19:['Synthwave','void main(){vec2 uv=(gl_FragCoord.xy-.5*res)/res.y;vec3 col=mix(vec3(.05,.0,.15),vec3(.6,.1,.5),smoothstep(-.1,.5,uv.y));float sun=smoothstep(.31,.3,length(uv-vec2(0,.16)));float bands=step(.5,fract((uv.y-.16)*18.-t*.6))+step(.16,uv.y);col=mix(col,mix(vec3(1.,.3,.5),vec3(1.,.85,.3),smoothstep(-.1,.45,uv.y)),sun*min(1.,bands));if(uv.y<0.){float z=.25/(-uv.y+.001);vec2 g=vec2(uv.x*z,z+t*1.6);vec2 f=abs(fract(g)-.5);float line=smoothstep(.06,0.,min(f.x,f.y)/z*.8);col=mix(vec3(.04,.0,.1),vec3(1.,.2,.8),line)*(1.-smoothstep(0.,-.5,uv.y)*.3);col+=vec3(.6,.1,.6)*exp(uv.y*14.)*.6;}gl_FragColor=vec4(col,1);}'],
  A20:['Mandelbulb','float de(vec3 p){vec3 z=p;float dr=1.,r=0.;float pw=7.+sin(t*.3);for(int i=0;i<6;i++){r=length(z);if(r>2.)break;float th=acos(z.z/r)*pw,ph=atan(z.y,z.x)*pw;dr=pow(r,pw-1.)*pw*dr+1.;z=pow(r,pw)*vec3(sin(th)*cos(ph),sin(ph)*sin(th),cos(th))+p;}return .5*log(r)*r/dr;}void main(){vec2 uv=(gl_FragCoord.xy-.5*res)/res.y;float a=t*.25;vec3 ro=vec3(2.6*sin(a),.6,2.6*cos(a)),ta=vec3(0);vec3 w=normalize(ta-ro),u=normalize(cross(w,vec3(0,1,0))),v=cross(u,w);vec3 rd=normalize(uv.x*u+uv.y*v+1.6*w);float d=0.;int k=0;vec3 col=vec3(.04,.03,.06)+vec3(.15,.1,.2)*(1.-length(uv));for(int i=0;i<72;i++){float s=de(ro+rd*d);if(s<.0015){float ao=1.-float(i)/72.;col=mix(vec3(.25,.15,.35),vec3(1.,.82,.55),ao)*ao*1.2;break;}d+=s;if(d>6.)break;}gl_FragColor=vec4(col,1);}'],
  A21:['Cymatics','void main(){vec2 uv=(gl_FragCoord.xy-.5*res)/res.y*2.;float r=length(uv),a=atan(uv.y,uv.x);float m=3.+floor(mod(t*.15,4.));float w=sin(r*18.-t*1.5)*cos(a*m*2.+t*.2)+sin(uv.x*14.+t)*sin(uv.y*14.-t*.8)*.6;float lines=smoothstep(.12,.0,abs(w));vec3 col=mix(vec3(.05,.04,.03),vec3(.95,.88,.7),lines)*smoothstep(1.05,.95,r);col+=vec3(.2,.15,.1)*smoothstep(1.,.98,r)*smoothstep(.95,.97,r);gl_FragColor=vec4(col,1);}'],
  A24:['Volumetric smoke & light','void main(){vec2 uv=gl_FragCoord.xy/res;vec2 p=uv*vec2(res.x/res.y,1.);float s=0.;for(int i=0;i<5;i++){float fi=float(i);s+=fbm(p*2.+vec2(fi*1.7,-t*.15*(1.+fi*.2)))*.25;}float beam=smoothstep(.25,0.,abs((uv.x-.55)+(uv.y-1.)*.35))*uv.y;vec3 col=vec3(.06,.05,.04)+vec3(1.,.82,.55)*s*(.35+1.6*beam)+vec3(1.,.9,.7)*beam*.25;col=pow(col,vec3(.85));gl_FragColor=vec4(col,1);}'],
  A35:['Contours & isolines','void main(){vec2 uv=gl_FragCoord.xy/res;vec2 p=uv*vec2(res.x/res.y,1.)*2.5;float e=fbm(p+vec2(t*.05,0.))+.3*fbm(p*2.-t*.03);float c=fract(e*14.);float line=smoothstep(.06,0.,min(c,1.-c));float major=smoothstep(.04,0.,abs(fract(e*14./5.)-.5)-.48);vec3 col=mix(vec3(.94,.92,.86),vec3(.75,.85,.7),smoothstep(.3,.8,e));col=mix(col,vec3(.24,.3,.2),line*.55+major*.4);gl_FragColor=vec4(col,1);}'],
  A36:['Magnetic field lines','void main(){vec2 uv=(gl_FragCoord.xy-.5*res)/res.y;vec2 a=vec2(-.35+.05*sin(t*.5),0.),b=vec2(.35,.05*cos(t*.4));float pa=atan(uv.y-a.y,uv.x-a.x),pb=atan(uv.y-b.y,uv.x-b.x);float psi=pa-pb;float f=fract(psi*6./6.2832+t*.15);float line=smoothstep(.08,0.,min(f,1.-f));float ra=length(uv-a),rb=length(uv-b);vec3 col=vec3(.02,.03,.06)+line*mix(vec3(1.,.45,.15),vec3(.2,.7,1.),smoothstep(-.3,.3,uv.x))*(.6+.4/(1.+min(ra,rb)*4.));col+=vec3(1.,.6,.3)*.012/ra+vec3(.3,.7,1.)*.012/rb;gl_FragColor=vec4(col,1);}'],
  A39:['Moiré / op art','void main(){vec2 uv=(gl_FragCoord.xy-.5*res)/res.y;vec2 c1=vec2(.12*sin(t*.4),.08*cos(t*.3)),c2=-c1;float a=sin(length(uv-c1)*90.),b=sin(length(uv-c2)*90.+t);float l=sin(uv.x*120.+sin(uv.y*6.+t)*4.);float v=step(0.,a*b)*.85+step(0.,l)*.15;gl_FragColor=vec4(vec3(v),1);}'],
  A40:['Nebula','void main(){vec2 uv=gl_FragCoord.xy/res;vec2 p=(uv-.5)*vec2(res.x/res.y,1.)*3.;float q=fbm(p+t*.03);float r=fbm(p+q*2.+vec2(1.7,9.2)+t*.05);float s=fbm(p+r*2.5);vec3 col=mix(vec3(.05,.02,.12),vec3(.9,.2,.5),s);col=mix(col,vec3(.2,.5,1.),r*r);col=mix(col,vec3(1.,.85,.6),pow(q,4.)*1.5);col*=.6+.8*s;float st=pow(h(floor(uv*res/2.)),180.)*(.6+.4*sin(t*3.+h(floor(uv*res/2.))*20.));col+=st;gl_FragColor=vec4(col,1);}'],
  A27:['Soft-body jelly','float sdb(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.))+min(max(d.x,d.y),0.);}void main(){vec2 uv=(gl_FragCoord.xy-.5*res)/res.y;float ph=mod(t,2.4);float fall=ph<1.?1.-ph*ph:0.;float sq=ph>=1.?exp(-(ph-1.)*3.)*sin((ph-1.)*12.):0.;vec2 c=vec2(0.,-.18+fall*.45);vec2 s=vec2(.22*(1.+sq*.35),.22*(1.-sq*.35));float d=sdb((uv-c)/s*.22,vec2(.17))-.05;float floorY=-.4;vec3 col=mix(vec3(.93,.95,.98),vec3(.82,.86,.92),uv.y+.5);col=mix(col,vec3(.75,.78,.85),smoothstep(.002,0.,uv.y-floorY));float sh=exp(-pow(length((uv-vec2(c.x,floorY))*vec2(1.,6.)),2.)*20.)*(1.-fall*.6);col*=1.-sh*.25;vec3 jelly=mix(vec3(1.,.45,.6),vec3(1.,.75,.8),smoothstep(-.1,.2,uv.y-c.y+uv.x*.3));col=mix(col,jelly,smoothstep(.004,0.,d));col+=vec3(1.)*smoothstep(.03,0.,length(uv-c-vec2(-.06,.08)*s/.22))*.6*smoothstep(.004,0.,d);gl_FragColor=vec4(col,1);}']
 };
 let gl,cv,prog=null,progId=null,raf=0,last=0,shaderOn=true;
 function ensureCanvas(){const stage=document.getElementById('motionStage');if(!stage)return false;cv=document.getElementById('shaderCanvas');
  if(!cv){cv=document.createElement('canvas');cv.id='shaderCanvas';cv.className='shadercanvas';cv.setAttribute('aria-label','Real-time shader study');stage.append(cv);
   gl=cv.getContext('webgl',{preserveDrawingBuffer:true,antialias:false});
   const tog=document.createElement('button');tog.id='shaderToggle';tog.type='button';tog.hidden=true;tog.setAttribute('aria-pressed','true');tog.textContent='Show reference image';
   tog.onclick=()=>{shaderOn=!shaderOn;tog.setAttribute('aria-pressed',String(shaderOn));tog.textContent=shaderOn?'Show reference image':'Show live shader';activate(window.activeMotionId);};
   document.querySelector('.viewerbar')?.append(tog);
   const rec=document.createElement('button');rec.id='recordClip';rec.type='button';rec.textContent='Record clip';rec.onclick=record;document.querySelector('.viewerbar')?.append(rec);}
  return !!gl;}
 function compile(id){const [,src]=SH[id];const vs='attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}';const mk=(ty,s)=>{const o=gl.createShader(ty);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.warn(id,gl.getShaderInfoLog(o));return o;};
  const p=gl.createProgram();gl.attachShader(p,mk(gl.VERTEX_SHADER,vs));gl.attachShader(p,mk(gl.FRAGMENT_SHADER,COMMON+src));gl.linkProgram(p);gl.useProgram(p);
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const l=gl.getAttribLocation(p,'p');gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);return p;}
 function frame(now){raf=requestAnimationFrame(frame);if(now-last<30)return;last=now;if(!prog||cv.hidden)return;
  const scale=progId==='A20'||progId==='A14'?.55:.8;const w=Math.round(cv.clientWidth*scale),h=Math.round(cv.clientHeight*scale);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;gl.viewport(0,0,w,h);}
  const SE=typeof StudyEngine!=='undefined'?StudyEngine:null;const time=SE?(SE.time||0):performance.now()/1000;
  gl.uniform1f(gl.getUniformLocation(prog,'t'),time*(SE&&SE.reduced?0:1)+(SE&&SE.reduced?2:0));gl.uniform2f(gl.getUniformLocation(prog,'res'),w,h);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
 function activate(id){window.activeMotionId=id;const has=!!SH[id];if(!ensureCanvas()){return;}
  const tog=$('#shaderToggle');if(tog)tog.hidden=!has;
  const live=has&&shaderOn;cv.hidden=!live;document.getElementById('motionStage')?.classList.toggle('shaderLive',live);
  if(live){if(progId!==id){prog=compile(id);progId=id;}if(!raf)raf=requestAnimationFrame(frame);
   const type=$('#studyType');if(type)type.textContent='Real-time shader study';const hint=$('#motionHint');if(hint)hint.textContent=`${SH[id][0]} rendered live on the GPU with a fragment shader. Play, scrub and speed control it; reduced motion holds a still frame. Toggle “Show reference image” to compare with the original artwork.`;}
 }
 function record(){const btn=$('#recordClip');const sim=document.getElementById('simCanvas');const src=sim&&!sim.hidden?sim:!cv.hidden?cv:document.getElementById('studyCanvas');
  if(!src.captureStream||typeof MediaRecorder==='undefined'){btn.textContent='Recording not supported here';return;}
  const type=['video/webm;codecs=vp9','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));const rec=new MediaRecorder(src.captureStream(30),type?{mimeType:type,videoBitsPerSecond:6e6}:{});const chunks=[];
  rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);rec.onstop=()=>{const url=URL.createObjectURL(new Blob(chunks,{type:'video/webm'}));const a=document.createElement('a');a.href=url;a.download=(window.activeMotionId||'study')+'-atlas.webm';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);btn.textContent='Record clip';btn.disabled=false;};
  btn.disabled=true;let s=6;btn.textContent='Recording 6 s…';rec.start(200);const iv=setInterval(()=>{s--;btn.textContent=s>0?`Recording ${s} s…`:'Saving…';if(s<=0){clearInterval(iv);rec.stop();}},1000);}

 function hook(){if(typeof window.selectStudy!=='function'||window.selectStudy.__atlas)return false;const orig=window.selectStudy;const wrapped=function(id){const r=orig.apply(this,arguments);try{activate(id);}catch(e){console.warn(e);}return r;};wrapped.__atlas=true;window.selectStudy=wrapped;return true;}
 function init(){build();const page=document.getElementById('motion');if(page)new MutationObserver(()=>{if(!document.getElementById('easingLab'))build();}).observe(page,{childList:true});
  const t=setInterval(()=>{if(hook()){clearInterval(t);const id=document.getElementById('motionSelect')?.value;if(id)activate(id);}},300);}
 window.MotionLab2={presets:PRESETS,shaders:Object.keys(SH),activate};
 if(document.readyState!=='loading')init();else addEventListener('DOMContentLoaded',init);
 addEventListener('hashchange',()=>{if(/#motion\?(ease|spring)=/.test(location.hash)&&root){readLink();draw();play();}});
})();
