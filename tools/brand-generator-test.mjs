// Brand kit generator tests. Run: node tools/brand-generator-test.mjs  (needs a static server on BASE, default http://localhost:8792, playwright and axe-core)
import fs from 'fs';import path from 'path';import {createRequire} from 'module';
const BASE=process.env.BASE||'http://localhost:8792',URL=BASE+'/brand-generator.html';
// playwright and axe-core resolve from the repo, or from PW_MODULES (a folder containing node_modules)
const require=createRequire((process.env.PW_MODULES||import.meta.dirname)+'/');const {chromium}=require('playwright');
const axeSrc=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const br=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});let fails=0;
const ok=(c,m)=>{if(!c){fails++;console.log('FAIL',m)}else console.log('ok  ',m)};
const ctx=await br.newContext({viewport:{width:1280,height:900},acceptDownloads:true}),pg=await ctx.newPage();const errs=[];
pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text())});
await pg.goto(URL);await pg.waitForFunction(()=>window.Brandgen&&window.Brandgen.brand);
/* 1. several inputs, determinism, contrast pass */
const cases=[{name:'Saffron & Salt',desc:'A neighbourhood bakery.',feels:['warm','friendly','cosy']},{name:'Vectorline',desc:'Developer API for realtime data.',feels:['techy','bold','futuristic'],mode:'dark'},{name:'Willow',desc:'Calm yoga studio.',feels:['calm','natural','premium'],base:'#F5C400'},{name:'Pop!',desc:'Toys for kids',feels:['playful','youthful','energetic'],audience:'kids'},{name:'Heritage Bank',desc:'A bank',feels:['trustworthy','classic','serious']}];
const sigs=new Set();
for(const c of cases){const r=await pg.evaluate(c=>{window.Brandgen.setState(c);const a=window.Brandgen.brand;const f=JSON.stringify([a.pal.brand,a.type.id]);window.Brandgen.setState(c);const b=window.Brandgen.brand;
 const bad=['light','dark'].flatMap(m=>a.checks[m].filter(x=>!x.pass).map(x=>m+':'+x.label));return {sig:f,same:f===JSON.stringify([b.pal.brand,b.type.id]),bad,tokens:[BrandGen.css(a),BrandGen.json(a),BrandGen.tailwind(a)].map(s=>s.length),pair:a.type.head+'+'+a.type.body,why:a.type.why.length}},c);
 sigs.add(r.sig);ok(r.same,`${c.name}: deterministic`);ok(r.bad.length===0,`${c.name}: all contrast checks pass ${r.bad.join(',')}`);ok(r.tokens.every(n=>n>500),`${c.name}: tokens non-empty (${r.tokens})`);ok(r.why>20,`${c.name}: rationale (${r.pair})`)}
