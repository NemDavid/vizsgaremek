import axios from "axios";
import { AdsFrame } from "./AdsFrame";
import { Footer } from "./footer";
import Header from "./Header";
import { PostsFrame } from "./PostsFrame";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";

interface DefaultUIFrameProps {
  children?: React.ReactNode; // Ide jöhet majd az, amit a "ide" helyére akarsz rakni
}

export async function fetchAds() {
  return await axios("https://api.example-ads.com/ads?apikey=YOUR_KEY");
}

export function DefaultUIFrame({ children }: DefaultUIFrameProps){
    // const {data: ads, isLoading} = useQuery({
    //     queryKey: ['Ads'],
    //     queryFn: () => fetchAds(),
    //     retry: 0,
    //     refetchOnWindowFocus: false,
    // })

    // if(isLoading){
    //     return <Spinner/>
    // }
    return (
        <>
            <div className="flex flex-col h-screen">
                <Header/>
                <div className="flex flex-1 bg-white text-black">
                    {/* <FriendList/> */}
                    <div className="flex flex-1 ">
                        <AdsFrame url={"/hirdetes.png"} />
                        {children}
                        <PostsFrame/>
                        <AdsFrame url={"/hirdetes2.png"} />

                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}