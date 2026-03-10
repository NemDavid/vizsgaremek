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
import { useMutation } from "@tanstack/react-query"
import { RegisterRequest } from "../axios/axiosClient"
import { Eye, EyeClosed, InfoIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Loader } from "../Loader"

type SignupFormProps = React.ComponentProps<"form"> & {
  onSwitch?: () => void;
};

export const registerSchema = z.object({
  username: z.string().min(3, {
    message: "A felhasználónévnek legalább 3 karakter hosszúnak kell lennie.",
  }).max(21, {
    message: "A felhasználónév legfeljebb 21 karakter hosszú lehet.",
  }).regex(/^[a-zA-Z0-9_]+$/, {
    message: "A felhasználónév csak betűket, számokat és aláhúzásokat tartalmazhat.",
  }),
  email: z.email({
    message: "Érvénytelen e-mail cím.",
  }),
  password: z
    .string()
    .min(8, { message: "A jelszónak legalább 8 karakter hosszúnak kell lennie." })
    .max(21, { message: "A jelszó legfeljebb 21 karakter hosszú lehet." })
    .regex(/[a-z]/, { message: "A jelszónak tartalmaznia kell legalább egy kisbetűt." })
    .regex(/[A-Z]/, { message: "A jelszónak tartalmaznia kell legalább egy nagybetűt." })
    .regex(/\d/, { message: "A jelszónak tartalmaznia kell legalább egy számot." })
    .regex(/[@$!%*?&#+-]/, { message: "A jelszónak tartalmaznia kell legalább egy speciális karaktert (@$!%*?&#)." }),
  confirm_password: z
    .string()
    .min(8, { message: "A jelszónak legalább 8 karakter hosszúnak kell lennie." })
    .max(21, { message: "A jelszó legfeljebb 21 karakter hosszú lehet." }),
})
  .refine((data) => data.password === data.confirm_password, {
    message: "A jelszavaknak egyezniük kell.",
    path: ["confirm_password"],
  });


export type RegisterSchema = z.infer<typeof registerSchema>

export function SignupForm({ className, onSwitch, ...props }: SignupFormProps) {
  const [PasswordShown, setPasswordShown] = useState<boolean>(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const { mutate: register, isPending } = useMutation({
    mutationFn: ({ data }: { data: RegisterSchema }) => RegisterRequest(data),
    onError: (error: any) => {
      toast.error(error.response.data.message)
    },
    onSuccess: () => {
      toast.success("Fiók aktiválás", {
        description: "E-mailt küldtünk a fiók megerősítéséhez. Kérjük, ellenőrizd a postaládád! Amennyiben nem találod, nézd meg a spam mappát is. Ha a fiókodat 30 percen belül nem erősíted meg, a fiók automatikusan törlésre kerül.",
        duration: 30000,
      })
    }
  })
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
    mode: "onChange",
  })
  function onSubmit(values: RegisterSchema) {
    if (!captchaValue) {
      toast.error("Kérjük, erősítsd meg, hogy nem vagy robot!")
      return
    }
    else {
      register({ data: values })
    }
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
                <Input id="email" type="email" placeholder="user@mihirunk.hu" {...field} required />
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
                <InputGroup>
                  <InputGroupInput id="username" placeholder="Adj meg egy felhasználó nevet" type="text" {...field} required />
                  <InputGroupAddon align="inline-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InputGroupButton
                          variant="ghost"
                          aria-label="Info"
                          size="icon-xs"
                        >
                          <InfoIcon />
                        </InputGroupButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>A felhasználó név egyedi</p>
                      </TooltipContent>
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroup>
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
                <InputGroup>
                  <InputGroupInput placeholder="Add meg jelszavad" type={PasswordShown ? "text" : "password"}{...field} required />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      variant="ghost"
                      aria-label="Info"
                      size="icon-xs"
                      onClick={() => setPasswordShown(!PasswordShown)}
                    >
                      {PasswordShown ? <Eye /> : <EyeClosed />}
                    </InputGroupButton>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InputGroupButton
                          variant="ghost"
                          aria-label="Info"
                          size="icon-xs"
                        >
                          <InfoIcon />
                        </InputGroupButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>A jelszónak a következő feltételeknek kell megfelelnie:</p>
                        <ul>
                          <li>Legalább 8 karakter hosszú, maximum 21 karakter.</li>
                          <li>Tartalmaznia kell legalább egy <strong>kisbetűt</strong>.</li>
                          <li>Tartalmaznia kell legalább egy <strong>nagybetűt</strong>.</li>
                          <li>Tartalmaznia kell legalább egy <strong>számot</strong>.</li>
                          <li>Tartalmaznia kell legalább egy <strong>speciális karaktert</strong> (@$!%*?&#+-).</li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroup>

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
                <Input onFocus={() => { setPasswordShown(false) }} id="password" type="password" {...field} required placeholder="********" />
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
        {isPending ? <Loader /> : ""}
        <Button type="submit">Fiók létrehozása</Button>
      </form>
    </Form>
  )
}
