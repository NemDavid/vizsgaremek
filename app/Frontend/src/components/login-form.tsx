import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import ReCAPTCHA from "react-google-recaptcha"
import { useState } from "react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { loginRequest } from "./axios/axiosClient"
import { useNavigate } from "@tanstack/react-router"


type LoginFormProps = React.ComponentProps<"form"> & {
  onSwitch?: () => void; // 🔹 új prop
};

export const loginSchema = z.object({
  username: z.string().min(2, {
    message: "A felhasználónévnek legalább 2 karakter hosszúnak kell lennie.",
  }),
  email: z.email({
    message: "Érvénytelen e-mail cím.",
  }),
  password: z.string()
    .min(8, { message: "A jelszónak legalább 8 karakter hosszúnak kell lennie." })
    .max(21, { message: "A jelszó legfeljebb 21 karakter hosszú lehet." }),
})

export type LoginSchema = z.infer<typeof loginSchema>



export function LoginForm({ className, onSwitch, ...props }: LoginFormProps) 
{
  const nav = useNavigate()
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const {mutate: Login, isPending} = useMutation({
    mutationFn: ({data}:{data: LoginSchema}) => loginRequest(data),
    onSuccess: () => {
      toast.success("Sikeres bejelentkezés!")
      nav({to: "/", reloadDocument: true});
    },
    onError: () => {
      toast.error("Hiba történt a bejelentkezés során.")
    },
  })


  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode:"onBlur",
  })
  function onSubmit(values: LoginSchema) {
    if (!captchaValue) {
      toast.error("Kérjük, erősítsd meg, hogy nem vagy robot!")
      return
    }
    else{
      Login({data: values})
      console.log(values) 
    }
  }
  function handleCaptchaChange(value: string | null) {
      setCaptchaValue(value)
  }

  if(isPending){
    return <div>Loading...</div>
  }

  return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Jelentkezzen be fiókjába</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Adja meg e-mail címét alább a fiókjába való bejelentkezéshez
          </p>
      </div>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormControl>
              <Input id="email" type="email" placeholder="m@example.com" {...field} required/>
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="username">Felhasználó név</FormLabel>
            <FormControl>
              <Input id="username" placeholder="Petike123" {...field} required/>
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center">
            <FieldLabel htmlFor="password">Jelszó</FieldLabel>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Elfelejtette jelszavát?
              </a>
            </div>
            <FormControl>
              <Input id="password" type="password" placeholder="Jelszavam321" {...field} required/>
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <Field>
          <FieldDescription className="text-center">
            Nincs még fiókód?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="underline underline-offset-4 text-blue-600"
            >
              Hozz létre
            </button>
          </FieldDescription>
        </Field>
      <ReCAPTCHA
        sitekey="6LfOlv4rAAAAACbIEwO_QToOchP5jP07CO5q0SjH"
        onChange={handleCaptchaChange}
        className="mx-auto"
      />
      <Button type="submit">Belépés</Button>
    </form>
  </Form> 
  )
}


