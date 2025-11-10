export function AdsFrame({url}:{url:string}){
    return (
        <aside className="w-[300px] border-r-2 border-l-2 border-gray-300 p-4 bg-gray-100">
                <h2 className="font-bold text-lg mb-2">Hirdetés</h2>
                <img
                    src={url}
                    alt="Hirdetés"
                    className="w-full h-auto rounded"
                    />
        </aside>
    )
}