/**
 * 从 image-prompt-style-library/data/style-library.json 提取筛选器数据
 * 生成 data/filters.json（中文标签）
 */

import fs from 'fs';
import path from 'path';

const STYLE_LIBRARY_PATH = path.resolve(
  __dirname,
  '../../../image-prompt-style-library/data/style-library.json'
);
const OUTPUT_PATH = path.resolve(__dirname, '../data/filters.json');

interface I18nText {
  en: string;
  zh: string;
}

interface CategoryItem {
  id: string;
  value: string;
  title: I18nText;
  description: I18nText;
}

interface StyleItem {
  id: string;
  value: string;
  title: I18nText;
  keywords: string[];
}

interface SceneItem {
  id: string;
  value: string;
  title: I18nText;
  keywords: string[];
}

interface StyleLibrary {
  categories: CategoryItem[];
  styles: StyleItem[];
  scenes: SceneItem[];
}

function main() {
  if (!fs.existsSync(STYLE_LIBRARY_PATH)) {
    console.error(`找不到 style-library.json: ${STYLE_LIBRARY_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(STYLE_LIBRARY_PATH, 'utf-8');
  const lib: StyleLibrary = JSON.parse(raw);

  const filters = {
    categories: [
      { value: 'All', label: '全部' },
      ...lib.categories.map((c) => ({
        value: c.value,
        label: c.title.zh,
      })),
    ],
    styles: [
      { value: 'All', label: '全部' },
      ...lib.styles.map((s) => ({
        value: s.value,
        label: s.title.zh,
      })),
    ],
    scenes: [
      { value: 'All', label: '全部' },
      ...lib.scenes.map((s) => ({
        value: s.value,
        label: s.title.zh,
      })),
    ],
  };

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(filters, null, 2), 'utf-8');
  console.log(`✅ 筛选器数据已生成: ${OUTPUT_PATH}`);
  console.log(`   分类: ${filters.categories.length} 项`);
  console.log(`   风格: ${filters.styles.length} 项`);
  console.log(`   场景: ${filters.scenes.length} 项`);
}

main();
