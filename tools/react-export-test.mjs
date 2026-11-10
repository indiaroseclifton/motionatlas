// React export test for the component lab (site/component-react.js).
// For each component: takes the exported .jsx module, transpiles it with @babel/standalone, renders it
// with React 18 (UMD) inside StrictMode, performs the component's primary interaction (click / keyboard) and asserts
// the state or ARIA change, that onStateChange fired, and that nothing logged an error.
//
//   (serve site/ on :8772, e.g. cd site && python3 -m http.server 8772)
//   node tools/react-export-test.mjs            # all         node tools/react-export-test.mjs C05,C11   # some
// Needs the playwright package (npm i -D playwright, or run it from a folder whose node_modules has it).
// Env: ATLAS_URL (default http://localhost:8772/), CHROME (Chromium binary), VENDOR (optional local copies of
// react.development.js, react-dom.development.js and babel.min.js; otherwise they load from jsDelivr).
import { chromium } from 'playwright';
import fs from 'fs';
const V=(process.env.VENDOR||'/tmp/claude-0/pw/vendor').replace(/\/?$/,'/');
const BASE=process.env.ATLAS_URL||'http://localhost:8772/';
const CDN={'react.development.js':'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.development.js','react-dom.development.js':'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.development.js','babel.min.js':'https://cdn.jsdelivr.net/npm/@babel/standalone@7.26.4/babel.min.js'};
const only=process.argv[2]?process.argv[2].split(','):null;
const br=await chromium.launch(process.env.CHROME?{executablePath:process.env.CHROME}:fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome')?{executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'}:{});
const ctx=await br.newContext({viewport:{width:1280,height:900},permissions:['clipboard-read','clipboard-write']});
const pg=await ctx.newPage();
await pg.route('**/__vendor/*',async r=>{const f=r.request().url().split('/').pop();if(fs.existsSync(V+f))return r.fulfill({path:V+f,contentType:'text/javascript'});const res=await fetch(CDN[f]);r.fulfill({body:Buffer.from(await res.arrayBuffer()),contentType:'text/javascript'});});
await pg.route('**/__rt.html',r=>r.fulfill({contentType:'text/html',body:`<!doctype html><html><head><meta charset="utf-8"></head><body style="padding:20px">
<script src="atlas-themes.js"></script><script src="component-lab.js"></script><script src="component-react.js"></script>
<script src="/__vendor/react.development.js"></script><script src="/__vendor/react-dom.development.js"></script><script src="/__vendor/babel.min.js"></script>
<script>
window.__errs={};window.__calls={};let CUR='';
const ce=console.error.bind(console);console.error=(...a)=>{(window.__errs[CUR]=window.__errs[CUR]||[]).push(a.map(String).join(' ').slice(0,300));ce(...a);};
window.addEventListener('error',e=>{(window.__errs[CUR]=window.__errs[CUR]||[]).push('ERR '+e.message);});
window.__mount=id=>{CUR=id;const c=ComponentLab.components.find(x=>x.id===id);
 const code=ComponentReact.code(c,{theme:'S05',mode:'light',density:'comfortable',label:'',icon:false});
 let out;try{out=Babel.transform(code,{presets:['react'],plugins:['transform-modules-commonjs'],filename:id+'.jsx'}).code;}catch(e){return 'BABEL '+e.message.slice(0,300);}
 const module={exports:{}};try{new Function('require','module','exports',out)(n=>n==='react'?React:null,module,module.exports);}catch(e){return 'EVAL '+e.message;}
 const host=document.createElement('section');host.id='rt-'+id;host.style.cssText='margin:24px 0;max-width:760px';document.body.append(host);
 window.__calls[id]=0;
 ReactDOM.createRoot(host).render(React.createElement(React.StrictMode,null,React.createElement(module.exports.default,{onStateChange:s=>{window.__calls[id]++;window.__last=s;}})));
 return 'ok:'+code.length;};
</script></body></html>`}));
await pg.goto(BASE+'__rt.html');await pg.waitForFunction(()=>window.Babel&&window.ComponentReact&&window.ReactDOM);
const attr=(l,a)=>l.getAttribute(a);
const T={
 C01:async R=>{await R.locator('.cl-btn.primary').click();return await attr(R.locator('.cl-btn.primary'),'aria-busy')==='true';},
 C02:async R=>{await R.locator('[aria-label=Like]').click();return await attr(R.locator('[aria-label=Like]'),'aria-pressed')==='true';},
 C03:async(R,pg)=>{await R.locator('input.cl-input').fill('ab');await pg.keyboard.press('Tab');return await attr(R.locator('input.cl-input'),'aria-invalid')==='true';},
 C04:async R=>{await R.locator('textarea').fill('x'.repeat(410));return await attr(R.locator('textarea'),'aria-invalid')==='true'&&/Shorten by 10/.test(await R.locator('.cl-msg').first().textContent());},
 C05:async(R,pg)=>{const b=R.locator('.cl-select');await b.click();if(await attr(b,'aria-expanded')!=='true')return 'not expanded';await pg.keyboard.press('ArrowDown');await pg.keyboard.press('Enter');return (await b.textContent()).includes('Review')&&await attr(b,'aria-expanded')==='false';},
 C06:async R=>{await R.locator('[role=combobox]').fill('gar');return await attr(R.locator('[role=combobox]'),'aria-expanded')==='true'&&await R.locator('[role=option]').count()===3;},
 C07:async R=>{await R.locator('.cl-check').first().click();const v=await R.locator('[role=checkbox]').evaluateAll(b=>b.map(x=>x.getAttribute('aria-checked')));return v.every(x=>x==='true')||v.join();},
 C08:async(R,pg)=>{await R.locator('[role=radio]').first().focus();await pg.keyboard.press('ArrowDown');return await attr(R.locator('[role=radio]').nth(1),'aria-checked')==='true';},
 C09:async R=>{await R.locator('.cl-switchrow').first().click();return await attr(R.locator('[role=switch]').first(),'aria-checked')==='true';},
 C10:async(R,pg)=>{await R.locator('[role=slider]').focus();await pg.keyboard.press('ArrowRight');return await attr(R.locator('[role=slider]'),'aria-valuenow')==='25';},
 C11:async R=>{await R.locator('[aria-label="Choose date"]').click();if(!await R.locator('.cl-pop').isVisible())return 'no popover';await R.locator('[data-d="20"]').click();return await R.locator('input.cl-bare').inputValue()==='20/11/2026'&&!(await R.locator('.cl-pop').count());},
 C12:async(R,pg)=>{await R.locator('[data-d][tabindex="0"]').focus();await pg.keyboard.press('ArrowRight');await pg.keyboard.press('Enter');return (await R.locator('[aria-selected=true] button').textContent())==='15';},
 C13:async(R,pg)=>{await R.locator('.cl-drop').evaluate(d=>{const dt=new DataTransfer();dt.items.add(new File(['x'.repeat(2048)],'brief.pdf',{type:'application/pdf'}));d.dispatchEvent(new DragEvent('drop',{dataTransfer:dt,bubbles:true,cancelable:true}));});await pg.waitForTimeout(1200);const t=await R.locator('.cl-filerow').textContent();return /brief\.pdf/.test(t)&&/Uploaded/.test(t)||t;},
 C14:async R=>{await R.locator('.cl-btn.primary').click();return await R.locator('[role=alert]').isVisible()&&await attr(R.locator('input.cl-input').first(),'aria-invalid')==='true';},
 C15:async(R,pg)=>{await R.locator('input[type=search]').fill('clay');await pg.waitForTimeout(600);const s=await R.locator('[role=status]').textContent();await R.locator('[aria-label="Remove Style filter"]').click();return /No entries match “clay”/.test(s)&&await R.locator('.cl-chip').count()===1||s;},
 C16:async R=>{await R.locator('a',{hasText:'Design systems'}).click();return (await R.locator('[aria-current=page]').textContent())==='Design systems';},
 C17:async R=>{await R.locator('[role=tab]').nth(1).click();return await attr(R.locator('[role=tab]').nth(1),'aria-selected')==='true'&&/Fraunces/.test(await R.locator('[role=tabpanel]').textContent());},
 C18:async R=>{await R.locator('a',{hasText:'Projects'}).click();return await attr(R.locator('a',{hasText:'Projects'}),'aria-current')==='page';},
 C19:async R=>{await R.locator('a',{hasText:'Search'}).click();return await attr(R.locator('a',{hasText:'Search'}),'aria-current')==='page';},
 C20:async(R,pg)=>{await R.locator('.cl-cmd input').fill('exp');if(await R.locator('[role=option]').count()!==1)return 'options';await pg.keyboard.press('Enter');await pg.waitForTimeout(120);return /Ran: Export design brief/.test(await R.locator('[data-note]').textContent());},
 C21:async(R,pg)=>{const b=R.locator('[aria-haspopup=dialog]');await b.click();const o=await attr(b,'aria-expanded')==='true'&&await R.locator('.cl-popover').isVisible();await pg.keyboard.press('Escape');return o&&await attr(b,'aria-expanded')==='false'&&!(await R.locator('.cl-popover').isVisible());},
 C22:async(R,pg)=>{await R.locator('.cl-btn').focus();const v=await R.locator('[role=tooltip]').isVisible();await pg.keyboard.press('Escape');return v&&!(await R.locator('[role=tooltip]').isVisible())&&!!(await attr(R.locator('.cl-btn'),'aria-describedby'));},
 C23:async(R,pg)=>{await R.locator('[aria-label=Close]').click();const h=!(await R.locator('.cl-scrim').isVisible());await R.locator('[data-open]').click();return h&&await R.locator('.cl-scrim').isVisible()&&await pg.evaluate(()=>!!document.activeElement.closest('[role=dialog]'));},
 C24:async R=>{await R.locator('[aria-label=Close]').click();const h=!(await R.locator('.cl-drawer').isVisible());await R.locator('.cl-devopen').click();return h&&await R.locator('.cl-drawer').isVisible();},
 C25:async R=>{const b=R.locator('.cl-accitem button').first();await b.click();return await attr(b,'aria-expanded')==='true'&&await R.locator('.cl-accitem p').first().isVisible();},
 C26:async R=>{await R.locator('[aria-label=Dismiss]').click();return !(await R.locator('.cl-toast').isVisible())&&await R.locator('[data-show]').isVisible();},
 C27:async R=>{await R.locator('[data-x]').click();return !(await R.locator('.cl-banner').isVisible());},
 C28:async R=>{await R.locator('[aria-label="Remove Glass"]').click();return await R.locator('.cl-chip').count()===2;},
 C29:async R=>{const b=R.locator('button.cl-av');await b.click();return await attr(b,'aria-expanded')==='true'&&await R.locator('.cl-av[role=img]').count()===9;},
 C30:async R=>{await R.locator('.cl-cardimg').click();return await attr(R.locator('.cl-cardlink'),'aria-current')==='true';},
 C31:async R=>{await R.locator('.cl-sortb',{hasText:'Project'}).click();return await attr(R.locator('th').first(),'aria-sort')==='ascending'&&(await R.locator('tbody tr b').first().textContent())==='Aurora launch';},
 C32:async R=>{await R.locator('button',{hasText:'Next'}).click();return (await R.locator('[aria-current=page]').textContent())==='5';},
 C33:async(R,pg)=>{await R.locator('[role=treeitem]').first().focus();await pg.keyboard.press('ArrowRight');return await attr(R.locator('[role=treeitem]').first(),'aria-expanded')==='true'&&await R.locator('[role=group]').count()===1;},
 C34:async R=>{await R.locator('[data-next]').click();return await attr(R.locator('.cl-steps li').nth(2),'aria-current')==='step';},
 C35:async(R,pg)=>{await R.locator('[data-start]').click();await pg.waitForTimeout(1500);const v=+(await attr(R.locator('[role=progressbar]'),'aria-valuenow'));return v>10||v;},
 C36:async(R,pg)=>{await pg.waitForTimeout(1500);const loaded=await attr(R.locator('.cl-surface'),'aria-busy')===null;await R.locator('[data-reload]').click();return loaded&&await attr(R.locator('.cl-surface'),'aria-busy')==='true';},
 C37:async R=>{await R.locator('.cl-btn').click();return /created/.test(await R.locator('h3').textContent());},
 C38:async R=>{await R.locator('[aria-label="Next slide"]').click();return /3 of 4/.test(await R.locator('.cl-row .cl-muted').first().textContent());},
 C39:async(R,pg)=>{await R.locator('[role=separator]').focus();await pg.keyboard.press('ArrowRight');return await attr(R.locator('[role=separator]'),'aria-valuenow')==='62';},
 C40:async R=>{const b=R.locator('aside button').nth(2);await b.click();return await attr(b,'aria-current')==='page';},
 C41:async R=>{const b=R.locator('[role=radio]',{hasText:'Month'});await b.click();return await attr(b,'aria-checked')==='true';},
 C42:async(R,pg)=>{const b=R.locator('[aria-haspopup=menu]');await b.click();if(await attr(b,'aria-expanded')!=='true')return 'closed';await pg.keyboard.press('Enter');await pg.waitForTimeout(120);return /Rename/.test(await R.locator('[data-note]').textContent())&&await attr(b,'aria-expanded')==='false';},
 C43:async(R,pg)=>{await R.locator('.cl-splitmain').click();await pg.waitForTimeout(120);return /Publishing/.test(await R.locator('[data-note]').textContent());},
 C44:async(R,pg)=>{await R.locator('[role=combobox]').fill('cla');await pg.keyboard.press('Enter');return (await R.locator('.cl-toks').textContent()).includes('Clay');},
 C45:async(R,pg)=>{await R.locator('[role=spinbutton]').focus();await pg.keyboard.press('ArrowUp');return await attr(R.locator('[role=spinbutton]'),'aria-valuenow')==='5';},
 C46:async R=>{await R.locator('input').first().fill('Abcdefgh1234!');return await attr(R.locator('.cl-meter'),'data-s')==='4';},
 C47:async(R,pg)=>{await R.locator('.cl-otpbox input').first().click();await pg.keyboard.type('246810');return /is-done/.test(await attr(R.locator('.cl-otp'),'class'));},
 C48:async R=>{await R.locator('label.cl-star').nth(4).click();return /5 of 5/.test(await R.locator('[data-rv]').textContent());},
 C49:async R=>{await R.locator('[aria-label=Teal]').click();return await R.locator('.cl-cprow .cl-input').inputValue()==='#0f766e';},
 C50:async(R,pg)=>{await R.locator('.cl-rthumb').first().focus();await pg.keyboard.press('ArrowRight');return await attr(R.locator('.cl-rthumb').first(),'aria-valuenow')==='45';},
 C51:async R=>{const b=R.locator('.cl-fchip',{hasText:'Glass'});await b.click();return await attr(b,'aria-pressed')==='true';},
 C52:async(R,pg)=>{await R.locator('.cl-ieedit').first().click();await R.locator('.cl-iew input').first().fill('Moss Notes');await pg.keyboard.press('Enter');return (await R.locator('.cl-ieval').first().textContent())==='Moss Notes';},
 C53:async R=>{const b=R.locator('.cl-tbb').first();await b.click();return await attr(b,'aria-pressed')==='true';},
 C54:async(R,pg)=>{await R.locator('.cl-handle').first().focus();await pg.keyboard.press('Space');await pg.keyboard.press('ArrowDown');await pg.keyboard.press('Space');return await attr(R.locator('.cl-sorti').first(),'data-t')==='Brief';},
 C55:async R=>{await R.locator('[aria-label="Move Moodboard review to Doing"]').click();return (await R.locator('.cl-kbcol').nth(1).textContent()).includes('Moodboard review');},
 C56:async R=>{const b=R.locator('.cl-tlf button',{hasText:'Comments'});await b.click();return await attr(b,'aria-pressed')==='true'&&await R.locator('.cl-tli:visible').count()===2;},
 C57:async R=>{const b=R.locator('.cl-ncbtn');await b.click();return await attr(b,'aria-expanded')==='true'&&await R.locator('.cl-ncp').isVisible();},
 C58:async R=>{await R.locator('.cl-obx .cl-btn').click();return (await R.locator('[data-c]').textContent())==='3 of 5 done';},
 C59:async R=>{await R.locator('[role=radio]',{hasText:'Yearly'}).click();return (await R.locator('.cl-planp b').nth(1).textContent())==='£10';},
 C60:async(R,pg)=>{await R.locator('textarea').fill('Hello there');await pg.keyboard.press('Enter');return (await R.locator('.cl-cm.me').last().textContent()).includes('Hello there');},
 C61:async R=>{const t=R.locator('[role=tab]',{hasText:'HTML'});await t.click();return await attr(t,'aria-selected')==='true'&&(await R.locator('code').textContent()).includes('<article');},
 C62:async R=>{await R.locator('.cl-mpplay').click();return await attr(R.locator('.cl-mpplay'),'aria-label')==='Pause';},
 C63:async R=>{const b=R.locator('.cl-dnb').first();await b.click();return await attr(b,'aria-expanded')==='true'&&await R.locator('.cl-dnp').first().isVisible();},
 C64:async R=>{await R.locator('.cl-ccacc').first().click();return await R.locator('.cl-ccdone').isVisible();},
 C65:async R=>{await R.locator('.cl-stref').click();await R.page().waitForTimeout(150);return (await R.locator('[data-note]').textContent())==='Updated just now';},
 C66:async R=>{await R.locator('.cl-anx').click();return await R.locator('.cl-anshow').isVisible();},
 C67:async R=>{const b=R.locator('.cl-cdp');await b.click();return await attr(b,'aria-pressed')==='true';},
 C68:async(R,pg)=>{const h=R.locator('[role=slider]');await h.focus();await pg.keyboard.press('ArrowRight');return await attr(h,'aria-valuenow')==='55';},
 C69:async R=>{await R.locator('button[aria-label="Next quote"]').click();await R.page().waitForTimeout(350);return await attr(R.locator('.cl-tqs'),'aria-label')==='2 of 3';},
 C70:async R=>{await R.locator('.cl-cfb').click();await R.page().waitForTimeout(200);return (await R.locator('[data-note]').textContent()).length>5;},
};
const ids=await pg.evaluate(()=>ComponentLab.components.map(c=>c.id));
let pass=0;const fails=[];const sizes={};
for(const id of ids){if(only&&!only.includes(id))continue;
 const m=await pg.evaluate(id=>window.__mount(id),id);
 if(!m.startsWith('ok')){fails.push([id,m]);console.log(id,'FAIL',m);continue;}
 sizes[id]=+m.split(':')[1];
 await pg.waitForTimeout(150);
 const R=pg.locator('#rt-'+id);
 const before=await pg.evaluate(id=>window.__calls[id],id);
 let res;try{res=await T[id](R,pg);}catch(e){res='THROW '+e.message.split('\n')[0];}
 await pg.waitForTimeout(400);
 const after=await pg.evaluate(id=>window.__calls[id],id);
 const errs=await pg.evaluate(id=>window.__errs[id]||[],id);
 const ok=res===true&&after>before&&!errs.length;
 if(ok)pass++;else{fails.push([id,res,`calls ${before}->${after}`,errs.slice(0,3)]);}
 console.log(id,ok?'PASS':'FAIL',ok?'':JSON.stringify([res,before,after,errs.slice(0,2)]));
}
console.log(`\nReact export: ${pass}/${only?only.length:ids.length} passed`);
if(process.env.RESULT)fs.writeFileSync(process.env.RESULT,JSON.stringify({pass,total:only?only.length:ids.length,fails,sizes},null,1));
await br.close();process.exit(fails.length?1:0);
