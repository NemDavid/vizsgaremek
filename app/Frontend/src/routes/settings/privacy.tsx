import { AuthGuard } from '@/components/AuthGuard'
import { createFileRoute } from '@tanstack/react-router'
import { AdatvedelemSettings, SideBar } from '.'

export const Route = createFileRoute('/settings/privacy')({
  component: () => (
    <AuthGuard>
      <RouteComponent />
    </AuthGuard>
  ),
})

function RouteComponent() {
  return (
    <SideBar>
      <AdatvedelemSettings />
    </SideBar>
  )
}