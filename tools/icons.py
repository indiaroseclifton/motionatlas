"""Build the searchable icon library in site/icons/.

For each of the 13 families shown in the atlas it picks about 300 common UI icons
(Fluent 3D: about 120 PNGs, Heroicons: the whole set), downloads them from the pinned
npm packages on jsDelivr (Fluent 3D from the fluentui-emoji GitHub repo), strips
comments and formatting, and writes:

    site/icons/index.json              families -> count, licence, source, package, version
    site/icons/sets/<family>.json      manifest: [{n: name, k: search keywords, s: svg}]
    site/icons/sets/fluent-3d/*.png    192 px PNGs (the manifest points at them)
    site/icons/packs/<family>.zip      every icon + LICENSE.txt + README.txt + icons.json
    site/icons/LICENSES.txt            one licence block per family

The 13-icon specimen folders (site/icons/<family>/) and specimen packs are left alone:
other pages draw those files by name.

    python3 -I tools/icons.py                     # cache in /tmp/icon-cache
    python3 -I tools/icons.py --cache DIR --site site

Downloads are treated as data: they are cached in their own directory, parsed as text
or images, and never executed.
"""
import argparse
import concurrent.futures as cf
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile

JSD = 'https://cdn.jsdelivr.net/npm/'
RAW_FLUENT = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/'
PKG = {
    'phosphor': ('@phosphor-icons/core', '2.1.1'),
    'heroicons': ('heroicons', '2.2.0'),
    'lucide': ('lucide-static', '1.59.0'),
    'tabler': ('@tabler/icons', '3.49.0'),
    'pixel': ('pixelarticons', '2.4.2'),
    'openmoji': ('openmoji', '17.0.0'),
}
TARGET = 300
FLUENT_TARGET = 120
FLUENT_PX = 192
ZIP_DATE = (2026, 10, 19, 0, 0, 0)

# id, title, description, package key, licence name, homepage
FAMILIES = [
    ('thin', 'Phosphor / Thin', 'Fine linework for spacious interfaces.', 'phosphor', 'MIT', 'https://phosphoricons.com'),
    ('light', 'Phosphor / Light', 'A restrained stroke with generous breathing room.', 'phosphor', 'MIT', 'https://phosphoricons.com'),
    ('regular', 'Phosphor / Regular', 'Balanced outlines for everyday product UI.', 'phosphor', 'MIT', 'https://phosphoricons.com'),
    ('bold', 'Phosphor / Bold', 'A stronger silhouette for small controls.', 'phosphor', 'MIT', 'https://phosphoricons.com'),
    ('fill', 'Phosphor / Fill', 'Solid forms for selected states and compact navigation.', 'phosphor', 'MIT', 'https://phosphoricons.com'),
    ('duotone', 'Phosphor / Duotone', 'Two tonal layers distinguish the foreground from structure.', 'phosphor', 'MIT', 'https://phosphoricons.com'),
    ('hero-outline', 'Heroicons / Outline', 'Rounded 24 px outlines for contemporary web UI.', 'heroicons', 'MIT', 'https://heroicons.com'),
    ('hero-solid', 'Heroicons / Solid', 'Compact filled forms from the same Heroicons family.', 'heroicons', 'MIT', 'https://heroicons.com'),
    ('lucide', 'Lucide / Outline', 'Consistent 24 px linework and open shapes.', 'lucide', 'ISC', 'https://lucide.dev'),
    ('tabler', 'Tabler / Outline', 'Clear geometric outlines on a 24 px grid.', 'tabler', 'MIT', 'https://tabler.io/icons'),
    ('pixel', 'Pixelarticons / Pixel', 'Stepped silhouettes and a deliberate pixel grid for retro interfaces.', 'pixel', 'MIT', 'https://pixelarticons.com'),
    ('openmoji', 'OpenMoji / Colour pictograms', 'Expressive coloured SVG pictograms by the OpenMoji contributors.', 'openmoji', 'CC BY-SA 4.0', 'https://openmoji.org'),
    ('fluent-3d', 'Fluent Emoji / 3D', 'Dimensional PNG emoji from Microsoft with material, colour and lighting.', 'fluent', 'MIT', 'https://github.com/microsoft/fluentui-emoji'),
]

