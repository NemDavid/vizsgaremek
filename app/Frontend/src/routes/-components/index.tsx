
import { FriendList } from '@/components/FriendList'
import Header from '@/components/Header'
import { PostAccord } from '@/components/post-according'
import type { Post } from '@/components/post-according'


const postom: Post = {
  USER_ID: 1n,
  like: 1231,
  dislike: 1,
  content: "isten áld meg a magyart",
  title: "fasz",
  media_url: "seggem partja",
  created_at: new Date(),
  updated_at: new Date(),
}

export function MainPage() {
  return (<>
  <Header />
  <div className="flex flex-col bg-white text-black">
    {/* Online barátok */}

      <FriendList/>

    

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
