import { AuthGuard } from '@/components/custom/AuthGuard/AuthGuard'
import { DefaultUIFrame } from '@/components/custom/DefaultUIFrame/DefaultUIFrame'
import { createFileRoute } from '@tanstack/react-router'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = createFileRoute('/_aloldalak/privacy')({
    component: () => (
        <AuthGuard>
            <RouteComponent />
        </AuthGuard>
    ),
})

function RouteComponent() {
    return (
        <DefaultUIFrame>
            <div className="flex flex-col items-center w-full h-full p-10 bg-red-50 text-gray-900 gap-10">
                <h1 className="text-5xl font-bold text-red-950 mb-6">Adatvédelmi irányelvek</h1>
                <p className="max-w-4xl text-lg text-gray-700 text-center">
                    Ez az oldal összefoglalja, hogyan kezeljük a felhasználói adatokat, hogyan védjük a magánéletedet, és milyen jogok illetnek meg az EU GDPR szabályozása alapján.
                </p>

                {/* Scrollozható tartalom */}
                <ScrollArea className="w-full max-w-5xl h-[600px] bg-white shadow rounded-lg p-6">
                    <div className="flex flex-col gap-6">

                        {/* Szekció: Adatgyűjtés */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold text-red-900">1. Adatgyűjtés</h2>
                            <p className="text-gray-700">
                                A Mi Hírünk különböző típusú adatokat gyűjt a felhasználóktól, beleértve a regisztrációs adatokat, bejelentkezési információkat, böngészési előzményeket és interakciókat a platformon.
                            </p>
                            <p className="text-gray-700">
                                Ezek az adatok lehetővé teszik a szolgáltatás személyre szabását, a funkciók optimalizálását, és a biztonság fenntartását.
                            </p>
                        </div>

                        {/* Szekció: Cookie-k és nyomkövetés */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold text-red-900">2. Cookie-k és nyomkövetés</h2>
                            <p className="text-gray-700">
                                A weboldal sütiket (cookie-kat) használ a felhasználói élmény javítása, statisztikák gyűjtése és személyre szabott tartalmak megjelenítése érdekében.
                            </p>
                            <p className="text-gray-700">
                                A felhasználó bármikor kezelheti a cookie-beállításait a böngészője vagy a profilbeállítások menüpontban.
                            </p>
                        </div>

                        {/* Szekció: Adatkezelés és tárolás */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold text-red-900">3. Adatkezelés és tárolás</h2>
                            <p className="text-gray-700">
                                Minden személyes adatot biztonságosan, titkosítva tárolunk, és csak a szükséges ideig őrzünk.
                                A hozzáférést szigorúan korlátozzuk a platform működéséhez elengedhetetlen személyekre.
                            </p>
                        </div>

                        {/* Szekció: Felhasználói jogok */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold text-red-900">4. Felhasználói jogok</h2>
                            <p className="text-gray-700">
                                Az EU GDPR előírásai alapján minden felhasználónak joga van:
                            </p>
                            <ul className="list-disc ml-6 text-gray-700">
                                <li>Hozzáférni a róla tárolt adatokhoz</li>
                                <li>Adatainak helyesbítését kérni</li>
                                <li>Adatai törlését vagy anonimizálását kérni</li>
                                <li>Az adatkezelés korlátozását kérni</li>
                                <li>Tiltakozni az adatkezelés ellen</li>
                                <li>Adathordozhatóságot kérni</li>
                            </ul>
                        </div>

                        {/* Szekció: Adatbiztonság */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold text-red-900">5. Adatbiztonság</h2>
                            <p className="text-gray-700">
                                Minden adatot modern biztonsági technológiákkal védünk, beleértve a titkosítást, tűzfalakat és hozzáférés-kezelést.
                                Ezzel minimalizáljuk a jogosulatlan hozzáférés vagy adatvesztés kockázatát.
                            </p>
                        </div>

                        {/* Szekció: Kapcsolat */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold text-red-900">6. Kapcsolat</h2>
                            <p className="text-gray-700">
                                Ha kérdésed van az adatkezeléssel vagy jogi feltételekkel kapcsolatban, kérjük, vedd fel velünk a kapcsolatot:
                            </p>
                            <p className="text-gray-700 font-semibold">
                                Email: <a href="mailto:privacy@mihirunk.hu" className="underline text-red-900">privacy@mihirunk.hu</a>
                            </p>
                            <p className="text-gray-700 font-semibold">
                                Telefon: +36 20 123 4567
                            </p>
                        </div>

                        {/* Szekció: Módosítások */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold text-red-900">7. Irányelvek módosítása</h2>
                            <p className="text-gray-700">
                                Fenntartjuk a jogot, hogy az adatvédelmi irányelveket bármikor frissítsük. A módosítások a weboldalon történő közzétételt követően lépnek érvénybe.
                            </p>
                        </div>

                    </div>
                </ScrollArea>
            </div>
        </DefaultUIFrame>
    )
}
