'use strict';
/* Page builder, per-item settings. A schema (groups of typed fields) describes everything you can change about a UI component or an
   interaction; values live in blk.cfg (look and behaviour), blk.set (section background, frame, spacing) and blk.vals (words).
   PB.cfg.schema(blk) builds the schema, PB.cfg.panel(blk, host) draws the "Selected item" form, PB.cfg.compStyle / applyContent
   turn the values into CSS and markup for the preview and the export. */
(()=>{
const PB=window.PB=window.PB||{};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CFG=PB.cfg={};
const TOK={accent:'var(--accent)',ink:'var(--ink)',mute:'var(--mute)',surface:'var(--surface)',bg:'var(--bg)',line:'var(--line)'};
const TOKN=[['','Theme default'],['tok:accent','Accent'],['tok:ink','Text'],['tok:surface','Panel'],['tok:bg','Page'],['custom','Custom colour…']];
/* a colour setting is '', 'tok:<name>' or '#rrggbb' */
CFG.colour=v=>!v?'':/^tok:/.test(v)?(TOK[v.slice(4)]||''):/^#[0-9a-f]{6}$/i.test(v)?v:'';
CFG.onColour=v=>/^#[0-9a-f]{6}$/i.test(v||'')&&PB.color?PB.color.best(v):(v==='tok:accent'?'var(--on-accent)':v==='tok:ink'?'var(--bg)':'var(--bg)');
const clamp=(v,a,b,d)=>{v=+v;return Number.isFinite(v)?Math.max(a,Math.min(b,v)):d};

/* ---------- component content: every visible word, picture and link can be changed ---------- */
function walk(root,fn){const w=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){if(n.nodeType===3){if(n.parentElement&&/^(SCRIPT|STYLE)$/.test(n.parentElement.tagName))continue;const t=n.nodeValue.trim();if(t)fn({text:n,value:t})}else{const e=n;
  ['placeholder','aria-label','title','alt'].forEach(a=>{const v=e.getAttribute(a);if(v&&v.trim()&&!/^(true|false)$/.test(v))fn({el:e,attr:a,value:v.trim()})});
  if(e.tagName==='IMG'&&e.getAttribute('src'))fn({el:e,attr:'src',value:e.getAttribute('src'),img:1});
  if(e.tagName==='A'&&e.getAttribute('href')&&e.getAttribute('href')!=='#')fn({el:e,attr:'href',value:e.getAttribute('href'),link:1})}}}
CFG.extract=html=>{const t=document.createElement('template');t.innerHTML=html;const o={texts:[],attrs:[],imgs:[],links:[]},seen=new Set();
 walk(t.content,x=>{const k=(x.attr||'t')+'|'+x.value;if(seen.has(k))return;seen.add(k);if(x.text)o.texts.push(x.value);else if(x.img)o.imgs.push(x.value);else if(x.link)o.links.push(x.value);else o.attrs.push({attr:x.attr,value:x.value})});return o};
CFG.applyContent=(html,cfg)=>{if(!cfg||!(cfg.tx||cfg.at||cfg.im||cfg.ln))return html;const t=document.createElement('template');t.innerHTML=html;const tx=cfg.tx||{},at=cfg.at||{},im=cfg.im||{},ln=cfg.ln||{};
 walk(t.content,x=>{if(x.text){const r=tx[x.value];if(r!==undefined)x.text.nodeValue=x.text.nodeValue.replace(x.value,r)}
  else if(x.img){const r=im[x.value];if(r)x.el.setAttribute('src',r)}else if(x.link){const r=ln[x.value];if(r!==undefined&&PB.app)x.el.setAttribute('href',r)}
  else{const r=at[x.attr+'|'+x.value];if(r!==undefined)x.el.setAttribute(x.attr,r)}});
 const d=document.createElement('div');d.appendChild(t.content);return d.innerHTML};

/* ---------- component look: CSS variables of the component lab, size, width ---------- */
CFG.compStyle=cfg=>{cfg=cfg||{};const v=[],a=CFG.colour(cfg.ac),k=CFG.colour(cfg.tc),sf=CFG.colour(cfg.sf);
 if(a){v.push('--cl-accent:'+a,'--cl-on-accent:'+CFG.onColour(cfg.ac))}
 if(k)v.push('--cl-text:'+k,'--cl-muted:color-mix(in srgb,'+k+' 62%,transparent)');
 if(sf)v.push('--cl-surface:'+sf);
 if(cfg.cr!=null&&cfg.cr!=='')v.push('--cl-radius:'+clamp(cfg.cr,0,40,12)+'px','--cl-radius-sm:'+Math.round(clamp(cfg.cr,0,40,12)*.8)+'px');
 if(cfg.bw!=null&&cfg.bw!=='')v.push('--cl-bw:'+clamp(cfg.bw,0,4,1)+'px');
 if(cfg.csh==='none')v.push('--cl-shadow:none');else if(cfg.csh==='soft')v.push('--cl-shadow:0 8px 24px -14px rgba(0,0,0,.35)');else if(cfg.csh==='lifted')v.push('--cl-shadow:0 22px 50px -22px rgba(0,0,0,.55)');
 if(cfg.wt)v.push('--cl-weight:'+clamp(cfg.wt,400,800,600));
 if(cfg.sc&&+cfg.sc!==100)v.push('zoom:'+(clamp(cfg.sc,50,200,100)/100));
 const W={narrow:'360px',medium:'560px',wide:'820px',full:'100%'};if(W[cfg.w])v.push('width:100%','max-width:'+W[cfg.w]);
 return v.join(';')};

/* ---------- presets: one-click looks ---------- */
CFG.compPresets=[['default','Default',{}],['minimal','Minimal',{cr:4,bw:1,csh:'none',wt:500}],['soft','Soft',{cr:20,bw:1,csh:'soft',wt:600}],['bold','Bold',{cr:6,bw:2,csh:'lifted',wt:700}],['sharp','Sharp',{cr:0,bw:1,csh:'none',wt:600}]];
CFG.ixPresets=[['default','Default',{}],['calm','Calm',{sp:60,calm:1,hint:0}],['lively','Lively',{sp:140}],['framed','Framed',{},{rd:20,bd:'thin',sh:'soft'}],['bare','Bare',{hint:0},{bg:'none'}]];

/* ---------- schemas ---------- */
const OPT=(a)=>a.map(x=>Array.isArray(x)?x:[x,x]);
const SETFIELDS=(frame)=>[
 {k:'bg',store:'set',type:'select',label:'Background',help:'Transparent lets the page show through, so the item blends in. “Match the section above” makes seams disappear.',options:PB.sec&&PB.sec.BG||[],def:'',redraw:1},
 {k:'bgc',store:'set',type:'colour',label:'Background colour',custom:1,show:b=>(b.set||{}).bg==='custom',def:''},
 {k:'match',store:'set',type:'toggle',label:'Match the section above',help:'Uses the same background as the section above, with less space between them.',def:0},
 {k:'bd',store:'set',type:'select',label:frame?'Frame line':'Border',options:PB.sec&&PB.sec.BORDER||[],def:''},
 {k:'sh',store:'set',type:'select',label:frame?'Frame shadow':'Shadow',options:PB.sec&&PB.sec.SHADOW||[],def:''},
 {k:'rd',store:'set',type:'range',label:frame?'Frame corners':'Corners',min:0,max:60,step:2,unit:'px',def:'',emptyLabel:'As designed'}];
const SPACE=[
 {k:'pad',store:'set',type:'select',label:'Space above and below',options:PB.sec&&PB.sec.SPACING||[],def:'default'},
 {k:'pd',store:'set',type:'range',label:'Exact space (px)',min:0,max:240,step:4,unit:'px',def:'',emptyLabel:'Use the setting above'},
 {k:'width',store:'set',type:'select',label:'Section width',options:PB.sec&&PB.sec.WIDTH||[],def:'default'},
 {k:'align',store:'set',type:'select',label:'Text alignment',options:PB.sec&&PB.sec.ALIGN||[],def:''}];
const HEAD=[{k:'kicker',store:'vals',type:'text',label:'Small label above',def:''},{k:'heading',store:'vals',type:'text',label:'Heading',def:''},{k:'intro',store:'vals',type:'long',label:'Intro text',def:''}];

function compSchema(blk){const L=PB.src.CL(),vals=PB.app.vals(blk),c=L&&(L.components.find(x=>x.id===vals.cid)||L.components[0]);if(!c)return null;
 const variant=c.v.some(x=>x[0]===vals.variant)?vals.variant:c.v[0][0],html=PB.cfg.applyContent(PB.componentHTML(c,variant,'p'),{}),ex=CFG.extract(html),g=[];
 g.push({id:'content',label:'Content',open:1,fields:[...HEAD,{k:'variant',store:'vals',type:'select',label:'State',help:'The look the component shows: normal, hover, error, disabled and so on.',options:c.v.map(([k,l])=>[k,l]),def:c.v[0][0]}]});
 const words=[...ex.texts.map(t=>({store:'tx',key:t,type:t.length>60?'long':'text',label:'Text',orig:t})),...ex.attrs.map(a=>({store:'at',key:a.attr+'|'+a.value,type:'text',label:({placeholder:'Placeholder',['aria-label']:'Screen reader label',title:'Tooltip',alt:'Image description'})[a.attr]||a.attr,orig:a.value}))];
 if(words.length)g.push({id:'words',label:'Words in the component ('+words.length+')',fields:words.slice(0,80).map(f=>({...f,def:f.orig}))});
 if(ex.imgs.length)g.push({id:'images',label:'Pictures',fields:ex.imgs.map(s=>({store:'im',key:s,type:'image',label:'Picture',orig:s,def:''}))});
 if(ex.links.length)g.push({id:'links',label:'Links',fields:ex.links.map(h=>({store:'ln',key:h,type:'link',label:'Link ('+h.slice(0,28)+')',orig:h,def:h}))});
 g.push({id:'layout',label:'Layout',fields:[
  {k:'layout',store:'vals',type:'select',label:'Sits',options:[['plain','On the page, no box'],['card','In a card'],['wide','In a full-width card']],def:'card'},
  {k:'sc',store:'cfg',type:'range',label:'Size',min:60,max:180,step:5,unit:'%',def:100,help:'Scales the whole component.'},
  {k:'w',store:'cfg',type:'select',label:'Width',options:[['','Natural'],['narrow','Narrow (360 px)'],['medium','Medium (560 px)'],['wide','Wide (820 px)'],['full','Fill the space']],def:''},
  {k:'al',store:'cfg',type:'select',label:'Position',options:[['','Centre'],['start','Left'],['end','Right']],def:''},...SPACE.slice(0,2)]});
 g.push({id:'style',label:'Style',fields:[
  {k:'ac',store:'cfg',type:'colour',label:'Accent colour',def:''},{k:'tc',store:'cfg',type:'colour',label:'Text colour',def:''},{k:'sf',store:'cfg',type:'colour',label:'Panel colour',def:''},
  {k:'cr',store:'cfg',type:'range',label:'Component corners',min:0,max:40,step:2,unit:'px',def:'',emptyLabel:'As the page style'},
  {k:'bw',store:'cfg',type:'range',label:'Line thickness',min:0,max:4,step:1,unit:'px',def:'',emptyLabel:'As the page style'},
  {k:'csh',store:'cfg',type:'select',label:'Shadow',options:[['','As the page style'],['none','None'],['soft','Soft'],['lifted','Lifted']],def:''},
  {k:'wt',store:'cfg',type:'select',label:'Text weight',options:[['','As the page style'],['500','Regular'],['600','Medium'],['700','Bold']],def:''}]});
 g.push({id:'bg',label:'Background and frame',fields:SETFIELDS(true)});
 g.push({id:'behaviour',label:'Behaviour',fields:[
  ...(c.live?[{k:'st',store:'cfg',type:'toggle',label:'Show it still (no interaction)',help:'Turns off the component’s own behaviour, so it stays as drawn.',def:0}]:[]),
  {k:'calm',store:'cfg',type:'toggle',label:'Calm motion',help:'Removes animation and transitions from this component.',def:0}]});
 g.push({id:'adv',label:'Advanced',fields:[{k:'id',store:'cfg',type:'text',label:'Link anchor name',help:'Lets a menu link jump here, for example #pricing.',def:'',pattern:'[A-Za-z][\\w-]*'},...SPACE.slice(2)]});
 return {title:c.name,badge:c.id+' · UI component',desc:(c.a11y&&c.a11y.notes)||'A live component from the UI lab, themed by your page style.',groups:g,presets:CFG.compPresets,kind:'comp'}}

CFG.schema=blk=>{if(blk.id==='x-component')return compSchema(blk);if(blk.id==='x-interaction'&&CFG.ixSchema)return CFG.ixSchema(blk);return null};
CFG.has=blk=>!!(blk&&(blk.id==='x-component'||blk.id==='x-interaction'));

/* ---------- reading and writing values ---------- */
function read(blk,f){const A=PB.app;
 if(f.store==='vals'){const v=A.val(blk,f.k);return v===''&&f.def!=null?f.def:v}
 if(f.store==='set')return (blk.set||{})[f.k]!=null?blk.set[f.k]:f.def;
 if(f.store==='cfg')return (blk.cfg||{})[f.k]!=null?blk.cfg[f.k]:f.def;
 const m=(blk.cfg||{})[f.store];return m&&m[f.key]!==undefined?m[f.key]:f.def}
function write(blk,f,v){const empty=v===''||v==null||v===false||v===0&&f.type==='toggle'||(f.type!=='toggle'&&v===f.def&&f.store!=='vals'&&f.def!=='');
 if(f.store==='vals'){blk.vals[f.k]=v;return}
 if(f.store==='set'){blk.set=blk.set||{};if(empty||v==='default')delete blk.set[f.k];else blk.set[f.k]=v;if(!Object.keys(blk.set).length)delete blk.set;return}
 blk.cfg=blk.cfg||{};
 if(f.store==='cfg'){if(empty)delete blk.cfg[f.k];else blk.cfg[f.k]=v}
 else{const m=blk.cfg[f.store]=blk.cfg[f.store]||{};if(v===f.orig||v===''&&f.store!=='tx'&&f.store!=='at'||(f.store==='im'&&!v))delete m[f.key];else m[f.key]=v;if(!Object.keys(m).length)delete blk.cfg[f.store]}
 if(!Object.keys(blk.cfg).length)delete blk.cfg}

/* ---------- the panel ---------- */
let uidc=0;
CFG.panel=(blk,onChange)=>{const A=PB.app,sch=CFG.schema(blk);const root=document.createElement('div');root.className='cfgp';if(!sch){root.innerHTML='<p class="hint">This item has no settings yet.</p>';return root}
 const idp='cf'+(++uidc);
 const head=document.createElement('div');head.className='cfgh';head.innerHTML=`<span class="cfgi" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${sch.kind==='ix'?'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z':'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'}"/></svg></span><div><b>${esc(sch.title)}</b><span class="cfgb">${esc(sch.badge)}</span></div>`;
 const note=document.createElement('p');note.className='hint cfgd';note.textContent=sch.desc;
 const bar=document.createElement('div');bar.className='cfgbar';
 const search=document.createElement('input');search.type='search';search.className='cfgs';search.placeholder='Search these settings';search.setAttribute('aria-label','Search these settings');
 const pre=document.createElement('div');pre.className='gchips cfgpre';pre.setAttribute('role','group');pre.setAttribute('aria-label','Looks');
 (sch.presets||[]).forEach(([k,l,cfg,set])=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=l;b.title='Apply the “'+l+'” look';b.onclick=()=>{blk.cfg=blk.cfg||{};const keys=new Set();(sch.presets||[]).forEach(p=>Object.keys(p[2]||{}).forEach(x=>keys.add(x)));keys.forEach(x=>delete blk.cfg[x]);Object.assign(blk.cfg,cfg);if(set){blk.set=Object.assign(blk.set||{},set)}else if(k==='default'){['rd','bd','sh'].forEach(x=>blk.set&&delete blk.set[x])}
  if(!Object.keys(blk.cfg).length)delete blk.cfg;if(blk.set&&!Object.keys(blk.set).length)delete blk.set;A.commit();A.render();draw();A.say('Look: '+l)};pre.append(b)});
 const acts=document.createElement('div');acts.className='btools';
 const mkb=(t,fn,title)=>{const b=document.createElement('button');b.type='button';b.className='btn small';b.textContent=t;if(title)b.title=title;b.onclick=fn;acts.append(b);return b};
 mkb('Reset to defaults',()=>{const keep={cid:blk.vals.cid,iid:blk.vals.iid};delete blk.cfg;delete blk.set;['variant','layout','kicker','heading','intro','height','bleed'].forEach(k=>delete blk.vals[k]);Object.entries(keep).forEach(([k,v])=>{if(v)blk.vals[k]=v});A.commit();A.render();A.outline();A.say('Back to the defaults. Undo brings your settings back.')},'Put every setting of this item back to how it was when you added it');
 mkb('Copy settings',()=>{try{localStorage.setItem('atlas-pb-cfg-clip',JSON.stringify({id:blk.id,cfg:blk.cfg||{},set:blk.set||{}}))}catch(e){}A.say('Settings copied. Select another '+(blk.id==='x-component'?'component':'interaction')+' and press Paste settings.')},'Copy this item’s look and behaviour');
 mkb('Paste settings',()=>{let c=null;try{c=JSON.parse(localStorage.getItem('atlas-pb-cfg-clip'))}catch(e){}if(!c||c.id!==blk.id)return A.say('Nothing to paste: copy settings from another '+(blk.id==='x-component'?'component':'interaction')+' first.');
  const keep=['tx','at','im','ln'];const nc=Object.assign({},c.cfg);keep.forEach(k=>delete nc[k]);blk.cfg=Object.assign({},(blk.cfg||{}),nc);blk.set=Object.assign({},blk.set||{},c.set);A.commit();A.render();draw();A.say('Settings pasted')},'Paste the look and behaviour copied from another item of this kind');
 const body=document.createElement('div');body.className='cfgg';
 root.append(head,note,bar,body);bar.append(search,pre,acts);
 const fieldEl=(f,gid)=>{const w=document.createElement('div');w.className='f cfgf';w.dataset.label=(f.label+' '+(f.orig||'')+' '+(f.help||'')).toLowerCase();const id=idp+'-'+(++uidc);const cur=read(blk,f);
  const lab=document.createElement('label');lab.htmlFor=id;lab.textContent=f.label;let inp;const commitV=(v,live)=>{write(blk,f,v);if(live)A.commitSoon();else A.commit();A.render();if(f.redraw)draw();if(onChange)onChange()};
  if(f.type==='toggle'){w.className='cfgf check cfgt';inp=document.createElement('input');inp.type='checkbox';inp.id=id;inp.checked=!!(+cur);inp.onchange=()=>commitV(inp.checked?1:0);const l=document.createElement('label');l.htmlFor=id;l.textContent=f.label;w.append(inp,l)}
  else if(f.type==='select'){inp=document.createElement('select');inp.id=id;OPT(f.options||[]).forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;inp.append(o)});inp.value=String(cur==null?'':cur);if(inp.value!==String(cur==null?'':cur)&&inp.options.length)inp.value=inp.options[0].value;inp.onchange=()=>commitV(inp.value);w.append(lab,inp)}
  else if(f.type==='range'){const row=document.createElement('div');row.className='cfgr';inp=document.createElement('input');inp.type='range';inp.id=id;inp.min=f.min;inp.max=f.max;inp.step=f.step||1;const isSet=cur!==''&&cur!=null;inp.value=isSet?cur:(f.def!==''&&f.def!=null?f.def:f.min);const out=document.createElement('output');out.htmlFor=id;const show=()=>{const has=(read(blk,f)!==''&&read(blk,f)!=null);out.textContent=has?inp.value+(f.unit||''):(f.emptyLabel||inp.value+(f.unit||''))};show();
   inp.oninput=()=>{write(blk,f,inp.value);out.textContent=inp.value+(f.unit||'');A.commitSoon();A.render()};inp.onchange=()=>{A.commit()};
   const rs=document.createElement('button');rs.type='button';rs.className='ib cfgx';rs.textContent='↺';rs.title='Reset '+f.label;rs.setAttribute('aria-label','Reset '+f.label);rs.onclick=()=>{write(blk,f,f.def===''?'':f.def);inp.value=f.def!==''&&f.def!=null?f.def:f.min;show();A.commit();A.render()};row.append(inp,out,rs);lab.append('');w.append(lab,row)}
  else if(f.type==='colour'){const row=document.createElement('div');row.className='cfgc';const sel=document.createElement('select');sel.id=id;sel.setAttribute('aria-label',f.label);const col=document.createElement('input');col.type='color';col.setAttribute('aria-label',f.label+' custom colour');
   const opts=f.custom?[['','None'],['custom','Pick a colour']]:TOKN;opts.forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;sel.append(o)});
   const isHex=/^#[0-9a-f]{6}$/i.test(cur||'');sel.value=isHex?'custom':(cur||'');if(!sel.value&&cur)sel.value='';col.value=isHex?cur:'#888888';col.hidden=!(isHex||f.custom&&sel.value==='custom');
   sel.onchange=()=>{if(sel.value==='custom'){col.hidden=false;commitV(col.value)}else{col.hidden=true;commitV(sel.value)}};col.oninput=()=>{write(blk,f,col.value);A.commitSoon();A.render()};col.onchange=()=>A.commit();row.append(sel,col);w.append(lab,row)}
  else if(f.type==='long'){inp=document.createElement('textarea');inp.id=id;inp.rows=3;inp.value=cur==null?'':cur;inp.oninput=()=>commitV(inp.value,1);w.append(lab,inp)}
  else if(f.type==='image'){const row=document.createElement('div');row.className='cfgimg';const im=document.createElement('img');im.alt='';im.width=44;im.height=44;im.src=(cur&&/^user:/.test(cur)?PB.images.url(cur.slice(5)):(cur?(/^(https?:|data:)/.test(cur)?cur:'assets/'+cur):f.orig))||'';
   inp=document.createElement('input');inp.id=id;inp.setAttribute('list','pbImages');inp.placeholder='Pick a library image or paste a web address';inp.value=cur&&cur!==f.orig?cur:'';inp.onchange=()=>{commitV(inp.value.trim())};const up=document.createElement('button');up.type='button';up.className='btn small';up.textContent='Upload';const fi=document.createElement('input');fi.type='file';fi.accept='image/*';fi.hidden=true;fi.setAttribute('aria-label','Choose an image file');up.onclick=()=>fi.click();fi.onchange=async()=>{if(fi.files[0]){try{const i=await PB.images.add(fi.files[0]);commitV('user:'+i);draw()}catch(e){A.say('Could not keep that image. Try a smaller JPG, PNG or WebP.')}}};row.append(im,inp,up,fi);w.append(lab,row)}
  else{inp=document.createElement('input');inp.id=id;inp.value=cur==null?'':cur;if(f.type==='link'){inp.placeholder='https://…, #section or a page'}if(f.pattern){inp.pattern=f.pattern}inp.oninput=()=>commitV(inp.value,1);w.append(lab,inp)}
  if(f.help){const h=document.createElement('p');h.className='hint';h.id=id+'-h';h.textContent=f.help;w.append(h);const t=w.querySelector('input:not([type=checkbox]),select,textarea');if(t)t.setAttribute('aria-describedby',h.id);else if(inp)inp.setAttribute('aria-describedby',h.id)}
  return w};
 function draw(){const sc=body.scrollTop;const openState={};body.querySelectorAll('details.cfgd2').forEach(d=>openState[d.dataset.g]=d.open);body.innerHTML='';
  const s2=CFG.schema(blk);if(!s2)return;
  s2.groups.forEach(gr=>{const fs=gr.fields.filter(f=>!f.show||f.show(blk));if(!fs.length)return;const det=document.createElement('details');det.className='cfgd2';det.dataset.g=gr.id;det.open=openState[gr.id]!=null?openState[gr.id]:!!gr.open;const sm=document.createElement('summary');sm.textContent=gr.label;det.append(sm);const gb=document.createElement('div');gb.className='cfgb2';fs.forEach(f=>gb.append(fieldEl(f,gr.id)));det.append(gb);body.append(det)});
  filter();body.scrollTop=sc}
 function filter(){const t=search.value.trim().toLowerCase();body.querySelectorAll('details.cfgd2').forEach(d=>{let any=0;d.querySelectorAll('.cfgf').forEach(f=>{const m=!t||f.dataset.label.includes(t);f.hidden=!m;if(m)any++});d.hidden=!any;if(t&&any)d.open=true})}
 search.oninput=filter;draw();return root};
})();
