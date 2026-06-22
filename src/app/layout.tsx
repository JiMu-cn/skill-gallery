import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill Gallery - AI 提示词技能库",
  description: "浏览、筛选、下载 AI 图像生成 Skill，一键获取生产级提示词模板。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
