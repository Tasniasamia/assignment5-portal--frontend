export const dynamic = 'force-dynamic';
import MemberDashboard from "@/components/modules/dashboard/member/dashboard/memberDashboard";
import { getMemberStats } from "@/service/dashboard.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";


export default async function MemberDashboardPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["member-stats"],
    queryFn: getMemberStats,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={ <div>Loading...</div> }>
      <MemberDashboard />
      </Suspense>
    </HydrationBoundary>
  );
}
