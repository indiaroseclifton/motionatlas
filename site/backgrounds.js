'use strict';
/* Background generator (#backgrounds).
   Sixteen procedural families drawn by one WebGL fragment shader. Every image is computed from its
   settings, so the library is unlimited and everything exported belongs to the person who made it.
   Motion is a seamless loop: time is an angle, and noise is sampled on a circle. */
(()=>{
 const FRAG=`precision highp float;
uniform vec2 R;uniform float A,S,SC,WP,SF,GR,MO,GS;uniform int M;uniform vec3 C0,C1,C2,C3,C4;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec2 h22(vec2 p){float n=h21(p);return vec2(n,h21(p+n+.13));}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),u.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*noise(p);p=r*p*2.02+3.1;a*=.5;}return v;}
vec3 pal(float t){t=clamp(t,0.,1.)*4.;if(t<1.)return mix(C0,C1,t);if(t<2.)return mix(C1,C2,t-1.);if(t<3.)return mix(C2,C3,t-2.);return mix(C3,C4,t-3.);}
vec3 pick(int i){if(i==0)return C0;if(i==1)return C1;if(i==2)return C2;if(i==3)return C3;return C4;}
float glyph(float lv,vec2 c){float b=0.;if(lv<1.)b=0.;else if(lv<2.)b=6.;else if(lv<3.)b=24672.;else if(lv<4.)b=3840.;else if(lv<5.)b=28512.;else if(lv<6.)b=618345.;else if(lv<7.)b=456438.;else b=1022863.;
 float col=floor(c.x*5.),row=floor((1.-c.y)*6.);if(col>3.||row>4.)return 0.;float k=19.-(row*4.+col);return mod(floor(b/pow(2.,k)),2.);}
void main(){vec2 uv=gl_FragCoord.xy/R;float asp=R.x/R.y;vec2 p=(uv-.5)*vec2(asp,1.);vec2 sd=vec2(S*1.37,S*2.11);vec2 L=vec2(cos(A),sin(A))*MO;vec3 col;
 if(M==0){vec2 q=p*SC*.6;q+=WP*.35*vec2(fbm(q*1.5+sd+L),fbm(q*1.5+sd+5.2-L))-WP*.17;vec3 acc=vec3(0.);float ws=0.;
  for(int i=0;i<5;i++){float fi=float(i);vec2 c=(h22(vec2(fi+.5,S))-.5)*vec2(asp,1.)*1.1*SC*.6;c+=.16*vec2(cos(A+fi*1.3),sin(A+fi*2.1))*MO;float d=length(q-c);float w=1./pow(d+.03,1.4+(1.-SF)*3.2);acc+=pick(i)*w;ws+=w;}col=acc/ws;}
 else if(M==1){vec2 q=p*SC;vec2 a=vec2(fbm(q+sd+L*.5),fbm(q+sd+vec2(5.2,1.3)-L*.5));vec2 b=vec2(fbm(q+WP*2.*a+vec2(1.7,9.2)+L*.3),fbm(q+WP*2.*a+vec2(8.3,2.8)));float f=smoothstep(.18,.82,fbm(q+WP*2.*b));f=mix(floor(f*7.)/6.,f,SF);col=pal(f);}
 else if(M==2){col=mix(C1,C0,clamp(uv.y*1.1,0.,1.))*.85;for(int i=0;i<3;i++){float fi=float(i);float x=p.x*SC*.8+fi*1.7+S;float wave=(fbm(vec2(x*.7,fi*3.+L.x*.4))-.5)*1.3+.12*sin(x*2.+A+fi);float y=p.y-(wave*.45-.12+fi*.09);
  float base=smoothstep(-.02-.05*SF,0.,y);float fade=exp(-max(y,0.)*(4.5+(1.-SF)*5.));float rays=fbm(vec2(x*16.*(.4+WP),y*.25+L.y*.3+fi*7.));rays=pow(rays,1.6)*2.2;float under=exp(min(y,0.)*28.)*.18;col+=pick(i+2)*(base*fade*rays+under)*.75;}col=1.-exp(-col*1.3);}
 else if(M==3){vec2 q=p*SC;float r=length(q),an=atan(q.y,q.x)+WP*3.2*exp(-r*.7);q=vec2(cos(an),sin(an))*r;float f=fbm(q*1.4+sd+L*.4);float bands=.5+.5*sin(f*18.*(.4+WP));col=pal(clamp(mix(bands,f*1.2-.1,SF),0.,1.));}
 else if(M==4){vec2 q=p*SC;float f=fbm(q+sd+L*.5+WP*vec2(fbm(q*2.+sd),fbm(q*2.-sd)));vec3 film=.5+.5*cos(f*6.2831*(1.4+WP*2.)+vec3(0.,2.1,4.2));col=mix(pal(smoothstep(.2,.8,f)),film*(.55+.45*pal(f)),.35+.35*(1.-SF));}
 else if(M==5){float hz=.4+.05*(fbm(vec2(p.x*2.+S,0.)+L*.2)-.5)*WP*4.;vec2 sp=vec2((h21(vec2(S,1.))-.5)*.5*asp,hz-.5+.11);
  float y=uv.y;float t=clamp((y-hz)/(1.-hz),0.,1.);vec3 sky=t<.5?mix(C2,C1,t*2.):mix(C1,C0,(t-.5)*2.);float d=length(p-sp);sky=mix(sky,C4,smoothstep(.07,.062,d));sky+=C4*.28*exp(-d*d*(26.-SF*16.));sky+=C3*exp(-abs(y-hz)*(12.-SF*6.))*.3;
  if(y<hz){float yy=2.*hz-y;float tt=clamp((yy-hz)/(1.-hz),0.,1.);vec3 r=tt<.5?mix(C2,C1,tt*2.):mix(C1,C0,(tt-.5)*2.);float rip=fbm(vec2(p.x*3.,y*40.)+sd+L*.4);vec2 rp=vec2(p.x+(rip-.5)*.04,(hz-.5)*2.-p.y);float rd=length(rp-sp);r+=C4*.6*exp(-rd*rd*30.)*rip;col=mix(C3*.35,r,.6);}else col=sky;}
 else if(M==6){vec2 q=p*SC*.8;float r=length(q),an=atan(q.y,q.x);float rings=.5+.5*cos(r*(10.+WP*30.)-A);float n=fbm(vec2(cos(an),sin(an))*1.6+vec2(r*3.)+sd+L*.3);float glow=exp(-r*(2.6-SF*1.6));col=pal(clamp(glow*(.72+.28*rings)+n*.18,0.,1.));}
 else if(M==7){col=C0;for(int i=1;i<5;i++){float fi=float(i);vec2 c=(h22(vec2(fi,S))-.5)*vec2(asp,1.)*.95+.12*vec2(cos(A+fi*2.),sin(A+fi*1.3))*MO;float rad=(.22+.28*h21(vec2(fi,S+3.)))/(SC*.7);float d=length(p-c+WP*.08*(vec2(fbm(p*2.+sd+fi),fbm(p*2.-sd+fi))-.5));col=mix(col,pick(i),(1.-smoothstep(rad*.15*(1.-SF),rad*(1.+SF*1.1),d))*.92);}}
 else if(M==8){float an=S*.7;vec2 dir=vec2(cos(an),sin(an));float t=dot(p,dir)*SC*.7+.5+WP*.3*(fbm(p*2.+sd+L*.4)-.5);col=pal(clamp(t,0.,1.));}
 else if(M==10){vec2 q=p*SC*2.+sd;vec2 w=q+(.5+WP)*vec2(fbm(q*.7+L*.5),fbm(q*.7+3.1-L*.5));float r1=1.-abs(fbm(w*1.3)*2.-1.);float r2=1.-abs(fbm(w*1.9+7.3+L*.3)*2.-1.);float k=clamp(pow(r1,14.-SF*8.)*.8+pow(r2,18.-SF*8.)*.55,0.,1.);float depth=fbm(p*SC*.8+sd);col=mix(pal(depth*.55),pal(.95),k);col+=C4*k*k*.3;}
 else if(M==11){vec2 q=p*SC*.9;float h=(fbm(q+sd+L*.25+WP*.5*vec2(fbm(q*1.7+sd),fbm(q*1.7-sd)))-.2)/.6;float n=9.+WP*18.;float hn=h*n;float f=fract(hn);float line=1.-smoothstep(0.,.07+(1.-SF)*.08,min(f,1.-f)*1.6);float major=mod(floor(hn+.5),5.)<.5?1.:0.;col=mix(C0,C1,clamp(h,0.,1.));col=mix(col,C2,line*.6);col=mix(col,C3,line*major*.85);}
 else if(M==12){float cell=mix(26.,8.,clamp((SC-.5)/3.,0.,1.))*GS;float an=.5+S*.01;mat2 ro=mat2(cos(an),-sin(an),sin(an),cos(an));vec2 g=ro*gl_FragCoord.xy/cell;vec2 id=floor(g),f=fract(g)-.5;vec2 cp=(ro*((id+.5)*cell)/R.x-vec2(.5,.5*R.y/R.x))*1.6;float v=smoothstep(.2,.8,fbm(cp*1.2+sd+L*.4+WP*vec2(fbm(cp*2.+sd),0.)));float r=sqrt(v)*.62;float d=length(f);float dot1=1.-smoothstep(r-.06-.1*(1.-SF),r+.02,d);col=mix(C0,pal(.25+.75*v),dot1);}
 else if(M==13){vec2 q=p*SC;float n=fbm(q*.8+sd+L*.35);float lines=12.+WP*40.;float v=sin((q.y+n*(.6+WP*1.4))*lines);float band=smoothstep(-.2-(1.-SF)*.6,.2+(1.-SF)*.6,v);float t=fbm(q*.5-sd);col=mix(pal(t*.45),pal(.55+t*.45),band);}
 else if(M==14){vec2 q=p*SC*2.2+sd;q+=WP*.4*vec2(fbm(q*.8+L*.3),fbm(q*.8+5.-L*.3));vec2 i=floor(q),f=fract(q);float d1=8.,d2=8.;vec2 bi=vec2(0.);for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 o=vec2(float(x),float(y));vec2 pt=h22(i+o);pt=.5+(pt-.5)*.8+.1*sin(A+6.2831*pt)*MO;float d=length(o+pt-f);if(d<d1){d2=d1;d1=d;bi=i+o;}else if(d<d2)d2=d;}float edge=smoothstep(0.,.04+.12*SF,d2-d1);float k=h21(bi+S);col=mix(C0,pal(.2+.8*k)*(.75+.25*(1.-d1)),edge);}
 else if(M==15){vec2 q=p*SC*2.;float an=.6+S*.37;vec2 d=vec2(cos(an),sin(an));float u=dot(q,d),v=dot(q,vec2(-d.y,d.x));float w=(noise(vec2(u*.3,v*.45)+sd+L*.25)*2.+noise(vec2(u*.6,v*.9)-sd)*.8)*(2.5+WP*4.);float h=sin(u*1.9+w)*(.7+.3*noise(q*.4-sd));float spec=pow(max(0.,h),4.+SF*14.);float shade=smoothstep(-1.,1.,h);col=pal(clamp(.06+shade*.78,0.,1.))+C4*spec*.5;}
 else{float cell=mix(30.,9.,clamp((SC-.5)/3.,0.,1.))*GS;vec2 cs=vec2(cell*.62,cell);vec2 cid=floor(gl_FragCoord.xy/cs);vec2 cuv=fract(gl_FragCoord.xy/cs);vec2 cp=(cid*cs/R-.5)*vec2(asp,1.)*1.6;
  vec2 a=vec2(fbm(cp+sd+L*.5),fbm(cp+sd+vec2(5.2,1.3)));float f=smoothstep(.28,.72,fbm(cp+WP*2.*a));float g=glyph(1.+f*7.,cuv);col=mix(C0,pal(.3+.7*f),g*(.55+.45*SF+.0));}
 float g=h21(floor(gl_FragCoord.xy/max(GS,1.))+S)-.5;col+=g*GR*.2;gl_FragColor=vec4(clamp(col,0.,1.),1.);}`;
 const VERT='attribute vec2 v;void main(){gl_Position=vec4(v,0.,1.);}';
 const FAMILIES=['Mesh','Liquid','Aurora','Swirl','Iridescent','Horizon','Portal','Orbs','Grain','ASCII','Caustics','Contours','Halftone','Op lines','Cells','Silk'];
 const P=(name,mode,colors,seed,scale,warp,soft,grain,motion=1)=>({name,mode,colors,seed,scale,warp,soft,grain,motion});
 /* Sixteen named collections, five presets each. Palettes run dark-to-light or ground-to-highlight. */
 const COLLECTIONS=[
  {id:'velvet',name:'Velvet Mesh',note:'Soft colour fields that melt into one another.',presets:[
   P('Peach Silk',0,['#f6d5c4','#f29c8f','#c9a7eb','#fbe3a7','#ffffff'],3,1.2,.55,.75,.18),P('Deep Plum',0,['#1b1033','#5b2a86','#c0417a','#f08a5d','#2c1b5a'],11,1.1,.7,.7,.22),
   P('Sea Glass',0,['#d8f3ec','#7fd1c7','#3b8ea5','#f5f1e3','#a7c7e7'],27,1.3,.5,.8,.15),P('Citrus Haze',0,['#fff4d6','#ffcf56','#ff8a5b','#9ad0a1','#fde2e4'],41,1.0,.6,.72,.2),P('Midnight Bloom',0,['#0b1026','#203a8f','#7b5cd6','#e86fb3','#0f2a4a'],58,1.15,.8,.65,.25)]},
  {id:'liquid',name:'Liquid Smoke',note:'Domain-warped noise, from silky to banded.',presets:[
   P('Ink in Milk',1,['#f4f1ea','#d9d3c7','#8a8f9c','#2f3542','#11141a'],5,2.2,1.1,.9,.12),P('Molten Copper',1,['#1a0f0a','#5c2a12','#b5582b','#f0a35e','#ffe2b8'],19,1.8,1.3,.85,.18),
   P('Lagoon',1,['#04202e','#0b5563','#13a89e','#8be0c9','#f2fff9'],33,2.0,1.0,.9,.14),P('Posterised Dusk',1,['#2b1a3f','#6d2e66','#c84b62','#f59a5a','#ffd796'],47,2.4,1.2,.15,.1),P('Graphite Marble',1,['#0d0e10','#2b2f36','#6b7280','#c7ccd4','#f6f7f9'],62,2.8,1.4,.7,.2)]},
  {id:'aurora',name:'Northern Curtains',note:'Light curtains with rays, over a night sky.',presets:[
   P('Polar Night',2,['#020611','#0b1a33','#36f1a1','#5fd0ff','#b083ff'],7,1.0,.6,.6,.18),P('Rose Veil',2,['#0c0613','#1f0e2b','#ff6fb1','#ffb36b','#9b6bff'],21,1.1,.5,.7,.2),
   P('Glacier',2,['#03101a','#0a2a3b','#7ff7e3','#9ad7ff','#e6fbff'],36,.9,.7,.5,.15),P('Solar Storm',2,['#080305','#1d0b0f','#ff5a3c','#ffd23f','#ff9f1c'],49,1.2,.8,.55,.22),P('Quiet Green',2,['#050a08','#0e1f19','#5df2a6','#2bc4a3','#d2ffe9'],66,.8,.45,.8,.16)]},
  {id:'vortex',name:'Vortex',note:'Twisted fields and contour bands.',presets:[
   P('Candy Spiral',3,['#ff7eb6','#ffb3d1','#fff1f6','#9ad7ff','#5b7cfa'],9,1.6,.9,.2,.1),P('Tidepool',3,['#03252f','#06596b','#2fb0a8','#c4f1e0','#fdfdf5'],23,1.4,.7,.55,.14),
   P('Saffron Whirl',3,['#3a0d0d','#a3261b','#f2762e','#ffc94a','#fff3d1'],38,1.8,1.0,.3,.16),P('Moonstone',3,['#14161c','#3a4150','#8e9aaf','#dfe4ec','#ffffff'],53,1.2,.6,.75,.2),P('Violet Eddy',3,['#120a2a','#3c1e7a','#8a5cf6','#d6b4ff','#fbf7ff'],70,1.5,.85,.4,.12)]},
  {id:'oilslick',name:'Oil Slick',note:'Thin-film interference, like light on oil or soap.',presets:[
   P('Holo Foil',4,['#d9dce3','#b8c1d6','#e9d8f2','#cfe9e4','#ffffff'],4,1.4,.6,.3,.12),P('Beetle Shell',4,['#071a12','#0d3b2e','#1d6b5c','#7a5cff','#1b2a6b'],17,1.6,.8,.2,.18),
   P('Pearl',4,['#f4efe8','#e7dfd6','#d9e4ef','#f1e1ec','#ffffff'],31,1.1,.4,.85,.1),P('Petrol',4,['#0a0a0f','#1c1b2e','#2e5b6e','#6b3a7a','#c99a3a'],44,1.8,1.0,.25,.2),P('Opal Mist',4,['#e9f6f6','#f3e7f6','#fff3dd','#d9f0ff','#ffffff'],60,1.2,.5,.6,.08)]},
  {id:'lowsun',name:'Low Sun',note:'Skies, horizons and reflections at the edge of the day.',presets:[
   P('Golden Hour',5,['#2b3a67','#f2a65a','#ffd29d','#f46036','#fff4d6'],6,1,.6,.6,.18),P('Blue Hour',5,['#0b1640','#3b4f9e','#a5b8ff','#6f5fb8','#f6f1ff'],15,1,.4,.5,.2),
   P('Desert Haze',5,['#7aa6c9','#f3c98b','#f7e2bf','#d98f5c','#fffaf0'],29,1,.8,.85,.22),P('Ember Coast',5,['#1a0b1f','#a8325e','#ff8a5c','#5a1e3c','#ffe0a3'],42,1,.5,.4,.2),P('Pale Morning',5,['#9fb7d6','#e9cdb8','#f6e3d1','#c2b2c8','#fff6e8'],57,1,.3,.9,.12)]},
  {id:'gateways',name:'Gateways',note:'Radial glows and rings that draw the eye to the centre.',presets:[
   P('Event Horizon',6,['#000000','#1b0a2e','#7b2cbf','#f72585','#ffd6ff'],8,1.2,.4,.5,.2),P('Signal',6,['#020a12','#063b5c','#1fb5e0','#a6f0ff','#ffffff'],24,1.0,.7,.3,.14),
   P('Sunflower',6,['#1c0f00','#6b3b00','#e09f00','#ffd84d','#fff8db'],39,1.1,.5,.6,.16),P('Mint Tunnel',6,['#03140f','#0e4535','#2fc49a','#b9f5df','#f4fffb'],52,1.3,.9,.4,.12),P('Rose Gate',6,['#14040c','#4a0f2b','#d6336c','#ffa8c5','#fff0f6'],68,1.0,.6,.55,.18)]},
  {id:'orbs',name:'Soft Orbs',note:'Large blurred light sources on a calm ground.',presets:[
   P('Studio Light',7,['#f2eee8','#ffb38a','#8fb3ff','#ffd966','#c9a7ff'],2,1,.4,.9,.14),P('Night Bokeh',7,['#0b0d17','#ff6b9a','#4f7cff','#ffb84d','#7ef0d0'],13,1.2,.5,.8,.2),
   P('Linen',7,['#efe9df','#d9bfa0','#b9a48c','#fbf5ec','#c7a985'],26,.9,.3,1,.18),P('Lime Pop',7,['#f6ffe9','#c6f36b','#62d2a2','#fff27a','#9fd8ff'],37,1.1,.6,.85,.12),P('Ocean Floor',7,['#021826','#0b6c8c','#01baef','#2bd67b','#1d4e89'],61,1.0,.5,.95,.22)]},
  {id:'grain',name:'Grain Wash',note:'Film-grained linear blends with a gentle wobble.',presets:[
   P('Riso Sunset',8,['#ff5f6d','#ffc371','#ffe8d6','#7f7fd5','#2b2d6e'],1,1.1,.6,.5,.7),P('Clay',8,['#5b3a29','#a86b4c','#e7b38c','#f3e1cf','#ffffff'],12,1.0,.4,.5,.6),
   P('Ultramarine',8,['#08104a','#1d3ccf','#6c8cff','#d5ddff','#ffffff'],22,1.2,.5,.5,.55),P('Matcha',8,['#1f2d1a','#4b6b2e','#9cbf5a','#e7efc5','#fbfdf2'],35,.9,.3,.5,.5),P('Neon Signage',8,['#12001f','#ff2fb9','#ff8a00','#00e5ff','#ffffff'],50,1.3,.7,.5,.65)]},
  {id:'terminal',name:'Terminal Weather',note:'Noise fields drawn as text characters.',presets:[
   P('Phosphor',9,['#020a04','#0b3d16','#22c55e','#86efac','#f0fff4'],10,1.6,1.0,.8,.1),P('Amber CRT',9,['#0d0700','#3d2200','#f59e0b','#fcd34d','#fffbeb'],20,1.8,1.1,.8,.12),
   P('Blueprint',9,['#0a1f44','#1e3a8a','#60a5fa','#bfdbfe','#ffffff'],30,2.2,.9,.9,.08),P('Paper Type',9,['#f5f1e8','#d8d0c0','#8a7f6e','#3b342c','#14110d'],45,2.6,1.2,.9,.14),P('Magenta Static',9,['#0f0614','#4a1060','#e040fb','#ff80ab','#ffffff'],65,1.4,1.3,.7,.16)]},
  {id:'caustics',name:'Pool Light',note:'Rippling caustics, like sun through water onto a pool floor.',presets:[
   P('Lido',10,['#03243a','#0a5f86','#1aa6c9','#7fe3f0','#ffffff'],4,1.0,.5,.5,.12),P('Midnight Pool',10,['#010814','#06213f','#145a8c','#4fb3e8','#d8f6ff'],18,1.2,.6,.4,.18),
   P('Lagoon Gold',10,['#0b2a26','#14615a','#3fae95','#ffd98a','#fff8e1'],29,.9,.4,.6,.14),P('Rose Water',10,['#2a0f24','#6e2a5a','#c45a8f','#ffb3cf','#fff2f8'],43,1.1,.55,.5,.12),P('Glass Floor',10,['#e8f1f3','#c3dce2','#8fc3cf','#5aa6b8','#ffffff'],57,1.3,.45,.7,.08)]},
  {id:'contours',name:'Survey Lines',note:'Topographic contour lines over a soft height field.',presets:[
   P('Ordnance',11,['#f3efe4','#e3dac6','#b7a98c','#7a5a3a','#ffffff'],3,1.2,.4,.6,.14),P('Night Survey',11,['#0b1220','#17263f','#4b6a9b','#9cc3ff','#ffffff'],14,1.0,.5,.5,.16),
   P('Moss Map',11,['#1d2a1a','#2f4a2a','#88a86a','#e6d79a','#ffffff'],27,1.4,.6,.55,.18),P('Blueprint Hills',11,['#0d2c5a','#123a74','#6fa8ff','#e6f0ff','#ffffff'],40,1.1,.45,.4,.1),P('Clay Relief',11,['#f6e7d8','#e9c8a8','#c9825a','#7a3a22','#ffffff'],55,1.3,.7,.6,.16)]},
  {id:'halftone',name:'Riso Dots',note:'Halftone dot screens that grow and shrink with the field.',presets:[
   P('Riso Pink',12,['#fbf4ea','#ff5ea8','#ff7aa8','#f2386f','#2b2bd8'],5,1.4,.6,.7,.2),P('Newsprint',12,['#f1ece2','#4a4a4a','#2b2b2b','#151515','#000000'],16,1.8,.5,.7,.25),
   P('Teal Screen',12,['#0e1a1c','#0f6b6b','#24a6a0','#7de0d2','#e9fffb'],30,1.2,.7,.6,.15),P('Sun Dots',12,['#2a0d05','#e8541b','#f7931e','#ffd23f','#fff7d6'],46,1.6,.8,.65,.18),P('Indigo Print',12,['#f4f1ea','#1d2b8a','#3047c9','#6f84ff','#c9d2ff'],63,2.0,.6,.7,.22)]},
  {id:'oplines',name:'Op Lines',note:'Parallel lines bent by noise, from calm stripes to optical ripples.',presets:[
   P('Bridget',13,['#0a0a0a','#1e1e1e','#f2f2f2','#ffffff','#ffffff'],2,1.2,.6,.1,.08),P('Candy Stripe',13,['#ffe3ec','#ff8fb1','#fff7f0','#7ec8e3','#3a6ea5'],19,1.0,.4,.5,.1),
   P('Dune Lines',13,['#3b2414','#8a5a33','#e0b07c','#f6dfbf','#fff6ea'],33,1.4,.5,.6,.16),P('Electric',13,['#06021a','#2a0a6e','#ff2fb9','#29f0ff','#ffffff'],48,1.1,.8,.3,.12),P('Sage Ripple',13,['#1d2a22','#3f5a48','#a8c3a0','#e8efe0','#ffffff'],60,1.3,.3,.7,.14)]},
  {id:'cells',name:'Stained Cells',note:'Voronoi cells, from leaded glass to crackle glaze.',presets:[
   P('Leaded Glass',14,['#0b0b10','#1f4e79','#c0392b','#f1c40f','#27ae60'],7,1.0,.2,.15,.14),P('Crackle Glaze',14,['#2b2a26','#e9e2d0','#d8cfb8','#f4efe2','#c9bfa6'],21,1.6,.4,.1,.16),
   P('Coral Reef',14,['#071f2b','#ff7f6e','#ffb38a','#3ec1d3','#f6f7d7'],34,1.2,.6,.4,.12),P('Mosaic Night',14,['#05060a','#2d1e6b','#5a2a8a','#1f6b8a','#c9a227'],52,1.4,.3,.2,.18),P('Pebble',14,['#e7e2d8','#bfb5a5','#9a8f80','#d8d1c4','#f6f3ec'],67,1.8,.5,.6,.14)]},
  {id:'silk',name:'Silk Folds',note:'Draped fabric with soft folds and a satin highlight.',presets:[
   P('Champagne Satin',15,['#3a2a18','#8a6a3e','#d4b07a','#f2dfb8','#fff8ea'],6,1.0,.5,.4,.1),P('Midnight Silk',15,['#05060f','#121a3a','#2e3f8f','#7d8fe0','#e8ecff'],17,1.2,.6,.5,.12),
   P('Rose Charmeuse',15,['#2a0a14','#7a2340','#c9577a','#f2a6bd','#fff0f5'],28,.9,.45,.45,.1),P('Emerald Drape',15,['#03140c','#0b3d26','#1f7a50','#6fd3a0','#eafff4'],44,1.1,.55,.35,.12),P('Ivory Sheet',15,['#d9d2c5','#e8e2d6','#f2ede3','#faf7f1','#ffffff'],59,1.3,.4,.6,.08)]}
 ];
 const ALL=COLLECTIONS.flatMap(c=>c.presets.map((p,i)=>({...p,collection:c.id,key:c.id+'-'+i})));
 const RATIOS=[['16:9',16/9,'Desktop'],['21:9',21/9,'Wide'],['4:3',4/3,'Slide'],['1:1',1,'Square'],['4:5',.8,'Portrait'],['9:16',9/16,'Story']];
 const hex2rgb=h=>{const n=parseInt(h.slice(1),16);return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');

 /* A small renderer that owns one GL context. */
 function Renderer(canvas,opts={}){
  const gl=canvas.getContext('webgl',{antialias:false,preserveDrawingBuffer:!!opts.keep,premultipliedAlpha:false});if(!gl)return null;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(o));return o;};
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VERT));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(pr);gl.useProgram(pr);
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(pr,'v');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const U={};['R','A','S','SC','WP','SF','GR','MO','GS','M','C0','C1','C2','C3','C4'].forEach(k=>U[k]=gl.getUniformLocation(pr,k));
  return {gl,draw(s,angle=0){const w=canvas.width,h=canvas.height;gl.viewport(0,0,w,h);gl.uniform2f(U.R,w,h);gl.uniform1f(U.A,angle);gl.uniform1f(U.S,s.seed);gl.uniform1f(U.SC,s.scale);gl.uniform1f(U.WP,s.warp);gl.uniform1f(U.SF,s.soft);gl.uniform1f(U.GR,s.grain);gl.uniform1f(U.MO,s.motion);gl.uniform1f(U.GS,Math.max(1,Math.min(w,h)/1080));gl.uniform1i(U.M,s.mode);s.colors.forEach((c,i)=>gl.uniform3fv(U['C'+i],hex2rgb(c)));gl.drawArrays(gl.TRIANGLES,0,3);}};
 }

 /* Harmonious random palettes: a base hue plus a scheme, sorted dark to light. */
 function randomPalette(seed){let s=seed*9301+49297;const r=()=>((s=(s*9301+49297)%233280)/233280);const base=r()*360,scheme=[[0,25,50,-25,180],[0,150,210,30,-30],[0,120,240,60,300],[0,10,20,30,40]][Math.floor(r()*4)];
  const cols=scheme.map((o,i)=>{const h=(base+o+360)%360,sat=45+r()*45,l=[14,38,58,74,92][i];return hsl(h,sat,l);});return r()<.35?cols.reverse():cols;}
 function hsl(h,s,l){s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return '#'+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('');}

 const state={collection:'all',ratio:'16:9',playing:!reduce.matches,s:null,preset:null};
 let main=null,raf=0,t0=performance.now(),thumbR=null,thumbCanvas=null,built=false;
 const ratioVal=()=>RATIOS.find(r=>r[0]===state.ratio)[1];

 function encode(s){return [s.mode,s.colors.map(c=>c.slice(1)).join('-'),s.seed,s.scale,s.warp,s.soft,s.grain,s.motion,state.ratio.replace(':','x')].join('.');}
 function decode(str){try{const [m,c,seed,sc,wp,sf,gr,mo,ra]=decodeURIComponent(str).split('.');const colors=c.split('-').map(x=>'#'+x);if(colors.length!==5||colors.some(x=>!/^#[0-9a-f]{6}$/i.test(x)))return null;const r=(ra||'16x9').replace('x',':');if(RATIOS.some(x=>x[0]===r))state.ratio=r;
  return {name:'Shared background',mode:Math.max(0,Math.min(FAMILIES.length-1,+m|0)),colors,seed:+seed||0,scale:+sc||1,warp:+wp||0,soft:+sf||0,grain:+gr||0,motion:+mo||1};}catch{return null;}}

 function shell(){const sec=document.getElementById('backgrounds');if(!sec||built)return;built=true;
  sec.innerHTML=`<header class="bgHead"><p class="cardcode">Generator · ${ALL.length} presets · unlimited variations</p><h1 class="pagetitle" id="bgTitle">Backgrounds.</h1><p class="intro">Gradients, light, liquid, grain and type, computed in your browser. Start from a preset, change the seed or the colours, then download a 4K image, a looping video or the code. Everything you make here is yours to use in personal and client work.</p></header>
  <div class="bgCollections" role="group" aria-label="Collections"></div>
  <div class="bgWork"><div class="bgStageWrap"><div class="bgStage"><canvas id="bgCanvas" aria-label="Generated background preview" role="img"></canvas><div class="bgStageBar"><span id="bgName"></span><button type="button" id="bgPlay" class="bgIcon" aria-pressed="false">Pause</button></div></div>
   <div class="bgRatios" role="group" aria-label="Aspect ratio">${RATIOS.map(r=>`<button type="button" data-ratio="${r[0]}"><b>${r[0]}</b><small>${r[2]}</small></button>`).join('')}</div></div>
   <aside class="bgPanel" aria-label="Background settings">
    <div class="bgRow"><label for="bgFamily">Family</label><select id="bgFamily">${FAMILIES.map((f,i)=>`<option value="${i}">${f}</option>`).join('')}</select></div>
    <fieldset class="bgPalette"><legend>Palette</legend><div>${[0,1,2,3,4].map(i=>`<label><span class="visually-hidden">Colour ${i+1}</span><input type="color" data-col="${i}"></label>`).join('')}</div><button type="button" id="bgShuffle" class="secondary">New palette</button></fieldset>
    ${[['scale','Scale',.4,4,.01],['warp','Distortion',0,2,.01],['soft','Softness',0,1,.01],['grain','Grain',0,1,.01],['motion','Motion',0,2,.01]].map(([k,l,mi,ma,st])=>`<div class="bgRow bgSlider"><label for="bg_${k}">${l}</label><input type="range" id="bg_${k}" data-param="${k}" min="${mi}" max="${ma}" step="${st}"><output for="bg_${k}" id="bgo_${k}"></output></div>`).join('')}
    <div class="bgRow bgSeed"><label for="bg_seed">Seed</label><input type="number" id="bg_seed" min="0" max="999" step="1"><button type="button" id="bgDice" class="secondary">Randomise</button></div>
    <div class="bgExport"><p class="cardcode">Download</p><button type="button" class="primary" data-png="3840">PNG · 4K</button><button type="button" class="secondary" data-png="1920">PNG · HD</button><button type="button" class="secondary" id="bgVideo">Loop video · 6 s</button><button type="button" class="secondary" id="bgCSS">Copy CSS</button><button type="button" class="secondary" id="bgEmbed">Copy live code</button><button type="button" class="secondary" id="bgLink">Copy link</button><p class="bgStatus" id="bgStatus" role="status"></p></div>
   </aside></div>
  <section class="bgLibrary" aria-labelledby="bgLibTitle"><div class="bgLibHead"><h2 id="bgLibTitle">Presets</h2><p id="bgLibCount"></p></div><div class="bgGrid" id="bgGrid"></div></section>
  <p class="bgNote">Licence: backgrounds made here are free for personal and commercial use, with no attribution required. The CSS option is an approximation built from your palette; the live code reproduces the exact image.</p>`;
  const tabs=sec.querySelector('.bgCollections');tabs.innerHTML=[['all','All',ALL.length],...COLLECTIONS.map(c=>[c.id,c.name,c.presets.length])].map(([id,n,k])=>`<button type="button" data-coll="${id}" aria-pressed="false">${esc(n)} <small>${k}</small></button>`).join('');
  tabs.onclick=e=>{const b=e.target.closest('[data-coll]');if(b){state.collection=b.dataset.coll;library();}};
  sec.querySelector('.bgRatios').onclick=e=>{const b=e.target.closest('[data-ratio]');if(b){state.ratio=b.dataset.ratio;layout();}};
  sec.querySelector('#bgGrid').onclick=e=>{const b=e.target.closest('[data-preset]');if(b){apply(ALL.find(p=>p.key===b.dataset.preset));document.getElementById('bgCanvas').scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'center'});}};
  sec.querySelector('#bgFamily').onchange=e=>{state.s.mode=+e.target.value;changed();};
  sec.querySelectorAll('[data-col]').forEach(inp=>inp.oninput=()=>{state.s.colors[+inp.dataset.col]=inp.value;changed();});
  sec.querySelectorAll('[data-param]').forEach(inp=>inp.oninput=()=>{state.s[inp.dataset.param]=+inp.value;changed();});
  sec.querySelector('#bg_seed').oninput=e=>{state.s.seed=Math.max(0,Math.min(999,+e.target.value||0));changed();};
  sec.querySelector('#bgDice').onclick=()=>{state.s.seed=Math.floor(Math.random()*1000);changed();};
  sec.querySelector('#bgShuffle').onclick=()=>{state.s.colors=randomPalette(Math.floor(Math.random()*1e6));changed();};
  sec.querySelector('#bgPlay').onclick=()=>{state.playing=!state.playing;syncPlay();};
  sec.querySelectorAll('[data-png]').forEach(b=>b.onclick=()=>png(+b.dataset.png));
  sec.querySelector('#bgVideo').onclick=video;sec.querySelector('#bgCSS').onclick=()=>copy(css(),'CSS copied.');sec.querySelector('#bgEmbed').onclick=()=>copy(embed(),'Live code copied. Paste it into any HTML page.');
  sec.querySelector('#bgLink').onclick=()=>copy(location.origin+location.pathname+'#backgrounds?bg='+encode(state.s),'Link copied.');
  const cv=document.getElementById('bgCanvas');try{main=Renderer(cv);}catch(err){console.error(err);}
  if(!main)sec.querySelector('.bgStage').insertAdjacentHTML('beforeend','<p class="bgFallback">This browser cannot run WebGL, so previews are unavailable.</p>');
  new ResizeObserver(()=>layout()).observe(sec.querySelector('.bgStageWrap'));
  reduce.addEventListener?.('change',()=>{if(reduce.matches){state.playing=false;syncPlay();}});
 }
 function status(t){const el=document.getElementById('bgStatus');if(el)el.textContent=t;}
 async function copy(text,msg){try{await navigator.clipboard.writeText(text);status(msg);}catch{const ta=document.createElement('textarea');ta.value=text;document.body.append(ta);ta.select();try{document.execCommand('copy');status(msg);}catch{status('Copy failed. Select the text manually.');}ta.remove();}}
 function apply(p){state.preset=p.key||null;state.s={name:p.name,mode:p.mode,colors:[...p.colors],seed:p.seed,scale:p.scale,warp:p.warp,soft:p.soft,grain:p.grain,motion:p.motion};controls();draw();markActive();}
 function changed(){state.preset=null;state.s.name='Custom';controls();if(!state.playing)draw();markActive();}
 function controls(){const s=state.s,sec=document.getElementById('backgrounds');if(!sec||!s)return;sec.querySelector('#bgFamily').value=s.mode;sec.querySelectorAll('[data-col]').forEach(i=>i.value=s.colors[+i.dataset.col]);
  sec.querySelectorAll('[data-param]').forEach(i=>{i.value=s[i.dataset.param];sec.querySelector('#bgo_'+i.dataset.param).textContent=(+s[i.dataset.param]).toFixed(2);});sec.querySelector('#bg_seed').value=s.seed;
  sec.querySelector('#bgName').textContent=`${s.name} · ${FAMILIES[s.mode]}`;sec.querySelectorAll('[data-ratio]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ratio===state.ratio)));}
 function markActive(){document.querySelectorAll('#bgGrid [data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===state.preset)));}
 function layout(){const wrap=document.querySelector('#backgrounds .bgStageWrap'),cv=document.getElementById('bgCanvas');if(!wrap||!cv)return;const w=wrap.clientWidth,r=ratioVal();let cw=w,ch=w/r;const maxH=Math.min(innerHeight*.72,760);if(ch>maxH){ch=maxH;cw=ch*r;}
  cv.style.width=cw+'px';cv.style.height=ch+'px';const dpr=Math.min(devicePixelRatio||1,2);cv.width=Math.round(cw*dpr);cv.height=Math.round(ch*dpr);controls();draw();}
 function angle(){return ((performance.now()-t0)/1000)*(Math.PI*2/12);} /* one loop every 12 s on screen */
 function draw(){if(main&&state.s)main.draw(state.s,state.playing?angle():0);}
 function loop(){draw();raf=state.playing&&visible()?requestAnimationFrame(loop):0;}
 function visible(){return location.hash.split('?')[0]==='#backgrounds'&&!document.hidden;}
 function syncPlay(){const b=document.getElementById('bgPlay');if(b){b.textContent=state.playing?'Pause':'Play';b.setAttribute('aria-pressed',String(!state.playing));}cancelAnimationFrame(raf);raf=0;if(state.playing&&visible())loop();else draw();}

 /* Thumbnails come from one shared offscreen renderer, then live as JPEG images. */
 const thumbCache=new Map();
 function thumb(p){if(thumbCache.has(p.key))return thumbCache.get(p.key);if(!thumbR){thumbCanvas=document.createElement('canvas');thumbCanvas.width=480;thumbCanvas.height=300;try{thumbR=Renderer(thumbCanvas,{keep:true});}catch{thumbR=null;}}
  if(!thumbR)return '';thumbR.draw(p,0);const url=thumbCanvas.toDataURL('image/jpeg',.82);thumbCache.set(p.key,url);return url;}
 function library(){const grid=document.getElementById('bgGrid');if(!grid)return;const list=state.collection==='all'?ALL:ALL.filter(p=>p.collection===state.collection);
  document.querySelectorAll('[data-coll]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.coll===state.collection)));
  const coll=COLLECTIONS.find(c=>c.id===state.collection);document.getElementById('bgLibCount').textContent=coll?coll.note:`${COLLECTIONS.length} collections. Pick one to start, then make it yours.`;
  grid.innerHTML=list.map(p=>`<button type="button" class="bgCard" data-preset="${p.key}" aria-pressed="false"><span class="bgThumb"><img alt="" width="480" height="300" data-thumb="${p.key}"></span><b>${esc(p.name)}</b><small>${esc(COLLECTIONS.find(c=>c.id===p.collection).name)} · ${FAMILIES[p.mode]}</small></button>`).join('');
  markActive();const imgs=[...grid.querySelectorAll('img[data-thumb]')];let i=0;const step=()=>{const end=performance.now()+12;while(i<imgs.length&&performance.now()<end){const im=imgs[i++];im.src=thumb(ALL.find(p=>p.key===im.dataset.thumb));}if(i<imgs.length)(window.requestIdleCallback||setTimeout)(step);};step();}

 function sized(long){const r=ratioVal();return r>=1?[long,Math.round(long/r)]:[Math.round(long*r),long];}
 function png(long){if(!state.s)return;const [w,h]=sized(long);const c=document.createElement('canvas');c.width=w;c.height=h;let r;try{r=Renderer(c,{keep:true});}catch{}if(!r){status('PNG export needs WebGL.');return;}
  r.draw(state.s,state.playing?angle():0);status(`Rendering ${w} × ${h}…`);c.toBlob(b=>{if(!b){status('Export failed. Try the HD size.');return;}save(b,`${slug()}-${w}x${h}.png`);status(`Saved ${w} × ${h} PNG.`);r.gl.getExtension('WEBGL_lose_context')?.loseContext();},'image/png');}
 function slug(){return (state.s.name||'background').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+state.s.seed;}
 function save(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);}
 function video(){if(!state.s)return;if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream){status('This browser cannot record video. Try Chrome, Edge or Firefox.');return;}
  const types=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'];const type=types.find(t=>MediaRecorder.isTypeSupported(t));if(!type){status('No supported video format in this browser.');return;}
  const [w,h]=sized(1920);const c=document.createElement('canvas');c.width=w;c.height=h;c.setAttribute('aria-hidden','true');c.style.cssText='position:fixed;left:-99999px;top:0;width:'+w/4+'px;height:'+h/4+'px;pointer-events:none';document.body.append(c);let r;try{r=Renderer(c,{keep:true});}catch{}if(!r){c.remove();status('Video export needs WebGL.');return;}
  const btn=document.getElementById('bgVideo');btn.disabled=true;const stream=c.captureStream(30);const rec=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:12e6});const chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
  rec.onstop=()=>{const blob=new Blob(chunks,{type});btn.disabled=false;r.gl.getExtension('WEBGL_lose_context')?.loseContext();c.remove();if(blob.size<2000){status('The browser did not record any frames. Try Chrome or Edge.');return;}save(blob,`${slug()}-loop.${type.includes('mp4')?'mp4':'webm'}`);status('Saved a 6-second seamless loop.');};
  const dur=6000;r.draw(state.s,0);rec.start(250);const start=performance.now();status('Recording a 6-second loop…');const tick=()=>{const k=(performance.now()-start)/dur;r.draw(state.s,Math.min(k,1)*Math.PI*2);if(k<1)requestAnimationFrame(tick);else rec.stop();};tick();}
 function css(){const s=state.s,[c0,c1,c2,c3,c4]=s.colors;const pts=[[18,22],[82,18],[70,82],[24,78]];
  return `/* ${s.name} · ${FAMILIES[s.mode]} · CSS approximation from the Visual & Motion Atlas */\nbackground-color: ${c0};\nbackground-image:\n${[c1,c2,c3,c4].map((c,i)=>`  radial-gradient(at ${pts[i][0]}% ${pts[i][1]}%, ${c} 0, transparent ${Math.round(45+s.soft*25)}%)`).join(',\n')};`;}
 function embed(){const s=state.s;return `<!-- ${s.name} · live background from the Visual & Motion Atlas. Free to use. -->
<canvas class="atlas-bg" style="position:fixed;inset:0;width:100%;height:100%;z-index:-1"></canvas>
<script>(()=>{const S=${JSON.stringify({mode:s.mode,colors:s.colors,seed:s.seed,scale:s.scale,warp:s.warp,soft:s.soft,grain:s.grain,motion:s.motion})};
const F=${JSON.stringify(FRAG)};const V=${JSON.stringify(VERT)};
const c=document.querySelector('canvas.atlas-bg'),g=c.getContext('webgl');if(!g)return;const sh=(t,s)=>{const o=g.createShader(t);g.shaderSource(o,s);g.compileShader(o);return o;};
const p=g.createProgram();g.attachShader(p,sh(g.VERTEX_SHADER,V));g.attachShader(p,sh(g.FRAGMENT_SHADER,F));g.linkProgram(p);g.useProgram(p);
g.bindBuffer(g.ARRAY_BUFFER,g.createBuffer());g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW);g.enableVertexAttribArray(0);g.vertexAttribPointer(0,2,g.FLOAT,false,0,0);
const u=n=>g.getUniformLocation(p,n),rgb=h=>{const n=parseInt(h.slice(1),16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];};
const still=matchMedia('(prefers-reduced-motion: reduce)').matches,t0=performance.now();
function f(){const d=Math.min(devicePixelRatio||1,2),w=c.clientWidth*d|0,h=c.clientHeight*d|0;if(c.width!==w||c.height!==h){c.width=w;c.height=h;}
g.viewport(0,0,w,h);g.uniform2f(u('R'),w,h);g.uniform1f(u('A'),still?0:(performance.now()-t0)/1000*Math.PI/6);g.uniform1f(u('S'),S.seed);g.uniform1f(u('SC'),S.scale);g.uniform1f(u('WP'),S.warp);g.uniform1f(u('SF'),S.soft);g.uniform1f(u('GR'),S.grain);g.uniform1f(u('MO'),S.motion);g.uniform1f(u('GS'),Math.max(1,Math.min(w,h)/1080));g.uniform1i(u('M'),S.mode);
S.colors.forEach((x,i)=>g.uniform3fv(u('C'+i),rgb(x)));g.drawArrays(g.TRIANGLES,0,3);if(!still)requestAnimationFrame(f);}f();if(still)addEventListener('resize',f);})();<\/script>`;}

 function onRoute(){const [h,q]=location.hash.split('?');if(h!=='#backgrounds'){cancelAnimationFrame(raf);raf=0;return;}shell();
  const shared=new URLSearchParams(q||'').get('bg');const d=shared&&decode(shared);if(d){state.s=d;state.preset=null;controls();}else if(!state.s)apply(ALL[0]);
  library();layout();syncPlay();}
 addEventListener('hashchange',onRoute);document.addEventListener('visibilitychange',()=>syncPlay());
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',onRoute);else onRoute();
 /* Render any preset (or settings object) to a still canvas, for other tools such as Showcase reels. */
 function still(p,w,h){const c=document.createElement('canvas');c.width=w;c.height=h;let r=null;try{r=Renderer(c,{keep:true});}catch{}if(!r)return null;r.draw(typeof p==='string'?ALL.find(x=>x.key===p):p,0);return c;}
 window.BackgroundAtlas={COLLECTIONS,ALL,FAMILIES,still};
})();