# Common UI concepts. Each line: the concept, then other names it goes by in the families.
# A family takes the first name it actually has; the concept and every alternative become
# search aliases. Order is priority: a family keeps the first ~300 it can resolve.
CONCEPTS = """
house home home-2 home-modern
magnifying-glass search
gear settings cog cog-6-tooth settings-cog gear-six settings-2
user person
user-circle circle-user avatar-circle
users users-round user-group users-group users-three
user-plus user-round-plus user-add avatar-square-plus
user-minus user-round-minus avatar-square-minus
user-check user-round-check
user-gear user-cog user-round-cog
bell notification
bell-ringing bell-ring bell-alert
bell-slash bell-off bell-x
heart
heart-break heart-crack heart-broken
star
bookmark bookmark-simple
plus add
minus subtract
x close x-mark cross
check
check-circle circle-check
x-circle circle-x
plus-circle circle-plus add-circle
minus-circle circle-minus
info information-circle circle-info info-circle info-box
question circle-help question-mark-circle help-circle help circle-question
warning triangle-alert exclamation-triangle alert-triangle warning-diamond
warning-circle circle-alert exclamation-circle alert-circle square-alert
warning-octagon octagon-alert alert-octagon
prohibit ban no-symbol cancel
list menu bars-3 menu-2
list-bullets list list-bullet list-details bulletlist
list-numbers list-ordered numbered-list
list-checks list-todo list-check
dots-three more-horizontal ellipsis ellipsis-horizontal dots
dots-three-vertical more-vertical ellipsis-vertical dots-vertical
dots-six-vertical grip-vertical drag-and-drop
squares-four layout-grid squares-2x2 grid grid-2x2-2
grid-nine grid-3x3
sidebar panel-left layout-sidebar
layout layout-dashboard panels-top-left
app-window window window-frame
caret-down chevron-down
caret-up chevron-up
caret-left chevron-left
caret-right chevron-right
caret-double-right chevrons-right chevron-double-right
caret-double-left chevrons-left chevron-double-left
caret-up-down chevrons-up-down chevron-up-down selector chevrons-vertical
arrow-up
arrow-down
arrow-left
arrow-right
arrow-up-right
arrow-down-left
arrow-square-out external-link arrow-top-right-on-square
arrow-clockwise rotate-cw rotate-clockwise reload
arrow-counter-clockwise rotate-ccw rotate
arrows-clockwise refresh-cw arrow-path refresh
arrow-u-up-left undo undo-2 arrow-uturn-left arrow-back-up
arrow-u-up-right redo redo-2 arrow-uturn-right arrow-forward-up
arrows-out maximize arrows-pointing-out arrows-maximize expand
arrows-in minimize arrows-pointing-in arrows-minimize collapse
arrows-left-right arrow-left-right arrows-right-left arrows-horizontal
arrows-down-up arrow-up-down arrows-up-down arrows-vertical arrows-sort
arrows-out-cardinal move arrows-move
download download-simple arrow-down-tray
upload upload-simple arrow-up-tray
sign-in log-in arrow-right-end-on-rectangle login login-2
sign-out log-out arrow-left-start-on-rectangle arrow-right-on-rectangle logout
share-network share-2 share
share-fat forward share-3
link link-2 link-simple
link-break unlink link-slash link-off
paperclip attachment
copy document-duplicate
clipboard clipboard-text clipboard-document
scissors cut
trash trash-2 delete
pencil edit pencil-simple
note-pencil square-pen pencil-square pen-square
pen-nib pen-tool pen
eraser
paint-brush paintbrush brush
palette swatch colors-swatch
eyedropper pipette eye-dropper color-picker
eye
eye-slash eye-off
lock lock-closed
lock-open unlock lock-open-2
key
shield
shield-check
shield-warning shield-alert shield-exclamation
fingerprint finger-print
envelope mail
envelope-open mail-open
paper-plane-tilt send paper-airplane
at at-sign at-symbol
chat-circle message-circle chat-bubble-oval-left
chat message-square chat-bubble-left message comment
chats messages-square chat-bubble-left-right messages
chat-dots message-circle-more chat-bubble-oval-left-ellipsis message-dots
chat-text message-square-text chat-bubble-bottom-center-text message-text message-2
phone
phone-call phone-arrow-up-right phone-outgoing
video-camera video
video-camera-slash video-off
camera
camera-slash camera-off
microphone mic
microphone-slash mic-off microphone-off
speaker-high volume-2 speaker-wave volume volume-3
speaker-low volume-1
speaker-x volume-x speaker-x-mark volume-off
headphones headset headphone
music-note music musical-note
play
pause
stop square-stop
play-circle circle-play player-play
pause-circle circle-pause
skip-forward player-skip-forward
skip-back player-skip-back
fast-forward forward player-track-next
rewind backward player-track-prev
repeat
shuffle arrows-shuffle
waveform audio-waveform wave-sine
vinyl-record disc album
image photo
images gallery-thumbnails photos
film-strip film movie
television tv
monitor-play presentation-play
file document
file-text document-text file-description
file-plus document-plus
file-minus document-minus
file-arrow-down file-down document-arrow-down file-download
file-arrow-up file-up document-arrow-up file-upload
file-code
file-image file-photo
file-zip file-archive
files
folder
folder-open
folder-plus
archive archive-box
package box cube
tray inbox
calendar
calendar-blank calendar-days calendar-event calendar-2
calendar-check
calendar-plus
clock
clock-counter-clockwise history
alarm alarm-clock
timer
hourglass
globe globe-alt world earth
globe-hemisphere-west globe-americas
map-pin
map-trifold map
compass
navigation-arrow navigation navigation-2
crosshair locate current-location gps
signpost road-sign
path route
airplane plane
car
bicycle bike
bus
truck
train train-front
rocket rocket-launch
buildings building building-office building-2
storefront store building-storefront building-store
bank landmark building-library building-bank university
shopping-cart
shopping-bag
credit-card
wallet
money banknote banknotes cash
currency-dollar dollar-sign dollar
currency-euro euro
receipt receipt-percent
tag label
percent percentage
gift
coins
piggy-bank pig-money
chart-bar bar-chart chart-bar-big
chart-line line-chart presentation-chart-line
chart-line-up trending-up arrow-trending-up
chart-line-down trending-down arrow-trending-down
chart-pie pie-chart chart-pie-slice
presentation presentation-chart-bar
gauge speed-medium
pulse activity heartbeat
target
trophy
medal award
crown
flag
lightning zap bolt
fire flame
sparkle sparkles
magic-wand wand wand-sparkles magic-edit
lightbulb light-bulb bulb
sun
moon
moon-stars moon-star
sun-horizon sunrise
cloud
cloud-rain
cloud-sun
cloud-lightning cloud-storm
snowflake
thermometer temperature
drop droplet
wind
umbrella
leaf
tree tree-deciduous
plant sprout seedling
flower
mountains mountain
waves ripple
paw-print paw
dog
cat
bug bug-ant
code code-bracket
brackets-curly braces code-bracket-square
terminal-window terminal command-line terminal-2
command
database circle-stack
hard-drives server
cloud-arrow-up cloud-upload
cloud-arrow-down cloud-download
cpu cpu-chip
git-branch
git-commit git-commit-horizontal
git-merge
git-pull-request
desktop monitor computer-desktop device-desktop computer
laptop device-laptop
device-mobile smartphone device-phone-mobile
device-tablet tablet
watch device-watch
keyboard
mouse
printer
plug
battery-full battery-100 battery-4 battery
battery-low battery-0 battery-1
wifi-high wifi
wifi-slash wifi-off
bluetooth
cell-signal-full signal antenna-bars-5 cellular-signal-3
broadcast radio-tower antenna
rss
power
qr-code qrcode
barcode
scan viewfinder-circle
usb
sliders-horizontal sliders adjustments-horizontal
faders sliders-vertical adjustments-vertical adjustments
funnel filter
sort-ascending arrow-up-narrow-wide bars-arrow-up
sort-descending arrow-down-wide-narrow bars-arrow-down
toggle-left
toggle-right switch
check-square square-check checkbox-on checkbox
square
circle
triangle
hexagon
diamond diamond-gem
radio-button circle-dot
selection square-dashed
crop
frame-corners frame
cursor mouse-pointer cursor-arrow-rays pointer
cursor-click mouse-pointer-click cursor-arrow-ripple click
hand hand-raised hand-stop
thumbs-up hand-thumb-up thumb-up
thumbs-down hand-thumb-down thumb-down
smiley smile face-smile mood-smile
smiley-sad frown face-frown mood-sad
smiley-meh meh mood-empty
text-aa type typography
text-b bold
text-italic italic
text-underline underline
text-strikethrough strikethrough
text-h heading h-1
text-align-left align-left bars-3-bottom-left
text-align-center align-center
text-align-right align-right bars-3-bottom-right
text-align-justify align-justify align-justified
quotes quote quote-text-inline
paragraph pilcrow
translate languages language
table table-cells
columns columns-2 view-columns text-colums
kanban layout-kanban square-kanban
notebook
book book-2
book-open
books library
newspaper news article
note sticky-note
graduation-cap academic-cap school
briefcase
first-aid-kit first-aid briefcase-medical medical-cross
heartbeat heart-pulse
pill
coffee
pizza
cake
bed
door door-open
anchor
handshake heart-handshake
infinity
hash hashtag
lifebuoy life-buoy
flask flask-conical beaker test-tube
atom
puzzle-piece puzzle
game-controller gamepad-2 device-gamepad gamepad joystick
dice-five dice-5
skull
ghost
robot bot
brain
stack layers square-3-stack-3d stack-2
shapes
wrench tool
hammer
toolbox tool-case
magnet
scales scale
ruler
push-pin pin
ticket
radio
megaphone speakerphone
airplay
picture-in-picture
aspect-ratio ratio
identification-card id-card identification id contact
address-book book-user
seal-check badge-check check-badge rosette-discount-check
certificate
baby
wheelchair accessibility accessible
lamp
couch sofa
bathtub bath
t-shirt shirt
eyeglasses glasses eyeglass
recycle
tent
binoculars
telescope
planet orbit
asterisk
equals equal
divide
plus-square square-plus plus-box
minus-square square-minus minus-box
calculator
sigma
tree-structure network sitemap
flow-arrow workflow
confetti party-popper
gas-pump fuel gas-station
traffic-cone construction cone
siren
vault
gavel
mailbox
magnifying-glass-plus zoom-in
magnifying-glass-minus zoom-out
spinner loader
circle-notch loader-circle loader-2 loading
"""

