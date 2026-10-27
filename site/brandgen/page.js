'use strict';
/* Brand kit generator, page controller: inputs -> BrandGen.generate -> sections. */
(()=>{
const BG=window.BrandGen,TK=window.ThemeKits,$=s=>document.querySelector(s),esc=BG.esc;
const CHIPS=['bold','calm','playful','premium','minimal','warm','friendly','techy','trustworthy','natural','elegant','energetic','edgy','retro','modern','classic','soft','creative','futuristic','handmade','editorial','youthful','cosy','fresh'];
let S=BG.norm({name:'Saffron & Salt',desc:'A neighbourhood bakery and coffee bar with slow-fermented bread.',feels:['warm','friendly','cosy']});
let B=null,logoURL='',logoName='',hist=[],tokTab='css',view=null,kitTimer=0,kitKey='';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function say(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(say.t);say.t=setTimeout(()=>t.classList.remove('on'),2200)}
const clone=o=>JSON.parse(JSON.stringify(o));
const save=(blob,name)=>TK.save(blob,name);
const blobOf=(txt,type)=>new Blob([txt],{type:type||'text/plain'});
async function copy(t){return TK.copy(t)}

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
function drawChips(){const all=[...new Set([...CHIPS,...S.feels])];$('#chips').innerHTML=all.map(f=>`<button class="chip" type="button" aria-pressed="${S.feels.includes(f)}" data-f="${esc(f)}">${esc(f)}</button>`).join('')}
function sync(){$('#name').value=S.name;$('#desc').value=S.desc;$('#aud').value=S.audience;$('#base').value=S.base||'#9a4a38';$('#baseTxt').value=S.base||'';
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===S.mode));drawChips();lockUI()}
function lockUI(){[['pal','#lkPal','palette'],['type','#lkTyp','type'],['logo','#lkLg','logo']].forEach(([k,id,n])=>{const on=!!S.frozen[k],b=$(id);b.setAttribute('aria-pressed',on);b.textContent=(on?'Locked: ':'Lock ')+n;const sh=$(id.replace('lk','sh'));sh.disabled=on})}
let inTimer=0;
function changed(record){if(record)push();clearTimeout(inTimer);inTimer=setTimeout(run,120)}
$('#name').oninput=e=>{S.name=e.target.value;changed(false)};$('#desc').oninput=e=>{S.desc=e.target.value;changed(false)};$('#aud').oninput=e=>{S.audience=e.target.value;changed(false)};
['#name','#desc','#aud'].forEach(s=>$(s).addEventListener('focus',()=>{$(s)._h=JSON.stringify(S)}));['#name','#desc','#aud'].forEach(s=>$(s).addEventListener('change',()=>{if($(s)._h&&$(s)._h!==JSON.stringify(S)){const o=JSON.parse($(s)._h);hist.push(o);$('#undo').disabled=false}}));
$('#chips').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;push();const f=b.dataset.f,i=S.feels.indexOf(f);if(i>=0)S.feels.splice(i,1);else{if(S.feels.length>=5){S.feels.shift();say('Five feel words at most: dropped the oldest')}S.feels.push(f)}S.frozen.pal=S.frozen.type=null;S.frozen.logo=null;S.seeds={pal:0,type:0,logo:0};sync();run()};
function addOwn(){const v=$('#own').value.trim().toLowerCase();if(!v)return;const k=BG.resolveFeel(v);$('#ownNote').textContent=k?(k===v?`Added “${v}”.`:`“${v}” read as “${k}”.`):`“${v}” is added, but it is not in the feel dictionary yet, so it will not change the colours or type.`;push();if(!S.feels.includes(v)){if(S.feels.length>=5)S.feels.shift();S.feels.push(v)}$('#own').value='';sync();run()}
$('#addOwn').onclick=addOwn;$('#own').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addOwn()}};
$('#base').oninput=e=>{push();S.base=e.target.value.toUpperCase();$('#baseTxt').value=S.base;S.frozen.pal=null;changed(false)};
$('#baseTxt').onchange=e=>{const h=BG.normHex(e.target.value);push();S.base=h;S.frozen.pal=null;sync();run()};
$('#baseClear').onclick=()=>{push();S.base='';S.frozen.pal=null;sync();run()};
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{push();S.mode=b.dataset.mode;sync();run()});
$('#shuffleAll').onclick=()=>{push();['pal','type','logo'].forEach(k=>{if(!S.frozen[k])S.seeds[k]++});run()};
for(const [k,sh,lk] of [['pal','#shPal','#lkPal'],['type','#shTyp','#lkTyp'],['logo','#shLg','#lkLg']]){
 $(sh).onclick=()=>{push();S.seeds[k]++;run()};
 $(lk).onclick=()=>{push();if(S.frozen[k])S.frozen[k]=null;else S.frozen[k]=k==='pal'?clone(B.pal.params):k==='type'?B.type.id:clone(B.logo);lockUI();writeDraft();say(S.frozen[k]?'Locked: shuffling leaves it alone':'Unlocked')}}
