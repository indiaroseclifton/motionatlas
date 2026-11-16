HEAD='''<!doctype html><html lang="en" data-style="noir"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:ital,wght@1,500&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap">
<style>
/* Four interchangeable styles. Pick one with data-style on <html>, or delete the ones you don't need. */
:root,[data-style=noir]{{--bg:#16120F;--surface:#211B16;--ink:#F3EADB;--mute:#B3A592;--line:#3B3129;--accent:#E2A24A;--on-accent:#1A120A;--head:Fraunces,Georgia,serif;--body:'DM Sans',system-ui,sans-serif;--hw:400;--hs:normal;--radius:14px;--track:-.02em;color-scheme:dark}}
[data-style=paper]{{--bg:#F6F0E6;--surface:#FFFBF4;--ink:#231C15;--mute:#6A5D4E;--line:#E3D7C4;--accent:#9A5B12;--on-accent:#FFFFFF;--accent-ink:#8A520C;--head:Fraunces,Georgia,serif;--body:'DM Sans',system-ui,sans-serif;--hw:400;--hs:normal;--radius:14px;--track:-.02em;color-scheme:light}}
[data-style=studio]{{--bg:#F5F5F3;--surface:#FFFFFF;--ink:#16171B;--mute:#5E6270;--line:#E2E2DE;--accent:#16171B;--on-accent:#FFFFFF;--head:'Cormorant Garamond',Georgia,serif;--body:Inter,system-ui,sans-serif;--hw:500;--hs:italic;--radius:16px;--track:-.01em;color-scheme:light}}
[data-style=signal]{{--bg:#05070B;--surface:#0C1119;--ink:#EAF0F8;--mute:#93A0B4;--line:#1C2533;--accent:#7CF0FF;--on-accent:#04121A;--head:'Space Grotesk',Inter,sans-serif;--body:Inter,system-ui,sans-serif;--hw:500;--hs:normal;--radius:18px;--track:-.03em;color-scheme:dark}}
[data-style=clean]{{--bg:#FFFFFF;--surface:#F6F7F9;--ink:#101319;--mute:#5A6170;--line:#E4E7EC;--accent:#2452E6;--on-accent:#FFFFFF;--accent-ink:#1F47CC;--head:Inter,system-ui,sans-serif;--body:Inter,system-ui,sans-serif;--hw:600;--hs:normal;--radius:10px;--track:-.03em;color-scheme:light}}
[data-style=editorial]{{--bg:#FFFFFF;--surface:#F7F5F1;--ink:#141414;--mute:#5C5A55;--line:#DEDAD2;--accent:#B5301B;--on-accent:#FFFFFF;--accent-ink:#A62A16;--head:Newsreader,Georgia,serif;--body:Inter,system-ui,sans-serif;--hw:500;--hs:normal;--radius:2px;--track:-.02em;color-scheme:light}}
[data-style=soft]{{--bg:#F5F2FB;--surface:#FFFFFF;--ink:#1D1A2E;--mute:#5F5A75;--line:#E3DDF2;--accent:#6243D9;--on-accent:#FFFFFF;--accent-ink:#5636C7;--head:Outfit,system-ui,sans-serif;--body:'DM Sans',system-ui,sans-serif;--hw:500;--hs:normal;--radius:22px;--track:-.02em;color-scheme:light}}
[data-style=garden]{{--bg:#F2F5EC;--surface:#FBFCF8;--ink:#17241B;--mute:#526055;--line:#D8E0D0;--accent:#2B6642;--on-accent:#FFFFFF;--accent-ink:#265C3B;--head:Lora,Georgia,serif;--body:Inter,system-ui,sans-serif;--hw:500;--hs:normal;--radius:12px;--track:-.015em;color-scheme:light}}
[data-style=bold]{{--bg:#FFFFFF;--surface:#F3F3F1;--ink:#0B0B0C;--mute:#55555A;--line:#0B0B0C;--accent:#FFD43A;--on-accent:#0B0B0C;--accent-ink:#0B0B0C;--head:Archivo,system-ui,sans-serif;--body:Inter,system-ui,sans-serif;--hw:800;--hs:normal;--radius:0px;--track:-.035em;color-scheme:light}}
*{{box-sizing:border-box}}html,body{{margin:0}}
body{{background:var(--bg);color:var(--ink);font:17px/1.6 var(--body);-webkit-font-smoothing:antialiased;transition:background .3s,color .3s}}
a{{color:inherit}}button,input,textarea,select{{font:inherit;color:inherit}}
:focus-visible{{outline:2px solid var(--accent);outline-offset:3px}}
.h{{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);letter-spacing:var(--track);line-height:1;text-wrap:balance}}
.k{{font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--accent-ink,var(--accent))}}
.btn{{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:52px;padding:0 26px;border-radius:calc(var(--radius) * 3);border:1px solid var(--line);background:var(--surface);font-weight:600;font-size:16px;text-decoration:none;cursor:pointer;transition:transform .25s cubic-bezier(.2,.8,.2,1),background .2s,border-color .2s}}
.btn:hover{{transform:translateY(-2px);border-color:var(--ink)}}.btn:active{{transform:none}}
.btn.p{{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}}
.wrap{{max-width:1280px;margin:0 auto;padding:clamp(64px,12vh,140px) max(16px,4vw)}}
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
<article class="c c1"><img src="../../assets/photos/food-gluten-free-gnocchi.webp" alt=""><h3>Every dish, filmed like a still life</h3><p>Shot lists that frame hands, steam and the final plate the same way every time.</p></article>
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
const Q=[['The face never drifts.','Our chef looks the same in every shot now. Viewers stopped asking if it was a different person.','Ana Ruiz','Saffron Hour','food-gluten-free-gnocchi'],['Posting weekly, finally.','We went from one episode a month to one a week without hiring.','Tom Becker','Low & Slow','bakery-fresh-rustic-bread'],['Credits handled.','The rights check flagged two recipes we would have posted without credit.','Mei Lin','Dumpling Desk','food-handmade-pasta-noodles'],['It feels like us.','The house style is so consistent that people recognise our thumbnails before the name.','Kofi Mensah','Pepper Pot','cafe-copper-tea-kettles'],['Thumbnails that work.','Click-through went up a third after we switched to the shot-list framing.','Lucía Gómez','Mesa','cafe-coffee-in-montreal'],['Calmer edits.','Deadpan pacing sounded odd until we saw the retention curve.','Jonas Weber','Brot','bakery-loaves-of-bread'],['Our editor loves it.','Fewer notes, fewer reshoots, and the music no longer fights the knife sounds.','Priya Nair','Tadka','food-bread-on-the-table'],['Worth it for the bible.','The character bible alone saved a week of back-and-forth.','Sam Okoro','Jollof Lab','bakery-fresh-bread-and-butter']];
const card=([h,t,n,r,i])=>`<figure><span class="stars" aria-label="5 out of 5">★★★★★</span><blockquote><b>${h}</b>${t}</blockquote><figcaption><img src="../../assets/photos/${i}-640.webp" alt=""><div>${n}<span>${r}</span></div></figcaption></figure>`;
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
{{each:qa}}<details><summary>{{0}}<i aria-hidden="true"></i></summary><div class="a"><div><p>{{1}}</p></div></div></details>
{{/each}}</div></div></section>''','''
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
[data-style=paper] .err,[data-style=studio] .err,[data-style=clean] .err,[data-style=editorial] .err,[data-style=soft] .err,[data-style=garden] .err,[data-style=bold] .err{color:#B3261E}
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
<form id="f" novalidate action="{{formAction}}" method="post">
<div class="f"><label for="n">Your name</label><input id="n" name="n" autocomplete="name" required aria-describedby="ne"><span class="err" id="ne"></span></div>
<div class="f"><label for="e">Email</label><input id="e" name="e" type="email" autocomplete="email" required aria-describedby="ee"><span class="err" id="ee"></span></div>
<fieldset class="f w" style="border:0;padding:0;margin:0"><legend style="font-size:14px;font-weight:500;margin-bottom:6px">What do you need?</legend><div class="chips"><label><input type="checkbox" name="t" value="channel"><span>A new channel</span></label><label><input type="checkbox" name="t" value="episodes"><span>More episodes</span></label><label><input type="checkbox" name="t" value="style"><span>A house style</span></label><label><input type="checkbox" name="t" value="other"><span>Something else</span></label></div></fieldset>
<div class="f w"><label for="m">Message</label><textarea id="m" name="m" required aria-describedby="me"></textarea><span class="err" id="me"></span></div>
<div class="send"><button class="btn p" type="submit">Send message</button><span class="ok" id="ok" role="status"></span></div>
</form></div></section>''','''
const f=document.getElementById('f');const msg={n:'Please add your name.',e:'Please add an email address we can reply to.',m:'A sentence or two is enough.'};
function check(el){const id=el.id,bad=!el.value.trim()||(el.type==='email'&&!el.checkValidity());el.setAttribute('aria-invalid',bad);document.getElementById(id+'e').textContent=bad?(el.type==='email'&&el.value?'That email address doesn’t look right.':msg[id]):'';return !bad}
['n','e','m'].forEach(id=>document.getElementById(id).addEventListener('blur',e=>check(e.target)));
f.addEventListener('submit',e=>{e.preventDefault();const els=['n','e','m'].map(id=>document.getElementById(id));const ok=els.map(check).every(Boolean);if(!ok){els.find(x=>x.getAttribute('aria-invalid')==='true').focus();return}const a=f.getAttribute('action');if(a&&a!=='#'){if(/^mailto:/.test(a))f.enctype='text/plain';document.getElementById('ok').textContent='Sending…';f.submit();return}document.getElementById('ok').textContent='Thanks. This is a template, so nothing was sent.'});''')

S['sec-footer']=('Big wordmark footer','''
body{display:flex;flex-direction:column;min-height:100vh}
.spacer{flex:1;display:grid;place-items:center;color:var(--mute);padding:40px 16px;text-align:center}
footer{border-top:1px solid var(--line);background:var(--surface);overflow:hidden}
.in{max-width:1280px;margin:0 auto;padding:clamp(48px,8vh,80px) max(16px,4vw) 0}
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
''','''<section class="wrap"><div class="band"><video id="v" autoplay muted loop playsinline poster="../../assets/films/pigment-bloom.jpg"><source src="../../assets/films/pigment-bloom-720.mp4" type="video/mp4"><source src="../../assets/films/pigment-bloom-720.webm" type="video/webm"></video>
<button class="ctrl" id="pv" aria-label="Pause background film"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg></button>
<div class="in"><p class="k">Mixed to order</p><h2 class="h">Your colour, mixed by hand this week.</h2><p>Send a swatch, a photograph or a memory. We mix the pigment and post a tester within five days.</p><div class="row"><a class="btn p" href="#">Order a tester</a><a class="btn" href="#">See the colour chart</a></div></div></div></section>''','''
document.querySelectorAll('a[href="#"]').forEach(a=>a.onclick=e=>e.preventDefault());
const v=document.getElementById('v'),pv=document.getElementById('pv');const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const play='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>',pause=pv.innerHTML;
function st(p){if(p){v.play().catch(()=>{});pv.innerHTML=pause;pv.setAttribute('aria-label','Pause background film')}else{v.pause();pv.innerHTML=play;pv.setAttribute('aria-label','Play background film')}}
if(reduce){v.removeAttribute('autoplay');st(false)}pv.onclick=()=>st(v.paused);''')

# Built into demos and the page builder by tools/blocks.py


# ---------------------------------------------------------------------------------------------
# MORE: page-builder-only sections (no standalone demo). Same format as tools/blocks.py NEW:
# (id, name, group, description, css, html, js, fields, prompt)
# Field types: text, long, film, image (a path under assets/), list (one row per line, cells split by " | ").
# In html, {{each:key}}…{{/each}} repeats for every row of a list field; inside it {{0}}, {{1}}… are the
# cells, {{n}} is the 1-based row number and {{g0}} draws the glyph named in cell 0.
# ---------------------------------------------------------------------------------------------
NOHASH_M = "root.querySelectorAll('a[href=\"#\"]').forEach(a=>a.onclick=e=>e.preventDefault());"
REVEAL_JS = r'''const R=matchMedia('(prefers-reduced-motion: reduce)').matches;const items=root.querySelectorAll('[data-rv]');
if(R||!('IntersectionObserver' in window)){items.forEach(x=>x.classList.add('in'))}else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});items.forEach(x=>io.observe(x))}'''
REVEAL_CSS = '[data-rv]{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.8,.2,1)}[data-rv].in{opacity:1;transform:none}'
FILMV = '<video autoplay muted loop playsinline poster="{{A}}films/{{film}}.jpg"><source src="{{A}}films/{{film}}-720.mp4" type="video/mp4"><source src="{{A}}films/{{film}}-720.webm" type="video/webm"></video>'
FILM_CTRL_CSS = '.ctrl{position:absolute;right:14px;top:14px;width:44px;height:44px;border-radius:50%;border:0;background:color-mix(in srgb,var(--surface) 82%,transparent);color:var(--ink);cursor:pointer;display:grid;place-items:center;z-index:3}.ctrl svg{width:16px;height:16px}'
FILM_CTRL = '<button class="ctrl" aria-label="Pause film"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg></button>'
FILM_JS = r'''root.querySelectorAll('.ctrl').forEach(b=>{const v=b.parentNode.querySelector('video');if(!v)return;const pause=b.innerHTML,play='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>';
const st=p=>{if(p){v.play().catch(()=>{});b.innerHTML=pause;b.setAttribute('aria-label','Pause film')}else{v.pause();b.innerHTML=play;b.setAttribute('aria-label','Play film')}};
if(matchMedia('(prefers-reduced-motion: reduce)').matches){v.removeAttribute('autoplay');st(false)}b.onclick=()=>st(v.paused)});'''

