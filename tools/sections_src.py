HEAD='''<!doctype html><html lang="en" data-style="noir"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:ital,wght@1,500&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap">
<style>
/* Four interchangeable styles. Pick one with data-style on <html>, or delete the ones you don't need. */
:root,[data-style=noir]{{--bg:#16120F;--surface:#211B16;--ink:#F3EADB;--mute:#B3A592;--line:#3B3129;--accent:#E2A24A;--on-accent:#1A120A;--head:Fraunces,Georgia,serif;--body:'DM Sans',system-ui,sans-serif;--hw:400;--hs:normal;--radius:14px;--track:-.02em;color-scheme:dark}}
[data-style=paper]{{--bg:#F6F0E6;--surface:#FFFBF4;--ink:#231C15;--mute:#6A5D4E;--line:#E3D7C4;--accent:#9A5B12;--on-accent:#FFFFFF;--accent-ink:#8A520C;--head:Fraunces,Georgia,serif;--body:'DM Sans',system-ui,sans-serif;--hw:400;--hs:normal;--radius:14px;--track:-.02em;color-scheme:light}}
[data-style=studio]{{--bg:#F4F5F8;--surface:#FFFFFF;--ink:#1C1F2A;--mute:#5E6476;--line:#E1E4EC;--accent:#5B2DFF;--on-accent:#FFFFFF;--head:'Cormorant Garamond',Georgia,serif;--body:Inter,system-ui,sans-serif;--hw:500;--hs:italic;--radius:16px;--track:-.01em;color-scheme:light}}
[data-style=signal]{{--bg:#05070B;--surface:#0C1119;--ink:#EAF0F8;--mute:#93A0B4;--line:#1C2533;--accent:#7CF0FF;--on-accent:#04121A;--head:'Space Grotesk',Inter,sans-serif;--body:Inter,system-ui,sans-serif;--hw:500;--hs:normal;--radius:18px;--track:-.03em;color-scheme:dark}}
*{{box-sizing:border-box}}html,body{{margin:0}}
body{{background:var(--bg);color:var(--ink);font:16px/1.6 var(--body);-webkit-font-smoothing:antialiased;transition:background .3s,color .3s}}
a{{color:inherit}}button,input,textarea,select{{font:inherit;color:inherit}}
:focus-visible{{outline:2px solid var(--accent);outline-offset:3px}}
.h{{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);letter-spacing:var(--track);line-height:1.02;text-wrap:balance}}
.k{{font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--accent-ink,var(--accent))}}
.btn{{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 20px;border-radius:calc(var(--radius) * .7);border:1px solid var(--line);background:var(--surface);font-weight:600;font-size:15px;text-decoration:none;cursor:pointer}}
.btn.p{{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}}
.wrap{{max-width:1180px;margin:0 auto;padding:clamp(56px,10vh,110px) max(16px,4vw)}}
.styles{{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:12px;z-index:50;display:flex;gap:2px;padding:4px;border-radius:999px;background:rgba(128,128,128,.18);backdrop-filter:blur(10px);font:500 12px/1 system-ui,sans-serif}}
.styles button{{border:0;background:transparent;color:var(--ink);padding:9px 11px;border-radius:999px;cursor:pointer;min-height:32px}}
.styles button[aria-pressed=true]{{background:var(--ink);color:var(--bg)}}
{css}
@media (prefers-reduced-motion:reduce){{*,*::before,*::after{{transition:none!important;animation:none!important}}}}
</style></head><body>
{body}
<div class="styles" role="group" aria-label="Style"><button data-s="noir">Noir</button><button data-s="paper">Paper</button><button data-s="studio">Studio</button><button data-s="signal">Signal</button></div>
<script>
(()=>{{const B=[...document.querySelectorAll('.styles button')];const set=s=>{{document.documentElement.dataset.style=s;B.forEach(b=>b.setAttribute('aria-pressed',b.dataset.s===s));try{{localStorage.setItem('atlas-section-style',s)}}catch(e){{}}}};
let s=location.hash.slice(1);if(!B.some(b=>b.dataset.s===s)){{try{{s=localStorage.getItem('atlas-section-style')}}catch(e){{}}}}set(B.some(b=>b.dataset.s===s)?s:'noir');B.forEach(b=>b.onclick=()=>set(b.dataset.s));}})();
{js}
</script></body></html>
'''
S={}
S['sec-pricing']=('Pricing section','''
.top{text-align:center;display:grid;justify-items:center;gap:14px;margin-bottom:44px}
.top h2{font-size:clamp(38px,5.4vw,68px);margin:0}
.top p{margin:0;color:var(--mute);max-width:46ch}
.bill{display:inline-flex;padding:4px;border:1px solid var(--line);border-radius:999px;background:var(--surface)}
.bill button{border:0;background:transparent;padding:10px 16px;border-radius:999px;cursor:pointer;font-size:14px;font-weight:500;min-height:40px}
.bill button[aria-pressed=true]{background:var(--ink);color:var(--bg)}
.bill em{font-style:normal;color:var(--accent-ink,var(--accent));font-weight:600;margin-left:4px}
[aria-pressed=true] em{color:inherit}
.plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:16px;align-items:stretch}
.plan{position:relative;display:flex;flex-direction:column;gap:16px;padding:28px;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface)}
.plan.hot{border:2px solid var(--accent);transform:translateY(-8px);box-shadow:0 30px 60px -36px var(--accent)}
.tag{position:absolute;top:-13px;left:28px;background:var(--accent);color:var(--on-accent);font-size:12px;font-weight:600;padding:5px 10px;border-radius:999px}
.plan h3{margin:0;font-size:18px;font-weight:600}
.plan .d{margin:0;color:var(--mute);font-size:14px;min-height:3em}
.price{display:flex;align-items:baseline;gap:6px}
.price b{font-family:var(--head);font-weight:var(--hw);font-size:56px;line-height:1;letter-spacing:var(--track);font-variant-numeric:tabular-nums}
.price span{color:var(--mute);font-size:14px}
.plan ul{list-style:none;margin:0;padding:16px 0 0;border-top:1px solid var(--line);display:grid;gap:10px;font-size:14.5px;flex:1}
.plan li{display:flex;gap:10px}.plan li::before{content:"";flex:0 0 16px;height:16px;margin-top:3px;border-radius:50%;background:var(--accent);-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 8.5l2.5 2.5L12 5.5' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E") center/100% no-repeat,radial-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.plan .btn{width:100%}
.small{text-align:center;color:var(--mute);font-size:14px;margin-top:28px}
@media (max-width:700px){.plan.hot{transform:none}}
''','''<section class="wrap" aria-labelledby="pt"><div class="top"><p class="k">Pricing</p><h2 class="h" id="pt">Pay for the kitchen you have.</h2><p>Every plan includes recipe cards, shot lists and the colour grade. Change or cancel at any time.</p>
<div class="bill" role="group" aria-label="Billing period"><button aria-pressed="true" data-b="m">Monthly</button><button aria-pressed="false" data-b="y">Yearly <em>−20%</em></button></div></div>
<div class="plans">
<article class="plan"><h3>Home cook</h3><p class="d">For one channel finding its voice.</p><div class="price"><b data-m="0" data-y="0">£0</b><span>/ month</span></div><ul><li>4 episodes a month</li><li>Recipe cards</li><li>Community templates</li></ul><a class="btn" href="#">Start free</a></article>
<article class="plan hot"><span class="tag">Most chosen</span><h3>Head chef</h3><p class="d">For channels posting every week.</p><div class="price"><b data-m="29" data-y="23">£29</b><span>/ month</span></div><ul><li>Unlimited episodes</li><li>Character bible and face lock</li><li>Premium video renders</li><li>Rights and credit checks</li></ul><a class="btn p" href="#">Start 14-day trial</a></article>
<article class="plan"><h3>Restaurant</h3><p class="d">For studios running several channels.</p><div class="price"><b data-m="99" data-y="79">£99</b><span>/ month</span></div><ul><li>Up to 6 channels</li><li>Shared brand styles</li><li>Approvals and roles</li><li>Priority support</li></ul><a class="btn" href="#">Talk to us</a></article>
</div><p class="small">Prices exclude VAT. Yearly plans are billed once a year.</p></section>''','''
const bs=[...document.querySelectorAll('.bill button')];bs.forEach(b=>b.onclick=()=>{bs.forEach(x=>x.setAttribute('aria-pressed',x===b));document.querySelectorAll('.price b').forEach(p=>{p.textContent='£'+p.dataset[b.dataset.b]});document.querySelectorAll('.price span').forEach(s=>s.textContent=b.dataset.b==='y'?'/ month, billed yearly':'/ month')});
document.querySelectorAll('a[href="#"]').forEach(a=>a.onclick=e=>e.preventDefault());''')

