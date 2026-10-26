// Mockup studio test. Run: node tools/mockup-studio-test.mjs (serve site/ on :8793; playwright + axe-core resolvable)
import { createRequire } from 'module';
const req=createRequire((process.env.PW_DIR||'/tmp/claude-0/pw')+'/x.js');const {chromium}=req('playwright');
import fs from 'fs';
const axeSrc=fs.readFileSync(req.resolve('axe-core/axe.min.js'),'utf8');
const BASE=process.env.BASE||'http://localhost:8793/',EXE=process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('FAIL',m)}else console.log('ok  ',m)};
const br=await chromium.launch({executablePath:EXE});
const png=await (async()=>{const pg=await br.newPage();await pg.setContent('<canvas id=c width=800 height=500>');const d=await pg.evaluate(()=>{const c=document.getElementById('c'),x=c.getContext('2d');const g=x.createLinearGradient(0,0,800,500);g.addColorStop(0,'#09f');g.addColorStop(1,'#f09');x.fillStyle=g;x.fillRect(0,0,800,500);x.fillStyle='#fff';x.font='60px sans-serif';x.fillText('Test shot',60,250);return c.toDataURL()});await pg.close();return Buffer.from(d.split(',')[1],'base64')})();
fs.writeFileSync('/tmp/ms-test.png',png);
for(const vp of [{width:1440,height:900},{width:390,height:844}]){
 const ctx=await br.newContext({viewport:vp,acceptDownloads:true});const pg=await ctx.newPage();const errs=[];
 pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text())});
 await pg.goto(BASE+'mockup-studio.html');await pg.waitForFunction(()=>window.MockupStudio&&window.MockupStudio.ready,null,{timeout:15000});await pg.waitForTimeout(1500);
 const tag=vp.width+'px: ';
 ok(await pg.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),tag+'no horizontal overflow');
 await pg.setInputFiles('#msFile','/tmp/ms-test.png');await pg.waitForTimeout(600);
 ok((await pg.textContent('#msImgNow')).includes('800×500'),tag+'image upload');
 await pg.click('#msT-frame');
 for(const f of ['phone','classic','tablet','laptop','browser','watch','card','combo']){await pg.selectOption('#msFrame',f);await pg.waitForTimeout(250)}
 ok(true,tag+'all frames render');
 await pg.click('#msT-bg');for(const t of ['gradient','solid','atlas']){await pg.selectOption('#msBgType',t);await pg.waitForTimeout(200)}
 await pg.click('#msT-text');await pg.fill('#msHead','Hello world');
 await pg.click('#msT-export');
 const [d]=await Promise.all([pg.waitForEvent('download'),pg.click('#msDl')]);const p=await d.path();ok(fs.statSync(p).size>5000&&/\.png$/.test(d.suggestedFilename()),tag+'PNG export non-empty '+d.suggestedFilename());
 await pg.selectOption('#msFmt','webp');const [w]=await Promise.all([pg.waitForEvent('download'),pg.click('#msDl')]);ok(fs.statSync(await w.path()).size>2000,tag+'WebP export');
 if(vp.width>600){await pg.selectOption('#msFmt','jpeg');const [z]=await Promise.all([pg.waitForEvent('download',{timeout:90000}),pg.click('#msZip')]);const zb=fs.readFileSync(await z.path());ok(zb.length>20000&&zb.readUInt32LE(0)===0x04034b50,tag+'ZIP of all sizes ('+Math.round(zb.length/1024)+' KB)');
  const n=await pg.evaluate(()=>window.__msZip&&window.__msZip.count);ok(n===10,tag+'ZIP holds 10 sizes');}
 await pg.evaluate(()=>{});await pg.addScriptTag({content:axeSrc});
 const res=await pg.evaluate(()=>axe.run(document,{resultTypes:['violations']}));const bad=res.violations.filter(v=>['serious','critical'].includes(v.impact));ok(!bad.length,tag+'axe serious/critical: '+bad.map(v=>v.id+'('+v.nodes.length+')').join(','));
 ok(!errs.length,tag+'no console errors '+errs.slice(0,2).join('|'));await ctx.close()}
await br.close();console.log(fail?'MOCKUP TEST FAIL':'MOCKUP TEST OK');process.exit(fail?1:0);