$('#undo').onclick=undo;
$('#share').onclick=async()=>{const u=shareURL();history.replaceState(null,'',u.slice(u.indexOf('#')));say(await copy(u)?'Share link copied':'Link is in the address bar')};

/* ---------- logo upload: dominant colours ---------- */
function dominant(img){const c=document.createElement('canvas'),n=64;c.width=c.height=n;const x=c.getContext('2d',{willReadFrequently:true});const r=Math.min(n/img.width,n/img.height);x.drawImage(img,(n-img.width*r)/2,(n-img.height*r)/2,img.width*r,img.height*r);
 let d;try{d=x.getImageData(0,0,n,n).data}catch(e){return []}const bins=new Map();
 for(let i=0;i<d.length;i+=4){if(d[i+3]<200)continue;const h=BG.normHex('#'+[d[i],d[i+1],d[i+2]].map(v=>v.toString(16).padStart(2,'0')).join(''));const [L,C,H]=BG.oklch(h);if(L>.97||L<.06)continue;const k=Math.round(H/24)+'|'+Math.round(L*4)+'|'+(C>.05?1:0);const o=bins.get(k)||{n:0,r:0,g:0,b:0};o.n++;o.r+=d[i];o.g+=d[i+1];o.b+=d[i+2];bins.set(k,o)}
 const cand=[...bins.values()].map(o=>{const h=BG.normHex('#'+[o.r/o.n,o.g/o.n,o.b/o.n].map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''));const [L,C,H]=BG.oklch(h);return {h,H,C,s:o.n*(.25+Math.min(C,.2)*5)}}).sort((a,b)=>b.s-a.s);
 const out=[];for(const c of cand){if(out.every(o=>BG.dE(o.h,c.h)>12))out.push(c);if(out.length>=3)break}return out.map(o=>o.h)}
$('#logoIn').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>2e6){$('#logoNote').textContent='That file is over 2 MB. Use a smaller one.';return}
 const ok=/svg|png/.test(f.type)||/\.(svg|png)$/i.test(f.name);if(!ok){$('#logoNote').textContent='Use an SVG or PNG file.';return}
 let url;if(/svg/.test(f.type)||/\.svg$/i.test(f.name)){let t=await f.text();if(!/\swidth=/.test(t.match(/<svg[^>]*>/)?.[0]||'')){const vb=t.match(/viewBox="[\d.\s-]*?(-?[\d.]+)\s+(-?[\d.]+)\s*"/);const wh=(t.match(/viewBox="([^"]+)"/)||[])[1];const p=wh?wh.split(/[\s,]+/):[];t=t.replace(/<svg/,`<svg width="${p[2]||256}" height="${p[3]||256}"`)}url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(t)}
 else url=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(f)});
 const img=new Image();img.onload=()=>{const cols=dominant(img);logoURL=url;logoName=f.name;push();S.logoColors=cols;S.frozen.pal=null;$('#logoInfo').hidden=false;$('#logoSw').innerHTML=cols.map(h=>`<span class="swatch" style="background:${h}" title="${h}" role="img" aria-label="Extracted colour ${h}"></span>`).join('');$('#logoNote').textContent=cols.length?`Read ${cols.length} dominant colour${cols.length>1?'s':''} from ${f.name}: ${cols.join(', ')}. The logo is used in the lockups.`:'No distinct colours found (it may be one grey). The logo is still placed in the lockups.';run()};
 img.onerror=()=>{$('#logoNote').textContent='That image could not be read.'};img.src=url};
$('#logoClear').onclick=()=>{push();logoURL='';logoName='';S.logoColors=[];S.frozen.pal=null;$('#logoIn').value='';$('#logoInfo').hidden=true;$('#logoNote').textContent='Dominant colours are read in your browser and become the primary, secondary and accent.';run()};

