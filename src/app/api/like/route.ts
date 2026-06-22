import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, renameSync, existsSync } from "fs";
import path from "path";
import { corsHeaders, handleOptions } from "@/lib/cors";

const DATA_DIR = process.env.DATA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
const LIKES_PATH = path.join(DATA_DIR, "likes.json");
const LIKES_TMP_PATH = LIKES_PATH + ".tmp";

// 内存互斥锁，防止并发请求交叉读写
let writeLock = Promise.resolve();

// 简单 rate limit：每个 IP 每分钟最多 30 次点赞操作
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 分钟
const RATE_LIMIT_MAX = 30; // 每分钟最多 30 次

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

function readLikes(): Record<string, number> {
  if (!existsSync(/*turbopackIgnore: true*/ LIKES_PATH)) return {};
  try {
    return JSON.parse(readFileSync(/*turbopackIgnore: true*/ LIKES_PATH, "utf-8"));
  } catch {
    return {};
  }
}

// GET /api/like?ids=skill-001,skill-002,...
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = (searchParams.get("ids") || "").split(",").filter(Boolean);
  const likes = readLikes();

  const result: Record<string, number> = {};
  for (const id of ids) {
    result[id] = likes[id] || 0;
  }

  const origin = request.headers.get("origin");
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      ...corsHeaders(origin),
    },
  });
}

// POST /api/like  body: { id: "skill-001", action: "like" | "unlike" }
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  // Rate limit
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests, try again later" },
      { status: 429, headers: corsHeaders(origin) }
    );
  }

  let body: { id?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: corsHeaders(origin) }
    );
  }

  const id = body?.id;
  const action = body?.action || "like";

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400, headers: corsHeaders(origin) }
    );
  }

  if (action !== "like" && action !== "unlike") {
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400, headers: corsHeaders(origin) }
    );
  }

  // ID 格式校验
  if (!/^skill-\d{3,}$/.test(id)) {
    return NextResponse.json(
      { error: "Invalid id format" },
      { status: 400, headers: corsHeaders(origin) }
    );
  }

  // 在锁内完成读-改-写，避免竞态
  let finalCount = 0;
  const operation = writeLock.catch(() => undefined).then(() => {
    const likes = readLikes();

    if (action === "unlike") {
      likes[id] = Math.max(0, (likes[id] || 0) - 1);
    } else {
      likes[id] = (likes[id] || 0) + 1;
    }

    for (const [key, value] of Object.entries(likes)) {
      if (!Number.isFinite(value) || value <= 0) {
        delete likes[key];
      }
    }

    finalCount = likes[id] || 0;
    writeFileSync(/*turbopackIgnore: true*/ LIKES_TMP_PATH, JSON.stringify(likes), "utf-8");
    renameSync(/*turbopackIgnore: true*/ LIKES_TMP_PATH, /*turbopackIgnore: true*/ LIKES_PATH);
  });

  writeLock = operation.catch(() => undefined);

  try {
    await operation;
  } catch {
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }

  return NextResponse.json(
    { id, likes: finalCount },
    { headers: corsHeaders(origin) }
  );
}

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}
