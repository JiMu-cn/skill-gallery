import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const SKILLS_DIR = path.join(
  process.env.IMAGES_DIR ? path.dirname(process.env.IMAGES_DIR) : path.join(/*turbopackIgnore: true*/ process.cwd(), "public"),
  "skills",
  "image-prompt-style-library"
);
const ZIP_PATH = path.join(
  process.env.IMAGES_DIR ? path.dirname(process.env.IMAGES_DIR) : path.join(/*turbopackIgnore: true*/ process.cwd(), "public"),
  "skills",
  "image-prompt-style-library.zip"
);

// 分类到文件名的映射
const CATEGORY_FILE_MAP: Record<string, string> = {
  "Charts & Infographics": "cases-charts.md",
  "Posters & Typography": "cases-posters.md",
  "UI & Interfaces": "cases-ui.md",
  "Products & E-commerce": "cases-products.md",
  "Brand & Logos": "cases-brand.md",
  "Architecture & Spaces": "cases-architecture.md",
  "Photography & Realism": "cases-photography.md",
  "Illustration & Art": "cases-illustration.md",
  "Characters & People": "cases-characters.md",
  "Scenes & Storytelling": "cases-scenes.md",
  "History & Classical Themes": "cases-history.md",
  "Documents & Publishing": "cases-documents.md",
  "Other Use Cases": "cases-other.md",
};

/**
 * POST /api/admin/update-skill
 *
 * 更新 skill reference 文件并重新生成 zip 包
 *
 * Body (JSON):
 *   - category: string (分类，用于确定追加到哪个文件)
 *   - caseId: string (如 "566")
 *   - title: string (案例标题)
 *   - input: string (如 "✅ 可直接使用" 或 "✏️ 需要填写 → [变量名]")
 *   - prompt: string (完整提示词)
 */
export async function POST(request: NextRequest) {
  // Token 验证
  if (!ADMIN_TOKEN) {
    return NextResponse.json(
      { error: "Server misconfigured: ADMIN_TOKEN not set" },
      { status: 500 }
    );
  }

  const auth = request.headers.get("authorization");
  if (!auth || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { category, caseId, title, input, prompt } = body;

    // 参数校验
    if (!category || !caseId || !title || !input || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: category, caseId, title, input, prompt" },
        { status: 400 }
      );
    }

    const fileName = CATEGORY_FILE_MAP[category];
    if (!fileName) {
      return NextResponse.json(
        { error: `Invalid category: ${category}` },
        { status: 400 }
      );
    }

    const refDir = path.join(/*turbopackIgnore: true*/ SKILLS_DIR, "references");
    const filePath = path.join(/*turbopackIgnore: true*/ refDir, fileName);

    if (!existsSync(/*turbopackIgnore: true*/ filePath)) {
      return NextResponse.json(
        { error: `Reference file not found: ${fileName}` },
        { status: 404 }
      );
    }

    // 追加新 case
    const fence = "\u0060\u0060\u0060";
    const caseContent = [
      "",
      "### Case " + caseId,
      "",
      "**" + title + "**",
      "Input: " + input,
      "",
      fence,
      prompt,
      fence,
      "",
      "---",
      "",
    ].join("\n");

    const existing = readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
    writeFileSync(/*turbopackIgnore: true*/ filePath, existing + caseContent, "utf-8");

    // 重新生成 zip 包
    try {
      const skillsParent = path.dirname(/*turbopackIgnore: true*/ SKILLS_DIR);
      execSync(
        `cd "${skillsParent}" && zip -r "${ZIP_PATH}" image-prompt-style-library -x "*.DS_Store" -x "__MACOSX/*"`,
        { timeout: 30000 }
      );
    } catch (zipErr) {
      console.error("zip generation failed:", zipErr);
      return NextResponse.json({
        success: true,
        warning: "Reference updated but zip generation failed",
        file: fileName,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Case ${caseId} added to ${fileName}, zip regenerated`,
      file: fileName,
    });
  } catch (err) {
    console.error("update-skill error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
