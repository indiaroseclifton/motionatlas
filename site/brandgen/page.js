'use strict';
/* Brand kit, page controller. One column: the input row, then the kit as one sheet (logo, colours, fonts, in use) and the
   downloads. Inputs -> BrandGen.generate(state) -> the sections. Everything heavy (shade ramps, contrast tables, the type
   scale, the code, the guide preview, the full component preview) is drawn only when its disclosure is opened.
   Kept compatible for other pages: localStorage['brandgen-draft-v1'], the #s= share hash, localStorage['atlas-pb-brand-handoff']
   (read by builder/ux.js), the My projects record and the files in the zip. */
(()=>{
const BG=window.BrandGen,TK=window.ThemeKits,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],esc=BG.esc;
/* the Feel menu: eight plain directions, each a set of the engine's feel words */
const PRESETS=[['Warm and handmade',['warm','handmade','cosy']],['Clean and modern',['minimal','modern','trustworthy']],['Bold and loud',['bold','energetic','edgy']],['Calm and natural',['calm','natural','soft']],
 ['Quiet luxury',['premium','elegant','luxurious']],['Playful and bright',['playful','youthful','friendly']],['Technical and precise',['techy','clinical','modern']],['Classic editorial',['classic','editorial','serious']]];
const CHIPS=['bold','calm','playful','premium','minimal','warm','friendly','techy','trustworthy','natural','elegant','energetic','edgy','retro','modern','classic','soft','creative','futuristic','handmade','editorial','youthful','cosy','fresh','luxurious','serious','clinical'];
const START={name:'Saffron & Salt',desc:'A neighbourhood bakery and coffee bar with slow-fermented bread.',feels:PRESETS[0][1].slice(),seeds:{pal:2,type:0,logo:9}};
let S=BG.norm(START);
let mineMode='outline',inclFonts=false;window.__mineOpts={get mode(){return mineMode},get incl(){return inclFonts}};
let B=null,logoURL='',logoName='',hist=[],view=null,kitTimer=0,pm='light',pmSet=false,files=[];
function say(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(say.t);say.t=setTimeout(()=>t.classList.remove('on'),2200)}
const note=m=>{$('#svNote').textContent=m};
const clone=o=>JSON.parse(JSON.stringify(o));
const save=(blob,name)=>TK.save(blob,name);
const blobOf=(txt,type)=>new Blob([txt],{type:type||'text/plain'});
const copy=t=>TK.copy(t);
const slug=()=>(B.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'brand');
const MF=()=>window.MyFonts;

/* ---------- state <-> url / draft ---------- */
const enc=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const dec=s=>JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g,'+').replace(/_/g,'/')))));
const pub=()=>{const s=clone(S);delete s.ai;return s};
function shareURL(){return location.href.split('#')[0]+'#s='+enc(pub())}
function writeDraft(){try{localStorage.setItem('brandgen-draft-v1',JSON.stringify(pub()))}catch(e){}}
function readDraft(){try{const d=JSON.parse(localStorage.getItem('brandgen-draft-v1')||'null');return d&&typeof d==='object'?d:null}catch(e){return null}}
function fromHash(){const m=location.hash.match(/[#&]s=([\w-]+)/);if(!m)return null;try{return dec(m[1])}catch(e){return null}}

/* ---------- history ---------- */
function push(){hist.push(clone(S));if(hist.length>40)hist.shift();$('#undo').disabled=false}
function undo(){const p=hist.pop();if(!p)return;S=BG.norm(p);sync();run();$('#undo').disabled=!hist.length;say('Undone')}

/* ---------- inputs ---------- */
const sameSet=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));
function drawFeel(){const sel=$('#feel'),i=PRESETS.findIndex(p=>sameSet(p[1],S.feels));
 sel.innerHTML=PRESETS.map((p,n)=>`<option value="${n}">${esc(p[0])}</option>`).join('')+(i<0?`<option value="own">${S.feels.length?'Your own: '+esc(S.feels.join(', ')):'No feel chosen'}</option>`:'');
 sel.value=i<0?'own':String(i)}
function drawChips(){const all=[...new Set([...CHIPS,...S.feels])];$('#chips').innerHTML=all.map(f=>`<button class="chip" type="button" aria-pressed="${S.feels.includes(f)}" data-f="${esc(f)}">${esc(f)}</button>`).join('')}
function sync(){$('#name').value=S.name;$('#desc').value=S.desc;$('#aud').value=S.audience;$('#base').value=S.base||'#9a4a38';$('#baseTxt').value=S.base||'';
 $$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===S.mode));drawFeel();drawChips();lockUI()}
function lockUI(){[['pal','#lkPal','colours'],['type','#lkTyp','fonts'],['logo','#lkLg','logo']].forEach(([k,id,n])=>{const on=!!S.frozen[k],b=$(id),sh=$(id.replace('lk','sh'));
 b.setAttribute('aria-pressed',on);b.textContent=on?'Locked':'Lock';b.setAttribute('aria-label',on?'Locked: '+n+'. Shuffle leaves them alone':'Lock the '+n+', so Shuffle leaves them alone');sh.disabled=on;sh.setAttribute('aria-label','Shuffle the '+n)})}
