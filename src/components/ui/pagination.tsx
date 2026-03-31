// components/ui/Pagination.tsx
// ✅ Reusable — use anywhere with page, totalPages, onPageChange

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build page numbers with ellipsis
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => {
      if (totalPages <= 7) return true;
      return (
        p === 1 || p === totalPages || Math.abs(p - page) <= 1
      );
    })
    .reduce<(number | "...")[]>((acc, p, i, arr) => {
      if (
        i > 0 &&
        typeof arr[i - 1] === "number" &&
        (p as number) - (arr[i - 1] as number) > 1
      ) {
        acc.push("...");
      }
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap select-none">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl
          border border-green-200 bg-white text-green-800
          hover:bg-green-600 hover:border-green-600 hover:text-white
          disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white
          disabled:hover:text-green-800 disabled:hover:border-green-200
          transition-all duration-150"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
          >
            ···
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 text-sm font-bold rounded-xl border transition-all duration-150 ${
              p === page
                ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-200"
                : "bg-white border-green-200 text-gray-600 hover:border-green-400 hover:bg-green-50 hover:text-green-800"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl
          border border-green-200 bg-white text-green-800
          hover:bg-green-600 hover:border-green-600 hover:text-white
          disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white
          disabled:hover:text-green-800 disabled:hover:border-green-200
          transition-all duration-150"
      >
        Next
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}