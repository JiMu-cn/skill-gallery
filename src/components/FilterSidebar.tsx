"use client";

import { Search, Filter } from "lucide-react";
import { FilterGroup } from "./FilterGroup";
import { Filters } from "@/lib/types";

interface FilterSidebarProps {
  filters: Filters;
  search: string;
  category: string;
  style: string;
  scene: string;
  totalResults: number;
  onSearchChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onStyleChange: (val: string) => void;
  onSceneChange: (val: string) => void;
}

export function FilterSidebar({
  filters,
  search,
  category,
  style,
  scene,
  totalResults,
  onSearchChange,
  onCategoryChange,
  onStyleChange,
  onSceneChange,
}: FilterSidebarProps) {
  return (
    <aside className="hidden lg:flex w-80 h-screen sticky top-0 flex-col gap-6 p-8 border-r border-zinc-900 bg-zinc-950/20 shrink-0 overflow-y-auto scrollbar-hide">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Filter size={18} />
        </div>
        <span className="font-bold text-sm uppercase tracking-wider">筛选</span>
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
        <input
          type="text"
          placeholder="搜索..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500/50 rounded-xl py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none transition-all focus:ring-4 focus:ring-emerald-500/5"
        />
      </div>

      <div className="space-y-2">
        <FilterGroup
          label="分类"
          options={filters.categories}
          active={category}
          onChange={onCategoryChange}
        />
        <FilterGroup
          label="风格"
          options={filters.styles}
          active={style}
          onChange={onStyleChange}
        />
        <FilterGroup
          label="场景"
          options={filters.scenes}
          active={scene}
          onChange={onSceneChange}
        />
      </div>

      <div className="mt-auto pt-6 border-t border-zinc-900">
        <div className="text-xs font-medium text-zinc-500 px-2">
          <span className="text-emerald-400 font-bold">{totalResults}</span> 条匹配结果
        </div>
      </div>
    </aside>
  );
}
