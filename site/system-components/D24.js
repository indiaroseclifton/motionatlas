SysComponents.add({
  system:'D24',
  fonts:['Source+Serif+4:opsz,wght@8..60,600','DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600'],
  css:`.sc-D24{--bg:#ebe9e5;--hi:#fbfaf8;--ink:#1c1b19;--ink2:#3c3a36;--mute:#8b877f;--track:#c9c5be;--lo:rgba(150,142,130,.42);
  font-family:'DM Sans',system-ui,sans-serif;color:var(--ink)}
.panel{background:linear-gradient(160deg,#f2f1ee,#e8e6e2);border:1px solid rgba(255,255,255,.75);border-radius:26px;box-shadow:inset 0 1px 0 #fff,0 1px 2px rgba(60,50,40,.06),0 22px 44px -26px rgba(60,50,40,.45)}
.raised{background:linear-gradient(150deg,#f8f7f5,#ecebe7);box-shadow:-4px -4px 10px rgba(255,255,255,.85),5px 6px 14px var(--lo),inset 0 1px 0 #fff}
.lbl{font-size:12.5px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--ink2)}
svg.i{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
button,a{transition:color .2s,background .25s,box-shadow .25s,transform .2s}
a{text-decoration:none}
button:focus-visible,a:focus-visible,input:focus-visible+*,input:focus-visible{outline:2px solid #8a7a62;outline-offset:3px}
.ib{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;color:var(--ink)}
.ib:hover{background:rgba(255,255,255,.6)}
.rng{-webkit-appearance:none;appearance:none;background:transparent;width:100%;height:32px;margin:0;cursor:pointer;--p:50%}
.rng::-webkit-slider-runnable-track{height:3px;border-radius:2px;background:linear-gradient(90deg,var(--ink) var(--p),#b9b5ae var(--p))}
.rng::-moz-range-track{height:3px;border-radius:2px;background:linear-gradient(90deg,var(--ink) var(--p),#b9b5ae var(--p))}
.rng::-webkit-slider-thumb{-webkit-appearance:none;width:30px;height:30px;margin-top:-13.5px;border-radius:50%;background:linear-gradient(150deg,#fff,#eceae6);border:1px solid rgba(255,255,255,.9);box-shadow:3px 4px 9px rgba(140,132,120,.5),-2px -2px 5px rgba(255,255,255,.9);transition:transform .2s}
.rng::-moz-range-thumb{width:28px;height:28px;border-radius:50%;background:linear-gradient(150deg,#fff,#eceae6);border:1px solid #fff;box-shadow:3px 4px 9px rgba(140,132,120,.5)}
.rng:active::-webkit-slider-thumb{transform:scale(1.08)}
.rng:focus-visible{outline:none}.rng:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 3px rgba(138,122,98,.45),3px 4px 9px rgba(140,132,120,.5)}
.wave{position:relative;display:flex;align-items:center;gap:2px;height:64px;cursor:pointer;-webkit-mask:linear-gradient(90deg,#000 70%,rgba(0,0,0,.25));mask:linear-gradient(90deg,#000 70%,rgba(0,0,0,.25))}
.wave i{flex:1;min-width:1px;border-radius:1px;background:#bdb9b2;transition:background .2s}
.wave i.on{background:var(--ink)}
.wave i.head{background:var(--ink);transform:scaleY(1.5)}
.times{display:flex;justify-content:space-between;margin-top:10px;font-size:12.5px;color:var(--mute);font-variant-numeric:tabular-nums}
.tr{display:flex;align-items:center;justify-content:space-between;gap:10px}
.tr .ib{width:46px;height:46px}
.tr .ib.on{color:#8a6d45}
.play{width:88px;height:88px;border-radius:50%;display:grid;place-items:center;color:var(--ink)}
.play:hover{transform:translateY(-1px)}.play:active{transform:scale(.97);box-shadow:inset 3px 3px 8px var(--lo),inset -3px -3px 8px #fff}
.play svg{width:34px;height:34px;fill:currentColor;stroke:none}
.play .pz{display:none}.playing .play .pl{display:none}.playing .play .pz{display:block}
.fill{fill:currentColor;stroke:none}`,
  items:{
    X016:{ w:520,
      html:`<nav class="tabs panel" aria-label="Primary"><a href="#" aria-current="page">Home</a><a href="#">Discover</a><a href="#">Library</a><a href="#">Radio</a></nav>`,
      css:`.tabs{display:inline-flex;gap:6px;padding:8px;border-radius:999px}
.tabs a{padding:15px 26px;border-radius:999px;font-size:18px;font-weight:400;color:var(--ink2)}
.tabs a:hover{color:var(--ink);background:rgba(255,255,255,.5)}
.tabs a[aria-current]{font-weight:600;color:var(--ink);background:linear-gradient(150deg,#fbfaf8,#efeeea);box-shadow:-3px -3px 8px rgba(255,255,255,.9),4px 5px 12px var(--lo),inset 0 1px 0 #fff}`,
      init(root){const l=root.querySelectorAll('a');l.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();l.forEach(x=>x.removeAttribute('aria-current'));a.setAttribute('aria-current','page');}));}
    },
    X017:{ w:420,
      html:`<label class="search panel"><svg class="i" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/></svg><input type="search" placeholder="Search artists, albums or moods…" aria-label="Search artists, albums or moods"></label>`,
      css:`.search{display:flex;align-items:center;gap:14px;height:62px;padding:0 24px;border-radius:999px;color:var(--ink2);border:1px solid rgba(255,255,255,.8);cursor:text}
.search:focus-within{box-shadow:inset 3px 3px 8px rgba(150,142,130,.35),inset -3px -3px 8px #fff,0 0 0 2px rgba(138,122,98,.35)}
input{flex:1;min-width:0;border:0;background:none;outline:none;font-size:16px;color:var(--ink)}
input::placeholder{color:#8e8a83}
input::-webkit-search-cancel-button{filter:grayscale(1)}`
    },
    X019:{ w:280,
      html:`<aside class="pl panel"><div class="hd"><span class="lbl">Playlists</span><button class="ib" type="button" aria-label="New playlist"><svg class="i" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button></div>
<ul>
<li><a href="#" aria-current="true"><img src="{{img}}/D24-q1.webp" alt="">Morning Light</a></li>
<li><a href="#"><img src="{{img}}/D24-q4.webp" alt="">Deep Focus</a></li>
<li><a href="#"><img src="{{img}}/D24-q2.webp" alt="">Indie Favourites</a></li>
<li><a href="#"><img src="{{img}}/D24-q3.webp" alt="">Acoustic Cafe</a></li>
<li><a href="#"><img src="{{img}}/D24-album.webp" alt="">Running</a></li>
<li><a href="#"><img src="{{img}}/D24-forest.webp" alt="">Chill Evenings</a></li>
</ul></aside>`,
      css:`.pl{padding:22px 16px 18px}
.hd{display:flex;align-items:center;justify-content:space-between;padding:0 4px 10px 14px}
ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
li a{display:flex;align-items:center;gap:16px;padding:9px 12px;border-radius:14px;font-size:17px;color:var(--ink2)}
li a:hover{background:rgba(255,255,255,.55);color:var(--ink)}
li a[aria-current]{color:var(--ink);font-weight:500;background:linear-gradient(150deg,#fbfaf8,#efeeea);box-shadow:-3px -3px 8px rgba(255,255,255,.9),4px 5px 12px var(--lo)}
img{width:36px;height:36px;border-radius:7px;object-fit:cover;filter:saturate(.45) contrast(1.05);box-shadow:0 2px 5px rgba(0,0,0,.18)}`,
      init(root){const l=root.querySelectorAll('li a');l.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();l.forEach(x=>x.removeAttribute('aria-current'));a.setAttribute('aria-current','true');}));}
    },
    X020:{ w:860,
      html:`<section class="pp panel" aria-label="Now playing">
<div class="info">
  <div class="lbl np">Now playing</div>
  <h2>Golden Hour</h2>
  <div class="by"><span>Novo Amour</span><button class="ib heart" type="button" aria-label="Like" aria-pressed="false"><svg class="i" viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg></button></div>
  <div class="wave" role="slider" aria-label="Seek" tabindex="0"></div>
  <div class="times"><span class="cur">2:14</span><span>5:28</span></div>
  <div class="tr">
    <button class="ib" type="button" aria-label="Shuffle" aria-pressed="false"><svg class="i" viewBox="0 0 24 24"><path d="M3 7h3c4.5 0 6.5 10 11 10h3M17 14l3 3-3 3M3 17h3c1.5 0 2.7-1.2 3.7-2.8M13.3 9.6C14.3 8 15.5 7 17 7h3M17 4l3 3-3 3"/></svg></button>
    <button class="ib" type="button" aria-label="Previous"><svg class="i" viewBox="0 0 24 24"><path class="fill" d="M19 5v14L8.5 12z"/><path d="M6 5v14" stroke-width="2.4"/></svg></button>
    <button class="play raised" type="button" aria-label="Play"><svg class="pl" viewBox="0 0 24 24"><path d="M8 5.2v13.6a.6.6 0 0 0 .9.5L19.6 12.5a.6.6 0 0 0 0-1L8.9 4.7a.6.6 0 0 0-.9.5z"/></svg><svg class="pz" viewBox="0 0 24 24"><rect x="6.5" y="5" width="3.6" height="14" rx="1"/><rect x="13.9" y="5" width="3.6" height="14" rx="1"/></svg></button>
    <button class="ib" type="button" aria-label="Next"><svg class="i" viewBox="0 0 24 24"><path class="fill" d="M5 5v14l10.5-7z"/><path d="M18 5v14" stroke-width="2.4"/></svg></button>
    <button class="ib" type="button" aria-label="Repeat" aria-pressed="false"><svg class="i" viewBox="0 0 24 24"><path d="M4 11.5V10a3.5 3.5 0 0 1 3.5-3.5H20M17 3.5l3 3-3 3M20 12.5V14a3.5 3.5 0 0 1-3.5 3.5H4M7 20.5l-3-3 3-3"/></svg></button>
  </div>
</div>
<div class="disc"><div class="rim"><img src="{{img}}/D24-album.webp" alt="Golden Hour cover: misty mountains over the sea at dusk"></div><span class="knob"></span></div>
<button class="ib more" type="button" aria-label="More options"><svg class="i" viewBox="0 0 24 24"><circle class="fill" cx="5" cy="12" r="1.6"/><circle class="fill" cx="12" cy="12" r="1.6"/><circle class="fill" cx="19" cy="12" r="1.6"/></svg></button>
</section>`,
      css:`.pp{position:relative;display:grid;grid-template-columns:1fr 400px;align-items:center;gap:28px;padding:44px 40px 40px 56px;border-radius:30px}
.np{margin-bottom:22px;font-weight:400;color:var(--ink2)}
h2{margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:56px;line-height:1.05;letter-spacing:-.015em}
.by{display:flex;align-items:center;justify-content:space-between;max-width:330px;margin:10px 0 34px;font-size:23px;font-weight:300;color:var(--ink2)}
.heart.on{color:#b0563f}.heart.on path{fill:currentColor}
.heart:active{transform:scale(.88)}
.info .wave{max-width:340px}.info .times{max-width:340px}
.info .tr{max-width:340px;margin-top:34px}
.disc{position:relative;width:400px;height:400px;border-radius:50%;padding:14px;background:linear-gradient(150deg,#f7f6f3,#e3e1dc);box-shadow:-8px -8px 20px rgba(255,255,255,.85),12px 16px 32px rgba(140,132,120,.45),inset 0 1px 0 #fff}
.rim{width:100%;height:100%;border-radius:50%;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}
.rim img{width:100%;height:100%;object-fit:cover;transform:scale(1.08)}
.knob{position:absolute;left:50%;top:50%;width:52px;height:52px;margin:-26px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#e9e7e3);box-shadow:4px 6px 12px rgba(120,112,100,.45),-2px -2px 5px rgba(255,255,255,.8);transform:rotate(var(--a,45deg)) translateY(-186px);transition:transform .9s linear}
.more{position:absolute;top:22px;right:26px}`,
      init(root){const w=root.querySelector('.wave'),cur=root.querySelector('.cur'),pp=root.querySelector('.pp'),kn=root.querySelector('.knob'),pb=root.querySelector('.play'),D=328;let t=134,tm=null;
        let s=7;const r=()=>(s=(s*9301+49297)%233280)/233280,N=72;for(let k=0;k<N;k++){const e=Math.sin(k/N*Math.PI)*.55+.35,b=document.createElement('i');b.style.height=Math.max(10,Math.round((.25+r()*.75)*e*100))+'%';w.append(b);}
        const bars=[...w.children],f=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
        const draw=()=>{const h=Math.floor(t/D*N);bars.forEach((b,k)=>b.className=k<h?'on':k===h?'head':'');cur.textContent=f(t);kn.style.setProperty('--a',(t/D*330-90)+'deg');w.setAttribute('aria-valuenow',Math.round(t));w.setAttribute('aria-valuetext',f(t)+' of 5:28');};
        w.setAttribute('aria-valuemin',0);w.setAttribute('aria-valuemax',D);draw();
        w.addEventListener('click',e=>{const R=w.getBoundingClientRect();t=Math.max(0,Math.min(D-1,(e.clientX-R.left)/R.width*D));draw();});
        w.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){t=Math.max(0,Math.min(D-1,t+(e.key==='ArrowRight'?5:-5)));draw();e.preventDefault();}});
        pb.addEventListener('click',()=>{const on=pp.classList.toggle('playing');pb.setAttribute('aria-label',on?'Pause':'Play');clearInterval(tm);if(on)tm=setInterval(()=>{if(!root.isConnected)return clearInterval(tm);t=(t+1)%D;draw();},1000);});
        root.querySelectorAll('[aria-pressed]').forEach(b=>b.addEventListener('click',()=>{const v=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',v);b.classList.toggle('on',v);}));}
    },
    X022:{ w:440,
      html:`<div class="wv panel"><div class="wave" role="slider" aria-label="Seek" tabindex="0"></div><div class="times"><span class="cur">2:14</span><span>5:28</span></div></div>`,
      css:`.wv{padding:26px 30px 20px}`,
      init(root){const w=root.querySelector('.wave'),cur=root.querySelector('.cur'),D=328;let t=134;let s=7;const r=()=>(s=(s*9301+49297)%233280)/233280,N=72;
        for(let k=0;k<N;k++){const e=Math.sin(k/N*Math.PI)*.55+.35,b=document.createElement('i');b.style.height=Math.max(10,Math.round((.25+r()*.75)*e*100))+'%';w.append(b);}
        const bars=[...w.children],f=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
        const draw=()=>{const h=Math.floor(t/D*N);bars.forEach((b,k)=>b.className=k<h?'on':k===h?'head':'');cur.textContent=f(t);w.setAttribute('aria-valuetext',f(t)+' of 5:28');};draw();
        w.addEventListener('click',e=>{const R=w.getBoundingClientRect();t=Math.max(0,Math.min(D-1,(e.clientX-R.left)/R.width*D));draw();});
        w.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){t=Math.max(0,Math.min(D-1,t+(e.key==='ArrowRight'?5:-5)));draw();e.preventDefault();}});}
    },
    X023:{ w:440,
      html:`<div class="tp panel"><div class="tr">
    <button class="ib" type="button" aria-label="Shuffle" aria-pressed="false"><svg class="i" viewBox="0 0 24 24"><path d="M3 7h3c4.5 0 6.5 10 11 10h3M17 14l3 3-3 3M3 17h3c1.5 0 2.7-1.2 3.7-2.8M13.3 9.6C14.3 8 15.5 7 17 7h3M17 4l3 3-3 3"/></svg></button>
    <button class="ib" type="button" aria-label="Previous"><svg class="i" viewBox="0 0 24 24"><path class="fill" d="M19 5v14L8.5 12z"/><path d="M6 5v14" stroke-width="2.4"/></svg></button>
    <button class="play raised" type="button" aria-label="Play"><svg class="pl" viewBox="0 0 24 24"><path d="M8 5.2v13.6a.6.6 0 0 0 .9.5L19.6 12.5a.6.6 0 0 0 0-1L8.9 4.7a.6.6 0 0 0-.9.5z"/></svg><svg class="pz" viewBox="0 0 24 24"><rect x="6.5" y="5" width="3.6" height="14" rx="1"/><rect x="13.9" y="5" width="3.6" height="14" rx="1"/></svg></button>
    <button class="ib" type="button" aria-label="Next"><svg class="i" viewBox="0 0 24 24"><path class="fill" d="M5 5v14l10.5-7z"/><path d="M18 5v14" stroke-width="2.4"/></svg></button>
    <button class="ib" type="button" aria-label="Repeat" aria-pressed="false"><svg class="i" viewBox="0 0 24 24"><path d="M4 11.5V10a3.5 3.5 0 0 1 3.5-3.5H20M17 3.5l3 3-3 3M20 12.5V14a3.5 3.5 0 0 1-3.5 3.5H4M7 20.5l-3-3 3-3"/></svg></button>
  </div></div>`,
      css:`.tp{padding:24px 30px}`,
      init(root){const p=root.querySelector('.tp'),b=root.querySelector('.play');b.addEventListener('click',()=>{const on=p.classList.toggle('playing');b.setAttribute('aria-label',on?'Pause':'Play');});
        root.querySelectorAll('[aria-pressed]').forEach(x=>x.addEventListener('click',()=>{const v=x.getAttribute('aria-pressed')!=='true';x.setAttribute('aria-pressed',v);x.classList.toggle('on',v);}));}
    },
    X025:{ w:320,
      html:`<div class="row panel"><span class="lbl" id="eqL">Equaliser</span><button class="sw" type="button" role="switch" aria-checked="true" aria-labelledby="eqL"><i></i></button></div>`,
      css:`.row{display:flex;align-items:center;justify-content:space-between;padding:22px 26px 22px 32px}
.sw{position:relative;width:64px;height:36px;border-radius:999px;background:#bcb8b1;box-shadow:inset 2px 3px 6px rgba(0,0,0,.25);transition:background .3s}
.sw[aria-checked=true]{background:linear-gradient(180deg,#3b3a37,#55534e)}
.sw i{position:absolute;top:3px;left:3px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#ecebe7);box-shadow:2px 3px 7px rgba(0,0,0,.3);transition:transform .35s cubic-bezier(.3,1.4,.5,1)}
.sw[aria-checked=true] i{transform:translateX(28px)}`,
      init(root){const s=root.querySelector('.sw');s.addEventListener('click',()=>s.setAttribute('aria-checked',s.getAttribute('aria-checked')!=='true'));}
    },
    X026:{ w:320,
      html:`<div class="eq panel" role="group" aria-label="Equaliser">
<div class="bands"><input type="range" class="v" min="0" max="100" value="38" aria-label="Low"><input type="range" class="v" min="0" max="100" value="62" aria-label="Low-mid"><input type="range" class="v" min="0" max="100" value="74" aria-label="High-mid"><input type="range" class="v" min="0" max="100" value="46" aria-label="High"></div>
<div class="names"><span>Low</span><span>Mid</span><span>High</span></div></div>`,
      css:`.eq{padding:30px 30px 22px}
.bands{display:flex;justify-content:space-between;padding:0 6px}
.v{-webkit-appearance:none;appearance:none;writing-mode:vertical-lr;direction:rtl;width:34px;height:176px;margin:0;background:transparent;cursor:pointer;--p:50%}
.v::-webkit-slider-runnable-track{width:4px;border-radius:2px;background:linear-gradient(0deg,#4a4844 var(--p),#9c988f var(--p));margin:0 auto}
.v::-moz-range-track{width:4px;border-radius:2px;background:#4a4844}
.v::-webkit-slider-thumb{-webkit-appearance:none;width:30px;height:30px;margin-left:-13px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#e9e7e3);border:1px solid rgba(255,255,255,.9);box-shadow:3px 4px 9px rgba(120,112,100,.5),-2px -2px 5px rgba(255,255,255,.85)}
.v::-moz-range-thumb{width:28px;height:28px;border-radius:50%;background:#f4f3f0;border:1px solid #fff;box-shadow:3px 4px 9px rgba(120,112,100,.5)}
.v:focus-visible{outline:none}.v:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 3px rgba(138,122,98,.45)}
.names{display:grid;grid-template-columns:1fr 2fr 1fr;margin-top:16px;font-size:15px;color:var(--ink2)}
.names span{text-align:center}.names span:first-child{text-align:left;padding-left:6px}.names span:last-child{text-align:right;padding-right:4px}`,
      init(root){root.querySelectorAll('input').forEach(i=>{const u=()=>i.style.setProperty('--p',i.value+'%');i.addEventListener('input',u);u();});}
    },
    X027:{ w:300,
      html:`<div class="snd panel" role="radiogroup" aria-labelledby="sL"><div class="lbl" id="sL">Sound</div>
<button role="radio" aria-checked="true" type="button"><svg class="i" viewBox="0 0 24 24"><path d="M4 10v4M7.5 6.5v11M11 4v16M14.5 8v8M18 9.5v5M21 11v2"/></svg>Balanced</button>
<button role="radio" aria-checked="false" type="button"><svg class="i" viewBox="0 0 24 24"><path d="M4 9v6M7.5 5v14M11 7v10M14.5 9.5v5M18 11v2"/></svg>Warm</button>
<button role="radio" aria-checked="false" type="button"><svg class="i" viewBox="0 0 24 24"><path d="M4 11v2M7.5 9v6M11 5v14M14.5 4v16M18 9v6M21 11v2"/></svg>Vocal</button>
<button role="radio" aria-checked="false" type="button"><svg class="i" viewBox="0 0 24 24"><path d="M4 4v16M7.5 6v12M11 8v8M14.5 10v4M18 11v2"/></svg>Bass Boost</button>
<button role="radio" aria-checked="false" type="button"><svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.5"/><circle class="fill" cx="12" cy="12" r="3"/></svg>Custom</button></div>`,
      css:`.snd{display:flex;flex-direction:column;gap:4px;padding:28px 18px 22px}
.snd .lbl{padding:0 0 14px 14px}
.snd button{display:flex;align-items:center;gap:18px;padding:12px 16px;border-radius:999px;font-size:17px;color:var(--ink2);text-align:left}
.snd button:hover{background:rgba(255,255,255,.5);color:var(--ink)}
.snd button[aria-checked=true]{color:var(--ink);font-weight:500;background:linear-gradient(150deg,#fbfaf8,#efeeea);box-shadow:-3px -3px 8px rgba(255,255,255,.9),4px 5px 12px var(--lo),inset 0 1px 0 #fff}`,
      init(root){const l=root.querySelectorAll('[role=radio]');l.forEach((b,k)=>{b.addEventListener('click',()=>{l.forEach(x=>x.setAttribute('aria-checked','false'));b.setAttribute('aria-checked','true');});
        b.addEventListener('keydown',e=>{const d=e.key==='ArrowDown'?1:e.key==='ArrowUp'?-1:0;if(d){e.preventDefault();const n=l[(k+d+l.length)%l.length];n.focus();n.click();}});});}
    },
    X028:{ w:360,
      html:`<div class="amb panel"><div class="lbl" id="aL">Ambience</div>
<div class="opts" role="radiogroup" aria-labelledby="aL">
<button role="radio" aria-checked="false" type="button"><span class="c raised"><svg class="i" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M4 4l16 16M20 4 4 20"/></svg></span>None</button>
<button role="radio" aria-checked="false" type="button"><span class="c raised"><svg class="i" viewBox="0 0 24 24"><path d="M7.2 15.5a4 4 0 0 1-.4-8 5.6 5.6 0 0 1 10.7 1.6 3.3 3.3 0 0 1-.3 6.4z"/><path d="M9 18.5 8.3 20M12.5 18.5l-.7 1.5M16 18.5l-.7 1.5"/></svg></span>Rain</button>
<button role="radio" aria-checked="true" type="button"><span class="c raised"><img src="{{img}}/D24-forest.webp" alt=""></span>Forest</button></div>
<div class="vol"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.6"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6"/></svg><input class="rng" type="range" min="0" max="100" value="45" aria-label="Ambience volume"></div></div>`,
      css:`.amb{padding:30px 26px 26px}
.amb .lbl{padding-left:12px}
.opts{display:flex;justify-content:space-between;margin:28px 0 30px}
.opts button{display:flex;flex-direction:column;align-items:center;gap:14px;font-size:15px;color:var(--mute)}
.c{display:grid;place-items:center;width:84px;height:84px;border-radius:50%;color:var(--ink2);overflow:hidden;transition:box-shadow .25s,transform .2s}
.c svg{width:30px;height:30px}
.c img{width:100%;height:100%;object-fit:cover;border-radius:50%}
.opts button:hover .c{transform:translateY(-1px)}
.opts button[aria-checked=true]{color:var(--ink);font-weight:600}
.opts button[aria-checked=true] .c{padding:5px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.06),5px 7px 16px rgba(120,112,100,.5),-3px -3px 8px rgba(255,255,255,.9)}
.opts button[aria-checked=true] .c svg{color:var(--ink)}
.vol{display:flex;align-items:center;gap:16px;padding:0 4px 0 6px;color:var(--ink2)}`,
      init(root){const l=root.querySelectorAll('[role=radio]');l.forEach(b=>b.addEventListener('click',()=>{l.forEach(x=>x.setAttribute('aria-checked','false'));b.setAttribute('aria-checked','true');}));
        const i=root.querySelector('.rng'),u=()=>i.style.setProperty('--p',i.value+'%');i.addEventListener('input',u);u();}
    },
    X029:{ w:360,
      html:`<div class="vl panel"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.6"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6"/></svg><input class="rng" type="range" min="0" max="100" value="45" aria-label="Volume"></div>`,
      css:`.vl{display:flex;align-items:center;gap:18px;padding:16px 26px;border-radius:999px;color:var(--ink2)}`,
      init(root){const i=root.querySelector('.rng'),u=()=>i.style.setProperty('--p',i.value+'%');i.addEventListener('input',u);u();}
    },
    X030:{ w:960,
      html:`<section class="q panel" aria-labelledby="qL"><div class="lbl" id="qL">Up next</div><ol>
<li><button type="button" class="t" aria-current="true"><img src="{{img}}/D24-q1.webp" alt=""><span><b>A Walk in the Trees</b><em>Helios</em><small>3:42</small></span></button><button class="ib k" type="button" aria-label="More options for A Walk in the Trees"><svg class="i" viewBox="0 0 24 24"><circle class="fill" cx="12" cy="5.5" r="1.5"/><circle class="fill" cx="12" cy="12" r="1.5"/><circle class="fill" cx="12" cy="18.5" r="1.5"/></svg></button></li>
<li><button type="button" class="t"><img src="{{img}}/D24-q2.webp" alt=""><span><b>Lavender</b><em>Men I Trust</em><small>4:12</small></span></button><button class="ib k" type="button" aria-label="More options for Lavender"><svg class="i" viewBox="0 0 24 24"><circle class="fill" cx="12" cy="5.5" r="1.5"/><circle class="fill" cx="12" cy="12" r="1.5"/><circle class="fill" cx="12" cy="18.5" r="1.5"/></svg></button></li>
<li><button type="button" class="t"><img src="{{img}}/D24-q3.webp" alt=""><span><b>Blue Meadows</b><em>Fleet Foxes</em><small>5:06</small></span></button><button class="ib k" type="button" aria-label="More options for Blue Meadows"><svg class="i" viewBox="0 0 24 24"><circle class="fill" cx="12" cy="5.5" r="1.5"/><circle class="fill" cx="12" cy="12" r="1.5"/><circle class="fill" cx="12" cy="18.5" r="1.5"/></svg></button></li>
<li><button type="button" class="t"><img src="{{img}}/D24-q4.webp" alt=""><span><b>A Softer Place</b><em>Novo Amour</em><small>4:28</small></span></button><button class="ib k" type="button" aria-label="More options for A Softer Place"><svg class="i" viewBox="0 0 24 24"><circle class="fill" cx="12" cy="5.5" r="1.5"/><circle class="fill" cx="12" cy="12" r="1.5"/><circle class="fill" cx="12" cy="18.5" r="1.5"/></svg></button></li>
</ol></section>`,
      css:`.q{padding:28px 30px 26px}
.q .lbl{padding-left:26px;margin-bottom:16px}
ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
li{display:flex;align-items:center;border-radius:18px;padding:10px 4px 10px 12px;transition:background .25s,box-shadow .25s}
li:hover{background:rgba(255,255,255,.45)}
li:has([aria-current]){background:linear-gradient(150deg,#fbfaf8,#efeeea);box-shadow:-3px -3px 8px rgba(255,255,255,.9),4px 5px 12px var(--lo)}
.t{flex:1;min-width:0;display:flex;align-items:center;gap:14px;text-align:left}
.t img{width:64px;height:64px;border-radius:9px;object-fit:cover;box-shadow:0 4px 10px rgba(60,50,40,.22);flex:none}
.t span{display:flex;flex-direction:column;min-width:0}
.t b{font-weight:600;font-size:15.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.01em}
.t em{font-style:normal;white-space:nowrap;font-size:14px;color:var(--mute);margin:4px 0 6px}
.t small{font-size:13.5px;color:var(--mute);font-variant-numeric:tabular-nums}
.k{flex:none;width:34px;color:var(--ink2)}`,
      init(root){const l=root.querySelectorAll('.t');l.forEach(b=>b.addEventListener('click',()=>{l.forEach(x=>x.removeAttribute('aria-current'));b.setAttribute('aria-current','true');}));}
    }
  }
});