# Phosphor/Tabler categories that make good top-ups (brands and odd sets last).
PHOSPHOR_CATS = ['system', 'arrows', 'office', 'communications', 'media', 'editor', 'technology & development',
                 'design', 'people', 'commerce', 'finances', 'maps & travel', 'objects', 'weather', 'nature',
                 'health & wellness', 'games', 'brands']
TABLER_CATS = ['System', 'Arrows', 'Document', 'Communication', 'Media', 'Text', 'Devices', 'Design', 'E-commerce',
               'Map', 'Charts', 'Development', 'Database', 'Computers', 'Weather', 'Health', 'Nature']

# Emoji the atlas uses as UI pictograms, by CLDR annotation. Fluent takes the first ~120
# it has; OpenMoji takes them all, then tops up across emoji groups.
UI_EMOJI = """house|bell|red heart|gear|magnifying glass tilted left|file folder|open file folder|calendar|spiral calendar
bust in silhouette|busts in silhouette|check mark button|check mark|cross mark|plus|minus|locked|unlocked|key|star|glowing star
sparkles|camera|camera with flash|video camera|movie camera|telephone receiver|mobile phone|laptop|desktop computer|keyboard
computer mouse|printer|envelope|incoming envelope|e-mail|inbox tray|outbox tray|package|memo|pencil|pen|paintbrush|crayon
artist palette|scissors|paperclip|pushpin|round pushpin|link|bookmark|bookmark tabs|books|open book|notebook|clipboard
page facing up|bar chart|chart increasing|chart decreasing|card index dividers|wastebasket|light bulb|fire|rocket
globe showing Europe-Africa|globe with meridians|world map|compass|alarm clock|hourglass done|stopwatch|watch|battery
electric plug|wrench|hammer|hammer and wrench|toolbox|shield|warning|no entry|prohibited|information|red question mark
red exclamation mark|speech balloon|thought balloon|speaker high volume|muted speaker|megaphone|headphone|musical note
studio microphone|play button|pause button|stop button|record button|shuffle tracks button|repeat button|fast-forward button
up arrow|down arrow|left arrow|right arrow|counterclockwise arrows button|clockwise vertical arrows|shopping cart|shopping bags
credit card|money bag|gem stone|wrapped gift|trophy|1st place medal|crown|thumbs up|thumbs down|waving hand|clapping hands
raising hands|folded hands|eyes|brain|robot|ghost|alien|sun|cloud|umbrella with rain drops|high voltage|snowflake|rainbow
crescent moon|house with garden|office building|airplane|automobile|bicycle|party popper|balloon|birthday cake|hot beverage
pizza|red apple|seedling|potted plant|four leaf clover|dog face|cat face|butterfly|smiling face with smiling eyes
grinning face|face with tears of joy|thinking face|winking face|smiling face with sunglasses|star-struck
face screaming in fear|partying face|loudly crying face|zipper-mouth face|sleeping face|hundred points|collision|OK hand
victory hand|flexed biceps|handshake|writing hand|backhand index pointing up|magic wand|crystal ball|puzzle piece|game die
video game|joystick|satellite antenna|satellite|test tube|microscope|telescope|dna|pill|stethoscope|thermometer|broom
basket|soap|bell with slash|label|ticket|admission tickets|film frames|framed picture|television|radio|floppy disk
optical disk|dvd|abacus|bar chart|bullseye|calendar|chequered flag|triangular flag|globe showing Americas|map of Japan
mountain|camping|beach with umbrella|national park|sunrise|night with stars|cityscape|bridge at night|ferris wheel
rocket|flying saucer|sparkling heart|orange heart|yellow heart|green heart|blue heart|purple heart|black heart|white heart
""".replace('\n', '|')
OPENMOJI_GROUPS = ['smileys-emotion', 'symbols', 'objects', 'travel-places', 'activities', 'animals-nature',
                   'food-drink', 'people-body', 'extras-openmoji']