/* ---------- font loading + measuring ---------- */
const loaded=new Set();
function loadFonts(b){const u=BG.fontsURL(b.type);if(loaded.has(u))return;loaded.add(u);const l=document.createElement('link');l.rel='stylesheet';l.href=u;document.head.append(l);l.onload=()=>{document.fonts&&document.fonts.load(`${b.type.hw} 40px '${b.type.head}'`).then(()=>{if(B&&B.type.head===b.type.head)renderLockups()}).catch(()=>{})}}
const mc=document.createElement('canvas').getContext('2d');
BG.setMeasure((t,w,fam,size)=>{try{const f=fam.split(',')[0].replace(/['"]/g,'').trim();if(document.fonts&&!document.fonts.check(`${w} ${size}px "${f}"`))return 0;mc.font=`${w} ${size}px "${f}"`;return mc.measureText(t).width}catch(e){return 0}});

/* ---------- sections ---------- */
const mode2=m=>m==='dark'?'Dark':'Light';
function swatches(b){const t=b.modes[b.mode],P=b.pal;
 const sw=(n,h,note)=>`<button class="sw" type="button" data-copy="${h}" aria-label="Copy ${esc(n)} ${h}"><i style="background:${h}"></i><span><b>${esc(n)}</b><code>${h}</code>${note?`<small>${esc(note)}</small>`:''}</span></button>`;
 return `<div class="ro">${sw('Primary · '+P.primaryName,t.primary,'harmony: '+P.harmony)}${sw('Secondary · '+P.secondaryName,t.secondary)}${sw('Accent · '+P.accentName,t.accent)}${sw('Background',t.bg)}${sw('Surface',t.surface)}${sw('Text',t.ink)}${sw('Muted text',t.mute)}${sw('Border',t.border)}${sw('Success',t.success)}${sw('Warning',t.warning)}${sw('Danger',t.danger)}${sw('Info',t.info)}</div>`}
function ramps(b){return ['primary','secondary','accent','neutral'].map(n=>`<div><b style="font-size:13px">${n}</b><div class="ramp" role="group" aria-label="${n} scale">${b.ramps[n].map(([s,h])=>`<button type="button" data-copy="${h}" style="background:${h};color:${BG.best(h)}" aria-label="Copy ${n} ${s} ${h}">${s}</button>`).join('')}</div></div>`).join('')}
function contrastTable(b){const rows=m=>b.checks[m].map(c=>`<tr><td>${esc(c.label)}</td><td><span class="swatch" style="width:18px;height:18px;display:inline-block;vertical-align:middle;background:${c.fg}" aria-hidden="true"></span> <span class="swatch" style="width:18px;height:18px;display:inline-block;vertical-align:middle;background:${c.bg}" aria-hidden="true"></span></td><td class="n">${c.ratio.toFixed(2)}:1</td><td>≥ ${c.min}:1 ${c.kind}</td><td><span class="pill ${c.pass?'pass':'fail'}">${c.pass?'pass':'fail'}</span></td></tr>`).join('');
 const bad=['light','dark'].reduce((a,m)=>a+b.checks[m].filter(c=>!c.pass).length,0),tot=b.checks.light.length+b.checks.dark.length;
 return `<p class="lede"><span class="pill ${bad?'fail':'pass'}">${tot-bad} of ${tot} checks pass</span> Text pairs need 4.5:1, buttons, borders and icons 3:1 (WCAG 2.2 AA). Colours below were corrected automatically where the first draft fell short.</p>${['light','dark'].map(m=>`<details ${m===b.mode?'open':''}><summary><b>${mode2(m)} mode</b> contrast</summary><div class="tbl" tabindex="0" role="region" aria-label="Table, scrolls sideways"><table class="ct"><thead><tr><th scope="col">Pair</th><th scope="col">Colours</th><th scope="col">Ratio</th><th scope="col">Needs</th><th scope="col">Result</th></tr></thead><tbody>${rows(m)}</tbody></table></div></details>`).join('')}`}
function cvdBlock(b){const f=(n,r)=>r.checks.map(c=>`<li><b>${esc(n)}:</b> <span class="pill ${c.state==='pass'?'pass':c.state==='warn'?'warn':'fail'}">${c.state}</span> ${esc(c.name)}${c.detail?': '+esc(c.detail):''}</li>`).join('');
 const sim=h=>['protan','deutan','tritan'].map(k=>{const r=BG.cvdMin;return ''}).join('');
 const simCol=(h,k)=>{const M={protan:[[.152286,1.052583,-.204868],[.114503,.786281,.099216],[-.003882,-.048116,1.051998]],deutan:[[.367322,.860646,-.227968],[.280085,.672501,.047413],[-.01182,.04294,.968881]],tritan:[[1.255528,-.076749,-.17877],[-.078411,.930809,.147602],[.004733,.691367,.3039]]}[k];const v=[1,3,5].map(i=>{const c=parseInt(h.slice(i,i+2),16)/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});const o=M.map(r=>Math.max(0,Math.min(1,r[0]*v[0]+r[1]*v[1]+r[2]*v[2])));return '#'+o.map(c=>Math.round((c<=.0031308?12.92*c:1.055*c**(1/2.4)-.055)*255).toString(16).padStart(2,'0')).join('')};
 const t=b.modes.light,cols=[['Primary',t.primary],['Secondary',t.secondary],['Accent',t.accent],['Success',t.success],['Warning',t.warning],['Danger',t.danger]];
 return `<h3 style="margin:0;font-size:15px">Colour-blind check (${esc(b.cvd.brand.light.source)})</h3><ul class="fixes" style="list-style:none;padding:0">${f('Brand colours, light',b.cvd.brand.light)}${f('Brand colours, dark',b.cvd.brand.dark)}${f('Status colours, light',b.cvd.status.light)}</ul>
 <div class="tbl" tabindex="0" role="region" aria-label="Table, scrolls sideways"><table class="ct"><caption class="vh">Colours as seen with colour-vision deficiency</caption><thead><tr><th scope="col">Colour</th><th scope="col">Normal</th><th scope="col">Protanopia</th><th scope="col">Deuteranopia</th><th scope="col">Tritanopia</th></tr></thead><tbody>${cols.map(([n,h])=>`<tr><th scope="row" style="text-align:left">${n}</th>${['',...['protan','deutan','tritan']].map(k=>`<td><span class="swatch" role="img" aria-label="${n} ${k||'normal'} ${k?simCol(h,k):h}" style="background:${k?simCol(h,k):h};display:inline-block"></span></td>`).join('')}</tr>`).join('')}</tbody></table></div>
 <p class="note">Status colours (success, warning, danger) are chosen to stay distinguishable for red–green colour blindness, and should always be paired with an icon or word.</p>`}
function modePreview(b){return `<div class="modes">${['light','dark'].map(m=>{const t=b.modes[m];return `<div class="mode" style="background:${t.bg};color:${t.ink};font-family:${b.type.bodyStack};border-radius:${b.radius+4}px"><h3 style="font-family:${b.type.headStack};font-weight:${b.type.hw};text-transform:${b.type.case==='upper'?'uppercase':'none'}">${esc(b.copy.voice[0])}</h3><p style="color:${t.mute}">Muted text on the ${m} background. <a href="#out" style="color:${t.primaryText}">A link</a>.</p><div class="row"><span class="btnx" style="background:${t.primary};color:${t.onPrimary};border-radius:${b.radius}px">Primary</span><span class="btnx" style="background:${t.secondary};color:${t.onSecondary};border-radius:${b.radius}px">Secondary</span><span class="btnx" style="background:${t.accent};color:${t.onAccent};border-radius:${b.radius}px">Accent</span></div><div class="row"><span class="pill" style="background:${t.successTint};color:${t.successText}">Saved</span><span class="pill" style="background:${t.warningTint};color:${t.warningText}">Check</span><span class="pill" style="background:${t.dangerTint};color:${t.dangerText}">Error</span></div><div style="background:${t.surface};border:1px solid ${t.line};border-radius:${b.radius}px;padding:10px;font-size:13px">Surface card · border ${t.border}</div></div>`}).join('')}</div>`}
function renderPalette(){const b=B;$('#palBox').innerHTML=`<p class="lede">Built in OKLCH from your feel words${b.pal.from==='base'?' and base colour':b.pal.from==='logo'?' and the colours of your logo':''} using a <b>${b.pal.harmony}</b> harmony. Select a swatch to copy it. Primary mode: <b>${b.mode}</b>.</p>${swatches(b)}${modePreview(b)}<h3 style="margin:0;font-size:15px">Scales</h3><div style="display:grid;gap:8px">${ramps(b)}</div>${contrastTable(b)}${b.fixes.length?`<details><summary><b>${b.fixes.length} automatic contrast fix${b.fixes.length>1?'es':''}</b></summary><ul class="fixes">${b.fixes.map(f=>`<li>${f.mode} · <b>${esc(f.tok)}</b>: ${f.from} → ${f.to}. ${esc(f.why)}.</li>`).join('')}</ul></details>`:''}${cvdBlock(b)}`}
function renderType(){const b=B,t=b.type,M=b.modes[b.mode];loadFonts(b);
 const alts=t.alternatives.map(id=>BG.PAIRS.find(p=>p.id===id)).filter(Boolean);
 $('#typBox').innerHTML=`<p class="lede"><b>${esc(t.head)}</b> + <b>${esc(t.body)}</b>. ${esc(t.why)}</p><div class="specs"><div class="specbox" style="background:${M.surface};color:${M.ink}"><p style="margin:0;font:${t.hw} clamp(34px,5vw,54px)/1.05 ${t.headStack};text-transform:${t.case==='upper'?'uppercase':'none'}">${esc(b.name)}</p><p style="margin:8px 0 0;font:${t.hw} 22px/1.3 ${t.headStack};text-transform:${t.case==='upper'?'uppercase':'none'}">${esc(b.copy.voice[0])}</p><p style="margin:12px 0 0;font:400 16px/1.6 ${t.bodyStack};color:${M.ink}">${esc(b.copy.tagline)} The quick brown fox jumps over the lazy dog. 0123456789</p><p style="margin:8px 0 0;font:600 14px/1.5 ${t.bodyStack};color:${M.mute}">Aa Bb Cc Dd Ee Ff Gg · ${esc(t.body)} 400 / 600</p></div>
 <div class="specbox"><b>Type scale</b> <span class="note">ratio ${t.ratio} from 16px</span><div style="display:grid;gap:2px;margin-top:6px;overflow:hidden">${t.scale.slice().reverse().map(s=>`<div style="display:grid;grid-template-columns:44px 70px minmax(0,1fr);gap:8px;align-items:baseline"><code>${s.name}</code><code style="color:var(--pmute)">${s.px}px</code><span style="font:${s.face==='head'?t.hw:400} ${Math.min(s.px,44)}px/${s.lh} ${s.face==='head'?t.headStack:t.bodyStack};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:${s.face==='head'&&t.case==='upper'?'uppercase':'none'}">${s.face==='head'?esc(b.name):'The quick brown fox'}</span></div>`).join('')}</div></div></div>
 <div class="f"><label for="pairSel">Choose a pairing (best matches for your feel words first)</label><select id="pairSel">${alts.map(p=>`<option value="${p.id}" ${p.id===t.id?'selected':''}>${esc(p.head)} + ${esc(p.body)}</option>`).join('')}${alts.some(p=>p.id===t.id)?'':`<option value="${t.id}" selected>${esc(t.head)} + ${esc(t.body)}</option>`}</select></div>`;
 $('#pairSel').onchange=e=>{push();S.frozen.type=e.target.value;lockUI();run()}}
function lockupViews(b){const L=[['Horizontal · light','horizontal','light'],['Horizontal · dark','horizontal','dark'],['Stacked · light','stacked','light'],['Stacked · dark','stacked','dark']];
 const withLogo=b.logoURL;return L.map(([n,l,m])=>({n,svg:BG.lockup(b,l,m),file:`${l}-${m}.svg`,l,m,bg:b.modes[m].bg}))}
function renderLockups(){if(!B)return;const b=B,v=lockupViews(b),M=b.modes;
 const extra=[{n:'Monogram',svg:BG.monogram(b,160,{bg:true,mode:'light'}),file:'monogram.svg',bg:M.light.bg},{n:'Wordmark',svg:BG.wordmark(b,'light'),file:'wordmark.svg',bg:M.light.bg}];
 $('#lgBox').innerHTML=`<p class="lede">${b.logoURL?`Your uploaded logo (${esc(logoName)}) sits beside the wordmark, which is set in ${esc(b.type.head)}. The monogram is the fallback for small sizes.`:`A wordmark set in ${esc(b.type.head)} with a monogram (${esc(b.logo.shape)} shape${b.logo.decor!=='plain'?', '+b.logo.decor+' detail':''}). Upload your own logo to place it here instead.`}</p><div class="lockups">${[...v,...extra].map((x,i)=>`<div class="lk"><div class="v" style="background:${x.bg}" role="img" aria-label="${esc(b.name)} ${esc(x.n)}">${x.svg.replace(/<rect width="[\d.]+" height="[\d.]+" fill="[^"]+"\/>/,'')}</div><div class="row" style="justify-content:space-between"><b style="font-size:13px">${esc(x.n)}</b><button class="btn ghost sm" type="button" data-svg="${i}">SVG</button></div></div>`).join('')}</div>`;
 lockups=[...v,...extra]}
let lockups=[];
$('#lgBox').onclick=e=>{const bt=e.target.closest('[data-svg]');if(!bt)return;const x=lockups[+bt.dataset.svg],s=x.n==='Monogram'?BG.monogram(B,512,{bg:false,fonts:true}):x.n==='Wordmark'?BG.wordmark(B,'light',{fonts:true}):BG.lockup(B,x.l,x.m,{fonts:true});save(blobOf(s,'image/svg+xml'),slug()+'-'+x.file);say('Downloaded '+slug()+'-'+x.file)};
const slug=()=>(B.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'brand');
function renderTokens(){const b=B,txt=tokTab==='css'?BG.css(b):tokTab==='json'?BG.json(b):BG.tailwind(b);$('#tokPre').textContent=txt;document.querySelectorAll('#tokTabs button').forEach(x=>x.setAttribute('aria-selected',x.dataset.t===tokTab))}
$('#tokTabs').onclick=e=>{const t=e.target.closest('button');if(!t)return;tokTab=t.dataset.t;renderTokens()};
$('#copyTok').onclick=async()=>say(await copy($('#tokPre').textContent)?'Copied':'Copy failed');
$('#dlTok').onclick=()=>{const n={css:['tokens.css','text/css'],json:['tokens.json','application/json'],tw:['tailwind.config.js','text/javascript']}[tokTab];save(blobOf($('#tokPre').textContent,n[1]),slug()+'-'+n[0]);say('Downloaded '+slug()+'-'+n[0])};
document.addEventListener('click',async e=>{const c=e.target.closest('[data-copy]');if(c&&!c.closest('#kitBox'))say(await copy(c.dataset.copy)?'Copied '+c.dataset.copy:'Copy failed')});

/* theme kit through the atlas renderer */
function renderKit(){clearTimeout(kitTimer);kitTimer=setTimeout(()=>{const k=B.kit,box=$('#kitBox');if(view){view.destroy();view=null}box.innerHTML='';box.setAttribute('aria-label',k.name+' theme kit');try{view=TK.render(k,box,{say,playing:false})}catch(e){box.innerHTML='<p class="note" style="padding:16px">The theme kit preview could not be drawn: '+esc(e.message)+'</p>'}},350)}
$('#kitZip').onclick=async e=>{const b=e.currentTarget;b.disabled=true;say('Packing the kit…');try{save(await TK.zipKit(B.kit),slug()+'-theme-kit.zip');say('Downloaded '+slug()+'-theme-kit.zip')}catch(err){say('Could not build the zip: '+err.message)}finally{b.disabled=false}};

/* ---------- run ---------- */
function run(){try{B=BG.generate(S)}catch(e){console.error(e);return}
 B.logoURL=logoURL;writeDraft();renderPalette();renderType();renderLockups();renderTokens();renderKit();lockUI();window.__brand=B;window.__brandState=S;
 document.title=`${B.name} · Brand kit generator · Visual & Motion Atlas`}
window.Brandgen={get brand(){return B},get state(){return S},setState(o){S=BG.norm(o);sync();run()},shareURL,run};

/* ---------- boot ---------- */
const h=fromHash(),d=readDraft();if(h)S=BG.norm(h);else if(d)S=BG.norm(d);
sync();$('#undo').disabled=true;run();
addEventListener('hashchange',()=>{const x=fromHash();if(x){S=BG.norm(x);sync();run()}});
})();

/* ---------- step 2: applied previews, guide, projects, site builder, AI ---------- */
(()=>{
const BG=window.BrandGen,TK=window.ThemeKits,$=s=>document.querySelector(s),esc=BG.esc;
let pm='light';
const say=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(say.t);say.t=setTimeout(()=>t.classList.remove('on'),2400)};
const cur=()=>window.Brandgen.brand,slug=()=>(cur().name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'brand');
const vars=(b,t)=>`--bg:${t.bg};--sf:${t.surface};--ink:${t.ink};--mute:${t.mute};--ln:${t.line};--bd:${t.border};--p:${t.primary};--onp:${t.onPrimary};--pt:${t.primaryText};--s:${t.secondary};--ons:${t.onSecondary};--a:${t.accent};--ona:${t.onAccent};--ok:${t.successText};--okt:${t.successTint};--r:${b.radius}px;--fh:${b.type.headStack};--fb:${b.type.bodyStack};--hw:${b.type.hw};--cs:${b.type.case==='upper'?'uppercase':'none'}`;
const mono=(b,t,sz)=>`<span style="display:inline-block;width:${sz}px;height:${sz}px;vertical-align:middle">${BG.monogram(b,sz,{t}).replace('width="'+sz+'" height="'+sz+'"','width="100%" height="100%"')}</span>`;
function applied(){const b=cur(),t=b.modes[pm],c=b.copy;
 const css=`<style>.ap{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:16px}.ap>div{min-width:0}.ap h3{margin:0 0 6px;font:600 12px/1 Inter;letter-spacing:.1em;text-transform:uppercase;color:var(--pmute)}.ap .frame{${vars(b,t)};background:var(--bg);color:var(--ink);font-family:var(--fb);border-radius:12px;border:1px solid var(--phair);overflow:hidden}.ap .hd{font-family:var(--fh);font-weight:var(--hw);text-transform:var(--cs)}.ap .bt{display:inline-flex;align-items:center;min-height:40px;padding:0 16px;border-radius:var(--r);background:var(--p);color:var(--onp);font-weight:600;font-size:14px}.ap .bt.g{background:transparent;color:var(--ink);border:1px solid var(--bd)}</style>`;
 const hero=`<div class="frame"><div style="display:flex;gap:10px;align-items:center;padding:14px 18px;border-bottom:1px solid var(--ln)">${mono(b,t,28)}<b class="hd" style="font-size:18px">${esc(b.name)}</b><span style="margin-left:auto;font-size:13px;color:var(--mute)">Menu · About · Visit</span></div><div style="padding:clamp(22px,5vw,44px) 22px;background:linear-gradient(135deg,var(--sf),var(--bg))"><p class="hd" style="margin:0;font-size:clamp(30px,5vw,48px);line-height:1.04">${esc(c.voice[0])}</p><p style="margin:12px 0 18px;max-width:46ch;font-size:16px;color:var(--mute)">${esc(c.tagline)}</p><div style="display:flex;gap:10px;flex-wrap:wrap"><span class="bt">Get started</span><span class="bt g">Learn more</span></div></div></div>`;
 const card=`<div class="frame" style="display:grid;grid-template-columns:1fr 1fr;aspect-ratio:7/4"><div style="padding:6%;display:grid;align-content:space-between;background:var(--bg)"><span style="width:44px;display:block">${mono(b,t,44)}</span><div><b class="hd" style="font-size:22px;display:block">${esc(b.name)}</b><span style="font-size:12px;color:var(--mute)">${esc(c.voice[2])}</span></div></div><div style="padding:6%;display:grid;align-content:center;gap:4px;background:var(--p);color:var(--onp);font-size:12px"><b class="hd" style="font-size:16px">Alex Morgan</b><span>Founder</span><span style="margin-top:8px">hello@${esc(slug())}.com</span><span>+00 0000 000000</span></div></div>`;
 const post=`<div class="frame" style="aspect-ratio:1/1;max-width:420px;display:grid;place-items:center;text-align:center;padding:8%;background:var(--p);color:var(--onp)"><div style="display:grid;gap:14px;justify-items:center">${mono(b,{...t,primary:t.onPrimary,onPrimary:t.primary,primaryText:t.onPrimary},52)}<p class="hd" style="margin:0;font-size:clamp(26px,5vw,38px);line-height:1.08">${esc(c.voice[1])}</p><span style="background:var(--a);color:var(--ona);padding:6px 14px;border-radius:999px;font-weight:600;font-size:13px">${esc(b.name)}</span></div></div>`;
 const app=`<div class="frame" style="max-width:340px;margin:0 auto"><div style="padding:16px 16px 10px;display:flex;align-items:center;justify-content:space-between"><b class="hd" style="font-size:20px">Today</b>${mono(b,t,26)}</div><div style="padding:0 16px 16px;display:grid;gap:10px"><div style="background:var(--sf);border:1px solid var(--ln);border-radius:var(--r);padding:12px"><span style="font-size:12px;color:var(--mute)">Next up</span><p class="hd" style="margin:2px 0 8px;font-size:20px">${esc(c.voice[2])}</p><span class="bt" style="min-height:34px;font-size:13px">Continue</span></div>${['Saved','Updated','Shared'].map((x,i)=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border:1px solid var(--ln);border-radius:var(--r);font-size:14px"><span>${x} item ${i+1}</span><span style="background:${i?'var(--sf)':'var(--okt)'};color:${i?'var(--mute)':'var(--ok)'};padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600">${i?'Draft':'Done'}</span></div>`).join('')}</div><div style="display:flex;justify-content:space-around;padding:10px;border-top:1px solid var(--ln);font-size:12px;color:var(--mute)"><b style="color:var(--pt)">Home</b><span>Search</span><span>Profile</span></div></div>`;
 $('#appBox').innerHTML=css+`<div class="ap"><div><h3>Landing hero</h3>${hero}</div><div><h3>Business card</h3>${card}</div><div><h3>Social post</h3>${post}</div><div><h3>App screen</h3>${app}</div></div>`}
document.querySelectorAll('[data-pm]').forEach(x=>x.onclick=()=>{pm=x.dataset.pm;document.querySelectorAll('[data-pm]').forEach(y=>y.setAttribute('aria-pressed',y===x));applied()});

/* guide */
const guide=()=>BG.guideHTML(cur());
function showGuide(){$('#gdFrame').srcdoc=guide()}
const save=(b,n)=>TK.save(b,n);
$('#gdHtml').onclick=()=>{save(new Blob([guide()],{type:'text/html'}),slug()+'-brand-guide.html');say('Downloaded the guide')};
$('#gdPrint').onclick=()=>{const f=$('#gdFrame');try{f.contentWindow.focus();f.contentWindow.print()}catch(e){say('Open the downloaded HTML and print it')}};
$('#gdPng').onclick=async()=>{const f=$('#gdFrame'),d=f.contentDocument;if(!d||!d.body){say('The guide is still loading');return}
 try{const W=1000,H=Math.ceil(d.documentElement.scrollHeight),css=[...d.querySelectorAll('style')].map(s=>s.textContent).join('\n').replace(/@import[^;]+;/g,'');
  const imgs=await Promise.all([...d.images].map(async i=>[i.src,i.src]));let body=d.body.innerHTML;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style>${css.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</style>${new XMLSerializer().serializeToString(d.body).replace(/^<body[^>]*>/,'<div class="b" style="background:'+cur().modes.light.bg+'">').replace(/<\/body>$/,'</div>')}</div></foreignObject></svg>`;
  const img=new Image();await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)});
  const c=document.createElement('canvas');c.width=W*2;c.height=H*2;const x=c.getContext('2d');x.scale(2,2);x.fillStyle=cur().modes.light.bg;x.fillRect(0,0,W,H);x.drawImage(img,0,0);
  c.toBlob(b=>{if(!b){say('Could not make the PNG');return}save(b,slug()+'-brand-guide.png');say('Downloaded the PNG (system fonts stand in for web fonts)')},'image/png')}catch(e){say('Could not make the PNG here. Use the HTML download and print.')}};

