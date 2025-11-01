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
import { z } from "zod"
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
import { toast } from "sonner"
import { useState } from "react"

type SignupFormProps = React.ComponentProps<"form"> & {
  onSwitch?: () => void;
};

const registerSchema = z.object({
  username: z.string().min(2, {
    message: "A felhasználónévnek legalább 2 karakter hosszúnak kell lennie.",
  }),
  email: z.email({
    message: "Érvénytelen e-mail cím.",
  }),
  password: z
    .string()
    .min(8, { message: "A jelszónak legalább 8 karakter hosszúnak kell lennie." })
    .max(21, { message: "A jelszó legfeljebb 21 karakter hosszú lehet." })
    .regex(/[A-Z]/, { message: "A jelszónak tartalmaznia kell legalább egy nagybetűt." })
    .regex(/[^A-Za-z0-9]/, { message: "A jelszónak tartalmaznia kell legalább egy speciális karaktert." }),
  confirm_password: z
    .string()
    .min(8, { message: "A jelszónak legalább 8 karakter hosszúnak kell lennie." })
    .max(21, { message: "A jelszó legfeljebb 21 karakter hosszú lehet." }),
})
.refine((data) => data.password === data.confirm_password, {
  message: "A jelszavaknak egyezniük kell.",
  path: ["confirm_password"],
});


type RegisterSchema = z.infer<typeof registerSchema>

export function SignupForm({ className, onSwitch, ...props }: SignupFormProps) {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)

  function handleCaptchaChange(value: string | null) {
    setCaptchaValue(value)
  }
  const form = useForm<RegisterSchema>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        username: "",
        email: "",
        password: "",
        confirm_password: "",
      },
      mode:"onChange",
    })
    function onSubmit(values: RegisterSchema) {
      if (!captchaValue) {
        toast.error("Kérjük, erősítsd meg, hogy nem vagy robot!")
        return
      }
      console.log(values)
      toast.success("Fiók létrehozása sikeres 🎉", {
        description: "E-mailt küldtünk a fiók megerősítéséhez. Kérjük, ellenőrizd a postaládád!",
        duration: 12000,
      })
    }
  
  return (
    <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
    <div className="flex flex-col items-center gap-1 text-center">
      <h1 className="text-2xl font-bold">Hozd létre a fiókodat.</h1>
      <p className="text-muted-foreground text-sm text-balance">
        Töltsd ki az alábbi űrlapot a fiókod létrehozásához.
      </p>
    </div>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormControl>
            <Input id="email" type="email" placeholder="user@mihirunk.hu" {...field} required/>
          </FormControl>
          <FormDescription>
            Ezt fogjuk használni arra, hogy kapcsolatba lépjünk veled. Az e-mail címedet nem osztjuk meg senkivel.
          </FormDescription>
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
            <Input id="username" {...field} required placeholder="Petike123"/>
          </FormControl>
          <FormDescription>
            Válassz egy egyedi felhasználónevet a fiókodhoz.
            Ezt csak te fogod látni.
          </FormDescription>
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
          </div>
          <FormControl>
            <Input id="password" type="password" {...field} required placeholder="Jelszavam123"/>
          </FormControl>
          <FormDescription>
            Legalább 8 karakter hosszúnak kell lennie
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="confirm_password"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center">
          <FieldLabel htmlFor="password">Jelszó megerősítése</FieldLabel>
          </div>
          <FormControl>
            <Input id="password" type="password" {...field} required placeholder="********"/>
          </FormControl>
          <FormDescription>
            Kérjük, erősítsd meg a jelszavadat.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <Field>
      <FieldDescription className="text-center">
        Már van fiókod?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="underline underline-offset-4 text-blue-600"
        >
          Jelentkezz be
        </button>
      </FieldDescription>
    </Field>
    <ReCAPTCHA
      sitekey="6LfOlv4rAAAAACbIEwO_QToOchP5jP07CO5q0SjH"
      onChange={handleCaptchaChange}
      className="mx-auto"
    />

    <Button type="submit">Fiók létrehozása</Button>
  </form>
</Form> 
  )
}
