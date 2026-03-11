import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { AvatarFrame } from "../AvatarFrame/AvatarFrame"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { authStatusRequest, deletcomment } from "@/components/axios/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export function Commentbox({ comment, ProfilID }: { comment?: any, ProfilID?:string }) {
    const queryclient = useQueryClient()
    const { data: auth } = useQuery({
        queryKey: ["auth-status"],
        queryFn: authStatusRequest,
        enabled: true,
    })
    const { mutate } = useMutation({
        mutationFn: (id: string) => deletcomment({ id }),
        onError: (error: any) => {
            toast.error(error.response.data.message)
        },
        onSuccess: () => {
            toast.success("Sikeresen tőrőlted a kommented", {
                duration: 3000,
            })
            queryclient.refetchQueries({ queryKey: ["Posts"] })
            if(ProfilID) queryclient.refetchQueries({ queryKey: ["profil",ProfilID] });
        }
    })
    function DeleteComment(ID: string) {
        mutate(ID)
    }
    return (
        <Card className="p-1">
            <CardContent className="flex px-1">
                <div className="gap-3 flex p-1 w-full">
                    <AvatarFrame userData={comment.user} className="p-0" />
                    <p className="flex-1 p-2">{comment?.comment}</p>
                    {auth?.data.userID == comment?.USER_ID && (
                        <Button variant={"destructive"}
                            onClick={() => DeleteComment(comment?.ID)}
                        ><Trash2></Trash2>
                        </Button>)}
                </div>
            </CardContent>
        </Card>
    )

}