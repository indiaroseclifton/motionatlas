/* D30 Orion: phosphor-green spectrum analyser / surveillance console. All plots are live SVG. */
(()=>{
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const loop=(r,ms,fn)=>{fn();if(RM())return;const t=setInterval(()=>{if(!r.isConnected)return clearInterval(t);fn();},ms);};
const pad=n=>String(n).padStart(2,'0');
const utc=()=>{const d=new Date();return [`${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`,`${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`];};
const clock=r=>loop(r,1000,()=>{const [a,b]=utc();r.querySelectorAll('[data-date]').forEach(e=>e.textContent=a);r.querySelectorAll('[data-time]').forEach(e=>e.textContent=b);});
/* plot geometry: viewBox 0 0 600 360, plot area x 70..590, y 10..300 */
const grid=(cols,rows)=>{let g='';for(let i=1;i<cols;i++){const x=70+520*i/cols;g+=`M${x.toFixed(1)} 10V300`;}for(let i=1;i<rows;i++){const y=10+290*i/rows;g+=`M70 ${y.toFixed(1)}H590`;}return `<path class="gl" d="${g}"/><rect class="fr" x="70" y="10" width="520" height="290"/>`;};
const wavePath=ph=>{let d='';for(let i=0;i<=260;i++){const t=i/260*56,b=Math.exp(-(((t-24)/6.4)**2))*Math.cos(2*Math.PI*(t-24)/8.6),
 y=b*.97+.13*Math.sin(t*.95+ph)+.06*Math.sin(t*2.7+ph*1.7)+.035*Math.sin(t*7.3-ph*2)+(Math.random()-.5)*.04;
 d+=(i?'L':'M')+(72+i*2).toFixed(1)+' '+(155-y*125).toFixed(1);}return d;};
const WAVE=`<section class="pnl wave"><h4>A. Signal waveform</h4><svg viewBox="0 0 600 340" role="img" aria-label="Signal waveform, amplitude over 60 milliseconds">${grid(10,8)}
${[['+1.0',30],['+0.5',92],['0',155],['-0.5',218],['-1.0',280]].map(([l,y])=>`<text x="60" y="${y+5}" text-anchor="end">${l}</text>`).join('')}
${['0ms',10,20,30,40,50].map((l,i)=>`<text x="${80+i*92}" y="330" text-anchor="middle">${l}</text>`).join('')}
<path class="tr glow" d="${wavePath(0)}"/><path class="tr" d="${wavePath(0)}"/></svg></section>`;
const specX=[0,.145,.29,.48,.66,.86];
const specPath=()=>{let d='M72 300';const N=200;for(let i=0;i<=N;i++){const f=i/N,env=Math.exp(-(((f-.22)/.07)**2))*62+Math.exp(-(((f-.3)/.05)**2))*20+Math.exp(-(((f-.565)/.006)**2))*36+Math.exp(-(((f-.45)/.12)**2))*8,
 spike=(i%2?Math.random()*.45:.75+Math.random()*.4),db=-100+4+Math.random()*7+env*spike+(i===44?14:0);
 d+=`L${(72+f*516).toFixed(1)} ${Math.min(298,40-db*2.6).toFixed(1)}`;}return d+'L588 300Z';};
const SPEC=`<section class="pnl spec"><h4>B. Spectrum</h4><svg viewBox="0 0 600 340" role="img" aria-label="Frequency spectrum from 0 to 20 kilohertz"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7dffa8" stop-opacity=".95"/><stop offset="1" stop-color="#2ea860" stop-opacity=".55"/></linearGradient></defs>
${grid(6,6).replace(/M\d+\.?\d* 10V300/g,'')}${specX.slice(1).map(f=>`<path class="gl" d="M${(70+f*520).toFixed(1)} 10V300"/>`).join('')}
${[0,-20,-40,-60,-80,-100].map((l,i)=>`<text x="58" y="${45+i*52}" text-anchor="end">${l}</text>`).join('')}
${['0','1k','2k','5k','10k','20k'].map((l,i)=>`<text x="${72+specX[i]*520}" y="330" text-anchor="middle">${l}</text>`).join('')}
<text x="455" y="34">REF</text><text x="578" y="34" text-anchor="end">0 dB</text><text x="455" y="62">RBW</text><text x="578" y="62" text-anchor="end">100 Hz</text>
<path class="sp" fill="url(#sg)" d="${specPath()}"/></svg></section>`;
const RADAR=`<section class="pnl radar"><h4>C. Radar scope</h4>
<dl class="ro l"><dt>Range</dt><dd>50 NM</dd><dt>Gain</dt><dd>72%</dd><dt>Sea</dt><dd>28%</dd><dt>Rain</dt><dd>12%</dd></dl>
<dl class="ro r"><dt>HDG</dt><dd>118.4°</dd><dt>SPD</dt><dd>12.6 KT</dd><dt>BRG</dt><dd>042.7°</dd><dt>DST</dt><dd>18.4 NM</dd></dl>
<svg class="scope" viewBox="-260 -260 520 520" role="img" aria-label="Radar scope, 50 nautical mile range, 7 targets"><defs><radialGradient id="rbg"><stop offset="0" stop-color="#0d2416"/><stop offset="1" stop-color="#040b06"/></radialGradient>
<linearGradient id="sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6dff9a" stop-opacity="0"/><stop offset="1" stop-color="#6dff9a" stop-opacity=".55"/></linearGradient></defs>
<circle r="205" fill="url(#rbg)"/>${[41,82,123,164].map(r=>`<circle class="rg" r="${r}"/>`).join('')}<circle class="rg o" r="205"/>
<path class="rg" d="M0-205V205M-205 0H205M-145-145 145 145M145-145-145 145"/>
<g class="sweep"><path d="M0 0L205 0A205 205 0 0 0 177.5-102.5Z" fill="url(#sw)" transform="rotate(30)"/><path class="sl" d="M0 0L205 0"/></g><circle r="3" fill="#9dffbc"/>
${[[91,-120,1],[62,-88,0],[-127,-47,1],[-113,56,1],[-83,118,0],[38,157,0]].map(([x,y,b])=>`<g class="bp${b?' big':''}" transform="translate(${(x*.872).toFixed(1)} ${(y*.872).toFixed(1)})"><path class="fl" d="M0-${b?16:10}V${b?16:10}M-${b?12:7} 0H${b?12:7}"/>${b?'<circle r="6.5"/>':'<rect x="-4.5" y="-4.5" width="9" height="9" transform="rotate(45)"/>'}</g>`).join('')}
<text y="-228" text-anchor="middle">N</text><text y="244" text-anchor="middle">S</text><text x="-236" y="6" text-anchor="middle">W</text><text x="236" y="6" text-anchor="middle">E</text></svg>
<dl class="ro bl"><dt>N</dt><dd>UP</dd><dt>STAB</dt><dd>ON</dd></dl><dl class="ro br"><dt>Trail</dt><dd>60S</dd><dt>Vector</dt><dd>ON</dd></dl></section>`;
const rows=[['01','042.7°','18.4','12.6','Vessel'],['02','118.9°','07.1','0.0','Buoy'],['03','276.3°','24.8','16.2','Vessel'],['04','311.5°','11.9','0.0','Land'],['05','085.1°','33.6','22.4','Vessel'],['06','199.8°','28.1','0.0','Unknown'],['07','153.2°','14.7','8.3','Vessel']];
const TABLE=`<section class="pnl tbl"><h4>D. Target list [ 7 ]</h4><div class="tw"><table><thead><tr><th>ID</th><th>BRG</th><th>DST</th><th>SPD</th><th>Type</th></tr></thead><tbody>
${rows.map((r,i)=>`<tr tabindex="0" aria-selected="${!i}"${i?'':' class="on"'}>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
const tableInit=r=>{const trs=[...r.querySelectorAll('tbody tr')],sel=tr=>trs.forEach(x=>{x.classList.toggle('on',x===tr);x.setAttribute('aria-selected',x===tr);});
 trs.forEach(tr=>{tr.onclick=()=>sel(tr);tr.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sel(tr);}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const n=trs[trs.indexOf(tr)+(e.key==='ArrowDown'?1:-1)];if(n){n.focus();sel(n);}}};});};
