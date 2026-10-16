/* D25 Clearspace: smoked-glass dashboard (Orbit). Every glass element carries its own tinted surface so it reads on light and dark pages. */
(()=>{
const P={
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
 home:'<path d="M3.5 10.2 12 3.5l8.5 6.7V19a1.6 1.6 0 0 1-1.6 1.6h-4.4v-6h-5v6H5.1A1.6 1.6 0 0 1 3.5 19z"/>',
 projects:'<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="m7.5 14 3-3 2.5 2 3.5-4"/>',
 tasks:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8.5 12.2 2.4 2.4 4.8-5"/>',
 cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
 team:'<circle cx="9" cy="8.5" r="3.5"/><path d="M2.8 20c.6-3.6 3-5.6 6.2-5.6s5.6 2 6.2 5.6"/><path d="M15.5 5.3a3.4 3.4 0 0 1 0 6.4M17.6 14.7c2 .7 3.3 2.5 3.6 5.3"/>',
 chart:'<path d="M4 20V11M9 20V5M14 20v-7M19 20V8"/>',
 msg:'<path d="M20.5 14.5a2 2 0 0 1-2 2H8.2L4 20.3V6a2 2 0 0 1 2-2h12.5a2 2 0 0 1 2 2z"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.1a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1h.1a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 check:'<path d="m6.5 12.5 3.6 3.6 7.4-8"/>',
 bell:'<path d="M18 8.5a6 6 0 0 0-12 0c0 7-3 8.5-3 8.5h18s-3-1.5-3-8.5"/><path d="M13.7 20.5a2 2 0 0 1-3.4 0"/>'
};
const I=(n,s=20)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
/* small illustrated portraits (crisper than the mockup's 30px AI faces) */
const AV={
 olivia:['#d9dde6','#efc9b0','#1d1a1c','#f4f1ee',1],
 a:['#cfd6e2','#e9bea0','#2a211d','#5b6474',1],b:['#e4d6c8','#d9a383','#6b4a35','#c6b5a2',0],c:['#c9d3dc','#f1cfb7','#3a2c26','#2f3440',0],
 d:['#e8d9cf','#c88f6d','#3d2b22','#7a5a49',1],e:['#d2dbe4','#efc6a8','#16130f','#3b3f48',1],f:['#2b2f36','#e2b393','#14110f','#e9e6e2',1],
 g:['#d6dde3','#f0c9a9','#4a3426','#8e8073',1],h:['#e2d5cc','#d29a77','#231a16','#40454f',0],i:['#252a31','#e8bfa0','#0f0d0c','#cbc7c2',0]
};
const av=(k)=>{const [bg,sk,hr,sh,lg]=AV[k];return `<svg viewBox="5 5 30 30" aria-hidden="true"><rect width="40" height="40" fill="${bg}"/>${lg?`<path d="M10.5 33c-1-11 2-22 9.5-22s10.5 11 9.5 22z" fill="${hr}"/>`:''}<path d="M5 42c1-7.6 7-10.6 15-10.6S34 34.4 35 42z" fill="${sh}"/><rect x="17" y="23" width="6" height="9" rx="3" fill="${sk}" filter="brightness(.92)"/><ellipse cx="20" cy="18.6" rx="6.3" ry="7.4" fill="${sk}"/><path d="${lg?'M13.4 19.5c-.6-6.4 2.6-9.6 6.6-9.6s7.3 3 6.7 9.6c-1.6-3-4.6-4.6-7.6-5-1.4 2-3.4 3.8-5.7 5z':'M13.6 18c-.8-5.6 2.4-8.6 6.4-8.6s7.2 3 6.4 8.6c-1-2.4-2.6-3.6-4.4-4-2.6 1.2-5.2 1.6-8.4 4z'}" fill="${hr}"/></svg>`;};
const stack=(ks,names)=>`<div class="stack" role="group" aria-label="Team: ${names.join(', ')}">${ks.map((k,i)=>`<span class="av" tabindex="0" title="${names[i]}">${av(k)}</span>`).join('')}</div>`;
const NAV=[['search','Search'],['home','Home'],['projects','Projects'],['tasks','Tasks'],['cal','Calendar'],['team','Team'],['chart','Analytics'],['msg','Messages',3],['gear','Settings']];
const nav=(list,active)=>`<ul class="nav">${list.map(([ic,t,b])=>`<li><a href="#" class="ni"${t===active?' aria-current="page"':''}>${I(ic)}<span>${t}</span>${b?`<span class="badge" aria-label="${b} unread">${b}</span>`:''}</a></li>`).join('')}</ul>`;
const navInit=root=>root.querySelectorAll('.ni').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();if(a.textContent.trim()==='Search'&&root.querySelector('.srch'))return;root.querySelectorAll('.ni').forEach(x=>x.removeAttribute('aria-current'));a.setAttribute('aria-current','page');}));
const profile=`<div class="prof"><span class="pav">${av('olivia')}</span><div><b>Olivia Carter</b><small>Product Designer</small></div></div>`;
const ring=(p)=>{const c=2*Math.PI*21;return `<svg class="ring" viewBox="0 0 52 52" role="img" aria-label="${p}% complete"><circle cx="26" cy="26" r="21" class="trk"/><circle cx="26" cy="26" r="21" class="val" style="--c:${c.toFixed(1)};--o:${(c*(1-p/100)).toFixed(1)}" transform="rotate(-90 26 26)"/></svg>`;};
const tags=(t)=>`<div class="tags">${t.map(x=>`<span class="tag">${x}</span>`).join('')}</div>`;
const bar=(p)=>`<div class="prog"><div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="Progress"><i style="width:${p}%"></i></div><span>${p}%</span></div>`;
const ROWS=[['aurora','Aurora Brand Redesign',['Brand','Design','Marketing'],76,'Apr 30',['a','b','c'],['Maya Lin','Jonah Price','Sam Ortiz']],
 ['lumen','Lumen Mobile App',['Product','UI/UX','Development'],52,'May 14',['d','e','f'],['Priya Shah','Ava Chen','Noor Ali']],
 ['sage','Sage Marketing Campaign',['Marketing','Content','Social'],24,'May 2',['g','h','i'],['Elena Ruiz','Tom Becker','Leo Park']]];