/* My projects */
function saveProject(){const b=cur(),K='atlas-projects-v1';let list=[];try{list=JSON.parse(localStorage.getItem(K)||'[]');if(!Array.isArray(list))list=[]}catch(e){list=[]}
 const origin='brand-'+slug().slice(0,40),now=Date.now(),M=b.modes[b.mode],url=window.Brandgen.shareURL().replace(location.origin+location.pathname.replace(/[^/]*$/,''),'');
 const links=[{id:'brand-gen',title:'Open in the Brand kit generator',url:'brand-generator.html#s='+url.split('#s=')[1],kind:'brand',text:`${b.type.head} + ${b.type.body} · primary ${b.pal.brand} · ${b.mode} first`},{id:'brand-kits',title:'Theme kits',url:'theme-kits.html',kind:'brand',text:'The forty-eight built-in kits, for comparison.'}];
 let p=list.find(x=>x&&x.origin===origin);
 if(!p){p={id:(crypto.randomUUID?crypto.randomUUID():'p'+now.toString(36)),name:b.name,brief:b.copy.tagline,platform:'Website',stage:'Designing',entries:[],icons:[],references:[],decisions:`Brand kit: ${b.type.head} + ${b.type.body}; primary ${b.pal.brand}, secondary ${b.pal.secondary}, accent ${b.pal.accent}.`,notes:{},directions:[],created:now,updated:now,origin,isPublic:false,files:[],hub:{links:[]}};list.push(p)}
 p.name=b.name;p.updated=now;p.decisions=`Brand kit: ${b.type.head} + ${b.type.body}; primary ${b.pal.brand}, secondary ${b.pal.secondary}, accent ${b.pal.accent}.`;p.hub=p.hub&&typeof p.hub==='object'?p.hub:{links:[]};
 p.hub.lede=b.copy.tagline;p.hub.kitSnap={id:'',no:b.initials.slice(0,2),name:b.name,tagline:b.copy.tagline,head:b.type.headStack,body:b.type.bodyStack,css:b.type.css,t:{bg:M.bg,surface:M.surface,ink:M.ink,mute:M.mute,line:M.line,accent:M.primary,accent2:M.secondary,onAccent:M.onPrimary}};
 p.hub.links=[...links,...(p.hub.links||[]).filter(l=>!/^brand-(gen|kits)$/.test(l.id))];
 try{localStorage.setItem(K,JSON.stringify(list));$('#projLink').hidden=false;$('#projLink').href='atlas.html#projects?id='+p.id+'&view=hub';$('#svNote').textContent=`Saved “${b.name}” to My projects (in this browser). Its hub has a link back here.`;say('Saved to My projects')}catch(e){say('Could not save: storage is full or blocked')}}