MORE = [
 ('announce', 'Announcement bar', 'Navigation', 'A slim accent strip above everything with one line of news and a link.', '''
.ann{background:var(--accent);color:var(--on-accent);text-align:center;font-size:14px;font-weight:500;padding:9px 16px}
.ann a{color:inherit;font-weight:600;margin-left:8px;text-underline-offset:3px}''',
  '<div class="ann" role="note">{{text}}<a href="#">{{link}} →</a></div>', NOHASH_M,
  [('text', 'Message', 'text', 'Spring menu is live: twelve new recipes, filmed this month.'), ('link', 'Link text', 'text', 'See what’s new')],
  'A slim full-width bar in the accent colour with one centred line of news and an underlined link.'),

 ('nav-center', 'Centred navigation', 'Navigation', 'Brand in the middle, links either side, and a menu button that opens a panel on phones.', '''
.bar{background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.in{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:20px;padding:12px max(16px,4vw)}
.l,.r{display:flex;gap:22px;font-size:15px}.r{justify-content:flex-end;align-items:center}
.l a,.r a:not(.btn){text-decoration:none;color:var(--mute)}.l a:hover,.r a:not(.btn):hover{color:var(--ink)}
.logo{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:28px;letter-spacing:var(--track);text-decoration:none;text-align:center}
.menu{display:none;width:44px;height:44px;border-radius:12px;border:1px solid var(--line);background:var(--surface);cursor:pointer;place-items:center}
.menu svg{width:20px;height:20px}
.panel{display:none;padding:8px max(16px,4vw) 18px;border-top:1px solid var(--line)}
.panel a{display:block;padding:12px 0;text-decoration:none;border-bottom:1px solid var(--line)}
.panel.open{display:block}
@media (max-width:760px){.in{grid-template-columns:auto 1fr auto}.l,.r a:not(.btn){display:none}.menu{display:grid}.logo{text-align:left}.r .btn{display:none}}''',
  '<header class="bar"><div class="in"><nav class="l" aria-label="Primary">{{menuL}}</nav><a class="logo" href="{{home}}">{{brand}}</a><div class="r">{{menuR}}<a class="btn p" href="{{ctaHref}}">{{cta}}</a><button class="menu" aria-expanded="false" aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div></div><nav class="panel" aria-label="Menu">{{menu}}<a href="{{ctaHref}}">{{cta}}</a></nav></header>',
  NOHASH_M + "const m=root.querySelector('.menu'),p=root.querySelector('.panel');m.onclick=()=>{const o=m.getAttribute('aria-expanded')!=='true';m.setAttribute('aria-expanded',o);m.setAttribute('aria-label',o?'Close menu':'Open menu');p.classList.toggle('open',o)};",
  [('cta', 'Button', 'text', 'Get in touch'), ('ctaHref', 'Button links to', 'link', '')],
  'A sticky three-column header: two links on the left, the brand name centred in the heading font, a link and accent button on the right; on phones a menu button toggles a stacked link panel.'),

 ('hero-center', 'Centred hero', 'Heroes', 'A centred headline with a news pill, two buttons and a row of faces with a line of proof.', '''
.hc{max-width:980px;margin:0 auto;text-align:center;padding:clamp(72px,14vh,150px) max(16px,4vw) clamp(56px,10vh,110px);display:grid;justify-items:center;gap:22px}
.pill{display:inline-flex;gap:10px;align-items:center;padding:6px 14px 6px 6px;border-radius:999px;border:1px solid var(--line);background:var(--surface);font-size:14px;text-decoration:none}
.pill b{background:var(--accent);color:var(--on-accent);border-radius:999px;padding:3px 10px;font-size:12px}
.hc h1{font-size:clamp(44px,7.6vw,104px);margin:0}
.hc p.l{margin:0;max-width:52ch;color:var(--mute);font-size:clamp(16px,1.6vw,20px)}
.row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.proof{display:flex;align-items:center;gap:12px;color:var(--mute);font-size:14px;flex-wrap:wrap;justify-content:center}
.faces{display:flex}.faces i{width:34px;height:34px;border-radius:50%;border:2px solid var(--bg);margin-left:-8px;background:linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 30%,var(--surface)))}
.faces i:nth-child(2){background:linear-gradient(135deg,var(--mute),var(--surface))}.faces i:nth-child(3){background:linear-gradient(135deg,var(--ink),var(--accent))}.faces i:first-child{margin-left:0}''',
  '<section class="hc"><a class="pill" href="#"><b>{{badge}}</b>{{news}}</a><h1 class="h">{{heading}}</h1><p class="l">{{intro}}</p><div class="row"><a class="btn p" href="#">{{b1}}</a><a class="btn" href="#">{{b2}}</a></div><p class="proof"><span class="faces" aria-hidden="true"><i></i><i></i><i></i></span>{{proof}}</p></section>',
  NOHASH_M, [('badge', 'Pill label', 'text', 'New'), ('news', 'Pill text', 'text', 'Shared shopping lists are here'), ('heading', 'Headline', 'text', 'Dinner, planned in the time it takes to boil water.'), ('intro', 'Intro', 'long', 'Pick three recipes, and the week’s shopping list writes itself, sorted by aisle and scaled to how many you’re feeding.'), ('b1', 'Main button', 'text', 'Plan this week'), ('b2', 'Second button', 'text', 'See a sample week'), ('proof', 'Proof line', 'text', 'Used by 48,000 home cooks every Sunday')],
  'A centred hero: a pill link with a small accent badge, a very large balanced headline, a muted intro, two buttons and a proof line beside three overlapping round avatars.'),

 ('hero-kinetic', 'Kinetic type hero', 'Heroes', 'A huge headline whose last word cycles through a list, rolling up like a split-flap.', '''
.kh{max-width:1280px;margin:0 auto;padding:clamp(80px,16vh,170px) max(16px,4vw) clamp(56px,10vh,110px);display:grid;gap:26px}
.kh h1{font-size:clamp(46px,9vw,140px);margin:0;line-height:.98}
.roll{display:inline-grid;vertical-align:bottom;overflow:hidden;height:1.06em;color:var(--accent-ink,var(--accent))}
.roll span{grid-area:1/1;white-space:nowrap;transform:translateY(105%);transition:transform .7s cubic-bezier(.7,0,.2,1)}
.roll span.on{transform:none}.roll span.out{transform:translateY(-105%)}
.kh p{margin:0;max-width:48ch;color:var(--mute);font-size:clamp(16px,1.6vw,20px)}
.row{display:flex;gap:10px;flex-wrap:wrap}''',
  '<section class="kh"><p class="k">{{kicker}}</p><h1 class="h">{{lead}}<br><span class="roll" aria-hidden="true">{{each:words}}<span>{{0}}</span>{{/each}}</span><span class="sr" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">{{words}}</span></h1><p>{{intro}}</p><div class="row"><a class="btn p" href="#">{{b1}}</a><a class="btn" href="#">{{b2}}</a></div></section>',
  NOHASH_M + r'''const W=[...root.querySelectorAll('.roll span')];if(!W.length)return;let i=0;W[0].classList.add('on');

if(matchMedia('(prefers-reduced-motion: reduce)').matches||W.length<2)return;
setInterval(()=>{const a=W[i];i=(i+1)%W.length;const b=W[i];a.classList.remove('on');a.classList.add('out');b.classList.remove('out');b.style.transition='none';b.style.transform='translateY(105%)';b.offsetWidth;b.style.transition='';b.style.transform='';b.classList.add('on');setTimeout(()=>a.classList.remove('out'),750)},2200);''',
  [('kicker', 'Kicker', 'text', 'Independent design studio'), ('lead', 'Fixed words', 'text', 'We design brands that feel'), ('words', 'Rolling words', 'list', 'patient\nprecise\nwarm\nunmistakable'), ('intro', 'Intro', 'long', 'Identity, packaging and websites for food, craft and hospitality companies who care how things are made.'), ('b1', 'Main button', 'text', 'See our work'), ('b2', 'Second button', 'text', 'Start a project')],
  'A left-aligned hero with an enormous headline whose final word rolls vertically through a list every two seconds (slot-machine style, overflow hidden, accent colour); static first word under reduced motion; the full word list is available to screen readers.'),

 ('hero-3d', '3D card stack hero', 'Heroes', 'Copy on the left, three image cards fanned in 3D on the right that tilt towards the pointer.', '''
.h3{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,64px);align-items:center;max-width:1280px;margin:0 auto;padding:clamp(56px,12vh,130px) max(16px,4vw)}
.h3 h1{font-size:clamp(42px,6.4vw,90px);margin:12px 0 18px}
.h3 p.l{color:var(--mute);font-size:18px;max-width:42ch;margin:0 0 26px}
.row{display:flex;gap:10px;flex-wrap:wrap}
.stage{perspective:1200px;height:clamp(340px,44vw,520px);position:relative}
.rig{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .25s ease-out;transform:rotateY(-18deg) rotateX(8deg)}
.card{position:absolute;width:56%;aspect-ratio:4/5;top:8%;left:22%;border-radius:calc(var(--radius) * 1.3);overflow:hidden;box-shadow:0 40px 70px -30px rgba(0,0,0,.6);border:1px solid var(--line);background:var(--surface)}
.card img{width:100%;height:100%;object-fit:cover;display:block}
.card:nth-child(1){transform:translateZ(-120px) translateX(-34%) rotate(-8deg)}
.card:nth-child(2){transform:translateZ(-40px) translateX(30%) rotate(6deg)}
.card:nth-child(3){transform:translateZ(60px)}
@media (max-width:820px){.h3{grid-template-columns:1fr}.stage{height:380px}}''',
  '<section class="h3"><div><p class="k">{{kicker}}</p><h1 class="h">{{heading}}</h1><p class="l">{{intro}}</p><div class="row"><a class="btn p" href="#">{{b1}}</a><a class="btn" href="#">{{b2}}</a></div></div><div class="stage" aria-hidden="true"><div class="rig"><div class="card"><img src="{{A}}{{img1}}" alt="" loading="lazy"></div><div class="card"><img src="{{A}}{{img2}}" alt="" loading="lazy"></div><div class="card"><img src="{{A}}{{img3}}" alt="" loading="lazy"></div></div></div></section>',
  NOHASH_M + r'''if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const s=root.querySelector('.stage'),r=root.querySelector('.rig');
s.parentNode.addEventListener('pointermove',e=>{const b=s.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;r.style.transform=`rotateY(${-18+x*22}deg) rotateX(${8-y*16}deg)`});
s.parentNode.addEventListener('pointerleave',()=>{r.style.transform=''});''',
  [('kicker', 'Kicker', 'text', 'Collection 04'), ('heading', 'Headline', 'text', 'Objects with a little weather in them.'), ('intro', 'Intro', 'long', 'Glazes that pool, crackle and run. Every piece is thrown, fired and photographed in our Leeds studio.'), ('b1', 'Main button', 'text', 'Shop the collection'), ('b2', 'Second button', 'text', 'Visit the studio'), ('img1', 'Back card image', 'image', 'photos/hands-black-and-white-pottery.webp'), ('img2', 'Middle card image', 'image', 'photos/hands-pottery-wheel.webp'), ('img3', 'Front card image', 'image', 'photos/hands-making-pottery.webp')],
  'A two-column hero: copy and buttons on the left; on the right three 4:5 image cards layered in CSS 3D (preserve-3d, translateZ offsets, slight rotations) inside a perspective stage that tilts towards the pointer and rests when it leaves; still under reduced motion.'),

 ('hero-video', 'Video showcase hero', 'Heroes', 'A centred headline above a large rounded film frame, like a product reveal.', '''
.hv{max-width:1280px;margin:0 auto;padding:clamp(64px,12vh,130px) max(16px,4vw) clamp(40px,8vh,80px);display:grid;gap:22px;justify-items:center;text-align:center}
.hv h1{font-size:clamp(40px,6.6vw,92px);margin:0;max-width:16ch}
.hv p.l{margin:0;max-width:54ch;color:var(--mute);font-size:18px}
.row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.frame{position:relative;width:100%;margin-top:18px;aspect-ratio:16/9;border-radius:calc(var(--radius) * 2);overflow:hidden;background:var(--surface);border:1px solid var(--line);box-shadow:0 50px 100px -50px rgba(0,0,0,.6)}
.frame video{width:100%;height:100%;object-fit:cover;display:block}
''' + FILM_CTRL_CSS,
  '<section class="hv"><p class="k">{{kicker}}</p><h1 class="h">{{heading}}</h1><p class="l">{{intro}}</p><div class="row"><a class="btn p" href="#">{{b1}}</a><a class="btn" href="#">{{b2}}</a></div><div class="frame">' + FILMV + FILM_CTRL + '</div></section>',
  NOHASH_M + FILM_JS,
  [('film', 'Film', 'film', 'light-mesh'), ('kicker', 'Kicker', 'text', 'Meet Loom 2'), ('heading', 'Headline', 'text', 'Every thread of the project, in one view.'), ('intro', 'Intro', 'long', 'Loom gathers briefs, files and feedback into a single timeline, so nobody asks where the latest version is.'), ('b1', 'Main button', 'text', 'Try it free'), ('b2', 'Second button', 'text', 'Watch the tour')],
  'A centred hero with kicker, headline, intro and two buttons, followed by a full-width 16:9 rounded frame playing a muted looping film with a pause button and a long soft shadow.'),

 ('feature-grid', 'Feature grid', 'Features', 'Six features in a three-column grid, each with an icon, a title and a sentence.', '''
.fg h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 14px;max-width:18ch}
.fg .intro{color:var(--mute);max-width:56ch;margin:0 0 40px;font-size:17px}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;list-style:none;margin:0;padding:0}
.grid li{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:24px;display:grid;gap:10px;align-content:start}
.ico{width:44px;height:44px;border-radius:calc(var(--radius) * .7);display:grid;place-items:center;background:color-mix(in srgb,var(--accent) 16%,var(--surface));color:var(--accent-ink,var(--accent))}
.ico svg{width:22px;height:22px}
.grid h3{margin:4px 0 0;font-size:18px}.grid p{margin:0;color:var(--mute);font-size:15px}
@media (max-width:860px){.grid{grid-template-columns:1fr 1fr}}@media (max-width:560px){.grid{grid-template-columns:1fr}}
''' + REVEAL_CSS,
  '<section class="wrap fg"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><p class="intro">{{intro}}</p><ul class="grid">{{each:items}}<li data-rv><span class="ico" aria-hidden="true">{{g0}}</span><h3>{{1}}</h3><p>{{2}}</p></li>{{/each}}</ul></section>',
  REVEAL_JS,
  [('kicker', 'Kicker', 'text', 'Features'), ('heading', 'Headline', 'text', 'Small tools that save whole evenings.'), ('intro', 'Intro', 'long', 'Everything here came from a request in our community forum, and most of it took one afternoon to build.'),
   ('items', 'Features (icon | title | text)', 'list', 'clock | Cook-time planner | Tells you when to start each dish so everything lands on the table together.\nlist | Aisle-sorted lists | Your shopping list follows the layout of the shop you pick.\nusers | Shared kitchens | Plan with the people you live with; changes appear on every phone.\nscale | Scale any recipe | Feeding two or twelve, quantities and timings adjust as you type.\nleaf | Seasonal swaps | Out-of-season ingredient? We suggest one that’s cheaper this week.\nbell | Gentle reminders | A nudge to defrost, soak or marinate the night before.')],
  'A section heading and intro over a three-column grid of six feature cards (two columns on tablets, one on phones), each with an icon in a soft accent tile, a bold title and one muted sentence; cards fade up as they enter the viewport.'),

 ('feature-rows', 'Alternating features', 'Features', 'Three image-and-text rows that alternate sides, for explaining a product step by step.', '''
.fr{display:grid;gap:clamp(48px,8vw,96px)}
.fr h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 0;max-width:18ch}
.row{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,72px);align-items:center}
.row:nth-of-type(even) .pic{order:2}
.pic{aspect-ratio:5/4;border-radius:calc(var(--radius) * 1.4);overflow:hidden;background:var(--surface);border:1px solid var(--line)}
.pic img{width:100%;height:100%;object-fit:cover;display:block}
.row h3{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);letter-spacing:var(--track);font-size:clamp(26px,3vw,38px);line-height:1.1;margin:8px 0 12px}
.row p{margin:0;color:var(--mute);font-size:17px;max-width:44ch}
.num{font-size:13px;font-weight:600;color:var(--accent-ink,var(--accent))}
@media (max-width:760px){.row{grid-template-columns:1fr}.row:nth-of-type(even) .pic{order:0}}
''' + REVEAL_CSS,
  '<section class="wrap fr"><div><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2></div>{{each:rows}}<div class="row" data-rv><div class="pic"><img src="{{A}}{{2}}" alt="{{0}}" loading="lazy"></div><div><span class="num">0{{n}}</span><h3>{{0}}</h3><p>{{1}}</p></div></div>{{/each}}</section>',
  REVEAL_JS,
  [('kicker', 'Kicker', 'text', 'How it’s made'), ('heading', 'Headline', 'text', 'From a sketch to your shelf in three weeks.'),
   ('rows', 'Rows (title | text | image)', 'list', 'Drawn by hand | Every piece starts as a pencil drawing at full size, pinned to the studio wall for a few days before we commit. | photos/workspace-books-pencils-laptop-and-iphon.webp\nThrown and trimmed | Bodies are thrown on the wheel, left to firm overnight, then trimmed so the foot and rim feel right in the hand. | photos/hands-pottery-wheel.webp\nGlazed and fired twice | A bisque firing, then glaze and a slow second firing to 1260°C. The kiln decides the last ten per cent. | photos/drink-blue-coffee-cup.webp')],
  'A sequence of two-column rows, image and text alternating sides each row (stacked on phones), each with a small accent step number, a serif subheading and a muted paragraph; rows fade up on scroll.'),

 ('steps', 'How it works', 'Features', 'Three or four numbered steps joined by a line, for showing a simple process.', '''
.st h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 40px;max-width:18ch}
.st ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:22px;counter-reset:s;position:relative}
.st li{counter-increment:s;position:relative;padding-top:64px}
.st li::before{content:counter(s);position:absolute;top:0;left:0;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:var(--on-accent);font-weight:600;z-index:1}
.st li::after{content:"";position:absolute;top:23px;left:56px;right:-12px;height:1px;background:var(--line)}
.st li:last-child::after{display:none}
.st h3{margin:0 0 8px;font-size:19px}.st p{margin:0;color:var(--mute)}''',
  '<section class="wrap st"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><ol>{{each:steps}}<li><h3>{{0}}</h3><p>{{1}}</p></li>{{/each}}</ol></section>', '',
  [('kicker', 'Kicker', 'text', 'How it works'), ('heading', 'Headline', 'text', 'Three steps, then dinner.'),
   ('steps', 'Steps (title | text)', 'list', 'Pick your recipes | Choose three to five dishes from this week’s menu, or add your own.\nGet one list | We merge the ingredients, remove what you already have and sort by aisle.\nCook in order | Each evening opens with what to start first, timed to your oven.')],
  'A heading over three or four columns of steps, each with a filled accent circle holding its number, joined by a thin horizontal line, then a bold title and a muted sentence.'),

 ('stats', 'Stats band', 'Proof', 'Four big numbers that count up when they come into view.', '''
.sb{border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.sb ul{list-style:none;margin:0 auto;padding:clamp(40px,8vh,80px) max(16px,4vw);max-width:1280px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}
.sb li{min-width:0}.sb b{display:block;font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);letter-spacing:var(--track);font-size:clamp(32px,4.4vw,64px);line-height:1.05;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
.sb span{color:var(--mute);font-size:15px}
@media (max-width:760px){.sb ul{grid-template-columns:1fr 1fr}}''',
  '<section class="sb" aria-label="{{label}}"><ul>{{each:stats}}<li><b data-n>{{0}}</b><span>{{1}}</span></li>{{/each}}</ul></section>',
  r'''const N=[...root.querySelectorAll('[data-n]')];if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
N.forEach(el=>{const t=el.textContent,m=t.match(/[\d.,]+/);if(!m)return;const target=parseFloat(m[0].replace(/,/g,'')),dec=(m[0].split('.')[1]||'').length,comma=m[0].includes(',');
 const fmt=v=>t.replace(m[0],comma?v.toLocaleString('en',{minimumFractionDigits:dec,maximumFractionDigits:dec}):v.toFixed(dec));el.textContent=fmt(0);
 const io=new IntersectionObserver(es=>{if(!es[0].isIntersecting)return;io.disconnect();const t0=performance.now();const f=n=>{const p=Math.min(1,(n-t0)/1400),e=1-Math.pow(1-p,3);el.textContent=fmt(target*e);if(p<1)requestAnimationFrame(f);else el.textContent=t};requestAnimationFrame(f)});io.observe(el)});''',
  [('label', 'Section label (for screen readers)', 'text', 'In numbers'), ('stats', 'Stats (number | label)', 'list', '48,000 | cooks plan with us every week\n3.2 | hours saved per household, per week\n1,200 | recipes, each filmed and tested\n31 | countries with a Sunday list')],
  'A full-width band between two hairlines with four (two on phones) large tabular numbers in the heading font that count up from zero with an ease-out when scrolled into view, each over a muted label.'),

 ('quote', 'Featured quote', 'Proof', 'One large testimonial with the person’s name, role and an initial avatar.', '''
.q{max-width:980px;margin:0 auto;padding:clamp(72px,14vh,140px) max(16px,4vw);text-align:center;display:grid;gap:28px;justify-items:center}
.q svg{width:44px;height:44px;color:var(--accent-ink,var(--accent))}
.q blockquote{margin:0;font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);letter-spacing:var(--track);font-size:clamp(28px,4vw,52px);line-height:1.15;text-wrap:balance}
.who{display:flex;align-items:center;gap:14px;text-align:left}
.who .av{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:var(--on-accent);font-weight:600;font-size:18px}
.who b{display:block}.who span{color:var(--mute);font-size:14px}''',
  '<figure class="q"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.5 6C6.5 7.2 4.5 9.8 4.5 13.4V18h6v-6H7.6c.2-1.9 1.3-3.3 3.1-4.1zm9 0c-3 1.2-5 3.8-5 7.4V18h6v-6h-2.9c.2-1.9 1.3-3.3 3.1-4.1z"/></svg><blockquote>{{quote}}</blockquote><figcaption class="who"><span class="av" aria-hidden="true">{{initials}}</span><span><b>{{name}}</b><span>{{role}}</span></span></figcaption></figure>', '',
  [('quote', 'Quote', 'long', 'We stopped arguing about what’s for dinner. That alone was worth it; the shopping list is a bonus.'), ('name', 'Name', 'text', 'Priya Raman'), ('role', 'Role', 'text', 'Parent of three, Bristol'), ('initials', 'Initials', 'text', 'PR')],
  'A centred testimonial: an accent quotation mark, one very large balanced serif quote, then a caption with a round accent avatar holding initials, the name in bold and the role muted.'),

 ('logo-grid', 'Logo wall', 'Proof', 'A still grid of customer wordmarks, each set in a different type treatment.', '''
.lg{text-align:center}
.lg p.k{margin:0 0 26px}
.lg ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));border-top:1px solid var(--line);border-left:1px solid var(--line)}
.lg li{border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:30px 12px;display:grid;place-items:center;font-size:20px;color:var(--mute);min-height:96px}
.lg li:nth-child(4n+1){font-family:var(--head);font-style:italic}.lg li:nth-child(4n+2){font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:15px}
.lg li:nth-child(4n+3){font-family:ui-monospace,monospace;font-size:17px}.lg li:nth-child(4n){font-weight:600;letter-spacing:-.04em;font-size:22px}''',
  '<section class="wrap lg"><p class="k">{{kicker}}</p><ul>{{each:logos}}<li>{{0}}</li>{{/each}}</ul></section>', '',
  [('kicker', 'Kicker', 'text', 'Stocked by'), ('logos', 'Names (one per line)', 'list', 'Larder & Co\nNORTHFIELD\nfieldnotes.\nOrchard Hall\nTinsmith\nGREEN ROOM\nmarket.st\nHalden')],
  'A centred kicker over a ruled grid of customer names set as wordmarks in four alternating type treatments (italic serif, spaced capitals, monospace, tight bold) in the muted colour.'),

 ('compare', 'Comparison table', 'Sell', 'A feature-by-feature table of you against the usual alternative, with ticks and crosses.', '''
.cmp h2{font-size:clamp(32px,4.4vw,56px);margin:10px 0 30px;max-width:18ch}
.tw{position:relative;overflow-x:auto;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface)}
table{width:100%;border-collapse:collapse;min-width:520px;font-size:15px}
th,td{padding:16px 18px;text-align:left;border-bottom:1px solid var(--line)}
tbody tr:last-child th,tbody tr:last-child td{border-bottom:0}
thead th{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);font-weight:600}
thead th.us{color:var(--accent-ink,var(--accent))}
td{text-align:center;width:22%}thead th:not(:first-child){text-align:center}
td.us{background:color-mix(in srgb,var(--accent) 8%,transparent)}
.y,.n{position:relative;display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%}
.y{background:var(--accent);color:var(--on-accent)}.n{background:color-mix(in srgb,var(--mute) 22%,transparent);color:var(--mute)}
.y svg,.n svg{width:14px;height:14px}''',
  '<section class="wrap cmp"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><div class="tw" tabindex="0" role="region" aria-label="{{heading}}"><table><thead><tr><th scope="col">Feature</th><th scope="col" class="us">{{brand}}</th><th scope="col">{{them}}</th></tr></thead><tbody>{{each:rows}}<tr><th scope="row">{{0}}</th><td class="us">{{t1}}</td><td>{{t2}}</td></tr>{{/each}}</tbody></table></div></section>', '',
  [('kicker', 'Kicker', 'text', 'Compare'), ('heading', 'Headline', 'text', 'Why cooks switch from spreadsheets.'), ('them', 'Alternative’s name', 'text', 'Spreadsheet'),
   ('rows', 'Rows (feature | us yes/no | them yes/no)', 'list', 'Shopping list sorted by aisle | yes | no\nScales recipes for any number | yes | no\nShared with your household | yes | yes\nCooking timeline for each night | yes | no\nWorks offline in the shop | yes | yes\nSeasonal ingredient swaps | yes | no')],
  'A comparison table in a rounded scrollable card: a column for the feature, a highlighted column for the brand and one for the alternative; cells show a filled accent tick or a muted cross with screen-reader text.'),

 ('pricing-tiers', 'Pricing tiers', 'Sell', 'Two or three plans written as rows you edit, with one plan highlighted.', '''
.pt{text-align:center}
.pt h2{font-size:clamp(34px,4.6vw,60px);margin:10px auto 14px;max-width:18ch}
.pt .intro{color:var(--mute);max-width:52ch;margin:0 auto 44px}
.plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;text-align:left;align-items:start}
.plan{background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--radius) * 1.2);padding:28px;display:grid;gap:14px}
.plan:nth-child(2){border-color:var(--accent);box-shadow:0 30px 60px -36px color-mix(in srgb,var(--accent) 70%,transparent)}
.plan h3{margin:0;font-size:18px}.price{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:48px;line-height:1;letter-spacing:var(--track)}
.price small{font-family:var(--body);font-size:15px;color:var(--mute);font-style:normal}
.plan p{margin:0;color:var(--mute);font-size:15px}
.plan ul{margin:6px 0 8px;padding:0;list-style:none;display:grid;gap:8px;font-size:15px}
.plan li{display:flex;gap:10px}.plan li::before{content:"";flex:0 0 16px;height:16px;margin-top:4px;border-radius:50%;background:color-mix(in srgb,var(--accent) 22%,transparent);box-shadow:inset 0 0 0 4px var(--surface),inset 0 0 0 8px var(--accent)}
.plan .btn{width:100%}.plan:nth-child(2) .btn{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}''',
  '<section class="wrap pt"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><p class="intro">{{intro}}</p><div class="plans">{{each:plans}}<article class="plan"><h3>{{0}}</h3><div class="price">{{1}} <small>{{2}}</small></div><p>{{3}}</p><ul>{{list4}}</ul><a class="btn" href="#">{{5}}</a></article>{{/each}}</div></section>', NOHASH_M,
  [('kicker', 'Kicker', 'text', 'Plans'), ('heading', 'Headline', 'text', 'Simple prices, cancel any week.'), ('intro', 'Intro', 'long', 'Every plan includes the full recipe library. Pay monthly or save two months by paying yearly.'),
   ('plans', 'Plans (name | price | period | note | features; split; by; semicolons | button)', 'list', 'Solo | £0 | free forever | For one cook trying it out. | 3 recipes a week; Shopping list; Cook timeline | Start free\nHousehold | £6 | a month | For a home of up to six people. | Unlimited recipes; Shared lists; Seasonal swaps; Offline mode | Choose Household\nKitchen | £18 | a month | For cafés and cookery schools. | Everything in Household; 10 cooks; Costing per portion; Priority help | Talk to us')],
  'A centred heading over a row of plan cards (any number, wrapping), each with a name, a big price in the heading font with a small period, a note, a ticked feature list and a full-width button; the second plan has an accent border, glow and filled button.'),

 ('timeline', 'Timeline', 'Story', 'Milestones as dated rows on hairlines, revealed as you scroll. Good for a company story or a roadmap.', '''
.tl h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 40px;max-width:18ch}
.tl ol{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.tl li{display:grid;grid-template-columns:clamp(96px,16vw,240px) minmax(0,1fr) minmax(0,1.2fr);gap:6px 24px;align-items:baseline;padding:clamp(20px,3.2vh,34px) 0;border-bottom:1px solid var(--line)}
.tl time{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:clamp(26px,3.2vw,48px);letter-spacing:var(--track);line-height:1}
.tl h3{margin:0;font-size:clamp(19px,1.8vw,24px);line-height:1.2}.tl p{margin:0;color:var(--mute);font-size:17px;max-width:50ch}
@media (max-width:760px){.tl li{grid-template-columns:1fr}.tl time{font-size:26px}}
''' + REVEAL_CSS,
  '<section class="wrap tl"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><ol>{{each:events}}<li data-rv><time>{{0}}</time><h3>{{1}}</h3><p>{{2}}</p></li>{{/each}}</ol></section>', REVEAL_JS,
  [('kicker', 'Kicker', 'text', 'Our story'), ('heading', 'Headline', 'text', 'Eight years, one kitchen table.'),
   ('events', 'Events (date | title | text)', 'list', '2018 | A list on the fridge | Two flatmates start writing the week’s meals on a whiteboard and photographing it for the shop.\n2020 | The first app | Four hundred friends of friends use a scrappy web version through the first lockdown.\n2023 | Filmed recipes | We build a small studio and start filming every recipe in one take.\n2026 | Shared kitchens | Households plan together, and the list updates on every phone in real time.')],
  'A vertical timeline: a thin line down the left with an accent ring at each milestone, a small accent date, a bold title and a muted paragraph; milestones fade up as they scroll in.'),

 ('team', 'Team', 'Story', 'People in a grid with an initial avatar, name, role and one line about them.', '''
.tm h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 14px;max-width:18ch}
.tm .intro{color:var(--mute);max-width:56ch;margin:0 0 40px}
.tm ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:clamp(24px,4vw,64px);border-top:1px solid var(--line)}
.tm li{display:grid;grid-template-columns:64px minmax(0,1fr);column-gap:18px;row-gap:3px;align-content:start;padding:clamp(20px,3vh,30px) 0;border-bottom:1px solid var(--line)}
.tm .av{grid-row:1/span 3;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;font-family:var(--head);font-size:22px;color:var(--ink);background:color-mix(in srgb,var(--ink) 9%,var(--bg))}
.tm b{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);letter-spacing:var(--track);font-size:clamp(22px,2.2vw,30px);line-height:1.1}.tm li>span:not(.av){color:var(--accent-ink,var(--accent));font-size:14px;font-weight:500}.tm p{margin:6px 0 0;color:var(--mute);font-size:16px;max-width:44ch}
@media (max-width:760px){.tm ul{grid-template-columns:1fr}}''',
  '<section class="wrap tm"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><p class="intro">{{intro}}</p><ul>{{each:people}}<li><span class="av" aria-hidden="true">{{i0}}</span><b>{{0}}</b><span>{{1}}</span><p>{{2}}</p></li>{{/each}}</ul></section>', '',
  [('kicker', 'Kicker', 'text', 'The team'), ('heading', 'Headline', 'text', 'Eleven people, mostly in aprons.'), ('intro', 'Intro', 'long', 'Cooks, engineers and one very patient food stylist, split between London and Lisbon.'),
   ('people', 'People (name | role | line)', 'list', 'Maya Okafor | Head of food | Ran a supper club for six years; tests every recipe twice.\nTom Becker | Engineering | Built the first version on a train to Glasgow.\nInês Duarte | Film and photography | Lights every dish like a Dutch still life.\nSam Whitlock | Community | Reads every message in the forum, usually before breakfast.')],
  'A heading and intro over a responsive grid of person cards: a round gradient avatar with initials, name, an accent role and one muted line.'),

 ('gallery', 'Masonry gallery', 'Content', 'Images in a masonry layout; select one to view it large with its caption.', '''
.gl h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 30px;max-width:18ch}
.cols{columns:3 260px;column-gap:14px}
.cols button{display:block;width:100%;margin:0 0 14px;padding:0;border:0;border-radius:var(--radius);overflow:hidden;cursor:zoom-in;background:var(--surface);break-inside:avoid;position:relative}
.cols img{width:100%;display:block;transition:transform .5s}
.cols button:nth-child(3n+1) img{aspect-ratio:4/5;object-fit:cover}.cols button:nth-child(3n+2) img{aspect-ratio:1;object-fit:cover}.cols button:nth-child(3n) img{aspect-ratio:3/4;object-fit:cover}
.cols button:hover img{transform:scale(1.04)}
.cols span{position:absolute;left:10px;bottom:10px;right:10px;text-align:left;font-size:13px;color:#fff;text-shadow:0 1px 8px rgba(0,0,0,.7)}
dialog{border:0;padding:0;background:transparent;max-width:min(92vw,900px);color:#fff}
dialog::backdrop{background:rgba(0,0,0,.82)}
dialog img{max-width:100%;max-height:80vh;display:block;border-radius:var(--radius)}
dialog p{margin:10px 0 0;text-align:center}
dialog button{position:absolute;top:8px;right:8px;width:44px;height:44px;border-radius:50%;border:0;background:rgba(0,0,0,.6);color:#fff;font-size:20px;cursor:pointer}''',
  '<section class="wrap gl"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><div class="cols">{{each:images}}<button type="button" aria-label="View larger: {{1}}"><img src="{{A}}{{0}}" alt="{{1}}" loading="lazy"><span aria-hidden="true">{{1}}</span></button>{{/each}}</div><dialog aria-label="Image viewer"><img alt=""><p></p><button type="button" aria-label="Close">×</button></dialog></section>',
  r'''const d=root.querySelector('dialog');if(!d.showModal)return;const im=d.querySelector('img'),cap=d.querySelector('p');
root.querySelectorAll('.cols button').forEach(b=>b.onclick=()=>{const i=b.querySelector('img');im.src=i.src;im.alt=i.alt;cap.textContent=i.alt;d.showModal()});
d.querySelector('button').onclick=()=>d.close();d.onclick=e=>{if(e.target===d)d.close()};''',
  [('kicker', 'Kicker', 'text', 'Gallery'), ('heading', 'Headline', 'text', 'From the studio this season.'),
   ('images', 'Images (image | caption)', 'list', 'photos/hands-making-pottery.webp | Opening a bowl on the wheel\nphotos/drink-blue-coffee-cup.webp | Blue cup and tray\nphotos/hands-black-and-white-pottery.webp | Centring, both hands\nphotos/drink-frothy-coffee-in-a-green-cup.webp | Green cup and saucer\nphotos/hands-mud-games.webp | A small vase, nearly there\nphotos/drink-black-coffee-cup.webp | Black cup, gloss glaze\nphotos/hands-pottery-wheel.webp | Pulling up the walls\nphotos/food-latte-and-croissant.webp | Latte cup and side plate\nphotos/drink-coffee-flowers-and-books.webp | Cup and saucer by the window')],
  'A masonry gallery using CSS columns with mixed image ratios and captions over the image; each image is a button that opens a native dialog lightbox with the large image and its caption, closable with Escape, the × button or a backdrop click.'),

 ('blog', 'Article list', 'Content', 'Three article cards with an image, a tag, a date and a headline.', '''
.bl .top{display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap;margin-bottom:30px}
.bl h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 0;max-width:18ch}
.bl ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}
.bl a.card{display:grid;gap:12px;text-decoration:none}
.pic{aspect-ratio:16/10;border-radius:var(--radius);overflow:hidden;background:var(--surface)}
.pic img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}
a.card:hover img{transform:scale(1.04)}
.meta{display:flex;gap:10px;font-size:13px;color:var(--mute)}.meta b{color:var(--accent-ink,var(--accent));font-weight:600}
.bl h3{margin:0;font-size:21px;line-height:1.25}a.card:hover h3{text-decoration:underline;text-underline-offset:4px}''',
  '<section class="wrap bl"><div class="top"><div><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2></div><a class="btn" href="#">{{button}}</a></div><ul>{{each:posts}}<li><a class="card" href="#"><span class="pic"><img src="{{A}}{{3}}" alt="{{2}}" loading="lazy"></span><span class="meta"><b>{{0}}</b><span>{{1}}</span></span><h3>{{2}}</h3></a></li>{{/each}}</ul></section>', NOHASH_M,
  [('kicker', 'Kicker', 'text', 'Journal'), ('heading', 'Headline', 'text', 'Notes from the kitchen.'), ('button', 'Button', 'text', 'All articles'),
   ('posts', 'Posts (tag | date | title | image)', 'list', 'Technique | 12 March | Why we rest every loaf for as long as it baked | photos/bakery-fresh-rustic-bread.webp\nSeasonal | 4 March | Fresh pasta, and four things to do with it this month | photos/food-handmade-pasta-noodles.webp\nBehind the scenes | 26 Feb | How we plate a dish for the camera | photos/food-gluten-free-gnocchi.webp')],
  'A section header with a button on the right, then a responsive row of article cards: a 16:10 image that zooms slightly on hover, an accent tag and a date, and a two-line headline that underlines on hover.'),

 ('case-study', 'Case study', 'Story', 'A project write-up: a big image, the client and three results, then challenge and approach.', '''
.cs .pic{aspect-ratio:21/9;border-radius:calc(var(--radius) * 1.5);overflow:hidden;background:var(--surface);margin:24px 0 36px}
.cs .pic img{width:100%;height:100%;object-fit:cover;display:block}
.cs h2{font-size:clamp(34px,4.8vw,64px);margin:10px 0 0;max-width:20ch}
.res{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;list-style:none;margin:0 0 40px;padding:0}
.res li{border-top:2px solid var(--accent);padding-top:14px}.res b{display:block;font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:clamp(34px,4vw,52px);line-height:1}.res span{color:var(--mute);font-size:15px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,64px)}.two h3{margin:0 0 8px;font-size:15px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}.two p{margin:0;font-size:17px}
@media (max-width:720px){.res,.two{grid-template-columns:1fr}}''',
  '<section class="wrap cs"><p class="k">{{client}}</p><h2 class="h">{{heading}}</h2><div class="pic"><img src="{{A}}{{img}}" alt="{{alt}}" loading="lazy"></div><ul class="res">{{each:results}}<li><b>{{0}}</b><span>{{1}}</span></li>{{/each}}</ul><div class="two"><div><h3>The challenge</h3><p>{{challenge}}</p></div><div><h3>What we did</h3><p>{{approach}}</p></div></div></section>', '',
  [('client', 'Client', 'text', 'Case study · Wick & Hearth'), ('heading', 'Headline', 'text', 'A candle maker that finally looks like its candles.'), ('img', 'Image', 'image', 'photos/products-candle.webp'), ('alt', 'Image description', 'text', 'A lit candle in a dark glass with a typed paper label'),
   ('results', 'Results (number | label)', 'list', '+64% | online orders in the first quarter\n3 | new stockists in London\n12 days | from brief to launch'),
   ('challenge', 'Challenge', 'long', 'Wick & Hearth’s labels changed every season, and the website was a template nobody liked. Buyers didn’t recognise the candles on shelf.'),
   ('approach', 'Approach', 'long', 'We set one typewritten label from the founder’s first batch notes, built a label system around it and rebuilt the shop in a fortnight.')],
  'A case study section: client kicker, large headline, a 21:9 rounded image, three results each with an accent top rule, a big number and a muted label, then two columns for the challenge and the approach.'),

 ('cta-band', 'Call-to-action band', 'Endings', 'A full-width accent band with a headline and one button.', '''
.cb{background:var(--accent);color:var(--on-accent)}
.cb .in{max-width:1280px;margin:0 auto;padding:clamp(64px,13vh,150px) max(16px,4vw);display:grid;gap:clamp(24px,4vh,44px);justify-items:start}
.cb h2{margin:0;font-size:clamp(40px,7.4vw,112px);line-height:.96;max-width:14ch}
.cb .btn{background:var(--on-accent);color:var(--accent);border-color:var(--on-accent);min-height:60px;padding:0 34px;font-size:17px}''',
  '<section class="cb"><div class="in"><h2 class="h">{{heading}}</h2><a class="btn" href="#">{{button}}</a></div></section>', NOHASH_M,
  [('heading', 'Headline', 'text', 'Next Sunday, let the list write itself.'), ('button', 'Button', 'text', 'Start free')],
  'A full-width band in the accent colour with a large headline on the left and a reversed button (accent text on the on-accent colour) on the right, wrapping on phones.'),

 ('newsletter', 'Newsletter signup', 'Endings', 'An email form in a card, with inline validation and a thank-you message.', '''
.nl .card{background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--radius) * 1.5);padding:clamp(28px,5vw,56px);display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(20px,4vw,48px);align-items:center}
.nl h2{margin:10px 0 10px;font-size:clamp(30px,4vw,50px)}.nl p{margin:0;color:var(--mute)}
form{display:grid;gap:10px}.f{display:flex;gap:8px;flex-wrap:wrap}
label{font-size:14px;font-weight:500}
input{flex:1 1 220px;min-height:48px;padding:0 14px;border-radius:calc(var(--radius) * .7);border:1px solid var(--line);background:var(--bg)}
input[aria-invalid=true]{border-color:#C2410C}
.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}.hp input{min-height:0;flex:none}.msg{min-height:1.4em;font-size:14px;color:var(--mute)}.msg.err{color:color-mix(in srgb,#E5484D 70%,var(--ink))}
small{color:var(--mute);font-size:13px}
@media (max-width:760px){.nl .card{grid-template-columns:1fr}}''',
  '<section class="wrap nl"><div class="card"><div><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><p>{{intro}}</p></div><form action="{{formAction}}" method="post" name="newsletter" data-netlify="true" netlify-honeypot="_gotcha" novalidate><input type="hidden" name="form-name" value="newsletter"><p class="hp" aria-hidden="true"><label>Leave this empty <input name="_gotcha" tabindex="-1" autocomplete="off"></label></p><label for="nl-email">Email address</label><div class="f"><input id="nl-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" aria-describedby="nl-msg"><button class="btn p" type="submit">{{button}}</button></div><p class="msg" id="nl-msg" role="status"></p><small>{{small}}</small></form></div></section>',
  r'''const f=root.querySelector('form'),i=f.querySelector('input[type=email]'),m=f.querySelector('.msg');const uid=root.id||'nl';i.id=uid+'-email';f.querySelector('label[for]').htmlFor=i.id;m.id=uid+'-msg';i.setAttribute('aria-describedby',m.id);
const hp=f.querySelector('[name=_gotcha]'),btn=f.querySelector('button');
function send(done,fail){const a=f.getAttribute('action')||'#';if(hp&&hp.value){done();return}
 if(a==='#'||a===''){done();return}
 if(/^mailto:/i.test(a)){f.enctype='text/plain';f.submit();done('Opening your email app…');return}
 const net=a==='netlify';if(btn)btn.disabled=true;
 fetch(net?'/':a,{method:'POST',body:net?new URLSearchParams(new FormData(f)):new FormData(f),headers:net?{'Content-Type':'application/x-www-form-urlencoded'}:{Accept:'application/json'}}).then(r=>{if(!r.ok)throw new Error('send');done()}).catch(()=>fail()).finally(()=>{if(btn)btn.disabled=false})}
f.onsubmit=e=>{e.preventDefault();const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.trim());i.setAttribute('aria-invalid',!ok);m.classList.toggle('err',!ok);if(!ok){m.textContent='Enter an email address like name@example.com.';i.focus();return}
 m.textContent='Sending…';send(x=>{m.textContent=x||'Thanks. Check your inbox to confirm.';if(!x)f.reset()},()=>{m.classList.add('err');m.textContent='Sorry, that did not send. Please try again.'})};''',
  [('kicker', 'Kicker', 'text', 'Newsletter'), ('heading', 'Headline', 'text', 'One recipe, every Sunday morning.'), ('intro', 'Intro', 'long', 'A seasonal dish, the shopping list and the film, in one short email. No adverts, ever.'), ('button', 'Button', 'text', 'Subscribe'), ('small', 'Small print', 'text', 'Unsubscribe with one click. We never share your address.')],
  'A rounded card with copy on the left and an email form on the right: visible label, input and button on one row, inline validation with a specific error message, a success message in a live region, and small print.'),

 ('contact-cards', 'Contact options', 'Endings', 'Three ways to reach you, each in a card with an icon, details and a link.', '''
.cc h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 30px;max-width:18ch}
.cc ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}
.cc li{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:24px;display:grid;gap:8px}
.ico{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:var(--on-accent);margin-bottom:6px}.ico svg{width:20px;height:20px}
.cc h3{margin:0;font-size:18px}.cc p{margin:0;color:var(--mute)}.cc a{font-weight:600;color:var(--accent-ink,var(--accent));text-underline-offset:3px}''',
  '<section class="wrap cc"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><ul>{{each:ways}}<li><span class="ico" aria-hidden="true">{{g0}}</span><h3>{{1}}</h3><p>{{2}}</p><a href="#">{{3}}</a></li>{{/each}}</ul></section>', NOHASH_M,
  [('kicker', 'Kicker', 'text', 'Contact'), ('heading', 'Headline', 'text', 'Talk to a real person.'),
   ('ways', 'Ways (icon | title | text | link)', 'list', 'mail | Email | We answer within one working day, usually sooner. | hello@example.com\nphone | Phone | Weekdays 9 to 5, UK time. Ask for the kitchen. | +44 20 7946 0321\npin | Visit | 14 Market Row, London E8. Coffee is on us. | Get directions')],
  'A heading over three contact cards, each with a round accent icon, a title, a muted line and an accent link.'),

 ('app-download', 'App download', 'Endings', 'A phone mock-up showing a film, beside the pitch and two store buttons.', '''
.ad{display:grid;grid-template-columns:1fr auto;gap:clamp(28px,6vw,80px);align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--radius) * 2);padding:clamp(28px,6vw,72px);overflow:hidden}
.ad h2{font-size:clamp(32px,4.4vw,58px);margin:10px 0 14px;max-width:16ch}.ad p{color:var(--mute);margin:0 0 24px;max-width:44ch}
.stores{display:flex;gap:10px;flex-wrap:wrap}
.store{display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:0 18px;border-radius:12px;background:var(--ink);color:var(--bg);text-decoration:none;font-size:12px;line-height:1.1}
.store b{display:block;font-size:17px}.store svg{width:24px;height:24px}
.phone{position:relative;width:min(250px,60vw);aspect-ratio:9/19;border-radius:40px;padding:10px;background:var(--ink);box-shadow:0 40px 80px -30px rgba(0,0,0,.6);margin:-10px 0 -120px}
.phone video{width:100%;height:100%;object-fit:cover;border-radius:32px;display:block}
.phone::before{content:"";position:absolute;top:18px;left:50%;width:70px;height:20px;border-radius:12px;background:var(--ink);transform:translateX(-50%);z-index:2}
@media (max-width:760px){.ad{grid-template-columns:1fr}.phone{margin:0 auto -120px}}
''' + FILM_CTRL_CSS.replace('right:14px;top:14px', 'right:18px;top:44px'),
  '<section class="wrap"><div class="ad"><div><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><p>{{intro}}</p><div class="stores"><a class="store" href="#"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 12.6c0-2.5 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.2-.8-1.7 0-3.2 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-1-2.4-3.8zM14 5.2c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"/></svg><span>Download on the<b>App Store</b></span></a><a class="store" href="#"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 2.8v18.4c0 .4.4.7.8.5l15.9-9.2c.4-.2.4-.8 0-1L4.8 2.3c-.4-.2-.8.1-.8.5z"/></svg><span>Get it on<b>Google Play</b></span></a></div></div><div class="phone">' + FILMV + FILM_CTRL + '</div></div></section>',
  NOHASH_M + FILM_JS,
  [('film', 'Film on the screen', 'film', 'jellyfish'), ('kicker', 'Kicker', 'text', 'On your phone'), ('heading', 'Headline', 'text', 'The jellyfish tank, live in your pocket.'), ('intro', 'Intro', 'long', 'Twelve cameras across the aquarium, streaming all day. Pick a tank, turn the sound on and let it run.')],
  'A rounded surface card with the pitch and App Store / Google Play buttons on the left and a CSS phone mock-up on the right (dark bezel, notch) playing a looping film that hangs off the bottom edge.'),

 ('integrations', 'Integrations grid', 'Features', 'Tiles for the tools you connect to, each with a monogram, a name and a line.', '''
.ig{text-align:center}.ig h2{font-size:clamp(34px,4.6vw,60px);margin:10px auto 14px;max-width:18ch}.ig .intro{color:var(--mute);max-width:52ch;margin:0 auto 36px}
.ig ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;text-align:left}
.ig li{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:18px;display:grid;gap:4px;transition:border-color .2s,transform .2s}
.ig li:hover{border-color:var(--accent);transform:translateY(-2px)}
.ig .mono{width:40px;height:40px;border-radius:10px;display:grid;place-items:center;font-weight:700;background:color-mix(in srgb,var(--accent) 16%,var(--surface));color:var(--ink);margin-bottom:8px}
.ig b{font-size:16px}.ig span{color:var(--mute);font-size:14px}''',
  '<section class="wrap ig"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><p class="intro">{{intro}}</p><ul>{{each:tools}}<li><span class="mono" aria-hidden="true">{{i0}}</span><b>{{0}}</b><span>{{1}}</span></li>{{/each}}</ul></section>', '',
  [('kicker', 'Kicker', 'text', 'Integrations'), ('heading', 'Headline', 'text', 'Plays nicely with your kitchen.'), ('intro', 'Intro', 'long', 'Send lists to the shops you already use, and pull recipes in from anywhere.'),
   ('tools', 'Tools (name | line)', 'list', 'Ocado | Send the list straight to your basket\nTesco | Match items to your usual brands\nNotion | Keep a family recipe book\nGoogle Calendar | Put each dinner on the calendar\nAlexa | Add things by voice while you cook\nPaprika | Import your saved recipes\nSlack | Share the menu with the house\nApple Reminders | Sync the list both ways')],
  'A centred heading over a grid of small integration tiles, each with a monogram in a soft accent square, a name and a muted line, lifting slightly with an accent border on hover.'),

 ('tabs', 'Tabbed features', 'Features', 'Accessible tabs that switch a panel of text and an image, for features that need a closer look.', '''
.tb h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 28px;max-width:18ch}
[role=tablist]{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:22px}
[role=tab]{min-height:44px;padding:0 18px;border-radius:999px;border:1px solid var(--line);background:var(--surface);cursor:pointer;font-weight:500}
[role=tab][aria-selected=true]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
[role=tabpanel]{display:grid;grid-template-columns:1fr 1.2fr;gap:clamp(20px,4vw,56px);align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--radius) * 1.4);padding:clamp(18px,3vw,36px)}
[role=tabpanel][hidden]{display:none}
[role=tabpanel] h3{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:clamp(26px,3vw,38px);margin:0 0 10px;line-height:1.1}
[role=tabpanel] p{margin:0;color:var(--mute);font-size:17px}
.pic{aspect-ratio:4/3;border-radius:var(--radius);overflow:hidden;background:var(--bg)}.pic img{width:100%;height:100%;object-fit:cover;display:block}
@media (max-width:760px){[role=tabpanel]{grid-template-columns:1fr}}''',
  '<section class="wrap tb"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><div role="tablist" aria-label="{{heading}}">{{each:tabs}}<button role="tab" type="button">{{0}}</button>{{/each}}</div>{{each:tabs}}<div role="tabpanel" tabindex="0"><div><h3>{{1}}</h3><p>{{2}}</p></div><div class="pic"><img src="{{A}}{{3}}" alt="{{1}}" loading="lazy"></div></div>{{/each}}</section>',
  r'''const T=[...root.querySelectorAll('[role=tab]')],P=[...root.querySelectorAll('[role=tabpanel]')];const id=root.id||'tb';
T.forEach((t,i)=>{t.id=id+'-t'+i;P[i].id=id+'-p'+i;t.setAttribute('aria-controls',P[i].id);P[i].setAttribute('aria-labelledby',t.id)});
const pick=(i,f)=>{T.forEach((t,k)=>{t.setAttribute('aria-selected',k===i);t.tabIndex=k===i?0:-1;P[k].hidden=k!==i});if(f)T[i].focus()};pick(0);
T.forEach((t,i)=>{t.onclick=()=>pick(i);t.onkeydown=e=>{const n=T.length;let j=null;if(e.key==='ArrowRight')j=(i+1)%n;else if(e.key==='ArrowLeft')j=(i-1+n)%n;else if(e.key==='Home')j=0;else if(e.key==='End')j=n-1;if(j!=null){e.preventDefault();pick(j,true)}}});''',
  [('kicker', 'Kicker', 'text', 'A closer look'), ('heading', 'Headline', 'text', 'Built for the way you actually cook.'),
   ('tabs', 'Tabs (tab | title | text | image)', 'list', 'Plan | A week on one screen | Drag recipes onto nights, and see the prep for tomorrow before you go to bed. | photos/workspace-laptop-on-a-desk.webp\nShop | A list that follows the shop | Pick your supermarket and the list reorders itself to match the aisles. | photos/bakery-loaves-of-bread.webp\nCook | Timings that line up | Each dish gets a start time so the rice, the fish and the greens finish together. | photos/food-gluten-free-gnocchi.webp')],
  'A heading over pill tabs (WAI-ARIA tabs with arrow-key, Home and End support) that switch a rounded panel holding a serif subheading, a paragraph and a 4:3 image.'),

 ('marquee', 'Text marquee', 'Story', 'Huge words sliding across the page in a seamless loop, with a pause button.', '''
.mq{overflow:hidden;padding:clamp(28px,6vh,60px) 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);position:relative}
.track{display:flex;width:max-content;animation:mq 30s linear infinite}
.track span{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);letter-spacing:var(--track);font-size:clamp(48px,9vw,130px);line-height:1;white-space:nowrap;padding-right:.4em}
.track span:nth-child(even){color:transparent;-webkit-text-stroke:1.5px var(--ink)}
.track span i{font-style:normal;color:var(--accent);padding:0 .3em}
.mq.paused .track{animation-play-state:paused}
.pz{position:absolute;right:12px;bottom:8px;min-height:36px;padding:0 12px;border-radius:999px;border:1px solid var(--line);background:var(--surface);font-size:13px;cursor:pointer}
@keyframes mq{to{transform:translateX(-50%)}}''',
  '<section class="mq" aria-label="{{words}}"><div class="track" aria-hidden="true">{{each:words}}<span>{{0}}<i>✦</i></span>{{/each}}{{each:words}}<span>{{0}}<i>✦</i></span>{{/each}}</div><button class="pz" type="button" aria-pressed="false">Pause</button></section>',
  r'''const s=root.querySelector('.mq'),b=root.querySelector('.pz');const set=p=>{s.classList.toggle('paused',p);b.setAttribute('aria-pressed',p);b.textContent=p?'Play':'Pause'};b.onclick=()=>set(!s.classList.contains('paused'));if(matchMedia('(prefers-reduced-motion: reduce)').matches)set(true);''',
  [('words', 'Words (one per line)', 'list', 'Seasonal\nSlow-cooked\nShared\nFilmed in one take')],
  'A full-width band of very large words in the heading font, alternating solid and outlined, separated by accent stars, sliding left in a seamless CSS loop with a Pause button; paused under reduced motion.'),

 ('press', 'Press quotes', 'Proof', 'Three short quotes from publications, each with the outlet’s name.', '''
.pr ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(18px,3vw,40px)}
.pr li{display:grid;gap:14px;align-content:start;border-left:2px solid var(--accent);padding-left:18px}
.pr q{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:clamp(20px,2.2vw,28px);line-height:1.2;letter-spacing:var(--track)}
.pr b{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
@media (max-width:760px){.pr ul{grid-template-columns:1fr}}''',
  '<section class="wrap pr" aria-label="{{label}}"><ul>{{each:quotes}}<li><q>{{0}}</q><b>{{1}}</b></li>{{/each}}</ul></section>', '',
  [('label', 'Section label (for screen readers)', 'text', 'What the press said'),
   ('quotes', 'Quotes (quote | outlet)', 'list', 'The calmest cooking videos on the internet. | The Weekend Paper\nFinally, a meal planner that understands leftovers. | Kitchen Monthly\nQuietly brilliant, and beautifully filmed. | Food & Design Review')],
  'Three press quotes side by side (stacked on phones), each with an accent left rule, the quote in the heading font and the publication in small spaced capitals.'),

 ('rich-text', 'Text block', 'Content', 'A heading and a few paragraphs at a comfortable reading width, for about pages and policies.', '''
.rt{max-width:720px;margin:0 auto;padding:clamp(56px,10vh,100px) max(16px,4vw)}
.rt h2{font-size:clamp(32px,4.2vw,52px);margin:10px 0 22px}
.rt .body p{margin:0 0 1.1em;font-size:18px;line-height:1.7}.rt .body p:first-child::first-letter{font-family:var(--head);float:left;font-size:3.4em;line-height:.9;padding:4px 10px 0 0;color:var(--accent-ink,var(--accent))}''',
  '<section class="rt"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><div class="body">{{each:paras}}<p>{{0}}</p>{{/each}}</div></section>', '',
  [('kicker', 'Kicker', 'text', 'About'), ('heading', 'Headline', 'text', 'We started with one dish a week.'),
   ('paras', 'Paragraphs (one per line)', 'list', 'In 2018 two flatmates decided to cook properly four nights a week. It lasted nine days. The problem wasn’t time or skill; it was the forty small decisions between wanting dinner and having the ingredients in the house.\nSo we wrote them down: what to cook, what to buy, what to start first. The whiteboard became a spreadsheet, the spreadsheet became an app, and the app now plans dinner for forty-eight thousand households.\nWe still cook every recipe in our own kitchen before it goes out, and we still argue about how much garlic is too much.')],
  'A narrow, centred text section: kicker, heading and paragraphs at a comfortable 18px reading size, with a large accent drop cap on the first paragraph.'),

 ('image-full', 'Full-width image', 'Content', 'One wide image with a caption, as a pause between sections.', '''
.fi{margin:0;padding:clamp(24px,5vh,56px) max(16px,4vw)}
.fi .pic{max-width:1400px;margin:0 auto;aspect-ratio:21/9;border-radius:calc(var(--radius) * 1.5);overflow:hidden;background:var(--surface)}
.fi img{width:100%;height:100%;object-fit:cover;display:block}
.fi figcaption{max-width:1400px;margin:12px auto 0;color:var(--mute);font-size:14px}''',
  '<figure class="fi"><div class="pic"><img src="{{A}}{{img}}" alt="{{alt}}" loading="lazy"></div><figcaption>{{caption}}</figcaption></figure>', '',
  [('img', 'Image', 'image', 'photos/nature-mountain-lake.webp'), ('alt', 'Image description', 'text', 'A still mountain lake reflecting autumn trees and rocky peaks'), ('caption', 'Caption', 'text', 'The lake before breakfast, from our autumn walk in the mountains.')],
  'A full-width 21:9 rounded image with a small muted caption beneath.'),

 ('spacer', 'Spacer and divider', 'Content', 'Breathing room between sections, with an optional line or ornament.', '''
.sp{display:grid;place-items:center;padding:clamp(24px,6vh,64px) max(16px,4vw)}
.sp hr{width:min(1280px,100%);border:0;height:1px;background:var(--line);margin:0}
.sp p{margin:0;color:var(--accent);letter-spacing:.6em;font-size:14px}''',
  '<div class="sp" aria-hidden="true">{{ornament}}<hr></div>', r'''const p=root.querySelector('.sp');const t=p.firstChild;if(t&&t.nodeType===3&&t.textContent.trim()){const e=document.createElement('p');e.textContent=t.textContent;t.replaceWith(e);root.querySelector('hr').remove()}''',
  [('ornament', 'Ornament (leave empty for a line)', 'text', '')],
  'A spacer with a hairline across the content width, or a small centred accent ornament instead of the line.'),

 ('footer-columns', 'Column footer', 'Endings', 'Brand and a line, four link columns, social links and a legal row.', '''
.ft{border-top:1px solid var(--line);margin-top:clamp(40px,8vh,80px)}
.ft .in{max-width:1280px;margin:0 auto;padding:clamp(48px,8vh,80px) max(16px,4vw) 28px;display:grid;grid-template-columns:1.4fr repeat(3,1fr);gap:32px}
.ft .logo{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:30px;letter-spacing:var(--track);margin:0 0 10px}
.ft p{margin:0;color:var(--mute);max-width:32ch;font-size:15px}
.ft h3{margin:0 0 12px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);font-weight:600}
.ft ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}.ft ul a{text-decoration:none;font-size:15px}.ft ul a:hover{text-decoration:underline}
.legal{max-width:1280px;margin:0 auto;padding:18px max(16px,4vw) 32px;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;color:var(--mute);font-size:13px;border-top:1px solid var(--line)}
.soc{display:flex;gap:10px}.soc a{width:40px;height:40px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center}.soc svg{width:18px;height:18px}
@media (max-width:760px){.ft .in{grid-template-columns:1fr 1fr}.ft .in>div:first-child{grid-column:1/-1}}''',
  '<footer class="ft"><div class="in"><div><p class="logo">{{brand}}</p><p>{{line}}</p></div><div><h3>{{c1}}</h3><ul>{{each:links1}}<li><a href="#">{{0}}</a></li>{{/each}}</ul></div><div><h3>{{c2}}</h3><ul>{{each:links2}}<li><a href="#">{{0}}</a></li>{{/each}}</ul></div><div><h3>{{c3}}</h3><ul>{{each:links3}}<li><a href="#">{{0}}</a></li>{{/each}}</ul></div></div><div class="legal"><span>© 2026 {{brand}}. {{legal}}</span><span class="soc"><a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".8" fill="currentColor"/></svg></a><a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/></svg></a><a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 9h3v10H5zM6.5 4.5a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10 9h2.9v1.4c.4-.8 1.5-1.6 3-1.6 3.1 0 3.6 2 3.6 4.6V19h-3v-4.9c0-1.2 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5v5H10z"/></svg></a></span></div></footer>', NOHASH_M,
  [('line', 'Line under the brand', 'text', 'Seasonal recipes, filmed in one take, planned in one list.'), ('c1', 'Column 1 heading', 'text', 'Product'), ('links1', 'Column 1 links', 'list', 'Meal planner\nShopping list\nRecipes\nPricing'),
   ('c2', 'Column 2 heading', 'text', 'Company'), ('links2', 'Column 2 links', 'list', 'About\nJournal\nCareers\nPress'), ('c3', 'Column 3 heading', 'text', 'Help'), ('links3', 'Column 3 links', 'list', 'Questions\nContact\nPrivacy\nTerms'),
   ('legal', 'Legal line', 'text', 'Made in London and Lisbon.')],
  'A footer with the brand and a line on the left, three link columns, then a legal row with the copyright and three round outlined social icon links.'),
]

