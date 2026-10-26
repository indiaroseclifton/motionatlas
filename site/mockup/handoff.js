'use strict';
/* Hand-off to the Mockup & social asset studio (mockup-studio.html).
   Studios call MockupHandoff.send({blob|html, title, from}) and the studio opens with that picture
   (or captures that page). The payload sits in IndexedDB, so large PNGs never hit localStorage limits;
   a small localStorage note is the fallback when IndexedDB is unavailable (private windows). */
(()=>{
 const DB='atlas-handoff',STORE='kv',KEY='mockup';
 const open=()=>new Promise((res,rej)=>{let r;try{r=indexedDB.open(DB,1)}catch(e){return rej(e)}r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
 async function put(v){const d=await open();return new Promise((res,rej)=>{const t=d.transaction(STORE,'readwrite');t.objectStore(STORE).put(v,KEY);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})}
 async function take(){const d=await open();return new Promise((res,rej)=>{const t=d.transaction(STORE,'readwrite'),s=t.objectStore(STORE),q=s.get(KEY);q.onsuccess=()=>{s.delete(KEY)};t.oncomplete=()=>res(q.result||null);t.onerror=()=>rej(t.error)})}
 const blobToURL=b=>new Promise((res,rej)=>{const f=new FileReader();f.onload=()=>res(f.result);f.onerror=()=>rej(f.error);f.readAsDataURL(b)});
 async function send(p,{go=true}={}){
  const v={blob:p.blob||null,html:typeof p.html==='string'?p.html:'',title:String(p.title||'').slice(0,120),from:String(p.from||'').slice(0,40),at:Date.now()};
  try{await put(v)}catch{ /* fallback: a data URL in localStorage (small images only) */
   const note={title:v.title,from:v.from,html:v.html.length<1.5e6?v.html:'',url:v.blob&&v.blob.size<2.5e6?await blobToURL(v.blob):''};
   try{localStorage.setItem('atlas-mockup-handoff',JSON.stringify(note))}catch{throw Error('This browser could not hand the image over. Download it and drop it into the Mockup studio.')}}
  if(go)location.href=new URL('mockup-studio.html?from='+encodeURIComponent(v.from||'handoff'),location.href).href;
 }
 async function receive(){
  try{const v=await take();if(v)return v}catch{}
  try{const s=localStorage.getItem('atlas-mockup-handoff');if(s){localStorage.removeItem('atlas-mockup-handoff');const n=JSON.parse(s);let blob=null;if(n.url){blob=await (await fetch(n.url)).blob()}return {blob,html:n.html||'',title:n.title||'',from:n.from||''}}}catch{}
  return null;
 }
 window.MockupHandoff={send,receive};
})();
