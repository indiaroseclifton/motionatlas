'use strict';
/* Brand kit generator, engine. Pure and deterministic: the same inputs and seeds always give the same brand.
   BrandGen.generate(state) -> brand {name, mode, pal, modes, checks, fixes, cvd, type, logo, copy, kit}
   Colour is built in OKLCH, every text pair is pushed to WCAG 4.5:1 and every UI colour to 3:1 (each change is
   logged as a fix), and colour-blind separation is checked with the chart studio's validator (DVChartMaker.validate)
   when it is on the page. brand.kit is a theme-kit object, so ThemeKits.render / zipKit work on it unchanged.
   Exports: css(b) json(b) tailwind(b) wordmark(b,mode,o) monogram(b,size,o) lockup(b,layout,mode,o) guideHTML(b). */
(()=>{
/* ---------------- colour ---------------- */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const s2l=c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4,l2s=c=>{c=clamp(c,0,1);return c<=.0031308?12.92*c:1.055*c**(1/2.4)-.055};
const isHex=h=>/^#?[0-9a-f]{6}$/i.test(String(h||''));
const normHex=h=>{h=String(h||'').trim().replace(/^#/,'');if(/^[0-9a-f]{3}$/i.test(h))h=[...h].map(c=>c+c).join('');return /^[0-9a-f]{6}$/i.test(h)?'#'+h.toUpperCase():''};
const hexRgb=h=>{h=normHex(h).slice(1);return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255)};
const rgbHex=a=>'#'+a.map(v=>Math.round(clamp(v,0,1)*255).toString(16).padStart(2,'0')).join('').toUpperCase();
function lab(hex){const [r,g,b]=hexRgb(hex).map(s2l);const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
 return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s]}
function oklch(hex){const [L,A,B]=lab(hex);let H=Math.atan2(B,A)*180/Math.PI;if(H<0)H+=360;return [L,Math.hypot(A,B),H]}
function labLin(L,a,b){const l=(L+.3963377774*a+.2158037573*b)**3,m=(L-.1055613458*a-.0638541728*b)**3,s=(L-.0894841775*a-1.291485548*b)**3;
 return [4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s]}
/* OKLCH -> hex; chroma is reduced (hue and lightness kept) until the colour fits in sRGB */
function lch(L,C,H){L=clamp(L,0,1);C=Math.max(0,C);const r=H*Math.PI/180,cs=Math.cos(r),sn=Math.sin(r),at=c=>labLin(L,c*cs,c*sn),ok=c=>at(c).every(v=>v>=-1e-4&&v<=1+1e-4);
 if(ok(C))return rgbHex(at(C).map(l2s));let lo=0,hi=C;for(let i=0;i<22;i++){const m=(lo+hi)/2;if(ok(m))lo=m;else hi=m}return rgbHex(at(lo).map(l2s))}
const lum=h=>{const [r,g,b]=hexRgb(h).map(s2l);return .2126*r+.7152*g+.0722*b};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const best=bg=>ratio('#FFFFFF',bg)>=ratio('#111111',bg)?'#FFFFFF':'#111111';
/* move a colour's OKLCH lightness (hue and chroma kept) until it reaches min against every background */
function fix(fg,bgs,min){bgs=[].concat(bgs);const ok=c=>bgs.every(b=>ratio(c,b)>=min);if(ok(fg))return fg;const [L,C,H]=oklch(fg);
 const dir=bgs.reduce((a,b)=>a+(ratio('#000000',b)>ratio('#FFFFFF',b)?-1:1),0)<0?-1:1;
 for(let i=1;i<=200;i++){const c=lch(L+dir*i*.005,C,H);if(ok(c))return c}return dir<0?'#000000':'#FFFFFF'}
/* colour-vision simulation (Machado 2009, the matrices the chart studio uses) and OKLab distance */
const MACH={protan:[[.152286,1.052583,-.204868],[.114503,.786281,.099216],[-.003882,-.048116,1.051998]],deutan:[[.367322,.860646,-.227968],[.280085,.672501,.047413],[-.01182,.04294,.968881]],tritan:[[1.255528,-.076749,-.178779],[-.078411,.930809,.147602],[.004733,.691367,.3039]]};
const labOfLin=([r,g,b])=>{const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s]};
const sim=(h,k)=>{const v=hexRgb(h).map(s2l);if(!k)return v;const M=MACH[k];return M.map(r=>clamp(r[0]*v[0]+r[1]*v[1]+r[2]*v[2],0,1))};
const dE=(a,b,k)=>{const x=labOfLin(sim(a,k)),y=labOfLin(sim(b,k));return 100*Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2])};
const cvdMin=(a,b)=>Math.min(dE(a,b,'protan'),dE(a,b,'deutan'));
function cvdReport(pal,mode,surface){const V=window.DVChartMaker&&window.DVChartMaker.validate;
 if(V){const r=V(pal,{mode,surface,pairs:'all'});const pick=n=>r.checks.find(c=>c.name===n);return {source:'chart studio validator',cvd:r.cvd,normal:r.normal,checks:[pick('Colour-blind separation'),pick('Normal-vision separation')].filter(Boolean)}}
 let w=null,n=null;for(let i=0;i<pal.length;i++)for(let j=i+1;j<pal.length;j++){for(const k of ['protan','deutan']){const d=dE(pal[i],pal[j],k);if(!w||d<w[0])w=[d,k,pal[i],pal[j]]}const d=dE(pal[i],pal[j]);if(!n||d<n[0])n=[d,pal[i],pal[j]]}
 const cv=w?w[0]:99,nv=n?n[0]:99;return {source:'built-in port',cvd:cv,normal:nv,checks:[{name:'Colour-blind separation',state:cv>=8?'pass':cv>=6?'warn':'fail',detail:w?`worst pair ${w[2]} ↔ ${w[3]} ΔE ${cv.toFixed(1)} (${w[1]})`:''},{name:'Normal-vision separation',state:nv>=15?'pass':'fail',detail:n?`worst ${n[1]} ↔ ${n[2]} ΔE ${nv.toFixed(1)}`:''}]}}

