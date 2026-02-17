import { GetAds } from "@/components/axios/axiosClient"
import { Loader } from "@/components/Loader"
import { useQuery } from "@tanstack/react-query"

export default function AdsFrame({ className,id}: { className?: string, id:number }) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["ads",id ],
        queryFn: () => GetAds(),
        gcTime:0,
        retry: 0,
        refetchOnMount:false,
    })

    if (isLoading) {
        return <Loader />
    }
    return (
        <aside className={`w-[300px] border-gray-300 p-4 bg-red-950 ${className}`}>
            <h2 className="font-bold text-lg text-white mb-2">Hirdetés</h2>
            {isError ?
                <>
                    <p className="text-red-900 bg-rose-50 m-2 p-2 font-bold text-center rounded">
                        A hirdetés nem töltődött be.<br />
                        Előfordulhat, hogy hirdetésblokkolót (AdBlock) használsz.
                        <br /><br />
                        Kérjük, kapcsold ki ezen az oldalon, mert a hirdetések
                        segítségével tudjuk fenntartani és fejleszteni az oldalt.
                        <br />
                        Köszönjük a támogatásod ❤️
                    </p>
                </>
                :
                <>
                    <img
                        src={data?.data.imagePath}
                        alt={data?.data.subject}
                        title={data?.data.title}
                        className="w-full h-auto rounded"
                    />
                </>
            }
        </aside>
    )
}