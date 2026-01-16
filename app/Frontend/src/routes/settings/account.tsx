import { createFileRoute } from '@tanstack/react-router'
import { FiokSettings, SideBar } from '.'
import { AuthGuard } from '@/components/custom/AuthGuard/AuthGuard'

export const Route = createFileRoute('/settings/account')({
  component: () => (
    <AuthGuard>
      <RouteComponent />
    </AuthGuard>
  ),
})


function RouteComponent() {
  return (
    <SideBar>
      <FiokSettings />
    </SideBar>
  )
}
