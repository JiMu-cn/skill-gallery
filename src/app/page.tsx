"use client";

import { useState, useCallback } from "react";
import { Grid, Download } from "lucide-react";
import { FilterSidebar } from "@/components/FilterSidebar";
import { MobileSearch } from "@/components/MobileSearch";
import { CaseGrid } from "@/components/CaseGrid";
import { Lightbox } from "@/components/Lightbox";
import { useSkills } from "@/hooks/useSkills";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import filtersData from "../../data/filters.json";
import { Filters } from "@/lib/types";

const filters: Filters = filtersData;

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [style, setStyle] = useState("All");
  const [scene, setScene] = useState("All");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { items, total, loading, hasMore, loadMore } = useSkills({
    search: debouncedSearch,
    category,
    style,
    scene,
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setStyle("All");
    setScene("All");
  };

  const handleImageClick = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  return (
    <div className="flex min-h-screen selection:bg-emerald-500/30">
      {/* Fixed Sidebar Filter Section */}
      <FilterSidebar
        filters={filters}
        search={search}
        category={category}
        style={style}
        scene={scene}
        totalResults={total}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onStyleChange={setStyle}
        onSceneChange={setScene}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header / Hero Section */}
        <header className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-12 pb-8">
          <MobileSearch value={search} onChange={setSearch} />

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              浏览、筛选、下载
            </div>
          </div>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-zinc-100 mb-2 leading-tight">
              Skill 案例库，
              <br />
              <span className="text-gradient-neon">一键下载</span>
            </h1>
            <a
              href="/skills/image-prompt-style-library.zip"
              download
              className="shrink-0 mb-3 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 active:scale-95 transition-all duration-200"
            >
              <Download size={16} />
              下载 Skill
            </a>
          </div>
        </header>

        {/* Gallery Section */}
        <main className="max-w-[1200px] mx-auto px-6 lg:px-12 mt-8 pb-20">
          <CaseGrid
            items={items}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onClearFilters={clearFilters}
            onImageClick={handleImageClick}
          />
        </main>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-emerald-500 text-black shadow-2xl shadow-emerald-500/20 flex items-center justify-center z-50 hover:bg-emerald-400 hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <Grid size={24} />
      </button>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />
      )}
    </div>
  );
}