# ---- website-builder additions: inner-page heads, article, map, menu, schedule, shop, course, form, donate, countdown ----
MORE += [
 ('page-head', 'Page heading', 'Heroes', 'The top of an inner page: a kicker, the page headline and one line under it.', '''
.ph{padding-top:clamp(40px,8vh,96px);padding-bottom:clamp(24px,4vh,48px)}.ph .k{margin:0 0 clamp(16px,3vh,30px)}.ph h1{font-size:clamp(44px,8.6vw,136px);line-height:.95;margin:0;max-width:15ch}.ph p.l{color:var(--mute);font-size:clamp(18px,1.6vw,22px);line-height:1.45;margin:clamp(24px,4.4vh,48px) 0 0;padding:clamp(16px,2.4vh,24px) 0 0 50%;border-top:1px solid var(--line)}@media (max-width:760px){.ph p.l{padding-left:0}}''',
  '<section class="wrap ph"><p class="k">{{kicker}}</p><h1 class="h">{{heading}}</h1><p class="l">{{intro}}</p></section>', '',
  [('kicker', 'Kicker', 'text', 'About us'), ('heading', 'Headline', 'text', 'A small team with a long memory.'), ('intro', 'Intro', 'long', 'We started in a spare room and still answer every message ourselves.')],
  'A page header: small uppercase kicker, a very large balanced headline in the heading font and a muted one-line intro, generous space above.'),

 ('hero-image', 'Image hero', 'Heroes', 'Headline and buttons beside a tall framed image from the atlas or your own upload.', '''
.hi{display:grid;grid-template-columns:1.05fr 1fr;gap:clamp(28px,5vw,72px);align-items:center;max-width:1280px;margin:0 auto;padding:clamp(48px,9vh,100px) max(16px,4vw)}
.hi h1{font-size:clamp(42px,6vw,88px);margin:10px 0 18px}.hi p.l{color:var(--mute);font-size:18px;max-width:44ch;margin:0 0 26px}
.row{display:flex;gap:10px;flex-wrap:wrap}.hi figure{margin:0;aspect-ratio:4/5;border-radius:calc(var(--radius) * 1.6);overflow:hidden;background:var(--surface);box-shadow:0 40px 80px -44px rgba(0,0,0,.5)}.hi img{width:100%;height:100%;object-fit:cover;display:block}
@media (max-width:820px){.hi{grid-template-columns:1fr}.hi figure{aspect-ratio:4/3}}''',
  '<section class="hi"><div><p class="k">{{kicker}}</p><h1 class="h">{{heading}}</h1><p class="l">{{intro}}</p><div class="row"><a class="btn p" href="#">{{b1}}</a><a class="btn" href="#">{{b2}}</a></div></div><figure><img src="{{A}}{{img}}" alt="{{alt}}"></figure></section>', NOHASH_M,
  [('kicker', 'Kicker', 'text', 'Made by hand'), ('heading', 'Headline', 'text', 'Objects with a little weather in them.'), ('intro', 'Intro', 'long', 'Small-batch work, made slowly and shown honestly.'), ('b1', 'Main button', 'text', 'See the work'), ('b2', 'Second button', 'text', 'Get in touch'), ('img', 'Image', 'image', 'photos/hands-mud-games.webp'), ('alt', 'Image description', 'text', 'Clay-covered hands shaping a small pot on a wheel')],
  'A two-column hero: kicker, huge headline, muted intro and two buttons on the left; a tall rounded 4:5 photo on the right with a soft shadow. Stacks on phones.'),

 ('blog-post', 'Article', 'Content', 'A blog post template: headline, byline, a wide image, the story in paragraphs and an author box.', '''
.bp{max-width:780px}.bp h1{font-size:clamp(36px,5.2vw,68px);margin:10px 0 14px}.bp .meta{color:var(--mute);margin:0 0 28px;font-size:15px}
.bp figure{margin:0 0 32px;border-radius:calc(var(--radius) * 1.2);overflow:hidden;aspect-ratio:16/9;background:var(--surface)}.bp img{width:100%;height:100%;object-fit:cover;display:block}
.bp .body p,.bp .body li{font-size:18px;line-height:1.75;margin:0 0 1.2em;max-width:66ch}.bp .body h2{font-size:clamp(26px,3vw,36px);margin:1.6em 0 .5em}.bp .body h3{font-size:22px;margin:1.4em 0 .4em}.bp .body blockquote{margin:1.6em 0;padding:0 0 0 20px;border-left:3px solid var(--accent);font-family:var(--head);font-size:clamp(22px,2.6vw,30px);line-height:1.35}.bp .body blockquote p{font:inherit;margin:0}.bp .body ul{padding-left:1.2em;margin:0 0 1.2em}.bp .body figure.pf{margin:1.6em 0;aspect-ratio:auto}.bp .body figure.pf img{height:auto;border-radius:calc(var(--radius) * .8)}.bp .body figcaption{color:var(--mute);font-size:14px;margin-top:8px}
.by{display:flex;gap:16px;align-items:center;border-top:1px solid var(--line);margin-top:36px;padding-top:24px}.by .av{flex:0 0 52px;height:52px;border-radius:50%;display:grid;place-items:center;font-family:var(--head);font-size:20px;background:var(--accent);color:var(--on-accent)}.by p{margin:2px 0 0;color:var(--mute);font-size:15px}''',
  '<article class="wrap bp"><header><p class="k">{{tag}}</p><h1 class="h">{{heading}}</h1><p class="meta">{{author}} · {{date}} · {{read}}</p></header><figure><img src="{{A}}{{img}}" alt="{{alt}}"></figure><div class="body">{{rich:paras}}</div><footer class="by"><span class="av" aria-hidden="true">{{initials}}</span><div><b>{{author}}</b><p>{{bio}}</p></div></footer></article>', '',
  [('tag', 'Tag', 'text', 'Technique'), ('heading', 'Headline', 'text', 'Why we rest every loaf for as long as it baked'), ('author', 'Author', 'text', 'Maya Okafor'), ('date', 'Date', 'text', '12 March'), ('read', 'Reading time', 'text', '5 min read'), ('img', 'Image', 'image', 'photos/bakery-fresh-rustic-bread.webp'), ('alt', 'Image description', 'text', 'A rustic loaf on a wooden board beside a bread knife'),
   ('paras', 'Story (one block per line: ## heading, > quote, - list item, ![caption](image))', 'list', 'Resting bread is the oldest advice in the bakery and the least followed. The reason is simple: the crumb is still setting when a loaf leaves the oven, and a quiet hour lets the steam settle.\nWe tested it on forty loaves, cut at ten minutes, half an hour and an hour. The difference in what ended up on the board was not subtle.\nThe rule we settled on is easy to remember: rest for as long as it baked, on a rack, somewhere cool. Then slice.'), ('initials', 'Author initials', 'text', 'MO'), ('bio', 'Author line', 'text', 'Head of food. Ran a supper club for six years.')],
  'An article page: kicker tag, big headline, byline, a 16:9 image, paragraphs at a comfortable 66-character measure and an author box with an initials avatar.'),

 ('map-embed', 'Find us', 'Content', 'Address, opening hours and a map tile that opens the place in your maps app in a new tab.', '''
.mp .g{display:grid;grid-template-columns:1fr 1.2fr;gap:clamp(24px,4vw,56px);align-items:stretch}.mp h2{font-size:clamp(32px,4.2vw,54px);margin:10px 0 12px}.mp address{font-style:normal;color:var(--mute);margin:0 0 18px}
.mp ul{list-style:none;margin:0 0 22px;padding:0;display:grid;gap:6px}.mp li{display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid var(--line);padding:8px 0;font-size:15px}.mp li span{color:var(--mute)}
.tile{position:relative;min-height:320px;border-radius:calc(var(--radius) * 1.3);border:1px solid var(--line);overflow:hidden;display:grid;place-items:center;text-decoration:none;background:color-mix(in srgb,var(--accent) 7%,var(--surface))}
.tile::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 63px,var(--line) 63px 64px),repeating-linear-gradient(0deg,transparent 0 63px,var(--line) 63px 64px);opacity:.7}
.tile::after{content:"";position:absolute;left:-10%;right:-10%;top:48%;height:22px;background:color-mix(in srgb,var(--accent) 22%,var(--surface));transform:rotate(-14deg)}
.pin{position:relative;z-index:1;width:54px;height:54px;color:var(--accent)}.lbl{position:absolute;z-index:1;bottom:16px;left:16px;background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:8px 14px;font-size:14px;font-weight:600}
@media (max-width:820px){.mp .g{grid-template-columns:1fr}}''',
  '<section class="wrap mp"><div class="g"><div><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><address>{{address}}</address><ul>{{each:hours}}<li><span>{{0}}</span><b>{{1}}</b></li>{{/each}}</ul><a class="btn p" href="{{maplink}}" target="_blank" rel="noopener">{{button}}</a></div><a class="tile" href="{{maplink}}" target="_blank" rel="noopener" aria-label="Open the map in a new tab"><svg class="pin" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 22s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12zm0-9.2a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6z"/></svg><span class="lbl">Open in maps</span></a></div></section>', '',
  [('kicker', 'Kicker', 'text', 'Visit'), ('heading', 'Headline', 'text', 'Come and see us.'), ('address', 'Address', 'text', '14 Market Row, London E8 4RT'), ('hours', 'Opening hours (day | times)', 'list', 'Tuesday to Friday | 8am to 5pm\nSaturday | 9am to 4pm\nSunday | 10am to 2pm\nMonday | Closed'), ('button', 'Button', 'text', 'Get directions'), ('maplink', 'Map link', 'link', 'https://www.openstreetmap.org/search?query=London%20E8')],
  'A two-column section: heading, address, an opening-hours list with hairlines and a button on the left; on the right a stylised map tile (grid lines, a road band, a pin and an Open in maps chip) that links out to a maps site in a new tab.'),

 ('menu-list', 'Menu with prices', 'Sell', 'Two columns of dishes or services with a short description and a price each.', '''
.mn h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 30px;max-width:18ch}.mn .cols{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,72px)}
.mn h3{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:26px;margin:0 0 12px;padding-bottom:10px;border-bottom:2px solid var(--accent)}
.mn ul{list-style:none;margin:0;padding:0}.mn li{display:flex;justify-content:space-between;gap:20px;padding:14px 0;border-bottom:1px solid var(--line)}.mn li p{margin:3px 0 0;color:var(--mute);font-size:14.5px;max-width:42ch}.mn .pr{font-weight:600;white-space:nowrap}.mn .note{color:var(--mute);margin:26px 0 0;font-size:14px}
@media (max-width:820px){.mn .cols{grid-template-columns:1fr}}''',
  '<section class="wrap mn"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><div class="cols"><div><h3>{{h1}}</h3><ul>{{each:col1}}<li><div><b>{{0}}</b><p>{{1}}</p></div><span class="pr">{{2}}</span></li>{{/each}}</ul></div><div><h3>{{h2}}</h3><ul>{{each:col2}}<li><div><b>{{0}}</b><p>{{1}}</p></div><span class="pr">{{2}}</span></li>{{/each}}</ul></div></div><p class="note">{{note}}</p></section>', '',
  [('kicker', 'Kicker', 'text', 'The menu'), ('heading', 'Headline', 'text', 'Cooked on the day.'), ('h1', 'Left heading', 'text', 'To start'), ('col1', 'Left items (name | description | price)', 'list', 'Burnt aubergine | Tahini, pomegranate, warm flatbread | £9\nWhipped ricotta | Honey, thyme, charred sourdough | £8\nSmoked mackerel | Pickled cucumber, horseradish | £10'),
   ('h2', 'Right heading', 'text', 'To follow'), ('col2', 'Right items (name | description | price)', 'list', 'Slow lamb shoulder | Flageolet beans, salsa verde | £22\nRoast cauliflower | Almond, golden raisin, saffron | £17\nSea bream | Fennel, blood orange, olive oil | £24'), ('note', 'Note', 'text', 'Please tell us about allergies when you book. Service is not added to the bill.')],
  'A menu: kicker, headline, then two columns each with a serif heading underlined in the accent and rows of name, muted description and a right-aligned bold price, hairlines between rows; a small note below.'),

 ('schedule', 'Schedule', 'Content', 'An agenda: time, session, speaker and room, one row each.', '''
.sc h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 28px;max-width:18ch}.sc ol{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.sc li{display:grid;grid-template-columns:110px minmax(0,1fr) minmax(0,.7fr) auto;gap:18px;align-items:baseline;padding:18px 0;border-bottom:1px solid var(--line)}.sc time{font-family:var(--head);font-size:22px;color:var(--accent-ink,var(--accent))}.sc b{font-size:18px}.sc .sp,.sc .rm{color:var(--mute);font-size:15px}.sc .rm{border:1px solid var(--line);border-radius:999px;padding:3px 12px;white-space:nowrap}
@media (max-width:760px){.sc li{grid-template-columns:80px 1fr;gap:6px 14px}.sc .sp,.sc .rm{grid-column:2}.sc .rm{justify-self:start}}''',
  '<section class="wrap sc"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><ol>{{each:rows}}<li><time>{{0}}</time><b>{{1}}</b><span class="sp">{{2}}</span><span class="rm">{{3}}</span></li>{{/each}}</ol></section>', '',
  [('kicker', 'Kicker', 'text', 'Saturday 14 June'), ('heading', 'Headline', 'text', 'One day, five sessions.'), ('rows', 'Sessions (time | title | speaker | room)', 'list', '09:30 | Doors and coffee | The team | Foyer\n10:15 | Opening talk: small tools | Priya Nair | Main hall\n11:45 | Workshop: print and paper | Tom Becker | Studio 2\n14:00 | Panel: making a living | Four makers | Main hall\n16:30 | Drinks and demos | Everyone | Courtyard')],
  'An agenda list: kicker and headline above a hairline-ruled ordered list; each row has a serif accent time, a bold session title, a muted speaker and a pill with the room. Collapses to two columns on phones.'),

 ('product-grid', 'Product grid', 'Sell', 'Product cards with an image, a badge, a name and a price, each linking to its page.', '''
.pg h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 30px;max-width:18ch}.pg ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px}
.pc{display:grid;gap:8px;text-decoration:none;position:relative}.pc .pic{aspect-ratio:1;border-radius:var(--radius);overflow:hidden;background:var(--surface)}.pc img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}.pc:hover img{transform:scale(1.05)}
.pc .bd{position:absolute;left:10px;top:10px;background:var(--accent);color:var(--on-accent);border-radius:999px;font-size:12px;font-weight:600;padding:4px 10px}.pc .bd:empty{display:none}.pc b{font-size:17px}.pc .pr{color:var(--mute)}''',
  '<section class="wrap pg"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><ul>{{each:items}}<li><a class="pc" href="#"><span class="pic"><img src="{{A}}{{3}}" alt="{{0}}" loading="lazy"></span><span class="bd">{{2}}</span><b>{{0}}</b><span class="pr">{{1}}</span></a></li>{{/each}}</ul></section>', NOHASH_M,
  [('kicker', 'Kicker', 'text', 'The shop'), ('heading', 'Headline', 'text', 'Made in small batches.'), ('items', 'Products (name | price | badge | image)', 'list', 'Bottle-glass candle | £48 | New | photos/products-candle.webp\nBlue cup and tray | £62 |  | photos/drink-blue-coffee-cup.webp\nTealights, box of thirty | £35 | Last few | photos/products-burning-prayer-candles.webp\nGreen cup and saucer | £54 |  | photos/drink-frothy-coffee-in-a-green-cup.webp\nCopper kettle | £120 | Limited | photos/cafe-copper-tea-kettles.webp\nAmber jar candles | £40 |  | photos/products-diy-candles.webp')],
  'A shop grid: kicker and headline, then square product images with a hover zoom, an optional accent badge pill in the corner, the name and a muted price; each card is one link.'),

 ('curriculum', 'Course outline', 'Content', 'Numbered modules that open to show what is inside, with lesson counts and lengths.', '''
.cu h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 28px;max-width:18ch}.cu ol{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.cu details{border:1px solid var(--line);border-radius:var(--radius);background:var(--surface)}.cu summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:44px 1fr auto;gap:16px;align-items:center;padding:16px 20px}.cu summary::-webkit-details-marker{display:none}
.cu .n{font-family:var(--head);font-size:26px;color:var(--accent-ink,var(--accent))}.cu b{font-size:18px}.cu .m{color:var(--mute);font-size:14px;text-align:right}.cu details p{margin:0;padding:0 20px 18px 80px;color:var(--mute);max-width:70ch}
@media (max-width:600px){.cu summary{grid-template-columns:36px 1fr}.cu .m{grid-column:2;text-align:left}.cu details p{padding-left:20px}}''',
  '<section class="wrap cu"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><ol>{{each:modules}}<li><details><summary><span class="n" aria-hidden="true">{{n}}</span><b>{{0}}</b><span class="m">{{1}} · {{2}}</span></summary><p>{{3}}</p></details></li>{{/each}}</ol></section>', '',
  [('kicker', 'Kicker', 'text', 'The course'), ('heading', 'Headline', 'text', 'Six modules, at your own pace.'), ('modules', 'Modules (title | lessons | length | summary)', 'list', 'Start with the wheel | 5 lessons | 1h 10m | Posture, centring and your first cylinder, with the common mistakes filmed up close.\nShapes that hold | 6 lessons | 1h 40m | Bowls, mugs and plates, and how thick a wall should really be.\nHandles and lids | 4 lessons | 55m | Pulling handles, fitting lids and making sets that match.\nTrimming | 4 lessons | 50m | Feet, rims and the tools worth buying first.\nGlaze | 7 lessons | 2h 05m | Mixing, dipping, layering and what the kiln does to it.\nFiring and finishing | 3 lessons | 40m | Loading, schedules and fixing what goes wrong.')],
  'A course outline: kicker and headline above numbered native details cards; each summary shows a big serif accent number, bold title and a muted lessons and length; the panel shows a summary indented under the title.'),

 ('contact-form', 'Simple contact form', 'Endings', 'Name, email and message, sent to the form address in Site settings (Formspree, or a mailto: address).', '''
.cf{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);grid-template-rows:auto auto auto 1fr;column-gap:clamp(28px,6vw,96px);align-items:start}.cf>.k,.cf>h2,.cf>.l{grid-column:1}.cf h2{font-size:clamp(34px,4.8vw,68px);margin:10px 0 14px}.cf .l{color:var(--mute);font-size:18px;max-width:40ch;margin:0}.cf form{grid-column:2;grid-row:1/span 4;display:grid;gap:22px}@media (max-width:820px){.cf{grid-template-columns:1fr}.cf form{grid-column:1;grid-row:auto;margin-top:28px}}
.cf .f{display:grid;gap:4px}.cf label{font-size:14px;font-weight:500;color:var(--mute)}.cf input,.cf textarea{min-height:54px;padding:12px 0;border:0;border-bottom:1px solid color-mix(in srgb,var(--ink) 45%,transparent);border-radius:0;background:transparent;width:100%;font-size:18px;transition:border-color .2s}.cf input:hover,.cf textarea:hover,.cf input:focus,.cf textarea:focus{border-bottom-color:var(--ink)}.cf textarea{min-height:150px;resize:vertical}.cf .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}.cf .err{color:color-mix(in srgb,#D92D20 70%,var(--ink));font-size:13px;min-height:1em}.cf .ok.bad{color:color-mix(in srgb,#D92D20 70%,var(--ink))}.cf .send{display:flex;gap:14px;align-items:center;flex-wrap:wrap}.cf .ok{color:var(--mute);font-size:14px}''',
  '<section class="wrap cf"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><p class="l">{{intro}}</p><form action="{{formAction}}" method="post" name="contact" data-netlify="true" netlify-honeypot="_gotcha" novalidate><input type="hidden" name="form-name" value="contact"><p class="hp" aria-hidden="true"><label>Leave this empty <input name="_gotcha" tabindex="-1" autocomplete="off"></label></p><div class="f"><label for="cfn">Your name</label><input id="cfn" name="name" autocomplete="name" required aria-describedby="cfne"><span class="err" id="cfne"></span></div><div class="f"><label for="cfe">Email</label><input id="cfe" name="email" type="email" autocomplete="email" required aria-describedby="cfee"><span class="err" id="cfee"></span></div><div class="f"><label for="cfm">Message</label><textarea id="cfm" name="message" required aria-describedby="cfme"></textarea><span class="err" id="cfme"></span></div><div class="send"><button class="btn p" type="submit">{{button}}</button><span class="ok" role="status" data-thanks="{{thanks}}"></span></div></form></section>',
  '''const f=root.querySelector('form'),ok=root.querySelector('.ok');const els=[...f.querySelectorAll('input:not([name=_gotcha]):not([type=hidden]),textarea')];
const hp=f.querySelector('[name=_gotcha]'),btn=f.querySelector('button[type=submit]');
function send(done,fail){const a=f.getAttribute('action')||'#';if(hp&&hp.value){done();return}
 if(a==='#'||a===''){done();return}
 if(/^mailto:/i.test(a)){f.enctype='text/plain';f.submit();done('Opening your email app…');return}
 const net=a==='netlify';if(btn)btn.disabled=true;
 fetch(net?'/':a,{method:'POST',body:net?new URLSearchParams(new FormData(f)):new FormData(f),headers:net?{'Content-Type':'application/x-www-form-urlencoded'}:{Accept:'application/json'}}).then(r=>{if(!r.ok)throw new Error('send');done()}).catch(()=>fail()).finally(()=>{if(btn)btn.disabled=false})}
function check(el){const bad=!el.value.trim()||(el.type==='email'&&!el.checkValidity());el.setAttribute('aria-invalid',bad);document.getElementById(el.id+'e').textContent=bad?(el.type==='email'&&el.value?'That email address does not look right.':'Please fill this in.'):'';return !bad}
els.forEach(e=>e.addEventListener('blur',()=>check(e)));
f.addEventListener('submit',e=>{e.preventDefault();const good=els.map(check).every(Boolean);if(!good){els.find(x=>x.getAttribute('aria-invalid')==='true').focus();return}
 ok.classList.remove('bad');ok.textContent='Sending…';send(m=>{ok.textContent=m||'Thanks. '+ok.dataset.thanks;if(!m)f.reset()},()=>{ok.classList.add('bad');ok.textContent='Sorry, that did not send. Try again, or email us directly.'})});''',
  [('kicker', 'Kicker', 'text', 'Contact'), ('heading', 'Headline', 'text', 'Say hello.'), ('intro', 'Intro', 'long', 'A short note is plenty. We reply within two working days.'), ('button', 'Button', 'text', 'Send message'), ('thanks', 'Confirmation', 'text', 'Your message is on its way.')],
  'A centred contact form card: kicker, headline and intro above a bordered surface card with name, email and message fields validated inline with specific messages and a primary send button; posts to the configured form address or shows a confirmation.'),

 ('donate', 'Donate', 'Endings', 'A fundraising card: a progress bar, amounts to give and a donate button.', '''
.dn .g{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(24px,5vw,64px);align-items:center}.dn h2{font-size:clamp(34px,4.6vw,60px);margin:10px 0 14px}.dn .l{color:var(--mute);font-size:18px;max-width:46ch}
.dn .card{border:1px solid var(--line);border-radius:calc(var(--radius) * 1.3);background:var(--surface);padding:clamp(20px,3vw,32px);display:grid;gap:16px}.dn .rs{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap}.dn .rs b{font-family:var(--head);font-size:40px}.dn .rs span{color:var(--mute)}
.dn .bar{height:12px;border-radius:999px;background:var(--line);overflow:hidden}.dn .bar i{display:block;height:100%;width:var(--p,50%);background:var(--accent);border-radius:999px}.dn ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px}.dn li a{display:grid;place-items:center;min-height:52px;border:1px solid var(--line);border-radius:calc(var(--radius) * .6);text-decoration:none;font-weight:600;background:var(--bg)}.dn li a:hover{border-color:var(--accent)}.dn .fine{color:var(--mute);font-size:13px;margin:0}
@media (max-width:820px){.dn .g{grid-template-columns:1fr}}''',
  '<section class="wrap dn"><div class="g"><div><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><p class="l">{{intro}}</p></div><div class="card"><div class="rs"><b>{{raised}}</b><span>{{goal}}</span></div><div class="bar" role="img" aria-label="{{pct}} percent of the goal raised"><i style="--p:{{pct}}%"></i></div><ul>{{each:amounts}}<li><a href="#">{{0}}</a></li>{{/each}}</ul><a class="btn p" href="#">{{button}}</a><p class="fine">{{fine}}</p></div></div></section>', NOHASH_M,
  [('kicker', 'Kicker', 'text', 'Spring appeal'), ('heading', 'Headline', 'text', 'Help us keep the doors open.'), ('intro', 'Intro', 'long', 'Every pound pays for warm meals, a quiet room and someone to talk to.'), ('raised', 'Raised', 'text', '£36,400'), ('goal', 'Goal', 'text', 'of £50,000'), ('pct', 'Percent of goal (number)', 'text', '73'), ('amounts', 'Amounts (one per line)', 'list', '£10\n£25\n£50\n£100'), ('button', 'Button', 'text', 'Donate now'), ('fine', 'Small print', 'text', 'Registered charity 000000. Gift Aid adds 25% at no cost to you.')],
  'A fundraising section: kicker, headline and intro on the left; on the right a surface card with a large raised figure and goal, an accent progress bar, a row of amount buttons, a primary donate button and small print.'),

 ('countdown', 'Countdown', 'Story', 'A live countdown to a date, with a headline and a button.', '''
.cd{text-align:center;display:grid;justify-items:center;gap:16px}.cd h2{font-size:clamp(34px,5vw,68px);margin:6px 0 0;max-width:18ch}.cd .l{color:var(--mute);max-width:52ch;margin:0}
.cd .tm{margin:10px 0;display:flex;gap:clamp(8px,2vw,18px);flex-wrap:wrap;justify-content:center}.cd .tu{min-width:clamp(72px,14vw,120px);border:1px solid var(--line);border-radius:var(--radius);background:var(--surface);padding:16px 8px;display:grid;gap:2px}.cd .tu b{font-family:var(--head);font-size:clamp(34px,6vw,64px);line-height:1;font-variant-numeric:tabular-nums}.cd .tu span{color:var(--mute);font-size:12px;letter-spacing:.14em;text-transform:uppercase}''',
  '<section class="wrap cd" data-date="{{date}}"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><p class="l">{{intro}}</p><div class="tm" role="timer" aria-label="Time until the event"><div class="tu"><b data-u="d">--</b><span>Days</span></div><div class="tu"><b data-u="h">--</b><span>Hours</span></div><div class="tu"><b data-u="m">--</b><span>Minutes</span></div><div class="tu"><b data-u="s">--</b><span>Seconds</span></div></div><a class="btn p" href="#">{{button}}</a></section>',
  '''const T=Date.parse(root.querySelector('.cd').dataset.date+'T09:00:00');const q=u=>root.querySelector('[data-u="'+u+'"]');const R=matchMedia('(prefers-reduced-motion: reduce)').matches;
function tick(){if(isNaN(T))return;let s=Math.max(0,Math.floor((T-Date.now())/1000));const d=Math.floor(s/86400);s-=d*86400;const h=Math.floor(s/3600);s-=h*3600;const m=Math.floor(s/60);s-=m*60;q('d').textContent=d;q('h').textContent=String(h).padStart(2,'0');q('m').textContent=String(m).padStart(2,'0');q('s').textContent=R?'00':String(s).padStart(2,'0')}
tick();if(!R)setInterval(tick,1000);else setInterval(tick,60000);root.querySelectorAll('a[href="#"]').forEach(a=>a.onclick=e=>e.preventDefault());''',
  [('kicker', 'Kicker', 'text', 'Save the date'), ('heading', 'Headline', 'text', 'The doors open soon.'), ('intro', 'Intro', 'long', 'Two days of talks, workshops and good food in the old mill.'), ('date', 'Date (YYYY-MM-DD)', 'text', '2027-06-14'), ('button', 'Button', 'text', 'Get tickets')],
  'A centred countdown: kicker, headline, intro, a row of four bordered tiles (days, hours, minutes, seconds in large tabular figures with small caps labels) and a primary button. Seconds stop ticking under reduced motion.'),
]


