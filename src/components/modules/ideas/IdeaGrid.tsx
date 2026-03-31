// "use client";

// import { useState, useRef, useCallback } from "react";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { getAllCategory } from "@/service/idea.catetogory.service";
// import { getAllIdeas } from "@/service/idea.service";
// import IdeaDetailModal from "./IdeaDetailModal";
// import IdeaCard, { IIdea } from "./IdeaCard";
// import Pagination from "@/components/common/pagination";

// // ─── helpers ─────────────────────────────────────────────


// // ─── skeleton card ────────────────────────────────────────
// function SkeletonCard() {
//   return (
//     <div className= "bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse" >
//     <div className="h-44 bg-gradient-to-br from-green-50 to-gray-100" />
//       <div className="p-5 space-y-3" >
//         <div className="flex gap-2" >
//           <div className="h-4 w-16 bg-green-100 rounded-full" />
//             <div className="h-4 w-10 bg-gray-100 rounded-full" />
//               </div>
//               < div className = "h-5 w-3/4 bg-gray-100 rounded-lg" />
//                 <div className="h-4 w-full bg-gray-50 rounded-lg" />
//                   <div className="h-4 w-2/3 bg-gray-50 rounded-lg" />
//                     <div className="flex justify-between pt-2" >
//                       <div className="h-4 w-20 bg-green-50 rounded-full" />
//                         <div className="h-4 w-16 bg-gray-50 rounded-full" />
//                           </div>
//                           </div>
//                           </div>
//   );
// }

// // ─── inline idea card (replaces IdeaCard if you prefer)  ──
// // kept separate for flexibility; using your existing IdeaCard below

// // ─── main component ───────────────────────────────────────
// export default function IdeaGrid() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const page = Number(searchParams.get("page") ?? 1);
//   const searchTerm = searchParams.get("searchTerm") ?? "";
//   const categoryId = searchParams.get("categoryId") ?? "";
//   const limit :number|string = searchParams.get("limit") ?? 10;
//   const type:string=searchParams.get("type") ?? "";
//   const sortBy = searchParams.get("sortBy") ?? "createdAt";

//   const [localSearch, setLocalSearch] = useState(searchTerm);
//   const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // ── param helpers ────────────────────────────────────────
//   const updateParams = useCallback(
//     (updates: Record<string, string>) => {
//       const params = new URLSearchParams(searchParams.toString());
//       Object.entries(updates).forEach(([k, v]) => {
//         if (v) params.set(k, v);
//         else params.delete(k);
//       });
//       params.set("page", "1");
//       params.set("limit", limit as any);
//       router.push(`${pathname}?${params.toString()}`);
//     },
//     [searchParams, pathname, router]
//   );

//   const setPage = (p: number) => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.set("page", String(p));
//     router.push(`${pathname}?${params.toString()}`);
//     window.scrollTo({ top: 380, behavior: "smooth" });
//   };

//   // ── queries ──────────────────────────────────────────────
//   const queryParams = {
//     page,
//     limit,
//     searchTerm,
//     categoryId: categoryId || undefined,
//     sortBy,
//     sortOrder: "desc" as const,
//     status: "APPROVED",
//     isPublished: true,
//     isDeleted: false,
//     type:""
//   };

//   const { data: ideasData, isLoading } = useQuery({
//     queryKey: ["admin-ideas", queryParams],
//     queryFn: () => getAllIdeas(queryParams as any),
//   });

//   const { data: categoriesData } = useQuery({
//     queryKey: ["category"],
//     queryFn: getAllCategory,
//   });

//   const ideas: any = ideasData?.data?.data || ideasData?.data || [];
//   const meta: {
//     page: number,
//     limit: number,
//     total: number,
//     totalPages: number
//   } = ideasData?.data?.meta || { page: 1, totalPages: 1, total: 0 };
//   const categories: any = categoriesData?.data || categoriesData || [];

//   // ── search debounce ──────────────────────────────────────
//   const handleSearch = (val: string) => {
//     setLocalSearch(val);

//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       updateParams({ searchTerm: val });
//     }, 420);
//   };

//   const hasFilters = !!(searchTerm || categoryId || sortBy !== "createdAt");

//   return (
//     <div className= "min-h-screen bg-[#f6fdf7]" >

