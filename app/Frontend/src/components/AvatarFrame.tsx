import {
  Card,

  CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type User = {
    name: string
    avatar_url: string,
    id: number
}

export function AvatarFrame({user}:{user:User}){
    return (
    <Card className="max-w-max max-h-min p-0 bg-red-200 rounded-none rounded-l-3xl hover:bg-red-600 hover:text-white">
        <CardContent className="p-0 flex">
            <Avatar className="p-0 border-2 border-red-500">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>{user.name}</AvatarFallback>
            </Avatar>
            <h3 className="scroll-m-20 text-xs font-semibold tracking-tight p-2">
                {user.name}
            </h3>
        </CardContent>
    </Card>
    )
}

