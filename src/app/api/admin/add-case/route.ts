import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { Skill } from "@/lib/types";

const DATA_DIR = process.env.DATA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
const IMAGES_DIR = process.env.IMAGES_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "images");
const SKILLS_PATH = path.join(DATA_DIR, "skills.json");

// Token 从环境变量读取，不硬编码
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

// 合法的枚举值
const VALID_CATEGORIES = [
  "UI & Interfaces", "Charts & Infographics", "Posters & Typography",
  "Products & E-commerce", "Brand & Logos", "Architecture & Spaces",
  "Photography & Realism", "Illustration & Art", "Characters & People",
  "Scenes & Storytelling", "History & Classical Themes",
  "Documents & Publishing", "Other Use Cases",
];

const VALID_STYLES = [
  "3D", "Architecture", "Brand", "Character", "Characters", "Charts",
  "Classical", "Documents", "History", "Illustration", "Infographic",
  "Other Use Cases", "Photography", "Poster", "Product", "Products",
  "Realistic", "Scenes", "UI",
];

const VALID_SCENES = [
  "Creative", "Tech", "Commerce", "Education", "Social",
  "Fashion", "Food", "Travel", "Story", "History",
];

// 图片限制
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/webp", "image/png", "image/jpeg"];

function readSkills(): Skill[] {
  return JSON.parse(readFileSync(/*turbopackIgnore: true*/ SKILLS_PATH, "utf-8"));
}

function writeSkills(skills: Skill[]) {
  writeFileSync(/*turbopackIgnore: true*/ SKILLS_PATH, JSON.stringify(skills, null, 2), "utf-8");
}

function getNextId(skills: Skill[]): string {
  const maxNum = skills.reduce((max, s) => {
    const num = parseInt(s.id.replace("skill-", ""));
    return num > max ? num : max;
  }, 0);
  return `skill-${String(maxNum + 1).padStart(3, "0")}`;
}

/**
 * POST /api/admin/add-case
 *
 * Headers:
 *   Authorization: Bearer <token>
 *
 * Body (multipart/form-data):
 *   - image: File (WebP/PNG/JPEG, max 10MB)
 *   - title: string (max 100 chars)
 *   - category: string (must be valid enum)
 *   - style: string (must be valid enum)
 *   - scene: string (must be valid enum)
 */
export async function POST(request: NextRequest) {
  // HTTPS 强制检查（通过环境变量开启，线上 Nginx 反代时设置 REQUIRE_HTTPS=true）
  if (process.env.REQUIRE_HTTPS === "true") {
    const proto = request.headers.get("x-forwarded-proto");
    if (proto && proto !== "https") {
      return NextResponse.json(
        { error: "HTTPS required" },
        { status: 403 }
      );
    }
  }

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
    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    const title = (formData.get("title") as string | null)?.trim();
    const category = formData.get("category") as string | null;
    const style = formData.get("style") as string | null;
    const scene = formData.get("scene") as string | null;

    // 必填校验
    if (!image || !title || !category || !style || !scene) {
      return NextResponse.json(
        { error: "Missing required fields: image, title, category, style, scene" },
        { status: 400 }
      );
    }

    // 标题长度校验
    if (title.length > 100) {
      return NextResponse.json(
        { error: "Title too long (max 100 chars)" },
        { status: 400 }
      );
    }

    // 分类枚举校验
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category: ${category}` },
        { status: 400 }
      );
    }
    if (!VALID_STYLES.includes(style)) {
      return NextResponse.json(
        { error: `Invalid style: ${style}` },
        { status: 400 }
      );
    }
    if (!VALID_SCENES.includes(scene)) {
      return NextResponse.json(
        { error: `Invalid scene: ${scene}` },
        { status: 400 }
      );
    }

    // 图片格式校验（兼容 curl 上传时 MIME 可能为 octet-stream）
    const imageType = image.type;
    const imageName = image.name?.toLowerCase() || "";
    const validByType = ALLOWED_IMAGE_TYPES.includes(imageType);
    const validByExt = imageName.endsWith(".webp") || imageName.endsWith(".png") || imageName.endsWith(".jpg") || imageName.endsWith(".jpeg");

    if (!validByType && !validByExt && imageType !== "application/octet-stream") {
      return NextResponse.json(
        { error: `Invalid image type: ${imageType}. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // 图片大小校验
    if (image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: `Image too large: ${(image.size / 1024 / 1024).toFixed(1)}MB. Max: 10MB` },
        { status: 400 }
      );
    }

    // 读取现有数据
    const skills = readSkills();

    // 标题唯一性校验
    if (skills.some((s) => s.title === title)) {
      return NextResponse.json(
        { error: `Title already exists: ${title}` },
        { status: 409 }
      );
    }

    const newId = getNextId(skills);

    // 保存图片
    if (!existsSync(/*turbopackIgnore: true*/ IMAGES_DIR)) {
      mkdirSync(/*turbopackIgnore: true*/ IMAGES_DIR, { recursive: true });
    }
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const imagePath = path.join(/*turbopackIgnore: true*/ IMAGES_DIR, `${newId}.webp`);
    writeFileSync(/*turbopackIgnore: true*/ imagePath, imageBuffer);

    // 追加到 skills.json
    const newSkill: Skill = {
      id: newId,
      title,
      image: `/images/${newId}.webp`,
      category,
      style,
      scene,
      fileSize: imageBuffer.length,
      downloads: 0,
      likes: 0,
    };
    skills.push(newSkill);
    writeSkills(skills);

    return NextResponse.json({
      success: true,
      skill: newSkill,
      message: `案例 "${title}" 已添加，编号 ${newId}`,
    });
  } catch (err) {
    // 不暴露内部错误细节
    console.error("add-case error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
