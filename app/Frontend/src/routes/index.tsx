import { createFileRoute } from '@tanstack/react-router'

import { MainPage } from './-components'
import { AuthPage } from './-components/Auth'
import { useQuery } from '@tanstack/react-query'
import { authStatusRequest } from '@/components/axios/axiosClient'
import { Loader } from '@/components/Loader'

export const Route = createFileRoute('/')({
  component: HomePage,
})



function HomePage() {
  const { data: User, isLoading } = useQuery({
    queryKey: ["auth-status"],
    queryFn() {
      const res = authStatusRequest()

      return res
    },
    retry: 0,
    refetchOnWindowFocus: false,
  })
  if (isLoading) return <Loader/>

  if (!isLoading && User?.status !== 200) {
    return <AuthPage />
  }

  if (User?.status !== 200) return null

  return (
    <MainPage />
  )
}
