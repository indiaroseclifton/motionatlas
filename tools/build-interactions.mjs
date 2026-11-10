// Builds the tunable interactions in site/interactions/demos/ and splices their entries into the shelf manifest.
//   node tools/build-interactions.mjs
// Each source in tools/interactions/src/<id>.html starts with <!--META {json}--> and may use the markers
// /*BASE*/ (shared styles), /*TUNER*/ (settings bridge: defines S, calm, theme()) and /*CAROUSEL*/ (drag and key engine).
// A source declares its settings in <script type="application/json" id="settings"> and its controls in CONTROLS;
// the shelf reads both over postMessage and writes the chosen values back into the copied file.
import fs from 'fs';import path from 'path';import {fileURLToPath} from 'url';
const here=path.dirname(fileURLToPath(import.meta.url)),src=path.join(here,'interactions'),out=path.join(here,'..','site','interactions');
const rd=f=>fs.readFileSync(path.join(src,f),'utf8').trim();
const BASE=rd('base.css'),TUNER=rd('tuner.js'),CAR=rd('carousel.js');
const man=[];
for(const f of fs.readdirSync(path.join(src,'src')).filter(f=>f.endsWith('.html')).sort()){
 let s=fs.readFileSync(path.join(src,'src',f),'utf8');const m=/^<!--META (.*?)-->\n/.exec(s);if(!m)throw new Error('No META in '+f);
 const meta=JSON.parse(m[1]),id=f.replace('.html','');s=s.slice(m[0].length);
 if(!/id="settings"/.test(s)||!/CONTROLS=/.test(s))throw new Error('No settings or CONTROLS in '+f);
 JSON.parse(/<script type="application\/json" id="settings">([\s\S]*?)<\/script>/.exec(s)[1]);
 s=s.replace('/*BASE*/',()=>BASE).replace('/*TUNER*/',()=>TUNER).replace('/*CAROUSEL*/',()=>CAR);
 fs.writeFileSync(path.join(out,'demos',id+'.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${meta.t}</title>\n${s.trim()}\n</html>\n`);
 const {o,...rest}=meta;man.push({o:o||99,e:{id,uses:rest.uses||[],t:rest.t,cat:rest.cat,tone:rest.tone||'dark',added:'2026-11',tune:true,d:rest.d,how:rest.how,use:rest.use,p:rest.p}});
}
man.sort((a,b)=>a.o-b.o);
const mf=path.join(out,'manifest.js');let t=fs.readFileSync(mf,'utf8');const A='/*LAB-START*/',B='/*LAB-END*/';
const block=A+'\n'+man.map(x=>JSON.stringify(x.e)).join(',\n')+'\n'+B;
if(t.includes(A))t=t.slice(0,t.indexOf(A))+block+t.slice(t.indexOf(B)+B.length);
else{const i=t.lastIndexOf('\n];');t=t.slice(0,i)+',\n'+block+t.slice(i)}
fs.writeFileSync(mf,t);console.log('built',man.length,'tunable interactions');