//     {/* ══════════════════════════════════════════════════════
//           FILTER BAR
//       ══════════════════════════════════════════════════════ */}
//     < div className = "sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-green-100" >
//       <div className="max-w-6xl mx-auto px-4 md:px-8" >
//         <div className="py-3 flex flex-wrap gap-2.5 items-center" >

//           {/* Search */ }
//           < div className = "relative flex-1 min-w-[200px] max-w-sm" >
//             {/* Search */ }
//             < div className = "relative flex-1 min-w-[180px]" >
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" >
//                 🔍
//   </span>
//     < input
//   value = { localSearch }
//   onChange = {(e) =>
//   handleSearch(e.target.value)
// } placeholder = "Search ideas..."
// className = "w-full pl-9 pr-2 py-2 text-sm rounded-lg border border-green-200 focus:outline-none focus:border-green-400 placeholder-gray-400 bg-green-50/50"
//   />
//   </div>
// {
//   localSearch && (
//     <button
//                   onClick={ () => handleSearch("") }
//   className = "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center"
//     >
//     <svg fill="none" stroke = "currentColor" viewBox = "0 0 24 24" className = "w-3.5 h-3.5" >
//       <path strokeLinecap="round" strokeLinejoin = "round" strokeWidth = { 2.5}
//   d = "M6 18L18 6M6 6l12 12" />
//     </svg>
//     </button>
//               )
// }
// </div>

// {/* Divider */ }
// <div className="hidden md:block h-6 w-px bg-green-100" />

//   {/* Category */ }
//   < div className = "flex gap-4" >
//     <select
// value={ categoryId }
// onChange = {(e) => updateParams({ categoryId: e.target.value })}
// className = "appearance-none pl-3 pr-8 py-2.5 text-sm rounded-xl border border-green-200" >
//   <option value="" > All Categories </option>
// {
//   categories?.map((cat: any) => (
//     <option key= { cat.id } value = { cat.id } > { cat.name } </option>
//   ))
// }
// </select>
//     <select
// value={type}
// onChange = {(e) => updateParams({ type: e.target.value })}
// className = "appearance-none pl-3 pr-8 py-2.5 text-sm rounded-xl border border-green-200" >
//   <option value="" > All Types </option>

//     <option  value = "FREE" > FREE</option>
  

// </select>
//   < svg className = "absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-green-500 pointer-events-none"
// fill = "none" stroke = "currentColor" viewBox = "0 0 24 24" >
//   <path strokeLinecap="round" strokeLinejoin = "round" strokeWidth = { 2.5} d = "M19 9l-7 7-7-7" />
//     </svg>
//     </div>


//     </div>
//     </div>
//     </div>

// {/* ══════════════════════════════════════════════════════
//           CARDS GRID
//       ══════════════════════════════════════════════════════ */}
// <div className="max-w-6xl mx-auto px-4 md:px-8 py-8" >

//   {/* Active filter chips */ }
// {
//   hasFilters && (
//     <div className="flex flex-wrap gap-2 mb-6" >
//       { searchTerm && (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full" >
//                 🔍 "{searchTerm}"
//     < button onClick = {() => { setLocalSearch(""); updateParams({ searchTerm: "" }); }
// }
// className = "hover:text-red-500 transition-colors" >✕</button>
//   </span>
//             )}
// {
//   categoryId && (
//     <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full" >
//                 📂 { categories.find((c:any) => c.id === categoryId)?.name || "Category" }
//   <button onClick={ () => updateParams({ categoryId: "" }) }
//   className = "hover:text-red-500 transition-colors" >✕</button>
//     </span>
//             )
// }

// </div>
//         )}

