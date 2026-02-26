import { AuthGuard } from '@/components/custom/AuthGuard/AuthGuard'
import { DefaultUIFrame } from '@/components/custom/DefaultUIFrame/DefaultUIFrame'
import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AvatarFrame } from '@/components/custom/AvatarFrame/AvatarFrame'
import { Button } from '@/components/ui/button'
import { Annoyed, ShieldBan, ShieldQuestionMark, Users } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authStatusRequest,GetMyFriends } from '@/components/axios/axiosClient'
import { KickButton } from '@/components/custom/Kick/kick'
import { AcceptFriend, BlockUserFromrequest, DeletFriend, RemoveBlock, RemoveRequest } from '@/components/custom/UserConnectionButton/UserConnectionButton'

export const Route = createFileRoute('/connections')({
  component: () => (
    <AuthGuard>
      <RouteComponent />
    </AuthGuard>
  ),
})



function RouteComponent() {
  const { data: Connections } = useQuery({
    queryKey: ["Friends"],
    queryFn: () => GetMyFriends()
  })
  const { data: auth } = useQuery<any>({
    queryKey: ["auth-status"],
    queryFn: authStatusRequest,
    enabled: false,
  })
  const PendingList = Connections?.data?.filter((item:any) => item.Status === "pending") || [];
  const blockedList = Connections?.data?.filter((item:any) => item.Status === "blocked") || [];
  const friendsList = Connections?.data?.filter((item:any) => item.Status === "accepted") || [];

  const [ShowMenu, setMenu] = useState("FriendsMenu");
  return (
    <DefaultUIFrame className='bg-red-100'>
      <div className='flex flex-col h-full'>
        <Card className='bg-red-200 border-0 border-b-1 border-red-700 shrink-0 rounded-none'>
          <CardHeader>
            <CardTitle>Ismerősök kezelése</CardTitle>
          </CardHeader>
          <CardContent className='flex gap-3'>
            <Button variant={'outline'} onClick={() => setMenu("FriendsMenu")} className={`bg-${ShowMenu === "FriendsMenu" ? "rose-300 border-black border-2" : "red-400"} hover:bg-rose-300`} ><Users /> Barátok</Button>
            <Button variant={'outline'} onClick={() => setMenu("FriendRequestMenu")} className={`bg-${ShowMenu === "FriendRequestMenu" ? "rose-300 border-black border-2" : "red-400"} hover:bg-rose-300`}><ShieldQuestionMark size={4} />Felkérések</Button>
            <Button variant={'outline'} onClick={() => setMenu("BlackListMenu")} className={`bg-${ShowMenu === "BlackListMenu" ? "rose-300 border-black border-2" : "red-400"} hover:bg-rose-300`}><ShieldBan size={4} />Tiltot Felhasználok</Button>
          </CardContent>
        </Card>
        <div className='flex-1 overflow-auto'>
          {ShowMenu !== "FriendsMenu" ? ShowMenu !== "FriendRequestMenu" ? <BlackListMenu list={blockedList} myid={BigInt(auth?.data.userID || 0n)} /> : <FriendRequestMenu list={PendingList} myid={BigInt(auth?.data.userID || 0n)} /> : <FriendsMenu list={friendsList} myid={BigInt(auth?.data.userID || 0n)} />}

        </div>
      </div>
    </DefaultUIFrame>
  )
}

function FriendsMenu({ list, myid }: { list: any[],myid: bigint, }) {
  return (
    <Card className='bg-red-300 h-full rounded-none pt-0 mt-0'>
      <CardHeader className='my-4 bg-red-100 mt-0 border-red-100 '>
        <CardTitle className='my-4'>
          <div className="flex items-center gap-2 text-2xl bg-red-200 w-fit p-2 rounded-full border-black border-1">
            <Users className="w-[1em] h-[1em]" />
            Barátok
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex gap-4 flex-wrap'>
          {list?.map((item: any) => (
            <FriendsList id={item.UserID} myid={myid}/>
          ))
          }
        </div>
      </CardContent>
    </Card>
  )
}

export function FriendsList({ id, className,myid }: { id: bigint, myid: bigint, className?: string }) {
  return (
    <div className={`bg-rose-100 flex items-center rounded-xl p-2 px-4 gap-3 ${className}`}>
      <AvatarFrame userid={id} className='max-w-max max-h-min p-0 bg-slate-200 m-0' />
      <KickButton id={id} myid={myid} className="w-min"/>
    </div>
  )
}

function FriendRequestMenu({ list, myid }: { list?: any[], myid: bigint }) {
  return (
    <Card className='bg-red-300 h-full rounded-none pt-0 mt-0'>
      <CardHeader className='my-4 bg-red-100 mt-0 border-red-100 '>
        <CardTitle className='my-4'>
          <div className="flex items-center gap-2 text-2xl bg-red-200 w-fit p-2 rounded-full border-black border-1">
            <ShieldQuestionMark className="w-[1em] h-[1em]" />
            Felkérések
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex gap-4 flex-wrap'>
          {list?.map((item: any) => (
            <FriendsreqListPerEach item={item} myid={myid} key={Number(item?.UserID)} />
          ))
          }
        </div>
      </CardContent>
    </Card>
  )
}
function FriendsreqListPerEach({ item, myid }: { item: any, myid: bigint }) {
  return (
    <div className='px-4 bg-rose-100 flex flex-col items-center rounded-xl'>
      {item.Requested_BY == myid ?
        <>
          <AvatarFrame userid={item?.UserID} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
        </>
        :
        <>
          <AvatarFrame userid={item?.Requested_BY || -1n} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
        </>
      }
      <div className='grid grid-cols-2 gap-2 w-full'>
        {item.Requested_BY == myid ?
          <>
            <RemoveRequest userID={item?.UserID} className='mb-2 mx-1 col-span-2' />
          </>
          :
          <>
            <AcceptFriend userID={item.Requested_BY || -1n} />
            <DeletFriend userID={item.Requested_BY || -1n} />
            <BlockUserFromrequest userID={item.Requested_BY || -1n} className="col-span-3" />
          </>
        }
      </div>
    </div>
  )
}

function BlackListMenu({ list, myid }: { list: any[], myid: bigint }) {
  return (
    <Card className='bg-red-300 h-full rounded-none pt-0 mt-0'>
      <CardHeader className='my-4 bg-red-100 mt-0 border-red-100 '>
        <CardTitle className='my-4'>
          <div className="flex items-center gap-2 text-2xl bg-red-200 w-fit p-2 rounded-full border-black border-1">
            <ShieldBan className="w-[1em] h-[1em]" />
            Tiltások
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex gap-4 flex-wrap'>
          {list?.map((item: any) => (
            <div className='px-4 bg-rose-100 flex flex-col items-center rounded-xl'>
              {item.Requested_BY == myid ?
                <>
                  <AvatarFrame userid={item?.UserID} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
                </>
                :
                <>
                  <AvatarFrame userid={item?.Requested_BY || -1n} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
                </>
              }
              {item.Requested_BY == myid ?
                <>
                  <RemoveBlock userID={item?.UserID || -1n}  />
                </>
                :
                <>
                  <div className='px-2 py-1 bg-rose-200 rounded-xl m-2 flex'><Annoyed className='p-1'/> Lelettél tiltva </div>
                </>
              }
            </div>
          ))
          }
        </div>
      </CardContent>
    </Card>
  )
}
