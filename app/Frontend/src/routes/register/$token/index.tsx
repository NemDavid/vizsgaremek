import { createFileRoute } from '@tanstack/react-router'
import { ProfilSetupForm } from "@/components/profil-setup-form"

export const Route = createFileRoute('/register/$token/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const token = params.token
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-slate-200">
      <div className="w-full max-w-sm bg-slate-100 p-6 rounded-4xl">
        <div className="flex items-center gap-2 font-medium">
            <div className="bg-rose-600 text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <img src="/icon.png" alt="Icon" className="rounded-md"/>
            </div>
            <h1 className='text-xl'>
                Mi Hírünk
            </h1>
        </div>
        <ProfilSetupForm token={token} />
      </div>
    </div>
  )
}
