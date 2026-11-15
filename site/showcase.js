'use strict';
/* Showcase reels (#showcase).
   Present a set of images in motion: pick a template, a format and a background, then export a video.
   Every template is a pure function of time, so the preview and the export draw identical frames. */
(()=>{
/* Safari has no canvas filter, so there the blur is made by shrinking the picture in halves and drawing it back up */
function blurDraw(x,i,dx,dy,dw,dh,r,force){if(!(r>0)||('filter' in x&&!force)){x.save();if(r>0)x.filter=`blur(${r}px)`;x.drawImage(i,dx,dy,dw,dh);x.restore();return}
 const mk=(w,h,from)=>{const t=document.createElement('canvas');t.width=w;t.height=h;const c=t.getContext('2d');c.imageSmoothingQuality='high';c.drawImage(from,0,0,w,h);return t};
 let w=Math.max(2,Math.round(dw)),h=Math.max(2,Math.round(dh)),src=i,k=r*1.2,n=0;
 while(k>1&&w>8&&h>8){w=Math.max(2,Math.round(w/2));h=Math.max(2,Math.round(h/2));src=mk(w,h,src);k/=2;n++}
 for(;n>1;n--){w*=2;h*=2;src=mk(w,h,src)}
 x.save();x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(src,dx,dy,dw,dh);x.restore()}
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 const ease={out:t=>1-Math.pow(1-t,3),inOut:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,back:t=>{const c=1.4;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);}};
 const seg=(u,a,b)=>clamp((u-a)/(b-a));
 const FORMATS=[['16:9',16/9,'Landscape'],['9:16',9/16,'Story'],['1:1',1,'Square'],['4:5',.8,'Portrait']];
 const BGS=[['paper','Atlas paper',{solid:'#eceef1'}],['ink','Ink',{solid:'#0d0f13'}],['velvet-0','Peach Silk',{preset:'velvet-0'}],['velvet-1','Deep Plum',{preset:'velvet-1'}],['aurora-0','Polar Night',{preset:'aurora-0'}],['oilslick-0','Holo Foil',{preset:'oilslick-0'}],['orbs-0','Studio Light',{preset:'orbs-0'}],['grain-0','Riso Sunset',{preset:'grain-0'}]];

 /* Soft shadows are pre-blurred once per aspect ratio and then stretched; live canvas shadowBlur is too slow for video. */
 const shadows=new Map();
 function shadowSprite(a){const k=Math.round(a*10)/10;if(shadows.has(k))return shadows.get(k);const base=200,w=a>=1?base*a:base,h=a>=1?base:base/a,pad=Math.min(w,h)*.28,c=document.createElement('canvas');c.width=Math.ceil(w+pad*2);c.height=Math.ceil(h+pad*2);
  const x=c.getContext('2d');x.filter=`blur(${Math.min(w,h)*.09}px)`;x.fillStyle='rgba(10,14,22,.75)';x.beginPath();x.roundRect(pad,pad,w,h,Math.min(w,h)*.06);x.fill();shadows.set(k,c);return c;}
 /* Card drawing shared by every template: rounded, shadowed, image covers the card. */
 function card(ctx,img,cx,cy,w,h,o){const r=Math.min(w,h)*o.radius;ctx.save();ctx.globalAlpha*=o.alpha??1;ctx.translate(cx,cy);if(o.rot)ctx.rotate(o.rot);if(o.sx||o.sy)ctx.scale(o.sx??1,o.sy??1);
  if(o.shadow&&w>0&&h>0){const sp=shadowSprite(w/h),m=Math.min(w,h),pad=m*.28;ctx.save();ctx.globalAlpha*=Math.min(1,.55*o.shadow);ctx.drawImage(sp,-w/2-pad,-h/2-pad+m*.04*o.shadow,w+pad*2,h+pad*2);ctx.restore();}
  ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,r);ctx.fillStyle='#fff';ctx.fill();ctx.clip();
  if(img&&img.naturalWidth){const s=Math.max(w/img.naturalWidth,h/img.naturalHeight),iw=img.naturalWidth*s,ih=img.naturalHeight*s;ctx.drawImage(img,-iw/2,-ih/2,iw,ih);}
  if(o.dim){ctx.fillStyle=`rgba(8,10,16,${o.dim})`;ctx.fillRect(-w/2,-h/2,w,h);}ctx.restore();}

 /* Templates: f(ctx, time, items, W, H, opts). `per` is seconds per shot. */
 const T={
  rise:{name:'Rise',note:'A centred card holds while each new one rises from below.',draw(ctx,t,it,W,H,o){const n=it.length,k=Math.floor(t/o.per),u=(t%o.per)/o.per,e=ease.out(seg(u,0,.45));const w=W*o.scale,h=Math.min(H*o.scale,w/1.45),wc=h*1.45;
   const prev=it[(k-1+n)%n],cur=it[k%n];card(ctx,prev,W/2,H/2-h*.03*e,wc,h,{...o,sx:1-.07*e,sy:1-.07*e,dim:.25*e});card(ctx,cur,W/2,H/2+(H*.6)*(1-e),wc,h,{...o,alpha:clamp(e*1.4)});}},
  rolodex:{name:'Rolodex',note:'A vertical reel that tilts as it passes the centre.',draw(ctx,t,it,W,H,o){const n=it.length,h=H*o.scale*.62,w=Math.min(W*o.scale,h*1.6),gap=h*1.12;const k=Math.floor(t/o.per),u=ease.inOut(seg((t%o.per)/o.per,.55,1));const pos=k+u;
   for(let j=-3;j<=3;j++){const i=Math.floor(pos)+j,d=i-pos;const y=H/2+d*gap*(1-Math.min(Math.abs(d),2.4)*.08);const tilt=clamp(Math.abs(d),0,2);card(ctx,it[((i%n)+n)%n],W/2,y,w,h,{...o,sy:1-tilt*.22,sx:1-tilt*.06,alpha:1-tilt*.38,dim:tilt*.18,shadow:o.shadow*(1-tilt*.4)});}}},
  comet:{name:'Comet',note:'Each image arcs in, holds sharp at centre, then flies up and away.',draw(ctx,t,it,W,H,o){const n=it.length,k=Math.floor(t/o.per),u=(t%o.per)/o.per;const w=W*o.scale*.8,h=Math.min(H*o.scale*.8,w/1.45),wc=h*1.45;
   const a=ease.out(seg(u,0,.32)),b=ease.inOut(seg(u,.72,1));const x=W/2+(-W*.75)*(1-a)+W*.7*b,y=H/2+H*.55*(1-a)*(1-a)-H*.9*b*b,rot=(-.35)*(1-a)+.22*b,s=.6+.4*a-.15*b;card(ctx,it[k%n],x,y,wc,h,{...o,rot,sx:s,sy:s,alpha:clamp(a*1.5)*(1-b*.6)});}},
  stack:{name:'Deck',note:'A loose stack; the top card slides away to reveal the next.',draw(ctx,t,it,W,H,o){const n=it.length,k=Math.floor(t/o.per),u=(t%o.per)/o.per,e=ease.inOut(seg(u,.6,1));const h=H*o.scale*.72,w=Math.min(W*o.scale*.8,h*1.45);
   for(let j=4;j>=0;j--){const i=k+j,rot=((i*37)%9-4)*.022,lift=j-e;if(j===0){card(ctx,it[i%n],W/2-W*.9*e,H/2+h*.05*e,w,h,{...o,rot:rot-.35*e,alpha:1-e*.3});continue;}const s=1-lift*.045;card(ctx,it[i%n],W/2,H/2+lift*h*.035,w,h,{...o,rot:rot*(lift>0?1:0),sx:s,sy:s,dim:.06*lift});}}},
  marquee:{name:'Marquee',note:'Three tilted rows drifting at different speeds.',draw(ctx,t,it,W,H,o){const n=it.length,total=n*o.per,rowH=H*.3*o.scale/.72,w=rowH*1.45,gap=w*1.08;ctx.save();ctx.translate(W/2,H/2);ctx.rotate(-.12);
   for(let r=-1;r<=1;r++){const dir=r%2?-1:1,speed=gap*n/total*(1+Math.abs(r)*.25),off=(t*speed*dir)%(gap*n);for(let i=-n;i<2*n;i++){const x=i*gap+off-W*.6;if(x<-W*1.1||x>W*1.1)continue;card(ctx,it[((i+r*3)%n+n)%n],x,r*rowH*1.12,w,rowH,{...o,shadow:o.shadow*.7});}}ctx.restore();}},
  orbit:{name:'Carousel',note:'Cards on an ellipse; the front one turns to face you.',draw(ctx,t,it,W,H,o){const n=it.length,k=Math.floor(t/o.per),u=ease.inOut(seg((t%o.per)/o.per,.6,1)),pos=k+u;const h=H*o.scale*.5,w=Math.min(W*.42,h*1.45),R=Math.min(W*.4,w*1.6);
   const list=[];for(let i=0;i<n;i++){const ang=(i-pos)/n*Math.PI*2;list.push({i,z:Math.cos(ang),x:Math.sin(ang)});}list.sort((a,b)=>a.z-b.z);
   for(const c of list){const s=.55+.45*(c.z+1)/2;card(ctx,it[c.i],W/2+c.x*R,H/2-(1-c.z)*h*.06,w,h,{...o,sx:s*(.7+.3*Math.abs(c.z)),sy:s,dim:(1-(c.z+1)/2)*.45,shadow:o.shadow*s});}}},
  folio:{name:'Folio',note:'The whole set lands as a grid, then the camera visits each piece.',draw(ctx,t,it,W,H,o){const n=it.length,cols=Math.ceil(Math.sqrt(n*W/H*.7)),rows=Math.ceil(n/cols),cw=W*.86/cols,ch=Math.min(H*.84/rows,cw/1.45),cardW=Math.min(cw,ch*1.45)*.9,cardH=cardW/1.45;
   const gx=i=>W/2+((i%cols)-(cols-1)/2)*cw,gy=i=>H/2+(Math.floor(i/cols)-(rows-1)/2)*(cardH/.9);const intro=1.2,k=Math.floor(Math.max(0,t-intro)/o.per),u=(Math.max(0,t-intro)%o.per)/o.per;const focus=t<intro?-1:k%n;
   const z=t<intro?1:1+(Math.min(W/cardW,H/cardH)*.72-1)*ease.inOut(Math.min(seg(u,0,.25),1-seg(u,.75,1)));const fx=focus<0?W/2:gx(focus),fy=focus<0?H/2:gy(focus);
   ctx.save();ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-fx,-fy);for(let i=0;i<n;i++){const d=ease.back(seg(t,i*.06,i*.06+.6));card(ctx,it[i],gx(i),gy(i)+(1-d)*H*.25,cardW,cardH,{...o,alpha:clamp(d),dim:focus>=0&&i!==focus?.35*(z-1)/(z):0,shadow:o.shadow*.6});}ctx.restore();}},
  spotlight:{name:'Spotlight',note:'Full-frame images with a slow push-in and a soft crossfade.',draw(ctx,t,it,W,H,o){const n=it.length,k=Math.floor(t/o.per),u=(t%o.per)/o.per;const draw=(img,uu,alpha)=>{const s=1.04+.08*uu;card(ctx,img,W/2+(uu-.5)*W*.02,H/2,W*o.scale*1.25*s,H*o.scale*1.25*s,{...o,alpha,shadow:0,radius:o.radius*.4});};
   draw(it[k%n],u,1);const f=seg(u,.82,1);if(f>0)draw(it[(k+1)%n],0,ease.inOut(f));}}
 };

 const st={tpl:'rise',fmt:'16:9',bg:'paper',per:1.6,scale:.72,radius:.045,shadow:1,blur:0,items:[],playing:!reduce.matches,bgImg:null};
 let cv,ctx,raf=0,t0=performance.now(),built=false;
 const ratio=()=>FORMATS.find(f=>f[0]===st.fmt)[1];
 const opts=()=>({per:st.per,scale:st.scale,radius:st.radius,shadow:st.shadow});

 function defaults(){/* The twelve original website mockups, from their sharp per-tile files. */
  const ids=['S01','S02','S03','S04','S05','S06','S07','S08','S09','S10','S11','S12'];
  return ids.map(id=>{try{const e=find(id);const u=(typeof tileURL==='function'&&tileURL(e.image))||e.image?.url;return u?{src:u,name:e.title}:null;}catch{return null;}}).filter(Boolean).slice(0,8);}
 function load(list){return Promise.all(list.map(x=>new Promise(r=>{const im=new Image();im.decoding='async';im.onload=()=>r(Object.assign(im,{label:x.name}));im.onerror=()=>r(null);im.src=x.src;}))).then(a=>a.filter(Boolean));}

 function background(c,W,H){const b=BGS.find(x=>x[0]===st.bg)[2];if(b.solid){c.fillStyle=b.solid;c.fillRect(0,0,W,H);return;}
  if(!st.bgImg||st.bgImg.key!==st.bg){const s=window.BackgroundAtlas?.still(b.preset,1600,Math.round(1600/Math.max(ratio(),.5)));st.bgImg=s?Object.assign(s,{key:st.bg}):null;}
  if(!st.bgImg){c.fillStyle='#eceef1';c.fillRect(0,0,W,H);return;}const im=st.bgImg,s=Math.max(W/im.width,H/im.height);blurDraw(c,im,(W-im.width*s)/2,(H-im.height*s)/2,im.width*s,im.height*s,st.blur?st.blur*W/100:0);}
 function frame(c,W,H,t){c.save();c.clearRect(0,0,W,H);background(c,W,H);if(st.items.length)T[st.tpl].draw(c,t,st.items,W,H,{...opts(),radius:st.radius});
  else{c.fillStyle='rgba(0,0,0,.45)';c.font=`500 ${W*.022}px system-ui,sans-serif`;c.textAlign='center';c.fillText('Loading images…',W/2,H/2);}c.restore();}
 const loopLen=()=>st.items.length*st.per+(st.tpl==='folio'?1.2:0);

 function shell(){const sec=document.getElementById('showcase');if(!sec||built)return;built=true;
  sec.innerHTML=`<header class="scHead"><p class="cardcode">Motion · ${Object.keys(T).length} templates</p><h1 class="pagetitle" id="scTitle">Showcase reels.</h1><p class="intro">Put your work in motion. Choose a template, drop in your own screenshots or use the atlas mockups, pick a format and a background, then export a video for your portfolio, a pitch or social posts. Images stay in your browser.</p></header>
  <div class="scTemplates" role="group" aria-label="Templates">${Object.entries(T).map(([k,v])=>`<button type="button" data-tpl="${k}" aria-pressed="false"><b>${v.name}</b><small>${esc(v.note)}</small></button>`).join('')}</div>
  <div class="scWork"><div class="scStageWrap"><div class="scStage"><canvas id="scCanvas" role="img" aria-label="Showcase reel preview"></canvas><div class="scBar"><span id="scInfo"></span><button type="button" id="scPlay" class="bgIcon">Pause</button></div></div>
   <div class="scMedia"><div class="scThumbs" id="scThumbs"></div><label class="scUpload secondary" for="scFiles">Add your images</label><input type="file" id="scFiles" accept="image/*" multiple class="visually-hidden"><button type="button" class="secondary" id="scReset">Use atlas mockups</button></div></div>
   <aside class="bgPanel scPanel" aria-label="Reel settings">
    <div class="bgRow"><span class="scLabel">Format</span><div class="scChips" id="scFormats">${FORMATS.map(f=>`<button type="button" data-fmt="${f[0]}" aria-pressed="false"><b>${f[0]}</b><small>${f[2]}</small></button>`).join('')}</div></div>
    <div class="bgRow"><span class="scLabel">Background</span><div class="scSwatches" id="scBgs">${BGS.map(b=>`<button type="button" data-bg="${b[0]}" aria-pressed="false" title="${esc(b[1])}"><i data-swatch="${b[0]}"></i><span>${esc(b[1])}</span></button>`).join('')}</div></div>
    ${[['per','Seconds per image',.8,4,.1],['scale','Media size',.4,.95,.01],['radius','Corner radius',0,.12,.005],['shadow','Shadow',0,2,.05],['blur','Background blur',0,4,.1]].map(([k,l,a,b,s])=>`<div class="bgRow bgSlider"><label for="sc_${k}">${l}</label><input type="range" id="sc_${k}" data-sc="${k}" min="${a}" max="${b}" step="${s}"><output id="sco_${k}"></output></div>`).join('')}
    <div class="bgExport"><p class="cardcode">Export</p><button type="button" class="primary" id="scExport">Export video · 1080p</button><p class="bgStatus" id="scStatus" role="status"></p></div>
    <p class="scHint">Backgrounds come from the <a href="#backgrounds">background generator</a>. Video is WebM in Chrome, Edge and Firefox.</p>
   </aside></div>`;
  cv=sec.querySelector('#scCanvas');ctx=cv.getContext('2d');
  sec.querySelector('.scTemplates').onclick=e=>{const b=e.target.closest('[data-tpl]');if(b){st.tpl=b.dataset.tpl;t0=performance.now();sync();}};
  sec.querySelector('#scFormats').onclick=e=>{const b=e.target.closest('[data-fmt]');if(b){st.fmt=b.dataset.fmt;st.bgImg=null;layout();}};
  sec.querySelector('#scBgs').onclick=e=>{const b=e.target.closest('[data-bg]');if(b){st.bg=b.dataset.bg;st.bgImg=null;sync();}};
  sec.querySelectorAll('[data-sc]').forEach(i=>i.oninput=()=>{st[i.dataset.sc]=+i.value;sync();});
  sec.querySelector('#scPlay').onclick=()=>{st.playing=!st.playing;sync();};
  sec.querySelector('#scFiles').onchange=async e=>{const files=[...e.target.files].filter(f=>f.type.startsWith('image/')).slice(0,24);if(!files.length)return;st.items=await load(files.map(f=>({src:URL.createObjectURL(f),name:f.name})));t0=performance.now();thumbs();sync();status(`${st.items.length} of your images loaded. They stay on this device.`);e.target.value='';};
  sec.querySelector('#scReset').onclick=async()=>{st.items=await load(defaults());thumbs();sync();status('Using the atlas mockups.');};
  const drop=sec.querySelector('.scStage');drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag');});drop.addEventListener('dragleave',()=>drop.classList.remove('drag'));
  drop.addEventListener('drop',async e=>{e.preventDefault();drop.classList.remove('drag');const files=[...e.dataTransfer.files].filter(f=>f.type.startsWith('image/')).slice(0,24);if(files.length){st.items=await load(files.map(f=>({src:URL.createObjectURL(f),name:f.name})));thumbs();sync();}});
  sec.querySelector('#scExport').onclick=exportVideo;
  new ResizeObserver(()=>layout()).observe(sec.querySelector('.scStageWrap'));
  swatches();const ready=()=>{let ok=false;try{ok=Array.isArray(catalogue)&&catalogue.length>0;}catch{}if(!ok){setTimeout(ready,200);return;}load(defaults()).then(a=>{if(!st.items.length){st.items=a;thumbs();sync();}});};ready();}
 function swatches(){document.querySelectorAll('#scBgs [data-swatch]').forEach(i=>{const b=BGS.find(x=>x[0]===i.dataset.swatch)[2];if(b.solid){i.style.background=b.solid;return;}const c=window.BackgroundAtlas?.still(b.preset,96,64);if(c)i.style.backgroundImage=`url(${c.toDataURL('image/jpeg',.8)})`;});}
 function thumbs(){const el=document.getElementById('scThumbs');if(el)el.innerHTML=st.items.map((im,i)=>`<span title="${esc(im.label||'Image '+(i+1))}" style="background-image:url('${im.src}')"></span>`).join('');}
 function status(t){const el=document.getElementById('scStatus');if(el)el.textContent=t;}
 function sync(){const sec=document.getElementById('showcase');if(!sec)return;sec.querySelectorAll('[data-tpl]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tpl===st.tpl)));sec.querySelectorAll('[data-fmt]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.fmt===st.fmt)));
  sec.querySelectorAll('[data-bg]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bg===st.bg)));sec.querySelectorAll('[data-sc]').forEach(i=>{i.value=st[i.dataset.sc];sec.querySelector('#sco_'+i.dataset.sc).textContent=(+st[i.dataset.sc]).toFixed(i.dataset.sc==='per'?1:2);});
  const pb=sec.querySelector('#scPlay');pb.textContent=st.playing?'Pause':'Play';sec.querySelector('#scInfo').textContent=`${T[st.tpl].name} · ${st.fmt} · ${st.items.length} images · ${loopLen().toFixed(1)} s loop`;
  cancelAnimationFrame(raf);raf=0;if(st.playing&&visible())tick();else draw(0);}
 function visible(){return location.hash.split('?')[0]==='#showcase'&&!document.hidden;}
 function draw(t){if(!cv)return;frame(ctx,cv.width,cv.height,t);}
 function tick(){const L=loopLen()||1;draw(((performance.now()-t0)/1000)%L);raf=st.playing&&visible()?requestAnimationFrame(tick):0;}
 function layout(){const wrap=document.querySelector('#showcase .scStageWrap');if(!wrap||!cv)return;const w=wrap.clientWidth,r=ratio();let cw=w,ch=w/r;const maxH=Math.min(innerHeight*.7,720);if(ch>maxH){ch=maxH;cw=ch*r;}
  cv.style.width=cw+'px';cv.style.height=ch+'px';const d=Math.min(devicePixelRatio||1,2);cv.width=Math.round(cw*d);cv.height=Math.round(ch*d);sync();}

 function exportVideo(){if(!st.items.length)return;if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream){status('This browser cannot record video. Try Chrome, Edge or Firefox.');return;}
  const type=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'].find(t=>MediaRecorder.isTypeSupported(t));if(!type){status('No supported video format in this browser.');return;}
  const r=ratio(),W=r>=1?1920:Math.round(1920*r),H=r>=1?Math.round(1920/r):1920;const c=document.createElement('canvas');c.width=W;c.height=H;c.setAttribute('aria-hidden','true');c.style.cssText='position:fixed;left:-99999px;top:0;width:'+W/4+'px;height:'+H/4+'px';document.body.append(c);const x=c.getContext('2d');
  const btn=document.getElementById('scExport');btn.disabled=true;const rec=new MediaRecorder(c.captureStream(30),{mimeType:type,videoBitsPerSecond:14e6});const chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
  const L=Math.min(loopLen(),40);rec.onstop=()=>{c.remove();btn.disabled=false;const blob=new Blob(chunks,{type});if(blob.size<2000){status('The browser did not record any frames. Try Chrome or Edge.');return;}const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`showcase-${st.tpl}-${st.fmt.replace(':','x')}.${type.includes('mp4')?'mp4':'webm'}`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),5000);status(`Saved a ${L.toFixed(1)}-second ${W} × ${H} reel.`+(st.lastFps<20?` This device drew about ${Math.round(st.lastFps)} frames a second, so motion may look choppy; close other tabs or try a square format.`:''));};
  frame(x,W,H,0);rec.start(250);const start=performance.now();let frames=0;status(`Recording ${L.toFixed(1)} seconds…`);const step=()=>{const t=(performance.now()-start)/1000;frame(x,W,H,Math.min(t,L));frames++;if(t<L)requestAnimationFrame(step);else{st.lastFps=frames/L;rec.stop();}};step();}

 function onRoute(){if(location.hash.split('?')[0]!=='#showcase'){cancelAnimationFrame(raf);raf=0;return;}shell();layout();}
 addEventListener('hashchange',onRoute);document.addEventListener('visibilitychange',()=>{if(built)sync();});
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',onRoute);else setTimeout(onRoute,0);
 window.ShowcaseReels={templates:T,drawAt:t=>draw(t)};
})();
