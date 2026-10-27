'use strict';
/* Theme kits, brand layer: colour maths, scales, light/dark modes, type scale, token exports
   (CSS, SCSS, W3C-style JSON, Tailwind preset), brand applications as SVG (OG card, slide,
   email header, favicon, business cards, clear-space sheet), standalone HTML (demo, components,
   guidelines) and the zip builder.  Public API on window.ThemeKits:
     scales(k) modes(k) typeScale(k) ratio(a,b) grade(r) css(k) scss(k) json(k) tailwind(k)
     componentsCSS(k) og(k,img) slide(k,img) email(k,img) favicon(k) cardFront(k) cardBack(k)
     clearspace(k) prompt(k) bgJS(k) stillURL(k,w,h,type) files(k) -> Promise<[name,data][]>
     zipKit(k) -> Promise<Blob>   fileList(k) -> [name, description][]                       */
(()=>{
const TK=window.ThemeKits;
/* ---------- colour ---------- */
const hx=h=>{h=h.replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
const toHex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('').toUpperCase();
const mix=(a,b,p)=>{const A=hx(a),B=hx(b);return toHex(A.map((v,i)=>v+(B[i]-v)*p))};
const lum=h=>{const c=hx(h).map(v=>v/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const grade=r=>r>=7?'AAA':r>=4.5?'AA':r>=3?'AA large':'fail';
const best=bg=>ratio('#FFFFFF',bg)>=ratio('#000000',bg)?'#FFFFFF':'#000000';
function ensure(fg,bgs,min){bgs=[].concat(bgs);const ok=c=>bgs.every(b=>ratio(c,b)>=min);if(ok(fg))return fg;const to=best(bgs[0]);for(let p=.04;p<=1.001;p+=.04){const c=mix(fg,to,p);if(ok(c))return c}return to}
const isDark=t=>lum(t.bg)<.18;
const STEPS=[[50,'w',.92],[100,'w',.84],[200,'w',.68],[300,'w',.5],[400,'w',.28],[500,'',0],[600,'b',.18],[700,'b',.36],[800,'b',.54],[900,'b',.7],[950,'b',.82]];
const ramp=hex=>STEPS.map(([s,d,p])=>[s,d==='w'?mix(hex,'#FFFFFF',p):d==='b'?mix(hex,'#000000',p):hex.toUpperCase()]);
function neutral(t){const light=lum(t.bg)>lum(t.ink)?t.bg:t.ink,dark=light===t.bg?t.ink:t.bg;return [.02,.07,.15,.27,.4,.52,.63,.73,.82,.9,.95].map((p,i)=>[STEPS[i][0],mix(light,dark,p)])}
function scales(k){const t=k.t,o={accent:ramp(t.accent),'accent-2':ramp(t.accent2),neutral:neutral(t)};if(t.accent3)o['accent-3']=ramp(t.accent3);return o}
function complete(t){return {...t,accentText:t.accentText||ensure(t.accent,[t.bg,t.surface],4.5)}}
function derive(t,toLight){let bg,surface,ink;
 if(toLight){bg=mix(t.ink,'#FFFFFF',.62);if(lum(bg)<.78)bg=mix(bg,'#FFFFFF',.5);surface=mix(bg,'#FFFFFF',.7);ink=ensure(t.bg,[bg,surface],12)}
 else{bg=mix(mix(t.ink,'#000000',.4),t.accent,.07);while(lum(bg)>.012)bg=mix(bg,'#000000',.3);surface=mix(bg,'#FFFFFF',.06);ink=ensure(t.bg,[bg,surface],12)}
 const mute=ensure(mix(ink,bg,.38),[bg,surface],4.6),line=mix(ink,bg,.8),accent=ensure(t.accent,[bg],3);
 const onAccent=[t.onAccent,ink,bg,'#FFFFFF','#000000'].find(c=>ratio(c,accent)>=4.5)||best(accent);
 const o={...t,bg,surface,ink,mute,line,accent,onAccent,accent2:ensure(t.accent2,[bg],3),accentText:ensure(accent,[bg,surface],4.5),
  shadow:toLight?'0 1px 2px rgba(0,0,0,.08), 0 10px 30px -16px rgba(0,0,0,.25)':`0 0 0 1px ${line}`,glow:`0 0 0 3px ${accent}66`};
 if(t.accent3)o.accent3=ensure(t.accent3,[bg],3);return o}
function modes(k){if(k._modes)return k._modes;const t=k.t,dk=isDark(t),base=complete(t);let alt=null;if(!k.single)alt=k.alt?complete({...t,...k.alt}):derive(t,dk);
 return k._modes={primary:dk?'dark':'light',dark:dk?base:alt,light:dk?alt:base,single:k.single||''}}
const TS=[['xs',-2],['sm',-1],['base',0],['lg',1],['xl',2],['2xl',3],['3xl',4],['4xl',5],['5xl',6]];
function typeScale(k){const r=Math.min(1.333,k.scale||1.25);return TS.map(([n,e])=>({name:n,px:Math.round(16*r**e),lh:e<=0?1.6:e<=2?1.35:e<=4?1.15:1.04,face:e<=0?'body':'head'}))}
const famName=s=>s.split(',')[0].replace(/['"]/g,'').trim();
const famList=s=>s.split(',').map(x=>x.trim().replace(/^['"]|['"]$/g,''));
const fontsURL=k=>k.fonts.css?'https://fonts.googleapis.com/css2?'+k.fonts.css+'&display=swap':'';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const caseT=(k,s)=>k.case==='upper'?String(s).toUpperCase():String(s);
const MODE_KEYS=[['bg','bg'],['surface','surface'],['ink','ink'],['mute','mute'],['line','line'],['accent','accent'],['on-accent','onAccent'],['accent-text','accentText'],['accent-2','accent2'],['accent-3','accent3'],['shadow','shadow'],['glow','glow']];

/* ---------- SVG helpers ---------- */
const NS='xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
const fontStyle=k=>fontsURL(k)?`<style><![CDATA[${fontsURL(k)?`@import url('${fontsURL(k)}');`:''}]]></style>`:'';
const inner=s=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
const scope=(s,p)=>s.replace(/id="([^"]+)"/g,`id="${p}-$1"`).replace(/url\(#([^)]+)\)/g,`url(#${p}-$1)`).replace(/href="#([^"]+)"/g,`href="#${p}-$1"`);
const dims=s=>{const m=s.match(/width="([\d.]+)"\s+height="([\d.]+)"/);return m?[+m[1],+m[2]]:[80,80]};
const patDef=(k,id)=>{const p=TK.pattern(k),[w,h]=dims(p);return `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${scope(inner(p),id)}</pattern>`};
const markG=(k,x,y,s,id='m')=>`<g transform="translate(${x} ${y}) scale(${s})">${scope(TK.mark(k),id)}</g>`;
const head=(k)=>`font-family="${TK.headFam(k)}" font-weight="${k.hw||400}"`;
const body=(k,w=400)=>`font-family="${k.fonts.body.replace(/"/g,"'")}" font-weight="${w}"`;
function fit(k,text,maxW,base,maxLines=2){const T=caseT(k,text),wf=(k.wf||.62)*(k.case==='upper'?1.1:1),w1=T.length*base*wf;if(w1<=maxW||maxLines<2)return {lines:[T],size:Math.min(base,Math.floor(maxW/(T.length*wf)))};
 const words=T.split(' ');let best=null;for(let i=1;i<words.length;i++){const a=words.slice(0,i).join(' '),b=words.slice(i).join(' '),m=Math.max(a.length,b.length);if(!best||m<best.m)best={a,b,m}}
 if(!best)return {lines:[T],size:Math.floor(maxW/(T.length*wf))};return {lines:[best.a,best.b],size:Math.min(base,Math.floor(maxW/(best.m*wf)))}}
const tspans=(f,x,y,lh)=>f.lines.map((l,i)=>`<tspan x="${x}" y="${y+i*f.size*lh}">${esc(l)}</tspan>`).join('');
const ls=k=>k.case==='upper'?' letter-spacing="0.02em"':'';
function wrapSVG(k,w,h,content,o={}){return `<svg ${NS} width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${o.fonts?`<defs>${fontStyle(k)}</defs>`:''}${content}</svg>`}
const imgEl=(img,w,h)=>img?`<image xlink:href="${img}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`:'';
function scrim(k,id,dir='h'){const t=k.t;return `<linearGradient id="${id}" x1="0" y1="${dir==='v'?1:0}" x2="${dir==='v'?0:1}" y2="0"><stop offset="0" stop-color="${t.bg}" stop-opacity=".94"/><stop offset=".55" stop-color="${t.bg}" stop-opacity=".7"/><stop offset="1" stop-color="${t.bg}" stop-opacity=".12"/></linearGradient>`}

function og(k,img,o={}){const t=k.t,W=1200,H=630,f=fit(k,k.voice[0],1000,92),y0=f.lines.length>1?250:300;
 return wrapSVG(k,W,H,`<defs>${patDef(k,'pt')}${scrim(k,'sc')}</defs><rect width="${W}" height="${H}" fill="${t.bg}"/>${img?imgEl(img,W,H):`<rect width="${W}" height="${H}" fill="url(#pt)" opacity=".5"/>`}<rect width="${W}" height="${H}" fill="url(#sc)"/>
${markG(k,72,64,1)}<text x="156" y="108" fill="${t.ink}" ${head(k)} font-size="30"${ls(k)}>${esc(caseT(k,k.name))}</text>
<text ${head(k)} fill="${t.ink}" font-size="${f.size}"${ls(k)}>${tspans(f,72,y0,1.04)}</text>
<text x="72" y="${y0+f.size*1.04*(f.lines.length-1)+70}" fill="${t.ink}" ${body(k)} font-size="30">${esc(k.tagline)}</text>
<rect x="72" y="530" width="120" height="8" fill="${t.accent}"/><text x="72" y="580" fill="${t.mute}" ${body(k,600)} font-size="22" letter-spacing="2">KIT ${k.no} · ${esc(k.name.toUpperCase())}</text>`,o)}
function slide(k,img,o={}){const t=k.t,W=1920,H=1080,f=fit(k,k.voice[0],1500,150),y0=f.lines.length>1?470:540;
 return wrapSVG(k,W,H,`<defs>${patDef(k,'pt')}${scrim(k,'sc')}</defs><rect width="${W}" height="${H}" fill="${t.bg}"/>${img?imgEl(img,W,H):`<rect width="${W}" height="${H}" fill="url(#pt)" opacity=".5"/>`}<rect width="${W}" height="${H}" fill="url(#sc)"/>
${markG(k,120,96,1.25)}<text x="224" y="152" fill="${t.ink}" ${head(k)} font-size="38"${ls(k)}>${esc(caseT(k,k.name))}</text>
<text x="120" y="${y0-f.size-24}" fill="${t.mute}" ${body(k,600)} font-size="30" letter-spacing="4">TITLE SLIDE · ${esc(k.mood.split(',')[0].toUpperCase())}</text>
<text ${head(k)} fill="${t.ink}" font-size="${f.size}"${ls(k)}>${tspans(f,120,y0,1.04)}</text>
<text x="120" y="${y0+f.size*1.04*(f.lines.length-1)+100}" fill="${t.ink}" ${body(k)} font-size="46">${esc(k.tagline)}</text>
<rect x="120" y="960" width="1680" height="2" fill="${t.line}"/><rect x="120" y="958" width="160" height="6" fill="${t.accent}"/>
<text x="120" y="1016" fill="${t.mute}" ${body(k,500)} font-size="28">${esc(k.name)} · Kit ${k.no}</text><text x="1800" y="1016" text-anchor="end" fill="${t.mute}" ${body(k,500)} font-size="28">01</text>`,o)}
function email(k,img,o={}){const t=k.t,W=600,H=200,f=fit(k,k.name,440,40,1);
 return wrapSVG(k,W,H,`<defs>${patDef(k,'pt')}${scrim(k,'sc')}</defs><rect width="${W}" height="${H}" fill="${t.bg}"/>${img?imgEl(img,W,H):`<rect width="${W}" height="${H}" fill="url(#pt)" opacity=".5"/>`}<rect width="${W}" height="${H}" fill="url(#sc)"/>
${markG(k,32,52,.75)}<text x="96" y="92" fill="${t.ink}" ${head(k)} font-size="${f.size}"${ls(k)}>${esc(f.lines[0])}</text><text x="96" y="126" fill="${t.ink}" ${body(k,500)} font-size="16">${esc(k.voice[1])}</text><rect x="0" y="${H-6}" width="${W}" height="6" fill="${t.accent}"/>`,o)}
function favicon(k){const t=k.t,r=parseFloat(t.radius)>12?32:parseFloat(t.radius)>0?14:0;return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="${r}" fill="${t.bg}"/><g transform="translate(8 8) scale(.75)">${scope(TK.mark(k),'f')}</g></svg>`}
function cardFront(k,o={}){const t=k.t,W=1050,H=600,f=fit(k,k.name,520,60,1);
 return wrapSVG(k,W,H,`<defs>${patDef(k,'pt')}</defs><rect width="${W}" height="${H}" fill="${t.bg}"/><rect x="680" width="370" height="${H}" fill="url(#pt)"/><rect x="680" width="2" height="${H}" fill="${t.line}"/>
${markG(k,90,150,2.5)}<text x="90" y="450" fill="${t.ink}" ${head(k)} font-size="${f.size}"${ls(k)}>${esc(f.lines[0])}</text><text x="90" y="500" fill="${t.mute}" ${body(k)} font-size="24">${esc(k.tagline)}</text>`,o)}
function cardBack(k,o={}){const t=k.t,W=1050,H=600,dom=k.id+'.studio';
 return wrapSVG(k,W,H,`<rect width="${W}" height="${H}" fill="${t.surface}"/><rect width="18" height="${H}" fill="${t.accent}"/>
<text x="90" y="170" fill="${t.ink}" ${head(k)} font-size="54"${ls(k)}>${esc(caseT(k,'Alex Morgan'))}</text><text x="90" y="216" fill="${t.mute}" ${body(k,500)} font-size="26">${esc(k.role||'Founder')}</text>
<rect x="90" y="262" width="80" height="4" fill="${t.accent}"/>
<g fill="${t.ink}" ${body(k)} font-size="26"><text x="90" y="340">hello@${dom}</text><text x="90" y="384">+00 (0)00 0000 0000</text><text x="90" y="428">${dom}</text></g>
${markG(k,890,440,1.4,'mb')}`,o)}
function clearspace(k,o={}){const t=k.t,L=TK.logo(k,false),[lw]=dims(L),cs=40,pad=28,W=lw+cs*2+pad*2,H=80+cs*2+pad*2;
 return wrapSVG(k,W,H,`<rect width="${W}" height="${H}" fill="${t.bg}"/><rect x="${pad}" y="${pad}" width="${lw+cs*2}" height="${80+cs*2}" fill="${t.accent}" fill-opacity=".1" stroke="${t.accent}" stroke-dasharray="6 5"/><rect x="${pad+cs}" y="${pad+cs}" width="${lw}" height="80" fill="${t.bg}" stroke="${t.mute}" stroke-dasharray="2 4"/>
<g transform="translate(${pad+cs} ${pad+cs})">${scope(inner(L),'l')}</g>
<g fill="${t.mute}" font-family="ui-monospace,monospace" font-size="13"><text x="${pad+cs/2}" y="${pad+cs+44}" text-anchor="middle">x</text><text x="${pad+cs+lw/2}" y="${pad+cs/2+5}" text-anchor="middle">x</text><text x="${pad+cs*1.5+lw}" y="${pad+cs+44}" text-anchor="middle">x</text><text x="${pad+cs+lw/2}" y="${pad+cs*1.5+85}" text-anchor="middle">x</text></g>`,o)}
const logoFile=(k,dark,o={})=>{const s=TK.logo(k,dark);return o.fonts?s.replace(/^(<svg[^>]*>)/,`$1<defs>${fontStyle(k)}</defs>`):s};

/* ---------- token exports ---------- */
function modeVars(m,ind='  '){return MODE_KEYS.filter(([,key])=>m[key]).map(([n,key])=>`${ind}--${n}: ${m[key]};`).join('\n')}
function css(k){const M=modes(k),P=M[M.primary],S=scales(k);
 return `/* ${k.name} (${k.no}) theme kit · tokens.css · Visual & Motion Atlas
   Primary mode: ${M.primary}. ${M.single?M.single:`Switch with <html data-theme="${M.primary==='dark'?'light':'dark'}">.`} */
${fontsURL(k)?`@import url('${fontsURL(k)}');`:''}
:root{
  color-scheme: ${M.primary};
${modeVars(P)}
${Object.entries(S).map(([n,arr])=>arr.map(([s,h])=>`  --${n}-${s}: ${h};`).join('\n')).join('\n')}
  --font-head: ${k.fonts.head};
  --font-body: ${k.fonts.body};
  --head-weight: ${k.hw||400};
  --case: ${k.case==='upper'?'uppercase':'none'};
  --radius: ${k.t.radius};
  --stroke: ${k.stroke.w}px;
${typeScale(k).map(s=>`  --text-${s.name}: ${s.px}px;\n  --leading-${s.name}: ${s.lh};`).join('\n')}
}
${['light','dark'].filter(m=>M[m]).map(m=>`[data-theme="${m}"]{\n  color-scheme: ${m};\n${modeVars(M[m])}\n}`).join('\n')}
body{margin:0;background:var(--bg);color:var(--ink);font:var(--text-base)/var(--leading-base) var(--font-body)}
h1,h2,h3,h4{font-family:var(--font-head);font-weight:var(--head-weight);text-transform:var(--case);margin:0 0 .4em}
h1{font-size:var(--text-5xl);line-height:var(--leading-5xl)}h2{font-size:var(--text-4xl);line-height:var(--leading-4xl)}h3{font-size:var(--text-2xl);line-height:var(--leading-2xl)}h4{font-size:var(--text-xl);line-height:var(--leading-xl)}
a{color:var(--accent-text)}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
`}
function componentsCSS(k){return `/* ${k.name} (${k.no}) · components.css · uses only the variables in tokens.css */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 20px;border:2px solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--on-accent);font:600 15px/1 var(--font-body);text-transform:var(--case);letter-spacing:.02em;cursor:pointer;text-decoration:none}
.btn:hover{box-shadow:var(--glow)}.btn[disabled]{opacity:.45;cursor:not-allowed;box-shadow:none}
.btn-ghost{background:transparent;color:var(--ink);border-color:var(--line)}.btn-sm{min-height:34px;padding:0 12px;font-size:13px}
.field{display:grid;gap:6px}.label{font-weight:600;font-size:14px}.hint{font-size:13px;color:var(--mute);margin:0}.error{font-size:13px;color:var(--accent-text);margin:0;font-weight:600}
.input,.select{width:100%;min-height:44px;padding:0 14px;border:1px solid var(--line);border-radius:var(--radius);background:var(--bg);color:var(--ink);font:inherit}
.input:focus,.select:focus{outline:none;border-color:var(--accent);box-shadow:var(--glow)}.input[aria-invalid=true]{border-color:var(--accent);border-width:2px}
.check{display:flex;align-items:center;gap:10px;cursor:pointer}.check input{width:20px;height:20px;accent-color:var(--accent)}
.tag{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border:1px solid var(--line);border-radius:999px;font-size:12.5px;font-weight:600;color:var(--ink);text-transform:var(--case)}
.tag-solid{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}.tag i{width:7px;height:7px;border-radius:50%;background:var(--accent)}
.nav{display:flex;align-items:center;gap:18px;padding:12px 16px;border-bottom:1px solid var(--line)}.nav a{color:var(--mute);text-decoration:none}.nav a[aria-current]{color:var(--ink);font-weight:600}.nav .btn{margin-left:auto}
.list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}.list li{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:12px 4px;border-bottom:1px solid var(--line)}
.list b{display:block;font-weight:600}.list small{color:var(--mute)}.list .val{font-variant-numeric:tabular-nums;font-weight:600}
.table{width:100%;border-collapse:collapse;font-size:14px}.table th,.table td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--line)}.table th{color:var(--mute);font-size:12px;letter-spacing:.08em;text-transform:uppercase}.table td.num{text-align:right;font-variant-numeric:tabular-nums}
.toast{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:var(--radius);background:var(--ink);color:var(--bg);box-shadow:var(--shadow);max-width:420px}.toast button{margin-left:auto;background:none;border:0;color:inherit;font:600 14px var(--font-body);text-decoration:underline;cursor:pointer}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:24px}
`}
function scss(k){const M=modes(k),P=M[M.primary],S=scales(k),q=s=>/^[#\d]/.test(s)||/^\d/.test(s)?s:`unquote("${s}")`;
 return `// ${k.name} (${k.no}) theme kit · tokens.scss · Visual & Motion Atlas
@use "sass:map";
${fontsURL(k)?`@import url('${fontsURL(k)}');`:''}

${MODE_KEYS.filter(([,key])=>P[key]).map(([n,key])=>`$${n}: ${/shadow|glow/.test(n)?q(P[key]):P[key]};`).join('\n')}
$font-head: ${k.fonts.head};
$font-body: ${k.fonts.body};
$head-weight: ${k.hw||400};
$radius: ${k.t.radius};
$stroke: ${k.stroke.w}px;

$type-scale: (
${typeScale(k).map(s=>`  "${s.name}": (size: ${s.px}px, leading: ${s.lh}),`).join('\n')}
);
${Object.entries(S).map(([n,arr])=>`$${n}-scale: (\n${arr.map(([s,h])=>`  ${s}: ${h},`).join('\n')}\n);`).join('\n')}

$modes: (
${['light','dark'].filter(m=>M[m]).map(m=>`  "${m}": (\n${MODE_KEYS.filter(([,key])=>M[m][key]).map(([n,key])=>`    "${n}": ${/shadow|glow/.test(n)?q(M[m][key]):M[m][key]},`).join('\n')}\n  ),`).join('\n')}
);

// @include theme("${M.primary}"); writes the CSS custom properties for a mode.
@mixin theme($mode) {
  @each $name, $value in map.get($modes, $mode) { --#{$name}: #{$value}; }
}
`}
function json(k){const M=modes(k),S=scales(k),grp=m=>{const o={$type:'color'};MODE_KEYS.filter(([n,key])=>m[key]&&!/shadow|glow/.test(n)).forEach(([n,key])=>o[n]={$value:m[key]});return o};
 const sc={$type:'color'};Object.entries(S).forEach(([n,arr])=>{sc[n]={};arr.forEach(([s,h])=>sc[n][s]={$value:h})});
 const fs={$type:'dimension'},lh={$type:'number'};typeScale(k).forEach(s=>{fs[s.name]={$value:s.px+'px'};lh[s.name]={$value:s.lh}});
 const P=M[M.primary];
 return JSON.stringify({$description:`${k.name} (${k.no}) theme kit. ${k.tagline} Format follows the W3C Design Tokens Community Group draft.`,
  color:grp(P),mode:Object.fromEntries(['light','dark'].filter(m=>M[m]).map(m=>[m,grp(M[m])])),scale:sc,
  font:{family:{$type:'fontFamily',head:{$value:famList(k.fonts.head)},body:{$value:famList(k.fonts.body)}},weight:{$type:'fontWeight',head:{$value:k.hw||400},body:{$value:400}}},
  'font-size':fs,'line-height':lh,radius:{$type:'dimension',base:{$value:k.t.radius}},stroke:{$type:'dimension',icon:{$value:k.stroke.w+'px'}},
  shadow:{base:{$value:P.shadow,$description:'CSS box-shadow'},glow:{$value:P.glow,$description:'Focus and hover ring, CSS box-shadow'}},
  $extensions:{'com.motionatlas.kit':{id:k.id,number:k.no,name:k.name,tagline:k.tagline,mood:k.mood,feel:k.feel,primaryMode:M.primary,textCase:k.case,iconStroke:k.stroke,googleFonts:fontsURL(k),voice:k.voice,dos:k.dos,donts:k.donts}}},null,2)}
function tailwind(k){const M=modes(k),S=scales(k),P=M[M.primary];
 return `/* ${k.name} (${k.no}) theme kit · Tailwind preset · Visual & Motion Atlas
   Use it as a preset:  module.exports = { presets: [require('./tailwind.config.js')], content: [...] }
   Semantic colours read the CSS variables in tokens.css, so data-theme switching keeps working. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
${MODE_KEYS.filter(([n,key])=>P[key]&&!/shadow|glow/.test(n)&&!S[n]).map(([n])=>`        '${n}': 'var(--${n})',`).join('\n')}
${Object.entries(S).map(([n,arr])=>`        '${n}': { ${arr.map(([s,h])=>`${s}: '${h}'`).join(', ')}, DEFAULT: '${n==='neutral'?arr[5][1]:`var(--${n})`}' },`).join('\n')}
      },
      fontFamily: { head: ${JSON.stringify(famList(k.fonts.head))}, body: ${JSON.stringify(famList(k.fonts.body))} },
      fontSize: {
${typeScale(k).map(s=>`        '${s.name}': ['${s.px}px', { lineHeight: '${s.lh}' }],`).join('\n')}
      },
      borderRadius: { kit: '${k.t.radius}' },
      boxShadow: { kit: 'var(--shadow)', glow: 'var(--glow)' },
      strokeWidth: { icon: '${k.stroke.w}' }
    }
  }
};
`}
function prompt(k){const t=k.t,M=modes(k),ts=typeScale(k);return `Design and build a website in the “${k.name}” theme (${k.tagline}). Mood: ${k.mood}.
Colours (${M.primary} mode): background ${t.bg}, surfaces ${t.surface}, text ${t.ink}, muted text ${t.mute}, lines ${t.line}, accent ${t.accent} (text on accent ${t.onAccent}), second accent ${t.accent2}${t.accent3?`, third accent ${t.accent3}`:''}.${M.single?' '+M.single:` A ${M.primary==='dark'?'light':'dark'} variant uses background ${M[M.primary==='dark'?'light':'dark'].bg} and text ${M[M.primary==='dark'?'light':'dark'].ink}.`}
Type: headings in ${famName(k.fonts.head)} weight ${k.hw||400}${k.case==='upper'?' set in capitals':''}, body in ${famName(k.fonts.body)} (Google Fonts). Type scale ${ts.map(s=>s.name+' '+s.px+'px').join(', ')}.
Corner radius ${t.radius}. Shadow: ${t.shadow}. Focus and hover ring: ${t.glow}. Icons: ${k.stroke.w}px strokes with ${k.stroke.cap} caps.
Signature background: ${k.bgDesc}, on a canvas behind the hero, still under prefers-reduced-motion and with a pause button.
Voice: ${k.voice.join(' / ')}
Do: ${k.dos.join(' ')}
Avoid: ${k.donts.join(' ')}
Keep text contrast at WCAG AA and make every control keyboard-accessible.`}
function bgJS(k){return `/* ${k.name} (${k.no}) animated background · Visual & Motion Atlas
   startBackground(canvas, still) draws on the canvas and returns a stop() function.
   Pass still=true for a single frame (use it under prefers-reduced-motion). */
(function(){var T=${JSON.stringify(k.t)};var draw=${TK.BG[k.bg].toString().replace(/^\w+\(/,'function(')};
window.startBackground=function(canvas,still){return draw(canvas,T,!!still)};})();
`}

/* ---------- standalone HTML ---------- */
const page=(k,title,bodyHTML,extraHead='')=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><link rel="icon" href="svg/favicon.svg"><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="components.css">${extraHead}</head><body>${bodyHTML}</body></html>`;
const modeToggle=k=>modes(k).single?'':`<button class="btn btn-ghost btn-sm" id="mode" type="button">Switch to ${modes(k).primary==='dark'?'light':'dark'}</button><script>(function(){var b=document.getElementById('mode'),p='${modes(k).primary}',o=p==='dark'?'light':'dark';b.onclick=function(){var c=document.documentElement.getAttribute('data-theme')===o?p:o;document.documentElement.setAttribute('data-theme',c);b.textContent='Switch to '+(c===p?o:p)}})();<\/script>`;
function componentsSheet(k){const i=n=>TK.icon(k,n,20,'currentColor').replace('<svg ','<svg aria-hidden="true" ');return `
<nav class="nav" aria-label="Example"><img src="svg/mark.svg" alt="" width="28" height="28"><a href="#" aria-current="page">Home</a><a href="#">Work</a><a href="#">About</a><a class="btn btn-sm" href="#">Join</a></nav>
<section><h3>Buttons</h3><p style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn">${i('arrow')}Primary</button><button class="btn btn-ghost">Secondary</button><button class="btn btn-sm">Small</button><button class="btn" disabled>Disabled</button></p></section>
<section><h3>Inputs</h3><div class="field"><label class="label" for="e">Email</label><input class="input" id="e" type="email" placeholder="you@example.com" aria-describedby="eh"><p class="hint" id="eh">We only use it to send the kit.</p></div>
<div class="field"><label class="label" for="n">Name</label><input class="input" id="n" aria-invalid="true" aria-describedby="ne" value=""><p class="error" id="ne">Enter your name.</p></div>
<div class="field"><label class="label" for="s">Plan</label><select class="select" id="s"><option>Starter</option><option>Studio</option></select></div><label class="check"><input type="checkbox" checked> Send me updates</label></section>
<section><h3>List rows</h3><ul class="list"><li>${i('mail')}<span><b>Welcome email</b><small>Sent 2 minutes ago</small></span><span class="val">98%</span></li><li>${i('calendar')}<span><b>Launch review</b><small>Thursday, 10:00</small></span><span class="val">3</span></li><li>${i('bell')}<span><b>Alerts</b><small>Two need attention</small></span><span class="val">2</span></li></ul></section>
<section><h3>Tags</h3><p style="display:flex;gap:8px;flex-wrap:wrap"><span class="tag tag-solid">Live</span><span class="tag"><i></i>Draft</span><span class="tag">Kit ${k.no}</span></p></section>
<section><h3>Table</h3><table class="table"><thead><tr><th scope="col">Item</th><th scope="col">Status</th><th scope="col" style="text-align:right">Value</th></tr></thead><tbody><tr><td>Tokens</td><td>Ready</td><td class="num">48</td></tr><tr><td>Icons</td><td>Ready</td><td class="num">${Object.keys(TK.ICONS).length}</td></tr><tr><td>Templates</td><td>Draft</td><td class="num">6</td></tr></tbody></table></section>
<section><h3>Toast</h3><div class="toast" role="status">${i('check')}<span>${esc(k.voice[2])}</span><button type="button">Undo</button></div></section>`}
function componentsHTML(k){return page(k,`${k.name} components`,`<main style="max-width:880px;margin:0 auto;padding:48px 24px;display:grid;gap:32px"><header style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap"><h1 style="font-size:var(--text-3xl);margin:0">${esc(k.name)} components</h1>${modeToggle(k)}</header>${componentsSheet(k)}</main>`)}
function demoHTML(k){return page(k,`${k.name} kit demo`,`<style>.hero{position:relative;min-height:80vh;display:grid;align-items:end;padding:6vw;overflow:hidden;isolation:isolate}.hero canvas{position:absolute;inset:0;width:100%;height:100%;z-index:-2}.hero::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,var(--bg) 0,color-mix(in srgb,var(--bg) 70%,transparent) 45%,transparent 80%)}.hero p{max-width:44ch;font-size:var(--text-lg)}.row{display:flex;gap:12px;flex-wrap:wrap}.pause{position:absolute;top:20px;right:20px}main{padding:6vw;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:24px}</style>
<section class="hero"><canvas id="bg" aria-hidden="true"></canvas><button class="btn btn-ghost btn-sm pause" id="p" type="button">Pause</button><img src="svg/logo.svg" alt="${esc(k.name)}" height="56" style="justify-self:start"><h1>${esc(k.voice[0])}</h1><p>${esc(k.tagline)}</p><div class="row"><a class="btn" href="components.html">See components</a><a class="btn btn-ghost" href="guidelines.html">Brand guidelines</a>${modeToggle(k)}</div></section>
<main><div class="card"><h3>Card</h3><p>Surfaces, borders and shadows come from tokens.css.</p><span class="tag tag-solid">New</span></div><div class="card field"><label class="label" for="e">Email</label><input id="e" class="input" placeholder="you@example.com"></div><div class="card"><h3>Icons</h3><img src="svg/icons/home.svg" alt="" width="24"> <img src="svg/icons/search.svg" alt="" width="24"> <img src="svg/icons/heart.svg" alt="" width="24"></div></main>
<script src="background.js"><\/script><script>const c=document.getElementById('bg');const still=matchMedia('(prefers-reduced-motion: reduce)').matches;let stop=startBackground(c,still);let on=!still;const p=document.getElementById('p');p.textContent=on?'Pause':'Play';p.onclick=()=>{stop();on=!on;stop=startBackground(c,!on);p.textContent=on?'Pause':'Play'};<\/script>`)}
function guidelinesHTML(k){const M=modes(k),P=M[M.primary],pairs=[['Text on background',P.ink,P.bg],['Text on surface',P.ink,P.surface],['Muted on background',P.mute,P.bg],['On-accent on accent',P.onAccent,P.accent],['Accent text on background',P.accentText,P.bg]];
 return page(k,`${k.name} brand guidelines`,`<main style="max-width:900px;margin:0 auto;padding:48px 24px;display:grid;gap:40px">
<header><p class="tag">Kit ${k.no} · Brand guidelines</p><h1>${esc(k.name)}</h1><p style="font-size:var(--text-lg)">${esc(k.tagline)} ${esc(k.mood)}.</p></header>
<section><h2 style="font-size:var(--text-2xl)">Logo and clear space</h2><img src="svg/logo-clearspace.svg" alt="Logo with clear space equal to half its height on every side" style="max-width:100%;height:auto"><p>Keep clear space of <b>x</b> (half the logo height) on all sides. Minimum size: logo 120px wide on screen (30mm in print); mark alone 24px. Use logo.svg on the kit background and logo-on-background.svg anywhere else. Never stretch, recolour, outline or rotate the logo.</p></section>
<section><h2 style="font-size:var(--text-2xl)">Colour</h2><div style="display:flex;height:56px;border-radius:var(--radius);overflow:hidden;border:1px solid var(--line)"><span style="flex:6;background:${P.bg}"></span><span style="flex:3;background:${P.surface}"></span><span style="flex:.6;background:${P.ink}"></span><span style="flex:1;background:${P.accent}"></span><span style="flex:.4;background:${P.accent2}"></span></div><p>Roughly 60% background, 30% surfaces and text, 10% accent. ${esc(M.single||`A ${M.primary==='dark'?'light':'dark'} variant ships in tokens.css; switch with data-theme.`)}</p>
<table class="table"><thead><tr><th scope="col">Pair</th><th scope="col">Colours</th><th scope="col" style="text-align:right">Contrast</th></tr></thead><tbody>${pairs.map(([n,a,b])=>`<tr><td>${n}</td><td>${a} on ${b}</td><td class="num">${ratio(a,b).toFixed(2)}:1 ${grade(ratio(a,b))}</td></tr>`).join('')}</tbody></table></section>
<section><h2 style="font-size:var(--text-2xl)">Type</h2><p>${esc(famName(k.fonts.head))} for headings (weight ${k.hw||400}${k.case==='upper'?', capitals':''}), ${esc(famName(k.fonts.body))} for reading. Scale ratio ${Math.min(1.333,k.scale||1.25)}:</p><table class="table"><tbody>${typeScale(k).map(s=>`<tr><td>${s.name}</td><td class="num">${s.px}px / ${s.lh}</td></tr>`).join('')}</tbody></table></section>
<section><h2 style="font-size:var(--text-2xl)">Voice</h2>${k.voice.map(v=>`<p style="font-family:var(--font-head);font-size:var(--text-xl);text-transform:var(--case);margin:.2em 0">${esc(v)}</p>`).join('')}</section>
<section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:24px"><div><h2 style="font-size:var(--text-2xl)">Do</h2><ul>${k.dos.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h2 style="font-size:var(--text-2xl)">Avoid</h2><ul>${k.donts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></section>
<section><h2 style="font-size:var(--text-2xl)">Motion</h2><p>Signature background: ${esc(k.bgDesc)}. Always offer a pause control and show a still frame under prefers-reduced-motion.</p></section></main>`)}

/* ---------- files and zip ---------- */
function fileList(k){return [['README.txt','this file'],['demo.html','open first: the kit working, with the animated background'],['components.html','component sheet: nav, buttons, inputs, list rows, tags, table, toast'],['guidelines.html','brand guidelines: logo clear space, colour, type, voice, do and avoid'],
 ['tokens.css','CSS custom properties: colours, light/dark modes, scales, type scale'],['tokens.scss','the same tokens as Sass variables, maps and a theme() mixin'],['tokens.json','W3C design-tokens-style JSON'],['tailwind.config.js','Tailwind CSS preset'],['components.css','component styles built only from the tokens'],
 ['background.js','the animated background: startBackground(canvas, still)'],['prompt.txt','an AI build prompt for this theme'],
 ['svg/logo.svg','logo, transparent'],['svg/logo-on-background.svg','logo on the kit background'],['svg/logo-clearspace.svg','logo clear-space diagram'],['svg/mark.svg','mark on its own'],['svg/favicon.svg','favicon, 64x64'],['svg/pattern.svg','repeating pattern tile'],['svg/divider.svg','section divider'],
 ['svg/og-card.svg','social / Open Graph card, 1200x630'],['svg/slide-title.svg','title slide, 1920x1080'],['svg/email-header.svg','email header, 600x200'],['svg/business-card-front.svg','business card front, 1050x600 (3.5x2in at 300dpi)'],['svg/business-card-back.svg','business card back, 1050x600'],
 ...Object.keys(TK.ICONS).map(n=>['svg/icons/'+n+'.svg',n+' icon']),['png/background.png','still of the background, 1920x1080']]}
function readme(k){const M=modes(k);return `${k.name} (${k.no}) theme kit · Visual & Motion Atlas
${k.tagline}
Mood: ${k.mood}

Open demo.html to see the kit working. Primary mode: ${M.primary}.${M.single?' '+M.single:` A ${M.primary==='dark'?'light':'dark'} variant is included (data-theme).`}

Contents
${fileList(k).map(([n,d])=>`  ${n.padEnd(32)} ${d}`).join('\n')}

Fonts: ${famName(k.fonts.head)} and ${famName(k.fonts.body)} from Google Fonts (SIL Open Font Licence).
SVG files load their fonts from Google Fonts when opened on their own; outline the text before print.
Everything else in this kit was generated by the atlas and is yours to use.
`}
function stillURL(k,w,h,type='image/jpeg',q=.86){const key=[k.id,w,h,type].join(':');stillURL.c=stillURL.c||{};if(stillURL.c[key])return stillURL.c[key];
 const c=document.createElement('canvas'),d=Math.min(2,devicePixelRatio||1);c.style.cssText=`position:fixed;left:-99999px;top:0;width:${w/d}px;height:${h/d}px`;document.body.append(c);TK.BG[k.bg](c,k.t,true);const u=c.toDataURL(type,q);c.remove();return stillURL.c[key]=u}
function pngBlob(k,w=1920,h=1080){return new Promise(res=>{const c=document.createElement('canvas'),d=Math.min(2,devicePixelRatio||1);c.style.cssText=`position:fixed;left:-99999px;top:0;width:${w/d}px;height:${h/d}px`;document.body.append(c);TK.BG[k.bg](c,k.t,true);c.toBlob(b=>{c.remove();res(b)},'image/png')})}
async function files(k){const o={fonts:true},F={'README.txt':readme(k),'demo.html':demoHTML(k),'components.html':componentsHTML(k),'guidelines.html':guidelinesHTML(k),'tokens.css':css(k),'tokens.scss':scss(k),'tokens.json':json(k),'tailwind.config.js':tailwind(k),'components.css':componentsCSS(k),'background.js':bgJS(k),'prompt.txt':prompt(k),
 'svg/logo.svg':logoFile(k,false,o),'svg/logo-on-background.svg':logoFile(k,true,o),'svg/logo-clearspace.svg':clearspace(k,o),'svg/mark.svg':`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">${TK.mark(k)}</svg>`,'svg/favicon.svg':favicon(k),'svg/pattern.svg':TK.pattern(k),'svg/divider.svg':TK.divider(k),
 'svg/og-card.svg':og(k,stillURL(k,1200,630),o),'svg/slide-title.svg':slide(k,stillURL(k,1920,1080),o),'svg/email-header.svg':email(k,stillURL(k,600,200),o),'svg/business-card-front.svg':cardFront(k,o),'svg/business-card-back.svg':cardBack(k,o)};
 Object.keys(TK.ICONS).forEach(n=>F['svg/icons/'+n+'.svg']=TK.icon(k,n));F['png/background.png']=new Uint8Array(await (await pngBlob(k)).arrayBuffer());
 return fileList(k).map(([n])=>[n,F[n]])}
async function zipKit(k,extra){const f=await files(k);return TK.zip(extra&&extra.length?f.concat(extra):f)}
Object.assign(TK,{hx,toHex,mix,lum,ratio,grade,best,ensure,isDark,scales,modes,typeScale,famName,fontsURL,esc,caseT,scope,inner,css,componentsCSS,scss,json,tailwind,prompt,bgJS,og,slide,email,favicon,cardFront,cardBack,clearspace,logoFile,componentsSheet,componentsHTML,demoHTML,guidelinesHTML,fileList,readme,stillURL,pngBlob,files,zipKit});
TK.list.forEach(k=>{k.tone=isDark(k.t)?'dark':'light'});
})();
