import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DefaultUIFrame } from "@/components/DefaultUIFrame";
import { AuthGuard } from "@/components/AuthGuard";
import { useQuery } from '@tanstack/react-query';
import { authStatusRequest, GetProfil } from '@/components/axios/axiosClient';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PopOver } from '@/components/OpenMenus';
import { EllipsisVertical, ShieldX, User, UserMinus } from 'lucide-react';
import type { AuthResponse } from '@/components/axios/Types';
import { Loader } from '@/components/Loader';
import { UserProfileModify } from '@/components/UserProfilModify';
import { ReqFriend } from '@/components/UserConnectionButton';


export const Route = createFileRoute('/profil/$profilId/')({
  component: () => (
    <AuthGuard>
      <RouteComponent />
    </AuthGuard>
  ),
})

function RouteComponent() {
  const { profilId } = Route.useParams()
  const nav = useNavigate()
  const { data: auth } = useQuery<AuthResponse>({
    queryKey: ["auth-status"],
    queryFn: authStatusRequest,
    enabled: false,
  })
  const { data: profil, isLoading } = useQuery({
    queryKey: ["profil", profilId],
    queryFn: () => GetProfil(profilId),
    retry: 0,
  })
  const maxFriend: Number = (profil?.data.level || 50) + 50;
  if (isLoading) {
    return <Loader />
  }

  if (profil?.data == null) {
    return (
      <DefaultUIFrame className="bg-red-300 min-h-0 flex items-center justify-center">
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

    <DefaultUIFrame className='bg-red-300 text-white '>

      {/* BANNER */}
      <div className="relative w-full h-40 bg-gradient-to-b from-red-600 to-red-100">
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
      <div className="-mt-20 flex flex-col items-center text-center px-4 border-b-10 pb-5 bg-red-400 pt-40">
        <h1 className="text-2xl font-semibold">{profil?.data.first_name} {profil?.data.last_name}</h1>
        <div className={`ml-auto`}>
          {auth?.data.userID == Number(profilId) ?
            <PopOver trigger={<EllipsisVertical className='size-7' />} ButtonStyle='text-black bg-red-300 w-8 h-8 rounded-full' ContentStyle='bg-red-200 border-solid border-1 border-red-500 rounded-3xl'>
              <div className="flex flex-col gap-2">
                <UserProfileModify id={Number(profilId)} myuserdata={profil?.data} />
                <Button className='bg-red-400 hover:bg-red-100 hover:text-red-800' onClick={() => nav({ to: "/friends" })}><User className='text-black' />Barátaim</Button>
              </div>
            </PopOver>
            :
            <PopOver trigger={<EllipsisVertical className='size-7' />} ButtonStyle='text-black bg-red-300 w-8 h-8 rounded-full' ContentStyle='bg-red-200 border-solid border-1 border-red-500 rounded-3xl'>
              <div className="flex flex-col gap-2">
                <ReqFriend userID={BigInt(profilId)} />
                <Button className='bg-red-400 hover:bg-red-100 hover:text-red-800' disabled><UserMinus className='text-black' />Barát elutasitása</Button>
                <Button className='bg-red-400 hover:bg-red-100 hover:text-red-800'><ShieldX className='text-black Hove' />Tiltás</Button>
              </div>
            </PopOver>
          }
        </div>
        <div className="flex gap-8 mt-4 text-sm text-slate-300">
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-lg">{profil?.data.friendCount}/{`${maxFriend}`}</span>
            <span>Barát</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-lg">{profil?.data.user.post.length}</span>
            <span>Poszt</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-lg">{profil?.data.level}</span>
            <span>Szint</span>
          </div>
        </div>
        <div className='flex flex-wrap gap-6 py-2'>
          {profil?.data.bio !== "" ?
            <div className="flex flex-col items-center bg-rose-200 p-2 rounded-xl">
              <span className='text-black font-bold'>Bio</span>
              <span className="bg-red-400 text-black w-full rounded-xl px-2">{profil?.data.bio}</span>
            </div>
            :
            ""
          }
          {profil?.data.schools !== "" ?
            <div className="flex flex-col items-center bg-rose-200 p-2 rounded-xl">
              <span className='text-black font-bold'>Iskolák</span>
              <span className="bg-red-400 text-black w-full rounded-xl px-2">{profil?.data.schools}</span>
            </div>
            :
            ""
          }
          {profil?.data.birth_date !== "0000-00-00" ?
            <div className="flex flex-col items-center bg-rose-200 p-2 rounded-xl">
              <span className='text-black font-bold'>Születési Dátum</span>
              <span className="bg-red-400 text-black w-full rounded-xl px-2">{profil?.data.birth_date}</span>
            </div>
            :
            ""
          }
          {profil?.data.birth_place !== "" ?
            <div className="flex flex-col items-center bg-rose-200 p-2 rounded-xl">
              <span className='text-black font-bold'>Születési hely</span>
              <span className="bg-red-400 text-black w-full rounded-xl px-2">{profil?.data.birth_place}</span>
            </div>
            :
            ""
          }
        </div>
      </div>
      <div className="mt-10 px-6">
        <h2 className="text-xl font-semibold mb-4">Legutóbbi aktivitások</h2>
        <div className="space-y-4 ">
          
        </div>
      </div>

    </DefaultUIFrame>
  )

}
