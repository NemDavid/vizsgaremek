import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DefaultUIFrame } from "@/components/custom/DefaultUIFrame/DefaultUIFrame";
import { AuthGuard } from "@/components/custom/AuthGuard/AuthGuard";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authStatusRequest, deletpost, GetProfil } from '@/components/axios/axiosClient';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PopOver } from '@/components/custom/OpenMenus/OpenMenus';
import { EllipsisVertical, TrashIcon, User } from 'lucide-react';
import { Loader } from '@/components/Loader/Loader';
import { UserProfileModify } from '@/components/ProfilForms';
import { BlockUser, ReqFriend } from '@/components/custom/UserConnectionButton/UserConnectionButton';
import { PostAccord } from '@/components/PostComponents';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AvatarFrame } from '@/components/custom/AvatarFrame';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
  const { data: auth } = useQuery<any>({
    queryKey: ["auth-status"],
    queryFn: authStatusRequest,
    enabled: false,
  })
  const { data: profil, isLoading } = useQuery({
    queryKey: ["profil", profilId],
    queryFn: () => GetProfil(profilId),
    retry: 0,
  })


  const UserID: any = profil?.data.USER_ID
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
      {/* DEFAULT (magas képernyő) */}
      <div className="sm:[@media(max-height:820px)]:hidden">
        {/* BANNER */}
        <div className="relative w-full h-40 bg-gradient-to-b from-red-600 to-red-100">
          <div className="absolute left-1/2 -bottom-16 -translate-x-1/2">
            <img
              src={profil?.data.avatar_url}
              alt={`${profil?.data.first_name} ${profil?.data.last_name}`}
              className="w-40 h-40 rounded-full border-4 border-slate-950 object-cover shadow-lg bg-slate-100"
            />
          </div>
        </div>

        {/* Név és statok (lelógós verzió) */}
        <div className="-mt-20 flex flex-col items-center text-center px-4 pb-5 bg-red-400 pt-40">
          <h1 className="text-2xl font-semibold">
            {profil?.data.first_name} {profil?.data.last_name}
          </h1>

          <div className="ml-auto">
            <ProfileMenu isMe={auth?.data.userID === UserID} profilId={UserID} profil={profil} />
          </div>

          <div className="flex gap-8 mt-4 text-sm text-slate-300">
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-lg">{profil?.data.friendCount}/{`${maxFriend}`}</span>
              <span>Barát</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-lg">{profil?.data.user.posts.length}</span>
              <span>Poszt</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-lg">{profil?.data.level}</span>
              <span>Szint</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 py-2">
            <ProfileInfo label="Bio" value={profil?.data.bio || ""} />
            <ProfileInfo label="Iskolák" value={profil?.data.schools || ""} />
            <ProfileInfo label="Születési dátum" value={profil?.data.birth_date || ""} />
            <ProfileInfo label="Születési hely" value={profil?.data.birth_place || ""} />
          </div>
        </div>
      </div>
      {/* COMPACT (<= 820px magasság) */}
      <div className="hidden sm:[@media(max-height:820px)]:block bg-red-400 px-4 py-4 border-b-10">
        {/* FELSŐ SOR: bal avatar+név | jobb infók */}
        <div className="grid grid-cols-2 gap-4 items-start">
          {/* BAL: avatar + név + menü */}
          <div className="flex items-center gap-4">
            <img
              src={profil?.data.avatar_url}
              alt={`${profil?.data.first_name} ${profil?.data.last_name}`}
              className="w-20 h-20 rounded-full border-4 border-slate-950 object-cover shadow-lg bg-slate-100 shrink-0"
            />

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-white truncate">
                {profil?.data.first_name} {profil?.data.last_name}
              </h1>
              <div className="mt-1">
                <ProfileMenu
                  isMe={auth?.data.userID === UserID}
                  profilId={UserID}
                  profil={profil}
                />
              </div>
            </div>
          </div>

          {/* JOBB: Bio/Iskolák/Születés... */}
          <div className="flex flex-wrap justify-end gap-3">
            <ProfileInfo label="Bio" value={profil?.data.bio || ""} />
            <ProfileInfo label="Iskolák" value={profil?.data.schools || ""} />
            <ProfileInfo label="Születési dátum" value={profil?.data.birth_date || ""} />
            <ProfileInfo label="Születési hely" value={profil?.data.birth_place || ""} />
          </div>
        </div>

        {/* ALUL: statok */}
        <div className="mt-4 flex justify-center gap-10 text-sm text-slate-200">
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-lg">
              {profil?.data.friendCount}/{`${maxFriend}`}
            </span>
            <span>Barát</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-lg">{profil?.data.user.posts.length}</span>
            <span>Poszt</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-lg">{profil?.data.level}</span>
            <span>Szint</span>
          </div>
        </div>
      </div>
      <div className="mt-10 px-6 hidden sm:block">
        <h2 className="text-xl font-semibold mb-4">Legutóbbi aktivitások</h2>
        <LastActivity posts={profil?.data.user.posts} myid={Number(UserID)} mypost={auth?.data.userID === UserID} />
      </div>
      <Accordion type="single" collapsible className='block sm:hidden bg-transparent'>
        <AccordionItem value="activites" className='bg-transparent'>
          <AccordionTrigger className="text-xl font-semibold mb-4 p-4">Legutóbbi aktivitások</AccordionTrigger>
          <AccordionContent>
            <LastActivity posts={profil?.data.user.posts} myid={Number(UserID)} mypost={auth?.data.userID === UserID} className="bg-rose-100! p-2 rounded-xl" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DefaultUIFrame>
  )
}

