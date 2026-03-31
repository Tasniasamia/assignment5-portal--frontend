export const dynamic = "force-dynamic";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { verifyPayment } from "@/service/payment.service";
import SuccessPayment from "@/components/modules/payment/successPayment";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ idea?: string }>;
}) {
  const { idea } = await searchParams;

  const id = idea || "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["payment", id],
    queryFn: () => verifyPayment(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div className="min-h-screen bg-green-50" />}>
        <SuccessPayment id={id} />
      </Suspense>
    </HydrationBoundary>
  );
}