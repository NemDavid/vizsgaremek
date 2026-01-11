import { Button } from "./ui/button";

export function KickButton({id}:{id:bigint}) {
    return (
        <Button variant={"outline"}>
            <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás
        </Button>
    )
}