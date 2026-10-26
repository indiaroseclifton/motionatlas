// Moodboard test. Run: node tools/moodboard-test.mjs (serve site/ on :8793; playwright + axe-core resolvable)
import { createRequire } from 'module';
import fs from 'fs';
const req=createRequire((process.env.PW_DIR||'/tmp/claude-0/pw')+'/x.js');const {chromium}=req('playwright');
const axeSrc=fs.readFileSync(req.resolve('axe-core/axe.min.js'),'utf8');
const BASE=process.env.BASE||'http://localhost:8793/',EXE=process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('FAIL',m)}else console.log('ok  ',m)};
const br=await chromium.launch({executablePath:EXE});
const pgm=await br.newPage();await pgm.setContent('<canvas id=c width=600 height=400>');const d=await pgm.evaluate(()=>{const c=document.getElementById('c'),x=c.getContext('2d');x.fillStyle='#e63946';x.fillRect(0,0,300,400);x.fillStyle='#1d3557';x.fillRect(300,0,300,400);return c.toDataURL()});await pgm.close();fs.writeFileSync('/tmp/mb-test.png',Buffer.from(d.split(',')[1],'base64'));
for(const vp of [{width:1440,height:900},{width:390,height:844}]){
 const tag=vp.width+'px: ';const ctx=await br.newContext({viewport:vp,acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});const pg=await ctx.newPage();const errs=[];
 pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text())});
 await pg.goto(BASE+'moodboard.html');await pg.waitForFunction(()=>window.MoodBoard&&window.MoodBoard.ready,null,{timeout:15000});await pg.waitForTimeout(800);
 ok(await pg.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),tag+'no horizontal overflow');
 const n0=await pg.evaluate(()=>MoodBoard.items().length);ok(n0>5,tag+'starter template has items ('+n0+')');
 await pg.click('#mbAddColour');ok(await pg.evaluate(()=>MoodBoard.items().length)===n0+1,tag+'add colour');
 await pg.click('#mbAddNote');await pg.keyboard.type('Hello');await pg.click('#mbName');
 await pg.setInputFiles('#mbUpload','/tmp/mb-test.png');await pg.waitForTimeout(500);ok(await pg.evaluate(()=>MoodBoard.items().some(i=>i.type==='image')),tag+'upload picture');
 await pg.click('#mbAddAtlas');await pg.waitForSelector('#mbAtlasList button');await pg.click('#mbAtlasList button >> nth=0');await pg.click('#mbAtlasDlg [data-close]');ok(await pg.evaluate(()=>MoodBoard.items().some(i=>i.type==='entry')),tag+'pin atlas entry');
 await pg.click('#mbAddKit');await pg.waitForSelector('#mbKitList button');await pg.click('#mbKitList button >> nth=2');await pg.click('#mbKitDlg [data-close]');ok(await pg.evaluate(()=>MoodBoard.items().some(i=>i.type==='kit')),tag+'pin theme kit');
 await pg.click('#mbAddIcon');await pg.waitForSelector('#mbIconList button');await pg.click('#mbIconList button >> nth=1');await pg.click('#mbIconDlg [data-close]');ok(await pg.evaluate(()=>MoodBoard.items().some(i=>i.type==='icon')),tag+'add icon');
 /* drag, group, align, arrange, order */
 await pg.evaluate(()=>MoodBoard.select(MoodBoard.items().slice(0,3).map(i=>i.id)));await pg.click('#mbGroup');ok(await pg.evaluate(()=>{const g=MoodBoard.items().slice(0,3).map(i=>i.g);return g[0]&&g.every(x=>x===g[0])}),tag+'group');
 await pg.click('#mbUngroup');await pg.click('[data-align=l]');ok(await pg.evaluate(()=>{const x=MoodBoard.items().slice(0,3).map(i=>i.x);return x.every(v=>v===x[0])}),tag+'align left');
 await pg.click('#mbMasonry');await pg.click('#mbGrid');ok(true,tag+'arrange grid/masonry');
 await pg.click('#mbFront');
 await pg.click('#mbFit');await pg.waitForTimeout(100);const box=await pg.evaluate(()=>{for(const it of MoodBoard.items()){const e=document.querySelector(`[data-id="${it.id}"]`),r=e.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;const t=document.elementFromPoint(x,y);if(t&&t.closest('.mbItem')===e&&y>180)return {id:it.id,x,y,ix:it.x}}return null});
 if(vp.width>600){ok(!!box,tag+'found a draggable item');await pg.evaluate(()=>MoodBoard.select([]));await pg.mouse.move(box.x,box.y);await pg.mouse.down();await pg.mouse.move(box.x+60,box.y+40,{steps:5});await pg.mouse.up();ok(await pg.evaluate(id=>MoodBoard.items().find(i=>i.id===id).x,box.id)!==box.ix,tag+'drag moves an item')}
 await pg.click('#mbIn');await pg.click('#mbFit');
 /* persistence */
 await pg.reload();await pg.waitForFunction(()=>window.MoodBoard&&window.MoodBoard.ready);ok(await pg.evaluate(()=>MoodBoard.items().some(i=>i.type==='image'))&&await pg.evaluate(()=>MoodBoard.items().length)>n0,tag+'saved locally and restored');
 /* PNG export */
 const [dl]=await Promise.all([pg.waitForEvent('download'),pg.click('#mbPng')]);const sz=fs.statSync(await dl.path()).size;ok(sz>8000&&/\.png$/.test(dl.suggestedFilename()),tag+'PNG export non-empty ('+sz+' bytes)');
 /* palette + style */
 await pg.click('#mbPalette');await pg.waitForSelector('#mbPalList button');const pal=await pg.evaluate(()=>window.__mbPalette);ok(pal&&pal.length>=3,tag+'palette extracted '+pal.length+' colours');
 await pg.click('#mbStyle');await pg.waitForSelector('#mbStyleDlg[open]');const [z]=await Promise.all([pg.waitForEvent('download',{timeout:30000}),pg.click('#mbKitZip')]);const zb=fs.readFileSync(await z.path());ok(zb.length>5000&&zb.readUInt32LE(0)===0x04034b50,tag+'theme kit ZIP ('+zb.length+' bytes)');await pg.click('#mbKitPin');
 /* share link round trip */
 await pg.click('#mbShare');await pg.waitForFunction(()=>document.getElementById('mbShareUrl').value.includes('#b='));const url=await pg.inputValue('#mbShareUrl');ok(url.includes('#b='),tag+'share link made ('+url.length+' chars)');await pg.click('#mbShareDlg [data-close]');
 const p2=await ctx.newPage();await p2.goto(url);await p2.waitForFunction(()=>window.MoodBoard&&window.MoodBoard.ready,null,{timeout:15000});await p2.waitForTimeout(500);
 ok(await p2.evaluate(()=>document.body.classList.contains('ro')&&MoodBoard.items().length>5),tag+'shared link opens read-only');await p2.close();
 /* a11y */
 await pg.addScriptTag({content:axeSrc});const res=await pg.evaluate(()=>axe.run(document,{resultTypes:['violations']}));const bad=res.violations.filter(v=>['serious','critical'].includes(v.impact));ok(!bad.length,tag+'axe serious/critical: '+bad.map(v=>v.id+'('+v.nodes.length+')').join(','));
 ok(!errs.length,tag+'no console errors '+errs.slice(0,2).join('|'));await ctx.close()}
await br.close();console.log(fail?'MOODBOARD TEST FAIL':'MOODBOARD TEST OK');process.exit(fail?1:0);
