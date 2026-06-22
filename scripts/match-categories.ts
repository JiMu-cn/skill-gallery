/**
 * 从 image-prompt-style-library/data/cases.json 匹配分类数据
 * 更新 data/skills.json 中的 category/style/scene
 *
 * 用法: npx tsx scripts/match-categories.ts
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

function main() {
  const casesRaw = JSON.parse(fs.readFileSync(CASES_PATH, "utf-8"));
  const cases: CaseItem[] = casesRaw.cases;
  const skills: SkillItem[] = JSON.parse(fs.readFileSync(SKILLS_PATH, "utf-8"));

  // 建立标题到 case 的映射
  const titleMap = new Map<string, CaseItem>();
  for (const c of cases) {
    titleMap.set(c.title, c);
  }

  let matched = 0;
  let unmatched = 0;

  for (const skill of skills) {
    const caseItem = titleMap.get(skill.title);
    if (caseItem) {
      skill.category = caseItem.category;
      skill.style = caseItem.styles[0] || "Creative";
      skill.scene = caseItem.scenes[0] || "Creative";
      matched++;
    } else {
      unmatched++;
    }
  }

  fs.writeFileSync(SKILLS_PATH, JSON.stringify(skills, null, 2), "utf-8");

  console.log(`✅ 分类匹配完成`);
  console.log(`   匹配成功: ${matched}`);
  console.log(`   未匹配: ${unmatched}`);

  if (unmatched > 0) {
    const unmatchedTitles = skills
      .filter((s) => s.category === "Characters & People" && !titleMap.has(s.title))
      .slice(0, 10)
      .map((s) => s.title);
    console.log(`   未匹配示例: ${unmatchedTitles.join(", ")}`);
  }
}

main();
