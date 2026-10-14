'use strict';
/* Header behaviour for the "Your studio" menu: it closes on navigation and shows which page you are on. */
(()=>{
 const g=()=>document.querySelector('header .studioGroup');
 function sync(){const d=g();if(!d)return;const page=location.hash.replace('#','').split('?')[0];const inside=[...d.querySelectorAll('a')].some(a=>a.getAttribute('href')==='#'+page);
  d.querySelector('summary')?.classList.toggle('active',inside);d.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+page));d.open=false;}
 addEventListener('hashchange',sync);
 document.addEventListener('click',e=>{const d=g();if(d&&d.open&&e.target.closest('.studioGroup a'))d.open=false;});
 const t=setInterval(()=>{if(g()){clearInterval(t);sync();}},200);
})();
