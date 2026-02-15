import { Card, CardContent } from '@/components/ui/card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { AvatarFrame } from '@/components/custom/AvatarFrame/AvatarFrame'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyreaction, makeReaction } from '../axios/axiosClient'
import { CommentsAccord } from '../comment-according' 


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


export function PostAccord({ post,className }: { post: Post, className?:string }) {
    const queryclinet = useQueryClient();
    const { mutate: doReaction } = useMutation({
        mutationFn: async (data: { POST_ID: bigint; reaction: 'like' | 'dislike' }) => makeReaction(data),
        onSuccess() {
            queryclinet.refetchQueries({ queryKey: ["Posts"] });
            queryclinet.refetchQueries({ queryKey: ["reaction", post.ID] });
        }
    })
    const { data: react } = useQuery({
        queryKey: ["reaction", post.ID],
        queryFn: () => getMyreaction(post.ID),
        retry: 0,
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
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="flex items-center justify-between gap-2 p-0 bg-gray-50 rounded-full!">
                            <div className="flex items-center gap-3 bg-red-50 w-full rounded-full!">
                                <AvatarFrame userid={userid} className="bg-red-100 rounded-2xl" />
                                <h2 className="text-xl font-semibold tracking-tight">
                                    {post.title}
                                </h2>
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
                        <CommentsAccord postID={post.ID} commentsList={post.comments}/>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    )
}

