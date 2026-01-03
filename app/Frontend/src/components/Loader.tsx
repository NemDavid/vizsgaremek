

export function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-background/70 backdrop-brightness-75" />
            <span className="loader">
                <img alt="Logó" src="/loader.png" className="w-full h-full object-contain" />
            </span>
        </div>
    )
}