def log(*a):
    print(*a, file=sys.stderr, flush=True)


class Fetcher:
    def __init__(self, cache):
        self.cache = cache
        os.makedirs(cache, exist_ok=True)

    def path(self, url):
        safe = re.sub(r'[^A-Za-z0-9._-]+', '_', url.split('://', 1)[1])
        if len(safe) > 180:
            safe = safe[:120] + '_' + str(abs(hash(url)))
        return os.path.join(self.cache, safe)

    def get(self, url, missing_ok=False):
        p = self.path(url)
        if os.path.exists(p):
            with open(p, 'rb') as f:
                data = f.read()
            return None if data == b'__404__' else data
        for attempt in range(4):
            try:
                with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'motionatlas-icons'}), timeout=60) as r:
                    data = r.read()
                break
            except urllib.error.HTTPError as e:
                if e.code == 404:
                    if missing_ok:
                        with open(p, 'wb') as f:
                            f.write(b'__404__')
                        return None
                    raise
                if attempt == 3:
                    raise
            except Exception:
                if attempt == 3:
                    raise
            time.sleep(1.5 * (attempt + 1))
        with open(p, 'wb') as f:
            f.write(data)
        return data

    def many(self, urls, missing_ok=False):
        out = {}
        with cf.ThreadPoolExecutor(16) as ex:
            futs = {ex.submit(self.get, u, missing_ok): u for u in urls}
            for fu in cf.as_completed(futs):
                out[futs[fu]] = fu.result()
        return out


