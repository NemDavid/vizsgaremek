export default function AdsFrame({ url, className }: { url: string, className?: string }) {
    return (
        <aside className={`w-[300px] border-gray-300 p-4 bg-red-950 border-red-300 ${className}`}>
            <h2 className="font-bold text-lg text-white mb-2">Hirdetés</h2>
            <img
                src={url}
                alt="Hirdetés"
                className="w-full h-auto rounded"
            />
        </aside>
    )
}