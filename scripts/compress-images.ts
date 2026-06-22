/**
 * 图片批量压缩脚本
 * 将 raw-images/ 目录下的原始图片转换为 WebP 格式
 * 输出到 public/images/ 目录
 *
 * 用法: npx tsx scripts/compress-images.ts
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";

const INPUT_DIR = path.resolve(__dirname, "../raw-images");
const OUTPUT_DIR = path.resolve(__dirname, "../public/images");

const MAX_WIDTH = 800;
const QUALITY = 80;

async function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    fs.mkdirSync(INPUT_DIR, { recursive: true });
    console.log(`📁 已创建输入目录: ${INPUT_DIR}`);
    console.log("   请将原始图片放入该目录后重新运行此脚本。");
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INPUT_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".tiff"].includes(ext);
  });

  if (files.length === 0) {
    console.log("⚠️  raw-images/ 目录下没有找到图片文件。");
    return;
  }

  console.log(`🖼️  找到 ${files.length} 张图片，开始压缩...`);

  let success = 0;
  let failed = 0;

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const baseName = path.basename(file, path.extname(file));
    const outputPath = path.join(OUTPUT_DIR, `${baseName}.webp`);

    try {
      await sharp(inputPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const inputStat = fs.statSync(inputPath);
      const outputStat = fs.statSync(outputPath);
      const ratio = ((1 - outputStat.size / inputStat.size) * 100).toFixed(1);

      console.log(
        `  ✅ ${file} → ${baseName}.webp (${(outputStat.size / 1024).toFixed(0)}KB, -${ratio}%)`
      );
      success++;
    } catch (err) {
      console.error(`  ❌ ${file}: ${err}`);
      failed++;
    }
  }

  console.log(`
🎉 完成! 成功: ${success}, 失败: ${failed}`);
}

main();
