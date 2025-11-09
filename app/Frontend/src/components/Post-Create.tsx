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
import { Textarea } from "./ui/textarea"

const postcreateSchema = z.object({
    title: z.string().min(3, "A címnek legalább 3 karakternek kell lennie").max(255, "A cím maximum 255 karakter lehet"),
    content: z.string().min(3, "A tartalomnak legalább 3 karakternek kell lennie").max(1000, "A tartalom maximum 1000 karakter lehet"),
    media: z
        .custom<File>((file) => file instanceof File) // opcionális fájl
        .optional(),
})


type PostcreateSchema = z.infer<typeof postcreateSchema>;

export function PostCreate() {
    const form = useForm<PostcreateSchema>({
        resolver: zodResolver(postcreateSchema),
        defaultValues: {
            content: "",
            title: "",
        }
    })

    // 2. Define a submit handler.
    function onSubmit(values: PostcreateSchema) {

        console.log(values)
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Mire gondolsz most?</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Új bejegyzés</DialogTitle>
                    <DialogDescription>
                        Oszd meg gondolataidat másokkal.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Profil + Title */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold text-lg">
                                A
                            </div>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Cím</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Add meg a címet..." {...field} />
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
                                        <Textarea placeholder="Írj valamit..." {...field} />
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
                                <FormItem>
                                    <FormLabel>Kép feltöltése (opcionális)</FormLabel>
                                    <FormControl>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => field.onChange(e.target.files?.[0])}
                                            className="mt-1"
                                        />
                                    </FormControl>
                                    <FormDescription>JPEG, PNG, GIF képek feltöltése.</FormDescription>
                                </FormItem>
                            )}
                        />

                        {/* Submit gomb */}
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Bezárás</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="submit">Küldés</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

