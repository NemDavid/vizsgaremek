import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { postKick } from "../components/axios/axiosClient";

const Kick = (userId: bigint) => {
    return postKick(userId);
}

export function KickButton({ id }: { id: bigint }) {
    const queryclient = useQueryClient();

    const { mutate: doKick, isPending } = useMutation({
        mutationFn: (userId : bigint) => Kick(userId),
        onSuccess: () => {
            queryclient.refetchQueries({
                queryKey: [""],
            })
        }
    })


    if (isPending) {
        return <p>töltés...</p>
    }

    return (
        <Button variant={"outline"} onClick={() => doKick(id)}>
            <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás
        </Button>
    )
}