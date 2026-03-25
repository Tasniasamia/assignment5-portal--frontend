"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface IPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const LIMIT_OPTIONS = [10, 20, 30, 50];

export default function Pagination({
  page,
  limit,
  total,
  totalPages,
}: IPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // searchParams update helper
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        params.set(key, value);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateParams({ page: String(newPage) });
  };

  const handleLimitChange = (newLimit: string) => {
    // limit বদলালে page 1 এ ফিরে যাও
    updateParams({ limit: newLimit, page: "1" });
  };

  // কতটুকু দেখাচ্ছে
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // page numbers — max 5টা দেখাবে
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-2 py-4 flex-wrap gap-3">
      {/* বাম দিক — Show [10 ▼] Showing 1 to 10 of 56 entries */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Show</span>
        <select
          value={limit}
          onChange={(e) => handleLimitChange(e.target.value)}
          className="border  border-input rounded-md px-2 py-1 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          {LIMIT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span>
          Showing{" "}
          <span className="font-medium text-foreground">{from}</span> to{" "}
          <span className="font-medium text-foreground">{to}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span> entries
        </span>
      </div>

      {/* ডান দিক — Previous 1 2 3 ... Next */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 cursor-pointer text-sm border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 py-1.5 text-sm text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => handlePageChange(p as number)}
              className={`min-w-[36px] cursor-pointer px-3 py-1.5 text-sm border rounded-md transition-colors
                ${
                  page === p
                    ? "bg-foreground text-background border-foreground font-medium"
                    : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1.5 cursor-pointer text-sm border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}