// member/my-payments/page.tsx
export const dynamic = "force-dynamic";

import MyPaymentTable from "@/components/modules/payment/myPaymentTable";
import { getMyPayments } from "@/service/payment.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Page() {
  const queryClient = new QueryClient();
  const params = { page: 1, limit: 10 };

  await queryClient.prefetchQuery({
    queryKey: ["my-payments", params],
    queryFn: () => getMyPayments(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">My Purchases</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ideas you have purchased.
            </p>
          </div>
          <MyPaymentTable />
        </div>
      </Suspense>
    </HydrationBoundary>
  );
}