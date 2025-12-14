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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { Spinner } from "../ui/spinner"
import { SendOTPToPasswordReset } from "../axios/axiosClient"

const formSchema = z.object({
    email: z.email({
        message: "Kérlek email-t adj meg!"
    }),
})

type FormSchema = z.infer<typeof formSchema>;

//api/reset_password/send_verify_code

export function PhaseEmail({ onSuccess }: { onSuccess: (email: string) => void }) {
    const { mutate: SendEmail, isPending } = useMutation({
        mutationFn: (email: string) => SendOTPToPasswordReset(email),
    })
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })
    function onSubmit(values: FormSchema) {
        SendEmail(values.email)

        onSuccess(values.email)
    }

    if (isPending) return <Spinner />
    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit(onSubmit)(e)
                }}
                className="space-y-5 p-2"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-red-600">Email cím</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="pelda@domain.hu"
                                    className="border-red-400 focus:border-red-600 focus:ring-red-500 bg-red-50 rounded-md"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-red-500">
                                Add meg az email címedet, ahová a visszaállító kódot küldjük.
                            </FormDescription>
                            <FormMessage className="text-red-600" />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                    Tovább
                </Button>
            </form>
        </Form>
    )
}
