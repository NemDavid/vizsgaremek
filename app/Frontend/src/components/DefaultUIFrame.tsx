import { AdsFrame } from "./AdsFrame";
import { Footer } from "./footer";
import Header from "./Header";
import { PostsFrame } from "./PostsFrame";

interface DefaultUIFrameProps {
  children?: React.ReactNode; // Ide jöhet majd az, amit a "ide" helyére akarsz rakni
}

export function DefaultUIFrame({ children }: DefaultUIFrameProps){
    return (
        <>
            <div className="h-screen">
                <Header/>
                <div className="flex flex-col bg-white text-black">
                    {/* <FriendList/> */}
                    <div className="flex flex-1">
                        <AdsFrame/>
                        {children}
                        <PostsFrame/>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}