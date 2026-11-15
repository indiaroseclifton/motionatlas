'use strict';
/* Studio tabs: one panel layout for the studios. The chart and mockup studios already split their side panel into
   tabs in the order you work; this gives the diagram, flowchart and motion graphics studios the same thing, so no
   side panel is a long scroll. Each page lists its panes at the bottom of this file.
   StudioTabs(host, [{label, els}], {key, start}) puts a tab row at the top of `host` and shows one pane at a time. */
(()=>{
 const st=document.createElement('style');st.textContent=`
.stTabs{display:flex;flex:none;min-height:49px;box-sizing:border-box;gap:2px;padding:4px 12px 0;border-bottom:1px solid var(--hair,#E1E4EC);position:sticky;top:-1px;z-index:3;background:var(--panel,#fff);overflow-x:auto;scrollbar-width:none}
.stTabs::-webkit-scrollbar{display:none}
.stTabs button{flex:none;min-height:44px;padding:0 12px;border:0;border-bottom:2px solid transparent;background:none;font:600 13px/1 Inter,system-ui,sans-serif;color:var(--mute,#5E6476);cursor:pointer}
.stTabs button[aria-selected=true]{color:var(--ink,#1C1F2A);border-bottom-color:var(--ink,#1C1F2A)}
.stTabs button:focus-visible{outline:2px solid var(--ink,#1C1F2A);outline-offset:-2px}
.stOff{display:none!important}
/* one family, several modes: the studios for charts, diagrams and flowcharts share a switch where the title was */
.famSwitch{display:inline-flex;gap:2px;padding:3px;border:1px solid var(--hair,#E1E4EC);border-radius:999px;background:var(--panel,#fff);flex:0 1 auto;min-width:0;max-width:100%;overflow-x:auto;scrollbar-width:none}
.famSwitch::-webkit-scrollbar{display:none}
.famSwitch a{display:inline-flex;align-items:center;min-height:32px;padding:0 13px;border-radius:999px;font:600 13px/1 Inter,system-ui,sans-serif;color:var(--mute,#5E6476);text-decoration:none;white-space:nowrap;text-transform:none;letter-spacing:0}
.famSwitch a:hover{color:var(--ink,#1C1F2A)}
.famSwitch a[aria-current=page]{background:var(--ink,#1C1F2A);color:#fff}
.famSwitch a:focus-visible{outline:2px solid var(--ink,#1C1F2A);outline-offset:2px}
.famH1{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media(max-width:700px){.famSwitch a{min-height:36px;padding:0 12px}}
/* motion graphics: the template gallery lives in the side panel */
@media(min-width:861px){.side.stScroll{height:calc(100vh - var(--st-head,57px) - var(--sb-h,0px));min-height:0;overflow:auto;align-self:start}}
.side>.gal{padding:14px 16px 20px}.side>.gal #mgGrid{grid-template-columns:1fr 1fr;gap:10px}.side>.gal h2{margin-top:0}`;
 document.head.append(st);
 function StudioTabs(host,panes,{key,start=0,before=null,scroller=null}={}){
  panes=panes.filter(p=>p.els.length);if(!host||panes.length<2)return null;
  const bar=document.createElement('div');bar.className='stTabs';bar.setAttribute('role','tablist');bar.setAttribute('aria-label','Panel sections');
  let cur=start;try{const v=sessionStorage.getItem('st-tab-'+key);if(v!=null&&panes[+v])cur=+v}catch(e){}
  bar.innerHTML=panes.map((p,i)=>`<button type="button" role="tab" data-i="${i}">${p.label}</button>`).join('');
  if(before)before.before(bar);else host.prepend(bar);
  function show(i,focus){cur=i;[...bar.children].forEach((b,j)=>{b.setAttribute('aria-selected',String(j===i));b.tabIndex=j===i?0:-1});
   panes.forEach((p,j)=>p.els.forEach(el=>el.classList.toggle('stOff',j!==i)));
   try{sessionStorage.setItem('st-tab-'+key,String(i))}catch(e){}
   if(focus){bar.children[i].focus();(scroller||host).scrollTo?.({top:0});dispatchEvent(new Event('resize'))}}
  bar.addEventListener('click',e=>{const b=e.target.closest('[role=tab]');if(b)show(+b.dataset.i,true)});
  bar.addEventListener('keydown',e=>{const n=panes.length;let j=null;if(e.key==='ArrowRight')j=(cur+1)%n;if(e.key==='ArrowLeft')j=(cur-1+n)%n;if(e.key==='Home')j=0;if(e.key==='End')j=n-1;if(j!=null){e.preventDefault();show(j,true)}});
  show(cur);return {show,bar};
 }
 window.StudioTabs=StudioTabs;
 const $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const FAMILY=[['infographic-studio','Infographics'],['chart-studio','Charts'],['diagram-studio','Diagrams'],['flowchart-studio','Flowcharts']];
 function family(page){
  const me=page==='flowchart-canvas'?'flowchart-studio':page;if(!FAMILY.some(f=>f[0]===me))return;
  const h1=document.querySelector('header h1');if(!h1||document.querySelector('.famSwitch'))return;
  const nav=document.createElement('nav');nav.className='famSwitch';nav.setAttribute('aria-label','Charts and diagrams');
  nav.innerHTML=FAMILY.map(([f,n])=>`<a href="${f}.html"${f===me?' aria-current="page"':''}>${n}</a>`).join('');
  h1.classList.add('famH1');h1.after(nav);/* let the header shrink to the screen so the switch scrolls inside it instead of widening the page */const hd=nav.closest('header');if(hd)hd.style.minWidth='0';nav.querySelector('[aria-current]')?.scrollIntoView({block:'nearest',inline:'center'});
 }
 function start(){
  const page=location.pathname.split('/').pop().replace(/\.html$/,'');
  family(page);
  if(page==='diagram-studio'){const a=document.querySelector('aside.side'),s=$$(':scope>.sec',a);
   if(s.length>=5)StudioTabs(a,[{label:'Type',els:[s[0]]},{label:'Content',els:[s[1],s[2]]},{label:'Style',els:[s[3]]},{label:'Checks',els:[s[4]]}],{key:'diagram'})}
  if(page==='flowchart-studio'||page==='flowchart-canvas'){const body=document.querySelector('#panel .pbody')||document.querySelector('#panel'),t=n=>$$(`:scope>section.ptab[data-tab="${n}"]`,body);
   if(body)StudioTabs(body.parentElement,[{label:'Steps',els:t('steps')},{label:'Chart',els:t('chart')},{label:'Layout',els:t('layout')},{label:'Checks',els:t('checks')}],{key:'flow',before:body,scroller:body})}
  if(page==='infographic-studio'){const a=document.querySelector('aside.side'),g=n=>$$(`:scope>[data-pane="${n}"]`,a);
   if(a){a.classList.add('stScroll');StudioTabs(a,[{label:'Layout',els:g('layout')},{label:'Content',els:g('content')},{label:'Style',els:g('style')}],{key:'infographic'})}}
  if(page==='motion-graphics'){const a=document.querySelector('aside.side'),gal=document.querySelector('main .gal');
   if(a&&gal){const edit=$$(':scope>*',a);a.append(gal);a.classList.add('stScroll');StudioTabs(a,[{label:'Templates',els:[gal]},{label:'Edit',els:edit}],{key:'motion'})}}
 }
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',start);else start();
})();
