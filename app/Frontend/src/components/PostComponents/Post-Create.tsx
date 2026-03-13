import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost } from "../axios/axiosClient"
import { useState } from "react"
import { Loader } from "@/components/Loader"
import { IMAGE_ACCEPT_STRING, IMAGE_FORMAT_ERROR, isAllowedImage } from "@/lib/imageUpload"

const postcreateSchema = z.object({
    title: z.string().min(3, "A címnek legalább 3 karakternek kell lennie").max(255, "A cím maximum 255 karakter lehet"),
    content: z.string().min(3, "A tartalomnak legalább 3 karakternek kell lennie").max(1000, "A tartalom maximum 1000 karakter lehet"),
    media: z
        .custom<File>((file) => file instanceof File) // opcionális fájl
        .optional(),
})


export type PostcreateSchema = z.infer<typeof postcreateSchema>;

export function PostCreate() {
    const [open, setOpen] = useState(false);
    const queryclient = useQueryClient()
    const { mutate: upload, isPending } = useMutation({
        mutationFn: (data: FormData) => createPost(data),
        onSuccess() {
            queryclient.refetchQueries({ queryKey: ["Posts"] })
            form.resetField("content");
            form.resetField("media");
            form.resetField("title");
            setOpen(false);

        },
        retry: 0
    })
    const form = useForm<PostcreateSchema>({
        resolver: zodResolver(postcreateSchema),
        defaultValues: {
            content: "",
            title: "",

        },
        mode: "onChange",
        reValidateMode: "onBlur"
    })
    // 2. Define a submit handler.
    function onSubmit(values: PostcreateSchema) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (key !== "media" && value !== undefined && value !== null && value !== "") {
                formData.append(key, value as any);
            }
        });
        if (values.media instanceof File) {
            formData.append("media", values.media);
        }
        upload(formData)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-red-300 hover:bg-red-400">Mire gondolsz most?</Button>
            </DialogTrigger>

            <DialogContent className="
                        sm:max-w-md 
                        space-y-6 
                        bg-red-50 
                        border-black 
                        z-999 
                        p-2 
                        sm:p-6 
                        w-[95vw]
                        max-w-lg
                        max-h-[90vh]
                        overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Új bejegyzés</DialogTitle>
                    <DialogDescription>
                        Oszd meg gondolataidat másokkal.
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
                                            accept={IMAGE_ACCEPT_STRING}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] ?? null;

                                                if (!file) {
                                                    field.onChange(undefined);
                                                    form.clearErrors("media");
                                                    return;
                                                }

                                                if (isAllowedImage(file)) {
                                                    field.onChange(file);
                                                    form.clearErrors("media");
                                                } else {
                                                    field.onChange(undefined);
                                                    form.setError("media", {
                                                        type: "manual",
                                                        message: IMAGE_FORMAT_ERROR,
                                                    });
                                                }
                                            }}
                                            className="mt-1 w-max sm:w-auto"
                                        />
                                    </FormControl>

                                    {field.value instanceof File && (
                                        <div className="mt-2 flex flex-col gap-2">
                                            <p className="text-sm text-green-700 break-words">
                                                Kiválasztva: {field.value.name}
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    field.onChange(undefined);
                                                    form.clearErrors("media");
                                                }}
                                            >
                                                Kiválasztott kép törlése
                                            </Button>
                                        </div>
                                    )}

                                    <FormDescription>
                                        Engedett formátumok: JPG, JPEG, PNG, WEBP, GIF, BMP, SVG, TIF, TIFF, AVIF, HEIC, HEIF.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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

