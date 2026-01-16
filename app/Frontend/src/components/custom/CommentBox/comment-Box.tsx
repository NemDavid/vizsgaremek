import {
    Card,
    CardContent,
} from "@/components/ui/card"
import type { comment } from '../../axios/axiosClient'
import { AvatarFrame } from "../AvatarFrame/AvatarFrame"
export function Commentbox({ comment }: { comment?: comment }) {
    return (
        <Card className="p-1">
            <CardContent className="flex px-1">
                <div className="gap-3 flex p-1">
                    <AvatarFrame userid={comment ? comment.USER_ID : BigInt(0)} className="p-0" />
                    <p className="p-2">{comment?.comment}</p>
                </div>

            </CardContent>
        </Card>
    )

}