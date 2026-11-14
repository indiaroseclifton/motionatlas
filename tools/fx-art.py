#!/usr/bin/env python3
"""Abstract artwork for the landing technique demos (site/assets/fx).

Each picture is a soft colour field with a few flat geometric forms: enough edge and colour for a parallax, mask or
distortion demo to read, and nothing figurative. File names and sizes are kept, so the demos need no changes.
Run:  python3 tools/fx-art.py            (needs Pillow)
"""
import os, math, random, hashlib, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
FX = os.path.join(HERE, '..', 'site', 'assets', 'fx')
#        field tones                                        accent     deep       name
PALS = [(['#FFE7DC', '#FFD3C2', '#FFBFA8', '#FDEEE2'], '#F2643D', '#3A1A10'),   # coral
        (['#E3EEFF', '#CFE0FF', '#B9CEFF', '#EEF4FF'], '#2F5BEA', '#101B3D'),   # sky
        (['#E6F0E6', '#D3E6D6', '#BFD9C6', '#F1F6EE'], '#2F7D5B', '#12281D'),   # sage
        (['#EFE8FF', '#E0D4FF', '#CFC0FA', '#F6F1FF'], '#6D4AE8', '#1E1633'),   # lilac
        (['#F6EEDC', '#EEDFC1', '#E6D2AC', '#FAF5E8'], '#D08A2E', '#2A2114'),   # sand
        (['#FFE6EE', '#FFD0DF', '#FBBBD0', '#FFF1F5'], '#D6336C', '#2B0F1B'),   # rose
        (['#DDF5EE', '#C4EDE0', '#ABE3D2', '#ECFAF5'], '#0E9F7B', '#0C2A22'),   # mint
        (['#E9ECF1', '#D9DEE7', '#C8D0DC', '#F3F5F8'], '#3B4657', '#12161C')]   # slate

def rgb(h, a=255):
    h = h.lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)

def field(w, h, tones, rnd):
    small = Image.new('RGB', (5, 4)); px = small.load()
    for y in range(4):
        for x in range(5): px[x, y] = rgb(rnd.choice(tones))[:3]
    return small.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(max(w, h) // 36))

def forms(w, h, accent, deep, rnd, t=None):
    """Flat forms on a transparent layer, drawn at 2x and scaled down for clean edges. t (0..1) animates them."""
    S = 2; W, H = w * S, h * S; m = min(W, H)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    white = (255, 255, 255, 235); acc = rgb(accent); dp = rgb(deep)
    ang = (t or 0) * math.tau
    # the main disc sits near a third; with t it travels on a small orbit
    r = m * rnd.uniform(0.24, 0.34); cx = W * rnd.choice([0.36, 0.62]); cy = H * rnd.uniform(0.40, 0.58)
    if t is not None: cx += math.cos(ang) * m * 0.16; cy += math.sin(ang) * m * 0.08
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=acc)
    kinds = rnd.sample(['ring', 'half', 'bars', 'dots', 'pill', 'quarter'], 3)
    for k in kinds:
        if k == 'ring':
            rr = r * rnd.uniform(0.9, 1.35) * (1 + (0.25 * math.sin(ang) if t is not None else 0))
            ox, oy = cx + r * rnd.uniform(0.5, 0.9), cy - r * rnd.uniform(0.3, 0.7)
            d.ellipse([ox - rr, oy - rr, ox + rr, oy + rr], outline=white, width=int(m * 0.022))
        if k == 'half':
            rr = r * rnd.uniform(0.55, 0.8); ox, oy = cx - r * rnd.uniform(0.7, 1.1), cy + r * rnd.uniform(0.35, 0.8)
            st = rnd.choice([0, 90, 180, 270]) + (t or 0) * 360
            d.pieslice([ox - rr, oy - rr, ox + rr, oy + rr], st, st + 180, fill=white)
        if k == 'bars':
            bw = m * 0.2; bh = m * 0.026; x0 = W * rnd.uniform(0.08, 0.7); y0 = H * rnd.uniform(0.1, 0.22)
            for i in range(4):
                grow = 1 if t is None else 0.4 + 0.6 * abs(math.sin(ang + i * 0.7))
                d.rounded_rectangle([x0, y0 + i * bh * 2, x0 + bw * (1 - i * 0.18) * grow, y0 + i * bh * 2 + bh], bh / 2, fill=dp)
        if k == 'dots':
            g = m * 0.045; x0 = W * rnd.uniform(0.62, 0.78); y0 = H * rnd.uniform(0.66, 0.78)
            for i in range(5):
                for j in range(4): d.ellipse([x0 + i * g, y0 + j * g, x0 + i * g + g * 0.34, y0 + j * g + g * 0.34], fill=dp)
        if k == 'pill':
            pw, ph = m * rnd.uniform(0.3, 0.42), m * 0.11; x0 = W * rnd.uniform(0.1, 0.5); y0 = H * rnd.uniform(0.7, 0.8)
            if t is not None: x0 += math.sin(ang) * m * 0.1
            d.rounded_rectangle([x0, y0, x0 + pw, y0 + ph], ph / 2, fill=white)
        if k == 'quarter':
            rr = m * rnd.uniform(0.3, 0.42); corner = rnd.choice([(0, 0, 0), (W, 0, 90), (W, H, 180), (0, H, 270)])
            ox, oy, st = corner; d.pieslice([ox - rr, oy - rr, ox + rr, oy + rr], st, st + 90, fill=dp)
    return layer.resize((w, h), Image.LANCZOS)

def grain(im, rnd):
    n = Image.effect_noise(im.size, 22).convert('RGB')
    return Image.blend(im, ImageChops.soft_light(im, n), 0.5)

def picture(name, w, h, t=None, seed=None, pal=None):
    key = seed or name; n = int(hashlib.md5(key.encode()).hexdigest(), 16)
    tones, accent, deep = PALS[(n if pal is None else pal) % len(PALS)]
    base = field(w, h, tones, random.Random(n))
    out = Image.alpha_composite(base.convert('RGBA'), forms(w, h, accent, deep, random.Random(n >> 8), t)).convert('RGB')
    return grain(out, random.Random(n))

def main():
    made = 0
    order = [0, 3, 6, 4, 1, 5, 2, 7]   # neighbours in the alphabet get different palettes
    for f in sorted(os.listdir(FX)):
        p = os.path.join(FX, f)
        if not f.endswith('.webp') or not os.path.isfile(p): continue
        with Image.open(p) as im: w, h = im.size
        picture(f[:-5], w, h, pal=order[made % 8]).save(p, 'WEBP', quality=84, method=6); made += 1
    film = os.path.join(FX, 'film')
    for i in range(60):
        picture('film', 960, 540, t=i / 60, seed='sequence').save(os.path.join(film, 'f%02d.webp' % (i + 1)), 'WEBP', quality=80, method=6)
    print('pictures', made, 'frames', 60)

if __name__ == '__main__': main()
