'use strict';
/* Product-screen previews for the eight established-system interpretations (D01–D08).
   Each is an original screen in the spirit of its system, not a copy of any product or kit.
   Colours come from the system's tokens (--sys-*), so "Customize this system" still recolours them.
   Type and spacing are in em and scale with the preview frame, so cards and the hub stay legible. */
(()=>{
 const I={
  home:'<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-6h6v6"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',bell:'<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',chev:'<path d="m9 6 6 6-6 6"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',doc:'<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/>',
  share:'<path d="M12 3v13M7 8l5-5 5 5M5 14v7h14v-7"/>',play:'<path d="M7 4v16l13-8z"/>',heart:'<path d="M12 20s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 5.8-8 11-8 11z"/>',
  check:'<path d="m5 12 4.5 4.5L19 7"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  inbox:'<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>',bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  pause:'<path d="M8 5v14M16 5v14"/>',skip:'<path d="M5 5v14l10-7zM18 5v14"/>',back:'<path d="M19 5v14L9 12zM6 5v14"/>',wave:'<path d="M2 12h3l2-6 3 12 3-9 2 5 2-2h5"/>',
 };
 const ic=(n,cls='')=>`<svg class="sp-i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]||''}</svg>`;
 const btn=(inert,label,act,cls='')=>inert?`<span class="sp-btn ${cls}">${label}</span>`:`<button type="button" class="sp-btn systemAction ${cls}" data-act="${act}">${label}</button>`;
 const S={};

 /* D01 · Apple-inspired functional glass: a desktop window over a wallpaper, translucent sidebar,
    large title, segmented control, grouped inset list, switches. */
 S.D01=inert=>`<div class="sp-wall"><div class="sp-win">
  <aside class="sp-side"><div class="sp-lights"><i></i><i></i><i></i></div><div class="sp-search">${ic('search')}<span>Search</span></div>
   <small>Favourites</small><a class="on">${ic('sun')}Today<em>4</em></a><a>${ic('cal')}Upcoming</a><a>${ic('star')}Starred</a>
   <small>Projects</small><a><i class="sp-dot" style="--d:#ff6b5e"></i>Garden journal</a><a><i class="sp-dot" style="--d:#ffb340"></i>Studio site</a><a><i class="sp-dot" style="--d:#34c759"></i>Field notes</a></aside>
  <main class="sp-main"><div class="sp-toolbar"><span class="sp-seg"><b>Day</b><span>Week</span><span>Month</span></span><span class="sp-tools">${ic('share')}${ic('plus')}</span></div>
   <p class="sp-eyebrow">Monday 14 October</p><h3 class="sp-largetitle">Today</h3>
   <div class="sp-group"><div class="sp-row"><i class="sp-chip" style="--c:#0a84ff">${ic('doc')}</i><span><b>Shape the first idea</b><em>Garden journal · 10:00</em></span>${ic('chev','sp-chev')}</div>
    <div class="sp-row"><i class="sp-chip" style="--c:#ff9f0a">${ic('star')}</i><span><b>Review three references</b><em>Studio site · 14:30</em></span>${ic('chev','sp-chev')}</div>
    <div class="sp-row"><i class="sp-chip" style="--c:#30d158">${ic('check')}</i><span><b>Send the direction</b><em>Done</em></span>${ic('chev','sp-chev')}</div></div>
   <div class="sp-group"><div class="sp-row"><span><b>Focus mode</b><em>Silence notifications until 12:00</em></span><span class="sp-switch on"><i></i></span></div>
    <div class="sp-row"><span><b>Show completed</b></span><span class="sp-switch"><i></i></span></div></div>
   <div class="sp-actions">${btn(inert,'New project','newProject','sp-primary')}${btn(inert,'Share','status','sp-plain')}</div></main></div></div>`;

 /* D02 · Material-inspired expressive: top app bar, filter chips, tonal cards, list with leading
    icons, extended FAB, navigation bar with an active indicator. */
 S.D02=inert=>`<div class="sp-m3"><div class="sp-appbar">${ic('grid')}<b>Today</b><span class="sp-avatar">IR</span></div>
  <h3 class="sp-m3title">A little more<br>done today.</h3>
  <div class="sp-chips"><span class="sel">${ic('check')}All</span><span>Design</span><span>Writing</span><span>Review</span></div>
  <div class="sp-tonal"><small>In progress</small><b>Design the first screen</b><div class="sp-progress"><i style="width:68%"></i></div><em>68% · due 16:00</em></div>
  <div class="sp-list"><div><i>${ic('doc')}</i><span><b>Write the brief</b><em>Creative sprint · 10:00</em></span><span class="sp-check on">${ic('check')}</span></div>
   <div><i>${ic('cal')}</i><span><b>Review the direction</b><em>Team check-in · 14:30</em></span><span class="sp-check"></span></div></div>
  <div class="sp-fabrow">${btn(inert,`${ic('plus')}New task`,'systemAdd','sp-fab')}</div>
  <nav class="sp-navbar"><a class="on"><i>${ic('home')}</i>Home</a><a><i>${ic('cal')}</i>Plan</a><a><i>${ic('inbox')}</i>Inbox</a><a><i>${ic('user')}</i>You</a></nav></div>`;

 /* D03 · Carbon-inspired enterprise: UI shell header, side nav, breadcrumb, tabs, KPI tiles and a
    data table with status tags. */
 S.D03=inert=>`<div class="sp-carbon"><header class="sp-shell"><b>Atlas <span>Platform</span></b><span class="sp-shellnav"><a class="on">Console</a><a>Deploy</a><a>Docs</a></span><span class="sp-shellicons">${ic('search')}${ic('bell')}${ic('user')}</span></header>
  <div class="sp-cbody"><aside class="sp-cside"><a class="on">Overview</a><a>Services</a><a>Incidents</a><a>Usage</a><a>Settings</a></aside>
   <main><p class="sp-crumb">Console / Production</p><h3 class="sp-ctitle">Deployment health</h3>
    <div class="sp-ctabs"><a class="on">Overview</a><a>Logs</a><a>Alerts</a></div>
    <div class="sp-tiles"><div><small>Availability · 30 d</small><b>99.98<span>%</span></b><svg viewBox="0 0 100 24" preserveAspectRatio="none"><path d="M0 16 10 14 20 15 30 9 40 12 50 8 60 10 70 5 80 7 90 4 100 6"/></svg></div><div><small>Requests / min</small><b>18.4<span>k</span></b><svg viewBox="0 0 100 24" preserveAspectRatio="none"><path d="M0 18 10 12 20 14 30 10 40 16 50 9 60 11 70 13 80 8 90 10 100 7"/></svg></div><div><small>Open incidents</small><b>2</b><em class="sp-tag red">1 critical</em></div></div>
    <table class="sp-table"><thead><tr><th>Service</th><th>Region</th><th>Status</th><th>Latency</th></tr></thead><tbody>
     <tr><td>api-gateway</td><td>eu-west</td><td><em class="sp-tag green">Healthy</em></td><td>42 ms</td></tr>
     <tr><td>render-worker</td><td>us-east</td><td><em class="sp-tag blue">Review</em></td><td>118 ms</td></tr>
     <tr><td>asset-store</td><td>ap-south</td><td><em class="sp-tag red">Degraded</em></td><td>310 ms</td></tr></tbody></table>
    <div class="sp-cactions">${btn(inert,'Run health check','systemCheck','sp-cbtn')}${btn(inert,'Export report','status','sp-cghost')}</div></main></div></div>`;

 /* D04 · Fluent-inspired workspace: title bar, acrylic navigation pane, command bar, document cards
    with people and a callout. */
 S.D04=inert=>`<div class="sp-fluent"><div class="sp-ftitle"><span class="sp-fapp">${ic('grid')}</span><b>Teamspace</b><span class="sp-fsearch">${ic('search')}Search documents</span><span class="sp-persona">AK</span></div>
  <div class="sp-fbody"><aside class="sp-fnav"><a class="on">${ic('home')}Home</a><a>${ic('doc')}Documents</a><a>${ic('user')}Shared</a><a>${ic('star')}Favourites</a><a>${ic('gear')}Settings</a></aside>
   <main><div class="sp-cmd"><span class="sp-fprimary">${ic('plus')}New</span><span>${ic('share')}Share</span><span>${ic('folder')}Move</span><span>${ic('more')}</span></div>
    <h3 class="sp-ftitle2">Recent</h3>
    <div class="sp-fcards">${[['Product direction','Edited 2 h ago','#0f6cbd'],['Brand guidelines','Edited yesterday','#c239b3'],['Launch plan','Edited Mon','#0e7a0d']].map(([t,s,c])=>`<div class="sp-fcard"><i style="--c:${c}">${ic('doc')}</i><b>${t}</b><em>${s}</em><span class="sp-faces"><span>AK</span><span>JM</span><span>+3</span></span></div>`).join('')}</div>
    <div class="sp-callout"><b>Keep the work visible</b><span>Pin a document to share it with the whole team.</span>${btn(inert,'Add a document note','systemAdd','sp-fbtn')}</div></main></div></div>`;

 /* D05 · Radix / shadcn-inspired minimal: dashboard with team switcher, stat cards, a bar chart,
    recent activity, badges and quiet buttons. */
 S.D05=inert=>`<div class="sp-shad"><div class="sp-snav"><span class="sp-team"><i></i>Atlas Studio ${ic('chev')}</span><a class="on">Overview</a><a>Projects</a><a>Settings</a><span class="sp-sinput">${ic('search')}Search…</span><span class="sp-savatar">IR</span></div>
  <div class="sp-shead"><h3>Dashboard</h3><span>${btn(inert,'Download','status','sp-soutline')}${btn(inert,'Create issue','systemAdd','sp-sprimary')}</span></div>
  <div class="sp-stats">${[['Total revenue','$45,231','+20.1% from last month'],['Subscriptions','+2,350','+180.1% from last month'],['Active now','573','+201 since last hour']].map(([a,b,c])=>`<div class="sp-card"><small>${a}</small><b>${b}</b><em>${c}</em></div>`).join('')}</div>
  <div class="sp-split"><div class="sp-card sp-chart"><small>Overview</small><div class="sp-bars">${[42,64,38,80,56,92,70,48,86,60,74,50].map(v=>`<i style="height:${v}%"></i>`).join('')}</div></div>
   <div class="sp-card sp-recent"><small>Recent sales</small>${[['OM','Olivia Martin','+$1,999'],['JL','Jackson Lee','+$39'],['IN','Isabella Nguyen','+$299']].map(([i,n,v])=>`<div><span class="sp-ini">${i}</span><b>${n}</b><em>${v}</em></div>`).join('')}<span class="sp-badge">3 new</span></div></div></div>`;

 /* D06 · Editorial product system: masthead, issue line, display headline, standfirst, byline,
    image with caption, two-column body with drop cap and a pull quote. */
 S.D06=inert=>`<div class="sp-ed"><div class="sp-mast"><span>Issue 024 · Autumn</span><b>FIELDNOTES</b><span>Subscribe</span></div><div class="sp-edrule"></div>
  <div class="sp-edgrid"><div class="sp-edhead"><p class="sp-kicker">Essay · Attention</p><h3>The art of paying attention.</h3><p class="sp-stand">A quiet place for considered ideas, useful observations and the details that matter.</p><p class="sp-byline">By Ada Rowe · 6 min read</p></div>
   <figure class="sp-edfig"><span style="background-image:url('assets/fx/garden.webp')"></span><figcaption>Morning light in the walled garden. Photograph from the archive.</figcaption></figure></div>
  <div class="sp-edbody"><p><b class="sp-drop">W</b>e notice more when we slow down. The first glance gives us shape; the second gives us texture; the third, if we wait for it, gives us meaning.</p>
   <blockquote>“Attention is the beginning of devotion.”</blockquote><p>Field notes are a practice, not a product: a habit of returning to the same place and seeing it again.</p></div>
  <div class="sp-edfoot"><span>Continue reading</span>${btn(inert,'Save reading note','systemAdd','sp-edbtn')}</div></div>`;

 /* D07 · Tactile neomorphic: soft raised and pressed surfaces, a dial with an arc, toggles and a
    slider, one strong accent. */
 S.D07=inert=>`<div class="sp-soft"><div class="sp-softtop"><span class="sp-raised sp-round">${ic('back')}</span><b>Listening room</b><span class="sp-raised sp-round">${ic('gear')}</span></div>
  <div class="sp-dialwrap"><div class="sp-dial sp-raised"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" class="trk"/><circle cx="60" cy="60" r="50" class="arc" pathLength="100" stroke-dasharray="64 100"/></svg><div class="sp-dialin sp-pressed"><b>64<small>%</small></b><span>Volume</span></div></div></div>
  <div class="sp-softrow"><span class="sp-raised sp-round">${ic('back')}</span><span class="sp-raised sp-round sp-big">${ic('pause')}</span><span class="sp-raised sp-round">${ic('skip')}</span></div>
  <div class="sp-softcards"><div class="sp-raised"><span>${ic('mic')}</span><b>Voice boost</b><span class="sp-toggle on"><i></i></span></div><div class="sp-raised"><span>${ic('wave')}</span><b>Room EQ</b><span class="sp-toggle"><i></i></span></div></div>
  <div class="sp-slider sp-pressed"><i style="width:58%"></i><b style="left:58%"></b></div>
  <div class="sp-softfoot">${btn(inert,'Enable focus mode','systemToggle','sp-softbtn')}</div></div>`;

 /* D08 · Cinematic cyber: HUD frame with corner brackets, radar sweep, live readouts, waveform,
    alert chip and scan lines. */
 S.D08=inert=>`<div class="sp-hud"><i class="sp-br tl"></i><i class="sp-br tr"></i><i class="sp-br bl"></i><i class="sp-br br"></i>
  <div class="sp-hudtop"><b>SIGNAL / CONTROL</b><span class="sp-live"><i></i>ONLINE</span><span>SECTOR 07 · 22:14:08</span></div>
  <div class="sp-hudgrid"><div class="sp-radar"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="31"/><circle cx="50" cy="50" r="16"/><path d="M50 4v92M4 50h92"/><circle class="blip" cx="66" cy="34" r="2.2"/><circle class="blip b2" cx="30" cy="62" r="1.8"/></svg><span class="sp-sweep"></span></div>
   <div class="sp-readouts"><div><small>FREQUENCY</small><b>128.40<span>MHz</span></b></div><div><small>SIGNAL</small><b>-42.6<span>dBm</span></b></div><div><small>LINK</small><b>STABLE</b><em class="sp-alert">2 anomalies</em></div></div></div>
  <div class="sp-wave">${Array.from({length:36},(_,i)=>`<i style="--h:${(30+Math.round(60*Math.abs(Math.sin(i*.7)*Math.cos(i*.23))))}%;--d:${(i%9)*.08}s"></i>`).join('')}</div>
  <div class="sp-hudfoot"><span>CHANNEL A · ENCRYPTED</span>${btn(inert,'Scan channel','systemScan','sp-hudbtn')}</div></div>`;

 function render(e,inert){const f=S[e.id];if(!f)return null;const vars=window.AtlasExpansion?.variables?AtlasExpansion.variables(e.tokens):'';
  if(e.id==='D03')loadFont('IBM+Plex+Sans:wght@400;500;600');if(e.id==='D06')loadFont('Playfair+Display:ital,wght@0,600;1,400&family=Source+Serif+4:ital,wght@0,400;1,400');if(e.id==='D08')loadFont('JetBrains+Mono:wght@400;600');
  return `<div class="systemSample systemIdentity sp sp-${e.id}" data-systemsample="${e.id}" style="${vars}" ${inert?'aria-hidden="true" inert':''}><div class="sp-frame">${f(inert)}</div>${inert?'':'<p class="demoStatus" role="status"></p>'}</div>`;}
 const fonts=new Set();function loadFont(q){if(fonts.has(q))return;fonts.add(q);const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+q+'&display=swap';document.head.append(l);}
 function patch(){if(typeof SystemAtlas==='undefined'||!SystemAtlas.layout||SystemAtlas.layout.__sp)return false;
  const lay=SystemAtlas.layout,thumb=SystemAtlas.thumbnail;
  SystemAtlas.layout=function(e,inert=false){if(e&&S[e.id])return render(e,inert);return lay.apply(this,arguments);};SystemAtlas.layout.__sp=true;
  SystemAtlas.thumbnail=function(e,matched=false){if(e&&S[e.id]&&!matched)return render(e,true);return thumb.apply(this,arguments);};
  try{if(typeof AtlasExpansion!=='undefined'&&location.hash.startsWith('#systems'))SystemAtlas.renderHub?.();}catch{}
  return true;}
 const t=setInterval(()=>{if(patch())clearInterval(t);},100);
 window.SystemPreviews={render,ids:Object.keys(S)};
})();
