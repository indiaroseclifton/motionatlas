'use strict';
/* Header behaviour for the "Your studio" menu: it closes on navigation and shows which page you are on. */
(()=>{
 const g=()=>document.querySelector('header .studioGroup');
 /* Every header menu (Your studio, Visual, Motion, Interface) marks only the group that holds the current page. */
 function sync(){const page=location.hash.replace('#','').split('?')[0]||'home';document.querySelectorAll('header details.navGroup').forEach(d=>{const inside=[...d.querySelectorAll('a')].some(a=>a.getAttribute('href')==='#'+page);
  d.querySelector('summary')?.classList.toggle('active',inside);d.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+page));d.open=false;});}
 addEventListener('hashchange',sync);
 document.addEventListener('click',e=>{const a=e.target.closest('header details.navGroup a');if(a)a.closest('details').open=false;document.querySelectorAll('header details.navGroup[open]').forEach(d=>{if(!d.contains(e.target))d.open=false;});});
 const t=setInterval(()=>{if(g()){clearInterval(t);sync();}},200);
})();
