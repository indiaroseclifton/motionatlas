SysComponents.add({
  system:'D23',
  fonts:['EB+Garamond:wght@400;500','Jost:wght@400;500'],
  css:`.sc-D23{--cream:#f4eee2;--ink:#26251f;--ink2:#4a4840;--sage:#5c6b4b;--sage2:#4b5a3c;--leaf:#7d8a68;--line:rgba(38,37,31,.14);
  font-family:'EB Garamond',Garamond,Georgia,serif;color:var(--ink)}
.cream{background:var(--cream);border:1px solid rgba(92,107,75,.16);border-radius:4px;box-shadow:0 14px 30px -22px rgba(50,45,25,.5)}
.caps{font-family:Jost,'Futura',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.2em}
a{text-decoration:none;color:inherit}
a:focus-visible,button:focus-visible{outline:1.5px solid var(--sage);outline-offset:3px;border-radius:2px}
.tile{position:relative;display:block;aspect-ratio:388/372;overflow:hidden;border-radius:3px;color:#f6efe0;background:#3d4632;isolation:isolate;box-shadow:0 18px 34px -24px rgba(30,35,20,.7)}
.tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transition:transform 1.2s cubic-bezier(.2,.7,.1,1)}
.tile::before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(20,24,14,0) 30%,rgba(20,24,14,.28) 55%,rgba(20,24,14,.62) 100%)}
.tile:hover img{transform:scale(1.05)}
.cap{position:absolute;left:30px;right:24px;bottom:26px}
.cap h3{margin:0 0 20px;font-weight:400;font-size:37px;line-height:1.08;letter-spacing:-.005em;text-shadow:0 1px 14px rgba(0,0,0,.25)}
.lk{display:inline-flex;align-items:center;gap:12px;font-size:13.5px;font-weight:500;letter-spacing:.2em}
.lk{background:linear-gradient(currentColor,currentColor) 0 100%/calc(100% - 30px) 1px no-repeat;padding-bottom:5px;transition:background-size .4s cubic-bezier(.2,.7,.1,1)}
.lk svg{margin-bottom:0;transition:transform .35s cubic-bezier(.2,.7,.1,1)}
.tile:hover .lk svg{transform:translateX(5px)}
.tile:hover .lk{background-size:100% 1px}
.tile:focus-visible{outline:2px solid var(--sage);outline-offset:3px}`,
  items:{
    X179:{ w:760,
      html:`<header class="nav cream">
  <nav aria-label="Primary"><a href="#" aria-current="page">Shop</a><a href="#">Journal</a><a href="#">Workshops</a><a href="#">About</a></nav>
  <div class="ic">
    <button type="button" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.8"/><path d="m15.6 15.6 5.4 5.4"/></svg></button>
    <button type="button" aria-label="Account"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.2"/><path d="M4.5 21v-1.2c0-3 2.6-5.3 5.6-5.3h3.8c3 0 5.6 2.3 5.6 5.3V21z"/></svg></button>
    <button type="button" class="bag" aria-label="Basket, 2 items"><svg viewBox="0 0 24 24"><path d="M4.5 8h15l-1.2 13H5.7z"/><path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10"/></svg><span class="n">2</span></button>
  </div>
</header>`,
      css:`.nav{display:flex;align-items:center;justify-content:space-between;padding:16px 26px 16px 34px}
nav{display:flex;gap:50px}
nav a{position:relative;font-size:21px;letter-spacing:.01em;color:var(--ink2);padding:4px 0;transition:color .25s}
nav a::after{content:'';position:absolute;left:50%;bottom:-2px;width:5px;height:5px;border-radius:50%;background:var(--sage);transform:translateX(-50%) scale(0);transition:transform .3s cubic-bezier(.3,1.5,.5,1)}
nav a:hover{color:var(--sage2)}
nav a[aria-current]{color:var(--ink)}nav a[aria-current]::after{transform:translateX(-50%) scale(1)}
.ic{display:flex;gap:14px}
.ic button{position:relative;width:42px;height:42px;display:grid;place-items:center;border-radius:50%;color:var(--ink);transition:background .2s,color .2s}
.ic button:hover{background:rgba(92,107,75,.1);color:var(--sage2)}
.ic svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round}
.n{position:absolute;top:5px;right:3px;min-width:16px;height:16px;border-radius:8px;background:var(--sage);color:#f4eee2;font:500 10px/16px Jost,sans-serif;text-align:center}`,
      init(root){const l=root.querySelectorAll('nav a');l.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();l.forEach(x=>x.removeAttribute('aria-current'));a.setAttribute('aria-current','page');}));}
    },
    X181:{ w:250,
      html:`<a href="#" class="btn caps">Shop plants<svg width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 6h18M13 1l5 5-5 5"/></svg></a>`,
      css:`.btn{display:inline-flex;align-items:center;gap:18px;padding:20px 30px 19px 32px;background:var(--sage);color:#f3ecdc;font-size:15px;font-weight:500;letter-spacing:.2em;border-radius:2px;box-shadow:0 1px 0 rgba(255,255,255,.12) inset,0 10px 22px -14px rgba(40,55,25,.7);transition:background .25s,transform .2s,box-shadow .25s}
.btn svg{transition:transform .35s cubic-bezier(.2,.7,.1,1)}
.btn:hover{background:var(--sage2);box-shadow:0 1px 0 rgba(255,255,255,.12) inset,0 14px 26px -14px rgba(40,55,25,.8)}
.btn:hover svg{transform:translateX(5px)}
.btn:active{transform:translateY(1px)}
.btn:focus-visible{outline:2px solid var(--sage);outline-offset:4px}`
    },
    X183:{ w:330, html:`<a href="#" class="tile"><img src="{{img}}/D23-seasonal.webp" alt=""><div class="cap"><h3>Seasonal<br>Favourites</h3><span class="lk caps">Shop now<svg width="18" height="11" viewBox="0 0 18 11" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 5.5h16M11.5 1l4.5 4.5-4.5 4.5"/></svg></span></div></a>` },
    X184:{ w:330, html:`<a href="#" class="tile"><img src="{{img}}/D23-pottery.webp" alt=""><div class="cap"><h3>Beautiful<br>Pottery</h3><span class="lk caps">Explore<svg width="18" height="11" viewBox="0 0 18 11" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 5.5h16M11.5 1l4.5 4.5-4.5 4.5"/></svg></span></div></a>` },
    X185:{ w:330, html:`<a href="#" class="tile"><img src="{{img}}/D23-grow.webp" alt=""><div class="cap"><h3>Grow<br>Your Own</h3><span class="lk caps">Learn more<svg width="18" height="11" viewBox="0 0 18 11" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 5.5h16M11.5 1l4.5 4.5-4.5 4.5"/></svg></span></div></a>` },
    X189:{ w:500,
      html:`<nav class="crumbs cream caps" aria-label="Collections"><a href="#" aria-current="true">Plants</a><i>/</i><a href="#">Home</a><i>/</i><a href="#">Wellbeing</a><i>/</i><a href="#">Community</a></nav>`,
      css:`.crumbs{display:inline-flex;align-items:center;gap:14px;padding:16px 26px;font-size:13px;font-weight:400;letter-spacing:.24em;color:var(--ink2)}
.crumbs i{font-style:normal;color:rgba(38,37,31,.4);letter-spacing:0}
.crumbs a{position:relative;padding:3px 0;transition:color .2s}
.crumbs a::after{content:'';position:absolute;left:0;right:.24em;bottom:-1px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .35s cubic-bezier(.2,.7,.1,1)}
.crumbs a:hover{color:var(--sage2)}.crumbs a:hover::after,.crumbs a[aria-current]::after{transform:scaleX(1)}
.crumbs a[aria-current]{color:var(--ink)}`,
      init(root){const l=root.querySelectorAll('a');l.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();l.forEach(x=>x.removeAttribute('aria-current'));a.setAttribute('aria-current','true');}));}
    }
  }
});
