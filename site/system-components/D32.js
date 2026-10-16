/* D32 Terralux: technical camera system. Drafting-paper white, deep engineering navy, blueprint blue callouts. */
(()=>{
const I=(d,s=22)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const specs=[['Lens Hood','Anodised aluminium<br>with anti-glare coating'],['Front Element','Sapphire crystal<br>dust-repellent coating'],['Lens Group','7-element aspherical<br>glass, f/1.8'],['Aperture Unit','Precision stepper motor'],['Main Housing','Titanium alloy<br>CNC machined'],
['Image Sensor','Full-frame CMOS<br>45.7 MP'],['Thermal Module','Graphite heat spreader'],['Control Board','Sealed, shock mounted'],['Rear Housing','Environmental seal<br>IP67 rated'],['Interface Panel','USB-C / HDMI<br>Rugged connector']];
SysComponents.add({
system:'D32',
fonts:['Plus+Jakarta+Sans:wght@400;500;600;700','IBM+Plex+Mono:wght@500'],
css:`.sc-D32{--paper:#f8f7f3;--navy:#13306a;--navy2:#0d2454;--blue:#1d63c8;--txt:#4b566f;--hair:#dde1e8;font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:var(--navy)}
.card{background:var(--paper);border:1px solid var(--hair);border-radius:12px;box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 12px 30px -24px rgba(13,36,84,.45)}
.eyebrow{font-family:'IBM Plex Mono',ui-monospace,monospace;font-weight:500;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--navy)}
a:focus-visible,button:focus-visible{outline:2px solid var(--blue);outline-offset:3px}
.btn{display:inline-flex;align-items:center;gap:12px;font-size:15px;font-weight:500;text-decoration:none;padding:13px 24px;border-radius:999px;white-space:nowrap;transition:background .2s,color .2s,box-shadow .2s,transform .2s}
.btn:active{transform:translateY(1px)}.btn svg{transition:transform .2s}
.btn.pri{background:var(--navy);color:#fff;box-shadow:0 6px 16px -8px rgba(19,48,106,.7)}.btn.pri:hover{background:var(--blue)}.btn.pri:hover svg{transform:translateX(3px)}
.btn.sec{background:var(--paper);color:var(--navy);box-shadow:inset 0 0 0 1.5px var(--navy)}.btn.sec:hover{background:#e9eef8}.btn.sec:hover svg{transform:translateY(2px)}`,
items:{
X153:{w:740,html:`<header class="nav card"><nav aria-label="Primary">${['Products','Technology','Sustainability','Support'].map((n,i)=>`<a href="#"${i==1?' class="on" aria-current="page"':''}>${n}</a>`).join('')}</nav>
<button class="ic" aria-label="Search">${I('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',21)}</button>
<button class="ic" aria-label="Account">${I('<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c.8-3.8 3.8-6 7.5-6s6.7 2.2 7.5 6Z"/>',21)}</button>
<a href="#" class="enq">Enquire</a></header>`,
css:`.nav{display:flex;align-items:center;gap:6px;padding:10px 10px 10px 26px;border-radius:14px}
nav{display:flex;gap:36px;flex:1;margin-right:12px}nav a{font-size:15.5px;font-weight:500;text-decoration:none;color:var(--navy);position:relative;padding:6px 0}
nav a::after{content:'';position:absolute;left:0;right:0;bottom:0;height:1.5px;background:var(--blue);transform:scaleX(0);transform-origin:left;transition:transform .25s}
nav a:hover{color:var(--blue)}nav a:hover::after,nav a.on::after{transform:scaleX(1)}
.ic{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:var(--navy);transition:background .2s}.ic:hover{background:#e9eef8}
.enq{margin-left:14px;background:var(--navy);color:#fff;text-decoration:none;font-size:15.5px;font-weight:500;padding:14px 30px;border-radius:14px;transition:background .2s}.enq:hover{background:var(--blue)}`,
init(r){const as=[...r.querySelectorAll('nav a')];as.forEach(a=>a.onclick=e=>{e.preventDefault();as.forEach(x=>{x.classList.toggle('on',x===a);x.toggleAttribute('aria-current',x===a)})});}},
X155:{w:440,html:`<div class="row"><a href="#" class="btn pri">Explore the System ${I('<path d="M4 12h15M13 6l6 6-6 6"/>',18)}</a>
<a href="#" class="btn sec">${I('<path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',18)} Download Datasheet</a></div>`,
css:`.row{display:flex;gap:22px;justify-content:center}`},
X156:{w:320,html:`<section class="ben card"><p class="eyebrow">Built for a clearer tomorrow</p><ul>
${[['Modular Design','Field serviceable components','<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8"/><circle cx="12" cy="12" r="6.4"/>'],
['Extreme Environments','−40°C to +60°C','<path d="M12 6.5c2 2.6 3.2 4.4 3.2 6.1a3.2 3.2 0 0 1-6.4 0c0-1.7 1.2-3.5 3.2-6.1Z"/><path d="M12 2v1.8M12 20.2V22M3.5 12H2M22 12h-1.5M5 5l1.2 1.2M17.8 17.8 19 19M5 19l1.2-1.2M17.8 6.2 19 5"/>'],
['Aerospace Grade','Titanium &amp; magnesium','<path d="M3 15.5 10.5 4h6.2L21 11.2 13 20Z"/><path d="M10.5 4 13 20M16.7 4 13 9.5 21 11.2M3 15.5 13 9.5"/>'],
['10-Year Support','Long-term parts availability','<circle cx="12" cy="12" r="8.6"/><path d="m8.2 12.2 2.6 2.6 5-5.4"/>']]
.map(([t,s,p])=>`<li><span class="bd">${I(p,24)}</span><div><b>${t}</b><span>${s}</span></div></li>`).join('')}</ul></section>`,
css:`.ben{padding:22px 22px 10px}.eyebrow{margin:0 0 14px;font-size:10.5px}ul{list-style:none;margin:0;padding:0}
li{display:flex;gap:16px;align-items:center;padding:12px 8px;margin:0 -8px;border-radius:10px;transition:background .2s}li:hover{background:#eef2f9}
.bd{flex:none;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--blue);box-shadow:0 0 0 1px var(--hair),0 4px 10px -6px rgba(13,36,84,.35)}
li div{display:flex;flex-direction:column;gap:3px}b{font-size:16px;font-weight:600;color:var(--navy)}li span:not(.bd){font-size:14px;color:var(--txt)}`},
X159:{w:220,html:`<div class="ann"><button class="pin" aria-expanded="false" aria-describedby="t5"><span>5</span></button>
<svg class="ld" width="12" height="190" viewBox="0 0 12 190" aria-hidden="true"><path d="M6 0V96" stroke="currentColor" stroke-width="2"/><path d="M6 100V176" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4"/><circle cx="6" cy="183" r="4" fill="currentColor"/></svg>
<div class="tip card" role="tooltip" id="t5"><span class="eyebrow">05</span><b>Main Housing</b><small>Titanium alloy, CNC machined</small></div></div>`,
css:`.ann{position:relative;display:flex;flex-direction:column;align-items:center;padding:8px 0;color:var(--blue)}
.pin{width:56px;height:56px;border-radius:50%;background:#fff;border:2.5px solid var(--blue);display:grid;place-items:center;font-size:24px;font-weight:600;color:var(--navy);box-shadow:0 0 0 5px rgba(29,99,200,.12);transition:transform .2s,box-shadow .2s,background .2s,color .2s;position:relative;z-index:1}
.pin:hover,.pin[aria-expanded=true]{transform:scale(1.06);box-shadow:0 0 0 8px rgba(29,99,200,.16)}.pin[aria-expanded=true]{background:var(--blue);color:#fff}
.pin::after{content:'';position:absolute;inset:-6px;border-radius:50%;border:1.5px solid var(--blue);opacity:0;animation:pu 2.4s ease-out infinite}@keyframes pu{0%{opacity:.6;transform:scale(.9)}100%{opacity:0;transform:scale(1.35)}}
.ld{margin-top:-2px}
.tip{position:absolute;left:calc(50% + 40px);top:8px;width:170px;padding:12px 14px;display:flex;flex-direction:column;gap:3px;opacity:0;transform:translateX(-6px);pointer-events:none;transition:opacity .2s,transform .2s;border-radius:10px}
.tip .eyebrow{color:var(--blue);font-size:10px}.tip b{font-size:14.5px;font-weight:600}.tip small{font-size:12.5px;color:var(--txt)}
.ann:hover .tip,.pin:focus-visible~.tip,.pin[aria-expanded=true]~.tip{opacity:1;transform:none}`,
init(r){const b=r.querySelector('.pin');b.onclick=()=>b.setAttribute('aria-expanded',b.getAttribute('aria-expanded')!=='true');}},
X160:{w:1120,html:`<section class="gl card" aria-label="Specification glossary"><ol>${specs.map(([t,d],i)=>`<li tabindex="0"><span class="n">${String(i+1).padStart(2,'0')}</span><div><b>${t}</b><p>${d}</p></div></li>`).join('')}</ol></section>`,
css:`.gl{padding:8px 10px}ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);grid-auto-rows:1fr;position:relative}
ol::before{content:'';position:absolute;left:12px;right:12px;top:50%;height:1px;background:var(--hair)}
li{display:flex;gap:16px;padding:20px 16px 26px;position:relative;border-radius:8px;outline:none;transition:background .2s}
li:not(:nth-child(5n))::after{content:'';position:absolute;right:0;top:14px;bottom:14px;width:1px;background:var(--hair)}
li:hover,li:focus-visible{background:#eef2f9}li:focus-visible{box-shadow:inset 0 0 0 1.5px var(--blue)}
.n{font-size:15px;font-weight:700;color:var(--blue);font-variant-numeric:tabular-nums;padding-top:1px}
b{display:block;font-size:15px;font-weight:600;color:var(--navy);margin-bottom:6px}p{margin:0;white-space:nowrap;font-size:13px;line-height:1.5;color:var(--txt)}`}
}});
})();
