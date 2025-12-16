import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Users } from 'lucide-react'
import { AvatarFrame } from "./AvatarFrame"
import { useQuery } from "@tanstack/react-query"
import { GetFriends } from "./axios/axiosClient"


export function DrawerFriends() {
    const {data} = useQuery({
        queryFn: () => GetFriends(),
        queryKey: ["Friends"],
        retry: 0,
        refetchOnWindowFocus: false,
    })
    //console.log(data);
    
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
                    <DrawerDescription>
                        <div className="flex gap-3 overflow-x-auto border-b border-gray-300 p-3 bg-red-100">
                            <div className="flex gap-3 overflow-x-auto p-3">
                                {/* <AvatarFrame userid={1n} className='max-w-max max-h-min p-0' /> */}
                            </div>
                        </div>
                    </DrawerDescription>
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

