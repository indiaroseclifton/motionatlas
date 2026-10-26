'use strict';
/* Local-first store for moodboards: window.MoodStore.
   Boards live in localStorage ('atlas-moodboards-v1', small JSON); uploaded pictures live in IndexedDB
   ('atlas-moodboard' / 'img'). A board may belong to a project (board.project = project id from My projects).
   Nothing here needs an account or schema.sql. */
(()=>{
 const KEY='atlas-moodboards-v1';
 const uid=()=>(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)).replace(/[^\w-]/g,'').slice(0,40);
 let boards=null;
 const read=()=>{if(boards)return boards;try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');boards=Array.isArray(x)?x.filter(b=>b&&typeof b.id==='string'&&Array.isArray(b.items)):[]}catch{boards=[]}return boards};
 const write=()=>{try{localStorage.setItem(KEY,JSON.stringify(read()));return true}catch{return false}};
 const idb=()=>idb.p||(idb.p=new Promise((res,rej)=>{let r;try{r=indexedDB.open('atlas-moodboard',1)}catch(e){return rej(e)}r.onupgradeneeded=()=>r.result.createObjectStore('img');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));
 const tx=async(mode,fn)=>{const d=await idb();return new Promise((res,rej)=>{const t=d.transaction('img',mode),q=fn(t.objectStore('img'));t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error)})};
 const S={
  uid,
  list(){return read().slice().sort((a,b)=>(b.updated||0)-(a.updated||0))},
  get(id){return read().find(b=>b.id===id)||null},
  create({name='Untitled moodboard',project='',items=[]}={}){const b={id:uid(),name:String(name).slice(0,100),project:String(project||''),items:[],view:{x:0,y:0,k:1},updated:Date.now(),z:1};read().push(b);items.forEach(i=>S.addItem(b,i,false));write();return b},
  save(b){b.updated=Date.now();return write()},
  remove(id){boards=read().filter(b=>b.id!==id);write()},
  /* the board a "Pin" lands on: the most recently edited one, or a fresh one */
  target(){const l=S.list();return l[0]||S.create({name:'My moodboard'})},
  addItem(b,it,persist=true){b.z=(b.z||1)+1;const n=b.items.length,col=n%4,row=Math.floor(n/4);const item=Object.assign({id:uid(),x:60+col*260,y:60+row*200,w:200,h:140,rot:0},it,{z:b.z});b.items.push(item);if(persist)S.save(b);return item},
  putImage(id,blob){return tx('readwrite',s=>s.put(blob,id))},
  getImage(id){return tx('readonly',s=>s.get(id))},
  delImage(id){return tx('readwrite',s=>s.delete(id)).catch(()=>{})}
 };
 window.MoodStore=S;
})();
