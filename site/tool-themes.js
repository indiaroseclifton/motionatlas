/* Shared theme picker for the tool pages (Motion graphics, UI interactions, App interfaces).
   Themes are sets of the page's CSS variables; the choice is remembered in this browser. Load in <head>, no defer. */
(()=>{
const KEY='atlas-tool-theme',DEF='midnight';
const T={
 midnight:['Midnight','#0B0D14','#8B7CFF',{bg:'#0B0D14',panel:'#141824',ink:'#ECEEF6',mute:'#98A1B8',hair:'#262C3E',soft:'#1B2030',accent:'#8B7CFF',ai:'#0B0D14'},1],
 graphite:['Graphite','#121212','#FFB224',{bg:'#121212',panel:'#1C1C1E',ink:'#F2F2F2',mute:'#A0A0A6',hair:'#2E2E32',soft:'#242428',accent:'#FFB224',ai:'#1A1200'},1],
 ocean:['Ocean','#08141C','#2DD4BF',{bg:'#08141C',panel:'#0E1F2B',ink:'#E6F3F8',mute:'#8FB1C2',hair:'#1E3646',soft:'#132A39',accent:'#2DD4BF',ai:'#04201D'},1],
 forest:['Forest','#0C140F','#7DD87F',{bg:'#0C140F',panel:'#131F17',ink:'#E8F1EA',mute:'#9CB3A2',hair:'#25392B',soft:'#192A1E',accent:'#7DD87F',ai:'#0A1A0C'},1],
 plum:['Plum','#150C14','#FF6FAE',{bg:'#150C14',panel:'#20121F',ink:'#F8E9F3',mute:'#BE9BB4',hair:'#3A2238',soft:'#2A182A',accent:'#FF6FAE',ai:'#2A0B1A'},1],
 paper:['Paper','#F6F1E8','#B4531A',{bg:'#F6F1E8',panel:'#FFFDF8',ink:'#231F18',mute:'#6B6254',hair:'#E3DAC8',soft:'#F0E9DB',accent:'#B4531A',ai:'#FFFFFF'},0],
 daylight:['Daylight','#F4F5F8','#5B2DFF',{bg:'#F4F5F8',panel:'#FFFFFF',ink:'#1C1F2A',mute:'#5E6476',hair:'#E1E4EC',soft:'#F7F8FB',accent:'#5B2DFF',ai:'#FFFFFF'},0]
};
let css='html[data-tt]{--accent-ink:var(--ai,#fff)}';
for(const [id,[n,,,v,dark]] of Object.entries(T))css+=`html[data-tt="${id}"]{--bg:${v.bg};--panel:${v.panel};--ink:${v.ink};--mute:${v.mute};--hair:${v.hair};--soft:${v.soft};--accent:${v.accent};--ai:${v.ai};--shadow:${dark?'0 1px 2px rgba(0,0,0,.4),0 12px 30px -14px rgba(0,0,0,.6)':'0 1px 2px rgba(20,24,40,.05),0 10px 30px -14px rgba(20,24,40,.2)'};color-scheme:${dark?'dark':'light'}}`;
css+=`
html[data-tt] .btn.primary{color:var(--accent-ink)}html[data-tt] .btn.primary:hover{background:var(--accent);filter:brightness(1.1)}
html[data-tt] .seg button[aria-pressed=true],html[data-tt] .chips button[aria-pressed=true],html[data-tt] .chip[aria-pressed=true]{color:var(--panel)}
html[data-tt] .chip.new[aria-pressed=true],html[data-tt] .badge{color:var(--accent-ink)}
html[data-tt] .toast,html[data-tt] .skip{color:var(--panel)}
html[data-tt] header.top{background:color-mix(in srgb,var(--panel) 92%,transparent)}
html[data-tt] #mgStage{background:repeating-conic-gradient(var(--soft) 0 25%,var(--bg) 0 50%) 0 0/20px 20px}
html[data-tt] .btn:not(.primary):not([aria-pressed=true]),html[data-tt] .chip:not([aria-pressed=true]),html[data-tt] .card,html[data-tt] dialog,html[data-tt] .pop{background-color:var(--panel);color:var(--ink)}
html[data-tt] .chip[aria-pressed=true]{background-color:var(--ink);color:var(--panel);border-color:var(--ink)}
html[data-tt] .chip.new[aria-pressed=true]{background-color:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
html[data-tt] .btn[aria-pressed=true]{background:var(--ink);color:var(--panel)}
html[data-tt] input,html[data-tt] select,html[data-tt] textarea{background:var(--panel);color:var(--ink);border-color:var(--hair)}
html[data-tt] .view{background:var(--soft)}html[data-tt] .view.light{background:#EEE9E0}html[data-tt] .stage{background:var(--soft)}
html[data-tt] .view iframe{width:1200px!important;height:750px!important;transform:scale(var(--k,.27))!important;transform-origin:0 0}
html[data-tt] .view{aspect-ratio:16/10!important}
#ttBtn{position:fixed;left:max(14px,env(safe-area-inset-left));bottom:max(14px,env(safe-area-inset-bottom));z-index:90;display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 14px 0 10px;border-radius:999px;border:1px solid var(--hair);background:var(--panel);color:var(--ink);font:600 13px/1 Inter,system-ui,sans-serif;box-shadow:var(--shadow,0 6px 20px rgba(0,0,0,.2));cursor:pointer}
#ttBtn i{width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,var(--accent) 50%,var(--bg) 50%);box-shadow:0 0 0 1.5px var(--hair)}
#ttPop{position:fixed;left:max(14px,env(safe-area-inset-left));bottom:calc(max(14px,env(safe-area-inset-bottom)) + 48px);z-index:91;width:min(260px,calc(100vw - 28px));padding:8px;border-radius:14px;border:1px solid var(--hair);background:var(--panel);color:var(--ink);box-shadow:0 20px 50px -16px rgba(0,0,0,.5);display:grid;gap:2px}
#ttPop[hidden]{display:none}
#ttPop h2{margin:2px 8px 6px;font:600 11px/1.2 'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
#ttPop button{display:flex;align-items:center;gap:10px;min-height:40px;padding:0 10px;border:0;border-radius:9px;background:none;color:inherit;font:500 14px/1 Inter,system-ui,sans-serif;text-align:left;cursor:pointer}
#ttPop button:hover{background:var(--soft)}#ttPop button[aria-checked=true]{background:var(--soft);font-weight:700}
#ttPop button .sw{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;box-shadow:0 0 0 1.5px var(--hair)}#ttPop button .sw b{width:10px;height:10px;border-radius:50%}
#ttPop button .ck{margin-left:auto;opacity:0}#ttPop button[aria-checked=true] .ck{opacity:1}
#ttBtn:focus-visible,#ttPop button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}`;
const st=document.createElement('style');st.id='ttCss';st.textContent=css;document.head.append(st);
const root=document.documentElement;let cur=DEF;
try{const s=localStorage.getItem(KEY);if(s&&T[s])cur=s}catch{}
const q=new URLSearchParams(location.search).get('theme');if(q&&T[q])cur=q;
root.dataset.tt=cur;
function set(id,save){cur=id;root.dataset.tt=id;if(save){try{localStorage.setItem(KEY,id)}catch{}}document.dispatchEvent(new CustomEvent('tooltheme',{detail:{id,dark:!!T[id][4],accent:T[id][3].accent}}));mark()}
let pop,btn;function mark(){if(!pop)return;pop.querySelectorAll('button').forEach(b=>b.setAttribute('aria-checked',b.dataset.id===cur));if(btn)btn.querySelector('span').textContent=T[cur][0]}
function build(){btn=document.createElement('button');btn.id='ttBtn';btn.type='button';btn.setAttribute('aria-haspopup','true');btn.setAttribute('aria-expanded','false');btn.innerHTML='<i></i><span></span>';
 pop=document.createElement('div');pop.id='ttPop';pop.hidden=true;pop.setAttribute('role','radiogroup');pop.setAttribute('aria-label','Page theme');
 pop.innerHTML='<h2>Theme</h2>'+Object.entries(T).map(([id,[n,bg,ac]])=>`<button type="button" role="radio" data-id="${id}" aria-checked="false"><span class="sw" style="background:${bg}"><b style="background:${ac}"></b></span>${n}<span class="ck" aria-hidden="true">✓</span></button>`).join('');
 document.body.append(btn,pop);mark();
 const shut=f=>{pop.hidden=true;btn.setAttribute('aria-expanded','false');if(f)btn.focus()};
 btn.onclick=()=>{const o=pop.hidden;pop.hidden=!o;btn.setAttribute('aria-expanded',o);if(o)pop.querySelector('[aria-checked=true]').focus()};
 pop.onclick=e=>{const b=e.target.closest('[data-id]');if(b){set(b.dataset.id,true)}};
 pop.onkeydown=e=>{const bs=[...pop.querySelectorAll('button')],i=bs.indexOf(document.activeElement);if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();bs[(i+1)%bs.length].focus()}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();bs[(i-1+bs.length)%bs.length].focus()}else if(e.key==='Escape'){shut(true)}};
 document.addEventListener('click',e=>{if(!pop.hidden&&!pop.contains(e.target)&&!btn.contains(e.target))shut()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
/* scale the live preview frames: each .view shows a 1200 x 750 page shrunk to fit its card */
const ro=new ResizeObserver(es=>es.forEach(e=>e.target.style.setProperty('--k',(e.contentRect.width/1200).toFixed(4))));
const seen=new WeakSet(),obs=n=>{n.querySelectorAll?.('.view').forEach(v=>{if(!seen.has(v)){seen.add(v);ro.observe(v)}});if(n.matches?.('.view')&&!seen.has(n)){seen.add(n);ro.observe(n)}};
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(obs))).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',()=>obs(document));
window.ToolThemes={themes:T,set,get:()=>cur};
})();
