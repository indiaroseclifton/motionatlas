#!/usr/bin/env python3
"""Build the page-section library.

Reads the eight section definitions in sections_src.py, adds the page-builder-only blocks
(nav, film hero, split hero, statement), scopes every block's CSS under .b-<id> so blocks can
share one page, and writes:
  site/interactions/demos/sec-*.html   standalone demos with the four-style switcher
  site/builder/blocks.js               the library the page builder composes pages from
Text the builder can edit is marked {{key}}; {{A}} is the asset base and {{brand}} the brand name.
Run: python3 tools/blocks.py
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'site')
ns = {}
exec(open(os.path.join(ROOT, 'tools', 'sections_src.py')).read(), ns)
HEAD, S, MORE = ns['HEAD'], ns['S'], ns.get('MORE', [])

# ---- styles and shared base, lifted from the demo head ----
head_css = HEAD.split('<style>')[1].split('{css}')[0].replace('{{', '{').replace('}}', '}')
# the looks the site builder offers, light ones first; ids are kept so saved sites keep their look
STYLE_NAMES = {'studio': 'Studio', 'clean': 'Clean', 'paper': 'Paper', 'editorial': 'Editorial', 'soft': 'Soft', 'garden': 'Garden', 'bold': 'Bold', 'noir': 'Evening', 'signal': 'Midnight'}
STYLES = {}
for sid in STYLE_NAMES:
    m = re.search(r'(?:^|\n)[^\n]*\[data-style=' + sid + r'\]\{([^}]*)\}', head_css)
    STYLES[sid] = m.group(1)
FONTS = {
    'noir': 'family=Fraunces:opsz,wght@9..144,400;9..144,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600',
    'paper': 'family=Fraunces:opsz,wght@9..144,400;9..144,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600',
    'studio': 'family=Cormorant+Garamond:ital,wght@1,500&family=Inter:wght@400;500;600',
    'signal': 'family=Space+Grotesk:wght@400;500;600&family=Inter:wght@400;500;600',
    'clean': 'family=Inter:wght@400;500;600',
    'editorial': 'family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Inter:wght@400;500;600',
    'soft': 'family=Outfit:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600',
    'garden': 'family=Lora:wght@400;500;600&family=Inter:wght@400;500;600',
    'bold': 'family=Archivo:wght@600;800&family=Inter:wght@400;500;600',
}
base_start = head_css.index('*{box-sizing')
BASE = head_css[base_start:head_css.index('.styles{')]
BASE += '@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}}\n'


def scope(css, cls):
    """Prefix every selector with .cls; rename keyframes so blocks never collide."""
    for name in re.findall(r'@keyframes\s+([\w-]+)', css):
        css = re.sub(r'@keyframes\s+' + name + r'\b', '@keyframes ' + name + '-' + cls, css)
        css = re.sub(r'(animation:[^;}]*?)\b' + name + r'\b', r'\1' + name + '-' + cls, css)
    out, i = [], 0
    while True:
        j = css.find('{', i)
        if j < 0:
            break
        prelude = css[i:j].strip()
        if prelude.startswith('@media') or prelude.startswith('@supports'):
            depth, k = 1, j + 1
            while depth:
                depth += {'{': 1, '}': -1}.get(css[k], 0)
                k += 1
            out.append(prelude + '{' + scope(css[j + 1:k - 1], cls) + '}')
            i = k
            continue
        if prelude.startswith('@keyframes'):
            depth, k = 1, j + 1
            while depth:
                depth += {'{': 1, '}': -1}.get(css[k], 0)
                k += 1
            out.append(css[i:k].strip())
            i = k
            continue
        k = css.index('}', j)
        sels = []
        for sel in prelude.split(','):
            sel = sel.strip()
            if sel.startswith('body'):
                sels.append('.' + cls + sel[4:])
            elif sel.startswith('[data-style'):
                m = re.match(r'(\[data-style=[^\]]+\])\s*(.*)', sel)
                sels.append(m.group(1) + ' .' + cls + (' ' + m.group(2) if m.group(2) else ''))
            else:
                sels.append('.' + cls + ' ' + sel)
        out.append(','.join(sels) + css[j:k + 1])
        i = k + 1
    return '\n'.join(out)


# Background motion is drawn live in code (WebGL), so it is sharp at any size and takes the page's own colours.
# These four presets replace the old 720p film clips; a saved site that still names a film gets the nearest preset.
FILMS = ['ink', 'silk', 'mesh', 'aurora']
FILM_NEW = {'suminagashi': 'ink', 'smoke-plume': 'ink', 'pigment-bloom': 'ink', 'ferrofluid': 'ink', 'paper-bird': 'silk',
            'light-threads': 'silk', 'light-mesh': 'mesh', 'jellyfish': 'aurora'}
FLOW_GLSL = (
 'precision highp float;uniform vec2 r;uniform float t;uniform int m;uniform vec3 a,b,c;'
 'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'
 'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}'
 'float f(vec2 p){float v=0.,k=.5;for(int i=0;i<5;i++){v+=k*n(p);p=p*2.02+vec2(13.1,7.7);k*=.5;}return v;}'
 'void main(){vec2 g=gl_FragCoord.xy/r;vec2 u=vec2(g.x*r.x/r.y,g.y);vec3 col;'
 # ink: marbled paper, folded noise with fine rings
 'if(m==0){vec2 p=u*1.5;vec2 q=vec2(f(p+vec2(0.,t*.03)),f(p+vec2(5.2,1.3)-t*.025));'
 'vec2 s=vec2(f(p+3.2*q+vec2(1.7,9.2)+t*.02),f(p+3.2*q+vec2(8.3,2.8)-t*.018));float v=f(p+3.2*s);'
 'float ring=abs(fract(v*15.+length(q)*3.)-.5)*2.;float line=1.-smoothstep(0.,.11,ring);'
 'col=mix(a,b,smoothstep(.15,.85,v));col=mix(col,c,smoothstep(.5,.95,length(s))*.6);col=mix(col,mix(c,a,.1),line*.62*smoothstep(.2,.65,v));}'
 # silk: slow folds of cloth
 'else if(m==1){vec2 p=u*vec2(1.,1.8);float w=f(p*.55+vec2(t*.025,0.));float y=p.y*3.2+w*4.+sin(p.x*1.1+t*.1)*.6;float k=y*2.3+1.7+f(p*1.1-vec2(0.,t*.03))*3.;'
 'float v=.5+.25*sin(y)+.25*sin(k);float hl=pow(max(0.,cos(y-.9)),26.)+.6*pow(max(0.,cos(k-.9)),40.);'
 'col=mix(a,b,smoothstep(.1,.9,v));col=mix(col,c,smoothstep(.55,1.,v)*.55);col=mix(col,a*.55,pow(1.-v,4.)*.35);col+=(mix(vec3(1.),c,.35)-col)*hl*.4;}'
 # mesh: three soft lights drifting
 'else if(m==2){vec2 p1=vec2(.28+.18*sin(t*.11),.42+.2*cos(t*.13)),p2=vec2(.76+.14*cos(t*.09),.62+.22*sin(t*.07)),p3=vec2(.52+.28*sin(t*.05+2.),.16+.1*cos(t*.1));'
 'vec2 w=g+(vec2(f(u*1.2+t*.02),f(u*1.2+7.-t*.02))-.5)*.25;'
 'col=a;col=mix(col,b,smoothstep(.75,0.,distance(w,p1)));col=mix(col,c,smoothstep(.55,0.,distance(w,p2))*.7);col=mix(col,mix(b,c,.5),smoothstep(.5,0.,distance(w,p3))*.6);}'
 # aurora: curtains of light rising
 'else{float x=u.x*1.6+f(vec2(u.x*1.2,t*.04))*1.4;float band=f(vec2(x*1.5,g.y*.5-t*.035));'
 'float cur=smoothstep(.36,.78,band)*smoothstep(-.1,.7,g.y)*(.55+.45*n(vec2(x*26.,t*.15)));col=mix(a,b,cur);col=mix(col,c,pow(cur,2.2)*.75);col+=(mix(vec3(1.),c,.5)-col)*pow(cur,6.)*.25;}'
 'col+=(h(gl_FragCoord.xy+fract(t))-.5)*.018;gl_FragColor=vec4(col,1.);}'
)
FLOW_JS = (
 "window.__pbFlow=window.__pbFlow||function(cv){if(!cv)return null;if(cv.__flow)return cv.__flow;"
 "var KIND={ink:0,silk:1,mesh:2,aurora:3},OLD={'light-mesh':2,'soap-film':2,'golden-figure':2,'game-of-life':2,'hydraulic-erosion':2,'light-threads':1,embroidery:1,'petal-swirl':1,'golden-dove':1,'paper-bird':1,'swan-construction':1,'sketchbook-horse':1,'sand-drawing':1,jellyfish:3,'bioluminescent-trails':3,'particle-tree':3,'pixel-sorting':3,'lion-phoenix':3};"
 "var name=cv.getAttribute('data-flow')||'ink',mode=KIND.hasOwnProperty(name)?KIND[name]:OLD.hasOwnProperty(name)?OLD[name]:0;"
 "var ctl={paused:true,play:function(){start();return Promise.resolve()},pause:function(){stop()},removeAttribute:function(){}};cv.__flow=ctl;"
 "var gl=null;try{gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'})}catch(e){}"
 "function start(){}function stop(){}if(!gl)return ctl;"
 "function sh(k,src){var o=gl.createShader(k);gl.shaderSource(o,src);gl.compileShader(o);return o}"
 "var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER," + repr(FLOW_GLSL) + "));gl.linkProgram(pr);"
 "if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return ctl;gl.useProgram(pr);"
 "gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);"
 "var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);"
 "var U={};['r','t','m','a','b','c'].forEach(function(k){U[k]=gl.getUniformLocation(pr,k)});"
 # the page's own colours: background, accent, and a blend of the two
 "function col(v){var e=document.createElement('i');e.style.cssText='display:none;color:'+v;cv.parentNode.appendChild(e);var str=getComputedStyle(e).color,m=str.match(/[\\d.]+/g)||[0,0,0];cv.parentNode.removeChild(e);var k=/^color\\(/.test(str)?1:255;return [m[0]/k,m[1]/k,m[2]/k]}"
 "var A=col('var(--bg,#111)'),C=col('var(--accent,#888)'),B=[0,1,2].map(function(i){return A[i]+(C[i]-A[i])*.45});"
 "var raf=0,t0=performance.now(),off=0,seen=true;"
 "function size(){var d=Math.min(window.devicePixelRatio||1,2),w=cv.clientWidth,hh=cv.clientHeight;if(!w||!hh)return false;var k=Math.min(1,Math.sqrt(2600000/(w*hh*d*d))),W=Math.round(w*d*k),H=Math.round(hh*d*k);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}gl.viewport(0,0,W,H);return true}"
 "function draw(){var t=(off+(ctl.paused?0:performance.now()-t0))/1000;if(!size())return;gl.uniform2f(U.r,cv.width,cv.height);gl.uniform1f(U.t,t+40);gl.uniform1i(U.m,mode);gl.uniform3fv(U.a,A);gl.uniform3fv(U.b,B);gl.uniform3fv(U.c,C);gl.drawArrays(gl.TRIANGLES,0,3)}"
 "function loop(){draw();raf=seen&&!ctl.paused?requestAnimationFrame(loop):0}"
 "start=function(){if(!ctl.paused)return;ctl.paused=false;t0=performance.now();if(!raf)raf=requestAnimationFrame(loop)};"
 "stop=function(){if(ctl.paused)return;off+=performance.now()-t0;ctl.paused=true;cancelAnimationFrame(raf);raf=0;draw()};"
 "draw();"
 "if('IntersectionObserver' in window)new IntersectionObserver(function(es){seen=es[0].isIntersecting;if(seen&&!ctl.paused&&!raf)raf=requestAnimationFrame(loop)}).observe(cv);"
 "if('ResizeObserver' in window)new ResizeObserver(function(){if(ctl.paused||!raf)draw()}).observe(cv);"
 "if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!cv.hasAttribute('data-still'))start();"
 "return ctl};"
)

PAUSE_JS = '''const v=root.querySelector('video'),pv=root.querySelector('.ctrl');const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const play='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>',pause=pv.innerHTML;
function st(p){if(p){v.play().catch(()=>{});pv.innerHTML=pause;pv.setAttribute('aria-label','Pause background film')}else{v.pause();pv.innerHTML=play;pv.setAttribute('aria-label','Play background film')}}
if(reduce){v.removeAttribute('autoplay');st(false)}pv.onclick=()=>st(v.paused);'''
CTRL_CSS = '.ctrl{position:absolute;right:16px;top:16px;width:44px;height:44px;border-radius:50%;border:0;background:color-mix(in srgb,var(--surface) 80%,transparent);color:var(--ink);cursor:pointer;display:grid;place-items:center;z-index:2}.ctrl svg{width:16px;height:16px}'
CTRL_HTML = '<button class="ctrl" aria-label="Pause background film"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg></button>'
VIDEO = '<video autoplay muted loop playsinline poster="{{A}}films/{{film}}.jpg"><source src="{{A}}films/{{film}}-720.mp4" type="video/mp4"><source src="{{A}}films/{{film}}-720.webm" type="video/webm"></video>'
NOHASH = "root.querySelectorAll('a[href=\"#\"]').forEach(a=>a.onclick=e=>e.preventDefault());"

# id, name, group, description, css, html, js, fields [(key,label,type,default)], prompt
NEW = [
 ('nav', 'Navigation bar', 'Top', 'A sticky bar with the brand, your site menu and a call to action; a menu button opens it on phones.', '''
.bar{background:color-mix(in srgb,var(--bg) 84%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.in{max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:24px;padding:10px max(16px,4vw)}
.logo{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:26px;letter-spacing:var(--track);text-decoration:none}
.links{display:flex;gap:22px;margin-left:auto;font-size:15px;flex-wrap:wrap}.links a{text-decoration:none;color:var(--mute)}.links a:hover,.links a[aria-current=page]{color:var(--ink)}
.btn{min-height:42px}
.menu{display:none;width:44px;height:44px;border-radius:12px;border:1px solid var(--line);background:var(--surface);cursor:pointer;place-items:center;margin-left:auto}.menu svg{width:20px;height:20px}
.panel{display:none;padding:8px max(16px,4vw) 18px;border-top:1px solid var(--line)}.panel a{display:block;padding:12px 0;text-decoration:none;border-bottom:1px solid var(--line)}.panel.open{display:block}
@media (max-width:720px){.links,.cta{display:none}.menu{display:grid}}''',
  '<header class="bar"><div class="in"><a class="logo" href="{{home}}">{{brand}}</a><nav class="links" aria-label="Main">{{menu}}</nav><a class="btn p cta" href="{{ctaHref}}">{{cta}}</a><button class="menu" type="button" aria-expanded="false" aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div><nav class="panel" aria-label="Menu">{{menu}}<a href="{{ctaHref}}">{{cta}}</a></nav></header>',
  NOHASH + "const m=root.querySelector('.menu'),p=root.querySelector('.panel');m.onclick=()=>{const o=m.getAttribute('aria-expanded')!=='true';m.setAttribute('aria-expanded',o);m.setAttribute('aria-label',o?'Close menu':'Open menu');p.classList.toggle('open',o)};", [('cta', 'Button', 'text', 'Start free'), ('ctaHref', 'Button links to', 'link', '')],
  'A sticky top bar with a translucent blurred background: the brand name in the heading font, the site menu as quiet links on the right and a solid accent button. On phones a menu button opens a stacked panel.'),
 ('hero-film', 'Film hero', 'Top', 'A full-bleed looping film that fades into the page, with a big headline and two buttons.', '''
.hero{position:relative;min-height:min(92vh,880px);display:grid;align-items:end;overflow:hidden;isolation:isolate}
.hero video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.hero::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,var(--bg) 6%,color-mix(in srgb,var(--bg) 62%,transparent) 48%,color-mix(in srgb,var(--bg) 18%,transparent))}
.c{max-width:1280px;width:100%;margin:0 auto;padding:0 max(16px,4vw) clamp(48px,10vh,110px);display:grid;gap:18px}
.c h1{font-size:clamp(46px,8vw,112px);margin:0;max-width:14ch}
.c p.l{margin:0;max-width:46ch;font-size:clamp(16px,1.6vw,19px)}
.row{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
''' + CTRL_CSS,
  '<section class="hero">' + VIDEO + CTRL_HTML + '<div class="c"><p class="k">{{kicker}}</p><h1 class="h">{{heading}}</h1><p class="l">{{intro}}</p><div class="row"><a class="btn p" href="#">{{b1}}</a><a class="btn" href="#">{{b2}}</a></div></div></section>',
  NOHASH + PAUSE_JS, [('film', 'Film', 'film', 'suminagashi'), ('kicker', 'Kicker', 'text', 'Marbled paper studio'), ('heading', 'Headline', 'text', 'Ink on water, printed once.'), ('intro', 'Intro', 'long', 'We float ink on still water and lift a single print from it. No two sheets are ever the same.'), ('b1', 'Main button', 'text', 'See the papers'), ('b2', 'Second button', 'text', 'Visit the studio')],
  'A full-height hero with a muted looping background video that fades into the page colour towards the bottom (a gradient built with color-mix from the background), a kicker, a very large headline, an intro line and two buttons, plus a pause/play button for the film.'),
 ('hero-split', 'Split hero', 'Top', 'Headline and buttons on the left, a framed portrait film on the right with a small caption chip.', '''
.split{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(28px,5vw,64px);align-items:center;max-width:1280px;margin:0 auto;padding:clamp(48px,10vh,110px) max(16px,4vw)}
.split h1{font-size:clamp(44px,6.4vw,92px);margin:10px 0 18px}
.split p.l{color:var(--mute);font-size:18px;max-width:42ch;margin:0 0 26px}
.row{display:flex;gap:10px;flex-wrap:wrap}
.frame{position:relative;aspect-ratio:4/5;border-radius:calc(var(--radius) * 1.6);overflow:hidden;background:var(--surface);box-shadow:0 40px 80px -40px rgba(0,0,0,.5)}
.frame video{width:100%;height:100%;object-fit:cover;display:block}
.note{position:absolute;left:16px;bottom:16px;right:16px;padding:12px 14px;border-radius:var(--radius);background:color-mix(in srgb,var(--surface) 90%,transparent);backdrop-filter:blur(8px);font-size:14px;display:flex;gap:10px;align-items:center}
.note i{flex:0 0 8px;height:8px;border-radius:50%;background:var(--accent)}
@media (max-width:820px){.split{grid-template-columns:1fr}.frame{aspect-ratio:1}}
''' + CTRL_CSS,
  '<section class="split"><div><p class="k">{{kicker}}</p><h1 class="h">{{heading}}</h1><p class="l">{{intro}}</p><div class="row"><a class="btn p" href="#">{{b1}}</a><a class="btn" href="#">{{b2}}</a></div></div><div class="frame">' + VIDEO + CTRL_HTML + '<p class="note"><i aria-hidden="true"></i>{{note}}</p></div></section>',
  NOHASH + PAUSE_JS, [('film', 'Film', 'film', 'paper-bird'), ('kicker', 'Kicker', 'text', 'Silk and linen, dyed by hand'), ('heading', 'Headline', 'text', 'Cloth with a little weather in it.'), ('intro', 'Intro', 'long', 'A small studio dyeing silk and linen for interiors, fashion houses and film.'), ('b1', 'Main button', 'text', 'See the cloth'), ('b2', 'Second button', 'text', 'Commission a length'), ('note', 'Caption chip', 'text', 'On the line today: indigo, twelve metres')],
  'A two-column hero: on the left a kicker, large headline, muted intro and two buttons; on the right a rounded 4:5 frame holding a looping film, with a pause button and a small translucent caption chip with an accent dot. Stacks on phones.'),
 ('statement', 'Statement', 'Story', 'A large paragraph whose words brighten as you read down the page.', '''
.st{max-width:1280px;margin:0 auto;padding:clamp(80px,16vh,180px) max(16px,4vw)}
.st p{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);letter-spacing:var(--track);font-size:clamp(28px,4.4vw,58px);line-height:1.15;margin:0;max-width:24ch;color:var(--mute)}
.st span{transition:color .35s}.st span.lit{color:var(--ink)}''',
  '<section class="st"><p class="k" style="margin-bottom:22px">{{kicker}}</p><p data-words>{{text}}</p></section>',
  '''const P=root.querySelector('[data-words]');P.innerHTML=P.textContent.trim().split(/\\s+/).map(w=>'<span>'+w.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</span>').join(' ');const W=[...P.children];
if(matchMedia('(prefers-reduced-motion: reduce)').matches){W.forEach(s=>s.classList.add('lit'));return}
function u(){const r=P.getBoundingClientRect(),h=innerHeight;const p=Math.min(1,Math.max(0,(h*.85-r.top)/(r.height+h*.35)));const n=Math.round(p*W.length);W.forEach((s,i)=>s.classList.toggle('lit',i<n))}
addEventListener('scroll',u,{passive:true});addEventListener('resize',u);u();''',
  [('kicker', 'Kicker', 'text', 'Why we do it'), ('text', 'Statement', 'long', 'Most cooking videos shout. Ours whisper. One chef, the same kitchen, the same light, and ninety seconds where nothing happens except a meal coming together.')],
  'A wide section with a small kicker and one large serif paragraph split into words; words start in the muted colour and switch to the ink colour in reading order as the paragraph scrolls through the viewport (all lit under reduced motion).'),
]

# Editable text in the existing sections: field key -> exact default text in the HTML
FIELDS = {
 'sec-pricing': [('kicker', 'Kicker', 'text', '<p class="k">Pricing</p>', '<p class="k">{{kicker}}</p>', 'Pricing'), ('heading', 'Headline', 'text', 'Pay for the kitchen you have.'), ('intro', 'Intro', 'long', 'Every plan includes recipe cards, shot lists and the colour grade. Change or cancel at any time.'), ('p1', 'Plan 1 name', 'text', 'Home cook'), ('p2', 'Plan 2 name', 'text', 'Head chef'), ('p3', 'Plan 3 name', 'text', 'Restaurant')],
 'sec-bento': [('kicker', 'Kicker', 'text', 'What you get'), ('heading', 'Headline', 'text', 'Everything a recipe channel needs.'), ('intro', 'Intro', 'long', 'One place for the chef, the dish, the shot list and the post. Each card is a feature; the large one is the one to lead with.'), ('lead', 'Lead feature', 'text', 'Every dish, filmed like a still life'), ('leadText', 'Lead feature text', 'long', 'Shot lists that frame hands, steam and the final plate the same way every time.')],
 'sec-testimonials': [('kicker', 'Kicker', 'text', 'Loved by cooks'), ('heading', 'Headline', 'long', 'Twelve thousand kitchens, one recurring complaint: they wish they’d started sooner.')],
 'sec-faq': [('qa', 'Questions (question | answer)', 'list', 'Do I need my own footage? | No. You can start from a recipe and a character bible; we generate the shots. If you have footage, upload it and we’ll match the grade.\nWho owns what I make? | You do. Episodes, thumbnails and recipe cards are yours to post anywhere, including after you cancel.\nHow do recipe credits work? | When a recipe comes from a known chef or book, we add an on-screen credit and a line in the description, and hold the post until someone approves it.\nCan my chef look the same every time? | Yes. A character bible fixes the face, hands, clothes and kitchen, and every shot is checked against it before it renders.\nWhat happens if I cancel? | Your library stays downloadable for 90 days. We’ll email you before anything is deleted.'), ('kicker', 'Kicker', 'text', 'Questions'), ('heading', 'Headline', 'text', 'Before you start cooking.'), ('intro', 'Intro', 'long', 'Can’t find what you need? A real person answers within a working day.'), ('button', 'Button', 'text', 'Ask us')],
 'sec-contact': [('kicker', 'Kicker', 'text', 'Contact'), ('heading', 'Headline', 'text', 'Tell us what you’re cooking.'), ('intro', 'Intro', 'long', 'A short note is plenty. We reply within a working day, usually with questions about the dish.'), ('email', 'Email address', 'text', 'hello@example.kitchen'), ('address', 'Address', 'text', '14 Market Row, London E8')],
 'sec-footer': [('news', 'Newsletter heading', 'text', 'One recipe, every Sunday.')],
 'sec-logos': [('kicker', 'Kicker', 'text', 'Trusted by'), ('heading', 'Headline', 'text', 'Cooks, chefs and food brands in 31 countries.')],
 'sec-cta': [('film', 'Film', 'film', 'pigment-bloom'), ('kicker', 'Kicker', 'text', 'Mixed to order'), ('heading', 'Headline', 'text', 'Your colour, mixed by hand this week.'), ('intro', 'Intro', 'long', 'Send a swatch, a photograph or a memory. We mix the pigment and post a tester within five days.'), ('b1', 'Main button', 'text', 'Order a tester'), ('b2', 'Second button', 'text', 'See the colour chart')],
}
GROUP = {'sec-pricing': 'Sell', 'sec-bento': 'Features', 'sec-testimonials': 'Proof', 'sec-faq': 'Content', 'sec-contact': 'Endings',
         'sec-footer': 'Endings', 'sec-logos': 'Proof', 'sec-cta': 'Endings'}
NEW_GROUP = {'nav': 'Navigation', 'hero-film': 'Heroes', 'hero-split': 'Heroes', 'statement': 'Story'}
NAMES = {'sec-pricing': 'Pricing', 'sec-bento': 'Bento features', 'sec-testimonials': 'Testimonial wall', 'sec-faq': 'FAQ',
         'sec-contact': 'Contact form', 'sec-footer': 'Wordmark footer', 'sec-logos': 'Logo marquee', 'sec-cta': 'Film call to action'}
PROMPTS = {
 'sec-pricing': 'A pricing section with a centred heading, a Monthly/Yearly pill toggle that swaps prices, and three plan cards with tick lists; the middle plan is lifted, outlined in the accent and tagged “Most chosen”.',
 'sec-bento': 'A six-column bento grid: one large image tile (4×2) fading into the surface colour, and five small tiles each led by a visual (a big statistic, tag chips, a bar chart, a numeral, a tick).',
 'sec-testimonials': 'A testimonial wall: three columns of quote cards scrolling vertically at different speeds in a seamless loop, edges faded with a mask, paused on hover and by a Pause button.',
 'sec-faq': 'A two-column FAQ: heading, line of reassurance and a button on the left; native details/summary questions on the right that slide open with a grid-template-rows transition and a plus icon that becomes a filled minus.',
 'sec-contact': 'A contact section: heading and two contact detail cards on the left; a form card on the right with name, email, topic chips (checkboxes styled with :has) and a message, validated inline with specific messages.',
 'sec-footer': 'A footer with a newsletter form and three link columns, then the brand name as a huge wordmark (with an accent full stop) that rises into place as it scrolls into view, and a legal row.',
 'sec-logos': 'A logo cloud: two rows of pill-shaped wordmark tiles sliding in opposite directions in seamless loops with faded edges and a Pause button.',
 'sec-cta': 'A rounded call-to-action banner over a looping film with a gradient for legibility, a large headline, a line of copy, two buttons and a pause button.',
}


def fix_assets(x):
    return x.replace('../../assets/', '{{A}}')


blocks = []
for bid, name, group, desc, css, html, js, fields, prompt in NEW + MORE:
    group = NEW_GROUP.get(bid, group)
    blocks.append({'id': bid, 'name': name, 'group': group, 'desc': desc, 'css': scope(css, 'b-' + bid), 'html': html,
                   'js': js, 'fields': [{'k': k, 'label': l, 'type': t, 'def': d} for k, l, t, d in fields], 'prompt': prompt})

for sid, (title, css, body, js) in S.items():
    bid = sid
    html, flds = fix_assets(body), []
    for f in FIELDS[sid]:
        if len(f) == 6:
            k, l, t, old, new, d = f
            html = html.replace(old, new)
        else:
            k, l, t, d = f
            html = html.replace(d, '{{' + k + '}}')
        flds.append({'k': k, 'label': l, 'type': t, 'def': d})
    if sid == 'sec-footer':
        css = css.replace('body{display:flex;flex-direction:column;min-height:100vh}\n', '')
        css = re.sub(r'\.spacer\{[^}]*\}\n', '', css)
        html = re.sub(r'<div class="spacer">.*?</div>\n', '', html)
        html = html.replace('Saffron<span>', '{{brand}}<span>').replace('© 2026 Saffron Kitchen Ltd', '© 2026 {{brand}}')
    jsx = fix_assets(js).replace("document.querySelectorAll('a[href=\"#\"]')", "root.querySelectorAll('a[href=\"#\"]')")
    blocks.append({'id': bid, 'name': NAMES[sid], 'group': GROUP[sid], 'desc': title, 'css': scope(css, 'b-' + bid), 'html': html,
                   'js': jsx, 'fields': flds, 'prompt': PROMPTS[sid]})

for b in blocks:
    if '<video' not in b['html']:
        continue
    def canvas(m):
        k = re.search(r'films/(\{\{\w+\}\}|[\w-]+)\.jpg', m.group(0))
        return '<canvas class="flow" data-flow="' + (k.group(1) if k else 'ink') + '" aria-hidden="true"></canvas>'
    b['html'] = re.sub(r'<video\b.*?</video>', canvas, b['html'], flags=re.S).replace('background film', 'background motion').replace('Pause film', 'Pause motion')
    b['css'] = re.sub(r'(?<=[\s,}])video\{', '.flow{', ' ' + b['css']).strip().replace('object-fit:cover;', '').replace('object-fit:cover', '')
    b['css'] += '\n.b-' + b['id'] + ' .flow{display:block;background:linear-gradient(135deg,var(--bg),color-mix(in srgb,var(--accent) 30%,var(--bg)))}'
    js = b['js']
    for q in ("root.querySelector('video')", "b.parentNode.querySelector('video')", "document.getElementById('v')", "root.querySelector('#v')"):
        js = js.replace(q, "window.__pbFlow(" + q.replace("'video'", "'canvas.flow'").replace("document.getElementById('v')", "root.querySelector('canvas.flow')").replace("'#v'", "'canvas.flow'") + ")")
    assert 'video' not in js and '__pbFlow' in js, (b['id'], js[:300])
    b['js'] = FLOW_JS + js.replace('background film', 'background motion').replace("'Pause film'", "'Pause motion'").replace("'Play film'", "'Play motion'")
    b['desc'] = b['desc'].replace('looping film', 'slow moving backdrop').replace('portrait film', 'panel of slow motion').replace('film frame', 'frame of slow motion').replace(' film ', ' motion ')
    for fld in b['fields']:
        if fld['type'] == 'film':
            fld['label'] = fld['label'].replace('Film on the screen', 'Motion on the screen').replace('Film', 'Motion')
            fld['def'] = FILM_NEW.get(fld['def'], 'ink')
    b['prompt'] = b.get('prompt', '').replace('muted looping background video', 'slow code-drawn background (a WebGL canvas in the page colours)').replace('for the film', 'for the motion')

for b in blocks:
    missing = [f['k'] for f in b['fields'] if '{{' + f['k'] + '}}' not in b['html'] and '{{each:' + f['k'] + '}}' not in b['html'] and '{{rich:' + f['k'] + '}}' not in b['html']]
    assert not missing, (b['id'], missing)

# Where a block belongs when added: navigation on top, heroes after it, footers last
PLACE = {'Navigation': 'top', 'Heroes': 'hero'}
for b in blocks:
    if b['group'] in PLACE:
        b['place'] = PLACE[b['group']]
    if b['id'] in ('sec-footer', 'footer-columns'):
        b['place'] = 'end'

# Small stroke glyphs for feature lists ({{g0}} in a list row)
GLYPHS = {
 'spark': 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6', 'clock': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
 'list': 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01', 'users': 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.8-3.5 3.3-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.8c1.8.7 3 2.4 3.5 5.2',
 'scale': 'M12 4v16M5 20h14M6 8h12M6 8l-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0z', 'leaf': 'M5 19c0-8 5-14 15-15-1 10-7 15-15 15zM5 19l8-8',
 'bell': 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0', 'mail': 'M3.5 6h17v12h-17zM3.5 6l8.5 7 8.5-7', 'phone': 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z',
 'pin': 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', 'star': 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z',
 'heart': 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z', 'shield': 'M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6zM9 12l2 2 4-4',
 'bolt': 'M13 2 4 14h7l-1 8 9-12h-7z', 'chart': 'M4 20V10M10 20V4M16 20v-7M22 20H2', 'globe': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.6 2.5 3.6 5.5 3.6 9s-1 6.5-3.6 9c-2.6-2.5-3.6-5.5-3.6-9s1-6.5 3.6-9z',
 'camera': 'M4 7h3l2-2.5h6L17 7h3v12H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'chat': 'M4 5h16v11H9l-5 4z', 'lock': 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
 'check': 'm5 12.5 4.5 4.5L19 7.5', 'gift': 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.2S10 7 12 7zM12 7c1.5-3 5-3.5 5-1.2S14 7 12 7z', 'cloud': 'M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5a4.3 4.3 0 0 1-.5 8.5z',
 'code': 'm8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16', 'search': 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM16 16l4.5 4.5', 'home': 'M4 11 12 4l8 7v9h-5v-6H9v6H4z',
 'calendar': 'M4 5.5h16v15H4zM4 10h16M8.5 3v4M15.5 3v4', 'film': 'M4 4h16v16H4zM8 4v16M16 4v16M4 8h4M4 12h4M4 16h4M16 8h4M16 12h4M16 16h4', 'music': 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
}
# suggestions for image fields: the photographs only (the old generated artwork is no longer offered)
IMAGES = ['photos/' + f for f in sorted(os.listdir(os.path.join(SITE, 'assets', 'photos'))) if f.endswith('.webp') and not f.endswith('-640.webp')]
ICON_FILES = {}
for fam in sorted(os.listdir(os.path.join(SITE, 'icons'))):
    d = os.path.join(SITE, 'icons', fam)
    if os.path.isdir(d):
        ICON_FILES[fam] = sorted(f for f in os.listdir(d) if f.endswith(('.svg', '.png')))
# Type pairings, from the Fonts & type page (InspirationAtlas.pairs in site/inspiration.js)
PAIRS = [['Editorial contrast', 'Playfair Display', 'Inter'], ['Quiet literary', 'Cormorant Garamond', 'DM Sans'], ['Reading first', 'Lora', 'Inter'],
         ['Geometric clarity', 'Outfit', 'DM Sans'], ['Technical warmth', 'Space Grotesk', 'Inter'], ['Data and narrative', 'Inter', 'IBM Plex Mono'],
         ['Modern product', 'Manrope', 'Inter'], ['Classic information', 'Libre Baskerville', 'DM Sans'], ['Single-family system', 'Inter', 'Inter'],
         ['Soft dimensional', 'Outfit', 'Manrope'], ['Expressive editorial', 'Playfair Display', 'Space Grotesk'], ['Swiss grotesk', 'Inter Tight', 'Hanken Grotesk'],
         ['Fraunces and DM Sans', 'Fraunces', 'DM Sans'], ['Bold display', 'Archivo Black', 'Archivo'], ['Mono terminal', 'JetBrains Mono', 'IBM Plex Sans']]

lib = {'styles': {k: {'name': STYLE_NAMES[k], 'vars': STYLES[k], 'fonts': FONTS[k]} for k in STYLE_NAMES},
       'base': BASE, 'films': FILMS, 'flow': FLOW_JS, 'blocks': blocks, 'glyphs': GLYPHS, 'images': IMAGES, 'iconFiles': ICON_FILES, 'pairs': PAIRS}
os.makedirs(os.path.join(SITE, 'builder'), exist_ok=True)
with open(os.path.join(SITE, 'builder', 'blocks.js'), 'w') as fh:
    fh.write('/* Generated by tools/blocks.py from tools/sections_src.py. Edit those, then run: python3 tools/blocks.py */\n')
    fh.write('window.PB_LIB=' + json.dumps(lib, ensure_ascii=False, separators=(',', ':')) + ';\n')


def fill(s, b, extra=None):
    vals = {f['k']: f['def'] for f in b['fields']}

    def each(m):
        rows = [[c.strip() for c in r.split('|')] for r in vals[m.group(1)].split('\n') if r.strip()]
        return ''.join(re.sub(r'\{\{(\d+)\}\}', lambda mm: rows[i][int(mm.group(1))] if int(mm.group(1)) < len(rows[i]) else '', m.group(2)) for i in range(len(rows)))
    s = re.sub(r'\{\{each:(\w+)\}\}(.*?)\{\{/each\}\}', each, s, flags=re.S)
    vals.update({'A': '../../assets/', 'brand': 'Saffron', 'formAction': '#'})
    vals.update(extra or {})
    return re.sub(r'\{\{(\w+)\}\}', lambda m: vals[m.group(1)], s)


# Standalone demos keep their original look, now built from the scoped blocks
for sid in S:
    b = next(x for x in blocks if x['id'] == sid)
    css, body = b['css'], fill(b['html'], b)
    if sid == 'sec-footer':
        css = 'body{display:flex;flex-direction:column;min-height:100vh}\n.spacer{flex:1;display:grid;place-items:center;color:var(--mute);padding:40px 16px;text-align:center}\n' + css
        body = '<div class="spacer"><p>Scroll down to the footer. The wordmark rises as it comes into view.</p></div>\n' + body
    body = '<div class="b-' + b['id'] + '">' + body + '</div>'
    js = '(()=>{const root=document.querySelector(".b-' + b['id'] + '");' + fill(b['js'], b) + '})();'
    with open(os.path.join(SITE, 'interactions', 'demos', sid + '.html'), 'w') as fh:
        fh.write(HEAD.format(title=S[sid][0], css=css, body=body, js=js))
print('blocks', len(blocks), 'bytes', os.path.getsize(os.path.join(SITE, 'builder', 'blocks.js')))
