import { getAllCategory } from '@/service/idea.catetogory.service'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
  } from '@tanstack/react-query'
import CategoryTable from '@/components/modules/dashboard/admin/idea-management/category/categoryTable'
  export default async function Page() {
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
      queryKey: ['category'],
      queryFn: ()=>getAllCategory(),
    })
  
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryTable/>
      </HydrationBoundary>
    )
  }
