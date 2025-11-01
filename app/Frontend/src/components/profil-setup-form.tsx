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

import { toast } from "sonner"

type SignupFormProps = React.ComponentProps<"form"> & {
  onSwitch?: () => void;
};

const registerSchema = z.object()


type RegisterSchema = z.infer<typeof registerSchema>

export function ProfilSetupForm({ className, onSwitch, ...props }: SignupFormProps) {

  const form = useForm<RegisterSchema>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
      },
      mode:"onChange",
    })
    function onSubmit(values: RegisterSchema) {
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
      <h1 className="text-2xl font-bold">Hozd létre a profilod</h1>
      <p className="text-muted-foreground text-sm text-balance">
        Töltsd ki az alábbi űrlapot a profilod beálitásához.
      </p>
    </div>

    <Field>
      <FieldDescription className="px-6 text-center">
        A Folytatás gombra kattintással elfogadod a Szolgáltatási feltételeinket és az Adatvédelmi irányelveinket.
      
        <Button type="submit">Fiók létrehozása és megerősítéséhez</Button>
      </FieldDescription>
    </Field>
  </form>
</Form> 
  )
}
