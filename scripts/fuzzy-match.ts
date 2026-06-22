/**
 * 模糊匹配：对未匹配的 skill 尝试用包含关系匹配
 * 并为完全无法匹配的分配合理的默认分类
 *
 * 用法: npx tsx scripts/fuzzy-match.ts
 */

import fs from "fs";
import path from "path";

const CASES_PATH = path.resolve(
  __dirname,
  "../../../image-prompt-style-library/data/cases.json"
);
const SKILLS_PATH = path.resolve(__dirname, "../data/skills.json");

interface CaseItem {
  id: number;
  title: string;
  category: string;
  styles: string[];
  scenes: string[];
}

interface SkillItem {
  id: string;
  title: string;
  image: string;
  category: string;
  style: string;
  scene: string;
  fileSize: number;
  downloads: number;
}

// 关键词到分类的映射
const KEYWORD_RULES: Array<{ keywords: string[]; category: string; style: string; scene: string }> = [
  { keywords: ["海报", "poster", "排版", "字体"], category: "Posters & Typography", style: "Poster", scene: "Creative" },
  { keywords: ["UI", "界面", "仪表盘", "截图", "App", "网页", "首页"], category: "UI & Interfaces", style: "UI", scene: "Tech" },
  { keywords: ["信息图", "图表", "数据", "拆解", "详解", "时间轴"], category: "Charts & Infographics", style: "Infographic", scene: "Education" },
  { keywords: ["品牌", "Logo", "logo", "标志", "VI"], category: "Brand & Logos", style: "Brand", scene: "Commerce" },
  { keywords: ["商品", "产品", "电商", "包装", "广告", "详情页"], category: "Products & E-commerce", style: "Product", scene: "Commerce" },
  { keywords: ["建筑", "空间", "室内", "地图", "城市"], category: "Architecture & Spaces", style: "Architecture", scene: "Travel" },
  { keywords: ["摄影", "写真", "人像", "照片", "抓拍", "街拍"], category: "Photography & Realism", style: "Realistic", scene: "Fashion" },
  { keywords: ["插画", "水彩", "刺绣", "涂鸦", "线条", "绘画"], category: "Illustration & Art", style: "Illustration", scene: "Creative" },
  { keywords: ["角色", "人物", "玩具", "3D", "手办", "穿搭"], category: "Characters & People", style: "Character", scene: "Creative" },
  { keywords: ["场景", "故事", "微缩", "世界", "冒险"], category: "Scenes & Storytelling", style: "Scenes", scene: "Story" },
  { keywords: ["历史", "古风", "长卷", "诗词", "国风", "水墨"], category: "History & Classical Themes", style: "Classical", scene: "History" },
  { keywords: ["文档", "白皮书", "手册", "课本", "试卷"], category: "Documents & Publishing", style: "Documents", scene: "Education" },
  { keywords: ["菜单", "食品", "饮品", "咖啡", "茶", "餐"], category: "Other Use Cases", style: "Product", scene: "Food" },
];

function inferCategory(title: string): { category: string; style: string; scene: string } | null {
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => title.includes(kw))) {
      return { category: rule.category, style: rule.style, scene: rule.scene };
    }
  }
  return null;
}

function main() {
  const casesRaw = JSON.parse(fs.readFileSync(CASES_PATH, "utf-8"));
  const cases: CaseItem[] = casesRaw.cases;
  const skills: SkillItem[] = JSON.parse(fs.readFileSync(SKILLS_PATH, "utf-8"));

  // 找出仍然是默认分类的 skill
  const defaultCategory = "Characters & People";
  const defaultStyle = "Character";

  let fuzzyMatched = 0;
  let keywordMatched = 0;
  let stillUnmatched = 0;

  for (const skill of skills) {
    // 只处理仍然是默认值的
    if (skill.category !== defaultCategory || skill.style !== defaultStyle) continue;

    // 尝试模糊匹配：skill 标题包含 case 标题，或反过来
    let found = false;
    for (const c of cases) {
      if (skill.title.includes(c.title) || c.title.includes(skill.title)) {
        skill.category = c.category;
        skill.style = c.styles[0] || "Creative";
        skill.scene = c.scenes[0] || "Creative";
        fuzzyMatched++;
        found = true;
        break;
      }
    }

    if (!found) {
      // 用关键词规则推断
      const inferred = inferCategory(skill.title);
      if (inferred) {
        skill.category = inferred.category;
        skill.style = inferred.style;
        skill.scene = inferred.scene;
        keywordMatched++;
      } else {
        stillUnmatched++;
      }
    }
  }

  fs.writeFileSync(SKILLS_PATH, JSON.stringify(skills, null, 2), "utf-8");

  console.log(`✅ 模糊匹配完成`);
  console.log(`   模糊标题匹配: ${fuzzyMatched}`);
  console.log(`   关键词推断: ${keywordMatched}`);
  console.log(`   仍未匹配: ${stillUnmatched}`);

  // 统计最终分类分布
  const catCount: Record<string, number> = {};
  for (const s of skills) {
    catCount[s.category] = (catCount[s.category] || 0) + 1;
  }
  console.log(`
📊 分类分布:`);
  Object.entries(catCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
}

main();