// {/* Grid */ }
// {
//   isLoading ? (
//     <div className= "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" >
//     { Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={ i } />) }
//     </div>
//         ) : ideas.length === 0 ? (
//     <div className= "flex flex-col items-center justify-center py-24 text-center" >
//     <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mb-5" >
//               🌱
//   </div>
//     < h3 className = "text-xl font-bold text-gray-700 mb-2" > No ideas found </h3>
//       < p className = "text-sm text-gray-400 max-w-xs" >
//       {
//         hasFilters
//         ? "Try adjusting your filters or clearing your search."
//           : "No ideas have been published yet."
//       }
//         </p>
//   {
//     hasFilters && (
//       <button
//                 onClick={ () => { setLocalSearch(""); router.push(pathname); } }
//     className = "mt-5 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
//       >
//       Clear all filters
//         </button> 
//             )
//   }
//   </div>
//         ) : (
//     <div className= "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" >
//     {
//       ideas.map((idea: any, i: number) => (
//         <div
//                 key= { idea.id }
//                 style = {{ animationDelay: `${i * 40}ms` }}
//   className = "animate-in fade-in slide-in-from-bottom-2 duration-300"
//     >
//     <IdeaCard
//                   idea={ idea }
//   onClick = {() => router.push(`/idea/${idea?.id}`)
// }
//                 />
//   </div>
//             ))}
// </div>
//         )}

// {/* Pagination */ }
// {
//   meta && (
//     <Pagination
//           page={ meta.page || 1 }
//   limit = { meta?.limit || 10}
// total = { meta.total || 0 }
// totalPages = { meta.totalPages || 0 }
//   />
//       )
// }

// </div>

// {/* Detail Modal */ }

        
      
// </div>
//   );
// }
"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "@/service/idea.catetogory.service";
import { getAllIdeas } from "@/service/idea.service";
import IdeaCard from "./IdeaCard";
import Pagination from "@/components/common/pagination";

// ─── skeleton card ────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-44 bg-gradient-to-br from-green-50 to-gray-100" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-green-100 rounded-full" />
          <div className="h-4 w-10 bg-gray-100 rounded-full" />
        </div>
        <div className="h-5 w-3/4 bg-gray-100 rounded-lg" />
        <div className="h-4 w-full bg-gray-50 rounded-lg" />
        <div className="h-4 w-2/3 bg-gray-50 rounded-lg" />
        <div className="flex justify-between pt-2">
          <div className="h-4 w-20 bg-green-50 rounded-full" />
          <div className="h-4 w-16 bg-gray-50 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function IdeaGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const searchTerm = searchParams.get("searchTerm") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const limit = Number(searchParams.get("limit") ?? 10);
  const type = searchParams.get("type") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "createdAt";

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  // ── param helpers ────────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });

      params.set("page", "1");
      params.set("limit", String(limit));

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router, limit]
  );

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  // ── queries ──────────────────────────────────────────────
  const queryParams = {
    page,
    limit,
    searchTerm,
    categoryId: categoryId || undefined,
    sortBy,
    sortOrder: "desc" as const,
    status: "APPROVED",
    isPublished: true,
    isDeleted: false,
    type: type || undefined,
  };

  const { data: ideasData, isLoading } = useQuery({
    queryKey: ["ideas", queryParams],
    queryFn: () => getAllIdeas(queryParams as any),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["category"],
    queryFn: getAllCategory,
  });

  const ideas = ideasData?.data?.data || [];
  const meta = ideasData?.data?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const categories = categoriesData?.data || [];

  // ── search debounce ──────────────────────────────────────
  const handleSearch = (val: string) => {
    setLocalSearch(val);

    if (searchTimer.current) clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(() => {
      updateParams({ searchTerm: val });
    }, 400);
  };

  const hasFilters = !!(searchTerm || categoryId || type);

  return (
    <div className="min-h-screen bg-[#f6fdf7]">

      {/* FILTER BAR */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex flex-wrap gap-3 items-center">

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>

            <input
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search ideas..."
              className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-green-200 focus:outline-none focus:border-green-400 bg-green-50/50"
            />

            {localSearch && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category */}
          <select
            value={categoryId}
            onChange={(e) => updateParams({ categoryId: e.target.value })}
            className="px-3 py-2 text-sm rounded-xl border border-green-200"
          >
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Type */}
          <select
            value={type}
            onChange={(e) => updateParams({ type: e.target.value })}
            className="px-3 py-2 text-sm rounded-xl border border-green-200"
          >
            <option value="">All Types</option>
            <option value="FREE">FREE</option>
            <option value="PAID">PAID</option>
          </select>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-20">No ideas found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ideas.map((idea: any, i: number) => (
              <div key={idea.id}>
                <IdeaCard
                  idea={idea}
                  onClick={() => router.push(`/idea/${idea.id}`)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          totalPages={meta.totalPages}
        />
      </div>
    </div>
  );
}