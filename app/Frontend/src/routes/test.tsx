import { DrawerFriends } from '@/components/Drawer-Friends'
import { ForgetPasswordModal } from '@/components/Forget-Password-Modal'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <DrawerFriends/>
    <ForgetPasswordModal/>
    </>
  )
}
