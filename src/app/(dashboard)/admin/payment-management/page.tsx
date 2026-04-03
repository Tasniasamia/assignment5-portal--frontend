export const dynamic = "force-dynamic";

import PaymentTable from "@/components/modules/payment/paymentTable";
import { getAllPaymentsAdmin } from "@/service/payment.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";

interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const queryClient = new QueryClient();
  const params = {
    page: Number(searchParams?.page ?? 1),
    limit: Number(searchParams?.limit ?? 10),
    sortBy: searchParams?.sortBy,
    sortOrder: searchParams?.sortOrder as "asc" | "desc" | undefined,
  };

  await queryClient.prefetchQuery({
    queryKey: ["admin-payments", params],
    queryFn: () => getAllPaymentsAdmin(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Payment Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              All transactions across the platform.
            </p>
          </div>
          <PaymentTable />
        </div>
      </Suspense>
    </HydrationBoundary>
  );
}