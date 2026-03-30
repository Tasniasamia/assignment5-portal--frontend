import { getUserInfo } from "@/service/auth.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Profile from "@/components/modules/dashboard/profile/profile";

export default async function Page() {
const queryClient = new QueryClient();
await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: getUserInfo,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile
      />
    </HydrationBoundary>
  );
}