/* ---------------- seeded randomness ---------------- */
function hash(s){let h=2166136261>>>0;for(const ch of String(s)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0}return h>>>0}
function rng(seed){let a=seed>>>0;return ()=>{a=a+0x6D2B79F5>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
const pickW=(r,items)=>{const tot=items.reduce((a,x)=>a+x[1],0);let v=r()*tot;for(const it of items){v-=it[1];if(v<=0)return it[0]}return items[items.length-1][0]};

/* ---------------- feel words ----------------
   h: preferred hues (OKLCH degrees), c: chroma 0–.24, harm: harmony votes, n: neutral temperature,
   r: corner radius px, dark: pull towards a dark primary mode, e: energy (type scale, accent strength), bg: background */
const FEELS={
 bold:{h:[25,265,350],c:.2,harm:['complementary','triadic'],n:'neutral',r:6,dark:.4,e:.9,bg:'brandmesh'},
 calm:{h:[200,175,230,150],c:.08,harm:['analogous'],n:'cool',r:14,dark:.1,e:.2,bg:'brandwave'},
 playful:{h:[340,40,190,290],c:.19,harm:['triadic','split'],n:'warm',r:18,dark:0,e:.85,bg:'brandmesh'},
 premium:{h:[85,300,30,230],c:.09,harm:['analogous','complementary'],n:'warm',r:4,dark:.7,e:.35,bg:'brandwave'},
 minimal:{h:[250,0,200],c:.07,harm:['analogous'],n:'neutral',r:8,dark:.2,e:.2,bg:'brandgrid'},
 warm:{h:[45,30,70],c:.14,harm:['analogous','split'],n:'warm',r:12,dark:.1,e:.5,bg:'brandmesh'},
 friendly:{h:[45,190,155,250],c:.14,harm:['split','analogous'],n:'warm',r:16,dark:0,e:.6,bg:'brandmesh'},
 techy:{h:[265,200,150],c:.16,harm:['complementary','analogous'],n:'cool',r:6,dark:.7,e:.6,bg:'brandgrid'},
 trustworthy:{h:[250,230,200],c:.12,harm:['analogous'],n:'cool',r:10,dark:.1,e:.35,bg:'brandwave'},
 natural:{h:[140,110,60],c:.1,harm:['analogous'],n:'warm',r:14,dark:.1,e:.35,bg:'brandwave'},
 elegant:{h:[330,20,85,280],c:.08,harm:['analogous'],n:'warm',r:4,dark:.5,e:.25,bg:'brandwave'},
 energetic:{h:[30,60,330,140],c:.21,harm:['triadic','complementary'],n:'neutral',r:10,dark:.2,e:1,bg:'brandmesh'},
 edgy:{h:[350,120,290],c:.2,harm:['complementary'],n:'cool',r:0,dark:.9,e:.85,bg:'brandgrid'},
 retro:{h:[40,70,190,15],c:.14,harm:['triadic','split'],n:'warm',r:10,dark:.2,e:.6,bg:'brandwave'},
 modern:{h:[265,190,10],c:.15,harm:['complementary','split'],n:'neutral',r:12,dark:.3,e:.55,bg:'brandmesh'},
 classic:{h:[250,20,90],c:.1,harm:['analogous','complementary'],n:'warm',r:4,dark:.2,e:.3,bg:'brandwave'},
 luxurious:{h:[85,300,350],c:.1,harm:['analogous'],n:'warm',r:2,dark:.9,e:.3,bg:'brandwave'},
 rugged:{h:[55,130,30],c:.1,harm:['analogous','complementary'],n:'warm',r:3,dark:.5,e:.6,bg:'brandgrid'},
 soft:{h:[340,290,200,60],c:.08,harm:['analogous'],n:'warm',r:20,dark:0,e:.2,bg:'brandmesh'},
 serious:{h:[250,220,10],c:.09,harm:['analogous'],n:'cool',r:6,dark:.3,e:.25,bg:'brandgrid'},
 creative:{h:[300,20,180,60],c:.19,harm:['triadic','split'],n:'neutral',r:12,dark:.4,e:.8,bg:'brandmesh'},
 futuristic:{h:[280,190,310],c:.18,harm:['complementary','analogous'],n:'cool',r:8,dark:.95,e:.75,bg:'brandgrid'},
 handmade:{h:[40,130,20],c:.11,harm:['analogous','split'],n:'warm',r:10,dark:0,e:.45,bg:'brandwave'},
 editorial:{h:[20,250,90],c:.12,harm:['complementary'],n:'neutral',r:2,dark:.3,e:.5,bg:'brandgrid'},
 youthful:{h:[330,60,200,280],c:.2,harm:['triadic'],n:'neutral',r:16,dark:.1,e:.9,bg:'brandmesh'},
 clinical:{h:[200,230,170],c:.09,harm:['analogous'],n:'cool',r:10,dark:0,e:.25,bg:'brandgrid'},
 cosy:{h:[40,25,80],c:.1,harm:['analogous'],n:'warm',r:16,dark:.2,e:.3,bg:'brandwave'},
 adventurous:{h:[60,150,30,220],c:.16,harm:['complementary','split'],n:'warm',r:8,dark:.3,e:.75,bg:'brandwave'},
 quirky:{h:[100,320,190,40],c:.19,harm:['triadic','split'],n:'neutral',r:14,dark:.2,e:.85,bg:'brandmesh'},
 fresh:{h:[160,190,120,90],c:.15,harm:['analogous','split'],n:'cool',r:14,dark:0,e:.6,bg:'brandmesh'}};
const FEEL_KEYS=Object.keys(FEELS);
const SYN={fun:'playful',joyful:'playful',cheerful:'playful',whimsical:'quirky',weird:'quirky',odd:'quirky',quirk:'quirky',sleek:'minimal',clean:'minimal',simple:'minimal',understated:'minimal',luxury:'luxurious',lux:'luxurious',opulent:'luxurious',cozy:'cosy',homely:'cosy',earthy:'natural',organic:'natural',sustainable:'natural',eco:'natural',green:'natural',reliable:'trustworthy',honest:'trustworthy',safe:'trustworthy',secure:'trustworthy',dependable:'trustworthy',professional:'serious',formal:'serious',corporate:'serious',loud:'bold',strong:'bold',confident:'bold',daring:'bold',vibrant:'energetic',dynamic:'energetic',sporty:'energetic',lively:'energetic',quiet:'calm',peaceful:'calm',zen:'calm',serene:'calm',relaxed:'calm',gentle:'soft',tender:'soft',dreamy:'soft',vintage:'retro',nostalgic:'retro',seventies:'retro','70s':'retro','80s':'retro',tech:'techy',technical:'techy',digital:'techy',geeky:'techy',innovative:'futuristic',scifi:'futuristic','sci-fi':'futuristic',cyber:'futuristic',artisan:'handmade',crafted:'handmade',craft:'handmade',rustic:'handmade',kids:'youthful',young:'youthful',teen:'youthful',fresh:'fresh',airy:'fresh',crisp:'fresh',light:'fresh',sophisticated:'elegant',refined:'elegant',graceful:'elegant',chic:'elegant',approachable:'friendly',kind:'friendly',welcoming:'friendly',warmhearted:'friendly',human:'friendly',punk:'edgy',rebellious:'edgy',raw:'edgy',gritty:'rugged',tough:'rugged',outdoorsy:'adventurous',outdoor:'adventurous',wild:'adventurous',bold_:'bold',medical:'clinical',precise:'clinical',scientific:'clinical',timeless:'classic',traditional:'classic',heritage:'classic',magazine:'editorial',literary:'editorial',expressive:'creative',artistic:'creative',arty:'creative',contemporary:'modern',current:'modern',premium:'premium',highend:'premium','high-end':'premium',exclusive:'premium',hearty:'warm',sunny:'warm'};
function resolveFeel(w){w=String(w||'').toLowerCase().trim().replace(/[^a-z0-9 -]/g,'');if(!w)return null;if(FEELS[w])return w;if(SYN[w])return SYN[w];const s=w.replace(/(ness|ly|y|ish)$/,'');if(FEELS[s])return s;if(SYN[s])return SYN[s];return null}
/* industry words in the description pull the primary hue */
const HINTS=[[/coffee|caf[eé]|espresso|roast|bakery|bread|chocolate|cocoa/,[38,30]],[/tea\b|matcha|herbal/,[125,95]],[/ocean|sea\b|surf|marine|water|swim|sail|boat/,[220,200]],[/forest|plant|garden|botanic|tree|eco|sustainab|farm|grow/,[145,120]],[/bank|financ|fintech|invest|insur|account|pay(ment)?s?\b|money|wealth/,[255,235]],[/health|clinic|care\b|medical|therap|dental|doctor|wellness|pharma/,[185,165]],[/wine|vineyard|berry|cherry/,[355,10]],[/sun|solar|summer|citrus|lemon/,[85,60]],[/tech|software|app\b|ai\b|data|cloud|code|developer|saas|platform|api/,[270,250]],[/beauty|skin|cosmetic|salon|spa\b/,[15,350]],[/flower|floral|bloom|florist/,[340,320]],[/sky|air|travel|flight|trip|holiday/,[225,205]],[/fire|spice|chilli|chili|hot\b|grill|bbq|pizza|taco/,[28,40]],[/music|sound|audio|record|band|gig|club/,[295,320]],[/night|astro|space|star|moon/,[280,265]],[/candy|sweet|dessert|ice cream|cake|donut/,[345,15]],[/law|legal|consult|government|civic|council/,[250,25]],[/school|learn|educat|course|tutor|kids|child|toy|play/,[60,200]],[/fitness|gym|sport|run|bike|cycling|training/,[30,150]],[/pet|dog|cat\b|vet\b/,[50,175]],[/fashion|clothing|apparel|boutique|jewel/,[350,300]],[/home|interior|furniture|architect|build/,[45,200]],[/food|restaurant|kitchen|recipe|cook|meal|deli/,[35,140]],[/energy|electric|battery|power/,[100,250]],[/game|gaming|esports|arcade/,[300,190]]];
function hintHues(text){const t=String(text||'').toLowerCase(),out=[];for(const [re,h] of HINTS)if(re.test(t))out.push(...h);return out.slice(0,4)}
const AUD={kids:{playful:1,youthful:1},families:{friendly:1},developers:{techy:1,minimal:.5},b2b:{trustworthy:1,serious:.5},businesses:{trustworthy:1,serious:.5},creatives:{creative:1},professionals:{serious:.6,trustworthy:.6},luxury:{premium:1},teens:{youthful:1,bold:.5},seniors:{calm:.6,trustworthy:.6},patients:{clinical:.6,calm:.6},local:{friendly:.6,warm:.5},students:{youthful:.6,friendly:.5}};
function audienceFeels(a){const t=String(a||'').toLowerCase(),o={};for(const [k,v] of Object.entries(AUD))if(t.includes(k.replace(/s$/,'')))for(const [f,w] of Object.entries(v))o[f]=(o[f]||0)+w;return o}

/* ---------------- type pairings (Google Fonts) ---------------- */
const STACK={serif:"Georgia,'Times New Roman',serif",sans:'system-ui,-apple-system,sans-serif',mono:'ui-monospace,Menlo,monospace',hand:'cursive',display:'system-ui,sans-serif'};
const BODYCSS={Inter:'Inter:wght@400;500;600','Source Sans 3':'Source+Sans+3:wght@400;600','DM Sans':'DM+Sans:wght@400;500;700','IBM Plex Sans':'IBM+Plex+Sans:wght@400;600',Archivo:'Archivo:wght@400;600',Nunito:'Nunito:wght@400;700','Nunito Sans':'Nunito+Sans:wght@400;700','Work Sans':'Work+Sans:wght@400;600','Open Sans':'Open+Sans:wght@400;600',Barlow:'Barlow:wght@400;600',Lato:'Lato:wght@400;700',Roboto:'Roboto:wght@400;500',Raleway:'Raleway:wght@400;600',Karla:'Karla:wght@400;600',Figtree:'Figtree:wght@400;600','Proza Libre':'Proza+Libre:wght@400;600',Poppins:'Poppins:wght@400;600','Red Hat Text':'Red+Hat+Text:wght@400;500','Instrument Sans':'Instrument+Sans:wght@400;600','Exo 2':'Exo+2:wght@400;600','Alegreya Sans':'Alegreya+Sans:wght@400;700','Atkinson Hyperlegible':'Atkinson+Hyperlegible:wght@400;700',Chivo:'Chivo:wght@400;700',Hind:'Hind:wght@400;600','Hanken Grotesk':'Hanken+Grotesk:wght@400;700','Libre Franklin':'Libre+Franklin:wght@400;700'};
/* [id, head, weight, class, body, tags, rationale, width factor, case] */
const PAIRS=[
 ['fraunces-inter','Fraunces',600,'serif','Inter','warm friendly editorial cosy premium','A soft, slightly wonky old-style serif with real warmth over a neutral workhorse sans: friendly without turning childish.',.55],
 ['playfair-source','Playfair Display',700,'serif','Source Sans 3','elegant classic luxurious editorial premium','High-contrast transitional display serif for headlines that feel like a magazine cover, with a calm humanist sans doing the reading.',.55],
 ['cormorant-proza','Cormorant Garamond',600,'serif','Proza Libre','luxurious elegant calm premium classic','Delicate Garamond display cuts whisper “expensive”; Proza Libre keeps body text sturdy at small sizes.',.47],
 ['dmserif-dmsans','DM Serif Display',400,'serif','DM Sans','modern elegant premium editorial','A crisp contemporary serif and its matching geometric sans from the same family: polished and coherent.',.52],
 ['spacegrotesk-plex','Space Grotesk',700,'sans','IBM Plex Sans','techy modern bold edgy','Space Grotesk has quirky, engineered details that say “built by people who code”; Plex Sans is precise and very readable.',.57],
 ['sora-inter','Sora',600,'sans','Inter','futuristic techy modern minimal fresh','Wide, geometric Sora feels like a product launch; Inter is the most legible screen sans there is.',.62],
 ['syne-inter','Syne',700,'display','Inter','creative edgy bold quirky','Syne’s stretched, art-school shapes give instant personality; a quiet Inter body lets it shout only in headlines.',.6],
 ['archivoblack-archivo','Archivo Black',400,'sans','Archivo','bold energetic rugged serious','A heavy grotesque with its own text family: loud headlines, straight-talking body copy, one consistent voice.',.66],
 ['bricolage-inter','Bricolage Grotesque',700,'sans','Inter','playful quirky creative friendly modern','Ink-trapped, slightly squashed shapes feel handmade and cheeky; Inter keeps the interface sensible.',.54],
 ['baloo-nunito','Baloo 2',700,'display','Nunito','playful youthful friendly soft','Round, bouncy Baloo is impossible to read as unfriendly; Nunito’s rounded terminals carry the same smile into body text.',.55],
 ['fredoka-nunito','Fredoka',600,'display','Nunito','playful youthful soft cosy','Fredoka’s pillowy shapes suit apps for families and kids; both faces share rounded ends, so they feel like one voice.',.55],
 ['nunito-nunitosans','Nunito',800,'sans','Nunito Sans','friendly soft calm','Rounded heavy Nunito for headlines and its straight-ended sibling for reading: approachable but not cartoonish.',.56],
 ['outfit-inter','Outfit',600,'sans','Inter','minimal modern fresh clean','A clean geometric display face with generous circles; feels airy and current without trying hard.',.54],
 ['manrope','Manrope',700,'sans','Manrope','minimal trustworthy modern techy','One family top to bottom: Manrope’s semi-condensed, modern-grotesque shapes read as calm competence.',.56],
 ['jakarta','Plus Jakarta Sans',700,'sans','Plus Jakarta Sans','friendly modern trustworthy fresh','A warm modern grotesque with open shapes; using one family keeps a product brand tidy and consistent.',.57],
 ['lora-worksans','Lora',600,'serif','Work Sans','warm natural trustworthy cosy','Lora’s brushed curves feel crafted and human; Work Sans is plain-spoken and slightly wide for easy reading.',.52],
 ['baskerville-source','Libre Baskerville',700,'serif','Source Sans 3','classic trustworthy serious editorial','The Baskerville tradition signals credibility and heritage; Source Sans brings modern clarity to long text.',.6],
 ['merriweather-opensans','Merriweather',700,'serif','Open Sans','trustworthy serious calm','Sturdy screen serif with a big x-height and the neutral Open Sans: dependable, no surprises.',.6],
 ['plexserif-plexsans','IBM Plex Serif',600,'serif','IBM Plex Sans','serious clinical techy trustworthy','One superfamily designed for engineering clarity; serif heads add authority, the sans keeps it rational.',.58],
 ['plexmono-plexsans','IBM Plex Mono',600,'mono','IBM Plex Sans','techy minimal serious','Monospaced headlines read as code and precision; the matching Plex Sans keeps paragraphs comfortable.',.6],
 ['jetbrains-inter','JetBrains Mono',700,'mono','Inter','techy edgy futuristic','A developer’s monospace with tall, clear letters for display, over Inter for anything you read.',.6],
 ['bebas-barlow','Bebas Neue',400,'display','Barlow','bold energetic adventurous rugged','Tall condensed capitals built for posters and scoreboards; Barlow’s slightly rounded grotesque keeps the energy.',.4,'upper'],
 ['oswald-lato','Oswald',600,'sans','Lato','bold rugged serious energetic','Condensed gothic capitals with a no-nonsense attitude, over Lato’s warm, balanced body text.',.44,'upper'],
 ['anton-roboto','Anton',400,'display','Roboto','bold edgy energetic','Very heavy, very tight: Anton headlines grab attention from across a room; Roboto stays neutral.',.45,'upper'],
 ['abril-poppins','Abril Fatface',400,'serif','Poppins','retro bold editorial','A 19th-century fat-face revival for big, dramatic headlines with a modern geometric Poppins body.',.58],
 ['righteous-poppins','Righteous',400,'display','Poppins','retro playful quirky','Art-deco-meets-70s display letters with geometric Poppins: nostalgic, optimistic and very readable.',.6],
 ['shrikhand-karla','Shrikhand',400,'display','Karla','retro playful warm cosy','A juicy, italic display face with a diner-sign swagger; Karla is a friendly grotesque that won’t compete.',.62],
 ['caveat-nunito','Caveat',700,'hand','Nunito','handmade cosy friendly','Real handwriting for headings feels personal and small-batch; Nunito keeps the rest gentle and legible.',.42],
 ['kalam-karla','Kalam',700,'hand','Karla','handmade playful natural','Marker-style handwriting with energy and charm, over Karla for clear information.',.5],
 ['gloock-inter','Gloock',400,'serif','Inter','editorial bold premium','A heavy, high-contrast serif with sharp wedges: confident editorial headlines, modern Inter beneath.',.56],
 ['instrument','Instrument Serif',400,'serif','Instrument Sans','modern elegant minimal editorial','Condensed, refined serif headlines with the matching Instrument Sans: the look of a modern studio site.',.42],
 ['garamond-inter','EB Garamond',500,'serif','Inter','classic calm editorial','A faithful Garamond reads as literate and calm; Inter makes the interface crisp.',.5],
 ['cinzel-raleway','Cinzel',600,'serif','Raleway','luxurious classic elegant','Roman inscriptional capitals feel monumental and expensive; Raleway’s elegant thin sans complements them.',.72,'upper'],
 ['josefin-lato','Josefin Sans',600,'sans','Lato','retro elegant modern','Geometric, vintage-tinged Josefin with Lato’s friendly balance: 1920s modernism with today’s legibility.',.55],
 ['montserrat-hind','Montserrat',700,'sans','Hind','modern bold trustworthy','Urban, wide Montserrat headlines are confident and clear; Hind is compact and efficient for text.',.66],
 ['poppins-inter','Poppins',600,'sans','Inter','friendly modern fresh','Perfectly geometric Poppins feels optimistic and simple; Inter’s tuned spacing handles the reading.',.62],
 ['rubik-karla','Rubik',600,'sans','Karla','friendly playful youthful','Slightly rounded corners make Rubik soft but sturdy; Karla keeps the same friendly, grotesque rhythm.',.58],
 ['unbounded-inter','Unbounded',700,'display','Inter','futuristic bold youthful energetic','Ultra-wide, rounded Unbounded feels like a launch day; Inter calms everything else down.',.78],
 ['orbitron-exo','Orbitron',700,'display','Exo 2','futuristic techy edgy','Squared, sci-fi capitals for a hardware or space brand, with Exo 2’s technical but readable body.',.78,'upper'],
 ['zilla-source','Zilla Slab',700,'serif','Source Sans 3','rugged editorial trustworthy adventurous','A contemporary slab with workwear sturdiness and a newsroom edge, over Source Sans for clarity.',.52],
 ['bitter-raleway','Bitter',700,'serif','Raleway','natural rugged trustworthy','Bitter is a hard-wearing slab made for screens: honest and grounded; Raleway adds lightness.',.56],
 ['quicksand','Quicksand',700,'sans','Quicksand','soft calm fresh minimal','Rounded geometric Quicksand in two weights: gentle, airy and calm, with nothing sharp anywhere.',.55],
 ['youngserif-figtree','Young Serif',400,'serif','Figtree','warm cosy natural friendly','A plump, friendly old-style serif with the clean, warm Figtree: like a neighbourhood bakery with a good website.',.58],
 ['spectral-karla','Spectral',600,'serif','Karla','calm natural editorial','Spectral is a quiet, screen-first serif for thoughtful headlines; Karla keeps the voice relaxed.',.52],
 ['redhat','Red Hat Display',700,'sans','Red Hat Text','trustworthy modern clinical','A display and text pair designed together: open, confident and very legible in interfaces.',.56],
 ['lexend-atkinson','Lexend',600,'sans','Atkinson Hyperlegible','clinical trustworthy friendly calm','Both faces were designed for readability: Lexend reduces visual stress, Atkinson Hyperlegible distinguishes every letter.',.6],
 ['bigshoulders-chivo','Big Shoulders Display',800,'display','Chivo','rugged bold adventurous retro','Chicago-industrial condensed capitals with Chivo’s grotesque body: workshop, brewery, outdoors.',.42,'upper'],
 ['alegreya','Alegreya',700,'serif','Alegreya Sans','natural classic calm handmade','A calligraphic book serif and its humanist sans sibling: literary, organic and calm.',.5]
].map(([id,head,hw,cls,body,tags,why,wf,cs])=>{const hf=head.replace(/ /g,'+'),same=head===body;const css=same?`family=${hf}:wght@400;${hw}`:`family=${hf}${hw!==400||cls!=='display'?`:wght@${hw===400?'400':'400;'+hw}`:''}&family=${BODYCSS[body]||body.replace(/ /g,'+')+':wght@400;600'}`;
 return {id,head,hw,cls,body,tags:tags.split(' '),why,wf,case:cs||'',css,headStack:`'${head}',${STACK[cls]}`,bodyStack:`'${body}',${STACK.sans}`}});
/* single-weight display faces must not ask for weights Google Fonts doesn't have */
const SINGLE=new Set(['DM Serif Display','Archivo Black','Bebas Neue','Anton','Abril Fatface','Righteous','Shrikhand','Gloock','Instrument Serif','Young Serif']);
PAIRS.forEach(p=>{if(SINGLE.has(p.head)){p.css=`family=${p.head.replace(/ /g,'+')}&family=${BODYCSS[p.body]}`;p.hw=400}});
const fontsURL=p=>'https://fonts.googleapis.com/css2?'+p.css+'&display=swap';

/* ---------------- naming ---------------- */
const HUE_NAMES=[[12,'Crimson'],[32,'Vermilion'],[52,'Tangerine'],[72,'Amber'],[95,'Saffron'],[112,'Olive'],[135,'Leaf'],[155,'Emerald'],[175,'Jade'],[195,'Teal'],[215,'Lagoon'],[238,'Azure'],[260,'Cobalt'],[280,'Indigo'],[300,'Violet'],[322,'Orchid'],[342,'Magenta'],[360,'Rose']];
function colourName(hex){const [L,C,H]=oklch(hex);if(C<.035)return L>.8?'Mist':L<.35?'Graphite':'Slate';const n=(HUE_NAMES.find(([h])=>H<=h)||HUE_NAMES[0])[1];return (L<.42?'Deep ':L>.84?'Pale ':'')+n}

/* ---------------- state ---------------- */
const DEFAULT={name:'Northwind',desc:'',feels:[],audience:'',base:'',mode:'auto',logoColors:[],seeds:{pal:0,type:0,logo:0},frozen:{pal:null,type:null,logo:null},ai:null};
function norm(s){s=Object.assign({},DEFAULT,s||{});s.name=String(s.name||'').slice(0,60);s.desc=String(s.desc||'').slice(0,400);s.audience=String(s.audience||'').slice(0,80);
 s.feels=[...new Set((Array.isArray(s.feels)?s.feels:[]).map(x=>String(x).toLowerCase().trim().slice(0,24)).filter(Boolean))].slice(0,8);
 s.base=normHex(s.base);s.mode=['light','dark','auto'].includes(s.mode)?s.mode:'auto';s.logoColors=(Array.isArray(s.logoColors)?s.logoColors:[]).map(normHex).filter(Boolean).slice(0,4);
 s.seeds=Object.assign({pal:0,type:0,logo:0},s.seeds||{});for(const k in s.seeds)s.seeds[k]=Math.max(0,Math.floor(+s.seeds[k]||0))%100000;
 s.frozen=Object.assign({pal:null,type:null,logo:null},s.frozen||{});return s}

/* ---------------- profile from feel words ---------------- */
function profile(s){const w={};s.feels.forEach((f,i)=>{const k=resolveFeel(f);if(k)w[k]=(w[k]||0)+(i<5?1:.6)});const aud=audienceFeels(s.audience);for(const k in aud)w[k]=(w[k]||0)+aud[k]*.6;
 const keys=Object.keys(w);if(!keys.length)w.modern=1,w.friendly=.6;const tot=Object.values(w).reduce((a,b)=>a+b,0);
 const avg=f=>Object.entries(w).reduce((a,[k,v])=>a+FEELS[k][f]*v,0)/tot;
 const hues=[];Object.entries(w).forEach(([k,v])=>FEELS[k].h.forEach((h,i)=>hues.push([h,v/(i+1)])));
 const harm={};Object.entries(w).forEach(([k,v])=>FEELS[k].harm.forEach((h,i)=>harm[h]=(harm[h]||0)+v/(i+1)));
 const nt={};Object.entries(w).forEach(([k,v])=>nt[FEELS[k].n]=(nt[FEELS[k].n]||0)+v);
 const bgv={};Object.entries(w).forEach(([k,v])=>bgv[FEELS[k].bg]=(bgv[FEELS[k].bg]||0)+v);
 const top=Object.entries(w).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
 return {w,top,c:avg('c'),r:avg('r'),dark:avg('dark'),e:avg('e'),hues,harm:Object.entries(harm),neutral:Object.entries(nt).sort((a,b)=>b[1]-a[1])[0][0],bg:Object.entries(bgv).sort((a,b)=>b[1]-a[1])[0][0]}}

/* ---------------- palette ---------------- */
const RAMP_L=[.975,.935,.875,.8,.715,.63,.55,.47,.39,.31,.235],RAMP_C=[.16,.3,.52,.76,.94,1,.96,.88,.76,.62,.5],STEPS=[50,100,200,300,400,500,600,700,800,900,950];
const ramp=(C,H)=>STEPS.map((s,i)=>[s,lch(RAMP_L[i],C*RAMP_C[i],H)]);
const wrap=h=>((h%360)+360)%360;
const HARM={analogous:[[32,-28],[48,-40]],complementary:[[180,30],[170,-35]],split:[[150,210],[160,200]],triadic:[[120,240],[125,235]]};
function palParams(s,P,seedBase){const r=rng(seedBase^Math.imul(s.seeds.pal+1,2654435761));let L,C,H,from='feel';
 const logo=s.logoColors.filter(h=>oklch(h)[1]>=.04);
 if(s.base){[L,C,H]=oklch(s.base);from='base'}else if(logo.length){[L,C,H]=oklch(logo[0]);from='logo'}
 else{const hint=hintHues(s.desc);const cand=hint.length?[...hint.map(h=>[h,2.2]),...P.hues]:P.hues;H=wrap(pickW(r,cand)+(r()-.5)*26);C=clamp(P.c*(.85+r()*.35),.05,.24);L=.5+r()*.16;
  if(s.seeds.pal>0)H=wrap(H+(r()-.5)*30)}
 const harm=pickW(r,P.harm),off=HARM[harm][r()<.5?0:1];
 let sec,acc;
 if(!s.base&&logo.length>1){sec=oklch(logo[1])}else sec=[clamp(L+(r()-.5)*.16,.38,.72),C*(.7+r()*.25),wrap(H+off[0])];
 if(!s.base&&logo.length>2){acc=oklch(logo[2])}else acc=[clamp(.62+(r()-.5)*.16+P.e*.05,.45,.8),clamp(Math.max(C,.12)*(1+P.e*.25),.1,.24),wrap(H+off[1])];
 const nH=P.neutral==='warm'?wrap(H*.3+65*.7):P.neutral==='cool'?wrap(H*.3+250*.7):H,nC=P.neutral==='neutral'?.006:.014;
 return {L,C,H,sec,acc,nH,nC,harm,from,hex:lch(L,C,H),secHex:lch(...sec),accHex:lch(...acc)}}
const SEM={success:[152,.15],warning:[75,.16],danger:[27,.19],info:[240,.13]};
function semVariants(){const out=[];for(const sl of [0,.06,.12])for(const sh of [152,168,182,140])for(const dl of [0,-.06])for(const dh of [27,18,36])out.push({sh,sl,dh,dl});return out}

function buildMode(mode,pp,P,fixes){const dk=mode==='dark',N=(L,c)=>lch(L,c==null?pp.nC:c,pp.nH),log=(tok,from,to,why)=>{if(from!==to)fixes.push({mode,tok,from,to,why})};
 const tint=P.neutral==='warm'?pp.nC*1.6:pp.nC;
 const t={};t.bg=dk?N(.165,pp.nC*1.3):N(.982,tint);t.surface=dk?N(.205,pp.nC*1.3):N(.997,tint*.5);t.raised=dk?N(.25,pp.nC*1.2):N(.95,tint);
 let ink=dk?N(.955,.008):N(.2,pp.nC*1.4);t.ink=fix(ink,[t.bg,t.surface,t.raised],7);log('ink',ink,t.ink,'7:1 for body text on every surface');
 let mute=dk?N(.72):N(.5);t.mute=fix(mute,[t.bg,t.surface,t.raised],4.5);log('mute',mute,t.mute,'4.5:1 for secondary text');
 t.line=dk?N(.3):N(.905);let border=dk?N(.5):N(.64);t.border=fix(border,[t.bg,t.surface],3);log('border',border,t.border,'3:1 so inputs and controls are visible');
 const bgs=[t.bg,t.surface];
 const core=(name,hex)=>{let ui=fix(hex,bgs,3);log(name,hex,ui,'3:1 against the background for buttons, focus rings and icons');let on=best(ui);if(ratio(on,ui)<4.5){const u2=fix(ui,[on],4.5);log(name,ui,u2,'4.5:1 for the label on a filled button');ui=u2}
  const cands=[on,t.ink,t.bg,'#FFFFFF','#111111'].sort((a,b)=>ratio(b,ui)-ratio(a,ui));on=cands.find(c=>ratio(c,ui)>=4.5)||best(ui);
  const txt=fix(hex,[t.bg,t.surface,t.raised],4.5);log(name+'-text',hex,txt,'4.5:1 for links and text in the brand colour');return [ui,on,txt]};
 const brandLight=pp.hex,brandDark=(()=>{const [L,C,H]=oklch(pp.hex);return L<.62?lch(Math.max(L,.7),C,H):pp.hex})();
 [t.primary,t.onPrimary,t.primaryText]=core('primary',dk?brandDark:brandLight);
 const sec=dk?lch(Math.max(pp.sec[0],.68),pp.sec[1],pp.sec[2]):pp.secHex,acc=dk?lch(Math.max(pp.acc[0],.7),pp.acc[1],pp.acc[2]):pp.accHex;
 [t.secondary,t.onSecondary,t.secondaryText]=core('secondary',sec);[t.accent,t.onAccent,t.accentText]=core('accent',acc);
 t.focus=t.primary;
 /* status colours: pick the variant that separates success/danger/warning best for protan and deutan vision */
 const semOf=v=>{const o={};for(const [k,[h0,c]] of Object.entries(SEM)){const h=k==='success'?v.sh:k==='danger'?v.dh:h0,dl=k==='success'?v.sl:k==='danger'?v.dl:0;const base=lch((dk?.72:.58)+dl*(dk?-1:1),c,h);
  const tn=dk?lch(.26,c*.35,h):lch(.955,c*.22,h);o[k]=fix(base,bgs,3);o[k+'Tint']=tn;o[k+'Text']=fix(base,[t.bg,t.surface,tn],4.5)}return o};
 let bestV=null;for(const v of semVariants()){const o=semOf(v),sc=Math.min(cvdMin(o.success,o.danger),cvdMin(o.success,o.warning)*1.2,cvdMin(o.warning,o.danger)*1.2);if(!bestV||sc>bestV[0]+.01)bestV=[sc,v,o];if(sc>=10)break}
 Object.assign(t,bestV[2]);const v0=semVariants()[0];if(bestV[1]!==v0)fixes.push({mode,tok:'status colours',from:'default hues',to:`success ${bestV[1].sh}°${bestV[1].sl?` L+${bestV[1].sl}`:''}, danger ${bestV[1].dh}°${bestV[1].dl?` L${bestV[1].dl}`:''}`,why:'keeps success, warning and danger apart for red–green colour blindness'});
 t.shadow=dk?`0 0 0 1px ${t.line}, 0 12px 32px -12px rgba(0,0,0,.6)`:'0 1px 2px rgba(20,20,40,.06), 0 10px 30px -14px rgba(20,20,40,.22)';
 t.glow=`0 0 0 3px ${t.primary}66`;
 return t}
function checksFor(t){const T=(l,fg,bg)=>({label:l,fg,bg,min:4.5,kind:'text',ratio:ratio(fg,bg)}),U=(l,fg,bg)=>({label:l,fg,bg,min:3,kind:'UI',ratio:ratio(fg,bg)});
 const a=[T('Text on background',t.ink,t.bg),T('Text on surface',t.ink,t.surface),T('Muted text on background',t.mute,t.bg),T('Muted text on surface',t.mute,t.surface),T('Label on primary',t.onPrimary,t.primary),T('Label on secondary',t.onSecondary,t.secondary),T('Label on accent',t.onAccent,t.accent),T('Primary text (links) on background',t.primaryText,t.bg),T('Primary text on surface',t.primaryText,t.surface),
  T('Success text on background',t.successText,t.bg),T('Warning text on its tint',t.warningText,t.warningTint),T('Danger text on background',t.dangerText,t.bg),T('Danger text on its tint',t.dangerText,t.dangerTint),T('Info text on background',t.infoText,t.bg),
  U('Primary button / focus ring on background',t.primary,t.bg),U('Secondary on background',t.secondary,t.bg),U('Accent on background',t.accent,t.bg),U('Input border on background',t.border,t.bg),U('Input border on surface',t.border,t.surface),U('Danger icon on background',t.danger,t.bg)];
 a.forEach(c=>c.pass=c.ratio>=c.min-1e-9);return a}

/* ---------------- type ---------------- */
function rankPairs(s,P,seedBase){const r=rng(seedBase^0x9E3779B9),t=String(s.desc+' '+s.audience).toLowerCase();
 const boost=p=>(/code|developer|api|software|data/.test(t)&&p.tags.includes('techy')?.8:0)+(/law|bank|financ|insur|clinic|medical/.test(t)&&(p.tags.includes('trustworthy')||p.tags.includes('serious'))?.8:0)+(/kid|child|toy|play/.test(t)&&p.tags.includes('youthful')?.8:0)+(/bakery|cafe|coffee|craft|handmade|garden/.test(t)&&(p.tags.includes('warm')||p.tags.includes('handmade'))?.6:0)+(/fashion|jewel|luxury|hotel|wine/.test(t)&&(p.tags.includes('luxurious')||p.tags.includes('elegant'))?.7:0);
 return PAIRS.map(p=>[p,p.tags.reduce((a,g)=>a+(P.w[g]||0),0)+boost(p)+r()*.35]).sort((a,b)=>b[1]-a[1]).map(x=>x[0])}
function typeScale(ratioR){const TS=[['xs',-2],['sm',-1],['base',0],['lg',1],['xl',2],['2xl',3],['3xl',4],['4xl',5],['5xl',6]];return TS.map(([n,e])=>({name:n,px:Math.round(16*ratioR**e),lh:e<=0?1.6:e<=2?1.35:e<=4?1.15:1.05,face:e<=0?'body':'head'}))}

/* ---------------- copy ---------------- */
const VOICE={playful:[['Hello, {name}.','Small joys, made on purpose.','Go on, have a poke around.'],['Good things, on repeat.','Made to make you grin.','Pull up a chair.']],
 calm:[['Take a breath.','Quietly does it.','Everything in its place.'],['Room to think.','Slow is a feature.','Settle in.']],
 bold:[['Make some noise.','No half measures.','Built to be noticed.'],['Go further.','Loud by design.','Say it once, say it big.']],
 premium:[['Considered, down to the detail.','Less, but better.','For people who notice.'],['Quietly exceptional.','Made with patience.','The good stuff.']],
 techy:[['Ship it.','Fast, exact, yours.','Everything is an API.'],['Built for builders.','Fewer clicks, more done.','Measured, then made.']],
 natural:[['Grown with care.','Close to the source.','Nothing you don’t need.'],['Rooted, rising.','Good from the ground up.','Season by season.']],
 trustworthy:[['You’re in good hands.','Clear answers, no small print.','We’ll take it from here.'],['Steady, every time.','Plain words, real help.','Here when it counts.']],
 friendly:[['Come on in.','Made for people, by people.','We saved you a seat.'],['Nice to meet you.','Good things take care.','Ask us anything.']]};
const GROUP={playful:'playful',youthful:'playful',quirky:'playful',soft:'calm',calm:'calm',clinical:'trustworthy',bold:'bold',energetic:'bold',edgy:'bold',adventurous:'bold',rugged:'bold',premium:'premium',elegant:'premium',luxurious:'premium',classic:'premium',editorial:'premium',minimal:'premium',techy:'techy',futuristic:'techy',modern:'techy',natural:'natural',handmade:'natural',fresh:'natural',trustworthy:'trustworthy',serious:'trustworthy',friendly:'friendly',warm:'friendly',cosy:'friendly',retro:'playful',creative:'playful'};
const AVOID={playful:'Stiff, corporate phrasing or walls of grey text.',calm:'Urgent red banners, countdowns and exclamation marks.',bold:'Timid half-tints of the primary; commit or leave it out.',premium:'Discount-style shouting, bursts and more than one accent per view.',techy:'Stock photos of people pointing at screens; show the product.',natural:'Glossy gradients and neon; keep colours earthy and matte.',trustworthy:'Jargon, small print and dark patterns.',friendly:'Cold, passive voice; say “we” and “you”.'};
function sentence(d){d=String(d||'').trim().replace(/\s+/g,' ');if(!d)return '';const m=d.match(/^(.{8,110}?[.!?])(\s|$)/);let s=m?m[1]:d;if(s.length>110)s=s.slice(0,107).replace(/\s+\S*$/,'')+'…';return s.charAt(0).toUpperCase()+s.slice(1)}
function copyFor(s,P,pal,type,r){const g=GROUP[P.top[0]]||'friendly',sets=VOICE[g],v=sets[(s.seeds.type+s.seeds.pal)%sets.length].map(x=>x.replace('{name}',s.name||'there'));
 const feelTxt=s.feels.slice(0,3).join(', ');const tagline=sentence(s.desc)||(`${s.name||'A new brand'}: ${feelTxt||'clear, modern and friendly'}.`);
 const dos=[`Lead with ${pal.primaryName} for the one action that matters on each screen.`,`Set headlines in ${type.head}${type.case==='upper'?' capitals':''} and everything you read in ${type.body}.`,`Give the logo clear space of half its height, and use the monogram below 32px.`];
 const donts=[`Body text in the brand colour; use the primary text token for links.`,`Stretching, recolouring, outlining or rotating the logo.`,AVOID[g]];
 const c={tagline,voice:v,dos,donts,headline:v[0],group:g};
 if(s.ai){const a=s.ai;if(a.tagline)c.tagline=a.tagline;if(Array.isArray(a.voice)&&a.voice.length===3)c.voice=a.voice;if(Array.isArray(a.dos)&&a.dos.length)c.dos=a.dos.slice(0,4);if(Array.isArray(a.donts)&&a.donts.length)c.donts=a.donts.slice(0,4);c.ai=true}
 return c}

/* ---------------- logo ---------------- */
const SHAPES=['circle','rounded','squircle','hexagon','shield','arch','plain'];
const DECOR=['plain','dot','bar','slash'];
function logoParams(s,P,seedBase){const r=rng(seedBase^Math.imul(s.seeds.logo+7,40503));const sharp=P.r<5,round=P.r>14;
 const shape=pickW(r,SHAPES.map(x=>[x,x==='circle'?(round?3:1.2):x==='rounded'?1.6:x==='squircle'?(round?2:1):x==='hexagon'?(sharp?1.6:.7):x==='shield'?(P.w.trustworthy||P.w.classic?1.6:.5):x==='arch'?(P.w.elegant||P.w.premium?1.6:.6):.7]));
 return {shape,decor:pickW(r,DECOR.map(x=>[x,x==='plain'?1.4:1])),track:Math.round(((r()-.4)*.08+(P.w.luxurious||P.w.elegant?.06:0))*100)/100,lower:!!(P.w.friendly||P.w.minimal||P.w.soft)&&r()<.35,two:r()<.55}}
function initials(name,two){const w=String(name||'?').trim().split(/[\s\-_.]+/).filter(Boolean);if(!w.length)return '?';const a=[...w[0]][0]||'?';if(!two)return a.toUpperCase();const b=w[1]?[...w[1]][0]:([...w[0]][1]||'');return (a+(b||'')).toUpperCase().slice(0,2)}

/* ---------------- generate ---------------- */
let MEASURE=null;/* (text, weight, family, sizePx) -> width; set by the page once fonts are loaded */
function textW(text,type,size){if(MEASURE){const w=MEASURE(text,type.hw,type.head,size);if(w>0)return w}return [...text].length*size*type.wf*(type.case==='upper'?1.12:1)}
function generate(input){const s=norm(input),P=profile(s);const seedBase=hash([s.name.toLowerCase(),s.desc.toLowerCase(),s.feels.join(','),s.audience.toLowerCase()].join('|'));
 const pp=s.frozen.pal&&s.frozen.pal.hex?s.frozen.pal:palParams(s,P,seedBase);
 const fixes=[];const modes={light:buildMode('light',pp,P,fixes),dark:buildMode('dark',pp,P,fixes)};
 const primaryMode=s.mode!=='auto'?s.mode:(P.dark>=.5?'dark':'light');
 const ramps={primary:ramp(Math.max(pp.C,.06),pp.H),secondary:ramp(Math.max(pp.sec[1],.05),pp.sec[2]),accent:ramp(Math.max(pp.acc[1],.06),pp.acc[2]),neutral:STEPS.map((st,i)=>[st,lch(RAMP_L[i],pp.nC*(i<2||i>8?.8:1.2),pp.nH)])};
 for(const [k,[h,c]] of Object.entries(SEM))ramps[k]=ramp(c,k==='success'?oklch(modes.light.success)[2]:k==='danger'?oklch(modes.light.danger)[2]:h);
 const checks={light:checksFor(modes.light),dark:checksFor(modes.dark)};
 const cvd={brand:{light:cvdReport([modes.light.primary,modes.light.secondary,modes.light.accent],'light',modes.light.bg),dark:cvdReport([modes.dark.primary,modes.dark.secondary,modes.dark.accent],'dark',modes.dark.bg)},
  status:{light:cvdReport([modes.light.success,modes.light.warning,modes.light.danger],'light',modes.light.bg),dark:cvdReport([modes.dark.success,modes.dark.warning,modes.dark.danger],'dark',modes.dark.bg)}};
 const ranked=rankPairs(s,P,seedBase),frozenT=s.frozen.type&&PAIRS.find(p=>p.id===s.frozen.type),aiT=s.ai&&s.ai.type&&PAIRS.find(p=>p.id===s.ai.type);
 const pair=frozenT||(aiT&&s.seeds.type===0?aiT:null)||ranked[s.seeds.type%Math.min(8,ranked.length)];
 const ratioR=P.e>.75?1.333:P.e>.5?1.28:P.e>.3?1.25:1.2;
 const type={...pair,ratio:ratioR,scale:typeScale(ratioR),alternatives:ranked.slice(0,8).map(p=>p.id)};
 const logo=s.frozen.logo&&s.frozen.logo.shape?s.frozen.logo:logoParams(s,P,seedBase);
 const pal={brand:pp.hex,secondary:pp.secHex,accent:pp.accHex,primaryName:colourName(pp.hex),secondaryName:colourName(pp.secHex),accentName:colourName(pp.accHex),harmony:pp.harm,from:pp.from,params:pp};
 const copy=copyFor(s,P,pal,type);
 const b={state:s,name:s.name||'Untitled',profile:P,seedBase,mode:primaryMode,pal,ramps,modes,checks,fixes,cvd,type,logo,copy,initials:initials(s.name,logo.two),radius:Math.round(P.r)};
 b.kit=kitOf(b);return b}

/* ---------------- theme kit object (kits/themes.js shape) ---------------- */
function kitOf(b){const TK=window.ThemeKits;const M=b.modes[b.mode],A=b.modes[b.mode==='dark'?'light':'dark'],P=b.profile;
 const tk=t=>({bg:t.bg,surface:t.surface,ink:t.ink,mute:t.mute,line:t.border,accent:t.primary,onAccent:t.onPrimary,accentText:t.primaryText,accent2:t.secondary,accent3:t.accent,radius:b.radius+'px',shadow:t.shadow,glow:t.glow});
 const id=('gen-'+(b.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,18)||'brand')+'-'+hash(JSON.stringify([b.state,b.mode,M.primary,b.type.id,b.logo])).toString(36)).slice(0,40);
 const roundy=P.r>12,sq=P.r<5;
 const k={id,no:(b.initials+'  ').slice(0,2).trim()||'BK',name:b.name,tagline:b.copy.tagline,mood:[...b.state.feels.slice(0,4),b.state.audience].filter(Boolean).join(', ')||'Generated brand',
  fonts:{head:b.type.headStack,body:b.type.bodyStack,css:b.type.css},t:tk(M),alt:tk(A),bg:P.bg,stroke:{w:roundy?1.75:1.5,cap:sq?'square':'round',join:sq?'miter':'round'},case:b.type.case==='upper'?'upper':'',
  voice:b.copy.voice,dos:b.copy.dos,donts:b.copy.donts,feel:(P.w.playful||P.w.youthful||P.w.quirky||P.w.friendly)?'playful':'serious',hw:b.type.hw,scale:b.type.ratio,wf:b.type.wf,role:'Founder',
  bgDesc:{brandmesh:'soft colour fields in the brand colours drifting slowly behind the content',brandgrid:'a quiet dot grid with a wave of brand colour passing through it',brandwave:'layered flowing lines in the brand colours'}[P.bg],tone:b.mode,generated:true};
 if(TK){TK.MARK[id]=()=>markInner(b,64);TK.PAT[id]=()=>patternSVG(b)}
 return k}

/* ---------------- SVG builders ---------------- */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fontImport=b=>`<style>@import url('${fontsURL(b.type).replace(/&/g,'&amp;')}');</style>`;
const famAttr=b=>b.type.headStack.replace(/"/g,"'");
function shapePath(shape,s){const h=s/2;switch(shape){case 'circle':return `<circle cx="${h}" cy="${h}" r="${h}"/>`;case 'rounded':return `<rect width="${s}" height="${s}" rx="${s*.22}"/>`;case 'squircle':return `<path d="M${h} 0C${s*.9} 0 ${s} ${s*.1} ${s} ${h}S${s*.9} ${s} ${h} ${s} 0 ${s*.9} 0 ${h} ${s*.1} 0 ${h} 0z"/>`;
 case 'hexagon':return `<path d="M${h} 0 ${s*.933} ${s*.25}V${s*.75}L${h} ${s} ${s*.067} ${s*.75}V${s*.25}z"/>`;case 'shield':return `<path d="M${s*.08} ${s*.06}H${s*.92}V${s*.5}C${s*.92} ${s*.78} ${s*.7} ${s*.92} ${h} ${s}C${s*.3} ${s*.92} ${s*.08} ${s*.78} ${s*.08} ${s*.5}z"/>`;case 'arch':return `<path d="M0 ${s}V${h}A${h} ${h} 0 0 1 ${s} ${h}V${s}z"/>`;default:return `<rect width="${s}" height="${s}" rx="${s*.08}"/>`}}
/* the mark: the uploaded logo if there is one, otherwise the monogram (64-unit coordinates, no outer svg) */
function markInner(b,s=64,o={}){const t=o.t||b.modes[b.mode];if(o.logo!==false&&b.logoURL)return `<image href="${esc(b.logoURL)}" x="0" y="0" width="${s}" height="${s}" preserveAspectRatio="xMidYMid meet"/>`;
 const L=b.logo,txt=b.initials,two=txt.length>1,fs=s*(two?.42:.56)*(b.type.case==='upper'||b.type.wf<.47?1.05:1)*(b.type.wf>.68?.82:1),plain=L.shape==='plain';
 const fill=plain?'none':t.primary,ink=plain?t.primaryText:t.onPrimary;
 return `<g fill="${fill}">${plain?'':shapePath(L.shape,s)}</g>${plain?`<rect x="${s*.12}" y="${s*.8}" width="${s*.76}" height="${s*.07}" fill="${t.accent}"/>`:''}<text x="${s/2}" y="${s*(L.shape==='arch'?.66:L.shape==='shield'?.6:.555)}" text-anchor="middle" dominant-baseline="middle" font-family="${esc(famAttr(b))}" font-weight="${b.type.hw}" font-size="${fs.toFixed(1)}" fill="${ink}" letter-spacing="${two?-.5:0}">${esc(txt)}</text>`}
function monogram(b,size=256,o={}){const t=o.t||b.modes[o.mode||b.mode];return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">${o.fonts?`<defs>${fontImport(b)}</defs>`:''}${o.bg?`<rect width="64" height="64" fill="${t.bg}"/>`:''}${markInner(b,64,{t,logo:false})}</svg>`}
function wordText(b){const n=b.logo.lower?b.name.toLowerCase():b.name;return b.type.case==='upper'?n.toUpperCase():n}
function wordmarkParts(b,t,x,y,size){x=+x;y=+y;const L=b.logo,txt=wordText(b),w=textW(txt,b.type,size)+Math.max(0,[...txt].length-1)*L.track*size;
 const dec=L.decor==='dot'?`<circle cx="${(x+w+size*.16).toFixed(1)}" cy="${(y-size*.09).toFixed(1)}" r="${(size*.09).toFixed(1)}" fill="${t.accent}"/>`:L.decor==='bar'?`<rect x="${x}" y="${(y+size*.2).toFixed(1)}" width="${(size*1.1).toFixed(1)}" height="${(size*.08).toFixed(1)}" fill="${t.accent}"/>`:L.decor==='slash'?`<path d="M${(x+w+size*.14).toFixed(1)} ${(y+size*.06).toFixed(1)}l${(size*.22).toFixed(1)} ${(-size*.74).toFixed(1)}" stroke="${t.accent}" stroke-width="${(size*.09).toFixed(1)}" stroke-linecap="round"/>`:'';
 return {svg:`<text x="${x}" y="${y}" font-family="${esc(famAttr(b))}" font-weight="${b.type.hw}" font-size="${size}" letter-spacing="${(L.track*size).toFixed(2)}" fill="${t.ink}">${esc(txt)}</text>${dec}`,w:w+(L.decor==='dot'||L.decor==='slash'?size*.45:0)}}
function wordmark(b,mode,o={}){const t=b.modes[mode||b.mode],size=64,p=wordmarkParts(b,t,24,96,size),W=Math.ceil(p.w+48),H=132;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${o.fonts?`<defs>${fontImport(b)}</defs>`:''}${o.bg!==false?`<rect width="${W}" height="${H}" fill="${t.bg}"/>`:''}${p.svg}</svg>`}
function lockup(b,layout,mode,o={}){const t=b.modes[mode||b.mode],size=56;let W,H,body;
 if(layout==='stacked'){const p=wordmarkParts(b,t,0,0,size);W=Math.ceil(Math.max(p.w,120)+64);H=size*3.4|0;const mx=(W-112)/2;body=`<g transform="translate(${mx} 24) scale(${112/64})">${markInner(b,64,{t})}</g>`+wordmarkParts(b,t,((W-p.w)/2).toFixed(1),(24+112+size*1.05).toFixed(1),size).svg;H=Math.ceil(24+112+size*1.45)}
 else{const p=wordmarkParts(b,t,24+88+20,24+44+size*.36,size);W=Math.ceil(24+88+20+p.w+28);H=24+88+24;body=`<g transform="translate(24 24) scale(${88/64})">${markInner(b,64,{t})}</g>${p.svg}`}
 return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${o.fonts?`<defs>${fontImport(b)}</defs>`:''}${o.bg!==false?`<rect width="${W}" height="${H}" fill="${t.bg}"/>`:''}${body}</svg>`}
function patternSVG(b){const t=b.modes[b.mode],L=b.logo;const sh=L.shape==='plain'?'rounded':L.shape;return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" fill="${t.bg}"/><g fill="${t.primary}" opacity=".22" transform="translate(8 8) scale(.5)">${shapePath(sh,64)}</g><g fill="${t.secondary}" opacity=".22" transform="translate(56 56) scale(.5)">${shapePath(sh,64)}</g><circle cx="72" cy="24" r="4" fill="${t.accent}"/><circle cx="24" cy="72" r="2.5" fill="${t.accent}"/></svg>`}

/* ---------------- token exports ---------------- */
const MODE_TOKENS=[['bg','bg'],['surface','surface'],['raised','raised'],['ink','ink'],['mute','mute'],['line','line'],['border','border'],['primary','primary'],['on-primary','onPrimary'],['primary-text','primaryText'],['secondary','secondary'],['on-secondary','onSecondary'],['secondary-text','secondaryText'],['accent','accent'],['on-accent','onAccent'],['accent-text','accentText'],['focus','focus'],
 ['success','success'],['success-text','successText'],['success-tint','successTint'],['warning','warning'],['warning-text','warningText'],['warning-tint','warningTint'],['danger','danger'],['danger-text','dangerText'],['danger-tint','dangerTint'],['info','info'],['info-text','infoText'],['info-tint','infoTint']];
const famList=s=>s.split(',').map(x=>x.trim().replace(/^['"]|['"]$/g,''));
function css(b){const M=b.modes,P=M[b.mode],alt=b.mode==='dark'?'light':'dark',mv=(m,ind='  ')=>MODE_TOKENS.map(([n,k])=>`${ind}--${n}: ${m[k]};`).join('\n');
 return `/* ${b.name} · brand tokens · made with the Brand kit generator (Visual & Motion Atlas)
   Primary mode: ${b.mode}. Every text pair is at least 4.5:1 and every UI colour at least 3:1 in both modes.
   Switch modes with <html data-theme="light|dark">; without it the visitor's system setting decides. */
@import url('${fontsURL(b.type)}');
:root{
  color-scheme: ${b.mode};
  --brand-primary: ${b.pal.brand};
  --brand-secondary: ${b.pal.secondary};
  --brand-accent: ${b.pal.accent};
${Object.entries(b.ramps).map(([n,arr])=>arr.map(([s,h])=>`  --${n}-${s}: ${h};`).join('\n')).join('\n')}
${mv(P)}
  --font-head: ${b.type.headStack};
  --font-body: ${b.type.bodyStack};
  --head-weight: ${b.type.hw};
  --head-case: ${b.type.case==='upper'?'uppercase':'none'};
  --radius: ${b.radius}px;
  --radius-sm: ${Math.round(b.radius/2)}px;
  --radius-pill: 999px;
  --shadow: ${P.shadow};
  --ring: ${P.glow};
${b.type.scale.map(s=>`  --text-${s.name}: ${(s.px/16).toFixed(3).replace(/0+$/,'').replace(/\.$/,'')}rem;\n  --leading-${s.name}: ${s.lh};`).join('\n')}
}
[data-theme="${alt}"]{
  color-scheme: ${alt};
${mv(M[alt])}
  --shadow: ${M[alt].shadow};
  --ring: ${M[alt].glow};
}
[data-theme="${b.mode}"]{
  color-scheme: ${b.mode};
${mv(P)}
}
@media (prefers-color-scheme: ${alt}){
  :root:not([data-theme]){
    color-scheme: ${alt};
${mv(M[alt],'    ')}
  }
}
body{margin:0;background:var(--bg);color:var(--ink);font:400 var(--text-base)/var(--leading-base) var(--font-body)}
h1,h2,h3{font-family:var(--font-head);font-weight:var(--head-weight);text-transform:var(--head-case)}
a{color:var(--primary-text)}
:focus-visible{outline:2px solid var(--focus);outline-offset:2px}
`}
function json(b){const col=v=>({$value:v}),grp=m=>{const o={$type:'color'};MODE_TOKENS.forEach(([n,k])=>o[n]=col(m[k]));return o};
 const ramps={$type:'color'};Object.entries(b.ramps).forEach(([n,arr])=>{ramps[n]={};arr.forEach(([s,h])=>ramps[n][s]=col(h))});
 const fs={$type:'dimension'},lh={$type:'number'};b.type.scale.forEach(s=>{fs[s.name]={$value:{value:s.px/16,unit:'rem'}};lh[s.name]={$value:s.lh}});
 return JSON.stringify({$description:`${b.name} brand tokens, made with the Brand kit generator (Visual & Motion Atlas). Format: W3C Design Tokens Community Group.`,
  color:{brand:{$type:'color',primary:col(b.pal.brand),secondary:col(b.pal.secondary),accent:col(b.pal.accent)},ramp:ramps,light:grp(b.modes.light),dark:grp(b.modes.dark)},
  font:{family:{$type:'fontFamily',head:{$value:famList(b.type.headStack)},body:{$value:famList(b.type.bodyStack)}},weight:{$type:'fontWeight',head:{$value:b.type.hw},body:{$value:400}}},
  'font-size':fs,'line-height':lh,
  radius:{$type:'dimension',base:{$value:{value:b.radius,unit:'px'}},sm:{$value:{value:Math.round(b.radius/2),unit:'px'}},pill:{$value:{value:999,unit:'px'}}},
  $extensions:{'com.motionatlas.brand':{name:b.name,tagline:b.copy.tagline,feels:b.state.feels,audience:b.state.audience,primaryMode:b.mode,typePairing:b.type.id,googleFonts:fontsURL(b.type),voice:b.copy.voice}}},null,2)}
function tailwind(b){const T=n=>`var(--${n})`;
 return `/* ${b.name} · Tailwind CSS config (v3 preset; for v4 import tokens.css and map these in @theme)
   Semantic colours read the CSS variables in tokens.css, so light/dark switching keeps working. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
${Object.entries(b.ramps).map(([n,arr])=>`        ${JSON.stringify(n)}: { ${arr.map(([s,h])=>`${s}: '${h}'`).join(', ')}${['primary','secondary','accent','success','warning','danger','info'].includes(n)?`, DEFAULT: '${T(n)}'`:''} },`).join('\n')}
${['bg','surface','raised','ink','mute','line','border','on-primary','primary-text','on-secondary','on-accent','focus'].map(n=>`        '${n}': '${T(n)}',`).join('\n')}
      },
      fontFamily: { head: ${JSON.stringify(famList(b.type.headStack))}, body: ${JSON.stringify(famList(b.type.bodyStack))} },
      fontSize: {
${b.type.scale.map(s=>`        '${s.name}': ['${s.px/16}rem', { lineHeight: '${s.lh}' }],`).join('\n')}
      },
      borderRadius: { brand: '${b.radius}px' },
      boxShadow: { brand: 'var(--shadow)', ring: 'var(--ring)' }
    }
  }
};
`}

/* ---------------- one-page brand guide (standalone HTML) ---------------- */
function guideHTML(b){const L=b.modes.light,D=b.modes.dark,P=b.modes[b.mode],ty=b.type;
 const sw=(n,h,on)=>`<div class="sw"><span style="background:${h};color:${on||best(h)}">${esc(n)}</span><code>${h}</code></div>`;
 const svgData=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
 const ck=b.checks[b.mode].filter(c=>/Text on background|Muted text on background|Label on primary|Primary text \(links\) on background|Primary button/.test(c.label));
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(b.name)} brand guide</title>
<link rel="stylesheet" href="${esc(fontsURL(ty))}">
<style>
:root{--bg:${L.bg};--surface:${L.surface};--ink:${L.ink};--mute:${L.mute};--line:${L.line};--primary:${L.primary};--on-primary:${L.onPrimary};--ptext:${L.primaryText};--head:${ty.headStack};--body:${ty.bodyStack}}
*{box-sizing:border-box}html,body{margin:0}body{background:var(--bg);color:var(--ink);font:15px/1.55 var(--body);-webkit-print-color-adjust:exact;print-color-adjust:exact}
main{max-width:1000px;margin:0 auto;padding:40px 32px;display:grid;gap:28px}
h1,h2,h3{font-family:var(--head);font-weight:${ty.hw};text-transform:${ty.case==='upper'?'uppercase':'none'};margin:0}
h1{font-size:56px;line-height:1.02}h2{font-size:15px;font-family:var(--body);font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);margin-bottom:12px}
.top{display:grid;grid-template-columns:1.3fr 1fr;gap:24px;align-items:end;border-bottom:1px solid var(--line);padding-bottom:24px}
.top p{margin:6px 0 0;font-size:18px;color:var(--mute)}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:${b.radius}px;padding:20px}
.logos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.logos div{border-radius:${b.radius}px;border:1px solid var(--line);display:grid;place-items:center;padding:18px;min-height:120px}.logos img{max-width:100%;height:auto;max-height:90px}
.sws{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.sw span{display:grid;align-items:end;height:74px;border-radius:${Math.max(4,b.radius/2)}px;padding:8px 10px;font-weight:600;font-size:13px}.sw code{font-size:12px;color:var(--mute)}
.ramp{display:flex;height:22px;border-radius:6px;overflow:hidden;margin-top:6px}.ramp i{flex:1}
.spec .big{font-family:var(--head);font-weight:${ty.hw};font-size:44px;line-height:1.05;text-transform:${ty.case==='upper'?'uppercase':'none'};margin:0 0 6px}
.spec p{margin:0 0 8px}.ts{display:grid;gap:4px;margin-top:10px;font-size:13px;color:var(--mute)}
ul{margin:0;padding-left:18px}li{margin:4px 0}
table{width:100%;border-collapse:collapse;font-size:13px}th,td{text-align:left;padding:6px 4px;border-bottom:1px solid var(--line)}td.n{text-align:right;font-variant-numeric:tabular-nums}
.voice q{display:block;font-family:var(--head);font-size:22px;margin:4px 0;quotes:"“" "”"}
.btn{display:inline-block;background:var(--primary);color:var(--on-primary);padding:10px 16px;border-radius:${b.radius}px;font-weight:600;text-decoration:none}
footer{font-size:12px;color:var(--mute);border-top:1px solid var(--line);padding-top:12px}
@media (max-width:720px){.top,.grid{grid-template-columns:1fr}.sws{grid-template-columns:repeat(2,minmax(0,1fr))}h1{font-size:40px}}
@page{size:A4;margin:12mm}@media print{main{padding:0;gap:18px}.card{break-inside:avoid}}
</style></head><body><main>
<header class="top"><div><h1>${esc(b.name)}</h1><p>${esc(b.copy.tagline)}</p></div><div><img src="${svgData(lockup(b,'horizontal','light',{bg:false,fonts:true}))}" alt="${esc(b.name)} logo" style="max-width:100%;height:auto;max-height:110px"></div></header>
<section class="grid"><div><h2>Logo</h2><div class="logos"><div style="background:${L.bg}"><img src="${svgData(lockup(b,'stacked','light',{bg:false,fonts:true}))}" alt="Stacked logo on light"></div><div style="background:${D.bg}"><img src="${svgData(lockup(b,'stacked','dark',{bg:false,fonts:true}))}" alt="Stacked logo on dark"></div><div style="background:${L.bg}"><img src="${svgData(monogram(b,96,{mode:'light',fonts:true}))}" alt="Monogram" width="96" height="96"></div><div style="background:${L.surface}"><img src="${svgData(wordmark(b,'light',{bg:false,fonts:true}))}" alt="Wordmark"></div></div>
<p style="font-size:13px;color:var(--mute)">Clear space: half the logo height on every side. Minimum size: 120px wide (30mm in print); below 32px use the monogram.</p></div>
<div><h2>Colour</h2><div class="sws">${sw(b.pal.primaryName,b.pal.brand)}${sw(b.pal.secondaryName,b.pal.secondary)}${sw(b.pal.accentName,b.pal.accent)}${sw('Ink',P.ink)}${sw('Background',P.bg)}${sw('Muted',P.mute)}</div>
${['primary','secondary','accent','neutral'].map(n=>`<div class="ramp" role="img" aria-label="${n} scale from 50 to 950">${b.ramps[n].map(([,h])=>`<i style="background:${h}"></i>`).join('')}</div>`).join('')}
<table style="margin-top:12px"><caption style="text-align:left;font-size:13px;color:var(--mute);padding-bottom:4px">Contrast (${b.mode} mode, WCAG 2.2)</caption><tbody>${ck.map(c=>`<tr><th scope="row">${esc(c.label)}</th><td class="n">${c.ratio.toFixed(2)}:1 · ${c.pass?'pass':'fail'}</td></tr>`).join('')}</tbody></table></div></section>
<section class="grid"><div class="card spec"><h2>Type</h2><p class="big">${esc(b.copy.voice[0])}</p><p>${esc(ty.head)} ${ty.hw} for headlines, ${esc(ty.body)} for everything you read. ${esc(ty.why)}</p><div class="ts">${ty.scale.slice().reverse().filter((s,i)=>i%2===0).map(s=>`<span>${s.name} · ${s.px}px / ${s.lh}</span>`).join('')}</div></div>
<div class="card voice"><h2>Voice</h2>${b.copy.voice.map(v=>`<q>${esc(v)}</q>`).join('')}<p style="margin-top:14px"><a class="btn" href="#">Primary action</a></p></div></section>
<section class="grid"><div><h2>Do</h2><ul>${b.copy.dos.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h2>Avoid</h2><ul>${b.copy.donts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></section>
<footer>${esc(b.name)} brand guide · generated with the Brand kit generator, Visual &amp; Motion Atlas · fonts from Google Fonts (SIL Open Font Licence)</footer>
</main></body></html>`}

window.BrandGen={FEELS,FEEL_KEYS,PAIRS,SYN,resolveFeel,hintHues,generate,norm,DEFAULT,css,json,tailwind,guideHTML,wordmark,monogram,lockup,markInner,patternSVG,fontsURL,colourName,
 oklch,lch,ratio,fix,best,normHex,isHex,dE,cvdMin,hash,esc,setMeasure:f=>{MEASURE=f},MODE_TOKENS,initials};
})();

/* ---------------- animated backgrounds for generated kits (registered with ThemeKits.BG; each is self-contained so bgJS can export it) ---------------- */
(()=>{const TK=window.ThemeKits;if(!TK)return;Object.assign(TK.BG,{
brandmesh(c,t,still){const x=c.getContext('2d');let W=1,H=1,raf;const cols=[t.accent,t.accent2||t.accent,t.accent3||t.accent,t.accent2||t.accent];
 function size(){const d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,Math.round(c.clientWidth*d));H=c.height=Math.max(1,Math.round(c.clientHeight*d))}
 function draw(n){const s=n/1000*.11;x.globalCompositeOperation='source-over';x.fillStyle=t.bg;x.fillRect(0,0,W,H);
  for(let i=0;i<4;i++){const a=s*(1+i*.27)+i*1.9,cx=W*(.55+.36*Math.cos(a)),cy=H*(.5+.38*Math.sin(a*1.3+i)),r=Math.max(W,H)*(.36+.07*Math.sin(a*.7+i));const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,cols[i]+'99');g.addColorStop(1,cols[i]+'00');x.fillStyle=g;x.fillRect(0,0,W,H)}}
 size();if(still){draw(5200);return()=>{}}const loop=n=>{draw(n);raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
brandgrid(c,t,still){const x=c.getContext('2d');let W=1,H=1,raf,d=1;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,Math.round(c.clientWidth*d));H=c.height=Math.max(1,Math.round(c.clientHeight*d))}
 function draw(n){const s=n/1000;x.fillStyle=t.bg;x.fillRect(0,0,W,H);const g=22*d;for(let yy=g/2;yy<H;yy+=g)for(let xx=g/2;xx<W;xx+=g){const w=Math.sin(xx/W*6.3-s*.9+yy/H*2.2)*.5+.5,k=w*w*w;x.globalAlpha=.18+.7*k;x.fillStyle=k>.55?t.accent:k>.3?(t.accent2||t.accent):(t.line||t.mute);const r=(1+2.2*k)*d;x.beginPath();x.arc(xx,yy,r,0,6.283);x.fill()}x.globalAlpha=1}
 size();if(still){draw(2600);return()=>{}}let last=0;const loop=n=>{raf=requestAnimationFrame(loop);if(n-last<33)return;last=n;draw(n)};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
brandwave(c,t,still){const x=c.getContext('2d');let W=1,H=1,raf,d=1;const cols=[t.accent,t.accent2||t.accent,t.accent3||t.accent];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=Math.max(1,Math.round(c.clientWidth*d));H=c.height=Math.max(1,Math.round(c.clientHeight*d))}
 function draw(n){const s=n/1000*.35;x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.lineWidth=1.4*d;for(let i=0;i<18;i++){x.strokeStyle=cols[i%3];x.globalAlpha=.16+.5*(i/18);x.beginPath();for(let xx=0;xx<=W;xx+=8*d){const y=H*(.25+i*.035)+Math.sin(xx/W*4+s+i*.35)*H*.08+Math.sin(xx/W*9-s*1.3+i)*H*.025;xx?x.lineTo(xx,y):x.moveTo(xx,y)}x.stroke()}x.globalAlpha=1}
 size();if(still){draw(3000);return()=>{}}const loop=n=>{draw(n);raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}}});})();
