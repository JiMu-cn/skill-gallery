#!/usr/bin/env python3
import json, re, argparse
from pathlib import Path
from collections import defaultdict

CATEGORY_SLUGS = {
    'UI & Interfaces': 'ui',
    'Posters & Typography': 'posters',
    'Charts & Infographics': 'charts',
    'Photography & Realism': 'photography',
    'Illustration & Art': 'illustration',
    'Other Use Cases': 'other',
    'Products & E-commerce': 'products',
    'Brand & Logos': 'brand',
    'Characters & People': 'characters',
    'History & Classical Themes': 'history',
    'Scenes & Storytelling': 'scenes',
    'Architecture & Spaces': 'architecture',
    'Documents & Publishing': 'documents',
}

REF_KW = [
    'reference image', 'input image', 'uploaded image', 'source image',
    'original image', 'base image', 'your photo', 'as reference',
    chr(21442)+chr(32771)+chr(22270), chr(36755)+chr(20837)+chr(22270),
    chr(19978)+chr(20256)+chr(22270), chr(21407)+chr(22270),
    chr(24213)+chr(22270), chr(20320)+chr(30340)+chr(29031)+chr(29255),
    chr(30495)+chr(20154)+chr(29031)+chr(29255),
]

REF_HINTS = {
    'face': chr(20154)+chr(33080)+chr(27491)+chr(38754)+chr(29031),
    'portrait': chr(20154)+chr(29289)+chr(21322)+chr(36523)+chr(29031),
    'full body': chr(20840)+chr(36523)+chr(29031),
    'full-body': chr(20840)+chr(36523)+chr(29031),
    'product': chr(20135)+chr(21697)+chr(22270),
    'logo': 'Logo '+chr(22270),
    'photo': chr(20154)+chr(29289)+chr(29031)+chr(29255),
    'character': chr(35282)+chr(33394)+chr(21442)+chr(32771)+chr(22270),
    'outfit': chr(26381)+chr(35013)+chr(21442)+chr(32771)+chr(22270),
    'style': chr(39118)+chr(26684)+chr(21442)+chr(32771)+chr(22270),
}


def detect_input(prompt):
    pl = prompt.lower()
    for kw in REF_KW:
        if kw.lower() in pl:
            hint = chr(21442)+chr(32771)+chr(22270)+chr(29255)
            for hk, hv in REF_HINTS.items():
                if hk in pl:
                    hint = hv
                    break
            return ('ref_image', hint)
    phs = list(set(re.findall(chr(92)+chr(91)+"([^"+chr(92)+chr(93)+"]{1,50})"+chr(92)+chr(93), prompt)))
    good = [p for p in phs if len(p) < 40 and chr(10) not in p]
    if good:
        return ('variables', good[:5])
    return ('direct', '')


def gen_desc(case):
    d = case.get('promptPreview', '').replace(chr(10), ' ').strip()
    return d[:47] + '...' if len(d) > 50 else d


def input_cell(itype, details):
    if itype == 'ref_image':
        return chr(128247) + ' ' + details
    elif itype == 'variables':
        s = ', '.join(v[:15] for v in details[:3])
        if len(details) > 3: s += '...'
        return chr(9999) + chr(65039) + ' ' + s
    return chr(9989)


def gen_file(cat, cases, out_dir):
    slug = CATEGORY_SLUGS[cat]
    path = out_dir / f'cases-{slug}.md'
    rc = vc = dc = 0
    data = []
    for c in cases:
        it, det = detect_input(c['prompt'])
        desc = gen_desc(c)
        if it == 'ref_image': rc += 1
        elif it == 'variables': vc += 1
        else: dc += 1
        data.append({'c': c, 'it': it, 'det': det, 'desc': desc})

    L = []
    L.append(f'# {cat} ' + chr(8212) + f' {len(cases)} Cases')
    L.append('')
    L.append(f'> {chr(128247)} '+chr(38656)+chr(35201)+chr(21442)+chr(32771)+chr(22270)+f': {rc} | {chr(9999)}{chr(65039)} '+chr(38656)+chr(35201)+chr(22635)+chr(20889)+chr(21464)+chr(37327)+f': {vc} | {chr(9989)} '+chr(21487)+chr(30452)+chr(25509)+chr(20351)+chr(29992)+f': {dc}')
    L.append('')
    L.append('## Index')
    L.append('')
    L.append('| ID | Title | Desc | Input |')
    L.append('|----|-------|------|-------|')
    for item in data:
        c = item['c']
        ic = input_cell(item['it'], item['det'])
        d = item['desc'][:50].replace('|', '/')
        t = c['title'].replace('|', '/')
        L.append(f"| {c['id']} | {t} | {d} | {ic} |")
    L.append('')
    idx_end = len(L)
    L.append(f'<!-- INDEX_END_LINE: {idx_end} -->')
    L.append('')
    L.append('---')
    L.append('')
    L.append('## Prompts')
    L.append('')
    for item in data:
        c = item['c']
        it = item['it']
        det = item['det']
        L.append(f"### Case {c['id']}")
        L.append('')
        L.append(f"**{c['title']}**")
        if it == 'ref_image':
            L.append(f'Input: {chr(128247)} '+chr(38656)+chr(35201)+chr(21442)+chr(32771)+chr(22270)+f' {chr(8594)} {det}')
        elif it == 'variables':
            vl = ', '.join(f'[{v}]' for v in det)
            L.append(f'Input: {chr(9999)}{chr(65039)} '+chr(38656)+chr(35201)+chr(22635)+chr(20889)+f' {chr(8594)} {vl}')
        else:
            L.append(f'Input: {chr(9989)} '+chr(21487)+chr(30452)+chr(25509)+chr(20351)+chr(29992))
        L.append('')
        L.append('```')
        L.append(c['prompt'])
        L.append('```')
        L.append('')
        L.append('---')
        L.append('')
    content = chr(10).join(L)
    path.write_text(content, encoding='utf-8')
    print(f'  {path.name}: {len(cases)} cases, {len(content)//1024} KB, idx line {idx_end}')


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--source', required=True)
    args = p.parse_args()
    src = Path(args.source)
    if not src.exists():
        print(f'Error: {src} not found')
        return
    out = Path(__file__).parent.parent / 'references'
    out.mkdir(parents=True, exist_ok=True)
    with open(src, 'r', encoding='utf-8') as f:
        data = json.load(f)
    cases = data['cases']
    print(f'Loaded {len(cases)} cases')
    groups = defaultdict(list)
    for c in cases:
        groups[c['category']].append(c)
    print(f'Generating {len(groups)} files:')
    for cat in sorted(groups):
        if cat not in CATEGORY_SLUGS:
            continue
        gen_file(cat, groups[cat], out)
    print('Done!')

if __name__ == '__main__':
    main()
