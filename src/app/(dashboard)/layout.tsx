export const dynamic = 'force-dynamic';

import Footer from "@/components/modules/dashboard/layout/footer";
import Header from "@/components/modules/dashboard/layout/header";
import Sidebar from "@/components/modules/dashboard/layout/sidebar";
import { getUserInfo } from "@/service/auth.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: getUserInfo,
  });
  return (
    <HydrationBoundary state= { dehydrate(queryClient) } >
    <Suspense fallback={ <div>Loading...</div> }>

      <div
      className="flex h-screen overflow-hidden"
  style = {{ background: "#eceae0" }
}
    >
  <Sidebar />
  < div className = "flex flex-col flex-1 min-w-0 overflow-hidden" >
    <Header />

    < main
className = "flex-1 overflow-y-auto p-6"
style = {{ background: "#eceae0", scrollbarWidth: "none" }}
        >
  { children }
  </main>
  < Footer />
  </div>
  </div>
  </Suspense>
  </HydrationBoundary>
  );
}












