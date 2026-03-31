export const dynamic = "force-dynamic";

import PageBanner from "@/components/common/banner";
import IdeaDetailsComponent from "@/components/modules/ideas/ideaDetailsComponent";
import { getIdeaById } from "@/service/idea.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const queryClient = new QueryClient();

  // ✅ MUST unwrap params
  const { id } = await params;

  // server prefetch
  await queryClient.prefetchQuery({
    queryKey: ["idea", id],
    queryFn: () => getIdeaById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div className="min-h-screen bg-green-50" />}>
        <div className="min-h-screen bg-green-50">
          
          {/* Hero Banner */}
          <PageBanner title="Idea Details" />

          {/* Idea Details */}
          <IdeaDetailsComponent id={id} />
        </div>
      </Suspense>
    </HydrationBoundary>
  );
}