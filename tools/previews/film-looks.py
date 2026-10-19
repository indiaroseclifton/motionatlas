"""Render the Film looks preview clips (F09-F24) natively with ffmpeg.

Each look grades one of the atlas's own specimen films (original to the atlas, see
Credits & licences). The clip is a seamless 5 s loop at 720x450: a divider sweeps
across, showing the untouched source on the left and the graded frame on the right.
Outputs site/assets/looks/fNN.mp4 (H.264), fNN.webm (VP9) and fNN.webp (graded poster).

    python3 -I tools/previews/film-looks.py [F09,F10,...]
"""
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, '..', '..', 'site')
SRC = os.path.join(SITE, 'assets', 'films')
OUT = os.path.join(SITE, 'assets', 'looks')
FONT = os.path.join(SITE, 'fonts', 'AtlasSans-Regular.otf')
W, H, D, FPS = 720, 450, 5, 24
P = f'2*PI*t/{D}'  # periodic phase, so every time-based wobble loops with the clip

def grain(n):
    n = max(3, round(n * .6))
    return f'noise=c0s={n}:c1s={n}:c2s={n}:allf=t'

def pillar(w):  # 4:3 gate inside the 16:10 frame
    b = (W - w) // 2
    return f'drawbox=x=0:y=0:w={b}:h={H}:c=black:t=fill,drawbox=x={W-b}:y=0:w={b}:h={H}:c=black:t=fill'

def weave(a=3):
    return (f'scale={W+16}:{H+10},crop={W}:{H}:x=\'8+{a}*sin(7*{P})+1.5*sin(13*{P})\':y=\'5+{a*.7}*sin(11*{P})\'')

def flicker(a=.035):
    return f"eq=brightness='{a}*sin(23*{P})+{a*.6}*sin(37*{P})':eval=frame"

def halation(color, sigma=14, thresh=200, mix='screen', opacity=.85):
    """split off the highlights, blur them and add them back tinted (film halation / flare)"""
    rr, gg, bb = color
    return ('format=gbrp,split[a][h];[h]lutrgb=r=\'if(gt(val,%d),val,0)\':g=\'if(gt(val,%d),val,0)\':b=\'if(gt(val,%d),val,0)\','
            'gblur=sigma=%s,colorchannelmixer=rr=%s:rg=%s:rb=%s:gr=%s:gg=%s:gb=%s:br=%s:bg=%s:bb=%s,format=gbrp[h2];'
            '[a][h2]blend=all_mode=%s:all_opacity=%s') % (thresh, thresh, thresh, sigma,
            rr, rr, rr, gg, gg, gg, bb, bb, bb, mix, opacity)

