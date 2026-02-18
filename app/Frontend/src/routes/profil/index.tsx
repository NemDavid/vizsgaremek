import { GetusersByname } from '@/components/axios/axiosClient'
import { AuthGuard } from '@/components/custom/AuthGuard'
import { AvatarFrame } from '@/components/custom/AvatarFrame'
import { DefaultUIFrame } from '@/components/custom/DefaultUIFrame'
import { Loader } from '@/components/Loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/profil/')({
  component: () => (
    <AuthGuard>
      <RouteComponent />
    </AuthGuard>
  ),
})

function RouteComponent() {
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState("")
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300) // 300ms
    return () => clearTimeout(t)
  }, [search])
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['GetUsers', search],
    queryFn: () => GetusersByname(search),
    enabled: debounced.length >= 3 && search.length != 0,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
    refetchOnMount: false,
    staleTime: 10_000,
    gcTime: 5 * 60_000,
  })
  return (
    <DefaultUIFrame className="bg-red-100 p-6">
      <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-md">
        <Input
          type="text"
          placeholder="Felhasználó név"
          className="h-8 bg-rose-200"
          value={search}
          onInput={(e) =>
            setSearch((e.target as HTMLInputElement).value)
          }
        />
      </div>
      <div className='flex'>
        {(isLoading || isFetching) ? <Loader /> :
          <>
            {data?.data.map((e: any) => (
              <div key={e.ID} className='h-32! gap-3 p-2 m-2 bg-rose-100'>
                <AvatarFrame userid={e.ID} className='rounded-none'/>
                <Button>Open</Button>
              </div>
            ))}
          </>
        }
      </div>
    </DefaultUIFrame>
  )
}
