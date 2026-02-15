import { useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "../../ui/button"
import { JsonClient, postKick } from "../../axios/axiosClient"
import { Loader2 } from "lucide-react"

type KickRow = {
    ID: number
    FROM_USER_ID: number
    TO_USER_ID: number
    created_at: string // "2026-02-15" (YYYY-MM-DD)
    updated_at: string
}

async function GetKick() {
    return JsonClient.get<KickRow[]>("/api/kicks/all")
}

const Kick = (userId: bigint) => postKick(userId)

const DAY_MS = 24 * 60 * 60 * 1000

function daysSince(dateYMD: string) {
    const [y, m, d] = dateYMD.split("-").map(Number)
    const t = Date.UTC(y, m - 1, d)
    const now = Date.now()
    return Math.floor((now - t) / DAY_MS)
}

export function KickButton({ id, myid }: { id: bigint; myid: bigint }) {
    const queryclient = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ["Rugas", String(id), String(myid)],
        queryFn: GetKick,
    })
    const kicks = data?.data ?? []

    // Megkeressük azt a kick-et, amit TE küldtél NEKI (ha van)
    const myKickToHim = useMemo(() => {
        const myIdStr = String(myid)
        const idStr = String(id)

        return kicks.find((k) =>
            String(k.FROM_USER_ID) === myIdStr &&
            String(k.TO_USER_ID) === idStr
        )
    }, [kicks, id, myid])

    const withinTwoWeeks = myKickToHim ? daysSince(myKickToHim.updated_at) < 14 : false
    const olderThanTwoWeeks = myKickToHim ? daysSince(myKickToHim.updated_at) >= 14 : false

    const { mutate: doKick, isPending } = useMutation({
        mutationFn: (userId: bigint) => Kick(userId),
        onSuccess: () => {
            // ez jobb mint refetchQueries üres kulccsal
            queryclient.invalidateQueries({ queryKey: ["Rugas"] })
        },
    })

    const disabled = withinTwoWeeks || isPending

    if (isLoading) return <Loader2 className="animate-spin" />
    if (isPending) return <Loader2 className="animate-spin" />

    return (
        <Button
            variant="outline"
            disabled={disabled}
            onClick={() => doKick(id)}
            className={
                olderThanTwoWeeks
                    ? "border-amber-500 bg-amber-50 text-amber-900 hover:bg-amber-100"
                    : ""
            }
            title={
                withinTwoWeeks
                    ? "Már rúgtad az elmúlt 2 hétben."
                    : olderThanTwoWeeks
                        ? "Volt már rugás, de 2 hétnél régebbi."
                        : undefined
            }
        >
            <img
                src="/kicking.png"
                alt="Kick"
                className="size-6 bg-slate-200 rounded-full"
            />
            Rugás
        </Button>
    )
}