let inTimer=0;
function changed(){clearTimeout(inTimer);inTimer=setTimeout(run,120)}
const fresh=()=>{S.frozen.pal=S.frozen.type=S.frozen.logo=null;S.seeds={pal:0,type:0,logo:0}};
$('#name').oninput=e=>{S.name=e.target.value;changed()};$('#desc').oninput=e=>{S.desc=e.target.value;changed()};$('#aud').oninput=e=>{S.audience=e.target.value;changed()};
/* typing is one undo step per field visit, not one per letter */
['#name','#desc','#aud'].forEach(s=>{const el=$(s);el.addEventListener('focus',()=>{el._h=JSON.stringify(S)});el.addEventListener('change',()=>{if(el._h&&el._h!==JSON.stringify(S)){hist.push(JSON.parse(el._h));$('#undo').disabled=false}})});
$('#feel').onchange=e=>{const p=PRESETS[+e.target.value];if(!p)return;push();S.feels=p[1].slice();fresh();sync();run();say(p[0])};
$('#chips').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;push();const f=b.dataset.f,i=S.feels.indexOf(f);if(i>=0)S.feels.splice(i,1);else{if(S.feels.length>=5){S.feels.shift();say('Five feel words at most: dropped the oldest')}S.feels.push(f)}fresh();sync();run();const again=$(`#chips [data-f="${CSS.escape(f)}"]`);if(again)again.focus()};
function addOwn(){const v=$('#own').value.trim().toLowerCase();if(!v)return;const k=BG.resolveFeel(v);$('#ownNote').textContent=k?(k===v?`Added “${v}”.`:`“${v}” read as “${k}”.`):`“${v}” is added, but it is not in the feel dictionary yet, so it will not change the colours or type.`;push();if(!S.feels.includes(v)){if(S.feels.length>=5)S.feels.shift();S.feels.push(v)}$('#own').value='';sync();run()}
$('#addOwn').onclick=addOwn;$('#own').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addOwn()}};
$('#base').oninput=e=>{push();S.base=e.target.value.toUpperCase();$('#baseTxt').value=S.base;S.frozen.pal=null;changed()};
$('#baseTxt').onchange=e=>{const h=BG.normHex(e.target.value);push();S.base=h;S.frozen.pal=null;sync();run()};
$('#baseClear').onclick=()=>{push();S.base='';S.frozen.pal=null;sync();run()};
$$('[data-mode]').forEach(b=>b.onclick=()=>{push();S.mode=b.dataset.mode;pmSet=false;sync();run()});
$('#shuffleAll').onclick=()=>{const free=['pal','type','logo'].filter(k=>!S.frozen[k]);if(!free.length){say('Everything is locked');return}push();free.forEach(k=>S.seeds[k]++);run();say(free.length<3?'Shuffled what is not locked':'Shuffled')};
for(const [k,sh,lk] of [['pal','#shPal','#lkPal'],['type','#shTyp','#lkTyp'],['logo','#shLg','#lkLg']]){
 $(sh).onclick=()=>{push();S.seeds[k]++;run()};
 $(lk).onclick=()=>{push();if(S.frozen[k])S.frozen[k]=null;else S.frozen[k]=k==='pal'?clone(B.pal.params):k==='type'?B.type.id:clone(B.logo);lockUI();writeDraft();say(S.frozen[k]?'Locked: shuffling leaves it alone':'Unlocked')}}
$('#undo').onclick=undo;
$('#share').onclick=async()=>{const u=shareURL();history.replaceState(null,'',u.slice(u.indexOf('#')));say(await copy(u)?'Share link copied':'Link is in the address bar')};

/* ---------- logo upload: dominant colours ---------- */
const LOGO_HINT='Optional. Its main colours are read in your browser and become the palette.';
function dominant(img){const c=document.createElement('canvas'),n=64;c.width=c.height=n;const x=c.getContext('2d',{willReadFrequently:true});const r=Math.min(n/img.width,n/img.height);x.drawImage(img,(n-img.width*r)/2,(n-img.height*r)/2,img.width*r,img.height*r);
 let d;try{d=x.getImageData(0,0,n,n).data}catch(e){return []}const bins=new Map();
 for(let i=0;i<d.length;i+=4){if(d[i+3]<200)continue;const h=BG.normHex('#'+[d[i],d[i+1],d[i+2]].map(v=>v.toString(16).padStart(2,'0')).join(''));const [L,C,H]=BG.oklch(h);if(L>.97||L<.06)continue;const k=Math.round(H/24)+'|'+Math.round(L*4)+'|'+(C>.05?1:0);const o=bins.get(k)||{n:0,r:0,g:0,b:0};o.n++;o.r+=d[i];o.g+=d[i+1];o.b+=d[i+2];bins.set(k,o)}
 const cand=[...bins.values()].map(o=>{const h=BG.normHex('#'+[o.r/o.n,o.g/o.n,o.b/o.n].map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''));const [,C,H]=BG.oklch(h);return {h,H,C,s:o.n*(.25+Math.min(C,.2)*5)}}).sort((a,b)=>b.s-a.s);
 const out=[];for(const c of cand){if(out.every(o=>BG.dE(o.h,c.h)>12))out.push(c);if(out.length>=3)break}return out.map(o=>o.h)}
$('#logoIn').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>2e6){$('#logoNote').textContent='That file is over 2 MB. Use a smaller one.';return}
 const ok=/svg|png/.test(f.type)||/\.(svg|png)$/i.test(f.name);if(!ok){$('#logoNote').textContent='Use an SVG or PNG file.';return}
 let url;if(/svg/.test(f.type)||/\.svg$/i.test(f.name)){let t=await f.text();if(!/\swidth=/.test(t.match(/<svg[^>]*>/)?.[0]||'')){const wh=(t.match(/viewBox="([^"]+)"/)||[])[1];const p=wh?wh.split(/[\s,]+/):[];t=t.replace(/<svg/,`<svg width="${p[2]||256}" height="${p[3]||256}"`)}url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(t)}
 else url=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(f)});
 const img=new Image();img.onload=()=>{const cols=dominant(img);logoURL=url;logoName=f.name;push();S.logoColors=cols;S.frozen.pal=null;$('#logoInfo').hidden=false;$('#logoSw').innerHTML=cols.map(h=>`<span class="dot" style="background:${h}" title="${h}" role="img" aria-label="Colour read from the logo, ${h}"></span>`).join('');$('#logoNote').textContent=cols.length?`Read ${cols.length} colour${cols.length>1?'s':''} from ${f.name}: ${cols.join(', ')}. The logo is used in the lockups.`:'No distinct colours found (it may be one grey). The logo is still placed in the lockups.';run()};
 img.onerror=()=>{$('#logoNote').textContent='That image could not be read.'};img.src=url};
$('#logoClear').onclick=()=>{push();logoURL='';logoName='';S.logoColors=[];S.frozen.pal=null;$('#logoIn').value='';$('#logoInfo').hidden=true;$('#logoNote').textContent=LOGO_HINT;run()};

/* ---------- font loading + measuring ---------- */
const loaded=new Set();
const redraw=()=>{if(B){renderLogo();applied()}};
function loadFonts(b){const u=BG.fontsURL(b.type),m=BG.mineFams(b);
 if(m.length&&document.fonts)Promise.all(m.map(f=>document.fonts.load(`${b.type.hw} 40px "${f}"`))).then(redraw).catch(()=>{});
 if(!u||loaded.has(u))return;loaded.add(u);const l=document.createElement('link');l.rel='stylesheet';l.href=u;document.head.append(l);
 l.onload=()=>{document.fonts&&document.fonts.load(`${b.type.hw} 40px '${b.type.head}'`).then(()=>{if(B&&B.type.head===b.type.head)redraw()}).catch(()=>{})}}
