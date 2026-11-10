'use strict';
/* Sharing, page titles and sign-up.
   1. Page titles and descriptions follow the section and the open entry.
   2. Entry links: #browse?entry=A53 opens that entry, and the address bar updates while an entry is open.
   3. "Share this direction": a 1200x630 card image of any entry, shared natively or saved, plus a copyable link.
   4. Home: an email sign-up for new plates.
      To connect it, set ATLAS_SIGNUP.endpoint to a form endpoint that accepts a POST with an `email`
      field, for example a Formspree form (https://formspree.io/f/yourid) or Buttondown
      (https://buttondown.com/api/emails/embed-subscribe/yourname). Until then the form says sign-ups
      open soon and sends nothing. */
window.ATLAS_SIGNUP=window.ATLAS_SIGNUP||{endpoint:''};
(()=>{
 const SITE='Visual & Motion Atlas';
 const PAGE={home:'A field guide to how images move',browse:'Catalogue',systems:'Design systems',motion:'Animation studio',projects:'My projects',inspiration:'Inspiration',creations:'Your creations',ux:'UI components',icons:'Icon families',typography:'Fonts & type',playground:'System playground',assets:'Extracted assets',art:'Art styles',cinema:'Film looks',vases:'Vase studies',pairings:'Style pairings',effects:'Landing effects',compare:'Comparison desk',references:'Sources & credits',tours:'Guided tours',backgrounds:'Backgrounds',showcase:'Showcase reels'};
 const DESC={motion:'Play 74 working animations and 9 live simulations, tune easing curves and watch the specimen film library.',effects:'41 landing-page techniques running live, from scroll-driven CSS and View Transitions to shaders and variable fonts, with tunable settings and copy-ready code.',ux:'70 UI components in 22 themes with every state, accessibility notes and HTML, CSS, React and token export.',browse:'387 specimens: visual styles, design elements, animation art, interface motion, UI components and landing effects.'};
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const cat=()=>typeof catalogue!=='undefined'?catalogue:[];
 const find=id=>cat().find(e=>e.id===id);
 const page=()=>location.hash.replace('#','').split('?')[0]||'home';
 const metaDesc=document.querySelector('meta[name="description"]'),baseDesc=metaDesc?.content||'';
 const setMeta=(title,desc)=>{document.title=title;if(metaDesc)metaDesc.content=desc||baseDesc;};

 /* ---------- 1. titles ---------- */
 function syncTitle(){const dlg=document.getElementById('detail');const e=dlg?.open&&typeof selected!=='undefined'?selected:null;
  if(e){setMeta(`${e.title} (${e.id}) · ${SITE}`,e.desc);return;}
  const p=page();setMeta(p==='home'?`${SITE}: styles, motion studies and landing effects`:`${PAGE[p]||'Atlas'} · ${SITE}`,DESC[p]);}

 /* ---------- 2. entry links ---------- */
 function entryFromHash(){const m=location.hash.match(/[?&]entry=([A-Z]\d{2})/);return m?m[1]:null;}
 function openFromHash(){const id=entryFromHash();if(!id||!find(id)||typeof openEntry!=='function')return false;const dlg=document.getElementById('detail');if(dlg?.open&&typeof selected!=='undefined'&&selected?.id===id)return true;openEntry(id);return true;}
 const linkFor=id=>`${location.origin}${location.pathname}#browse?entry=${id}`;
 function onDetail(){const dlg=document.getElementById('detail');if(!dlg)return;
  new MutationObserver(()=>{syncTitle();if(dlg.open&&typeof selected!=='undefined'&&selected&&page()==='browse'){const want=`#browse?entry=${selected.id}`;if(location.hash!==want)history.replaceState(null,'',want);}}).observe(dlg,{attributes:true,attributeFilter:['open']});
  new MutationObserver(()=>{syncTitle();addShareButton();if(page()==='browse'&&dlg.open&&typeof selected!=='undefined'&&selected){const want=`#browse?entry=${selected.id}`;if(location.hash!==want)history.replaceState(null,'',want);}}).observe(document.getElementById('detailBody'),{childList:true});
  dlg.addEventListener('close',()=>{if(entryFromHash())history.replaceState(null,'','#'+page());syncTitle();});}

 /* ---------- 3. share card ---------- */
 function addShareButton(){const body=document.getElementById('detailBody');const notes=body?.querySelector('.detailnotes');if(!notes||notes.querySelector('.shareDirBtn'))return;
  const b=document.createElement('button');b.type='button';b.className='secondary shareDirBtn';b.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5v9M4.5 5 8 1.5 11.5 5M3 9v5h10V9" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>Share this direction';
  b.onclick=()=>{if(typeof selected!=='undefined'&&selected)openShare(selected);};
  const after=notes.querySelector('[data-project-add]');(after||notes.firstElementChild)?.insertAdjacentElement('afterend',b);}
 let dlg,canvas,current;
 function ensureDialog(){if(dlg)return;dlg=document.createElement('dialog');dlg.className='shareCard';dlg.setAttribute('aria-labelledby','shareTitle');
  dlg.innerHTML=`<div class="shareIn"><div class="shareTop"><p class="shareKicker">Share this direction</p><button type="button" class="shareX" aria-label="Close">×</button></div><h2 id="shareTitle"></h2><canvas width="1200" height="630" role="img" aria-label="Share card preview"></canvas>
  <div class="shareActions"><button type="button" class="primary" data-share="native">Share…</button><button type="button" data-share="png">Save image</button><button type="button" data-share="link">Copy link</button></div><label class="shareLink"><span>Link</span><input type="text" readonly></label><p class="shareStatus" role="status" aria-live="polite"></p></div>`;
  document.body.append(dlg);canvas=dlg.querySelector('canvas');
  dlg.querySelector('.shareX').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});
  const status=t=>{dlg.querySelector('.shareStatus').textContent=t;};
  const blob=()=>new Promise(r=>canvas.toBlob(r,'image/png'));
  const fileName=()=>`atlas-${current.id.toLowerCase()}-${current.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}.png`;
  dlg.querySelector('[data-share="native"]').onclick=async()=>{try{const b=await blob();const file=new File([b],fileName(),{type:'image/png'});const data={title:`${current.title} · ${SITE}`,text:current.desc,url:linkFor(current.id)};
    if(navigator.canShare?.({files:[file]}))await navigator.share({...data,files:[file]});else if(navigator.share)await navigator.share(data);else{status('Sharing is not available in this browser. Save the image or copy the link instead.');return;}status('Shared.');}catch(e){if(e?.name!=='AbortError')status('Sharing did not complete. Save the image or copy the link instead.');}};
  dlg.querySelector('[data-share="png"]').onclick=async()=>{const b=await blob();const url=URL.createObjectURL(b);const a=document.createElement('a');a.href=url;a.download=fileName();document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);status('Image saved to your downloads.');};
  dlg.querySelector('[data-share="link"]').onclick=async()=>{const inp=dlg.querySelector('.shareLink input');try{await navigator.clipboard.writeText(inp.value);status('Link copied.');}catch{inp.select();status('Select the link and copy it.');}};
  dlg.querySelector('[data-share="native"]').hidden=!navigator.share;}
 async function openShare(e){ensureDialog();current=e;dlg.querySelector('#shareTitle').textContent=e.title;dlg.querySelector('.shareLink input').value=linkFor(e.id);dlg.querySelector('.shareStatus').textContent='';
  const detail=document.getElementById('detail');(detail?.open?detail:document.body).append(dlg);dlg.showModal();await drawCard(e);}
 function loadImg(src){return new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src;});}
 function wrap(ctx,text,x,y,max,lh,lines){const words=String(text).split(/\s+/);let line='',n=0;for(let i=0;i<words.length;i++){const t=line?line+' '+words[i]:words[i];if(ctx.measureText(t).width>max&&line){ctx.fillText(n===lines-1&&i<words.length?line.replace(/[,.;:]?$/,'…'):line,x,y+n*lh);n++;line=words[i];if(n>=lines)return n;}else line=t;}if(line&&n<lines){ctx.fillText(line,x,y+n*lh);n++;}return n;}
 async function drawCard(e){const ctx=canvas.getContext('2d'),W=1200,H=630;
  try{await Promise.all(['300 64px "Cormorant Garamond"','italic 300 64px "Cormorant Garamond"','500 18px "JetBrains Mono"','400 22px Manrope','600 22px Manrope'].map(f=>document.fonts.load(f)));}catch{}
  ctx.fillStyle='#02040b';ctx.fillRect(0,0,W,H);
  // media on the right
  const mx=640,my=40,mw=520,mh=550;ctx.save();ctx.beginPath();ctx.roundRect?ctx.roundRect(mx,my,mw,mh,18):ctx.rect(mx,my,mw,mh);ctx.clip();
  const ref=e.film?{url:e.film.poster,index:0,columns:1,rows:1}:e.image||e.applied;let drawn=false;
  if(ref){const img=await loadImg(ref.url);if(img){const cols=ref.columns||2,rows=ref.rows||2,sw=img.width/cols,sh=img.height/rows,sx=(ref.index%cols)*sw,sy=Math.floor(ref.index/cols)*sh;const s=Math.max(mw/sw,mh/sh),dw=sw*s,dh=sh*s;ctx.drawImage(img,sx,sy,sw,sh,mx+(mw-dw)/2,my+(mh-dh)/2,dw,dh);drawn=true;}}
  if(!drawn){const t=window.AtlasThemes?.byId[e.id]||window.AtlasThemes?.byId[e.pairs?.theme];const c=t?(e.id==='S21'?t.dark:t.light):null;
   const g=ctx.createLinearGradient(mx,my,mx+mw,my+mh);g.addColorStop(0,c?c.bg:'#13203a');g.addColorStop(1,c?c.surface:'#2b1640');ctx.fillStyle=g;ctx.fillRect(mx,my,mw,mh);
   if(c){[c.bg,c.surface,c.text,c.accent,c.success,c.danger].forEach((col,i)=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(mx+60+i*62,my+mh-70,24,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.stroke();});
    ctx.fillStyle=c.text;ctx.font=`${t.shape.weight||400} 120px "${t.fonts.display}", Georgia, serif`;ctx.fillText('Aa',mx+56,my+190);}}
  ctx.restore();
  // copy on the left
  ctx.fillStyle='#7dd3fc';ctx.font='500 18px "JetBrains Mono", monospace';ctx.fillText(`${e.id} · ${(e.group||'').toUpperCase()}`,64,92);
  ctx.fillStyle='#eef2f8';ctx.font='300 66px "Cormorant Garamond", Georgia, serif';const tl=wrap(ctx,e.title,64,172,540,66,3);
  ctx.fillStyle='#c4cddc';ctx.font='400 22px Manrope, system-ui, sans-serif';const dy=172+tl*66+18;wrap(ctx,e.desc||'',64,dy,530,33,4);
  if(e.use){ctx.fillStyle='#fde68a';ctx.font='600 15px "JetBrains Mono", monospace';ctx.fillText('BEST FOR',64,H-150);ctx.fillStyle='#a8b3c7';ctx.font='400 19px Manrope, system-ui, sans-serif';wrap(ctx,e.use,64,H-120,530,28,2);}
  ctx.strokeStyle='rgba(238,242,248,.18)';ctx.beginPath();ctx.moveTo(64,H-52);ctx.lineTo(596,H-52);ctx.stroke();
  ctx.fillStyle='#eef2f8';ctx.font='italic 300 26px "Cormorant Garamond", Georgia, serif';ctx.fillText('Visual & Motion Atlas',64,H-20);
  ctx.fillStyle='#7a8596';ctx.font='500 13px "JetBrains Mono", monospace';ctx.textAlign='right';ctx.fillText('#browse?entry='+e.id,596,H-24);ctx.textAlign='left';}

 /* ---------- 4. sign-up ---------- */
 function buildSignup(){const home=document.querySelector('.vmaHome');const foot=home?.querySelector('.vmaFooter');if(!foot||document.getElementById('atlasSignup'))return;
  const sec=document.createElement('section');sec.id='atlasSignup';sec.className='vmaInner vmaSection atlasSignup';sec.setAttribute('aria-labelledby','signupTitle');
  sec.innerHTML=`<div><p class="vmaLabel">New plates &middot; about once a month</p><h2 id="signupTitle">Get the next plates.<br><em>Films, studies and styles.</em></h2></div>
  <form class="signupForm" novalidate><label for="signupEmail">Email address</label><div class="signupRow"><input id="signupEmail" name="email" type="email" autocomplete="email" inputmode="email" required placeholder="you@studio.com" aria-describedby="signupNote signupStatus"><button type="submit" class="vmaBtn vmaBtnPrimary">Subscribe</button></div>
  <p id="signupNote" class="signupNote">One email when new plates land. No tracking, unsubscribe any time.</p><p id="signupStatus" class="signupStatus" role="status" aria-live="polite"></p></form>`;
  foot.insertAdjacentElement('beforebegin',sec);
  const form=sec.querySelector('form'),inp=sec.querySelector('input'),st=sec.querySelector('.signupStatus'),btn=sec.querySelector('button');
  form.addEventListener('submit',async ev=>{ev.preventDefault();const email=inp.value.trim();
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){inp.setAttribute('aria-invalid','true');st.textContent='Enter an email address like name@example.com.';inp.focus();return;}
   inp.removeAttribute('aria-invalid');const ep=window.ATLAS_SIGNUP?.endpoint;
   if(!ep){st.textContent='Sign-ups open soon. Nothing was sent; please check back.';return;}
   btn.disabled=true;st.textContent='Subscribing…';
   try{const fd=new FormData();fd.append('email',email);const r=await fetch(ep,{method:'POST',body:fd,headers:{Accept:'application/json'}});if(!r.ok)throw new Error(r.status);st.textContent='Thanks. Check your inbox to confirm your subscription.';form.reset();}
   catch{st.textContent='That did not go through. Please try again in a moment.';}finally{btn.disabled=false;}});}

 /* ---------- wiring ---------- */
 const ready=setInterval(()=>{if(!cat().length||!document.getElementById('detailBody'))return;clearInterval(ready);
  onDetail();syncTitle();openFromHash();buildSignup();
  addEventListener('hashchange',()=>{syncTitle();openFromHash();buildSignup();});
  new MutationObserver(()=>buildSignup()).observe(document.getElementById('main'),{childList:true});},150);
 window.AtlasShare={open:id=>{const e=find(id);if(e)openShare(e);},linkFor};
})();
