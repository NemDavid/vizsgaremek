
import { Loader } from '@/components/Loader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Loader />
    </>
  )
}
