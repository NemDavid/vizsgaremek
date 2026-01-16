import { AuthGuard } from '@/components/custom/AuthGuard/AuthGuard'
import { createFileRoute } from '@tanstack/react-router'
import { ErtesitesSettings, SideBar } from '.'

export const Route = createFileRoute('/settings/notification')({
    component: () => (
        <AuthGuard>
            <RouteComponent />
        </AuthGuard>
    ),
})


function RouteComponent() {
    return (
        <SideBar>
            <ErtesitesSettings />
        </SideBar>
    )
}