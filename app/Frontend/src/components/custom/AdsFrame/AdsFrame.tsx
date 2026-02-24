import { GetAds } from "@/components/axios/axiosClient";
import { Loader } from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";

type AdsVariant = "side" | "bottom";

export default function AdsFrame({
    className,
    id,
    variant = "side",
}: {
    className?: string;
    id: number;
    variant?: AdsVariant;
}) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["ads", id],
        queryFn: () => GetAds(), // ha tudsz: GetAds(id) még jobb lenne
        gcTime: 0,
        retry: 0,
        refetchOnMount: false,
    });

    if (isLoading) return <Loader />;

    const isBottom = variant === "bottom";

    return (
        <aside
            className={[
                "border-gray-300",
                isBottom
                    ? "w-full h-full p-2 flex items-center justify-between gap-3 border-2 border-red-400 bg-red-900"
                    : "w-[300px] p-4 bg-red-950",
                className ?? "",
            ].join(" ")}
        >
            {!isBottom && (
                <h2 className="font-bold text-lg text-white mb-2">Hirdetés</h2>
            )}

            {isError ? (
                <p
                    className={[
                        "text-red-900 bg-rose-50 font-bold text-center rounded",
                        isBottom ? "p-2 text-xs m-0" : "m-2 p-2",
                    ].join(" ")}
                >
                    A hirdetés nem töltődött be.
                    {!isBottom && (
                        <>
                            <br />
                            Előfordulhat, hogy hirdetésblokkolót (AdBlock) használsz.
                            <br />
                            <br />
                            Kérjük, kapcsold ki ezen az oldalon, mert a hirdetések
                            segítségével tudjuk fenntartani és fejleszteni az oldalt.
                            <br />
                            Köszönjük a támogatásod ❤️
                        </>
                    )}
                </p>
            ) : (
                <img
                    src={data?.data.imagePath}
                    alt={data?.data.subject}
                    title={data?.data.title}
                    className={isBottom ? "w-full h-full object-contain rounded" : "w-full h-auto rounded"}
                />
            )}
        </aside>
    );
}