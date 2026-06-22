#!/usr/bin/env python3
"""Import 162 prompts + images into skill-gallery project.

- Converts PNG images to WebP and places them in public/images/
- Appends cases to public/skills/gpt-image-2-style-library/references/cases-*.md
- Updates name-registry.md with 162 new entries
- Appends 162 records to data/skills.json
"""
import json
import os
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    os.system(f"{sys.executable} -m pip install Pillow -q")
    from PIL import Image

NL = chr(10)

# Paths
PROJECT = Path('/Users/arno/Documents/project/skill-gallery/skill-gallery')
SRC_REPO = Path('/Users/arno/Documents/project/gpt_image_2_skill')
IMG_SRC = PROJECT / '160图片'
IMG_DST = PROJECT / 'public' / 'images'
SKILL_REFS = PROJECT / 'public' / 'skills' / 'gpt-image-2-style-library' / 'references'
SKILL_MD = PROJECT / 'public' / 'skills' / 'gpt-image-2-style-library' / 'SKILL.md'
SKILLS_JSON = PROJECT / 'data' / 'skills.json'

PROMPTS_MD = SRC_REPO / 'all-prompts.md'
NAME_MAP_MD = SRC_REPO / 'name-mapping.md'

# Category -> (cases file slug, style, scene)
# Maps source gallery category to target taxonomy
CAT_MAP = {
    'Anime & Manga': ('illustration', 'Illustration', 'Creative'),
    'Gaming': ('illustration', 'Illustration', 'Creative'),
    'Retro & Cyberpunk': ('illustration', 'Illustration', 'Creative'),
    'Cinematic & Animation': ('scenes', 'Scenes', 'Story'),
    'Character Design': ('characters', 'Character', 'Creative'),
    'Typography & Posters': ('posters', 'Poster', 'Creative'),
    'Illustration': ('illustration', 'Illustration', 'Creative'),
    'Watercolor': ('illustration', 'Illustration', 'Creative'),
    'Ink & Chinese': ('illustration', 'Illustration', 'History'),
    'Pixel Art': ('illustration', 'Illustration', 'Creative'),
    'Isometric': ('illustration', 'Illustration', 'Creative'),
    'Product & Food': ('products', 'Product', 'Commerce'),
    'Brand Systems & Identity': ('brand', 'Brand', 'Commerce'),
    'Photography': ('photography', 'Photography', 'Creative'),
    'Screen Photography': ('photography', 'Photography', 'Tech'),
    'Infographics & Field Guides': ('charts', 'Infographic', 'Education'),
    'Research Paper Figures': ('charts', 'Charts', 'Tech'),
    'Official OpenAI Cookbook Examples': ('other', 'Other Use Cases', 'Education'),
    'Edit Endpoint Showcase': ('other', 'Other Use Cases', 'Creative'),
    'UI/UX Mockups': ('ui', 'UI', 'Tech'),
    'Data Visualization': ('charts', 'Charts', 'Education'),
    'Technical Illustration': ('charts', 'Infographic', 'Tech'),
    'Architecture & Interior': ('architecture', 'Architecture', 'Commerce'),
    'Scientific & Educational': ('charts', 'Infographic', 'Education'),
    'Fashion Editorial': ('photography', 'Photography', 'Fashion'),
    'Fine Art Painting': ('illustration', 'Illustration', 'Creative'),
    'More Illustration Styles': ('illustration', 'Illustration', 'Creative'),
    'Cinematic Film References': ('scenes', 'Scenes', 'Story'),
    'Beauty & Lifestyle': ('photography', 'Photography', 'Commerce'),
    'Events & Experience': ('other', 'Other Use Cases', 'Travel'),
    'Tattoo Design': ('illustration', 'Illustration', 'Creative'),
}

# Slug -> full category name (for skills.json)
SLUG_TO_CATEGORY = {
    'illustration': 'Illustration & Art',
    'scenes': 'Scenes & Storytelling',
    'characters': 'Characters & People',
    'posters': 'Posters & Typography',
    'products': 'Products & E-commerce',
    'brand': 'Brand & Logos',
    'photography': 'Photography & Realism',
    'charts': 'Charts & Infographics',
    'other': 'Other Use Cases',
    'ui': 'UI & Interfaces',
    'architecture': 'Architecture & Spaces',
    'history': 'History & Classical Themes',
    'documents': 'Documents & Publishing',
}

# Edit Endpoint cases need ref image
EDIT_ENDPOINT_NOS = {100, 101}


