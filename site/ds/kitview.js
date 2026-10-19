'use strict';
/* 01 Design System · kit view. Renders any 01 kit in the theme-kit format:
   live hero, colour with contrast, type, a component sheet re-tokened to the kit, logo lockups,
   feed styles, assets, voice and rules, and a one-click ZIP. Used by resources.html and kits.html.
   KitView.render(kit, element) -> {stop()} ; kit shape is documented at the bottom of this file. */
window.KitView=(()=>{
 const E=s=>DS.esc(s),I=n=>UI.icon(n);
 const svgURL=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
 const WORD='M44 -354Q44 -471 75.0 -554.5Q106 -638 164.0 -682.0Q222 -726 300 -726Q378 -726 436.0 -682.0Q494 -638 525.0 -554.5Q556 -471 556 -354Q556 -237 525.0 -154.0Q494 -71 436.0 -27.5Q378 16 300 16Q222 16 164.0 -27.5Q106 -71 75.0 -154.0Q44 -237 44 -354ZM428 -354Q428 -432 414 -491L225 -134Q255 -96 300 -96Q361 -96 394.5 -163.5Q428 -231 428 -354ZM186 -219 375 -576Q345 -614 300 -614Q239 -614 205.5 -546.0Q172 -478 172 -354Q172 -277 186 -219Z M648 -111H866V-483H684V-584H770Q831 -584 857.5 -612.5Q884 -641 884 -710H988V-111H1152V0H648Z M1248 -142Q1248 -206 1290.0 -244.5Q1332 -283 1409 -299L1575 -334Q1575 -442 1481 -442Q1396 -442 1379 -366L1257 -374Q1272 -454 1331.0 -501.0Q1390 -548 1481 -548Q1583 -548 1638.5 -490.0Q1694 -432 1694 -326V-137Q1694 -117 1702.0 -109.5Q1710 -102 1728 -102H1756V0Q1740 4 1707 4Q1610 4 1590 -79Q1572 -38 1529.0 -13.0Q1486 12 1431 12Q1381 12 1339.0 -6.5Q1297 -25 1272.5 -60.0Q1248 -95 1248 -142ZM1575 -206V-243L1442 -216Q1406 -209 1389.0 -192.5Q1372 -176 1372 -150Q1372 -121 1391.0 -104.5Q1410 -88 1446 -88Q1505 -88 1540.0 -120.0Q1575 -152 1575 -206Z M1868 -102H2076V-434H1878V-536H2194V-102H2372V0H1868ZM2071 -714H2193V-604H2071Z';
 function wordmark(ink){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="44 -726 2328 742" width="466" height="148" role="img" aria-label="01ai"><title>01ai</title><path fill="${ink}" d="${WORD}"/></svg>`}
 function mark(bg,ink,dot,line){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="256" height="256" role="img" aria-label="01"><title>01</title><rect width="128" height="128" rx="26" fill="${bg}"/><rect x=".75" y=".75" width="126.5" height="126.5" rx="25.25" fill="none" stroke="${line}" stroke-width="1.5"/><g transform="translate(17.18 86.72) scale(.064)"><path fill="${ink}" d="M44 -354Q44 -471 75.0 -554.5Q106 -638 164.0 -682.0Q222 -726 300 -726Q378 -726 436.0 -682.0Q494 -638 525.0 -554.5Q556 -471 556 -354Q556 -237 525.0 -154.0Q494 -71 436.0 -27.5Q378 16 300 16Q222 16 164.0 -27.5Q106 -71 75.0 -154.0Q44 -237 44 -354ZM428 -354Q428 -432 414 -491L225 -134Q255 -96 300 -96Q361 -96 394.5 -163.5Q428 -231 428 -354ZM186 -219 375 -576Q345 -614 300 -614Q239 -614 205.5 -546.0Q172 -478 172 -354Q172 -277 186 -219Z M648 -111H866V-483H684V-584H770Q831 -584 857.5 -612.5Q884 -641 884 -710H988V-111H1152V0H648Z"/><path fill="${dot}" d="M1236 -104H1420V0H1236Z"/></g></svg>`}
 function vars(k){const c=k.c;return `--bg:${c.bg};--g-950:${c.bg};--g-900:${c.surface};--panel:${c.surface};--g-850:${c.raised};--g-800:${c.raised};--pt:${c.ink};--pt-2:${c.ink2};--pt-3:${c.mute};--cyan:${c.accent};--cyan-white:${c.accentHi||c.accent};--f-sans:${k.fonts.body};--f-mono:${k.fonts.mono};--kv-display:${k.fonts.display}`}
 function label(r){return r>=7?'AAA text':r>=4.5?'AA text':r>=3?'Large text / UI':'Decoration only'}
 let n=0;
 function render(k,el){const id='kv'+(++n),c=k.c,stops=[];
  const sw=k.colors.map(([nm,hex,role])=>{const r=DS.contrast(hex,c.bg);return `<button class="kv-chip" type="button" data-copy="${E(hex)}" data-copy-msg="Copied ${E(hex)}"><i style="background:${E(hex)}"></i><span><b>${E(nm)}</b><code>${E(hex.toUpperCase())}</code><small>${hex.toLowerCase()===c.bg.toLowerCase()?'Base':r.toFixed(1)+':1 · '+label(r)}</small><small>${E(role)}</small></span></button>`}).join('');
  const word=wordmark(c.ink,c.accent),mk=mark(c.surface,c.ink,c.accent,c.line);
  el.innerHTML=`
  <section class="kv-hero ${k.hero.type==='city'?'bg':'framed'}" aria-labelledby="${id}h">
   ${k.hero.type==='city'?`<canvas class="kv-bg" aria-hidden="true"></canvas>`:''}
   <div class="kv-in">
    <img class="kv-logo" src="${svgURL(word)}" alt="01ai" width="150" height="48">
    <p class="kv-badge">${E(k.no)} · ${E(k.mood)}</p>
    <h2 id="${id}h" class="kv-display">${E(k.headline||'The most powerful agentic system.')}</h2>
    <p class="kv-tag">${E(k.tagline)}</p>
    <div class="ds-row"><button class="u-btn solid lg" type="button" data-kv="zip">${I('file')}Download the kit</button><button class="u-btn lg" type="button" data-kv="css">Copy tokens</button>${k.live?`<a class="u-btn ghost lg" href="${E(k.live)}">Open live <span aria-hidden="true">→</span></a>`:''}<button class="u-btn ghost lg" type="button" data-kv="pause" aria-pressed="false">${I('pause')}Pause</button></div>
   </div>
   ${k.hero.type==='iframe'?`<div class="kv-frame"><div class="kv-chrome" aria-hidden="true"><i></i><i></i><i></i><span>${E(k.hero.label||k.hero.src)}</span></div><div class="kv-port"><iframe src="${E(k.hero.src)}" title="${E(k.name)}, running live" tabindex="-1" inert loading="lazy" width="1440" height="900"></iframe></div></div>`:''}
  </section>
  <section class="kv-sec" aria-labelledby="${id}c"><h2 id="${id}c">Colour</h2><p class="ds-lead">Select a swatch to copy it. Contrast is measured against this kit's background, ${E(c.bg.toUpperCase())}.</p><div class="kv-chips">${sw}</div></section>
  <section class="kv-sec" aria-labelledby="${id}t"><h2 id="${id}t">Type</h2><p class="ds-lead">${E(k.fonts.names.display)} for display${k.fonts.names.body!==k.fonts.names.display?`, ${E(k.fonts.names.body)} for reading`:''}, ${E(k.fonts.names.mono)} for the machine.</p>
   <div class="kv-type" style="${vars(k)}">
    <div class="kv-tbox"><p class="kv-display" style="font-size:clamp(40px,6vw,88px);line-height:.92;margin:0">Unyielding.</p><small>${E(k.fonts.names.display)} · display</small></div>
    <div class="kv-tbox"><p style="font:400 19px/1.5 var(--f-sans);color:var(--pt);margin:0">Coordinated. Adaptive. Unyielding. Connect once, and from then on the agents read it, write to it and act in it on your behalf.</p><small>${E(k.fonts.names.body)} · body</small></div>
    <div class="kv-tbox"><p style="font:500 13px/1.7 var(--f-mono);letter-spacing:.08em;color:var(--pt-2);margin:0">SERVER v1.0 // NODE: WAR ROOM // UPTIME 99.999%<br>CPU LOAD 63.2% · MODELS 1,042 · 0123456789</p><small>${E(k.fonts.names.mono)} · mono</small></div>
   </div>
   <div class="kv-scale" style="${vars(k)}">${[['Display','clamp(48px,7vw,112px)','.92','-.045em','The most powerful.'],['H1','clamp(36px,4.6vw,72px)','.96','-.04em','The best agents.'],['H2','clamp(26px,3vw,44px)','1.02','-.03em','Adaptive routing.'],['Body','17px','1.55','0','Right model, every token.']].map(([n,s,lh,ls,t],i)=>`<div><span class="u-cap">${n} · ${s}</span><p style="font-family:${i<3?'var(--kv-display)':'var(--f-sans)'};font-size:${s};line-height:${lh};letter-spacing:${ls};margin:0;color:var(--pt)">${t}</p></div>`).join('')}</div>
  </section>
  <section class="kv-sec" aria-labelledby="${id}k"><h2 id="${id}k">Component sheet</h2><p class="ds-lead">The real 01 components with this kit's tokens applied to them, nothing else changed.</p>
   <div class="kv-sheet" style="${vars(k)}">
    <div class="kv-cbox"><span class="u-cap">Buttons</span><div class="ds-row"><button class="u-btn solid" type="button">Run agents</button><button class="u-btn signal" type="button">${I('bolt')}Deploy</button><button class="u-btn" type="button">Secondary</button><button class="u-btn ghost" type="button">Ghost</button></div></div>
    <div class="kv-cbox"><span class="u-cap">Field</span><div class="u-field"><label class="u-label" for="${id}f">Agent name</label><input class="u-input" id="${id}f" value="Strategist-04"><p class="u-help">Shown in logs and the swarm.</p></div></div>
    <div class="kv-cbox"><span class="u-cap">Choices</span><div class="ds-row" style="gap:18px"><label class="u-switch"><input type="checkbox" role="switch" checked> Sound</label><label class="u-check"><input type="checkbox" checked> All tools</label><span class="u-seg" role="group" aria-label="Range"><button type="button" aria-pressed="true">24h</button><button type="button" aria-pressed="false">7d</button></span></div></div>
    <div class="kv-cbox"><span class="u-cap">Status &amp; tags</span><div class="ds-row"><span class="u-status"><i class="u-dot live"></i>Live</span><span class="u-status"><i class="u-dot busy"></i>Working</span><span class="u-tag cyan">Routing</span><span class="u-tag amber">Review</span></div></div>
    <div class="kv-cbox"><span class="u-cap">Navigation</span><nav class="u-nav" aria-label="${E(k.name)} example"><a href="#${id}k" aria-current="page">${I('chat')}Chat</a><a href="#${id}k">${I('agents')}Agents <span class="n">38,940</span></a></nav></div>
    <div class="kv-cbox"><span class="u-cap">Message</span><div class="u-route"><span class="on"><i></i>ORION-4</span><span class="on"><i></i>KESTREL</span><span><i></i>NOVA-X</span></div><div class="u-tool"><b>Stripe</b> read 12,408 rows <em>✓</em></div></div>
   </div>
  </section>
  <section class="kv-sec" aria-labelledby="${id}f2"><h2 id="${id}f2">Feed styles</h2><p class="ds-lead">${E(k.feedNote||'The war-room feeds, set in this kit.')}</p>
   <div class="kv-feeds" style="${vars(k)}">
    <div class="u-frame live"><p class="u-cap" style="margin:0 0 10px">// System telemetry</p><div class="u-stat"><b data-kvv="cpu">63.2%</b><span class="d">CPU LOAD</span></div><div class="u-meter" data-kvm="cpu" style="--v:63%;margin-top:12px"><i></i></div></div>
    <div class="u-frame kv-wide"><p class="u-cap" style="margin:0 0 10px">// Node log</p><div role="log" aria-label="Node log" aria-live="off"><ol class="u-log" data-kvlog></ol></div></div>
    <div class="u-frame"><p class="u-cap" style="margin:0 0 10px">// Models online</p><p class="kv-display" style="margin:0;font-size:44px;line-height:1;color:var(--pt)" data-kvv="models">1,042</p><p class="u-mono u-muted" style="margin:6px 0 0">AND MORE ALWAYS COMING</p></div>
   </div>
   ${k.hooks&&k.hooks.length?`<ul class="ds-list">${k.hooks.map(h=>`<li>${h}</li>`).join('')}</ul>`:''}
  </section>
  <section class="kv-sec" aria-labelledby="${id}a"><h2 id="${id}a">Assets</h2><p class="ds-lead">Vector, generated for this kit's colours. Download one, or everything in the ZIP.</p>
   <div class="kv-assets">
    <div class="kv-abox"><div class="v" style="background:${E(c.bg)}"><img src="${svgURL(word)}" alt="01ai wordmark in ${E(k.name)} colours" width="160" height="77"></div><div class="m"><b>Wordmark</b><button class="u-btn sm" type="button" data-dl="word">SVG</button></div></div>
    <div class="kv-abox"><div class="v" style="background:${E(c.bg)}"><img src="${svgURL(mk)}" alt="01 mark in ${E(k.name)} colours" width="96" height="96"></div><div class="m"><b>Mark</b><button class="u-btn sm" type="button" data-dl="mark">SVG</button></div></div>
    <div class="kv-abox"><div class="v" style="background:${E(c.bg)};gap:14px;display:flex;align-items:center;justify-content:center;padding:16px"><img src="${svgURL(mk)}" alt="" width="44" height="44"><span class="kv-display" style="font-size:24px;line-height:1.05;color:${E(c.ink)};letter-spacing:-.02em">${E(k.lockup||k.name)}</span></div><div class="m"><b>Lockup</b><span class="u-mono u-muted">${E(k.fonts.names.display)}</span></div></div>
    ${k.poster?`<div class="kv-abox"><div class="v" style="padding:0"><img src="${E(k.poster)}" alt="${E(k.name)} preview" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div><div class="m"><b>Preview</b><a class="u-btn sm" href="${E(k.poster)}" download>WEBP</a></div></div>`:''}
    <div class="kv-abox"><div class="v kv-icons" style="color:${E(c.ink)};background:${E(c.bg)}">${['agents','route','chat','bolt','models','shield','chart','globe'].map(x=>I(x)).join('')}</div><div class="m"><b>${k.iconCount||47} icons in the ZIP</b><span class="u-mono u-muted">24 · 1.5 STROKE</span></div></div>
   </div>
  </section>
  <section class="kv-sec" aria-labelledby="${id}v"><h2 id="${id}v">Voice &amp; rules</h2>
   <div class="kv-rules"><div class="kv-voice">${k.voice.map(v=>`<q class="kv-display" style="color:${E(c.ink)}">${E(v)}</q>`).join('')}</div>
    <div class="ds-rules" style="grid-column:span 2"><div class="do"><h4>Do</h4><ul>${k.dos.map(x=>`<li>${E(x)}</li>`).join('')}</ul></div><div class="dont"><h4>Don't</h4><ul>${k.donts.map(x=>`<li>${E(x)}</li>`).join('')}</ul></div></div></div>
  </section>
  <section class="kv-sec kv-take" aria-labelledby="${id}z"><div><h2 id="${id}z">Take the whole kit</h2><ul class="ds-list">${k.contents.map(x=>`<li>${x}</li>`).join('')}</ul></div>
   <div class="kv-takeb"><button class="u-btn solid lg" type="button" data-kv="zip">${I('file')}Download .zip</button><button class="u-btn lg" type="button" data-kv="css">Copy tokens.css</button><button class="u-btn ghost lg" type="button" data-kv="prompt">Copy AI build prompt</button><p class="u-mono u-muted" data-kv-status role="status" aria-live="polite" style="margin:0"></p></div></section>`;
  /* behaviour */
  const $=s=>el.querySelector(s),$$=s=>[...el.querySelectorAll(s)];
  $$('[data-copy]').forEach(b=>b.onclick=()=>DS.copy(b.dataset.copy,b.dataset.copyMsg));
  $$('.u-seg button').forEach(b=>b.onclick=()=>$$('.u-seg button').forEach(x=>x.setAttribute('aria-pressed',x===b)));
  const st=$('[data-kv-status]');
  $$('[data-kv=zip]').forEach(b=>b.onclick=async()=>{b.classList.add('loading');b.setAttribute('aria-busy','true');st.textContent='PACKING '+k.name.toUpperCase()+'…';try{const files=await k.files();DS.save(DS.zip(files),k.zipName);st.textContent=`DOWNLOADED ${k.zipName.toUpperCase()} · ${files.length} FILES`;UI.toast('Kit downloaded',`${k.zipName} · ${files.length} files`,'ok')}catch(e){st.textContent='COULD NOT PACK THE KIT: '+e.message;UI.toast('Download failed',e.message,'err')}b.classList.remove('loading');b.removeAttribute('aria-busy')});
  $$('[data-kv=css]').forEach(b=>b.onclick=async()=>DS.copy(await k.tokensCSS(),'tokens.css copied'));
  $('[data-kv=prompt]').onclick=()=>DS.copy(prompt(k),'Prompt copied');
  const dl={word:[word,'01ai-wordmark.svg'],mark:[mk,'01-mark.svg']};
  $$('[data-dl]').forEach(b=>b.onclick=()=>{const [s,nm]=dl[b.dataset.dl];DS.save(new Blob([s],{type:'image/svg+xml'}),k.id+'-'+nm)});
  /* hero */
  let playing=!O1.reduce,api=null;const pb=$('[data-kv=pause]');
  const sync=()=>{pb.innerHTML=I(playing?'pause':'play')+(playing?'Pause':'Play');pb.setAttribute('aria-pressed',!playing);pb.setAttribute('aria-label',(playing?'Pause':'Play')+' the live background')};
  if(k.hero.type==='city'){const cv=$('.kv-bg');try{api=window.City3D&&City3D.start(cv,{seed:k.hero.seed||7,still:!playing,parallax:.5,traffic:1500,...(k.hero.opts||{})})}catch(e){}if(!api){cv.remove();pb.hidden=true}else{stops.push(()=>api.stop?api.stop():api.pause());pb.onclick=()=>{playing=!playing;playing?api.play():api.pause();sync()}}}
  else{const port=$('.kv-port'),fr=$('iframe',port);const fit=()=>{const s=port.clientWidth/1440;fr.style.transform=`scale(${s})`;port.style.height=900*s+'px'};const ro=new ResizeObserver(fit);ro.observe(port);fit();stops.push(()=>ro.disconnect());
   pb.onclick=()=>{try{const kb=fr.contentDocument.querySelector('.k-pause');if(kb){kb.click();playing=kb.getAttribute('aria-pressed')!=='true'}else playing=!playing}catch(e){playing=!playing}sync()};
   if(O1.reduce)pb.hidden=true}
  sync();
  /* feeds tick in steps */
  const L=[()=>`ROUTER-11 &gt;&gt; <b>ROUTE SWITCH</b> [ MODEL <em>HELIX-L</em> ]`,()=>`AGENT_${4000+(Math.random()*999|0)} &gt;&gt; <b>TOOL CALL</b> [ STRIPE <em>${UI.fmt(Math.random()*20000|0)} rows</em> ]`,()=>`SENTINEL-02 &gt;&gt; <span class="w">WAITING</span> [ APPROVAL ]`,()=>`SWARM &gt;&gt; <b>SPLIT</b> [ <em>+${2+(Math.random()*12|0)} agents</em> ]`];
  const lg=$('[data-kvlog]');for(let i=0;i<4;i++){const li=document.createElement('li');li.innerHTML=`<time>[${UI.now()}]</time> ${L[i]()}`;lg.append(li)}
  let cpu=63.2,mods=1042;const t=setInterval(()=>{if(!playing||!el.isConnected)return;cpu=Math.max(40,Math.min(92,cpu+(Math.random()-.5)*8));$('[data-kvv=cpu]').textContent=cpu.toFixed(1)+'%';$('[data-kvm=cpu]').style.setProperty('--v',cpu+'%');if(Math.random()<.3)$('[data-kvv=models]').textContent=UI.fmt(++mods);const li=document.createElement('li');li.className='new';li.innerHTML=`<time>[${UI.now()}]</time> ${L[Math.random()*L.length|0]()}`;lg.prepend(li);while(lg.children.length>4)lg.lastElementChild.remove()},1600);stops.push(()=>clearInterval(t));
  return {stop(){stops.forEach(f=>f())}}}
 function prompt(k){const c=k.c;return `Build a web page in the "${k.name}" kit of the 01 Design System (01ai). ${k.tagline}
Colours: background ${c.bg}, surface ${c.surface}, text ${c.ink}, body text ${c.ink2}, muted ${c.mute}, hairlines ${c.line}, signal ${c.accent}, live green #3CF29A, rare accents purple #A98BFF and amber #FFB547.
Type: display in ${k.fonts.names.display}, body in ${k.fonts.names.body}, machine labels and numbers in ${k.fonts.names.mono} capitals with open tracking (Google Fonts).
Headline: "The most powerful agentic system." Subline: "Coordinated. Adaptive. Unyielding." Set the headline huge, left and off-centre.
Hero: "city circuits", a motherboard drawn as a city at night, chips as towers, traces as streets, light as traffic, seen from a low, angled, off-centre camera. Never overhead, never symmetric.
Structure from 1px hairlines and corner ticks. No callout cards, no small headlines, never "by invitation only".
Motion: arrive along a trace, lock into place with cubic-bezier(.2,.9,.1,1), numbers tick in steps(6); everything instant under prefers-reduced-motion. Keep WCAG AA contrast and full keyboard access.`}
 return {render,wordmark,mark,prompt,svgURL};
})();
/* kit shape: {id,no,name,mood,tagline,headline?,live?,poster?,lockup?,
   hero:{type:'city',seed,opts}|{type:'iframe',src,label},
   c:{bg,surface,raised,ink,ink2,mute,line,accent,accentHi},
   colors:[[name,hex,role]], fonts:{display,body,mono,names:{display,body,mono}},
   feedNote, hooks:[html], voice:[], dos:[], donts:[], contents:[html], iconCount,
   files:async()=>[[path,data]], zipName, tokensCSS:async()=>string} */
