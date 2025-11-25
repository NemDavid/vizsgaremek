import { createFileRoute } from '@tanstack/react-router'
import { DefaultUIFrame } from "@/components/DefaultUIFrame";

export const Route = createFileRoute('/profil/$profilId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DefaultUIFrame className='bg-slate-950'>
      
    </DefaultUIFrame>
  )

}
