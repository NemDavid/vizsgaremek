
import { FriendList } from '@/components/FriendList'
import Header from '@/components/Header'
import { PostsFrame } from '@/components/PostsFrame'
import { AdsFrame } from '@/components/AdsFrame'



export function MainPage() {
    return (<>
        <Header />
        <div className="flex flex-col bg-white text-black">
            {/* <FriendList/> */}
            <div className="flex flex-1">
                <AdsFrame/>

                <PostsFrame/>
            </div>
        </div>
        </>
    )
}
