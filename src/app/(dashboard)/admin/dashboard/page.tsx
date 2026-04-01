export const dynamic = 'force-dynamic';

import AdminDashboard from "@/components/modules/dashboard/admin/dashboard/adminDashboard";
import { getAdminStats } from "@/service/dashboard.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function AdminDashboardPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["admin-stats"],
        queryFn: getAdminStats,
    });

    return (
        <HydrationBoundary state= { dehydrate(queryClient) } >
        <Suspense fallback={ <div>Loading...</div> }>
        <AdminDashboard />
        </Suspense>
        </HydrationBoundary>
  );
}