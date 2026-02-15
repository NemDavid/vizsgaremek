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
import { authStatusRequest, GetMyFriends } from "../../axios/axiosClient"
import { FriendsList } from "@/routes/connections"


export function DrawerFriends() {
    const { data } = useQuery({
        queryFn: () => GetMyFriends(),
        queryKey: ["Friends"],
        retry: 0,
        refetchOnWindowFocus: false,
    })
    const { data: auth } = useQuery<any>({
        queryKey: ["auth-status"],
        queryFn: authStatusRequest,
        enabled: false,
    })
    const acceptedFriends = data?.data?.filter((item: any) => item.Status === "accepted") || [];
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
                            {acceptedFriends.map((item: any) => (
                                <FriendsList id={item.UserID} key={item.UserID} className={"bg-rose-900"} myid={BigInt(auth?.data.userID || 0n)}/>
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

