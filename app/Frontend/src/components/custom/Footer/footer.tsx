import { Link } from "@tanstack/react-router";

export function Footer({className}:{className?:string}) {
    return (
        <div className={`flex flex-col w-full bg-red-950 text-white px-6 py-10 lg:px-14 lg:py-14 ${className}`}>
            {/* Fő tartalom */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

                {/* Bal oldal: logó + cím */}
                <div className="flex flex-col gap-4 justify-center lg:w-[35%]">
                    <div className="flex items-center gap-4">
                        <img alt="Logó" src="/icon-frame.png" className="w-24 h-24 sm:w-32 sm:h-32" />
                        <div className="text-3xl sm:text-5xl font-bold">Mi Hírünk</div>
                    </div>
                </div>

                {/* Jobb oldal: menük */}
                <div className="flex justify-start lg:justify-end lg:w-[65%]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-24">

                        {/* Felfedezés */}
                        <div className="flex flex-col gap-2">
                            <div className="font-bold uppercase text-[#f3ce00] pb-2">Felfedezés</div>
                            <p className="hover:underline"><Link to="/about">Funkciók</Link></p>
                            <p className="hover:underline"><Link to="/privacy">Biztonság</Link></p>
                        </div>

                        {/* About us */}
                        <div className="flex flex-col gap-2">
                            <div className="font-bold uppercase text-[#f3ce00] pb-2">About us</div>
                            <p className="hover:underline"><Link to="/about">Rólunk</Link></p>
                            <p className="hover:underline"><Link to="/about">Kapcsolat</Link></p>
                            <p className="hover:underline"><Link to="/news">Hírek</Link></p>
                        </div>

                        {/* Jogi */}
                        <div className="flex flex-col gap-2">
                            <div className="font-bold uppercase text-[#f3ce00] pb-2">Jogi</div>
                            <p className="hover:underline"><Link to="/privacy">Adatvédelmi irányelvek</Link></p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Vonal */}
            <div className="w-full border-t border-gray-500 my-6 lg:my-8"></div>

            {/* Alsó rész */}
            <div className="text-center text-sm sm:text-base">
                © 2025 Mi Hírünk - Minden jog fenntartva.
                <p className="text-xs mt-1">Minden adatod miénk.</p>
            </div>
        </div>

    )
}
