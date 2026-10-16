'use strict';
/* DVExport: shared exports for the flowchart and diagram studios.
   - fontCSS(style): the style's Google fonts as embedded @font-face (so SVG, PNG and video keep their type)
   - png(svg,w,h,style): PNG blob at 2×
   - video / gif: the FlowReveal build-up, encoded in the browser (H.264 MP4 where available, else VP9 WebM) */
(()=>{
const download=(name,data,type)=>{const a=document.createElement('a'),u=URL.createObjectURL(data instanceof Blob?data:new Blob([data],{type}));a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);};
const fontCache=new Map();
function fontCSS(st){if(!st.fonts?.length)return Promise.resolve('');const key=st.id;if(fontCache.has(key))return fontCache.get(key);
 const p=(async()=>{try{const css=await fetch('https://fonts.googleapis.com/css2?'+st.fonts.map(f=>'family='+f).join('&')+'&display=swap').then(r=>r.text());
  const blocks=[...css.matchAll(/\/\*\s*latin\s*\*\/\s*@font-face\s*\{([^}]*)\}/g)].map(m=>m[1]);let out='';
  for(const b of blocks){const u=(b.match(/url\(([^)]+)\)/)||[])[1];if(!u)continue;const buf=await fetch(u).then(r=>r.arrayBuffer());let bin='';const bytes=new Uint8Array(buf);for(let i=0;i<bytes.length;i+=0x8000)bin+=String.fromCharCode.apply(null,bytes.subarray(i,i+0x8000));
   out+=`@font-face{${b.replace(/src:[^;]+;/,`src:url(data:font/woff2;base64,${btoa(bin)}) format('woff2');`)}}`;}
  return out;}catch(e){console.warn('fonts not embedded',e);return '';}})();fontCache.set(key,p);return p;}
const inject=(svg,css)=>css?(svg.includes('<defs>')?svg.replace('<defs>',`<defs><style>${css}</style>`):svg.replace(/<svg([^>]*)>/,`<svg$1><defs><style>${css}</style></defs>`)):svg;
async function svgWithFonts(svg,st){return inject(svg,await fontCSS(st));}
const loadImg=src=>new Promise((ok,no)=>{const i=new Image();i.decoding='async';i.onload=()=>ok(i);i.onerror=()=>no(new Error('frame failed'));i.src=src;});
const loadScript=(src,g)=>new Promise((ok,no)=>{if(window[g])return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(new Error('Could not load '+src));document.head.append(s);});
const vendor=new URL('../vendor/',document.currentScript?document.currentScript.src:location.href).href;
async function png(svg,w,h,st,k=2){const img=await loadImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(await svgWithFonts(svg,st)));const c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);const x=c.getContext('2d');x.scale(k,k);x.drawImage(img,0,0,w,h);return new Promise(r=>c.toBlob(r,'image/png'));}

/* frames of the build-up: o = {svgEl,width,height,style,order,speed,kind,onProgress} */
async function frames(o,onFrame,onFinal){const el=o.svgEl,st=o.style,css=await fontCSS(st);
 const fps=o.kind==='gif'?15:30,maxSide=o.kind==='gif'?960:1920,k=Math.min(2,maxSide/o.width,maxSide/o.height);const W=Math.round(o.width*k/2)*2,H=Math.round(o.height*k/2)*2;
 const P=window.FlowReveal.plan(el,{order:o.order,speed:o.speed||1});const hold=1600,total=P.duration+hold,n=Math.ceil(total/1000*fps);
 const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:o.kind==='gif'});const bg=st.t.bg.startsWith('#')?st.t.bg:'#0B0F1A';
 const draw=async svg=>{const img=await loadImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(inject(svg,css)));x.fillStyle=bg;x.fillRect(0,0,W,H);x.drawImage(img,0,0,W,H);};
 let last='';try{if(onFinal){P.apply(P.duration);await draw(el.outerHTML);await onFinal(c,x,W,H);}
  for(let i=0;i<n;i++){P.apply(Math.min(i*1000/fps,P.duration));const svg=el.outerHTML;if(svg!==last){last=svg;await draw(svg);}
   await onFrame(c,x,i,n,fps,W,H);o.onProgress&&o.onProgress((i+1)/n);}}finally{P.reset();}
 return {W,H,fps,n};}
async function video(o){if(!window.VideoEncoder)throw new Error('This browser cannot encode video; try Chrome, Edge or Safari');
 const k=Math.min(2,1920/o.width,1920/o.height),W=Math.round(o.width*k/2)*2,H=Math.round(o.height*k/2)*2;
 let codec=null,mp4=false;for(const c of ['avc1.640028','avc1.4d0028','avc1.42002a']){try{if((await VideoEncoder.isConfigSupported({codec:c,width:W,height:H,bitrate:8e6,framerate:30})).supported){codec=c;mp4=true;break;}}catch{}}
 if(!codec)codec='vp09.00.10.08';await loadScript(vendor+(mp4?'mp4-muxer.js':'webm-muxer.js'),mp4?'Mp4Muxer':'WebMMuxer');
 const muxer=mp4?new Mp4Muxer.Muxer({target:new Mp4Muxer.ArrayBufferTarget(),video:{codec:'avc',width:W,height:H},fastStart:'in-memory'}):new WebMMuxer.Muxer({target:new WebMMuxer.ArrayBufferTarget(),video:{codec:'V_VP9',width:W,height:H,frameRate:30}});
 let fail=null;const enc=new VideoEncoder({output:(ch,meta)=>muxer.addVideoChunk(ch,meta),error:e=>{fail=e;}});
 enc.configure({codec,width:W,height:H,bitrate:Math.min(12e6,Math.max(3e6,W*H*30*.12)),framerate:30,...(mp4?{avc:{format:'avc'}}:{})});
 await frames({...o,kind:'video'},async(c,x,i,n,fps)=>{if(fail)throw fail;const vf=new VideoFrame(c,{timestamp:Math.round(i*1e6/fps),duration:Math.round(1e6/fps)});enc.encode(vf,{keyFrame:i%(fps*2)===0});vf.close();if(enc.encodeQueueSize>8)await new Promise(r=>setTimeout(r,0));});
 await enc.flush();if(fail)throw fail;muxer.finalize();return {blob:new Blob([muxer.target.buffer],{type:mp4?'video/mp4':'video/webm'}),ext:mp4?'mp4':'webm'};}
async function gif(o){await loadScript(vendor+'gifenc.js','gifenc');const {GIFEncoder,quantize,applyPalette}=window.gifenc;const g=GIFEncoder();
 let palette=null,prev=null,acc=0,dims=null;const flush=()=>{if(prev)g.writeFrame(prev,dims[0],dims[1],{palette,delay:Math.round(acc)});};
 await frames({...o,kind:'gif'},async(c,x,i,n,fps,W,H)=>{dims=[W,H];const idx=applyPalette(x.getImageData(0,0,W,H).data,palette,'rgb565');
  if(prev&&prev.length===idx.length){let same=true;for(let j=0;j<idx.length;j+=7){if(idx[j]!==prev[j]){same=false;break;}}if(same){acc+=1000/fps;return;}}
  flush();prev=idx;acc=1000/fps;if(i%4===0)await new Promise(r=>setTimeout(r,0));},
  /* one palette from the finished chart, so colours hold still from frame to frame */(c,x,W,H)=>{palette=quantize(x.getImageData(0,0,W,H).data,256,{format:'rgb565'});});
 flush();g.finish();return new Blob([g.bytes()],{type:'image/gif'});}
window.DVExport={download,fontCSS,svgWithFonts,png,video,gif,frames};
})();