function LastActivity({ posts, myid, className }: { posts?: any[], myid: any, mypost: boolean, className?: string }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-sm text-slate-200">
        Nincs még aktivitás.
      </div>
    )
  }
  return (
    <div className={`bg-red-950 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {posts.map((p) => (
        <Dialog key={p.ID}>
          <DialogTrigger>
            <div className="max-h-48 overflow-y-auto pr-2 activity-scroll bg-red-200 rounded-xl text-black p-2 text-xl">
              <div className="flex items-center gap-3 bg-red-50 w-full rounded-full!">
                <AvatarFrame userid={myid} className="bg-red-100 rounded-2xl" />
                <h2 className="text-xl font-semibold tracking-tight">
                  {p.title}
                </h2>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className='bg-transparent border-0'>
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <PostAccord post={p} />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}




function ProfileInfo({ label, value }: { label: string; value?: string }) {
  if (!value || value === "" || value === "0000-00-00") return null

  return (
    <div className="flex flex-col items-center bg-rose-200 p-2 rounded-xl">
      <span className="text-black font-bold">{label}</span>
      <span className="bg-red-400 text-black w-full rounded-xl px-2">
        {value}
      </span>
    </div>
  )
}

function ProfileMenu({ isMe, profilId, profil }: any) {
  const nav = useNavigate()
  return (
    <PopOver
      trigger={<EllipsisVertical className="size-7" />}
      ButtonStyle="text-black bg-red-300 w-8 h-8 rounded-full"
      ContentStyle="bg-red-200 border border-red-500 rounded-3xl"
    >
      <div className="flex flex-col gap-2">
        {isMe ? (
          <>
            <UserProfileModify id={Number(profilId)} myuserdata={profil?.data} />
            <Button onClick={() => nav({ to: "/connections" })}>
              <User /> Barátaim
            </Button>
          </>
        ) : <NotmyProfil profilId={profilId} profil={profil} />}
      </div>
    </PopOver>
  )
}

function NotmyProfil({ profilId }: { profilId: any, profil: any }) {
  return (
    <>
      <ReqFriend userID={BigInt(profilId)} />
      <BlockUser userID={BigInt(profilId)} />
    </>
  )
}

