// app/(public)/ideas/page.tsx   ← তোমার route structure অনুযায়ী path রাখো

export const dynamic = "force-dynamic";

import PageBanner from "@/components/common/banner";
import IdeaGrid from "@/components/modules/ideas/IdeaGrid";
import { getAllCategory } from "@/service/idea.catetogory.service";
import { getAllIdeas } from "@/service/idea.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
    searchTerm?: string;
    categoryId?: string;
    type?: string;
    sortBy?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const queryClient = new QueryClient();

  const params = {
    page: Number(searchParams?.page ?? 1),
    limit: Number(searchParams?.limit ?? 10),
    searchTerm: searchParams?.searchTerm ?? "",
    categoryId: searchParams?.categoryId,
    sortBy: searchParams?.sortBy ?? "createdAt",
    sortOrder: "desc" as const,
    status: "APPROVED",
    isPublished: true,
    isDeleted: false,
    type:searchParams?.type ?? "",
  };

  // Parallel prefetch — server side
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["admin-ideas", params],
      queryFn: () => getAllIdeas(params as any),
    }),
    queryClient.prefetchQuery({
      queryKey: ["category"],
      queryFn: getAllCategory,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div className="min-h-screen bg-green-50" />}>
        <div className="min-h-screen bg-green-50">
          {/* Hero Banner */}
          <PageBanner title="Ideas"/>

          {/* Search + Filter + Cards */}
          <IdeaGrid />
        </div>
      </Suspense>
    </HydrationBoundary>
  );
}