const STATUS=`<section class="pnl stat"><h4>E. System status</h4><dl>${[['Antenna','Online'],['Receiver','Locked'],['Processor','Nominal'],['Storage','<span class="rec">Recording</span>'],['GPS','52.2057 N&nbsp; 0.1198 E']].map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}<dt>Time</dt><dd data-time>22:37:26 UTC</dd></dl></section>`;
const waveInit=r=>{const ps=r.querySelectorAll('.wave .tr');let ph=0;loop(r,90,()=>{ph+=.18;const d=wavePath(ph);ps.forEach(p=>p.setAttribute('d',d));});};
const specInit=r=>{const p=r.querySelector('.sp');loop(r,140,()=>p.setAttribute('d',specPath()));};
SysComponents.add({
system:'D30',
fonts:['Share+Tech+Mono'],
css:`.sc-D30{--g:#5cf28c;--g2:#3fcf73;--dim:#2c8a50;--cy:#56e0c2;--line:#1b5a34;--bg:#030906;font-family:'Share Tech Mono',ui-monospace,monospace;color:var(--g);text-transform:uppercase;letter-spacing:.06em}
.pnl{position:relative;background:radial-gradient(120% 90% at 50% 40%,#07160d,var(--bg));border:1px solid var(--line);border-radius:6px;padding:16px 18px 14px;box-shadow:inset 0 0 40px rgba(60,255,140,.05),0 10px 30px -18px rgba(0,0,0,.6)}
.pnl::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 1px,transparent 1px 3px);mix-blend-mode:multiply}
h4{margin:0 0 10px;font-weight:400;font-size:17px;letter-spacing:.1em;color:var(--g);text-shadow:0 0 8px rgba(92,242,140,.45)}
svg text{fill:var(--g2);font-family:inherit;font-size:19px}
.gl{stroke:#164a2a;stroke-width:1;fill:none}.fr{fill:none;stroke:#2c8a50;stroke-width:1.5}
.tr{fill:none;stroke:#8dffb0;stroke-width:2.2;stroke-linejoin:round}.tr.glow{stroke:#3dff7e;stroke-width:7;opacity:.25;filter:blur(3px)}
.sp{stroke:#9dffbc;stroke-width:.8;filter:drop-shadow(0 0 4px rgba(92,242,140,.5))}
.rg{fill:none;stroke:#2a8a52;stroke-width:1.2}.rg.o{stroke:#4ad57f;stroke-width:2;filter:drop-shadow(0 0 5px rgba(92,242,140,.5))}
.sweep{transform-origin:0 0;animation:sw 6s linear infinite}.sl{stroke:#9dffbc;stroke-width:2}@keyframes sw{to{transform:rotate(360deg)}}
.bp circle,.bp rect{fill:#b6ffcb;filter:drop-shadow(0 0 6px #5cf28c)}.bp .fl{stroke:#5cf28c;stroke-width:1.2;opacity:.6}.bp.big circle{filter:drop-shadow(0 0 10px #5cf28c)}
.bp{animation:bl 6s linear infinite}@keyframes bl{0%,100%{opacity:1}60%{opacity:.55}}
.radar{display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto 1fr auto}
.radar h4{grid-column:1/-1}.scope{grid-column:1/-1;grid-row:3;width:94%;margin:-40px auto -30px;overflow:visible}
.ro{display:grid;justify-self:start;align-self:start;grid-template-columns:auto auto;gap:4px 14px;margin:0;font-size:16px;grid-row:2;z-index:1}.ro dt,.ro dd{margin:0}.ro dd{color:var(--g2)}
.ro.r{text-align:right;justify-self:end}.ro.r dt{color:var(--cy)}.ro.r dd{color:var(--cy)}.ro.bl{grid-row:4;justify-self:start;align-self:end}.ro.br{grid-row:4;grid-column:2;justify-self:end;color:var(--cy)}.ro.br dd{color:var(--cy)}
.tw{border:1px solid var(--dim);border-radius:6px;overflow:hidden;padding-bottom:10px}
table{width:100%;border-collapse:collapse;font-size:16px}th{font-weight:400;text-align:left;color:var(--g2);padding:12px 10px 10px;border-bottom:1px solid var(--line)}
td{padding:6px 10px;color:var(--g);white-space:nowrap}td:nth-child(n+2):nth-child(-n+4){font-variant-numeric:tabular-nums}
tbody tr{cursor:pointer;outline:none;transition:background .15s}tbody tr:hover{background:rgba(92,242,140,.08)}
tbody tr.on{background:linear-gradient(90deg,rgba(92,242,140,.32),rgba(92,242,140,.18));color:#cfffe0}tbody tr.on td{color:#d9ffe6;text-shadow:0 0 6px rgba(92,242,140,.6)}
tbody tr:focus-visible{box-shadow:inset 0 0 0 1px var(--g)}
.stat dl{display:grid;grid-template-columns:1fr 1.5fr;gap:6px 18px;margin:6px 0 0;padding-left:30px;font-size:16px}.stat dt{color:var(--g2)}.stat dd{margin:0;color:var(--g)}
.rec::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:#ff5a4f;margin-right:8px;vertical-align:2px;box-shadow:0 0 6px #ff5a4f;animation:rec 1.4s steps(2) infinite}@keyframes rec{50%{opacity:.2}}`,
items:{
X125:{w:560,html:`<nav class="fk" aria-label="Function keys">${['System','Display','Mark','Trace','Setup'].map((n,i)=>`<button${i==1?' class="on" aria-pressed="true"':' aria-pressed="false"'}><kbd>F${i+1}</kbd>${n}</button>`).join('')}</nav>`,
css:`.fk{display:flex;gap:4px;padding:6px;background:var(--bg);border:1px solid var(--line);border-radius:6px}
.fk button{flex:1;display:flex;gap:8px;justify-content:center;align-items:center;font-size:17px;letter-spacing:.06em;color:var(--cy);padding:9px 8px;border-radius:4px;border:1px solid transparent;transition:background .15s,color .15s;text-transform:uppercase}
.fk kbd{font:inherit;color:var(--g)}.fk button:hover{background:rgba(86,224,194,.1);border-color:#1f5a4c}
.fk button.on{background:rgba(92,242,140,.16);border-color:var(--dim);color:#cfffe0;text-shadow:0 0 6px rgba(92,242,140,.6)}.fk button:focus-visible{outline:1px solid var(--g);outline-offset:1px}`,
init(r){const bs=[...r.querySelectorAll('button')];bs.forEach(b=>b.onclick=()=>bs.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b);}));
 r.addEventListener('keydown',e=>{const m=/^F([1-5])$/.exec(e.key);if(m){e.preventDefault();bs[m[1]-1].click();bs[m[1]-1].focus();}});}},
