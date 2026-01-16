import { AuthGuard } from '@/components/custom/AuthGuard/AuthGuard'
import { DefaultUIFrame } from '@/components/custom/DefaultUIFrame/DefaultUIFrame'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_aloldalak/news')({
    component: () => (
        <AuthGuard>
            <RouteComponent />
        </AuthGuard>
    ),
})

const news = [
    {
        title: "Új funkció érkezett a Mi Hírünk platformra",
        summary: "Mostantól a felhasználók testreszabhatják a hírfolyamukat és személyre szabott értesítéseket kaphatnak.",
        date: "2026-01-04",
    },
    {
        title: "Biztonsági frissítés minden fiókhoz",
        summary: "A legújabb frissítés fokozza a fiókok biztonságát és javítja a belépési folyamatot.",
        date: "2026-01-02",
    },
    {
        title: "Közösségi esemény: Online beszélgetés a szerkesztőkkel",
        summary: "Csatlakozz élő beszélgetésünkhöz, ahol a legfrissebb hírekről és fejlesztésekről beszélgetünk.",
        date: "2026-01-01",
    },
]

function RouteComponent() {
    return (
        <DefaultUIFrame>
            <div className="flex flex-col items-center w-full p-10 bg-red-50 gap-10">
                <h1 className="text-5xl font-bold text-red-950 text-center mb-6">Aktuális Hírek</h1>
                <ScrollArea className="w-full max-w-6xl h-[650px] bg-white shadow rounded-lg p-6">
                    <div className="flex flex-col gap-6">
                        {news.map((item, idx) => (
                            <Card key={idx} className="bg-red-100 hover:bg-red-200 transition-all">
                                <CardHeader>
                                    <CardTitle className="text-red-900">{item.title}</CardTitle>
                                    <CardDescription className="text-gray-700 text-sm">{item.date}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-gray-800">
                                    <p>{item.summary}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </DefaultUIFrame>
    )
}