const mc=document.createElement('canvas').getContext('2d');
BG.setMeasure((t,w,fam,size)=>{try{const f=fam.split(',')[0].replace(/['"]/g,'').trim();if(document.fonts&&!document.fonts.check(`${w} ${size}px "${f}"`))return 0;mc.font=`${w} ${size}px "${f}"`;return mc.measureText(t).width}catch(e){return 0}});

/* a disclosure draws its contents when it is opened, and again on each change while it stays open */
const lazy=[];
function onOpen(id,fn){const d=$(id);lazy.push([d,fn]);d.addEventListener('toggle',()=>{if(d.open)fn()})}
const drawOpen=()=>lazy.forEach(([d,fn])=>{if(d.open)fn()});

/* ---------- logo ---------- */
function logoFiles(b){return [
 {n:'Logo on light',t:'Horizontal · light',l:'horizontal',m:'light',file:'horizontal-light.svg',big:1},{n:'Logo on dark',t:'Horizontal · dark',l:'horizontal',m:'dark',file:'horizontal-dark.svg',big:1},
 {n:'Mark',t:'Mark',k:'mark',m:'light',file:'monogram.svg'},{n:'Wordmark',t:'Wordmark · light',k:'word',m:'light',file:'wordmark.svg'},{n:'Stacked',t:'Stacked · light',l:'stacked',m:'light',file:'stacked-light.svg'},
 {t:'Stacked · dark',l:'stacked',m:'dark',file:'stacked-dark.svg',extra:1},{t:'Wordmark · dark',k:'word',m:'dark',file:'wordmark-dark.svg',extra:1}]}
const showSVG=(b,x)=>x.k==='mark'?BG.monogram(b,160,{mode:x.m}):x.k==='word'?BG.wordmark(b,x.m,{bg:false}):BG.lockup(b,x.l,x.m,{bg:false});
const fileSVG=(b,x)=>x.k==='mark'?BG.monogram(b,512,{bg:false,fonts:true}):x.k==='word'?BG.wordmark(b,x.m,{fonts:true}):BG.lockup(b,x.l,x.m,{fonts:true});
function renderLogo(){if(!B)return;const b=B;files=logoFiles(b);
 const tile=(x,i)=>{const t=b.modes[x.m];return `<figure class="tile ${x.big?'big':'sm'}" style="background:${t.bg}"><div role="img" aria-label="${esc(b.name)}, ${esc(x.n.toLowerCase())}">${showSVG(b,x).replace('<svg ','<svg aria-hidden="true" focusable="false" ')}</div><figcaption class="k" style="color:${t.mute}">${esc(x.n)}</figcaption><button class="svgb" type="button" data-svg="${i}" aria-label="Download ${esc(x.t)} as SVG">SVG</button></figure>`};
 $('#lgBox').innerHTML=`<div class="lg2">${files.slice(0,2).map((x,i)=>tile(x,i)).join('')}</div><div class="lg3">${files.slice(2,5).map((x,i)=>tile(x,i+2)).join('')}</div>`;
 $('#lgNote').innerHTML=b.logoURL?`Your logo (${esc(logoName)}) beside the name set in <b>${esc(b.type.head)}</b>. The lettered mark is the fallback for small sizes.`:`The name set in <b>${esc(b.type.head)}</b>, with a lettered mark for small sizes. Point at a version to download it as an SVG.`}
function logoDeep(){const b=B,used=BG.mineFams(b),M=MF();
 $('#lgFiles').innerHTML=`<div class="files">${files.map((x,i)=>`<button class="btn" type="button" data-svg="${i}"><span>${esc(x.t)}</span><span class="k">SVG</span></button>`).join('')}</div>
 ${used.length&&M?`<div class="f"><span class="l" id="lblMM">Text in the SVG files, for your own fonts</span><div class="seg" role="group" aria-labelledby="lblMM" style="flex-wrap:wrap"><button type="button" data-mm="outline" aria-pressed="${mineMode==='outline'}">Outlines (recommended)</button><button type="button" data-mm="embed" aria-pressed="${mineMode==='embed'}">Embed font</button><button type="button" data-mm="text" aria-pressed="${mineMode==='text'}">Font name only</button></div><small>Outlines turn the letters into shapes, so the logo needs no font. ${M.list().some(f=>used.includes(f.family)&&f.faces.some(x=>!x.hasOutlines))?'Some of your files have no TrueType outlines, so those fall back to live text. ':''}Embedding puts a copy of your font inside each SVG: only do that if your licence allows it.</small></div>`:'<p class="note">Files for light backgrounds use the dark text colour; files for dark backgrounds use the light one. Each SVG loads its font from Google Fonts.</p>'}`;
 $$('#lgFiles [data-mm]').forEach(x=>x.onclick=()=>{mineMode=x.dataset.mm;logoDeep()})}
async function withMine(fn){const M=MF(),fams=B?BG.mineFams(B):[];if(!M||!fams.length)return fn();await M.prepare(fams);BG.setMineMode(mineMode);try{return fn()}finally{BG.setMineMode('outline')}}
async function dlLogo(i){const x=files[i];if(!x)return;const s=await withMine(()=>fileSVG(B,x)),name=slug()+'-'+x.file;save(blobOf(s,'image/svg+xml'),name);say('Downloaded '+name+(BG.mineFams(B).length?(mineMode==='outline'?' (letters as outlines)':mineMode==='embed'?' (font embedded: check your licence)':' (needs your font installed)'):''))}
$('#lgBox').onclick=$('#lgFiles').onclick=e=>{const bt=e.target.closest('[data-svg]');if(bt)dlLogo(+bt.dataset.svg)};
onOpen('#lgMore',logoDeep);

/* ---------- colours ---------- */
const mode2=m=>m==='dark'?'Dark':'Light';
function plainName(hex){const [L,C,H]=BG.oklch(hex);if(C>=.035)return BG.colourName(hex);const warm=C>.004&&(H<115||H>330),cool=C>.004&&H>180&&H<300;return (warm?'Warm ':cool?'Cool ':'')+(L>.9?'white':L>.6?'grey':L>.3?'charcoal':'black')}
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function renderColours(){const b=B,t=b.modes[b.mode];
 const sw=(role,h)=>`<button class="sw" type="button" data-copy="${h}" aria-label="Copy ${role.toLowerCase()}, ${esc(plainName(h))}, ${h}"><i style="background:${h}"></i><span><span class="k">${role}</span><b>${esc(cap(plainName(h)))}</b><code>${h}</code></span></button>`;
 $('#palBox').innerHTML=`<div class="sws card">${sw('Primary',t.primary)}${sw('Secondary',t.secondary)}${sw('Accent',t.accent)}${sw('Background',t.bg)}${sw('Surface',t.surface)}${sw('Text',t.ink)}</div>`;
 const all=[...b.checks.light,...b.checks.dark],bad=all.filter(c=>!c.pass).length,ck=l=>b.checks[b.mode].find(c=>c.label===l).ratio.toFixed(1);
 $('#palNote').innerHTML=`Text on the background is <b>${ck('Text on background')}:1</b> and the label on a primary button <b>${ck('Label on primary')}:1</b>. <span class="pill ${bad?'fail':'pass'}">${bad?`${all.length-bad} of ${all.length} checks pass`:`All ${all.length} contrast checks pass AA`}</span> in light and dark. Select a colour to copy it.${b.mode==='dark'?' These are the dark colours, the main version of this kit.':''}`}
function coloursDeep(){const b=B,t=b.modes[b.mode];
 const mini=(n,h)=>`<button class="mini" type="button" data-copy="${h}" aria-label="Copy ${n.toLowerCase()} ${h}"><i style="background:${h}"></i><span><b>${n}</b><code>${h}</code></span></button>`;
 const ramps=['primary','secondary','accent','neutral'].map(n=>`<div><b>${cap(n)}</b><div class="ramp" role="group" aria-label="${n} shades">${b.ramps[n].map(([s,h])=>`<button type="button" data-copy="${h}" style="background:${h};color:${BG.best(h)}" aria-label="Copy ${n} ${s} ${h}">${s}</button>`).join('')}</div></div>`).join('');
 const modes=['light','dark'].map(m=>{const v=b.modes[m];return `<div class="mode" style="background:${v.bg};color:${v.ink};font-family:${b.type.bodyStack};border-radius:${b.radius+4}px"><p style="font:${b.type.hw} 22px/1.2 ${b.type.headStack};text-transform:${b.type.case==='upper'?'uppercase':'none'}">${esc(b.name)}</p><p style="color:${v.mute}">Muted text on the ${m} background. <span style="color:${v.primaryText};text-decoration:underline">A link</span>.</p><div class="inl"><span class="btnx" style="background:${v.primary};color:${v.onPrimary};border-radius:${b.radius}px">Primary</span><span class="btnx" style="background:${v.secondary};color:${v.onSecondary};border-radius:${b.radius}px">Secondary</span><span class="btnx" style="background:${v.accent};color:${v.onAccent};border-radius:${b.radius}px">Accent</span></div><div class="inl"><span class="pill" style="background:${v.successTint};color:${v.successText}">Success</span><span class="pill" style="background:${v.warningTint};color:${v.warningText}">Warning</span><span class="pill" style="background:${v.dangerTint};color:${v.dangerText}">Error</span></div><div style="background:${v.surface};border:1px solid ${v.line};border-radius:${b.radius}px;padding:10px;font-size:13px">Surface card, with the ${v.border} border</div></div>`}).join('');
 const rows=m=>b.checks[m].map(c=>`<tr><td>${esc(c.label)}</td><td><span class="dot" style="width:18px;height:18px;vertical-align:middle;background:${c.fg}" aria-hidden="true"></span> <span class="dot" style="width:18px;height:18px;vertical-align:middle;background:${c.bg}" aria-hidden="true"></span></td><td class="n">${c.ratio.toFixed(2)}:1</td><td>≥ ${c.min}:1 ${c.kind}</td><td><span class="pill ${c.pass?'pass':'fail'}">${c.pass?'pass':'fail'}</span></td></tr>`).join('');
 const tables=['light','dark'].map(m=>`<details class="in2"${m===b.mode?' open':''}><summary><b>${mode2(m)} mode</b>&nbsp;contrast, ${b.checks[m].filter(c=>c.pass).length} of ${b.checks[m].length} pass</summary><div class="tbl" tabindex="0" role="region" aria-label="${mode2(m)} mode contrast table"><table class="ct"><thead><tr><th scope="col">Pair</th><th scope="col">Colours</th><th scope="col">Ratio</th><th scope="col">Needs</th><th scope="col">Result</th></tr></thead><tbody>${rows(m)}</tbody></table></div></details>`).join('');
 const fixes=b.fixes.length?`<details class="in2"><summary><b>${b.fixes.length} automatic contrast fix${b.fixes.length>1?'es':''}</b></summary><ul class="fixes">${b.fixes.map(f=>`<li>${f.mode} · <b>${esc(f.tok)}</b>: ${f.from} → ${f.to}. ${esc(f.why)}.</li>`).join('')}</ul></details>`:'';
 const cv=(n,r)=>r.checks.map(c=>`<li><b>${esc(n)}:</b> <span class="pill ${c.state==='pass'?'pass':c.state==='warn'?'warn':'fail'}">${c.state}</span> ${esc(c.name)}${c.detail?': '+esc(c.detail):''}</li>`).join('');
 const SIM={protan:[[.152286,1.052583,-.204868],[.114503,.786281,.099216],[-.003882,-.048116,1.051998]],deutan:[[.367322,.860646,-.227968],[.280085,.672501,.047413],[-.01182,.04294,.968881]],tritan:[[1.255528,-.076749,-.17877],[-.078411,.930809,.147602],[.004733,.691367,.3039]]};
 const simCol=(h,k)=>{const v=[1,3,5].map(i=>{const c=parseInt(h.slice(i,i+2),16)/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});const o=SIM[k].map(r=>Math.max(0,Math.min(1,r[0]*v[0]+r[1]*v[1]+r[2]*v[2])));return '#'+o.map(c=>Math.round((c<=.0031308?12.92*c:1.055*c**(1/2.4)-.055)*255).toString(16).padStart(2,'0')).join('')};
 const L=b.modes.light,cols=[['Primary',L.primary],['Secondary',L.secondary],['Accent',L.accent],['Success',L.success],['Warning',L.warning],['Danger',L.danger]];
 $('#palDeep').innerHTML=`<p class="note">Colours chosen from your feel${b.pal.from==='base'?' and base colour':b.pal.from==='logo'?' and the colours of your logo':''}: ${/^[aeiou]/.test(b.pal.harmony)?'an':'a'} ${esc(b.pal.harmony)} family, so the secondary and accent are relatives of the primary or quiet neutrals. The primary is used for the one action that matters; the accent only for small details.</p>
 <h3 class="h3">More colours</h3><div class="minis">${mini('Muted text',t.mute)}${mini('Border',t.border)}${mini('Success',t.success)}${mini('Warning',t.warning)}${mini('Danger',t.danger)}${mini('Info',t.info)}</div>
 <h3 class="h3">Shades</h3><div class="ramps">${ramps}</div>
 <h3 class="h3">Light and dark</h3><div class="modes">${modes}</div>
 <h3 class="h3">Contrast</h3><p class="note">Text pairs need 4.5:1; buttons, borders and icons 3:1 (WCAG 2.2 AA). Colours were corrected automatically where the first draft fell short.</p>${tables}${fixes}
 <h3 class="h3">Colour-blind check <span style="font-weight:400;color:var(--mute)">(${esc(b.cvd.brand.light.source)})</span></h3><ul class="fixes plain">${cv('Brand colours, light',b.cvd.brand.light)}${cv('Brand colours, dark',b.cvd.brand.dark)}${cv('Status colours, light',b.cvd.status.light)}</ul>
 <div class="tbl" tabindex="0" role="region" aria-label="Colours as seen with colour-vision deficiency"><table class="ct"><caption class="vh">Colours as seen with colour-vision deficiency</caption><thead><tr><th scope="col">Colour</th><th scope="col">Normal</th><th scope="col">Protanopia</th><th scope="col">Deuteranopia</th><th scope="col">Tritanopia</th></tr></thead><tbody>${cols.map(([n,h])=>`<tr><th scope="row">${n}</th>${['','protan','deutan','tritan'].map(k=>`<td><span class="dot" role="img" aria-label="${n}, ${k||'normal'}, ${k?simCol(h,k):h}" style="width:36px;height:36px;border-radius:8px;background:${k?simCol(h,k):h}"></span></td>`).join('')}</tr>`).join('')}</tbody></table></div>
 <p class="note">Status colours (success, warning, danger) are chosen to stay apart for red–green colour blindness, and should always be paired with an icon or a word.</p>`}
onOpen('#palMore',coloursDeep);
document.addEventListener('click',async e=>{const c=e.target.closest('[data-copy]');if(c&&!c.closest('#kitBox'))say(await copy(c.dataset.copy)?'Copied '+c.dataset.copy:'Copy failed')});

/* ---------- fonts ---------- */
const gf=f=>'https://fonts.google.com/specimen/'+encodeURIComponent(f).replace(/%20/g,'+');
function renderFonts(){const b=B,t=b.type,up=t.case==='upper'?'uppercase':'none',mine=t.mine||{};loadFonts(b);
 const fname=(role,f,w,own)=>`<p class="fname"><span class="k">${role}</span><b>${esc(f)}</b><span class="k">${w}</span>${own?'<span class="k">your font</span>':`<a href="${gf(f)}" target="_blank" rel="noopener">Google Fonts ↗</a>`}</p>`;
 const line=b.copy.line,para=b.state.desc.trim()||line;
 $('#typBox').innerHTML=`<div class="spec card"><div>${fname('Headings',t.head,t.hw,mine.head)}<p class="big" style="font-family:${t.headStack};font-weight:${t.hw};text-transform:${up}">${esc(b.name)}</p>${line?`<p class="mid" style="font-family:${t.headStack};font-weight:${t.hw};text-transform:${up}">${esc(line)}</p>`:''}</div>
 <div>${fname('Body',t.body,'400 / 600',mine.body)}${para?`<p class="para" style="font-family:${t.bodyStack}">${esc(para)}</p>`:''}<p class="glyphs" style="font-family:${t.bodyStack}">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz<br><span style="font-weight:600">0 1 2 3 4 5 6 7 8 9 &amp; ? ! @ £ € %</span></p></div></div>`;
 $('#typNote').textContent=t.why}
function fontsDeep(){const b=B,t=b.type,up=t.case==='upper'?'uppercase':'none',alts=t.alternatives.map(id=>BG.PAIRS.find(p=>p.id===id)).filter(Boolean);
 $('#typDeep').innerHTML=`<div class="two"><div class="f"><label for="pairSel">Choose a pairing <span style="font-weight:400;color:var(--mute)">· best matches for your feel first</span></label><select class="in" id="pairSel">${alts.map(p=>`<option value="${p.id}" ${p.id===t.id?'selected':''}>${esc(p.head)} + ${esc(p.body)}</option>`).join('')}${alts.some(p=>p.id===t.id)?'':`<option value="${t.id}" selected>${esc(t.head)} + ${esc(t.body)}</option>`}</select><small>Choosing one locks the fonts, so Shuffle leaves them alone.</small></div>
 <div class="f"><span class="l">Type scale <span style="font-weight:400;color:var(--mute)">· ratio ${t.ratio} from 16px</span></span><div class="scale">${t.scale.slice().reverse().map(s=>`<div><code>${s.name}</code><code>${s.px}px</code><span style="font:${s.face==='head'?t.hw:400} ${Math.min(s.px,40)}px/${s.lh} ${s.face==='head'?t.headStack:t.bodyStack};text-transform:${s.face==='head'?up:'none'}">${esc(s.face==='head'?b.name:(b.copy.line||b.name))}</span></div>`).join('')}</div></div></div>`;
 $('#pairSel').onchange=e=>{push();S.frozen.type=e.target.value;lockUI();run()};mineUI()}
/* my fonts: choosers, and whether font files go into the downloads */
function mineSel(id,label,cur){const sel=document.createElement('select');sel.id=id;sel.className='in';sel.innerHTML='<option value="">From the pairing</option>';MF().optgroup(sel,{always:true});[...sel.options].forEach(o=>{if(o.value===(cur||''))o.setAttribute('selected','')});return `<div class="f"><label for="${id}">${label}</label>${sel.outerHTML}</div>`}
function mineUI(){const M=MF(),box=$('#mineBox');if(!M||!box)return;const cur=S.mine||{},used=BG.mineFams(B);
 box.innerHTML=`<fieldset class="mineSet"><legend>Use my own fonts</legend><p class="note">Use fonts you own for the headline and body. They stay in this browser and are never uploaded. ${esc(M.NOTICE)}</p><div class="two">${mineSel('mineHead','Headline font',cur.head)}${mineSel('mineBody','Body font',cur.body)}</div><div class="inl"><button class="btn" type="button" id="mineUp">Upload fonts</button><a class="btn" href="my-fonts.html">Manage my fonts</a></div>
 ${used.length?`<label class="check"><input type="checkbox" id="inclFonts" ${inclFonts?'checked':''}> <span>Include font files in the zip and the guide (my own copies)</span></label><p class="note">Off by default. Your licence decides whether you may hand a font file to anyone else, so leave it off for files you share. How the SVG logos carry your font is set under “All logo files”.</p>`:''}</fieldset>`;
 const ch=()=>{const h=$('#mineHead').value,b=$('#mineBody').value;if(h==='__upload_fonts'||b==='__upload_fonts'){M.openDialog();$('#mineHead').value=S.mine&&S.mine.head||'';$('#mineBody').value=S.mine&&S.mine.body||'';return}push();S.mine=h||b?{head:h,body:b}:null;run()};
 $('#mineHead').onchange=ch;$('#mineBody').onchange=ch;$('#mineUp').onclick=()=>M.openDialog();const ic=$('#inclFonts');if(ic)ic.onchange=()=>{inclFonts=ic.checked}}
if(MF()){MF().on(()=>{if(!B)return;if(S.mine&&!(MF().has(S.mine.head||'-')||MF().has(S.mine.body||'-')))S.mine=null;run()})}
onOpen('#typMore',fontsDeep);
const faceCss=()=>{const M=MF(),f=B?BG.mineFams(B):[];return M&&f.length?M.fontFaceCSSSync(f,{mode:'file'}):''};

/* ---------- in use: three applications, written only with the brand's name and the visitor's own description ---------- */
/* menu words and the button label are plain navigation, chosen by what the description says the brand is */
const KIND=[[/bakery|caf[eé]|coffee|restaurant|bistro|kitchen|\bbar\b|food|deli|pizza|\btea\b|brewery|wine/,['Menu','About','Visit'],'Find us'],
 [/software|\bapp\b|platform|saas|\bapi\b|\btool|developer|\bdata\b|cloud/,['Product','Pricing','Docs'],'Get started'],
 [/lessons?|classes|course|school|yoga|pilates|\bgym\b|fitness|training|tutor|workshop/,['Classes','About','Contact'],'Book a place'],
 [/shop|store|boutique|goods|\bbags?\b|clothing|apparel|jewel|furniture|plants?\b|flower|florist|toys?\b|handmade|candles?|ceramic/,['Shop','About','Contact'],'Shop now'],
 [/studio|agency|design|architect|photograph|consult|\blaw\b|legal|firm|account|financ|clinic|dental|therap|advis/,['Services','About','Contact'],'Get in touch']];
const kindOf=d=>{const t=String(d||'').toLowerCase(),k=KIND.find(x=>x[0].test(t));return k?{nav:k[1],cta:k[2]}:{nav:['About','Services','Contact'],cta:'Get in touch'}};
const bvars=(b,t)=>`--b-bg:${t.bg};--b-sf:${t.surface};--b-ink:${t.ink};--b-mute:${t.mute};--b-ln:${t.line};--b-p:${t.primary};--b-onp:${t.onPrimary};--b-pt:${t.primaryText};--b-r:${Math.min(b.radius,22)}px;--b-fh:${b.type.headStack};--b-fb:${b.type.bodyStack};--b-hw:${b.type.hw};--b-cs:${b.type.case==='upper'?'uppercase':'none'}`;
const svg64=inner=>`<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">${inner}</svg>`;
const markOf=(b,t)=>svg64(BG.markInner(b,64,{t}));
/* the mark on a block of the primary colour: reversed, or the uploaded logo on a small light plate */
const markOn=(b,t)=>b.logoURL?svg64(`<rect width="64" height="64" rx="14" fill="${t.bg}"/><g transform="translate(10 10) scale(.6875)">${BG.markInner(b,64,{t})}</g>`):svg64(BG.markInner(b,64,{t:{...t,primary:t.onPrimary,onPrimary:t.primary,primaryText:t.onPrimary,accent:t.onPrimary},logo:false}));
function applied(){if(!B)return;const b=B,t=b.modes[pm],c=b.copy,k=kindOf(b.state.desc),line=c.line,head=line&&line.length<=64?line:b.name,sub=head===b.name?line:'',aud=c.audLine;
 const web=`<div class="frame web" role="img" aria-label="${esc(b.name)} as a web page header"><div class="wnav"><span class="wlogo">${markOf(b,t)}<b class="hd">${esc(BG.wordText(b))}</b></span><span class="wlinks">${k.nav.map(x=>`<span>${x}</span>`).join('')}</span></div><div class="whero"><div>${aud?`<p class="eyebrow">${esc(aud)}</p>`:''}<p class="hd">${esc(head)}</p>${sub?`<p class="sub">${esc(sub)}</p>`:''}<span class="bt">${k.cta}</span></div><div class="wart${b.logoURL?' own':''}">${b.logoURL?markOf(b,t):markOn(b,t)}</div></div></div>`;
 const post=`<div class="frame post" role="img" aria-label="${esc(b.name)} as a square social post"><div>${markOn(b,t)}<p class="hd">${esc(BG.wordText(b))}</p></div></div>`;
 const cards=`<div class="cards"><div class="frame bcard" role="img" aria-label="${esc(b.name)} business card, logo side">${BG.lockup(b,'horizontal',pm,{bg:false}).replace('<svg ','<svg aria-hidden="true" focusable="false" ')}</div><div class="frame bcard back" role="img" aria-label="${esc(b.name)} business card, contact side: hello@${esc(c.domain)}"><div><p class="hd">${esc(BG.wordText(b))}</p><p class="ad">hello@${esc(c.domain)}</p></div></div></div>`;
 $('#appBox').innerHTML=`<div class="use" style="${bvars(b,t)}">${web}${post}${cards}</div>`}
$$('[data-pm]').forEach(x=>x.onclick=()=>{pm=x.dataset.pm;pmSet=true;pmUI();applied()});
const pmUI=()=>$$('[data-pm]').forEach(y=>y.setAttribute('aria-pressed',y.dataset.pm===pm));

/* ---------- code ---------- */
const TOK={css:['tokens.css','text/css'],json:['tokens.json','application/json'],tw:['tailwind.config.js','text/javascript']};
const tokText=()=>{const k=$('#tokSel').value;return k==='css'?BG.css(B,{faceCSS:inclFonts?faceCss():''}):k==='json'?BG.json(B):BG.tailwind(B)};
const showTok=()=>{$('#tokPre').textContent=tokText()};
onOpen('#tokMore',showTok);
$('#tokSel').onchange=()=>{if($('#tokMore').open)showTok()};
$('#copyTok').onclick=async()=>say(await copy(tokText())?$('#tokSel').selectedOptions[0].textContent+' copied':'Copy failed');
$('#dlTok').onclick=()=>{const n=TOK[$('#tokSel').value];save(blobOf(tokText(),n[1]),slug()+'-'+n[0]);say('Downloaded '+slug()+'-'+n[0])};

/* ---------- the kit: zip, and every component in place ---------- */
$('#kitZip').onclick=async e=>{const b=e.currentTarget;b.disabled=true;say('Packing the kit…');try{const fams=BG.mineFams(B),M=MF(),extra=[];
  if(fams.length&&M){extra.push(['FONTS-README.txt',`This kit uses your own font${fams.length>1?'s':''}: ${fams.join(', ')}.\n${inclFonts?'Copies of your font files are in fonts/ (fonts/fonts.css has the @font-face rules). Check your licence before sharing this ZIP.':'The font files are NOT included. Place your licensed files in a fonts/ folder next to the CSS and add @font-face rules (fonts/fonts.css shows the shape).'}\nThe SVG files name the font; open them where it is installed, or convert text to outlines in your design tool.\n`]);extra.push(['fonts/fonts.css',faceCss()]);if(inclFonts)for(const f of fams)for(const x of await M.exportFiles(f))extra.push([x.path,x.bytes])}
  /* same files as every theme kit; the card back is the brand's own (name and address), not the sample person */
  const list=(await TK.files(B.kit)).map(f=>f[0]==='svg/business-card-back.svg'?[f[0],BG.cardBack(B,B.mode,{fonts:true})]:f);
  save(await TK.zip(list.concat(extra)),slug()+'-theme-kit.zip');say('Downloaded '+slug()+'-theme-kit.zip')}catch(err){say('Could not build the zip: '+err.message)}finally{b.disabled=false}};
const kitOpen=()=>!$('#kitView').hidden;
function drawKit(){clearTimeout(kitTimer);kitTimer=setTimeout(()=>{if(!kitOpen())return;const k=B.kit,box=$('#kitBox');if(view){view.destroy();view=null}box.innerHTML='';box.setAttribute('aria-label',k.name+' theme kit');$('#hKit').textContent='Every component in '+B.name;
 try{view=TK.render(k,box,{say,playing:false})}catch(e){box.innerHTML='<p class="note" style="padding:16px">The component preview could not be drawn: '+esc(e.message)+'</p>'}},view?350:0)}
const topOf=el=>el.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sb-h'))||44)-12;
$('#kitOpen').onclick=()=>{$('#sheet').hidden=true;$('#kitView').hidden=false;$('#main').classList.add('kv');drawKit();$('#kitBack').focus({preventScroll:true});setTimeout(()=>scrollTo({top:topOf($('#kitView'))}),60)};
function closeKit(){if(!kitOpen())return;clearTimeout(kitTimer);if(view){view.destroy();view=null}$('#kitBox').innerHTML='';$('#kitView').hidden=true;$('#sheet').hidden=false;$('#main').classList.remove('kv');const o=$('#kitOpen');scrollTo({top:Math.max(0,topOf(o)-200)});o.focus({preventScroll:true})}
$('#kitBack').onclick=$('#kitBack2').onclick=closeKit;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&kitOpen()&&!document.querySelector('dialog[open]'))closeKit()});

/* ---------- brand guide ---------- */
const guide=forFile=>{const f=BG.mineFams(B),M=MF(),inc=f.length&&M&&(!forFile||inclFonts);return BG.guideHTML(B,{faceCSS:inc?M.fontFaceCSSSync(f,{mode:'base64'}):''})};
const guideAsync=async forFile=>{const f=BG.mineFams(B);if(!f.length)return guide(forFile);await MF().prepare(f);BG.setMineMode(mineMode==='embed'?'embed':'outline');try{return guide(forFile)}finally{BG.setMineMode('outline')}};
async function showGuide(){const f=$('#gdFrame'),html=await guideAsync(false);if(f._html===html)return;f._html=html;await new Promise(res=>{f.onload=res;f.srcdoc=html;setTimeout(res,2500)})}
async function openGuide(){const d=$('#gdMore');if(!d.open)d.open=true;await showGuide();await new Promise(r=>setTimeout(r,150))}
onOpen('#gdMore',()=>{clearTimeout(showGuide.t);showGuide.t=setTimeout(showGuide,B&&$('#gdFrame')._html?200:0)});
$('#gdHtml').onclick=async()=>{save(new Blob([await guideAsync(true)],{type:'text/html'}),slug()+'-brand-guide.html');say('Downloaded the guide'+(BG.mineFams(B).length?(inclFonts?' (your font is embedded: check your licence)':' (logos as outlines; your font is not included)'):''))};
$('#gdPrint').onclick=async()=>{await openGuide();const f=$('#gdFrame');try{f.contentWindow.focus();f.contentWindow.print()}catch(e){say('Open the downloaded HTML and print it')}};
$('#gdPng').onclick=async()=>{await openGuide();const d=$('#gdFrame').contentDocument;if(!d||!d.body){say('The guide is still loading');return}
 try{const W=1000,H=Math.ceil(d.documentElement.scrollHeight),css=[...d.querySelectorAll('style')].map(s=>s.textContent).join('\n').replace(/@import[^;]+;/g,''),bg=B.modes.light.bg;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style>${css.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</style>${new XMLSerializer().serializeToString(d.body).replace(/^<body[^>]*>/,'<div class="b" style="background:'+bg+'">').replace(/<\/body>$/,'</div>')}</div></foreignObject></svg>`;
  const img=new Image();await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)});
  const c=document.createElement('canvas');c.width=W*2;c.height=H*2;const x=c.getContext('2d');x.scale(2,2);x.fillStyle=bg;x.fillRect(0,0,W,H);x.drawImage(img,0,0);
  c.toBlob(b=>{if(!b){say('Could not make the PNG');return}save(b,slug()+'-brand-guide.png');say('Downloaded the PNG (system fonts stand in for web fonts)')},'image/png')}catch(e){say('Could not make the PNG here. Use the HTML download and print.')}};

/* ---------- My projects ---------- */
$('#saveProj').onclick=()=>{const b=B,K='atlas-projects-v1';let list=[];try{list=JSON.parse(localStorage.getItem(K)||'[]');if(!Array.isArray(list))list=[]}catch(e){list=[]}
 const origin='brand-'+slug().slice(0,40),now=Date.now(),M=b.modes[b.mode],dec0=`Brand kit: ${b.type.head} + ${b.type.body}; primary ${b.pal.brand}, secondary ${b.pal.secondary}, accent ${b.pal.accent}.`;
 const links=[{id:'brand-gen',title:'Open in the Brand kit generator',url:'brand-generator.html#s='+shareURL().split('#s=')[1],kind:'brand',text:`${b.type.head} + ${b.type.body} · primary ${b.pal.brand} · ${b.mode} first`},{id:'brand-kits',title:'Theme kits',url:'theme-kits.html',kind:'brand',text:'The forty-eight built-in kits, for comparison.'}];
 let p=list.find(x=>x&&x.origin===origin)||list.find(x=>x&&/^site-/.test(x.origin||'')&&String(x.name||'').trim().toLowerCase()===String(b.name).trim().toLowerCase());
 if(!p){p={id:(crypto.randomUUID?crypto.randomUUID():'p'+now.toString(36)),name:b.name,brief:b.copy.tagline,platform:'Website',stage:'Designing',entries:[],icons:[],references:[],decisions:dec0,notes:{},directions:[],created:now,updated:now,origin,isPublic:false,files:[],hub:{links:[]}};list.push(p)}
 p.name=b.name;p.updated=now;p.decisions=dec0;p.hub=p.hub&&typeof p.hub==='object'?p.hub:{links:[]};
 p.hub.lede=b.copy.tagline;p.hub.kitSnap={id:'',no:b.initials.slice(0,2),name:b.name,tagline:b.copy.tagline,head:b.type.headStack,body:b.type.bodyStack,css:b.type.css,t:{bg:M.bg,surface:M.surface,ink:M.ink,mute:M.mute,line:M.line,accent:M.primary,accent2:M.secondary,onAccent:M.onPrimary}};
 p.hub.links=[...links,...(p.hub.links||[]).filter(l=>!/^brand-(gen|kits)$/.test(l.id))];
 try{localStorage.setItem(K,JSON.stringify(list));const a=$('#projLink');a.hidden=false;a.href='atlas.html#projects?id='+p.id+'&view=hub';note(`Saved “${b.name}” to My projects, in this browser. Its page has a link back here.`);say('Saved to My projects')}catch(e){say('Could not save: storage is full or blocked')}};

/* ---------- site builder: a new site whose colours, fonts, corners and mark are the brand's ----------
   The builder puts `tagline` in the hero heading when it is 72 characters or fewer, and the description in the intro. */
$('#toSite').onclick=()=>{const b=B,M=b.modes[b.mode],ok=f=>/^[\w ]{2,40}$/.test(f)?f:'',line=b.copy.line||'';let mark='';try{mark='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(BG.monogram(b,64,{bg:false}))}catch(e){}
 const h={name:b.name,desc:S.desc||'',audience:S.audience||'',feels:S.feels||[],tagline:b.copy.ai?b.copy.tagline:(line.length<=72?line:''),headline:b.name,voice:b.copy.voice||[],group:b.copy.group||'',mode:b.mode,t:{bg:M.bg,surface:M.surface,ink:M.ink,primary:M.primary},head:ok(b.type.head),body:ok(b.type.body),radius:Math.min(40,b.radius),mark,at:Date.now()};
 try{localStorage.setItem('atlas-pb-brand-handoff',JSON.stringify(h));say('Opening the site builder with your brand');location.href='page-builder.html?brand=1'}catch(e){say('Could not hand off: storage is full or blocked')}};
$('#toBoard').onclick=()=>{try{if(!window.MoodPin){say('The moodboard is still loading. Try again.');return}MoodPin.pinKit(B.kit)}catch(e){say('Could not pin: storage is full or blocked')}};

/* ---------- AI wording (optional; the kit is complete without it) ---------- */
let aiOn=null;
async function aiStatus(){if(aiOn!=null)return aiOn;try{const r=await fetch('/api/ai?status',{headers:{accept:'application/json'}});const j=r.ok&&/json/.test(r.headers.get('content-type')||'')?await r.json():null;aiOn=!!(j&&j.enabled)}catch(e){aiOn=false}return aiOn}
$('#aiBtn').onclick=async()=>{note('Checking the AI…');if(!await aiStatus()){note('AI refinement is not switched on for this site yet (the server has no API key). Everything here works without it: the kit is built from your inputs, and Shuffle gives variations.');return}
 const b=B;note('Asking the AI to refine the wording…');try{const r=await fetch('/api/ai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'brand',brief:`Brand ${b.name}: ${b.state.desc}. Feel: ${b.state.feels.join(', ')}. Audience: ${b.state.audience}. Pairing: ${b.type.id} (options: ${b.type.alternatives.join(', ')}).`,catalog:[],styles:[]})});const j=await r.json().catch(()=>null);
  if(!r.ok||!j||!j.brand)throw new Error((j&&j.error)||'The AI endpoint does not support brand refinement yet.');S=BG.norm({...S,ai:j.brand});sync();run();note('Refined with AI: the wording in the guide and the kit is updated.')}catch(e){note('AI refinement is unavailable: '+e.message+' Your brand is unchanged.')}};

/* ---------- run ---------- */
function run(){try{B=BG.generate(S)}catch(e){console.error(e);return}
 B.logoURL=logoURL;writeDraft();if(!pmSet)pm=B.mode;pmUI();
 renderLogo();renderColours();renderFonts();applied();drawOpen();if(kitOpen())drawKit();lockUI();
 window.__brand=B;window.__brandState=S;document.title=`${B.name} · Brand kit generator · Visual & Motion Atlas`}
window.Brandgen={get brand(){return B},get state(){return S},setState(o){S=BG.norm(o);sync();run()},shareURL,run};

/* ---------- boot: a share link wins, then the draft kept in this browser, then the example ---------- */
const h=fromHash(),d=readDraft();if(h)S=BG.norm(h);else if(d)S=BG.norm(d);
sync();$('#undo').disabled=true;run();
addEventListener('hashchange',()=>{const x=fromHash();if(x){S=BG.norm(x);sync();run()}});
})();
