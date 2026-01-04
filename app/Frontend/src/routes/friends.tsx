import { AuthGuard } from '@/components/AuthGuard'
import { DefaultUIFrame } from '@/components/DefaultUIFrame'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/friends')({
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