LOOKS = {
 'F09': ('Bleach bypass', 'hydraulic-erosion', 3,
  'format=gbrp,split[c][l];[l]hue=s=0,format=gbrp[l2];[c][l2]blend=all_mode=overlay:all_opacity=.5,eq=contrast=1.16:saturation=.58:gamma=1.04,'
  "curves=all='0/0 .25/.21 .7/.78 1/.98'," + grain(10)),
 'F10': ('Teal and orange', 'golden-figure', 4,
  'colorbalance=rs=-.18:gs=.02:bs=.22:rm=.06:bm=-.08:rh=.16:gh=.04:bh=-.2,eq=contrast=1.12:saturation=1.25,'
  "curves=all='0/.02 .5/.5 1/.97'," + grain(5)),
 'F11': ('Kodachrome slide', 'pigment-bloom', 3,
  "eq=contrast=1.22:saturation=1.35:gamma=.96,colorbalance=rs=.04:bs=-.06:rm=.07:gm=.01:bm=-.08:rh=.03:bh=-.04,"
  "curves=r='0/0 .5/.54 1/1':b='0/.03 .5/.45 1/.95',vignette=PI/5," + grain(6)),
 'F12': ('Cross-processed', 'paper-bird', 3,
  "curves=r='0/0 .25/.18 .75/.86 1/1':g='0/.02 .25/.29 .75/.84 1/.97':b='0/.2 .5/.47 1/.86',eq=contrast=1.12:saturation=1.3," + grain(7)),
 'F13': ('Super 8 home movie', 'sketchbook-horse', 3,
  weave(4) + ",gblur=sigma=1.1,curves=r='0/.06 .5/.58 1/.96':g='0/.04 .5/.52 1/.92':b='0/.08 .5/.42 1/.8',"
  "eq=saturation=1.15," + flicker(.04) + ',' + grain(26) + ",vignette=PI/3.2," + pillar(600)),
 'F14': ('Pushed black-and-white', 'smoke-plume', 3,
  "hue=s=0,curves=all='0/0 .2/.06 .55/.62 .85/.97 1/1',eq=contrast=1.12," + grain(24) + ',vignette=PI/4.5'),
 'F15': ('Day for night', 'hydraulic-erosion', 7,
  "eq=brightness=-.06:gamma=.62:saturation=.38:contrast=1.15,colorbalance=rs=-.12:gs=-.02:bs=.2:rm=-.1:bm=.16:rh=-.08:bh=.12,"
  "curves=all='0/0 .6/.42 1/.78',vignette=PI/3.4," + grain(6)),
 'F16': ('Two-strip Technicolor', 'soap-film', 3,
  'colorchannelmixer=rr=.92:rg=.08:gr=.22:gg=.78:br=.12:bg=.72:bb=.16,eq=saturation=1.4:contrast=1.08,'
  "curves=r='0/0 .5/.55 1/1'," + grain(6)),
 'F17': ('Infrared false colour', 'embroidery', 6,
  'colorchannelmixer=rr=.12:rg=.95:gr=.85:gg=.12:bb=.95:bg=.08,eq=saturation=1.45:contrast=1.08,'
  "curves=b='0/.04 1/1'," + grain(7)),
 'F18': ('Tungsten halation', 'jellyfish', 2,
  'colortemperature=temperature=3600:mix=.6,eq=contrast=1.08:saturation=1.1,' + halation((1, .28, .12), 12, 185, 'screen', .9) + ',' + grain(9)),
 'F19': ('Silent-era tint', 'lissajous-drawing', 3,
  "hue=s=0,curves=all='0/.04 .5/.5 1/.9',colorchannelmixer=rr=1.05:rg=0:gr=.0:gg=.82:bb=.52," + weave(2) + ',' + flicker(.06) + ','
  + grain(22) + ",vignette=PI/2.6,drawbox=x='mod(t*523\\,1)*iw':y=0:w=1:h=ih:c=white@.35:t=fill,"
  "drawbox=x='mod(t*331+.37\\,1)*iw':y=0:w=1:h=ih:c=black@.4:t=fill," + pillar(600)),
 'F20': ('VHS camcorder', 'ferrofluid', 3,
  f'scale=320:200,scale={W}:{H}:flags=bilinear,chromashift=cbh=5:crh=-5,eq=saturation=1.35:contrast=1.05:brightness=.03,'
  + grain(14) + ',drawgrid=w=iw:h=3:t=1:c=black@.22,'
  f"drawbox=x=0:y='mod(t*90\\,ih+40)-40':w=iw:h=14:c=white@.18:t=fill,"
  f"drawtext=fontfile={FONT}:text='PLAY  SP':x=w-150:y=64:fontsize=22:fontcolor=white@.9:shadowx=2:shadowy=2,"
  f"drawtext=fontfile={FONT}:text='JUN 14 1994':x=w-170:y=h-44:fontsize=20:fontcolor=white@.9:shadowx=2:shadowy=2"),
 'F21': ('Anamorphic scope', 'lion-phoenix', 1,
  'colorbalance=bs=.08:bm=.04:rh=.05,eq=contrast=1.1:saturation=1.05,' + halation((.25, .55, 1), '60:sigmaV=1.2', 205, 'screen', 1)
  + ',drawbox=x=0:y=0:w=iw:h=74:c=black:t=fill,drawbox=x=0:y=ih-74:w=iw:h=74:c=black:t=fill,' + grain(5)),
 'F22': ('Faded seventies print', 'sand-drawing', 3,
  "curves=r='0/.12 .5/.56 1/.93':g='0/.09 .5/.5 1/.88':b='0/.14 .5/.43 1/.76',eq=saturation=.78,colorbalance=rm=.04:gm=-.03:bm=.02," + grain(12)),
 'F23': ('Muted cine stock', 'pigment-bloom', 8,
  "eq=contrast=.86:saturation=.66,colorbalance=rs=-.04:gs=.03:bs=.03:rh=.02:gh=.01,curves=all='0/.05 .5/.5 .85/.86 1/.94'," + grain(5)),
 'F24': ('Neon noir split-tone', 'swan-construction', 2,
  'colorbalance=rs=-.12:gs=-.04:bs=.28:rm=.05:bm=.12:rh=.22:gh=-.12:bh=.16,eq=contrast=1.22:saturation=1.35,'
  + halation((1, .2, .7), 10, 170, 'screen', .7) + ',vignette=PI/3.6,' + grain(6)),
}