def npm(key, path):
    name, ver = PKG[key]
    return f'{JSD}{name}@{ver}/{path}'


def listing(fx, key):
    name, ver = PKG[key]
    data = json.loads(fx.get(f'https://data.jsdelivr.com/v1/packages/npm/{name}@{ver}?structure=flat'))
    return [f['name'] for f in data['files']]


def concepts():
    out = []
    for line in CONCEPTS.strip().splitlines():
        words = line.split()
        if words:
            out.append(words)
    return out


def words_of(*parts):
    seen, out = set(), []
    for p in parts:
        for w in re.split(r'[\s,;/_]+|(?<=[a-z])-(?=[a-z])', str(p).lower()):
            w = w.strip(' -*.')
            if w and w not in seen and len(w) > 1:
                seen.add(w)
                out.append(w)
    return out


def pick(native, tags, concept_list, rank, target):
    """native: list of names; tags: name -> keyword list; rank(name) -> sort key for top-ups."""
    have = set(native)
    chosen, alias = [], {}
    for words in concept_list:
        for cand in words:
            if cand in have and cand not in alias:
                chosen.append(cand)
                alias[cand] = words
                break
        if len(chosen) >= target:
            break
    if len(chosen) < target:
        rest = sorted((n for n in native if n not in alias), key=rank)
        for n in rest[:target - len(chosen)]:
            chosen.append(n)
            alias[n] = []
    return [(n, words_of(n.replace('-', ' '), ' '.join(alias[n]), ' '.join(tags.get(n, [])))) for n in chosen]


def simple_rank(n):
    return (bool(re.search(r'\d', n)), n.count('-'), len(n), n)


# ---------- SVG clean-up ----------
def clean_svg(text, keep_ids=False):
    t = text.decode('utf-8') if isinstance(text, bytes) else text
    t = re.sub(r'<\?xml.*?\?>', '', t, flags=re.S)
    t = re.sub(r'<!DOCTYPE.*?>', '', t, flags=re.S)
    t = re.sub(r'<!--.*?-->', '', t, flags=re.S)
    t = re.sub(r'<script.*?</script>', '', t, flags=re.S | re.I)
    t = re.sub(r'\son[a-z]+\s*=\s*"[^"]*"', '', t)
    t = re.sub(r'<path stroke="none" d="M0 0h24v24H0z" fill="none"\s*/>', '', t)
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r'>\s+<', '><', t).strip()
    t = re.sub(r'\s+/>', '/>', t)
    t = re.sub(r'\s+>', '>', t)
    if not keep_ids and 'url(#' not in t and 'href="#' not in t:
        t = re.sub(r'\sid="[^"]*"', '', t)
    t = re.sub(r'<g/>', '', t)
    # root: drop fixed size, class names and data-slot; the page and the exports size it
    def root(m):
        a = m.group(1)
        a = re.sub(r'\s(width|height|class|data-slot|aria-hidden)="[^"]*"', '', a)
        if 'xmlns=' not in a:
            a = ' xmlns="http://www.w3.org/2000/svg"' + a
        return '<svg' + a + '>'
    t = re.sub(r'<svg([^>]*)>', root, t, count=1)
    return t


# ---------- families ----------
def phosphor_meta(fx):
    src = fx.get(npm('phosphor', 'dist/index.mjs')).decode('utf-8')
    meta = {}
    for block in re.split(r'\n  \{\n', src):
        m = re.search(r'name: "([^"]+)"', block)
        if not m:
            continue
        tags = re.search(r'tags: \[(.*?)\]', block, re.S)
        cats = re.search(r'categories: \[(.*?)\]', block, re.S)
        tg = re.findall(r'"([^"]+)"', tags.group(1)) if tags else []
        cat = [c.split('.')[-1].lower() for c in re.findall(r'e\.([A-Z_]+)', cats.group(1))] if cats else []
        meta[m.group(1)] = ([x for x in tg if x != '*new*'], cat)
    return meta


