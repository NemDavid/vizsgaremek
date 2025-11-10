export function Footer() {
  return (
      <div className="flex flex-col w-full h-fit bg-[#8d0909] text-[#ffffff] px-14 py-14">
        <div className="flex flex-row">
            <div className="flex flex-col gap-2 justify-center w-[35%] w-[35%]">
                <div className="flex items-center w-full gap-4">
                    <img alt="Logó" src="icon-frame.png" className="w-32 h-32"/>

                    <div className="text-5xl font-bold size-sx">Mi Hírünk</div>
                </div>

            </div>
            <div className="flex flex-row w-[65%] justify-end gap-16 text-nowrap">
                <div className="grid grid-cols-3 gap-24">
                    <div className="flex flex-col gap-2">
                        <div className="font-bold uppercase text-[#f3ce00] pb-3">Felfedezés</div> 
                        <p className="hover:underline">Funkciók</p>  
                        <p className="hover:underline">Dokumentáció</p>  
                        <p className="hover:underline">Árazás</p>  
                        <p className="hover:underline">Biztonság</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="font-bold uppercase text-[#f3ce00] pb-3">About us</div> 
                        <p className="hover:underline">Rólunk</p>  
                        <p className="hover:underline">Kapcsolat</p>  
                        <p className="hover:underline">Támogatás</p>  
                        <p className="hover:underline">Hírek</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="font-bold uppercase text-[#f3ce00] pb-3">Jogi</div> 
                        <p className="hover:underline">Impresszum</p>  
                        <p className="hover:underline">Adatvédelmi irányelvek</p>  
                        <p className="hover:underline">Felhasználási feltételek</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-full border-t border-gray-500 my-8"></div>
        <div className="text-center">© 2025 Mi Hírünk - Minden jog fenntartva. <p className="text-xs">Minden adatod miénk</p></div>
    </div>
  )
}
