import { NextRequest, NextResponse } from "next/server";
import { Skill, SkillsResponse } from "@/lib/types";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { corsHeaders, handleOptions } from "@/lib/cors";

const DATA_DIR = process.env.DATA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
const SKILLS_PATH = path.join(DATA_DIR, "skills.json");
const LIKES_PATH = path.join(DATA_DIR, "likes.json");

// 动态读取 skills.json，支持热更新
function readSkills(): Skill[] {
  const raw = readFileSync(/*turbopackIgnore: true*/ SKILLS_PATH, "utf-8");
  return (JSON.parse(raw) as Skill[]).slice().reverse();
}

function readLikes(): Record<string, number> {
  if (!existsSync(/*turbopackIgnore: true*/ LIKES_PATH)) return {};
  try {
    return JSON.parse(readFileSync(/*turbopackIgnore: true*/ LIKES_PATH, "utf-8"));
  } catch {
    return {};
  }
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "9")));
  const category = searchParams.get("category") || "All";
  const style = searchParams.get("style") || "All";
  const scene = searchParams.get("scene") || "All";
  const search = (searchParams.get("search") || "").toLowerCase().trim();

  const skills = readSkills();
  let filtered = skills;

  if (category !== "All") {
    filtered = filtered.filter((s) => s.category === category);
  }
  if (style !== "All") {
    filtered = filtered.filter((s) => s.style === style);
  }
  if (scene !== "All") {
    filtered = filtered.filter((s) => s.scene === scene);
  }
  if (search) {
    filtered = filtered.filter((s) => s.title.toLowerCase().includes(search));
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = filtered.slice(start, end);
  const hasMore = end < total;

  // 合并点赞数
  const likes = readLikes();
  const itemsWithLikes = items.map((item) => ({
    ...item,
    likes: likes[item.id] || 0,
  }));

  const response: SkillsResponse = {
    items: itemsWithLikes,
    total,
    page,
    limit,
    hasMore,
  };

  const origin = request.headers.get("origin");

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      ...corsHeaders(origin),
    },
  });
}

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}
