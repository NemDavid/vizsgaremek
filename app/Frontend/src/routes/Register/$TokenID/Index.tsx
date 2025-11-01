import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Register/$TokenID/Index')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Register/$TokenID/Index"!</div>
}
