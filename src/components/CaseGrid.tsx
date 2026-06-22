"use client";

import { Layout } from "lucide-react";
import { CaseCard } from "./CaseCard";
import { Skill } from "@/lib/types";
import { useRef, useEffect } from "react";

interface CaseGridProps {
  items: Skill[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onClearFilters: () => void;
  onImageClick: (src: string, alt: string) => void;
}

export function CaseGrid({ items, loading, hasMore, onLoadMore, onClearFilters, onImageClick }: CaseGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800">
          <Layout className="text-zinc-700" size={32} />
        </div>
        <h3 className="text-xl font-bold text-zinc-300 mb-2">未找到匹配案例</h3>
        <p className="text-zinc-500 max-w-xs">
          试试调整筛选条件或搜索关键词
        </p>
        <button
          onClick={onClearFilters}
          className="mt-6 px-6 py-2 rounded-full border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-all font-bold text-xs uppercase tracking-widest"
        >
          清除所有筛选
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item) => (
          <CaseCard key={item.id} item={item} onImageClick={onImageClick} />
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="rounded-2xl glass-panel p-3 animate-pulse"
            >
              <div className="aspect-[4/5] rounded-xl bg-zinc-800" />
              <div className="mt-3 px-1 space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
              </div>
              <div className="mt-3 pt-2 px-1 border-t border-zinc-800/50">
                <div className="h-10 bg-zinc-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      {hasMore && <div ref={sentinelRef} className="h-10" />}
    </>
  );
}