X126:{w:200,html:`<div class="clk pnl" role="timer" aria-live="off"><span data-date>2024-06-14</span><span data-time>22:37:26 UTC</span></div>`,
css:`.clk{display:flex;flex-direction:column;align-items:flex-end;gap:4px;font-size:21px;padding:12px 16px;font-variant-numeric:tabular-nums;text-shadow:0 0 8px rgba(92,242,140,.45)}.clk [data-time]{color:var(--cy)}`,init:clock},
X127:{w:500,html:WAVE,init:waveInit},
X128:{w:420,html:SPEC,init:specInit},
X129:{w:500,html:RADAR},
X130:{w:400,html:TABLE,init:tableInit},
X131:{w:400,html:STATUS,init:clock},
X134:{w:1040,html:`<div class="frame"><div class="top">${WAVE}${SPEC}</div><div class="bot">${RADAR}<div class="col">${TABLE}${STATUS}</div></div></div>`,
css:`.frame{display:grid;gap:1px;background:var(--line);border:1px solid var(--dim);border-radius:8px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.4),0 20px 50px -24px rgba(0,0,0,.7)}
.top,.bot,.col{display:grid;gap:1px}.top{grid-template-columns:1.18fr 1fr}.bot{grid-template-columns:1.3fr 1fr}
.frame .pnl{border:0;border-radius:0;box-shadow:none}.frame .scope{width:88%}`,
init(r){waveInit(r);specInit(r);tableInit(r);clock(r);}}
}});
})();
