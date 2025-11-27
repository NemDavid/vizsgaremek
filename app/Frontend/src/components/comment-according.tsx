import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from './ui/button'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Commentbox } from './comment-Box'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MakeCommentForPost } from './axios/axiosClient'
import type { comment } from './axios/axiosClient'

const formSchema = z.object({
    comment: z.string().min(3, { message: "Túl rövid" }).max(500, { message: "Túl Hosszú" }),
    POST_ID: z.bigint().optional(),
})


export type PostFormSchema = z.infer<typeof formSchema>

export function CommentsAccord({ postID, commentsList }: { postID: bigint, commentsList?: comment[] }) {
    const queryclinet = useQueryClient();
    const { mutate: createComment } = useMutation({
        mutationFn: async (comment: PostFormSchema) => MakeCommentForPost(comment),
        onSuccess() {
            queryclinet.refetchQueries({ queryKey: ["Posts"] });
        }
    })
    const form = useForm<PostFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: "",
            POST_ID: BigInt(postID),
        },
    })
    function onSubmit(values: PostFormSchema) {
        values.POST_ID = postID
        createComment(values)
        form.setValue("comment"," ");
    }
    return (
        <AccordionItem value="item-2" className='w-full p-0 m-0'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex w-full p-0 m-0">
                    <FormField
                        control={form.control}
                        name="comment"
                        render= {({ field }) => (
                            <FormItem className='w-full px-3 m-0 px-2'>
                                <FormControl>
                                    <Input placeholder="Írj egy kommentet..." {...field} type="text" className="w-full rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 m-3" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="ml-2 border px-3 bg-red-200 mt-3" variant="ghost" type='submit'>Küldés</Button>
                </form>
            </Form>
            <AccordionTrigger>
                <div className='border-b w-full text-ml font-semibold pb-2'>
                    Kommentek:
                </div>
            </AccordionTrigger>

            <AccordionContent>
                {commentsList && commentsList.length > 0 ? (
                    <ScrollArea className="max-h-[300px] h-fit overflow-auto w-full rounded-md p-0">
                        <div className="flex flex-col gap-2 p-2">
                            {commentsList.map((com) => (
                            <Commentbox key={com.ID} comment={com}/>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <p className="text-sm text-gray-500 px-3">Nincsenek még kommentek. Kommentelj TE!!</p>
                )}
            </AccordionContent>
        </AccordionItem>
    )

}

