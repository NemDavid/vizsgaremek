import { AuthPage } from '@/routes/-components/Auth';
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AuthPage Side="login" />;
}
