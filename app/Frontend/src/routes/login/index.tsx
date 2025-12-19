import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '../-components/Auth';

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AuthPage Side="login" />;
}
