'use strict';
/* Atlas features:
   1. Compare anything: any two catalogue entries side by side, differences highlighted (#compare).
   2. Direction finder: five visual questions recommend a style, type pairing, motion curve and effect.
   3. Projects: export a moodboard PNG and design tokens (CSS / JSON) for the open project.
   4. Recently viewed entries (shown in the search palette).
   5. Offline: registers a service worker so the atlas works without a connection. */
(()=>{
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const cat=()=>{try{return typeof catalogue!=='undefined'&&Array.isArray(catalogue)?catalogue.filter(e=>!/^X\d/.test(e.id)):[];}catch{return[];}};
 const findE=id=>cat().find(e=>e.id===id);
 const store={get(k,d){try{return JSON.parse(localStorage.getItem(k)||'null')??d;}catch{return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}};
 function download(name,blob){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);}

 /* ---------- 4. Recently viewed ---------- */
 (function trackRecent(){const iv=setInterval(()=>{if(typeof window.openEntry!=='function'||window.openEntry.__recent)return;const o=window.openEntry;const w=function(id){const r=store.get('atlasRecent',[]).filter(x=>x!==id);r.unshift(id);store.set('atlasRecent',r.slice(0,8));return o.apply(this,arguments);};w.__recent=true;window.openEntry=w;clearInterval(iv);},250);})();
 window.AtlasRecent=()=>store.get('atlasRecent',[]).map(findE).filter(Boolean);

 /* ---------- 1. Compare anything ---------- */
 const FIELDS=[['group','Collection'],['mood','Mood'],['effort','Effort'],['medium','Medium'],['purpose','Purpose'],['use','Best for'],['motion','Motion'],['avoid','Watch out']];
 let cmpRoot;
 function buildCompare(){
  const page=document.getElementById('compare');if(!page||document.getElementById('compareAny'))return;
  cmpRoot=document.createElement('section');cmpRoot.id='compareAny';cmpRoot.className='cmpx';
  cmpRoot.innerHTML=`<div class="cmpx-head"><div><p class="cmpx-kicker">Compare anything · new</p><h2>Any two entries, side by side.</h2></div><p>Pick a style against an effect, a system against an art style, or two components. Differences are highlighted so the trade-off is easy to see.</p></div>
  <div class="cmpx-bar"><label>Left<input id="cmpA" list="cmpList" placeholder="Type a name or code, e.g. S13"></label><button type="button" id="cmpSwap" class="cmpx-btn" aria-label="Swap left and right">⇄</button><label>Right<input id="cmpB" list="cmpList" placeholder="e.g. L25 Liquid hover"></label><datalist id="cmpList"></datalist></div>
  <div class="cmpx-grid" id="cmpOut" aria-live="polite"></div>`;
  const anchor=page.querySelector('.aeRelated')||page.querySelector('.intro');(anchor||page.firstElementChild).insertAdjacentElement('afterend',cmpRoot);
  const fill=()=>{const list=cat();if(!list.length)return false;$('#cmpList',cmpRoot).innerHTML=list.map(e=>`<option value="${e.id} · ${esc(e.title)}"></option>`).join('');return true;};
  const pick=v=>{const id=(String(v).match(/^([A-Z]\d\d)/)||[])[1];return id&&findE(id);};
  const s=store.get('atlasCompareAny',{a:'S13',b:'S05'});
  const render=()=>{const A=pick($('#cmpA',cmpRoot).value),B=pick($('#cmpB',cmpRoot).value);const out=$('#cmpOut',cmpRoot);
   if(!A||!B){out.innerHTML=`<p class="cmpx-empty">Choose two entries to compare. Start typing a name or a code such as S13, L25 or C30.</p>`;return;}
   store.set('atlasCompareAny',{a:A.id,b:B.id});
   const col=(e,o)=>{let media='';try{media=window.elementExample?window.elementExample(e,false):'';}catch{}return `<article class="cmpx-col"><div class="cmpx-media">${media}</div><p class="cmpx-kicker">${e.id} · ${esc(e.group||e.kind||'')}</p><h3>${esc(e.title)}</h3><p class="cmpx-desc">${esc(e.desc||'')}</p><dl>${FIELDS.filter(([k])=>e[k]||o[k]).map(([k,l])=>`<dt>${l}</dt><dd class="${String(e[k]||'')!==String(o[k]||'')?'diff':''}">${esc(e[k]||'—')}</dd>`).join('')}</dl><button type="button" class="cmpx-btn" data-open-entry="${e.id}">Open full reference</button></article>`;};
   out.innerHTML=col(A,B)+col(B,A);
   $$('[data-open-entry]',out).forEach(b=>b.onclick=()=>window.openEntry?.(b.dataset.openEntry));};
  const init=()=>{if(!fill())return setTimeout(init,500);const A=findE(s.a),B=findE(s.b);if(A)$('#cmpA',cmpRoot).value=`${A.id} · ${A.title}`;if(B)$('#cmpB',cmpRoot).value=`${B.id} · ${B.title}`;render();};
  ['#cmpA','#cmpB'].forEach(id=>$(id,cmpRoot).addEventListener('change',render));
  $('#cmpSwap',cmpRoot).onclick=()=>{const a=$('#cmpA',cmpRoot),b=$('#cmpB',cmpRoot);[a.value,b.value]=[b.value,a.value];render();};
  init();
 }

 /* ---------- 2. Direction finder ---------- */
 const Q=[
  ['How should it feel?',[['Calm and quiet','calm'],['Bold and expressive','bold'],['Precise and technical','precise'],['Warm and human','warm']]],
  ['Which surface?',[['Flat paper and ink','paper'],['Glass and light','glass'],['Soft and tactile','soft'],['Raw and graphic','raw']]],
  ['Which colour world?',[['Light and airy','light'],['Dark and luminous','dark'],['Vivid and saturated','vivid'],['Natural and earthy','earth']]],
  ['How much motion?',[['Almost still','still'],['Subtle and smooth','subtle'],['Lively and playful','lively'],['Cinematic','cinema']]],
  ['What are you making?',[['A product or app','app'],['An editorial or portfolio site','editorial'],['A launch or campaign','launch'],['A tool for experts','tool']]]];
 const W={S01:'calm paper light still editorial',S02:'precise paper light subtle editorial raw',S03:'warm paper earth subtle editorial',S04:'calm soft light subtle app',S05:'calm glass light subtle app',S06:'calm soft light lively app launch',S07:'precise paper light subtle app tool',S08:'bold raw vivid lively launch',S09:'warm paper light lively editorial',S10:'precise dark still tool raw',S11:'bold glass dark cinema launch vivid',S12:'precise paper light still tool',S13:'calm glass vivid subtle app',S14:'bold glass dark cinema launch vivid',S15:'warm soft vivid lively app',S16:'bold paper earth cinema editorial',S17:'bold raw light lively editorial',S18:'warm paper earth subtle app launch',S19:'precise dark still tool raw',S20:'bold raw vivid lively editorial launch',S21:'precise paper light still tool editorial',S22:'calm paper earth still editorial'};
 const MOTION={still:['Decelerate',[0,0,.2,1],200],subtle:['Standard',[.4,0,.2,1],280],lively:['Gentle overshoot',[.34,1.56,.64,1],450],cinema:['Expressive',[.2,.7,.1,1],900]};
 const FXBY={still:'L19',subtle:'L24',lively:'L08',cinema:'L22'};
 let fdlg;
 function finder(){
  if(!fdlg){fdlg=document.createElement('dialog');fdlg.className='finder';fdlg.setAttribute('aria-labelledby','finderTitle');document.body.append(fdlg);fdlg.addEventListener('click',e=>{if(e.target===fdlg)fdlg.close();});}
  const ans=[];let step=0;
  const q=()=>{const [title,opts]=Q[step];fdlg.innerHTML=`<div class="finder-in"><div class="finder-top"><p class="finder-kicker">Direction finder · ${step+1} of ${Q.length}</p><button type="button" class="finder-x" aria-label="Close">×</button></div><span class="finder-bar"><i style="width:${step/Q.length*100}%"></i></span><h2 id="finderTitle">${title}</h2><div class="finder-opts">${opts.map(([l,v],i)=>`<button type="button" data-v="${v}" class="finder-opt"><span>${String.fromCharCode(65+i)}</span>${l}</button>`).join('')}</div>${step?'<button type="button" class="finder-back">← Back</button>':''}</div>`;
   $('.finder-x',fdlg).onclick=()=>fdlg.close();$$('[data-v]',fdlg).forEach(b=>b.onclick=()=>{ans[step]=b.dataset.v;step++;step<Q.length?q():result();});
   const back=$('.finder-back',fdlg);if(back)back.onclick=()=>{step--;q();};$('[data-v]',fdlg).focus();};
  const result=()=>{const scores=Object.entries(W).map(([id,tags])=>[id,ans.reduce((s,a)=>s+(tags.split(' ').includes(a)?1:0),0)+(id>'S12'?.1:0)]).sort((a,b)=>b[1]-a[1]);
   const [best,runner]=[scores[0][0],scores[1][0]];const e=findE(best)||{title:AtlasThemes.byId[best]?.name,id:best};const t=AtlasThemes.byId[best];
   const m=MOTION[ans[3]]||MOTION.subtle;const fx=(findE(best)?.pairs?.effect)||FXBY[ans[3]]||'L24';const fxE=findE(fx);
   const brief=`Direction: ${e.title} (${best})\nFeel: ${ans[0]} · Surface: ${ans[1]} · Colour: ${ans[2]} · Motion: ${ans[3]} · For: ${ans[4]}\nType: ${t.fonts.display} for headings, ${t.fonts.body} for text\nMotion: ${m[0]}, cubic-bezier(${m[1].join(', ')}), ${m[2]} ms\nSignature effect: ${fx}${fxE?' '+fxE.title:''}\nAlternative: ${findE(runner)?.title||runner} (${runner})`;
   fdlg.innerHTML=`<div class="finder-in"><div class="finder-top"><p class="finder-kicker">Your direction</p><button type="button" class="finder-x" aria-label="Close">×</button></div><span class="finder-bar"><i style="width:100%"></i></span><h2 id="finderTitle">${esc(e.title)}</h2>
   <div class="finder-tile">${window.NewStyles&&/^S(1[3-9]|2[0-2])$/.test(best)?NewStyles.tile(findE(best)||{id:best,title:e.title},false):(typeof sameUI==='function'?sameUI(best):'')}</div>
   <dl class="finder-dl"><dt>Type pairing</dt><dd>${esc(t.fonts.display)} + ${esc(t.fonts.body)}</dd><dt>Motion curve</dt><dd>${m[0]} · cubic-bezier(${m[1].join(', ')}) · ${m[2]} ms</dd><dt>Signature effect</dt><dd>${fx} ${esc(fxE?.title||'')}</dd><dt>Also consider</dt><dd>${esc(findE(runner)?.title||runner)}</dd></dl>
   <div class="finder-actions"><button type="button" class="finder-btn primary" data-go="entry">Open the style</button><button type="button" class="finder-btn" data-go="lab">Components in this style</button><button type="button" class="finder-btn" data-go="fx">Try the effect</button><button type="button" class="finder-btn" data-go="ease">Tune the curve</button><button type="button" class="finder-btn" data-go="copy">Copy brief</button><button type="button" class="finder-btn" data-go="again">Start again</button></div></div>`;
   $('.finder-x',fdlg).onclick=()=>fdlg.close();
   $$('[data-go]',fdlg).forEach(b=>b.onclick=async()=>{const g=b.dataset.go;if(g==='again'){step=0;ans.length=0;return q();}if(g==='copy'){try{await navigator.clipboard.writeText(brief);b.textContent='Brief copied';}catch{b.textContent='Copy failed';}return;}
    fdlg.close();if(g==='entry'){location.hash='browse';setTimeout(()=>window.openEntry?.(best),120);}if(g==='lab')location.hash=`ux?component=C30&theme=${best}`;if(g==='fx')location.hash=`effects?fx=${fx}`;if(g==='ease')location.hash=`motion?ease=${m[1].join(',')},${m[2]}`;});};
  q();if(!fdlg.open)fdlg.showModal();
 }
 function finderButton(){if($('.finderBtn'))return;const s=$('.aeSearchBtn');if(!s)return setTimeout(finderButton,300);const b=document.createElement('button');b.type='button';b.className='finderBtn';b.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M10.5 5.5 9 9l-3.5 1.5L7 7z" fill="currentColor"/></svg><span>Find a direction</span>';b.onclick=finder;s.insertAdjacentElement('beforebegin',b);}
 window.AtlasFinder=finder;

 /* ---------- 3. Project moodboard + tokens ---------- */
 function project(){const P=window.ProjectAtlas;if(!P)return null;const a=P.active;return P.items?.find(p=>p.id===a||p.id===a?.id)||(typeof a==='object'?a:null);}
 function projectTools(){
  const ed=document.getElementById('projectEditor');if(!ed||$('#projMoodboard'))return;
  const anchor=$('#projectExport');if(!anchor)return;
  anchor.insertAdjacentHTML('afterend',`<button id="projMoodboard" class="secondary" type="button">Moodboard PNG</button><button id="projTokensCss" class="secondary" type="button">Tokens CSS</button><button id="projTokensJson" class="secondary" type="button">Tokens JSON</button>`);
  $('#projMoodboard').onclick=moodboard;$('#projTokensCss').onclick=()=>tokens('css');$('#projTokensJson').onclick=()=>tokens('json');
 }
 function projectTokens(p){const styles=(p.entries||[]).filter(id=>AtlasThemes.byId[id]);const themes=styles.map(id=>AtlasThemes.tokensJSON(AtlasThemes.byId[id],'light'));const motion=store.get('atlasMotionTokens',[]);return {project:p.name,platform:p.platform,stage:p.stage,styles:themes,motion};}
 function tokens(kind){const p=project();if(!p)return alertOnce('Open a project first.');const t=projectTokens(p);const slug=p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'project';
  if(kind==='json')return download(`${slug}-tokens.json`,new Blob([JSON.stringify(t,null,2)],{type:'application/json'}));
  let css=`/* ${p.name} · design tokens from Visual & Motion Atlas */\n:root{\n`;t.styles.forEach((s,i)=>{const pre=i?`--${s.id.toLowerCase()}-`:'--';Object.entries(s.color).forEach(([k,v])=>css+=`  ${pre}color-${k.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())}: ${v};\n`);css+=`  ${pre}font-display: "${s.type.display}";\n  ${pre}font-body: "${s.type.body}";\n  ${pre}radius: ${typeof s.shape.radius==='number'?s.shape.radius+'px':s.shape.radius};\n`;});
  t.motion.forEach(m=>css+=`  --${m.name}-easing: ${m.easing};\n  --${m.name}-duration: ${m.duration}ms;\n`);
  if(!t.styles.length&&!t.motion.length)css+='  /* Add a visual style (S01–S22) to the project, or save motion tokens in the Animation studio. */\n';
  download(`${slug}-tokens.css`,new Blob([css+'}\n'],{type:'text/css'}));}
 function alertOnce(msg){const s=$('#projectStatus')||$('#projects [role=status]');if(s)s.textContent=msg;}
 async function moodboard(){const p=project();if(!p)return alertOnce('Open a project first.');
  const W=1600,H=1000,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  await document.fonts?.ready;x.fillStyle='#f2f4f7';x.fillRect(0,0,W,H);
  x.fillStyle='#0d1220';x.font='300 64px "Cormorant Garamond", Georgia, serif';x.fillText(p.name,64,110);
  x.font='500 16px "JetBrains Mono", monospace';x.fillStyle='#4a5466';x.fillText(`${(p.platform||'').toUpperCase()} · ${(p.stage||'').toUpperCase()} · ${(p.entries||[]).length} ENTRIES`,66,150);
  const fxE=id=>{const f=window.EffectsLab?.effects.find(e=>e.id===id);return f&&{id:f.id,title:f.name,group:'Landing effects'};};const entries=(p.entries||[]).map(id=>findE(id)||fxE(id)).filter(Boolean).slice(0,12);const fit=(s,w)=>{if(x.measureText(s).width<=w)return s;while(s.length>1&&x.measureText(s+'…').width>w)s=s.slice(0,-1);return s.trimEnd()+'…';};
  const cols=4,gw=(W-64*2-24*3)/cols,gh=300;
  const load=src=>new Promise(r=>{const im=new Image();im.onload=()=>r(im);im.onerror=()=>r(null);im.src=src;});
  for(let i=0;i<entries.length;i++){const e=entries[i];const cx=64+(i%cols)*(gw+24),cy=190+Math.floor(i/cols)*(gh+54);if(cy+gh>H-60)break;
   x.save();x.beginPath();x.roundRect?x.roundRect(cx,cy,gw,gh-40,14):x.rect(cx,cy,gw,gh-40);x.clip();
   const t=AtlasThemes.byId[e.id];
   if(e.image?.url){const im=await load(e.image.url);if(im){const cols2=e.image.columns||2,rows2=e.image.rows||2,sw=im.width/cols2,sh=im.height/rows2,sx=(e.image.index%cols2)*sw,sy=Math.floor(e.image.index/cols2)*sh;const s=Math.max(gw/sw,(gh-40)/sh);x.drawImage(im,sx,sy,sw,sh,cx+(gw-sw*s)/2,cy+(gh-40-sh*s)/2,sw*s,sh*s);}}
   else if(t){x.fillStyle=t.light.bg;x.fillRect(cx,cy,gw,gh-40);[t.light.accent,t.light.text,t.light.success,t.light.danger].forEach((col,k)=>{x.fillStyle=col;x.beginPath();x.arc(cx+30+k*36,cy+40,13,0,7);x.fill();});x.fillStyle=t.light.text;x.font=`600 30px "${t.fonts.display}", Georgia, serif`;x.fillText(fit(t.name,gw-48),cx+24,cy+gh-80);}
   else{const g=x.createLinearGradient(cx,cy,cx+gw,cy+gh);g.addColorStop(0,'#0d1220');g.addColorStop(1,'#1e3a5f');x.fillStyle=g;x.fillRect(cx,cy,gw,gh-40);x.fillStyle='#eef2f8';x.font='500 15px "JetBrains Mono", monospace';x.fillText(e.id,cx+22,cy+36);x.font='300 34px "Cormorant Garamond", Georgia, serif';x.fillText(fit(e.title,gw-44),cx+22,cy+gh-80);}
   x.restore();x.fillStyle='#0d1220';x.font='400 22px "Cormorant Garamond", Georgia, serif';x.fillText(fit(e.title,gw),cx,cy+gh-10);x.fillStyle='#4a5466';x.font='500 12px "JetBrains Mono", monospace';x.fillText(`${e.id} · ${(e.group||'').toUpperCase()}`,cx,cy+gh+12);}
  if(!entries.length){x.fillStyle='#4a5466';x.font='400 24px Manrope, sans-serif';x.fillText('Add styles, effects and references to this project to fill the board.',64,260);}
  x.fillStyle='#4a5466';x.font='500 12px "JetBrains Mono", monospace';x.fillText('VISUAL & MOTION ATLAS · MOODBOARD',64,H-32);
  c.toBlob(b=>download(`${(p.name||'project').replace(/\s+/g,'-').toLowerCase()}-moodboard.png`,b),'image/png');}

 /* ---------- 5. Offline ---------- */
 if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));

 /* ---------- wiring ---------- */
 function tick(){buildCompare();projectTools();finderButton();}
 const start=()=>{tick();new MutationObserver(()=>{clearTimeout(start.t);start.t=setTimeout(tick,150);}).observe(document.getElementById('main')||document.body,{childList:true,subtree:true});};
 if(document.readyState!=='loading')start();else addEventListener('DOMContentLoaded',start);
})();
