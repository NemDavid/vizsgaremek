import { Card, CardContent } from '@/components/ui/card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { AvatarFrame } from '@/components/custom/AvatarFrame/AvatarFrame'
import { EllipsisVertical, PencilLine, ThumbsDown, ThumbsUp, TrashIcon } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authStatusRequest, deletpost, GetComents, getMyreaction, makeReaction, PostUpdate } from '../axios/axiosClient'
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader } from "@/components/Loader"



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


export function PostAccord({ post, className, ProfilID }: { post: any, className?: string, ProfilID?: string }) {
    const [openDelete, setOpenDelete] = useState(false);
    const [openModify, setOpenModify] = useState(false);
    const queryclient = useQueryClient();
    const { mutate: doReaction } = useMutation({
        mutationFn: async (data: { POST_ID: bigint; reaction: 'like' | 'dislike' }) => makeReaction(data),
        onSuccess() {
            queryclient.refetchQueries({ queryKey: ["Posts"] })
            if (ProfilID) queryclient.refetchQueries({ queryKey: ["profil", ProfilID] })
        }
    })

    const { data: auth } = useQuery<any>({
        queryKey: ["auth-status"],
        queryFn: authStatusRequest,
        enabled: true,
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
        <Card className={`rounded-2xl! border shadow-md gap-0 py-0 bg-red-50 ${className ?? ""}`}>
            <CardContent className="p-0">
                <Accordion type="single" collapsible>
                    <AccordionItem value={`itemC-${post.ID}`}>
                        <div className="relative">
                            <AccordionTrigger className="flex items-center gap-2 p-0 rounded-full! pr-12 bg-red-50">
                                <div className="flex items-center gap-3 bg-red-50 w-full rounded-full!">
                                    <AvatarFrame userData={post.user} className="bg-red-100 rounded-2xl" />
                                    <h2 className="text-xl font-semibold tracking-tight">{post.title}</h2>
                                </div>
                            </AccordionTrigger>

                            {/* Menü gomb "benne van" kinézetre, de DOM-ban nem a trigger gyereke */}
                            {auth?.data.userID == userid && (
                                <div
                                    className={"absolute right-2 top-1/2 -translate-y-1/2"}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <EllipsisVertical />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent className="bg-rose-50">
                                            <DropdownMenuGroup>
                                                <DropdownMenuLabel>Poszt beállítás</DropdownMenuLabel>

                                                <DropdownMenuItem
                                                    onSelect={(e) => {
                                                        e.preventDefault()
                                                        setOpenDelete(true)
                                                    }}
                                                >
                                                    <TrashIcon className="mr-2 h-4 w-4" />
                                                    Törlés
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onSelect={(e) => {
                                                        e.preventDefault()
                                                        setOpenModify(true)
                                                    }}
                                                >
                                                    <PencilLine className="mr-2 h-4 w-4" />
                                                    Módosítás
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                        </div>

                        <AccordionContent className="bg-red-100">
                            <div className="flex px-4 py-3">
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
                                    <ToggleGroup
                                        type="single"
                                        variant="outline"
                                        spacing={2}
                                        size="sm"
                                        className="flex flex-col items-center mt-4 mb-4 mx-2 w-full max-w-xs"
                                        value={post.myReaction}
                                    >
                                        <ToggleGroupItem
                                            onClick={() => doReaction(like)}
                                            value="like"
                                            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
                                        >
                                            <ThumbsUp />
                                            {post.like} Like
                                        </ToggleGroupItem>

                                        <ToggleGroupItem
                                            onClick={() => doReaction(dislike)}
                                            value="dislike"
                                            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
                                        >
                                            <ThumbsDown />
                                            {post.dislike} Dislike
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value={`comments-${post.ID}`} className="border-t bg-red-50 py-3 px-4 w-full rounded-b-3xl">
                        <CommentsAccord
                            postID={post.ID}
                            commentsList={post.comments}
                            ProfilID={ProfilID}
                        />
                    </AccordionItem>
                </Accordion>
                <PostDeletion
                    mypost={auth?.data.userID === post.USER_ID}
                    ID={`${post.ID}`}
                    open={openDelete}
                    onOpenChange={setOpenDelete}
                    isTriggerd
                />

                <PostModify
                    mypost={auth?.data.userID === post.USER_ID}
                    post={post}
                    open={openModify}
                    onOpenChange={setOpenModify}
                    isTriggerd
                />
            </CardContent>
        </Card>
    )
}

export function PostDeletion({ mypost, ID, className, open, onOpenChange, isTriggerd }: { mypost: boolean, className?: string, isTriggerd?: boolean, ID: string, open?: boolean, onOpenChange?: (open: boolean) => void }) {
    const queryclient = useQueryClient()
    const { mutate: deletePost } = useMutation({
        mutationFn: ({ id }: { id: any }) => deletpost({ id }),
        onError: (error: any) => {
            toast.error(error.response.data.message)
        },
        onSuccess: () => {
            toast.success("Sikeresen tőrőlted a posztod", {
                duration: 3000,
            })
            queryclient.refetchQueries({ queryKey: ["Posts"] })
        }
    })
    if (!mypost) return;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {!isTriggerd && (<DialogTrigger asChild>
                <div className={`flex gap-1 ${className}`}>
                    <TrashIcon />
                    <p>Tőrlés</p>
                </div>
            </DialogTrigger>)}

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

const postcreateSchema = z.object({
    title: z.string().min(3).max(255),
    content: z.string().min(3).max(1000),
    media: z.custom<File>((file) => file instanceof File).optional(),
    mediaDeleted: z.boolean().optional(), // ✅ nincs optional
})


type PostcreateSchema = z.infer<typeof postcreateSchema>

export function PostModify({ mypost, post, className, open, onOpenChange, isTriggerd }: { mypost: boolean, className?: string, isTriggerd?: boolean, post: any, open?: boolean, onOpenChange?: (open: boolean) => void }) {
    const queryclient = useQueryClient()
    const { mutate: upload, isPending } = useMutation({
        mutationFn: (data: FormData) => PostUpdate(post.ID, data),
        onSuccess() {
            queryclient.refetchQueries({ queryKey: ["Posts"] })
            form.reset()
            onOpenChange?.(false) // ✅ zárás
        },
        retry: 0,
    })
    const form = useForm<PostcreateSchema>({
        resolver: zodResolver(postcreateSchema),
        defaultValues: {
            title: post.title,
            content: post.content,
            mediaDeleted: false,
        },
        mode: "onChange",
        reValidateMode: "onBlur"
    })
    // 2. Define a submit handler.
    function onSubmit(values: PostcreateSchema) {
        const formData = new FormData()

        formData.append("title", values.title)
        formData.append("content", values.content)

        // ✅ mediaDeleted mindig menjen
        formData.append("mediaDeleted", values.mediaDeleted ? "true" : "false")

        // ha új fájlt választott, menjen fel
        if (values.media instanceof File) {
            formData.append("media", values.media)
        }

        upload(formData)
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!mypost) return;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {!isTriggerd && (<DialogTrigger asChild>
                <div className={`flex gap-1 ${className}`}>
                    <PencilLine />
                    <p>Módositás</p>
                </div>
            </DialogTrigger>)}

            <DialogContent className="bg-rose-100">
                <DialogHeader>
                    <DialogTitle>Biztosan törölni szeretnéd a posztot?</DialogTitle>
                    <DialogDescription>
                        Ez a művelet nem vonható vissza. A poszt véglegesen törlésre kerül.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Cím</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Add meg a címet..." {...field} className="bg-red-100 focus:bg-red-300 hover:bg-red-200" />
                                        </FormControl>
                                        <FormDescription>A bejegyzés címe</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Content */}
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tartalom</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Írj valamit..." {...field} className="bg-red-100 focus:bg-red-300 hover:bg-red-200" />
                                    </FormControl>
                                    <FormDescription>Legfeljebb 1000 karakter.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Kép feltöltés */}
                        <FormField
                            control={form.control}
                            name="media"
                            render={({ field }) => (
                                <FormItem className="bg-red-100 focus:bg-red-300 hover:bg-red-200 p-3 rounded-lg">
                                    <FormLabel>Kép feltöltése (opcionális)</FormLabel>

                                    <FormControl>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file && allowedTypes.includes(file.type)) {
                                                    field.onChange(file)
                                                    form.setValue("mediaDeleted", false) // ✅ ha új képet választ, ne töröljön
                                                } else {
                                                    field.onChange(undefined)
                                                }
                                            }}
                                            className="mt-1"
                                            disabled={form.watch("mediaDeleted")} // ✅ ha törlésre jelölte, ne töltsön fel
                                        />
                                    </FormControl>

                                    {/* ✅ Törlésre jelöl gomb */}
                                    {post.media_url && (
                                        <Button
                                            type="button"
                                            variant={form.watch("mediaDeleted") ? "destructive" : "outline"}
                                            className="mt-2"
                                            onClick={() => {
                                                const next = !form.getValues("mediaDeleted")
                                                form.setValue("mediaDeleted", next)

                                                if (next) {
                                                    // ha törölni akarja, akkor az új file választást is nullázd
                                                    form.setValue("media", undefined)
                                                }
                                            }}
                                        >
                                            {form.watch("mediaDeleted") ? "Média törlésre jelölve ✓" : "Média törlése"}
                                        </Button>
                                    )}

                                    {/* kis vizuális jelzés */}
                                    {form.watch("mediaDeleted") && (
                                        <p className="text-sm text-red-700 mt-1">
                                            A jelenlegi kép törlésre kerül mentéskor.
                                        </p>
                                    )}

                                    <FormDescription>JPEG, PNG, WEBP képek feltöltése.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {post.media_url && !form.watch("mediaDeleted") && (
                            <img src={post.media_url} className="mt-2 max-h-40 rounded-lg object-cover" />
                        )}
                        {isPending ? <Loader /> : ""}
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button type="button" className="bg-red-400">Bezárás</Button>
                            </DialogClose>
                            <Button type="submit" className="bg-red-400">Küldés</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}