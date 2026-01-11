import { AuthGuard } from '@/components/AuthGuard'
import { DefaultUIFrame } from '@/components/DefaultUIFrame'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/settings')({
  component: () => (
    <AuthGuard>
      <RouteComponent />
    </AuthGuard>
  ),
})

function RouteComponent() {
  const [ShowMenuPoint, setShowMenuPoint] = useState("Fiok");
  return (
    <DefaultUIFrame>
      <div className="flex flex-col md:flex-row h-full bg-red-200">
        {/* Sidebar */}
        <div className="w-full md:w-64 shadow rounded-md p-4 mb-6 md:mb-0 bg-red-100">
          <h2 className="text-xl font-bold mb-6">Beállítások</h2>
          <ul className="space-y-3">
            <li className="cursor-pointer p-2 rounded hover:bg-gray-200 hover:border-2 hover:border-black bg-red-200 rounded-lg underline hover:no-underline" onClick={() => setShowMenuPoint("Fiok")}>Fiók</li>
            <li className="cursor-pointer p-2 rounded hover:bg-gray-200 hover:border-2 hover:border-black bg-red-200 rounded-lg underline hover:no-underline" onClick={() => setShowMenuPoint("Erteseites")}>Értesítések</li>
            <li className="cursor-pointer p-2 rounded hover:bg-gray-200 hover:border-2 hover:border-black bg-red-200 rounded-lg underline hover:no-underline" onClick={() => setShowMenuPoint("Adatvedelem")}>Adatvédelem</li>
          </ul>
        </div>

        {/* Main content */}
        {ShowMenuPoint !== "Fiok" ? ShowMenuPoint !== "Erteseites" ? <AdatvedelemSettings /> : <ErtesitesSettings /> : <FiokSettings />

        }
      </div>
    </DefaultUIFrame>
  )
}

function FiokSettings() {
  return (
    <div className="flex-1 md:ml-6 bg-red-100 shadow rounded-md p-6">
      <h1 className="text-2xl font-bold mb-6">Fiók beállítások</h1>
      <div className="space-y-4">

      </div>
    </div>
  )
}
function ErtesitesSettings() {
  const [terms1, setTerms1] = useState(false)
  const [terms2, setTerms2] = useState(false)
  const [terms3, setTerms3] = useState(false)
  const [terms4, setTerms4] = useState(false)
  const [terms5, setTerms5] = useState(false)
  const GetJson = () => {
    let Data = {
      new_post: terms1,
      new_comment_on_post: terms2,
      new_reaction_on_post: terms3,
      new_login: terms4,
      new_friend_request: terms5,
    }
    return Data;
  }
  return (
    <div className="flex-1 md:ml-6 bg-red-100 shadow rounded-md p-6">
      <h1 className="text-2xl font-bold mb-6">Értesítések beállítások</h1>
      <div className="space-y-4 bg-rose-50 p-6 py-10 rounded-lg">
        <div className="flex flex-col gap-6">

          <div className="flex items-start gap-3 bg-rose-200 p-2 rounded-xl">
            <Checkbox id="terms-1" className='bg-red-300' checked={terms1} onCheckedChange={(checked) => setTerms1(checked === true)}/>
            <div className="grid gap-2">
              <Label htmlFor="terms-1">Értesítés új posztról</Label>
              <p className="text-muted-foreground text-sm">
                Ha valaki új posztot tesz közzé, kapsz értesítést.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-rose-200 p-2 rounded-xl">
            <Checkbox id="terms-2" className='bg-red-300' checked={terms2} onCheckedChange={(checked) => setTerms2(checked === true)}/>
            <div className="grid gap-2">
              <Label htmlFor="terms-2">Értesítés új kommentről a posztodon</Label>
              <p className="text-muted-foreground text-sm">
                Ha valaki kommentel a posztodra, kapsz értesítést.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-rose-200 p-2 rounded-xl">
            <Checkbox id="terms-3" className='bg-red-300' checked={terms3} onCheckedChange={(checked) => setTerms3(checked === true)}/>
            <div className="grid gap-2">
              <Label htmlFor="terms-3">Értesítés új reakcióról a posztodon</Label>
              <p className="text-muted-foreground text-sm">
                Ha valaki reagál a posztodra, kapsz értesítést.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-rose-200 p-2 rounded-xl">
            <Checkbox id="terms-4" className='bg-red-300' checked={terms4} onCheckedChange={(checked) => setTerms4(checked === true)}/>
            <div className="grid gap-2">
              <Label htmlFor="terms-4">Értesítés bejelentkezésről</Label>
              <p className="text-muted-foreground text-sm">
                Ha valaki bejelentkezik a fiókodba, kapsz értesítést.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-rose-200 p-2 rounded-xl">
            <Checkbox id="terms-5" className='bg-red-300' checked={terms5} onCheckedChange={(checked) => setTerms5(checked === true)}/>
            <div className="grid gap-2">
              <Label htmlFor="terms-5">Értesítés új barátkérésről</Label>
              <p className="text-muted-foreground text-sm">
                Ha valaki barátkérést küld neked, kapsz értesítést.
              </p>
            </div>
          </div>
          <div>
            <Button variant={"outline"} onClick={()=>GetJson()}>Mentés</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
function AdatvedelemSettings() {
  return (
    <div className="flex-1 md:ml-6 bg-red-100 shadow rounded-md p-6">
      <h1 className="text-2xl font-bold mb-6">Adat védelmi beállítások</h1>
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-rose-200 p-2 rounded-xl">
          <Checkbox id="terms-6" className='bg-red-300' />
          <div className="grid gap-2">
            <Label htmlFor="terms-6">Engedélyezed, hogy az oldal felhasználja az adataidat az oldal javítása érdekében!</Label>
          </div>
        </div>
      </div>
    </div>
  )
}