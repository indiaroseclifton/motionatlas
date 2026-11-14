"""Widen the icon library: bigger Lucide and Tabler sets, and more families.

Runs after tools/icons.py and reuses its helpers. For each family below it downloads the pinned
npm package tarball once, reads the SVG files straight out of the archive (nothing is unpacked to
disk or executed), cleans them and writes the same outputs as icons.py:

    site/icons/sets/<family>.json      manifest: [{n, k, s}]
    site/icons/packs/<family>.zip      every icon + LICENSE.txt + README.txt + icons.json
    site/icons/index.json              the family is added or replaced in place
    site/icons/LICENSES-more.txt       licence blocks for the families added here

    python3 -I tools/icons-more.py [--cache DIR] [--site site] [family ...]
"""
import argparse, importlib.util, io, json, os, re, sys, tarfile, time

sys.dont_write_bytecode = True

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('icons_base', os.path.join(HERE, 'icons.py'))
B = importlib.util.module_from_spec(spec)
spec.loader.exec_module(B)

REG = 'https://registry.npmjs.org/'
SPECIMENS = ['bell', 'bookmark-simple', 'calendar-blank', 'check-circle', 'folder', 'gear', 'heart', 'house', 'magnifying-glass', 'plus', 'squares-four', 'upload-simple', 'user']
# id: (title, description, npm package, pinned version, licence, homepage, target, file filter, name from path, note)
FAMS = {
    'lucide': ('Lucide / Outline', 'Consistent 24 px linework and open shapes.', 'lucide-static', '1.59.0', 'ISC',
               'https://lucide.dev', 1500, r'^package/icons/([\w-]+)\.svg$', ''),
    'tabler': ('Tabler / Outline', 'Clear geometric outlines on a 24 px grid.', '@tabler/icons', '3.49.0', 'MIT',
               'https://tabler.io/icons', 1800, r'^package/icons/outline/([\w-]+)\.svg$', ''),
    'tabler-filled': ('Tabler / Filled', 'Solid counterparts of the Tabler outlines.', '@tabler/icons', '3.49.0', 'MIT',
                      'https://tabler.io/icons', 900, r'^package/icons/filled/([\w-]+)\.svg$', ''),
    'iconoir': ('Iconoir / Outline', 'Light, friendly 1.5 px strokes with rounded joins.', 'iconoir', '7.12.2', 'MIT',
                'https://iconoir.com', 1700, r'^package/icons/regular/([\w-]+)\.svg$', ''),
    'iconoir-solid': ('Iconoir / Solid', 'Filled forms from the Iconoir family.', 'iconoir', '7.12.2', 'MIT',
                      'https://iconoir.com', 400, r'^package/icons/solid/([\w-]+)\.svg$', ''),
    'bootstrap': ('Bootstrap Icons / Outline', 'Sturdy 16 px outlines that stay clear at small sizes.', 'bootstrap-icons',
                  '1.13.2', 'MIT', 'https://icons.getbootstrap.com', 1300, r'^package/icons/((?!.*-fill)[\w-]+)\.svg$', ''),
    'bootstrap-fill': ('Bootstrap Icons / Filled', 'The filled half of Bootstrap Icons.', 'bootstrap-icons', '1.13.2',
                       'MIT', 'https://icons.getbootstrap.com', 700, r'^package/icons/([\w-]+-fill)\.svg$', ''),
}
ORDER_AFTER = {'tabler-filled': 'tabler', 'iconoir': 'tabler-filled', 'iconoir-solid': 'iconoir', 'bootstrap': 'iconoir-solid',
               'bootstrap-fill': 'bootstrap'}


def tarball(fx, pkg, ver):
    meta = json.loads(fx.get(f'{REG}{pkg.replace("/", "%2F")}/{ver}'))
    return fx.get(meta['dist']['tarball']), meta.get('license', '')


def paint(svg):
    """Icons with no fill or stroke on the root draw in black; make them follow the text colour."""
    root = re.match(r'<svg[^>]*>', svg).group(0)
    if 'fill=' not in root and 'stroke=' not in root:
        svg = svg.replace(root, root[:-1] + ' fill="currentColor">', 1)
    return re.sub(r'(fill|stroke)="(#000|#000000|black)"', r'\1="currentColor"', svg)


