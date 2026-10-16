/* D31 Nexus: electronic music label. Midnight navy, iridescent pink to lavender gradients, rounded geometric sans. */
(()=>{
const play=(s=16)=>`<svg class="pl" width="${s}" height="${s}" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.2v11.6c0 .5.5.8.9.5l9-5.8a.6.6 0 0 0 0-1L4.9 1.7c-.4-.3-.9 0-.9.5Z" fill="currentColor"/></svg>`;
const pause=(s=16)=>`<svg class="pa" width="${s}" height="${s}" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor"/><rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor"/></svg>`;
const film=`<button class="film" aria-pressed="false"><span class="ring">${play(18)}${pause(16)}</span><span class="lbl">Watch Film</span></button>`;
const filmInit=r=>r.querySelectorAll('.film').forEach(b=>b.onclick=()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);b.querySelector('.lbl').textContent=on?'Pause Film':'Watch Film';});
const rel=[['aurora','Aurora','NEXUS','Album'],['momentum','Momentum','Lila Moon','Single'],['echoes','Echoes','Various Artists','Compilation'],['horizon','Horizon','Kael','EP'],['parallel','Parallel','NEXUS','Single']];
SysComponents.add({
system:'D31',
fonts:['Outfit:wght@300;400;500;600;800'],
css:`.sc-D31{--navy:#0a0f2c;--navy2:#141a45;--ink:#f4f1ff;--mute:#b9b6d9;--pink:#f5a9ec;--lav:#c9b6ff;--peri:#9f9cff;--grad:linear-gradient(100deg,#f7a8ea,#e9b8f6 55%,#d7c3ff);font-family:Outfit,system-ui,sans-serif;color:var(--ink)}
.glass{background:linear-gradient(180deg,rgba(26,22,70,.92),rgba(12,14,44,.94));border:1px solid rgba(201,182,255,.18);box-shadow:0 18px 40px -22px rgba(20,8,60,.8),inset 0 1px 0 rgba(255,255,255,.06);backdrop-filter:blur(14px)}
a:focus-visible,button:focus-visible{outline:2px solid var(--lav);outline-offset:3px}
.film{display:inline-flex;align-items:center;gap:18px;font-size:22px;font-weight:500;color:var(--ink);letter-spacing:.005em}
.film .ring{width:62px;height:62px;border-radius:50%;border:1.5px solid rgba(255,255,255,.75);display:grid;place-items:center;transition:background .25s,border-color .25s,transform .25s}
.film .ring svg{grid-area:1/1}.film .pl{margin-left:3px}.film .pa,.film[aria-pressed=true] .pl{display:none}.film[aria-pressed=true] .pa{display:block}
.film:hover .ring{background:rgba(255,255,255,.12);border-color:#fff;transform:scale(1.05)}
.film[aria-pressed=true] .ring{background:var(--grad);border-color:transparent;color:#1b1440;box-shadow:0 0 24px rgba(245,169,236,.5)}`,
items:{
X136:{w:440,html:`<nav class="nav glass" aria-label="Primary">${['Music','Events','Artists','About'].map((n,i)=>`<a href="#"${i?'':' class="on" aria-current="page"'}>${n}</a>`).join('')}</nav>`,
css:`.nav{display:flex;justify-content:space-between;gap:8px;padding:8px;border-radius:999px}
.nav a{flex:1;text-align:center;font-size:19px;font-weight:400;text-decoration:none;color:var(--mute);padding:10px 16px;border-radius:999px;position:relative;transition:color .2s,background .2s}
.nav a:hover{color:var(--ink);background:rgba(255,255,255,.06)}.nav a.on{color:var(--ink)}
.nav a.on::after{content:'';position:absolute;left:50%;bottom:4px;width:18px;height:2px;margin-left:-9px;border-radius:2px;background:var(--grad);box-shadow:0 0 8px var(--pink)}`,
init(r){const as=[...r.querySelectorAll('a')];as.forEach(a=>a.onclick=e=>{e.preventDefault();as.forEach(x=>{x.classList.toggle('on',x===a);x.toggleAttribute('aria-current',x===a)})});}},
X137:{w:180,html:`<a href="#" class="sign">Sign In</a>`,
css:`.sc-D31{display:flex;justify-content:center}.sign{display:inline-block;font-size:20px;font-weight:500;text-decoration:none;color:#1a1546;padding:15px 36px;border-radius:999px;background:linear-gradient(100deg,#a7a2ff,#c6adf7 60%,#dcb6f2);box-shadow:0 8px 24px -10px rgba(159,156,255,.75),inset 0 1px 0 rgba(255,255,255,.5);transition:filter .2s,transform .2s,box-shadow .2s}
.sign:hover{filter:brightness(1.07);box-shadow:0 10px 30px -8px rgba(201,160,255,.85),inset 0 1px 0 rgba(255,255,255,.5)}.sign:active{transform:translateY(1px)}`},
X141:{w:560,html:`<div class="acts glass"><a href="#" class="listen">${play(22)}<span>Listen Now</span></a>${film}</div>`,
css:`.acts{display:flex;align-items:center;gap:36px;padding:18px 34px 18px 18px;border-radius:999px;background:linear-gradient(100deg,rgba(40,20,80,.94),rgba(78,30,110,.9));}
.listen{display:inline-flex;align-items:center;gap:28px;padding:24px 46px 24px 40px;border-radius:999px;background:var(--grad);color:#14112e;font-size:24px;font-weight:500;text-decoration:none;box-shadow:0 0 34px -4px rgba(245,169,236,.6),inset 0 1px 0 rgba(255,255,255,.55);transition:transform .2s,box-shadow .2s}
.listen:hover{transform:translateY(-1px);box-shadow:0 0 44px 0 rgba(245,169,236,.75),inset 0 1px 0 rgba(255,255,255,.55)}.listen:active{transform:translateY(1px)}`,init:filmInit},
X142:{w:260,html:`<div class="wrap glass">${film}</div>`,css:`.sc-D31{display:flex;justify-content:center}.wrap{display:inline-flex;padding:10px 30px 10px 10px;border-radius:999px;background:linear-gradient(100deg,rgba(40,20,80,.94),rgba(78,30,110,.9))}`,init:filmInit},
X143:{w:900,html:`<section class="fr glass"><div class="hd"><h3>Featured Releases</h3><a href="#" class="all">View All <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 7h17M12 1.5 18 7l-6 5.5"/></svg></a></div>
<ul>${rel.map(([k,t,a,y])=>`<li><a href="#" aria-label="${t} by ${a}, ${y}"><span class="art"><img src="{{img}}/D31-${k}.webp" alt=""><i>${play(16)}</i></span><b>${t}</b><span class="by">${a}</span><span class="ty">${y}</span></a></li>`).join('')}</ul></section>`,
css:`.fr{border-radius:22px;padding:26px 28px 28px}.hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}
h3{margin:0;font-size:15px;font-weight:500;letter-spacing:.16em;text-transform:uppercase}
.all{display:inline-flex;align-items:center;gap:12px;font-size:17px;color:var(--mute);text-decoration:none;transition:color .2s}.all svg{transition:transform .2s}.all:hover{color:var(--ink)}.all:hover svg{transform:translateX(3px)}
ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:22px}li a{display:flex;flex-direction:column;text-decoration:none;color:var(--ink)}
.art{position:relative;aspect-ratio:1.18;border-radius:6px;overflow:hidden;margin-bottom:14px;box-shadow:0 12px 24px -14px rgba(0,0,0,.8);transition:transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s}
.art img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.art i{position:absolute;right:10px;bottom:10px;width:38px;height:38px;border-radius:50%;background:var(--grad);color:#14112e;display:grid;place-items:center;opacity:0;transform:translateY(6px);transition:opacity .25s,transform .25s;box-shadow:0 6px 16px -4px rgba(0,0,0,.6)}
.art i svg{margin-left:2px}
li a:hover .art,li a:focus-visible .art{transform:translateY(-4px);box-shadow:0 18px 30px -14px rgba(201,120,255,.55)}li a:hover img{transform:scale(1.05)}li a:hover i,li a:focus-visible i{opacity:1;transform:none}
li a:focus-visible{outline:none}li a:focus-visible .art{outline:2px solid var(--lav);outline-offset:3px}
b{font-size:18px;font-weight:600}.by{font-size:17px;font-weight:300;color:#e6e3f7;margin-top:2px}.ty{font-size:16px;font-weight:300;color:var(--mute);margin-top:18px}`},
X150:{w:220,html:`<figure class="cap glass"><figcaption><b>Aurora</b><span class="by">NEXUS</span><span class="ty">Album</span></figcaption></figure>`,
css:`.cap{margin:0;border-radius:14px;padding:20px 24px 22px}figcaption{display:flex;flex-direction:column}b{font-size:24px;font-weight:600;letter-spacing:.005em}.by{font-size:23px;font-weight:300;margin-top:2px}.ty{font-size:21px;font-weight:300;color:var(--mute);margin-top:26px}`}
}});
})();
