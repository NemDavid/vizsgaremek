import {
  Card,

  CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"
import { Spinner } from "@/components/ui/spinner"
import { getuserByid } from "./axios/axiosClient"



export function AvatarFrame({userid,className}:{userid:bigint,className?:string}){
    const {data: User, isLoading} = useQuery({
        queryKey: ['avatar'],
        queryFn: () => getuserByid(userid),
        retry: 0,
        refetchOnWindowFocus: false,
    })
    console.log(User);
    
    if(isLoading){
        <Spinner />
    }
    return (
    <Card key={userid} className={`bg-red-200 rounded-none rounded-l-3xl hover:bg-red-600 hover:text-white ${className}`}>
        <CardContent className="p-0 flex">
            <Avatar className="p-0 border-2 border-red-500 ">
                <AvatarImage src="https://api.dicebear.com/9.x/adventurer/svg?seed=Bogi" />
                <AvatarFallback>{User?.profil.first_name} {User?.profil.last_name}</AvatarFallback> 
            </Avatar>
            <h3 className="scroll-m-20 text-xs font-semibold tracking-tight p-2">
                {User?.profil.first_name} {User?.profil.last_name}
            </h3>
        </CardContent>
    </Card> 
    )
}

