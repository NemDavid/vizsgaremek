import { ShieldX, UserMinus, UserPlus } from "lucide-react"
import { Button } from "./ui/button"
import { useMutation } from "@tanstack/react-query"
import { Spinner } from "./ui/spinner"
import { AddFriend, connectionMangager } from "./axios/axiosClient"
import type { AxiosErrorObject } from "./axios/Types"
import { toast } from "sonner"

export function Asd() {
    return (
        <>
            <Button className='bg-red-400 hover:bg-red-100 hover:text-red-800'><UserPlus className='text-black' />Barát hozzáadása</Button>
            <Button className='bg-red-400 hover:bg-red-100 hover:text-red-800'><UserPlus className='text-black' />Barát Elfogadása</Button>
            <Button className='bg-red-400 hover:bg-red-100 hover:text-red-800' disabled><UserMinus className='text-black' />Barát elutasitása</Button>
            <Button className='bg-red-400 hover:bg-red-100 hover:text-red-800'><ShieldX className='text-black Hove' />Tiltás</Button>
        </>
    )
}

export function ReqFriend({ className,userID }: { className?: string, userID:bigint }) {
    const { mutate: addFriend, isPending } = useMutation({
        mutationFn: ({ id }: { id: bigint }) => AddFriend({id}),
        onError: (error: AxiosErrorObject) => {
            toast.error(error.response.data.message)
        },
        onSuccess: () => {
            toast.success("Sikeresen felkérted barátnak 🎉", {
                duration: 3000,
            })
        }
    })
    return (
        <Button className={`bg-red-400 hover:bg-red-100 hover:text-red-800 ${className}`} onClick={!isPending? ()=> addFriend({id:userID}): ()=> null}>
            {isPending ? <Spinner /> :
                <>
                    <UserPlus className='text-black' />Barát hozzáadása
                </>
            }
        </Button>
    )
}
export function AcceptFriend({ className,userID }: { className?: string, userID:bigint }) {
    const { mutate: AcceptFriend, isPending } = useMutation({
        mutationFn: ({ id }: { id: bigint }) => connectionMangager({id}),
        onError: (error: AxiosErrorObject) => {
            toast.error(error.response.data.message)
        },
        onSuccess: () => {
            toast.success("Sikeresen elfogadtad barátnak 🎉", {
                duration: 3000,
            })
        }
    })
    return (
        <Button className={`bg-red-400 hover:bg-red-100 hover:text-red-800 ${className}`} onClick={!isPending? ()=> AcceptFriend({id:userID}): ()=> null}>
            {isPending ? <Spinner /> :
                <>
                    <UserPlus className='text-black' />Barát Elfogadása
                </>
            }
        </Button>
    )
}

//Post-> api/connections/connection/:USER_ID
