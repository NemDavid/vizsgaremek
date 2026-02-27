import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Users } from 'lucide-react'
import { useQuery } from "@tanstack/react-query"
import { authStatusRequest, GetMyconnections } from "../../axios/axiosClient"
import { FriendsList } from "@/routes/connections"


export function DrawerFriends() {
    const { data} = useQuery({
        queryKey: ["Connection", "Friends"],
        queryFn: () => GetMyconnections("accepted"),
        retry: 0,
        gcTime: 30000,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
    })
    const { data: auth } = useQuery<any>({
        queryKey: ["auth-status"],
        queryFn: authStatusRequest,
        enabled: false,
    })
    return (
        <Drawer >
            <DrawerTrigger className="contents">
                <div className="fixed bottom-4 right-4 bg-red-500 text-black hover:bg-red-700 hover:text-white rounded-full w-12 h-12 flex items-center justify-center z-60">
                    <Users size={24} />
                </div>
            </DrawerTrigger>
            <DrawerContent className="bg-red-900">
                <DrawerHeader>
                    <DrawerTitle className="text-white">Friends</DrawerTitle>
                    <div className="flex gap-3 overflow-x-auto border-b border-gray-300 p-3 bg-red-100">
                        <div className="flex gap-3 overflow-x-auto p-3">
                            {data?.data.map((item: any) => (
                                <FriendsList userData={item} id={item.UserID} key={item.UserID} className={"bg-rose-900"} myid={BigInt(auth?.data.userID || 0n)} avatarClass="size-30"/>
                            ))}
                        </div>
                    </div>
                </DrawerHeader>
                <DrawerFooter>
                    <DrawerClose className="flex justify-center">
                        <div className="bg-red-300 w-30 rounded-lg hover:bg-red-500 hover:text-white">
                            Bezárás
                        </div>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

