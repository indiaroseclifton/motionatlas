SysComponents.add({
  system:'D22',
  fonts:['Barlow+Condensed:wght@600;700','Archivo:wght@400;500;600'],
  css:`.sc-D22{--paper:#f8f7f3;--ink:#111;--ink2:#2b2b2b;--red:#e62117;--rule:#111;--hair:rgba(17,17,17,.82);
  font-family:Archivo,'Helvetica Neue',Arial,sans-serif;color:var(--ink)}
.paper{background:var(--paper);box-shadow:0 0 0 1px rgba(17,17,17,.06),0 12px 28px -20px rgba(0,0,0,.45)}
.cond{font-family:'Barlow Condensed','Arial Narrow',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.005em}
a{text-decoration:none;color:inherit}
a:focus-visible,button:focus-visible{outline:2px solid var(--red);outline-offset:3px}
.cta{display:inline-flex;align-items:center;gap:14px;font-family:'Barlow Condensed','Arial Narrow',sans-serif;font-weight:600;text-transform:uppercase;font-size:21px;letter-spacing:.03em;line-height:1}
.cta .t{position:relative;padding-bottom:7px}
.cta .t::after{content:'';position:absolute;left:0;right:0;bottom:0;height:1.5px;background:var(--ink);transition:background .2s}
.cta .t::before{content:'';position:absolute;left:0;right:0;bottom:0;height:1.5px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.2,.7,.1,1);z-index:1}
.cta svg{margin-top:-7px;transition:transform .35s cubic-bezier(.2,.7,.1,1)}
.cta:hover .t{color:var(--red)}.cta:hover .t::before{transform:scaleX(1)}.cta:hover svg{transform:translateX(6px);color:var(--red)}
.card{display:grid;grid-template-columns:1fr 44%;grid-template-rows:auto 1fr auto;column-gap:16px;padding:20px 20px 0 22px;border-top:2px solid var(--rule);border-bottom:3px solid var(--rule);border-right:1.5px solid var(--hair);width:100%;height:376px}
.card .num{grid-column:1;font-size:46px;line-height:.9;color:var(--red);margin:2px 0 26px}
.card h3{grid-column:1;margin:0 0 22px;font-size:31px;line-height:1.08;white-space:nowrap}
.card .txt{grid-column:1;grid-row:1/3}
.card .txt p{margin:0;max-width:13em;font-size:14.5px;line-height:1.5;color:var(--ink2)}
.card figure{grid-column:2;grid-row:1/3;margin:0;overflow:hidden;background:#cfcfcf}
.card img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.04);transition:transform 1.1s cubic-bezier(.2,.7,.1,1)}
.card:hover img{transform:scale(1.045)}
.card .cta{grid-column:1/3;grid-row:3;justify-self:start;margin:24px 0 20px}`,
  items:{
    X002:{ w:560,
      html:`<header class="top paper">
  <nav aria-label="Primary"><a href="#" aria-current="page">Exhibitions</a><a href="#">Journal</a><a href="#">Education</a><a href="#">Shop</a></nav>
  <button class="burger" type="button" aria-label="Open menu" aria-expanded="false"><i></i><i></i><i></i></button>
</header>`,
      css:`.top{display:flex;align-items:flex-start;justify-content:space-between;height:74px;padding:22px 2px 0 20px;border-left:1.5px solid var(--hair);border-bottom:2px solid var(--rule)}
nav{display:flex;gap:40px}
nav a{position:relative;font-size:16px;font-weight:400;letter-spacing:.005em;padding-bottom:6px;transition:color .2s}
nav a::after{content:'';position:absolute;left:0;bottom:0;height:2px;width:100%;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .35s cubic-bezier(.2,.7,.1,1)}
nav a:hover{color:var(--red)}
nav a[aria-current]::after{transform:scaleX(1)}
.burger{position:relative;width:38px;height:22px;margin:-1px 14px 0 0}
.burger i{position:absolute;left:0;right:0;height:1.5px;background:var(--ink);transition:transform .35s cubic-bezier(.2,.7,.1,1),opacity .2s,top .35s}
.burger i:nth-child(1){top:3px}.burger i:nth-child(2){top:10px}.burger i:nth-child(3){top:17px}
.burger:hover i{background:var(--red)}
.burger[aria-expanded=true] i:nth-child(1){top:10px;transform:rotate(45deg)}
.burger[aria-expanded=true] i:nth-child(2){opacity:0}
.burger[aria-expanded=true] i:nth-child(3){top:10px;transform:rotate(-45deg)}`,
      init(root){const b=root.querySelector('.burger');b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu');});
        const l=root.querySelectorAll('nav a');l.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();l.forEach(x=>x.removeAttribute('aria-current'));a.setAttribute('aria-current','page');}));}
    },
    X003:{ w:250,
      html:`<aside class="side paper">
  <nav aria-label="Topics"><a href="#">Contemporary</a><a href="#">Architecture</a><a href="#">Culture</a><a href="#">Ideas</a></nav>
  <hr>
  <p>A global platform for a more human built environment.</p>
  <a href="#" class="go" aria-label="About the platform"><svg width="36" height="18" viewBox="0 0 36 18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M1 9h33M26 1.5 34 9l-8 7.5"/></svg></a>
</aside>`,
      css:`.side{display:flex;flex-direction:column;padding:34px 26px 40px 22px;border-right:1.5px solid var(--hair);min-height:560px}
.side nav{display:flex;flex-direction:column;gap:7px}
.side nav a{font-size:19px;font-weight:500;text-transform:uppercase;letter-spacing:.01em;line-height:1.2;width:max-content;transition:color .2s,transform .3s cubic-bezier(.2,.7,.1,1)}
.side nav a:hover{color:var(--red);transform:translateX(4px)}
hr{border:0;height:1.5px;background:var(--rule);margin:72px 0 0;width:100%}
p{margin:118px 0 0;font-size:16.5px;line-height:1.62;text-transform:uppercase;letter-spacing:.03em;font-weight:400}
.go{margin-top:44px;width:max-content;transition:transform .35s cubic-bezier(.2,.7,.1,1),color .2s}
.go:hover{transform:translateX(8px);color:var(--red)}`
    },
    X007:{ w:200,
      html:`<div class="pad paper"><a href="#" class="cta"><span class="t">Explore</span><svg width="30" height="16" viewBox="0 0 30 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M0 8h27M20 1l7 7-7 7"/></svg></a></div>`,
      css:`.pad{display:inline-flex;padding:24px 30px 22px}.pad .cta{font-size:25px}`
    },
    X008:{ w:340,
      html:`<article class="card paper">
  <div class="txt"><div class="num cond">02</div><h3 class="cond">The<br>next city</h3><p>How architecture can create healthier, more equitable communities.</p></div>
  <figure><img src="{{img}}/D22-city.webp" alt="Modern apartment block with recessed balconies"></figure>
  <a href="#" class="cta"><span class="t">Read the essay</span><svg width="26" height="16" viewBox="0 0 26 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M0 8h23M16 1l7 7-7 7"/></svg></a>
</article>`
    },
    X009:{ w:340,
      html:`<article class="card paper">
  <div class="txt"><div class="num cond">03</div><h3 class="cond">Material<br>intelligence</h3><p>Innovation, craft and a lower impact future.</p></div>
  <figure><img src="{{img}}/D22-material.webp" alt="Concrete and timber facade detail"></figure>
  <a href="#" class="cta"><span class="t">View projects</span><svg width="26" height="16" viewBox="0 0 26 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M0 8h23M16 1l7 7-7 7"/></svg></a>
</article>`
    },
    X010:{ w:340,
      html:`<article class="card paper">
  <div class="txt"><div class="num cond">04</div><h3 class="cond">A more<br>human scale</h3><p>Conversations with the thinkers and makers shaping what’s next.</p></div>
  <figure><img src="{{img}}/D22-scale.webp" alt="Curved concrete canopy against the sky"></figure>
  <a href="#" class="cta"><span class="t">Watch the series</span><svg width="26" height="16" viewBox="0 0 26 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M0 8h23M16 1l7 7-7 7"/></svg></a>
</article>`
    },
    X014:{ w:720,
      html:`<div class="rules paper" role="separator" aria-label="Section divider"><span></span><span></span><span></span></div>`,
      css:`.rules{display:grid;grid-template-columns:1fr 1fr 1fr;height:58px;padding:0 22px;position:relative}
.rules span{border-bottom:3px solid var(--rule);position:relative}
.rules span+span::before{content:'';position:absolute;left:0;top:14px;bottom:-3px;width:1.5px;background:var(--hair)}`
    }
  }
});
