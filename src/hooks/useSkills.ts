"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Skill, SkillsResponse } from "@/lib/types";

interface UseSkillsParams {
  search: string;
  category: string;
  style: string;
  scene: string;
}

export function useSkills({ search, category, style, scene }: UseSkillsParams) {
  const [items, setItems] = useState<Skill[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchSkills = useCallback(
    async (pageNum: number, append: boolean) => {
      // Abort previous request
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: "9",
          category,
          style,
          scene,
          search,
        });

        const res = await fetch(`/api/skills?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data: SkillsResponse = await res.json();

        if (append) {
          setItems((prev) => [...prev, ...data.items]);
        } else {
          setItems(data.items);
        }
        setTotal(data.total);
        setHasMore(data.hasMore);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("Failed to fetch skills:", err);
      } finally {
        setLoading(false);
      }
    },
    [category, style, scene, search]
  );

  // Reset when filters change
  useEffect(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
    fetchSkills(1, false);
  }, [fetchSkills]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSkills(nextPage, true);
  }, [loading, hasMore, page, fetchSkills]);

  return { items, total, loading, hasMore, loadMore };
}
