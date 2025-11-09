import { createFileRoute } from '@tanstack/react-router'

import { MainPage } from './-components'
import { AuthPage } from './-components/Auth'
import { authStatusRequest } from '@/components/axios/axiosClient'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/')({
  component: HomePage,
})



function HomePage() {
  const {data: User, isLoading} = useQuery({
    queryKey: ['auth-status'],
    queryFn: () => authStatusRequest(),
    retry: 0,
    refetchOnWindowFocus: false,
  })
  if(isLoading){
    return <div>Loading...</div>
  }
  if(User?.status !== 200){
    // return ( <AuthPage/>)
  }

  return ( <MainPage/>)
}
