
import { createFileRoute } from '@tanstack/react-router'
import { PasswordResetPage } from './-components/PasswordReset'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <PasswordResetPage onSwitch={()=> {}}/>
    </>
  )
}