PH_CAT_MAP = {'arrows': 'arrows', 'brand': 'brands', 'commerce': 'commerce', 'communication': 'communications',
              'design': 'design', 'development': 'technology & development', 'editor': 'editor', 'finance': 'finances',
              'games': 'games', 'health': 'health & wellness', 'map': 'maps & travel', 'media': 'media', 'nature': 'nature',
              'objects': 'objects', 'office': 'office', 'people': 'people', 'system': 'system', 'weather': 'weather'}


def build_phosphor(fx, weights):
    files = listing(fx, 'phosphor')
    names = sorted({f.split('/')[-1][:-4] for f in files if f.startswith('/assets/regular/')})
    meta = phosphor_meta(fx)
    tags = {n: meta.get(n, ([], []))[0] for n in names}

    def rank(n):
        cats = [PH_CAT_MAP.get(c, c) for c in meta.get(n, ([], []))[1]]
        r = min((PHOSPHOR_CATS.index(c) for c in cats if c in PHOSPHOR_CATS), default=len(PHOSPHOR_CATS))
        return (r,) + simple_rank(n)
    chosen = pick(names, tags, concepts(), rank, TARGET)
    out = {}
    for w in weights:
        urls = {n: npm('phosphor', f'assets/{w}/{n}.svg' if w == 'regular' else f'assets/{w}/{n}-{w}.svg') for n, _ in chosen}
        got = fx.many(urls.values())
        out[w] = [(n, k, clean_svg(got[urls[n]])) for n, k in chosen]
    return out


def build_hero(fx):
    files = listing(fx, 'heroicons')
    names = sorted({f.split('/')[-1][:-4] for f in files if f.startswith('/24/outline/')})
    chosen = pick(names, {}, concepts(), simple_rank, len(names))
    out = {}
    for style, fam in (('outline', 'hero-outline'), ('solid', 'hero-solid')):
        urls = {n: npm('heroicons', f'24/{style}/{n}.svg') for n, _ in chosen}
        got = fx.many(urls.values())
        out[fam] = [(n, k, clean_svg(got[urls[n]])) for n, k in chosen]
    return out


def build_lucide(fx):
    files = listing(fx, 'lucide')
    names = sorted({f.split('/')[-1][:-4] for f in files if f.startswith('/icons/') and f.endswith('.svg')})
    tags = json.loads(fx.get(npm('lucide', 'tags.json')))
    chosen = pick(names, tags, concepts(), simple_rank, TARGET)
    urls = {n: npm('lucide', f'icons/{n}.svg') for n, _ in chosen}
    got = fx.many(urls.values())
    return [(n, k, clean_svg(got[urls[n]])) for n, k in chosen]


def build_tabler(fx):
    meta = json.loads(fx.get(npm('tabler', 'icons.json')))
    names = sorted(n for n, v in meta.items() if 'outline' in v.get('styles', {}))
    tags = {n: list(meta[n].get('tags', [])) + [meta[n].get('category', '')] for n in names}

    def rank(n):
        c = meta[n].get('category', '')
        r = TABLER_CATS.index(c) if c in TABLER_CATS else len(TABLER_CATS) + (5 if c == 'Brand' or n.startswith('brand-') else 0)
        return (r,) + simple_rank(n)
    chosen = pick(names, tags, concepts(), rank, TARGET)
    urls = {n: npm('tabler', f'icons/outline/{n}.svg') for n, _ in chosen}
    got = fx.many(urls.values())
    return [(n, k, clean_svg(got[urls[n]])) for n, k in chosen]


def build_pixel(fx):
    files = listing(fx, 'pixel')
    names = sorted({f.split('/')[-1][:-4] for f in files if f.startswith('/svg/') and f.endswith('.svg')})
    names = [n for n in names if not n.endswith('-sharp')]
    chosen = pick(names, {}, concepts(), lambda n: (n.startswith('letter-'),) + simple_rank(n), TARGET)
    urls = {n: npm('pixel', f'svg/{n}.svg') for n, _ in chosen}
    got = fx.many(urls.values())
    return [(n, k, clean_svg(got[urls[n]])) for n, k in chosen]


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def ui_emoji():
    seen, out = set(), []
    for a in UI_EMOJI.split('|'):
        a = a.strip()
        if a and a not in seen:
            seen.add(a)
            out.append(a)
    return out