def parse_name_mapping():
    """Parse name-mapping.md to get {No -> Chinese name}.
    For No.100-101 (not in mapping), use image filename."""
    text = NAME_MAP_MD.read_text(encoding='utf-8')
    mapping = {}
    for line in text.split(NL):
        line = line.strip()
        if line.startswith('|') and not line.startswith('| No.') and not line.startswith('|--'):
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 4 and parts[1].isdigit():
                mapping[int(parts[1])] = parts[2]
    # Edit Endpoint names (from actual image filenames)
    mapping[100] = 'Chess board冬夜暴雪编辑版'
    mapping[101] = 'Tea poster地铁灯箱实景合成'
    return mapping


def parse_all_prompts():
    """Parse all-prompts.md, return list of dicts with:
    no, title, size, prompt, category (original gallery category)"""
    text = PROMPTS_MD.read_text(encoding='utf-8')
    entries = []
    current_category = None

    # Split by category headers and case headers
    lines = text.split(NL)
    i = 0
    while i < len(lines):
        line = lines[i]
        # Category header: ## 🎌 Anime & Manga
        m = re.match(r'^## [^a-zA-Z_]*(.+?)$', line)
        if m and line.startswith('## '):
            # Strip emoji prefix
            cat_line = re.sub(r'^## (?:[^\w\s]|_)+\s*', '', line).strip()
            current_category = cat_line
            i += 1
            continue
        # Case header: ### No. N · Title
        m = re.match(r'^### No\. (\d+) · (.+)$', line)
        if m:
            no = int(m.group(1))
            title = m.group(2).strip()
            # Next non-empty line should be size
            size = 'landscape'
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1
            if j < len(lines):
                size_m = re.search(r'尺寸: `(.+?)`', lines[j])
                if size_m:
                    size = size_m.group(1)
            # Find ```text ... ```
            prompt_lines = []
            in_code = False
            while j < len(lines):
                if lines[j].strip().startswith('```text'):
                    in_code = True
                    j += 1
                    continue
                if in_code and lines[j].strip() == '```':
                    break
                if in_code:
                    prompt_lines.append(lines[j])
                j += 1
            prompt = NL.join(prompt_lines).strip()
            entries.append({
                'no': no,
                'title': title,
                'size': size,
                'prompt': prompt,
                'category': current_category,
            })
            i = j + 1
            continue
        i += 1
    return entries


def size_to_aspect(size):
    mapping = {
        'landscape': '3:2',
        'portrait': '2:3',
        'square': '1:1',
        'wide': '16:9',
        'tall': '9:16',
        '1152x1536': '3:4',
        '2160x3840': '9:16',
        '2048x1152': '16:9',
    }
    return mapping.get(size, '1:1')


def desc_preview(prompt, max_len=50):
    """Generate short description for Index table."""
    d = prompt.replace(NL, ' ').strip()
    if len(d) > max_len:
        return d[:max_len - 3] + '...'
    return d


def convert_image(src_path, dst_path, quality=85):
    """Convert PNG to WebP."""
    img = Image.open(src_path)
    if img.mode == 'RGBA':
        # Keep alpha for webp
        img.save(dst_path, 'WEBP', quality=quality)
    else:
        img.convert('RGB').save(dst_path, 'WEBP', quality=quality)
    return dst_path.stat().st_size


