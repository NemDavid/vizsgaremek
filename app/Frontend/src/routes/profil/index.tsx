import { AuthGuard } from '@/components/custom/AuthGuard'
import { DefaultUIFrame } from '@/components/custom/DefaultUIFrame'
import UserSearchPage from '@/components/custom/UserSearchPage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/profil/')({
  component: () => (
    <AuthGuard>
      <RouteComponent />
    </AuthGuard>
  ),
})

function RouteComponent() {
  const [search, setSearch] = useState("");
  const nav = useNavigate()
  return (
    <DefaultUIFrame className='bg-red-100 p-6'>
      {/* <UserSearchPage/> */}
      <>
        <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-md">
          <Input type="text" placeholder="Felhasználó név" className="h-8 bg-rose-200" value={search}
            onChange={(e) => setSearch(e.target.value)} />
          <Button type="submit" variant="link" className="h-8 bg-rose-100" onClick={() => { nav({ to: "/profil/$profilId", params: { profilId: search } }) }}>
            Keres
          </Button>
        </div>
      </>

    </DefaultUIFrame>
  )
}
