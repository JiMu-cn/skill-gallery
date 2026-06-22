/**
 * 批量处理图片并生成 skills.json
 * 1. 读取 raw-images/ 中所有图片
 * 2. 用文件名（去掉扩展名）作为标题
 * 3. 按顺序编号压缩为 WebP
 * 4. 生成 data/skills.json
 *
 * 用法: npx tsx scripts/process-all.ts
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";

const INPUT_DIR = path.resolve(__dirname, "../raw-images");
const OUTPUT_DIR = path.resolve(__dirname, "../public/images");
const SKILLS_JSON = path.resolve(__dirname, "../data/skills.json");

const MAX_WIDTH = 800;
const QUALITY = 80;

// 默认分类（后续可手动调整）
const DEFAULT_CATEGORY = "Characters & People";
const DEFAULT_STYLE = "Character";
const DEFAULT_SCENE = "Creative";

async function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error("❌ raw-images/ 目录不存在");
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INPUT_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".tiff"].includes(ext);
  });

  files.sort(); // 按文件名排序

  console.log(`🖼️  找到 ${files.length} 张图片，开始处理...`);

  const skills: Array<{
    id: string;
    title: string;
    image: string;
    category: string;
    style: string;
    scene: string;
    fileSize: number;
    downloads: number;
  }> = [];

  let success = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const id = `skill-${String(i + 1).padStart(3, "0")}`;
    const title = path.basename(file, path.extname(file));
    const inputPath = path.join(INPUT_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, `${id}.webp`);

    try {
      await sharp(inputPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const outputStat = fs.statSync(outputPath);

      skills.push({
        id,
        title,
        image: `/images/${id}.webp`,
        category: DEFAULT_CATEGORY,
        style: DEFAULT_STYLE,
        scene: DEFAULT_SCENE,
        fileSize: outputStat.size,
        downloads: Math.floor(Math.random() * 500),
      });

      success++;
      if (success % 50 === 0) {
        console.log(`  ⏳ 已处理 ${success}/${files.length}...`);
      }
    } catch (err) {
      console.error(`  ❌ ${file}: ${err}`);
      failed++;
    }
  }

  // 写入 skills.json
  fs.writeFileSync(SKILLS_JSON, JSON.stringify(skills, null, 2), "utf-8");

  console.log(`
🎉 完成!`);
  console.log(`   成功: ${success}, 失败: ${failed}`);
  console.log(`   skills.json 已生成: ${skills.length} 条记录`);
}

main();
