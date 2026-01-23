import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"
import { Spinner } from "@/components/ui/spinner"
import { getuserByid } from "../../axios/axiosClient"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useNavigate } from "@tanstack/react-router"


export function AvatarFrame({ userid, className }: { userid: bigint, className?: string }) {
    const nav = useNavigate()
    const { data: User, isLoading } = useQuery({
        queryKey: ['avatar', userid],
        queryFn: () => getuserByid(`${userid}`),
        retry: 0,
        refetchOnWindowFocus: false,
        gcTime: 6000,
    })
    if (isLoading) {
        return <Spinner />
    }
    return (
        <HoverCard>
            <HoverCardTrigger onClick={() => nav({ to: "/profil/$profilId", params: { profilId: `${userid}` } })} className="cursor-pointer">
                <Card key={userid} className={`bg-red-200 rounded-none rounded-l-3xl hover:bg-red-600 hover:text-white ${className}`}>
                    <CardContent className="p-0 flex">
                        <Avatar className="p-0 border-2 border-red-500 ">
                            <AvatarImage src={`${User?.profil.avatar_url}`} />
                            <AvatarFallback>{User?.profil.first_name} {User?.profil.last_name}</AvatarFallback>
                        </Avatar>
                        <h3 className="scroll-m-20 text-xs font-semibold tracking-tight p-2">
                            {User?.profil.first_name} {User?.profil.last_name}
                        </h3>
                    </CardContent>
                </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-72 bg-[#1a0f10] text-white border border-[#3a1b1d] shadow-xl">
                <button
                    className="absolute top-[6px] right-[6px] h-7 w-7 rounded-full bg-[#ff3b3b] hover:bg-[#cc2f2f] flex items-center justify-center text-white text-sm cursor-pointer z-70"
                    onClick={() => nav({to:"/profil/$profilId", params:{profilId: `${userid}`}})}>
                    ›
                </button>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-[#ff3b3b]">
                        <AvatarImage src={`${User?.profil.avatar_url}`} />
                        <AvatarFallback>
                            {User?.profil.first_name?.[0]}
                            {User?.profil.last_name?.[0]}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <p className="text-lg font-bold text-[#ff3b3b]">
                            {User?.profil.first_name} {User?.profil.last_name}
                        </p>

                        <p className="text-xs text-gray-400">
                            @{User?.user.username}
                        </p>
                    </div>
                </div>

                <div className="mt-4 text-xs text-gray-300 space-y-1">
                    <p>Email: {User?.user.email}</p>
                    <p>Csatlakozott: {User?.user.created_at?.slice(0, 10)}</p>
                </div>

                <div className="mt-4 p-2 rounded bg-[#150a0c] border border-[#3a1b1d]">
                    <p className="text-xs text-[#ff3b3b] font-semibold mb-1">
                        Rövid bemutatkozás
                    </p>
                    <p className="text-xs text-gray-300">
                        {User?.profil.bio || "Nincs megadva."}
                    </p>
                </div>
            </HoverCardContent>

        </HoverCard>
    )
}