S['sec-bento']=('Bento features section','''
.head{display:flex;justify-content:space-between;align-items:end;gap:24px;flex-wrap:wrap;margin-bottom:34px}
.head h2{font-size:clamp(36px,5vw,64px);margin:8px 0 0;max-width:14ch}
.head p{margin:0;color:var(--mute);max-width:40ch}
.bento{display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:minmax(190px,auto);gap:14px}
.c{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface);padding:24px;display:flex;flex-direction:column;gap:8px;justify-content:flex-end;transition:transform .35s cubic-bezier(.2,.8,.2,1),border-color .3s}
.c:hover{transform:translateY(-3px);border-color:var(--accent)}
.c h3{margin:0;font-size:20px;font-weight:600;position:relative}
.c p{margin:0;color:var(--mute);font-size:14.5px;max-width:38ch;position:relative}
.c1{grid-column:span 4;grid-row:span 2}.c2,.c3{grid-column:span 2}.c4,.c5,.c6{grid-column:span 2}
.c1 img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.c1::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,var(--surface) 18%,transparent 70%)}
.c1 h3,.c1 p{z-index:1}
.big{font-family:var(--head);font-weight:var(--hw);font-size:64px;line-height:1;letter-spacing:var(--track);color:var(--accent-ink,var(--accent));margin-bottom:auto}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:auto}.chips span{font-size:12px;padding:6px 10px;border-radius:999px;border:1px solid var(--line)}
.bars{display:flex;align-items:flex-end;gap:5px;height:64px;margin-bottom:auto}.bars i{flex:1;border-radius:4px 4px 0 0;background:var(--accent);opacity:.85;height:var(--h)}
.bars i:nth-child(odd){opacity:.45}
@media (max-width:820px){.bento{grid-template-columns:1fr 1fr}.c1{grid-column:span 2;min-height:340px}.c2,.c3,.c4,.c5,.c6{grid-column:span 1}}
@media (max-width:520px){.bento{grid-template-columns:1fr}.c1,.c2,.c3,.c4,.c5,.c6{grid-column:auto}}
''','''<section class="wrap" aria-labelledby="bt"><div class="head"><div><p class="k">What you get</p><h2 class="h" id="bt">Everything a recipe channel needs.</h2></div><p>One place for the chef, the dish, the shot list and the post. Each card is a feature; the large one is the one to lead with.</p></div>
<div class="bento">
<article class="c c1"><img src="../../assets/shelf/bloom.webp" alt=""><h3>Every dish, filmed like a still life</h3><p>Shot lists that frame hands, steam and the final plate the same way every time.</p></article>
<article class="c c2"><span class="big">−42%</span><h3>Time to publish</h3><p>From recipe to posted episode.</p></article>
<article class="c c3"><div class="chips"><span>Fraunces</span><span>Saffron</span><span>Grain</span><span>Deadpan</span></div><h3>A house style</h3><p>Type, colour and tone locked across every episode.</p></article>
<article class="c c4"><div class="bars" aria-hidden="true"><i style="--h:40%"></i><i style="--h:62%"></i><i style="--h:50%"></i><i style="--h:80%"></i><i style="--h:70%"></i><i style="--h:96%"></i></div><h3>What worked</h3><p>Retention per scene, fed back into the next shot list.</p></article>
<article class="c c5"><span class="big">1</span><h3>Chef, same face</h3><p>A character bible keeps your chef consistent shot to shot.</p></article>
<article class="c c6"><span class="big">✓</span><h3>Credit checked</h3><p>Famous recipes are credited on screen before they post.</p></article>
</div></section>''','')

