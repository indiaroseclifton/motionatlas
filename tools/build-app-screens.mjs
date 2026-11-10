// Builds the self-contained app interface screens in site/app-screens/demos/ and their manifest.
//   node tools/build-app-screens.mjs
// Each source in tools/app-screens/src/<id>.html starts with <!--META {json}--> and may use these markers:
//   /*BASE*/ (shared tokens and shell styles), /*BASEJS*/ and /*CHARTJS*/ (shared scripts),
//   <!--SHELL Active item|Search placeholder--> … <!--/SHELL--> (wraps the content in the sidebar and top bar).
import fs from 'fs';import path from 'path';import {fileURLToPath} from 'url';
const here=path.dirname(fileURLToPath(import.meta.url)),src=path.join(here,'app-screens'),out=path.join(here,'..','site','app-screens');
const rd=f=>fs.readFileSync(path.join(src,f),'utf8').trim();
const BASE=rd('base.css'),BASEJS=rd('base.js'),CHARTJS=rd('chart.js');
const I={home:'<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4Z"/>',chart:'<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.6 3.4-5.5 6.5-5.5s5.500 1.900 6.500 5.500M16 4.800a3.500 3.500 0 0 1 0 6.400M18 14.800c1.700.8 2.900 2.500 3.500 5.200"/>',inbox:'<path d="M4 13 6.500 5h11L20 13v6H4Z"/><path d="M4 13h5l1 2.500h4l1-2.500h5"/>',board:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9.300 4v16M14.700 4v10"/>',cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',folder:'<path d="M3 6h7l2 2h9v11H3Z"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.600 5.600l2.100 2.100M16.300 16.300l2.100 2.100M5.600 18.400l2.100-2.100M16.300 7.700l2.100-2.100"/>',search:'<circle cx="11" cy="11" r="6.500"/><path d="m16 16 4.500 4.500"/>',bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',moon:'<path d="M20 14.500A8 8 0 0 1 9.500 4a8 8 0 1 0 10.500 10.500Z"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',chat:'<path d="M4 5h16v11H9l-5 4Z"/>',card:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10.500h18"/>',bolt:'<path d="M13 3 5 13.500h6L10 21l8-10.500h-6Z"/>'};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;
const NAV=[['Overview','home'],['Analytics','chart'],['Customers','users'],['Inbox','inbox','12'],['Projects','board'],['Assistant','chat'],['Calendar','cal'],['Files','folder'],['Billing','card'],['Settings','gear']];
const shell=(active,find,inner)=>`<div class="app"><nav class="side" aria-label="Main"><div class="logo"><span>${ic('bolt')}</span>Northwind</div>${NAV.map(([n,i,b])=>`<a href="#" ${n===active?'aria-current="page"':''}>${ic(i)}${n}${b?`<b>${b}</b>`:''}</a>`).join('')}<div class="who"><span class="av">AK</span><span>Amara Khan<small>Admin</small></span></div></nav>
<div class="work"><header class="top"><button class="btn sq ghost" id="menu" aria-label="Menu" aria-expanded="false">${ic('menu')}</button><label class="find"><span class="sr">Search</span>${ic('search')}<input class="in" type="search" placeholder="${find||'Search'}"></label><span class="sp"></span><button class="btn sq ghost" id="theme" aria-pressed="false" aria-label="Switch to dark theme">${ic('moon')}</button><button class="btn sq ghost" aria-label="Notifications">${ic('bell')}</button><span class="av" aria-label="Your account">AK</span></header>
<main class="main" id="main">${inner}</main></div></div>`;
fs.mkdirSync(path.join(out,'demos'),{recursive:true});
const man=[];
for(const f of fs.readdirSync(path.join(src,'src')).filter(f=>f.endsWith('.html')).sort()){
 let s=fs.readFileSync(path.join(src,'src',f),'utf8');const m=/^<!--META (.*?)-->\n/.exec(s);if(!m)throw new Error('No META in '+f);
 const meta=JSON.parse(m[1]),id=f.replace('.html','');s=s.slice(m[0].length);
 s=s.replace(/<!--SHELL (.*?)-->([\s\S]*?)<!--\/SHELL-->/,(_,a,inner)=>{const [act,find]=a.split('|');return shell(act,find,inner.trim())});
 s=s.replace(/<!--IC (\w+)-->/g,(_,n)=>{if(!I[n])throw new Error('No icon '+n+' in '+f);return ic(n)});
 s=s.replace('/*BASE*/',()=>BASE).replace('/*BASEJS*/',()=>BASEJS).replace('/*CHARTJS*/',()=>CHARTJS);
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${meta.t}</title>\n${s.trim()}\n</html>\n`;
 fs.writeFileSync(path.join(out,'demos',id+'.html'),html);man.push({id,...meta});
}
man.sort((a,b)=>(a.o||99)-(b.o||99));man.forEach(x=>delete x.o);
fs.writeFileSync(path.join(out,'manifest.js'),'/* Built by tools/build-app-screens.mjs. Edit tools/app-screens/src, not this file. */\nwindow.APP_SCREENS='+JSON.stringify(man,null,0).replace(/\},\{/g,'},\n{')+';\n');
console.log('built',man.length,'screens');
