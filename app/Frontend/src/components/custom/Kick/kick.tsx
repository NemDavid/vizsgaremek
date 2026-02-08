import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../ui/button";
import { JsonClient, postKick } from "../../axios/axiosClient";
import { Loader } from "lucide-react";

const Kick = (userId: bigint) => {
    return postKick(userId);
}

async function GetKick() {
  const response = await JsonClient.get("/api/kicks/all")
  
  return response;
}

export function KickButton({ id }: { id: bigint }) {
    const queryclient = useQueryClient();
    const {data} = useQuery({
        queryKey: ["Rugas",id],
        queryFn: () => GetKick()
    })
    console.log(data);
    
    const { mutate: doKick, isPending } = useMutation({
        mutationFn: (userId : bigint) => Kick(userId),
        onSuccess: () => {
            queryclient.refetchQueries({
                queryKey: [""],
            })
        }
    })


    if (isPending) {
        return <Loader/>
    }

    return (
        <Button variant={"outline"} onClick={() => doKick(id)}>
            <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás
        </Button>
    )
}