def build(fx, fid):
    title, desc, pkg, ver, lic, home, target, pat, note = FAMS[fid]
    data, _ = tarball(fx, pkg, ver)
    files, licence, tags = {}, '', {}
    with tarfile.open(fileobj=io.BytesIO(data), mode='r:gz') as tf:
        for m in tf:
            if not m.isfile():
                continue
            mm = re.match(pat, m.name)
            if mm and m.size < 40000:
                files[mm.group(1)] = tf.extractfile(m).read()
            elif re.match(r'^package/(LICENSE|LICENCE|license)(\.md|\.txt)?$', m.name) and not licence:
                licence = tf.extractfile(m).read().decode('utf-8', 'replace')
            elif m.name == 'package/tags.json' and fid == 'lucide':
                tags = json.loads(tf.extractfile(m).read())
            elif m.name == 'package/icons.json' and fid.startswith('tabler'):
                meta = json.loads(tf.extractfile(m).read())
                tags = {n: [str(t) for t in v.get('tags', [])] + [v.get('category', '')] for n, v in meta.items()}
    names = sorted(files)
    rank = (lambda n: (n.startswith('brand-'),) + B.simple_rank(n)) if fid.startswith('tabler') else B.simple_rank
    chosen = B.pick(names, tags, B.concepts(), rank, target)
    out = []
    for n, k in chosen:
        s = paint(B.clean_svg(files[n]))
        if '<script' in s.lower() or len(s) > 12000:
            continue
        out.append((n, k, s))
    return out, licence or f'{lic} licence. See {home}', (title, desc, pkg, ver, lic, home, note)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--cache', default='/tmp/icon-cache')
    ap.add_argument('--site', default=os.path.join(HERE, '..', 'site'))
    ap.add_argument('families', nargs='*')
    a = ap.parse_args()
    icons = os.path.join(os.path.abspath(a.site), 'icons')
    fx = B.Fetcher(a.cache)
    index = json.load(open(os.path.join(icons, 'index.json')))
    fams = index['families']
    blocks = []
    for fid in (a.families or list(FAMS)):
        data, licence, (title, desc, pkg, ver, lic, home, note) = build(fx, fid)
        src, pkg_url = f'{pkg}@{ver}', f'https://www.npmjs.com/package/{pkg}/v/{ver}'
        items = [{'n': n, 'k': ' '.join(k), 's': s} for n, k, s in data]
        man = {'id': fid, 'title': title, 'format': 'svg', 'source': src, 'version': ver, 'licence': lic, 'count': len(items), 'icons': items}
        json.dump(man, open(os.path.join(icons, 'sets', fid + '.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
        readme = (f'{title}\n{"=" * len(title)}\n\n{len(items)} SVG icons.\nSource: {src} ({pkg_url})\nProject: {home}\n'
                  f'Licence: {lic} (see LICENSE.txt)\n' + (f'\n{note}\n' if note else '') +
                  '\nBuilt by tools/icons-more.py for the Visual & Motion Atlas. The SVGs use currentColor, so they take the\n'
                  'text colour they sit in.\n')
        names_json = json.dumps([{'name': i['n'], 'keywords': i['k']} for i in items], ensure_ascii=False, indent=1)
        z = B.zip_bytes([(f'{fid}/svg/{n}.svg', s + '\n') for n, _, s in data] +
                        [(f'{fid}/LICENSE.txt', licence), (f'{fid}/README.txt', readme), (f'{fid}/icons.json', names_json)])
        open(os.path.join(icons, 'packs', fid + '.zip'), 'wb').write(z)
        # pages draw a few named specimens from icons/<family>/ (house, gear, heart...), so each family gets them
        spec = os.path.join(icons, fid)
        os.makedirs(spec, exist_ok=True)
        for want in SPECIMENS:
            if os.path.exists(os.path.join(spec, want + '.svg')):
                continue
            words = want.split('-')
            hit = next((s_ for n, k, s_ in data if n == want), None) or next((s_ for n, k, s_ in data if all(w in k for w in words)), None) \
                or next((s_ for n, k, s_ in data if words[0] in k), None) or data[0][2]
            open(os.path.join(spec, want + '.svg'), 'w').write(hit + '\n')
        entry = {'id': fid, 'title': title, 'description': desc, 'format': 'svg', 'count': len(items), 'licence': lic,
                 'source': src, 'version': ver, 'package': pkg_url, 'home': home, 'manifest': f'icons/sets/{fid}.json',
                 'pack': f'icons/packs/{fid}.zip', 'packBytes': len(z), 'monochrome': True,
                 'card': f'icons/{fid}/house.svg', 'specimens': f'icons/{fid}/'}
        old = next((f for f in fams if f['id'] == fid), None)
        if old:
            for k in ('specimens', 'specimenPack', 'card'):
                if k in old:
                    entry[k] = old[k]
            fams[fams.index(old)] = entry
        else:
            after = ORDER_AFTER.get(fid)
            at = next((i for i, f in enumerate(fams) if f['id'] == after), len(fams) - 1) + 1 if after else len(fams)
            fams.insert(at, entry)
        blocks.append(f'{title}\n{"-" * len(title)}\nSource: {src}\nProject: {home}\nLicence: {lic}\n' + (note + '\n' if note else '') + '\n' + licence.strip() + '\n')
        B.log(f'{fid}: {len(items)} icons, pack {len(z) // 1024} KB')
    index['generated'] = time.strftime('%Y-%m-%d')
    json.dump(index, open(os.path.join(icons, 'index.json'), 'w'), ensure_ascii=False, indent=1)
    if not a.families:
        open(os.path.join(icons, 'LICENSES-more.txt'), 'w').write(
            'Licences for the icon families added by tools/icons-more.py\n' + '=' * 60 + '\n\n' + '\n\n'.join(blocks))
    B.log('total', sum(f['count'] for f in fams), 'icons in', len(fams), 'families')


if __name__ == '__main__':
    main()
