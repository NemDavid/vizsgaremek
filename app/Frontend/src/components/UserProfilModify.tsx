import { PenLine } from "lucide-react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { AxiosErrorObject, UserProfileResponse } from "./axios/Types";
import { RegisterConfirmRequest, UpdateProfile } from "./axios/axiosClient";
import { Loader } from "./Loader";
import { Field, FieldDescription } from "./ui/field";
import { cn } from "@/lib/utils";


export const confirmSchema = z.object({
    first_name: z.string().min(1, { message: "Kérjük add meg a keresztneved!" }).max(60, { message: "A keresztnév legfeljebb 60 karakter hosszú lehet." }),
    last_name: z.string().min(1, { message: "Kérjük add meg a vezetékneved!" }).max(60, { message: "A vezetékneved legfeljebb 60 karakter hosszú lehet." }),
    schools: z.string().max(100, { message: "Az iskolák mező legfeljebb 100 karakter hosszú lehet." }).optional(),
    birth_date: z.string().max(100, { message: "A születési dátum mező legfeljebb 100 karakter hosszú lehet." }).optional(),
    birth_place: z.string().max(100, { message: "Az születési hely mező legfeljebb 100 karakter hosszú lehet." }).optional(),
    avatar: z.any().refine(file => !file || file.size <= 5_000_000, "A kép maximum 5MB lehet.").optional(),
    bio: z.string().max(255, { message: "A bio mező legfeljebb 255 karakter hosszú lehet." }).optional(),
})

export type ConfirmSchema = z.infer<typeof confirmSchema>

const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
};

export function UserProfileModify({ id , myuserdata}: {id:number,myuserdata:UserProfileResponse} ) {
    const [birthDayMin, setBirthDayMin] = useState("");
    const [birthDayMax, setBirthDayMax] = useState("");
    const queryClient = useQueryClient()
    const { mutate: confirm, isPending } = useMutation({
        mutationFn: ({ data }: { data: FormData }) => UpdateProfile(data, id),
        onError: (error: AxiosErrorObject) => {
            toast.error(error.response.data.message)
        },
        onSuccess: () => {
            toast.success("Fiók modositása sikeres 🎉", {
                duration: 3000,
            })
            queryClient.refetchQueries({queryKey: ["profil"]});
        }
    })
    const form = useForm<ConfirmSchema>({
        resolver: zodResolver(confirmSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            schools: "",
            birth_date: "",
            birth_place: "",
            avatar: "",
            bio: "",
        },
        mode: "onChange",
    })
    useEffect(() => {
        const today = new Date();

        const max = new Date(today);
        max.setFullYear(today.getFullYear() - 6);
        const min = new Date(today);
        min.setFullYear(today.getFullYear() - 100);

        setBirthDayMax(formatDate(max));
        setBirthDayMin(formatDate(min));
    }, []);


    function onSubmit(values: ConfirmSchema) {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (key !== "avatar" && value !== undefined && value !== null) {
                formData.append(key, value as any);
            }
        });

        if (values.avatar instanceof File) {
            formData.append("avatar", values.avatar);
        }

        confirm({ data: formData });
    }
    function SETDEFAULTDATA(){
        const Bio = myuserdata.bio;
        const bDate = myuserdata.birth_date;
        const bPlace = myuserdata.birth_place;
        const fn = myuserdata.first_name;
        const ln = myuserdata.last_name;
        const schools = myuserdata.schools;

        form.setValue("avatar","");
        form.setValue("bio",`${Bio != null? Bio : ""}`);
        form.setValue("birth_date",`${bDate != null? bDate : ""}`);
        form.setValue("birth_place",`${bPlace != null? bPlace : ""}`);
        form.setValue("first_name",`${fn != null? fn : ""}`);
        form.setValue("last_name",`${ln != null? ln : ""}`);
        form.setValue("schools",`${schools != null? schools : ""}`);
    }
    return (
        <Dialog onOpenChange={SETDEFAULTDATA}>
            <DialogTrigger asChild >
                <Button className='bg-red-400 hover:bg-red-100 hover:text-red-800' ><PenLine className='text-black' />Profil Modositása</Button>
            </DialogTrigger>
            <DialogContent className="bg-red-100">
                <DialogTitle className="display-none"/>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className={"flex flex-col gap-6"}>
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h1 className="text-2xl font-bold">Profil modositása</h1>
                            </div>
                            {/* First Name */}
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="firstName">Keresztnév *</FormLabel>
                                        <FormControl>
                                            <Input id="firstName" className="bg-rose-200" {...field} required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="last_name">Vezetéknév *</FormLabel>
                                        <FormControl>
                                            <Input id="last_name" className="bg-rose-200" {...field} required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="schools"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="schools">Iskolák</FormLabel>
                                        <FormControl>
                                            <Input id="schools" className="bg-rose-200" {...field} placeholder="Pl. ELTE, BME" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="birth_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="birthdate">Születési dátum</FormLabel>
                                        <FormControl>
                                            <Input id="birthdate" type="date" className="bg-rose-200" max={birthDayMax} min={birthDayMin} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="birth_place"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="birthPlace" >Születési hely</FormLabel>
                                        <FormControl>
                                            <Input id="birthPlace" className="bg-rose-200" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="avatar">Avatar feltöltése</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="avatar"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] ?? null
                                                    field.onChange(file)
                                                }}
                                                className="bg-rose-200"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Maximum 5MB méretű kép feltöltése.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="bio">Bio</FormLabel>
                                        <FormControl>
                                            <Input id="bio" className="bg-rose-200" {...field} placeholder="Rövid bemutatkozás" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {isPending ? <Loader /> : ""}
                            <Field>
                                <FieldDescription className="px-6 text-center">
                                    <Button type="submit" className="bg-red-400 text-black hover:bg-red-50">Profil modositása</Button>
                                </FieldDescription>
                            </Field>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}