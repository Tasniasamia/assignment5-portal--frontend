export const dynamic = "force-dynamic";

import UserTable from "@/components/modules/dashboard/admin/user-management/userTable";
import { getAllUsers } from "@/service/dashboard.service";
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
    status?: string;
    role?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const queryClient = new QueryClient();

  const params = {
    page: Number(searchParams?.page ?? 1),
    limit: Number(searchParams?.limit ?? 10),
    search: searchParams?.searchTerm ?? undefined,
    status: searchParams?.status,
    role: searchParams?.role,
  };

  await queryClient.prefetchQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getAllUsers(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all users — update roles, block/activate, or remove accounts.
            </p>
          </div>
          <UserTable />
        </div>
      </Suspense>
    </HydrationBoundary>
  );
}
