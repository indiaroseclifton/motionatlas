/* D28 Signal Block: Bureau studio. Acid yellow, signal orange, cream and heavy black grid rules. */
(()=>{
const arrow=(s=14,w=2)=>`<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="square" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg>`;
SysComponents.add({
system:'D28',
fonts:['Anton','Archivo+Narrow:wght@500;600;700','Inter:wght@400;500'],
css:`.sc-D28{--ink:#0b0b0a;--yel:#f1f230;--org:#ff6419;--cream:#f7f2e4;--rule:4px;font-family:Inter,system-ui,sans-serif;color:var(--ink)}
.disp{font-family:Anton,'Archivo Narrow',Impact,sans-serif;font-weight:400;text-transform:uppercase;line-height:.9;letter-spacing:-.005em;margin:0}
.lab{font-family:'Archivo Narrow',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.02em}
.idx{font-family:'Archivo Narrow',sans-serif;font-weight:700;font-size:15px;letter-spacing:.02em}
.btn{display:inline-flex;white-space:nowrap;align-items:center;gap:12px;font-family:'Archivo Narrow',sans-serif;font-weight:700;font-size:15px;text-transform:uppercase;letter-spacing:.03em;text-decoration:none;padding:10px 16px;border:2.5px solid var(--ink);transition:background .18s,color .18s,transform .18s}
.btn svg{transition:transform .2s}.btn:hover svg{transform:translate(2px,-2px)}
.btn:focus-visible,a:focus-visible,button:focus-visible{outline:3px solid var(--org);outline-offset:3px}
.btn.solid{background:var(--ink);color:var(--yel)}.btn.solid:hover{background:var(--org);border-color:var(--org);color:var(--ink)}
.btn.line{background:var(--yel);color:var(--ink)}.btn.line:hover{background:var(--ink);color:var(--yel)}
.btn:active{transform:translateY(1px)}`,
items:{
X112:{w:820,html:`<header class="bar"><div class="main"><a href="#" class="logo disp" aria-label="Bureau home">Bureau</a>
<nav aria-label="Primary"><a href="#" class="lab on" aria-current="page">Work</a><a href="#" class="lab">Services</a><a href="#" class="lab">About</a><a href="#" class="lab">Journal</a></nav>
<a href="#" class="btn line">Start a project ${arrow(14)}</a></div>
<button class="menu" aria-label="Open menu" aria-expanded="false"><i></i><i></i><i></i></button></header>`,
css:`.bar{display:grid;grid-template-columns:1fr 84px;gap:var(--rule);background:var(--ink);padding:var(--rule)}
.main{background:var(--yel);display:flex;align-items:center;gap:30px;padding:12px 16px 12px 22px}
.logo{font-size:44px;text-decoration:none;letter-spacing:-.01em;line-height:1}
nav{display:flex;gap:26px;flex:1}nav a{font-size:17px;text-decoration:none;position:relative;padding:4px 0}
nav a::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:3px;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform .2s}
nav a:hover::after,nav a.on::after{transform:scaleX(1)}
.menu{background:var(--yel);display:grid;place-content:center;gap:6px}.menu i{display:block;width:40px;height:3px;background:var(--ink);transition:transform .2s,opacity .2s}
.menu:hover{background:var(--ink)}.menu:hover i{background:var(--yel)}
.menu[aria-expanded=true] i:nth-child(1){transform:translateY(9px) rotate(45deg)}.menu[aria-expanded=true] i:nth-child(2){opacity:0}.menu[aria-expanded=true] i:nth-child(3){transform:translateY(-9px) rotate(-45deg)}`,
init(r){const m=r.querySelector('.menu');m.onclick=()=>m.setAttribute('aria-expanded',m.getAttribute('aria-expanded')!=='true');
r.querySelectorAll('nav a').forEach(a=>a.onclick=e=>{e.preventDefault();r.querySelectorAll('nav a').forEach(x=>{x.classList.toggle('on',x===a);x.toggleAttribute('aria-current',x===a)})});}},
X113:{w:250,html:`<a href="#" class="btn line big">Start a project ${arrow(16)}</a>`,css:`.sc-D28{display:flex;justify-content:center}.big{font-size:18px;padding:13px 20px;gap:18px;box-shadow:0 0 0 3px var(--ink)}`},
X115:{w:300,html:`<section class="intro"><span class="idx">/01</span>
<p class="lab caps">Strategy.<br>Identity.<br>Digital.<br>Experiences.</p>
<p class="body">We’re a creative studio helping ambitious brands make a bigger impact in culture, commerce and people’s lives.</p>
<a href="#" class="btn solid">See our work ${arrow(13)}</a></section>`,
css:`.intro{background:var(--yel);border:var(--rule) solid var(--ink);padding:26px 26px 30px;display:flex;flex-direction:column;align-items:flex-start;min-height:470px}
.idx{align-self:flex-end}.caps{font-size:23px;line-height:1.2;margin:70px 0 30px;font-weight:600}
.body{font-size:15px;line-height:1.55;margin:0 0 30px;max-width:24ch}.btn{margin-top:auto}`},
X116:{w:200,html:`<a href="#" class="btn solid big">See our work ${arrow(14)}</a>`,css:`.sc-D28{display:flex;justify-content:center}.big{font-size:17px;padding:14px 20px;gap:18px;border-width:0;box-shadow:0 0 0 1px rgba(255,255,255,.16)}.big:hover{background:var(--org)}`},
X118:{w:320,html:`<a href="#" class="tile"><span class="idx">/02</span><h3 class="disp">Ideas<br>People<br>Feel.</h3>
<svg class="go" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="3.2" aria-hidden="true"><path d="M8 52 52 8M20 8h32v32"/></svg></a>`,
css:`.tile{display:grid;grid-template-rows:auto 1fr;position:relative;background:var(--org);border:var(--rule) solid var(--ink);padding:30px 26px 46px;min-height:560px;text-decoration:none;color:var(--ink);overflow:hidden}
h3{font-size:98px;align-self:center;letter-spacing:-.01em}
.go{position:absolute;right:28px;bottom:150px;width:52px;height:52px;transition:transform .25s cubic-bezier(.2,.8,.2,1)}
.tile:hover .go{transform:translate(6px,-6px)}.tile:focus-visible{outline:3px solid var(--yel);outline-offset:3px}`},
X120:{w:230,html:`<section class="list"><span class="idx">/03</span><ul>
${['Nike','Spotify','A24','Rimowa','Moncler'].map(n=>`<li><a href="#" class="disp">${n}</a></li>`).join('')}<li><a href="#" class="disp more">&amp; More</a></li></ul></section>`,
css:`.list{background:var(--cream);border:var(--rule) solid var(--ink);padding:26px 22px 40px;min-height:520px}
ul{list-style:none;margin:54px 0 0;padding:0}li a{display:inline-block;font-size:54px;line-height:1.14;text-decoration:none;padding:0 4px;margin-left:-4px;transition:background .15s,color .15s}
li a:hover{background:var(--ink);color:var(--yel)}li a.more:hover{background:var(--org);color:var(--ink)}`},
X122:{w:820,html:`<div class="grid" role="separator" aria-label="Section divider"><div class="row t"><i class="y"></i><i class="k"></i></div>
<div class="rule"></div>
<div class="row b"><i class="o"></i><i class="g"></i><i class="c"></i><i class="s"></i></div></div>`,
css:`.grid{background:var(--ink);padding:0 var(--rule)}.row{display:grid;gap:var(--rule);height:14px}.t{grid-template-columns:62% 1fr}.b{grid-template-columns:25% 29% 15% 1fr}
.y{background:var(--yel)}.k{background:#2a2622}.o{background:var(--org)}.g{background:#9a9792}.c{background:var(--cream)}.s{background:#5d6a62}
.rule{height:12px}`}
}});
})();
