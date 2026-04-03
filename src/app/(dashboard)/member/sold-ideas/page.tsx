// member/my-sold/page.tsx
export const dynamic = "force-dynamic";

import MySoldTable from "@/components/modules/payment/mySoldTable";
import { getMySoldPayments } from "@/service/payment.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Page() {
  const queryClient = new QueryClient();
  const params = { page: 1, limit: 10 };

  await queryClient.prefetchQuery({
    queryKey: ["my-sold", params],
    queryFn: () => getMySoldPayments(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">My Sales</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track which of your ideas have been purchased.
            </p>
          </div>
          <MySoldTable />
        </div>
      </Suspense>
    </HydrationBoundary>
  );
}