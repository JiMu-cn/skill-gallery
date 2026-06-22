"use client";

import { Copy, Check, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Skill } from "@/lib/types";

interface CaseCardProps {
  item: Skill;
  onImageClick: (src: string, alt: string) => void;
}

const LIKED_KEY = "skill-gallery-liked";

function getLikedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveLikedSet(set: Set<string>) {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...set]));
}

export function CaseCard({ item, onImageClick }: CaseCardProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);

  useEffect(() => {
    setLiked(getLikedSet().has(item.id));
  }, [item.id]);

  // 同步服务端点赞数
  useEffect(() => {
    setLikeCount(item.likes);
  }, [item.likes]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.title);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = item.title;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = async () => {
    const set = getLikedSet();
    const isUnlike = liked;

    // 乐观更新 UI
    setLiked(!liked);
    setLikeCount((prev) => isUnlike ? Math.max(0, prev - 1) : prev + 1);

    if (isUnlike) {
      set.delete(item.id);
    } else {
      set.add(item.id);
    }
    saveLikedSet(set);

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, action: isUnlike ? "unlike" : "like" }),
      });
      if (res.ok) {
        const data = await res.json();
        // 用服务端真实值覆盖
        setLikeCount(data.likes);
      }
    } catch {
      // 网络失败时保持乐观更新的值
    }
  };

  return (
    <div className="group relative flex flex-col gap-3 p-3 rounded-2xl glass-panel case-card-shadow overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-1">
      <div
        className="relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer"
        onClick={() => onImageClick(item.image, item.title)}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {/* 点赞按钮 - 右上角 */}
        <button
          onClick={(e) => { e.stopPropagation(); handleLike(); }}
          className={`absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1.5 rounded-lg backdrop-blur-sm transition-all duration-200 ${
            liked
              ? "bg-rose-500/90 text-white"
              : "bg-black/50 text-zinc-300 hover:bg-rose-500/80 hover:text-white"
          }`}
          title={liked ? "已点赞" : "点赞"}
        >
          <Heart size={13} className={liked ? "fill-white" : ""} />
          <span className="text-xs font-bold leading-none">{likeCount}</span>
        </button>
      </div>

      <div className="flex items-center gap-2 px-1">
        <h3 className="flex-1 text-sm font-semibold text-zinc-100 leading-tight group-hover:text-emerald-400 transition-colors duration-200">
          {item.title}
        </h3>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-md text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 transition-all duration-200"
          title="复制标题"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>

      {copied && (
        <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-emerald-500 text-black text-xs font-bold">
          复制成功
        </div>
      )}
    </div>
  );
}
