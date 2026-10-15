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

 /* Specs for the hub tabs, matching the shape of SystemAtlas.specs. */
 const SPECS={
  D33:{name:'Primer / developer collaboration',principle:'Dense, calm interfaces where content and status carry the colour.',pattern:'Use an underline navigation with counts, a filter bar above lists and labels that pair colour with text.',icons:'regular',components:['C03','C15','C20','C23','C31','C32'],motion:['M01','M09','M10','M18'],type:'System sans stack / 14px base / semibold for titles',motionRule:'Motion is almost absent: short fades for overlays and no movement on lists.',links:[['Primer','https://primer.style/'],['Primer primitives (tokens)','https://github.com/primer/primitives'],['Octicons','https://primer.style/foundations/icons']]},
  D34:{name:'GOV.UK Frontend / public service forms',principle:'One question per page, plain words and controls large enough for everyone.',pattern:'Start with a back link and a caption, ask one thing, show errors in a summary and next to the field, then one green button.',icons:'bold',components:['C01','C06','C17','C21','C28','C30'],motion:['M01','M18'],type:'Large bold headings / 19px body / Arial fallback (GDS Transport is for GOV.UK services only)',motionRule:'No decorative motion. Focus is a thick yellow highlight so people never lose their place.',links:[['GOV.UK Design System','https://design-system.service.gov.uk/'],['govuk-frontend','https://github.com/alphagov/govuk-frontend'],['Question pages','https://design-system.service.gov.uk/patterns/question-pages/']]},
  D35:{name:'Spectrum / creative tools',principle:'Quiet grey surfaces so people’s own work holds the colour.',pattern:'Keep tools in a rail, properties in a panel and the canvas central. Label every field above its control.',icons:'regular',components:['C09','C10','C18','C28','C35','C39'],motion:['M03','M04','M09','M18'],type:'Source Sans 3 (Adobe Clean on Adobe products) / clear field labels',motionRule:'Short, eased transitions for panels and pickers; nothing moves the canvas without the person asking.',links:[['Spectrum','https://spectrum.adobe.com/'],['Spectrum CSS','https://github.com/adobe/spectrum-css'],['Spectrum tokens','https://github.com/adobe/spectrum-tokens']]},
  D36:{name:'USWDS / civic services',principle:'Trustworthy, accessible pages built from a small set of plain parts.',pattern:'Show where people are with a step indicator, explain deadlines in an alert and offer choices as cards with one action each.',icons:'regular',components:['C01','C06','C17','C21','C30','C34'],motion:['M01','M18'],type:'Public Sans / 17px body / generous line height',motionRule:'Keep motion functional and brief. Never rely on it to explain a state.',links:[['U.S. Web Design System','https://designsystem.digital.gov/'],['uswds on GitHub','https://github.com/uswds/uswds'],['Public Sans','https://public-sans.digital.gov/']]}
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
  D36:['Built with U.S. Web Design System tokens','Public domain (CC0). Public Sans is OFL. Agency seals and the official-site banner are not used.','https://github.com/uswds/uswds','USWDS on GitHub']
 };

 function render(e,inert){const f=S[e.id];if(!f)return null;const vars=window.AtlasExpansion?.variables?AtlasExpansion.variables(e.tokens):'';
  if(e.id==='D35')loadFont('Source+Sans+3:wght@400;600;700');if(e.id==='D36')loadFont('Public+Sans:wght@400;600;700');
  if(e.id==='D03')loadFont('IBM+Plex+Sans:wght@400;500;600');if(e.id==='D06')loadFont('Playfair+Display:ital,wght@0,600;1,400&family=Source+Serif+4:ital,wght@0,400;1,400');if(e.id==='D08')loadFont('JetBrains+Mono:wght@400;600');
  return `<div class="systemSample systemIdentity sp sp-${e.id}" data-systemsample="${e.id}" style="${vars}" ${inert?'aria-hidden="true" inert':''}><div class="sp-frame">${f(inert)}</div>${inert?'':'<p class="demoStatus" role="status"></p>'}</div>`;}
 const fonts=new Set();function loadFont(q){if(fonts.has(q))return;fonts.add(q);const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+q+'&display=swap';document.head.append(l);}
 function patch(){if(typeof SystemAtlas==='undefined'||!SystemAtlas.layout||SystemAtlas.layout.__sp)return false;
  const lay=SystemAtlas.layout,thumb=SystemAtlas.thumbnail,hub=SystemAtlas.renderHub;
  Object.assign(SystemAtlas.specs,SPECS);
  SystemAtlas.renderHub=function(){hub.apply(this,arguments);try{const e=AtlasExpansion.system,src=e&&SOURCES[e.id],body=document.getElementById('systemHubBody');
   if(src&&body&&this.tab==='overview')body.insertAdjacentHTML('afterbegin',`<aside class="sp-source"><p class="cardcode">Source &amp; licence</p><b>${src[0]}</b><p>${src[1]}</p><a href="${src[2]}" target="_blank" rel="noopener">${src[3]} ↗</a></aside>`);}catch{}};
  SystemAtlas.layout=function(e,inert=false){if(e&&S[e.id])return render(e,inert);return lay.apply(this,arguments);};SystemAtlas.layout.__sp=true;
  SystemAtlas.thumbnail=function(e,matched=false){if(e&&S[e.id]&&!matched)return render(e,true);return thumb.apply(this,arguments);};
  try{if(typeof AtlasExpansion!=='undefined'&&location.hash.startsWith('#systems'))SystemAtlas.renderHub?.();}catch{}
  return true;}
 if(!patch()){const t=setInterval(()=>{if(patch())clearInterval(t);},100);}
 window.SystemPreviews={render,ids:Object.keys(S),sources:SOURCES};
})();