$('#saveProj').onclick=saveProject;

/* Site builder handoff: a new site whose tokens are the brand's */
$('#toSite').onclick=()=>{const b=cur(),M=b.modes[b.mode],ok=f=>/^[\w ]{2,40}$/.test(f)?f:'';let mark='';try{mark='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(BG.monogram(b,64,{bg:false}))}catch(e){}
 const h={name:b.name,desc:(window.__brandState||{}).desc||'',audience:(window.__brandState||{}).audience||'',feels:(window.__brandState||{}).feels||[],tagline:b.copy&&b.copy.tagline||'',headline:b.copy&&b.copy.headline||'',voice:b.copy&&b.copy.voice||[],group:b.copy&&b.copy.group||'',mode:b.mode,t:{bg:M.bg,surface:M.surface,ink:M.ink,primary:M.primary},head:ok(b.type.head),body:ok(b.type.body),radius:Math.min(40,b.radius),mark,at:Date.now()};
 try{localStorage.setItem('atlas-pb-brand-handoff',JSON.stringify(h));say('Opening the site builder with your brand');location.href='page-builder.html?brand=1'}catch(e){say('Could not hand off: storage is full or blocked')}};

$('#toBoard').onclick=()=>{try{if(!window.MoodPin){say('The moodboard is still loading. Try again.');return}MoodPin.pinKit(cur().kit)}catch(e){say('Could not pin: storage is full or blocked')}};

/* AI refine */
let aiOn=null;
async function aiStatus(){if(aiOn!=null)return aiOn;try{const r=await fetch('/api/ai?status',{headers:{accept:'application/json'}});const j=r.ok&&/json/.test(r.headers.get('content-type')||'')?await r.json():null;aiOn=!!(j&&j.enabled)}catch(e){aiOn=false}return aiOn}
$('#aiBtn').onclick=async()=>{const n=$('#svNote');n.textContent='Checking the AI…';if(!await aiStatus()){n.textContent='AI refinement is not switched on for this site yet (the server has no API key). Everything above works without it: the generator is deterministic from your inputs, and shuffle gives variations.';return}
 const b=cur();n.textContent='Asking the AI to refine the voice…';try{const r=await fetch('/api/ai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'brand',brief:`Brand ${b.name}: ${b.state.desc}. Feel: ${b.state.feels.join(', ')}. Audience: ${b.state.audience}. Pairing: ${b.type.id} (options: ${b.type.alternatives.join(', ')}).`,catalog:[],styles:[]})});const j=await r.json().catch(()=>null);
  if(!r.ok||!j||!j.brand)throw new Error((j&&j.error)||'The AI endpoint does not support brand refinement yet.');window.Brandgen.setState({...window.Brandgen.state,ai:j.brand});n.textContent='Refined with AI: tagline, voice and guidance updated.'}catch(e){n.textContent='AI refinement is unavailable: '+e.message+' Your brand is unchanged.'}};

/* re-render the new sections whenever the main run() happens */
const run0=window.Brandgen.run;window.Brandgen.run=()=>{run0();applied();showGuide()};
const mo=new MutationObserver(()=>{});
applied();showGuide();
const orig=document.querySelector('#palBox');new MutationObserver(()=>{applied();clearTimeout(showGuide.t);showGuide.t=setTimeout(showGuide,200)}).observe(orig,{childList:true});
})();
