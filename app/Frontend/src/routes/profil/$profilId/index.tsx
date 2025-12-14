import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { DefaultUIFrame } from "@/components/DefaultUIFrame";
import { AuthGuard } from "@/components/AuthGuard";
import { useQuery } from '@tanstack/react-query';
import { GetProfil } from '@/components/axios/axiosClient';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"


export const Route = createFileRoute('/profil/$profilId/')({
  component: () => (
    <AuthGuard>
      <RouteComponent />
    </AuthGuard>
  ),
})

type user_profil = {
  USER_ID: number,
  first_name: string,
  last_name: string,
  birth_date: string,
  birth_place: string,
  schools: string,
  bio: string,
  avatar_url: string,
  level: number,
  postsNumber: number,
}


function RouteComponent() {
  const { profilId } = Route.useParams()
  const nav = useNavigate()

  const { data: profil, isLoading } = useQuery({
    queryKey: ["profil", profilId],
    queryFn: () => GetProfil(profilId),
  })

  if (isLoading) {
    return <Spinner />
  }


  if (profil?.data == null) {
    return (
      <DefaultUIFrame className="bg-slate-500 min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full text-center shadow-xl">
          <CardHeader>
            <CardTitle>Profil nem található</CardTitle>
            <CardDescription>
              A keresett felhasználó nem létezik vagy törölve lett.
            </CardDescription>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground">
            Elképzelhető, hogy hibás a hivatkozás, vagy a profil már nem érhető el.
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button onClick={() => nav({ to: "/" })}>
              Vissza a főoldalra
            </Button>
          </CardFooter>
        </Card>
      </DefaultUIFrame>
    )
  }

  return (

    <DefaultUIFrame className='bg-slate-500 min-h-screen text-white"'>

      {/* BANNER */}
      <div className="relative w-full h-40 bg-gradient-to-b from-indigo-600 to-purple-100">
        {/* Profilkép lelógva középre */}
        <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
          <img
            src={profil?.data.avatar_url}
            alt={`${profil?.data.first_name} ${profil?.data.last_name}`}
            className="w-40 h-40 rounded-full border-4 border-slate-950 object-cover shadow-lg bg-slate-100"
          />
        </div>
      </div>

      {/* Név és statok */}
      <div className="-mt-20 flex flex-col items-center text-center px-4 border-b-10 pb-5 bg-slate-400 pt-40">
        <h1 className="text-2xl font-semibold">{profil?.data.first_name} {profil?.data.last_name}</h1>

        <div className="flex gap-8 mt-4 text-sm text-slate-300">
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-lg">42</span>
            <span>Barát</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-lg">128</span>
            <span>Poszt</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-lg">{profil?.data.level}</span>
            <span>Szint</span>
          </div>
        </div>
      </div>

      {/* Legutóbbi aktivitások */}
      <div className="mt-10 px-6 pb-10">
        <h2 className="text-xl font-semibold mb-4">Legutóbbi aktivitások</h2>

        {/* Lista — te töltöd majd meg */}
        <div className="space-y-4">
          {/* Példák törölve — üresen hagyva neked */}
        </div>
      </div>

    </DefaultUIFrame>
  )

}
