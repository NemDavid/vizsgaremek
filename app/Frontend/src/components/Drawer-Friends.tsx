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


export function DrawerFriends() {
    return (
        <Drawer>
            <DrawerTrigger>
                <Button variant="outline" className="fixed bottom-4 right-4 bg-red-500 text-black hover:bg-red-700 hover:text-white rounded-full w-12 h-12">
                    <Users></Users>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Friends</DrawerTitle>
                    <DrawerDescription>
                        <div className="flex gap-3 overflow-x-auto border-b border-gray-300 p-3 bg-slate-100">
                            <div className="flex gap-3 overflow-x-auto p-3">
                                {/* <AvatarFrame userid={1n} className='max-w-max max-h-min p-0' /> */}
                            </div>
                        </div>
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