S['sec-testimonials']=('Testimonial wall','''
.top{text-align:center;display:grid;justify-items:center;gap:12px;margin-bottom:40px}
.top h2{font-size:clamp(36px,5vw,64px);margin:0;max-width:18ch}
.wall{position:relative;height:620px;overflow:hidden;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;-webkit-mask:linear-gradient(transparent,#000 12%,#000 88%,transparent);mask:linear-gradient(transparent,#000 12%,#000 88%,transparent)}
.col{display:flex;flex-direction:column;gap:16px;animation:up var(--d,40s) linear infinite}
.col:nth-child(2){--d:52s;animation-direction:reverse}.col:nth-child(3){--d:46s}
.wall:hover .col,.wall:focus-within .col{animation-play-state:paused}
@keyframes up{to{transform:translateY(-50%)}}
figure{margin:0;padding:22px;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface);display:grid;gap:16px}
blockquote{margin:0;font-size:15.5px}
blockquote b{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:21px;line-height:1.2;display:block;margin-bottom:6px;letter-spacing:var(--track)}
figcaption{display:flex;gap:12px;align-items:center;font-size:14px}
figcaption img{width:40px;height:40px;border-radius:50%;object-fit:cover}
figcaption span{display:block;color:var(--mute);font-size:13px}
.stars{color:var(--accent-ink,var(--accent));letter-spacing:2px;font-size:14px}
.pause{display:flex;justify-content:center;margin-top:20px}
.wall.stopped .col{animation-play-state:paused}
@media (max-width:860px){.wall{grid-template-columns:1fr 1fr}.col:nth-child(3){display:none}}
@media (max-width:560px){.wall{grid-template-columns:1fr;height:560px}.col:nth-child(2){display:none}}
''','''<section class="wrap" aria-labelledby="tt"><div class="top"><p class="k">Loved by cooks</p><h2 class="h" id="tt">Twelve thousand kitchens, one recurring complaint: they wish they’d started sooner.</h2></div>
<div class="wall" id="wall"></div><div class="pause"><button class="btn" id="tpause" aria-pressed="false">Pause the wall</button></div></section>''','''
const Q=[['The face never drifts.','Our chef looks the same in every shot now. Viewers stopped asking if it was a different person.','Ana Ruiz','Saffron Hour','bloom'],['Posting weekly, finally.','We went from one episode a month to one a week without hiring.','Tom Becker','Low & Slow','ferro'],['Credits handled.','The rights check flagged two recipes we would have posted without credit.','Mei Lin','Dumpling Desk','sumi'],['It feels like us.','The house style is so consistent that people recognise our thumbnails before the name.','Kofi Mensah','Pepper Pot','amber'],['Thumbnails that work.','Click-through went up a third after we switched to the shot-list framing.','Lucía Gómez','Mesa','dove'],['Calmer edits.','Deadpan pacing sounded odd until we saw the retention curve.','Jonas Weber','Brot','owl'],['Our editor loves it.','Fewer notes, fewer reshoots, and the music no longer fights the knife sounds.','Priya Nair','Tadka','threads'],['Worth it for the bible.','The character bible alone saved a week of back-and-forth.','Sam Okoro','Jollof Lab','smoke']];
const card=([h,t,n,r,i])=>`<figure><span class="stars" aria-label="5 out of 5">★★★★★</span><blockquote><b>${h}</b>${t}</blockquote><figcaption><img src="../../assets/shelf/${i}.webp" alt=""><div>${n}<span>${r}</span></div></figcaption></figure>`;
const wall=document.getElementById('wall');[0,1,2].forEach(c=>{const items=Q.filter((_,i)=>i%3===c);const col=document.createElement('div');col.className='col';col.innerHTML=items.map(card).join('')+items.map(card).join('');col.querySelectorAll('figure').forEach((f,i)=>{if(i>=items.length)f.setAttribute('aria-hidden','true')});wall.append(col)});
const pb=document.getElementById('tpause');pb.onclick=()=>{const on=wall.classList.toggle('stopped');pb.setAttribute('aria-pressed',on);pb.textContent=on?'Play the wall':'Pause the wall'};''')

