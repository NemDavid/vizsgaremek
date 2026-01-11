
import { AdsFrame } from "./AdsFrame";
import { DrawerFriends } from "./Drawer-Friends";
import { Footer } from "./footer";
import Header from "./Header";
import { Toaster } from "sonner"

export function DefaultUIFrame({ children, Hirdetes, className}: { children?: React.ReactNode , Hirdetes?: boolean, className?: string}) {

    return (
        <div >
            <div className="flex flex-col h-screen">
                <Header/>
                <div className="flex flex-1 bg-white text-black">
                    <div className="flex flex-1 h-full">
                        {Hirdetes? <AdsFrame url={"/hirdetes.png"} className="border-r-2"/> : null}
                        <div className={`w-full z-1 h-[calc(100vh-84px)] flex flex-col ${className}`}>
                            {children}
                        </div>
                        {Hirdetes? <AdsFrame url={"/hirdetes2.png"} className="border-l-2"/> : null}
                    </div>
                </div>
            </div>
            <DrawerFriends/>
            <Footer/>
            <Toaster richColors position="top-center" />
        </div>

    )
}