import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@/components/ui/button" 
import { Card, CardContent, 
} from "@/components/ui/card"


export const Route = createFileRoute('/AdminPanel/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col">
      {/* NAVBAR itt van külön komponensből */}
      {/* <Navbar /> */}

      {/* Tartalom */}
      <div className="flex flex-1 overflow-hidden">
        {/* BAL OLDALI MENÜ */}
        <aside className="w-64 border-r border-black p-4 flex flex-col gap-3">
          <Button variant="outline">Felhasználók</Button>
          <Button variant="outline">Bejegyzések</Button>
          <Button variant="outline">Chatek</Button>
          <Button variant="outline">Updatek Kihirdetése</Button>
          <Button variant="outline">Tiltások</Button>
        </aside>

        {/* FŐ PANEL */}
        <main className="flex-1 p-6 border-l border-black flex items-center justify-center">
          <Card className="w-full h-full flex items-center justify-center">
            <CardContent className="text-center text-lg text-gray-600">
              Panel később fogunk megcsinálni
            </CardContent>
          </Card>
          
        </main>
      </div>
    </div>
  )
}