# ---- Larger, quieter layouts (added 2026-11-15): big type, wide pictures, hairlines instead of boxed cards ----
_NOHASH = 'root.querySelectorAll(\'a[href="#"]\').forEach(a=>a.onclick=e=>e.preventDefault());'
_RV_CSS = '[data-rv]{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .8s cubic-bezier(.2,.8,.2,1)}[data-rv].in{opacity:1;transform:none}'
_RV_JS = "const R=matchMedia('(prefers-reduced-motion: reduce)').matches;const items=root.querySelectorAll('[data-rv]');\nif(R||!('IntersectionObserver' in window)){items.forEach(x=>x.classList.add('in'))}else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});items.forEach(x=>io.observe(x))}"
MORE += [
 ('hero-big', 'Big type hero', 'Heroes', 'A headline as wide as the page, a short intro with two buttons, then one wide picture.', '''
.hb{max-width:1440px;margin:0 auto;padding:clamp(24px,4vh,48px) max(16px,4vw) clamp(40px,8vh,96px)}
.top{display:flex;justify-content:space-between;gap:16px;align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:clamp(22px,4vh,48px);font-size:14px;color:var(--mute)}
.top .k{margin:0}
.hb h1{font-size:clamp(50px,11.2vw,180px);line-height:.92;margin:0 0 clamp(24px,4vh,48px);max-width:13ch}
.mid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px 48px;align-items:end;margin-bottom:clamp(28px,5vh,60px)}
.mid p{margin:0;font-size:clamp(18px,1.6vw,22px);line-height:1.45;color:var(--mute);max-width:46ch}
.row{display:flex;gap:10px;flex-wrap:wrap}
.hb figure{margin:0;aspect-ratio:16/8;border-radius:calc(var(--radius) * 1.4);overflow:hidden;background:var(--surface)}
.hb img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.05);transition:transform 1.4s cubic-bezier(.2,.8,.2,1)}
.hb figure.in img{transform:none}
@media (max-width:760px){.mid{grid-template-columns:1fr}.hb figure{aspect-ratio:4/3}.top span:last-child{display:none}}''',
  '<section class="hb"><div class="top"><p class="k">{{kicker}}</p><span>{{note}}</span></div><h1 class="h">{{heading}}</h1><div class="mid"><p>{{intro}}</p><div class="row"><a class="btn p" href="#">{{b1}}</a><a class="btn" href="#">{{b2}}</a></div></div><figure><img src="{{A}}{{img}}" alt="{{alt}}"></figure></section>',
  _NOHASH + "const f=root.querySelector('figure');if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))f.classList.add('in');else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){f.classList.add('in');io.disconnect()}}),{threshold:.1});io.observe(f)}",
  [('kicker', 'Kicker', 'text', 'Design studio'), ('note', 'Small note, top right', 'text', 'Leeds · Since 2016'), ('heading', 'Headline', 'text', 'We build products people keep.'), ('intro', 'Intro', 'long', 'Strategy, design and engineering in one small team, from the first sketch to the thousandth release.'), ('b1', 'Main button', 'text', 'See the work'), ('b2', 'Second button', 'text', 'Get in touch'), ('img', 'Image', 'image', 'photos/workspace-laptop-on-desk-book-stacks.webp'), ('alt', 'Image description', 'text', 'A laptop on a desk between stacks of books')],
  'A hero led by type: a thin top row with a kicker on the left and a small note on the right over a hairline, then a headline set very large (up to 180px) across the full width, a row with a muted intro on the left and two buttons on the right, and one wide rounded 16:8 picture that settles into place as it appears.'),
 ('hero-type', 'Statement hero', 'Heroes', 'Words only: a very large headline, an intro with two buttons and three facts on a hairline.', '''
.ht{max-width:1440px;margin:0 auto;padding:clamp(56px,12vh,150px) max(16px,4vw) clamp(40px,7vh,80px)}
.ht h1{font-size:clamp(46px,9.2vw,150px);line-height:.95;margin:16px 0 clamp(24px,4vh,48px);max-width:15ch}
.lead{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px 48px;align-items:end}
.lead p{margin:0;font-size:clamp(18px,1.6vw,22px);line-height:1.45;color:var(--mute);max-width:48ch}
.row{display:flex;gap:10px;flex-wrap:wrap}
.facts{list-style:none;margin:clamp(44px,9vh,104px) 0 0;padding:22px 0 0;border-top:1px solid var(--line);display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.facts b{display:block;font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:clamp(28px,3.4vw,50px);letter-spacing:var(--track);line-height:1.05;margin-bottom:6px}
.facts span{color:var(--mute);font-size:15px}
@media (max-width:760px){.lead{grid-template-columns:1fr}.facts{grid-template-columns:1fr;gap:18px}}''',
  '<section class="ht"><p class="k">{{kicker}}</p><h1 class="h">{{heading}}</h1><div class="lead"><p>{{intro}}</p><div class="row"><a class="btn p" href="#">{{b1}}</a><a class="btn" href="#">{{b2}}</a></div></div><ul class="facts">{{each:facts}}<li><b>{{0}}</b><span>{{1}}</span></li>{{/each}}</ul></section>',
  _NOHASH,
  [('kicker', 'Kicker', 'text', 'Customer research, sorted'), ('heading', 'Headline', 'text', 'Find the signal in every call.'), ('intro', 'Intro', 'long', 'Signal listens to customer calls, pulls out what people asked for and threads it into your roadmap.'), ('b1', 'Main button', 'text', 'Start free'), ('b2', 'Second button', 'text', 'See how it works'), ('facts', 'Facts (figure | label)', 'list', '4,200 | teams use it every week\n38 min | saved on each call write-up\n4.8 / 5 | average rating')],
  'A hero with no picture: a kicker, a very large left-aligned headline (up to 150px), a row with a muted intro on the left and two buttons on the right, then three facts in a row over a hairline, each a large figure in the heading font with a small muted label.'),
 ('work-grid', 'Work grid', 'Content', 'Large pictures in two staggered columns, each with a title and a tag underneath.', '''
.hd{display:flex;justify-content:space-between;align-items:end;gap:24px;flex-wrap:wrap;margin-bottom:clamp(28px,5vh,60px)}
.wg h2{font-size:clamp(34px,5.4vw,84px);margin:10px 0 0;max-width:14ch}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(32px,4.4vw,64px) clamp(16px,2.4vw,36px);list-style:none;margin:0;padding:0}
.grid li:nth-child(even){margin-top:clamp(0px,8vw,120px)}
.grid a{display:block;text-decoration:none}
.grid figure{margin:0 0 14px;aspect-ratio:4/5;border-radius:var(--radius);overflow:hidden;background:var(--surface)}
.grid img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .9s cubic-bezier(.2,.8,.2,1)}
.grid a:hover img,.grid a:focus-visible img{transform:scale(1.045)}
.cap{display:flex;justify-content:space-between;gap:12px;align-items:baseline;border-top:1px solid var(--line);padding-top:12px}
.cap b{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:clamp(20px,2vw,30px);letter-spacing:var(--track);line-height:1.1}
.cap span{color:var(--mute);font-size:14px;white-space:nowrap}
@media (max-width:700px){.grid{grid-template-columns:1fr}.grid li:nth-child(even){margin-top:0}.grid figure{aspect-ratio:4/3}}
''' + _RV_CSS,
  '<section class="wrap wg"><div class="hd"><div><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2></div><a class="btn" href="#">{{button}}</a></div><ul class="grid">{{each:items}}<li data-rv><a href="#"><figure><img src="{{A}}{{0}}" alt="{{1}}" loading="lazy"></figure><div class="cap"><b>{{1}}</b><span>{{2}}</span></div></a></li>{{/each}}</ul></section>',
  _NOHASH + _RV_JS,
  [('kicker', 'Kicker', 'text', 'Selected work'), ('heading', 'Headline', 'text', 'Recent projects.'), ('button', 'Button', 'text', 'All work'), ('items', 'Projects (image | title | tag)', 'list', 'photos/workspace-laptop-and-books.webp | Larder | Brand and website\nphotos/tech-statistics-on-a-laptop.webp | Ember | Product design\nphotos/office-on-the-shelf.webp | Olive Row | Identity\nphotos/workspace-desktop-after-work.webp | Kettle & Co | App')],
  'A work section: a kicker and large heading on the left with an outline button on the right, then projects in two columns where the right column starts lower than the left. Each project is a tall rounded 4:5 picture that zooms slightly on hover, with the title in the heading font and a small muted tag on a hairline underneath. One column on phones.'),
 ('list-rows', 'Numbered list', 'Features', 'Services or steps as large numbered rows divided by hairlines, with no boxes.', '''
.lr h2{font-size:clamp(34px,5vw,72px);margin:10px 0 clamp(24px,5vh,56px);max-width:16ch}
.rows{list-style:none;margin:0;padding:0;counter-reset:r;border-top:1px solid var(--line)}
.rows li{counter-increment:r;display:grid;grid-template-columns:clamp(44px,8vw,120px) minmax(0,1fr) minmax(0,1.1fr);gap:8px 24px;align-items:baseline;padding:clamp(20px,3.4vh,38px) 0;border-bottom:1px solid var(--line);transition:padding .35s cubic-bezier(.2,.8,.2,1)}
.rows li::before{content:counter(r,decimal-leading-zero);font-size:14px;color:var(--mute);font-variant-numeric:tabular-nums}
.rows h3{margin:0;font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);letter-spacing:var(--track);font-size:clamp(26px,3.4vw,52px);line-height:1.05}
.rows p{margin:0;color:var(--mute);font-size:17px;max-width:52ch}
@media (hover:hover){.rows li:hover{padding-left:14px}}
@media (max-width:760px){.rows li{grid-template-columns:40px minmax(0,1fr)}.rows p{grid-column:2}}''',
  '<section class="wrap lr"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><ol class="rows">{{each:items}}<li><h3>{{0}}</h3><p>{{1}}</p></li>{{/each}}</ol></section>',
  '',
  [('kicker', 'Kicker', 'text', 'What we do'), ('heading', 'Headline', 'text', 'One team, the whole journey.'), ('items', 'Rows (title | text)', 'list', 'Research | Interviews, audits and prototypes that settle arguments early.\nDesign | Brand, interface and motion that feel like one thing.\nEngineering | Fast, accessible web and mobile apps that last.\nGrowth | Measured launches and the improvements that follow.')],
  'A list section with no cards: a kicker and large heading, then numbered rows separated by hairlines. Each row has a small two-digit number, a large title in the heading font and a muted sentence to the right; rows nudge right on hover. On phones the sentence sits under the title.'),
 ('split-sticky', 'Sticky split', 'Features', 'A heading that stays in view on the left while a list of points scrolls on the right.', '''
.ss{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(28px,6vw,96px);align-items:start}
.l{position:sticky;top:96px}
.ss h2{font-size:clamp(34px,4.8vw,68px);margin:10px 0 16px}
.l p{color:var(--mute);font-size:18px;max-width:40ch;margin:0 0 26px}
.its{list-style:none;margin:0;padding:0;display:grid}
.its li{padding:clamp(22px,4vh,42px) 0;border-top:1px solid var(--line)}
.its li:last-child{border-bottom:1px solid var(--line)}
.its h3{margin:0 0 8px;font-size:clamp(20px,2vw,26px);line-height:1.2}
.its p{margin:0;color:var(--mute);font-size:17px;max-width:54ch}
@media (max-width:820px){.ss{grid-template-columns:1fr}.l{position:static}}
''' + _RV_CSS,
  '<section class="wrap ss"><div class="l"><p class="k">{{kicker}}</p><h2 class="h">{{heading}}</h2><p>{{intro}}</p><a class="btn p" href="#">{{button}}</a></div><ul class="its">{{each:items}}<li data-rv><h3>{{0}}</h3><p>{{1}}</p></li>{{/each}}</ul></section>',
  _NOHASH + _RV_JS,
  [('kicker', 'Kicker', 'text', 'How we work'), ('heading', 'Headline', 'text', 'Fewer projects, done properly.'), ('intro', 'Intro', 'long', 'We take on a handful of projects a year so each one gets a senior team from start to finish.'), ('button', 'Button', 'text', 'Start a project'), ('items', 'Points (title | text)', 'list', 'You talk to the people who build it | No account managers in between; the designer and engineer are in every call.\nWeekly releases you can click | Something real to try every Friday, not a slide deck.\nFixed price, agreed up front | We scope in two weeks and hold the number.\nWe stay after launch | Measure, learn and improve together for as long as it helps.')],
  'A two-column section: on the left a kicker, large heading, muted intro and a primary button that stay pinned while you scroll; on the right a list of points divided by hairlines, each a bold title and a muted sentence, fading up as they appear. Stacks on phones.'),
]
