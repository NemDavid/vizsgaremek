
import { AdsFrame } from "./AdsFrame";
import { Footer } from "./footer";
import Header from "./Header";
import { PostsFrame } from "./PostsFrame";


export function DefaultUIFrame(){

    return (
        <div >
            <div className="flex flex-col h-screen">
                <Header/>
                <div className="flex flex-1 bg-white text-black">
                    {/* <FriendList/> */}
                    <div className="flex flex-1 h-full">
                        <AdsFrame url={"/hirdetes.png"} />
                        <PostsFrame/>
                        <AdsFrame url={"/hirdetes2.png"} />
                    </div>
                </div>
            </div>
            <Footer/>
        </div>

    )
}