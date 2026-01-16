import { AuthGuard } from '@/components/custom/AuthGuard/AuthGuard'
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