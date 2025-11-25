
import { AdsFrame } from "./AdsFrame";
import { Footer } from "./footer";
import Header from "./Header";


export function DefaultUIFrame({ children, Hirdetes, className}: { children?: React.ReactNode , Hirdetes?: boolean, className?: string}) {

    return (
        <div >
            <div className="flex flex-col h-screen">
                <Header/>
                <div className="flex flex-1 bg-white text-black">
                    {/* <FriendList/> */}
                    <div className="flex flex-1 h-full">
                        {Hirdetes? <AdsFrame url={"/hirdetes.png"} /> : null}
                        <div className={`w-full z-1 ${className}`}>
                            {children}

                        </div>
                        {Hirdetes? <AdsFrame url={"/hirdetes2.png"} /> : null}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>

    )
}