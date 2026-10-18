'use strict';
/* Product-screen previews for every atlas design system (D01–D48).
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

 /* ---------- Open-source systems (D33–D36) ----------
    Colours, radii and type follow each project's published tokens. The screens are atlas compositions
    built with those values; no logos, crests or restricted typefaces are used. */

 /* D33 · GitHub Primer (MIT): repository header, underline nav with counters, issue list with labels. */
 S.D33=inert=>`<div class="sp-primer"><div class="sp-phead"><span class="sp-pmark">${ic('grid')}</span><span class="sp-prepo"><span>atlas-studio</span> / <b>field-guide</b></span><em class="sp-plabel">Public</em><span class="sp-pacts"><span>${ic('star')}Star <i>128</i></span><span>${ic('share')}Fork <i>14</i></span></span></div>
  <nav class="sp-ptabs"><a>${ic('doc')}Code</a><a class="on">${ic('check')}Issues <i>12</i></a><a>${ic('share')}Pull requests <i>3</i></a><a>${ic('play')}Actions</a><a>${ic('chart')}Insights</a></nav>
  <div class="sp-pbar"><span class="sp-pfilter">${ic('search')}is:issue is:open</span><span class="sp-pbtn">Labels <i>9</i></span>${btn(inert,'New issue','systemAdd','sp-pnew')}</div>
  <div class="sp-pbox"><div class="sp-ptop"><b>${ic('check')}12 Open</b><span>${ic('check')}48 Closed</span><span class="sp-psort">Author · Label · Sort</span></div>
   ${[['Scroll story stalls on Safari when reduced motion is on','bug','#d1242f','#ffebe9','#1 opened 2 hours ago by rowe'],['Add a cyanotype export preset','enhancement','#0969da','#ddf4ff','#2 opened yesterday by mk'],['Document focus order for the studio menu','accessibility','#8250df','#fbefff','#3 opened 3 days ago by ir']].map(([t,l,c,bg,m])=>`<div class="sp-prow"><span class="sp-popen">${ic('check')}</span><div><b>${t}</b> <em class="sp-pl" style="--c:${c};--bg:${bg}">${l}</em><small>${m}</small></div><span class="sp-pcom">${ic('inbox')}4</span></div>`).join('')}</div></div>`;

 /* D34 · GOV.UK Frontend (MIT): service header, phase banner, back link, error summary,
    a question page with large radios, hint text and the green start-style button. */
 S.D34=inert=>`<div class="sp-gov"><header class="sp-ghead"><b>Apply for a garden allotment</b><span>Sign out</span></header><div class="sp-gbar"></div>
  <div class="sp-gbody"><p class="sp-gphase"><strong>Beta</strong>This is a new service. Help us improve it.</p><a class="sp-gback">Back</a>
   <div class="sp-gerr"><b>There is a problem</b><a>Select where your allotment would be</a></div>
   <span class="sp-gcap">Section 2 of 4</span><h3 class="sp-gh">Where would you like your allotment?</h3><p class="sp-ghint">Choose the site closest to your home. You can change this later.</p>
   <div class="sp-gradios sp-gerrfield"><p class="sp-gmsg">Error: Select where your allotment would be</p>${['Riverside Gardens','Hill Lane','Old Station Yard'].map(x=>`<span class="sp-gradio"><i></i>${x}</span>`).join('')}</div>
   ${btn(inert,'Continue','systemCheck','sp-gbtn')}</div></div>`;

 /* D35 · Adobe Spectrum (Apache 2.0): a creative editing workspace with tool rail, canvas,
    properties panel with field labels, sliders, switch, picker and pill buttons. */
 S.D35=inert=>`<div class="sp-spec"><div class="sp-stop"><b>Garden journal</b><span class="sp-stabs"><a class="on">Edit</a><a>Review</a><a>Share</a></span><span class="sp-sbtns">${btn(inert,'Share','status','sp-sout')}${btn(inert,'Export','systemCheck','sp-sacc')}</span></div>
  <div class="sp-swork"><aside class="sp-srail">${['grid','folder','star','sun','wave'].map((n,i)=>`<span class="${i===3?'on':''}">${ic(n)}</span>`).join('')}</aside>
   <div class="sp-scanvas"><figure style="background-image:url('assets/fx/garden.webp')"></figure><span class="sp-szoom">100%</span></div>
   <aside class="sp-sprops"><b class="sp-shd">Adjust</b>${[['Exposure','+0.4',62],['Contrast','12',56],['Warmth','-8',40]].map(([l,v,p])=>`<div class="sp-sfield"><span><label>${l}</label><em>${v}</em></span><i class="sp-strack"><i style="width:${p}%"></i><b style="left:${p}%"></b></i></div>`).join('')}
    <div class="sp-sfield"><label>Profile</label><span class="sp-spick">Adobe Color ${ic('chev')}</span></div><div class="sp-sswitch"><span class="sp-sw on"><i></i></span>Auto tone</div></aside></div></div>`;

 /* D36 · U.S. Web Design System (public domain): agency-style header, hero, step indicator,
    info alert and a card group. Fictional programme; no flag banner or seals. */
 S.D36=inert=>`<div class="sp-us"><header class="sp-uhead"><b>Community Gardens Program</b><span class="sp-unav"><a class="on">Apply</a><a>Find a garden</a><a>Resources</a></span><span class="sp-usearch">${ic('search')}</span></header>
  <div class="sp-ubody"><div class="sp-ustep"><div class="sp-usegs"><i class="done"></i><i class="done"></i><i class="cur"></i><i></i></div><p><span class="sp-unum">3</span><b>Choose a site</b><small>of 4</small></p></div>
   <div class="sp-ualert"><b>Applications close 30 November</b><span>Most applicants hear back within two weeks.</span></div>
   <div class="sp-ucards">${[['Riverside Gardens','42 plots · water on site'],['Hill Lane','18 plots · raised beds'],['Old Station Yard','26 plots · step-free']].map(([t,s],i)=>`<div class="sp-ucard"><b>${t}</b><p>${s}</p><span class="sp-ubtn ${i?'out':''}">Select</span></div>`).join('')}</div>
   <div class="sp-uactions">${btn(inert,'Continue','systemCheck','sp-ugo')}<a>Save and finish later</a></div></div></div>`;


 /* ---------- Original material systems (D11–D32) ----------
    Token-driven product screens. Each is an original composition: colour, corners, type and
    material all come from the system's tokens (--sys-*) plus a material class, so the
    accent picker still recolours them. Artwork is inline SVG, not images. */
 const art=(k,extra='')=>{const A={
  hills:'<path d="M0 70 30 44 52 58 78 30 120 66V90H0z" fill="var(--sx-art2)"/><path d="M0 80 40 58 70 74 100 52 120 64V90H0z" fill="var(--sys-accent)"/><circle cx="92" cy="22" r="9" fill="var(--sx-art3)"/>',
  arch:'<rect x="34" y="14" width="52" height="76" rx="26" fill="var(--sx-art2)"/><rect x="44" y="26" width="32" height="64" rx="16" fill="var(--sys-accent)"/><path d="M0 84h120" stroke="var(--sx-art3)" stroke-width="3"/>',
  bloom:'<g fill="var(--sys-accent)" opacity=".85"><ellipse cx="60" cy="30" rx="10" ry="20"/><ellipse cx="60" cy="30" rx="10" ry="20" transform="rotate(60 60 46)"/><ellipse cx="60" cy="30" rx="10" ry="20" transform="rotate(-60 60 46)"/></g><circle cx="60" cy="46" r="7" fill="var(--sx-art3)"/><path d="M60 54v34M60 74c10-10 22-8 26-4" stroke="var(--sx-art2)" stroke-width="3" fill="none"/>',
  orbit:'<circle cx="60" cy="45" r="18" fill="var(--sys-accent)"/><ellipse cx="60" cy="45" rx="48" ry="14" fill="none" stroke="var(--sx-art2)" stroke-width="2.5"/><circle cx="104" cy="40" r="5" fill="var(--sx-art3)"/>',
  grid:'<g stroke="var(--sx-art2)" stroke-width=".5">'+Array.from({length:9},(_,i)=>`<path d="M${i*15} 0V90M0 ${i*11.25}H120"/>`).join('')+'</g><circle cx="60" cy="45" r="24" fill="none" stroke="var(--sys-accent)" stroke-width="2.5"/><path d="M36 45h48M60 21v48" stroke="var(--sys-accent)" stroke-width="1.5"/>',
  waves:'<path d="M0 50c20-16 40 16 60 0s40 16 60 0V90H0z" fill="var(--sys-accent)" opacity=".85"/><path d="M0 64c20-12 40 12 60 0s40 12 60 0V90H0z" fill="var(--sx-art2)"/><circle cx="30" cy="24" r="10" fill="var(--sx-art3)"/>',
  blob:'<path d="M28 20c22-16 60-10 70 14s0 46-28 50-56-6-58-30 2-24 16-34z" fill="var(--sys-accent)"/><circle cx="80" cy="30" r="12" fill="var(--sx-art3)"/><circle cx="40" cy="64" r="8" fill="var(--sx-art2)"/>',
  bowl:'<path d="M20 44h80c0 22-18 38-40 38S20 66 20 44z" fill="var(--sys-accent)"/><ellipse cx="60" cy="44" rx="40" ry="8" fill="var(--sx-art2)"/><path d="M48 30c0-8 8-8 8-16M66 30c0-8 8-8 8-16" stroke="var(--sx-art3)" stroke-width="3" fill="none" stroke-linecap="round"/>',
  sun:'<circle cx="60" cy="58" r="26" fill="var(--sys-accent)"/><g stroke="var(--sx-bgline)" stroke-width="4">'+[60,68,76].map(y=>`<path d="M20 ${y}h80"/>`).join('')+'</g><path d="M0 84h120" stroke="var(--sx-art2)" stroke-width="3"/>',
  prism:'<path d="M60 10 104 80H16z" fill="var(--sx-art2)"/><path d="M60 10 82 80H38z" fill="var(--sys-accent)"/><path d="M0 50h40M80 46l40-10M80 50h40M80 54l40 10" stroke="var(--sx-art3)" stroke-width="2.5"/>',
  cube:'<path d="M60 12 96 30v36L60 84 24 66V30z" fill="var(--sx-art2)"/><path d="M60 48 96 30v36L60 84z" fill="var(--sys-accent)"/><path d="M60 48 24 30 60 12l36 18z" fill="var(--sx-art3)"/>',
 };return `<svg class="sx-art ${extra}" viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="120" height="90" fill="var(--sx-artbg)"/>${A[k]||A.hills}</svg>`;};
 const sbtn=(inert,label,act,cls='')=>btn(inert,label,act,'sx-btn '+cls);
 const tabs=(names,on=0)=>`<span class="sx-tabs">${names.map((n,i)=>`<span class="${i===on?'on':''}">${n}</span>`).join('')}</span>`;
 const bars=(vals)=>`<span class="sx-bars">${vals.map(v=>`<i style="height:${v}%"></i>`).join('')}</span>`;
 const av=(t)=>`<span class="sx-av">${t}</span>`;

 /* D11 Lilac Atelier · editorial reading app */
 S.D11=inert=>`<div class="sx" data-m="porcelain"><div class="sx-top"><b class="sx-brand">Atelier</b><span class="sx-nav"><a class="on">Read</a><a>Collections</a><a>Notes</a></span>${ic('search')}${av('LA')}</div>
  <div class="sx-split"><div class="sx-col"><p class="sx-kicker">Volume 08 · Essays</p><h3 class="sx-h1">Soft light,<br>slow reading.</h3><p class="sx-lede">Six essays on rooms, patience and the colour lilac. A quieter layout keeps the words first.</p>
   <div class="sx-row"><span class="sx-chip on">Essays</span><span class="sx-chip">Interviews</span><span class="sx-chip">Folios</span></div>
   <div class="sx-card sx-list"><div><b>On north light</b><em>12 min</em></div><div><b>A room for one idea</b><em>8 min</em></div><div><b>Lavender, a history</b><em>15 min</em></div></div>
   <div class="sx-row">${sbtn(inert,'Continue reading','systemAdd')}${sbtn(inert,'Save to notes','status','ghost')}</div></div>
   <figure class="sx-card sx-figure">${art('arch')}<figcaption>Folio 3 · The quiet room</figcaption></figure></div></div>`;

 /* D12 Champagne Glass · hotel booking */
 S.D12=inert=>`<div class="sx sx-backdrop" data-m="glass"><div class="sx-top"><b class="sx-brand">Maison Lumière</b><span class="sx-nav"><a class="on">Stay</a><a>Dine</a><a>Spa</a></span>${av('CG')}</div>
  <div class="sx-split"><div class="sx-col"><p class="sx-kicker">Riviera suite · 2 guests</p><h3 class="sx-h1">An evening<br>in amber.</h3>
   <div class="sx-card sx-form"><span class="sx-field"><small>Check in</small><b>Fri 14 Nov</b></span><span class="sx-field"><small>Check out</small><b>Sun 16 Nov</b></span><span class="sx-field"><small>Guests</small><b>2 adults</b></span></div>
   <div class="sx-row">${sbtn(inert,'Reserve the suite','systemCheck')}<span class="sx-mute">€640 · 2 nights</span></div></div>
   <div class="sx-col"><div class="sx-card sx-figure">${art('sun')}</div><div class="sx-card sx-list"><div><b>Terrace breakfast</b><em>Included</em></div><div><b>Late checkout</b><span class="sx-switch on"><i></i></span></div></div></div></div></div>`;

 /* D13 Cloud Glass · weather & travel dashboard */
 S.D13=inert=>`<div class="sx sx-backdrop" data-m="glass"><div class="sx-top"><b class="sx-brand">Cirrus</b>${tabs(['Today','10 days','Radar'])}${ic('search')}</div>
  <div class="sx-grid3"><div class="sx-card sx-hero"><small>Reykjavík · now</small><b class="sx-big">4°</b><p>Light cloud clearing by noon. Wind 18 km/h from the north-west.</p>${sbtn(inert,'Plan a flight','systemAdd')}</div>
   <div class="sx-card"><small>Next hours</small>${bars([40,55,62,70,66,52,48,44])}<span class="sx-axis"><em>09</em><em>12</em><em>15</em><em>18</em></span></div>
   <div class="sx-card sx-list"><div><b>Oslo</b><em>2° · snow</em></div><div><b>Lisbon</b><em>17° · sun</em></div><div><b>Kyoto</b><em>11° · rain</em></div></div></div>
  <div class="sx-card sx-strip">${art('orbit')}<div><b>Aurora likely tonight</b><p class="sx-mute">Kp index 5 between 22:00 and 01:00.</p></div><span class="sx-tag">Alert</span></div></div>`;

 /* D14 Frosted Pastel · habit & wellbeing tracker */
 S.D14=inert=>`<div class="sx sx-backdrop" data-m="frost"><div class="sx-top"><b class="sx-brand">Softday</b><span class="sx-nav"><a class="on">Today</a><a>Habits</a><a>Journal</a></span>${av('FP')}</div>
  <h3 class="sx-h2">Good morning, Ada.</h3>
  <div class="sx-grid3"><div class="sx-card sx-ring"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" class="t"/><circle cx="20" cy="20" r="16" class="v" pathLength="100" stroke-dasharray="72 100"/></svg><b>72%</b><small>Daily rhythm</small></div>
   <div class="sx-card sx-list"><div><span class="sx-check on">${ic('check')}</span><b>Morning walk</b><em>20 min</em></div><div><span class="sx-check on">${ic('check')}</span><b>Water</b><em>6 / 8</em></div><div><span class="sx-check"></span><b>Read</b><em>15 min</em></div></div>
   <div class="sx-card"><small>Mood this week</small><span class="sx-dots">${['M','T','W','T','F','S','S'].map((d,i)=>`<span class="${i<5?'on':''}"><i></i>${d}</span>`).join('')}</span></div></div>
  <div class="sx-row">${sbtn(inert,'Log a habit','systemAdd')}${sbtn(inert,'Breathing break','status','ghost')}</div></div>`;

 /* D15 Obsidian Lens · camera & photo library */
 S.D15=inert=>`<div class="sx" data-m="darkglass"><div class="sx-top"><b class="sx-brand">Obsidian</b>${tabs(['Library','Albums','Edits'])}${ic('search')}</div>
  <div class="sx-split wide"><div class="sx-card sx-viewer">${art('prism')}<span class="sx-hud"><em>ƒ/1.8</em><em>1/250</em><em>ISO 200</em></span></div>
   <div class="sx-col"><div class="sx-card sx-list"><div><b>Exposure</b><em>+0.3</em></div><div><b>Shadows</b><em>-12</em></div><div><b>Grain</b><em>8</em></div></div>
    <div class="sx-thumbs">${['blob','waves','orbit','hills'].map(a=>art(a,'sx-thumb')).join('')}</div>
    <div class="sx-row">${sbtn(inert,'Export edit','systemCheck')}${sbtn(inert,'Compare','status','ghost')}</div></div></div></div>`;

 /* D16 Blueprint Lab · engineering spec sheet */
 S.D16=inert=>`<div class="sx" data-m="blueprint"><div class="sx-top"><b class="sx-brand">BLUEPRINT/LAB</b><span class="sx-nav"><a class="on">SPEC</a><a>BOM</a><a>REVISIONS</a></span><span class="sx-tag">REV C</span></div>
  <div class="sx-split wide"><div class="sx-card sx-draw">${art('grid')}<span class="sx-dim">Ø 48.00 ±0.05</span></div>
   <div class="sx-col"><table class="sx-table"><tr><th>PART</th><th>QTY</th><th>TOL</th></tr><tr><td>Bearing housing</td><td>2</td><td>±0.05</td></tr><tr><td>Shaft, 12 mm</td><td>1</td><td>±0.01</td></tr><tr><td>Retaining ring</td><td>4</td><td>—</td></tr></table>
    <p class="sx-mute">Drawing 0417 · scale 1:2 · material 6061-T6</p><div class="sx-row">${sbtn(inert,'Approve revision','systemCheck')}${sbtn(inert,'Add note','systemAdd','ghost')}</div></div></div></div>`;

 /* D17 Clay Pop · playful learning app */
 S.D17=inert=>`<div class="sx" data-m="clay"><div class="sx-top"><b class="sx-brand">Clayground</b><span class="sx-pill">${ic('star')} 1,240</span>${av('KD')}</div>
  <h3 class="sx-h2">Pick today’s lesson</h3>
  <div class="sx-grid3">${[['Shapes','blob','12 cards'],['Colours','bloom','9 cards'],['Counting','cube','15 cards']].map(([t,a,s],i)=>`<div class="sx-card sx-tile ${i===0?'on':''}">${art(a)}<b>${t}</b><small>${s}</small></div>`).join('')}</div>
  <div class="sx-card sx-strip"><div><b>Streak: 6 days</b><div class="sx-progress"><i style="width:60%"></i></div></div>${sbtn(inert,'Start lesson','systemAdd')}</div></div>`;

 /* D18 Botanical Ledger · plant care journal */
 S.D18=inert=>`<div class="sx" data-m="ledger"><div class="sx-top"><b class="sx-brand">Botanical Ledger</b><span class="sx-nav"><a class="on">Plants</a><a>Watering</a><a>Journal</a></span>${ic('cal')}</div>
  <div class="sx-split"><div class="sx-col"><p class="sx-kicker">Entry 112 · Glasshouse</p><h3 class="sx-h1">Monstera,<br>third leaf.</h3>
   <table class="sx-table"><tr><th>Plant</th><th>Last water</th><th>Next</th></tr><tr><td>Monstera</td><td>Mon</td><td>Thu</td></tr><tr><td>Calathea</td><td>Tue</td><td>Fri</td></tr><tr><td>Fern</td><td>Today</td><td>Sat</td></tr></table>
   <div class="sx-row">${sbtn(inert,'Log watering','systemAdd')}${sbtn(inert,'Add photo','status','ghost')}</div></div>
   <figure class="sx-card sx-figure">${art('bloom')}<figcaption>Pressed specimen · plate 12</figcaption></figure></div></div>`;

 /* D19 Paper & Ink · newsletter editor */
 S.D19=inert=>`<div class="sx" data-m="print"><div class="sx-top"><b class="sx-brand">Paper &amp; Ink</b>${tabs(['Draft','Preview','Send'])}${sbtn(inert,'Schedule','systemCheck','small')}</div>
  <div class="sx-split wide"><div class="sx-card sx-doc"><p class="sx-kicker">Letter No. 31</p><h3 class="sx-h1">What the margins know.</h3><p><b class="sx-drop">T</b>he best notes live at the edge of the page — where we argue with the author and leave ourselves a way back in.</p><p class="sx-mute">412 words · 2 min read</p></div>
   <div class="sx-col"><div class="sx-card sx-list"><div><b>Subscribers</b><em>4,218</em></div><div><b>Open rate</b><em>61%</em></div><div><b>Send time</b><em>Sun 08:00</em></div></div><div class="sx-card"><small>Audience</small><span class="sx-row"><span class="sx-chip on">Everyone</span><span class="sx-chip">Patrons</span></span></div></div></div></div>`;

 /* D20 Aurora Studio · meditation & sound player */
 S.D20=inert=>`<div class="sx sx-backdrop" data-m="aurora"><div class="sx-top"><b class="sx-brand">Aurora</b><span class="sx-nav"><a class="on">Listen</a><a>Sleep</a><a>Focus</a></span>${av('AS')}</div>
  <div class="sx-split"><div class="sx-card sx-player">${art('waves')}<b>Northern drift</b><small>Ambient · 24 min</small><div class="sx-progress"><i style="width:38%"></i></div><span class="sx-controls">${ic('back')}<span class="sx-play">${ic('pause')}</span>${ic('skip')}</span></div>
   <div class="sx-col"><h3 class="sx-h2">Wind down</h3><div class="sx-card sx-list"><div><b>Breath, slowly</b><em>6 min</em></div><div><b>Glacier hum</b><em>18 min</em></div><div><b>Night garden</b><em>32 min</em></div></div>${sbtn(inert,'Start a session','systemAdd')}</div></div></div>`;

 /* D21 Atelier Noir · architecture portfolio */
 S.D21=inert=>`<div class="sx" data-m="noir"><div class="sx-top"><b class="sx-brand">ATELIER NOIR</b><span class="sx-nav"><a class="on">Projects</a><a>Studio</a><a>Journal</a></span>${ic('search')}</div>
  <div class="sx-split wide"><div class="sx-col"><p class="sx-kicker">02 / 06</p><h3 class="sx-h1">House on<br>the cliff.</h3><p class="sx-lede">Concrete, olive wood and one long window to the sea.</p>${sbtn(inert,'View the project','status','line')}</div>
   <div class="sx-gallery">${art('arch','big')}${art('hills')}${art('sun')}</div></div></div>`;

 /* D22 Bau Forum · conference programme (Swiss) */
 S.D22=inert=>`<div class="sx" data-m="swiss"><div class="sx-top"><b class="sx-brand">BAU FORUM 26</b><span class="sx-nav"><a class="on">Programme</a><a>Speakers</a><a>Tickets</a></span></div>
  <div class="sx-split wide"><h3 class="sx-h1 sx-poster">Form<br>follows<br>talk.</h3>
   <div class="sx-col"><table class="sx-table"><tr><th>09:30</th><td><b>Grids that breathe</b><br><span class="sx-mute">Hall A · Ruth Meier</span></td></tr><tr><th>11:00</th><td><b>Type as structure</b><br><span class="sx-mute">Hall B · Jonas Brandt</span></td></tr><tr><th>14:00</th><td><b>Colour, rationed</b><br><span class="sx-mute">Hall A · Lea Kovač</span></td></tr></table>
    <div class="sx-row">${sbtn(inert,'Add to my day','systemAdd')}<span class="sx-tag">Day 1 of 3</span></div></div></div></div>`;

 /* D23 Garden Notes · seed catalogue */
 S.D23=inert=>`<div class="sx" data-m="organic"><div class="sx-top"><b class="sx-brand">Garden Notes</b><span class="sx-nav"><a class="on">Seeds</a><a>Calendar</a><a>Beds</a></span>${ic('heart')}</div>
  <h3 class="sx-h2">Sow in March</h3>
  <div class="sx-grid3">${[['Sweet pea','bloom','Climber · 45 days'],['Runner bean','hills','Pole · 60 days'],['Cosmos','blob','Annual · 70 days']].map(([t,a,s])=>`<div class="sx-card sx-product">${art(a)}<b>${t}</b><small>${s}</small></div>`).join('')}</div>
  <div class="sx-row">${sbtn(inert,'Add to planting plan','systemAdd')}<span class="sx-mute">3 varieties chosen</span></div></div>`;

 /* D24 Golden Hour · ceramics shop (tactile) */
 S.D24=inert=>`<div class="sx" data-m="soft"><div class="sx-top"><b class="sx-brand">Golden Hour</b><span class="sx-nav"><a class="on">Shop</a><a>Studio</a><a>Care</a></span><span class="sx-pill">${ic('inbox')} 2</span></div>
  <div class="sx-split"><div class="sx-card sx-figure">${art('bowl')}</div>
   <div class="sx-col"><p class="sx-kicker">Stoneware · hand thrown</p><h3 class="sx-h1">Dune bowl</h3><p class="sx-lede">Warm sand glaze, raw foot. Each bowl varies slightly.</p>
    <div class="sx-row"><span class="sx-chip on">Sand</span><span class="sx-chip">Ash</span><span class="sx-chip">Moss</span></div>
    <div class="sx-row"><span class="sx-stepper">−<b>1</b>+</span>${sbtn(inert,'Add to basket · £48','systemAdd')}</div></div></div></div>`;

 /* D25 Clearspace · smart home */
 S.D25=inert=>`<div class="sx sx-backdrop" data-m="glass"><div class="sx-top"><b class="sx-brand">Clearspace</b>${tabs(['Home','Rooms','Energy'])}${av('CS')}</div>
  <div class="sx-grid3"><div class="sx-card sx-hero"><small>Living room</small><b class="sx-big">21.5°</b><p>Heating holds until 22:00.</p><div class="sx-progress"><i style="width:55%"></i></div></div>
   <div class="sx-card sx-list"><div><b>Lights</b><span class="sx-switch on"><i></i></span></div><div><b>Blinds</b><span class="sx-switch"><i></i></span></div><div><b>Speaker</b><span class="sx-switch on"><i></i></span></div></div>
   <div class="sx-card"><small>Energy today</small>${bars([30,44,38,60,72,50,36])}<em class="sx-mute">6.2 kWh · 12% less</em></div></div>
  <div class="sx-row">${sbtn(inert,'Evening scene','systemCheck')}${sbtn(inert,'Add device','systemAdd','ghost')}</div></div>`;

 /* D26 Palette · 3D colour tool */
 S.D26=inert=>`<div class="sx" data-m="spatial"><div class="sx-top"><b class="sx-brand">Palette</b>${tabs(['Mix','Library','Export'])}${av('PM')}</div>
  <div class="sx-split wide"><div class="sx-card sx-viewer">${art('cube')}</div>
   <div class="sx-col"><h3 class="sx-h2">Dusk set</h3><span class="sx-swatches">${['var(--sys-accent)','var(--sx-art2)','var(--sx-art3)','var(--sys-ink)','var(--sys-surface)'].map(c=>`<i style="background:${c}"></i>`).join('')}</span>
    <div class="sx-card sx-list"><div><b>Hue</b><em>274°</em></div><div><b>Softness</b><em>62%</em></div><div><b>Depth</b><em>3 layers</em></div></div>${sbtn(inert,'Save palette','systemAdd')}</div></div></div>`;

 /* D27 Northwind · bento analytics */
 S.D27=inert=>`<div class="sx" data-m="bento"><div class="sx-top"><b class="sx-brand">Northwind</b><span class="sx-nav"><a class="on">Overview</a><a>Routes</a><a>Fleet</a></span>${ic('bell')}</div>
  <div class="sx-bento"><div class="sx-card a"><small>Deliveries this week</small><b class="sx-big">1,284</b><em class="sx-tag">+8.2%</em></div><div class="sx-card b"><small>On time</small><b class="sx-big">96%</b></div><div class="sx-card c">${art('hills')}</div>
   <div class="sx-card d"><small>Volume by day</small>${bars([52,64,48,80,72,90,58])}</div><div class="sx-card e sx-list"><div><b>Route 7</b><em>Delayed</em></div><div><b>Route 2</b><em>On time</em></div></div><div class="sx-card f">${sbtn(inert,'Open dispatch','systemCheck')}</div></div></div>`;

 /* D28 Signal Block · ticket drop (brutalist) */
 S.D28=inert=>`<div class="sx" data-m="brutal"><div class="sx-top"><b class="sx-brand">SIGNAL/BLOCK</b><span class="sx-nav"><a class="on">DROPS</a><a>LINEUP</a><a>MERCH</a></span></div>
  <div class="sx-split wide"><h3 class="sx-h1 sx-poster">LOUD<br>NIGHT<br>№ 09</h3>
   <div class="sx-col"><div class="sx-card sx-list"><div><b>Early bird</b><em>SOLD OUT</em></div><div><b>General</b><em>£22</em></div><div><b>Late</b><em>£28</em></div></div>
    <div class="sx-row">${sbtn(inert,'BUY TICKETS →','systemAdd')}<span class="sx-tag">14 LEFT</span></div></div></div></div>`;

 /* D29 Family Table · recipe app */
 S.D29=inert=>`<div class="sx" data-m="illustrated"><div class="sx-top"><b class="sx-brand">Family Table</b><span class="sx-nav"><a class="on">Recipes</a><a>Plan</a><a>Shop</a></span>${av('FT')}</div>
  <div class="sx-split"><figure class="sx-card sx-figure">${art('bowl')}<figcaption>Sunday soup · serves 4</figcaption></figure>
   <div class="sx-col"><h3 class="sx-h1">Grandma’s<br>barley soup</h3><div class="sx-row"><span class="sx-chip on">45 min</span><span class="sx-chip">Easy</span><span class="sx-chip">Vegetarian</span></div>
    <div class="sx-card sx-list"><div><span class="sx-check on">${ic('check')}</span><b>Pearl barley, 150 g</b></div><div><span class="sx-check"></span><b>Two leeks</b></div><div><span class="sx-check"></span><b>Thyme, a handful</b></div></div>${sbtn(inert,'Add to this week','systemAdd')}</div></div></div>`;

 /* D30 Orion · retro phosphor terminal */
 S.D30=inert=>`<div class="sx" data-m="phosphor"><div class="sx-top"><b class="sx-brand">ORION-7</b><span class="sx-nav"><a class="on">[MON]</a><a>[LOG]</a><a>[CFG]</a></span><span class="sx-tag">LINK OK</span></div>
  <div class="sx-split wide"><div class="sx-card sx-term"><p>&gt; uplink --status</p><p>  carrier ...... LOCKED</p><p>  drift ........ 0.002 Hz</p><p>  packets ...... 18,442 / 0 lost</p><p class="sx-cur">&gt; _</p></div>
   <div class="sx-col"><div class="sx-card"><small>SIGNAL</small>${bars([30,64,44,90,58,76,40,84,52])}</div><div class="sx-row">${sbtn(inert,'RUN DIAGNOSTIC','systemScan')}</div></div></div></div>`;

 /* D31 Nexus · chromatic music release */
 S.D31=inert=>`<div class="sx" data-m="chroma"><div class="sx-top"><b class="sx-brand">NEXUS</b>${tabs(['Release','Tour','Shop'])}${ic('heart')}</div>
  <div class="sx-split"><div class="sx-card sx-figure glow">${art('orbit')}</div>
   <div class="sx-col"><p class="sx-kicker">New album · out now</p><h3 class="sx-h1">Aurora<br>Engines</h3><div class="sx-card sx-list"><div><b>01 · Lightfall</b><em>3:42</em></div><div><b>02 · Prism Run</b><em>4:10</em></div><div><b>03 · Afterglow</b><em>5:01</em></div></div>
    <div class="sx-row">${sbtn(inert,'Play album','systemAdd')}${sbtn(inert,'Save','status','ghost')}</div></div></div></div>`;

 /* D32 Terralux · scientific data workspace */
 S.D32=inert=>`<div class="sx" data-m="technical"><div class="sx-top"><b class="sx-brand">Terralux</b><span class="sx-nav"><a class="on">Samples</a><a>Models</a><a>Reports</a></span>${ic('search')}</div>
  <div class="sx-grid3"><div class="sx-card"><small>Soil moisture · site 4</small><svg class="sx-line" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 12 26 24 28 36 18 48 22 60 12 72 16 84 8 100 10"/></svg><span class="sx-axis"><em>Jan</em><em>Apr</em><em>Jul</em><em>Oct</em></span></div>
   <div class="sx-card sx-list"><div><b>pH</b><em>6.4 ± 0.1</em></div><div><b>Nitrogen</b><em>28 mg/kg</em></div><div><b>Carbon</b><em>3.1%</em></div></div>
   <div class="sx-card sx-figure">${art('grid')}</div></div>
  <table class="sx-table"><tr><th>Sample</th><th>Depth</th><th>Status</th></tr><tr><td>TX-0412</td><td>20 cm</td><td><span class="sx-tag">Validated</span></td></tr><tr><td>TX-0413</td><td>40 cm</td><td>Queued</td></tr></table>
  <div class="sx-row">${sbtn(inert,'Run model','systemCheck')}${sbtn(inert,'Export CSV','status','ghost')}</div></div>`;

 /* ---------- Open-source systems (D37–D45) and originals (D46–D48) ---------- */

 /* D37 · Salesforce Lightning Design System (BSD-3): record page header, path, highlights, related list. */
 S.D37=inert=>`<div class="sp-slds"><header class="sp-lgh"><span class="sp-lapp">${ic('grid')}</span><b>Sales</b><span class="sp-lnav"><a>Home</a><a class="on">Opportunities</a><a>Accounts</a><a>Reports</a></span><span class="sp-lsearch">${ic('search')}Search…</span></header>
  <div class="sp-lbody"><div class="sp-lcard sp-lhead"><span class="sp-lobj">${ic('star')}</span><div><small>Opportunity</small><b>Garden Co. · 40 seat renewal</b></div><span class="sp-lbtns"><span class="sp-lbtn">Follow</span><span class="sp-lbtn">Edit</span>${btn(inert,'New task','systemAdd','sp-lbrand')}</span>
   <div class="sp-lhl"><span><small>Account</small><b>Garden Co.</b></span><span><small>Close date</small><b>30/11/2026</b></span><span><small>Amount</small><b>$48,000</b></span><span><small>Owner</small><b>Ada Rowe</b></span></div></div>
   <div class="sp-lpath">${['Qualify','Needs analysis','Proposal','Negotiation','Closed'].map((s,i)=>`<span class="${i<2?'done':i===2?'cur':''}">${s}</span>`).join('')}</div>
   <div class="sp-lcols"><div class="sp-lcard"><b class="sp-lct">Activity</b>${[['Call with Jamie','Today'],['Send proposal v2','Tomorrow'],['Pricing review','Fri']].map(([a,b])=>`<div class="sp-lrow"><i>${ic('check')}</i><span>${a}</span><em>${b}</em></div>`).join('')}</div>
    <div class="sp-lcard"><b class="sp-lct">Contacts (3)</b>${[['Jamie Lee','Buyer'],['Priya Shah','IT'],['Sam Ortiz','Finance']].map(([a,b])=>`<div class="sp-lrow"><i class="sp-lav">${a[0]}</i><span>${a}</span><em>${b}</em></div>`).join('')}</div></div></div></div>`;

 /* D38 · Ant Design (MIT): sider, breadcrumb, query form, table with tags, pagination. */
 S.D38=inert=>`<div class="sp-ant"><aside class="sp-asider"><b class="sp-alogo"><i></i>Atlas Admin</b>${['Dashboard','Orders','Products','Customers','Settings'].map((x,i)=>`<a class="${i===1?'on':''}">${ic(['chart','inbox','grid','user','gear'][i])}${x}</a>`).join('')}</aside>
  <main class="sp-amain"><div class="sp-ahead"><span class="sp-acrumb">Home / <b>Orders</b></span>${av('AD')}</div>
   <div class="sp-acard sp-aform"><span class="sp-afield"><label>Order no.</label><i>Enter order number</i></span><span class="sp-afield"><label>Status</label><i>All ▾</i></span><span class="sp-abtns"><span class="sp-ab">Reset</span>${btn(inert,'Search','systemCheck','sp-aprimary')}</span></div>
   <div class="sp-acard"><div class="sp-atop"><b>Orders</b>${btn(inert,`${ic('plus')}New order`,'systemAdd','sp-aprimary')}</div>
    <table class="sp-atable"><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead><tbody>
     ${[['#20341','Garden Co.','Paid','green','$1,240'],['#20342','Studio Nine','Pending','gold','$380'],['#20343','Field & Co.','Refunded','red','$95']].map(([a,b,s,c,t])=>`<tr><td><a>${a}</a></td><td>${b}</td><td><span class="sp-atag ${c}">${s}</span></td><td>${t}</td></tr>`).join('')}</tbody></table>
    <div class="sp-apager"><span>1-3 of 48</span><i>‹</i><i class="on">1</i><i>2</i><i>3</i><i>›</i></div></div></main></div>`;

 /* D39 · Bootstrap (MIT): navbar, pricing cards, form with validation, alert. */
 S.D39=inert=>`<div class="sp-bs"><nav class="sp-bnav"><b>Atlas Studio</b><a class="on">Pricing</a><a>Features</a><a>Docs</a><span class="sp-bnavbtn">Sign in</span></nav>
  <div class="sp-bbody"><h3 class="sp-bh">Simple plans for every team</h3><p class="sp-blead">Start free, upgrade when you need more projects.</p>
   <div class="sp-bcards">${[['Free','$0','2 projects'],['Pro','$15','Unlimited projects'],['Team','$29','Shared libraries']].map(([n,p,f],i)=>`<div class="sp-bcard ${i===1?'hl':''}"><div class="sp-bch">${n}</div><div class="sp-bcb"><b>${p}<small>/mo</small></b><p>${f}</p><span class="sp-bbtn ${i===1?'fill':'out'}">${i===0?'Sign up free':'Get started'}</span></div></div>`).join('')}</div>
   <div class="sp-bform"><span class="sp-bgroup"><label>Work email</label><i class="sp-binput bad">ada@garden</i><small class="sp-binvalid">Enter a valid email address.</small></span>${btn(inert,'Start trial','systemCheck','sp-bprimary')}</div>
   <div class="sp-balert">${ic('check')}Your 14-day trial includes every Pro feature.</div></div></div>`;

 /* D40 · GitLab Pajamas (MIT): merge request, tabs, pipeline, approvals, merge widget. */
 S.D40=inert=>`<div class="sp-gl"><aside class="sp-glside"><b>atlas / field-guide</b>${['Issues','Merge requests','Pipelines','Wiki'].map((x,i)=>`<a class="${i===1?'on':''}">${x}${i<2?`<i>${i?3:12}</i>`:''}</a>`).join('')}</aside>
  <main class="sp-glmain"><p class="sp-glcrumb">field-guide / Merge requests / !218</p><h3 class="sp-glh">Add cyanotype export preset</h3><p class="sp-glmeta"><span class="sp-glbadge open">Open</span> Ada Rowe requested to merge <code>cyanotype</code> into <code>main</code></p>
   <div class="sp-gltabs"><a class="on">Overview <i>4</i></a><a>Commits <i>6</i></a><a>Pipelines <i>2</i></a><a>Changes <i>9</i></a></div>
   <div class="sp-glbox"><div class="sp-glpipe"><b>${ic('check')}Pipeline #4410 passed</b><span class="sp-glstages">${['build','test','review','deploy'].map((s,i)=>`<span class="${i<3?'ok':'man'}"><i>${i<3?ic('check'):ic('play')}</i>${s}</span>`).join('')}</span></div>
    <div class="sp-glrow">${ic('user')}<span><b>Approved by</b> 2 of 2 required</span></div>
    <div class="sp-glrow sp-glmerge">${btn(inert,'Merge','systemCheck','sp-glbtn')}<span><i class="sp-glcb">${ic('check')}</i> Delete source branch</span></div></div></main></div>`;

 /* D41 · PatternFly (MIT): dark masthead, vertical nav, status cards, inline alert. */
 S.D41=inert=>`<div class="sp-pf"><header class="sp-pfm">${ic('grid')}<b>Atlas Cloud Console</b><span class="sp-pfmi">${ic('bell')}${ic('gear')}<span>admin</span></span></header>
  <div class="sp-pfb"><aside class="sp-pfnav">${['Overview','Clusters','Workloads','Networking','Storage'].map((x,i)=>`<a class="${i===0?'on':''}">${x}</a>`).join('')}</aside>
   <main class="sp-pfmain"><h3 class="sp-pfh">Cluster overview</h3><div class="sp-pfalert">${ic('bell')}<span><b>Update available</b> Version 4.16.2 is ready to install.</span></div>
    <div class="sp-pfcards">${[['Nodes','12','6 ready · 0 not ready','ok'],['Pods','482','3 pending','warn'],['Alerts','1','1 critical','bad']].map(([a,b,c,s])=>`<div class="sp-pfcard"><small>${a}</small><b>${b}</b><span class="sp-pfst ${s}"><i></i>${c}</span></div>`).join('')}</div>
    <div class="sp-pfcard wide"><small>CPU usage</small><svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true"><path d="M0 18 10 15 20 16 30 10 40 13 50 9 60 12 70 6 80 9 90 7 100 8"/></svg></div>
    <div class="sp-pfacts">${btn(inert,'Update cluster','systemCheck','sp-pfprimary')}<span class="sp-pfsec">View details</span></div></main></div></div>`;

 /* D42 · Ionic (MIT): iOS-mode large title, segment, inset list, toggle, tab bar, phone frame. */
 S.D42=inert=>`<div class="sp-ion"><div class="sp-iphone"><div class="sp-istatus"><b>9:41</b><span>● ● ●</span></div><div class="sp-itool"><span class="sp-iback">${ic('back')}Trails</span><span>Edit</span></div><h3 class="sp-ititle">Weekend</h3>
  <span class="sp-iseg"><b>Saved</b><span>Nearby</span><span>Done</span></span>
  <div class="sp-ilist">${[['Ridge loop','8.4 km · 3 h'],['Lake path','5.1 km · 1.5 h'],['Pine steps','12 km · 4 h']].map(([a,b])=>`<div class="sp-iitem"><i class="sp-ithumb"></i><span><b>${a}</b><em>${b}</em></span>${ic('chev','sp-ichev')}</div>`).join('')}</div>
  <div class="sp-ilist"><div class="sp-iitem"><span><b>Offline maps</b></span><span class="sp-itoggle on"><i></i></span></div></div>
  <div class="sp-ibtnrow">${btn(inert,'Start route','systemAdd','sp-ibtn')}</div>
  <nav class="sp-itabs">${[['home','Explore'],['star','Saved'],['user','Profile']].map(([i,l],k)=>`<a class="${k===1?'on':''}">${ic(i)}${l}</a>`).join('')}</nav></div>
  <div class="sp-iside"><p class="sp-ikick">Ionic · iOS mode</p><b>Large title, inset list, segment and tab bar.</b><p>The same components render with Material styling on Android.</p></div></div>`;

 /* D43 · Twilio Paste (MIT): sidebar, conversation list, chat log, composer. */
 S.D43=inert=>`<div class="sp-paste"><aside class="sp-pside"><b>Atlas Support</b>${['Conversations','Contacts','Templates','Analytics'].map((x,i)=>`<a class="${i===0?'on':''}">${x}</a>`).join('')}</aside>
  <div class="sp-plist"><span class="sp-psearch">${ic('search')}Search</span>${[['Jamie Lee','Is the export ready?','2m',true],['Priya Shah','Thanks, that worked.','1h',false],['Sam Ortiz','Can I change plans?','3h',false]].map(([n,m,t,u])=>`<div class="sp-pconv ${u?'on':''}"><span class="sp-pav">${n[0]}</span><span><b>${n}</b><em>${m}</em></span><small>${t}</small></div>`).join('')}</div>
  <main class="sp-pchat"><div class="sp-phd"><b>Jamie Lee</b><span class="sp-pbadge">SMS</span></div>
   <div class="sp-plog"><p class="in">Hi! Is my cyanotype export ready?</p><p class="out">It is — I’ve sent the download link to your email.<small>Delivered</small></p><p class="in">Is the export ready in A3 as well?</p></div>
   <div class="sp-pcomp"><span>Write a message…</span>${btn(inert,'Send','systemAdd','sp-pbtn')}</div></main></div>`;

 /* D44 · Workday Canvas (Apache 2.0): global header, balances, form, pill buttons. */
 S.D44=inert=>`<div class="sp-cv"><header class="sp-cvh"><b>Atlas Work</b><span class="sp-cvsearch">${ic('search')}Search</span>${ic('bell')}${av('AR')}</header>
  <div class="sp-cvb"><h3 class="sp-cvt">Request time off</h3><div class="sp-cvbal">${[['Holiday','14.5 days'],['Sick','5 days'],['Volunteering','2 days']].map(([a,b])=>`<div><small>${a}</small><b>${b}</b></div>`).join('')}</div>
   <div class="sp-cvcard"><span class="sp-cvf"><label>Type <i>*</i></label><span class="sp-cvi">Holiday ▾</span></span><span class="sp-cvf"><label>From <i>*</i></label><span class="sp-cvi">${ic('cal')}14/11/2026</span></span><span class="sp-cvf"><label>To <i>*</i></label><span class="sp-cvi">${ic('cal')}18/11/2026</span></span><span class="sp-cvf full"><label>Comment</label><span class="sp-cvi tall">Family visit</span></span>
    <div class="sp-cvacts">${btn(inert,'Submit','systemCheck','sp-cvp')}<span class="sp-cvs">Cancel</span><em>3 days · balance after: 11.5</em></div></div></div></div>`;

 /* D45 · Mantine (MIT): header, segmented control, kanban columns, badges, progress. */
 S.D45=inert=>`<div class="sp-mt"><header class="sp-mth"><b><i></i>Roadmap</b><span class="sp-mtseg"><b>Board</b><span>List</span><span>Timeline</span></span>${btn(inert,`${ic('plus')}New card`,'systemAdd','sp-mtbtn')}</header>
  <div class="sp-mtcols">${[['Backlog','gray',[['Offline mode','Feature',30],['Audit log','Security',10]]],['In progress','blue',[['Cyanotype export','Feature',65],['Keyboard map','A11y',40]]],['Done','teal',[['Dark theme','Design',100]]]].map(([h,c,cards])=>`<div class="sp-mtcol"><p><b>${h}</b><span class="sp-mtbadge ${c}">${cards.length}</span></p>${cards.map(([t,l,p])=>`<div class="sp-mtcard"><b>${t}</b><span class="sp-mtbadge light">${l}</span><span class="sp-mtprog"><i style="width:${p}%"></i></span><span class="sp-mtfoot"><span class="sp-mtav">AR</span><span class="sp-mtav b">JM</span><em>${p}%</em></span></div>`).join('')}</div>`).join('')}</div></div>`;

 /* D46 · Ledger (original): balance, spending bars, insight, next step. */
 S.D46=inert=>`<div class="sx" data-m="ledger2"><div class="sx-top"><b class="sx-brand">Ledger</b><span class="sx-nav"><a class="on">Overview</a><a>Spending</a><a>Bills</a><a>Savings</a></span>${av('IR')}</div>
  <div class="sx-split"><div class="sx-col"><p class="sx-kicker">Current account · 4021</p><b class="sx-money">£3,482<small>.16</small></b><p class="sx-mute">Available after bills due this month: £2,120.40</p>
   <div class="sx-card"><small>Spending by week</small>${bars([46,62,38,54])}<span class="sx-axis"><em>W1</em><em>W2</em><em>W3</em><em>W4</em></span></div></div>
   <div class="sx-col"><div class="sx-card sx-insight"><b>You’re £84 under your food budget.</b><p>Move it to “Winter trip” and you’ll reach the goal two weeks early.</p>${sbtn(inert,'Move £84 to savings','systemCheck')}</div>
    <table class="sx-table num"><tr><th>Upcoming</th><th>Date</th><th>Amount</th></tr><tr><td>Rent</td><td>1 Dec</td><td>£1,150.00</td></tr><tr><td>Energy</td><td>3 Dec</td><td>£96.40</td></tr><tr><td>Phone</td><td>8 Dec</td><td>£18.00</td></tr></table></div></div></div>`;

 /* D47 · Riso Press (original): overprinted poster, listing, ticket stub. */
 S.D47=inert=>`<div class="sx" data-m="riso"><div class="sx-top"><b class="sx-brand">RISO PRESS</b><span class="sx-nav"><a class="on">This week</a><a>Venues</a><a>Zines</a></span></div>
  <div class="sx-split wide"><div class="sx-card sx-rposter"><i class="o1"></i><i class="o2"></i><i class="o3"></i><h3 class="sx-h1 sx-poster">PRINT<br>FAIR</h3><small>SAT 22 NOV · WAREHOUSE 3</small></div>
   <div class="sx-col"><div class="sx-card sx-list"><div><b>Two-colour workshop</b><em>11:00</em></div><div><b>Zine swap</b><em>13:30</em></div><div><b>Late print party</b><em>19:00</em></div></div>
    <div class="sx-stub"><span><b>ADMIT ONE</b><em>Print Fair · £6</em></span>${sbtn(inert,'Get a ticket','systemAdd')}</div></div></div></div>`;

 /* D48 · Halo (original): AI assistant with conversation, sources and prompt chips. */
 S.D48=inert=>`<div class="sx" data-m="halo"><div class="sx-top"><b class="sx-brand"><i class="sx-halo"></i>Halo</b><span class="sx-nav"><a class="on">Ask</a><a>Library</a><a>History</a></span>${av('IR')}</div>
  <div class="sx-split wide"><div class="sx-col sx-chat"><p class="sx-q">Which glaze fired best below 1200 °C?</p><div class="sx-card sx-a"><p>Two of the three test tiles matured at cone 6 (≈1220 °C) — none fully matured below 1200 °C <sup>[1]</sup>. The ash glaze came closest at 1190 °C but stayed slightly dry <sup>[2]</sup>.</p><p class="sx-mute">Confidence: medium · based on 2 of your notes</p></div>
    <span class="sx-row"><span class="sx-chip">Compare colours</span><span class="sx-chip">Make a firing plan</span></span><div class="sx-ask"><span>Ask a follow-up…</span>${sbtn(inert,'Send','systemAdd')}</div></div>
   <div class="sx-col"><small class="sx-kicker">Sources</small><div class="sx-card sx-src"><b>[1] Kiln log · 12 Oct</b><em>Notes · 3 tiles</em></div><div class="sx-card sx-src"><b>[2] Ash glaze recipe</b><em>Document · p. 2</em></div></div></div></div>`;

 /* Specs for the hub tabs, matching the shape of SystemAtlas.specs. */
 const SPECS={
  D33:{name:'Primer / developer collaboration',principle:'Dense, calm interfaces where content and status carry the colour.',pattern:'Use an underline navigation with counts, a filter bar above lists and labels that pair colour with text.',icons:'regular',components:['C03','C15','C20','C23','C31','C32'],motion:['M01','M09','M10','M18'],type:'System sans stack / 14px base / semibold for titles',motionRule:'Motion is almost absent: short fades for overlays and no movement on lists.',links:[['Primer','https://primer.style/'],['Primer primitives (tokens)','https://github.com/primer/primitives'],['Octicons','https://primer.style/foundations/icons']]},
  D34:{name:'GOV.UK Frontend / public service forms',principle:'One question per page, plain words and controls large enough for everyone.',pattern:'Start with a back link and a caption, ask one thing, show errors in a summary and next to the field, then one green button.',icons:'bold',components:['C01','C06','C17','C21','C28','C30'],motion:['M01','M18'],type:'Large bold headings / 19px body / Arial fallback (GDS Transport is for GOV.UK services only)',motionRule:'No decorative motion. Focus is a thick yellow highlight so people never lose their place.',links:[['GOV.UK Design System','https://design-system.service.gov.uk/'],['govuk-frontend','https://github.com/alphagov/govuk-frontend'],['Question pages','https://design-system.service.gov.uk/patterns/question-pages/']]},
  D35:{name:'Spectrum / creative tools',principle:'Quiet grey surfaces so people’s own work holds the colour.',pattern:'Keep tools in a rail, properties in a panel and the canvas central. Label every field above its control.',icons:'regular',components:['C09','C10','C18','C28','C35','C39'],motion:['M03','M04','M09','M18'],type:'Source Sans 3 (Adobe Clean on Adobe products) / clear field labels',motionRule:'Short, eased transitions for panels and pickers; nothing moves the canvas without the person asking.',links:[['Spectrum','https://spectrum.adobe.com/'],['Spectrum CSS','https://github.com/adobe/spectrum-css'],['Spectrum tokens','https://github.com/adobe/spectrum-tokens']]},
  D36:{name:'USWDS / civic services',principle:'Trustworthy, accessible pages built from a small set of plain parts.',pattern:'Show where people are with a step indicator, explain deadlines in an alert and offer choices as cards with one action each.',icons:'regular',components:['C01','C06','C17','C21','C30','C34'],motion:['M01','M18'],type:'Public Sans / 17px body / generous line height',motionRule:'Keep motion functional and brief. Never rely on it to explain a state.',links:[['U.S. Web Design System','https://designsystem.digital.gov/'],['uswds on GitHub','https://github.com/uswds/uswds'],['Public Sans','https://public-sans.digital.gov/']]},
  D37:{name:'Lightning / CRM records',principle:'Dense business records that stay scannable: a header that summarises, a path that shows progress, cards that group related work.',pattern:'Lead with a record header and highlights panel, show the sales path under it, then related lists in cards. Keep actions in a button group at the top right.',icons:'fill',components:['C03','C15','C17','C20','C31','C32'],motion:['M01','M09','M18'],type:'Salesforce Sans on Salesforce products; system UI stack here / 13px base / bold record titles',motionRule:'Motion is functional and fast (100–200 ms): menus, modals and toasts only. Records never animate in place.',links:[['Lightning Design System','https://www.lightningdesignsystem.com/'],['SLDS on GitHub','https://github.com/salesforce-ux/design-system'],['Design tokens','https://www.lightningdesignsystem.com/design-tokens/']]},
  D38:{name:'Ant Design / enterprise admin',principle:'Certainty and efficiency for back-office work: predictable layouts, compact controls and clear feedback.',pattern:'Sider menu for sections, a breadcrumb header, a query form above the table and pagination below. One primary action per card.',icons:'regular',components:['C03','C06','C15','C27','C31','C32'],motion:['M01','M09','M10','M18'],type:'System UI stack / 14px base / 22px line height',motionRule:'Natural, brief easing (0.1–0.3 s). Motion clarifies relationships between list, drawer and modal.',links:[['Ant Design','https://ant.design/'],['Ant Design on GitHub','https://github.com/ant-design/ant-design'],['Design tokens','https://ant.design/docs/react/customize-theme']]},
  D39:{name:'Bootstrap / web toolkit',principle:'Familiar, sturdy building blocks that let a team ship a clear page quickly.',pattern:'Dark navbar, centred heading and lead, a three-card pricing grid with one highlighted plan, then a form with inline validation feedback.',icons:'bold',components:['C01','C03','C06','C17','C21','C30'],motion:['M01','M18'],type:'Native system font stack / 16px base / 500-weight headings',motionRule:'Short 0.15 s transitions on colour and focus. Respect prefers-reduced-motion (Bootstrap disables its transitions).',links:[['Bootstrap','https://getbootstrap.com/'],['Bootstrap on GitHub','https://github.com/twbs/bootstrap'],['Customize / Sass variables','https://getbootstrap.com/docs/5.3/customize/sass/']]},
  D40:{name:'Pajamas / DevOps review',principle:'Make the state of the work obvious: what changed, whether it passes and who approved it.',pattern:'Breadcrumb and title, a status badge, tabs with counts, then one bordered widget that stacks pipeline, approvals and the merge action.',icons:'regular',components:['C03','C15','C17','C23','C31','C39'],motion:['M01','M09','M17','M18'],type:'GitLab Sans (Inter) / 14px base / semibold titles',motionRule:'Quick, purposeful transitions (around 200 ms). Pipeline status updates in place without moving the layout.',links:[['Pajamas','https://design.gitlab.com/'],['GitLab UI','https://gitlab.com/gitlab-org/gitlab-ui'],['Design tokens','https://design.gitlab.com/product-foundations/design-tokens']]},
  D41:{name:'PatternFly / infrastructure console',principle:'Calm, consistent operations UI: status first, then the action that fixes it.',pattern:'Dark masthead, vertical nav, page title and an inline alert, then status cards with icon plus word, then one primary and one secondary action.',icons:'fill',components:['C03','C15','C17','C27','C31','C39'],motion:['M01','M09','M17','M18'],type:'Red Hat Display headings / Red Hat Text body (both OFL)',motionRule:'Short, eased changes for expandable sections and alerts. Status colour always pairs with an icon and a word.',links:[['PatternFly','https://www.patternfly.org/'],['PatternFly on GitHub','https://github.com/patternfly/patternfly'],['Red Hat fonts','https://github.com/RedHatOfficial/RedHatFont']]},
  D42:{name:'Ionic / cross-platform mobile',principle:'One codebase that feels native: platform-styled large titles, inset lists and tab bars.',pattern:'Large title with a toolbar, a segment for views, inset grouped lists, toggles on the trailing edge and a bottom tab bar with labels.',icons:'regular',components:['C09','C18','C19','C28','C30','C34'],motion:['M03','M08','M10','M18'],type:'Platform system font (SF on iOS, Roboto on Android)',motionRule:'Native-feeling page transitions and spring-like toggles. Reduced motion swaps slides for fades.',links:[['Ionic Framework','https://ionicframework.com/docs'],['Ionic on GitHub','https://github.com/ionic-team/ionic-framework'],['Theming / colours','https://ionicframework.com/docs/theming/colors']]},
  D43:{name:'Paste / customer messaging',principle:'Trustworthy, accessible communications UI where delivery state is always visible.',pattern:'Dark sidebar, a searchable conversation list with the active item marked, a chat log with delivery receipts and a composer pinned to the bottom.',icons:'regular',components:['C06','C17','C20','C23','C26','C31'],motion:['M01','M09','M10','M18'],type:'Inter / 14px base / semibold names',motionRule:'Subtle, quick motion for new messages and toasts. Never animate the log while someone is reading.',links:[['Twilio Paste','https://paste.twilio.design/'],['Paste on GitHub','https://github.com/twilio-labs/paste'],['Design tokens','https://paste.twilio.design/tokens']]},
  D44:{name:'Canvas / workplace self-service',principle:'Friendly, human tools for everyday work tasks: clear balances, plain forms, rounded actions.',pattern:'Global header with search, a page title, summary cards for balances, then one form card with required markers and pill-shaped primary and secondary buttons.',icons:'regular',components:['C01','C06','C17','C21','C28','C30'],motion:['M01','M09','M18'],type:'Roboto / 14–16px body / bold page titles',motionRule:'Gentle 200 ms transitions. Confirmations explain the outcome in words, not motion alone.',links:[['Canvas Design System','https://canvas.workday.com/'],['Canvas Kit on GitHub','https://github.com/Workday/canvas-kit'],['Canvas tokens','https://github.com/Workday/canvas-tokens']]},
  D45:{name:'Mantine / product boards',principle:'Pleasant, practical React components with sensible defaults and light surfaces.',pattern:'A header with a segmented control and one filled action, then kanban columns of cards with badges, progress and avatars.',icons:'tabler',components:['C09','C15','C19','C20','C34','C35'],motion:['M01','M04','M09','M18'],type:'System UI stack / 16px base / uppercase badge labels',motionRule:'Short 150 ms transitions on hover and focus; drag-and-drop shows a placeholder so nothing jumps.',links:[['Mantine','https://mantine.dev/'],['Mantine on GitHub','https://github.com/mantinedev/mantine'],['Default theme','https://mantine.dev/theming/default-theme/']]},
  D46:{name:'Ledger / calm finance',principle:'Money UI that lowers the pulse: aligned figures, plain words and one next step.',pattern:'Lead with the balance and what is really available, show spending as simple bars, then one insight card with one action and a table of upcoming bills.',icons:'regular',components:['C03','C15','C17','C27','C30','C32'],motion:['M01','M09','M18'],type:'Manrope / tabular figures for every amount / no all-caps for money',motionRule:'Counts never spin. Use a short fade for new figures and keep totals still while people read them.',links:[['Original atlas system','#systems?id=D46'],['Tabular figures (MDN)','https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric']]},
  D47:{name:'Riso Press / bold zine',principle:'Two inks, paper and nerve: overprinted shapes for energy, solid ink for anything people must read.',pattern:'A poster block with overprinted shapes and a loud headline, a plain schedule list beside it and a ticket stub with one pink action.',icons:'bold',components:['C01','C15','C30','C34','C38','C40'],motion:['M04','M13','M14','M18'],type:'Space Grotesk (OFL) / heavy uppercase display / plain sentence-case body',motionRule:'One misregistration jiggle on the poster at most; reduced motion shows the final print.',links:[['Original atlas system','#systems?id=D47'],['Space Grotesk','https://fonts.google.com/specimen/Space+Grotesk']]},
  D48:{name:'Halo / AI assistant',principle:'Show the work: answers sit beside their sources, uncertainty is written down and the halo marks focus, never authority.',pattern:'A conversation column with the question, an answer card with numbered citations and a confidence line, suggested follow-ups as chips and a sources panel on the right.',icons:'light',components:['C06','C17','C20','C23','C26','C31'],motion:['M01','M08','M10','M18'],type:'Inter / 15–16px reading size / citations in the accent colour',motionRule:'Stream text without moving what is already written. The halo glows on focus only and is static under reduced motion.',links:[['Original atlas system','#systems?id=D48'],['People + AI Guidebook','https://pair.withgoogle.com/guidebook/']]}
 };
 /* Source and licence notes shown on each hub's overview. */
 const SOURCES={
  D01:['Inspired by Apple Human Interface Guidelines','Guidance only. Apple’s UI kits, SF Symbols and SF fonts are free from Apple Design Resources for designing Apple-platform apps, but may not be re-hosted, so this preview is an original look-alike.','https://developer.apple.com/design/resources/','Apple Design Resources'],
  D02:['Inspired by Material Design 3','Material components and tokens are Apache 2.0. This preset is an atlas interpretation; use Material Web for production.','https://github.com/material-components/material-web','Material Web on GitHub'],
  D03:['Inspired by IBM Carbon','Carbon is Apache 2.0 and IBM Plex is OFL. This preset is an atlas interpretation.','https://github.com/carbon-design-system/carbon','Carbon on GitHub'],
  D04:['Inspired by Microsoft Fluent 2','Fluent UI and Fluent System Icons are MIT. Segoe UI is a Windows system font, so the web stack falls back elsewhere.','https://github.com/microsoft/fluentui','Fluent UI on GitHub'],
  D05:['Inspired by Radix and shadcn/ui','Both are MIT. Radix Colors provides the accessible scales this style leans on.','https://github.com/shadcn-ui/ui','shadcn/ui on GitHub'],
  D33:['Built with GitHub Primer tokens','MIT licence. Colours, radius and type follow Primer primitives. The screen is an atlas composition; GitHub’s logo is not used.','https://github.com/primer/primitives','Primer primitives'],
  D34:['Built with GOV.UK Frontend values','Code is MIT. The crown, the GOV.UK logotype and GDS Transport may only be used by GOV.UK services, so this sample uses a fictional service and Arial.','https://github.com/alphagov/govuk-frontend','govuk-frontend'],
  D35:['Built with Adobe Spectrum tokens','Apache 2.0. Adobe Clean is proprietary, so this sample uses Source Sans 3, Adobe’s open-source face (OFL).','https://github.com/adobe/spectrum-tokens','Spectrum tokens'],
  D36:['Built with U.S. Web Design System tokens','Public domain (CC0). Public Sans is OFL. Agency seals and the official-site banner are not used.','https://github.com/uswds/uswds','USWDS on GitHub'],
  D37:['Built with Salesforce Lightning Design System tokens','SLDS code is BSD-3-Clause; its icons (CC BY-ND 4.0) and Salesforce Sans are licensed separately, so this screen uses atlas icons and a system font. No Salesforce logos are used.','https://github.com/salesforce-ux/design-system','SLDS on GitHub'],
  D38:['Built with Ant Design seed tokens','MIT licence. Primary #1677ff, radius 6 px, control height 32 px and 0.2 s motion follow the published theme. Filled buttons darken the primary so white labels pass 4.5:1.','https://github.com/ant-design/ant-design','Ant Design on GitHub'],
  D39:['Built with Bootstrap 5.3 variables','MIT licence. Colours, radius (.375rem), spacers and the 38 px control height follow Bootstrap’s Sass source. The Bootstrap logo is not used.','https://github.com/twbs/bootstrap','Bootstrap on GitHub'],
  D40:['Built with GitLab Pajamas tokens','GitLab UI and design tokens are MIT. GitLab Sans is based on Inter (OFL), used here. The tanuki logo is not used.','https://gitlab.com/gitlab-org/gitlab-ui','GitLab UI'],
  D41:['Built with PatternFly tokens','MIT licence. Red Hat Display and Red Hat Text are OFL. The Red Hat logo is not used.','https://github.com/patternfly/patternfly','PatternFly on GitHub'],
  D42:['Built with Ionic Framework defaults','MIT licence. Colours follow Ionic’s default theme (primary #0054e9); the iOS-mode layout is an atlas composition. No Ionic logo is used.','https://github.com/ionic-team/ionic-framework','Ionic on GitHub'],
  D43:['Built with Twilio Paste tokens','MIT licence. Colours, radii and Inter follow Paste’s tokens. Twilio logos are not used.','https://github.com/twilio-labs/paste','Paste on GitHub'],
  D44:['Built with Workday Canvas tokens','Canvas Kit and Canvas Tokens are Apache 2.0; Roboto is OFL. Workday logos are not used.','https://github.com/Workday/canvas-kit','Canvas Kit on GitHub'],
  D45:['Built with Mantine’s default theme','MIT licence. Filled controls use blue 8 (#1971c2) rather than blue 6 so white labels reach 4.5:1. No Mantine logo is used.','https://github.com/mantinedev/mantine','Mantine on GitHub'],
  D46:['Original atlas system','Authored for the atlas; tokens, screen and kit are free to reuse. Manrope is OFL.','#systems?id=D46','Download the kit below'],
  D47:['Original atlas system','Authored for the atlas; tokens, screen and kit are free to reuse. Space Grotesk is OFL.','#systems?id=D47','Download the kit below'],
  D48:['Original atlas system','Authored for the atlas; tokens, screen and kit are free to reuse. Inter is OFL.','#systems?id=D48','Download the kit below'],
  D06:['Original atlas system','An editorial direction authored for the atlas, not tied to a vendor system. Playfair Display and Source Serif 4 are OFL.','https://fonts.google.com/knowledge','Typography resources'],
  D07:['Original atlas system','A tactile direction authored for the atlas. Soft shadows are paired with visible borders to meet non-text contrast.','https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html','Non-text contrast (WCAG)'],
  D08:['Original atlas system','A cinematic instrument direction authored for the atlas. JetBrains Mono is OFL.','https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API','Web Animations API']
 };

 /* Colour helpers: derived, contrast-safe variables for the shared .sx screens. */
 const hex=h=>{h=String(h||'#000').trim();if(h.length===4)h='#'+[...h.slice(1)].map(c=>c+c).join('');return h.slice(1,7).match(/../g).map(x=>parseInt(x,16));};
 const toHex=a=>'#'+a.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
 const lum=h=>{const v=hex(h).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2];};
 const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
 const mix=(a,b,t)=>{const x=hex(a),y=hex(b);return toHex(x.map((v,i)=>v+(y[i]-v)*t));};
 const safe=(c,ink,grounds,min=4.6)=>{for(let t=0;t<=1.0001;t+=.05){const m=mix(c,ink,t);if(grounds.every(g=>ratio(m,g)>=min))return m;}return ink;};
 function derived(t){const bg=t.background,sf=t.surface,ink=t.ink,ac=t.accent;
  const mute=safe(mix(ink,sf,.45),ink,[sf,bg]);
  return `--sx-mute:${mute};--sx-acc:${safe(ac,ink,[sf,mix(ac,sf,.82)])};--sx-acc-bg:${safe(ac,ink,[bg])};--sx-artbg:${mix(ac,sf,.82)};--sx-art2:${mix(ac,ink,.45)};--sx-art3:${mix(ac,'#ffffff',.55)};--sx-bgline:${mix(ac,sf,.82)}`;}
 function render(e,inert){const f=S[e.id];if(!f)return null;const vars=((window.AtlasExpansion?.variables?AtlasExpansion.variables(e.tokens):'')+';'+derived(e.tokens)).replace(/"/g,"'");
  const F={D40:'Inter:wght@400;600;700',D43:'Inter:wght@400;600;700',D48:'Inter:wght@400;600;700',D41:'Red+Hat+Display:wght@500;700&family=Red+Hat+Text:wght@400;500',D44:'Roboto:wght@400;500;700',D46:'Manrope:wght@400;600;700',D47:'Space+Grotesk:wght@500;700'};if(F[e.id])loadFont(F[e.id]);
  if(e.id==='D35')loadFont('Source+Sans+3:wght@400;600;700');if(e.id==='D36')loadFont('Public+Sans:wght@400;600;700');
  if(e.id==='D03')loadFont('IBM+Plex+Sans:wght@400;500;600');if(e.id==='D06')loadFont('Playfair+Display:ital,wght@0,600;1,400&family=Source+Serif+4:ital,wght@0,400;1,400');if(e.id==='D08')loadFont('JetBrains+Mono:wght@400;600');
  return `<div class="systemSample systemIdentity sp sp-${e.id}" data-systemsample="${e.id}" style="${vars}" ${inert?'aria-hidden="true" inert':''}><div class="sp-frame">${f(inert)}</div>${inert?'':'<p class="demoStatus" role="status"></p>'}</div>`;}
 const fonts=new Set();function loadFont(q){if(fonts.has(q))return;fonts.add(q);const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+q+'&display=swap';document.head.append(l);}
 function patch(){if(typeof SystemAtlas==='undefined'||!SystemAtlas.layout||SystemAtlas.layout.__sp)return false;
  const lay=SystemAtlas.layout,thumb=SystemAtlas.thumbnail,hub=SystemAtlas.renderHub;
  Object.assign(SystemAtlas.specs,SPECS);
  SystemAtlas.renderHub=function(){hub.apply(this,arguments);try{const e=AtlasExpansion.system,src=e&&SOURCES[e.id],body=document.getElementById('systemHubBody');
   if(src&&body&&this.tab==='overview')body.insertAdjacentHTML('afterbegin',`<aside class="sp-source"><p class="cardcode">Source &amp; licence</p><b>${src[0]}</b><p>${src[1]}</p><a href="${src[2]}" target="_blank" rel="noopener">${src[3]} ↗</a></aside>`);}catch{}};
  const own=e=>e&&S[e.id]&&!(e.guide?.reference);
  SystemAtlas.layout=function(e,inert=false){if(own(e))return render(e,inert);return lay.apply(this,arguments);};SystemAtlas.layout.__sp=true;
  SystemAtlas.thumbnail=function(e,matched=false){if(own(e)&&!matched)return render(e,true);return thumb.apply(this,arguments);};
  try{if(typeof AtlasExpansion!=='undefined'&&location.hash.startsWith('#systems'))SystemAtlas.renderHub?.();}catch{}
  return true;}
 if(!patch()){const t=setInterval(()=>{if(patch())clearInterval(t);},100);}
 window.SystemPreviews={render,ids:Object.keys(S),sources:SOURCES,specs:SPECS,ratio,mix,safe};
})();