def build_openmoji(fx):
    data = json.loads(fx.get(npm('openmoji', 'data/openmoji.json')))
    base = [e for e in data if not e.get('skintone') and e.get('group') in OPENMOJI_GROUPS and e.get('annotation')]
    by_ann = {}
    for e in base:
        by_ann.setdefault(e['annotation'], e)
    chosen, used = [], set()
    for a in ui_emoji():
        e = by_ann.get(a)
        if e and e['hexcode'] not in used:
            chosen.append(e)
            used.add(e['hexcode'])
    groups = {g: [e for e in base if e['group'] == g and e['hexcode'] not in used and '200D' not in e['hexcode']] for g in OPENMOJI_GROUPS}
    i = 0
    while len(chosen) < TARGET and any(groups.values()):
        g = OPENMOJI_GROUPS[i % len(OPENMOJI_GROUPS)]
        if groups[g]:
            e = groups[g].pop(0)
            if e['hexcode'] not in used:
                chosen.append(e)
                used.add(e['hexcode'])
        i += 1
    urls = {e['hexcode']: npm('openmoji', f"color/svg/{e['hexcode']}.svg") for e in chosen}
    got = fx.many(urls.values())
    out, names = [], set()
    for e in chosen:
        n = slug(e['annotation'])
        if n in names:
            n = f"{n}-{e['hexcode'].lower()}"
        names.add(n)
        kw = words_of(e['annotation'], e.get('tags', ''), e.get('openmoji_tags', ''), e.get('subgroups', ''), e.get('group', ''))
        out.append((n, kw, clean_svg(got[urls[e['hexcode']]]), e['emoji']))
    return out


def fluent_urls(ann):
    folder = ann[0].upper() + ann[1:]
    stem = re.sub(r'[^a-z0-9]+', '_', ann.lower()).strip('_')
    q = urllib.parse.quote(folder)
    return [
        (f'{RAW_FLUENT}assets/{q}/3D/{urllib.parse.quote(stem)}_3d.png', f'{RAW_FLUENT}assets/{q}/metadata.json'),
        (f'{RAW_FLUENT}assets/{q}/Default/3D/{urllib.parse.quote(stem)}_3d_default.png', f'{RAW_FLUENT}assets/{q}/metadata.json'),
    ]


def build_fluent(fx, outdir):
    from PIL import Image  # noqa: local import keeps the SVG-only path dependency free
    cands = ui_emoji()
    tries = []
    for a in cands:
        for png, meta in fluent_urls(a):
            tries.append((a, png, meta))
    got = fx.many([t[1] for t in tries] + list({t[2] for t in tries}), missing_ok=True)
    os.makedirs(outdir, exist_ok=True)
    out, done = [], set()
    for a, png, meta in tries:
        if a in done or not got.get(png):
            continue
        done.add(a)
        n = slug(a)
        im = Image.open(io.BytesIO(got[png])).convert('RGBA')
        im.thumbnail((FLUENT_PX, FLUENT_PX), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, 'PNG', optimize=True)
        with open(os.path.join(outdir, n + '.png'), 'wb') as f:
            f.write(buf.getvalue())
        kw = [a]
        try:
            m = json.loads(got[meta]) if got.get(meta) else {}
            kw += m.get('keywords', []) + [m.get('group', '')]
        except ValueError:
            pass
        out.append((n, words_of(*kw), buf.getvalue()))
        if len(out) >= FLUENT_TARGET:
            break
    # remove PNGs from earlier runs that are no longer chosen
    keep = {n + '.png' for n, _, _ in out}
    for f in os.listdir(outdir):
        if f.endswith('.png') and f not in keep:
            os.remove(os.path.join(outdir, f))
    return out


# ---------- licences ----------
def licence_texts(fx):
    return {
        'phosphor': fx.get(npm('phosphor', 'LICENSE')).decode(),
        'heroicons': fx.get(npm('heroicons', 'LICENSE')).decode(),
        'lucide': fx.get(npm('lucide', 'LICENSE')).decode(),
        'tabler': fx.get(npm('tabler', 'LICENSE')).decode(),
        'pixel': fx.get(npm('pixel', 'LICENSE')).decode(),
        'openmoji': fx.get(npm('openmoji', 'LICENSE.txt')).decode(),
        'fluent': fx.get(RAW_FLUENT + 'LICENSE').decode(),
    }


def source_line(key):
    if key == 'fluent':
        return 'microsoft/fluentui-emoji (GitHub, main branch)', 'main', 'https://github.com/microsoft/fluentui-emoji'
    name, ver = PKG[key]
    return f'{name}@{ver}', ver, f'https://www.npmjs.com/package/{name}/v/{ver}'


NOTES = {
    'openmoji': 'All emojis designed by OpenMoji, the open-source emoji and icon project. License: CC BY-SA 4.0.\n'
                'Attribution: OpenMoji (https://openmoji.org), CC BY-SA 4.0. SVGs here are minified (whitespace, comments\n'
                'and unused ids removed; no visual change). Adapted versions stay under CC BY-SA 4.0.',
    'fluent': 'PNG renders resized to 192 px from the 3D style of Microsoft Fluent Emoji.',
}


