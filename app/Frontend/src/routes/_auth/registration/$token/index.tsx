import { createFileRoute } from '@tanstack/react-router'
import { ProfilSetupForm } from "@/components/ProfilForms"
import { Toaster } from "sonner"
import { useQuery } from '@tanstack/react-query'
import { TokenStatusRequest } from '@/components/axios/axiosClient'
import { NotFound } from '@/components/custom/NotFound/NotFound'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/_auth/registration/$token/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const token = params.token
  const { data, error } = useQuery({
    queryKey: ['token-validate'],
    queryFn: () => TokenStatusRequest(token),
    retry: false,
    refetchOnWindowFocus: false,
  })
  if (error && typeof error === "object" && "status" in error) {
    if (error.status === 404) {
      return <NotFound />
    }
  }
  if (data?.status == 200) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-red-900 to-slate-400">
        <div className="w-full max-w-sm bg-slate-100 p-6 rounded-4xl">
          <div className="flex items-center gap-2 font-medium">
            <div className="bg-rose-600 text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <img src="/icon.png" alt="Icon" className="rounded-md" />
            </div>
            <h1 className='text-xl'>
              Mi Hírünk
            </h1>
          </div>
          <ProfilSetupForm token={token} />
        </div>
        <Toaster richColors position="top-center" />
        
      </div>
    )
  }
  return <Spinner/>
}
