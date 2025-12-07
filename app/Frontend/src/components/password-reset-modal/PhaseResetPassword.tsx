import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { ChangePassword } from "../axios/axiosClient"
import type { PR_User } from "./Forget-Password-Modal"

const formSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: "A jelszónak legalább 8 karakter hosszúnak kell lennie." })
            .regex(/[a-z]/, { message: "A jelszónak tartalmaznia kell kisbetűt." })
            .regex(/[A-Z]/, { message: "A jelszónak tartalmaznia kell nagybetűt." })
            .regex(/[0-9]/, { message: "A jelszónak tartalmaznia kell számot." })
            .regex(/[^A-Za-z0-9]/, { message: "A jelszónak tartalmaznia kell speciális karaktert." }),

        password_confirm: z.string(),
    }).refine((data) => data.password === data.password_confirm, {
        path: ["password_confirm"],
        message: "A két jelszó nem egyezik.",
    })


export function PhaseResetPassword({ onSuccess, user }: { onSuccess: () => void, user: PR_User | undefined }) {
    const [secureMode, setSecureMode] = useState(false)
    if (!user) return <p className="text-red-600">Hiba: Nincs kiválasztott felhasználó.</p>
    const { mutate: UpdatePassword } = useMutation({
        mutationFn: (password: string) => ChangePassword({ userId: user.ID, password }),
        onSuccess() {
            onSuccess()
        }
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            password_confirm: "",
        },
        mode: "onChange",
    })


    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("asd");
        
        UpdatePassword(values.password)
    }
    return (
        <Form {...form}>
            <h1 className="p-3">Írd be az új jelszavad, majd írd be mégegyszer, hogy megerősítsd.</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jelszó</FormLabel>
                            <FormControl>
                                <Input placeholder="Jelszavam123+" type={secureMode ? "password" : "text"} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password_confirm"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Megerősítő</FormLabel>
                            <FormControl>
                                <Input placeholder="Még egyszer ugyanazt" {...field}
                                    onFocus={() => setSecureMode(true)}
                                    onBlur={() => setSecureMode(false)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="m-2">Megerősités</Button>
            </form>
        </Form>
    )
}