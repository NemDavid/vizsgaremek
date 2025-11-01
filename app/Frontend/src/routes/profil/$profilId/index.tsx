import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profil/$profilId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profil/$profilId/"!</div>
}
