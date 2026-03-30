// import { getAllAdminIdeas } from "@/service/idea.service";
import IdeaTable from "@/components/modules/dashboard/admin/idea-management/ideaTable";
import { getAllCategory } from "@/service/idea.catetogory.service";
import { getAllAdminIdeas } from "@/service/idea.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
// import IdeaTable from "@/components/modules/dashboard/admin/idea-management/idea/ideaTable";

interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    categoryId?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const queryClient = new QueryClient();

  const params = {
    page: Number(searchParams.page ?? 1),
    limit: Number(searchParams.limit ?? 10),
    search: searchParams.search,
    status: searchParams.status,
    categoryId: searchParams.categoryId,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder as "asc" | "desc" | undefined,
    isDeleted:false
  };

  // ✅ Parallel prefetch
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["admin-ideas", params],
      queryFn: () => getAllAdminIdeas(params),
    }),
    queryClient.prefetchQuery({
      queryKey: ["category"],
      queryFn: getAllCategory,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Idea Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all submitted ideas — approve, reject, or review them.
          </p>
        </div>
        <IdeaTable />
      </div>
    </HydrationBoundary>
  );
}