S['sec-faq']=('FAQ section','''
.grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);gap:clamp(28px,6vw,80px)}
.grid h2{font-size:clamp(36px,5vw,64px);margin:8px 0 16px}
.grid .side p{color:var(--mute);margin:0 0 20px;max-width:34ch}
details{border-bottom:1px solid var(--line)}
details:first-of-type{border-top:1px solid var(--line)}
summary{list-style:none;display:flex;justify-content:space-between;gap:20px;align-items:center;padding:22px 0;cursor:pointer;font-size:18px;font-weight:500}
summary::-webkit-details-marker{display:none}
summary i{flex:0 0 28px;height:28px;border-radius:50%;border:1px solid var(--line);position:relative;transition:transform .3s,background .3s}
summary i::before,summary i::after{content:"";position:absolute;left:50%;top:50%;width:10px;height:1.5px;margin:-.75px -5px;background:currentColor}
summary i::after{transform:rotate(90deg);transition:transform .3s}
details[open] summary i{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
details[open] summary i::after{transform:rotate(0)}
.a{display:grid;grid-template-rows:0fr;transition:grid-template-rows .35s cubic-bezier(.2,.8,.2,1)}
details[open] .a{grid-template-rows:1fr}
.a>div{overflow:hidden}.a p{margin:0 0 22px;color:var(--mute);max-width:58ch}
@media (max-width:760px){.grid{grid-template-columns:1fr}}
''','''<section class="wrap"><div class="grid"><div class="side"><p class="k">Questions</p><h2 class="h">Before you start cooking.</h2><p>Can’t find what you need? A real person answers within a working day.</p><a class="btn p" href="#">Ask us</a></div>
<div>
<details open><summary>Do I need my own footage?<i aria-hidden="true"></i></summary><div class="a"><div><p>No. You can start from a recipe and a character bible; we generate the shots. If you have footage, upload it and we’ll match the grade.</p></div></div></details>
<details><summary>Who owns what I make?<i aria-hidden="true"></i></summary><div class="a"><div><p>You do. Episodes, thumbnails and recipe cards are yours to post anywhere, including after you cancel.</p></div></div></details>
<details><summary>How do recipe credits work?<i aria-hidden="true"></i></summary><div class="a"><div><p>When a recipe comes from a known chef or book, we add an on-screen credit and a line in the description, and hold the post until someone approves it.</p></div></div></details>
<details><summary>Can my chef look the same every time?<i aria-hidden="true"></i></summary><div class="a"><div><p>Yes. A character bible fixes the face, hands, clothes and kitchen, and every shot is checked against it before it renders.</p></div></div></details>
<details><summary>What happens if I cancel?<i aria-hidden="true"></i></summary><div class="a"><div><p>Your library stays downloadable for 90 days. We’ll email you before anything is deleted.</p></div></div></details>
</div></div></section>''','''
document.querySelectorAll('a[href="#"]').forEach(a=>a.onclick=e=>e.preventDefault());''')

