/* Shared helpers: element lookup, theme switch (add #dark to the address to start dark), mobile menu. */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
function setTheme(dark){root.dataset.theme=dark?'dark':'light';const b=$('#theme');if(b){b.setAttribute('aria-pressed',dark);b.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme')}document.dispatchEvent(new Event('themechange'))}
/* The address can carry a look, for example #dark, #ocean-soft or #sand-serif-dark. A copied file can set the same thing on the html element. */
const SKINS=['ocean','forest','sunset','rose','sand'],LOOKS=['soft','sharp','serif','compact'],PRE=root.dataset.theme==='dark';
function look(){const h=location.hash,w=h.slice(1).toLowerCase().match(/[a-z]+/g)||[];
 if(h){const s=w.find(x=>SKINS.includes(x)),l=w.find(x=>LOOKS.includes(x));s?root.dataset.skin=s:delete root.dataset.skin;l?root.dataset.look=l:delete root.dataset.look}
 setTheme(h?/dark/.test(h):PRE)}
look();addEventListener('hashchange',look);
$('#theme')?.addEventListener('click',()=>setTheme(root.dataset.theme!=='dark'));
{const m=$('#menu'),s=$('.side');if(m&&s){const set=o=>{s.classList.toggle('open',o);m.setAttribute('aria-expanded',o)};m.addEventListener('click',()=>set(!s.classList.contains('open')));addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});document.addEventListener('click',e=>{if(s.classList.contains('open')&&!s.contains(e.target)&&!m.contains(e.target))set(false)})}}
function toast(t){let n=$('#toast');if(!n){n=document.createElement('div');n.id='toast';n.setAttribute('role','status');n.style.cssText='position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:9px 14px;border-radius:10px;font-size:13px;font-weight:600;z-index:60;transition:opacity .2s;max-width:calc(100vw - 32px)';document.body.append(n)}n.textContent=t;n.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>n.style.opacity=0,2000)}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
