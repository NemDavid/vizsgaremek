import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
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
import { RegisterConfirmRequest } from "./axios/axiosClient"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

type SignupFormProps = React.ComponentProps<"form"> & {
  onSwitch?: () => void;
  token: string; // <-- hozzáadva ide
};


export const confirmSchema = z.object({
  firstName: z.string().min(1, { message: "Kérjük add meg a keresztneved!" }),
  lastName: z.string().min(1, { message: "Kérjük add meg a vezetékneved!" }),
  schools: z.string().optional(),
  birthdate: z.string().optional(),
  birthPlace: z.string().optional(),
  avatar: z.any().refine(file => !file || file.size <= 5_000_000, "A kép maximum 5MB lehet.").optional(),
  bio: z.string().optional(),
})

export type ConfirmSchema = z.infer<typeof confirmSchema>

export function ProfilSetupForm({ className, onSwitch, token, ...props }: SignupFormProps) {
  const {mutate: confirm, isPending} = useMutation({
    mutationFn: ({data}:{data: ConfirmSchema}) => RegisterConfirmRequest(data,token),
    onError: () => {
      toast.error("Hiba történt a Regisztráció során. Probáld újra.")
    },
    onSuccess:()=>{
      toast.success("Fiók létrehozása sikeres 🎉", {
        description: "Kérjük, ellenőrizd a postaládád!",
        duration: 12000,
    })
    }
  })
  const form = useForm<ConfirmSchema>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      schools: "",
      birthdate: "",
      birthPlace: "",
      avatar: "",
      bio: "",
    },
    mode: "onChange",
  })
  function onSubmit(values: ConfirmSchema) {
    confirm({data: values})
    console.log(values)
    
  }
  if(isPending){
    return <div>Loading...</div>
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
      {/* First Name */}
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="firstName">Keresztnév *</FormLabel>
            <FormControl>
              <Input id="firstName" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="lastName">Vezetéknév *</FormLabel>
            <FormControl>
              <Input id="lastName" {...field} required />
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
              <Input id="schools" {...field} placeholder="Pl. ELTE, BME" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={form.control}
        name="birthdate"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="birthdate">Születési dátum</FormLabel>
            <FormControl>
              <Input id="birthdate" type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={form.control}
        name="birthPlace"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="birthPlace">Születési hely</FormLabel>
            <FormControl>
              <Input id="birthPlace" {...field} />
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
              <Input id="bio" {...field} placeholder="Rövid bemutatkozás" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
