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
HEAD, S = ns['HEAD'], ns['S']

# ---- styles and shared base, lifted from the demo head ----
head_css = HEAD.split('<style>')[1].split('{css}')[0].replace('{{', '{').replace('}}', '}')
STYLE_NAMES = {'noir': 'Kitchen noir', 'paper': 'Kitchen paper', 'studio': 'Studio', 'signal': 'Signal'}
STYLES = {}
for sid in STYLE_NAMES:
    m = re.search(r'(?:^|\n)[^\n]*\[data-style=' + sid + r'\]\{([^}]*)\}', head_css)
    STYLES[sid] = m.group(1)
FONTS = {
    'noir': 'family=Fraunces:opsz,wght@9..144,400;9..144,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600',
    'paper': 'family=Fraunces:opsz,wght@9..144,400;9..144,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600',
    'studio': 'family=Cormorant+Garamond:ital,wght@1,500&family=Inter:wght@400;500;600',
    'signal': 'family=Space+Grotesk:wght@400;500;600&family=Inter:wght@400;500;600',
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


FILMS = ['bioluminescent-trails', 'jellyfish', 'golden-dove', 'golden-figure', 'lion-phoenix', 'light-threads',
         'particle-tree', 'pigment-bloom', 'smoke-plume', 'suminagashi', 'soap-film', 'ferrofluid', 'sand-drawing',
         'embroidery', 'hydraulic-erosion', 'swan-construction', 'sketchbook-horse', 'paper-bird', 'light-mesh',
         'petal-swirl', 'pixel-sorting', 'game-of-life']

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
 ('nav', 'Navigation bar', 'Top', 'A sticky bar with the brand, three links and a call to action.', '''
.bar{position:sticky;top:0;z-index:40;background:color-mix(in srgb,var(--bg) 84%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.in{max-width:1180px;margin:0 auto;display:flex;align-items:center;gap:24px;padding:10px max(16px,4vw)}
.logo{font-family:var(--head);font-weight:var(--hw);font-style:var(--hs);font-size:26px;letter-spacing:var(--track);text-decoration:none}
.links{display:flex;gap:22px;margin-left:auto;font-size:15px}.links a{text-decoration:none;color:var(--mute)}.links a:hover{color:var(--ink)}
.btn{min-height:42px}
@media (max-width:680px){.links{display:none}.in .btn{margin-left:auto}}''',
  '<header class="bar"><div class="in"><a class="logo" href="#">{{brand}}</a><nav class="links" aria-label="Main"><a href="#">{{l1}}</a><a href="#">{{l2}}</a><a href="#">{{l3}}</a></nav><a class="btn p" href="#">{{cta}}</a></div></header>',
  NOHASH, [('l1', 'Link 1', 'text', 'Episodes'), ('l2', 'Link 2', 'text', 'Pricing'), ('l3', 'Link 3', 'text', 'Questions'), ('cta', 'Button', 'text', 'Start free')],
  'A sticky top bar with a translucent blurred background: the brand name in the heading font, three quiet links on the right and a solid accent button. Links hide on phones.'),
 ('hero-film', 'Film hero', 'Top', 'A full-bleed looping film that fades into the page, with a big headline and two buttons.', '''
.hero{position:relative;min-height:min(92vh,880px);display:grid;align-items:end;overflow:hidden;isolation:isolate}
.hero video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.hero::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,var(--bg) 6%,color-mix(in srgb,var(--bg) 62%,transparent) 48%,color-mix(in srgb,var(--bg) 18%,transparent))}
.c{max-width:1180px;width:100%;margin:0 auto;padding:0 max(16px,4vw) clamp(48px,10vh,110px);display:grid;gap:18px}
.c h1{font-size:clamp(46px,8vw,112px);margin:0;max-width:14ch}
.c p.l{margin:0;max-width:46ch;font-size:clamp(16px,1.6vw,19px)}
.row{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
''' + CTRL_CSS,
  '<section class="hero">' + VIDEO + CTRL_HTML + '<div class="c"><p class="k">{{kicker}}</p><h1 class="h">{{heading}}</h1><p class="l">{{intro}}</p><div class="row"><a class="btn p" href="#">{{b1}}</a><a class="btn" href="#">{{b2}}</a></div></div></section>',
  NOHASH + PAUSE_JS, [('film', 'Film', 'film', 'smoke-plume'), ('kicker', 'Kicker', 'text', 'New every Sunday'), ('heading', 'Headline', 'text', 'Recipes filmed like still lifes.'), ('intro', 'Intro', 'long', 'One chef, one dish, ninety quiet seconds. Hands, steam and the final plate, every week.'), ('b1', 'Main button', 'text', 'Watch the latest'), ('b2', 'Second button', 'text', 'See all episodes')],
  'A full-height hero with a muted looping background video that fades into the page colour towards the bottom (a gradient built with color-mix from the background), a kicker, a very large headline, an intro line and two buttons, plus a pause/play button for the film.'),
 ('hero-split', 'Split hero', 'Top', 'Headline and buttons on the left, a framed portrait film on the right with a small caption chip.', '''
.split{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(28px,5vw,64px);align-items:center;max-width:1180px;margin:0 auto;padding:clamp(48px,10vh,110px) max(16px,4vw)}
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
  NOHASH + PAUSE_JS, [('film', 'Film', 'film', 'paper-bird'), ('kicker', 'Kicker', 'text', 'Paper, light and patience'), ('heading', 'Headline', 'text', 'Objects made slowly, filmed carefully.'), ('intro', 'Intro', 'long', 'A small studio making paper sculpture for shop windows, book covers and film.'), ('b1', 'Main button', 'text', 'See the work'), ('b2', 'Second button', 'text', 'Commission a piece'), ('note', 'Caption chip', 'text', 'Now showing: a bird cut from one sheet')],
  'A two-column hero: on the left a kicker, large headline, muted intro and two buttons; on the right a rounded 4:5 frame holding a looping film, with a pause button and a small translucent caption chip with an accent dot. Stacks on phones.'),
 ('statement', 'Statement', 'Story', 'A large paragraph whose words brighten as you read down the page.', '''
.st{max-width:1180px;margin:0 auto;padding:clamp(80px,16vh,180px) max(16px,4vw)}
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
 'sec-faq': [('kicker', 'Kicker', 'text', 'Questions'), ('heading', 'Headline', 'text', 'Before you start cooking.'), ('intro', 'Intro', 'long', 'Can’t find what you need? A real person answers within a working day.'), ('button', 'Button', 'text', 'Ask us')],
 'sec-contact': [('kicker', 'Kicker', 'text', 'Contact'), ('heading', 'Headline', 'text', 'Tell us what you’re cooking.'), ('intro', 'Intro', 'long', 'A short note is plenty. We reply within a working day, usually with questions about the dish.'), ('email', 'Email address', 'text', 'hello@example.kitchen'), ('address', 'Address', 'text', '14 Market Row, London E8')],
 'sec-footer': [('news', 'Newsletter heading', 'text', 'One recipe, every Sunday.')],
 'sec-logos': [('kicker', 'Kicker', 'text', 'Trusted by'), ('heading', 'Headline', 'text', 'Cooks, chefs and food brands in 31 countries.')],
 'sec-cta': [('film', 'Film', 'film', 'pigment-bloom'), ('kicker', 'Kicker', 'text', 'Start this week'), ('heading', 'Headline', 'text', 'Your first episode is one recipe away.'), ('intro', 'Intro', 'long', 'Bring a dish you love. We’ll handle the chef, the shots and the colour.'), ('b1', 'Main button', 'text', 'Start free'), ('b2', 'Second button', 'text', 'Watch a sample')],
}
GROUP = {'sec-pricing': 'Sell', 'sec-bento': 'Explain', 'sec-testimonials': 'Proof', 'sec-faq': 'Explain', 'sec-contact': 'End',
         'sec-footer': 'End', 'sec-logos': 'Proof', 'sec-cta': 'End'}
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
for bid, name, group, desc, css, html, js, fields, prompt in NEW:
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
    missing = [f['k'] for f in b['fields'] if '{{' + f['k'] + '}}' not in b['html']]
    assert not missing, (b['id'], missing)

lib = {'styles': {k: {'name': STYLE_NAMES[k], 'vars': STYLES[k], 'fonts': FONTS[k]} for k in STYLE_NAMES},
       'base': BASE, 'films': FILMS, 'blocks': blocks}
os.makedirs(os.path.join(SITE, 'builder'), exist_ok=True)
with open(os.path.join(SITE, 'builder', 'blocks.js'), 'w') as fh:
    fh.write('/* Generated by tools/blocks.py from tools/sections_src.py. Edit those, then run: python3 tools/blocks.py */\n')
    fh.write('window.PB_LIB=' + json.dumps(lib, ensure_ascii=False, separators=(',', ':')) + ';\n')


def fill(s, b, extra=None):
    vals = {f['k']: f['def'] for f in b['fields']}
    vals.update({'A': '../../assets/', 'brand': 'Saffron'})
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
