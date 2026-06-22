import { NextResponse } from "next/server";

/**
 * CORS 配置
 * 允许的来源域名，* 表示允许所有域名
 * 上线后可改为具体域名列表：["https://your-domain.com", "https://client.com"]
 */
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : ["*"];

export function corsHeaders(origin?: string | null): Record<string, string> {
  const allowedOrigin =
    ALLOWED_ORIGINS.includes("*")
      ? "*"
      : origin && ALLOWED_ORIGINS.includes(origin)
        ? origin
        : "";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function handleOptions(request: Request): NextResponse {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}
