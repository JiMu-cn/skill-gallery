import json

with open('/Users/arno/Documents/project/skill-gallery/skill-gallery/data/skills.json', 'r') as f:
    skills = json.load(f)

RULES = [
    # UI & Interfaces
    (["缩略图", "直播", "首页", "样机", "Instagram", "YouTube", "频道", "封面图"], "UI & Interfaces", "UI", "Social"),
    # Charts & Infographics
    (["网格", "百科", "图解", "流程图", "思维导图", "关系图", "分析图"], "Charts & Infographics", "Infographic", "Education"),
    # Illustration & Art
    (["漫画", "插画", "手绘", "色铅笔", "原画", "幻灯片"], "Illustration & Art", "Illustration", "Creative"),
    # Posters & Typography
    (["宣传", "演示文稿", "企划书"], "Posters & Typography", "Poster", "Commerce"),
    # Characters & People (keep as-is)
    (["角色", "Cosplay", "VTuber", "人物", "头像", "设定表", "皮肤", "卡哇伊", "卡牌"], "Characters & People", "Character", "Creative"),
    # Scenes & Storytelling
    (["场景", "咨询室", "实验"], "Scenes & Storytelling", "Scenes", "Story"),
    # 3D style
    (["3D", "3d", "渲染"], "Characters & People", "3D", "Creative"),
    # Products
    (["护肤品", "官网"], "Products & E-commerce", "Product", "Commerce"),
    # Other
    (["贴纸", "周边", "目录", "偶像"], "Other Use Cases", "Other Use Cases", "Commerce"),
]

changed = 0
for s in skills:
    if not (s['category'] == 'Characters & People' and s['style'] == 'Character' and s['scene'] == 'Creative'):
        continue

    title = s['title']
    for keywords, cat, style, scene in RULES:
        if any(kw in title for kw in keywords):
            if cat != 'Characters & People' or style != 'Character':
                s['category'] = cat
                s['style'] = style
                s['scene'] = scene
                changed += 1
            break

with open('/Users/arno/Documents/project/skill-gallery/skill-gallery/data/skills.json', 'w') as f:
    json.dump(skills, f, ensure_ascii=False, indent=2)

print(f"修正了 {changed} 条")

default = [s for s in skills if s['category'] == 'Characters & People' and s['style'] == 'Character' and s['scene'] == 'Creative']
print(f"仍为默认分类: {len(default)} 条")
for s in default:
    print(f"  {s['title']}")