def update_cases_file(file_path, new_entries):
    """Append new cases to existing cases-{slug}.md file.
    Updates Index table, INDEX_END_LINE marker, and Prompts section.
    Also updates header counts."""
    content = file_path.read_text(encoding='utf-8')
    lines = content.split(NL)

    # Find header count line: "> 📷 需要参考图: X | ✏️ 需要填写变量: Y | ✅ 可直接使用: Z"
    # Find Index section end: "<!-- INDEX_END_LINE: N -->"
    header_idx = None
    index_end_idx = None
    for i, line in enumerate(lines):
        if line.startswith('> 📷') and header_idx is None:
            header_idx = i
        if '<!-- INDEX_END_LINE:' in line:
            index_end_idx = i
            break

    if header_idx is None or index_end_idx is None:
        raise ValueError(f"Cannot find header/index markers in {file_path}")

    # Parse existing counts
    m = re.match(r'> 📷 需要参考图: (\d+) \| ✏️ 需要填写变量: (\d+) \| ✅ 可直接使用: (\d+)', lines[header_idx])
    ref_cnt, var_cnt, direct_cnt = int(m.group(1)), int(m.group(2)), int(m.group(3))

    # Count new entries by type
    new_ref = sum(1 for e in new_entries if e.get('input_type') == 'ref')
    new_direct = sum(1 for e in new_entries if e.get('input_type') == 'direct')
    ref_cnt += new_ref
    direct_cnt += new_direct

    # Update header — also update total count at top "# Category — N Cases"
    title_m = re.match(r'^# (.+?) — (\d+) Cases', lines[0])
    if title_m:
        old_count = int(title_m.group(2))
        new_count = old_count + len(new_entries)
        lines[0] = f"# {title_m.group(1)} — {new_count} Cases"

    lines[header_idx] = f"> 📷 需要参考图: {ref_cnt} | ✏️ 需要填写变量: {var_cnt} | ✅ 可直接使用: {direct_cnt}"

    # Build new Index rows
    new_index_rows = []
    for e in new_entries:
        input_cell = '📷 参考图片' if e['input_type'] == 'ref' else '✅'
        desc = desc_preview(e['prompt']).replace('|', '/')
        title = e['chinese_name'].replace('|', '/')
        new_index_rows.append(f"| {e['case_id']} | {title} | {desc} | {input_cell} |")

    # Insert index rows right before INDEX_END_LINE
    # Find the actual position: lines[index_end_idx] is "<!-- INDEX_END_LINE: N -->"
    # We need to insert new rows before the blank line + marker
    insert_pos = index_end_idx
    # Walk back past blank lines
    while insert_pos > 0 and lines[insert_pos - 1].strip() == '':
        insert_pos -= 1

    before = lines[:insert_pos]
    after = lines[insert_pos:]

    # New index end line number
    new_index_end = insert_pos + len(new_index_rows) + 1  # +1 for the blank line after
    # Update the marker
    for i, line in enumerate(after):
        if '<!-- INDEX_END_LINE:' in line:
            after[i] = f"<!-- INDEX_END_LINE: {new_index_end} -->"
            break

    # Assemble new Index part
    new_lines = before + new_index_rows + after

    # Now append new Case sections at the end of the file
    # Find last occurrence of "---" that's at the end (last case separator)
    content_new = NL.join(new_lines)

    # Append new cases
    case_blocks = []
    for e in new_entries:
        block = []
        block.append(f"### Case {e['case_id']}")
        block.append('')
        block.append(f"**{e['chinese_name']}**")
        if e['input_type'] == 'ref':
            block.append('Input: 📷 需要参考图 → 参考图片')
        else:
            block.append('Input: ✅ 可直接使用')
        block.append('')
        block.append('```')
        block.append(e['prompt'])
        block.append('```')
        block.append('')
        block.append('---')
        block.append('')
        case_blocks.append(NL.join(block))

    # Ensure trailing newline
    if not content_new.endswith(NL):
        content_new += NL
    content_new += NL.join(case_blocks)

    file_path.write_text(content_new, encoding='utf-8')


