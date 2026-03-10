import { useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "../../ui/button"
import { GetKick, postKick } from "../../axios/axiosClient"
import { Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AxiosResponse } from "axios"

type KickRow = {
    ID: number
    FROM_USER_ID: number
    TO_USER_ID: number
    created_at: string // YYYY-MM-DD
    updated_at: string // YYYY-MM-DD
}


const Kick = (userId: bigint) => postKick(userId)

const DAY_MS = 24 * 60 * 60 * 1000
function utcDayStamp(ymd: string) {
    const [y, m, d] = ymd.split("-").map(Number)
    return Date.UTC(y, m - 1, d)
}
function daysSince(ymd: string) {
    return Math.floor((Date.now() - utcDayStamp(ymd)) / DAY_MS)
}

export function KickButton({ id, myid, className }: { id: bigint; myid: string, className: string }) {
    const qc = useQueryClient()
    
    const { data, isLoading } = useQuery({
        queryKey: ["Rugas", id,myid],
        queryFn: async () => {
            const response = await GetKick();
            return response;
        },
        staleTime: 1000 * 60 * 60,
        enabled: myid != null && id != null,
    });

    const kicks = data?.data ?? []

    // AB = én -> ő
    const AB = useMemo(() => {
        const me = String(myid)
        const other = String(id)
        return kicks.find(
            (k:KickRow) => String(k.FROM_USER_ID) === me && String(k.TO_USER_ID) === other
        )
    }, [kicks, id, myid])

    const ageDays = AB ? daysSince(AB.updated_at) : null

    const isFresh = ageDays !== null && ageDays < 14
    const isOld = ageDays !== null && ageDays >= 14

    // A oldal: friss -> disabled, régi -> nem disabled de “pipa + más szín”, nincs -> normál
    const disabled = isFresh

    const { mutate: doKick, isPending } = useMutation({
        mutationFn: (userId: bigint) => Kick(userId),
        onSuccess: async () => {
            await qc.refetchQueries({ queryKey: ["Rugas"] })
            await qc.refetchQueries({ queryKey: ["Connection", "Friends"], })
        },
    })

    if (isLoading || isPending) return <Loader2 className="animate-spin" />

    return (
        <Button
            variant="outline"
            disabled={disabled}
            onClick={() => doKick(id)}
            className={`${cn(
                // Régi kick van, nincs vissza -> kiemelt állapot
                isOld && "border-amber-500 bg-amber-50 text-amber-900 hover:bg-amber-100",
                // Friss kick van -> disabled is legyen láthatóbb
                isFresh && "bg-slate-200 text-slate-600 opacity-100"
            )} ${className}`}
            title={
                isFresh
                    ? "Már kickelted az elmúlt 2 hétben."
                    : isOld
                        ? "Már kickelted régebben – frissítheted."
                        : undefined
            }
        >
            <img src="/kicking.png" alt="Kick" className="size-6 bg-slate-200 rounded-full" />
            Rugás
            {isOld && <Check className="ml-2 size-4" />}
        </Button>
    )
}
