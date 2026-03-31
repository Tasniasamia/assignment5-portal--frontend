// import { getAllAdminIdeas } from "@/service/idea.service";
export const dynamic = 'force-dynamic'; 

import IdeaTable from "@/components/modules/dashboard/admin/idea-management/ideaTable";
import { getAllCategory } from "@/service/idea.catetogory.service";
import { getAllAdminIdeas } from "@/service/idea.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
// import IdeaTable from "@/components/modules/dashboard/admin/idea-management/idea/ideaTable";

interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
    searchTerm?: string;
    status?: string;
    categoryId?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const queryClient = new QueryClient();
  const params = {
    page: Number(searchParams?.page ?? 1),
    limit: Number(searchParams?.limit ?? 10),
    searchTerm: searchParams.searchTerm ?? "",
    status: searchParams?.status,
    categoryId: searchParams?.categoryId,
    sortBy: searchParams?.sortBy,
    sortOrder: searchParams?.sortOrder as "asc" | "desc" | undefined,
    isDeleted:false
  };

  // ✅ Parallel prefetch
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["admin-ideas", params],
      queryFn: () => getAllAdminIdeas(params as any),
    }),
    queryClient.prefetchQuery({
      queryKey: ["category"],
      queryFn: getAllCategory,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<div>Loading...</div>}>
    
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Idea Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all submitted ideas — approve, reject, or review them.
          </p>
        </div>
        <IdeaTable />
      </div>
      </Suspense>
    </HydrationBoundary>
  );
}