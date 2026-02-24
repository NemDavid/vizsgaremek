import { Card, CardContent } from '@/components/ui/card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { AvatarFrame } from '@/components/custom/AvatarFrame/AvatarFrame'
import { ThumbsDown, ThumbsUp, TrashIcon } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authStatusRequest, deletpost, GetComents, getMyreaction, makeReaction } from '../axios/axiosClient'
import { CommentsAccord } from './comment-according'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from '@radix-ui/react-dialog'

export type Post = {
    ID: bigint,
    USER_ID: bigint,
    like: number,
    dislike: number,
    content: string,
    title: string,
    media_url: string,
    created_at: Date,
    updated_at: Date,
    comments?: comment[],

}
export type comment = {
    ID: bigint,
    USER_ID: bigint,
    POST_ID: bigint,
    comment: string,
}


export function PostAccord({ post, className }: { post: Post, className?: string }) {
    const queryclinet = useQueryClient();
    const { mutate: doReaction } = useMutation({
        mutationFn: async (data: { POST_ID: bigint; reaction: 'like' | 'dislike' }) => makeReaction(data),
        onSuccess() {
            queryclinet.refetchQueries({ queryKey: ["Posts"] });
            queryclinet.refetchQueries({ queryKey: ["reaction", post.ID] });
            queryclinet.refetchQueries({ queryKey: ["profil"] });
        }
    })

    const { data: auth } = useQuery<any>({
        queryKey: ["auth-status"],
        queryFn: authStatusRequest,
        enabled: false,
    })
    const { data: react } = useQuery({
        queryKey: ["reaction", post.ID],
        queryFn: () => getMyreaction(post.ID),
        retry: 0,
    })
    const { data: comments } = useQuery({
        queryKey: ["Comments", post.ID],
        queryFn: () => GetComents(`${post.ID}`)
    })
    const userid = post.USER_ID
    const like = {
        POST_ID: post.ID,
        reaction: 'like' as 'like',
    }
    const dislike = {
        POST_ID: post.ID,
        reaction: 'dislike' as 'dislike',
    }

    return (
        <Card className={`rounded-2xl! border shadow-md gap-0 py-0 bg-red-50 ${className}`}>
            <CardContent className="p-0">
                <Accordion type="single" collapsible>
                    <AccordionItem value={`item-${post.ID}`}>
                        <AccordionTrigger className="flex items-center justify-between gap-2 p-0 bg-gray-50 rounded-full!">
                            <div className="flex items-center gap-3 bg-red-50 w-full rounded-full!">
                                <AvatarFrame userid={userid} className="bg-red-100 rounded-2xl" />
                                <h2 className="text-xl font-semibold tracking-tight">
                                    {post.title}
                                </h2>
                            </div>
                            <div
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                className="mr-2"
                            >
                                <PostDeletion mypost={auth?.data.userID === post.USER_ID} ID={`${post.ID}`} className="m-0" />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className='bg-red-100'>
                            <div className="flex px-4 py-3  ">
                                <div className="flex-1 pr-4">
                                    <p className="text-sm text-gray-700 whitespace-pre-line text-wrap">
                                        {post.content}
                                    </p>
                                    {post.media_url && (
                                        <img
                                            src={post.media_url}
                                            alt="Post media"
                                            className="rounded-lg mt-3 max-h-60 object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col items-center gap-2 bg-red-200 rounded-lg justify-center p-0 m-0 h-20">
                                    <ToggleGroup type="single" variant="outline" spacing={2} size="sm" className="flex flex-col items-center mt-4 mb-4 mx-2 w-full max-w-xs" value={react ? react.reaction : ""}>
                                        <ToggleGroupItem onClick={() => doReaction(like)} value="like" className='data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500'><ThumbsUp />{post.like} Like </ToggleGroupItem>
                                        <ToggleGroupItem onClick={() => doReaction(dislike)} value="dislike" className='data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500'><ThumbsDown />{post.dislike} Dislike</ToggleGroupItem>
                                    </ToggleGroup>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-t bg-red-50 py-3 px-4 w-full rounded-b-3xl">
                        <CommentsAccord postID={post.ID} commentsList={post.comments == undefined ? comments?.data : post.comments} />
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    )
}

export function PostDeletion({ mypost, ID, className }: { mypost: boolean, className?: string, ID: string }) {
    const queryclinet = useQueryClient()
    const { mutate: deletePost } = useMutation({
        mutationFn: ({ id }: { id: any }) => deletpost({ id }),
        onError: (error: any) => {
            toast.error(error.response.data.message)
        },
        onSuccess: () => {
            toast.success("Sikeresen tőrőlted a posztod", {
                duration: 3000,
            })
            queryclinet.refetchQueries({ queryKey: ["Posts"] });
            queryclinet.refetchQueries({ queryKey: ["reaction", ID] });
            queryclinet.refetchQueries({ queryKey: ["profil"] });
        }
    })
    if (!mypost) return;
    return (
    <Dialog>
        <DialogTrigger asChild>
            <Button
                variant="destructive"
                size="icon"
                className={`hover:bg-red-400 ${className} m-2`}
            >
                <TrashIcon />
            </Button>
        </DialogTrigger>

        <DialogContent className="bg-rose-100">
            <DialogHeader>
                <DialogTitle>Biztosan törölni szeretnéd a posztot?</DialogTitle>
                <DialogDescription>
                    Ez a művelet nem vonható vissza. A poszt véglegesen törlésre kerül.
                </DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Mégse</Button>
                </DialogClose>

                <DialogClose asChild>
                    <Button
                        variant="destructive"
                        onClick={() => deletePost({ id: ID })}
                    >
                        Törlés
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)
}