def main():
    print("Loading name mapping...")
    name_map = parse_name_mapping()
    print(f"  {len(name_map)} names loaded")

    print("Parsing all-prompts.md...")
    entries = parse_all_prompts()
    print(f"  {len(entries)} prompts parsed")

    if len(entries) != 162:
        print(f"WARNING: expected 162 entries, got {len(entries)}")

    # Assign skill IDs and case IDs
    # Existing: skill-001 ~ skill-401, Case 1-401
    # New: skill-402 ~ skill-563, Case 402-563
    for idx, e in enumerate(entries):
        new_num = 402 + idx
        e['skill_id'] = f'skill-{new_num:03d}'
        e['case_id'] = new_num
        e['chinese_name'] = name_map.get(e['no'], e['title'])
        e['input_type'] = 'ref' if e['no'] in EDIT_ENDPOINT_NOS else 'direct'
        slug, style, scene = CAT_MAP[e['category']]
        e['slug'] = slug
        e['style'] = style
        e['scene'] = scene
        e['category_full'] = SLUG_TO_CATEGORY[slug]

    # Convert images
    print(f"{NL}Converting images to WebP...")
    IMG_DST.mkdir(parents=True, exist_ok=True)
    missing = []
    for e in entries:
        src = IMG_SRC / f"{e['chinese_name']}.png"
        if not src.exists():
            missing.append(e['chinese_name'])
            continue
        dst = IMG_DST / f"{e['skill_id']}.webp"
        file_size = convert_image(src, dst)
        e['file_size'] = file_size

    if missing:
        print(f"  MISSING IMAGES ({len(missing)}):")
        for m in missing[:10]:
            print(f"    - {m}")
        if len(missing) > 10:
            print(f"    ... and {len(missing) - 10} more")
        print(f"{NL}Aborting. Please check image filenames.")
        return
    print(f"  {len(entries)} images converted")

    # Group by slug for cases-*.md update
    by_slug = {}
    for e in entries:
        by_slug.setdefault(e['slug'], []).append(e)

    # Update cases-*.md files
    print(f"{NL}Updating cases-*.md files...")
    for slug, slug_entries in by_slug.items():
        file_path = SKILL_REFS / f'cases-{slug}.md'
        update_cases_file(file_path, slug_entries)
        print(f"  cases-{slug}.md: +{len(slug_entries)} cases")

    # Update name-registry.md
    print(f"{NL}Updating name-registry.md...")
    registry_path = SKILL_REFS / 'name-registry.md'
    registry = registry_path.read_text(encoding='utf-8')
    # Parse existing lines (sorted)
    existing_lines = []
    header_lines = []
    for line in registry.split(NL):
        if line.startswith('#') or line.startswith('>') or not line.strip():
            header_lines.append(line)
        else:
            existing_lines.append(line)

    # Build new entries
    new_reg_lines = []
    for e in entries:
        new_reg_lines.append(f"{e['chinese_name']} | {e['case_id']} | cases-{e['slug']}.md")

    # Combine, sort alphabetically (preserving original structure)
    all_reg_lines = existing_lines + new_reg_lines
    all_reg_lines.sort()

    new_registry_content = NL.join(header_lines[:3]) + NL  # Keep title, blank, description
    # Re-generate clean header
    header = [
        f"# Name Registry — {len(all_reg_lines)} Prompt Names",
        '',
        '> 精准匹配：用户说出名称 → 在此表中查找 → 获取 Case ID 和文件位置 → 读取完整 prompt',
        '> 格式：名称 | Case ID | 文件',
        '',
    ]
    new_registry_content = NL.join(header + all_reg_lines) + NL

    registry_path.write_text(new_registry_content, encoding='utf-8')
    print(f"  Total names: {len(all_reg_lines)}")

    # Update skills.json
    print(f"{NL}Updating data/skills.json...")
    with open(SKILLS_JSON, 'r', encoding='utf-8') as f:
        skills = json.load(f)

    for e in entries:
        skills.append({
            'id': e['skill_id'],
            'title': e['chinese_name'],
            'image': f"/images/{e['skill_id']}.webp",
            'category': e['category_full'],
            'style': e['style'],
            'scene': e['scene'],
            'fileSize': e['file_size'],
            'downloads': 0,
        })

    with open(SKILLS_JSON, 'w', encoding='utf-8') as f:
        json.dump(skills, f, ensure_ascii=False, indent=2)
    print(f"  Total skills: {len(skills)}")

    # Update SKILL.md
    print(f"{NL}Updating SKILL.md...")
    skill_md = SKILL_MD.read_text(encoding='utf-8')
    # "398 Cases + 22 Templates" -> "560 Cases + 22 Templates"
    skill_md = skill_md.replace('398 Cases', f'{398 + 162} Cases')
    skill_md = skill_md.replace('398 real-world', f'{398 + 162} real-world')
    # Update category counts in File Map
    # e.g. "UI & Interfaces (68 cases)" -> "UI & Interfaces (73 cases)"
    count_changes = {
        'ui': 68 + len(by_slug.get('ui', [])),
        'posters': 66 + len(by_slug.get('posters', [])),
        'charts': 44 + len(by_slug.get('charts', [])),
        'photography': 43 + len(by_slug.get('photography', [])),
        'illustration': 34 + len(by_slug.get('illustration', [])),
        'other': 28 + len(by_slug.get('other', [])),
        'products': 28 + len(by_slug.get('products', [])),
        'brand': 21 + len(by_slug.get('brand', [])),
        'characters': 19 + len(by_slug.get('characters', [])),
        'history': 15 + len(by_slug.get('history', [])),
        'scenes': 13 + len(by_slug.get('scenes', [])),
        'architecture': 10 + len(by_slug.get('architecture', [])),
        'documents': 9 + len(by_slug.get('documents', [])),
    }
    old_counts = {
        'ui': 68, 'posters': 66, 'charts': 44, 'photography': 43,
        'illustration': 34, 'other': 28, 'products': 28, 'brand': 21,
        'characters': 19, 'history': 15, 'scenes': 13, 'architecture': 10,
        'documents': 9,
    }
    for slug, old in old_counts.items():
        new = count_changes[slug]
        if new != old:
            skill_md = skill_md.replace(f'({old} cases)', f'({new} cases)', 1)
    # 398 unique names -> 560 unique names
    skill_md = skill_md.replace('398 unique names', f'{398 + 162} unique names')

    SKILL_MD.write_text(skill_md, encoding='utf-8')
    print("  SKILL.md updated")

    # Summary
    print(f"{NL}{'='*50}")
    print(f"Done! Imported {len(entries)} prompts.")
    print(f"  Images: public/images/skill-402.webp ~ skill-{402+len(entries)-1:03d}.webp")
    print(f"  Cases updated across {len(by_slug)} files:")
    for slug in sorted(by_slug):
        print(f"    cases-{slug}.md: +{len(by_slug[slug])}")
    print(f"  skills.json: 401 -> {len(skills)}")
    print(f"  name-registry.md: 398 -> {len(all_reg_lines)}")


if __name__ == '__main__':
    main()