const row=([img,t,tg,p,due,ks,nm])=>`<a href="#" class="row"><img class="thumb" src="{{img}}/D25-${img}.webp" alt="" width="120" height="100"><div class="mid"><b class="rt">${t}</b>${tags(tg)}${bar(p)}</div><div class="end">${stack(ks,nm)}<span class="due">Due ${due}</span></div></a>`;
const metric=(ic,label,val,sub,ok)=>`<div class="glass met"><div class="mh"><span class="chip${ok?' ok':''}">${I(ic,18)}</span><span>${label}</span></div><div class="mv">${val}</div><div class="ms">${sub}</div></div>`;
const progCard=`<div class="glass met pc"><div class="pch">${ring(76)}<span>Progress</span></div><div class="mv">76%</div><div class="ms">+12% this month</div></div>`;
const noA=root=>root.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));

SysComponents.add({
 system:'D25',
 fonts:['Plus+Jakarta+Sans:wght@400;500;600;700'],
 css:`.sc-D25{--t:#fff;--m:rgba(255,255,255,.72);--line:rgba(255,255,255,.16);--cyan:#9be4ea;--lav:#d9d0f2;--coral:#f0716b;font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:var(--t);font-size:15px;letter-spacing:-.005em}
.glass{position:relative;border-radius:22px;color:var(--t);background:linear-gradient(180deg,rgba(255,255,255,.07),transparent 38%),radial-gradient(120% 85% at 0% 0%,rgba(176,170,222,.32),transparent 58%),radial-gradient(110% 80% at 100% 100%,rgba(226,160,104,.3),transparent 62%),radial-gradient(90% 70% at 100% 0%,rgba(120,150,170,.2),transparent 60%),linear-gradient(170deg,rgba(64,69,80,.86),rgba(36,38,44,.9));border:1px solid rgba(255,255,255,.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.22),inset 0 0 0 1px rgba(255,255,255,.03),0 24px 48px -24px rgba(10,12,20,.55);-webkit-backdrop-filter:blur(26px) saturate(150%);backdrop-filter:blur(26px) saturate(150%)}
.ic{flex:none}
a{text-decoration:none}
a:focus-visible,button:focus-visible,input:focus-visible,.av:focus-visible,.tag:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
.nav{list-style:none;margin:0;padding:0;display:grid;gap:4px}
.ni{display:flex;align-items:center;gap:14px;height:46px;padding:0 14px;border-radius:13px;color:rgba(255,255,255,.86);font-weight:500;border:1px solid transparent;transition:background .2s,color .2s,border-color .2s}
.ni:hover{background:rgba(255,255,255,.07);color:#fff}
.ni[aria-current]{background:linear-gradient(180deg,rgba(255,255,255,.24),rgba(255,255,255,.13));border-color:rgba(255,255,255,.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 6px 16px -8px rgba(0,0,0,.4);color:#fff;font-weight:600}
.ni[aria-current] .ic path{fill:rgba(255,255,255,.95)}
.ni[aria-current] .ic rect{fill:rgba(255,255,255,.18)}
.badge{margin-left:auto;display:grid;place-items:center;min-width:24px;height:24px;padding:0 6px;border-radius:99px;background:linear-gradient(180deg,#f58a83,#ec5f5a);color:#fff;font-size:13px;font-weight:700;box-shadow:0 4px 12px -4px rgba(236,95,90,.8),inset 0 1px 0 rgba(255,255,255,.35)}
.prof{display:flex;align-items:center;gap:13px}
.prof b{display:block;font-size:16px;font-weight:600}.prof small{display:block;font-size:13px;color:var(--m);margin-top:2px}
.pav{width:46px;height:46px;border-radius:50%;overflow:hidden;flex:none;border:2px solid rgba(255,255,255,.85);box-shadow:0 4px 12px -4px rgba(0,0,0,.5)}
.pav svg,.av svg{width:100%;height:100%}
.chip{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.1)}
.chip.ok{background:rgba(120,190,140,.3);color:#d6f5dc}
.met{padding:20px 22px 22px;border-radius:18px;transition:transform .25s,border-color .25s}
.met:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.32)}
.mh{display:flex;align-items:center;gap:12px;font-size:14px;font-weight:500;color:rgba(255,255,255,.88)}
.mv{font-size:34px;font-weight:500;letter-spacing:-.02em;margin:22px 0 6px;line-height:1}
.ms{font-size:14px;color:var(--m)}
.ring{width:54px;height:54px}
.ring circle{fill:none;stroke-width:5}
.ring .trk{stroke:rgba(255,255,255,.17)}
.ring .val{stroke:#fff;stroke-linecap:round;stroke-dasharray:var(--c);stroke-dashoffset:var(--o);animation:ringIn 1.3s cubic-bezier(.2,.7,.2,1) both}
@keyframes ringIn{from{stroke-dashoffset:var(--c)}}
.pc .pch{display:flex;align-items:flex-start;gap:16px;font-size:14px;font-weight:500}
.pc .pch span{margin-top:6px}.pc .mv{margin-top:12px;font-size:28px}
.tags{display:flex;gap:8px;flex-wrap:wrap}
.tag{display:inline-flex;align-items:center;height:26px;padding:0 13px;border-radius:99px;font-size:12.5px;font-weight:500;color:rgba(255,255,255,.9);background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.1)}
.prog{display:flex;align-items:center;gap:18px}
.bar{flex:1;height:6px;border-radius:99px;background:rgba(255,255,255,.14);overflow:hidden}
.bar i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#86d6df,#c6eef2 60%,#f2f2fb);box-shadow:0 0 12px rgba(155,228,234,.55);transform-origin:left;animation:grow 1.2s cubic-bezier(.2,.7,.2,1) both}
@keyframes grow{from{transform:scaleX(0)}}
.prog span{font-size:14px;font-weight:500;min-width:34px;text-align:right}
.stack{display:flex}
.av{width:38px;height:38px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.92);margin-left:-11px;box-shadow:0 4px 10px -4px rgba(0,0,0,.5);transition:transform .2s;position:relative;background:#ccc}
.av:first-child{margin-left:0}
.av:hover,.av:focus-visible{transform:translateY(-3px);z-index:2}
.row{display:grid;grid-template-columns:120px 1fr 120px;gap:30px;align-items:center;padding:16px 10px;margin:0 -10px;border-radius:14px;color:var(--t);transition:background .2s}
.row:hover{background:rgba(255,255,255,.06)}
.thumb{width:120px;height:100px;object-fit:cover;border-radius:10px;box-shadow:0 8px 18px -8px rgba(0,0,0,.6)}
.mid{display:grid;gap:12px}
.rt{font-size:18px;font-weight:600;letter-spacing:-.01em}
.end{display:grid;justify-items:start;gap:14px}
.due{font-size:15px;font-weight:500}`,
 items:{
  X045:{w:272,html:`<aside class="glass side"><div class="logo"><span class="orb"></span>Orbit</div>${nav(NAV,'Home')}<div class="sp"></div>${profile}</aside>`,
   css:`.side{display:flex;flex-direction:column;min-height:660px;padding:26px 16px 22px;border-radius:24px}.logo{display:flex;align-items:center;gap:14px;font-size:27px;font-weight:500;letter-spacing:-.02em;padding:0 8px 30px}.orb{width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0,#e9e2f4 22%,#b7a7d6 55%,#7b6e9c 100%);box-shadow:0 6px 16px -6px rgba(180,160,230,.8),inset -3px -4px 8px rgba(80,60,120,.35)}.sp{flex:1;min-height:30px}.prof{padding:0 6px}`,
   init:navInit},
  X046:{w:300,html:`<label class="glass srch">${I('search',20)}<input type="search" placeholder="Search" aria-label="Search projects"><kbd>⌘K</kbd></label>`,
   css:`.srch{display:flex;align-items:center;gap:12px;height:50px;padding:0 10px 0 16px;border-radius:15px;cursor:text;transition:border-color .2s,box-shadow .2s}.srch:focus-within{border-color:rgba(155,228,234,.6);box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 0 0 4px rgba(155,228,234,.16),0 24px 48px -24px rgba(10,12,20,.55)}.srch input{flex:1;min-width:0;background:none;border:0;outline:0;color:#fff;font-size:15px;font-weight:500}.srch input::placeholder{color:rgba(255,255,255,.82)}.srch input::-webkit-search-cancel-button{filter:invert(1)}.srch kbd{font:600 11.5px 'Plus Jakarta Sans',sans-serif;color:var(--m);padding:4px 7px;border-radius:7px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07)}`},
  X047:{w:272,html:`<nav class="glass grp" aria-label="Main">${nav(NAV.slice(1,4),'Home')}</nav>`,css:`.grp{padding:10px;border-radius:20px}`,init:navInit},
  X048:{w:280,html:`<a href="#" class="glass pcard">${profile}<svg class="ic more" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5.5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="18.5" r="1.6"/></svg></a>`,
   css:`.pcard{display:flex;align-items:center;justify-content:space-between;padding:14px 14px 14px 16px;border-radius:20px;color:var(--t);transition:border-color .2s}.pcard:hover{border-color:rgba(255,255,255,.34)}.more{color:var(--m)}`,init:noA},
  X050:{w:0,html:`<button class="np">${I('plus',20)}New Project</button>`,
   css:`.np{display:inline-flex;align-items:center;gap:12px;height:56px;padding:0 30px 0 24px;border-radius:16px;font-size:17px;font-weight:600;letter-spacing:-.01em;color:#1e1b2e;background:linear-gradient(135deg,#f6f3fd,#e3dcf6 45%,#cbbfee);border:1px solid rgba(255,255,255,.85);box-shadow:inset 0 1px 0 #fff,0 10px 26px -10px rgba(130,105,200,.75),0 2px 6px -2px rgba(40,30,80,.25);transition:transform .15s,box-shadow .2s,filter .2s}.np:hover{filter:brightness(1.04);box-shadow:inset 0 1px 0 #fff,0 14px 32px -10px rgba(130,105,200,.85),0 2px 6px -2px rgba(40,30,80,.25)}.np:active{transform:translateY(1px) scale(.985)}.np .ic{stroke-width:2.2}`},
  X051:{w:820,html:`<div class="mets">${metric('home','Projects','12','3 in progress')}${metric('check','Tasks','28','6 due this week',1)}${metric('team','Team','8','Active members')}${progCard}</div>`,
   css:`.mets{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}`},
  X052:{w:210,html:progCard},
  X053:{w:820,html:`<section class="glass list"><header><h3>Active Projects</h3><a href="#" class="va">View all${I('arrow',18)}</a></header>${ROWS.map(row).join('')}</section>`,
   css:`.list{padding:26px 32px 14px;border-radius:24px}.list header{display:flex;align-items:center;justify-content:space-between;padding-bottom:18px;border-bottom:1px solid var(--line)}.list h3{margin:0;font-size:23px;font-weight:600;letter-spacing:-.015em}.va{display:inline-flex;align-items:center;gap:8px;color:#fff;font-weight:500;font-size:15px}.va:hover .ic{transform:translateX(3px)}.va .ic{transition:transform .2s}.list .row+.row{border-top:1px solid var(--line);border-radius:0}.list .row{margin:0;padding:18px 0}.list .row:hover{background:linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)}`,init:noA},
  X054:{w:760,html:`<div class="glass one">${row(ROWS[0])}</div>`,css:`.one{padding:8px 26px;border-radius:20px}`,init:noA},
  X055:{w:0,html:`<div class="glass tray" role="group" aria-label="Filter by tag">${['Brand','Design','Marketing'].map((t,i)=>`<button class="tag" aria-pressed="${i<1}">${t}</button>`).join('')}</div>`,
   css:`.tray{display:inline-flex;gap:8px;padding:8px;border-radius:99px}.tray .tag{cursor:pointer;height:30px;padding:0 15px;font-size:13px;transition:background .2s,color .2s,border-color .2s}.tray .tag:hover{background:rgba(255,255,255,.18)}.tray .tag[aria-pressed=true]{background:rgba(255,255,255,.9);color:#23232b;border-color:#fff}`,
   init(root){root.querySelectorAll('.tag').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')));}},
  X056:{w:420,html:`<div class="glass pp"><div class="ph"><b>Aurora Brand Redesign</b><span>Due Apr 30</span></div>${bar(76)}</div>`,
   css:`.pp{padding:18px 22px 20px;border-radius:18px;display:grid;gap:14px}.ph{display:flex;justify-content:space-between;align-items:baseline;font-size:14px}.ph b{font-weight:600;font-size:15px}.ph span{color:var(--m)}`},
  X057:{w:0,html:stack(['a','b','c'],['Maya Lin','Jonah Price','Sam Ortiz']).replace('</div>','<span class="more">+4</span></div>'),
   css:`.stack .av{width:46px;height:46px;margin-left:-13px;border-width:2.5px}.stack .av:first-child{margin-left:0}.more{width:46px;height:46px;margin-left:-13px;border-radius:50%;display:grid;place-items:center;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(170deg,#5a5f6b,#34373e);border:2.5px solid rgba(255,255,255,.92);box-shadow:0 4px 10px -4px rgba(0,0,0,.5)}`},
  X058:{w:0,html:`<button class="mb" aria-label="Messages, 3 unread">${I('msg',24)}<span class="badge">3</span></button>`,
   css:`.mb{position:relative;width:56px;height:56px;border-radius:18px;display:grid;place-items:center;color:#fff;background:radial-gradient(120% 90% at 0 0,rgba(170,180,210,.28),transparent 60%),linear-gradient(170deg,rgba(66,71,82,.9),rgba(38,40,46,.92));border:1px solid rgba(255,255,255,.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 14px 30px -14px rgba(10,12,20,.6);transition:transform .15s}.mb:hover{transform:translateY(-1px)}.mb:active{transform:scale(.96)}.mb .badge{position:absolute;top:-8px;right:-8px;min-width:26px;height:26px;margin:0;border:2px solid rgba(255,255,255,.9);animation:pop .5s cubic-bezier(.3,1.6,.5,1) both .2s}@keyframes pop{from{transform:scale(0)}}`,
   init(root){const b=root.querySelector('.mb'),s=b.querySelector('.badge');b.addEventListener('click',()=>{s.hidden=!s.hidden;b.setAttribute('aria-label',s.hidden?'Messages':'Messages, 3 unread');});}}
 }
});
})();
