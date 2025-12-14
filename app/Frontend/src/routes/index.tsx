import { createFileRoute } from '@tanstack/react-router'

import { MainPage } from './-components'
import { AuthGuard } from '@/components/AuthGuard'

export const Route = createFileRoute('/')({
  component: HomePage,
})



function HomePage() {
  return (
    <AuthGuard>
      <MainPage />
    </AuthGuard>
  )
}
