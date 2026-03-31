"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "@/service/idea.catetogory.service";
// import IdeaCard, { type IIdea } from "./IdeaCard";
import IdeaDetailModal from "./IdeaDetailModal";
import { getAllIdeas } from "@/service/idea.service";
import { TIdeaCategory } from "@/types/idea.category.type";
import IdeaCard from "./IdeaCard";

export default function IdeaGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── URL state ──────────────────────────────────────────
  const page = Number(searchParams.get("page") ?? 1);
  const searchTerm = searchParams.get("searchTerm") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const type = searchParams.get("type") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "createdAt";

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<IIdea | null>(null);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const queryParams = {
    page,
    limit: 9,
    searchTerm,
    categoryId: categoryId || undefined,
    type: type || undefined,
    sortBy,
    sortOrder: "desc" as const,
    status: "APPROVED",
    isPublished: true,
    isDeleted: false,
  };

  // ── Queries ───────────────────────────────────────────
  const { data: ideasData, isLoading } = useQuery({
    queryKey: ["admin-ideas", queryParams],
    queryFn: () => getAllIdeas(queryParams as any),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["category"],
    queryFn: getAllCategory,
  });

  const ideas:any = ideasData?.data || [];
  console.log("ideas",ideas)
  const meta = ideasData?.meta || { page: 1, totalPages: 1, total: 0 };
  const categories :any= categoriesData?.data || categoriesData || [];

  // ── Search with debounce ──────────────────────────────
  const handleSearch = (val: string) => {
    setLocalSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      updateParams({ searchTerm: val });
    }, 400);
  };

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const selectStyle =
    "text-sm px-3 py-2 rounded-lg border border-green-200 bg-white text-gray-700 focus:outline-none focus:border-green-400 hover:border-green-300 cursor-pointer transition-colors";

  return (
    <div>
      {/* ── Search & Filter Bar ─────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white border-b border-green-100 shadow-sm shadow-green-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
              <input
                value={localSearch}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search ideas..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-green-200 focus:outline-none focus:border-green-400 placeholder-gray-400 bg-green-50/50"
              />
              {localSearch && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category */}
            <select
              value={categoryId}
              onChange={(e) => updateParams({ categoryId: e.target.value })}
              className={selectStyle}
            >
              <option value="">All Categories</option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Type */}
            <select
              value={type}
              onChange={(e) => updateParams({ type: e.target.value })}
              className={selectStyle}
            >
              <option value="">All Types</option>
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => updateParams({ sortBy: e.target.value })}
              className={selectStyle}
            >
              <option value="createdAt">Newest First</option>
              <option value="viewCount">Most Viewed</option>
            </select>

            {/* Count */}
            <span className="text-xs text-gray-500 ml-auto">
              <span className="font-bold text-green-700">{meta.total}</span> ideas
            </span>
          </div>
        </div>
      </div>

      {/* ── Cards Grid ──────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 bg-white rounded-2xl border border-green-100 animate-pulse"
              />
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-1">
              No ideas found
            </h3>
            <p className="text-sm text-gray-400">
              Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ideas?.data?.map((idea:any) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onClick={() => setSelectedIdea(idea)}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ──────────────────────────────── */}
        {meta.totalPages > 1 && !isLoading && (
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-green-200 bg-white text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>

            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (meta.totalPages <= 7) return true;
                return p === 1 || p === meta.totalPages || Math.abs(p - page) <= 2;
              })
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && typeof arr[i - 1] === "number" && (p as number) - (arr[i - 1] as number) > 1) {
                  acc.push("...");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-9 h-9 text-sm font-semibold rounded-lg border transition-colors ${
                      p === page
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-white border-green-200 text-gray-600 hover:border-green-400 hover:bg-green-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === meta.totalPages}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-green-200 bg-white text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* ── Detail Modal ────────────────────────────────── */}
      {selectedIdea && (
        <IdeaDetailModal
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
        />
      )}
    </div>
  );
}
