import { AuthPage } from '@/routes/-components/Auth';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/registration/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AuthPage Side="register" />;
}
