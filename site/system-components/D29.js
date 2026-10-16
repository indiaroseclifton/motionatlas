/* D29 Family Table: heirloom recipe library. Warm paper, forest green, letterpress serif, walnut shelf. */
(()=>{
const arr=(s=14)=>`<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/></svg>`;
const books=[['bread','Bread','Rustic recipes<br>for real life','#2f4a35'],['veg','Vegetables','Seasonal<br>&amp; simple','#3d5a43'],['pasta','Pasta','Handmade<br>at home','#c9a97a'],['sweets','Sweets','Cakes, tarts<br>and treats','#c98a76'],['preserves','Preserves','Jams, pickles<br>and beyond','#8fa391']];
SysComponents.add({
system:'D29',
fonts:['Libre+Caslon+Text:ital,wght@0,400;0,700;1,400','Jost:wght@500;600'],
css:`.sc-D29{--paper:#f5efe1;--paper2:#ece4d1;--ink:#1f2620;--green:#244a33;--green2:#1b3a27;--hair:rgba(40,36,24,.16);font-family:'Libre Caslon Text',Georgia,serif;color:var(--ink)}
a:focus-visible,button:focus-visible{outline:2px solid var(--green);outline-offset:3px}
.pill{display:inline-flex;align-items:center;gap:12px;font-family:Jost,system-ui,sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.12em;text-decoration:none;background:var(--green);color:#f5efe1;border-radius:999px;transition:background .2s,transform .2s,box-shadow .2s}
.pill:hover{background:var(--green2);box-shadow:0 6px 16px -8px rgba(27,58,39,.6)}.pill:active{transform:translateY(1px)}
.pill svg{transition:transform .2s}.pill:hover svg{transform:translateX(3px)}
.more{display:inline-flex;align-items:center;gap:8px;font-size:15px;text-decoration:none;color:var(--ink)}
.more span{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .25s}.more:hover span{background-size:100% 1px}
.more svg{transition:transform .2s}.more:hover svg{transform:translateX(3px)}`,
items:{
X191:{w:660,html:`<header class="nav"><nav aria-label="Primary">${['Recipes','Our Story','Journal','Shop'].map((n,i)=>`<a href="#"${i?'':' class="on" aria-current="page"'}>${n}</a>`).join('')}</nav>
<button class="ic" aria-label="Search recipes"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg></button>
<a href="#" class="pill mine"><span>My recipes (3)</span></a></header>`,
css:`.nav{display:flex;align-items:center;gap:22px;background:var(--paper);border:1px solid var(--hair);border-radius:10px;padding:14px 14px 14px 26px}
nav{display:flex;gap:32px;flex:1}nav a{white-space:nowrap;font-size:17px;text-decoration:none;position:relative;padding:4px 0}
nav a::after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:1px;background:currentColor;transform:scaleX(0);transition:transform .25s}
nav a:hover::after,nav a.on::after{transform:scaleX(1)}nav a.on{color:var(--green)}
.ic{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;transition:background .2s}.ic:hover{background:var(--paper2)}
.mine{font-size:13px;padding:14px 24px}`,
init(r){r.querySelectorAll('nav a').forEach(a=>a.onclick=e=>{e.preventDefault();r.querySelectorAll('nav a').forEach(x=>{x.classList.toggle('on',x===a);x.toggleAttribute('aria-current',x===a)})});}},
X194:{w:260,html:`<a href="#" class="pill big">Explore recipes ${arr(15)}</a>`,css:`.sc-D29{display:flex;justify-content:center}.big{font-size:15px;padding:17px 30px 17px 32px;gap:16px}`},
X201:{w:150,html:`<a href="#" class="more chip"><span>View All</span>${arr(14)}</a>`,css:`.sc-D29{display:flex;justify-content:center}.chip{background:var(--paper);border:1px solid var(--hair);border-radius:999px;padding:9px 16px 9px 18px}`},
X195:{w:900,html:`<section class="lib"><div class="hd"><h3>A Library of Good Taste</h3><a href="#" class="more"><span>View All</span>${arr(14)}</a></div>
<div class="shelf"><div class="row"><span class="lean" aria-hidden="true"><i>Family Favourites</i></span>
${books.map(([k,t,s,c])=>`<a href="#" class="book" style="--sp:${c}" aria-label="${t} collection"><span class="cv"><b>${t}</b><small>${s}</small><img src="{{img}}/D29-${k}.webp" alt=""></span></a>`).join('')}</div></div></section>`,
css:`.lib{background:var(--paper);border:1px solid var(--hair);border-radius:12px;padding:22px 24px 0;overflow:hidden}
.hd{display:flex;justify-content:space-between;align-items:baseline;padding:0 4px 16px}
h3{margin:0;font-weight:400;font-size:16px;letter-spacing:.16em;text-transform:uppercase}
.shelf{position:relative;margin:0 -24px;padding:0 24px;background:linear-gradient(#3b2a1d,#4a3424 30%,#3a291c);border-top:16px solid #7a5434;border-bottom:18px solid #6e4a2d;box-shadow:inset 0 10px 14px -6px rgba(0,0,0,.55)}
.shelf::before,.shelf::after{content:'';position:absolute;left:0;right:0;height:16px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 3px,transparent 3px 11px),linear-gradient(#946a45,#7a5434);top:-16px}
.shelf::after{top:auto;bottom:-18px;height:18px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0 2px,transparent 2px 9px),linear-gradient(#8a603c,#5e3f26)}
.row{display:flex;align-items:flex-end;gap:14px;padding:22px 4px 0 6px}
.lean{width:34px;height:262px;background:linear-gradient(90deg,#c9b48f,#ddc9a3 45%,#bfa47a);border-radius:2px 2px 0 0;display:grid;place-items:center;box-shadow:2px 0 6px rgba(0,0,0,.35);margin-right:4px}
.lean i{writing-mode:vertical-rl;transform:rotate(180deg);font-size:11px;letter-spacing:.14em;color:#5a4630;text-transform:uppercase;font-style:normal}
.book{flex:1 1 0;min-width:0;display:flex;text-decoration:none;color:var(--ink);transition:transform .3s cubic-bezier(.2,.8,.2,1);filter:drop-shadow(3px 0 5px rgba(0,0,0,.4))}
.book::before{content:'';width:11px;background:linear-gradient(90deg,var(--sp),color-mix(in srgb,var(--sp) 75%,#fff) 60%,var(--sp));border-radius:2px 0 0 0}
.book:hover,.book:focus-visible{transform:translateY(-10px)}.book:focus-visible{outline:none}.book:focus-visible .cv{box-shadow:0 0 0 2px var(--paper),0 0 0 4px var(--green)}
.cv{flex:1;min-width:0;height:270px;background:linear-gradient(170deg,#ece2cc,#dccdb4);border-radius:0 3px 0 0;display:flex;flex-direction:column;align-items:center;padding:26px 10px 0;text-align:center;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(0,0,0,.05),inset 8px 0 10px -8px rgba(0,0,0,.25)}
.cv b{font-weight:400;font-size:16px;letter-spacing:.04em;text-transform:uppercase}
.cv small{color:#4a4436;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;line-height:1.6;margin-top:8px;color:#4a4436}
.cv img{width:100%;height:150px;object-fit:contain;object-position:center bottom;-webkit-mask-image:radial-gradient(ellipse 72% 70% at 50% 56%,#000 62%,transparent 100%);mask-image:radial-gradient(ellipse 72% 70% at 50% 56%,#000 62%,transparent 100%);margin-top:auto}`}
}});
})();
