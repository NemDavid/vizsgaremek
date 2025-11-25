import { createFileRoute } from '@tanstack/react-router'
import { DefaultUIFrame } from "@/components/DefaultUIFrame";

export const Route = createFileRoute('/profil/$profilId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DefaultUIFrame className='bg-slate-500 min-h-screen text-white"'>
      
      {/* BANNER */}
      <div className="relative w-full h-40 bg-gradient-to-b from-indigo-600 to-purple-100">
        {/* Profilkép lelógva középre */}
        <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
          <img
            src="/dpfp.png"
            alt="Profilkép"
            className="w-40 h-40 rounded-full border-4 border-slate-950 object-cover shadow-lg bg-slate-100"
          />
        </div>
      </div>

      {/* Név és statok */}
      <div className="-mt-20 flex flex-col items-center text-center px-4 border-b-10 pb-5 bg-slate-400 pt-40">
        <h1 className="text-2xl font-semibold">Felhasználó Neve</h1>

        <div className="flex gap-8 mt-4 text-sm text-slate-300">
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-lg">42</span>
            <span>Barát</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-lg">128</span>
            <span>Poszt</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-lg">12</span>
            <span>Szint</span>
          </div>
        </div>
      </div>

      {/* Legutóbbi aktivitások */}
      <div className="mt-10 px-6 pb-10">
        <h2 className="text-xl font-semibold mb-4">Legutóbbi aktivitások</h2>

        {/* Lista — te töltöd majd meg */}
        <div className="space-y-4">
          {/* Példák törölve — üresen hagyva neked */}
        </div>
      </div>

    </DefaultUIFrame>
  )

}
