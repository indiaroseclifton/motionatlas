'use strict';
/* Page builder, the photo library. A small curated set of CC0 / public-domain photographs in assets/photos/ (full size 1600 px WebP,
   400 px thumbnails in assets/photos/th/), described by assets/photos/photos.json:
   {photos:[{id,title,alt,cat,tags,source,author,licence,w,h}]}. A photo is used as the image path "photos/<id>.webp".
   PB.photos.used(paths) gives the attribution records for the photos a site uses (written to assets/CREDITS.txt on export). */
(()=>{
const PB=window.PB=window.PB||{};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P=PB.photos={list:[],by:{},cats:[],ready:null,onload:[]};
const CATN={food:'Food',drink:'Drink',cafe:'Cafes and restaurants',bakery:'Bakery',hands:'Hands and craft',property:'Property',fitness:'Fitness',wedding:'Weddings',nature:'Nature',city:'City',workspace:'Workspace',podcast:'Audio',event:'Events',products:'Products',office:'Offices',tech:'Technology'};
P.catName=c=>CATN[c]||c;
P.load=()=>P.ready||(P.ready=fetch('assets/photos/photos.json').then(r=>r.ok?r.json():{photos:[]}).catch(()=>({photos:[]})).then(j=>{P.list=(j.photos||[]).filter(p=>p&&p.id);P.by=Object.fromEntries(P.list.map(p=>[p.id,p]));P.cats=[...new Set(P.list.map(p=>p.cat))];P.onload.forEach(f=>f());return P.list}));
P.path=p=>'photos/'+p.id+'.webp';
P.thumb=p=>'assets/photos/th/'+p.id+'.webp';
P.byPath=path=>{const m=/^photos\/([\w-]+)\.webp$/.exec(path||'');return m?P.by[m[1]]||null:null};
P.match=(q,cat)=>{const t=String(q||'').trim().toLowerCase();return P.list.filter(p=>(!cat||cat==='all'||p.cat===cat)&&(!t||(p.title+' '+p.cat+' '+(p.tags||[]).join(' ')+' '+P.catName(p.cat)).toLowerCase().includes(t)))};
/* attribution records for the photos among a list of asset paths */
P.used=paths=>[...new Set((paths||[]).map(x=>P.byPath(x)).filter(Boolean))].map(p=>({id:p.id,title:p.title,author:p.author||'Unknown',licence:p.licence||'CC0',source:p.source||''}));
/* the best photo for a topic: first match among tags, so templates can ask for "bakery" and get a fitting picture */
P.pick=(tag,n)=>{const l=P.list.filter(p=>p.cat===tag||(p.tags||[]).includes(tag));return l[(n||0)%Math.max(1,l.length)]||null};
PB.photosEsc=esc;
})();