def zip_bytes(entries):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for name, data in entries:
            info = zipfile.ZipInfo(name, ZIP_DATE)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            z.writestr(info, data)
    return buf.getvalue()


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--cache', default='/tmp/icon-cache')
    ap.add_argument('--site', default=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site'))
    args = ap.parse_args()
    site = os.path.abspath(args.site)
    icons = os.path.join(site, 'icons')
    sets = os.path.join(icons, 'sets')
    packs = os.path.join(icons, 'packs')
    os.makedirs(sets, exist_ok=True)
    os.makedirs(packs, exist_ok=True)
    fx = Fetcher(args.cache)

    log('phosphor…')
    data = build_phosphor(fx, ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'])
    log('heroicons…')
    data.update(build_hero(fx))
    log('lucide…')
    data['lucide'] = build_lucide(fx)
    log('tabler…')
    data['tabler'] = build_tabler(fx)
    log('pixelarticons…')
    data['pixel'] = build_pixel(fx)
    log('openmoji…')
    om = build_openmoji(fx)
    data['openmoji'] = [(n, k, s) for n, k, s, _ in om]
    log('fluent 3d…')
    fl = build_fluent(fx, os.path.join(sets, 'fluent-3d'))
    lic = licence_texts(fx)

    index = {'generated': time.strftime('%Y-%m-%d'), 'tool': 'tools/icons.py', 'families': []}
    lic_blocks = []
    for fid, title, desc, key, licname, home in FAMILIES:
        src, ver, pkg_url = source_line(key)
        note = NOTES.get(key, '')
        if fid == 'fluent-3d':
            icons_ = [{'n': n, 'k': ' '.join(k), 'f': f'icons/sets/fluent-3d/{n}.png'} for n, k, _ in fl]
            files = [(f'{fid}/png/{n}.png', b) for n, _, b in fl]
            fmt = 'png'
        else:
            icons_ = [{'n': n, 'k': ' '.join(k), 's': s} for n, k, s in data[fid]]
            files = [(f'{fid}/svg/{n}.svg', s + '\n') for n, _, s in data[fid]]
            fmt = 'svg'
        manifest = {'id': fid, 'title': title, 'format': fmt, 'source': src, 'version': ver, 'licence': licname,
                    'count': len(icons_), 'icons': icons_}
        with open(os.path.join(sets, fid + '.json'), 'w') as f:
            json.dump(manifest, f, ensure_ascii=False, separators=(',', ':'))
        readme = (f'{title}\n{"=" * len(title)}\n\n{len(icons_)} {fmt.upper()} icons chosen for common interface use.\n'
                  f'Source: {src} ({pkg_url})\nProject: {home}\nLicence: {licname} (see LICENSE.txt)\n'
                  + (f'\n{note}\n' if note else '') +
                  '\nBuilt by tools/icons.py for the Visual & Motion Atlas. icons.json lists every name with its\n'
                  'search keywords.\n' + ('The SVGs use currentColor, so they take the text colour they sit in.\n'
                                         if fid not in ('openmoji', 'fluent-3d') else ''))
        names_json = json.dumps([{'name': i['n'], 'keywords': i['k']} for i in icons_], ensure_ascii=False, indent=1)
        z = zip_bytes(files + [(f'{fid}/LICENSE.txt', lic[key]), (f'{fid}/README.txt', readme), (f'{fid}/icons.json', names_json)])
        with open(os.path.join(packs, fid + '.zip'), 'wb') as f:
            f.write(z)
        index['families'].append({'id': fid, 'title': title, 'description': desc, 'format': fmt, 'count': len(icons_),
                                  'licence': licname, 'source': src, 'version': ver, 'package': pkg_url, 'home': home,
                                  'manifest': f'icons/sets/{fid}.json', 'pack': f'icons/packs/{fid}.zip',
                                  'packBytes': len(z), 'specimens': f'icons/{fid}/', 'specimenPack': f'icons/packs/{fid}-specimens.zip',
                                  'monochrome': fid not in ('openmoji', 'fluent-3d')})
        log(f'{fid}: {len(icons_)} icons, pack {len(z) // 1024} KB')
        lic_blocks.append((fid, title, src, licname, home, note, key))

    with open(os.path.join(icons, 'index.json'), 'w') as f:
        json.dump(index, f, ensure_ascii=False, indent=1)

    out = ['Icon credits and licences', '=========================', '',
           'Every icon in site/icons/ comes from one of the open-source projects below. The full sets',
           '(icons/sets/, icons/packs/<family>.zip) and the 13-icon specimens (icons/<family>/,',
           'icons/packs/<family>-specimens.zip) are covered by the same licence as their family.',
           'Each family pack also carries its own LICENSE.txt.', '']
    done = set()
    for fid, title, src, licname, home, note, key in lic_blocks:
        fams = [b[0] for b in lic_blocks if b[6] == key]
        if key in done:
            continue
        done.add(key)
        out += ['-' * 72, f'{title.split(" / ")[0]}  ({", ".join(fams)})', f'Source: {src}', f'Project: {home}',
                f'Licence: {licname}'] + ([note] if note else []) + ['', lic[key].strip(), '']
    with open(os.path.join(icons, 'LICENSES.txt'), 'w') as f:
        f.write('\n'.join(out) + '\n')
    log('done')


if __name__ == '__main__':
    main()