S['sec-contact']=('Contact section','''
.grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:clamp(28px,5vw,70px);align-items:start}
.grid h2{font-size:clamp(36px,5vw,64px);margin:8px 0 18px}
.intro p{color:var(--mute);max-width:36ch;margin:0 0 28px}
.ways{display:grid;gap:12px}
.way{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;padding:16px;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface)}
.way svg{grid-row:span 2;width:22px;height:22px;color:var(--accent-ink,var(--accent));margin-top:2px}
.way b{font-weight:600}.way span{color:var(--mute);font-size:14px;user-select:all}
form{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:28px;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface)}
.f{display:grid;gap:6px}.f.w{grid-column:1/-1}
label{font-size:14px;font-weight:500}
input,textarea,select{width:100%;min-height:48px;padding:10px 14px;border-radius:calc(var(--radius) * .6);border:1px solid var(--line);background:var(--bg)}
textarea{min-height:130px;resize:vertical}
input:focus,textarea:focus,select:focus{outline:2px solid var(--accent);outline-offset:0;border-color:transparent}
.err{color:#D9604A;font-size:13px;min-height:1em}
[data-style=paper] .err,[data-style=studio] .err{color:#B3261E}
[aria-invalid=true]{border-color:#D9604A}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips label{display:inline-flex;align-items:center;min-height:40px;padding:0 14px;border-radius:999px;border:1px solid var(--line);cursor:pointer;font-weight:500}
.chips input{position:absolute;opacity:0;width:1px;height:1px}
.chips input:checked+span{color:var(--on-accent)}
.chips label:has(input:checked){background:var(--accent);border-color:var(--accent)}
.chips label:has(input:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
.send{grid-column:1/-1;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.ok{color:var(--mute);font-size:14px}
@media (max-width:820px){.grid{grid-template-columns:1fr}form{grid-template-columns:1fr}}
''','''<section class="wrap"><div class="grid"><div class="intro"><p class="k">Contact</p><h2 class="h">Tell us what you’re cooking.</h2><p>A short note is plenty. We reply within a working day, usually with questions about the dish.</p>
<div class="ways"><div class="way"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg><b>Email</b><span>hello@example.kitchen</span></div>
<div class="way"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg><b>Studio</b><span>14 Market Row, London E8</span></div></div></div>
<form id="f" novalidate>
<div class="f"><label for="n">Your name</label><input id="n" name="n" autocomplete="name" required aria-describedby="ne"><span class="err" id="ne"></span></div>
<div class="f"><label for="e">Email</label><input id="e" name="e" type="email" autocomplete="email" required aria-describedby="ee"><span class="err" id="ee"></span></div>
<fieldset class="f w" style="border:0;padding:0;margin:0"><legend style="font-size:14px;font-weight:500;margin-bottom:6px">What do you need?</legend><div class="chips"><label><input type="checkbox" name="t" value="channel"><span>A new channel</span></label><label><input type="checkbox" name="t" value="episodes"><span>More episodes</span></label><label><input type="checkbox" name="t" value="style"><span>A house style</span></label><label><input type="checkbox" name="t" value="other"><span>Something else</span></label></div></fieldset>
<div class="f w"><label for="m">Message</label><textarea id="m" name="m" required aria-describedby="me"></textarea><span class="err" id="me"></span></div>
<div class="send"><button class="btn p" type="submit">Send message</button><span class="ok" id="ok" role="status"></span></div>
</form></div></section>''','''
const f=document.getElementById('f');const msg={n:'Please add your name.',e:'Please add an email address we can reply to.',m:'A sentence or two is enough.'};
function check(el){const id=el.id,bad=!el.value.trim()||(el.type==='email'&&!el.checkValidity());el.setAttribute('aria-invalid',bad);document.getElementById(id+'e').textContent=bad?(el.type==='email'&&el.value?'That email address doesn’t look right.':msg[id]):'';return !bad}
['n','e','m'].forEach(id=>document.getElementById(id).addEventListener('blur',e=>check(e.target)));
f.addEventListener('submit',e=>{e.preventDefault();const els=['n','e','m'].map(id=>document.getElementById(id));const ok=els.map(check).every(Boolean);if(!ok){els.find(x=>x.getAttribute('aria-invalid')==='true').focus();return}document.getElementById('ok').textContent='Thanks. This is a template, so nothing was sent.'});''')

