import { AuthGuard } from '@/components/custom/AuthGuard/AuthGuard'
import { DefaultUIFrame } from '@/components/custom/DefaultUIFrame/DefaultUIFrame'
import { createFileRoute } from '@tanstack/react-router'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Mail, Users, ImageIcon, FileText } from 'lucide-react'

export const Route = createFileRoute('/_aloldalak/about')({
    component: () => (
        <AuthGuard>
            <RouteComponent />
        </AuthGuard>
    ),
})

function RouteComponent() {
    return (
        <DefaultUIFrame>
            <ScrollArea className="h-[calc(100vh-80px)] w-full p-14 bg-red-50 text-gray-900">
                {/* Hero szekció */}
                <div className="flex flex-col items-center text-center gap-6 mb-12">
                    <h1 className="text-5xl font-bold text-red-950">Rólunk – VizsgaRemek</h1>
                    <p className="max-w-3xl text-lg text-gray-700">
                        A <span className="font-semibold">VizsgaRemek</span> platform célja, hogy a felhasználók könnyedén posztolhassanak, képeket tölthessenek fel,
                        barátokat szerezzenek, és naprakész hírekhez férjenek hozzá biztonságos és közösségbarát környezetben.
                    </p>
                </div>

                {/* Fő funkciók */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-6xl mx-auto">
                    <Card className="bg-white shadow rounded-lg">
                        <CardHeader className="flex items-center gap-2">
                            <FileText className="w-6 h-6 text-red-900" />
                            <CardTitle>Hírek & Posztok</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Posztolhatsz szöveget, cikket, rövid híreket és kommentelheted barátaid bejegyzéseit.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow rounded-lg">
                        <CardHeader className="flex items-center gap-2">
                            <ImageIcon className="w-6 h-6 text-red-900" />
                            <CardTitle>Képfeltöltés</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Egyszerűen megoszthatsz képeket a profilodon, albumaidban, és a közösségeddel.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow rounded-lg">
                        <CardHeader className="flex items-center gap-2">
                            <Users className="w-6 h-6 text-red-900" />
                            <CardTitle>Barátok & Kapcsolatok</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Keress és ismerj meg új embereket, kezdeményezz barátságot és építs aktív közösséget.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow rounded-lg">
                        <CardHeader className="flex items-center gap-2">
                            <Mail className="w-6 h-6 text-red-900" />
                            <CardTitle>Értesítések</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Kapj valós idejű értesítéseket a posztokról, kommentekről és barátkérelemről.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>

                <Separator className="my-12" />

                {/* Küldetés & Értékek & Csapat */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 max-w-6xl mx-auto">
                    <Card className="bg-white shadow rounded-lg p-6">
                        <CardTitle className="text-red-900">Küldetésünk</CardTitle>
                        <CardDescription>
                            Biztonságos, gyors és átlátható közösségi platformot biztosítunk, ahol minden felhasználó számára elérhető a tartalom.
                        </CardDescription>
                    </Card>
                    <Card className="bg-white shadow rounded-lg p-6">
                        <CardTitle className="text-red-900">Értékeink</CardTitle>
                        <CardDescription>
                            Átláthatóság, adatvédelem és felhasználói élmény. Mindig a legjobb gyakorlatokat követjük.
                        </CardDescription>
                    </Card>
                    <Card className="bg-white shadow rounded-lg p-6">
                        <CardTitle className="text-red-900">Csapatunk</CardTitle>
                        <CardDescription>
                            Tapasztalt fejlesztők, UI/UX dizájnerek és tartalommenedzserek dolgoznak a platform folyamatos fejlesztésén.
                        </CardDescription>
                    </Card>
                </div>

                <Separator className="my-12" />

                {/* Adatvédelem & GDPR */}
                <Card className="bg-red-100 p-6 max-w-6xl mx-auto shadow rounded-lg mb-12">
                    <CardTitle className="text-red-900">Adatvédelem & GDPR</CardTitle>
                    <CardDescription>
                        A VizsgaRemek platform megfelel az EU által előírt GDPR szabályoknak. A felhasználói adatok kezelése átlátható, mindig jogszerű és biztonságos.
                        Az adatokat nem adjuk át harmadik félnek engedély nélkül.
                    </CardDescription>
                    <Button variant="link" className="mt-2 text-red-900 underline">
                        <a href="/privacy">Adatvédelmi irányelvek</a>
                    </Button>
                </Card>

                <Separator className="my-12" />

                {/* Kapcsolat */}
                <Card className="bg-white p-6 max-w-6xl mx-auto shadow rounded-lg mb-20">
                    <CardTitle className="text-red-900">Kapcsolat</CardTitle>
                    <CardDescription>
                        Ha kérdésed van, írj nekünk e-mailt: <a href="mailto:Hartwigmatos@gmail.com" className="underline text-red-900">Hartwigmatos@gmail.com</a> vagy <a href="mailto:murarbalint688@gmail.com" className="underline text-red-900">murarbalint688@gmail.com</a>
                    </CardDescription>
                </Card>
            </ScrollArea>

        </DefaultUIFrame>
    )
}
