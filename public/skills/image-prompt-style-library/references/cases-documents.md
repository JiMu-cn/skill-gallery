# Documents & Publishing — 9 Cases

> 📷 需要参考图: 0 | ✏️ 需要填写变量: 7 | ✅ 可直接使用: 2

## Index

| ID | Title | Desc | Input |
|----|-------|------|-------|
| 303 | 人教版三年级语文课本内页 | [中文] 生成人教版小学三年级语文课本的一页 [English] Generate a pag... | ✏️ English, 中文 |
| 293 | 聚焦人工智能的校园日报 | [中文] 生成一张校园日报，主题AI教育 [English] Generate a campu... | ✏️ English, 中文 |
| 266 | 桌面上的黑色圆珠笔手写笔记 | [中文] 一张平放着的打开的笔记本的业余照片，里面填满了用黑色圆珠笔写的手写笔记。笔迹随意且略... | ✏️ English, 中文 |
| 232 | 兰亭集序书法帖意境图 | [中文] 结合王羲之的《兰亭集序》里的内容，生成一副书法帖图片，要求图片背景符合《兰亭集序》的... | ✏️ English, 中文 |
| 225 | 大师级真迹复刻 | [中文] 帮我生成xxxx真迹图片 [English] Help me generate xx... | ✏️ English, 中文 |
| 201 | 三甲医院真实门诊处方笺 | [中文] 一张三甲医院的门诊处方笺，医生潦草的手写字，包含真实合理的 诊断、药品名、剂量，右下... | ✏️ English, 中文 |
| 168 | 手写中西药方图片 | [中文] 生成一张手写中/西医药方图 [English] Generate an image ... | ✏️ English, 中文 |
| 119 | 主题海报版式设计 | {   "type": "anime movie production pitch docum... | ✅ |
| 13 | 信息图可视化设计 | A realistic photo of a Chinese high school math... | ✅ |

<!-- INDEX_END_LINE: 18 -->

---

## Prompts

### Case 303

**人教版三年级语文课本内页**
Input: ✏️ 需要填写 → [English], [中文]

```
[中文]
生成人教版小学三年级语文课本的一页

[English]
Generate a page from the PEP (People's Education Press) primary school third-grade Chinese textbook
```

---

### Case 293

**聚焦人工智能的校园日报**
Input: ✏️ 需要填写 → [English], [中文]

```
[中文]
生成一张校园日报，主题AI教育

[English]
Generate a campus daily newspaper, theme AI education
```

---

### Case 266

**桌面上的黑色圆珠笔手写笔记**
Input: ✏️ 需要填写 → [English], [中文]

```
[中文]
一张平放着的打开的笔记本的业余照片，里面填满了用黑色圆珠笔写的手写笔记。笔迹随意且略显凌乱，就像个人笔记，自然的瑕疵，划掉的单词，划线的标题。从略高角度拍摄，来自窗户的自然日光，未使用闪光灯。随意的桌面设置，用 iPhone 拍摄。

[English]
Amateur photo of an open notebook lying flat, filled with handwritten notes in black ballpoint pen. The handwriting is casual and slightly messy, like personnal notes, natural imperfections, crossed out words, underlined headings. Shot from slightly above, natural daylight from a window, no flash. Casual desk setting, shot on iPhone
```

---

### Case 232

**兰亭集序书法帖意境图**
Input: ✏️ 需要填写 → [English], [中文]

```
[中文]
结合王羲之的《兰亭集序》里的内容，生成一副书法帖图片，要求图片背景符合《兰亭集序》的意境，背景图可以使用蒙版，前景是《兰亭集序》

[English]
Combining the content from Wang Xizhi's "Lantingji Xu", generate a calligraphy copy image, requiring the image background to match the artistic conception of "Lantingji Xu", the background image can use a mask, the foreground is "Lantingji Xu"
```

---

### Case 225

**大师级真迹复刻**
Input: ✏️ 需要填写 → [English], [中文]

```
[中文]
帮我生成xxxx真迹图片

[English]
Help me generate xxxx authentic picture
```

---

### Case 201

**三甲医院真实门诊处方笺**
Input: ✏️ 需要填写 → [English], [中文]

```
[中文]
一张三甲医院的门诊处方笺，医生潦草的手写字，包含真实合理的 诊断、药品名、剂量，右下角有医生签名和科室章。

[English]
An outpatient prescription sheet from a Grade 3A hospital, doctor's illegible handwriting, containing realistic and reasonable diagnosis, drug names, dosages, with a doctor's signature and department stamp in the bottom right corner.
```

---

### Case 168

**手写中西药方图片**
Input: ✏️ 需要填写 → [English], [中文]

```
[中文]
生成一张手写中/西医药方图

[English]
Generate an image of a handwritten traditional Chinese medicine or Western medicine prescription
```

---

### Case 119

**主题海报版式设计**
Input: ✅ 可直接使用

```
{
  "type": "anime movie production pitch document",
  "overall_layout": "split layout with a large cinematic movie poster on the top half and a grid of 5 detailed reference sheets on the bottom half",
  "top_section": {
    "type": "movie poster",
    "visual": "A man, a woman, and a dog standing on a ruined city street, facing away from the viewer, looking towards a colossal, porous, web-like alien structure dominating the sky. A rusty 'RESTRICTED AREA' sign is on the right.",
    "typography": {
      "title": "{argument name=\"movie title\" default=\"劇場版 巨骸の向こう側 Fallen Colossus\"}",
      "release_date": "{argument name=\"release date\" default=\"2027.11.28 ROADSHOW\"}",
      "tagline": "そこにあるのは、まだ「説明」されていないもの。",
      "credits_studio": "{argument name=\"studio name\" default=\"WIT STUDIO\"}"
    }
  },
  "bottom_sections": [
    {
      "title": "{argument name=\"male character name\" default=\"来栖 武 / Kurusu Takeru\"}",
      "type": "character reference sheet",
      "elements": {
        "full_body_poses": 3,
        "expressions": 3,
        "detail_shots": 8,
        "description": "Male protagonist in dark tactical jacket and cargo pants. Includes front, back, and side full-body views, headshots, and detailed callouts for gloves, boots, backpack, and radio."
      }
    },
    {
      "title": "{argument name=\"female character name\" default=\"大城 真那 / Oshiro Mana\"}",
      "type": "character reference sheet",
      "elements": {
        "full_body_poses": 3,
        "expressions": 3,
        "detail_shots": 6,
        "description": "Female protagonist in grey tactical uniform. Includes front, back, and side full-body views, headshots, and detailed callouts for jacket, boots, ID badge, and pouch."
      }
    },
    {
      "title": "カゲ (Kage) 設定画",
      "type": "animal character reference sheet",
      "elements": {
        "full_body_poses": 4,
        "expressions": 4,
        "detail_shots": 5,
        "description": "Dog companion. Includes side, front, back, and angled full-body views, headshots, and detailed callouts for fur texture, paws, and a motorcycle sidecar."
      }
    },
    {
      "title": "第7巨骸 (Remnant-7) 内部区画 設定画",
      "type": "environment and vehicle reference sheet",
      "elements": {
        "large_diagrams": 1,
        "environment_thumbnails": 4,
        "vehicle_designs": 1,
        "description": "Cross-section of the porous alien structure, smaller environment thumbnails, and a motorcycle design featuring the characters."
      }
    },
    {
      "title": "Concept Art",
      "type": "scene illustration",
      "elements": {
        "characters": 3,
        "vehicles": 1,
        "description": "The male character, female character, and dog with a motorcycle sidecar parked in front of the glowing, porous alien structure."
      }
    }
  ]
}
```

---

### Case 13

**信息图可视化设计**
Input: ✅ 可直接使用

```
A realistic photo of a Chinese high school math exam paper, printed inblack and white on slightly gray paper, titled “数学试卷”, with multiplechoice questions and math formulas, including a small 3D geometrycube diagram. The paper is photographed casually with asmartphone, slightly tilted, with uneven lighting, soft shadows, andminor blur. The text is in Chinese with a mix of bold title font andstandard serif body font. Realistic paper texture, exam layout,authentic classroom test sheet style.
```

---