def src_path(name):
    for n in (f'{name}-720.mp4', f'{name}.mp4'):
        p = os.path.join(SRC, n)
        if os.path.exists(p):
            return p
    raise SystemExit('missing source ' + name)

def render(code):
    title, src, start, grade = LOOKS[code]
    os.makedirs(OUT, exist_ok=True)
    out = os.path.join(OUT, code.lower())
    label = f"drawtext=fontfile={FONT}:fontsize=15:fontcolor=white@.92:box=1:boxcolor=black@.45:boxborderw=7:y=18"
    D2 = f"{W}*(.5-.4*cos({P}))"
    fc = (
     f"[0:v]trim={start}:{start + D + 1},setpts=PTS-STARTPTS,fps={FPS},"
     f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},format=gbrp,split[m0][h0];"
     f"[m0]trim=1:{D + 1},setpts=PTS-STARTPTS[m];[h0]trim=0:1,setpts=PTS-STARTPTS[hd];"
     f"[m][hd]xfade=transition=fade:duration=1:offset={D - 1},format=gbrp,split=3[o][g][gp];"
     f"[g]{grade},format=gbrp,split[gr][gpost];"
     f"[gpost]trim=start_frame=0:end_frame=1[post];[gp]nullsink;"
     f"[o]{label}:x=18:text='SOURCE'[ol];"
     f"[gr]{label}:x=w-tw-18:text='{code} · {title.upper()}'[gl];"
     f"color=black:s={W}x{H}:r={FPS}:d={D},format=gbrp[mk0];color=white:s={W}x{H}:r={FPS}:d={D},format=gbrp[wh];"
     f"[mk0][wh]overlay=x='{D2}':y=0:eval=frame:format=gbrp,format=gbrp[mk];"
     f"[ol][gl][mk]maskedmerge,format=gbrp[mx];color=white@1:s=2x{H}:r={FPS}:d={D}[ln];"
     f"[mx][ln]overlay=x='{D2}-1':y=0:eval=frame,trim=duration={D},format=yuv420p,split[v1][v2]"
    )
    cmd = ['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', src_path(src), '-filter_complex', fc,
           '-map', '[v1]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-maxrate', '760k', '-bufsize', '1500k', '-profile:v', 'high',
           '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out + '.mp4',
           '-map', '[v2]', '-an', '-c:v', 'libvpx-vp9', '-b:v', '620k', '-maxrate', '760k', '-crf', '42', '-row-mt', '1', '-deadline', 'good',
           '-cpu-used', '2', out + '.webm',
           '-map', '[post]', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '78', out + '.webp']
    subprocess.run(cmd, check=True)
    sizes = [os.path.getsize(out + e) for e in ('.mp4', '.webm', '.webp')]
    print(code, title, sizes)

if __name__ == '__main__':
    todo = sys.argv[1].split(',') if len(sys.argv) > 1 else list(LOOKS)
    for c in todo:
        render(c)
