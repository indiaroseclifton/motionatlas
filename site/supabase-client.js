'use strict';
/* Accounts for the atlas (Supabase). window.AtlasCloud
   - load()            loads supabase-js on demand and restores the saved session
   - providers()       which sign-in methods the project has switched on (email, google)
   - signInEmail(email) sends a magic link / one-time code; verifyCode(email, code) signs in with the code
   - signInGoogle()    only offered when Google is enabled in Supabase
   - schema()          'ok' | 'missing' (schema.sql not run yet) | 'error'
   - projects.*        list / upsert / remove / getPublic  (table public.projects, RLS protected)
   - files.*           upload / remove / download / signedUrl  (private bucket project-files)
   The publishable key below is meant for browsers; row level security protects the data. */
(()=>{
 const URL_='https://ymrbfnxesuuohysgwxtw.supabase.co';
 const KEY='sb_publishable_KI7KINOjhpmDoYQmRyHeYQ_knI4UWqv';
 const SRC='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.min.js';
 const STORAGE_KEY='atlas-auth';
 const BUCKET='project-files';
 const subs=new Set();
 let clientP=null,schemaP=null,providersP=null;
 const emit=()=>setTimeout(()=>subs.forEach(fn=>{try{fn(C)}catch(e){console.warn(e)}}),0);
 const pageURL=p=>new URL(p,location.href).href;
 const C={
  url:URL_,key:KEY,client:null,session:null,user:null,
  /* true when this browser holds a saved sign-in, so pages can restore it without waiting for a click */
  hasStoredSession(){try{return !!localStorage.getItem(STORAGE_KEY)}catch{return false}},
  onChange(fn){subs.add(fn);return()=>subs.delete(fn)},
  load(){
   return clientP||(clientP=new Promise((res,rej)=>{
    if(window.supabase&&window.supabase.createClient)return res();
    const s=document.createElement('script');s.src=SRC;s.async=true;s.crossOrigin='anonymous';
    s.onload=()=>res();s.onerror=()=>{clientP=null;rej(Error('Could not reach the sign-in service. Check your connection and try again.'))};
    document.head.appendChild(s);
   }).then(async()=>{
    const c=window.supabase.createClient(URL_,KEY,{auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:STORAGE_KEY}});
    C.client=c;
    c.auth.onAuthStateChange((ev,s)=>{const before=C.user&&C.user.id;C.session=s;C.user=s?s.user:null;if((C.user&&C.user.id)!==before||ev==='SIGNED_OUT')emit()});
    const {data}=await c.auth.getSession();C.session=data.session;C.user=data.session?data.session.user:null;
    emit();return c;
   }));
  },
  async providers(){
   return providersP||(providersP=fetch(URL_+'/auth/v1/settings',{headers:{apikey:KEY}}).then(r=>r.ok?r.json():{}).then(s=>({email:!!(s.external&&s.external.email),google:!!(s.external&&s.external.google),signup:!s.disable_signup})).catch(()=>{providersP=null;return{email:true,google:false,signup:true}}));
  },
  redirect(next){return pageURL('account.html')+(next?'?next='+encodeURIComponent(next):'')},
  async signInEmail(email,next){const c=await C.load();const {error}=await c.auth.signInWithOtp({email,options:{emailRedirectTo:C.redirect(next),shouldCreateUser:true}});if(error)throw friendly(error);return true},
  async verifyCode(email,token){const c=await C.load();const {data,error}=await c.auth.verifyOtp({email,token,type:'email'});if(error)throw friendly(error);return data},
  async signInGoogle(next){const c=await C.load();const {error}=await c.auth.signInWithOAuth({provider:'google',options:{redirectTo:C.redirect(next)}});if(error)throw friendly(error)},
  async signOut(){const c=await C.load();await c.auth.signOut();C.session=null;C.user=null;schemaP=null;emit()},
  /* Does public.projects exist yet? PGRST205 / 42P01 mean schema.sql has not been run. */
  schema(force){
   if(force)schemaP=null;
   return schemaP||(schemaP=C.load().then(async c=>{
    const {error}=await c.from('projects').select('id',{head:true,count:'exact'}).limit(1);
    if(!error)return 'ok';
    if(missing(error))return 'missing';
    schemaP=null;console.warn('Supabase:',error.message);return 'error';
   }).catch(()=>{schemaP=null;return 'error'}));
  },
  projects:{
   async list(){const c=await C.load();const {data,error}=await c.from('projects').select('id,name,slug,brief,data,cover,is_public,created_at,updated_at').order('updated_at',{ascending:false}).limit(500);if(error)throw friendly(error);return data||[]},
   async upsert(row){const c=await C.load();const {error}=await c.from('projects').upsert(row,{onConflict:'id'});if(error)throw friendly(error)},
   async remove(id){const c=await C.load();const {error}=await c.from('projects').delete().eq('id',id);if(error)throw friendly(error)},
   async getPublic(id){const c=await C.load();const {data,error}=await c.from('projects').select('id,name,brief,data,cover,is_public,updated_at').eq('id',id).maybeSingle();if(error){if(missing(error))return {missing:true};throw friendly(error)}return data}
  },
  files:{
   async upload(path,file){const c=await C.load();const {error}=await c.storage.from(BUCKET).upload(path,file,{contentType:file.type||'application/octet-stream',upsert:true,cacheControl:'3600'});if(error)throw friendly(error);return path},
   async remove(paths){const c=await C.load();const {error}=await c.storage.from(BUCKET).remove(paths);if(error)throw friendly(error)},
   async download(path){const c=await C.load();const {data,error}=await c.storage.from(BUCKET).download(path);if(error)throw friendly(error);return data},
   async signedUrl(path,seconds=3600){const c=await C.load();const {data,error}=await c.storage.from(BUCKET).createSignedUrl(path,seconds);if(error)throw friendly(error);return data.signedUrl}
  }
 };
 function missing(e){const m=(e&&(e.message||''))+'';return e&&(e.code==='PGRST205'||e.code==='42P01'||/schema cache|does not exist/i.test(m))}
 function friendly(e){const m=(e&&e.message)||'Something went wrong.';const err=Error(
  /rate limit|too many/i.test(m)?'Too many sign-in emails were requested. Wait a minute, then try again.':
  /invalid.*email|email.*invalid/i.test(m)?'That email address doesn’t look right. Check it and try again.':
  /expired|invalid.*token|otp/i.test(m)?'That code has expired or is not right. Request a new email.':
  /bucket not found/i.test(m)?'File storage is not set up yet. Run supabase/schema.sql in Supabase.':
  /payload too large|exceeded the maximum/i.test(m)?'That file is larger than the storage limit (50 MB).':m);err.code=e&&e.code;err.status=e&&e.status;err.missing=missing(e);return err}
 /* Sign-in form shared by account.html and the projects page.
    Email → magic link (and the 6-digit code when the email template includes it) → "check your email". */
 C.mountSignIn=function(el,{next='',idp='acc'}={}){
  const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const form=()=>{el.innerHTML=`<form class="accForm" novalidate><label for="${idp}Email">Email address</label><div class="accRow"><input id="${idp}Email" type="email" required autocomplete="email" inputmode="email" placeholder="you@example.com" aria-describedby="${idp}Status"><button class="accPrimary" type="submit">Email me a sign-in link</button></div><div class="accAlt" hidden></div><p class="accStatus" id="${idp}Status" role="status" aria-live="polite"></p><p class="accFine">No password needed. New here? The same link creates your account.</p></form>`;
   const f=el.querySelector('form'),input=f.querySelector('input'),st=f.querySelector('.accStatus');
   C.providers().then(p=>{if(p.google&&el.contains(f)){const a=f.querySelector('.accAlt');a.hidden=false;a.innerHTML='<button type="button" class="accSecondary" data-acc="google">Continue with Google</button>';a.querySelector('button').onclick=async()=>{try{await C.signInGoogle(next)}catch(err){st.textContent=err.message}}}});
   f.addEventListener('submit',async ev=>{ev.preventDefault();const email=input.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){st.textContent='Enter a valid email address.';input.setAttribute('aria-invalid','true');input.focus();return}
    input.removeAttribute('aria-invalid');const b=f.querySelector('button[type=submit]');b.disabled=true;st.textContent='Sending…';
    try{await C.signInEmail(email,next);sent(email)}catch(err){st.textContent=err.message;b.disabled=false}})};
  const sent=email=>{el.innerHTML=`<div class="accSent" tabindex="-1"><p class="accTitle">Check your email</p><p>We sent a sign-in link to <b>${e(email)}</b>. Open it in this browser to finish signing in. It can take a minute; check spam if it doesn’t arrive.</p><form class="accCode" novalidate><label for="${idp}Code">Or enter the code from the email</label><div class="accRow"><input id="${idp}Code" inputmode="numeric" autocomplete="one-time-code" maxlength="10" pattern="[0-9]*" aria-describedby="${idp}CodeStatus"><button class="accSecondary" type="submit">Sign in with code</button></div><p class="accStatus" id="${idp}CodeStatus" role="status" aria-live="polite"></p></form><button type="button" class="accLink" data-acc="again">Use a different email</button></div>`;
   const box=el.querySelector('.accSent');box.focus();
   el.querySelector('[data-acc=again]').onclick=()=>{form();el.querySelector('input').focus()};
   const cf=el.querySelector('.accCode'),cs=cf.querySelector('.accStatus');
   cf.addEventListener('submit',async ev=>{ev.preventDefault();const code=cf.querySelector('input').value.trim();if(!/^\d{6,10}$/.test(code)){cs.textContent='Enter the number from the email.';return}cs.textContent='Checking…';try{await C.verifyCode(email,code);cs.textContent='Signed in.'}catch(err){cs.textContent=err.message}})};
  form();
 };
 window.AtlasCloud=C;
})();
