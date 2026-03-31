export const dynamic = 'force-dynamic'; 
import { getAllCategory } from '@/service/idea.catetogory.service'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
  } from '@tanstack/react-query'
import CategoryTable from '@/components/modules/dashboard/admin/idea-management/category/categoryTable'
import { Suspense } from 'react';
  export default async function Page() {
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
      queryKey: ['category'],
      queryFn: ()=>getAllCategory(),
    })
  
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<div>Loading...</div>}>

      <CategoryTable/>
            </Suspense>

      </HydrationBoundary>
    )
  }
