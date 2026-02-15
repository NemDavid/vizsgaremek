import { AuthGuard } from '@/components/custom/AuthGuard/AuthGuard'
import { DefaultUIFrame } from '@/components/custom/DefaultUIFrame/DefaultUIFrame'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GetSettings, PasswordChange, SaveSettings } from '@/components/axios/axiosClient'
import { toast } from 'sonner'
import { Loader } from '@/components/Loader/Loader'
import { cn } from "@/lib/utils"

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



export const Route = createFileRoute('/settings/')({
    component: () => (
        <AuthGuard>
            <RouteComponent />
        </AuthGuard>
    ),
})

function RouteComponent() {
    return (
        <SideBar>
            <div className="p-6 m-4 bg-rose-50 w-full rounded-2xl shadow-sm">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    Beállítások – Segítség
                </h1>

                <div className="space-y-6 text-gray-700">
                    <div>
                        <h2 className="text-lg font-semibold mb-1">
                            Fiókbeállítások
                        </h2>
                        <p className="text-sm leading-relaxed">
                            Itt módosíthatod a felhasználónevedet, a jelszavadat és az e-mail címedet.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-1">
                            Értesítések
                        </h2>
                        <p className="text-sm leading-relaxed">
                            Itt beállíthatod, hogy milyen eseményekről szeretnél értesítést kapni.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-1">
                            Adatvédelem
                        </h2>
                        <p className="text-sm leading-relaxed">
                            Itt szabályozhatod, hogy az oldal milyen módon használhatja fel az adataidat
                            a szolgáltatás fejlesztése érdekében.
                        </p>
                    </div>
                </div>
            </div>

        </SideBar>
    )
}

export function SideBar({ children }: { children?: React.ReactNode }) {

    return (
        <DefaultUIFrame>
            <div className="flex flex-col md:flex-row h-full bg-red-200">
                {/* Sidebar */}
                <div className="w-full md:w-64 shadow rounded-md p-4 mb-6 md:mb-0 bg-red-100">
                    <h2 className="text-xl font-bold mb-6"><Link to='/settings'>Beállítások</Link></h2>
                    <ul className="space-y-3">
                        <Link to='/settings/account'><li className="cursor-pointer p-2 m-4 rounded hover:bg-gray-200 hover:border-2 hover:border-black bg-red-200 rounded-lg underline hover:no-underline">Fiók</li></Link>
                        <Link to='/settings/notification'><li className="cursor-pointer p-2 m-4 rounded hover:bg-gray-200 hover:border-2 hover:border-black bg-red-200 rounded-lg underline hover:no-underline">Értesítések</li></Link>
                        <Link to='/settings/privacy'><li className="cursor-pointer p-2 m-4 rounded hover:bg-gray-200 hover:border-2 hover:border-black bg-red-200 rounded-lg underline hover:no-underline">Adatvédelem</li></Link>
                    </ul>
                </div>
                {children}

            </div>
        </DefaultUIFrame>
    )
}
export const registerSchema = z.object({
    old_password:z.string()
        .max(21, { message: "A jelszó legfeljebb 21 karakter hosszú." }),
    new_password: z
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
    .refine((data) => data.new_password === data.confirm_password, {
        message: "A jelszavaknak egyezniük kell.",
        path: ["confirm_password"],
    });

type RegisterSchema = z.infer<typeof registerSchema>


export function FiokSettings() {
    return (
        <div className="flex-1 md:ml-6 bg-red-100 shadow rounded-md p-6">
            <h1 className="text-2xl font-bold mb-6">Fiók beállítások</h1>
            <div className="space-y-4 bg-rose-50 rounded-xl p-5">
                <PasswordReseter></PasswordReseter>
            </div>
        </div>
    )
}

function PasswordReseter() {
    const [newPasswordShown, setnewPasswordShown] = useState<boolean>(false)
    const [oldPasswordShown, setoldPasswordShown] = useState<boolean>(false)
    const { mutate: reset, isPending } = useMutation({
        mutationFn: ({ data }: { data: RegisterSchema }) => PasswordChange(data),
        onError: (error: any) => {
            toast.error(error.response.data.message)
        },
        onSuccess: () => {
            toast.success("Fiók jelszava megváltoztattva", {
                description: "Jelszava változott",
                duration: 30000,
            })
            form.reset()
        }
    })

    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            old_password: "",
            new_password: "",
            confirm_password: "",
        },
        mode: "onChange",
    })
    function onSubmit(values: RegisterSchema) {
        console.log(values);
        
        reset({data:values})

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Jelszó változtatás</h1>
                </div>

                <FormField
                    control={form.control}
                    name="old_password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center">
                                <FieldLabel htmlFor="new_password">Régi jelszavad</FieldLabel>
                            </div>
                            <FormControl>
                                <InputGroup>
                                    <InputGroupInput placeholder="Add meg az régi jelszavad" type={oldPasswordShown ? "text" : "password"}{...field} required id="old_password"/>
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            variant="ghost"
                                            aria-label="Info"
                                            size="icon-xs"
                                            onClick={() => setoldPasswordShown(!oldPasswordShown)}
                                        >
                                            {oldPasswordShown ? <Eye /> : <EyeClosed />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center">
                                <FieldLabel htmlFor="new_password">Új jelszó</FieldLabel>
                            </div>
                            <FormControl>
                                <InputGroup>
                                    <InputGroupInput placeholder="Add meg az új jelszavad" type={newPasswordShown ? "text" : "password"}{...field} required id="new_password"/>
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            variant="ghost"
                                            aria-label="Info"
                                            size="icon-xs"
                                            onClick={() => setnewPasswordShown(!newPasswordShown)}
                                        >
                                            {newPasswordShown ? <Eye /> : <EyeClosed />}
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
                                <FieldLabel htmlFor="confirm_password">Új jelszó megerősítése</FieldLabel>
                            </div>
                            <FormControl>
                                <Input onFocus={() => { setnewPasswordShown(false) }} id="confirm_password" type="password" {...field} required placeholder="********" />
                            </FormControl>
                            <FormDescription>
                                Kérjük, erősítsd meg a jelszavadat.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {isPending ? <Loader /> : ""}
                <Button type="submit">Jelszavad változtatása</Button>
            </form>
        </Form>
    )
}


