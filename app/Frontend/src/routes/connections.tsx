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
import { authStatusRequest, GetMyconnections } from '@/components/axios/axiosClient'
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
    const { data: auth } = useQuery<any>({
        queryKey: ["auth-status"],
        queryFn: authStatusRequest,
        enabled: false,
    })
    const [ShowMenu, setMenu] = useState("FriendsMenu");
    return (
        <DefaultUIFrame className='bg-red-100 w-full'>
            <div className='flex flex-col h-full shrink-0'>
                <Card className='bg-red-200 border-0 border-b-1 border-red-700 shrink-0 rounded-none'>
                    <CardHeader>
                        <CardTitle>Ismerősök kezelése</CardTitle>
                    </CardHeader>
                    <CardContent className='flex gap-3 flex-wrap'>
                        <Button variant={'outline'} onClick={() => setMenu("FriendsMenu")} className={`bg-${ShowMenu === "FriendsMenu" ? "rose-300 border-black border-2" : "red-400"} hover:bg-rose-300`} ><Users /> Barátok</Button>
                        <Button variant={'outline'} onClick={() => setMenu("FriendRequestMenu")} className={`bg-${ShowMenu === "FriendRequestMenu" ? "rose-300 border-black border-2" : "red-400"} hover:bg-rose-300`}><ShieldQuestionMark size={4} />Felkérések</Button>
                        <Button variant={'outline'} onClick={() => setMenu("BlackListMenu")} className={`bg-${ShowMenu === "BlackListMenu" ? "rose-300 border-black border-2" : "red-400"} hover:bg-rose-300`}><ShieldBan size={4} />Tiltot Felhasználok</Button>
                    </CardContent>
                </Card>
                <div className='flex-1 overflow-auto p-3'>
                    {ShowMenu !== "FriendsMenu" ? ShowMenu !== "FriendRequestMenu" ? <BlackListMenu /> : <FriendRequestMenu myid={BigInt(auth?.data.userID || 0n)} /> : <FriendsMenu myid={BigInt(auth?.data.userID || 0n)} />}

                </div>
            </div>
        </DefaultUIFrame>
    )
}

function FriendsMenu({ myid }: { myid: bigint, }) {
    const { data: friends } = useQuery({
        queryKey: ["Connection", "Friends"],
        queryFn: () => GetMyconnections("accepted")
    })
    return (
        <Card className='bg-red-300 pt-0 mt-0'>
            <CardHeader className='p-0! m-0 bg-transparent border-red-100 border-b pl-4!'>
                <CardTitle className='my-4 flex items-center gap-2 text-2xl bg-red-200 w-fit p-2 rounded-full border-black border-1'>
                    <Users className="w-[1em] h-[1em]" />
                    Barátok
                </CardTitle>
            </CardHeader>
            <CardContent className='flex gap-4 flex-wrap p-3'>
                {friends?.data.map((item: any) => (
                    <FriendsList id={item.ID} myid={myid} userData={item} key={item.ID} className='' />
                ))
                }
            </CardContent>
        </Card>
    )
}

export function FriendsList({ id, className, myid, userData, avatarClass }: { id: bigint, myid: bigint, className?: string, userData?: any, avatarClass?: string }) {
    return (
        <div className={`bg-rose-100 flex items-center rounded-xl p-2 px-4 gap-3 ${className}`}>
            <AvatarFrame className={`max-w-max max-h-min p-0 bg-slate-200 m-0 ${avatarClass}`} userData={userData} />
            <KickButton id={id||userData.profile.ID} myid={`${myid}`} className="w-min" />
        </div>
    )
}

function FriendRequestMenu({ myid }: { myid: bigint }) {
    const { data: requested } = useQuery({
        queryKey: ["Connection", "pending"],
        queryFn: () => GetMyconnections("pending")
    })
    return (
        <Card className='bg-red-300 pt-0 mt-0'>
            <CardHeader className='p-0! m-0 bg-transparent border-red-100 border-b pl-4!'>
                <CardTitle className='my-4 flex items-center gap-2 text-2xl bg-red-200 w-fit p-2 rounded-full border-black border-1'>
                    <ShieldQuestionMark className="w-[1em] h-[1em]" />
                    Felkérések
                </CardTitle>
            </CardHeader>
            <CardContent className='flex gap-4 flex-wrap p-3'>
                {requested?.data.map((item: any) => (
                    <FriendsreqListPerEach item={item} myid={myid} key={Number(item?.ID)} />
                ))
                }
            </CardContent>
        </Card>
    )
}
function FriendsreqListPerEach({ item }: { item: any, myid?: bigint }) {
    return (
        <div className='px-4 bg-rose-100 flex flex-col items-center rounded-xl'>
            {item.connection_status == "waiting" ?
                <>
                    <AvatarFrame userid={item?.ID} userData={item} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
                </>
                :
                <>
                    <AvatarFrame userid={item?.ID || -1n} userData={item} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
                </>
            }
            <div className='grid grid-cols-2 gap-2 w-full'>
                {item.connection_status == "waiting" ?
                    <>
                        <RemoveRequest userID={item?.ID} className='mb-2 mx-1 col-span-2' />
                    </>
                    :
                    <>
                        <AcceptFriend userID={item.ID || -1n} />
                        <DeletFriend userID={item.ID || -1n} />
                        <BlockUserFromrequest userID={item.ID || -1n} className="col-span-3" />
                    </>
                }
            </div>
        </div>
    )
}

function BlackListMenu() {
    const { data: blocked } = useQuery({
        queryKey: ["Connection", "blocked"],
        queryFn: () => GetMyconnections("blocked")
    })
    return (
        <Card className='bg-red-300 pt-0 mt-0'>
            <CardHeader className='p-0! m-0 bg-transparent border-red-100 border-b pl-4!'>
                <CardTitle className='my-4 flex items-center gap-2 text-2xl bg-red-200 w-fit p-2 rounded-full border-black border-1'>
                    <ShieldBan className="w-[1em] h-[1em]" />
                    Tiltások
                </CardTitle>
            </CardHeader>
            <CardContent className='flex gap-4 flex-wrap p-3'>
                {blocked?.data.map((item: any) => (
                    <div className='px-4 bg-rose-100 flex flex-col items-center rounded-xl'>
                        {item.connection_status != "blocked_me" ?
                            <>
                                <AvatarFrame userData={item} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
                            </>
                            :
                            <>
                                <AvatarFrame userData={item} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
                            </>
                        }
                        {item.connection_status != "blocked_me" ?
                            <>
                                <RemoveBlock userID={item?.ID || -1n} />
                            </>
                            :
                            <>
                                <div className='px-2 py-1 bg-rose-200 rounded-xl m-2 flex'><Annoyed className='p-1' /> Lelettél tiltva </div>
                            </>
                        }
                    </div>
                ))
                }
            </CardContent>
        </Card>
    )
}