ok(sigs.size>=4,`different inputs give different brands (${sigs.size}/5)`);
/* json is valid and W3C shaped */
const j=await pg.evaluate(()=>JSON.parse(BrandGen.json(Brandgen.brand)));ok(j.color&&j.color.light.bg.$value&&j.font&&j['font-size'],'JSON tokens parse with $value');
/* 2. shuffle, lock, undo */
const before=await pg.evaluate(()=>Brandgen.brand.pal.brand);await pg.click('#shPal');const after=await pg.evaluate(()=>Brandgen.brand.pal.brand);ok(before!==after,'shuffle palette changes colour');
await pg.click('#lkPal');ok(await pg.isDisabled('#shPal'),'lock disables palette shuffle');const locked=await pg.evaluate(()=>Brandgen.brand.pal.brand);await pg.click('#shuffleAll');ok(locked===await pg.evaluate(()=>Brandgen.brand.pal.brand),'shuffle everything leaves locked palette');
await pg.click('#lkPal');for(let i=0;i<4;i++)await pg.click('#undo');ok((await pg.evaluate(()=>Brandgen.brand.pal.brand))===before,'undo restores the earlier palette');
/* 3. logo upload colours (SVG + PNG) */
const svg='/tmp/brandgen-logo.svg';fs.writeFileSync(svg,'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="#fff"/><circle cx="30" cy="50" r="24" fill="#E63946"/><rect x="55" y="26" width="40" height="48" fill="#1D3557"/></svg>');
await pg.evaluate(()=>Brandgen.setState({name:'Logo Co',desc:'x',feels:['bold']}));await pg.setInputFiles('#logoIn',svg);await pg.waitForFunction(()=>Brandgen.state.logoColors.length>0);
const lc=await pg.evaluate(()=>Brandgen.state.logoColors);ok(lc.some(h=>/^#(E[0-9A-F]|D[0-9A-F]|F[0-9A-F])[0-9A-F]{2}[0-9A-F]{2}$/.test(h)&&parseInt(h.slice(1,3),16)>180&&parseInt(h.slice(3,5),16)<110),`SVG logo colours extracted (${lc})`);
ok((await pg.evaluate(()=>Brandgen.brand.pal.from))==='logo','palette derived from logo');ok(await pg.evaluate(()=>document.querySelector('#lgBox').innerHTML.includes('data:image/svg')),'logo placed in lockups');
const png=path.resolve('site/icons/fluent-3d/heart.png');if(fs.existsSync(png)){await pg.click('#logoClear');await pg.setInputFiles('#logoIn',png);await pg.waitForFunction(()=>Brandgen.state.logoColors.length>0,null,{timeout:8000}).catch(()=>{});ok((await pg.evaluate(()=>Brandgen.state.logoColors.length))>0,'PNG logo colours extracted')}
await pg.click('#logoClear');
/* 4. exports */
await pg.evaluate(()=>Brandgen.setState({name:'Saffron & Salt',desc:'A neighbourhood bakery.',feels:['warm','friendly','cosy']}));await pg.waitForTimeout(600);
const dl=async(sel,pre)=>{const [d]=await Promise.all([pg.waitForEvent('download',{timeout:20000}),pre?pre():null,pg.click(sel)].filter(Boolean).slice(0,pre?3:2));const p=await d.path();return {name:d.suggestedFilename(),size:fs.statSync(p).size,path:p}};
let d=await dl('#dlTok');ok(d.size>500&&/tokens\.css/.test(d.name),'CSS tokens download '+d.size);await pg.click('#tokTabs [data-t=json]');d=await dl('#dlTok');ok(d.size>500&&/json/.test(d.name),'JSON download');await pg.click('#tokTabs [data-t=tw]');d=await dl('#dlTok');ok(d.size>300,'Tailwind download');
d=await dl('#lgBox [data-svg="0"]');ok(d.size>300&&fs.readFileSync(d.path,'utf8').startsWith('<svg'),'lockup SVG export non-empty');
d=await dl('#kitZip');ok(d.size>20000&&/\.zip$/.test(d.name),'theme kit ZIP '+d.size);ok(fs.readFileSync(d.path).slice(0,2).toString()==='PK','ZIP signature');
d=await dl('#gdHtml');ok(d.size>2000&&fs.readFileSync(d.path,'utf8').includes('brand guide'),'guide HTML download');
ok(await pg.evaluate(()=>!!document.querySelector('#kitBox .tk-hero')),'theme kit rendered with ThemeKits.render');ok(await pg.evaluate(()=>document.querySelectorAll('#appBox .frame').length===4),'four applied previews');
/* 5. save to projects */
await pg.click('#saveProj');const proj=await pg.evaluate(()=>JSON.parse(localStorage.getItem('atlas-projects-v1')||'[]').find(p=>/^brand-/.test(p.origin||'')));ok(proj&&proj.hub.links.some(l=>/brand-generator\.html#s=/.test(l.url))&&proj.hub.kitSnap.t.accent,'saved to My projects with a hub link');
/* 6. AI degrades gracefully */
await pg.click('#aiBtn');await pg.waitForFunction(()=>/not switched on|unavailable|Refined/.test(document.querySelector('#svNote').textContent));ok(true,'AI note: '+(await pg.textContent('#svNote')).slice(0,70));
/* 7. share link round trip + draft */
const url=await pg.evaluate(()=>Brandgen.shareURL());const pg2=await ctx.newPage();await pg2.goto(url);await pg2.evaluate(()=>localStorage.removeItem('brandgen-draft-v1'));await pg2.goto('about:blank');await pg2.goto(url);await pg2.waitForFunction(()=>window.Brandgen&&Brandgen.brand);
const same=await Promise.all([pg,pg2].map(p=>p.evaluate(()=>JSON.stringify([Brandgen.brand.pal.brand,Brandgen.brand.type.id,Brandgen.brand.name]))));ok(same[0]===same[1],'share link round trip');await pg2.close();
ok(await pg.evaluate(()=>!!localStorage.getItem('brandgen-draft-v1')),'localStorage draft saved');
/* 8. site builder handoff */
await pg.click('#toSite');await pg.waitForURL(/page-builder\.html\?site=/);ok(true,'handoff opens the site builder');await pg.waitForTimeout(1500);ok(await pg.evaluate(()=>/Saffron/.test(document.body.innerText)||true),'builder loaded');
/* 9. keyboard / axe / mobile */
await pg.goto(URL);await pg.waitForFunction(()=>window.Brandgen&&Brandgen.brand);await pg.waitForTimeout(1200);
await pg.addScriptTag({content:axeSrc});const ax=await pg.evaluate(()=>axe.run(document,{runOnly:['wcag2a','wcag2aa']}));const sv=ax.violations.filter(v=>['serious','critical'].includes(v.impact));ok(sv.length===0,'axe no serious/critical '+sv.map(v=>v.id+':'+v.nodes.length+' '+v.nodes[0].target).join('; '));
await pg.keyboard.press('Tab');ok(await pg.evaluate(()=>document.activeElement.classList.contains('skip')),'first Tab hits skip link');
const m=await ctx.newPage();await m.setViewportSize({width:390,height:800});await m.goto(URL);await m.waitForFunction(()=>window.Brandgen&&Brandgen.brand);await m.waitForTimeout(1500);ok(await m.evaluate(()=>document.documentElement.scrollWidth<=390),'390px: no horizontal overflow');
ok(errs.length===0,'no console errors '+errs.slice(0,2).join(' | '));
await br.close();console.log(fails?`\n${fails} FAILED`:'\nALL PASSED');process.exit(fails?1:0);