export function ErtesitesSettings() {
    const queryclint = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: GetSettings,
    })
    const { mutate: save } = useMutation({
        mutationFn: (Settings: any) => SaveSettings(Settings),
        onError: (error: any) => {
            toast.error(error.response.data.message)
        },
        onSuccess: () => {
            toast.success("Beállításod el lett mentve 🔒", {
                duration: 3000,
            })
            queryclint.refetchQueries({ queryKey: ["settings"] })
        }
    })
    const [terms1, setTerms1] = useState(false)
    const [terms2, setTerms2] = useState(false)
    const [terms3, setTerms3] = useState(false)
    const [terms4, setTerms4] = useState(false)
    const [terms5, setTerms5] = useState(false)
    const [originalNotif, setOriginalNotif] = useState({
        new_post: false,
        new_comment_on_post: false,
        new_reaction_on_post: false,
        new_login: false,
        new_friend_request: false,
    })
    useEffect(() => {
        if (!data?.data.Notifications) return
        const notif = JSON.parse(data.data.Notifications)

        setTerms1(!!notif.new_post)
        setTerms2(!!notif.new_comment_on_post)
        setTerms3(!!notif.new_reaction_on_post)
        setTerms4(!!notif.new_login)
        setTerms5(!!notif.new_friend_request)

        setOriginalNotif({
            new_post: !!notif.new_post,
            new_comment_on_post: !!notif.new_comment_on_post,
            new_reaction_on_post: !!notif.new_reaction_on_post,
            new_login: !!notif.new_login,
            new_friend_request: !!notif.new_friend_request,
        })
    }, [data])
    const hasChanged =
        terms1 !== originalNotif.new_post ||
        terms2 !== originalNotif.new_comment_on_post ||
        terms3 !== originalNotif.new_reaction_on_post ||
        terms4 !== originalNotif.new_login ||
        terms5 !== originalNotif.new_friend_request

    const GetJson = () => {
        let Settings = {
            Notifications:
            {
                new_post: terms1,
                new_comment_on_post: terms2,
                new_reaction_on_post: terms3,
                new_login: terms4,
                new_friend_request: terms5,
            }
        }
        save(Settings)
    }


    if (isLoading) return <Loader />

    return (
        <div className="flex-1 md:ml-6 bg-red-100 shadow rounded-md p-6">
            <h1 className="text-2xl font-bold mb-6">Értesítések beállítások</h1>
            <div className="space-y-4 bg-rose-50 p-6 py-10 rounded-lg">
                <div className="flex flex-col gap-6">

                    <div className="flex items-start gap-3 bg-rose-200 p-2 rounded-xl">
                        <Checkbox id="terms-1" className="bg-red-300" checked={terms1} onCheckedChange={(checked) => setTerms1(checked === true)} />
                        <div className="grid gap-2">
                            <Label htmlFor="terms-1">Értesítés új posztról</Label>
                            <p className="text-muted-foreground text-sm">
                                Ha valaki új posztot tesz közzé, kapsz értesítést.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-rose-200 p-2 rounded-xl">
                        <Checkbox id="terms-2" className="bg-red-300" checked={terms2} onCheckedChange={(checked) => setTerms2(checked === true)} />
                        <div className="grid gap-2">
                            <Label htmlFor="terms-2">Értesítés új kommentről a posztodon</Label>
                            <p className="text-muted-foreground text-sm">
                                Ha valaki kommentel a posztodra, kapsz értesítést.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-rose-200 p-2 rounded-xl">
                        <Checkbox id="terms-3" className="bg-red-300" checked={terms3} onCheckedChange={(checked) => setTerms3(checked === true)} />
                        <div className="grid gap-2">
                            <Label htmlFor="terms-3">Értesítés új reakcióról a posztodon</Label>
                            <p className="text-muted-foreground text-sm">
                                Ha valaki reagál a posztodra, kapsz értesítést.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-rose-200 p-2 rounded-xl">
                        <Checkbox id="terms-4" className="bg-red-300" checked={terms4} onCheckedChange={(checked) => setTerms4(checked === true)} />
                        <div className="grid gap-2">
                            <Label htmlFor="terms-4">Értesítés bejelentkezésről</Label>
                            <p className="text-muted-foreground text-sm">
                                Ha valaki bejelentkezik a fiókodba, kapsz értesítést.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-rose-200 p-2 rounded-xl">
                        <Checkbox id="terms-5" className="bg-red-300" checked={terms5} onCheckedChange={(checked) => setTerms5(checked === true)} />
                        <div className="grid gap-2">
                            <Label htmlFor="terms-5">Értesítés új barátkérésről</Label>
                            <p className="text-muted-foreground text-sm">
                                Ha valaki barátkérést küld neked, kapsz értesítést.
                            </p>
                        </div>
                    </div>
                    <div>
                        <Button variant={"outline"} onClick={() => GetJson()} disabled={!hasChanged}>Mentés</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export function AdatvedelemSettings() {
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: GetSettings,
    })

    const { mutate: save } = useMutation({
        mutationFn: (settings: any) =>
            SaveSettings(settings),
        onError: (error: any) => {
            toast.error(error.response.data.message)
        },
        onSuccess: () => {
            toast.success("Adatvédelmi beállítás elmentve 🔒")
            queryClient.refetchQueries({ queryKey: ['settings'] })
        },
    })

    const [dataUsage, setDataUsage] = useState(false)
    const [originalDataUsage, setOriginalDataUsage] = useState(false)
    useEffect(() => {
        if (data?.data?.DataPrivacy === undefined) return

        setDataUsage(data.data.DataPrivacy)
        setOriginalDataUsage(data.data.DataPrivacy)
    }, [data])

    const hasChanged = dataUsage !== originalDataUsage

    const savePrivacy = () => {
        let settings = {
            DataPrivacy: dataUsage,
        }
        save(settings)
    }

    if (isLoading) return <Loader />

    return (
        <div className="flex-1 md:ml-6 bg-red-100 shadow rounded-md p-6">
            <h1 className="text-2xl font-bold mb-6">
                Adatvédelmi beállítások
            </h1>

            <div className="space-y-4 bg-rose-50 p-6 rounded-lg">
                <div className="flex items-start gap-3 bg-rose-200 p-3 rounded-xl">
                    <Checkbox
                        checked={dataUsage}
                        onCheckedChange={(checked) =>
                            setDataUsage(checked === true)
                        }
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="privacy">
                            Engedélyezed, hogy az oldal felhasználja az
                            adataidat a szolgáltatás fejlesztéséhez
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Az adatokat kizárólag statisztikai célokra
                            használjuk fel.
                        </p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    disabled={!hasChanged}
                    onClick={savePrivacy}
                >
                    Mentés
                </Button>
            </div>
        </div>
    )
}