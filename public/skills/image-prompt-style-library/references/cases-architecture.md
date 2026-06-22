# Architecture & Spaces — 15 Cases

> 📷 需要参考图: 1 | ✏️ 需要填写变量: 4 | ✅ 可直接使用: 10

## Index

| ID | Title | Desc | Input |
|----|-------|------|-------|
| 381 | 90 年代公寓场景参考板 | {   "type": "scene reference board — 90s apartm... | ✅ |
| 369 | 明洞旅游区域地图 | [エリア]の観光エリアマップを画像で作成して | ✏️ エリア |
| 331 | 西安手绘水彩城市地图 | 生成一张手绘水彩风格的「西安」城市地图，包含当地特色美食、地标建筑及城市特色 | ✅ |
| 328 | 俯拍巨女城景自拍 | [中文] {   "type": "图像生成提示词",   "language": "zh",... | 📷 人脸正面照 |
| 274 | 成都吃货暴走手绘美食地图 | [中文] 一张手绘风格的城市美食地图，以成都为主题。画面以鸟瞰视角的手绘简化城市地图为底，标注... | ✏️ English, 中文 |
| 211 | 天坛古建拆解全图 | [中文] 生成一个天坛的建筑拆解图，有详细的说明，中式美学风格 [English] Gener... | ✏️ English, 中文 |
| 50 | 建筑空间场景图 | A highly detailed, cinematic wide shot of a gra... | ✅ |
| 20 | 信息图可视化设计 | Create an explanatory slide ({argument name="fo... | ✅ |
| 18 | 信息图可视化设计 | {   "type": "illustrated map infographic",   "s... | ✏️ "美食地点", "地标景点", |
| 11 | 一张手绘风格的城市美食地图，以台州为主题 | 一张手绘风格的城市美食地图，以台州为主题。画面以鸟瞰视角的手绘简化城市地图为底，标注椒江、路桥... | ✅ |
| 518 | 日式极简客厅晨光渲染 | Render a serene Japanese minimalist living room... | ✅ |
| 519 | 粗野主义混凝土博物馆中庭 | Create a photorealistic interior render of a mo... | ✅ |
| 520 | 中世纪现代胡桃木创意办公室 | Render a sophisticated mid-century modern creat... | ✅ |
| 521 | 亲生物设计未来生物实验室 | Generate a high-end photorealistic render of a ... | ✅ |
| 522 | 哥特大教堂中殿肋拱内景 | Render a majestic Gothic cathedral interior in ... | ✅ |

<!-- INDEX_END_LINE: 24 -->

---

## Prompts

### Case 381

**90 年代公寓场景参考板**
Input: ✅ 可直接使用

```
{
  "type": "scene reference board — 90s apartment living room, cinematic night",
  "style": "cinematic film photography, 35mm grain, warm amber shadow fill, deep chiaroscuro lighting, hyper-detailed interior, production design reference quality",
  "layout": {
    "main_panel_center_left": {
      "label": "CAMERA A — FRONT VIEW",
      "scene": "Wide shot, L-shaped tan sectional sofa, grey knit throw blanket, wooden coffee table (remote, mug, ashtray, Rolling Stone stack), lava lamp left, table lamp right, rain-streaked city window behind, Nirvana poster left wall. 35mm grain."
    },
    "main_panel_center_right": {
      "label": "CAMERA B — REVERSE VIEW",
      "scene": "Wide reverse from behind sofa. CRT TV prominent right, grey static screen. Tall bookshelf, VHS tapes. Cool blue backlight from window behind camera. Deep shadow."
    },
    "prop_strip_bottom": "6 close-up tiles: 1. LAVA LAMP — chrome base, blue-green wax blobs; 2. COFFEE TABLE — remote, mug, ashtray, magazines; 3. NIRVANA POSTER — black smiley face, wall texture; 4. CRT TELEVISION — static screen, VHS stack; 5. WINDOW/RAIN — city bokeh, water streaks; 6. THROW BLANKET — sofa corner, worn upholstery",
    "top_right_inset": "SOURCE REF thumbnail — original photo",
    "footer": "2700K PRACTICAL · 4100K CITY NIGHT · 24mm · 35MM"
  },
  "background": "deep charcoal #1a1a1a, thin white separators",
  "dimensions": "wide landscape 3:1, high resolution"
}
```

---

### Case 369

**明洞旅游区域地图**
Input: ✏️ 需要填写 → [エリア]

```
[エリア]の観光エリアマップを画像で作成して
```

---

### Case 331

**西安手绘水彩城市地图**
Input: ✅ 可直接使用

```
生成一张手绘水彩风格的「西安」城市地图，包含当地特色美食、地标建筑及城市特色
```

---

### Case 328

**俯拍巨女城景自拍**
Input: 📷 需要参考图 → 人脸正面照

```
[中文]
{
  "type": "图像生成提示词",
  "language": "zh",
  "style": "超现实电影感自拍摄影",
  "aspect_ratio": "9:16",
  "identity_preservation": {
    "use_reference_image": true,
    "strict_identity_lock": true,
    "alter_face": false,
    "alter_skin": false,
    "alter_hair": false,
    "alter_gender": false,
    "notes": "保留上传参考图像中完全一致的脸部特征、皮肤纹理、头发、眼镜、年龄和性别。禁止合成皮肤或雕塑感。"
  },
  "subject": {
    "gender": "女性",
    "capture_method": "由主体本人拍摄的自拍",
    "pose": {
      "selfie_arm": {
        "description": "一只手臂完全伸直并完全向上伸展，手持拍摄自拍的相机",
        "visibility": "手臂在画面中清晰可见、笔直且占主导地位",
        "camera_visibility": "自拍相机设备本身不得在画面中出现"
      },
      "product_arm": {
        "description": "另一只手臂完全伸向相机，手持附带的佳能相机",
        "importance": "产品最靠近相机并在视觉上占主导地位"
      },
      "head": {
        "tilt": "头部向自拍相机微微倾斜"
      },
      "expression": "自然放松的面部表情"
    },
    "body_visibility": "从头到脚全身可见",
    "feet": "双脚清晰接触路面"
  },
  "composition": {
    "perspective": "胸部高度的自然自拍视角",
    "camera_angle": "极端俯拍角度，相机位于主体正上方并直视下方",
    "layer_depth": [
      "产品（最靠近相机）",
      "脸部",
      "全身",
      "城市环境（背景）"
    ]
  },
  "scale_and_perspective": {
    "effect": "强制透视",
    "subject_scale": "女性呈现极度巨大",
    "buildings_scale": "建筑物显得小得多，最高不超过她的膝盖",
    "dominance": "主体在视觉上完全主导整个场景",
    "realism": "激发规模感同时保持物理可信"
  },
  "environment": {
    "location": "真实城市十字路口",
    "elements": [
      "人行横道",
      "道路标线",
      "交通标志",
      "汽车",
      "自行车",
      "真实人类尺度的行人"
    ],
    "setting": "地面层城市环境"
  },
  "lighting": {
    "type": "自然日光",
    "conditions": "晴朗或轻度多云天空",
    "shadows": "柔和且真实",
    "restrictions": "禁止奇幻或戏剧性照明"
  },
  "product_rules": {
    "usage": "完全按提供的上传佳能产品使用",
    "distortion": "无",
    "logo": "保持不变",
    "appearance": "仅有自然反射和真实高光"
  },
  "camera_quality": {
    "realism": "最大照片真实感",
    "depth": "前景、主体与背景清晰分离",
    "artifacts": "无"
  },
  "constraints": [
    "禁止AI艺术感",
    "禁止塑料或雕塑皮肤",
    "禁止扭曲脸部或身体",
    "禁止多余肢体或错误解剖",
    "禁止文字或水印",
    "禁止可见自拍相机设备"
  ],
  "output_goal": "创作一张超现实电影感自拍图像：女性使用其确切参考身份，从极端俯拍视角在真实城市人行横道拍摄，具备强制透视比例、自然日光，并将佳能相机产品明显持向镜头。"
}

[English]
{
  "type": "image_generation_prompt",
  "language": "en",
  "style": "hyper-realistic cinematic selfie photography",
  "aspect_ratio": "9:16",
  "identity_preservation": {
    "use_reference_image": true,
    "strict_identity_lock": true,
    "alter_face": false,
    "alter_skin": false,
    "alter_hair": false,
    "alter_gender": false,
    "notes": "Preserve identical facial features, skin texture, hair, glasses, age, and gender from the uploaded reference image. No synthetic skin or sculptural look."
  },
  "subject": {
    "gender": "female",
    "capture_method": "selfie taken by the subject herself",
    "pose": {
      "selfie_arm": {
        "description": "one arm fully straight and completely extended upward holding the camera that takes the selfie",
        "visibility": "arm clearly visible, straight and dominant in frame",
        "camera_visibility": "the selfie camera device itself must NOT be visible in the frame"
      },
      "product_arm": {
        "description": "the other arm fully extended toward the camera holding the attached Canon camera",
        "importance": "product is closest to the camera and visually dominant"
      },
      "head": {
        "tilt": "slightly tilted toward the selfie camera"
      },
      "expression": "natural and relaxed facial expression"
    },
    "body_visibility": "full body visible from head to toe",
    "feet": "feet clearly touching the road surface"
  },
  "composition": {
    "perspective": "natural selfie perspective at chest height",
    "camera_angle": "extreme top-down angle, camera above the subject looking directly downward",
    "layer_depth": [
      "product (closest to camera)",
      "face",
      "full body",
      "city environment (background)"
    ]
  },
  "scale_and_perspective": {
    "effect": "forced perspective",
    "subject_scale": "the woman appears extremely giant",
    "buildings_scale": "buildings appear much smaller, reaching no higher than her knees",
    "dominance": "the subject visually dominates the entire scene",
    "realism": "inspiring scale while remaining physically believable"
  },
  "environment": {
    "location": "real urban intersection",
    "elements": [
      "pedestrian crosswalk",
      "road markings",
      "traffic signs",
      "cars",
      "bicycles",
      "pedestrians at realistic human scale"
    ],
    "setting": "ground-level urban environment"
  },
  "lighting": {
    "type": "natural daylight",
    "conditions": "clear or lightly cloudy sky",
    "shadows": "soft and realistic",
    "restrictions": "no fantasy or dramatic lighting"
  },
  "product_rules": {
    "usage": "use the uploaded Canon product exactly as provided",
    "distortion": "none",
    "logo": "unchanged",
    "appearance": "natural reflections and realistic highlights only"
  },
  "camera_quality": {
    "realism": "maximum photorealism",
    "depth": "clear separation of foreground, subject, and background",
    "artifacts": "none"
  },
  "constraints": [
    "No AI-art look",
    "No plastic or sculpted skin",
    "No distortion of face or body",
    "No extra limbs or incorrect anatomy",
    "No text or watermarks",
    "No visible selfie camera device"
  ],
  "output_goal": "Create a hyper-realistic cinematic selfie image of a woman using her exact reference identity, captured from an extreme top-down perspective in a real urban crosswalk, with forced perspective scale, natural daylight, and a Canon camera product prominently held toward the lens."
}
```

---

### Case 274

**成都吃货暴走手绘美食地图**
Input: ✏️ 需要填写 → [English], [中文]

```
[中文]
一张手绘风格的城市美食地图，以成都为主题。画面以鸟瞰视角的手绘简化城市地图为底，标注主要道路和地标但不追求精确比例而是追求可爱的手绘感。地图上分布着 12 个美食地点的精致手绘小插画：春熙路的串串香（一把竹签插着各种食材冒着热气）、宽窄巷子的三大炮（三个糯米团子飞向铜盘）、建设路的蛋烘糕（金黄酥脆正在翻面）、玉林路的火锅（九宫格锅翻滚冒泡）等，每个插画约占地图的 5% 面积，旁边用手写体标注店名和一句推荐语"凌晨两点还在排队的那家"。地图边缘用手绘藤蔓和辣椒装饰形成边框。右下角有一个手绘指南针和图例说明。左上角标题"成都·吃货暴走地图"使用胖圆的手绘美术字配辣椒装饰。整体画风为水彩+彩铅混合的手绘质感，颜色以暖色系（辣椒红、姜黄、翠绿）为主，图片比例 1:1。

[English]
A hand-drawn style city food map themed around Chengdu. The background is a bird's-eye view hand-drawn simplified city map, marking main roads and landmarks, not pursuing precise proportions but pursuing a cute hand-drawn feel. Distributed on the map are exquisite hand-drawn small illustrations of 12 food locations: Chuandu Chuanxiang skewers at Chunxi Road (a bunch of bamboo skewers with various ingredients emitting steam), Sandapao at Kuanzhai Alley (three glutinous rice balls flying towards a copper plate), Danhonggao at Jianshe Road (golden and crispy, being flipped), hotpot at Yulin Road (nine-grid pot rolling and bubbling), etc. Each illustration accounts for about 5% of the map area, with handwritten store names and a recommendation phrase "the one with a queue even at 2 AM" next to it. The edge of the map is decorated with hand-drawn vines and chili peppers to form a border. There is a hand-drawn compass and legend description in the bottom right corner. The title "Chengdu · Foodie Walking Map" in the top left corner uses chubby round hand-drawn artistic fonts decorated with chili peppers. The overall art style is a mixed hand-drawn texture of watercolor and colored pencils, with colors mainly in warm tones (chili red, ginger yellow, emerald green), image ratio 1:1.
```

---

### Case 211

**天坛古建拆解全图**
Input: ✏️ 需要填写 → [English], [中文]

```
[中文]
生成一个天坛的建筑拆解图，有详细的说明，中式美学风格

[English]
Generate an architectural exploded view of the Temple of Heaven, with detailed annotations, Chinese aesthetic style
```

---

### Case 50

**建筑空间场景图**
Input: ✅ 可直接使用

```
A highly detailed, cinematic wide shot of a grand, dark gothic hall with a {argument name="atmosphere" default="dark fantasy"} aesthetic. In the center, a single figure wearing a {argument name="clothing" default="long white robe"} kneels on a highly reflective stone floor, facing an ornate golden altar illuminated by a row of lit candles. To the right of the kneeling figure, a single {argument name="floor object" default="wooden violin"} rests on the ground. The cavernous room is framed by massive dark stone pillars detailed with {argument name="accent color" default="glowing blue"} ethereal cracks and veins. Suspended from the high ceiling are dozens of {argument name="floating objects" default="white porcelain theatrical masks"} hanging on thin strings, filling the upper half of the space and creating a haunting, surreal atmosphere. The lighting is dramatic and moody, featuring a rich color palette of deep blacks, tarnished golds, and cool blue accents. Format 16:9.
```

---

### Case 20

**信息图可视化设计**
Input: ✅ 可直接使用

```
Create an explanatory slide ({argument name="format" default="ponchi-e diagram"}) for {argument name="theme" default="Momotaro"} that fuses the gentle atmosphere of "Irasutoya" with the overwhelming information density of "Kasumigaseki slides".
```

---

### Case 18

**信息图可视化设计**
Input: ✏️ 需要填写 → ["美食地点", "地标景点", "公园绿地", "河流湖泊", "主要道路"]

```
{
  "type": "illustrated map infographic",
  "style": "{argument name=\"art style\" default=\"watercolor and ink hand-drawn illustration on vintage parchment\"}",
  "title_section": {
    "text": "{argument name=\"city name\" default=\"成都\"} {argument name=\"map title\" default=\"吃货暴走地图\"}",
    "mascot": "cartoon red chili pepper wearing sunglasses and giving a thumbs up"
  },
  "border": "{argument name=\"border decoration\" default=\"vine of green leaves and red chili peppers\"}",
  "layout": {
    "background": "textured beige parchment paper with yellow roads, blue rivers, and green park areas",
    "sections": [
      {
        "title": "landmarks",
        "count": 6,
        "illustrations": ["traditional pavilion", "traditional monastery", "modern skyscraper with climbing panda", "tall TV tower", "traditional gate", "industrial buildings"],
        "labels": ["人民公园", "文殊院", "IFS", "339电视塔", "宽窄巷子", "东郊记忆"]
      },
      {
        "title": "food_spots",
        "count": 12,
        "illustrations": ["mapo tofu", "dumplings in chili oil", "skewers in pot", "sticky rice balls", "egg baking cake", "nine-grid hotpot", "sweet potato noodles", "cold skewers", "spicy mixed dish", "covered tea bowl", "ice jelly dessert", "spicy rabbit heads"],
        "labels": ["1 陈麻婆豆腐", "2 钟水饺", "3 春熙路", "4 宽窄巷子·三大炮", "5 建设路·叶婆婆蛋烘糕", "6 玉林路·小龙坎火锅", "7 香香巷·肥肠粉", "8 武侯祠大街·钵钵鸡", "9 东郊记忆·冒椒火辣", "10 人民公园·鹤鸣茶社", "11 锦里古街·冰粉", "12 双流老妈兔头"]
      },
      {
        "title": "图例",
        "position": "bottom-right",
        "count": 5,
        "items": ["red dot", "green house", "green tree", "blue line", "yellow double line"],
        "labels": ["美食地点", "地标景点", "公园绿地", "河流湖泊", "主要道路"]
      }
    ],
    "centerpiece": "giant panda sitting and eating bamboo",
    "bottom_right_extras": ["vintage compass rose with N, S, E, W", "disclaimer text '温馨提示：吃辣需谨慎，肠胃要保护~' with a red chili pepper icon"]
  }
}
```

---

### Case 11

**一张手绘风格的城市美食地图，以台州为主题**
Input: ✅ 可直接使用

```
一张手绘风格的城市美食地图，以台州为主题。画面以鸟瞰视角的手绘简化城市地图为底，标注椒江、路桥、黄岩等区域和灵江、台州湾等水系地标，不追求精确比例而是追求可爱的水彩手绘感。地图上分布着12个美食地点的精致手绘小插画：1. 椒江老粮坊的蛋清羊尾（金黄蓬松的蛋泡甜点撒着糖粉，筷子夹起拉丝）2. 临海紫阳古街的食饼筒（一个饱满的麦饼卷切开露出肉丝、蛋皮、米面等丰富馅料）3. 三门的青蟹（一只肥硕的青壳大蟹张着大钳子，旁边一小碟姜醋）4. 温岭石塘渔港的海鲜面（粗瓷大碗浓白鱼汤面铺满虾、蛏子、小黄鱼）5. 路桥的糟羹（一锅稠厚的五彩羹，芥菜、冬笋、香干、牡蛎粒粒可见）6. 玉环坎门的炊圆（三四个白胖糯米团子卧在笼屉里，旁边酱油碟滴着麻油）7. 黄岩的麦虾（陶锅里面疙瘩配蛤蜊、青菜翻滚冒泡）8. 仙居的八大碗（八只粗陶小碗围成一圈——土鸡、溪鱼、豆腐皮俱全）9. 天台的饺饼筒（几卷金黄酥脆的薄饼整齐码放，露出红烧肉和豆面馅）10. 临海的麦油脂（竹盘上摊着薄如蝉翼的饼皮卷着肉末、豆芽、鸡蛋丝）11. 温岭的嵌糕（厚实的年糕饼中间嵌着红烧肉和油条，正在铁板上滋滋作响）12. 椒江的姜汁调蛋（一只青花碗里琥珀色姜汤卧着嫩滑蛋花，撒几粒核桃碎）。每个插画约占地图5%面积，旁边用手写体标注店名和一句推荐语如“阿婆凌晨四点就起来和面”“本地人认准这口锅”。地图边缘用手绘藤蔓、杨梅枝和小海鲜（虾、蟹、贝壳）装饰形成边框。右下角有一个手绘指南针（标注“东海”方向）和图例说明。左上角标题“台州·山海食光地图”使用胖圆的手绘美术字，用杨梅和小黄鱼点缀装饰。整体画风为水彩+彩铅混合的手绘质感，颜色以杨梅红、姜黄、海蓝、翠绿为主，图片比例1:1。
```

---

### Case 400

**手绘水彩城市地图模型**
Input: ✏️ 需要填写 → [城市名]

```
一张绘制在冷压水彩纸纹理画布上的【城市名】市城市地图模型，标题为《【城市名】城市档案模型》。画布背景为略带纤维肌理的米白色水彩纸。地图包含主要城区。清晰标注主要地标建筑。主要河流为淡彩水蓝色，绿地带有浅绿晕染。包含图例、比例尺、地铁线路、道路、铁路、老城区和CBD核心区。风格为手绘水彩与线稿结合，柔和自然，文字标签为手写体中英双语。3D平面视图。
```

---
### Case 518

**日式极简客厅晨光渲染**
Input: ✅ 可直接使用

```
Render a serene Japanese minimalist living room interior in photorealistic architectural visualization style, viewed from eye level with a 28 mm lens feel. The space should feature light oak flooring, shoji-inspired sliding panels, low modular seating, a recessed tokonoma niche, linen textures, and soft morning light entering from the left. Use a restrained palette of warm beige, pale oak, charcoal, muted moss green, and rice-paper white. Include subtle in-image text on a small framed floor plan board that reads "Room 6.4 m x 4.8 m" and "AURAE House". Add a low tea table, one ceramic vase, a bonsai-like plant, and indirect cove lighting at 3000 K. Composition should be calm and balanced with strong negative space, realistic shadows, accurate material behavior, and magazine-quality interior rendering. Prioritize photorealism, architectural detail, crisp edges, and tasteful minimalism rather than stylized fantasy.
```

---

### Case 519

**粗野主义混凝土博物馆中庭**
Input: ✅ 可直接使用

```
Create a photorealistic interior render of a monumental brutalist museum atrium with exposed board-formed concrete, dramatic skylights, long ramps, and massive geometric voids. Viewpoint is slightly low and wide, emphasizing vertical scale and shadow. Use a palette of cool gray concrete, black steel, muted sandstone, pale daylight, and a few rust-colored wayfinding accents. Include sparse signage with crisp in-image text: "Gallery A", "Level 02", and "Atrium 18.0 m". Add a few small human figures for scale, but keep the architecture dominant. The space should include suspended walkways, a central sculpture plinth, and reflected light from polished concrete floors. Composition must feel cinematic yet architecturally precise, with realistic material textures, accurate lighting, controlled contrast, and gallery-quality rendering. Prioritize believable spatial depth, clean geometry, subtle atmospheric perspective, and sharp signage.
```

---

### Case 520

**中世纪现代胡桃木创意办公室**
Input: ✅ 可直接使用

```
Render a sophisticated mid-century modern creative office in photorealistic interior style, with walnut millwork, brass accents, olive upholstery, terrazzo flooring, smoked glass partitions, and large windows casting late-afternoon light. Use a rich palette of walnut brown, olive green, cream, brass gold, and muted terracotta. The composition should show a central executive desk, built-in shelving, a lounge corner, and a wall-mounted planning board. On the board, include subtle in-image text "Studio North", "Q3 Review", and "14:30". Add realistic accessories like drafting tools, books, ceramic lamps, and a record player, but keep the scene curated and uncluttered. Camera angle should feel editorial, around 32 mm, with balanced perspective lines and realistic depth of field. Prioritize tactile materials, believable lighting, clean geometry, and polished architectural-visualization quality with crisp details and intentional composition.
```

---

### Case 521

**亲生物设计未来生物实验室**
Input: ✅ 可直接使用

```
Generate a high-end photorealistic render of a future-facing biotech laboratory that integrates biophilic design. Show a bright open lab with glass partitions, living moss walls, hanging plants, pale wood details, white composite worktops, and advanced research equipment. Use a fresh palette of white, sage green, pale oak, stainless steel, and clear cyan monitor accents. Include precise architectural lighting at 4200 K, skylight diffusion, and clean reflections. Add subtle wall graphics with crisp in-image text "HELIX BIO LAB 03", "Clean Zone", and "22 C". The scene should include lab benches, microscopes, sample storage towers, and collaborative seating, arranged with strong spatial clarity. Composition must feel aspirational but credible, with realistic equipment proportions, hygienic surfaces, controlled clutter, and premium visualization quality. Emphasize photorealism, accurate material rendering, clean hierarchy, and an elegant fusion of nature and scientific workspace design.
```

---

### Case 522

**哥特大教堂中殿肋拱内景**
Input: ✅ 可直接使用

```
Render a majestic Gothic cathedral interior in photorealistic architectural style, viewed down the central nave with towering ribbed vaults, pointed arches, intricate tracery, and colored light from stained glass windows. Use a palette of cool stone gray, deep burgundy, sapphire blue, candle gold, and dusty ambient light. Include realistic worn limestone textures, carved choir stalls, a patterned stone floor, and a distant altar. Add a discreet informational plaque near the foreground with the in-image text "Nave Height 28.5 m" and "Westminster Hall of Light". The composition should emphasize verticality, symmetry, and sacred atmosphere while remaining architecturally believable. Lighting should mix soft daylight shafts and warm candlelight, with subtle volumetric dust. Prioritize accurate Gothic detailing, strong perspective, material realism, and crisp small text, producing a museum-grade architectural render rather than a fantasy scene.
```

---
