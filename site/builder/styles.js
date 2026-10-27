'use strict';
/* Page builder, style registry. Every page style is reduced to the builder's CSS variables:
   --bg --surface --ink --mute --line --accent --on-accent --accent-ink --head --body --hw --hs --radius --track --case
   Sources (each feature-detected, read-only):
     builder  four hand-made styles in PB_LIB.styles (Kitchen noir, Kitchen paper, Studio, Signal)
     kit      every theme kit in window.ThemeKits.list (kits/themes.js + kits-a.js + kits-b.js, brand.js for modes)
     ds       every atlas design system D01–D48 (tokens in expansion.json)
     atlas    the twenty atlas themes S01–S20, light and dark (window.AtlasThemes)
   A type pairing can override the heading and body fonts of any style. */
(()=>{
const PB=window.PB=window.PB||{};
/* ---------- colour ---------- */
const hx=h=>{h=String(h||'#000').trim().replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');const n=parseInt(h.slice(0,6),16);return isNaN(n)?[0,0,0]:[n>>16&255,n>>8&255,n&255]};
const toHex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('').toUpperCase();
const mix=(a,b,p)=>{const A=hx(a),B=hx(b);return toHex(A.map((v,i)=>v+(B[i]-v)*p))};
const lum=h=>{const c=hx(h).map(v=>v/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const best=bg=>ratio('#FFFFFF',bg)>=ratio('#000000',bg)?'#FFFFFF':'#000000';
function ensure(fg,bgs,min){bgs=[].concat(bgs);const ok=c=>bgs.every(b=>ratio(c,b)>=min);if(ok(fg))return toHex(hx(fg));const to=best(bgs[0]);for(let p=.05;p<=1.001;p+=.05){const c=mix(fg,to,p);if(ok(c))return c}return to}
const isHex=s=>/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(s||'').trim());
PB.color={hx,toHex,mix,lum,ratio,best,ensure,isHex};

const GOOGLE=['Inter','Manrope','Public Sans','Red Hat Text','Source Sans 3','Space Grotesk','Roboto','DM Sans','Outfit','Lora','Playfair Display','Cormorant Garamond','Libre Baskerville','IBM Plex Mono','IBM Plex Sans','Fraunces','Archivo','Archivo Black','Inter Tight','Hanken Grotesk','JetBrains Mono','Newsreader','Space Mono'];
const famName=s=>String(s||'').split(',')[0].replace(/['"]/g,'').trim();
const fallback=f=>/Mono|Code|Courier|monospace/i.test(f)?'ui-monospace,monospace':/Serif|Garamond|Georgia|Baskerville|Lora|Playfair|Fraunces|Newsreader|Times|Fell|Bodoni|Didot|Caslon/i.test(f)&&!/Sans/i.test(f)?'Georgia,serif':'system-ui,sans-serif';
const mineFam=f=>!!(window.MyFonts&&window.MyFonts.has(f));
const stack=f=>mineFam(f)?window.MyFonts.cssFamily(f).replace(/"/g,"'"):`'${f}',${fallback(f)}`;
const gq=names=>[...new Set(names)].filter(n=>!mineFam(n)&&(GOOGLE.includes(n)||n&&!/^(system-ui|Georgia|Helvetica|Arial|-apple-system|ui-monospace|Atlas)/i.test(n))).map(n=>'family='+n.replace(/ /g,'+')+':wght@400;500;600;700').join('&');
const FACE=site=>`@font-face{font-family:'Atlas Display';src:url(${site}fonts/AtlasNarrow-Bold.woff2) format('woff2');font-weight:700;font-display:swap}@font-face{font-family:'Atlas Sans';src:url(${site}fonts/AtlasSans-Regular.woff2) format('woff2');font-display:swap}`;

function varsFrom(t){ // t: {bg,surface,ink,mute,line,accent,onAccent,accentInk,head,body,hw,hs,radius,track,case,extra}
 const dark=lum(t.bg)<.2;
 const o={'--bg':t.bg,'--surface':t.surface,'--ink':t.ink,'--mute':t.mute,'--line':t.line,'--accent':t.accent,'--on-accent':t.onAccent,'--accent-ink':t.accentInk,
  '--head':t.head,'--body':t.body,'--hw':t.hw||500,'--hs':t.hs||'normal','--radius':t.radius,'--track':t.track||'-.01em','--case':t.case||'none'};
 return Object.entries(o).map(([k,v])=>k+':'+v).join(';')+(t.extra?';'+t.extra:'')+';color-scheme:'+(dark?'dark':'light');
}
function tokensComplete(c){ // fill in derived colours so every style passes AA for text
 const bg=c.bg,surface=c.surface||mix(bg,lum(bg)<.2?'#FFFFFF':'#000000',.04);
 const ink=ensure(c.ink||best(bg),[bg,surface],7);
 const mute=ensure(c.mute||mix(ink,bg,.38),[bg,surface],5.2);
 const line=c.line||mix(ink,bg,.82);
 const accent=c.accent||ink;
 const onAccent=c.onAccent&&ratio(c.onAccent,accent)>=4.5?c.onAccent:best(accent);
 const accentInk=ensure(c.accentInk||accent,[bg,surface],4.5);
 return {bg,surface,ink,mute,line,accent,onAccent,accentInk};
}

const REG=[];let byId={};
function add(s){REG.push(s);byId[s.id]=s}
function build(){
 REG.length=0;byId={};
 const L=window.PB_LIB;
 // builder styles
 const SW={noir:'#E2A24A',paper:'#9A5B12',studio:'#5B2DFF',signal:'#7CF0FF'};
 if(L)Object.entries(L.styles).forEach(([id,s])=>{const v={};s.vars.split(';').forEach(d=>{const i=d.indexOf(':');if(i>0)v[d.slice(0,i).trim()]=d.slice(i+1).trim()});
  add({id,kind:'builder',name:s.name,note:'Builder style',vars:s.vars.replace(/color-scheme/,'--case:none;color-scheme')+(v['--accent-ink']?'':';--accent-ink:'+ensure(v['--accent'],[v['--bg'],v['--surface']],4.5)),fonts:s.fonts,face:false,
   sw:[v['--bg'],v['--surface'],v['--ink'],v['--accent']||SW[id]],head:famName(v['--head']),body:famName(v['--body']),dark:lum(v['--bg'])<.2,desc:s.name})});
 // theme kits
 const TK=window.ThemeKits;
 if(TK&&Array.isArray(TK.list))TK.list.forEach(k=>{try{
  let t=k.t;try{if(TK.modes){const M=TK.modes(k);t=M[M.primary]||t}}catch(e){}
  const c=tokensComplete({bg:t.bg,surface:t.surface,ink:t.ink,mute:t.mute,line:t.line,accent:t.accent,onAccent:t.onAccent,accentInk:t.accentText});
  const r=String(k.t.radius||'12px');
  add({id:'kit:'+k.id,kind:'kit',kit:k,name:k.name,note:'Theme kit '+(k.no||''),
   vars:varsFrom({...c,head:k.fonts.head.replace(/"/g,"'"),body:k.fonts.body.replace(/"/g,"'"),hw:k.hw||(/Black|Bold|Archivo/.test(k.fonts.head)?400:600),hs:'normal',radius:/^\d/.test(r)?r:'12px',track:k.case==='upper'?'.02em':'-.015em',case:k.case==='upper'?'uppercase':'none',
    extra:`--accent2:${t.accent2||c.accent};--shadow:${k.t.shadow||'none'};--glow:${k.t.glow||'none'}`}),
   fonts:k.fonts.css,face:false,sw:[c.bg,c.surface,c.ink,c.accent,t.accent2||c.accent],head:famName(k.fonts.head),body:famName(k.fonts.body),dark:lum(c.bg)<.2,
   desc:`${k.name} theme kit: ${k.tagline||''} Background ${c.bg}, surfaces ${c.surface}, text ${c.ink}, muted ${c.mute}, accent ${c.accent} (text on accent ${c.onAccent}), ${famName(k.fonts.head)} headings${k.case==='upper'?' in capitals':''} and ${famName(k.fonts.body)} text, ${r} radius`,mood:k.mood||''})}catch(e){console.warn('Page builder: kit skipped',k&&k.id,e)}});
 // design systems
 (PB.designSystems||[]).forEach(e=>{try{const T=e.tokens;if(!T||!isHex(T.background))return;
  const c=tokensComplete({bg:T.background,surface:T.surface,ink:T.ink,accent:T.accent});
  const f=famName(T.font),fam=/^(system-ui|-apple-system)$/i.test(f)?'system-ui':f,body=fam==='system-ui'?'system-ui,-apple-system,"Segoe UI",sans-serif':stack(fam);
  const serif=/Georgia/.test(T.font);const r=(+T.radius||0)+'px';
  add({id:'ds:'+e.id,kind:'ds',name:e.title.split(' / ')[0],note:e.id+' · Design system',vars:varsFrom({...c,head:body.replace(/"/g,"'"),body:body.replace(/"/g,"'"),hw:serif?400:fam==='Atlas Display'?700:650,radius:r,track:serif?'-.01em':'-.025em'}),
   fonts:gq([fam]),face:fam.startsWith('Atlas'),sw:[c.bg,c.surface,c.ink,c.accent],head:fam,body:fam,dark:lum(c.bg)<.2,
   desc:`${e.title} design system: background ${c.bg}, surfaces ${c.surface}, text ${c.ink}, muted ${c.mute}, accent ${c.accent} (text on accent ${c.onAccent}), ${fam} for headings and text, ${r} radius. ${e.rule||''}`,mood:e.desc||''})}catch(err){}});
 // atlas themes
 const AT=window.AtlasThemes;
 if(AT&&Array.isArray(AT.list))AT.list.forEach(t=>['light','dark'].forEach(mode=>{try{const m=t[mode];if(!m)return;
  const c=tokensComplete({bg:m.bg,surface:m.surface,ink:m.text,mute:m.muted,line:m.line,accent:m.accent,onAccent:m.onAccent});
  const s=t.shape||{},r=typeof s.radius==='number'?s.radius+'px':(s.radius||'12px');
  add({id:'at:'+t.id+'-'+mode,kind:'atlas',name:t.name+(mode==='dark'?' · dark':''),note:t.id+' · Atlas theme',vars:varsFrom({...c,head:stack(t.fonts.display),body:stack(t.fonts.body),hw:s.weight||500,radius:r}),
   fonts:gq([t.fonts.display,t.fonts.body]),face:/Atlas/.test(t.fonts.display+t.fonts.body),sw:[c.bg,c.surface,c.ink,c.accent],head:t.fonts.display,body:t.fonts.body,dark:mode==='dark',
   desc:`${t.name} (${mode}): background ${c.bg}, surfaces ${c.surface}, text ${c.ink}, accent ${c.accent}, ${t.fonts.display} headings and ${t.fonts.body} text, ${r} radius`})}catch(e){}}));
 PB.stylesReady=true;
}
PB.styles={build,list:()=>REG,get:id=>byId[id]||byId.noir||REG[0],has:id=>!!byId[id],
 KINDS:[['all','All'],['builder','Builder'],['kit','Theme kits'],['ds','Design systems'],['atlas','Atlas themes']],
 // css + font link for a style id with an optional type pairing [name, head, body]
 resolve(id,pair,site){const s=this.get(id);let vars=s.vars,fonts=s.fonts||'',face=s.face?FACE(site):'';
  if(pair&&pair[1]){vars+=`;--head:${stack(pair[1])};--body:${stack(pair[2])}`;fonts=gq([pair[1],pair[2]]);if(/Atlas/.test(pair[1]+pair[2]))face=FACE(site)}
  return {style:s,vars,fonts,face}},
 famName,gq,stack};
})();
