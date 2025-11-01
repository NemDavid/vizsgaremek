import Header from '@/components/Header'
import { PostAccord } from '@/components/post-according'
import type { Post } from '@/components/post-according'

const postom: Post = {
  header: "sajt",
  content: "isten áld meg a magyart",
  hasMedia: true,
  created_at: new Date(),
  updated_at: new Date(),
  like: 1231,
  dislike: 1,
}

export function MainPage() {
  return (<>
  <Header />
  <div className="flex flex-col bg-white text-black">
    {/* Online barátok */}
    <div className="flex gap-3 overflow-x-auto border-b border-gray-300 p-3 bg-gray-50">
      {[
          "Murrár Bálint",
          "Hartwig-Matos Dávid",
          "Petró Ádám",
          "Kássa Gergő",
          "Zsozéatya",
          "Farkas Norbert ",
          "Daniel Peter Szabo",
          "Hunor Huszár",
          "Fekete Bogi",
          "Földi Dominik",
          "Bakai Erik",
          
        ].map((name, i) => (
            <div
            key={i}
            className="flex items-center bg-gray-200 hover:bg-red-600 hover:text-white cursor-pointer transition rounded-l-full rounded-r-md pr-3 min-w-[180px]"
            >
          {/* Avatar teljesen kerek */}
          <img
              src="/Lakatos_Dszumandzsi.png"
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
              />
          {/* Név egy sorban */}
          <span className="text-sm ml-2 truncate">{name.split(" ")[1]} {name.split(" ")[0]}</span>
        </div>
      ))}
    </div>

      {/* Háromoszlopos layout */}
      <div className="flex flex-1">
        {/* Bal oszlop - hirdetés */}
        <aside className="w-[300px] border-r-2 border-gray-300 p-4 bg-gray-100">
          <h2 className="font-bold text-lg mb-2">Hirdetés</h2>
          <img
            src="/hirdetes.png"
            alt="Hirdetés"
            className="w-full h-auto rounded"
            />
        </aside>

        {/* Közép oszlop - feed */}
        <main className="flex-1 h-[calc(100vh-200px)] overflow-y-auto flex justify-center">
          <div className="w-full max-w-xl flex flex-col gap-6">
              <PostAccord post={postom} name='Hartwig-Matos Dávid Gábor'/>
          </div>
        </main>

        {/* Jobb oszlop - chat */}
        <aside className="w-[350px]">  {/* border-l-2 border-gray-300 p-4 bg-gray-100 */}
          {/* <h2 className="font-bold text-lg mb-2">Chat</h2>
          <p>Itt lesz a chat ablak tartalma.</p> */}
        </aside>
      </div>
    </div>
    </>
  )
}