S['sec-footer']=('Big wordmark footer','''
body{display:flex;flex-direction:column;min-height:100vh}
.spacer{flex:1;display:grid;place-items:center;color:var(--mute);padding:40px 16px;text-align:center}
footer{border-top:1px solid var(--line);background:var(--surface);overflow:hidden}
.in{max-width:1180px;margin:0 auto;padding:clamp(48px,8vh,80px) max(16px,4vw) 0}
.cols{display:grid;grid-template-columns:minmax(0,1.6fr) repeat(3,minmax(0,1fr));gap:32px}
.news h3{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);letter-spacing:var(--track);font-size:30px;line-height:1.1;margin:0 0 14px}
.news form{display:flex;gap:8px;max-width:380px}
.news input{flex:1;min-width:0;min-height:46px;padding:0 14px;border-radius:calc(var(--radius) * .7);border:1px solid var(--line);background:var(--bg)}
.news p{color:var(--mute);font-size:13px;margin:10px 0 0}
nav h4{margin:0 0 14px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);font-weight:600}
nav ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
nav a{text-decoration:none;font-size:15px}nav a:hover{color:var(--accent-ink,var(--accent))}
.word{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:clamp(80px,22vw,300px);line-height:.78;letter-spacing:-.05em;margin:clamp(40px,8vh,80px) 0 0;white-space:nowrap;transform:translateY(calc((1 - var(--p,1)) * 40%));transition:transform .1s linear;user-select:none}
.word span{display:inline-block;color:var(--accent);transform:translateY(calc((1 - var(--p,1)) * 30%))}
.legal{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:18px 0 22px;border-top:1px solid var(--line);color:var(--mute);font-size:13px;position:relative;background:var(--surface)}
.legal a{text-decoration:none}
@media (max-width:820px){.cols{grid-template-columns:1fr 1fr}.news{grid-column:1/-1}}
''','''<div class="spacer"><p>Scroll down to the footer. The wordmark rises as it comes into view.</p></div>
<footer><div class="in"><div class="cols">
<div class="news"><h3>One recipe, every Sunday.</h3><form id="nf"><label for="fne" class="visually" style="position:absolute;left:-9999px">Email address</label><input id="fne" type="email" placeholder="you@example.com" required><button class="btn p" type="submit">Join</button></form><p id="nok" role="status">No spam. Unsubscribe in one click.</p></div>
<nav aria-label="Product"><h4>Product</h4><ul><li><a href="#">Episodes</a></li><li><a href="#">Recipe cards</a></li><li><a href="#">House style</a></li><li><a href="#">Pricing</a></li></ul></nav>
<nav aria-label="Company"><h4>Kitchen</h4><ul><li><a href="#">About</a></li><li><a href="#">Chefs</a></li><li><a href="#">Journal</a></li><li><a href="#">Careers</a></li></ul></nav>
<nav aria-label="Social"><h4>Follow</h4><ul><li><a href="#">YouTube</a></li><li><a href="#">TikTok</a></li><li><a href="#">Instagram</a></li></ul></nav>
</div><p class="word" aria-hidden="true">Saffron<span>.</span></p>
<div class="legal"><span>© 2026 Saffron Kitchen Ltd</span><span><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Credits</a></span></div></div></footer>''','''
document.querySelectorAll('a[href="#"]').forEach(a=>a.onclick=e=>e.preventDefault());
document.getElementById('nf').addEventListener('submit',e=>{e.preventDefault();document.getElementById('nok').textContent='Thanks. This is a template, so you have not been subscribed.'});
const w=document.querySelector('.word');const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function u(){if(reduce){w.style.setProperty('--p',1);return}const r=w.getBoundingClientRect();const p=Math.min(1,Math.max(0,(innerHeight-r.top)/(r.height+60)));w.style.setProperty('--p',p)}addEventListener('scroll',u,{passive:true});u();''')

