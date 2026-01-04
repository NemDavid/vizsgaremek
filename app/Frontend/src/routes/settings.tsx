import { AuthGuard } from '@/components/AuthGuard'
import { DefaultUIFrame } from '@/components/DefaultUIFrame'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: () => (
    <AuthGuard>
      <RouteComponent />
    </AuthGuard>
  ),
})

function RouteComponent() {
  return (
    <DefaultUIFrame>


    </DefaultUIFrame>
  )
}
