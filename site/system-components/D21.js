SysComponents.add({
  system:'D21',
  fonts:['Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500','Jost:wght@500;600'],
  css:`.sc-D21{--paper:#f6f1e9;--ink:#1c1a17;--ink2:#4a453d;--mute:#8d867a;--rule:#2a2621;--hair:rgba(28,26,23,.14);
  font-family:Newsreader,'Iowan Old Style',Georgia,serif;color:var(--ink);font-optical-sizing:auto}
.paper{background:var(--paper);border:1px solid rgba(28,26,23,.07);border-radius:3px;box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 10px 30px -18px rgba(40,30,15,.35)}
.caps{font-family:Jost,'Futura',system-ui,sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.16em}
a{text-decoration:none}
a:focus-visible,button:focus-visible{outline:1.5px solid var(--ink);outline-offset:4px;border-radius:1px}
.ul{position:relative;display:inline-block;padding-bottom:12px;color:var(--ink);font-size:13px}
.ul::after{content:'';position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--rule);transform-origin:left;transition:transform .5s cubic-bezier(.2,.7,.1,1)}
.ul .ar{display:inline-block;width:0;opacity:0;overflow:hidden;vertical-align:-1px;transition:width .4s ease,opacity .3s ease,margin .4s ease}
.ul:hover .ar,.ul:focus-visible .ar{width:16px;opacity:1;margin-left:8px}
.ul:hover::after{animation:sweep .7s cubic-bezier(.2,.7,.1,1)}
@keyframes sweep{0%{transform:scaleX(1);transform-origin:right}45%{transform:scaleX(0);transform-origin:right}46%{transform-origin:left}100%{transform:scaleX(1);transform-origin:left}}`,
  items:{
    X169:{ w:760,
      html:`<nav class="nav paper" aria-label="Primary">
  <ul class="links">
    <li><a href="#" aria-current="page">Architecture</a></li>
    <li><a href="#">Interiors</a></li>
    <li><a href="#">Journal</a></li>
    <li><a href="#">About</a></li>
  </ul>
  <button class="search" type="button"><span>Search</span>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>
  </button>
</nav>`,
      css:`.nav{display:flex;align-items:center;justify-content:space-between;padding:20px 30px 20px 34px}
.links{display:flex;gap:46px;list-style:none;margin:0;padding:0}
.links a{position:relative;font-size:19px;font-weight:400;letter-spacing:.01em;color:var(--ink2);transition:color .25s}
.links a::after{content:'';position:absolute;left:0;right:0;bottom:-6px;height:1px;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.2,.7,.1,1)}
.links a:hover,.links a[aria-current]{color:var(--ink)}
.links a:hover::after,.links a[aria-current]::after{transform:scaleX(1)}
.search{display:flex;align-items:center;gap:14px;font-size:18px;letter-spacing:.03em;color:var(--ink2);transition:color .2s}
.search:hover{color:var(--ink)}.search svg{transition:transform .3s}.search:hover svg{transform:rotate(-8deg) scale(1.06)}`,
      init(root){root.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();root.querySelectorAll('.links a').forEach(x=>x.removeAttribute('aria-current'));a.setAttribute('aria-current','page');}));}
    },
    X172:{ w:210,
      html:`<nav class="side paper" aria-label="Categories">
  <a href="#" aria-current="true">Architecture</a>
  <a href="#">Interiors</a>
  <a href="#">Objects</a>
  <a href="#">Journal</a>
</nav>`,
      css:`.side{display:flex;flex-direction:column;gap:14px;padding:26px 28px 28px}
.side a{position:relative;font-size:19px;line-height:1.25;color:var(--ink2);transition:color .25s,transform .35s cubic-bezier(.2,.7,.1,1)}
.side a::before{content:'';position:absolute;left:-16px;top:50%;width:0;height:1px;background:var(--ink);transition:width .35s cubic-bezier(.2,.7,.1,1)}
.side a:hover{color:var(--ink);transform:translateX(6px)}
.side a[aria-current]{color:var(--ink);transform:translateX(6px)}
.side a[aria-current]::before{width:10px}`,
      init(root){const l=root.querySelectorAll('.side a');l.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();l.forEach(x=>x.removeAttribute('aria-current'));a.setAttribute('aria-current','true');}));}
    },
    X173:{ w:230,
      html:`<div class="wrap paper"><a href="#" class="ul caps">View our work<span class="ar"><svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M0 5h15M11 1l4 4-4 4"/></svg></span></a></div>`,
      css:`.wrap{display:inline-flex;padding:26px 30px 24px}.wrap .ul{font-size:14px;letter-spacing:.17em;padding-bottom:13px}`
    },
    X176:{ w:330,
      html:`<article class="cap paper">
  <h3>A life<br>less rushed</h3>
  <span class="dash" aria-hidden="true"></span>
  <p>We design enduring spaces that restore, inspire and belong to the landscape.</p>
  <a href="#" class="ul caps">Our philosophy<span class="ar"><svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M0 5h15M11 1l4 4-4 4"/></svg></span></a>
</article>`,
      css:`.cap{padding:34px 34px 36px}
h3{margin:0;font-weight:400;font-size:26px;line-height:1.48;text-transform:uppercase;letter-spacing:.2em;font-variation-settings:'opsz' 36}
.dash{display:block;width:62px;height:1.5px;background:var(--rule);margin:26px 0 28px}
p{margin:0 0 30px;font-size:20px;line-height:1.42;color:var(--ink2);font-weight:400;max-width:15.5em}
.cap .ul{font-size:13.5px;letter-spacing:.15em}`
    },
    X177:{ w:170,
      html:`<button class="idx paper" type="button" aria-label="Section 1 of 4. Next section">
  <span class="line" aria-hidden="true"><i></i></span>
  <span class="num"><b>01</b><em>/</em><span class="tot">04</span></span>
</button>`,
      css:`.idx{display:flex;align-items:flex-end;gap:26px;padding:26px 34px 24px 32px;text-align:left}
.line{position:relative;width:1.5px;height:96px;background:rgba(28,26,23,.18);overflow:hidden}
.line i{position:absolute;left:0;top:0;width:100%;height:25%;background:var(--rule);transition:height .6s cubic-bezier(.2,.7,.1,1)}
.num{display:flex;gap:8px;align-items:baseline;font-size:17px;letter-spacing:.14em;color:var(--ink2);padding-bottom:2px;font-variant-numeric:lining-nums tabular-nums}
.num b{font-weight:400;color:var(--ink)}.num em{font-style:normal;color:var(--mute)}
.idx:hover .num b{color:#000}`,
      init(root){const b=root.querySelector('.idx'),n=root.querySelector('.num b'),i=root.querySelector('.line i');let k=1;
        b.addEventListener('click',()=>{k=k%4+1;n.textContent='0'+k;i.style.height=k*25+'%';b.setAttribute('aria-label',`Section ${k} of 4. Next section`);});}
    }
  }
});