S['sec-logos']=('Logo cloud marquee','''
.top{display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap;margin-bottom:28px}
.top h2{font-size:clamp(28px,3.6vw,44px);margin:6px 0 0;max-width:22ch}
.row{overflow:hidden;-webkit-mask:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);padding:10px 0}
.track{display:flex;gap:16px;width:max-content;animation:slide 38s linear infinite}
.row.r2 .track{animation-duration:46s;animation-direction:reverse}
.row:hover .track{animation-play-state:paused}
.stopped .track{animation-play-state:paused!important}
@keyframes slide{to{transform:translateX(-50%)}}
.logo{display:flex;align-items:center;gap:10px;height:72px;padding:0 26px;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface);font-weight:600;font-size:18px;white-space:nowrap;color:var(--mute);transition:color .3s}
.logo:hover{color:var(--ink)}
.logo svg{width:24px;height:24px;color:var(--accent-ink,var(--accent))}
.logo.serif{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:22px}
.logo.mono{font-family:ui-monospace,monospace;letter-spacing:.06em;font-size:15px}
''','''<section class="wrap" id="lsec"><div class="top"><div><p class="k">Trusted by</p><h2 class="h">Cooks, chefs and food brands in 31 countries.</h2></div><button class="btn" id="lpause" aria-pressed="false">Pause</button></div>
<div class="row" id="r1"></div><div class="row r2" id="r2"></div></section>''','''
const icons=['<circle cx="12" cy="12" r="8"/>','<path d="M4 18 12 5l8 13z"/>','<rect x="5" y="5" width="14" height="14" rx="3"/>','<path d="M5 12h14M12 5v14"/>','<path d="M12 4c4 4 4 12 0 16-4-4-4-12 0-16z"/>','<path d="M4 12c4-6 12-6 16 0-4 6-12 6-16 0z"/>'];
const names=[['Northfield Farm',''],['Kettle & Co','serif'],['GRAIN/LAB','mono'],['Olive Row',''],['Ember','serif'],['MISE','mono'],['Salt Society',''],['Larder','serif'],['Brine Bros',''],['FORAGE','mono']];
const logo=([n,c],i)=>`<span class="logo ${c}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${icons[i%icons.length]}</svg>${n}</span>`;
[['r1',names.slice(0,5)],['r2',names.slice(5)]].forEach(([id,list])=>{const r=document.getElementById(id);const html=list.map(logo).join('');r.innerHTML=`<div class="track"><div style="display:flex;gap:16px">${html}</div><div style="display:flex;gap:16px" aria-hidden="true">${html}</div></div>`});
const pb=document.getElementById('lpause'),sec=document.getElementById('lsec');pb.onclick=()=>{const on=sec.classList.toggle('stopped');pb.setAttribute('aria-pressed',on);pb.textContent=on?'Play':'Pause'};''')

