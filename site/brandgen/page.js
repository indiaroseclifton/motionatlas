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
 const out=[];for(const c of cand){if(out.every(o=>Math.abs(((o.H-c.H+540)%360)-180)>22||Math.abs(o.C-c.C)>.07)&&BG.dE(o?.h||c.h,c.h)>8||!out.length)out.push(c);if(out.length>=3)break}return out.map(o=>o.h)}
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
 return `<p class="lede"><span class="pill ${bad?'fail':'pass'}">${tot-bad} of ${tot} checks pass</span> Text pairs need 4.5:1, buttons, borders and icons 3:1 (WCAG 2.2 AA). Colours below were corrected automatically where the first draft fell short.</p>${['light','dark'].map(m=>`<details ${m===b.mode?'open':''}><summary><b>${mode2(m)} mode</b> contrast</summary><div class="tbl"><table class="ct"><thead><tr><th scope="col">Pair</th><th scope="col">Colours</th><th scope="col">Ratio</th><th scope="col">Needs</th><th scope="col">Result</th></tr></thead><tbody>${rows(m)}</tbody></table></div></details>`).join('')}`}
function cvdBlock(b){const f=(n,r)=>r.checks.map(c=>`<li><b>${esc(n)}:</b> <span class="pill ${c.state==='pass'?'pass':c.state==='warn'?'warn':'fail'}">${c.state}</span> ${esc(c.name)}${c.detail?': '+esc(c.detail):''}</li>`).join('');
 const sim=h=>['protan','deutan','tritan'].map(k=>{const r=BG.cvdMin;return ''}).join('');
 const simCol=(h,k)=>{const M={protan:[[.152286,1.052583,-.204868],[.114503,.786281,.099216],[-.003882,-.048116,1.051998]],deutan:[[.367322,.860646,-.227968],[.280085,.672501,.047413],[-.01182,.04294,.968881]],tritan:[[1.255528,-.076749,-.17877],[-.078411,.930809,.147602],[.004733,.691367,.3039]]}[k];const v=[1,3,5].map(i=>{const c=parseInt(h.slice(i,i+2),16)/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});const o=M.map(r=>Math.max(0,Math.min(1,r[0]*v[0]+r[1]*v[1]+r[2]*v[2])));return '#'+o.map(c=>Math.round((c<=.0031308?12.92*c:1.055*c**(1/2.4)-.055)*255).toString(16).padStart(2,'0')).join('')};
 const t=b.modes.light,cols=[['Primary',t.primary],['Secondary',t.secondary],['Accent',t.accent],['Success',t.success],['Warning',t.warning],['Danger',t.danger]];
 return `<h3 style="margin:0;font-size:15px">Colour-blind check (${esc(b.cvd.brand.light.source)})</h3><ul class="fixes" style="list-style:none;padding:0">${f('Brand colours, light',b.cvd.brand.light)}${f('Brand colours, dark',b.cvd.brand.dark)}${f('Status colours, light',b.cvd.status.light)}</ul>
 <div class="tbl"><table class="ct"><caption class="vh">Colours as seen with colour-vision deficiency</caption><thead><tr><th scope="col">Colour</th><th scope="col">Normal</th><th scope="col">Protanopia</th><th scope="col">Deuteranopia</th><th scope="col">Tritanopia</th></tr></thead><tbody>${cols.map(([n,h])=>`<tr><th scope="row" style="text-align:left">${n}</th>${['',...['protan','deutan','tritan']].map(k=>`<td><span class="swatch" role="img" aria-label="${n} ${k||'normal'} ${k?simCol(h,k):h}" style="background:${k?simCol(h,k):h};display:inline-block"></span></td>`).join('')}</tr>`).join('')}</tbody></table></div>
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