S['sec-cta']=('Film call-to-action banner','''
.band{position:relative;overflow:hidden;border-radius:calc(var(--radius) * 1.6);min-height:440px;display:grid;align-items:end;isolation:isolate}
.band video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.band::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(100deg,var(--bg) 8%,color-mix(in srgb,var(--bg) 70%,transparent) 45%,transparent 80%)}
.in{padding:clamp(28px,5vw,64px);max-width:640px;display:grid;gap:16px}
.in h2{font-size:clamp(40px,6vw,76px);margin:0}
.in p{margin:0;color:var(--mute);max-width:40ch;font-size:17px}
.row{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
.ctrl{position:absolute;right:16px;top:16px;width:44px;height:44px;border-radius:50%;border:0;background:color-mix(in srgb,var(--surface) 80%,transparent);cursor:pointer;display:grid;place-items:center}
.ctrl svg{width:16px;height:16px}
@media (max-width:640px){.band::before{background:linear-gradient(0deg,var(--bg) 25%,color-mix(in srgb,var(--bg) 60%,transparent) 65%,transparent)}.band{min-height:520px}}
''','''<section class="wrap"><div class="band"><video id="v" autoplay muted loop playsinline poster="../../assets/films/pigment-bloom.jpg"><source src="../../assets/films/pigment-bloom-720.webm" type="video/webm"><source src="../../assets/films/pigment-bloom-720.mp4" type="video/mp4"></video>
<button class="ctrl" id="pv" aria-label="Pause background film"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg></button>
<div class="in"><p class="k">Start this week</p><h2 class="h">Your first episode is one recipe away.</h2><p>Bring a dish you love. We’ll handle the chef, the shots and the colour.</p><div class="row"><a class="btn p" href="#">Start free</a><a class="btn" href="#">Watch a sample</a></div></div></div></section>''','''
document.querySelectorAll('a[href="#"]').forEach(a=>a.onclick=e=>e.preventDefault());
const v=document.getElementById('v'),pv=document.getElementById('pv');const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const play='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>',pause=pv.innerHTML;
function st(p){if(p){v.play().catch(()=>{});pv.innerHTML=pause;pv.setAttribute('aria-label','Pause background film')}else{v.pause();pv.innerHTML=play;pv.setAttribute('aria-label','Play background film')}}
if(reduce){v.removeAttribute('autoplay');st(false)}pv.onclick=()=>st(v.paused);''')

# Built into demos and the page builder by tools/blocks.py
